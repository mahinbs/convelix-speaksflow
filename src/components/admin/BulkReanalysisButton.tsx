
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BulkReanalysisButtonProps {
  userEmail: string;
}

export const BulkReanalysisButton: React.FC<BulkReanalysisButtonProps> = ({ userEmail }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBulkReanalysis = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('bulk-reanalyze-calls', {
        body: { userEmail }
      });

      if (error) throw error;

      toast({
        title: 'Reanalysis Started',
        description: `Processing ${data.total} calls for reanalysis. This may take a few minutes.`,
      });

      // Wait a bit then show completion
      setTimeout(() => {
        toast({
          title: 'Reanalysis Complete',
          description: `${data.processed} calls reanalyzed successfully${data.errors > 0 ? ` (${data.errors} errors)` : ''}.`,
        });
      }, 5000);

    } catch (error) {
      console.error('Error triggering bulk reanalysis:', error);
      toast({
        title: 'Error',
        description: 'Failed to start bulk reanalysis. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>Reanalyze All Calls</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reanalyze All Calls</AlertDialogTitle>
          <AlertDialogDescription>
            This will reanalyze all completed calls for <strong>{userEmail}</strong> using the improved AI analysis system. This process may take several minutes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleBulkReanalysis} disabled={isLoading}>
            {isLoading ? 'Starting...' : 'Start Reanalysis'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
