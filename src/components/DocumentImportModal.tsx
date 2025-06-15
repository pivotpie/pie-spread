
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FileText, 
  Database, 
  AlertCircle, 
  CheckCircle,
  FileSpreadsheet,
  Camera,
  Scan,
  Loader2,
  Wifi,
  WifiOff,
  Building
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { dataLoaderService } from '@/services/dataLoaderService';
import { DATA_SOURCES, getDataSourcesByCategory } from '@/config/dataSources';

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
  const [selectedDataSource, setSelectedDataSource] = useState<string>('');
  const [processingDetails, setProcessingDetails] = useState<{
    source_name?: string;
    processing_time?: number;
    confidence_score?: number;
  }>({});

  // Get data sources by category
  const sampleDataSources = getDataSourcesByCategory('combined');
  const ocrVisionSources = getDataSourcesByCategory('financial').filter(s => s.type === 'ocr' || s.type === 'vision');
  const apiSources = getDataSourcesByCategory('aecb').concat(getDataSourcesByCategory('financial')).filter(s => s.type === 'api');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadStatus('uploading');
      
      try {
        const sourceId = selectedDataSource || 'document_ocr';
        const result = await dataLoaderService.loadData(sourceId, { files });
        
        setProcessingDetails({
          source_name: result.source_info.name,
          processing_time: result.processing_time,
          confidence_score: result.confidence_score
        });

        if (result.success) {
          setUploadStatus('success');
          setTimeout(() => {
            onDataImported(result.financial_data);
            onClose();
            setUploadStatus('idle');
            toast({
              title: "Documents Processed Successfully",
              description: `Data extracted with ${(result.confidence_score! * 100).toFixed(1)}% confidence`
            });
          }, 1500);
        } else {
          setUploadStatus('error');
          toast({
            title: "Processing Failed",
            description: result.error_message || "Failed to process documents",
            variant: "destructive"
          });
        }
      } catch (error) {
        setUploadStatus('error');
        toast({
          title: "Error",
          description: "An unexpected error occurred during processing",
          variant: "destructive"
        });
      }
    }
  };

  const handleSampleDataLoad = async (sourceId: string) => {
    try {
      setUploadStatus('uploading');
      
      const result = await dataLoaderService.loadData(sourceId);
      
      if (result.success) {
        // Handle combined data (both financial and AECB)
        if (result.financial_data) {
          onDataImported(result.financial_data);
        }
        
        onClose();
        toast({
          title: "Data Loaded Successfully",
          description: `${result.source_info.name} has been loaded.`
        });
      } else {
        throw new Error(result.error_message || 'Failed to load data');
      }
      
      setUploadStatus('idle');
    } catch (error) {
      console.error('Error loading sample data:', error);
      setUploadStatus('error');
      toast({
        title: "Error Loading Data",
        description: error instanceof Error ? error.message : "Failed to load the selected dataset",
        variant: "destructive"
      });
      
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Document Upload</TabsTrigger>
            <TabsTrigger value="scan">Smart Scan</TabsTrigger>
            <TabsTrigger value="api">Live Data</TabsTrigger>
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
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select processing method" />
                    </SelectTrigger>
                    <SelectContent>
                      {ocrVisionSources.map(source => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedDataSource && (
                    <Badge variant="outline" className="px-3 py-1">
                      {DATA_SOURCES[selectedDataSource]?.processing_time}
                    </Badge>
                  )}
                </div>

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
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <div>
                      <span className="text-blue-700 font-medium">Processing documents...</span>
                      {processingDetails.source_name && (
                        <p className="text-sm text-blue-600">Using {processingDetails.source_name}</p>
                      )}
                    </div>
                  </div>
                )}

                {uploadStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <span className="text-green-700 font-medium">Documents processed successfully!</span>
                      {processingDetails.confidence_score && (
                        <p className="text-sm text-green-600">
                          Confidence: {(processingDetails.confidence_score * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                )}

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
              </CardContent>
            </Card>
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
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2"
                    onClick={() => {
                      setSelectedDataSource('smart_vision');
                      document.getElementById('file-upload')?.click();
                    }}
                  >
                    <Camera className="h-8 w-8" />
                    Take Photo
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col gap-2"
                    onClick={() => {
                      setSelectedDataSource('document_ocr');
                      document.getElementById('file-upload')?.click();
                    }}
                  >
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

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Live Data Sources
                </CardTitle>
                <CardDescription>
                  Connect to live banking and credit bureau APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {apiSources.map(source => (
                    <div key={source.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {source.category === 'aecb' ? <Building className="h-6 w-6 text-blue-600" /> : <Database className="h-6 w-6 text-blue-600" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{source.name}</h4>
                            <p className="text-sm text-gray-500">{source.description}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="secondary">{source.category.toUpperCase()}</Badge>
                              <Badge variant="outline">{source.processing_time}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <WifiOff className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Not Connected</span>
                          </div>
                          <Button variant="outline" size="sm">
                            Connect
                          </Button>
                        </div>
                      </div>
                      
                      {source.requirements && (
                        <div className="mt-3 pt-3 border-t">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Requirements:</h5>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {source.requirements.map((req, index) => (
                              <li key={index}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Live Data Benefits</h4>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Real-time financial data updates</li>
                        <li>• Automated AECB credit reports</li>
                        <li>• Enhanced accuracy and validation</li>
                        <li>• Streamlined loan processing</li>
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
                  {sampleDataSources.map(source => (
                    <div key={source.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{source.name}</h4>
                          <p className="text-sm text-gray-500">{source.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">Balance Sheet</Badge>
                            <Badge variant="secondary">Income Statement</Badge>
                            <Badge variant="secondary">Cash Flow</Badge>
                            <Badge variant="secondary">AECB Data</Badge>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleSampleDataLoad(source.id)}
                          disabled={uploadStatus === 'uploading'}
                        >
                          {uploadStatus === 'uploading' ? 'Loading...' : 'Load Data'}
                        </Button>
                      </div>
                    </div>
                  ))}
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
                        <li>• AECB credit bureau data</li>
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
