<template>
  <div class="nst-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading NIST CSF data...</p>
      </div>
    </div>
    <div v-else-if="error" class="error-state">
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Failed to load data</h3>
        <p>{{ error }}</p>
        <button @click="retryLoad" class="btn btn-primary">Retry</button>
      </div>
    </div>
    <div v-else class="nst-shell">
      <section class="nst-hero">
        <div>
          <span class="nst-kicker"><i class="fas fa-compass"></i>Kerangka Kerja</span>
          <h1 class="nst-title">NIST CSF 2.0 Tinjauan Fungsi Inti</h1>
          <p class="nst-lede">Halaman ini menyajikan subkategori NIST CSF 2.0 dalam tampilan terstruktur yang mendukung analisa fungsi inti, penetapan fokus implementasi, dan penelusuran referensi SP 800-53.</p>
          <div class="nst-metrics">
            <div class="nst-metric"><label>Fungsi Inti</label><strong>{{ totalFuncs }}</strong><span>Tata Kelola, Identifikasi, Perlindungan, Deteksi, Respons, dan Pemulihan.</span></div>
            <div class="nst-metric"><label>Kategori</label><strong>{{ totalCats }}</strong><span>Kelompok topik yang merangkum area pengendalian.</span></div>
            <div class="nst-metric"><label>Subkategori</label><strong>{{ totalSubs }}</strong><span>Subkategori yang dapat dianalisa per fungsi dan kategori.</span></div>
            <div class="nst-metric"><label>Referensi SP 800-53</label><strong>{{ totalSp800 }}</strong><span>Referensi lintas kontrol untuk pendalaman implementasi.</span></div>
          </div>
        </div>
        <div class="nst-side-stack">
          <div class="nst-side"><label>Ruang Lingkup</label><h3>Analisa fungsi inti dalam format yang lebih operasional</h3><p>Setiap subkategori dapat dianalisa berdasarkan fungsi, kategori, kebutuhan bukti, serta referensi SP 800-53 yang mendukung penguatan implementasi.</p></div>
          <div class="nst-side"><label>Alur Analisa</label><p>Gunakan ringkasan untuk melihat distribusi fungsi, lanjutkan ke area eksplorasi untuk menganalisa subkategori, lalu buka referensi SP 800-53 untuk pendalaman kontrol.</p></div>
        </div>
      </section>

      <div class="nst-nav nav" role="tablist">
        <button class="nst-tab" :class="{ active: activeTab === 'overview' }" type="button" role="tab" @click="activeTab = 'overview'"><i class="fas fa-chart-line"></i><span><strong>Ringkasan</strong><span>Distribusi fungsi dan kategori terpadat.</span></span></button>
        <button class="nst-tab" :class="{ active: activeTab === 'explorer' }" type="button" role="tab" @click="activeTab = 'explorer'"><i class="fas fa-table"></i><span><strong>Eksplorasi</strong><span>Filter subkategori dan analisa detail pengendalian.</span></span></button>
        <button class="nst-tab" :class="{ active: activeTab === 'reference' }" type="button" role="tab" @click="activeTab = 'reference'"><i class="fas fa-link"></i><span><strong>Referensi</strong><span>Telusuri kontrol SP 800-53 yang terkait.</span></span></button>
      </div>

      <div class="tab-content nst-grid">
        <!-- Tab 1: Ringkasan -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="nst-grid two">
            <article class="nst-panel">
              <div class="nst-head"><h3>Lanskap fungsi</h3><span class="nst-chip">{{ totalFuncs }} area fungsi</span></div>
              <p class="nst-copy">Distribusi ini membantu melihat porsi perhatian tiap fungsi inti sekaligus memudahkan penyaringan subkategori berdasarkan domain kerja NIST CSF.</p>
              <div class="nst-bars">
                <button v-for="item in functionBreakdown" :key="item.key" type="button" class="nst-bar" @click="jumpExplorer(item.key)"><span><strong>{{ item.label }}</strong><em>{{ item.categories }} kategori</em></span><span class="nst-track"><b :style="{ width: (item.count / maxFunctionCount) * 100 + '%', background: item.color }"></b></span><span class="nst-num">{{ item.count }}</span></button>
              </div>
            </article>
            <article class="nst-panel">
              <div class="nst-head"><h3>Kategori terpadat</h3><span class="nst-chip">6 kategori utama</span></div>
              <div class="nst-mini-row">
                <div class="nst-mini"><label>Bukti Audit</label><strong>{{ totalEvidence }}</strong><span>Total contoh bukti audit yang tercatat pada subkategori NIST.</span></div>
                <div class="nst-mini"><label>Kepadatan Referensi</label><strong>{{ avgRefs }}</strong><span>Rata-rata tautan SP 800-53 per subkategori.</span></div>
                <div class="nst-mini"><label>Keluarga Kontrol</label><strong>{{ familyBreakdown.length }}</strong><span>Keluarga SP 800-53 yang muncul di halaman ini.</span></div>
              </div>
              <div class="nst-hotspots">
                <button v-for="item in topCategories" :key="item.name" type="button" class="nst-hotspot" @click="jumpExplorer(item.function, item.name)"><span><strong>{{ item.name }}</strong><em>{{ getFunctionLabel(item.function) }}</em></span><span class="nst-track"><b :style="{ width: (item.count / maxCategoryCount) * 100 + '%', background: getFunctionColor(item.function) }"></b></span><span class="nst-num">{{ item.count }}</span></button>
              </div>
            </article>
          </div>
          <article class="nst-panel">
            <div class="nst-head"><h3>Profil fungsi</h3><span class="nst-chip">6 perspektif fungsi</span></div>
            <div class="nst-cards">
              <button v-for="item in functionBreakdown" :key="item.key" type="button" class="nst-card" :style="{ '--accent': item.color }" @click="jumpExplorer(item.key)"><div class="nst-card-top"><span class="nst-icon"><i :class="`fas ${item.icon}`"></i></span><span>{{ item.count }} subkategori</span></div><strong>{{ item.label }}</strong><p>{{ item.summary }}</p></button>
            </div>
          </article>
        </div>

        <!-- Tab 2: Eksplorasi -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="nst-workspace">
            <article class="nst-panel">
              <div class="nst-head"><h3>Filter Tinjauan</h3><span class="nst-chip">{{ totalSubs }} subkategori</span></div>
              <div class="nst-function-grid">
                <button v-for="item in functionBreakdown" :key="item.key" type="button" class="nst-fn" :class="{ active: functionFilter === item.key }" :style="{ '--accent': item.color }" @click="functionFilter = functionFilter === item.key ? '' : item.key"><strong>{{ item.label }}</strong><span>{{ item.count }} subkategori</span></button>
              </div>
              <div class="nst-form">
                <div><label for="functionFilter">Fungsi</label><select id="functionFilter" v-model="functionFilter" class="form-select"><option value="">Semua fungsi</option><option v-for="item in functionBreakdown" :key="item.key" :value="item.key">{{ item.label }}</option></select></div>
                <div><label for="categoryFilter">Kategori</label><select id="categoryFilter" v-model="categoryFilter" class="form-select"><option value="">Semua kategori</option><option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option></select></div>
                <div><label for="controlSearch">Cari subkategori</label><input id="controlSearch" v-model="controlSearch" type="search" class="form-control" placeholder="Cari ID, judul, atau kategori"></div>
                <button type="button" class="btn btn-outline-secondary" @click="resetFilters">Atur ulang filter</button>
              </div>
              <div class="nst-summary"><small>Subkategori Ditampilkan</small><strong>{{ filteredControls.length }}</strong><span>{{ filteredControls.length ? `Menampilkan ${filteredControls.length} subkategori sesuai filter aktif.` : 'Tidak ada subkategori yang cocok dengan filter saat ini.' }}</span></div>
            </article>
            <article class="nst-panel">
              <div class="nst-head"><h3>Daftar subkategori</h3><span class="nst-chip">{{ filteredControls.length }} entri</span></div>
              <div class="nst-list">
                <button v-for="ctrl in paginatedControls" :key="ctrl.id" type="button" class="nst-item" :class="{ active: activeControlId === ctrl.id }" :style="{ '--accent': getFunctionColor(ctrl.function) }" @click="setActiveControl(ctrl.id)"><div class="nst-item-top"><span class="nst-item-code">{{ ctrl.id }}</span><span class="nst-pill">{{ getFunctionLabel(ctrl.function) }}</span></div><div class="nst-item-name">{{ ctrl.title || '-' }}</div><div class="nst-item-meta"><span>{{ ctrl.category || '-' }}</span><span>{{ (ctrl.sp80053 || []).length }} referensi</span></div></button>
                <div v-if="paginatedControls.length === 0" class="nst-empty">Tidak ada subkategori yang cocok dengan filter saat ini.</div>
                <!-- Pagination Controls -->
                <div v-if="totalPages > 1" class="nst-pagination">
                  <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="btn btn-sm btn-outline-secondary me-2"><i class="fas fa-chevron-left"></i> Previous</button>
                  <span class="nst-page-info">Page {{ currentPage }} of {{ totalPages }} ({{ filteredControls.length }} total)</span>
                  <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-sm btn-outline-secondary ms-2">Next <i class="fas fa-chevron-right"></i></button>
                </div>
              </div>
            </article>
            <article class="nst-panel nst-inspector">
              <div class="nst-inspector-head"><small>Detail Subkategori</small><strong>{{ activeControl ? activeControl.id : '-' }}</strong><span>{{ activeControl ? activeControl.title : 'Pilih subkategori untuk membaca detail.' }}</span></div>
              <div class="nst-inspector-body">
                <div class="nst-meta"><span>{{ activeControl ? getFunctionLabel(activeControl.function) : '-' }}</span><span>{{ activeControl ? activeControl.category : '-' }}</span><span>{{ activeControl ? (activeControl.sp80053 || []).length + ' referensi' : '0 referensi' }}</span></div>
                <div class="nst-callout"><span class="nst-label">Deskripsi</span><div class="mt-2">{{ activeControl ? activeControl.description : 'Pilih subkategori untuk membaca deskripsi.' }}</div></div>
                <div class="nst-note"><span class="nst-label"><i class="fas fa-lightbulb me-1"></i>Analogi</span><div class="mt-2">{{ activeControl ? activeControl.analogy : '-' }}</div></div>
                <div class="nst-callout"><span class="nst-label"><i class="fas fa-bullseye me-1"></i>Fokus Implementasi</span><ul class="nst-plain"><li v-for="(item, idx) in (activeControl?.fokus || [])" :key="idx">{{ item }}</li><li v-if="!activeControl?.fokus?.length" class="text-muted">Tidak ada fokus implementasi tambahan.</li></ul></div>
                <div class="nst-callout"><span class="nst-label">Contoh Bukti Audit</span><ul class="nst-plain"><li v-for="(item, idx) in (activeControl && activeControl.evidence && activeControl.evidence.length ? activeControl.evidence : ['Tidak ada contoh bukti audit.'])" :key="idx">{{ item }}</li></ul></div>
                <div class="nst-callout"><span class="nst-label">Referensi SP 800-53</span><div class="nst-refs"><button v-for="ref in (activeControl?.sp80053 || [])" :key="ref" type="button" class="nst-ref" @click="jumpReference(ref)">{{ ref }}</button><span v-if="!activeControl || !activeControl.sp80053 || !activeControl.sp80053.length" class="nst-empty w-100">Belum ada referensi SP 800-53 yang ditautkan.</span></div></div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 3: Referensi SP 800-53 -->
        <div v-if="activeTab === 'reference'" key="reference-tab">
          <div class="nst-refspace">
            <article class="nst-panel">
              <div class="nst-head"><h3>Filter referensi</h3><span class="nst-chip">{{ sp800Controls.length }} kontrol</span></div>
              <div class="nst-form">
                <div><label for="familyFilter">Keluarga Kontrol</label><select id="familyFilter" v-model="familyFilter" class="form-select"><option value="">Semua keluarga</option><option v-for="f in familyBreakdown" :key="f.code" :value="f.code">{{ f.code }} - {{ f.name }}</option></select></div>
                <div><label for="sp800Search">Cari referensi</label><input id="sp800Search" v-model="sp800Search" type="search" class="form-control" placeholder="Cari ID, keluarga, atau deskripsi"></div>
                <button type="button" class="btn btn-outline-secondary" @click="resetSp800Filters">Atur ulang filter</button>
              </div>
              <div class="nst-summary"><small>Referensi Ditampilkan</small><strong>{{ filteredSp800.length }}</strong><span>{{ filteredSp800.length ? `Menampilkan ${filteredSp800.length} kontrol SP 800-53 sesuai filter aktif.` : 'Tidak ada kontrol SP 800-53 yang cocok dengan filter saat ini.' }}</span></div>
              <div class="nst-families mt-3">
                <button v-for="f in familyBreakdown.slice(0, 8)" :key="f.code" type="button" class="nst-family" :class="{ active: familyFilter === f.code }" @click="familyFilter = familyFilter === f.code ? '' : f.code"><span><strong>{{ f.code }} - {{ f.name }}</strong><em>{{ f.count }} kontrol terkait</em></span><span class="nst-num">{{ f.count }}</span></button>
              </div>
            </article>
            <article class="nst-panel">
              <div class="nst-head"><h3>Referensi SP 800-53</h3><span class="nst-chip">{{ filteredSp800.length }} entri</span></div>
              <div class="nst-list">
                <button v-for="ctrl in filteredSp800" :key="ctrl.id" type="button" class="nst-item" @click="openSp800Modal(ctrl)"><div class="nst-item-top"><span class="nst-item-code">{{ ctrl.id }}</span><span class="nst-pill">{{ ctrl.family }}</span></div><div class="nst-item-name">{{ ctrl.family_name || '-' }}</div><div class="nst-item-meta"><span>{{ (ctrl.nist_references || []).length }} referensi NIST</span></div></button>
                <div v-if="filteredSp800.length === 0" class="nst-empty">Tidak ada kontrol SP 800-53 yang cocok dengan filter saat ini.</div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal SP 800-53 -->
  <div v-if="showSp800Modal" class="modal-overlay" @click.self="showSp800Modal = false">
    <div class="modal-dialog">
      <div class="modal-shell">
        <div class="modal-sidebar" style="background: linear-gradient(180deg, #144e72 0%, rgba(20,78,114,.7) 100%)">
          <button type="button" class="modal-close" @click="showSp800Modal = false" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
          <div class="modal-sidebar-icon"><i class="fas fa-shield-alt"></i></div>
          <div class="modal-sidebar-id">{{ selectedSp800?.id || '-' }}</div>
          <div class="modal-sidebar-type">{{ selectedSp800?.family || '' }}</div>
        </div>
        <div class="modal-main">
          <div class="modal-header">
            <h4 class="modal-title">{{ selectedSp800?.family_name || 'Detail SP 800-53' }}</h4>
          </div>
          <div class="modal-body">
            <div class="modal-section">
              <div class="modal-section-header" style="color: #144e72"><i class="fas fa-info-circle"></i><span>Deskripsi Kontrol</span></div>
              <div class="modal-section-content"><p class="modal-summary">{{ selectedSp800?.description || '-' }}</p></div>
            </div>
            <div class="modal-section">
              <div class="modal-section-header" style="color: #144e72"><i class="fas fa-list-check"></i><span>Contoh Bukti Audit</span></div>
              <div class="modal-section-content">
                <ul class="modal-artifact-list">
                  <li v-for="(item, idx) in (selectedSp800?.bukti_audit && selectedSp800.bukti_audit.length ? selectedSp800.bukti_audit : [])" :key="idx"><i class="fas fa-check-circle"></i><span>{{ item }}</span></li>
                  <li v-if="!selectedSp800?.bukti_audit || !selectedSp800.bukti_audit.length" class="modal-empty">Tidak ada contoh bukti audit.</li>
                </ul>
              </div>
            </div>
            <div class="modal-section">
              <div class="modal-section-header" style="color: #144e72"><i class="fas fa-link"></i><span>Referensi NIST CSF</span></div>
              <div class="modal-section-content">
                <div class="modal-requirements">
                  <span v-for="ref in (selectedSp800?.nist_references || [])" :key="ref" class="modal-req-badge">{{ ref }}</span>
                  <div v-if="!selectedSp800?.nist_references || !selectedSp800.nist_references.length" class="modal-empty">Belum ada referensi NIST CSF yang ditautkan.</div>
                </div>
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
  name: 'Nist',
  data() {
    return {
      loading: true,
      error: null,
      activeTab: 'overview',
      controls: [],
      sp800Controls: [],
      functionMeta: {
        'GOVERN': { label: 'Tata Kelola', color: '#1d3557', icon: 'fa-sitemap', summary: 'Arah kebijakan, akuntabilitas, dan keputusan manajemen.' },
        'IDENTIFY': { label: 'Identifikasi', color: '#2563eb', icon: 'fa-compass', summary: 'Aset, konteks bisnis, dan eksposur risiko.' },
        'PROTECT': { label: 'Perlindungan', color: '#0f766e', icon: 'fa-shield-alt', summary: 'Safeguard operasional dan teknis yang berjalan konsisten.' },
        'DETECT': { label: 'Deteksi', color: '#a16207', icon: 'fa-binoculars', summary: 'Pemantauan, deteksi anomali, dan eskalasi cepat.' },
        'RESPOND': { label: 'Respons', color: '#b91c1c', icon: 'fa-bolt', summary: 'Koordinasi tindakan dan pengendalian dampak insiden.' },
        'RECOVER': { label: 'Pemulihan', color: '#15803d', icon: 'fa-life-ring', summary: 'Pemulihan layanan dan kesinambungan operasi.' },
      },
      functionFilter: '',
      categoryFilter: '',
      controlSearch: '',
      activeControlId: null,
      familyFilter: '',
      sp800Search: '',
      showSp800Modal: false,
      selectedSp800: null,
      // Pagination
      currentPage: 1,
      itemsPerPage: 25,
    };
  },
  computed: {
    totalFuncs() {
      const funcs = this.controls.map(c => c.function).filter(Boolean);
      return new Set(funcs).size;
    },
    totalCats() {
      const cats = this.controls.map(c => c.category).filter(Boolean);
      return new Set(cats).size;
    },
    totalSubs() {
      return this.controls.length;
    },
    totalSp800() {
      const refs = this.controls.flatMap(c => c.sp80053 || []);
      return new Set(refs).size;
    },
    totalEvidence() {
      return this.controls.flatMap(c => c.evidence || []).filter(Boolean).length;
    },
    avgRefs() {
      if (!this.controls.length) return 0;
      const total = this.controls.reduce((sum, c) => sum + (c.sp80053 || []).length, 0);
      return (total / this.controls.length).toFixed(1);
    },
    functionBreakdown() {
      return Object.entries(this.functionMeta)
        .map(([key, meta]) => {
          const subset = this.controls.filter(c => c.function === key);
          const categories = new Set(subset.map(c => c.category)).size;
          return { key, label: meta.label, color: meta.color, icon: meta.icon, summary: meta.summary, count: subset.length, categories };
        })
        .filter(item => item.count > 0);
    },
    maxFunctionCount() {
      return Math.max(...this.functionBreakdown.map(f => f.count), 1);
    },
    categoryBreakdown() {
      const grouped = this.controls.reduce((acc, c) => {
        if (!c.category) return acc;
        if (!acc[c.category]) acc[c.category] = { name: c.category, count: 0, function: c.function };
        acc[c.category].count++;
        return acc;
      }, {});
      return Object.values(grouped).sort((a, b) => b.count - a.count);
    },
    topCategories() {
      return this.categoryBreakdown.slice(0, 6);
    },
    maxCategoryCount() {
      return Math.max(...this.categoryBreakdown.map(c => c.count), 1);
    },
    categoryOptions() {
      return [...new Set(this.controls.map(c => c.category).filter(Boolean))].sort();
    },
    familyBreakdown() {
      const grouped = this.sp800Controls.reduce((acc, c) => {
        if (!c.family) return acc;
        if (!acc[c.family]) acc[c.family] = { code: c.family, name: c.family_name || c.family, count: 0 };
        acc[c.family].count++;
        return acc;
      }, {});
      return Object.values(grouped).sort((a, b) => b.count - a.count);
    },
    filteredControls() {
      const query = (this.controlSearch || '').trim().toLowerCase();
      return this.controls.filter(ctrl => {
        if (this.functionFilter && ctrl.function !== this.functionFilter) return false;
        if (this.categoryFilter && ctrl.category !== this.categoryFilter) return false;
        if (!query) return true;
        return [ctrl.id, ctrl.title, ctrl.description, ctrl.category, this.functionMeta[ctrl.function]?.label, ...(ctrl.sp80053 || [])].join(' ').toLowerCase().includes(query);
      });
    },
    filteredSp800() {
      const query = (this.sp800Search || '').trim().toLowerCase();
      return this.sp800Controls.filter(ctrl => {
        if (this.familyFilter && ctrl.family !== this.familyFilter) return false;
        if (!query) return true;
        return [ctrl.id, ctrl.family, ctrl.family_name, ctrl.description].join(' ').toLowerCase().includes(query);
      });
    },
    activeControl() {
      return this.controls.find(c => c.id === this.activeControlId) || null;
    },
    // Pagination computed properties
    totalPages() { return Math.ceil(this.filteredControls.length / this.itemsPerPage); },
    paginatedControls() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredControls.slice(start, end);
    },
  },
  watch: {
    filteredControls() {
      this.currentPage = 1;
      if (this.paginatedControls.length && !this.paginatedControls.find(c => c.id === this.activeControlId)) {
        this.activeControlId = this.paginatedControls[0]?.id || null;
      }
    },
  },
  methods: {
    getFunctionColor(func) { return this.functionMeta[func]?.color || '#144e72'; },
    getFunctionLabel(func) { return this.functionMeta[func]?.label || func || '-'; },
    resetFilters() { this.functionFilter = ''; this.categoryFilter = ''; this.controlSearch = ''; this.currentPage = 1; },
    resetSp800Filters() { this.familyFilter = ''; this.sp800Search = ''; },
    setActiveControl(id) { this.activeControlId = id; },
    jumpExplorer(fn = '', category = '') {
      this.functionFilter = fn || '';
      this.categoryFilter = category || '';
      this.controlSearch = '';
      this.activeTab = 'explorer';
    },
    jumpReference(id = '') {
      this.sp800Search = id || '';
      this.activeTab = 'reference';
    },
    openSp800Modal(ctrl) {
      this.selectedSp800 = ctrl;
      this.showSp800Modal = true;
    },
    retryLoad() {
      this.loadData();
    },
    async loadData() {
      try {
        this.loading = true;
        this.error = null;
        const [ctrlRes, spRes] = await Promise.all([
          fetch('/data/nist_csf.json'),
          fetch('/data/sp800_53.json')
        ]);
        if (ctrlRes.ok) {
          const data = await ctrlRes.json();
          this.controls = Array.isArray(data) ? data : [];
          if (this.controls.length > 0) this.activeControlId = this.controls[0].id;
        } else {
          throw new Error(`Failed to load NIST CSF: HTTP ${ctrlRes.status}`);
        }
        if (spRes.ok) {
          const data = await spRes.json();
          this.sp800Controls = Array.isArray(data) ? data : [];
        } else {
          throw new Error(`Failed to load SP 800-53: HTTP ${spRes.status}`);
        }
      } catch (error) {
        console.error('Error loading NIST data:', error);
        this.error = error.message || 'Failed to load data';
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style scoped>
.nst-page{--ink:#14263b;--muted:#5c6776;--line:rgba(20,38,59,.1);--shell:linear-gradient(180deg,#f6f1e8 0%,#edf5f4 100%);color:var(--ink);padding:.25rem;border-radius:32px;background:var(--shell)}
.nst-shell{display:grid;gap:1rem}
.nst-hero{display:grid;grid-template-columns:1.55fr .9fr;gap:1.2rem;align-items:stretch;min-height:368px;padding:1.45rem;border-radius:28px;overflow:hidden;position:relative;background:radial-gradient(circle at top right,rgba(247,208,156,.86),transparent 30%),radial-gradient(circle at bottom left,rgba(155,214,205,.68),transparent 28%),linear-gradient(135deg,#17324d 0%,#1f4d6f 48%,#f2e0bf 100%);box-shadow:0 20px 44px rgba(15,23,42,.09)}
.nst-hero>*{position:relative;z-index:1}
.nst-kicker{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem .7rem;border-radius:999px;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.nst-title{margin:1rem 0 .7rem;color:#fffaf2;font-size:clamp(2rem,3.8vw,3rem);font-weight:800;line-height:1.04}
.nst-lede{margin:0;max-width:700px;color:rgba(255,250,242,.82);line-height:1.7}
.nst-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:.65rem;margin-top:1.1rem}
.nst-metric,.nst-side,.nst-panel,.nst-mini{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,251,245,.98) 0%,rgba(246,251,252,.98) 100%);box-shadow:0 14px 28px rgba(15,23,42,.05)}
.nst-metric{padding:.68rem .74rem;border-radius:16px;background:rgba(255,250,242,.12);border-color:rgba(255,255,255,.18);min-height:96px;display:flex;flex-direction:column;justify-content:flex-start}
.nst-metric label,.nst-side label,.nst-mini label,.nst-form label,.nst-inspector small,.nst-label{display:block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.nst-metric label{color:rgba(255,250,242,.7);margin-bottom:.35rem}
.nst-metric strong{display:block;color:#fffaf2;font-size:1.5rem;font-weight:800;line-height:1}
.nst-metric span{display:block;margin-top:.34rem;color:rgba(255,250,242,.72);font-size:.76rem}
.nst-side-stack{display:grid;gap:.85rem}
.nst-side{padding:.8rem .86rem;border-radius:18px;background:rgba(255,250,242,.78);border-color:rgba(255,255,255,.24);min-height:142px}
.nst-side label{color:var(--muted);margin-bottom:.4rem}
.nst-side h3{margin:0;font-size:1rem;font-weight:800}
.nst-side p{margin:.55rem 0 0;color:var(--muted);line-height:1.55;font-size:.84rem}
.nst-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}
.nst-tab{display:grid;grid-template-columns:auto 1fr;gap:.72rem;align-items:center;padding:.82rem .88rem;border-radius:18px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,250,242,.94) 0%,rgba(239,245,246,.94) 100%);text-align:left;color:var(--ink);box-shadow:0 12px 24px rgba(15,23,42,.04);cursor:pointer}
.nst-tab.active{border-color:rgba(15,118,110,.24);box-shadow:0 18px 30px rgba(15,118,110,.1)}
.nst-tab i{width:2.35rem;height:2.35rem;display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(20,38,59,.06)}
.nst-tab strong{display:block;font-size:.9rem;font-weight:800}
.nst-tab span{display:block;margin-top:.14rem;color:var(--muted);font-size:.76rem;line-height:1.4}
.nst-grid{display:grid;gap:1rem}
.nst-grid.two{grid-template-columns:1.06fr .94fr}
.nst-panel{padding:1rem;border-radius:20px}
.nst-head{display:flex;align-items:center;justify-content:space-between;gap:.85rem;margin-bottom:.7rem}
.nst-head h3{margin:0;font-size:.98rem;font-weight:800}
.nst-chip,.nst-pill,.nst-meta span,.nst-ref{display:inline-flex;align-items:center;gap:.3rem;padding:.24rem .52rem;border-radius:999px;font-size:.7rem;font-weight:700;line-height:1.2}
.nst-chip{background:rgba(20,38,59,.08);color:var(--ink)}
.nst-copy{margin:0 0 .85rem;color:var(--muted);line-height:1.6;font-size:.84rem}
.nst-bars,.nst-cards,.nst-hotspots,.nst-families{display:grid;gap:.65rem}
.nst-bar,.nst-hotspot,.nst-family{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(180px,1fr) auto;gap:.68rem;align-items:center;padding:.62rem .72rem;border-radius:16px;border:1px solid transparent;background:rgba(255,255,255,.55);text-align:left;cursor:pointer;transition:border-color .15s ease,transform .15s ease,box-shadow .15s ease}
.nst-family{grid-template-columns:1fr auto}
.nst-bar:hover,.nst-hotspot:hover,.nst-family:hover,.nst-bar.active,.nst-hotspot.active,.nst-family.active{transform:translateY(-1px);border-color:rgba(20,78,114,.22);box-shadow:0 12px 22px rgba(20,78,114,.08)}
.nst-bar strong,.nst-hotspot strong,.nst-family strong{display:block;font-size:.86rem}
.nst-bar em,.nst-hotspot em,.nst-family em{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem;font-style:normal}
.nst-track{height:.44rem;border-radius:999px;background:rgba(20,38,59,.08);overflow:hidden}
.nst-track b{display:block;height:100%;border-radius:inherit}
.nst-num{min-width:2.2rem;text-align:right;font-weight:800}
.nst-cards{grid-template-columns:repeat(3,1fr)}
.nst-card{width:100%;padding:.76rem .8rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer}
.nst-card.active{border-color:rgba(20,78,114,.24);box-shadow:0 16px 28px rgba(20,78,114,.08);background:rgba(238,245,245,.72)}
.nst-card-top{display:flex;align-items:center;justify-content:space-between;gap:.55rem;color:var(--muted);font-size:.64rem;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
.nst-icon{width:1.9rem;height:1.9rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(20,78,114,.12);color:var(--accent);font-size:.8rem}
.nst-card strong{display:block;margin-top:.42rem;font-size:.86rem;font-weight:800}
.nst-card p{margin:.22rem 0 0;color:var(--muted);font-size:.72rem;line-height:1.4}
.nst-mini-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.65rem;margin-bottom:.8rem}
.nst-mini{padding:.72rem .78rem;border-radius:16px}
.nst-mini label{color:var(--muted)}
.nst-mini strong{display:block;margin-top:.2rem;font-size:1.08rem;font-weight:800;color:#144e72}
.nst-mini span{display:block;margin-top:.14rem;color:var(--muted);font-size:.72rem;line-height:1.4}
.nst-workspace{display:grid;grid-template-columns:.76fr 1.03fr .91fr;gap:1rem}
.nst-refspace{display:grid;grid-template-columns:.82fr 1.18fr;gap:1rem}
.nst-function-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.55rem;margin-bottom:.8rem}
.nst-fn{width:100%;padding:.62rem .68rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer}
.nst-fn.active{border-color:rgba(20,78,114,.24);background:rgba(238,245,245,.72);box-shadow:0 12px 24px rgba(20,78,114,.08)}
.nst-fn strong{display:block;font-size:.82rem;font-weight:800;color:var(--accent)}
.nst-fn span{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem}
.nst-form{display:grid;gap:.75rem}
.nst-form label{margin-bottom:.3rem;color:var(--muted)}
.nst-summary{margin-top:.85rem;padding:.82rem .88rem;border-radius:18px;background:linear-gradient(180deg,rgba(25,61,87,.95) 0%,rgba(20,78,114,.95) 100%);color:#fffaf2}
.nst-summary small{display:block;color:rgba(255,250,242,.7);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.nst-summary strong{display:block;margin-top:.28rem;font-size:1.72rem;font-weight:800;line-height:1}
.nst-summary span{display:block;margin-top:.42rem;color:rgba(255,250,242,.78);font-size:.78rem;line-height:1.5}
.nst-list{display:flex;flex-direction:column;max-height:760px;overflow-y:auto;padding-right:.12rem}
.nst-item{position:relative;width:100%;padding:.7rem .78rem .66rem .88rem;margin-bottom:.55rem;border-radius:14px;border:1px solid rgba(20,38,59,.08);background:#fff;text-align:left;cursor:pointer;content-visibility:auto;contain-intrinsic-size:auto 80px}
.nst-item:last-child{margin-bottom:0}
.nst-item.active{border-color:rgba(15,118,110,.35);border-left-width:.28rem;background:rgba(238,245,245,.6)}
.nst-item:before{content:'';position:absolute;left:0;top:.68rem;bottom:.68rem;width:.18rem;border-radius:999px;background:var(--accent,#0f766e)}
.nst-item-top{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:space-between}
.nst-item-code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:.76rem;font-weight:800;color:var(--accent,#0f766e)}
.nst-item-name{margin:.28rem 0 .2rem;font-size:.88rem;font-weight:700;line-height:1.38;color:var(--ink)}
.nst-item-meta{color:var(--muted);font-size:.74rem;line-height:1.4}
.nst-item-meta span+span::before{content:'•';margin:0 .4rem;color:rgba(20,38,59,.35)}
.nst-pill{padding:.2rem .45rem;font-size:.68rem;background:rgba(20,38,59,.08);color:var(--ink)}
.nst-inspector{position:relative;top:auto;min-height:760px;display:flex;flex-direction:column}
.nst-inspector-head{padding-bottom:.85rem;border-bottom:1px solid var(--line)}
.nst-inspector-head strong{display:block;margin-top:.35rem;font-size:1rem;font-weight:800;color:#0f766e}
.nst-inspector-head span{display:block;margin-top:.28rem;font-size:.9rem;font-weight:800;line-height:1.4}
.nst-inspector-body{display:grid;gap:.75rem;padding-top:.85rem;flex:1;min-height:0;overflow:auto;align-content:start}
.nst-meta{display:flex;flex-wrap:wrap;gap:.45rem}
.nst-meta span{background:rgba(20,38,59,.06);color:var(--ink);font-size:.72rem}
.nst-callout,.nst-note{padding:.76rem .84rem;border-radius:16px;border:1px solid var(--line);line-height:1.62}
.nst-callout{background:rgba(255,255,255,.75)}
.nst-note{background:rgba(238,245,245,.84)}
.nst-plain{margin:.15rem 0 0;padding-left:1rem;color:var(--muted);font-size:.78rem;line-height:1.6}
.nst-plain li{margin-bottom:.16rem}
.nst-refs{display:flex;flex-wrap:wrap;gap:.4rem}
.nst-ref{border:1px solid rgba(20,38,59,.12);background:rgba(255,255,255,.82);color:var(--ink);font-size:.7rem;cursor:pointer}
.nst-empty{padding:.9rem;border-radius:16px;border:1px dashed rgba(20,38,59,.18);background:rgba(255,255,255,.6);color:var(--muted);text-align:center;line-height:1.55}

.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:9999}
.modal-content{background:#fff;border-radius:16px;max-width:800px;width:90%;max-height:90vh;overflow:auto}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding:1rem;border-bottom:1px solid var(--line)}
.modal-body{padding:1rem}
@media (max-width:1399.98px){.nst-workspace,.nst-refspace{grid-template-columns:1fr}.nst-inspector{position:static;min-height:auto}}
@media (max-width:1199.98px){.nst-hero,.nst-metric,.nst-side{min-height:auto}.nst-hero,.nst-nav,.nst-grid.two,.nst-refspace,.nst-metrics,.nst-mini-row,.nst-cards{grid-template-columns:1fr}.nst-bar,.nst-hotspot,.nst-family{grid-template-columns:1fr}}
@media (max-width:767.98px){.nst-hero,.nst-panel{padding:1.2rem;border-radius:22px}.nst-function-grid{grid-template-columns:1fr}}

/* Pagination styles */
.nst-pagination{display:flex;align-items:center;justify-content:center;gap:1rem;margin-top:1rem;padding:1rem;border-top:1px solid var(--line)}
.nst-page-info{font-size:.875rem;color:var(--muted);white-space:nowrap}

/* Modal SP 800-53 Styles */
.modal-req-badge{display:inline-flex;align-items:center;padding:.35rem .65rem;border-radius:999px;background:rgba(20,78,114,.08);color:#144e72;font-size:.72rem;font-weight:700;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace}

/* Shared Modal Overlay Styles */
.modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,.56);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem}
.modal-dialog{width:100%;max-width:780px}
.modal-shell{display:grid;grid-template-columns:120px 1fr;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 64px rgba(15,23,42,.24),0 8px 24px rgba(15,23,42,.12)}
.modal-sidebar{position:relative;padding:1.5rem 1rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.65rem;color:#fffaf2;text-align:center}
.modal-close{position:absolute;top:.75rem;right:.75rem;width:2rem;height:2rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;border:none;background:rgba(255,255,255,.18);color:#fff;cursor:pointer;transition:background .15s ease,transform .15s ease}
.modal-close:hover{background:rgba(255,255,255,.28);transform:scale(1.05)}
.modal-sidebar-icon{width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;border-radius:16px;background:rgba(255,255,255,.18);font-size:1.25rem;margin-bottom:.25rem}
.modal-sidebar-id{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:1.15rem;font-weight:800;letter-spacing:.04em}
.modal-sidebar-type{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;opacity:.82}
.modal-main{display:flex;flex-direction:column;max-height:80vh;overflow:hidden}
.modal-header{padding:1.15rem 1.5rem 1rem;border-bottom:1px solid var(--line)}
.modal-title{margin:0;font-size:1.15rem;font-weight:800;color:var(--ink);line-height:1.4}
.modal-body{padding:1.25rem 1.5rem;overflow-y:auto;flex:1}
.modal-section{margin-bottom:1.25rem}
.modal-section:last-child{margin-bottom:0}
.modal-section-header{display:flex;align-items:center;gap:.55rem;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:.65rem;padding-bottom:.5rem;border-bottom:1px solid var(--line)}
.modal-section-header i{font-size:.82rem}
.modal-section-content{padding-left:.25rem}
.modal-summary{margin:0;color:var(--muted);font-size:.86rem;line-height:1.7}
.modal-artifact-list{list-style:none;margin:0;padding:0;display:grid;gap:.45rem}
.modal-artifact-list li{display:flex;align-items:flex-start;gap:.55rem;padding:.62rem .75rem;border-radius:12px;background:rgba(238,245,245,.5);font-size:.84rem;color:var(--ink);line-height:1.5}
.modal-artifact-list li i{color:#0f766e;font-size:.82rem;margin-top:.18rem;flex-shrink:0}
.modal-requirements{display:flex;flex-wrap:wrap;gap:.45rem}
.modal-empty{padding:.9rem 1rem;border-radius:12px;border:1px dashed rgba(20,38,59,.18);background:rgba(245,247,250,.6);color:var(--muted);text-align:center;font-size:.82rem;line-height:1.5}

/* Modal Transitions */
.modal-fade-enter-active,.modal-fade-leave-active{transition:opacity .2s ease}
.modal-fade-enter-from,.modal-fade-leave-to{opacity:0}
.modal-slide-enter-active{transition:transform .25s ease-out,opacity .25s ease-out}
.modal-slide-leave-active{transition:transform .2s ease-in,opacity .2s ease-in}
.modal-slide-enter-from,.modal-slide-leave-to{transform:translateY(16px) scale(.97);opacity:0}
</style>
