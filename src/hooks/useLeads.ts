import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  source: string;
  source_id: string | null;
  campaign_id: string | null;
  lead_data: any;
  score: number | null;
  status: string | null;
  priority: string | null;
  created_at: string;
  updated_at: string;
  last_contact_at: string | null;
}

export interface LeadSource {
  id: string;
  source_type: string;
  source_name: string;
  is_active: boolean | null;
  api_config: any;
  webhook_url: string | null;
  total_leads: number | null;
  last_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

interface DateRange {
  from: Date;
  to: Date;
}

const isValidDateRange = (from: Date, to: Date): boolean => {
  // Convert both dates to start of day for fair comparison
  const fromDate = new Date(from);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(to);
  toDate.setHours(0, 0, 0, 0);
  return fromDate <= toDate;
};

export const useLeads = (dateRange?: DateRange) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['leads', user?.id, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      try {
        let query = supabase
          .from('leads')
          .select('*')
          .eq('user_id', user.id);

        // Apply date filter if provided and valid
        if (dateRange && dateRange.from && dateRange.to &&
          !isNaN(dateRange.from.getTime()) && !isNaN(dateRange.to.getTime()) &&
          isValidDateRange(dateRange.from, dateRange.to)) {
          // Set time to start of day for 'from' and end of day for 'to'
          const fromDate = new Date(dateRange.from);
          fromDate.setHours(0, 0, 0, 0);

          const toDate = new Date(dateRange.to);
          toDate.setHours(23, 59, 59, 999);

          query = query
            .gte('created_at', fromDate.toISOString())
            .lte('created_at', toDate.toISOString());
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return data as Lead[];
      } catch (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }
    },
    enabled: !!user && (!dateRange || (
      !!dateRange.from &&
      !!dateRange.to &&
      !isNaN(dateRange.from.getTime()) &&
      !isNaN(dateRange.to.getTime()) &&
      isValidDateRange(dateRange.from, dateRange.to)
    )),
    retry: 1,
  });
};

export const useLeadSources = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lead_sources', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('lead_sources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LeadSource[];
    },
    enabled: !!user,
  });
};

export const useCreateLeadSource = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (leadSource: Omit<LeadSource, 'id' | 'created_at' | 'updated_at' | 'total_leads' | 'last_sync_at' | 'webhook_url'>) => {
      if (!user) throw new Error('User not authenticated');

      // Generate webhook URL
      const webhookUrl = `https://tmyyrcmeiaokzlhgtabp.supabase.co/functions/v1/lead-webhook?source=${leadSource.source_type}&user_id=${user.id}`;

      const { data, error } = await supabase
        .from('lead_sources')
        .insert([{
          ...leadSource,
          user_id: user.id,
          webhook_url: webhookUrl,
          total_leads: 0
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_sources'] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
