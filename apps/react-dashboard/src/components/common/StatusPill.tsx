import React from 'react';
import { Badge, BadgeProps } from '@chakra-ui/react';
// import { useThemeContext } from '../../contexts/ThemeContext'; // Unused for now

// Pills são para indicadores de status/prioridade/relevância
// Características: formato arredondado, fundo suave, borda sutil

export type PillVariant = 'high' | 'medium' | 'low' | 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'positive' | 'negative';
export type PillSize = 'sm' | 'md';
export type PillStyle = 'default' | 'solid' | 'subtle';

interface StatusPillProps extends Omit<BadgeProps, 'variant' | 'size'> {
  variant: PillVariant;
  size?: PillSize;
  pillStyle?: PillStyle;
  children: React.ReactNode;
}

const StatusPill: React.FC<StatusPillProps> = ({
  variant,
  size = 'sm',
  pillStyle = 'default',
  children,
  ...props
}) => {
  // const { currentTheme } = useThemeContext(); // Unused for now

  // Cores fixas para indicadores semânticos
  // Não mudam com o tema, apenas ajustam a intensidade
  const getVariantStyles = () => {
    const baseStyles = {
      borderRadius: "24px",
      borderWidth: pillStyle === 'subtle' ? '0' : '1px',
      fontWeight: '500',
      textTransform: 'none' as const,
      letterSpacing: 'normal',
    };

    const sizeStyles = size === 'md'
      ? { px: 3, py: 1, fontSize: 'sm' }
      : { px: 2.5, py: 0.5, fontSize: 'xs' };

    // Mapeamento de variantes para nomes de cor do tema Chakra
    const colorMap: Record<PillVariant, { color: string; bg: string; border?: string }> = {
      high:      { color: 'white', bg: 'green.500', border: 'green.500' },
      medium:    { color: 'white', bg: 'orange.400', border: 'orange.400' },
      low:       { color: 'white', bg: 'red.400', border: 'red.400' },
      neutral:   { color: 'gray.800', bg: 'gray.200', border: 'gray.300' },
      success:   { color: 'white', bg: 'green.500', border: 'green.500' },
      warning:   { color: 'white', bg: 'orange.400', border: 'orange.400' },
      error:     { color: 'white', bg: 'red.400', border: 'red.400' },
      info:      { color: 'white', bg: 'blue.400', border: 'blue.400' },
      positive:  { color: 'white', bg: 'green.500', border: 'green.500' },
      negative:  { color: 'white', bg: 'red.400', border: 'red.400' },
    };
    const subtleMap: Record<PillVariant, { color: string; bg: string }> = {
      high:      { color: 'green.700', bg: 'green.50' },
      medium:    { color: 'orange.700', bg: 'orange.50' },
      low:       { color: 'red.700', bg: 'red.50' },
      neutral:   { color: 'gray.700', bg: 'gray.50' },
      success:   { color: 'green.700', bg: 'green.50' },
      warning:   { color: 'orange.700', bg: 'orange.50' },
      error:     { color: 'red.700', bg: 'red.50' },
      info:      { color: 'blue.700', bg: 'blue.50' },
      positive:  { color: 'green.700', bg: 'green.50' },
      negative:  { color: 'red.700', bg: 'red.50' },
    };

    if (pillStyle === 'solid') {
      const c = colorMap[variant] || colorMap.neutral;
      return {
        ...baseStyles,
        ...sizeStyles,
        bg: c.bg,
        color: c.color,
        borderColor: c.border,
      };
    } else if (pillStyle === 'subtle') {
      const c = subtleMap[variant] || subtleMap.neutral;
      return {
        ...baseStyles,
        ...sizeStyles,
        bg: c.bg,
        color: c.color,
        borderWidth: '0',
      };
    } else {
      // default style: borda leve, fundo claro
      const c = subtleMap[variant] || subtleMap.neutral;
      return {
        ...baseStyles,
        ...sizeStyles,
        bg: c.bg,
        color: c.color,
        borderColor: 'gray.200',
      };
    }
  };

  return (
    <Badge
      {...getVariantStyles()}
      display="inline-block"
      w="fit-content"
      {...props}
    >
      {children}
    </Badge>
  );
};

// Helper function para mapear valores de prioridade para variants
export const getPillVariant = (priority: string): PillVariant => {
  const normalizedPriority = priority.toLowerCase();
  
  if (normalizedPriority === 'alta' || normalizedPriority === 'high') return 'high';
  if (normalizedPriority === 'média' || normalizedPriority === 'media' || normalizedPriority === 'medium') return 'medium';
  if (normalizedPriority === 'baixa' || normalizedPriority === 'low') return 'low';
  
  return 'neutral';
};

// Helper function para mapear relevância (percentual) para variants
export const getPillVariantByRelevance = (relevance: number): PillVariant => {
  if (relevance >= 70) return 'high';
  if (relevance >= 40) return 'medium';
  return 'low';
};

// Helper function para mapear valores percentuais (ex: volatilidade)
export const getPillVariantByPercentage = (value: number, inverse: boolean = false): PillVariant => {
  if (inverse) {
    // Para métricas onde menor é melhor
    if (value <= 30) return 'success';
    if (value <= 60) return 'warning';
    return 'error';
  } else {
    // Para métricas onde maior é melhor
    if (value >= 70) return 'success';
    if (value >= 40) return 'warning';
    return 'error';
  }
};

// Helper function para status de análise/qualidade
export const getPillVariantByScore = (score: number): PillVariant => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  if (score >= 40) return 'error';
  return 'neutral';
};

// Helper function para variações de valor (positivo/negativo)
export const getPillVariantByChange = (change: number): PillVariant => {
  if (change > 0) return 'positive';
  if (change < 0) return 'negative';
  return 'neutral';
};

export default StatusPill;