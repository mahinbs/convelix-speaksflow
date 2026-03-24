
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Phone, MessageSquare, Repeat, Clock } from 'lucide-react';

export const CallCampaignSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    default_call_script: '',
    call_retry_attempts: 3,
    call_retry_interval: 24,
    max_call_duration: 15,
    enable_call_recording: true,
    enable_voicemail_detection: true,
    voicemail_action: 'leave_message',
    default_voice: 'maya',
    speaking_speed: 'normal',
    campaign_auto_start: false,
    lead_qualification_prompt: '',
    follow_up_delay: 2,
    working_hours_only: true
  });

  useEffect(() => {
    if (user) {
      loadCallCampaignSettings();
    }
  }, [user]);

  const loadCallCampaignSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .eq('key', 'call_campaign_settings')
        .single();

      if (data && data.value) {
        const callSettings = JSON.parse(data.value);
        setSettings({ ...settings, ...callSettings });
      }
    } catch (error) {
      console.error('Error loading call campaign settings:', error);
    }
  };

  const saveCallCampaignSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'call_campaign_settings',
          value: JSON.stringify(settings),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Call & campaign settings updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update call campaign settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Default Call Scripts</span>
          </CardTitle>
          <CardDescription>
            Configure default scripts and prompts for your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default_call_script">Default Call Script</Label>
            <Textarea
              id="default_call_script"
              value={settings.default_call_script}
              onChange={(e) => updateSetting('default_call_script', e.target.value)}
              placeholder="Enter your default call script template..."
              rows={6}
            />
            <p className="text-xs text-muted-foreground">This script will be used as a template for new campaigns</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead_qualification_prompt">Lead Qualification Prompt</Label>
            <Textarea
              id="lead_qualification_prompt"
              value={settings.lead_qualification_prompt}
              onChange={(e) => updateSetting('lead_qualification_prompt', e.target.value)}
              placeholder="Enter qualification questions and criteria..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">AI will use this to determine lead qualification status</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="w-5 h-5" />
            <span>Call Behavior</span>
          </CardTitle>
          <CardDescription>
            Configure how calls are handled and processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Voice</Label>
              <Select
                value={settings.default_voice}
                onValueChange={(value) => updateSetting('default_voice', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maya">Maya (Female, Professional)</SelectItem>
                  <SelectItem value="ryan">Ryan (Male, Friendly)</SelectItem>
                  <SelectItem value="alex">Alex (Male, Confident)</SelectItem>
                  <SelectItem value="sarah">Sarah (Female, Warm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Speaking Speed</Label>
              <Select
                value={settings.speaking_speed}
                onValueChange={(value) => updateSetting('speaking_speed', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Max Call Duration (minutes)</Label>
              <Input
                type="number"
                value={settings.max_call_duration}
                onChange={(e) => updateSetting('max_call_duration', Number(e.target.value))}
                min="1"
                max="60"
              />
            </div>

            <div className="space-y-2">
              <Label>Voicemail Action</Label>
              <Select
                value={settings.voicemail_action}
                onValueChange={(value) => updateSetting('voicemail_action', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leave_message">Leave Message</SelectItem>
                  <SelectItem value="hang_up">Hang Up</SelectItem>
                  <SelectItem value="transfer_human">Transfer to Human</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Call Recording</Label>
                <p className="text-sm text-muted-foreground">Record all calls for quality and training</p>
              </div>
              <Switch
                checked={settings.enable_call_recording}
                onCheckedChange={(checked) => updateSetting('enable_call_recording', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Voicemail Detection</Label>
                <p className="text-sm text-muted-foreground">Automatically detect and handle voicemails</p>
              </div>
              <Switch
                checked={settings.enable_voicemail_detection}
                onCheckedChange={(checked) => updateSetting('enable_voicemail_detection', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Working Hours Only</Label>
                <p className="text-sm text-muted-foreground">Only make calls during business hours</p>
              </div>
              <Switch
                checked={settings.working_hours_only}
                onCheckedChange={(checked) => updateSetting('working_hours_only', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Repeat className="w-5 h-5" />
            <span>Retry & Follow-up</span>
          </CardTitle>
          <CardDescription>
            Configure retry logic and follow-up behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Retry Attempts</Label>
              <Input
                type="number"
                value={settings.call_retry_attempts}
                onChange={(e) => updateSetting('call_retry_attempts', Number(e.target.value))}
                min="0"
                max="10"
              />
              <p className="text-xs text-muted-foreground">Max retry attempts for failed calls</p>
            </div>

            <div className="space-y-2">
              <Label>Retry Interval (hours)</Label>
              <Input
                type="number"
                value={settings.call_retry_interval}
                onChange={(e) => updateSetting('call_retry_interval', Number(e.target.value))}
                min="1"
                max="168"
              />
              <p className="text-xs text-muted-foreground">Time between retry attempts</p>
            </div>

            <div className="space-y-2">
              <Label>Follow-up Delay (days)</Label>
              <Input
                type="number"
                value={settings.follow_up_delay}
                onChange={(e) => updateSetting('follow_up_delay', Number(e.target.value))}
                min="1"
                max="30"
              />
              <p className="text-xs text-muted-foreground">Days before follow-up calls</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-start Campaigns</Label>
              <p className="text-sm text-muted-foreground">Automatically start campaigns when created</p>
            </div>
            <Switch
              checked={settings.campaign_auto_start}
              onCheckedChange={(checked) => updateSetting('campaign_auto_start', checked)}
            />
          </div>

          <Button onClick={saveCallCampaignSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Save Call & Campaign Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
