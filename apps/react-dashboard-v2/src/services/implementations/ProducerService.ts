/**
 * Producer Service Implementation
 * Implements business logic for producer operations
 */

import { Result, Success, Failure } from '../../types/Result';
import { IProducerRepository } from '../../repositories/interfaces/IProducerRepository';
import { 
  IProducerService, 
  ProducerSearchCriteria, 
  ProducerRankingCriteria,
  ProducerStatsDTO
} from '../interfaces/IProducerService';
import {
  ProducerDTO,
  CreateProducerDTO,
  UpdateProducerDTO,
  SustainabilityMetricsDTO,
  LocationDTO
} from '../../dtos/ProducerDTO';

export class ProducerService implements IProducerService {
  constructor(private readonly producerRepository: IProducerRepository) {}

  async createProducer(producer: CreateProducerDTO): Promise<Result<ProducerDTO>> {
    try {
      // Validate producer data
      const validation = await this.validateProducerData(producer);
      if (!validation.success) {
        return validation;
      }

      if (!validation.data.isValid) {
        return Failure(`Validation failed: ${validation.data.errors.join(', ')}`, 'VALIDATION_ERROR');
      }

      // Convert DTO to entity format and create
      const producerData = this.mapCreateDTOToEntity(producer);
      const result = await this.producerRepository.create(producerData);

      if (!result.success) {
        return Failure(`Failed to create producer: ${result.error}`, result.code);
      }

      // Convert entity to DTO
      const producerDTO = this.mapEntityToDTO(result.data);
      return Success(producerDTO);
    } catch (error) {
      console.error('Error creating producer:', error);
      return Failure('Internal server error while creating producer', 'INTERNAL_ERROR');
    }
  }

  async getProducerById(id: string): Promise<Result<ProducerDTO>> {
    try {
      if (!id || id.trim() === '') {
        return Failure('Producer ID is required', 'INVALID_ID');
      }

      const result = await this.producerRepository.findById(id);
      if (!result.success) {
        return Failure(`Producer not found: ${result.error}`, result.code);
      }

      if (!result.data) {
        return Failure('Producer not found', 'NOT_FOUND');
      }

      const producerDTO = this.mapEntityToDTO(result.data);
      return Success(producerDTO);
    } catch (error) {
      console.error('Error getting producer:', error);
      return Failure('Internal server error while retrieving producer', 'INTERNAL_ERROR');
    }
  }

  async getAllProducers(criteria?: ProducerSearchCriteria): Promise<Result<ProducerDTO[]>> {
    try {
      let result;
      
      if (criteria) {
        // Apply filters based on criteria
        const filters = this.mapSearchCriteriaToFilters(criteria);
        result = await this.producerRepository.findByFilters(filters);
      } else {
        result = await this.producerRepository.findAll();
      }

      if (!result.success) {
        return Failure(`Failed to retrieve producers: ${result.error}`, result.code);
      }

      const producerDTOs = result.data.map(producer => this.mapEntityToDTO(producer));
      return Success(producerDTOs);
    } catch (error) {
      console.error('Error getting all producers:', error);
      return Failure('Internal server error while retrieving producers', 'INTERNAL_ERROR');
    }
  }

  async updateProducer(id: string, producer: UpdateProducerDTO): Promise<Result<ProducerDTO>> {
    try {
      if (!id || id.trim() === '') {
        return Failure('Producer ID is required', 'INVALID_ID');
      }

      // Validate update data
      const validation = await this.validateProducerData(producer);
      if (!validation.success) {
        return validation;
      }

      if (!validation.data.isValid && validation.data.errors.length > 0) {
        return Failure(`Validation failed: ${validation.data.errors.join(', ')}`, 'VALIDATION_ERROR');
      }

      const updateData = this.mapUpdateDTOToEntity(producer);
      const result = await this.producerRepository.update(id, updateData);

      if (!result.success) {
        return Failure(`Failed to update producer: ${result.error}`, result.code);
      }

      const producerDTO = this.mapEntityToDTO(result.data);
      return Success(producerDTO);
    } catch (error) {
      console.error('Error updating producer:', error);
      return Failure('Internal server error while updating producer', 'INTERNAL_ERROR');
    }
  }

