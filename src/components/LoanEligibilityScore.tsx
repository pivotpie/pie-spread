
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Shield, TrendingUp, DollarSign } from 'lucide-react';

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
    
    // Liquidity (25 points)
    // Current Ratio (10 points)
    if (ratios.currentRatio >= 2.0) score += 10;
    else if (ratios.currentRatio >= 1.5) score += 7;
    else if (ratios.currentRatio >= 1.0) score += 4;
    
    // Quick Ratio (8 points)
    if (ratios.quickRatio >= 1.0) score += 8;
    else if (ratios.quickRatio >= 0.8) score += 5;
    else if (ratios.quickRatio >= 0.5) score += 2;
    
    // Cash Ratio (7 points)
    if (ratios.cashRatio >= 0.5) score += 7;
    else if (ratios.cashRatio >= 0.2) score += 4;
    else if (ratios.cashRatio >= 0.1) score += 2;
    
    // Leverage (20 points)
    // Debt to Equity (10 points)
    if (ratios.debtToEquity <= 1.0) score += 10;
    else if (ratios.debtToEquity <= 2.0) score += 7;
    else if (ratios.debtToEquity <= 3.0) score += 3;
    
    // Capital Adequacy (10 points)
    if (ratios.capitalAdequacy >= 50) score += 10;
    else if (ratios.capitalAdequacy >= 30) score += 6;
    else if (ratios.capitalAdequacy >= 20) score += 3;
    
    // Profitability (25 points)
    // Net Profit Margin (8 points)
    if (ratios.netProfitMargin >= 10) score += 8;
    else if (ratios.netProfitMargin >= 5) score += 5;
    else if (ratios.netProfitMargin >= 2) score += 2;
    
    // ROA (8 points)
    if (ratios.returnOnAssets >= 15) score += 8;
    else if (ratios.returnOnAssets >= 10) score += 5;
    else if (ratios.returnOnAssets >= 5) score += 2;
    
    // Operating Margin (9 points)
    if (ratios.operatingMargin >= 15) score += 9;
    else if (ratios.operatingMargin >= 8) score += 6;
    else if (ratios.operatingMargin >= 5) score += 3;
    
    // Efficiency & Coverage (20 points)
    // Interest Coverage (8 points)
    if (ratios.interestCoverage >= 5.0) score += 8;
    else if (ratios.interestCoverage >= 2.5) score += 5;
    else if (ratios.interestCoverage >= 1.5) score += 2;
    
    // Asset Turnover (6 points)
    if (ratios.assetTurnover >= 1.5) score += 6;
    else if (ratios.assetTurnover >= 1.0) score += 4;
    else if (ratios.assetTurnover >= 0.5) score += 2;
    
    // Inventory Turnover (6 points)
    if (ratios.inventoryTurnover >= 6.0) score += 6;
    else if (ratios.inventoryTurnover >= 4.0) score += 4;
    else if (ratios.inventoryTurnover >= 2.0) score += 2;
    
    // Market Performance (10 points)
    // Gross Profit Margin (5 points)
    if (ratios.grossProfitMargin >= 30) score += 5;
    else if (ratios.grossProfitMargin >= 20) score += 3;
    else if (ratios.grossProfitMargin >= 15) score += 1;
    
    // ROE (5 points)
    if (ratios.returnOnEquity >= 20) score += 5;
    else if (ratios.returnOnEquity >= 15) score += 3;
    else if (ratios.returnOnEquity >= 10) score += 1;
    
    return Math.round(score);
  };

  const score = calculateScore();
  
  const getScoreCategory = (score: number) => {
    if (score >= 85) return {
      category: 'Excellent',
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      recommendation: 'Highly recommended for CAD loan approval with premium terms',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    };
    if (score >= 70) return {
      category: 'Good',
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      recommendation: 'Favorable for CAD loan approval with standard terms',
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />
    };
    if (score >= 55) return {
      category: 'Fair',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      recommendation: 'Conditional approval - additional collateral recommended',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
    };
    return {
      category: 'Poor',
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      recommendation: 'High risk - loan approval unlikely without guarantees',
      icon: <XCircle className="h-5 w-5 text-red-500" />
    };
  };

  const scoreData = getScoreCategory(score);

  const criteriaAnalysis = [
    {
      name: 'Liquidity',
      weight: 25,
      score: Math.min(25, 
        (ratios.currentRatio >= 2.0 ? 10 : ratios.currentRatio >= 1.5 ? 7 : ratios.currentRatio >= 1.0 ? 4 : 0) +
        (ratios.quickRatio >= 1.0 ? 8 : ratios.quickRatio >= 0.8 ? 5 : ratios.quickRatio >= 0.5 ? 2 : 0) +
        (ratios.cashRatio >= 0.5 ? 7 : ratios.cashRatio >= 0.2 ? 4 : ratios.cashRatio >= 0.1 ? 2 : 0)
      ),
      metrics: `Current: ${ratios.currentRatio.toFixed(2)}, Quick: ${ratios.quickRatio.toFixed(2)}, Cash: ${ratios.cashRatio.toFixed(2)}`,
      status: (ratios.currentRatio >= 1.5 && ratios.quickRatio >= 0.8) ? 'pass' : 'fail'
    },
    {
      name: 'Leverage',
      weight: 20,
      score: Math.min(20,
        (ratios.debtToEquity <= 1.0 ? 10 : ratios.debtToEquity <= 2.0 ? 7 : ratios.debtToEquity <= 3.0 ? 3 : 0) +
        (ratios.capitalAdequacy >= 50 ? 10 : ratios.capitalAdequacy >= 30 ? 6 : ratios.capitalAdequacy >= 20 ? 3 : 0)
      ),
      metrics: `D/E: ${ratios.debtToEquity.toFixed(2)}, Capital Adequacy: ${ratios.capitalAdequacy.toFixed(1)}%`,
      status: (ratios.debtToEquity <= 2.0 && ratios.capitalAdequacy >= 30) ? 'pass' : 'fail'
    },
    {
      name: 'Profitability',
      weight: 25,
      score: Math.min(25,
        (ratios.netProfitMargin >= 10 ? 8 : ratios.netProfitMargin >= 5 ? 5 : ratios.netProfitMargin >= 2 ? 2 : 0) +
        (ratios.returnOnAssets >= 15 ? 8 : ratios.returnOnAssets >= 10 ? 5 : ratios.returnOnAssets >= 5 ? 2 : 0) +
        (ratios.operatingMargin >= 15 ? 9 : ratios.operatingMargin >= 8 ? 6 : ratios.operatingMargin >= 5 ? 3 : 0)
      ),
      metrics: `Net Margin: ${ratios.netProfitMargin.toFixed(1)}%, ROA: ${ratios.returnOnAssets.toFixed(1)}%`,
      status: (ratios.netProfitMargin >= 5 && ratios.returnOnAssets >= 10) ? 'pass' : 'fail'
    },
    {
      name: 'Efficiency & Coverage',
      weight: 20,
      score: Math.min(20,
        (ratios.interestCoverage >= 5.0 ? 8 : ratios.interestCoverage >= 2.5 ? 5 : ratios.interestCoverage >= 1.5 ? 2 : 0) +
        (ratios.assetTurnover >= 1.5 ? 6 : ratios.assetTurnover >= 1.0 ? 4 : ratios.assetTurnover >= 0.5 ? 2 : 0) +
        (ratios.inventoryTurnover >= 6.0 ? 6 : ratios.inventoryTurnover >= 4.0 ? 4 : ratios.inventoryTurnover >= 2.0 ? 2 : 0)
      ),
      metrics: `Interest Coverage: ${ratios.interestCoverage.toFixed(1)}, Asset Turnover: ${ratios.assetTurnover.toFixed(2)}`,
      status: (ratios.interestCoverage >= 2.5 && ratios.assetTurnover >= 1.0) ? 'pass' : 'fail'
    },
    {
      name: 'Market Performance',
      weight: 10,
      score: Math.min(10,
        (ratios.grossProfitMargin >= 30 ? 5 : ratios.grossProfitMargin >= 20 ? 3 : ratios.grossProfitMargin >= 15 ? 1 : 0) +
        (ratios.returnOnEquity >= 20 ? 5 : ratios.returnOnEquity >= 15 ? 3 : ratios.returnOnEquity >= 10 ? 1 : 0)
      ),
      metrics: `Gross Margin: ${ratios.grossProfitMargin.toFixed(1)}%, ROE: ${ratios.returnOnEquity.toFixed(1)}%`,
      status: (ratios.grossProfitMargin >= 20 && ratios.returnOnEquity >= 15) ? 'pass' : 'fail'
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
                <CardTitle className="text-xl">CAD Loan Eligibility Score</CardTitle>
                <CardDescription>Comprehensive trade finance assessment for year {year}</CardDescription>
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
              <h4 className="font-semibold text-lg">Detailed CAD Assessment Criteria</h4>
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
                        <p className="text-xs text-gray-600">{criteria.metrics}</p>
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
              <strong>CAD Loan Recommendation:</strong> {scoreData.recommendation}
              {score < 55 && " - Consider requiring additional security or trade credit insurance."}
              {score >= 85 && " - Eligible for expedited processing and competitive documentary credit terms."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
