
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
  Upload,
  Building
} from 'lucide-react';
import { FinancialTable } from '@/components/FinancialTable';
import { RatioAnalysis } from '@/components/RatioAnalysis';
import { TrendChart } from '@/components/TrendChart';
import { LoanEligibilityScore } from '@/components/LoanEligibilityScore';
import { BlankState } from '@/components/BlankState';
import { DocumentImportModal } from '@/components/DocumentImportModal';
import { FinancialCharts } from '@/components/FinancialCharts';
import { AECBAnalysis } from '@/components/AECBAnalysis';
import { StickyNavTabs } from '@/components/StickyNavTabs';
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
  const [aecbData, setAecbData] = useState<any>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<string>('loan-eligibility');
  
  const years = useMemo(() => {
    if (!data) return [];
    const allYears = new Set<number>();
    Object.values(data).forEach(items => 
      items.forEach(item => allYears.add(item.year))
    );
    return Array.from(allYears).sort();
  }, [data]);

  const detectDataSource = (financialData: FinancialData): 'manufacturing' | 'fashion' | 'consumables' => {
    // Check for specific field patterns or values that indicate the dataset type
    const balanceSheet = financialData["Balance Sheet"];
    const incomeStatement = financialData["Income Statement"];
    
    // Look for specific indicators in the data
    const totalRevenue = incomeStatement.find(item => 
      item.field_name.toLowerCase().includes('revenue') || 
      item.field_name.toLowerCase().includes('sales')
    );
    
    const inventory = balanceSheet.find(item => 
      item.field_name.toLowerCase().includes('inventory')
    );
    
    // Fashion retail typically has higher inventory turnover and specific revenue patterns
    if (totalRevenue && totalRevenue.value > 15000000 && inventory && inventory.value > 2000000) {
      return 'fashion';
    }
    
    // Consumables retail typically has lower margins and specific cost structures
    if (totalRevenue && totalRevenue.value < 12000000 && inventory && inventory.value < 1500000) {
      return 'consumables';
    }
    
    // Default to manufacturing for other cases
    return 'manufacturing';
  };


  const handleDataImported = (importedData: FinancialData, datasetType?: 'manufacturing' | 'fashion' | 'consumables') => {
    setData(importedData);
    
    // Auto-load corresponding AECB data based on company type
    if (importedData) {
      // Use provided dataset type or detect it from the data
      const detectedType = datasetType || detectDataSource(importedData);
      loadAECBData(detectedType);
      
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


  const loadAECBData = async (datasetType: 'manufacturing' | 'fashion' | 'consumables') => {
    try {
      let aecbDataModule;
      
      // Map dataset types to AECB data files
      if (datasetType === 'fashion') {
        aecbDataModule = await import('@/data/fashionRetailAECB.json');
      } else if (datasetType === 'consumables') {
        aecbDataModule = await import('@/data/consumablesRetailAECB.json');
      } else {
        aecbDataModule = await import('@/data/financialDataAECB.json');
      }
      
      setAecbData(aecbDataModule.default);
      console.log(`Loaded AECB data for: ${datasetType}`); // Add this for debugging
    } catch (error) {
      console.error('Failed to load AECB data:', error);
    }
  };


  const handleSampleDataLoad = () => {
    import('@/data/financialData.json').then((data) => {
      handleDataImported(data.default, 'manufacturing'); // Pass the dataset type explicitly
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

  // Enhanced scoring that includes AECB data
  const enhancedRatios = useMemo(() => {
    if (!aecbData) return currentRatios;
    
    // Add AECB-based enhancements to the ratios
    return {
      ...currentRatios,
      aecbScore: aecbData.credit_profile.aecb_score,
      riskGrade: aecbData.credit_profile.risk_grade,
      paymentPerformance: aecbData.payment_history.payment_performance.on_time_payments,
      creditUtilization: aecbData.credit_utilization.utilization_ratio,
      negativeFactors: {
        bouncedChecks: aecbData.negative_information.bounced_checks,
        legalCases: aecbData.negative_information.legal_cases,
        restructuring: aecbData.negative_information.restructuring_history
      }
    };
  }, [currentRatios, aecbData]);

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
            {aecbData && (
              <Badge variant="outline" className="px-4 py-2 border-2 border-purple-200 bg-purple-50 text-purple-700 rounded-xl shadow-sm">
                <Building className="h-5 w-5 mr-2" />
                AECB Connected
              </Badge>
            )}
          </div>
        </div>

        {/* Sticky Navigation Tabs */}
        <StickyNavTabs 
          activeTab={activeNavTab} 
          onTabChange={setActiveNavTab} 
        />

        {/* Loan Eligibility Score */}
        <div id="loan-eligibility" className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <LoanEligibilityScore ratios={enhancedRatios} year={selectedYear} />
        </div>

        {/* Financial Charts Section */}
        <div id="financial-dashboard" className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
          <FinancialCharts data={data} selectedYear={selectedYear} years={years} currentRatios={currentRatios} />
        </div>

        {/* Main Dashboard Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <Tabs defaultValue="ratios" className="w-full">
            <div className="border-b border-slate-200 bg-slate-50/50 px-8 py-6">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl p-2 shadow-sm">
                <TabsTrigger value="ratios" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200 font-semibold">Ratio Analysis</TabsTrigger>
                <TabsTrigger value="statements" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200 font-semibold">Financial Statements</TabsTrigger>
                <TabsTrigger value="trends" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200 font-semibold">Trend Analysis</TabsTrigger>
                <TabsTrigger value="credit-bureau" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200 font-semibold">Credit Bureau</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8">
              <TabsContent value="ratios" id="ratio-analysis">
                <RatioAnalysis ratios={enhancedRatios} year={selectedYear} />
              </TabsContent>

              <TabsContent value="statements" className="space-y-8" id="financial-documents">
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

              <TabsContent value="trends" id="trend-analysis">
                <TrendChart data={data} years={years} />
              </TabsContent>

              <TabsContent value="credit-bureau" id="aecb-score">
                <AECBAnalysis data={aecbData} />
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
