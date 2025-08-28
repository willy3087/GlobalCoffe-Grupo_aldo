/**
 * Market Data Service Implementation
 * Implements business logic for market data operations
 */

import { Result, Success, Failure } from '../../types/Result';
import { IMarketDataRepository } from '../../repositories/interfaces/IMarketDataRepository';
import {
  IMarketDataService,
  MarketAnalysisDTO,
  MarketAlertsDTO,
  PriceProjectionDTO
} from '../interfaces/IMarketDataService';
import {
  MarketDataDTO,
  CreateMarketDataDTO,
  UpdateMarketDataDTO,
  MarketDataFilterDTO,
  MarketTrendsDTO,
  RegionDTO
} from '../../dtos/MarketDataDTO';

export class MarketDataService implements IMarketDataService {
  constructor(private readonly marketDataRepository: IMarketDataRepository) {}

  async getCurrentPrice(commodity: string): Promise<Result<MarketDataDTO>> {
    try {
      if (!commodity || commodity.trim() === '') {
        return Failure('Commodity name is required', 'INVALID_COMMODITY');
      }

      const result = await this.marketDataRepository.getLatestByType('price');
      if (!result.success) {
        return Failure(`Failed to get current price: ${result.error}`, result.code);
      }

      if (!result.data) {
        return Failure('No price data available for commodity', 'NO_DATA');
      }

      return Success(result.data);
    } catch (error) {
      console.error('Error getting current price:', error);
      return Failure('Internal server error while getting current price', 'INTERNAL_ERROR');
    }
  }

  async getPriceHistory(
    commodity: string, 
    days: number,
    region?: string
  ): Promise<Result<MarketDataDTO[]>> {
    try {
      if (!commodity || commodity.trim() === '') {
        return Failure('Commodity name is required', 'INVALID_COMMODITY');
      }

      if (days <= 0 || days > 365) {
        return Failure('Days must be between 1 and 365', 'INVALID_DAYS');
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const filters: MarketDataFilterDTO = {
        commodity,
        type: 'price',
        startDate,
        endDate
      };

      if (region) {
        filters.region = { country: region };
      }

      const result = await this.marketDataRepository.findByFilters(filters);
      if (!result.success) {
        return Failure(`Failed to get price history: ${result.error}`, result.code);
      }

      // Sort by date ascending
      const sortedData = result.data.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return Success(sortedData);
    } catch (error) {
      console.error('Error getting price history:', error);
      return Failure('Internal server error while getting price history', 'INTERNAL_ERROR');
    }
  }

  async getMarketTrends(
    commodity?: string,
    days?: number
  ): Promise<Result<MarketTrendsDTO>> {
    try {
      const period = days || 30;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - period);

      // Get trends from repository
      const result = await this.marketDataRepository.getMarketTrends(period);
      if (!result.success) {
        return Failure(`Failed to get market trends: ${result.error}`, result.code);
      }

      // Enhanced trends with additional analysis
      const trends: MarketTrendsDTO = {
        ...result.data,
        volatilityIndex: this.calculateVolatilityIndex(result.data.priceChange.percentage)
      };

      return Success(trends);
    } catch (error) {
      console.error('Error getting market trends:', error);
      return Failure('Internal server error while getting market trends', 'INTERNAL_ERROR');
    }
  }

