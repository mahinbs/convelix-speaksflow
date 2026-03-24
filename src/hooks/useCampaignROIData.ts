
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCampaignROIData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['campaign-roi', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get campaigns and calls data
      const { data: campaigns } = await supabase
        .from('bland_ai_campaigns')
        .select('*')
        .eq('user_id', user.id);

      const { data: calls } = await supabase
        .from('bland_ai_calls')
        .select('*')
        .eq('user_id', user.id);

      if (!campaigns || !calls) return null;

      // Calculate campaign ROI data
      const costPerCall = 2.45; // Should be configurable
      const avgDealValue = 500; // Should come from settings

      const campaignROIData = campaigns.map(campaign => {
        const campaignCalls = calls.filter(call => call.campaign_id === campaign.id);
        const successfulCalls = campaignCalls.filter(call => 
          ['completed', 'success'].includes(call.status)
        ).length;
        
        const spent = campaignCalls.length * costPerCall;
        const revenue = successfulCalls * avgDealValue;
        const roi = spent > 0 ? Number(((revenue - spent) / spent * 100).toFixed(0)) : 0;
        const cpa = successfulCalls > 0 ? Number((spent / successfulCalls).toFixed(2)) : 0;

        return {
          campaign: campaign.name,
          spent: Math.round(spent),
          revenue: Math.round(revenue),
          roi,
          leads: campaignCalls.length,
          conversions: successfulCalls,
          cpa,
          clv: avgDealValue * 2, // Estimated customer lifetime value
        };
      });

      // Calculate monthly ROI trends (last 5 months)
      const monthlyROITrends = Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (4 - i));
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthCalls = calls.filter(call => {
          const callDate = new Date(call.created_at);
          return callDate.getMonth() === date.getMonth() && 
                 callDate.getFullYear() === date.getFullYear();
        });
        
        const monthSuccessful = monthCalls.filter(call => 
          ['completed', 'success'].includes(call.status)
        ).length;
        
        const spent = monthCalls.length * costPerCall;
        const revenue = monthSuccessful * avgDealValue;
        const roi = spent > 0 ? Number(((revenue - spent) / spent * 100).toFixed(0)) : 0;

        return {
          month,
          spent: Math.round(spent),
          revenue: Math.round(revenue),
          roi,
        };
      });

      // Calculate cost breakdown
      const totalSpent = campaignROIData.reduce((sum, campaign) => sum + campaign.spent, 0);
      const costBreakdown = [
        { category: 'AI Call Credits', amount: Math.round(totalSpent * 0.352), percentage: 35.2 },
        { category: 'Lead Acquisition', amount: Math.round(totalSpent * 0.295), percentage: 29.5 },
        { category: 'Platform Fees', amount: Math.round(totalSpent * 0.122), percentage: 12.2 },
        { category: 'Voice Services', amount: Math.round(totalSpent * 0.091), percentage: 9.1 },
        { category: 'Other', amount: Math.round(totalSpent * 0.140), percentage: 14.0 },
      ];

      return {
        campaignROIData,
        monthlyROITrends,
        costBreakdown,
      };
    },
    enabled: !!user,
  });
};
