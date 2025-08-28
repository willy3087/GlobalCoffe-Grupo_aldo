import type { Meta, StoryObj } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Features from './Features';

const meta: Meta<typeof Features> = {
  title: 'Pages/Features',
  component: Features,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Página de funcionalidades do sistema Global Coffee, apresentando todas as características e benefícios da plataforma.'
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
  render: () => <Features />,
  parameters: {
    docs: {
      description: {
        story: 'Página completa de funcionalidades com seções para diferentes tipos de usuários e casos de uso.'
      }
    }
  },
};

export const MobileView: Story = {
  render: () => <Features />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Visualização móvel da página de funcionalidades com layout otimizado para dispositivos móveis.'
      }
    }
  },
};