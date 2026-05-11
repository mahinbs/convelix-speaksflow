
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface User {
    id: string;
    email: string;
    full_name: string;
    subscription_plan: string;
    leads_count: number;
    status: 'active' | 'inactive';
    created_at: string;
}

export const UserTable: React.FC = () => {
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['admin_users'],
        queryFn: async () => {
            try {
                // First check if current user is super admin
                const { data: { user } } = await supabase.auth.getUser();
                console.log('Current user data:', user);

                if (!user?.user_metadata?.super_admin) {
                    throw new Error('Access denied. User is not a super admin.');
                }

                // Use the get_admin_users_data function instead of direct table access
                const { data, error } = await supabase
                    .rpc('get_admin_users_data');

                if (error) {
                    console.error('Error fetching admin users:', error);
                    throw error;
                }

                if (!data) {
                    return [];
                }

                // Transform the data to match our User interface
                return data.map(user => ({
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name || '',
                    subscription_plan: user.subscription_plan || 'free',
                    leads_count: Number(user.leads_count) || 0,
                    status: user.status || 'active',
                    created_at: user.created_at
                })) as User[];

            } catch (error) {
                console.error('Error in admin users fetch:', error);
                throw error;
            }
        },
    });

    if (isLoading) {
        return <div className="flex items-center justify-center p-8">Loading users...</div>;
    }

    if (error) {
        return (
            <div className="text-center p-8 text-red-600">
                Error loading users: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Leads</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users?.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.subscription_plan === 'free' ? 'secondary' : 'default'}>
                                    {user.subscription_plan || 'Free'}
                                </Badge>
                            </TableCell>
                            <TableCell>{user.leads_count}</TableCell>
                            <TableCell>
                                <Badge variant="default">
                                    {user.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}; 
