
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface VapiAICall {
  id: string;
  user_id: string;
  lead_id: string | null;
  assistant_id: string | null;
  phone_number_id: string | null;
  vapi_call_id: string | null;
  caller_phone_number: string | null;
  destination_phone_number: string | null;
  status: string;
  type: string;
  duration: number | null;
  cost: number | null;
  transcript: string | null;
  summary: string | null;
  sentiment_analysis: any;
  recording_url: string | null;
  call_data: any;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useVapiAICalls = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['vapi_ai_calls', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('vapi_ai_calls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VapiAICall[];
    },
    enabled: !!user,
  });
};

export const useCreateVapiAICall = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (callData: Omit<VapiAICall, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('vapi_ai_calls')
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
      queryClient.invalidateQueries({ queryKey: ['vapi_ai_calls'] });
    },
  });
};

export const useUpdateVapiAICall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<VapiAICall> }) => {
      const { data, error } = await supabase
        .from('vapi_ai_calls')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vapi_ai_calls'] });
    },
  });
};
