/**
 * Producer Service Interface
 * Defines contract for producer business logic operations
 */

import { Result } from '../../types/Result';
import { 
  ProducerDTO, 
  CreateProducerDTO, 
  UpdateProducerDTO,
  LocationDTO,
  SustainabilityMetricsDTO
} from '../../dtos/ProducerDTO';

export interface ProducerSearchCriteria {
  region?: string;
  minArea?: number;
  maxArea?: number;
  certifications?: string[];
  minSustainabilityScore?: number;
  status?: 'active' | 'inactive' | 'pending';
  coffeeVariety?: string;
}

export interface ProducerRankingCriteria {
  by: 'sustainability' | 'production' | 'quality' | 'efficiency';
  order: 'asc' | 'desc';
  limit?: number;
  region?: string;
}

export interface ProducerStatsDTO {
  totalProducers: number;
  totalArea: number;
  averageSustainabilityScore: number;
  topCertifications: { name: string; count: number }[];
  regionDistribution: { region: string; count: number }[];
  qualityDistribution: {
    excellent: number; // >90
    good: number; // 80-90
    average: number; // 70-80
    needsImprovement: number; // <70
  };
}

export interface IProducerService {
  /**
   * Create a new producer with validation and business rules
   */
  createProducer(producer: CreateProducerDTO): Promise<Result<ProducerDTO>>;

  /**
   * Get producer by ID with full details
   */
  getProducerById(id: string): Promise<Result<ProducerDTO>>;

  /**
   * Get all producers with optional filtering
   */
  getAllProducers(criteria?: ProducerSearchCriteria): Promise<Result<ProducerDTO[]>>;

  /**
   * Update producer information with validation
   */
  updateProducer(id: string, producer: UpdateProducerDTO): Promise<Result<ProducerDTO>>;

  /**
   * Soft delete producer (change status to inactive)
   */
  deleteProducer(id: string): Promise<Result<boolean>>;

  /**
   * Get producers by region with aggregated data
   */
  getProducersByRegion(region: string): Promise<Result<{
    producers: ProducerDTO[];
    stats: {
      totalProducers: number;
      totalArea: number;
      averageYield: number;
      topCertifications: string[];
    };
  }>>;

  /**
   * Get sustainability rankings for producers
   */
  getSustainabilityRankings(criteria?: ProducerRankingCriteria): Promise<Result<{
    producers: ProducerDTO[];
    benchmark: {
      average: number;
      median: number;
      topPercentile: number;
    };
  }>>;

  /**
   * Search producers by name, location, or document
   */
  searchProducers(query: string, limit?: number): Promise<Result<ProducerDTO[]>>;

  /**
   * Get producers with upcoming harvest
   */
  getProducersWithUpcomingHarvest(daysAhead?: number): Promise<Result<ProducerDTO[]>>;

  /**
   * Get top performing producers by efficiency
   */
  getTopPerformers(limit?: number, region?: string): Promise<Result<ProducerDTO[]>>;

  /**
   * Get comprehensive producer statistics
   */
  getProducerStats(region?: string): Promise<Result<ProducerStatsDTO>>;

  /**
   * Update producer sustainability metrics
   */
  updateSustainabilityMetrics(
    id: string, 
    metrics: Partial<SustainabilityMetricsDTO>
  ): Promise<Result<ProducerDTO>>;

  /**
   * Add certification to producer
   */
  addCertification(id: string, certification: string): Promise<Result<ProducerDTO>>;

  /**
   * Remove certification from producer
   */
  removeCertification(id: string, certification: string): Promise<Result<ProducerDTO>>;

  /**
   * Validate producer data before operations
   */
  validateProducerData(producer: CreateProducerDTO | UpdateProducerDTO): Promise<Result<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>>;

  /**
   * Calculate producer efficiency metrics
   */
  calculateEfficiencyMetrics(id: string): Promise<Result<{
    yieldPerHectare: number;
    costPerBag: number;
    profitabilityIndex: number;
    sustainabilityIndex: number;
    overallEfficiency: number;
  }>>;

  /**
   * Get producers requiring attention (low performance, expired certifications, etc.)
   */
  getProducersRequiringAttention(): Promise<Result<{
    lowPerformance: ProducerDTO[];
    expiredCertifications: ProducerDTO[];
    inactiveProducers: ProducerDTO[];
    sustainabilityIssues: ProducerDTO[];
  }>>;

  /**
   * Export producer data for reporting
   */
  exportProducerData(
    format: 'csv' | 'excel' | 'json',
    criteria?: ProducerSearchCriteria
  ): Promise<Result<{
    data: string | Buffer;
    filename: string;
    mimeType: string;
  }>>;

  /**
   * Bulk import producers from file
   */
  bulkImportProducers(
    fileData: Buffer,
    format: 'csv' | 'excel' | 'json'
  ): Promise<Result<{
    successful: number;
    failed: number;
    errors: { row: number; message: string }[];
    importedIds: string[];
  }>>;

  /**
   * Get producer performance trends over time
   */
  getPerformanceTrends(
    id: string,
    startDate: Date,
    endDate: Date
  ): Promise<Result<{
    production: { date: Date; value: number }[];
    quality: { date: Date; value: number }[];
    sustainability: { date: Date; value: number }[];
    profitability: { date: Date; value: number }[];
  }>>;
}