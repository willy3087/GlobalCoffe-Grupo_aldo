import React, { useState, useEffect } from 'react';
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
  Spinner,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
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

// Services
import { ServiceContainer } from '../services';
import type { ProducerDTO } from '../dtos/ProducerDTO';

// Types
interface FormData {
  // Produção
  volumeProduced: number;
  plantedArea: number;
  averageProductivity: number;
  plantAgeRange: string;
  coffeeType: string;
  arabicaPercentage?: number;
  robustaPercentage?: number;
  varieties: string;

  // Localização
  state: string;
  region: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  cooperative?: string;
  microclimateNotes?: string;

  // Qualidade
  classification?: string;
  drinkType?: string;
  screenSize?: string;
  scaScore?: number;
  defectsType1?: number;
  defectsType2?: number;
  processingMethod: string;
  classificationReport?: File;

  // Custos
  laborCost?: number;
  inputsCost?: number;
  fuelCost?: number;
  maintenanceCost?: number;
  processingCost?: number;
  storageCost?: number;
  transportCost?: number;
  analysisCost?: number;
  fixedCosts?: string;

  // Comercialização
  salesChannel: string;
  cooperativeName?: string;
  commissionRate?: number;
  brokerageNames?: string;
  averageCommission?: number;
  paymentTerm: string;
  averageVolume?: number;
  pricingStrategy: string;
  exportExperience: string;

  // Proteção
  hedgeExperience: string;
  instruments: string[];
  protectionPercentage: string;
  riskProfile: string;
  targetPrice?: number;
  ruralInsurance: string;
  advisoryInterest: string;

  // Revisão
  finalNotes?: string;
}

