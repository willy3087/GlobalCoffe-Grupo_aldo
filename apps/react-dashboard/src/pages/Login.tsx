import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Text,
  Link,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';

const Login: React.FC = () => {
  const { currentTheme } = useThemeContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  // Removido uso do contexto de autenticação

  // Removido o uso do contexto de autenticação para manter validação hardcoded simples no front

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação hardcoded simples, sem autenticação real
    setTimeout(() => {
      if (email === 'teste@teste.com.br' && password === 'teste@teste') {
        toast({
          title: 'Login realizado com sucesso!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Simula login setando flag localStorage para controle simples
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/');
      } else {
        toast({
          title: 'Erro no login',
          description: 'Email ou senha incorretos.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box maxW="400px" mx="auto" py={10}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2} color={currentTheme.colors.text.primary}>
            Entrar no GlobalCoffee
          </Heading>
          <Text color={currentTheme.colors.text.secondary}>
            Acesse sua conta para gerenciar sua produção
          </Text>
        </Box>

        <Box
          w="full"
          p={8}
          
          borderRadius="16px"
          boxShadow="sm"
          bg={currentTheme.colors.background.primary}
          
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                bg={currentTheme.colors.primary}
                color="white"
                _hover={{ bg: currentTheme.colors.secondary }}
                w="full"
                isLoading={isLoading}
                loadingText="Entrando..."
              >
                Entrar
              </Button>
            </VStack>
          </form>

          <VStack spacing={3} mt={6}>
            <Link color={currentTheme.colors.primary} fontSize="sm">
              Esqueceu sua senha?
            </Link>
            <Text fontSize="sm" color={currentTheme.colors.text.secondary}>
              Não tem uma conta?{' '}
              <Link color={currentTheme.colors.primary}>
                Cadastre-se
              </Link>
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Login;