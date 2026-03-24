import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface BlandAICampaign {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  ai_prompt: string;
  voice_id: string | null;
  status: string;
  total_leads: number | null;
  completed_calls: number | null;
  successful_calls: number | null;
  campaign_data: any;
  created_at: string;
  updated_at: string;
}

export const useBlandAICampaigns = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bland_ai_campaigns', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bland_ai_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BlandAICampaign[];
    },
    enabled: !!user,
  });
};

export const useCreateBlandAICampaign = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (campaignData: Omit<BlandAICampaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('bland_ai_campaigns')
        .insert([{
          ...campaignData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
    },
  });
};

export const useUpdateBlandAICampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlandAICampaign> }) => {
      const { data, error } = await supabase
        .from('bland_ai_campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
    },
  });
};

export const useDeleteBlandAICampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // First, update all related records to remove the campaign reference
      // Update calls to set campaign_id to NULL
      const { error: callsError } = await supabase
        .from('bland_ai_calls')
        .update({ campaign_id: null })
        .eq('campaign_id', id);

      if (callsError) {
        console.error('Error updating calls:', callsError);
        // Continue anyway, the campaign deletion might still work
      }

      // Update leads to set campaign_id to NULL
      const { error: leadsError } = await supabase
        .from('leads')
        .update({ campaign_id: null })
        .eq('campaign_id', id);

      if (leadsError) {
        console.error('Error updating leads:', leadsError);
        // Continue anyway, the campaign deletion might still work
      }

      // Now delete the campaign
      const { error } = await supabase
        .from('bland_ai_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['bland_ai_calls'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useUpdateCampaignMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      totalLeads = null,
      completedCalls = null,
      successfulCalls = null
    }: {
      campaignId: string;
      totalLeads?: number | null;
      completedCalls?: number | null;
      successfulCalls?: number | null;
    }) => {
      const updates: Record<string, any> = {};

      // Only include fields that are provided
      if (totalLeads !== null) updates.total_leads = totalLeads;
      if (completedCalls !== null) updates.completed_calls = completedCalls;
      if (successfulCalls !== null) updates.successful_calls = successfulCalls;

      const { data, error } = await supabase
        .from('bland_ai_campaigns')
        .update(updates)
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
    },
  });
};

export const useRecalculateCampaignMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId?: string) => {
      // If no specific campaign ID is provided, update all campaigns
      let query = supabase.from('bland_ai_campaigns').select('id');

      if (campaignId) {
        query = query.eq('id', campaignId);
      }

      const { data: campaigns, error: campaignError } = await query;

      if (campaignError) throw campaignError;

      const campaignIds = campaigns.map(c => c.id);

      for (const id of campaignIds) {
        try {
          // Get all leads for this campaign
          const { data: campaignLeads, error: leadsError } = await supabase
            .from('leads')
            .select('*')
            .eq('campaign_id', id);

          if (leadsError) throw leadsError;

          // Get all calls for this campaign
          const { data: campaignCalls, error: callsError } = await supabase
            .from('bland_ai_calls')
            .select('*')
            .eq('campaign_id', id);

          if (callsError) throw callsError;

          // Calculate metrics
          const totalLeads = campaignLeads?.length || 0;
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
            .eq('id', id);

          if (updateError) throw updateError;
        } catch (error) {
          console.error(`Error updating metrics for campaign ${id}:`, error);
        }
      }

      return { updated: campaignIds.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bland_ai_campaigns'] });
    },
  });
};
