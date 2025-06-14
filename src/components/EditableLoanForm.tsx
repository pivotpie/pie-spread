
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Calculator, RotateCcw } from 'lucide-react';

interface EditableLoanFormProps {
  suggestedAmount: number;
  suggestedRate: number;
  suggestedTerm: number;
  onLoanParamsChange: (params: {
    loanAmount: number;
    interestRate: number;
    repaymentTermYears: number;
    monthlyEMI: number;
  }) => void;
}

export const EditableLoanForm: React.FC<EditableLoanFormProps> = ({
  suggestedAmount,
  suggestedRate,
  suggestedTerm,
  onLoanParamsChange
}) => {
  const [loanAmount, setLoanAmount] = useState(suggestedAmount);
  const [interestRate, setInterestRate] = useState(suggestedRate);
  const [repaymentTermYears, setRepaymentTermYears] = useState(suggestedTerm);
  const [monthlyEMI, setMonthlyEMI] = useState(0);

  const calculateEMI = (amount: number, rate: number, term: number) => {
    const monthlyRate = rate / 100 / 12;
    const totalMonths = term * 12;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(emi);
  };

  useEffect(() => {
    const newEMI = calculateEMI(loanAmount, interestRate, repaymentTermYears);
    setMonthlyEMI(newEMI);
    onLoanParamsChange({
      loanAmount,
      interestRate,
      repaymentTermYears,
      monthlyEMI: newEMI
    });
  }, [loanAmount, interestRate, repaymentTermYears, onLoanParamsChange]);

  const resetToDefaults = () => {
    setLoanAmount(suggestedAmount);
    setInterestRate(suggestedRate);
    setRepaymentTermYears(suggestedTerm);
  };

  return (
    <Card className="bg-white border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-900">Loan Parameters</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="text-blue-600 hover:text-blue-700"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset to Suggested
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="loan-amount" className="text-sm font-medium text-gray-700">
            Loan Amount (AED)
          </Label>
          <Input
            id="loan-amount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="text-lg font-semibold"
            min="10000"
            max="5000000"
            step="1000"
          />
          <div className="mt-2">
            <Slider
              value={[loanAmount]}
              onValueChange={(value) => setLoanAmount(value[0])}
              max={500000}
              min={10000}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>AED 10K</span>
              <span>AED 500K</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest-rate" className="text-sm font-medium text-gray-700">
            Interest Rate (% per annum)
          </Label>
          <Input
            id="interest-rate"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="text-lg font-semibold"
            min="3"
            max="25"
            step="0.1"
          />
          <div className="mt-2">
            <Slider
              value={[interestRate]}
              onValueChange={(value) => setInterestRate(value[0])}
              max={25}
              min={3}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>3%</span>
              <span>25%</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="repayment-term" className="text-sm font-medium text-gray-700">
            Repayment Term (Years)
          </Label>
          <Input
            id="repayment-term"
            type="number"
            value={repaymentTermYears}
            onChange={(e) => setRepaymentTermYears(Number(e.target.value))}
            className="text-lg font-semibold"
            min="1"
            max="10"
            step="1"
          />
          <div className="mt-2">
            <Slider
              value={[repaymentTermYears]}
              onValueChange={(value) => setRepaymentTermYears(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 Year</span>
              <span>10 Years</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Calculated EMI</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            AED {monthlyEMI.toLocaleString()}
          </div>
          <div className="text-sm text-blue-700 mt-1">
            Monthly payment for {repaymentTermYears} years at {interestRate}% interest
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
