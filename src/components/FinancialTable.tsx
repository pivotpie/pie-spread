
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface FinancialItem {
  field_name: string;
  value: number;
  currency: string;
  year: number;
  confidence_score: number;
}

interface FinancialTableProps {
  data: FinancialItem[];
  title: string;
}

export const FinancialTable: React.FC<FinancialTableProps> = ({ data, title }) => {
  const formatCurrency = (value: number) => {
    return `${(value / 1000000).toFixed(2)}M`;
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 0.9) return <Badge variant="default" className="bg-green-500">High</Badge>;
    if (score >= 0.8) return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="destructive">Low</Badge>;
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Field</TableHead>
            <TableHead className="text-right">Value (AED)</TableHead>
            <TableHead className="text-center">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-sm">
                {item.field_name}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatCurrency(item.value)}
              </TableCell>
              <TableCell className="text-center">
                {getConfidenceBadge(item.confidence_score)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
