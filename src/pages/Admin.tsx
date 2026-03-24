import React from 'react';
import { AdminFilterProvider } from '@/contexts/AdminFilterContext';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const Admin: React.FC = () => {
    return (
        <AdminFilterProvider>
            <div className="container mx-auto py-8 px-4">
                <AdminDashboard />
            </div>
        </AdminFilterProvider>
    );
};

export default Admin; 