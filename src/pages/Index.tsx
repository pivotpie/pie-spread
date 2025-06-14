
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  DollarSign, 
  Calculator, 
  Shield,
  Upload,
  FileText,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { CADLoanAssessment } from '@/components/CADLoanAssessment';
import { DocumentImportModal } from '@/components/DocumentImportModal';
import { LoanEligibilityScore } from '@/components/LoanEligibilityScore';
import { calculateCADRatios, getCADLoanRecommendation } from '@/utils/cadRatioCalculations';

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

const Index = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cadLoanData] = useState({
    requestedAmount: 25000000, // AED 25M
    loanTenor: 6, // 6 months
    interestRate: 5.5,
    collateralValue: 30000000, // AED 30M
    documentsCoverage: 85,
    tradingHistory: 7,
    averageMonthlyTurnover: 8000000,
    currentOutstandings: 15000000
  });

  const formatCurrency = (value: number) => {
    return `AED ${(value / 1000000).toFixed(2)}M`;
  };

  const handleDataLoaded = (data: FinancialData) => {
    setFinancialData(data);
    setIsModalOpen(false);
  };

  // Calculate ratios only if we have financial data
  const currentRatios = useMemo(() => {
    if (!financialData) return null;

    const tradeData = {
      averageDailySales: financialData.totalRevenue / 365,
      averageCollectionPeriod: 45, // days
      averagePaymentPeriod: 30, // days
      documentValue: cadLoanData.requestedAmount * 1.2,
      collateralValue: cadLoanData.collateralValue
    };

    return calculateCADRatios(financialData, undefined, tradeData);
  }, [financialData, cadLoanData]);

  const loanRecommendation = currentRatios ? getCADLoanRecommendation(currentRatios) : null;

  // Legacy ratios for LoanEligibilityScore component
  const legacyRatios = useMemo(() => {
    if (!financialData) return null;

    const totalDebt = financialData.longTermDebt + financialData.shortTermDebt;
    
    return {
      currentRatio: financialData.currentLiabilities !== 0 ? financialData.currentAssets / financialData.currentLiabilities : 0,
      debtToEquity: financialData.shareholderEquity !== 0 ? financialData.totalLiabilities / financialData.shareholderEquity : 0,
      returnOnAssets: financialData.totalAssets !== 0 ? (financialData.netProfit / financialData.totalAssets) * 100 : 0,
      returnOnEquity: financialData.shareholderEquity !== 0 ? (financialData.netProfit / financialData.shareholderEquity) * 100 : 0,
      profitMargin: financialData.totalRevenue !== 0 ? (financialData.netProfit / financialData.totalRevenue) * 100 : 0,
      debtServiceCoverage: financialData.interestExpense !== 0 ? financialData.ebitda / financialData.interestExpense : 0,
      debtToAssets: financialData.totalAssets !== 0 ? (totalDebt / financialData.totalAssets) * 100 : 0,
      equityRatio: financialData.totalAssets !== 0 ? (financialData.shareholderEquity / financialData.totalAssets) * 100 : 0
    };
  }, [financialData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              CAD Loan Assessment Platform
            </h1>
            <p className="text-gray-600 mt-2">Cash Against Documents - Comprehensive Credit Analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Documents
            </Button>
            {loanRecommendation && (
              <Badge variant={loanRecommendation.recommendation === 'approve' ? 'default' : 
                              loanRecommendation.recommendation === 'conditional' ? 'secondary' : 'destructive'} 
                     className="px-3 py-1">
                <Shield className="h-4 w-4 mr-1" />
                {loanRecommendation.recommendation.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>

        {/* Loan Recommendation Alert */}
        {loanRecommendation && (
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
        )}

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {financialData ? formatCurrency(financialData.totalAssets) : '--'}
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
                {financialData ? formatCurrency(financialData.netProfit) : '--'}
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
                {currentRatios ? currentRatios.currentRatio.toFixed(2) : '--'}
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
                {currentRatios ? `${currentRatios.creditRiskScore.toFixed(0)}/100` : '--'}
              </div>
              <p className="text-xs text-muted-foreground">
                AI-powered risk assessment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {!financialData ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardHeader className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Upload className="h-16 w-16 text-gray-400" />
                <div>
                  <CardTitle className="text-xl text-gray-600">No Financial Data Loaded</CardTitle>
                  <CardDescription className="mt-2">
                    Import documents or load sample data to begin CAD loan assessment
                  </CardDescription>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Documents
                </Button>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* CAD Loan Assessment */}
            {currentRatios && (
              <CADLoanAssessment 
                ratios={currentRatios} 
                loanData={cadLoanData}
                year={2023} 
              />
            )}

            {/* Enhanced Ratios */}
            {currentRatios && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Enhanced Financial Ratios</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Liquidity Analysis */}
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

                  {/* CAD-Specific Metrics */}
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

                  {/* Risk Assessment */}
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

                  {/* Leverage Ratios */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Leverage Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Debt-to-Equity:</span>
                        <span className="font-mono">{currentRatios.debtToEquity.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Debt-to-Assets:</span>
                        <span className="font-mono">{(currentRatios.debtToAssets * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Equity Ratio:</span>
                        <span className="font-mono">{(currentRatios.equityRatio * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Debt Service Coverage:</span>
                        <span className="font-mono">{currentRatios.debtServiceCoverage.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Profitability Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Profitability Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Return on Assets:</span>
                        <span className="font-mono">{currentRatios.returnOnAssets.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Return on Equity:</span>
                        <span className="font-mono">{currentRatios.returnOnEquity.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit Margin:</span>
                        <span className="font-mono">{currentRatios.profitMargin.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operating Margin:</span>
                        <span className="font-mono">{currentRatios.operatingMargin.toFixed(1)}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Efficiency Ratios */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Efficiency Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Asset Turnover:</span>
                        <span className="font-mono">{currentRatios.assetTurnoverRatio.toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inventory Turnover:</span>
                        <span className="font-mono">{currentRatios.inventoryTurnover.toFixed(1)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payables Turnover:</span>
                        <span className="font-mono">{currentRatios.payablesTurnover.toFixed(1)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Interest Coverage:</span>
                        <span className="font-mono">{currentRatios.interestCoverageRatio.toFixed(1)}x</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* CAD Credit Recommendation */}
            {legacyRatios && (
              <div className="space-y-6">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    CAD-specific credit recommendation based on enhanced trade finance analysis and risk assessment.
                  </AlertDescription>
                </Alert>
                <LoanEligibilityScore ratios={legacyRatios} year={2023} detailed={true} />
              </div>
            )}
          </div>
        )}

        {/* Document Import Modal */}
        <DocumentImportModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDataLoaded={handleDataLoaded}
        />
      </div>
    </div>
  );
};

export default Index;
