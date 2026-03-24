
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Phone, DollarSign, Activity } from 'lucide-react';
import { LeadPerformanceReports } from './reports/LeadPerformanceReports';
import { CallAnalyticsReports } from './reports/CallAnalyticsReports';
import { CampaignROIReports } from './reports/CampaignROIReports';
import { RevenueReports } from './reports/RevenueReports';
import { AIReportSummary } from './reports/AIReportSummary';
import { useReportsData } from '@/hooks/useReportsData';
import { Skeleton } from '@/components/ui/skeleton';

export const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lead-performance');
  const { data: overviewData, isLoading } = useReportsData();

  const formatGrowth = (current: number, baseline: number = 1000) => {
    const growth = baseline > 0 ? ((current - baseline) / baseline * 100) : 0;
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between slide-in-elegant">
        <div>
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Comprehensive insights into your lead generation and AI calling performance</p>
        </div>
      </div>

      {/* AI Summary Section */}
      <AIReportSummary />

      {/* Enhanced Overview Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group stagger-animation stagger-1">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-brand-300/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-r from-brand-500/20 to-brand-400/20 pulse-glow">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {isLoading ? (
              <Skeleton className="h-10 w-24 shimmer-gradient" />
            ) : (
              <>
                <div className="text-3xl font-bold counter-animation animate-counter">{overviewData?.totalLeads?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground mt-2 slide-in-elegant">
                  {formatGrowth(overviewData?.totalLeads || 0, 2000)} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="group stagger-animation stagger-2">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-400/10 to-brand-600/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-medium">AI Calls Made</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-r from-brand-400/20 to-brand-600/20 pulse-glow">
              <Phone className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {isLoading ? (
              <Skeleton className="h-10 w-24 shimmer-gradient" />
            ) : (
              <>
                <div className="text-3xl font-bold counter-animation animate-counter">{overviewData?.aiCallsMade?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground mt-2 slide-in-elegant">
                  {formatGrowth(overviewData?.aiCallsMade || 0, 1500)} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="group stagger-animation stagger-3">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-brand-800/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-r from-brand-600/20 to-brand-800/20 pulse-glow">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {isLoading ? (
              <Skeleton className="h-10 w-24 shimmer-gradient" />
            ) : (
              <>
                <div className="text-3xl font-bold counter-animation animate-counter">{overviewData?.successRate || 0}%</div>
                <p className="text-xs text-muted-foreground mt-2 slide-in-elegant">
                  {overviewData?.successRate && overviewData.successRate > 70 ? '+' : ''}
                  {((overviewData?.successRate || 0) - 70).toFixed(1)}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="group stagger-animation stagger-4">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-300/10 to-brand-700/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-r from-brand-300/20 to-brand-700/20 pulse-glow">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {isLoading ? (
              <Skeleton className="h-10 w-24 shimmer-gradient" />
            ) : (
              <>
                <div className="text-3xl font-bold counter-animation animate-counter">${overviewData?.revenueGenerated?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground mt-2 slide-in-elegant">
                  {formatGrowth(overviewData?.revenueGenerated || 0, 35000)} from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 slide-up-fade">
        <TabsList className="grid w-full grid-cols-4 bg-background/60 backdrop-blur-md border border-border/50 p-2 rounded-2xl shadow-xl">
          <TabsTrigger value="lead-performance" className="flex items-center space-x-2 rounded-xl transition-all duration-300 hover-scale-elegant">
            <Users className="w-4 h-4" />
            <span>Lead Performance</span>
          </TabsTrigger>
          <TabsTrigger value="call-analytics" className="flex items-center space-x-2 rounded-xl transition-all duration-300 hover-scale-elegant">
            <Phone className="w-4 h-4" />
            <span>Call Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="campaign-roi" className="flex items-center space-x-2 rounded-xl transition-all duration-300 hover-scale-elegant">
            <BarChart3 className="w-4 h-4" />
            <span>Campaign ROI</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center space-x-2 rounded-xl transition-all duration-300 hover-scale-elegant">
            <DollarSign className="w-4 h-4" />
            <span>Revenue</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lead-performance" className="slide-up-fade">
          <LeadPerformanceReports />
        </TabsContent>

        <TabsContent value="call-analytics" className="slide-up-fade">
          <CallAnalyticsReports />
        </TabsContent>

        <TabsContent value="campaign-roi" className="slide-up-fade">
          <CampaignROIReports />
        </TabsContent>

        <TabsContent value="revenue" className="slide-up-fade">
          <RevenueReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};
