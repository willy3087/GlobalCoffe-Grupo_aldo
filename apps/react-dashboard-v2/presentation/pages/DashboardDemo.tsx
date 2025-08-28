import React from 'react';
import { ChakraProvider, Box, Container, VStack, Heading } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MarketOverview } from '@market/MarketOverview';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

/**
 * Demo page para testar componentes KPI refatorados
 * 
 * VALIDAÇÃO RESPONSIVIDADE:
 * - Mobile (base): 2 colunas de KPIs
 * - Desktop (md+): 4 colunas de KPIs
 * - Tipografia escalável
 * - Touch targets ≥44px
 * 
 * INTEGRAÇÃO DDD:
 * - ClimateIndexService (IAC-Café real)
 * - MarketService (preços, canais, qualidade)
 * - Error boundaries resilientes
 * - Loading states consistentes
 */
export const DashboardDemo: React.FC = () => {
  const handleKpiClick = (kpi: any) => {
    console.log('🎯 KPI Clicado:', kpi);
  };

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Box bg="gray.50" minH="100vh" py={8}>
          <Container maxW="1200px">
            <VStack spacing={8} align="stretch">
              
              {/* Título Principal */}
              <Heading 
                size="xl" 
                textAlign="center" 
                color="gray.800"
                mb={4}
              >
                Global Coffee Dashboard v2.0
              </Heading>

              {/* Componente Refatorado - Região São Paulo */}
              <Box>
                <MarketOverview
                  title="São Paulo - Região Cafeeira"
                  latitude={-21.1767}  // Ribeirão Preto
                  longitude={-47.8208}
                  onKpiClick={handleKpiClick}
                  showRealTimeBadge={true}
                />
              </Box>

              {/* Componente para Região Sul de Minas */}
              <Box>
                <MarketOverview
                  title="Sul de Minas - Análise Climática"
                  latitude={-22.2}     // Sul de Minas
                  longitude={-45.0}
                  onKpiClick={handleKpiClick}
                  showRealTimeBadge={false}
                />
              </Box>

            </VStack>
          </Container>
        </Box>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default DashboardDemo;