import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SuperAdminRouteProps {
    children: React.ReactNode;
}

const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
    const [checkingAdmin, setCheckingAdmin] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const checkSuperAdmin = async () => {
            // Don't proceed if still loading auth state
            if (loading) {
                console.log('Auth still loading, waiting...');
                return;
            }

            if (!user) {
                console.log('No user found after auth load, setting checkingAdmin to false');
                setCheckingAdmin(false);
                return;
            }

            console.log('Checking super admin status for user:', user.id);
            console.log('User metadata:', user.user_metadata);

            try {
                // First check user metadata directly
                if (user.user_metadata?.super_admin === true) {
                    console.log('User is super admin according to metadata');
                    setIsSuperAdmin(true);
                    setCheckingAdmin(false);
                    return;
                }

                // If not in metadata, check using RPC function
                console.log('Checking super admin status via RPC function');
                const { data, error } = await supabase.rpc('is_super_admin', {
                    user_id: user.id
                });

                console.log('RPC response:', { data, error });

                if (error) {
                    console.error('Error checking super admin status:', error);
                    toast({
                        title: "Error",
                        description: "Failed to verify admin status. Please try again later.",
                        variant: "destructive"
                    });
                    setIsSuperAdmin(false);
                } else {
                    setIsSuperAdmin(data);
                }
            } catch (error) {
                console.error('Error checking super admin status:', error);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again later.",
                    variant: "destructive"
                });
                setIsSuperAdmin(false);
            } finally {
                setCheckingAdmin(false);
            }
        };

        checkSuperAdmin();
    }, [user, loading, toast]);

    // Show loading state while either auth is loading or we're checking admin status
    if (loading || checkingAdmin) {
        console.log('Loading state:', { authLoading: loading, checkingAdmin });
        return (
            <div className="min-h-screen bg-muted flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Only redirect to auth if we're done loading and there's no user
    if (!loading && !user) {
        console.log('No user after auth load complete, redirecting to auth');
        return <Navigate to="/auth" replace />;
    }

    // Only redirect to dashboard if we're done checking and user is not super admin
    if (!loading && !checkingAdmin && !isSuperAdmin) {
        console.log('Admin check complete, not a super admin, redirecting to dashboard');
        toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin area.",
            variant: "destructive"
        });
        return <Navigate to="/dashboard" replace />;
    }

    // Only render children if we're done checking and user is super admin
    if (!loading && !checkingAdmin && isSuperAdmin) {
        console.log('Admin check complete, user is super admin, rendering content');
        return <>{children}</>;
    }

    // Fallback loading state
    return (
        <div className="min-h-screen bg-muted flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
};

export default SuperAdminRoute; 