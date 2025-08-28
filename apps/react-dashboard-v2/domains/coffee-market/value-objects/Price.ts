export enum Currency {
  BRL = 'BRL',
  USD = 'USD'
}

export class Price {
  constructor(
    private readonly amount: number,
    private readonly currency: Currency = Currency.BRL
  ) {
    if (amount < 0) {
      throw new Error('Price amount cannot be negative');
    }
    if (!Object.values(Currency).includes(currency)) {
      throw new Error(`Invalid currency: ${currency}`);
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getValue(): number {
    return this.amount;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  multiply(factor: number): Price {
    if (factor < 0) {
      throw new Error('Multiplication factor cannot be negative');
    }
    return new Price(this.amount * factor, this.currency);
  }

  add(other: Price): Price {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return new Price(this.amount + other.amount, this.currency);
  }

  subtract(other: Price): Price {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract prices with different currencies');
    }
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error('Subtraction would result in negative price');
    }
    return new Price(result, this.currency);
  }

  percentage(percent: number): Price {
    return this.multiply(percent / 100);
  }

  equals(other: Price): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  isGreaterThan(other: Price): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare prices with different currencies');
    }
    return this.amount > other.amount;
  }

  isLessThan(other: Price): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare prices with different currencies');
    }
    return this.amount < other.amount;
  }

  toCurrencyString(): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2
    });
    return formatter.format(this.amount);
  }

  toPerSack(): string {
    return `${this.toCurrencyString()}/saca`;
  }

  toString(): string {
    return this.toCurrencyString();
  }

  static fromString(value: string, currency: Currency = Currency.BRL): Price {
    const numericValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
    if (isNaN(numericValue)) {
      throw new Error(`Invalid price format: ${value}`);
    }
    return new Price(numericValue, currency);
  }

  static zero(currency: Currency = Currency.BRL): Price {
    return new Price(0, currency);
  }

  // Método para conversão de moedas (implementação futura com APIs)
  convertTo(targetCurrency: Currency, exchangeRate?: number): Price {
    if (this.currency === targetCurrency) {
      return this;
    }
    
    if (!exchangeRate) {
      throw new Error('Exchange rate required for currency conversion');
    }
    
    return new Price(this.amount * exchangeRate, targetCurrency);
  }

  toJSON() {
    return {
      amount: this.amount,
      currency: this.currency,
      formatted: this.toCurrencyString()
    };
  }
}