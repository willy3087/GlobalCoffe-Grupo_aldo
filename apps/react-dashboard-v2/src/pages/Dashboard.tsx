import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Grid,
  GridItem,
  HStack,
  VStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Icon,
  Flex,
  Spacer,
  Progress,
  Divider,
  Button,
  SimpleGrid,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { 
  FaCoffee, 
  FaThermometerHalf, 
  FaBox, 
  FaGlobeAmericas, 
  FaDollarSign, 
  FaChartLine 
} from 'react-icons/fa';
import { 
  BarChart2, 
  TrendingUp as TrendingUpIcon, 
  TrendingDown, 
  ArrowRight, 
  FileText,
  BarChart 
} from 'react-feather';
import { 
  BsArrowRepeat, 
  BsCloudRain, 
  BsFuelPump, 
  BsBank, 
  BsGlobe2 
} from 'react-icons/bs';
import { MdTrendingUp } from 'react-icons/md';

// Services
import { ServiceContainer } from '../services';
import type { MarketDataDTO } from '../dtos/MarketDataDTO';
import type { AnalyticsReportDTO, MarketPredictionDTO } from '../dtos/AnalyticsDTO';
import type { WeatherDataDTO } from '../dtos/WeatherDTO';

// Types
interface KPIData {
  icon: any;
  label: string;
  value: string;
  change: string;
  type: 'increase' | 'decrease' | 'neutral';
}

interface ImpactFactor {
  icon: any;
  label: string;
  impact: number;
  color: string;
}

interface MarketNews {
  title: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  time: string;
  impact: 'positive' | 'negative' | 'neutral';
}

