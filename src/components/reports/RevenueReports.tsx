
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { Download, DollarSign, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';
import { useRevenueData } from '@/hooks/useRevenueData';
import { Skeleton } from '@/components/ui/skeleton';

export const RevenueReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('12m');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const { data, isLoading, error } = useRevenueData();

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading revenue data</p>
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
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="24m">Last 24 months</SelectItem>
            </SelectContent>
          </Select>

          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Customer Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="mid-market">Mid-Market</SelectItem>
              <SelectItem value="small-business">Small Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>

      {/* Key Revenue Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">${data?.revenueMetrics?.totalRevenue?.toLocaleString() || 0}</div>
                <p className="text-xs text-brand-700">+{data?.revenueMetrics?.monthlyGrowth || 0}% this month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARR Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.revenueMetrics?.arrGrowth || 0}%</div>
                <p className="text-xs text-brand-700">Annual recurring revenue</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <CreditCard className="h-4 w-4 text-brand-700" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">${data?.revenueMetrics?.avgDealSize || 0}</div>
                <p className="text-xs text-muted-foreground">Per customer</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
            <PiggyBank className="h-4 w-4 text-brand-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">${data?.revenueMetrics?.customerLTV || 0}</div>
                <p className="text-xs text-brand-700">Lifetime value</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Revenue Trends */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue Trends & Forecast</CardTitle>
            <CardDescription>Actual vs forecasted revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data?.monthlyRevenueData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="recurring" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="one_time" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Source */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Industry</CardTitle>
            <CardDescription>Performance breakdown by vertical</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="space-y-4">
                {(data?.revenueBySource || []).map((source) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{source.source}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold">${source.revenue.toLocaleString()}</span>
                        <span className={`text-xs ml-2 ${source.growth >= 0 ? 'text-brand-700' : 'text-destructive'}`}>
                          {source.growth >= 0 ? '+' : ''}{source.growth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.min(source.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {(!data?.revenueBySource || data.revenueBySource.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">No revenue source data available</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Segment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Customer Segment</CardTitle>
            <CardDescription>Performance across different customer tiers</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data?.customerSegmentRevenue || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="segment" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Customers'
                  ]} />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Detailed Revenue Metrics */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detailed Customer Segment Metrics</CardTitle>
            <CardDescription>Comprehensive analysis by customer tier</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Segment</th>
                      <th className="text-right p-2">Customers</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">Avg Value</th>
                      <th className="text-right p-2">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.customerSegmentRevenue || []).map((segment) => {
                      const totalRevenue = data?.customerSegmentRevenue?.reduce((sum, s) => sum + s.revenue, 0) || 1;
                      const percentage = ((segment.revenue / totalRevenue) * 100).toFixed(1);
                      return (
                        <tr key={segment.segment} className="border-b hover:bg-muted">
                          <td className="p-2 font-medium">{segment.segment}</td>
                          <td className="p-2 text-right">{segment.customers}</td>
                          <td className="p-2 text-right font-bold text-brand-700">
                            ${segment.revenue.toLocaleString()}
                          </td>
                          <td className="p-2 text-right">${segment.avg_value}</td>
                          <td className="p-2 text-right">{percentage}%</td>
                        </tr>
                      );
                    })}
                    {(!data?.customerSegmentRevenue || data.customerSegmentRevenue.length === 0) && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted-foreground py-4">
                          No customer segment data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Key Financial Metrics</CardTitle>
            <CardDescription>Important business health indicators</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[100px] w-full" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{data?.revenueMetrics?.churnRate || 0}%</div>
                  <div className="text-sm text-muted-foreground">Monthly Churn Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-600">{data?.revenueMetrics?.paybackPeriod || 0}</div>
                  <div className="text-sm text-muted-foreground">Payback Period (months)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-600">94.2%</div>
                  <div className="text-sm text-muted-foreground">Gross Revenue Retention</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-700">112.8%</div>
                  <div className="text-sm text-muted-foreground">Net Revenue Retention</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
