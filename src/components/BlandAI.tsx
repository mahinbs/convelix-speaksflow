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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:space-x-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Convelix AI
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              AI-powered phone calls for lead qualification
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4">
          <TabsTrigger value="dashboard" className="min-w-0 flex items-center gap-1 px-2 sm:gap-2 sm:px-3">
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs sm:text-sm">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="min-w-0 flex items-center gap-1 px-2 sm:gap-2 sm:px-3">
            <Bot className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs sm:text-sm">Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="min-w-0 flex items-center gap-1 px-2 sm:gap-2 sm:px-3">
            <Phone className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs sm:text-sm">Calls</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="min-w-0 flex items-center gap-1 px-2 sm:gap-2 sm:px-3">
            <Settings className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs sm:text-sm">Settings</span>
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
            <div className="flex min-h-[280px] items-center justify-center sm:h-[600px]">
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
