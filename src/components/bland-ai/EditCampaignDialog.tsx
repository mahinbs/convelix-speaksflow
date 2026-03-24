import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useUpdateBlandAICampaign } from '@/hooks/useBlandAICampaigns';
import type { BlandAICampaign } from '@/hooks/useBlandAICampaigns';
import { VoiceSelector } from './VoiceSelector';

interface EditCampaignDialogProps {
  open: boolean;
  onClose: () => void;
  campaign: BlandAICampaign;
}

export const EditCampaignDialog: React.FC<EditCampaignDialogProps> = ({
  open,
  onClose,
  campaign,
}) => {
  const { toast } = useToast();
  const updateCampaign = useUpdateBlandAICampaign();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: campaign.name,
      description: campaign.description || '',
      ai_prompt: campaign.ai_prompt,
      voice_id: campaign.voice_id || 'maya',
    },
  });

  const selectedVoice = watch('voice_id');

  useEffect(() => {
    if (open) {
      reset({
        name: campaign.name,
        description: campaign.description || '',
        ai_prompt: campaign.ai_prompt,
        voice_id: campaign.voice_id || 'maya',
      });
    }
  }, [open, campaign, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        updates: {
          name: data.name,
          description: data.description,
          ai_prompt: data.ai_prompt,
          voice_id: data.voice_id,
        },
      });

      toast({
        title: 'Success',
        description: 'Campaign updated successfully',
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update campaign',
        variant: 'destructive',
      });
    }
  };

  const handleVoiceSelect = (voiceId: string) => {
    setValue('voice_id', voiceId);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              {...register('name', { required: 'Name is required' })}
              placeholder="Campaign name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              {...register('description')}
              placeholder="Campaign description"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">AI Prompt</label>
            <Textarea
              {...register('ai_prompt', { required: 'AI prompt is required' })}
              placeholder="Enter the AI prompt for calls"
            />
            {errors.ai_prompt && (
              <p className="text-sm text-destructive">{errors.ai_prompt.message}</p>
            )}
          </div>

          <VoiceSelector
            onVoiceSelect={handleVoiceSelect}
            selectedVoice={selectedVoice}
            className="border-none p-0 shadow-none"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateCampaign.isPending}>
              {updateCampaign.isPending ? 'Updating...' : 'Update Campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 