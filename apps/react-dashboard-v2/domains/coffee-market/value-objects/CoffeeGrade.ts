export enum CoffeeType {
  TIPO_2 = 'tipo2',
  TIPO_4 = 'tipo4', 
  TIPO_6 = 'tipo6',
  TIPO_8 = 'tipo8'
}

export class CoffeeGrade {
  private static readonly QUALITY_MULTIPLIERS: Record<CoffeeType, number> = {
    [CoffeeType.TIPO_2]: 1.0,    // Premium - 100%
    [CoffeeType.TIPO_4]: 0.95,   // Padrão - 95%
    [CoffeeType.TIPO_6]: 0.90,   // Regular - 90%
    [CoffeeType.TIPO_8]: 0.85    // Básico - 85%
  };

  private static readonly DESCRIPTIONS: Record<CoffeeType, string> = {
    [CoffeeType.TIPO_2]: 'Premium',
    [CoffeeType.TIPO_4]: 'Padrão',
    [CoffeeType.TIPO_6]: 'Regular', 
    [CoffeeType.TIPO_8]: 'Básico'
  };

  constructor(private readonly type: CoffeeType) {
    if (!Object.values(CoffeeType).includes(type)) {
      throw new Error(`Invalid coffee type: ${type}`);
    }
  }

  getValue(): CoffeeType {
    return this.type;
  }

  getQualityMultiplier(): number {
    return CoffeeGrade.QUALITY_MULTIPLIERS[this.type];
  }

  getScore(): number {
    // Converte o multiplicador para score (80-100)
    return 80 + (this.getQualityMultiplier() - 0.85) * 100;
  }

  getDescription(): string {
    return CoffeeGrade.DESCRIPTIONS[this.type];
  }

  isPremium(): boolean {
    return this.type === CoffeeType.TIPO_2;
  }

  isStandard(): boolean {
    return this.type === CoffeeType.TIPO_4;
  }

  equals(other: CoffeeGrade): boolean {
    return this.type === other.type;
  }

  compareTo(other: CoffeeGrade): number {
    const thisMultiplier = this.getQualityMultiplier();
    const otherMultiplier = other.getQualityMultiplier();
    return thisMultiplier - otherMultiplier;
  }

  toString(): string {
    return `${this.type.toUpperCase()} (${this.getDescription()})`;
  }

  static fromString(value: string): CoffeeGrade {
    const type = Object.values(CoffeeType).find(t => t === value.toLowerCase());
    if (!type) {
      throw new Error(`Invalid coffee grade: ${value}`);
    }
    return new CoffeeGrade(type);
  }

  static getAllTypes(): CoffeeType[] {
    return Object.values(CoffeeType);
  }

  toJSON() {
    return {
      type: this.type,
      description: this.getDescription(),
      qualityMultiplier: this.getQualityMultiplier(),
      score: this.getScore()
    };
  }
}