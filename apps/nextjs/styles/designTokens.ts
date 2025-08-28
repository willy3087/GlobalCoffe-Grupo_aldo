/**
 * Design Tokens v0.2 for GlobalCoffee
 * Cores, tipografia, espaçamentos, bordas, sombras e transições
 * Segue padrões WCAG AAA para acessibilidade
 */

const colors = {
  primary: '#005f73',       // Azul escuro
  primaryLight: '#0a9396',  // Azul claro
  primaryDark: '#001219',   // Azul muito escuro
  secondary: '#94d2bd',     // Verde claro
  secondaryDark: '#52796f', // Verde escuro
  background: '#ffffff',    // Branco
  surface: '#f0f0f0',       // Cinza claro
  textPrimary: '#000000',   // Preto
  textSecondary: '#4a4a4a', // Cinza escuro
  error: '#d00000',         // Vermelho forte
  success: '#007f5f',       // Verde sucesso
  warning: '#f77f00',       // Laranja alerta
};

const typography = {
  fontFamilyBase: "'Inter', sans-serif",
  fontSizeBase: '16px',
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  lineHeightBase: 1.5,
  headings: {
    h1: '2.5rem', // 40px
    h2: '2rem',   // 32px
    h3: '1.75rem',// 28px
    h4: '1.5rem', // 24px
    h5: '1.25rem',// 20px
    h6: '1rem',   // 16px
  },
};

const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

const borders = {
  radiusSmall: '4px',
  radiusMedium: '8px',
  radiusLarge: '16px',
  widthThin: '1px',
  widthThick: '2px',
  color: colors.primaryDark,
};

const shadows = {
  level1: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  level2: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  level3: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
};

const transitions = {
  default: 'all 0.3s ease-in-out',
  fast: 'all 0.15s ease-in-out',
  slow: 'all 0.5s ease-in-out',
};

const designTokens = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  transitions,
};

export default designTokens;