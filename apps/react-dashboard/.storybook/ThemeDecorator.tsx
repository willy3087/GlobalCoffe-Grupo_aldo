import React from 'react';
import { ThemeProvider } from '../src/contexts/ThemeContext';

export const withTheme = (Story: any) => (
  <ThemeProvider>
    <div style={{ padding: '2rem' }}>
      <Story />
    </div>
  </ThemeProvider>
);