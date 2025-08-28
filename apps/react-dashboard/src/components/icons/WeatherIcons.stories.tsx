import type { Meta, StoryObj } from '@storybook/react';
import { VStack, HStack, Text, Box } from '@chakra-ui/react';
import { 
  SunnyIcon, 
  MoonIcon, 
  PartlyCloudyIcon, 
  RainIcon, 
  ThunderstormIcon, 
  SnowIcon, 
  FogIcon,
  HumidityIcon,
  PressureIcon,
  VisibilityIcon,
  UVIndexIcon,
  getWeatherIconComponent 
} from './WeatherIcons';

const meta: Meta = {
  title: 'Components/Icons/WeatherIcons',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Coleção de ícones relacionados ao clima para uso no sistema de monitoramento meteorológico do Global Coffee.'
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const IconShowcase = ({ Icon, name }: { Icon: React.ComponentType<any>, name: string }) => (
  <VStack spacing={2} p={4} border="1px" borderColor="gray.200" borderRadius="16px">
    <Icon color="blue.500" boxSize={8} />
    <Text fontSize="sm" fontWeight="medium">{name}</Text>
  </VStack>
);

export const AllWeatherIcons: Story = {
  render: () => (
    <VStack spacing={6} align="stretch">
      <Text fontWeight="bold" fontSize="lg">Ícones de Condições Climáticas</Text>
      <HStack spacing={4} flexWrap="wrap" justify="center">
        <IconShowcase Icon={SunnyIcon} name="Ensolarado" />
        <IconShowcase Icon={MoonIcon} name="Noturno" />
        <IconShowcase Icon={PartlyCloudyIcon} name="Parcialmente Nublado" />
        <IconShowcase Icon={RainIcon} name="Chuva" />
        <IconShowcase Icon={ThunderstormIcon} name="Tempestade" />
        <IconShowcase Icon={SnowIcon} name="Neve" />
        <IconShowcase Icon={FogIcon} name="Neblina" />
      </HStack>
      
      <Text fontWeight="bold" fontSize="lg" mt={8}>Ícones de Métricas Climáticas</Text>
      <HStack spacing={4} flexWrap="wrap" justify="center">
        <IconShowcase Icon={HumidityIcon} name="Umidade" />
        <IconShowcase Icon={PressureIcon} name="Pressão" />
        <IconShowcase Icon={VisibilityIcon} name="Visibilidade" />
        <IconShowcase Icon={UVIndexIcon} name="Índice UV" />
      </HStack>
    </VStack>
  ),
};

export const WeatherIconSizes: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Tamanhos dos Ícones</Text>
      <HStack spacing={4} align="center">
        <VStack spacing={2}>
          <SunnyIcon color="orange.400" boxSize={4} />
          <Text fontSize="xs">Small</Text>
        </VStack>
        <VStack spacing={2}>
          <SunnyIcon color="orange.400" boxSize={6} />
          <Text fontSize="xs">Medium</Text>
        </VStack>
        <VStack spacing={2}>
          <SunnyIcon color="orange.400" boxSize={8} />
          <Text fontSize="xs">Large</Text>
        </VStack>
        <VStack spacing={2}>
          <SunnyIcon color="orange.400" boxSize={12} />
          <Text fontSize="xs">Extra Large</Text>
        </VStack>
      </HStack>
    </VStack>
  ),
};

export const WeatherIconColors: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Variações de Cores</Text>
      <HStack spacing={4} align="center">
        <VStack spacing={2}>
          <RainIcon color="blue.500" boxSize={8} />
          <Text fontSize="xs">Azul</Text>
        </VStack>
        <VStack spacing={2}>
          <SunnyIcon color="yellow.400" boxSize={8} />
          <Text fontSize="xs">Amarelo</Text>
        </VStack>
        <VStack spacing={2}>
          <ThunderstormIcon color="purple.500" boxSize={8} />
          <Text fontSize="xs">Roxo</Text>
        </VStack>
        <VStack spacing={2}>
          <SnowIcon color="cyan.300" boxSize={8} />
          <Text fontSize="xs">Ciano</Text>
        </VStack>
        <VStack spacing={2}>
          <FogIcon color="gray.400" boxSize={8} />
          <Text fontSize="xs">Cinza</Text>
        </VStack>
      </HStack>
    </VStack>
  ),
};

export const WeatherIconHelper: Story = {
  render: () => (
    <VStack spacing={4} align="stretch">
      <Text fontWeight="bold">Helper Function - getWeatherIconComponent</Text>
      <Text fontSize="sm" color="gray.600">
        Função que retorna o componente do ícone baseado no código da API de clima
      </Text>
      <HStack spacing={4} flexWrap="wrap">
        {[
          { code: '01d', name: 'Ensolarado (dia)' },
          { code: '01n', name: 'Claro (noite)' },
          { code: '02d', name: 'Parcialmente nublado' },
          { code: '09d', name: 'Chuva' },
          { code: '11d', name: 'Tempestade' },
          { code: '13d', name: 'Neve' },
          { code: '50d', name: 'Neblina' },
        ].map(({ code, name }) => {
          const IconComponent = getWeatherIconComponent(code);
          return (
            <VStack key={code} spacing={2} p={3} border="1px" borderColor="gray.200" borderRadius="16px">
              <IconComponent color="blue.500" boxSize={6} />
              <Text fontSize="xs" textAlign="center">
                <Text as="span" fontWeight="bold">{code}</Text>
                <br />
                {name}
              </Text>
            </VStack>
          );
        })}
      </HStack>
    </VStack>
  ),
};

export const CoffeeClimateApplication: Story = {
  render: () => (
    <VStack spacing={6} align="stretch">
      <Text fontWeight="bold" fontSize="lg">Aplicação no Monitoramento Climático do Café</Text>
      
      <Box p={4} bg="gray.50" borderRadius="16px">
        <Text fontWeight="semibold" mb={3}>Condições Atuais - Região Cafeeira</Text>
        <HStack spacing={6}>
          <VStack spacing={1}>
            <PartlyCloudyIcon color="blue.500" boxSize={10} />
            <Text fontSize="sm">Parcialmente Nublado</Text>
            <Text fontSize="xs" color="gray.600">24°C</Text>
          </VStack>
          <VStack spacing={1}>
            <HumidityIcon color="cyan.500" boxSize={6} />
            <Text fontSize="sm">Umidade</Text>
            <Text fontSize="xs" color="gray.600">68%</Text>
          </VStack>
          <VStack spacing={1}>
            <PressureIcon color="purple.500" boxSize={6} />
            <Text fontSize="sm">Pressão</Text>
            <Text fontSize="xs" color="gray.600">1013 hPa</Text>
          </VStack>
          <VStack spacing={1}>
            <UVIndexIcon color="orange.400" boxSize={6} />
            <Text fontSize="sm">UV Index</Text>
            <Text fontSize="xs" color="gray.600">Moderado</Text>
          </VStack>
        </HStack>
      </Box>

      <Box p={4} bg="blue.50" borderRadius="16px">
        <Text fontWeight="semibold" mb={3}>Previsão para a Safra</Text>
        <HStack spacing={4}>
          <VStack spacing={1}>
            <RainIcon color="blue.600" boxSize={8} />
            <Text fontSize="sm">Chuvas Regulares</Text>
            <Text fontSize="xs" color="gray.600">Favorável</Text>
          </VStack>
          <VStack spacing={1}>
            <SunnyIcon color="yellow.500" boxSize={8} />
            <Text fontSize="sm">Período Seco</Text>
            <Text fontSize="xs" color="gray.600">Esperado</Text>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  ),
};