import { guardRequest } from '../server/security.js';

/**
 * Vercel Serverless Function: Pulsedive IOC Intelligence Proxy.
 */
export default async function handler(req, res) {
  if (!guardRequest(req, res, { methods: ['GET'], rateLimit: { windowMs: 60_000, max: 20 } })) {
    return;
  }

  const indicator = String(req.query?.indicator || '').trim();
  const action = String(req.query?.action || '').trim().toLowerCase();
  if (indicator.length > 512) {
    return res.status(400).json({ success: false, error: 'Indicator is too long.' });
  }

  const pulsediveKey = String(process.env.PULSEDIVE_KEY || '').trim();
  const upstream = async (url) => fetch(url, { signal: AbortSignal.timeout(15_000) });

  if (action === 'feed') {
    try {
      const key = pulsediveKey ? `&key=${encodeURIComponent(pulsediveKey)}` : '';
      const response = await upstream(`https://pulsedive.com/api/explore.php?q=risk%3Ahigh%2Ccritical&limit=20&pretty=1${key}`);
      if (response.status === 429) {
        res.setHeader('Retry-After', '60');
        return res.status(429).json({ success: false, error: 'Pulsedive rate limit reached.' });
      }
      if (!response.ok) throw new Error(`Pulsedive feed upstream status ${response.status}`);
      const data = await response.json();
      return res.status(200).json({ success: true, results: Array.isArray(data.results) ? data.results : [] });
    } catch (error) {
      console.error('[Pulsedive] Feed error:', error instanceof Error ? error.message : 'Unknown error');
      return res.status(502).json({ success: false, error: 'Failed to fetch threat feed.' });
    }
  }

  if (!indicator) {
    return res.status(400).json({ success: false, error: 'Indicator is required.' });
  }

  try {
    const key = pulsediveKey ? `&key=${encodeURIComponent(pulsediveKey)}` : '';
    const response = await upstream(
      `https://pulsedive.com/api/info.php?indicator=${encodeURIComponent(indicator)}&pretty=1${key}`
    );

    if (response.status === 429) {
      res.setHeader('Retry-After', '60');
      return res.status(429).json({ success: false, error: 'Pulsedive rate limit reached.' });
    }
    if (!response.ok) {
      return res.status(502).json({ success: false, error: 'Pulsedive API is currently unavailable.' });
    }

    const data = await response.json();
    if (data.error) return res.status(404).json({ success: false, error: String(data.error).slice(0, 200) });

    return res.status(200).json({
      success: true,
      data: {
        indicator: data.indicator,
        risk: data.risk,
        risk_recommended: data.risk_recommended,
        threats: Array.isArray(data.threats) ? data.threats : [],
        feeds: Array.isArray(data.feeds) ? data.feeds : [],
        attributes: data.attributes && typeof data.attributes === 'object' ? data.attributes : {},
        properties: data.properties && typeof data.properties === 'object' ? data.properties : {},
        dns: data.attributes?.dns || null,
        whois: data.attributes?.whois || null,
        ssl: data.attributes?.ssl || null,
        geo: data.attributes?.geo || null,
      },
    });
  } catch (error) {
    console.error('[Pulsedive] Proxy error:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({ success: false, error: 'Pulsedive API is currently unavailable.' });
  }
}
