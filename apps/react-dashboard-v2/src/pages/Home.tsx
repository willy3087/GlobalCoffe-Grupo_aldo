import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Flex,
  Spacer,
  Icon,
  Divider,
  Avatar,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Thermometer,
  Droplet,
  Wind,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  MessageCircle,
  Bookmark,
  Share2,
  Activity,
} from 'react-feather';

// Services
import { ServiceContainer } from '../services';
import type { MarketDataDTO } from '../dtos/MarketDataDTO';
import type { WeatherDataDTO } from '../dtos/WeatherDTO';

// Types
interface StatData {
  label: string;
  value: string;
  subValue: string;
  change: number;
  trend: 'increase' | 'decrease' | 'neutral';
  icon: any;
}

interface NewsItem {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  image?: string;
  author?: string;
  date: string;
  views: number;
  comments?: number;
}

interface FeaturedNews {
  main: NewsItem;
  secondary: NewsItem[];
}

interface MarketIndicator {
  label: string;
  value: string;
  change: number;
}

interface Event {
  date: string;
  title: string;
  location: string;
}

interface QuickLink {
  label: string;
  icon: any;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatData[]>([]);
  const [marketIndicators, setMarketIndicators] = useState<MarketIndicator[]>([]);
  const [featuredNews, setFeaturedNews] = useState<FeaturedNews | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Services
  const marketDataService = ServiceContainer.getMarketDataService();
  const analyticsService = ServiceContainer.getAnalyticsService();

  // Static data (would come from services in real implementation)
  const upcomingEvents: Event[] = [
    { date: '15 Nov', title: 'Semana Internacional do Café', location: 'Belo Horizonte' },
    { date: '22 Nov', title: 'Workshop de Sustentabilidade', location: 'Online' },
    { date: '28 Nov', title: 'Feira de Tecnologia Agrícola', location: 'São Paulo' },
  ];

  const quickLinks: QuickLink[] = [
    { label: 'Cotação em tempo real', icon: TrendingUp },
    { label: 'Previsão do tempo', icon: Wind },
    { label: 'Análise de solo', icon: Droplet },
    { label: 'Calendário de plantio', icon: Calendar },
  ];

  // Load home data
  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load current market data for stats
      const marketDataResult = await marketDataService.getCurrentMarketData();
      if (!marketDataResult.success) {
        throw new Error(marketDataResult.error || 'Erro ao carregar dados de mercado');
      }

      // Load price history for market indicators
      const priceHistoryResult = await marketDataService.getPriceHistory({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        endDate: new Date(),
        interval: 'daily',
      });

      if (!priceHistoryResult.success) {
        throw new Error(priceHistoryResult.error || 'Erro ao carregar histórico de preços');
      }

      // Load analytics for insights
      const analyticsResult = await analyticsService.generateMarketReport({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(),
        includeForecasts: false,
        includeTechnicalAnalysis: true,
      });

      if (!analyticsResult.success) {
        throw new Error(analyticsResult.error || 'Erro ao carregar análises');
      }

      // Process and set stats
      processStatsData(marketDataResult.data);

      // Process and set market indicators
      processMarketIndicators(priceHistoryResult.data);

      // Set static news data (would come from news service in real implementation)
      setStaticNewsData();

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
      
