
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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

interface TrendAnalysisProps {
  financialData: FinancialData;
  year: number;
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ 
  financialData, 
  year 
}) => {
  // Generate synthetic historical data for demonstration
  const generateHistoricalData = () => {
    const years = [year - 2, year - 1, year];
    return years.map((y, index) => {
      const growthFactor = 1 + (index * 0.08); // 8% average growth
      const volatility = 0.9 + (Math.random() * 0.2); // Add some volatility
      
      return {
        year: y,
        totalAssets: (financialData.totalAssets * growthFactor * volatility) / 1000000,
        totalRevenue: (financialData.totalRevenue * growthFactor * volatility) / 1000000,
        netProfit: (financialData.netProfit * growthFactor * volatility) / 1000000,
        operatingCashFlow: (financialData.operatingCashFlow * growthFactor * volatility) / 1000000,
        totalLiabilities: (financialData.totalLiabilities * growthFactor * volatility) / 1000000,
        shareholderEquity: (financialData.shareholderEquity * growthFactor * volatility) / 1000000
      };
    });
  };

  const trendData = generateHistoricalData();

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getTrendIcon = (growth: number) => {
    if (growth > 2) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (growth < -2) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const currentYear = trendData[trendData.length - 1];
  const previousYear = trendData[trendData.length - 2];

  const growthMetrics = [
    {
      name: 'Total Assets',
      growth: calculateGrowth(currentYear.totalAssets, previousYear.totalAssets),
      current: currentYear.totalAssets,
      previous: previousYear.totalAssets
    },
    {
      name: 'Total Revenue',
      growth: calculateGrowth(currentYear.totalRevenue, previousYear.totalRevenue),
      current: currentYear.totalRevenue,
      previous: previousYear.totalRevenue
    },
    {
      name: 'Net Profit',
      growth: calculateGrowth(currentYear.netProfit, previousYear.netProfit),
      current: currentYear.netProfit,
      previous: previousYear.netProfit
    },
    {
      name: 'Operating Cash Flow',
      growth: calculateGrowth(currentYear.operatingCashFlow, previousYear.operatingCashFlow),
      current: currentYear.operatingCashFlow,
      previous: previousYear.operatingCashFlow
    }
  ];

  const charts = [
    {
      title: "Assets & Liabilities Trend",
      description: "Track the growth of assets and liabilities over time",
      lines: [
        { key: "totalAssets", name: "Total Assets", color: "#8884d8" },
        { key: "totalLiabilities", name: "Total Liabilities", color: "#ff0000" },
        { key: "shareholderEquity", name: "Shareholder Equity", color: "#00ff00" }
      ]
    },
    {
      title: "Revenue & Profitability Trend",
      description: "Monitor revenue growth and profit generation",
      lines: [
        { key: "totalRevenue", name: "Total Revenue", color: "#82ca9d" },
        { key: "netProfit", name: "Net Profit", color: "#ffc658" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Trend Analysis</h2>
        <p className="text-gray-600 mt-2">Multi-year financial performance trends for credit assessment</p>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {growthMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {getTrendIcon(metric.growth)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.growth > 0 ? '+' : ''}{metric.growth.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                AED {metric.current.toFixed(1)}M vs {metric.previous.toFixed(1)}M
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{chart.title}</CardTitle>
              <CardDescription>{chart.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `${value}M`} />
                    {chart.lines.map((line) => (
                      <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        stroke={line.color}
                        strokeWidth={2}
                        name={line.name}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
