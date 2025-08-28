import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';
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
import HeroSection from '../components/home/HeroSection';
import ImageWithFallback from '../components/common/ImageWithFallback';
import StatusTag, { getTagCategory } from '../components/common/StatusTag';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('todas');
  const { currentTheme } = useThemeContext();

  // Stats data
  const stats = [
    {
      label: 'Preço Café Arábica',
      value: 'R$ 1.420',
      subValue: '/saca',
      change: 3.2,
      trend: 'increase' as const,
      icon: DollarSign,
    },
    {
      label: 'Temperatura Média',
      value: '22°C',
      subValue: 'Sul de Minas',
      change: -1.5,
      trend: 'decrease' as const,
      icon: Thermometer,
    },
    {
      label: 'Umidade do Ar',
      value: '65%',
      subValue: 'Ideal: 60-70%',
      change: 2.1,
      trend: 'increase' as const,
      icon: Droplet,
    },
    {
      label: 'Velocidade Vento',
      value: '12 km/h',
      subValue: 'Nordeste',
      change: 0,
      trend: 'neutral' as const,
      icon: Wind,
    },
    {
      label: 'Produtividade',
      value: '42 sc/ha',
      subValue: 'Média regional',
      change: 5.3,
      trend: 'increase' as const,
      icon: TrendingUp,
    },
  ];

  // Featured news
  const featuredNews = {
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

  // News list
  const newsList = [
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

  // Sidebar widgets
  const marketIndicators = [
    { label: 'ICE Futures', value: 'US$ 224.45', change: 2.3 },
    { label: 'BM&F', value: 'R$ 1.420', change: 3.2 },
    { label: 'Robusta', value: 'US$ 2.340', change: -1.1 },
    { label: 'Colombiano', value: 'US$ 245.60', change: 1.8 },
  ];

  const upcomingEvents = [
    { date: '15 Nov', title: 'Semana Internacional do Café', location: 'Belo Horizonte' },
    { date: '22 Nov', title: 'Workshop de Sustentabilidade', location: 'Online' },
    { date: '28 Nov', title: 'Feira de Tecnologia Agrícola', location: 'São Paulo' },
  ];

  const quickLinks = [
    { label: 'Cotação em tempo real', icon: TrendingUp },
    { label: 'Previsão do tempo', icon: Wind },
    { label: 'Análise de solo', icon: Droplet },
    { label: 'Calendário de plantio', icon: Calendar },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        navigate={navigate}
      />

      {/* Quick Stats Bar */}
      <Box
        bg={currentTheme.colors.background.primary}
        borderY="1px"
                color={currentTheme.colors.text.primary}
        py={4}
        boxShadow="sm"
      >
        <Container maxW="container.2xl">
          <HStack spacing={8} overflowX="auto" justify="space-between">
            {stats.map((stat, index) => (
              <HStack key={index} spacing={3} minW="200px">
                <Icon as={stat.icon} boxSize={6} color={currentTheme.colors.primary} />
                <VStack spacing={0} align="start">
                  <HStack spacing={1}>
                    <Text fontWeight="bold" fontSize="lg" color={currentTheme.colors.text.primary}>
                      {stat.value}
                    </Text>
                    <Text fontSize="xs" color={currentTheme.colors.text.secondary}>
                      {stat.subValue}
                    </Text>
                  </HStack>
                  <HStack spacing={1}>
                    <Text fontSize="xs" color={currentTheme.colors.text.secondary}>
                      {stat.label}
                    </Text>
                    {stat.change !== 0 && stat.trend !== 'neutral' && (
                      <>
                        <Text fontSize="xs" color={stat.trend === 'increase' ? currentTheme.colors.status.success : currentTheme.colors.status.error}>
                          {stat.trend === 'increase' ? '↗' : '↘'} {Math.abs(stat.change)}%
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
            <Card borderRadius="16px" bg="white"   mb={6}>
              <CardBody>
                <Flex align="center" mb={4}>
                  <HStack spacing={3}>
                    <Icon as={MessageCircle} color={currentTheme.colors.primary} boxSize={6} />
                    <Heading size="lg" color={currentTheme.colors.text.primary}>Notícias e Atualizações</Heading>
                  </HStack>
                  <Spacer />
                  <ButtonGroup size="sm" variant="outline">
                    <Button
                      onClick={() => setActiveTab('todas')}
                      bg={activeTab === 'todas' ? currentTheme.colors.primary : 'transparent'}
                      color={activeTab === 'todas' ? 'white' : currentTheme.colors.text.primary}
                      borderColor={currentTheme.colors.primary}
                    >
                      Todas
                    </Button>
                    <Button
                      onClick={() => setActiveTab('mercado')}
                      bg={activeTab === 'mercado' ? currentTheme.colors.primary : 'transparent'}
                      color={activeTab === 'mercado' ? 'white' : currentTheme.colors.text.primary}
                      borderColor={currentTheme.colors.primary}
                    >
                      Mercado
                    </Button>
                    <Button
                      onClick={() => setActiveTab('clima')}
                      bg={activeTab === 'clima' ? currentTheme.colors.primary : 'transparent'}
                      color={activeTab === 'clima' ? 'white' : currentTheme.colors.text.primary}
                      borderColor={currentTheme.colors.primary}
                    >
                      Clima
                    </Button>
                    <Button
                      onClick={() => setActiveTab('tecnologia')}
                      bg={activeTab === 'tecnologia' ? currentTheme.colors.primary : 'transparent'}
                      color={activeTab === 'tecnologia' ? 'white' : currentTheme.colors.text.primary}
                      borderColor={currentTheme.colors.primary}
                    >
                      Tecnologia
                    </Button>
                  </ButtonGroup>
                </Flex>

                {/* Featured News */}
                <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
                  {/* Main Featured */}
                  <GridItem>
                    <Card
                      bg={currentTheme.colors.background.primary}
                      
                                            overflow="hidden"
                      cursor="pointer"
                      _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                      transition="all 0.3s"
                      h="100%"
                    >
                      <Box position="relative" w="100%" h={{ base: '200px', md: '300px', lg: '350px' }}>
                        <ImageWithFallback
                          src={featuredNews.main.image}
                          alt={featuredNews.main.title}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                      </Box>
                      <CardBody display="flex" flexDirection="column" flex="1">
                        <StatusTag category={getTagCategory(featuredNews.main.category)} mb={2}>
                          {featuredNews.main.category}
                        </StatusTag>
                        <Heading size="md" mb={3} color={currentTheme.colors.text.primary}>
                          {featuredNews.main.title}
                        </Heading>
                        <Text color={currentTheme.colors.text.secondary} mb={4} flex="1">
                          {featuredNews.main.excerpt}
                        </Text>
                        <Flex justify="space-between" align="center" mt="auto">
                          <HStack spacing={3} fontSize="sm" color={currentTheme.colors.text.secondary}>
                            <HStack>
                              <Avatar size="xs" name={featuredNews.main.author} />
                              <Text>{featuredNews.main.author}</Text>
                            </HStack>
                            <HStack>
                              <Icon as={Clock} boxSize={3} />
                              <Text>{featuredNews.main.date}</Text>
                            </HStack>
                          </HStack>
                          <HStack spacing={2} fontSize="sm" color={currentTheme.colors.text.secondary}>
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
                          bg={currentTheme.colors.background.primary}
                          
                                                    overflow="hidden"
                          cursor="pointer"
                          _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                          transition="all 0.3s"
                          flex="1"
                        >
                          <Box w="100%" h="140px">
                            <ImageWithFallback
                              src={news.image}
                              alt={news.title}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                            />
                          </Box>
                          <CardBody p={4} display="flex" flexDirection="column">
                            <StatusTag category={getTagCategory(news.category)} size="sm" mb={2}>
                              {news.category}
                            </StatusTag>
                            <Heading size="sm" mb={2} color={currentTheme.colors.text.primary}>
                              {news.title}
                            </Heading>
                            <Text fontSize="sm" color={currentTheme.colors.text.secondary} mb={3} flex="1">
                              {news.excerpt}
                            </Text>
                            <HStack justify="space-between" fontSize="xs" color={currentTheme.colors.text.secondary} mt="auto">
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

                {/* News List */}
                <VStack spacing={4} align="stretch">
                  {newsList.map((news) => (
                    <Card
                      key={news.id}
                      bg={currentTheme.colors.background.primary}
                      
                                            cursor="pointer"
                      _hover={{ boxShadow: 'md' }}
                      transition="all 0.3s"
                    >
                      <CardBody>
                        <Flex gap={4}>
                          <Box flexShrink={0} w="100px" h="100px">
                            <ImageWithFallback
                              src={news.image}
                              alt={news.title}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                              borderRadius="16px"
                            />
                          </Box>
                          <Box flex={1}>
                            <Flex justify="space-between" align="start" mb={2}>
                              <StatusTag category={getTagCategory(news.category)} size="sm">
                                {news.category}
                              </StatusTag>
                              <HStack spacing={2}>
                                <Icon as={Bookmark} boxSize={4} cursor="pointer" color={currentTheme.colors.text.secondary} />
                                <Icon as={Share2} boxSize={4} cursor="pointer" color={currentTheme.colors.text.secondary} />
                              </HStack>
                            </Flex>
                            <Heading size="sm" mb={1} color={currentTheme.colors.text.primary}>
                              {news.title}
                            </Heading>
                            <Text fontSize="sm" color={currentTheme.colors.text.secondary} mb={2}>
                              {news.excerpt}
                            </Text>
                            <HStack fontSize="xs" color={currentTheme.colors.text.secondary} spacing={4}>
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
                    borderColor={currentTheme.colors.primary}
                    color={currentTheme.colors.primary}
                    _hover={{ bg: currentTheme.colors.primary, color: 'white' }}
                  >
                    Carregar mais notícias
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>

          {/* Sidebar - Fixed */}
          <GridItem>
            <VStack spacing={6} position="sticky" top="20px">
              {/* Market Indicators */}
              <Card borderRadius="16px" bg="white"   w="100%">
                <CardHeader pb={2}>
                  <HStack spacing={2}>
                    <Icon as={TrendingUp} color={currentTheme.colors.primary} boxSize={5} />
                    <Heading size="md" color={currentTheme.colors.text.primary}>Indicadores de Mercado</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={2}>
                  <VStack spacing={3} align="stretch">
                    {marketIndicators.map((indicator, index) => (
                      <Flex key={index} justify="space-between" align="center">
                        <Text fontSize="sm" color={currentTheme.colors.text.primary}>{indicator.label}</Text>
                        <HStack>
                          <Text fontWeight="bold" fontSize="sm" color={currentTheme.colors.text.primary}>
                            {indicator.value}
                          </Text>
                          <Badge
                            bg={indicator.change > 0 ? currentTheme.colors.status.success : currentTheme.colors.status.error}
                            color="white"
                            fontSize="xs"
                          >
                            {indicator.change > 0 ? '+' : ''}{indicator.change}%
                          </Badge>
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                  <Button
                    mt={4}
                    size="sm"
                    w="100%"
                    bg={currentTheme.colors.primary}
                    color="white"
                    _hover={{ bg: currentTheme.colors.secondary }}
                    onClick={() => navigate('/dashboard')}
                  >
                    Ver Dashboard Completo
                  </Button>
                </CardBody>
              </Card>

              {/* Quick Links */}
              <Card borderRadius="16px" bg="white"   w="100%">
                <CardHeader pb={2}>
                  <HStack spacing={2}>
                    <Icon as={Activity} color={currentTheme.colors.primary} boxSize={5} />
                    <Heading size="md" color={currentTheme.colors.text.primary}>Acesso Rápido</Heading>
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
                        leftIcon={<Icon as={link.icon} color={currentTheme.colors.primary} />}
                        color={currentTheme.colors.text.primary}
                        _hover={{ bg: currentTheme.colors.background.secondary }}
                      >
                        {link.label}
                      </Button>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              {/* Upcoming Events */}
              <Card borderRadius="16px" bg="white"   w="100%">
                <CardHeader pb={2}>
                  <HStack spacing={2}>
                    <Icon as={Calendar} color={currentTheme.colors.primary} boxSize={5} />
                    <Heading size="md" color={currentTheme.colors.text.primary}>Próximos Eventos</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={2}>
                  <VStack spacing={3} align="stretch">
                    {upcomingEvents.map((event, index) => (
                      <Box key={index}>
                        <HStack justify="space-between" mb={1}>
                          <Badge bg={currentTheme.colors.accent + '10'} color={currentTheme.colors.accent}  borderColor={currentTheme.colors.accent + '40'} borderRadius="16px" fontSize="xs">
                            {event.date}
                          </Badge>
                          <Text fontSize="xs" color={currentTheme.colors.text.secondary}>
                            {event.location}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" fontWeight="medium" color={currentTheme.colors.text.primary}>
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
                    borderColor={currentTheme.colors.primary}
                    color={currentTheme.colors.primary}
                    _hover={{ bg: currentTheme.colors.primary, color: 'white' }}
                  >
                    Ver todos os eventos
                  </Button>
                </CardBody>
              </Card>

              {/* Newsletter */}
              <Card borderRadius="16px" bg="white" borderWidth={2} borderColor={currentTheme.colors.border.focus} w="100%">
                <CardBody>
                  <VStack spacing={3}>
                    <HStack spacing={2}>
                      <Icon as={Bookmark} color={currentTheme.colors.primary} boxSize={5} />
                      <Text fontSize="lg" fontWeight="bold" color={currentTheme.colors.primary}>
                        Newsletter Diária
                      </Text>
                    </HStack>
                    <Text fontSize="sm" textAlign="center" color={currentTheme.colors.text.primary}>
                      Receba as principais notícias do mercado cafeeiro
                    </Text>
                    <Button
                      size="sm"
                      bg={currentTheme.colors.primary}
                      color="white"
                      _hover={{ bg: currentTheme.colors.secondary }}
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