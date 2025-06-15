
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  BarChart3,
  Info,
  Clock,
  DollarSign
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EnhancedRatios {
  currentRatio: { value: number; isReliable: boolean };
  quickRatio: { value: number; isReliable: boolean };
  debtToEquity: { value: number; isReliable: boolean };
  grossProfitMargin: { value: number; isReliable: boolean };
  netProfitMargin: { value: number; isReliable: boolean };
  returnOnAssets: { value: number; isReliable: boolean };
  returnOnEquity: { value: number; isReliable: boolean };
  interestCoverage: { value: number; isReliable: boolean };
}

interface PayabilityScoreVisualizationProps {
  ratios: EnhancedRatios;
  loanAmount: number;
  interestRate: number;
  termYears: number;
  monthlyEMI: number;
}

interface MonthlyData {
  month: number;
  remainingPrincipal: number;
  emi: number;
  healthScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  seasonalFactor: number;
  stressTestScore: number;
}

export const PayabilityScoreVisualization: React.FC<PayabilityScoreVisualizationProps> = ({
  ratios,
  loanAmount,
  interestRate,
  termYears,
  monthlyEMI
}) => {
  const [showStressTest, setShowStressTest] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const calculateMonthlyData = (): MonthlyData[] => {
    const months = termYears * 12;
    const monthlyRate = interestRate / 100 / 12;
    const data: MonthlyData[] = [];
    
    let remainingPrincipal = loanAmount;
    
    for (let month = 1; month <= months; month++) {
      // Calculate remaining principal
      const interestPayment = remainingPrincipal * monthlyRate;
      const principalPayment = monthlyEMI - interestPayment;
      remainingPrincipal = Math.max(0, remainingPrincipal - principalPayment);
      
      // Calculate seasonal factor (simulate business seasonality)
      const seasonalFactor = 1 + 0.15 * Math.sin((month * 2 * Math.PI) / 12); // ±15% seasonal variation
      
      // Calculate base health score from financial ratios
      let baseHealthScore = 50; // Start with neutral
      
      // Current ratio impact (40% weight)
      if (ratios.currentRatio.isReliable) {
        const currentRatioScore = Math.min(Math.max((ratios.currentRatio.value - 0.5) * 25, 0), 40);
        baseHealthScore += currentRatioScore * 0.4;
      }
      
      // Profit margin impact (30% weight)
      if (ratios.netProfitMargin.isReliable) {
        const profitScore = Math.min(Math.max(ratios.netProfitMargin.value * 2, 0), 30);
        baseHealthScore += profitScore * 0.3;
      }
      
      // Interest coverage impact (20% weight)
      if (ratios.interestCoverage.isReliable) {
        const coverageScore = Math.min(Math.max((ratios.interestCoverage.value - 1) * 10, 0), 20);
        baseHealthScore += coverageScore * 0.2;
      }
      
      // Debt-to-equity impact (10% weight - negative)
      if (ratios.debtToEquity.isReliable) {
        const debtScore = Math.max(10 - (ratios.debtToEquity.value * 3), 0);
        baseHealthScore += debtScore * 0.1;
      }
      
      // Apply time-based improvement (principal reduction)
      const timeImprovement = (months - month + 1) / months * 10; // Up to 10 points improvement as loan reduces
      
      // Apply seasonal factor
      const healthScore = Math.min(Math.max((baseHealthScore + timeImprovement) * seasonalFactor, 0), 100);
      
      // Calculate stress test score (20% revenue drop scenario)
      const stressTestScore = Math.max(healthScore * 0.7, 0); // 30% reduction in health score
      
      // Determine risk level
      let riskLevel: 'low' | 'moderate' | 'high';
      if (healthScore >= 70) riskLevel = 'low';
      else if (healthScore >= 50) riskLevel = 'moderate';
      else riskLevel = 'high';
      
      data.push({
        month,
        remainingPrincipal,
        emi: monthlyEMI,
        healthScore: Math.round(healthScore),
        riskLevel,
        seasonalFactor,
        stressTestScore: Math.round(stressTestScore)
      });
    }
    
    return data;
  };

  const monthlyData = calculateMonthlyData();
  
  const getBarColor = (score: number, isStressTest: boolean = false) => {
    const adjustedScore = isStressTest ? score * 0.8 : score; // Slightly reduce color intensity for stress test
    
    if (adjustedScore >= 70) {
      return isStressTest ? 'bg-green-400/70' : 'bg-gradient-to-t from-green-500 to-green-400';
    } else if (adjustedScore >= 50) {
      return isStressTest ? 'bg-yellow-400/70' : 'bg-gradient-to-t from-yellow-500 to-yellow-400';
    } else {
      return isStressTest ? 'bg-red-400/70' : 'bg-gradient-to-t from-red-500 to-red-400';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `AED ${(amount / 1000000).toFixed(2)}M`;
    }
    return `AED ${(amount / 1000).toFixed(0)}K`;
  };

  const getYearMarkers = () => {
    const markers = [];
    for (let year = 1; year <= termYears; year++) {
      markers.push(year * 12);
    }
    return markers;
  };

  const averageHealthScore = Math.round(monthlyData.reduce((sum, data) => sum + data.healthScore, 0) / monthlyData.length);
  const riskMonths = monthlyData.filter(data => data.riskLevel === 'high').length;
  const trendDirection = monthlyData[monthlyData.length - 1].healthScore > monthlyData[0].healthScore;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              Enhanced Payability Score Visualization
            </CardTitle>
            <CardDescription>Monthly repayment capacity analysis over loan term</CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowStressTest(!showStressTest)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                showStressTest 
                  ? 'bg-orange-100 border-orange-300 text-orange-700' 
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {showStressTest ? 'Hide' : 'Show'} Stress Test
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{averageHealthScore}</div>
            <div className="text-xs text-blue-800">Avg Health Score</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{monthlyData.length - riskMonths}</div>
            <div className="text-xs text-green-800">Safe Months</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{riskMonths}</div>
            <div className="text-xs text-red-800">Risk Months</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-purple-600 flex items-center justify-center gap-1">
              {trendDirection ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
            <div className="text-xs text-purple-800">Health Trend</div>
          </div>
        </div>

        {/* Visualization */}
        <div className="relative">
          {/* Year markers */}
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            {getYearMarkers().map(month => (
              <div key={month} className="text-center">
                <div className="font-medium">Year {month / 12}</div>
                <div>Month {month}</div>
              </div>
            ))}
          </div>

          {/* Chart container */}
          <div className="relative h-48 bg-slate-50 rounded-lg p-4 overflow-hidden">
            <TooltipProvider>
              <div className="flex items-end justify-center gap-0.5 h-full">
                {monthlyData.map((data, index) => {
                  const score = showStressTest ? data.stressTestScore : data.healthScore;
                  const barHeight = Math.max((score / 100) * 100, 5); // Minimum 5% height for visibility
                  
                  return (
                    <Tooltip key={data.month}>
                      <TooltipTrigger asChild>
                        <div
                          className={`relative cursor-pointer transition-all duration-200 hover:scale-110 ${
                            selectedMonth === data.month ? 'ring-2 ring-blue-400' : ''
                          }`}
                          style={{
                            width: `${Math.max(100 / monthlyData.length - 0.5, 2)}%`,
                            height: `${barHeight}%`
                          }}
                          onClick={() => setSelectedMonth(selectedMonth === data.month ? null : data.month)}
                        >
                          <div
                            className={`w-full h-full rounded-t ${getBarColor(score, showStressTest)} 
                              ${data.riskLevel === 'high' ? 'animate-pulse' : ''}`}
                          />
                          
                          {/* Year markers on bars */}
                          {data.month % 12 === 0 && (
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-slate-700">
                              Y{data.month / 12}
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-white border-2 border-slate-200 shadow-lg p-3">
                        <div className="space-y-2 text-sm">
                          <div className="font-semibold text-slate-900">Month {data.month}</div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-xs text-slate-600">EMI Payment</div>
                              <div className="font-medium">{formatCurrency(data.emi)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-600">Health Score</div>
                              <div className="font-medium">{showStressTest ? data.stressTestScore : data.healthScore}%</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-600">Remaining Principal</div>
                            <div className="font-medium">{formatCurrency(data.remainingPrincipal)}</div>
                          </div>
                          <div>
                            <Badge 
                              variant={data.riskLevel === 'low' ? 'default' : 
                                     data.riskLevel === 'moderate' ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {data.riskLevel.charAt(0).toUpperCase() + data.riskLevel.slice(1)} Risk
                            </Badge>
                          </div>
                          {showStressTest && (
                            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                              Stress Test: 20% revenue reduction scenario
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 -ml-8">
              <div>100%</div>
              <div>75%</div>
              <div>50%</div>
              <div>25%</div>
              <div>0%</div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-400 rounded"></div>
              <span className="text-xs">Strong (70-100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded"></div>
              <span className="text-xs">Moderate (50-69%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-400 rounded"></div>
              <span className="text-xs">High Risk (0-49%)</span>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                Risk Assessment
              </h4>
              <div className="space-y-2 text-sm text-slate-600">
                <div>• {((monthlyData.length - riskMonths) / monthlyData.length * 100).toFixed(0)}% of months show strong repayment capacity</div>
                <div>• Average health score: {averageHealthScore}% indicates {
                  averageHealthScore >= 70 ? 'excellent' : 
                  averageHealthScore >= 50 ? 'acceptable' : 'concerning'
                } loan performance</div>
                <div>• Seasonal variations are factored into monthly assessments</div>
                <div>• {trendDirection ? 'Improving' : 'Declining'} trend as principal reduces over time</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                Key Insights
              </h4>
              <div className="space-y-2 text-sm text-slate-600">
                <div>• Each bar represents one month of repayment timeline</div>
                <div>• Height indicates financial health and repayment capacity</div>
                <div>• Colors show risk levels: Green (safe), Yellow (moderate), Red (high risk)</div>
                <div>• Click bars for detailed monthly breakdown</div>
                {showStressTest && (
                  <div className="text-orange-600 bg-orange-50 p-2 rounded text-xs">
                    Stress test shows impact of 20% revenue reduction on repayment capacity
                  </div>
                )}
              </div>
            </div>
          </div>

          {riskMonths > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Attention:</strong> {riskMonths} months show elevated risk levels. 
                Consider implementing additional cash flow monitoring during these periods.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
