import axios from 'axios';
import https from 'https';

const ALLOWED_METHODS = new Set(['GET', 'POST']);
const BLOCKED_PATH_PATTERNS = [
  /\.\./,
  /^\/?admin\b/i,
  /^\/?servers\b/i,
  /^\/?users\b/i,
  /^\/?auth_keys\b/i,
  /^\/?logs\b/i,
];
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(www\.)?sibukpatuh\.net$/i,
  /^https:\/\/sibukpatuh\.vercel\.app$/i,
  /^http:\/\/localhost(?::\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/i,
];

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

function sanitizeProxyPath(path) {
  const cleanPath = String(path || '').trim();

  if (!cleanPath || cleanPath.length > 300 || BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(cleanPath))) {
    return null;
  }

  return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
}

/**
 * Vercel Serverless Function: MISP API Proxy
 * Handles CORS, SSL bypass for internal instances, and secure API Key storage.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const origin = getRequestOrigin(req.headers);
  if (!origin || !isAllowedOrigin(origin)) {
    return res.status(403).json({ error: 'Forbidden. Invalid Origin.' });
  }

  const { path, method = 'GET', data = {} } = req.body || {};

  const MISP_URL = process.env.MISP_URL;
  const MISP_KEY = process.env.MISP_KEY;

  if (!MISP_URL || !MISP_KEY) {
    return res.status(500).json({ error: "MISP service is not configured." });
  }

  const cleanPath = sanitizeProxyPath(path);
  const cleanMethod = String(method || 'GET').toUpperCase();

  if (!cleanPath) {
    return res.status(400).json({ error: "Invalid API path." });
  }

  if (!ALLOWED_METHODS.has(cleanMethod)) {
    return res.status(405).json({ error: "Method not allowed." });
  }

  // Create Axios instance with SSL bypass (common for internal MISP)
  const misp = axios.create({
    baseURL: MISP_URL.replace(/\/$/, ''),
    headers: {
      'Authorization': MISP_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false // Allow self-signed certificates
    })
  });

  try {
    let response;

    if (cleanMethod === 'POST') {
      response = await misp.post(cleanPath, data);
    } else {
      response = await misp.get(cleanPath, { params: req.query });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("MISP Proxy Error:", error.response?.status || error.message);
    
    const statusCode = error.response?.status || 500;
    const safeStatusCode = statusCode >= 400 && statusCode < 500 ? statusCode : 502;
    
    return res.status(safeStatusCode).json({ error: "MISP request failed." });
  }
}
