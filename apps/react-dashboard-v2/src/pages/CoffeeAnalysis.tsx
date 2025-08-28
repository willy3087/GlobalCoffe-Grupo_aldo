import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  Button,
  Select,
  Flex,
  Divider,
  CircularProgress,
  CircularProgressLabel,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { Card } from '../components/ui/BaseComponents';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Search } from 'react-feather';
import { useThemeContext } from '../contexts/ThemeContext';
import { ServiceContainer } from '../services/ServiceContainer';
import { Result } from '../types/Result';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface CoffeeComponent {
  name: string;
  value: number;
  ideal: number;
  unit: string;
  description: string;
  status: 'good' | 'warning' | 'critical';
}

interface CoffeeAnalysisData {
  id: string;
  date: string;
  score: number;
  status: string;
  region: string;
  components: CoffeeComponent[];
  sensoryProfile: {
    aroma: number;
    flavor: number;
    acidity: number;
    body: number;
    balance: number;
    finish: number;
  };
  defects: {
    type1: number;
    type2: number;
    brokenBeans: number;
    details: Array<{
      type: string;
      quantity: number;
      impact: string;
      status: 'good' | 'warning' | 'critical';
    }>;
  };
  notes: {
    fragrance: string;
    flavor: string;
    body: string;
  };
  classification: string;
  coffeeType: string;
  process: string;
}

interface QualityEvolution {
  month: string;
  score: number;
}

