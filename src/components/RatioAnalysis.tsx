
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
    // Handle invalid/negative values
    if (value < 0 || !isFinite(value) || isNaN(value)) {
      return { status: 'poor', icon: <XCircle className="h-4 w-4 text-red-500" /> };
    }

    if (reverse) {
      // For ratios where lower is better (debt ratios, leverage ratios)
      if (value <= good) return { status: 'good', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      if (value <= acceptable) return { status: 'acceptable', icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> };
      return { status: 'poor', icon: <XCircle className="h-4 w-4 text-red-500" /> };
    } else {
      // For ratios where higher is better (liquidity, profitability ratios)
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
          format: (v: number) => isFinite(v) ? v.toFixed(2) : 'N/A',
          description: 'Ability to pay short-term obligations',
          benchmark: 'Good: ≥2.0, Acceptable: ≥1.5',
          analysis: getRatioStatus(ratios.currentRatio, 2.0, 1.5, false)
        },
        {
          name: 'Quick Ratio',
          value: ratios.quickRatio,
          format: (v: number) => isFinite(v) ? v.toFixed(2) : 'N/A',
          description: 'Liquidity excluding inventory',
          benchmark: 'Good: ≥1.0, Acceptable: ≥0.8',
          analysis: getRatioStatus(ratios.quickRatio, 1.0, 0.8, false)
        },
        {
          name: 'Cash Ratio',
          value: ratios.cashRatio,
          format: (v: number) => isFinite(v) ? v.toFixed(2) : 'N/A',
          description: 'Cash coverage of current liabilities',
          benchmark: 'Good: ≥0.5, Acceptable: ≥0.2',
          analysis: getRatioStatus(ratios.cashRatio, 0.5, 0.2, false)
        }
      ]
    },
    {
      category: 'Leverage Ratios',
      ratios: [
        {
          name: 'Debt-to-Equity Ratio',
          value: ratios.debtToEquity,
          format: (v: number) => isFinite(v) ? v.toFixed(2) : 'N/A',
          description: 'Financial leverage and capital structure',
          benchmark: 'Good: ≤1.0, Acceptable: ≤2.0',
          analysis: getRatioStatus(ratios.debtToEquity, 1.0, 2.0, true)
        },
        {
          name: 'Debt Ratio (%)',
          value: ratios.debtRatio,
          format: (v: number) => isFinite(v) ? `${v.toFixed(1)}%` : 'N/A',
          description: 'Proportion of assets financed by debt',
          benchmark: 'Good: ≤40%, Acceptable: ≤60%',
          analysis: getRatioStatus(ratios.debtRatio, 40, 60, true)
        },
        {
          name: 'Capital Adequacy Ratio (%)',
          value: ratios.capitalAdequacy,
          format: (v: number) => isFinite(v) ? `${v.toFixed(1)}%` : 'N/A',
          description: 'Equity cushion relative to total assets',
          benchmark: 'Good: ≥50%, Acceptable: ≥30%',
          analysis: getRatioStatus(ratios.capitalAdequacy, 50, 30, false)
        }
      ]
    },
    {
      category: 'Profitability Ratios',
      ratios: [
        {
          name: 'Gross Profit Margin (%)',
          value: ratios.grossProfitMargin,
          format: (v: number) => isFinite(v) ? `${v.toFixed(1)}%` : 'N/A',
          description: 'Gross profitability relative to revenue',
          benchmark: 'Good: ≥30%, Acceptable: ≥20%',
          analysis: getRatioStatus(ratios.grossProfitMargin, 30, 20, false)
        },
        {
          name: 'Net Profit Margin (%)',
          value: ratios.netProfitMargin,
          format: (v: number) => isFinite(v) ? `${v.toFixed(1)}%` : 'N/A',
          description: 'Net profitability relative to revenue',
          benchmark: 'Good: ≥10%, Acceptable: ≥5%',
          analysis: getRatioStatus(ratios.netProfitMargin, 10, 5, false)
        },
        {
          name: 'Operating Margin (%)',
          value: ratios.operatingMargin,
          format: (v: number) => isFinite(v) ? `${v.toFixed(1)}%` : 'N/A',
          description: 'Operating efficiency and profitability',
          benchmark: 'Good: ≥15%, Acceptable: ≥8%',
          analysis: getRatioStatus(ratios.operatingMargin, 15, 8, false)
        },
        {
          name: 'EBITDA Margin (%)',
          value: ratios.ebitdaMargin,
          format: (v: number) => isFinite(v) ? `${v.toFixed(1)}%` : 'N/A',
          description: 'Operating performance before financing',
          benchmark: 'Good: ≥20%, Acceptable: ≥12%',
          analysis: getRatioStatus(ratios.ebitdaMargin, 20, 12, false)
        }
      ]
    },
    {
      category: 'Efficiency & Coverage Ratios',
      ratios: [
        {
          name: 'Return on Assets (%)',
          value: ratios.returnOnAssets,
          format: (v: number) => isFinite(v) ? `${v.toFixed(1)}%` : 'N/A',
          description: 'Efficiency in using assets to generate profit',
          benchmark: 'Good: ≥15%, Acceptable: ≥10%',
          analysis: getRatioStatus(ratios.returnOnAssets, 15, 10, false)
        },
        {
          name: 'Return on Equity (%)',
          value: ratios.returnOnEquity,
          format: (v: number) => isFinite(v) ? `${v.toFixed(1)}%` : 'N/A',
          description: 'Returns generated on shareholders equity',
          benchmark: 'Good: ≥20%, Acceptable: ≥15%',
          analysis: getRatioStatus(ratios.returnOnEquity, 20, 15, false)
        },
        {
          name: 'Asset Turnover',
          value: ratios.assetTurnover,
          format: (v: number) => isFinite(v) ? v.toFixed(2) : 'N/A',
          description: 'Efficiency of asset utilization',
          benchmark: 'Good: ≥1.5, Acceptable: ≥1.0',
          analysis: getRatioStatus(ratios.assetTurnover, 1.5, 1.0, false)
        },
        {
          name: 'Inventory Turnover',
          value: ratios.inventoryTurnover,
          format: (v: number) => isFinite(v) ? v.toFixed(1) : 'N/A',
          description: 'Inventory management efficiency',
          benchmark: 'Good: ≥6.0, Acceptable: ≥4.0',
          analysis: getRatioStatus(ratios.inventoryTurnover, 6.0, 4.0, false)
        },
        {
          name: 'Interest Coverage',
          value: ratios.interestCoverage,
          format: (v: number) => isFinite(v) ? v.toFixed(1) : 'N/A',
          description: 'Ability to service interest payments',
          benchmark: 'Good: ≥5.0, Acceptable: ≥2.5',
          analysis: getRatioStatus(ratios.interestCoverage, 5.0, 2.5, false)
        }
      ]
    }
  ];

  // Check for data quality issues
  const hasDataIssues = !isFinite(ratios.debtToEquity) || !isFinite(ratios.debtRatio) || !isFinite(ratios.capitalAdequacy);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CAD Ratio Analysis</h2>
          <p className="text-gray-600">Year {year} - Comprehensive financial ratio evaluation for trade finance</p>
        </div>
      </div>

      {hasDataIssues && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Data Quality Warning</h3>
          </div>
          <p className="text-yellow-700 mt-2">
            Some financial ratios show unusual values that may indicate data quality issues. 
            Please verify the underlying financial statement data for accuracy.
          </p>
        </div>
      )}

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
