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

  const getContextualExplanation = (ratioName: string, ratio: SafeRatioResult, analysis: any) => {
    if (!ratio.isReliable) {
      return "Unable to calculate due to data quality issues. Please verify the financial data accuracy.";
    }

    const value = ratio.value;

    switch (ratioName) {
      case 'Current Ratio':
        if (value < 1.0) return "Current ratio below 1.0 indicates potential liquidity problems - current liabilities exceed current assets.";
        if (value < 1.5) return "Current ratio below 1.5 suggests tight liquidity position for trade finance operations.";
        if (value > 3.0) return "Very high current ratio may indicate inefficient use of assets or excessive cash holdings.";
        break;

      case 'Quick Ratio':
        if (value < 0.5) return "Quick ratio below 0.5 indicates severe liquidity constraints without relying on inventory conversion.";
        if (value < 0.8) return "Quick ratio below 0.8 suggests potential difficulty meeting short-term obligations quickly.";
        break;

      case 'Debt-to-Equity Ratio':
        if (value > 3.0) return "Debt-to-equity above 3.0 indicates excessive leverage and high financial risk for lenders.";
        if (value > 2.0) return "Debt-to-equity above 2.0 suggests high leverage - company relies heavily on debt financing.";
        if (value > 5.0) return "Extreme leverage indicates potential insolvency risk and makes CAD lending highly risky.";
        break;

      case 'Debt Ratio (%)':
        if (value > 80) return "Debt ratio above 80% indicates very high financial leverage and limited equity cushion.";
        if (value > 100) return "Debt ratio above 100% suggests negative equity - liabilities exceed assets, indicating insolvency risk.";
        if (value > 60) return "Debt ratio above 60% indicates moderate to high leverage that may limit borrowing capacity.";
        break;

      case 'Capital Adequacy Ratio (%)':
        if (value < 20) return "Capital adequacy below 20% indicates insufficient equity buffer for absorbing losses.";
        if (value < 30) return "Capital adequacy below 30% suggests limited financial resilience for trade finance operations.";
        if (value < 0) return "Negative capital adequacy indicates insolvency - liabilities exceed assets.";
        break;

      case 'Net Profit Margin (%)':
        if (value < 0) return "Negative profit margin indicates the company is operating at a loss, reducing repayment capacity.";
        if (value < 2) return "Very low profit margin suggests minimal profitability and limited cash generation capability.";
        break;

      case 'Interest Coverage':
        if (value < 1.5) return "Interest coverage below 1.5 indicates difficulty servicing debt obligations and high default risk.";
        if (value < 2.5) return "Interest coverage below 2.5 suggests limited ability to handle additional debt service.";
        if (value < 1.0) return "Interest coverage below 1.0 means earnings are insufficient to cover interest payments.";
        break;

      case 'Return on Assets (%)':
        if (value < 0) return "Negative ROA indicates the company is generating losses relative to its asset base.";
        if (value < 5) return "Low ROA suggests inefficient asset utilization and weak profitability.";
        break;

      case 'Return on Equity (%)':
        if (value < 0) return "Negative ROE indicates losses are eroding shareholder value and equity base.";
        if (value < 10) return "Low ROE suggests poor returns for shareholders and limited reinvestment capacity.";
        break;

      default:
        return "";
    }

    return "";
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
          formula: 'Current Assets ÷ Current Liabilities',
          benchmark: 'Good: ≥2.0, Acceptable: ≥1.5',
          analysis: getRatioStatus(ratios.currentRatio, 2.0, 1.5, false)
        },
        {
          name: 'Quick Ratio',
          ratio: ratios.quickRatio,
          format: (r: SafeRatioResult) => formatRatioValue(r),
          description: 'Liquidity excluding inventory',
          formula: '(Current Assets - Inventory) ÷ Current Liabilities',
          benchmark: 'Good: ≥1.0, Acceptable: ≥0.8',
          analysis: getRatioStatus(ratios.quickRatio, 1.0, 0.8, false)
        },
        {
          name: 'Cash Ratio',
          ratio: ratios.cashRatio,
          format: (r: SafeRatioResult) => formatRatioValue(r),
          description: 'Cash coverage of current liabilities',
          formula: 'Cash and Cash Equivalents ÷ Current Liabilities',
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
          formula: 'Total Liabilities ÷ Shareholder\'s Equity',
          benchmark: 'Good: ≤1.0, Acceptable: ≤2.0',
          analysis: getRatioStatus(ratios.debtToEquity, 1.0, 2.0, true)
        },
        {
          name: 'Debt Ratio (%)',
          ratio: ratios.debtRatio,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Proportion of assets financed by debt',
          formula: '(Total Liabilities ÷ Total Assets) × 100',
          benchmark: 'Good: ≤40%, Acceptable: ≤60%',
          analysis: getRatioStatus(ratios.debtRatio, 40, 60, true)
        },
        {
          name: 'Capital Adequacy Ratio (%)',
          ratio: ratios.capitalAdequacy,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Equity cushion relative to total assets',
          formula: '(Shareholder\'s Equity ÷ Total Assets) × 100',
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
          formula: '(Gross Profit ÷ Total Revenue) × 100',
          benchmark: 'Good: ≥30%, Acceptable: ≥20%',
          analysis: getRatioStatus(ratios.grossProfitMargin, 30, 20, false)
        },
        {
          name: 'Net Profit Margin (%)',
          ratio: ratios.netProfitMargin,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Net profitability relative to revenue',
          formula: '(Net Profit ÷ Total Revenue) × 100',
          benchmark: 'Good: ≥10%, Acceptable: ≥5%',
          analysis: getRatioStatus(ratios.netProfitMargin, 10, 5, false)
        },
        {
          name: 'Operating Margin (%)',
          ratio: ratios.operatingMargin,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Operating efficiency and profitability',
          formula: '(EBIT ÷ Total Revenue) × 100',
          benchmark: 'Good: ≥15%, Acceptable: ≥8%',
          analysis: getRatioStatus(ratios.operatingMargin, 15, 8, false)
        },
        {
          name: 'EBITDA Margin (%)',
          ratio: ratios.ebitdaMargin,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Operating performance before financing',
          formula: '(EBITDA ÷ Total Revenue) × 100',
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
          formula: '(Net Profit ÷ Total Assets) × 100',
          benchmark: 'Good: ≥15%, Acceptable: ≥10%',
          analysis: getRatioStatus(ratios.returnOnAssets, 15, 10, false)
        },
        {
          name: 'Return on Equity (%)',
          ratio: ratios.returnOnEquity,
          format: (r: SafeRatioResult) => formatRatioValue(r, true),
          description: 'Returns generated on shareholders equity',
          formula: '(Net Profit ÷ Shareholder\'s Equity) × 100',
          benchmark: 'Good: ≥20%, Acceptable: ≥15%',
          analysis: getRatioStatus(ratios.returnOnEquity, 20, 15, false)
        },
        {
          name: 'Asset Turnover',
          ratio: ratios.assetTurnover,
          format: (r: SafeRatioResult) => formatRatioValue(r),
          description: 'Efficiency of asset utilization',
          formula: 'Total Revenue ÷ Total Assets',
          benchmark: 'Good: ≥1.5, Acceptable: ≥1.0',
          analysis: getRatioStatus(ratios.assetTurnover, 1.5, 1.0, false)
        },
        {
          name: 'Inventory Turnover',
          ratio: ratios.inventoryTurnover,
          format: (r: SafeRatioResult) => formatRatioValue(r),
          description: 'Inventory management efficiency',
          formula: 'Cost of Goods Sold ÷ Inventory',
          benchmark: 'Good: ≥6.0, Acceptable: ≥4.0',
          analysis: getRatioStatus(ratios.inventoryTurnover, 6.0, 4.0, false)
        },
        {
          name: 'Interest Coverage',
          ratio: ratios.interestCoverage,
          format: (r: SafeRatioResult) => formatRatioValue(r),
          description: 'Ability to service interest payments',
          formula: 'EBIT ÷ Interest Expense',
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.ratios.map((ratioItem, index) => {
              const contextualExplanation = getContextualExplanation(ratioItem.name, ratioItem.ratio, ratioItem.analysis);
              
              return (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="p-4 border-b bg-slate-50/70">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-slate-800">{ratioItem.name}</CardTitle>
                      {ratioItem.analysis.icon}
                    </div>
                    <CardDescription className="text-xs text-slate-500 pt-1">{ratioItem.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-slate-800">{ratioItem.format(ratioItem.ratio)}</span>
                      <Badge 
                        variant={ratioItem.analysis.status === 'good' ? 'default' : 
                                ratioItem.analysis.status === 'acceptable' ? 'secondary' : 'destructive'}
                        className={`text-xs ${
                          ratioItem.analysis.status === 'good' 
                            ? 'bg-green-500 text-white hover:bg-green-600 border-green-500' 
                            : ''
                        }`}
                      >
                        {ratioItem.analysis.status.charAt(0).toUpperCase() + ratioItem.analysis.status.slice(1)}
                      </Badge>

                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Benchmark:</strong> {ratioItem.benchmark}
                    </div>
                    <div className="text-xs text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded">
                      <strong>Formula:</strong> {ratioItem.formula}
                    </div>
                    
                    {/* Contextual Explanation */}
                    {contextualExplanation && (
                      <div className="text-xs text-blue-800 bg-blue-50 p-3 rounded-md border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                          <p className="flex-1"><strong>Impact:</strong> {contextualExplanation}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Technical Warnings */}
                    {(ratioItem.ratio.warning || ratioItem.analysis.warning) && (
                      <div className="text-xs text-orange-800 bg-orange-50 p-3 rounded-md border border-orange-200">
                         <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-500" />
                          <p className="flex-1"><strong>Warning:</strong> {ratioItem.ratio.warning || ratioItem.analysis.warning}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
