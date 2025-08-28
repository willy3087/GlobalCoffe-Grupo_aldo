import type { Meta, StoryObj } from '@storybook/react';
import { VStack, HStack, Text } from '@chakra-ui/react';
import StatusTag, { TagCategory, getTagCategory } from './StatusTag';

const meta: Meta<typeof StatusTag> = {
  title: 'Components/Common/StatusTag',
  component: StatusTag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tags são para categorias, tipos e labels. Possuem formato levemente arredondado, fundo sólido e sem bordas para diferenciá-los dos pills.'
      }
    }
  },
  argTypes: {
    category: {
      control: 'select',
      options: ['market', 'climate', 'technology', 'export', 'sustainability', 'politics', 'research', 'default'],
      description: 'Categoria da tag que define a cor temática'
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Tamanho da tag'
    },
    children: {
      control: 'text',
      description: 'Conteúdo da tag'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: 'default',
    children: 'CATEGORIA',
  },
};

export const AllCategories: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Categorias Temáticas</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusTag category="market">MERCADO</StatusTag>
        <StatusTag category="climate">CLIMA</StatusTag>
        <StatusTag category="technology">TECNOLOGIA</StatusTag>
        <StatusTag category="export">EXPORTAÇÃO</StatusTag>
        <StatusTag category="sustainability">SUSTENTABILIDADE</StatusTag>
        <StatusTag category="politics">POLÍTICA</StatusTag>
        <StatusTag category="research">PESQUISA</StatusTag>
        <StatusTag category="default">PADRÃO</StatusTag>
      </HStack>
    </VStack>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Tamanhos</Text>
      <HStack spacing={3} align="center">
        <StatusTag category="market" size="sm">SMALL</StatusTag>
        <StatusTag category="market" size="md">MEDIUM</StatusTag>
      </HStack>
    </VStack>
  ),
};

export const HelperFunction: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Categorização Automática</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusTag category={getTagCategory('mercado')}>MERCADO</StatusTag>
        <StatusTag category={getTagCategory('clima')}>CLIMA</StatusTag>
        <StatusTag category={getTagCategory('tecnologia')}>TECNOLOGIA</StatusTag>
        <StatusTag category={getTagCategory('exportação')}>EXPORTAÇÃO</StatusTag>
        <StatusTag category={getTagCategory('sustentabilidade')}>SUSTENTABILIDADE</StatusTag>
      </HStack>
    </VStack>
  ),
};

export const CoffeeMarketExample: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Aplicação no Sistema Global Coffee</Text>
      <HStack spacing={3} flexWrap="wrap">
        <StatusTag category="market">COMMODITY</StatusTag>
        <StatusTag category="climate">SAFRA 2024</StatusTag>
        <StatusTag category="export">BRASIL</StatusTag>
        <StatusTag category="technology">IA</StatusTag>
        <StatusTag category="sustainability">ORGÂNICO</StatusTag>
        <StatusTag category="research">ESTUDO</StatusTag>
        <StatusTag category="politics">POLÍTICA</StatusTag>
      </HStack>

      <Text fontWeight="bold" mt={4}>Notícias com Tags</Text>
      <VStack align="start" spacing={2}>
        <HStack>
          <StatusTag category="market" size="sm">PREÇOS</StatusTag>
          <Text fontSize="sm">Café arábica sobe 3% na bolsa de NY</Text>
        </HStack>
        <HStack>
          <StatusTag category="climate" size="sm">CLIMA</StatusTag>
          <Text fontSize="sm">Previsão de chuvas para a região de Minas</Text>
        </HStack>
        <HStack>
          <StatusTag category="technology" size="sm">INOVAÇÃO</StatusTag>
          <Text fontSize="sm">Nova plataforma de rastreabilidade</Text>
        </HStack>
      </VStack>
    </VStack>
  ),
};