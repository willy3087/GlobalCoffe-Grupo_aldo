/**
 * Analytics Service Interface
 * Defines contract for analytics and KPI business logic operations
 */

import { Result } from '../../types/Result';
import { 
  AnalyticsDTO, 
  CreateAnalyticsRequestDTO, 
  UpdateAnalyticsDTO,
  AnalyticsFilterDTO,
  ComparisonAnalyticsDTO,
  ScenarioAnalysisDTO,
  KPIMetricDTO,
  ProductionAnalyticsDTO,
  FinancialAnalyticsDTO,
  SustainabilityAnalyticsDTO,
  MarketAnalyticsDTO,
  RiskAnalyticsDTO
} from '../../dtos/AnalyticsDTO';

export interface DashboardKPIsDTO {
  producer: {
    totalProducers: KPIMetricDTO;
    activeProducers: KPIMetricDTO;
    averageYield: KPIMetricDTO;
    sustainabilityScore: KPIMetricDTO;
  };
  production: {
    totalProduction: KPIMetricDTO;
    qualityIndex: KPIMetricDTO;
    efficiency: KPIMetricDTO;
    capacity: KPIMetricDTO;
  };
  financial: {
    totalRevenue: KPIMetricDTO;
    averagePrice: KPIMetricDTO;
    profitMargin: KPIMetricDTO;
    costPerBag: KPIMetricDTO;
  };
  market: {
    marketShare: KPIMetricDTO;
    priceCompetitiveness: KPIMetricDTO;
    demandIndex: KPIMetricDTO;
    volatility: KPIMetricDTO;
  };
  sustainability: {
    carbonFootprint: KPIMetricDTO;
    waterUsage: KPIMetricDTO;
    certificationRate: KPIMetricDTO;
    socialImpact: KPIMetricDTO;
  };
}

export interface ReportConfigDTO {
  type: 'producer' | 'regional' | 'market' | 'sustainability' | 'financial';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  period: {
    start: Date;
    end: Date;
  };
  filters: {
    producers?: string[];
    regions?: string[];
    commodities?: string[];
    certifications?: string[];
  };
  sections: string[];
  template?: string;
  branding?: {
    logo?: string;
    colors?: string[];
    companyName?: string;
  };
}

export interface CustomKPIDTO {
  id: string;
  name: string;
  description: string;
  formula: string;
  unit: string;
  category: 'production' | 'financial' | 'sustainability' | 'quality' | 'market';
  targetValue?: number;
  thresholds: {
    excellent: number;
    good: number;
    warning: number;
    critical: number;
  };
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface PredictiveModelDTO {
  id: string;
  name: string;
  type: 'price_prediction' | 'yield_forecast' | 'quality_prediction' | 'risk_assessment';
  algorithm: string;
  accuracy: number;
  lastTrained: Date;
  features: string[];
  predictions: {
    horizon: string;
    value: number;
    confidence: number;
    factors: { name: string; impact: number }[];
  }[];
}

export interface IAnalyticsService {
  /**
   * Calculate comprehensive KPIs for a specific producer
   */
  calculateProducerKPIs(producerId: string, period?: { start: Date; end: Date }): Promise<Result<AnalyticsDTO>>;

  /**
   * Get market comparison analysis for a producer
   */
  getMarketComparison(producerId: string, comparisonType?: 'peer' | 'regional' | 'national'): Promise<Result<ComparisonAnalyticsDTO>>;

  /**
   * Get sustainability analytics with benchmarking
   */
  getSustainabilityAnalytics(producerId: string): Promise<Result<SustainabilityAnalyticsDTO>>;

  /**
   * Get revenue and profitability projections
   */
  getRevenueProjection(producerId: string, months: number): Promise<Result<{
    monthly: { month: Date; revenue: number; costs: number; profit: number }[];
    summary: {
      totalRevenue: number;
      totalCosts: number;
      totalProfit: number;
      averageMargin: number;
    };
    confidence: number;
    assumptions: string[];
    risks: string[];
  }>>;

  /**
   * Get dashboard KPIs for overview
   */
  getDashboardKPIs(
    filters?: {
      region?: string;
      dateRange?: { start: Date; end: Date };
      producers?: string[];
    }
  ): Promise<Result<DashboardKPIsDTO>>;

  /**
   * Create custom analytics report
   */
  createAnalyticsReport(config: ReportConfigDTO): Promise<Result<{
    reportId: string;
    downloadUrl: string;
    expiresAt: Date;
  }>>;

  /**
   * Get real-time analytics updates
   */
  getRealTimeAnalytics(producerId?: string): Promise<Result<{
    lastUpdated: Date;
    keyMetrics: { name: string; value: number; change: number }[];
    alerts: { severity: string; message: string; timestamp: Date }[];
    trends: { metric: string; trend: 'up' | 'down' | 'stable'; confidence: number }[];
  }>>;

