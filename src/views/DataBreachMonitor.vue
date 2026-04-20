<template>
  <div class="intel-container">
    <div class="intel-header mb-4">
      <div class="d-flex align-items-center gap-3">
        <h2 class="intel-section-title mb-0">Cyber Threat Intelligence</h2>
        <span class="badge source-info-pill">
          <i class="fas fa-shield-alt me-1"></i> Multi-Source OSINT
        </span>
      </div>
      <p class="text-muted mt-2 mb-0" style="font-size: 0.85rem;">
        Monitoring kebocoran data (Breach) dan intelijen indikator ancaman (IOC) secara real-time.
      </p>
    </div>

    <!-- Section 1: Cek Email (Breach) - KEPT AS REQUESTED -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="panel-card p-4 shadow-sm border border-danger-subtle">
          <div class="row align-items-center">
            <div class="col-md-3">
              <h6 class="mb-0 fw-bold text-danger">BREACH CHECKER</h6>
              <p class="mb-0 text-muted" style="font-size: 0.7rem;">Cek kebocoran email via BreachDirectory.</p>
            </div>
            <div class="col-md-9">
              <div class="input-group input-group-sm rounded-3 overflow-hidden border">
                <span class="input-group-text bg-light border-0"><i class="fas fa-envelope text-muted"></i></span>
                <input 
                  type="email" 
                  class="form-control border-0" 
                  v-model="userTerm" 
                  placeholder="Masukkan email untuk dicek..."
                  :disabled="isChecking"
                  @keyup.enter="checkBreachStatus"
                >
                <button 
                  class="btn btn-danger px-4" 
                  @click="checkBreachStatus"
                  :disabled="isChecking || !userTerm"
                >
                  <span v-if="isChecking" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isChecking ? 'Checking...' : 'Cek Kebocoran' }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="emailError" class="text-danger small mt-2 ms-1 fw-bold" style="font-size: 0.7rem;">
            <i class="fas fa-exclamation-triangle me-1"></i> {{ emailError }}
          </div>

          <!-- Result Area for Email -->
          <div v-if="checkResult" class="mt-4 animate-fade-in">
            <div v-if="!checkResult.found" class="alert alert-success border-0 rounded-3 p-3">
              <i class="fas fa-check-circle me-2"></i> <span class="small fw-bold">Email aman, tidak ditemukan kebocoran pada database kami.</span>
            </div>
            <div v-else class="breach-result-box p-3 rounded-3 border border-danger">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-danger">Terdeteksi di {{ checkResult.size }} sumber</span>
              </div>
              <div class="table-responsive">
                <table class="table table-sm table-hover mb-0" style="font-size: 0.75rem;">
                  <thead>
                    <tr class="text-muted">
                      <th>Sumber</th>
                      <th>Tipe Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in checkResult.list" :key="index">
                      <td>
                        <div class="d-flex flex-wrap gap-1">
                          <span v-for="source in item.sources" :key="source" class="badge bg-light text-dark border">{{ source }}</span>
                        </div>
                      </td>
                      <td>
                        <span :class="item.hash_password ? 'text-success' : 'text-danger fw-bold'">
                          {{ item.hash_password ? 'Hashed' : 'PLAINTEXT' }}
                        </span>
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

    <!-- Section 2: IOC Monitor (Pulsedive) - NEW -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="panel-card p-4 shadow-sm border border-primary-subtle bg-dark text-white">
          <div class="row align-items-center">
            <div class="col-md-3">
              <h6 class="mb-0 fw-bold text-primary">IOC MONITOR</h6>
              <p class="mb-0 text-muted" style="font-size: 0.7rem;">Real-time Intelligence via Pulsedive.</p>
            </div>
            <div class="col-md-9">
              <div class="input-group input-group-sm rounded-3 overflow-hidden border border-secondary">
                <span class="input-group-text bg-secondary border-0"><i class="fas fa-search-location text-white"></i></span>
                <input 
                  type="text" 
                  class="form-control bg-dark text-white border-0" 
                  v-model="iocTerm" 
                  placeholder="Masukkan IP, Domain, atau URL (e.g. 8.8.8.8, google.com)..."
                  :disabled="isIocChecking"
                  @keyup.enter="checkIocStatus"
                >
                <button 
                  class="btn btn-primary px-4" 
                  @click="checkIocStatus"
                  :disabled="isIocChecking || !iocTerm"
                >
                  <span v-if="isIocChecking" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isIocChecking ? 'Analyzing...' : 'Analisis IOC' }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="iocError" class="text-warning small mt-2 ms-1 fw-bold" style="font-size: 0.7rem;">
            <i class="fas fa-exclamation-circle me-1"></i> {{ iocError }}
          </div>

          <!-- IOC Result Area -->
          <div v-if="iocResult" class="mt-4 animate-fade-in">
            <div class="row g-3">
              <!-- Risk Card -->
              <div class="col-md-4">
                <div class="ioc-info-card text-center p-3 h-100 rounded-3 border" :class="getRiskClass(iocResult.risk)">
                  <label class="text-muted small fw-bold d-block mb-2">RISK SCORE</label>
                  <div class="risk-score-value">{{ iocResult.risk.toUpperCase() }}</div>
                  <div class="small mt-2 opacity-75">Recommended: {{ iocResult.risk_recommended || 'Unknown' }}</div>
                </div>
              </div>
              
              <!-- Technical Details Grid -->
              <div class="col-md-8">
                <div class="row g-3">
                  <!-- DNS/WHOIS -->
                  <div class="col-sm-6">
                    <div class="ioc-sub-card p-3 rounded-3 bg-secondary-subtle text-dark border h-100">
                      <h6 class="small fw-bold mb-2"><i class="fas fa-network-wired me-2"></i>DNS & WHOIS</h6>
                      <ul class="list-unstyled mb-0 small" v-if="iocResult.attributes">
                        <li v-if="iocResult.attributes.whois_registrar"><strong>Registrar:</strong> {{ iocResult.attributes.whois_registrar[0] }}</li>
                        <li v-if="iocResult.attributes.whois_creation_date"><strong>Created:</strong> {{ iocResult.attributes.whois_creation_date[0] }}</li>
                        <li v-if="iocResult.attributes.dns_record"><strong>A Records:</strong> {{ iocResult.attributes.dns_record.slice(0, 2).join(', ') }}</li>
                        <li v-else class="text-muted">No data available</li>
                      </ul>
                    </div>
                  </div>
                  <!-- SSL/Geo -->
                  <div class="col-sm-6">
                    <div class="ioc-sub-card p-3 rounded-3 bg-secondary-subtle text-dark border h-100">
                      <h6 class="small fw-bold mb-2"><i class="fas fa-globe-americas me-2"></i>SSL & GEOLOCATION</h6>
                      <ul class="list-unstyled mb-0 small" v-if="iocResult.attributes">
                        <li v-if="iocResult.attributes.ssl_subject"><strong>SSL Cert:</strong> {{ iocResult.attributes.ssl_subject[0] }}</li>
                        <li v-if="iocResult.attributes.geo_country"><strong>Country:</strong> {{ iocResult.attributes.geo_country[0] }}</li>
                        <li v-if="iocResult.attributes.geo_city"><strong>City:</strong> {{ iocResult.attributes.geo_city[0] }}</li>
                        <li v-else class="text-muted">No geolocation data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Threats & Feeds -->
            <div class="row mt-3 g-3">
              <div class="col-md-6">
                <div class="ioc-sub-card p-3 rounded-3 bg-dark border h-100">
                  <h6 class="small fw-bold mb-2 text-primary"><i class="fas fa-biohazard me-2"></i>ASSOCIATED THREATS</h6>
                  <div class="d-flex flex-wrap gap-2">
                    <span v-for="threat in iocResult.threats" :key="threat.name" class="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-25">
                      {{ threat.name }}
                    </span>
                    <span v-if="!iocResult.threats || !iocResult.threats.length" class="text-muted small">No known threats associated.</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="ioc-sub-card p-3 rounded-3 bg-dark border h-100">
                  <h6 class="small fw-bold mb-2 text-info"><i class="fas fa-rss me-2"></i>INTEL FEEDS</h6>
                  <div class="d-flex flex-wrap gap-2">
                    <span v-for="feed in iocResult.feeds" :key="feed.name" class="badge bg-info bg-opacity-25 text-info border border-info border-opacity-25">
                      {{ feed.name }}
                    </span>
                    <span v-if="!iocResult.feeds || !iocResult.feeds.length" class="text-muted small">No active feed presence.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Metrics Cards (Updated for combined intelligence) -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="metric-card shadow-sm">
          <div class="metric-icon bg-navy">
            <i class="fas fa-database"></i>
          </div>
          <div class="metric-info">
            <span class="metric-label">Breach Database</span>
            <h3 class="metric-value">91M+</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="metric-card shadow-sm">
          <div class="metric-icon bg-primary">
            <i class="fas fa-microscope"></i>
          </div>
          <div class="metric-info">
            <span class="metric-label">Indicators Monitored</span>
            <h3 class="metric-value">Pulsedive</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="metric-card shadow-sm">
          <div class="metric-icon bg-danger">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="metric-info">
            <span class="metric-label">Active Threats</span>
            <h3 class="metric-value">Live</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="metric-card shadow-sm">
          <div class="metric-icon bg-success">
            <i class="fas fa-check-double"></i>
          </div>
          <div class="metric-info">
            <span class="metric-label">System Integrity</span>
            <h3 class="metric-value">Optimal</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const CONFIG = {
  EMAIL_REGEX: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
};

