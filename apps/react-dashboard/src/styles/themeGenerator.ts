/**
 * Theme Generator - Sistema de geração dinâmica de temas
 * 
 * Gera todas as cores do tema baseado em uma cor principal
 */

import { ResponsiveValue } from "@chakra-ui/react";

// Tipo para cores do Chakra UI
type ChakraColor = string | "current" | "whiteAlpha.50" | "whiteAlpha.100" | "whiteAlpha.200" | "whiteAlpha.300" | "whiteAlpha.400" | "whiteAlpha.500" | "whiteAlpha.600" | "whiteAlpha.700" | "whiteAlpha.800" | "whiteAlpha.900" | "blackAlpha.50" | "blackAlpha.100" | "blackAlpha.200" | "blackAlpha.300" | "blackAlpha.400" | "blackAlpha.500" | "blackAlpha.600" | "blackAlpha.700" | "blackAlpha.800" | "blackAlpha.900" | "gray.50" | "gray.100" | "gray.200" | "gray.300" | "gray.400" | "gray.500" | "gray.600" | "gray.700" | "gray.800" | "gray.900" | "red.50" | "red.100" | "red.200" | "red.300" | "red.400" | "red.500" | "red.600" | "red.700" | "red.800" | "red.900" | "orange.50" | "orange.100" | "orange.200" | "orange.300" | "orange.400" | "orange.500" | "orange.600" | "orange.700" | "orange.800" | "orange.900" | "yellow.50" | "yellow.100" | "yellow.200" | "yellow.300" | "yellow.400" | "yellow.500" | "yellow.600" | "yellow.700" | "yellow.800" | "yellow.900" | "green.50" | "green.100" | "green.200" | "green.300" | "green.400" | "green.500" | "green.600" | "green.700" | "green.800" | "green.900" | "teal.50" | "teal.100" | "teal.200" | "teal.300" | "teal.400" | "teal.500" | "teal.600" | "teal.700" | "teal.800" | "teal.900" | "blue.50" | "blue.100" | "blue.200" | "blue.300" | "blue.400" | "blue.500" | "blue.600" | "blue.700" | "blue.800" | "blue.900" | "cyan.50" | "cyan.100" | "cyan.200" | "cyan.300" | "cyan.400" | "cyan.500" | "cyan.600" | "cyan.700" | "cyan.800" | "cyan.900" | "purple.50" | "purple.100" | "purple.200" | "purple.300" | "purple.400" | "purple.500" | "purple.600" | "purple.700" | "purple.800" | "purple.900" | "pink.50" | "pink.100" | "pink.200" | "pink.300" | "pink.400" | "pink.500" | "pink.600" | "pink.700" | "pink.800" | "pink.900" | "chakra-body-text._light" | "chakra-body-text._dark" | "chakra-body-bg._light" | "chakra-body-bg._dark" | "chakra-border-color._light" | "chakra-border-color._dark" | "chakra-inverse-text._light" | "chakra-inverse-text._dark" | "chakra-subtle-bg._light" | "chakra-subtle-bg._dark" | "chakra-subtle-text._light" | "chakra-subtle-text._dark" | "chakra-placeholder-color._light" | "chakra-placeholder-color._dark";

// Interface para o tema gerado
export interface GeneratedTheme {
  name: string;
  colors: {
    [x: string]: ResponsiveValue<ChakraColor> | undefined;
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    accent: string;
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
    border: {
      primary: string;
      secondary: string;
      focus: string;
    };
    status: {
      success: string;
      successLight: string;
      successBg: string;
      warning: string;
      warningLight: string;
      warningBg: string;
      error: string;
      errorLight: string;
      errorBg: string;
      info: string;
      infoLight: string;
      infoBg: string;
    };
    trading: {
      positive: string;
      positiveLight: string;
      positiveBg: string;
      negative: string;
      negativeLight: string;
      negativeBg: string;
      neutral: string;
      neutralLight: string;
      neutralBg: string;
    };
  };
}

