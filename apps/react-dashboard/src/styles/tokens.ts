/**
 * Design Tokens - Sistema centralizado de tokens de design
 * 
 * Este arquivo contém todos os tokens de design utilizados na aplicação
 * GlobalCoffee, organizados por categorias para facilitar a manutenção
 * e garantir consistência visual.
 */

// Função helper para acessar tokens aninhados
export const getToken = (path: string, tokens: any): any => {
  return path.split('.').reduce((obj, key) => obj?.[key], tokens);
};

// ============================================================================
// SPACING TOKENS
// ============================================================================
export const spacing = {
  // Micro spacing
  none: '0',
  px: '1px',
  xs: '0.25rem',    // 4px - espaçamento mínimo
  sm: '0.5rem',     // 8px - espaçamento pequeno
  md: '1rem',       // 16px - espaçamento médio (base)
  lg: '1.5rem',     // 24px - espaçamento grande
  xl: '2rem',       // 32px - espaçamento extra grande
  '2xl': '3rem',    // 48px - espaçamento muito grande
  '3xl': '4rem',    // 64px - espaçamento máximo
  
  // Semantic spacing
  content: {
    padding: '1.5rem',      // Padding interno de conteúdo
    gap: '1rem',            // Gap entre elementos de conteúdo
  },
  
  layout: {
    section: '3rem',        // Entre seções principais
    container: '2rem',      // Padding do container
    sidebar: '1.5rem',      // Largura/padding do sidebar
  },
  
  component: {
    card: '1.5rem',         // Padding interno de cards
    button: '1rem',         // Padding de botões
    input: '0.75rem',       // Padding de inputs
    modal: '2rem',          // Padding de modais
  },
  
  // Trading specific
  trading: {
    kpiGap: '1.5rem',       // Gap entre KPIs
    chartMargin: '1rem',    // Margem de gráficos
    tableCell: '0.75rem',   // Padding de células de tabela
  }
} as const;

