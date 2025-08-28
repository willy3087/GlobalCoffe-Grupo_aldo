/**
 * EXEMPLO DE INTEGRAÇÃO - MONTE CARLO GBM PARA CENÁRIOS DE CAFÉ
 * 
 * Este exemplo demonstra como usar o algoritmo Monte Carlo implementado
 * para simulação de cenários de preços de café com integração climática.
 */

import { SimulateMarketScenarios } from '../application/use-cases/trading/SimulateMarketScenarios';

// Exemplo básico de uso
export async function exemploBasico() {
  console.log('🚀 Exemplo 1: Simulação básica com parâmetros padrão');
  
  const useCase = new SimulateMarketScenarios((progress) => {
    console.log(`Progresso: ${progress.toFixed(1)}%`);
  });

  try {
    const resultado = await useCase.execute({});
    
    console.log('📊 Resultados da Simulação:');
    console.log(`💰 Cenário Pessimista: $${resultado.cenarios.pessimista.preco.toFixed(3)}/lb (${resultado.cenarios.pessimista.variacao.toFixed(1)}%)`);
    console.log(`💰 Cenário Realista: $${resultado.cenarios.realista.preco.toFixed(3)}/lb (${resultado.cenarios.realista.variacao.toFixed(1)}%)`);
    console.log(`💰 Cenário Otimista: $${resultado.cenarios.otimista.preco.toFixed(3)}/lb (${resultado.cenarios.otimista.variacao.toFixed(1)}%)`);
    console.log(`🌤️ IAC-Café: ${resultado.metadata.iacUtilizado.toFixed(1)} - ${resultado.metadata.climateImpact}`);
    console.log(`⏱️ Tempo de execução: ${resultado.metadata.executionTimeMs.toFixed(0)}ms`);
    
    return resultado;
  } catch (error) {
    console.error('❌ Erro na simulação:', error);
    throw error;
  }
}

// Exemplo com parâmetros personalizados
export async function exemploPersonalizado() {
  console.log('🚀 Exemplo 2: Simulação com parâmetros personalizados');
  
  const useCase = new SimulateMarketScenarios();
  
  // Configuração para região de Minas Gerais
  const parametros = {
    precoAtual: 1.55,           // Preço atual mais alto
    volatilidade: 0.28,         // Volatilidade menor (mercado mais estável)
    drift: 0.08,                // Tendência de alta mais acentuada
    producaoGlobal: 168,        // Produção global menor (oferta reduzida)
    horizonte: 45,              // Horizonte de 45 dias
    simulacoes: 15000,          // Mais simulações para maior precisão
    regiao: {
      latitude: -19.9167,       // Belo Horizonte - MG
      longitude: -43.9345
    }
  };

  try {
    const resultado = await useCase.execute(parametros);
    
    console.log('📊 Resultados Personalizados:');
    console.log(`💰 Cenários (45 dias, MG):`);
    console.log(`   Pessimista: $${resultado.cenarios.pessimista.preco.toFixed(3)} (${resultado.cenarios.pessimista.variacao.toFixed(1)}%)`);
    console.log(`   Realista: $${resultado.cenarios.realista.preco.toFixed(3)} (${resultado.cenarios.realista.variacao.toFixed(1)}%)`);  
    console.log(`   Otimista: $${resultado.cenarios.otimista.preco.toFixed(3)} (${resultado.cenarios.otimista.variacao.toFixed(1)}%)`);
    
    console.log(`📈 Estatísticas:`);
    console.log(`   Média: $${resultado.estatisticas.media.toFixed(3)}`);
    console.log(`   Desvio: $${resultado.estatisticas.desvioPadrao.toFixed(3)}`);
    console.log(`   Assimetria: ${resultado.estatisticas.assimetria.toFixed(3)}`);
    
    console.log(`🌤️ Clima: ${resultado.metadata.climateImpact}`);
    console.log(`✅ Validação: ${resultado.validacao.aderenciaHistorica ? 'Aprovada' : 'Rejeitada'} (p=${resultado.validacao.pValue.toFixed(3)})`);
    
    return resultado;
  } catch (error) {
    console.error('❌ Erro na simulação personalizada:', error);
    throw error;
  }
}

