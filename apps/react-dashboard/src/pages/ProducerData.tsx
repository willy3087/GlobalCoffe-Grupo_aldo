import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
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
  Textarea,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Icon,
  List,
  ListItem,
  ListIcon,
  Flex,
  Spacer,
  Badge,
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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useThemeContext } from '../contexts/ThemeContext';
import { 
  FaCheckCircle, 
  FaCircle,
  FaLightbulb,
  FaChartBar,
  FaSearch,
  FaPhone,
  FaFileUpload
} from 'react-icons/fa';
import { MdCheckCircle } from 'react-icons/md';
import { Database } from 'react-feather';

const ProducerData: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const toast = useToast();
  const [coffeeType, setCoffeeType] = useState('arabica');
  const [salesChannel, setSalesChannel] = useState('cooperativa');

  const steps = [
    { title: 'Produção', description: 'Dados da safra' },
    { title: 'Localização', description: 'Geolocalização' },
    { title: 'Qualidade', description: 'Classificação SCA' },
    { title: 'Custos', description: 'Estrutura de custos' },
    { title: 'Comercialização', description: 'Canais de venda' },
    { title: 'Proteção', description: 'Hedge e seguros' },
    { title: 'Revisão', description: 'Confirmar dados' },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const statusItems = [
    { label: 'Dados Básicos', complete: true },
    { label: 'Produção', complete: activeStep > 0 },
    { label: 'Localização', complete: activeStep > 1 },
    { label: 'Qualidade', complete: activeStep > 2 },
    { label: 'Custos', complete: activeStep > 3 },
    { label: 'Comercialização', complete: activeStep > 4 },
    { label: 'Proteção', complete: activeStep > 5 },
  ];

  const helpItems = [
    { icon: FaLightbulb, text: 'Como classificar meu café?' },
    { icon: FaChartBar, text: 'Entenda os tipos de bebida' },
    { icon: FaSearch, text: 'O que são peneiras?' },
    { icon: FaPhone, text: 'Falar com suporte' },
  ];

  const benefits = [
    'Análises personalizadas',
    'Alertas de mercado',
    'Comparativos regionais',
    'Relatórios exclusivos',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Dados salvos com sucesso!',
      description: 'Suas informações foram atualizadas',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: 'Rascunho salvo',
      description: 'Você pode continuar mais tarde',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Produção
        return (
          <>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl isRequired>
                <FormLabel>Volume Produzido (Safra 2024/25)</FormLabel>
                <Input type="number" placeholder="Número de sacas" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Área Plantada Total</FormLabel>
                <Input type="number" placeholder="Hectares" />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl isRequired>
                <FormLabel>Produtividade Média</FormLabel>
                <Input type="number" placeholder="Sacas por hectare" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Idade Média dos Cafezais</FormLabel>
                <Select placeholder="Selecione a faixa">
                  <option value="1-5">1-5 anos</option>
                  <option value="6-10">6-10 anos</option>
                  <option value="11-20">11-20 anos</option>
                  <option value="20+">Mais de 20 anos</option>
                </Select>
              </FormControl>
            </Grid>

            <FormControl isRequired>
              <FormLabel>Tipo de Café Cultivado</FormLabel>
              <RadioGroup value={coffeeType} onChange={setCoffeeType}>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="arabica">Arábica (100%)</Radio>
                  <Radio value="robusta">Robusta/Conilon (100%)</Radio>
                  <Radio value="ambos">Ambos (especificar proporção)</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {coffeeType === 'ambos' && (
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <FormControl>
                  <FormLabel>% Arábica</FormLabel>
                  <Input type="number" placeholder="Percentual de Arábica" />
                </FormControl>
                <FormControl>
                  <FormLabel>% Robusta</FormLabel>
                  <Input type="number" placeholder="Percentual de Robusta" />
                </FormControl>
              </Grid>
            )}

            <FormControl>
              <FormLabel>Variedades Cultivadas</FormLabel>
              <Textarea placeholder="Ex: Mundo Novo, Catuaí Vermelho, Bourbon..." rows={3} />
            </FormControl>
          </>
        );

      case 1: // Localização
        return (
          <>
            <Alert status="info" mb={6} borderRadius="16px">
              <AlertIcon />
              <Text fontSize="sm">
                Dados de localização são essenciais para cálculos climáticos e análises regionais precisas.
              </Text>
            </Alert>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl isRequired>
                <FormLabel>Estado</FormLabel>
                <Select placeholder="Selecione o estado">
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
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Região Cafeeira</FormLabel>
                <Select placeholder="Selecione a região">
                  <option value="cerrado-mg">Cerrado Mineiro</option>
                  <option value="sul-mg">Sul de Minas</option>
                  <option value="mogiana">Mogiana</option>
                  <option value="matas-mg">Matas de Minas</option>
                  <option value="montanhas-es">Montanhas do ES</option>
                  <option value="oeste-ba">Oeste da Bahia</option>
                  <option value="norte-pr">Norte do Paraná</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl isRequired>
                <FormLabel>Latitude</FormLabel>
                <Input type="number" step="0.000001" placeholder="-21.1767" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Longitude</FormLabel>
                <Input type="number" step="0.000001" placeholder="-47.8208" />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Altitude Média (metros)</FormLabel>
                <Input type="number" placeholder="Ex: 1200" />
              </FormControl>
              <FormControl>
                <FormLabel>Cooperativa Local</FormLabel>
                <Input placeholder="Nome da cooperativa (se associado)" />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Observações sobre Microclima</FormLabel>
              <Textarea placeholder="Características específicas da região, microclima, etc." rows={3} />
            </FormControl>
          </>
        );

      case 2: // Qualidade
        return (
          <>
            <Alert status="warning" mb={6} borderRadius="16px">
              <AlertIcon />
              <Text fontSize="sm">
                Dados de qualidade são cruciais para calcular prêmios de preço e posicionamento no mercado.
              </Text>
            </Alert>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Classificação Predominante</FormLabel>
                <Select placeholder="Selecione o tipo">
                  <option value="tipo2">Tipo 2</option>
                  <option value="tipo3">Tipo 3</option>
                  <option value="tipo4">Tipo 4</option>
                  <option value="tipo5">Tipo 5</option>
                  <option value="tipo6">Tipo 6</option>
                  <option value="tipo7">Tipo 7</option>
                  <option value="tipo8">Tipo 8</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Bebida Predominante</FormLabel>
                <Select placeholder="Selecione a bebida">
                  <option value="estritamente-mole">Estritamente Mole</option>
                  <option value="mole">Mole</option>
                  <option value="apenas-mole">Apenas Mole</option>
                  <option value="duro">Duro</option>
                  <option value="riado">Riado</option>
                  <option value="rio">Rio</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Peneiras Predominantes</FormLabel>
                <Input placeholder="Ex: 16/17/18" />
              </FormControl>
              <FormControl>
                <FormLabel>Score SCA (se conhecido)</FormLabel>
                <Input type="number" min="0" max="100" placeholder="Ex: 84" />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Defeitos Tipo 1</FormLabel>
                <Input type="number" placeholder="Quantidade por amostra" />
              </FormControl>
              <FormControl>
                <FormLabel>Defeitos Tipo 2</FormLabel>
                <Input type="number" placeholder="Quantidade por amostra" />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Processo de Beneficiamento</FormLabel>
              <RadioGroup>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="via-seca">Via Seca (Natural)</Radio>
                  <Radio value="via-umida">Via Úmida (Lavado)</Radio>
                  <Radio value="semi-lavado">Semi-lavado</Radio>
                  <Radio value="honey">Honey/Pulped Natural</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Laudo de Classificação (Opcional)</FormLabel>
              <Card
                bg={currentTheme.colors.background.tertiary}
                borderWidth={2}
                borderStyle="dashed"
                
                p={4}
                textAlign="center"
                cursor="pointer"
                _hover={{ bg: currentTheme.colors.background.secondary }}
              >
                <Icon as={FaFileUpload} boxSize={10} color={currentTheme.colors.text.secondary} mb={2} />
                <Text fontWeight="medium" color={currentTheme.colors.text.primary}>
                  Arraste o arquivo ou clique para enviar
                </Text>
                <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                  PDF, JPG ou PNG até 5MB
                </Text>
              </Card>
            </FormControl>
          </>
        );

      case 3: // Custos
        return (
          <>
            <Alert status="info" mb={6} borderRadius="16px">
              <AlertIcon />
              <Text fontSize="sm">
                Estrutura de custos ajuda a calcular margem líquida e rentabilidade por canal de venda.
              </Text>
            </Alert>

            <Heading size="sm" mb={4} color={currentTheme.colors.text.primary}>
              Custos de Produção (R$/hectare)
            </Heading>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Mão de Obra</FormLabel>
                <Input type="number" placeholder="Ex: 2500" />
              </FormControl>
              <FormControl>
                <FormLabel>Insumos (Adubos, Defensivos)</FormLabel>
                <Input type="number" placeholder="Ex: 3200" />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Combustível e Energia</FormLabel>
                <Input type="number" placeholder="Ex: 800" />
              </FormControl>
              <FormControl>
                <FormLabel>Manutenção de Equipamentos</FormLabel>
                <Input type="number" placeholder="Ex: 600" />
              </FormControl>
            </Grid>

            <Heading size="sm" mb={4} mt={6} color={currentTheme.colors.text.primary}>
              Custos Pós-Colheita (R$/saca)
            </Heading>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Beneficiamento</FormLabel>
                <Input type="number" placeholder="Ex: 15" />
              </FormControl>
              <FormControl>
                <FormLabel>Armazenagem</FormLabel>
                <Input type="number" placeholder="Ex: 8" />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Transporte até Cooperativa</FormLabel>
                <Input type="number" placeholder="Ex: 12" />
              </FormControl>
              <FormControl>
                <FormLabel>Classificação e Análises</FormLabel>
                <Input type="number" placeholder="Ex: 5" />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Outros Custos Fixos (R$/hectare/ano)</FormLabel>
              <Textarea placeholder="Impostos, seguros, depreciação de equipamentos..." rows={3} />
            </FormControl>
          </>
        );

      case 4: // Comercialização
        return (
          <>
            <FormControl>
              <FormLabel>Canal de Venda Principal</FormLabel>
              <RadioGroup value={salesChannel} onChange={setSalesChannel}>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="cooperativa">Cooperativa</Radio>
                  <Radio value="corretor">Corretor</Radio>
                  <Radio value="venda-direta">Venda Direta</Radio>
                  <Radio value="misto">Múltiplos Canais</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {salesChannel === 'cooperativa' && (
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <FormControl>
                  <FormLabel>Nome da Cooperativa</FormLabel>
                  <Input placeholder="Ex: COOXUPÉ, COCATREL..." />
                </FormControl>
                <FormControl>
                  <FormLabel>Taxa/Comissão (%)</FormLabel>
                  <Input type="number" step="0.1" placeholder="Ex: 0.5" />
                </FormControl>
              </Grid>
            )}

            {salesChannel === 'corretor' && (
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <FormControl>
                  <FormLabel>Corretoras Utilizadas</FormLabel>
                  <Input placeholder="Nome das principais corretoras" />
                </FormControl>
                <FormControl>
                  <FormLabel>Comissão Média (%)</FormLabel>
                  <Input type="number" step="0.1" placeholder="Ex: 0.75" />
                </FormControl>
              </Grid>
            )}

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Prazo Médio de Pagamento</FormLabel>
                <Select placeholder="Selecione">
                  <option value="vista">À vista</option>
                  <option value="30dias">30 dias</option>
                  <option value="60dias">60 dias</option>
                  <option value="90dias">90 dias</option>
                  <option value="safra">Pagamento na safra</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Volume Médio por Venda</FormLabel>
                <Input type="number" placeholder="Sacas por operação" />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Estratégia de Preços</FormLabel>
              <RadioGroup>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="spot">Venda no mercado spot</Radio>
                  <Radio value="contratos">Contratos a termo</Radio>
                  <Radio value="misto-pricing">Mix de estratégias</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Experiência com Exportação</FormLabel>
              <RadioGroup>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="nunca">Nunca exportei</Radio>
                  <Radio value="indireta">Exportação indireta</Radio>
                  <Radio value="direta">Exportação direta</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </>
        );

      case 5: // Proteção
        return (
          <>
            <Alert status="warning" mb={6} borderRadius="16px">
              <AlertIcon />
              <Text fontSize="sm">
                Ferramentas de proteção ajudam a gerenciar riscos de preço e garantir rentabilidade.
              </Text>
            </Alert>

            <FormControl>
              <FormLabel>Experiência com Hedge</FormLabel>
              <RadioGroup>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="nunca">Nunca usei</Radio>
                  <Radio value="basico">Conhecimento básico</Radio>
                  <Radio value="experiente">Uso regularmente</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Instrumentos já Utilizados</FormLabel>
              <Stack spacing={2}>
                <Box>
                  <input type="checkbox" id="futuros" />
                  <Text as="label" htmlFor="futuros" ml={2}>Contratos Futuros (BM&F/ICE)</Text>
                </Box>
                <Box>
                  <input type="checkbox" id="opcoes" />
                  <Text as="label" htmlFor="opcoes" ml={2}>Opções de Venda</Text>
                </Box>
                <Box>
                  <input type="checkbox" id="contratos" />
                  <Text as="label" htmlFor="contratos" ml={2}>Contratos a Termo</Text>
                </Box>
                <Box>
                  <input type="checkbox" id="cpr" />
                  <Text as="label" htmlFor="cpr" ml={2}>CPR (Cédula do Produtor Rural)</Text>
                </Box>
              </Stack>
            </FormControl>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Percentual da Safra a Proteger</FormLabel>
                <Select placeholder="Selecione">
                  <option value="0-20">0-20%</option>
                  <option value="20-40">20-40%</option>
                  <option value="40-60">40-60%</option>
                  <option value="60-80">60-80%</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Perfil de Risco</FormLabel>
                <Select placeholder="Selecione">
                  <option value="conservador">Conservador</option>
                  <option value="moderado">Moderado</option>
                  <option value="agressivo">Agressivo</option>
                </Select>
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Preço Meta para Safra (R$/saca)</FormLabel>
              <Input type="number" placeholder="Ex: 650" />
            </FormControl>

            <FormControl>
              <FormLabel>Seguro Rural</FormLabel>
              <RadioGroup>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="nenhum">Não possuo</Radio>
                  <Radio value="proagro">PROAGRO</Radio>
                  <Radio value="privado">Seguro Privado</Radio>
                  <Radio value="ambos">PROAGRO + Privado</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Interesse em Assessoria Financeira</FormLabel>
              <RadioGroup>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="sim">Sim, tenho interesse</Radio>
                  <Radio value="talvez">Talvez no futuro</Radio>
                  <Radio value="nao">Não tenho interesse</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </>
        );

      case 6: // Revisão
        return (
          <>
            <Alert status="success" mb={6} borderRadius="16px">
              <AlertIcon />
              <Text fontSize="sm">
                Revise todos os dados antes de finalizar. Você poderá editar essas informações posteriormente.
              </Text>
            </Alert>

            <VStack spacing={4} align="stretch">
              <Card borderRadius="16px" p={4}  >
                <Heading size="sm" mb={2}>Produção</Heading>
                <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                  Volume produzido, área plantada, tipo de café e variedades
                </Text>
              </Card>

              <Card borderRadius="16px" p={4}  >
                <Heading size="sm" mb={2}>Localização</Heading>
                <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                  Coordenadas geográficas, região cafeeira e dados climáticos
                </Text>
              </Card>

              <Card borderRadius="16px" p={4}  >
                <Heading size="sm" mb={2}>Qualidade</Heading>
                <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                  Classificação, peneira, defeitos e processo de beneficiamento
                </Text>
              </Card>

              <Card borderRadius="16px" p={4}  >
                <Heading size="sm" mb={2}>Custos</Heading>
                <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                  Estrutura de custos de produção e pós-colheita
                </Text>
              </Card>

              <Card borderRadius="16px" p={4}  >
                <Heading size="sm" mb={2}>Comercialização</Heading>
                <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                  Canais de venda, prazos de pagamento e estratégias
                </Text>
              </Card>

              <Card borderRadius="16px" p={4}  >
                <Heading size="sm" mb={2}>Proteção</Heading>
                <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                  Instrumentos de hedge, seguros e gestão de riscos
                </Text>
              </Card>
            </VStack>

            <FormControl>
              <FormLabel>Observações Finais</FormLabel>
              <Textarea
                placeholder="Informações adicionais relevantes sobre sua produção..."
                rows={4}
              />
            </FormControl>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box bg={currentTheme.colors.background.secondary} minH="100vh">
      <PageHeader
        title="Atualização de Dados da Produção"
        subtitle="Mantenha suas informações atualizadas para melhores análises e recomendações"
        icon={Database}
      />

      <Container maxW="container.xl" py={4}>
        {/* Progress Steps */}
        <Box bg="white" p={4} borderRadius="16px" mb={4}>
          <Stepper index={activeStep}>
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
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={4}>
          {/* Main Form */}
          <GridItem>
            <Card borderRadius="16px" bg="white"  >
              <CardHeader>
                <Heading size="md" color={currentTheme.colors.text.primary}>
                  Dados da Produção - Safra 2024/2025
                </Heading>
              </CardHeader>
              <CardBody>
                <Alert status="info" mb={6} borderRadius="16px">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Estes dados são usados para calcular suas análises personalizadas e não são compartilhados sem sua autorização.
                  </Text>
                </Alert>

                <form onSubmit={handleSubmit}>
                  <VStack spacing={6} align="stretch">
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <Flex pt={6} borderTopWidth={1} borderTopColor={currentTheme.colors.border.primary}>
                      <Button
                        variant="ghost"
                        color={currentTheme.colors.text.secondary}
                        onClick={handleSaveDraft}
                      >
                        Salvar Rascunho
                      </Button>
                      <Spacer />
                      <HStack spacing={4}>
                        <Button
                          variant="outline"
                          borderColor={currentTheme.colors.primary}
                          color={currentTheme.colors.primary}
                          onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
                          isDisabled={activeStep === 0}
                        >
                          Voltar
                        </Button>
                        <Button
                          type="submit"
                          bg={currentTheme.colors.primary}
                          color="white"
                          _hover={{ bg: currentTheme.colors.secondary }}
                          onClick={() => activeStep < steps.length - 1 && setActiveStep(activeStep + 1)}
                        >
                          {activeStep === steps.length - 1 ? 'Finalizar' : `Próximo: ${steps[activeStep + 1]?.title}`}
                        </Button>
                      </HStack>
                    </Flex>
                  </VStack>
                </form>
              </CardBody>
            </Card>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Progress Status */}
              <Card borderRadius="16px" bg="white"  >
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>
                    Status do Cadastro
                  </Heading>
                </CardHeader>
                <CardBody>
                  <List spacing={3}>
                    {statusItems.map((item, index) => (
                      <ListItem key={index}>
                        <Flex align="center">
                          <ListIcon
                            as={item.complete ? MdCheckCircle : FaCircle}
                            color={item.complete ? currentTheme.colors.status.success : currentTheme.colors.text.tertiary}
                          />
                          <Text color={currentTheme.colors.text.primary}>{item.label}</Text>
                          <Spacer />
                          {item.complete && (
                            <Badge bg={currentTheme.colors.status.success + '10'} color={currentTheme.colors.status.success}  borderColor={currentTheme.colors.status.success + '40'} borderRadius="16px" fontSize="xs">
                              Completo
                            </Badge>
                          )}
                        </Flex>
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Card>

              {/* Help Section */}
              <Card borderRadius="16px" bg="white"  >
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>
                    Precisa de Ajuda?
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    {helpItems.map((item, index) => (
                      <Card
                        key={index}
                        bg={currentTheme.colors.background.tertiary}
                        
                        
                        p={3}
                        cursor="pointer"
                        _hover={{ bg: currentTheme.colors.background.secondary }}
                      >
                        <HStack>
                          <Icon as={item.icon} color={currentTheme.colors.primary} />
                          <Text fontSize="sm" color={currentTheme.colors.text.primary}>
                            {item.text}
                          </Text>
                        </HStack>
                      </Card>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              {/* Benefits */}
              <Card borderRadius="16px" bg="white"  >
                <CardHeader>
                  <Heading size="md" color={currentTheme.colors.text.primary}>
                    Por que atualizar?
                  </Heading>
                </CardHeader>
                <CardBody>
                  <List spacing={3}>
                    {benefits.map((benefit, index) => (
                      <ListItem key={index}>
                        <HStack>
                          <Icon as={FaCheckCircle} color={currentTheme.colors.status.success} />
                          <Text fontSize="sm" color={currentTheme.colors.text.primary}>
                            {benefit}
                          </Text>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProducerData;