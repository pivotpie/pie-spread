
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
  CreditCard
} from 'lucide-react';
import financialData from '@/data/financialData.json';
import { FinancialTable } from '@/components/FinancialTable';
import { RatioAnalysis } from '@/components/RatioAnalysis';
import { TrendChart } from '@/components/TrendChart';
import { LoanEligibilityScore } from '@/components/LoanEligibilityScore';

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

  const calculateRatios = (year: number) => {
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

  const currentRatios = calculateRatios(selectedYear);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              Financial Spreading Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Bank Credit Team - Loan Eligibility Analysis</p>
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
            <Badge variant="outline" className="px-3 py-1">
              <CreditCard className="h-4 w-4 mr-1" />
              Credit Assessment
            </Badge>
          </div>
        </div>

        {/* Loan Eligibility Score */}
        <LoanEligibilityScore ratios={currentRatios} year={selectedYear} />

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
                Liquidity measure
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Debt-to-Equity</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentRatios.debtToEquity.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Leverage indicator
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="statements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="statements">Financial Statements</TabsTrigger>
            <TabsTrigger value="ratios">Ratio Analysis</TabsTrigger>
            <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
            <TabsTrigger value="eligibility">Loan Assessment</TabsTrigger>
          </TabsList>

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
            <RatioAnalysis ratios={currentRatios} year={selectedYear} />
          </TabsContent>

          <TabsContent value="trends">
            <TrendChart data={data} years={years} />
          </TabsContent>

          <TabsContent value="eligibility">
            <div className="space-y-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This loan eligibility assessment is based on standard banking ratios and thresholds. 
                  Final loan decisions require additional documentation and credit bureau checks.
                </AlertDescription>
              </Alert>
              
              <LoanEligibilityScore ratios={currentRatios} year={selectedYear} detailed={true} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
