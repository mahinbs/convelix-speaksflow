
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateCredentials, useTestConnection } from '@/hooks/useIntegrationCredentials';

interface CredentialFormProps {
  sourceType: string;
  onSuccess?: () => void;
}

export const FacebookCredentialForm: React.FC<CredentialFormProps> = ({ sourceType, onSuccess }) => {
  const [credentials, setCredentials] = useState({
    appId: '',
    appSecret: '',
    accessToken: '',
    adAccountId: ''
  });

  const createCredentials = useCreateCredentials();
  const testConnection = useTestConnection();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Test connection first
      await testConnection.mutateAsync({ sourceType, credentials });
      
      // Save credentials if test passes
      await createCredentials.mutateAsync({
        source_type: sourceType,
        credentials,
        is_active: true
      });

      toast({
        title: "Success",
        description: "Facebook credentials saved and validated successfully.",
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate or save credentials. Please check your information.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="appId">App ID</Label>
        <Input
          id="appId"
          value={credentials.appId}
          onChange={(e) => setCredentials({ ...credentials, appId: e.target.value })}
          placeholder="Your Facebook App ID"
          required
        />
      </div>
      <div>
        <Label htmlFor="appSecret">App Secret</Label>
        <Input
          id="appSecret"
          type="password"
          value={credentials.appSecret}
          onChange={(e) => setCredentials({ ...credentials, appSecret: e.target.value })}
          placeholder="Your Facebook App Secret"
          required
        />
      </div>
      <div>
        <Label htmlFor="accessToken">Access Token</Label>
        <Input
          id="accessToken"
          type="password"
          value={credentials.accessToken}
          onChange={(e) => setCredentials({ ...credentials, accessToken: e.target.value })}
          placeholder="Your Facebook Access Token"
          required
        />
      </div>
      <div>
        <Label htmlFor="adAccountId">Ad Account ID</Label>
        <Input
          id="adAccountId"
          value={credentials.adAccountId}
          onChange={(e) => setCredentials({ ...credentials, adAccountId: e.target.value })}
          placeholder="act_1234567890"
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={createCredentials.isPending || testConnection.isPending}
        className="w-full"
      >
        {testConnection.isPending ? 'Testing Connection...' : 
         createCredentials.isPending ? 'Saving...' : 'Save & Test Connection'}
      </Button>
    </form>
  );
};

export const LinkedInCredentialForm: React.FC<CredentialFormProps> = ({ sourceType, onSuccess }) => {
  const [credentials, setCredentials] = useState({
    clientId: '',
    clientSecret: '',
    accessToken: ''
  });

  const createCredentials = useCreateCredentials();
  const testConnection = useTestConnection();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await testConnection.mutateAsync({ sourceType, credentials });
      await createCredentials.mutateAsync({
        source_type: sourceType,
        credentials,
        is_active: true
      });

      toast({
        title: "Success",
        description: "LinkedIn credentials saved and validated successfully.",
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate or save credentials. Please check your information.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="clientId">Client ID</Label>
        <Input
          id="clientId"
          value={credentials.clientId}
          onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
          placeholder="Your LinkedIn Client ID"
          required
        />
      </div>
      <div>
        <Label htmlFor="clientSecret">Client Secret</Label>
        <Input
          id="clientSecret"
          type="password"
          value={credentials.clientSecret}
          onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
          placeholder="Your LinkedIn Client Secret"
          required
        />
      </div>
      <div>
        <Label htmlFor="accessToken">Access Token</Label>
        <Input
          id="accessToken"
          type="password"
          value={credentials.accessToken}
          onChange={(e) => setCredentials({ ...credentials, accessToken: e.target.value })}
          placeholder="Your LinkedIn Access Token"
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={createCredentials.isPending || testConnection.isPending}
        className="w-full"
      >
        {testConnection.isPending ? 'Testing Connection...' : 
         createCredentials.isPending ? 'Saving...' : 'Save & Test Connection'}
      </Button>
    </form>
  );
};

export const GoogleSheetsCredentialForm: React.FC<CredentialFormProps> = ({ sourceType, onSuccess }) => {
  const [credentials, setCredentials] = useState({
    serviceAccountJson: '',
    spreadsheetId: ''
  });

  const createCredentials = useCreateCredentials();
  const testConnection = useTestConnection();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Parse JSON to validate format
      const serviceAccount = JSON.parse(credentials.serviceAccountJson);
      
      await testConnection.mutateAsync({ 
        sourceType, 
        credentials: {
          ...credentials,
          serviceAccountJson: serviceAccount
        }
      });
      
      await createCredentials.mutateAsync({
        source_type: sourceType,
        credentials: {
          ...credentials,
          serviceAccountJson: serviceAccount
        },
        is_active: true
      });

      toast({
        title: "Success",
        description: "Google Sheets credentials saved and validated successfully.",
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate credentials. Please check your service account JSON and spreadsheet ID.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="serviceAccountJson">Service Account JSON</Label>
        <Textarea
          id="serviceAccountJson"
          value={credentials.serviceAccountJson}
          onChange={(e) => setCredentials({ ...credentials, serviceAccountJson: e.target.value })}
          placeholder="Paste your Google Service Account JSON here"
          rows={6}
          required
        />
      </div>
      <div>
        <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
        <Input
          id="spreadsheetId"
          value={credentials.spreadsheetId}
          onChange={(e) => setCredentials({ ...credentials, spreadsheetId: e.target.value })}
          placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={createCredentials.isPending || testConnection.isPending}
        className="w-full"
      >
        {testConnection.isPending ? 'Testing Connection...' : 
         createCredentials.isPending ? 'Saving...' : 'Save & Test Connection'}
      </Button>
    </form>
  );
};

export const TypeformCredentialForm: React.FC<CredentialFormProps> = ({ sourceType, onSuccess }) => {
  const [credentials, setCredentials] = useState({
    accessToken: '',
    formId: ''
  });

  const createCredentials = useCreateCredentials();
  const testConnection = useTestConnection();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await testConnection.mutateAsync({ sourceType, credentials });
      await createCredentials.mutateAsync({
        source_type: sourceType,
        credentials,
        is_active: true
      });

      toast({
        title: "Success",
        description: "Typeform credentials saved and validated successfully.",
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate or save credentials. Please check your information.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="accessToken">Personal Access Token</Label>
        <Input
          id="accessToken"
          type="password"
          value={credentials.accessToken}
          onChange={(e) => setCredentials({ ...credentials, accessToken: e.target.value })}
          placeholder="Your Typeform Personal Access Token"
          required
        />
      </div>
      <div>
        <Label htmlFor="formId">Form ID</Label>
        <Input
          id="formId"
          value={credentials.formId}
          onChange={(e) => setCredentials({ ...credentials, formId: e.target.value })}
          placeholder="Your Typeform Form ID"
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={createCredentials.isPending || testConnection.isPending}
        className="w-full"
      >
        {testConnection.isPending ? 'Testing Connection...' : 
         createCredentials.isPending ? 'Saving...' : 'Save & Test Connection'}
      </Button>
    </form>
  );
};
