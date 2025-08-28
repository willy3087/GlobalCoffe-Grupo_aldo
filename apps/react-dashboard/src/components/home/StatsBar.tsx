import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

interface StatItem {
  label: string;
  value: string;
  subValue: string;
  change: number;
  trend: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface StatsBarProps {
  stats: StatItem[];
}

const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box bg={bgColor} py={4} borderBottom="1px" borderColor={borderColor} boxShadow="sm">
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {stats.map((stat, index) => (
            <Stat
              key={index}
              p={6}
              bg={useColorModeValue('cream.50', 'gray.700')}
              borderRadius="16px"
              borderWidth="1px"
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
            >
              <StatLabel color={textColor} fontSize="sm" fontWeight="medium">
                <HStack spacing={2}>
                  <stat.icon color={`${stat.color}.500`} size={20} />
                  <Text>{stat.label}</Text>
                </HStack>
              </StatLabel>
              <StatNumber fontSize="2xl" fontWeight="bold" color={`${stat.color}.600`}>
                {stat.value}
                <Text as="span" fontSize="sm" fontWeight="normal" color={textColor} ml={1}>
                  {stat.subValue}
                </Text>
              </StatNumber>
              <StatHelpText>
                {stat.change !== 0 && (
                  <StatArrow type={stat.trend === 'increase' ? 'increase' : 'decrease'} />
                )}
                {stat.change !== 0 ? `${Math.abs(stat.change)}%` : 'Estável'}
              </StatHelpText>
            </Stat>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default StatsBar;