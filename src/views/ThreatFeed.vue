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
            Refresh
          </button>
        </div>
      </div>

      <!-- Module Switcher (Sub-Navbar) -->
      <nav class="tif-sub-navbar">
        <button 
          class="tif-sub-nav-item" 
          :class="{ active: activeModule === 'otx' }"
          @click="activeModule = 'otx'"
        >
          <i class="fas fa-satellite"></i>
          <div class="sub-nav-text">
            <span>OTX AlienVault</span>
            <small>Live Threat Feed</small>
          </div>
        </button>
        <button 
          class="tif-sub-nav-item" 
          :class="{ active: activeModule === 'mitre' }"
          @click="activeModule = 'mitre'"
        >
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
          <div class="tif-stat">
            <span class="tif-number">{{ formatNumber(resultCount || pulses.length) }}</span>
          </div>
          <p>Live signals detected</p>
        </div>
        <div class="tif-summary-card">
          <label><i class="fas fa-fingerprint"></i> Total Indicators</label>
          <div class="tif-stat">
            <span class="tif-number">{{ formatNumber(totalIndicators) }}</span>
          </div>
          <p>IOCs in current view</p>
        </div>
        <div class="tif-summary-card">
          <label><i class="fas fa-tags"></i> Contexts</label>
          <div class="tif-stat">
            <span class="tif-number">{{ formatNumber(uniqueTagCount) }}</span>
          </div>
          <p>Distinct threat tags</p>
        </div>
        <div class="tif-summary-card">
          <label><i class="fas fa-clock"></i> Freshness</label>
          <div class="tif-stat">
            <span class="tif-number">{{ lastUpdatedLabel }}</span>
          </div>
          <p>Latest update received</p>
        </div>
      </div>
    </header>

    <!-- OTX MODULE -->
    <div v-if="activeModule === 'otx'" class="tif-module-container">
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
          <span class="filter-label">Quick Filters:</span>
          <div class="filter-pills">
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
        </div>
      </nav>

      <div class="tif-main-layout">
        <aside class="tif-sidebar">
          <div class="tif-widget">
            <div class="tif-widget-head">
              <h3><i class="fas fa-rss"></i> Subscribed</h3>
              <button class="btn-icon-tiny" @click="loadSubscribedFeed" :disabled="subscribedLoading" title="Refresh Subscriptions">
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
              <div v-else class="tif-widget-empty">No active subscriptions found.</div>
            </div>
          </div>
        </aside>

        <main class="tif-content">
          <div class="tif-feed-header">
            <div class="tif-feed-title">
              <h2>Global Threat Signals</h2>
              <div class="tif-badge-row">
                <span class="tif-count-badge">{{ formatNumber(resultCount) }} Results Found</span>
                <span class="tif-fresh-badge"><i class="fas fa-calendar-check"></i> Last 2 Years Only</span>
              </div>
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
              <p>Scanning OTX...</p>
            </div>
          </div>
          <div v-else class="tif-pulse-scroll-area scroll-y">
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
                </div>
                <div class="tif-card-footer">
                  <span><i class="fas fa-user-circle"></i> {{ pulse.author }}</span>
                  <span><i class="fas fa-calendar-alt"></i> {{ formatDate(pulse.modified) }}</span>
                </div>
              </article>
            </div>
          </div>
        </main>

        <section class="tif-inspector" :class="{ empty: !activePulse }">
          <div v-if="!activePulse" class="tif-inspector-empty">
            <i class="fas fa-crosshairs"></i>
            <p>Select a pulse to analyze.</p>
          </div>
          <div v-else class="tif-inspector-panel">
            <div class="tif-ins-header" :class="activePulse.tlp.toLowerCase()">
              <div class="tif-ins-tlp-bar"></div>
              <div class="tif-ins-title-box">
                <small>Pulse Analysis</small>
                <h2 class="ins-title-scroll">{{ activePulse.name }}</h2>
              </div>
            </div>
            <div class="tif-ins-body scroll-y">
              <div class="tif-ins-section">
                <div class="tif-ins-label">Threat Context</div>
                <div class="tif-ins-context-grid">
                  <div class="tif-ins-context-item">
                    <label>Adversary</label>
                    <strong>{{ activePulse.adversary || 'Unknown' }}</strong>
                  </div>
                  <div class="tif-ins-context-item">
                    <label>Indicators</label>
                    <strong>{{ activePulse.indicatorCount }}</strong>
                  </div>
                </div>
              </div>
              <div class="tif-ins-section">
                <div class="tif-ins-label">IOCs Summary</div>
                <div class="tif-ins-ioc-list">
                  <div v-for="ioc in activeIndicators" :key="ioc.key" class="tif-ins-ioc-row">
                    <span class="tif-ioc-type">{{ ioc.type }}</span>
                    <code class="tif-ioc-value">{{ ioc.value }}</code>
                  </div>
                </div>
              </div>
              <div class="tif-ins-section">
                <div class="tif-ins-label">Intel Summary</div>
                <p class="tif-ins-desc">{{ activePulse.description || 'No summary available.' }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- MITRE ATT&CK MODULE -->
    <div v-else class="tif-module-container mitre">
      <div class="tif-main-layout mitre">
        <aside class="tif-sidebar">
          <div class="tif-widget">
            <div class="tif-widget-head">
              <h3><i class="fas fa-layer-group"></i> 14 Tactics</h3>
            </div>
            <div class="tif-tactic-list scroll-y">
              <button 
                v-for="tactic in mitreTactics" 
                :key="tactic.id" 
                class="tif-tactic-btn"
                :class="{ active: selectedTacticId === tactic.id }"
                @click="selectedTacticId = tactic.id"
              >
                <span class="tactic-id">{{ tactic.external_id }}</span>
                <span class="tactic-name">{{ tactic.name }}</span>
              </button>
            </div>
          </div>
        </aside>

        <main class="tif-content">
          <div class="tif-mitre-head">
            <div class="tif-mitre-title">
              <h2>{{ currentTactic?.name || 'MITRE Techniques' }}</h2>
              <p>{{ currentTactic?.description || 'Explore adversarial techniques.' }}</p>
            </div>
            <div class="tif-mitre-search">
              <i class="fas fa-search"></i>
              <input v-model="mitreSearch" placeholder="Search techniques (T1059)...">
            </div>
          </div>

          <div v-if="mitreLoading" class="tif-loading-feed">
            <div class="tif-loader-box">
              <i class="fas fa-shield-alt fa-spin"></i>
              <p>Querying MITRE...</p>
            </div>
          </div>

          <div v-else class="tif-technique-grid scroll-y">
            <div 
              v-for="tech in filteredTechniques" 
              :key="tech.id" 
              class="tif-tech-card"
              :class="{ active: selectedTechId === tech.id }"
              @click="selectedTechId = tech.id"
            >
              <div class="tech-card-header">
                <span class="tech-id">{{ tech.external_id }}</span>
              </div>
              <h3 class="tech-name">{{ tech.name }}</h3>
              <p class="tech-summary truncate-2">{{ tech.description }}</p>
            </div>
          </div>
        </main>

        <section class="tif-inspector" :class="{ empty: !selectedTech }">
          <div v-if="!selectedTech" class="tif-inspector-empty">
            <i class="fas fa-microscope"></i>
            <p>Select a technique to analyze.</p>
          </div>
          <div v-else class="tif-inspector-panel">
            <div class="tif-ins-header mitre">
              <div class="tif-ins-tlp-bar mitre"></div>
              <div class="tif-ins-title-box">
                <small>MITRE Detail</small>
                <h2>{{ selectedTech.name }}</h2>
                <div class="tif-tech-id-badge">{{ selectedTech.external_id }}</div>
              </div>
            </div>
            <div class="tif-ins-body scroll-y">
              <div class="tif-ins-section">
                <div class="tif-ins-label">Description</div>
                <p class="tif-mitre-desc">{{ selectedTech.description }}</p>
              </div>
              <div class="tif-ins-section">
                <div class="tif-ins-label">Platforms</div>
                <div class="tif-ins-tags">
                  <span v-for="p in selectedTech.platforms" :key="p" class="tif-ins-tag-soft">{{ p }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
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
      activePulseId: "",
      loading: false,
      error: "",
      presets: ["ransomware", "phishing", "APT", "indonesia"],
      subscribedLoading: false,
      subscribedPulses: [],
      mitreLoading: false,
      mitreTactics: [],
      mitreTechniques: [],
      selectedTacticId: "",
      selectedTechId: "",
      mitreSearch: "",
    };
  },
  computed: {
    activePulse() {
      const all = [...this.pulses, ...this.subscribedPulses];
      const match = all.find(p => p.id === this.activePulseId);
      return match || this.pulses[0] || null;
    },
    totalIndicators() { return this.pulses.reduce((t, p) => t + (p.indicatorCount || 0), 0); },
    uniqueTagCount() { return new Set(this.pulses.flatMap(p => p.tags)).size; },
    lastUpdatedLabel() {
      const dates = this.pulses.map(p => new Date(p.modified).getTime()).filter(t => !isNaN(t));
      if (!dates.length) return "-";
      return this.formatDate(new Date(Math.max(...dates)));
    },
    activeIndicators() {
      if (!this.activePulse) return [];
      return (this.activePulse.indicators || []).slice(0, 15).map((i, idx) => ({ key: idx, type: i.type, value: i.value }));
    },
    currentTactic() { return this.mitreTactics.find(t => t.id === this.selectedTacticId); },
    filteredTechniques() {
      let f = this.mitreTechniques;
      if (this.selectedTacticId) f = f.filter(t => t.tactic_refs?.includes(this.selectedTacticId));
      if (this.mitreSearch) {
        const s = this.mitreSearch.toLowerCase();
        f = f.filter(t => t.name.toLowerCase().includes(s) || t.external_id.toLowerCase().includes(s));
      }
      return f;
    },
    selectedTech() { return this.mitreTechniques.find(t => t.id === this.selectedTechId); }
  },
  watch: {
    activeModule(v) { if (v === 'mitre' && !this.mitreTactics.length) this.loadMitreData(); }
  },
  mounted() {
    this.apiKey = localStorage.getItem(API_KEY_STORAGE) || "";
    this.loadFeed();
    this.loadSubscribedFeed();
  },
  methods: {
    async loadFeed() {
      this.loading = true;
      this.error = "";
      console.log("LeadDev: Fetching OTX pulses with query:", this.query);
      try {
        const p = new URLSearchParams({ 
          mode: "pulses", 
          feed: this.query ? "search" : "recent", 
          page: String(this.page), 
          limit: String(this.limit) 
        });
        if (this.query) p.set("q", this.query);
        
        const data = await this.requestJson(`/api/otx?${p.toString()}`);
        console.log("LeadDev: API Raw Data received, pulses count:", data?.results?.length || data?.pulses?.length || 0);
        
        const normalized = this.normalizePulseFeedPayload(data);
        const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        
        // Let's be more careful with filtering
        let filtered = normalized.pulses.filter(x => {
          if (!x.modified) return true; // Keep it if we don't know the date
          const modTime = new Date(x.modified).getTime();
          if (isNaN(modTime)) return true;
          return (now - modTime) <= TWO_YEARS_MS;
        });

        // Fallback: If filter is too strict and returns nothing, but we HAVE data, show all
        if (filtered.length === 0 && normalized.pulses.length > 0) {
          console.warn("LeadDev: Filter returned 0 but raw had data. Relaxing filter.");
          filtered = normalized.pulses;
        }

        this.pulses = filtered.sort((a, b) => {
          const timeA = new Date(a.modified).getTime();
          const timeB = new Date(b.modified).getTime();
          return (timeB || 0) - (timeA || 0);
        });

        this.resultCount = normalized.count || this.pulses.length;
        this.hasNextPage = normalized.next;
        
        // Auto-select first pulse if none active or current one not in new list
        if (!this.activePulseId && this.pulses.length) {
          this.activePulseId = this.pulses[0].id;
        }
      } catch (e) { 
        console.error("LeadDev: LoadFeed Critical Error:", e);
        this.error = e.message; 
      } finally { 
        this.loading = false; 
      }
    },
    async loadSubscribedFeed() {
      this.subscribedLoading = true;
      try {
        const data = await this.requestJson(`/api/otx?mode=pulses&feed=subscribed&limit=5`);
        this.subscribedPulses = this.normalizePulseFeedPayload(data).pulses;
      } finally { this.subscribedLoading = false; }
    },
    async loadMitreData() {
      this.mitreLoading = true;
      try {
        this.mitreTactics = [
          { id: 'recon', external_id: 'TA0043', name: 'Reconnaissance', description: 'Gathering information.' },
          { id: 'res-dev', external_id: 'TA0042', name: 'Resource Development', description: 'Establishing infrastructure.' },
          { id: 'init-access', external_id: 'TA0001', name: 'Initial Access', description: 'Entry vectors.' },
          { id: 'exec', external_id: 'TA0002', name: 'Execution', description: 'Running code.' },
          { id: 'persist', external_id: 'TA0003', name: 'Persistence', description: 'Maintaining foothold.' },
          { id: 'priv-esc', external_id: 'TA0004', name: 'Privilege Escalation', description: 'Higher permissions.' },
          { id: 'def-evas', external_id: 'TA0005', name: 'Defense Evasion', description: 'Avoiding detection.' },
          { id: 'cred-acc', external_id: 'TA0006', name: 'Credential Access', description: 'Stealing credentials.' },
          { id: 'discov', external_id: 'TA0007', name: 'Discovery', description: 'Gaining knowledge.' },
          { id: 'lat-mov', external_id: 'TA0008', name: 'Lateral Movement', description: 'Moving through network.' },
          { id: 'collect', external_id: 'TA0009', name: 'Collection', description: 'Gathering data.' },
          { id: 'c2', external_id: 'TA0011', name: 'Command and Control', description: 'Communication.' },
          { id: 'exfil', external_id: 'TA0010', name: 'Exfiltration', description: 'Stealing data.' },
          { id: 'impact', external_id: 'TA0040', name: 'Impact', description: 'Compromise availability.' }
        ];
        this.mitreTechniques = [
          { id: 't1', external_id: 'T1566', name: 'Phishing', tactic_refs: ['init-access'], description: 'Sending phishing messages.', platforms: ['Windows', 'macOS'] },
          { id: 't2', external_id: 'T1190', name: 'Exploit Public Application', tactic_refs: ['init-access'], description: 'Taking advantage of weaknesses.', platforms: ['Linux', 'Windows'] },
          { id: 't3', external_id: 'T1059', name: 'Command Interpreter', tactic_refs: ['exec'], description: 'Abusing interpreters.', platforms: ['Windows', 'Linux'] }
        ];
        this.selectedTacticId = this.mitreTactics[2].id;
      } finally { this.mitreLoading = false; }
    },
    async requestJson(url) {
      const h = { Accept: "application/json" };
      if (this.apiKey && url.includes('otx')) h["X-OTX-API-KEY"] = this.apiKey;
      const r = await fetch(url, { headers: h });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    },
    normalizePulseFeedPayload(payload) {
      if (!payload) return { count: 0, next: false, pulses: [] };
      const rawResults = payload.results || payload.pulses || [];
      
      const pulses = rawResults.map((pulse, index) => {
        // Defensive extraction of indicators
        const rawIndicators = pulse.indicators || [];
        const normalizedIndicators = Array.isArray(rawIndicators) 
          ? rawIndicators.map(i => ({
              type: String(i.type || i.indicator_type || "IOC"),
              value: String(i.indicator || i.value || "")
            })).filter(i => i.value)
          : [];

        return {
          id: String(pulse.id || pulse.pulse_id || `idx-${index}`),
          name: pulse.name || "Untitled Threat Pulse",
          description: pulse.description || "",
          author: pulse.author_name || "OTX Contributor",
          modified: pulse.modified || pulse.created || new Date().toISOString(),
          tlp: String(pulse.tlp || "WHITE").toUpperCase(),
          tags: Array.isArray(pulse.tags) ? pulse.tags.map(String) : [],
          indicatorCount: Number(pulse.indicator_count || normalizedIndicators.length),
          indicators: normalizedIndicators,
          adversary: pulse.adversary || "",
          malwareFamilies: Array.isArray(pulse.malware_families) ? pulse.malware_families : [],
          industries: Array.isArray(pulse.industries) ? pulse.industries : [],
          targetCountries: Array.isArray(pulse.targeted_countries) ? pulse.targeted_countries : [],
          references: Array.isArray(pulse.references) ? pulse.references : []
        };
      });

      return {
        count: Number(payload.count) || pulses.length,
        next: Boolean(payload.next),
        pulses
      };
    },
    applySearch() { this.query = this.queryDraft; this.page = 1; this.loadFeed(); },
    usePreset(p) { this.query = p; this.queryDraft = p; this.page = 1; this.loadFeed(); },
    goPage(p) { this.page = p; this.loadFeed(); },
    viewSubscribedPulse(p) { this.activePulseId = p.id; },
    formatDate(v) { if (!v) return "-"; const d = new Date(v); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); },
    formatNumber(v) { return new Intl.NumberFormat().format(v || 0); }
  }
};
</script>

