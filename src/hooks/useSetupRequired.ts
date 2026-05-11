import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Helper function to manually add a user to pending status (for testing)
export const addUserToPendingStatus = async (userId: string) => {
    try {
        const { error } = await supabase
            .from('user_activation_status')
            .insert({
                profile_id: userId,
                status: 'pending'
            });
        
        if (error) throw error;
        console.log('User added to pending status successfully');
        return true;
    } catch (error) {
        console.error('Error adding user to pending status:', error);
        return false;
    }
};

// Helper function to check user's own activation status using a custom RPC
export const checkUserActivationStatus = async (userId: string) => {
    try {
        // Try to use a simple query first
        const { data, error } = await supabase
            .from('user_activation_status')
            .select('status')
            .eq('profile_id', userId)
            .maybeSingle();

        if (error) {
            console.log('Direct query failed, user likely has no activation status:', error.message);
            return null; // No activation status means existing user
        }

        return data;
    } catch (error) {
        console.error('Error checking activation status:', error);
        return null;
    }
};

export const useSetupRequired = () => {
    const { user } = useAuth();

    const { data: setupRequired, isLoading } = useQuery({
        queryKey: ['activation_status', user?.id],
        queryFn: async () => {
            if (!user) {
                console.log('No user found');
                return false;
            }

            console.log('Checking activation status for user:', user.id);

            // Check if this is an existing user (created before activation system)
            // Activation system was implemented on 2024-03-23, so users created before this are existing users
            const activationSystemDate = new Date('2025-06-19T00:00:00Z');
            const userCreatedAt = new Date(user.created_at);
            
            console.log('User created at:', userCreatedAt);
            console.log('Activation system date:', activationSystemDate);
            
            if (userCreatedAt < activationSystemDate) {
                console.log('User created before activation system - existing user, allowing access');
                return false;
            }

            console.log('User created after activation system - checking activation status');

            try {
                // Prefer RPC because it is security definer and avoids client-side RLS edge cases.
                const { data: rpcData, error: rpcError } = await supabase.rpc('check_my_activation_status');
                if (!rpcError && rpcData && rpcData.length > 0) {
                    const status = rpcData[0].status;
                    const setupRequiredForStatus = status !== 'active';
                    console.log('Activation status from RPC:', status, 'Setup required:', setupRequiredForStatus);
                    return setupRequiredForStatus;
                }

                console.log('RPC activation check failed or returned empty, falling back to direct query:', rpcError?.message);

                // Fallback to direct query
                const { data, error } = await supabase
                    .from('user_activation_status')
                    .select('status')
                    .eq('profile_id', user.id)
                    .maybeSingle();

                console.log('Activation status query result:', { data, error });

                if (error) {
                    console.log('Activation check failed - showing setup notice:', error.message);
                    return true;
                }

                if (!data) {
                    console.log('No activation status found for new user - showing setup notice');
                    return true;
                }

                const setupRequiredForStatus = data.status !== 'active';
                console.log('User activation status:', data.status, 'Setup required:', setupRequiredForStatus);
                return setupRequiredForStatus;

            } catch (error) {
                console.error('Unexpected error checking setup status:', error);
                // For new users, if there's an error, show setup notice to be safe
                return true;
            }
        },
        enabled: !!user, // Only run query if user is authenticated
        refetchOnWindowFocus: true, // Refetch when window gains focus
        staleTime: 0 // Always refetch to get latest status
    });

    console.log('useSetupRequired result:', { setupRequired, isLoading });

    return {
        setupRequired: setupRequired ?? false, // Default to false if data is not loaded
        isLoading
    };
}; 