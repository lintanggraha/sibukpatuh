<template>
  <div class="breach-container">
    <div class="breach-header mb-4">
      <div class="d-flex align-items-center gap-3">
        <h2 class="breach-section-title mb-0">Data Breach Monitor</h2>
        <span class="badge source-info-pill">
          <i class="fas fa-database me-1"></i> Source: Have I Been Pwned & Public OSINT Archive
        </span>
      </div>
      <p class="text-muted mt-2 mb-0" style="font-size: 0.85rem;">
        Monitoring basis data kebocoran data global dan nasional dari sumber intelijen keamanan publik (FOSS).
      </p>
    </div>

    <!-- Section 1: Cek Email (Ultra Minimalist) -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="panel-card p-4 shadow-sm border">
          <div class="row align-items-center">
            <div class="col-md-3">
              <h6 class="mb-0 fw-bold text-navy">CEK EMAIL</h6>
              <p class="mb-0 text-muted" style="font-size: 0.7rem;">Cek kebocoran data kamu.</p>
            </div>
            <div class="col-md-9">
              <div class="input-group input-group-sm rounded-3 overflow-hidden border">
                <span class="input-group-text bg-light border-0"><i class="fas fa-envelope text-muted"></i></span>
                <input 
                  type="email" 
                  class="form-control border-0" 
                  v-model="userTerm" 
                  placeholder="Masukkan email..."
                  aria-label="Alamat email untuk diperiksa"
                  :disabled="isChecking"
                  @keyup.enter="checkBreachStatus"
                >
                <button 
                  class="btn btn-navy px-4" 
                  @click="checkBreachStatus"
                  aria-label="Tombol periksa kebocoran"
                  :disabled="isChecking || !userTerm"
                >
                  <span v-if="isChecking" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isChecking ? 'Checking...' : 'Cek Sekarang' }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="emailError" class="text-danger small mt-2 ms-1 fw-bold" style="font-size: 0.7rem;">
            <i class="fas fa-exclamation-triangle me-1"></i> {{ emailError }}
          </div>

          <!-- Loading State -->
          <div v-if="isChecking" class="mt-4 text-center">
            <div class="spinner-border spinner-border-sm text-navy opacity-50"></div>
            <span class="ms-2 text-muted small">Memeriksa database...</span>
          </div>

          <!-- Result Area -->
          <div v-else-if="checkResult" class="mt-4 animate-fade-in">
            <!-- Safe -->
            <div v-if="!checkResult.found" class="alert alert-success border-0 rounded-3 p-3">
              <i class="fas fa-check-circle me-2"></i> <span class="small fw-bold">Email aman, tidak ditemukan kebocoran.</span>
            </div>

            <!-- Breached -->
            <div v-else>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-danger rounded-pill px-3 py-2">
                  <i class="fas fa-exclamation-circle me-1"></i> Terdeteksi di {{ checkResult.size }} sumber
                </span>
                <button class="btn btn-outline-secondary btn-xs" @click="copyAllSources">
                  <i class="fas fa-copy me-1"></i> Salin Sumber
                </button>
              </div>

              <div class="table-responsive border rounded-3">
                <table class="table table-sm table-hover align-middle mb-0" style="font-size: 0.8rem;">
                  <caption class="visually-hidden">Daftar hasil temuan kebocoran data untuk email yang diperiksa</caption>
                  <thead class="bg-light">
                    <tr>
                      <th class="ps-3 py-2">Email</th>
                      <th class="py-2">Tipe</th>
                      <th class="pe-3 py-2">Sumber</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in checkResult.list" :key="index">
                      <td class="ps-3 py-2 fw-bold text-navy">{{ item.email }}</td>
                      <td class="py-2">
                        <span :class="['badge rounded-pill', item.hash_password ? 'bg-secondary' : 'bg-danger']" style="font-size: 0.65rem;">
                          {{ item.hash_password ? 'Hashed' : 'Plaintext' }}
                        </span>
                      </td>
                      <td class="pe-3 py-2">
                        <div class="d-flex flex-wrap gap-1">
                          <span v-for="source in item.sources" :key="source" class="badge-minimal">
                            {{ source }}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="mt-2 mb-0 text-muted" style="font-size: 0.65rem;">
                * Data dari <strong>BreachDirectory</strong>. Disarankan ganti password segera.
              </p>
            </div>
          </div>

          <!-- API Errors -->
          <div v-if="apiError" class="alert alert-warning border-0 rounded-3 p-3 mt-4 small">
            <i class="fas fa-clock me-2"></i> {{ apiError }}
          </div>
        </div>
      </div>
    </div>

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
              <label class="section-label-small">RINGKASAN & ATRIBUSI</label>
              <p class="inspector-text">{{ selectedBreach.description || 'Tidak ada deskripsi tersedia.' }}</p>
              <div class="source-attribution-box mt-3">
                <i class="fas fa-info-circle me-2"></i>
                <span>Data dikumpulkan dari repositori publik <strong>Have I Been Pwned</strong> dan arsip keamanan <strong>OSINT</strong>.</span>
              </div>
            </div>

            <div class="inspector-section mb-4">
              <label class="section-label-small">DATA YANG BOCOR</label>
              <div class="d-flex flex-wrap gap-1">
                <span v-for="data in selectedBreach.dataClasses" :key="data" class="data-chip">
                  {{ data }}
                </span>
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
  STATIC_DB_URL: '/data/breaches.json',
  CATEGORIES: ["Semua", "Terverifikasi", "Kredensial", "Database", "Pemerintah", "Keuangan"],
  YEARS: ["2025", "2024", "2023", "2022", "2021"],
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

