
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LeadImport {
  id: string;
  user_id: string;
  import_type: string;
  source_name: string;
  total_leads: number;
  successful_imports: number;
  failed_imports: number;
  import_status: string;
  error_log: any;
  metadata: any;
  created_at: string;
  completed_at: string | null;
}

export const useLeadImports = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lead_imports', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('lead_imports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LeadImport[];
    },
    enabled: !!user,
  });
};

export const useCreateLeadImport = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (importData: Omit<LeadImport, 'id' | 'user_id' | 'created_at' | 'completed_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('lead_imports')
        .insert([{
          ...importData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_imports'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

export const useUpdateLeadImport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LeadImport> }) => {
      const { data, error } = await supabase
        .from('lead_imports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead_imports'] });
    },
  });
};
