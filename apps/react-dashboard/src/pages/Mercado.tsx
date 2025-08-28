import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/PageHeader';
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  ButtonGroup,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
  HStack,
  Flex,
  Spacer,
  Divider,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { RefreshCw, TrendingUp, TrendingDown, Activity } from 'react-feather';
import { useThemeContext } from '../contexts/ThemeContext';
import ImageWithFallback from '../components/common/ImageWithFallback';
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

// Custom candlestick plugin
const candlestickPlugin = {
  id: 'candlestick',
  afterDatasetsDraw: (chart: any, _args: any, pluginOptions: any) => {
    const { ctx, chartArea: { width }, scales: { x, y } } = chart;
    
    if (!pluginOptions?.candlestickData) return;
    
    const candlestickData = pluginOptions.candlestickData;
    const barWidth = 6; // Fixed width of 6px
    
    candlestickData.forEach((candle: any, index: number) => {
      const xPos = x.getPixelForValue(index);
      const openY = y.getPixelForValue(candle.open);
      const closeY = y.getPixelForValue(candle.close);
      const highY = y.getPixelForValue(candle.high);
      const lowY = y.getPixelForValue(candle.low);
      
      const isGreen = candle.close >= candle.open;
      const color = isGreen ? '#10b981' : '#ef4444';
      const bodyTop = Math.min(openY, closeY);
      const bodyBottom = Math.max(openY, closeY);
      const bodyHeight = Math.min(56, Math.abs(closeY - openY)); // Max height of 56px
      
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;
      
      // Draw upper wick (from body top to high)
      if (highY < bodyTop) {
        ctx.beginPath();
        ctx.moveTo(xPos, highY);
        ctx.lineTo(xPos, bodyTop);
        ctx.stroke();
      }
      
      // Draw lower wick (from body bottom to low)  
      if (lowY > bodyBottom) {
        ctx.beginPath();
        ctx.moveTo(xPos, bodyBottom);
        ctx.lineTo(xPos, lowY);
        ctx.stroke();
      }
      
      // Draw body
      if (bodyHeight > 1) {
        if (isGreen) {
          // Green candle: hollow rectangle
          ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
          ctx.fillRect(xPos - barWidth/2, bodyTop, barWidth, bodyHeight);
          ctx.strokeStyle = '#10b981';
          ctx.strokeRect(xPos - barWidth/2, bodyTop, barWidth, bodyHeight);
        } else {
          // Red candle: filled rectangle
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(xPos - barWidth/2, bodyTop, barWidth, bodyHeight);
        }
      } else {
        // Doji (open = close): draw line
        ctx.beginPath();
        ctx.moveTo(xPos - barWidth/2, openY);
        ctx.lineTo(xPos + barWidth/2, openY);
        ctx.stroke();
      }
    });
  }
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  candlestickPlugin
);


interface PriceData {
  tipo: string;
  origem: string;
  qualidade: string;
  preco: number;
  variacao: number;
  volume: number;
}

interface NewsItem {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  tempo: string;
  impacto: 'positive' | 'negative' | 'neutral';
  imagem?: string;
  relevancia?: number;
}

