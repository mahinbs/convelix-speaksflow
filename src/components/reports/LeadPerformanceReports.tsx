
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter } from 'lucide-react';
import { useLeadPerformanceData } from '@/hooks/useLeadPerformanceData';
import { Skeleton } from '@/components/ui/skeleton';

export const LeadPerformanceReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [sourceFilter, setSourceFilter] = useState('all');
  const { data, isLoading, error } = useLeadPerformanceData();

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading lead performance data</p>
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
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Lead Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="facebook">Facebook Ads</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="upload">Direct Upload</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Lead Conversion Funnel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Lead Conversion Funnel</CardTitle>
            <CardDescription>Track leads through the qualification process</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.leadConversionData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Lead Source Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Source Performance</CardTitle>
            <CardDescription>Conversion rates by source</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <div className="space-y-4">
                {(data?.leadSourceData || []).map((source) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{source.source}</span>
                      <span className="text-sm text-muted-foreground">{source.conversion}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.min(source.conversion, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{source.leads} leads</span>
                      <span>{source.qualified} qualified</span>
                    </div>
                  </div>
                ))}
                {(!data?.leadSourceData || data.leadSourceData.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">No lead source data available</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lead Quality Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Quality Scores</CardTitle>
            <CardDescription>AI-generated lead score distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data?.leadScoreData || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ score, count }) => count > 0 ? `${score}: ${count}` : ''}
                  >
                    {(data?.leadScoreData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Lead Performance Trends</CardTitle>
            <CardDescription>Monthly progression of lead metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.monthlyLeadTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="imported" stroke="#3b82f6" name="Imported" />
                  <Line type="monotone" dataKey="qualified" stroke="#10b981" name="Qualified" />
                  <Line type="monotone" dataKey="converted" stroke="#f59e0b" name="Converted" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
