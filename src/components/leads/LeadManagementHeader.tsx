
import React from 'react';

interface LeadManagementHeaderProps {}

export const LeadManagementHeader: React.FC<LeadManagementHeaderProps> = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Lead Management</h1>
      <p className="text-muted-foreground">Manage and track your leads from all sources</p>
    </div>
  );
};
