
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

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

interface TrendChartProps {
  data: FinancialData;
  years: number[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, years }) => {
  const getValueByFieldAndYear = (statement: keyof FinancialData, fieldName: string, year: number) => {
    const item = data[statement].find(item => 
      item.field_name === fieldName && item.year === year
    );
    return item?.value || 0;
  };

  const trendData = years.map(year => ({
    year,
    totalAssets: getValueByFieldAndYear("Balance Sheet", "Total Assets", year) / 1000000,
    totalRevenue: getValueByFieldAndYear("Income Statement", "Total Revenue", year) / 1000000,
    netProfit: getValueByFieldAndYear("Income Statement", "Net Profit", year) / 1000000,
    operatingCashFlow: getValueByFieldAndYear("Cash Flow Statement", "Net Cash from Operating Activities", year) / 1000000,
    totalLiabilities: getValueByFieldAndYear("Balance Sheet", "Total Liabilities", year) / 1000000,
    shareholderEquity: getValueByFieldAndYear("Balance Sheet", "Shareholder's Equity", year) / 1000000
  }));

  const chartConfig = {
    totalAssets: {
      label: "Total Assets",
      color: "#8884d8"
    },
    totalRevenue: {
      label: "Total Revenue",
      color: "#82ca9d"
    },
    netProfit: {
      label: "Net Profit",
      color: "#ffc658"
    },
    operatingCashFlow: {
      label: "Operating Cash Flow",
      color: "#ff7300"
    },
    totalLiabilities: {
      label: "Total Liabilities",
      color: "#ff0000"
    },
    shareholderEquity: {
      label: "Shareholder Equity",
      color: "#00ff00"
    }
  };

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
    },
    {
      title: "Cash Flow Trend",
      description: "Operating cash flow generation over time",
      lines: [
        { key: "operatingCashFlow", name: "Operating Cash Flow", color: "#ff7300" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Trend Analysis</h2>
        <p className="text-gray-600">Multi-year financial performance trends for credit assessment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart, index) => (
          <Card key={index} className={index === 2 ? "lg:col-span-2" : ""}>
            <CardHeader>
              <CardTitle>{chart.title}</CardTitle>
              <CardDescription>{chart.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `${value}M`} />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => [`AED ${value.toFixed(2)}M`, '']}
                    />
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
              </ChartContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
