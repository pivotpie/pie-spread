
export interface ApiRequestOptions {
  source_id: string;
  credentials?: Record<string, string>;
  company_id?: string;
  emirates_id?: string;
  date_range?: {
    from: string;
    to: string;
  };
}

export interface ApiResponse {
  success: boolean;
  financial_data?: any;
  aecb_data?: any;
  error_message?: string;
  confidence_score?: number;
  api_response_time?: number;
}

class ExternalApiService {
  async fetchData(endpoint: string, options: ApiRequestOptions): Promise<ApiResponse> {
    const startTime = Date.now();
    
    try {
      console.log(`Fetching data from external API: ${endpoint}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock different API responses based on endpoint
      if (endpoint.includes('aecb')) {
        return await this.mockAecbApiResponse(options);
      } else if (endpoint.includes('banking')) {
        return await this.mockBankingApiResponse(options);
      } else {
        throw new Error(`Unsupported API endpoint: ${endpoint}`);
      }
    } catch (error) {
      return {
        success: false,
        error_message: error instanceof Error ? error.message : 'API request failed',
        api_response_time: Date.now() - startTime
      };
    }
  }

  private async mockAecbApiResponse(options: ApiRequestOptions): Promise<ApiResponse> {
    // Simulate AECB API response
    const mockAecbData = {
      company_profile: {
        company_name: "Sample Trading LLC",
        emirates_id: options.emirates_id || "784-1234-5678901-2",
        registration_date: "2015-03-15",
        legal_status: "Active",
        business_activity: "General Trading"
      },
      credit_profile: {
        aecb_score: Math.floor(Math.random() * 300) + 600, // 600-900 range
        risk_grade: ["A+", "A", "B+", "B", "C"][Math.floor(Math.random() * 5)],
        credit_limit: Math.floor(Math.random() * 50000000) + 10000000,
        outstanding_amount: Math.floor(Math.random() * 20000000) + 5000000
      },
      payment_history: {
        payment_performance: {
          on_time_payments: Math.random() * 40 + 60, // 60-100%
          late_payments: Math.random() * 20,
          defaults: Math.floor(Math.random() * 3)
        },
        credit_utilization: {
          utilization_ratio: Math.random() * 0.6 + 0.2, // 20-80%
          average_balance: Math.floor(Math.random() * 15000000) + 5000000
        }
      },
      negative_information: {
        bounced_checks: Math.floor(Math.random() * 3),
        legal_cases: Math.floor(Math.random() * 2),
        restructuring_history: Math.random() > 0.8
      }
    };

    return {
      success: true,
      aecb_data: mockAecbData,
      confidence_score: 0.95,
      api_response_time: 1200
    };
  }

  private async mockBankingApiResponse(options: ApiRequestOptions): Promise<ApiResponse> {
    // Simulate Banking API response
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];
    
    const mockFinancialData = {
      "Balance Sheet": [],
      "Income Statement": [],
      "Cash Flow Statement": []
    };

    // Generate realistic banking data
    years.forEach(year => {
      // Balance Sheet items with more realistic values
      const assets = Math.floor(Math.random() * 50000000) + 20000000;
      const liabilities = assets * (0.4 + Math.random() * 0.4); // 40-80% of assets
      const equity = assets - liabilities;

      (mockFinancialData["Balance Sheet"] as any[]).push(
        {
          field_name: "Total Assets",
          value: assets,
          currency: "AED",
          year: year,
          confidence_score: 0.98
        },
        {
          field_name: "Total Liabilities",
          value: liabilities,
          currency: "AED",
          year: year,
          confidence_score: 0.98
        },
        {
          field_name: "Shareholder's Equity",
          value: equity,
          currency: "AED",
          year: year,
          confidence_score: 0.98
        }
      );
    });

    return {
      success: true,
      financial_data: mockFinancialData,
      confidence_score: 0.98,
      api_response_time: 800
    };
  }

  async testConnection(endpoint: string, credentials: Record<string, string>): Promise<boolean> {
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock success rate - higher chance for known endpoints
      const successRate = endpoint.includes('aecb') || endpoint.includes('banking') ? 0.9 : 0.7;
      return Math.random() < successRate;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async getApiStatus(endpoint: string): Promise<{
    status: 'online' | 'offline' | 'maintenance';
    response_time?: number;
    last_check: string;
  }> {
    // Mock API status check
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const statuses = ['online', 'offline', 'maintenance'] as const;
    const status = statuses[Math.floor(Math.random() * 3)];
    
    return {
      status: status === 'online' ? 'online' : status,
      response_time: status === 'online' ? Math.floor(Math.random() * 1000) + 200 : undefined,
      last_check: new Date().toISOString()
    };
  }
}

export const externalApiService = new ExternalApiService();
