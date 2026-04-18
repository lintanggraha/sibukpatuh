<template>
  <div class="tif-page">
    <!-- Header: Global Threat Overview -->
    <header class="tif-header">
      <div class="tif-header-main">
        <div class="tif-brand">
          <div class="tif-icon-box">
            <i class="fas fa-shield-virus"></i>
          </div>
          <div>
            <span class="tif-kicker">Cyber Threat Intelligence</span>
            <h1 class="tif-title">Threat Intel Command</h1>
          </div>
        </div>
        <div class="tif-header-actions">
          <button class="btn btn-premium-outline" @click="loadFeed" :disabled="loading">
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
            Refresh Intelligence
          </button>
          <form class="tif-key-toggle" @submit.prevent="saveApiKey">
            <input
              v-model="apiKeyDraft"
              type="password"
              class="form-control-premium"
              placeholder="OTX Key (Local)"
              autocomplete="off"
            >
            <button type="submit" class="btn btn-premium-dark">Apply</button>
          </form>
        </div>
      </div>

      <div class="tif-summary-grid">
        <div class="tif-summary-card">
          <label>Active Pulses</label>
          <div class="tif-stat">
            <span class="tif-number">{{ formatNumber(resultCount || pulses.length) }}</span>
            <span class="tif-trend up"><i class="fas fa-arrow-up"></i> Live</span>
          </div>
          <p>Intelligence reports from OTX search results.</p>
        </div>
        <div class="tif-summary-card">
          <label>Total Indicators</label>
          <div class="tif-stat">
            <span class="tif-number">{{ formatNumber(totalIndicators) }}</span>
          </div>
          <p>Unique IOCs identified in the current feed.</p>
        </div>
        <div class="tif-summary-card">
          <label>Threat Contexts</label>
          <div class="tif-stat">
            <span class="tif-number">{{ formatNumber(uniqueTagCount) }}</span>
          </div>
          <p>Distinct malware families and actor tags.</p>
        </div>
        <div class="tif-summary-card">
          <label>Intelligence Freshness</label>
          <div class="tif-stat">
            <span class="tif-number">{{ lastUpdatedLabel }}</span>
          </div>
          <p>Most recent modification in the dataset.</p>
        </div>
      </div>
    </header>

    <!-- Navigation & Search Toolbar -->
    <nav class="tif-nav-toolbar">
      <div class="tif-search-group">
        <i class="fas fa-search"></i>
        <input
          v-model="queryDraft"
          type="text"
          placeholder="Search ransomware, APT, CVE-2024..."
          @keyup.enter="applySearch"
        >
        <button @click="applySearch" class="btn-search-trigger">Execute Search</button>
      </div>
      <div class="tif-quick-filters">
        <button
          v-for="preset in presets"
          :key="preset"
          class="tif-nav-link"
          :class="{ active: query.toLowerCase() === preset.toLowerCase() }"
          @click="usePreset(preset)"
        >
          {{ preset }}
        </button>
      </div>
    </nav>

    <div class="tif-main-layout">
      <!-- Left: Investigative Workbenches -->
      <aside class="tif-sidebar">
        <div class="tif-section-label">Investigative Workbenches</div>
        
        <!-- Workbench: IOC Lookup -->
        <div class="tif-workbench">
          <div class="tif-wb-head">
            <i class="fas fa-search-location"></i>
            <h3>IOC Lookup</h3>
          </div>
          <form class="tif-wb-form" @submit.prevent="lookupIoc">
            <input v-model="iocInput" placeholder="IPv4 or Hostname..." class="form-control-premium">
            <button type="submit" :disabled="iocLoading"><i class="fas fa-bolt"></i></button>
          </form>
          
          <div v-if="iocLoading" class="tif-wb-loading"><i class="fas fa-spinner fa-spin"></i></div>
          <div v-else-if="iocResult" class="tif-wb-result">
            <div class="tif-wb-pill">
              <label>{{ iocResult.typeTitle }}</label>
              <strong>{{ iocResult.indicator }}</strong>
            </div>
            <div class="tif-wb-meta">
              <span><i class="fas fa-globe"></i> {{ iocResult.locationLabel || 'N/A' }}</span>
              <span><i class="fas fa-shield-alt"></i> {{ iocResult.pulseCount }} Pulses</span>
            </div>
            <div class="tif-wb-actions">
              <button class="btn-tiny" @click="useIocForGeo" v-if="iocResult.typeKey === 'IPv4'">Workbench</button>
              <button class="btn-tiny" @click="useIocForWhois" v-if="iocResult.typeKey === 'hostname'">Whois</button>
            </div>
          </div>
        </div>

        <!-- Workbench: File Intel -->
        <div class="tif-workbench">
          <div class="tif-wb-head">
            <i class="fas fa-fingerprint"></i>
            <h3>File Intel</h3>
          </div>
          <form class="tif-wb-form" @submit.prevent="lookupHash">
            <input v-model="hashInput" placeholder="MD5, SHA1, SHA256..." class="form-control-premium">
            <button type="submit" :disabled="hashLoading"><i class="fas fa-search-plus"></i></button>
          </form>
          <div v-if="hashLoading" class="tif-wb-loading"><i class="fas fa-spinner fa-spin"></i></div>
          <div v-else-if="hashResult" class="tif-wb-result">
            <div class="tif-wb-pill danger">
              <label>File Hash</label>
              <strong class="truncate">{{ hashResult.indicator }}</strong>
            </div>
            <div class="tif-wb-meta">
              <span>{{ hashResult.pulseCount }} Pulses found</span>
            </div>
          </div>
        </div>

        <!-- Subscribed Feed Widget -->
        <div class="tif-widget">
          <div class="tif-widget-head">
            <h3>Subscribed Feed</h3>
            <button @click="loadSubscribedFeed" :disabled="subscribedLoading">
              <i class="fas fa-sync" :class="{ 'fa-spin': subscribedLoading }"></i>
            </button>
          </div>
          <div class="tif-widget-body">
            <div v-if="subscribedPulses.length" class="tif-widget-list">
              <div v-for="pulse in subscribedPulses.slice(0, 3)" :key="pulse.id" class="tif-widget-item">
                <strong>{{ pulse.name }}</strong>
                <span>{{ formatDate(pulse.modified) }}</span>
              </div>
            </div>
            <div v-else class="tif-widget-empty">No active subscriptions.</div>
          </div>
        </div>
      </aside>

      <!-- Center: Intelligence Feed -->
      <main class="tif-content">
        <div v-if="loading" class="tif-loading-feed">
          <div class="tif-loader-box">
            <i class="fas fa-satellite fa-spin"></i>
            <p>Gathering signals from OTX network...</p>
          </div>
        </div>
        
        <div v-else-if="error" class="tif-error-feed">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Signal Lost</h3>
          <p>{{ error }}</p>
          <button @click="loadFeed" class="btn btn-premium-dark">Retry Connection</button>
        </div>

        <div v-else class="tif-feed-grid">
          <div class="tif-feed-controls">
            <h2>Latest Pulses</h2>
            <div class="tif-pagination-mini">
              <button :disabled="page <= 1" @click="goPage(page - 1)"><i class="fas fa-chevron-left"></i></button>
              <span>Page {{ page }}</span>
              <button :disabled="!hasNextPage" @click="goPage(page + 1)"><i class="fas fa-chevron-right"></i></button>
            </div>
          </div>

          <div class="tif-pulse-cards">
            <article
              v-for="pulse in pulses"
              :key="pulse.id"
              class="tif-pulse-card"
              :class="{ active: activePulseId === pulse.id }"
              @click="activePulseId = pulse.id"
            >
              <div class="tif-card-header">
                <span class="tif-tlp" :class="pulse.tlp.toLowerCase()">{{ pulse.tlp }}</span>
                <span class="tif-ioc-count">{{ pulse.indicatorCount }} IOCs</span>
              </div>
              <h3 class="tif-card-title">{{ pulse.name }}</h3>
              <p class="tif-card-desc">{{ pulse.description || 'No summary available.' }}</p>
              <div class="tif-card-tags">
                <span v-for="tag in pulse.tags.slice(0, 3)" :key="tag" class="tif-tag-mini">{{ tag }}</span>
                <span v-if="pulse.tags.length > 3" class="tif-tag-more">+{{ pulse.tags.length - 3 }}</span>
              </div>
              <div class="tif-card-footer">
                <span><i class="fas fa-user-circle"></i> {{ pulse.author }}</span>
                <span><i class="fas fa-history"></i> {{ formatDate(pulse.modified, { month: 'short', day: 'numeric' }) }}</span>
              </div>
            </article>
          </div>
        </div>
      </main>

      <!-- Right: Intelligence Inspector -->
      <section class="tif-inspector" :class="{ empty: !activePulse }">
        <div v-if="!activePulse" class="tif-inspector-empty">
          <i class="fas fa-crosshairs"></i>
          <p>Select a pulse to analyze its details, indicators, and threat context.</p>
        </div>
        <div v-else class="tif-inspector-panel">
          <div class="tif-ins-header" :class="activePulse.tlp.toLowerCase()">
            <div class="tif-ins-tlp-bar"></div>
            <div class="tif-ins-title-box">
              <small>Pulse Analysis</small>
              <h2>{{ activePulse.name }}</h2>
            </div>
            <div class="tif-ins-badge-grid">
              <div class="tif-ins-badge">
                <label>TLP</label>
                <strong>{{ activePulse.tlp }}</strong>
              </div>
              <div class="tif-ins-badge">
                <label>Indicators</label>
                <strong>{{ activePulse.indicatorCount }}</strong>
              </div>
            </div>
          </div>

          <div class="tif-ins-body">
            <!-- Section: Threat Context -->
            <div class="tif-ins-section">
              <div class="tif-ins-label">Threat Context</div>
              <div class="tif-ins-context-grid">
                <div class="tif-ins-context-item">
                  <label>Adversary</label>
                  <strong>{{ activePulse.adversary || 'Unknown' }}</strong>
                </div>
                <div class="tif-ins-context-item">
                  <label>Malware</label>
                  <div class="tif-ins-tags">
                    <span v-for="m in activePulse.malwareFamilies" :key="m" class="tif-ins-tag-soft">{{ m }}</span>
                    <span v-if="!activePulse.malwareFamilies.length" class="tif-muted">-</span>
                  </div>
                </div>
                <div class="tif-ins-context-item">
                  <label>Industries</label>
                  <div class="tif-ins-tags">
                    <span v-for="i in activePulse.industries" :key="i" class="tif-ins-tag-soft teal">{{ i }}</span>
                    <span v-if="!activePulse.industries.length" class="tif-muted">-</span>
                  </div>
                </div>
                <div class="tif-ins-context-item">
                  <label>Targeted</label>
                  <strong>{{ activePulse.targetCountries.join(', ') || 'Global' }}</strong>
                </div>
              </div>
            </div>

            <!-- Section: Top Indicators -->
            <div class="tif-ins-section">
              <div class="tif-ins-label">Top Indicators of Compromise</div>
              <div class="tif-ins-ioc-list">
                <div v-for="ioc in activeIndicators" :key="ioc.key" class="tif-ins-ioc-row">
                  <span class="tif-ioc-type">{{ ioc.type }}</span>
                  <code class="tif-ioc-value">{{ ioc.value }}</code>
                  <button class="btn-ioc-copy" @click="copyToClipboard(ioc.value)"><i class="fas fa-copy"></i></button>
                </div>
                <div v-if="!activeIndicators.length" class="tif-ins-empty-small">No indicators in summary.</div>
              </div>
            </div>

            <!-- Section: Description -->
            <div class="tif-ins-section">
              <div class="tif-ins-label">Intel Summary</div>
              <p class="tif-ins-desc">{{ activePulse.description || 'Detailed technical summary is not available for this pulse.' }}</p>
            </div>

            <!-- Section: References -->
            <div class="tif-ins-section">
              <div class="tif-ins-label">References & Sources</div>
              <div class="tif-ins-refs">
                <a v-for="ref in activePulse.references" :key="ref" :href="ref" target="_blank" class="tif-ins-ref-link">
                  <i class="fas fa-link"></i>
                  {{ getHost(ref) }}
                </a>
                <span v-if="!activePulse.references.length" class="tif-muted">No external references.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
