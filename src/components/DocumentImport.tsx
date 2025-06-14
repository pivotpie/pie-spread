
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Download,
  Trash2
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'financial_statement' | 'trade_document' | 'bank_statement' | 'commercial_invoice' | 'bill_of_lading' | 'insurance_document' | 'other';
  status: 'pending' | 'verified' | 'rejected';
  uploadDate: Date;
  size: number;
  confidenceScore?: number;
  extractedData?: any;
}

interface DocumentImportProps {
  onDocumentProcessed: (data: any) => void;
}

export const DocumentImport: React.FC<DocumentImportProps> = ({ onDocumentProcessed }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const requiredDocuments = [
    { type: 'financial_statement', name: 'Audited Financial Statements (3 years)', required: true },
    { type: 'bank_statement', name: 'Bank Statements (12 months)', required: true },
    { type: 'trade_document', name: 'Trade License & Commercial Registration', required: true },
    { type: 'commercial_invoice', name: 'Sample Commercial Invoices', required: true },
    { type: 'bill_of_lading', name: 'Bills of Lading / Shipping Documents', required: false },
    { type: 'insurance_document', name: 'Insurance Documents', required: false }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    setProcessingProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Simulate document processing
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
    
    // Extract financial data and notify parent component
    const financialData = extractFinancialData(documents);
    onDocumentProcessed(financialData);
  };

  const detectDocumentType = (filename: string): Document['type'] => {
    const name = filename.toLowerCase();
    if (name.includes('financial') || name.includes('statement') || name.includes('audit')) return 'financial_statement';
    if (name.includes('bank') || name.includes('account')) return 'bank_statement';
    if (name.includes('trade') || name.includes('license')) return 'trade_document';
    if (name.includes('invoice') || name.includes('bill')) return 'commercial_invoice';
    if (name.includes('lading') || name.includes('shipping')) return 'bill_of_lading';
    if (name.includes('insurance')) return 'insurance_document';
    return 'other';
  };

  const processDocument = async (document: Document): Promise<Document> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const confidenceScore = Math.random() * 40 + 60; // 60-100%
    const status = confidenceScore > 80 ? 'verified' : confidenceScore > 60 ? 'pending' : 'rejected';
    
    return {
      ...document,
      status,
      confidenceScore,
      extractedData: generateMockExtractedData(document.type)
    };
  };

  const generateMockExtractedData = (type: Document['type']) => {
    switch (type) {
      case 'financial_statement':
        return {
          totalAssets: Math.random() * 50000000 + 10000000,
          totalRevenue: Math.random() * 30000000 + 5000000,
          netProfit: Math.random() * 3000000 + 500000,
          year: 2023
        };
      case 'bank_statement':
        return {
          averageBalance: Math.random() * 5000000 + 1000000,
          monthlyTurnover: Math.random() * 8000000 + 2000000,
          overdraftLimit: Math.random() * 2000000
        };
      default:
        return {};
    }
  };

  const extractFinancialData = (documents: Document[]) => {
    const financialDocs = documents.filter(doc => 
      doc.type === 'financial_statement' && doc.status === 'verified'
    );
    
    if (financialDocs.length === 0) return null;
    
    // Aggregate extracted data
    return financialDocs.reduce((acc, doc) => {
      if (doc.extractedData) {
        return { ...acc, ...doc.extractedData };
      }
      return acc;
    }, {});
  };

  const getDocumentIcon = (type: Document['type']) => {
    return <FileText className="h-4 w-4" />;
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
    return (uploadedRequired / requiredCount) * 100;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Import & Verification
          </CardTitle>
          <CardDescription>
            Upload and verify required documents for CAD loan assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {/* Document Requirements Checklist */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Document Requirements</h3>
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
                      {getDocumentIcon(req.type)}
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
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(doc.type)}
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
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {documents.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Document verification uses AI-powered analysis. Please review extracted data for accuracy 
                before proceeding with the loan assessment.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
