
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialTable } from './FinancialTable';
import { DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

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

interface FinancialStatementsProps {
  financialData: FinancialData;
  year: number;
}

export const FinancialStatements: React.FC<FinancialStatementsProps> = ({ 
  financialData, 
  year 
}) => {
  const formatCurrency = (value: number) => {
    return `AED ${(value / 1000000).toFixed(2)}M`;
  };

  // Transform financial data to table format
  const balanceSheetData = [
    { field_name: 'Total Assets', value: financialData.totalAssets, currency: 'AED', year, confidence_score: 0.95 },
    { field_name: 'Current Assets', value: financialData.currentAssets, currency: 'AED', year, confidence_score: 0.92 },
    { field_name: 'Inventory', value: financialData.inventory, currency: 'AED', year, confidence_score: 0.88 },
    { field_name: 'Accounts Receivable', value: financialData.accountsReceivable, currency: 'AED', year, confidence_score: 0.90 },
    { field_name: 'Total Liabilities', value: financialData.totalLiabilities, currency: 'AED', year, confidence_score: 0.93 },
    { field_name: 'Current Liabilities', value: financialData.currentLiabilities, currency: 'AED', year, confidence_score: 0.91 },
    { field_name: 'Accounts Payable', value: financialData.accountsPayable, currency: 'AED', year, confidence_score: 0.89 },
    { field_name: 'Short Term Debt', value: financialData.shortTermDebt, currency: 'AED', year, confidence_score: 0.87 },
    { field_name: 'Long Term Debt', value: financialData.longTermDebt, currency: 'AED', year, confidence_score: 0.85 },
    { field_name: 'Shareholder Equity', value: financialData.shareholderEquity, currency: 'AED', year, confidence_score: 0.94 },
    { field_name: 'Working Capital', value: financialData.workingCapital, currency: 'AED', year, confidence_score: 0.86 }
  ];

  const incomeStatementData = [
    { field_name: 'Total Revenue', value: financialData.totalRevenue, currency: 'AED', year, confidence_score: 0.96 },
    { field_name: 'EBITDA', value: financialData.ebitda, currency: 'AED', year, confidence_score: 0.89 },
    { field_name: 'Interest Expense', value: financialData.interestExpense, currency: 'AED', year, confidence_score: 0.84 },
    { field_name: 'Net Profit', value: financialData.netProfit, currency: 'AED', year, confidence_score: 0.91 }
  ];

  const cashFlowData = [
    { field_name: 'Operating Cash Flow', value: financialData.operatingCashFlow, currency: 'AED', year, confidence_score: 0.88 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Financial Statements</h2>
        <p className="text-gray-600 mt-2">Detailed financial position for year {year}</p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.totalAssets)}</div>
            <p className="text-xs text-muted-foreground">Company's asset base</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Annual revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(financialData.netProfit)}</div>
            <p className="text-xs text-muted-foreground">Bottom line profitability</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Statements Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Balance Sheet</CardTitle>
            <CardDescription>Assets, liabilities, and equity position</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialTable data={balanceSheetData} title="Balance Sheet" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income Statement</CardTitle>
            <CardDescription>Revenue and profitability metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialTable data={incomeStatementData} title="Income Statement" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Statement</CardTitle>
          <CardDescription>Cash generation and utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialTable data={cashFlowData} title="Cash Flow Statement" />
        </CardContent>
      </Card>
    </div>
  );
};
