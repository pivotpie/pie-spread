
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
  Shield
} from 'lucide-react';
import financialData from '@/data/financialData.json';
import { FinancialTable } from '@/components/FinancialTable';
import { RatioAnalysis } from '@/components/RatioAnalysis';
import { TrendChart } from '@/components/TrendChart';
import { LoanEligibilityScore } from '@/components/LoanEligibilityScore';
import { CADLoanAssessment } from '@/components/CADLoanAssessment';
import { DocumentImport } from '@/components/DocumentImport';
import { calculateCADRatios, getCADLoanRecommendation } from '@/utils/cadRatioCalculations';

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
  const [cadLoanData, setCADLoanData] = useState({
    requestedAmount: 25000000, // AED 25M
    loanTenor: 6, // 6 months
    interestRate: 5.5,
    collateralValue: 30000000, // AED 30M
    documentsCoverage: 85,
    tradingHistory: 7,
    averageMonthlyTurnover: 8000000,
    currentOutstandings: 15000000
  });
  
  const data = financialData as FinancialData;
  
  const years = useMemo(() => {
    const allYears = new Set<number>();
    Object.values(data).forEach(items => 
      items.forEach(item => allYears.add(item.year))
    );
    return Array.from(allYears).sort();
  }, [data]);

  const getValueByFieldAndYear = (statement: keyof FinancialData, fieldName: string, year: number) => {
    const item = data[statement].find(item => 
      item.field_name === fieldName && item.year === year
    );
    return item?.value || 0;
  };

  const formatCurrency = (value: number) => {
    return `AED ${(value / 1000000).toFixed(2)}M`;
  };

  // Enhanced ratio calculations using CAD-specific formulas
  const calculateEnhancedRatios = (year: number) => {
    const totalAssets = getValueByFieldAndYear("Balance Sheet", "Total Assets", year);
    const currentAssets = getValueByFieldAndYear("Balance Sheet", "Current Assets", year);
    const currentLiabilities = getValueByFieldAndYear("Balance Sheet", "Current Liabilities", year);
    const totalLiabilities = getValueByFieldAndYear("Balance Sheet", "Total Liabilities", year);
    const shareholderEquity = getValueByFieldAndYear("Balance Sheet", "Shareholder's Equity", year);
    const totalRevenue = getValueByFieldAndYear("Income Statement", "Total Revenue", year);
    const netProfit = getValueByFieldAndYear("Income Statement", "Net Profit", year);
    const ebitda = getValueByFieldAndYear("Income Statement", "EBITDA", year);
    const interestExpense = getValueByFieldAndYear("Income Statement", "Interest Expense", year);
    const operatingCashFlow = getValueByFieldAndYear("Cash Flow Statement", "Net Cash from Operating Activities", year);
    const longTermDebt = getValueByFieldAndYear("Balance Sheet", "Long-Term Debt", year);
    const shortTermDebt = getValueByFieldAndYear("Balance Sheet", "Short-Term Debt", year);

    const financialData = {
      totalAssets,
      currentAssets,
      currentLiabilities,
      totalLiabilities,
      shareholderEquity,
      totalRevenue,
      netProfit,
      ebitda,
      interestExpense,
      operatingCashFlow,
      inventory: currentAssets * 0.3, // Assumption
      accountsReceivable: currentAssets * 0.4, // Assumption
      accountsPayable: currentLiabilities * 0.6, // Assumption
      shortTermDebt,
      longTermDebt,
      workingCapital: currentAssets - currentLiabilities
    };

    const tradeData = {
      averageDailySales: totalRevenue / 365,
      averageCollectionPeriod: 45, // days
      averagePaymentPeriod: 30, // days
      documentValue: cadLoanData.requestedAmount * 1.2,
      collateralValue: cadLoanData.collateralValue
    };

    return calculateCADRatios(financialData, undefined, tradeData);
  };

  const currentRatios = calculateEnhancedRatios(selectedYear);
  const loanRecommendation = getCADLoanRecommendation(currentRatios);

  // Legacy ratios for backward compatibility
  const calculateLegacyRatios = (year: number) => {
    const totalAssets = getValueByFieldAndYear("Balance Sheet", "Total Assets", year);
    const currentAssets = getValueByFieldAndYear("Balance Sheet", "Current Assets", year);
    const currentLiabilities = getValueByFieldAndYear("Balance Sheet", "Current Liabilities", year);
    const totalLiabilities = getValueByFieldAndYear("Balance Sheet", "Total Liabilities", year);
    const shareholderEquity = getValueByFieldAndYear("Balance Sheet", "Shareholder's Equity", year);
    const totalRevenue = getValueByFieldAndYear("Income Statement", "Total Revenue", year);
    const netProfit = getValueByFieldAndYear("Income Statement", "Net Profit", year);
    const ebitda = getValueByFieldAndYear("Income Statement", "EBITDA", year);
    const interestExpense = getValueByFieldAndYear("Income Statement", "Interest Expense", year);
    const longTermDebt = getValueByFieldAndYear("Balance Sheet", "Long-Term Debt", year);
    const shortTermDebt = getValueByFieldAndYear("Balance Sheet", "Short-Term Debt", year);
    const totalDebt = longTermDebt + shortTermDebt;

    return {
      currentRatio: currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0,
      debtToEquity: shareholderEquity !== 0 ? totalLiabilities / shareholderEquity : 0,
      returnOnAssets: totalAssets !== 0 ? (netProfit / totalAssets) * 100 : 0,
      returnOnEquity: shareholderEquity !== 0 ? (netProfit / shareholderEquity) * 100 : 0,
      profitMargin: totalRevenue !== 0 ? (netProfit / totalRevenue) * 100 : 0,
      debtServiceCoverage: interestExpense !== 0 ? ebitda / interestExpense : 0,
      debtToAssets: totalAssets !== 0 ? (totalDebt / totalAssets) * 100 : 0,
      equityRatio: totalAssets !== 0 ? (shareholderEquity / totalAssets) * 100 : 0
    };
  };

  const legacyRatios = calculateLegacyRatios(selectedYear);

  const handleDocumentProcessed = (extractedData: any) => {
    console.log('Document processed:', extractedData);
    // Here you would integrate the extracted financial data
    // with the existing financial data for more accurate calculations
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              CAD Loan Assessment Platform
            </h1>
            <p className="text-gray-600 mt-2">Cash Against Documents - Comprehensive Credit Analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {years.map(year => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
            <Badge variant={loanRecommendation.recommendation === 'approve' ? 'default' : 
                            loanRecommendation.recommendation === 'conditional' ? 'secondary' : 'destructive'} 
                   className="px-3 py-1">
              <Shield className="h-4 w-4 mr-1" />
              {loanRecommendation.recommendation.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Loan Recommendation Alert */}
        <Alert className={loanRecommendation.recommendation === 'approve' ? 'border-green-200 bg-green-50' :
                         loanRecommendation.recommendation === 'conditional' ? 'border-yellow-200 bg-yellow-50' :
                         'border-red-200 bg-red-50'}>
          <Shield className="h-4 w-4" />
          <AlertDescription className="font-medium">
            <strong>Credit Recommendation:</strong> {loanRecommendation.recommendation.toUpperCase()} - 
            {loanRecommendation.reasons.slice(0, 2).join(', ')}
            {loanRecommendation.suggestedTerms && (
              <span className="block mt-2">
                Max Amount: {formatCurrency(loanRecommendation.suggestedTerms.maxAmount)} | 
                Rate: {loanRecommendation.suggestedTerms.interestRate}% | 
                Tenor: {loanRecommendation.suggestedTerms.tenor} months
              </span>
            )}
          </AlertDescription>
        </Alert>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(getValueByFieldAndYear("Balance Sheet", "Total Assets", selectedYear))}
              </div>
              <p className="text-xs text-muted-foreground">
                Company's total asset base
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(getValueByFieldAndYear("Income Statement", "Net Profit", selectedYear))}
              </div>
              <p className="text-xs text-muted-foreground">
                Annual profitability
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Ratio</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentRatios.currentRatio.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Enhanced liquidity measure
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credit Risk Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentRatios.creditRiskScore.toFixed(0)}/100
              </div>
              <p className="text-xs text-muted-foreground">
                AI-powered risk assessment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="cad-assessment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="cad-assessment">CAD Assessment</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
            <TabsTrigger value="ratios">Enhanced Ratios</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="legacy">Legacy View</TabsTrigger>
          </TabsList>

          <TabsContent value="cad-assessment">
            <CADLoanAssessment 
              ratios={currentRatios} 
              loanData={cadLoanData}
              year={selectedYear} 
            />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentImport onDocumentProcessed={handleDocumentProcessed} />
          </TabsContent>

          <TabsContent value="statements" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Balance Sheet</CardTitle>
                  <CardDescription>Financial position as of {selectedYear}</CardDescription>
                </CardHeader>
                <CardContent>
                  <FinancialTable 
                    data={data["Balance Sheet"].filter(item => item.year === selectedYear)} 
                    title="Balance Sheet"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Income Statement</CardTitle>
                  <CardDescription>Performance for year {selectedYear}</CardDescription>
                </CardHeader>
                <CardContent>
                  <FinancialTable 
                    data={data["Income Statement"].filter(item => item.year === selectedYear)} 
                    title="Income Statement"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Statement</CardTitle>
                  <CardDescription>Cash movements in {selectedYear}</CardDescription>
                </CardHeader>
                <CardContent>
                  <FinancialTable 
                    data={data["Cash Flow Statement"].filter(item => item.year === selectedYear)} 
                    title="Cash Flow Statement"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ratios">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Enhanced CAD-specific ratios display */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Liquidity Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Current Ratio:</span>
                      <span className="font-mono">{currentRatios.currentRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quick Ratio:</span>
                      <span className="font-mono">{currentRatios.quickRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash Ratio:</span>
                      <span className="font-mono">{currentRatios.cashRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Working Capital Ratio:</span>
                      <span className="font-mono">{(currentRatios.workingCapitalRatio * 100).toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">CAD-Specific Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Trade Finance Ratio:</span>
                      <span className="font-mono">{currentRatios.tradeFinanceRatio.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Document Coverage:</span>
                      <span className="font-mono">{currentRatios.documentCoverageRatio.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash Conversion Cycle:</span>
                      <span className="font-mono">{currentRatios.cashConversionCycle.toFixed(0)} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Receivables Turnover:</span>
                      <span className="font-mono">{currentRatios.receivablesTurnover.toFixed(1)}x</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Credit Risk Score:</span>
                      <span className="font-mono">{currentRatios.creditRiskScore.toFixed(0)}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Concentration Risk:</span>
                      <span className="font-mono">{currentRatios.concentrationRisk.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volatility Index:</span>
                      <span className="font-mono">{currentRatios.volatilityIndex.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Coverage:</span>
                      <span className="font-mono">{currentRatios.timesInterestEarned.toFixed(1)}x</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <TrendChart data={data} years={years} />
          </TabsContent>

          <TabsContent value="legacy">
            <div className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Legacy view showing original loan eligibility assessment. 
                  Use the CAD Assessment tab for enhanced trade finance analysis.
                </AlertDescription>
              </Alert>
              
              <LoanEligibilityScore ratios={legacyRatios} year={selectedYear} detailed={true} />
              <RatioAnalysis ratios={legacyRatios} year={selectedYear} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
