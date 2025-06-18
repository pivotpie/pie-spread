
import React from 'react';
import { TrendChart } from '@/components/TrendChart';

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

interface TrendAnalysisTabProps {
  data: FinancialData;
  years: number[];
}

export const TrendAnalysisTab: React.FC<TrendAnalysisTabProps> = ({ data, years }) => {
  return (
    <div id="trend-analysis" className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
      <TrendChart data={data} years={years} />
    </div>
  );
};
