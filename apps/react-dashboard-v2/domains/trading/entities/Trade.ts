import { Coffee } from '@coffee-market/entities/Coffee';
import { Producer } from '@coffee-market/entities/Producer';
import { Price } from '@coffee-market/value-objects/Price';

export type TradeStatus = 'pending' | 'confirmed' | 'executed' | 'settled' | 'cancelled';
export type TradeType = 'buy' | 'sell';
export type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit';

export interface TradeTerms {
  deliveryDate: Date;
  deliveryLocation: string;
  qualitySpecs: string[];
  paymentTerms: string;
  penalties?: string;
}

export interface TradeExecution {
  executedAt: Date;
  executedPrice: Price;
  executedQuantity: number;
  executionId: string;
}

export interface Commission {
  rate: number; // percentual
  fixedAmount?: Price;
  minimumAmount?: Price;
}

export class Trade {
  constructor(
    private readonly id: string,
    private readonly type: TradeType,
    private readonly orderType: OrderType,
    private readonly coffee: Coffee,
    private readonly quantity: number, // em sacas
    private readonly targetPrice: Price,
    private status: TradeStatus = 'pending',
    private readonly producer?: Producer,
    private readonly buyer?: string,
    private readonly seller?: string,
    private terms?: TradeTerms,
    private execution?: TradeExecution,
    private commission?: Commission,
    private readonly createdAt: Date = new Date()
  ) {}

  getId(): string {
    return this.id;
  }

  getType(): TradeType {
    return this.type;
  }

  getOrderType(): OrderType {
    return this.orderType;
  }

  getCoffee(): Coffee {
    return this.coffee;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getTargetPrice(): Price {
    return this.targetPrice;
  }

  getStatus(): TradeStatus {
    return this.status;
  }

  getProducer(): Producer | undefined {
    return this.producer;
  }

  getBuyer(): string | undefined {
    return this.buyer;
  }

  getSeller(): string | undefined {
    return this.seller;
  }

  getTerms(): TradeTerms | undefined {
    return this.terms ? { ...this.terms } : undefined;
  }

  getExecution(): TradeExecution | undefined {
    return this.execution ? { ...this.execution } : undefined;
  }

  getCommission(): Commission | undefined {
    return this.commission ? { ...this.commission } : undefined;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  setTerms(terms: TradeTerms): void {
    if (this.status !== 'pending') {
      throw new Error('Cannot modify terms of a non-pending trade');
    }
    this.terms = terms;
  }

  setCommission(commission: Commission): void {
    if (this.status === 'executed' || this.status === 'settled') {
      throw new Error('Cannot modify commission of executed trade');
    }
    this.commission = commission;
  }

  confirm(): void {
    if (this.status !== 'pending') {
      throw new Error('Only pending trades can be confirmed');
    }
    this.status = 'confirmed';
  }

  execute(executionPrice: Price, executionQuantity: number, executionId: string): void {
    if (this.status !== 'confirmed') {
      throw new Error('Only confirmed trades can be executed');
    }

    this.execution = {
      executedAt: new Date(),
      executedPrice: executionPrice,
      executedQuantity: Math.min(executionQuantity, this.quantity),
      executionId
    };

    this.status = 'executed';
  }

  settle(): void {
    if (this.status !== 'executed') {
      throw new Error('Only executed trades can be settled');
    }
    this.status = 'settled';
  }

  cancel(_reason?: string): void {
    if (this.status === 'executed' || this.status === 'settled') {
      throw new Error('Cannot cancel executed or settled trades');
    }
    this.status = 'cancelled';
  }

  calculateTotalValue(): Price {
    const executionPrice = this.execution?.executedPrice || this.targetPrice;
    const executionQuantity = this.execution?.executedQuantity || this.quantity;
    
    const totalValue = executionPrice.getValue() * executionQuantity;
    return new Price(totalValue, executionPrice.getCurrency());
  }

  calculateCommissionCost(): Price {
    if (!this.commission) {
      return new Price(0, this.targetPrice.getCurrency());
    }

    const totalValue = this.calculateTotalValue();
    const percentageCommission = totalValue.getValue() * (this.commission.rate / 100);
    
    let finalCommission = percentageCommission;
    
    if (this.commission.fixedAmount) {
      finalCommission += this.commission.fixedAmount.getValue();
    }
    
    if (this.commission.minimumAmount) {
      finalCommission = Math.max(finalCommission, this.commission.minimumAmount.getValue());
    }
    
    return new Price(finalCommission, totalValue.getCurrency());
  }

  calculateNetValue(): Price {
    const totalValue = this.calculateTotalValue();
    const commission = this.calculateCommissionCost();
    
    const netValue = this.type === 'buy' 
      ? totalValue.getValue() + commission.getValue()
      : totalValue.getValue() - commission.getValue();
    
    return new Price(netValue, totalValue.getCurrency());
  }

  getProfitLoss(currentMarketPrice: Price): Price {
    if (this.status !== 'executed' && this.status !== 'settled') {
      return new Price(0, currentMarketPrice.getCurrency());
    }

    const executionPrice = this.execution!.executedPrice;
    const executionQuantity = this.execution!.executedQuantity;
    
    const priceDiff = this.type === 'buy' 
      ? currentMarketPrice.getValue() - executionPrice.getValue()
      : executionPrice.getValue() - currentMarketPrice.getValue();
    
    const totalPL = priceDiff * executionQuantity;
    return new Price(totalPL, currentMarketPrice.getCurrency());
  }

  isExpired(): boolean {
    if (!this.terms?.deliveryDate) return false;
    return new Date() > this.terms.deliveryDate;
  }

  canBeExecutedAt(price: Price): boolean {
    if (this.status !== 'confirmed') return false;

    switch (this.orderType) {
      case 'market':
        return true;
      case 'limit':
        return this.type === 'buy' 
          ? price.getValue() <= this.targetPrice.getValue()
          : price.getValue() >= this.targetPrice.getValue();
      case 'stop':
        return this.type === 'buy'
          ? price.getValue() >= this.targetPrice.getValue()
          : price.getValue() <= this.targetPrice.getValue();
      case 'stop-limit':
        // Simplificado - em implementação real teria mais lógica
        return this.canBeExecutedAt(price);
      default:
        return false;
    }
  }

  equals(other: Trade): boolean {
    return this.id === other.id;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      orderType: this.orderType,
      coffee: this.coffee.toJSON(),
      quantity: this.quantity,
      targetPrice: this.targetPrice.toJSON(),
      status: this.status,
      producer: this.producer?.toJSON(),
      buyer: this.buyer,
      seller: this.seller,
      terms: this.terms,
      execution: this.execution ? {
        ...this.execution,
        executedPrice: this.execution.executedPrice.toJSON()
      } : undefined,
      commission: this.commission,
      createdAt: this.createdAt.toISOString(),
      totalValue: this.calculateTotalValue().toJSON(),
      commissionCost: this.calculateCommissionCost().toJSON(),
      netValue: this.calculateNetValue().toJSON(),
      isExpired: this.isExpired()
    };
  }
}