import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BlandAILead {
  id: string;
  user_id: string;
  campaign_id: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  source: string;
  company: string | null;
  job_title: string | null;
  lead_data: any;
  ai_lead_score: number | null;
  ai_insights: any;
  last_analysis_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useBlandAILeads = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bland_ai_leads', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the database result to our interface
      return data.map(lead => ({
        id: lead.id,
        user_id: lead.user_id,
        campaign_id: lead.campaign_id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        status: lead.status || 'new',
        source: lead.source,
        company: lead.company,
        job_title: lead.job_title,
        lead_data: lead.lead_data,
        ai_lead_score: lead.ai_lead_score,
        ai_insights: lead.ai_insights,
        last_analysis_at: lead.last_analysis_at,
        created_at: lead.created_at,
        updated_at: lead.updated_at,
      })) as BlandAILead[];
    },
    enabled: !!user,
  });
};

export const useCreateBlandAILead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const updateCampaignMetrics = async (campaignId: string) => {
    if (!campaignId) return;

    try {
      // Get all leads for this campaign
      const { data: campaignLeads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('campaign_id', campaignId);

      if (leadsError) throw leadsError;

      // Get all calls for this campaign
      const { data: campaignCalls, error: callsError } = await supabase
        .from('bland_ai_calls')
        .select('*')
        .eq('campaign_id', campaignId);

      if (callsError) throw callsError;

      // Calculate metrics
      const totalLeads = campaignLeads.length;
      const completedCalls = campaignCalls?.filter(call => call.status === 'completed').length || 0;
      const successfulCalls = campaignCalls?.filter(call => call.outcome === 'success').length || 0;

      // Update campaign metrics
      const { error: updateError } = await supabase
        .from('bland_ai_campaigns')
        .update({
          total_leads: totalLeads,
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

  return useMutation({
    mutationFn: async (leadData: Omit<BlandAILead, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'ai_lead_score' | 'ai_insights' | 'last_analysis_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('leads')
        .insert([{
          user_id: user.id,
          campaign_id: leadData.campaign_id,
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
          status: leadData.status,
          source: leadData.source || 'manual',
          company: leadData.company,
          job_title: leadData.job_title,
          lead_data: leadData.lead_data,
        }])
        .select()
        .single();

      if (error) throw error;

      // Update campaign metrics if lead is associated with a campaign
      if (leadData.campaign_id) {
        await updateCampaignMetrics(leadData.campaign_id);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useUpdateBlandAILead = () => {
  const queryClient = useQueryClient();

  const updateCampaignMetrics = async (campaignId: string) => {
    if (!campaignId) return;

    try {
      // Get all leads for this campaign
      const { data: campaignLeads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('campaign_id', campaignId);

      if (leadsError) throw leadsError;

      // Get all calls for this campaign
      const { data: campaignCalls, error: callsError } = await supabase
        .from('bland_ai_calls')
        .select('*')
        .eq('campaign_id', campaignId);

      if (callsError) throw callsError;

      // Calculate metrics
      const totalLeads = campaignLeads.length;
      const completedCalls = campaignCalls?.filter(call => call.status === 'completed').length || 0;
      const successfulCalls = campaignCalls?.filter(call => call.outcome === 'success').length || 0;

      // Update campaign metrics
      const { error: updateError } = await supabase
        .from('bland_ai_campaigns')
        .update({
          total_leads: totalLeads,
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

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlandAILead> }) => {
      const { data: currentLead, error: fetchError } = await supabase
        .from('leads')
        .select('campaign_id')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update campaign metrics if campaign_id is being updated
      if ('campaign_id' in updates) {
        // Update metrics for both old and new campaign
        const oldCampaignId = currentLead?.campaign_id;
        const newCampaignId = updates.campaign_id;

        if (oldCampaignId) await updateCampaignMetrics(oldCampaignId);
        if (newCampaignId) await updateCampaignMetrics(newCampaignId);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