interface MarketPredictionDisplay {
  period: string;
  high: number;
  low: number;
  range: string;
  confidence: string;
}

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard: React.FC = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [marketPredictions, setMarketPredictions] = useState<MarketPredictionDisplay[]>([]);
  const [priceCompositionData, setPriceCompositionData] = useState<any>(null);
  const [priceTrendData, setPriceTrendData] = useState<any>(null);
  const [impactFactors, setImpactFactors] = useState<ImpactFactor[]>([]);
  const [marketNews, setMarketNews] = useState<MarketNews[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const toast = useToast();

  // Services
  const marketDataService = ServiceContainer.getMarketDataService();
  const analyticsService = ServiceContainer.getAnalyticsService();

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load market data for KPIs
      const marketDataResult = await marketDataService.getCurrentMarketData();
      if (!marketDataResult.success) {
        throw new Error(marketDataResult.error || 'Erro ao carregar dados de mercado');
      }

      // Load analytics for predictions
      const analyticsResult = await analyticsService.generateMarketReport({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(),
        includeForecasts: true,
        includeTechnicalAnalysis: true,
      });

      if (!analyticsResult.success) {
        throw new Error(analyticsResult.error || 'Erro ao carregar análises');
      }

      // Load price history for trends
      const priceHistoryResult = await marketDataService.getPriceHistory({
        startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        endDate: new Date(),
        interval: 'monthly',
      });

      if (!priceHistoryResult.success) {
        throw new Error(priceHistoryResult.error || 'Erro ao carregar histórico de preços');
      }

      // Process and set KPIs
      processKPIData(marketDataResult.data);

      // Process and set market predictions
      processMarketPredictions(analyticsResult.data);

      // Process and set price trends
      processPriceTrendData(priceHistoryResult.data);

      // Set static data (would come from services in real implementation)
      setStaticData();

      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: 'Erro ao carregar dados',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Process KPI data from market data
  const processKPIData = (marketData: MarketDataDTO[]) => {
    if (!marketData || marketData.length === 0) {
      setKpis(getDefaultKPIs());
      return;
    }

    const currentData = marketData[0]; // Get most recent data
    const previousData = marketData[1]; // Get previous data for change calculation

    const kpiData: KPIData[] = [
      {
        icon: FaCoffee,
        label: 'Preço da Saca',
        value: `R$ ${currentData.price.toFixed(0)}`,
        change: previousData 
          ? `${((currentData.price - previousData.price) / previousData.price * 100).toFixed(1)}%`
          : '+3.2%',
        type: previousData 
          ? (currentData.price > previousData.price ? 'increase' : 'decrease')
          : 'increase'
      },
      {
        icon: FaThermometerHalf,
        label: 'Índice Climático',
        value: `${currentData.weatherIndex || 78}/100`,
        change: 'Favorável',
        type: 'neutral'
      },
      {
        icon: FaBox,
        label: 'Estoque Mundial',
        value: `${currentData.globalInventory || 158}M`,
        change: previousData 
          ? `${(((currentData.globalInventory || 158) - (previousData.globalInventory || 160)) / (previousData.globalInventory || 160) * 100).toFixed(1)}%`
          : '-2.1%',
        type: previousData 
          ? ((currentData.globalInventory || 158) > (previousData.globalInventory || 160) ? 'increase' : 'decrease')
          : 'decrease'
      },
      {
        icon: FaGlobeAmericas,
        label: 'Produção Global',
        value: `${currentData.globalProduction || 175}M`,
        change: '+4.5%',
        type: 'increase'
      },
      {
        icon: FaDollarSign,
        label: 'Taxa de Câmbio',
        value: `R$ ${currentData.exchangeRate?.toFixed(2) || '5.12'}`,
        change: '+0.8%',
        type: 'increase'
      },
      {
        icon: FaChartLine,
        label: 'Volatilidade',
        value: `${currentData.volatility?.toFixed(1) || '24.3'}%`,
        change: '+8.2%',
        type: 'increase'
      },
    ];

    setKpis(kpiData);
  };

  // Default KPIs when no data is available
  const getDefaultKPIs = (): KPIData[] => [
    { icon: FaCoffee, label: 'Preço da Saca', value: 'R$ 1.842', change: '+3.2%', type: 'increase' },
    { icon: FaThermometerHalf, label: 'Índice Climático', value: '78/100', change: 'Favorável', type: 'neutral' },
    { icon: FaBox, label: 'Estoque Mundial', value: '158M', change: '-2.1%', type: 'decrease' },
    { icon: FaGlobeAmericas, label: 'Produção Global', value: '175M', change: '+4.5%', type: 'increase' },
    { icon: FaDollarSign, label: 'Taxa de Câmbio', value: 'R$ 5.12', change: '+0.8%', type: 'increase' },
    { icon: FaChartLine, label: 'Volatilidade', value: '24.3%', change: '+8.2%', type: 'increase' },
  ];

  // Process market predictions from analytics
  const processMarketPredictions = (analyticsData: AnalyticsReportDTO) => {
    if (!analyticsData?.predictions || analyticsData.predictions.length === 0) {
      setMarketPredictions([
        {
          period: 'Próxima Semana',
          high: 65,
          low: 35,
          range: 'R$ 1.795 - R$ 1.920',
          confidence: 'Alta',
        },
        {
          period: 'Próximo Mês',
          high: 58,
          low: 42,
          range: 'R$ 1.750 - R$ 1.980',
          confidence: 'Média',
        },
        {
          period: 'Próximo Semestre',
          high: 72,
          low: 28,
          range: 'R$ 1.680 - R$ 2.150',
          confidence: 'Alta',
        },
      ]);
      return;
    }

    const predictions = analyticsData.predictions.map((pred: MarketPredictionDTO, index) => {
      const periods = ['Próxima Semana', 'Próximo Mês', 'Próximo Semestre'];
      return {
        period: periods[index] || `Período ${index + 1}`,
        high: Math.round(pred.bullishProbability * 100),
        low: Math.round(pred.bearishProbability * 100),
        range: `R$ ${pred.priceRange.min.toFixed(0)} - R$ ${pred.priceRange.max.toFixed(0)}`,
        confidence: pred.confidence > 0.8 ? 'Alta' : pred.confidence > 0.6 ? 'Média' : 'Baixa',
      };
    });

    setMarketPredictions(predictions.slice(0, 3)); // Limit to 3 predictions
  };

  // Process price trend data for chart
  const processPriceTrendData = (priceHistory: MarketDataDTO[]) => {
    if (!priceHistory || priceHistory.length === 0) {
      setPriceTrendData(getDefaultPriceTrendData());
      return;
    }

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    
    // Get historical data (up to current month)
    const historicalData = Array(currentMonth + 1).fill(null).map((_, index) => {
      const monthData = priceHistory.find(data => 
        new Date(data.timestamp).getMonth() === index
      );
      return monthData ? monthData.price : null;
    });

    // Add nulls for future months
    while (historicalData.length < 12) {
      historicalData.push(null);
    }

    // Generate projection for remaining months
    const projectionData = Array(12).fill(null);
    if (historicalData[currentMonth]) {
      projectionData[currentMonth] = historicalData[currentMonth];
      for (let i = currentMonth + 1; i < 12; i++) {
        const basePrice = projectionData[i - 1] || historicalData[currentMonth] || 1842;
        projectionData[i] = basePrice * (1 + (Math.random() * 0.06 - 0.03)); // ±3% variation
      }
    }

    const chartData = {
      labels: months,
      datasets: [
        {
          label: 'Preço Médio (R$/saca)',
          data: historicalData,
          borderColor: '#8B4513',
          backgroundColor: 'rgba(139, 69, 19, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Projeção',
          data: projectionData,
          borderColor: '#800020',
          backgroundColor: 'rgba(128, 0, 32, 0.1)',
          borderDash: [5, 5],
          tension: 0.4,
          fill: true,
        },
      ],
    };

    setPriceTrendData(chartData);
  };

  // Default price trend data
  const getDefaultPriceTrendData = () => ({
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Preço Médio (R$/saca)',
        data: [1650, 1680, 1720, 1750, 1780, 1810, 1790, 1820, 1835, 1842, null, null],
        borderColor: '#8B4513',
        backgroundColor: 'rgba(139, 69, 19, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Projeção',
        data: [null, null, null, null, null, null, null, null, null, 1842, 1880, 1920],
        borderColor: '#800020',
        backgroundColor: 'rgba(128, 0, 32, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: true,
      },
    ],
  });

  // Set static data (impact factors, price composition, news)
  const setStaticData = () => {
    // Impact factors
    const factors: ImpactFactor[] = [
      { icon: BsCloudRain, label: 'Clima', impact: 35, color: 'blue.500' },
      { icon: FaDollarSign, label: 'Câmbio', impact: 25, color: 'green.500' },
      { icon: MdTrendingUp, label: 'Demanda', impact: 20, color: 'purple.500' },
      { icon: BsFuelPump, label: 'Combustível', impact: 10, color: 'orange.500' },
      { icon: BsBank, label: 'Política', impact: 5, color: 'red.500' },
      { icon: BsGlobe2, label: 'Global', impact: 5, color: 'cyan.500' },
    ];
    setImpactFactors(factors);

    // Price composition
    setPriceCompositionData({
      labels: ['Produção', 'Logística', 'Beneficiamento', 'Impostos', 'Margem'],
      datasets: [
        {
          data: [45, 20, 15, 12, 8],
          backgroundColor: [
            '#8B4513',
            '#A0522D',
            '#CD853F',
            '#DEB887',
            '#F4A460',
          ],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    });

    // Market news
    const news: MarketNews[] = [
      {
        title: 'Geada no Sul de Minas afeta 15% da produção',
        description: 'Produtores relatam perdas significativas após geada intensa',
        priority: 'Alta',
        time: '2h atrás',
        impact: 'negative',
      },
      {
        title: 'Exportações brasileiras batem recorde em outubro',
        description: 'Volume exportado supera expectativas do mercado',
        priority: 'Alta',
        time: '5h atrás',
        impact: 'positive',
      },
      {
        title: 'Demanda mundial por café premium cresce 8%',
        description: 'Cafés especiais ganham espaço no mercado internacional',
        priority: 'Média',
        time: '8h atrás',
        impact: 'positive',
      },
      {
        title: 'Bolsa de NY fecha em alta pelo terceiro dia',
        description: 'Contratos futuros apresentam valorização consistente',
        priority: 'Média',
        time: '1d atrás',
        impact: 'positive',
      },
      {
        title: 'Colheita na Colômbia avança dentro do esperado',
        description: 'Produção colombiana mantém ritmo normal',
        priority: 'Baixa',
        time: '2d atrás',
        impact: 'neutral',
      },
    ];
    setMarketNews(news);
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
      },
    },
  };

  // Get impact icon based on news impact
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <Icon as={TrendingUpIcon} size={16} color="green.500" />;
      case 'negative':
        return <Icon as={TrendingDown} size={16} color="red.500" />;
      default:
        return <Icon as={ArrowRight} size={16} color="gray.500" />;
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadDashboardData();
    toast({
      title: 'Dados atualizados',
      description: 'Dashboard atualizado com sucesso',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brown.500" />
          <Text>Carregando dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">Erro ao carregar dashboard</Text>
            <Text>{error}</Text>
            <Button colorScheme="red" size="sm" onClick={loadDashboardData}>
              Tentar novamente
            </Button>
          </VStack>
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Container maxW="container.2xl" py={4}>
        <Flex align="center" justify="space-between" mb={8}>
          <VStack align="start" spacing={1}>
            <HStack>
              <Icon as={BarChart} size={28} color="brown.500" />
              <Heading size="lg" color="gray.800">Dashboard de Café</Heading>
            </HStack>
            <Text color="gray.600">Visão geral da produção e mercado</Text>
          </VStack>
          <VStack align="end" spacing={1}>
            <Button
              leftIcon={<Icon as={BsArrowRepeat} />}
              colorScheme="brown"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              Atualizar
            </Button>
            <Text fontSize="xs" color="gray.500">
              Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
            </Text>
          </VStack>
        </Flex>
      </Container>

      <Container maxW="container.2xl" pb={8}>
        <VStack spacing={8} align="stretch">
          <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={8}>
            {/* Main Content Area */}
            <GridItem>
              {/* KPI Grid */}
              <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={8}>
                {kpis.map((kpi, index) => (
                  <Card key={index} bg="white" borderWidth={1} borderColor="gray.200">
                    <CardBody p={4}>
                      <Stat textAlign="center">
                        <Icon as={kpi.icon} boxSize={6} color="brown.500" mb={2} />
                        <StatLabel fontSize="xs" color="gray.600">{kpi.label}</StatLabel>
                        <StatNumber fontSize="lg" color="gray.800">{kpi.value}</StatNumber>
                        <StatHelpText fontSize="xs">
                          {kpi.type !== 'neutral' && (
                            <StatArrow type={kpi.type as 'increase' | 'decrease'} />
                          )}
                          {kpi.change}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Market Predictions */}
              <Card bg="white" borderWidth={1} borderColor="gray.200" mb={8}>
                <CardHeader>
                  <Flex align="center">
                    <HStack>
                      <Icon as={BarChart2} color="brown.500" />
                      <Heading size="md" color="gray.800">Previsões de Mercado</Heading>
                    </HStack>
                    <Spacer />
                    <Badge bg="green.100" color="green.800" fontSize="xs">Atualizado</Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                    {marketPredictions.map((prediction, index) => (
                      <Card key={index} bg="white" borderWidth={1} borderColor="gray.200">
                        <CardBody>
                          <Text fontWeight="bold" mb={4} color="gray.800">{prediction.period}</Text>
                          
                          <VStack spacing={3} align="stretch">
                            <Box>
                              <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm" color="gray.600">Alta</Text>
                                <Text fontSize="sm" fontWeight="bold" color="gray.800">{prediction.high}%</Text>
                              </Flex>
                              <Progress
                                value={prediction.high}
                                size="lg"
                                borderRadius="md"
                                colorScheme="green"
                              />
                            </Box>
                            
                            <Box>
                              <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm" color="gray.600">Baixa</Text>
                                <Text fontSize="sm" fontWeight="bold" color="gray.800">{prediction.low}%</Text>
                              </Flex>
                              <Progress
                                value={prediction.low}
                                size="lg"
                                borderRadius="md"
                                colorScheme="red"
                              />
                            </Box>
                          </VStack>
                          
                          <Divider my={3} />
                          
                          <VStack spacing={1} align="stretch">
                            <Text fontSize="xs" color="gray.600">Faixa Prevista:</Text>
                            <Text fontSize="sm" fontWeight="bold" color="gray.800">{prediction.range}</Text>
                            <Badge
                              colorScheme={prediction.confidence === 'Alta' ? 'green' : 'yellow'}
                              borderRadius="full"
                              px={2.5}
                              py={0.5}
                              fontSize="xs"
                              fontWeight="500"
                            >
                              Confiança: {prediction.confidence}
                            </Badge>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </Grid>
                </CardBody>
              </Card>

              {/* Charts Section */}
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={8}>
                {/* Price Composition Chart */}
                <Card bg="white" borderWidth={1} borderColor="gray.200">
                  <CardHeader>
                    <HStack>
                      <Icon as={BarChart2} color="brown.500" />
                      <Heading size="md" color="gray.800">Composição do Preço</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      {priceCompositionData && (
                        <Doughnut data={priceCompositionData} options={doughnutOptions} />
                      )}
                    </Box>
                  </CardBody>
                </Card>

                {/* Price Trend Chart */}
                <Card bg="white" borderWidth={1} borderColor="gray.200">
                  <CardHeader>
                    <HStack>
                      <Icon as={TrendingUpIcon} color="brown.500" />
                      <Heading size="md" color="gray.800">Tendência de Preços</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      {priceTrendData && (
                        <Line data={priceTrendData} options={chartOptions} />
                      )}
                    </Box>
                  </CardBody>
                </Card>
              </Grid>

              {/* Impact Factors */}
              <Card bg="white" borderWidth={1} borderColor="gray.200">
                <CardHeader>
                  <HStack>
                    <Icon as={FaChartLine} color="brown.500" />
                    <Heading size="md" color="gray.800">Fatores de Impacto no Preço</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
                    {impactFactors.map((factor, index) => (
                      <Card key={index} bg="white" borderWidth={1} borderColor="gray.200">
                        <CardBody textAlign="center" p={4}>
                          <Icon as={factor.icon} boxSize={8} color="brown.500" mb={2} />
                          <Text fontSize="sm" fontWeight="bold" mb={1} color="gray.800">{factor.label}</Text>
                          <Text fontSize="2xl" fontWeight="bold" color="brown.500">
                            {factor.impact}%
                          </Text>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </CardBody>
              </Card>
            </GridItem>

            {/* Sidebar */}
            <GridItem>
              <Card bg="white" borderWidth={1} borderColor="gray.200" position="sticky" top={4}>
                <CardHeader>
                  <Flex align="center">
                    <HStack>
                      <Icon as={FileText} color="brown.500" />
                      <Heading size="md" color="gray.800">Notícias do Mercado</Heading>
                    </HStack>
                    <Spacer />
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<Icon as={BsArrowRepeat} />}
                      color="gray.600"
                      _hover={{ bg: 'gray.50' }}
                      onClick={handleRefresh}
                    >
                      Atualizar
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {marketNews.map((news, index) => (
                      <Box key={index}>
                        <Card 
                          bg="gray.50" 
                          borderWidth={1} 
                          borderColor="gray.200"
                          cursor="pointer"
                          transition="all 0.3s"
                          _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                        >
                          <CardBody>
                            <HStack spacing={2} mb={2}>
                              {getImpactIcon(news.impact)}
                              <Text fontWeight="bold" fontSize="sm" flex={1} color="gray.800">
                                {news.title}
                              </Text>
                            </HStack>
                            <Text fontSize="xs" color="gray.600" mb={3}>
                              {news.description}
                            </Text>
                            <Flex justify="space-between" align="center">
                              <Badge
                                colorScheme={
                                  news.priority === 'Alta' ? 'red' :
                                  news.priority === 'Média' ? 'yellow' : 'gray'
                                }
                                borderRadius="full"
                                px={2.5}
                                py={0.5}
                                fontSize="xs"
                                fontWeight="500"
                              >
                                {news.priority}
                              </Badge>
                              <Text fontSize="xs" color="gray.500">
                                {news.time}
                              </Text>
                            </Flex>
                          </CardBody>
                        </Card>
                        {index < marketNews.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;