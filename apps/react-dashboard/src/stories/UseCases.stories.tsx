import type { Meta, StoryObj } from '@storybook/react';
import { 
  Box, 
  SimpleGrid, 
  VStack, 
  HStack,
  Text, 
  Card, 
  CardBody,
  CardHeader,
  Heading,
  Badge,
  ChakraProvider,
  Avatar,
  Divider,
  List,
  ListItem,
  ListIcon,
  Progress
} from '@chakra-ui/react';
import { CheckCircle, AlertTriangle, TrendingUp, Coffee, Users, BarChart } from 'react-feather';
import { ThemeProvider } from '../contexts/ThemeContext';
import KPICard from '../components/ui/KPICard';
import NewsCard from '../components/ui/NewsCard';
import StatusPill from '../components/common/StatusPill';
import StatusTag from '../components/common/StatusTag';

const meta: Meta = {
  title: 'Design System/Use Cases',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Casos de uso validados durante a fase Discovery com produtores, cooperativas e traders do mercado de café.'
      }
    }
  },
  decorators: [
    (Story) => (
      <ChakraProvider>
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      </ChakraProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const JoseSilvaJourney: Story = {
  render: () => (
    <Box p={8} maxW="1200px" mx="auto">
      <VStack spacing={8} align="stretch">
        
        <VStack spacing={4} align="center" textAlign="center">
          <Avatar size="xl" name="José Silva" bg="green.500" />
          <Heading size="xl">Jornada do Produtor José Silva</Heading>
          <Text fontSize="lg" color="gray.600" maxW="600px">
            Produtor familiar tradicional, 45-60 anos, baixa familiaridade digital.
            Descoberta → Consideração → Onboarding → Uso Gradual → Advocacia
          </Text>
        </VStack>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <Heading size="md">Jornada de Adoção (6+ meses)</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              
              {/* Descoberta */}
              <HStack spacing={4} align="start">
                <Badge colorScheme="blue" fontSize="sm" p={2}>2-4 semanas</Badge>
                <VStack align="start" flex={1}>
                  <Text fontWeight="semibold">Descoberta via Cooperativa</Text>
                  <Text fontSize="sm" color="gray.600">
                    José descobre a plataforma através da cooperativa local. 
                    Precisa de validação da comunidade e recomendação de pares.
                  </Text>
                </VStack>
              </HStack>

              {/* Consideração */}
              <HStack spacing={4} align="start">
                <Badge colorScheme="orange" fontSize="sm" p={2}>2-3 semanas</Badge>
                <VStack align="start" flex={1}>
                  <Text fontWeight="semibold">Consideração Familiar</Text>
                  <Text fontSize="sm" color="gray.600">
                    Longo período validando com a família. Precisa entender os benefícios 
                    e como isso se alinha com a tradição familiar na cafeicultura.
                  </Text>
                </VStack>
              </HStack>

              {/* Onboarding */}
              <HStack spacing={4} align="start">
                <Badge colorScheme="purple" fontSize="sm" p={2}>3-5 dias</Badge>
                <VStack align="start" flex={1}>
                  <Text fontWeight="semibold">Onboarding Assistido</Text>
                  <Text fontSize="sm" color="gray.600">
                    Suporte técnico intensivo necessário. Interface deve ser 
                    progressiva com muito auxílio contextual.
                  </Text>
                </VStack>
              </HStack>

              {/* Primeiro Uso */}
              <HStack spacing={4} align="start">
                <Badge colorScheme="green" fontSize="sm" p={2}>1-2 semanas</Badge>
                <VStack align="start" flex={1}>
                  <Text fontWeight="semibold">Primeiro Uso Gradual</Text>
                  <Text fontSize="sm" color="gray.600">
                    Uso gradual com muito auxílio. Começando pelas funcionalidades 
                    mais básicas e essenciais.
                  </Text>
                </VStack>
              </HStack>

              {/* Advocacia */}
              <HStack spacing={4} align="start">
                <Badge colorScheme="teal" fontSize="sm" p={2}>6+ meses</Badge>
                <VStack align="start" flex={1}>
                  <Text fontWeight="semibold">Torna-se Advocato</Text>
                  <Text fontSize="sm" color="gray.600">
                    Influência muito forte no âmbito local e cooperativo. 
                    Recomenda para outros produtores da região.
                  </Text>
                </VStack>
              </HStack>

            </VStack>
          </CardBody>
        </Card>

        {/* Funcionalidades Essenciais */}
        <Card>
          <CardHeader>
            <Heading size="md">Funcionalidades Mais Importantes</Heading>
            <Text fontSize="sm" color="gray.600">
              Baseadas na pesquisa Discovery - ordem de prioridade para José Silva
            </Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={CheckCircle} color="green.500" />
                  <Text as="span" fontWeight="semibold">Suporte intensivo no onboarding</Text>
                  <Text fontSize="sm" color="gray.600" ml={6}>
                    Fundamental para familiarização com perfil tecnológico básico
                  </Text>
                </ListItem>
                
                <ListItem>
                  <ListIcon as={TrendingUp} color="blue.500" />
                  <Text as="span" fontWeight="semibold">Uso gradual da plataforma</Text>
                  <Text fontSize="sm" color="gray.600" ml={6}>
                    Avançar conforme ganha confiança, evitando sobrecarga
                  </Text>
                </ListItem>
                
                <ListItem>
                  <ListIcon as={Users} color="orange.500" />
                  <Text as="span" fontWeight="semibold">Comunicação via cooperativa</Text>
                  <Text fontSize="sm" color="gray.600" ml={6}>
                    Aproveitar estrutura existente para suporte e informações
                  </Text>
                </ListItem>
                
                <ListItem>
                  <ListIcon as={Coffee} color="brown" />
                  <Text as="span" fontWeight="semibold">Funcionalidades básicas essenciais</Text>
                  <Text fontSize="sm" color="gray.600" ml={6}>
                    Controle financeiro, acompanhamento de safra, alertas climáticos
                  </Text>
                </ListItem>
                
              </List>

            </VStack>
          </CardBody>
        </Card>

      </VStack>
    </Box>
  ),
};

export const ProducerDashboard: Story = {
  render: () => (
    <Box p={8} maxW="1400px" mx="auto">
      <VStack spacing={8} align="stretch">
        
        <VStack spacing={2} align="center">
          <Heading size="xl">Dashboard do Produtor</Heading>
          <Text color="gray.600" textAlign="center">
            Interface otimizada para José Silva - cards grandes, ícones visuais, cores semânticas
          </Text>
        </VStack>

        {/* KPIs Principais */}
        <Card>
          <CardHeader>
            <Heading size="md">KPIs Principais - Visão Geral do Mercado</Heading>
            <Text fontSize="sm" color="gray.600">
              Indicadores essenciais integrados via APIs (Commodities-API, CEPEA, OpenWeatherMap)
            </Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <KPICard
                title="Preço Médio Atual"
                value="$4.25"
                unit="/lb"
                change={3.2}
                changeType="increase"
                status="positive"
                statusText="Alta"
                subtitle="Commodities-API + Yahoo Finance"
                icon={TrendingUp}
                iconColor="green.500"
                colorScheme="green"
              />
              <KPICard
                title="Tipo Mais Valorizado"
                value="Arábica"
                unit="Premium"
                status="success"
                statusText="Score 85"
                subtitle="SCA Score (scraping)"
                icon={Coffee}
                iconColor="orange.600"
                colorScheme="orange"
                variant="compact"
              />
              <KPICard
                title="Melhor Canal"
                value="Cooperativa"
                unit="0.5%"
                status="info"
                statusText="Seguro"
                subtitle="CONAB (scraping)"
                progress={95}
                icon={Users}
                iconColor="blue.500"
                colorScheme="blue"
                variant="detailed"
              />
              <KPICard
                title="Clima Safra"
                value="82"
                unit="/100"
                change={5.2}
                changeType="increase"
                status="success"
                statusText="Favorável"
                subtitle="OpenWeatherMap Climate Index"
                progress={82}
                icon={BarChart}
                iconColor="teal.500"
                colorScheme="teal"
                variant="detailed"
              />
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Simulação de Cenários */}
        <Card>
          <CardHeader>
            <Heading size="md">Simulação de Cenários - Próximos 30 dias</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Card borderRadius="16px" bg="green.50" borderColor="green.200" borderWidth="1px">
                <CardBody textAlign="center">
                  <VStack spacing={3}>
                    <StatusPill variant="positive" size="md">OTIMISTA</StatusPill>
                    <Text fontSize="2xl" fontWeight="bold" color="green.600">+15%</Text>
                    <Text fontSize="sm" color="green.700">25% de probabilidade</Text>
                    <Text fontSize="xs" color="gray.600">Cenário favorável</Text>
                  </VStack>
                </CardBody>
              </Card>
              <Card borderRadius="16px" bg="blue.50" borderColor="blue.200" borderWidth="1px">
                <CardBody textAlign="center">
                  <VStack spacing={3}>
                    <StatusPill variant="info" size="md">REALISTA</StatusPill>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">+5%</Text>
                    <Text fontSize="sm" color="blue.700">60% de probabilidade</Text>
                    <Text fontSize="xs" color="gray.600">Cenário mais provável</Text>
                  </VStack>
                </CardBody>
              </Card>
              <Card borderRadius="16px" bg="red.50" borderColor="red.200" borderWidth="1px">
                <CardBody textAlign="center">
                  <VStack spacing={3}>
                    <StatusPill variant="warning" size="md">PESSIMISTA</StatusPill>
                    <Text fontSize="2xl" fontWeight="bold" color="red.600">-10%</Text>
                    <Text fontSize="sm" color="red.700">15% de probabilidade</Text>
                    <Text fontSize="xs" color="gray.600">Cenário adverso</Text>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Canais de Comercialização */}
        <Card>
          <CardHeader>
            <Heading size="md">Canais de Comercialização</Heading>
            <Text fontSize="sm" color="gray.600">
              Comparativo baseado em dados validados da pesquisa
            </Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card>
                <CardHeader>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Cooperativa</Text>
                    <StatusPill variant="success" size="sm">RECOMENDADO</StatusPill>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm">Segurança</Text>
                      <HStack>
                        <Progress value={95} size="sm" colorScheme="green" width="100px" />
                        <Text fontSize="sm" fontWeight="medium">95%</Text>
                      </HStack>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Comissão</Text>
                      <Text fontSize="sm" fontWeight="medium" color="green.600">0.5% fixo</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Assistência</Text>
                      <StatusPill variant="high" size="sm">ALTA</StatusPill>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Corretor</Text>
                    <StatusPill variant="info" size="sm">FLEXÍVEL</StatusPill>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm">Flexibilidade</Text>
                      <HStack>
                        <Progress value={100} size="sm" colorScheme="blue" width="100px" />
                        <Text fontSize="sm" fontWeight="medium">100%</Text>
                      </HStack>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Comissão</Text>
                      <Text fontSize="sm" fontWeight="medium" color="blue.600">0.5-1%</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Agilidade</Text>
                      <StatusPill variant="high" size="sm">ALTA</StatusPill>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </CardBody>
        </Card>

      </VStack>
    </Box>
  ),
};

