// api/opensky/states/all.js
// Vercel Serverless Function untuk rute langsung /api/opensky/states/all

export default async function handler(req, res) {
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const upstreamUrl = `https://opensky-network.org/api/states/all${query}`;

  const headers = { 'User-Agent': 'SkyWatch-ASEAN/1.0' };
  const rawApiKey = (process.env.OPENSKY_API_KEY ?? process.env.VITE_OPENSKY_API_KEY ?? '').trim();
  const apiKey = rawApiKey.startsWith('cb1_') ? '' : rawApiKey;
  if (apiKey) {
    const authHeader = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
    headers['Authorization'] = authHeader;
    headers['x-api-key'] = apiKey;
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      headers,
      signal: AbortSignal.timeout(15000),
    });

    const body = await upstream.text();
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(upstream.status).send(body);
  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(502).json({ error: err.message });
  }
}
