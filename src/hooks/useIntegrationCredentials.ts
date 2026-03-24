
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface IntegrationCredential {
  id: string;
  user_id: string;
  source_type: string;
  credentials: any;
  is_active: boolean | null;
  last_validated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: string;
  user_id: string;
  source_type: string;
  sync_status: string;
  leads_imported: number | null;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  metadata: any;
}

export const useIntegrationCredentials = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['integration_credentials', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('integration_credentials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as IntegrationCredential[];
    },
    enabled: !!user,
  });
};

export const useSyncLogs = (sourceType?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['integration_sync_logs', sourceType, user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('integration_sync_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);

      if (sourceType) {
        query = query.eq('source_type', sourceType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as SyncLog[];
    },
    enabled: !!user,
  });
};

export const useCreateCredentials = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (credentials: Omit<IntegrationCredential, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_validated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('integration_credentials')
        .upsert([{
          ...credentials,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integration_credentials'] });
    },
  });
};

export const useTestConnection = () => {
  return useMutation({
    mutationFn: async ({ sourceType, credentials }: { sourceType: string; credentials: any }) => {
      const { data, error } = await supabase.functions.invoke('test-integration', {
        body: { sourceType, credentials }
      });

      if (error) throw error;
      return data;
    },
  });
};

export const useTriggerSync = () => {
  return useMutation({
    mutationFn: async (sourceType: string) => {
      const { data, error } = await supabase.functions.invoke('sync-leads', {
        body: { sourceType }
      });

      if (error) throw error;
      return data;
    },
  });
};
