
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Campaign {
  id: string;
  name: string;
}

interface BlandAICallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLeadsCount: number;
  campaigns: Campaign[];
  selectedCampaign: string;
  setSelectedCampaign: (value: string) => void;
  onStartCalls: () => void;
  isLoading?: boolean;
}

export const BlandAICallDialog: React.FC<BlandAICallDialogProps> = ({
  open,
  onOpenChange,
  selectedLeadsCount,
  campaigns,
  selectedCampaign,
  setSelectedCampaign,
  onStartCalls,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Bland AI Calls</DialogTitle>
          <DialogDescription>
            Select a campaign to start calling {selectedLeadsCount} leads
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Campaign</label>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger>
                <SelectValue placeholder="Select a campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={onStartCalls} disabled={isLoading}>
              {isLoading ? 'Starting Calls...' : 'Start Calls'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
