
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateVapiAIAssistant } from '@/hooks/useVapiAIAssistants';
import { toast } from 'sonner';

interface CreateAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAssistantDialog: React.FC<CreateAssistantDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    model: 'gpt-3.5-turbo',
    first_message: '',
    voice_settings: {
      provider: 'playht',
      voice_id: 'jennifer',
    },
  });

  const createAssistant = useCreateVapiAIAssistant();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createAssistant.mutateAsync({
        name: formData.name,
        description: formData.description,
        prompt: formData.prompt,
        model: formData.model,
        first_message: formData.first_message,
        voice_settings: formData.voice_settings,
        status: 'active',
        background_sound: null,
        functions: null,
      });
      
      toast.success('Assistant created successfully!');
      onOpenChange(false);
      setFormData({
        name: '',
        description: '',
        prompt: '',
        model: 'gpt-3.5-turbo',
        first_message: '',
        voice_settings: {
          provider: 'playht',
          voice_id: 'jennifer',
        },
      });
    } catch (error) {
      toast.error('Failed to create assistant');
      console.error('Error creating assistant:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Voice AI Assistant</DialogTitle>
          <DialogDescription>
            Create a new voice AI assistant for real-time conversations.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Sales Assistant"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select 
                value={formData.model} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="AI assistant for qualifying sales leads"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_message">First Message</Label>
            <Input
              id="first_message"
              value={formData.first_message}
              onChange={(e) => setFormData(prev => ({ ...prev, first_message: e.target.value }))}
              placeholder="Hi! Thanks for calling. How can I help you today?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">System Prompt *</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="You are a helpful sales assistant. Your goal is to qualify leads and schedule appointments..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <Select 
              value={formData.voice_settings.voice_id} 
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                voice_settings: { ...prev.voice_settings, voice_id: value }
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jennifer">Jennifer (Female, Professional)</SelectItem>
                <SelectItem value="sarah">Sarah (Female, Friendly)</SelectItem>
                <SelectItem value="mark">Mark (Male, Professional)</SelectItem>
                <SelectItem value="daniel">Daniel (Male, Casual)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createAssistant.isPending}>
              {createAssistant.isPending ? 'Creating...' : 'Create Assistant'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
