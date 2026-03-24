
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AIInsights {
  topPerformer: string;
  bestTimeToCall: string;
  keySuccessFactors: string[];
}

interface AIReportData {
  summary: string;
  recommendations: string[];
  insights: AIInsights;
}

export const useAIReportInsights = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-report-insights', user?.id],
    queryFn: async (): Promise<AIReportData> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('generate-report-insights', {
        body: { user_id: user.id }
      });

      if (error) {
        console.error('Error fetching AI insights:', error);
        // Return fallback data
        return {
          summary: 'AI insights are temporarily unavailable. Your reports show standard performance metrics.',
          recommendations: [
            'Review your call analytics for patterns',
            'Focus on high-quality leads',
            'Optimize your calling schedule',
            'Follow up quickly with interested prospects'
          ],
          insights: {
            topPerformer: 'Data analysis in progress',
            bestTimeToCall: '2-4 PM',
            keySuccessFactors: ['Quick response', 'Personalization', 'Value proposition']
          }
        };
      }

      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
