import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  Star,
  Calendar,
  TrendingUp as TrendUp,
  Settings,
  BarChart3,
  PieChart,
  Info
} from 'lucide-react';
import { EditableLoanForm } from './EditableLoanForm';
import { PayabilityScoreVisualization } from './PayabilityScoreVisualization';
import { ScoringBreakdownModal } from './ScoringBreakdownModal';

interface EnhancedRatios {
  currentRatio: { value: number; isReliable: boolean };
  quickRatio: { value: number; isReliable: boolean };
  debtToEquity: { value: number; isReliable: boolean };
  grossProfitMargin: { value: number; isReliable: boolean };
  netProfitMargin: { value: number; isReliable: boolean };
  returnOnAssets: { value: number; isReliable: boolean };
  returnOnEquity: { value: number; isReliable: boolean };
  interestCoverage: { value: number; isReliable: boolean };
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
  // Add financial data for loan calculation
  totalRevenue?: number;
  netProfit?: number;
  existingDebts?: number;
}

export const LoanEligibilityScore: React.FC<LoanEligibilityScoreProps> = ({ 
  ratios, 
  year, 
  totalRevenue = 5000000,  // Default 5M AED (more realistic)
  netProfit = 500000,      // Default 500K AED (10% margin)
  existingDebts = 1000000  // Default 1M AED (20% of revenue)
}) => {
  console.log('LoanEligibilityScore rendering with ratios:', ratios, 'year:', year);
  
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showScoringModal, setShowScoringModal] = useState(false);
  const [loanAmount, setLoanAmount] = useState([0]);
  const [interestRate, setInterestRate] = useState([0]);
  const [repaymentTerm, setRepaymentTerm] = useState([0]);

  // Enhanced scoring algorithm that includes AECB data
  const calculateEnhancedScore = () => {
    let score = 0;
    let maxScore = 0;
    const factors: Array<{ name: string; score: number; maxScore: number; actualContribution: number }> = [];

    // Financial Ratios (60% weight when AECB available, 100% when not)
    const hasAECB = ratios.aecbScore !== undefined;
    const financialWeight = hasAECB ? 0.6 : 1.0;

    // Current Ratio (Liquidity)
    if (ratios.currentRatio.isReliable) {
      const currentRatioScore = Math.min(Math.max((ratios.currentRatio.value - 0.5) * 20, 0), 20);
      const actualContribution = currentRatioScore * financialWeight;
      factors.push({ 
        name: 'Current Ratio', 
        score: currentRatioScore, 
        maxScore: 20, 
        actualContribution 
      });
      score += actualContribution;
    }
    maxScore += 20 * financialWeight;

    // Debt-to-Equity (Leverage)
    if (ratios.debtToEquity.isReliable) {
      const debtEquityScore = Math.max(20 - (ratios.debtToEquity.value * 5), 0);
      const actualContribution = debtEquityScore * financialWeight;
      factors.push({ 
        name: 'Debt-to-Equity', 
        score: debtEquityScore, 
        maxScore: 20, 
        actualContribution 
      });
      score += actualContribution;
    }
    maxScore += 20 * financialWeight;

    // Profitability
    if (ratios.netProfitMargin.isReliable) {
      const profitabilityScore = Math.min(Math.max(ratios.netProfitMargin.value * 2, 0), 15);
      const actualContribution = profitabilityScore * financialWeight;
      factors.push({ 
        name: 'Net Profit Margin', 
        score: profitabilityScore, 
        maxScore: 15, 
        actualContribution 
      });
      score += actualContribution;
    }
    maxScore += 15 * financialWeight;

    // Return on Assets
    if (ratios.returnOnAssets.isReliable) {
      const roaScore = Math.min(Math.max(ratios.returnOnAssets.value * 1.5, 0), 15);
      const actualContribution = roaScore * financialWeight;
      factors.push({ 
        name: 'Return on Assets', 
        score: roaScore, 
        maxScore: 15, 
        actualContribution 
      });
      score += actualContribution;
    }
    maxScore += 15 * financialWeight;

    // AECB Factors (40% weight when available)
    if (hasAECB) {
      const aecbWeight = 0.4;

      // AECB Credit Score (most important factor)
      if (ratios.aecbScore) {
        const aecbScore = ((ratios.aecbScore - 300) / (850 - 300)) * 25; // Normalize to 0-25
        const actualContribution = Math.max(aecbScore, 0) * aecbWeight;
        factors.push({ 
          name: 'AECB Credit Score', 
          score: Math.max(aecbScore, 0), 
          maxScore: 25, 
          actualContribution 
        });
        score += actualContribution;
      }
      maxScore += 25 * aecbWeight;

      // Payment Performance
      if (ratios.paymentPerformance !== undefined) {
        const paymentScore = (ratios.paymentPerformance / 100) * 20;
        const actualContribution = paymentScore * aecbWeight;
        factors.push({ 
          name: 'Payment Performance', 
          score: paymentScore, 
          maxScore: 20, 
          actualContribution 
        });
        score += actualContribution;
      }
      maxScore += 20 * aecbWeight;

      // Credit Utilization (lower is better)
      if (ratios.creditUtilization !== undefined) {
        const utilizationScore = Math.max(15 - (ratios.creditUtilization / 100) * 15, 0);
        const actualContribution = utilizationScore * aecbWeight;
        factors.push({ 
          name: 'Credit Utilization', 
          score: utilizationScore, 
          maxScore: 15, 
          actualContribution 
        });
        score += actualContribution;
      }
      maxScore += 15 * aecbWeight;

      // Negative Factors (deductions)
      if (ratios.negativeFactors) {
        let negativeDeduction = 0;
        negativeDeduction += ratios.negativeFactors.bouncedChecks * 2; // 2 points per bounced check
        negativeDeduction += ratios.negativeFactors.legalCases * 3; // 3 points per legal case
        if (ratios.negativeFactors.restructuring) negativeDeduction += 5; // 5 points for restructuring

        const actualContribution = -negativeDeduction * aecbWeight;
        factors.push({ 
          name: 'Negative Factors', 
          score: -negativeDeduction, 
          maxScore: 0, 
          actualContribution 
        });
        score += actualContribution;
      }
    }

    const finalScore = maxScore > 0 ? Math.max((score / maxScore) * 100, 0) : 0;
    
    return {
      score: Math.min(finalScore, 100),
      factors,
      hasAECB,
      totalActualScore: score,
      totalMaxScore: maxScore
    };
  };

  const { score, factors, hasAECB, totalActualScore, totalMaxScore } = calculateEnhancedScore();
  console.log('Calculated score:', score, 'hasAECB:', hasAECB);

  // Loan amount calculation using the new Max formula - no rounding of intermediate values
  const getLoanAmount = (score: number) => {
    // Apply the user's updated formula: Max(40% of revenue, 3x net profit) - existing debts
    const revenueComponent = totalRevenue * 0.4; // 40% of revenue
    const profitComponent = netProfit * 3; // 3x net profit
    const maxComponent = Math.max(revenueComponent, profitComponent); // Take the maximum
    const calculatedAmount = maxComponent - existingDebts;
    
    // Ensure minimum loan amount of 100K AED
    const recommendedAmount = Math.max(calculatedAmount, 100000);
    
    return {
      amount: recommendedAmount, // Remove rounding
      revenueComponent,
      profitComponent,
      maxComponent,
      existingDebts,
      calculatedAmount // Remove rounding
    };
  };

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

  const getLoanRate = (score: number) => {
    // Interest rate between 6% and 18% based on score
    const maxRate = 18;
    const minRate = 6;
    const rate = maxRate - ((score / 100) * (maxRate - minRate));
    return Math.round(rate * 10) / 10; // Round to 1 decimal place
  };

  const getLoanTerm = (score: number) => {
    // Term between 1 and 5 years based on score
    return Math.max(Math.min(Math.ceil(score / 20), 5), 1);
  };

  const formatCurrency = (amount: number) => {
    return `AED ${(amount / 1000000).toFixed(2)}M`;
  };

  const formatCurrencyK = (amount: number) => {
    if (amount >= 1000000) {
      return `AED ${(amount / 1000000).toFixed(2)}M`;
    }
    return `AED ${(amount / 1000).toFixed(0)}K`;
  };

  const calculateEMI = (principal: number, rate: number, term: number) => {
    const monthlyRate = rate / 100 / 12;
    const months = term * 12;
    if (monthlyRate === 0) return principal / months;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  };

  const generateFinancialHealthData = () => {
    const periods = Array.from({ length: 12 }, (_, i) => {
      const period = `${year - 5 + i}`;
      let healthScore = 50; // Base score
      
      // Adjust based on current ratios with some variation for historical data
      if (ratios.currentRatio.isReliable && ratios.currentRatio.value > 1) {
        healthScore += Math.min((ratios.currentRatio.value - 1) * 15, 20);
      }
      
      if (ratios.netProfitMargin.isReliable && ratios.netProfitMargin.value > 0) {
        healthScore += Math.min(ratios.netProfitMargin.value * 1.5, 15);
      }

      if (ratios.debtToEquity.isReliable) {
        healthScore -= Math.min(ratios.debtToEquity.value * 8, 20);
      }

      // Add variation for different periods
      if (i < 6) { // Historical data
        healthScore += (Math.random() - 0.5) * 20; // ±10 variation
      } else if (i === 5) { // Current year
        // Keep close to calculated score
        healthScore = score;
      } else { // Future projections
        healthScore += (i - 5) * 2; // Slight improvement trend
        healthScore += (Math.random() - 0.5) * 10; // ±5 variation
      }

      // Ensure score is between 0 and 100
      healthScore = Math.max(0, Math.min(100, healthScore));

      return {
        period,
        score: Math.round(healthScore),
        isCurrent: i === 5,
        isProjected: i > 5
      };
    });

    return periods;
  };

  const financialHealthData = generateFinancialHealthData();
  const recommendation = getRecommendation(score, hasAECB);
  const loanCalculation = getLoanAmount(score);
  const suggestedRate = getLoanRate(score);
  const suggestedTerm = getLoanTerm(score);

  // Initialize sliders with suggested values
  useEffect(() => {
    setLoanAmount([loanCalculation.amount]);
    setInterestRate([suggestedRate]);
    setRepaymentTerm([suggestedTerm]);
  }, [loanCalculation.amount, suggestedRate, suggestedTerm]);

  const currentLoanAmount = loanAmount[0] || loanCalculation.amount;
  const currentInterestRate = interestRate[0] || suggestedRate;
  const currentRepaymentTerm = repaymentTerm[0] || suggestedTerm;
  const monthlyEMI = calculateEMI(currentLoanAmount, currentInterestRate, currentRepaymentTerm);

  console.log('Loan calculation details:', loanCalculation);
  console.log('Current loan settings:', { currentLoanAmount, currentInterestRate, currentRepaymentTerm, monthlyEMI });

  const handleLoanParamsChange = (params: any) => {
    // This function can be used for additional loan parameter changes if needed
  };

  return (
    <div className="p-8 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent mb-2">
          {hasAECB ? 'Enhanced' : 'Basic'} Loan Eligibility Assessment
        </h2>
        <p className="text-slate-600 text-lg">
          {hasAECB ? 'Comprehensive analysis including AECB credit bureau data' : 'Financial analysis based on statements only'}
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* CAD Loan Eligibility Score */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                CAD Loan Eligibility Score
              </CardTitle>
              <CardDescription className="text-slate-600">
                Assessment for year {year}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
                {score.toFixed(0)}
                <span className="text-2xl text-slate-500">/100</span>
              </div>
              <div className="mb-4">
                {getScoreBadge(score)}
              </div>
              <Progress value={score} className="mb-4 h-3" />
              <Alert className="mb-4">
                {recommendation.icon}
                <AlertDescription className="text-sm font-medium">
                  {recommendation.message}
                </AlertDescription>
              </Alert>
              <div className="text-slate-600 text-sm mb-4">
                Highly recommended for CAD limit approval and competitive terms
              </div>
              <Button 
                onClick={() => setShowScoringModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                View Scoring Details
              </Button>
            </CardContent>
          </Card>

          {/* Loan Parameters */}
          <Card className="bg-white/90 border-2 border-blue-100 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                Loan Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Loan Amount (AED)</label>
                  <span className="text-sm font-bold text-slate-900">{formatCurrencyK(currentLoanAmount)}</span>
                </div>
                <Slider
                  value={loanAmount}
                  onValueChange={setLoanAmount}
                  max={5000000}
                  min={100000}
                  step={50000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>AED 100K</span>
                  <span>AED 5M</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Interest Rate (% per annum)</label>
                  <span className="text-sm font-bold text-slate-900">{currentInterestRate.toFixed(1)}%</span>
                </div>
                <Slider
                  value={interestRate}
                  onValueChange={setInterestRate}
                  max={20}
                  min={5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Repayment Term (Years)</label>
                  <span className="text-sm font-bold text-slate-900">{currentRepaymentTerm}</span>
                </div>
                <Slider
                  value={repaymentTerm}
                  onValueChange={setRepaymentTerm}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1 Year</span>
                  <span>10 Years</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Suggested Loan Amount */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <DollarSign className="h-6 w-6 text-green-500" />
                Suggested Loan Amount
              </CardTitle>
              <CardDescription className="text-slate-600">
                Based on formula: Max(40% of revenue, 3x net profit) - existing debts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-4">
                  {formatCurrency(loanCalculation.amount)} @ {suggestedRate}%
                </div>
                <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-slate-600">40% of Revenue:</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyK(loanCalculation.revenueComponent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">3x Net Profit:</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyK(loanCalculation.profitComponent)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-slate-600">Max Component:</span>
                    <span className="font-bold text-blue-600">{formatCurrencyK(loanCalculation.maxComponent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Less: Existing Debts:</span>
                    <span className="font-semibold text-red-600">-{formatCurrencyK(loanCalculation.existingDebts)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-slate-600">Calculated Amount:</span>
                    <span className="font-bold text-slate-900">{formatCurrencyK(loanCalculation.calculatedAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Suggested Term:</span>
                    <span className="font-semibold text-slate-900">{suggestedTerm} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Est. Monthly EMI:</span>
                    <span className="font-semibold text-slate-900">{formatCurrencyK(calculateEMI(loanCalculation.amount, suggestedRate, suggestedTerm))}</span>
                  </div>
                </div>
                {hasAECB && ratios.aecbScore && (
                  <div className="mt-4">
                    <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
                      <CreditCard className="h-4 w-4 mr-1" />
                      AECB Score: {ratios.aecbScore}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Loan Payability Analysis */}
          <Card className="bg-white/90 border-2 border-green-100 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-500" />
                Loan Payability Analysis
              </CardTitle>
              <CardDescription className="text-slate-600">
                Current loan configuration assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {formatCurrencyK(monthlyEMI)}
                </div>
                <div className="text-sm text-slate-600">Monthly Amount</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{formatCurrencyK(currentLoanAmount)}</div>
                  <div className="text-xs text-slate-600">Loan Amount</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{currentInterestRate.toFixed(1)}%</div>
                  <div className="text-xs text-slate-600">Interest Rate</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{currentRepaymentTerm} yrs</div>
                  <div className="text-xs text-slate-600">Term</div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Interest:</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrencyK((monthlyEMI * currentRepaymentTerm * 12) - currentLoanAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Payable:</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrencyK(monthlyEMI * currentRepaymentTerm * 12)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Payability Score Visualization - replacing Financial Health Timeline */}
      <PayabilityScoreVisualization
        ratios={ratios}
        loanAmount={currentLoanAmount}
        interestRate={currentInterestRate}
        termYears={currentRepaymentTerm}
        monthlyEMI={monthlyEMI}
      />

      {/* Scoring Breakdown Modal */}
      <ScoringBreakdownModal
        isOpen={showScoringModal}
        onClose={() => setShowScoringModal(false)}
        factors={factors}
        totalActualScore={totalActualScore}
        totalMaxScore={totalMaxScore}
        hasAECB={hasAECB}
      />
    </div>
  );
};
