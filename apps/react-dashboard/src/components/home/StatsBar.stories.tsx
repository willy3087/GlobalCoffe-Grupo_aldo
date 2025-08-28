import type { Meta, StoryObj } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { DollarSign, TrendingUp, Thermometer, Droplet } from 'react-feather';
import StatsBar from './StatsBar';

const meta: Meta<typeof StatsBar> = {
  title: 'Components/Home/StatsBar',
  component: StatsBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Barra de estatísticas com métricas principais do mercado de café, incluindo preços, tendências e dados climáticos.'
      }
    }
  },
  decorators: [
    (Story) => (
      <ChakraProvider>
        <Story />
      </ChakraProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockStats = [
  {
    label: 'Preço Arábica',
    value: '$4.25',
    subValue: '/lb',
    change: 3.2,
    trend: 'increase' as const,
    icon: DollarSign,
    color: 'green',
  },
  {
    label: 'Volatilidade',
    value: '12.5',
    subValue: '%',
    change: -1.5,
    trend: 'decrease' as const,
    icon: TrendingUp,
    color: 'blue',
  },
  {
    label: 'Temperatura Média',
    value: '24.8',
    subValue: '°C',
    change: 0,
    trend: 'neutral' as const,
    icon: Thermometer,
    color: 'red',
  },
  {
    label: 'Precipitação',
    value: '125',
    subValue: 'mm',
    change: 8.7,
    trend: 'increase' as const,
    icon: Droplet,
    color: 'cyan',
  },
];

const positiveStats = [
  {
    label: 'Preço Arábica',
    value: '$4.75',
    subValue: '/lb',
    change: 8.3,
    trend: 'increase' as const,
    icon: DollarSign,
    color: 'green',
  },
  {
    label: 'Demanda Global',
    value: '167.2',
    subValue: 'M sacas',
    change: 4.2,
    trend: 'increase' as const,
    icon: TrendingUp,
    color: 'blue',
  },
  {
    label: 'Qualidade Média',
    value: '85.3',
    subValue: '/100',
    change: 2.1,
    trend: 'increase' as const,
    icon: DollarSign,
    color: 'purple',
  },
  {
    label: 'Sustentabilidade',
    value: '78',
    subValue: '% cert.',
    change: 5.5,
    trend: 'increase' as const,
    icon: Droplet,
    color: 'green',
  },
];

const negativeStats = [
  {
    label: 'Preço Arábica',
    value: '$3.85',
    subValue: '/lb',
    change: -5.2,
    trend: 'decrease' as const,
    icon: DollarSign,
    color: 'red',
  },
  {
    label: 'Produção Brasil',
    value: '48.5',
    subValue: 'M sacas',
    change: -12.3,
    trend: 'decrease' as const,
    icon: TrendingUp,
    color: 'orange',
  },
  {
    label: 'Índice Climático',
    value: '42',
    subValue: '/100',
    change: -8.7,
    trend: 'decrease' as const,
    icon: Thermometer,
    color: 'red',
  },
  {
    label: 'Reservas Globais',
    value: '22.1',
    subValue: 'M sacas',
    change: -15.4,
    trend: 'decrease' as const,
    icon: Droplet,
    color: 'orange',
  },
];

export const Default: Story = {
  args: {
    stats: mockStats,
  },
  parameters: {
    docs: {
      description: {
        story: 'Barra de estatísticas padrão com mix de tendências positivas, negativas e neutras.'
      }
    }
  },
};

export const PositiveTrends: Story = {
  args: {
    stats: positiveStats,
  },
  parameters: {
    docs: {
      description: {
        story: 'Cenário otimista com todas as métricas em alta, representando um mercado favorável.'
      }
    }
  },
};

export const NegativeTrends: Story = {
  args: {
    stats: negativeStats,
  },
  parameters: {
    docs: {
      description: {
        story: 'Cenário pessimista com métricas em declínio, indicando desafios no mercado.'
      }
    }
  },
};

export const TwoColumns: Story = {
  args: {
    stats: mockStats.slice(0, 2),
  },
  parameters: {
    docs: {
      description: {
        story: 'Layout com apenas duas colunas para espaços mais compactos ou destaque de métricas específicas.'
      }
    }
  },
};

export const MobileView: Story = {
  args: {
    stats: mockStats,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Visualização móvel com layout responsivo em duas colunas.'
      }
    }
  },
};