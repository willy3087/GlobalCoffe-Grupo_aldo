import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Icon,
  Text,
  Heading,
  VStack,
  Flex,
  Divider,
  Progress,
  Button,
  SimpleGrid,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  List,
  ListItem,
  ListIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import PageHeader from '../components/PageHeader';
import { Coffee } from 'react-feather';
import { FaCoffee, FaCalculator, FaChartLine, FaDollarSign, FaGlobeAmericas, FaCheckCircle, FaChild, FaDatabase } from 'react-icons/fa';
import { BarChart2, Package, Settings, TrendingUp as TrendingUpIcon, Truck, Clipboard, Shield } from 'react-feather';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { MdTrendingUp, MdTrendingDown, MdTrendingFlat } from 'react-icons/md';
import { useThemeContext } from '../contexts/ThemeContext';
import { ServiceContainer } from '../services/ServiceContainer';

interface KPIPrincipal {
  icon: any;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

interface Cenario {
  nome: string;
  variacao: string;
  precoEstimado: number;
  probabilidade: string;
  cor: 'green' | 'blue' | 'red';
}

interface DataSource {
  name: string;
  uptime: number;
  latency: number;
  status: 'online' | 'offline' | 'maintenance';
}

interface MarketData {
  internalMarket: {
    volume: number;
    averagePrice: number;
    growth: number;
    destinations: Array<{ name: string; percentage: number }>;
  };
  externalMarket: {
    volume: number;
    averagePrice: number;
    growth: number;
    destinations: Array<{ name: string; percentage: number }>;
  };
}

const Features: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const toast = useToast();
  const borderColor = currentTheme.colors.border.primary;
  const subCardBg = 'white';

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [kpisPrincipais, setKpisPrincipais] = useState<KPIPrincipal[]>([]);
  const [cenarios, setCenarios] = useState<Cenario[]>([]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [precoBase, setPrecoBase] = useState(1842);

  // Estados para calculadora
  const [quantidade, setQuantidade] = useState(100);
  const [qualidade, setQualidade] = useState<'tipo2' | 'tipo4' | 'tipo6' | 'tipo8'>('tipo6');
  const [canal, setCanal] = useState<'cooperativa' | 'corretor' | 'direto'>('cooperativa');
  const [hedge, setHedge] = useState(30);

  // Serviços
  const analyticsService = ServiceContainer.getAnalyticsService();
  const marketDataService = ServiceContainer.getMarketDataService();

  // Carregamento inicial dos dados
  const loadFeaturesData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Carrega KPIs principais
      const kpisResult = await analyticsService.getMainKPIs();
      if (kpisResult.success && kpisResult.data) {
        setKpisPrincipais(kpisResult.data.map((kpi: any) => ({
          icon: getKPIIcon(kpi.type),
          label: kpi.label,
          value: kpi.value,
          change: kpi.change,
          trend: kpi.trend,
          color: getKPIColor(kpi.type)
        })));
      } else {
        setKpisPrincipais(generateMockKPIs());
      }

      // Carrega cenários de preço
      const cenariosResult = await analyticsService.getPriceScenarios();
      if (cenariosResult.success && cenariosResult.data) {
        setCenarios(cenariosResult.data);
      } else {
        setCenarios(generateMockScenarios());
      }

      // Carrega dados de mercado
      const marketResult = await analyticsService.getMarketComparison();
      if (marketResult.success && marketResult.data) {
        setMarketData(marketResult.data);
      } else {
        setMarketData(generateMockMarketData());
      }

      // Carrega status das fontes de dados
      const sourcesResult = await analyticsService.getDataSourcesStatus();
      if (sourcesResult.success && sourcesResult.data) {
        setDataSources(sourcesResult.data);
      } else {
        setDataSources(generateMockDataSources());
      }

      // Carrega preço base atual
      const priceResult = await marketDataService.getCurrentPrice();
      if (priceResult.success && priceResult.data) {
        setPrecoBase(priceResult.data.price);
      }

    } catch (error) {
      console.error('Erro ao carregar dados da central de análise:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados da análise',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Fallback para dados mock
      setKpisPrincipais(generateMockKPIs());
      setCenarios(generateMockScenarios());
      setMarketData(generateMockMarketData());
      setDataSources(generateMockDataSources());
    } finally {
      setIsLoading(false);
    }
  }, [analyticsService, marketDataService, toast]);

  useEffect(() => {
    loadFeaturesData();
  }, [loadFeaturesData]);

  // Funções auxiliares
  const getKPIIcon = (type: string) => {
    switch (type) {
      case 'price': return FaCoffee;
      case 'quality': return FaChartLine;
      case 'channel': return FaDollarSign;
      case 'climate': return FaArrowTrendUp;
      default: return FaCoffee;
    }
  };

  const getKPIColor = (type: string) => {
    switch (type) {
      case 'price': return currentTheme.colors.status.success;
      case 'quality': return currentTheme.colors.status.warning;
      case 'channel': return currentTheme.colors.status.info;
      case 'climate': return currentTheme.colors.primary;
      default: return currentTheme.colors.primary;
    }
  };

  // Dados mock para fallback
  const generateMockKPIs = (): KPIPrincipal[] => [
    {
      icon: FaCoffee,
      label: 'Preço Médio Hoje',
      value: 'R$ 1.800',
      change: '+2.5%',
      trend: 'up',
      color: currentTheme.colors.status.success
    },
    {
      icon: FaChartLine,
      label: 'Tipo mais Valorizado',
      value: 'Tipo 6',
      change: '+1.2%',
      trend: 'up',
      color: currentTheme.colors.status.warning
    },
    {
      icon: FaDollarSign,
      label: 'Melhor Canal',
      value: 'Cooperativa',
      change: '0.5%',
      trend: 'up',
      color: currentTheme.colors.status.info
    },
    {
      icon: FaArrowTrendUp,
      label: 'Clima Safra',
      value: 'Normal',
      change: 'Estável',
      trend: 'neutral',
      color: currentTheme.colors.primary
    }
  ];

  const generateMockScenarios = (): Cenario[] => [
    {
      nome: 'Otimista',
      variacao: '+15%',
      precoEstimado: Math.round(precoBase * 1.15),
      probabilidade: '25%',
      cor: 'green'
    },
    {
      nome: 'Realista',
      variacao: '+5%',
      precoEstimado: Math.round(precoBase * 1.05),
      probabilidade: '50%',
      cor: 'blue'
    },
    {
      nome: 'Pessimista',
      variacao: '-10%',
      precoEstimado: Math.round(precoBase * 0.9),
      probabilidade: '25%',
      cor: 'red'
    }
  ];

  const generateMockMarketData = (): MarketData => ({
    internalMarket: {
      volume: 25,
      averagePrice: 1750,
      growth: 3,
      destinations: [
        { name: 'São Paulo', percentage: 35 },
        { name: 'Minas Gerais', percentage: 30 },
        { name: 'Rio de Janeiro', percentage: 20 }
      ]
    },
    externalMarket: {
      volume: 7000000,
      averagePrice: 1850,
      growth: 5,
      destinations: [
        { name: 'EUA', percentage: 28 },
        { name: 'Alemanha', percentage: 18 },
        { name: 'Itália', percentage: 15 }
      ]
    }
  });

  const generateMockDataSources = (): DataSource[] => [
    { name: 'API Bloomberg', uptime: 99.9, latency: 12, status: 'online' },
    { name: 'CONAB', uptime: 98.5, latency: 150, status: 'online' },
    { name: 'CEPEA/ESALQ', uptime: 99.2, latency: 85, status: 'online' },
    { name: 'Weather API', uptime: 99.7, latency: 45, status: 'online' }
  ];

  // Cálculo do preço final via Service Layer
  const calcularPrecoFinal = useCallback(async () => {
    try {
      const result = await analyticsService.calculateFinalPrice({
        basePrice: precoBase,
        quantity: quantidade,
        quality: qualidade,
        channel: canal,
        hedgePercentage: hedge
      });

      if (result.success && result.data) {
        return result.data;
      } else {
        // Fallback para cálculo local
        return calcularPrecoFinalLocal();
      }
    } catch (error) {
      console.error('Erro ao calcular preço via serviço:', error);
      return calcularPrecoFinalLocal();
    }
  }, [precoBase, quantidade, qualidade, canal, hedge, analyticsService]);

  const calcularPrecoFinalLocal = () => {
    const ajustesQualidade: Record<'tipo2' | 'tipo4' | 'tipo6' | 'tipo8', number> = {
      tipo2: 150,
      tipo4: 100,
      tipo6: 0,
      tipo8: -100
    };

    const comissaoCanal: Record<'cooperativa' | 'corretor' | 'direto', number> = {
      cooperativa: 0.005,
      corretor: 0.01,
      direto: 0
    };

    const ajusteQualidade = ajustesQualidade[qualidade];
    const precoComQualidade = precoBase + ajusteQualidade;
    const comissao = precoComQualidade * comissaoCanal[canal];
    const precoLiquido = precoComQualidade - comissao;
    const valorTotal = (precoLiquido * quantidade) / 60; // convertendo para sacas
    
    return {
      precoUnitario: precoComQualidade,
      comissao: comissao,
      precoLiquido: precoLiquido,
      valorTotal: valorTotal,
      hedgeValor: valorTotal * (hedge / 100)
    };
  };

  const [resultado, setResultado] = useState(calcularPrecoFinalLocal());

  // Recalcula quando os parâmetros mudam
  useEffect(() => {
    const updateResult = async () => {
      const newResult = await calcularPrecoFinal();
      setResultado(newResult);
    };
    updateResult();
  }, [calcularPrecoFinal]);

  const getCorCenario = (cor: string) => {
    switch(cor) {
      case 'green': return currentTheme.colors.status.success;
      case 'blue': return currentTheme.colors.status.info;
      case 'red': return currentTheme.colors.status.error;
      default: return currentTheme.colors.primary;
    }
  };

  if (isLoading) {
    return (
      <Box>
        <PageHeader
          title="Central de Análise e Simulação"
          subtitle="KPIs, Calculadora de Preços e Simulação de Vendas"
          icon={Coffee}
        />
        <Container maxW="container.2xl" py={8}>
          <Flex justify="center" align="center" h="400px">
            <VStack spacing={4}>
              <Spinner size="xl" color={currentTheme.colors.primary} />
              <Text>Carregando análises...</Text>
            </VStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Central de Análise e Simulação"
        subtitle="KPIs, Calculadora de Preços e Simulação de Vendas"
        icon={Coffee}
      />
      <Container maxW="container.2xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '4fr 1fr' }} gap={6}>
          {/* Área Principal */}
          <GridItem>
            {/* KPIs Principais */}
            <Card bg="white" borderWidth={1} borderColor={borderColor} mb={6}>
              <CardHeader>
                <HStack>
                  <Icon as={BarChart2} color={currentTheme.colors.primary} />
                  <Heading size="md">KPIs Principais do Mercado</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                  {kpisPrincipais.map((kpi, idx) => (
                    <Card key={idx} bg="white" borderWidth={1} borderColor={borderColor}>
                      <CardBody textAlign="center">
                        <Icon as={kpi.icon} boxSize={8} color={kpi.color} mb={4} />
                        <Stat>
                          <StatLabel fontSize="sm">{kpi.label}</StatLabel>
                          <StatNumber fontSize="xl">{kpi.value}</StatNumber>
                          <StatHelpText>
                            {kpi.trend !== 'neutral' && (
                              <StatArrow type={kpi.trend === 'up' ? 'increase' : 'decrease'} />
                            )}
                            {kpi.change}
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Simulação de Cenários */}
            <Card bg="white" borderWidth={1} borderColor={borderColor} mb={6}>
              <CardHeader>
                <Flex align="center">
                  <Icon as={FaChartLine} mr={4} color={currentTheme.colors.accent} />
                  <Heading size="md">Simulação de Cenários - Próximos 30 dias</Heading>
                </Flex>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  {cenarios.map((cenario, idx) => {
                    const corTema = getCorCenario(cenario.cor);
                    
                    return (
                      <Card key={idx} bg="white" borderWidth={2} borderColor={corTema}>
                        <CardBody textAlign="center">
                          <Badge bg={corTema} color="white" mb={3} fontSize="sm">
                            {cenario.nome}
                          </Badge>
                          <VStack spacing={2}>
                            <Text fontSize="lg" fontWeight="bold">
                              {cenario.variacao}
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold" color={corTema}>
                              R$ {cenario.precoEstimado}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              Probabilidade: {cenario.probabilidade}
                            </Text>
                            <Progress
                              value={parseInt(cenario.probabilidade)}
                              bg={currentTheme.colors.background.secondary}
                              size="lg"
                              w="100%"
                              borderRadius="md"
                              sx={{'& > div': { bg: corTema }}}
                            />
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })}
                </SimpleGrid>

                <Alert status="warning" mt={6}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Recomendação:</AlertTitle>
                    <AlertDescription>
                      Com base na volatilidade atual de 24.3%, considere fazer hedge de 30-50% da sua produção.
                    </AlertDescription>
                  </Box>
                </Alert>
              </CardBody>
            </Card>

            {/* Canais de Comercialização */}
            <Card bg="white" borderWidth={1} borderColor={borderColor} mb={6}>
              <CardHeader>
                <HStack>
                  <Icon as={Package} color={currentTheme.colors.primary} />
                  <Heading size="md">Canais de Comercialização</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Card bg="white" borderWidth={1} borderColor={borderColor}>
                    <CardBody>
                      <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="sm">Via Cooperativa</Heading>
                        <Badge bg={currentTheme.colors.status.success} color="white" fontSize="lg" px={3} py={1}>
                          65%
                        </Badge>
                      </Flex>
                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Segurança na Venda</Text>
                          <Progress value={95} bg={currentTheme.colors.background.secondary} borderRadius="md" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.success }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Assistência Técnica</Text>
                          <Progress value={95} bg={currentTheme.colors.background.secondary} borderRadius="md" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.success }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Preços Competitivos</Text>
                          <Progress value={85} bg={currentTheme.colors.background.secondary} borderRadius="md" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.success }}} />
                        </Box>
                        <Divider />
                        <Flex justify="space-between" align="center">
                          <Text fontSize="sm" fontWeight="medium">Comissão:</Text>
                          <Badge bg={currentTheme.colors.status.info} color="white" variant="subtle">0,5%</Badge>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card bg="white" borderWidth={1} borderColor={borderColor}>
                    <CardBody>
                      <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="sm">Via Corretor</Heading>
                        <Badge bg={currentTheme.colors.status.warning} color="white" fontSize="lg" px={3} py={1}>
                          35%
                        </Badge>
                      </Flex>
                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Flexibilidade</Text>
                          <Progress value={100} bg={currentTheme.colors.background.secondary} borderRadius="md" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.warning }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Agilidade na Venda</Text>
                          <Progress value={90} bg={currentTheme.colors.background.secondary} borderRadius="md" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.warning }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Negociação Direta</Text>
                          <Progress value={80} bg={currentTheme.colors.background.secondary} borderRadius="md" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.warning }}} />
                        </Box>
                        <Divider />
                        <Flex justify="space-between" align="center">
                          <Text fontSize="sm" fontWeight="medium">Comissão:</Text>
                          <Badge bg={currentTheme.colors.status.info} color="white" variant="subtle">0,5-1%</Badge>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
                <Alert status="info" mt={6}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Análise dos Canais</AlertTitle>
                    <AlertDescription>
                      A cooperativa oferece maior segurança e suporte técnico, enquanto o corretor proporciona mais flexibilidade e agilidade nas negociações.
                    </AlertDescription>
                  </Box>
                </Alert>
              </CardBody>
            </Card>

            {/* Comparativo de Mercados */}
            {marketData && (
              <Card bg="white" borderWidth={1} borderColor={borderColor} mb={6}>
                <CardHeader>
                  <HStack>
                    <Icon as={TrendingUpIcon} color={currentTheme.colors.primary} />
                    <Heading size="md">Comparativo de Mercados</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {/* Mercado Interno */}
                    <Card bg="white" borderWidth={2} borderColor={currentTheme.colors.status.success}>
                      <CardHeader pb={2}>
                        <Flex align="center" justify="space-between">
                          <HStack>
                            <Icon as={FaCoffee} color={currentTheme.colors.status.success} />
                            <Heading size="sm">Mercado Interno</Heading>
                          </HStack>
                          <Badge bg={currentTheme.colors.status.success} color="white" fontSize="md" px={3} py={1}>
                            40%
                          </Badge>
                        </Flex>
                      </CardHeader>
                      <CardBody pt={2}>
                        <VStack align="stretch" spacing={4}>
                          <Stat>
                            <StatLabel fontSize="sm">Volume Negociado</StatLabel>
                            <StatNumber fontSize="lg">{marketData.internalMarket.volume}% do total</StatNumber>
                            <StatHelpText>
                              <StatArrow type={marketData.internalMarket.growth > 0 ? 'increase' : 'decrease'} />
                              {marketData.internalMarket.growth > 0 ? '+' : ''}{marketData.internalMarket.growth}% vs mês anterior
                            </StatHelpText>
                          </Stat>
                          <Divider />
                          <Stat>
                            <StatLabel fontSize="sm">Preço Médio</StatLabel>
                            <StatNumber fontSize="xl" color={currentTheme.colors.status.success}>
                              R$ {marketData.internalMarket.averagePrice}
                            </StatNumber>
                            <StatHelpText>Por saca de 60kg</StatHelpText>
                          </Stat>
                          <Divider />
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={2}>Principais Destinos:</Text>
                            <VStack align="stretch" spacing={1}>
                              {marketData.internalMarket.destinations.map((dest, idx) => (
                                <HStack key={idx}>
                                  <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={3} />
                                  <Text fontSize="sm">{dest.name} ({dest.percentage}%)</Text>
                                </HStack>
                              ))}
                            </VStack>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Mercado Externo */}
                    <Card bg="white" borderWidth={2} borderColor={currentTheme.colors.status.info}>
                      <CardHeader pb={2}>
                        <Flex align="center" justify="space-between">
                          <HStack>
                            <Icon as={FaGlobeAmericas} color={currentTheme.colors.status.info} />
                            <Heading size="sm">Mercado Externo</Heading>
                          </HStack>
                          <Badge bg={currentTheme.colors.status.info} color="white" fontSize="md" px={3} py={1}>
                            60%
                          </Badge>
                        </Flex>
                      </CardHeader>
                      <CardBody pt={2}>
                        <VStack align="stretch" spacing={4}>
                          <Stat>
                            <StatLabel fontSize="sm">Volume Exportado</StatLabel>
                            <StatNumber fontSize="lg">{(marketData.externalMarket.volume / 1000000).toFixed(1)}M sacas</StatNumber>
                            <StatHelpText>
                              <StatArrow type={marketData.externalMarket.growth > 0 ? 'increase' : 'decrease'} />
                              {marketData.externalMarket.growth > 0 ? '+' : ''}{marketData.externalMarket.growth}% vs ano anterior
                            </StatHelpText>
                          </Stat>
                          <Divider />
                          <Stat>
                            <StatLabel fontSize="sm">Preço Médio</StatLabel>
                            <StatNumber fontSize="xl" color={currentTheme.colors.status.info}>
                              R$ {marketData.externalMarket.averagePrice}
                            </StatNumber>
                            <StatHelpText>Por saca de 60kg</StatHelpText>
                          </Stat>
                          <Divider />
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={2}>Principais Destinos:</Text>
                            <VStack align="stretch" spacing={1}>
                              {marketData.externalMarket.destinations.map((dest, idx) => (
                                <HStack key={idx}>
                                  <Icon as={FaCheckCircle} color={currentTheme.colors.status.info} boxSize={3} />
                                  <Text fontSize="sm">{dest.name} ({dest.percentage}%)</Text>
                                </HStack>
                              ))}
                            </VStack>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </CardBody>
              </Card>
            )}

            {/* Fontes de Dados Disponíveis */}
            <Card bg="white" borderWidth={1} borderColor={borderColor} mb={6}>
              <CardHeader>
                <HStack>
                  <Icon as={FaDatabase} color={currentTheme.colors.primary} />
                  <Heading size="md">Status das Fontes de Dados</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Fonte</Th>
                        <Th isNumeric>Uptime</Th>
                        <Th isNumeric>Latência</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dataSources.map((source) => (
                        <Tr key={source.name}>
                          <Td>{source.name}</Td>
                          <Td isNumeric>{source.uptime}%</Td>
                          <Td isNumeric>{source.latency}ms</Td>
                          <Td>
                            <Badge 
                              bg={source.status === 'online' ? currentTheme.colors.status.success : currentTheme.colors.status.error} 
                              color="white"
                            >
                              {source.status === 'online' ? 'Online' : 'Offline'}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>

                <Alert status="success" mt={4}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Integração Completa</AlertTitle>
                    <AlertDescription>
                      Todas as fontes de dados estão operacionais. Taxa de sucesso nas últimas 24h: 99.8%
                    </AlertDescription>
                  </Box>
                </Alert>
              </CardBody>
            </Card>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <Card bg="white" borderWidth={1} borderColor={borderColor} position="sticky" top={4}>
              <CardHeader>
                <Heading size="md">Ações Rápidas</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Button 
                    leftIcon={<FaCalculator />} 
                    bg={currentTheme.colors.primary} 
                    color="white" 
                    _hover={{ bg: currentTheme.colors.secondary }} 
                    onClick={onOpen}
                  >
                    Calculadora de Preços
                  </Button>
                  <Button 
                    leftIcon={<FaChartLine />} 
                    bg={currentTheme.colors.secondary} 
                    color="white" 
                    _hover={{ bg: currentTheme.colors.secondaryLight }}
                  >
                    Relatório Detalhado
                  </Button>
                  <Button 
                    leftIcon={<FaDollarSign />} 
                    bg={currentTheme.colors.secondary} 
                    color="white" 
                    _hover={{ bg: currentTheme.colors.secondaryLight }}
                  >
                    Configurar Alertas
                  </Button>
                </VStack>

                <Divider my={6} />

                <Heading size="sm" mb={4}>Alertas de Preço</Heading>
                <VStack spacing={3} align="stretch">
                  <Alert status="success" size="sm">
                    <AlertIcon />
                    <Box fontSize="sm">
                      <Text fontWeight="bold">Meta atingida!</Text>
                      <Text>Preço acima de R$ 1.800</Text>
                    </Box>
                  </Alert>
                  <Alert status="warning" size="sm">
                    <AlertIcon />
                    <Box fontSize="sm">
                      <Text fontWeight="bold">Atenção</Text>
                      <Text>Volatilidade alta</Text>
                    </Box>
                  </Alert>
                </VStack>

                <Divider my={6} />

                <Heading size="sm" mb={4}>Dicas de Mercado</Heading>
                <VStack spacing={3} align="stretch">
                  <Box p={3} bg={subCardBg} borderRadius="md" border="1px" borderColor={borderColor}>
                    <HStack>
                      <Icon as={FaCalculator} color={currentTheme.colors.primary} />
                      <Text fontSize="sm">Diversifique canais de venda para reduzir riscos</Text>
                    </HStack>
                  </Box>
                  <Box p={3} bg={subCardBg} borderRadius="md" border="1px" borderColor={borderColor}>
                    <HStack>
                      <Icon as={FaChartLine} color={currentTheme.colors.primary} />
                      <Text fontSize="sm">Monitore clima semanalmente para decisões de hedge</Text>
                    </HStack>
                  </Box>
                  <Box p={3} bg={subCardBg} borderRadius="md" border="1px" borderColor={borderColor}>
                    <HStack>
                      <Icon as={FaDollarSign} color={currentTheme.colors.primary} />
                      <Text fontSize="sm">Considere contratos futuros para 30% da safra</Text>
                    </HStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Container>

      {/* Modal da Calculadora de Preços */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Icon as={FaCalculator} mr={4} color="blue.500" />
              Calculadora de Preços
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
              {/* Inputs */}
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Quantidade (kg)</FormLabel>
                  <NumberInput value={quantidade} onChange={(value) => setQuantidade(Number(value))}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Qualidade do Café</FormLabel>
                  <Select value={qualidade} onChange={(e) => setQualidade(e.target.value as 'tipo2' | 'tipo4' | 'tipo6' | 'tipo8')}>
                    <option value="tipo2">Tipo 2 (+R$ 150)</option>
                    <option value="tipo4">Tipo 4 (+R$ 100)</option>
                    <option value="tipo6">Tipo 6 (Base)</option>
                    <option value="tipo8">Tipo 8 (-R$ 100)</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Canal de Venda</FormLabel>
                  <Select value={canal} onChange={(e) => setCanal(e.target.value as 'cooperativa' | 'corretor' | 'direto')}>
                    <option value="cooperativa">Cooperativa (0,5%)</option>
                    <option value="corretor">Corretor (1,0%)</option>
                    <option value="direto">Venda Direta (0%)</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Hedge (% da produção): {hedge}%</FormLabel>
                  <Slider value={hedge} onChange={setHedge} min={0} max={100} step={5}>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </FormControl>
              </VStack>

              {/* Resultados */}
              <VStack spacing={4} align="stretch">
                <Alert status="info">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Resultado da Simulação</AlertTitle>
                  </Box>
                </Alert>

                <SimpleGrid columns={1} spacing={4}>
                  <Stat>
                    <StatLabel>Preço por Saca (60kg)</StatLabel>
                    <StatNumber>R$ {resultado.precoUnitario.toFixed(2)}</StatNumber>
                  </Stat>

                  <Stat>
                    <StatLabel>Comissão</StatLabel>
                    <StatNumber color="red.500">-R$ {resultado.comissao.toFixed(2)}</StatNumber>
                  </Stat>

                  <Stat>
                    <StatLabel>Preço Líquido</StatLabel>
                    <StatNumber color="green.500">R$ {resultado.precoLiquido.toFixed(2)}</StatNumber>
                  </Stat>

                  <Divider />

                  <Stat>
                    <StatLabel>Valor Total ({(quantidade/60).toFixed(1)} sacas)</StatLabel>
                    <StatNumber fontSize="2xl" color="blue.500">
                      R$ {resultado.valorTotal.toFixed(2)}
                    </StatNumber>
                  </Stat>

                  <Stat>
                    <StatLabel>Valor com Hedge ({hedge}%)</StatLabel>
                    <StatNumber color="purple.500">R$ {resultado.hedgeValor.toFixed(2)}</StatNumber>
                  </Stat>
                </SimpleGrid>
              </VStack>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Features;