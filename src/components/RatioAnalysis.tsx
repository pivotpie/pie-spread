
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Ratios {
  currentRatio: number;
  debtToEquity: number;
  returnOnAssets: number;
  returnOnEquity: number;
  profitMargin: number;
  debtServiceCoverage: number;
  debtToAssets: number;
  equityRatio: number;
}

interface RatioAnalysisProps {
  ratios: Ratios;
  year: number;
}

export const RatioAnalysis: React.FC<RatioAnalysisProps> = ({ ratios, year }) => {
  const getRatioStatus = (value: number, good: number, acceptable: number, reverse: boolean = false) => {
    if (reverse) {
      if (value <= good) return { status: 'good', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      if (value <= acceptable) return { status: 'acceptable', icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> };
      return { status: 'poor', icon: <XCircle className="h-4 w-4 text-red-500" /> };
    } else {
      if (value >= good) return { status: 'good', icon: <CheckCircle className="h-4 w-4 text-green-500" /> };
      if (value >= acceptable) return { status: 'acceptable', icon: <AlertTriangle className="h-4 w-4 text-yellow-500" /> };
      return { status: 'poor', icon: <XCircle className="h-4 w-4 text-red-500" /> };
    }
  };

  const ratioAnalysis = [
    {
      name: 'Current Ratio',
      value: ratios.currentRatio,
      format: (v: number) => v.toFixed(2),
      description: 'Ability to pay short-term obligations',
      benchmark: 'Good: ≥2.0, Acceptable: ≥1.5',
      analysis: getRatioStatus(ratios.currentRatio, 2.0, 1.5)
    },
    {
      name: 'Debt-to-Equity Ratio',
      value: ratios.debtToEquity,
      format: (v: number) => v.toFixed(2),
      description: 'Financial leverage and capital structure',
      benchmark: 'Good: ≤1.0, Acceptable: ≤2.0',
      analysis: getRatioStatus(ratios.debtToEquity, 1.0, 2.0, true)
    },
    {
      name: 'Return on Assets (%)',
      value: ratios.returnOnAssets,
      format: (v: number) => `${v.toFixed(2)}%`,
      description: 'Efficiency in using assets to generate profit',
      benchmark: 'Good: ≥15%, Acceptable: ≥10%',
      analysis: getRatioStatus(ratios.returnOnAssets, 15, 10)
    },
    {
      name: 'Return on Equity (%)',
      value: ratios.returnOnEquity,
      format: (v: number) => `${v.toFixed(2)}%`,
      description: 'Returns generated on shareholders equity',
      benchmark: 'Good: ≥20%, Acceptable: ≥15%',
      analysis: getRatioStatus(ratios.returnOnEquity, 20, 15)
    },
    {
      name: 'Profit Margin (%)',
      value: ratios.profitMargin,
      format: (v: number) => `${v.toFixed(2)}%`,
      description: 'Profitability relative to revenue',
      benchmark: 'Good: ≥10%, Acceptable: ≥5%',
      analysis: getRatioStatus(ratios.profitMargin, 10, 5)
    },
    {
      name: 'Debt Service Coverage',
      value: ratios.debtServiceCoverage,
      format: (v: number) => v.toFixed(2),
      description: 'Ability to service debt obligations',
      benchmark: 'Good: ≥2.5, Acceptable: ≥1.5',
      analysis: getRatioStatus(ratios.debtServiceCoverage, 2.5, 1.5)
    },
    {
      name: 'Debt-to-Assets (%)',
      value: ratios.debtToAssets,
      format: (v: number) => `${v.toFixed(2)}%`,
      description: 'Proportion of assets financed by debt',
      benchmark: 'Good: ≤40%, Acceptable: ≤60%',
      analysis: getRatioStatus(ratios.debtToAssets, 40, 60, true)
    },
    {
      name: 'Equity Ratio (%)',
      value: ratios.equityRatio,
      format: (v: number) => `${v.toFixed(2)}%`,
      description: 'Proportion of assets financed by equity',
      benchmark: 'Good: ≥50%, Acceptable: ≥30%',
      analysis: getRatioStatus(ratios.equityRatio, 50, 30)
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Financial Ratio Analysis</h2>
          <p className="text-gray-600">Year {year} - Comprehensive ratio evaluation for loan assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ratioAnalysis.map((ratio, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{ratio.name}</CardTitle>
                {ratio.analysis.icon}
              </div>
              <CardDescription>{ratio.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{ratio.format(ratio.value)}</span>
                <Badge 
                  variant={ratio.analysis.status === 'good' ? 'default' : 
                          ratio.analysis.status === 'acceptable' ? 'secondary' : 'destructive'}
                >
                  {ratio.analysis.status.charAt(0).toUpperCase() + ratio.analysis.status.slice(1)}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Benchmark:</strong> {ratio.benchmark}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
