export default async function handler(req, res) {
  try {
    const url = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SibukPatuh-Intelligence-Center/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`CISA API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Add cache headers for Vercel
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json(data);
  } catch (error) {
    console.error("CISA Proxy Error:", error.message);
    return res.status(502).json({ 
      error: "Failed to fetch data from CISA", 
      message: error.message 
    });
  }
}
