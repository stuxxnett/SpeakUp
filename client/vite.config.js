import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `global` variable
      global: true, 
      // Whether to polyfill `process` variable
      process: true,
      // Whether to polyfill `Buffer` variable
      buffer: true,
    }),
  ],
  define: {
    // Some libraries use the global object, even in the browser
    global: 'globalThis',
  },
})