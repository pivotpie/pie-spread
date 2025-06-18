
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialTable } from '@/components/FinancialTable';

interface FinancialItem {
  field_name: string;
  value: number;
  currency: string;
  year: number;
  confidence_score: number;
}

interface FinancialData {
  "Balance Sheet": FinancialItem[];
  "Income Statement": FinancialItem[];
  "Cash Flow Statement": FinancialItem[];
}

interface FinancialDocumentsTabProps {
  data: FinancialData;
  selectedYear: number;
}

export const FinancialDocumentsTab: React.FC<FinancialDocumentsTabProps> = ({ data, selectedYear }) => {
  return (
    <div id="financial-documents" className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Financial Documents</h2>
          <p className="text-gray-600">Detailed financial statements and supporting documents</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-200">
              <CardTitle className="text-xl font-bold text-slate-900">Balance Sheet</CardTitle>
              <CardDescription className="text-slate-600">Financial position as of {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <FinancialTable 
                data={data["Balance Sheet"].filter(item => item.year === selectedYear)} 
                title="Balance Sheet"
              />
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-200">
              <CardTitle className="text-xl font-bold text-slate-900">Income Statement</CardTitle>
              <CardDescription className="text-slate-600">Performance for year {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <FinancialTable 
                data={data["Income Statement"].filter(item => item.year === selectedYear)} 
                title="Income Statement"
              />
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-200">
              <CardTitle className="text-xl font-bold text-slate-900">Cash Flow Statement</CardTitle>
              <CardDescription className="text-slate-600">Cash movements in {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <FinancialTable 
                data={data["Cash Flow Statement"].filter(item => item.year === selectedYear)} 
                title="Cash Flow Statement"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
