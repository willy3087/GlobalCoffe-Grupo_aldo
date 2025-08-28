import type { Meta, StoryObj } from '@storybook/react';
import { VStack, HStack, Text } from '@chakra-ui/react';
import StatusPill, { 
  PillVariant, 
  getPillVariant, 
  getPillVariantByRelevance,
  getPillVariantByPercentage,
  getPillVariantByScore,
  getPillVariantByChange 
} from './StatusPill';

const meta: Meta<typeof StatusPill> = {
  title: 'Components/Common/StatusPill',
  component: StatusPill,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Pills são indicadores visuais para status, prioridade e relevância. Possuem formato arredondado com fundos suaves e bordas sutis.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['high', 'medium', 'low', 'neutral', 'success', 'warning', 'error', 'info', 'positive', 'negative'],
      description: 'Variante do pill que define a cor e o significado'
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Tamanho do pill'
    },
    pillStyle: {
      control: 'select',
      options: ['default', 'solid', 'subtle'],
      description: 'Estilo visual do pill'
    },
    children: {
      control: 'text',
      description: 'Conteúdo do pill'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'neutral',
    children: 'Status',
  },
};

export const AllVariants: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Variantes de Status</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusPill variant="high">Alta</StatusPill>
        <StatusPill variant="medium">Média</StatusPill>
        <StatusPill variant="low">Baixa</StatusPill>
        <StatusPill variant="neutral">Neutro</StatusPill>
      </HStack>
      
      <Text fontWeight="bold">Variantes Semânticas</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusPill variant="success">Sucesso</StatusPill>
        <StatusPill variant="warning">Aviso</StatusPill>
        <StatusPill variant="error">Erro</StatusPill>
        <StatusPill variant="info">Info</StatusPill>
      </HStack>

      <Text fontWeight="bold">Variações de Valor</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusPill variant="positive">+5.2%</StatusPill>
        <StatusPill variant="negative">-2.1%</StatusPill>
      </HStack>
    </VStack>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Tamanhos</Text>
      <HStack spacing={3} align="center">
        <StatusPill variant="success" size="sm">Small</StatusPill>
        <StatusPill variant="success" size="md">Medium</StatusPill>
      </HStack>
    </VStack>
  ),
};

export const AllStyles: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Estilos Visuais</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusPill variant="info" pillStyle="default">Default</StatusPill>
        <StatusPill variant="info" pillStyle="solid">Solid</StatusPill>
        <StatusPill variant="info" pillStyle="subtle">Subtle</StatusPill>
      </HStack>
    </VStack>
  ),
};

export const HelperFunctions: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Helpers de Prioridade</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusPill variant={getPillVariant('alta')}>Alta Prioridade</StatusPill>
        <StatusPill variant={getPillVariant('média')}>Média Prioridade</StatusPill>
        <StatusPill variant={getPillVariant('baixa')}>Baixa Prioridade</StatusPill>
      </HStack>

      <Text fontWeight="bold">Por Relevância (%)</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusPill variant={getPillVariantByRelevance(85)}>85% Relevante</StatusPill>
        <StatusPill variant={getPillVariantByRelevance(55)}>55% Relevante</StatusPill>
        <StatusPill variant={getPillVariantByRelevance(25)}>25% Relevante</StatusPill>
      </HStack>

      <Text fontWeight="bold">Por Score</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusPill variant={getPillVariantByScore(90)}>Score: 90</StatusPill>
        <StatusPill variant={getPillVariantByScore(65)}>Score: 65</StatusPill>
        <StatusPill variant={getPillVariantByScore(30)}>Score: 30</StatusPill>
      </HStack>

      <Text fontWeight="bold">Por Mudança (%)</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusPill variant={getPillVariantByChange(5.2)}>+5.2%</StatusPill>
        <StatusPill variant={getPillVariantByChange(-2.1)}>-2.1%</StatusPill>
        <StatusPill variant={getPillVariantByChange(0)}>0%</StatusPill>
      </HStack>
    </VStack>
  ),
};

export const CoffeeMarketExample: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Aplicação no Mercado do Café</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusPill variant="positive">Preço +3.5%</StatusPill>
        <StatusPill variant="success">Qualidade: 85</StatusPill>
        <StatusPill variant="warning">Clima: Instável</StatusPill>
        <StatusPill variant="high">Alta Demanda</StatusPill>
        <StatusPill variant="info">Safra 2024</StatusPill>
        <StatusPill variant="error">Estoque Baixo</StatusPill>
      </HStack>
    </VStack>
  ),
};