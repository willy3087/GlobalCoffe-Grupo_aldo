import type { Meta, StoryObj } from '@storybook/react';
import { 
  Box, 
  SimpleGrid, 
  VStack, 
  Text, 
  Card, 
  CardBody,
  HStack,
  Badge,
  ChakraProvider 
} from '@chakra-ui/react';
import { DollarSign, TrendingUp, Coffee } from 'react-feather';
import { ThemeProvider } from '../contexts/ThemeContext';

// Import components for showcase
import StatusPill from '../components/common/StatusPill';
import StatusTag from '../components/common/StatusTag';
import KPICard from '../components/ui/KPICard';
import NewsCard from '../components/ui/NewsCard';
import { SunnyIcon, RainIcon } from '../components/icons/WeatherIcons';
import { CoffeeIcon, DollarSignIcon } from '../components/icons/CustomIcons';

const meta: Meta = {
  title: 'Overview/Component Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Visão geral de todos os componentes disponíveis no Design System Global Coffee.'
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

export const AllComponents: Story = {
  render: () => (
    <Box p={8} maxW="1400px" mx="auto">
      <VStack spacing={12} align="stretch">
        
        {/* Header */}
        <VStack spacing={4} align="center" textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Global Coffee Design System
          </Text>
          <Text fontSize="lg" color="gray.600" maxW="800px">
            Sistema validado através da fase Discovery com produtores, cooperativas e traders.
            Otimizado para <strong>José Silva</strong> - produtor familiar com baixa familiaridade digital.
          </Text>
          <HStack spacing={4} flexWrap="wrap" justify="center">
            <Badge colorScheme="green" variant="subtle" p={2}>
              ✓ Validado em Campo
            </Badge>
            <Badge colorScheme="blue" variant="subtle" p={2}>
              ✓ Pesquisa com Usuários
            </Badge>
            <Badge colorScheme="orange" variant="subtle" p={2}>
              ✓ Otimizado Mobile
            </Badge>
            <Badge colorScheme="purple" variant="subtle" p={2}>
              ✓ APIs Integradas
            </Badge>
          </HStack>
        </VStack>

        {/* Status Components */}
        <VStack spacing={6} align="stretch">
          <VStack spacing={2} align="start">
            <Text fontSize="2xl" fontWeight="semibold">Status & Indicators</Text>
            <Text color="gray.600">Componentes para status, prioridade e categorização</Text>
          </VStack>
          
          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <VStack spacing={3} align="start">
                  <Text fontWeight="medium">Status Pills</Text>
                  <HStack spacing={3} flexWrap="wrap">
                    <StatusPill variant="high">Alta</StatusPill>
                    <StatusPill variant="medium">Média</StatusPill>
                    <StatusPill variant="success">Sucesso</StatusPill>
                    <StatusPill variant="warning">Aviso</StatusPill>
                    <StatusPill variant="positive">+5.2%</StatusPill>
                    <StatusPill variant="negative">-2.1%</StatusPill>
                  </HStack>
                </VStack>
                
                <VStack spacing={3} align="start">
                  <Text fontWeight="medium">Status Tags</Text>
                  <HStack spacing={3} flexWrap="wrap">
                    <StatusTag category="market">MERCADO</StatusTag>
                    <StatusTag category="climate">CLIMA</StatusTag>
                    <StatusTag category="technology">TECNOLOGIA</StatusTag>
                    <StatusTag category="sustainability">SUSTENTÁVEL</StatusTag>
                  </HStack>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Icons */}
        <VStack spacing={6} align="stretch">
          <VStack spacing={2} align="start">
            <Text fontSize="2xl" fontWeight="semibold">Icons</Text>
            <Text color="gray.600">Ícones climáticos e customizados</Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <Card>
              <CardBody textAlign="center">
                <VStack spacing={3}>
                  <SunnyIcon color="orange.400" boxSize={10} />
                  <Text fontWeight="medium">Weather Icons</Text>
                  <Badge colorScheme="orange">Climáticos</Badge>
                </VStack>
              </CardBody>
            </Card>
            <Card>
              <CardBody textAlign="center">
                <VStack spacing={3}>
                  <CoffeeIcon color="brown" boxSize={10} />
                  <Text fontWeight="medium">Custom Icons</Text>
                  <Badge colorScheme="brown">Personalizados</Badge>
                </VStack>
              </CardBody>
            </Card>
            <Card>
              <CardBody textAlign="center">
                <VStack spacing={3}>
                  <DollarSignIcon color="green.500" boxSize={10} />
                  <Text fontWeight="medium">Market Icons</Text>
                  <Badge colorScheme="green">Mercado</Badge>
                </VStack>
              </CardBody>
            </Card>
            <Card>
              <CardBody textAlign="center">
                <VStack spacing={3}>
                  <RainIcon color="blue.500" boxSize={10} />
                  <Text fontWeight="medium">Climate Icons</Text>
                  <Badge colorScheme="blue">Clima</Badge>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>

        {/* KPI Cards */}
        <VStack spacing={6} align="stretch">
          <VStack spacing={2} align="start">
            <Text fontSize="2xl" fontWeight="semibold">KPI Cards</Text>
            <Text color="gray.600">Cards versáteis para métricas e KPIs</Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <KPICard
              title="Preço Café"
              value="$4.25"
              unit="/lb"
              change={3.2}
              changeType="increase"
              status="positive"
              statusText="Alta"
              icon={DollarSign}
              iconColor="green.500"
              colorScheme="green"
            />
            <KPICard
              title="Produção Global"
              value="167.2"
              unit="M sacas"
              change={-2.1}
              changeType="decrease"
              status="warning"
              statusText="Abaixo"
              icon={Coffee}
              iconColor="orange.500"
              colorScheme="orange"
              variant="compact"
            />
            <KPICard
              title="Qualidade SCA"
              value="85.3"
              unit="/100"
              subtitle="Score médio de qualidade"
              progress={85}
              status="success"
              statusText="Excelente"
              icon={TrendingUp}
              iconColor="blue.500"
              colorScheme="blue"
              variant="detailed"
            />
          </SimpleGrid>
        </VStack>

        {/* News Cards */}
        <VStack spacing={6} align="stretch">
          <VStack spacing={2} align="start">
            <Text fontSize="2xl" fontWeight="semibold">News Cards</Text>
            <Text color="gray.600">Cards para notícias com diferentes layouts</Text>
          </VStack>
          
          <VStack spacing={4} align="stretch">
            <NewsCard
              title="Preços do café arábica atingem máxima histórica"
              excerpt="Condições climáticas adversas e alta demanda global impulsionam os preços da commodity para níveis recordes."
              imageUrl="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400"
              source="Coffee Market News"
              publishedAt="2024-01-15T10:30:00Z"
              url="#"
              category="Mercado"
              priority="high"
              relevance={95}
              readTime={4}
              views={2341}
              comments={87}
              variant="featured"
            />
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <NewsCard
                title="Nova tecnologia de secagem sustentável"
                source="Agro Innovation"
                publishedAt="2024-01-14T15:45:00Z"
                url="#"
                category="Tecnologia"
                priority="info"
                readTime={3}
                variant="compact"
              />
              <NewsCard
                title="Relatório de safra 2024 será divulgado"
                source="CONAB"
                publishedAt="2024-01-14T12:00:00Z"
                url="#"
                category="Produção"
                priority="neutral"
                variant="minimal"
              />
            </SimpleGrid>
          </VStack>
        </VStack>

        {/* Usage Stats */}
        <Card borderRadius="16px" bg="gray.50">
          <CardBody>
            <VStack spacing={4} align="center">
              <Text fontSize="xl" fontWeight="semibold">Estatísticas do Design System</Text>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} textAlign="center">
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.500">25+</Text>
                  <Text fontSize="sm" color="gray.600">Componentes</Text>
                </VStack>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">50+</Text>
                  <Text fontSize="sm" color="gray.600">Variantes</Text>
                </VStack>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.500">15+</Text>
                  <Text fontSize="sm" color="gray.600">Ícones</Text>
                </VStack>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.500">8</Text>
                  <Text fontSize="sm" color="gray.600">Páginas</Text>
                </VStack>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
        
      </VStack>
    </Box>
  ),
};