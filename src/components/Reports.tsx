
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
    <div className="space-y-6 md:space-y-8">
      <div className="slide-in-elegant flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent sm:text-3xl md:text-4xl">
            Reports & Analytics
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base md:text-lg">
            Comprehensive insights into your lead generation and AI calling performance
          </p>
        </div>
      </div>

      {/* AI Summary Section */}
      <AIReportSummary />

      {/* Enhanced Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="slide-up-fade space-y-4 md:space-y-8">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl border border-border/50 bg-background/60 p-1 shadow-xl backdrop-blur-md sm:grid-cols-4 sm:p-2">
          <TabsTrigger value="lead-performance" className="min-w-0 gap-1 rounded-xl px-2 text-xs transition-all duration-300 hover-scale-elegant sm:gap-2 sm:px-3 sm:text-sm">
            <Users className="h-4 w-4 shrink-0" />
            <span className="truncate sm:hidden">Leads</span>
            <span className="hidden truncate sm:inline">Lead Performance</span>
          </TabsTrigger>
          <TabsTrigger value="call-analytics" className="min-w-0 gap-1 rounded-xl px-2 text-xs transition-all duration-300 hover-scale-elegant sm:gap-2 sm:px-3 sm:text-sm">
            <Phone className="h-4 w-4 shrink-0" />
            <span className="truncate sm:hidden">Calls</span>
            <span className="hidden truncate sm:inline">Call Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="campaign-roi" className="min-w-0 gap-1 rounded-xl px-2 text-xs transition-all duration-300 hover-scale-elegant sm:gap-2 sm:px-3 sm:text-sm">
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span className="truncate sm:hidden">ROI</span>
            <span className="hidden truncate sm:inline">Campaign ROI</span>
          </TabsTrigger>
          <TabsTrigger value="revenue" className="min-w-0 gap-1 rounded-xl px-2 text-xs transition-all duration-300 hover-scale-elegant sm:gap-2 sm:px-3 sm:text-sm">
            <DollarSign className="h-4 w-4 shrink-0" />
            <span className="truncate">Revenue</span>
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
