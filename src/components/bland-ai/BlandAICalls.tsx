import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Play, Eye, TrendingUp, User, Clock, Target, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBlandAICalls, useTriggerAIAnalysis, useBlandAICallsSync, BlandAICall } from '@/hooks/useBlandAICalls';
import { CallDetailsDialog } from './CallDetailsDialog';
import { AIAnalysisDialog } from './AIAnalysisDialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Number of calls to display per page
const CALLS_PER_PAGE = 10;

// Memoized Call Item Component to prevent unnecessary re-renders
const CallItem = React.memo(({ 
  call, 
  onViewTranscript, 
  onPlayRecording, 
  onViewAIAnalysis, 
  triggerAIAnalysis,
  getScoreColor,
  getQualificationColor,
  isAnalyzing
}: { 
  call: BlandAICall, 
  onViewTranscript: (call: BlandAICall) => void,
  onPlayRecording: (call: BlandAICall) => void,
  onViewAIAnalysis: (call: BlandAICall) => void,
  triggerAIAnalysis: (callId: string, transcript: string) => void,
  getScoreColor: (score: number | null) => string,
  getQualificationColor: (status: string | null) => string,
  isAnalyzing: (call: BlandAICall) => boolean
}) => {
  // Memoize the parsed AI analysis to prevent recalculation
  const parsedAIAnalysis = useMemo(() => {
    if (!call.ai_analysis) return null;
    try {
      return typeof call.ai_analysis === 'string' ? JSON.parse(call.ai_analysis) : call.ai_analysis;
    } catch (error) {
      console.error('Error parsing AI analysis:', error);
      return null;
    }
  }, [call.ai_analysis]);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      {/* Call Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="font-medium">{call.phone_number}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>
                {call.created_at ? new Date(call.created_at).toLocaleString() : 'Unknown time'}
              </span>
              {call.duration && (
                <span>{Math.round(call.duration / 60)} min</span>
              )}
              {call.outcome && (
                <span className="capitalize">{call.outcome}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Call Status */}
          <Badge
            variant={
              call.status === 'completed' ? 'default' :
                call.status === 'pending' ? 'secondary' :
                  call.status === 'in_progress' ? 'default' : 'destructive'
            }
          >
            {call.status.replace('_', ' ')}
          </Badge>

          <div className="flex space-x-2">
            {call.transcript && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewTranscript(call)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}

            {call.recording_url && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPlayRecording(call)}
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      {call.status === 'completed' && (
        <div className="border-t pt-4">
          {isAnalyzing(call) ? (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Analyzing transcript...</span>
            </div>
          ) : call.ai_analysis ? (
            <div className="space-y-3">
              {/* Analysis Header */}
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">AI Analysis</h4>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (call.transcript) {
                        triggerAIAnalysis(call.id, call.transcript);
                      }
                    }}
                    className="text-brand-700 border-brand-200 hover:bg-brand-50"
                    disabled={!call.transcript || isAnalyzing(call)}
                  >
                    {isAnalyzing(call) ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Reanalyze
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewAIAnalysis(call)}
                    className="text-brand-700 border-brand-200 hover:bg-brand-50"
                  >
                    View Full Report
                  </Button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Lead Score */}
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 px-3 py-1 rounded-lg ${getScoreColor(call.lead_score)}`}>
                    {call.lead_score || 0}/100
                  </div>
                  <p className="text-xs text-muted-foreground">Lead Score</p>
                </div>

                {/* Qualification Status */}
                <div className="text-center">
                  <Badge className={getQualificationColor(call.qualification_status)}>
                    {call.qualification_status || 'Unknown'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">Status</p>
                </div>

                {/* Interest Level */}
                {parsedAIAnalysis?.interestLevel && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-700 mb-1">
                      {parsedAIAnalysis.interestLevel}/10
                    </div>
                    <p className="text-xs text-muted-foreground">Interest</p>
                  </div>
                )}

                {/* Sentiment */}
                {parsedAIAnalysis?.sentiment && (
                  <div className="text-center">
                    <Badge variant={parsedAIAnalysis.sentiment === 'Positive' ? 'default' : 'secondary'}>
                      {parsedAIAnalysis.sentiment}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Sentiment</p>
                  </div>
                )}
              </div>

              {/* Key Insights - Only render if they exist */}
              {parsedAIAnalysis?.keyInsights?.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">Key Insights</h5>
                  <div className="space-y-1">
                    {parsedAIAnalysis.keyInsights.slice(0, 2).map((insight: string, index: number) => (
                      <div key={index} className="text-xs bg-brand-50 text-brand-800 px-2 py-1 rounded">
                        • {insight}
                      </div>
                    ))}
                    {parsedAIAnalysis.keyInsights.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{parsedAIAnalysis.keyInsights.length - 2} more insights
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Next Best Action - Only render if it exists */}
              {parsedAIAnalysis?.nextBestAction && (
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-1">Recommended Action</h5>
                  <div className="bg-brand-50 border border-brand-200 rounded-lg p-2">
                    <p className="text-xs text-brand-800">{parsedAIAnalysis.nextBestAction}</p>
                  </div>
                </div>
              )}
            </div>
          ) : call.transcript ? (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
              <span>Analysis will be available shortly...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
              <span>No transcript available for analysis</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// Use named export for lazy loading
export const BlandAICalls: React.FC = () => {
  const { data: calls = [], isLoading, refetch } = useBlandAICalls();
  const triggerAIAnalysis = useTriggerAIAnalysis();
  const [selectedCall, setSelectedCall] = useState<BlandAICall | null>(null);
  const [dialogView, setDialogView] = useState<'transcript' | 'recording' | null>(null);
  const [aiAnalysisCall, setAiAnalysisCall] = useState<BlandAICall | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Enable background sync for call statuses and automatic analysis
  useBlandAICallsSync();

  // Calculate total pages
  const totalPages = Math.ceil(calls.length / CALLS_PER_PAGE);
  
  // Get current page calls
  const currentCalls = useMemo(() => {
    const startIndex = (currentPage - 1) * CALLS_PER_PAGE;
    return calls.slice(startIndex, startIndex + CALLS_PER_PAGE);
  }, [calls, currentPage]);

  // Memoized helper functions
  const getScoreColor = useCallback((score: number | null) => {
    if (!score) return 'bg-muted/90 text-muted-foreground';
    if (score >= 71) return 'bg-brand-100 text-brand-800';
    if (score >= 51) return 'bg-brand-100 text-brand-900';
    if (score >= 31) return 'bg-brand-100 text-brand-800';
    return 'bg-destructive/15 text-destructive';
  }, []);

  const getQualificationColor = useCallback((status: string | null) => {
    switch (status) {
      case 'Hot': return 'bg-destructive/100 text-white';
      case 'Warm': return 'bg-brand-500 text-white';
      case 'Cold': return 'bg-brand-500 text-white';
      case 'Unqualified': return 'bg-muted-foreground/70 text-primary-foreground';
      default: return 'bg-muted text-foreground';
    }
  }, []);

  const isAnalyzing = useCallback((call: BlandAICall) => {
    return call.status === 'completed' && call.transcript && !call.ai_analysis;
  }, []);

  // Event handlers
  const handleViewTranscript = useCallback((call: BlandAICall) => {
    setSelectedCall(call);
    setDialogView('transcript');
  }, []);

  const handlePlayRecording = useCallback((call: BlandAICall) => {
    setSelectedCall(call);
    setDialogView('recording');
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedCall(null);
    setDialogView(null);
  }, []);

  const handleViewAIAnalysis = useCallback((call: BlandAICall) => {
    try {
      // Parse the analysis JSON if it's a string
      const parsedAnalysis = typeof call.ai_analysis === 'string' ? JSON.parse(call.ai_analysis) : call.ai_analysis;

      // Ensure we have all required fields with defaults
      const analysis = {
        leadScore: call.lead_score || parsedAnalysis.leadScore || 0,
        qualificationStatus: call.qualification_status || parsedAnalysis.qualificationStatus || 'Unqualified',
        sentiment: parsedAnalysis.sentiment || 'Neutral',
        detailedSummary: parsedAnalysis.detailedSummary || '',
        keyInsights: parsedAnalysis.keyInsights || [],
        followUpActions: parsedAnalysis.followUpActions || [],
        persuasionStrategy: parsedAnalysis.persuasionStrategy || '',
        psychologyProfile: parsedAnalysis.psychologyProfile || '',
        communicationStyle: parsedAnalysis.communicationStyle || '',
        objections: parsedAnalysis.objections || [],
        objectionHandling: parsedAnalysis.objectionHandling || [],
        persuasionTactics: parsedAnalysis.persuasionTactics || [],
        interestLevel: parsedAnalysis.interestLevel || 0,
        decisionAuthority: parsedAnalysis.decisionAuthority || 'Unknown',
        timeline: parsedAnalysis.timeline || 'Not specified',
        nextBestAction: parsedAnalysis.nextBestAction || 'No specific recommendation available',
        analyzerUsed: call.analyzer_used || parsedAnalysis.analyzerUsed || 'unknown',
        openAIError: parsedAnalysis.openAIError || null
      };

      setAiAnalysisCall({
        ...call,
        ai_analysis: analysis
      });
    } catch (error) {
      console.error('Error parsing AI analysis:', error);
      // If parsing fails, show basic analysis with available data
      setAiAnalysisCall({
        ...call,
        ai_analysis: {
          leadScore: call.lead_score || 0,
          qualificationStatus: call.qualification_status || 'Unqualified',
          sentiment: 'Neutral',
          detailedSummary: '',
          keyInsights: [],
          followUpActions: [],
          persuasionStrategy: '',
          psychologyProfile: '',
          communicationStyle: '',
          objections: [],
          objectionHandling: [],
          persuasionTactics: [],
          interestLevel: 0,
          decisionAuthority: 'Unknown',
          timeline: 'Not specified',
          nextBestAction: 'No specific recommendation available',
          analyzerUsed: call.analyzer_used || 'unknown',
          openAIError: null
        }
      });
    }
  }, []);

  const handleCloseAIAnalysis = useCallback(() => {
    setAiAnalysisCall(null);
  }, []);

  // Pagination handlers
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="space-y-6 min-h-[400px]">
        <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-[600px]">
      {/* Header Section with Fixed Positioning */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 border-b border-border/40">
        <div className="p-2">
          <h2 className="text-2xl font-bold mb-2">Call History</h2>
          <p className="text-muted-foreground">View and manage all AI phone calls with automatic AI-powered lead scoring</p>
        </div>
      </div>

      {/* Content Section with Proper Spacing */}
      <div className="pt-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Calls</CardTitle>
                <CardDescription>All AI phone calls made through Bland.ai with automatic lead qualification analysis</CardDescription>
              </div>
              {calls.length > CALLS_PER_PAGE && (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToPrevPage} 
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToNextPage} 
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {calls.length === 0 ? (
              <div className="text-center py-12">
                <Phone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No calls made yet</h3>
                <p className="text-muted-foreground">
                  Start a campaign to begin making AI phone calls to your leads
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4 pr-4">
                  {currentCalls.map((call) => (
                    <CallItem
                      key={call.id}
                      call={call}
                      onViewTranscript={handleViewTranscript}
                      onPlayRecording={handlePlayRecording}
                      onViewAIAnalysis={handleViewAIAnalysis}
                      triggerAIAnalysis={triggerAIAnalysis}
                      getScoreColor={getScoreColor}
                      getQualificationColor={getQualificationColor}
                      isAnalyzing={isAnalyzing}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      <CallDetailsDialog
        open={!!selectedCall && !!dialogView}
        onClose={handleCloseDialog}
        call={selectedCall}
        view={dialogView}
      />

      <AIAnalysisDialog
        open={!!aiAnalysisCall}
        onClose={handleCloseAIAnalysis}
        analysis={aiAnalysisCall?.ai_analysis}
        callData={aiAnalysisCall}
      />
    </div>
  );
};
