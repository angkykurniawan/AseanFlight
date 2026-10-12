import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Baca .env di sini agar bisa dipakai di konfigurasi server proxy
  const env = loadEnv(mode, process.cwd(), '');

  const apiKey = (env.VITE_OPENSKY_API_KEY ?? env.OPENSKY_API_KEY ?? '').trim();

  // Buat header Authorization / API Key bila kredensial tersedia
  const proxyHeaders = {};
  if (apiKey) {
    const authHeader = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
    proxyHeaders['Authorization'] = authHeader;
    proxyHeaders['x-api-key'] = apiKey;
  } else {
    // Fallback bila masih ada username:password
    const openskyUser = env.VITE_OPENSKY_USER ?? '';
    const openskyPass = env.VITE_OPENSKY_PASS ?? '';
    if (openskyUser && openskyPass) {
      const token = Buffer.from(`${openskyUser}:${openskyPass}`).toString('base64');
      proxyHeaders['Authorization'] = `Basic ${token}`;
    }
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // Semua request ke /api/opensky/* diteruskan ke OpenSky Network
        // di sisi server (Node.js) sehingga tidak kena CORS browser.
        // Bila VITE_OPENSKY_USER + VITE_OPENSKY_PASS diisi, header
        // Authorization Basic dikirim otomatis → batas naik ke 4000 req/hari.
        '/api/opensky': {
          target: 'https://opensky-network.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/opensky/, '/api'),
          headers: proxyHeaders,
        },
      },
    },
  };
});
