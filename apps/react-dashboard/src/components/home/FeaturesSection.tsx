import React from 'react';
import {
  Box,
  Container,
  VStack,
  SimpleGrid,
  Heading,
  Text,
  Badge,
  Flex,
  Card,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  stats: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  navigate: (path: string) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features, navigate }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box py={4} bg={bgColor}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Badge bg="coffee.100" color="coffee.800" px={3} py={1} borderRadius="16px">
              RECURSOS
            </Badge>
            <Heading size="xl">
              Tudo que você precisa em um só lugar
            </Heading>
            <Text color={textColor} fontSize="lg" maxW="600px">
              Ferramentas poderosas para maximizar sua produtividade e rentabilidade
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} w="full">
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="elevated"
                cursor="pointer"
                transition="all 0.3s"
                _hover={{ transform: 'translateY(-8px)', boxShadow: '2xl' }}
                onClick={() => navigate('/dashboard')}
              >
                <CardBody p={8}>
                  <VStack align="start" spacing={4}>
                    <Flex
                      w={12}
                      h={12}
                      bg={`${feature.color}.100`}
                      color={`${feature.color}.600`}
                      borderRadius="16px"
                      align="center"
                      justify="center"
                    >
                      <feature.icon size={24} />
                    </Flex>
                    <VStack align="start" spacing={2}>
                      <Heading size="md">{feature.title}</Heading>
                      <Text color={textColor} fontSize="sm">
                        {feature.description}
                      </Text>
                    </VStack>
                    <Badge bg={`${feature.color}.100`} color={`${feature.color}.800`} variant="subtle">
                      {feature.stats}
                    </Badge>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default FeaturesSection;