const OTX_SEARCH_URL = 'https://otx.alienvault.com/api/v1/search/pulses';

function readHeaderValue(value) {
  if (Array.isArray(value)) {
    return String(value[0] || '').trim();
  }

  return String(value || '').trim();
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const requestUrl = new URL(request.url, `https://${request.headers.host || 'localhost'}`);
  const params = new URLSearchParams();
  const query = (requestUrl.searchParams.get('q') || 'ransomware').trim() || 'ransomware';
  const page = Math.max(1, Number.parseInt(requestUrl.searchParams.get('page') || '1', 10) || 1);
  const limit = Math.min(20, Math.max(1, Number.parseInt(requestUrl.searchParams.get('limit') || '10', 10) || 10));

  params.set('q', query);
  params.set('page', String(page));
  params.set('limit', String(limit));

  const headers = {
    Accept: 'application/json',
  };
  const serverApiKey = String(process.env.OTX_API_KEY || '').trim();
  const clientApiKey = readHeaderValue(request.headers['x-otx-api-key']);
  const apiKey = serverApiKey || clientApiKey;

  if (apiKey) {
    headers['X-OTX-API-KEY'] = apiKey;
  }

  try {
    const upstream = await fetch(`${OTX_SEARCH_URL}?${params.toString()}`, { headers });
    const body = await upstream.text();
    const authMode = serverApiKey ? 'server-env' : clientApiKey ? 'client-header' : 'none';

    response.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    response.setHeader('Vary', 'X-OTX-API-KEY');
    response.setHeader('X-SibukPatuh-Otx-Auth-Mode', authMode);
    response.setHeader(
      'Cache-Control',
      upstream.ok && serverApiKey ? 's-maxage=300, stale-while-revalidate=900' : 'no-store',
    );
    response.status(upstream.status).send(body);
  } catch (error) {
    response.setHeader('X-SibukPatuh-Otx-Auth-Mode', serverApiKey ? 'server-env' : clientApiKey ? 'client-header' : 'none');
    response.status(502).json({
      error: 'OTX request failed',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