<style scoped>
.tif-page { display: flex; flex-direction: column; gap: 1.5rem; padding: 2rem; background: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; color: #1e293b; }

/* Header & Nav */
.tif-header { display: flex; flex-direction: column; gap: 1.5rem; }
.tif-header-main { display: flex; justify-content: space-between; align-items: center; }
.tif-brand { display: flex; align-items: center; gap: 1rem; }
.tif-icon-box { width: 3.5rem; height: 3.5rem; background: linear-gradient(135deg, #0f766e, #134e4a); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; box-shadow: 0 10px 15px -3px rgba(15, 118, 110, 0.3); }
.tif-title { font-size: 1.75rem; font-weight: 900; margin: 0; letter-spacing: -0.02em; }
.tif-kicker { font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }

.tif-sub-navbar { display: flex; gap: 1rem; background: white; padding: 0.5rem; border-radius: 14px; border: 1px solid #e2e8f0; }
.tif-sub-nav-item { flex: 1; border: none; background: transparent; padding: 0.75rem 1.25rem; display: flex; align-items: center; gap: 1rem; border-radius: 10px; cursor: pointer; transition: 0.2s; text-align: left; }
.tif-sub-nav-item.active { background: #f0fdfa; border: 1px solid #ccfbf1; }
.tif-sub-nav-item i { font-size: 1.25rem; color: #94a3b8; }
.tif-sub-nav-item.active i { color: #0f766e; }
.sub-nav-text span { display: block; font-weight: 800; font-size: 0.9rem; }
.sub-nav-text small { color: #94a3b8; font-size: 0.7rem; font-weight: 600; }

.tif-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.tif-summary-card { background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; }
.tif-summary-card label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 0.5rem; }
.tif-number { font-size: 1.5rem; font-weight: 900; color: #0f766e; }

/* Main Layout */
.tif-main-layout { display: grid; grid-template-columns: 20rem 1fr 24rem; gap: 1.5rem; align-items: start; }
.tif-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
.tif-widget { background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
.tif-widget-head { padding: 1rem 1.25rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.tif-widget-head h3 { font-size: 0.85rem; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 0.5rem; }

.tif-widget-item { padding: 1rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
.tif-widget-item.active { background: #f0fdfa; border-left: 4px solid #0f766e; }
.tif-widget-item-main strong { display: block; font-size: 0.8rem; margin-bottom: 0.2rem; }
.tif-widget-item-main span { font-size: 0.7rem; color: #94a3b8; }

.tif-content { display: flex; flex-direction: column; gap: 1rem; min-width: 0; }
.tif-nav-toolbar { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  background: white; 
  padding: 0.75rem 1.25rem; 
  border-radius: 12px; 
  border: 1px solid #e2e8f0; 
  gap: 2rem;
}

.tif-search-group { 
  display: flex; 
  align-items: center; 
  gap: 0.75rem; 
  flex: 1; 
}

.tif-search-group input { 
  border: none; 
  outline: none; 
  flex: 1; 
  font-weight: 500; 
  font-size: 0.9rem;
  background: transparent;
}

.btn-search-trigger { 
  padding: 0.4rem 1rem; 
  background: #0f766e; 
  color: white; 
  border: none; 
  border-radius: 6px; 
  font-weight: 700; 
  font-size: 0.8rem; 
  cursor: pointer;
}

.tif-quick-filters { 
  display: flex; 
  align-items: center; 
  gap: 1rem; 
}

.filter-label { 
  font-size: 0.7rem; 
  font-weight: 800; 
  color: #94a3b8; 
  text-transform: uppercase; 
  white-space: nowrap;
}

.filter-pills { 
  display: flex; 
  gap: 0.5rem; 
  flex-wrap: wrap; 
}

.tif-nav-link { 
  padding: 0.35rem 0.75rem; 
  font-size: 0.75rem; 
  font-weight: 700; 
  color: #64748b; 
  border: 1px solid #e2e8f0; 
  background: #f8fafc; 
  border-radius: 6px; 
  cursor: pointer;
  transition: all 0.2s;
}

.tif-nav-link:hover { border-color: #0f766e; color: #0f766e; }
.tif-nav-link.active { background: #0f766e; color: white; border-color: #0f766e; }

/* Cards */
.tif-pulse-scroll-area { 
  max-height: calc(100vh - 28rem); 
  overflow-y: auto; 
  padding-right: 0.75rem; 
  margin-top: 0.5rem;
}

.tif-pulse-card { 
  background: white; 
  padding: 1.25rem; 
  border-radius: 12px; 
  border: 1px solid #e2e8f0; 
  margin-bottom: 1rem; 
  cursor: pointer; 
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tif-pulse-card:hover { border-color: #0f766e; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(15, 118, 110, 0.05); }
.tif-pulse-card.active { border-color: #0f766e; background: #f0fdfa; border-left: 4px solid #0f766e; }

.tif-card-header { display: flex; justify-content: space-between; align-items: center; }
.tif-tlp { font-size: 0.6rem; font-weight: 900; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase; }
.tif-tlp.white { background: #f1f5f9; color: #475569; }
.tif-tlp.green { background: #dcfce7; color: #166534; }
.tif-tlp.amber { background: #fef3c7; color: #92400e; }
.tif-tlp.red { background: #fee2e2; color: #991b1b; }

.tif-ioc-count { font-size: 0.7rem; font-weight: 700; color: #64748b; }

.tif-card-title { font-size: 1rem; font-weight: 800; margin: 0; color: #1e293b; line-height: 1.4; }
.tif-card-desc { font-size: 0.8rem; color: #64748b; line-height: 1.5; margin: 0; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

.tif-card-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tif-tag-mini { font-size: 0.65rem; font-weight: 700; color: #0f766e; background: rgba(15, 118, 110, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px; }

.tif-card-footer { display: flex; gap: 1rem; font-size: 0.7rem; color: #94a3b8; font-weight: 600; padding-top: 0.75rem; border-top: 1px solid #f1f5f9; }
.tif-card-footer span { display: flex; align-items: center; gap: 0.4rem; }

/* Inspector */
.tif-inspector { 
  background: white; 
  border-radius: 16px; 
  border: 1px solid #e2e8f0; 
  height: calc(100vh - 12rem); 
  position: sticky; 
  top: 1.5rem; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden; 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
}

.tif-inspector.empty { justify-content: center; align-items: center; color: #94a3b8; text-align: center; padding: 2rem; }
.tif-inspector-empty i { font-size: 2rem; margin-bottom: 1rem; opacity: 0.5; }

.tif-ins-header { padding: 1.5rem; border-bottom: 1px solid #f1f5f9; position: relative; }
.tif-ins-tlp-bar { position: absolute; top: 0; left: 0; right: 0; height: 4px; }
.tif-ins-header.white .tif-ins-tlp-bar { background: #cbd5e1; }
.tif-ins-header.green .tif-ins-tlp-bar { background: #22c55e; }
.tif-ins-header.amber .tif-ins-tlp-bar { background: #f59e0b; }
.tif-ins-header.red .tif-ins-tlp-bar { background: #ef4444; }

.ins-title-scroll { font-size: 1.25rem; font-weight: 900; color: #1e293b; margin: 0.5rem 0 0; line-height: 1.3; }

.tif-ins-body { padding: 1.5rem; flex: 1; overflow-y: auto; }
.tif-ins-section { margin-bottom: 1.75rem; }
.tif-ins-label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.75rem; letter-spacing: 0.05em; }
.tif-ins-label::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }

.tif-ins-context-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.tif-ins-context-item label { font-size: 0.65rem; color: #94a3b8; font-weight: 700; display: block; margin-bottom: 0.25rem; }
.tif-ins-context-item strong { font-size: 0.85rem; color: #1e293b; }

.tif-ins-ioc-list { display: flex; flex-direction: column; gap: 0.5rem; }
.tif-ins-ioc-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
.tif-ioc-type { font-size: 0.6rem; font-weight: 800; background: #f0fdfa; color: #0f766e; padding: 0.2rem 0.4rem; border-radius: 4px; min-width: 4rem; text-align: center; }
.tif-ioc-value { font-size: 0.75rem; font-family: 'JetBrains Mono', monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #334155; }

.tif-ins-desc { font-size: 0.85rem; color: #475569; line-height: 1.6; margin: 0; }

/* MITRE Specific */
.tif-tactic-btn { width: 100%; border: none; background: transparent; padding: 1rem; text-align: left; border-bottom: 1px solid #f1f5f9; cursor: pointer; display: flex; flex-direction: column; transition: all 0.2s; }
.tif-tactic-btn:hover:not(.active) { background: #f8fafc; }
.tif-tactic-btn.active { background: #f0fdfa; border-left: 4px solid #0f766e; }
.tactic-id { font-size: 0.6rem; font-weight: 800; color: #0f766e; margin-bottom: 0.25rem; }
.tactic-name { font-weight: 700; font-size: 0.85rem; color: #1e293b; }

.tif-technique-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: 1rem; max-height: calc(100vh - 22rem); overflow-y: auto; padding-right: 0.5rem; }
.tif-tech-card { background: white; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 0.5rem; }
.tif-tech-card:hover { border-color: #0f766e; transform: translateY(-2px); }
.tif-tech-card.active { border-color: #0f766e; background: #f0fdfa; border-left: 4px solid #0f766e; }

.tech-id { font-size: 0.65rem; font-weight: 800; color: #94a3b8; }
.tech-name { font-weight: 800; font-size: 0.9rem; color: #1e293b; margin: 0; }
.tech-summary { font-size: 0.75rem; color: #64748b; line-height: 1.4; margin: 0; }

.tif-ins-header.mitre .tif-ins-tlp-bar { background: #0f766e; }
.tif-tech-id-badge { font-size: 0.7rem; font-weight: 900; color: #0f766e; background: rgba(15, 118, 110, 0.1); padding: 0.2rem 0.6rem; border-radius: 4px; display: inline-block; margin-top: 0.5rem; }
.tif-mitre-desc { font-size: 0.85rem; color: #475569; line-height: 1.6; }

.scroll-y::-webkit-scrollbar { width: 5px; }
.scroll-y::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.scroll-y::-webkit-scrollbar-track { background: transparent; }

.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.btn-premium-small { padding: 0.5rem 1.25rem; background: white; border: 2px solid #0f766e; color: #0f766e; border-radius: 8px; font-weight: 800; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
.btn-premium-small:hover { background: #0f766e; color: white; }

@media (max-width: 1400px) {
  .tif-main-layout { grid-template-columns: 18rem 1fr; }
  .tif-inspector { display: none; }
}
</style>
