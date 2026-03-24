import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useUpdateLead, Lead } from '@/hooks/useLeads';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface EditLeadDialogProps {
    open: boolean;
    onClose: () => void;
    lead: Lead;
}

interface LeadFormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    job_title: string;
    status: string;
    priority: string;
    notes: string;
}

export const EditLeadDialog: React.FC<EditLeadDialogProps> = ({
    open,
    onClose,
    lead,
}) => {
    const { toast } = useToast();
    const updateLead = useUpdateLead();

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<LeadFormData>({
        defaultValues: {
            name: lead.name || '',
            email: lead.email || '',
            phone: lead.phone || '',
            company: lead.company || '',
            job_title: lead.job_title || '',
            status: lead.status || 'new',
            priority: lead.priority || 'medium',
            notes: lead.lead_data?.notes || '',
        },
    });

    const statusValue = watch('status');
    const priorityValue = watch('priority');

    useEffect(() => {
        if (open) {
            reset({
                name: lead.name || '',
                email: lead.email || '',
                phone: lead.phone || '',
                company: lead.company || '',
                job_title: lead.job_title || '',
                status: lead.status || 'new',
                priority: lead.priority || 'medium',
                notes: lead.lead_data?.notes || '',
            });
        }
    }, [open, lead, reset]);

    const onSubmit = async (data: LeadFormData) => {
        try {
            const updateData = {
                name: data.name.trim() || null,
                email: data.email.trim() || null,
                phone: data.phone.trim() || null,
                company: data.company.trim() || null,
                job_title: data.job_title.trim() || null,
                status: data.status,
                priority: data.priority,
                lead_data: {
                    ...lead.lead_data,
                    notes: data.notes.trim(),
                },
                updated_at: new Date().toISOString(),
            };

            await updateLead.mutateAsync({
                id: lead.id,
                updates: updateData,
            });

            toast({
                title: "Lead Updated",
                description: "Lead information has been successfully updated.",
            });

            onClose();
        } catch (error: any) {
            console.error('Error updating lead:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to update lead. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Lead</DialogTitle>
                    <DialogDescription>
                        Update the lead information below. All changes will be saved to your lead database.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter lead's full name"
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                                })}
                            />
                            {errors.name && (
                                <p className="text-destructive text-sm">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="lead@company.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-destructive text-sm">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                {...register('phone')}
                            />
                            {errors.phone && (
                                <p className="text-destructive text-sm">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Company */}
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                placeholder="Company name"
                                {...register('company')}
                            />
                        </div>

                        {/* Job Title */}
                        <div className="space-y-2">
                            <Label htmlFor="job_title">Job Title</Label>
                            <Input
                                id="job_title"
                                placeholder="Job title/position"
                                {...register('job_title')}
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={statusValue}
                                onValueChange={(value) => setValue('status', value)}
                            >
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

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={priorityValue}
                                onValueChange={(value) => setValue('priority', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add any additional notes about this lead..."
                            rows={4}
                            {...register('notes')}
                        />
                    </div>

                    {/* Lead Source (Read-only) */}
                    <div className="space-y-2">
                        <Label>Lead Source</Label>
                        <div className="p-3 bg-muted border rounded-md">
                            <span className="text-sm text-muted-foreground">
                                {lead.source.replace('_', ' ').toUpperCase()}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                                This field cannot be edited as it represents where the lead originated from.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Lead'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
