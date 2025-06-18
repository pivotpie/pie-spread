
import React from 'react';
import { LoanEligibilityScore } from '@/components/LoanEligibilityScore';

interface LoanEligibilityTabProps {
  ratios: any;
  year: number;
}

export const LoanEligibilityTab: React.FC<LoanEligibilityTabProps> = ({ ratios, year }) => {
  return (
    <div id="loan-eligibility" className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      <LoanEligibilityScore ratios={ratios} year={year} />
    </div>
  );
};
