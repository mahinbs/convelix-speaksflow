import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { blandAIService } from '@/services/blandAIService';
import { useToast } from '@/hooks/use-toast';

interface Voice {
    id: string;
    name: string;
    language: string;
    gender: string;
    accent?: string;
    description?: string;
}

interface VoiceSelectorProps {
    onVoiceSelect: (voiceId: string) => void;
    selectedVoice: string;
    className?: string;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
    onVoiceSelect,
    selectedVoice = '',
    className = '',
}) => {
    const [voices, setVoices] = useState<Voice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Format voice name for display
    const formatVoiceName = (voice: Voice): string => {
        if (!voice || !voice.name) return '';

        // Custom descriptions for voices
        const getVoiceDescription = (voice: Voice): string => {
            const name = voice.name.toLowerCase();
            const gender = voice.gender?.toLowerCase() || '';
            const accent = voice.accent?.toLowerCase() || '';
            const description = voice.description?.toLowerCase() || '';

            // Build a natural description
            const parts = [];

            // Try to infer nationality/accent if not provided
            let hasAccent = false;
            if (accent.includes('australian') || description.includes('australian')) {
                parts.push('an Australian');
                hasAccent = true;
            } else if (accent.includes('british') || description.includes('british')) {
                parts.push('a British');
                hasAccent = true;
            } else if (accent.includes('indian') || description.includes('indian')) {
                parts.push('an Indian');
                hasAccent = true;
            } else if (accent.includes('american') || description.includes('american')) {
                parts.push('an American');
                hasAccent = true;
            } else if (accent.includes('french') || description.includes('french') || name.includes('french')) {
                parts.push('a French');
                hasAccent = true;
            } else if (accent.includes('german') || description.includes('german')) {
                parts.push('a German');
                hasAccent = true;
            } else if (accent.includes('spanish') || description.includes('spanish')) {
                parts.push('a Spanish');
                hasAccent = true;
            } else if (accent.includes('italian') || description.includes('italian')) {
                parts.push('an Italian');
                hasAccent = true;
            }

            // If no accent was found, default to American for English names without specific accent
            if (!hasAccent && !accent && !description.includes('accent')) {
                parts.push('an American');
            }

            // Try to infer gender if not provided
            let hasGender = false;
            if (gender.includes('female') || gender.includes('woman')) {
                parts.push('woman');
                hasGender = true;
            } else if (gender.includes('male') || gender.includes('man')) {
                parts.push('man');
                hasGender = true;
            } else {
                // Try to infer gender from common name patterns
                const femaleNames = ['anna', 'sarah', 'emily', 'julia', 'sophie', 'emma', 'lisa', 'maria', 'june', 'josephine', 'allie', 'amelia'];
                const maleNames = ['john', 'james', 'michael', 'david', 'peter', 'karl', 'josh', 'joseph', 'ryan', 'johannes'];

                if (femaleNames.some(femaleName => name.includes(femaleName))) {
                    parts.push('woman');
                    hasGender = true;
                } else if (maleNames.some(maleName => name.includes(maleName))) {
                    parts.push('man');
                    hasGender = true;
                }
            }

            // Add voice characteristics
            const characteristics = [];

            // Personality traits
            if (description.includes('soft') || description.includes('gentle')) {
                characteristics.push('soft and gentle');
            } else if (description.includes('energetic') || description.includes('upbeat')) {
                characteristics.push('energetic and upbeat');
            } else if (description.includes('professional')) {
                characteristics.push('professional');
            } else if (description.includes('friendly')) {
                characteristics.push('friendly and approachable');
            } else if (description.includes('warm')) {
                characteristics.push('warm and inviting');
            } else if (description.includes('neutral')) {
                characteristics.push('neutral and balanced');
            } else if (description.includes('confident')) {
                characteristics.push('confident and assured');
            }

            // Voice qualities
            if (description.includes('deep')) {
                characteristics.push('deep');
            } else if (description.includes('clear')) {
                characteristics.push('clear and articulate');
            } else if (description.includes('smooth')) {
                characteristics.push('smooth');
            } else if (description.includes('crisp')) {
                characteristics.push('crisp and clear');
            }

            // If we have no characteristics but have gender/accent, add a default characteristic
            if (characteristics.length === 0 && (hasGender || hasAccent)) {
                characteristics.push('natural');
            }

            // Combine all parts into a natural description
            let finalDescription = parts.join(' ');

            if (characteristics.length > 0) {
                // Add voice characteristics with natural language
                if (characteristics.length === 1) {
                    finalDescription += ` with a ${characteristics[0]} voice`;
                } else if (characteristics.length === 2) {
                    finalDescription += ` with a ${characteristics.join(' and ')} voice`;
                } else {
                    const lastChar = characteristics.pop();
                    finalDescription += ` with a ${characteristics.join(', ')}, and ${lastChar} voice`;
                }
            }

            // If we couldn't determine anything, provide a basic description
            if (!finalDescription) {
                finalDescription = 'Voice';
            }

            return finalDescription;
        };

        // Format the name (capitalize first letter)
        const name = voice.name.split('-')[0];
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

        // Get the custom description
        const description = getVoiceDescription(voice);

        return `${formattedName} (${description})`;
    };

    useEffect(() => {
        const fetchVoices = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedVoices = await blandAIService.getVoices();
                
                // Sort voices by name
                const sortedVoices = fetchedVoices.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                
                setVoices(sortedVoices);

                // If we have a selectedVoice but it's not in the fetched voices,
                // notify the user and clear the selection
                if (selectedVoice && !sortedVoices.some(v => v.id === selectedVoice)) {
                    toast({
                        title: "Warning",
                        description: "Previously selected voice is no longer available. Please select another voice.",
                        variant: "destructive",
                    });
                    onVoiceSelect('');
                }
            } catch (error: any) {
                console.error('Error fetching voices:', error);
                setError(error.message || 'Failed to load voices. Please try again later.');
                setVoices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVoices();
    }, [selectedVoice, onVoiceSelect]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-[52px]">
                    <div className="w-6 h-6 animate-spin rounded-full border-2 border-muted-foreground/50 border-t-transparent" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center space-x-2 text-destructive h-[52px]">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </div>
            );
        }

        if (voices.length === 0) {
            return (
                <div className="text-center text-muted-foreground h-[52px] flex items-center justify-center">
                    No voices available
                </div>
            );
        }

        return (
            <Select
                value={selectedVoice}
                onValueChange={onVoiceSelect}
            >
                <SelectTrigger className="h-[52px]">
                    <SelectValue placeholder="Select voice">
                        {selectedVoice && voices.length > 0
                            ? formatVoiceName(voices.find(v => v.id === selectedVoice) || voices[0])
                            : 'Select voice'}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                    {voices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                            {formatVoiceName(voice)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    };

    return (
        <div className={className}>
            <div className="space-y-2">
                <Label>Voice</Label>
                {renderContent()}
            </div>
        </div>
    );
}; 