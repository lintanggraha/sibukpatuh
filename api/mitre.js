import axios from 'axios';
import { guardRequest } from '../server/security.js';

const BASE_URL = 'https://attack-taxii.mitre.org';

function buildSafeTarget(path) {
  const rawPath = String(path || 'taxii2').trim();
  if (!rawPath || rawPath.length > 200 || rawPath.includes('..') || /[\\\r\n]/.test(rawPath)) return null;

  const target = new URL(rawPath.startsWith('/') ? rawPath : `/${rawPath}`, BASE_URL);
  if (target.origin !== BASE_URL || !target.pathname.startsWith('/taxii2')) return null;
  return target.toString();
}

export default async function handler(req, res) {
  if (!guardRequest(req, res, { methods: ['GET'], rateLimit: { windowMs: 60_000, max: 20 } })) {
    return;
  }

  const targetUrl = buildSafeTarget(req.query?.path);
  if (!targetUrl) {
    return res.status(400).json({ error: 'Invalid MITRE TAXII path.' });
  }

  try {
    const response = await axios.get(targetUrl, {
      headers: { Accept: 'application/taxii+json;version=2.1' },
      timeout: 10_000,
      maxContentLength: 5 * 1024 * 1024,
      maxBodyLength: 5 * 1024 * 1024,
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('[MITRE] Proxy error:', error.response?.status || error.message);
    return res.status(error.response?.status >= 400 && error.response?.status < 500 ? error.response.status : 502)
      .json({ error: 'Failed to fetch from MITRE TAXII.' });
  }
}
