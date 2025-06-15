
import { DATA_SOURCES, DataSourceConfig } from '@/config/dataSources';
import { ocrVisionService } from './ocrVisionService';
import { externalApiService } from './externalApiService';

export interface LoadDataResult {
  success: boolean;
  financial_data?: any;
  aecb_data?: any;
  error_message?: string;
  processing_time?: number;
  confidence_score?: number;
  source_info: {
    id: string;
    name: string;
    type: string;
  };
}

class DataLoaderService {
  async loadData(sourceId: string, options?: any): Promise<LoadDataResult> {
    const startTime = Date.now();
    const source = DATA_SOURCES[sourceId];
    
    if (!source) {
      return {
        success: false,
        error_message: `Data source '${sourceId}' not found`,
        source_info: { id: sourceId, name: 'Unknown', type: 'unknown' }
      };
    }

    console.log(`Loading data from source: ${source.name} (${source.type})`);

    try {
      let result: LoadDataResult;

      switch (source.type) {
        case 'json':
          result = await this.loadJsonData(source, options);
          break;
        case 'ocr':
        case 'vision':
          result = await this.loadOcrVisionData(source, options);
          break;
        case 'api':
          result = await this.loadApiData(source, options);
          break;
        default:
          result = {
            success: false,
            error_message: `Unsupported data source type: ${source.type}`,
            source_info: { id: source.id, name: source.name, type: source.type }
          };
      }

      result.processing_time = Date.now() - startTime;
      result.source_info = { id: source.id, name: source.name, type: source.type };
      
      return result;
    } catch (error) {
      console.error(`Error loading data from ${source.name}:`, error);
      return {
        success: false,
        error_message: error instanceof Error ? error.message : 'Unknown error occurred',
        processing_time: Date.now() - startTime,
        source_info: { id: source.id, name: source.name, type: source.type }
      };
    }
  }

  private async loadJsonData(source: DataSourceConfig & { mapping?: any }, options?: any): Promise<LoadDataResult> {
    const mapping = source.mapping;
    if (!mapping) {
      throw new Error('No mapping configuration found for JSON data source');
    }

    const promises = [];
    
    // Load financial data
    if (mapping.financial_data_path) {
      promises.push(import(mapping.financial_data_path.replace('@/', '../')));
    }
    
    // Load AECB data if available
    if (mapping.aecb_data_path) {
      promises.push(import(mapping.aecb_data_path.replace('@/', '../')));
    }

    const results = await Promise.all(promises);
    
    return {
      success: true,
      financial_data: results[0]?.default,
      aecb_data: results[1]?.default,
      confidence_score: 1.0
    };
  }

  private async loadOcrVisionData(source: DataSourceConfig, options?: any): Promise<LoadDataResult> {
    const files = options?.files;
    if (!files || files.length === 0) {
      throw new Error('No files provided for OCR/Vision processing');
    }

    const result = await ocrVisionService.processDocuments(files, {
      type: source.type,
      confidence_threshold: source.confidence_threshold || 0.85
    });

    return {
      success: result.success,
      financial_data: result.financial_data,
      aecb_data: result.aecb_data,
      error_message: result.error_message,
      confidence_score: result.confidence_score
    };
  }

  private async loadApiData(source: DataSourceConfig, options?: any): Promise<LoadDataResult> {
    if (!source.endpoint) {
      throw new Error('No endpoint configured for API data source');
    }

    const result = await externalApiService.fetchData(source.endpoint, {
      source_id: source.id,
      ...options
    });

    return {
      success: result.success,
      financial_data: result.financial_data,
      aecb_data: result.aecb_data,
      error_message: result.error_message,
      confidence_score: result.confidence_score
    };
  }

  async validateData(data: any): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    // Basic validation checks
    if (!data) {
      issues.push('No data provided');
      return { isValid: false, issues };
    }

    // Check for required financial statement structure
    const requiredStatements = ['Balance Sheet', 'Income Statement', 'Cash Flow Statement'];
    const missingStatements = requiredStatements.filter(statement => !data[statement]);
    
    if (missingStatements.length > 0) {
      issues.push(`Missing financial statements: ${missingStatements.join(', ')}`);
    }

    // Check for year data
    if (data['Balance Sheet']) {
      const years = [...new Set(data['Balance Sheet'].map((item: any) => item.year))];
      if (years.length === 0) {
        issues.push('No year information found in financial data');
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

export const dataLoaderService = new DataLoaderService();
