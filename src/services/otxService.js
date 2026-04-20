import axios from 'axios';

/**
 * OTX AlienVault Service Layer
 * Maps OTX Pulses and Indicators to the Dashboard's unified schema.
 */
const proxy = axios.create({
  baseURL: '/api/otx',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const otxService = {
  /**
   * Fetches recent pulses (events)
   */
  async getRecentPulses(limit = 10, query = '') {
    try {
      const response = await proxy.get('', { 
        params: { mode: 'pulses', q: query || 'ransomware', limit } 
      });
      const pulses = response.data.results || [];
      
      return pulses.map(pulse => ({
        id: pulse.id,
        info: pulse.name,
        threat_level_id: this.mapRiskToSeverity(pulse.indicator_count), // Proxy using count
        Org: { name: pulse.author_name || 'OTX Contributor' },
        timestamp: new Date(pulse.created).getTime() / 1000,
        uuid: pulse.id,
        Tag: (pulse.tags || []).map((t, idx) => ({ id: idx, name: t, colour: '#3b82f6' })),
        indicators: pulse.indicators || []
      }));
    } catch (error) {
      console.error("OTX Pulses Error:", error);
      throw error;
    }
  },

  /**
   * Search indicators (IOCs)
   */
  async searchIndicators(query) {
    try {
      // OTX searching is usually pulse-based or indicator-based.
      // We'll search pulses and extract indicators for the "IOC List"
      const pulses = await this.getRecentPulses(5, query);
      const allIndicators = [];
      
      pulses.forEach(pulse => {
        if (pulse.indicators) {
          pulse.indicators.slice(0, 5).forEach(ind => {
            allIndicators.push({
              id: ind.id,
              type: ind.type,
              value: ind.indicator,
              Event: { info: pulse.info },
              sightings: ind.observations || 0,
              timestamp: pulse.timestamp,
              Tag: pulse.Tag
            });
          });
        }
      });
      
      return allIndicators;
    } catch (error) {
      console.error("OTX Indicator Search Error:", error);
      return [];
    }
  },

  /**
   * Simple mapping for OTX to dashboard severity
   */
  mapRiskToSeverity(count) {
    if (count > 100) return 1; // High
    if (count > 20) return 2;  // Medium
    return 3; // Low
  }
};
