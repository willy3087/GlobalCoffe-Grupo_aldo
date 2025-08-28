import { Market } from '@coffee-market/entities/Market';
import { Price, Currency } from '@coffee-market/value-objects/Price';
import { CoffeeGrade, CoffeeType } from '@coffee-market/value-objects/CoffeeGrade';

export interface MarketPriceData {
  value: number;
  variation: number;
  timestamp: Date;
}

export interface BestChannelData {
  name: string;
  advantage: string;
  commission: number;
  reliability: number;
}

export interface QualityTypeData {
  type: string;
  premium: number;
  score: number;
  demand: 'high' | 'medium' | 'low';
}

/**
 * Application Service para operações de mercado
 * Integra com entidades do domínio coffee-market
 */
export class MarketService {
  private mockMarket: Market;

  constructor() {
    // Mock market instance para desenvolvimento
    this.mockMarket = new Market(
      'global-coffee-spot',
      'Global Coffee Spot Market',
      'spot',
      'BMF',
      new Price(650.00, Currency.BRL),
      {
        volatility: 0.35,
        trend: 'bullish',
        volume: 1500000,
        openInterest: 75000
      }
    );
  }

  /**
   * Obtém preço atual do mercado com variação
   */
  async getCurrentPrice(): Promise<MarketPriceData> {
    // Simular delay de API
    await this.simulateApiDelay();

    const currentPrice = this.mockMarket.getCurrentPrice();
    
    // Simular preço anterior para calcular variação
    const previousPrice = 628.50;
    const variation = ((currentPrice.getValue() - previousPrice) / previousPrice) * 100;
    
    // Simular pequena flutuação no preço
    const fluctuation = (Math.random() - 0.5) * 10; // ±5
    const adjustedPrice = currentPrice.getValue() + fluctuation;
    
    // Atualizar market com novo preço
    this.mockMarket.updatePrice(new Price(adjustedPrice, Currency.BRL), 15000);

    return {
      value: adjustedPrice,
      variation: variation + (Math.random() - 0.5) * 2, // Pequena variação aleatória
      timestamp: new Date()
    };
  }
  
  /**
   * Determina o melhor tipo de café valorizado no mercado
   */
  async getBestType(): Promise<QualityTypeData> {
    await this.simulateApiDelay();

    // Simular análise de diferentes tipos baseado em CoffeeGrade
    const types = [
      { 
        type: 'Tipo 2', 
        grade: new CoffeeGrade(CoffeeType.TIPO_2),
        demand: 'high' as const
      },
      { 
        type: 'Tipo 3', 
        grade: new CoffeeGrade(CoffeeType.TIPO_4),
        demand: 'medium' as const
      },
      { 
        type: 'Tipo 4', 
        grade: new CoffeeGrade(CoffeeType.TIPO_6),
        demand: 'medium' as const
      }
    ];

    // Selecionar baseado em score e demanda
    const bestType = types.reduce((best, current) => 
      current.grade.getScore() > best.grade.getScore() ? current : best
    );

    const basePremium = this.calculateTypePremium(bestType.grade);

    return {
      type: bestType.type,
      premium: Math.round(basePremium * 100) / 100,
      score: bestType.grade.getScore(),
      demand: bestType.demand
    };
  }
  
  /**
   * Determina o melhor canal de venda
   */
  async getBestChannel(): Promise<BestChannelData> {
    await this.simulateApiDelay();

    const channels = [
      {
        name: 'Cooperativa',
        commission: 0.5,
        reliability: 95,
        liquidityBonus: 10,
        riskFactor: 0.1
      },
      {
        name: 'Corretor',
        commission: 0.8,
        reliability: 90,
        liquidityBonus: 15,
        riskFactor: 0.15
      },
      {
        name: 'Exportadora',
        commission: 1.2,
        reliability: 85,
        liquidityBonus: 20,
        riskFactor: 0.25
      }
    ];

    // Algoritmo simples para determinar melhor canal
    // Pontuação = (100 - comissão%) + confiabilidade + bônus liquidez - (risco * 10)
    const bestChannel = channels.reduce((best, current) => {
      const currentScore = (100 - current.commission) + current.reliability + 
                          current.liquidityBonus - (current.riskFactor * 10);
      const bestScore = (100 - best.commission) + best.reliability + 
                       best.liquidityBonus - (best.riskFactor * 10);
      
      return currentScore > bestScore ? current : best;
    });

    return {
      name: bestChannel.name,
      advantage: this.getChannelAdvantage(bestChannel),
      commission: bestChannel.commission,
      reliability: bestChannel.reliability
    };
  }

  /**
   * Calcula premium de tipo baseado na qualidade
   */
  private calculateTypePremium(grade: CoffeeGrade): number {
    const basePrice = this.mockMarket.getCurrentPrice().getValue();
    const scoreMultiplier = (grade.getScore() - 80) / 100;
    
    return (basePrice * scoreMultiplier * 0.05); // Até 5% de premium
  }

  /**
   * Determina vantagem do canal
   */
  private getChannelAdvantage(channel: { name: string; commission: number; reliability: number }): string {
    if (channel.commission < 0.7) {
      return 'Menor comissão';
    }
    if (channel.reliability > 90) {
      return 'Alta segurança';
    }
    return 'Melhor liquidez';
  }

  /**
   * Simula delay de API para desenvolvimento realista
   */
  private async simulateApiDelay(): Promise<void> {
    const delay = Math.random() * 800 + 200; // 200-1000ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Obtém volatilidade atual do mercado
   */
  getVolatility(): number {
    return this.mockMarket.calculateVolatility();
  }

  /**
   * Verifica se o mercado está aberto
   */
  isMarketOpen(): boolean {
    return this.mockMarket.isMarketOpen();
  }

  /**
   * Obtém condições gerais do mercado
   */
  getMarketConditions() {
    return {
      ...this.mockMarket.getConditions(),
      isOpen: this.isMarketOpen(),
      volatility: this.getVolatility()
    };
  }
}