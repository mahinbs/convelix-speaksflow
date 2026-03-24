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
                // For new users, try to check the activation status
                const { data, error } = await supabase
                    .from('user_activation_status')
                    .select('status')
                    .eq('profile_id', user.id)
                    .maybeSingle();

                console.log('Activation status query result:', { data, error });

                // If we get a 403 or permission error for new users, they should see setup notice
                if (error && (error.code === 'PGRST301' || error.message.includes('permission') || error.message.includes('denied'))) {
                    console.log('Permission denied for new user - showing setup notice');
                    return true; // Show setup notice
                }

                // If other error for new users, still show setup notice to be safe
                if (error) {
                    console.log('Other error for new user - showing setup notice to be safe:', error.message);
                    return true;
                }

                // If no data returned for new user, they should have had a record created - show setup notice
                if (!data) {
                    console.log('No activation status found for new user - showing setup notice');
                    return true;
                }

                // If status exists and is pending, show setup notice
                const isPending = data.status === 'pending';
                console.log('User activation status:', data.status, 'Setup required:', isPending);
                return isPending;

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