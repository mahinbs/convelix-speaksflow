import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface BlandAICall {
  id: string;
  user_id: string;
  lead_id: string | null;
  campaign_id: string | null;
  bland_call_id: string | null;
  phone_number: string;
  status: string;
  duration: number | null;
  transcript: string | null;
  summary: string | null;
  outcome: string | null;
  recording_url: string | null;
  call_data: any;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  ai_analysis: any;
  lead_score: number | null;
  qualification_status: string | null;
}

export const useBlandAICalls = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bland_ai_calls', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bland_ai_calls')
        .select('id, user_id, lead_id, campaign_id, bland_call_id, phone_number, status, duration, transcript, summary, outcome, recording_url, started_at, completed_at, created_at, updated_at, ai_analysis, lead_score, qualification_status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process the data to optimize rendering
      const processedData = data.map(call => {
        // Only parse AI analysis if it's a string and we need it for display
        if (call.ai_analysis && typeof call.ai_analysis === 'string' && call.status === 'completed') {
          try {
            // Store only essential fields to reduce memory usage
            const parsedAnalysis = JSON.parse(call.ai_analysis);
            call.ai_analysis = {
              leadScore: parsedAnalysis.leadScore || 0,
              qualificationStatus: parsedAnalysis.qualificationStatus || 'Unqualified',
              sentiment: parsedAnalysis.sentiment || 'Neutral',
              interestLevel: parsedAnalysis.interestLevel || 0,
              keyInsights: parsedAnalysis.keyInsights || [],
              nextBestAction: parsedAnalysis.nextBestAction || '',
              analyzerUsed: parsedAnalysis.analyzerUsed || 'unknown'
            };
          } catch (e) {
            console.error('Error parsing AI analysis:', e);
            call.ai_analysis = null;
          }
        }
        return call;
      });
      
      return processedData as BlandAICall[];
    },
    enabled: !!user,
    refetchInterval: 10000, // Reduced from 5000 to 10000 to decrease load
    refetchIntervalInBackground: false, // Only refetch when tab is active
    staleTime: 30000, // Cache data for 30 seconds
  });
};

export const useCreateBlandAICall = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (callData: Omit<BlandAICall, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'ai_analysis' | 'lead_score' | 'qualification_status'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bland_ai_calls')
        .insert([{
          ...callData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });
    },
  });
};

export const useUpdateBlandAICall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlandAICall> }) => {
      const { data, error } = await supabase
        .from('bland_ai_calls')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });
    },
  });
};

