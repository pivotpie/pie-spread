import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileSpreadsheet, 
  TrendingUp, 
  Calculator,
  ArrowRight,
  Banknote,
  Shield,
  Clock
} from 'lucide-react';

interface BlankStateProps {
  onImportClick: () => void;
  onSampleDataLoad: () => void;
}

export const BlankState: React.FC<BlankStateProps> = ({ onImportClick, onSampleDataLoad }) => {
  const features = [
    {
      icon: Calculator,
      title: 'Financial Ratio Analysis',
      description: 'Automated calculation of key banking ratios including current ratio, debt-to-equity, and profitability metrics'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Multi-year financial performance tracking with visual charts and growth indicators'
    },
    {
      icon: Shield,
      title: 'CAD Loan Assessment',
      description: 'Specialized scoring for Cash Against Documents loan eligibility based on banking standards'
    },
    {
      icon: Clock,
      title: 'Real-time Processing',
      description: 'Instant document analysis and risk assessment with automated data extraction'
    }
  ];

  const cadBenefits = [
    'Reduced processing time by 70%',
    'Standardized risk assessment',
    'Compliance with banking regulations',
    'Automated document verification'
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-2 text-lg">
            <Banknote className="h-5 w-5 mr-2" />
            CAD Loan Assessment Platform
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900">
            Cash Against Documents
            <span className="block text-blue-600">Loan Evaluation System</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced financial spreading and risk assessment platform designed specifically 
            for trade finance and CAD loan processing
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={onImportClick} 
            size="lg" 
            className="px-8 py-6 text-lg"
          >
            <Upload className="h-6 w-6 mr-2" />
            Import Financial Documents
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-6 text-lg"
            onClick={onSampleDataLoad}
          >
            <FileSpreadsheet className="h-6 w-6 mr-2" />
            View Sample Assessment
          </Button>
        </div>
      </div>

      {/* Empty Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-dashed border-2 border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Assets</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">--</div>
            <p className="text-xs text-gray-400">Import data to view</p>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Current Ratio</CardTitle>
            <Calculator className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">--</div>
            <p className="text-xs text-gray-400">Liquidity measure</p>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Debt-to-Equity</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">--</div>
            <p className="text-xs text-gray-400">Leverage indicator</p>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">CAD Score</CardTitle>
            <Shield className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">--</div>
            <p className="text-xs text-gray-400">Loan eligibility</p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Platform Features</h2>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-l-4 border-l-blue-600">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <feature.icon className="h-8 w-8 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">CAD Loan Benefits</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-6 w-6 text-green-600" />
                Trade Finance Optimization
              </CardTitle>
              <CardDescription>
                Streamlined assessment process for Cash Against Documents loans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {cadBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Get Started</h4>
                <p className="text-green-700 text-sm">
                  Upload your client's financial documents to begin the automated CAD loan assessment process. 
                  Our AI-powered system will extract key financial data and generate a comprehensive risk profile.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
