import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';
import BackgroundImageWithFallback from '../common/BackgroundImageWithFallback';

const CTASection: React.FC = () => {
  return (
    <Box
      py={20}
      bg="coffee.600"
      bgGradient="linear(to-r, coffee.600, coffee.800)"
      color="white"
      position="relative"
      overflow="hidden"
    >
      <BackgroundImageWithFallback
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.1"
        imageUrl="https://images.unsplash.com/photo-1559056199-641a0a45b0d3?q=80&w=2940"
        fallbackColor="coffee.800"
      />
      <Container maxW="container.lg" position="relative" zIndex="1">
        <VStack spacing={8} textAlign="center">
          <Heading size="2xl">
            Comece a transformar sua produção hoje
          </Heading>
          <Text fontSize="xl" maxW="600px">
            Junte-se a milhares de produtores que já utilizam nossa plataforma 
            para aumentar sua produtividade e rentabilidade
          </Text>
          <HStack spacing={4}>
            <Button
              size="lg"
              bg="cream.300"
              color="coffee.700"
              _hover={{ bg: 'cream.200' }}
              px={8}
              h={14}
              fontSize="md"
              fontWeight="bold"
            >
              Iniciar Teste Grátis
            </Button>
            <Button
              size="lg"
              variant="outline"
              borderColor="cream.300"
              color="cream.300"
              _hover={{ bg: 'whiteAlpha.200' }}
              px={8}
              h={14}
              fontSize="md"
            >
              Falar com Especialista
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default CTASection;