import { CoffeeGrade, Price, Origin } from '../value-objects';

export interface CoffeeId {
  readonly value: string;
}

export class Coffee {
  constructor(
    private readonly id: CoffeeId,
    private readonly grade: CoffeeGrade,
    private readonly origin: Origin,
    private readonly harvestDate: Date,
    private readonly quantity: number, // kg
    private readonly basePrice: Price
  ) {}

  getId(): CoffeeId {
    return this.id;
  }

  getGrade(): CoffeeGrade {
    return this.grade;
  }

  getOrigin(): Origin {
    return this.origin;
  }

  getHarvestDate(): Date {
    return this.harvestDate;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getBasePrice(): Price {
    return this.basePrice;
  }

  calculateAdjustedPrice(marketMultiplier: number): Price {
    return this.basePrice.multiply(this.grade.getQualityMultiplier()).multiply(marketMultiplier);
  }

  isSameBatch(other: Coffee): boolean {
    return this.origin.equals(other.origin) && 
           this.grade.equals(other.grade) &&
           this.harvestDate.getTime() === other.harvestDate.getTime();
  }

  toString(): string {
    return `Coffee(${this.grade.getValue()}, ${this.origin.getRegion()}, ${this.quantity}kg)`;
  }

  toJSON() {
    return {
      id: this.id,
      grade: this.grade.toJSON(),
      origin: this.origin.toJSON(),
      harvestDate: this.harvestDate.toISOString(),
      quantity: this.quantity,
      basePrice: this.basePrice.toJSON()
    };
  }
}