// ============================================================================
// COLOR TOKENS
// ============================================================================
export const colors = {
  // Brand colors - cores da marca
  brand: {
    primary: '#8B4513',     // Coffee brown
    secondary: '#800020',   // Burgundy
    accent: '#FFF8DC',      // Cream
    neutral: '#2D2318',     // Dark brown
  },
  
  // Semantic colors - cores com significado
  semantic: {
    // Backgrounds
    bg: {
      primary: '#FFFFFF',
      secondary: '#F7FAFC',
      tertiary: '#EDF2F7',
      inverse: '#1A202C',
      overlay: 'rgba(0, 0, 0, 0.6)',
    },
    
    // Text colors
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      tertiary: '#718096',
      inverse: '#FFFFFF',
      muted: '#A0AEC0',
    },
    
    // Border colors
    border: {
      primary: '#E2E8F0',
      secondary: '#CBD5E0',
      focus: '#3182CE',
      error: '#E53E3E',
    },
    
    // Status colors
    status: {
      success: '#38A169',
      warning: '#D69E2E',
      error: '#E53E3E',
      info: '#3182CE',
      
      // Light variants
      successLight: '#F0FFF4',
      warningLight: '#FFFAF0',
      errorLight: '#FED7D7',
      infoLight: '#EBF8FF',
    },
  },
  
  // Trading colors - cores específicas para trading
  trading: {
    // Financial indicators
    positive: '#38A169',      // Green for gains/up
    negative: '#E53E3E',      // Red for losses/down
    neutral: '#718096',       // Gray for stable/unchanged
    
    // Market contexts
    market: {
      internal: '#38A169',    // Mercado interno
      external: '#3182CE',    // Mercado externo
      futures: '#805AD5',     // Mercado futuro
      spot: '#DD6B20',        // Mercado à vista
    },
    
    // Sales channels
    channel: {
      cooperative: '#38A169', // Cooperativa
      broker: '#DD6B20',      // Corretor
      direct: '#3182CE',      // Venda direta
      export: '#805AD5',      // Exportação
    },
    
    // Protection instruments
    protection: {
      hedge: '#805AD5',       // Hedge
      insurance: '#3182CE',   // Seguro
      futures: '#DD6B20',     // Contratos futuros
    },
  },
  
  // Chart colors - cores para gráficos
  chart: {
    primary: ['#8B4513', '#800020', '#3182CE', '#38A169', '#DD6B20'],
    secondary: ['#E2E8F0', '#CBD5E0', '#A0AEC0', '#718096', '#4A5568'],
    gradient: {
      primary: 'linear-gradient(135deg, #8B4513 0%, #800020 100%)',
      success: 'linear-gradient(135deg, #38A169 0%, #68D391 100%)',
      warning: 'linear-gradient(135deg, #D69E2E 0%, #F6E05E 100%)',
    },
  },
} as const;

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================
export const typography = {
  // Font families
  fonts: {
    heading: `'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    body: `'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    mono: `SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  },
  
  // Font sizes
  fontSizes: {
    '2xs': '0.625rem',   // 10px
    xs: '0.75rem',       // 12px
    sm: '0.875rem',      // 14px
    md: '1rem',          // 16px - base
    lg: '1.125rem',      // 18px
    xl: '1.25rem',       // 20px
    '2xl': '1.5rem',     // 24px
    '3xl': '1.875rem',   // 30px
    '4xl': '2.25rem',    // 36px
    '5xl': '3rem',       // 48px
    
    // Semantic sizes
    caption: '0.75rem',     // Para legendas
    body: '1rem',           // Para texto corpo
    heading: '1.25rem',     // Para títulos
    display: '2.25rem',     // Para títulos grandes
  },
  
  // Font weights
  fontWeights: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  // Line heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
    
    // Semantic line heights
    heading: 1.2,
    body: 1.6,
    caption: 1.4,
  },
  
  // Letter spacing
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// SIZE TOKENS
// ============================================================================
export const sizes = {
  // Component sizes
  button: {
    sm: '2rem',      // 32px
    md: '2.5rem',    // 40px
    lg: '3rem',      // 48px
    xl: '3.5rem',    // 56px
  },
  
  input: {
    sm: '2rem',      // 32px
    md: '2.5rem',    // 40px
    lg: '3rem',      // 48px
  },
  
  icon: {
    xs: '0.75rem',   // 12px
    sm: '1rem',      // 16px
    md: '1.25rem',   // 20px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '2.5rem', // 40px
  },
  
  avatar: {
    xs: '1.5rem',    // 24px
    sm: '2rem',      // 32px
    md: '3rem',      // 48px
    lg: '4rem',      // 64px
    xl: '6rem',      // 96px
  },
  
  // Container sizes
  container: {
    xs: '20rem',     // 320px
    sm: '24rem',     // 384px
    md: '28rem',     // 448px
    lg: '32rem',     // 512px
    xl: '36rem',     // 576px
    '2xl': '42rem',  // 672px
    '3xl': '48rem',  // 768px
    '4xl': '56rem',  // 896px
    '5xl': '64rem',  // 1024px
    '6xl': '72rem',  // 1152px
    '7xl': '80rem',  // 1280px
    full: '100%',
    screen: '100vw',
  },
  
  // Modal sizes
  modal: {
    xs: '20rem',     // 320px
    sm: '24rem',     // 384px
    md: '32rem',     // 512px
    lg: '48rem',     // 768px
    xl: '64rem',     // 1024px
    full: '100vw',
  },
  
  // Chart sizes
  chart: {
    sm: '12rem',     // 192px
    md: '16rem',     // 256px
    lg: '20rem',     // 320px
    xl: '24rem',     // 384px
    '2xl': '32rem',  // 512px
  },
  
  // Trading specific sizes
  trading: {
    kpiCard: '12rem',     // 192px - largura de cards KPI
    priceDisplay: '8rem', // 128px - largura de displays de preço
    tableRow: '3rem',     // 48px - altura de linhas de tabela
  },
} as const;

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================
export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  md: '0.25rem',     // 4px
  lg: '0.375rem',    // 6px
  xl: '0.5rem',      // 8px
  '2xl': '0.75rem',  // 12px
  '3xl': '1rem',     // 16px
  full: '9999px',
  
  // Semantic radius
  button: '0.375rem',   // Para botões
  input: '0.375rem',    // Para inputs
  card: '0.75rem',      // Para cards
  modal: '1rem',        // Para modais
  badge: '9999px',      // Para badges (circular)
  avatar: '9999px',     // Para avatares (circular)
} as const;

