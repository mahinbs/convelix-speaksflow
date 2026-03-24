
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FacebookCredentialForm, 
  LinkedInCredentialForm, 
  GoogleSheetsCredentialForm, 
  TypeformCredentialForm 
} from '../CredentialForms';

interface Integration {
  id: string;
  name: string;
  setupInstructions: string;
}

interface IntegrationDialogProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'connect' | 'credentials';
  onCreateIntegration?: (sourceType: string, sourceName: string) => void;
  createLeadSourcePending?: boolean;
}

export const IntegrationDialog: React.FC<IntegrationDialogProps> = ({
  integration,
  isOpen,
  onClose,
  mode,
  onCreateIntegration,
  createLeadSourcePending
}) => {
  if (!integration) return null;

  if (mode === 'credentials') {
    return (
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure {integration.name}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
            </TabsList>
            <TabsContent value="credentials" className="space-y-4">
              {integration.id === 'facebook' && (
                <FacebookCredentialForm 
                  sourceType={integration.id} 
                  onSuccess={onClose}
                />
              )}
              {integration.id === 'linkedin' && (
                <LinkedInCredentialForm 
                  sourceType={integration.id} 
                  onSuccess={onClose}
                />
              )}
              {integration.id === 'google_sheets' && (
                <GoogleSheetsCredentialForm 
                  sourceType={integration.id} 
                  onSuccess={onClose}
                />
              )}
              {integration.id === 'typeform' && (
                <TypeformCredentialForm 
                  sourceType={integration.id} 
                  onSuccess={onClose}
                />
              )}
            </TabsContent>
            <TabsContent value="instructions">
              <div>
                <Label>Setup Instructions</Label>
                <Textarea
                  value={integration.setupInstructions}
                  readOnly
                  className="text-sm mt-2"
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect {integration.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="sourceName">Integration Name</Label>
            <Input
              id="sourceName"
              defaultValue={integration.name}
              placeholder="Give this integration a name"
            />
          </div>
          <div>
            <Label>Setup Instructions</Label>
            <Textarea
              value={integration.setupInstructions}
              readOnly
              className="text-sm"
              rows={4}
            />
          </div>
          <Button 
            onClick={() => {
              if (onCreateIntegration) {
                onCreateIntegration(integration.id, integration.name);
              }
            }}
            disabled={createLeadSourcePending}
            className="w-full"
          >
            {createLeadSourcePending ? 'Creating...' : 'Create Integration'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
