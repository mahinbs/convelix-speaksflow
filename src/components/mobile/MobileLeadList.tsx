
import React, { useState } from 'react';
import { Lead } from '@/hooks/useLeads';
import { MobileLeadCard } from './MobileLeadCard';
import { EditLeadDialog } from '../leads/EditLeadDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface MobileLeadListProps {
  leads: Lead[];
  onStatusUpdate: (leadId: string, newStatus: string) => void;
}

export const MobileLeadList: React.FC<MobileLeadListProps> = ({
  leads,
  onStatusUpdate
}) => {
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredLeads = leads.filter(lead =>
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Mobile Search and Filter */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 min-h-[44px]"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="min-h-[44px] min-w-[44px]"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Lead Cards */}
      <div className="space-y-3">
        {filteredLeads.map((lead) => (
          <MobileLeadCard
            key={lead.id}
            lead={lead}
            onStatusUpdate={onStatusUpdate}
            onEdit={setEditingLead}
          />
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No leads found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Edit Lead Dialog */}
      {editingLead && (
        <EditLeadDialog
          open={!!editingLead}
          onClose={() => setEditingLead(null)}
          lead={editingLead}
        />
      )}
    </div>
  );
};
