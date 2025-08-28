import type { Meta, StoryObj } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Dashboard from './Dashboard';

const meta: Meta<typeof Dashboard> = {
  title: 'Pages/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Dashboard principal para usuários logados, com métricas detalhadas, gráficos e ferramentas de análise do mercado de café.'
      }
    }
  },
  decorators: [
    (Story) => (
      <ChakraProvider>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <Story />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </ChakraProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Dashboard />,
  parameters: {
    docs: {
      description: {
        story: 'Dashboard completo com todos os componentes de análise, KPIs, gráficos e dados em tempo real do mercado de café.'
      }
    }
  },
};

export const MobileView: Story = {
  render: () => <Dashboard />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Visualização móvel do dashboard com layout responsivo adaptado para telas pequenas.'
      }
    }
  },
};