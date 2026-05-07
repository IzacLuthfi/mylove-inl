import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Logo.png', 'favicon.ico', 'robots.txt'],
      manifest: {
        name: 'MyLove Izac & Lian',
        short_name: 'MyLove I&L',
        description: 'Aplikasi Kenangan Manis Izac dan Lian',
        theme_color: '#FAFAFA',
        background_color: '#FAFAFA',
        display: 'standalone', // Membuatnya tampil seperti aplikasi asli tanpa bar browser
        orientation: 'portrait',
        icons: [
          {
            src: 'Logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'Logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})