import { Result } from '../../types/Result';
import { IRepository } from './IRepository';
import { Producer } from '../../domains/coffee-market/entities/Producer';

export interface ProducerFilter {
  state?: string;
  city?: string;
  farmSizeMin?: number;
  farmSizeMax?: number;
  coffeeVariety?: string;
  certification?: string;
  productionCapacityMin?: number;
  productionCapacityMax?: number;
  status?: 'active' | 'inactive' | 'pending';
}

export interface ProducerStats {
  totalProducers: number;
  averageFarmSize: number;
  totalProductionCapacity: number;
  topCertifications: { name: string; count: number }[];
  averageQuality?: number;
  activeProducers: number;
}

/**
 * Specific repository interface for Producer entities
 * Extends the base repository with domain-specific operations
 */
export interface IProducerRepository extends IRepository<Producer> {
  /**
   * Find producers by location (state or city)
   */
  findByLocation(state: string, city?: string): Promise<Result<Producer[]>>;

  /**
   * Find producers by farm size range
   */
  findByFarmSizeRange(minSize: number, maxSize: number): Promise<Result<Producer[]>>;

  /**
   * Find producers by coffee variety
   */
  findByCoffeeVariety(variety: string): Promise<Result<Producer[]>>;

  /**
   * Find producers by certification
   */
  findByCertification(certification: string): Promise<Result<Producer[]>>;

  /**
   * Find producers by production capacity range
   */
  findByProductionCapacity(minCapacity: number, maxCapacity: number): Promise<Result<Producer[]>>;

  /**
   * Find producers by multiple filters
   */
  findByFilters(filters: ProducerFilter): Promise<Result<Producer[]>>;

  /**
   * Update producer's quality metrics
   */
  updateQualityMetrics(id: string, quality: Partial<Producer['quality']>): Promise<Result<Producer>>;

  /**
   * Update producer's production capacity
   */
  updateProductionCapacity(id: string, capacity: Partial<Producer['capacity']>): Promise<Result<Producer>>;

  /**
   * Get producers statistics by region
   */
  getStatsByRegion(state: string): Promise<Result<ProducerStats>>;

  /**
   * Get producers with upcoming harvest
   */
  findWithUpcomingHarvest(daysAhead?: number): Promise<Result<Producer[]>>;

  /**
   * Get top performers by efficiency ratio
   */
  getTopPerformers(limit?: number): Promise<Result<Producer[]>>;

  /**
   * Search producers by name or document
   */
  search(query: string): Promise<Result<Producer[]>>;
}