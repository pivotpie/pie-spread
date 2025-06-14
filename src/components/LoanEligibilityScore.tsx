import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Shield, TrendingUp, DollarSign } from 'lucide-react';
import { RobustRatios } from '@/utils/ratioCalculations';

interface LoanEligibilityScoreProps {
  ratios: RobustRatios;
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
    
    // Helper function to get reliable value or 0
    const getValue = (ratio: any) => {
      return ratio.isReliable ? ratio.value : 0;
    };
    
    // Liquidity (25 points)
    const currentRatio = getValue(ratios.currentRatio);
    if (currentRatio >= 2.0) score += 10;
    else if (currentRatio >= 1.5) score += 7;
    else if (currentRatio >= 1.0) score += 4;
    
    const quickRatio = getValue(ratios.quickRatio);
    if (quickRatio >= 1.0) score += 8;
    else if (quickRatio >= 0.8) score += 5;
    else if (quickRatio >= 0.5) score += 2;
    
    const cashRatio = getValue(ratios.cashRatio);
    if (cashRatio >= 0.5) score += 7;
    else if (cashRatio >= 0.2) score += 4;
    else if (cashRatio >= 0.1) score += 2;
    
    // Leverage (20 points)
    const debtToEquity = getValue(ratios.debtToEquity);
    if (debtToEquity > 0 && debtToEquity <= 1.0) score += 10;
    else if (debtToEquity > 0 && debtToEquity <= 2.0) score += 7;
    else if (debtToEquity > 0 && debtToEquity <= 3.0) score += 3;
    
    const capitalAdequacy = getValue(ratios.capitalAdequacy);
    if (capitalAdequacy >= 50) score += 10;
    else if (capitalAdequacy >= 30) score += 6;
    else if (capitalAdequacy >= 20) score += 3;
    
    // Profitability (25 points)
    const netProfitMargin = getValue(ratios.netProfitMargin);
    if (netProfitMargin >= 10) score += 8;
    else if (netProfitMargin >= 5) score += 5;
    else if (netProfitMargin >= 2) score += 2;
    
    const returnOnAssets = getValue(ratios.returnOnAssets);
    if (returnOnAssets >= 15) score += 8;
    else if (returnOnAssets >= 10) score += 5;
    else if (returnOnAssets >= 5) score += 2;
    
    const operatingMargin = getValue(ratios.operatingMargin);
    if (operatingMargin >= 15) score += 9;
    else if (operatingMargin >= 8) score += 6;
    else if (operatingMargin >= 5) score += 3;
    
    // Efficiency & Coverage (20 points)
    const interestCoverage = getValue(ratios.interestCoverage);
    if (interestCoverage >= 5.0) score += 8;
    else if (interestCoverage >= 2.5) score += 5;
    else if (interestCoverage >= 1.5) score += 2;
    
    const assetTurnover = getValue(ratios.assetTurnover);
    if (assetTurnover >= 1.5) score += 6;
    else if (assetTurnover >= 1.0) score += 4;
    else if (assetTurnover >= 0.5) score += 2;
    
    const inventoryTurnover = getValue(ratios.inventoryTurnover);
    if (inventoryTurnover >= 6.0) score += 6;
    else if (inventoryTurnover >= 4.0) score += 4;
    else if (inventoryTurnover >= 2.0) score += 2;
    
    // Market Performance (10 points)
    const grossProfitMargin = getValue(ratios.grossProfitMargin);
    if (grossProfitMargin >= 30) score += 5;
    else if (grossProfitMargin >= 20) score += 3;
    else if (grossProfitMargin >= 15) score += 1;
    
