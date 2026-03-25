import React from 'react';
import { AdminFilterProvider } from '@/contexts/AdminFilterContext';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const Admin: React.FC = () => {
    return (
        <AdminFilterProvider>
            <div className="container mx-auto max-w-full overflow-x-hidden px-3 py-6 sm:px-4 sm:py-8">
                <AdminDashboard />
            </div>
        </AdminFilterProvider>
    );
};

export default Admin; 