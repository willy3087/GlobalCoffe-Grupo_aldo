/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@domains': resolve(__dirname, './domains'),
      '@application': resolve(__dirname, './application'),
      '@presentation': resolve(__dirname, './presentation'),
      '@infrastructure': resolve(__dirname, './infrastructure'),
      '@components': resolve(__dirname, './presentation/components'),
      '@pages': resolve(__dirname, './presentation/pages'),
      '@hooks': resolve(__dirname, './presentation/hooks'),
      '@shared': resolve(__dirname, './presentation/components/shared'),
      '@market': resolve(__dirname, './presentation/components/market'),
      '@trading': resolve(__dirname, './presentation/components/trading'),
      '@coffee-market': resolve(__dirname, './domains/coffee-market'),
      '@trading-domain': resolve(__dirname, './domains/trading'),
      '@hedge-domain': resolve(__dirname, './domains/hedge'),
      '@climate-domain': resolve(__dirname, './domains/climate'),
      '@use-cases': resolve(__dirname, './application/use-cases'),
      '@dtos': resolve(__dirname, './application/dtos'),
      '@apis': resolve(__dirname, './infrastructure/external-apis'),
      '@repositories': resolve(__dirname, './infrastructure/repositories'),
      '@scrapers': resolve(__dirname, './infrastructure/web-scraping')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});