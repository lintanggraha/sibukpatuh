import { guardRequest } from '../server/security.js';

/**
 * Vercel Serverless Function: Breach Directory Proxy.
 * The endpoint never fabricates breach results when the upstream is unavailable.
 */
export default async function handler(req, res) {
  if (!guardRequest(req, res, { methods: ['GET'], rateLimit: { windowMs: 60_000, max: 10 } })) {
    return;
  }

  const email = String(req.query?.email || '').trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || email.length > 254 || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'A valid email address is required',
    });
  }

  const rapidApiKey = String(process.env.RAPIDAPI_KEY || '').trim();
  if (!rapidApiKey) {
    return res.status(503).json({
      success: false,
      error: 'Breach lookup is not configured.',
    });
  }

  try {
    const url = `https://breachdirectory.p.rapidapi.com/?func=auto&term=${encodeURIComponent(email)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'breachdirectory.p.rapidapi.com',
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (response.status === 429) {
      res.setHeader('Retry-After', '60');
      return res.status(429).json({
        success: false,
        error: 'Breach database rate limit reached. Please retry later.',
      });
    }

    if (!response.ok) {
      console.warn(`[Breach API] Upstream returned ${response.status}`);
      return res.status(502).json({
        success: false,
        error: 'External security database is currently unavailable.',
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      found: Number(data.found || 0),
      result: Array.isArray(data.result) ? data.result : [],
    });
  } catch (error) {
    console.error('[Breach API] Proxy error:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({
      success: false,
      error: 'External security database is currently unavailable.',
    });
  }
}
