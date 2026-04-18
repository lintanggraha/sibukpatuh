const axios = require('axios');

module.exports = async (req, res) => {
  const { path = 'taxii2' } = req.query;
  const baseUrl = 'https://attack-taxii.mitre.org';
  
  try {
    const targetUrl = `${baseUrl}/${path}`;
    const response = await axios.get(targetUrl, {
      headers: {
        'Accept': 'application/taxii+json;version=2.1',
      },
      timeout: 10000
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('MITRE Proxy Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch from MITRE TAXII',
      detail: error.message
    });
  }
};
