
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Building, Clock, DollarSign, Target } from 'lucide-react';

export const BusinessSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    company_name: '',
    company_address: '',
    company_phone: '',
    company_website: '',
    timezone: 'America/New_York',
    business_hours_start: '09:00',
    business_hours_end: '17:00',
    currency: 'USD',
    lead_score_threshold_hot: 80,
    lead_score_threshold_warm: 60,
    lead_score_threshold_cold: 40,
    avg_deal_value: 500,
    call_retry_attempts: 3,
    call_retry_interval: 24
  });

  useEffect(() => {
    if (user) {
      loadBusinessSettings();
    }
  }, [user]);

  const loadBusinessSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .eq('key', 'business_settings')
        .single();

      if (data && data.value) {
        const businessSettings = JSON.parse(data.value);
        setSettings({ ...settings, ...businessSettings });
      }
    } catch (error) {
      console.error('Error loading business settings:', error);
    }
  };

  const saveBusinessSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: 'business_settings',
          value: JSON.stringify(settings),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Business settings updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update business settings",
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
            <Building className="w-5 h-5" />
            <span>Company Information</span>
          </CardTitle>
          <CardDescription>
            Configure your company details and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={settings.company_name}
                onChange={(e) => updateSetting('company_name', e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_phone">Company Phone</Label>
              <Input
                id="company_phone"
                value={settings.company_phone}
                onChange={(e) => updateSetting('company_phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_address">Company Address</Label>
            <Textarea
              id="company_address"
              value={settings.company_address}
              onChange={(e) => updateSetting('company_address', e.target.value)}
              placeholder="Enter company address"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_website">Company Website</Label>
            <Input
              id="company_website"
              value={settings.company_website}
              onChange={(e) => updateSetting('company_website', e.target.value)}
              placeholder="https://www.example.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Business Hours & Timezone</span>
          </CardTitle>
          <CardDescription>
            Set your operating hours and timezone preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) => updateSetting('timezone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CST)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MST)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PST)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Business Hours Start</Label>
              <Input
                type="time"
                value={settings.business_hours_start}
                onChange={(e) => updateSetting('business_hours_start', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Business Hours End</Label>
              <Input
                type="time"
                value={settings.business_hours_end}
                onChange={(e) => updateSetting('business_hours_end', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Lead Scoring & Thresholds</span>
          </CardTitle>
          <CardDescription>
            Configure lead qualification criteria and scoring thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Hot Lead Threshold</Label>
              <Input
                type="number"
                value={settings.lead_score_threshold_hot}
                onChange={(e) => updateSetting('lead_score_threshold_hot', Number(e.target.value))}
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground">Score ≥ this value = Hot lead</p>
            </div>

            <div className="space-y-2">
              <Label>Warm Lead Threshold</Label>
              <Input
                type="number"
                value={settings.lead_score_threshold_warm}
                onChange={(e) => updateSetting('lead_score_threshold_warm', Number(e.target.value))}
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground">Score ≥ this value = Warm lead</p>
            </div>

            <div className="space-y-2">
              <Label>Cold Lead Threshold</Label>
              <Input
                type="number"
                value={settings.lead_score_threshold_cold}
                onChange={(e) => updateSetting('lead_score_threshold_cold', Number(e.target.value))}
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground">Score &lt; this value = Cold lead</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => updateSetting('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (CA$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Average Deal Value</Label>
              <Input
                type="number"
                value={settings.avg_deal_value}
                onChange={(e) => updateSetting('avg_deal_value', Number(e.target.value))}
                min="0"
                step="50"
              />
              <p className="text-xs text-muted-foreground">Used for ROI calculations</p>
            </div>
          </div>

          <Button onClick={saveBusinessSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Save Business Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
