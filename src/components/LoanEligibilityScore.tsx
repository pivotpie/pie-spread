
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Shield, TrendingUp, DollarSign } from 'lucide-react';

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

interface LoanEligibilityScoreProps {
  ratios: Ratios;
  year: number;
  detailed?: boolean;
}

export const LoanEligibilityScore: React.FC<LoanEligibilityScoreProps> = ({ 
  ratios, 
  year, 
  detailed = false 
}) => {
  const calculateScore = () => {
    let score = 0;
    let maxScore = 100;
    
    // Liquidity (25 points)
    if (ratios.currentRatio >= 2.0) score += 25;
    else if (ratios.currentRatio >= 1.5) score += 18;
    else if (ratios.currentRatio >= 1.0) score += 10;
    
    // Leverage (20 points)
    if (ratios.debtToEquity <= 1.0) score += 20;
    else if (ratios.debtToEquity <= 2.0) score += 15;
    else if (ratios.debtToEquity <= 3.0) score += 8;
    
    // Profitability (25 points)
    if (ratios.returnOnAssets >= 15) score += 12.5;
    else if (ratios.returnOnAssets >= 10) score += 8;
    else if (ratios.returnOnAssets >= 5) score += 4;
    
    if (ratios.profitMargin >= 10) score += 12.5;
    else if (ratios.profitMargin >= 5) score += 8;
    else if (ratios.profitMargin >= 2) score += 4;
    
    // Debt Service Coverage (20 points)
    if (ratios.debtServiceCoverage >= 2.5) score += 20;
    else if (ratios.debtServiceCoverage >= 1.5) score += 15;
    else if (ratios.debtServiceCoverage >= 1.0) score += 8;
    
    // Capital Structure (10 points)
    if (ratios.equityRatio >= 50) score += 10;
    else if (ratios.equityRatio >= 30) score += 7;
    else if (ratios.equityRatio >= 20) score += 4;
    
    return Math.round(score);
  };

  const score = calculateScore();
  
  const getScoreCategory = (score: number) => {
    if (score >= 80) return {
      category: 'Excellent',
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      recommendation: 'High loan approval probability',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    };
    if (score >= 65) return {
      category: 'Good',
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      recommendation: 'Favorable for loan approval',
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />
    };
    if (score >= 50) return {
      category: 'Fair',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      recommendation: 'Conditional approval - additional review needed',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
    };
    return {
      category: 'Poor',
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      recommendation: 'High risk - loan approval unlikely',
      icon: <XCircle className="h-5 w-5 text-red-500" />
    };
  };

  const scoreData = getScoreCategory(score);

  const criteriaAnalysis = [
    {
      name: 'Liquidity',
      weight: 25,
      score: ratios.currentRatio >= 2.0 ? 25 : ratios.currentRatio >= 1.5 ? 18 : ratios.currentRatio >= 1.0 ? 10 : 0,
      metric: `Current Ratio: ${ratios.currentRatio.toFixed(2)}`,
      status: ratios.currentRatio >= 1.5 ? 'pass' : 'fail'
    },
    {
      name: 'Leverage',
      weight: 20,
      score: ratios.debtToEquity <= 1.0 ? 20 : ratios.debtToEquity <= 2.0 ? 15 : ratios.debtToEquity <= 3.0 ? 8 : 0,
      metric: `Debt-to-Equity: ${ratios.debtToEquity.toFixed(2)}`,
      status: ratios.debtToEquity <= 2.0 ? 'pass' : 'fail'
    },
    {
      name: 'Profitability',
      weight: 25,
      score: ((ratios.returnOnAssets >= 15 ? 12.5 : ratios.returnOnAssets >= 10 ? 8 : ratios.returnOnAssets >= 5 ? 4 : 0) +
              (ratios.profitMargin >= 10 ? 12.5 : ratios.profitMargin >= 5 ? 8 : ratios.profitMargin >= 2 ? 4 : 0)),
      metric: `ROA: ${ratios.returnOnAssets.toFixed(2)}%, Profit Margin: ${ratios.profitMargin.toFixed(2)}%`,
      status: ratios.returnOnAssets >= 10 && ratios.profitMargin >= 5 ? 'pass' : 'fail'
    },
    {
      name: 'Debt Service',
      weight: 20,
      score: ratios.debtServiceCoverage >= 2.5 ? 20 : ratios.debtServiceCoverage >= 1.5 ? 15 : ratios.debtServiceCoverage >= 1.0 ? 8 : 0,
      metric: `Coverage Ratio: ${ratios.debtServiceCoverage.toFixed(2)}`,
      status: ratios.debtServiceCoverage >= 1.5 ? 'pass' : 'fail'
    },
    {
      name: 'Capital Structure',
      weight: 10,
      score: ratios.equityRatio >= 50 ? 10 : ratios.equityRatio >= 30 ? 7 : ratios.equityRatio >= 20 ? 4 : 0,
      metric: `Equity Ratio: ${ratios.equityRatio.toFixed(2)}%`,
      status: ratios.equityRatio >= 30 ? 'pass' : 'fail'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className={`border-2 ${scoreData.bgColor}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">Loan Eligibility Score</CardTitle>
                <CardDescription>Credit assessment for year {year}</CardDescription>
              </div>
            </div>
            {scoreData.icon}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold flex items-center gap-2">
                {score}
                <span className="text-xl text-gray-500">/100</span>
              </div>
              <Badge className={`mt-2 ${scoreData.color} text-white`}>
                {scoreData.category}
              </Badge>
            </div>
            <div className="w-1/2">
              <Progress value={score} className="h-3" />
              <p className={`text-sm mt-2 ${scoreData.textColor} font-medium`}>
                {scoreData.recommendation}
              </p>
            </div>
          </div>

          {detailed && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold text-lg">Detailed Assessment Criteria</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {criteriaAnalysis.map((criteria, index) => (
                  <Card key={index} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{criteria.name}</CardTitle>
                        {criteria.status === 'pass' ? 
                          <CheckCircle className="h-4 w-4 text-green-500" /> : 
                          <XCircle className="h-4 w-4 text-red-500" />
                        }
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Score:</span>
                          <span className="font-mono">{criteria.score}/{criteria.weight}</span>
                        </div>
                        <Progress value={(criteria.score / criteria.weight) * 100} className="h-2" />
                        <p className="text-xs text-gray-600">{criteria.metric}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Alert className={scoreData.bgColor}>
            <DollarSign className="h-4 w-4" />
            <AlertDescription className={scoreData.textColor}>
              <strong>Credit Recommendation:</strong> {scoreData.recommendation}
              {score < 50 && " - Consider requesting additional collateral or guarantees."}
              {score >= 80 && " - Eligible for competitive interest rates."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
