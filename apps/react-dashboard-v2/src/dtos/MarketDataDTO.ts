/**
 * Data Transfer Object for Market Data
 * Used to transfer market data between service layers
 */

export interface PriceDataDTO {
  value: number;
  currency: string;
  unit: string; // 'bag', 'kg', 'ton'
  variety?: string;
  grade?: string;
  exchange?: string; // 'ICE', 'BMF', 'CEPEA'
}

export interface WeatherDataDTO {
  temperature: number;
  humidity: number;
  rainfall: number;
  conditions: string;
  windSpeed?: number;
  pressure?: number;
  forecast?: {
    nextWeek: string;
    nextMonth: string;
    seasonal: string;
  };
}

export interface VolumeDataDTO {
  amount: number;
  unit: string;
  period: string; // 'daily', 'weekly', 'monthly', 'yearly'
  type: 'production' | 'export' | 'import' | 'consumption' | 'stock';
}

export interface QualityDataDTO {
  cupping: number;
  defects: number;
  moisture: number;
  screenSize: string;
  certification?: string;
  origin?: string;
}

export interface NewsDataDTO {
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'low' | 'medium' | 'high';
  url?: string;
  keywords: string[];
}

export interface RegionDTO {
  country: string;
  state?: string;
  city?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface MarketDataDTO {
  id: string;
  commodity: string; // 'arabica', 'robusta', 'specialty'
  type: 'price' | 'weather' | 'volume' | 'quality' | 'news';
  source: string; // API source or data provider
  date: Date;
  timestamp: Date;
  region?: RegionDTO;
  
  // Data payload based on type
  price?: PriceDataDTO;
  weather?: WeatherDataDTO;
  volume?: VolumeDataDTO;
  quality?: QualityDataDTO;
  news?: NewsDataDTO;
  
  // Market indicators
  trend: 'bullish' | 'bearish' | 'neutral';
  volatility?: number;
  volume24h?: number;
  marketCap?: number;
  
  // Metadata
  reliability: number; // 0-1 score
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketTrendsDTO {
  priceChange: {
    value: number;
    percentage: number;
    period: string;
  };
  volumeChange: {
    value: number;
    percentage: number;
    period: string;
  };
  qualityTrend: 'improving' | 'declining' | 'stable';
  weatherImpact: 'positive' | 'negative' | 'neutral';
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  volatilityIndex: number;
}

export interface MarketForecastDTO {
  horizon: 'short' | 'medium' | 'long'; // 1w, 1m, 6m
  confidence: number; // 0-1
  scenarios: {
    optimistic: {
      probability: number;
      priceRange: { min: number; max: number };
      factors: string[];
    };
    realistic: {
      probability: number;
      priceRange: { min: number; max: number };
      factors: string[];
    };
    pessimistic: {
      probability: number;
      priceRange: { min: number; max: number };
      factors: string[];
    };
  };
  keyFactors: string[];
  lastUpdated: Date;
}

export interface CreateMarketDataDTO {
  commodity: string;
  type: MarketDataDTO['type'];
  source: string;
  date: Date;
  region?: RegionDTO;
  price?: PriceDataDTO;
  weather?: WeatherDataDTO;
  volume?: VolumeDataDTO;
  quality?: QualityDataDTO;
  news?: NewsDataDTO;
  trend: MarketDataDTO['trend'];
  reliability?: number;
  metadata?: Record<string, any>;
}

export interface UpdateMarketDataDTO {
  trend?: MarketDataDTO['trend'];
  volatility?: number;
  reliability?: number;
  metadata?: Record<string, any>;
}

export interface MarketDataFilterDTO {
  commodity?: string;
  type?: MarketDataDTO['type'];
  source?: string;
  startDate?: Date;
  endDate?: Date;
  region?: Partial<RegionDTO>;
  trend?: MarketDataDTO['trend'];
  minReliability?: number;
}