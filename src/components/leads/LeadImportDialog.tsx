
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Plus, FileSpreadsheet } from 'lucide-react';
import { CSVUpload } from './CSVUpload';
import { ManualLeadForm } from './ManualLeadForm';

interface LeadImportDialogProps {
  trigger?: React.ReactNode;
}

export const LeadImportDialog: React.FC<LeadImportDialogProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);

  const defaultTrigger = (
    <Button>
      <Plus className="w-4 h-4 mr-2" />
      Add Leads
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-4xl overflow-y-auto sm:w-full">
        <DialogHeader>
          <DialogTitle>Import Leads</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-1 p-1 sm:grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2 touch-manipulation">
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate">Manual Entry</span>
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2 touch-manipulation">
              <FileSpreadsheet className="h-4 w-4 shrink-0" />
              <span className="truncate">CSV Upload</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="mt-6">
            <ManualLeadForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="csv" className="mt-6">
            <CSVUpload onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
