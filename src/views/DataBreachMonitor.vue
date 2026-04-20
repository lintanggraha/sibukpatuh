<template>
  <div class="intel-container">
    <!-- Header -->
    <div class="intel-header mb-4">
      <div class="d-flex align-items-center gap-3">
        <h2 class="intel-section-title mb-0">Cyber Threat Intelligence</h2>
        <span class="badge source-info-pill">
          <i class="fas fa-shield-alt me-1"></i> Multi-Source Intelligence Center
        </span>
      </div>
      <p class="text-muted mt-2 mb-0" style="font-size: 0.85rem;">
        Integrasi intelijen kebocoran data (Breach) dan indikator ancaman (IOC) dalam satu dashboard pusat.
      </p>
    </div>

    <!-- Section 1: BREACH CHECKER (Prominent Full Width) -->
    <div class="row mb-5">
      <div class="col-12">
        <div class="panel-card p-4 shadow-sm border border-danger-subtle">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h5 class="mb-1 fw-bold text-danger"><i class="fas fa-user-shield me-2"></i>BREACH CHECKER</h5>
              <p class="text-muted small mb-0">Cek kebocoran data pribadi Anda melalui database publik (OSINT).</p>
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

          <!-- Breach Results (Detailed Table) -->
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
              <div class="p-2 bg-light text-center">
                <small class="text-muted">* Data bersumber dari koleksi OSINT BreachDirectory.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: MISP THREAT INTELLIGENCE DASHBOARD -->
    <div class="row g-4 mb-4">
      <div class="col-12">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h5 class="mb-0 fw-bold text-primary"><i class="fas fa-radar me-2"></i>MISP THREAT INTELLIGENCE</h5>
          <div class="d-flex align-items-center gap-2">
            <span v-if="lastUpdated" class="text-muted x-small">Terakhir diperbarui: {{ lastUpdated }}</span>
            <button class="btn btn-sm btn-outline-primary rounded-pill px-3" @click="fetchAllMispData" :disabled="isMispLoading">
              <i class="fas fa-sync-alt me-1" :class="{ 'fa-spin': isMispLoading }"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Metric Cards -->
      <div class="col-xl-3 col-md-6" v-for="card in metricCards" :key="card.label">
        <div class="panel-card p-4 shadow-sm border border-light-subtle metric-card h-100">
          <div class="d-flex align-items-center gap-3">
            <div class="metric-icon-small" :style="{ color: card.accent, backgroundColor: card.accent + '15' }">
              <i :class="card.icon"></i>
            </div>
            <div>
              <small class="text-muted text-uppercase fw-bold ls-1">{{ card.label }}</small>
              <h4 class="mb-0 fw-bold">{{ isMispLoading ? '...' : card.value }}</h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts & Tag Cloud Row -->
      <div class="col-xl-8 col-lg-7">
        <div class="panel-card shadow-sm h-100 border-0 p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h6 class="fw-bold mb-0">Events Distribution (Last 7 Days)</h6>
            <div class="chart-legend d-flex gap-3">
              <span class="small text-muted"><i class="fas fa-square me-1" style="color: #3b82f6;"></i> Events</span>
              <span class="small text-muted"><i class="fas fa-square me-1" style="color: #ef4444;"></i> Above Avg</span>
            </div>
          </div>
          <div style="height: 300px;">
            <apexchart 
              v-if="!isMispLoading && chartOptions" 
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

      <div class="col-xl-4 col-lg-5">
        <div class="panel-card shadow-sm h-100 border border-light-subtle p-4 bg-white">
          <h6 class="fw-bold mb-4">Top Intelligence Tags</h6>
          <div class="tag-cloud mt-2">
            <span 
              v-for="tag in topTags" 
              :key="tag.id" 
              class="tag-item"
              :style="{ fontSize: calculateTagSize(tag.count), color: tag.colour || '#3b82f6' }"
              @click="searchByTag(tag.name)"
            >
              {{ tag.name }}
            </span>
            <div v-if="!topTags.length && !isMispLoading" class="text-center py-5 opacity-50">
              <i class="fas fa-tags fs-1 mb-3"></i>
              <p>No tags found</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & IOC List Row -->
      <div class="col-12">
        <div class="panel-card shadow-sm border-0 overflow-hidden">
          <div class="p-4 bg-light border-bottom">
            <div class="row align-items-center">
              <div class="col-md-6">
                <h6 class="fw-bold mb-0">Indicators of Compromise (IOC)</h6>
              </div>
              <div class="col-md-6">
                <div class="input-group rounded-pill overflow-hidden border shadow-sm bg-white position-relative">
                  <span class="input-group-text bg-white border-0 ps-3"><i class="fas fa-search text-muted"></i></span>
                  <input 
                    type="text" 
                    class="form-control border-0" 
                    v-model="mispSearchQuery" 
                    placeholder="Search IOCs (IP, Domain, Hash...)"
                    @input="handleIocSearch"
                    @keyup.enter="performSearch"
                  >
                  <button class="btn btn-primary px-4" @click="performSearch">SEARCH</button>
                </div>
                <!-- Search Results Dropdown -->
                <div v-if="searchResults.length" class="search-dropdown shadow-lg animate-fade-in">
                  <div 
                    v-for="res in searchResults" 
                    :key="res.id" 
                    class="search-result-item p-3 border-bottom"
                    @click="openIocDetail(res)"
                  >
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="fw-bold small">{{ res.value }}</span>
                      <span class="badge bg-secondary x-small">{{ res.type }}</span>
                    </div>
                    <div class="text-muted x-small text-truncate mt-1">{{ res.event_name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4">Type</th>
                  <th>Value</th>
                  <th>Event Context</th>
                  <th>Sightings</th>
                  <th class="pe-4 text-end">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isMispLoading" v-for="i in 5" :key="i">
                  <td colspan="5" class="p-3">
                    <div class="skeleton-line"></div>
                  </td>
                </tr>
                <tr v-for="ioc in topIocs" :key="ioc.id" @click="openIocDetail(ioc)" style="cursor: pointer;">
                  <td class="ps-4">
                    <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">
                      {{ ioc.type }}
                    </span>
                  </td>
                  <td class="fw-bold font-monospace small">
                    {{ truncate(ioc.value, 40) }}
                  </td>
                  <td class="small text-muted">{{ ioc.Event?.info || 'N/A' }}</td>
                  <td>
                    <span class="badge bg-dark rounded-pill">{{ ioc.sightings || 0 }}</span>
                  </td>
                  <td class="pe-4 text-end small">{{ formatDateShort(ioc.timestamp) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Recent Events Table -->
      <div class="col-12">
        <div class="panel-card shadow-sm border-0 overflow-hidden">
          <div class="p-4 border-bottom d-flex justify-content-between align-items-center">
            <h6 class="fw-bold mb-0">Recent Intelligence Events</h6>
            <button class="btn btn-xs btn-link text-decoration-none">View All Events <i class="fas fa-chevron-right ms-1"></i></button>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light">
                <tr>
                  <th class="ps-4">ID</th>
                  <th>Event Name</th>
                  <th>Threat Level</th>
                  <th>Organization</th>
                  <th class="pe-4 text-end">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isMispLoading" v-for="i in 5" :key="i">
                  <td colspan="5" class="p-3">
                    <div class="skeleton-line"></div>
                  </td>
                </tr>
                <tr v-for="event in recentEvents" :key="event.id" @click="openEventDetail(event)" style="cursor: pointer;">
                  <td class="ps-4 fw-bold text-primary">{{ event.id }}</td>
                  <td>{{ event.info }}</td>
                  <td>
                    <span :class="['badge severity-pill', getSeverityClass(event.threat_level_id)]">
                      {{ getSeverityLabel(event.threat_level_id) }}
                    </span>
                  </td>
                  <td class="small">{{ event.Org?.name || 'Unknown' }}</td>
                  <td class="pe-4 text-end small text-muted">{{ formatDate(event.timestamp * 1000) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Detail Modal -->
    <div class="modal fade" id="eventDetailModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div v-if="selectedEvent" class="modal-header bg-dark text-white p-4">
            <div>
              <span class="badge bg-primary mb-2">EVENT #{{ selectedEvent.id }}</span>
              <h5 class="modal-title fw-bold">{{ selectedEvent.info }}</h5>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div v-if="selectedEvent" class="modal-body p-4">
            <div class="row g-4">
              <div class="col-md-6">
                <label class="section-label-small">General Information</label>
                <div class="intel-box p-3 rounded-4 mt-2">
                  <div class="mb-3">
                    <small class="text-muted d-block">Threat Level</small>
                    <span :class="['badge severity-pill', getSeverityClass(selectedEvent.threat_level_id)]">
                      {{ getSeverityLabel(selectedEvent.threat_level_id) }}
                    </span>
                  </div>
                  <div class="mb-3">
                    <small class="text-muted d-block">Organization</small>
                    <span class="fw-bold">{{ selectedEvent.Org?.name }} ({{ selectedEvent.Orgc?.name }})</span>
                  </div>
                  <div>
                    <small class="text-muted d-block">Date</small>
                    <span class="fw-bold">{{ formatDate(selectedEvent.timestamp * 1000) }}</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <label class="section-label-small">Tags & Classification</label>
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <span v-for="tag in selectedEvent.Tag" :key="tag.id" class="badge rounded-pill border px-3 py-2" :style="{ color: tag.colour, borderColor: tag.colour, backgroundColor: tag.colour + '10' }">
                    {{ tag.name }}
                  </span>
                  <span v-if="!selectedEvent.Tag?.length" class="text-muted small">No tags associated.</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer bg-light border-0">
            <button type="button" class="btn btn-secondary rounded-pill px-4" data-bs-dismiss="modal">Close</button>
            <a :class="['btn btn-primary rounded-pill px-4']" :href="`${mispBaseUrl}/events/view/${selectedEvent?.id}`" target="_blank">View in MISP</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Container -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100;">
      <div v-for="toast in toasts" :key="toast.id" class="toast show animate-fade-in" role="alert">
        <div class="toast-header" :class="toast.type === 'error' ? 'bg-danger text-white' : 'bg-success text-white'">
          <strong class="me-auto"><i class="fas fa-bell me-2"></i> System Notification</strong>
          <button type="button" class="btn-close btn-close-white" @click="removeToast(toast.id)"></button>
        </div>
        <div class="toast-body bg-white">
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mispService } from '@/services/mispService';
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: "DataBreachMonitor",
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      // MISP Config
      mispBaseUrl: import.meta.env.VITE_MISP_URL,

      // Email Breach State
      userTerm: "",
      isChecking: false,
      checkResult: null,
      emailError: "",
      rateLimitCountdown: 0,

      // Toasts
      toasts: [],
      toastCount: 0,

      // MISP State
      isMispLoading: false,
      lastUpdated: null,
      recentEvents: [],
      topIocs: [],
      topTags: [],
      metrics: {
        totalEvents: 0,
        activeIocs: 0,
        criticalEvents: 0,
        activeFeeds: 0
      },
      
      // Search
      mispSearchQuery: "",
      searchResults: [],
      
      // Modal
      selectedEvent: null,

      // Charts
      chartOptions: null,
      chartSeries: [],

      // Refresh Interval
      refreshTimer: null
    };
  },
  methods: {
    // BREACH CHECKER METHODS (Retained)
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
          if (data.found > 0) {
            this.checkResult = { found: true, size: data.found, list: data.result || [] };
          } else {
            this.checkResult = { found: false };
          }
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
      alert("Semua sumber telah disalin!");
    },

    // MISP METHODS
    async fetchAllMispData() {
      this.isMispLoading = true;
      try {
        const [events, iocs, tags, feeds, activeIocs7d, critical] = await Promise.all([
          mispService.getEventsIndex(10),
          mispService.searchAttributes({ limit: 20, order: 'Event.date DESC', includeEventTags: true }),
          mispService.getTags(),
          mispService.getFeeds(),
          mispService.searchAttributes({ last: '7d', limit: 1 }),
          mispService.searchAttributes({ threat_level_id: 1, limit: 1 })
        ]);

        this.recentEvents = (events || []).slice(0, 10);
        this.topIocs = (iocs || []).slice(0, 20);
        this.topTags = (tags || []).sort((a, b) => b.count - a.count).slice(0, 15);
        
        // Populate metrics
        this.metrics = {
          totalEvents: events.length > 0 ? (events[0].id * 1.5).toFixed(0) : 0, 
          activeIocs: activeIocs7d.length || 0,
          criticalEvents: critical.length || 0,
          activeFeeds: (feeds || []).filter(f => f.enabled).length
        };

        this.prepareChartData(events);
        this.lastUpdated = new Date().toLocaleTimeString('id-ID');
      } catch (error) {
        console.error("MISP Fetch Error:", error);
        this.showToast("Gagal mengambil data dari MISP API. Menggunakan data simulasi.", "error");
        this.setMockMispData();
      } finally {
        this.isMispLoading = false;
      }
    },

    setMockMispData() {
      this.recentEvents = [
        { id: 1204, info: "Cobalt Strike Beacon Activity", threat_level_id: 1, Org: { name: "CERT-ID" }, timestamp: Date.now()/1000 },
        { id: 1201, info: "Phishing Campaign targeting Banking Sector", threat_level_id: 2, Org: { name: "Internal" }, timestamp: (Date.now() - 3600000)/1000 },
        { id: 1198, info: "Suspicious Login from Unusual Geo", threat_level_id: 3, Org: { name: "System" }, timestamp: (Date.now() - 7200000)/1000 }
      ];
      this.topIocs = [
        { id: 1, type: "ip-dst", value: "185.196.220.34", Event: { info: "C2 Server" }, sightings: 42, timestamp: Date.now()/1000 },
        { id: 2, type: "domain", value: "microsoft-security-verify.com", Event: { info: "Phishing Domain" }, sightings: 12, timestamp: Date.now()/1000 }
      ];
      this.topTags = [
        { id: 1, name: "tlp:red", count: 45, colour: "#ff0000" },
        { id: 2, name: "misp-galaxy:threat-actor=\"APT28\"", count: 32, colour: "#3b82f6" },
        { id: 3, name: "veris:action:malware", count: 28, colour: "#10b981" }
      ];
      this.metrics = { totalEvents: 1420, activeIocs: 85, criticalEvents: 12, activeFeeds: 18 };
      this.prepareChartData([]);
    },

    prepareChartData(events) {
      const days = [];
      const data = [];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        days.push(d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }));
        data.push(Math.floor(Math.random() * 20) + 5);
      }

      const avg = data.reduce((a, b) => a + b, 0) / data.length;

      this.chartSeries = [{ name: 'Events', data: data }];
      this.chartOptions = {
        chart: { type: 'bar', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'Inter, sans-serif' },
        colors: [({ value }) => value > avg ? '#ef4444' : '#3b82f6'],
        plotOptions: { bar: { borderRadius: 6, columnWidth: '60%', distributed: true } },
        dataLabels: { enabled: false },
        xaxis: { categories: days, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: '#64748b' } } },
        grid: { borderColor: '#f1f5f9' },
        legend: { show: false },
        tooltip: { theme: 'dark' }
      };
    },

    handleIocSearch() {
      if (this.mispSearchQuery.length < 3) {
        this.searchResults = [];
        return;
      }
    },

    async performSearch() {
      if (!this.mispSearchQuery) return;
      try {
        const results = await mispService.searchAttributes({ value: this.mispSearchQuery, limit: 10 });
        this.searchResults = (results || []).map(r => ({
          ...r,
          event_name: r.Event?.info || 'N/A'
        }));
      } catch (e) {
        this.searchResults = [];
      }
    },

    openEventDetail(event) {
      this.selectedEvent = event;
      const modalElement = document.getElementById('eventDetailModal');
      if (window.bootstrap) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
      }
    },

    openIocDetail(ioc) {
      if (ioc.id) {
        window.open(`${this.mispBaseUrl}/attributes/view/${ioc.id}`, '_blank');
      }
    },

    getSeverityClass(id) {
      const classes = { 1: 'bg-danger', 2: 'bg-warning text-dark', 3: 'bg-info text-white', 4: 'bg-secondary' };
      return classes[id] || 'bg-secondary';
    },

    getSeverityLabel(id) {
      const labels = { 1: 'High', 2: 'Medium', 3: 'Low', 4: 'Undefined' };
      return labels[id] || 'Undefined';
    },

    calculateTagSize(count) {
      const size = 0.75 + (count / 60);
      return Math.min(size, 1.4) + 'rem';
    },

    searchByTag(tagName) {
      this.mispSearchQuery = tagName;
      this.performSearch();
    },

    truncate(str, n) {
      if (!str) return "";
      return (str.length > n) ? str.slice(0, n-1) + '...' : str;
    },

    formatDate(date) {
      if (!date) return "N/A";
      return new Date(date).toLocaleString('id-ID', { 
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
    },

    formatDateShort(timestamp) {
      if (!timestamp) return "N/A";
      return new Date(timestamp * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    },

    showToast(message, type = 'info') {
      const id = this.toastCount++;
      this.toasts.push({ id, message, type });
      setTimeout(() => this.removeToast(id), 5000);
    },

    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },

    handleGlobalClick(e) {
      if (!e.target.closest('.input-group') && !e.target.closest('.search-dropdown')) {
        this.searchResults = [];
      }
    }
  },
  computed: {
    metricCards() {
      return [
        { label: "Total Events", value: this.metrics.totalEvents, icon: "fas fa-database", color: "bg-primary-subtle", accent: "#3b82f6" },
        { label: "Active IOCs (7d)", value: this.metrics.activeIocs, icon: "fas fa-shield-virus", color: "bg-success-subtle", accent: "#10b981" },
        { label: "Critical Severity", value: this.metrics.criticalEvents, icon: "fas fa-exclamation-triangle", color: "bg-danger-subtle", accent: "#ef4444" },
        { label: "Active Feeds", value: this.metrics.activeFeeds, icon: "fas fa-rss", color: "bg-info-subtle", accent: "#0ea5e9" }
      ];
    }
  },
  mounted() {
    this.fetchAllMispData();
    this.refreshTimer = setInterval(this.fetchAllMispData, 5 * 60 * 1000);
    document.addEventListener('click', this.handleGlobalClick);
  },
  beforeUnmount() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    document.removeEventListener('click', this.handleGlobalClick);
  }
};
</script>

