
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Download, Trash2, FileText, Clock } from 'lucide-react';

export const DataPrivacySettings: React.FC = () => {
  const [settings, setSettings] = useState({
    data_retention_period: '365',
    auto_delete_recordings: true,
    anonymize_transcripts: false,
    share_analytics_data: true,
    gdpr_compliance: true,
    call_recording_consent: 'explicit',
    data_export_format: 'json'
  });

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Data Retention</span>
          </CardTitle>
          <CardDescription>
            Configure how long your data is stored and when it's automatically deleted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Data Retention Period</Label>
            <Select
              value={settings.data_retention_period}
              onValueChange={(value) => updateSetting('data_retention_period', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select retention period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="730">2 years</SelectItem>
                <SelectItem value="1095">3 years</SelectItem>
                <SelectItem value="never">Never delete</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">How long to keep call data, transcripts, and recordings</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-delete Call Recordings</Label>
              <p className="text-sm text-muted-foreground">Automatically delete recordings after retention period</p>
            </div>
            <Switch
              checked={settings.auto_delete_recordings}
              onCheckedChange={(checked) => updateSetting('auto_delete_recordings', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Anonymize Transcripts</Label>
              <p className="text-sm text-muted-foreground">Remove personal identifiers from transcripts</p>
            </div>
            <Switch
              checked={settings.anonymize_transcripts}
              onCheckedChange={(checked) => updateSetting('anonymize_transcripts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Consent</span>
          </CardTitle>
          <CardDescription>
            Manage privacy settings and consent preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Call Recording Consent</Label>
            <Select
              value={settings.call_recording_consent}
              onValueChange={(value) => updateSetting('call_recording_consent', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select consent type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="explicit">Explicit consent required</SelectItem>
                <SelectItem value="implicit">Implicit consent (notification only)</SelectItem>
                <SelectItem value="none">No consent required</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">How to handle call recording consent</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>GDPR Compliance Mode</Label>
              <p className="text-sm text-muted-foreground">Enable additional protections for EU users</p>
            </div>
            <Switch
              checked={settings.gdpr_compliance}
              onCheckedChange={(checked) => updateSetting('gdpr_compliance', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Share Analytics Data</Label>
              <p className="text-sm text-muted-foreground">Share anonymized data to improve AI models</p>
            </div>
            <Switch
              checked={settings.share_analytics_data}
              onCheckedChange={(checked) => updateSetting('share_analytics_data', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Data Export & Deletion</span>
          </CardTitle>
          <CardDescription>
            Export your data or request account deletion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select
              value={settings.data_export_format}
              onValueChange={(value) => updateSetting('data_export_format', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select export format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export All Data</span>
            </Button>
            <p className="text-xs text-muted-foreground">Download a complete copy of your account data</p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Call Recordings</span>
            </Button>
            <p className="text-xs text-muted-foreground">Download all call recordings and transcripts</p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button variant="destructive" className="flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Request Account Deletion</span>
            </Button>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy & Terms</CardTitle>
          <CardDescription>
            Review our privacy policy and terms of service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button variant="outline">View Privacy Policy</Button>
            <Button variant="outline">View Terms of Service</Button>
            <Button variant="outline">Data Processing Agreement</Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Last updated: December 2024</p>
            <p>By using this service, you agree to our privacy policy and terms of service.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
