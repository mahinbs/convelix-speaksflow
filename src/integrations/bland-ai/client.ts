import { supabase } from '@/integrations/supabase/client';
import { formatPhoneNumber, validatePhoneNumber, getCountryFromNumber } from '@/utils/phoneUtils';

class BlandAIClient {
    private apiKey: string | null = null;
    private baseUrl = 'https://api.bland.ai/v1';

    async getApiKey(): Promise<string | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            // Use user-specific key by appending user ID
            const userSpecificKey = `bland_ai_api_key_${user.id}`;

            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', userSpecificKey)
                .single();

            if (error || !data) return null;

            return data.value;
        } catch (error) {
            console.error('Error fetching API key:', error);
            return null;
        }
    }

    // Method to temporarily set API key for testing without saving to database
    setApiKey(apiKey: string): void {
        this.apiKey = apiKey;
    }

    async saveApiKey(apiKey: string): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            // Use user-specific key by appending user ID
            const userSpecificKey = `bland_ai_api_key_${user.id}`;

            // First check if the key exists
            const { data: existingKey } = await supabase
                .from('settings')
                .select('id')
                .eq('key', userSpecificKey)
                .single();

            let error;
            if (existingKey) {
                // Update existing key
                ({ error } = await supabase
                    .from('settings')
                    .update({ value: apiKey })
                    .eq('key', userSpecificKey));
            } else {
                // Insert new key
                ({ error } = await supabase
                    .from('settings')
                    .insert([{
                        key: userSpecificKey,
                        value: apiKey
                    }]));
            }

            if (error) {
                console.error('Error saving API key:', error);
                return false;
            }

            this.apiKey = apiKey;
            return true;
        } catch (error) {
            console.error('Error saving API key:', error);
            return false;
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            // Use the Edge Function to proxy the request
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('Not authenticated');
            }

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const response = await fetch(`${supabaseUrl}/functions/v1/bland-ai-proxy`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: '/me',
                    method: 'GET',
                    apiKey: this.apiKey // Send temporarily set API key if available
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || errorData?.message || 'Invalid API key or unable to connect to Bland AI';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Check if account is active
            return data.status === 'active';
        } catch (error: any) {
            console.error('Error testing Bland AI connection:', error);
            throw error;
        }
    }

    async makeCall(phoneNumber: string, task: string, options: any = {}) {
        try {
            // Validate and format the phone number
            if (!validatePhoneNumber(phoneNumber)) {
                throw new Error('Invalid phone number. Please include country code (e.g., +1, +91, +63)');
            }

            const formattedNumber = formatPhoneNumber(phoneNumber);
            if (!formattedNumber) {
                throw new Error('Failed to format phone number. Make sure to include the country code.');
            }

            // Get the country for logging/tracking
            const country = getCountryFromNumber(formattedNumber);

            // Use the Edge Function to proxy the request
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('Not authenticated');
            }

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const response = await fetch(`${supabaseUrl}/functions/v1/bland-ai-proxy`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: '/calls',
                    method: 'POST',
                    body: {
                        phone_number: formattedNumber,
                        task: task,
                        voice: options.voice || 'maya',
                        model: options.model || 'base',
                        language: options.language || 'en-US',
                        max_duration: options.max_duration || 30,
                        record: options.record || true,
                        wait_for_greeting: options.wait_for_greeting || true,
                        reduce_latency: true,
                        answered_by_enabled: true,
                        metadata: {
                            campaign_id: options.campaign_id,
                            lead_id: options.lead_id,
                            source: 'aicaller_app',
                            country: country
                        },
                        ...options
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || errorData?.message || errorData?.errors?.join(', ') || 'Failed to initiate call';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error making Bland AI call:', error);
            throw error;
        }
    }

    async getCallStatus(callId: string) {
        try {
            // Use the Edge Function to proxy the request
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('Not authenticated');
            }

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const response = await fetch(`${supabaseUrl}/functions/v1/bland-ai-proxy`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: `/calls/${callId}`,
                    method: 'GET'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || errorData?.message || 'Failed to get call status';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting Bland AI call status:', error);
            throw error;
        }
    }

    async listCalls(options: any = {}) {
        try {
            // Build query parameters
            const params = new URLSearchParams();
            if (options.limit) params.append('limit', options.limit.toString());
            if (options.completed !== undefined) params.append('completed', options.completed.toString());
            if (options.start_date) params.append('start_date', options.start_date);
            if (options.end_date) params.append('end_date', options.end_date);
            if (options.campaign_id) params.append('campaign_id', options.campaign_id);

            const endpoint = `/calls${params.toString() ? '?' + params.toString() : ''}`;

            // Use the Edge Function to proxy the request
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('Not authenticated');
            }

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const response = await fetch(`${supabaseUrl}/functions/v1/bland-ai-proxy`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: endpoint,
                    method: 'GET'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || errorData?.message || 'Failed to list calls';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error listing Bland AI calls:', error);
            throw error;
        }
    }

    async analyzeCall(callId: string, goal: string, questions: string[][]) {
        try {
            // Use the Edge Function to proxy the request
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('Not authenticated');
            }

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const response = await fetch(`${supabaseUrl}/functions/v1/bland-ai-proxy`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint: `/calls/${callId}/analyze`,
                    method: 'POST',
                    body: {
                        goal,
                        questions
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || errorData?.message || 'Failed to analyze call';
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error analyzing Bland AI call:', error);
            throw error;
        }
    }
}

export { BlandAIClient }; 