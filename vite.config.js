import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['wasm-postflop']
  },
  server: {
    port: 3000,
    open: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/api/slumbot': {
        target: 'https://slumbot.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/slumbot/, '/api')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          wasm: ['wasm-postflop']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
