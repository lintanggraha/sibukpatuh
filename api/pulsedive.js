/**
 * Vercel Serverless Function: Pulsedive IOC Intelligence Proxy
 * Provides detailed intelligence for IPs, Domains, and URLs.
 */
export default async function handler(req, res) {
  const { indicator } = req.query;

  if (!indicator) {
    return res.status(400).json({ success: false, error: "Indicator is required" });
  }

  const PULSEDIVE_KEY = process.env.PULSEDIVE_KEY;
  // Pulsedive allows some unauthenticated requests but with lower limits
  const apiUrl = `https://pulsedive.com/api/info.php?indicator=${encodeURIComponent(indicator)}&pretty=1${PULSEDIVE_KEY ? `&key=${PULSEDIVE_KEY}` : ''}`;

  try {
    const response = await fetch(apiUrl);
    
    if (response.status === 429) {
      return res.status(429).json({ success: false, error: "Rate limit exceeded on Pulsedive." });
    }

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: "Pulsedive API is currently unavailable." });
    }

    const data = await response.json();

    if (data.error) {
      return res.status(404).json({ success: false, error: data.error });
    }

    // Standardize the response for the frontend
    return res.status(200).json({
      success: true,
      data: {
        indicator: data.indicator,
        risk: data.risk, // none, low, medium, high, critical
        risk_recommended: data.risk_recommended,
        threats: data.threats || [],
        feeds: data.feeds || [],
        attributes: data.attributes || {},
        properties: data.properties || {},
        // Deep properties for specific requested fields
        dns: data.attributes?.dns || null,
        whois: data.attributes?.whois || null,
        ssl: data.attributes?.ssl || null,
        geo: data.attributes?.geo || null
      }
    });

  } catch (error) {
    console.error("Pulsedive Proxy Error:", error.message);
    return res.status(500).json({ success: false, error: "Unexpected server error." });
  }
}
