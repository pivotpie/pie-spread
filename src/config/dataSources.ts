
export interface DataSourceConfig {
  id: string;
  name: string;
  type: 'json' | 'ocr' | 'vision' | 'api' | 'manual';
  category: 'financial' | 'aecb' | 'combined';
  description: string;
  endpoint?: string;
  requirements?: string[];
  supported_formats?: string[];
  processing_time?: string;
  confidence_threshold?: number;
}

export interface DataSourceMapping {
  financial_data_path: string;
  aecb_data_path?: string;
  company_identifier_field?: string;
  year_field?: string;
}

export const DATA_SOURCES: Record<string, DataSourceConfig & { mapping?: DataSourceMapping }> = {
  // Sample Data Sources
  manufacturing_sample: {
    id: 'manufacturing_sample',
    name: 'Manufacturing Company Sample',
    type: 'json',
    category: 'combined',
    description: '3-year financial history with comprehensive statements',
    mapping: {
      financial_data_path: '@/data/financialData.json',
      aecb_data_path: '@/data/financialDataAECB.json',
      company_identifier_field: 'company_name',
      year_field: 'year'
    }
  },
  fashion_retail_sample: {
    id: 'fashion_retail_sample',
    name: 'Fashion Retail Company Sample',
    type: 'json',
    category: 'combined',
    description: 'High-growth fashion retailer with strong profitability trends',
    mapping: {
      financial_data_path: '@/data/fashionRetailData.json',
      aecb_data_path: '@/data/fashionRetailAECB.json',
      company_identifier_field: 'company_name',
      year_field: 'year'
    }
  },
  consumables_retail_sample: {
    id: 'consumables_retail_sample',
    name: 'Consumables Retail Company Sample',
    type: 'json',
    category: 'combined',
    description: 'Established retail business with declining profitability challenges',
    mapping: {
      financial_data_path: '@/data/consumablesRetailData.json',
      aecb_data_path: '@/data/consumablesRetailAECB.json',
      company_identifier_field: 'company_name',
      year_field: 'year'
    }
  },
  
  // OCR/Vision Sources
  document_ocr: {
    id: 'document_ocr',
    name: 'Document OCR Scanner',
    type: 'ocr',
    category: 'financial',
    description: 'Extract financial data from scanned documents and PDFs',
    supported_formats: ['pdf', 'jpg', 'jpeg', 'png', 'tiff'],
    processing_time: '2-5 minutes',
    confidence_threshold: 0.85,
    requirements: ['Clear document images', 'Standard financial statement format']
  },
  smart_vision: {
    id: 'smart_vision',
    name: 'Smart Vision Analysis',
    type: 'vision',
    category: 'financial',
    description: 'AI-powered analysis of financial documents with table detection',
    supported_formats: ['pdf', 'jpg', 'jpeg', 'png'],
    processing_time: '1-3 minutes',
    confidence_threshold: 0.90,
    requirements: ['High-resolution images', 'Structured table format']
  },
  
  // API Sources
  aecb_api: {
    id: 'aecb_api',
    name: 'AECB Direct API',
    type: 'api',
    category: 'aecb',
    description: 'Direct integration with AECB credit bureau services',
    endpoint: '/api/aecb/credit-report',
    requirements: ['AECB API credentials', 'Company Emirates ID'],
    processing_time: '30 seconds - 2 minutes'
  },
  banking_api: {
    id: 'banking_api',
    name: 'Banking API Integration',
    type: 'api',
    category: 'financial',
    description: 'Connect to UAE banking systems for real-time financial data',
    endpoint: '/api/banking/financial-data',
    requirements: ['Bank API credentials', 'Customer consent'],
    processing_time: '1-2 minutes'
  }
};

export const getDataSourcesByCategory = (category: 'financial' | 'aecb' | 'combined') => {
  return Object.values(DATA_SOURCES).filter(source => source.category === category);
};

export const getDataSourceById = (id: string) => {
  return DATA_SOURCES[id];
};
