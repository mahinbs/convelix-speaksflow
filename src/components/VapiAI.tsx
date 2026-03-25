import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Users, Phone, Settings, BarChart3 } from 'lucide-react';
import { VapiAIDashboard } from './vapi-ai/VapiAIDashboard';
import { VapiAIAssistants } from './vapi-ai/VapiAIAssistants';
import { VapiAICalls } from './vapi-ai/VapiAICalls';
import { VapiAIPhoneNumbers } from './vapi-ai/VapiAIPhoneNumbers';
import { VapiAISettings } from './vapi-ai/VapiAISettings';
import { useSetupRequired } from '@/hooks/useSetupRequired';
import { SetupRequiredNotice } from './dashboard/SetupRequiredNotice';
import { useContactDialog } from '@/hooks/useContactDialog';
import { useChatWindow } from '@/hooks/useChatWindow';

export const VapiAI: React.FC = () => {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:space-x-3">
          <Mic className="h-8 w-8 shrink-0 text-brand-700" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Vapi AI</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Real-time voice AI assistants and live call management
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="dashboard" className="min-w-0 gap-1 px-2 sm:gap-2 sm:px-3">
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs sm:text-sm">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="assistants" className="min-w-0 gap-1 px-2 sm:gap-2 sm:px-3">
            <Users className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs sm:text-sm">Assistants</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="min-w-0 gap-1 px-2 sm:gap-2 sm:px-3">
            <Phone className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs sm:text-sm">Calls</span>
          </TabsTrigger>
          <TabsTrigger value="phone-numbers" className="min-w-0 gap-1 px-2 sm:gap-2 sm:px-3">
            <Phone className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs sm:hidden">Numbers</span>
            <span className="hidden truncate text-xs sm:inline sm:text-sm">Phone Numbers</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="min-w-0 gap-1 px-2 sm:gap-2 sm:px-3">
            <Settings className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs sm:text-sm">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <VapiAIDashboard />
        </TabsContent>

        <TabsContent value="assistants">
          <VapiAIAssistants />
        </TabsContent>

        <TabsContent value="calls">
          <VapiAICalls />
        </TabsContent>

        <TabsContent value="phone-numbers">
          <VapiAIPhoneNumbers />
        </TabsContent>

        <TabsContent value="settings">
          <VapiAISettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