// Exemplo comparativo de regiões
export async function exemploComparativoRegioes() {
  console.log('🚀 Exemplo 3: Comparação entre regiões cafeeiras');
  
  const useCase = new SimulateMarketScenarios();
  
  const regioes = [
    { nome: 'Cerrado (BA/GO)', lat: -12.0, lng: -45.0 },
    { nome: 'Sul de Minas', lat: -21.5, lng: -45.5 },
    { nome: 'Mogiana (SP)', lat: -21.2, lng: -47.8 },
    { nome: 'Norte do Paraná', lat: -23.3, lng: -51.2 }
  ];

  const parametrosBase = {
    precoAtual: 1.50,
    volatilidade: 0.32,
    drift: 0.06,
    producaoGlobal: 175,
    horizonte: 30,
    simulacoes: 5000
  };

  try {
    console.log('💡 Comparando impacto climático por região...\n');
    
    for (const regiao of regioes) {
      const resultado = await useCase.execute({
        ...parametrosBase,
        regiao: { latitude: regiao.lat, longitude: regiao.lng }
      });
      
      console.log(`🌍 ${regiao.nome}:`);
      console.log(`   IAC-Café: ${resultado.metadata.iacUtilizado.toFixed(1)}`);
      console.log(`   Preço Realista: $${resultado.cenarios.realista.preco.toFixed(3)}`);
      console.log(`   Impacto: ${resultado.metadata.climateImpact}`);
      console.log('');
    }
  } catch (error) {
    console.error('❌ Erro na comparação de regiões:', error);
    throw error;
  }
}

// Exemplo de análise de sensibilidade
export async function exemploAnaliseSensibilidade() {
  console.log('🚀 Exemplo 4: Análise de sensibilidade - volatilidade');
  
  const useCase = new SimulateMarketScenarios();
  
  const volatilidades = [0.20, 0.25, 0.30, 0.35, 0.40, 0.45]; // 20% a 45%
  
  const parametrosBase = {
    precoAtual: 1.50,
    drift: 0.05,
    producaoGlobal: 175,
    horizonte: 30,
    simulacoes: 3000,
    iacCafe: 65 // Condições médias
  };

  try {
    console.log('📊 Análise de Sensibilidade - Impacto da Volatilidade:\n');
    
    for (const vol of volatilidades) {
      const resultado = await useCase.execute({
        ...parametrosBase,
        volatilidade: vol
      });
      
      const spread = resultado.cenarios.otimista.preco - resultado.cenarios.pessimista.preco;
      
      console.log(`σ = ${(vol*100).toFixed(0)}%:`);
      console.log(`   Spread P90-P10: $${spread.toFixed(3)}`);
      console.log(`   Desvio Padrão: $${resultado.estatisticas.desvioPadrao.toFixed(3)}`);
      console.log(`   Preço Médio: $${resultado.estatisticas.media.toFixed(3)}`);
      console.log('');
    }
  } catch (error) {
    console.error('❌ Erro na análise de sensibilidade:', error);
    throw error;
  }
}

// Execução dos exemplos (para demonstração)
export async function executarTodosExemplos() {
  console.log('🎯 DEMONSTRAÇÃO COMPLETA - MONTE CARLO GBM CAFÉ\n');
  console.log('=' .repeat(60));
  
  try {
    await exemploBasico();
    console.log('\n' + '=' .repeat(60));
    
    await exemploPersonalizado();  
    console.log('\n' + '=' .repeat(60));
    
    await exemploComparativoRegioes();
    console.log('\n' + '=' .repeat(60));
    
    await exemploAnaliseSensibilidade();
    console.log('\n' + '=' .repeat(60));
    
    console.log('✅ Todos os exemplos executados com sucesso!');
  } catch (error) {
    console.error('❌ Falha na execução dos exemplos:', error);
  }
}

// Export para uso em outros arquivos
export default {
  exemploBasico,
  exemploPersonalizado, 
  exemploComparativoRegioes,
  exemploAnaliseSensibilidade,
  executarTodosExemplos
};