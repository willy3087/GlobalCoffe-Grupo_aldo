export interface ClimateData {
  indice: number;          // 0-100
  categoria: string;       // Favorável, Médio, Desfavorável
  temperatura: number;     // °C
  precipitacao: number;    // mm
  umidade: number;         // %
  risco: 'BAIXO' | 'MEDIO' | 'ALTO';
}

export class ClimateIndexService {
  async calcularIACCafe(latitude: number, longitude: number): Promise<ClimateData> {
    // Simulação de cálculo baseado em coordenadas
    // Em produção, integraria com OpenWeatherMap API
    
    // Base de cálculo simulado baseado na região
    const baseIndex = this.calculateRegionalBase(latitude, longitude);
    const seasonalAdjust = this.getSeasonalAdjustment();
    const randomVariation = (Math.random() - 0.5) * 20; // ±10 pontos
    
    const indice = Math.max(0, Math.min(100, baseIndex + seasonalAdjust + randomVariation));
    
    const categoria = this.determineCategory(indice);
    const risco = this.determineRisk(indice);
    
    // Dados climáticos simulados
    const temperatura = 22 + (Math.random() - 0.5) * 8; // 18-26°C
    const precipitacao = 120 + (Math.random() - 0.5) * 80; // 80-160mm
    const umidade = 65 + (Math.random() - 0.5) * 20; // 55-75%
    
    return {
      indice: Number(indice.toFixed(1)),
      categoria,
      temperatura: Number(temperatura.toFixed(1)),
      precipitacao: Number(precipitacao.toFixed(0)),
      umidade: Number(umidade.toFixed(0)),
      risco
    };
  }

  private calculateRegionalBase(lat: number, lng: number): number {
    // Regiões cafeeiras brasileiras têm melhor base
    if (lat >= -25 && lat <= -15 && lng >= -50 && lng <= -40) {
      return 70; // Região Sudeste (MG, SP)
    }
    if (lat >= -15 && lat <= -5 && lng >= -50 && lng <= -35) {
      return 65; // Cerrado (BA, GO)
    }
    if (lat >= -30 && lat <= -25 && lng >= -55 && lng <= -48) {
      return 60; // Sul (PR, RS)
    }
    return 55; // Outras regiões
  }

  private getSeasonalAdjustment(): number {
    const month = new Date().getMonth();
    
    // Safra brasileira: Maio-Setembro (seca)
    if (month >= 4 && month <= 8) {
      return 10; // Período favorável
    }
    // Chuvas: Outubro-Abril
    if (month >= 9 || month <= 3) {
      return -5; // Período de chuvas
    }
    return 0;
  }

  private determineCategory(indice: number): string {
    if (indice >= 75) return 'Favorável';
    if (indice >= 50) return 'Médio';
    return 'Desfavorável';
  }

  private determineRisk(indice: number): 'BAIXO' | 'MEDIO' | 'ALTO' {
    if (indice >= 75) return 'BAIXO';
    if (indice >= 50) return 'MEDIO';
    return 'ALTO';
  }
}