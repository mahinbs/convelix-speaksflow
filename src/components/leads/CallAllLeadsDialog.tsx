
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
}

interface CallAllLeadsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalLeadsCount: number;
  campaigns: Campaign[];
  selectedCampaign: string;
  setSelectedCampaign: (value: string) => void;
  onStartCalls: () => void;
  isLoading?: boolean;
}

export const CallAllLeadsDialog: React.FC<CallAllLeadsDialogProps> = ({
  open,
  onOpenChange,
  totalLeadsCount,
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
          <DialogTitle>Call All Leads</DialogTitle>
          <DialogDescription>
            Start Bland AI calls for all {totalLeadsCount} leads with phone numbers
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Warning Notice */}
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-brand-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-brand-900">Important Notice</p>
              <p className="text-sm text-brand-800 mt-1">
                This will initiate calls to all {totalLeadsCount} leads with phone numbers. 
                Calls will be spaced 11 seconds apart to respect rate limits.
              </p>
            </div>
          </div>

          {/* Campaign Selection */}
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

          {/* Estimated Time */}
          {totalLeadsCount > 1 && (
            <div className="text-sm text-muted-foreground">
              <p>Estimated time: ~{Math.ceil((totalLeadsCount * 11) / 60)} minutes</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={onStartCalls} 
              disabled={isLoading || !selectedCampaign}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Starting Calls...' : `Start ${totalLeadsCount} Calls`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
