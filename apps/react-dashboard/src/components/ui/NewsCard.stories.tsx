import type { Meta, StoryObj } from '@storybook/react';
import { VStack, SimpleGrid, Text } from '@chakra-ui/react';
import NewsCard from './NewsCard';

const meta: Meta<typeof NewsCard> = {
  title: 'Components/UI/NewsCard',
  component: NewsCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Card versátil para exibir notícias com diferentes layouts, tags, métricas de engajamento e ações.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'featured', 'minimal'],
      description: 'Variante do layout do card'
    },
    priority: {
      control: 'select',
      options: ['high', 'medium', 'low', 'success', 'warning', 'error', 'info', 'positive', 'negative', 'neutral'],
      description: 'Prioridade da notícia'
    },
    loading: {
      control: 'boolean',
      description: 'Estado de carregamento'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockNews = {
  title: 'Preços do café arábica sobem 5% na bolsa de NY',
  excerpt: 'Condições climáticas adversas no Brasil e aumento da demanda global impulsionam alta dos preços da commodity.',
  imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
  source: 'Coffee Market News',
  author: 'João Silva',
  publishedAt: '2024-01-15T10:30:00Z',
  url: 'https://example.com/news/1',
  category: 'Mercado',
  relevance: 85,
  readTime: 3,
  views: 1247,
  comments: 23,
};

export const Default: Story = {
  args: {
    ...mockNews,
    priority: 'high',
    onBookmark: () => console.log('Bookmarked'),
    onShare: () => console.log('Shared'),
    onRead: () => console.log('Read'),
  },
};

export const AllVariants: Story = {
  render: () => (
    <VStack spacing={6} align="stretch" maxW="800px">
      <Text fontWeight="bold" fontSize="lg">Variantes de Layout</Text>
      
      <VStack align="stretch" spacing={4}>
        <Text fontWeight="semibold">Minimal</Text>
        <NewsCard
          {...mockNews}
          variant="minimal"
          priority="high"
          title="Preços do café em alta - versão minimal"
        />
        
        <Text fontWeight="semibold" mt={4}>Compact</Text>
        <NewsCard
          {...mockNews}
          variant="compact"
          priority="medium"
          title="Análise do mercado cafeeiro - versão compacta"
        />
        
        <Text fontWeight="semibold" mt={4}>Default</Text>
        <NewsCard
          {...mockNews}
          variant="default"
          priority="high"
        />
        
        <Text fontWeight="semibold" mt={4}>Featured</Text>
        <NewsCard
          {...mockNews}
          variant="featured"
          priority="high"
          title="Grande análise: O futuro do mercado de café"
          excerpt="Uma análise completa sobre as tendências que irão moldar o mercado global de café nos próximos anos, incluindo mudanças climáticas, tecnologia e sustentabilidade."
        />
      </VStack>
    </VStack>
  ),
};

export const WithDifferentCategories: Story = {
  render: () => (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} maxW="1000px">
      <NewsCard
        {...mockNews}
        category="Mercado"
        title="Mercado cafeeiro em alta"
        priority="positive"
      />
      <NewsCard
        {...mockNews}
        category="Clima"
        title="Previsões climáticas para a safra"
        priority="warning"
      />
      <NewsCard
        {...mockNews}
        category="Tecnologia"
        title="Nova IA para análise de qualidade"
        priority="info"
      />
      <NewsCard
        {...mockNews}
        category="Sustentabilidade" 
        title="Práticas sustentáveis em fazendas"
        priority="success"
      />
    </SimpleGrid>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <VStack spacing={4} align="stretch" maxW="600px">
      <Text fontWeight="bold" fontSize="lg">Estados de Carregamento</Text>
      <NewsCard
        title=""
        source=""
        publishedAt=""
        url=""
        loading={true}
      />
      <NewsCard
        title=""
        source=""
        publishedAt=""
        url=""
        variant="compact"
        loading={true}
      />
    </VStack>
  ),
};

export const WithoutImage: Story = {
  args: {
    ...mockNews,
    imageUrl: undefined,
    variant: 'default',
    priority: 'medium',
  },
};

export const WithHighEngagement: Story = {
  args: {
    ...mockNews,
    title: 'Análise exclusiva: Como a IA está revolucionando o café',
    views: 12547,
    comments: 89,
    priority: 'high',
    variant: 'featured',
  },
};

export const CoffeeNewsFeed: Story = {
  render: () => (
    <VStack spacing={6} align="stretch" maxW="800px">
      <Text fontWeight="bold" fontSize="lg">Feed de Notícias - Café</Text>
      <VStack align="stretch" spacing={3}>
        <NewsCard
          title="Safra brasileira deve ser a maior dos últimos 10 anos"
          excerpt="Condições climáticas favoráveis e investimentos em tecnologia impulsionam produção recorde."
          imageUrl="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400"
          source="Agrícola Brasil"
          publishedAt="2024-01-15T08:00:00Z"
          url="#"
          category="Produção"
          priority="high"
          relevance={95}
          readTime={5}
          views={3421}
          comments={67}
          variant="featured"
        />
        
        <NewsCard
          title="Preços do arábica atingem máxima de 6 meses"
          source="Coffee Exchange"
          publishedAt="2024-01-15T06:30:00Z"
          url="#"
          category="Mercado"
          priority="positive"
          readTime={2}
          views={1893}
          variant="compact"
        />
        
        <NewsCard
          title="Nova certificação de sustentabilidade aprovada"
          source="Sustainable Coffee Org"
          publishedAt="2024-01-14T15:45:00Z"
          url="#"
          category="Sustentabilidade"
          priority="success"
          readTime={4}
          variant="minimal"
        />
        
        <NewsCard
          title="Estudo revela impacto das mudanças climáticas"
          excerpt="Pesquisa mostra como o aquecimento global afetará as principais regiões produtoras."
          source="Climate Coffee Research"
          publishedAt="2024-01-14T12:00:00Z"
          url="#"
          category="Clima"
          priority="warning"
          relevance={78}
          readTime={8}
          views={2156}
          comments={34}
          variant="default"
        />
      </VStack>
    </VStack>
  ),
};