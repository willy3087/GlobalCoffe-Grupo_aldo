import type { Meta, StoryObj } from '@storybook/react';
import { VStack, HStack, Text, Box } from '@chakra-ui/react';
import { 
  TrendingUpIcon, 
  CloudIcon, 
  MapIcon, 
  BarChartIcon, 
  DollarSignIcon, 
  ThermometerIcon,
  DropletIcon,
  WindIcon,
  CoffeeIcon,
  GlobeIcon,
  ShieldIcon,
  AwardIcon
} from './CustomIcons';

const meta: Meta = {
  title: 'Components/Icons/CustomIcons',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Coleção de ícones customizados para uso específico no sistema Global Coffee, incluindo ícones relacionados ao mercado, clima e café.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const IconShowcase = ({ Icon, name, description }: { 
  Icon: React.ComponentType<any>, 
  name: string,
  description?: string 
}) => (
  <VStack spacing={2} p={4} border="1px" borderColor="gray.200" borderRadius="16px" minW="120px">
    <Icon color="blue.500" boxSize={8} />
    <Text fontSize="sm" fontWeight="medium" textAlign="center">{name}</Text>
    {description && <Text fontSize="xs" color="gray.600" textAlign="center">{description}</Text>}
  </VStack>
);

export const AllCustomIcons: Story = {
  render: () => (
    <VStack spacing={6} align="stretch">
      <Text fontWeight="bold" fontSize="lg">Ícones de Mercado e Dados</Text>
      <HStack spacing={4} flexWrap="wrap" justify="center">
        <IconShowcase Icon={TrendingUpIcon} name="Trending Up" description="Tendências de alta" />
        <IconShowcase Icon={BarChartIcon} name="Bar Chart" description="Gráficos e análises" />
        <IconShowcase Icon={DollarSignIcon} name="Dollar Sign" description="Preços e valores" />
        <IconShowcase Icon={MapIcon} name="Map" description="Localização e regiões" />
        <IconShowcase Icon={GlobeIcon} name="Globe" description="Mercado global" />
      </HStack>
      
      <Text fontWeight="bold" fontSize="lg" mt={8}>Ícones Climáticos</Text>
      <HStack spacing={4} flexWrap="wrap" justify="center">
        <IconShowcase Icon={CloudIcon} name="Cloud" description="Condições climáticas" />
        <IconShowcase Icon={ThermometerIcon} name="Thermometer" description="Temperatura" />
        <IconShowcase Icon={DropletIcon} name="Droplet" description="Umidade e chuva" />
        <IconShowcase Icon={WindIcon} name="Wind" description="Vento" />
      </HStack>

      <Text fontWeight="bold" fontSize="lg" mt={8}>Ícones do Domínio</Text>
      <HStack spacing={4} flexWrap="wrap" justify="center">
        <IconShowcase Icon={CoffeeIcon} name="Coffee" description="Produto principal" />
        <IconShowcase Icon={ShieldIcon} name="Shield" description="Qualidade e segurança" />
        <IconShowcase Icon={AwardIcon} name="Award" description="Certificações" />
      </HStack>
    </VStack>
  ),
};

export const IconSizes: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Variações de Tamanho</Text>
      <HStack spacing={6} align="center">
        <VStack spacing={2}>
          <CoffeeIcon color="brown" boxSize={4} />
          <Text fontSize="xs">16px</Text>
        </VStack>
        <VStack spacing={2}>
          <CoffeeIcon color="brown" boxSize={6} />
          <Text fontSize="xs">24px</Text>
        </VStack>
        <VStack spacing={2}>
          <CoffeeIcon color="brown" boxSize={8} />
          <Text fontSize="xs">32px</Text>
        </VStack>
        <VStack spacing={2}>
          <CoffeeIcon color="brown" boxSize={12} />
          <Text fontSize="xs">48px</Text>
        </VStack>
        <VStack spacing={2}>
          <CoffeeIcon color="brown" boxSize={16} />
          <Text fontSize="xs">64px</Text>
        </VStack>
      </HStack>
    </VStack>
  ),
};

