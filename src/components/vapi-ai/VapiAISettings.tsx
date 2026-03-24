
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Key, Webhook, Globe } from 'lucide-react';

export const VapiAISettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vapi AI Settings</h2>
        <p className="text-muted-foreground">Configure your Vapi.ai integration and API settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>API Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your Vapi.ai API credentials and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vapi-api-key">Vapi API Key</Label>
              <Input 
                id="vapi-api-key" 
                type="password" 
                placeholder="Enter your Vapi.ai API key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vapi-assistant-id">Default Assistant ID</Label>
              <Input 
                id="vapi-assistant-id" 
                placeholder="Enter default assistant ID"
              />
            </div>
            <Button className="w-full">
              Save API Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Webhook className="w-5 h-5" />
              <span>Webhook Configuration</span>
            </CardTitle>
            <CardDescription>
              Set up webhooks for real-time call events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input 
                id="webhook-url" 
                placeholder="https://your-domain.com/webhook"
                value="https://tmyyrcmeiaokzlhgtabp.supabase.co/functions/v1/vapi-webhook"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Webhook Secret</Label>
              <Input 
                id="webhook-secret" 
                type="password"
                placeholder="Enter webhook secret"
              />
            </div>
            <Button className="w-full">
              Update Webhook Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Default Settings</span>
            </CardTitle>
            <CardDescription>
              Configure default settings for new assistants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-voice">Default Voice</Label>
              <Input 
                id="default-voice" 
                placeholder="jennifer"
                defaultValue="jennifer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-model">Default Model</Label>
              <Input 
                id="default-model" 
                placeholder="gpt-3.5-turbo"
                defaultValue="gpt-3.5-turbo"
              />
            </div>
            <Button className="w-full">
              Save Default Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Integration Status</span>
            </CardTitle>
            <CardDescription>
              Current status of your Vapi.ai integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">API Connection</span>
              <span className="px-2 py-1 bg-brand-100 text-brand-900 rounded-full text-xs">
                Not Configured
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Webhook Status</span>
              <span className="px-2 py-1 bg-muted/90 text-foreground rounded-full text-xs">
                Inactive
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Phone Numbers</span>
              <span className="px-2 py-1 bg-muted/90 text-foreground rounded-full text-xs">
                0 Active
              </span>
            </div>
            <Button variant="outline" className="w-full">
              Test Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
