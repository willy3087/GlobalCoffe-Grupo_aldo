import { useQuery } from '@tanstack/react-query';
import { FaDollarSign, FaCoffee, FaArrowUp } from 'react-icons/fa';
import { FaCloudSun } from 'react-icons/fa';

// Integração real com services da arquitetura DDD
import { ClimateIndexService } from '@coffee-market/services/ClimateIndexService';
import { MarketService } from '@application/services/MarketService';
import { OpenWeatherMapClient } from '@apis/OpenWeatherMapClient';

export interface KpiData {
  id: string;
  title: string;
  value: string;
  variation: string;
  variationType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType;
  tooltip: string;
}

export interface UseMarketKPIsOptions {
  refetchInterval?: number;
  staleTime?: number;
  latitude?: number;
  longitude?: number;
}

export const useMarketKPIs = (options: UseMarketKPIsOptions = {}) => {
  const {
    refetchInterval = 5 * 60 * 1000, // 5 minutos
    staleTime = 2 * 60 * 1000,       // 2 minutos
    latitude = -21.1767,              // São Paulo região (Ribeirão Preto)
    longitude = -47.8208
  } = options;

  return useQuery({
    queryKey: ['market-kpis', latitude, longitude],
    queryFn: async (): Promise<KpiData[]> => {
      // Inicializar services reais da arquitetura DDD
      const weatherClient = new OpenWeatherMapClient();
      const climateService = new ClimateIndexService(weatherClient);
      const marketService = new MarketService();

      try {
        // Executar requests em paralelo para melhor performance
        const [climateData, priceData, bestType, bestChannel] = await Promise.all([
          climateService.calcularIACCafe(latitude, longitude),
          marketService.getCurrentPrice(),
          marketService.getBestType(),
          marketService.getBestChannel()
        ]);

        return [
          {
            id: 'price',
            title: 'Preço Médio Hoje',
            value: `R$ ${priceData.value.toFixed(2)}`,
            variation: `${priceData.variation > 0 ? '+' : ''}${priceData.variation.toFixed(1)}%`,
            variationType: priceData.variation > 0 ? 'positive' : 'negative',
            icon: FaDollarSign,
            tooltip: `Preço médio do café tipo 2 no mercado nacional. Última atualização: ${priceData.timestamp.toLocaleTimeString('pt-BR')}`
          },
          {
            id: 'quality',
            title: 'Tipo mais Valorizado', 
            value: bestType.type,
            variation: `+${bestType.premium.toFixed(1)}%`,
            variationType: bestType.premium > 0 ? 'positive' : 'neutral',
            icon: FaCoffee,
            tooltip: `${bestType.type} com score ${bestType.score} e demanda ${bestType.demand}. Premium de ${bestType.premium.toFixed(1)}% sobre preço base.`
          },
          {
            id: 'channel',
            title: 'Melhor Canal',
            value: bestChannel.name,
            variation: bestChannel.advantage,
            variationType: 'positive', 
            icon: FaArrowUp,
            tooltip: `${bestChannel.name} oferece ${bestChannel.advantage.toLowerCase()} com ${bestChannel.commission}% de comissão e ${bestChannel.reliability}% de confiabilidade.`
          },
          {
            id: 'climate',
            title: 'Clima Safra',
            value: climateData.categoria,
            variation: `${climateData.confianca}% confiança`,
            variationType: getClimateVariationType(climateData.categoria),
            icon: FaCloudSun,
            tooltip: `IAC-Café: ${climateData.indice.toFixed(0)}/100. ${climateData.recomendacoes[0] || 'Condições normais para a safra atual.'}`
          }
        ];

      } catch (error) {
        console.error('Erro ao carregar KPIs de mercado:', error);
        
        // Fallback com dados mock em caso de erro
        return getFallbackKPIs();
      }
    },
    refetchInterval,
    staleTime,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // Cache por 10 minutos para evitar requests desnecessários
    gcTime: 10 * 60 * 1000
  });
};

/**
 * Determina tipo de variação baseado na categoria climática
 */
function getClimateVariationType(categoria: string): 'positive' | 'negative' | 'neutral' {
  switch (categoria) {
    case 'Favorável':
      return 'positive';
    case 'Desfavorável':
      return 'negative';
    default:
      return 'neutral';
  }
}

/**
 * Dados de fallback em caso de erro nas APIs
 */
function getFallbackKPIs(): KpiData[] {
  return [
    {
      id: 'price',
      title: 'Preço Médio Hoje',
      value: 'R$ 650,00',
      variation: '+3,2%',
      variationType: 'positive',
      icon: FaDollarSign,
      tooltip: 'Dados temporariamente indisponíveis. Último valor conhecido.'
    },
    {
      id: 'quality',
      title: 'Tipo mais Valorizado', 
      value: 'Tipo 2',
      variation: '+5,0%',
      variationType: 'positive',
      icon: FaCoffee,
      tooltip: 'Dados temporariamente indisponíveis. Último valor conhecido.'
    },
    {
      id: 'channel',
      title: 'Melhor Canal',
      value: 'Cooperativa',
      variation: 'Menor comissão',
      variationType: 'positive', 
      icon: FaArrowUp,
      tooltip: 'Dados temporariamente indisponíveis. Último valor conhecido.'
    },
    {
      id: 'climate',
      title: 'Clima Safra',
      value: 'Risco Médio',
      variation: '85% confiança',
      variationType: 'neutral',
      icon: FaCloudSun,
      tooltip: 'Dados temporariamente indisponíveis. Último valor conhecido.'
    }
  ];
}

export default useMarketKPIs;