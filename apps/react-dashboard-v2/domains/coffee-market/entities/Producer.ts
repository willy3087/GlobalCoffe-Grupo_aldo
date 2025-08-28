import { Coffee } from '@coffee-market/entities/Coffee';
import { Origin } from '@coffee-market/value-objects/Origin';
import { Price } from '@coffee-market/value-objects/Price';

export interface ProductionCapacity {
  totalHectares: number;
  productiveHectares: number;
  estimatedYield: number; // sacas por hectare
  annualCapacity: number; // total de sacas
}

export interface QualityMetrics {
  averageScore: number;
  consistency: number; // 0-1
  defectRate: number; // percentual
  certifications: string[];
}

export interface ProductionCosts {
  laborCost: Price;
  inputCost: Price;
  processingCost: Price;
  logisticsCost: Price;
  totalCostPerSaca: Price;
}

export interface HarvestInfo {
  season: string;
  startDate: Date;
  endDate: Date;
  expectedVolume: number;
  actualVolume?: number;
  qualityGrade?: string;
}

export class Producer {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly document: string,
    private readonly origin: Origin,
    private capacity: ProductionCapacity,
    private quality: QualityMetrics,
    private costs: ProductionCosts,
    private readonly properties: string[] = [],
    private harvests: HarvestInfo[] = []
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDocument(): string {
    return this.document;
  }

  getOrigin(): Origin {
    return this.origin;
  }

  getCapacity(): ProductionCapacity {
    return { ...this.capacity };
  }

  getQuality(): QualityMetrics {
    return { ...this.quality };
  }

  getCosts(): ProductionCosts {
    return { ...this.costs };
  }

  getProperties(): string[] {
    return [...this.properties];
  }

  getHarvests(): HarvestInfo[] {
    return [...this.harvests];
  }

  getCurrentHarvest(): HarvestInfo | null {
    const now = new Date();
    return this.harvests.find(harvest => 
      harvest.startDate <= now && harvest.endDate >= now
    ) || null;
  }

  updateCapacity(capacity: Partial<ProductionCapacity>): void {
    this.capacity = { ...this.capacity, ...capacity };
  }

  updateQuality(quality: Partial<QualityMetrics>): void {
    this.quality = { ...this.quality, ...quality };
  }

  updateCosts(costs: Partial<ProductionCosts>): void {
    this.costs = { ...this.costs, ...costs };
    
    // Recalcular custo total por saca
    const totalCost = [
      costs.laborCost || this.costs.laborCost,
      costs.inputCost || this.costs.inputCost,
      costs.processingCost || this.costs.processingCost,
      costs.logisticsCost || this.costs.logisticsCost
    ].reduce((total, cost) => total + cost.getValue(), 0);

    this.costs.totalCostPerSaca = new Price(totalCost, this.costs.laborCost.getCurrency());
  }

  addHarvest(harvest: HarvestInfo): void {
    this.harvests.push(harvest);
    
    // Manter apenas últimos 5 anos
    this.harvests = this.harvests.slice(-5);
  }

  updateHarvestActual(season: string, actualVolume: number, qualityGrade?: string): void {
    const harvest = this.harvests.find(h => h.season === season);
    if (harvest) {
      harvest.actualVolume = actualVolume;
      if (qualityGrade) {
        harvest.qualityGrade = qualityGrade;
      }
    }
  }

  calculateBreakevenPrice(): Price {
    const totalCost = this.costs.totalCostPerSaca.getValue();
    const margin = 0.15; // 15% de margem mínima
    const breakevenValue = totalCost * (1 + margin);
    
    return new Price(breakevenValue, this.costs.totalCostPerSaca.getCurrency());
  }

  calculateProfitability(marketPrice: Price): number {
    const totalCost = this.costs.totalCostPerSaca.getValue();
    const revenue = marketPrice.getValue();
    
    return (revenue - totalCost) / totalCost;
  }

  getEfficiencyRatio(): number {
    const actualYield = this.capacity.estimatedYield;
    const maxPotentialYield = 30; // sacas/hectare (referência)
    
    return Math.min(actualYield / maxPotentialYield, 1);
  }

  canProduceCoffeeType(coffee: Coffee): boolean {
    // Verificar se o produtor pode produzir esse tipo de café
    const coffeeOrigin = coffee.getOrigin();
    return this.origin.getRegion() === coffeeOrigin.getRegion();
  }

  getAverageHarvestVolume(years: number = 3): number {
    if (this.harvests.length === 0) return 0;
    
    const recentHarvests = this.harvests
      .filter(h => h.actualVolume !== undefined)
      .slice(-years);
    
    if (recentHarvests.length === 0) return this.capacity.annualCapacity;
    
    const total = recentHarvests.reduce((sum, h) => sum + (h.actualVolume || 0), 0);
    return total / recentHarvests.length;
  }

  isCertified(certification: string): boolean {
    return this.quality.certifications.includes(certification);
  }

  addCertification(certification: string): void {
    if (!this.isCertified(certification)) {
      this.quality.certifications.push(certification);
    }
  }

  removeCertification(certification: string): void {
    this.quality.certifications = this.quality.certifications
      .filter(cert => cert !== certification);
  }

  equals(other: Producer): boolean {
    return this.id === other.id;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      document: this.document,
      origin: this.origin.toJSON(),
      capacity: this.capacity,
      quality: this.quality,
      costs: {
        laborCost: this.costs.laborCost.toJSON(),
        inputCost: this.costs.inputCost.toJSON(),
        processingCost: this.costs.processingCost.toJSON(),
        logisticsCost: this.costs.logisticsCost.toJSON(),
        totalCostPerSaca: this.costs.totalCostPerSaca.toJSON()
      },
      properties: this.properties,
      breakevenPrice: this.calculateBreakevenPrice().toJSON(),
      efficiencyRatio: this.getEfficiencyRatio(),
      currentHarvest: this.getCurrentHarvest()
    };
  }
}