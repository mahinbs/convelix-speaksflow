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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Mic className="w-8 h-8 text-brand-700" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vapi AI</h1>
            <p className="text-muted-foreground">Real-time voice AI assistants and live call management</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="assistants" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Assistants</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Calls</span>
          </TabsTrigger>
          <TabsTrigger value="phone-numbers" className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Phone Numbers</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
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
