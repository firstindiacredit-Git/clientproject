import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  define: {
    'process.env': {},
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress circular dependency warnings from node polyfills
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          return
        }
        // Suppress externalization warnings for polyfills
        if (
          warning.message &&
          (warning.message.includes('externalized') ||
            warning.message.includes('externalize'))
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
