import React from 'react';
import { ContactSubmissionsTable } from './ContactSubmissionsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ContactSubmissionsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Contact Submissions</h2>
                <p className="text-muted-foreground">View and manage all contact form submissions</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Submissions</CardTitle>
                    <CardDescription>
                        A list of all contact form submissions from various sources including website forms, chat interactions, and consultation requests.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ContactSubmissionsTable />
                </CardContent>
            </Card>
        </div>
    );
}; 