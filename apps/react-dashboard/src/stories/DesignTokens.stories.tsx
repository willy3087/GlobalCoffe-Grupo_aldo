import type { Meta, StoryObj } from '@storybook/react';
import { 
  Box, 
  SimpleGrid, 
  VStack, 
  HStack,
  Text, 
  Card, 
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Badge,
  Center,
  ChakraProvider,
  Stack
} from '@chakra-ui/react';
import { ThemeProvider } from '../contexts/ThemeContext';

const meta: Meta = {
  title: 'Design System/Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Sistema completo de design tokens: cores, tipografia, espaçamentos e elevações do Global Coffee.'
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
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const ColorSwatch = ({ color, name, value, description }: { 
  color: string, 
  name: string, 
  value: string,
  description?: string 
}) => (
  <Card borderRadius="16px" size="sm">
    <CardBody>
      <VStack spacing={2}>
        <Box 
          bg={color} 
          w="100px" 
          h="80px" 
          borderRadius="16px"
          border="1px solid"
          borderColor="gray.200"
        />
        <Text fontSize="sm" fontWeight="semibold">{name}</Text>
        <Text fontSize="xs" color="gray.600" textAlign="center">{value}</Text>
        {description && (
          <Text fontSize="xs" color="gray.500" textAlign="center">{description}</Text>
        )}
      </VStack>
    </CardBody>
  </Card>
);

const SpacingBox = ({ size, name }: { size: string, name: string }) => (
  <VStack spacing={2} align="center">
    <Box 
      bg="blue.500" 
      w={size} 
      h={size} 
      borderRadius="16px"
      minW="16px"
      minH="16px"
    />
    <VStack spacing={0}>
      <Text fontSize="xs" fontWeight="medium">{name}</Text>
      <Text fontSize="xs" color="gray.500">{size}</Text>
    </VStack>
  </VStack>
);

export const ColorSystem: Story = {
  render: () => (
    <Box p={8} maxW="1200px" mx="auto">
      <VStack spacing={8} align="stretch">
        
        <VStack spacing={2} align="center">
          <Heading size="xl">Sistema de Cores Global Coffee</Heading>
          <Text color="gray.600" textAlign="center">
            Cores temáticas baseadas no universo do café, otimizadas para produtores e traders
          </Text>
        </VStack>

        {/* Cores Primárias */}
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="gray.700">Cores Primárias</Heading>
          <Text fontSize="sm" color="gray.600">
            Cores principais do sistema, inspiradas no café e na natureza
          </Text>
          <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4}>
            <ColorSwatch 
              color="#8B4513" 
              name="Coffee Brown" 
              value="#8B4513"
              description="Cor principal do café"
            />
            <ColorSwatch 
              color="#D2691E" 
              name="Coffee Light" 
              value="#D2691E"
              description="Café claro"
            />
            <ColorSwatch 
              color="#2E7D32" 
              name="Coffee Green" 
              value="#2E7D32"
              description="Grão verde"
            />
            <ColorSwatch 
              color="#FFA726" 
              name="Harvest Gold" 
              value="#FFA726"
              description="Dourado da colheita"
            />
            <ColorSwatch 
              color="#5D4E37" 
              name="Dark Roast" 
              value="#5D4E37"
              description="Café torrado escuro"
            />
            <ColorSwatch 
              color="#FFEAA7" 
              name="Coffee Cream" 
              value="#FFEAA7"
              description="Creme do café"
            />
          </SimpleGrid>
        </VStack>

        {/* Cores Semânticas */}
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="gray.700">Cores Semânticas</Heading>
          <Text fontSize="sm" color="gray.600">
            Cores para indicadores de status, alertas e feedback
          </Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <ColorSwatch 
              color="#22C55E" 
              name="Success" 
              value="#22C55E"
              description="Operações bem-sucedidas"
            />
            <ColorSwatch 
              color="#F59E0B" 
              name="Warning" 
              value="#F59E0B"
              description="Atenção necessária"
            />
            <ColorSwatch 
              color="#EF4444" 
              name="Error" 
              value="#EF4444"
              description="Erros e problemas"
            />
            <ColorSwatch 
              color="#3B82F6" 
              name="Info" 
              value="#3B82F6"
              description="Informações gerais"
            />
          </SimpleGrid>
        </VStack>

        {/* Cores do Mercado */}
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="gray.700">Cores do Mercado</Heading>
          <Text fontSize="sm" color="gray.600">
            Cores específicas para dados financeiros e de mercado
          </Text>
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
            <ColorSwatch 
              color="#16A34A" 
              name="Bull Market" 
              value="#16A34A"
              description="Preços em alta"
            />
            <ColorSwatch 
              color="#DC2626" 
              name="Bear Market" 
              value="#DC2626"
              description="Preços em baixa"
            />
            <ColorSwatch 
              color="#6B7280" 
              name="Market Neutral" 
              value="#6B7280"
              description="Mercado estável"
            />
          </SimpleGrid>
        </VStack>

        {/* Cores Climáticas */}
        <VStack spacing={4} align="stretch">
          <Heading size="md" color="gray.700">Cores Climáticas</Heading>
          <Text fontSize="sm" color="gray.600">
            Cores para dados meteorológicos e climáticos
          </Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <ColorSwatch 
              color="#FbbF24" 
              name="Sunny" 
              value="#FbbF24"
              description="Condições ensolaradas"
            />
            <ColorSwatch 
              color="#3B82F6" 
              name="Rainy" 
              value="#3B82F6"
              description="Chuva e precipitação"
            />
            <ColorSwatch 
              color="#6B7280" 
              name="Cloudy" 
              value="#6B7280"
              description="Nublado"
            />
            <ColorSwatch 
              color="#EF4444" 
              name="Storm" 
              value="#EF4444"
              description="Tempestades"
            />
          </SimpleGrid>
        </VStack>

      </VStack>
    </Box>
  ),
};

