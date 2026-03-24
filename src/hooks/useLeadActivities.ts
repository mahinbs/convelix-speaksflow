
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LeadActivity {
  id: string;
  lead_id: string;
  activity_type: string;
  description: string | null;
  notes: string | null;
  metadata: any;
  created_at: string;
}

export const useLeadActivities = (leadId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lead_activities', leadId, user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('lead_activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as LeadActivity[];
    },
    enabled: !!user,
  });
};

export const useCreateLeadActivity = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (activity: Omit<LeadActivity, 'id' | 'created_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('lead_activities')
        .insert([{
          ...activity,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_activities'] });
    },
  });
};
