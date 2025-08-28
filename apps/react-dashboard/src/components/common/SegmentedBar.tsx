import React from 'react';
import { Box, Flex, Text, VStack } from '@chakra-ui/react';

export interface SegmentData {
  name: string;
  value: number;
  gradient: string;
  dotColor: string;
  completed?: boolean; // Para mostrar tracejado quando false
}

interface SegmentedBarProps {
  data: SegmentData[];
  height?: string;
  showDots?: boolean;
  showLabels?: boolean;
  showTracked?: boolean; // Para mostrar fundo tracejado
  variant?: 'default' | 'impact'; // 'impact' para Fatores de Impacto com padding tracejado
}

const SegmentedBar: React.FC<SegmentedBarProps> = ({
  data,
  height = "60px",
  showDots = true,
  showLabels = true,
  showTracked = true,
  variant = 'default'
}) => {
  // Para variant 'impact' - mantém o comportamento original com padding tracejado
  if (variant === 'impact') {
    return (
      <VStack spacing={4} w="full" align="center">
        <Box position="relative" w="full">
          {/* Fundo tracejado (para Fatores de Impacto) */}
          {showTracked && (
            <Box
              position="absolute"
              top="-8px"
              left="-8px"
              right="-8px"
              bottom="-8px"
              borderRadius="16px"
              bgImage="repeating-linear-gradient(
                45deg,
                transparent,
                transparent 4px,
                rgba(203, 213, 224, 0.3) 4px,
                rgba(203, 213, 224, 0.3) 8px
              )"
              zIndex={0}
            />
          )}
          
          <Flex h={height} w="full" borderRadius="16px" overflow="hidden" bg="transparent" position="relative" zIndex={1}>
            {data.map((segment, index) => (
              <Box
                key={index}
                flex={segment.value}
                bgGradient={segment.completed !== false ? segment.gradient : 'none'}
                bg={segment.completed === false ? 'transparent' : undefined}
                bgImage={segment.completed === false ? 
                  "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(203, 213, 224, 0.6) 3px, rgba(203, 213, 224, 0.6) 6px)" 
                  : undefined
                }
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s"
                borderRadius="16px"
                boxShadow="sm"
                mx={index > 0 && index < data.length - 1 ? "1px" : "0"}
                ml={index === 0 ? "0" : "1px"}
                mr={index === data.length - 1 ? "0" : "1px"}
                _hover={{ 
                  transform: 'translateY(-2px)', 
                  zIndex: 2,
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                }}
              >
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  {segment.value}%
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
        {/* Resto do componente para variant impact */}
        {showDots && (
          <Flex w="full" px={4}>
            {data.map((segment, index) => (
              <VStack key={index} spacing={1} align="center" flex={segment.value}>
                <Box w="8px" h="8px" borderRadius="16px" bg={segment.dotColor} />
                <Box w="1px" h="20px" bg={segment.dotColor} opacity={0.3} />
              </VStack>
            ))}
          </Flex>
        )}
        {showLabels && (
          <Flex w="full">
            {data.map((segment, index) => (
              <VStack key={index} spacing={2} align="center" flex={segment.value}>
                <Box w="12px" h="12px" borderRadius="16px" bg={segment.dotColor} />
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  {segment.name}
                </Text>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  {segment.value}% do total
                </Text>
              </VStack>
            ))}
          </Flex>
        )}
      </VStack>
    );
  }

  // Para variant 'default' - tracejado apenas na porção restante
  return (
    <VStack spacing={4} w="full" align="center">
      <Box position="relative" w="full">
        <Flex h={height} w="full" borderRadius="16px" overflow="hidden" bg="gray.50" border="1px solid" borderColor="gray.200" position="relative">
          {data.map((segment, index) => (
            <Box
              key={index}
              flex={segment.value}
              bgGradient={segment.completed !== false ? segment.gradient : 'none'}
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="all 0.2s"
              borderRadius="16px"
              boxShadow="sm"
              sx={segment.completed === false ? {
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(203, 213, 224, 0.6) 4px, rgba(203, 213, 224, 0.6) 8px)",
                backgroundColor: "#f8fafc"
              } : {}}
              _hover={{ 
                transform: 'translateY(-2px)', 
                zIndex: 2,
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
              }}
            >
              {segment.completed !== false && (
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  {segment.value}%
                </Text>
              )}
            </Box>
          ))}
        </Flex>
      </Box>
      
      {/* Pontinhos indicadores para variant default */}
      {showDots && (
        <Flex w="full" px={4}>
          {data.filter(segment => segment.completed !== false).map((segment, index) => (
            <VStack key={index} spacing={1} align="center" flex={segment.value}>
              <Box w="8px" h="8px" borderRadius="16px" bg={segment.dotColor} />
              <Box w="1px" h="20px" bg={segment.dotColor} opacity={0.3} />
            </VStack>
          ))}
        </Flex>
      )}

      {/* Legendas para variant default */}
      {showLabels && (
        <Flex w="full">
          {data.filter(segment => segment.completed !== false).map((segment, index) => (
            <VStack key={index} spacing={2} align="center" flex={segment.value}>
              <Box w="12px" h="12px" borderRadius="16px" bg={segment.dotColor} />
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                {segment.name}
              </Text>
              <Text fontSize="xs" color="gray.500" textAlign="center">
                {segment.value}% do total
              </Text>
            </VStack>
          ))}
        </Flex>
      )}
    </VStack>
  );
};

export default SegmentedBar;