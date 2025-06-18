
import React from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  BarChart3, 
  FileSpreadsheet, 
  FileText, 
  TrendingUp, 
  Building 
} from 'lucide-react';

interface StickyNavTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const StickyNavTabs: React.FC<StickyNavTabsProps> = ({ 
  activeTab = 'loan-eligibility', 
  onTabChange 
}) => {
  const tabs = [
    {
      id: 'loan-eligibility',
      label: 'Loan Eligibility Score',
      icon: Calculator,
      description: 'Credit assessment and loan qualification'
    },
    {
      id: 'financial-dashboard',
      label: 'Financial Dashboard',
      icon: BarChart3,
      description: 'Key financial metrics and KPIs'
    },
    {
      id: 'ratio-analysis',
      label: 'Ratio Analysis',
      icon: FileSpreadsheet,
      description: 'Financial ratios and performance indicators'
    },
    {
      id: 'financial-documents',
      label: 'Financial Documents',
      icon: FileText,
      description: 'Balance sheet, income statement, cash flow'
    },
    {
      id: 'trend-analysis',
      label: 'Trend Analysis',
      icon: TrendingUp,
      description: 'Historical trends and projections'
    },
    {
      id: 'aecb-score',
      label: 'AECB Score',
      icon: Building,
      description: 'Credit bureau data and risk assessment'
    }
  ];

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
    
    // Scroll to the corresponding section
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="w-full max-w-none px-8 py-4">
        <NavigationMenu className="w-full max-w-none">
          <NavigationMenuList className="flex-wrap justify-center gap-2 w-full">
            {tabs.map((tab) => (
              <NavigationMenuItem key={tab.id}>
                <NavigationMenuLink
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer
                    hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent
                    ${activeTab === tab.id 
                      ? 'bg-blue-500 text-white shadow-lg border-blue-500' 
                      : 'bg-white/80 text-slate-700 hover:text-blue-700'
                    }
                  `}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium whitespace-nowrap">{tab.label}</span>
                  {tab.id === 'aecb-score' && (
                    <Badge variant="outline" className="ml-2 px-2 py-1 text-xs">
                      Premium
                    </Badge>
                  )}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
