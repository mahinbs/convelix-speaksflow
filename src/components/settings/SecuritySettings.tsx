
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Lock, Key, Smartphone, Shield, Eye, AlertTriangle } from 'lucide-react';

export const SecuritySettings: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    two_factor_enabled: false,
    session_timeout: '24',
    ip_whitelist_enabled: false,
    api_access_enabled: true,
    login_notifications: true,
    security_alerts: true
  });

  const [apiTokens] = useState([
    { id: '1', name: 'Production API', created: '2024-01-15', lastUsed: '2024-06-10', status: 'active' },
    { id: '2', name: 'Development', created: '2024-03-01', lastUsed: '2024-06-08', status: 'active' },
  ]);

  const [loginSessions] = useState([
    { id: '1', device: 'Chrome on Windows', location: 'New York, US', lastActive: '2024-06-10 14:30', current: true },
    { id: '2', device: 'Safari on iPhone', location: 'New York, US', lastActive: '2024-06-09 09:15', current: false },
  ]);

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const enableTwoFactor = async () => {
    setLoading(true);
    try {
      // Simulate 2FA setup
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateSetting('two_factor_enabled', true);
      toast({
        title: "Success",
        description: "Two-factor authentication enabled successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable two-factor authentication",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateApiToken = () => {
    toast({
      title: "API Token Generated",
      description: "New API token has been created. Please copy it now as it won't be shown again."
    });
  };

  const revokeSession = (sessionId: string) => {
    toast({
      title: "Session Revoked",
      description: "Login session has been terminated successfully"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>Two-Factor Authentication</span>
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                {settings.two_factor_enabled 
                  ? "2FA is currently enabled for your account" 
                  : "Secure your account with 2FA using an authenticator app"
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={settings.two_factor_enabled ? "default" : "secondary"}>
                {settings.two_factor_enabled ? "Enabled" : "Disabled"}
              </Badge>
              {!settings.two_factor_enabled && (
                <Button onClick={enableTwoFactor} disabled={loading} size="sm">
                  <Smartphone className="w-4 h-4 mr-1" />
                  {loading ? "Enabling..." : "Enable 2FA"}
                </Button>
              )}
            </div>
          </div>

          {settings.two_factor_enabled && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                View Recovery Codes
              </Button>
              <Button variant="outline" size="sm">
                Disable 2FA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>API Access Tokens</span>
          </CardTitle>
          <CardDescription>
            Manage API tokens for integrations and third-party access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>API Access</Label>
              <p className="text-sm text-muted-foreground">Allow API access to your account</p>
            </div>
            <Switch
              checked={settings.api_access_enabled}
              onCheckedChange={(checked) => updateSetting('api_access_enabled', checked)}
            />
          </div>

          <div className="space-y-3">
            {apiTokens.map((token) => (
              <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{token.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created: {token.created} • Last used: {token.lastUsed}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{token.status}</Badge>
                  <Button variant="outline" size="sm">Revoke</Button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={generateApiToken} variant="outline">
            Generate New Token
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Active Sessions</span>
          </CardTitle>
          <CardDescription>
            Monitor and manage your active login sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Session Timeout</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={settings.session_timeout}
                onChange={(e) => updateSetting('session_timeout', e.target.value)}
                className="w-20"
                min="1"
                max="168"
              />
              <span className="text-sm text-muted-foreground">hours</span>
            </div>
            <p className="text-xs text-muted-foreground">Automatically log out after inactivity</p>
          </div>

          <div className="space-y-3">
            {loginSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{session.device}</h4>
                  <p className="text-sm text-muted-foreground">
                    {session.location} • {session.lastActive}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {session.current ? (
                    <Badge variant="default">Current Session</Badge>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => revokeSession(session.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline">
            Revoke All Other Sessions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Preferences</span>
          </CardTitle>
          <CardDescription>
            Configure security notifications and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Login Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
            </div>
            <Switch
              checked={settings.login_notifications}
              onCheckedChange={(checked) => updateSetting('login_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive alerts for suspicious activities</p>
            </div>
            <Switch
              checked={settings.security_alerts}
              onCheckedChange={(checked) => updateSetting('security_alerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>IP Whitelist</Label>
              <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
            </div>
            <Switch
              checked={settings.ip_whitelist_enabled}
              onCheckedChange={(checked) => updateSetting('ip_whitelist_enabled', checked)}
            />
          </div>

          {settings.ip_whitelist_enabled && (
            <div className="space-y-2">
              <Label>Allowed IP Addresses</Label>
              <Input placeholder="192.168.1.1, 10.0.0.1" />
              <p className="text-xs text-muted-foreground">Comma-separated list of allowed IP addresses</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Security Audit</span>
          </CardTitle>
          <CardDescription>
            Review recent security events and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium text-brand-700">Successful Login</h4>
                <p className="text-sm text-muted-foreground">Chrome on Windows • 2024-06-10 14:30</p>
              </div>
              <Badge variant="outline" className="text-brand-700">Success</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium">Password Changed</h4>
                <p className="text-sm text-muted-foreground">Account settings • 2024-06-08 10:15</p>
              </div>
              <Badge variant="outline">Security</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium">API Token Generated</h4>
                <p className="text-sm text-muted-foreground">Production API • 2024-06-05 16:45</p>
              </div>
              <Badge variant="outline">API</Badge>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            View Full Security Log
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
