import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard,
  Upload,
  Building
} from 'lucide-react';
import { BlankState } from '@/components/BlankState';
import { DocumentImportModal } from '@/components/DocumentImportModal';
import { StickyNavTabs } from '@/components/StickyNavTabs';
import { LoanEligibilityTab } from '@/components/tabs/LoanEligibilityTab';
import { FinancialDashboardTab } from '@/components/tabs/FinancialDashboardTab';
import { RatioAnalysisTab } from '@/components/tabs/RatioAnalysisTab';
import { FinancialDocumentsTab } from '@/components/tabs/FinancialDocumentsTab';
import { TrendAnalysisTab } from '@/components/tabs/TrendAnalysisTab';
import { AECBScoreTab } from '@/components/tabs/AECBScoreTab';
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
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100); // Trigger when scrolled past 100px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const renderActiveTab = () => {
    switch (activeNavTab) {
      case 'loan-eligibility':
        return <LoanEligibilityTab ratios={enhancedRatios} year={selectedYear} />;
      case 'financial-dashboard':
        return <FinancialDashboardTab data={data} selectedYear={selectedYear} years={years} currentRatios={currentRatios} />;
      case 'ratio-analysis':
        return <RatioAnalysisTab ratios={enhancedRatios} year={selectedYear} />;
      case 'financial-documents':
        return <FinancialDocumentsTab data={data} selectedYear={selectedYear} />;
      case 'trend-analysis':
        return <TrendAnalysisTab data={data} years={years} />;
      case 'aecb-score':
        return <AECBScoreTab data={aecbData} />;
      default:
        return <LoanEligibilityTab ratios={enhancedRatios} year={selectedYear} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-none px-8 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <div 
                id="header-logo"
                className={`p-4 bg-white rounded-2xl shadow-2xl border-4 border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-3xl ${
                  isScrolled ? 'opacity-0 transform scale-75' : 'opacity-100 transform scale-100'
                }`}
                style={{ transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out' }}
              >
                <img src="/lovable-uploads/88e0819a-d452-409b-88c3-b00337939bff.png" alt="Pie-Spread Logo" className="h-10 w-10" />
              </div>
              <span 
                id="header-title"
                className={`bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent transition-all duration-300 ${
                  isScrolled ? 'opacity-0 transform translate-x-[-20px]' : 'opacity-100 transform translate-x-0'
                }`}
              >
                Pie-Spread
              </span>
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
          isScrolled={isScrolled}
        />

        {/* Active Tab Content */}
        {renderActiveTab()}

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