  async deleteProducer(id: string): Promise<Result<boolean>> {
    try {
      if (!id || id.trim() === '') {
        return Failure('Producer ID is required', 'INVALID_ID');
      }

      // Soft delete by updating status to inactive
      const result = await this.updateProducer(id, { status: 'inactive' });
      return Success(result.success);
    } catch (error) {
      console.error('Error deleting producer:', error);
      return Failure('Internal server error while deleting producer', 'INTERNAL_ERROR');
    }
  }

  async getProducersByRegion(region: string): Promise<Result<{
    producers: ProducerDTO[];
    stats: {
      totalProducers: number;
      totalArea: number;
      averageYield: number;
      topCertifications: string[];
    };
  }>> {
    try {
      if (!region || region.trim() === '') {
        return Failure('Region is required', 'INVALID_REGION');
      }

      const result = await this.producerRepository.findByLocation(region);
      if (!result.success) {
        return Failure(`Failed to get producers by region: ${result.error}`, result.code);
      }

      const producers = result.data.map(producer => this.mapEntityToDTO(producer));
      
      // Calculate stats
      const stats = this.calculateRegionStats(producers);

      return Success({ producers, stats });
    } catch (error) {
      console.error('Error getting producers by region:', error);
      return Failure('Internal server error while retrieving producers by region', 'INTERNAL_ERROR');
    }
  }

  async getSustainabilityRankings(criteria?: ProducerRankingCriteria): Promise<Result<{
    producers: ProducerDTO[];
    benchmark: {
      average: number;
      median: number;
      topPercentile: number;
    };
  }>> {
    try {
      const result = await this.getAllProducers();
      if (!result.success) {
        return Failure(`Failed to get sustainability rankings: ${result.error}`, result.code);
      }

      let producers = result.data;
      
      // Filter by region if specified
      if (criteria?.region) {
        producers = producers.filter(p => p.location.region === criteria.region);
      }

      // Sort by sustainability score
      producers.sort((a, b) => {
        const order = criteria?.order === 'asc' ? 1 : -1;
        return (a.sustainabilityScore - b.sustainabilityScore) * order;
      });

      // Apply limit
      if (criteria?.limit) {
        producers = producers.slice(0, criteria.limit);
      }

      // Calculate benchmark
      const scores = producers.map(p => p.sustainabilityScore);
      const benchmark = {
        average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
        median: this.calculateMedian(scores),
        topPercentile: this.calculatePercentile(scores, 0.9)
      };

      return Success({ producers, benchmark });
    } catch (error) {
      console.error('Error getting sustainability rankings:', error);
      return Failure('Internal server error while retrieving sustainability rankings', 'INTERNAL_ERROR');
    }
  }

  async searchProducers(query: string, limit?: number): Promise<Result<ProducerDTO[]>> {
    try {
      if (!query || query.trim() === '') {
        return Failure('Search query is required', 'INVALID_QUERY');
      }

      const result = await this.producerRepository.search(query.trim());
      if (!result.success) {
        return Failure(`Search failed: ${result.error}`, result.code);
      }

      let producers = result.data.map(producer => this.mapEntityToDTO(producer));
      
      if (limit && limit > 0) {
        producers = producers.slice(0, limit);
      }

      return Success(producers);
    } catch (error) {
      console.error('Error searching producers:', error);
      return Failure('Internal server error while searching producers', 'INTERNAL_ERROR');
    }
  }

