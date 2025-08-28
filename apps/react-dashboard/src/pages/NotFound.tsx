import React from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme } = useThemeContext();

  return (
    <Box
      textAlign="center"
      py={4}
      bg={currentTheme.colors.background.secondary}
      minH="100vh"
    >
      <VStack spacing={4}>
        <Heading as="h1" size="2xl" color={currentTheme.colors.primary}>
          404
        </Heading>
        <Text fontSize="xl" color={currentTheme.colors.text.primary}>
          Página não encontrada
        </Text>
        <Text color={currentTheme.colors.text.secondary}>
          A página que você está procurando não existe.
        </Text>
        <Button
          bg={currentTheme.colors.primary}
          color={currentTheme.colors.text.inverse}
          onClick={() => navigate('/')}
          mt={4}
          _hover={{ bg: currentTheme.colors.secondary }}
        >
          Voltar ao Início
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFound;