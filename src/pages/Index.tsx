
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  FileSpreadsheet,
  CreditCard,
  Upload
} from 'lucide-react';
import { FinancialTable } from '@/components/FinancialTable';
import { RatioAnalysis } from '@/components/RatioAnalysis';
import { TrendChart } from '@/components/TrendChart';
import { LoanEligibilityScore } from '@/components/LoanEligibilityScore';
import { BlankState } from '@/components/BlankState';
import { DocumentImportModal } from '@/components/DocumentImportModal';
import { FinancialCharts } from '@/components/FinancialCharts';
import { calculateRobustRatios } from '@/utils/ratioCalculations';

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

const Index = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [data, setData] = useState<FinancialData | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const years = useMemo(() => {
    if (!data) return [];
    const allYears = new Set<number>();
    Object.values(data).forEach(items => 
      items.forEach(item => allYears.add(item.year))
    );
    return Array.from(allYears).sort();
  }, [data]);

  const handleDataImported = (importedData: FinancialData) => {
    setData(importedData);
    if (importedData) {
      // Set the most recent year as default
      const allYears = new Set<number>();
      Object.values(importedData).forEach(items => 
        items.forEach(item => allYears.add(item.year))
      );
      const sortedYears = Array.from(allYears).sort();
      if (sortedYears.length > 0) {
        setSelectedYear(sortedYears[sortedYears.length - 1]);
      }
    }
  };

  const handleSampleDataLoad = () => {
    import('@/data/financialData.json').then((data) => {
      handleDataImported(data.default);
    });
  };

  const getValueByFieldAndYear = (statement: keyof FinancialData, fieldName: string, year: number) => {
    if (!data) return 0;
    const item = data[statement].find(item => 
      item.field_name === fieldName && item.year === year
    );
    return item?.value || 0;
  };

  const formatCurrency = (value: number) => {
    return `AED ${(value / 1000000).toFixed(2)}M`;
  };

  const calculateRatios = (year: number) => {
    if (!data) {
      return {
        currentRatio: { value: 0, isReliable: false },
        quickRatio: { value: 0, isReliable: false },
        debtToEquity: { value: 0, isReliable: false },
        grossProfitMargin: { value: 0, isReliable: false },
        netProfitMargin: { value: 0, isReliable: false },
        operatingMargin: { value: 0, isReliable: false },
        ebitdaMargin: { value: 0, isReliable: false },
        returnOnAssets: { value: 0, isReliable: false },
        returnOnEquity: { value: 0, isReliable: false },
        assetTurnover: { value: 0, isReliable: false },
        inventoryTurnover: { value: 0, isReliable: false },
        interestCoverage: { value: 0, isReliable: false },
        debtRatio: { value: 0, isReliable: false },
        cashRatio: { value: 0, isReliable: false },
        capitalAdequacy: { value: 0, isReliable: false },
        dataQuality: { isValid: false, issues: [], corrections: {} }
      };
    }

    return calculateRobustRatios(data, year);
  };

  const currentRatios = calculateRatios(selectedYear);

  // Show blank state if no data is loaded
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-none px-8 py-6">
          <BlankState 
            onImportClick={() => setIsImportModalOpen(true)} 
            onSampleDataLoad={handleSampleDataLoad}
          />
          <DocumentImportModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onDataImported={handleDataImported}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-none px-8 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="p-4 bg-white rounded-2xl shadow-2xl border-4 border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-3xl">
                <img src="/lovable-uploads/88e0819a-d452-409b-88c3-b00337939bff.png" alt="Pie-Spread Logo" className="h-10 w-10" />
              </div>
              Pie-Spread
            </h1>
            <p className="text-slate-600 mt-3 text-lg">Cash Against Documents - Financial Analysis & Risk Assessment</p>
          </div>
          <div className="flex items-center gap-6">
            <Button 
              variant="outline" 
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-3 px-6 py-3 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 rounded-xl shadow-sm"
            >
              <Upload className="h-5 w-5" />
              Import New Data
            </Button>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-6 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white/80 backdrop-blur-sm text-lg font-medium"
            >
              {years.map(year => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
            <Badge variant="outline" className="px-4 py-2 border-2 border-emerald-200 bg-emerald-50 text-emerald-700 rounded-xl shadow-sm">
              <CreditCard className="h-5 w-5 mr-2" />
              CAD Assessment
            </Badge>
          </div>
        </div>

        {/* Loan Eligibility Score */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <LoanEligibilityScore ratios={currentRatios} year={selectedYear} />
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardTitle className="text-sm font-semibold">Total Assets</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-slate-900">
                {formatCurrency(getValueByFieldAndYear("Balance Sheet", "Total Assets", selectedYear))}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Company's total asset base
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <CardTitle className="text-sm font-semibold">Net Profit</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-slate-900">
                {formatCurrency(getValueByFieldAndYear("Income Statement", "Net Profit", selectedYear))}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Annual profitability
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardTitle className="text-sm font-semibold">Current Ratio</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <Calculator className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-slate-900">
                {currentRatios.currentRatio.isReliable ? currentRatios.currentRatio.value.toFixed(2) : 'N/A'}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Liquidity measure
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardTitle className="text-sm font-semibold">Debt-to-Equity</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-slate-900">
                {currentRatios.debtToEquity.isReliable ? currentRatios.debtToEquity.value.toFixed(2) : 'N/A'}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Leverage indicator
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Charts Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
          <FinancialCharts data={data} selectedYear={selectedYear} years={years} />
        </div>

        {/* Main Dashboard Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <Tabs defaultValue="ratios" className="w-full">
            <div className="border-b border-slate-200 bg-slate-50/50 px-8 py-6">
              <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl p-2 shadow-sm">
                <TabsTrigger value="ratios" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200 font-semibold">Ratio Analysis</TabsTrigger>
                <TabsTrigger value="statements" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200 font-semibold">Financial Statements</TabsTrigger>
                <TabsTrigger value="trends" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200 font-semibold">Trend Analysis</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8">
              <TabsContent value="ratios">
                <RatioAnalysis ratios={currentRatios} year={selectedYear} />
              </TabsContent>

              <TabsContent value="statements" className="space-y-8">
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
              </TabsContent>

              <TabsContent value="trends">
                <TrendChart data={data} years={years} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DocumentImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onDataImported={handleDataImported}
        />
      </div>
    </div>
  );
};

export default Index;
