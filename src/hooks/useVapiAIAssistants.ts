
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface VapiAIAssistant {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  voice_settings: any;
  prompt: string;
  functions: any;
  model: string;
  first_message: string | null;
  background_sound: string | null;
  status: string;
  vapi_assistant_id: string | null;
  assistant_data: any;
  created_at: string;
  updated_at: string;
}

export const useVapiAIAssistants = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['vapi_ai_assistants', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('vapi_ai_assistants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VapiAIAssistant[];
    },
    enabled: !!user,
  });
};

export const useCreateVapiAIAssistant = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (assistantData: Omit<VapiAIAssistant, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'vapi_assistant_id' | 'assistant_data'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('vapi_ai_assistants')
        .insert([{
          ...assistantData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vapi_ai_assistants'] });
    },
  });
};

export const useUpdateVapiAIAssistant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<VapiAIAssistant> }) => {
      const { data, error } = await supabase
        .from('vapi_ai_assistants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vapi_ai_assistants'] });
    },
  });
};