  async getPriceForecast(
    commodity: string, 
    days: number
  ): Promise<Result<PriceProjectionDTO>> {
    try {
      if (!commodity || commodity.trim() === '') {
        return Failure('Commodity name is required', 'INVALID_COMMODITY');
      }

      if (days <= 0 || days > 180) {
        return Failure('Forecast days must be between 1 and 180', 'INVALID_DAYS');
      }

      // Get historical data for analysis
      const historyResult = await this.getPriceHistory(commodity, Math.min(days * 2, 90));
      if (!historyResult.success) {
        return historyResult;
      }

      // Mock forecast implementation - would use ML models in production
      const currentPrice = historyResult.data.length > 0 
        ? historyResult.data[historyResult.data.length - 1].price?.value || 100
        : 100;

      const projection: PriceProjectionDTO = {
        commodity,
        horizons: {
          oneWeek: { 
            price: currentPrice * (1 + (Math.random() * 0.1 - 0.05)), 
            confidence: 0.85 
          },
          oneMonth: { 
            price: currentPrice * (1 + (Math.random() * 0.2 - 0.1)), 
            confidence: 0.75 
          },
          threeMonths: { 
            price: currentPrice * (1 + (Math.random() * 0.3 - 0.15)), 
            confidence: 0.65 
          },
          sixMonths: { 
            price: currentPrice * (1 + (Math.random() * 0.4 - 0.2)), 
            confidence: 0.55 
          }
        },
        factors: {
          weather: 0.25,
          supply: 0.30,
          demand: 0.25,
          economics: 0.15,
          geopolitical: 0.05
        },
        scenarios: {
          optimistic: {
            probability: 0.25,
            priceRange: { min: currentPrice * 1.1, max: currentPrice * 1.3 },
            factors: ['Favorable weather', 'Strong demand', 'Supply constraints']
          },
          realistic: {
            probability: 0.50,
            priceRange: { min: currentPrice * 0.95, max: currentPrice * 1.1 },
            factors: ['Normal weather patterns', 'Stable demand', 'Regular supply']
          },
          pessimistic: {
            probability: 0.25,
            priceRange: { min: currentPrice * 0.7, max: currentPrice * 0.95 },
            factors: ['Adverse weather', 'Weak demand', 'Oversupply']
          }
        },
        lastUpdated: new Date()
      };

      return Success(projection);
    } catch (error) {
      console.error('Error getting price forecast:', error);
      return Failure('Internal server error while getting price forecast', 'INTERNAL_ERROR');
    }
  }

  async createMarketData(data: CreateMarketDataDTO): Promise<Result<MarketDataDTO>> {
    try {
      // Validate required fields
      if (!data.commodity || !data.type || !data.source) {
        return Failure('Commodity, type, and source are required', 'VALIDATION_ERROR');
      }

      // Add metadata
      const marketData = {
        ...data,
        reliability: data.reliability || 0.8,
        metadata: {
          ...data.metadata,
          createdBy: 'MarketDataService',
          source: data.source
        }
      };

      const result = await this.marketDataRepository.create(marketData);
      if (!result.success) {
        return Failure(`Failed to create market data: ${result.error}`, result.code);
      }

      return Success(result.data);
    } catch (error) {
      console.error('Error creating market data:', error);
      return Failure('Internal server error while creating market data', 'INTERNAL_ERROR');
    }
  }

  async updateMarketData(id: string, data: UpdateMarketDataDTO): Promise<Result<MarketDataDTO>> {
    try {
      if (!id || id.trim() === '') {
        return Failure('Market data ID is required', 'INVALID_ID');
      }

      const result = await this.marketDataRepository.update(id, data);
      if (!result.success) {
        return Failure(`Failed to update market data: ${result.error}`, result.code);
      }

      return Success(result.data);
    } catch (error) {
      console.error('Error updating market data:', error);
      return Failure('Internal server error while updating market data', 'INTERNAL_ERROR');
    }
  }

  async deleteMarketData(id: string): Promise<Result<boolean>> {
    try {
      if (!id || id.trim() === '') {
        return Failure('Market data ID is required', 'INVALID_ID');
      }

      const result = await this.marketDataRepository.delete(id);
      return Success(result.success);
    } catch (error) {
      console.error('Error deleting market data:', error);
      return Failure('Internal server error while deleting market data', 'INTERNAL_ERROR');
    }
  }

  async searchMarketData(filters: MarketDataFilterDTO): Promise<Result<MarketDataDTO[]>> {
    try {
      const result = await this.marketDataRepository.findByFilters(filters);
      if (!result.success) {
        return Failure(`Failed to search market data: ${result.error}`, result.code);
      }

      return Success(result.data);
    } catch (error) {
      console.error('Error searching market data:', error);
      return Failure('Internal server error while searching market data', 'INTERNAL_ERROR');
    }
  }

  async getMarketDataByRegion(
    commodity: string,
    region: RegionDTO,
    days?: number
  ): Promise<Result<MarketDataDTO[]>> {
    try {
      if (!commodity || !region.country) {
        return Failure('Commodity and region country are required', 'VALIDATION_ERROR');
      }

      const filters: MarketDataFilterDTO = {
        commodity,
        region,
        startDate: days ? new Date(Date.now() - days * 24 * 60 * 60 * 1000) : undefined
      };

      return await this.searchMarketData(filters);
    } catch (error) {
      console.error('Error getting market data by region:', error);
      return Failure('Internal server error while getting market data by region', 'INTERNAL_ERROR');
    }
  }

