import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Mail, Phone, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    message: string | null;
    form_type: string;
    status: string;
    created_at: string;
}

export const ContactSubmissionsTable: React.FC = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { data: submissions, isLoading, error } = useQuery({
        queryKey: ['contact_submissions'],
        queryFn: async () => {
            try {
                // First check if current user is super admin
                const { data: { user } } = await supabase.auth.getUser();
                if (!user?.user_metadata?.super_admin) {
                    throw new Error('Access denied. User is not a super admin.');
                }

                const { data, error } = await supabase
                    .from('contact_submissions')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching contact submissions:', error);
                    throw error;
                }

                return data as ContactSubmission[];
            } catch (error) {
                console.error('Error in contact submissions fetch:', error);
                throw error;
            }
        },
    });

    const handleEmailClick = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    const handlePhoneClick = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    const handleStatusChange = async (submissionId: string, newStatus: string) => {
        try {
            // Optimistically update the UI
            queryClient.setQueryData(['contact_submissions'], (oldData: ContactSubmission[] | undefined) => {
                if (!oldData) return [];
                return oldData.map(submission =>
                    submission.id === submissionId
                        ? { ...submission, status: newStatus }
                        : submission
                );
            });

            // Make the actual update
            const { error } = await supabase
                .from('contact_submissions')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', submissionId);

            if (error) {
                throw error;
            }

            toast({
                title: "Status Updated",
                description: "The submission status has been successfully updated.",
            });

            // Refresh the data to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['contact_submissions'] });
        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: "Error",
                description: "Failed to update status. Please try again.",
                variant: "destructive",
            });
            // Revert optimistic update on error
            queryClient.invalidateQueries({ queryKey: ['contact_submissions'] });
        }
    };

    const getFormTypeLabel = (formType: string) => {
        switch (formType) {
            case 'demo':
                return 'Demo Request';
            case 'pricing':
                return 'Pricing Inquiry';
            case 'consultation':
                return 'Consultation';
            case 'expert':
                return 'Expert Call';
            case 'chat':
                return 'Chat Lead';
            default:
                return 'Contact Form';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-brand-50 text-brand-800';
            case 'contacted':
                return 'bg-brand-50 text-brand-800';
            case 'qualified':
                return 'bg-brand-50 text-brand-800';
            case 'converted':
                return 'bg-brand-50 text-brand-800';
            case 'not_interested':
                return 'bg-destructive/10 text-destructive';
            default:
                return 'bg-muted text-foreground';
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center p-8">Loading submissions...</div>;
    }

    if (error) {
        return (
            <div className="text-center p-8 text-destructive">
                Error loading submissions: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Form Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions?.map((submission) => (
                        <TableRow key={submission.id}>
                            <TableCell>
                                <div className="space-y-1">
                                    <p className="font-medium">{submission.name}</p>
                                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                        <button
                                            onClick={() => handleEmailClick(submission.email)}
                                            className="flex items-center gap-1 hover:text-brand-700"
                                        >
                                            <Mail className="w-4 h-4" />
                                            {submission.email}
                                        </button>
                                        {submission.phone && (
                                            <button
                                                onClick={() => handlePhoneClick(submission.phone!)}
                                                className="flex items-center gap-1 hover:text-brand-700"
                                            >
                                                <Phone className="w-4 h-4" />
                                                {submission.phone}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{submission.company || '-'}</TableCell>
                            <TableCell>
                                <div className="max-w-xs overflow-hidden text-ellipsis">
                                    {submission.message || '-'}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary">
                                    {getFormTypeLabel(submission.form_type)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Select
                                    defaultValue={submission.status || 'new'}
                                    onValueChange={(value) => handleStatusChange(submission.id, value)}
                                >
                                    <SelectTrigger className={`w-[140px] ${getStatusBadgeColor(submission.status || 'new')}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="contacted">Contacted</SelectItem>
                                        <SelectItem value="qualified">Qualified</SelectItem>
                                        <SelectItem value="converted">Converted</SelectItem>
                                        <SelectItem value="not_interested">Not Interested</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                {new Date(submission.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEmailClick(submission.email)}
                                    >
                                        Contact
                                    </Button>
                                    {submission.status === 'converted' ? (
                                        <CheckCircle2 className="w-5 h-5 text-brand-700" />
                                    ) : submission.status === 'not_interested' ? (
                                        <XCircle className="w-5 h-5 text-destructive" />
                                    ) : null}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}; 