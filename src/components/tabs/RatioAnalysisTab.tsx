
import React from 'react';
import { RatioAnalysis } from '@/components/RatioAnalysis';

interface RatioAnalysisTabProps {
  ratios: any;
  year: number;
}

export const RatioAnalysisTab: React.FC<RatioAnalysisTabProps> = ({ ratios, year }) => {
  return (
    <div id="ratio-analysis" className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
      <RatioAnalysis ratios={ratios} year={year} />
    </div>
  );
};
