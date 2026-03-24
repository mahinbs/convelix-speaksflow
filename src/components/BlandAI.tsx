import React, { useState, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Phone, Settings, BarChart3, Plus, Loader2 } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { BlandAIDashboard } from './bland-ai/BlandAIDashboard';
import { BlandAICampaigns } from './bland-ai/BlandAICampaigns';
// Lazy load the heavy components
const BlandAICalls = lazy(() => import('./bland-ai/BlandAICalls').then(module => ({ default: module.BlandAICalls })));
import { BlandAISettings } from './bland-ai/BlandAISettings';
import { useSetupRequired } from '@/hooks/useSetupRequired';
import { SetupRequiredNotice } from './dashboard/SetupRequiredNotice';
import { useContactDialog } from '@/hooks/useContactDialog';
import { useChatWindow } from '@/hooks/useChatWindow';

export const BlandAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { setupRequired, isLoading } = useSetupRequired();
  const { openContactDialog } = useContactDialog();
  const { openChat } = useChatWindow();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (setupRequired) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <SetupRequiredNotice
          onContactClick={openContactDialog}
          onChatClick={openChat}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Logo size="lg" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Convelix AI</h1>
            <p className="text-muted-foreground">AI-powered phone calls for lead qualification</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span>Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Calls</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <BlandAIDashboard />
        </TabsContent>

        <TabsContent value="campaigns">
          <BlandAICampaigns />
        </TabsContent>

        <TabsContent value="calls">
          <Suspense fallback={
            <div className="flex items-center justify-center h-[600px]">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground">Loading call history...</p>
              </div>
            </div>
          }>
            <BlandAICalls />
          </Suspense>
        </TabsContent>

        <TabsContent value="settings">
          <BlandAISettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
