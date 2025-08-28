import React, { useState, useEffect, useCallback } from 'react';
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
  useToast,
  Spinner,
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
import { ServiceContainer } from '../services/ServiceContainer';
import { WeatherDTO } from '../dtos/WeatherDTO';

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

interface WeatherKPI {
  icon: any;
  value: string;
  label: string;
  change: string;
  type: 'increase' | 'decrease' | 'neutral';
}

interface ForecastDay {
  day: string;
  icon: any;
  temp: string;
  condition: string;
  humidity?: number;
  windSpeed?: number;
}

interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  time: string;
  type: 'danger' | 'warning' | 'success';
  region?: string;
}

interface WeatherLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  temperature: number;
  humidity: number;
  condition: string;
}

const WeatherMonitoring: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const toast = useToast();
  
  // Estados
  const [selectedLayer, setSelectedLayer] = useState('temperature');
  const [selectedRegion, setSelectedRegion] = useState('brasil');
  const [weatherData, setWeatherData] = useState<WeatherDTO | null>(null);
  const [kpis, setKpis] = useState<WeatherKPI[]>([]);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [locations, setLocations] = useState<WeatherLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Serviços
  const analyticsService = ServiceContainer.getAnalyticsService();
  const marketDataService = ServiceContainer.getMarketDataService();

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

  // Carregamento inicial dos dados meteorológicos
  const loadWeatherData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Carrega dados meteorológicos atuais
      const currentWeatherResult = await analyticsService.getWeatherData(selectedRegion);
      if (currentWeatherResult.success && currentWeatherResult.data) {
        setWeatherData(currentWeatherResult.data);
        
        // Constrói KPIs a partir dos dados
        const weatherKPIs: WeatherKPI[] = [
          { 
            icon: FaThermometerHalf, 
            value: `${currentWeatherResult.data.temperature}°C`, 
            label: 'Temperatura', 
            change: `${currentWeatherResult.data.temperatureChange > 0 ? '+' : ''}${currentWeatherResult.data.temperatureChange}°C`, 
            type: currentWeatherResult.data.temperatureChange > 0 ? 'increase' : currentWeatherResult.data.temperatureChange < 0 ? 'decrease' : 'neutral' 
          },
          { 
            icon: FaTint, 
            value: `${currentWeatherResult.data.humidity}%`, 
            label: 'Umidade', 
            change: `${currentWeatherResult.data.humidityChange > 0 ? '+' : ''}${currentWeatherResult.data.humidityChange}%`, 
            type: currentWeatherResult.data.humidityChange > 0 ? 'increase' : currentWeatherResult.data.humidityChange < 0 ? 'decrease' : 'neutral' 
          },
          { 
            icon: FaWind, 
            value: `${currentWeatherResult.data.windSpeed} km/h`, 
            label: 'Vento', 
            change: `${currentWeatherResult.data.windSpeedChange > 0 ? '+' : ''}${currentWeatherResult.data.windSpeedChange} km/h`, 
            type: currentWeatherResult.data.windSpeedChange > 0 ? 'increase' : currentWeatherResult.data.windSpeedChange < 0 ? 'decrease' : 'neutral' 
          },
          { 
            icon: FaCloudRain, 
            value: `${currentWeatherResult.data.precipitation} mm`, 
            label: 'Precipitação', 
            change: `${currentWeatherResult.data.precipitationChange}%`, 
            type: currentWeatherResult.data.precipitationChange > 0 ? 'increase' : currentWeatherResult.data.precipitationChange < 0 ? 'decrease' : 'neutral' 
          },
          { 
            icon: FaCloud, 
            value: `${currentWeatherResult.data.cloudCover}%`, 
            label: 'Nuvens', 
            change: `${currentWeatherResult.data.cloudCoverChange > 0 ? '+' : ''}${currentWeatherResult.data.cloudCoverChange}%`, 
            type: currentWeatherResult.data.cloudCoverChange > 0 ? 'increase' : currentWeatherResult.data.cloudCoverChange < 0 ? 'decrease' : 'neutral' 
          },
          { 
            icon: FaBolt, 
            value: `${currentWeatherResult.data.pressure} hPa`, 
            label: 'Pressão', 
            change: currentWeatherResult.data.pressureChange === 0 ? 'Estável' : `${currentWeatherResult.data.pressureChange > 0 ? '+' : ''}${currentWeatherResult.data.pressureChange} hPa`, 
            type: currentWeatherResult.data.pressureChange > 0 ? 'increase' : currentWeatherResult.data.pressureChange < 0 ? 'decrease' : 'neutral' 
          },
        ];
        setKpis(weatherKPIs);
      } else {
        // Fallback para dados mock
        setKpis(generateMockKPIs());
      }

      // Carrega previsão meteorológica
      const forecastResult = await analyticsService.getWeatherForecast(selectedRegion, 5);
      if (forecastResult.success && forecastResult.data) {
        setForecast(forecastResult.data.map((day: any, index: number) => ({
          day: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'][index] || `D${index + 1}`,
          icon: getWeatherIcon(day.condition),
          temp: `${day.temperature}°C`,
          condition: day.condition,
          humidity: day.humidity,
          windSpeed: day.windSpeed
        })));
      } else {
        setForecast(generateMockForecast());
      }

      // Carrega alertas meteorológicos
      const alertsResult = await analyticsService.getWeatherAlerts(selectedRegion);
      if (alertsResult.success && alertsResult.data) {
        setAlerts(alertsResult.data);
      } else {
        setAlerts(generateMockAlerts());
      }

      // Carrega localizações meteorológicas
      const locationsResult = await analyticsService.getWeatherLocations(selectedRegion);
      if (locationsResult.success && locationsResult.data) {
        setLocations(locationsResult.data);
      } else {
        setLocations(generateMockLocations());
      }

    } catch (error) {
      console.error('Erro ao carregar dados meteorológicos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados meteorológicos',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Fallback para dados mock
      setKpis(generateMockKPIs());
      setForecast(generateMockForecast());
      setAlerts(generateMockAlerts());
      setLocations(generateMockLocations());
    } finally {
      setIsLoading(false);
    }
  }, [selectedRegion, analyticsService, toast]);

  useEffect(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  // Atualização dos dados meteorológicos
  const refreshWeatherData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await analyticsService.refreshWeatherData(selectedRegion);
      if (result.success) {
        await loadWeatherData();
        toast({
          title: 'Dados Atualizados',
          description: 'Informações meteorológicas atualizadas com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(result.error?.message || 'Erro ao atualizar dados');
      }
    } catch (error) {
      toast({
        title: 'Erro na Atualização',
        description: 'Não foi possível atualizar os dados meteorológicos',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedRegion, analyticsService, loadWeatherData, toast]);

  // Funções auxiliares
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'ensolarado':
      case 'sunny':
        return Sun;
      case 'parcialmente nublado':
      case 'partly cloudy':
        return FaCloud;
      case 'nublado':
      case 'cloudy':
        return FaCloud;
      case 'chuva':
      case 'rain':
        return CloudRainIcon;
      case 'tempestade':
      case 'storm':
        return Zap;
      default:
        return Sun;
    }
  };

  // Dados mock para fallback
  const generateMockKPIs = (): WeatherKPI[] => [
    { icon: FaThermometerHalf, value: '24°C', label: 'Temperatura', change: '+2°C', type: 'increase' },
    { icon: FaTint, value: '65%', label: 'Umidade', change: '-5%', type: 'decrease' },
    { icon: FaWind, value: '12 km/h', label: 'Vento', change: '+1 km/h', type: 'increase' },
    { icon: FaCloudRain, value: '45 mm', label: 'Precipitação', change: '0%', type: 'neutral' },
    { icon: FaCloud, value: '40%', label: 'Nuvens', change: '+10%', type: 'increase' },
    { icon: FaBolt, value: '1013 hPa', label: 'Pressão', change: 'Estável', type: 'neutral' },
  ];

  const generateMockForecast = (): ForecastDay[] => [
    { day: 'Seg', icon: Sun, temp: '26°C', condition: 'Ensolarado' },
    { day: 'Ter', icon: FaCloud, temp: '25°C', condition: 'Parcialmente nublado' },
    { day: 'Qua', icon: FaCloud, temp: '24°C', condition: 'Nublado' },
    { day: 'Qui', icon: CloudRainIcon, temp: '23°C', condition: 'Chuva' },
    { day: 'Sex', icon: Zap, temp: '22°C', condition: 'Tempestade' },
  ];

  const generateMockAlerts = (): WeatherAlert[] => [
    {
      id: '1',
      title: 'Alerta de Geada',
      description: 'Possibilidade de geada nas próximas 48h em regiões produtoras',
      priority: 'Alta',
      time: '2h atrás',
      type: 'danger',
      region: 'Sul de Minas',
    },
    {
      id: '2',
      title: 'Chuvas Intensas',
      description: 'Previsão de chuvas acima da média para a próxima semana',
      priority: 'Média',
      time: '5h atrás',
      type: 'warning',
      region: 'Cerrado',
    },
    {
      id: '3',
      title: 'Temperatura Ideal',
      description: 'Condições climáticas favoráveis para floração',
      priority: 'Baixa',
      time: '8h atrás',
      type: 'success',
      region: 'Mogiana',
    },
    {
      id: '4',
      title: 'Índice UV Alto',
      description: 'Radiação solar intensa nas próximas 72h',
      priority: 'Média',
      time: '1d atrás',
      type: 'warning',
      region: 'Espírito Santo',
    },
  ];

  const generateMockLocations = (): WeatherLocation[] => [
    { id: '1', name: 'Brasília - DF', coordinates: [-15.7801, -47.9292], temperature: 24, humidity: 65, condition: 'Ensolarado' },
    { id: '2', name: 'Belo Horizonte - MG', coordinates: [-19.9191, -43.9386], temperature: 22, humidity: 70, condition: 'Parcialmente nublado' },
    { id: '3', name: 'São Paulo - SP', coordinates: [-23.5505, -46.6333], temperature: 20, humidity: 75, condition: 'Nublado' },
  ];

  // Dados dos gráficos usando cores do tema
  const temperatureData = weatherData ? {
    labels: weatherData.hourlyData?.map(h => h.time) || ['6h', '9h', '12h', '15h', '18h', '21h'],
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: weatherData.hourlyData?.map(h => h.temperature) || [18, 21, 26, 28, 24, 20],
        borderColor: currentTheme.colors.primary,
        backgroundColor: currentTheme.colors.primary + '20',
        tension: 0.4,
        fill: true,
      },
    ],
  } : {
    labels: ['6h', '9h', '12h', '15h', '18h', '21h'],
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: [18, 21, 26, 28, 24, 20],
        borderColor: currentTheme.colors.primary,
        backgroundColor: currentTheme.colors.primary + '20',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const precipitationData = weatherData ? {
    labels: weatherData.dailyData?.map(d => d.day) || ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Precipitação (mm)',
        data: weatherData.dailyData?.map(d => d.precipitation) || [12, 18, 8, 25, 15, 10, 20],
        backgroundColor: currentTheme.colors.secondary + 'CC',
        borderColor: currentTheme.colors.secondary,
        borderWidth: 1,
      },
    ],
  } : {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Precipitação (mm)',
        data: [12, 18, 8, 25, 15, 10, 20],
        backgroundColor: currentTheme.colors.secondary + 'CC',
        borderColor: currentTheme.colors.secondary,
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

  if (isLoading) {
    return (
      <Box bg={currentTheme.colors.background.secondary} minH="100vh">
        <PageHeader 
          title="Previsão Climática" 
          subtitle="Monitoramento em tempo real das condições climáticas nas regiões produtoras"
          icon={Cloud}
        />
        <Container maxW="container.2xl" py={8}>
          <Flex justify="center" align="center" h="400px">
            <VStack spacing={4}>
              <Spinner size="xl" color={currentTheme.colors.primary} />
              <Text>Carregando dados meteorológicos...</Text>
            </VStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={currentTheme.colors.background.secondary} minH="100vh">
      <PageHeader 
        title="Previsão Climática" 
        subtitle="Monitoramento em tempo real das condições climáticas nas regiões produtoras"
        icon={Cloud}
      />
      <Container maxW="container.2xl" py={8}>
        <VStack spacing={8} align="stretch">

        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={8}>
          {/* Main Content Area */}
          <GridItem>
            {/* Weather Map Section */}
            <Card bg="white" borderWidth={1} borderColor={borderColor} mb={8}>
              <CardHeader>
                <Flex align="center">
                  <Heading size="md" color={currentTheme.colors.text.primary}>KPIs Climáticos - Regiões Produtoras de Café</Heading>
                  <Spacer />
                  <Select
                    w="200px"
                    size="sm"
                    bg={currentTheme.colors.background.primary}
                    borderColor={currentTheme.colors.border.primary}
                    color={currentTheme.colors.text.primary}
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
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
                      borderColor={currentTheme.colors.border.primary}
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
                <Box h="400px" borderRadius="md" overflow="hidden" borderWidth={1} borderColor={borderColor}>
                  <MapContainer
                    center={[mapCenter.lat, mapCenter.lng]}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {locations.map((location) => (
                      <Marker key={location.id} position={location.coordinates}>
                        <Popup>
                          {location.name}<br />
                          Temperatura: {location.temperature}°C<br />
                          Umidade: {location.humidity}%<br />
                          Condição: {location.condition}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </Box>

                {/* KPI Grid */}
                <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4} mt={6}>
                  {kpis.map((kpi, index) => (
                    <Card key={index} bg="white" borderWidth={1} borderColor={borderColor}>
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
            <Card bg="white" borderWidth={1} borderColor={borderColor} mb={8}>
              <CardHeader>
                <Heading size="md" color={currentTheme.colors.text.primary}>Previsão de 5 Dias</Heading>
              </CardHeader>
              <CardBody>
                <HStack spacing={4} overflowX="auto">
                  {forecast.map((day, index) => (
                    <Card
                      key={index}
                      minW="150px"
                      bg={currentTheme.colors.background.secondary}
                      borderWidth={1}
                      borderColor={borderColor}
                    >
                      <CardBody textAlign="center">
                        <Text fontWeight="bold" mb={2} color={currentTheme.colors.text.primary}>{day.day}</Text>
                        <Icon as={day.icon} boxSize={8} color={currentTheme.colors.primary} mb={2} />
                        <Text fontSize="xl" fontWeight="bold" color={currentTheme.colors.text.primary}>{day.temp}</Text>
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>{day.condition}</Text>
                        {day.humidity && (
                          <Text fontSize="xs" color={currentTheme.colors.text.tertiary} mt={1}>
                            Umidade: {day.humidity}%
                          </Text>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </HStack>
              </CardBody>
            </Card>

            {/* Charts Section */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              <Card bg="white" borderWidth={1} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>Temperatura Média</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="250px">
                    <Line data={temperatureData} options={chartOptions} />
                  </Box>
                </CardBody>
              </Card>

              <Card bg="white" borderWidth={1} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>Precipitação Acumulada</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="250px">
                    <Bar data={precipitationData} options={chartOptions} />
                  </Box>
                </CardBody>
              </Card>

              <Card bg="white" borderWidth={1} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>Umidade do Solo</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="250px">
                    <Line
                      data={{
                        labels: weatherData?.hourlyData?.slice(0, 6).map(h => h.time) || ['00h', '04h', '08h', '12h', '16h', '20h'],
                        datasets: [
                          {
                            label: 'Umidade (%)',
                            data: weatherData?.hourlyData?.slice(0, 6).map(h => h.humidity) || [75, 72, 68, 65, 70, 73],
                            borderColor: currentTheme.colors.accent,
                            backgroundColor: currentTheme.colors.accent + '20',
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

              <Card bg="white" borderWidth={1} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>Índice de Estresse Hídrico</Heading>
                </CardHeader>
                <CardBody>
                  <Box h="250px">
                    <Bar
                      data={{
                        labels: weatherData?.dailyData?.slice(0, 7).map(d => d.day) || ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                        datasets: [
                          {
                            label: 'Índice',
                            data: weatherData?.dailyData?.slice(0, 7).map(d => d.stressIndex) || [30, 45, 60, 40, 35, 50, 42],
                            backgroundColor: currentTheme.colors.status.warning + 'CC',
                            borderColor: currentTheme.colors.status.warning,
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
            <Card bg="white" borderWidth={1} borderColor={borderColor} position="sticky" top={4}>
              <CardHeader>
                <Flex align="center">
                  <Heading size="md" color={currentTheme.colors.text.primary}>Alertas Climáticos</Heading>
                  <Spacer />
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={isRefreshing ? <Spinner size="sm" /> : <Icon as={BsArrowRepeat} />}
                    color={currentTheme.colors.text.primary}
                    _hover={{ bg: currentTheme.colors.background.secondary }}
                    onClick={refreshWeatherData}
                    isLoading={isRefreshing}
                  >
                    Atualizar
                  </Button>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  {alerts.map((alert) => (
                    <Card 
                      key={alert.id}
                      bg={currentTheme.colors.background.primary}
                      borderWidth={1}
                      borderColor={currentTheme.colors.border.primary}
                      borderLeftWidth={3}
                      borderLeftColor={
                        alert.priority === 'Alta' ? currentTheme.colors.status.error :
                        alert.priority === 'Média' ? currentTheme.colors.status.warning :
                        currentTheme.colors.status.success
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
                          {alert.region && (
                            <Text fontSize="xs" color={currentTheme.colors.text.tertiary}>
                              Região: {alert.region}
                            </Text>
                          )}
                          <Flex justify="space-between" align="center" pt={1}>
                            <Badge
                              bg={alert.priority === 'Alta' ? currentTheme.colors.status.error : alert.priority === 'Média' ? currentTheme.colors.status.warning : currentTheme.colors.status.success}
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