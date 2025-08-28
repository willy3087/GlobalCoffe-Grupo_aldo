/**
 * Custom Hooks for Design Tokens
 * 
 * Hooks customizados para acessar tokens de design de forma consistente
 * e type-safe em toda a aplicação GlobalCoffee.
 */

import { useTheme } from '@chakra-ui/react';
import { tokens, getToken } from './tokens';

// ============================================================================
// HOOK PRINCIPAL - useTokens
// ============================================================================

/**
 * Hook principal para acessar todos os tokens de design
 * @returns Objeto com todos os tokens organizados por categoria
 */
export const useTokens = () => {
  const theme = useTheme();
  
  return {
    // Design tokens centralizados
    ...tokens,
    
    // Funções helper
    get: (path: string) => getToken(path, tokens),
    
    // Acesso direto ao tema do Chakra UI
    theme,
    
    // Tokens específicos mais usados
    spacing: tokens.spacing,
    colors: tokens.colors,
    typography: tokens.typography,
    sizes: tokens.sizes,
    borderRadius: tokens.borderRadius,
    shadows: tokens.shadows,
    transitions: tokens.transitions,
  };
};

// ============================================================================
// HOOKS ESPECÍFICOS POR CATEGORIA
// ============================================================================

/**
 * Hook para acessar cores semânticas com suporte a modo claro/escuro
 * @returns Objeto com cores adaptadas ao tema atual
 */
const useSemanticColors = () => {
  const theme = useTheme();
  const isDark = theme.colorMode === 'dark';
  
  const getSemanticColor = (lightColor: string, darkColor?: string) => {
    return isDark && darkColor ? darkColor : lightColor;
  };
  
  return {
    // Background colors
    bg: {
      primary: getSemanticColor(tokens.colors.semantic.bg.primary, tokens.colors.semantic.bg.inverse),
      secondary: getSemanticColor(tokens.colors.semantic.bg.secondary, '#2D3748'),
      tertiary: getSemanticColor(tokens.colors.semantic.bg.tertiary, '#4A5568'),
    },
    
    // Text colors
    text: {
      primary: getSemanticColor(tokens.colors.semantic.text.primary, tokens.colors.semantic.text.inverse),
      secondary: getSemanticColor(tokens.colors.semantic.text.secondary, '#A0AEC0'),
      tertiary: getSemanticColor(tokens.colors.semantic.text.tertiary, '#CBD5E0'),
      muted: getSemanticColor(tokens.colors.semantic.text.muted, '#718096'),
    },
    
    // Border colors
    border: {
      primary: getSemanticColor(tokens.colors.semantic.border.primary, '#4A5568'),
      secondary: getSemanticColor(tokens.colors.semantic.border.secondary, '#2D3748'),
      focus: tokens.colors.semantic.border.focus,
      error: tokens.colors.semantic.border.error,
    },
    
    // Status colors (sempre consistentes)
    status: tokens.colors.semantic.status,
    
    // Brand colors (sempre consistentes)
    brand: tokens.colors.brand,
  };
};

/**
 * Hook para acessar tokens de espaçamento
 * @returns Objeto com espaçamentos e funções helper
 */
const useSpacing = () => {
  const getSpacing = (key: keyof typeof tokens.spacing) => {
    return tokens.spacing[key];
  };
  
  const getMultiple = (base: keyof typeof tokens.spacing, multiplier: number) => {
    const baseValue = tokens.spacing[base];
    if (typeof baseValue === 'string' && baseValue.endsWith('rem')) {
      const numValue = parseFloat(baseValue);
      return `${numValue * multiplier}rem`;
    }
    return baseValue;
  };
  
  return {
    ...tokens.spacing,
    get: getSpacing,
    multiply: getMultiple,
    
    // Shortcuts para espaçamentos comuns
    cardPadding: tokens.spacing.component.card,
    sectionGap: tokens.spacing.layout.section,
    contentGap: tokens.spacing.content.gap,
    inputPadding: tokens.spacing.component.input,
    buttonPadding: tokens.spacing.component.button,
  };
};

/**
 * Hook específico para cores relacionadas ao trading
 * @returns Objeto com cores para indicadores financeiros
 */
const useTradingColors = () => {
  const getValueColor = (value: number) => {
    if (value > 0) return tokens.colors.trading.positive;
    if (value < 0) return tokens.colors.trading.negative;
    return tokens.colors.trading.neutral;
  };
  
  const getMarketColor = (marketType: 'internal' | 'external' | 'futures' | 'spot') => {
    return tokens.colors.trading.market[marketType];
  };
  
  const getChannelColor = (channel: 'cooperative' | 'broker' | 'direct' | 'export') => {
    return tokens.colors.trading.channel[channel];
  };
  
  const getProtectionColor = (instrument: 'hedge' | 'insurance' | 'futures') => {
    return tokens.colors.trading.protection[instrument];
  };
  
  return {
    // Cores base do trading
    ...tokens.colors.trading,
    
    // Funções helper
    getValueColor,
    getMarketColor,
    getChannelColor,
    getProtectionColor,
    
    // Shortcuts para valores comuns
    positive: tokens.colors.trading.positive,
    negative: tokens.colors.trading.negative,
    neutral: tokens.colors.trading.neutral,
  };
};

