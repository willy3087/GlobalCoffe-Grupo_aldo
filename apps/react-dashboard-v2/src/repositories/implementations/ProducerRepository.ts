import { Result, Success, Failure } from '../../types/Result';
import { BaseRepository, HttpConfig } from '../base/BaseRepository';
import { IProducerRepository, ProducerFilter, ProducerStats } from '../interfaces/IProducerRepository';
import { Producer } from '../../domains/coffee-market/entities/Producer';

/**
 * Producer repository implementation with domain-specific operations
 */
export class ProducerRepository extends BaseRepository<Producer> implements IProducerRepository {
  
  constructor(config: HttpConfig) {
    super('producers', config);
  }

  /**
   * Find producers by location (state or city)
   */
  async findByLocation(state: string, city?: string): Promise<Result<Producer[]>> {
    const queryParams = { state, ...(city && { city }) };
    return this.fetchWithQuery<Producer[]>('by-location', queryParams);
  }

  /**
   * Find producers by farm size range
   */
  async findByFarmSizeRange(minSize: number, maxSize: number): Promise<Result<Producer[]>> {
    const queryParams = { minSize, maxSize };
    return this.fetchWithQuery<Producer[]>('by-farm-size', queryParams);
  }

  /**
   * Find producers by coffee variety
   */
  async findByCoffeeVariety(variety: string): Promise<Result<Producer[]>> {
    const queryParams = { variety };
    return this.fetchWithQuery<Producer[]>('by-coffee-variety', queryParams);
  }

  /**
   * Find producers by certification
   */
  async findByCertification(certification: string): Promise<Result<Producer[]>> {
    const queryParams = { certification };
    return this.fetchWithQuery<Producer[]>('by-certification', queryParams);
  }

  /**
   * Find producers by production capacity range
   */
  async findByProductionCapacity(minCapacity: number, maxCapacity: number): Promise<Result<Producer[]>> {
    const queryParams = { minCapacity, maxCapacity };
    return this.fetchWithQuery<Producer[]>('by-production-capacity', queryParams);
  }

  /**
   * Find producers by multiple filters
   */
  async findByFilters(filters: ProducerFilter): Promise<Result<Producer[]>> {
    return this.fetchWithQuery<Producer[]>('filter', filters);
  }

  /**
   * Update producer's quality metrics
   */
  async updateQualityMetrics(id: string, quality: Partial<Producer['quality']>): Promise<Result<Producer>> {
    try {
      const url = `${this.config.baseUrl}/${this.resourcePath}/${id}/quality`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.config.headers,
        body: JSON.stringify(quality),
        signal: this.createTimeoutSignal()
      });

      if (!response.ok) {
        return Failure(`HTTP Error: ${response.status} - ${response.statusText}`, `HTTP_${response.status}`);
      }

      const data = await response.json();
      return Success(data);
    } catch (error) {
      return this.handleError(error, 'updateQualityMetrics');
    }
  }

  /**
   * Update producer's production capacity
   */
  async updateProductionCapacity(id: string, capacity: Partial<Producer['capacity']>): Promise<Result<Producer>> {
    try {
      const url = `${this.config.baseUrl}/${this.resourcePath}/${id}/capacity`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.config.headers,
        body: JSON.stringify(capacity),
        signal: this.createTimeoutSignal()
      });

      if (!response.ok) {
        return Failure(`HTTP Error: ${response.status} - ${response.statusText}`, `HTTP_${response.status}`);
      }

      const data = await response.json();
      return Success(data);
    } catch (error) {
      return this.handleError(error, 'updateProductionCapacity');
    }
  }

  /**
   * Get producers statistics by region
   */
  async getStatsByRegion(state: string): Promise<Result<ProducerStats>> {
    const queryParams = { state };
    return this.fetchWithQuery<ProducerStats>('stats/region', queryParams);
  }

  /**
   * Get producers with upcoming harvest
   */
  async findWithUpcomingHarvest(daysAhead: number = 30): Promise<Result<Producer[]>> {
    const queryParams = { daysAhead };
    return this.fetchWithQuery<Producer[]>('upcoming-harvest', queryParams);
  }

  /**
   * Get top performers by efficiency ratio
   */
  async getTopPerformers(limit: number = 10): Promise<Result<Producer[]>> {
    const queryParams = { limit };
    return this.fetchWithQuery<Producer[]>('top-performers', queryParams);
  }

  /**
   * Search producers by name or document
   */
  async search(query: string): Promise<Result<Producer[]>> {
    const queryParams = { q: query };
    return this.fetchWithQuery<Producer[]>('search', queryParams);
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

  /**
   * Get producers by harvest season for reporting
   */
  async getProducersByHarvestSeason(season: string): Promise<Result<Producer[]>> {
    const queryParams = { season };
    return this.fetchWithQuery<Producer[]>('by-harvest-season', queryParams);
  }

  /**
   * Get comprehensive producer analytics
   */
  async getAnalytics(): Promise<Result<{
    totalProducers: number;
    activeProducers: number;
    averageProductionCapacity: number;
    totalFarmArea: number;
    certificationDistribution: { [key: string]: number };
    regionDistribution: { [key: string]: number };
    qualityDistribution: {
      excellent: number; // >90
      good: number; // 80-90
      average: number; // 70-80
      needsImprovement: number; // <70
    };
  }>> {
    return this.fetchWithQuery('analytics');
  }
}