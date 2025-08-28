/**
 * Data Transfer Object for Producer entity
 * Used to transfer producer data between service layers
 */

export interface LocationDTO {
  country: string;
  state: string;
  city: string;
  region: string;
}

export interface ProductionHistoryDTO {
  season: string;
  year: number;
  volume: number;
  qualityScore: number;
  revenue: number;
}

export interface CertificationDTO {
  name: string;
  issuedBy: string;
  validUntil: Date;
  isActive: boolean;
}

export interface SustainabilityMetricsDTO {
  carbonFootprint: number;
  waterUsage: number;
  energyEfficiency: number;
  wasteReduction: number;
  overallScore: number;
}

export interface ProductionCapacityDTO {
  totalArea: number;
  plantedArea: number;
  estimatedYield: number; // bags per hectare
  annualCapacity: number; // total bags
}

export interface QualityMetricsDTO {
  averageScore: number;
  consistency: number; // 0-1
  defectRate: number; // percentage
  certifications: string[];
}

export interface ProducerDTO {
  id: string;
  name: string;
  farmName: string;
  document: string;
  email?: string;
  phone?: string;
  location: LocationDTO;
  totalArea: number;
  plantedArea: number;
  capacity: ProductionCapacityDTO;
  quality: QualityMetricsDTO;
  productionHistory: ProductionHistoryDTO[];
  certifications: CertificationDTO[];
  sustainabilityScore: number;
  sustainabilityMetrics: SustainabilityMetricsDTO;
  status: 'active' | 'inactive' | 'pending';
  registrationDate: Date;
  lastUpdateDate: Date;
  
  // Calculated fields
  averageYield?: number;
  efficiencyRatio?: number;
  profitabilityIndex?: number;
  marketPosition?: 'leader' | 'follower' | 'challenger' | 'niche';
}

export interface CreateProducerDTO {
  name: string;
  farmName: string;
  document: string;
  email?: string;
  phone?: string;
  location: LocationDTO;
  totalArea: number;
  plantedArea: number;
  capacity: ProductionCapacityDTO;
  certifications?: string[];
}

export interface UpdateProducerDTO {
  name?: string;
  farmName?: string;
  email?: string;
  phone?: string;
  location?: Partial<LocationDTO>;
  totalArea?: number;
  plantedArea?: number;
  capacity?: Partial<ProductionCapacityDTO>;
  quality?: Partial<QualityMetricsDTO>;
  sustainabilityMetrics?: Partial<SustainabilityMetricsDTO>;
  status?: 'active' | 'inactive' | 'pending';
}