  /**
   * Get scenario analysis for strategic planning
   */
  getScenarioAnalysis(
    producerId: string,
    scenarios: { name: string; assumptions: Record<string, any> }[]
  ): Promise<Result<ScenarioAnalysisDTO>>;

  /**
   * Get performance benchmarking against industry standards
   */
  getBenchmarkingAnalysis(
    producerId: string,
    benchmarkType: 'industry' | 'regional' | 'size' | 'certification'
  ): Promise<Result<{
    producer: Record<string, number>;
    benchmark: Record<string, number>;
    percentiles: Record<string, number>;
    ranking: {
      overall: number;
      totalParticipants: number;
      category: string;
    };
    improvementAreas: {
      metric: string;
      gap: number;
      priority: 'high' | 'medium' | 'low';
      recommendations: string[];
    }[];
  }>>;

  /**
   * Get predictive analytics using ML models
   */
  getPredictiveAnalytics(
    producerId: string,
    models: ('price' | 'yield' | 'quality' | 'risk')[]
  ): Promise<Result<{
    predictions: PredictiveModelDTO[];
    confidence: number;
    recommendations: string[];
    nextReviewDate: Date;
  }>>;

  /**
   * Create custom KPI definition
   */
  createCustomKPI(kpi: Omit<CustomKPIDTO, 'id' | 'createdAt'>): Promise<Result<CustomKPIDTO>>;

  /**
   * Update custom KPI definition
   */
  updateCustomKPI(id: string, updates: Partial<CustomKPIDTO>): Promise<Result<CustomKPIDTO>>;

  /**
   * Calculate custom KPI values for a producer
   */
  calculateCustomKPI(kpiId: string, producerId: string, period?: { start: Date; end: Date }): Promise<Result<{
    value: number;
    target?: number;
    performance: 'excellent' | 'good' | 'warning' | 'critical';
    trend: 'improving' | 'stable' | 'declining';
    history: { date: Date; value: number }[];
  }>>;

  /**
   * Get analytics alerts and notifications
   */
  getAnalyticsAlerts(
    producerId?: string,
    severity?: 'info' | 'warning' | 'critical'
  ): Promise<Result<{
    id: string;
    type: 'threshold' | 'anomaly' | 'trend' | 'forecast';
    severity: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    metric: string;
    currentValue: number;
    threshold?: number;
    recommendations: string[];
    createdAt: Date;
    isRead: boolean;
  }[]>>;

  /**
   * Get time series analysis for any metric
   */
  getTimeSeriesAnalysis(
    metric: string,
    producerId?: string,
    period?: { start: Date; end: Date }
  ): Promise<Result<{
    data: { timestamp: Date; value: number }[];
    trend: {
      direction: 'upward' | 'downward' | 'stable';
      strength: number;
      seasonality: boolean;
      changePoints: Date[];
    };
    forecast: {
      next30Days: { date: Date; value: number; confidence: number }[];
      next90Days: { date: Date; value: number; confidence: number }[];
    };
    insights: string[];
  }>>;

  /**
   * Get correlation analysis between metrics
   */
  getCorrelationAnalysis(
    metrics: string[],
    producerId?: string,
    period?: { start: Date; end: Date }
  ): Promise<Result<{
    correlations: {
      metric1: string;
      metric2: string;
      correlation: number;
      significance: number;
      relationship: 'strong' | 'moderate' | 'weak' | 'none';
    }[];
    insights: string[];
    recommendations: string[];
  }>>;

  /**
   * Get advanced analytics filters and segments
   */
  getAnalyticsSegments(
    criteria: {
      metrics?: string[];
      thresholds?: Record<string, { min?: number; max?: number }>;
      regions?: string[];
      certifications?: string[];
      period?: { start: Date; end: Date };
    }
  ): Promise<Result<{
    segments: {
      name: string;
      description: string;
      producers: string[];
      characteristics: Record<string, any>;
      performance: Record<string, number>;
    }[];
    insights: string[];
    opportunities: string[];
  }>>;

  /**
   * Export analytics data in various formats
   */
  exportAnalyticsData(
    type: 'kpis' | 'trends' | 'benchmarks' | 'forecasts',
    filters: AnalyticsFilterDTO,
    format: 'csv' | 'excel' | 'json' | 'pdf'
  ): Promise<Result<{
    data: Buffer | string;
    filename: string;
    mimeType: string;
  }>>;

  /**
   * Get analytics data quality assessment
   */
  getDataQualityAssessment(): Promise<Result<{
    overall: {
      score: number;
      status: 'excellent' | 'good' | 'fair' | 'poor';
    };
    metrics: {
      completeness: number;
      accuracy: number;
      timeliness: number;
      consistency: number;
    };
    issues: {
      type: string;
      severity: 'high' | 'medium' | 'low';
      description: string;
      affectedMetrics: string[];
      recommendation: string;
    }[];
    lastAssessment: Date;
  }>>;
}