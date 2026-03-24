
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<any>;
  color: string;
}

interface MobileStatsGridProps {
  stats: StatCard[];
}

export const MobileStatsGrid: React.FC<MobileStatsGridProps> = ({ stats }) => {
  const getTrendIcon = (change?: number) => {
    if (!change) return <Minus className="w-3 h-3 text-muted-foreground" />;
    if (change > 0) return <TrendingUp className="w-3 h-3 text-brand-600" />;
    return <TrendingDown className="w-3 h-3 text-destructive" />;
  };

  const getTrendColor = (change?: number) => {
    if (!change) return 'text-muted-foreground';
    return change > 0 ? 'text-brand-700' : 'text-destructive';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                {stat.change !== undefined && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(stat.change)}
                    <span className={`text-xs md:text-sm font-medium ${getTrendColor(stat.change)}`}>
                      {Math.abs(stat.change)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-xl md:text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
