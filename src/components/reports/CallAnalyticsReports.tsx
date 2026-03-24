
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Download, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useCallAnalyticsData } from '@/hooks/useCallAnalyticsData';
import { Skeleton } from '@/components/ui/skeleton';

export const CallAnalyticsReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const { data, isLoading, error } = useCallAnalyticsData();

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading call analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="real-estate">Real Estate Q1</SelectItem>
              <SelectItem value="insurance">Insurance Leads</SelectItem>
              <SelectItem value="saas">SaaS Prospects</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.keyMetrics?.totalCalls || 0}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-brand-700" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.keyMetrics?.successRate || 0}%</div>
                <p className="text-xs text-brand-700">
                  {((data?.keyMetrics?.successRate || 0) - 71.1) >= 0 ? '+' : ''}
                  {((data?.keyMetrics?.successRate || 0) - 71.1).toFixed(1)}% from last week
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.keyMetrics?.avgDuration || '0:00'}</div>
                <p className="text-xs text-muted-foreground">Per successful call</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Per Call</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">${data?.keyMetrics?.costPerCall || 0}</div>
                <p className="text-xs text-destructive">+$0.12 from last week</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Call Volume */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Daily Call Volume & Success Rate</CardTitle>
            <CardDescription>Call activity and success trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data?.dailyCallVolume || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="calls" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="successful" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Campaign Success Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Success rates by campaign</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.campaignSuccessData || []} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="campaign" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Call Duration Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Call Duration Analysis</CardTitle>
            <CardDescription>Distribution of call lengths</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.callDurationData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="duration" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Call Outcomes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Call Outcome Distribution</CardTitle>
            <CardDescription>Breakdown of call results</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(data?.outcomeDistribution || []).map((outcome) => (
                  <div key={outcome.outcome} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-brand-700">{outcome.count}</div>
                    <div className="text-sm text-muted-foreground">{outcome.outcome}</div>
                    <div className="text-xs text-muted-foreground">{outcome.percentage}%</div>
                  </div>
                ))}
                {(!data?.outcomeDistribution || data.outcomeDistribution.length === 0) && (
                  <div className="col-span-full text-center text-muted-foreground py-4">
                    No call outcome data available
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
