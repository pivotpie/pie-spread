import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { RobustRatios, SafeRatioResult } from '@/utils/ratioCalculations';

interface RatioAnalysisProps {
  ratios: RobustRatios;
  year: number;
}

export const RatioAnalysis: React.FC<RatioAnalysisProps> = ({ ratios, year }) => {
  const getRatioStatus = (ratio: SafeRatioResult, good: number, acceptable: number, reverse: boolean = false) => {
    // Handle unreliable data first
    if (!ratio.isReliable || !isFinite(ratio.value) || isNaN(ratio.value)) {
      return { 
        status: 'poor', 
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        warning: ratio.warning || 'Data quality issue'
      };
    }

    const value = ratio.value;

    if (reverse) {
      // For ratios where lower is better (debt ratios, leverage ratios)
      if (value <= good) {
        return { status: 'good', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      } else if (value <= acceptable) {
        return { status: 'acceptable', icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> };
      } else {
        return { status: 'poor', icon: <XCircle className="h-4 w-4 text-red-500" /> };
      }
    } else {
      // For ratios where higher is better (liquidity, profitability ratios)
      if (value >= good) {
        return { status: 'good', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      } else if (value >= acceptable) {
        return { status: 'acceptable', icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> };
      } else {
        return { status: 'poor', icon: <XCircle className="h-4 w-4 text-red-500" /> };
      }
    }
  };

  const formatRatioValue = (ratio: SafeRatioResult, isPercentage: boolean = false): string => {
    if (!ratio.isReliable || !isFinite(ratio.value) || isNaN(ratio.value)) {
      return 'N/A';
    }
    return isPercentage ? `${ratio.value.toFixed(1)}%` : ratio.value.toFixed(2);
  };

  const ratioCategories = [
    {
      category: 'Liquidity Ratios',
      ratios: [
        {
          name: 'Current Ratio',
          ratio: ratios.currentRatio,
          format: (r: SafeRatioResult) => formatRatioValue(r),
          description: 'Ability to pay short-term obligations',
          benchmark: 'Good: ≥2.0, Acceptable: ≥1.5',
          analysis: getRatioStatus(ratios.currentRatio, 2.0, 1.5, false)
        },
        {
          name: 'Quick Ratio',
          ratio: ratios.quickRatio,
          format: (r: SafeRatioResult) => formatRatioValue(r),
          description: 'Liquidity excluding inventory',
          benchmark: 'Good: ≥1.0, Acceptable: ≥0.8',
          analysis: getRatioStatus(ratios.quickRatio, 1.0, 0.8, false)
        },
        {
          name: 'Cash Ratio',
          ratio: ratios.cashRatio,
          format: (r: SafeRatioResult) => formatRatioValue(r),
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
          ratio: ratios.debtToEquity,
          format: (r: SafeRatioResult) => formatRatioValue(r),
          description: 'Financial leverage and capital structure',
          benchmark: 'Good: ≤1.0, Acceptable: ≤2.0',
          analysis: getRatioStatus(ratios.debtToEquity, 1.0, 2.0, true)
        },
        {
          name: 'Debt Ratio (%)',
          ratio: ratios.debtRatio,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Proportion of assets financed by debt',
          benchmark: 'Good: ≤40%, Acceptable: ≤60%',
          analysis: getRatioStatus(ratios.debtRatio, 40, 60, true)
        },
        {
          name: 'Capital Adequacy Ratio (%)',
          ratio: ratios.capitalAdequacy,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
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
          ratio: ratios.grossProfitMargin,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Gross profitability relative to revenue',
          benchmark: 'Good: ≥30%, Acceptable: ≥20%',
          analysis: getRatioStatus(ratios.grossProfitMargin, 30, 20, false)
        },
        {
          name: 'Net Profit Margin (%)',
          ratio: ratios.netProfitMargin,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Net profitability relative to revenue',
          benchmark: 'Good: ≥10%, Acceptable: ≥5%',
          analysis: getRatioStatus(ratios.netProfitMargin, 10, 5, false)
        },
        {
          name: 'Operating Margin (%)',
          ratio: ratios.operatingMargin,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Operating efficiency and profitability',
          benchmark: 'Good: ≥15%, Acceptable: ≥8%',
          analysis: getRatioStatus(ratios.operatingMargin, 15, 8, false)
        },
        {
          name: 'EBITDA Margin (%)',
          ratio: ratios.ebitdaMargin,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
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
          ratio: ratios.returnOnAssets,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Efficiency in using assets to generate profit',
          benchmark: 'Good: ≥15%, Acceptable: ≥10%',
          analysis: getRatioStatus(ratios.returnOnAssets, 15, 10, false)
        },
        {
          name: 'Return on Equity (%)',
          ratio: ratios.returnOnEquity,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Returns generated on shareholders equity',
          benchmark: 'Good: ≥20%, Acceptable: ≥15%',
          analysis: getRatioStatus(ratios.returnOnEquity, 20, 15, false)
        },
        {
          name: 'Asset Turnover',
          ratio: ratios.assetTurnover,
          format: (r: SafeRatioResult) => formatRatioValue(r),
          description: 'Efficiency of asset utilization',
          benchmark: 'Good: ≥1.5, Acceptable: ≥1.0',
          analysis: getRatioStatus(ratios.assetTurnover, 1.5, 1.0, false)
        },
        {
          name: 'Inventory Turnover',
          ratio: ratios.inventoryTurnover,
          format: (r: SafeRatioResult) => formatRatioValue(r),
          description: 'Inventory management efficiency',
          benchmark: 'Good: ≥6.0, Acceptable: ≥4.0',
          analysis: getRatioStatus(ratios.inventoryTurnover, 6.0, 4.0, false)
        },
        {
          name: 'Interest Coverage',
          ratio: ratios.interestCoverage,
          format: (r: SafeRatioResult) => formatRatioValue(r),
          description: 'Ability to service interest payments',
          benchmark: 'Good: ≥5.0, Acceptable: ≥2.5',
          analysis: getRatioStatus(ratios.interestCoverage, 5.0, 2.5, false)
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

      {/* Data Quality Alerts */}
      {ratios.dataQuality.issues.length > 0 && (
        <div className="space-y-3">
          {ratios.dataQuality.issues
            .filter(issue => issue.severity === 'high')
            .map((issue, index) => (
              <Alert key={index} className="border-red-200 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Data Quality Issue:</strong> {issue.description}
                  {issue.suggestedFix && (
                    <div className="mt-1 text-sm">
                      <strong>Suggestion:</strong> {issue.suggestedFix}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          
          {ratios.dataQuality.issues
            .filter(issue => issue.severity === 'medium')
            .map((issue, index) => (
              <Alert key={index} className="border-yellow-200 bg-yellow-50">
                <Info className="h-5 w-5 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Warning:</strong> {issue.description}
                </AlertDescription>
              </Alert>
            ))}
        </div>
      )}

      {ratioCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">{category.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.ratios.map((ratioItem, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{ratioItem.name}</CardTitle>
                    {ratioItem.analysis.icon}
                  </div>
                  <CardDescription className="text-xs">{ratioItem.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">{ratioItem.format(ratioItem.ratio)}</span>
                    <Badge 
                      variant={ratioItem.analysis.status === 'good' ? 'default' : 
                              ratioItem.analysis.status === 'acceptable' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {ratioItem.analysis.status.charAt(0).toUpperCase() + ratioItem.analysis.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    <strong>Benchmark:</strong> {ratioItem.benchmark}
                  </div>
                  {(ratioItem.ratio.warning || ratioItem.analysis.warning) && (
                    <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                      <strong>Warning:</strong> {ratioItem.ratio.warning || ratioItem.analysis.warning}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