const API_KEY_STORAGE = "sibukpatuh.otxApiKey";
const OTX_ORIGIN = "https://otx.alienvault.com";

export default {
  name: "ThreatFeed",
  data() {
    return {
      apiKey: "",
      apiKeyDraft: "",
      authMode: "unknown",
      sourceLabel: "OTX API via proxy",

      query: "ransomware",
      queryDraft: "ransomware",
      page: 1,
      limit: 10,
      resultCount: 0,
      hasNextPage: false,
      pulses: [],
      activePulseId: "",
      loading: false,
      error: "",
      presets: ["ransomware", "phishing", "APT", "CVE", "banking trojan", "indonesia"],

      iocInput: "",
      iocLoading: false,
      iocError: "",
      iocResult: null,

      geoInput: "",
      geoLoading: false,
      geoError: "",
      geoResult: null,

      hashInput: "",
      hashLoading: false,
      hashError: "",
      hashResult: null,

      whoisInput: "",
      whoisLoading: false,
      whoisError: "",
      whoisResult: null,
      whoisIndicatorType: "hostname",

      indonesiaLoading: false,
      indonesiaError: "",
      indonesiaPulses: [],
      indonesiaCount: 0,

      subscribedLoading: false,
      subscribedError: "",
      subscribedPulses: [],
      subscribedCount: 0,
    };
  },
  computed: {
    activePulse() {
      return this.pulses.find((pulse) => pulse.id === this.activePulseId) || this.pulses[0] || null;
    },
    totalIndicators() {
      return this.pulses.reduce((total, pulse) => total + (pulse.indicatorCount || 0), 0);
    },
    uniqueTagCount() {
      return new Set(this.pulses.flatMap((pulse) => pulse.tags)).size;
    },
    topTags() {
      return this.buildTopTags(this.pulses);
    },
    indonesiaTopTags() {
      return this.buildTopTags(this.indonesiaPulses).slice(0, 8);
    },
    subscribedTopTags() {
      return this.buildTopTags(this.subscribedPulses).slice(0, 8);
    },
    lastUpdatedLabel() {
      const dates = this.pulses
        .map((pulse) => new Date(pulse.modified).getTime())
        .filter((time) => Number.isFinite(time));

      if (!dates.length) {
        return "-";
      }

      return this.formatDate(new Date(Math.max(...dates)).toISOString(), { month: "short", day: "numeric" });
    },
    activeIndicators() {
      if (!this.activePulse) {
        return [];
      }

      return this.activePulse.indicators.slice(0, 12).map((indicator, index) => ({
        key: `${indicator.type}-${indicator.value}-${index}`,
        type: indicator.type || "indicator",
        value: indicator.value || "-",
      }));
    },
    authModeLabel() {
      if (this.authMode === "server-env") return "Server API";
      if (this.authMode === "client-header") return "Local Key";
      return "No Auth";
    }
  },
  mounted() {
    this.apiKey = window.localStorage.getItem(API_KEY_STORAGE) || "";
    this.apiKeyDraft = this.apiKey;
    this.loadFeed();
    this.loadSubscribedFeed();
  },
  methods: {
    async loadFeed() {
      this.loading = true;
      this.error = "";

      try {
        const payload = await this.fetchPulseFeed({
          feed: "search",
          query: this.query,
          page: this.page,
          limit: this.limit,
        });

        this.resultCount = Number(payload.count) || 0;
        this.hasNextPage = Boolean(payload.next);
        this.pulses = payload.pulses;
        this.activePulseId = this.pulses[0]?.id || "";
      } catch (error) {
        this.error = this.toFriendlyError(error);
        this.pulses = [];
        this.resultCount = 0;
        this.hasNextPage = false;
      } finally {
        this.loading = false;
      }
    },
    async loadSubscribedFeed() {
      this.subscribedLoading = true;
      this.subscribedError = "";

      try {
        const payload = await this.fetchPulseFeed({
          feed: "subscribed",
          limit: 6,
        });

        this.subscribedCount = Number(payload.count) || payload.pulses.length;
        this.subscribedPulses = payload.pulses.slice(0, 6);
      } catch (error) {
        this.subscribedError = this.toFriendlyError(error);
        this.subscribedCount = 0;
        this.subscribedPulses = [];
      } finally {
        this.subscribedLoading = false;
      }
    },
    async fetchPulseFeed({ feed = "search", query = "", page = 1, limit = 10 } = {}) {
      const params = new URLSearchParams({
        mode: "pulses",
        feed,
      });

      if (feed === "search") {
        params.set("q", query || "ransomware");
        params.set("page", String(page));
        params.set("limit", String(limit));
      }

      const payload = await this.requestJson(`/api/otx?${params.toString()}`, this.buildRequestHeaders());
      const normalized = this.normalizePulseFeedPayload(payload);
      return normalized;
    },
    async fetchIndicator({ indicatorType, value, section }) {
      const params = new URLSearchParams({
        mode: "indicator",
        indicatorType,
        value,
        section,
      });

      const payload = await this.requestJson(`/api/otx?${params.toString()}`, this.buildRequestHeaders());
      return payload;
    },
    async requestJson(url, headers) {
      const response = await fetch(url, { headers });
      const authMode = response.headers.get("x-sibukpatuh-otx-auth-mode");
      const text = await response.text();
      let payload = null;

      if (authMode) this.authMode = authMode;

      if (text) {
        try {
          payload = JSON.parse(text);
        } catch (error) {
          throw new Error(`Invalid response from ${url}.`);
        }
      }

      if (!response.ok) {
        const detail = payload?.detail || payload?.error || payload?.message || response.statusText;
        throw new Error(`HTTP ${response.status}: ${detail}`);
      }

      return payload;
    },
    buildRequestHeaders() {
      const headers = { Accept: "application/json" };
      if (this.apiKey) {
        headers["X-OTX-API-KEY"] = this.apiKey;
        this.authMode = "client-header";
      }
      return headers;
    },
    async lookupIoc() {
      const value = this.normalizeLookupValue(this.iocInput);
      const indicatorType = this.detectIocType(value);
      if (!indicatorType) return;
      this.iocLoading = true;
      try {
        const payload = await this.fetchIndicator({ indicatorType, value, section: "general" });
        this.iocResult = this.normalizeGeneralIndicator(payload, indicatorType);
      } catch (error) {
        this.iocError = this.toFriendlyError(error);
      } finally {
        this.iocLoading = false;
      }
    },
    async lookupHash() {
      const value = String(this.hashInput || "").trim();
      const hashType = this.detectHashType(value);
      if (!hashType) return;
      this.hashLoading = true;
      try {
        const [generalPayload, analysisPayload] = await Promise.all([
          this.fetchIndicator({ indicatorType: "file", value, section: "general" }),
          this.fetchIndicator({ indicatorType: "file", value, section: "analysis" }),
        ]);
        this.hashResult = this.normalizeHashIntel({ generalPayload, analysisPayload, fallbackType: hashType });
      } catch (error) {
        this.hashError = this.toFriendlyError(error);
      } finally {
        this.hashLoading = false;
      }
    },
    useIocForGeo() {
      if (!this.iocResult?.indicator) return;
      this.geoInput = this.iocResult.indicator;
    },
    useIocForWhois() {
      if (!this.iocResult?.indicator) return;
      this.whoisInput = this.iocResult.indicator;
    },
    normalizePulseFeedPayload(payload) {
      const directItems = Array.isArray(payload)
        ? payload
        : this.asArray(payload?.results?.length ? payload.results : payload?.results || payload?.pulses || payload?.items);
      const pulses = this.normalizePulses(directItems);
      return { count: Number(payload?.count) || pulses.length, next: payload?.next || null, pulses };
    },
    normalizeGeneralIndicator(payload, fallbackType) {
      const pulses = this.normalizePulses(this.asArray(payload?.pulse_info?.pulses)).slice(0, 4);
      return {
        indicator: String(payload?.indicator || payload?.domain || "").trim() || "-",
        typeKey: String(payload?.type || fallbackType || "").trim(),
        typeTitle: String(payload?.type_title || payload?.type || fallbackType || "").trim() || "-",
        pulseCount: Number(payload?.pulse_info?.count) || pulses.length,
        locationLabel: [payload?.city, payload?.region, payload?.country_name].filter(Boolean).join(", "),
        pulses,
      };
    },
    normalizeHashIntel({ generalPayload, fallbackType }) {
      const general = this.normalizeGeneralIndicator(generalPayload, fallbackType);
      return { ...general };
    },
    normalizePulses(results) {
      return results.map((pulse, index) => {
        const indicators = this.asArray(pulse.indicators).map((i) => ({
          type: i.type || i.indicator_type || "indicator",
          value: i.indicator || i.value || "",
        })).filter(i => i.value);
        return {
          id: String(pulse.id || pulse.pulse_id || index),
          name: pulse.name || "Untitled Pulse",
          description: pulse.description || "",
          author: pulse.author_name || "OTX",
          modified: pulse.modified || pulse.created || "",
          tlp: String(pulse.tlp || "WHITE").toUpperCase(),
          tags: this.asArray(pulse.tags).map(String),
          references: this.asArray(pulse.references).map(String),
          indicators,
          indicatorCount: Number(pulse.indicator_count || indicators.length),
          adversary: Array.isArray(pulse.adversary) ? pulse.adversary.join(", ") : pulse.adversary || "",
          malwareFamilies: this.asArray(pulse.malware_families),
          industries: this.asArray(pulse.industries),
          targetCountries: this.asArray(pulse.targeted_countries),
        };
      });
    },
    detectIocType(v) {
      if (/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(v)) return "IPv4";
      if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(v)) return "hostname";
      return "";
    },
    detectHashType(v) {
      if (/^[a-f0-9]{32}$/i.test(v)) return "MD5";
      if (/^[a-f0-9]{40}$/i.test(v)) return "SHA1";
      if (/^[a-f0-9]{64}$/i.test(v)) return "SHA256";
      return "";
    },
    normalizeLookupValue(v) { return String(v || "").trim(); },
    asArray(v) { return Array.isArray(v) ? v : []; },
    applySearch() {
      this.query = this.queryDraft || "ransomware";
      this.page = 1;
      this.loadFeed();
    },
    usePreset(p) {
      this.query = p;
      this.queryDraft = p;
      this.page = 1;
      this.loadFeed();
    },
    goPage(p) {
      this.page = p;
      this.loadFeed();
    },
    saveApiKey() {
      this.apiKey = this.apiKeyDraft.trim();
      if (this.apiKey) window.localStorage.setItem(API_KEY_STORAGE, this.apiKey);
      else window.localStorage.removeItem(API_KEY_STORAGE);
      this.loadFeed();
    },
    formatDate(v, opts = {}) {
      if (!v) return "-";
      const d = new Date(v);
      return isNaN(d) ? "-" : new Intl.DateTimeFormat("en-US", { year: 'numeric', month: 'short', day: 'numeric', ...opts }).format(d);
    },
    formatNumber(v) { return new Intl.NumberFormat().format(v || 0); },
    getHost(v) { try { return new URL(v).hostname; } catch { return v; } },
    toFriendlyError(e) { return e.message || "Failed to fetch intelligence."; },
    copyToClipboard(t) { navigator.clipboard.writeText(t); }
  }
};
</script>