  async getMarketAlerts(
    commodity?: string,
    severity?: MarketAlertsDTO['severity']
  ): Promise<Result<MarketAlertsDTO[]>> {
    try {
      // Mock implementation - would integrate with alerting system
      const alerts: MarketAlertsDTO[] = [
        {
          id: '1',
          commodity: commodity || 'arabica',
          type: 'price_threshold',
          severity: 'warning',
          message: 'Price has exceeded the 90-day moving average by 15%',
          triggeredAt: new Date(),
          currentValue: 150.5,
          thresholdValue: 130.0,
          actionRequired: true,
          recommendations: [
            'Monitor price movements closely',
            'Consider hedging positions',
            'Review supply chain contracts'
          ]
        }
      ];

      const filteredAlerts = alerts.filter(alert => {
        if (severity && alert.severity !== severity) return false;
        if (commodity && alert.commodity !== commodity) return false;
        return true;
      });

      return Success(filteredAlerts);
    } catch (error) {
      console.error('Error getting market alerts:', error);
      return Failure('Internal server error while getting market alerts', 'INTERNAL_ERROR');
    }
  }

  async createPriceAlert(
    commodity: string,
    threshold: number,
    direction: 'above' | 'below',
    userId: string
  ): Promise<Result<{ alertId: string }>> {
    try {
      if (!commodity || !userId) {
        return Failure('Commodity and userId are required', 'VALIDATION_ERROR');
      }

      if (threshold <= 0) {
        return Failure('Threshold must be positive', 'INVALID_THRESHOLD');
      }

      // Mock implementation - would integrate with alerting system
      const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return Success({ alertId });
    } catch (error) {
      console.error('Error creating price alert:', error);
      return Failure('Internal server error while creating price alert', 'INTERNAL_ERROR');
    }
  }

  async getMarketAnalysis(
    commodity: string,
    days?: number
  ): Promise<Result<MarketAnalysisDTO>> {
    try {
      if (!commodity || commodity.trim() === '') {
        return Failure('Commodity name is required', 'INVALID_COMMODITY');
      }

      const period = days || 30;
      const historyResult = await this.getPriceHistory(commodity, period);
      if (!historyResult.success) {
        return historyResult;
      }

      const prices = historyResult.data.map(d => d.price?.value || 0);
      const volumes = historyResult.data.map(d => d.volume24h || 0);
      
      if (prices.length === 0) {
        return Failure('No price data available for analysis', 'NO_DATA');
      }

      const currentPrice = prices[prices.length - 1];
      const average = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      const volatility = this.calculateVolatility(prices);

      const analysis: MarketAnalysisDTO = {
        commodity,
        period: {
          start: new Date(Date.now() - period * 24 * 60 * 60 * 1000),
          end: new Date()
        },
        priceAnalysis: {
          current: currentPrice,
          average,
          volatility,
          trend: this.determineTrend(prices),
          supportLevel: Math.min(...prices) * 1.02,
          resistanceLevel: Math.max(...prices) * 0.98
        },
        volumeAnalysis: {
          current: volumes[volumes.length - 1] || 0,
          average: volumes.reduce((sum, v) => sum + v, 0) / volumes.length,
          trend: this.determineTrend(volumes)
        },
        technicalIndicators: {
          rsi: this.calculateRSI(prices),
          macd: { signal: 0.5, histogram: 0.2 },
          movingAverages: {
            sma20: this.calculateSMA(prices, 20),
            sma50: this.calculateSMA(prices, Math.min(50, prices.length)),
            ema12: this.calculateEMA(prices, 12),
            ema26: this.calculateEMA(prices, 26)
          }
        },
        fundamentalFactors: [
          'Weather conditions in growing regions',
          'Global supply chain disruptions',
          'Currency exchange rates',
          'Consumer demand patterns'
        ],
        recommendation: this.generateRecommendation(currentPrice, average, volatility)
      };

      return Success(analysis);
    } catch (error) {
      console.error('Error getting market analysis:', error);
      return Failure('Internal server error while getting market analysis', 'INTERNAL_ERROR');
    }
  }

