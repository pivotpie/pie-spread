
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Building,
  DollarSign,
  Calendar,
  FileText
} from 'lucide-react';

interface AECBData {
  company_info: {
    trade_license: string;
    company_name: string;
    industry: string;
    establishment_date: string;
  };
  credit_profile: {
    aecb_score: number;
    risk_grade: string;
    last_updated: string;
    credit_history_years: number;
  };
  payment_history: {
    total_facilities: number;
    current_facilities: number;
    payment_performance: {
      on_time_payments: number;
      late_payments_30_days: number;
      late_payments_60_days: number;
      late_payments_90_days: number;
      defaults: number;
    };
    payment_trend: string;
  };
  credit_utilization: {
    total_credit_limit: number;
    current_outstanding: number;
    utilization_ratio: number;
    utilization_trend: string;
  };
  facility_details: Array<{
    facility_type: string;
    bank: string;
    limit: number;
    outstanding: number;
    status: string;
    days_past_due: number;
  }>;
  credit_inquiries: {
    last_12_months: number;
    last_6_months: number;
    recent_inquiries: Array<{
      date: string;
      bank: string;
      inquiry_type: string;
    }>;
  };
  negative_information: {
    bounced_checks: number;
    legal_cases: number;
    bankruptcy_history: boolean;
    restructuring_history: boolean;
  };
  guarantor_information: {
    personal_guarantors: number;
    corporate_guarantors: number;
    guarantor_scores: number[];
  };
}

interface AECBAnalysisProps {
  data: AECBData | null;
}

export const AECBAnalysis: React.FC<AECBAnalysisProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-12">
        <CreditCard className="h-16 w-16 mx-auto text-slate-400 mb-4" />
        <p className="text-slate-600 text-lg">No AECB data available</p>
        <p className="text-slate-400 text-sm mt-2">Credit bureau information will be displayed here</p>
      </div>
    );
  }

  const getRiskGradeBadge = (grade: string) => {
    const grades: Record<string, { variant: "default" | "secondary" | "destructive", color: string }> = {
      'A': { variant: 'default', color: 'bg-green-500' },
      'B+': { variant: 'secondary', color: 'bg-blue-500' },
      'B': { variant: 'secondary', color: 'bg-yellow-500' },
      'C+': { variant: 'destructive', color: 'bg-orange-500' },
      'C': { variant: 'destructive', color: 'bg-red-500' }
    };
    const config = grades[grade] || grades['C'];
    return <Badge variant={config.variant} className={config.color}>Grade {grade}</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'Improving') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'Deteriorating') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4 bg-gray-500 rounded-full" />;
  };

  const formatCurrency = (amount: number) => {
    return `AED ${(amount / 1000000).toFixed(2)}M`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Header with Company Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Building className="h-6 w-6" />
              {data.company_info.company_name}
            </h2>
            <p className="text-slate-600 mt-1">
              {data.company_info.industry} • License: {data.company_info.trade_license}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Established: {new Date(data.company_info.establishment_date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(data.credit_profile.aecb_score)}`}>
              {data.credit_profile.aecb_score}
            </div>
            <div className="mt-2">
              {getRiskGradeBadge(data.credit_profile.risk_grade)}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold">Credit Utilization</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {data.credit_utilization.utilization_ratio.toFixed(1)}%
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(data.credit_utilization.utilization_trend)}
              <span className="text-sm text-slate-600">{data.credit_utilization.utilization_trend}</span>
            </div>
            <Progress value={data.credit_utilization.utilization_ratio} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold">Payment Performance</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {data.payment_history.payment_performance.on_time_payments}%
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(data.payment_history.payment_trend)}
              <span className="text-sm text-slate-600">{data.payment_history.payment_trend}</span>
            </div>
            <Progress value={data.payment_history.payment_performance.on_time_payments} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold">Active Facilities</CardTitle>
            <FileText className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {data.payment_history.current_facilities}
            </div>
            <p className="text-sm text-slate-600 mt-2">
              of {data.payment_history.total_facilities} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold">Recent Inquiries</CardTitle>
            <Calendar className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {data.credit_inquiries.last_6_months}
            </div>
            <p className="text-sm text-slate-600 mt-2">
              in last 6 months
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Facility Details */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Banking Facilities</CardTitle>
            <CardDescription>Current credit facilities and outstanding amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.facility_details.map((facility, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-900">{facility.facility_type}</div>
                    <div className="text-sm text-slate-600">{facility.bank}</div>
                    {facility.days_past_due > 0 && (
                      <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        {facility.days_past_due} days past due
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      {formatCurrency(facility.outstanding)}
                    </div>
                    <div className="text-sm text-slate-500">
                      of {formatCurrency(facility.limit)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Risk Assessment</CardTitle>
            <CardDescription>Negative information and risk indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium">Bounced Checks</span>
                <div className="flex items-center gap-2">
                  {data.negative_information.bounced_checks === 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-bold">{data.negative_information.bounced_checks}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium">Legal Cases</span>
                <div className="flex items-center gap-2">
                  {data.negative_information.legal_cases === 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-bold">{data.negative_information.legal_cases}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium">Restructuring History</span>
                <div className="flex items-center gap-2">
                  {!data.negative_information.restructuring_history ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-bold">
                    {data.negative_information.restructuring_history ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium">Guarantors</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">
                    {data.guarantor_information.personal_guarantors + data.guarantor_information.corporate_guarantors}
                  </span>
                  <span className="text-sm text-slate-600">
                    ({data.guarantor_information.personal_guarantors}P + {data.guarantor_information.corporate_guarantors}C)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      {data.credit_inquiries.recent_inquiries.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-white/30 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Credit Inquiries</CardTitle>
            <CardDescription>Recent credit applications and reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.credit_inquiries.recent_inquiries.map((inquiry, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-slate-900">{inquiry.bank}</div>
                    <div className="text-sm text-slate-600">{inquiry.inquiry_type}</div>
                  </div>
                  <div className="text-sm text-slate-500">
                    {new Date(inquiry.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
