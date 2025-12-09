import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['process'],
      globals: {
        global: true,
        process: true,
      },
    }),
  ],
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress all warnings from node polyfills plugin
        const message = warning.message || warning.toString() || ''
        if (
          warning.code === 'CIRCULAR_DEPENDENCY' ||
          message.includes('externalized') ||
          message.includes('externalize') ||
          message.includes('external') ||
          message.includes('If you do want to externalize') ||
          message.includes('build.rollupOptions.external')
        ) {
          return
        }
        warn(warning)
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
})
