import React from 'react';
import PageHeader from '../components/PageHeader';
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
  Divider,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { useThemeContext } from '../contexts/ThemeContext';
import SegmentedBar from '../components/common/SegmentedBar';
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
import { FaCoffee, FaThermometerHalf, FaBox, FaGlobeAmericas, FaDollarSign, FaChartLine } from 'react-icons/fa';
import { BarChart2, TrendingUp as TrendingUpIcon, TrendingDown, ArrowRight, FileText } from 'react-feather';
import { BsArrowRepeat, BsCloudRain, BsFuelPump, BsBank, BsGlobe2 } from 'react-icons/bs';
import { MdTrendingUp } from 'react-icons/md';
import { BarChart } from 'react-feather';

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
  const { currentTheme } = useThemeContext();

  // KPI data
  const kpis = [
    { icon: FaCoffee, label: 'Preço da Saca', value: 'R$ 1.842', change: '+3.2%', type: 'increase' },
    { icon: FaThermometerHalf, label: 'Índice Climático', value: '78/100', change: 'Favorável', type: 'neutral' },
    { icon: FaBox, label: 'Estoque Mundial', value: '158M', change: '-2.1%', type: 'decrease' },
    { icon: FaGlobeAmericas, label: 'Produção Global', value: '175M', change: '+4.5%', type: 'increase' },
    { icon: FaDollarSign, label: 'Taxa de Câmbio', value: 'R$ 5.12', change: '+0.8%', type: 'increase' },
    { icon: FaChartLine, label: 'Volatilidade', value: '24.3%', change: '+8.2%', type: 'increase' },
  ];

  // Market predictions data
  const marketPredictions = [
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
  ];

  // Impact factors
  const impactFactors = [
    { icon: BsCloudRain, label: 'Clima', impact: 35, color: 'blue.500' },
    { icon: FaDollarSign, label: 'Câmbio', impact: 25, color: 'green.500' },
    { icon: MdTrendingUp, label: 'Demanda', impact: 20, color: 'purple.500' },
    { icon: BsFuelPump, label: 'Combustível', impact: 10, color: 'orange.500' },
    { icon: BsBank, label: 'Política', impact: 5, color: 'red.500' },
    { icon: BsGlobe2, label: 'Global', impact: 5, color: 'cyan.500' },
  ];

  // Price composition chart data with gradients
  const priceCompositionData = {
    labels: ['Produção', 'Logística', 'Beneficiamento', 'Impostos', 'Margem'],
    datasets: [
      {
        data: [45, 20, 15, 12, 8],
        backgroundColor: [
          'linear-gradient(135deg, #fbb6ce, #fed7af)', // pink to orange (Produção)
          'linear-gradient(135deg, #90cdf4, #76e4f7)', // blue to cyan (Logística)
          'linear-gradient(135deg, #c6b2ff, #e9d5ff)', // purple to light purple (Beneficiamento)
          'linear-gradient(135deg, #fed7af, #fef5e7)', // orange to cream (Impostos)
          'linear-gradient(135deg, #c6f6d5, #f0fff4)', // green to light green (Margem)
        ],
        borderColor: currentTheme.colors.background.primary,
        borderWidth: 2,
      },
    ],
  };

  // Historical price trend data
  const priceTrendData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Preço Médio (R$/saca)',
        data: [1650, 1680, 1720, 1750, 1780, 1810, 1790, 1820, 1835, 1842, null, null],
        borderColor: currentTheme.colors.primary,
        backgroundColor: currentTheme.colors.primary + '20',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Projeção',
        data: [null, null, null, null, null, null, null, null, null, 1842, 1880, 1920],
        borderColor: currentTheme.colors.secondary,
        backgroundColor: currentTheme.colors.secondary + '20',
        borderDash: [5, 5],
        tension: 0.4,
        fill: true,
      },
    ],
  };

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

  // Market news
  const marketNews = [
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


  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <Icon as={TrendingUpIcon} size={16} color={currentTheme.colors.status.success} />;
      case 'negative':
        return <Icon as={TrendingDown} size={16} color={currentTheme.colors.status.error} />;
      default:
        return <Icon as={ArrowRight} size={16} color={currentTheme.colors.text.secondary} />;
    }
  };

  return (
    <Box>
      <PageHeader 
        title="Dashboard de Café" 
        subtitle="Visão geral da produção e mercado"
        icon={BarChart}
      />
      <Container maxW="container.2xl" py={4}>
        <VStack spacing={4} align="stretch">
        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={4}>
          {/* Main Content Area */}
          <GridItem>
            {/* KPI Grid */}
            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4} mb={4}>
              {kpis.map((kpi, index) => (
                <Card borderRadius="16px" key={index} bg={currentTheme.colors.background.primary}  >
                  <CardBody p={4}>
                    <Stat textAlign="center">
                      <Icon as={kpi.icon} boxSize={6} color={currentTheme.colors.primary} mb={2} />
                      <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary}>{kpi.label}</StatLabel>
                      <StatNumber fontSize="lg" color={currentTheme.colors.text.primary}>{kpi.value}</StatNumber>
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
            <Card borderRadius="16px" bg="white"   mb={8}>
              <CardHeader>
                <Flex align="center">
                  <HStack>
                    <Icon as={BarChart2} color={currentTheme.colors.primary} />
                    <Heading size="md" color={currentTheme.colors.text.primary}>Previsões de Mercado</Heading>
                  </HStack>
                  <Spacer />
                  <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="xs">Atualizado</Badge>
                </Flex>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                  {marketPredictions.map((prediction, index) => (
                    <Card borderRadius="16px" key={index} bg="white"  >
                      <CardBody>
                        <Text fontWeight="bold" mb={4} color={currentTheme.colors.text.primary}>{prediction.period}</Text>
                        
                        <VStack spacing={3} align="stretch">
                          <Box>
                            <Flex justify="space-between" mb={1}>
                              <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Alta</Text>
                              <Text fontSize="sm" fontWeight="bold" color={currentTheme.colors.text.primary}>{prediction.high}%</Text>
                            </Flex>
                            <SegmentedBar 
                              variant="default"
                              data={[
                                {
                                  name: 'Alta',
                                  value: prediction.high,
                                  gradient: 'linear(to-r, green.200, green.300)',
                                  dotColor: '#48bb78',
                                  completed: true
                                },
                                {
                                  name: 'Restante',
                                  value: 100 - prediction.high,
                                  gradient: 'linear(to-r, gray.100, gray.200)',
                                  dotColor: '#cbd5e0',
                                  completed: false
                                }
                              ]}
                              height="32px"
                              showDots={false}
                              showLabels={false}
                            />
                          </Box>
                          
                          <Box>
                            <Flex justify="space-between" mb={1}>
                              <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Baixa</Text>
                              <Text fontSize="sm" fontWeight="bold" color={currentTheme.colors.text.primary}>{prediction.low}%</Text>
                            </Flex>
                            <SegmentedBar 
                              variant="default"
                              data={[
                                {
                                  name: 'Baixa',
                                  value: prediction.low,
                                  gradient: 'linear(to-r, red.200, red.300)',
                                  dotColor: '#f56565',
                                  completed: true
                                },
                                {
                                  name: 'Restante',
                                  value: 100 - prediction.low,
                                  gradient: 'linear(to-r, gray.100, gray.200)',
                                  dotColor: '#cbd5e0',
                                  completed: false
                                }
                              ]}
                              height="32px"
                              showDots={false}
                              showLabels={false}
                            />
                          </Box>
                        </VStack>
                        
                        <Divider my={3} />
                        
                        <VStack spacing={1} align="stretch">
                          <Text fontSize="xs" color={currentTheme.colors.text.secondary}>Faixa Prevista:</Text>
                          <Text fontSize="sm" fontWeight="bold" color={currentTheme.colors.text.primary}>{prediction.range}</Text>
                          <Badge
                            bg={prediction.confidence === 'Alta' ? `${currentTheme.colors.status.success}15` : `${currentTheme.colors.status.warning}15`}
                            color={prediction.confidence === 'Alta' ? currentTheme.colors.status.success : currentTheme.colors.status.warning}
                                                        borderColor={prediction.confidence === 'Alta' ? `${currentTheme.colors.status.success}30` : `${currentTheme.colors.status.warning}30`}
                            borderRadius="16px"
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
              <Card borderRadius="16px" bg="white"  >
                <CardHeader>
                  <HStack>
                    <Icon as={BarChart2} color={currentTheme.colors.primary} />
                    <Heading size="md" color={currentTheme.colors.text.primary}>Composição do Preço</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    <Doughnut data={priceCompositionData} options={doughnutOptions} />
                  </Box>
                </CardBody>
              </Card>

              {/* Price Trend Chart */}
              <Card borderRadius="16px" bg="white"  >
                <CardHeader>
                  <HStack>
                    <Icon as={TrendingUpIcon} color={currentTheme.colors.primary} />
                    <Heading size="md" color={currentTheme.colors.text.primary}>Tendência de Preços</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Box h="300px">
                    <Line data={priceTrendData} options={chartOptions} />
                  </Box>
                </CardBody>
              </Card>
            </Grid>

            {/* Impact Factors */}
            <Card borderRadius="16px" bg="white"  >
              <CardHeader>
                <HStack>
                  <Icon as={FaChartLine} color={currentTheme.colors.primary} />
                  <Heading size="md" color={currentTheme.colors.text.primary}>Fatores de Impacto no Preço</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
                  {impactFactors.map((factor, index) => (
                    <Card borderRadius="16px" key={index} bg="white"  >
                      <CardBody textAlign="center" p={4}>
                        <Icon as={factor.icon} boxSize={8} color={currentTheme.colors.primary} mb={2} />
                        <Text fontSize="sm" fontWeight="bold" mb={1} color={currentTheme.colors.text.primary}>{factor.label}</Text>
                        <Text fontSize="2xl" fontWeight="bold" color={currentTheme.colors.primary}>
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
            <Card borderRadius="16px" bg="white"   position="sticky" top={4}>
              <CardHeader>
                <Flex align="center">
                  <HStack>
                    <Icon as={FileText} color={currentTheme.colors.primary} />
                    <Heading size="md" color={currentTheme.colors.text.primary}>Notícias do Mercado</Heading>
                  </HStack>
                  <Spacer />
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Icon as={BsArrowRepeat} />}
                    color={currentTheme.colors.text.secondary}
                    _hover={{ bg: currentTheme.colors.background.secondary }}
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
                        bg={currentTheme.colors.background.secondary} 
                         
                                                cursor="pointer"
                        transition="all 0.3s"
                        _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}>
                        <CardBody>
                          <HStack spacing={2} mb={2}>
                            {getImpactIcon(news.impact)}
                            <Text fontWeight="bold" fontSize="sm" flex={1} color={currentTheme.colors.text.primary}>
                              {news.title}
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color={currentTheme.colors.text.secondary} mb={3}>
                            {news.description}
                          </Text>
                          <Flex justify="space-between" align="center">
                            <Badge
                              bg={
                                news.priority === 'Alta' ? `${currentTheme.colors.status.success}15` :
                                news.priority === 'Média' ? `${currentTheme.colors.status.warning}15` :
                                `${currentTheme.colors.status.error}15`
                              }
                              color={
                                news.priority === 'Alta' ? currentTheme.colors.status.success :
                                news.priority === 'Média' ? currentTheme.colors.status.warning :
                                currentTheme.colors.status.error
                              }
                                                            borderColor={
                                news.priority === 'Alta' ? `${currentTheme.colors.status.success}30` :
                                news.priority === 'Média' ? `${currentTheme.colors.status.warning}30` :
                                `${currentTheme.colors.status.error}30`
                              }
                              borderRadius="16px"
                              px={2.5}
                              py={0.5}
                              fontSize="xs"
                              fontWeight="500"
                            >
                              {news.priority}
                            </Badge>
                            <Text fontSize="xs" color={currentTheme.colors.text.secondary}>
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