interface TradeOrder {
  id: string;
  tipo: 'buy' | 'sell';
  preco: number;
  volume: number;
  timestamp: Date;
  status: 'executed';
}

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CoffeeType {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

const Mercado: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const [selectedPeriod, setSelectedPeriod] = useState('5D');
  const [selectedCoffeeType, setSelectedCoffeeType] = useState('arabica');

  // Coffee types traded on exchanges
  const coffeeTypes: CoffeeType[] = [
    { id: 'arabica', name: 'Café Arábica', symbol: 'KC', price: 1842.00, change: 3.2, volume: 15200 },
    { id: 'robusta', name: 'Café Robusta', symbol: 'RC', price: 1565.00, change: -0.3, volume: 8765 },
    { id: 'futures-arabica', name: 'Futuros Arábica', symbol: 'KC-DEC', price: 1878.00, change: 1.1, volume: 15230 },
    { id: 'futures-robusta', name: 'Futuros Robusta', symbol: 'RC-JAN', price: 1580.00, change: -0.5, volume: 9500 },
    { id: 'brazilian-arabica', name: 'Arábica Brasil', symbol: 'BAR', price: 1825.00, change: 1.8, volume: 1200 },
    { id: 'conilon', name: 'Conilon (Robusta)', symbol: 'CON', price: 1320.00, change: 2.1, volume: 1500 },
  ];

  const [candlestickData, setCandlestickData] = useState<Record<string, CandlestickData[]>>({});
  
  // New state for enhanced features
  const [newsLoading, setNewsLoading] = useState(false);
  
  // Constants for realistic price movements
  const VOLATILITY = 0.005; // 0.5% volatility

  // Generate realistic candlestick data for each coffee type with proper time intervals
  const generateCandlestickData = (coffeeType: CoffeeType, period: string, periods: number = 20): CandlestickData[] => {
    const data: CandlestickData[] = [];
    let currentPrice = coffeeType.price;
    
    for (let i = 0; i < periods; i++) {
      const date = new Date();
      let timeLabel = '';
      
      // Set appropriate time intervals and labels based on selected period
      switch(period) {
        case '1D':
          date.setHours(date.getHours() - (periods - i));
          timeLabel = date.getHours().toString().padStart(2, '0') + ':00';
          break;
        case '5D':
          date.setDate(date.getDate() - (periods - i - 1));
          const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
          timeLabel = dayNames[date.getDay()];
          break;
        case '1M':
          date.setDate(date.getDate() - (periods - i));
          timeLabel = date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0');
          break;
        case '3M':
          date.setDate(date.getDate() - (periods - i) * 7); // Weekly intervals
          timeLabel = 'S' + (Math.ceil((periods - i) / 4) + 1).toString(); // Week number
          break;
        case '1A':
          date.setMonth(date.getMonth() - (periods - i));
          const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          timeLabel = months[date.getMonth()];
          break;
        default:
          date.setHours(date.getHours() - (periods - i));
          timeLabel = date.getHours().toString().padStart(2, '0') + ':00';
      }
      
      // Generate realistic OHLC data
      const volatility = VOLATILITY * (0.5 + Math.random());
      const trend = Math.random() > 0.5 ? 1 : -1;
      
      const open = currentPrice;
      const priceChange = currentPrice * volatility * trend;
      const high = Math.max(open, open + Math.abs(priceChange) * (1 + Math.random() * 0.5));
      const low = Math.min(open, open - Math.abs(priceChange) * (1 + Math.random() * 0.5));
      const close = low + Math.random() * (high - low);
      
      const volume = Math.floor(coffeeType.volume * (0.3 + Math.random() * 1.4));
      
      data.push({
        time: timeLabel,
        open,
        high,
        low,
        close,
        volume
      });
      
      currentPrice = close;
    }
    
    return data;
  };

  const [priceTableData] = useState<PriceData[]>([
    { tipo: 'Café Arábica (KC)', origem: 'Spot', qualidade: 'Premium', preco: 1842, variacao: 2.5, volume: 12345 },
    { tipo: 'Café Robusta (RC)', origem: 'Spot', qualidade: 'Standard', preco: 1565, variacao: -0.3, volume: 8765 },
    { tipo: 'Futuros Café Arábica', origem: 'Dez/2024', qualidade: 'Premium', preco: 1878, variacao: 1.1, volume: 15230 },
    { tipo: 'Futuros Café Robusta', origem: 'Jan/2025', qualidade: 'Standard', preco: 1580, variacao: -0.5, volume: 9500 },
    { tipo: 'Arábica Sul de Minas', origem: 'Sul de Minas', qualidade: 'Tipo 6', preco: 1825, variacao: 1.8, volume: 1200 },
    { tipo: 'Conilon ES', origem: 'Espírito Santo', qualidade: 'Tipo 7', preco: 1320, variacao: 2.1, volume: 1500 },
  ]);

  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: '1',
      titulo: 'Café futuro sobe com preocupações sobre oferta global',
      descricao: 'Contratos futuros de café arábica avançam 2,5% na ICE após relatórios indicarem redução nas estimativas de produção.',
      prioridade: 'Alta',
      tempo: '2h atrás',
      impacto: 'negative',
      imagem: 'https://images.unsplash.com/photo-1625806786037-3c7d5df83985?w=200&h=150&fit=crop',
      relevancia: 95,
    },
    {
      id: '2',
      titulo: 'Análise técnica: Café rompe resistência importante em US$ 2,45',
      descricao: 'Traders acompanham movimento de alta após rompimento de nível técnico chave. Volume de negociação aumenta 30%.',
      prioridade: 'Alta',
      tempo: '5h atrás',
      impacto: 'positive',
      imagem: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=200&h=150&fit=crop',
      relevancia: 88,
    },
    {
      id: '3',
      titulo: 'Fundos aumentam posições compradas em café',
      descricao: 'Relatório CFTC mostra aumento de 15% nas posições líquidas compradas de fundos especulativos na última semana.',
      prioridade: 'Média',
      tempo: '8h atrás',
      impacto: 'positive',
      imagem: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=150&fit=crop',
      relevancia: 72,
    },
    {
      id: '4',
      titulo: 'Volatilidade do café atrai traders algorítmicos',
      descricao: 'Aumento da volatilidade no mercado de café tem atraído mais operações automatizadas e de alta frequência.',
      prioridade: 'Baixa',
      tempo: '1d atrás',
      impacto: 'neutral',
      imagem: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=150&fit=crop',
      relevancia: 65,
    },
  ]);

  
  // Functions for realistic price movements
  
  
  const calculateSMA = useCallback((data: number[], period: number) => {
    if (data.length < period) return null;
    const sum = data.slice(-period).reduce((a, b) => a + b, 0);
    return sum / period;
  }, []);
  
  const calculateNewsRelevance = useCallback((title: string, description: string) => {
    const keywords = [
      'café', 'coffee', 'commodities', 'bolsa', 'valores', 'trading', 'mercado', 'market',
      'preço', 'price', 'arabica', 'robusta', 'futuros', 'futures', 'cotação',
      'exportação', 'export', 'safra', 'harvest', 'brasil', 'brazil'
    ];
    
    const text = (title + ' ' + description).toLowerCase();
    let score = 0;
    
    keywords.forEach(keyword => {
      if (text.includes(keyword)) score += 10;
    });
    
    return Math.min(100, Math.max(20, score));
  }, []);
  
  
  const refreshNews = useCallback(async () => {
    setNewsLoading(true);
    
    // Simulate news loading with enhanced relevance
    setTimeout(() => {
      const mockNews = [
        {
          id: Date.now().toString(),
          titulo: 'Spread entre arábica e robusta atinge máxima do ano',
          descricao: 'Diferença de preço entre as duas principais variedades de café alcança níveis históricos devido a fatores climáticos.',
          prioridade: 'Alta' as const,
          tempo: 'Agora',
          impacto: 'negative' as const,
          imagem: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=150&fit=crop',
        },
        ...newsItems.slice(0, 3)
      ];
      
      const newsWithRelevance = mockNews.map(news => ({
        ...news,
        relevancia: calculateNewsRelevance(news.titulo, news.descricao)
      }));
      
      setNewsItems(newsWithRelevance);
      setNewsLoading(false);
    }, 1000);
  }, [newsItems, calculateNewsRelevance]);

  // Generate candlestick chart data based on selected period
  const currentCandlestickData = candlestickData[selectedCoffeeType] || [];
  
  // Simplified price chart for candlestick overlay
  const priceChartData = {
    labels: currentCandlestickData.map(item => item.time),
    datasets: [
      // Background price line
      {
        label: 'Preço',
        data: currentCandlestickData.map(item => item.close),
        borderColor: 'rgba(107, 114, 128, 0.5)',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        borderWidth: 1,
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };


  // Enhanced volume chart data with trend-based colors
  const volumeChartData = {
    labels: currentCandlestickData.map(item => item.time),
    datasets: [
      {
        label: 'Volume (sacas)',
        data: currentCandlestickData.map(item => item.volume),
        backgroundColor: currentCandlestickData.map(item => 
          item.close >= item.open ? '#10b981' + '80' : '#ef4444' + '80'
        ),
        borderColor: currentCandlestickData.map(item => 
          item.close >= item.open ? '#10b981' : '#ef4444'
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: true,
        position: 'top' as const,
        align: 'start' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          color: currentTheme.colors.text.primary,
          font: {
            size: 11,
            weight: '500',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#6b7280',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            return `${context[0].label}`;
          },
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        position: 'right' as const,
        ticks: {
          color: currentTheme.colors.text.secondary,
          font: {
            size: 10,
          },
          maxTicksLimit: 8,
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.15)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: currentTheme.colors.text.secondary,
          font: {
            size: 10,
          },
          maxTicksLimit: 8,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const volumeChartOptions = {
    ...chartOptions,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: currentTheme.colors.text.primary,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };


  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp size={16} color={currentTheme.colors.status.success} />;
      case 'negative':
        return <TrendingDown size={16} color={currentTheme.colors.status.error} />;
      default:
        return <Activity size={16} color={currentTheme.colors.text.secondary} />;
    }
  };

  // Initialize candlestick data for all coffee types (only once)
  useEffect(() => {
    const initialData: Record<string, CandlestickData[]> = {};
    coffeeTypes.forEach(coffeeType => {
      // Optimal number of periods for each timeframe
      const periods = selectedPeriod === '1D' ? 24 : // 24 hours for 1 day
                     selectedPeriod === '5D' ? 5 : // 5 days
                     selectedPeriod === '1M' ? 30 : // 30 days for 1 month  
                     selectedPeriod === '3M' ? 12 : // 12 weeks for 3 months
                     selectedPeriod === '1A' ? 12 : 24; // 12 months for 1 year
      initialData[coffeeType.id] = generateCandlestickData(coffeeType, selectedPeriod, periods);
    });
    setCandlestickData(initialData);
  }, [selectedPeriod]); // Only depend on selectedPeriod

  // Enhanced real-time updates with realistic price movements (DISABLED for stability)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // Real-time updates disabled to prevent infinite loops
  //   }, 30000);
  //   return () => clearInterval(interval);
  // }, []);
  
  // Calculate SMA when candlestick data changes
  useEffect(() => {
    const currentData = candlestickData[selectedCoffeeType] || [];
    if (currentData.length >= 20) {
      const smaValues = [];
      const priceHistory = currentData.map(item => item.close);
      for (let i = 19; i < priceHistory.length; i++) {
        const sma = calculateSMA(priceHistory.slice(0, i + 1), 20);
        smaValues.push(sma || 0);
      }
      // SMA values calculated but not used in current implementation
    }
  }, [candlestickData, selectedCoffeeType, calculateSMA]);
  
  // Auto-refresh news every 5 minutes
  useEffect(() => {
    const newsInterval = setInterval(() => {
      refreshNews();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(newsInterval);
  }, [refreshNews]);

  return (
    <Box bg={currentTheme.colors.background.secondary} minH="100vh">
      <PageHeader 
        title="Bolsa de Valores - Café" 
        subtitle="Acompanhe cotações e tendências do mercado de café em tempo real"
        icon={TrendingUp}
      />
      <Container maxW="container.2xl" py={4}>
        <VStack spacing={4} align="stretch">
          {/* Abas principais de controle */}
          <Tabs index={coffeeTypes.findIndex(c => c.id === selectedCoffeeType)} onChange={(index) => setSelectedCoffeeType(coffeeTypes[index].id)} variant="enclosed" colorScheme="blue">
            <TabList>
              {coffeeTypes.map((coffee) => (
                <Tab key={coffee.id}>{coffee.name}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {coffeeTypes.map((coffee) => (
                <TabPanel key={coffee.id} p={0} pt={4}>

          <Grid templateColumns={{ base: '1fr', xl: '3fr 1fr' }} gap={4}>
            {/* Área Principal */}
            <GridItem>
              {/* Cards de Informações do Mercado */}
              <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }} gap={4} mb={4}>
                <Card borderRadius="16px" bg="white">
                  <CardBody p={4}>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary}>Último Preço</StatLabel>
                      <StatNumber fontSize="xl" color={currentTheme.colors.text.primary}>R$ {(coffeeTypes.find(c => c.id === selectedCoffeeType)?.price || 0).toFixed(2)}</StatNumber>
                      <StatHelpText color={(coffeeTypes.find(c => c.id === selectedCoffeeType)?.change || 0) >= 0 ? currentTheme.colors.trading.positive : currentTheme.colors.trading.negative}>
                        <StatArrow type={(coffeeTypes.find(c => c.id === selectedCoffeeType)?.change || 0) >= 0 ? 'increase' : 'decrease'} />
                        {Math.abs(coffeeTypes.find(c => c.id === selectedCoffeeType)?.change || 0).toFixed(2)}%
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card borderRadius="16px" bg="white">
                  <CardBody p={4}>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary}>Variação (R$)</StatLabel>
                      <StatNumber fontSize="xl" color={(coffeeTypes.find(c => c.id === selectedCoffeeType)?.change || 0) >= 0 ? currentTheme.colors.trading.positive : currentTheme.colors.trading.negative}>
                        {(coffeeTypes.find(c => c.id === selectedCoffeeType)?.change || 0) >= 0 ? '+' : ''}R$ {Math.abs((coffeeTypes.find(c => c.id === selectedCoffeeType)?.price || 0) * (coffeeTypes.find(c => c.id === selectedCoffeeType)?.change || 0) / 100).toFixed(2)}
                      </StatNumber>
                      <StatHelpText color={(coffeeTypes.find(c => c.id === selectedCoffeeType)?.change || 0) >= 0 ? currentTheme.colors.trading.positive : currentTheme.colors.trading.negative}>
                        {(coffeeTypes.find(c => c.id === selectedCoffeeType)?.change || 0) >= 0 ? '+' : ''}{(coffeeTypes.find(c => c.id === selectedCoffeeType)?.change || 0).toFixed(2)}%
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card borderRadius="16px" bg="white">
                  <CardBody p={4}>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary}>Máxima (24h)</StatLabel>
                      <StatNumber fontSize="xl" color={currentTheme.colors.text.primary}>R$ {((coffeeTypes.find(c => c.id === selectedCoffeeType)?.price || 0) * 1.02).toFixed(2)}</StatNumber>
                      <StatHelpText color={currentTheme.colors.text.tertiary}>Alta do dia</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card borderRadius="16px" bg="white">
                  <CardBody p={4}>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary}>Mínima (24h)</StatLabel>
                      <StatNumber fontSize="xl" color={currentTheme.colors.text.primary}>R$ {((coffeeTypes.find(c => c.id === selectedCoffeeType)?.price || 0) * 0.98).toFixed(2)}</StatNumber>
                      <StatHelpText color={currentTheme.colors.text.tertiary}>Baixa do dia</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card borderRadius="16px" bg="white">
                  <CardBody p={4}>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color={currentTheme.colors.text.secondary}>Volume Total</StatLabel>
                      <StatNumber fontSize="xl" color={currentTheme.colors.text.primary}>{((coffeeTypes.find(c => c.id === selectedCoffeeType)?.volume || 0) / 1000).toFixed(1)}K</StatNumber>
                      <StatHelpText color={currentTheme.colors.text.tertiary}>Sacas negociadas</StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </Grid>

              {/* Trading Section */}
              <Card borderRadius="16px" bg="white" mb={6}>
                <CardHeader>
                  <Flex align="center">
                    <Heading size="md" color={currentTheme.colors.text.primary}>
                      Painel Interativo de Trading - {coffeeTypes.find(c => c.id === selectedCoffeeType)?.name || 'Café'}
                    </Heading>
                    <Spacer />
                  </Flex>
                </CardHeader>
                <CardBody>
                  <HStack spacing={2} mb={4}>
                    <ButtonGroup size="sm" isAttached variant="outline">
                      <Button onClick={() => setSelectedPeriod('1D')} isActive={selectedPeriod === '1D'}>
                        1D
                      </Button>
                      <Button onClick={() => setSelectedPeriod('5D')} isActive={selectedPeriod === '5D'}>
                        5D
                      </Button>
                      <Button onClick={() => setSelectedPeriod('1M')} isActive={selectedPeriod === '1M'}>
                        1M
                      </Button>
                      <Button onClick={() => setSelectedPeriod('3M')} isActive={selectedPeriod === '3M'}>
                        3M
                      </Button>
                      <Button onClick={() => setSelectedPeriod('1A')} isActive={selectedPeriod === '1A'}>
                        1A
                      </Button>
                    </ButtonGroup>
                    <Spacer />
                    <HStack spacing={3}>
                      {/* Real-time trend indicators */}
                      <HStack spacing={1} bg="rgba(16, 185, 129, 0.1)" px={2} py={1} borderRadius="16px"  borderColor="rgba(16, 185, 129, 0.3)">
                        <TrendingUp size={14} color={currentTheme.colors.text.secondary} />
                        <Text fontSize="xs" color="#10b981" fontWeight="bold">
                          {currentCandlestickData.filter(c => c.close > c.open).length}
                        </Text>
                      </HStack>
                      <HStack spacing={1} bg="rgba(239, 68, 68, 0.1)" px={2} py={1} borderRadius="16px"  borderColor="rgba(239, 68, 68, 0.3)">
                        <TrendingDown size={14} color={currentTheme.colors.text.secondary} />
                        <Text fontSize="xs" color="#ef4444" fontWeight="bold">
                          {currentCandlestickData.filter(c => c.close < c.open).length}
                        </Text>
                      </HStack>
                      <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" px={3} py={1}>
                        PREGÃO ABERTO
                      </Badge>
                    </HStack>
                  </HStack>
                  
                  {/* Price Chart with Custom Candlesticks */}
                  <Box h="400px" mb={4}>
                    <Line data={priceChartData} options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        candlestick: {
                          candlestickData: currentCandlestickData
                        },
                        legend: {
                          display: true,
                          position: 'top' as const,
                          align: 'start' as const,
                          labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 15,
                            color: currentTheme.colors.text.primary,
                            font: {
                              size: 11,
                              weight: 'bold',
                            },
                          },
                        },
                        tooltip: {
                          mode: 'index' as const,
                          intersect: false,
                          callbacks: {
                            title: function(context: any) {
                              return `${selectedPeriod === '1D' ? 'Horário' : 'Período'}: ${context[0].label}`;
                            },
                            label: function(context: any) {
                              const dataIndex = context.dataIndex;
                              const candle = currentCandlestickData[dataIndex];
                              if (candle) {
                                const trend = candle.close >= candle.open ? 'Alta' : 'Baixa';
                                const change = ((candle.close - candle.open) / candle.open * 100).toFixed(1);
                                return [
                                  `${trend}: ${change}%`,
                                  `Abertura: R$ ${candle.open.toFixed(2)}`,
                                  `Fechamento: R$ ${candle.close.toFixed(2)}`,
                                  `Máxima: R$ ${candle.high.toFixed(2)}`,
                                  `Mínima: R$ ${candle.low.toFixed(2)}`
                                ];
                              }
                              return context.dataset.label + ': R$ ' + context.parsed.y.toFixed(2);
                            }
                          }
                        }
                      },
                    }} />
                  </Box>
                  
                  
                  <Divider my={4}  />
                  
                  {/* Volume Chart */}
                  <Box h="150px" mb={4}>
                    <Bar data={volumeChartData} options={volumeChartOptions} />
                  </Box>
                  

                </CardBody>
              </Card>

              {/* Enhanced Price Table */}
              
<Card borderRadius="16px" bg="white"  >
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>Preços do Mercado de Café</Heading>
                  <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Atualização em tempo real - Diferentes tipos e contratos</Text>
                </CardHeader>
                <CardBody>
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th color={currentTheme.colors.text.primary}>Ativo</Th>
                          <Th color={currentTheme.colors.text.primary}>Mercado</Th>
                          <Th color={currentTheme.colors.text.primary}>Qualidade</Th>
                          <Th isNumeric color={currentTheme.colors.text.primary}>Preço Atual (R$)</Th>
                          <Th isNumeric color={currentTheme.colors.text.primary}>Variação (%)</Th>
                          <Th isNumeric color={currentTheme.colors.text.primary}>Volume</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {priceTableData.map((item, index) => (
                          <Tr key={index} _hover={{ bg: currentTheme.colors.background.tertiary }}>
                            <Td fontWeight="bold" fontSize="sm" color={currentTheme.colors.text.primary}>{item.tipo}</Td>
                            <Td fontSize="xs" color={currentTheme.colors.text.secondary}>{item.origem}</Td>
                            <Td fontSize="xs">
                              <Badge
                                size="sm"
                                bg={item.qualidade.includes('Premium') ? currentTheme.colors.accent : currentTheme.colors.text.secondary}
                                color={currentTheme.colors.text.inverse}
                              >
                                {item.qualidade}
                              </Badge>
                            </Td>
                            <Td isNumeric fontWeight="bold" color={currentTheme.colors.text.primary}>
                              R$ {item.preco.toFixed(2)}
                            </Td>
                            <Td isNumeric>
                              <HStack justify="flex-end" spacing={1}>
                                {item.variacao >= 0 ? (
                                  <TrendingUp size={14} color={currentTheme.colors.trading.positive} />
                                ) : (
                                  <TrendingDown size={14} color={currentTheme.colors.trading.negative} />
                                )}
                                <Text color={item.variacao >= 0 ? currentTheme.colors.trading.positive : currentTheme.colors.trading.negative} fontWeight="semibold">
                                  {item.variacao >= 0 ? '+' : ''}{item.variacao.toFixed(2)}%
                                </Text>
                              </HStack>
                            </Td>
                            <Td isNumeric fontWeight="medium" color={currentTheme.colors.text.primary}>
                              {item.volume >= 1000 ? `${(item.volume / 1000).toFixed(1)}K` : item.volume}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </GridItem>

            {/* Sidebar de Notícias */}
            <GridItem>
              <Card borderRadius="16px" bg="white" position="sticky" top={4}>
                <CardHeader>
                  <Flex align="center">
                    <Heading size="md" color={currentTheme.colors.text.primary}>Notícias do Mercado</Heading>
                    <Spacer />
                    <IconButton
                      aria-label="Atualizar notícias"
                      icon={newsLoading ? <Spinner size="sm" /> : <RefreshCw size={16} />}
                      size="sm"
                      variant="ghost"
                      onClick={refreshNews}
                      isLoading={newsLoading}
                    />
                  </Flex>
                </CardHeader>
                <CardBody>
                  {newsLoading ? (
                    <VStack spacing={3} justify="center" minH="200px">
                      <Spinner size="lg" color="blue.500" />
                      <Text fontSize="sm" color={currentTheme.colors.text.secondary}>Carregando notícias...</Text>
                    </VStack>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {newsItems.map((news) => (
                        <Box 
                          key={news.id}
                          cursor="pointer"
                          transition="all 0.3s"
                          _hover={{ transform: 'translateX(4px)', opacity: 0.9 }}
                        >
                          <Flex gap={3}>
                            {news.imagem && (
                              <ImageWithFallback
                                src={news.imagem}
                                alt={news.titulo}
                                boxSize="80px"
                                objectFit="cover"
                                borderRadius="16px"
                              />
                            )}
                            <Box flex={1}>
                              <HStack spacing={2} mb={1}>
                                {getImpactIcon(news.impacto)}
                                <Text fontWeight="bold" fontSize="sm" noOfLines={2} color={currentTheme.colors.text.primary}>
                                  {news.titulo}
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color={currentTheme.colors.text.secondary} noOfLines={2} mb={2}>
                                {news.descricao}
                              </Text>
                              <Flex justify="space-between" align="center">
                                <HStack spacing={2}>
                                  <Badge
                                    bg={news.prioridade === 'Alta' ? currentTheme.colors.status.success + '10' : news.prioridade === 'Média' ? currentTheme.colors.status.warning + '10' : currentTheme.colors.status.error + '10'}
                                    color={news.prioridade === 'Alta' ? currentTheme.colors.status.success : news.prioridade === 'Média' ? currentTheme.colors.status.warning : currentTheme.colors.status.error}
                                    
                                    borderColor={news.prioridade === 'Alta' ? currentTheme.colors.status.success + '40' : news.prioridade === 'Média' ? currentTheme.colors.status.warning + '40' : currentTheme.colors.status.error + '40'}
                                    borderRadius="16px"
                                  >
                                    {news.prioridade}
                                  </Badge>
                                  {news.relevancia && (
                                    <Badge
                                      bg={news.relevancia && news.relevancia > 80 ? currentTheme.colors.status.success + '10' : currentTheme.colors.status.warning + '10'}
                                      color={news.relevancia && news.relevancia > 80 ? currentTheme.colors.status.success : currentTheme.colors.status.warning}
                                      
                                      borderColor={news.relevancia && news.relevancia > 80 ? currentTheme.colors.status.success + '40' : currentTheme.colors.status.warning + '40'}
                                      borderRadius="16px"
                                      size="sm"
                                    >
                                      {news.relevancia}%
                                    </Badge>
                                  )}
                                </HStack>
                                <Text fontSize="xs" color={currentTheme.colors.text.tertiary}>
                                  {news.tempo}
                                </Text>
                              </Flex>
                            </Box>
                          </Flex>
                          <Divider mt={4}  />
                        </Box>
                      ))}
                    </VStack>
                  )}
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default Mercado;