export const Typography: Story = {
  render: () => (
    <Box p={8} maxW="1000px" mx="auto">
      <VStack spacing={8} align="stretch">
        
        <VStack spacing={2} align="center">
          <Heading size="xl">Sistema Tipográfico</Heading>
          <Text color="gray.600" textAlign="center">
            Hierarquia e escalas otimizadas para leitura em dispositivos rurais e urbanos
          </Text>
        </VStack>

        <Card>
          <CardHeader>
            <Heading size="md">Escalas de Texto</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              
              <VStack spacing={3} align="start">
                <Text fontSize="6xl" fontWeight="bold" lineHeight="1.2">
                  Display XL - Dashboard Principal
                </Text>
                <Text fontSize="sm" color="gray.600">
                  fontSize: 6xl (60px) | fontWeight: bold | lineHeight: 1.2
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Usado para títulos principais nos dashboards, especialmente em telas grandes
                </Text>
              </VStack>

              <VStack spacing={3} align="start">
                <Text fontSize="5xl" fontWeight="bold" lineHeight="1.2">
                  Display L - Seções Principais
                </Text>
                <Text fontSize="sm" color="gray.600">
                  fontSize: 5xl (48px) | fontWeight: bold | lineHeight: 1.2
                </Text>
              </VStack>

              <VStack spacing={3} align="start">
                <Text fontSize="4xl" fontWeight="semibold" lineHeight="1.3">
                  Heading XL - Títulos de Página
                </Text>
                <Text fontSize="sm" color="gray.600">
                  fontSize: 4xl (36px) | fontWeight: semibold | lineHeight: 1.3
                </Text>
              </VStack>

              <VStack spacing={3} align="start">
                <Text fontSize="3xl" fontWeight="semibold" lineHeight="1.4">
                  Heading L - Seções de Conteúdo
                </Text>
                <Text fontSize="sm" color="gray.600">
                  fontSize: 3xl (30px) | fontWeight: semibold | lineHeight: 1.4
                </Text>
              </VStack>

              <VStack spacing={3} align="start">
                <Text fontSize="2xl" fontWeight="semibold" lineHeight="1.4">
                  Heading M - Cards e Componentes
                </Text>
                <Text fontSize="sm" color="gray.600">
                  fontSize: 2xl (24px) | fontWeight: semibold | lineHeight: 1.4
                </Text>
              </VStack>

              <VStack spacing={3} align="start">
                <Text fontSize="xl" fontWeight="medium" lineHeight="1.5">
                  Body XL - Texto principal em tablets
                </Text>
                <Text fontSize="sm" color="gray.600">
                  fontSize: xl (20px) | fontWeight: medium | lineHeight: 1.5
                </Text>
              </VStack>

              <VStack spacing={3} align="start">
                <Text fontSize="lg" fontWeight="normal" lineHeight="1.6">
                  Body L - Texto principal em desktop. Ideal para leitura prolongada e conteúdo informativo.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  fontSize: lg (18px) | fontWeight: normal | lineHeight: 1.6
                </Text>
              </VStack>

              <VStack spacing={3} align="start">
                <Text fontSize="md" fontWeight="normal" lineHeight="1.6">
                  Body M - Texto padrão. Usado na maioria dos componentes e interfaces. Otimizado para leitura em mobile.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  fontSize: md (16px) | fontWeight: normal | lineHeight: 1.6
                </Text>
              </VStack>

              <VStack spacing={3} align="start">
                <Text fontSize="sm" fontWeight="normal" lineHeight="1.5">
                  Body S - Texto secundário, legendas e metadados. Usado em informações complementares.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  fontSize: sm (14px) | fontWeight: normal | lineHeight: 1.5
                </Text>
              </VStack>

              <VStack spacing={3} align="start">
                <Text fontSize="xs" fontWeight="medium" lineHeight="1.4">
                  Caption - Labels, badges e textos pequenos
                </Text>
                <Text fontSize="sm" color="gray.600">
                  fontSize: xs (12px) | fontWeight: medium | lineHeight: 1.4
                </Text>
              </VStack>

            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Pesos de Fonte</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="light">Light (300) - Textos delicados</Text>
                <Badge>300</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="normal">Regular (400) - Texto padrão</Text>
                <Badge>400</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="medium">Medium (500) - Destaques sutis</Text>
                <Badge>500</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="semibold">Semibold (600) - Títulos</Text>
                <Badge>600</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold">Bold (700) - Elementos importantes</Text>
                <Badge>700</Badge>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

      </VStack>
    </Box>
  ),
};

