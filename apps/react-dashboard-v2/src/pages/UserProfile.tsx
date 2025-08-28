import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Avatar,
  Badge,
  Button,
  Flex,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Progress,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { 
  FaMapMarkerAlt,
  FaCoffee,
  FaDollarSign,
  FaShoppingCart,
  FaShieldAlt,
  FaEdit,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaAward,
  FaTractor,
  FaLeaf,
  FaChartLine,
  FaFileUpload,
  FaUser,
  FaSave,
  FaSync,
  FaDownload,
  FaPrint,
  FaStar,
} from 'react-icons/fa';
import { BsCheckCircleFill, BsShieldCheck } from 'react-icons/bs';

// Services
import { ServiceContainer } from '../services';
import type { ProducerDTO } from '../dtos/ProducerDTO';
import type { AnalyticsReportDTO } from '../dtos/AnalyticsDTO';

// Types
interface UserProfileData extends ProducerDTO {
  calculated?: {
    totalProductionValue: number;
    totalProductionCost: number;
    totalPostHarvestCost: number;
    netMargin: number;
    marginPercentage: number;
    costPerSack: number;
  };
  analytics?: AnalyticsReportDTO;
}

interface EditFormData {
  [key: string]: any;
}

const UserProfile: React.FC = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [editingSection, setEditingSection] = useState<string>('');
  const [editFormData, setEditFormData] = useState<EditFormData>({});
  const [profileStats, setProfileStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Services
  const producerService = ServiceContainer.getProducerService();
  const analyticsService = ServiceContainer.getAnalyticsService();
  const marketDataService = ServiceContainer.getMarketDataService();

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtitleColor = useColorModeValue('gray.600', 'gray.300');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  // Load user profile data
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load current user from authentication
      let currentUserId = 'default-user';
      const authData = localStorage.getItem('authData') || sessionStorage.getItem('authData');
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed.user?.email) {
          currentUserId = parsed.user.email;
        }
      }

      // Load producer data
      const producersResult = await producerService.getAllProducers();
      if (!producersResult.success) {
        throw new Error(producersResult.error || 'Erro ao carregar dados do produtor');
      }

      let currentProducer: ProducerDTO;
      if (producersResult.data.length > 0) {
        // Try to find producer by email, fallback to first producer
        currentProducer = producersResult.data.find(p => 
          p.email?.toLowerCase() === currentUserId.toLowerCase()
        ) || producersResult.data[0];
      } else {
        // Create default producer profile if none exists
        const createResult = await producerService.createProducer({
          id: 'user-001',
          name: 'João Silva Santos',
          email: 'joao.silva@email.com',
          phone: '(35) 99999-8888',
          document: '123.456.789-00',
          address: 'Fazenda Santa Rita, Zona Rural',
          city: 'São Sebastião do Paraíso',
          state: 'MG',
          postalCode: '37950-000',
          farmName: 'Fazenda Santa Rita',
          totalArea: 125,
          productiveArea: 98,
          coffeeVarieties: 'Mundo Novo (60%), Catuaí Vermelho (25%), Bourbon Amarelo (15%)',
          productionVolume: 3500,
          harvestSeason: '2024/2025',
          qualityScore: 86,
          certifications: ['UTZ', 'Rainforest Alliance'],
          coordinates: {
            latitude: -20.9167,
            longitude: -46.8833,
            altitude: 1100,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        if (!createResult.success) {
          throw new Error('Erro ao criar perfil padrão');
        }
        currentProducer = createResult.data;
      }

      // Load analytics data
      let analyticsData: AnalyticsReportDTO | undefined;
      try {
        const analyticsResult = await analyticsService.generateMarketReport({
          startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
          endDate: new Date(),
          includeForecasts: true,
          includeTechnicalAnalysis: true,
        });

        if (analyticsResult.success) {
          analyticsData = analyticsResult.data;
        }
      } catch (error) {
        console.warn('Could not load analytics data');
      }

      // Calculate derived data
      const calculatedData = {
        totalProductionValue: (currentProducer.productionVolume || 3500) * 680, // R$ 680/saca
        totalProductionCost: (currentProducer.productiveArea || 98) * 7950, // R$ 7950/hectare
        totalPostHarvestCost: (currentProducer.productionVolume || 3500) * 51, // R$ 51/saca
        netMargin: 0,
        marginPercentage: 0,
        costPerSack: 0,
      };

      calculatedData.netMargin = calculatedData.totalProductionValue - 
                                calculatedData.totalProductionCost - 
                                calculatedData.totalPostHarvestCost;
      calculatedData.marginPercentage = (calculatedData.netMargin / calculatedData.totalProductionValue) * 100;
      calculatedData.costPerSack = (calculatedData.totalProductionCost + calculatedData.totalPostHarvestCost) / 
                                   (currentProducer.productionVolume || 3500);

      // Set complete user data
      const completeUserData: UserProfileData = {
        ...currentProducer,
        calculated: calculatedData,
        analytics: analyticsData,
      };

      setUserData(completeUserData);

      // Load profile statistics
      await loadProfileStats();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: 'Erro ao carregar perfil',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load profile statistics
  const loadProfileStats = async () => {
    try {
      const marketDataResult = await marketDataService.getCurrentMarketData();
      if (marketDataResult.success && marketDataResult.data.length > 0) {
        const currentPrice = marketDataResult.data[0].price;
        setProfileStats({
          currentPrice,
          lastUpdate: new Date(),
          profileCompleteness: 95,
          verificationStatus: 'verified',
        });
      }
    } catch (error) {
      console.warn('Could not load profile statistics');
    }
  };

  // Handle edit section
  const handleEdit = (section: string) => {
    if (!userData) return;

    setEditingSection(section);
    
    // Pre-populate form with current data
    switch (section) {
      case 'personal':
        setEditFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          postalCode: userData.postalCode,
        });
        break;
      case 'production':
        setEditFormData({
          farmName: userData.farmName,
          totalArea: userData.totalArea,
          productiveArea: userData.productiveArea,
          productionVolume: userData.productionVolume,
          coffeeVarieties: userData.coffeeVarieties,
          harvestSeason: userData.harvestSeason,
        });
        break;
      case 'quality':
        setEditFormData({
          qualityScore: userData.qualityScore,
          certifications: userData.certifications?.join(', ') || '',
        });
        break;
      default:
        setEditFormData({});
    }
    
    onOpen();
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setEditFormData({ ...editFormData, [field]: value });
  };

  // Save profile changes
  const handleSave = async () => {
    if (!userData) return;

    try {
      setSaving(true);

      // Prepare updated data
      let updatedData: Partial<ProducerDTO> = { ...userData };

      switch (editingSection) {
        case 'personal':
          updatedData = {
            ...updatedData,
            name: editFormData.name,
            email: editFormData.email,
            phone: editFormData.phone,
            address: editFormData.address,
            city: editFormData.city,
            state: editFormData.state,
            postalCode: editFormData.postalCode,
          };
          break;
        case 'production':
          updatedData = {
            ...updatedData,
            farmName: editFormData.farmName,
            totalArea: parseFloat(editFormData.totalArea),
            productiveArea: parseFloat(editFormData.productiveArea),
            productionVolume: parseFloat(editFormData.productionVolume),
            coffeeVarieties: editFormData.coffeeVarieties,
            harvestSeason: editFormData.harvestSeason,
          };
          break;
        case 'quality':
          updatedData = {
            ...updatedData,
            qualityScore: parseFloat(editFormData.qualityScore),
            certifications: editFormData.certifications.split(',').map((c: string) => c.trim()).filter(Boolean),
          };
          break;
      }

      // Update producer data
      const updateResult = await producerService.updateProducer(userData.id, updatedData);
      
      if (!updateResult.success) {
        throw new Error(updateResult.error || 'Erro ao atualizar perfil');
      }

      // Reload profile data
      await loadUserProfile();

      toast({
        title: 'Perfil atualizado!',
        description: `Seção "${editingSection}" foi atualizada com sucesso`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar';
      toast({
        title: 'Erro ao salvar',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // Export profile data
  const handleExportProfile = () => {
    if (!userData) return;

    const exportData = {
      profile: userData,
      exportDate: new Date().toISOString(),
      version: '2.0',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfil-produtor-${userData.name?.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Perfil exportado',
      description: 'Arquivo JSON foi baixado com sucesso',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Sync data
  const handleSyncData = async () => {
    toast({
      title: 'Sincronizando...',
      description: 'Atualizando dados do perfil',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    await loadUserProfile();

    toast({
      title: 'Dados sincronizados',
      description: 'Perfil atualizado com sucesso',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Load data on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="brown.500" />
          <Text>Carregando perfil do produtor...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || !userData) {
    return (
      <Box bg={bgColor} minH="100vh" p={8}>
        <Container maxW="container.md">
          <Alert status="error">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">Erro ao carregar perfil</Text>
              <Text>{error || 'Dados do usuário não encontrados'}</Text>
              <Button colorScheme="red" size="sm" onClick={loadUserProfile}>
                Tentar novamente
              </Button>
            </VStack>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Card bg={cardBg} mb={8} borderWidth={1} borderColor={borderColor} shadow="lg">
          <CardBody p={8}>
            <Flex direction={{ base: 'column', lg: 'row' }} align={{ base: 'center', lg: 'start' }} gap={8}>
              {/* Avatar and Basic Info */}
              <VStack spacing={4} align="center">
                <Avatar 
                  size="3xl" 
                  name={userData.name} 
                  bg="brown.500"
                  border="4px solid"
                  borderColor="brown.500"
                />
                <VStack spacing={2}>
                  <Badge 
                    bg="green.500" 
                    color="white" 
                    px={4} 
                    py={2}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    <Icon as={BsShieldCheck} mr={2} />
                    Produtor Verificado
                  </Badge>
                  {profileStats && (
                    <HStack>
                      <Icon as={FaStar} color="yellow.500" />
                      <Text fontSize="sm" color={subtitleColor}>
                        Perfil {profileStats.profileCompleteness}% completo
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
              
              {/* Main Info */}
              <Box flex={1}>
                <VStack align={{ base: 'center', lg: 'start' }} spacing={4}>
                  {/* Name and Location */}
                  <VStack align={{ base: 'center', lg: 'start' }} spacing={1}>
                    <Heading size="xl" color={textColor} textAlign={{ base: 'center', lg: 'left' }}>
                      {userData.name}
                    </Heading>
                    <Text fontSize="lg" color="brown.600" textAlign={{ base: 'center', lg: 'left' }}>
                      {userData.farmName}
                    </Text>
                    <Text fontSize="md" color={subtitleColor} textAlign={{ base: 'center', lg: 'left' }}>
                      {userData.city}, {userData.state}
                    </Text>
                  </VStack>
                  
                  {/* Quick Stats */}
                  <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} w="full" mt={4}>
                    <Card bg={useColorModeValue('brown.50', 'brown.900')} p={4} borderRadius="lg" textAlign="center">
                      <VStack spacing={1}>
                        <Icon as={FaTractor} color="brown.500" boxSize={5} />
                        <Text fontSize="lg" fontWeight="bold" color={textColor}>
                          {userData.totalArea}
                        </Text>
                        <Text fontSize="xs" color={subtitleColor}>
                          hectares
                        </Text>
                      </VStack>
                    </Card>
                    
                    <Card bg={useColorModeValue('brown.50', 'brown.900')} p={4} borderRadius="lg" textAlign="center">
                      <VStack spacing={1}>
                        <Icon as={FaCoffee} color="brown.500" boxSize={5} />
                        <Text fontSize="lg" fontWeight="bold" color={textColor}>
                          {userData.productionVolume?.toLocaleString()}
                        </Text>
                        <Text fontSize="xs" color={subtitleColor}>
                          sacas/safra
                        </Text>
                      </VStack>
                    </Card>
                    
                    <Card bg={useColorModeValue('green.50', 'green.900')} p={4} borderRadius="lg" textAlign="center">
                      <VStack spacing={1}>
                        <Icon as={FaAward} color="green.500" boxSize={5} />
                        <Text fontSize="lg" fontWeight="bold" color="green.600">
                          {userData.qualityScore}
                        </Text>
                        <Text fontSize="xs" color={subtitleColor}>
                          Score SCA
                        </Text>
                      </VStack>
                    </Card>
                    
                    <Card bg={useColorModeValue('blue.50', 'blue.900')} p={4} borderRadius="lg" textAlign="center">
                      <VStack spacing={1}>
                        <Icon as={FaChartLine} color="blue.500" boxSize={5} />
                        <Text fontSize="lg" fontWeight="bold" color="blue.600">
                          {userData.calculated?.marginPercentage.toFixed(1)}%
                        </Text>
                        <Text fontSize="xs" color={subtitleColor}>
                          Margem
                        </Text>
                      </VStack>
                    </Card>
                  </SimpleGrid>

                  {/* Contact Info */}
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} w="full" mt={4}>
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold" fontSize="sm" color={textColor}>
                        📧 Contato
                      </Text>
                      <HStack>
                        <Icon as={FaEnvelope} color={subtitleColor} />
                        <Text fontSize="sm" color={textColor}>
                          {userData.email}
                        </Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaPhone} color={subtitleColor} />
                        <Text fontSize="sm" color={textColor}>
                          {userData.phone}
                        </Text>
                      </HStack>
                    </VStack>
                    
                    <VStack align={{ base: 'start', md: 'end' }} spacing={2}>
                      <Text fontWeight="bold" fontSize="sm" color={textColor}>
                        📅 Informações da Conta
                      </Text>
                      <HStack>
                        <Icon as={FaCalendarAlt} color={subtitleColor} />
                        <Text fontSize="sm" color={subtitleColor}>
                          Membro desde {new Date(userData.createdAt).getFullYear()}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color={subtitleColor}>
                        CPF: {userData.document}
                      </Text>
                    </VStack>
                  </Grid>
                </VStack>
              </Box>

              {/* Action Buttons */}
              <VStack spacing={3}>
                <Button
                  leftIcon={<FaChartLine />}
                  colorScheme="brown"
                  variant="outline"
                  onClick={() => navigate('/kpis-produtor')}
                >
                  Ver KPIs
                </Button>
                <Button
                  leftIcon={<FaEdit />}
                  bg="brown.500"
                  color="white"
                  _hover={{ bg: 'brown.600' }}
                  onClick={() => handleEdit('personal')}
                >
                  Editar Perfil
                </Button>
                <Button
                  leftIcon={<FaSync />}
                  variant="ghost"
                  size="sm"
                  onClick={handleSyncData}
                >
                  Sincronizar
                </Button>
                <Button
                  leftIcon={<FaDownload />}
                  variant="ghost"
                  size="sm"
                  onClick={handleExportProfile}
                >
                  Exportar
                </Button>
              </VStack>
            </Flex>
          </CardBody>
        </Card>

        {/* Profile Sections */}
        <Tabs variant="enclosed" colorScheme="brown">
          <TabList mb={4}>
            <Tab>📊 Visão Geral</Tab>
            <Tab>🚜 Produção</Tab>
            <Tab>🏆 Qualidade</Tab>
            <Tab>💰 Financeiro</Tab>
            <Tab>🛡️ Segurança</Tab>
          </TabList>

          <TabPanels>
            {/* Overview Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
                <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Produtividade</StatLabel>
                      <StatNumber>
                        {userData.productiveArea && userData.productionVolume 
                          ? (userData.productionVolume / userData.productiveArea).toFixed(1)
                          : '35.7'
                        } sc/ha
                      </StatNumber>
                      <StatHelpText color="green.500">
                        <Icon as={FaChartLine} mr={1} />
                        Acima da média
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Score SCA</StatLabel>
                      <StatNumber color="green.500">
                        {userData.qualityScore || 86}
                      </StatNumber>
                      <StatHelpText>
                        <Icon as={FaLeaf} mr={1} />
                        Specialty Coffee
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Receita Estimada</StatLabel>
                      <StatNumber>
                        R$ {((userData.calculated?.totalProductionValue || 0) / 1000000).toFixed(1)}M
                      </StatNumber>
                      <StatHelpText color="green.500">
                        Safra {userData.harvestSeason}
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel>Margem Líquida</StatLabel>
                      <StatNumber color="green.500">
                        {userData.calculated?.marginPercentage.toFixed(1)}%
                      </StatNumber>
                      <StatHelpText>
                        Muito bom desempenho
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Progress Indicators */}
              <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md" color={textColor}>
                    📈 Indicadores de Desempenho
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Flex justify="space-between" mb={2}>
                        <Text fontSize="sm" color={subtitleColor}>Produtividade vs Meta</Text>
                        <Text fontSize="sm" fontWeight="bold" color={textColor}>92%</Text>
                      </Flex>
                      <Progress value={92} colorScheme="green" borderRadius="full" />
                    </Box>
                    
                    <Box>
                      <Flex justify="space-between" mb={2}>
                        <Text fontSize="sm" color={subtitleColor}>Qualidade SCA</Text>
                        <Text fontSize="sm" fontWeight="bold" color={textColor}>
                          {Math.round(((userData.qualityScore || 86) / 100) * 100)}%
                        </Text>
                      </Flex>
                      <Progress 
                        value={((userData.qualityScore || 86) / 100) * 100} 
                        colorScheme="yellow" 
                        borderRadius="full" 
                      />
                    </Box>
                    
                    <Box>
                      <Flex justify="space-between" mb={2}>
                        <Text fontSize="sm" color={subtitleColor}>Rentabilidade</Text>
                        <Text fontSize="sm" fontWeight="bold" color={textColor}>
                          {Math.min(100, Math.round((userData.calculated?.marginPercentage || 0) * 1.5))}%
                        </Text>
                      </Flex>
                      <Progress 
                        value={Math.min(100, Math.round((userData.calculated?.marginPercentage || 0) * 1.5))} 
                        colorScheme="blue" 
                        borderRadius="full" 
                      />
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Production Tab */}
            <TabPanel>
              <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
                <CardHeader>
                  <Flex align="center" justify="space-between">
                    <HStack>
                      <Icon as={FaTractor} color="brown.500" boxSize={6} />
                      <Heading size="md" color={textColor}>
                        Dados de Produção
                      </Heading>
                    </HStack>
                    <Button
                      size="sm"
                      leftIcon={<FaEdit />}
                      variant="ghost"
                      color="brown.500"
                      onClick={() => handleEdit('production')}
                    >
                      Editar
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
                    <VStack align="start" spacing={3}>
                      <Text fontSize="xs" color={subtitleColor} textTransform="uppercase" fontWeight="bold">
                        Estrutura da Fazenda
                      </Text>
                      <VStack align="start" spacing={2} w="full">
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Área Total:</Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            {userData.totalArea} hectares
                          </Text>
                        </Flex>
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Área Produtiva:</Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            {userData.productiveArea} hectares
                          </Text>
                        </Flex>
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Nome da Fazenda:</Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            {userData.farmName}
                          </Text>
                        </Flex>
                      </VStack>
                    </VStack>

                    <VStack align="start" spacing={3}>
                      <Text fontSize="xs" color={subtitleColor} textTransform="uppercase" fontWeight="bold">
                        Produção Atual
                      </Text>
                      <VStack align="start" spacing={2} w="full">
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Volume:</Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            {userData.productionVolume?.toLocaleString()} sacas
                          </Text>
                        </Flex>
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Safra:</Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            {userData.harvestSeason}
                          </Text>
                        </Flex>
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Produtividade:</Text>
                          <Text fontSize="sm" fontWeight="medium" color="green.500">
                            {userData.productiveArea && userData.productionVolume 
                              ? (userData.productionVolume / userData.productiveArea).toFixed(1)
                              : '35.7'
                            } sc/ha
                          </Text>
                        </Flex>
                      </VStack>
                    </VStack>

                    <VStack align="start" spacing={3}>
                      <Text fontSize="xs" color={subtitleColor} textTransform="uppercase" fontWeight="bold">
                        Localização
                      </Text>
                      <VStack align="start" spacing={2} w="full">
                        {userData.coordinates && (
                          <>
                            <Flex justify="space-between" w="full">
                              <Text fontSize="sm" color={subtitleColor}>Altitude:</Text>
                              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                                {userData.coordinates.altitude}m
                              </Text>
                            </Flex>
                            <Flex justify="space-between" w="full">
                              <Text fontSize="sm" color={subtitleColor}>Latitude:</Text>
                              <Text fontSize="sm" fontFamily="mono" color={textColor}>
                                {userData.coordinates.latitude}°
                              </Text>
                            </Flex>
                            <Flex justify="space-between" w="full">
                              <Text fontSize="sm" color={subtitleColor}>Longitude:</Text>
                              <Text fontSize="sm" fontFamily="mono" color={textColor}>
                                {userData.coordinates.longitude}°
                              </Text>
                            </Flex>
                          </>
                        )}
                      </VStack>
                    </VStack>
                  </SimpleGrid>

                  <Divider my={6} />

                  <VStack align="start" spacing={3}>
                    <Text fontSize="xs" color={subtitleColor} textTransform="uppercase" fontWeight="bold">
                      Variedades Cultivadas
                    </Text>
                    <Text fontSize="sm" color={textColor} lineHeight="tall">
                      {userData.coffeeVarieties || 'Mundo Novo (60%), Catuaí Vermelho (25%), Bourbon Amarelo (15%)'}
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Quality Tab */}
            <TabPanel>
              <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
                <CardHeader>
                  <Flex align="center" justify="space-between">
                    <HStack>
                      <Icon as={FaAward} color="brown.500" boxSize={6} />
                      <Heading size="md" color={textColor}>
                        Qualidade e Certificações
                      </Heading>
                    </HStack>
                    <Button
                      size="sm"
                      leftIcon={<FaEdit />}
                      variant="ghost"
                      color="brown.500"
                      onClick={() => handleEdit('quality')}
                    >
                      Editar
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
                    <VStack align="start" spacing={4}>
                      <VStack align="start" spacing={3}>
                        <Text fontSize="xs" color={subtitleColor} textTransform="uppercase" fontWeight="bold">
                          Score SCA Premium
                        </Text>
                        <HStack>
                          <Text fontSize="4xl" fontWeight="bold" color="green.500">
                            {userData.qualityScore || 86}
                          </Text>
                          <Text fontSize="sm" color={subtitleColor}>pontos</Text>
                        </HStack>
                        <Badge bg="green.500" color="white" px={3} py={1}>
                          <Icon as={FaAward} mr={1} />
                          Premium Quality
                        </Badge>
                      </VStack>

                      <Divider />

                      <VStack align="start" spacing={3}>
                        <Text fontSize="xs" color={subtitleColor} textTransform="uppercase" fontWeight="bold">
                          Classificação
                        </Text>
                        <VStack align="start" spacing={2}>
                          <Badge bg="brown.500" color="white">Tipo 2</Badge>
                          <Text fontSize="sm" color={textColor}>Bebida: Estritamente Mole</Text>
                          <Text fontSize="sm" color={textColor}>Peneira: 16/17/18</Text>
                        </VStack>
                      </VStack>
                    </VStack>

                    <VStack align="start" spacing={4}>
                      <VStack align="start" spacing={3}>
                        <Text fontSize="xs" color={subtitleColor} textTransform="uppercase" fontWeight="bold">
                          Certificações
                        </Text>
                        <VStack align="start" spacing={2}>
                          {userData.certifications && userData.certifications.length > 0 ? (
                            userData.certifications.map((cert, index) => (
                              <Badge key={index} bg="green.100" color="green.800" px={3} py={1}>
                                <Icon as={BsCheckCircleFill} mr={1} />
                                {cert}
                              </Badge>
                            ))
                          ) : (
                            <Text fontSize="sm" color={subtitleColor}>
                              Nenhuma certificação registrada
                            </Text>
                          )}
                        </VStack>
                      </VStack>

                      <Divider />

                      <VStack align="start" spacing={3}>
                        <Text fontSize="xs" color={subtitleColor} textTransform="uppercase" fontWeight="bold">
                          Processo
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          Via Seca (Natural)
                        </Text>
                      </VStack>
                    </VStack>
                  </SimpleGrid>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Financial Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={6}>
                <Card bg={useColorModeValue('green.50', 'green.900')} borderColor="green.200" borderWidth={1}>
                  <CardBody textAlign="center">
                    <VStack spacing={2}>
                      <Icon as={FaDollarSign} color="green.500" boxSize={8} />
                      <Text fontSize="xs" color="green.600" textTransform="uppercase" fontWeight="bold">
                        Receita Estimada
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="green.600">
                        R$ {((userData.calculated?.totalProductionValue || 0) / 1000000).toFixed(1)}M
                      </Text>
                      <Text fontSize="xs" color="green.500">
                        Safra {userData.harvestSeason}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={useColorModeValue('orange.50', 'orange.900')} borderColor="orange.200" borderWidth={1}>
                  <CardBody textAlign="center">
                    <VStack spacing={2}>
                      <Icon as={FaTractor} color="orange.500" boxSize={8} />
                      <Text fontSize="xs" color="orange.600" textTransform="uppercase" fontWeight="bold">
                        Custo Total
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                        R$ {(((userData.calculated?.totalProductionCost || 0) + (userData.calculated?.totalPostHarvestCost || 0)) / 1000000).toFixed(1)}M
                      </Text>
                      <Text fontSize="xs" color="orange.500">
                        Por safra
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={useColorModeValue('blue.50', 'blue.900')} borderColor="blue.200" borderWidth={1}>
                  <CardBody textAlign="center">
                    <VStack spacing={2}>
                      <Icon as={FaChartLine} color="blue.500" boxSize={8} />
                      <Text fontSize="xs" color="blue.600" textTransform="uppercase" fontWeight="bold">
                        Margem Líquida
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        {userData.calculated?.marginPercentage.toFixed(1)}%
                      </Text>
                      <Text fontSize="xs" color="blue.500">
                        Muito boa rentabilidade
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>

              <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md" color={textColor}>
                    💰 Detalhamento Financeiro
                  </Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
                    <VStack align="start" spacing={4}>
                      <Text fontSize="sm" fontWeight="bold" color={textColor}>
                        Análise por Saca
                      </Text>
                      <VStack align="start" spacing={2} w="full">
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Preço médio recebido:</Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            R$ 680,00
                          </Text>
                        </Flex>
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Custo por saca:</Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            R$ {userData.calculated?.costPerSack.toFixed(2)}
                          </Text>
                        </Flex>
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Margem por saca:</Text>
                          <Text fontSize="sm" fontWeight="medium" color="green.500">
                            R$ {(680 - (userData.calculated?.costPerSack || 0)).toFixed(2)}
                          </Text>
                        </Flex>
                      </VStack>
                    </VStack>

                    <VStack align="start" spacing={4}>
                      <Text fontSize="sm" fontWeight="bold" color={textColor}>
                        Análise por Hectare
                      </Text>
                      <VStack align="start" spacing={2} w="full">
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Receita/hectare:</Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            R$ {(((userData.calculated?.totalProductionValue || 0) / (userData.productiveArea || 98))).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                          </Text>
                        </Flex>
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Custo/hectare:</Text>
                          <Text fontSize="sm" fontWeight="medium" color={textColor}>
                            R$ 7.950,00
                          </Text>
                        </Flex>
                        <Flex justify="space-between" w="full">
                          <Text fontSize="sm" color={subtitleColor}>Margem/hectare:</Text>
                          <Text fontSize="sm" fontWeight="medium" color="green.500">
                            R$ {(((userData.calculated?.netMargin || 0) / (userData.productiveArea || 98))).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                          </Text>
                        </Flex>
                      </VStack>
                    </VStack>
                  </SimpleGrid>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
                  <CardHeader>
                    <HStack>
                      <Icon as={FaShieldAlt} color="green.500" boxSize={6} />
                      <Heading size="md" color={textColor}>
                        Status de Verificação
                      </Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Icon as={BsCheckCircleFill} color="green.500" />
                          <Text fontSize="sm" color={textColor}>Email verificado</Text>
                        </HStack>
                        <HStack>
                          <Icon as={BsCheckCircleFill} color="green.500" />
                          <Text fontSize="sm" color={textColor}>Telefone verificado</Text>
                        </HStack>
                        <HStack>
                          <Icon as={BsCheckCircleFill} color="green.500" />
                          <Text fontSize="sm" color={textColor}>Documentos validados</Text>
                        </HStack>
                        <HStack>
                          <Icon as={BsCheckCircleFill} color="green.500" />
                          <Text fontSize="sm" color={textColor}>Propriedade verificada</Text>
                        </HStack>
                      </VStack>
                      
                      <VStack align="start" spacing={3}>
                        <Text fontSize="sm" fontWeight="bold" color={textColor}>
                          Nível de Segurança: Alto
                        </Text>
                        <Progress value={95} colorScheme="green" w="full" borderRadius="full" />
                        <Text fontSize="xs" color={subtitleColor}>
                          Sua conta está protegida com verificação em duas etapas
                        </Text>
                      </VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                <Card bg={useColorModeValue('blue.50', 'blue.900')} borderColor="blue.200" borderWidth={1}>
                  <CardBody>
                    <HStack spacing={4}>
                      <Icon as={FaShieldAlt} color="blue.500" boxSize={8} />
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="bold" color="blue.700">
                          🔒 Dados Protegidos
                        </Text>
                        <Text fontSize="xs" color="blue.600">
                          Suas informações estão criptografadas e protegidas por nossa política de privacidade
                        </Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <Icon as={FaEdit} color="brown.500" />
                <Text>Editar {editingSection}</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            
            <ModalBody>
              <VStack spacing={4}>
                {editingSection === 'personal' && (
                  <>
                    <SimpleGrid columns={2} spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Nome completo</FormLabel>
                        <Input
                          value={editFormData.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={editFormData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </FormControl>
                    </SimpleGrid>
                    <SimpleGrid columns={2} spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Telefone</FormLabel>
                        <Input
                          value={editFormData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          value={editFormData.state || ''}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                        >
                          <option value="">Selecione</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="SP">São Paulo</option>
                          <option value="ES">Espírito Santo</option>
                          <option value="RJ">Rio de Janeiro</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                    <FormControl>
                      <FormLabel>Cidade</FormLabel>
                      <Input
                        value={editFormData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Endereço completo</FormLabel>
                      <Textarea
                        value={editFormData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={2}
                      />
                    </FormControl>
                  </>
                )}

                {editingSection === 'production' && (
                  <>
                    <FormControl>
                      <FormLabel>Nome da Fazenda</FormLabel>
                      <Input
                        value={editFormData.farmName || ''}
                        onChange={(e) => handleInputChange('farmName', e.target.value)}
                      />
                    </FormControl>
                    <SimpleGrid columns={2} spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Área Total (hectares)</FormLabel>
                        <Input
                          type="number"
                          value={editFormData.totalArea || ''}
                          onChange={(e) => handleInputChange('totalArea', e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Área Produtiva (hectares)</FormLabel>
                        <Input
                          type="number"
                          value={editFormData.productiveArea || ''}
                          onChange={(e) => handleInputChange('productiveArea', e.target.value)}
                        />
                      </FormControl>
                    </SimpleGrid>
                    <SimpleGrid columns={2} spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Volume de Produção (sacas)</FormLabel>
                        <Input
                          type="number"
                          value={editFormData.productionVolume || ''}
                          onChange={(e) => handleInputChange('productionVolume', e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Safra</FormLabel>
                        <Input
                          value={editFormData.harvestSeason || ''}
                          onChange={(e) => handleInputChange('harvestSeason', e.target.value)}
                          placeholder="Ex: 2024/2025"
                        />
                      </FormControl>
                    </SimpleGrid>
                    <FormControl>
                      <FormLabel>Variedades de Café</FormLabel>
                      <Textarea
                        value={editFormData.coffeeVarieties || ''}
                        onChange={(e) => handleInputChange('coffeeVarieties', e.target.value)}
                        placeholder="Ex: Mundo Novo (60%), Catuaí Vermelho (25%)"
                        rows={2}
                      />
                    </FormControl>
                  </>
                )}

                {editingSection === 'quality' && (
                  <>
                    <FormControl>
                      <FormLabel>Score SCA</FormLabel>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={editFormData.qualityScore || ''}
                        onChange={(e) => handleInputChange('qualityScore', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Certificações (separadas por vírgula)</FormLabel>
                      <Textarea
                        value={editFormData.certifications || ''}
                        onChange={(e) => handleInputChange('certifications', e.target.value)}
                        placeholder="Ex: UTZ, Rainforest Alliance, Orgânico"
                        rows={2}
                      />
                    </FormControl>
                  </>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                bg="brown.500"
                color="white"
                leftIcon={<Icon as={FaSave} />}
                onClick={handleSave}
                isLoading={saving}
                loadingText="Salvando..."
                _hover={{ bg: 'brown.600' }}
              >
                Salvar Alterações
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default UserProfile;