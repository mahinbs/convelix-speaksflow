import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Lead } from '@/hooks/useLeads';
import { EditLeadDialog } from './EditLeadDialog';
import { MobileLeadList } from '../mobile/MobileLeadList';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BlandAICallDialog } from './BlandAICallDialog';
import { useBlandAICampaigns } from '@/hooks/useBlandAICampaigns';
import { useCallHandling } from '@/hooks/useCallHandling';
import { useToast } from '@/components/ui/use-toast';

interface LeadTableProps {
  leads: Lead[];
  selectedLeads: string[];
  setSelectedLeads: (leads: string[]) => void;
  onStatusUpdate: (leadId: string, newStatus: string) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  selectedLeads,
  setSelectedLeads,
  onStatusUpdate,
}) => {
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [selectedLeadForCall, setSelectedLeadForCall] = useState<Lead | null>(null);
  const isMobile = useIsMobile();
  const { data: campaigns = [] } = useBlandAICampaigns();
  const { toast } = useToast();

  const {
    selectedCampaign,
    setSelectedCampaign,
    isLoading: isCallLoading,
    handleCallWithBlandAI
  } = useCallHandling(leads, campaigns);

  // Use mobile component for mobile devices
  if (isMobile) {
    return <MobileLeadList leads={leads} onStatusUpdate={onStatusUpdate} />;
  }

  const handleCall = (lead: Lead) => {
    if (!lead.phone) {
      toast({
        title: "No phone number",
        description: "This lead doesn't have a phone number to call.",
        variant: "destructive"
      });
      return;
    }
    setSelectedLeadForCall(lead);
    setIsCallDialogOpen(true);
  };

  const handleStartCall = async () => {
    if (!selectedLeadForCall) return;

    const success = await handleCallWithBlandAI([selectedLeadForCall.id]);
    if (success) {
      setIsCallDialogOpen(false);
      setSelectedLeadForCall(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-brand-100 text-brand-800';
      case 'contacted': return 'bg-brand-100 text-brand-900';
      case 'qualified': return 'bg-brand-100 text-brand-800';
      case 'converted': return 'bg-brand-100 text-brand-900';
      case 'lost': return 'bg-destructive/15 text-destructive';
      default: return 'bg-muted/90 text-foreground';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'facebook': return 'bg-brand-100 text-brand-800';
      case 'whatsapp': return 'bg-brand-100 text-brand-800';
      case 'linkedin': return 'bg-brand-100 text-brand-900';
      case 'google_sheets': return 'bg-brand-100 text-brand-800';
      case 'google_forms': return 'bg-destructive/15 text-destructive';
      case 'typeform': return 'bg-brand-100 text-brand-800';
      case 'csv_upload': return 'bg-brand-100 text-brand-900';
      case 'manual': return 'bg-muted/90 text-foreground';
      default: return 'bg-muted/90 text-foreground';
    }
  };

  const getSourceDisplayName = (source: string) => {
    switch (source) {
      case 'csv_upload': return 'CSV Upload';
      case 'google_sheets': return 'Google Sheets';
      case 'google_forms': return 'Google Forms';
      default: return source.replace('_', ' ').toUpperCase();
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === leads.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLeads(leads.map(l => l.id));
                      } else {
                        setSelectedLeads([]);
                      }
                    }}
                    className="rounded border-border"
                  />
                </TableHead>
                <TableHead>Lead Info</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-muted">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLeads([...selectedLeads, lead.id]);
                        } else {
                          setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                        }
                      }}
                      className="rounded border-border"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">{lead.name || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{lead.email}</div>
                      <div className="text-sm text-muted-foreground">{lead.phone}</div>
                      {lead.company && (
                        <div className="text-sm text-muted-foreground">{lead.company}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSourceColor(lead.source)} variant="secondary">
                      {getSourceDisplayName(lead.source)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={lead.status || 'new'}
                      onValueChange={(value) => onStatusUpdate(lead.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusColor(lead.status || 'new')} variant="secondary">
                          {lead.status || 'new'}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="bg-brand-500 h-2 rounded-full"
                          style={{ width: `${lead.score || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{lead.score || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="!text-brand-800 !border-brand-200 font-medium hover:!bg-brand-50 hover:!text-brand-900 hover:!border-brand-300"
                        onClick={() => handleCall(lead)}
                      >
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="!text-brand-800 !border-brand-200 font-medium hover:!bg-brand-50 hover:!text-brand-900 hover:!border-brand-300">
                        Message
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="!text-foreground !border-border font-medium hover:!bg-muted hover:!text-foreground hover:!border-border"
                        onClick={() => setEditingLead(lead)}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {leads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No leads found. Try adjusting your search filters.
            </div>
          )}
        </div>
      </div>

      {/* Edit Lead Dialog */}
      {editingLead && (
        <EditLeadDialog
          open={!!editingLead}
          onClose={() => setEditingLead(null)}
          lead={editingLead}
        />
      )}

      {/* Call Lead Dialog */}
      <BlandAICallDialog
        open={isCallDialogOpen}
        onOpenChange={setIsCallDialogOpen}
        selectedLeadsCount={1}
        campaigns={campaigns}
        selectedCampaign={selectedCampaign}
        setSelectedCampaign={setSelectedCampaign}
        onStartCalls={handleStartCall}
        isLoading={isCallLoading}
      />
    </>
  );
};