  async getProducersWithUpcomingHarvest(daysAhead: number = 30): Promise<Result<ProducerDTO[]>> {
    try {
      const result = await this.producerRepository.findWithUpcomingHarvest(daysAhead);
      if (!result.success) {
        return Failure(`Failed to get producers with upcoming harvest: ${result.error}`, result.code);
      }

      const producers = result.data.map(producer => this.mapEntityToDTO(producer));
      return Success(producers);
    } catch (error) {
      console.error('Error getting producers with upcoming harvest:', error);
      return Failure('Internal server error while retrieving producers with upcoming harvest', 'INTERNAL_ERROR');
    }
  }

  async getTopPerformers(limit: number = 10, region?: string): Promise<Result<ProducerDTO[]>> {
    try {
      const result = await this.producerRepository.getTopPerformers(limit);
      if (!result.success) {
        return Failure(`Failed to get top performers: ${result.error}`, result.code);
      }

      let producers = result.data.map(producer => this.mapEntityToDTO(producer));
      
      // Filter by region if specified
      if (region) {
        producers = producers.filter(p => p.location.region === region);
        producers = producers.slice(0, limit); // Re-apply limit after filtering
      }

      return Success(producers);
    } catch (error) {
      console.error('Error getting top performers:', error);
      return Failure('Internal server error while retrieving top performers', 'INTERNAL_ERROR');
    }
  }

  async getProducerStats(region?: string): Promise<Result<ProducerStatsDTO>> {
    try {
      let result;
      
      if (region) {
        result = await this.producerRepository.getStatsByRegion(region);
      } else {
        // Get all producers and calculate stats
        const allProducersResult = await this.getAllProducers();
        if (!allProducersResult.success) {
          return Failure(`Failed to get producer stats: ${allProducersResult.error}`, allProducersResult.code);
        }
        
        const stats = this.calculateOverallStats(allProducersResult.data);
        return Success(stats);
      }

      if (!result.success) {
        return Failure(`Failed to get producer stats: ${result.error}`, result.code);
      }

      return Success(result.data);
    } catch (error) {
      console.error('Error getting producer stats:', error);
      return Failure('Internal server error while retrieving producer stats', 'INTERNAL_ERROR');
    }
  }

  async updateSustainabilityMetrics(
    id: string,
    metrics: Partial<SustainabilityMetricsDTO>
  ): Promise<Result<ProducerDTO>> {
    try {
      const updateData: UpdateProducerDTO = {
        sustainabilityMetrics: metrics,
        sustainabilityScore: metrics.overallScore
      };
      
      return await this.updateProducer(id, updateData);
    } catch (error) {
      console.error('Error updating sustainability metrics:', error);
      return Failure('Internal server error while updating sustainability metrics', 'INTERNAL_ERROR');
    }
  }

  async addCertification(id: string, certification: string): Promise<Result<ProducerDTO>> {
    try {
      const producer = await this.getProducerById(id);
      if (!producer.success) {
        return producer;
      }

      const updatedCertifications = [...producer.data.quality.certifications];
      if (!updatedCertifications.includes(certification)) {
        updatedCertifications.push(certification);
      }

      return await this.updateProducer(id, {
        quality: {
          ...producer.data.quality,
          certifications: updatedCertifications
        }
      });
    } catch (error) {
      console.error('Error adding certification:', error);
      return Failure('Internal server error while adding certification', 'INTERNAL_ERROR');
    }
  }

  async removeCertification(id: string, certification: string): Promise<Result<ProducerDTO>> {
    try {
      const producer = await this.getProducerById(id);
      if (!producer.success) {
        return producer;
      }

      const updatedCertifications = producer.data.quality.certifications.filter(
        cert => cert !== certification
      );

      return await this.updateProducer(id, {
        quality: {
          ...producer.data.quality,
          certifications: updatedCertifications
        }
      });
    } catch (error) {
      console.error('Error removing certification:', error);
      return Failure('Internal server error while removing certification', 'INTERNAL_ERROR');
    }
  }

