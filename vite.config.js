import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on all addresses
    allowedHosts: [
      '5366-2405-201-2003-c008-d5e6-44a9-f05f-8f5a.ngrok-free.app',
    ],
  },
});
