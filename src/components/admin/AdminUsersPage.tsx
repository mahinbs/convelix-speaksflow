import React from 'react';
import { UserTable } from './UserTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminUsersPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-muted-foreground">View and manage all users in the system</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        A comprehensive list of all users, their subscription plans, and activity status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserTable />
                </CardContent>
            </Card>
        </div>
    );
}; 