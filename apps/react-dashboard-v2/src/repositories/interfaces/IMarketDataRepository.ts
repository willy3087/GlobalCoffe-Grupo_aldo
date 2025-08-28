import { Result } from '../../types/Result';
import { IRepository } from './IRepository';

export interface MarketData {
  id: string;
  type: 'price' | 'weather' | 'volume' | 'quality' | 'news';
  source: string; // API source or data provider
  timestamp: Date;
  region?: {
    country: string;
    state?: string;
    city?: string;
  };
  data: {
    // Price data
    price?: {
      value: number;
      currency: string;
      unit: string; // 'bag', 'kg', 'ton'
      variety?: string;
      grade?: string;
    };
    // Weather data
    weather?: {
      temperature: number;
      humidity: number;
      rainfall: number;
      conditions: string;
      forecast?: {
        nextWeek: string;
        nextMonth: string;
      };
    };
    // Volume/Production data
    volume?: {
      amount: number;
      unit: string;
      period: string; // 'daily', 'weekly', 'monthly'
      type: 'production' | 'export' | 'import' | 'consumption';
    };
    // Quality data
    quality?: {
      cupping: number;
      defects: number;
      moisture: number;
      screenSize: string;
    };
    // News/Analysis data
    news?: {
      title: string;
      summary: string;
      sentiment: 'positive' | 'negative' | 'neutral';
      impact: 'low' | 'medium' | 'high';
      url?: string;
    };
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketDataFilter {
  type?: MarketData['type'];
  source?: string;
  startDate?: Date;
  endDate?: Date;
  region?: {
    country?: string;
    state?: string;
    city?: string;
  };
}

export interface MarketDataAggregation {
  averagePrice?: number;
  priceVolatility?: number;
  totalVolume?: number;
  weatherTrends?: {
    averageTemperature: number;
    totalRainfall: number;
    averageHumidity: number;
  };
  qualityTrends?: {
    averageCupping: number;
    averageDefects: number;
  };
}

/**
 * Specific repository interface for Market Data entities
 */
export interface IMarketDataRepository extends IRepository<MarketData> {
  /**
   * Find market data by type and date range
   */
  findByTypeAndDateRange(
    type: MarketData['type'],
    startDate: Date,
    endDate: Date
  ): Promise<Result<MarketData[]>>;

  /**
   * Find market data by source
   */
  findBySource(source: string): Promise<Result<MarketData[]>>;

  /**
   * Find market data by region
   */
  findByRegion(country: string, state?: string, city?: string): Promise<Result<MarketData[]>>;

  /**
   * Find market data using multiple filters
   */
  findByFilters(filters: MarketDataFilter): Promise<Result<MarketData[]>>;

  /**
   * Get latest market data by type
   */
  getLatestByType(type: MarketData['type']): Promise<Result<MarketData | null>>;

  /**
   * Get price history for a specific period
   */
  getPriceHistory(
    startDate: Date,
    endDate: Date,
    variety?: string,
    grade?: string
  ): Promise<Result<MarketData[]>>;

  /**
   * Get weather data for climate analysis
   */
  getWeatherData(
    region: { country: string; state?: string; city?: string },
    startDate: Date,
    endDate: Date
  ): Promise<Result<MarketData[]>>;

  /**
   * Get aggregated data for analytics
   */
  getAggregatedData(
    filters: MarketDataFilter
  ): Promise<Result<MarketDataAggregation>>;

  /**
   * Search news and analysis by keywords
   */
  searchNews(
    keywords: string[],
    sentiment?: 'positive' | 'negative' | 'neutral',
    impact?: 'low' | 'medium' | 'high'
  ): Promise<Result<MarketData[]>>;

  /**
   * Get market trends for dashboard KPIs
   */
  getMarketTrends(days?: number): Promise<Result<{
    priceChange: number;
    volumeChange: number;
    qualityTrend: 'improving' | 'declining' | 'stable';
    weatherImpact: 'positive' | 'negative' | 'neutral';
  }>>;

  /**
   * Bulk insert market data from external APIs
   */
  bulkInsert(data: Omit<MarketData, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Result<MarketData[]>>;

  /**
   * Clean old market data (data retention)
   */
  cleanOldData(olderThanDays: number): Promise<Result<number>>;
}