import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Единый порт 5176 для dev + preview, и прокси в обоих режимах
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    proxy: {
      '/api': { target: 'http://localhost:8082', changeOrigin: true },
      '/swagger': { target: 'http://localhost:8082', changeOrigin: true }
    }
  },
  preview: {
    port: 5176,
    proxy: {
      '/api': { target: 'http://localhost:8082', changeOrigin: true },
      '/swagger': { target: 'http://localhost:8082', changeOrigin: true }
    }
  }
})
