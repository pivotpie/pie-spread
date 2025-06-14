
export interface DataQualityIssue {
  type: 'balance_sheet_violation' | 'negative_value' | 'missing_data' | 'unrealistic_ratio';
  field: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  suggestedFix?: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: DataQualityIssue[];
  corrections: Record<string, number>;
}

export const validateFinancialData = (data: any, year: number): ValidationResult => {
  const issues: DataQualityIssue[] = [];
  const corrections: Record<string, number> = {};

  const getValueByField = (statement: string, fieldName: string) => {
    const item = data[statement]?.find((item: any) => 
      item.field_name === fieldName && item.year === year
    );
    return item?.value || 0;
  };

  // Extract key financial figures
  const totalAssets = getValueByField("Balance Sheet", "Total Assets");
  const currentAssets = getValueByField("Balance Sheet", "Current Assets");
  const totalLiabilities = getValueByField("Balance Sheet", "Total Liabilities");
  const currentLiabilities = getValueByField("Balance Sheet", "Current Liabilities");
  const shareholderEquity = getValueByField("Balance Sheet", "Shareholder's Equity");
  const totalRevenue = getValueByField("Income Statement", "Total Revenue");
  const netProfit = getValueByField("Income Statement", "Net Profit");

  console.log(`Data Validation for Year ${year}:`);
  console.log('Total Assets:', totalAssets);
  console.log('Total Liabilities:', totalLiabilities);
  console.log('Shareholder Equity:', shareholderEquity);
  console.log('Balance Check:', totalAssets, '=?=', totalLiabilities + shareholderEquity);

  // 1. Balance Sheet Equation Validation
  const balanceSheetError = Math.abs(totalAssets - (totalLiabilities + shareholderEquity));
  const tolerancePercentage = 0.05; // 5% tolerance
  if (balanceSheetError > totalAssets * tolerancePercentage) {
    issues.push({
      type: 'balance_sheet_violation',
      field: 'Balance Sheet',
      description: `Balance sheet equation violated: Assets (${totalAssets.toFixed(0)}) ≠ Liabilities + Equity (${(totalLiabilities + shareholderEquity).toFixed(0)})`,
      severity: 'high',
      suggestedFix: 'Verify data extraction accuracy or adjust equity calculation'
    });

    // Attempt correction: adjust shareholders equity to balance the equation
    const correctedEquity = totalAssets - totalLiabilities;
    if (correctedEquity > 0) {
      corrections['Shareholder\'s Equity'] = correctedEquity;
      console.log('Suggested Equity Correction:', correctedEquity);
    }
  }

  // 2. Negative Values Check
  const criticalFields = [
    { statement: "Balance Sheet", field: "Total Assets" },
    { statement: "Balance Sheet", field: "Current Assets" },
    { statement: "Income Statement", field: "Total Revenue" }
  ];

  criticalFields.forEach(({ statement, field }) => {
    const value = getValueByField(statement, field);
    if (value < 0) {
      issues.push({
        type: 'negative_value',
        field: field,
        description: `${field} has negative value: ${value}`,
        severity: 'high',
        suggestedFix: 'Check data source for errors'
      });
    }
  });

  // 3. Missing Critical Data
  if (totalAssets === 0 || totalRevenue === 0) {
    issues.push({
      type: 'missing_data',
      field: 'Critical Financial Data',
      description: 'Missing essential financial data for ratio calculations',
      severity: 'high',
      suggestedFix: 'Ensure all required financial statements are properly imported'
    });
  }

  // 4. Unrealistic Ratios Detection
  if (totalLiabilities > 0 && shareholderEquity > 0) {
    const debtToEquity = totalLiabilities / shareholderEquity;
    if (debtToEquity > 10) {
      issues.push({
        type: 'unrealistic_ratio',
        field: 'Debt-to-Equity Ratio',
        description: `Extremely high debt-to-equity ratio: ${debtToEquity.toFixed(2)}`,
        severity: 'medium',
        suggestedFix: 'Review liability and equity classifications'
      });
    }
  }

  // 5. Current Assets vs Current Liabilities
  if (currentAssets > totalAssets) {
    issues.push({
      type: 'balance_sheet_violation',
      field: 'Current Assets',
      description: `Current assets (${currentAssets.toFixed(0)}) exceed total assets (${totalAssets.toFixed(0)})`,
      severity: 'high',
      suggestedFix: 'Verify current assets calculation'
    });
  }

  return {
    isValid: issues.filter(issue => issue.severity === 'high').length === 0,
    issues,
    corrections
  };
};
