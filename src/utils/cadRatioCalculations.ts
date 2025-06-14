interface FinancialData {
  totalAssets: number;
  currentAssets: number;
  currentLiabilities: number;
  totalLiabilities: number;
  shareholderEquity: number;
  totalRevenue: number;
  netProfit: number;
  ebitda: number;
  interestExpense: number;
  operatingCashFlow: number;
  inventory: number;
  accountsReceivable: number;
  accountsPayable: number;
  shortTermDebt: number;
  longTermDebt: number;
  workingCapital: number;
}

interface CADSpecificRatios {
  // Liquidity Ratios
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;
  workingCapitalRatio: number;
  
  // Leverage Ratios
  debtToEquity: number;
  debtToAssets: number;
  equityRatio: number;
  timesInterestEarned: number;
  interestCoverageRatio: number;
  
  // Profitability Ratios
  returnOnAssets: number;
  returnOnEquity: number;
  profitMargin: number;
  operatingMargin: number;
  
  // Efficiency Ratios
  assetTurnoverRatio: number;
  receivablesTurnover: number;
  inventoryTurnover: number;
  payablesTurnover: number;
  
  // CAD-Specific Ratios
  tradeFinanceRatio: number;
  documentCoverageRatio: number;
  cashConversionCycle: number;
  debtServiceCoverage: number;
  
  // Risk Assessment Ratios
  concentrationRisk: number;
  volatilityIndex: number;
  creditRiskScore: number;
}

export const calculateCADRatios = (
  currentYear: FinancialData,
  previousYear?: FinancialData,
  tradeData?: {
    averageDailySales: number;
    averageCollectionPeriod: number;
    averagePaymentPeriod: number;
    documentValue: number;
    collateralValue: number;
  }
): CADSpecificRatios => {
  
  // Liquidity Ratios
  const currentRatio = currentYear.currentLiabilities !== 0 
    ? currentYear.currentAssets / currentYear.currentLiabilities 
    : 0;
    
  const quickAssets = currentYear.currentAssets - currentYear.inventory;
  const quickRatio = currentYear.currentLiabilities !== 0 
    ? quickAssets / currentYear.currentLiabilities 
    : 0;
    
  const cashAndEquivalents = currentYear.currentAssets * 0.15; // Assumption
  const cashRatio = currentYear.currentLiabilities !== 0 
    ? cashAndEquivalents / currentYear.currentLiabilities 
    : 0;
    
  const workingCapitalRatio = currentYear.totalAssets !== 0 
    ? currentYear.workingCapital / currentYear.totalAssets 
    : 0;

  // Leverage Ratios
  const debtToEquity = currentYear.shareholderEquity !== 0 
    ? currentYear.totalLiabilities / currentYear.shareholderEquity 
    : 0;
    
  const debtToAssets = currentYear.totalAssets !== 0 
    ? currentYear.totalLiabilities / currentYear.totalAssets 
    : 0;
    
  const equityRatio = currentYear.totalAssets !== 0 
    ? currentYear.shareholderEquity / currentYear.totalAssets 
    : 0;
    
  const timesInterestEarned = currentYear.interestExpense !== 0 
    ? currentYear.ebitda / currentYear.interestExpense 
    : 0;

  const interestCoverageRatio = currentYear.interestExpense !== 0 
    ? currentYear.ebitda / currentYear.interestExpense 
    : 0;

  // Profitability Ratios
  const returnOnAssets = currentYear.totalAssets !== 0 
    ? (currentYear.netProfit / currentYear.totalAssets) * 100 
    : 0;
    
  const returnOnEquity = currentYear.shareholderEquity !== 0 
    ? (currentYear.netProfit / currentYear.shareholderEquity) * 100 
    : 0;
    
  const profitMargin = currentYear.totalRevenue !== 0 
    ? (currentYear.netProfit / currentYear.totalRevenue) * 100 
    : 0;
    
  const operatingMargin = currentYear.totalRevenue !== 0 
    ? (currentYear.ebitda / currentYear.totalRevenue) * 100 
    : 0;

  // Efficiency Ratios
  const assetTurnoverRatio = currentYear.totalAssets !== 0 
    ? currentYear.totalRevenue / currentYear.totalAssets 
    : 0;
    
  const receivablesTurnover = currentYear.accountsReceivable !== 0 
    ? currentYear.totalRevenue / currentYear.accountsReceivable 
    : 0;
    
  const inventoryTurnover = currentYear.inventory !== 0 
    ? currentYear.totalRevenue / currentYear.inventory 
    : 0;
    
  const payablesTurnover = currentYear.accountsPayable !== 0 
    ? currentYear.totalRevenue / currentYear.accountsPayable 
    : 0;

  // CAD-Specific Ratios
  const tradeFinanceRatio = tradeData && currentYear.totalRevenue !== 0
    ? (tradeData.documentValue / currentYear.totalRevenue) * 100
    : 0;
    
  const documentCoverageRatio = tradeData
    ? (tradeData.documentValue / tradeData.collateralValue) * 100
    : 0;
    
  // Cash Conversion Cycle (Days)
  const daysInReceivables = receivablesTurnover !== 0 ? 365 / receivablesTurnover : 0;
  const daysInInventory = inventoryTurnover !== 0 ? 365 / inventoryTurnover : 0;
  const daysInPayables = payablesTurnover !== 0 ? 365 / payablesTurnover : 0;
  const cashConversionCycle = daysInReceivables + daysInInventory - daysInPayables;
  
  const totalDebt = currentYear.shortTermDebt + currentYear.longTermDebt;
  const debtServiceCoverage = totalDebt !== 0 
    ? currentYear.operatingCashFlow / (totalDebt + currentYear.interestExpense)
    : 0;

  // Risk Assessment Ratios
  const concentrationRisk = calculateConcentrationRisk(currentYear);
  const volatilityIndex = previousYear 
    ? calculateVolatilityIndex(currentYear, previousYear)
    : 0;
  const creditRiskScore = calculateCreditRiskScore({
    currentRatio,
    debtToEquity,
    profitMargin,
    debtServiceCoverage,
    assetTurnoverRatio
  });

  return {
    currentRatio,
    quickRatio,
    cashRatio,
    workingCapitalRatio,
    debtToEquity,
    debtToAssets,
    equityRatio,
    timesInterestEarned,
    interestCoverageRatio,
    returnOnAssets,
    returnOnEquity,
    profitMargin,
    operatingMargin,
    assetTurnoverRatio,
    receivablesTurnover,
    inventoryTurnover,
    payablesTurnover,
    tradeFinanceRatio,
    documentCoverageRatio,
    cashConversionCycle,
    debtServiceCoverage,
    concentrationRisk,
    volatilityIndex,
    creditRiskScore
  };
};

