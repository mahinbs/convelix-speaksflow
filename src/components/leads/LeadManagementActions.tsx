
import React from 'react';
import { Phone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadImportDialog } from './LeadImportDialog';
import type { Lead } from '@/hooks/useLeads';

interface LeadManagementActionsProps {
  leadsWithPhone: Lead[];
  selectedLeads: string[];
  onCallAllLeads: () => void;
  onCallSelectedLeads: () => void;
}

export const LeadManagementActions: React.FC<LeadManagementActionsProps> = ({
  leadsWithPhone,
  selectedLeads,
  onCallAllLeads,
  onCallSelectedLeads,
}) => {
  return (
    <div className="flex space-x-3">
      {/* Call All Leads Button */}
      {leadsWithPhone.length > 0 && (
        <Button 
          onClick={onCallAllLeads} 
          variant="outline"
          className="bg-brand-50 border-brand-200 text-brand-800 hover:bg-brand-100"
        >
          <Phone className="w-4 h-4 mr-2" />
          Call All Leads ({leadsWithPhone.length})
        </Button>
      )}
      
      {/* Call Selected Leads Button */}
      {selectedLeads.length > 0 && (
        <Button onClick={onCallSelectedLeads} variant="default">
          <Phone className="w-4 h-4 mr-2" />
          Call Selected ({selectedLeads.length})
        </Button>
      )}
      
      <Button variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
      <LeadImportDialog />
    </div>
  );
};
