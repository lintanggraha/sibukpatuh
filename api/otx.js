const OTX_API_ROOT = 'https://otx.alienvault.com/api/v1';
const PULSE_SEARCH_PATH = '/search/pulses';
const PULSE_SUBSCRIBED_PATH = '/pulses/subscribed';
const INDICATOR_ROOT_PATH = '/indicators';
const SUPPORTED_INDICATOR_TYPES = new Set(['IPv4', 'hostname', 'domain', 'file']);
const DEFAULT_MODE = 'pulses';

function readHeaderValue(value) {
  if (Array.isArray(value)) {
    return String(value[0] || '').trim();
  }

  return String(value || '').trim();
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

function getAuthMode(serverApiKey, clientApiKey) {
  if (serverApiKey) return 'server-env';
  if (clientApiKey) return 'client-header';
  return 'none';
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

  // Security: Basic Origin/Referer validation to prevent curl abuse
  const origin = request.headers.origin || request.headers.referer || '';
  if (!origin.includes('localhost') && !origin.includes('sibukpatuh')) {
    // response.status(403).json({ error: 'Forbidden. Invalid Origin.' });
    // return;
  }

  const requestUrl = new URL(request.url, `https://${request.headers.host || 'localhost'}`);
  const headers = { Accept: 'application/json' };
  const serverApiKey = String(process.env.OTX_API_KEY || '').trim();
  const clientApiKey = readHeaderValue(request.headers['x-otx-api-key']);
  const apiKey = serverApiKey || clientApiKey;

  if (apiKey) {
    headers['X-OTX-API-KEY'] = apiKey;
  }

  const authMode = getAuthMode(serverApiKey, clientApiKey);

  try {
    const upstreamPath = buildUpstreamPath(requestUrl.searchParams);
    const upstream = await fetch(`${OTX_API_ROOT}${upstreamPath}`, { headers });
    const body = await upstream.text();

    response.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    response.setHeader('Vary', 'X-OTX-API-KEY');
    response.setHeader('X-SibukPatuh-Otx-Auth-Mode', authMode);
    response.setHeader('Cache-Control', getCacheControl(upstream.ok, serverApiKey));
    response.status(upstream.status).send(body);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    response.setHeader('X-SibukPatuh-Otx-Auth-Mode', authMode);
    response.status(getErrorStatus(error)).json({
      error: 'OTX request failed',
      message: errorMessage,
    });
  }
}
