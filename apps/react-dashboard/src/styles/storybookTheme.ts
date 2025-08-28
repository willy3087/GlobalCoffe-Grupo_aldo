import { extendTheme } from '@chakra-ui/react';

// Tema específico do Global Coffee para Storybook
export const globalCoffeeTheme = extendTheme({
  colors: {
    // Cores primárias do café
    coffee: {
      50: '#FFEAA7',
      100: '#FDCB6E', 
      200: '#E17055',
      300: '#D63031',
      400: '#8B4513',
      500: '#5D4E37',
      600: '#4A3F2A',
      700: '#3D2F1F',
      800: '#2F2419',
      900: '#1F1811',
    },
    
    // Verde dos grãos
    coffeeGreen: {
      50: '#E8F5E8',
      100: '#C3E6C3',
      200: '#9AD99A', 
      300: '#6BCB6B',
      400: '#4CAF50',
      500: '#2E7D32',
      600: '#27632A',
      700: '#1E4620',
      800: '#163A18',
      900: '#0D2818',
    },

    // Dourado da colheita
    harvest: {
      50: '#FFF8E1',
      100: '#FFECB3',
      200: '#FFE082',
      300: '#FFD54F', 
      400: '#FFCA28',
      500: '#FFA726',
      600: '#FF9800',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },

    // Cores do mercado
    bull: '#16A34A',    // Verde para alta
    bear: '#DC2626',    // Vermelho para baixa  
    neutral: '#6B7280', // Cinza para neutro

    // Cores climáticas
    sunny: '#FbbF24',
    rainy: '#3B82F6', 
    cloudy: '#6B7280',
    storm: '#EF4444',
  },

  fonts: {
    heading: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  },

  fontSizes: {
    // Sistema baseado em 16px base
    '2xs': '0.625rem',  // 10px
    'xs': '0.75rem',    // 12px
    'sm': '0.875rem',   // 14px
    'md': '1rem',       // 16px
    'lg': '1.125rem',   // 18px
    'xl': '1.25rem',    // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },

  space: {
    // Sistema baseado em 4px (0.25rem)
    '0.5': '0.125rem',  // 2px
    '1': '0.25rem',     // 4px
    '1.5': '0.375rem',  // 6px
    '2': '0.5rem',      // 8px
    '2.5': '0.625rem',  // 10px
    '3': '0.75rem',     // 12px
    '3.5': '0.875rem',  // 14px
    '4': '1rem',        // 16px
    '5': '1.25rem',     // 20px
    '6': '1.5rem',      // 24px
    '7': '1.75rem',     // 28px
    '8': '2rem',        // 32px
    '9': '2.25rem',     // 36px
    '10': '2.5rem',     // 40px
    '11': '2.75rem',    // 44px
    '12': '3rem',       // 48px
    '14': '3.5rem',     // 56px
    '16': '4rem',       // 64px
    '20': '5rem',       // 80px
    '24': '6rem',       // 96px
    '28': '7rem',       // 112px
    '32': '8rem',       // 128px
    '36': '9rem',       // 144px
    '40': '10rem',      // 160px
    '44': '11rem',      // 176px
    '48': '12rem',      // 192px
    '52': '13rem',      // 208px
    '56': '14rem',      // 224px
    '60': '15rem',      // 240px
    '64': '16rem',      // 256px
    '72': '18rem',      // 288px
    '80': '20rem',      // 320px
    '96': '24rem',      // 384px
  },

  shadows: {
    xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    outline: '0 0 0 3px rgba(66, 153, 225, 0.6)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
    
    // Sombras específicas do tema
    coffee: '0 4px 6px -1px rgba(139, 69, 19, 0.1), 0 2px 4px -1px rgba(139, 69, 19, 0.06)',
    harvest: '0 4px 6px -1px rgba(255, 167, 38, 0.1), 0 2px 4px -1px rgba(255, 167, 38, 0.06)',
  },

  radii: {
    none: '0',
    sm: '0.125rem',    // 2px
    base: '0.25rem',   // 4px  
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',   // 24px
    full: '9999px',
  },

  // Componentes customizados
  components: {
    Card: {
      baseStyle: {
        container: {
          backgroundColor: 'white',
          boxShadow: 'md',
          _dark: {
            backgroundColor: 'gray.800',
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
        harvest: {
          bg: 'harvest.100', 
          color: 'harvest.800',
        },
        success: {
          bg: 'green.100',
          color: 'green.800',
        },
        warning: {
          bg: 'yellow.100',
          color: 'yellow.800', 
        },
        error: {
          bg: 'red.100',
          color: 'red.800',
        },
      },
    },

    Progress: {
      variants: {
        coffee: {
          filledTrack: {
            bg: 'coffee.400',
          },
        },
        harvest: {
          filledTrack: {
            bg: 'harvest.400',
          },
        },
      },
    },

    Button: {
      variants: {
        coffee: {
          bg: 'coffee.400',
          color: 'white',
          _hover: {
            bg: 'coffee.500',
          },
          _active: {
            bg: 'coffee.600',
          },
        },
        harvest: {
          bg: 'harvest.400',
          color: 'white',
          _hover: {
            bg: 'harvest.500',
          },
          _active: {
            bg: 'harvest.600',
          },
        },
      },
    },
  },

  // Breakpoints responsivos
  breakpoints: {
    sm: '320px',    // Mobile pequeno
    md: '768px',    // Tablet
    lg: '1024px',   // Desktop pequeno
    xl: '1280px',   // Desktop grande
    '2xl': '1536px' // Desktop extra-grande
  },

  // Configurações para o José Silva (produtor rural)
  // Tamanhos maiores para facilitar uso no campo
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  
  // Customizações específicas para mobile (campo)
  sizes: {
    // Tamanhos de toque maiores para uso no campo
    touchTarget: '44px',  // Recomendação Apple/Google
    fieldCard: '120px',   // Cards grandes para leitura no campo
    kpiValue: '48px',     // Valores grandes e legíveis
  },

  // Animações suaves para não distrair
  transition: {
    property: 'common',
    duration: 'normal',
  },
});