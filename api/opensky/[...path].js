// api/opensky/[...path].js
// Vercel Serverless Function – proxy ke OpenSky Network.
// Menangani CORS dan Basic Auth (bila OPENSKY_USER + OPENSKY_PASS di-set
// sebagai Environment Variables di dashboard Vercel).
export const config = { runtime: 'edge' };

export default async function handler(req) {
  // Ambil path setelah /api/opensky/
  const url = new URL(req.url);
  const upstreamPath = url.pathname.replace(/^\/api\/opensky/, '/api');
  const upstreamUrl  = `https://opensky-network.org${upstreamPath}${url.search}`;

  // Bangun headers untuk upstream
  const headers = { 'User-Agent': 'SkyWatch-ASEAN/1.0' };

  // Basic Auth bila credentials tersedia (di-set di Vercel Environment Variables)
  const user = process.env.OPENSKY_USER ?? process.env.VITE_OPENSKY_USER ?? '';
  const pass = process.env.OPENSKY_PASS ?? process.env.VITE_OPENSKY_PASS ?? '';
  if (user && pass) {
    const token = btoa(`${user}:${pass}`);
    headers['Authorization'] = `Basic ${token}`;
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(15_000),
    });

    const body = await upstream.text();

    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type':                upstream.headers.get('Content-Type') ?? 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control':               'no-store',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