/**
 * Converte cor hex para RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Converte RGB para hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Clareia uma cor
 */
function lighten(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const amount = Math.round(255 * percent);
  return rgbToHex(
    Math.min(255, r + amount),
    Math.min(255, g + amount),
    Math.min(255, b + amount)
  );
}

/**
 * Escurece uma cor
 */
function darken(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const amount = Math.round(255 * percent);
  return rgbToHex(
    Math.max(0, r - amount),
    Math.max(0, g - amount),
    Math.max(0, b - amount)
  );
}

/**
 * Calcula a luminosidade de uma cor
 */
function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Rotaciona o matiz de uma cor
 */
function rotateHue(hex: string, degrees: number): string {
  const { r, g, b } = hexToRgb(hex);
  
  // Converte RGB para HSL
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r1:
        h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6;
        break;
      case g1:
        h = ((b1 - r1) / d + 2) / 6;
        break;
      case b1:
        h = ((r1 - g1) / d + 4) / 6;
        break;
    }
  }
  
  // Rotaciona o matiz
  h = (h + degrees / 360) % 1;
  if (h < 0) h += 1;
  
  // Converte HSL de volta para RGB
  let r2 = 0, g2 = 0, b2 = 0;
  
  if (s === 0) {
    r2 = g2 = b2 = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r2 = hue2rgb(p, q, h + 1/3);
    g2 = hue2rgb(p, q, h);
    b2 = hue2rgb(p, q, h - 1/3);
  }
  
  return rgbToHex(
    Math.round(r2 * 255),
    Math.round(g2 * 255),
    Math.round(b2 * 255)
  );
}

/**
 * Gera um tema completo baseado em uma cor principal
 * @param primaryColor - Cor principal em formato hex
 * @param name - Nome do tema
 * @returns Tema completo gerado
 */