export default {
  name: "DataBreachMonitor",
  data() {
    return {
      activeCategory: "Semua",
      categories: CONFIG.CATEGORIES,
      filterYear: "Semua",
      filterCountry: "Semua",
      years: CONFIG.YEARS,
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
      emailError: "",
      apiError: ""
    };
  },
  computed: {
    isApiConfigured() {
      return true; // Now handled by server-side env vars
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
          source: "OSINT ARCHIVE",
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
    resetFilters() {
      this.activeCategory = "Semua";
      this.filterYear = "Semua";
      this.filterCountry = "Semua";
      this.searchQuery = "";
      this.currentPage = 1;
    },
    async checkBreachStatus() {
      // SECURITY: Input Sanitization
      const sanitizedTerm = (this.userTerm || "").trim().toLowerCase();
      if (!sanitizedTerm) return;
      
      // SECURITY: Format Validation (SonarQube Security Hotspot)
      if (!CONFIG.EMAIL_REGEX.test(sanitizedTerm)) {
        this.emailError = "Format email tidak valid";
        return;
      }
      
      this.emailError = "";
      this.isChecking = true;
      this.checkResult = null;
      this.apiError = "";

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`/api/breach?email=${encodeURIComponent(sanitizedTerm)}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await response.json();

        // RELIABILITY: Granular Status Code Handling
        if (response.status === 429) {
          this.apiError = data.error || "Terlalu banyak permintaan.";
          this.startRateLimitTimer();
          return;
        }

        if (!response.ok || data.success === false) {
          this.apiError = data.error || "Gagal melakukan pemeriksaan.";
          return;
        }
        
        // RELIABILITY: Robust Data Handling
        if (data.found > 0) {
          this.checkResult = {
            found: true,
            size: data.found,
            list: data.result || []
          };
        } else {
          this.checkResult = { found: false };
        }

      } catch (err) {
        this.apiError = err.name === 'AbortError' ? "Koneksi timeout." : "Gagal terhubung ke server.";
      } finally {
        this.isChecking = false;
      }
    },
    copyAllSources() {
      if (!this.checkResult || !this.checkResult.list) return;
      const allSources = [...new Set(this.checkResult.list.flatMap(i => i.sources))];
      navigator.clipboard.writeText(allSources.join(', '));
      alert("Semua sumber telah disalin!");
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
.breach-header {
  animation: fadeIn 0.4s ease-out;
}

/* Category Area */
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

.filter-chip:hover { background: #f1f5f9; }
.filter-chip.active { background: #0f172a; color: white; border-color: #0f172a; }

.stats-box-dark { background: #0f172a; padding: 1rem; border-radius: 14px; }

/* List Area */
.breach-scroll-area { flex: 1; overflow-y: auto; min-height: 500px; }
.breach-card { padding: 1.25rem; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: all 0.2s; }
.breach-card:hover { background: #f8fafc; }
.breach-card.selected { background: #faf8f4; border-left: 4px solid #144e72; }

.breach-id { font-family: 'Courier New', Courier, monospace; font-size: 0.7rem; color: #94a3b8; font-weight: 700; }
.breach-name { font-size: 1.05rem; font-weight: 800; color: #0f172a; }
.breach-meta { font-size: 0.8rem; color: #64748b; }
.breach-date { font-size: 0.75rem; font-weight: 700; color: #94a3b8; }

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
.inspector-title { font-weight: 850; color: #0f172a; }
.inspector-text { font-size: 0.88rem; color: #334155; line-height: 1.6; }

.data-chip {
  background: #f1f5f9;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #475569;
}

@media (max-width: 1280px) {
  .breach-col-filter { width: 300px; }
  .breach-col-inspector { width: 350px; }
}
</style>
