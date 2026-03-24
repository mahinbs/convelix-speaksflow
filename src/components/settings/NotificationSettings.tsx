
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Mail, Phone, BarChart3 } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    email_notifications: true,
    call_completion_alerts: true,
    campaign_performance_alerts: true,
    lead_qualification_notifications: true,
    system_maintenance_alerts: true,
    weekly_reports: true,
    monthly_reports: true,
    report_delivery_time: '09:00',
    notification_frequency: 'immediate'
  });

  useEffect(() => {
    if (user) {
      loadNotificationSettings();
    }
  }, [user]);

  const loadNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .eq('key', 'notification_preferences')
        .single();

      if (data && data.value) {
        const preferences = JSON.parse(data.value);
        setSettings({ ...settings, ...preferences });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveNotificationSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'notification_preferences',
          value: JSON.stringify(settings),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification settings updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update notification settings",
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
            <Bell className="w-5 h-5" />
            <span>Email Notifications</span>
          </CardTitle>
          <CardDescription>
            Configure when and how you receive email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Call Completion Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when calls are completed</p>
            </div>
            <Switch
              checked={settings.call_completion_alerts}
              onCheckedChange={(checked) => updateSetting('call_completion_alerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Campaign Performance Alerts</Label>
              <p className="text-sm text-muted-foreground">Alerts for significant campaign changes</p>
            </div>
            <Switch
              checked={settings.campaign_performance_alerts}
              onCheckedChange={(checked) => updateSetting('campaign_performance_alerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Lead Qualification Notifications</Label>
              <p className="text-sm text-muted-foreground">When leads are qualified or updated</p>
            </div>
            <Switch
              checked={settings.lead_qualification_notifications}
              onCheckedChange={(checked) => updateSetting('lead_qualification_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>System Maintenance Alerts</Label>
              <p className="text-sm text-muted-foreground">Important system updates and maintenance</p>
            </div>
            <Switch
              checked={settings.system_maintenance_alerts}
              onCheckedChange={(checked) => updateSetting('system_maintenance_alerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Report Delivery</span>
          </CardTitle>
          <CardDescription>
            Configure automated report delivery preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
            </div>
            <Switch
              checked={settings.weekly_reports}
              onCheckedChange={(checked) => updateSetting('weekly_reports', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Monthly Reports</Label>
              <p className="text-sm text-muted-foreground">Comprehensive monthly analytics</p>
            </div>
            <Switch
              checked={settings.monthly_reports}
              onCheckedChange={(checked) => updateSetting('monthly_reports', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Delivery Time</Label>
              <Select
                value={settings.report_delivery_time}
                onValueChange={(value) => updateSetting('report_delivery_time', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="06:00">6:00 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select
                value={settings.notification_frequency}
                onValueChange={(value) => updateSetting('notification_frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={saveNotificationSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Save Notification Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
