    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import { VitePWA } from 'vite-plugin-pwa'

    // https://vite.dev/config/
    export default defineConfig({
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          // Konfigurasi manifest PWA
          manifest: {
            name: 'Aplikasi Absensi PWA',
            short_name: 'Absensi',
            description: 'Aplikasi absensi karyawan yang dapat diinstal.',
            theme_color: '#1a202c',
            background_color: '#111827',
            display: 'standalone',
            start_url: '/',
            icons: [
              {
                src: 'absensi-icon-192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'absensi-icon-512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        })
      ],
    })
    