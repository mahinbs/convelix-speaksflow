
import React from 'react';
import { Settings, CheckCircle, Clock, Play, ExternalLink, Copy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  setupInstructions: string;
}

interface IntegrationCardProps {
  integration: Integration;
  source: any;
  credentials: any;
  triggerSyncPending: boolean;
  onSyncNow: (sourceType: string) => void;
  onCopyWebhookUrl: (url: string) => void;
  onAddCredentials: (integrationId: string) => void;
  onConnect: (integrationId: string) => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  source,
  credentials,
  triggerSyncPending,
  onSyncNow,
  onCopyWebhookUrl,
  onAddCredentials,
  onConnect
}) => {
  const getStatusBadge = () => {
    if (source?.is_active && credentials) {
      return (
        <span className="flex items-center space-x-1 text-brand-700 bg-brand-100 px-2 py-1 rounded-full text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          <span>Connected</span>
        </span>
      );
    } else if (source?.is_active && !credentials) {
      return (
        <span className="flex items-center space-x-1 text-brand-700 bg-brand-100 px-2 py-1 rounded-full text-xs font-medium">
          <Clock className="w-3 h-3" />
          <span>Needs Credentials</span>
        </span>
      );
    }
    return (
      <span className="text-muted-foreground bg-muted/90 px-2 py-1 rounded-full text-xs font-medium">
        Not Connected
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{integration.icon}</div>
          <div>
            <h3 className="font-semibold text-foreground">{integration.name}</h3>
            {getStatusBadge()}
          </div>
        </div>
        <button className="text-muted-foreground hover:text-muted-foreground">
          <Settings className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
      
      {source?.is_active && credentials ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Leads imported:</span>
            <span className="font-medium text-brand-700">{source.total_leads || 0}</span>
          </div>
          {source.webhook_url && (
            <div className="bg-muted p-3 rounded-lg">
              <Label className="text-xs text-muted-foreground">Webhook URL:</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  value={source.webhook_url || ''}
                  readOnly
                  className="text-xs"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onCopyWebhookUrl(source.webhook_url || '')}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
          <div className="flex space-x-2 pt-2">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => onSyncNow(integration.id)}
              disabled={triggerSyncPending}
            >
              <Play className="w-4 h-4 mr-2" />
              {triggerSyncPending ? 'Syncing...' : 'Sync Now'}
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : source?.is_active && !credentials ? (
        <div className="pt-2">
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => onAddCredentials(integration.id)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Add Credentials
          </Button>
        </div>
      ) : (
        <div className="pt-2">
          <Button 
            className="w-full"
            onClick={() => onConnect(integration.id)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </div>
      )}
    </div>
  );
};
