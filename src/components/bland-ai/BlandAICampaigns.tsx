import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Pause, Edit, Trash2 } from 'lucide-react';
import { useBlandAICampaigns, useDeleteBlandAICampaign } from '@/hooks/useBlandAICampaigns';
import { CreateCampaignDialog } from './CreateCampaignDialog';
import { EditCampaignDialog } from './EditCampaignDialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const BlandAICampaigns: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const { data: campaigns = [], isLoading } = useBlandAICampaigns();
  const deleteCampaign = useDeleteBlandAICampaign();
  const { toast } = useToast();

  const handleEdit = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowEditDialog(true);
  };

  const handleDelete = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCampaign.mutateAsync(selectedCampaign.id);
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
      setShowDeleteDialog(false);
      setSelectedCampaign(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold sm:text-2xl">AI Call Campaigns</h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Create and manage your AI calling campaigns
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="w-full shrink-0 touch-manipulation sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first AI calling campaign to start reaching out to leads
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {campaign.description || 'No description provided'}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      campaign.status === 'active' ? 'default' :
                        campaign.status === 'draft' ? 'secondary' : 'destructive'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">Total Leads</p>
                      <p className="font-semibold">{campaign.total_leads || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Completed</p>
                      <p className="font-semibold">{campaign.completed_calls || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className="font-semibold">
                        {campaign.completed_calls && campaign.successful_calls
                          ? Math.round((campaign.successful_calls / campaign.completed_calls) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-semibold">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {campaign.status === 'draft' && (
                      <Button size="sm" className="flex-1">
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}
                    {campaign.status === 'active' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(campaign)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(campaign)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateCampaignDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />

      {selectedCampaign && (
        <EditCampaignDialog
          open={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedCampaign(null);
          }}
          campaign={selectedCampaign}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {deleteCampaign.isPending ? "Deleting..." : "Delete Campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
