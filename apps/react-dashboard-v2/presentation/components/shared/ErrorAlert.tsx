import React from 'react';
import { 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription, 
  Box,
  Button,
  VStack,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { RefreshCw } from 'react-feather';

export interface ErrorAlertProps {
  error: Error;
  onRetry?: () => void;
  title?: string;
  showRetryButton?: boolean;
  variant?: 'subtle' | 'solid' | 'left-accent' | 'top-accent';
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  error, 
  onRetry,
  title = 'Erro ao carregar dados',
  showRetryButton = true,
  variant = 'left-accent'
}) => {
  const bgColor = useColorModeValue('red.50', 'red.900');
  const borderColor = useColorModeValue('red.200', 'red.700');

  const getErrorMessage = (error: Error): string => {
    // Mensagens de erro mais amigáveis
    if (error.message.includes('Network')) {
      return 'Problema de conexão. Verifique sua internet e tente novamente.';
    }
    
    if (error.message.includes('timeout')) {
      return 'Tempo limite esgotado. O servidor pode estar sobrecarregado.';
    }
    
    if (error.message.includes('404')) {
      return 'Dados não encontrados. Pode ser um problema temporário.';
    }
    
    if (error.message.includes('500')) {
      return 'Erro interno do servidor. Nossa equipe foi notificada.';
    }

    // Fallback para mensagem genérica mas útil
    return error.message || 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.';
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onRetry) {
      e.preventDefault();
      handleRetry();
    }
  };

  return (
    <Alert 
      status="error" 
      variant={variant}
      bg={bgColor}
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <AlertIcon />
      
      <Box flex="1">
        <VStack align="flex-start" spacing={2}>
          <AlertTitle fontSize="md" fontWeight="semibold">
            {title}
          </AlertTitle>
          
          <AlertDescription 
            fontSize="sm" 
            color="gray.700" 
            lineHeight="1.5"
          >
            {getErrorMessage(error)}
          </AlertDescription>
          
          {showRetryButton && onRetry && (
            <HStack spacing={2} mt={2}>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                leftIcon={<RefreshCw size={16} />}
                onClick={handleRetry}
                onKeyDown={handleKeyDown}
                aria-label="Tentar novamente"
              >
                Tentar Novamente
              </Button>
            </HStack>
          )}
        </VStack>
      </Box>
    </Alert>
  );
};

export default ErrorAlert;