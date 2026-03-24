
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCreateBlandAICall, useUpdateBlandAICall } from '@/hooks/useBlandAICalls';
import { useUpdateLead } from '@/hooks/useLeads';
import { BlandAIClient } from '@/integrations/bland-ai/client';
import type { Lead } from '@/hooks/useLeads';
import type { BlandAICampaign } from '@/hooks/useBlandAICampaigns';

export const useCallHandling = (leads: Lead[], campaigns: BlandAICampaign[]) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const createCall = useCreateBlandAICall();
  const updateLead = useUpdateLead();
  const { toast } = useToast();
  const updateBlandAICall = useUpdateBlandAICall();

  const handleCallWithBlandAI = async (leadIds: string[]) => {
    if (!selectedCampaign) {
      toast({
        title: "Error",
        description: "Please select a campaign",
        variant: "destructive",
      });
      return;
    }

    const campaign = campaigns.find(c => c.id === selectedCampaign);
    if (!campaign) return;

    try {
      setIsLoading(true);

      for (const leadId of leadIds) {
        const lead = leads.find(l => l.id === leadId);
        if (!lead?.phone) continue;

        try {
          const callRecord = await createCall.mutateAsync({
            lead_id: leadId,
            campaign_id: selectedCampaign,
            phone_number: lead.phone,
            status: 'pending',
            bland_call_id: null,
            duration: null,
            transcript: null,
            summary: null,
            outcome: null,
            recording_url: null,
            call_data: null,
            started_at: null,
            completed_at: null,
          });

          const blandAI = new BlandAIClient();
          const callResult = await blandAI.makeCall(lead.phone, campaign.ai_prompt, {
            voice: campaign.voice_id || 'maya',
            campaign_id: selectedCampaign,
            lead_id: leadId,
            max_duration: 30,
            record: true,
            wait_for_greeting: true,
          });

          if (callResult?.call_id) {
            await updateBlandAICall.mutateAsync({
              id: callRecord.id,
              updates: {
                bland_call_id: callResult.call_id,
                call_data: callResult,
                status: callResult.status === 'success' ? 'queued' : 'failed'
              }
            });
          }

          await updateLead.mutateAsync({
            id: leadId,
            updates: { status: 'contacted', last_contact_at: new Date().toISOString() }
          });

          if (leadIds.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 11000));
          }
        } catch (error) {
          console.error(`Error processing lead ${leadId}:`, error);
          continue;
        }
      }

      toast({
        title: "Success",
        description: `Started Convelix AI calls for ${leadIds.length} leads`,
      });

      return true;
    } catch (error) {
      console.error('Error making Convelix AI calls:', error);
      toast({
        title: "Error",
        description: "Failed to start Convelix AI calls",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedCampaign,
    setSelectedCampaign,
    isLoading,
    handleCallWithBlandAI
  };
};