export function generateTheme(primaryColor: string, name: string = 'custom'): GeneratedTheme {
  // Gera variações da cor primária
  const primaryLight = lighten(primaryColor, 0.2);
  const primaryDark = darken(primaryColor, 0.2);
  
  // Gera cor secundária (complementar - 180 graus)
  const secondary = rotateHue(primaryColor, 180);
  const secondaryLight = lighten(secondary, 0.2);
  const secondaryDark = darken(secondary, 0.2);
  
  // Gera cor de acento (análoga - 30 graus)
  const accent = lighten(rotateHue(primaryColor, 30), 0.3);
  
  // Calcula se a cor primária é escura ou clara
  const isDark = getLuminance(primaryColor) < 0.5;
  
  // Gera cores de background baseadas na luminosidade
  const backgrounds = {
    primary: '#ffffff',
    secondary: '#eef3f7',
    tertiary: '#eff3f9',
  };
  
  // Gera cores de texto baseadas no contraste
  const textColors = {
    primary: '#1A202C',
    secondary: '#4A5568',
    tertiary: '#718096',
    inverse: isDark ? '#FFFFFF' : primaryColor,
  };
  
  // Gera cores de borda - ajustadas para não ficarem muito claras
  // Para cores escuras, usa menos clareza. Para cores claras, usa mais.
  const primaryLuminance = getLuminance(primaryColor);
  
  // Para cores muito escuras como coffee, usa uma abordagem diferente
  let borderPrimary, borderSecondary;
  
  if (primaryLuminance < 0.15) {
    // Para cores muito escuras, cria bordas baseadas em cinza com um toque da cor primária
    const { r, g, b } = hexToRgb(primaryColor);
    borderPrimary = `rgb(${Math.min(255, r + 180)}, ${Math.min(255, g + 180)}, ${Math.min(255, b + 180)})`;
    borderSecondary = `rgb(${Math.min(255, r + 140)}, ${Math.min(255, g + 140)}, ${Math.min(255, b + 140)})`;
  } else if (primaryLuminance < 0.3) {
    // Para cores escuras, clareia moderadamente
    borderPrimary = lighten(primaryColor, 0.55);
    borderSecondary = lighten(primaryColor, 0.45);
  } else {
    // Para cores claras, usa o comportamento padrão
    borderPrimary = lighten(primaryColor, 0.85);
    borderSecondary = lighten(primaryColor, 0.75);
  }
  
  const borderColors = {
    primary: borderPrimary,
    secondary: borderSecondary,
    focus: primaryColor,
  };
  
  // Cores de status FIXAS - não mudam com o tema
  // Estas são cores universais para indicadores semânticos
  const statusColors = {
    success: '#48BB78',      // Verde fixo para sucesso/aprovado
    successLight: '#9AE6B4', // Verde claro
    successBg: '#F0FFF4',    // Verde muito claro (background)
    warning: '#ED8936',      // Laranja fixo para avisos
    warningLight: '#FBD38D', // Laranja claro
    warningBg: '#FFFDF7',    // Laranja muito claro (background)
    error: '#F56565',        // Vermelho fixo para erros
    errorLight: '#FEB2B2',   // Vermelho claro
    errorBg: '#FFF5F5',      // Vermelho muito claro (background)
    info: '#4299E1',         // Azul fixo para informações
    infoLight: '#90CDF4',    // Azul claro
    infoBg: '#ffffff',       // Azul muito claro (background)
  };
  
  // Cores de trading FIXAS - padrão universal do mercado financeiro
  const tradingColors = {
    positive: '#48BB78',      // Verde para alta/ganhos
    positiveLight: '#9AE6B4', // Verde claro
    positiveBg: '#F0FFF4',    // Verde muito claro (background)
    negative: '#F56565',      // Vermelho para baixa/perdas
    negativeLight: '#FEB2B2', // Vermelho claro
    negativeBg: '#FFF5F5',    // Vermelho muito claro (background)
    neutral: '#718096',       // Cinza para neutro/estável
    neutralLight: '#919faf',  // Cinza claro
    neutralBg: '#d0d9e0ed',     // Cinza muito claro (background)
  };
  
  return {
    name,
    colors: {
      primary: primaryColor,
      primaryLight,
      primaryDark,
      secondary,
      secondaryLight,
      secondaryDark,
      accent,
      background: backgrounds,
      text: textColors,
      border: borderColors,
      status: statusColors,
      trading: tradingColors,
    },
  };
}

// Temas predefinidos
export const predefinedThemes = {
  coffee: generateTheme('#753a0f', 'coffee'),
  burgundy: generateTheme('#800020', 'burgundy'),
  ocean: generateTheme('#005e94c1', 'ocean'),
  forest: generateTheme('#357035a1', 'forest'),
  sunset: generateTheme('#cc4514', 'sunset'),
  midnight: generateTheme('#191970', 'midnight'),
  gold: generateTheme('#ffd9007b', 'gold'),
  purple: generateTheme('#4d3e70', 'purple'),
};

// Função para aplicar tema ao Chakra UI
export function applyThemeToChakra(theme: GeneratedTheme) {
  // Ajusta os fatores de clareza baseado na luminosidade da cor primária
  const primaryLuminance = getLuminance(theme.colors.primary);
  const isVeryDark = primaryLuminance < 0.2;
  
  return {
    colors: {
      brand: {
        50: lighten(theme.colors.primary, isVeryDark ? 0.75 : 0.9),
        100: lighten(theme.colors.primary, isVeryDark ? 0.6 : 0.7),
        200: lighten(theme.colors.primary, isVeryDark ? 0.45 : 0.5),
        300: lighten(theme.colors.primary, isVeryDark ? 0.3 : 0.3),
        400: lighten(theme.colors.primary, isVeryDark ? 0.15 : 0.1),
        500: theme.colors.primary,
        600: darken(theme.colors.primary, 0.1),
        700: darken(theme.colors.primary, 0.3),
        800: darken(theme.colors.primary, 0.5),
        900: darken(theme.colors.primary, 0.7),
      },
      ...theme.colors,
    },
  };
}