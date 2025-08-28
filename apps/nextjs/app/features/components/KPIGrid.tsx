import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';

interface KPIGridProps {
  children: React.ReactNode;
}

/**
 * KPIGrid component arranges KPICard components in a responsive grid layout.
 * It adapts the number of columns based on screen size.
 */
export const KPIGrid: React.FC<KPIGridProps> = ({ children }) => {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} aria-label="KPI grid container">
      {children}
    </SimpleGrid>
  );
};