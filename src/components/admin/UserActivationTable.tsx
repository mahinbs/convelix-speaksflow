
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ActivationStatus = 'pending' | 'active' | 'suspended';

interface UserActivation {
  id: string;
  profile_id: string;
  status: ActivationStatus;
  activated_by: string | null;
  activated_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string | null;
  activated_by_email: string | null;
  activated_by_full_name: string | null;
}

export const UserActivationTable: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activationStatuses = [], isLoading } = useQuery({
    queryKey: ['user_activation_statuses'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_activation_statuses');
      if (error) throw error;
      return data as UserActivation[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ profileId, status, notes }: { profileId: string; status: ActivationStatus; notes?: string }) => {
      const { error } = await supabase.rpc('update_user_activation_status', {
        target_profile_id: profileId,
        new_status: status,
        status_notes: notes
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_activation_statuses'] });
      toast({
        title: 'Success',
        description: 'User activation status updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating activation status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update activation status',
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (profileId: string, newStatus: string) => {
    if (newStatus === 'pending' || newStatus === 'active' || newStatus === 'suspended') {
      updateStatusMutation.mutate({ profileId, status: newStatus as ActivationStatus });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading activation statuses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Activated By</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activationStatuses.map((activation) => (
              <TableRow key={activation.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{activation.full_name || 'N/A'}</div>
                  </div>
                </TableCell>
                <TableCell>{activation.email}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(activation.status)}>
                    {activation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {activation.activated_by_full_name ? (
                    <div>
                      <div className="text-sm">{activation.activated_by_full_name}</div>
                      <div className="text-xs text-gray-500">{activation.activated_by_email}</div>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  {new Date(activation.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Select
                    value={activation.status}
                    onValueChange={(value) => handleStatusChange(activation.profile_id, value)}
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {activationStatuses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No user activation records found.
        </div>
      )}
    </div>
  );
};
