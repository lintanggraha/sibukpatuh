import { guardRequest } from '../server/security.js';

export default async function handler(req, res) {
  if (!guardRequest(req, res, { methods: ['GET'], rateLimit: { windowMs: 60_000, max: 20 } })) {
    return;
  }

  try {
    const response = await fetch('https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SibukPatuh-Intelligence-Center/1.0',
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      throw new Error(`CISA upstream status ${response.status}`);
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json(data);
  } catch (error) {
    console.error('[CISA] Proxy error:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({ error: 'Failed to fetch data from CISA.' });
  }
}
