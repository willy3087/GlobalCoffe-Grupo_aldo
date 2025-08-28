import { MonteCarloSimulation, SimulationParams, SimulationResult } from '../../../domains/trading/services/MonteCarloSimulation';

export class SimulateMarketScenarios {
  private monteCarloService: MonteCarloSimulation;

  constructor(onProgressCallback?: (progress: number) => void) {
    this.monteCarloService = new MonteCarloSimulation(onProgressCallback);
  }

  async execute(params: Partial<SimulationParams> & { 
    regiao?: { latitude: number; longitude: number } 
  }): Promise<SimulationResult> {
    
    const fullParams: SimulationParams = {
      precoAtual: params.precoAtual ?? 1.45,
      volatilidade: params.volatilidade ?? 0.35,
      drift: params.drift ?? 0.05,
      iacCafe: params.iacCafe, // Será calculado se não fornecido
      producaoGlobal: params.producaoGlobal ?? 175, // milhões de sacas
      horizonte: params.horizonte ?? 30,
      simulacoes: params.simulacoes ?? 10000,
      latitude: params.regiao?.latitude ?? -23.5505, // São Paulo default
      longitude: params.regiao?.longitude ?? -46.6333
    };

    console.log('🎯 Simulando cenários de mercado com integração climática real...');
    return await this.monteCarloService.executeSimulation(fullParams);
  }
}