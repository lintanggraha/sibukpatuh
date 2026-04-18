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
          <button class="btn btn-premium-small" @click="loadFeed" :disabled="loading">
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
            Refresh
          </button>
        </div>
      </div>

      <div class="tif-summary-grid">
        <div class="tif-summary-card">
          <label>Active Pulses</label>
          <div class="tif-stat">
            <span class="tif-number">{{ formatNumber(resultCount || pulses.length) }}</span>
            <span class="tif-trend up"><i class="fas fa-arrow-up"></i> Live</span>
          </div>
          <p>Reports from OTX network.</p>
        </div>
        <div class="tif-summary-card">
          <label>Total Indicators</label>
          <div class="tif-stat">
            <span class="tif-number">{{ formatNumber(totalIndicators) }}</span>
          </div>
          <p>Unique IOCs identified.</p>
        </div>
        <div class="tif-summary-card">
          <label>Threat Contexts</label>
          <div class="tif-stat">
            <span class="tif-number">{{ formatNumber(uniqueTagCount) }}</span>
          </div>
          <p>Distinct malware & actors.</p>
        </div>
        <div class="tif-summary-card">
          <label>Intel Freshness</label>
          <div class="tif-stat">
            <span class="tif-number">{{ lastUpdatedLabel }}</span>
          </div>
          <p>Last modification date.</p>
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
        <button @click="applySearch" class="btn-search-trigger">Search</button>
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
      <!-- Left: Feeds & Widgets -->
      <aside class="tif-sidebar">
        <!-- Subscribed Feed Widget -->
        <div class="tif-widget">
          <div class="tif-widget-head">
            <h3><i class="fas fa-rss"></i> Subscribed Pulses</h3>
            <button class="btn-icon-tiny" @click="loadSubscribedFeed" :disabled="subscribedLoading">
              <i class="fas fa-redo-alt" :class="{ 'fa-spin': subscribedLoading }"></i>
            </button>
          </div>
          <div class="tif-widget-body">
            <div v-if="subscribedPulses.length" class="tif-widget-list">
              <div 
                v-for="pulse in subscribedPulses.slice(0, 5)" 
                :key="pulse.id" 
                class="tif-widget-item clickable"
                :class="{ active: activePulseId === pulse.id }"
                @click="viewSubscribedPulse(pulse)"
              >
                <div class="tif-widget-item-main">
                  <strong class="truncate">{{ pulse.name }}</strong>
                  <span>{{ formatDate(pulse.modified) }}</span>
                </div>
                <i class="fas fa-chevron-right"></i>
              </div>
            </div>
            <div v-else class="tif-widget-empty">No active subscriptions.</div>
          </div>
        </div>

        <div class="tif-sidebar-info">
          <p><i class="fas fa-info-circle"></i> Click a pulse to view full threat intelligence context.</p>
        </div>
      </aside>

      <!-- Center: Intelligence Feed -->
      <main class="tif-content">
        <div class="tif-feed-header">
          <div class="tif-feed-title">
            <h2>Global Threat Signals</h2>
            <span v-if="resultCount" class="tif-count-badge">{{ formatNumber(resultCount) }} Results</span>
          </div>
          
          <div class="tif-pagination-new">
            <button class="btn-nav" :disabled="page <= 1" @click="goPage(page - 1)">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="tif-page-indicator">
              <span class="current">{{ page }}</span>
              <span class="sep">/</span>
              <span class="total">{{ Math.ceil(resultCount / limit) || 1 }}</span>
            </div>
            <button class="btn-nav" :disabled="!hasNextPage" @click="goPage(page + 1)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div v-if="loading" class="tif-loading-feed">
          <div class="tif-loader-box">
            <i class="fas fa-satellite fa-spin"></i>
            <p>Scanning OTX network...</p>
          </div>
        </div>
        
        <div v-else-if="error" class="tif-error-feed">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Signal Lost</h3>
          <p>{{ error }}</p>
          <button @click="loadFeed" class="btn btn-premium-dark">Retry Connection</button>
        </div>

        <div v-else class="tif-pulse-scroll-area">
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
                <span class="tif-ioc-count">{{ pulse.indicatorCount }} Indicators</span>
              </div>
              <h3 class="tif-card-title">{{ pulse.name }}</h3>
              <p class="tif-card-desc">{{ pulse.description || 'No summary available.' }}</p>
              <div class="tif-card-tags">
                <span v-for="tag in pulse.tags.slice(0, 3)" :key="tag" class="tif-tag-mini">{{ tag }}</span>
                <span v-if="pulse.tags.length > 3" class="tif-tag-more">+{{ pulse.tags.length - 3 }}</span>
              </div>
              <div class="tif-card-footer">
                <span><i class="fas fa-user-circle"></i> {{ pulse.author }}</span>
                <span><i class="fas fa-calendar-alt"></i> {{ formatDate(pulse.modified, { month: 'short', day: 'numeric' }) }}</span>
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
              <h2 class="ins-title-scroll">{{ activePulse.name }}</h2>
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

          <div class="tif-ins-body scroll-y">
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
                  <strong class="truncate">{{ activePulse.targetCountries.join(', ') || 'Global' }}</strong>
                </div>
              </div>
            </div>

            <!-- Section: Top Indicators -->
            <div class="tif-ins-section">
              <div class="tif-ins-label">Top Indicators of Compromise</div>
              <div class="tif-ins-ioc-list">
                <div v-for="ioc in activeIndicators" :key="ioc.key" class="tif-ins-ioc-row">
                  <span class="tif-ioc-type">{{ ioc.type }}</span>
                  <code class="tif-ioc-value" :title="ioc.value">{{ ioc.value }}</code>
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