export const useSyncBlandAICalls = () => {
  const queryClient = useQueryClient();
  const updateBlandAICall = useUpdateBlandAICall();
  const { user } = useAuth();

  const updateCampaignMetrics = async (campaignId: string) => {
    if (!campaignId) return;

    try {
      // Get all calls for this campaign
      const { data: campaignCalls, error: callsError } = await supabase
        .from('bland_ai_calls')
        .select('*')
        .eq('campaign_id', campaignId);

      if (callsError) throw callsError;

      // Calculate metrics
      const totalCalls = campaignCalls.length;
      const completedCalls = campaignCalls.filter(call => call.status === 'completed').length;
      const successfulCalls = campaignCalls.filter(call => call.outcome === 'success').length;

      // Update campaign metrics
      const { error: updateError } = await supabase
        .from('bland_ai_campaigns')
        .update({
          total_leads: totalCalls,
          completed_calls: completedCalls,
          successful_calls: successfulCalls,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      if (updateError) throw updateError;

      // Invalidate campaign queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
    } catch (error) {
      console.error('Error updating campaign metrics:', error);
    }
  };

  const triggerAIAnalysis = async (callId: string, transcript: string) => {
    try {
      console.log(`Triggering AI analysis for call ${callId}`);

      // First update the call to indicate analysis is in progress
      await supabase
        .from('bland_ai_calls')
        .update({
          ai_analysis: null,  // Clear any existing analysis
          lead_score: null,
          qualification_status: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', callId);

      // Invalidate queries to show analysis is in progress
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });

      const { error } = await supabase.functions.invoke('analyze-call-transcript', {
        body: {
          callId,
          transcript
        }
      });

      if (error) throw error;

      console.log(`AI analysis triggered successfully for call ${callId}`);

      // Invalidate queries to refresh the UI with new analysis
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });

      // Start polling for updates
      const pollInterval = setInterval(async () => {
        const { data: call } = await supabase
          .from('bland_ai_calls')
          .select('ai_analysis, lead_score, qualification_status')
          .eq('id', callId)
          .single();

        if (call?.ai_analysis) {
          clearInterval(pollInterval);
          queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });
        }
      }, 2000);

      // Stop polling after 30 seconds
      setTimeout(() => clearInterval(pollInterval), 30000);
    } catch (error) {
      console.error(`Error triggering AI analysis for call ${callId}:`, error);
    }
  };

  const syncCallStatuses = async () => {
    if (!user) return;

    try {
      // Get pending/in-progress calls from our database
      const { data: pendingCalls, error } = await supabase
        .from('bland_ai_calls')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['pending', 'in_progress', 'queued'])
        .not('bland_call_id', 'is', null);

      if (error || !pendingCalls?.length) {
        // Also check for completed calls without analysis
        await analyzeCompletedCallsWithoutAnalysis();
        return;
      }

      const blandAI = new (await import('@/integrations/bland-ai/client')).BlandAIClient();

      // Keep track of campaigns that need metrics updates
      const campaignsToUpdate = new Set<string>();

      // Update each pending call
      for (const call of pendingCalls) {
        if (!call.bland_call_id) continue;

        try {
          const blandCallData = await blandAI.getCallStatus(call.bland_call_id);

          // Map Bland AI status to our status
          let newStatus = call.status;
          let duration = call.duration;
          let transcript = call.transcript;
          let summary = call.summary;
          let outcome = call.outcome;
          let recordingUrl = call.recording_url;
          let completedAt = call.completed_at;

          if (blandCallData.queue_status === 'started' && call.status === 'pending') {
            newStatus = 'in_progress';
          } else if (blandCallData.completed || blandCallData.queue_status === 'complete') {
            newStatus = 'completed';
            duration = blandCallData.call_length ? Math.round(blandCallData.call_length * 60) : null;
            transcript = blandCallData.concatenated_transcript || null;
            summary = blandCallData.summary || null;
            recordingUrl = blandCallData.recording_url || null;
            completedAt = blandCallData.ended_at || new Date().toISOString();

            // Determine outcome based on call data
            if (blandCallData.answered_by === 'human' && duration && duration > 30) {
              outcome = 'success';
            } else if (blandCallData.answered_by === 'voicemail') {
              outcome = 'voicemail';
            } else if (blandCallData.answered_by === 'no-answer') {
              outcome = 'no_answer';
            } else {
              outcome = 'failed';
            }

            // Add campaign to update list if call is completed
            if (call.campaign_id) {
              campaignsToUpdate.add(call.campaign_id);
            }
          } else if (blandCallData.error_message) {
            newStatus = 'failed';
            outcome = 'failed';

            // Add campaign to update list if call is failed
            if (call.campaign_id) {
              campaignsToUpdate.add(call.campaign_id);
            }
          }

          // Update if status has changed
          if (newStatus !== call.status || duration !== call.duration) {
            await updateBlandAICall.mutateAsync({
              id: call.id,
              updates: {
                status: newStatus,
                duration,
                transcript,
                summary,
                outcome,
                recording_url: recordingUrl,
                completed_at: completedAt,
                call_data: blandCallData
              }
            });

            // Trigger AI analysis if call is completed and has transcript
            if (newStatus === 'completed' && transcript && !call.ai_analysis) {
              await triggerAIAnalysis(call.id, transcript);
            }
          }
        } catch (error) {
          console.error(`Error syncing call ${call.id}:`, error);
        }
      }

      // Update metrics for all affected campaigns
      for (const campaignId of campaignsToUpdate) {
        await updateCampaignMetrics(campaignId);
      }

      // Check for completed calls without analysis
      await analyzeCompletedCallsWithoutAnalysis();
    } catch (error) {
      console.error('Error syncing call statuses:', error);
    }
  };

  const analyzeCompletedCallsWithoutAnalysis = async () => {
    if (!user) return;

    try {
      // Get completed calls without AI analysis
      const { data: callsNeedingAnalysis, error } = await supabase
        .from('bland_ai_calls')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .is('ai_analysis', null)
        .not('transcript', 'is', null);

      if (error || !callsNeedingAnalysis?.length) return;

      console.log(`Found ${callsNeedingAnalysis.length} completed calls needing analysis`);

      // Trigger analysis for each call
      for (const call of callsNeedingAnalysis) {
        if (call.transcript) {
          await triggerAIAnalysis(call.id, call.transcript);
        }
      }
    } catch (error) {
      console.error('Error analyzing completed calls without analysis:', error);
    }
  };

  return { syncCallStatuses };
};

