import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BlandAIClient } from '@/integrations/bland-ai/client';
export const BlandAISettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const blandAI = new BlandAIClient();
  useEffect(() => {
    checkConnection();
  }, []);
  const checkConnection = async () => {
    try {
      const existingApiKey = await blandAI.getApiKey();
      if (existingApiKey) {
        setApiKey(existingApiKey);
        blandAI.setApiKey(existingApiKey);
        const isActive = await blandAI.testConnection();
        setIsConnected(isActive);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    }
  };
  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      // Test the API key first by temporarily setting it
      const testClient = new BlandAIClient();
      testClient.setApiKey(apiKey);

      // Test connection with the provided API key
      const isActive = await testClient.testConnection();
      if (!isActive) {
        throw new Error('Bland AI account is not active or API key is invalid');
      }

      // Only save the API key if the test was successful
      const saved = await blandAI.saveApiKey(apiKey);
      if (!saved) {
        throw new Error('Failed to save API key');
      }
      setIsConnected(true);
      toast({
        title: "Success",
        description: "Successfully connected to AI CALLER"
      });
    } catch (error: any) {
      console.error('Error connecting to AI CALLER:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to connect to AI CALLER. Please check your API key.",
        variant: "destructive"
      });
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Settings</h2>
        <p className="text-muted-foreground">Configure your Bland.ai integration and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="w-5 h-5" />
              <span>API Configuration</span>
            </CardTitle>
            <CardDescription>Configure your API key and connection settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brand-50 border border-brand-200 rounded-lg">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-brand-700" />
                    <span className="text-sm font-medium text-brand-800">Connected to AI CALLER</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-brand-700" />
                    <span className="text-sm font-medium text-brand-800">
                      API Key Required
                    </span>
                  </>
                )}
              </div>
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? "Connected" : "Not Connected"}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Bland.ai API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Get your API key from your provider.</p>
            </div>

            <Button
              className="w-full"
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : isConnected ? "Update AI CALLER" : "Connect to AI CALLER"}
            </Button>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Default Voice Settings</span>
            </CardTitle>
            <CardDescription>
              Set default voice and AI behavior for new campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice">Default Voice</Label>
              <Select disabled={!isConnected}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maya">Maya (Female, Professional)</SelectItem>
                  <SelectItem value="ryan">Ryan (Male, Friendly)</SelectItem>
                  <SelectItem value="alex">Alex (Male, Confident)</SelectItem>
                  <SelectItem value="sarah">Sarah (Female, Warm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en" disabled={!isConnected}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="speed">Speaking Speed</Label>
              <Select defaultValue="normal" disabled={!isConnected}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full" disabled={!isConnected}>
              Save Voice Settings
            </Button>
          </CardContent>
        </Card>

        {/* Phone Number Management */}
        <Card>
          <CardHeader>
            <CardTitle>Phone Numbers</CardTitle>
            <CardDescription>
              Manage your phone numbers for outbound calls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No phone numbers configured</p>
              <Button variant="outline" disabled={!isConnected}>
                Add Phone Number
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>
              Current status of your Bland.ai integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Connection</span>
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Phone Numbers</span>
                <Badge variant="secondary">0 Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Credits Remaining</span>
                <Badge variant="secondary">Unknown</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={checkConnection} disabled={!isConnected || isLoading}>
              Test Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};
