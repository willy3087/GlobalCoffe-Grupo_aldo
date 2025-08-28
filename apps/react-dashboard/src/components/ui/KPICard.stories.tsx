import type { Meta, StoryObj } from '@storybook/react';
import { SimpleGrid, VStack, Text } from '@chakra-ui/react';
import { DollarSign, TrendingUp, Thermometer, Coffee, Activity, Shield } from 'react-feather';
import KPICard from './KPICard';

const meta: Meta<typeof KPICard> = {
  title: 'Components/UI/KPICard',
  component: KPICard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente versátil para exibir KPIs e métricas importantes com diferentes variações de layout e funcionalidades.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Variação do layout do card'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamanho do card'
    },
    changeType: {
      control: 'select',
      options: ['increase', 'decrease', 'neutral'],
      description: 'Tipo de mudança para exibir seta'
    },
    status: {
      control: 'select',
      options: ['high', 'medium', 'low', 'success', 'warning', 'error', 'info', 'positive', 'negative', 'neutral'],
      description: 'Status pill variant'
    },
    colorScheme: {
      control: 'select',
      options: ['blue', 'green', 'red', 'orange', 'purple', 'cyan', 'teal'],
      description: 'Esquema de cores'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carregamento'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Preço do Café',
    value: '$4.25',
    unit: '/lb',
    change: 3.2,
    changeType: 'increase',
    icon: DollarSign,
    iconColor: 'green.500',
    colorScheme: 'green',
  },
};

export const AllVariants: Story = {
  render: () => (
    <VStack spacing={6} align="stretch">
      <Text fontWeight="bold" fontSize="lg">Variantes de Layout</Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <KPICard
          title="Default"
          value="$4.25"
          unit="/lb" 
          change={3.2}
          changeType="increase"
          icon={DollarSign}
          iconColor="green.500"
          colorScheme="green"
          variant="default"
        />
        <KPICard
          title="Compact"
          value="12.5"
          unit="%"
          change={-1.5}
          changeType="decrease" 
          icon={TrendingUp}
          iconColor="red.500"
          colorScheme="red"
          variant="compact"
        />
        <KPICard
          title="Detailed"
          value="24.8"
          unit="°C"
          subtitle="Temperatura média nas regiões produtoras"
          progress={68}
          status="success"
          statusText="Ideal"
          icon={Thermometer}
          iconColor="orange.500"
          colorScheme="orange"
          variant="detailed"
        />
      </SimpleGrid>
    </VStack>
  ),
};

export const AllSizes: Story = {
  args: {
    status: "high"
  },

  render: () => (
    <VStack spacing={6} align="stretch">
      <Text fontWeight="bold" fontSize="lg">Tamanhos</Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <KPICard
          title="Small"
          value="85"
          unit="/100"
          change={2.1}
          changeType="increase"
          icon={Shield}
          size="sm"
        />
        <KPICard
          title="Medium"
          value="142.3"
          unit="M sacas"
          change={4.7}
          changeType="increase"
          icon={Coffee}
          size="md"
        />
        <KPICard
          title="Large"
          value="$1.2B"
          unit="volume"
          change={8.9}
          changeType="increase"
          icon={Activity}
          size="lg"
        />
      </SimpleGrid>
    </VStack>
  )
};

export const WithStatus: Story = {
  render: () => (
    <VStack spacing={6} align="stretch">
      <Text fontWeight="bold" fontSize="lg">Com Status Pills</Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <KPICard
          title="Qualidade"
          value="87"
          unit="/100"
          status="success"
          statusText="Excelente"
          icon={Shield}
          iconColor="green.500"
          colorScheme="green"
        />
        <KPICard
          title="Volatilidade"
          value="18.5"
          unit="%"
          status="warning"
          statusText="Alta"
          icon={TrendingUp}
          iconColor="orange.500"
          colorScheme="orange"
        />
      </SimpleGrid>
    </VStack>
  ),
};

export const WithProgress: Story = {
  render: () => (
    <VStack spacing={6} align="stretch">
      <Text fontWeight="bold" fontSize="lg">Com Barras de Progresso</Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <KPICard
          title="Safra 2024"
          value="68"
          unit="%"
          progress={68}
          progressMax={100}
          subtitle="Progresso da colheita"
          icon={Coffee}
          iconColor="green.500"
          colorScheme="green"
          variant="detailed"
        />
        <KPICard
          title="Meta Anual"
          value="142"
          unit="M sacas"
          progress={142}
          progressMax={200}
          subtitle="71% da meta alcançada"
          icon={Activity}
          iconColor="blue.500"
          colorScheme="blue"
          variant="detailed"
        />
      </SimpleGrid>
    </VStack>
  ),
};

export const LoadingState: Story = {
  args: {
    title: 'Carregando dados...',
    value: '',
    loading: true,
  },
};

export const CoffeeMarketDashboard: Story = {
  render: () => (
    <VStack spacing={6} align="stretch">
      <Text fontWeight="bold" fontSize="lg">Dashboard do Mercado de Café</Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <KPICard
          title="Preço Arábica"
          value="$4.25"
          unit="/lb"
          change={3.2}
          changeType="increase"
          status="positive"
          statusText="Alta"
          icon={DollarSign}
          iconColor="green.500"
          colorScheme="green"
          variant="default"
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
          title="Temperatura Média"
          value="24.8"
          unit="°C"
          subtitle="Ideal para cultivo"
          progress={82}
          status="success"
          statusText="Ótima"
          icon={Thermometer}
          iconColor="red.500"
          colorScheme="blue"
          variant="detailed"
        />
        <KPICard
          title="Qualidade SCA"
          value="85.3"
          unit="/100"
          change={1.8}
          changeType="increase"
          status="high"
          statusText="Premium"
          icon={Shield}
          iconColor="purple.500"
          colorScheme="purple"
          variant="default"
        />
      </SimpleGrid>
    </VStack>
  ),
};