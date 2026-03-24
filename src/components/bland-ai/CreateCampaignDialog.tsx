import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCreateBlandAICampaign } from '@/hooks/useBlandAICampaigns';
import { VoiceSelector } from './VoiceSelector';

interface CreateCampaignDialogProps {
  open: boolean;
  onClose: () => void;
}

interface CampaignFormData {
  name: string;
  description: string;
  ai_prompt: string;
  voice_id: string;
}

export const CreateCampaignDialog: React.FC<CreateCampaignDialogProps> = ({ open, onClose }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CampaignFormData>({
    defaultValues: {
      name: '',
      description: '',
      ai_prompt: '',
      voice_id: 'maya', // Default voice
    }
  });
  const { toast } = useToast();
  const createCampaign = useCreateBlandAICampaign();
  const selectedVoice = watch('voice_id');

  const onSubmit = async (data: CampaignFormData) => {
    try {
      await createCampaign.mutateAsync({
        name: data.name,
        description: data.description,
        ai_prompt: data.ai_prompt,
        voice_id: data.voice_id,
        status: 'draft',
        total_leads: 0,
        completed_calls: 0,
        successful_calls: 0,
        campaign_data: null,
      });

      toast({
        title: "Success",
        description: "Campaign created successfully",
      });

      reset();
      onClose();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleVoiceSelect = (voiceId: string) => {
    setValue('voice_id', voiceId);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New AI Campaign</DialogTitle>
          <DialogDescription>
            Set up a new AI calling campaign to reach out to your leads
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Campaign name is required' })}
                placeholder="Enter campaign name"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...register('description')}
                placeholder="Brief description of the campaign"
              />
            </div>

            <VoiceSelector
              onVoiceSelect={handleVoiceSelect}
              selectedVoice={selectedVoice}
              className="border-none p-0 shadow-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai_prompt">AI Conversation Prompt *</Label>
            <Textarea
              id="ai_prompt"
              {...register('ai_prompt', { required: 'AI prompt is required' })}
              placeholder="Enter the conversation script and instructions for the AI..."
              rows={6}
              className="resize-none"
            />
            {errors.ai_prompt && <p className="text-sm text-destructive">{errors.ai_prompt.message}</p>}
            <p className="text-sm text-muted-foreground">
              This prompt will guide the AI's conversation. Be specific about the goal, tone, and key points to cover.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