export const IconColors: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Paleta de Cores</Text>
      <HStack spacing={4} align="center">
        <VStack spacing={2}>
          <DollarSignIcon color="green.500" boxSize={8} />
          <Text fontSize="xs">Verde</Text>
        </VStack>
        <VStack spacing={2}>
          <TrendingUpIcon color="blue.500" boxSize={8} />
          <Text fontSize="xs">Azul</Text>
        </VStack>
        <VStack spacing={2}>
          <ThermometerIcon color="red.500" boxSize={8} />
          <Text fontSize="xs">Vermelho</Text>
        </VStack>
        <VStack spacing={2}>
          <CoffeeIcon color="orange.600" boxSize={8} />
          <Text fontSize="xs">Laranja</Text>
        </VStack>
        <VStack spacing={2}>
          <AwardIcon color="yellow.500" boxSize={8} />
          <Text fontSize="xs">Amarelo</Text>
        </VStack>
        <VStack spacing={2}>
          <ShieldIcon color="purple.500" boxSize={8} />
          <Text fontSize="xs">Roxo</Text>
        </VStack>
      </HStack>
    </VStack>
  ),
};

export const CoffeeMarketApplication: Story = {
  render: () => (
    <VStack spacing={6} align="stretch">
      <Text fontWeight="bold" fontSize="lg">Aplicação no Sistema Global Coffee</Text>
      
      <Box p={4} bg="gray.50" borderRadius="16px">
        <Text fontWeight="semibold" mb={3}>Dashboard Principal</Text>
        <HStack spacing={6} flexWrap="wrap">
          <VStack spacing={1}>
            <DollarSignIcon color="green.600" boxSize={8} />
            <Text fontSize="sm">Preços</Text>
            <Text fontSize="xs" fontWeight="bold">$4.25/lb</Text>
          </VStack>
          <VStack spacing={1}>
            <TrendingUpIcon color="blue.600" boxSize={8} />
            <Text fontSize="sm">Tendência</Text>
            <Text fontSize="xs" color="green.600">+5.2%</Text>
          </VStack>
          <VStack spacing={1}>
            <BarChartIcon color="purple.600" boxSize={8} />
            <Text fontSize="sm">Análise</Text>
            <Text fontSize="xs" color="gray.600">Disponível</Text>
          </VStack>
        </HStack>
      </Box>

      <Box p={4} bg="blue.50" borderRadius="16px">
        <Text fontWeight="semibold" mb={3}>Monitoramento Climático</Text>
        <HStack spacing={4}>
          <VStack spacing={1}>
            <ThermometerIcon color="red.500" boxSize={8} />
            <Text fontSize="sm">Temperatura</Text>
            <Text fontSize="xs">24°C</Text>
          </VStack>
          <VStack spacing={1}>
            <DropletIcon color="cyan.500" boxSize={8} />
            <Text fontSize="sm">Umidade</Text>
            <Text fontSize="xs">68%</Text>
          </VStack>
          <VStack spacing={1}>
            <WindIcon color="gray.500" boxSize={8} />
            <Text fontSize="sm">Vento</Text>
            <Text fontSize="xs">12 km/h</Text>
          </VStack>
        </HStack>
      </Box>

      <Box p={4} bg="green.50" borderRadius="16px">
        <Text fontWeight="semibold" mb={3}>Qualidade e Certificações</Text>
        <HStack spacing={4}>
          <VStack spacing={1}>
            <CoffeeIcon color="orange.700" boxSize={8} />
            <Text fontSize="sm">Produto</Text>
            <Text fontSize="xs">Arábica</Text>
          </VStack>
          <VStack spacing={1}>
            <AwardIcon color="yellow.600" boxSize={8} />
            <Text fontSize="sm">Certificação</Text>
            <Text fontSize="xs">Orgânico</Text>
          </VStack>
          <VStack spacing={1}>
            <ShieldIcon color="green.600" boxSize={8} />
            <Text fontSize="sm">Qualidade</Text>
            <Text fontSize="xs">85/100</Text>
          </VStack>
        </HStack>
      </Box>

      <Box p={4} bg="orange.50" borderRadius="16px">
        <Text fontWeight="semibold" mb={3}>Alcance Global</Text>
        <HStack spacing={4}>
          <VStack spacing={1}>
            <GlobeIcon color="blue.600" boxSize={8} />
            <Text fontSize="sm">Mercados</Text>
            <Text fontSize="xs">25 países</Text>
          </VStack>
          <VStack spacing={1}>
            <MapIcon color="green.600" boxSize={8} />
            <Text fontSize="sm">Regiões</Text>
            <Text fontSize="xs">12 regiões</Text>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  ),
};