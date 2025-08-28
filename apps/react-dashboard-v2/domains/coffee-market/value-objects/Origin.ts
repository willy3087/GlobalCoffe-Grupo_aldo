export enum CoffeeRegion {
  MINAS_GERAIS = 'MG',
  SAO_PAULO = 'SP',
  ESPIRITO_SANTO = 'ES',
  BAHIA = 'BA',
  PARANA = 'PR',
  RONDONIA = 'RO',
  OUTROS = 'OUTROS'
}

export enum CoffeeVariety {
  ARABICA = 'ARABICA',
  ROBUSTA = 'ROBUSTA',
  CATUAI = 'CATUAI',
  MUNDO_NOVO = 'MUNDO_NOVO',
  BOURBON = 'BOURBON'
}

export class Origin {
  private static readonly REGION_NAMES: Record<CoffeeRegion, string> = {
    [CoffeeRegion.MINAS_GERAIS]: 'Minas Gerais',
    [CoffeeRegion.SAO_PAULO]: 'São Paulo',
    [CoffeeRegion.ESPIRITO_SANTO]: 'Espírito Santo',
    [CoffeeRegion.BAHIA]: 'Bahia',
    [CoffeeRegion.PARANA]: 'Paraná',
    [CoffeeRegion.RONDONIA]: 'Rondônia',
    [CoffeeRegion.OUTROS]: 'Outros'
  };

  private static readonly VARIETY_NAMES: Record<CoffeeVariety, string> = {
    [CoffeeVariety.ARABICA]: 'Arábica',
    [CoffeeVariety.ROBUSTA]: 'Robusta',
    [CoffeeVariety.CATUAI]: 'Catuaí',
    [CoffeeVariety.MUNDO_NOVO]: 'Mundo Novo',
    [CoffeeVariety.BOURBON]: 'Bourbon'
  };

  constructor(
    private readonly region: CoffeeRegion,
    private readonly variety: CoffeeVariety,
    private readonly altitude?: number, // metros
    private readonly farmName?: string,
    private readonly coordinates?: { latitude: number; longitude: number }
  ) {
    if (!Object.values(CoffeeRegion).includes(region)) {
      throw new Error(`Invalid coffee region: ${region}`);
    }
    if (!Object.values(CoffeeVariety).includes(variety)) {
      throw new Error(`Invalid coffee variety: ${variety}`);
    }
    if (altitude !== undefined && altitude < 0) {
      throw new Error('Altitude cannot be negative');
    }
  }

  getRegion(): CoffeeRegion {
    return this.region;
  }

  getRegionName(): string {
    return Origin.REGION_NAMES[this.region];
  }

  getVariety(): CoffeeVariety {
    return this.variety;
  }

  getVarietyName(): string {
    return Origin.VARIETY_NAMES[this.variety];
  }

  getAltitude(): number | undefined {
    return this.altitude;
  }

  getFarmName(): string | undefined {
    return this.farmName;
  }

  getCoordinates(): { latitude: number; longitude: number } | undefined {
    return this.coordinates;
  }

  isHighAltitude(): boolean {
    return this.altitude !== undefined && this.altitude > 1200;
  }

  isCerradoRegion(): boolean {
    return this.region === CoffeeRegion.MINAS_GERAIS || this.region === CoffeeRegion.SAO_PAULO;
  }

  isArabica(): boolean {
    return this.variety === CoffeeVariety.ARABICA || 
           this.variety === CoffeeVariety.CATUAI ||
           this.variety === CoffeeVariety.MUNDO_NOVO ||
           this.variety === CoffeeVariety.BOURBON;
  }

  equals(other: Origin): boolean {
    return this.region === other.region && 
           this.variety === other.variety &&
           this.altitude === other.altitude &&
           this.farmName === other.farmName;
  }

  getQualityBonus(): number {
    let bonus = 1.0;
    
    // Bonus por região de qualidade reconhecida
    if (this.isCerradoRegion()) {
      bonus += 0.02; // +2%
    }
    
    // Bonus por altitude
    if (this.isHighAltitude()) {
      bonus += 0.03; // +3%
    }
    
    // Bonus por variedade premium
    if (this.variety === CoffeeVariety.BOURBON) {
      bonus += 0.05; // +5%
    }
    
    return bonus;
  }

  toString(): string {
    const parts = [this.getRegionName(), this.getVarietyName()];
    
    if (this.farmName) {
      parts.push(this.farmName);
    }
    
    if (this.altitude) {
      parts.push(`${this.altitude}m`);
    }
    
    return parts.join(' - ');
  }

  static fromRegionAndVariety(region: CoffeeRegion, variety: CoffeeVariety): Origin {
    return new Origin(region, variety);
  }

  static getAllRegions(): CoffeeRegion[] {
    return Object.values(CoffeeRegion);
  }

  static getAllVarieties(): CoffeeVariety[] {
    return Object.values(CoffeeVariety);
  }

  toJSON() {
    return {
      region: this.region,
      regionName: this.getRegionName(),
      variety: this.variety,
      varietyName: this.getVarietyName(),
      altitude: this.altitude,
      farmName: this.farmName,
      coordinates: this.coordinates,
      isHighAltitude: this.isHighAltitude(),
      isCerradoRegion: this.isCerradoRegion(),
      isArabica: this.isArabica(),
      qualityBonus: this.getQualityBonus()
    };
  }
}