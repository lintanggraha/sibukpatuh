import axios from 'axios';

/**
 * MISP Service Layer
 * Now uses the backend proxy (/api/misp) to avoid CORS issues 
 * and handle SSL certificate verification.
 */
const proxy = axios.create({
  baseURL: '/api/misp',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const mispService = {
  /**
   * Universal proxy caller
   */
  async callProxy(path, method = 'GET', data = {}) {
    try {
      const response = await proxy.post('', { path, method, data });
      return response.data;
    } catch (error) {
      console.error(`MISP Service Error [${path}]:`, error.response?.data || error.message);
      throw error;
    }
  },

  async getEventsIndex(limit = 10) {
    const data = await this.callProxy(`/events/index?limit=${limit}`);
    // MISP index returns an array of { Event: { ... } }
    return (data || []).map(item => item.Event || item);
  },

  async searchAttributes(filters = {}) {
    // attributes/restSearch uses POST
    const data = await this.callProxy('/attributes/restSearch', 'POST', filters);
    // restSearch usually returns { response: [ ... ] } or just [ ... ]
    return data.response ? data.response : data;
  },

  async getFeeds() {
    return await this.callProxy('/feeds');
  },

  async getTags() {
    const data = await this.callProxy('/tags');
    // Returns { Tag: [ ... ] } or [ ... ]
    return data.Tag ? data.Tag : data;
  },

  async getEvent(id) {
    const data = await this.callProxy(`/events/view/${id}`);
    return data.Event || data;
  },

  // Helper for metrics
  async getMetrics() {
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
