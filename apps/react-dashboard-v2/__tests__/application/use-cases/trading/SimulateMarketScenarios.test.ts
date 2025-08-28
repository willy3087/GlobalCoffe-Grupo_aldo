import { SimulateMarketScenarios } from '../../../../application/use-cases/trading/SimulateMarketScenarios';

describe('SimulateMarketScenarios Use Case', () => {
  let useCase: SimulateMarketScenarios;

  beforeEach(() => {
    useCase = new SimulateMarketScenarios();
  });

  it('should execute simulation with default parameters', async () => {
    const result = await useCase.execute({});

    expect(result.cenarios).toBeDefined();
    expect(result.distribuicao).toBeDefined();
    expect(result.estatisticas).toBeDefined();
    expect(result.validacao).toBeDefined();
    expect(result.metadata).toBeDefined();

    // Verificar valores padrão
    expect(result.metadata.simulacoesExecutadas).toBe(10000);
    expect(result.metadata.iacUtilizado).toBeGreaterThan(0);
  });

  it('should use custom parameters when provided', async () => {
    const customParams = {
      precoAtual: 1.60,
      volatilidade: 0.25,
      drift: 0.08,
      producaoGlobal: 180,
      horizonte: 45,
      simulacoes: 2000,
      regiao: { latitude: -21.1767, longitude: -47.8208 }
    };

    const result = await useCase.execute(customParams);

    expect(result.metadata.simulacoesExecutadas).toBe(2000);
    expect(result.cenarios.realista.preco).toBeGreaterThan(0);
    expect(result.metadata.iacUtilizado).toBeGreaterThan(0);
  });

  it('should handle progress callbacks', async () => {
    let progressCalled = false;
    const useCaseWithCallback = new SimulateMarketScenarios((progress) => {
      progressCalled = true;
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
    });

    await useCaseWithCallback.execute({ simulacoes: 3000 });
    expect(progressCalled).toBe(true);
  });

  it('should integrate climate data from specific region', async () => {
    const cerradoRegion = {
      regiao: { latitude: -15.7801, longitude: -47.9292 } // Brasília - Cerrado
    };

    const sudestRegion = {
      regiao: { latitude: -21.1767, longitude: -47.8208 } // Ribeirão Preto - SP
    };

    const [resultCerrado, resultSudeste] = await Promise.all([
      useCase.execute({ ...cerradoRegion, simulacoes: 1000 }),
      useCase.execute({ ...sudestRegion, simulacoes: 1000 })
    ]);

    // Ambos devem ter IAC válido
    expect(resultCerrado.metadata.iacUtilizado).toBeGreaterThan(0);
    expect(resultSudeste.metadata.iacUtilizado).toBeGreaterThan(0);
    
    // Impacto climático deve ser definido
    expect(resultCerrado.metadata.climateImpact).toBeDefined();
    expect(resultSudeste.metadata.climateImpact).toBeDefined();
  });

  it('should provide realistic market scenarios', async () => {
    const result = await useCase.execute({
      precoAtual: 1.50,
      simulacoes: 5000
    });

    const { cenarios } = result;

    // Cenário pessimista deve ter preço menor que otimista
    expect(cenarios.pessimista.preco).toBeLessThan(cenarios.otimista.preco);
    
    // Cenário realista deve estar entre pessimista e otimista
    expect(cenarios.realista.preco).toBeGreaterThan(cenarios.pessimista.preco);
    expect(cenarios.realista.preco).toBeLessThan(cenarios.otimista.preco);

    // Variações devem ser coerentes com preços
    expect(cenarios.pessimista.variacao).toBeLessThan(0); // Negativa
    expect(cenarios.otimista.variacao).toBeGreaterThan(0); // Positiva
  });
});