const calculateConcentrationRisk = (data: FinancialData): number => {
  // Simplified concentration risk based on receivables to revenue ratio
  const receivablesConcentration = data.totalRevenue !== 0 
    ? (data.accountsReceivable / data.totalRevenue) * 100 
    : 0;
  
  // Risk score: higher percentage indicates higher concentration risk
  return Math.min(receivablesConcentration, 100);
};

const calculateVolatilityIndex = (current: FinancialData, previous: FinancialData): number => {
  const revenueGrowth = previous.totalRevenue !== 0 
    ? Math.abs((current.totalRevenue - previous.totalRevenue) / previous.totalRevenue) * 100 
    : 0;
    
  const profitVolatility = previous.netProfit !== 0 
    ? Math.abs((current.netProfit - previous.netProfit) / previous.netProfit) * 100 
    : 0;
    
  // Average volatility as risk indicator
  return (revenueGrowth + profitVolatility) / 2;
};

const calculateCreditRiskScore = (ratios: {
  currentRatio: number;
  debtToEquity: number;
  profitMargin: number;
  debtServiceCoverage: number;
  assetTurnoverRatio: number;
}): number => {
  let score = 100; // Start with perfect score
  
  // Deduct points for poor ratios
  if (ratios.currentRatio < 1.2) score -= 20;
  else if (ratios.currentRatio < 1.5) score -= 10;
  
  if (ratios.debtToEquity > 3) score -= 25;
  else if (ratios.debtToEquity > 2) score -= 15;
  
  if (ratios.profitMargin < 2) score -= 20;
  else if (ratios.profitMargin < 5) score -= 10;
  
  if (ratios.debtServiceCoverage < 1.0) score -= 25;
  else if (ratios.debtServiceCoverage < 1.5) score -= 15;
  
  if (ratios.assetTurnoverRatio < 0.5) score -= 10;
  
  return Math.max(score, 0);
};

export const getCADLoanRecommendation = (ratios: CADSpecificRatios): {
  recommendation: 'approve' | 'conditional' | 'decline';
  reasons: string[];
  suggestedTerms?: {
    maxAmount: number;
    interestRate: number;
    tenor: number;
    additionalSecurity: boolean;
  };
} => {
  const reasons: string[] = [];
  let score = 0;
  
  // Scoring based on key ratios
  if (ratios.currentRatio >= 1.5) {
    score += 25;
    reasons.push("Strong liquidity position");
  } else if (ratios.currentRatio >= 1.2) {
    score += 15;
    reasons.push("Adequate liquidity");
  } else {
    reasons.push("Weak liquidity position - concern");
  }
  
  if (ratios.debtServiceCoverage >= 2.0) {
    score += 25;
    reasons.push("Excellent debt service capability");
  } else if (ratios.debtServiceCoverage >= 1.5) {
    score += 15;
    reasons.push("Good debt service capability");
  } else {
    reasons.push("Insufficient debt service coverage");
  }
  
  if (ratios.profitMargin >= 8) {
    score += 20;
    reasons.push("Strong profitability");
  } else if (ratios.profitMargin >= 5) {
    score += 12;
    reasons.push("Moderate profitability");
  } else if (ratios.profitMargin < 2) {
    reasons.push("Low profitability - risk factor");
  }
  
  if (ratios.creditRiskScore >= 80) {
    score += 20;
    reasons.push("Low credit risk profile");
  } else if (ratios.creditRiskScore >= 60) {
    score += 10;
    reasons.push("Moderate credit risk");
  } else {
    reasons.push("High credit risk profile");
  }
  
  if (ratios.cashConversionCycle <= 30) {
    score += 10;
    reasons.push("Efficient working capital management");
  } else if (ratios.cashConversionCycle > 60) {
    reasons.push("Extended cash conversion cycle");
  }
  
  // Recommendation logic
  if (score >= 75) {
    return {
      recommendation: 'approve',
      reasons,
      suggestedTerms: {
        maxAmount: 50000000, // AED 50M
        interestRate: 4.5,
        tenor: 12,
        additionalSecurity: false
      }
    };
  } else if (score >= 50) {
    return {
      recommendation: 'conditional',
      reasons,
      suggestedTerms: {
        maxAmount: 25000000, // AED 25M
        interestRate: 6.0,
        tenor: 6,
        additionalSecurity: true
      }
    };
  } else {
    return {
      recommendation: 'decline',
      reasons
    };
  }
};