const ProducerData: React.FC = () => {
  const toast = useToast();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingData, setExistingData] = useState<ProducerDTO | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    volumeProduced: 0,
    plantedArea: 0,
    averageProductivity: 0,
    plantAgeRange: '',
    coffeeType: 'arabica',
    varieties: '',
    state: '',
    region: '',
    latitude: 0,
    longitude: 0,
    processingMethod: 'via-seca',
    salesChannel: 'cooperativa',
    paymentTerm: 'vista',
    pricingStrategy: 'spot',
    exportExperience: 'nunca',
    hedgeExperience: 'nunca',
    instruments: [],
    protectionPercentage: '0-20',
    riskProfile: 'conservador',
    ruralInsurance: 'nenhum',
    advisoryInterest: 'sim',
  });

  // Services
  const producerService = ServiceContainer.getProducerService();

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

  // Load existing producer data
  const loadExistingData = async () => {
    try {
      setLoading(true);
      const result = await producerService.getById('current-user'); // Would use actual user ID
      
      if (result.success && result.data) {
        setExistingData(result.data);
        // Convert existing data to form format
        populateFormFromExistingData(result.data);
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Populate form with existing data
  const populateFormFromExistingData = (data: ProducerDTO) => {
    setFormData(prevData => ({
      ...prevData,
      volumeProduced: data.productionData?.volumeProduced || 0,
      plantedArea: data.productionData?.plantedArea || 0,
      averageProductivity: data.productionData?.averageProductivity || 0,
      coffeeType: data.productionData?.coffeeType || 'arabica',
      varieties: data.productionData?.varieties || '',
      state: data.location?.state || '',
      region: data.location?.region || '',
      latitude: data.location?.coordinates?.latitude || 0,
      longitude: data.location?.coordinates?.longitude || 0,
      altitude: data.location?.altitude,
      cooperative: data.commercialization?.cooperativeName || '',
      // Add other mappings as needed
    }));
  };

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Convert form data to ProducerDTO
  const convertToProducerDTO = (): Partial<ProducerDTO> => {
    return {
      id: existingData?.id || `producer_${Date.now()}`,
      name: existingData?.name || 'Produtor', // Would get from user profile
      email: existingData?.email || 'produtor@example.com',
      phone: existingData?.phone,
      document: existingData?.document,
      location: {
        state: formData.state,
        region: formData.region,
        coordinates: {
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        altitude: formData.altitude,
        microclimateNotes: formData.microclimateNotes,
      },
      productionData: {
        volumeProduced: formData.volumeProduced,
        plantedArea: formData.plantedArea,
        averageProductivity: formData.averageProductivity,
        plantAgeRange: formData.plantAgeRange,
        coffeeType: formData.coffeeType as 'arabica' | 'robusta' | 'both',
        varieties: formData.varieties,
      },
      qualityData: {
        classification: formData.classification,
        drinkType: formData.drinkType,
        screenSize: formData.screenSize,
        scaScore: formData.scaScore,
        defectsType1: formData.defectsType1,
        defectsType2: formData.defectsType2,
        processingMethod: formData.processingMethod,
      },
      costStructure: {
        production: {
          labor: formData.laborCost || 0,
          inputs: formData.inputsCost || 0,
          fuel: formData.fuelCost || 0,
          maintenance: formData.maintenanceCost || 0,
        },
        postHarvest: {
          processing: formData.processingCost || 0,
          storage: formData.storageCost || 0,
          transport: formData.transportCost || 0,
          analysis: formData.analysisCost || 0,
        },
      },
      commercialization: {
        primaryChannel: formData.salesChannel,
        cooperativeName: formData.cooperativeName,
        commissionRate: formData.commissionRate,
        paymentTerm: formData.paymentTerm,
        averageVolume: formData.averageVolume,
        pricingStrategy: formData.pricingStrategy,
        exportExperience: formData.exportExperience,
      },
      riskManagement: {
        hedgeExperience: formData.hedgeExperience,
        instruments: formData.instruments,
        protectionPercentage: formData.protectionPercentage,
        riskProfile: formData.riskProfile,
        targetPrice: formData.targetPrice,
        ruralInsurance: formData.ruralInsurance,
      },
      status: 'active',
      createdAt: existingData?.createdAt || new Date(),
      updatedAt: new Date(),
    };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      return;
    }

    try {
      setSaving(true);
      const producerData = convertToProducerDTO();
      
      let result;
      if (existingData) {
        result = await producerService.update(existingData.id, producerData);
      } else {
        result = await producerService.create(producerData);
      }

      if (result.success) {
        toast({
          title: 'Dados salvos com sucesso!',
          description: 'Suas informações foram atualizadas',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(result.error || 'Erro ao salvar dados');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro ao salvar dados',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    try {
      setSaving(true);
      const producerData = convertToProducerDTO();
      
      // Save as draft (could have a different status)
      const draftData = { ...producerData, status: 'draft' as const };
      
      let result;
      if (existingData) {
        result = await producerService.update(existingData.id, draftData);
      } else {
        result = await producerService.create(draftData);
      }

      if (result.success) {
        toast({
          title: 'Rascunho salvo',
          description: 'Você pode continuar mais tarde',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(result.error || 'Erro ao salvar rascunho');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast({
        title: 'Erro ao salvar rascunho',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Produção
        return (
          <>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl isRequired>
                <FormLabel>Volume Produzido (Safra 2024/25)</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Número de sacas"
                  value={formData.volumeProduced}
                  onChange={(e) => handleInputChange('volumeProduced', Number(e.target.value))}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Área Plantada Total</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Hectares"
                  value={formData.plantedArea}
                  onChange={(e) => handleInputChange('plantedArea', Number(e.target.value))}
                />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl isRequired>
                <FormLabel>Produtividade Média</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Sacas por hectare"
                  value={formData.averageProductivity}
                  onChange={(e) => handleInputChange('averageProductivity', Number(e.target.value))}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Idade Média dos Cafezais</FormLabel>
                <Select 
                  placeholder="Selecione a faixa"
                  value={formData.plantAgeRange}
                  onChange={(e) => handleInputChange('plantAgeRange', e.target.value)}
                >
                  <option value="1-5">1-5 anos</option>
                  <option value="6-10">6-10 anos</option>
                  <option value="11-20">11-20 anos</option>
                  <option value="20+">Mais de 20 anos</option>
                </Select>
              </FormControl>
            </Grid>

            <FormControl isRequired>
              <FormLabel>Tipo de Café Cultivado</FormLabel>
              <RadioGroup 
                value={formData.coffeeType} 
                onChange={(value) => handleInputChange('coffeeType', value)}
              >
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="arabica">Arábica (100%)</Radio>
                  <Radio value="robusta">Robusta/Conilon (100%)</Radio>
                  <Radio value="both">Ambos (especificar proporção)</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {formData.coffeeType === 'both' && (
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <FormControl>
                  <FormLabel>% Arábica</FormLabel>
                  <Input 
                    type="number" 
                    placeholder="Percentual de Arábica"
                    value={formData.arabicaPercentage || ''}
                    onChange={(e) => handleInputChange('arabicaPercentage', Number(e.target.value))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>% Robusta</FormLabel>
                  <Input 
                    type="number" 
                    placeholder="Percentual de Robusta"
                    value={formData.robustaPercentage || ''}
                    onChange={(e) => handleInputChange('robustaPercentage', Number(e.target.value))}
                  />
                </FormControl>
              </Grid>
            )}

            <FormControl>
              <FormLabel>Variedades Cultivadas</FormLabel>
              <Textarea 
                placeholder="Ex: Mundo Novo, Catuaí Vermelho, Bourbon..."
                rows={3}
                value={formData.varieties}
                onChange={(e) => handleInputChange('varieties', e.target.value)}
              />
            </FormControl>
          </>
        );

      case 1: // Localização
        return (
          <>
            <Alert status="info" mb={6} borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                Dados de localização são essenciais para cálculos climáticos e análises regionais precisas.
              </Text>
            </Alert>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl isRequired>
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
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Região Cafeeira</FormLabel>
                <Select 
                  placeholder="Selecione a região"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                >
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
                <Input 
                  type="number" 
                  step="0.000001" 
                  placeholder="-21.1767"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', Number(e.target.value))}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Longitude</FormLabel>
                <Input 
                  type="number" 
                  step="0.000001" 
                  placeholder="-47.8208"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', Number(e.target.value))}
                />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Altitude Média (metros)</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Ex: 1200"
                  value={formData.altitude || ''}
                  onChange={(e) => handleInputChange('altitude', Number(e.target.value))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Cooperativa Local</FormLabel>
                <Input 
                  placeholder="Nome da cooperativa (se associado)"
                  value={formData.cooperative || ''}
                  onChange={(e) => handleInputChange('cooperative', e.target.value)}
                />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Observações sobre Microclima</FormLabel>
              <Textarea 
                placeholder="Características específicas da região, microclima, etc."
                rows={3}
                value={formData.microclimateNotes || ''}
                onChange={(e) => handleInputChange('microclimateNotes', e.target.value)}
              />
            </FormControl>
          </>
        );

      case 2: // Qualidade
        return (
          <>
            <Alert status="warning" mb={6} borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                Dados de qualidade são cruciais para calcular prêmios de preço e posicionamento no mercado.
              </Text>
            </Alert>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Classificação Predominante</FormLabel>
                <Select 
                  placeholder="Selecione o tipo"
                  value={formData.classification || ''}
                  onChange={(e) => handleInputChange('classification', e.target.value)}
                >
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
                <Select 
                  placeholder="Selecione a bebida"
                  value={formData.drinkType || ''}
                  onChange={(e) => handleInputChange('drinkType', e.target.value)}
                >
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
                <Input 
                  placeholder="Ex: 16/17/18"
                  value={formData.screenSize || ''}
                  onChange={(e) => handleInputChange('screenSize', e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Score SCA (se conhecido)</FormLabel>
                <Input 
                  type="number" 
                  min="0" 
                  max="100" 
                  placeholder="Ex: 84"
                  value={formData.scaScore || ''}
                  onChange={(e) => handleInputChange('scaScore', Number(e.target.value))}
                />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Defeitos Tipo 1</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Quantidade por amostra"
                  value={formData.defectsType1 || ''}
                  onChange={(e) => handleInputChange('defectsType1', Number(e.target.value))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Defeitos Tipo 2</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Quantidade por amostra"
                  value={formData.defectsType2 || ''}
                  onChange={(e) => handleInputChange('defectsType2', Number(e.target.value))}
                />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Processo de Beneficiamento</FormLabel>
              <RadioGroup 
                value={formData.processingMethod}
                onChange={(value) => handleInputChange('processingMethod', value)}
              >
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
                bg="gray.50"
                borderWidth={2}
                borderStyle="dashed"
                borderColor="gray.300"
                p={8}
                textAlign="center"
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
              >
                <Icon as={FaFileUpload} boxSize={10} color="gray.500" mb={2} />
                <Text fontWeight="medium" color="gray.800">
                  Arraste o arquivo ou clique para enviar
                </Text>
                <Text fontSize="sm" color="gray.600">
                  PDF, JPG ou PNG até 5MB
                </Text>
              </Card>
            </FormControl>
          </>
        );

      case 3: // Custos
        return (
          <>
            <Alert status="info" mb={6} borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                Estrutura de custos ajuda a calcular margem líquida e rentabilidade por canal de venda.
              </Text>
            </Alert>

            <Heading size="sm" mb={4} color="gray.800">
              Custos de Produção (R$/hectare)
            </Heading>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Mão de Obra</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Ex: 2500"
                  value={formData.laborCost || ''}
                  onChange={(e) => handleInputChange('laborCost', Number(e.target.value))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Insumos (Adubos, Defensivos)</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Ex: 3200"
                  value={formData.inputsCost || ''}
                  onChange={(e) => handleInputChange('inputsCost', Number(e.target.value))}
                />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Combustível e Energia</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Ex: 800"
                  value={formData.fuelCost || ''}
                  onChange={(e) => handleInputChange('fuelCost', Number(e.target.value))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Manutenção de Equipamentos</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Ex: 600"
                  value={formData.maintenanceCost || ''}
                  onChange={(e) => handleInputChange('maintenanceCost', Number(e.target.value))}
                />
              </FormControl>
            </Grid>

            <Heading size="sm" mb={4} mt={6} color="gray.800">
              Custos Pós-Colheita (R$/saca)
            </Heading>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Beneficiamento</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Ex: 15"
                  value={formData.processingCost || ''}
                  onChange={(e) => handleInputChange('processingCost', Number(e.target.value))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Armazenagem</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Ex: 8"
                  value={formData.storageCost || ''}
                  onChange={(e) => handleInputChange('storageCost', Number(e.target.value))}
                />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Transporte até Cooperativa</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Ex: 12"
                  value={formData.transportCost || ''}
                  onChange={(e) => handleInputChange('transportCost', Number(e.target.value))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Classificação e Análises</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Ex: 5"
                  value={formData.analysisCost || ''}
                  onChange={(e) => handleInputChange('analysisCost', Number(e.target.value))}
                />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Outros Custos Fixos (R$/hectare/ano)</FormLabel>
              <Textarea 
                placeholder="Impostos, seguros, depreciação de equipamentos..."
                rows={3}
                value={formData.fixedCosts || ''}
                onChange={(e) => handleInputChange('fixedCosts', e.target.value)}
              />
            </FormControl>
          </>
        );

      case 4: // Comercialização
        return (
          <>
            <FormControl>
              <FormLabel>Canal de Venda Principal</FormLabel>
              <RadioGroup 
                value={formData.salesChannel} 
                onChange={(value) => handleInputChange('salesChannel', value)}
              >
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="cooperativa">Cooperativa</Radio>
                  <Radio value="corretor">Corretor</Radio>
                  <Radio value="venda-direta">Venda Direta</Radio>
                  <Radio value="misto">Múltiplos Canais</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {formData.salesChannel === 'cooperativa' && (
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <FormControl>
                  <FormLabel>Nome da Cooperativa</FormLabel>
                  <Input 
                    placeholder="Ex: COOXUPÉ, COCATREL..."
                    value={formData.cooperativeName || ''}
                    onChange={(e) => handleInputChange('cooperativeName', e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Taxa/Comissão (%)</FormLabel>
                  <Input 
                    type="number" 
                    step="0.1" 
                    placeholder="Ex: 0.5"
                    value={formData.commissionRate || ''}
                    onChange={(e) => handleInputChange('commissionRate', Number(e.target.value))}
                  />
                </FormControl>
              </Grid>
            )}

            {formData.salesChannel === 'corretor' && (
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <FormControl>
                  <FormLabel>Corretoras Utilizadas</FormLabel>
                  <Input 
                    placeholder="Nome das principais corretoras"
                    value={formData.brokerageNames || ''}
                    onChange={(e) => handleInputChange('brokerageNames', e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Comissão Média (%)</FormLabel>
                  <Input 
                    type="number" 
                    step="0.1" 
                    placeholder="Ex: 0.75"
                    value={formData.averageCommission || ''}
                    onChange={(e) => handleInputChange('averageCommission', Number(e.target.value))}
                  />
                </FormControl>
              </Grid>
            )}

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Prazo Médio de Pagamento</FormLabel>
                <Select 
                  placeholder="Selecione"
                  value={formData.paymentTerm}
                  onChange={(e) => handleInputChange('paymentTerm', e.target.value)}
                >
                  <option value="vista">À vista</option>
                  <option value="30dias">30 dias</option>
                  <option value="60dias">60 dias</option>
                  <option value="90dias">90 dias</option>
                  <option value="safra">Pagamento na safra</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Volume Médio por Venda</FormLabel>
                <Input 
                  type="number" 
                  placeholder="Sacas por operação"
                  value={formData.averageVolume || ''}
                  onChange={(e) => handleInputChange('averageVolume', Number(e.target.value))}
                />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Estratégia de Preços</FormLabel>
              <RadioGroup 
                value={formData.pricingStrategy}
                onChange={(value) => handleInputChange('pricingStrategy', value)}
              >
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="spot">Venda no mercado spot</Radio>
                  <Radio value="contratos">Contratos a termo</Radio>
                  <Radio value="misto-pricing">Mix de estratégias</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Experiência com Exportação</FormLabel>
              <RadioGroup 
                value={formData.exportExperience}
                onChange={(value) => handleInputChange('exportExperience', value)}
              >
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
            <Alert status="warning" mb={6} borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                Ferramentas de proteção ajudam a gerenciar riscos de preço e garantir rentabilidade.
              </Text>
            </Alert>

            <FormControl>
              <FormLabel>Experiência com Hedge</FormLabel>
              <RadioGroup 
                value={formData.hedgeExperience}
                onChange={(value) => handleInputChange('hedgeExperience', value)}
              >
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <Radio value="nunca">Nunca usei</Radio>
                  <Radio value="basico">Conhecimento básico</Radio>
                  <Radio value="experiente">Uso regularmente</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Instrumentos já Utilizados</FormLabel>
              <CheckboxGroup 
                value={formData.instruments}
                onChange={(values) => handleInputChange('instruments', values)}
              >
                <Stack spacing={2}>
                  <Checkbox value="futuros">Contratos Futuros (BM&F/ICE)</Checkbox>
                  <Checkbox value="opcoes">Opções de Venda</Checkbox>
                  <Checkbox value="contratos">Contratos a Termo</Checkbox>
                  <Checkbox value="cpr">CPR (Cédula do Produtor Rural)</Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              <FormControl>
                <FormLabel>Percentual da Safra a Proteger</FormLabel>
                <Select 
                  placeholder="Selecione"
                  value={formData.protectionPercentage}
                  onChange={(e) => handleInputChange('protectionPercentage', e.target.value)}
                >
                  <option value="0-20">0-20%</option>
                  <option value="20-40">20-40%</option>
                  <option value="40-60">40-60%</option>
                  <option value="60-80">60-80%</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Perfil de Risco</FormLabel>
                <Select 
                  placeholder="Selecione"
                  value={formData.riskProfile}
                  onChange={(e) => handleInputChange('riskProfile', e.target.value)}
                >
                  <option value="conservador">Conservador</option>
                  <option value="moderado">Moderado</option>
                  <option value="agressivo">Agressivo</option>
                </Select>
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel>Preço Meta para Safra (R$/saca)</FormLabel>
              <Input 
                type="number" 
                placeholder="Ex: 650"
                value={formData.targetPrice || ''}
                onChange={(e) => handleInputChange('targetPrice', Number(e.target.value))}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Seguro Rural</FormLabel>
              <RadioGroup 
                value={formData.ruralInsurance}
                onChange={(value) => handleInputChange('ruralInsurance', value)}
              >
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
              <RadioGroup 
                value={formData.advisoryInterest}
                onChange={(value) => handleInputChange('advisoryInterest', value)}
              >
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
            <Alert status="success" mb={6} borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                Revise todos os dados antes de finalizar. Você poderá editar essas informações posteriormente.
              </Text>
            </Alert>

            <VStack spacing={4} align="stretch">
              <Card p={4} borderWidth={1} borderColor="gray.200">
                <Heading size="sm" mb={2}>Produção</Heading>
                <Text fontSize="sm" color="gray.600">
                  Volume produzido: {formData.volumeProduced} sacas | Área: {formData.plantedArea} ha | Tipo: {formData.coffeeType}
                </Text>
              </Card>

              <Card p={4} borderWidth={1} borderColor="gray.200">
                <Heading size="sm" mb={2}>Localização</Heading>
                <Text fontSize="sm" color="gray.600">
                  Estado: {formData.state} | Região: {formData.region} | Coordenadas: {formData.latitude}, {formData.longitude}
                </Text>
              </Card>

              <Card p={4} borderWidth={1} borderColor="gray.200">
                <Heading size="sm" mb={2}>Qualidade</Heading>
                <Text fontSize="sm" color="gray.600">
                  Classificação: {formData.classification} | Processo: {formData.processingMethod}
                </Text>
              </Card>

              <Card p={4} borderWidth={1} borderColor="gray.200">
                <Heading size="sm" mb={2}>Comercialização</Heading>
                <Text fontSize="sm" color="gray.600">
                  Canal: {formData.salesChannel} | Prazo: {formData.paymentTerm}
                </Text>
              </Card>
            </VStack>

            <FormControl>
              <FormLabel>Observações Finais</FormLabel>
              <Textarea
                placeholder="Informações adicionais relevantes sobre sua produção..."
                rows={4}
                value={formData.finalNotes || ''}
                onChange={(e) => handleInputChange('finalNotes', e.target.value)}
              />
            </FormControl>
          </>
        );

      default:
        return null;
    }
  };

  // Load existing data on mount
  useEffect(() => {
    loadExistingData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="brown.500" />
          <Text>Carregando dados do produtor...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      {/* Header */}
      <Container maxW="container.xl" py={4}>
        <VStack align="start" spacing={1} mb={8}>
          <HStack>
            <Icon as={Database} size={28} color="brown.500" />
            <Heading size="lg" color="gray.800">Atualização de Dados da Produção</Heading>
          </HStack>
          <Text color="gray.600">
            Mantenha suas informações atualizadas para melhores análises e recomendações
          </Text>
        </VStack>
      </Container>

      <Container maxW="container.xl" pb={8}>
        {/* Progress Steps */}
        <Box bg="white" p={6} borderRadius="md" mb={8}>
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

        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={8}>
          {/* Main Form */}
          <GridItem>
            <Card bg="white" borderWidth={1} borderColor="gray.200">
              <CardHeader>
                <Heading size="md" color="gray.800">
                  Dados da Produção - Safra 2024/2025
                </Heading>
              </CardHeader>
              <CardBody>
                <Alert status="info" mb={6} borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Estes dados são usados para calcular suas análises personalizadas e não são compartilhados sem sua autorização.
                  </Text>
                </Alert>

                <form onSubmit={handleSubmit}>
                  <VStack spacing={6} align="stretch">
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <Flex pt={6} borderTopWidth={1} borderTopColor="gray.200">
                      <Button
                        variant="ghost"
                        color="gray.600"
                        onClick={handleSaveDraft}
                        isLoading={saving}
                        loadingText="Salvando..."
                      >
                        Salvar Rascunho
                      </Button>
                      <Spacer />
                      <HStack spacing={4}>
                        <Button
                          variant="outline"
                          borderColor="brown.500"
                          color="brown.500"
                          onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
                          isDisabled={activeStep === 0}
                        >
                          Voltar
                        </Button>
                        <Button
                          type="submit"
                          bg="brown.500"
                          color="white"
                          _hover={{ bg: 'brown.600' }}
                          isLoading={saving}
                          loadingText={activeStep === steps.length - 1 ? 'Finalizando...' : 'Salvando...'}
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
              <Card bg="white" borderWidth={1} borderColor="gray.200">
                <CardHeader>
                  <Heading size="md" color="gray.800">
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
                            color={item.complete ? 'green.500' : 'gray.300'}
                          />
                          <Text color="gray.800">{item.label}</Text>
                          <Spacer />
                          {item.complete && (
                            <Badge bg="green.100" color="green.800" fontSize="xs">
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
              <Card bg="white" borderWidth={1} borderColor="gray.200">
                <CardHeader>
                  <Heading size="md" color="gray.800">
                    Precisa de Ajuda?
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    {helpItems.map((item, index) => (
                      <Card
                        key={index}
                        bg="gray.50"
                        borderWidth={1}
                        borderColor="gray.200"
                        p={3}
                        cursor="pointer"
                        _hover={{ bg: 'gray.100' }}
                      >
                        <HStack>
                          <Icon as={item.icon} color="brown.500" />
                          <Text fontSize="sm" color="gray.800">
                            {item.text}
                          </Text>
                        </HStack>
                      </Card>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              {/* Benefits */}
              <Card bg="white" borderWidth={1} borderColor="gray.200">
                <CardHeader>
                  <Heading size="md" color="gray.800">
                    Por que atualizar?
                  </Heading>
                </CardHeader>
                <CardBody>
                  <List spacing={3}>
                    {benefits.map((benefit, index) => (
                      <ListItem key={index}>
                        <HStack>
                          <Icon as={FaCheckCircle} color="green.500" />
                          <Text fontSize="sm" color="gray.800">
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