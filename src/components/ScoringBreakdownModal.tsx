
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ScoringFactor {
  name: string;
  score: number;
  maxScore: number;
  actualContribution: number;
}

interface ScoringBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  factors: ScoringFactor[];
  totalActualScore: number;
  totalMaxScore: number;
  hasAECB: boolean;
}

export const ScoringBreakdownModal: React.FC<ScoringBreakdownModalProps> = ({
  isOpen,
  onClose,
  factors,
  totalActualScore,
  totalMaxScore,
  hasAECB
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Scoring Breakdown</DialogTitle>
          <DialogDescription>
            Detailed analysis of factors contributing to the eligibility score
            <div className="mt-2 text-sm text-slate-500">
              Total Score: {totalActualScore.toFixed(1)} out of {totalMaxScore.toFixed(1)} possible points
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {factors.map((factor, index) => {
              const contributionPercentage = totalMaxScore > 0 ? (factor.actualContribution / totalMaxScore) * 100 : 0;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-900">{factor.name}</div>
                    <div className="text-sm text-slate-600">
                      Contribution: {contributionPercentage.toFixed(1)}% of total score
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      {factor.actualContribution.toFixed(1)}
                    </div>
                    <div className="text-sm text-slate-500">
                      ({factor.score.toFixed(1)}/{factor.maxScore} raw)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-2">Scoring Method:</div>
            <div className="text-sm text-slate-700">
              {hasAECB ? (
                "Financial ratios weighted at 60%, AECB factors at 40%. Each factor contributes proportionally to the final score out of 100."
              ) : (
                "Financial ratios only (100% weight). AECB data not available - consider obtaining for enhanced assessment."
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
