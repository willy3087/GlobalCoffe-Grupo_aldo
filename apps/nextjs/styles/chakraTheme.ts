import { extendTheme } from '@chakra-ui/react';
import designTokens from './designTokens';
import { createStandaloneToast } from '@chakra-ui/toast';

const { colors, typography, spacing, borders, shadows, transitions } = designTokens;

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    primary: {
      500: colors.primary,
      600: colors.primaryDark,
      400: colors.primaryLight,
    },
    secondary: {
      500: colors.secondary,
      600: colors.secondaryDark,
    },
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
  },
  fonts: {
    heading: typography.fontFamilyBase,
    body: typography.fontFamilyBase,
  },
  fontSizes: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
    '2xl': typography.headings.h1,
    'xl': typography.headings.h2,
    'lg': typography.headings.h3,
    'md': typography.headings.h4,
    'sm': typography.headings.h5,
    'xs': typography.headings.h6,
  },
  radii: {
    sm: borders.radiusSmall,
    md: borders.radiusMedium,
    lg: borders.radiusLarge,
  },
  shadows: {
    sm: shadows.level1,
    md: shadows.level2,
    lg: shadows.level3,
  },
  transition: {
    property: 'all',
    duration: '0.3s',
    timingFunction: 'ease-in-out',
  },
});

export const toast = createStandaloneToast();

export default theme;