import React, { useState } from 'react';
import { VoiceSelector } from './VoiceSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Volume2, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { blandAIService } from '@/services/blandAIService';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

export const VoicesPage: React.FC = () => {
    const [selectedVoice, setSelectedVoice] = useState<string>();
    const [testText, setTestText] = useState('Hello! This is a test of the selected voice.');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [isSettingApiKey, setIsSettingApiKey] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const { toast } = useToast();

    const handleVoiceSelect = (voiceId: string) => {
        setSelectedVoice(voiceId);
    };

    const handleTestVoice = async () => {
        if (!selectedVoice) return;

        try {
            setIsLoading(true);
            const result = await blandAIService.testVoice(selectedVoice, testText);

            if (audioRef.current) {
                audioRef.current.src = result.audioUrl;
                audioRef.current.play();
            }
        } catch (error: any) {
            console.error('Error testing voice:', error);

            // Check if the error is due to missing API key
            if (error.message.includes('API key')) {
                setIsSettingApiKey(true);
            }

            toast({
                title: 'Error',
                description: error.message || 'Failed to test voice. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveApiKey = async () => {
        try {
            setIsLoading(true);

            // Save the API key to the settings table
            const { error } = await supabase
                .from('settings')
                .upsert({
                    key: 'bland_ai_api_key',
                    value: apiKey,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            toast({
                title: 'Success',
                description: 'Bland AI API key has been saved.',
            });

            setIsSettingApiKey(false);
        } catch (error) {
            console.error('Error saving API key:', error);
            toast({
                title: 'Error',
                description: 'Failed to save API key. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSettingApiKey) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-brand-600" />
                        <span>Bland AI Setup Required</span>
                    </CardTitle>
                    <CardDescription>
                        Please enter your Bland AI API key to access the voice features
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <Input
                            id="apiKey"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Bland AI API key"
                        />
                        <p className="text-sm text-muted-foreground">
                            You can find your API key in your Bland AI dashboard settings
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            onClick={handleSaveApiKey}
                            disabled={!apiKey || isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save API Key'}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsSettingApiKey(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Bland AI Voices</h1>
                    <p className="text-muted-foreground mt-2">
                        Browse and test from our collection of 697 AI voices across multiple languages
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <VoiceSelector
                        onVoiceSelect={handleVoiceSelect}
                        selectedVoice={selectedVoice}
                        className="h-full"
                    />
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Volume2 className="w-5 h-5" />
                                <span>Voice Preview</span>
                            </CardTitle>
                            <CardDescription>
                                Test the selected voice with custom text
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Enter text to test the voice..."
                                    value={testText}
                                    onChange={(e) => setTestText(e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <audio ref={audioRef} className="w-full" controls />

                            <Button
                                className="w-full"
                                onClick={handleTestVoice}
                                disabled={!selectedVoice || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 mr-2" />
                                        Test Voice
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}; 