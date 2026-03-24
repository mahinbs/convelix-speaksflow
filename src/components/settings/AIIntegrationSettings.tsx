import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, ExternalLink, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OpenAIConfigurationPanel } from '@/components/admin/OpenAIConfigurationPanel';

export const AIIntegrationSettings: React.FC = () => {
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  return <div className="space-y-6">
    <Card>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-brand-700" />
              </div>
              <div>
                <h4 className="font-medium">AI</h4>
                <p className="text-sm text-muted-foreground">Voice calling and conversation AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>Connected</span>
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setShowConfigDialog(true)}>
                <Settings className="w-4 h-4 mr-1" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI Configuration</DialogTitle>
        </DialogHeader>
        <OpenAIConfigurationPanel variant="plain" />
      </DialogContent>
    </Dialog>

    <Card>
      <CardHeader>
        <CardTitle>Global AI Preferences</CardTitle>
        <CardDescription>
          Default settings applied across all AI integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Default Voice Model</h4>
            <p className="text-sm text-muted-foreground mb-2">Fallback voice when integration-specific voice is unavailable</p>
            <Badge variant="outline">gpt-3.5-turbo</Badge>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Call Recording</h4>
            <p className="text-sm text-muted-foreground mb-2">Default recording behavior for all calls</p>
            <Badge variant="outline">Enabled</Badge>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">AI Analysis</h4>
            <p className="text-sm text-muted-foreground mb-2">Automatic call analysis and insights</p>
            <Badge variant="outline">Enabled</Badge>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Sentiment Analysis</h4>
            <p className="text-sm text-muted-foreground mb-2">Track conversation sentiment in real-time</p>
            <Badge variant="outline">Enabled</Badge>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline">
            Update Global Settings
          </Button>
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-1" />
            View Integration Docs
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Integration Health</CardTitle>
        <CardDescription>
          Monitor the status and performance of your AI integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">API Response Time</span>
            <span className="text-sm text-brand-700">Under 200ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Success Rate (24h)</span>
            <span className="text-sm text-brand-700">99.2%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Calls Today</span>
            <span className="text-sm">47</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Credits Remaining</span>
            <span className="text-sm">1,247</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>;
};