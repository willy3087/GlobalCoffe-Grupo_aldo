import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import PageHeader from '../components/PageHeader';
import { Coffee } from 'react-feather';
import { FaCoffee, FaCalculator, FaChartLine, FaDollarSign, FaGlobeAmericas, FaCheckCircle, FaChild, FaDatabase } from 'react-icons/fa';
import { BarChart2, Package, Settings, TrendingUp as TrendingUpIcon, Truck, Clipboard, Shield } from 'react-feather';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { MdTrendingUp, MdTrendingDown, MdTrendingFlat } from 'react-icons/md';
import { useThemeContext } from '../contexts/ThemeContext';

const Features: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const borderColor = currentTheme.colors.border.primary;
  const subCardBg = 'white';

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Estados para calculadora
  const [quantidade, setQuantidade] = useState(100);
  const [qualidade, setQualidade] = useState<'tipo2' | 'tipo4' | 'tipo6' | 'tipo8'>('tipo6');
  const [canal, setCanal] = useState<'cooperativa' | 'corretor' | 'direto'>('cooperativa');
  const [hedge, setHedge] = useState(30);

  // KPIs Principais
  const kpisPrincipais = [
    {
      icon: FaCoffee,
      label: 'Preço Médio Hoje',
      value: 'R$ 1.800',
      change: '',
      trend: 'up',
      color: currentTheme.colors.status.success
    },
    {
      icon: FaChartLine,
      label: 'Tipo mais Valorizado',
      value: 'Tipo 6',
      change: '',
      trend: 'up',
      color: currentTheme.colors.status.warning
    },
    {
      icon: FaDollarSign,
      label: 'Melhor Canal',
      value: 'Cooperativa',
      change: '',
      trend: 'up',
      color: currentTheme.colors.status.info
    },
    {
      icon: FaArrowTrendUp,
      label: 'Clima Safra',
      value: 'Normal',
      change: '',
      trend: 'up',
      color: currentTheme.colors.primary
    }
  ];

  // Dados para calculadora
  const precoBase = 1842;
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

  // Cálculo do preço final
  const calcularPrecoFinal = () => {
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

  const resultado = calcularPrecoFinal();

  // Simulação de cenários
  const cenarios = [
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

  return (
    <Box>
      <PageHeader
        title="Central de Análise e Simulação"
        subtitle="KPIs, Calculadora de Preços e Simulação de Vendas"
        icon={Coffee}
      />
      <Container maxW="container.2xl" py={4}>
        <Grid templateColumns={{ base: '1fr', lg: '4fr 1fr' }} gap={4}>
          {/* Área Principal */}
          <GridItem>
            {/* KPIs Principais */}
            <Card borderRadius="16px" bg="white"   mb={6}>
              <CardHeader>
                <HStack>
          <Icon as={BarChart2} color={currentTheme.colors.primary} />
          <Heading size="md">KPIs Principais do Mercado</Heading>
        </HStack>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                  {kpisPrincipais.map((kpi, idx) => (
                    <Card borderRadius="16px" key={idx} bg="white"  >
                      <CardBody textAlign="center">
                        <Icon as={kpi.icon} boxSize={8} color={kpi.color} mb={4} />
                        <Stat>
                          <StatLabel fontSize="sm">{kpi.label}</StatLabel>
                          <StatNumber fontSize="xl">{kpi.value}</StatNumber>
                          <StatHelpText>
                            <StatArrow type={kpi.trend === 'up' ? 'increase' : 'decrease'} />
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
            <Card borderRadius="16px" bg="white"   mb={6}>
              <CardHeader>
                <Flex align="center">
                  <Icon as={FaChartLine} mr={4} color={currentTheme.colors.accent} />
                  <Heading size="md">Simulação de Cenários - Próximos 30 dias</Heading>
                </Flex>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  {cenarios.map((cenario, idx) => {
                    const getCorCenario = (cor: string) => {
                      switch(cor) {
                        case 'green': return currentTheme.colors.status.success;
                        case 'blue': return currentTheme.colors.status.info;
                        case 'red': return currentTheme.colors.status.error;
                        default: return currentTheme.colors.primary;
                      }
                    };
                    const corTema = getCorCenario(cenario.cor);
                    
                    return (
                      <Card borderRadius="16px" key={idx} bg="white" borderWidth={2} borderColor={corTema}>
                        <CardBody textAlign="center">
                          <Badge bg={corTema + '10'} color={corTema}  borderColor={corTema + '40'} borderRadius="16px" mb={3} fontSize="sm">
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
                              borderRadius="16px"
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
            <Card borderRadius="16px" bg="white"   mb={6}>
              <CardHeader>
                <HStack>
          <Icon as={Package} color={currentTheme.colors.primary} />
          <Heading size="md">Canais de Comercialização</Heading>
        </HStack>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Card borderRadius="16px" bg="white"  >
                    <CardBody>
                      <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="sm">Via Cooperativa</Heading>
                        <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="lg" px={3} py={1}>
                          65%
                        </Badge>
                      </Flex>
                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Segurança na Venda</Text>
                          <Progress value={90} bg={currentTheme.colors.background.secondary} borderRadius="16px" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.success }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Assistência Técnica</Text>
                          <Progress value={95} bg={currentTheme.colors.background.secondary} borderRadius="16px" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.success }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Preços Competitivos</Text>
                          <Progress value={85} bg={currentTheme.colors.background.secondary} borderRadius="16px" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.success }}} />
                        </Box>
                        <Divider />
                        <Flex justify="space-between" align="center">
                          <Text fontSize="sm" fontWeight="medium">Comissão:</Text>
                          <Badge bg={currentTheme.colors.status.info + '10'} color={currentTheme.colors.status.info}  borderColor={currentTheme.colors.status.info + '40'} borderRadius="16px" variant="subtle">0,5%</Badge>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                  <Card borderRadius="16px" bg="white"  >
                    <CardBody>
                      <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="sm">Via Corretor</Heading>
                        <Badge bg={currentTheme.colors.status.warning + '10'} color={currentTheme.colors.status.warning}  borderColor={currentTheme.colors.status.warning + '40'} borderRadius="16px" fontSize="lg" px={3} py={1}>
                          35%
                        </Badge>
                      </Flex>
                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Flexibilidade</Text>
                          <Progress value={95} bg={currentTheme.colors.background.secondary} borderRadius="16px" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.warning }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Agilidade na Venda</Text>
                          <Progress value={90} bg={currentTheme.colors.background.secondary} borderRadius="16px" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.warning }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Negociação Direta</Text>
                          <Progress value={80} bg={currentTheme.colors.background.secondary} borderRadius="16px" size="sm" sx={{'& > div': { bg: currentTheme.colors.status.warning }}} />
                        </Box>
                        <Divider />
                        <Flex justify="space-between" align="center">
                          <Text fontSize="sm" fontWeight="medium">Comissão:</Text>
                          <Badge bg={currentTheme.colors.status.info + '10'} color={currentTheme.colors.status.info}  borderColor={currentTheme.colors.status.info + '40'} borderRadius="16px" variant="subtle">0,5-1%</Badge>
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
                      A cooperativa oferece maior segurança e suporte técnico, enquanto o corretor proporciona mais flexibilidade e agilidade nas negociações. Escolha baseada no seu perfil de risco.
                    </AlertDescription>
                  </Box>
                </Alert>
              </CardBody>
            </Card>

            {/* Comparativo de Mercados */}
            <Card borderRadius="16px" bg="white"   mb={6}>
              <CardHeader>
                <HStack>
          <Icon as={TrendingUpIcon} color={currentTheme.colors.primary} />
          <Heading size="md">Comparativo de Mercados</Heading>
        </HStack>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {/* Mercado Interno */}
                  <Card borderRadius="16px" bg="white" borderWidth={2} borderColor={currentTheme.colors.status.success}>
                    <CardHeader pb={2}>
                      <Flex align="center" justify="space-between">
                        <HStack>
                          <Icon as={FaCoffee} color={currentTheme.colors.status.success} />
                          <Heading size="sm">Mercado Interno</Heading>
                        </HStack>
                        <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="md" px={3} py={1}>
                          40%
                        </Badge>
                      </Flex>
                    </CardHeader>
                    <CardBody pt={2}>
                      <VStack align="stretch" spacing={4}>
                        <Stat>
                          <StatLabel fontSize="sm">Volume Negociado</StatLabel>
                          <StatNumber fontSize="lg">25% do total</StatNumber>
                          <StatHelpText>
                            <StatArrow type="increase" />
                            +3% vs mês anterior
                          </StatHelpText>
                        </Stat>
                        <Divider />
                        <Stat>
                          <StatLabel fontSize="sm">Preço Médio</StatLabel>
                          <StatNumber fontSize="xl" color={currentTheme.colors.status.success}>R$ 1.750</StatNumber>
                          <StatHelpText>
                            Por saca de 60kg
                          </StatHelpText>
                        </Stat>
                        <Divider />
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>Principais Destinos:</Text>
                          <VStack align="stretch" spacing={1}>
                            <HStack>
                              <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={3} />
                              <Text fontSize="sm">São Paulo (35%)</Text>
                            </HStack>
                            <HStack>
                              <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={3} />
                              <Text fontSize="sm">Minas Gerais (30%)</Text>
                            </HStack>
                            <HStack>
                              <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={3} />
                              <Text fontSize="sm">Rio de Janeiro (20%)</Text>
                            </HStack>
                          </VStack>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Mercado Externo */}
                  <Card borderRadius="16px" bg="white" borderWidth={2} borderColor={currentTheme.colors.status.info}>
                    <CardHeader pb={2}>
                      <Flex align="center" justify="space-between">
                        <HStack>
                          <Icon as={FaGlobeAmericas} color={currentTheme.colors.status.info} />
                          <Heading size="sm">Mercado Externo</Heading>
                        </HStack>
                        <Badge bg={currentTheme.colors.status.info + '10'} color={currentTheme.colors.status.info}  borderColor={currentTheme.colors.status.info + '40'} borderRadius="16px" fontSize="md" px={3} py={1}>
                          60%
                        </Badge>
                      </Flex>
                    </CardHeader>
                    <CardBody pt={2}>
                      <VStack align="stretch" spacing={4}>
                        <Stat>
                          <StatLabel fontSize="sm">Volume Exportado</StatLabel>
                          <StatNumber fontSize="lg">7M sacas</StatNumber>
                          <StatHelpText>
                            <StatArrow type="increase" />
                            +5% vs ano anterior
                          </StatHelpText>
                        </Stat>
                        <Divider />
                        <Stat>
                          <StatLabel fontSize="sm">Preço Médio</StatLabel>
                          <StatNumber fontSize="xl" color={currentTheme.colors.status.info}>R$ 1.850</StatNumber>
                          <StatHelpText>
                            Por saca de 60kg
                          </StatHelpText>
                        </Stat>
                        <Divider />
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={2}>Principais Destinos:</Text>
                          <VStack align="stretch" spacing={1}>
                            <HStack>
                              <Icon as={FaCheckCircle} color={currentTheme.colors.status.info} boxSize={3} />
                              <Text fontSize="sm">EUA (28%)</Text>
                            </HStack>
                            <HStack>
                              <Icon as={FaCheckCircle} color={currentTheme.colors.status.info} boxSize={3} />
                              <Text fontSize="sm">Alemanha (18%)</Text>
                            </HStack>
                            <HStack>
                              <Icon as={FaCheckCircle} color={currentTheme.colors.status.info} boxSize={3} />
                              <Text fontSize="sm">Itália (15%)</Text>
                            </HStack>
                          </VStack>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Tabela Comparativa de Preços */}
                <Box mt={6}>
                  <Heading size="sm" mb={4}>Comparativo de Preços por Mercado</Heading>
                  <Card borderRadius="16px" bg="white"  >
                    <CardBody p={0}>
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={0}>
                        <Box p={4} borderRight={{ base: "none", md: "1px" }} borderBottom={{ base: "1px", lg: "none" }} >
                          <VStack align="stretch" spacing={2}>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">BM&F Bovespa</Text>
                            <Text fontSize="xl" fontWeight="bold">R$ 1.245,00</Text>
                            <HStack>
                              <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px">+2.3%</Badge>
                              <HStack spacing={1}>
                                <Icon as={MdTrendingUp} color={currentTheme.colors.status.success} boxSize={4} />
                                <Text fontSize="sm" color={currentTheme.colors.status.success}>Alta</Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Box>
                        <Box p={4} borderRight={{ base: "none", lg: "1px" }} borderBottom={{ base: "1px", md: "none" }} >
                          <VStack align="stretch" spacing={2}>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">ICE Futures NY</Text>
                            <Text fontSize="xl" fontWeight="bold">US$ 245,50</Text>
                            <HStack>
                              <Badge bg={currentTheme.colors.status.error + '10'} color={currentTheme.colors.status.error}  borderColor={currentTheme.colors.status.error + '40'} borderRadius="16px">-1.2%</Badge>
                              <HStack spacing={1}>
                                <Icon as={MdTrendingDown} color={currentTheme.colors.status.error} boxSize={4} />
                                <Text fontSize="sm" color={currentTheme.colors.status.error}>Baixa</Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Box>
                        <Box p={4} borderRight={{ base: "none", md: "1px" }} borderBottom={{ base: "1px", lg: "none" }} >
                          <VStack align="stretch" spacing={2}>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">CEPEA/ESALQ</Text>
                            <Text fontSize="xl" fontWeight="bold">R$ 1.198,00</Text>
                            <HStack>
                              <Badge bg={currentTheme.colors.status.warning + '10'} color={currentTheme.colors.status.warning}  borderColor={currentTheme.colors.status.warning + '40'} borderRadius="16px">+0.8%</Badge>
                              <HStack spacing={1}>
                                <Icon as={MdTrendingFlat} color={currentTheme.colors.status.warning} boxSize={4} />
                                <Text fontSize="sm" color={currentTheme.colors.status.warning}>Estável</Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Box>
                        <Box p={4}>
                          <VStack align="stretch" spacing={2}>
                            <Text fontSize="sm" fontWeight="bold" color="gray.600">Spot Local</Text>
                            <Text fontSize="xl" fontWeight="bold">R$ 1.180,00</Text>
                            <HStack>
                              <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px">+1.5%</Badge>
                              <HStack spacing={1}>
                                <Icon as={MdTrendingUp} color={currentTheme.colors.status.success} boxSize={4} />
                                <Text fontSize="sm" color={currentTheme.colors.status.success}>Alta</Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Box>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                </Box>

                {/* Componentes do Preço */}
                <Box mt={6}>
                  <Heading size="sm" mb={4}>Componentes do Preço (R$/saca)</Heading>
                  <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
                    <Card borderRadius="16px" bg="white"  >
                      <CardBody textAlign="center" p={3}>
                        <Icon as={FaGlobeAmericas} boxSize={6} color={currentTheme.colors.primary} mb={1} />
                        <Text fontSize="lg" fontWeight="bold">45%</Text>
                        <Text fontSize="xs" color="gray.600">Produção</Text>
                      </CardBody>
                    </Card>
                    <Card borderRadius="16px" bg="white"  >
                      <CardBody textAlign="center" p={3}>
                        <Icon as={Truck} boxSize={6} color={currentTheme.colors.primary} mb={1} />
                        <Text fontSize="lg" fontWeight="bold">15%</Text>
                        <Text fontSize="xs" color="gray.600">Logística</Text>
                      </CardBody>
                    </Card>
                    <Card borderRadius="16px" bg="white"  >
                      <CardBody textAlign="center" p={3}>
                        <Icon as={Settings} boxSize={6} color={currentTheme.colors.primary} mb={1} />
                        <Text fontSize="lg" fontWeight="bold">12%</Text>
                        <Text fontSize="xs" color="gray.600">Benefício</Text>
                      </CardBody>
                    </Card>
                    <Card borderRadius="16px" bg="white"  >
                      <CardBody textAlign="center" p={3}>
                        <Icon as={TrendingUpIcon} boxSize={6} color={currentTheme.colors.primary} mb={1} />
                        <Text fontSize="lg" fontWeight="bold">18%</Text>
                        <Text fontSize="xs" color="gray.600">Mercado</Text>
                      </CardBody>
                    </Card>
                    <Card borderRadius="16px" bg="white"  >
                      <CardBody textAlign="center" p={3}>
                        <Icon as={Clipboard} boxSize={6} color={currentTheme.colors.primary} mb={1} />
                        <Text fontSize="lg" fontWeight="bold">10%</Text>
                        <Text fontSize="xs" color="gray.600">Taxas</Text>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </Box>

                {/* Alerta de Oportunidade */}
                <Alert status="info" mt={6} borderRadius="16px" borderLeftWidth={4} borderLeftColor="blue.400">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Oportunidade de Mercado</AlertTitle>
                    <AlertDescription>
                      O mercado externo está pagando R$ 100 a mais por saca comparado ao mercado interno.
                      Considere aumentar sua participação nas exportações através de cooperativas certificadas.
                    </AlertDescription>
                  </Box>
                </Alert>
              </CardBody>
            </Card>

            {/* Instrumentos de Proteção */}
            <Card borderRadius="16px" bg="white"   mb={6}>
              <CardHeader>
                <HStack>
          <Icon as={Shield} color={currentTheme.colors.primary} />
          <Heading size="md">Instrumentos de Proteção</Heading>
        </HStack>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
                  <Card borderRadius="16px" bg="white"  >
                    <CardBody textAlign="center">
                      <VStack spacing={4}>
                        <Text fontSize="sm" color="gray.600" fontWeight="medium">BMF (Brasil)</Text>
                        <Heading size="lg" color={currentTheme.colors.status.info}>ICF</Heading>
                        <Badge bg={currentTheme.colors.status.info + '10'} color={currentTheme.colors.status.info}  borderColor={currentTheme.colors.status.info + '40'} borderRadius="16px" fontSize="md" px={3} py={1}>
                          Contrato Futuro
                        </Badge>
                        <VStack spacing={1} align="stretch" w="100%">
                          <Flex justify="space-between">
                            <Text fontSize="xs" color="gray.600">Vencimento:</Text>
                            <Text fontSize="xs" fontWeight="medium">Mar/24</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontSize="xs" color="gray.600">Lote Mínimo:</Text>
                            <Text fontSize="xs" fontWeight="medium">100 sacas</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontSize="xs" color="gray.600">Margem:</Text>
                            <Text fontSize="xs" fontWeight="medium">R$ 5.000</Text>
                          </Flex>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card borderRadius="16px" bg="white"  >
                    <CardBody textAlign="center">
                      <VStack spacing={4}>
                        <Text fontSize="sm" color="gray.600" fontWeight="medium">NY (EUA)</Text>
                        <Heading size="lg" color={currentTheme.colors.status.success}>KC</Heading>
                        <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="md" px={3} py={1}>
                          Coffee C
                        </Badge>
                        <VStack spacing={1} align="stretch" w="100%">
                          <Flex justify="space-between">
                            <Text fontSize="xs" color="gray.600">Vencimento:</Text>
                            <Text fontSize="xs" fontWeight="medium">May/24</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontSize="xs" color="gray.600">Lote Mínimo:</Text>
                            <Text fontSize="xs" fontWeight="medium">37.500 lbs</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontSize="xs" color="gray.600">Margem:</Text>
                            <Text fontSize="xs" fontWeight="medium">US$ 2.500</Text>
                          </Flex>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card borderRadius="16px" bg="white"  >
                    <CardBody textAlign="center">
                      <VStack spacing={4}>
                        <Text fontSize="sm" color="gray.600" fontWeight="medium">Hedge Médio</Text>
                        <Heading size="lg" color={currentTheme.colors.accent}>30%</Heading>
                        <Badge bg={currentTheme.colors.accent + '10'} color={currentTheme.colors.accent}  borderColor={currentTheme.colors.accent + '40'} borderRadius="16px" fontSize="md" px={3} py={1}>
                          Recomendado
                        </Badge>
                        <VStack spacing={1} align="stretch" w="100%">
                          <Flex justify="space-between">
                            <Text fontSize="xs" color="gray.600">Mínimo:</Text>
                            <Text fontSize="xs" fontWeight="medium">20%</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontSize="xs" color="gray.600">Máximo:</Text>
                            <Text fontSize="xs" fontWeight="medium">50%</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text fontSize="xs" color="gray.600">Prazo:</Text>
                            <Text fontSize="xs" fontWeight="medium">3-6 meses</Text>
                          </Flex>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Indicadores de Proteção */}
                <Box mb={6}>
                  <Heading size="sm" mb={4}>Estratégias de Proteção Disponíveis</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Card borderRadius="16px" bg="white"  >
                      <CardBody>
                        <HStack mb={3}>
                          <Icon as={FaChild} color={currentTheme.colors.status.warning} boxSize={5} />
                          <Text fontWeight="medium">Contratos Futuros</Text>
                        </HStack>
                        <VStack align="stretch" spacing={2}>
                          <Progress value={75} bg={currentTheme.colors.background.secondary} size="sm" borderRadius="16px" sx={{'& > div': { bg: currentTheme.colors.status.warning }}} />
                          <Text fontSize="xs" color="gray.600">75% de eficácia na proteção</Text>
                          <List spacing={1}>
                            <ListItem fontSize="sm">
                              <ListIcon as={FaCheckCircle} color={currentTheme.colors.status.success} />
                              Trava preços futuros
                            </ListItem>
                            <ListItem fontSize="sm">
                              <ListIcon as={FaCheckCircle} color={currentTheme.colors.status.success} />
                              Reduz volatilidade
                            </ListItem>
                            <ListItem fontSize="sm">
                              <ListIcon as={FaCheckCircle} color={currentTheme.colors.status.success} />
                              Garantia de venda
                            </ListItem>
                          </List>
                        </VStack>
                      </CardBody>
                    </Card>

                    <Card borderRadius="16px" bg="white"  >
                      <CardBody>
                        <HStack mb={3}>
                          <Icon as={FaChartLine} color={currentTheme.colors.status.info} boxSize={5} />
                          <Text fontWeight="medium">Opções de Venda</Text>
                        </HStack>
                        <VStack align="stretch" spacing={2}>
                          <Progress value={60} bg={currentTheme.colors.background.secondary} size="sm" borderRadius="16px" sx={{'& > div': { bg: currentTheme.colors.status.info }}} />
                          <Text fontSize="xs" color="gray.600">60% de eficácia na proteção</Text>
                          <List spacing={1}>
                            <ListItem fontSize="sm">
                              <ListIcon as={FaCheckCircle} color={currentTheme.colors.status.success} />
                              Proteção de preço mínimo
                            </ListItem>
                            <ListItem fontSize="sm">
                              <ListIcon as={FaCheckCircle} color={currentTheme.colors.status.success} />
                              Mantém upside
                            </ListItem>
                            <ListItem fontSize="sm">
                              <ListIcon as={FaCheckCircle} color={currentTheme.colors.status.success} />
                              Flexibilidade
                            </ListItem>
                          </List>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </Box>

                <Alert status="info" borderRadius="16px">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Dica de Proteção</AlertTitle>
                    <AlertDescription>
                      Diversifique suas estratégias de hedge utilizando uma combinação de contratos futuros (70%) e opções (30%) para maximizar a proteção mantendo potencial de ganho.
                    </AlertDescription>
                  </Box>
                </Alert>
              </CardBody>
            </Card>

            {/* Fontes de Dados Disponíveis */}
            <Card borderRadius="16px" bg="white"   mb={6}>
              <CardHeader>
                <HStack>
          <Icon as={BarChart2} color={currentTheme.colors.primary} />
          <Heading size="md">Fontes de Dados Disponíveis</Heading>
        </HStack>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                  <Card borderRadius="16px" bg="white"  >
                    <CardBody>
                      <Flex justify="space-between" align="center" mb={4}>
                        <HStack>
                          <Icon as={FaDatabase} color={currentTheme.colors.status.info} boxSize={5} />
                          <Heading size="sm">APIs em Tempo Real</Heading>
                        </HStack>
                        <Badge bg={currentTheme.colors.status.info + '10'} color={currentTheme.colors.status.info}  borderColor={currentTheme.colors.status.info + '40'} borderRadius="16px" fontSize="lg" px={3} py={1}>
                          40%
                        </Badge>
                      </Flex>
                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Cobertura de Dados</Text>
                          <Progress value={85} bg={currentTheme.colors.background.secondary} size="sm" borderRadius="16px" sx={{'& > div': { bg: currentTheme.colors.status.info }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Velocidade de Atualização</Text>
                          <Progress value={95} bg={currentTheme.colors.background.secondary} size="sm" borderRadius="16px" sx={{'& > div': { bg: currentTheme.colors.status.info }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Confiabilidade</Text>
                          <Progress value={90} bg={currentTheme.colors.background.secondary} size="sm" borderRadius="16px" sx={{'& > div': { bg: currentTheme.colors.status.info }}} />
                        </Box>
                        <Divider />
                        <Flex justify="space-between" align="center">
                          <Text fontSize="sm" fontWeight="medium">Atualização:</Text>
                          <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" variant="subtle">5 min</Badge>
                        </Flex>
                        <VStack align="stretch" spacing={1}>
                          <Text fontSize="xs" color="gray.600">Fontes Incluídas:</Text>
                          <HStack>
                            <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={3} />
                            <Text fontSize="xs">Bloomberg</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={3} />
                            <Text fontSize="xs">Reuters</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={3} />
                            <Text fontSize="xs">ICE Futures</Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card borderRadius="16px" bg="white"  >
                    <CardBody>
                      <Flex justify="space-between" align="center" mb={4}>
                        <HStack>
                          <Icon as={FaGlobeAmericas} color={currentTheme.colors.status.success} boxSize={5} />
                          <Heading size="sm">Dados Oficiais</Heading>
                        </HStack>
                        <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="lg" px={3} py={1}>
                          60%
                        </Badge>
                      </Flex>
                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Cobertura de Dados</Text>
                          <Progress value={100} bg={currentTheme.colors.background.secondary} size="sm" borderRadius="16px" sx={{'& > div': { bg: currentTheme.colors.status.success }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Histórico Disponível</Text>
                          <Progress value={95} bg={currentTheme.colors.background.secondary} size="sm" borderRadius="16px" sx={{'& > div': { bg: currentTheme.colors.status.success }}} />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Precisão</Text>
                          <Progress value={98} bg={currentTheme.colors.background.secondary} size="sm" borderRadius="16px" sx={{'& > div': { bg: currentTheme.colors.status.success }}} />
                        </Box>
                        <Divider />
                        <Flex justify="space-between" align="center">
                          <Text fontSize="sm" fontWeight="medium">Atualização:</Text>
                          <Badge bg={currentTheme.colors.status.warning + '10'} color={currentTheme.colors.status.warning}  borderColor={currentTheme.colors.status.warning + '40'} borderRadius="16px" variant="subtle">Diária</Badge>
                        </Flex>
                        <VStack align="stretch" spacing={1}>
                          <Text fontSize="xs" color="gray.600">Fontes Incluídas:</Text>
                          <HStack>
                            <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={3} />
                            <Text fontSize="xs">CONAB</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={3} />
                            <Text fontSize="xs">CEPEA/ESALQ</Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={3} />
                            <Text fontSize="xs">MAPA</Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Indicadores de Disponibilidade */}
                <Box mb={6}>
                  <Heading size="sm" mb={4}>Disponibilidade por Tipo de Informação</Heading>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Card borderRadius="16px" bg="white"  >
                      <CardBody textAlign="center">
                        <VStack spacing={2}>
                          <Text fontSize="sm" color="gray.600" fontWeight="medium">Preços</Text>
                          <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={6} />
                          <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="md" px={3} py={1}>
                            ✓ API
                          </Badge>
                          <Text fontSize="xs" color="gray.600">Tempo real disponível</Text>
                          <Progress value={100} bg={currentTheme.colors.background.secondary} size="xs" w="100%" borderRadius="16px" sx={{'& > div': { bg: currentTheme.colors.status.success }}} />
                        </VStack>
                      </CardBody>
                    </Card>

                    <Card borderRadius="16px" bg="white"  >
                      <CardBody textAlign="center">
                        <VStack spacing={2}>
                          <Text fontSize="sm" color="gray.600" fontWeight="medium">Classificação</Text>
                          <Icon as={FaDatabase} color={currentTheme.colors.status.warning} boxSize={6} />
                          <Badge bg={currentTheme.colors.status.warning + '10'} color={currentTheme.colors.status.warning}  borderColor={currentTheme.colors.status.warning + '40'} borderRadius="16px" fontSize="md" px={3} py={1}>
                            ⚡ Web
                          </Badge>
                          <Text fontSize="xs" color="gray.600">Consulta sob demanda</Text>
                          <Progress value={75} bg={currentTheme.colors.background.secondary} size="xs" w="100%" borderRadius="16px" sx={{'& > div': { bg: currentTheme.colors.status.warning }}} />
                        </VStack>
                      </CardBody>
                    </Card>

                    <Card borderRadius="16px" bg="white"  >
                      <CardBody textAlign="center">
                        <VStack spacing={2}>
                          <Text fontSize="sm" color="gray.600" fontWeight="medium">Clima</Text>
                          <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} boxSize={6} />
                          <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="md" px={3} py={1}>
                            ✓ API
                          </Badge>
                          <Text fontSize="xs" color="gray.600">Atualização horária</Text>
                          <Progress value={100} bg={currentTheme.colors.background.secondary} size="xs" w="100%" borderRadius="16px" sx={{'& > div': { bg: currentTheme.colors.status.success }}} />
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </Box>

                {/* Métricas de Performance */}
                <Box mb={6}>
                  <Heading size="sm" mb={4}>Métricas de Performance das Fontes</Heading>
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
                        <Tr>
                          <Td>API Bloomberg</Td>
                          <Td isNumeric>99.9%</Td>
                          <Td isNumeric>12ms</Td>
                          <Td>
                            <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px">Online</Badge>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>CONAB</Td>
                          <Td isNumeric>98.5%</Td>
                          <Td isNumeric>150ms</Td>
                          <Td>
                            <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px">Online</Badge>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>CEPEA/ESALQ</Td>
                          <Td isNumeric>99.2%</Td>
                          <Td isNumeric>85ms</Td>
                          <Td>
                            <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px">Online</Badge>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td>Weather API</Td>
                          <Td isNumeric>99.7%</Td>
                          <Td isNumeric>45ms</Td>
                          <Td>
                            <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px">Online</Badge>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>

                <Alert status="success" borderRadius="16px">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Integração Completa</AlertTitle>
                    <AlertDescription>
                      Todas as fontes de dados estão operacionais e sincronizadas. Última atualização há 2 minutos.
                      Taxa de sucesso nas últimas 24h: 99.8%
                    </AlertDescription>
                  </Box>
                </Alert>
              </CardBody>
            </Card>

          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <Card borderRadius="16px" bg="white"   position="sticky" top={4}>
              <CardHeader>
                <Heading size="md">Ações Rápidas</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Button leftIcon={<FaCalculator />} bg={currentTheme.colors.primary} color="white" _hover={{ bg: currentTheme.colors.secondary }} onClick={onOpen}>
                    Calculadora de Preços
                  </Button>
                  <Button leftIcon={<FaChartLine />} bg={currentTheme.colors.secondary} color="white" _hover={{ bg: currentTheme.colors.secondaryLight }}>
                    Relatório Detalhado
                  </Button>
                  <Button leftIcon={<FaDollarSign />} bg={currentTheme.colors.secondary} color="white" _hover={{ bg: currentTheme.colors.secondaryLight }}>
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
                  <Box p={3} bg={subCardBg} borderRadius="16px">
                    <HStack>
                      <Icon as={FaCalculator} color={currentTheme.colors.primary} />
                      <Text fontSize="sm">Diversifique canais de venda para reduzir riscos</Text>
                    </HStack>
                  </Box>
                  <Box p={3} bg={subCardBg} borderRadius="16px">
                    <HStack>
                      <Icon as={FaChartLine} color={currentTheme.colors.primary} />
                      <Text fontSize="sm">Monitore clima semanalmente para decisões de hedge</Text>
                    </HStack>
                  </Box>
                  <Box p={3} bg={subCardBg} borderRadius="16px">
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