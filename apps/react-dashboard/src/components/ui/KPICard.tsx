import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  HStack,
  VStack,
  Text,
  Progress,
  Badge,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import StatusPill, { PillVariant } from '../common/StatusPill';

export interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ComponentType<any>;
  iconColor?: string;
  subtitle?: string;
  progress?: number;
  progressMax?: number;
  status?: PillVariant;
  statusText?: string;
  variant?: 'default' | 'compact' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  colorScheme?: string;
  loading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit = '',
  change,
  changeType = 'neutral',
  icon: IconComponent,
  iconColor = 'blue.500',
  subtitle,
  progress,
  progressMax = 100,
  status,
  statusText,
  variant = 'default',
  size = 'md',
  colorScheme = 'blue',
  loading = false,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: 3, titleSize: 'sm', valueSize: 'lg' };
      case 'lg': 
        return { padding: 6, titleSize: 'md', valueSize: '2xl' };
      default:
        return { padding: 4, titleSize: 'sm', valueSize: 'xl' };
    }
  };

  const { padding, titleSize, valueSize } = getSizeStyles();

  if (loading) {
    return (
      <Card borderRadius="16px" bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardBody p={padding}>
          <VStack align="stretch" spacing={3}>
            <Text fontSize={titleSize} color="gray.400">Carregando...</Text>
            <Progress isIndeterminate size="sm" colorScheme={colorScheme} />
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const renderCompactVariant = () => (
    <Card borderRadius="16px" bg={bgColor} borderColor={borderColor} borderWidth="1px">
      <CardBody p={padding}>
        <HStack spacing={3}>
          {IconComponent && (
            <Icon as={IconComponent} color={iconColor} boxSize={5} />
          )}
          <VStack align="start" spacing={1} flex={1}>
            <Text fontSize="xs" color="gray.500" fontWeight="medium">
              {title}
            </Text>
            <HStack spacing={2} align="baseline">
              <Text fontSize={valueSize} fontWeight="bold" color={`${colorScheme}.600`}>
                {value}
              </Text>
              {unit && (
                <Text fontSize="sm" color="gray.500">
                  {unit}
                </Text>
              )}
            </HStack>
          </VStack>
          {change !== undefined && (
            <VStack spacing={0} align="end">
              <Stat>
                <StatHelpText mb={0}>
                  <StatArrow type={changeType === 'increase' ? 'increase' : 'decrease'} />
                  <Text as="span" fontSize="sm" fontWeight="medium" 
                        color={changeType === 'increase' ? 'green.500' : 'red.500'}>
                    {Math.abs(change)}%
                  </Text>
                </StatHelpText>
              </Stat>
            </VStack>
          )}
        </HStack>
      </CardBody>
    </Card>
  );

  const renderDetailedVariant = () => (
    <Card borderRadius="16px" bg={bgColor} borderColor={borderColor} borderWidth="1px">
      <CardHeader pb={2}>
        <HStack justify="space-between">
          <HStack spacing={2}>
            {IconComponent && (
              <Icon as={IconComponent} color={iconColor} boxSize={5} />
            )}
            <Text fontSize={titleSize} fontWeight="medium" color="gray.600">
              {title}
            </Text>
          </HStack>
          {status && statusText && (
            <StatusPill variant={status} size="sm">
              {statusText}
            </StatusPill>
          )}
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <VStack align="stretch" spacing={3}>
          <Stat>
            <StatNumber fontSize={valueSize} fontWeight="bold" color={`${colorScheme}.600`}>
              {value}
              {unit && (
                <Text as="span" fontSize="sm" fontWeight="normal" color="gray.500" ml={1}>
                  {unit}
                </Text>
              )}
            </StatNumber>
            {change !== undefined && (
              <StatHelpText mb={0}>
                <StatArrow type={changeType === 'increase' ? 'increase' : 'decrease'} />
                {Math.abs(change)}% {changeType === 'increase' ? 'aumento' : 'redução'}
              </StatHelpText>
            )}
          </Stat>
          
          {subtitle && (
            <Text fontSize="sm" color="gray.500">
              {subtitle}
            </Text>
          )}
          
          {progress !== undefined && (
            <VStack align="stretch" spacing={1}>
              <HStack justify="space-between">
                <Text fontSize="xs" color="gray.500">Progresso</Text>
                <Text fontSize="xs" color="gray.500">{progress}/{progressMax}</Text>
              </HStack>
              <Progress value={progress} max={progressMax} colorScheme={colorScheme} size="sm" />
            </VStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );

  const renderDefaultVariant = () => (
    <Card borderRadius="16px" bg={bgColor} borderColor={borderColor} borderWidth="1px">
      <CardBody p={padding}>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between" align="start">
            <HStack spacing={2}>
              {IconComponent && (
                <Icon as={IconComponent} color={iconColor} boxSize={5} />
              )}
              <Text fontSize={titleSize} fontWeight="medium" color="gray.600">
                {title}
              </Text>
            </HStack>
            {status && statusText && (
              <StatusPill variant={status} size="sm">
                {statusText}
              </StatusPill>
            )}
          </HStack>

          <Stat>
            <StatNumber fontSize={valueSize} fontWeight="bold" color={`${colorScheme}.600`}>
              {value}
              {unit && (
                <Text as="span" fontSize="sm" fontWeight="normal" color="gray.500" ml={1}>
                  {unit}
                </Text>
              )}
            </StatNumber>
            {change !== undefined && (
              <StatHelpText>
                <StatArrow type={changeType === 'increase' ? 'increase' : 'decrease'} />
                {Math.abs(change)}%
              </StatHelpText>
            )}
          </Stat>

          {subtitle && (
            <Text fontSize="sm" color="gray.500">
              {subtitle}
            </Text>
          )}

          {progress !== undefined && (
            <Progress value={progress} max={progressMax} colorScheme={colorScheme} size="sm" />
          )}
        </VStack>
      </CardBody>
    </Card>
  );

  switch (variant) {
    case 'compact':
      return renderCompactVariant();
    case 'detailed':
      return renderDetailedVariant();
    default:
      return renderDefaultVariant();
  }
};

export default KPICard;