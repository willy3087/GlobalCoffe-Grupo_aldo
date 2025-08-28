import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatusPill from '../components/common/StatusPill';
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
  Badge,
  Icon,
  Flex,
  Spacer,
  Divider,
  Button,
  SimpleGrid,
  Alert,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  List,
  ListItem,
  ListIcon,
  Progress,
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
import { 
  FaCoffee, 
  FaThermometerHalf, 
  FaBox, 
  FaGlobeAmericas, 
  FaDollarSign, 
  FaChartLine,
  FaHandshake,
  FaUserTie,
  FaTruck,
  FaShieldAlt,
  FaCalculator,
  FaBell,
  FaLightbulb,
  FaClock,
  FaExternalLinkAlt,
  FaDownload,
  FaPrint,
  FaShare,
  FaCalendarAlt,
  FaMapMarkedAlt,
  FaWhatsapp,
  FaEnvelope,
  FaCheckCircle,
} from 'react-icons/fa';
import { BarChart2, FileText, Shield } from 'react-feather';

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

const Negocios2: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const [hedge, setHedge] = useState(30);
  const [quantidade, setQuantidade] = useState(1000);
  const [qualidade, setQualidade] = useState('tipo2');
  const [canal, setCanal] = useState('cooperativa');
  const { isOpen: isCalculatorOpen, onOpen: onCalculatorOpen, onClose: onCalculatorClose } = useDisclosure();
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
  const { isOpen: isAlertsOpen, onOpen: onAlertsOpen, onClose: onAlertsClose } = useDisclosure();
  const toast = useToast();

  // Estados para configuração de alertas
  const [alertPrecoMin, setAlertPrecoMin] = useState(620);
  const [alertPrecoMax, setAlertPrecoMax] = useState(680);
  const [alertVolatilidade, setAlertVolatilidade] = useState(25);
  const [alertClima, setAlertClima] = useState(true);
  const [alertNoticias, setAlertNoticias] = useState(true);
  const [alertConab, setAlertConab] = useState(false);
  const [emailAlertas, setEmailAlertas] = useState(true);
  const [whatsappAlertas, setWhatsappAlertas] = useState(false);
  const [frequenciaAlertas, setFrequenciaAlertas] = useState('imediato');

  const calcularPrecoFinal = () => {
    const precoBase = 650;
    const ajusteQualidade = qualidade === 'tipo2' ? 1.0 : qualidade === 'tipo4' ? 0.95 : qualidade === 'tipo6' ? 0.90 : 0.85;
    const comissaoCanal = canal === 'cooperativa' ? 0.005 : canal === 'corretor' ? 0.0075 : 0;
    
    const precoAjustado = precoBase * ajusteQualidade;
    const comissao = precoAjustado * comissaoCanal;
    const precoLiquido = precoAjustado - comissao;
    const valorTotal = (quantidade / 60) * precoLiquido;
    const valorComHedge = valorTotal * (hedge / 100);
    
    return { precoAjustado, comissao, precoLiquido, valorTotal, valorComHedge };
  };

  // KPIs principais - do KPIsProdutor original + complementares
  const kpisPrincipais = [
    { titulo: "Preço Médio Hoje", valor: "R$ 650,00", variacao: "+3,5%", icone: FaDollarSign, cor: "green", destaque: true, descricao: "Cotação atual" },
    { titulo: "Tipo mais Valorizado", valor: "Tipo 2", variacao: "Premium +5%", icone: FaCoffee, cor: "purple", descricao: "Melhor qualidade" },
    { titulo: "Melhor Canal", valor: "Cooperativa", variacao: "Menor comissão", icone: FaHandshake, cor: "blue", descricao: "Maior segurança" },
    { titulo: "Clima Safra", valor: "Favorável", variacao: "80% probabilidade", icone: FaThermometerHalf, cor: "teal", descricao: "Condições ideais" },
  ];

  // KPIs complementares
  const kpisComplementares = [
    { titulo: "Estoque Mundial", valor: "158M sacas", variacao: "-2.1%", icone: FaBox, cor: "orange", descricao: "Tendência baixa" },
    { titulo: "Taxa USD/BRL", valor: "R$ 5.12", variacao: "+0.8%", icone: FaDollarSign, cor: "green", descricao: "Favorável export" },
    { titulo: "Volatilidade", valor: "24.3%", variacao: "+8.2%", icone: FaChartLine, cor: "red", descricao: "Risco elevado" },
    { titulo: "Produção Global", valor: "175M sacas", variacao: "+4.5%", icone: FaGlobeAmericas, cor: "green", descricao: "Safra recorde" },
    { titulo: "Frete Interno", valor: "R$ 85/saca", variacao: "+2.1%", icone: FaTruck, cor: "blue", descricao: "Por 200km" },
  ];

  // Cenários do KPIsProdutor original
  const cenarios = [
    { nome: "Otimista", variacao: "+15%", preco: "R$ 747,50", probabilidade: 25, cor: "green" },
    { nome: "Realista", variacao: "+5%", preco: "R$ 682,50", probabilidade: 60, cor: "blue" },
    { nome: "Pessimista", variacao: "-10%", preco: "R$ 585,00", probabilidade: 15, cor: "red" },
  ];

  // Canais de comercialização
  const canais = [
    {
      nome: 'Cooperativa',
      seguranca: 95,
      assistencia: 100,
      precos: 85,
      comissao: '0,5%',
      color: 'green',
      icon: FaHandshake
    },
    {
      nome: 'Corretor',
      seguranca: 75,
      assistencia: 60,
      precos: 90,
      comissao: '0,5-1%',
      color: 'blue',
      icon: FaUserTie
    }
  ];

  // Fatores de impacto
  const fatoresImpacto = [
    { nome: 'Produção', valor: 45, icon: FaCoffee, gradient: 'linear(to-r, pink.200, orange.200)', dotColor: '#f56565' },
    { nome: 'Logística', valor: 20, icon: FaTruck, gradient: 'linear(to-r, blue.200, cyan.300)', dotColor: '#4299e1' },
    { nome: 'Mercado', valor: 12, icon: FaChartLine, gradient: 'linear(to-r, purple.200, pink.200)', dotColor: '#9f7aea' },
    { nome: 'Clima', valor: 15, icon: FaThermometerHalf, gradient: 'linear(to-r, teal.200, blue.200)', dotColor: '#38b2ac' },
    { nome: 'Taxas', valor: 8, icon: FaShieldAlt, gradient: 'linear(to-r, gray.200, purple.200)', dotColor: '#718096' },
  ];

  // Dados do gráfico de evolução de preços - simplificado
  const priceChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Tipo 2 (Premium)',
        data: [650, 655, 660, 665, 680, 675, 690, 695, 700, 705, 710, 715],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Tipo 6 (Regular)',
        data: [520, 525, 530, 535, 550, 545, 560, 565, 570, 575, 580, 585],
        borderColor: '#6b7280',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const distributionChartData = {
    labels: ['Cooperativa', 'Corretor', 'Exportação', 'Indústria'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          '#9ae6b4', // green (Cooperativa)
          '#76e4f7', // blue/cyan (Corretor)  
          '#fed7af', // orange (Exportação)
          '#c6b2ff', // purple (Indústria)
        ],
        borderWidth: 3,
        borderColor: currentTheme.colors.background.primary,
        borderRadius: 8,
        spacing: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          color: currentTheme.colors.text.primary,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#6b7280',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            return `${context[0].label}`;
          },
          label: function(context: any) {
            return `${context.dataset.label}: R$ ${(context.parsed.y || 0).toFixed(2)}/saca`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        position: 'left' as const,
        ticks: {
          color: currentTheme.colors.text.secondary,
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return `R$ ${value}`;
          },
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: currentTheme.colors.text.secondary,
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };


  return (
    <Box>
      <PageHeader 
        title="Central de Negócios" 
        subtitle="Análise completa para decisões estratégicas de venda"
        icon={BarChart2}
      />
      <Container maxW="container.2xl" py={4}>
        <VStack spacing={4} align="stretch">
          {/* KPI Grid - Layout Horizontal Completo */}
          <SimpleGrid columns={{ base: 3, md: 6, lg: 9 }} spacing={4} mb={4}>
            {[...kpisPrincipais, ...kpisComplementares].map((kpi, index) => (
              <Card 
                key={index} 
                borderRadius="16px"
                bg={currentTheme.colors.background.primary} 
                 
                
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.3s"
              >
                <CardBody p={4}>
                  <Stat textAlign="center">
                    <Icon as={kpi.icone} boxSize={6} color={currentTheme.colors.primary} mb={2} />
                    <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary} noOfLines={2}>{kpi.titulo}</StatLabel>
                    <StatNumber fontSize="md" color={currentTheme.colors.text.primary} fontWeight="bold">{kpi.valor}</StatNumber>
                    <StatHelpText fontSize="xs" mb={1}>
                      {kpi.variacao && (
                        <StatusPill variant="neutral" size="sm">{kpi.variacao}</StatusPill>
                      )}
                    </StatHelpText>
                    <Text fontSize="xs" color={currentTheme.colors.text.secondary} noOfLines={1}>
                      {kpi.descricao}
                    </Text>
                  </Stat>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <Grid templateColumns={{ base: '1fr', lg: '2.6fr 0.6fr' }} gap={4}>
            {/* Main Content Area */}
            <GridItem>

              {/* Simulação de Cenários e Evolução de Preços */}
              <Grid templateColumns={{ base: '1fr', xl: '1.2fr 0.8fr' }} gap={4} mb={4}>
                <Card borderRadius="16px" bg="white">
                  <CardHeader>
                    <Flex align="center">
                      <HStack>
                        <Icon as={BarChart2} color={currentTheme.colors.primary} />
                        <Heading size="md" color={currentTheme.colors.text.primary}>Simulação de Cenários - Próximos 30 dias</Heading>
                      </HStack>
                      <Spacer />
                      <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="xs">Atualizado</Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                      {cenarios.map((cenario, index) => (
                        <Card 
                          key={index} 
                          bg={`${cenario.cor}.50`} 
                          borderWidth={2} 
                          borderColor={`${cenario.cor}.200`}
                          borderRadius="16px"
                          transition="all 0.3s"
                        >
                          <CardBody>
                            <Text fontWeight="bold" mb={4} color={currentTheme.colors.text.primary} textAlign="center">{cenario.nome}</Text>
                            
                            <VStack spacing={3} align="stretch">
                              <Box textAlign="center">
                                <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Variação</Text>
                                <StatusPill variant={cenario.cor === 'green' ? 'success' : cenario.cor === 'red' ? 'error' : 'warning'} size="md">{cenario.variacao}</StatusPill>
                              </Box>
                              
                              <Box textAlign="center">
                                <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Preço Estimado</Text>
                                <Text fontSize="xl" fontWeight="bold" color={`${cenario.cor}.600`}>
                                  {cenario.preco}
                                </Text>
                              </Box>
                              
                              <Box>
                                <HStack justify="space-between" mb={1}>
                                  <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Probabilidade</Text>
                                  <Text fontSize="sm" fontWeight="bold">{cenario.probabilidade}%</Text>
                                </HStack>
                                <SegmentedBar 
                                  data={[
                                    {
                                      name: cenario.nome,
                                      value: cenario.probabilidade,
                                      gradient: cenario.cor === 'green' ? 'linear(to-r, green.200, green.300)' : 
                                               cenario.cor === 'blue' ? 'linear(to-r, blue.200, blue.300)' :
                                               'linear(to-r, red.200, red.300)',
                                      dotColor: cenario.cor === 'green' ? '#48bb78' : cenario.cor === 'blue' ? '#4299e1' : '#f56565',
                                      completed: true
                                    },
                                    {
                                      name: 'Restante',
                                      value: 100 - cenario.probabilidade,
                                      gradient: 'linear(to-r, gray.100, gray.200)',
                                      dotColor: '#cbd5e0',
                                      completed: false
                                    }
                                  ]}
                                  height="20px"
                                  showDots={false}
                                  showLabels={false}
                                />
                              </Box>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </Grid>
                    <Alert status="warning" mt={4} borderRadius="16px">
                      <AlertIcon />
                      <Box>
                        <Text fontWeight="bold">Recomendação de Hedge:</Text>
                        <Text fontSize="sm">
                          Proteja 30-50% da produção devido à volatilidade esperada no período.
                        </Text>
                      </Box>
                    </Alert>
                  </CardBody>
                </Card>

                {/* Evolução de Preços */}
                <Card borderRadius="16px" bg="white">
                  <CardHeader>
                    <Flex align="center">
                      <HStack>
                        <Icon as={FaChartLine} color={currentTheme.colors.primary} />
                        <Heading size="md" color={currentTheme.colors.text.primary}>Evolução de Preços</Heading>
                      </HStack>
                      <Spacer />
                      <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="xs">6 meses</Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      <Line data={priceChartData} options={chartOptions} />
                    </Box>
                  </CardBody>
                </Card>
              </Grid>

              {/* Canais de Comercialização e Distribuição por Canais */}
              <Grid templateColumns={{ base: '1fr', xl: '1.2fr 0.8fr' }} gap={4} mb={4}>
                <Card borderRadius="16px" bg="white">
                  <CardHeader>
                    <Flex align="center">
                      <HStack>
                        <Icon as={FaHandshake} color={currentTheme.colors.primary} />
                        <Heading size="md" color={currentTheme.colors.text.primary}>Canais de Comercialização</Heading>
                      </HStack>
                      <Spacer />
                      <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="xs">Disponível</Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      {canais.map((canal, index) => (
                        <Card borderRadius="16px" key={index} bg="white"  >
                          <CardBody>
                            <VStack spacing={4} align="stretch">
                              <Flex align="center" justify="center">
                                <Icon as={canal.icon} boxSize={8} color={`${canal.color}.500`} />
                                <VStack ml={4} align="start" spacing={1}>
                                  <Text fontWeight="bold" color={currentTheme.colors.text.primary}>{canal.nome}</Text>
                                  <StatusPill variant={canal.color === 'green' ? 'success' : canal.color === 'red' ? 'error' : 'info'}>Comissão: {canal.comissao}</StatusPill>
                                </VStack>
                              </Flex>
                              
                              <Box>
                                <HStack justify="space-between" mb={1}>
                                  <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Segurança</Text>
                                  <Text fontSize="sm" fontWeight="bold">{canal.seguranca}%</Text>
                                </HStack>
                                <SegmentedBar 
                                  data={[
                                    {
                                      name: 'Segurança',
                                      value: canal.seguranca,
                                      gradient: canal.color === 'green' ? 'linear(to-r, green.200, green.300)' : 'linear(to-r, blue.200, blue.300)',
                                      dotColor: canal.color === 'green' ? '#48bb78' : '#4299e1',
                                      completed: true
                                    },
                                    {
                                      name: 'Restante',
                                      value: 100 - canal.seguranca,
                                      gradient: 'linear(to-r, gray.100, gray.200)',
                                      dotColor: '#cbd5e0',
                                      completed: false
                                    }
                                  ]}
                                  height="20px"
                                  showDots={false}
                                  showLabels={false}
                                />
                              </Box>
                              
                              <Box>
                                <HStack justify="space-between" mb={1}>
                                  <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Assistência</Text>
                                  <Text fontSize="sm" fontWeight="bold">{canal.assistencia}%</Text>
                                </HStack>
                                <SegmentedBar 
                                  data={[
                                    {
                                      name: 'Assistência',
                                      value: canal.assistencia,
                                      gradient: canal.color === 'green' ? 'linear(to-r, green.200, green.300)' : 'linear(to-r, blue.200, blue.300)',
                                      dotColor: canal.color === 'green' ? '#48bb78' : '#4299e1',
                                      completed: true
                                    },
                                    {
                                      name: 'Restante',
                                      value: 100 - canal.assistencia,
                                      gradient: 'linear(to-r, gray.100, gray.200)',
                                      dotColor: '#cbd5e0',
                                      completed: false
                                    }
                                  ]}
                                  height="20px"
                                  showDots={false}
                                  showLabels={false}
                                />
                              </Box>
                              
                              <Box>
                                <HStack justify="space-between" mb={1}>
                                  <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Preços Competitivos</Text>
                                  <Text fontSize="sm" fontWeight="bold">{canal.precos}%</Text>
                                </HStack>
                                <SegmentedBar 
                                  data={[
                                    {
                                      name: 'Preços',
                                      value: canal.precos,
                                      gradient: canal.color === 'green' ? 'linear(to-r, green.200, green.300)' : 'linear(to-r, blue.200, blue.300)',
                                      dotColor: canal.color === 'green' ? '#48bb78' : '#4299e1',
                                      completed: true
                                    },
                                    {
                                      name: 'Restante',
                                      value: 100 - canal.precos,
                                      gradient: 'linear(to-r, gray.100, gray.200)',
                                      dotColor: '#cbd5e0',
                                      completed: false
                                    }
                                  ]}
                                  height="20px"
                                  showDots={false}
                                  showLabels={false}
                                />
                              </Box>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </Grid>
                  </CardBody>
                </Card>

                {/* Distribuição por Canais */}
                <Card borderRadius="16px" bg="white">
                  <CardHeader>
                    <Flex align="center">
                      <HStack>
                        <Icon as={FaHandshake} color={currentTheme.colors.primary} />
                        <Heading size="md" color={currentTheme.colors.text.primary}>Distribuição por Canais</Heading>
                      </HStack>
                      <Spacer />
                      <Badge bg={currentTheme.colors.status.info + '10'} color={currentTheme.colors.status.info}  borderColor={currentTheme.colors.status.info + '40'} borderRadius="16px" fontSize="xs">Atual</Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      <Doughnut data={distributionChartData} options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            display: true,
                            position: 'bottom' as const,
                            align: 'center' as const,
                            labels: {
                              usePointStyle: true,
                              pointStyle: 'circle',
                              padding: 20,
                              color: currentTheme.colors.text.primary,
                              font: {
                                size: 12,
                                weight: 'bold' as const,
                              },
                            },
                          },
                        },
                        layout: {
                          padding: {
                            bottom: 16,
                          },
                        },
                        cutout: '50%',
                      }} />
                    </Box>
                  </CardBody>
                </Card>
              </Grid>

              {/* Comparativo de Mercados */}
              <Card borderRadius="16px" bg="white" mb={4}>
                <CardHeader>
                  <Flex align="center">
                    <HStack>
                      <Icon as={FaGlobeAmericas} color={currentTheme.colors.primary} />
                      <Heading size="md" color={currentTheme.colors.text.primary}>Comparativo de Mercados</Heading>
                    </HStack>
                    <Spacer />
                    <Badge bg={currentTheme.colors.status.info + '10'} color={currentTheme.colors.status.info}  borderColor={currentTheme.colors.status.info + '40'} borderRadius="16px" fontSize="xs">Análise</Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Tabs variant="enclosed" colorScheme="blue">
                    <TabList>
                      <Tab>Interno vs Externo</Tab>
                      <Tab>Preços por Bolsa</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Card borderRadius="16px" bg="orange.50" borderColor="orange.200"  overflow="hidden">
                            <CardHeader>
                              <Heading size="sm" color="orange.700">Mercado Interno</Heading>
                            </CardHeader>
                            <CardBody>
                              <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Volume:</Text>
                                  <Text fontSize="sm" fontWeight="bold">15 mi sacas</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Preço Médio:</Text>
                                  <Text fontSize="sm" fontWeight="bold">R$ 645,00</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Tendência:</Text>
                                  <Badge colorScheme="green">+2,5%</Badge>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                          <Card borderRadius="16px" bg="teal.50" borderColor="teal.200"  overflow="hidden">
                            <CardHeader>
                              <Heading size="sm" color="teal.700">Mercado Externo</Heading>
                            </CardHeader>
                            <CardBody>
                              <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Volume:</Text>
                                  <Text fontSize="sm" fontWeight="bold">25 mi sacas</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Preço Médio:</Text>
                                  <Text fontSize="sm" fontWeight="bold">R$ 680,00</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Tendência:</Text>
                                  <Badge colorScheme="green">+4,0%</Badge>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        </SimpleGrid>
                      </TabPanel>
                      <TabPanel>
                        <Table size="sm" variant="striped">
                          <Thead>
                            <Tr>
                              <Th>Bolsa/Mercado</Th>
                              <Th isNumeric>Preço (R$/saca)</Th>
                              <Th isNumeric>Variação</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            <Tr>
                              <Td>BM&F Bovespa</Td>
                              <Td isNumeric>652,00</Td>
                              <Td isNumeric color="green.600">+3,2%</Td>
                            </Tr>
                            <Tr>
                              <Td>ICE Futures NY</Td>
                              <Td isNumeric>678,50</Td>
                              <Td isNumeric color="green.600">+4,5%</Td>
                            </Tr>
                            <Tr>
                              <Td>CEPEA/ESALQ</Td>
                              <Td isNumeric>645,00</Td>
                              <Td isNumeric color="green.600">+2,8%</Td>
                            </Tr>
                            <Tr>
                              <Td>Spot Local</Td>
                              <Td isNumeric>640,00</Td>
                              <Td isNumeric color="red.600">-0,5%</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>

              {/* Instrumentos de Proteção */}
              <Card borderRadius="16px" bg="white" mb={4}>
                <CardHeader>
                  <Flex align="center">
                    <HStack>
                      <Icon as={Shield} color={currentTheme.colors.primary} />
                      <Heading size="md" color={currentTheme.colors.text.primary}>Instrumentos de Proteção</Heading>
                    </HStack>
                    <Spacer />
                    <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="xs">Estratégias</Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Tabs variant="enclosed" colorScheme="blue">
                    <TabList>
                      <Tab>Contratos</Tab>
                      <Tab>Estratégias</Tab>
                      <Tab>Recomendações</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Card borderRadius="16px" bg="purple.50" borderColor="purple.200" >
                            <CardHeader>
                              <Heading size="sm" color="purple.700">BMF (Brasil) - ICF</Heading>
                            </CardHeader>
                            <CardBody>
                              <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Vencimento:</Text>
                                  <Badge>Mar/24</Badge>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Lote mínimo:</Text>
                                  <Text fontSize="sm" fontWeight="bold">100 sacas</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Margem:</Text>
                                  <Text fontSize="sm" fontWeight="bold">R$ 2.500</Text>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                          <Card borderRadius="16px" bg="indigo.50" borderColor="indigo.200" >
                            <CardHeader>
                              <Heading size="sm" color="indigo.700">NY (EUA) - KC</Heading>
                            </CardHeader>
                            <CardBody>
                              <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Vencimento:</Text>
                                  <Badge>May/24</Badge>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Lote mínimo:</Text>
                                  <Text fontSize="sm" fontWeight="bold">375 sacas</Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Margem:</Text>
                                  <Text fontSize="sm" fontWeight="bold">US$ 1.800</Text>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        </SimpleGrid>
                      </TabPanel>
                      <TabPanel>
                        <VStack spacing={4} align="stretch">
                          <Card borderRadius="16px">
                            <CardBody>
                              <Heading size="sm" mb={3}>Contratos Futuros</Heading>
                              <HStack justify="space-between" mb={2}>
                                <Text fontSize="sm">Eficácia na proteção:</Text>
                                <Text fontSize="sm" fontWeight="bold">75%</Text>
                              </HStack>
                              <Progress value={75} colorScheme="green" mb={3} />
                              <List spacing={1}>
                                <ListItem fontSize="sm">
                                  <ListIcon as={FaCheckCircle} color="green.500" />
                                  Trava preços futuros
                                </ListItem>
                                <ListItem fontSize="sm">
                                  <ListIcon as={FaCheckCircle} color="green.500" />
                                  Reduz volatilidade
                                </ListItem>
                                <ListItem fontSize="sm">
                                  <ListIcon as={FaCheckCircle} color="green.500" />
                                  Garantia de venda
                                </ListItem>
                              </List>
                            </CardBody>
                          </Card>
                          <Card borderRadius="16px">
                            <CardBody>
                              <Heading size="sm" mb={3}>Opções de Venda</Heading>
                              <HStack justify="space-between" mb={2}>
                                <Text fontSize="sm">Eficácia na proteção:</Text>
                                <Text fontSize="sm" fontWeight="bold">60%</Text>
                              </HStack>
                              <Progress value={60} colorScheme="blue" mb={3} />
                              <List spacing={1}>
                                <ListItem fontSize="sm">
                                  <ListIcon as={FaCheckCircle} color="blue.500" />
                                  Proteção de preço mínimo
                                </ListItem>
                                <ListItem fontSize="sm">
                                  <ListIcon as={FaCheckCircle} color="blue.500" />
                                  Mantém potencial de alta
                                </ListItem>
                                <ListItem fontSize="sm">
                                  <ListIcon as={FaCheckCircle} color="blue.500" />
                                  Flexibilidade na execução
                                </ListItem>
                              </List>
                            </CardBody>
                          </Card>
                        </VStack>
                      </TabPanel>
                      <TabPanel>
                        <Alert status="info" borderRadius="16px">
                          <AlertIcon />
                          <Box>
                            <Text fontWeight="bold">Recomendação Personalizada:</Text>
                            <Text fontSize="sm" mt={2}>
                              Para seu perfil e momento de mercado, recomendamos:
                            </Text>
                            <List spacing={1} mt={2}>
                              <ListItem fontSize="sm">
                                <ListIcon as={FaCheckCircle} color="blue.500" />
                                30% da produção em contratos futuros
                              </ListItem>
                              <ListItem fontSize="sm">
                                <ListIcon as={FaCheckCircle} color="blue.500" />
                                20% em opções de venda
                              </ListItem>
                              <ListItem fontSize="sm">
                                <ListIcon as={FaCheckCircle} color="blue.500" />
                                50% no mercado spot para capturar oportunidades
                              </ListItem>
                            </List>
                          </Box>
                        </Alert>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>

              {/* Componentes do Preço */}
              <Card borderRadius="16px" bg="white">
                <CardHeader>
                  <Flex align="center">
                    <HStack>
                      <Icon as={FileText} color={currentTheme.colors.primary} />
                      <Heading size="md" color={currentTheme.colors.text.primary}>Fatores de Impacto no Preço</Heading>
                    </HStack>
                    <Spacer />
                    <Badge bg={currentTheme.colors.status.info + '10'} color={currentTheme.colors.status.info}  borderColor={currentTheme.colors.status.info + '40'} borderRadius="16px" fontSize="xs">Análise</Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6}>
                    {/* Barra Segmentada de Fatores de Impacto */}
                    <SegmentedBar 
                      variant="impact"
                      data={fatoresImpacto.map(fator => ({
                        name: fator.nome,
                        value: fator.valor,
                        gradient: fator.gradient,
                        dotColor: fator.dotColor,
                        completed: true
                      }))}
                      height="60px"
                      showDots={true}
                      showLabels={true}
                      showTracked={true}
                    />

                    {/* Insight Box */}
                    <Box 
                      w="full" 
                      bg={currentTheme.colors.background.tertiary} 
                      p={4} 
                      borderRadius="16px"
                    >
                      <HStack spacing={2}>
                        <Icon as={FaLightbulb} color={currentTheme.colors.primary} />
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                          <Text as="span" fontWeight="bold" color={currentTheme.colors.text.primary}>
                            Produção (45%)
                          </Text> é o maior impacto no preço. Monitore clima e safras para otimizar vendas.
                        </Text>
                      </HStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            {/* Sidebar */}
            <GridItem>
              <VStack spacing={4}>
                {/* Ações Rápidas */}
                <Card borderRadius="16px" bg="white" w="full">
                  <CardHeader pb={2}>
                    <Text fontWeight="bold" color={currentTheme.colors.text.primary} fontSize="md">Ações Rápidas</Text>
                  </CardHeader>
                  <CardBody pt={2}>
                    <VStack spacing={3}>
                      <Button
                        leftIcon={<FaCalculator />}
                        colorScheme="blue"
                        size="sm"
                        w="full"
                        onClick={onCalculatorOpen}
                        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                      >
                        Calculadora de Preços
                      </Button>
                      <Button
                        leftIcon={<FaChartLine />}
                        variant="outline"
                        colorScheme="green"
                        size="sm"
                        w="full"
                        onClick={onReportOpen}
                      >
                        Relatório Detalhado
                      </Button>
                      <Button
                        leftIcon={<FaBell />}
                        variant="outline"
                        colorScheme="orange"
                        size="sm"
                        w="full"
                        onClick={onAlertsOpen}
                      >
                        Configurar Alertas
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Resumo Executivo */}
                <Card borderRadius="16px" bg="white" w="full">
                  <CardHeader pb={2}>
                    <Text fontWeight="bold" color={currentTheme.colors.text.primary} fontSize="md">Resumo Executivo</Text>
                  </CardHeader>
                  <CardBody pt={2}>
                    <VStack spacing={3} align="stretch">
                      <Box>
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Status do Mercado</Text>
                        <StatusPill variant="success" size="sm">Em Alta</StatusPill>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Recomendação</Text>
                        <Text fontSize="sm" fontWeight="bold" color={currentTheme.colors.text.primary}>Venda Parcial</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Melhor Momento</Text>
                        <Text fontSize="sm" color={currentTheme.colors.text.primary}>Próximas 2 semanas</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Próxima Revisão</Text>
                        <Text fontSize="sm" color={currentTheme.colors.text.primary}>Em 7 dias</Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
                
                {/* Alertas Importantes */}
                <Card borderRadius="16px" bg="white" w="full">
                  <CardHeader pb={2}>
                    <Text fontWeight="bold" color={currentTheme.colors.text.primary} fontSize="md">Alertas Importantes</Text>
                  </CardHeader>
                  <CardBody pt={2}>
                    <VStack spacing={2} align="stretch">
                      <Alert status="success" size="sm" borderRadius="16px">
                        <AlertIcon />
                        <Text fontSize="xs">Meta de preço atingida</Text>
                      </Alert>
                      <Alert status="warning" size="sm" borderRadius="16px">
                        <AlertIcon />
                        <Text fontSize="xs">Chuva prevista para próxima semana</Text>
                      </Alert>
                      <Alert status="info" size="sm" borderRadius="16px">
                        <AlertIcon />
                        <Text fontSize="xs">Novo relatório CONAB disponível</Text>
                      </Alert>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Dicas do Dia - Estilo Post-it */}
                <Card 
                  bg="yellow.100" 
                  borderWidth={0} 
                  w="full"
                  boxShadow="lg"
                  transform="rotate(-1deg)"
                  _hover={{ transform: 'rotate(0deg)' }}
                  transition="transform 0.3s"
                  position="relative"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: '-5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '20px',
                    bg: 'yellow.300',
                    borderRadius: "24px",
                    opacity: 0.8
                  }}
                >
                  <CardHeader pb={2}>
                    <HStack justify="center">
                      <Icon as={FaLightbulb} color="yellow.600" />
                      <Text fontWeight="bold" color="yellow.800" fontSize="md" fontFamily="cursive">Dicas do Dia</Text>
                    </HStack>
                  </CardHeader>
                  <CardBody pt={2}>
                    <VStack spacing={3} align="start">
                      <Text fontSize="sm" color="yellow.900" fontWeight="medium" lineHeight="1.4">
                        • Diversifique canais de venda para reduzir riscos
                      </Text>
                      <Text fontSize="sm" color="yellow.900" fontWeight="medium" lineHeight="1.4">
                        • Monitore clima semanalmente para decisões de hedge
                      </Text>
                      <Text fontSize="sm" color="yellow.900" fontWeight="medium" lineHeight="1.4">
                        • Contratos futuros protegem 30% da safra
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Status dos Mercados */}
                <Card borderRadius="16px" bg="white" w="full">
                  <CardHeader pb={2}>
                    <HStack>
                      <Icon as={FaClock} color={currentTheme.colors.primary} />
                      <Text fontWeight="bold" color={currentTheme.colors.text.primary} fontSize="md">Status dos Mercados</Text>
                    </HStack>
                  </CardHeader>
                  <CardBody pt={2}>
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={currentTheme.colors.text.primary}>BM&F Bovespa</Text>
                        <StatusPill variant="success" size="sm">Aberto</StatusPill>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={currentTheme.colors.text.primary}>ICE Futures NY</Text>
                        <StatusPill variant="success" size="sm">Aberto</StatusPill>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={currentTheme.colors.text.primary}>CEPEA/ESALQ</Text>
                        <StatusPill variant="warning" size="sm">Fechando</StatusPill>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={currentTheme.colors.text.primary}>Spot Local</Text>
                        <StatusPill variant="warning" size="sm">Fechando</StatusPill>
                      </HStack>
                      <Divider />
                      <Text fontSize="xs" color={currentTheme.colors.text.secondary} textAlign="center">
                        Última atualização: há 2 minutos
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Container>

      {/* Modal de Configuração de Alertas */}
      <Modal isOpen={isAlertsOpen} onClose={onAlertsClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Icon as={FaBell} mr={2} />
            Configuração de Alertas
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6}>
              {/* Alertas de Preço */}
              <Card borderRadius="16px" w="full" bg="orange.50" borderColor="orange.200" >
                <CardHeader>
                  <Heading size="md">💰 Alertas de Preço</Heading>
                </CardHeader>
                <CardBody>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <Box>
                      <FormControl>
                        <FormLabel>Preço Mínimo (R$/saca):</FormLabel>
                        <NumberInput
                          value={alertPrecoMin}
                          onChange={(_, value) => setAlertPrecoMin(value)}
                          min={500}
                          max={800}
                          step={5}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <Text fontSize="xs" color="gray.600" mt={1}>
                          Alerta quando preço ficar abaixo deste valor
                        </Text>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl>
                        <FormLabel>Preço Máximo (R$/saca):</FormLabel>
                        <NumberInput
                          value={alertPrecoMax}
                          onChange={(_, value) => setAlertPrecoMax(value)}
                          min={600}
                          max={900}
                          step={5}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <Text fontSize="xs" color="gray.600" mt={1}>
                          Alerta quando preço ficar acima deste valor
                        </Text>
                      </FormControl>
                    </Box>
                  </Grid>

                  <Box mt={4}>
                    <FormControl>
                      <FormLabel>Volatilidade Máxima (%):</FormLabel>
                      <Slider
                        value={alertVolatilidade}
                        onChange={setAlertVolatilidade}
                        min={10}
                        max={50}
                        step={1}
                      >
                        <SliderTrack>
                          <SliderFilledTrack bg="orange.500" />
                        </SliderTrack>
                        <SliderThumb boxSize={6}>
                          <Box color="orange.500">{alertVolatilidade}%</Box>
                        </SliderThumb>
                      </Slider>
                      <Text fontSize="xs" color="gray.600" mt={1}>
                        Alerta quando volatilidade ultrapassar {alertVolatilidade}%
                      </Text>
                    </FormControl>
                  </Box>
                </CardBody>
              </Card>

              {/* Tipos de Alertas */}
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={4} w="full">
                <Card borderRadius="16px" bg="blue.50" borderColor="blue.200" >
                  <CardHeader>
                    <Heading size="md">📊 Tipos de Alertas</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="alert-clima" mb="0" flex="1">
                          <HStack>
                            <Icon as={FaThermometerHalf} color="blue.500" />
                            <Text>Alertas Climáticos</Text>
                          </HStack>
                        </FormLabel>
                        <Switch
                          id="alert-clima"
                          isChecked={alertClima}
                          onChange={(e) => setAlertClima(e.target.checked)}
                          colorScheme="blue"
                        />
                      </FormControl>
                      <Text fontSize="xs" color="gray.600" ml={6}>
                        Chuva, seca, geada, temperatura extrema
                      </Text>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="alert-noticias" mb="0" flex="1">
                          <HStack>
                            <Icon as={FileText} color="green.500" />
                            <Text>Notícias do Mercado</Text>
                          </HStack>
                        </FormLabel>
                        <Switch
                          id="alert-noticias"
                          isChecked={alertNoticias}
                          onChange={(e) => setAlertNoticias(e.target.checked)}
                          colorScheme="green"
                        />
                      </FormControl>
                      <Text fontSize="xs" color="gray.600" ml={6}>
                        Notícias relevantes sobre café e commodities
                      </Text>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="alert-conab" mb="0" flex="1">
                          <HStack>
                            <Icon as={FaChartLine} color="purple.500" />
                            <Text>Relatórios CONAB</Text>
                          </HStack>
                        </FormLabel>
                        <Switch
                          id="alert-conab"
                          isChecked={alertConab}
                          onChange={(e) => setAlertConab(e.target.checked)}
                          colorScheme="purple"
                        />
                      </FormControl>
                      <Text fontSize="xs" color="gray.600" ml={6}>
                        Novos relatórios da Companhia Nacional de Abastecimento
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                <Card borderRadius="16px" bg="green.50" borderColor="green.200" >
                  <CardHeader>
                    <Heading size="md">📱 Canais de Notificação</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="email-alerts" mb="0" flex="1">
                          <HStack>
                            <Icon as={FaEnvelope} color="blue.500" />
                            <Text>E-mail</Text>
                          </HStack>
                        </FormLabel>
                        <Switch
                          id="email-alerts"
                          isChecked={emailAlertas}
                          onChange={(e) => setEmailAlertas(e.target.checked)}
                          colorScheme="blue"
                        />
                      </FormControl>
                      <Text fontSize="xs" color="gray.600" ml={6}>
                        joao.silva@email.com
                      </Text>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="whatsapp-alerts" mb="0" flex="1">
                          <HStack>
                            <Icon as={FaWhatsapp} color="green.500" />
                            <Text>WhatsApp</Text>
                          </HStack>
                        </FormLabel>
                        <Switch
                          id="whatsapp-alerts"
                          isChecked={whatsappAlertas}
                          onChange={(e) => setWhatsappAlertas(e.target.checked)}
                          colorScheme="green"
                        />
                      </FormControl>
                      <Text fontSize="xs" color="gray.600" ml={6}>
                        (35) 99999-9999
                      </Text>

                      <Box>
                        <FormLabel>Frequência dos Alertas:</FormLabel>
                        <Select
                          value={frequenciaAlertas}
                          onChange={(e) => setFrequenciaAlertas(e.target.value)}
                        >
                          <option value="imediato">Imediato</option>
                          <option value="diario">Resumo Diário (8h)</option>
                          <option value="semanal">Resumo Semanal (Segunda 8h)</option>
                        </Select>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </Grid>

              {/* Personalização */}
              <Card borderRadius="16px" w="full" bg="purple.50" borderColor="purple.200" >
                <CardHeader>
                  <Heading size="md">⚙️ Personalização Avançada</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <FormLabel>Palavras-chave Personalizadas:</FormLabel>
                      <Textarea
                        placeholder="Ex: geada, seca, exportação, dólar, etc."
                        size="sm"
                        resize="none"
                        rows={3}
                      />
                      <Text fontSize="xs" color="gray.600" mt={1}>
                        Monitore notícias com palavras-chave específicas (separadas por vírgula)
                      </Text>
                    </Box>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold" fontSize="sm">Horário Preferido</Text>
                        <Select size="sm" defaultValue="08:00">
                          <option value="06:00">06:00</option>
                          <option value="08:00">08:00</option>
                          <option value="12:00">12:00</option>
                          <option value="18:00">18:00</option>
                        </Select>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold" fontSize="sm">Fim de Semana</Text>
                        <Select size="sm" defaultValue="nao">
                          <option value="sim">Receber alertas</option>
                          <option value="nao">Não receber</option>
                        </Select>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold" fontSize="sm">Prioridade</Text>
                        <Select size="sm" defaultValue="media">
                          <option value="baixa">Baixa</option>
                          <option value="media">Média</option>
                          <option value="alta">Alta</option>
                        </Select>
                      </VStack>
                    </Grid>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={2}>
              <Button variant="ghost" size="sm">
                Teste de Alerta
              </Button>
              <Button variant="ghost" mr={3} onClick={onAlertsClose}>
                Cancelar
              </Button>
              <Button 
                colorScheme="orange" 
                leftIcon={<FaBell />}
                onClick={() => {
                  toast({
                    title: "Alertas configurados!",
                    description: "Suas configurações foram salvas com sucesso.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                  onAlertsClose();
                }}
              >
                Salvar Configurações
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal do Relatório Detalhado */}
      <Modal isOpen={isReportOpen} onClose={onReportClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Icon as={FaChartLine} mr={2} />
            Relatório Detalhado de Mercado
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6}>
              {/* Header do Relatório */}
              <Card borderRadius="16px" w="full" bg="blue.50" borderColor="blue.200" >
                <CardBody>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={4}>
                    <VStack align="start">
                      <Text fontSize="sm" color="gray.600">Data do Relatório</Text>
                      <HStack>
                        <Icon as={FaCalendarAlt} color="blue.500" />
                        <Text fontWeight="bold">{new Date().toLocaleDateString('pt-BR')}</Text>
                      </HStack>
                    </VStack>
                    <VStack align="start">
                      <Text fontSize="sm" color="gray.600">Período Analisado</Text>
                      <Text fontWeight="bold">Últimos 30 dias</Text>
                    </VStack>
                    <VStack align="start">
                      <Text fontSize="sm" color="gray.600">Região</Text>
                      <HStack>
                        <Icon as={FaMapMarkedAlt} color="blue.500" />
                        <Text fontWeight="bold">Sul de Minas</Text>
                      </HStack>
                    </VStack>
                  </Grid>
                </CardBody>
              </Card>

              {/* Resumo Executivo */}
              <Card borderRadius="16px" w="full">
                <CardHeader>
                  <Heading size="md">📊 Resumo Executivo</Heading>
                </CardHeader>
                <CardBody>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
                    <Card borderRadius="16px" bg="green.50" borderColor="green.200" >
                      <CardBody textAlign="center" p={4}>
                        <Icon as={FaDollarSign} boxSize={6} color="green.500" mb={2} />
                        <Text fontSize="sm" color="gray.600">Preço Médio</Text>
                        <Text fontSize="xl" fontWeight="bold" color="green.600">R$ 650,00</Text>
                        <StatusPill variant="positive" size="sm">+3.5%</StatusPill>
                      </CardBody>
                    </Card>
                    <Card borderRadius="16px" bg="blue.50" borderColor="blue.200" >
                      <CardBody textAlign="center" p={4}>
                        <Icon as={FaChartLine} boxSize={6} color="blue.500" mb={2} />
                        <Text fontSize="sm" color="gray.600">Volatilidade</Text>
                        <Text fontSize="xl" fontWeight="bold" color="blue.600">24.3%</Text>
                        <StatusPill variant="warning" size="sm">Alta</StatusPill>
                      </CardBody>
                    </Card>
                    <Card borderRadius="16px" bg="purple.50" borderColor="purple.200" >
                      <CardBody textAlign="center" p={4}>
                        <Icon as={FaBox} boxSize={6} color="purple.500" mb={2} />
                        <Text fontSize="sm" color="gray.600">Estoque</Text>
                        <Text fontSize="xl" fontWeight="bold" color="purple.600">158M sacas</Text>
                        <StatusPill variant="negative" size="sm">-2.1%</StatusPill>
                      </CardBody>
                    </Card>
                    <Card borderRadius="16px" bg="orange.50" borderColor="orange.200" >
                      <CardBody textAlign="center" p={4}>
                        <Icon as={FaGlobeAmericas} boxSize={6} color="orange.500" mb={2} />
                        <Text fontSize="sm" color="gray.600">Produção</Text>
                        <Text fontSize="xl" fontWeight="bold" color="orange.600">175M sacas</Text>
                        <StatusPill variant="positive" size="sm">+4.5%</StatusPill>
                      </CardBody>
                    </Card>
                  </Grid>
                </CardBody>
              </Card>

              {/* Análise de Preços */}
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={4} w="full">
                <Card>
                  <CardHeader>
                    <Heading size="md">📈 Análise de Preços</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Text fontWeight="bold" mb={2}>Faixa de Preços (30 dias)</Text>
                        <HStack justify="space-between">
                          <VStack align="start">
                            <Text fontSize="sm" color="green.600">Máximo</Text>
                            <Text fontWeight="bold">R$ 675,00</Text>
                          </VStack>
                          <VStack align="center">
                            <Text fontSize="sm" color="blue.600">Médio</Text>
                            <Text fontWeight="bold">R$ 650,00</Text>
                          </VStack>
                          <VStack align="end">
                            <Text fontSize="sm" color="red.600">Mínimo</Text>
                            <Text fontWeight="bold">R$ 620,00</Text>
                          </VStack>
                        </HStack>
                      </Box>
                      <Divider />
                      <Box>
                        <Text fontWeight="bold" mb={2}>Por Tipo de Café</Text>
                        <VStack spacing={2}>
                          <HStack w="full" justify="space-between">
                            <Text>Tipo 2 (Premium)</Text>
                            <StatusPill variant="success">R$ 650,00</StatusPill>
                          </HStack>
                          <HStack w="full" justify="space-between">
                            <Text>Tipo 4 (Padrão)</Text>
                            <StatusPill variant="info">R$ 617,50</StatusPill>
                          </HStack>
                          <HStack w="full" justify="space-between">
                            <Text>Tipo 6 (Regular)</Text>
                            <StatusPill variant="warning">R$ 585,00</StatusPill>
                          </HStack>
                        </VStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">🏪 Análise de Canais</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Text fontWeight="bold" mb={2}>Performance por Canal</Text>
                        <VStack spacing={3}>
                          <Box w="full">
                            <HStack justify="space-between" mb={1}>
                              <HStack>
                                <Icon as={FaHandshake} color="green.500" />
                                <Text>Cooperativa</Text>
                              </HStack>
                              <Text fontWeight="bold">95%</Text>
                            </HStack>
                            <SegmentedBar 
                              data={[
                                {
                                  name: 'Cooperativa',
                                  value: 95,
                                  gradient: 'linear(to-r, green.200, green.300)',
                                  dotColor: '#48bb78',
                                  completed: true
                                },
                                {
                                  name: 'Restante',
                                  value: 5,
                                  gradient: 'linear(to-r, gray.100, gray.200)',
                                  dotColor: '#cbd5e0',
                                  completed: false
                                }
                              ]}
                              height="20px"
                              showDots={false}
                              showLabels={false}
                            />
                            <Text fontSize="xs" color="gray.600" mt={1}>Comissão: 0,5% • Segurança: Alta</Text>
                          </Box>
                          <Box w="full">
                            <HStack justify="space-between" mb={1}>
                              <HStack>
                                <Icon as={FaUserTie} color="blue.500" />
                                <Text>Corretor</Text>
                              </HStack>
                              <Text fontWeight="bold">78%</Text>
                            </HStack>
                            <SegmentedBar 
                              data={[
                                {
                                  name: 'Corretor',
                                  value: 78,
                                  gradient: 'linear(to-r, blue.200, blue.300)',
                                  dotColor: '#4299e1',
                                  completed: true
                                },
                                {
                                  name: 'Restante',
                                  value: 22,
                                  gradient: 'linear(to-r, gray.100, gray.200)',
                                  dotColor: '#cbd5e0',
                                  completed: false
                                }
                              ]}
                              height="20px"
                              showDots={false}
                              showLabels={false}
                            />
                            <Text fontSize="xs" color="gray.600" mt={1}>Comissão: 0,75% • Flexibilidade: Alta</Text>
                          </Box>
                          <Box w="full">
                            <HStack justify="space-between" mb={1}>
                              <HStack>
                                <Icon as={FaTruck} color="purple.500" />
                                <Text>Exportação</Text>
                              </HStack>
                              <Text fontWeight="bold">85%</Text>
                            </HStack>
                            <SegmentedBar 
                              data={[
                                {
                                  name: 'Exportação',
                                  value: 85,
                                  gradient: 'linear(to-r, purple.200, purple.300)',
                                  dotColor: '#9f7aea',
                                  completed: true
                                },
                                {
                                  name: 'Restante',
                                  value: 15,
                                  gradient: 'linear(to-r, gray.100, gray.200)',
                                  dotColor: '#cbd5e0',
                                  completed: false
                                }
                              ]}
                              height="20px"
                              showDots={false}
                              showLabels={false}
                            />
                            <Text fontSize="xs" color="gray.600" mt={1}>Preços Premium • Contratos longos</Text>
                          </Box>
                        </VStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </Grid>

              {/* Recomendações */}
              <Card borderRadius="16px" w="full" bg="yellow.50" borderColor="yellow.200" >
                <CardHeader>
                  <Heading size="md">💡 Recomendações Estratégicas</Heading>
                </CardHeader>
                <CardBody>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                    <VStack align="start" spacing={2}>
                      <StatusPill variant="success">OPORTUNIDADE</StatusPill>
                      <Text fontWeight="bold">Venda Parcial</Text>
                      <Text fontSize="sm" color="gray.700">
                        Preços estão em alta. Recomenda-se venda de 30-40% do estoque nas próximas 2 semanas.
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <StatusPill variant="warning">ATENÇÃO</StatusPill>
                      <Text fontWeight="bold">Proteção Cambial</Text>
                      <Text fontSize="sm" color="gray.700">
                        Alta volatilidade do USD/BRL. Considere hedge cambial para 25% da produção.
                      </Text>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <StatusPill variant="info">ESTRATÉGIA</StatusPill>
                      <Text fontWeight="bold">Diversificação</Text>
                      <Text fontSize="sm" color="gray.700">
                        Misture canais: 60% cooperativa, 25% corretor, 15% exportação direta.
                      </Text>
                    </VStack>
                  </Grid>
                </CardBody>
              </Card>

              {/* Cronograma */}
              <Card borderRadius="16px" w="full">
                <CardHeader>
                  <Heading size="md">📅 Cronograma Recomendado</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    <HStack>
                      <StatusPill variant="success">Semana 1-2</StatusPill>
                      <Text>Venda de 30% via cooperativa (Tipo 2 Premium)</Text>
                    </HStack>
                    <HStack>
                      <StatusPill variant="info">Semana 3-4</StatusPill>
                      <Text>Análise de mercado e negociação com corretores</Text>
                    </HStack>
                    <HStack>
                      <StatusPill variant="info">Mês 2</StatusPill>
                      <Text>Contratos futuros para restante da produção</Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={2}>
              <Button leftIcon={<FaPrint />} variant="ghost" size="sm">
                Imprimir
              </Button>
              <Button leftIcon={<FaDownload />} variant="ghost" size="sm">
                Baixar PDF
              </Button>
              <Button leftIcon={<FaShare />} variant="ghost" size="sm">
                Compartilhar
              </Button>
              <Button variant="ghost" mr={3} onClick={onReportClose}>
                Fechar
              </Button>
              <Button 
                colorScheme="green" 
                leftIcon={<FaExternalLinkAlt />}
                onClick={() => {
                  toast({
                    title: "Relatório salvo!",
                    description: "O relatório foi salvo nos seus documentos.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              >
                Salvar Relatório
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal da Calculadora de Preços */}
      <Modal isOpen={isCalculatorOpen} onClose={onCalculatorClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Icon as={FaCalculator} mr={2} />
            Calculadora de Preços - Simulação Personalizada
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Box w="full">
                <Text mb={2} fontWeight="bold">Quantidade (kg):</Text>
                <NumberInput
                  value={quantidade}
                  onChange={(_, value) => setQuantidade(value)}
                  min={100}
                  max={100000}
                  step={100}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              
              <Box w="full">
                <Text mb={2} fontWeight="bold">Qualidade do Café:</Text>
                <Select value={qualidade} onChange={(e) => setQualidade(e.target.value)}>
                  <option value="tipo2">Tipo 2 (Premium)</option>
                  <option value="tipo4">Tipo 4 (Padrão)</option>
                  <option value="tipo6">Tipo 6 (Regular)</option>
                  <option value="tipo8">Tipo 8 (Básico)</option>
                </Select>
              </Box>
              
              <Box w="full">
                <Text mb={2} fontWeight="bold">Canal de Venda:</Text>
                <Select value={canal} onChange={(e) => setCanal(e.target.value)}>
                  <option value="cooperativa">Cooperativa (0,5% comissão)</option>
                  <option value="corretor">Corretor (0,75% comissão)</option>
                  <option value="direto">Venda Direta (sem comissão)</option>
                </Select>
              </Box>
              
              <Box w="full">
                <Text mb={2} fontWeight="bold">Hedge (% da produção): {hedge}%</Text>
                <Slider value={hedge} onChange={setHedge} min={0} max={100} step={5}>
                  <SliderTrack>
                    <SliderFilledTrack bg="blue.500" />
                  </SliderTrack>
                  <SliderThumb boxSize={6}>
                    <Box color="blue.500">%</Box>
                  </SliderThumb>
                </Slider>
              </Box>

              <Divider />

              <Card borderRadius="16px" w="full" bg="gray.50">
                <CardBody>
                  <Heading size="sm" mb={4}>Resultados da Simulação:</Heading>
                  <VStack spacing={3} align="stretch">
                    {(() => {
                      const { precoAjustado, comissao, precoLiquido, valorTotal, valorComHedge } = calcularPrecoFinal();
                      return (
                        <>
                          <HStack justify="space-between">
                            <Text>Preço por Saca (60kg):</Text>
                            <Text fontWeight="bold" fontSize="lg">R$ {precoAjustado.toFixed(2)}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text>Comissão:</Text>
                            <Text color="red.500">- R$ {comissao.toFixed(2)}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text>Preço Líquido:</Text>
                            <Text fontWeight="bold" color="green.600">R$ {precoLiquido.toFixed(2)}</Text>
                          </HStack>
                          <Divider />
                          <HStack justify="space-between">
                            <Text fontWeight="bold">Valor Total:</Text>
                            <Text fontWeight="bold" fontSize="xl" color="blue.600">
                              R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text>Valor com Hedge ({hedge}%):</Text>
                            <Text fontWeight="bold" color="purple.600">
                              R$ {valorComHedge.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </Text>
                          </HStack>
                        </>
                      );
                    })()}
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCalculatorClose}>
              Fechar
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<FaExternalLinkAlt />}
              onClick={() => {
                toast({
                  title: "Proposta de venda gerada!",
                  description: "Você pode agora negociar com os compradores.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
              }}
            >
              Gerar Proposta de Venda
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Negocios2;