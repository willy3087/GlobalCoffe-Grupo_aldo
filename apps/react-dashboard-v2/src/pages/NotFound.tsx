import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Icon,
  Card,
  CardBody,
  useColorModeValue,
  Grid,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FaCoffee,
  FaHome,
  FaChartLine,
  FaUser,
  FaSearch,
  FaExclamationTriangle,
  FaArrowLeft,
  FaRocket,
} from 'react-icons/fa';
import { BsArrowRight, BsClock, BsShieldCheck } from 'react-icons/bs';

// Services
import { ServiceContainer } from '../services';

// Types
interface QuickLink {
  title: string;
  description: string;
  path: string;
  icon: any;
  color: string;
}

interface PageStats {
  totalPages: number;
  activeUsers: number;
  uptime: string;
  lastUpdate: Date;
}

const NotFound: React.FC = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [pageStats, setPageStats] = useState<PageStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  // Services
  const analyticsService = ServiceContainer.getAnalyticsService();

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtitleColor = useColorModeValue('gray.600', 'gray.300');

  // Quick navigation links
  const quickLinks: QuickLink[] = [
    {
      title: 'Dashboard Principal',
      description: 'Visão geral da sua produção de café',
      path: '/',
      icon: FaHome,
      color: 'green.500',
    },
    {
      title: 'KPIs do Produtor',
      description: 'Indicadores chave de performance',
      path: '/kpis-produtor',
      icon: FaChartLine,
      color: 'blue.500',
    },
    {
      title: 'Perfil do Usuário',
      description: 'Gerencie suas informações pessoais',
      path: '/user-profile',
      icon: FaUser,
      color: 'purple.500',
    },
    {
      title: 'Análise de Mercado',
      description: 'Dados e previsões do mercado de café',
      path: '/mercado',
      icon: FaRocket,
      color: 'orange.500',
    },
  ];

  // Load page statistics
  const loadPageStats = async () => {
    try {
      setLoading(true);

      // Simulate loading analytics for page stats
      const analyticsResult = await analyticsService.generateMarketReport({
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        endDate: new Date(),
        includeForecasts: false,
        includeTechnicalAnalysis: false,
      });

      if (analyticsResult.success) {
        setPageStats({
          totalPages: 17,
          activeUsers: 1247,
          uptime: '99.8%',
          lastUpdate: new Date(),
        });
      }
    } catch (error) {
      console.warn('Could not load page statistics');
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation
  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  // Handle quick link navigation
  const handleQuickLink = (path: string) => {
    navigate(path);
  };

  // Simulate search (for demo purposes)
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // In a real application, this would perform a search
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadPageStats();
  }, []);

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={12}>
        <VStack spacing={12} align="center">
          {/* Main 404 Section */}
          <Card bg={cardBg} borderWidth={1} borderColor={borderColor} shadow="xl" maxW="2xl" w="full">
            <CardBody p={12} textAlign="center">
              <VStack spacing={6}>
                {/* Error Icon and Code */}
                <Box position="relative">
                  <Icon as={FaExclamationTriangle} boxSize={20} color="orange.500" />
                  <Badge
                    position="absolute"
                    top="-2"
                    right="-2"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    404
                  </Badge>
                </Box>

                {/* Main Heading */}
                <VStack spacing={2}>
                  <Heading as="h1" size="2xl" color="brown.500">
                    Página Não Encontrada
                  </Heading>
                  <Text fontSize="lg" color={subtitleColor}>
                    Ops! A página que você está procurando não existe.
                  </Text>
                </VStack>

                {/* Description */}
                <Box>
                  <Text color={textColor} fontSize="md" lineHeight="tall">
                    A URL pode ter sido digitada incorretamente ou a página pode ter sido movida 
                    para um novo endereço. Não se preocupe, vamos ajudá-lo a encontrar o que precisa!
                  </Text>
                </Box>

                {/* Action Buttons */}
                <VStack spacing={4} w="full">
                  <HStack spacing={4} w="full">
                    <Button
                      bg="brown.500"
                      color="white"
                      leftIcon={<Icon as={FaHome} />}
                      rightIcon={<Icon as={BsArrowRight} />}
                      size="lg"
                      onClick={handleNavigateHome}
                      _hover={{ bg: 'brown.600', transform: 'translateY(-2px)' }}
                      transition="all 0.3s"
                      flex={1}
                    >
                      Ir para o Início
                    </Button>
                    <Button
                      variant="outline"
                      borderColor="gray.300"
                      color={textColor}
                      leftIcon={<Icon as={FaArrowLeft} />}
                      size="lg"
                      onClick={handleNavigateBack}
                      _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                      flex={1}
                    >
                      Voltar
                    </Button>
                  </HStack>

                  {/* Search Option */}
                  <Box w="full">
                    <HStack>
                      <Box
                        as="input"
                        type="text"
                        placeholder="Pesquisar páginas..."
                        value={searchQuery}
                        onChange={(e: any) => setSearchQuery(e.target.value)}
                        onKeyPress={(e: any) => e.key === 'Enter' && handleSearch()}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        border="1px solid"
                        borderColor={borderColor}
                        borderRadius="md"
                        px={4}
                        py={2}
                        flex={1}
                        _focus={{
                          outline: 'none',
                          borderColor: 'brown.500',
                          boxShadow: '0 0 0 1px brown.500',
                        }}
                      />
                      <Button
                        bg="brown.500"
                        color="white"
                        leftIcon={<Icon as={FaSearch} />}
                        onClick={handleSearch}
                        _hover={{ bg: 'brown.600' }}
                      >
                        Buscar
                      </Button>
                    </HStack>
                  </Box>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Links Section */}
          <Box w="full">
            <VStack spacing={6}>
              <VStack spacing={2} textAlign="center">
                <Heading size="lg" color={textColor}>
                  🚀 Acesso Rápido
                </Heading>
                <Text color={subtitleColor}>
                  Navegue rapidamente para as páginas mais importantes
                </Text>
              </VStack>

              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} w="full">
                {quickLinks.map((link, index) => (
                  <Card
                    key={index}
                    bg={cardBg}
                    borderWidth={1}
                    borderColor={borderColor}
                    cursor="pointer"
                    transition="all 0.3s"
                    _hover={{
                      transform: 'translateY(-4px)',
                      shadow: 'xl',
                      borderColor: link.color,
                    }}
                    onClick={() => handleQuickLink(link.path)}
                  >
                    <CardBody p={6}>
                      <VStack spacing={4} align="center" textAlign="center">
                        <Icon as={link.icon} boxSize={8} color={link.color} />
                        <VStack spacing={1}>
                          <Text fontSize="lg" fontWeight="bold" color={textColor}>
                            {link.title}
                          </Text>
                          <Text fontSize="sm" color={subtitleColor} noOfLines={2}>
                            {link.description}
                          </Text>
                        </VStack>
                        <Icon as={BsArrowRight} color={link.color} />
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </VStack>
          </Box>

          {/* Platform Status */}
          {pageStats && !loading && (
            <Card bg={useColorModeValue('green.50', 'green.900')} borderColor="green.200" borderWidth={1} w="full">
              <CardBody>
                <VStack spacing={4}>
                  <HStack>
                    <Icon as={BsShieldCheck} color="green.500" boxSize={6} />
                    <Heading size="md" color="green.700">
                      Status da Plataforma
                    </Heading>
                  </HStack>
                  
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} w="full">
                    <VStack spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color="green.600">
                        {pageStats.totalPages}
                      </Text>
                      <Text fontSize="sm" color="green.600">
                        Páginas Ativas
                      </Text>
                    </VStack>
                    
                    <VStack spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color="green.600">
                        {pageStats.activeUsers.toLocaleString()}
                      </Text>
                      <Text fontSize="sm" color="green.600">
                        Usuários Ativos
                      </Text>
                    </VStack>
                    
                    <VStack spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color="green.600">
                        {pageStats.uptime}
                      </Text>
                      <Text fontSize="sm" color="green.600">
                        Disponibilidade
                      </Text>
                    </VStack>
                    
                    <VStack spacing={1}>
                      <HStack>
                        <Icon as={BsClock} color="green.600" />
                        <Text fontSize="sm" color="green.600">
                          Última atualização:
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="green.600">
                        {pageStats.lastUpdate.toLocaleTimeString('pt-BR')}
                      </Text>
                    </VStack>
                  </Grid>

                  <Text fontSize="sm" color="green.600" textAlign="center">
                    ✅ Todos os sistemas estão funcionando normalmente
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Coffee-themed Footer */}
          <Box textAlign="center" w="full">
            <VStack spacing={3}>
              <HStack>
                <Icon as={FaCoffee} color="brown.500" boxSize={6} />
                <Text fontSize="lg" fontWeight="bold" color="brown.500">
                  GlobalCoffee Platform
                </Text>
                <Icon as={FaCoffee} color="brown.500" boxSize={6} />
              </HStack>
              <Text fontSize="sm" color={subtitleColor}>
                Sua plataforma completa para gestão de produção de café
              </Text>
              <HStack spacing={4} mt={4}>
                <Button
                  size="sm"
                  variant="ghost"
                  color="brown.500"
                  onClick={() => navigate('/features')}
                >
                  Recursos
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  color="brown.500"
                  onClick={() => navigate('/pricing')}
                >
                  Planos
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  color="brown.500"
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotFound;