
import { ValidationResult, validateFinancialData } from './dataValidation';

export interface SafeRatioResult {
  value: number;
  isReliable: boolean;
  warning?: string;
}

export interface RobustRatios {
  currentRatio: SafeRatioResult;
  quickRatio: SafeRatioResult;
  debtToEquity: SafeRatioResult;
  grossProfitMargin: SafeRatioResult;
  netProfitMargin: SafeRatioResult;
  operatingMargin: SafeRatioResult;
  ebitdaMargin: SafeRatioResult;
  returnOnAssets: SafeRatioResult;
  returnOnEquity: SafeRatioResult;
  assetTurnover: SafeRatioResult;
  inventoryTurnover: SafeRatioResult;
  interestCoverage: SafeRatioResult;
  debtRatio: SafeRatioResult;
  cashRatio: SafeRatioResult;
  capitalAdequacy: SafeRatioResult;
  dataQuality: ValidationResult;
}

export const calculateRobustRatios = (data: any, year: number): RobustRatios => {
  // First validate the data
  const validation = validateFinancialData(data, year);
  
  const getValueByField = (statement: string, fieldName: string) => {
    const item = data[statement]?.find((item: any) => 
      item.field_name === fieldName && item.year === year
    );
    return item?.value || 0;
  };

  // Helper function to safely calculate ratios with validation
  const safeCalculate = (
    numerator: number, 
    denominator: number, 
    isPercentage: boolean = false,
    ratioName: string = ''
  ): SafeRatioResult => {
    // Handle invalid inputs
    if (!isFinite(numerator) || !isFinite(denominator) || isNaN(numerator) || isNaN(denominator)) {
      return {
        value: 0,
        isReliable: false,
        warning: `Invalid data for ${ratioName} calculation`
      };
    }

    // Handle division by zero
    if (denominator === 0) {
      return {
        value: 0,
        isReliable: false,
        warning: `Cannot calculate ${ratioName} - denominator is zero`
      };
    }

    // Handle negative values where inappropriate
    if (numerator < 0 && ratioName.includes('Margin')) {
      return {
        value: 0,
        isReliable: false,
        warning: `Negative value detected for ${ratioName}`
      };
    }

    const result = numerator / denominator;
    const finalValue = isPercentage ? result * 100 : result;

    // Check for unrealistic values
    let isReliable = true;
    let warning: string | undefined;

    if (isPercentage && (finalValue > 1000 || finalValue < -1000)) {
      isReliable = false;
      warning = `Unusually high value for ${ratioName}: ${finalValue.toFixed(1)}%`;
    } else if (!isPercentage && Math.abs(finalValue) > 100) {
      isReliable = false;
      warning = `Unusually high ratio for ${ratioName}: ${finalValue.toFixed(2)}`;
    }

    return {
      value: finalValue,
      isReliable,
      warning
    };
  };

  // Extract financial data (with potential corrections)
  let totalAssets = getValueByField("Balance Sheet", "Total Assets");
  let currentAssets = getValueByField("Balance Sheet", "Current Assets");
  let currentLiabilities = getValueByField("Balance Sheet", "Current Liabilities");
  let totalLiabilities = getValueByField("Balance Sheet", "Total Liabilities");
  let shareholderEquity = getValueByField("Balance Sheet", "Shareholder's Equity");
  
  // Apply corrections if available
  if (validation.corrections['Shareholder\'s Equity']) {
    shareholderEquity = validation.corrections['Shareholder\'s Equity'];
    console.log('Applied equity correction:', shareholderEquity);
  }

  const totalRevenue = getValueByField("Income Statement", "Total Revenue");
  const netProfit = getValueByField("Income Statement", "Net Profit");
  const grossProfit = getValueByField("Income Statement", "Gross Profit");
  const ebit = getValueByField("Income Statement", "EBIT");
  const ebitda = getValueByField("Income Statement", "EBITDA");
  const interestExpense = getValueByField("Income Statement", "Interest Expense");
  const cogs = getValueByField("Income Statement", "Cost of Goods Sold (COGS)");
  const inventory = getValueByField("Balance Sheet", "Inventory");
  const cashAndEquivalents = getValueByField("Balance Sheet", "Cash and Cash Equivalents");

  return {
    // Liquidity Ratios
    currentRatio: safeCalculate(currentAssets, currentLiabilities, false, 'Current Ratio'),
    quickRatio: safeCalculate(currentAssets - inventory, currentLiabilities, false, 'Quick Ratio'),
    cashRatio: safeCalculate(cashAndEquivalents, currentLiabilities, false, 'Cash Ratio'),
    
    // Leverage Ratios
    debtToEquity: safeCalculate(totalLiabilities, shareholderEquity, false, 'Debt-to-Equity'),
    debtRatio: safeCalculate(totalLiabilities, totalAssets, true, 'Debt Ratio'),
    capitalAdequacy: safeCalculate(shareholderEquity, totalAssets, true, 'Capital Adequacy'),
    
    // Profitability Ratios
    grossProfitMargin: safeCalculate(grossProfit, totalRevenue, true, 'Gross Profit Margin'),
    netProfitMargin: safeCalculate(netProfit, totalRevenue, true, 'Net Profit Margin'),
    operatingMargin: safeCalculate(ebit, totalRevenue, true, 'Operating Margin'),
    ebitdaMargin: safeCalculate(ebitda, totalRevenue, true, 'EBITDA Margin'),
    returnOnAssets: safeCalculate(netProfit, totalAssets, true, 'Return on Assets'),
    returnOnEquity: safeCalculate(netProfit, shareholderEquity, true, 'Return on Equity'),
    
    // Efficiency Ratios
    assetTurnover: safeCalculate(totalRevenue, totalAssets, false, 'Asset Turnover'),
    inventoryTurnover: safeCalculate(cogs, inventory, false, 'Inventory Turnover'),
    interestCoverage: safeCalculate(ebit, interestExpense, false, 'Interest Coverage'),
    
    dataQuality: validation
  };
};
