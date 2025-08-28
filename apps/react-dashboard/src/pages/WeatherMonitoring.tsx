import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import {
  Box,
  Container,
  Heading,
  Grid,
  GridItem,
  HStack,
  VStack,
  Text,
  Select,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Icon,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useThemeContext } from '../contexts/ThemeContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaThermometerHalf, FaWind, FaCloudRain, FaCloud, FaBolt, FaTint } from 'react-icons/fa';
import { Sun, CloudRain as CloudRainIcon, Zap } from 'react-feather';
import { BsArrowRepeat } from 'react-icons/bs';
import { Cloud } from 'react-feather';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WeatherMonitoring: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const [selectedLayer, setSelectedLayer] = useState('temperature');
  const borderColor = currentTheme.colors.border.primary;

  // Map center - Brazil coffee regions
  const mapCenter = { lat: -15.7801, lng: -47.9292 };

  // Weather layers
  const weatherLayers = [
    { id: 'temperature', label: 'Temperatura', icon: FaThermometerHalf },
    { id: 'precipitation', label: 'Precipitação', icon: FaCloudRain },
    { id: 'wind', label: 'Vento', icon: FaWind },
    { id: 'pressure', label: 'Pressão', icon: FaBolt },
    { id: 'clouds', label: 'Nuvens', icon: FaCloud },
  ];

  // KPI data
  const kpis = [
    { icon: FaThermometerHalf, value: '24°C', label: 'Temperatura', change: '+2°C', type: 'increase' },
    { icon: FaTint, value: '65%', label: 'Umidade', change: '-5%', type: 'decrease' },
    { icon: FaWind, value: '12 km/h', label: 'Vento', change: '+1 km/h', type: 'increase' },
    { icon: FaCloudRain, value: '45 mm', label: 'Precipitação', change: '0%', type: 'neutral' },
    { icon: FaCloud, value: '40%', label: 'Nuvens', change: '+10%', type: 'increase' },
    { icon: FaBolt, value: '1013 hPa', label: 'Pressão', change: 'Estável', type: 'neutral' },
  ];

  // Weather forecast cards
  const forecast = [
    { day: 'Seg', icon: Sun, temp: '26°C', condition: 'Ensolarado' },
    { day: 'Ter', icon: FaCloud, temp: '25°C', condition: 'Parcialmente nublado' },
    { day: 'Qua', icon: FaCloud, temp: '24°C', condition: 'Nublado' },
    { day: 'Qui', icon: CloudRainIcon, temp: '23°C', condition: 'Chuva' },
    { day: 'Sex', icon: Zap, temp: '22°C', condition: 'Tempestade' },
  ];

  // Chart data using theme colors
  const temperatureData = {
    labels: ['6h', '9h', '12h', '15h', '18h', '21h'],
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: [18, 21, 26, 28, 24, 20],
        borderColor: function(context: any) {
          const index = context.dataIndex;
          const data = [18, 21, 26, 28, 24, 20];
          if (index === 0) return currentTheme.colors.text.secondary;
          const temp = data[index];
          // Cores baseadas na temperatura: azul (frio) -> laranja (quente)
          if (temp <= 20) return '#3182ce'; // azul para frio
          if (temp <= 25) return '#38a169'; // verde para morno
          return '#d69e2e'; // laranja para quente
        },
        backgroundColor: function(context: any) {
          const index = context.dataIndex;
          const data = [18, 21, 26, 28, 24, 20];
          if (index === 0) return currentTheme.colors.text.secondary + '20';
          const temp = data[index];
          // Cores baseadas na temperatura
          if (temp <= 20) return '#3182ce20'; // azul transparente
          if (temp <= 25) return '#38a16920'; // verde transparente
          return '#d69e2e20'; // laranja transparente
        },
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const precipitationData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Precipitação (mm)',
        data: [12, 18, 8, 25, 15, 10, 20],
        backgroundColor: function(context: any) {
          const index = context.dataIndex;
          const data = [12, 18, 8, 25, 15, 10, 20];
          if (index === 0) return currentTheme.colors.text.secondary + '80';
          const precip = data[index];
          // Cores baseadas na precipitação: tons de azul
          if (precip <= 10) return '#bee3f8'; // azul claro para pouca chuva
          if (precip <= 20) return '#63b3ed'; // azul médio
          return '#3182ce'; // azul escuro para muita chuva
        },
        borderColor: function(context: any) {
          const index = context.dataIndex;
          const data = [12, 18, 8, 25, 15, 10, 20];
          if (index === 0) return currentTheme.colors.text.secondary;
          const precip = data[index];
          // Cores baseadas na precipitação
          if (precip <= 10) return '#90cdf4'; // azul claro
          if (precip <= 20) return '#4299e1'; // azul médio
          return '#2b6cb0'; // azul escuro
        },
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // News/Alerts data
  const alerts = [
    {
      title: 'Alerta de Geada',
      description: 'Possibilidade de geada nas próximas 48h em regiões produtoras',
      priority: 'Alta',
      time: '2h atrás',
      type: 'danger',
    },
    {
      title: 'Chuvas Intensas',
      description: 'Previsão de chuvas acima da média para a próxima semana',
      priority: 'Média',
      time: '5h atrás',
      type: 'warning',
    },
    {
      title: 'Temperatura Ideal',
      description: 'Condições climáticas favoráveis para floração',
      priority: 'Baixa',
      time: '8h atrás',
      type: 'success',
    },
    {
      title: 'Índice UV Alto',
      description: 'Radiação solar intensa nas próximas 72h',
      priority: 'Média',
      time: '1d atrás',
      type: 'warning',
    },
  ];


  return (
    <Box bg={currentTheme.colors.background.secondary} minH="100vh">
      <PageHeader 
        title="Previsão Climática" 
        subtitle="Monitoramento em tempo real das condições climáticas nas regiões produtoras"
        icon={Cloud}
      />
      <Container maxW="container.2xl" py={4}>
        <VStack spacing={4} align="stretch">

        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={4}>
          {/* Main Content Area */}
          <GridItem>
            {/* Weather Map Section */}
            <Card borderRadius="16px" bg="white"   mb={8}>
              <CardHeader>
                <Flex align="center">
                  <Heading size="md" color={currentTheme.colors.text.primary}>KPIs Climáticos - Regiões Produtoras de Café</Heading>
                  <Spacer />
                  <Select
                    w="200px"
                    size="sm"
                    bg={currentTheme.colors.background.primary}
                    
                    color={currentTheme.colors.text.primary}
                  >
                    <option value="brasil">Brasil - Todas as Regiões</option>
                    <option value="mg">Minas Gerais</option>
                    <option value="sp">São Paulo</option>
                    <option value="es">Espírito Santo</option>
                    <option value="ba">Bahia</option>
                  </Select>
                </Flex>
              </CardHeader>
              <CardBody>
                {/* Layer Controls */}
                <ButtonGroup size="sm" mb={4} isAttached variant="outline">
                  {weatherLayers.map((layer) => (
                    <Button
                      key={layer.id}
                      leftIcon={<Icon as={layer.icon} />}
                      bg={selectedLayer === layer.id ? currentTheme.colors.primary : 'transparent'}
                      color={selectedLayer === layer.id ? currentTheme.colors.text.inverse : currentTheme.colors.text.primary}
                      
                      _hover={{
                        bg: selectedLayer === layer.id ? currentTheme.colors.secondary : currentTheme.colors.background.tertiary
                      }}
                      onClick={() => setSelectedLayer(layer.id)}
                    >
                      {layer.label}
                    </Button>
                  ))}
                </ButtonGroup>

                {/* Map */}
                <Box h="400px" borderRadius="16px" overflow="hidden"  >
                  <MapContainer
                    center={[mapCenter.lat, mapCenter.lng]}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={[-15.7801, -47.9292]}>
                      <Popup>Brasília - DF<br />Temperatura: 24°C</Popup>
                    </Marker>
                    <Marker position={[-19.9191, -43.9386]}>
                      <Popup>Belo Horizonte - MG<br />Temperatura: 22°C</Popup>
                    </Marker>
                    <Marker position={[-23.5505, -46.6333]}>
                      <Popup>São Paulo - SP<br />Temperatura: 20°C</Popup>
                    </Marker>
                  </MapContainer>
                </Box>

                {/* KPI Grid */}
                <Grid templateColumns="repeat(6, 1fr)" gap={4} mt={6}>
                  {kpis.map((kpi, index) => (
                    <Card borderRadius="16px" key={index} bg="white"  >
                      <CardBody>
                        <Stat textAlign="center">
                          <Icon as={kpi.icon} boxSize={8} color={currentTheme.colors.primary} mb={2} />
                          <StatNumber fontSize="2xl" color={currentTheme.colors.text.primary}>{kpi.value}</StatNumber>
                          <StatLabel color={currentTheme.colors.text.secondary}>{kpi.label}</StatLabel>
                          <StatHelpText color={currentTheme.colors.text.secondary}>
                            {kpi.type !== 'neutral' && (
                              <StatArrow
                                type={kpi.type as 'increase' | 'decrease'}
                                color={kpi.type === 'increase' ? currentTheme.colors.status.success : currentTheme.colors.status.error}
                              />
                            )}
                            {kpi.change}
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </CardBody>
            </Card>

            {/* Weather Forecast Cards */}
            <Card borderRadius="16px" bg="white"   mb={8}>
              <CardHeader>
                <Heading size="md" color={currentTheme.colors.text.primary}>Previsão de 5 Dias</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                  {forecast.map((day, index) => (
                    <Card borderRadius="16px" key={index} bg="white"  >
                      <CardBody>
                        <Stat textAlign="center">
                          <Icon as={day.icon} boxSize={8} color={currentTheme.colors.primary} mb={2} />
                          <StatNumber fontSize="2xl" color={currentTheme.colors.text.primary}>{day.temp}</StatNumber>
                          <StatLabel color={currentTheme.colors.text.secondary}>{day.day}</StatLabel>
                          <StatHelpText color={currentTheme.colors.text.secondary}>
                            {day.condition}
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </CardBody>
            </Card>

            {/* Charts Section */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              <Card borderRadius="16px" bg="white"  >
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>Temperatura Média</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="250px">
                    <Line data={temperatureData} options={chartOptions} />
                  </Box>
                </CardBody>
              </Card>

              <Card borderRadius="16px" bg="white"  >
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>Precipitação Acumulada</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="250px">
                    <Bar data={precipitationData} options={chartOptions} />
                  </Box>
                </CardBody>
              </Card>

              <Card borderRadius="16px" bg="white"  >
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>Umidade do Solo</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="250px">
                    <Line
                      data={{
                        labels: ['00h', '04h', '08h', '12h', '16h', '20h'],
                        datasets: [
                          {
                            label: 'Umidade (%)',
                            data: [75, 72, 68, 65, 70, 73],
                            borderColor: function(context: any) {
                              const index = context.dataIndex;
                              const data = [75, 72, 68, 65, 70, 73];
                              if (index === 0) return currentTheme.colors.text.secondary;
                              const humidity = data[index];
                              // Cores baseadas na umidade: marrom (seco) -> azul (úmido)
                              if (humidity <= 60) return '#c05621'; // marrom para seco
                              if (humidity <= 70) return '#38a169'; // verde para adequado
                              return '#3182ce'; // azul para muito úmido
                            },
                            backgroundColor: function(context: any) {
                              const index = context.dataIndex;
                              const data = [75, 72, 68, 65, 70, 73];
                              if (index === 0) return currentTheme.colors.text.secondary + '20';
                              const humidity = data[index];
                              // Cores baseadas na umidade
                              if (humidity <= 60) return '#c0562120'; // marrom transparente
                              if (humidity <= 70) return '#38a16920'; // verde transparente
                              return '#3182ce20'; // azul transparente
                            },
                            tension: 0.4,
                            fill: true,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  </Box>
                </CardBody>
              </Card>

              <Card borderRadius="16px" bg="white"  >
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>Índice de Estresse Hídrico</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="250px">
                    <Bar
                      data={{
                        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                        datasets: [
                          {
                            label: 'Índice',
                            data: [30, 45, 60, 40, 35, 50, 42],
                            backgroundColor: function(context: any) {
                              const index = context.dataIndex;
                              const data = [30, 45, 60, 40, 35, 50, 42];
                              if (index === 0) return currentTheme.colors.text.secondary + '80';
                              const stress = data[index];
                              // Cores baseadas no índice de estresse: azul (baixo) -> vermelho (alto)
                              if (stress <= 30) return '#3182ce'; // azul para baixo estresse
                              if (stress <= 50) return '#d69e2e'; // laranja para médio estresse
                              return '#e53e3e'; // vermelho para alto estresse
                            },
                            borderColor: function(context: any) {
                              const index = context.dataIndex;
                              const data = [30, 45, 60, 40, 35, 50, 42];
                              if (index === 0) return currentTheme.colors.text.secondary;
                              const stress = data[index];
                              // Cores baseadas no índice de estresse
                              if (stress <= 30) return '#2b6cb0'; // azul escuro
                              if (stress <= 50) return '#b7791f'; // laranja escuro
                              return '#c53030'; // vermelho escuro
                            },
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  </Box>
                </CardBody>
              </Card>
            </Grid>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <Card borderRadius="16px" bg="white"   position="sticky" top={4}>
              <CardHeader>
                <Flex align="center">
                  <Heading size="md" color={currentTheme.colors.text.primary}>Alertas Climáticos</Heading>
                  <Spacer />
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Icon as={BsArrowRepeat} />}
                    color={currentTheme.colors.text.primary}
                    _hover={{ bg: currentTheme.colors.background.secondary }}
                  >
                    Atualizar
                  </Button>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  {alerts.map((alert, index) => (
                    <Card 
                      key={index}
                      bg={currentTheme.colors.background.primary}
                      
                      
                      borderLeftWidth={3}
                      borderLeftColor={
                        alert.priority === 'Alta' ? currentTheme.colors.status.success :
                        alert.priority === 'Média' ? currentTheme.colors.status.warning :
                        currentTheme.colors.status.error
                      }
                      _hover={{ 
                        boxShadow: 'sm',
                        borderColor: currentTheme.colors.border.secondary
                      }}
                      transition="all 0.2s"
                    >
                      <CardBody py={3} px={4}>
                        <VStack align="stretch" spacing={2}>
                          <Text 
                            fontWeight="600" 
                            fontSize="sm"
                            color={currentTheme.colors.text.primary}
                          >
                            {alert.title}
                          </Text>
                          <Text 
                            fontSize="xs" 
                            color={currentTheme.colors.text.secondary}
                            lineHeight="1.5"
                          >
                            {alert.description}
                          </Text>
                          <Flex justify="space-between" align="center" pt={1}>
                            <Badge
                              bg={alert.priority === 'Alta' ? currentTheme.colors.status.success : alert.priority === 'Média' ? currentTheme.colors.status.warning : currentTheme.colors.status.error}
                              color="white"
                              size="sm"
                            >
                              {alert.priority}
                            </Badge>
                            <Text fontSize="xs" color={currentTheme.colors.text.tertiary}>
                              {alert.time}
                            </Text>
                          </Flex>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
    </Box>
  );
};

export default WeatherMonitoring;