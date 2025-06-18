
import React from 'react';
import { AECBAnalysis } from '@/components/AECBAnalysis';

interface AECBScoreTabProps {
  data: any;
}

export const AECBScoreTab: React.FC<AECBScoreTabProps> = ({ data }) => {
  return (
    <div id="aecb-score" className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
      <AECBAnalysis data={data} />
    </div>
  );
};
