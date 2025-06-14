
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  CreditCard,
  Building,
  Star
} from 'lucide-react';

interface EnhancedRatios {
  currentRatio: { value: number; isReliable: boolean };
  quickRatio: { value: number; isReliable: boolean };
  debtToEquity: { value: number; isReliable: boolean };
  grossProfitMargin: { value: number; isReliable: boolean };
  netProfitMargin: { value: number; isReliable: boolean };
  returnOnAssets: { value: number; isReliable: boolean };
  returnOnEquity: { value: number; isReliable: boolean };
  aecbScore?: number;
  riskGrade?: string;
  paymentPerformance?: number;
  creditUtilization?: number;
  negativeFactors?: {
    bouncedChecks: number;
    legalCases: number;
    restructuring: boolean;
  };
}

interface LoanEligibilityScoreProps {
  ratios: EnhancedRatios;
  year: number;
}

export const LoanEligibilityScore: React.FC<LoanEligibilityScoreProps> = ({ ratios, year }) => {
  // Enhanced scoring algorithm that includes AECB data
  const calculateEnhancedScore = () => {
    let score = 0;
    let maxScore = 0;
    const factors: Array<{ name: string; score: number; maxScore: number; weight: number }> = [];

    // Financial Ratios (60% weight when AECB available, 100% when not)
    const hasAECB = ratios.aecbScore !== undefined;
    const financialWeight = hasAECB ? 0.6 : 1.0;

    // Current Ratio (Liquidity)
    if (ratios.currentRatio.isReliable) {
      const currentRatioScore = Math.min(Math.max((ratios.currentRatio.value - 0.5) * 20, 0), 20);
      factors.push({ name: 'Current Ratio', score: currentRatioScore, maxScore: 20, weight: financialWeight });
      score += currentRatioScore * financialWeight;
    }
    maxScore += 20 * financialWeight;

    // Debt-to-Equity (Leverage)
    if (ratios.debtToEquity.isReliable) {
      const debtEquityScore = Math.max(20 - (ratios.debtToEquity.value * 5), 0);
      factors.push({ name: 'Debt-to-Equity', score: debtEquityScore, maxScore: 20, weight: financialWeight });
      score += debtEquityScore * financialWeight;
    }
    maxScore += 20 * financialWeight;

    // Profitability
    if (ratios.netProfitMargin.isReliable) {
      const profitabilityScore = Math.min(Math.max(ratios.netProfitMargin.value * 2, 0), 15);
      factors.push({ name: 'Net Profit Margin', score: profitabilityScore, maxScore: 15, weight: financialWeight });
      score += profitabilityScore * financialWeight;
    }
    maxScore += 15 * financialWeight;

    // Return on Assets
    if (ratios.returnOnAssets.isReliable) {
      const roaScore = Math.min(Math.max(ratios.returnOnAssets.value * 1.5, 0), 15);
      factors.push({ name: 'Return on Assets', score: roaScore, maxScore: 15, weight: financialWeight });
      score += roaScore * financialWeight;
    }
    maxScore += 15 * financialWeight;

    // AECB Factors (40% weight when available)
    if (hasAECB) {
      const aecbWeight = 0.4;

      // AECB Credit Score (most important factor)
      if (ratios.aecbScore) {
        const aecbScore = ((ratios.aecbScore - 300) / (850 - 300)) * 25; // Normalize to 0-25
        factors.push({ name: 'AECB Credit Score', score: Math.max(aecbScore, 0), maxScore: 25, weight: aecbWeight });
        score += Math.max(aecbScore, 0) * aecbWeight;
      }
      maxScore += 25 * aecbWeight;

      // Payment Performance
      if (ratios.paymentPerformance !== undefined) {
        const paymentScore = (ratios.paymentPerformance / 100) * 20;
        factors.push({ name: 'Payment Performance', score: paymentScore, maxScore: 20, weight: aecbWeight });
        score += paymentScore * aecbWeight;
      }
      maxScore += 20 * aecbWeight;

      // Credit Utilization (lower is better)
      if (ratios.creditUtilization !== undefined) {
        const utilizationScore = Math.max(15 - (ratios.creditUtilization / 100) * 15, 0);
        factors.push({ name: 'Credit Utilization', score: utilizationScore, maxScore: 15, weight: aecbWeight });
        score += utilizationScore * aecbWeight;
      }
      maxScore += 15 * aecbWeight;

      // Negative Factors (deductions)
      if (ratios.negativeFactors) {
        let negativeDeduction = 0;
        negativeDeduction += ratios.negativeFactors.bouncedChecks * 2; // 2 points per bounced check
        negativeDeduction += ratios.negativeFactors.legalCases * 3; // 3 points per legal case
        if (ratios.negativeFactors.restructuring) negativeDeduction += 5; // 5 points for restructuring

        factors.push({ name: 'Negative Factors', score: -negativeDeduction, maxScore: 0, weight: aecbWeight });
        score -= negativeDeduction * aecbWeight;
      }
    }

    const finalScore = maxScore > 0 ? Math.max((score / maxScore) * 100, 0) : 0;
    
    return {
      score: Math.min(finalScore, 100),
      factors,
      hasAECB
    };
  };

  const { score, factors, hasAECB } = calculateEnhancedScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-blue-500">Good</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-500">Fair</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  const getRecommendation = (score: number, hasAECB: boolean) => {
    if (!hasAECB) {
      return {
        message: "Consider obtaining AECB data for more accurate risk assessment",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        type: "warning" as const
      };
    }

    if (score >= 80) {
      return {
        message: "Strong candidate for CAD facility approval",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        type: "success" as const
      };
    }
    if (score >= 60) {
      return {
        message: "Moderate risk - additional collateral recommended",
        icon: <AlertTriangle className="h-5 w-5 text-blue-500" />,
        type: "info" as const
      };
    }
    if (score >= 40) {
      return {
        message: "Higher risk - enhanced due diligence required",
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        type: "warning" as const
      };
    }
    return {
      message: "High risk - facility approval not recommended",
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      type: "error" as const
    };
  };

  const getLoanAmount = (score: number) => {
    const baseAmount = 1000000; // 1M AED base
    const multiplier = Math.max(score / 100 * 3, 0.5); // 0.5x to 3x based on score
    return Math.round(baseAmount * multiplier);
  };

  const formatCurrency = (amount: number) => {
    return `AED ${(amount / 1000000).toFixed(2)}M`;
  };

  const recommendation = getRecommendation(score, hasAECB);
  const suggestedAmount = getLoanAmount(score);

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent mb-2">
          {hasAECB ? 'Enhanced' : 'Basic'} Loan Eligibility Assessment
        </h2>
        <p className="text-slate-600 text-lg">
          {hasAECB ? 'Comprehensive analysis including AECB credit bureau data' : 'Financial analysis based on statements only'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Display */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Eligibility Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
              {score.toFixed(0)}
            </div>
            <div className="mb-4">
              {getScoreBadge(score)}
            </div>
            <Progress value={score} className="mb-4" />
            <div className="text-slate-600 text-sm">
              Based on {hasAECB ? 'financial + credit bureau' : 'financial statements only'} analysis
            </div>
          </CardContent>
        </Card>

        {/* Suggested Loan Amount */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
              <DollarSign className="h-6 w-6 text-green-500" />
              Suggested CAD Limit
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-4">
              {formatCurrency(suggestedAmount)}
            </div>
            {hasAECB && ratios.aecbScore && (
              <div className="mb-4">
                <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
                  <CreditCard className="h-4 w-4 mr-1" />
                  AECB Score: {ratios.aecbScore}
                </Badge>
              </div>
            )}
            <div className="text-slate-600 text-sm">
              Recommended facility limit based on risk assessment
            </div>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-2 border-slate-200 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
              {recommendation.icon}
              Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Alert className="mb-4">
              <AlertDescription className="text-base font-medium">
                {recommendation.message}
              </AlertDescription>
            </Alert>
            {hasAECB && ratios.riskGrade && (
              <div className="mb-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Risk Grade: {ratios.riskGrade}
                </Badge>
              </div>
            )}
            <div className="text-slate-600 text-sm">
              Assessment for year {year}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Scoring Factors */}
      <Card className="mt-8 bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Scoring Breakdown</CardTitle>
          <CardDescription>Detailed analysis of factors contributing to the eligibility score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-900">{factor.name}</div>
                  <div className="text-sm text-slate-600">
                    Weight: {(factor.weight * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">
                    {factor.score.toFixed(1)}/{factor.maxScore}
                  </div>
                  <div className="text-sm text-slate-500">
                    {factor.maxScore > 0 ? ((factor.score / factor.maxScore) * 100).toFixed(0) : '0'}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
