import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useCreateLeadImport, useUpdateLeadImport } from '@/hooks/useLeadImports';
import { useQueryClient } from '@tanstack/react-query';
import { formatPhoneNumber, validatePhoneNumber } from '@/utils/phoneUtils';

interface CSVUploadProps {
  onSuccess?: () => void;
}

interface CSVRow {
  [key: string]: string;
}

const LEAD_FIELDS = [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
  { value: 'job_title', label: 'Job Title' },
  { value: 'source', label: 'Source' },
  { value: 'status', label: 'Status' },
  { value: 'score', label: 'Score' },
  { value: 'skip', label: 'Skip Column' },
];

export const CSVUpload: React.FC<CSVUploadProps> = ({ onSuccess }) => {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'mapping' | 'preview'>('upload');

  const { user } = useAuth();
  const { toast } = useToast();
  const createLeadImport = useCreateLeadImport();
  const updateLeadImport = useUpdateLeadImport();
  const queryClient = useQueryClient();

  const parseCSV = (csvText: string): { headers: string[], rows: CSVRow[] } => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
    return { headers, rows };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const { headers, rows } = parseCSV(csvText);
        setCsvHeaders(headers);
        setCsvData(rows);
        setUploadStep('mapping');

        // Auto-map common column names
        const autoMapping: Record<string, string> = {};
        headers.forEach(header => {
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('name')) autoMapping[header] = 'name';
          else if (lowerHeader.includes('email')) autoMapping[header] = 'email';
          else if (lowerHeader.includes('phone')) autoMapping[header] = 'phone';
          else if (lowerHeader.includes('company')) autoMapping[header] = 'company';
          else if (lowerHeader.includes('title') || lowerHeader.includes('job')) autoMapping[header] = 'job_title';
          else if (lowerHeader.includes('source')) autoMapping[header] = 'source';
          else if (lowerHeader.includes('status')) autoMapping[header] = 'status';
          else if (lowerHeader.includes('score')) autoMapping[header] = 'score';
          else autoMapping[header] = 'skip';
        });
        setColumnMapping(autoMapping);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
  });

  const handleColumnMapping = (csvColumn: string, leadField: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [csvColumn]: leadField
    }));
  };

  const processImport = async () => {
    if (!user) return;

    setIsProcessing(true);

    try {
      // Create import batch
      const importBatch = await createLeadImport.mutateAsync({
        import_type: 'csv',
        source_name: 'CSV Upload',
        total_leads: csvData.length,
        successful_imports: 0,
        failed_imports: 0,
        import_status: 'processing',
        error_log: null,
        metadata: { columnMapping }
      });

      let successCount = 0;
      let failCount = 0;
      const errors: any[] = [];

      // Process leads
      for (const row of csvData) {
        try {
          const leadData: any = {
            user_id: user.id,
            import_batch_id: importBatch.id,
            source: 'csv_upload'
          };

          // Map CSV columns to lead fields
          Object.entries(columnMapping).forEach(([csvColumn, leadField]) => {
            if (leadField !== 'skip' && row[csvColumn]) {
              if (leadField === 'score') {
                leadData[leadField] = parseInt(row[csvColumn]) || 0;
              } else if (leadField === 'phone') {
                // Validate and format phone number
                const phoneNumber = row[csvColumn];
                if (!validatePhoneNumber(phoneNumber)) {
                  throw new Error(`Invalid phone number: ${phoneNumber}. Must include country code (e.g., +1, +91, +63)`);
                }
                const formattedNumber = formatPhoneNumber(phoneNumber);
                if (!formattedNumber) {
                  throw new Error(`Failed to format phone number: ${phoneNumber}. Make sure to include the country code.`);
                }
                leadData[leadField] = formattedNumber;
              } else {
                leadData[leadField] = row[csvColumn];
              }
            }
          });

          const { error } = await supabase
            .from('leads')
            .insert([leadData]);

          if (error) throw error;
          successCount++;
        } catch (error) {
          failCount++;
          errors.push({
            row,
            error: error.message,
            phone: row[Object.keys(columnMapping).find(key => columnMapping[key] === 'phone') || '']
          });
        }
      }

      // Update import batch with results
      await updateLeadImport.mutateAsync({
        id: importBatch.id,
        updates: {
          successful_imports: successCount,
          failed_imports: failCount,
          import_status: failCount > 0 ? 'completed_with_errors' : 'completed',
          completed_at: new Date().toISOString(),
          error_log: errors.length > 0 ? errors : null
        }
      });

      toast({
        title: "Import Complete",
        description: `Successfully imported ${successCount} leads. ${failCount > 0 ? `${failCount} leads failed (check error log for invalid phone numbers).` : ''}`,
      });

      queryClient.invalidateQueries({ queryKey: ['leads'] });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import leads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (uploadStep === 'upload') {
    return (
      <div className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-300 bg-brand-50' : 'border-border hover:border-muted-foreground/40'
            }`}
        >
          <input {...getInputProps()} />
          <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-brand-700">Drop the CSV file here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">Upload CSV File</p>
              <p className="text-muted-foreground mb-4">Drag and drop your CSV file here, or click to browse</p>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </div>

        <div className="bg-brand-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• First row should contain column headers</li>
            <li>• Supported columns: Name, Email, Phone, Company, Job Title, Source, Status, Score</li>
            <li>• At least Name or Email is recommended</li>
            <li>• Score should be a number between 0-100</li>
          </ul>
        </div>
      </div>
    );
  }

  if (uploadStep === 'mapping') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Map CSV Columns</h3>
          <div className="text-sm text-muted-foreground">
            Found {csvData.length} rows
          </div>
        </div>

        <div className="space-y-4">
          {csvHeaders.map(header => (
            <div key={header} className="flex items-center space-x-4">
              <div className="w-1/3">
                <Label className="font-medium">{header}</Label>
                <div className="text-sm text-muted-foreground">
                  Sample: {csvData[0]?.[header] || 'N/A'}
                </div>
              </div>
              <div className="w-1/3">
                <Select
                  value={columnMapping[header] || 'skip'}
                  onValueChange={(value) => handleColumnMapping(header, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_FIELDS.map(field => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setUploadStep('upload')}>
            Back
          </Button>
          <Button onClick={() => setUploadStep('preview')}>
            Preview Import
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Preview Import</h3>
        <div className="text-sm text-muted-foreground">
          {csvData.length} leads ready to import
        </div>
      </div>

      <div className="border rounded-lg max-h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.values(columnMapping)
                .filter(field => field !== 'skip')
                .map(field => (
                  <TableHead key={field}>{field}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData.slice(0, 5).map((row, index) => (
              <TableRow key={index}>
                {Object.entries(columnMapping)
                  .filter(([_, field]) => field !== 'skip')
                  .map(([csvColumn, field]) => (
                    <TableCell key={field}>{row[csvColumn] || '-'}</TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {csvData.length > 5 && (
          <div className="p-2 text-center text-sm text-muted-foreground">
            ... and {csvData.length - 5} more rows
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setUploadStep('mapping')}>
          Back to Mapping
        </Button>
        <Button onClick={processImport} disabled={isProcessing}>
          {isProcessing ? 'Importing...' : `Import ${csvData.length} Leads`}
        </Button>
      </div>
    </div>
  );
};
