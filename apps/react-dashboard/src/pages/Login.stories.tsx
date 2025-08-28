import type { Meta, StoryObj } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Login from './Login';

const meta: Meta<typeof Login> = {
  title: 'Pages/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Página de login do sistema Global Coffee com autenticação de usuários e opções de acesso.'
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
  render: () => <Login />,
  parameters: {
    docs: {
      description: {
        story: 'Formulário de login padrão com campos de email/senha e opções de recuperação.'
      }
    }
  },
};

export const MobileView: Story = {
  render: () => <Login />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Visualização móvel da página de login com layout adaptado para dispositivos móveis.'
      }
    }
  },
};