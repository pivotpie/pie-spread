import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  Database, 
  AlertCircle, 
  CheckCircle,
  FileSpreadsheet,
  Camera,
  Scan
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface DocumentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataImported: (data: any) => void;
}

export const DocumentImportModal: React.FC<DocumentImportModalProps> = ({
  isOpen,
  onClose,
  onDataImported
}) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [selectedTab, setSelectedTab] = useState('upload');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadStatus('uploading');
      
      // Simulate file processing
      setTimeout(() => {
        setUploadStatus('success');
        setTimeout(() => {
          // Import sample data for now
          import('@/data/financialData.json').then((data) => {
            onDataImported(data.default);
            onClose();
            setUploadStatus('idle');
          });
        }, 1000);
      }, 2000);
    }
  };

  const handleSampleDataLoad = async (datasetType: 'manufacturing' | 'fashion' | 'consumables') => {
    try {
      setUploadStatus('uploading');
      
      let data;
      
      if (datasetType === 'manufacturing') {
        data = await import('@/data/financialData.json');
      } else if (datasetType === 'fashion') {
        data = await import('@/data/fashionRetailData.json');
      } else if (datasetType === 'consumables') {
        data = await import('@/data/consumablesRetailData.json');
      }
      
      if (data) {
        onDataImported(data.default);
        onClose();
        toast({
          title: "Data Loaded Successfully",
          description: `${datasetType.charAt(0).toUpperCase() + datasetType.slice(1)} dataset has been loaded.`
        });
      }
      
      setUploadStatus('idle');
    } catch (error) {
      console.error('Error loading sample data:', error);
      setUploadStatus('error');
      toast({
        title: "Error Loading Data",
        description: "Failed to load the selected dataset. Please try again.",
        variant: "destructive"
      });
      
      // Reset status after showing error
      setTimeout(() => {
        setUploadStatus('idle');
      }, 3000);
    }
  };

  const documentTypes = [
    { name: 'Balance Sheet', icon: FileSpreadsheet, description: 'Assets, liabilities, and equity' },
    { name: 'Income Statement', icon: FileText, description: 'Revenue and expenses' },
    { name: 'Cash Flow Statement', icon: Database, description: 'Cash inflows and outflows' },
    { name: 'Bank Statements', icon: FileText, description: 'Transaction history' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Financial Documents
          </DialogTitle>
          <DialogDescription>
            Upload financial documents or use sample data to begin CAD loan assessment
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Document Upload</TabsTrigger>
            <TabsTrigger value="scan">Smart Scan</TabsTrigger>
            <TabsTrigger value="sample">Sample Data</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Financial Documents</CardTitle>
                <CardDescription>
                  Support for PDF, Excel, CSV, and image formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors relative">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Drop files here or click to browse</p>
                    <p className="text-sm text-gray-500">Maximum file size: 10MB per file</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={uploadStatus === 'uploading'}
                  >
                    Choose Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadStatus === 'uploading'}
                  />
                </div>

                {uploadStatus === 'uploading' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700">Processing documents...</span>
                  </div>
                )}

                {uploadStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="text-green-700">Documents processed successfully!</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {documentTypes.map((type) => (
                <Card key={type.name} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <type.icon className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  Smart Document Scanner
                </CardTitle>
                <CardDescription>
                  AI-powered extraction from photos and scanned documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Camera className="h-8 w-8" />
                    Take Photo
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Scan className="h-8 w-8" />
                    Scan Document
                  </Button>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Smart Scan Features</h4>
                      <ul className="text-sm text-amber-700 mt-1 space-y-1">
                        <li>• Automatic table detection and extraction</li>
                        <li>• OCR for handwritten and printed text</li>
                        <li>• Multi-language support</li>
                        <li>• Real-time validation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sample" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Use Sample Data</CardTitle>
                <CardDescription>
                  Load pre-configured financial data to explore the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Manufacturing Company Dataset</h4>
                        <p className="text-sm text-gray-500">3-year financial history with comprehensive statements</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">Balance Sheet</Badge>
                          <Badge variant="secondary">Income Statement</Badge>
                          <Badge variant="secondary">Cash Flow</Badge>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleSampleDataLoad('manufacturing')}
                        disabled={uploadStatus === 'uploading'}
                      >
                        {uploadStatus === 'uploading' ? 'Loading...' : 'Load Data'}
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Fashion Retail Company Dataset</h4>
                        <p className="text-sm text-gray-500">High-growth fashion retailer with strong profitability trends</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">Balance Sheet</Badge>
                          <Badge variant="secondary">Income Statement</Badge>
                          <Badge variant="secondary">Cash Flow</Badge>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleSampleDataLoad('fashion')}
                        disabled={uploadStatus === 'uploading'}
                      >
                        {uploadStatus === 'uploading' ? 'Loading...' : 'Load Data'}
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Consumables Retail Company Dataset</h4>
                        <p className="text-sm text-gray-500">Established retail business with declining profitability challenges</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">Balance Sheet</Badge>
                          <Badge variant="secondary">Income Statement</Badge>
                          <Badge variant="secondary">Cash Flow</Badge>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleSampleDataLoad('consumables')}
                        disabled={uploadStatus === 'uploading'}
                      >
                        {uploadStatus === 'uploading' ? 'Loading...' : 'Load Data'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Sample Data Includes</h4>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Complete financial statements for 2021-2023</li>
                        <li>• Pre-calculated financial ratios</li>
                        <li>• CAD loan eligibility assessment</li>
                        <li>• Trend analysis and projections</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
