
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  Trash2
} from 'lucide-react';

interface FinancialData {
  totalAssets: number;
  currentAssets: number;
  currentLiabilities: number;
  totalLiabilities: number;
  shareholderEquity: number;
  totalRevenue: number;
  netProfit: number;
  ebitda: number;
  interestExpense: number;
  operatingCashFlow: number;
  inventory: number;
  accountsReceivable: number;
  accountsPayable: number;
  shortTermDebt: number;
  longTermDebt: number;
  workingCapital: number;
}

interface Document {
  id: string;
  name: string;
  type: 'financial_statement' | 'trade_document' | 'bank_statement' | 'commercial_invoice' | 'bill_of_lading' | 'insurance_document' | 'other';
  status: 'pending' | 'verified' | 'rejected';
  uploadDate: Date;
  size: number;
  confidenceScore?: number;
}

interface DocumentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (data: FinancialData) => void;
}

export const DocumentImportModal: React.FC<DocumentImportModalProps> = ({ 
  isOpen, 
  onClose, 
  onDataLoaded 
}) => {
  const [useSampleData, setUseSampleData] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const requiredDocuments = [
    { type: 'financial_statement' as const, name: 'Audited Financial Statements', required: true },
    { type: 'bank_statement' as const, name: 'Bank Statements (12 months)', required: true },
    { type: 'trade_document' as const, name: 'Trade License', required: true },
    { type: 'commercial_invoice' as const, name: 'Commercial Invoices', required: true },
    { type: 'bill_of_lading' as const, name: 'Shipping Documents', required: false },
    { type: 'insurance_document' as const, name: 'Insurance Documents', required: false }
  ];

  const sampleFinancialData: FinancialData = {
    totalAssets: 45000000,
    currentAssets: 28000000,
    currentLiabilities: 18000000,
    totalLiabilities: 25000000,
    shareholderEquity: 20000000,
    totalRevenue: 85000000,
    netProfit: 8500000,
    ebitda: 12000000,
    interestExpense: 1200000,
    operatingCashFlow: 9500000,
    inventory: 8400000,
    accountsReceivable: 11200000,
    accountsPayable: 10800000,
    shortTermDebt: 7000000,
    longTermDebt: 18000000,
    workingCapital: 10000000
  };

  const handleLoadSampleData = () => {
    onDataLoaded(sampleFinancialData);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    setProcessingProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      const newDocument: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: detectDocumentType(file.name),
        status: 'pending',
        uploadDate: new Date(),
        size: file.size
      };

      setDocuments(prev => [...prev, newDocument]);

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate document verification
      const processedDocument = await processDocument(newDocument);
      
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === newDocument.id ? processedDocument : doc
        )
      );

      setProcessingProgress(((i + 1) / files.length) * 100);
    }

    setUploading(false);
  };

  const detectDocumentType = (filename: string): Document['type'] => {
    const name = filename.toLowerCase();
    if (name.includes('financial') || name.includes('statement')) return 'financial_statement';
    if (name.includes('bank')) return 'bank_statement';
    if (name.includes('trade') || name.includes('license')) return 'trade_document';
    if (name.includes('invoice')) return 'commercial_invoice';
    if (name.includes('lading') || name.includes('shipping')) return 'bill_of_lading';
    if (name.includes('insurance')) return 'insurance_document';
    return 'other';
  };

  const processDocument = async (document: Document): Promise<Document> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const confidenceScore = Math.random() * 40 + 60; // 60-100%
    const status = confidenceScore > 80 ? 'verified' : 'pending';
    
    return {
      ...document,
      status,
      confidenceScore
    };
  };

  const handleProcessDocuments = () => {
    // Extract financial data from verified documents
    const verifiedDocs = documents.filter(doc => doc.status === 'verified');
    
    if (verifiedDocs.length > 0) {
      // In a real application, you would extract actual data from documents
      // For now, we'll use sample data with some variation
      const extractedData: FinancialData = {
        ...sampleFinancialData,
        totalAssets: sampleFinancialData.totalAssets * (0.8 + Math.random() * 0.4),
        netProfit: sampleFinancialData.netProfit * (0.7 + Math.random() * 0.6)
      };
      
      onDataLoaded(extractedData);
    }
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const completionPercentage = () => {
    const requiredCount = requiredDocuments.filter(doc => doc.required).length;
    const uploadedRequired = requiredDocuments.filter(req => 
      documents.some(doc => doc.type === req.type && doc.status === 'verified')
    ).length;
    return requiredCount > 0 ? (uploadedRequired / requiredCount) * 100 : 0;
  };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Import & Data Loading
          </DialogTitle>
          <DialogDescription>
            Upload documents for analysis or use sample data for demonstration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Data Source Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="sample-data" 
                  checked={useSampleData}
                  onCheckedChange={setUseSampleData}
                />
                <Label htmlFor="sample-data">Use Sample Data</Label>
              </div>
              
              {useSampleData ? (
                <div className="space-y-4">
                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertDescription>
                      Sample financial data will be loaded for demonstration purposes. 
                      This includes realistic financial statements for a UAE trading company.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={handleLoadSampleData} className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Load Sample Data
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Upload Documents</p>
                      <p className="text-sm text-gray-600">
                        Drag and drop files here or click to browse
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button asChild className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Choose Files
                        </label>
                      </Button>
                    </div>
                  </div>

                  {/* Processing Progress */}
                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Processing documents...</span>
                        <span>{Math.round(processingProgress)}%</span>
                      </div>
                      <Progress value={processingProgress} className="h-2" />
                    </div>
                  )}

                  {/* Document Requirements */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Required Documents</h3>
                      <div className="flex items-center gap-2">
                        <Progress value={completionPercentage()} className="w-24 h-2" />
                        <span className="text-sm font-medium">{Math.round(completionPercentage())}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {requiredDocuments.map((req, index) => {
                        const uploaded = documents.find(doc => doc.type === req.type && doc.status === 'verified');
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4" />
                              <div>
                                <div className="font-medium text-sm">{req.name}</div>
                                <div className="text-xs text-gray-600">
                                  {req.required ? 'Required' : 'Optional'}
                                </div>
                              </div>
                            </div>
                            {uploaded ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-300" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Uploaded Documents List */}
                  {documents.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Uploaded Documents</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4" />
                              <div>
                                <div className="font-medium text-sm">{doc.name}</div>
                                <div className="text-xs text-gray-600">
                                  {(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.uploadDate.toLocaleDateString()}
                                </div>
                                {doc.confidenceScore && (
                                  <div className="text-xs text-gray-600">
                                    Confidence: {doc.confidenceScore.toFixed(1)}%
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(doc.status)}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeDocument(doc.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {documents.some(doc => doc.status === 'verified') && (
                        <Button onClick={handleProcessDocuments} className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Process Verified Documents
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
