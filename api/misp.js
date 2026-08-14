import axios from 'axios';
import { guardRequest } from '../server/security.js';

const ALLOWED_GET_PATHS = [
  /^\/events\/index$/i,
  /^\/events\/view\/[A-Za-z0-9_-]+$/i,
  /^\/feeds$/i,
  /^\/tags$/i,
];
const ALLOWED_POST_PATHS = new Set(['/attributes/restSearch']);

function sanitizePath(path, method) {
  const value = String(path || '').trim();
  if (!value || value.length > 300 || value.includes('..') || /[\\\r\n]/.test(value)) return null;

  const [pathname, query = ''] = value.split('?');
  if (query.length > 200) return null;

  const allowed = method === 'POST'
    ? ALLOWED_POST_PATHS.has(pathname)
    : ALLOWED_GET_PATHS.some((pattern) => pattern.test(pathname));
  if (!allowed) return null;

  return `${pathname}${query ? `?${query}` : ''}`;
}

function isSafeMispUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(url.hostname);
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (!guardRequest(req, res, {
    methods: ['POST'],
    rateLimit: { windowMs: 60_000, max: 20 },
  })) {
    return;
  }

  const mispUrl = String(process.env.MISP_URL || '').trim();
  const mispKey = String(process.env.MISP_KEY || '').trim();
  if (!mispUrl || !mispKey || !isSafeMispUrl(mispUrl)) {
    return res.status(503).json({ error: 'MISP service is not safely configured.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const method = String(body.method || 'GET').toUpperCase();
  if (!['GET', 'POST'].includes(method)) {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const cleanPath = sanitizePath(body.path, method);
  if (!cleanPath) {
    return res.status(400).json({ error: 'Invalid or unauthorized API path.' });
  }

  const data = body.data && typeof body.data === 'object' ? body.data : {};
  if (method === 'POST' && JSON.stringify(data).length > 20_000) {
    return res.status(413).json({ error: 'MISP request payload is too large.' });
  }

  const misp = axios.create({
    baseURL: mispUrl.replace(/\/$/, ''),
    headers: {
      Authorization: mispKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeout: 15_000,
  });

  try {
    const upstream = method === 'POST'
      ? await misp.post(cleanPath, data)
      : await misp.get(cleanPath);
    return res.status(200).json(upstream.data);
  } catch (error) {
    console.error('[MISP] Proxy error:', error.response?.status || error.message);
    const status = error.response?.status;
    return res.status(status >= 400 && status < 500 ? status : 502).json({ error: 'MISP request failed.' });
  }
}
