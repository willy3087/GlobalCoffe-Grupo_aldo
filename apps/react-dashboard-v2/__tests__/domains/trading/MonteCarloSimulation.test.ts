import { MonteCarloSimulation } from '../../../domains/trading/services/MonteCarloSimulation';

describe('MonteCarloSimulation', () => {
  let simulation: MonteCarloSimulation;

  beforeEach(() => {
    simulation = new MonteCarloSimulation();
  });

  it('should complete 1000 simulations with real climate data in <500ms', async () => {
    const start = performance.now();
    
    const result = await simulation.executeSimulation({
      precoAtual: 1.45,
      volatilidade: 0.35,
      drift: 0.05,
      producaoGlobal: 175,
      horizonte: 30,
      simulacoes: 1000,
      latitude: -21.1767,
      longitude: -47.8208
    });
    
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(500);
    expect(result.cenarios.pessimista.preco).toBeGreaterThan(0);
    expect(result.cenarios.realista.preco).toBeGreaterThan(0);
    expect(result.cenarios.otimista.preco).toBeGreaterThan(0);
    expect(result.metadata.iacUtilizado).toBeGreaterThan(0);
    expect(result.metadata.climateImpact).toBeDefined();
    expect(result.metadata.simulacoesExecutadas).toBe(1000);
  });

  it('should integrate climate impact in price calculations', async () => {
    // Teste com IAC baixo (condições desfavoráveis)
    const resultBadWeather = await simulation.executeSimulation({
      precoAtual: 1.45,
      volatilidade: 0.35,
      drift: 0.05,
      iacCafe: 30, // IAC baixo
      producaoGlobal: 175,
      horizonte: 30,
      simulacoes: 1000
    });
    
    // Teste com IAC alto (condições favoráveis) 
    const resultGoodWeather = await simulation.executeSimulation({
      precoAtual: 1.45,
      volatilidade: 0.35,
      drift: 0.05,
      iacCafe: 85, // IAC alto
      producaoGlobal: 175,
      horizonte: 30,
      simulacoes: 1000
    });
    
    // IAC baixo deve resultar em preços mais altos (quebra de safra)
    expect(resultBadWeather.cenarios.realista.preco)
      .toBeGreaterThan(resultGoodWeather.cenarios.realista.preco);
    
    // Verificar categorização do impacto climático
    expect(resultBadWeather.metadata.climateImpact).toContain('desfavoráveis');
    expect(resultGoodWeather.metadata.climateImpact).toContain('favoráveis');
  });

  it('should return valid percentile calculations', async () => {
    const result = await simulation.executeSimulation({
      precoAtual: 1.45,
      volatilidade: 0.35,
      drift: 0.05,
      iacCafe: 60,
      producaoGlobal: 175,
      horizonte: 30,
      simulacoes: 1000
    });

    const { percentis } = result.distribuicao;
    
    // Percentis devem estar em ordem crescente
    expect(percentis.p5).toBeLessThan(percentis.p10);
    expect(percentis.p10).toBeLessThan(percentis.p25);
    expect(percentis.p25).toBeLessThan(percentis.p50);
    expect(percentis.p50).toBeLessThan(percentis.p75);
    expect(percentis.p75).toBeLessThan(percentis.p90);
    expect(percentis.p90).toBeLessThan(percentis.p95);
    
    // P50 deve ser próximo da mediana
    expect(Math.abs(percentis.p50 - result.estatisticas.media)).toBeLessThan(0.5);
  });

  it('should validate statistical properties', async () => {
    const result = await simulation.executeSimulation({
      precoAtual: 1.45,
      volatilidade: 0.35,
      drift: 0.05,
      iacCafe: 60,
      producaoGlobal: 175,
      horizonte: 30,
      simulacoes: 5000
    });

    const { estatisticas, validacao } = result;
    
    // Validações estatísticas básicas
    expect(estatisticas.media).toBeGreaterThan(0);
    expect(estatisticas.desvioPadrao).toBeGreaterThan(0);
    expect(typeof estatisticas.assimetria).toBe('number');
    expect(typeof estatisticas.curtose).toBe('number');
    
    // Teste Kolmogorov-Smirnov
    expect(validacao.ksStatistic).toBeGreaterThan(0);
    expect(validacao.pValue).toBeGreaterThan(0);
    expect(validacao.pValue).toBeLessThan(1);
    
    // Aderência histórica deve ser boolean
    expect(typeof validacao.aderenciaHistorica).toBe('boolean');
  });

  it('should handle progress callbacks', async () => {
    const progressUpdates: number[] = [];
    const simulation = new MonteCarloSimulation((progress) => {
      progressUpdates.push(progress);
    });

    await simulation.executeSimulation({
      precoAtual: 1.45,
      volatilidade: 0.35,
      drift: 0.05,
      iacCafe: 60,
      producaoGlobal: 175,
      horizonte: 30,
      simulacoes: 3000 // Suficiente para múltiplos chunks
    });

    // Deve ter recebido callbacks de progresso
    expect(progressUpdates.length).toBeGreaterThan(1);
    expect(progressUpdates[progressUpdates.length - 1]).toBe(100);
  });

  it('should calculate scenario probabilities correctly', async () => {
    const result = await simulation.executeSimulation({
      precoAtual: 1.45,
      volatilidade: 0.35,
      drift: 0.05,
      iacCafe: 60,
      producaoGlobal: 175,
      horizonte: 30,
      simulacoes: 1000
    });

    const { cenarios } = result;
    
    // Probabilidades devem somar próximo a 1.0
    const totalProb = cenarios.pessimista.probabilidade + 
                     cenarios.realista.probabilidade + 
                     cenarios.otimista.probabilidade;
    
    expect(totalProb).toBeCloseTo(1.0, 2);
    
    // Cenário realista deve ter maior probabilidade
    expect(cenarios.realista.probabilidade).toBeGreaterThan(cenarios.pessimista.probabilidade);
    expect(cenarios.realista.probabilidade).toBeGreaterThan(cenarios.otimista.probabilidade);
  });

  it('should execute 10000 simulations efficiently', async () => {
    const start = performance.now();
    
    const result = await simulation.executeSimulation({
      precoAtual: 1.45,
      volatilidade: 0.35,
      drift: 0.05,
      iacCafe: 60,
      producaoGlobal: 175,
      horizonte: 30,
      simulacoes: 10000
    });
    
    const duration = performance.now() - start;
    
    // Performance crítica: <2 segundos para 10k simulações
    expect(duration).toBeLessThan(2000);
    expect(result.metadata.simulacoesExecutadas).toBe(10000);
    expect(result.distribuicao.precos.length).toBe(10000);
  }, 3000); // Timeout de 3s para o teste
});