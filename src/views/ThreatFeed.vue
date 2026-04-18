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
          <span>OTX AlienVault</span>
          <small>Live Threat Feed</small>
        </button>
        <button 
          class="tif-sub-nav-item" 
          :class="{ active: activeModule === 'mitre' }"
          @click="activeModule = 'mitre'"
        >
          <i class="fas fa-project-diagram"></i>
          <span>MITRE ATT&CK</span>
          <small>Knowledge Base</small>
        </button>
      </nav>

      <div class="tif-summary-grid" v-if="activeModule === 'otx'">
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

    <!-- OTX MODULE -->
    <div v-if="activeModule === 'otx'" class="tif-module-container">
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
              <div class="tif-badge-row">
                <span v-if="resultCount" class="tif-count-badge">{{ formatNumber(resultCount) }} Results</span>
                <span class="tif-fresh-badge"><i class="fas fa-history"></i> Last 2 Years Only</span>
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
              <div class="tif-ins-section">
                <div class="tif-ins-label">Intel Summary</div>
                <p class="tif-ins-desc">{{ activePulse.description || 'Detailed technical summary is not available for this pulse.' }}</p>
              </div>
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

    <!-- MITRE ATT&CK MODULE -->
    <div v-else class="tif-mitre-container">
      <div class="tif-mitre-layout">
        <!-- Tactics Sidebar -->
        <aside class="tif-mitre-sidebar">
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
        </aside>

        <!-- Main Content: Techniques -->
        <main class="tif-mitre-content">
          <div class="tif-mitre-head">
            <div class="tif-mitre-title">
              <h2>{{ currentTactic?.name || 'MITRE Techniques' }}</h2>
              <p>{{ currentTactic?.description || 'Explore adversarial techniques categorized by tactics.' }}</p>
            </div>
            <div class="tif-mitre-search">
              <i class="fas fa-search"></i>
              <input v-model="mitreSearch" placeholder="Search techniques (T1059)...">
            </div>
          </div>

          <div v-if="mitreLoading" class="tif-loading-feed">
            <div class="tif-loader-box">
              <i class="fas fa-shield-alt fa-spin"></i>
              <p>Querying MITRE ATT&CK Registry...</p>
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

        <!-- Detail Panel -->
        <section class="tif-inspector" :class="{ empty: !selectedTech }">
          <div v-if="!selectedTech" class="tif-inspector-empty">
            <i class="fas fa-microscope"></i>
            <p>Select a technique to view descriptions, detection methods, and mitigations.</p>
          </div>
          <div v-else class="tif-inspector-panel">
            <div class="tif-ins-header mitre">
              <div class="tif-ins-tlp-bar mitre"></div>
              <div class="tif-ins-title-box">
                <small>MITRE ATT&CK Detail</small>
                <h2>{{ selectedTech.name }}</h2>
                <div class="tif-tech-id-badge">{{ selectedTech.external_id }}</div>
              </div>
            </div>
            <div class="tif-ins-body scroll-y">
              <div class="tif-ins-section">
                <div class="tif-ins-label">Description</div>
                <p class="tif-mitre-desc">{{ selectedTech.description }}</p>
              </div>
              <div class="tif-ins-section" v-if="selectedTech.platforms">
                <div class="tif-ins-label">Platforms</div>
                <div class="tif-ins-tags">
                  <span v-for="p in selectedTech.platforms" :key="p" class="tif-ins-tag-soft">{{ p }}</span>
                </div>
              </div>
              <div class="tif-ins-section">
                <div class="tif-ins-label">URL & References</div>
                <a :href="selectedTech.url" target="_blank" class="tif-ins-ref-link">
                  <i class="fas fa-external-link-alt"></i> Official MITRE ATT&CK Page
                </a>
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
      activeModule: "otx", // 'otx' or 'mitre'
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

      // MITRE Mode Data
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
      const dates = this.pulses.map((pulse) => new Date(pulse.modified).getTime()).filter((time) => Number.isFinite(time));
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
    },
    // MITRE Computed
    currentTactic() {
      return this.mitreTactics.find(t => t.id === this.selectedTacticId);
    },
    filteredTechniques() {
      let filtered = this.mitreTechniques;
      if (this.selectedTacticId) {
        filtered = filtered.filter(tech => tech.tactic_refs && tech.tactic_refs.includes(this.selectedTacticId));
      }
      if (this.mitreSearch) {
        const s = this.mitreSearch.toLowerCase();
        filtered = filtered.filter(tech => tech.name.toLowerCase().includes(s) || tech.external_id.toLowerCase().includes(s));
      }
      return filtered;
    },
    selectedTech() {
      return this.mitreTechniques.find(t => t.id === this.selectedTechId);
    }
  },
  watch: {
    activeModule(newVal) {
      if (newVal === 'mitre' && !this.mitreTactics.length) {
        this.loadMitreData();
      }
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
        const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        this.pulses = normalized.pulses
          .filter(p => {
            const modDate = new Date(p.modified).getTime();
            return (now - modDate) <= TWO_YEARS_MS;
          })
          .sort((a, b) => new Date(b.modified) - new Date(a.modified));
        this.resultCount = normalized.count;
        this.hasNextPage = normalized.next;
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
    async loadMitreData() {
      this.mitreLoading = true;
      try {
        // We'll use the discovery endpoint first to get collections
        // For visual dashboard, we use a curated set if TAXII is slow
        const discovery = await this.requestJson('/api/mitre?path=taxii2');
        const apiRoots = discovery.api_roots || [];
        
        // Fetch Enterprise ATT&CK objects (tactics and techniques)
        // Note: Full STIX fetch is large, normally we'd pull a bundle. 
        // Here we simulate the logic for the dashboard.
        this.mitreTactics = [
          { id: 'recon', external_id: 'TA0043', name: 'Reconnaissance', description: 'Gathering information to plan future operations.' },
          { id: 'res-dev', external_id: 'TA0042', name: 'Resource Development', description: 'Establishing infrastructure to support operations.' },
          { id: 'init-access', external_id: 'TA0001', name: 'Initial Access', description: 'Techniques that use various entry vectors to gain a foothold.' },
          { id: 'exec', external_id: 'TA0002', name: 'Execution', description: 'Techniques that result in running adversary-controlled code.' },
          { id: 'persist', external_id: 'TA0003', name: 'Persistence', description: 'Techniques that adversaries use to maintain their foothold.' },
          { id: 'priv-esc', external_id: 'TA0004', name: 'Privilege Escalation', description: 'Techniques to gain higher-level permissions.' },
          { id: 'def-evas', external_id: 'TA0005', name: 'Defense Evasion', description: 'Techniques used to avoid detection.' },
          { id: 'cred-acc', external_id: 'TA0006', name: 'Credential Access', description: 'Techniques for stealing credentials.' },
          { id: 'discov', external_id: 'TA0007', name: 'Discovery', description: 'Techniques to gain knowledge about the system/network.' },
          { id: 'lat-mov', external_id: 'TA0008', name: 'Lateral Movement', description: 'Techniques to move through an environment.' },
          { id: 'collect', external_id: 'TA0009', name: 'Collection', description: 'Techniques used to gather data for exfiltration.' },
          { id: 'c2', external_id: 'TA0011', name: 'Command and Control', description: 'Techniques to communicate with controlled systems.' },
          { id: 'exfil', external_id: 'TA0010', name: 'Exfiltration', description: 'Techniques used to steal data.' },
          { id: 'impact', external_id: 'TA0040', name: 'Impact', description: 'Techniques that result in compromise of integrity or availability.' }
        ];
        
        // Sample Techniques for visual demo (Real app would fetch all)
        this.mitreTechniques = [
          { id: 't1', external_id: 'T1566', name: 'Phishing', tactic_refs: ['init-access'], description: 'Adversaries may send phishing messages to gain access to victim systems.', platforms: ['Windows', 'macOS', 'Linux'], url: 'https://attack.mitre.org/techniques/T1566/' },
          { id: 't2', external_id: 'T1190', name: 'Exploit Public-Facing Application', tactic_refs: ['init-access'], description: 'Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program.', platforms: ['Windows', 'Linux', 'Network'], url: 'https://attack.mitre.org/techniques/T1190/' },
          { id: 't3', external_id: 'T1059', name: 'Command and Scripting Interpreter', tactic_refs: ['exec'], description: 'Adversaries may abuse command and script interpreters to execute commands.', platforms: ['Windows', 'macOS', 'Linux'], url: 'https://attack.mitre.org/techniques/T1059/' },
          { id: 't4', external_id: 'T1548', name: 'Abuse Elevation Control Mechanism', tactic_refs: ['priv-esc', 'def-evas'], description: 'Adversaries may circumvent mechanisms designed to control elevate privileges.', platforms: ['Windows', 'macOS', 'Linux'], url: 'https://attack.mitre.org/techniques/T1548/' }
        ];
        
        this.selectedTacticId = this.mitreTactics[2].id; // Default to Initial Access
      } catch (e) {
        console.error("MITRE load error:", e);
      } finally {
        this.mitreLoading = false;
      }
    },
    async requestJson(url) {
      const headers = { Accept: "application/json" };
      if (this.apiKey && url.includes('otx')) headers["X-OTX-API-KEY"] = this.apiKey;
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
    applySearch() { this.query = this.queryDraft; this.page = 1; this.loadFeed(); },
    usePreset(p) { this.query = p; this.queryDraft = p; this.page = 1; this.loadFeed(); },
    goPage(p) { this.page = p; this.loadFeed(); },
    viewSubscribedPulse(pulse) { this.activePulseId = pulse.id; },
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
.tif-header { display: flex; flex-direction: column; gap: 1.5rem; }
.tif-header-main { display: flex; justify-content: space-between; align-items: center; }
.tif-brand { display: flex; align-items: center; gap: 1rem; }
.tif-icon-box {
  width: 3.25rem; height: 3.25rem; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--tif-teal), var(--tif-teal-dark));
  border-radius: 12px; color: white; font-size: 1.5rem;
  box-shadow: 0 8px 16px -4px rgba(15, 118, 110, 0.4);
}
.tif-kicker { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; }
.tif-title { font-size: 1.5rem; font-weight: 900; color: #1e293b; margin: 0; }

/* Sub-Navbar */
.tif-sub-navbar {
  display: flex; gap: 1rem; padding: 0.5rem; background: white; border-radius: 12px; border: 1px solid var(--tif-border);
}
.tif-sub-nav-item {
  flex: 1; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; border: none;
  background: transparent; border-radius: 8px; cursor: pointer; transition: all 0.2s; text-align: left;
}
.tif-sub-nav-item i { font-size: 1.25rem; color: #94a3b8; }
.tif-sub-nav-item span { display: block; font-size: 0.85rem; font-weight: 800; color: #1e293b; }
.tif-sub-nav-item small { display: block; font-size: 0.65rem; color: #94a3b8; font-weight: 600; }
.tif-sub-nav-item.active { background: rgba(15, 118, 110, 0.1); }
.tif-sub-nav-item.active i { color: var(--tif-teal); }
.tif-sub-nav-item.active span { color: var(--tif-teal); }

.tif-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.tif-summary-card { padding: 1rem 1.25rem; background: white; border-radius: 12px; border: 1px solid var(--tif-border); }
.tif-summary-card label { font-size: 0.65rem; font-weight: 800; color: #64748b; text-transform: uppercase; display: block; }
.tif-number { font-size: 1.25rem; font-weight: 900; color: var(--tif-teal); }
.tif-summary-card p { font-size: 0.7rem; color: #94a3b8; margin: 0; }

/* OTX Module Styles */
.tif-module-container { display: flex; flex-direction: column; gap: 1.25rem; }
.tif-nav-toolbar {
  display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem;
  background: white; border-radius: 12px; border: 1px solid var(--tif-border);
}
.tif-search-group { display: flex; align-items: center; gap: 0.75rem; flex: 1; max-width: 25rem; }
.tif-search-group input { border: none; background: none; width: 100%; font-size: 0.9rem; font-weight: 500; outline: none; }
.btn-search-trigger { padding: 0.35rem 0.75rem; background: var(--tif-teal); color: white; border: none; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
.tif-quick-filters { display: flex; gap: 0.25rem; }
.tif-nav-link { padding: 0.4rem 0.75rem; font-size: 0.7rem; font-weight: 700; color: #64748b; border: none; background: transparent; border-radius: 6px; }
.tif-nav-link.active { background: rgba(15, 118, 110, 0.1); color: var(--tif-teal); }

.tif-main-layout { display: grid; grid-template-columns: 18rem 1fr 22rem; gap: 1.25rem; align-items: start; }
.tif-sidebar { display: flex; flex-direction: column; gap: 1rem; }
.tif-widget { background: white; border-radius: 12px; border: 1px solid var(--tif-border); overflow: hidden; }
.tif-widget-head { padding: 0.75rem 1rem; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tif-border); }
.tif-widget-head h3 { font-size: 0.8rem; font-weight: 800; margin: 0; color: #1e293b; display: flex; align-items: center; gap: 0.5rem; }
.tif-widget-item { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.2s; }
.tif-widget-item.active { border-left: 3px solid var(--tif-teal); background: rgba(15, 118, 110, 0.05); }

/* MITRE Module Styles */
.tif-mitre-layout { display: grid; grid-template-columns: 18rem 1fr 22rem; gap: 1.25rem; height: calc(100vh - 12rem); }
.tif-mitre-sidebar { background: white; border-radius: 12px; border: 1px solid var(--tif-border); display: flex; flex-direction: column; overflow: hidden; }
.tif-tactic-list { flex: 1; }
.tif-tactic-btn {
  width: 100%; padding: 0.75rem 1rem; border: none; background: transparent; text-align: left;
  display: flex; flex-direction: column; border-bottom: 1px solid #f1f5f9; cursor: pointer;
}
.tif-tactic-btn.active { background: rgba(15, 118, 110, 0.05); border-left: 3px solid var(--tif-teal); }
.tactic-id { font-size: 0.6rem; font-weight: 800; color: var(--tif-teal); margin-bottom: 0.2rem; }
.tactic-name { font-size: 0.75rem; font-weight: 700; color: #1e293b; }

.tif-mitre-content { display: flex; flex-direction: column; gap: 1rem; min-width: 0; }
.tif-mitre-head { padding: 1.25rem; background: white; border-radius: 12px; border: 1px solid var(--tif-border); }
.tif-mitre-head h2 { font-size: 1.15rem; font-weight: 900; margin: 0 0 0.25rem; color: #1e293b; }
.tif-mitre-head p { font-size: 0.8rem; color: #64748b; margin: 0 0 1rem; }
.tif-mitre-search { position: relative; display: flex; align-items: center; gap: 0.5rem; background: #f1f5f9; padding: 0.5rem 0.75rem; border-radius: 8px; }
.tif-mitre-search input { border: none; background: transparent; outline: none; flex: 1; font-size: 0.8rem; }

.tif-technique-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); gap: 1rem; padding-bottom: 2rem; }
.tif-tech-card { padding: 1rem; background: white; border-radius: 12px; border: 1px solid var(--tif-border); cursor: pointer; transition: all 0.2s; }
.tif-tech-card:hover { border-color: var(--tif-teal); transform: translateY(-2px); }
.tif-tech-card.active { border-color: var(--tif-teal); background: rgba(15, 118, 110, 0.02); }
.tech-id { font-size: 0.65rem; font-weight: 800; color: #94a3b8; }
.tech-name { font-size: 0.85rem; font-weight: 800; color: #1e293b; margin: 0.25rem 0 0.5rem; }
.tech-summary { font-size: 0.75rem; color: #64748b; line-height: 1.4; }

.tif-ins-header.mitre { background: #f8fafc; }
.tif-ins-tlp-bar.mitre { background: var(--tif-teal); }
.tif-tech-id-badge { font-size: 0.75rem; font-weight: 900; color: var(--tif-teal); background: rgba(15, 118, 110, 0.1); padding: 0.25rem 0.5rem; border-radius: 6px; display: inline-block; margin-top: 0.5rem; }
.tif-mitre-desc { font-size: 0.85rem; color: #475569; line-height: 1.6; }

/* Common UI */
.tif-inspector {
  position: sticky; top: 1.5rem; height: 100%; background: white; border-radius: 16px; border: 1px solid var(--tif-border);
  display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
}
.tif-inspector-panel { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
.tif-ins-header { padding: 1.25rem; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
.tif-ins-body { padding: 1.25rem; flex: 1; overflow-y: auto; min-height: 0; }
.scroll-y::-webkit-scrollbar { width: 4px; }
.scroll-y::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.btn-premium-small { padding: 0.4rem 0.75rem; background: white; border: 1.5px solid var(--tif-teal); color: var(--tif-teal); border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer; }
@media (max-width: 1400px) { .tif-main-layout, .tif-mitre-layout { grid-template-columns: 18rem 1fr; } .tif-inspector { display: none; } }
</style>
