import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  totalCallsToday: number;
  totalCalls: number;
  conversionRate: number;
  averageDuration: number;
  callsGrowth: string;
  qualifiedCallsToday: number;
}

export interface WeeklyCallData {
  name: string;
  calls: number;
  qualified: number;
}

export interface RecentCall {
  id: string;
  leadName: string;
  status: string;
  duration: string;
  score: number;
  qualification_status: string;
}

interface DateRange {
  from: Date;
  to: Date;
}

export const useDashboardStats = (dateRange?: DateRange) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard_stats', user?.id, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching dashboard stats for user:', user.id);
      console.log('Date range:', {
        from: dateRange?.from?.toISOString(),
        to: dateRange?.to?.toISOString()
      });

      // Use provided date range or default to today
      const now = new Date();
      const rangeStart = dateRange?.from || new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const rangeEnd = dateRange?.to || new Date(rangeStart.getTime() + 24 * 60 * 60 * 1000);

      // Calculate previous period for comparison
      const periodDuration = rangeEnd.getTime() - rangeStart.getTime();
      const previousStart = new Date(rangeStart.getTime() - periodDuration);
      const previousEnd = new Date(rangeStart);

      console.log('Period comparison:', {
        current: { from: rangeStart.toISOString(), to: rangeEnd.toISOString() },
        previous: { from: previousStart.toISOString(), to: previousEnd.toISOString() }
      });

      try {
        // Simple current period query
        const { data: rangeCalls } = await supabase
          .from('bland_ai_calls')
          .select('id, status, duration, qualification_status, created_at, completed_at')
          .eq('user_id', user.id)
          .or(`completed_at.gte.${rangeStart.toISOString()},created_at.gte.${rangeStart.toISOString()}`)
          .or(`completed_at.lte.${rangeEnd.toISOString()},created_at.lte.${rangeEnd.toISOString()}`)
          .limit(100);

        // Simple previous period query
        const { data: previousCalls } = await supabase
          .from('bland_ai_calls')
          .select('id')
          .eq('user_id', user.id)
          .or(`completed_at.gte.${previousStart.toISOString()},created_at.gte.${previousStart.toISOString()}`)
          .or(`completed_at.lt.${previousEnd.toISOString()},created_at.lt.${previousEnd.toISOString()}`)
          .limit(100);

        console.log('Calls data:', {
          rangeCalls: rangeCalls?.length || 0,
          previousCalls: previousCalls?.length || 0
        });

        return calculateStats(rangeCalls || [], previousCalls || []);

      } catch (error) {
        console.error('Dashboard stats query failed:', error);
        return getDefaultStats();
      }
    },
    enabled: !!user,
    staleTime: 5000,
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
      timeout: 3000
    }
  });
};

function getDefaultStats(): DashboardStats {
  return {
    totalCallsToday: 0,
    totalCalls: 0,
    conversionRate: 0,
    averageDuration: 0,
    callsGrowth: '+0%',
    qualifiedCallsToday: 0
  };
}

function calculateStats(rangeCalls: any[], previousCalls: any[]): DashboardStats {
  // Calculate qualified calls (Hot or Warm)
  const qualifiedCalls = rangeCalls.filter(call => 
    call.qualification_status?.toLowerCase() === 'hot' || 
    call.qualification_status?.toLowerCase() === 'warm'
  );

  // Calculate conversion rate
  const completedCalls = rangeCalls.filter(call => call.status === 'completed');
  const conversionRate = completedCalls.length > 0 
    ? Math.round((qualifiedCalls.length / completedCalls.length) * 100) 
    : 0;

  // Calculate average duration
  const callsWithDuration = rangeCalls.filter(call => call.duration && call.duration > 0);
  const averageDuration = callsWithDuration.length > 0
    ? Math.round(callsWithDuration.reduce((sum, call) => sum + (call.duration || 0), 0) / callsWithDuration.length)
    : 0;

  // Calculate growth
  const currentPeriodCalls = rangeCalls.length;
  const previousPeriodCalls = previousCalls.length;
  const growthPercent = previousPeriodCalls > 0 
    ? Math.round(((currentPeriodCalls - previousPeriodCalls) / previousPeriodCalls) * 100)
    : currentPeriodCalls > 0 ? 100 : 0;

  const callsGrowth = growthPercent >= 0 ? `+${growthPercent}%` : `${growthPercent}%`;

  const stats: DashboardStats = {
    totalCallsToday: currentPeriodCalls,
    totalCalls: currentPeriodCalls,
    conversionRate,
    averageDuration,
    callsGrowth,
    qualifiedCallsToday: qualifiedCalls.length
  };

  console.log('Calculated dashboard stats:', stats);
  return stats;
}

