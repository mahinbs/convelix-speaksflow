
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BulkReanalysisButton } from './BulkReanalysisButton';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const QuickReanalysisPanel: React.FC = () => {
  const userEmail = 'mahinstlucia@gmail.com';

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-brand-600" />
          <span>AI Analysis Status & Reanalysis</span>
        </CardTitle>
        <CardDescription>
          Manage AI-powered lead scoring and call analysis for user accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium">mahinstlucia@gmail.com</h4>
              <p className="text-sm text-muted-foreground">Primary account with call data</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-brand-700 border-brand-300 bg-brand-50">
                Needs Reanalysis
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="text-sm">
              <span className="font-medium">Issue:</span> Calls receiving low scores (e.g., 20/100) due to missing OpenAI configuration
            </div>
            <div className="text-sm">
              <span className="font-medium">Expected:</span> Engaged conversations should score 65-75+ with proper analysis
            </div>
            <div className="text-sm">
              <span className="font-medium">Solution:</span> Configure OpenAI API key and reanalyze all calls
            </div>
          </div>

          <div className="flex space-x-2">
            <BulkReanalysisButton userEmail={userEmail} />
          </div>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-brand-700 mt-0.5" />
            <div>
              <h5 className="font-medium text-brand-900">What This Will Do:</h5>
              <ul className="text-sm text-brand-800 mt-1 space-y-1">
                <li>• Reset all existing AI analysis data</li>
                <li>• Re-run improved analysis on all 32+ calls</li>
                <li>• Apply better contextual scoring for engaged conversations</li>
                <li>• Use OpenAI if configured, otherwise enhanced fallback analyzer</li>
                <li>• Update lead qualification status based on new scores</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
