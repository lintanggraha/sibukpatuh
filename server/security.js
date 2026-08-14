const ALLOWED_ORIGINS = new Set([
  'https://sibukpatuh.net',
  'https://www.sibukpatuh.net',
  'https://sibukpatuh.vercel.app',
]);

const LOCAL_ORIGIN_PATTERN = /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i;
const rateLimitStore = new Map();
const DEFAULT_RATE_LIMIT = { windowMs: 60_000, max: 30 };

function getHeader(headers = {}, name) {
  const value = headers[name] ?? headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

export function getRequestOrigin(req) {
  const origin = String(getHeader(req.headers, 'origin') || '').trim();
  if (origin) return origin;

  const referer = String(getHeader(req.headers, 'referer') || '').trim();
  if (!referer) return '';

  try {
    return new URL(referer).origin;
  } catch {
    return '';
  }
}

export function isAllowedOrigin(origin) {
  return ALLOWED_ORIGINS.has(origin) || LOCAL_ORIGIN_PATTERN.test(origin);
}

function clientIp(req) {
  const forwarded = String(getHeader(req.headers, 'x-forwarded-for') || '').trim();
  if (forwarded) return forwarded.split(',')[0].trim();
  return String(getHeader(req.headers, 'x-real-ip') || req.socket?.remoteAddress || 'unknown').trim();
}

function consumeRateLimit(key, config = DEFAULT_RATE_LIMIT) {
  const now = Date.now();
  const current = rateLimitStore.get(key);
  const entry = !current || now - current.startedAt >= config.windowMs
    ? { startedAt: now, count: 0 }
    : current;

  entry.count += 1;
  rateLimitStore.set(key, entry);

  if (rateLimitStore.size > 2000) {
    for (const [storedKey, storedEntry] of rateLimitStore) {
      if (now - storedEntry.startedAt >= config.windowMs) rateLimitStore.delete(storedKey);
    }
  }

  return {
    limited: entry.count > config.max,
    retryAfter: Math.max(1, Math.ceil((config.windowMs - (now - entry.startedAt)) / 1000)),
  };
}

export function guardRequest(req, res, {
  methods = ['GET'],
  rateLimit = DEFAULT_RATE_LIMIT,
  allowApiKeyHeader = false,
} = {}) {
  const origin = getRequestOrigin(req);
  if (!origin || !isAllowedOrigin(origin)) {
    res.status(403).json({ error: 'Forbidden. Invalid Origin.' });
    return false;
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', methods.concat('OPTIONS').join(', '));
  res.setHeader(
    'Access-Control-Allow-Headers',
    allowApiKeyHeader ? 'Content-Type, X-OTX-API-KEY' : 'Content-Type'
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return false;
  }

  if (!methods.includes(req.method)) {
    res.setHeader('Allow', methods.join(', '));
    res.status(405).json({ error: 'Method not allowed.' });
    return false;
  }

  const limit = consumeRateLimit(`${origin}:${clientIp(req)}`, rateLimit);
  if (limit.limited) {
    res.setHeader('Retry-After', String(limit.retryAfter));
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return false;
  }

  return true;
}

export function setNoStore(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}
