
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

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

interface FinancialChartsProps {
  data: FinancialData;
  selectedYear: number;
  years: number[];
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ data, selectedYear, years }) => {
  const getValueByFieldAndYear = (statement: keyof FinancialData, fieldName: string, year: number) => {
    const item = data[statement].find(item => 
      item.field_name === fieldName && item.year === year
    );
    return item?.value || 0;
  };

  // Assets vs Liabilities Comparison
  const assetsLiabilitiesData = [
    {
      name: 'Current Assets',
      value: getValueByFieldAndYear("Balance Sheet", "Current Assets", selectedYear) / 1000000
    },
    {
      name: 'Non-Current Assets',
      value: getValueByFieldAndYear("Balance Sheet", "Non-Current Assets", selectedYear) / 1000000
    },
    {
      name: 'Current Liabilities',
      value: getValueByFieldAndYear("Balance Sheet", "Current Liabilities", selectedYear) / 1000000
    },
    {
      name: 'Non-Current Liabilities',
      value: getValueByFieldAndYear("Balance Sheet", "Non-Current Liabilities", selectedYear) / 1000000
    }
  ];

  // Revenue Trend
  const revenueTrendData = years.map(year => ({
    year,
    revenue: getValueByFieldAndYear("Income Statement", "Total Revenue", selectedYear) / 1000000,
    profit: getValueByFieldAndYear("Income Statement", "Net Profit", selectedYear) / 1000000
  }));

  // Cash Flow Breakdown
  const cashFlowData = [
    {
      name: 'Operating',
      value: getValueByFieldAndYear("Cash Flow Statement", "Net Cash from Operating Activities", selectedYear) / 1000000,
      fill: '#22c55e'
    },
    {
      name: 'Investing',
      value: Math.abs(getValueByFieldAndYear("Cash Flow Statement", "Net Cash from Investing Activities", selectedYear)) / 1000000,
      fill: '#ef4444'
    },
    {
      name: 'Financing',
      value: Math.abs(getValueByFieldAndYear("Cash Flow Statement", "Net Cash from Financing Activities", selectedYear)) / 1000000,
      fill: '#3b82f6'
    }
  ];

  // Equity vs Debt
  const equityDebtData = [
    {
      name: "Shareholder's Equity",
      value: getValueByFieldAndYear("Balance Sheet", "Shareholder's Equity", selectedYear) / 1000000,
      fill: '#10b981'
    },
    {
      name: 'Total Debt',
      value: (getValueByFieldAndYear("Balance Sheet", "Short-Term Debt", selectedYear) + 
              getValueByFieldAndYear("Balance Sheet", "Long-Term Debt", selectedYear)) / 1000000,
      fill: '#f59e0b'
    }
  ];

  const chartConfig = {
    value: {
      label: "Value (AED M)",
      color: "#8884d8"
    },
    revenue: {
      label: "Revenue",
      color: "#8884d8"
    },
    profit: {
      label: "Net Profit",
      color: "#82ca9d"
    }
  };

  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    const radius = 10;
    return (
      <text 
        x={x + width / 2} 
        y={y - radius} 
        fill="#666" 
        textAnchor="middle" 
        dominantBaseline="middle"
        fontSize="10"
      >
        {`${value.toFixed(1)}M`}
      </text>
    );
  };

  const renderPieLabel = (entry: any) => {
    return `${entry.name}: ${entry.value.toFixed(1)}M`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Assets vs Liabilities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Assets vs Liabilities</CardTitle>
            <CardDescription>Balance sheet composition</CardDescription>
          </div>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetsLiabilitiesData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 8 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`AED ${value.toFixed(1)}M`, '']}
                />
                <Bar dataKey="value" fill="#8884d8">
                  <LabelList content={renderCustomLabel} />
                </Bar>
                <Legend 
                  content={<ChartLegendContent />}
                  verticalAlign="bottom"
                  height={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Revenue & Profit</CardTitle>
            <CardDescription>Performance over time</CardDescription>
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`AED ${value.toFixed(1)}M`, '']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Revenue">
                  <LabelList dataKey="revenue" position="top" fontSize={9} formatter={(value: number) => `${value.toFixed(1)}M`} />
                </Line>
                <Line type="monotone" dataKey="profit" stroke="#82ca9d" strokeWidth={2} name="Net Profit">
                  <LabelList dataKey="profit" position="bottom" fontSize={9} formatter={(value: number) => `${value.toFixed(1)}M`} />
                </Line>
                <Legend 
                  content={<ChartLegendContent />}
                  verticalAlign="bottom"
                  height={36}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Cash Flow Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Cash Flow Analysis</CardTitle>
            <CardDescription>Sources and uses of cash</CardDescription>
          </div>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <Pie
                  data={cashFlowData}
                  cx="50%"
                  cy="40%"
                  innerRadius={30}
                  outerRadius={60}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                  fontSize={8}
                >
                  {cashFlowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`AED ${value.toFixed(1)}M`, '']}
                />
                <Legend 
                  content={<ChartLegendContent />}
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Equity vs Debt */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Capital Structure</CardTitle>
            <CardDescription>Equity vs debt financing</CardDescription>
          </div>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <Pie
                  data={equityDebtData}
                  cx="50%"
                  cy="40%"
                  innerRadius={30}
                  outerRadius={60}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                  fontSize={8}
                >
                  {equityDebtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`AED ${value.toFixed(1)}M`, '']}
                />
                <Legend 
                  content={<ChartLegendContent />}
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