export default {
  name: "DataBreachMonitor",
  data() {
    return {
      // Email Breach State
      userTerm: "",
      isChecking: false,
      checkResult: null,
      emailError: "",
      apiError: "",

      // IOC Monitor State
      iocTerm: "",
      isIocChecking: false,
      iocResult: null,
      iocError: ""
    };
  },
  methods: {
    // Section 1: Email Breach Check
    async checkBreachStatus() {
      const sanitizedTerm = (this.userTerm || "").trim().toLowerCase();
      if (!sanitizedTerm || !CONFIG.EMAIL_REGEX.test(sanitizedTerm)) {
        this.emailError = "Format email tidak valid";
        return;
      }
      
      this.emailError = "";
      this.isChecking = true;
      this.checkResult = null;

      try {
        const response = await fetch(`/api/breach?email=${encodeURIComponent(sanitizedTerm)}`);
        const data = await response.json();

        if (response.status === 429) {
          this.emailError = "Limit tercapai, coba lagi nanti.";
          return;
        }

        if (data.success && data.found > 0) {
          this.checkResult = { found: true, size: data.found, list: data.result || [] };
        } else {
          this.checkResult = { found: false };
        }
      } catch (err) {
        this.emailError = "Gagal terhubung ke database breach.";
      } finally {
        this.isChecking = false;
      }
    },

    // Section 2: IOC Monitor (Pulsedive)
    async checkIocStatus() {
      const term = (this.iocTerm || "").trim();
      if (!term) return;

      this.iocError = "";
      this.isIocChecking = true;
      this.iocResult = null;

      try {
        const response = await fetch(`/api/pulsedive?indicator=${encodeURIComponent(term)}`);
        const data = await response.json();

        if (data.success) {
          this.iocResult = data.data;
        } else {
          this.iocError = data.error || "Indicator tidak ditemukan atau API error.";
        }
      } catch (err) {
        this.iocError = "Terjadi kesalahan saat menghubungi Pulsedive.";
      } finally {
        this.isIocChecking = false;
      }
    },

    getRiskClass(risk) {
      if (!risk) return 'border-secondary';
      const r = risk.toLowerCase();
      if (r === 'none') return 'border-success-subtle bg-success-subtle text-success';
      if (r === 'low') return 'border-info-subtle bg-info-subtle text-info';
      if (r === 'medium') return 'border-warning-subtle bg-warning-subtle text-warning';
      if (r === 'high' || r === 'critical') return 'border-danger-subtle bg-danger-subtle text-danger';
      return 'border-secondary';
    }
  }
};
</script>

<style scoped>
.intel-container {
  padding: 1rem 0;
  animation: fadeIn 0.5s ease-out;
}

.intel-section-title {
  font-weight: 850;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.source-info-pill {
  background: #f1f5f9;
  color: #475569;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.75rem;
}

.panel-card {
  background: white;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.panel-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.risk-score-value {
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
}

.ioc-info-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ioc-sub-card {
  transition: all 0.2s ease;
}

.ioc-sub-card:hover {
  background-color: #f8fafc !important;
}

.bg-navy { background: #0f172a; }

.metric-card {
  background: white;
  padding: 1.25rem;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e2e8f0;
}

.metric-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.metric-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
</style>
