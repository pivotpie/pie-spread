import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Ratios {
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  grossProfitMargin: number;
  netProfitMargin: number;
  operatingMargin: number;
  ebitdaMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;
  assetTurnover: number;
  inventoryTurnover: number;
  interestCoverage: number;
  debtRatio: number;
  cashRatio: number;
  capitalAdequacy: number;
}

interface RatioAnalysisProps {
  ratios: Ratios;
  year: number;
}

export const RatioAnalysis: React.FC<RatioAnalysisProps> = ({ ratios, year }) => {
  const getRatioStatus = (value: number, good: number, acceptable: number, reverse: boolean = false) => {
    if (reverse) {
      if (value < 0) return { status: 'poor', icon: <XCircle className="h-4 w-4 text-red-500" /> };
      if (value <= good) return { status: 'good', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      if (value <= acceptable) return { status: 'acceptable', icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> };
      return { status: 'poor', icon: <XCircle className="h-4 w-4 text-red-500" /> };
    } else {
      if (value >= good) return { status: 'good', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      if (value >= acceptable) return { status: 'acceptable', icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> };
      return { status: 'poor', icon: <XCircle className="h-4 w-4 text-red-500" /> };
    }
  };

  const ratioCategories = [
    {
      category: 'Liquidity Ratios',
      ratios: [
        {
          name: 'Current Ratio',
          value: ratios.currentRatio,
          format: (v: number) => v.toFixed(2),
          description: 'Ability to pay short-term obligations',
          benchmark: 'Good: ≥2.0, Acceptable: ≥1.5',
          analysis: getRatioStatus(ratios.currentRatio, 2.0, 1.5)
        },
        {
          name: 'Quick Ratio',
          value: ratios.quickRatio,
          format: (v: number) => v.toFixed(2),
          description: 'Liquidity excluding inventory',
          benchmark: 'Good: ≥1.0, Acceptable: ≥0.8',
          analysis: getRatioStatus(ratios.quickRatio, 1.0, 0.8)
        },
        {
          name: 'Cash Ratio',
          value: ratios.cashRatio,
          format: (v: number) => v.toFixed(2),
          description: 'Cash coverage of current liabilities',
          benchmark: 'Good: ≥0.5, Acceptable: ≥0.2',
          analysis: getRatioStatus(ratios.cashRatio, 0.5, 0.2)
        }
      ]
    },
    {
      category: 'Leverage Ratios',
      ratios: [
        {
          name: 'Debt-to-Equity Ratio',
          value: ratios.debtToEquity,
          format: (v: number) => v.toFixed(2),
          description: 'Financial leverage and capital structure',
          benchmark: 'Good: ≤1.0, Acceptable: ≤2.0',
          analysis: getRatioStatus(ratios.debtToEquity, 1.0, 2.0, true)
        },
        {
          name: 'Debt Ratio (%)',
          value: ratios.debtRatio,
          format: (v: number) => `${v.toFixed(1)}%`,
          description: 'Proportion of assets financed by debt',
          benchmark: 'Good: ≤40%, Acceptable: ≤60%',
          analysis: getRatioStatus(ratios.debtRatio, 40, 60, true)
        },
        {
          name: 'Capital Adequacy Ratio (%)',
          value: ratios.capitalAdequacy,
          format: (v: number) => `${v.toFixed(1)}%`,
          description: 'Equity cushion relative to total assets',
          benchmark: 'Good: ≥50%, Acceptable: ≥30%',
          analysis: getRatioStatus(ratios.capitalAdequacy, 50, 30)
        }
      ]
    },
    {
      category: 'Profitability Ratios',
      ratios: [
        {
          name: 'Gross Profit Margin (%)',
          value: ratios.grossProfitMargin,
          format: (v: number) => `${v.toFixed(1)}%`,
          description: 'Gross profitability relative to revenue',
          benchmark: 'Good: ≥30%, Acceptable: ≥20%',
          analysis: getRatioStatus(ratios.grossProfitMargin, 30, 20)
        },
        {
          name: 'Net Profit Margin (%)',
          value: ratios.netProfitMargin,
          format: (v: number) => `${v.toFixed(1)}%`,
          description: 'Net profitability relative to revenue',
          benchmark: 'Good: ≥10%, Acceptable: ≥5%',
          analysis: getRatioStatus(ratios.netProfitMargin, 10, 5)
        },
        {
          name: 'Operating Margin (%)',
          value: ratios.operatingMargin,
          format: (v: number) => `${v.toFixed(1)}%`,
          description: 'Operating efficiency and profitability',
          benchmark: 'Good: ≥15%, Acceptable: ≥8%',
          analysis: getRatioStatus(ratios.operatingMargin, 15, 8)
        },
        {
          name: 'EBITDA Margin (%)',
          value: ratios.ebitdaMargin,
          format: (v: number) => `${v.toFixed(1)}%`,
          description: 'Operating performance before financing',
          benchmark: 'Good: ≥20%, Acceptable: ≥12%',
          analysis: getRatioStatus(ratios.ebitdaMargin, 20, 12)
        }
      ]
    },
    {
      category: 'Efficiency & Coverage Ratios',
      ratios: [
        {
          name: 'Return on Assets (%)',
          value: ratios.returnOnAssets,
          format: (v: number) => `${v.toFixed(1)}%`,
          description: 'Efficiency in using assets to generate profit',
          benchmark: 'Good: ≥15%, Acceptable: ≥10%',
          analysis: getRatioStatus(ratios.returnOnAssets, 15, 10)
        },
        {
          name: 'Return on Equity (%)',
          value: ratios.returnOnEquity,
          format: (v: number) => `${v.toFixed(1)}%`,
          description: 'Returns generated on shareholders equity',
          benchmark: 'Good: ≥20%, Acceptable: ≥15%',
          analysis: getRatioStatus(ratios.returnOnEquity, 20, 15)
        },
        {
          name: 'Asset Turnover',
          value: ratios.assetTurnover,
          format: (v: number) => v.toFixed(2),
          description: 'Efficiency of asset utilization',
          benchmark: 'Good: ≥1.5, Acceptable: ≥1.0',
          analysis: getRatioStatus(ratios.assetTurnover, 1.5, 1.0)
        },
        {
          name: 'Inventory Turnover',
          value: ratios.inventoryTurnover,
          format: (v: number) => v.toFixed(1),
          description: 'Inventory management efficiency',
          benchmark: 'Good: ≥6.0, Acceptable: ≥4.0',
          analysis: getRatioStatus(ratios.inventoryTurnover, 6.0, 4.0)
        },
        {
          name: 'Interest Coverage',
          value: ratios.interestCoverage,
          format: (v: number) => v.toFixed(1),
          description: 'Ability to service interest payments',
          benchmark: 'Good: ≥5.0, Acceptable: ≥2.5',
          analysis: getRatioStatus(ratios.interestCoverage, 5.0, 2.5)
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CAD Ratio Analysis</h2>
          <p className="text-gray-600">Year {year} - Comprehensive financial ratio evaluation for trade finance</p>
        </div>
      </div>

      {ratioCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">{category.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.ratios.map((ratio, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{ratio.name}</CardTitle>
                    {ratio.analysis.icon}
                  </div>
                  <CardDescription className="text-xs">{ratio.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">{ratio.format(ratio.value)}</span>
                    <Badge 
                      variant={ratio.analysis.status === 'good' ? 'default' : 
                              ratio.analysis.status === 'acceptable' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {ratio.analysis.status.charAt(0).toUpperCase() + ratio.analysis.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Benchmark:</strong> {ratio.benchmark}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
