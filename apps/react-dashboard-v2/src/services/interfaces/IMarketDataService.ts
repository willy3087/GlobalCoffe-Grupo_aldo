/**
 * Market Data Service Interface
 * Defines contract for market data business logic operations
 */

import { Result } from '../../types/Result';
import { 
  MarketDataDTO, 
  CreateMarketDataDTO, 
  UpdateMarketDataDTO,
  MarketDataFilterDTO,
  MarketTrendsDTO,
  MarketForecastDTO,
  RegionDTO
} from '../../dtos/MarketDataDTO';

export interface MarketAnalysisDTO {
  commodity: string;
  period: {
    start: Date;
    end: Date;
  };
  priceAnalysis: {
    current: number;
    average: number;
    volatility: number;
    trend: 'bullish' | 'bearish' | 'neutral';
    supportLevel: number;
    resistanceLevel: number;
  };
  volumeAnalysis: {
    current: number;
    average: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  technicalIndicators: {
    rsi: number;
    macd: { signal: number; histogram: number };
    movingAverages: {
      sma20: number;
      sma50: number;
      ema12: number;
      ema26: number;
    };
  };
  fundamentalFactors: string[];
  recommendation: 'buy' | 'sell' | 'hold';
}

export interface MarketAlertsDTO {
  id: string;
  commodity: string;
  type: 'price_threshold' | 'volatility' | 'volume_spike' | 'news_impact' | 'technical_signal';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  triggeredAt: Date;
  currentValue: number;
  thresholdValue: number;
  actionRequired: boolean;
  recommendations: string[];
}

export interface PriceProjectionDTO {
  commodity: string;
  horizons: {
    oneWeek: { price: number; confidence: number };
    oneMonth: { price: number; confidence: number };
    threeMonths: { price: number; confidence: number };
    sixMonths: { price: number; confidence: number };
  };
  factors: {
    weather: number; // impact weight
    supply: number;
    demand: number;
    economics: number;
    geopolitical: number;
  };
  scenarios: MarketForecastDTO['scenarios'];
  lastUpdated: Date;
}

export interface IMarketDataService {
  /**
   * Get current price for a specific commodity
   */
  getCurrentPrice(commodity: string): Promise<Result<MarketDataDTO>>;

  /**
   * Get price history for analysis and charting
   */
  getPriceHistory(
    commodity: string, 
    days: number,
    region?: string
  ): Promise<Result<MarketDataDTO[]>>;

  /**
   * Get comprehensive market trends analysis
   */
  getMarketTrends(
    commodity?: string,
    days?: number
  ): Promise<Result<MarketTrendsDTO>>;

  /**
   * Get price forecast using ML models and market analysis
   */
  getPriceForecast(
    commodity: string, 
    days: number
  ): Promise<Result<PriceProjectionDTO>>;

  /**
   * Create new market data entry
   */
  createMarketData(data: CreateMarketDataDTO): Promise<Result<MarketDataDTO>>;

  /**
   * Update existing market data
   */
  updateMarketData(id: string, data: UpdateMarketDataDTO): Promise<Result<MarketDataDTO>>;

  /**
   * Delete market data entry
   */
  deleteMarketData(id: string): Promise<Result<boolean>>;

  /**
   * Search market data with advanced filters
   */
  searchMarketData(filters: MarketDataFilterDTO): Promise<Result<MarketDataDTO[]>>;

  /**
   * Get market data by region for geographic analysis
   */
  getMarketDataByRegion(
    commodity: string,
    region: RegionDTO,
    days?: number
  ): Promise<Result<MarketDataDTO[]>>;

  /**
   * Get real-time market alerts based on thresholds
   */
  getMarketAlerts(
    commodity?: string,
    severity?: MarketAlertsDTO['severity']
  ): Promise<Result<MarketAlertsDTO[]>>;

  /**
   * Create price alert subscription
   */
  createPriceAlert(
    commodity: string,
    threshold: number,
    direction: 'above' | 'below',
    userId: string
  ): Promise<Result<{ alertId: string }>>;

  /**
   * Get comprehensive market analysis report
   */
  getMarketAnalysis(
    commodity: string,
    days?: number
  ): Promise<Result<MarketAnalysisDTO>>;

  /**
   * Get volatility analysis for risk management
   */
  getVolatilityAnalysis(
    commodity: string,
    period: number
  ): Promise<Result<{
    currentVolatility: number;
    historicalVolatility: number;
    volatilityTrend: 'increasing' | 'decreasing' | 'stable';
    riskLevel: 'low' | 'medium' | 'high';
    VaR: number; // Value at Risk
    recommendations: string[];
  }>>;

  /**
   * Compare prices across different regions
   */
  comparePricesByRegion(
    commodity: string,
    regions: string[]
  ): Promise<Result<{
    comparisons: {
      region: string;
      currentPrice: number;
      averagePrice: number;
      priceAdvantage: number;
    }[];
    bestRegions: string[];
    arbitrageOpportunities: {
      buyRegion: string;
      sellRegion: string;
      potentialProfit: number;
    }[];
  }>>;

  /**
   * Get seasonal price patterns for strategic planning
   */
  getSeasonalPatterns(
    commodity: string,
    years?: number
  ): Promise<Result<{
    monthlyAverages: { month: number; price: number; volume: number }[];
    seasonalTrends: {
      harvest: { start: number; end: number; impact: number };
      planting: { start: number; end: number; impact: number };
      peak: { month: number; price: number };
      trough: { month: number; price: number };
    };
    recommendations: string[];
  }>>;

  /**
   * Get market correlation analysis
   */
  getCorrelationAnalysis(
    primaryCommodity: string,
    compareCommodities: string[]
  ): Promise<Result<{
    correlations: {
      commodity: string;
      correlation: number;
      strength: 'weak' | 'moderate' | 'strong';
    }[];
    hedgingOpportunities: string[];
    diversificationAdvice: string[];
  }>>;

  /**
   * Bulk import market data from external sources
   */
  bulkImportMarketData(
    source: string,
    data: CreateMarketDataDTO[]
  ): Promise<Result<{
    successful: number;
    failed: number;
    errors: string[];
    importedIds: string[];
  }>>;

  /**
   * Get market data quality metrics
   */
  getDataQualityMetrics(): Promise<Result<{
    coverage: { commodity: string; percentage: number }[];
    freshness: { source: string; lastUpdate: Date; isStale: boolean }[];
    reliability: { source: string; score: number }[];
    issues: string[];
  }>>;

  /**
   * Subscribe to real-time market data feed
   */
  subscribeToRealTimeData(
    commodities: string[],
    callback: (data: MarketDataDTO) => void
  ): Promise<Result<{ subscriptionId: string }>>;

  /**
   * Unsubscribe from real-time data feed
   */
  unsubscribeFromRealTimeData(subscriptionId: string): Promise<Result<boolean>>;

  /**
   * Get market sentiment analysis from news and social media
   */
  getMarketSentiment(
    commodity: string,
    days?: number
  ): Promise<Result<{
    overall: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    sources: {
      news: { sentiment: string; count: number };
      social: { sentiment: string; count: number };
      analyst: { sentiment: string; count: number };
    };
    keyFactors: string[];
    sentimentHistory: { date: Date; sentiment: number }[];
  }>>;
}