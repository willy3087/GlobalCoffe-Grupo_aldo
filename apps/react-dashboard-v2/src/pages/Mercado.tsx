import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  ButtonGroup,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
  HStack,
  Flex,
  Spacer,
  Divider,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { RefreshCw, TrendingUp, TrendingDown, Activity, ShoppingCart, DollarSign } from 'react-feather';
import { useThemeContext } from '../contexts/ThemeContext';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { ServiceContainer } from '../services/ServiceContainer';
import { MarketDataDTO } from '../dtos/MarketDataDTO';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MarketData {
  ultimo: number;
  variacao: number;
  variacaoPercentual: number;
  maximo: number;
  minimo: number;
  volume: number;
  abertura: number;
  fechamento: number;
}

interface PriceData {
  tipo: string;
  origem: string;
  qualidade: string;
  preco: number;
  variacao: number;
  volume: number;
}

interface NewsItem {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  tempo: string;
  impacto: 'positive' | 'negative' | 'neutral';
  imagem?: string;
  relevancia?: number;
}

interface TradeOrder {
  id: string;
  tipo: 'buy' | 'sell';
  preco: number;
  volume: number;
  timestamp: Date;
  status: 'executed';
}

const Mercado: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const toast = useToast();
  
  // Estados
  const [selectedPeriod, setSelectedPeriod] = useState('5D');
  const [marketData, setMarketData] = useState<MarketData>({
    ultimo: 1842.00,
    variacao: 58.00,
    variacaoPercentual: 3.2,
    maximo: 1850.00,
    minimo: 1780.00,
    volume: 15200,
    abertura: 1784.00,
    fechamento: 1842.00,
  });
  
  // Estados aprimorados
  const [tradeHistory, setTradeHistory] = useState<TradeOrder[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [tradeStatus, setTradeStatus] = useState('');
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [volumeHistory, setVolumeHistory] = useState<number[]>([]);
  const [smaData, setSmaData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [priceTableData, setPriceTableData] = useState<PriceData[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  // Serviços
  const marketDataService = ServiceContainer.getMarketDataService();
  const analyticsService = ServiceContainer.getAnalyticsService();

  // Constantes para movimentos realistas de preço
  const VOLATILITY = 0.005; // 0.5% volatilidade
  const TREND_PERSISTENCE = 0.6; // 60% chance de seguir tendência

  const borderColor = currentTheme.colors.border.primary;

  // Carregamento inicial dos dados do mercado
  const loadMarketData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Carrega dados de mercado atuais
      const currentMarketResult = await marketDataService.getCurrentMarketData();
      if (currentMarketResult.success && currentMarketResult.data) {
        const data = currentMarketResult.data;
        setMarketData({
          ultimo: data.currentPrice,
          variacao: data.dailyChange,
          variacaoPercentual: data.dailyChangePercent,
          maximo: data.dailyHigh,
          minimo: data.dailyLow,
          volume: data.volume,
          abertura: data.openPrice,
          fechamento: data.previousClose,
        });
      }

      // Carrega histórico de preços
      const priceHistoryResult = await marketDataService.getPriceHistory(selectedPeriod);
      if (priceHistoryResult.success && priceHistoryResult.data) {
        setPriceHistory(priceHistoryResult.data.prices);
        setVolumeHistory(priceHistoryResult.data.volumes);
      }

      // Carrega dados da tabela de preços
      const priceTableResult = await marketDataService.getPriceTable();
      if (priceTableResult.success && priceTableResult.data) {
        setPriceTableData(priceTableResult.data);
      } else {
        // Fallback para dados mock
        setPriceTableData(generateMockPriceTable());
      }

      // Carrega notícias do mercado
      const newsResult = await analyticsService.getMarketNews();
      if (newsResult.success && newsResult.data) {
        setNewsItems(newsResult.data);
      } else {
        setNewsItems(generateMockNews());
      }

    } catch (error) {
      console.error('Erro ao carregar dados do mercado:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do mercado',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Fallback para dados mock
      setPriceTableData(generateMockPriceTable());
      setNewsItems(generateMockNews());
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, marketDataService, analyticsService, toast]);

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);

  // Funções de trading
  const executeOrder = useCallback(async (type: 'buy' | 'sell') => {
    try {
      const result = await marketDataService.executeTradeOrder({
        type,
        price: marketData.ultimo,
        volume: 100,
        symbol: 'COFFEE_ARABICA'
      });

      if (result.success && result.data) {
        const order: TradeOrder = {
          id: result.data.orderId,
          tipo: type,
          preco: marketData.ultimo,
          volume: 100,
          timestamp: new Date(),
          status: 'executed'
        };
        
        setTradeHistory(prev => [order, ...prev.slice(0, 9)]);
        setTradeStatus(`${type === 'buy' ? 'Compra' : 'Venda'} executada: 100 sacas @ R$ ${marketData.ultimo.toFixed(2)}`);
        
        toast({
          title: 'Ordem Executada',
          description: `${type === 'buy' ? 'Compra' : 'Venda'} de 100 sacas realizada com sucesso`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(result.error?.message || 'Erro ao executar ordem');
      }
    } catch (error) {
      toast({
        title: 'Erro na Ordem',
        description: 'Não foi possível executar a ordem de trading',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setTimeout(() => {
      setTradeStatus('');
    }, 3000);
  }, [marketData.ultimo, marketDataService, toast]);

  // Atualização de notícias
  const refreshNews = useCallback(async () => {
    setNewsLoading(true);
    try {
      const result = await analyticsService.refreshMarketNews();
      if (result.success && result.data) {
        setNewsItems(result.data);
        toast({
          title: 'Notícias Atualizadas',
          description: 'Feed de notícias atualizado com sucesso',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        throw new Error(result.error?.message || 'Erro ao atualizar notícias');
      }
    } catch (error) {
      // Fallback para simulação de novas notícias
      const mockNews = [
        {
          id: Date.now().toString(),
          titulo: 'Spread entre arábica e robusta atinge máxima do ano',
          descricao: 'Diferença de preço entre as duas principais variedades de café alcança níveis históricos devido a fatores climáticos.',
          prioridade: 'Alta' as const,
          tempo: 'Agora',
          impacto: 'negative' as const,
          imagem: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=150&fit=crop',
          relevancia: 95,
        },
        ...newsItems.slice(0, 3)
      ];
      setNewsItems(mockNews);
    } finally {
      setNewsLoading(false);
    }
  }, [analyticsService, newsItems, toast]);

  // Dados mock para fallback
  const generateMockPriceTable = (): PriceData[] => [
    { tipo: 'Café Arábica (KC)', origem: 'Spot', qualidade: 'Premium', preco: 1842, variacao: 2.5, volume: 12345 },
    { tipo: 'Café Robusta (RC)', origem: 'Spot', qualidade: 'Standard', preco: 1565, variacao: -0.3, volume: 8765 },
    { tipo: 'Futuros Café Arábica', origem: 'Dez/2024', qualidade: 'Premium', preco: 1878, variacao: 1.1, volume: 15230 },
    { tipo: 'Futuros Café Robusta', origem: 'Jan/2025', qualidade: 'Standard', preco: 1580, variacao: -0.5, volume: 9500 },
    { tipo: 'Arábica Sul de Minas', origem: 'Sul de Minas', qualidade: 'Tipo 6', preco: 1825, variacao: 1.8, volume: 1200 },
    { tipo: 'Conilon ES', origem: 'Espírito Santo', qualidade: 'Tipo 7', preco: 1320, variacao: 2.1, volume: 1500 },
  ];

  const generateMockNews = (): NewsItem[] => [
    {
      id: '1',
      titulo: 'Café futuro sobe com preocupações sobre oferta global',
      descricao: 'Contratos futuros de café arábica avançam 2,5% na ICE após relatórios indicarem redução nas estimativas de produção.',
      prioridade: 'Alta',
      tempo: '2h atrás',
      impacto: 'negative',
      imagem: 'https://images.unsplash.com/photo-1625806786037-3c7d5df83985?w=200&h=150&fit=crop',
      relevancia: 95,
    },
    {
      id: '2',
      titulo: 'Análise técnica: Café rompe resistência importante em US$ 2,45',
      descricao: 'Traders acompanham movimento de alta após rompimento de nível técnico chave. Volume de negociação aumenta 30%.',
      prioridade: 'Alta',
      tempo: '5h atrás',
      impacto: 'positive',
      imagem: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=200&h=150&fit=crop',
      relevancia: 88,
    },
    {
      id: '3',
      titulo: 'Fundos aumentam posições compradas em café',
      descricao: 'Relatório CFTC mostra aumento de 15% nas posições líquidas compradas de fundos especulativos na última semana.',
      prioridade: 'Média',
      tempo: '8h atrás',
      impacto: 'positive',
      imagem: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=150&fit=crop',
      relevancia: 72,
    },
    {
      id: '4',
      titulo: 'Volatilidade do café atrai traders algorítmicos',
      descricao: 'Aumento da volatilidade no mercado de café tem atraído mais operações automatizadas e de alta frequência.',
      prioridade: 'Baixa',
      tempo: '1d atrás',
      impacto: 'neutral',
      imagem: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=150&fit=crop',
      relevancia: 65,
    },
  ];

  // Funções para movimentos realistas de preços
  const generateNormalRandom = useCallback(() => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }, []);
  
  const generatePriceMovement = useCallback(() => {
    const trend = Math.random() > TREND_PERSISTENCE ? 
      (marketData.ultimo > marketData.fechamento ? 1 : -1) : 
      (Math.random() > 0.5 ? 1 : -1);
    
    const changePercent = generateNormalRandom() * VOLATILITY * 0.3;
    const trendComponent = trend * VOLATILITY * 0.1;
    
    return marketData.ultimo * (1 + changePercent + trendComponent);
  }, [marketData.ultimo, marketData.fechamento, generateNormalRandom]);
  
  const generateRealisticVolume = useCallback(() => {
    const baseVolume = 4000 + Math.random() * 6000;
    const volatilityMultiplier = 1 + Math.abs(marketData.ultimo - marketData.fechamento) / marketData.fechamento * 20;
    return Math.floor(baseVolume * volatilityMultiplier);
  }, [marketData.ultimo, marketData.fechamento]);
  
  const calculateSMA = useCallback((data: number[], period: number) => {
    if (data.length < period) return null;
    const sum = data.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }, []);

  // Dados para gráficos aprimorados
  const priceChartData = {
    labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    datasets: [
      {
        label: 'Preço (R$/saca)',
        data: priceHistory.length > 0 ? priceHistory.slice(-9) : [1784, 1792, 1788, 1795, 1810, 1825, 1835, 1840, 1842],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        tension: 0.3,
        fill: false,
        type: 'line' as const,
      },
      {
        label: 'SMA 20',
        data: smaData.length > 0 ? smaData.slice(-9) : [1786, 1790, 1792, 1798, 1805, 1815, 1825, 1832, 1838],
        borderColor: '#ff9f40',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        type: 'line' as const,
      },
    ],
  };

  const volumeChartData = {
    labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    datasets: [
      {
        label: 'Volume (sacas)',
        data: volumeHistory.length > 0 ? volumeHistory.slice(-9) : [4200, 5450, 3800, 7100, 6200, 8300, 5900, 7200, 6150],
        backgroundColor: function(context: any) {
          const index = context.dataIndex;
          const priceData = priceHistory.length > 0 ? priceHistory.slice(-9) : [1784, 1792, 1788, 1795, 1810, 1825, 1835, 1840, 1842];
          if (index === 0) return 'rgba(100, 100, 100, 0.6)';
          const trend = priceData[index] >= priceData[index - 1];
          return trend ? 'rgba(46, 204, 113, 0.8)' : 'rgba(231, 76, 60, 0.8)';
        },
        borderColor: function(context: any) {
          const index = context.dataIndex;
          const priceData = priceHistory.length > 0 ? priceHistory.slice(-9) : [1784, 1792, 1788, 1795, 1810, 1825, 1835, 1840, 1842];
          if (index === 0) return 'rgba(100, 100, 100, 1)';
          const trend = priceData[index] >= priceData[index - 1];
          return trend ? 'rgba(39, 174, 96, 1)' : 'rgba(192, 57, 43, 1)';
        },
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const volumeChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp size={16} color={currentTheme.colors.status.success} />;
      case 'negative':
        return <TrendingDown size={16} color={currentTheme.colors.status.error} />;
      default:
        return <Activity size={16} color={currentTheme.colors.text.secondary} />;
    }
  };

  // Atualizações em tempo real aprimoradas
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrice = generatePriceMovement();
      const boundedPrice = Math.max(1750, Math.min(1850, newPrice));
      const newVolume = generateRealisticVolume();
      
      setMarketData(prev => {
        const variacao = boundedPrice - prev.fechamento;
        const variacaoPercentual = (variacao / prev.fechamento) * 100;
        
        return {
          ...prev,
          ultimo: boundedPrice,
          variacao: variacao,
          variacaoPercentual: variacaoPercentual,
          maximo: Math.max(prev.maximo, boundedPrice),
          minimo: Math.min(prev.minimo, boundedPrice),
          volume: prev.volume + newVolume,
        };
      });
      
      // Atualiza histórico de preços e calcula SMA
      setPriceHistory(prev => {
        const newHistory = [...prev, boundedPrice];
        if (newHistory.length > 60) newHistory.shift();
        return newHistory;
      });
      
      setVolumeHistory(prev => {
        const newHistory = [...prev, newVolume];
        if (newHistory.length > 60) newHistory.shift();
        return newHistory;
      });
      
      // Atualiza dados da tabela com variações realistas
      setPriceTableData(prev => prev.map((item, index) => {
        const basePrice = index === 0 ? boundedPrice : boundedPrice * (0.8 + index * 0.05);
        const variation = (Math.random() - 0.5) * 4; // -2% to +2%
        const newPrice = basePrice * (1 + variation / 100);
        
        return {
          ...item,
          preco: newPrice,
          variacao: variation,
          volume: Math.floor(newVolume * (0.5 + Math.random() * 1.5))
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [generatePriceMovement, generateRealisticVolume]);
  
  // Calcula SMA quando o histórico de preços muda
  useEffect(() => {
    if (priceHistory.length >= 20) {
      const smaValues = [];
      for (let i = 19; i < priceHistory.length; i++) {
        const sma = calculateSMA(priceHistory.slice(0, i + 1), 20);
        smaValues.push(sma || 0);
      }
      setSmaData(smaValues);
    }
  }, [priceHistory, calculateSMA]);
  
  // Auto-refresh de notícias a cada 5 minutos
  useEffect(() => {
    const newsInterval = setInterval(() => {
      refreshNews();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(newsInterval);
  }, [refreshNews]);

  if (isLoading) {
    return (
      <Box bg={currentTheme.colors.background.secondary} minH="100vh">
        <PageHeader 
          title="Bolsa de Valores - Café" 
          subtitle="Acompanhe cotações e tendências do mercado de café em tempo real"
          icon={TrendingUp}
        />
        <Container maxW="container.2xl" py={6}>
          <Flex justify="center" align="center" h="400px">
            <VStack spacing={4}>
              <Spinner size="xl" color={currentTheme.colors.primary} />
              <Text>Carregando dados do mercado...</Text>
            </VStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={currentTheme.colors.background.secondary} minH="100vh">
      <PageHeader 
        title="Bolsa de Valores - Café" 
        subtitle="Acompanhe cotações e tendências do mercado de café em tempo real"
        icon={TrendingUp}
      />
      <Container maxW="container.2xl" py={6}>
        <VStack spacing={6} align="stretch">

          <Grid templateColumns={{ base: '1fr', xl: '3fr 1fr' }} gap={6}>
            {/* Área Principal */}
            <GridItem>
              {/* Cards de Informações do Mercado */}
              <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }} gap={4} mb={6}>
                <Card bg="white" borderWidth={1} borderColor={borderColor}>
                  <CardBody p={4}>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary}>Último Preço</StatLabel>
                      <StatNumber fontSize="xl" color={currentTheme.colors.text.primary}>R$ {marketData.ultimo.toFixed(2)}</StatNumber>
                      <StatHelpText color={marketData.variacaoPercentual >= 0 ? currentTheme.colors.trading.positive : currentTheme.colors.trading.negative}>
                        <StatArrow type={marketData.variacaoPercentual >= 0 ? 'increase' : 'decrease'} />
                        {Math.abs(marketData.variacaoPercentual).toFixed(2)}%
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg="white" borderWidth={1} borderColor={borderColor} borderLeftWidth={4} borderLeftColor={marketData.variacao >= 0 ? currentTheme.colors.trading.positive : currentTheme.colors.trading.negative}>
                  <CardBody p={4}>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary}>Variação (R$)</StatLabel>
                      <StatNumber fontSize="xl" color={marketData.variacao >= 0 ? currentTheme.colors.trading.positive : currentTheme.colors.trading.negative}>
                        {marketData.variacao >= 0 ? '+' : ''}R$ {Math.abs(marketData.variacao).toFixed(2)}
                      </StatNumber>
                      <StatHelpText color={marketData.variacaoPercentual >= 0 ? currentTheme.colors.trading.positive : currentTheme.colors.trading.negative}>
                        {marketData.variacaoPercentual >= 0 ? '+' : ''}{marketData.variacaoPercentual.toFixed(2)}%
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg="white" borderWidth={1} borderColor={borderColor}>
                  <CardBody p={4}>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary}>Máxima (24h)</StatLabel>
                      <StatNumber fontSize="xl" color={currentTheme.colors.text.primary}>R$ {marketData.maximo.toFixed(2)}</StatNumber>
                      <StatHelpText color={currentTheme.colors.text.tertiary}>Alta do dia</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg="white" borderWidth={1} borderColor={borderColor}>
                  <CardBody p={4}>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary}>Mínima (24h)</StatLabel>
                      <StatNumber fontSize="xl" color={currentTheme.colors.text.primary}>R$ {marketData.minimo.toFixed(2)}</StatNumber>
                      <StatHelpText color={currentTheme.colors.text.tertiary}>Baixa do dia</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg="white" borderWidth={1} borderColor={borderColor}>
                  <CardBody p={4}>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary}>Volume Total</StatLabel>
                      <StatNumber fontSize="xl" color={currentTheme.colors.text.primary}>{(marketData.volume / 1000).toFixed(1)}K</StatNumber>
                      <StatHelpText color={currentTheme.colors.text.tertiary}>Sacas negociadas</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </Grid>

              {/* Seção de Trading */}
              <Card bg="white" borderWidth={1} borderColor={borderColor} mb={6}>
                <CardHeader>
                  <Flex align="center">
                    <Heading size="md" color={currentTheme.colors.text.primary}>Painel Interativo de Trading - Café Arábica</Heading>
                    <Spacer />
                    <HStack spacing={2}>
                      <Button
                        leftIcon={<ShoppingCart size={16} />}
                        bg={currentTheme.colors.trading.positive}
                        color={currentTheme.colors.text.inverse}
                        size="sm"
                        onClick={() => executeOrder('buy')}
                        _hover={{ bg: currentTheme.colors.secondary }}
                      >
                        Comprar
                      </Button>
                      <Button
                        leftIcon={<DollarSign size={16} />}
                        bg={currentTheme.colors.trading.negative}
                        color={currentTheme.colors.text.inverse}
                        size="sm"
                        onClick={() => executeOrder('sell')}
                        _hover={{ bg: currentTheme.colors.status.error }}
                      >
                        Vender
                      </Button>
                      {tradeStatus && (
                        <Alert
                          status="success"
                          size="sm"
                          borderRadius="md"
                          bg={currentTheme.colors.status.success}
                          color={currentTheme.colors.text.inverse}
                        >
                          <AlertIcon boxSize={3} />
                          <Text fontSize="xs">{tradeStatus}</Text>
                        </Alert>
                      )}
                    </HStack>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <HStack spacing={2} mb={4}>
                    <ButtonGroup size="sm" isAttached variant="outline">
                      <Button onClick={() => setSelectedPeriod('1D')} isActive={selectedPeriod === '1D'}>
                        1D
                      </Button>
                      <Button onClick={() => setSelectedPeriod('5D')} isActive={selectedPeriod === '5D'}>
                        5D
                      </Button>
                      <Button onClick={() => setSelectedPeriod('1M')} isActive={selectedPeriod === '1M'}>
                        1M
                      </Button>
                      <Button onClick={() => setSelectedPeriod('3M')} isActive={selectedPeriod === '3M'}>
                        3M
                      </Button>
                      <Button onClick={() => setSelectedPeriod('1A')} isActive={selectedPeriod === '1A'}>
                        1A
                      </Button>
                    </ButtonGroup>
                    <Spacer />
                    <Badge bg={currentTheme.colors.status.success} color={currentTheme.colors.text.inverse} px={3} py={1}>
                      PREGÃO ABERTO
                    </Badge>
                  </HStack>
                  <Box h="300px" mb={4}>
                    <Line data={priceChartData} options={chartOptions} />
                  </Box>
                  <Divider my={4} borderColor={currentTheme.colors.border.primary} />
                  <Box h="150px">
                    <Bar data={volumeChartData} options={volumeChartOptions} />
                  </Box>
                  
                  {/* Seção do Histórico de Trading */}
                  {tradeHistory.length > 0 && (
                    <>
                      <Divider my={4} borderColor={currentTheme.colors.border.primary} />
                      <Box>
                        <Heading size="sm" mb={3} color={currentTheme.colors.text.primary}>Histórico de Ordens</Heading>
                        <VStack spacing={2} align="stretch" maxH="200px" overflowY="auto">
                          {tradeHistory.map((trade) => (
                            <HStack key={trade.id} justify="space-between" p={2} bg={currentTheme.colors.background.tertiary} borderRadius="md">
                              <Badge
                                bg={trade.tipo === 'buy' ? currentTheme.colors.trading.positive : currentTheme.colors.trading.negative}
                                color={currentTheme.colors.text.inverse}
                                size="sm"
                              >
                                {trade.tipo === 'buy' ? 'COMPRA' : 'VENDA'}
                              </Badge>
                              <Text fontSize="xs" color={currentTheme.colors.text.secondary}>{trade.timestamp.toLocaleTimeString('pt-BR')}</Text>
                              <Text fontSize="xs" color={currentTheme.colors.text.primary}>{trade.volume} sacas @ R$ {trade.preco.toFixed(2)}</Text>
                              <Badge bg={currentTheme.colors.status.success} color={currentTheme.colors.text.inverse} size="xs">{trade.status.toUpperCase()}</Badge>
                            </HStack>
                          ))}
                        </VStack>
                      </Box>
                    </>
                  )}
                </CardBody>
              </Card>

              {/* Tabela de Preços Aprimorada */}
              <Card bg="white" borderWidth={1} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>Preços do Mercado de Café</Heading>
                  <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Atualização em tempo real - Diferentes tipos e contratos</Text>
                </CardHeader>
                <CardBody>
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th color={currentTheme.colors.text.primary}>Ativo</Th>
                          <Th color={currentTheme.colors.text.primary}>Mercado</Th>
                          <Th color={currentTheme.colors.text.primary}>Qualidade</Th>
                          <Th isNumeric color={currentTheme.colors.text.primary}>Preço Atual (R$)</Th>
                          <Th isNumeric color={currentTheme.colors.text.primary}>Variação (%)</Th>
                          <Th isNumeric color={currentTheme.colors.text.primary}>Volume</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {priceTableData.map((item, index) => (
                          <Tr key={index} _hover={{ bg: currentTheme.colors.background.tertiary }}>
                            <Td fontWeight="bold" fontSize="sm" color={currentTheme.colors.text.primary}>{item.tipo}</Td>
                            <Td fontSize="xs" color={currentTheme.colors.text.secondary}>{item.origem}</Td>
                            <Td fontSize="xs">
                              <Badge
                                size="sm"
                                bg={item.qualidade.includes('Premium') ? currentTheme.colors.accent : currentTheme.colors.text.secondary}
                                color={currentTheme.colors.text.inverse}
                              >
                                {item.qualidade}
                              </Badge>
                            </Td>
                            <Td isNumeric fontWeight="bold" color={currentTheme.colors.text.primary}>
                              R$ {item.preco.toFixed(2)}
                            </Td>
                            <Td isNumeric>
                              <HStack justify="flex-end" spacing={1}>
                                {item.variacao >= 0 ? (
                                  <TrendingUp size={14} color={currentTheme.colors.trading.positive} />
                                ) : (
                                  <TrendingDown size={14} color={currentTheme.colors.trading.negative} />
                                )}
                                <Text color={item.variacao >= 0 ? currentTheme.colors.trading.positive : currentTheme.colors.trading.negative} fontWeight="semibold">
                                  {item.variacao >= 0 ? '+' : ''}{item.variacao.toFixed(2)}%
                                </Text>
                              </HStack>
                            </Td>
                            <Td isNumeric fontWeight="medium" color={currentTheme.colors.text.primary}>
                              {item.volume >= 1000 ? `${(item.volume / 1000).toFixed(1)}K` : item.volume}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </GridItem>

            {/* Sidebar de Notícias */}
            <GridItem>
              <Card bg="white" borderWidth={1} borderColor={borderColor} position="sticky" top={4}>
                <CardHeader>
                  <Flex align="center">
                    <Heading size="md" color={currentTheme.colors.text.primary}>Notícias do Mercado</Heading>
                    <Spacer />
                    <IconButton
                      aria-label="Atualizar notícias"
                      icon={newsLoading ? <Spinner size="sm" /> : <RefreshCw size={16} />}
                      size="sm"
                      variant="ghost"
                      onClick={refreshNews}
                      isLoading={newsLoading}
                    />
                  </Flex>
                </CardHeader>
                <CardBody>
                  {newsLoading ? (
                    <VStack spacing={3} justify="center" minH="200px">
                      <Spinner size="lg" color="blue.500" />
                      <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Carregando notícias...</Text>
                    </VStack>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {newsItems.map((news) => (
                        <Box 
                          key={news.id}
                          cursor="pointer"
                          transition="all 0.3s"
                          _hover={{ transform: 'translateX(4px)', opacity: 0.9 }}
                        >
                          <Flex gap={3}>
                            {news.imagem && (
                              <ImageWithFallback
                                src={news.imagem}
                                alt={news.titulo}
                                boxSize="80px"
                                objectFit="cover"
                                borderRadius="md"
                              />
                            )}
                            <Box flex={1}>
                              <HStack spacing={2} mb={1}>
                                {getImpactIcon(news.impacto)}
                                <Text fontWeight="bold" fontSize="sm" noOfLines={2} color={currentTheme.colors.text.primary}>
                                  {news.titulo}
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color={currentTheme.colors.text.secondary} noOfLines={2} mb={2}>
                                {news.descricao}
                              </Text>
                              <Flex justify="space-between" align="center">
                                <HStack spacing={2}>
                                  <Badge
                                    bg={news.prioridade === 'Alta' ? currentTheme.colors.status.success : news.prioridade === 'Média' ? currentTheme.colors.status.warning : currentTheme.colors.status.error}
                                    color="white"
                                  >
                                    {news.prioridade}
                                  </Badge>
                                  {news.relevancia && (
                                    <Badge
                                      bg={news.relevancia && news.relevancia > 80 ? currentTheme.colors.status.success : currentTheme.colors.status.warning}
                                      color="white"
                                      size="sm"
                                    >
                                      {news.relevancia}%
                                    </Badge>
                                  )}
                                </HStack>
                                <Text fontSize="xs" color={currentTheme.colors.text.tertiary}>
                                  {news.tempo}
                                </Text>
                              </Flex>
                            </Box>
                          </Flex>
                          <Divider mt={4} borderColor={currentTheme.colors.border.primary} />
                        </Box>
                      ))}
                    </VStack>
                  )}
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Mercado;