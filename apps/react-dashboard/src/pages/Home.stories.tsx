import type { Meta, StoryObj } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Home from './Home';

const meta: Meta<typeof Home> = {
  title: 'Pages/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Página inicial do sistema Global Coffee com dashboard, estatísticas, notícias e seção hero.'
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
  render: () => <Home />,
  parameters: {
    docs: {
      description: {
        story: 'Página inicial completa com todas as seções: hero, estatísticas, notícias recentes e componentes interativos.'
      }
    }
  },
};

export const MobileView: Story = {
  render: () => <Home />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Visualização da página inicial em dispositivos móveis, com layout adaptado para telas menores.'
      }
    }
  },
};

export const TabletView: Story = {
  render: () => <Home />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Visualização da página inicial em tablets, com layout otimizado para telas médias.'
      }
    }
  },
};