import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Search, ChevronRight, Globe, Shield, Coffee } from 'react-feather';
import coffeeFarmSunset from '../../assets/coffee-farm-sunset.png';
import coffeeFarmerSunrise from '../../assets/coffee-farmer-sunrise.png';
import { useThemeContext } from '../../contexts/ThemeContext';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  navigate: (path: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  navigate,
}) => {
  const heroHeight = '400px';
  const headingSize = useBreakpointValue({ base: '2xl', md: '4xl', lg: '5xl' });
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [
    coffeeFarmSunset,
    coffeeFarmerSunrise
  ];
  
  // Usa o contexto de tema para obter currentTheme
  const { currentTheme } = useThemeContext();

  // Alterna as imagens a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <Box position="relative" h={heroHeight} overflow="hidden" bg="coffee.900" w="100%">
      {/* Background Image with Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundImage={`url(${heroImages[currentImageIndex]})`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        transition="all 1s ease-in-out"
        _after={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Hero Content */}
      <Container maxW="container.xl" h="full" position="relative" zIndex="1">
        <Flex h="full" align="center" justify="center">
          <VStack spacing={5} textAlign="center" maxW="900px">

            {/* Main Title */}
            <Heading
              size={headingSize}
              color="white"
              fontWeight="bold"
              lineHeight="shorter"
              textShadow="2xl"
            >
              Sistema Inteligente para{' '}
              <Text as="span" color="cream.300">
                Produtores de Café
              </Text>
            </Heading>

            {/* Subtitle */}
            <Text
              fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
              color="cream.100"
              maxW="600px"
              textShadow="lg"
              fontWeight="medium"
            >
              Monitore o clima, analise mercados e otimize sua produção 
              com tecnologia de ponta e dados em tempo real
            </Text>

            {/* Search Bar */}
            <Box w="full" maxW="600px">
              <InputGroup size="lg" boxShadow="2xl">
                <InputLeftElement pointerEvents="none">
                  <Search color="gray.400" size={24} />
                </InputLeftElement>
                <Input
                  placeholder="Buscar região, indicadores ou alertas..."
                  bg="white"
                  color="gray.800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  borderRadius="16px"
                  pl={12}
                  h={14}
                  fontSize="md"
                  _placeholder={{ color: 'gray.500' }}
                  _hover={{ boxShadow: '2xl' }}
                  _focus={{ boxShadow: '2xl', borderColor: 'coffee.500' }}
                />
              </InputGroup>
            </Box>

            {/* CTA Buttons */}
            <HStack spacing={4}>
              <Button
                size="lg"
                bg={`${currentTheme.colors.primary}`}
                color="white"
                _hover={{ bg: currentTheme.colors.secondaryLight, transform: 'translateY(-2px)', boxShadow: '2xl' }}
                rightIcon={<ChevronRight size={20} />}
                onClick={() => navigate('/dashboard')}
                px={8}
                h={12}
                fontSize="md"
                fontWeight="bold"
                boxShadow="xl"
                transition="all 0.3s"
              >
                Acessar Dashboard
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="cream.300"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() => navigate('/features')}
                px={8}
                h={12}
                fontSize="md"
              >
                Conhecer Recursos
              </Button>
            </HStack>

            {/* Trust Indicators */}
            <HStack spacing={8}>
              <HStack>
                <Globe color="cream.300" size={20} />
                <Text color="cream.100" fontSize="sm">
                  10.000+ Produtores
                </Text>
              </HStack>
              <HStack>
                <Shield color="cream.300" size={20} />
                <Text color="cream.100" fontSize="sm">
                  Dados Seguros
                </Text>
              </HStack>
              <HStack>
                <Coffee color="cream.300" size={20} />
                <Text color="cream.100" fontSize="sm">
                  100% Nacional
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default HeroSection;