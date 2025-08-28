import React from 'react';
import { 
  Card, 
  CardBody, 
  Text, 
  HStack, 
  Tooltip, 
  Skeleton, 
  SkeletonText,
  VStack,
  
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

export interface KpiCardProps {
  id: string;
  title: string;
  value: string;
  variation: string;
  variationType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ size?: string; color?: string }>;
  isLoading?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  variation, 
  variationType, 
  icon: Icon, 
  isLoading = false, 
  onClick, 
  tooltip 
}) => {
  const colorScheme = {
    positive: 'green',
    negative: 'red', 
    neutral: 'gray'
  }[variationType];

  if (isLoading) {
    return <SkeletonKpiCard />;
  }

  return (
    <Card 
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      _hover={onClick ? { transform: 'translateY(-2px)', shadow: 'lg' } : {}}
      transition="all 0.2s"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={onClick ? `Ver detalhes de ${title}` : undefined}
    >
      <CardBody>
        <HStack justify="space-between" mb={2}>
          <Icon size="24px" color={`${colorScheme}.500`} />
          {tooltip && (
            <Tooltip label={tooltip} hasArrow placement="top">
              <InfoIcon color="gray.400" cursor="help" />
            </Tooltip>
          )}
        </HStack>
        
        <VStack align="flex-start" spacing={1}>
          <Text 
            fontSize="sm" 
            color="gray.600" 
            mb={1}
            fontWeight="medium"
          >
            {title}
          </Text>
          
          <Text 
            fontSize="2xl" 
            fontWeight="bold" 
            color="gray.800"
            lineHeight="1.2"
          >
            {value}
          </Text>
          
          <Text 
            fontSize="sm" 
            color={`${colorScheme}.500`}
            fontWeight="medium"
          >
            {variation}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

const SkeletonKpiCard: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <HStack justify="space-between" mb={2}>
          <Skeleton height="24px" width="24px" borderRadius="md" />
          <Skeleton height="16px" width="16px" borderRadius="full" />
        </HStack>
        
        <VStack align="flex-start" spacing={1}>
          <SkeletonText noOfLines={1} spacing="4" width="60%" />
          <Skeleton height="32px" width="80%" />
          <SkeletonText noOfLines={1} spacing="4" width="40%" />
        </VStack>
      </CardBody>
    </Card>
  );
};

export default KpiCard;