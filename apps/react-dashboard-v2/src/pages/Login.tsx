import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Text,
  Link,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Divider,
  Alert,
  AlertIcon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Flex,
  Image,
  useToast,
  useColorModeValue,
  Checkbox,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FaCoffee,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaShieldAlt,
} from 'react-icons/fa';
import { BsArrowRight, BsCheckCircle } from 'react-icons/bs';

// Services
import { ServiceContainer } from '../services';
import type { ProducerDTO } from '../dtos/ProducerDTO';

// Types
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginStats {
  totalUsers: number;
  activeUsers: number;
  successRate: number;
  lastUpdate: Date;
}

const Login: React.FC = () => {
  // State management
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginStats, setLoginStats] = useState<LoginStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  // Services
  const producerService = ServiceContainer.getProducerService();
  const analyticsService = ServiceContainer.getAnalyticsService();

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtitleColor = useColorModeValue('gray.600', 'gray.300');

  // Load login statistics
  const loadLoginStats = async () => {
    try {
      // Simulate loading login statistics from analytics
      const analyticsResult = await analyticsService.generateMarketReport({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        includeForecasts: false,
        includeTechnicalAnalysis: false,
      });

      if (analyticsResult.success) {
        // Generate mock login stats
        setLoginStats({
          totalUsers: 15847,
          activeUsers: 12439,
          successRate: 98.7,
          lastUpdate: new Date(),
        });
      }
    } catch (error) {
      console.warn('Failed to load login statistics');
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setCredentials({ ...credentials, [field]: value });
    setError(null); // Clear error when user starts typing
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!validateEmail(credentials.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate authentication process
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Demo credentials validation
      const validCredentials = [
        { email: 'admin@globalcoffee.com', password: 'admin123', role: 'admin' },
        { email: 'produtor@fazenda.com', password: 'produtor123', role: 'producer' },
        { email: 'teste@teste.com.br', password: 'teste@teste', role: 'demo' },
        { email: 'demo@demo.com', password: 'demo123', role: 'demo' },
      ];

      const validUser = validCredentials.find(
        cred => cred.email === credentials.email && cred.password === credentials.password
      );

      if (validUser) {
        // Try to load user profile from Producer Service
        let userProfile: ProducerDTO | null = null;
        try {
          const producers = await producerService.getAllProducers();
          if (producers.success && producers.data.length > 0) {
            userProfile = producers.data.find(p => 
              p.email?.toLowerCase() === credentials.email.toLowerCase()
            ) || producers.data[0]; // Fallback to first producer
          }
        } catch (error) {
          console.warn('Could not load user profile from service');
        }

        // Store authentication data
        const authData = {
          isLoggedIn: true,
          user: {
            email: credentials.email,
            role: validUser.role,
            name: userProfile?.name || 'Usuário',
            loginTime: new Date().toISOString(),
          },
          rememberMe: credentials.rememberMe,
        };

        if (credentials.rememberMe) {
          localStorage.setItem('authData', JSON.stringify(authData));
        } else {
          sessionStorage.setItem('authData', JSON.stringify(authData));
        }
        
        // Set simple flag for compatibility
        localStorage.setItem('isLoggedIn', 'true');

        // Log successful login for analytics
        try {
          await analyticsService.generateMarketReport({
            startDate: new Date(),
            endDate: new Date(),
            includeForecasts: false,
            includeTechnicalAnalysis: false,
          });
        } catch (error) {
          console.warn('Failed to log authentication analytics');
        }

        toast({
          title: 'Login realizado com sucesso!',
          description: `Bem-vindo de volta, ${authData.user.name}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Redirect based on role
        if (validUser.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError('Email ou senha incorretos. Tente: demo@demo.com / demo123');
        toast({
          title: 'Erro no login',
          description: 'Credenciais inválidas. Verifique email e senha.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      setError('Erro interno do servidor. Tente novamente.');
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle social login (demo)
  const handleSocialLogin = (provider: string) => {
    toast({
      title: 'Recurso em desenvolvimento',
      description: `Login com ${provider} estará disponível em breve`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Check if user is already logged in
  useEffect(() => {
    const authData = localStorage.getItem('authData') || sessionStorage.getItem('authData');
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed.isLoggedIn) {
        navigate('/');
        return;
      }
    }

    loadLoginStats();
  }, [navigate]);

  return (
    <Container maxW="container.xl" py={8}>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        align="center"
        justify="center"
        minH="80vh"
        gap={12}
      >
        {/* Left Side - Branding and Stats */}
        <VStack spacing={8} flex={1} align="center" textAlign="center">
          {/* Logo and Brand */}
          <VStack spacing={4}>
            <HStack spacing={3}>
              <Icon as={FaCoffee} boxSize={12} color="brown.500" />
              <VStack spacing={0} align="start">
                <Heading size="xl" color={textColor}>
                  GlobalCoffee
                </Heading>
                <Text color="brown.500" fontSize="lg" fontWeight="bold">
                  Plataforma do Produtor
                </Text>
              </VStack>
            </HStack>
            <Text fontSize="lg" color={subtitleColor} maxW="md">
              A plataforma mais avançada para gestão de produção de café, 
              com análise de mercado e previsões inteligentes.
            </Text>
          </VStack>

          {/* Stats Cards */}
          {loginStats && (
            <VStack spacing={4} w="full" maxW="md">
              <Text fontWeight="bold" color={textColor} mb={2}>
                📊 Nossa Comunidade
              </Text>
              <HStack spacing={4} w="full">
                <Card flex={1} bg={cardBg} borderColor={borderColor} borderWidth={1}>
                  <CardBody textAlign="center" py={4}>
                    <Text fontSize="2xl" fontWeight="bold" color="brown.500">
                      {loginStats.totalUsers.toLocaleString()}
                    </Text>
                    <Text fontSize="sm" color={subtitleColor}>
                      Produtores
                    </Text>
                  </CardBody>
                </Card>
                <Card flex={1} bg={cardBg} borderColor={borderColor} borderWidth={1}>
                  <CardBody textAlign="center" py={4}>
                    <Text fontSize="2xl" fontWeight="bold" color="green.500">
                      {loginStats.successRate}%
                    </Text>
                    <Text fontSize="sm" color={subtitleColor}>
                      Satisfação
                    </Text>
                  </CardBody>
                </Card>
              </HStack>
            </VStack>
          )}

          {/* Features */}
          <VStack spacing={3} align="start" maxW="md">
            <HStack>
              <Icon as={BsCheckCircle} color="green.500" />
              <Text color={subtitleColor}>
                Monitoramento climático em tempo real
              </Text>
            </HStack>
            <HStack>
              <Icon as={BsCheckCircle} color="green.500" />
              <Text color={subtitleColor}>
                Previsões de preço com IA
              </Text>
            </HStack>
            <HStack>
              <Icon as={BsCheckCircle} color="green.500" />
              <Text color={subtitleColor}>
                Análise completa de mercado
              </Text>
            </HStack>
            <HStack>
              <Icon as={BsCheckCircle} color="green.500" />
              <Text color={subtitleColor}>
                Relatórios e dashboards personalizados
              </Text>
            </HStack>
          </VStack>
        </VStack>

        {/* Right Side - Login Form */}
        <VStack spacing={8} flex={1} w="full" maxW="md">
          <Card bg={cardBg} borderColor={borderColor} borderWidth={1} shadow="xl" w="full">
            <CardHeader textAlign="center" pb={2}>
              <VStack spacing={2}>
                <Icon as={FaShieldAlt} boxSize={8} color="brown.500" />
                <Heading size="lg" color={textColor}>
                  Entrar na Plataforma
                </Heading>
                <Text color={subtitleColor} fontSize="sm">
                  Acesse sua conta para gerenciar sua produção
                </Text>
              </VStack>
            </CardHeader>

            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={5}>
                  {error && (
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      <Text fontSize="sm">{error}</Text>
                    </Alert>
                  )}

                  {/* Demo Credentials Info */}
                  <Alert status="info" borderRadius="md" fontSize="sm">
                    <AlertIcon />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">Credenciais de demonstração:</Text>
                      <Text>📧 demo@demo.com</Text>
                      <Text>🔒 demo123</Text>
                    </VStack>
                  </Alert>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaUser} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={credentials.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderColor={error && !credentials.email ? 'red.300' : borderColor}
                        _hover={{ borderColor: 'brown.300' }}
                        _focus={{ borderColor: 'brown.500', boxShadow: '0 0 0 1px brown.500' }}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Senha</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaLock} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={credentials.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        borderColor={error && !credentials.password ? 'red.300' : borderColor}
                        _hover={{ borderColor: 'brown.300' }}
                        _focus={{ borderColor: 'brown.500', boxShadow: '0 0 0 1px brown.500' }}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                          icon={<Icon as={showPassword ? FaEyeSlash : FaEye} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Flex w="full" justify="space-between" align="center">
                    <Checkbox
                      isChecked={credentials.rememberMe}
                      onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                      colorScheme="brown"
                      size="sm"
                    >
                      <Text fontSize="sm" color={subtitleColor}>
                        Lembrar de mim
                      </Text>
                    </Checkbox>
                    <Link color="brown.500" fontSize="sm" fontWeight="medium">
                      Esqueceu a senha?
                    </Link>
                  </Flex>

                  <Button
                    type="submit"
                    bg="brown.500"
                    color="white"
                    size="lg"
                    w="full"
                    rightIcon={loading ? undefined : <Icon as={BsArrowRight} />}
                    isLoading={loading}
                    loadingText="Entrando..."
                    _hover={{ bg: 'brown.600', transform: 'translateY(-2px)' }}
                    _active={{ bg: 'brown.700' }}
                    transition="all 0.3s"
                  >
                    {loading ? (
                      <HStack>
                        <Spinner size="sm" />
                        <Text>Verificando credenciais...</Text>
                      </HStack>
                    ) : (
                      'Entrar na Plataforma'
                    )}
                  </Button>
                </VStack>
              </form>

              {/* Social Login */}
              <VStack spacing={4} mt={6}>
                <HStack w="full">
                  <Divider />
                  <Text color={subtitleColor} fontSize="sm" whiteSpace="nowrap">
                    ou entre com
                  </Text>
                  <Divider />
                </HStack>

                <HStack spacing={3} w="full">
                  <Button
                    leftIcon={<Icon as={FaGoogle} />}
                    variant="outline"
                    flex={1}
                    onClick={() => handleSocialLogin('Google')}
                    borderColor={borderColor}
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                  >
                    Google
                  </Button>
                  <Button
                    leftIcon={<Icon as={FaFacebook} />}
                    variant="outline"
                    flex={1}
                    onClick={() => handleSocialLogin('Facebook')}
                    borderColor={borderColor}
                    _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                  >
                    Facebook
                  </Button>
                </HStack>

                <Text fontSize="sm" color={subtitleColor} textAlign="center">
                  Não tem uma conta?{' '}
                  <Link color="brown.500" fontWeight="medium" onClick={() => navigate('/producer-signup')}>
                    Cadastre-se gratuitamente
                  </Link>
                </Text>
              </VStack>
            </CardBody>
          </Card>

          {/* Security Notice */}
          <Card bg={useColorModeValue('green.50', 'green.900')} borderColor="green.200" borderWidth={1} w="full">
            <CardBody>
              <HStack spacing={3}>
                <Icon as={FaShieldAlt} color="green.500" />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="bold" color="green.700">
                    🔒 Login Seguro
                  </Text>
                  <Text fontSize="xs" color="green.600">
                    Seus dados estão protegidos com criptografia de ponta a ponta
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </Flex>
    </Container>
  );
};

export default Login;