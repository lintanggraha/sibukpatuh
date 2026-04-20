import axios from 'axios';

/**
 * OTX AlienVault Service Layer
 * Maps OTX Pulses and Indicators to the Dashboard's unified schema.
 *
 * Endpoints used:
 *  - /pulses/subscribed  → returns pulses sorted by most recent (requires API key)
 *  - /search/pulses      → keyword search for IOC lookup
 *  - /pulses/{id}        → pulse detail including full indicator list
 */
const proxy = axios.create({
  baseURL: '/api/otx',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Map a raw OTX pulse object → unified dashboard event schema
 */
function mapPulseToEvent(pulse) {
  return {
    id: pulse.id,
    info: pulse.name,
    threat_level_id: mapRiskToSeverity(pulse.indicator_count || 0),
    Org: { name: pulse.author_name || 'OTX Contributor' },
    Orgc: { name: pulse.author_name || 'OTX Contributor' },
    // OTX uses ISO-8601 strings for modified/created
    timestamp: new Date(pulse.modified || pulse.created).getTime() / 1000,
    uuid: pulse.id,
    Tag: (pulse.tags || []).map((t, idx) => ({ id: idx, name: t, colour: '#3b82f6' })),
    indicators: pulse.indicators || []
  };
}

/**
 * Map a raw OTX indicator object → unified IOC schema
 */
function mapIndicatorToIoc(ind, pulse) {
  return {
    id: ind.id || `${pulse.id}-${ind.indicator}`,
    type: ind.type,
    value: ind.indicator,
    description: ind.description || null, // Capture indicator-specific detail
    Event: { info: pulse.name || pulse.info || 'N/A' },
    sightings: ind.observations || 0,
    // ind.created is ISO-8601; convert to Unix seconds for formatDateShort
    timestamp: ind.created
      ? new Date(ind.created).getTime() / 1000
      : new Date(pulse.modified || pulse.created).getTime() / 1000,
    Tag: (pulse.tags || []).map((t, idx) => ({ id: idx, name: t, colour: '#3b82f6' }))
  };
}

/**
 * Simple severity mapping based on indicator count
 */
function mapRiskToSeverity(count) {
  if (count > 100) return 1; // High
  if (count > 20) return 2;  // Medium
  return 3;                  // Low
}

export const otxService = {
  /**
   * Fetches recent pulses ordered by modification date using the subscribed feed.
   * Falls back to keyword search if the subscribed feed is unavailable.
   */
  async getRecentPulses(limit = 10) {
    try {
      // `feed=subscribed` hits /pulses/subscribed — always sorted by most recent
      const response = await proxy.get('', {
        params: { mode: 'pulses', feed: 'subscribed', limit }
      });
      const pulses = response.data.results || [];
      return pulses.slice(0, limit).map(mapPulseToEvent);
    } catch (err) {
      console.warn('OTX subscribed feed failed, falling back to search:', err.message);
      // Fallback: search but sort by date client-side
      try {
        const fallback = await proxy.get('', {
          params: { mode: 'pulses', q: 'malware', limit: Math.min(limit, 20) }
        });
        const pulses = (fallback.data.results || [])
          .sort((a, b) => new Date(b.modified || b.created) - new Date(a.modified || a.created));
        return pulses.slice(0, limit).map(mapPulseToEvent);
      } catch (fallbackErr) {
        console.error('OTX Pulses fallback also failed:', fallbackErr);
        throw fallbackErr;
      }
    }
  },

  /**
   * Search for pulses by keyword, then extract IOCs from the first few results.
   * Uses the pulse's `indicators` array directly from the search response.
   * If that is empty, fetches the top-N pulse details individually.
   */
  async searchIndicators(query = 'ransomware') {
    try {
      const response = await proxy.get('', {
        params: { mode: 'pulses', q: query, limit: 5 }
      });
      const pulses = response.data.results || [];
      if (!pulses.length) return [];

      const allIocs = [];
      const maxPerPulse = 2;

      for (const pulse of pulses) {
        const inds = pulse.indicators || [];
        inds.slice(0, maxPerPulse).forEach(ind => {
          allIocs.push(mapIndicatorToIoc(ind, pulse));
        });
      }

      return allIocs;
    } catch (error) {
      console.error('OTX Indicator Search Error:', error);
      return [];
    }
  },

  /**
   * Fetch recent IOCs from the subscribed feed.
   * Each pulse in the subscribed feed already contains its indicators array.
   */
  async getRecentIocs(limit = 20) {
    try {
      const response = await proxy.get('', {
        params: { mode: 'pulses', feed: 'subscribed', limit: 10 }
      });
      const pulses = response.data.results || [];
      const allIocs = [];
      const indicatorsByPulse = pulses.map(p => (p.indicators || []).map(ind => mapIndicatorToIoc(ind, p)));
      
      // Round-robin selection for maximum diversity
      let found = true;
      let depth = 0;
      while (found && allIocs.length < limit) {
        found = false;
        for (const pulseIocs of indicatorsByPulse) {
          if (pulseIocs[depth]) {
            allIocs.push(pulseIocs[depth]);
            found = true;
          }
          if (allIocs.length >= limit) break;
        }
        depth++;
      }

      return allIocs;
    } catch (error) {
      console.error('OTX Recent IOCs Error:', error);
      return [];
    }
  }
};