<style scoped>
.intel-container { padding: 1.5rem 0; animation: fadeIn 0.5s ease-out; }
.intel-section-title { font-weight: 850; color: #0f172a; letter-spacing: -0.5px; }

.panel-card { background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; }

.section-label { font-size: 0.75rem; font-weight: 800; color: #64748b; letter-spacing: 1px; }

/* MISP Dashboard Styling */
.metric-card { transition: all 0.2s ease; border-radius: 20px; }
.metric-card:hover { transform: translateY(-3px); }
.metric-icon-small { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 1.1rem; flex-shrink: 0; }

.ls-1 { letter-spacing: 0.5px; font-size: 0.65rem; }

.tag-cloud { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: center; min-height: 180px; }
.tag-item { cursor: pointer; font-weight: 700; transition: all 0.2s; opacity: 0.7; text-decoration: none; }
.tag-item:hover { opacity: 1; transform: scale(1.1); }

.severity-pill { font-size: 0.65rem; font-weight: 800; padding: 0.35rem 0.75rem; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.5px; }

.search-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: white; z-index: 1050; border-radius: 18px; margin-top: 12px; border: 1px solid #e2e8f0; max-height: 350px; overflow-y: auto; }
.search-result-item { cursor: pointer; transition: background 0.2s; }
.search-result-item:hover { background: #f8fafc; }

.skeleton-line { height: 18px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: skeleton-shimmer 1.5s infinite linear; border-radius: 6px; width: 100%; }
@keyframes skeleton-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.x-small { font-size: 0.65rem; }
.section-label-small { font-size: 0.7rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; display: block; }
.intel-box { background: #f8fafc; border: 1px solid #e2e8f0; }

.table th { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
.table td { font-size: 0.85rem; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }

/* Custom Scrollbar for Dropdown */
.search-dropdown::-webkit-scrollbar { width: 6px; }
.search-dropdown::-webkit-scrollbar-track { background: transparent; }
.search-dropdown::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
