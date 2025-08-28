'use client';

import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import chakraTheme from '../styles/chakraTheme';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={chakraTheme}>
      {children}
    </ChakraProvider>
  );
}
// Integração do Chakra UI realizada substituindo o ThemeProvider do Material UI pelo ChakraProvider.
// O tema customizado definido em styles/chakraTheme.ts foi aplicado no ChakraProvider para garantir
// a consistência visual da aplicação com os tokens de design definidos.
// Esta configuração permite o uso dos componentes Chakra UI em toda a aplicação, incluindo a página features.