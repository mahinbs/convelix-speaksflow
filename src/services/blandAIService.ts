import { supabase } from '@/integrations/supabase/client';

interface Voice {
    id: string;
    name: string;
    language: string;
    gender: string;
    accent?: string;
    description?: string;
}

interface TestVoiceResponse {
    audioUrl: string;
    duration: number;
}

class BlandAIService {
    // No longer need to store API key or baseURL locally
    // All requests go through the Edge Function proxy

    async getVoices(): Promise<Voice[]> {
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
                    endpoint: '/voices',
                    method: 'GET'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || 'Could not connect to Bland AI. Please check your API key and try again.');
            }

            const data = await response.json();
            console.log('Bland AI Response:', data);

            // Transform the response to match our Voice interface
            return data.voices.map((voice: any) => {
                console.log('Individual voice:', voice);
                return {
                    id: voice.id,
                    name: voice.name,
                    language: voice.language || '',
                    gender: voice.gender || '',
                    accent: voice.accent || '',
                    description: voice.description || '',
                };
            });
        } catch (error: any) {
            console.error('Error fetching voices from Bland AI:', error);
            throw error;
        }
    }

    async testVoice(voiceId: string, text: string = "Hi, thank you for choosing me! Give me a prompt and I will help you in your call."): Promise<TestVoiceResponse> {
        if (!voiceId) {
            throw new Error('No voice selected. Please select a voice to test.');
        }

        try {
            console.log('Testing voice with ID:', voiceId);

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
                    endpoint: '/speak',
                    method: 'POST',
                    body: {
                        voice_id: voiceId,
                        text: text
                    }
                })
            });

            const responseData = await response.json().catch(() => null);
            console.log('Voice test response:', responseData);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Voice testing is not available. Please select this voice and use it in your campaign.');
                } else if (response.status === 401 || response.status === 403) {
                    throw new Error('Invalid or expired API key. Please check your settings.');
                } else if (responseData?.error || responseData?.message) {
                    throw new Error(responseData.error || responseData.message);
                }
                throw new Error('Voice preview is not available for this voice. You can still use it in your campaigns.');
            }

            // Check multiple possible response formats
            let audioUrl = null;
            if (responseData?.url) {
                audioUrl = responseData.url;
            } else if (responseData?.audio_url) {
                audioUrl = responseData.audio_url;
            } else if (responseData?.sample_url) {
                audioUrl = responseData.sample_url;
            } else if (responseData?.file_url) {
                audioUrl = responseData.file_url;
            } else if (typeof responseData === 'string') {
                // Sometimes APIs return just the URL as a string
                audioUrl = responseData;
            }

            if (!audioUrl) {
                console.error('No audio URL found in response:', responseData);
                throw new Error('No audio URL found in the response. Voice sample may not be available.');
            }

            return {
                audioUrl: audioUrl,
                duration: responseData.duration || 0,
            };
        } catch (error: any) {
            console.error('Error testing voice:', error);
            throw error;
        }
    }
}

export const blandAIService = new BlandAIService(); 