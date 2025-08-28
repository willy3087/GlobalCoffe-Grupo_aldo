/**
 * Testes unitários para ClimateIndexService
 * 
 * Garante cobertura >95% e valida algoritmo científico
 * IAC-Café em diversos cenários
 */

import { ClimateIndexService, ClimateData, IACResult } from '../../../../domains/coffee-market/services/ClimateIndexService';
import { OpenWeatherMapClient } from '../../../../infrastructure/external-apis/OpenWeatherMapClient';

// Mock do OpenWeatherMapClient
import { vi } from 'vitest';

vi.mock('../../../../infrastructure/external-apis/OpenWeatherMapClient');

describe('ClimateIndexService', () => {
  let service: ClimateIndexService;
  let mockWeatherClient: any;

  beforeEach(() => {
    mockWeatherClient = {
      obterDadosClimaticos: vi.fn(),
      obterPrevisoes7Dias: vi.fn()
    };
    service = new ClimateIndexService(mockWeatherClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('calcularIACCafe', () => {
    const dadosIdealMock = {
      temperatura: 21,    // Dentro da faixa ideal 18-24°C
      precipitacao: 1400, // Dentro da faixa ideal 1200-1800mm
      umidade: 65,        // Dentro da faixa ideal 60-70%
      radiacao: 20,       // Dentro da faixa ideal 17-22 MJ/m²/dia
      velocidadeVento: 10, // Abaixo do limite 15 km/h
      diasExtremos: 1     // Poucos eventos extremos
    };

    beforeEach(() => {
      mockWeatherClient.obterDadosClimaticos.mockResolvedValue(dadosIdealMock);
      mockWeatherClient.obterPrevisoes7Dias.mockResolvedValue([
        {
          data: '2023-01-01',
          temperatura: 21,
          temperaturaMin: 18,
          temperaturaMax: 24,
          precipitacao: 5,
          umidade: 65,
          velocidadeVento: 10
        },
        // Adicionar mais dias com variação mínima para alta confiabilidade
        ...Array(6).fill(0).map((_, i) => ({
          data: `2023-01-0${i + 2}`,
          temperatura: 21.5,
          temperaturaMin: 18.5,
          temperaturaMax: 24.5,
          precipitacao: 3,
          umidade: 66,
          velocidadeVento: 9
        }))
      ]);
    });

    it('deve calcular IAC para condições ideais', async () => {
      const resultado = await service.calcularIACCafe(-22.5, -45.0);

      expect(resultado.indice).toBeGreaterThan(90);
      expect(resultado.categoria).toBe('Favorável');
      expect(resultado.confianca).toBeGreaterThan(80);
      expect(resultado.detalhes.temperatura).toBe(100);
      expect(resultado.detalhes.chuva).toBe(100);
      expect(resultado.detalhes.umidade).toBe(100);
      expect(resultado.detalhes.radiacao).toBe(100);
      expect(resultado.detalhes.vento).toBe(100);
      expect(resultado.detalhes.extremos).toBe(90); // 100 - (1 * 10)
    });

    it('deve categorizar corretamente condições desfavoráveis', async () => {
      const dadosDesfavoraveis = {
        ...dadosIdealMock,
        temperatura: 35,    // Muito alta
        precipitacao: 500,  // Muito baixa
        umidade: 30,        // Muito baixa
        velocidadeVento: 25, // Muito alto
        diasExtremos: 8     // Muitos eventos
      };

      mockWeatherClient.obterDadosClimaticos.mockResolvedValue(dadosDesfavoraveis);

      const resultado = await service.calcularIACCafe(-22.5, -45.0);

      expect(resultado.indice).toBeLessThan(50);
      expect(resultado.categoria).toBe('Desfavorável');
      expect(resultado.recomendacoes.some(rec => /temperatura/i.test(rec))).toBe(true);
    });

    it('deve categorizar corretamente condições de risco médio', async () => {
      const dadosRiscoMedio = {
        ...dadosIdealMock,
        temperatura: 26,    // Ligeiramente alta
        precipitacao: 1000, // Ligeiramente baixa
        umidade: 55,        // Ligeiramente baixa
        diasExtremos: 3     // Alguns eventos
      };

      mockWeatherClient.obterDadosClimaticos.mockResolvedValue(dadosRiscoMedio);

      const resultado = await service.calcularIACCafe(-22.5, -45.0);

      expect(resultado.indice).toBeGreaterThanOrEqual(50);
      expect(resultado.indice).toBeLessThan(75);
      expect(resultado.categoria).toBe('Risco Médio');
    });

    it('deve executar em menos de 2 segundos', async () => {
      const inicio = Date.now();
      
      await service.calcularIACCafe(-22.5, -45.0);
      
      const tempoExecucao = Date.now() - inicio;
      expect(tempoExecucao).toBeLessThan(2000);
    });

    it('deve tratar erros graciosamente', async () => {
      mockWeatherClient.obterDadosClimaticos.mockRejectedValue(
        new Error('API Error')
      );

      const resultado = await service.calcularIACCafe(-22.5, -45.0);

      // Deve retornar dados mock em caso de erro
      expect(resultado).toBeDefined();
      expect(resultado.indice).toBeGreaterThan(0);
      expect(resultado.categoria).toBeDefined();
    });
  });

  describe('aplicarFuncaoTrapezoidal', () => {
    const service_test = new ClimateIndexService(mockWeatherClient);
    
    it('deve retornar score máximo para valores na faixa ideal', () => {
      // Acessar método privado via casting para teste
      const score = (service_test as any).aplicarFuncaoTrapezoidal(21, [18, 24], 0.25);
      expect(score).toBe(100);
    });

    it('deve retornar score zero para valores fora da tolerância', () => {
      // Temperatura muito baixa (fora da tolerância de 25%)
      const scoreBaixo = (service_test as any).aplicarFuncaoTrapezoidal(12, [18, 24], 0.25);
      expect(scoreBaixo).toBe(0);

      // Temperatura muito alta (fora da tolerância de 25%)
      const scoreAlto = (service_test as any).aplicarFuncaoTrapezoidal(32, [18, 24], 0.25);
      expect(scoreAlto).toBe(0);
    });

    it('deve interpolar linearmente dentro da tolerância', () => {
      // Valor na zona de tolerância (entre 13.5 e 18)
      const score = (service_test as any).aplicarFuncaoTrapezoidal(15.75, [18, 24], 0.25);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(100);
      expect(score).toBeCloseTo(50, 1); // Aproximadamente no meio da rampa
    });
  });

  describe('calcularScoreVento', () => {
    const service_test = new ClimateIndexService(mockWeatherClient);

    it('deve retornar score máximo para vento ≤ 15 km/h', () => {
      const score = (service_test as any).calcularScoreVento(15);
      expect(score).toBe(100);

      const scoreBaixo = (service_test as any).calcularScoreVento(8);
      expect(scoreBaixo).toBe(100);
    });

    it('deve penalizar progressivamente ventos > 15 km/h', () => {
      const score20 = (service_test as any).calcularScoreVento(20);
      expect(score20).toBe(75); // 100 - (20-15)*5 = 75

      const score25 = (service_test as any).calcularScoreVento(25);
      expect(score25).toBe(50); // 100 - (25-15)*5 = 50
    });

    it('deve limitar score mínimo a zero', () => {
      const score = (service_test as any).calcularScoreVento(50);
      expect(score).toBe(0);
    });
  });

  describe('calcularScoreEventosExtremos', () => {
    const service_test = new ClimateIndexService(mockWeatherClient);

    it('deve reduzir 10 pontos por dia extremo', () => {
      expect((service_test as any).calcularScoreEventosExtremos(0)).toBe(100);
      expect((service_test as any).calcularScoreEventosExtremos(1)).toBe(90);
      expect((service_test as any).calcularScoreEventosExtremos(5)).toBe(50);
    });

    it('deve limitar score mínimo a zero', () => {
      expect((service_test as any).calcularScoreEventosExtremos(15)).toBe(0);
    });
  });

  describe('determinarCategoria', () => {
    const service_test = new ClimateIndexService(mockWeatherClient);

    it('deve categorizar corretamente por thresholds', () => {
      expect((service_test as any).determinarCategoria(85)).toBe('Favorável');
      expect((service_test as any).determinarCategoria(75)).toBe('Favorável');
      expect((service_test as any).determinarCategoria(65)).toBe('Risco Médio');
      expect((service_test as any).determinarCategoria(50)).toBe('Risco Médio');
      expect((service_test as any).determinarCategoria(45)).toBe('Desfavorável');
    });
  });

  describe('gerarRecomendacoes', () => {
    const service_test = new ClimateIndexService(mockWeatherClient);

    it('deve gerar recomendações específicas por problema', () => {
      const scores = {
        temperatura: 40, // Baixo
        chuva: 40,       // Baixo
        umidade: 80,     // OK
        radiacao: 80,    // OK
        vento: 60,       // Médio
        extremos: 60     // Médio
      };

      const dadosMock: ClimateData = {
        temperatura: 15,  // Baixa
        chuva: 800,      // Baixa
        umidade: 65,
        radiacao: 20,
        vento: 20,       // Alto
        extremos: 4      // Alguns eventos
      };

      const recomendacoes = (service_test as any).gerarRecomendacoes(
        scores, 
        'Risco Médio', 
        dadosMock
      );

      expect(recomendacoes.some(rec => /temperatura baixa/i.test(rec))).toBe(true);
      expect(recomendacoes.some(rec => /precipitação insuficiente/i.test(rec))).toBe(true);
      expect(recomendacoes.some(rec => /ventos fortes/i.test(rec))).toBe(true);
      expect(recomendacoes.some(rec => /eventos climáticos extremos/i.test(rec))).toBe(true);
    });

    it('deve incluir recomendação por categoria', () => {
      const scoresOK = {
        temperatura: 100, chuva: 100, umidade: 100,
        radiacao: 100, vento: 100, extremos: 100
      };
      
      const dadosOK: ClimateData = {
        temperatura: 21, chuva: 1400, umidade: 65,
        radiacao: 20, vento: 10, extremos: 0
      };

      const recomendacoesFavoravel = (service_test as any).gerarRecomendacoes(
        scoresOK, 
        'Favorável', 
        dadosOK
      );

      expect(recomendacoesFavoravel.some(rec => /condições favoráveis/i.test(rec))).toBe(true);
    });
  });

  describe('integração completa', () => {
    it('deve calcular IAC completo com dados reais simulados', async () => {
      // Simular dados de região cafeeira real (Sul de Minas)
      const dadosReais = {
        temperatura: 20.5,
        precipitacao: 1450,
        umidade: 68,
        radiacao: 18.5,
        velocidadeVento: 12,
        diasExtremos: 2
      };

      mockWeatherClient.obterDadosClimaticos.mockResolvedValue(dadosReais);

      const resultado = await service.calcularIACCafe(-22.2, -45.0);

      // Validar estrutura completa do resultado
      expect(resultado).toHaveProperty('indice');
      expect(resultado).toHaveProperty('categoria');
      expect(resultado).toHaveProperty('confianca');
      expect(resultado).toHaveProperty('detalhes');
      expect(resultado).toHaveProperty('recomendacoes');

      expect(resultado.indice).toBeGreaterThanOrEqual(0);
      expect(resultado.indice).toBeLessThanOrEqual(100);
      expect(['Favorável', 'Risco Médio', 'Desfavorável']).toContain(resultado.categoria);
      expect(resultado.confianca).toBeGreaterThanOrEqual(0);
      expect(resultado.confianca).toBeLessThanOrEqual(100);
      expect(Array.isArray(resultado.recomendacoes)).toBe(true);
    });
  });
});