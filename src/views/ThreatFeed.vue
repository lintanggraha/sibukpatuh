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
        <div class="tif-header-actions" v-if="activeModule === 'otx'">
          <button class="btn btn-premium-small" @click="loadFeed" :disabled="loading">
            <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
            Refresh Data
          </button>
        </div>
      </div>

      <!-- Module Switcher -->
      <nav class="tif-sub-navbar">
        <button class="tif-sub-nav-item" :class="{ active: activeModule === 'otx' }" @click="activeModule = 'otx'">
          <i class="fas fa-satellite"></i>
          <div class="sub-nav-text">
            <span>OTX AlienVault</span>
            <small>Live Threat Feed</small>
          </div>
        </button>
        <button class="tif-sub-nav-item" :class="{ active: activeModule === 'mitre' }" @click="activeModule = 'mitre'">
          <i class="fas fa-project-diagram"></i>
          <div class="sub-nav-text">
            <span>MITRE ATT&CK</span>
            <small>Knowledge Base</small>
          </div>
        </button>
      </nav>

      <div class="tif-summary-grid" v-if="activeModule === 'otx'">
        <div class="tif-summary-card">
          <label><i class="fas fa-satellite-dish"></i> Active Pulses</label>
          <div class="tif-stat">{{ formatNumber(resultCount || pulses.length) }}</div>
          <p>Live signals detected</p>
        </div>
        <div class="tif-summary-card">
          <label><i class="fas fa-fingerprint"></i> Total Indicators</label>
          <div class="tif-stat">{{ formatNumber(totalIndicators) }}</div>
          <p>IOCs in current view</p>
        </div>
        <div class="tif-summary-card">
          <label><i class="fas fa-tags"></i> Contexts</label>
          <div class="tif-stat">{{ formatNumber(uniqueTagCount) }}</div>
          <p>Distinct threat tags</p>
        </div>
        <div class="tif-summary-card">
          <label><i class="fas fa-clock"></i> Freshness</label>
          <div class="tif-stat">{{ lastUpdatedLabel }}</div>
          <p>Latest update received</p>
        </div>
      </div>
    </header>

    <!-- MAIN DASHBOARD AREA -->
    <div v-if="activeModule === 'otx'" class="tif-module-container">
      <nav class="tif-nav-toolbar">
        <div class="tif-search-group">
          <i class="fas fa-search"></i>
          <input v-model="queryDraft" type="text" placeholder="Search ransomware, APT, CVE..." @keyup.enter="applySearch">
          <button @click="applySearch" class="btn-search-trigger">Search</button>
        </div>
        <div class="tif-quick-filters">
          <span class="filter-label">Quick Filters:</span>
          <div class="filter-pills">
            <button v-for="preset in presets" :key="preset" class="tif-nav-link" :class="{ active: query === preset }" @click="usePreset(preset)">
              {{ preset }}
            </button>
          </div>
        </div>
        <div class="tif-year-filter">
          <span class="filter-label">Year:</span>
          <select v-model="selectedYear" class="tif-select-mini">
            <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </nav>

      <div class="tif-main-layout">
        <!-- Sidebar -->
        <aside class="tif-sidebar">
          <div class="tif-widget">
            <div class="tif-widget-head">
              <div class="tif-widget-title"><i class="fas fa-rss"></i> Subscribed Pulses</div>
              <button class="btn-refresh-mini" @click="loadSubscribedFeed" :disabled="subscribedLoading">
                <i class="fas fa-sync-alt" :class="{ 'fa-spin': subscribedLoading }"></i>
              </button>
            </div>
            <div class="tif-widget-body scroll-y">
              <div v-if="subscribedPulses.length" class="tif-widget-list">
                <div v-for="pulse in subscribedPulses" :key="pulse.id" class="tif-widget-item" :class="{ active: activePulseId === pulse.id }" @click="viewSubscribedPulse(pulse)">
                  <div class="tif-widget-info">
                    <strong class="truncate">{{ pulse.name }}</strong>
                    <span class="tif-date-mini">{{ formatDate(pulse.modified) }}</span>
                  </div>
                  <i class="fas fa-chevron-right tif-arrow"></i>
                </div>
              </div>
              <div v-else class="tif-widget-empty">No subscriptions.</div>
            </div>
          </div>
        </aside>

        <!-- Main Feed -->
        <main class="tif-content">
          <header class="tif-content-header">
            <div class="tif-title-block">
              <h2 class="tif-main-heading">Global Threat Signals</h2>
              <div class="tif-meta-row">
                <span class="tif-meta-pill"><i class="fas fa-database"></i> {{ formatNumber(resultCount) }} Reports</span>
                <span class="tif-meta-pill"><i class="fas fa-bolt"></i> Recent Activity</span>
              </div>
            </div>
            <div class="tif-pagination">
              <button class="pag-btn" :disabled="page <= 1" @click="goPage(page - 1)"><i class="fas fa-chevron-left"></i></button>
              <div class="pag-info">{{ page }} <span class="sep">of</span> {{ Math.ceil(resultCount/limit) || 1 }}</div>
              <button class="pag-btn" :disabled="!hasNextPage" @click="goPage(page + 1)"><i class="fas fa-chevron-right"></i></button>
            </div>
          </header>

          <div v-if="loading" class="tif-loading-feed">
            <i class="fas fa-satellite fa-spin"></i>
            <p>Scanning OTX Intel...</p>
          </div>
          <div v-else class="tif-pulse-scroll scroll-y">
            <article v-for="pulse in displayPulses" :key="pulse.id" class="tif-pulse-card" :class="{ active: activePulseId === pulse.id }" @click="activePulseId = pulse.id">
              <div class="tif-card-header">
                <span class="tif-tlp" :class="pulse.tlp.toLowerCase()">{{ pulse.tlp }}</span>
                <span class="tif-ioc-count">{{ pulse.indicatorCount }} Indicators</span>
              </div>
              <h3 class="tif-card-title">{{ pulse.name }}</h3>
              <p class="tif-card-desc">{{ pulse.description || 'No description provided.' }}</p>
              <div class="tif-card-footer">
                <span><i class="fas fa-user-edit"></i> {{ pulse.author }}</span>
                <span><i class="fas fa-calendar-day"></i> {{ formatDate(pulse.modified) }}</span>
              </div>
            </article>
          </div>
        </main>

        <!-- Inspector -->
        <section class="tif-inspector" :class="{ empty: !activePulse }">
          <div v-if="!activePulse" class="tif-ins-empty">
            <i class="fas fa-crosshairs"></i>
            <p>Select a pulse to analyze</p>
          </div>
          <div v-else class="tif-ins-panel">
            <div class="tif-ins-head" :class="activePulse.tlp.toLowerCase()">
              <div class="tif-tlp-bar"></div>
              <small>Pulse Analysis</small>
              <h2>{{ activePulse.name }}</h2>
            </div>
            <div class="tif-ins-body scroll-y">
              <div class="tif-ins-section">
                <label>Threat Context</label>
                <div class="tif-ins-grid">
                  <div class="ins-item"><small>Adversary</small><strong>{{ activePulse.adversary || 'Unknown' }}</strong></div>
                  <div class="ins-item"><small>Confidence</small><strong>High</strong></div>
                </div>
              </div>
              <div class="tif-ins-section">
                <label>Indicators of Compromise</label>
                <div class="tif-ioc-list">
                  <div v-for="ioc in activeIndicators" :key="ioc.key" class="tif-ioc-row">
                    <span class="ioc-type">{{ ioc.type }}</span>
                    <code class="ioc-val">{{ ioc.value }}</code>
                  </div>
                </div>
              </div>
              <div class="tif-ins-section">
                <label>Summary</label>
                <p class="ins-desc">{{ activePulse.description }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- MITRE MODULE (Placeholder for now) -->
    <div v-else class="tif-module-container mitre">
      <div class="tif-loading-feed">
        <i class="fas fa-project-diagram"></i>
        <p>MITRE ATT&CK Knowledge Base Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
const API_KEY_STORAGE = "sibukpatuh.otxApiKey";

export default {
  name: "ThreatFeed",
  data() {
    return {
      activeModule: "otx",
      apiKey: "",
      query: "",
      queryDraft: "",
      page: 1,
      limit: 10,
      resultCount: 0,
      hasNextPage: false,
      pulses: [],
      subscribedPulses: [],
      activePulseId: "",
      loading: false,
      subscribedLoading: false,
      presets: ["ransomware", "phishing", "APT", "indonesia"],
      selectedYear: "All",
      availableYears: ["All", "2026", "2025", "2024", "2023", "2022", "2021", "2020"]
    };
  },
  computed: {
    activePulse() {
      const all = [...this.pulses, ...this.subscribedPulses];
      return all.find(p => p.id === this.activePulseId) || this.pulses[0] || null;
    },
    displayPulses() {
      console.log("LeadDev: Total pulses available for filtering:", this.pulses.length);
      console.log("LeadDev: Current Year Filter:", this.selectedYear);
      
      let f = [...this.pulses];
      if (this.selectedYear !== "All") {
        f = f.filter(p => {
          const year = new Date(p.modified).getFullYear().toString();
          return year === this.selectedYear;
        });
      }
      
      console.log("LeadDev: Pulses after year filtering:", f.length);
      if (f.length > 0) {
        console.log("LeadDev: First pulse year in result:", new Date(f[0].modified).getFullYear());
      }
      return f;
    },
    totalIndicators() { return this.pulses.reduce((t, p) => t + (p.indicatorCount || 0), 0); },
    uniqueTagCount() { return new Set(this.pulses.flatMap(p => p.tags)).size; },
    lastUpdatedLabel() {
      const dates = this.pulses.map(p => new Date(p.modified).getTime()).filter(t => !isNaN(t));
      return dates.length ? this.formatDate(new Date(Math.max(...dates))) : "-";
    },
    activeIndicators() {
      if (!this.activePulse) return [];
      return (this.activePulse.indicators || []).slice(0, 15).map((i, idx) => ({ key: idx, type: i.type, value: i.value }));
    }
  },
  mounted() {
    this.apiKey = localStorage.getItem(API_KEY_STORAGE) || "";
    this.loadFeed();
    this.loadSubscribedFeed();
  },
  methods: {
    async loadFeed() {
      this.loading = true;
      try {
        const p = new URLSearchParams({ mode: "pulses", feed: this.query ? "search" : "recent", page: String(this.page), limit: String(this.limit) });
        if (this.query) p.set("q", this.query);
        const data = await this.requestJson(`/api/otx?${p.toString()}`);
        const normalized = this.normalizePulseFeedPayload(data);
        this.pulses = normalized.pulses;
        this.resultCount = normalized.count;
        this.hasNextPage = normalized.next;
        if (!this.activePulseId && this.pulses.length) this.activePulseId = this.pulses[0].id;
      } finally { this.loading = false; }
    },
    async loadSubscribedFeed() {
      this.subscribedLoading = true;
      try {
        const data = await this.requestJson(`/api/otx?mode=pulses&feed=subscribed&limit=10`);
        this.subscribedPulses = this.normalizePulseFeedPayload(data).pulses;
      } finally { this.subscribedLoading = false; }
    },
    async requestJson(url) {
      const h = { Accept: "application/json" };
      if (this.apiKey && url.includes('otx')) h["X-OTX-API-KEY"] = this.apiKey;
      const r = await fetch(url, { headers: h });
      return r.json();
    },
    normalizePulseFeedPayload(payload) {
      const raw = payload.results || payload.pulses || [];
      const pulses = raw.map((p, i) => ({
        id: String(p.id || p.pulse_id || i),
        name: p.name || "Unknown Threat",
        description: p.description || "",
        author: p.author_name || "System",
        modified: p.modified || new Date().toISOString(),
        tlp: String(p.tlp || "WHITE").toUpperCase(),
        tags: Array.isArray(p.tags) ? p.tags : [],
        indicatorCount: p.indicator_count || 0,
        indicators: (p.indicators || []).map(ind => ({ type: ind.type, value: ind.indicator })),
        adversary: p.adversary || ""
      }));
      return { count: payload.count || pulses.length, next: !!payload.next, pulses };
    },
    applySearch() { this.query = this.queryDraft; this.page = 1; this.loadFeed(); },
    usePreset(p) { this.query = p; this.queryDraft = p; this.page = 1; this.loadFeed(); },
    goPage(p) { this.page = p; this.loadFeed(); },
    viewSubscribedPulse(p) { this.activePulseId = p.id; },
    formatDate(v) { return new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); },
    formatNumber(v) { return new Intl.NumberFormat().format(v || 0); }
  }
};
</script>

