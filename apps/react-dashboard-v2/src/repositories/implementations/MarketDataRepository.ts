import { Result, Success, Failure } from '../../types/Result';
import { BaseRepository, HttpConfig } from '../base/BaseRepository';
import { 
  IMarketDataRepository, 
  MarketData, 
  MarketDataFilter, 
  MarketDataAggregation 
} from '../interfaces/IMarketDataRepository';

/**
 * Market Data repository implementation with domain-specific operations
 */
export class MarketDataRepository extends BaseRepository<MarketData> implements IMarketDataRepository {
  
  constructor(config: HttpConfig) {
    super('market-data', config);
  }

  /**
   * Find market data by type and date range
   */
  async findByTypeAndDateRange(
    type: MarketData['type'],
    startDate: Date,
    endDate: Date
  ): Promise<Result<MarketData[]>> {
    const queryParams = {
      type,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    return this.fetchWithQuery<MarketData[]>('by-type-date', queryParams);
  }

  /**
   * Find market data by source
   */
  async findBySource(source: string): Promise<Result<MarketData[]>> {
    const queryParams = { source };
    return this.fetchWithQuery<MarketData[]>('by-source', queryParams);
  }

  /**
   * Find market data by region
   */
  async findByRegion(country: string, state?: string, city?: string): Promise<Result<MarketData[]>> {
    const queryParams = { 
      country, 
      ...(state && { state }), 
      ...(city && { city }) 
    };
    return this.fetchWithQuery<MarketData[]>('by-region', queryParams);
  }

  /**
   * Find market data using multiple filters
   */
  async findByFilters(filters: MarketDataFilter): Promise<Result<MarketData[]>> {
    const queryParams = {
      ...filters,
      ...(filters.startDate && { startDate: filters.startDate.toISOString() }),
      ...(filters.endDate && { endDate: filters.endDate.toISOString() }),
      ...(filters.region && { 
        country: filters.region.country,
        state: filters.region.state,
        city: filters.region.city 
      })
    };
    return this.fetchWithQuery<MarketData[]>('filter', queryParams);
  }

  /**
   * Get latest market data by type
   */
  async getLatestByType(type: MarketData['type']): Promise<Result<MarketData | null>> {
    const queryParams = { type };
    return this.fetchWithQuery<MarketData | null>('latest', queryParams);
  }

  /**
   * Get price history for a specific period
   */
  async getPriceHistory(
    startDate: Date,
    endDate: Date,
    variety?: string,
    grade?: string
  ): Promise<Result<MarketData[]>> {
    const queryParams = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ...(variety && { variety }),
      ...(grade && { grade })
    };
    return this.fetchWithQuery<MarketData[]>('price-history', queryParams);
  }

