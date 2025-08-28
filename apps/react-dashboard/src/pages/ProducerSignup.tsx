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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';
import { FaChartLine, FaDollarSign, FaCloudSunRain, FaUserFriends, FaGoogle, FaUniversity } from 'react-icons/fa';

const ProducerSignup: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme } = useThemeContext();
  const toast = useToast();
  const [producerType, setProducerType] = useState('individual');
  const [acceptTerms, setAcceptTerms] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast({
        title: 'Aceite os termos',
        description: 'Você precisa aceitar os termos de uso para continuar',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    toast({
      title: 'Conta criada com sucesso!',
      description: 'Bem-vindo ao GlobalCoffee',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/producer-data');
  };

  return (
    <Box minH="100vh" bg={currentTheme.colors.background.secondary}>
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }}>
        {/* Form Side */}
        <GridItem bg="white" p={{ base: 6, md: 8, lg: 12 }}>
          <Container maxW="container.md">
            {/* Logo */}
            <HStack spacing={2} mb={8}>
              <Text fontSize="2xl" fontWeight="bold" color={currentTheme.colors.primary}>
                ☕ GlobalCoffee
              </Text>
            </HStack>

            {/* Form Header */}
            <VStack align="start" spacing={3} mb={8}>
              <Heading size="xl" color={currentTheme.colors.text.primary}>
                Crie sua conta de produtor
              </Heading>
              <Text color={currentTheme.colors.text.secondary}>
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
                  <Heading size="md" mb={4} color={currentTheme.colors.text.primary}>
                    Dados Pessoais
                  </Heading>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel>Nome Completo</FormLabel>
                      <Input placeholder="João da Silva" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>CPF/CNPJ</FormLabel>
                      <Input placeholder="000.000.000-00" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input type="email" placeholder="seu@email.com" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Celular</FormLabel>
                      <Input type="tel" placeholder="(00) 00000-0000" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Senha</FormLabel>
                      <Input type="password" placeholder="Mínimo 8 caracteres" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <Input type="password" placeholder="Digite novamente" />
                    </FormControl>
                  </Grid>
                </Box>

                <Divider />

                {/* Property Data Section */}
                <Box>
                  <Heading size="md" mb={4} color={currentTheme.colors.text.primary}>
                    Dados da Propriedade
                  </Heading>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Nome da Propriedade</FormLabel>
                      <Input placeholder="Fazenda São José" />
                    </FormControl>
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                      <FormControl isRequired>
                        <FormLabel>Estado</FormLabel>
                        <Select placeholder="Selecione o estado">
                          <option>Minas Gerais</option>
                          <option>São Paulo</option>
                          <option>Espírito Santo</option>
                          <option>Bahia</option>
                          <option>Paraná</option>
                          <option>Rondônia</option>
                        </Select>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Cidade</FormLabel>
                        <Input placeholder="Nome da cidade" />
                      </FormControl>
                    </Grid>
                    <FormControl isRequired>
                      <FormLabel>Tipo de Produtor</FormLabel>
                      <RadioGroup value={producerType} onChange={setProducerType}>
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
                    <Text px={4} fontSize="sm" color={currentTheme.colors.text.secondary}>
                      ou cadastre-se com
                    </Text>
                    <Divider />
                  </HStack>
                  <HStack spacing={4}>
                    <Button
                      flex={1}
                      variant="outline"
                      leftIcon={<Icon as={FaGoogle} />}
                      
                    >
                      Google
                    </Button>
                    <Button
                      flex={1}
                      variant="outline"
                      leftIcon={<Icon as={FaUniversity} />}
                      
                    >
                      Gov.br
                    </Button>
                  </HStack>
                </Box>

                {/* Terms */}
                <Card borderRadius="16px" bg={currentTheme.colors.background.tertiary}  >
                  <CardBody>
                    <Text fontSize="sm" fontWeight="bold" mb={2} color={currentTheme.colors.text.primary}>
                      TERMOS DE USO E POLÍTICA DE PRIVACIDADE
                    </Text>
                    <Text fontSize="sm" color={currentTheme.colors.text.secondary} mb={4}>
                      Ao criar uma conta, você concorda com nossos termos de uso e política de privacidade.
                      Seus dados serão tratados com segurança e não serão compartilhados sem sua autorização.
                    </Text>
                    <Checkbox
                      isChecked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      colorScheme="green"
                    >
                      Li e aceito os termos de uso e política de privacidade
                    </Checkbox>
                  </CardBody>
                </Card>

                {/* Buttons */}
                <HStack spacing={4}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/login')}
                    borderColor={currentTheme.colors.primary}
                    color={currentTheme.colors.primary}
                  >
                    Já tenho conta
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    bg={currentTheme.colors.primary}
                    color="white"
                    _hover={{ bg: currentTheme.colors.secondary }}
                    flex={1}
                  >
                    Criar conta
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Container>
        </GridItem>

        {/* Benefits Side */}
        <GridItem
          bg={currentTheme.colors.primary}
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
                    borderRadius="16px"
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

            <Card borderRadius="16px" bg="whiteAlpha.200"  borderColor="whiteAlpha.400">
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