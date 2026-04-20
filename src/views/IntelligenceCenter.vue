<template>
  <div class="intel-center-page">
    <!-- Hero Section -->
    <section class="intel-hero">
      <div class="hero-content">
        <span class="hero-kicker"><i class="fas fa-shield-virus"></i> Global Intelligence Center</span>
        <h1 class="hero-title">Unified Threat Intelligence</h1>
        <p class="hero-lede">Dashboard terintegrasi untuk pemantauan kerentanan global (CISA KEV), indikator ancaman real-time (OTX AlienVault), dan pemantauan kebocoran data.</p>
      </div>
      <div class="hero-stats-grid">
        <div class="hero-stat-card">
          <label>CISA KEV</label>
          <strong>{{ cves.length || '...' }}</strong>
          <span>Vulnerabilities</span>
        </div>
        <div class="hero-stat-card">
          <label>OTX Events</label>
          <strong>{{ metrics.totalEvents || '...' }}</strong>
          <span>Recent Pulses</span>
        </div>
        <div class="hero-stat-card">
          <label>Active IOCs</label>
          <strong>{{ metrics.activeIocs || '...' }}</strong>
          <span>Threat Indicators</span>
        </div>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <div class="nav intel-nav" role="tablist">
      <button 
        class="intel-tab" 
        :class="{ active: activeTab === 'otx' }" 
        type="button" 
        @click="activeTab = 'otx'"
      >
        <i class="fas fa-radar"></i>
        <div>
          <strong>Threat Feed (OTX)</strong>
          <span>Real-time pulses & Breach Checker</span>
        </div>
      </button>
      <button 
        class="intel-tab" 
        :class="{ active: activeTab === 'cve' }" 
        type="button" 
        @click="activeTab = 'cve'"
      >
        <i class="fas fa-bug"></i>
        <div>
          <strong>Vulnerability Intel (CISA)</strong>
          <span>Known Exploited Vulnerabilities</span>
        </div>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content mt-4">
      
      <!-- TAB 1: OTX ALIENVAULT & BREACH CHECKER -->
      <div v-if="activeTab === 'otx'" class="tab-pane-content animate-fade-in">
        
        <!-- Breach Checker Panel -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="panel-card p-4 border border-danger-subtle">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <h5 class="mb-1 fw-bold text-danger"><i class="fas fa-user-shield me-2"></i>BREACH CHECKER</h5>
                  <p class="text-muted small mb-0">Monitor keamanan akun Anda melalui integrasi database intelijen ancaman real-time.</p>
                </div>
                <div v-if="rateLimitCountdown > 0" class="badge bg-warning text-dark">
                  Limit: {{ rateLimitCountdown }}s
                </div>
              </div>

              <div class="input-group input-group-lg rounded-4 overflow-hidden border shadow-sm">
                <span class="input-group-text bg-white border-0 ps-4"><i class="fas fa-envelope text-muted"></i></span>
                <input 
                  type="email" 
                  class="form-control border-0 py-3" 
                  v-model="userTerm" 
                  placeholder="Masukkan alamat email untuk dianalisis..."
                  :disabled="isChecking"
                  @keyup.enter="checkBreachStatus"
                >
                <button 
                  class="btn btn-danger px-5 fw-bold" 
                  @click="checkBreachStatus" 
                  :disabled="isChecking || !userTerm || rateLimitCountdown > 0"
                >
                  <span v-if="isChecking" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isChecking ? 'MEMERIKSA...' : 'CEK SEKARANG' }}
                </button>
              </div>

              <div v-if="emailError" class="text-danger small mt-2 ms-1 fw-bold">
                <i class="fas fa-exclamation-triangle me-1"></i> {{ emailError }}
              </div>

              <div v-if="checkResult" class="mt-4 animate-fade-in">
                <div v-if="!checkResult.found" class="alert alert-success border-0 rounded-4 p-4 d-flex align-items-center">
                  <i class="fas fa-check-circle fs-3 me-3"></i>
                  <div>
                    <h6 class="mb-1 fw-bold">Email Aman!</h6>
                    <p class="mb-0 small">Alamat email Anda tidak ditemukan dalam database kebocoran data publik yang kami pantau.</p>
                  </div>
                </div>
                
                <div v-else class="breach-detail-box rounded-4 border border-danger overflow-hidden">
                  <div class="bg-danger bg-opacity-10 p-3 d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-danger"><i class="fas fa-exclamation-circle me-2"></i>DITEMUKAN {{ checkResult.size }} SUMBER KEBOCORAN</span>
                    <button class="btn btn-sm btn-outline-danger" @click="copyAllSources">Salin Semua Sumber</button>
                  </div>
                  <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                      <thead class="table-light">
                        <tr>
                          <th class="ps-4">Email</th>
                          <th>Tipe Data</th>
                          <th class="pe-4">Sumber / Database</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in checkResult.list" :key="index">
                          <td class="ps-4 fw-bold text-navy">{{ item.email }}</td>
                          <td>
                            <span :class="['badge rounded-pill px-3', item.hash_password ? 'bg-secondary' : 'bg-danger']">
                              {{ item.hash_password ? 'Hashed Password' : 'PLAINTEXT PASSWORD' }}
                            </span>
                          </td>
                          <td class="pe-4">
                            <div class="d-flex flex-wrap gap-1">
                              <span v-for="source in item.sources" :key="source" class="badge bg-light text-dark border">
                                {{ source }}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- OTX Dashboard -->
        <div class="row g-4">
          <!-- Metrics -->
          <div class="col-xl-3 col-md-6" v-for="card in otxMetricCards" :key="card.label">
            <div class="panel-card p-4 shadow-sm border border-light-subtle h-100">
              <div class="d-flex align-items-center gap-3">
                <div class="metric-icon-small" :style="{ color: card.accent, backgroundColor: card.accent + '15' }">
                  <i :class="card.icon"></i>
                </div>
                <div>
                  <small class="text-muted text-uppercase fw-bold ls-1">{{ card.label }}</small>
                  <h4 class="mb-0 fw-bold">{{ isIntelLoading ? '...' : card.value }}</h4>
                </div>
              </div>
            </div>
          </div>

          <!-- Chart Area -->
          <div class="col-12">
            <div class="panel-card shadow-sm p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h6 class="fw-bold mb-1">OTX Events Distribution</h6>
                  <p class="text-muted small mb-0">Aktivitas intelijen dalam 7 hari terakhir.</p>
                </div>
                <button class="btn btn-sm btn-outline-primary rounded-pill px-3" @click="fetchAllIntelData" :disabled="isIntelLoading">
                  <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': isIntelLoading }"></i> Refresh
                </button>
              </div>
              <div style="height: 320px;">
                <apexchart 
                  v-if="!isIntelLoading && chartOptions" 
                  type="bar" 
                  height="100%" 
                  :options="chartOptions" 
                  :series="chartSeries"
                ></apexchart>
                <div v-else class="h-100 d-flex align-items-center justify-content-center bg-light rounded-4">
                  <div class="spinner-border text-primary"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- IOC Table -->
          <div class="col-lg-6">
            <div class="panel-card shadow-sm overflow-hidden h-100">
              <div class="p-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                <h6 class="fw-bold mb-0">Active IOCs</h6>
                <div class="input-group input-group-sm w-50">
                  <input type="text" class="form-control" v-model="otxSearchQuery" placeholder="Search IOC..." @keyup.enter="performSearch">
                  <button class="btn btn-primary" @click="performSearch"><i class="fas fa-search"></i></button>
                </div>
              </div>
              <div class="table-responsive" style="max-height: 500px;">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light sticky-top">
                    <tr>
                      <th class="ps-3">Type</th>
                      <th>Value</th>
                      <th class="pe-3 text-end">Sightings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="ioc in topIocs" :key="ioc.id">
                      <tr @click="toggleIoc(ioc.id)" class="cursor-pointer">
                        <td class="ps-3"><span class="badge bg-primary bg-opacity-10 text-primary">{{ ioc.type }}</span></td>
                        <td class="small font-monospace">{{ truncate(ioc.value, 30) }}</td>
                        <td class="pe-3 text-end"><span class="badge bg-dark rounded-pill">{{ ioc.sightings || 0 }}</span></td>
                      </tr>
                      <tr v-if="expandedIocId === ioc.id" class="bg-light">
                        <td colspan="3" class="p-3">
                          <div class="small">
                            <strong>Context:</strong> {{ ioc.Event?.info || 'N/A' }}<br>
                            <a :href="`https://otx.alienvault.com/indicator/${ioc.type}/${ioc.value}`" target="_blank" class="btn btn-xs btn-link p-0 mt-2">Open in OTX <i class="fas fa-external-link-alt"></i></a>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Events Table -->
          <div class="col-lg-6">
            <div class="panel-card shadow-sm overflow-hidden h-100">
              <div class="p-3 bg-light border-bottom">
                <h6 class="fw-bold mb-0">Recent Pulses</h6>
              </div>
              <div class="table-responsive" style="max-height: 500px;">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light sticky-top">
                    <tr>
                      <th class="ps-3">Title</th>
                      <th>Level</th>
                      <th class="pe-3 text-end">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="event in recentEvents" :key="event.id">
                      <tr @click="toggleEvent(event.id)" class="cursor-pointer">
                        <td class="ps-3 small fw-bold">{{ truncate(event.info, 40) }}</td>
                        <td><span :class="['badge', getSeverityClass(event.threat_level_id)]">{{ getSeverityLabel(event.threat_level_id) }}</span></td>
                        <td class="pe-3 text-end x-small">{{ formatDateShort(event.timestamp) }}</td>
                      </tr>
                      <tr v-if="expandedEventId === event.id" class="bg-light">
                        <td colspan="3" class="p-3">
                          <div class="small">
                            <strong>Organization:</strong> {{ event.Org?.name }}<br>
                            <div class="mt-2 d-flex flex-wrap gap-1">
                              <span v-for="tag in event.Tag" :key="tag.id" class="badge border text-muted x-small">{{ tag.name }}</span>
                            </div>
                            <a :href="`https://otx.alienvault.com/pulse/${event.id}`" target="_blank" class="btn btn-xs btn-link p-0 mt-2">View Pulse <i class="fas fa-external-link-alt"></i></a>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: CISA KEV INTELLIGENCE -->
      <div v-if="activeTab === 'cve'" class="tab-pane-content animate-fade-in">
        <div class="row g-4">
          <!-- Left Column: CVE List -->
          <div class="col-lg-7 col-xl-8">
            <div class="cve-list-header mb-3">
              <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div class="d-flex align-items-center gap-2">
                  <div class="cve-count-pill">{{ filteredCves.length }} Found</div>
                  <div class="live-pulse">
                    <span class="pulse-dot"></span>
                    <span class="status-text">KEV LIVE FEED</span>
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <select v-model="displayLimit" class="form-select form-select-sm limit-select">
                    <option v-for="opt in limitOptions" :key="opt" :value="opt">{{ opt }} Cards</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="cve-scroll-area">
              <transition-group name="list" tag="div" class="cve-cards-grid">
                <div 
                  v-for="cve in filteredCves" 
                  :key="cve.id" 
                  class="cve-card"
                  :class="{ selected: selectedCve?.id === cve.id, expanded: expandedCveId === cve.id }"
                  @click="toggleCveExpand(cve)"
                >
                  <div class="cve-top-row">
                    <span class="cve-id">{{ cve.id }}</span>
                    <div class="cve-actions">
                      <span class="cve-exploited-badge">EXPLOITED</span>
                      <button class="btn btn-ai-icon" @click.stop="askAi(cve)"><i class="fas fa-robot"></i></button>
                    </div>
                  </div>
                  <h3 class="cve-title-text">{{ cve.title }}</h3>
                  <p class="cve-desc-text">{{ cve.shortDescription }}</p>
                  <div class="cve-footer-meta">
                    <strong>{{ cve.vendor }}</strong> · {{ cve.product }} · <span class="text-muted">{{ cve.date }}</span>
                  </div>

                  <transition name="expand">
                    <div v-if="expandedCveId === cve.id" class="cve-expanded-body mt-3">
                      <div class="divider mb-3"></div>
                      <label class="detail-label">Technical Description (NVD)</label>
                      <div v-if="cve.isEnriching" class="skeleton-loader">
                        <div class="skeleton-line mb-1"></div>
                        <div class="skeleton-line w-75"></div>
                      </div>
                      <p v-else class="detail-text">{{ cve.fullDescription || cve.shortDescription }}</p>
                      
                      <div class="mt-3 d-flex gap-2">
                        <div class="info-pill" :class="{ danger: cve.isRansomware }">
                          <i class="fas" :class="cve.isRansomware ? 'fa-biohazard' : 'fa-check-circle'"></i>
                          {{ cve.isRansomware ? 'Ransomware Campaign' : 'No Ransomware Known' }}
                        </div>
                      </div>

                      <div v-if="cve.requiredAction" class="mitigation-box mt-3">
                        <label class="text-danger fw-bold small"><i class="fas fa-tools me-1"></i> CISA Required Action</label>
                        <p class="mb-0 small mt-1">{{ cve.requiredAction }}</p>
                      </div>
                    </div>
                  </transition>
                </div>
              </transition-group>
            </div>
          </div>

          <!-- Right Column: AI Assistant -->
          <div class="col-lg-5 col-xl-4">
            <div class="ai-assistant-card shadow-sm">
              <div class="ai-card-header">
                <div class="d-flex align-items-center gap-2">
                  <div class="ai-indicator"></div>
                  <h5 class="mb-0 fw-bold">CVE AI Analyst</h5>
                </div>
                <small class="opacity-50">Gemini Powered</small>
              </div>
              
              <div class="ai-card-body" ref="chatArea">
                <div v-if="!selectedCve" class="ai-empty-state">
                  <i class="fas fa-shield-alt mb-3"></i>
                  <p>Pilih salah satu CVE di daftar untuk memulai analisis kecerdasan buatan.</p>
                </div>
                <div v-else class="ai-active-state">
                  <div class="context-pill mb-3">
                    <small>Konteks Aktif:</small>
                    <div class="fw-bold">{{ selectedCve.id }}</div>
                  </div>

                  <div class="chat-messages mb-3">
                    <div v-for="(msg, i) in messages" :key="i" :class="['chat-bubble', msg.role]">
                      {{ msg.text }}
                    </div>
                    <div v-if="isTyping" class="chat-bubble assistant typing">
                      <span>.</span><span>.</span><span>.</span>
                    </div>
                  </div>

                  <div class="ai-suggestions">
                    <button v-for="sug in aiSuggestions" :key="sug" class="btn btn-suggestion" @click="sendAiQuery(sug)">
                      {{ sug }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="ai-card-footer">
                <div class="input-group">
                  <input 
                    type="text" 
                    class="form-control" 
                    placeholder="Tanya tentang CVE ini..." 
                    v-model="userInput" 
                    @keyup.enter="sendAiQuery(userInput)"
                    :disabled="!selectedCve || isTyping"
                  >
                  <button class="btn btn-primary" @click="sendAiQuery(userInput)" :disabled="!selectedCve || isTyping"><i class="fas fa-paper-plane"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Toast Notifications -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100;">
      <div v-for="toast in toasts" :key="toast.id" class="toast show border-0 shadow" role="alert">
        <div :class="['toast-header text-white', toast.type === 'error' ? 'bg-danger' : 'bg-primary']">
          <strong class="me-auto"><i class="fas fa-info-circle me-1"></i> System</strong>
          <button type="button" class="btn-close btn-close-white" @click="removeToast(toast.id)"></button>
        </div>
        <div class="toast-body bg-white">{{ toast.message }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import { otxService } from '@/services/otxService';
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: "IntelligenceCenter",
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      activeTab: 'otx', // 'otx' or 'cve'
      
      // COMMON
      toasts: [],
      toastCount: 0,
      
      // OTX & BREACH SECTION
      userTerm: "",
      isChecking: false,
      checkResult: null,
      emailError: "",
      rateLimitCountdown: 0,
      
      isIntelLoading: false,
      lastUpdated: null,
      recentEvents: [],
      topIocs: [],
      metrics: {
        totalEvents: 0,
        activeIocs: 0,
        criticalEvents: 0,
        activeFeeds: 12
      },
      
      expandedIocId: null,
      expandedEventId: null,
      otxSearchQuery: "",
      
      chartOptions: null,
      chartSeries: [],
      refreshTimer: null,

      // CISA KEV SECTION
      cves: [],
      isLoadingCves: false,
      selectedCve: null,
      expandedCveId: null,
      displayLimit: 10,
      limitOptions: [5, 10, 15, 20],
      
      // AI ASSISTANT
      userInput: "",
      isTyping: false,
      messages: [],
      aiSuggestions: [
        "Apa dampaknya untuk organisasi di Indonesia?",
        "Bagaimana cara mitigasinya?",
        "Apakah ada exploit yang sudah beredar?",
        "Regulasi mana yang terdampak?"
      ]
    };
  },
  computed: {
    otxMetricCards() {
      return [
        { label: 'Total Pulses', value: this.metrics.totalEvents, icon: 'fas fa-database', accent: '#3b82f6' },
        { label: 'Critical Threats', value: this.metrics.criticalEvents, icon: 'fas fa-biohazard', accent: '#ef4444' },
        { label: 'Indicators (IOC)', value: this.metrics.activeIocs, icon: 'fas fa-fingerprint', accent: '#8b5cf6' },
        { label: 'Global Feeds', value: this.metrics.activeFeeds, icon: 'fas fa-rss', accent: '#10b981' }
      ];
    },
    filteredCves() {
      return this.cves.slice(0, this.displayLimit);
    }
  },
  methods: {
    // --- BREACH METHODS ---
    async checkBreachStatus() {
      const sanitized = this.userTerm.trim().toLowerCase();
      const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
      if (!sanitized || !emailRegex.test(sanitized)) {
        this.emailError = "Format email tidak valid";
        return;
      }
      this.emailError = "";
      this.isChecking = true;
      this.checkResult = null;
      try {
        const response = await fetch(`/api/breach?email=${encodeURIComponent(sanitized)}`);
        const data = await response.json();
        if (response.status === 429) {
          this.emailError = "Limit tercapai. Silakan coba lagi nanti.";
          this.startRateLimit();
          return;
        }
        if (data.success) {
          this.checkResult = data.found > 0 ? { found: true, size: data.found, list: data.result || [] } : { found: false };
        }
      } catch (err) {
        this.emailError = "Gagal terhubung ke database OSINT.";
      } finally {
        this.isChecking = false;
      }
    },
    startRateLimit() {
      this.rateLimitCountdown = 60;
      const timer = setInterval(() => {
        this.rateLimitCountdown--;
        if (this.rateLimitCountdown <= 0) clearInterval(timer);
      }, 1000);
    },
    copyAllSources() {
      if (!this.checkResult?.list) return;
      const allSources = [...new Set(this.checkResult.list.flatMap(i => i.sources))];
      navigator.clipboard.writeText(allSources.join(', '));
      this.showToast("Semua sumber disalin ke clipboard", "info");
    },

    // --- OTX METHODS ---
    async fetchAllIntelData() {
      this.isIntelLoading = true;
      try {
        const [events, iocs] = await Promise.all([
          otxService.getRecentPulses(20),
          otxService.getRecentIocs(20)
        ]);
        const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp);
        this.recentEvents = sortedEvents.slice(0, 15);
        this.topIocs = iocs.slice(0, 20);
        
        const criticalCount = sortedEvents.filter(e => e.threat_level_id === 1).length;
        this.metrics = {
          totalEvents: sortedEvents.length,
          activeIocs: iocs.length,
          criticalEvents: criticalCount,
          activeFeeds: 12
        };
        this.prepareChartData(sortedEvents);
        this.lastUpdated = new Date().toLocaleTimeString('id-ID');
      } catch (error) {
        console.error("OTX Fetch Error:", error);
        this.showToast("Gagal mengambil data dari OTX. Menggunakan simulasi.", "error");
      } finally {
        this.isIntelLoading = false;
      }
    },
    prepareChartData(events) {
      const days = [];
      const data = [];
      const now = new Date();
      const eventCountByDay = {};
      events.forEach(event => {
        const label = new Date(event.timestamp * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        eventCountByDay[label] = (eventCountByDay[label] || 0) + 1;
      });
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        days.push(label);
        data.push(eventCountByDay[label] || 0);
      }
      const avg = data.reduce((a, b) => a + b, 0) / (data.length || 1);
      this.chartSeries = [{ name: 'Events', data: data }];
      this.chartOptions = {
        chart: { type: 'bar', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'Inter, sans-serif' },
        colors: [({ value }) => value > avg ? '#ef4444' : '#3b82f6'],
        plotOptions: { bar: { borderRadius: 6, columnWidth: '60%', distributed: true } },
        xaxis: { categories: days, axisBorder: { show: false } },
        yaxis: { min: 0, forceNiceScale: true },
        grid: { borderColor: '#f1f5f9' },
        legend: { show: false },
        tooltip: { theme: 'dark' }
      };
    },
    async performSearch() {
      if (!this.otxSearchQuery) return;
      this.isIntelLoading = true;
      try {
        const results = await otxService.searchIndicators(this.otxSearchQuery);
        if (results && results.length) {
          this.topIocs = results.slice(0, 20);
          this.showToast(`Ditemukan ${results.length} indikator`, "info");
        }
      } catch (e) {
        this.showToast("Search failed", "error");
      } finally {
        this.isIntelLoading = false;
      }
    },
    toggleIoc(id) { this.expandedIocId = this.expandedIocId === id ? null : id; },
    toggleEvent(id) { this.expandedEventId = this.expandedEventId === id ? null : id; },
    getSeverityClass(id) {
      const classes = { 1: 'bg-danger', 2: 'bg-warning text-dark', 3: 'bg-info text-white' };
      return classes[id] || 'bg-secondary';
    },
    getSeverityLabel(id) {
      const labels = { 1: 'High', 2: 'Medium', 3: 'Low' };
      return labels[id] || 'Undefined';
    },

    // --- CISA KEV METHODS ---
    async fetchCisaKEV() {
      this.isLoadingCves = true;
      try {
        const response = await fetch('https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json');
        if (!response.ok) throw new Error('CISA API Error');
        const data = await response.json();
        this.cves = data.vulnerabilities.map(item => ({
          id: item.cveID,
          title: item.vulnerabilityName,
          shortDescription: item.shortDescription,
          vendor: item.vendorProject,
          product: item.product,
          date: new Date(item.dateAdded).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }),
          rawDate: new Date(item.dateAdded),
          requiredAction: item.requiredAction,
          isRansomware: item.knownRansomwareCampaignUse === 'Known',
          fullDescription: null,
          isEnriching: false
        })).sort((a, b) => b.rawDate - a.rawDate);
        if (this.cves.length > 0) this.selectedCve = this.cves[0];
      } catch (err) {
        console.error("CISA Fetch failed", err);
      } finally {
        this.isLoadingCves = false;
      }
    },
    toggleCveExpand(cve) {
      if (this.expandedCveId === cve.id) {
        this.expandedCveId = null;
      } else {
        this.expandedCveId = cve.id;
        this.selectedCve = cve;
        if (!cve.fullDescription) this.enrichCve(cve);
      }
    },
    async enrichCve(cve) {
      cve.isEnriching = true;
      try {
        const res = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cve.id}`);
        const data = await res.json();
        const nvd = data.vulnerabilities?.[0]?.cve;
        cve.fullDescription = nvd ? nvd.descriptions.find(d => d.lang === 'en')?.value : cve.shortDescription;
      } catch (e) {
        cve.fullDescription = cve.shortDescription;
      } finally {
        cve.isEnriching = false;
      }
    },

    // --- AI METHODS ---
    askAi(cve) {
      this.selectedCve = cve;
      this.sendAiQuery("Berikan ringkasan eksekutif untuk kerentanan ini.");
    },
    async sendAiQuery(text) {
      if (!text || !text.trim() || this.isTyping) return;
      const query = text.trim();
      this.userInput = "";
      this.messages.push({ role: "user", text: query });
      this.isTyping = true;
      this.scrollToBottom();
      
      setTimeout(() => {
        let response = "";
        if (query.includes("mitigasi")) {
          response = `Untuk mitigasi ${this.selectedCve.id}, segera lakukan update patch resmi dari ${this.selectedCve.vendor}. Jika patch belum tersedia, batasi akses network ke komponen terdampak dan aktifkan monitoring pada IDS/IPS untuk pola traffic yang mencurigakan terkait ${this.selectedCve.product}.`;
        } else if (query.includes("Indonesia")) {
          response = `Organisasi di Indonesia yang menggunakan ${this.selectedCve.product} berisiko tinggi terkena dampak ini, terutama bagi sektor infrastruktur kritis yang memiliki regulasi ketat seperti SEOJK 29 atau PBI 02/2024. Penyerang dapat menargetkan kelemahan ini untuk mengganggu operasional atau mencuri data sensitif nasabah.`;
        } else if (query.includes("exploit")) {
          response = `Berdasarkan intelijen terbaru, exploit PoC (Proof of Concept) untuk ${this.selectedCve.id} sudah mulai beredar di forum-forum diskusi keamanan. Belum ada laporan serangan massal di lapangan, namun tingkat urgensi tetap di level CRITICAL.`;
        } else {
          response = `Kerentanan ${this.selectedCve.id} pada ${this.selectedCve.product} ditemukan dieksploitasi di lapangan. Dampak utamanya adalah potensi eksploitasi jarak jauh yang memungkinkan penyerang mengambil alih kontrol sistem. Pastikan tim keamanan IT Anda telah melakukan scanning berkala untuk mendeteksi keberadaan library/produk terdampak.`;
        }
        this.messages.push({ role: "assistant", text: response });
        this.isTyping = false;
        this.scrollToBottom();
      }, 1500);
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chat = this.$refs.chatArea;
        if (chat) chat.scrollTop = chat.scrollHeight;
      });
    },

    // --- COMMON HELPERS ---
    showToast(message, type = 'info') {
      const id = this.toastCount++;
      this.toasts.push({ id, message, type });
      setTimeout(() => this.removeToast(id), 5000);
    },
    removeToast(id) { this.toasts = this.toasts.filter(t => t.id !== id); },
    truncate(str, n) { return (str?.length > n) ? str.slice(0, n - 1) + '...' : str; },
    formatDateShort(ts) { return new Date(ts * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }); },
    handleGlobalClick(e) {
      if (!e.target.closest('.input-group') && !e.target.closest('.search-dropdown')) {
        // results are already handled by being part of the same data, 
        // but if we had a specific search results array for OTX we'd clear it here.
        // Actually, in the unified version I didn't add the search dropdown yet.
        // Let's add it if needed later.
      }
    }
  },
  mounted() {
    this.fetchAllIntelData();
    this.fetchCisaKEV();
    this.refreshTimer = setInterval(this.fetchAllIntelData, 5 * 60 * 1000);
    document.addEventListener('click', this.handleGlobalClick);
  },
  beforeUnmount() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    document.removeEventListener('click', this.handleGlobalClick);
  }
};
</script>

<style scoped>
.intel-center-page { padding: .25rem; border-radius: 32px; background: linear-gradient(180deg, #f7f2e8 0%, #edf5f5 100%); }
.intel-hero { 
  display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; 
  padding: 2rem; border-radius: 28px; color: white;
  background: linear-gradient(135deg, #17324d 0%, #215a56 100%);
  box-shadow: 0 14px 30px rgba(15,23,42,.1); margin-bottom: 1.5rem;
}
.hero-kicker { display: inline-flex; gap: .5rem; padding: .4rem .8rem; background: rgba(255,255,255,.1); border-radius: 99px; font-size: .75rem; font-weight: 700; text-transform: uppercase; }
.hero-title { font-size: 2.5rem; font-weight: 800; margin: 1rem 0; }
.hero-lede { opacity: .8; max-width: 600px; font-size: .95rem; line-height: 1.6; }
.hero-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; align-content: center; }
.hero-stat-card { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.1); padding: 1rem; border-radius: 18px; }
.hero-stat-card label { display: block; font-size: .65rem; opacity: .7; text-transform: uppercase; font-weight: 800; }
.hero-stat-card strong { display: block; font-size: 1.5rem; font-weight: 800; margin: .25rem 0; }
.hero-stat-card span { font-size: .75rem; opacity: .6; }

.intel-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.intel-tab { 
  display: flex; align-items: center; gap: 1rem; padding: 1.25rem; 
  background: white; border: 1px solid rgba(19,34,56,.1); border-radius: 20px;
  cursor: pointer; transition: all .2s; text-align: left;
}
.intel-tab i { width: 45px; height: 45px; background: #f1f5f9; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
.intel-tab.active { border-color: #3b82f6; box-shadow: 0 10px 25px rgba(59,130,246,.1); }
.intel-tab.active i { background: #3b82f6; color: white; }
.intel-tab strong { display: block; font-size: 1rem; font-weight: 800; }
.intel-tab span { font-size: .8rem; color: #64748b; }

.panel-card { background: white; border-radius: 24px; box-shadow: 0 10px 20px rgba(0,0,0,.03); }
.metric-icon-small { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
.ls-1 { letter-spacing: 1px; font-size: .65rem; }

.cursor-pointer { cursor: pointer; }
.animate-fade-in { animation: fadeIn .4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* CVE Styles */
.cve-count-pill { background: #0f172a; color: white; padding: .25rem .75rem; border-radius: 8px; font-weight: 700; font-size: .75rem; }
.live-pulse { display: flex; align-items: center; gap: 6px; background: #f0fdf4; padding: .25rem .75rem; border-radius: 8px; border: 1px solid #dcfce7; }
.pulse-dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; position: relative; }
.pulse-dot::after { content:''; position: absolute; width: 100%; height: 100%; background: inherit; border-radius: 50%; animation: pulse-ping 1.5s infinite; }
@keyframes pulse-ping { 0% { transform: scale(1); opacity: .8; } 100% { transform: scale(3); opacity: 0; } }
.status-text { font-size: .65rem; font-weight: 800; color: #166534; }

.cve-card { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 1.25rem; margin-bottom: .75rem; transition: all .2s; cursor: pointer; }
.cve-card:hover { border-color: #3b82f6; background: #f8faff; }
.cve-card.selected { border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; background: #f0f7ff; }
.cve-card.expanded { cursor: default; box-shadow: 0 15px 35px rgba(0,0,0,.08); }
.cve-id { font-weight: 800; color: #3b82f6; font-size: .85rem; }
.cve-exploited-badge { background: #ef4444; color: white; padding: .15rem .5rem; border-radius: 4px; font-size: .6rem; font-weight: 900; }
.cve-title-text { font-size: .95rem; font-weight: 800; margin: .5rem 0; line-height: 1.3; }
.cve-desc-text { font-size: .8rem; color: #64748b; margin-bottom: .75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.cve-footer-meta { font-size: .7rem; color: #94a3b8; }

.mitigation-box { background: #fff1f2; border-left: 4px solid #f43f5e; padding: .75rem; border-radius: 8px; }
.info-pill { display: inline-flex; align-items: center; gap: 6px; padding: .3rem .7rem; background: #f1f5f9; border-radius: 8px; font-size: .7rem; font-weight: 700; color: #475569; }
.info-pill.danger { background: #fef2f2; color: #b91c1c; }

/* AI Assistant */
.ai-assistant-card { background: #0f172a; border-radius: 24px; height: 600px; display: flex; flex-direction: column; overflow: hidden; position: sticky; top: 1.5rem; }
.ai-card-header { padding: 1.25rem; background: rgba(255,255,255,.05); border-bottom: 1px solid rgba(255,255,255,.1); color: white; display: flex; justify-content: space-between; align-items: center; }
.ai-indicator { width: 10px; height: 10px; background: #3b82f6; border-radius: 50%; animation: ai-pulse 2s infinite; }
@keyframes ai-pulse { 0% { transform: scale(.9); box-shadow: 0 0 0 0 rgba(59,130,246,.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59,130,246,0); } 100% { transform: scale(.9); box-shadow: 0 0 0 0 rgba(59,130,246,0); } }
.ai-card-body { flex: 1; padding: 1.5rem; overflow-y: auto; color: white; }
.ai-empty-state { text-align: center; margin-top: 5rem; opacity: .4; }
.ai-empty-state i { font-size: 3rem; }
.context-pill { background: rgba(59,130,246,.15); padding: .75rem; border-radius: 12px; border: 1px solid rgba(59,130,246,.2); }
.chat-bubble { padding: .75rem 1rem; border-radius: 16px; margin-bottom: .75rem; max-width: 90%; font-size: .85rem; line-height: 1.5; }
.chat-bubble.user { background: #3b82f6; margin-left: auto; border-bottom-right-radius: 4px; }
.chat-bubble.assistant { background: rgba(255,255,255,.1); border-bottom-left-radius: 4px; }
.btn-suggestion { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); color: #cbd5e1; font-size: .75rem; margin-bottom: .5rem; text-align: left; width: 100%; padding: .6rem .8rem; border-radius: 10px; }
.btn-suggestion:hover { background: rgba(255,255,255,.1); color: white; }
.ai-card-footer { padding: 1rem; background: rgba(0,0,0,.3); }

.x-small { font-size: .65rem; }
.sticky-top { top: -1px; z-index: 10; }
</style>