// Background sync hook
export const useBlandAICallsSync = () => {
  const { syncCallStatuses } = useSyncBlandAICalls();

  React.useEffect(() => {
    // Initial sync
    syncCallStatuses();

    // Set up interval to sync every 30 seconds
    const interval = setInterval(syncCallStatuses, 30000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export const useTriggerAIAnalysis = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const triggerAnalysis = async (callId: string, transcript: string) => {
    try {
      console.log(`Triggering AI analysis for call ${callId}`);

      // First update the call to indicate analysis is in progress
      const { error: updateError } = await supabase
        .from('bland_ai_calls')
        .update({
          ai_analysis: null,  // Clear any existing analysis
          lead_score: null,
          qualification_status: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', callId);

      if (updateError) {
        console.error('Error updating call status:', updateError);
        toast({
          title: 'Error',
          description: 'Failed to start analysis. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Invalidate queries to show analysis is in progress
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });

      const { data, error } = await supabase.functions.invoke('analyze-call-transcript', {
        body: {
          callId,
          transcript
        }
      });

      if (error) {
        console.error('Edge Function error:', error);
        let errorMessage = 'Failed to analyze call.';
        let errorDetails = '';

        // Try to extract more detailed error information
        if (error.message) {
          try {
            const errorData = JSON.parse(error.message);
            
            // Handle specific error types
            switch (errorData.type) {
              case 'VALIDATION_ERROR':
                errorMessage = errorData.error;
                break;
              case 'SUPABASE_INIT_ERROR':
                errorMessage = 'Failed to initialize analysis service.';
                errorDetails = 'Please try again later.';
                break;
              case 'DATABASE_ERROR':
                errorMessage = 'Database error occurred.';
                errorDetails = 'Please try again later.';
                break;
              case 'ANALYSIS_ERROR':
                if (errorData.openAIError?.message?.includes('API key')) {
                  errorMessage = 'OpenAI API key error.';
                  errorDetails = 'Please check your OpenAI API key in settings.';
                } else {
                  errorMessage = 'Analysis failed.';
                  errorDetails = errorData.openAIError?.message || 'Both primary and fallback analysis failed.';
                }
                break;
              case 'PARSING_ERROR':
                errorMessage = 'Failed to process analysis results.';
                errorDetails = 'Please try again.';
                break;
              default:
                errorMessage = errorData.error || 'Unknown error occurred.';
                errorDetails = errorData.details || 'Please try again later.';
            }
          } catch (parseError) {
            // If error message isn't JSON, use raw message
            if (error.message.includes('OpenAI API key not configured')) {
              errorMessage = 'OpenAI API key not configured.';
              errorDetails = 'Please configure it in settings.';
            } else if (error.message.includes('Invalid OpenAI API key')) {
              errorMessage = 'Invalid OpenAI API key format.';
              errorDetails = 'Please check your settings.';
            } else {
              errorDetails = error.message;
            }
          }
        }

        toast({
          title: 'Analysis Failed',
          description: errorDetails ? `${errorMessage} ${errorDetails}` : errorMessage,
          variant: 'destructive',
        });
        throw error;
      }

      console.log(`AI analysis triggered successfully for call ${callId}`, data);

      // Check if analysis was done with fallback
      if (data?.analyzerUsed === 'fallback') {
        toast({
          title: 'Basic Analysis',
          description: 'Using basic analyzer due to OpenAI configuration issues.',
          variant: 'warning',
        });
      } else {
        toast({
          title: 'Analysis Started',
          description: 'The call is being analyzed. Results will appear shortly.',
        });
      }

      // Invalidate queries to refresh the UI with new analysis
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });

      // Start polling for updates
      const pollInterval = setInterval(async () => {
        const { data: call, error: pollError } = await supabase
          .from('bland_ai_calls')
          .select('ai_analysis, lead_score, qualification_status')
          .eq('id', callId)
          .single();

        if (pollError) {
          console.error('Error polling for analysis:', pollError);
          clearInterval(pollInterval);
          return;
        }

        if (call?.ai_analysis) {
          clearInterval(pollInterval);
          queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });

          // Show completion toast with analyzer info and any OpenAI errors
          const analyzerType = call.ai_analysis.analyzerUsed === 'openai' ? 'OpenAI' : 'Basic Analyzer';
          let description = `Analysis completed using ${analyzerType}`;
          
          if (call.ai_analysis.openAIError) {
            description += `. Note: OpenAI analysis failed (${call.ai_analysis.openAIError.message})`;
          }

          toast({
            title: 'Analysis Complete',
            description,
            variant: call.ai_analysis.analyzerUsed === 'openai' ? 'default' : 'warning',
          });
        }
      }, 2000);

      // Stop polling after 30 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        // Check if analysis is still not complete
        supabase
          .from('bland_ai_calls')
          .select('ai_analysis')
          .eq('id', callId)
          .single()
          .then(({ data: finalCheck }) => {
            if (!finalCheck?.ai_analysis) {
              toast({
                title: 'Analysis Timeout',
                description: 'Analysis is taking longer than expected. Please try again.',
                variant: 'destructive',
              });
            }
          });
      }, 30000);
    } catch (error) {
      console.error(`Error triggering AI analysis for call ${callId}:`, error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to analyze call. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return triggerAnalysis;
};
