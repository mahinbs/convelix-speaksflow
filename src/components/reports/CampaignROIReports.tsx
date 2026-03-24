
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, DollarSign, TrendingUp, Target, Calculator } from 'lucide-react';
import { useCampaignROIData } from '@/hooks/useCampaignROIData';
import { Skeleton } from '@/components/ui/skeleton';

export const CampaignROIReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const { data, isLoading, error } = useCampaignROIData();

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading campaign ROI data</p>
      </div>
    );
  }

  const totalSpent = data?.campaignROIData?.reduce((sum, campaign) => sum + campaign.spent, 0) || 0;
  const totalRevenue = data?.campaignROIData?.reduce((sum, campaign) => sum + campaign.revenue, 0) || 0;
  const avgROI = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent * 100).toFixed(1) : '0';

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
              <SelectItem value="1y">Last year</SelectItem>
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

      {/* Key ROI Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-brand-700">
                  {totalRevenue > 45000 ? '+' : ''}
                  {((totalRevenue - 45000) / 45000 * 100).toFixed(1)}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <Target className="h-4 w-4 text-brand-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{avgROI}%</div>
                <p className="text-xs text-brand-700">
                  {Number(avgROI) > 250 ? 'Above' : 'Below'} industry average
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Calculator className="h-4 w-4 text-brand-700" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {totalRevenue > 0 ? (((totalRevenue - totalSpent) / totalRevenue) * 100).toFixed(1) : '0'}%
                </div>
                <p className="text-xs text-muted-foreground">Net profit margin</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Campaign ROI Comparison */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Campaign ROI Comparison</CardTitle>
            <CardDescription>Return on investment by campaign</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.campaignROIData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="campaign" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'roi' ? `${value}%` : `$${value}`,
                    name === 'roi' ? 'ROI' : name === 'spent' ? 'Spent' : 'Revenue'
                  ]} />
                  <Bar dataKey="spent" fill="#ef4444" name="spent" />
                  <Bar dataKey="revenue" fill="#10b981" name="revenue" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Monthly ROI Trends */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>ROI Trends Over Time</CardTitle>
            <CardDescription>Monthly performance tracking</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.monthlyROITrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="roi" stroke="#3b82f6" strokeWidth={3} name="ROI %" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Detailed Campaign Metrics */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detailed Campaign Performance</CardTitle>
            <CardDescription>Comprehensive metrics for each campaign</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Campaign</th>
                      <th className="text-right p-2">Spent</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">ROI</th>
                      <th className="text-right p-2">CPA</th>
                      <th className="text-right p-2">CLV</th>
                      <th className="text-right p-2">Conversions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.campaignROIData || []).map((campaign) => (
                      <tr key={campaign.campaign} className="border-b hover:bg-muted">
                        <td className="p-2 font-medium">{campaign.campaign}</td>
                        <td className="p-2 text-right text-destructive">${campaign.spent.toLocaleString()}</td>
                        <td className="p-2 text-right text-brand-700">${campaign.revenue.toLocaleString()}</td>
                        <td className="p-2 text-right">
                          <span className={`font-medium ${campaign.roi > 250 ? 'text-brand-700' : 'text-brand-700'}`}>
                            {campaign.roi}%
                          </span>
                        </td>
                        <td className="p-2 text-right">${campaign.cpa.toFixed(2)}</td>
                        <td className="p-2 text-right">${campaign.clv.toLocaleString()}</td>
                        <td className="p-2 text-right">{campaign.conversions}</td>
                      </tr>
                    ))}
                    {(!data?.campaignROIData || data.campaignROIData.length === 0) && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted-foreground py-4">
                          No campaign data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Cost Breakdown Analysis</CardTitle>
            <CardDescription>Where your campaign budget is being spent</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="space-y-4">
                {(data?.costBreakdown || []).map((cost) => (
                  <div key={cost.category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{cost.category}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold">${cost.amount.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-2">({cost.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${cost.percentage}%` }}
                      ></div>
                    </div>
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
