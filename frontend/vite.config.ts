import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Единый порт 5176 для dev + preview, и прокси в обоих режимах
export default defineConfig({
  base: '/medical_dehydration/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['placeholder.svg'],
      manifest: {
        name: 'Dehydration Lab',
        short_name: 'DehydLab',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0d6efd',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        runtimeCaching: [
          {
            urlPattern: /\/api\/symptoms.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-symptoms',
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
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
