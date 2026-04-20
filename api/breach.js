export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

  if (!RAPIDAPI_KEY) {
    return res.status(500).json({ error: 'API Configuration Error (Missing Key)' });
  }

  try {
    const response = await fetch(`https://breachdirectory.p.rapidapi.com/?func=auto&term=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'breachdirectory.p.rapidapi.com'
      }
    });

    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'API Response Error' });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Breach API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
