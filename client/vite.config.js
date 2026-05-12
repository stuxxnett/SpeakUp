import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Explicitly polyfill these three major Node globals
      globals: {
        Buffer: true, 
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  // This 'define' block is a backup. It tells Vite: 
  // "Every time you see 'global', just use 'globalThis' (which browsers understand)."
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Direct mapping for simple-peer dependencies
      'readable-stream': 'vite-plugin-node-polyfills/shims/readable-stream',
    },
  },
})
