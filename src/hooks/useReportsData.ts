
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useReportsData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['reports-overview', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get total leads
      const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get AI calls made
      const { count: aiCallsMade } = await supabase
        .from('bland_ai_calls')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get successful calls for success rate
      const { count: successfulCalls } = await supabase
        .from('bland_ai_calls')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('status', ['completed', 'success']);

      // Calculate success rate
      const successRate = aiCallsMade ? ((successfulCalls || 0) / aiCallsMade * 100) : 0;

      // Get revenue data (placeholder - you'll need to implement based on your revenue tracking)
      // For now, we'll calculate based on successful calls * average deal value
      const avgDealValue = 500; // This should come from your settings or be calculated
      const estimatedRevenue = (successfulCalls || 0) * avgDealValue;

      return {
        totalLeads: totalLeads || 0,
        aiCallsMade: aiCallsMade || 0,
        successRate: Number(successRate.toFixed(1)),
        revenueGenerated: estimatedRevenue,
      };
    },
    enabled: !!user,
  });
};
