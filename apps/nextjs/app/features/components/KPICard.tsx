import React from 'react';
import { Box, Flex, Text, useColorModeValue, Icon, VisuallyHidden } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface KPICardProps {
  icon: IconType;
  title: string;
  value: string | number;
  variation: number; // positivo ou negativo para indicar variação
  variationLabel?: string; // texto para acessibilidade da variação
}

/**
 * KPICard component displays a KPI with an icon, title, value and variation.
 * It shows visual indication for positive or negative variation.
 * Supports focus, hover states and ARIA accessibility.
 */
export const KPICard: React.FC<KPICardProps> = ({ icon, title, value, variation, variationLabel }) => {
  const IconComponent = icon;
  const isPositive = variation >= 0;
  const variationColor = isPositive ? 'green.500' : 'red.500';
  const bg = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      role="group"
      tabIndex={0}
      bg={bg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      _hover={{ bg: hoverBg, boxShadow: 'md' }}
      _focus={{ boxShadow: 'outline' }}
      aria-label={`${title} KPI card`}
    >
      <Flex align="center" mb={2}>
        <Icon as={IconComponent} boxSize={6} mr={2} aria-hidden="true" />
        <Text fontWeight="medium" fontSize="sm">
          {title}
        </Text>
      </Flex>
      <Text fontSize="2xl" fontWeight="bold" mb={1}>
        {value}
      </Text>
      <Flex align="center" color={variationColor} aria-live="polite">
        <Text fontSize="sm" fontWeight="semibold" mr={1}>
          {isPositive ? '+' : ''}
          {variation}%
        </Text>
        {variationLabel && <VisuallyHidden>{variationLabel}</VisuallyHidden>}
      </Flex>
    </Box>
  );
};