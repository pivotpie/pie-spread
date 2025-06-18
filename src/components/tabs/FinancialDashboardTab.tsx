
import React from 'react';
import { FinancialCharts } from '@/components/FinancialCharts';

interface FinancialItem {
  field_name: string;
  value: number;
  currency: string;
  year: number;
  confidence_score: number;
}

interface FinancialData {
  "Balance Sheet": FinancialItem[];
  "Income Statement": FinancialItem[];
  "Cash Flow Statement": FinancialItem[];
}

interface FinancialDashboardTabProps {
  data: FinancialData;
  selectedYear: number;
  years: number[];
  currentRatios: any;
}

export const FinancialDashboardTab: React.FC<FinancialDashboardTabProps> = ({ 
  data, 
  selectedYear, 
  years, 
  currentRatios 
}) => {
  return (
    <div id="financial-dashboard" className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
      <FinancialCharts data={data} selectedYear={selectedYear} years={years} currentRatios={currentRatios} />
    </div>
  );
};
