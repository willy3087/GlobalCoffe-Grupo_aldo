import type { Meta, StoryObj } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import KPIsProdutor from './KPIsProdutor';

const meta: Meta<typeof KPIsProdutor> = {
  title: 'Pages/KPIsProdutor',
  component: KPIsProdutor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Dashboard especializado para produtores de café com KPIs específicos, análise de preços, cenários de mercado e recomendações de canais de venda.'
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
  render: () => <KPIsProdutor />,
  parameters: {
    docs: {
      description: {
        story: 'Dashboard completo para produtores com KPIs principais, análise de cenários, canais de venda e proteção de preços.'
      }
    }
  },
};

export const MobileView: Story = {
  render: () => <KPIsProdutor />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Visualização móvel do dashboard do produtor com layout adaptado para facilitar o acesso em campo.'
      }
    }
  },
};

export const TabletView: Story = {
  render: () => <KPIsProdutor />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Visualização em tablet otimizada para produtores que usam tablets para gestão da fazenda.'
      }
    }
  },
};