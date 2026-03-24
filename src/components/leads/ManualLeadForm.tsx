import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { formatPhoneNumber, validatePhoneNumber, SUPPORTED_COUNTRIES, getCountryDisplayName } from '@/utils/phoneUtils';
import { parsePhoneNumber } from 'libphonenumber-js';

interface ManualLeadFormProps {
  onSuccess?: () => void;
}

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  source: string;
  status: string;
  score: number;
  notes: string;
}

export const ManualLeadForm: React.FC<ManualLeadFormProps> = ({ onSuccess }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<LeadFormData>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const onSubmit = async (data: LeadFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add leads",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate phone number if provided
      if (data.phone) {
        if (!validatePhoneNumber(data.phone)) {
          toast({
            title: "Error",
            description: "Please enter a valid phone number",
            variant: "destructive",
          });
          return;
        }
        // Format the phone number
        const formattedNumber = formatPhoneNumber(data.phone);
        if (!formattedNumber) {
          toast({
            title: "Error",
            description: "Failed to format phone number",
            variant: "destructive",
          });
          return;
        }
        data.phone = formattedNumber;
      }

      // Destructure notes from the data and prepare the lead data
      const { notes, ...leadData } = data;

      const { error } = await supabase
        .from('leads')
        .insert([{
          ...leadData,
          user_id: user.id,
          source: data.source || 'manual',
          lead_data: notes ? { notes } : null,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['leads'] });
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error adding lead:', error);
      toast({
        title: "Error",
        description: "Failed to add lead. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Name is required' })}
            placeholder="Enter lead name"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (International)</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="Enter phone number with country code (e.g., +1234567890)"
          />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported formats:</p>
            <ul className="list-disc pl-4 space-y-1">
              {SUPPORTED_COUNTRIES.map(country => (
                <li key={country}>{getCountryDisplayName(country)}</li>
              ))}
            </ul>
            <p>Include the + and country code (e.g., +1 for US/Canada, +91 for India)</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            {...register('company')}
            placeholder="Enter company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job_title">Job Title</Label>
          <Input
            id="job_title"
            {...register('job_title')}
            placeholder="Enter job title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select onValueChange={(value) => setValue('source', value)} defaultValue="manual">
            <SelectTrigger>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual Entry</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={(value) => setValue('status', value)} defaultValue="new">
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="score">Lead Score (0-100)</Label>
          <Input
            id="score"
            type="number"
            min="0"
            max="100"
            {...register('score', {
              valueAsNumber: true,
              min: { value: 0, message: 'Score must be at least 0' },
              max: { value: 100, message: 'Score must be at most 100' }
            })}
            placeholder="Enter lead score"
          />
          {errors.score && <p className="text-sm text-destructive">{errors.score.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Enter any additional notes about this lead"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Clear Form
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Lead...' : 'Add Lead'}
        </Button>
      </div>
    </form>
  );
};