  async validateProducerData(producer: CreateProducerDTO | UpdateProducerDTO): Promise<Result<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }>> {
    try {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Required field validations for create
      if ('name' in producer) {
        if (!producer.name || producer.name.trim() === '') {
          errors.push('Producer name is required');
        }
        if (producer.name && producer.name.length < 2) {
          errors.push('Producer name must be at least 2 characters long');
        }
      }

      if ('document' in producer) {
        if (!producer.document || producer.document.trim() === '') {
          errors.push('Document number is required');
        }
        // Basic document validation (CPF/CNPJ format)
        if (producer.document && !this.validateDocument(producer.document)) {
          errors.push('Invalid document format');
        }
      }

      // Area validations
      if (producer.totalArea !== undefined) {
        if (producer.totalArea <= 0) {
          errors.push('Total area must be greater than 0');
        }
        if (producer.totalArea > 100000) {
          warnings.push('Total area is unusually large (>100,000 hectares)');
        }
      }

      if (producer.plantedArea !== undefined && producer.totalArea !== undefined) {
        if (producer.plantedArea > producer.totalArea) {
          errors.push('Planted area cannot be greater than total area');
        }
      }

      return Success({
        isValid: errors.length === 0,
        errors,
        warnings
      });
    } catch (error) {
      console.error('Error validating producer data:', error);
      return Failure('Internal server error during validation', 'INTERNAL_ERROR');
    }
  }

  async calculateEfficiencyMetrics(id: string): Promise<Result<{
    yieldPerHectare: number;
    costPerBag: number;
    profitabilityIndex: number;
    sustainabilityIndex: number;
    overallEfficiency: number;
  }>> {
    try {
      const producer = await this.getProducerById(id);
      if (!producer.success) {
        return producer;
      }

      const data = producer.data;
      
      // Calculate metrics
      const yieldPerHectare = data.capacity.estimatedYield;
      const costPerBag = 150; // Mock data - would come from cost calculations
      const profitabilityIndex = data.profitabilityIndex || 0;
      const sustainabilityIndex = data.sustainabilityScore / 100;
      const overallEfficiency = (yieldPerHectare * 0.3 + profitabilityIndex * 0.4 + sustainabilityIndex * 0.3);

      return Success({
        yieldPerHectare,
        costPerBag,
        profitabilityIndex,
        sustainabilityIndex,
        overallEfficiency
      });
    } catch (error) {
      console.error('Error calculating efficiency metrics:', error);
      return Failure('Internal server error while calculating efficiency metrics', 'INTERNAL_ERROR');
    }
  }

  async getProducersRequiringAttention(): Promise<Result<{
    lowPerformance: ProducerDTO[];
    expiredCertifications: ProducerDTO[];
    inactiveProducers: ProducerDTO[];
    sustainabilityIssues: ProducerDTO[];
  }>> {
    try {
      const result = await this.getAllProducers();
      if (!result.success) {
        return result;
      }

      const producers = result.data;
      
      const lowPerformance = producers.filter(p => (p.efficiencyRatio || 0) < 0.5);
      const expiredCertifications = producers.filter(p => 
        p.certifications.some(cert => !cert.isActive || cert.validUntil < new Date())
      );
      const inactiveProducers = producers.filter(p => p.status === 'inactive');
      const sustainabilityIssues = producers.filter(p => p.sustainabilityScore < 50);

      return Success({
        lowPerformance,
        expiredCertifications,
        inactiveProducers,
        sustainabilityIssues
      });
    } catch (error) {
      console.error('Error getting producers requiring attention:', error);
      return Failure('Internal server error while retrieving producers requiring attention', 'INTERNAL_ERROR');
    }
  }

  async exportProducerData(
    format: 'csv' | 'excel' | 'json',
    criteria?: ProducerSearchCriteria
  ): Promise<Result<{
    data: string | Buffer;
    filename: string;
    mimeType: string;
  }>> {
    try {
      const producers = await this.getAllProducers(criteria);
      if (!producers.success) {
        return producers;
      }

      // Mock implementation - would use appropriate libraries for actual export
      const timestamp = new Date().toISOString().split('T')[0];
      
      switch (format) {
        case 'json':
          return Success({
            data: JSON.stringify(producers.data, null, 2),
            filename: `producers_${timestamp}.json`,
            mimeType: 'application/json'
          });
        case 'csv':
          const csvData = this.convertToCSV(producers.data);
          return Success({
            data: csvData,
            filename: `producers_${timestamp}.csv`,
            mimeType: 'text/csv'
          });
        default:
          return Failure('Unsupported export format', 'UNSUPPORTED_FORMAT');
      }
    } catch (error) {
      console.error('Error exporting producer data:', error);
      return Failure('Internal server error while exporting data', 'INTERNAL_ERROR');
    }
  }

  async bulkImportProducers(
    fileData: Buffer,
    format: 'csv' | 'excel' | 'json'
  ): Promise<Result<{
    successful: number;
    failed: number;
    errors: { row: number; message: string }[];
    importedIds: string[];
  }>> {
    try {
      // Mock implementation - would parse actual file data
      return Success({
        successful: 0,
        failed: 0,
        errors: [],
        importedIds: []
      });
    } catch (error) {
      console.error('Error importing producers:', error);
      return Failure('Internal server error while importing producers', 'INTERNAL_ERROR');
    }
  }

  async getPerformanceTrends(
    id: string,
    startDate: Date,
    endDate: Date
  ): Promise<Result<{
    production: { date: Date; value: number }[];
    quality: { date: Date; value: number }[];
    sustainability: { date: Date; value: number }[];
    profitability: { date: Date; value: number }[];
  }>> {
    try {
      // Mock implementation - would fetch historical data
      return Success({
        production: [],
        quality: [],
        sustainability: [],
        profitability: []
      });
    } catch (error) {
      console.error('Error getting performance trends:', error);
      return Failure('Internal server error while retrieving performance trends', 'INTERNAL_ERROR');
    }
  }

  // Private helper methods
  private mapCreateDTOToEntity(dto: CreateProducerDTO): any {
    return {
      name: dto.name,
      farmName: dto.farmName,
      document: dto.document,
      email: dto.email,
      phone: dto.phone,
      location: dto.location,
      totalArea: dto.totalArea,
      plantedArea: dto.plantedArea,
      capacity: dto.capacity,
      certifications: dto.certifications || [],
      status: 'active',
      registrationDate: new Date(),
      lastUpdateDate: new Date()
    };
  }

  private mapUpdateDTOToEntity(dto: UpdateProducerDTO): any {
    const updateData: any = {
      lastUpdateDate: new Date()
    };

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.farmName !== undefined) updateData.farmName = dto.farmName;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.totalArea !== undefined) updateData.totalArea = dto.totalArea;
    if (dto.plantedArea !== undefined) updateData.plantedArea = dto.plantedArea;
    if (dto.capacity !== undefined) updateData.capacity = dto.capacity;
    if (dto.quality !== undefined) updateData.quality = dto.quality;
    if (dto.sustainabilityMetrics !== undefined) updateData.sustainabilityMetrics = dto.sustainabilityMetrics;
    if (dto.status !== undefined) updateData.status = dto.status;

    return updateData;
  }

  private mapEntityToDTO(entity: any): ProducerDTO {
    return {
      id: entity.id,
      name: entity.name,
      farmName: entity.farmName,
      document: entity.document,
      email: entity.email,
      phone: entity.phone,
      location: entity.location,
      totalArea: entity.totalArea,
      plantedArea: entity.plantedArea,
      capacity: entity.capacity,
      quality: entity.quality || {
        averageScore: 0,
        consistency: 0,
        defectRate: 0,
        certifications: []
      },
      productionHistory: entity.productionHistory || [],
      certifications: entity.certifications || [],
      sustainabilityScore: entity.sustainabilityScore || 0,
      sustainabilityMetrics: entity.sustainabilityMetrics || {
        carbonFootprint: 0,
        waterUsage: 0,
        energyEfficiency: 0,
        wasteReduction: 0,
        overallScore: 0
      },
      status: entity.status || 'active',
      registrationDate: entity.registrationDate || new Date(),
      lastUpdateDate: entity.lastUpdateDate || new Date(),
      averageYield: entity.averageYield,
      efficiencyRatio: entity.efficiencyRatio,
      profitabilityIndex: entity.profitabilityIndex,
      marketPosition: entity.marketPosition
    };
  }

  private mapSearchCriteriaToFilters(criteria: ProducerSearchCriteria): any {
    return {
      region: criteria.region,
      farmSizeMin: criteria.minArea,
      farmSizeMax: criteria.maxArea,
      certification: criteria.certifications?.[0], // Simplification
      status: criteria.status
    };
  }

  private calculateRegionStats(producers: ProducerDTO[]): {
    totalProducers: number;
    totalArea: number;
    averageYield: number;
    topCertifications: string[];
  } {
    const totalProducers = producers.length;
    const totalArea = producers.reduce((sum, p) => sum + p.totalArea, 0);
    const averageYield = producers.reduce((sum, p) => sum + p.capacity.estimatedYield, 0) / totalProducers;
    
    const certificationCounts = new Map<string, number>();
    producers.forEach(p => {
      p.quality.certifications.forEach(cert => {
        certificationCounts.set(cert, (certificationCounts.get(cert) || 0) + 1);
      });
    });
    
    const topCertifications = Array.from(certificationCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([cert]) => cert);

    return {
      totalProducers,
      totalArea,
      averageYield: isNaN(averageYield) ? 0 : averageYield,
      topCertifications
    };
  }

  private calculateOverallStats(producers: ProducerDTO[]): ProducerStatsDTO {
    const totalProducers = producers.length;
    const totalArea = producers.reduce((sum, p) => sum + p.totalArea, 0);
    const averageSustainabilityScore = producers.reduce((sum, p) => sum + p.sustainabilityScore, 0) / totalProducers;
    
    // Top certifications
    const certificationCounts = new Map<string, number>();
    producers.forEach(p => {
      p.quality.certifications.forEach(cert => {
        certificationCounts.set(cert, (certificationCounts.get(cert) || 0) + 1);
      });
    });
    
    const topCertifications = Array.from(certificationCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Region distribution
    const regionCounts = new Map<string, number>();
    producers.forEach(p => {
      const region = p.location.region;
      regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
    });
    
    const regionDistribution = Array.from(regionCounts.entries())
      .map(([region, count]) => ({ region, count }));

    // Quality distribution
    const qualityDistribution = {
      excellent: producers.filter(p => p.quality.averageScore > 90).length,
      good: producers.filter(p => p.quality.averageScore >= 80 && p.quality.averageScore <= 90).length,
      average: producers.filter(p => p.quality.averageScore >= 70 && p.quality.averageScore < 80).length,
      needsImprovement: producers.filter(p => p.quality.averageScore < 70).length
    };

    return {
      totalProducers,
      totalArea,
      averageSustainabilityScore: isNaN(averageSustainabilityScore) ? 0 : averageSustainabilityScore,
      topCertifications,
      regionDistribution,
      qualityDistribution
    };
  }

  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(percentile * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
  }

  private validateDocument(document: string): boolean {
    // Basic document validation - would implement proper CPF/CNPJ validation
    const cleaned = document.replace(/[^\d]/g, '');
    return cleaned.length === 11 || cleaned.length === 14;
  }

  private convertToCSV(producers: ProducerDTO[]): string {
    const headers = ['ID', 'Name', 'Farm Name', 'Document', 'Region', 'Total Area', 'Planted Area', 'Sustainability Score', 'Status'];
    const rows = producers.map(p => [
      p.id,
      p.name,
      p.farmName,
      p.document,
      p.location.region,
      p.totalArea,
      p.plantedArea,
      p.sustainabilityScore,
      p.status
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}