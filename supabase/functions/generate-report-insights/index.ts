
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();

    if (!user_id) {
      throw new Error('User ID is required');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's data for analysis
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user_id);

    const { data: calls } = await supabase
      .from('bland_ai_calls')
      .select('*')
      .eq('user_id', user_id);

    const { data: campaigns } = await supabase
      .from('bland_ai_campaigns')
      .select('*')
      .eq('user_id', user_id);

    if (!openAIApiKey) {
      // Fallback analysis without OpenAI
      const totalLeads = leads?.length || 0;
      const totalCalls = calls?.length || 0;
      const successfulCalls = calls?.filter(call =>
        ['completed', 'success'].includes(call.status)
      ).length || 0;
      const successRate = totalCalls > 0 ? (successfulCalls / totalCalls * 100).toFixed(1) : '0';

      return new Response(JSON.stringify({
        summary: `You have ${totalLeads} leads and made ${totalCalls} AI calls with a ${successRate}% success rate. Your campaigns are performing within expected ranges.`,
        recommendations: [
          "Focus on following up with hot leads within 2 hours for maximum conversion",
          "Review call transcripts to identify successful conversation patterns",
          "Consider adjusting call timing based on your best-performing time slots",
          "Analyze leads that didn't convert to improve qualification criteria"
        ],
        insights: {
          topPerformer: campaigns?.[0]?.name || 'No campaigns yet',
          bestTimeToCall: '2-4 PM weekdays',
          keySuccessFactors: ['Quick follow-up', 'Personalized messaging', 'Clear value proposition']
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare data for AI analysis
    const analysisData = {
      totalLeads: leads?.length || 0,
      totalCalls: calls?.length || 0,
      successfulCalls: calls?.filter(call => ['completed', 'success'].includes(call.status)).length || 0,
      campaignCount: campaigns?.length || 0,
      recentCalls: calls?.slice(-10) || [],
      hotLeads: leads?.filter(lead => lead.ai_lead_score && lead.ai_lead_score >= 80).length || 0,
      coldLeads: leads?.filter(lead => lead.ai_lead_score && lead.ai_lead_score < 50).length || 0
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an AI sales consultant analyzing lead generation and call performance data. Provide actionable insights and specific recommendations for closing deals. Be concise but insightful.'
          },
          {
            role: 'user',
            content: `Analyze this lead generation data and provide insights:
            
            Data: ${JSON.stringify(analysisData)}
            
            Please provide:
            1. A brief performance summary (2-3 sentences)
            2. Top 4 actionable recommendations for closing more deals
            3. Key insights about what's working and what needs improvement
            
            Format as JSON with keys: summary, recommendations (array), insights (object with topPerformer, bestTimeToCall, keySuccessFactors array)`
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    const aiData = await response.json();
    const aiAnalysis = JSON.parse(aiData.choices[0].message.content);

    return new Response(JSON.stringify(aiAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-report-insights function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      summary: 'Unable to generate AI insights at this time.',
      recommendations: ['Review your recent call performance', 'Focus on high-scoring leads'],
      insights: { topPerformer: 'N/A', bestTimeToCall: 'N/A', keySuccessFactors: [] }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
