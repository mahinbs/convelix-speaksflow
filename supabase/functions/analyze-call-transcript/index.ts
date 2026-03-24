/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

// Types
interface AIAnalysis {
  analysis: string | null;
  error: string | null;
  leadScore?: number;
  qualificationStatus?: string;
}

interface CallAnalysisRequest {
  transcript: string;
  callId: string;
}

interface AnalysisResult {
  leadScore: number;
  qualificationStatus: 'Hot' | 'Warm' | 'Cold' | 'Unqualified';
  insights: string[];
  followUpActions: string[];
  persuasionStrategies: string[];
  rawAnalysis: string;
}

interface EdgeFunctionError {
  error: string;
  details?: string;
  type: string;
  openAIError?: {
    message: string;
    type: string;
  };
  fallbackError?: {
    message: string;
    type: string;
  };
}

// OpenAI Analyzer
async function getUserOpenAIKey(supabase: ReturnType<typeof createClient>, userId: string): Promise<string> {
  console.log('Getting OpenAI API key for user:', userId);

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', `openai_api_key_${userId}`)
    .single();

  console.log('API key lookup result:', { hasData: !!data, hasError: !!error });

  if (error) {
    console.error('Error fetching OpenAI API key:', error);
    throw new Error('Failed to fetch OpenAI API key: ' + error.message);
  }

  if (!data?.value) {
    console.error('No API key found for user');
    throw new Error('OpenAI API key not configured for this user');
  }

  if (!data.value.startsWith('sk-')) {
    console.error('Invalid API key format');
    throw new Error('Invalid OpenAI API key format');
  }

  console.log('Successfully retrieved valid API key');
  return data.value;
}

async function analyzeWithOpenAI(transcript: string, userId: string): Promise<AIAnalysis> {
  try {
    console.log('Starting OpenAI analysis for user:', userId);
    console.log('Transcript length:', transcript.length);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's OpenAI API key
    const openAIApiKey = await getUserOpenAIKey(supabase, userId);

    // Use the user's API key for OpenAI requests
    console.log('Making OpenAI API request...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert at analyzing sales call transcripts and determining lead quality. 
Always return your analysis in valid JSON format with the following fields:
{
  "leadScore": number (0-100),
  "qualificationStatus": "Hot" | "Warm" | "Cold" | "Unqualified",
  "sentiment": "Positive" | "Neutral" | "Negative",
  "detailedSummary": string (2-3 paragraphs summarizing the conversation),
  "keyInsights": string[],
  "followUpActions": string[],
  "persuasionStrategy": string (2-3 sentences on recommended approach),
  "psychologyProfile": string (2-3 sentences on lead's psychology),
  "communicationStyle": string (1-2 sentences on lead's communication style),
  "objections": string[] (list of objections raised),
  "objectionHandling": string[] (list of strategies to handle objections),
  "persuasionTactics": string[] (list of effective tactics for this lead),
  "interestLevel": number (0-10),
  "decisionAuthority": "High" | "Medium" | "Low" | "Unknown",
  "timeline": string (when they plan to make a decision),
  "nextBestAction": string (specific next step to take)
}`
          },
          {
            role: 'user',
            content: `Analyze this sales call transcript and provide a detailed analysis in the specified JSON format.

Transcript:
${transcript}`
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent JSON output
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to analyze transcript with OpenAI');
    }

    console.log('Successfully received OpenAI response');
    const data = await response.json();
    const analysis = data.choices[0].message.content;
    console.log('Raw OpenAI analysis:', analysis);

    // Try to parse the analysis
    try {
      // Handle markdown-wrapped JSON responses from OpenAI
      let cleanedAnalysis = analysis;
      if (analysis.includes('```json')) {
        // Extract JSON from markdown code blocks
        const jsonMatch = analysis.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          cleanedAnalysis = jsonMatch[1];
        }
      } else if (analysis.includes('```')) {
        // Handle generic code blocks
        const codeMatch = analysis.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch) {
          cleanedAnalysis = codeMatch[1];
        }
      }

      const parsedAnalysis = JSON.parse(cleanedAnalysis);
      console.log('Successfully parsed OpenAI analysis:', parsedAnalysis);

      // Validate required fields
      if (typeof parsedAnalysis.leadScore !== 'number' || !parsedAnalysis.qualificationStatus) {
        throw new Error('Missing required fields in OpenAI response');
      }

      return {
        analysis: JSON.stringify(parsedAnalysis, null, 2),
        error: null,
        leadScore: parsedAnalysis.leadScore,
        qualificationStatus: parsedAnalysis.qualificationStatus
      };
    } catch (parseError) {
      console.error('Error parsing OpenAI analysis:', parseError);
      throw new Error('Failed to parse OpenAI response: ' + parseError.message);
    }
  } catch (error) {
    console.error('Error in OpenAI analysis:', error);
    throw error; // Let the main handler decide whether to use fallback
  }
}