const CoffeeAnalysis: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const toast = useToast();
  
  // Estados
  const [selectedSample, setSelectedSample] = useState('sample-1');
  const [analysisData, setAnalysisData] = useState<CoffeeAnalysisData | null>(null);
  const [qualityEvolution, setQualityEvolution] = useState<QualityEvolution[]>([]);
  const [analysisHistory, setAnalysisHistory] = useState<CoffeeAnalysisData[]>([]);
  const [availableSamples, setAvailableSamples] = useState<Array<{id: string, label: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Serviços
  const analyticsService = ServiceContainer.getAnalyticsService();
  const marketDataService = ServiceContainer.getMarketDataService();

  // Carregamento inicial dos dados
  const loadCoffeeAnalysisData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Carrega dados da análise atual
      const currentAnalysisResult = await analyticsService.getCoffeeAnalysis(selectedSample);
      if (currentAnalysisResult.success && currentAnalysisResult.data) {
        setAnalysisData(currentAnalysisResult.data);
      } else {
        // Dados mock para fallback
        setAnalysisData(generateMockAnalysisData());
      }

      // Carrega evolução da qualidade
      const evolutionResult = await analyticsService.getQualityEvolution('6-months');
      if (evolutionResult.success && evolutionResult.data) {
        setQualityEvolution(evolutionResult.data);
      } else {
        setQualityEvolution(generateMockEvolution());
      }

      // Carrega histórico de análises
      const historyResult = await analyticsService.getAnalysisHistory();
      if (historyResult.success && historyResult.data) {
        setAnalysisHistory(historyResult.data);
      } else {
        setAnalysisHistory(generateMockHistory());
      }

      // Carrega amostras disponíveis
      const samplesResult = await analyticsService.getAvailableSamples();
      if (samplesResult.success && samplesResult.data) {
        setAvailableSamples(samplesResult.data);
      } else {
        setAvailableSamples([
          { id: 'sample-1', label: 'Amostra #001' },
          { id: 'sample-2', label: 'Amostra #002' },
          { id: 'sample-3', label: 'Amostra #003' }
        ]);
      }

    } catch (error) {
      console.error('Erro ao carregar dados de análise:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados de análise',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Fallback para dados mock
      setAnalysisData(generateMockAnalysisData());
      setQualityEvolution(generateMockEvolution());
      setAnalysisHistory(generateMockHistory());
    } finally {
      setIsLoading(false);
    }
  }, [selectedSample, analyticsService, toast]);

  useEffect(() => {
    loadCoffeeAnalysisData();
  }, [loadCoffeeAnalysisData]);

  // Função para gerar nova análise
  const handleNewAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await analyticsService.generateCoffeeAnalysis();
      if (result.success) {
        toast({
          title: 'Sucesso',
          description: 'Nova análise gerada com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await loadCoffeeAnalysisData();
      } else {
        throw new Error(result.error?.message || 'Erro ao gerar análise');
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar nova análise',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para exportar relatório
  const handleExportReport = async () => {
    try {
      const result = await analyticsService.exportAnalysisReport(selectedSample);
      if (result.success) {
        toast({
          title: 'Sucesso',
          description: 'Relatório exportado com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(result.error?.message || 'Erro ao exportar relatório');
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível exportar o relatório',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Dados mock para fallback
  const generateMockAnalysisData = (): CoffeeAnalysisData => ({
    id: selectedSample,
    date: new Date().toLocaleDateString('pt-BR'),
    score: 92,
    status: 'Excelente',
    region: 'Sul de Minas',
    components: [
      {
        name: 'Cafeína',
        value: 1.2,
        ideal: 1.0,
        unit: '%',
        description: 'Nível de cafeína no grão',
        status: 'good',
      },
      {
        name: 'Acidez',
        value: 5.8,
        ideal: 5.5,
        unit: 'pH',
        description: 'Nível de acidez',
        status: 'good',
      },
      {
        name: 'Umidade',
        value: 11.2,
        ideal: 11.0,
        unit: '%',
        description: 'Teor de umidade',
        status: 'good',
      },
      {
        name: 'Açúcares',
        value: 7.5,
        ideal: 8.0,
        unit: '%',
        description: 'Açúcares totais',
        status: 'warning',
      },
      {
        name: 'Lipídios',
        value: 15.0,
        ideal: 16.0,
        unit: '%',
        description: 'Gorduras totais',
        status: 'warning',
      },
      {
        name: 'Proteínas',
        value: 13.0,
        ideal: 13.0,
        unit: '%',
        description: 'Proteínas totais',
        status: 'good',
      },
    ],
    sensoryProfile: {
      aroma: 8.5,
      flavor: 8.0,
      acidity: 7.5,
      body: 8.2,
      balance: 8.0,
      finish: 7.8,
    },
    defects: {
      type1: 0,
      type2: 3,
      brokenBeans: 2,
      details: [
        { type: 'Grãos Pretos', quantity: 0, impact: '-', status: 'good' },
        { type: 'Grãos Ardidos', quantity: 1, impact: 'Baixo', status: 'good' },
        { type: 'Grãos Verdes', quantity: 2, impact: 'Baixo', status: 'warning' },
        { type: 'Conchas', quantity: 0, impact: '-', status: 'good' },
        { type: 'Brocados', quantity: 0, impact: '-', status: 'good' },
      ],
    },
    notes: {
      fragrance: 'Notas florais intensas com hints de chocolate e caramelo. Fragrância doce e complexa que remete a frutas vermelhas maduras.',
      flavor: 'Sabor equilibrado com acidez cítrica brilhante. Notas de cacau, amendoim e finalização prolongada.',
      body: 'Corpo médio a encorpado, textura cremosa e aveludada. Sensação na boca agradável e persistente.',
    },
    classification: 'Specialty Grade',
    coffeeType: 'Arábica - Bourbon Amarelo',
    process: 'Natural - Secagem ao sol',
  });

  const generateMockEvolution = (): QualityEvolution[] => [
    { month: 'Jan', score: 82 },
    { month: 'Fev', score: 84 },
    { month: 'Mar', score: 83 },
    { month: 'Abr', score: 87 },
    { month: 'Mai', score: 89 },
    { month: 'Jun', score: 92 },
  ];

  const generateMockHistory = (): CoffeeAnalysisData[] => [
    { id: '001', date: '13/08/2024', score: 92, status: 'Excelente', region: 'Sul de Minas' } as CoffeeAnalysisData,
    { id: '002', date: '10/08/2024', score: 89, status: 'Muito Bom', region: 'Sul de Minas' } as CoffeeAnalysisData,
    { id: '003', date: '07/08/2024', score: 87, status: 'Bom', region: 'Cerrado' } as CoffeeAnalysisData,
    { id: '004', date: '04/08/2024', score: 91, status: 'Excelente', region: 'Mogiana' } as CoffeeAnalysisData,
    { id: '005', date: '01/08/2024', score: 85, status: 'Bom', region: 'Sul de Minas' } as CoffeeAnalysisData,
  ];

  // Dados para gráficos
  const radarData = analysisData ? {
    labels: ['Aroma', 'Sabor', 'Acidez', 'Corpo', 'Balanço', 'Finalização'],
    datasets: [
      {
        label: 'Perfil Atual',
        data: [
          analysisData.sensoryProfile.aroma,
          analysisData.sensoryProfile.flavor,
          analysisData.sensoryProfile.acidity,
          analysisData.sensoryProfile.body,
          analysisData.sensoryProfile.balance,
          analysisData.sensoryProfile.finish,
        ],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(34, 197, 94)',
      },
      {
        label: 'Perfil Ideal',
        data: [8.0, 8.0, 8.0, 8.0, 8.0, 8.0],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      },
    ],
  } : { labels: [], datasets: [] };

  const timelineData = {
    labels: qualityEvolution.map(item => item.month),
    datasets: [
      {
        label: 'Qualidade Geral',
        data: qualityEvolution.map(item => item.score),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
      },
    ],
  };

  // Funções utilitárias
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return currentTheme.colors.status.success;
      case 'warning': return currentTheme.colors.status.warning;
      case 'critical': return currentTheme.colors.status.error;
      default: return currentTheme.colors.text.secondary;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return currentTheme.colors.status.success;
    if (score >= 80) return currentTheme.colors.primary;
    if (score >= 70) return currentTheme.colors.status.warning;
    return currentTheme.colors.status.error;
  };

  if (isLoading && !analysisData) {
    return (
      <Box>
        <PageHeader 
          title="Análise de Componentes do Café" 
          subtitle="Avaliação detalhada da qualidade e composição"
          icon={Search}
        />
        <Container maxW="container.xl" py={6}>
          <Flex justify="center" align="center" h="400px">
            <VStack spacing={4}>
              <Spinner size="xl" color={currentTheme.colors.primary} />
              <Text>Carregando análise...</Text>
            </VStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title="Análise de Componentes do Café" 
        subtitle="Avaliação detalhada da qualidade e composição"
        icon={Search}
      />
      <Container maxW="container.xl" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Controls */}
          <Flex justify="flex-end" align="center">
            <HStack spacing={4}>
              <Select
                value={selectedSample}
                onChange={(e) => setSelectedSample(e.target.value)}
                maxW="200px"
                borderColor={currentTheme.colors.border.primary}
                _focus={{ borderColor: currentTheme.colors.primary }}
                isDisabled={isLoading}
              >
                {availableSamples.map((sample) => (
                  <option key={sample.id} value={sample.id}>
                    {sample.label}
                  </option>
                ))}
              </Select>
              <Button
                bg={currentTheme.colors.primary}
                color={currentTheme.colors.text.inverse}
                _hover={{ bg: currentTheme.colors.secondary }}
                onClick={handleNewAnalysis}
                isLoading={isLoading}
                loadingText="Gerando..."
              >
                Nova Análise
              </Button>
            </HStack>
          </Flex>

          {/* Score Overview */}
          {analysisData && (
            <Card
              aria-label="Score geral"
              style={{
                padding: '24px',
                backgroundColor: currentTheme.colors.background.primary,
                borderColor: currentTheme.colors.border.primary
              }}
            >
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                <VStack>
                  <CircularProgress
                    value={analysisData.score}
                    size="120px"
                    sx={{
                      '& circle[stroke]': {
                        stroke: getScoreColor(analysisData.score)
                      }
                    }}
                    thickness="12px"
                  >
                    <CircularProgressLabel
                      fontSize="24px"
                      fontWeight="bold"
                      color={currentTheme.colors.text.primary}
                    >
                      {analysisData.score}
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text fontWeight="bold" color={currentTheme.colors.text.primary}>Score Geral</Text>
                  <Badge bg={getScoreColor(analysisData.score)} color="white" size="md">
                    {analysisData.status}
                  </Badge>
                </VStack>
                
                <Stat>
                  <StatLabel color={currentTheme.colors.text.secondary}>Classificação SCA</StatLabel>
                  <StatNumber color={currentTheme.colors.text.primary}>{analysisData.classification}</StatNumber>
                  <StatHelpText color={currentTheme.colors.text.tertiary}>Score &gt; 80 pontos</StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel color={currentTheme.colors.text.secondary}>Tipo de Café</StatLabel>
                  <StatNumber color={currentTheme.colors.text.primary}>
                    {analysisData.coffeeType.split(' - ')[0]}
                  </StatNumber>
                  <StatHelpText color={currentTheme.colors.text.tertiary}>
                    {analysisData.coffeeType.split(' - ')[1]}
                  </StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel color={currentTheme.colors.text.secondary}>Processo</StatLabel>
                  <StatNumber color={currentTheme.colors.text.primary}>
                    {analysisData.process.split(' - ')[0]}
                  </StatNumber>
                  <StatHelpText color={currentTheme.colors.text.tertiary}>
                    {analysisData.process.split(' - ')[1]}
                  </StatHelpText>
                </Stat>
              </SimpleGrid>
            </Card>
          )}

          {/* Tabs for different analyses */}
          <Tabs
            sx={{
              '& .chakra-tabs__tab[aria-selected=true]': {
                color: currentTheme.colors.primary,
                borderColor: currentTheme.colors.primary
              },
              '& .chakra-tabs__tab:hover': {
                color: currentTheme.colors.secondary
              }
            }}
          >
            <TabList>
              <Tab>Componentes Químicos</Tab>
              <Tab>Perfil Sensorial</Tab>
              <Tab>Defeitos</Tab>
              <Tab>Histórico</Tab>
            </TabList>

            <TabPanels>
              {/* Chemical Components */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card aria-label="Componentes" style={{ padding: '20px' }}>
                    <VStack align="stretch" spacing={4}>
                      <Heading size="md">Composição Química</Heading>
                      {analysisData?.components.map((component) => (
                        <Box key={component.name}>
                          <Flex justify="space-between" align="center" mb={2}>
                            <HStack>
                              <Text fontWeight="semibold">{component.name}</Text>
                              <Badge bg={getStatusColor(component.status)} color={currentTheme.colors.text.inverse}>
                                {component.value}{component.unit}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                              Ideal: {component.ideal}{component.unit}
                            </Text>
                          </Flex>
                          <Progress
                            value={(component.value / component.ideal) * 100}
                            size="sm"
                            borderRadius="full"
                            sx={{
                              '& > div[role="progressbar"]': {
                                backgroundColor: getStatusColor(component.status)
                              }
                            }}
                          />
                          <Text fontSize="xs" color={currentTheme.colors.text.tertiary} mt={1}>
                            {component.description}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </Card>

                  <Card aria-label="Evolução temporal" style={{ padding: '20px', height: '400px' }}>
                    <Heading size="md" mb={4}>Evolução da Qualidade</Heading>
                    <Box h="320px">
                      <Line data={timelineData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </Box>
                  </Card>
                </SimpleGrid>
              </TabPanel>

              {/* Sensory Profile */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card aria-label="Perfil sensorial" style={{ padding: '20px', height: '500px' }}>
                    <Heading size="md" mb={4}>Perfil Sensorial</Heading>
                    <Box h="420px">
                      <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </Box>
                  </Card>

                  {analysisData && (
                    <Card aria-label="Notas de prova" style={{ padding: '20px' }}>
                      <VStack align="stretch" spacing={4}>
                        <Heading size="md">Notas de Prova</Heading>
                        
                        <Box>
                          <Text fontWeight="semibold" mb={2}>Fragrância/Aroma</Text>
                          <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                            {analysisData.notes.fragrance}
                          </Text>
                        </Box>

                        <Divider borderColor={currentTheme.colors.border.primary} />

                        <Box>
                          <Text fontWeight="semibold" mb={2}>Sabor</Text>
                          <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                            {analysisData.notes.flavor}
                          </Text>
                        </Box>

                        <Divider borderColor={currentTheme.colors.border.primary} />

                        <Box>
                          <Text fontWeight="semibold" mb={2}>Corpo</Text>
                          <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                            {analysisData.notes.body}
                          </Text>
                        </Box>

                        <Alert
                          status="success"
                          mt={4}
                          bg={currentTheme.colors.status.success}
                          color={currentTheme.colors.text.inverse}
                        >
                          <AlertIcon />
                          Café aprovado para exportação premium
                        </Alert>
                      </VStack>
                    </Card>
                  )}
                </SimpleGrid>
              </TabPanel>

              {/* Defects */}
              <TabPanel>
                {analysisData && (
                  <Card aria-label="Análise de defeitos" style={{ padding: '20px' }}>
                    <VStack align="stretch" spacing={4}>
                      <Heading size="md">Análise de Defeitos</Heading>
                      
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <Stat>
                          <StatLabel color={currentTheme.colors.text.secondary}>Defeitos Tipo 1</StatLabel>
                          <StatNumber color={currentTheme.colors.text.primary}>{analysisData.defects.type1}</StatNumber>
                          <StatHelpText color={currentTheme.colors.text.tertiary}>
                            {analysisData.defects.type1 === 0 ? 'Nenhum defeito grave' : 'Defeitos graves detectados'}
                          </StatHelpText>
                        </Stat>
                        
                        <Stat>
                          <StatLabel color={currentTheme.colors.text.secondary}>Defeitos Tipo 2</StatLabel>
                          <StatNumber color={currentTheme.colors.text.primary}>{analysisData.defects.type2}</StatNumber>
                          <StatHelpText color={currentTheme.colors.text.tertiary}>
                            {analysisData.defects.type2 <= 5 ? 'Dentro do aceitável' : 'Acima do limite'}
                          </StatHelpText>
                        </Stat>
                        
                        <Stat>
                          <StatLabel color={currentTheme.colors.text.secondary}>Grãos Quebrados</StatLabel>
                          <StatNumber color={currentTheme.colors.text.primary}>{analysisData.defects.brokenBeans}%</StatNumber>
                          <StatHelpText color={currentTheme.colors.text.tertiary}>
                            {analysisData.defects.brokenBeans <= 3 ? 'Excelente integridade' : 'Atenção necessária'}
                          </StatHelpText>
                        </Stat>
                      </SimpleGrid>

                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Tipo de Defeito</Th>
                            <Th>Quantidade</Th>
                            <Th>Impacto</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {analysisData.defects.details.map((defect) => (
                            <Tr key={defect.type}>
                              <Td>{defect.type}</Td>
                              <Td>{defect.quantity}</Td>
                              <Td>{defect.impact}</Td>
                              <Td>
                                <Badge 
                                  bg={getStatusColor(defect.status)} 
                                  color={currentTheme.colors.text.inverse}
                                >
                                  {defect.status === 'good' ? 'OK' : 
                                   defect.status === 'warning' ? 'Atenção' : 'Crítico'}
                                </Badge>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </VStack>
                  </Card>
                )}
              </TabPanel>

              {/* History */}
              <TabPanel>
                <Card aria-label="Histórico de análises" style={{ padding: '20px' }}>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">Histórico de Análises</Heading>
                    
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ID</Th>
                          <Th>Data</Th>
                          <Th>Score</Th>
                          <Th>Status</Th>
                          <Th>Região</Th>
                          <Th>Ações</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {analysisHistory.map((analysis) => (
                          <Tr key={analysis.id}>
                            <Td>{analysis.id}</Td>
                            <Td>{analysis.date}</Td>
                            <Td>
                              <Badge bg={getScoreColor(analysis.score)} color={currentTheme.colors.text.inverse}>
                                {analysis.score}
                              </Badge>
                            </Td>
                            <Td>{analysis.status}</Td>
                            <Td>{analysis.region}</Td>
                            <Td>
                              <Button size="sm" variant="ghost">Ver Detalhes</Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>

                    <Button
                      variant="outline"
                      borderColor={currentTheme.colors.status.success}
                      color={currentTheme.colors.status.success}
                      _hover={{ bg: currentTheme.colors.status.success, color: currentTheme.colors.text.inverse }}
                      onClick={handleExportReport}
                    >
                      Exportar Relatório Completo
                    </Button>
                  </VStack>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default CoffeeAnalysis;