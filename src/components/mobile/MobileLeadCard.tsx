
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Edit, MoreVertical } from 'lucide-react';
import { Lead } from '@/hooks/useLeads';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileLeadCardProps {
  lead: Lead;
  onStatusUpdate: (leadId: string, newStatus: string) => void;
  onEdit: (lead: Lead) => void;
}

export const MobileLeadCard: React.FC<MobileLeadCardProps> = ({
  lead,
  onStatusUpdate,
  onEdit
}) => {
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
      default: return 'bg-muted/90 text-foreground';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {lead.name || 'Unknown'}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {lead.email}
            </p>
            {lead.phone && (
              <p className="text-sm text-muted-foreground">
                {lead.phone}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button  size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(lead)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusUpdate(lead.id, 'contacted')}>
                Mark as Contacted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusUpdate(lead.id, 'qualified')}>
                Mark as Qualified
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getStatusColor(lead.status || 'new')} variant="secondary">
            {lead.status || 'new'}
          </Badge>
          <Badge className={getSourceColor(lead.source)} variant="secondary">
            {lead.source.toUpperCase()}
          </Badge>
        </div>

        {lead.company && (
          <p className="text-sm text-muted-foreground mb-3">
            {lead.company}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">Score</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-muted rounded-full h-1.5">
              <div
                className="bg-brand-500 h-1.5 rounded-full"
                style={{ width: `${lead.score || 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-muted-foreground">{lead.score || 0}%</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1 touch-manipulation min-h-[40px]">
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1 touch-manipulation min-h-[40px]">
            <MessageSquare className="w-4 h-4 mr-1" />
            Message
          </Button>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          Created: {new Date(lead.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
