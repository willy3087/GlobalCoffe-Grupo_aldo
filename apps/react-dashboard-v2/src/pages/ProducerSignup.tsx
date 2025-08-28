import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  Grid,
  GridItem,
  Card,
  CardBody,
  Icon,
  Divider,
  useToast,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  StepIcon,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaDollarSign, FaCloudSunRain, FaUserFriends, FaGoogle, FaUniversity } from 'react-icons/fa';

// Services
import { ServiceContainer } from '../services';
import type { ProducerDTO } from '../dtos/ProducerDTO';

// Types
interface SignupFormData {
  // Personal Data
  fullName: string;
  document: string; // CPF/CNPJ
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  // Property Data
  propertyName?: string;
  state: string;
  city: string;
  producerType: 'individual' | 'cooperado' | 'empresa';

  // Terms
  acceptTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const ProducerSignup: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    document: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    propertyName: '',
    state: '',
    city: '',
    producerType: 'individual',
    acceptTerms: false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // Services
  const producerService = ServiceContainer.getProducerService();

  const steps = [
    { title: 'Dados Pessoais', description: 'Informações básicas' },
    { title: 'Propriedade', description: 'Dados da fazenda' },
    { title: 'Verificação', description: 'Confirme seus dados' },
  ];

  const { activeStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const benefits = [
    {
      icon: FaChartLine,
      title: 'Análises de Mercado',
      description: 'Acesse dados exclusivos e tendências do mercado de café em tempo real',
    },
    {
      icon: FaDollarSign,
      title: 'Melhores Preços',
      description: 'Compare ofertas de compradores e encontre as melhores oportunidades',
    },
    {
      icon: FaCloudSunRain,
      title: 'Alertas Climáticos',
      description: 'Receba avisos personalizados sobre condições que afetam sua produção',
    },
    {
      icon: FaUserFriends,
      title: 'Rede de Produtores',
      description: 'Conecte-se com outros produtores e compartilhe experiências',
    },
  ];

  // Handle form input changes
  const handleInputChange = (field: keyof SignupFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Personal data validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!formData.document.trim()) {
      newErrors.document = 'CPF/CNPJ é obrigatório';
    } else {
      // Basic CPF/CNPJ validation (simplified)
      const cleanDocument = formData.document.replace(/[^\d]/g, '');
      if (cleanDocument.length !== 11 && cleanDocument.length !== 14) {
        newErrors.document = 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // Property data validation
    if (!formData.state) {
      newErrors.state = 'Estado é obrigatório';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Convert form data to ProducerDTO
  const convertToProducerDTO = (): Omit<ProducerDTO, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      document: formData.document.replace(/[^\d]/g, ''), // Clean document
      location: {
        state: formData.state,
        region: '', // Will be filled in ProducerData page
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
      },
      productionData: {
        volumeProduced: 0,
        plantedArea: 0,
        averageProductivity: 0,
        plantAgeRange: '',
        coffeeType: 'arabica',
        varieties: '',
      },
      qualityData: {
        classification: '',
        drinkType: '',
        screenSize: '',
        processingMethod: 'via-seca',
      },
      costStructure: {
        production: {
          labor: 0,
          inputs: 0,
          fuel: 0,
          maintenance: 0,
        },
        postHarvest: {
          processing: 0,
          storage: 0,
          transport: 0,
          analysis: 0,
        },
      },
      commercialization: {
        primaryChannel: 'cooperativa',
        paymentTerm: 'vista',
        pricingStrategy: 'spot',
        exportExperience: 'nunca',
      },
      riskManagement: {
        hedgeExperience: 'nunca',
        instruments: [],
        protectionPercentage: '0-20',
        riskProfile: 'conservador',
        ruralInsurance: 'nenhum',
      },
      status: 'pending', // Will be activated after email verification
      propertyName: formData.propertyName,
      city: formData.city,
      producerType: formData.producerType,
    };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Erro na validação',
        description: 'Por favor, corrija os erros no formulário',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      
      // Convert form data to ProducerDTO
      const producerData = convertToProducerDTO();
      
      // Create producer account via service
      const result = await producerService.create(producerData);

      if (result.success) {
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Bem-vindo ao GlobalCoffee. Complete seus dados de produção.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        // Navigate to producer data page to complete profile
        navigate('/producer-data');
      } else {
        throw new Error(result.error || 'Erro ao criar conta');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast({
        title: 'Erro ao criar conta',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      // Handle specific errors
      if (errorMessage.includes('email')) {
        setErrors(prev => ({ ...prev, email: 'Este email já está em uso' }));
      }
      if (errorMessage.includes('document')) {
        setErrors(prev => ({ ...prev, document: 'Este CPF/CNPJ já está cadastrado' }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle third-party login (placeholder)
  const handleThirdPartyLogin = (provider: string) => {
    toast({
      title: 'Em desenvolvimento',
      description: `Login com ${provider} será disponibilizado em breve`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }}>
        {/* Form Side */}
        <GridItem bg="white" p={{ base: 6, md: 8, lg: 12 }}>
          <Container maxW="container.md">
            {/* Logo */}
            <HStack spacing={2} mb={8}>
              <Text fontSize="2xl" fontWeight="bold" color="brown.500">
                ☕ GlobalCoffee
              </Text>
            </HStack>

            {/* Form Header */}
            <VStack align="start" spacing={3} mb={8}>
              <Heading size="xl" color="gray.800">
                Crie sua conta de produtor
              </Heading>
              <Text color="gray.600">
                Junte-se a milhares de produtores conectados ao mercado
              </Text>
            </VStack>

            {/* Progress Steps */}
            <Stepper index={activeStep} mb={8}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              {/* Personal Data Section */}
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading size="md" mb={4} color="gray.800">
                    Dados Pessoais
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <FormControl isRequired isInvalid={!!errors.fullName}>
                      <FormLabel>Nome Completo</FormLabel>
                      <Input 
                        placeholder="João da Silva"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                      <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={!!errors.document}>
                      <FormLabel>CPF/CNPJ</FormLabel>
                      <Input 
                        placeholder="000.000.000-00"
                        value={formData.document}
                        onChange={(e) => handleInputChange('document', e.target.value)}
                      />
                      <FormErrorMessage>{errors.document}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={!!errors.email}>
                      <FormLabel>Email</FormLabel>
                      <Input 
                        type="email" 
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={!!errors.phone}>
                      <FormLabel>Celular</FormLabel>
                      <Input 
                        type="tel" 
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={!!errors.password}>
                      <FormLabel>Senha</FormLabel>
                      <Input 
                        type="password" 
                        placeholder="Mínimo 8 caracteres"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={!!errors.confirmPassword}>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <Input 
                        type="password" 
                        placeholder="Digite novamente"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      />
                      <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                    </FormControl>
                  </Grid>
                </Box>

                <Divider />

                {/* Property Data Section */}
                <Box>
                  <Heading size="md" mb={4} color="gray.800">
                    Dados da Propriedade
                  </Heading>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Nome da Propriedade</FormLabel>
                      <Input 
                        placeholder="Fazenda São José"
                        value={formData.propertyName || ''}
                        onChange={(e) => handleInputChange('propertyName', e.target.value)}
                      />
                    </FormControl>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                      <FormControl isRequired isInvalid={!!errors.state}>
                        <FormLabel>Estado</FormLabel>
                        <Select 
                          placeholder="Selecione o estado"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                        >
                          <option value="MG">Minas Gerais</option>
                          <option value="SP">São Paulo</option>
                          <option value="ES">Espírito Santo</option>
                          <option value="BA">Bahia</option>
                          <option value="PR">Paraná</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="GO">Goiás</option>
                          <option value="MT">Mato Grosso</option>
                          <option value="RO">Rondônia</option>
                        </Select>
                        <FormErrorMessage>{errors.state}</FormErrorMessage>
                      </FormControl>
                      <FormControl isRequired isInvalid={!!errors.city}>
                        <FormLabel>Cidade</FormLabel>
                        <Input 
                          placeholder="Nome da cidade"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                        <FormErrorMessage>{errors.city}</FormErrorMessage>
                      </FormControl>
                    </Grid>
                    <FormControl isRequired>
                      <FormLabel>Tipo de Produtor</FormLabel>
                      <RadioGroup 
                        value={formData.producerType} 
                        onChange={(value) => handleInputChange('producerType', value)}
                      >
                        <Stack direction="row" spacing={4}>
                          <Radio value="individual">Individual</Radio>
                          <Radio value="cooperado">Cooperado</Radio>
                          <Radio value="empresa">Empresa Rural</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </VStack>
                </Box>

                <Divider />

                {/* Alternative Registration */}
                <Box>
                  <HStack mb={4}>
                    <Divider />
                    <Text px={4} fontSize="sm" color="gray.600">
                      ou cadastre-se com
                    </Text>
                    <Divider />
                  </HStack>
                  <HStack spacing={4}>
                    <Button
                      flex={1}
                      variant="outline"
                      leftIcon={<Icon as={FaGoogle} />}
                      borderColor="gray.300"
                      onClick={() => handleThirdPartyLogin('Google')}
                      isDisabled={loading}
                    >
                      Google
                    </Button>
                    <Button
                      flex={1}
                      variant="outline"
                      leftIcon={<Icon as={FaUniversity} />}
                      borderColor="gray.300"
                      onClick={() => handleThirdPartyLogin('Gov.br')}
                      isDisabled={loading}
                    >
                      Gov.br
                    </Button>
                  </HStack>
                </Box>

                {/* Terms */}
                <Card bg="blue.50" borderWidth={1} borderColor="blue.200">
                  <CardBody>
                    <Text fontSize="sm" fontWeight="bold" mb={2} color="gray.800">
                      TERMOS DE USO E POLÍTICA DE PRIVACIDADE
                    </Text>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                      Ao criar uma conta, você concorda com nossos termos de uso e política de privacidade.
                      Seus dados serão tratados com segurança e não serão compartilhados sem sua autorização.
                    </Text>
                    <FormControl isInvalid={!!errors.acceptTerms}>
                      <Checkbox
                        isChecked={formData.acceptTerms}
                        onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                        colorScheme="green"
                      >
                        Li e aceito os termos de uso e política de privacidade
                      </Checkbox>
                      <FormErrorMessage>{errors.acceptTerms}</FormErrorMessage>
                    </FormControl>
                  </CardBody>
                </Card>

                {/* Buttons */}
                <HStack spacing={4}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/login')}
                    borderColor="brown.500"
                    color="brown.500"
                    isDisabled={loading}
                  >
                    Já tenho conta
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    bg="brown.500"
                    color="white"
                    _hover={{ bg: 'brown.600' }}
                    flex={1}
                    isLoading={loading}
                    loadingText="Criando conta..."
                  >
                    {loading ? <Spinner size="sm" /> : 'Criar conta'}
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Container>
        </GridItem>

        {/* Benefits Side */}
        <GridItem
          bg="brown.500"
          color="white"
          p={{ base: 6, md: 8, lg: 12 }}
          display="flex"
          alignItems="center"
        >
          <VStack spacing={8} align="stretch" w="100%">
            <Heading size="lg" textAlign="center">
              Por que criar uma conta?
            </Heading>

            <VStack spacing={6} align="stretch">
              {benefits.map((benefit, index) => (
                <HStack key={index} spacing={4} align="start">
                  <Box
                    p={3}
                    borderRadius="full"
                    borderWidth={2}
                    borderColor="white"
                    flexShrink={0}
                  >
                    <Icon as={benefit.icon} boxSize={6} />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={1}>
                      {benefit.title}
                    </Text>
                    <Text fontSize="sm" opacity={0.9}>
                      {benefit.description}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </VStack>

            <Card bg="whiteAlpha.200" borderWidth={1} borderColor="whiteAlpha.400">
              <CardBody>
                <Text fontStyle="italic" mb={2}>
                  "O GlobalCoffee mudou a forma como vendo meu café. Consigo preços 15% melhores!"
                </Text>
                <Text fontSize="sm">— José Santos, Produtor em MG</Text>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ProducerSignup;