  /**
   * Get weather data for climate analysis
   */
  async getWeatherData(
    region: { country: string; state?: string; city?: string },
    startDate: Date,
    endDate: Date
  ): Promise<Result<MarketData[]>> {
    const queryParams = {
      country: region.country,
      ...(region.state && { state: region.state }),
      ...(region.city && { city: region.city }),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    return this.fetchWithQuery<MarketData[]>('weather-data', queryParams);
  }

  /**
   * Get aggregated data for analytics
   */
  async getAggregatedData(filters: MarketDataFilter): Promise<Result<MarketDataAggregation>> {
    const queryParams = {
      ...filters,
      ...(filters.startDate && { startDate: filters.startDate.toISOString() }),
      ...(filters.endDate && { endDate: filters.endDate.toISOString() }),
      ...(filters.region && { 
        country: filters.region.country,
        state: filters.region.state,
        city: filters.region.city 
      })
    };
    return this.fetchWithQuery<MarketDataAggregation>('aggregated', queryParams);
  }

  /**
   * Search news and analysis by keywords
   */
  async searchNews(
    keywords: string[],
    sentiment?: 'positive' | 'negative' | 'neutral',
    impact?: 'low' | 'medium' | 'high'
  ): Promise<Result<MarketData[]>> {
    const queryParams = {
      keywords: keywords.join(','),
      ...(sentiment && { sentiment }),
      ...(impact && { impact })
    };
    return this.fetchWithQuery<MarketData[]>('search-news', queryParams);
  }

  /**
   * Get market trends for dashboard KPIs
   */
  async getMarketTrends(days: number = 30): Promise<Result<{
    priceChange: number;
    volumeChange: number;
    qualityTrend: 'improving' | 'declining' | 'stable';
    weatherImpact: 'positive' | 'negative' | 'neutral';
  }>> {
    const queryParams = { days };
    return this.fetchWithQuery('trends', queryParams);
  }

  /**
   * Bulk insert market data from external APIs
   */
  async bulkInsert(data: Omit<MarketData, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Result<MarketData[]>> {
    try {
      const url = `${this.config.baseUrl}/${this.resourcePath}/bulk`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.config.headers,
        body: JSON.stringify({ data }),
        signal: this.createTimeoutSignal()
      });

      if (!response.ok) {
        return Failure(`HTTP Error: ${response.status} - ${response.statusText}`, `HTTP_${response.status}`);
      }

      const result = await response.json();
      return Success(result);
    } catch (error) {
      return this.handleError(error, 'bulkInsert');
    }
  }

  /**
   * Clean old market data (data retention)
   */
  async cleanOldData(olderThanDays: number): Promise<Result<number>> {
    try {
      const url = `${this.config.baseUrl}/${this.resourcePath}/cleanup`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.config.headers,
        body: JSON.stringify({ olderThanDays }),
        signal: this.createTimeoutSignal()
      });

      if (!response.ok) {
        return Failure(`HTTP Error: ${response.status} - ${response.statusText}`, `HTTP_${response.status}`);
      }

      const result = await response.json();
      return Success(result.deletedCount || 0);
    } catch (error) {
      return this.handleError(error, 'cleanOldData');
    }
  }

  // Additional market-specific methods

  /**
   * Get commodity prices for coffee varieties
   */
  async getCommodityPrices(varieties?: string[]): Promise<Result<MarketData[]>> {
    const queryParams = varieties ? { varieties: varieties.join(',') } : {};
    return this.fetchWithQuery<MarketData[]>('commodity-prices', queryParams);
  }

  /**
   * Get climate index data for weather analysis
   */
  async getClimateIndex(
    region: { country: string; state?: string },
    months: number = 6
  ): Promise<Result<MarketData[]>> {
    const queryParams = {
      country: region.country,
      ...(region.state && { state: region.state }),
      months
    };
    return this.fetchWithQuery<MarketData[]>('climate-index', queryParams);
  }

  /**
   * Get quality scores by region and time period
   */
  async getQualityScores(
    region?: { country: string; state?: string },
    days: number = 30
  ): Promise<Result<MarketData[]>> {
    const queryParams = {
      ...(region && {
        country: region.country,
        ...(region.state && { state: region.state })
      }),
      days
    };
    return this.fetchWithQuery<MarketData[]>('quality-scores', queryParams);
  }

  /**
   * Get market volatility data
   */
  async getVolatilityData(period: number = 20): Promise<Result<{
    currentVolatility: number;
    historicalAverage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>> {
    const queryParams = { period };
    return this.fetchWithQuery('volatility', queryParams);
  }

  // Private helper methods

  private createTimeoutSignal(): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.config.timeout);
    return controller.signal;
  }

  private handleError(error: any, operation: string): Result<any> {
    if (error.name === 'AbortError') {
      return Failure(`Request timeout for operation: ${operation}`, 'TIMEOUT');
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return Failure(`Network error for operation: ${operation}`, 'NETWORK_ERROR');
    }
    
    return Failure(
      `Unexpected error in ${operation}: ${error.message}`,
      'UNKNOWN_ERROR'
    );
  }
}