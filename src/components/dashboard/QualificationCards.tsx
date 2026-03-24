
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Thermometer, Snowflake, XCircle } from 'lucide-react';
import { useLeadQualification } from '@/hooks/useLeadQualification';
import { useFilter } from '@/contexts/FilterContext';

interface QualificationCardsProps {
  onCardClick: (status: string) => void;
}

export const QualificationCards: React.FC<QualificationCardsProps> = ({ onCardClick }) => {
  const { getDateRange, selectedFilter } = useFilter();
  const dateRange = getDateRange();
  const { data: qualificationData, isLoading, error } = useLeadQualification(dateRange);

  const cards = [
    {
      title: 'Hot Leads',
      status: 'Hot',
      description: 'Very interested, qualified leads',
      scoreRange: '71-85+',
      count: qualificationData?.stats.hot || 0,
      icon: Flame,
      bgColor: 'bg-destructive',
      textColor: 'text-destructive',
      borderColor: 'border-destructive/30',
      hoverColor: 'hover:bg-destructive/5'
    },
    {
      title: 'Warm Leads',
      status: 'Warm',
      description: 'Interested with minor concerns',
      scoreRange: '51-70',
      count: qualificationData?.stats.warm || 0,
      icon: Thermometer,
      bgColor: 'bg-brand-600',
      textColor: 'text-brand-700',
      borderColor: 'border-brand-200',
      hoverColor: 'hover:bg-brand-50'
    },
    {
      title: 'Cold Leads',
      status: 'Cold',
      description: 'Some interest but major barriers',
      scoreRange: '31-50',
      count: qualificationData?.stats.cold || 0,
      icon: Snowflake,
      bgColor: 'bg-brand-500',
      textColor: 'text-brand-700',
      borderColor: 'border-brand-200',
      hoverColor: 'hover:bg-brand-50'
    },
    {
      title: 'Unqualified',
      status: 'Unqualified',
      description: 'No interest, no budget, not a fit',
      scoreRange: '0-30',
      count: qualificationData?.stats.unqualified || 0,
      icon: XCircle,
      bgColor: 'bg-muted-foreground/45',
      textColor: 'text-muted-foreground',
      borderColor: 'border-border',
      hoverColor: 'hover:bg-muted'
    }
  ];

  // Show helpful messages for new users or empty data
  const showNewUserMessage = !isLoading && qualificationData?.stats.total === 0 && selectedFilter !== 'today';
  const showSuggestTodayMessage = !isLoading && qualificationData?.stats.total === 0 && selectedFilter === 'week';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-muted rounded mb-1"></div>
              <div className="h-4 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/25 rounded-lg p-4">
        <p className="text-destructive text-sm">Failed to load qualification data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showSuggestTodayMessage && (
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
          <p className="text-brand-800 text-sm">
            <strong>No data found for this week.</strong> You started using the system recently. 
            Try selecting "Today" to see your current activity and build up historical data over time.
          </p>
        </div>
      )}
      
      {showNewUserMessage && selectedFilter === 'month' && (
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
          <p className="text-brand-800 text-sm">
            <strong>No data found for this month.</strong> You're new to the system! 
            Switch to "Today" or "This Week" to see your recent activity.
          </p>
        </div>
      )}

      {showNewUserMessage && selectedFilter !== 'month' && selectedFilter !== 'week' && (
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
          <p className="text-brand-800 text-sm">
            No data found for this period. Try selecting "Today" to see your current activity, 
            or start making calls to build up your historical data.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.status} 
              className={`cursor-pointer transition-all duration-200 ${card.hoverColor} ${card.borderColor} border-2 hover:shadow-md`}
              onClick={() => onCardClick(card.status)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                <p className="text-xs text-muted-foreground">Score: {card.scoreRange}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
