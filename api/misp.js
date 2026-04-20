import axios from 'axios';
import https from 'https';

/**
 * Vercel Serverless Function: MISP API Proxy
 * Handles CORS, SSL bypass for internal instances, and secure API Key storage.
 */
export default async function handler(req, res) {
  const { path, method = 'GET', data = {} } = req.body;

  const MISP_URL = process.env.MISP_URL || process.env.VITE_MISP_URL;
  const MISP_KEY = process.env.MISP_KEY || process.env.VITE_MISP_KEY;

  if (!MISP_URL || !MISP_KEY) {
    return res.status(500).json({ error: "MISP_URL or MISP_KEY environment variables are not configured." });
  }

  if (!path) {
    return res.status(400).json({ error: "API path is required in the request body." });
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
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    if (method.toUpperCase() === 'POST') {
      response = await misp.post(cleanPath, data);
    } else {
      response = await misp.get(cleanPath, { params: req.query });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("MISP Proxy Error:", error.response?.data || error.message);
    
    const statusCode = error.response?.status || 500;
    const errorData = error.response?.data || { error: "Failed to connect to MISP instance." };
    
    return res.status(statusCode).json(errorData);
  }
}
