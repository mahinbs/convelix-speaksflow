
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useLeadPerformanceData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lead-performance', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      // Get leads by status for conversion funnel
      const { data: leads } = await supabase
        .from('leads')
        .select('status, source, score, created_at')
        .eq('user_id', user.id);

      if (!leads) return null;

      // Calculate conversion funnel
      const totalLeads = leads.length;
      const contactedLeads = leads.filter(l => l.status !== 'new').length;
      const qualifiedLeads = leads.filter(l => ['qualified', 'hot', 'warm'].includes(l.status || '')).length;
      const convertedLeads = leads.filter(l => l.status === 'converted').length;

      const leadConversionData = [
        { stage: 'Imported', count: totalLeads, percentage: 100 },
        { stage: 'Contacted', count: contactedLeads, percentage: totalLeads ? (contactedLeads / totalLeads * 100) : 0 },
        { stage: 'Qualified', count: qualifiedLeads, percentage: totalLeads ? (qualifiedLeads / totalLeads * 100) : 0 },
        { stage: 'Converted', count: convertedLeads, percentage: totalLeads ? (convertedLeads / totalLeads * 100) : 0 },
      ];

      // Calculate lead source performance
      const sourceStats = leads.reduce((acc, lead) => {
        const source = lead.source || 'Unknown';
        if (!acc[source]) {
          acc[source] = { total: 0, qualified: 0, converted: 0 };
        }
        acc[source].total++;
        if (['qualified', 'hot', 'warm'].includes(lead.status || '')) {
          acc[source].qualified++;
        }
        if (lead.status === 'converted') {
          acc[source].converted++;
        }
        return acc;
      }, {} as Record<string, { total: number; qualified: number; converted: number }>);

      const leadSourceData = Object.entries(sourceStats).map(([source, stats]) => ({
        source,
        leads: stats.total,
        qualified: stats.qualified,
        conversion: stats.total ? Number((stats.qualified / stats.total * 100).toFixed(1)) : 0,
      }));

      // Calculate lead score distribution
      const scoreRanges = {
        '90-100': 0,
        '80-89': 0,
        '70-79': 0,
        '60-69': 0,
        'Below 60': 0,
      };

      leads.forEach(lead => {
        const score = lead.score || 0;
        if (score >= 90) scoreRanges['90-100']++;
        else if (score >= 80) scoreRanges['80-89']++;
        else if (score >= 70) scoreRanges['70-79']++;
        else if (score >= 60) scoreRanges['60-69']++;
        else scoreRanges['Below 60']++;
      });

      const leadScoreData = Object.entries(scoreRanges).map(([score, count], index) => ({
        score,
        count,
        color: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'][index],
      }));

      // Calculate monthly trends
      const monthlyStats = leads.reduce((acc, lead) => {
        const month = new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { imported: 0, qualified: 0, converted: 0 };
        }
        acc[month].imported++;
        if (['qualified', 'hot', 'warm'].includes(lead.status || '')) {
          acc[month].qualified++;
        }
        if (lead.status === 'converted') {
          acc[month].converted++;
        }
        return acc;
      }, {} as Record<string, { imported: number; qualified: number; converted: number }>);

      const monthlyLeadTrends = Object.entries(monthlyStats).map(([month, stats]) => ({
        month,
        ...stats,
      })).slice(-6); // Last 6 months

      return {
        leadConversionData,
        leadSourceData,
        leadScoreData,
        monthlyLeadTrends,
      };
    },
    enabled: !!user,
  });
};
