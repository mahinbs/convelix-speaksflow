
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfileSettings } from './settings/UserProfileSettings';
import { NotificationSettings } from './settings/NotificationSettings';
import { BusinessSettings } from './settings/BusinessSettings';
import { AIIntegrationSettings } from './settings/AIIntegrationSettings';
import { CallCampaignSettings } from './settings/CallCampaignSettings';
import { DataPrivacySettings } from './settings/DataPrivacySettings';
import { SecuritySettings } from './settings/SecuritySettings';
import { User, Settings as SettingsIcon, Bell, Building, Bot, Phone, Shield, Lock } from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">Settings</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Manage your account preferences and application settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="profile" className="min-w-0 flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="min-w-0 flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span className="inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="min-w-0 flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span className="inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="min-w-0 flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span className="inline">AI</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="min-w-0 flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span className="inline">Calls</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="min-w-0 flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span className="inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <UserProfileSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="business">
          <BusinessSettings />
        </TabsContent>

        <TabsContent value="ai">
          <AIIntegrationSettings />
        </TabsContent>

        <TabsContent value="calls">
          <CallCampaignSettings />
        </TabsContent>

        <TabsContent value="privacy">
          <DataPrivacySettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
