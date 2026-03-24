import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface QualifiedLead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string | null;
  source: string;
  created_at: string;
  lead_score: number | null;
  qualification_status: string | null;
  last_call_at: string | null;
}

export interface QualificationStats {
  hot: number;
  warm: number;
  cold: number;
  unqualified: number;
  total: number;
}

interface DateRange {
  from: Date;
  to: Date;
}

export const useLeadQualification = (dateRange?: DateRange) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lead_qualification', user?.id, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching qualification data for user:', user.id);
      console.log('Date range:', {
        from: dateRange?.from?.toISOString(),
        to: dateRange?.to?.toISOString()
      });

      try {
        let callsData: any[] = [];

        if (dateRange) {
          // Simple approach: get all calls that fall within the date range
          // Check both completed_at and created_at to catch all relevant calls
          const { data: rangeCalls } = await supabase
            .from('bland_ai_calls')
            .select('id, lead_id, lead_score, qualification_status, completed_at, created_at')
            .eq('user_id', user.id)
            .not('lead_score', 'is', null)
            .not('qualification_status', 'is', null)
            .or(`completed_at.gte.${dateRange.from.toISOString()},created_at.gte.${dateRange.from.toISOString()}`)
            .or(`completed_at.lte.${dateRange.to.toISOString()},created_at.lte.${dateRange.to.toISOString()}`)
            .order('created_at', { ascending: false })
            .limit(50);

          callsData = rangeCalls || [];
        } else {
          // No date range, get recent data
          const { data: recentCalls } = await supabase
            .from('bland_ai_calls')
            .select('id, lead_id, lead_score, qualification_status, completed_at, created_at')
            .eq('user_id', user.id)
            .not('lead_score', 'is', null)
            .not('qualification_status', 'is', null)
            .order('created_at', { ascending: false })
            .limit(50);

          callsData = recentCalls || [];
        }

        return processCallsData(callsData);

      } catch (error) {
        console.error('Lead qualification query failed:', error);
        return { leads: [], stats: { hot: 0, warm: 0, cold: 0, unqualified: 0, total: 0 } };
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

// Simplified helper function to process calls data
async function processCallsData(callsData: any[]) {
  console.log('Processing calls data:', callsData?.length || 0);

  if (!callsData || callsData.length === 0) {
    return {
      leads: [],
      stats: { hot: 0, warm: 0, cold: 0, unqualified: 0, total: 0 }
    };
  }

  // Get unique lead IDs from the calls - properly typed as string[]
  const leadIds = [...new Set(callsData.map(call => call.lead_id).filter(Boolean))] as string[];
  
  if (leadIds.length === 0) {
    return {
      leads: [],
      stats: { hot: 0, warm: 0, cold: 0, unqualified: 0, total: 0 }
    };
  }

  // Get lead details for these lead IDs
  const { data: leadsData } = await supabase
    .from('leads')
    .select('id, name, email, phone, company, status, source, created_at')
    .in('id', leadIds);

  // Create a map of lead details for quick lookup
  const leadsMap = new Map(leadsData?.map(lead => [lead.id, lead]) || []);

  // Process the calls to get the latest/highest score for each lead
  const leadCallsMap = new Map<string, QualifiedLead>();

  callsData.forEach((call: any) => {
    if (!call.lead_id || !call.lead_score || !call.qualification_status) return;

    const leadDetails = leadsMap.get(call.lead_id);
    const leadId = call.lead_id;
    const existingLead = leadCallsMap.get(leadId);

    // If no existing lead or this call has a higher score or is more recent
    if (!existingLead || 
        call.lead_score > existingLead.lead_score ||
        (call.lead_score === existingLead.lead_score && 
         new Date(call.completed_at || call.created_at) > new Date(existingLead.last_call_at || ''))) {
      
      leadCallsMap.set(leadId, {
        id: leadId,
        name: leadDetails?.name || null,
        email: leadDetails?.email || null,
        phone: leadDetails?.phone || null,
        company: leadDetails?.company || null,
        status: leadDetails?.status || null,
        source: leadDetails?.source || 'unknown',
        created_at: leadDetails?.created_at || call.created_at,
        lead_score: call.lead_score,
        qualification_status: call.qualification_status,
        last_call_at: call.completed_at || call.created_at
      });
    }
  });

  const leads = Array.from(leadCallsMap.values());
  console.log('Processed qualified leads:', leads.length);

  // Calculate stats
  const stats: QualificationStats = {
    hot: leads.filter(l => l.qualification_status?.toLowerCase() === 'hot').length,
    warm: leads.filter(l => l.qualification_status?.toLowerCase() === 'warm').length,
    cold: leads.filter(l => l.qualification_status?.toLowerCase() === 'cold').length,
    unqualified: leads.filter(l => l.qualification_status?.toLowerCase() === 'unqualified').length,
    total: leads.length
  };

  console.log('Calculated stats:', stats);
  return { leads, stats };
}

export const useQualifiedLeadsByStatus = (status: string, dateRange?: DateRange) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['qualified_leads_by_status', status, user?.id, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      console.log('Fetching leads by status:', status, 'with date range:', dateRange);

      try {
        let callsData: any[] = [];

        if (dateRange) {
          // Simple date filtering approach
          const { data: rangeCalls } = await supabase
            .from('bland_ai_calls')
            .select('id, lead_id, lead_score, qualification_status, completed_at, created_at, transcript, summary, ai_analysis')
            .eq('user_id', user.id)
            .ilike('qualification_status', status)
            .not('lead_score', 'is', null)
            .or(`completed_at.gte.${dateRange.from.toISOString()},created_at.gte.${dateRange.from.toISOString()}`)
            .or(`completed_at.lte.${dateRange.to.toISOString()},created_at.lte.${dateRange.to.toISOString()}`)
            .order('lead_score', { ascending: false })
            .limit(25);

          callsData = rangeCalls || [];
        } else {
          const { data } = await supabase
            .from('bland_ai_calls')
            .select('id, lead_id, lead_score, qualification_status, completed_at, created_at, transcript, summary, ai_analysis')
            .eq('user_id', user.id)
            .ilike('qualification_status', status)
            .not('lead_score', 'is', null)
            .order('lead_score', { ascending: false })
            .limit(25);
          callsData = data || [];
        }

        if (!callsData || callsData.length === 0) {
          return [];
        }

        // Get lead details - properly typed as string[]
        const leadIds = [...new Set(callsData.map(call => call.lead_id).filter(Boolean))] as string[];
        
        const { data: leadsData } = await supabase
          .from('leads')
          .select('id, name, email, phone, company, status, source, created_at, score')
          .in('id', leadIds)
          .eq('user_id', user.id);

        console.log(`Leads for status ${status}:`, callsData?.length || 0);

        // Combine the data
        const leadsMap = new Map(leadsData?.map(lead => [lead.id, lead]) || []);
        
        const combinedLeads = callsData.map((call: any) => {
          const leadDetails = leadsMap.get(call.lead_id);
          return {
            ...leadDetails,
            call_data: {
              lead_score: call.lead_score,
              qualification_status: call.qualification_status,
              completed_at: call.completed_at,
              created_at: call.created_at,
              transcript: call.transcript,
              summary: call.summary,
              ai_analysis: call.ai_analysis
            }
          };
        }).filter(lead => lead.id);

        return combinedLeads;
      } catch (error) {
        console.error('Query failed for leads by status:', error);
        return [];
      }
    },
    enabled: !!user && !!status,
    staleTime: 5000,
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
      timeout: 3000
    }
  });
};