<style scoped>
:root {
  --tif-teal: #0f766e;
  --tif-teal-dark: #134e4a;
  --tif-teal-soft: rgba(15, 118, 110, 0.1);
  --tif-danger: #b91c1c;
  --tif-bg: #f8fafc;
  --tif-border: rgba(15, 23, 42, 0.08);
  --tif-glass: rgba(255, 255, 255, 0.85);
}

.tif-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--tif-bg);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* Header & Summary */
.tif-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tif-header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tif-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tif-icon-box {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f766e, #134e4a);
  border-radius: 12px;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(15, 118, 110, 0.3);
}

.tif-kicker {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.05em;
}

.tif-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0;
}

.tif-header-actions {
  display: flex;
  gap: 0.75rem;
}

.tif-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.tif-summary-card {
  padding: 1.25rem;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--tif-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.tif-summary-card label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.5rem;
}

.tif-stat {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.tif-number {
  font-size: 1.5rem;
  font-weight: 900;
  color: #0f766e;
}

.tif-trend.up { color: #10b981; font-size: 0.75rem; font-weight: 700; }

.tif-summary-card p {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}

/* Toolbar */
.tif-nav-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--tif-border);
}

.tif-search-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 30rem;
}

.tif-search-group i { color: #94a3b8; }
.tif-search-group input {
  border: none;
  background: none;
  width: 100%;
  font-size: 0.9rem;
  font-weight: 500;
  outline: none;
}

.btn-search-trigger {
  padding: 0.4rem 0.8rem;
  background: #0f766e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.tif-quick-filters {
  display: flex;
  gap: 0.5rem;
}

.tif-nav-link {
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  border: none;
  background: transparent;
  border-radius: 6px;
}

.tif-nav-link.active {
  background: rgba(15, 118, 110, 0.1);
  color: #0f766e;
}

/* Main Layout */
.tif-main-layout {
  display: grid;
  grid-template-columns: 18rem 1fr 22rem;
  gap: 1.25rem;
  align-items: start;
}

/* Sidebar & Workbenches */
.tif-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tif-section-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.tif-workbench, .tif-widget {
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--tif-border);
}

