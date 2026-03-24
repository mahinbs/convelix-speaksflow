
import React, { useState } from 'react';
import { useLeadSources, useCreateLeadSource } from '@/hooks/useLeads';
import { useIntegrationCredentials, useTriggerSync } from '@/hooks/useIntegrationCredentials';
import { useToast } from '@/hooks/use-toast';
import { IntegrationCard } from './integrations/IntegrationCard';
import { IntegrationStats } from './integrations/IntegrationStats';
import { IntegrationDialog } from './integrations/IntegrationDialog';
import { IntegrationSetupGuide } from './integrations/IntegrationSetupGuide';
import { integrations } from '@/data/integrations';

export const IntegrationHub: React.FC = () => {
  const { data: leadSources = [], isLoading } = useLeadSources();
  const { data: credentials = [] } = useIntegrationCredentials();
  const createLeadSource = useCreateLeadSource();
  const triggerSync = useTriggerSync();
  const { toast } = useToast();
  
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [dialogMode, setDialogMode] = useState<'connect' | 'credentials'>('connect');

  const handleCreateIntegration = async (sourceType: string, sourceName: string) => {
    try {
      await createLeadSource.mutateAsync({
        source_type: sourceType,
        source_name: sourceName,
        is_active: true,
        api_config: {}
      });
      
      toast({
        title: "Integration Created",
        description: `${sourceName} integration has been set up successfully.`,
      });
      
      setSelectedIntegration(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create integration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSyncNow = async (sourceType: string) => {
    try {
      const result = await triggerSync.mutateAsync(sourceType);
      toast({
        title: "Sync Started",
        description: `Sync started for ${sourceType}. Check back in a few minutes for results.`,
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to start sync. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard.",
    });
  };

  const getIntegrationStatus = (sourceType: string) => {
    return leadSources.find(source => source.source_type === sourceType);
  };

  const getCredentialStatus = (sourceType: string) => {
    return credentials.find(cred => cred.source_type === sourceType && cred.is_active);
  };

  const handleAddCredentials = (integrationId: string) => {
    setSelectedIntegration(integrationId);
    setDialogMode('credentials');
  };

  const handleConnect = (integrationId: string) => {
    setSelectedIntegration(integrationId);
    setDialogMode('connect');
  };

  const handleCloseDialog = () => {
    setSelectedIntegration(null);
  };

  // Calculate stats
  const activeIntegrations = leadSources.filter(source => source.is_active).length;
  const totalLeads = leadSources.reduce((sum, source) => sum + (source.total_leads || 0), 0);
  const lastSync = leadSources
    .filter(source => source.last_sync_at)
    .sort((a, b) => new Date(b.last_sync_at!).getTime() - new Date(a.last_sync_at!).getTime())[0];

  const selectedIntegrationData = integrations.find(int => int.id === selectedIntegration);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading integrations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lead Integrations</h1>
        <p className="text-muted-foreground">Connect your lead sources to automatically import and manage leads</p>
      </div>

      {/* Stats */}
      <IntegrationStats 
        activeIntegrations={activeIntegrations}
        totalLeads={totalLeads}
        lastSync={lastSync}
      />

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const source = getIntegrationStatus(integration.id);
          const creds = getCredentialStatus(integration.id);
          
          return (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              source={source}
              credentials={creds}
              triggerSyncPending={triggerSync.isPending}
              onSyncNow={handleSyncNow}
              onCopyWebhookUrl={copyWebhookUrl}
              onAddCredentials={handleAddCredentials}
              onConnect={handleConnect}
            />
          );
        })}
      </div>

      {/* Setup Guide */}
      <IntegrationSetupGuide />

      {/* Dialog */}
      <IntegrationDialog
        integration={selectedIntegrationData || null}
        isOpen={!!selectedIntegration}
        onClose={handleCloseDialog}
        mode={dialogMode}
        onCreateIntegration={handleCreateIntegration}
        createLeadSourcePending={createLeadSource.isPending}
      />
    </div>
  );
};
