import type { Meta, StoryObj } from '@storybook/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import HeroSection from './HeroSection';

const meta: Meta<typeof HeroSection> = {
  title: 'Components/Home/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Seção hero da página inicial com imagens rotativas, formulário de busca e chamadas para ação.'
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
  argTypes: {
    searchQuery: {
      control: 'text',
      description: 'Valor atual do campo de busca'
    },
    setSearchQuery: {
      description: 'Função para atualizar o valor da busca'
    },
    handleSearch: {
      description: 'Função executada ao realizar a busca'
    },
    navigate: {
      description: 'Função de navegação para outras páginas'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchQuery: '',
    setSearchQuery: (query: string) => console.log('setSearchQuery:', query),
    handleSearch: () => console.log('handleSearch called'),
    navigate: (path: string) => console.log('navigate to:', path),
  },
  parameters: {
    docs: {
      description: {
        story: 'Hero section padrão com imagens rotativas, campo de busca e botões de ação principais.'
      }
    }
  },
};

export const WithSearchQuery: Story = {
  args: {
    searchQuery: 'preços café arábica',
    setSearchQuery: (query: string) => console.log('setSearchQuery:', query),
    handleSearch: () => console.log('handleSearch called'),
    navigate: (path: string) => console.log('navigate to:', path),
  },
  parameters: {
    docs: {
      description: {
        story: 'Hero section com uma consulta de busca preenchida, simulando a interação do usuário.'
      }
    }
  },
};

export const MobileView: Story = {
  args: {
    searchQuery: '',
    setSearchQuery: (query: string) => console.log('setSearchQuery:', query),
    handleSearch: () => console.log('handleSearch called'),
    navigate: (path: string) => console.log('navigate to:', path),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Hero section adaptada para dispositivos móveis com layout responsivo.'
      }
    }
  },
};