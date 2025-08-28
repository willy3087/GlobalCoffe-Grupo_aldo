import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
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
import SegmentedBar from '../components/common/SegmentedBar';

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

const CoffeeAnalysis: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const [selectedSample, setSelectedSample] = useState('sample-1');

  // Dados de componentes do café
  const coffeeComponents: CoffeeComponent[] = [
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
  ];

  // Dados para o gráfico de radar
  const radarData = {
    labels: ['Aroma', 'Sabor', 'Acidez', 'Corpo', 'Balanço', 'Finalização'],
    datasets: [
      {
        label: 'Perfil Atual',
        data: [8.5, 8.0, 7.5, 8.2, 8.0, 7.8],
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
  };

  // Dados de evolução temporal
  const timelineData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Qualidade Geral',
        data: [82, 84, 83, 87, 89, 92],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
      },
    ],
  };

  // Histórico de análises
  const analysisHistory = [
    { id: '001', date: '13/08/2024', score: 92, status: 'Excelente', region: 'Sul de Minas' },
    { id: '002', date: '10/08/2024', score: 89, status: 'Muito Bom', region: 'Sul de Minas' },
    { id: '003', date: '07/08/2024', score: 87, status: 'Bom', region: 'Cerrado' },
    { id: '004', date: '04/08/2024', score: 91, status: 'Excelente', region: 'Mogiana' },
    { id: '005', date: '01/08/2024', score: 85, status: 'Bom', region: 'Sul de Minas' },
  ];

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

  return (
    <Box>
      <PageHeader 
        title="Análise de Componentes do Café" 
        subtitle="Avaliação detalhada da qualidade e composição"
        icon={Search}
      />
      <Container maxW="container.xl" py={4}>
        <VStack spacing={4} align="stretch">
          {/* Controls */}
          <Flex justify="flex-end" align="center">
            <HStack spacing={4}>
              <Select
                value={selectedSample}
                onChange={(e) => setSelectedSample(e.target.value)}
                maxW="200px"
                
                _focus={{ borderColor: currentTheme.colors.primary }}
              >
                <option value="sample-1">Amostra #001</option>
                <option value="sample-2">Amostra #002</option>
                <option value="sample-3">Amostra #003</option>
              </Select>
              <Button
                bg={currentTheme.colors.primary}
                color={currentTheme.colors.text.inverse}
                _hover={{ bg: currentTheme.colors.secondary }}
              >
                Nova Análise
              </Button>
            </HStack>
          </Flex>

          {/* Score Overview */}
          <Card
            aria-label="Score geral"
            style={{
              padding: '24px',
              backgroundColor: currentTheme.colors.background.primary,
              borderColor: currentTheme.colors.border.primary
            }}
          >
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
              <VStack>
                <CircularProgress
                  value={92}
                  size="120px"
                  sx={{
                    '& circle[stroke]': {
                      stroke: currentTheme.colors.status.success
                    }
                  }}
                  thickness="12px"
                >
                  <CircularProgressLabel
                    fontSize="24px"
                    fontWeight="bold"
                    color={currentTheme.colors.text.primary}
                  >
                    92
                  </CircularProgressLabel>
                </CircularProgress>
                <Text fontWeight="bold" color={currentTheme.colors.text.primary}>Score Geral</Text>
                <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" size="md">
                  Excelente
                </Badge>
              </VStack>
              
              <Stat>
                <StatLabel color={currentTheme.colors.text.secondary}>Classificação SCA</StatLabel>
                <StatNumber color={currentTheme.colors.text.primary}>Specialty Grade</StatNumber>
                <StatHelpText color={currentTheme.colors.text.tertiary}>Score &gt; 80 pontos</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel color={currentTheme.colors.text.secondary}>Tipo de Café</StatLabel>
                <StatNumber color={currentTheme.colors.text.primary}>Arábica</StatNumber>
                <StatHelpText color={currentTheme.colors.text.tertiary}>Bourbon Amarelo</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel color={currentTheme.colors.text.secondary}>Processo</StatLabel>
                <StatNumber color={currentTheme.colors.text.primary}>Natural</StatNumber>
                <StatHelpText color={currentTheme.colors.text.tertiary}>Secagem ao sol</StatHelpText>
              </Stat>
            </SimpleGrid>
          </Card>

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
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                  <Card borderRadius="16px" aria-label="Componentes" style={{ padding: '20px' }}>
                    <VStack align="stretch" spacing={4}>
                      <Heading size="md">Composição Química</Heading>
                      {coffeeComponents.map((component) => (
                        <Box key={component.name}>
                          <Flex justify="space-between" align="center" mb={2}>
                            <HStack>
                              <Text fontWeight="semibold">{component.name}</Text>
                              <Badge bg={getStatusColor(component.status) + '10'} color={getStatusColor(component.status)}  borderColor={getStatusColor(component.status) + '40'} borderRadius="16px">
                                {component.value}{component.unit}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                              Ideal: {component.ideal}{component.unit}
                            </Text>
                          </Flex>
                          <SegmentedBar 
                            variant="default"
                            data={[
                              {
                                name: component.name,
                                value: Math.round((component.value / component.ideal) * 100),
                                gradient: component.status === 'good' ? 'linear(to-r, green.200, green.300)' : 
                                         component.status === 'warning' ? 'linear(to-r, orange.200, orange.300)' :
                                         'linear(to-r, red.200, red.300)',
                                dotColor: getStatusColor(component.status),
                                completed: true
                              },
                              {
                                name: 'Restante',
                                value: Math.round(100 - (component.value / component.ideal) * 100),
                                gradient: 'linear(to-r, gray.100, gray.200)',
                                dotColor: '#cbd5e0',
                                completed: false
                              }
                            ]}
                            height="24px"
                            showDots={false}
                            showLabels={false}
                          />
                          <Text fontSize="xs" color={currentTheme.colors.text.tertiary} mt={1}>
                            {component.description}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </Card>

                  <Card borderRadius="16px" aria-label="Evolução temporal" style={{ padding: '20px', height: '400px' }}>
                    <Heading size="md" mb={4}>Evolução da Qualidade</Heading>
                    <Box h="320px">
                      <Line data={timelineData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </Box>
                  </Card>
                </SimpleGrid>
              </TabPanel>

              {/* Sensory Profile */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                  <Card borderRadius="16px" aria-label="Perfil sensorial" style={{ padding: '20px', height: '500px' }}>
                    <Heading size="md" mb={4}>Perfil Sensorial</Heading>
                    <Box h="420px">
                      <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </Box>
                  </Card>

                  <Card borderRadius="16px" aria-label="Notas de prova" style={{ padding: '20px' }}>
                    <VStack align="stretch" spacing={4}>
                      <Heading size="md">Notas de Prova</Heading>
                      
                      <Box>
                        <Text fontWeight="semibold" mb={2}>Fragrância/Aroma</Text>
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                          Notas florais intensas com hints de chocolate e caramelo. 
                          Fragrância doce e complexa que remete a frutas vermelhas maduras.
                        </Text>
                      </Box>

                      <Divider  />

                      <Box>
                        <Text fontWeight="semibold" mb={2}>Sabor</Text>
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                          Sabor equilibrado com acidez cítrica brilhante. 
                          Notas de cacau, amendoim e finalização prolongada.
                        </Text>
                      </Box>

                      <Divider  />

                      <Box>
                        <Text fontWeight="semibold" mb={2}>Corpo</Text>
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                          Corpo médio a encorpado, textura cremosa e aveludada. 
                          Sensação na boca agradável e persistente.
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
                </SimpleGrid>
              </TabPanel>

              {/* Defects */}
              <TabPanel>
                <Card borderRadius="16px" aria-label="Análise de defeitos" style={{ padding: '20px' }}>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">Análise de Defeitos</Heading>
                    
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Stat>
                        <StatLabel color={currentTheme.colors.text.secondary}>Defeitos Tipo 1</StatLabel>
                        <StatNumber color={currentTheme.colors.text.primary}>0</StatNumber>
                        <StatHelpText color={currentTheme.colors.text.tertiary}>Nenhum defeito grave</StatHelpText>
                      </Stat>
                      
                      <Stat>
                        <StatLabel color={currentTheme.colors.text.secondary}>Defeitos Tipo 2</StatLabel>
                        <StatNumber color={currentTheme.colors.text.primary}>3</StatNumber>
                        <StatHelpText color={currentTheme.colors.text.tertiary}>Dentro do aceitável</StatHelpText>
                      </Stat>
                      
                      <Stat>
                        <StatLabel color={currentTheme.colors.text.secondary}>Grãos Quebrados</StatLabel>
                        <StatNumber color={currentTheme.colors.text.primary}>2%</StatNumber>
                        <StatHelpText color={currentTheme.colors.text.tertiary}>Excelente integridade</StatHelpText>
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
                        <Tr>
                          <Td>Grãos Pretos</Td>
                          <Td>0</Td>
                          <Td>-</Td>
                          <Td><Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px">OK</Badge></Td>
                        </Tr>
                        <Tr>
                          <Td>Grãos Ardidos</Td>
                          <Td>1</Td>
                          <Td>Baixo</Td>
                          <Td><Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px">OK</Badge></Td>
                        </Tr>
                        <Tr>
                          <Td>Grãos Verdes</Td>
                          <Td>2</Td>
                          <Td>Baixo</Td>
                          <Td><Badge bg={currentTheme.colors.status.warning + '10'} color={currentTheme.colors.status.warning}  borderColor={currentTheme.colors.status.warning + '40'} borderRadius="16px">Atenção</Badge></Td>
                        </Tr>
                        <Tr>
                          <Td>Conchas</Td>
                          <Td>0</Td>
                          <Td>-</Td>
                          <Td><Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px">OK</Badge></Td>
                        </Tr>
                        <Tr>
                          <Td>Brocados</Td>
                          <Td>0</Td>
                          <Td>-</Td>
                          <Td><Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px">OK</Badge></Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </VStack>
                </Card>
              </TabPanel>

              {/* History */}
              <TabPanel>
                <Card borderRadius="16px" aria-label="Histórico de análises" style={{ padding: '20px' }}>
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
                              <Badge bg={getScoreColor(analysis.score) + '10'} color={getScoreColor(analysis.score)}  borderColor={getScoreColor(analysis.score) + '40'} borderRadius="16px">
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