.tif-wb-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tif-wb-head i { color: #0f766e; }
.tif-wb-head h3 { font-size: 0.85rem; font-weight: 800; margin: 0; color: #1e293b; }

.tif-wb-form {
  display: flex;
  gap: 0.4rem;
}

.tif-wb-form button {
  width: 2.25rem;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 6px;
}

.tif-wb-result {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.tif-wb-pill {
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.tif-wb-pill label { font-size: 0.6rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; }
.tif-wb-pill strong { font-size: 0.8rem; color: #1e293b; word-break: break-all; }

.tif-wb-meta { font-size: 0.7rem; color: #64748b; display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.5rem; }

.tif-widget-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.tif-widget-item:last-child { border: none; }
.tif-widget-item strong { display: block; font-size: 0.75rem; color: #1e293b; }
.tif-widget-item span { font-size: 0.65rem; color: #94a3b8; }

/* Content & Feed */
.tif-content {
  min-width: 0;
}

.tif-feed-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tif-feed-controls h2 { font-size: 1rem; font-weight: 900; color: #1e293b; margin: 0; }

.tif-pulse-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tif-pulse-card {
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--tif-border);
  cursor: pointer;
  transition: all 0.2s;
}

.tif-pulse-card:hover { border-color: #0f766e; transform: translateX(4px); }
.tif-pulse-card.active { border-color: #0f766e; background: rgba(15, 118, 110, 0.02); box-shadow: 0 4px 12px rgba(15, 118, 110, 0.08); }

.tif-card-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.tif-tlp { font-size: 0.6rem; font-weight: 900; padding: 0.1rem 0.4rem; border-radius: 4px; }
.tif-tlp.white { background: #e2e8f0; color: #475569; }
.tif-tlp.green { background: #dcfce7; color: #166534; }
.tif-tlp.amber { background: #fef3c7; color: #92400e; }
.tif-tlp.red { background: #fee2e2; color: #991b1b; }

.tif-card-title { font-size: 0.95rem; font-weight: 800; color: #1e293b; margin: 0 0 0.4rem; }
.tif-card-desc { font-size: 0.8rem; color: #64748b; margin: 0 0 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.tif-card-tags { display: flex; gap: 0.35rem; margin-bottom: 0.75rem; }
.tif-tag-mini { font-size: 0.65rem; font-weight: 700; color: #0f766e; background: rgba(15, 118, 110, 0.08); padding: 0.1rem 0.4rem; border-radius: 4px; }

.tif-card-footer { display: flex; gap: 1rem; font-size: 0.7rem; color: #94a3b8; font-weight: 600; }

/* Inspector */
.tif-inspector {
  position: sticky;
  top: 1.5rem;
  height: calc(100vh - 3rem);
  background: white;
  border-radius: 16px;
  border: 1px solid var(--tif-border);
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.tif-inspector-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #94a3b8;
}

.tif-inspector-empty i { font-size: 3rem; margin-bottom: 1rem; opacity: 0.2; }

.tif-ins-header { padding: 1.5rem; position: relative; }
.tif-ins-tlp-bar { position: absolute; top: 0; left: 0; right: 0; height: 6px; }
.tif-ins-header.white .tif-ins-tlp-bar { background: #94a3b8; }
.tif-ins-header.green .tif-ins-tlp-bar { background: #22c55e; }
.tif-ins-header.amber .tif-ins-tlp-bar { background: #f59e0b; }
.tif-ins-header.red .tif-ins-tlp-bar { background: #ef4444; }

.tif-ins-title-box small { font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; }
.tif-ins-title-box h2 { font-size: 1.25rem; font-weight: 900; color: #1e293b; margin: 0.25rem 0 1rem; }

.tif-ins-badge-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.tif-ins-badge { padding: 0.5rem; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
.tif-ins-badge label { font-size: 0.6rem; font-weight: 800; color: #94a3b8; display: block; }
.tif-ins-badge strong { font-size: 0.9rem; font-weight: 900; color: #0f766e; }

.tif-ins-body { padding: 1.5rem; overflow-y: auto; height: calc(100% - 10rem); }
.tif-ins-section { margin-bottom: 1.5rem; }
.tif-ins-label { font-size: 0.75rem; font-weight: 800; color: #1e293b; text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
.tif-ins-label::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }

.tif-ins-context-grid { display: grid; gap: 0.75rem; }
.tif-ins-context-item label { font-size: 0.65rem; font-weight: 700; color: #64748b; display: block; }
.tif-ins-context-item strong { font-size: 0.85rem; color: #1e293b; }

.tif-ins-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.25rem; }
.tif-ins-tag-soft { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; background: #f1f5f9; border-radius: 4px; color: #475569; }
.tif-ins-tag-soft.teal { background: rgba(15, 118, 110, 0.08); color: #0f766e; }

.tif-ins-ioc-list { display: grid; gap: 0.4rem; }
.tif-ins-ioc-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem; background: #f8fafc; border-radius: 6px; }
.tif-ioc-type { font-size: 0.6rem; font-weight: 800; color: #0f766e; background: rgba(15, 118, 110, 0.1); padding: 0.1rem 0.3rem; border-radius: 3px; min-width: 3.5rem; text-align: center; }
.tif-ioc-value { font-size: 0.75rem; color: #1e293b; flex: 1; overflow: hidden; text-overflow: ellipsis; }

.tif-ins-desc { font-size: 0.85rem; color: #475569; line-height: 1.6; }
.tif-ins-ref-link { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #0f766e; text-decoration: none; font-weight: 600; margin-bottom: 0.4rem; }

/* Premium Elements */
.btn-premium-outline {
  background: white;
  border: 1.5px solid #0f766e;
  color: #0f766e;
  font-weight: 700;
  border-radius: 8px;
}

.btn-premium-dark {
  background: #1e293b;
  color: white;
  font-weight: 700;
  border-radius: 8px;
  border: none;
}

.form-control-premium {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  width: 100%;
}

.form-control-premium:focus { border-color: #0f766e; outline: none; box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1); }

@media (max-width: 1200px) {
  .tif-main-layout { grid-template-columns: 18rem 1fr; }
  .tif-inspector { display: none; }
}

@media (max-width: 900px) {
  .tif-main-layout { grid-template-columns: 1fr; }
  .tif-summary-grid { grid-template-columns: 1fr 1fr; }
}
</style>