export const useWeeklyCallData = (dateRange?: DateRange) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['weekly_call_data', user?.id, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching weekly call data for user:', user.id);

      // Use provided date range or default to last 7 days
      const today = new Date();
      const rangeStart = dateRange?.from || (() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        return sevenDaysAgo;
      })();
      const rangeEnd = dateRange?.to || today;

      // Simple query with basic date filtering
      const { data: calls } = await supabase
        .from('bland_ai_calls')
        .select('created_at, qualification_status, completed_at')
        .eq('user_id', user.id)
        .or(`completed_at.gte.${rangeStart.toISOString()},created_at.gte.${rangeStart.toISOString()}`)
        .or(`completed_at.lte.${rangeEnd.toISOString()},created_at.lte.${rangeEnd.toISOString()}`)
        .limit(100);

      console.log('Weekly calls raw data:', calls?.length || 0);

      // Determine grouping based on date range duration
      const rangeDuration = rangeEnd.getTime() - rangeStart.getTime();
      const dayInMs = 24 * 60 * 60 * 1000;
      
      let weeklyData: WeeklyCallData[] = [];

      if (rangeDuration <= dayInMs) {
        // For today: group by hours
        const hours = Array.from({ length: 24 }, (_, i) => {
          const hour = i;
          const hourStart = new Date(rangeStart);
          hourStart.setHours(hour, 0, 0, 0);
          const hourEnd = new Date(hourStart);
          hourEnd.setHours(hour + 1);

          const hourCalls = calls?.filter(call => {
            const callDate = new Date(call.completed_at || call.created_at);
            return callDate >= hourStart && callDate < hourEnd;
          }) || [];

          const qualifiedCalls = hourCalls.filter(call => 
            call.qualification_status?.toLowerCase() === 'hot' || 
            call.qualification_status?.toLowerCase() === 'warm'
          );

          return {
            name: `${hour.toString().padStart(2, '0')}:00`,
            calls: hourCalls.length,
            qualified: qualifiedCalls.length
          };
        });

        // Only show hours with activity or recent hours (last 12 hours with data)
        const currentHour = new Date().getHours();
        weeklyData = hours.filter((hour, index) => 
          hour.calls > 0 || index <= currentHour + 1
        ).slice(-12);
      } else {
        // For week/month: group by days
        const dayCount = Math.min(Math.ceil(rangeDuration / dayInMs), 30);
        
        for (let i = 0; i < dayCount; i++) {
          const date = new Date(rangeStart);
          date.setDate(date.getDate() + i);
          const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);

          const dayCalls = calls?.filter(call => {
            const callDate = new Date(call.completed_at || call.created_at);
            return callDate >= dayStart && callDate <= dayEnd;
          }) || [];

          const qualifiedCalls = dayCalls.filter(call => 
            call.qualification_status?.toLowerCase() === 'hot' || 
            call.qualification_status?.toLowerCase() === 'warm'
          );

          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          weeklyData.push({
            name: dayCount <= 7 ? dayNames[date.getDay()] : `${date.getMonth() + 1}/${date.getDate()}`,
            calls: dayCalls.length,
            qualified: qualifiedCalls.length
          });
        }
      }

      console.log('Weekly call data processed:', weeklyData);
      return weeklyData;
    },
    enabled: !!user,
    staleTime: 5000,
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
      timeout: 3000
    }
  });
};

export const useRecentCalls = (dateRange?: DateRange) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recent_calls', user?.id, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching recent calls for user:', user.id);

      let calls: any[] = [];

      if (dateRange) {
        // Simple date filtering
        const { data: rangeCalls } = await supabase
          .from('bland_ai_calls')
          .select('id, phone_number, status, duration, lead_score, qualification_status, completed_at, created_at, lead_id')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .not('lead_score', 'is', null)
          .or(`completed_at.gte.${dateRange.from.toISOString()},created_at.gte.${dateRange.from.toISOString()}`)
          .or(`completed_at.lte.${dateRange.to.toISOString()},created_at.lte.${dateRange.to.toISOString()}`)
          .order('created_at', { ascending: false })
          .limit(5);

        calls = rangeCalls || [];
      } else {
        const { data } = await supabase
          .from('bland_ai_calls')
          .select('id, phone_number, status, duration, lead_score, qualification_status, completed_at, created_at, lead_id')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .not('lead_score', 'is', null)
          .order('created_at', { ascending: false })
          .limit(5);
        calls = data || [];
      }

      console.log('Recent calls data:', calls?.length || 0);

      if (!calls || calls.length === 0) {
        return [];
      }

      // Get lead names for these calls - properly typed as string[]
      const leadIds = [...new Set(calls.map(call => call.lead_id).filter(Boolean))] as string[];
      let leadsMap = new Map();

      if (leadIds.length > 0) {
        const { data: leads } = await supabase
          .from('leads')
          .select('id, name')
          .in('id', leadIds)
          .eq('user_id', user.id);

        if (leads) {
          leadsMap = new Map(leads.map(lead => [lead.id, lead.name]));
        }
      }

      const recentCalls: RecentCall[] = calls.map((call: any) => {
        // Format duration from seconds to MM:SS
        const formatDuration = (seconds: number) => {
          if (!seconds) return '0:00';
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        };

        // Map qualification status to call status for display
        const getCallStatus = (qualStatus: string | null) => {
          if (!qualStatus) return 'not-qualified';
          const status = qualStatus.toLowerCase();
          if (status === 'hot') return 'qualified';
          if (status === 'warm') return 'callback';
          if (status === 'cold') return 'not-qualified';
          return 'not-qualified';
        };

        const leadName = leadsMap.get(call.lead_id) || call.phone_number || 'Unknown';

        return {
          id: call.id,
          leadName,
          status: getCallStatus(call.qualification_status),
          duration: formatDuration(call.duration || 0),
          score: call.lead_score || 0,
          qualification_status: call.qualification_status || 'unqualified'
        };
      });

      console.log('Recent calls processed:', recentCalls);
      return recentCalls;
    },
    enabled: !!user,
    staleTime: 5000,
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
      timeout: 3000
    }
  });
};
