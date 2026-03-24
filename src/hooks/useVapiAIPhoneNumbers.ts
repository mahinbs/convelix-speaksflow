
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface VapiAIPhoneNumber {
  id: string;
  user_id: string;
  phone_number: string;
  vapi_phone_number_id: string | null;
  name: string | null;
  assistant_id: string | null;
  status: string;
  monthly_cost: number | null;
  country_code: string;
  phone_number_data: any;
  created_at: string;
  updated_at: string;
}

export const useVapiAIPhoneNumbers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['vapi_ai_phone_numbers', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('vapi_ai_phone_numbers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VapiAIPhoneNumber[];
    },
    enabled: !!user,
  });
};

export const useCreateVapiAIPhoneNumber = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (phoneNumberData: Omit<VapiAIPhoneNumber, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('vapi_ai_phone_numbers')
        .insert([{
          ...phoneNumberData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vapi_ai_phone_numbers'] });
    },
  });
};

export const useUpdateVapiAIPhoneNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<VapiAIPhoneNumber> }) => {
      const { data, error } = await supabase
        .from('vapi_ai_phone_numbers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vapi_ai_phone_numbers'] });
    },
  });
};
