import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
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
  useToast,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Switch,
} from '@chakra-ui/react';
import { useThemeContext } from '../contexts/ThemeContext';
import { 
  FaUser,
  FaCoffee,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaCalendarAlt,
  FaTractor,
  FaAward,
} from 'react-icons/fa';
import { User } from 'react-feather';

const UserProfile: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const navigate = useNavigate();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Dados Pessoais
    name: 'João Silva Santos',
    email: 'joao.silva@email.com',
    phone: '(35) 99999-8888',
    cpf: '123.456.789-00',
    birthDate: '1975-03-15',
    address: 'Fazenda Santa Rita, Zona Rural',
    city: 'São Sebastião do Paraíso',
    state: 'MG',
    cep: '37950-000',
    
    // Dados da Fazenda
    farmName: 'Fazenda Santa Rita',
    totalArea: 125,
    productiveArea: 98,
    volumeProduced: 3500,
    productivity: 35.7,
    coffeeType: 'Arábica',
    arabicaPercentage: 100,
    robustaPercentage: 0,
    varieties: 'Mundo Novo (60%), Catuaí Vermelho (25%), Bourbon Amarelo (15%)',
    
    // Localização
    region: 'Cerrado Mineiro',
    altitude: 1100,
    cooperative: 'COOXUPÉ - Cooperativa Regional de Cafeicultores',
    
    // Qualidade
    classification: 'Tipo 2',
    drink: 'Estritamente Mole',
    screen: '16/17/18',
    scaScore: 86,
    processing: 'Via Seca (Natural)',
    
    // Comercialização
    mainChannel: 'Cooperativa',
    commission: 0.5,
    paymentTerm: '30 dias',
    
    // Proteção
    hedgeExperience: 'Conhecimento básico',
    protectionPercentage: '20-40%',
    ruralInsurance: 'PROAGRO',
    usesForwardContracts: true,
    usesCPR: true,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values if needed
  };

  const handleSave = () => {
    toast({
      title: 'Perfil atualizado!',
      description: 'Suas informações foram salvas com sucesso',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const headerActions = (
    <HStack spacing={3}>
      {isEditing ? (
        <>
          <Button
            leftIcon={<FaTimes />}
            variant="outline"
            borderColor={currentTheme.colors.status.error}
            color={currentTheme.colors.status.error}
            _hover={{ bg: currentTheme.colors.status.error, color: 'white' }}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            leftIcon={<FaSave />}
            bg={currentTheme.colors.status.success}
            color="white"
            _hover={{ bg: currentTheme.colors.status.success, opacity: 0.8 }}
            onClick={handleSave}
          >
            Salvar
          </Button>
        </>
      ) : (
        <Button
          leftIcon={<FaEdit />}
          bg={currentTheme.colors.primary}
          color="white"
          _hover={{ bg: currentTheme.colors.secondary }}
          onClick={handleEdit}
        >
          Editar Perfil
        </Button>
      )}
    </HStack>
  );

  return (
    <Box bg={currentTheme.colors.background.secondary} minH="100vh">
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais e de produção"
        icon={User}
        actions={headerActions}
      />

      <Container maxW="container.xl" py={4}>
        
        {/* Header com Avatar */}
        <Card borderRadius="16px" bg="white" mb={8}  >
          <CardBody p={4}>
            <Flex direction={{ base: 'column', lg: 'row' }} align={{ base: 'center', lg: 'start' }} gap={4}>
              <VStack spacing={4} align="center">
                <Avatar 
                  size="3xl" 
                  name={formData.name} 
                  bg={currentTheme.colors.primary}
                  border="4px solid"
                  borderColor={currentTheme.colors.primary}
                />
                <Badge 
                  bg={currentTheme.colors.status.success} 
                  color="white" 
                  px={4} 
                  py={2}
                  borderRadius="16px"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  <Icon as={FaAward} mr={2} />
                  Produtor Verificado
                </Badge>
              </VStack>
              
              <Box flex={1}>
                <VStack align="start" spacing={6}>
                  <VStack align="start" spacing={2}>
                    <Heading size="xl" color={currentTheme.colors.text.primary}>
                      {formData.name}
                    </Heading>
                    <Text fontSize="lg" color={currentTheme.colors.text.secondary}>
                      {formData.farmName}
                    </Text>
                    <Text fontSize="md" color={currentTheme.colors.text.secondary}>
                      {formData.city}, {formData.state} • {formData.region}
                    </Text>
                  </VStack>
                  
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                    
<Card borderRadius="16px" bg={currentTheme.colors.background.tertiary} p={4} textAlign="center">
                      <VStack spacing={2}>
                        <Icon as={FaTractor} color={currentTheme.colors.primary} boxSize={6} />
                        <Text fontSize="2xl" fontWeight="bold" color={currentTheme.colors.text.primary}>
                          {formData.totalArea}
                        </Text>
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                          hectares
                        </Text>
                      </VStack>
                    </Card>
                    
                    
<Card borderRadius="16px" bg={currentTheme.colors.background.tertiary} p={4} textAlign="center">
                      <VStack spacing={2}>
                        <Icon as={FaCoffee} color={currentTheme.colors.primary} boxSize={6} />
                        <Text fontSize="2xl" fontWeight="bold" color={currentTheme.colors.text.primary}>
                          {formData.volumeProduced}
                        </Text>
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                          sacas/safra
                        </Text>
                      </VStack>
                    </Card>
                    
                    
<Card borderRadius="16px" bg={currentTheme.colors.background.tertiary} p={4} textAlign="center">
                      <VStack spacing={2}>
                        <Icon as={FaAward} color={currentTheme.colors.primary} boxSize={6} />
                        <Text fontSize="2xl" fontWeight="bold" color={currentTheme.colors.status.success}>
                          {formData.scaScore}
                        </Text>
                        <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                          Score SCA
                        </Text>
                      </VStack>
                    </Card>
                  </SimpleGrid>
                </VStack>
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <VStack spacing={6} align="stretch">
          
          {/* Dados Pessoais */}
          <Card borderRadius="16px" bg="white"  >
            <CardHeader pb={4}>
              <HStack spacing={4}>
                <Icon as={FaUser} color={currentTheme.colors.primary} boxSize={6} />
                <VStack align="start" spacing={0}>
                  <Heading size="md" color={currentTheme.colors.text.primary}>
                    Dados Pessoais
                  </Heading>
                  <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                    Informações de contato e identificação
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                
                <FormControl>
                  <FormLabel>Nome Completo</FormLabel>
                  <Input
                    value={formData.name}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Telefone</FormLabel>
                  <Input
                    type="tel"
                    value={formData.phone}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>CPF</FormLabel>
                  <Input
                    value={formData.cpf}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>CEP</FormLabel>
                  <Input
                    value={formData.cep}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl gridColumn="span 2">
                  <FormLabel>Endereço</FormLabel>
                  <Input
                    value={formData.address}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Cidade</FormLabel>
                  <Input
                    value={formData.city}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    value={formData.state}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  >
                    <option value="MG">Minas Gerais</option>
                    <option value="SP">São Paulo</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="BA">Bahia</option>
                    <option value="PR">Paraná</option>
                    <option value="RO">Rondônia</option>
                  </Select>
                </FormControl>

              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Dados da Fazenda */}
          <Card borderRadius="16px" bg="white"  >
            <CardHeader pb={4}>
              <HStack spacing={4}>
                <Icon as={FaTractor} color={currentTheme.colors.primary} boxSize={6} />
                <VStack align="start" spacing={0}>
                  <Heading size="md" color={currentTheme.colors.text.primary}>
                    Dados de Produção
                  </Heading>
                  <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                    Informações da fazenda e produção
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                
                <FormControl>
                  <FormLabel>Nome da Fazenda</FormLabel>
                  <Input
                    value={formData.farmName}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('farmName', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Região</FormLabel>
                  <Input
                    value={formData.region}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Área Total (hectares)</FormLabel>
                  <NumberInput 
                    value={formData.totalArea}
                    isDisabled={!isEditing}
                    onChange={(value) => handleInputChange('totalArea', Number(value))}
                  >
                    <NumberInputField bg={!isEditing ? 'gray.50' : 'white'} />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Área Produtiva (hectares)</FormLabel>
                  <NumberInput 
                    value={formData.productiveArea}
                    isDisabled={!isEditing}
                    onChange={(value) => handleInputChange('productiveArea', Number(value))}
                  >
                    <NumberInputField bg={!isEditing ? 'gray.50' : 'white'} />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Volume Produzido (sacas)</FormLabel>
                  <NumberInput 
                    value={formData.volumeProduced}
                    isDisabled={!isEditing}
                    onChange={(value) => handleInputChange('volumeProduced', Number(value))}
                  >
                    <NumberInputField bg={!isEditing ? 'gray.50' : 'white'} />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Altitude (metros)</FormLabel>
                  <NumberInput 
                    value={formData.altitude}
                    isDisabled={!isEditing}
                    onChange={(value) => handleInputChange('altitude', Number(value))}
                  >
                    <NumberInputField bg={!isEditing ? 'gray.50' : 'white'} />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Tipo de Café</FormLabel>
                  <Select
                    value={formData.coffeeType}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('coffeeType', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  >
                    <option value="Arábica">Arábica (100%)</option>
                    <option value="Robusta">Robusta (100%)</option>
                    <option value="Misto">Misto (Arábica + Robusta)</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Cooperativa</FormLabel>
                  <Input
                    value={formData.cooperative}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('cooperative', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl gridColumn="span 2">
                  <FormLabel>Variedades Cultivadas</FormLabel>
                  <Textarea
                    value={formData.varieties}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('varieties', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                    rows={3}
                  />
                </FormControl>

              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Qualidade */}
          <Card borderRadius="16px" bg="white"  >
            <CardHeader pb={4}>
              <HStack spacing={4}>
                <Icon as={FaAward} color={currentTheme.colors.primary} boxSize={6} />
                <VStack align="start" spacing={0}>
                  <Heading size="md" color={currentTheme.colors.text.primary}>
                    Qualidade e Classificação
                  </Heading>
                  <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                    Parâmetros de qualidade do café
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                
                <FormControl>
                  <FormLabel>Classificação</FormLabel>
                  <Select
                    value={formData.classification}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('classification', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  >
                    <option value="Tipo 2">Tipo 2</option>
                    <option value="Tipo 3">Tipo 3</option>
                    <option value="Tipo 4">Tipo 4</option>
                    <option value="Tipo 5">Tipo 5</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Bebida</FormLabel>
                  <Select
                    value={formData.drink}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('drink', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  >
                    <option value="Estritamente Mole">Estritamente Mole</option>
                    <option value="Mole">Mole</option>
                    <option value="Apenas Mole">Apenas Mole</option>
                    <option value="Dura">Dura</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Peneira</FormLabel>
                  <Input
                    value={formData.screen}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('screen', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Score SCA</FormLabel>
                  <NumberInput 
                    value={formData.scaScore}
                    min={0}
                    max={100}
                    isDisabled={!isEditing}
                    onChange={(value) => handleInputChange('scaScore', Number(value))}
                  >
                    <NumberInputField bg={!isEditing ? 'gray.50' : 'white'} />
                  </NumberInput>
                </FormControl>

                <FormControl gridColumn="span 2">
                  <FormLabel>Processo de Beneficiamento</FormLabel>
                  <Select
                    value={formData.processing}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('processing', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  >
                    <option value="Via Seca (Natural)">Via Seca (Natural)</option>
                    <option value="Via Úmida (Lavado)">Via Úmida (Lavado)</option>
                    <option value="Cereja Descascado">Cereja Descascado</option>
                    <option value="Semi-Lavado">Semi-Lavado</option>
                  </Select>
                </FormControl>

              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Comercialização */}
          <Card borderRadius="16px" bg="white"  >
            <CardHeader pb={4}>
              <HStack spacing={4}>
                <Icon as={FaCoffee} color={currentTheme.colors.primary} boxSize={6} />
                <VStack align="start" spacing={0}>
                  <Heading size="md" color={currentTheme.colors.text.primary}>
                    Comercialização
                  </Heading>
                  <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
                    Canais de venda e estratégias comerciais
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                
                <FormControl>
                  <FormLabel>Canal Principal</FormLabel>
                  <Select
                    value={formData.mainChannel}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('mainChannel', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  >
                    <option value="Cooperativa">Cooperativa</option>
                    <option value="Corretor">Corretor</option>
                    <option value="Venda Direta">Venda Direta</option>
                    <option value="Exportação">Exportação</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Comissão (%)</FormLabel>
                  <NumberInput 
                    value={formData.commission}
                    min={0}
                    max={10}
                    step={0.1}
                    isDisabled={!isEditing}
                    onChange={(value) => handleInputChange('commission', Number(value))}
                  >
                    <NumberInputField bg={!isEditing ? 'gray.50' : 'white'} />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Prazo de Pagamento</FormLabel>
                  <Select
                    value={formData.paymentTerm}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('paymentTerm', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  >
                    <option value="À vista">À vista</option>
                    <option value="15 dias">15 dias</option>
                    <option value="30 dias">30 dias</option>
                    <option value="45 dias">45 dias</option>
                    <option value="60 dias">60 dias</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Experiência com Hedge</FormLabel>
                  <Select
                    value={formData.hedgeExperience}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('hedgeExperience', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  >
                    <option value="Nenhuma">Nenhuma</option>
                    <option value="Conhecimento básico">Conhecimento básico</option>
                    <option value="Experiência intermediária">Experiência intermediária</option>
                    <option value="Experiência avançada">Experiência avançada</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Proteção da Safra</FormLabel>
                  <Select
                    value={formData.protectionPercentage}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('protectionPercentage', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  >
                    <option value="0%">Não faço proteção</option>
                    <option value="10-20%">10-20% da safra</option>
                    <option value="20-40%">20-40% da safra</option>
                    <option value="40-60%">40-60% da safra</option>
                    <option value="60-80%">60-80% da safra</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Seguro Rural</FormLabel>
                  <Select
                    value={formData.ruralInsurance}
                    isDisabled={!isEditing}
                    onChange={(e) => handleInputChange('ruralInsurance', e.target.value)}
                    bg={!isEditing ? 'gray.50' : 'white'}
                  >
                    <option value="PROAGRO">PROAGRO</option>
                    <option value="Seguro Privado">Seguro Privado</option>
                    <option value="Ambos">PROAGRO + Seguro Privado</option>
                    <option value="Nenhum">Não tenho seguro</option>
                  </Select>
                </FormControl>

              </SimpleGrid>
              
              <Divider my={6} />
              
              <VStack spacing={4} align="start">
                <Text fontSize="sm" fontWeight="bold" color={currentTheme.colors.text.primary}>
                  Instrumentos de Proteção Utilizados
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="forward-contracts" mb="0" fontSize="sm">
                      Contratos a Termo
                    </FormLabel>
                    <Switch
                      id="forward-contracts"
                      isChecked={formData.usesForwardContracts}
                      isDisabled={!isEditing}
                      onChange={(e) => handleInputChange('usesForwardContracts', e.target.checked)}
                      colorScheme="green"
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="cpr" mb="0" fontSize="sm">
                      CPR (Cédula de Produto Rural)
                    </FormLabel>
                    <Switch
                      id="cpr"
                      isChecked={formData.usesCPR}
                      isDisabled={!isEditing}
                      onChange={(e) => handleInputChange('usesCPR', e.target.checked)}
                      colorScheme="green"
                    />
                  </FormControl>
                </SimpleGrid>
              </VStack>
              
            </CardBody>
          </Card>

        </VStack>
      </Container>
    </Box>
  );
};

export default UserProfile;