import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Button,
  Badge,
  Alert,
  AlertIcon,
  Stack,
  Flex,
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
  Grid,
  GridItem,
  VStack,
  HStack,
  Divider,
  List,
  ListItem,
  ListIcon,
  useToast,
  Collapse,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Progress,
} from '@chakra-ui/react';

// Ícones react-icons/fa6 (apenas os que existem)
import {
  FaChartLine,
  FaDollarSign,
  FaArrowTrendUp,
  FaCalculator
} from 'react-icons/fa6';

// Ícones react-icons/fa5 (fallback para ícones que não existem no fa6)
import {
  FaCoffee,
  FaGlobeAmericas,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaBell,
  FaLightbulb,
  FaHandshake,
  FaUserTie,
  FaChartBar,
  FaTruck,
  FaArrowUp as TrendingUpIcon,
  FaBox as Package,
  FaChevronRight as ChevronRight,
  FaChevronDown as ChevronDown,
  FaExclamationCircle as AlertCircle,
  FaInfoCircle as Info,
  FaArrowDown as TrendingDown,
  FaChartLine as Activity,
  FaClock as Clock,
  FaBolt as Zap
} from 'react-icons/fa';
import PageHeader from '@/components/PageHeader';
import { Coffee } from 'react-feather';

const KPIsProdutor: React.FC = () => {
  const [hedge, setHedge] = useState(30);
  const [quantidade, setQuantidade] = useState(1000);
  const [qualidade, setQualidade] = useState('tipo2');
  const [canal, setCanal] = useState('cooperativa');
  const { isOpen: isCalculatorOpen, onOpen: onCalculatorOpen, onClose: onCalculatorClose } = useDisclosure();
  const [showTour, setShowTour] = useState(false);
  const [currentStep] = useState(1);
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
    6: false,
  });
  const toast = useToast();

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('kpis_produtor_visited');
    if (isFirstVisit) {
      setShowTour(true);
      localStorage.setItem('kpis_produtor_visited', 'true');
    }
  }, []);

  const toggleSection = (section: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSimularVenda = (cenario: string) => {
    onCalculatorOpen();
    toast({
      title: `Simulando venda no cenário ${cenario}`,
      description: "Calculadora aberta com valores do cenário selecionado",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

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

  const kpisPrincipais = [
    { titulo: "Preço Médio Hoje", valor: "R$ 650,00", variacao: "+3,5%", descricao: "Cotação atual", icone: FaDollarSign, cor: "green", destaque: true },
    { titulo: "Tipo mais Valorizado", valor: "Tipo 2", variacao: "Premium +5%", descricao: "Melhor qualidade", icone: FaCoffee, cor: "purple" },
    { titulo: "Melhor Canal", valor: "Cooperativa", variacao: "Menor comissão", descricao: "Maior segurança", icone: FaHandshake, cor: "blue" },
    { titulo: "Clima Safra", valor: "Favorável", variacao: "80% probabilidade", descricao: "Condições ideais", icone: FaArrowTrendUp, cor: "teal" },
    { titulo: "Estoque Mundial", valor: "158M sacas", variacao: "-2.1%", descricao: "Tendência baixa", icone: Package, cor: "orange" },
    { titulo: "Taxa USD/BRL", valor: "R$ 5.12", variacao: "+0.8%", descricao: "Favorável export", icone: FaDollarSign, cor: "green" },
    { titulo: "Volatilidade", valor: "24.3%", variacao: "+8.2%", descricao: "Risco elevado", icone: Activity, cor: "red" },
    { titulo: "Produção Global", valor: "175M sacas", variacao: "+4.5%", descricao: "Safra recorde", icone: FaGlobeAmericas, cor: "green" },
    { titulo: "Frete Interno", valor: "R$ 85/saca", variacao: "+2.1%", descricao: "Por 200km", icone: FaTruck, cor: "blue" },
  ];

  const cenarios = [
    { nome: "Otimista", variacao: "+15%", preco: "R$ 747,50", probabilidade: 25, cor: "green", icone: TrendingUpIcon },
    { nome: "Realista", variacao: "+5%", preco: "R$ 682,50", probabilidade: 60, cor: "blue", icone: Activity },
    { nome: "Pessimista", variacao: "-10%", preco: "R$ 585,00", probabilidade: 15, cor: "red", icone: TrendingDown },
  ];


  const TourOverlay = () => (
    showTour && (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        zIndex={9998}
        onClick={() => setShowTour(false)}
      >
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="white"
          p={6}
          borderRadius="16px"
          maxW="500px"
          zIndex={9999}
          onClick={(e) => e.stopPropagation()}
        >
          <Heading size="md" mb={4}>
            <Icon as={FaLightbulb} mr={2} color="yellow.500" />
            Bem-vindo ao Dashboard do Produtor!
          </Heading>
          <Text mb={4}>
            Este dashboard foi otimizado para ajudá-lo a tomar decisões rápidas e estratégicas sobre sua produção de café.
          </Text>
          <Text mb={4} fontWeight="bold">
            Fluxo de decisão recomendado:
          </Text>
          <List spacing={2} mb={4}>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              1. Verifique os KPIs do mercado
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              2. Analise os cenários futuros
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              3. Simule o valor da sua venda
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              4. Compare canais e mercados
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="green.500" />
              5. Configure proteções se necessário
            </ListItem>
          </List>
          <Button colorScheme="blue" onClick={() => setShowTour(false)} w="full">
            Começar a usar
          </Button>
        </Box>
      </Box>
    )
  );

  return (
    <Box overflowX="auto" py={2}>
              <PageHeader
                title="Central de Análise e Simulação"
                subtitle="KPIs, Calculadora de Preços e Simulação de Vendas"
                icon={Coffee}
              />
      <Container maxW="8xl" py={4}>
                  {/* Indicadores de Progresso do Fluxo */}
            
          
        <TourOverlay />
        

        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={4}>
          <GridItem>
            <Stack spacing={4}>
              {/* 1. KPIs Principais - SEMPRE VISÍVEL */}
              <Card borderRadius="16px" borderWidth={2} >
                <CardHeader
                  cursor="pointer"
                  onClick={() => toggleSection(1)}
                  bg={currentStep === 1 ? 'blue.50' : 'white'}
                >
                  <Flex justify="space-between" align="center">
                    <Heading size="md">
                      <Badge colorScheme="blue" mr={2}>1</Badge>
                      <Icon as={FaChartBar} mr={2} />
                      Visão Geral do Mercado - KPIs Principais
                    </Heading>
                    <Icon as={expandedSections[1] ? ChevronDown : ChevronRight} />
                  </Flex>
                </CardHeader>
                <Collapse in={expandedSections[1]} animateOpacity>
                  <CardBody>
                    <SimpleGrid columns={{ base: 2, md: 4, lg: 5, xl: 9 }} spacing={4}>
                      {kpisPrincipais.map((kpi, index) => (
                        <Card
                          key={index}
                          borderRadius="16px"
                          borderWidth={kpi.destaque ? 2 : 1}
                                                    bg={kpi.destaque ? `${kpi.cor}.50` : 'white'}
                          transition="all 0.3s"
                        >
                          <CardBody py={4} px={3}>
                            <Stat textAlign="center">
                              <Icon as={kpi.icone} boxSize={6} color={`${kpi.cor}.500`} mb={2} />
                              <StatLabel fontSize="xs" color="gray.600" noOfLines={2} minH="32px" display="flex" alignItems="center" justifyContent="center">
                                {kpi.titulo}
                              </StatLabel>
                              <StatNumber fontSize="lg" color={`${kpi.cor}.600`} fontWeight="bold">
                                {kpi.valor}
                              </StatNumber>
                              {kpi.variacao && (
                                <StatHelpText fontSize="xs" mb={1}>
                                  <StatArrow type={kpi.variacao.includes('+') ? 'increase' : 'decrease'} />
                                  {kpi.variacao}
                                </StatHelpText>
                              )}
                              {kpi.descricao && (
                                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                  {kpi.descricao}
                                </Text>
                              )}
                            </Stat>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                    <Alert status="info" mt={4} borderRadius="16px">
                      <AlertIcon />
                      <Box>
                        <Text fontWeight="bold">Momento do Mercado:</Text>
                        <Text fontSize="sm">
                          Mercado em alta com preços favoráveis. Considere venda parcial da produção.
                        </Text>
                      </Box>
                    </Alert>
                  </CardBody>
                </Collapse>
              </Card>

              {/* 2. Simulação de Cenários - PRIORIDADE ALTA */}
              <Card borderRadius="16px" borderWidth={2} >
                <CardHeader
                  cursor="pointer"
                  onClick={() => toggleSection(2)}
                  bg={currentStep === 2 ? 'blue.50' : 'white'}
                >
                  <Flex justify="space-between" align="center">
                    <Heading size="md">
                      <Badge colorScheme="blue" mr={2}>2</Badge>
                      <Icon as={FaChartLine} mr={2} />
                      Simulação de Cenários - Próximos 30 dias
                    </Heading>
                    <Icon as={expandedSections[2] ? ChevronDown : ChevronRight} />
                  </Flex>
                </CardHeader>
                <Collapse in={expandedSections[2]} animateOpacity>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      {cenarios.map((cenario, index) => (
                        <Card
                          key={index}
                          borderRadius="16px"
                                                                              bg={`${cenario.cor}.50`}
                          transition="all 0.3s"
                        >
                          <CardBody>
                            <VStack spacing={3} align="stretch">
                              <Flex justify="space-between" align="center">
                                <Heading size="sm" color={`${cenario.cor}.700`}>
                                  <Icon as={cenario.icone} mr={2} />
                                  {cenario.nome}
                                </Heading>
                                <Badge colorScheme={cenario.cor}>{cenario.variacao}</Badge>
                              </Flex>
                              <Box>
                                <Text fontSize="sm" color="gray.600">Preço Estimado:</Text>
                                <Text fontSize="xl" fontWeight="bold" color={`${cenario.cor}.600`}>
                                  {cenario.preco}
                                </Text>
                              </Box>
                              <Box>
                                <Flex justify="space-between" mb={1}>
                                  <Text fontSize="sm">Probabilidade</Text>
                                  <Text fontSize="sm" fontWeight="bold">{cenario.probabilidade}%</Text>
                                </Flex>
                                <Progress value={cenario.probabilidade} colorScheme={cenario.cor} size="sm" />
                              </Box>
                              <Button
                                size="sm"
                                colorScheme={cenario.cor}
                                variant="outline"
                                leftIcon={<FaCalculator />}
                                onClick={() => handleSimularVenda(cenario.nome)}
                                w="full"
                              >
                                Simular Venda
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
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
                </Collapse>
              </Card>

              {/* 3. Canais de Comercialização */}
              <Card borderRadius="16px" borderWidth={2} >
                <CardHeader
                  cursor="pointer"
                  onClick={() => toggleSection(4)}
                  bg={currentStep === 4 ? 'blue.50' : 'white'}
                >
                  <Flex justify="space-between" align="center">
                    <Heading size="md">
                      <Badge colorScheme="gray" mr={2}>4</Badge>
                      <Icon as={Package} mr={2} />
                      Canais de Comercialização
                    </Heading>
                    <Icon as={expandedSections[4] ? ChevronDown : ChevronRight} />
                  </Flex>
                </CardHeader>
                <Collapse in={expandedSections[4]} animateOpacity>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Card borderRadius="16px"   bg="green.50">
                        <CardHeader>
                          <Heading size="sm" color="green.700">
                            <Icon as={FaHandshake} mr={2} />
                            Via Cooperativa
                          </Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={3} align="stretch">
                            <Box>
                              <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm">Segurança na Venda</Text>
                                <Text fontSize="sm" fontWeight="bold">95%</Text>
                              </Flex>
                              <Progress value={95} colorScheme="green" size="sm" />
                            </Box>
                            <Box>
                              <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm">Assistência Técnica</Text>
                                <Text fontSize="sm" fontWeight="bold">100%</Text>
                              </Flex>
                              <Progress value={100} colorScheme="green" size="sm" />
                            </Box>
                            <Box>
                              <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm">Preços Competitivos</Text>
                                <Text fontSize="sm" fontWeight="bold">85%</Text>
                              </Flex>
                              <Progress value={85} colorScheme="green" size="sm" />
                            </Box>
                            <Divider />
                            <HStack justify="space-between">
                              <Text fontSize="sm" fontWeight="bold">Comissão:</Text>
                              <Badge colorScheme="green">0,5%</Badge>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card borderRadius="16px"   bg="blue.50">
                        <CardHeader>
                          <Heading size="sm" color="blue.700">
                            <Icon as={FaUserTie} mr={2} />
                            Via Corretor
                          </Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={3} align="stretch">
                            <Box>
                              <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm">Flexibilidade</Text>
                                <Text fontSize="sm" fontWeight="bold">100%</Text>
                              </Flex>
                              <Progress value={100} colorScheme="blue" size="sm" />
                            </Box>
                            <Box>
                              <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm">Agilidade na Venda</Text>
                                <Text fontSize="sm" fontWeight="bold">90%</Text>
                              </Flex>
                              <Progress value={90} colorScheme="blue" size="sm" />
                            </Box>
                            <Box>
                              <Flex justify="space-between" mb={1}>
                                <Text fontSize="sm">Negociação Direta</Text>
                                <Text fontSize="sm" fontWeight="bold">95%</Text>
                              </Flex>
                              <Progress value={95} colorScheme="blue" size="sm" />
                            </Box>
                            <Divider />
                            <HStack justify="space-between">
                              <Text fontSize="sm" fontWeight="bold">Comissão:</Text>
                              <Badge colorScheme="blue">0,5-1%</Badge>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </CardBody>
                </Collapse>
              </Card>

            </Stack>
          </GridItem>

          {/* Sidebar com Ações Rápidas e Alertas */}
          <GridItem>
            <Stack spacing={4} position="sticky" top={4}>
              {/* Ações Rápidas */}
              <Card borderRadius="16px" bg="blue.50"  borderWidth={2}>
                <CardHeader>
                  <Heading size="sm">
                    <Icon as={Zap} mr={2} />
                    Ações Rápidas
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3}>
                    <Button
                      leftIcon={<FaCalculator />}
                      colorScheme="blue"
                      size="md"
                      w="full"
                      onClick={onCalculatorOpen}
                      boxShadow="md"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    >
                      Calculadora de Preços
                    </Button>
                    <Button
                      leftIcon={<FaChartLine />}
                      variant="outline"
                      colorScheme="green"
                      size="md"
                      w="full"
                    >
                      Relatório Detalhado
                    </Button>
                    <Button
                      leftIcon={<FaBell />}
                      variant="outline"
                      colorScheme="orange"
                      size="md"
                      w="full"
                    >
                      Configurar Alertas
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Alertas em Tempo Real */}
              <Card borderRadius="16px" bg="yellow.50"  borderWidth={2}>
                <CardHeader>
                  <Heading size="sm">
                    <Icon as={AlertCircle} mr={2} />
                    Alertas em Tempo Real
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    <Alert status="success" borderRadius="16px">
                      <AlertIcon />
                      <Box>
                        <Text fontSize="sm" fontWeight="bold">Meta atingida!</Text>
                        <Text fontSize="xs">Preço chegou a R$ 650</Text>
                      </Box>
                    </Alert>
                    <Alert status="warning" borderRadius="16px">
                      <AlertIcon />
                      <Box>
                        <Text fontSize="sm" fontWeight="bold">Volatilidade alta</Text>
                        <Text fontSize="xs">Considere hedge adicional</Text>
                      </Box>
                    </Alert>
                    <Alert status="info" borderRadius="16px">
                      <AlertIcon />
                      <Box>
                        <Text fontSize="sm" fontWeight="bold">Novo relatório</Text>
                        <Text fontSize="xs">CONAB divulgou safra</Text>
                      </Box>
                    </Alert>
                  </VStack>
                </CardBody>
              </Card>

              {/* Dicas Estratégicas */}
              <Card borderRadius="16px" bg="green.50"  >
                <CardHeader>
                  <Heading size="sm">
                    <Icon as={FaLightbulb} mr={2} />
                    Dicas do Dia
                  </Heading>
                </CardHeader>
                <CardBody>
                  <List spacing={2}>
                    <ListItem fontSize="sm">
                      <ListIcon as={Info} color="green.500" />
                      Diversifique canais de venda para reduzir riscos
                    </ListItem>
                    <ListItem fontSize="sm">
                      <ListIcon as={Info} color="green.500" />
                      Monitore clima semanalmente para decisões de hedge
                    </ListItem>
                    <ListItem fontSize="sm">
                      <ListIcon as={Info} color="green.500" />
                      Contratos futuros protegem 30% da safra
                    </ListItem>
                  </List>
                </CardBody>
              </Card>

              {/* Status do Mercado */}
              <Card>
                <CardHeader>
                  <Heading size="sm">
                    <Icon as={Clock} mr={2} />
                    Status do Mercado
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={2} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm">BM&F Bovespa</Text>
                      <Badge colorScheme="green">Aberto</Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">ICE Futures</Text>
                      <Badge colorScheme="green">Aberto</Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Spot Local</Text>
                      <Badge colorScheme="yellow">Fechando</Badge>
                    </HStack>
                    <Divider />
                    <Text fontSize="xs" color="gray.600">
                      Última atualização: há 2 minutos
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </Stack>
          </GridItem>
        </Grid>

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
      </Container>
    </Box>
  );
};

export default KPIsProdutor;