import type { Meta, StoryObj } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import DashboardKPIs from './DashboardKPIs';

const meta: Meta<typeof DashboardKPIs> = {
  title: 'Components/Dashboard/DashboardKPIs',
  component: DashboardKPIs,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Dashboard principal com KPIs do mercado de café, incluindo dados climáticos, notícias e mapas interativos.'
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

export const Default: Story = {
  render: () => <DashboardKPIs />,
  parameters: {
    docs: {
      description: {
        story: 'Dashboard completo com todos os KPIs, gráficos climáticos, feed de notícias e mapas. Este componente integra APIs externas para dados em tempo real.'
      }
    }
  },
};

export const LoadingState: Story = {
  render: () => <DashboardKPIs />,
  parameters: {
    docs: {
      description: {
        story: 'Estado de carregamento do dashboard enquanto os dados das APIs são buscados. Mostra placeholders e indicadores de loading.'
      }
    }
  },
};