  async getVolatilityAnalysis(
    commodity: string,
    period: number
  ): Promise<Result<{
    currentVolatility: number;
    historicalVolatility: number;
    volatilityTrend: 'increasing' | 'decreasing' | 'stable';
    riskLevel: 'low' | 'medium' | 'high';
    VaR: number;
    recommendations: string[];
  }>> {
    try {
      const historyResult = await this.getPriceHistory(commodity, period);
      if (!historyResult.success) {
        return historyResult;
      }

      const prices = historyResult.data.map(d => d.price?.value || 0);
      const currentVolatility = this.calculateVolatility(prices.slice(-30));
      const historicalVolatility = this.calculateVolatility(prices);
      
      const volatilityTrend = currentVolatility > historicalVolatility * 1.1 ? 'increasing' :
                            currentVolatility < historicalVolatility * 0.9 ? 'decreasing' : 'stable';
      
      const riskLevel = currentVolatility > 0.3 ? 'high' : 
                       currentVolatility > 0.15 ? 'medium' : 'low';
      
      const VaR = this.calculateVaR(prices);
      
      const recommendations = this.generateVolatilityRecommendations(riskLevel, volatilityTrend);

      return Success({
        currentVolatility,
        historicalVolatility,
        volatilityTrend,
        riskLevel,
        VaR,
        recommendations
      });
    } catch (error) {
      console.error('Error getting volatility analysis:', error);
      return Failure('Internal server error while getting volatility analysis', 'INTERNAL_ERROR');
    }
  }

  async comparePricesByRegion(
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
  }>> {
    try {
      const comparisons = [];
      
      for (const region of regions) {
        const regionData = await this.getMarketDataByRegion(commodity, { country: region }, 30);
        if (regionData.success && regionData.data.length > 0) {
          const prices = regionData.data.map(d => d.price?.value || 0);
          const currentPrice = prices[prices.length - 1];
          const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
          
          comparisons.push({
            region,
            currentPrice,
            averagePrice,
            priceAdvantage: ((currentPrice - averagePrice) / averagePrice) * 100
          });
        }
      }

      // Sort by current price to find best regions
      const bestRegions = comparisons
        .sort((a, b) => a.currentPrice - b.currentPrice)
        .slice(0, 3)
        .map(c => c.region);

      // Find arbitrage opportunities
      const arbitrageOpportunities = [];
      for (let i = 0; i < comparisons.length - 1; i++) {
        for (let j = i + 1; j < comparisons.length; j++) {
          const diff = Math.abs(comparisons[i].currentPrice - comparisons[j].currentPrice);
          if (diff > 5) { // Minimum $5 difference for arbitrage
            const buyRegion = comparisons[i].currentPrice < comparisons[j].currentPrice 
              ? comparisons[i].region 
              : comparisons[j].region;
            const sellRegion = comparisons[i].currentPrice > comparisons[j].currentPrice 
              ? comparisons[i].region 
              : comparisons[j].region;
            
            arbitrageOpportunities.push({
              buyRegion,
              sellRegion,
              potentialProfit: diff
            });
          }
        }
      }

      return Success({
        comparisons,
        bestRegions,
        arbitrageOpportunities: arbitrageOpportunities.slice(0, 5) // Top 5 opportunities
      });
    } catch (error) {
      console.error('Error comparing prices by region:', error);
      return Failure('Internal server error while comparing prices by region', 'INTERNAL_ERROR');
    }
  }

