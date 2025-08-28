import React from 'react';
import { 
  Box, 
  Heading, 
  SimpleGrid, 
  Badge, 
  HStack, 
  Text, 
  useToast,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useMarketKPIs, KpiData } from '@hooks/market/useMarketKPIs';
import { KpiCard } from './KpiCard';
import { ErrorAlert } from '@shared/ErrorAlert';

export interface MarketOverviewProps {
  /** Coordenadas para análise climática personalizada */
  latitude?: number;
  longitude?: number;
  /** Callback quando um KPI é clicado */
  onKpiClick?: (kpi: KpiData) => void;
  /** Título customizado */
  title?: string;
  /** Mostrar badge de tempo real */
  showRealTimeBadge?: boolean;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  latitude = -21.1767,  // Ribeirão Preto - região cafeeira
  longitude = -47.8208,
  onKpiClick,
  title = 'Visão Geral do Mercado',
  showRealTimeBadge = true
}) => {
  const toast = useToast();
  
  const { 
    data: kpis, 
    isLoading, 
    error, 
    refetch,
    dataUpdatedAt,
    isRefetching
  } = useMarketKPIs({ 
    latitude, 
    longitude,
    refetchInterval: 5 * 60 * 1000, // 5 minutos
    staleTime: 2 * 60 * 1000        // 2 minutos
  });
  
  const handleKpiClick = (kpi: KpiData) => {
    // Toast informativo quando KPI é clicado
    toast({
      title: kpi.title,
      description: kpi.tooltip,
      status: 'info',
      duration: 4000,
      isClosable: true,
      position: 'top-right'
    });
    
    if (onKpiClick) {
      onKpiClick(kpi);
    }
  };

  const handleRetry = () => {
    refetch();
    
    toast({
      title: 'Atualizando dados',
      description: 'Buscando informações mais recentes...',
      status: 'loading',
      duration: 2000,
      isClosable: true
    });
  };

  if (error) {
    return (
      <Box>
        <HStack justify="space-between" mb={4}>
          <Heading size="md" color="gray.700">
            {title}
          </Heading>
        </HStack>
        
        <ErrorAlert 
          error={error} 
          onRetry={handleRetry}
          title="Erro ao carregar KPIs do mercado"
          showRetryButton={true}
        />
      </Box>
    );
  }

  const formatLastUpdate = () => {
    if (!dataUpdatedAt) return null;
    
    return formatDistanceToNow(new Date(dataUpdatedAt), { 
      addSuffix: true,
      locale: ptBR 
    });
  };

  return (
    <Box role="region" aria-labelledby="market-overview-title">
      <Flex 
        justify="space-between" 
        align="center" 
        mb={4}
        wrap="wrap"
        gap={2}
      >
        <Heading 
          id="market-overview-title"
          size="md" 
          color="gray.700"
        >
          {title}
        </Heading>
        
        <HStack spacing={2}>
          {isRefetching && (
            <HStack>
              <Spinner size="xs" color="blue.500" />
              <Text fontSize="xs" color="gray.500">
                Atualizando...
              </Text>
            </HStack>
          )}
          
          {showRealTimeBadge && !isRefetching && (
            <Badge 
              colorScheme="green" 
              variant="subtle"
              fontSize="xs"
            >
              Tempo real
            </Badge>
          )}
        </HStack>
      </Flex>
      
      <SimpleGrid 
        columns={{ base: 2, md: 4 }} 
        spacing={4}
        role="grid"
        aria-label="KPIs do mercado de café"
      >
        {isLoading ? (
          // Skeleton loading para 4 cards
          Array.from({ length: 4 }, (_, index) => (
            <Box key={`skeleton-${index}`} role="gridcell">
              <KpiCard
                id={`loading-${index}`}
                title=""
                value=""
                variation=""
                variationType="neutral"
                icon={() => null}
                isLoading={true}
              />
            </Box>
          ))
        ) : (
          kpis?.map((kpi) => (
            <Box key={kpi.id} role="gridcell">
              <KpiCard 
                {...kpi}
                isLoading={false}
                onClick={() => handleKpiClick(kpi)}
              />
            </Box>
          ))
        )}
      </SimpleGrid>
      
      {dataUpdatedAt && !isLoading && (
        <Text 
          fontSize="xs" 
          color="gray.500" 
          mt={3} 
          textAlign="center"
          role="status"
          aria-live="polite"
        >
          Última atualização: {formatLastUpdate()}
        </Text>
      )}
    </Box>
  );
};

export default MarketOverview;