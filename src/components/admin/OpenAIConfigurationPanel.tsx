import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Key, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { openAIClient } from '@/integrations/openai/client';

interface OpenAIConfigurationPanelProps {
  variant?: 'card' | 'plain';
}

export const OpenAIConfigurationPanel: React.FC<OpenAIConfigurationPanelProps> = ({
  variant = 'card'
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const existingApiKey = await openAIClient.getApiKey();
      if (existingApiKey) {
        setApiKey(existingApiKey);
        openAIClient.setApiKey(existingApiKey);
        await openAIClient.testConnection();
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    }
  };

  const handleConfigureOpenAI = async () => {
    if (!apiKey.startsWith('sk-')) {
      toast({
        title: 'Invalid API Key',
        description: 'OpenAI API keys should start with "sk-"',
        variant: 'destructive',
      });
      return;
    }

    setIsConfiguring(true);

    try {
      // Test the API key first by temporarily setting it
      const testClient = openAIClient;
      testClient.setApiKey(apiKey);

      // Test connection with the provided API key
      await testClient.testConnection();

      // Only save the API key if the test was successful
      const saved = await openAIClient.saveApiKey(apiKey);
      if (!saved) {
        throw new Error('Failed to save API key');
      }

      setIsConnected(true);
      toast({
        title: 'Success',
        description: 'OpenAI API key has been saved and validated successfully.',
      });

      // Clear the input for security
      setApiKey('');
    } catch (error: any) {
      console.error('Error configuring OpenAI:', error);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to configure OpenAI. Please check your API key.',
        variant: 'destructive',
      });
      setIsConnected(false);
    } finally {
      setIsConfiguring(false);
    }
  };

  const content = (
    <>
      <div className={`bg-${isConnected ? 'green' : 'yellow'}-50 border border-${isConnected ? 'green' : 'yellow'}-200 rounded-lg p-4`}>
        <div className="flex items-start space-x-2">
          {isConnected ? (
            <CheckCircle className="w-5 h-5 text-brand-700 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-brand-700 mt-0.5" />
          )}
          <div>
            <h5 className={`font-medium text-${isConnected ? 'green' : 'yellow'}-900`}>
              {isConnected ? 'OpenAI Connected' : 'OpenAI API Key Missing'}
            </h5>
            <p className={`text-sm text-${isConnected ? 'green' : 'yellow'}-800 mt-1`}>
              {isConnected
                ? 'Your OpenAI integration is active and ready for enhanced call analysis.'
                : 'The system is currently using a basic fallback analyzer because the OpenAI API key is not configured.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your API key will be securely stored for your account
          </p>
        </div>

        <Button
          onClick={handleConfigureOpenAI}
          disabled={!apiKey || isConfiguring}
          className="w-full"
        >
          {isConfiguring ? 'Validating...' : isConnected ? 'Update API Key' : 'Configure OpenAI'}
        </Button>
      </div>

      <div>
        <h5 className="font-medium mb-2">Next Steps:</h5>
        <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
          <li>Get your OpenAI API key from the OpenAI dashboard</li>
          <li>Enter and validate it using the form above</li>
          <li>Run bulk reanalysis to update all call scores</li>
        </ol>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" asChild>
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            OpenAI API Keys
          </a>
        </Button>
      </div>
    </>
  );

  if (variant === 'plain') {
    return <div className="space-y-4">{content}</div>;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-brand-600" />
          <span>OpenAI Configuration</span>
        </CardTitle>
        <CardDescription>
          Configure OpenAI API key for enhanced call analysis and lead scoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {content}
      </CardContent>
    </Card>
  );
};
