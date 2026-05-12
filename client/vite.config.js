import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills'; // ✅ Fixed: Added curly braces

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: false, // Disables the internal shim to prevent the error you saw earlier
        process: true,
      },
    }),
  ],
  define: {
    global: 'globalThis', // Maps 'global' to 'globalThis' for axios and simple-peer
  },
});
