
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Phone, Settings, Trash2 } from 'lucide-react';
import { useVapiAIPhoneNumbers } from '@/hooks/useVapiAIPhoneNumbers';

export const VapiAIPhoneNumbers: React.FC = () => {
  const { data: phoneNumbers = [], isLoading } = useVapiAIPhoneNumbers();

  if (isLoading) {
    return <div className="p-8 text-center">Loading phone numbers...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-brand-100 text-brand-800';
      case 'inactive': return 'bg-destructive/15 text-destructive';
      default: return 'bg-muted/90 text-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Phone Numbers</h2>
          <p className="text-muted-foreground">Manage your Vapi.ai phone numbers and routing</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Buy Phone Number
        </Button>
      </div>

      {phoneNumbers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Phone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No phone numbers</h3>
            <p className="text-muted-foreground mb-4">
              Purchase phone numbers to enable inbound calls to your voice assistants.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Buy Your First Number
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phoneNumbers.map((phoneNumber) => (
            <Card key={phoneNumber.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-brand-700" />
                    <div>
                      <CardTitle className="text-lg">{phoneNumber.phone_number}</CardTitle>
                      <CardDescription>{phoneNumber.name || 'Unnamed'}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(phoneNumber.status)}>
                    {phoneNumber.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Country:</span>
                    <span className="font-medium">{phoneNumber.country_code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Cost:</span>
                    <span className="font-medium">
                      {phoneNumber.monthly_cost ? `$${phoneNumber.monthly_cost}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Assistant:</span>
                    <span className="font-medium">
                      {phoneNumber.assistant_id ? 'Assigned' : 'Unassigned'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive/90">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