    const returnOnEquity = getValue(ratios.returnOnEquity);
    if (returnOnEquity >= 20) score += 5;
    else if (returnOnEquity >= 15) score += 3;
    else if (returnOnEquity >= 10) score += 1;
    
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
        (getValue(ratios.currentRatio) >= 2.0 ? 10 : getValue(ratios.currentRatio) >= 1.5 ? 7 : getValue(ratios.currentRatio) >= 1.0 ? 4 : 0) +
        (getValue(ratios.quickRatio) >= 1.0 ? 8 : getValue(ratios.quickRatio) >= 0.8 ? 5 : getValue(ratios.quickRatio) >= 0.5 ? 2 : 0) +
        (getValue(ratios.cashRatio) >= 0.5 ? 7 : getValue(ratios.cashRatio) >= 0.2 ? 4 : getValue(ratios.cashRatio) >= 0.1 ? 2 : 0)
      ),
      metrics: `Current: ${ratios.currentRatio.isReliable ? getValue(ratios.currentRatio).toFixed(2) : 'N/A'}, Quick: ${ratios.quickRatio.isReliable ? getValue(ratios.quickRatio).toFixed(2) : 'N/A'}, Cash: ${ratios.cashRatio.isReliable ? getValue(ratios.cashRatio).toFixed(2) : 'N/A'}`,
      status: (getValue(ratios.currentRatio) >= 1.5 && getValue(ratios.quickRatio) >= 0.8 && ratios.currentRatio.isReliable && ratios.quickRatio.isReliable) ? 'pass' : 'fail'
    },
    {
      name: 'Leverage',
      weight: 20,
      score: Math.min(20,
        (getValue(ratios.debtToEquity) > 0 && getValue(ratios.debtToEquity) <= 1.0 ? 10 : getValue(ratios.debtToEquity) > 0 && getValue(ratios.debtToEquity) <= 2.0 ? 7 : getValue(ratios.debtToEquity) > 0 && getValue(ratios.debtToEquity) <= 3.0 ? 3 : 0) +
        (getValue(ratios.capitalAdequacy) >= 50 ? 10 : getValue(ratios.capitalAdequacy) >= 30 ? 6 : getValue(ratios.capitalAdequacy) >= 20 ? 3 : 0)
      ),
      metrics: `D/E: ${ratios.debtToEquity.isReliable ? getValue(ratios.debtToEquity).toFixed(2) : 'N/A'}, Capital Adequacy: ${ratios.capitalAdequacy.isReliable ? getValue(ratios.capitalAdequacy).toFixed(1) : 'N/A'}%`,
      status: (getValue(ratios.debtToEquity) > 0 && getValue(ratios.debtToEquity) <= 2.0 && getValue(ratios.capitalAdequacy) >= 30) ? 'pass' : 'fail'
    },
    {
      name: 'Profitability',
      weight: 25,
      score: Math.min(25,
        (getValue(ratios.netProfitMargin) >= 10 ? 8 : getValue(ratios.netProfitMargin) >= 5 ? 5 : getValue(ratios.netProfitMargin) >= 2 ? 2 : 0) +
        (getValue(ratios.returnOnAssets) >= 15 ? 8 : getValue(ratios.returnOnAssets) >= 10 ? 5 : getValue(ratios.returnOnAssets) >= 5 ? 2 : 0) +
        (getValue(ratios.operatingMargin) >= 15 ? 9 : getValue(ratios.operatingMargin) >= 8 ? 6 : getValue(ratios.operatingMargin) >= 5 ? 3 : 0)
      ),
      metrics: `Net Margin: ${ratios.netProfitMargin.isReliable ? getValue(ratios.netProfitMargin).toFixed(1) : 'N/A'}%, ROA: ${ratios.returnOnAssets.isReliable ? getValue(ratios.returnOnAssets).toFixed(1) : 'N/A'}%`,
      status: (getValue(ratios.netProfitMargin) >= 5 && getValue(ratios.returnOnAssets) >= 10) ? 'pass' : 'fail'
    },
    {
      name: 'Efficiency & Coverage',
      weight: 20,
      score: Math.min(20,
        (getValue(ratios.interestCoverage) >= 5.0 ? 8 : getValue(ratios.interestCoverage) >= 2.5 ? 5 : getValue(ratios.interestCoverage) >= 1.5 ? 2 : 0) +
        (getValue(ratios.assetTurnover) >= 1.5 ? 6 : getValue(ratios.assetTurnover) >= 1.0 ? 4 : getValue(ratios.assetTurnover) >= 0.5 ? 2 : 0) +
        (getValue(ratios.inventoryTurnover) >= 6.0 ? 6 : getValue(ratios.inventoryTurnover) >= 4.0 ? 4 : getValue(ratios.inventoryTurnover) >= 2.0 ? 2 : 0)
      ),
      metrics: `Interest Coverage: ${ratios.interestCoverage.isReliable ? getValue(ratios.interestCoverage).toFixed(1) : 'N/A'}, Asset Turnover: ${ratios.assetTurnover.isReliable ? getValue(ratios.assetTurnover).toFixed(2) : 'N/A'}`,
      status: (getValue(ratios.interestCoverage) >= 2.5 && getValue(ratios.assetTurnover) >= 1.0) ? 'pass' : 'fail'
    },
    {
      name: 'Market Performance',
      weight: 10,
      score: Math.min(10,
        (getValue(ratios.grossProfitMargin) >= 30 ? 5 : getValue(ratios.grossProfitMargin) >= 20 ? 3 : getValue(ratios.grossProfitMargin) >= 15 ? 1 : 0) +
        (getValue(ratios.returnOnEquity) >= 20 ? 5 : getValue(ratios.returnOnEquity) >= 15 ? 3 : getValue(ratios.returnOnEquity) >= 10 ? 1 : 0)
      ),
      metrics: `Gross Margin: ${ratios.grossProfitMargin.isReliable ? getValue(ratios.grossProfitMargin).toFixed(1) : 'N/A'}%, ROE: ${ratios.returnOnEquity.isReliable ? getValue(ratios.returnOnEquity).toFixed(1) : 'N/A'}%`,
      status: (getValue(ratios.grossProfitMargin) >= 20 && getValue(ratios.returnOnEquity) >= 15) ? 'pass' : 'fail'
    }
  ];

  // Helper function to get reliable value or 0
  const getValue = (ratio: any) => {
    return ratio.isReliable ? ratio.value : 0;
  };

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
          {/* Data Quality Warning */}
          {!ratios.dataQuality.isValid && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Data Quality Issues Detected:</strong> Some calculations may be unreliable due to data inconsistencies. Review the detailed analysis below.
              </AlertDescription>
            </Alert>
          )}

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
              {!ratios.dataQuality.isValid && " - Recommendation subject to data quality verification."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
