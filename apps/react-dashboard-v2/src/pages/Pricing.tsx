import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Button,
  List,
  ListItem,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Icon,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
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
  Textarea,
  Select,
} from '@chakra-ui/react';
import {
  FaCoffee,
  FaChartLine,
  FaLeaf,
  FaCrown,
  FaRocket,
  FaBuilding,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import { BsCheckCircleFill, BsArrowRight } from 'react-icons/bs';

// Services
import { ServiceContainer } from '../services';

// Types
interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  recommended: boolean;
  icon: any;
  color: string;
  badgeColor: string;
}

interface SubscriptionRequest {
  planId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  farmSize: string;
  location: string;
  currentChallenges: string;
  additionalInfo?: string;
}

const Pricing: React.FC = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [formData, setFormData] = useState<SubscriptionRequest>({
    planId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    farmSize: '',
    location: '',
    currentChallenges: '',
    additionalInfo: '',
  });

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Services
  const analyticsService = ServiceContainer.getAnalyticsService();

  // Pricing plans data
  const [plans, setPlans] = useState<PricingPlan[]>([]);

  // Load pricing plans
  const loadPricingPlans = async () => {
    try {
      setLoading(true);

      // In a real implementation, this would come from the backend
      // For now, we'll use static data with some dynamic pricing based on market data
      const staticPlans: PricingPlan[] = [
        {
          id: 'basic',
          name: 'Básico',
          price: 'R$ 99',
          period: '/mês',
          description: 'Ideal para pequenos produtores iniciantes',
          features: [
            'Monitoramento climático básico',
            'Dashboard simplificado',
            'Relatórios mensais',
            'Suporte por email',
            'Até 10 hectares',
            'Alertas básicos de preço',
            'Histórico de 6 meses',
          ],
          limitations: [
            'Sem análise preditiva',
            'Suporte apenas por email',
            'Relatórios básicos',
          ],
          recommended: false,
          icon: FaLeaf,
          color: 'green.500',
          badgeColor: 'green',
        },
        {
          id: 'professional',
          name: 'Profissional',
          price: 'R$ 299',
          period: '/mês',
          description: 'Perfeito para produtores experientes',
          features: [
            'Monitoramento climático avançado',
            'Dashboard completo com KPIs',
            'Relatórios semanais detalhados',
            'Suporte prioritário',
            'Até 50 hectares',
            'Análise de mercado completa',
            'Alertas personalizados',
            'Previsões de preço IA',
            'Análise de qualidade do café',
            'Integração com APIs de mercado',
            'Histórico completo (2 anos)',
            'Exportação de dados',
          ],
          recommended: true,
          icon: FaCrown,
          color: 'yellow.500',
          badgeColor: 'yellow',
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 'Personalizado',
          period: '',
          description: 'Soluções completas para grandes operações',
          features: [
            'Todas as funcionalidades',
            'Dashboard personalizado',
            'Relatórios em tempo real',
            'Suporte dedicado 24/7',
            'Hectares ilimitados',
            'API completa',
            'Treinamento da equipe',
            'Consultoria especializada',
            'Integração ERP',
            'White label disponível',
            'Análise multi-propriedade',
            'Gestão de contratos',
            'Compliance automatizado',
            'Auditoria e certificações',
          ],
          recommended: false,
          icon: FaBuilding,
          color: 'purple.500',
          badgeColor: 'purple',
        },
      ];

      // Try to get dynamic pricing from analytics service
      try {
        const marketAnalysis = await analyticsService.generateMarketReport({
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
          includeForecasts: true,
          includeTechnicalAnalysis: false,
        });

        if (marketAnalysis.success && marketAnalysis.data?.marketCondition) {
          // Adjust pricing based on market conditions
          const marketMultiplier = marketAnalysis.data.marketCondition === 'bullish' ? 1.05 : 
                                  marketAnalysis.data.marketCondition === 'bearish' ? 0.95 : 1.0;
          
          staticPlans.forEach(plan => {
            if (plan.id !== 'enterprise' && plan.price.includes('R$')) {
              const currentPrice = parseFloat(plan.price.replace(/[^\d]/g, ''));
              const adjustedPrice = Math.round(currentPrice * marketMultiplier);
              plan.price = `R$ ${adjustedPrice}`;
            }
          });
        }
      } catch (error) {
        console.warn('Failed to load dynamic pricing, using static prices');
      }

      setPlans(staticPlans);
    } catch (error) {
      console.error('Error loading pricing plans:', error);
      toast({
        title: 'Erro ao carregar planos',
        description: 'Não foi possível carregar os planos de pricing',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle plan selection
  const handleSelectPlan = (plan: PricingPlan) => {
    if (plan.id === 'enterprise') {
      // Open contact form for enterprise
      setSelectedPlan(plan);
      setFormData({ ...formData, planId: plan.id });
      onOpen();
    } else {
      // Open subscription form
      setSelectedPlan(plan);
      setFormData({ ...formData, planId: plan.id });
      onOpen();
    }
  };

  // Handle form submission
  const handleSubmitRequest = async () => {
    try {
      setSubmitting(true);

      // Validate form
      if (!formData.customerName || !formData.customerEmail || !formData.farmSize) {
        toast({
          title: 'Dados obrigatórios',
          description: 'Por favor, preencha todos os campos obrigatórios',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // In a real implementation, this would call a subscription API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // Log subscription request for analytics
      try {
        await analyticsService.generateMarketReport({
          startDate: new Date(),
          endDate: new Date(),
          includeForecasts: false,
          includeTechnicalAnalysis: false,
        });
      } catch (error) {
        console.warn('Failed to log subscription analytics');
      }

      toast({
        title: 'Solicitação enviada!',
        description: selectedPlan?.id === 'enterprise' 
          ? 'Nossa equipe entrará em contato em até 24 horas'
          : 'Você receberá instruções de pagamento por email',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      resetForm();
    } catch (error) {
      toast({
        title: 'Erro ao enviar solicitação',
        description: 'Tente novamente ou entre em contato conosco',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      planId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      farmSize: '',
      location: '',
      currentChallenges: '',
      additionalInfo: '',
    });
    setSelectedPlan(null);
  };

  // Handle form input changes
  const handleInputChange = (field: keyof SubscriptionRequest, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Load data on component mount
  useEffect(() => {
    loadPricingPlans();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brown.500" />
          <Text>Carregando planos...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        {/* Header */}
        <Box textAlign="center">
          <HStack justify="center" mb={4}>
            <Icon as={FaRocket} boxSize={8} color="brown.500" />
            <Heading as="h1" size="xl" color="gray.800">
              Escolha seu Plano
            </Heading>
          </HStack>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Planos flexíveis para atender produtores de todos os tamanhos. 
            Transforme sua produção de café com nossa tecnologia avançada.
          </Text>
        </Box>

        {/* Pricing Cards */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} w="full">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              bg="white"
              borderWidth={plan.recommended ? 3 : 1}
              borderColor={plan.recommended ? plan.color : 'gray.200'}
              position="relative"
              shadow={plan.recommended ? 'xl' : 'md'}
              transform={plan.recommended ? 'scale(1.05)' : 'scale(1)'}
              transition="all 0.3s"
              _hover={{
                transform: plan.recommended ? 'scale(1.07)' : 'scale(1.02)',
                shadow: 'xl',
              }}
            >
              {plan.recommended && (
                <Badge
                  position="absolute"
                  top="-12px"
                  left="50%"
                  transform="translateX(-50%)"
                  bg={plan.color}
                  color="white"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  💎 Mais Popular
                </Badge>
              )}

              <CardHeader pb={2}>
                <VStack spacing={3}>
                  <Icon as={plan.icon} boxSize={12} color={plan.color} />
                  <VStack spacing={1}>
                    <Heading size="lg" color="gray.800">{plan.name}</Heading>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      {plan.description}
                    </Text>
                  </VStack>
                </VStack>
              </CardHeader>

              <CardBody>
                <VStack spacing={6} align="stretch">
                  {/* Price */}
                  <Box textAlign="center">
                    <Text fontSize="4xl" fontWeight="bold" color="gray.800">
                      {plan.price}
                      {plan.period && (
                        <Text as="span" fontSize="lg" color="gray.600" fontWeight="normal">
                          {plan.period}
                        </Text>
                      )}
                    </Text>
                  </Box>

                  {/* Features */}
                  <Box>
                    <Text fontWeight="bold" mb={3} color="gray.800">
                      ✅ Recursos inclusos:
                    </Text>
                    <List spacing={2}>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} display="flex" alignItems="center">
                          <Icon as={BsCheckCircleFill} color={plan.color} mr={2} />
                          <Text fontSize="sm" color="gray.700">{feature}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Limitations (if any) */}
                  {plan.limitations && plan.limitations.length > 0 && (
                    <Box>
                      <Text fontWeight="bold" mb={2} color="gray.600" fontSize="sm">
                        ⚠️ Limitações:
                      </Text>
                      <List spacing={1}>
                        {plan.limitations.map((limitation, idx) => (
                          <ListItem key={idx}>
                            <Text fontSize="xs" color="gray.500">• {limitation}</Text>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Action Button */}
                  <Button
                    size="lg"
                    bg={plan.recommended ? plan.color : 'transparent'}
                    color={plan.recommended ? 'white' : plan.color}
                    borderColor={plan.color}
                    border={plan.recommended ? 'none' : '2px solid'}
                    rightIcon={<Icon as={BsArrowRight} />}
                    _hover={{
                      bg: plan.recommended ? `${plan.color}DD` : `${plan.color}11`,
                      transform: 'translateY(-2px)',
                    }}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {plan.id === 'enterprise' ? 'Contatar Vendas' : 'Começar Agora'}
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Additional Info */}
        <Card bg="brown.50" borderColor="brown.200" borderWidth={1} w="full" mt={8}>
          <CardBody>
            <VStack spacing={4} textAlign="center">
              <Heading size="md" color="brown.800">
                🤝 Garantia de Satisfação
              </Heading>
              <Text color="brown.700" fontSize="sm" maxW="3xl">
                Todos os nossos planos incluem <strong>30 dias de garantia</strong>. 
                Se você não estiver completamente satisfeito, oferecemos reembolso total 
                sem questionamentos. Nossa equipe técnica está sempre disponível para 
                ajudar você a maximizar o valor da plataforma.
              </Text>
              <HStack spacing={8} mt={4}>
                <VStack spacing={1}>
                  <Icon as={FaPhone} color="brown.600" />
                  <Text fontSize="xs" color="brown.600">(11) 99999-9999</Text>
                </VStack>
                <VStack spacing={1}>
                  <Icon as={FaEnvelope} color="brown.600" />
                  <Text fontSize="xs" color="brown.600">contato@plataformacafe.com</Text>
                </VStack>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Subscription/Contact Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <Icon as={selectedPlan?.icon} color={selectedPlan?.color} />
                <Text>
                  {selectedPlan?.id === 'enterprise' 
                    ? 'Solicitar Proposta Enterprise'
                    : `Assinar Plano ${selectedPlan?.name}`
                  }
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            
            <ModalBody>
              <VStack spacing={4}>
                {selectedPlan && (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">
                        {selectedPlan.name} - {selectedPlan.price}{selectedPlan.period}
                      </Text>
                      <Text fontSize="sm">{selectedPlan.description}</Text>
                    </VStack>
                  </Alert>
                )}

                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Nome completo</FormLabel>
                    <Input
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Telefone</FormLabel>
                    <Input
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Tamanho da propriedade</FormLabel>
                    <Select
                      value={formData.farmSize}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                      placeholder="Selecione"
                    >
                      <option value="1-10">1-10 hectares</option>
                      <option value="11-50">11-50 hectares</option>
                      <option value="51-100">51-100 hectares</option>
                      <option value="101-500">101-500 hectares</option>
                      <option value="500+">Mais de 500 hectares</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Localização da propriedade</FormLabel>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Cidade, Estado"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Principais desafios atuais</FormLabel>
                  <Textarea
                    value={formData.currentChallenges}
                    onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                    placeholder="Conte-nos sobre os principais desafios que você enfrenta na gestão da propriedade..."
                    rows={3}
                  />
                </FormControl>

                {selectedPlan?.id === 'enterprise' && (
                  <FormControl>
                    <FormLabel>Informações adicionais</FormLabel>
                    <Textarea
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      placeholder="Requisitos específicos, integração com sistemas existentes, etc."
                      rows={3}
                    />
                  </FormControl>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                bg={selectedPlan?.color}
                color="white"
                _hover={{ bg: `${selectedPlan?.color}DD` }}
                onClick={handleSubmitRequest}
                isLoading={submitting}
                loadingText={selectedPlan?.id === 'enterprise' ? 'Enviando...' : 'Processando...'}
              >
                {selectedPlan?.id === 'enterprise' ? 'Solicitar Proposta' : 'Confirmar Assinatura'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default Pricing;