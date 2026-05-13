const OTX_API_ROOT = 'https://otx.alienvault.com/api/v1';
const PULSE_SEARCH_PATH = '/search/pulses';
const PULSE_SUBSCRIBED_PATH = '/pulses/subscribed';
const INDICATOR_ROOT_PATH = '/indicators';
const SUPPORTED_INDICATOR_TYPES = new Set(['IPv4', 'hostname', 'domain', 'file']);
const DEFAULT_MODE = 'pulses';
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(www\.)?sibukpatuh\.net$/i,
  /^https:\/\/sibukpatuh\.vercel\.app$/i,
  /^http:\/\/localhost(?::\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/i,
];

function readHeaderValue(value) {
  if (Array.isArray(value)) {
    return String(value[0] || '').trim();
  }

  return String(value || '').trim();
}

function getRequestOrigin(headers) {
  const rawOrigin = Array.isArray(headers.origin) ? headers.origin[0] : headers.origin;
  if (rawOrigin) return String(rawOrigin).trim();

  const rawReferer = Array.isArray(headers.referer) ? headers.referer[0] : headers.referer;
  if (!rawReferer) return '';

  try {
    const url = new URL(String(rawReferer));
    return url.origin;
  } catch {
    return '';
  }
}

function isAllowedOrigin(origin) {
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

function buildPulseSearchPath(searchParams) {
  const feed = (searchParams.get('feed') || 'search').trim().toLowerCase();

  if (feed === 'subscribed') {
    return PULSE_SUBSCRIBED_PATH;
  }

  const params = new URLSearchParams();
  const query = (searchParams.get('q') || 'ransomware').trim() || 'ransomware';
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
  const limit = Math.min(20, Math.max(1, Number.parseInt(searchParams.get('limit') || '10', 10) || 10));

  params.set('q', query);
  params.set('page', String(page));
  params.set('limit', String(limit));

  return `${PULSE_SEARCH_PATH}?${params.toString()}`;
}

function buildIndicatorPath(searchParams) {
  const indicatorType = readHeaderValue(searchParams.get('indicatorType'));
  const value = readHeaderValue(searchParams.get('value'));
  const section = readHeaderValue(searchParams.get('section')) || 'general';

  if (!SUPPORTED_INDICATOR_TYPES.has(indicatorType)) {
    throw new Error('Unsupported indicatorType. Use IPv4, hostname, domain, or file.');
  }

  if (!value) {
    throw new Error('Missing indicator value.');
  }

  return `${INDICATOR_ROOT_PATH}/${encodeURIComponent(indicatorType)}/${encodeURIComponent(value)}/${encodeURIComponent(section)}`;
}

function buildUpstreamPath(searchParams) {
  const mode = (searchParams.get('mode') || DEFAULT_MODE).trim().toLowerCase();

  if (mode === 'pulses') {
    return buildPulseSearchPath(searchParams);
  }

  if (mode === 'indicator') {
    return buildIndicatorPath(searchParams);
  }

  throw new Error('Unsupported mode. Use pulses or indicator.');
}

function getCacheControl(upstreamOk, serverApiKey) {
  if (upstreamOk && serverApiKey) {
    return 's-maxage=300, stale-while-revalidate=900';
  }
  return 'no-store';
}

function getErrorStatus(error) {
  if (error instanceof Error && /Unsupported|Missing/.test(error.message)) {
    return 400;
  }
  return 502;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const origin = getRequestOrigin(request.headers);
  if (!origin || !isAllowedOrigin(origin)) {
    response.status(403).json({ error: 'Forbidden. Invalid Origin.' });
    return;
  }

  const requestUrl = new URL(request.url, `https://${request.headers.host || 'localhost'}`);
  const headers = { Accept: 'application/json' };
  const serverApiKey = String(process.env.OTX_API_KEY || '').trim();
  const clientApiKey = readHeaderValue(request.headers['x-otx-api-key']);
  const apiKey = serverApiKey || clientApiKey;

  if (apiKey) {
    headers['X-OTX-API-KEY'] = apiKey;
  }

  try {
    const upstreamPath = buildUpstreamPath(requestUrl.searchParams);
    const upstream = await fetch(`${OTX_API_ROOT}${upstreamPath}`, { headers });
    const body = await upstream.text();

    response.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    response.setHeader('Vary', 'X-OTX-API-KEY');
    response.setHeader('Cache-Control', getCacheControl(upstream.ok, serverApiKey));
    response.status(upstream.status).send(body);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    response.status(getErrorStatus(error)).json({
      error: 'OTX request failed',
      message: errorMessage,
    });
  }
}
