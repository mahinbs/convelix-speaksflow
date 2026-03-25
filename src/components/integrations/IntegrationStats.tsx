
import React from 'react';

interface IntegrationStatsProps {
  activeIntegrations: number;
  totalLeads: number;
  lastSync: any;
}

export const IntegrationStats: React.FC<IntegrationStatsProps> = ({
  activeIntegrations,
  totalLeads,
  lastSync
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-background/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-border/50 group stagger-1">
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-gradient-to-r from-brand-500/20 to-brand-400/20 p-4 rounded-2xl">
            <span className="text-3xl">🔗</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground/80 font-medium">Active Integrations</p>
            <p className="text-3xl font-bold text-foreground counter-animation animate-counter">{activeIntegrations}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-background/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-border/50 group stagger-2">
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-gradient-to-r from-brand-400/20 to-brand-600/20 p-4 rounded-2xl">
            <span className="text-3xl">📥</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground/80 font-medium">Total Leads Imported</p>
            <p className="text-3xl font-bold text-foreground counter-animation animate-counter">{totalLeads}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-background/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-border/50 group stagger-3">
        <div className="flex items-center space-x-4 relative z-10">
          <div className="bg-gradient-to-r from-brand-600/20 to-brand-800/20 p-4 rounded-2xl">
            <span className="text-3xl">⚡</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground/80 font-medium">Last Sync</p>
            <p className="text-3xl font-bold text-foreground counter-animation">
              {lastSync ? new Date(lastSync.last_sync_at!).toLocaleTimeString() : 'Never'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