export default {
  name: "ThreatFeed",
  data() {
    return {
      apiKey: "",
      authMode: "unknown",
      query: "",
      queryDraft: "",
      page: 1,
      limit: 10,
      resultCount: 0,
      hasNextPage: false,
      pulses: [],
      activePulseId: "",
      loading: false,
      error: "",
      presets: ["ransomware", "phishing", "APT", "indonesia"],

      subscribedLoading: false,
      subscribedError: "",
      subscribedPulses: [],
    };
  },
  computed: {
    activePulse() {
      // Priority 1: Find by activePulseId
      // Priority 2: Use first pulse from current main feed
      // Priority 3: Use first pulse from subscribed feed if main is empty
      const mainMatch = this.pulses.find((p) => p.id === this.activePulseId);
      if (mainMatch) return mainMatch;
      
      const subMatch = this.subscribedPulses.find((p) => p.id === this.activePulseId);
      if (subMatch) return subMatch;

      return this.pulses[0] || null;
    },
    totalIndicators() {
      return this.pulses.reduce((total, pulse) => total + (pulse.indicatorCount || 0), 0);
    },
    uniqueTagCount() {
      return new Set(this.pulses.flatMap((pulse) => pulse.tags)).size;
    },
    lastUpdatedLabel() {
      const dates = this.pulses
        .map((pulse) => new Date(pulse.modified).getTime())
        .filter((time) => Number.isFinite(time));
      if (!dates.length) return "-";
      return this.formatDate(new Date(Math.max(...dates)).toISOString(), { month: "short", day: "numeric" });
    },
    activeIndicators() {
      if (!this.activePulse) return [];
      return this.activePulse.indicators.slice(0, 15).map((indicator, index) => ({
        key: `${indicator.type}-${indicator.value}-${index}`,
        type: indicator.type || "indicator",
        value: indicator.value || "-",
      }));
    }
  },
  mounted() {
    this.apiKey = window.localStorage.getItem(API_KEY_STORAGE) || "";
    this.loadFeed();
    this.loadSubscribedFeed();
  },
  methods: {
    async loadFeed() {
      this.loading = true;
      this.error = "";
      try {
        const params = new URLSearchParams({
          mode: "pulses",
          feed: this.query ? "search" : "recent",
          page: String(this.page),
          limit: String(this.limit),
        });
        if (this.query) params.set("q", this.query);
        
        const payload = await this.requestJson(`/api/otx?${params.toString()}`);
        const normalized = this.normalizePulseFeedPayload(payload);
        this.resultCount = normalized.count;
        this.hasNextPage = normalized.next;
        this.pulses = normalized.pulses;
        if (!this.activePulseId) this.activePulseId = this.pulses[0]?.id || "";
      } catch (error) {
        this.error = error.message || "Failed to fetch pulses.";
      } finally {
        this.loading = false;
      }
    },
    async loadSubscribedFeed() {
      this.subscribedLoading = true;
      try {
        const params = new URLSearchParams({ mode: "pulses", feed: "subscribed", limit: "5" });
        const payload = await this.requestJson(`/api/otx?${params.toString()}`);
        const normalized = this.normalizePulseFeedPayload(payload);
        this.subscribedPulses = normalized.pulses;
      } catch (e) {
        console.error("Subscribed feed error:", e);
      } finally {
        this.subscribedLoading = false;
      }
    },
    async requestJson(url) {
      const headers = { Accept: "application/json" };
      if (this.apiKey) headers["X-OTX-API-KEY"] = this.apiKey;
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    },
    normalizePulseFeedPayload(payload) {
      const results = payload?.results || payload?.pulses || [];
      const pulses = results.map((pulse, index) => {
        const indicators = (pulse.indicators || []).map((i) => ({
          type: i.type || i.indicator_type || "IOC",
          value: i.indicator || i.value || "",
        })).filter(i => i.value);
        return {
          id: String(pulse.id || pulse.pulse_id || index),
          name: pulse.name || "Untitled Pulse",
          description: pulse.description || "",
          author: pulse.author_name || "OTX",
          modified: pulse.modified || pulse.created || "",
          tlp: String(pulse.tlp || "WHITE").toUpperCase(),
          tags: (pulse.tags || []).map(String),
          references: (pulse.references || []).map(String),
          indicators,
          indicatorCount: Number(pulse.indicator_count || indicators.length),
          adversary: pulse.adversary || "",
          malwareFamilies: pulse.malware_families || [],
          industries: pulse.industries || [],
          targetCountries: pulse.targeted_countries || [],
        };
      });
      return { count: Number(payload?.count) || pulses.length, next: !!payload?.next, pulses };
    },
    applySearch() {
      this.query = this.queryDraft;
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
    viewSubscribedPulse(pulse) {
      this.activePulseId = pulse.id;
    },
    formatDate(v, opts = {}) {
      if (!v) return "-";
      const d = new Date(v);
      return isNaN(d) ? "-" : new Intl.DateTimeFormat("en-US", { year: 'numeric', month: 'short', day: 'numeric', ...opts }).format(d);
    },
    formatNumber(v) { return new Intl.NumberFormat().format(v || 0); },
    getHost(v) { try { return new URL(v).hostname; } catch { return v; } },
    copyToClipboard(t) { navigator.clipboard.writeText(t); }
  }
};
</script>

<style scoped>
:root {
  --tif-teal: #0f766e;
  --tif-teal-dark: #134e4a;
  --tif-bg: #f8fafc;
  --tif-border: rgba(15, 23, 42, 0.08);
}

.tif-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--tif-bg);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Header */
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
  width: 3.25rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--tif-teal), var(--tif-teal-dark));
  border-radius: 12px;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 8px 16px -4px rgba(15, 118, 110, 0.4);
}

