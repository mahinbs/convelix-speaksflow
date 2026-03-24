
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Users, CheckCircle, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { useBlandAICalls, useBlandAICallsSync } from '@/hooks/useBlandAICalls';
import { useBlandAICampaigns, useRecalculateCampaignMetrics } from '@/hooks/useBlandAICampaigns';
import { useToast } from '@/hooks/use-toast';

export const BlandAIDashboard: React.FC = () => {
  const { data: calls = [], isLoading: callsLoading } = useBlandAICalls();
  const { data: campaigns = [], isLoading: campaignsLoading } = useBlandAICampaigns();
  const recalculateMetrics = useRecalculateCampaignMetrics();
  const { toast } = useToast();

  // Enable background sync for call statuses
  useBlandAICallsSync();

  const handleRecalculateMetrics = async () => {
    try {
      await recalculateMetrics.mutateAsync(undefined);
      toast({
        title: "Success",
        description: "Campaign metrics updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to recalculate campaign metrics",
        variant: "destructive",
      });
    }
  };

  const totalCalls = calls.length;
  const completedCalls = calls.filter(call => call.status === 'completed').length;
  const activeCampaigns = campaigns.filter(campaign => campaign.status === 'active').length;
  const successfulCalls = calls.filter(call => call.outcome === 'success').length;

  const successRate = totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 0;

  const stats = [
    {
      title: 'Total Calls',
      value: totalCalls,
      icon: Phone,
      description: 'All time calls made',
      color: 'blue',
      gradient: 'from-brand-500/20 via-brand-400/20 to-brand-600/20'
    },
    {
      title: 'Active Campaigns',
      value: activeCampaigns,
      icon: Users,
      description: 'Currently running campaigns',
      color: 'green',
      gradient: 'from-brand-400/20 via-brand-500/20 to-brand-600/20'
    },
    {
      title: 'Completed Calls',
      value: completedCalls,
      icon: CheckCircle,
      description: 'Successfully completed calls',
      color: 'purple',
      gradient: 'from-brand-500/20 via-brand-600/20 to-brand-700/20'
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: TrendingUp,
      description: 'Call success percentage',
      color: 'orange',
      gradient: 'from-brand-300/20 via-brand-500/20 to-brand-700/20'
    }
  ];

  const recentCalls = calls.slice(0, 5);

  if (callsLoading || campaignsLoading) {
    return (
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse shimmer-gradient">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <div className="h-5 w-5 bg-muted/50 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-muted/50 rounded-xl mb-3"></div>
              <div className="h-4 bg-muted/30 rounded-lg"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Enhanced Stats Grid */}
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`group relative overflow-hidden stagger-animation stagger-${index + 1}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-60 group-hover:opacity-80 transition-all duration-700`}></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground/90">{stat.title}</CardTitle>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} bg-opacity-20 backdrop-blur-sm pulse-glow`}>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-bold counter-animation bg-gradient-to-br bg-clip-text text-transparent from-foreground to-foreground/70 animate-counter">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground/80 mt-2 slide-in-elegant">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Recent Activity */}
      <div className="grid gap-10 md:grid-cols-2">
        <Card className="group slide-up-fade">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-brand-700/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-brand-500/20 to-brand-700/20 gentle-bounce">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              Recent Calls
            </CardTitle>
            <CardDescription>Latest AI phone calls made</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            {recentCalls.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                <div className="p-6 rounded-full bg-gradient-to-r from-brand-500/10 to-brand-700/10 mx-auto w-fit mb-6 float-animation">
                  <Phone className="h-16 w-16 opacity-50" />
                </div>
                <p className="text-lg">No calls made yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentCalls.map((call, index) => (
                  <div 
                    key={call.id} 
                    className={`flex items-center justify-between p-6 border border-border/50 rounded-2xl glass-card-elegant hover:bg-accent/30 transition-all duration-500 stagger-animation`} 
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{call.phone_number}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {call.created_at ? new Date(call.created_at).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                    <Badge
                      variant={
                        call.status === 'completed' ? 'default' :
                          call.status === 'pending' ? 'secondary' : 'destructive'
                      }
                      className="hover-scale-elegant shadow-lg"
                    >
                      {call.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="group slide-up-fade">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-400/5 to-brand-600/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <div>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-brand-400/20 to-brand-600/20 gentle-bounce">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                Campaign Performance
              </CardTitle>
              <CardDescription>Active campaigns overview</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecalculateMetrics}
              disabled={recalculateMetrics.isPending}
              className="shrink-0 bg-background/80 backdrop-blur-sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${recalculateMetrics.isPending ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="relative z-10">
            {campaigns.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                <div className="p-6 rounded-full bg-gradient-to-r from-brand-400/10 to-brand-600/10 mx-auto w-fit mb-6 float-animation">
                  <Users className="h-16 w-16 opacity-50" />
                </div>
                <p className="text-lg">No campaigns created yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {campaigns.slice(0, 5).map((campaign, index) => (
                  <div 
                    key={campaign.id} 
                    className={`flex items-center justify-between p-6 border border-border/50 rounded-2xl glass-card-elegant hover:bg-accent/30 transition-all duration-500 stagger-animation`} 
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {campaign.completed_calls || 0} / {campaign.total_leads || 0} calls
                        {campaign.successful_calls > 0 && ` (${campaign.successful_calls} successful)`}
                      </p>
                    </div>
                    <Badge
                      variant={
                        campaign.status === 'active' ? 'default' :
                          campaign.status === 'draft' ? 'secondary' : 'destructive'
                      }
                      className="hover-scale-elegant shadow-lg"
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
