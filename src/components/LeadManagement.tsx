import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadTable } from './leads/LeadTable';
import { MobileLeadList } from './mobile/MobileLeadList';
import { LeadStats } from './leads/LeadStats';
import { LeadImportDialog } from './leads/LeadImportDialog';
import { BlandAICallDialog } from './leads/BlandAICallDialog';
import { CallAllLeadsDialog } from './leads/CallAllLeadsDialog';
import { FilterBar } from './dashboard/FilterBar';
import { useFilter } from '@/contexts/FilterContext';
import { useLeads, useUpdateLead } from '@/hooks/useLeads';
import { useLeadQualification } from '@/hooks/useLeadQualification';
import { useBlandAICampaigns } from '@/hooks/useBlandAICampaigns';
import { useCallHandling } from '@/hooks/useCallHandling';
import { Users, Plus, Phone, Upload, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const LeadManagement: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showCallAllDialog, setShowCallAllDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const { selectedFilter, customRange, setFilter, getDateRange } = useFilter();
  const { data: leads = [], isLoading } = useLeads();
  const { data: qualificationData } = useLeadQualification();
  const { data: campaigns = [] } = useBlandAICampaigns();
  const updateLead = useUpdateLead();

  const {
    selectedCampaign,
    setSelectedCampaign,
    isLoading: isCallLoading,
    handleCallWithBlandAI
  } = useCallHandling(leads, campaigns);

  const handleStatusUpdate = (leadId: string, newStatus: string) => {
    updateLead.mutate({
      id: leadId,
      updates: { status: newStatus, last_contact_at: new Date().toISOString() }
    });
  };

  // Filter data based on selected date range and other filters
  const dateRange = getDateRange();
  
  const filteredLeads = leads.filter(lead => {
    // Date filter
    const leadDate = new Date(lead.created_at);
    if (leadDate < dateRange.from || leadDate > dateRange.to) return false;
    
    // Status filter
    if (statusFilter && lead.status !== statusFilter) return false;
    
    // Source filter
    if (sourceFilter && lead.source !== sourceFilter) return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        lead.name?.toLowerCase().includes(searchLower) ||
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.company?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const leadsWithPhones = filteredLeads.filter(lead => lead.phone);

  const handleStartCalls = async () => {
    const success = await handleCallWithBlandAI(leadsWithPhones.map(lead => lead.id));
    if (success) {
      setShowCallAllDialog(false);
    }
  };

  const handleSelectedCalls = async () => {
    const success = await handleCallWithBlandAI(selectedLeads);
    if (success) {
      setShowCallDialog(false);
      setSelectedLeads([]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Lead Management</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage and track your leads efficiently
          </p>
        </div>
        
        {/* Desktop Actions */}
        {!isMobile && (
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Import Leads
            </Button>
            <Button onClick={() => setShowCallAllDialog(true)}>
              <Phone className="w-4 h-4 mr-2" />
              Call All
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Action Buttons */}
      {isMobile && (
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowImportDialog(true)}
            className="touch-manipulation min-h-[48px]"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button 
            onClick={() => setShowCallAllDialog(true)}
            className="touch-manipulation min-h-[48px]"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call All
          </Button>
        </div>
      )}

      {/* Stats */}
      <LeadStats leads={filteredLeads} />

      {/* Time Period Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Time Period</CardTitle>
          <CardDescription>Filter leads by time period</CardDescription>
        </CardHeader>
        <CardContent>
          <FilterBar
            selectedFilter={selectedFilter}
            customRange={customRange}
            onFilterChange={setFilter}
          />
        </CardContent>
      </Card>

      {/* Other Filters */}
      {(!isMobile || showFilters) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              {isMobile && (
                <Button
                  
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  ×
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-md"
              >
                <option value="">All Sources</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="linkedin">LinkedIn</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile Filter Toggle */}
      {isMobile && !showFilters && (
        <Button
          variant="outline"
          onClick={() => setShowFilters(true)}
          className="w-full touch-manipulation min-h-[48px]"
        >
          <Filter className="w-4 h-4 mr-2" />
          Show Filters
        </Button>
      )}

      {/* Leads List/Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle className="text-lg md:text-xl flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Leads ({filteredLeads.length})
              </CardTitle>
              <CardDescription>
                {selectedLeads.length > 0 && `${selectedLeads.length} selected`}
              </CardDescription>
            </div>
            
            {selectedLeads.length > 0 && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => setShowCallDialog(true)}
                  className="touch-manipulation min-h-[40px]"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className={isMobile ? "p-0" : ""}>
          {isMobile ? (
            <div className="p-4">
              <MobileLeadList
                leads={filteredLeads}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          ) : (
            <LeadTable
              leads={filteredLeads}
              selectedLeads={selectedLeads}
              setSelectedLeads={setSelectedLeads}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <LeadImportDialog
        trigger={null}
      />
      
      <BlandAICallDialog
        open={showCallDialog}
        onOpenChange={setShowCallDialog}
        selectedLeadsCount={selectedLeads.length}
        campaigns={campaigns}
        selectedCampaign={selectedCampaign}
        setSelectedCampaign={setSelectedCampaign}
        onStartCalls={handleSelectedCalls}
        isLoading={isCallLoading}
      />
      
      <CallAllLeadsDialog
        open={showCallAllDialog}
        onOpenChange={setShowCallAllDialog}
        totalLeadsCount={leadsWithPhones.length}
        campaigns={campaigns}
        selectedCampaign={selectedCampaign}
        setSelectedCampaign={setSelectedCampaign}
        onStartCalls={handleStartCalls}
        isLoading={isCallLoading}
      />
    </div>
  );
};
