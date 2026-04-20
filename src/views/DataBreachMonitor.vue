<template>
  <div class="breach-container">
    <!-- 4 Metric Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-3" v-for="card in metricCards" :key="card.label">
        <div class="metric-card shadow-sm">
          <div class="metric-icon" :style="{ background: card.bg }">
            <i :class="`fas ${card.icon}`"></i>
          </div>
          <div class="metric-info">
            <span class="metric-label">{{ card.label }}</span>
            <h3 class="metric-value">{{ card.value }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- 3 Columns Layout -->
    <div class="row g-4">
      <!-- Column 1: Filter Workspace -->
      <div class="col-lg-3 breach-col-filter">
        <div class="panel-card p-4 h-100">
          <h6 class="section-label mb-3">FILTER WORKSPACE</h6>
          
          <!-- API Config Accordion -->
          <div class="api-accordion mb-4">
            <button class="btn btn-api-toggle w-100 d-flex justify-content-between align-items-center" @click="showConfig = !showConfig">
              <span><i class="fas fa-cog me-2"></i>Konfigurasi API</span>
              <i class="fas" :class="showConfig ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
            </button>
            <div v-if="showConfig" class="api-config-panel mt-2 p-3">
              <div class="mb-3">
                <label class="form-label small fw-bold">Breach Directory API Key</label>
                <input type="password" class="form-control form-control-sm" v-model="config.BREACHDIR_API_KEY" placeholder="Masukkan key...">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-bold">IntelligenceX API Key</label>
                <input type="password" class="form-control form-control-sm" v-model="config.INTELX_API_KEY" placeholder="Masukkan key...">
              </div>
              <button class="btn btn-save-config btn-sm w-100" @click="saveConfig">
                Simpan Konfigurasi
              </button>
              <div v-if="configSaved" class="alert alert-success py-1 px-2 mt-2 small">Tersimpan!</div>
            </div>
          </div>

          <!-- Category Chips -->
          <div class="filter-group mb-4">
            <label class="form-label small fw-bold text-muted mb-2">KATEGORI</label>
            <div class="d-flex flex-wrap gap-2">
              <button 
                v-for="cat in categories" 
                :key="cat"
                class="filter-chip"
                :class="{ active: activeCategory === cat }"
                @click="activeCategory = cat"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- Filters -->
          <div class="mb-3">
            <label class="form-label small fw-bold">TAHUN</label>
            <select class="form-select form-select-sm" v-model="filterYear">
              <option value="Semua">Semua Tahun</option>
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              <option value="≤2020">≤2020</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">NEGARA</label>
            <select class="form-select form-select-sm" v-model="filterCountry">
              <option value="Semua">Semua Negara</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Global">Global</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold">CARI</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text"><i class="fas fa-search"></i></span>
              <input type="text" class="form-control" v-model="searchQuery" placeholder="Nama organisasi/domain...">
            </div>
          </div>

          <button class="btn btn-outline-secondary btn-sm w-100 mb-4" @click="resetFilters">
            Atur ulang filter
          </button>

          <div class="stats-box-dark mt-auto">
            <small class="d-block text-muted">BREACH DITAMPILKAN</small>
            <div class="d-flex align-items-baseline gap-2">
              <span class="fs-4 fw-bold text-white">{{ filteredBreaches.length }}</span>
              <span class="small text-muted">entri ditemukan</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Column 2: Breach List -->
      <div class="col-lg-5 breach-col-list">
        <div class="panel-card h-100">
          <div class="p-4 border-bottom d-flex justify-content-between align-items-center">
            <h6 class="section-label mb-0">DAFTAR BREACH <span class="badge bg-navy ms-2">{{ breaches.length }}</span></h6>
            <div class="pagination-info small text-muted">
              Hal {{ currentPage }} dari {{ totalPages }}
            </div>
          </div>

          <div class="breach-scroll-area">
            <div v-if="isLoading" class="p-5 text-center">
              <div class="spinner-border text-primary mb-3"></div>
              <p class="text-muted">Mengambil data breach...</p>
            </div>

            <div v-else-if="fetchError" class="p-5 text-center">
              <i class="fas fa-exclamation-circle text-danger fs-1 mb-3"></i>
              <p class="mb-3">{{ fetchError }}</p>
              <button class="btn btn-primary btn-sm" @click="fetchInitialData">Coba Lagi</button>
            </div>

            <div v-else class="breach-list">
              <div 
                v-for="breach in paginatedBreaches" 
                :key="breach.name" 
                class="breach-card"
                :class="{ selected: selectedBreach?.name === breach.name }"
                @click="selectedBreach = breach"
              >
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <span class="breach-id">{{ breach.id || 'N/A' }}</span>
                  <div class="d-flex gap-1">
                    <span class="badge badge-source">{{ breach.source }}</span>
                    <span class="badge badge-category">{{ breach.category }}</span>
                  </div>
                </div>
                <h5 class="breach-name mb-1">{{ breach.name }}</h5>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="breach-meta">{{ breach.domain }} • {{ formatCount(breach.accounts) }} akun</span>
                  <span class="breach-date">{{ formatDate(breach.date) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-3 border-top mt-auto d-flex justify-content-center gap-2">
            <button class="btn btn-sm btn-outline-navy" :disabled="currentPage === 1" @click="currentPage--">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="btn btn-sm btn-outline-navy" :disabled="currentPage === totalPages" @click="currentPage++">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Column 3: Breach Inspector -->
      <div class="col-lg-4 breach-col-inspector">
        <div class="panel-card h-100 overflow-hidden d-flex flex-column">
          <div class="p-4 border-bottom">
            <h6 class="section-label mb-0">BREACH INSPECTOR</h6>
          </div>
          
          <div v-if="!selectedBreach" class="p-5 text-center text-muted my-auto">
            <i class="fas fa-search-location fs-1 mb-3 opacity-25"></i>
            <p>Pilih breach dari daftar untuk melihat detail</p>
          </div>

          <div v-else class="inspector-content p-4">
            <h4 class="inspector-title mb-3">{{ selectedBreach.name }}</h4>
            
            <div class="d-flex flex-wrap gap-2 mb-4">
              <span class="badge badge-inspector">{{ selectedBreach.category }}</span>
              <span class="badge badge-inspector">{{ selectedBreach.source }}</span>
              <span class="badge badge-inspector">{{ formatDate(selectedBreach.date) }}</span>
              <span class="badge badge-inspector">{{ selectedBreach.country || 'Global' }}</span>
            </div>

            <div class="inspector-section mb-4">
              <label class="section-label-small">RINGKASAN</label>
              <p class="inspector-text">{{ selectedBreach.description || 'Tidak ada deskripsi tersedia.' }}</p>
              <small class="text-muted d-block mt-2" style="font-size: 0.7rem; font-style: italic;">
                * Sumber data: Have I Been Pwned / Public OSINT Repositories
              </small>
            </div>

            <div class="inspector-section mb-4">
              <label class="section-label-small">DATA YANG BOCOR</label>
              <div class="d-flex flex-wrap gap-1">
                <span v-for="data in selectedBreach.dataClasses" :key="data" class="data-chip">
                  {{ data }}
                </span>
              </div>
            </div>

            <div class="inspector-section mt-auto pt-4 border-top">
              <label class="section-label-small">CEK EMAIL / DOMAIN</label>
              <div class="input-group mb-3">
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="userTerm" 
                  placeholder="Email atau domain..."
                  :disabled="isChecking || !isApiConfigured"
                >
                <button 
                  class="btn btn-navy" 
                  @click="checkBreachStatus"
                  :disabled="isChecking || !userTerm || !isApiConfigured"
                >
                  <span v-if="isChecking" class="spinner-border spinner-border-sm"></span>
                  <span v-else>Periksa</span>
                </button>
              </div>

              <div v-if="!isApiConfigured" class="alert alert-warning py-2 small">
                <i class="fas fa-info-circle me-1"></i> Tambahkan API key di konfigurasi untuk menggunakan fitur ini.
              </div>

              <div v-if="checkResult" :class="`alert py-2 ${checkResult.found ? 'alert-danger' : 'alert-success'}`">
                <div v-if="checkResult.found">
                  <strong class="d-block mb-1">Ditemukan di database breach!</strong>
                  <ul class="mb-0 ps-3 small">
                    <li v-for="b in checkResult.list" :key="b">{{ b }}</li>
                  </ul>
                </div>
                <div v-else>
                  <i class="fas fa-check-circle me-1"></i> Tidak ditemukan di database breach.
                </div>
              </div>

              <div v-if="rateLimitCountdown > 0" class="alert alert-info py-1 small">
                Coba lagi dalam {{ rateLimitCountdown }} detik.
              </div>

              <div v-if="corsMessage" class="alert alert-danger py-2 small">
                <i class="fas fa-exclamation-triangle me-1"></i> {{ corsMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const CONFIG = {
  ITEMS_PER_PAGE: 20,
  STATIC_DB_URL: '/data/breaches.json'
};

export default {
  name: "DataBreachMonitor",
  data() {
    return {
      showConfig: false,
      config: {
        BREACHDIR_API_KEY: localStorage.getItem('BREACHDIR_API_KEY') || '',
        INTELX_API_KEY: localStorage.getItem('INTELX_API_KEY') || ''
      },
      configSaved: false,
      activeCategory: "Semua",
      categories: ["Semua", "Terverifikasi", "Kredensial", "Database", "Pemerintah", "Keuangan"],
      filterYear: "Semua",
      filterCountry: "Semua",
      years: ["2025", "2024", "2023", "2022", "2021"],
      searchQuery: "",
      breaches: [],
      isLoading: true,
      fetchError: null,
      selectedBreach: null,
      currentPage: 1,
      userTerm: "",
      isChecking: false,
      checkResult: null,
      rateLimitCountdown: 0,
      corsMessage: ""
    };
  },
  computed: {
    isApiConfigured() {
      return this.config.BREACHDIR_API_KEY !== '';
    },
    filteredBreaches() {
      return this.breaches.filter(b => {
        const matchesCategory = this.activeCategory === "Semua" || b.category === this.activeCategory;
        const matchesYear = this.filterYear === "Semua" || 
                           (this.filterYear === "≤2020" ? parseInt(b.date?.split('-')[0]) <= 2020 : b.date?.startsWith(this.filterYear));
        const matchesCountry = this.filterCountry === "Semua" || 
                              (this.filterCountry === "Indonesia" ? (b.country === "Indonesia" || b.domain?.endsWith('.id')) : b.country !== "Indonesia");
        const matchesSearch = !this.searchQuery || 
                             b.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                             b.domain?.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesCategory && matchesYear && matchesCountry && matchesSearch;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredBreaches.length / CONFIG.ITEMS_PER_PAGE) || 1;
    },
    paginatedBreaches() {
      const start = (this.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
      return this.filteredBreaches.slice(start, start + CONFIG.ITEMS_PER_PAGE);
    },
    metricCards() {
      const totalAccounts = this.breaches.reduce((acc, b) => acc + (parseInt(b.accounts) || 0), 0);
      const indonesiaBreaches = this.breaches.filter(b => b.country === "Indonesia" || b.domain?.endsWith('.id')).length;
      const currentYearBreaches = this.breaches.filter(b => b.date?.startsWith('2025')).length;

      return [
        { label: "Total Database", value: this.breaches.length, icon: "fa-database", bg: "#144e72" },
        { label: "Akun Terdampak", value: this.formatCount(totalAccounts), icon: "fa-users", bg: "#1f6f78" },
        { label: "Target Indonesia", value: indonesiaBreaches, icon: "fa-flag", bg: "#991b1b" },
        { label: "Breach 2025", value: currentYearBreaches, icon: "fa-calendar-check", bg: "#854d0e" }
      ];
    }
  },
  methods: {
    async fetchInitialData() {
      this.isLoading = true;
      this.fetchError = null;
      try {
        const response = await fetch(CONFIG.STATIC_DB_URL);
        if (!response.ok) throw new Error('Gagal mengambil database statis.');
        const data = await response.json();
        
        // CISA/GitHub JSON structures vary, mapping to standard format
        this.breaches = data.map(b => ({
          id: b.id || b.Name?.substring(0, 8),
          name: b.Name || b.title,
          domain: b.Domain || b.domain,
          accounts: b.PwnCount || b.accounts || 0,
          date: b.BreachDate || b.date,
          category: this.detectCategory(b),
          source: "Static DB",
          country: b.Country || (b.Domain?.endsWith('.id') ? "Indonesia" : "Global"),
          description: b.Description || b.description,
          dataClasses: b.DataClasses || b.data_types || []
        }));
      } catch (err) {
        this.fetchError = err.message + " Aktifkan CORS extension jika di local.";
      } finally {
        this.isLoading = false;
      }
    },
    detectCategory(b) {
      const desc = (b.Description || "").toLowerCase();
      if (desc.includes('government') || desc.includes('pemerintah')) return "Pemerintah";
      if (desc.includes('bank') || desc.includes('finance')) return "Keuangan";
      if (b.DataClasses?.includes('Passwords')) return "Kredensial";
      return "Database";
    },
    formatCount(num) {
      if (!num) return "0";
      if (num >= 1000000000) return (num / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + " miliar";
      if (num >= 1000000) return (num / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + " juta";
      return num.toLocaleString('id-ID');
    },
    formatDate(dateStr) {
      if (!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    },
    saveConfig() {
      localStorage.setItem('BREACHDIR_API_KEY', this.config.BREACHDIR_API_KEY);
      localStorage.setItem('INTELX_API_KEY', this.config.INTELX_API_KEY);
      this.configSaved = true;
      setTimeout(() => this.configSaved = false, 2000);
    },
    resetFilters() {
      this.activeCategory = "Semua";
      this.filterYear = "Semua";
      this.filterCountry = "Semua";
      this.searchQuery = "";
      this.currentPage = 1;
    },
    async checkBreachStatus() {
      if (!this.userTerm) return;
      this.isChecking = true;
      this.checkResult = null;
      this.corsMessage = "";

      try {
        // Parallel fetch using Promise.all
        const [breachDirRes, psbdmpRes] = await Promise.allSettled([
          this.fetchBreachDirectory(this.userTerm),
          this.fetchPSBDMP(this.userTerm)
        ]);

        let combinedResults = [];
        if (breachDirRes.status === 'fulfilled') combinedResults.push(...breachDirRes.value);
        if (psbdmpRes.status === 'fulfilled') combinedResults.push(...psbdmpRes.value);

        // Deduplicate
        const uniqueList = [...new Set(combinedResults)];

        this.checkResult = {
          found: uniqueList.length > 0,
          list: uniqueList
        };

      } catch (err) {
        this.corsMessage = "Terjadi kesalahan koneksi API. Periksa CORS atau API Key.";
      } finally {
        this.isChecking = false;
      }
    },
    async fetchBreachDirectory(term) {
      // Mocked logic for CORS/API simulation
      const url = `https://breachdirectory.org/api?func=auto&term=${term}`;
      try {
        const res = await fetch(url, {
          headers: { 'X-Api-Key': this.config.BREACHDIR_API_KEY }
        });
        if (res.status === 429) {
          this.startRateLimitTimer();
          return [];
        }
        if (!res.ok) return [];
        const data = await res.json();
        return data.found ? data.sources : [];
      } catch { return []; }
    },
    async fetchPSBDMP(term) {
      const url = `https://psbdmp.ws/api/v3/search/${term}`;
      try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return data.data ? data.data.map(p => `Pastebin Dump: ${p.id}`) : [];
      } catch { return []; }
    },
    startRateLimitTimer() {
      this.rateLimitCountdown = 60;
      const timer = setInterval(() => {
        this.rateLimitCountdown--;
        if (this.rateLimitCountdown <= 0) clearInterval(timer);
      }, 1000);
    }
  },
  mounted() {
    this.fetchInitialData();
  }
};
</script>

<style scoped>
.breach-container {
  padding: 1.5rem 0.5rem;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 1px;
}

.section-label-small {
  display: block;
  font-size: 0.65rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

/* Metric Cards */
.metric-card {
  background: white;
  padding: 1.25rem;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  border: 1px solid #e2e8f0;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.metric-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
}

.metric-value {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 850;
  color: #0f172a;
}

/* Filter Area */
.filter-chip {
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s;
}

.filter-chip:hover {
  background: #f1f5f9;
}

.filter-chip.active {
  background: #0f172a;
  color: white;
  border-color: #0f172a;
}

.api-config-panel {
  background: #f1f5f9;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stats-box-dark {
  background: #0f172a;
  padding: 1rem;
  border-radius: 14px;
}

/* List Area */
.breach-scroll-area {
  flex: 1;
  overflow-y: auto;
  min-height: 500px;
}

.breach-card {
  padding: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
}

.breach-card:hover {
  background: #f8fafc;
}

.breach-card.selected {
  background: #faf8f4;
  border-left: 4px solid #144e72;
}

.breach-id {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 700;
}

.breach-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
}

.breach-meta {
  font-size: 0.8rem;
  color: #64748b;
}

.breach-date {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
}

.badge-source { background: #0c4a6e; color: #f0f9ff; }
.badge-category { background: #92400e; color: #fffbeb; }

.badge-inspector {
  background: #f1f5f9;
  color: #1e293b;
  border: 1px solid #cbd5e1;
  padding: 0.4rem 0.75rem;
  font-weight: 700;
}

/* Inspector Area */
.inspector-title {
  font-weight: 850;
  color: #0f172a;
}

.inspector-text {
  font-size: 0.88rem;
  color: #334155;
  line-height: 1.6;
}

.data-chip {
  background: #f1f5f9;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #475569;
}

.btn-navy {
  background: #144e72;
  color: white;
}

.btn-api-toggle {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 0.85rem;
  font-weight: 700;
}

@media (max-width: 1280px) {
  .breach-col-filter { width: 300px; }
  .breach-col-inspector { width: 350px; }
}

.bg-navy { background: #144e72; }
</style>
