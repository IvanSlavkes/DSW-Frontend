import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '^/(auth|localities|fields|field-categories|matches|users|match-teams|team-positions|friend-requests|notifications|ratings)(/.*)?$': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        // /matches también es una ruta del frontend. Dejá que Vite sirva la SPA
        // cuando el navegador navega o recarga una página, y proxyá las llamadas API.
        bypass: (request) => {
          if (request.headers.accept?.includes('text/html')) return request.url;
        },
      },
    },
  },
})
