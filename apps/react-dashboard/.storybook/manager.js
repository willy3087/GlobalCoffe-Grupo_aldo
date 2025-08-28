import { addons } from '@storybook/preview-api';
import { create } from '@storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: 'GlobalCoffee Design System',
  brandUrl: 'https://globalcoffee.com',
  brandImage: undefined,
  brandTarget: '_self',

  colorPrimary: '#8B4513',
  colorSecondary: '#8B4513',

  // UI
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e5e7eb',
  appBorderRadius: 8,

  // Typography
  fontBase: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#1f2937',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#6b7280',
  barSelectedColor: '#8B4513',
  barBg: '#f9fafb',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputTextColor: '#1f2937',
  inputBorderRadius: 4,
});

addons.setConfig({
  theme,
});