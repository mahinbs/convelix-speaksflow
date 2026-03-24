
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Leads</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Manual Entry</span>
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV Upload</span>
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
