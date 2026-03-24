
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRevenueData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['revenue-data', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get calls and leads data
      const { data: calls } = await supabase
        .from('bland_ai_calls')
        .select('*')
        .eq('user_id', user.id);

      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id);

      if (!calls || !leads) return null;

      const avgDealValue = 500; // Should be configurable
      const recurringPercentage = 0.65; // 65% recurring revenue

      // Calculate monthly revenue data (last 6 months)
      const monthlyRevenueData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthCalls = calls.filter(call => {
          const callDate = new Date(call.created_at);
          return callDate.getMonth() === date.getMonth() && 
                 callDate.getFullYear() === date.getFullYear();
        });
        
        const successfulCalls = monthCalls.filter(call => 
          ['completed', 'success'].includes(call.status)
        ).length;
        
        const total = successfulCalls * avgDealValue;
        const recurring = Math.round(total * recurringPercentage);
        const one_time = total - recurring;
        
        // Simple forecast (10% growth)
        const forecast = i === 5 ? Math.round(total * 1.1) : 0;

        return {
          month,
          total,
          recurring,
          one_time,
          forecast,
        };
      });

      // Calculate revenue by source
      const sourceRevenue = leads.reduce((acc, lead) => {
        const source = lead.source || 'Unknown';
        const leadCalls = calls.filter(call => call.lead_id === lead.id);
        const successfulCalls = leadCalls.filter(call => 
          ['completed', 'success'].includes(call.status)
        ).length;
        
        if (!acc[source]) {
          acc[source] = { revenue: 0, count: 0 };
        }
        acc[source].revenue += successfulCalls * avgDealValue;
        acc[source].count += successfulCalls;
        return acc;
      }, {} as Record<string, { revenue: number; count: number }>);

      const totalRevenue = Object.values(sourceRevenue).reduce((sum, s) => sum + s.revenue, 0);
      const revenueBySource = Object.entries(sourceRevenue)
        .map(([source, data]) => ({
          source: source === 'facebook' ? 'Real Estate' :
                 source === 'linkedin' ? 'Insurance' :
                 source === 'whatsapp' ? 'SaaS' : 'E-commerce',
          revenue: data.revenue,
          percentage: totalRevenue ? Number((data.revenue / totalRevenue * 100).toFixed(1)) : 0,
          growth: Math.random() * 30 - 5, // Placeholder - you'd calculate real growth
        }))
        .filter(item => item.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue);

      // Calculate customer segment revenue (simplified)
      const customerSegmentRevenue = [
        { 
          segment: 'Enterprise', 
          customers: Math.floor(totalRevenue / avgDealValue * 0.15),
          revenue: Math.round(totalRevenue * 0.5),
          avg_value: avgDealValue * 3.3,
        },
        { 
          segment: 'Mid-Market', 
          customers: Math.floor(totalRevenue / avgDealValue * 0.35),
          revenue: Math.round(totalRevenue * 0.3),
          avg_value: Math.round(avgDealValue * 0.84),
        },
        { 
          segment: 'Small Business', 
          customers: Math.floor(totalRevenue / avgDealValue * 0.5),
          revenue: Math.round(totalRevenue * 0.2),
          avg_value: Math.round(avgDealValue * 0.31),
        },
      ];

      // Calculate key metrics
      const currentMonthRevenue = monthlyRevenueData[monthlyRevenueData.length - 1]?.total || 0;
      const previousMonthRevenue = monthlyRevenueData[monthlyRevenueData.length - 2]?.total || 0;
      const monthlyGrowth = previousMonthRevenue ? 
        Number(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)) : 0;

      const revenueMetrics = {
        totalRevenue: currentMonthRevenue,
        monthlyGrowth,
        arrGrowth: monthlyGrowth * 12, // Simplified ARR growth
        churnRate: 3.2, // Placeholder - you'd calculate from actual data
        avgDealSize: avgDealValue,
        customerLTV: avgDealValue * 4.3, // Simplified LTV calculation
        paybackPeriod: 4.2, // Placeholder
      };

      return {
        monthlyRevenueData,
        revenueBySource,
        customerSegmentRevenue,
        revenueMetrics,
      };
    },
    enabled: !!user,
  });
};
