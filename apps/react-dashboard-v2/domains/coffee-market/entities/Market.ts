import { Price } from '@coffee-market/value-objects/Price';
import { CoffeeGrade } from '@coffee-market/value-objects/CoffeeGrade';

export interface MarketConditions {
  volatility: number;
  trend: 'bullish' | 'bearish' | 'sideways';
  volume: number;
  openInterest?: number;
}

export interface PriceHistory {
  date: Date;
  price: Price;
  volume: number;
}

export class Market {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly type: 'spot' | 'futures' | 'options',
    private readonly exchange: string,
    private currentPrice: Price,
    private conditions: MarketConditions,
    private priceHistory: PriceHistory[] = []
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getType(): 'spot' | 'futures' | 'options' {
    return this.type;
  }

  getExchange(): string {
    return this.exchange;
  }

  getCurrentPrice(): Price {
    return this.currentPrice;
  }

  getConditions(): MarketConditions {
    return { ...this.conditions };
  }

  getPriceHistory(): PriceHistory[] {
    return [...this.priceHistory];
  }

  updatePrice(newPrice: Price, volume: number): void {
    const previousPrice = this.currentPrice;
    this.currentPrice = newPrice;
    
    // Adicionar ao histórico
    this.priceHistory.push({
      date: new Date(),
      price: newPrice,
      volume
    });

    // Manter apenas últimos 100 registros para performance
    if (this.priceHistory.length > 100) {
      this.priceHistory = this.priceHistory.slice(-100);
    }

    // Atualizar trend baseado na mudança de preço
    this.updateTrend(previousPrice, newPrice);
  }

  updateConditions(conditions: Partial<MarketConditions>): void {
    this.conditions = { ...this.conditions, ...conditions };
  }

  calculateVolatility(periods: number = 20): number {
    if (this.priceHistory.length < periods) {
      return this.conditions.volatility;
    }

    const recentPrices = this.priceHistory.slice(-periods);
    const returns = recentPrices.slice(1).map((current, index) => {
      const previous = recentPrices[index];
      return Math.log(current.price.getValue() / previous.price.getValue());
    });

    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    
    return Math.sqrt(variance * 252); // Anualizada
  }

  getPriceForGrade(grade: CoffeeGrade): Price {
    const basePrice = this.currentPrice;
    const premium = this.calculateGradePremium(grade);
    
    return new Price(
      basePrice.getValue() + premium,
      basePrice.getCurrency()
    );
  }

  isMarketOpen(): boolean {
    const now = new Date();
    const hour = now.getHours();
    
    // Simplificado - assumindo horário de mercado padrão
    switch (this.exchange.toLowerCase()) {
      case 'ice':
        return hour >= 9 && hour <= 16; // EST
      case 'bmf':
        return hour >= 9 && hour <= 17; // BRT
      default:
        return true; // Spot markets are always open
    }
  }

  private updateTrend(previousPrice: Price, newPrice: Price): void {
    const changePercent = (newPrice.getValue() - previousPrice.getValue()) / previousPrice.getValue();
    
    if (changePercent > 0.02) {
      this.conditions.trend = 'bullish';
    } else if (changePercent < -0.02) {
      this.conditions.trend = 'bearish';
    } else {
      this.conditions.trend = 'sideways';
    }
  }

  private calculateGradePremium(grade: CoffeeGrade): number {
    const basePrice = this.currentPrice.getValue();
    const scoreMultiplier = (grade.getScore() - 80) / 100; // Normalizado para score base 80
    
    return basePrice * scoreMultiplier * 0.1; // Até 10% de premium/discount
  }

  equals(other: Market): boolean {
    return this.id === other.id;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      exchange: this.exchange,
      currentPrice: this.currentPrice.toJSON(),
      conditions: this.conditions,
      isOpen: this.isMarketOpen(),
      volatility: this.calculateVolatility()
    };
  }
}