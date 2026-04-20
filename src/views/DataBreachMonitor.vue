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

    <!-- Section 2: IOC MONITOR & ANALYSIS -->
    <div class="row g-4 mb-4">
      <div class="col-12">
        <h5 class="mb-3 fw-bold text-primary"><i class="fas fa-microscope me-2"></i>IOC MONITOR & ANALYSIS</h5>
      </div>

      <!-- Feed Column -->
      <div class="col-xl-4 col-lg-5">
        <div class="panel-card shadow-sm h-100 d-flex flex-column border-0 bg-dark">
          <div class="p-4 border-bottom border-secondary d-flex justify-content-between align-items-center">
            <h6 class="section-label mb-0 text-white">LIVE THREAT FEED</h6>
            <button class="btn btn-xs btn-outline-primary" @click="fetchThreatFeed" :disabled="isFeedLoading">
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': isFeedLoading }"></i>
            </button>
          </div>
          <div class="feed-container overflow-auto" style="max-height: 650px;">
            <div v-if="isFeedLoading" class="p-5 text-center">
              <div class="spinner-border spinner-border-sm text-primary mb-3"></div>
              <p class="text-muted small">Synchronizing intelligence...</p>
            </div>
            <div v-else class="list-group list-group-flush">
              <div 
                v-for="item in feedItems" 
                :key="item.indicatorid"
                class="list-group-item feed-item border-secondary bg-transparent text-white"
                :class="{ active: selectedValue === item.value }"
                @click="loadIndicator(item.value)"
              >
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="badge-type">{{ item.type.toUpperCase() }}</span>
                  <span :class="['risk-dot', item.risk]"></span>
                </div>
                <div class="indicator-value text-truncate">{{ item.value }}</div>
                <div class="d-flex justify-content-between align-items-center mt-2 opacity-75">
                  <span class="small">{{ item.risk.toUpperCase() }}</span>
                  <span class="small" style="font-size: 0.65rem;">{{ formatDate(item.lastseen) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analysis Column -->
      <div class="col-xl-8 col-lg-7">
        <div class="panel-card shadow-sm h-100 d-flex flex-column border-0">
          <!-- Search Bar for IOC -->
          <div class="p-4 bg-light bg-opacity-50 border-bottom">
            <div class="input-group rounded-pill overflow-hidden border shadow-sm bg-white">
              <span class="input-group-text bg-white border-0 ps-3"><i class="fas fa-search text-muted"></i></span>
              <input 
                type="text" 
                class="form-control border-0" 
                v-model="iocTerm" 
                placeholder="Analisis IP, Domain, atau URL baru..."
                :disabled="isIocChecking"
                @keyup.enter="checkIocStatus"
              >
              <button class="btn btn-primary px-4" @click="checkIocStatus" :disabled="isIocChecking || !iocTerm">
                <span v-if="isIocChecking" class="spinner-border spinner-border-sm me-2"></span>
                ANALYZE
              </button>
            </div>
            <div v-if="iocError" class="text-danger small mt-2 ms-3 fw-bold">{{ iocError }}</div>
          </div>

          <!-- Detailed Inspector Area -->
          <div class="inspector-body flex-grow-1 position-relative">
            <div v-if="isLoadingDetail" class="loading-overlay d-flex flex-column align-items-center justify-content-center p-5">
              <div class="spinner-grow text-primary mb-3"></div>
              <p class="text-muted">Fetching deep intelligence...</p>
            </div>

            <div v-else-if="!selectedIndicator" class="empty-state p-5 text-center text-muted h-100 d-flex flex-column justify-content-center">
              <i class="fas fa-terminal fs-1 mb-4 opacity-10"></i>
              <h6>Pilih indikator dari feed atau lakukan pencarian manual</h6>
              <p class="small">Data disediakan oleh Pulsedive Community Intelligence</p>
            </div>

            <div v-else class="p-4 animate-fade-in">
              <div class="inspector-header mb-4">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <span class="badge bg-primary bg-opacity-10 text-primary mb-2 border border-primary border-opacity-25 px-3">
                      INDICATOR ANALYSIS
                    </span>
                    <h3 class="mb-1 fw-bold text-navy">{{ selectedIndicator.indicator }}</h3>
                    <div class="d-flex gap-2">
                      <span class="text-muted small"><i class="fas fa-fingerprint me-1"></i> ID: {{ selectedIndicator.indicatorid || 'N/A' }}</span>
                      <span class="text-muted small"><i class="fas fa-clock me-1"></i> Last Seen: {{ formatDate(selectedIndicator.properties?.lastseen) }}</span>
                    </div>
                  </div>
                  <div class="risk-gauge-large" :class="selectedIndicator.risk">
                    <span class="risk-label">RISK</span>
                    <span class="risk-value">{{ selectedIndicator.risk.toUpperCase() }}</span>
                  </div>
                </div>
              </div>

              <!-- Technical Attributes Grid -->
              <div class="row g-4 mb-4">
                <div class="col-md-7">
                  <div class="intel-box p-3 rounded-4 bg-light border-0">
                    <label class="section-label-small mb-3">TECHNICAL ATTRIBUTES</label>
                    <div class="row g-3">
                      <div class="col-6" v-if="getAttribute(selectedIndicator, 'geo_country')">
                        <small class="d-block text-muted">Location</small>
                        <span class="fw-bold"><i class="fas fa-globe-asia me-1 text-primary"></i> {{ getAttribute(selectedIndicator, 'geo_country') }}</span>
                      </div>
                      <div class="col-6" v-if="getAttribute(selectedIndicator, 'asn')">
                        <small class="d-block text-muted">ASN</small>
                        <span class="fw-bold">{{ getAttribute(selectedIndicator, 'asn') }}</span>
                      </div>
                      <div class="col-12" v-if="getAttribute(selectedIndicator, 'dns_record')">
                        <small class="d-block text-muted">DNS Records</small>
                        <div class="d-flex flex-wrap gap-1 mt-1">
                          <span v-for="dns in selectedIndicator.attributes.dns_record.slice(0, 3)" :key="dns" class="badge bg-white text-dark border fw-normal">{{ dns }}</span>
                        </div>
                      </div>
                      <div class="col-12" v-if="getAttribute(selectedIndicator, 'ssl_subject')">
                        <small class="d-block text-muted">SSL Certificate Subject</small>
                        <span class="fw-bold text-break" style="font-size: 0.75rem;">{{ getAttribute(selectedIndicator, 'ssl_subject') }}</span>
                      </div>
                      <div class="col-12" v-if="getAttribute(selectedIndicator, 'whois_registrar')">
                        <small class="d-block text-muted">Registrar</small>
                        <span class="fw-bold">{{ getAttribute(selectedIndicator, 'whois_registrar') }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-5">
                  <div class="intel-box p-3 rounded-4 bg-dark text-white border-0 h-100">
                    <label class="section-label-small mb-3 text-white opacity-50">THREAT ASSOCIATION</label>
                    <div class="threat-items">
                      <div v-for="threat in selectedIndicator.threats" :key="threat.name" class="threat-item-pill">
                        <i class="fas fa-biohazard me-2 text-danger"></i> {{ threat.name }}
                      </div>
                      <div v-if="!selectedIndicator.threats?.length" class="text-center py-4 opacity-50">
                        <i class="fas fa-check-shield fs-1 mb-2"></i>
                        <p class="small">No active threats detected</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Feeds and Feeds Detail -->
              <div class="row">
                <div class="col-12">
                  <div class="intel-box p-3 rounded-4 border">
                    <label class="section-label-small mb-3">INTEL FEEDS & SOURCES</label>
                    <div class="d-flex flex-wrap gap-2">
                      <span v-for="feed in selectedIndicator.feeds" :key="feed.name" class="feed-tag">
                        {{ feed.name }}
                      </span>
                      <span v-if="!selectedIndicator.feeds?.length" class="text-muted small">No source feed history found.</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 pt-4 border-top d-flex justify-content-between align-items-center">
                <div class="source-info">
                  <img src="https://pulsedive.com/img/pulsedive_logo.png" height="18" alt="Pulsedive" class="me-2 opacity-50">
                  <span class="text-muted x-small">Powered by Pulsedive Community Intelligence</span>
                </div>
                <button class="btn btn-sm btn-link text-decoration-none" @click="openPulsedive(selectedIndicator.indicator)">
                  Lihat di Pulsedive.com <i class="fas fa-external-link-alt ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataBreachMonitor",
  data() {
    return {
      // Email Breach State
      userTerm: "",
      isChecking: false,
      checkResult: null,
      emailError: "",
      rateLimitCountdown: 0,

      // IOC Monitor State
      iocTerm: "",
      isIocChecking: false,
      iocError: "",
      isFeedLoading: false,
      feedItems: [],
      
      // Selection
      selectedIndicator: null,
      selectedValue: null,
      isLoadingDetail: false
    };
  },
  methods: {
    // BREACH CHECKER METHODS
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

    // IOC MONITOR METHODS
    async fetchThreatFeed() {
      this.isFeedLoading = true;
      try {
        const response = await fetch('/api/pulsedive?action=feed');
        const data = await response.json();
        if (data.success && data.results?.length > 0) {
          this.feedItems = data.results;
          // Load first one
          if (this.feedItems.length > 0 && !this.selectedValue) {
            this.loadIndicator(this.feedItems[0].value);
          }
        } else {
          this.setMockFeed();
        }
      } catch (e) {
        this.setMockFeed();
      } finally {
        this.isFeedLoading = false;
      }
    },

    setMockFeed() {
      this.feedItems = [
        { indicatorid: "m1", value: "185.196.220.34", type: "ip", risk: "critical", lastseen: new Date().toISOString() },
        { indicatorid: "m2", value: "payment-update-center.tk", type: "domain", risk: "high", lastseen: new Date().toISOString() },
        { indicatorid: "m3", value: "45.147.230.12", type: "ip", risk: "high", lastseen: new Date().toISOString() },
        { indicatorid: "m4", value: "microsoft-security-alert.net", type: "domain", risk: "medium", lastseen: new Date().toISOString() },
        { indicatorid: "m5", value: "91.241.19.44", type: "ip", risk: "high", lastseen: new Date().toISOString() }
      ];
      if (this.feedItems.length > 0 && !this.selectedValue) {
        this.loadIndicator(this.feedItems[0].value);
      }
    },

    async loadIndicator(value) {
      if (!value) return;
      this.selectedValue = value;
      this.isLoadingDetail = true;
      this.selectedIndicator = null;
      
      try {
        const response = await fetch(`/api/pulsedive?indicator=${encodeURIComponent(value)}`);
        const data = await response.json();
        if (data.success) {
          this.selectedIndicator = data.data;
        } else {
          this.iocError = data.error || "Gagal memuat data.";
        }
      } catch (e) {
        this.iocError = "Terjadi kesalahan koneksi intelijen.";
      } finally {
        this.isLoadingDetail = false;
      }
    },

    async checkIocStatus() {
      const term = this.iocTerm.trim();
      if (!term) return;
      this.isIocChecking = true;
      try {
        await this.loadIndicator(term);
        this.iocTerm = "";
      } finally {
        this.isIocChecking = false;
      }
    },

    getAttribute(obj, key) {
      if (obj?.attributes?.[key] && obj.attributes[key].length > 0) {
        return obj.attributes[key][0];
      }
      return null;
    },

    formatDate(dateStr) {
      if (!dateStr) return "N/A";
      return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    },

    openPulsedive(indicator) {
      window.open(`https://pulsedive.com/indicator/?ioc=${encodeURIComponent(indicator)}`, '_blank');
    }
  },
  mounted() {
    this.fetchThreatFeed();
  }
};
</script>

<style scoped>
.intel-container { padding: 1.5rem 0; animation: fadeIn 0.5s ease-out; }
.intel-section-title { font-weight: 850; color: #0f172a; letter-spacing: -0.5px; }

.panel-card { background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; }

.section-label { font-size: 0.75rem; font-weight: 800; color: #64748b; letter-spacing: 1px; }

/* Feed Styling */
.feed-item { padding: 1.25rem; cursor: pointer; transition: all 0.2s; border-bottom: 1px solid rgba(255,255,255,0.1) !important; position: relative; }
.feed-item:hover { background: rgba(255,255,255,0.05); }
.feed-item.active { background: rgba(59, 130, 246, 0.15); border-left: 4px solid #3b82f6 !important; }

.badge-type { font-size: 0.6rem; font-weight: 800; padding: 0.1rem 0.5rem; border-radius: 4px; background: rgba(255,255,255,0.1); color: #94a3b8; }

.risk-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); }
.risk-dot.none { background: #22c55e; }
.risk-dot.low { background: #3b82f6; }
.risk-dot.medium { background: #f59e0b; }
.risk-dot.high { background: #ef4444; }
.risk-dot.critical { background: #7f1d1d; box-shadow: 0 0 10px #ef4444; }

.indicator-value { font-weight: 800; font-family: 'Courier New', Courier, monospace; font-size: 0.95rem; margin-top: 0.5rem; }

/* Inspector Styling */
.risk-gauge-large { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 90px; height: 90px; border-radius: 20px; border: 4px solid; }
.risk-gauge-large.none { border-color: #22c55e; background: #f0fdf4; color: #166534; }
.risk-gauge-large.low { border-color: #3b82f6; background: #eff6ff; color: #1e40af; }
.risk-gauge-large.medium { border-color: #f59e0b; background: #fffbeb; color: #854d0e; }
.risk-gauge-large.high { border-color: #ef4444; background: #fef2f2; color: #991b1b; }
.risk-gauge-large.critical { border-color: #7f1d1d; background: #7f1d1d; color: white; animation: hazard-blink 1.5s infinite; }

@keyframes hazard-blink { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }

.risk-label { font-size: 0.6rem; font-weight: 800; opacity: 0.7; }
.risk-value { font-size: 0.85rem; font-weight: 900; }

.section-label-small { font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block; }

.intel-box { background: #f8fafc; }

.threat-item-pill { background: #ef4444; color: white; padding: 0.5rem 1rem; border-radius: 12px; font-size: 0.8rem; font-weight: 800; margin-bottom: 0.5rem; width: 100%; box-shadow: 0 4px 6px rgba(239, 44, 44, 0.2); }

.feed-tag { background: white; color: #334155; padding: 0.4rem 0.8rem; border-radius: 10px; font-size: 0.75rem; font-weight: 700; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }

.loading-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.9); z-index: 10; border-radius: 24px; }

.x-small { font-size: 0.65rem; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }

/* Custom Scrollbar for Feed */
.feed-container::-webkit-scrollbar { width: 6px; }
.feed-container::-webkit-scrollbar-track { background: transparent; }
.feed-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.feed-container::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
</style>