export const Spacing: Story = {
  render: () => (
    <Box p={8} maxW="1000px" mx="auto">
      <VStack spacing={8} align="stretch">
        
        <VStack spacing={2} align="center">
          <Heading size="xl">Sistema de Espaçamento</Heading>
          <Text color="gray.600" textAlign="center">
            Escala consistente baseada em múltiplos de 4px para harmonia visual
          </Text>
        </VStack>

        <Card>
          <CardHeader>
            <Heading size="md">Escala de Espaçamento</Heading>
            <Text fontSize="sm" color="gray.600">
              Sistema baseado em incrementos de 4px (0.25rem)
            </Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 4, md: 6, lg: 8 }} spacing={6}>
              <SpacingBox size="1" name="0.5" />
              <SpacingBox size="2" name="1" />
              <SpacingBox size="3" name="1.5" />
              <SpacingBox size="4" name="2" />
              <SpacingBox size="6" name="3" />
              <SpacingBox size="8" name="4" />
              <SpacingBox size="12" name="6" />
              <SpacingBox size="16" name="8" />
              <SpacingBox size="20" name="10" />
              <SpacingBox size="24" name="12" />
              <SpacingBox size="32" name="16" />
              <SpacingBox size="40" name="20" />
              <SpacingBox size="48" name="24" />
              <SpacingBox size="56" name="32" />
              <SpacingBox size="64" name="40" />
              <SpacingBox size="80" name="48" />
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Aplicação dos Espaçamentos</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              
              <Box>
                <Text fontWeight="semibold" mb={2}>Espaçamento Interno (Padding)</Text>
                <VStack spacing={3} align="start">
                  <HStack>
                    <Box bg="blue.100" p={1} borderRadius="16px">
                      <Text fontSize="sm">p={'{1}'} - 4px</Text>
                    </Box>
                    <Text fontSize="sm" color="gray.600">Padding mínimo para elementos pequenos</Text>
                  </HStack>
                  <HStack>
                    <Box bg="blue.100" p={3} borderRadius="16px">
                      <Text fontSize="sm">p={'{3}'} - 12px</Text>
                    </Box>
                    <Text fontSize="sm" color="gray.600">Padding padrão para botões e badges</Text>
                  </HStack>
                  <HStack>
                    <Box bg="blue.100" p={6} borderRadius="16px">
                      <Text fontSize="sm">p={'{6}'} - 24px</Text>
                    </Box>
                    <Text fontSize="sm" color="gray.600">Padding para cards e containers</Text>
                  </HStack>
                </VStack>
              </Box>

              <Box>
                <Text fontWeight="semibold" mb={2}>Espaçamento Externo (Margin)</Text>
                <VStack spacing={3} align="start">
                  <Text fontSize="sm" color="gray.600">
                    • <strong>2-4px (0.5-1):</strong> Espaçamento entre elementos relacionados
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    • <strong>8-12px (2-3):</strong> Espaçamento entre componentes próximos
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    • <strong>16-24px (4-6):</strong> Espaçamento entre seções
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    • <strong>32-48px (8-12):</strong> Espaçamento entre blocos principais
                  </Text>
                </VStack>
              </Box>

            </VStack>
          </CardBody>
        </Card>

      </VStack>
    </Box>
  ),
};

