import axios from 'axios';

const MISP_URL = import.meta.env.VITE_MISP_URL;
const MISP_KEY = import.meta.env.VITE_MISP_KEY;

const apiClient = axios.create({
  baseURL: MISP_URL,
  headers: {
    'Authorization': MISP_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const mispService = {
  // 1. Get total events count / index
  async getEventsIndex(limit = 10, sort = 'date', direction = 'desc') {
    try {
      const response = await apiClient.get(`/events/index?limit=${limit}&sort=${sort}&direction=${direction}`);
      // MISP often returns { response: [...] }
      return response.data.response || response.data;
    } catch (error) {
      console.error('MISP getEventsIndex Error:', error);
      throw error;
    }
  },

  // 2. Search attributes (IOCs)
  async searchAttributes(params) {
    try {
      const response = await apiClient.post('/attributes/restSearch', {
        returnFormat: 'json',
        ...params
      });
      // Handle different formats mentioned by user
      const data = response.data.response || response.data;
      if (data.Attribute) return data.Attribute;
      return data;
    } catch (error) {
      console.error('MISP searchAttributes Error:', error);
      throw error;
    }
  },

  // 3. Get feeds
  async getFeeds() {
    try {
      const response = await apiClient.get('/feeds');
      return response.data.response || response.data;
    } catch (error) {
      console.error('MISP getFeeds Error:', error);
      throw error;
    }
  },

  // 4. Get tags
  async getTags() {
    try {
      const response = await apiClient.get('/tags');
      return response.data.response || response.data;
    } catch (error) {
      console.error('MISP getTags Error:', error);
      throw error;
    }
  },

  // Helper for metrics
  async getMetrics() {
    const last7Days = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
    
    const [events, iocs, critical, feeds] = await Promise.all([
      this.getEventsIndex(100), // Larger set for metrics
      this.searchAttributes({ last: '7d', limit: 1 }), // Just to get count if possible or small set
      this.searchAttributes({ threat_level_id: 1, limit: 1 }),
      this.getFeeds()
    ]);

    return {
      totalEvents: events.length,
      activeIocs: iocs.length, // MISP search results length
      criticalEvents: critical.length,
      activeFeeds: feeds.filter(f => f.enabled).length
    };
  }
};
