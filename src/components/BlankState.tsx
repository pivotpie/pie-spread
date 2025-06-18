
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileSpreadsheet, Building2, ShoppingBag, Package } from 'lucide-react';

interface BlankStateProps {
  onImportClick: () => void;
  onSampleDataLoad: (sampleType?: string) => void;
}

export const BlankState: React.FC<BlankStateProps> = ({ 
  onImportClick, 
  onSampleDataLoad 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-8">
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-12">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-white rounded-3xl shadow-2xl border-4 border-blue-100">
                <img src="/lovable-uploads/88e0819a-d452-409b-88c3-b00337939bff.png" alt="Pie-Spread Logo" className="h-16 w-16" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent mb-4">
              Welcome to Pie-Spread
            </CardTitle>
            <CardDescription className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Advanced Financial Analysis & Risk Assessment Platform for Cash Against Documents (CAD) lending
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-12">
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Get Started</h3>
                <p className="text-slate-600 mb-8">Import your financial documents or try our sample data</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
                  <CardHeader className="text-center p-6">
                    <Upload className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                    <CardTitle className="text-lg font-semibold">Import Documents</CardTitle>
                    <CardDescription>Upload financial statements and documents</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <Button 
                      onClick={onImportClick}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                    >
                      Import Financial Data
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-200 hover:shadow-lg">
                  <CardHeader className="text-center p-6">
                    <FileSpreadsheet className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
                    <CardTitle className="text-lg font-semibold">Sample Data</CardTitle>
                    <CardDescription>Explore with pre-loaded financial datasets</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-3">
                    <Button 
                      variant="outline"
                      onClick={() => onSampleDataLoad('general')}
                      className="w-full flex items-center gap-3 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 py-3 rounded-xl transition-all duration-200"
                    >
                      <Building2 className="h-5 w-5" />
                      General Trading LLC
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => onSampleDataLoad('fashion')}
                      className="w-full flex items-center gap-3 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 py-3 rounded-xl transition-all duration-200"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Fashion Retail Corp
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => onSampleDataLoad('consumables')}
                      className="w-full flex items-center gap-3 border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 py-3 rounded-xl transition-all duration-200"
                    >
                      <Package className="h-5 w-5" />
                      Consumables Retailer
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">What you'll get:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-slate-900">Comprehensive Analysis</div>
                      <div className="text-slate-600">Financial ratios, trends, and risk assessment</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-slate-900">AECB Integration</div>
                      <div className="text-slate-600">Credit bureau data and scoring</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="font-medium text-slate-900">Loan Eligibility</div>
                      <div className="text-slate-600">CAD loan assessment and recommendations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
