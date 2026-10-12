import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Semua request ke /api/opensky/* diteruskan ke OpenSky Network
      // di sisi server (Node.js) sehingga tidak kena CORS browser.
      '/api/opensky': {
        target: 'https://opensky-network.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/opensky/, '/api'),
      },
    },
  },
});