.tif-kicker {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #64748b;
  letter-spacing: 0.05em;
}

.tif-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0;
}

.tif-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.tif-summary-card {
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--tif-border);
}

.tif-summary-card label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  display: block;
}

.tif-number {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--tif-teal);
}

.tif-summary-card p {
  font-size: 0.7rem;
  color: #94a3b8;
  margin: 0;
}

/* Toolbar */
.tif-nav-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--tif-border);
}

.tif-search-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 25rem;
}

.tif-search-group input {
  border: none;
  background: none;
  width: 100%;
  font-size: 0.9rem;
  font-weight: 500;
  outline: none;
}

.btn-search-trigger {
  padding: 0.35rem 0.75rem;
  background: var(--tif-teal);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.tif-quick-filters {
  display: flex;
  gap: 0.25rem;
}

.tif-nav-link {
  padding: 0.4rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  border: none;
  background: transparent;
  border-radius: 6px;
}

.tif-nav-link.active {
  background: rgba(15, 118, 110, 0.1);
  color: var(--tif-teal);
}

/* Layout */
.tif-main-layout {
  display: grid;
  grid-template-columns: 18rem 1fr 22rem;
  gap: 1.25rem;
  align-items: start;
}

.tif-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tif-widget {
  background: white;
  border-radius: 12px;
  border: 1px solid var(--tif-border);
  overflow: hidden;
}

.tif-widget-head {
  padding: 0.75rem 1rem;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--tif-border);
}

.tif-widget-head h3 { font-size: 0.8rem; font-weight: 800; margin: 0; color: #1e293b; display: flex; align-items: center; gap: 0.5rem; }
.tif-widget-head h3 i { color: var(--tif-teal); }

.tif-widget-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;
}