// Fallback Analyzer
async function analyzeWithFallback(transcript: string): Promise<AIAnalysis> {
  // Basic sentiment analysis
  const positiveWords = ['interested', 'yes', 'good', 'great', 'awesome', 'definitely', 'agree', 'like', 'want', 'need'];
  const negativeWords = ['no', 'not', "don't", 'expensive', 'busy', 'later', 'maybe', 'unsure', 'think', 'probably'];

  const words = transcript.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });

  // Basic lead scoring
  const score = Math.min(100, Math.max(0, Math.round((positiveCount / (positiveCount + negativeCount)) * 100))) || 50;

  // Basic qualification status
  let status = 'Unqualified';
  if (score >= 80) status = 'Hot';
  else if (score >= 60) status = 'Warm';
  else if (score >= 40) status = 'Cold';

  // Basic sentiment
  let sentiment = 'Neutral';
  if (positiveCount > negativeCount * 2) sentiment = 'Positive';
  else if (negativeCount > positiveCount * 2) sentiment = 'Negative';

  // Calculate interest level (0-10)
  const interestLevel = Math.round((score / 100) * 10);

  // Generate basic analysis
  const analysis = {
    leadScore: score,
    qualificationStatus: status,
    sentiment: sentiment,
    detailedSummary: `Basic sentiment analysis performed. Found ${positiveCount} positive indicators and ${negativeCount} negative indicators. The lead shows ${status.toLowerCase()} potential based on keyword analysis.`,
    keyInsights: [
      `Found ${positiveCount} positive indicators`,
      `Found ${negativeCount} negative indicators`,
      `Overall sentiment is ${sentiment.toLowerCase()}`
    ],
    followUpActions: [
      'Schedule follow-up call',
      'Send additional information',
      'Document key points discussed'
    ],
    persuasionStrategy: 'Focus on building value and addressing common objections while maintaining professional engagement.',
    psychologyProfile: 'Basic analysis based on keyword frequency. Further interaction needed for detailed psychological assessment.',
    communicationStyle: 'Standard professional communication recommended until more detailed analysis is available.',
    objections: [
      'No specific objections identified - basic analysis only'
    ],
    objectionHandling: [
      'Address common industry objections',
      'Focus on value proposition',
      'Highlight unique selling points'
    ],
    persuasionTactics: [
      'Build rapport and trust',
      'Focus on benefits over features',
      'Use social proof when available'
    ],
    interestLevel: interestLevel,
    decisionAuthority: 'Unknown - Basic analysis cannot determine authority level',
    timeline: 'Not specified in conversation',
    nextBestAction: 'Schedule follow-up call to gather more information'
  };

  return {
    analysis: JSON.stringify(analysis, null, 2),
    error: null,
    leadScore: score,
    qualificationStatus: status
  };
}

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Main Edge Function
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Starting analyze-call-transcript function');

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body:', requestBody);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({
          error: 'Invalid request body',
          details: error.message,
          type: 'REQUEST_PARSING_ERROR'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { transcript, callId } = requestBody;

    // Validate required fields
    if (!transcript) {
      console.error('No transcript provided');
      return new Response(
        JSON.stringify({
          error: 'No transcript provided',
          type: 'VALIDATION_ERROR'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!callId) {
      console.error('No callId provided');
      return new Response(
        JSON.stringify({
          error: 'No callId provided',
          type: 'VALIDATION_ERROR'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Processing call:', callId);
    console.log('Transcript length:', transcript.length);

    // Create Supabase client
    let supabase;
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase environment variables');
      }

      supabase = createClient(supabaseUrl, supabaseServiceKey);
      console.log('Supabase client created successfully');
    } catch (error) {
      console.error('Error creating Supabase client:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to initialize Supabase client',
          details: error.message,
          type: 'SUPABASE_INIT_ERROR'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get the call details to get the user ID
    let callData;
    try {
      console.log('Fetching call details');
      const { data, error } = await supabase
        .from('bland_ai_calls')
        .select('user_id')
        .eq('id', callId)
        .single();

      if (error) {
        console.error('Error fetching call details:', error);
        return new Response(
          JSON.stringify({
            error: 'Failed to get call details',
            details: error.message,
            type: 'DATABASE_ERROR'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      if (!data) {
        console.error('Call not found:', callId);
        return new Response(
          JSON.stringify({
            error: 'Call not found',
            type: 'NOT_FOUND_ERROR'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      callData = data;
      console.log('Call belongs to user:', callData.user_id);
    } catch (error) {
      console.error('Error in call details lookup:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to lookup call details',
          details: error.message,
          type: 'DATABASE_ERROR'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    let finalAnalysis;
    let analyzerUsed;
    let openAIError = null;

    try {
      // Try OpenAI analysis first
      console.log('Attempting OpenAI analysis');
      const openAIResult = await analyzeWithOpenAI(transcript, callData.user_id);
      finalAnalysis = openAIResult;
      analyzerUsed = 'openai';
      console.log('OpenAI analysis successful');
    } catch (error) {
      // Log detailed OpenAI error
      console.error('OpenAI analysis failed:', {
        error: error,
        message: error.message,
        stack: error.stack
      });
      openAIError = error;

      // If OpenAI fails, use fallback analyzer
      try {
        console.log('Using fallback analyzer');
        const fallbackResult = await analyzeWithFallback(transcript);
        finalAnalysis = fallbackResult;
        analyzerUsed = 'fallback';
        console.log('Fallback analysis complete');
      } catch (fallbackError) {
        console.error('Fallback analyzer failed:', fallbackError);
        return new Response(
          JSON.stringify({
            error: 'Both OpenAI and fallback analysis failed',
            openAIError: {
              message: openAIError.message,
              type: openAIError.name
            },
            fallbackError: {
              message: fallbackError.message,
              type: fallbackError.name
            },
            type: 'ANALYSIS_ERROR'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    // Parse the analysis to get the full object
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(finalAnalysis.analysis);
      console.log('Successfully parsed analysis result');
    } catch (error) {
      console.error('Error parsing analysis:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to parse analysis result',
          details: error.message,
          type: 'PARSING_ERROR'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Add analyzer info and errors to the analysis
    parsedAnalysis.analyzerUsed = analyzerUsed;
    if (openAIError) {
      parsedAnalysis.openAIError = {
        message: openAIError.message,
        type: openAIError.name
      };
    }

    // Update the call record
    try {
      console.log('Updating call record with analysis');
      const { error: updateError } = await supabase
        .from('bland_ai_calls')
        .update({
          ai_analysis: parsedAnalysis,
          lead_score: parsedAnalysis.leadScore,
          qualification_status: parsedAnalysis.qualificationStatus,
          analyzer_used: analyzerUsed,
          updated_at: new Date().toISOString()
        })
        .eq('id', callId);

      if (updateError) {
        console.error('Error updating call record:', updateError);
        return new Response(
          JSON.stringify({
            error: 'Failed to update call record',
            details: updateError.message,
            type: 'DATABASE_ERROR',
            analysis: parsedAnalysis // Return analysis even if update fails
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      console.log('Successfully updated call record');
    } catch (error) {
      console.error('Error in database update:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to update database',
          details: error.message,
          type: 'DATABASE_ERROR',
          analysis: parsedAnalysis // Return analysis even if update fails
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: parsedAnalysis,
        leadScore: parsedAnalysis.leadScore,
        qualificationStatus: parsedAnalysis.qualificationStatus,
        analyzerUsed: analyzerUsed,
        openAIError: openAIError ? {
          message: openAIError.message,
          type: openAIError.name
        } : null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    // Log the full error details
    console.error('Fatal error in analyze-call-transcript:', {
      error: error,
      message: error.message,
      stack: error.stack
    });

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message,
        type: error.name || 'UNKNOWN_ERROR',
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
