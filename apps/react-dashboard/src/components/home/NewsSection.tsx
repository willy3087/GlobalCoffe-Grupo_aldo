import React from 'react';
import {
  Box,
  Container,
  VStack,
  SimpleGrid,
  Heading,
  Text,
  HStack,
  Flex,
  Avatar,
  IconButton,
  Button,
  Card,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronRight } from 'react-feather';
import ImageWithFallback from '../common/ImageWithFallback';
import StatusTag, { getTagCategory } from '../common/StatusTag';
import StatusPill from '../common/StatusPill';

interface NewsItem {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  date: string;
  relevance: string;
  author: string;
  readTime: string;
}

interface NewsSectionProps {
  newsItems: NewsItem[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ newsItems }) => {
  const textColor = useColorModeValue('gray.700', 'gray.200');


  return (
    <Box py={4}>
      <Container maxW="container.xl">
        <VStack spacing={12}>
          <Flex justify="space-between" align="center" w="full">
            <VStack align="start" spacing={2}>
              <StatusPill variant="info" size="md">
                ATUALIZAÇÕES
              </StatusPill>
              <Heading size="xl">Últimas Notícias do Setor</Heading>
            </VStack>
            <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
              <StatusTag category="default" size="md" cursor="pointer">
                Todas
              </StatusTag>
              <StatusTag category="market" size="md" cursor="pointer">
                Mercado
              </StatusTag>
              <StatusTag category="climate" size="md" cursor="pointer">
                Clima
              </StatusTag>
              <StatusTag category="technology" size="md" cursor="pointer">
                Tecnologia
              </StatusTag>
            </HStack>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="full">
            {newsItems.map((item) => (
              <Card
                key={item.id}
                variant="elevated"
                overflow="hidden"
                cursor="pointer"
                transition="all 0.3s"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  h="200px"
                  w="full"
                  objectFit="cover"
                />
                <CardBody p={6}>
                  <VStack align="start" spacing={3}>
                    <HStack justify="space-between" w="full">
                      <StatusTag category={getTagCategory(item.category)} size="sm">
                        {item.category}
                      </StatusTag>
                      {item.relevance === 'alta' && (
                        <StatusPill variant="high" size="sm">
                          Alta relevância
                        </StatusPill>
                      )}
                    </HStack>
                    <Heading size="md" noOfLines={2}>
                      {item.title}
                    </Heading>
                    <Text color={textColor} fontSize="sm" noOfLines={3}>
                      {item.description}
                    </Text>
                    <HStack justify="space-between" w="full" pt={2}>
                      <HStack spacing={3}>
                        <Avatar size="xs" name={item.author} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="xs" fontWeight="semibold">
                            {item.author}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {item.date} · {item.readTime}
                          </Text>
                        </VStack>
                      </HStack>
                      <IconButton
                        aria-label="Ler mais"
                        icon={<ChevronRight size={16} />}
                        size="sm"
                        variant="ghost"
                        color="coffee.600"
                      />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <Button
            size="lg"
            variant="outline"
            borderColor="coffee.500"
            color="coffee.600"
            _hover={{ bg: 'coffee.50' }}
            rightIcon={<ChevronRight size={20} />}
          >
            Ver Todas as Notícias
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default NewsSection;