  async getSeasonalPatterns(
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
  }>> {
    try {
      // Mock implementation - would analyze historical seasonal data
      const monthlyAverages = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        price: 100 + Math.sin((i + 1) * Math.PI / 6) * 20 + Math.random() * 10,
        volume: 1000 + Math.cos((i + 1) * Math.PI / 6) * 200 + Math.random() * 100
      }));

      const prices = monthlyAverages.map(m => m.price);
      const peakMonth = monthlyAverages.reduce((max, curr) => curr.price > max.price ? curr : max);
      const troughMonth = monthlyAverages.reduce((min, curr) => curr.price < min.price ? curr : min);

      const seasonalTrends = {
        harvest: { start: 4, end: 8, impact: -0.15 }, // April to August, price decrease
        planting: { start: 10, end: 12, impact: 0.05 }, // October to December, slight increase
        peak: { month: peakMonth.month, price: peakMonth.price },
        trough: { month: troughMonth.month, price: troughMonth.price }
      };

      const recommendations = [
        'Consider buying positions during harvest season (April-August) for lower prices',
        'Monitor weather patterns during planting season for early indicators',
        `Peak prices typically occur in ${this.getMonthName(peakMonth.month)}`,
        'Hedge positions before seasonal price swings'
      ];

      return Success({
        monthlyAverages,
        seasonalTrends,
        recommendations
      });
    } catch (error) {
      console.error('Error getting seasonal patterns:', error);
      return Failure('Internal server error while getting seasonal patterns', 'INTERNAL_ERROR');
    }
  }

  async getCorrelationAnalysis(
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
  }>> {
    try {
      // Mock implementation - would calculate actual correlations
      const correlations = compareCommodities.map(commodity => {
        const correlation = (Math.random() - 0.5) * 2; // Random between -1 and 1
        const strength = Math.abs(correlation) > 0.7 ? 'strong' : 
                        Math.abs(correlation) > 0.3 ? 'moderate' : 'weak';
        
        return { commodity, correlation, strength };
      });

      const hedgingOpportunities = correlations
        .filter(c => c.correlation < -0.5)
        .map(c => `Use ${c.commodity} as hedge against ${primaryCommodity} (correlation: ${c.correlation.toFixed(2)})`);

      const diversificationAdvice = correlations
        .filter(c => Math.abs(c.correlation) < 0.3)
        .map(c => `${c.commodity} offers good diversification (low correlation: ${c.correlation.toFixed(2)})`);

      return Success({
        correlations,
        hedgingOpportunities,
        diversificationAdvice
      });
    } catch (error) {
      console.error('Error getting correlation analysis:', error);
      return Failure('Internal server error while getting correlation analysis', 'INTERNAL_ERROR');
    }
  }

  async bulkImportMarketData(
    source: string,
    data: CreateMarketDataDTO[]
  ): Promise<Result<{
    successful: number;
    failed: number;
    errors: string[];
    importedIds: string[];
  }>> {
    try {
      const results = await Promise.allSettled(
        data.map(item => this.createMarketData(item))
      );

      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.length - successful;
      const errors = results
        .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
        .map((r, i) => r.status === 'rejected' ? r.reason : `Row ${i}: ${(r.value as any).error}`)
        .slice(0, 10); // Limit to 10 errors
      
      const importedIds = results
        .filter(r => r.status === 'fulfilled' && r.value.success)
        .map(r => (r.value as any).data.id);

      return Success({
        successful,
        failed,
        errors,
        importedIds
      });
    } catch (error) {
      console.error('Error bulk importing market data:', error);
      return Failure('Internal server error while bulk importing market data', 'INTERNAL_ERROR');
    }
  }

  async getDataQualityMetrics(): Promise<Result<{
    coverage: { commodity: string; percentage: number }[];
    freshness: { source: string; lastUpdate: Date; isStale: boolean }[];
    reliability: { source: string; score: number }[];
    issues: string[];
  }>> {
    try {
      // Mock implementation - would analyze actual data quality
      const coverage = [
        { commodity: 'arabica', percentage: 95 },
        { commodity: 'robusta', percentage: 88 },
        { commodity: 'specialty', percentage: 72 }
      ];

      const freshness = [
        { source: 'ICE', lastUpdate: new Date(Date.now() - 60000), isStale: false },
        { source: 'CEPEA', lastUpdate: new Date(Date.now() - 3600000), isStale: false },
        { source: 'Yahoo Finance', lastUpdate: new Date(Date.now() - 7200000), isStale: true }
      ];

      const reliability = [
        { source: 'ICE', score: 0.98 },
        { source: 'CEPEA', score: 0.95 },
        { source: 'Yahoo Finance', score: 0.85 }
      ];

      const issues = [
        'Yahoo Finance data is stale (>2 hours old)',
        'Specialty coffee coverage below 75%',
        'Missing weather data for some regions'
      ];

      return Success({
        coverage,
        freshness,
        reliability,
        issues
      });
    } catch (error) {
      console.error('Error getting data quality metrics:', error);
      return Failure('Internal server error while getting data quality metrics', 'INTERNAL_ERROR');
    }
  }

  async subscribeToRealTimeData(
    commodities: string[],
    callback: (data: MarketDataDTO) => void
  ): Promise<Result<{ subscriptionId: string }>> {
    try {
      // Mock implementation - would integrate with real-time data providers
      const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate periodic updates
      const interval = setInterval(() => {
        commodities.forEach(commodity => {
          const mockData: MarketDataDTO = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            commodity,
            type: 'price',
            source: 'realtime-feed',
            date: new Date(),
            timestamp: new Date(),
            price: {
              value: 100 + Math.random() * 50,
              currency: 'USD',
              unit: 'bag'
            },
            trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
            reliability: 0.95,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          callback(mockData);
        });
      }, 5000); // Update every 5 seconds

      // Store interval for cleanup
      (this as any)[subscriptionId] = interval;

      return Success({ subscriptionId });
    } catch (error) {
      console.error('Error subscribing to real-time data:', error);
      return Failure('Internal server error while subscribing to real-time data', 'INTERNAL_ERROR');
    }
  }

  async unsubscribeFromRealTimeData(subscriptionId: string): Promise<Result<boolean>> {
    try {
      const interval = (this as any)[subscriptionId];
      if (interval) {
        clearInterval(interval);
        delete (this as any)[subscriptionId];
        return Success(true);
      }
      
      return Failure('Subscription not found', 'NOT_FOUND');
    } catch (error) {
      console.error('Error unsubscribing from real-time data:', error);
      return Failure('Internal server error while unsubscribing from real-time data', 'INTERNAL_ERROR');
    }
  }

  async getMarketSentiment(
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
  }>> {
    try {
      // Mock implementation - would integrate with sentiment analysis services
      const sentimentValue = Math.random() - 0.5; // -0.5 to 0.5
      const overall: 'bullish' | 'bearish' | 'neutral' = 
        sentimentValue > 0.1 ? 'bullish' : 
        sentimentValue < -0.1 ? 'bearish' : 'neutral';

      const confidence = 0.7 + Math.random() * 0.3;

      const sources = {
        news: { sentiment: overall, count: 45 },
        social: { sentiment: overall, count: 128 },
        analyst: { sentiment: overall, count: 12 }
      };

      const keyFactors = [
        'Weather conditions in Brazil',
        'USD/BRL exchange rate movements',
        'Global supply chain updates',
        'Consumer demand patterns'
      ];

      const sentimentHistory = Array.from({ length: days || 30 }, (_, i) => ({
        date: new Date(Date.now() - (days || 30 - i) * 24 * 60 * 60 * 1000),
        sentiment: (Math.random() - 0.5) * 2
      }));

      return Success({
        overall,
        confidence,
        sources,
        keyFactors,
        sentimentHistory
      });
    } catch (error) {
      console.error('Error getting market sentiment:', error);
      return Failure('Internal server error while getting market sentiment', 'INTERNAL_ERROR');
    }
  }

  // Private helper methods
  private calculateVolatilityIndex(percentage: number): number {
    return Math.abs(percentage) / 100; // Simple volatility index
  }

  private determineTrend(values: number[]): 'bullish' | 'bearish' | 'neutral' {
    if (values.length < 2) return 'neutral';
    
    const start = values[0];
    const end = values[values.length - 1];
    const change = (end - start) / start;
    
    return change > 0.05 ? 'bullish' : change < -0.05 ? 'bearish' : 'neutral';
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50; // Default RSI
    
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i-1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const avgGain = gains.slice(-period).reduce((sum, g) => sum + g, 0) / period;
    const avgLoss = losses.slice(-period).reduce((sum, l) => sum + l, 0) / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    
    const slice = prices.slice(-period);
    return slice.reduce((sum, p) => sum + p, 0) / slice.length;
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    if (prices.length === 1) return prices[0];
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private generateRecommendation(
    currentPrice: number, 
    average: number, 
    volatility: number
  ): 'buy' | 'sell' | 'hold' {
    const priceRatio = currentPrice / average;
    
    if (priceRatio < 0.95 && volatility < 0.2) return 'buy';
    if (priceRatio > 1.05 && volatility > 0.3) return 'sell';
    return 'hold';
  }

  private calculateVaR(prices: number[], confidence: number = 0.95): number {
    if (prices.length < 2) return 0;
    
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }
    
    returns.sort((a, b) => a - b);
    const index = Math.floor((1 - confidence) * returns.length);
    
    return Math.abs(returns[index] || 0) * prices[prices.length - 1];
  }

  private generateVolatilityRecommendations(
    riskLevel: 'low' | 'medium' | 'high',
    trend: 'increasing' | 'decreasing' | 'stable'
  ): string[] {
    const recommendations = [];
    
    if (riskLevel === 'high') {
      recommendations.push('Consider reducing position sizes due to high volatility');
      recommendations.push('Implement strict stop-loss orders');
      recommendations.push('Diversify across multiple commodities');
    }
    
    if (trend === 'increasing') {
      recommendations.push('Monitor positions more frequently');
      recommendations.push('Consider hedging strategies');
    }
    
    if (riskLevel === 'low' && trend === 'stable') {
      recommendations.push('Good conditions for increasing position sizes');
      recommendations.push('Consider taking advantage of low volatility periods');
    }
    
    return recommendations;
  }

  private getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1] || 'Unknown';
  }
}