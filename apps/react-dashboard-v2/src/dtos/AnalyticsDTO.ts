/**
 * Data Transfer Object for Analytics
 * Used to transfer analytics data between service layers
 */

export interface KPIMetricDTO {
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
}

export interface ProductionAnalyticsDTO {
  totalProduction: KPIMetricDTO;
  averageYield: KPIMetricDTO;
  productionEfficiency: KPIMetricDTO;
  qualityScore: KPIMetricDTO;
  harvestForecast: {
    nextHarvest: Date;
    expectedVolume: number;
    confidence: number;
  };
}

export interface FinancialAnalyticsDTO {
  revenue: KPIMetricDTO;
  costs: KPIMetricDTO;
  profit: KPIMetricDTO;
  profitMargin: KPIMetricDTO;
  breakEvenPrice: number;
  costBreakdown: {
    labor: number;
    inputs: number;
    processing: number;
    logistics: number;
    overhead: number;
  };
}

export interface SustainabilityAnalyticsDTO {
  overallScore: KPIMetricDTO;
  carbonFootprint: KPIMetricDTO;
  waterUsage: KPIMetricDTO;
  energyEfficiency: KPIMetricDTO;
  wasteReduction: KPIMetricDTO;
  certificationStatus: {
    organic: boolean;
    rainforest: boolean;
    fairtrade: boolean;
    utz: boolean;
  };
}

export interface MarketAnalyticsDTO {
  marketPosition: 'leader' | 'follower' | 'challenger' | 'niche';
  competitiveIndex: number;
  marketShare: number;
  priceCompetitiveness: number;
  qualityRanking: number;
  brandStrength: number;
  customerSatisfaction: number;
}

export interface RiskAnalyticsDTO {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  climateRisk: number;
  marketRisk: number;
  operationalRisk: number;
  financialRisk: number;
  riskFactors: string[];
  mitigation: string[];
}

export interface BenchmarkDTO {
  metric: string;
  value: number;
  benchmark: number;
  percentile: number;
  status: 'above' | 'at' | 'below';
}

export interface AnalyticsDTO {
  producerId: string;
  periodStart: Date;
  periodEnd: Date;
  
  // Core analytics
  production: ProductionAnalyticsDTO;
  financial: FinancialAnalyticsDTO;
  sustainability: SustainabilityAnalyticsDTO;
  market: MarketAnalyticsDTO;
  risk: RiskAnalyticsDTO;
  
  // Benchmarking
  benchmarks: BenchmarkDTO[];
  industryRanking: {
    overall: number;
    production: number;
    quality: number;
    sustainability: number;
  };
  
  // Projections
  projections: {
    nextQuarter: {
      revenue: number;
      production: number;
      profitMargin: number;
    };
    nextYear: {
      revenue: number;
      production: number;
      profitMargin: number;
    };
    confidence: number;
  };
  
  // Recommendations
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    category: 'production' | 'financial' | 'market' | 'sustainability';
    title: string;
    description: string;
    expectedImpact: string;
    timeframe: string;
  }[];
  
  // Metadata
  calculatedAt: Date;
  dataQuality: number; // 0-1 score
  methodology: string;
}

export interface ComparisonAnalyticsDTO {
  producerId: string;
  comparisonType: 'peer' | 'regional' | 'national' | 'historical';
  
  comparisons: {
    metric: string;
    producer: number;
    comparison: number;
    difference: number;
    differencePercentage: number;
    status: 'better' | 'similar' | 'worse';
  }[];
  
  summary: {
    strongAreas: string[];
    improvementAreas: string[];
    overallPerformance: 'excellent' | 'good' | 'average' | 'below_average';
  };
  
  generatedAt: Date;
}

export interface ScenarioAnalysisDTO {
  producerId: string;
  scenarios: {
    name: string;
    description: string;
    probability: number;
    assumptions: Record<string, any>;
    outcomes: {
      revenue: number;
      production: number;
      costs: number;
      profitMargin: number;
    };
  }[];
  
  recommendations: {
    bestCase: string[];
    worstCase: string[];
    mostLikely: string[];
  };
  
  riskMitigation: {
    strategy: string;
    cost: number;
    effectiveness: number;
  }[];
}

export interface CreateAnalyticsRequestDTO {
  producerId: string;
  periodStart: Date;
  periodEnd: Date;
  includeProjections?: boolean;
  includeBenchmarks?: boolean;
  includeRecommendations?: boolean;
  comparisonType?: 'peer' | 'regional' | 'national';
}

export interface UpdateAnalyticsDTO {
  recommendations?: AnalyticsDTO['recommendations'];
  projections?: Partial<AnalyticsDTO['projections']>;
  dataQuality?: number;
}

export interface AnalyticsFilterDTO {
  producerId?: string;
  startDate?: Date;
  endDate?: Date;
  minDataQuality?: number;
  categories?: ('production' | 'financial' | 'market' | 'sustainability')[];
}