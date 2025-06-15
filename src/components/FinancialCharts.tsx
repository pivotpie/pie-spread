import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Calculator } from 'lucide-react';

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
  currentRatios: any; // Add ratios prop for the cards
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({ data, selectedYear, years, currentRatios }) => {
  const getValueByFieldAndYear = (statement: keyof FinancialData, fieldName: string, year: number) => {
    const item = data[statement].find(item => 
      item.field_name === fieldName && item.year === year
    );
    return item?.value || 0;
  };

  const formatCurrency = (amount: number) => {
    return `AED ${(amount / 1000000).toFixed(2)}M`;
  };

  // Assets vs Liabilities Comparison
  const assetsLiabilitiesData = [
    {
      name: 'Current Assets',
      'Current Assets': getValueByFieldAndYear("Balance Sheet", "Current Assets", selectedYear) / 1000000,
      fill: '#8884d8'
    },
    {
      name: 'Non-Current Assets',
      'Non-Current Assets': getValueByFieldAndYear("Balance Sheet", "Non-Current Assets", selectedYear) / 1000000,
      fill: '#82ca9d'
    },
    {
      name: 'Current Liabilities',
      'Current Liabilities': getValueByFieldAndYear("Balance Sheet", "Current Liabilities", selectedYear) / 1000000,
      fill: '#ffc658'
    },
    {
      name: 'Non-Current Liabilities',
      'Non-Current Liabilities': getValueByFieldAndYear("Balance Sheet", "Non-Current Liabilities", selectedYear) / 1000000,
      fill: '#ff7300'
    }
  ];

  // Revenue Trend - Fixed to use actual year from loop
  const revenueTrendData = years.map(year => ({
    year,
    Revenue: getValueByFieldAndYear("Income Statement", "Total Revenue", year) / 1000000,
    'Net Profit': getValueByFieldAndYear("Income Statement", "Net Profit", year) / 1000000
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
    'Current Assets': {
      label: "Current Assets",
      color: "#8884d8"
    },
    'Non-Current Assets': {
      label: "Non-Current Assets",
      color: "#82ca9d"
    },
    'Current Liabilities': {
      label: "Current Liabilities",
      color: "#ffc658"
    },
    'Non-Current Liabilities': {
      label: "Non-Current Liabilities",
      color: "#ff7300"
    },
    Revenue: {
      label: "Revenue",
      color: "#8884d8"
    },
    'Net Profit': {
      label: "Net Profit",
      color: "#82ca9d"
    },
    Operating: {
      label: "Operating",
      color: "#22c55e"
    },
    Investing: {
      label: "Investing", 
      color: "#ef4444"
    },
    Financing: {
      label: "Financing",
      color: "#3b82f6"
    },
    "Shareholder's Equity": {
      label: "Shareholder's Equity",
      color: "#10b981"
    },
    'Total Debt': {
      label: "Total Debt",
      color: "#f59e0b"
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">Financial Analytics Dashboard</h2>
        <p className="text-slate-600 mt-2 text-lg">Visual representation of key financial metrics for {selectedYear}</p>
      </div>

      {/* Key Metrics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Assets vs Liabilities */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-100 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Assets vs Liabilities</CardTitle>
              <CardDescription className="text-slate-600">Balance sheet composition</CardDescription>
            </div>
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetsLiabilitiesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number, name: string) => [`AED ${value.toFixed(1)}M`, name]}
                  />
                  <Bar dataKey="Current Assets" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Non-Current Assets" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Current Liabilities" fill="#ffc658" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Non-Current Liabilities" fill="#ff7300" radius={[4, 4, 0, 0]} />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-emerald-100 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Revenue & Profit</CardTitle>
              <CardDescription className="text-slate-600">Performance over time</CardDescription>
            </div>
            <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number, name: string) => [`AED ${value.toFixed(1)}M`, name]}
                  />
                  <Line type="monotone" dataKey="Revenue" stroke="#8884d8" strokeWidth={3} dot={{ fill: '#8884d8', r: 5 }} />
                  <Line type="monotone" dataKey="Net Profit" stroke="#82ca9d" strokeWidth={3} dot={{ fill: '#82ca9d', r: 5 }} />
                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cash Flow Breakdown */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-100 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Cash Flow Analysis</CardTitle>
              <CardDescription className="text-slate-600">Sources and uses of cash</CardDescription>
            </div>
            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cashFlowData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label={false}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {cashFlowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number, name: string) => [`AED ${value.toFixed(1)}M`, name]}
                  />
                  <ChartLegend 
                    content={<ChartLegendContent />}
                    payload={cashFlowData.map(entry => ({
                      value: entry.name,
                      type: 'square',
                      color: entry.fill,
                      dataKey: entry.name
                    }))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Equity vs Debt */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-100 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Capital Structure</CardTitle>
              <CardDescription className="text-slate-600">Equity vs debt financing</CardDescription>
            </div>
            <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={equityDebtData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    label={false}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {equityDebtData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number, name: string) => [`AED ${value.toFixed(1)}M`, name]}
                  />
                  <ChartLegend 
                    content={<ChartLegendContent />}
                    payload={equityDebtData.map(entry => ({
                      value: entry.name,
                      type: 'square',
                      color: entry.fill,
                      dataKey: entry.name
                    }))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
