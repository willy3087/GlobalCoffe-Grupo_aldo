import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    // Cores principais do sistema café
    coffee: {
      50: '#faf5f0',
      100: '#f0e4d7',
      200: '#e3d0bd',
      300: '#d4b5a0',
      400: '#c19575',
      500: '#8B4513', // Saddle Brown - cor principal
      600: '#6b3410',
      700: '#5a2c0d',
      800: '#4a240b',
      900: '#3a1c08',
    },
    burgundy: {
      50: '#fdf2f4',
      100: '#fce4e9',
      200: '#fac7d3',
      300: '#f69fb0',
      400: '#ef6b84',
      500: '#800020', // Burgundy - cor secundária
      600: '#6b001a',
      700: '#5a0016',
      800: '#4a0012',
      900: '#3f0010',
    },
    darkBrown: {
      50: '#faf8f5',
      100: '#f4f0e8',
      200: '#e8dcc8',
      300: '#d4c2a0',
      400: '#b8956b',
      500: '#8b6f47',
      600: '#6b5435',
      700: '#4a3b26',
      800: '#3d2f1e',
      900: '#2d2318',
    },
    cream: {
      50: '#fffef7',
      100: '#fffce8',
      200: '#fff8d1',
      300: '#FFF8DC', // Cornsilk - cor de fundo
      400: '#ffed99',
      500: '#ffe066',
      600: '#ffd633',
      700: '#ffcc00',
      800: '#e6b800',
      900: '#cca300',
    },
    
    // Semantic colors - tokens semânticos para uso específico
    semantic: {
      // Backgrounds
      bg: {
        primary: 'white',           // Fundo principal dos cards
        secondary: 'gray.50',       // Fundo secundário (sub-cards)
        page: 'gray.50',           // Fundo da página
        surface: 'white',          // Superfícies elevadas
        elevated: 'white',         // Cards elevados
      },
      
      // Borders
      border: {
        primary: 'gray.200',       // Bordas principais
        secondary: 'gray.100',     // Bordas secundárias
        subtle: 'gray.50',         // Bordas sutis
        focus: 'blue.500',         // Bordas de foco
      },
      
      // Text colors
      text: {
        primary: 'gray.800',       // Texto principal
        secondary: 'gray.600',     // Texto secundário
        muted: 'gray.500',         // Texto esmaecido
        inverse: 'white',          // Texto em fundos escuros
        heading: 'gray.900',       // Títulos
      },
      
      // Status colors
      status: {
        success: 'green.500',      // Sucesso
        warning: 'orange.500',     // Aviso
        error: 'red.500',          // Erro
        info: 'blue.500',          // Informação
        
        // Variações de intensidade
        successLight: 'green.100',
        warningLight: 'orange.100',
        errorLight: 'red.100',
        infoLight: 'blue.100',
        
        successBg: 'green.50',
        warningBg: 'orange.50',
        errorBg: 'red.50',
        infoBg: 'blue.50',
      },
      
      // Trading/Financial colors
      trading: {
        positive: 'green.500',     // Valores positivos/alta
        negative: 'red.500',       // Valores negativos/baixa
        neutral: 'gray.500',       // Valores neutros/estável
        
        positiveLight: 'green.100',
        negativeLight: 'red.100',
        neutralLight: 'gray.100',
        
        positiveBg: 'green.50',
        negativeBg: 'red.50',
        neutralBg: 'gray.50',
      },
      
      // Market colors (para diferentes mercados)
      market: {
        internal: 'green.500',     // Mercado interno
        external: 'blue.500',      // Mercado externo
        futures: 'purple.500',     // Futuros
        spot: 'orange.500',        // Spot
      },
      
      // Channel colors (para canais de venda)
      channel: {
        cooperative: 'green.500',  // Cooperativa
        broker: 'orange.500',      // Corretor
        direct: 'blue.500',        // Direto
      },
    },
  },
  
  // Spacing tokens - espaçamentos padronizados
  space: {
    // Micro spacing
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    
    // Component spacing
    8: '2rem',        // 32px - padding interno de cards
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    16: '4rem',       // 64px - espaçamento entre seções
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    32: '8rem',       // 128px
    
    // Layout spacing
    container: '8rem', // Espaçamento do container
    section: '6rem',   // Entre seções principais
    card: '2rem',      // Padding interno de cards
    element: '1rem',   // Entre elementos
  },
  
  // Size tokens - tamanhos padronizados
  sizes: {
    // Container sizes
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    
    // Component sizes
    component: {
      xs: '1rem',      // 16px
      sm: '1.5rem',    // 24px
      md: '2rem',      // 32px
      lg: '3rem',      // 48px
      xl: '4rem',      // 64px
      '2xl': '6rem',   // 96px
    },
    
    // Icon sizes
    icon: {
      xs: '0.75rem',   // 12px
      sm: '1rem',      // 16px
      md: '1.25rem',   // 20px
      lg: '1.5rem',    // 24px
      xl: '2rem',      // 32px
    },
    
    // Avatar sizes
    avatar: {
      xs: '1.5rem',    // 24px
      sm: '2rem',      // 32px
      md: '3rem',      // 48px
      lg: '4rem',      // 64px
      xl: '6rem',      // 96px
    },
  },
  
  // Border radius tokens
  radii: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
    
    // Semantic radius
    card: '0.75rem',     // Para cards
    button: '0.375rem',  // Para botões
    input: '0.375rem',   // Para inputs
    badge: '9999px',     // Para badges
  },
  
  // Shadow tokens
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    
    // Semantic shadows
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cardHover: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  fonts: {
    heading: `'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    body: `'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    mono: `SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  },
  
  // Typography tokens
  fontSizes: {
    '2xs': '0.625rem',  // 10px - textos muito pequenos
    xs: '0.6875rem',    // 11px - labels pequenos
    sm: '0.75rem',      // 12px - texto secundário
    md: '0.875rem',     // 14px - texto base
    lg: '0.9375rem',    // 15px - texto destaque
    xl: '1rem',         // 16px - texto principal
    '2xl': '1.125rem',  // 18px - subtítulos
    '3xl': '1.25rem',   // 20px - títulos pequenos
    '4xl': '1.5rem',    // 24px - títulos médios
    '5xl': '2rem',      // 32px - títulos grandes
    '6xl': '2.5rem',    // 40px - títulos principais
  },
  
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
  
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
    
    // Semantic line heights
    heading: 1.2,
    body: 1.5,
    caption: 1.4,
  },
  
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 'md',
        lineHeight: 'base',
      },
      'h1, h2, h3, h4, h5, h6': {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '500',
      },
    },
  },
  components: {
    Button: {
      variants: {
        coffee: {
          bg: 'coffee.500',
          color: 'white',
          _hover: {
            bg: 'coffee.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
        },
        burgundy: {
          bg: 'burgundy.500',
          color: 'white',
          _hover: {
            bg: 'burgundy.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'sm',
          transition: 'all 0.3s',
          _hover: {
            boxShadow: 'lg',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    Badge: {
      variants: {
        coffee: {
          bg: 'coffee.100',
          color: 'coffee.800',
        },
        burgundy: {
          bg: 'burgundy.100',
          color: 'burgundy.800',
        },
      },
    },
  },
});

export default theme;