/**
 * Hook para acessar tokens de tipografia
 * @returns Objeto com configurações tipográficas
 */
const useTypography = () => {
  const getFontSize = (size: keyof typeof tokens.typography.fontSizes) => {
    return tokens.typography.fontSizes[size];
  };
  
  const getFontWeight = (weight: keyof typeof tokens.typography.fontWeights) => {
    return tokens.typography.fontWeights[weight];
  };
  
  const getLineHeight = (height: keyof typeof tokens.typography.lineHeights) => {
    return tokens.typography.lineHeights[height];
  };
  
  return {
    ...tokens.typography,
    getFontSize,
    getFontWeight,
    getLineHeight,
    
    // Combinações comuns
    heading: {
      fontFamily: tokens.typography.fonts.heading,
      fontSize: tokens.typography.fontSizes.heading,
      fontWeight: tokens.typography.fontWeights.medium,
      lineHeight: tokens.typography.lineHeights.heading,
    },
    
    body: {
      fontFamily: tokens.typography.fonts.body,
      fontSize: tokens.typography.fontSizes.body,
      fontWeight: tokens.typography.fontWeights.normal,
      lineHeight: tokens.typography.lineHeights.body,
    },
    
    caption: {
      fontFamily: tokens.typography.fonts.body,
      fontSize: tokens.typography.fontSizes.caption,
      fontWeight: tokens.typography.fontWeights.normal,
      lineHeight: tokens.typography.lineHeights.caption,
    },
  };
};

/**
 * Hook para acessar tokens de tamanho
 * @returns Objeto com tamanhos de componentes
 */
const useSizes = () => {
  const getComponentSize = (component: keyof typeof tokens.sizes, size: string) => {
    const componentSizes = tokens.sizes[component];
    if (typeof componentSizes === 'object' && componentSizes !== null) {
      return (componentSizes as any)[size];
    }
    return undefined;
  };
  
  return {
    ...tokens.sizes,
    getComponentSize,
    
    // Shortcuts para componentes comuns
    buttonSizes: tokens.sizes.button,
    iconSizes: tokens.sizes.icon,
    containerSizes: tokens.sizes.container,
    modalSizes: tokens.sizes.modal,
  };
};

/**
 * Hook para acessar tokens de sombra
 * @returns Objeto com sombras e funções helper
 */
const useShadows = () => {
  const getInteractiveShadow = (state: 'rest' | 'hover' | 'active') => {
    switch (state) {
      case 'hover':
        return tokens.shadows.cardHover;
      case 'active':
        return tokens.shadows.sm;
      default:
        return tokens.shadows.card;
    }
  };
  
  return {
    ...tokens.shadows,
    getInteractiveShadow,
    
    // Shortcuts
    cardShadow: tokens.shadows.card,
    cardHoverShadow: tokens.shadows.cardHover,
    modalShadow: tokens.shadows.modal,
    buttonShadow: tokens.shadows.button,
    buttonHoverShadow: tokens.shadows.buttonHover,
  };
};

/**
 * Hook para acessar tokens de transição
 * @returns Objeto com transições predefinidas
 */
const useTransitions = () => {
  const getTransition = (property: string, duration?: keyof typeof tokens.transitions.duration) => {
    const dur = duration ? tokens.transitions.duration[duration] : tokens.transitions.duration.normal;
    return `${property} ${dur} ${tokens.transitions.easing.smooth}`;
  };
  
  return {
    ...tokens.transitions,
    getTransition,
    
    // Transições comuns
    all: tokens.transitions.common.all,
    colors: tokens.transitions.common.colors,
    transform: tokens.transitions.common.transform,
    opacity: tokens.transitions.common.opacity,
    shadow: tokens.transitions.common.shadow,
  };
};

/**
 * Hook para acessar tokens semânticos específicos do coffee trading
 * @returns Objeto com tokens específicos do domínio
 */
const useCoffeeTokens = () => {
  const getQualityColor = (quality: 'premium' | 'standard' | 'basic') => {
    return tokens.semantic.coffee.quality[quality];
  };
  
  const getMarketIndicatorColor = (indicator: 'bullish' | 'bearish' | 'sideways') => {
    return tokens.semantic.coffee.market[indicator];
  };
  
  const getPriceColor = (movement: 'up' | 'down' | 'unchanged') => {
    return tokens.semantic.coffee.price[movement];
  };
  
  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    return tokens.semantic.coffee.risk[level];
  };
  
  return {
    ...tokens.semantic.coffee,
    getQualityColor,
    getMarketIndicatorColor,
    getPriceColor,
    getRiskColor,
    
    // Layout tokens
    layout: tokens.semantic.layout,
    
    // Interactive states
    interactive: tokens.semantic.interactive,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export all hooks
export {
  useTokens as default,
  useSemanticColors,
  useSpacing,
  useTradingColors,
  useTypography,
  useSizes,
  useShadows,
  useTransitions,
  useCoffeeTokens,
};

// Export types for TypeScript support
export type {
  SpacingToken,
  ColorToken,
  TypographyToken,
  SizeToken,
  BorderRadiusToken,
  ShadowToken,
  TransitionToken,
  ZIndexToken,
  BreakpointToken,
  VariantToken,
  SemanticToken,
} from './tokens';