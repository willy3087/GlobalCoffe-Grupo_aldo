/**
 * Theme Context - Gerenciamento global de temas
 * 
 * Contexto que permite trocar temas dinamicamente em toda a aplicação
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { 
  GeneratedTheme, 
  generateTheme, 
  predefinedThemes, 
  applyThemeToChakra 
} from '../styles/themeGenerator';
import baseTheme from '../styles/theme';

// Interface do contexto
interface ThemeContextData {
  currentTheme: GeneratedTheme;
  currentThemeName: string;
  availableThemes: typeof predefinedThemes;
  setTheme: (themeName: string) => void;
  setCustomTheme: (primaryColor: string, name?: string) => void;
  primaryColor: string;
}

// Cria o contexto
const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

// Hook para usar o contexto de tema
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

// Provider do tema
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: string;
}

export function ThemeProvider({ children, initialTheme = 'coffee' }: ThemeProviderProps) {
  // Estado do tema atual
  const [currentThemeName, setCurrentThemeName] = useState(initialTheme);
  const [currentTheme, setCurrentTheme] = useState<GeneratedTheme>(
    predefinedThemes[initialTheme as keyof typeof predefinedThemes] || predefinedThemes.coffee
  );
  
  // Carrega tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('globalcoffee-theme');
    const savedCustomColor = localStorage.getItem('globalcoffee-custom-color');
    
    if (savedCustomColor) {
      // Se há uma cor customizada salva
      const customTheme = generateTheme(savedCustomColor, 'custom');
      setCurrentTheme(customTheme);
      setCurrentThemeName('custom');
    } else if (savedTheme && predefinedThemes[savedTheme as keyof typeof predefinedThemes]) {
      // Se há um tema predefinido salvo
      setCurrentTheme(predefinedThemes[savedTheme as keyof typeof predefinedThemes]);
      setCurrentThemeName(savedTheme);
    }
  }, []);
  
  // Função para trocar para um tema predefinido
  const setTheme = (themeName: string) => {
    if (predefinedThemes[themeName as keyof typeof predefinedThemes]) {
      const newTheme = predefinedThemes[themeName as keyof typeof predefinedThemes];
      setCurrentTheme(newTheme);
      setCurrentThemeName(themeName);
      localStorage.setItem('globalcoffee-theme', themeName);
      localStorage.removeItem('globalcoffee-custom-color');
    }
  };
  
  // Função para definir um tema customizado
  const setCustomTheme = (primaryColor: string, name: string = 'custom') => {
    const customTheme = generateTheme(primaryColor, name);
    setCurrentTheme(customTheme);
    setCurrentThemeName('custom');
    localStorage.setItem('globalcoffee-custom-color', primaryColor);
    localStorage.removeItem('globalcoffee-theme');
  };
  
  // Cria o tema do Chakra UI baseado no tema atual
  const chakraTheme = React.useMemo(() => {
    const themeColors = applyThemeToChakra(currentTheme);
    return extendTheme({
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        ...themeColors.colors,
      },
      styles: {
        global: () => ({
          body: {
            bg: currentTheme.colors.background.primary,
            color: currentTheme.colors.text.primary,
          },
          '*::placeholder': {
            color: currentTheme.colors.text.tertiary,
          },
          '*, *::before, &::after': {
            borderColor: currentTheme.colors.border.primary,
          },
        }),
      },
      components: {
        Button: {
          baseStyle: {
            fontWeight: 'medium',
          },
          variants: {
            solid: (props: any) => ({
              bg: props.colorScheme === 'brand' ? currentTheme.colors.primary : undefined,
              color: 'white',
              _hover: {
                bg: props.colorScheme === 'brand' ? currentTheme.colors.primaryDark : undefined,
              },
            }),
            outline: (props: any) => ({
              borderColor: props.colorScheme === 'brand' ? currentTheme.colors.primary : undefined,
              color: props.colorScheme === 'brand' ? currentTheme.colors.primary : undefined,
              _hover: {
                bg: props.colorScheme === 'brand' 
                  ? `${currentTheme.colors.primary}20` 
                  : undefined,
              },
            }),
          },
        },
        Card: {
          baseStyle: {
            container: {
              borderColor: currentTheme.colors.border.primary,
              _hover: {
                borderColor: currentTheme.colors.border.focus,
                shadow: 'lg',
              },
            },
          },
        },
        Input: {
          variants: {
            outline: {
              field: {
                borderColor: currentTheme.colors.border.primary,
                _hover: {
                  borderColor: currentTheme.colors.border.secondary,
                },
                _focus: {
                  borderColor: currentTheme.colors.border.focus,
                  boxShadow: `0 0 0 1px ${currentTheme.colors.border.focus}`,
                },
              },
            },
          },
        },
      },
    });
  }, [currentTheme]);
  
  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        currentThemeName,
        availableThemes: predefinedThemes,
        setTheme,
        setCustomTheme,
        primaryColor: currentTheme.colors.primary,
      }}
    >
      <ChakraProvider theme={chakraTheme}>
        {children}
      </ChakraProvider>
    </ThemeContext.Provider>
  );
}

// Componente de seletor de tema
export function ThemeSelector() {
  const { currentTheme, currentThemeName, availableThemes, setTheme, setCustomTheme, primaryColor } = useThemeContext();
  const [customColor, setCustomColor] = useState(primaryColor);
  const [showCustom, setShowCustom] = useState(currentThemeName === 'custom');
  
  return (
    <div style={{
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      padding: '8px 12px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: "24px",
      backdropFilter: 'blur(10px)'
    }}>
      <span style={{
        fontSize: '14px',
        fontWeight: '500',
        color: 'white',
        whiteSpace: 'nowrap'
      }}>
        Tema:
      </span>
      <select
        value={showCustom ? 'custom' : currentThemeName}
        onChange={(e) => {
          if (e.target.value === 'custom') {
            setShowCustom(true);
            setCustomTheme(customColor);
          } else {
            setShowCustom(false);
            setTheme(e.target.value);
          }
        }}
        style={{
          padding: '6px 10px',
          borderRadius: "24px",
          border: `1px solid ${currentTheme.colors.primary}`,
          backgroundColor: currentTheme.colors.background.secondary,
          color: currentTheme.colors.text.primary,
          fontSize: '14px',
          cursor: 'pointer',
          minWidth: '120px'
        }}
      >
        {Object.keys(availableThemes).map((themeName) => (
          <option key={themeName} value={themeName}>
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </option>
        ))}
        <option value="custom">Personalizado</option>
      </select>
      
      {showCustom && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          position: 'relative',
          zIndex: 9999
        }}>
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              setCustomTheme(e.target.value);
            }}
            style={{ 
              width: '36px', 
              height: '36px',
              border: '2px solid white',
              borderRadius: "24px",
              cursor: 'pointer',
              padding: '2px',
              backgroundColor: 'transparent',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none'
            }}
          />
          <span style={{ 
            fontSize: '12px', 
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '4px 8px',
            borderRadius: "24px",
            fontFamily: 'monospace'
          }}>
            {customColor}
          </span>
        </div>
      )}
    </div>
  );
}