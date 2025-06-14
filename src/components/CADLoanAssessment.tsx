
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  FileText, 
  TrendingUp,
  Calculator,
  Shield
} from 'lucide-react';

interface CADLoanData {
  requestedAmount: number;
  loanTenor: number; // in months
  interestRate: number;
  collateralValue: number;
  documentsCoverage: number; // percentage of trade documents coverage
  tradingHistory: number; // years of trading history
  averageMonthlyTurnover: number;
  currentOutstandings: number;
}

interface CADRatios {
  currentRatio: number;
  debtToEquity: number;
  returnOnAssets: number;
  profitMargin: number;
  debtServiceCoverage: number;
  workingCapitalRatio: number;
  assetTurnoverRatio: number;
  interestCoverageRatio: number;
}

interface CADLoanAssessmentProps {
  ratios: CADRatios;
  loanData: CADLoanData;
  year: number;
}

export const CADLoanAssessment: React.FC<CADLoanAssessmentProps> = ({ 
  ratios, 
  loanData, 
  year 
}) => {
  const [assessment, setAssessment] = useState<any>(null);

  const calculateCADScore = () => {
    let score = 0;
    let details: any[] = [];

    // Financial Strength (40 points)
    const financialScore = calculateFinancialScore(ratios, details);
    score += financialScore;

    // Loan Structure (25 points)
    const loanStructureScore = calculateLoanStructureScore(loanData, details);
    score += loanStructureScore;

    // Trading History & Experience (20 points)
    const tradingScore = calculateTradingScore(loanData, details);
    score += tradingScore;

    // Document Coverage (15 points)
    const documentScore = calculateDocumentScore(loanData, details);
    score += documentScore;

    return { score: Math.round(score), details };
  };

  const calculateFinancialScore = (ratios: CADRatios, details: any[]) => {
    let score = 0;
    
    // Current Ratio (10 points)
    if (ratios.currentRatio >= 1.5) {
      score += 10;
      details.push({ category: 'Liquidity', item: 'Current Ratio', status: 'excellent', points: 10 });
    } else if (ratios.currentRatio >= 1.2) {
      score += 7;
      details.push({ category: 'Liquidity', item: 'Current Ratio', status: 'good', points: 7 });
    } else {
      score += 3;
      details.push({ category: 'Liquidity', item: 'Current Ratio', status: 'poor', points: 3 });
    }

    // Debt Service Coverage (15 points)
    if (ratios.debtServiceCoverage >= 2.0) {
      score += 15;
      details.push({ category: 'Debt Service', item: 'Coverage Ratio', status: 'excellent', points: 15 });
    } else if (ratios.debtServiceCoverage >= 1.5) {
      score += 10;
      details.push({ category: 'Debt Service', item: 'Coverage Ratio', status: 'good', points: 10 });
    } else {
      score += 5;
      details.push({ category: 'Debt Service', item: 'Coverage Ratio', status: 'poor', points: 5 });
    }

    // Profitability (15 points)
    if (ratios.profitMargin >= 8) {
      score += 15;
      details.push({ category: 'Profitability', item: 'Profit Margin', status: 'excellent', points: 15 });
    } else if (ratios.profitMargin >= 5) {
      score += 10;
      details.push({ category: 'Profitability', item: 'Profit Margin', status: 'good', points: 10 });
    } else {
      score += 5;
      details.push({ category: 'Profitability', item: 'Profit Margin', status: 'poor', points: 5 });
    }

    return score;
  };

  const calculateLoanStructureScore = (loanData: CADLoanData, details: any[]) => {
    let score = 0;
    
    // Loan to Collateral Ratio (15 points)
    const loanToCollateralRatio = (loanData.requestedAmount / loanData.collateralValue) * 100;
    if (loanToCollateralRatio <= 70) {
      score += 15;
      details.push({ category: 'Collateral', item: 'Loan-to-Collateral Ratio', status: 'excellent', points: 15 });
    } else if (loanToCollateralRatio <= 85) {
      score += 10;
      details.push({ category: 'Collateral', item: 'Loan-to-Collateral Ratio', status: 'good', points: 10 });
    } else {
      score += 5;
      details.push({ category: 'Collateral', item: 'Loan-to-Collateral Ratio', status: 'poor', points: 5 });
    }

    // Tenor Appropriateness (10 points)
    if (loanData.loanTenor <= 6) {
      score += 10;
      details.push({ category: 'Structure', item: 'Loan Tenor', status: 'excellent', points: 10 });
    } else if (loanData.loanTenor <= 12) {
      score += 7;
      details.push({ category: 'Structure', item: 'Loan Tenor', status: 'good', points: 7 });
    } else {
      score += 3;
      details.push({ category: 'Structure', item: 'Loan Tenor', status: 'poor', points: 3 });
    }

    return score;
  };

  const calculateTradingScore = (loanData: CADLoanData, details: any[]) => {
    let score = 0;
    
    // Trading History (20 points)
    if (loanData.tradingHistory >= 5) {
      score += 20;
      details.push({ category: 'Experience', item: 'Trading History', status: 'excellent', points: 20 });
    } else if (loanData.tradingHistory >= 3) {
      score += 15;
      details.push({ category: 'Experience', item: 'Trading History', status: 'good', points: 15 });
    } else {
      score += 8;
      details.push({ category: 'Experience', item: 'Trading History', status: 'poor', points: 8 });
    }

    return score;
  };

  const calculateDocumentScore = (loanData: CADLoanData, details: any[]) => {
    let score = 0;
    
    // Document Coverage (15 points)
    if (loanData.documentsCoverage >= 90) {
      score += 15;
      details.push({ category: 'Documentation', item: 'Document Coverage', status: 'excellent', points: 15 });
    } else if (loanData.documentsCoverage >= 80) {
      score += 12;
      details.push({ category: 'Documentation', item: 'Document Coverage', status: 'good', points: 12 });
    } else {
      score += 6;
      details.push({ category: 'Documentation', item: 'Document Coverage', status: 'poor', points: 6 });
    }

    return score;
  };

  const performAssessment = () => {
    const result = calculateCADScore();
    setAssessment(result);
  };

  const getScoreCategory = (score: number) => {
    if (score >= 85) return { category: 'Excellent', color: 'bg-green-500', recommendation: 'Approve with standard terms' };
    if (score >= 70) return { category: 'Good', color: 'bg-blue-500', recommendation: 'Approve with enhanced monitoring' };
    if (score >= 55) return { category: 'Fair', color: 'bg-yellow-500', recommendation: 'Conditional approval with restrictions' };
    return { category: 'Poor', color: 'bg-red-500', recommendation: 'Decline or request additional security' };
  };

  const scoreData = assessment ? getScoreCategory(assessment.score) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">CAD Loan Assessment</CardTitle>
                <CardDescription>Cash Against Documents - Credit Decision Support</CardDescription>
              </div>
            </div>
            <Button onClick={performAssessment} className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Assess Loan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loan Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold">AED {(loanData.requestedAmount / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-gray-600">Requested Amount</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FileText className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold">{loanData.loanTenor}</div>
              <div className="text-sm text-gray-600">Months Tenor</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="h-6 w-6 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold">{loanData.interestRate}%</div>
              <div className="text-sm text-gray-600">Interest Rate</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Shield className="h-6 w-6 mx-auto text-orange-600 mb-2" />
              <div className="text-2xl font-bold">{loanData.documentsCoverage}%</div>
              <div className="text-sm text-gray-600">Document Coverage</div>
            </div>
          </div>

          {/* Assessment Results */}
          {assessment && scoreData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-3xl font-bold">{assessment.score}/100</div>
                  <Badge className={`mt-2 ${scoreData.color} text-white`}>
                    {scoreData.category}
                  </Badge>
                </div>
                <div className="w-1/2">
                  <Progress value={assessment.score} className="h-3" />
                  <p className="text-sm mt-2 font-medium">
                    {scoreData.recommendation}
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessment.details.map((detail: any, index: number) => (
                  <Card key={index} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{detail.category}</CardTitle>
                        {detail.status === 'excellent' ? 
                          <CheckCircle className="h-4 w-4 text-green-500" /> : 
                          detail.status === 'good' ?
                          <AlertTriangle className="h-4 w-4 text-yellow-500" /> :
                          <XCircle className="h-4 w-4 text-red-500" />
                        }
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{detail.item}:</span>
                          <span className="font-mono">{detail.points} pts</span>
                        </div>
                        <Progress value={(detail.points / (detail.category === 'Profitability' || detail.category === 'Collateral' ? 15 : detail.category === 'Experience' ? 20 : 10)) * 100} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This assessment is based on financial ratios, loan structure, and CAD-specific criteria. 
              Final approval requires complete documentation review and credit committee approval.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
