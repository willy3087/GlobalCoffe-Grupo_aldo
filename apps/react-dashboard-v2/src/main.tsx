import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import the main Dashboard component from our DDD structure
import { DashboardDemo } from '../presentation/pages/DashboardDemo';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <DashboardDemo />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);