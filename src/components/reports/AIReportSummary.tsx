
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Brain, TrendingUp, Target, Clock, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useAIReportInsights } from '@/hooks/useAIReportInsights';
import { Skeleton } from '@/components/ui/skeleton';

export const AIReportSummary: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: aiInsights, isLoading, error } = useAIReportInsights();

  if (error && !aiInsights) {
    return null; // Don't show anything if there's an error and no fallback data
  }

  return (
    <Card className="mb-8 bg-gradient-to-r from-brand-50 to-secondary border-brand-200">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-brand-50/50 transition-colors">
            <div className="flex flex-wrap gap-5 items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-brand-100 rounded-lg">
                  <Brain className="h-6 w-6 text-brand-700" />
                </div>
                <div>
                  <CardTitle className="text-xl text-brand-900">AI Performance Summary</CardTitle>
                  <CardDescription className="text-brand-800">
                    AI-powered insights and deal closing recommendations
                  </CardDescription>
                </div>
              </div>
              <Button  size="sm" className="text-white w-full md:w-auto">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* AI Summary */}
                <div className="bg-card p-4 rounded-lg border border-brand-100">
                  <h3 className="font-semibold text-brand-900 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Performance Overview
                  </h3>
                  <p className="text-foreground leading-relaxed">{aiInsights?.summary}</p>
                </div>

                {/* Key Insights Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-card p-4 rounded-lg border border-brand-100">
                    <div className="flex items-center mb-2">
                      <Target className="h-4 w-4 text-brand-700 mr-2" />
                      <h4 className="font-medium text-foreground">Top Performer</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{aiInsights?.insights?.topPerformer}</p>
                  </div>

                  <div className="bg-card p-4 rounded-lg border border-brand-100">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 text-brand-700 mr-2" />
                      <h4 className="font-medium text-foreground">Best Call Time</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{aiInsights?.insights?.bestTimeToCall}</p>
                  </div>

                  <div className="bg-card p-4 rounded-lg border border-brand-100">
                    <div className="flex items-center mb-2">
                      <Lightbulb className="h-4 w-4 text-brand-600 mr-2" />
                      <h4 className="font-medium text-foreground">Success Factors</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {aiInsights?.insights?.keySuccessFactors?.join(', ') || 'Analyzing patterns...'}
                    </p>
                  </div>
                </div>

                {/* Deal Closing Recommendations */}
                <div className="bg-card p-4 rounded-lg border border-brand-100">
                  <h3 className="font-semibold text-brand-900 mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    AI Deal Closing Recommendations
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {aiInsights?.recommendations?.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-brand-50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-brand-600 to-brand-800 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-1">Ready to close more deals?</h4>
                      <p className="text-sm text-primary-foreground/90">
                        Apply these AI insights to optimize your lead conversion strategy.
                      </p>
                    </div>
                    <Button variant="secondary" size="sm" className="bg-white text-brand-700 hover:bg-brand-50">
                      View Leads
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
