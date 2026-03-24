
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCallAnalyticsData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['call-analytics', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get calls data
      const { data: calls } = await supabase
        .from('bland_ai_calls')
        .select('*')
        .eq('user_id', user.id);

      // Get campaigns data
      const { data: campaigns } = await supabase
        .from('bland_ai_campaigns')
        .select('*')
        .eq('user_id', user.id);

      if (!calls || !campaigns) return null;

      // Calculate campaign success rates
      const campaignStats = campaigns.map(campaign => {
        const campaignCalls = calls.filter(call => call.campaign_id === campaign.id);
        const successfulCalls = campaignCalls.filter(call => 
          ['completed', 'success'].includes(call.status)
        ).length;
        
        return {
          campaign: campaign.name,
          total: campaignCalls.length,
          successful: successfulCalls,
          rate: campaignCalls.length ? Number((successfulCalls / campaignCalls.length * 100).toFixed(1)) : 0,
        };
      });

      // Calculate call duration distribution
      const durationRanges = {
        '0-30s': 0,
        '30s-2m': 0,
        '2-5m': 0,
        '5-10m': 0,
        '10m+': 0,
      };

      calls.forEach(call => {
        const duration = call.duration || 0;
        if (duration <= 30) durationRanges['0-30s']++;
        else if (duration <= 120) durationRanges['30s-2m']++;
        else if (duration <= 300) durationRanges['2-5m']++;
        else if (duration <= 600) durationRanges['5-10m']++;
        else durationRanges['10m+']++;
      });

      const callDurationData = Object.entries(durationRanges).map(([duration, count]) => ({
        duration,
        count,
        outcome: duration === '0-30s' ? 'No Answer' : 
                duration === '30s-2m' ? 'Brief' :
                duration === '2-5m' ? 'Standard' :
                duration === '5-10m' ? 'Detailed' : 'Extended',
      }));

      // Calculate daily call volume (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const dailyCallVolume = last7Days.map(date => {
        const dayCalls = calls.filter(call => 
          call.created_at.startsWith(date)
        );
        const successful = dayCalls.filter(call => 
          ['completed', 'success'].includes(call.status)
        ).length;
        
        return {
          date,
          calls: dayCalls.length,
          successful,
          failed: dayCalls.length - successful,
        };
      });

      // Calculate outcome distribution
      const outcomes = calls.reduce((acc, call) => {
        const outcome = call.status === 'completed' || call.status === 'success' ? 'Success' :
                      call.outcome === 'voicemail' ? 'Voicemail' :
                      call.outcome === 'no_answer' ? 'No Answer' : 'Failed';
        acc[outcome] = (acc[outcome] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalCalls = calls.length;
      const outcomeDistribution = Object.entries(outcomes).map(([outcome, count]) => ({
        outcome,
        count,
        percentage: totalCalls ? Number((count / totalCalls * 100).toFixed(1)) : 0,
      }));

      // Calculate key metrics
      const totalCallsCount = calls.length;
      const successfulCallsCount = calls.filter(call => 
        ['completed', 'success'].includes(call.status)
      ).length;
      const successRate = totalCallsCount ? Number((successfulCallsCount / totalCallsCount * 100).toFixed(1)) : 0;
      
      const completedCalls = calls.filter(call => call.duration && call.duration > 0);
      const avgDuration = completedCalls.length ? 
        Math.round(completedCalls.reduce((sum, call) => sum + (call.duration || 0), 0) / completedCalls.length) : 0;
      
      const avgDurationFormatted = `${Math.floor(avgDuration / 60)}:${(avgDuration % 60).toString().padStart(2, '0')}`;
      
      // Estimated cost per call (you might want to make this configurable)
      const costPerCall = 2.45;

      return {
        keyMetrics: {
          totalCalls: totalCallsCount,
          successRate,
          avgDuration: avgDurationFormatted,
          costPerCall,
        },
        campaignSuccessData: campaignStats,
        callDurationData,
        dailyCallVolume,
        outcomeDistribution,
        voicePerformanceData: [], // You can implement this based on voice data if available
      };
    },
    enabled: !!user,
  });
};