export const ClimateDashboard: Story = {
  render: () => (
    <Box p={8} maxW="1200px" mx="auto">
      <VStack spacing={8} align="stretch">
        
        <VStack spacing={2} align="center">
          <Heading size="xl">Dashboard Climático</Heading>
          <Text color="gray.600" textAlign="center">
            Cards grandes e visuais para leitura rápida no campo
          </Text>
        </VStack>

        <Card>
          <CardHeader>
            <Heading size="md">KPIs Climáticos</Heading>
            <Text fontSize="sm" color="gray.600">
              Indicadores essenciais com ícones meteorológicos para compreensão imediata
            </Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
              <KPICard
                title="Temperatura"
                value="24.8"
                unit="°C"
                status="success"
                statusText="Ideal"
                size="lg"
                variant="compact"
                colorScheme="orange"
              />
              <KPICard
                title="Umidade"
                value="68"
                unit="%"
                change={2.1}
                changeType="increase"
                size="lg"
                variant="compact"
                colorScheme="cyan"
              />
              <KPICard
                title="Vento"
                value="12"
                unit="km/h"
                status="info"
                statusText="Leve"
                size="lg"
                variant="compact"
                colorScheme="gray"
              />
              <KPICard
                title="Chuva"
                value="125"
                unit="mm"
                change={8.7}
                changeType="increase"
                status="positive"
                statusText="Boa"
                size="lg"
                variant="compact"
                colorScheme="blue"
              />
              <KPICard
                title="Nuvens"
                value="45"
                unit="%"
                status="neutral"
                statusText="Médio"
                size="lg"
                variant="compact"
                colorScheme="gray"
              />
              <KPICard
                title="Pressão"
                value="1013"
                unit="hPa"
                status="success"
                statusText="Normal"
                size="lg"
                variant="compact"
                colorScheme="purple"
              />
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Alertas Climáticos</Heading>
            <Text fontSize="sm" color="gray.600">
              Sistema proativo com cores semânticas (Verde/Amarelo/Vermelho)
            </Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              
              <Card borderRadius="16px" bg="red.50" borderLeftWidth="4px" borderLeftColor="red.400">
                <CardBody>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={2}>
                      <HStack>
                        <StatusPill variant="error" size="sm">ALTA PRIORIDADE</StatusPill>
                        <StatusTag category="climate" size="sm">GEADA</StatusTag>
                      </HStack>
                      <Text fontWeight="semibold">Alerta de Geada - Região Sul de MG</Text>
                      <Text fontSize="sm" color="gray.600">
                        Temperaturas podem atingir -2°C nas próximas 48h. 
                        Recomendado proteção de mudas e irrigação preventiva.
                      </Text>
                    </VStack>
                    <Text fontSize="xs" color="gray.500">há 30min</Text>
                  </HStack>
                </CardBody>
              </Card>

              <Card borderRadius="16px" bg="yellow.50" borderLeftWidth="4px" borderLeftColor="yellow.400">
                <CardBody>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={2}>
                      <HStack>
                        <StatusPill variant="warning" size="sm">MÉDIA</StatusPill>
                        <StatusTag category="climate" size="sm">CHUVA</StatusTag>
                      </HStack>
                      <Text fontWeight="semibold">Chuvas Intensas Previstas</Text>
                      <Text fontSize="sm" color="gray.600">
                        Volume de 80-120mm esperado para os próximos 5 dias.
                        Monitorar drenagem dos talhões.
                      </Text>
                    </VStack>
                    <Text fontSize="xs" color="gray.500">há 2h</Text>
                  </HStack>
                </CardBody>
              </Card>

              <Card borderRadius="16px" bg="green.50" borderLeftWidth="4px" borderLeftColor="green.400">
                <CardBody>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={2}>
                      <HStack>
                        <StatusPill variant="success" size="sm">BAIXA</StatusPill>
                        <StatusTag category="climate" size="sm">FAVORÁVEL</StatusTag>
                      </HStack>
                      <Text fontWeight="semibold">Condições Ideais para Colheita</Text>
                      <Text fontSize="sm" color="gray.600">
                        Tempo seco e temperaturas amenas nos próximos 7 dias.
                        Período ideal para intensificar a colheita.
                      </Text>
                    </VStack>
                    <Text fontSize="xs" color="gray.500">há 4h</Text>
                  </HStack>
                </CardBody>
              </Card>

            </VStack>
          </CardBody>
        </Card>

      </VStack>
    </Box>
  ),
};