export const Shadows: Story = {
  render: () => (
    <Box p={8} maxW="1000px" mx="auto">
      <VStack spacing={8} align="stretch">
        
        <VStack spacing={2} align="center">
          <Heading size="xl">Sistema de Elevação</Heading>
          <Text color="gray.600" textAlign="center">
            Sombras e elevações para hierarquia visual e profundidade
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          
          <Card borderRadius="16px" boxShadow="sm">
            <CardBody textAlign="center">
              <VStack spacing={3}>
                <Text fontWeight="semibold">Shadow SM</Text>
                <Text fontSize="sm" color="gray.600">boxShadow="sm"</Text>
                <Text fontSize="xs" color="gray.500">
                  Elementos sutis como badges e pills
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card borderRadius="16px" boxShadow="md">
            <CardBody textAlign="center">
              <VStack spacing={3}>
                <Text fontWeight="semibold">Shadow MD</Text>
                <Text fontSize="sm" color="gray.600">boxShadow="md"</Text>
                <Text fontSize="xs" color="gray.500">
                  Cards padrão e botões elevados
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card borderRadius="16px" boxShadow="lg">
            <CardBody textAlign="center">
              <VStack spacing={3}>
                <Text fontWeight="semibold">Shadow LG</Text>
                <Text fontSize="sm" color="gray.600">boxShadow="lg"</Text>
                <Text fontSize="xs" color="gray.500">
                  Modals e elementos sobrepostos
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card borderRadius="16px" boxShadow="xl">
            <CardBody textAlign="center">
              <VStack spacing={3}>
                <Text fontWeight="semibold">Shadow XL</Text>
                <Text fontSize="sm" color="gray.600">boxShadow="xl"</Text>
                <Text fontSize="xs" color="gray.500">
                  Elementos principais do dashboard
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card borderRadius="16px" boxShadow="2xl">
            <CardBody textAlign="center">
              <VStack spacing={3}>
                <Text fontWeight="semibold">Shadow 2XL</Text>
                <Text fontSize="sm" color="gray.600">boxShadow="2xl"</Text>
                <Text fontSize="xs" color="gray.500">
                  Overlays e popups importantes
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card borderRadius="16px" boxShadow="none" border="1px solid" borderColor="gray.200">
            <CardBody textAlign="center">
              <VStack spacing={3}>
                <Text fontWeight="semibold">No Shadow</Text>
                <Text fontSize="sm" color="gray.600">boxShadow="none"</Text>
                <Text fontSize="xs" color="gray.500">
                  Elementos planos com border
                </Text>
              </VStack>
            </CardBody>
          </Card>

        </SimpleGrid>

      </VStack>
    </Box>
  ),
};