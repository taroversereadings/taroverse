import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    },
    proxy: {
      '/create-order': 'http://localhost:3000',
      '/record-payment': 'http://localhost:3000',
      '/portal-login': 'http://localhost:3000',
      '/validate-portal': 'http://localhost:3000',
      '/export-payments': 'http://localhost:3000'
    }
  }
});
