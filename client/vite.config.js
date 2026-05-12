import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import NodePolyfills from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    NodePolyfills({
      globals: {
        global: false, // disables the global polyfill to prevent shim import errors
      },
    }),
  ],
  define: {
    global: 'globalThis', // allows code expecting 'global' to work in the browser
  },
});