      // Set fallback data
      setFallbackData();
    } finally {
      setLoading(false);
    }
  };

  // Process stats data from market data
  const processStatsData = (marketData: MarketDataDTO[]) => {
    if (!marketData || marketData.length === 0) {
      setStats(getDefaultStats());
      return;
    }

    const currentData = marketData[0];
    const previousData = marketData[1];

    const statsData: StatData[] = [
      {
        label: 'Preço Café Arábica',
        value: `R$ ${currentData.price.toFixed(0)}`,
        subValue: '/saca',
        change: previousData 
          ? ((currentData.price - previousData.price) / previousData.price * 100)
          : 3.2,
        trend: previousData 
          ? (currentData.price > previousData.price ? 'increase' : 'decrease')
          : 'increase',
        icon: DollarSign,
      },
      {
        label: 'Temperatura Média',
        value: `${currentData.temperature || 22}°C`,
        subValue: 'Sul de Minas',
        change: -1.5,
        trend: 'decrease',
        icon: Thermometer,
      },
      {
        label: 'Umidade do Ar',
        value: `${currentData.humidity || 65}%`,
        subValue: 'Ideal: 60-70%',
        change: 2.1,
        trend: 'increase',
        icon: Droplet,
      },
      {
        label: 'Velocidade Vento',
        value: `${currentData.windSpeed || 12} km/h`,
        subValue: 'Nordeste',
        change: 0,
        trend: 'neutral',
        icon: Wind,
      },
      {
        label: 'Produtividade',
        value: `${currentData.productivity || 42} sc/ha`,
        subValue: 'Média regional',
        change: 5.3,
        trend: 'increase',
        icon: TrendingUp,
      },
    ];

    setStats(statsData);
  };

  // Default stats when no data is available
  const getDefaultStats = (): StatData[] => [
    {
      label: 'Preço Café Arábica',
      value: 'R$ 1.420',
      subValue: '/saca',
      change: 3.2,
      trend: 'increase',
      icon: DollarSign,
    },
    {
      label: 'Temperatura Média',
      value: '22°C',
      subValue: 'Sul de Minas',
      change: -1.5,
      trend: 'decrease',
      icon: Thermometer,
    },
    {
      label: 'Umidade do Ar',
      value: '65%',
      subValue: 'Ideal: 60-70%',
      change: 2.1,
      trend: 'increase',
      icon: Droplet,
    },
    {
      label: 'Velocidade Vento',
      value: '12 km/h',
      subValue: 'Nordeste',
      change: 0,
      trend: 'neutral',
      icon: Wind,
    },
    {
      label: 'Produtividade',
      value: '42 sc/ha',
      subValue: 'Média regional',
      change: 5.3,
      trend: 'increase',
      icon: TrendingUp,
    },
  ];

  // Process market indicators from price history
  const processMarketIndicators = (priceHistory: MarketDataDTO[]) => {
    if (!priceHistory || priceHistory.length < 2) {
      setMarketIndicators([
        { label: 'ICE Futures', value: 'US$ 224.45', change: 2.3 },
        { label: 'BM&F', value: 'R$ 1.420', change: 3.2 },
        { label: 'Robusta', value: 'US$ 2.340', change: -1.1 },
        { label: 'Colombiano', value: 'US$ 245.60', change: 1.8 },
      ]);
      return;
    }

    const latestPrice = priceHistory[0];
    const previousPrice = priceHistory[1];
    const changePercentage = ((latestPrice.price - previousPrice.price) / previousPrice.price * 100);

    const indicators: MarketIndicator[] = [
      { 
        label: 'ICE Futures', 
        value: `US$ ${(latestPrice.price * 0.158).toFixed(2)}`, // Approximate conversion
        change: changePercentage 
      },
      { 
        label: 'BM&F', 
        value: `R$ ${latestPrice.price.toFixed(0)}`, 
        change: changePercentage 
      },
      { 
        label: 'Robusta', 
        value: `US$ ${(latestPrice.price * 0.164).toFixed(0)}`, // Approximate conversion
        change: changePercentage * 0.8 
      },
      { 
        label: 'Colombiano', 
        value: `US$ ${(latestPrice.price * 0.173).toFixed(2)}`, // Approximate conversion
        change: changePercentage * 1.1 
      },
    ];

    setMarketIndicators(indicators);
  };

  // Set static news data (would come from news service)
  const setStaticNewsData = () => {
    const featured: FeaturedNews = {
      main: {
        id: 1,
        category: 'MERCADO',
        title: 'Preços do café arábica atingem maior valor dos últimos 3 meses',
        excerpt: 'Condições climáticas adversas em principais regiões produtoras e alta demanda internacional impulsionam valorização da commodity. Analistas preveem continuidade da tendência de alta.',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
        author: 'João Silva',
        date: '2 horas atrás',
        views: 1250,
        comments: 23,
      },
      secondary: [
        {
          id: 2,
          category: 'CLIMA',
          title: 'Alerta de geada mobiliza produtores no Sul de Minas',
          excerpt: 'Meteorologistas preveem queda brusca de temperatura para os próximos dias.',
          image: 'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400',
          date: '4 horas atrás',
          views: 890,
        },
        {
          id: 3,
          category: 'TECNOLOGIA',
          title: 'Nova técnica de irrigação aumenta produtividade em 30%',
          excerpt: 'Sistema inteligente reduz consumo de água e melhora qualidade dos grãos.',
          image: 'https://images.unsplash.com/photo-1625758476104-f2ed6c81547e?w=400',
          date: '6 horas atrás',
          views: 654,
        },
      ],
    };

    const news: NewsItem[] = [
      {
        id: 4,
        category: 'EXPORTAÇÃO',
        title: 'Brasil mantém liderança nas exportações globais de café',
        excerpt: 'Volume exportado cresce 8% no trimestre, consolidando posição do país no mercado internacional.',
        date: '8 horas atrás',
        views: 432,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200',
      },
      {
        id: 5,
        category: 'SUSTENTABILIDADE',
        title: 'Certificação sustentável valoriza café brasileiro em 15%',
        excerpt: 'Produtores com selo de sustentabilidade conseguem preços premium no mercado europeu.',
        date: '10 horas atrás',
        views: 378,
        image: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=200',
      },
      {
        id: 6,
        category: 'POLÍTICA',
        title: 'Governo anuncia nova linha de crédito para cafeicultores',
        excerpt: 'Programa oferece juros reduzidos para modernização de equipamentos e infraestrutura.',
        date: '12 horas atrás',
        views: 567,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200',
      },
      {
        id: 7,
        category: 'PESQUISA',
        title: 'Embrapa desenvolve nova variedade resistente à seca',
        excerpt: 'Cultivar promete manter produtividade mesmo em condições de estresse hídrico.',
        date: '1 dia atrás',
        views: 892,
        image: 'https://images.unsplash.com/photo-1524350876685-274059332603?w=200',
      },
    ];

    setFeaturedNews(featured);
    setNewsList(news);
  };

  // Set fallback data in case of error
  const setFallbackData = () => {
    setStats(getDefaultStats());
    setMarketIndicators([
      { label: 'ICE Futures', value: 'US$ 224.45', change: 2.3 },
      { label: 'BM&F', value: 'R$ 1.420', change: 3.2 },
      { label: 'Robusta', value: 'US$ 2.340', change: -1.1 },
      { label: 'Colombiano', value: 'US$ 245.60', change: 1.8 },
    ]);
    setStaticNewsData();
  };

  // Get tag category for news
  const getTagCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mercado': return 'primary';
      case 'clima': return 'warning';
      case 'tecnologia': return 'info';
      case 'exportação': return 'success';
      case 'sustentabilidade': return 'teal';
      case 'política': return 'purple';
      case 'pesquisa': return 'cyan';
      default: return 'gray';
    }
  };

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadHomeData();
    toast({
      title: 'Dados atualizados',
      description: 'Home page atualizada com sucesso',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Load data on component mount
  useEffect(() => {
    loadHomeData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brown.500" />
          <Text>Carregando página inicial...</Text>
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
            <Text fontWeight="bold">Erro ao carregar página inicial</Text>
            <Text>{error}</Text>
            <Button colorScheme="red" size="sm" onClick={loadHomeData}>
              Tentar novamente
            </Button>
          </VStack>
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="gradient-to-r from-brown.600 to-brown.800"
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl" fontWeight="bold">
              Global Coffee Dashboard
            </Heading>
            <Text fontSize="xl" maxW="600px" opacity={0.9}>
              Monitore preços, condições climáticas e tendências do mercado cafeeiro em tempo real
            </Text>
            <HStack spacing={4} maxW="600px" w="100%">
              <Box flex={1}>
                <input
                  type="text"
                  placeholder="Pesquisar notícias, análises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                  }}
                />
              </Box>
              <Button
                size="lg"
                colorScheme="orange"
                onClick={handleSearch}
                px={8}
              >
                Pesquisar
              </Button>
            </HStack>
            <HStack spacing={4}>
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() => navigate('/dashboard')}
              >
                Ver Dashboard
              </Button>
              <Button
                size="lg"
                bg="white"
                color="brown.600"
                _hover={{ bg: 'gray.100' }}
                onClick={() => navigate('/kpis-produtor')}
              >
                KPIs do Produtor
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Quick Stats Bar */}
      <Box
        bg="white"
        borderY="1px"
        borderColor="gray.200"
        py={4}
        boxShadow="sm"
      >
        <Container maxW="container.2xl">
          <HStack spacing={8} overflowX="auto" justify="space-between">
            {stats.map((stat, index) => (
              <HStack key={index} spacing={3} minW="200px">
                <Icon as={stat.icon} boxSize={6} color="brown.500" />
                <VStack spacing={0} align="start">
                  <HStack spacing={1}>
                    <Text fontWeight="bold" fontSize="lg" color="gray.800">
                      {stat.value}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {stat.subValue}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Text fontSize="xs" color="gray.600">
                      {stat.label}
                    </Text>
                    {stat.change !== 0 && stat.trend !== 'neutral' && (
                      <>
                        <Text
                          fontSize="xs"
                          color={stat.trend === 'increase' ? 'green.500' : 'red.500'}
                        >
                          {stat.trend === 'increase' ? '↗' : '↘'} {Math.abs(stat.change).toFixed(1)}%
                        </Text>
                      </>
                    )}
                  </HStack>
                </VStack>
              </HStack>
            ))}
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.2xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* News Section */}
          <GridItem>
            {/* Section Header */}
            <Card bg="white" borderWidth={1} borderColor="gray.200" mb={6}>
              <CardBody>
                <Flex align="center" mb={4}>
                  <HStack spacing={3}>
                    <Icon as={MessageCircle} color="brown.500" boxSize={6} />
                    <Heading size="lg" color="gray.800">Notícias e Atualizações</Heading>
                  </HStack>
                  <Spacer />
                  <HStack spacing={2}>
                    <ButtonGroup size="sm" variant="outline">
                      <Button
                        onClick={() => setActiveTab('todas')}
                        bg={activeTab === 'todas' ? 'brown.500' : 'transparent'}
                        color={activeTab === 'todas' ? 'white' : 'gray.800'}
                        borderColor="brown.500"
                      >
                        Todas
                      </Button>
                      <Button
                        onClick={() => setActiveTab('mercado')}
                        bg={activeTab === 'mercado' ? 'brown.500' : 'transparent'}
                        color={activeTab === 'mercado' ? 'white' : 'gray.800'}
                        borderColor="brown.500"
                      >
                        Mercado
                      </Button>
                      <Button
                        onClick={() => setActiveTab('clima')}
                        bg={activeTab === 'clima' ? 'brown.500' : 'transparent'}
                        color={activeTab === 'clima' ? 'white' : 'gray.800'}
                        borderColor="brown.500"
                      >
                        Clima
                      </Button>
                      <Button
                        onClick={() => setActiveTab('tecnologia')}
                        bg={activeTab === 'tecnologia' ? 'brown.500' : 'transparent'}
                        color={activeTab === 'tecnologia' ? 'white' : 'gray.800'}
                        borderColor="brown.500"
                      >
                        Tecnologia
                      </Button>
                    </ButtonGroup>
                    <Button
                      size="sm"
                      leftIcon={<Icon as={Activity} />}
                      variant="ghost"
                      onClick={handleRefresh}
                    >
                      Atualizar
                    </Button>
                  </HStack>
                </Flex>

                {/* Featured News */}
                {featuredNews && (
                  <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
                    {/* Main Featured */}
                    <GridItem>
                      <Card
                        bg="white"
                        borderWidth={1}
                        borderColor="gray.200"
                        overflow="hidden"
                        cursor="pointer"
                        _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                        transition="all 0.3s"
                        h="100%"
                      >
                        <Box position="relative" w="100%" h={{ base: '200px', md: '300px', lg: '350px' }}>
                          <img
                            src={featuredNews.main.image}
                            alt={featuredNews.main.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                        <CardBody display="flex" flexDirection="column" flex="1">
                          <Badge colorScheme={getTagCategory(featuredNews.main.category)} mb={2}>
                            {featuredNews.main.category}
                          </Badge>
                          <Heading size="md" mb={3} color="gray.800">
                            {featuredNews.main.title}
                          </Heading>
                          <Text color="gray.600" mb={4} flex="1">
                            {featuredNews.main.excerpt}
                          </Text>
                          <Flex justify="space-between" align="center" mt="auto">
                            <HStack spacing={3} fontSize="sm" color="gray.600">
                              <HStack>
                                <Avatar size="xs" name={featuredNews.main.author} />
                                <Text>{featuredNews.main.author}</Text>
                              </HStack>
                              <HStack>
                                <Icon as={Clock} boxSize={3} />
                                <Text>{featuredNews.main.date}</Text>
                              </HStack>
                            </HStack>
                            <HStack spacing={2} fontSize="sm" color="gray.600">
                              <HStack>
                                <Icon as={Eye} boxSize={3} />
                                <Text>{featuredNews.main.views}</Text>
                              </HStack>
                              <HStack>
                                <Icon as={MessageCircle} boxSize={3} />
                                <Text>{featuredNews.main.comments}</Text>
                              </HStack>
                            </HStack>
                          </Flex>
                        </CardBody>
                      </Card>
                    </GridItem>

                    {/* Secondary Featured */}
                    <GridItem>
                      <VStack spacing={4} h="100%">
                        {featuredNews.secondary.map((news) => (
                          <Card
                            key={news.id}
                            bg="white"
                            borderWidth={1}
                            borderColor="gray.200"
                            overflow="hidden"
                            cursor="pointer"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                            transition="all 0.3s"
                            flex="1"
                          >
                            <Box w="100%" h="140px">
                              <img
                                src={news.image}
                                alt={news.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            </Box>
                            <CardBody p={4} display="flex" flexDirection="column">
                              <Badge colorScheme={getTagCategory(news.category)} size="sm" mb={2}>
                                {news.category}
                              </Badge>
                              <Heading size="sm" mb={2} color="gray.800">
                                {news.title}
                              </Heading>
                              <Text fontSize="sm" color="gray.600" mb={3} flex="1">
                                {news.excerpt}
                              </Text>
                              <HStack justify="space-between" fontSize="xs" color="gray.500" mt="auto">
                                <HStack>
                                  <Icon as={Clock} boxSize={3} />
                                  <Text>{news.date}</Text>
                                </HStack>
                                <HStack>
                                  <Icon as={Eye} boxSize={3} />
                                  <Text>{news.views}</Text>
                                </HStack>
                              </HStack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    </GridItem>
                  </Grid>
                )}

                {/* News List */}
                <VStack spacing={4} align="stretch">
                  {newsList.map((news) => (
                    <Card
                      key={news.id}
                      bg="white"
                      borderWidth={1}
                      borderColor="gray.200"
                      cursor="pointer"
                      _hover={{ boxShadow: 'md' }}
                      transition="all 0.3s"
                    >
                      <CardBody>
                        <Flex gap={4}>
                          <Box flexShrink={0} w="100px" h="100px">
                            <img
                              src={news.image}
                              alt={news.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '6px'
                              }}
                            />
                          </Box>
                          <Box flex={1}>
                            <Flex justify="space-between" align="start" mb={2}>
                              <Badge colorScheme={getTagCategory(news.category)} size="sm">
                                {news.category}
                              </Badge>
                              <HStack spacing={2}>
                                <Icon as={Bookmark} boxSize={4} cursor="pointer" color="gray.500" />
                                <Icon as={Share2} boxSize={4} cursor="pointer" color="gray.500" />
                              </HStack>
                            </Flex>
                            <Heading size="sm" mb={1} color="gray.800">
                              {news.title}
                            </Heading>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                              {news.excerpt}
                            </Text>
                            <HStack fontSize="xs" color="gray.500" spacing={4}>
                              <HStack>
                                <Icon as={Clock} boxSize={3} />
                                <Text>{news.date}</Text>
                              </HStack>
                              <HStack>
                                <Icon as={Eye} boxSize={3} />
                                <Text>{news.views} visualizações</Text>
                              </HStack>
                            </HStack>
                          </Box>
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>

                {/* Load More */}
                <Flex justify="center" mt={6}>
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="brown.500"
                    color="brown.500"
                    _hover={{ bg: 'brown.500', color: 'white' }}
                  >
                    Carregar mais notícias
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <VStack spacing={6} position="sticky" top="20px">
              {/* Market Indicators */}
              <Card bg="white" borderWidth={1} borderColor="gray.200" w="100%">
                <CardHeader pb={2}>
                  <HStack spacing={2}>
                    <Icon as={TrendingUp} color="brown.500" boxSize={5} />
                    <Heading size="md" color="gray.800">Indicadores de Mercado</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={2}>
                  <VStack spacing={3} align="stretch">
                    {marketIndicators.map((indicator, index) => (
                      <Flex key={index} justify="space-between" align="center">
                        <Text fontSize="sm" color="gray.800">{indicator.label}</Text>
                        <HStack>
                          <Text fontWeight="bold" fontSize="sm" color="gray.800">
                            {indicator.value}
                          </Text>
                          <Badge
                            colorScheme={indicator.change > 0 ? 'green' : 'red'}
                            fontSize="xs"
                          >
                            {indicator.change > 0 ? '+' : ''}{indicator.change.toFixed(1)}%
                          </Badge>
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                  <Button
                    mt={4}
                    size="sm"
                    w="100%"
                    bg="brown.500"
                    color="white"
                    _hover={{ bg: 'brown.600' }}
                    onClick={() => navigate('/dashboard')}
                  >
                    Ver Dashboard Completo
                  </Button>
                </CardBody>
              </Card>

              {/* Quick Links */}
              <Card bg="white" borderWidth={1} borderColor="gray.200" w="100%">
                <CardHeader pb={2}>
                  <HStack spacing={2}>
                    <Icon as={Activity} color="brown.500" boxSize={5} />
                    <Heading size="md" color="gray.800">Acesso Rápido</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={2}>
                  <VStack spacing={2} align="stretch">
                    {quickLinks.map((link, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="ghost"
                        justifyContent="start"
                        leftIcon={<Icon as={link.icon} color="brown.500" />}
                        color="gray.800"
                        _hover={{ bg: 'gray.50' }}
                      >
                        {link.label}
                      </Button>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              {/* Upcoming Events */}
              <Card bg="white" borderWidth={1} borderColor="gray.200" w="100%">
                <CardHeader pb={2}>
                  <HStack spacing={2}>
                    <Icon as={Calendar} color="brown.500" boxSize={5} />
                    <Heading size="md" color="gray.800">Próximos Eventos</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={2}>
                  <VStack spacing={3} align="stretch">
                    {upcomingEvents.map((event, index) => (
                      <Box key={index}>
                        <HStack justify="space-between" mb={1}>
                          <Badge bg="brown.100" color="brown.800" fontSize="xs">
                            {event.date}
                          </Badge>
                          <Text fontSize="xs" color="gray.500">
                            {event.location}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="medium" color="gray.800">
                          {event.title}
                        </Text>
                        {index < upcomingEvents.length - 1 && <Divider mt={3} />}
                      </Box>
                    ))}
                  </VStack>
                  <Button
                    mt={4}
                    size="sm"
                    w="100%"
                    variant="outline"
                    borderColor="brown.500"
                    color="brown.500"
                    _hover={{ bg: 'brown.500', color: 'white' }}
                  >
                    Ver todos os eventos
                  </Button>
                </CardBody>
              </Card>

              {/* Newsletter */}
              <Card bg="white" borderWidth={2} borderColor="orange.200" w="100%">
                <CardBody>
                  <VStack spacing={3}>
                    <HStack spacing={2}>
                      <Icon as={Bookmark} color="brown.500" boxSize={5} />
                      <Text fontSize="lg" fontWeight="bold" color="brown.500">
                        Newsletter Diária
                      </Text>
                    </HStack>
                    <Text fontSize="sm" textAlign="center" color="gray.800">
                      Receba as principais notícias do mercado cafeeiro
                    </Text>
                    <Button
                      size="sm"
                      bg="brown.500"
                      color="white"
                      _hover={{ bg: 'brown.600' }}
                      w="100%"
                    >
                      Inscrever-se
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;