// ============================================================================
// SHADOW TOKENS
// ============================================================================
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Semantic shadows
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  cardHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  button: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  buttonHover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  
  // Trading specific shadows
  trading: {
    kpi: '0 2px 4px rgba(0, 0, 0, 0.1)',
    chart: '0 4px 8px rgba(0, 0, 0, 0.1)',
    table: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
} as const;

// ============================================================================
// TRANSITION TOKENS
// ============================================================================
export const transitions = {
  // Duration
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  // Easing
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
    
    // Custom easing
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Common transitions
  common: {
    all: 'all 200ms ease',
    colors: 'color 200ms ease, background-color 200ms ease, border-color 200ms ease',
    transform: 'transform 200ms ease',
    opacity: 'opacity 200ms ease',
    shadow: 'box-shadow 200ms ease',
  },
  
  // Component specific
  button: 'all 150ms ease',
  card: 'all 200ms ease',
  modal: 'all 300ms ease',
  tooltip: 'all 150ms ease',
} as const;

// ============================================================================
// Z-INDEX TOKENS
// ============================================================================
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ============================================================================
// BREAKPOINT TOKENS
// ============================================================================
export const breakpoints = {
  sm: '30em',      // 480px
  md: '48em',      // 768px
  lg: '62em',      // 992px
  xl: '80em',      // 1280px
  '2xl': '96em',   // 1536px
  
  // Trading specific breakpoints
  mobile: '30em',     // 480px - mobile devices
  tablet: '48em',     // 768px - tablets
  desktop: '62em',    // 992px - desktop
  wide: '80em',       // 1280px - wide screens
} as const;

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================
export const variants = {
  // Button variants
  button: {
    solid: 'solid',
    outline: 'outline',
    ghost: 'ghost',
    link: 'link',
    
    // Brand variants
    coffee: 'coffee',
    burgundy: 'burgundy',
    
    // Trading variants
    buy: 'buy',
    sell: 'sell',
    neutral: 'neutral',
  },
  
  // Badge variants
  badge: {
    solid: 'solid',
    subtle: 'subtle',
    outline: 'outline',
    
    // Status variants
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
    
    // Trading variants
    positive: 'positive',
    negative: 'negative',
    neutral: 'neutral',
  },
} as const;

// ============================================================================
// SEMANTIC TOKENS - Tokens com significado específico do domínio
// ============================================================================
export const semantic = {
  // Coffee trading specific tokens
  coffee: {
    // Quality indicators
    quality: {
      premium: colors.semantic.status.success,
      standard: colors.semantic.status.info,
      basic: colors.semantic.status.warning,
    },
    
    // Market indicators
    market: {
      bullish: colors.trading.positive,
      bearish: colors.trading.negative,
      sideways: colors.trading.neutral,
    },
    
    // Price movements
    price: {
      up: colors.trading.positive,
      down: colors.trading.negative,
      unchanged: colors.trading.neutral,
    },
    
    // Risk levels
    risk: {
      low: colors.semantic.status.success,
      medium: colors.semantic.status.warning,
      high: colors.semantic.status.error,
    },
  },
  
  // Layout semantic tokens
  layout: {
    maxWidth: sizes.container['7xl'],
    contentPadding: spacing.layout.container,
    sectionGap: spacing.layout.section,
    componentGap: spacing.content.gap,
  },
  
  // Interactive states
  interactive: {
    hover: {
      transform: 'translateY(-2px)',
      shadow: shadows.cardHover,
      transition: transitions.common.all,
    },
    
    focus: {
      outline: `2px solid ${colors.semantic.border.focus}`,
      outlineOffset: '2px',
    },
    
    active: {
      transform: 'translateY(0)',
      shadow: shadows.sm,
    },
  },
} as const;

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================
export const tokens = {
  spacing,
  colors,
  typography,
  sizes,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  variants,
  semantic,
} as const;

// Type definitions for better TypeScript support
export type SpacingToken = keyof typeof spacing;
export type ColorToken = keyof typeof colors;
export type TypographyToken = keyof typeof typography;
export type SizeToken = keyof typeof sizes;
export type BorderRadiusToken = keyof typeof borderRadius;
export type ShadowToken = keyof typeof shadows;
export type TransitionToken = keyof typeof transitions;
export type ZIndexToken = keyof typeof zIndex;
export type BreakpointToken = keyof typeof breakpoints;
export type VariantToken = keyof typeof variants;
export type SemanticToken = keyof typeof semantic;

// Default export
export default tokens;