<style scoped>
.tif-page { padding: 1.5rem; background: #f1f5f9; min-height: 100vh; font-family: 'Inter', sans-serif; color: #1e293b; }

/* Header */
.tif-header { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem; }
.tif-header-main { display: flex; justify-content: space-between; align-items: center; }
.tif-brand { display: flex; align-items: center; gap: 1rem; }
.tif-icon-box { width: 3rem; height: 3rem; background: #0f766e; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.25rem; }
.tif-title { font-size: 1.5rem; font-weight: 900; margin: 0; }
.tif-kicker { font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; }

.tif-sub-navbar { display: flex; gap: 0.75rem; background: white; padding: 0.5rem; border-radius: 12px; border: 1px solid #e2e8f0; }
.tif-sub-nav-item { flex: 1; border: none; background: transparent; padding: 0.6rem 1rem; display: flex; align-items: center; gap: 0.75rem; border-radius: 8px; cursor: pointer; text-align: left; }
.tif-sub-nav-item.active { background: #f0fdfa; border: 1px solid #99f6e4; }
.tif-sub-nav-item i { font-size: 1.15rem; color: #94a3b8; }
.tif-sub-nav-item.active i { color: #0f766e; }
.sub-nav-text span { display: block; font-weight: 800; font-size: 0.85rem; }
.sub-nav-text small { font-size: 0.65rem; color: #94a3b8; }

.tif-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.tif-summary-card { background: white; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0; }
.tif-summary-card label { font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.4rem; display: block; }
.tif-stat { font-size: 1.25rem; font-weight: 900; color: #0f766e; }
.tif-summary-card p { font-size: 0.7rem; color: #64748b; margin: 0.25rem 0 0; }

/* Dashboard Content */
.tif-nav-toolbar { display: flex; justify-content: space-between; align-items: center; background: white; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; }
.tif-search-group { display: flex; align-items: center; gap: 0.75rem; flex: 1; background: #f8fafc; padding: 0.4rem 0.75rem; border-radius: 8px; border: 1px solid #e2e8f0; }
.tif-search-group input { border: none; background: transparent; outline: none; flex: 1; font-weight: 500; font-size: 0.85rem; }
.btn-search-trigger { background: #0f766e; color: white; border: none; padding: 0.4rem 1rem; border-radius: 6px; font-weight: 700; cursor: pointer; }

.tif-quick-filters { display: flex; align-items: center; gap: 1rem; margin-left: 2rem; }
.filter-label { font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; white-space: nowrap; }
.filter-pills { display: flex; gap: 0.4rem; }
.tif-nav-link { padding: 0.3rem 0.75rem; border: 1px solid #e2e8f0; background: white; border-radius: 6px; font-size: 0.7rem; font-weight: 700; cursor: pointer; }
.tif-nav-link.active { background: #0f766e; color: white; border-color: #0f766e; }

.tif-main-layout { display: grid; grid-template-columns: 18rem 1fr 22rem; gap: 1.5rem; align-items: start; }

/* Sidebar Widget */
.tif-widget { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
.tif-widget-head { padding: 0.75rem 1rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.tif-widget-title { font-size: 0.75rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 0.5rem; }
.btn-refresh-mini { border: 1px solid #e2e8f0; background: white; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; color: #64748b; }

.tif-widget-item { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
.tif-widget-item.active { background: #f0fdfa; border-left: 3px solid #0f766e; }
.tif-widget-info strong { display: block; font-size: 0.75rem; color: #1e293b; }
.tif-date-mini { font-size: 0.65rem; color: #94a3b8; }
.tif-arrow { font-size: 0.7rem; color: #cbd5e1; }

/* Main Content */
.tif-content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.tif-main-heading { font-size: 1.25rem; font-weight: 900; margin: 0; }
.tif-meta-row { display: flex; gap: 0.75rem; margin-top: 0.25rem; }
.tif-meta-pill { font-size: 0.65rem; font-weight: 700; color: #64748b; background: white; padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.3rem; }

.tif-pagination { display: flex; align-items: center; gap: 0.5rem; background: white; padding: 0.25rem; border-radius: 8px; border: 1px solid #e2e8f0; }
.pag-btn { border: none; background: transparent; padding: 0.3rem 0.5rem; cursor: pointer; color: #64748b; border-radius: 4px; }
.pag-btn:hover:not(:disabled) { background: #f1f5f9; color: #0f766e; }
.pag-info { font-size: 0.75rem; font-weight: 800; padding: 0 0.5rem; }
.pag-info .sep { font-size: 0.6rem; color: #94a3b8; }

.tif-pulse-scroll { max-height: calc(100vh - 25rem); overflow-y: auto; padding-right: 0.5rem; }
.tif-pulse-card { background: white; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 1rem; cursor: pointer; transition: 0.2s; }
.tif-pulse-card:hover { transform: translateY(-2px); border-color: #0f766e; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.tif-pulse-card.active { border-color: #0f766e; background: #f0fdfa; border-left: 4px solid #0f766e; }

.tif-card-header { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
.tif-tlp { font-size: 0.6rem; font-weight: 900; padding: 0.2rem 0.5rem; border-radius: 4px; }
.tif-tlp.white { background: #f1f5f9; color: #475569; }
.tif-tlp.green { background: #dcfce7; color: #166534; }
.tif-tlp.amber { background: #fef3c7; color: #92400e; }
.tif-tlp.red { background: #fee2e2; color: #991b1b; }
.tif-ioc-count { font-size: 0.65rem; font-weight: 700; color: #94a3b8; }

.tif-card-title { font-size: 0.95rem; font-weight: 800; margin: 0 0 0.5rem; line-height: 1.4; }
.tif-card-desc { font-size: 0.75rem; color: #64748b; line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.tif-card-footer { display: flex; gap: 1rem; margin-top: 1rem; font-size: 0.65rem; color: #94a3b8; font-weight: 600; border-top: 1px solid #f1f5f9; padding-top: 0.75rem; }

/* Inspector */
.tif-inspector { background: white; border-radius: 16px; border: 1px solid #e2e8f0; height: calc(100vh - 12rem); position: sticky; top: 1.5rem; display: flex; flex-direction: column; overflow: hidden; }
.tif-ins-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; text-align: center; }
.tif-ins-empty i { font-size: 2rem; margin-bottom: 1rem; opacity: 0.5; }

.tif-ins-head { padding: 1.5rem; border-bottom: 1px solid #f1f5f9; position: relative; }
.tif-tlp-bar { position: absolute; top: 0; left: 0; right: 0; height: 4px; }
.tif-ins-head.white .tif-tlp-bar { background: #cbd5e1; }
.tif-ins-head.green .tif-tlp-bar { background: #22c55e; }
.tif-ins-head.amber .tif-tlp-bar { background: #f59e0b; }
.tif-ins-head.red .tif-tlp-bar { background: #ef4444; }

.tif-ins-head small { font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
.tif-ins-head h2 { font-size: 1.15rem; font-weight: 900; margin: 0.4rem 0 0; line-height: 1.3; }

.tif-ins-body { padding: 1.5rem; flex: 1; }
.tif-ins-section { margin-bottom: 1.5rem; }
.tif-ins-section label { font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
.tif-ins-section label::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }

.tif-ins-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.ins-item small { display: block; font-size: 0.6rem; color: #94a3b8; font-weight: 700; margin-bottom: 0.2rem; }
.ins-item strong { font-size: 0.8rem; color: #1e293b; }

.tif-ioc-row { display: flex; gap: 0.75rem; align-items: center; padding: 0.4rem 0.6rem; background: #f8fafc; border-radius: 6px; margin-bottom: 0.4rem; border: 1px solid #f1f5f9; }
.ioc-type { font-size: 0.55rem; font-weight: 800; background: #f0fdfa; color: #0f766e; padding: 0.15rem 0.4rem; border-radius: 4px; min-width: 3.5rem; text-align: center; }
.ioc-val { font-size: 0.7rem; font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.ins-desc { font-size: 0.75rem; color: #475569; line-height: 1.6; }

.tif-loading-feed { padding: 4rem; text-align: center; color: #94a3b8; }
.tif-loading-feed i { font-size: 2rem; color: #0f766e; margin-bottom: 1rem; }

.btn-premium-small { padding: 0.4rem 1rem; border: 2px solid #0f766e; background: white; color: #0f766e; border-radius: 8px; font-weight: 800; font-size: 0.75rem; cursor: pointer; }

.tif-year-filter { display: flex; align-items: center; gap: 0.75rem; margin-left: 1rem; padding-left: 1rem; border-left: 1px solid #e2e8f0; }
.tif-select-mini { padding: 0.35rem 0.75rem; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 8px; font-size: 0.75rem; font-weight: 700; color: #1e293b; outline: none; cursor: pointer; transition: all 0.2s; }
.tif-select-mini:hover { border-color: #0f766e; }
.tif-select-mini:focus { border-color: #0f766e; box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.1); }

.scroll-y::-webkit-scrollbar { width: 5px; }
.scroll-y::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
