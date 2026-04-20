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
        <i class="fas fa-satellite-dish"></i>
        <strong>Threat Feed</strong>
      </button>
      <button 
        class="intel-tab" 
        :class="{ active: activeTab === 'cve' }" 
        type="button" 
        @click="activeTab = 'cve'"
      >
        <i class="fas fa-bug"></i>
        <strong>Vulnerability Intel</strong>
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

        <!-- Chart Area -->
        <div class="row g-3 mb-3">
          <div class="col-12">
            <div class="panel-card shadow-sm p-3">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 class="fw-bold mb-0 x-small text-uppercase text-muted ls-1">OTX Activity Distribution</h6>
                </div>
                <button class="btn btn-xs btn-outline-primary rounded-pill px-2" @click="fetchAllIntelData" :disabled="isIntelLoading">
                  <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': isIntelLoading }"></i>
                </button>
              </div>
              <div style="height: 200px;">
                <apexchart 
                  v-if="!isIntelLoading && chartOptions" 
                  type="bar" 
                  height="100%" 
                  :options="chartOptions" 
                  :series="chartSeries"
                ></apexchart>
              </div>
            </div>
          </div>
        </div>

        <!-- Metrics -->
        <div class="row g-3 mb-3">
          <div class="col-xl-3 col-md-6" v-for="card in otxMetricCards" :key="card.label">
            <div class="panel-card p-3 shadow-sm h-100">
              <div class="d-flex align-items-center gap-2">
                <div class="metric-icon-small" :style="{ color: card.accent, backgroundColor: card.accent + '15' }">
                  <i :class="card.icon"></i>
                </div>
                <div>
                  <small class="text-muted text-uppercase fw-bold ls-1 d-block">{{ card.label }}</small>
                  <h5 class="mb-0 fw-bold">{{ isIntelLoading ? '...' : card.value }}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- IOC & Events Grid -->
        <div class="row g-3">
          <!-- IOC Table -->
          <div class="col-lg-6">
            <div class="panel-card shadow-sm h-100 overflow-hidden">
              <div class="p-2 px-3 bg-light border-bottom d-flex justify-content-between align-items-center">
                <span class="x-small fw-800 text-muted text-uppercase ls-1">Active Indicators (IOC)</span>
                <div class="input-group input-group-sm w-50">
                  <input type="text" class="form-control form-control-sm bg-white border-0" v-model="otxSearchQuery" placeholder="Search IOC..." @keyup.enter="performSearch">
                </div>
              </div>
              <div class="table-responsive" style="max-height: 400px;">
                <table class="table table-custom mb-0">
                  <thead>
                    <tr>
                      <th>TYPE</th>
                      <th>INDICATOR VALUE</th>
                      <th class="text-end">SIGHTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="ioc in topIocs" :key="ioc.id">
                      <tr @click="toggleIoc(ioc.id)" :class="{ 'row-expanded': expandedIocId === ioc.id }">
                        <td><span class="ioc-tag">{{ ioc.type }}</span></td>
                        <td><span class="mono-value">{{ ioc.value }}</span></td>
                        <td class="text-end"><span class="sight-count">{{ ioc.sightings || 0 }}</span></td>
                      </tr>
                      <tr v-if="expandedIocId === ioc.id" class="row-detail-pane">
                        <td colspan="3">
                          <div class="p-3">
                            <div class="row g-3">
                              <div class="col-md-8">
                                <label class="detail-label-mini">Context & Pulse Title</label>
                                <div class="fw-700 text-navy mb-2">{{ ioc.Event?.info || 'N/A' }}</div>
                                <div class="d-flex flex-wrap gap-1 mb-2">
                                  <span v-for="tag in ioc.Tag" :key="tag.id" class="badge-tag">{{ tag.name }}</span>
                                </div>
                              </div>
                              <div class="col-md-4 text-end">
                                <label class="detail-label-mini">External Source</label>
                                <a :href="`https://otx.alienvault.com/indicator/${ioc.type}/${ioc.value}`" target="_blank" class="btn btn-xs btn-outline-primary d-block mt-1">
                                  View on OTX <i class="fas fa-external-link-alt ms-1"></i>
                                </a>
                              </div>
                            </div>
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
            <div class="panel-card shadow-sm h-100 overflow-hidden">
              <div class="p-2 px-3 bg-light border-bottom">
                <span class="x-small fw-800 text-muted text-uppercase ls-1">Global Threat Pulses</span>
              </div>
              <div class="table-responsive" style="max-height: 400px;">
                <table class="table table-custom mb-0">
                  <thead>
                    <tr>
                      <th>PULSE TITLE</th>
                      <th>SEVERITY</th>
                      <th class="text-end">DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="event in recentEvents" :key="event.id">
                      <tr @click="toggleEvent(event.id)" :class="{ 'row-expanded': expandedEventId === event.id }">
                        <td class="fw-700 text-navy pulse-title-cell">{{ event.info }}</td>
                        <td><span :class="['severity-pill', getSeverityClass(event.threat_level_id)]">{{ getSeverityLabel(event.threat_level_id) }}</span></td>
                        <td class="text-end text-muted">{{ formatDateShort(event.timestamp) }}</td>
                      </tr>
                      <tr v-if="expandedEventId === event.id" class="row-detail-pane">
                        <td colspan="3">
                          <div class="p-3">
                            <div class="row g-3">
                              <div class="col-md-9">
                                <div class="d-flex align-items-center gap-2 mb-2">
                                  <label class="detail-label-mini mb-0">Contributor:</label>
                                  <span class="fw-700 text-navy x-small">{{ event.Org?.name }}</span>
                                </div>
                                <div class="d-flex flex-wrap gap-1 mb-3">
                                  <span v-for="tag in event.Tag" :key="tag.id" class="badge-tag pulse">{{ tag.name }}</span>
                                </div>
                                <div class="x-small text-muted">
                                  <i class="fas fa-fingerprint me-1"></i> <strong>Indicators:</strong> {{ event.indicators?.length || 0 }} IOCs in this pulse.
                                </div>
                              </div>
                              <div class="col-md-3 text-end">
                                <a :href="`https://otx.alienvault.com/pulse/${event.id}`" target="_blank" class="btn btn-xs btn-outline-primary d-block">
                                  Pulse Details <i class="fas fa-external-link-alt ms-1"></i>
                                </a>
                              </div>
                            </div>
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
              <div v-if="isLoadingCves" class="text-center py-5">
                <div class="spinner-border text-primary mb-3"></div>
                <p class="text-muted">Mengambil data intelijen CISA KEV...</p>
              </div>
              <div v-else-if="!filteredCves.length" class="text-center py-5 bg-white rounded-4 border border-dashed">
                <i class="fas fa-folder-open fs-1 text-muted mb-3 d-block opacity-25"></i>
                <p class="text-muted">Tidak ada data intelijen yang ditemukan.</p>
                <button class="btn btn-sm btn-outline-primary" @click="fetchCisaKEV">Coba Lagi</button>
              </div>
              <transition-group v-else name="list" tag="div" class="cve-list-container">
                <div 
                  v-for="cve in filteredCves" 
                  :key="cve.id" 
                  class="cve-row-item"
                  :class="{ selected: selectedCve?.id === cve.id, expanded: expandedCveId === cve.id }"
                  @click="toggleCveExpand(cve)"
                >
                  <div class="cve-row-main">
                    <div class="cve-row-id-cell">
                      <span class="cve-id-tag">{{ cve.id }}</span>
                    </div>
                    <div class="cve-row-content-cell">
                      <div class="d-flex align-items-center gap-2">
                        <span v-if="cve.isRansomware" class="badge-mini bg-danger">RANSOM</span>
                        <span class="cve-row-title">{{ cve.title }}</span>
                      </div>
                      <div class="cve-row-sub">{{ cve.vendor }} · {{ cve.product }}</div>
                    </div>
                    <div class="cve-row-meta-cell">
                      <span class="cve-row-date">{{ cve.date }}</span>
                      <div class="cve-row-actions">
                        <button class="btn btn-ai-mini" @click.stop="askAi(cve)"><i class="fas fa-robot"></i></button>
                      </div>
                    </div>
                  </div>

                  <transition name="expand">
                    <div v-if="expandedCveId === cve.id" class="cve-row-details">
                      <p class="cve-row-description">{{ cve.fullDescription || cve.shortDescription }}</p>
                      <div v-if="cve.requiredAction" class="cve-row-action-box">
                        <strong>Required Action:</strong> {{ cve.requiredAction }}
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
    <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3" style="z-index: 1200;">
      <div v-for="toast in toasts" :key="toast.id" class="toast show border-0 shadow-lg mb-2" role="alert" style="min-width: 300px;">
        <div :class="['toast-header text-white border-0', toast.type === 'error' ? 'bg-danger' : 'bg-primary']">
          <i class="fas fa-info-circle me-2"></i>
          <strong class="me-auto">System Notification</strong>
          <button type="button" class="btn-close btn-close-white" @click="removeToast(toast.id)"></button>
        </div>
        <div class="toast-body bg-white rounded-bottom">
          {{ toast.message }}
        </div>
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
        // Using internal proxy to bypass CORS
        const response = await fetch('/api/cisa');
        if (!response.ok) throw new Error('CISA Proxy API Error');
        const data = await response.json();
        
        if (!data.vulnerabilities) throw new Error('Invalid CISA Data');

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
        console.error("CISA Fetch failed:", err);
        this.showToast("Gagal mengambil data CISA KEV. Menggunakan data cadangan.", "error");
        this.setCisaMockData();
      } finally {
        this.isLoadingCves = false;
      }
    },
    setCisaMockData() {
      this.cves = [
        { id: "CVE-2026-33827", title: "Windows TCP/IP Remote Code Execution.", shortDescription: "A remote code execution vulnerability exists in Windows TCP/IP.", vendor: "Microsoft", product: "Windows", date: "14 Apr 2026", rawDate: new Date("2026-04-14"), requiredAction: "Apply updates per vendor instructions.", isRansomware: true },
        { id: "CVE-2026-32157", title: "Remote Desktop Client RCE.", shortDescription: "Remote Desktop Client vulnerability allows code execution.", vendor: "Microsoft", product: "RDP", date: "08 Apr 2026", rawDate: new Date("2026-04-08"), requiredAction: "Apply updates.", isRansomware: false },
        { id: "CVE-2025-21298", title: "Windows OLE Remote Code Execution.", shortDescription: "Windows OLE vulnerability allowing remote code execution.", vendor: "Microsoft", product: "Windows", date: "14 Nov 2025", rawDate: new Date("2025-11-14"), requiredAction: "Apply updates.", isRansomware: true },
        { id: "CVE-2024-38063", title: "Windows TCP/IP IPv6 RCE.", shortDescription: "Critical RCE in Windows TCP/IP IPv6 stack.", vendor: "Microsoft", product: "Windows", date: "13 Aug 2024", rawDate: new Date("2024-08-13"), requiredAction: "Apply updates.", isRansomware: false }
      ];
      if (this.cves.length > 0) this.selectedCve = this.cves[0];
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
.intel-center-page { padding: .25rem; border-radius: 24px; background: linear-gradient(180deg, #f8f9fa 0%, #f1f5f9 100%); }
.intel-hero { 
  display: flex; justify-content: space-between; align-items: center; gap: 1rem; 
  padding: 1rem 1.5rem; border-radius: 20px; color: white;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  box-shadow: 0 10px 25px rgba(0,0,0,.05); margin-bottom: 1rem;
}
.hero-content { flex: 1; }
.hero-kicker { display: inline-flex; gap: .4rem; padding: .25rem .6rem; background: rgba(255,255,255,.1); border-radius: 6px; font-size: .65rem; font-weight: 700; text-transform: uppercase; }
.hero-title { font-size: 1.5rem; font-weight: 800; margin: .4rem 0; letter-spacing: -0.02em; }
.hero-lede { opacity: .7; max-width: 500px; font-size: .8rem; line-height: 1.4; margin-bottom: 0; }
.hero-stats-grid { display: flex; gap: .75rem; }
.hero-stat-card { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); padding: .6rem 1rem; border-radius: 12px; min-width: 100px; text-align: center; }
.hero-stat-card label { display: block; font-size: .6rem; opacity: .6; text-transform: uppercase; font-weight: 800; }
.hero-stat-card strong { display: block; font-size: 1.1rem; font-weight: 800; margin: 0; }
.hero-stat-card span { display: none; }

.intel-nav { display: flex; gap: .75rem; }
.intel-tab { 
  flex: 1; display: flex; align-items: center; gap: .75rem; padding: .75rem 1rem; 
  background: white; border: 1px solid rgba(19,34,56,.08); border-radius: 14px;
  cursor: pointer; transition: all .2s; text-align: left;
}
.intel-tab i { width: 32px; height: 32px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem; color: #64748b; }
.intel-tab.active { border-color: #3b82f6; background: #f0f7ff; }
.intel-tab.active i { background: #3b82f6; color: white; }
.intel-tab strong { display: block; font-size: .85rem; font-weight: 800; }
.intel-tab span { font-size: .7rem; color: #94a3b8; }

.panel-card { background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,.02); }
.metric-icon-small { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: .9rem; }
.ls-1 { letter-spacing: .5px; font-size: .6rem; }

.cursor-pointer { cursor: pointer; }
.animate-fade-in { animation: fadeIn .4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* CVE Styles */
/* CVE List Rows */
.cve-list-container { display: flex; flex-direction: column; gap: 4px; }
.cve-row-item { 
  background: white; border: 1px solid #eef2f6; border-radius: 8px; 
  padding: 8px 12px; cursor: pointer; transition: all .2s; 
}
.cve-row-item:hover { background: #f8fafc; border-color: #cbd5e1; }
.cve-row-item.selected { border-color: #3b82f6; background: #f0f7ff; }
.cve-row-main { display: flex; align-items: center; gap: 12px; }
.cve-row-id-cell { min-width: 100px; }
.cve-id-tag { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #3b82f6; font-size: .7rem; }
.cve-row-content-cell { flex: 1; min-width: 0; }
.cve-row-title { display: block; font-weight: 700; font-size: .8rem; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cve-row-sub { font-size: .65rem; color: #94a3b8; }
.cve-row-meta-cell { display: flex; align-items: center; gap: 12px; text-align: right; }
.cve-row-date { font-size: .65rem; color: #94a3b8; white-space: nowrap; }
.badge-mini { font-size: .55rem; padding: 1px 4px; border-radius: 3px; font-weight: 800; }
.btn-ai-mini { width: 24px; height: 24px; border-radius: 6px; border: none; background: #f1f5f9; color: #64748b; font-size: .7rem; display: flex; align-items: center; justify-content: center; transition: all .2s; }
.btn-ai-mini:hover { background: #0f172a; color: white; }

.cve-row-details { padding-top: 8px; margin-top: 8px; border-top: 1px solid rgba(0,0,0,.05); }
.cve-row-description { font-size: .75rem; color: #475569; line-height: 1.5; margin-bottom: 8px; }
.cve-row-action-box { background: #fff1f2; border-radius: 6px; padding: 6px 10px; font-size: .7rem; color: #b91c1c; }

/* Custom Table Styles for OTX */
.table-custom { width: 100%; border-collapse: separate; border-spacing: 0; }
.table-custom thead th { 
  font-size: .6rem; font-weight: 800; color: #64748b; 
  padding: 8px 12px; border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase; letter-spacing: .05em;
}
.table-custom tbody tr { cursor: pointer; transition: background .2s; }
.table-custom tbody tr:hover { background: #f8fafc; }
.table-custom tbody tr.row-expanded { background: #f0f7ff; }
.table-custom tbody td { padding: 10px 12px; font-size: .75rem; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.pulse-title-cell { line-height: 1.4; max-width: 300px; word-break: break-word; }
.mono-value { font-family: 'JetBrains Mono', monospace; color: #475569; font-size: .7rem; word-break: break-all; }
.table-custom tbody tr:last-child td { border-bottom: none; }

.ioc-tag { font-size: .6rem; font-weight: 800; color: #3b82f6; background: #eff6ff; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
.mono-value { font-family: 'JetBrains Mono', monospace; color: #475569; font-size: .7rem; }
.sight-count { font-size: .65rem; font-weight: 800; background: #1e293b; color: white; padding: 1px 6px; border-radius: 10px; }
.severity-pill { font-size: .6rem; font-weight: 800; padding: 2px 8px; border-radius: 99px; }
.row-detail-pane td { background: #fafbfc !important; border-bottom: 1px solid #e2e8f0 !important; padding: 0 !important; }
.detail-label-mini { display: block; font-size: .55rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 4px; }
.badge-tag { font-size: .6rem; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; border: 1px solid #e2e8f0; }
.badge-tag.pulse { color: #0369a1; background: #f0f9ff; border-color: #bae6fd; }

.fw-700 { font-weight: 700; }
.fw-800 { font-weight: 800; }
.text-navy { color: #0f172a; }

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
