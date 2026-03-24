import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BlandAICall } from '@/hooks/useBlandAICalls';

interface CallDetailsDialogProps {
    call: BlandAICall | null;
    open: boolean;
    onClose: () => void;
    view: 'transcript' | 'recording' | null;
}

export const CallDetailsDialog: React.FC<CallDetailsDialogProps> = ({
    call,
    open,
    onClose,
    view
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Memoize handlers to prevent unnecessary re-renders
    const handleDownload = useCallback(async () => {
        if (!call?.recording_url) return;
        setIsLoading(true);

        try {
            const response = await fetch(call.recording_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `call-${call.id}.mp3`; // Assuming MP3 format
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading recording:', error);
        } finally {
            setIsLoading(false);
        }
    }, [call]);

    const handlePlayPause = useCallback(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying, audioRef]);

    // Use useEffect for side effects
    useEffect(() => {
        // Reset state when dialog closes
        if (!open) {
            setIsPlaying(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
    }, [open]);

    if (!call) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>
                        {view === 'transcript' ? 'Call Transcript' : 'Call Recording'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Call Info */}
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div>Phone: {call.phone_number}</div>
                        <div>
                            {call.created_at
                                ? new Date(call.created_at).toLocaleString()
                                : 'Unknown time'}
                        </div>
                    </div>

                    {/* Transcript View */}
                    {view === 'transcript' && call.transcript && (
                        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                            <div className="whitespace-pre-wrap font-mono text-sm">
                                {call.transcript}
                            </div>
                        </ScrollArea>
                    )}

                    {/* Recording View */}
                    {view === 'recording' && call.recording_url && (
                        <div className="space-y-4">
                            <audio
                                ref={audioRef}
                                src={call.recording_url}
                                onEnded={() => setIsPlaying(false)}
                                onPause={() => setIsPlaying(false)}
                                onPlay={() => setIsPlaying(true)}
                            />

                            <div className="flex justify-center space-x-4">
                                <Button
                                    onClick={handlePlayPause}
                                    variant="outline"
                                    size="lg"
                                    disabled={isLoading}
                                >
                                    {isPlaying ? 'Pause' : 'Play'}
                                </Button>

                                <Button
                                    onClick={handleDownload}
                                    variant="outline"
                                    size="lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Downloading...' : 'Download'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}; 