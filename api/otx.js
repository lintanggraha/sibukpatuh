import { guardRequest } from '../server/security.js';

const OTX_API_ROOT = 'https://otx.alienvault.com/api/v1';
const PULSE_SEARCH_PATH = '/search/pulses';
const PULSE_SUBSCRIBED_PATH = '/pulses/subscribed';
const INDICATOR_ROOT_PATH = '/indicators';
const SUPPORTED_INDICATOR_TYPES = new Set(['IPv4', 'hostname', 'domain', 'file']);

function buildPulseSearchPath(searchParams) {
  const feed = String(searchParams.get('feed') || 'search').trim().toLowerCase();
  if (feed === 'subscribed') return PULSE_SUBSCRIBED_PATH;
  if (feed !== 'search') throw new Error('Unsupported feed.');

  const query = String(searchParams.get('q') || 'ransomware').trim();
  if (!query || query.length > 100) throw new Error('Invalid search query.');

  const page = Math.min(100, Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1));
  const limit = Math.min(20, Math.max(1, Number.parseInt(searchParams.get('limit') || '10', 10) || 10));
  const params = new URLSearchParams({ q: query, page: String(page), limit: String(limit) });
  return `${PULSE_SEARCH_PATH}?${params.toString()}`;
}

function buildIndicatorPath(searchParams) {
  const indicatorType = String(searchParams.get('indicatorType') || '').trim();
  const value = String(searchParams.get('value') || '').trim();
  const section = String(searchParams.get('section') || 'general').trim();

  if (!SUPPORTED_INDICATOR_TYPES.has(indicatorType)) throw new Error('Unsupported indicatorType.');
  if (!value || value.length > 512 || section.length > 64) throw new Error('Invalid indicator.');

  return `${INDICATOR_ROOT_PATH}/${encodeURIComponent(indicatorType)}/${encodeURIComponent(value)}/${encodeURIComponent(section)}`;
}

export default async function handler(request, response) {
  if (!guardRequest(request, response, {
    methods: ['GET'],
    rateLimit: { windowMs: 60_000, max: 20 },
  })) {
    return;
  }

  const serverApiKey = String(process.env.OTX_API_KEY || '').trim();
  const headers = { Accept: 'application/json' };
  if (serverApiKey) headers['X-OTX-API-KEY'] = serverApiKey;

  try {
    const requestUrl = new URL(request.url, `https://${request.headers.host || 'localhost'}`);
    const mode = String(requestUrl.searchParams.get('mode') || 'pulses').trim().toLowerCase();
    const upstreamPath = mode === 'pulses'
      ? buildPulseSearchPath(requestUrl.searchParams)
      : mode === 'indicator'
        ? buildIndicatorPath(requestUrl.searchParams)
        : (() => { throw new Error('Unsupported mode.'); })();

    const upstream = await fetch(`${OTX_API_ROOT}${upstreamPath}`, {
      headers,
      signal: AbortSignal.timeout(15_000),
    });
    const body = await upstream.text();

    response.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    response.setHeader('Cache-Control', serverApiKey && upstream.ok ? 's-maxage=300, stale-while-revalidate=900' : 'no-store');
    return response.status(upstream.status).send(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = /Unsupported|Invalid/.test(message) ? 400 : 502;
    console.error('[OTX] Proxy error:', message);
    return response.status(status).json({ error: status === 400 ? message : 'OTX request failed.' });
  }
}
