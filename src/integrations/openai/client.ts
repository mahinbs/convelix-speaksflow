import { supabase } from '@/integrations/supabase/client';

class OpenAIClient {
    private apiKey: string | null = null;
    private baseUrl = 'https://api.openai.com/v1';

    async getApiKey(): Promise<string | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            // Use user-specific key by appending user ID
            const userSpecificKey = `openai_api_key_${user.id}`;

            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', userSpecificKey)
                .single();

            if (error || !data) return null;

            return data.value;
        } catch (error) {
            console.error('Error fetching OpenAI API key:', error);
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
            const userSpecificKey = `openai_api_key_${user.id}`;

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
                console.error('Error saving OpenAI API key:', error);
                return false;
            }

            this.apiKey = apiKey;
            return true;
        } catch (error) {
            console.error('Error saving OpenAI API key:', error);
            return false;
        }
    }

    async testConnection(): Promise<boolean> {
        // Use existing API key if set, otherwise try to get from database
        if (!this.apiKey) {
            const apiKey = await this.getApiKey();
            if (!apiKey) {
                throw new Error('API key not configured');
            }
            this.apiKey = apiKey;
        }

        try {
            // Test the connection by getting models list
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error?.message || 'Invalid API key or unable to connect to OpenAI';
                throw new Error(errorMessage);
            }

            return true;
        } catch (error: any) {
            console.error('Error testing OpenAI connection:', error);
            throw error;
        }
    }
}

export const openAIClient = new OpenAIClient(); 