.tif-widget-item:hover { background: #f1f5f9; }
.tif-widget-item.active { border-left: 3px solid var(--tif-teal); background: rgba(15, 118, 110, 0.05); }

.tif-widget-item-main { min-width: 0; flex: 1; }
.tif-widget-item-main strong { display: block; font-size: 0.75rem; color: #1e293b; margin-bottom: 0.1rem; }
.tif-widget-item-main span { font-size: 0.65rem; color: #94a3b8; }
.tif-widget-item i { font-size: 0.7rem; color: #cbd5e1; }

.tif-sidebar-info {
  padding: 0.75rem;
  background: rgba(15, 118, 110, 0.05);
  border-radius: 8px;
  color: var(--tif-teal);
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1.4;
}

/* Feed Content */
.tif-feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tif-feed-title h2 { font-size: 1rem; font-weight: 900; color: #1e293b; margin: 0; }
.tif-count-badge { font-size: 0.65rem; font-weight: 800; color: #64748b; background: #e2e8f0; padding: 0.1rem 0.4rem; border-radius: 4px; }

/* Pagination New */
.tif-pagination-new {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.25rem;
  border-radius: 8px;
  border: 1px solid var(--tif-border);
}

.btn-nav {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #64748b;
  cursor: pointer;
}

.btn-nav:hover:not(:disabled) { background: #f1f5f9; color: var(--tif-teal); }
.btn-nav:disabled { opacity: 0.3; cursor: not-allowed; }

.tif-page-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0 0.5rem;
}

.tif-page-indicator .current { color: var(--tif-teal); }
.tif-page-indicator .sep { color: #cbd5e1; }
.tif-page-indicator .total { color: #94a3b8; }

.tif-pulse-scroll-area {
  max-height: calc(100vh - 18rem);
  overflow-y: auto;
  padding-right: 0.5rem;
}

.tif-pulse-card {
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--tif-border);
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tif-pulse-card:hover { border-color: var(--tif-teal); transform: translateY(-2px); }
.tif-pulse-card.active { border-color: var(--tif-teal); background: rgba(15, 118, 110, 0.02); }

.tif-card-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.tif-tlp { font-size: 0.6rem; font-weight: 900; padding: 0.1rem 0.4rem; border-radius: 4px; }
.tif-tlp.white { background: #e2e8f0; color: #475569; }
.tif-tlp.green { background: #dcfce7; color: #166534; }
.tif-tlp.amber { background: #fef3c7; color: #92400e; }
.tif-tlp.red { background: #fee2e2; color: #991b1b; }

.tif-card-title { font-size: 0.9rem; font-weight: 800; color: #1e293b; margin: 0 0 0.4rem; }
.tif-card-desc { font-size: 0.75rem; color: #64748b; margin: 0 0 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

/* Inspector */
.tif-inspector {
  position: sticky;
  top: 1.5rem;
  height: calc(100vh - 3rem);
  background: white;
  border-radius: 16px;
  border: 1px solid var(--tif-border);
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Added to clip anything bleeding out */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
}

.tif-inspector-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.tif-ins-header { 
  padding: 1.25rem; 
  border-bottom: 1px solid #f1f5f9; 
  flex-shrink: 0; /* Keep header size fixed */
}
.tif-ins-tlp-bar { position: absolute; top: 0; left: 0; right: 0; height: 5px; }
.tif-ins-header.white .tif-ins-tlp-bar { background: #94a3b8; }
.tif-ins-header.green .tif-ins-tlp-bar { background: #22c55e; }
.tif-ins-header.amber .tif-ins-tlp-bar { background: #f59e0b; }
.tif-ins-header.red .tif-ins-tlp-bar { background: #ef4444; }

.ins-title-scroll { font-size: 1.15rem; font-weight: 900; color: #1e293b; margin: 0.25rem 0 1rem; overflow-wrap: break-word; }

.tif-ins-body { 
  padding: 1.25rem; 
  flex: 1; 
  overflow-y: auto; /* Ensure only this area scrolls */
  min-height: 0; /* Important for flex-child scrolling */
}
.scroll-y::-webkit-scrollbar { width: 4px; }
.scroll-y::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

.tif-ins-section { margin-bottom: 1.5rem; }
.tif-ins-label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
.tif-ins-label::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }

.tif-ins-context-grid { display: grid; gap: 0.75rem; grid-template-columns: 1fr 1fr; }
.tif-ins-context-item label { font-size: 0.6rem; font-weight: 700; color: #94a3b8; display: block; }
.tif-ins-context-item strong { font-size: 0.8rem; color: #1e293b; }

.tif-ins-ioc-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.5rem; background: #f8fafc; border-radius: 6px; margin-bottom: 0.25rem; }
.tif-ioc-type { font-size: 0.55rem; font-weight: 800; color: var(--tif-teal); background: rgba(15, 118, 110, 0.1); padding: 0.1rem 0.3rem; border-radius: 3px; min-width: 3rem; text-align: center; }
.tif-ioc-value { font-size: 0.7rem; color: #1e293b; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.btn-premium-small {
  padding: 0.4rem 0.75rem;
  background: white;
  border: 1.5px solid var(--tif-teal);
  color: var(--tif-teal);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-icon-tiny { border: none; background: transparent; color: #94a3b8; cursor: pointer; padding: 0.25rem; }
.btn-icon-tiny:hover { color: var(--tif-teal); }

.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

@media (max-width: 1200px) {
  .tif-main-layout { grid-template-columns: 1fr 1.5fr; }
  .tif-inspector { display: none; }
}
</style>
