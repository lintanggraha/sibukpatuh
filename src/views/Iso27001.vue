<template>
  <div class="iso-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading ISO 27001 data...</p>
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
    <div v-else class="iso-shell">
      <section class="iso-hero">
        <div>
          <span class="iso-kicker"><i class="fas fa-compass"></i>Framework Studio</span>
          <h1 class="iso-title">ISO 27001:2022 Control Studio</h1>
          <p class="iso-lede">ISMS made simple! Kita breakdown kontrol Annex A dari ISO 27001 biar lo gampang ngelakuin analisa kebijakan, nentuin prioritas implementasi, dan nyiapin evidence buat audit. Jadikan ini kompas lo buat dapet sertifikasi tanpa drama, dan pastinya ngebangun security culture yang solid.</p>
          <div class="iso-metric-grid">
            <div class="iso-metric"><label>Annex A Controls</label><strong>{{ totalControls }}</strong><span>Kontrol inti yang bisa ditelusuri end-to-end.</span></div>
            <div class="iso-metric"><label>Categories</label><strong>{{ domainBreakdown.length }}</strong><span>Organisasional, Orang, Fisik, dan Teknologi.</span></div>
            <div class="iso-metric"><label>Critical Priorities</label><strong>{{ criticalControls }}</strong><span>Area yang paling butuh sequencing implementasi.</span></div>
            <div class="iso-metric"><label>Evidence Cues</label><strong>{{ evidenceCount }}</strong><span>Contoh bukti audit yang bisa jadi titik mulai.</span></div>
          </div>
        </div>
        <div class="iso-side-stack">
          <div class="iso-side-card">
            <label>Recommended Review Flow</label>
            <div class="iso-bullets">
              <div><i class="fas fa-circle"></i><span>Tinjau ringkasan kontrol untuk mengidentifikasi area fokus berdasarkan kategori dan prioritas.</span></div>
              <div><i class="fas fa-circle"></i><span>Gunakan Eksplorasi untuk menyaring kontrol dan menganalisa rincian implementasi, bukti audit, serta tingkat kesulitan.</span></div>
              <div><i class="fas fa-circle"></i><span>Gunakan Konsep Keamanan untuk melihat keterkaitan kontrol dengan kapabilitas keamanan siber.</span></div>
            </div>
          </div>
          <div class="iso-disclaimer-banner">
            <div class="iso-disclaimer-icon"><i class="fas fa-info-circle"></i></div>
            <div class="iso-disclaimer-content">
              <strong>Disclaimer:</strong>
              <span>Konten ini adalah ringkasan edukatif berdasarkan interpretasi dari standar ISO 27001:2022. Ini <b>bukan</b> teks resmi ISO dan tidak boleh dianggap sebagai pengganti standar asli. Untuk teks otoritatif dan lisensi resmi, silakan kunjungi <a href="https://www.iso.org/standard/27001" target="_blank" rel="noopener noreferrer">ISO.org</a> atau <a href="https://www.bsn.go.id" target="_blank" rel="noopener noreferrer">BSN</a>. Penggunaan konten ini sepenuhnya untuk tujuan edukasi dan persiapan audit internal.</span>
            </div>
          </div>
        </div>
      </section>

      <div class="nav iso-nav" role="tablist">
        <button class="iso-tab" :class="{ active: activeTab === 'overview' }" type="button" role="tab" @click="activeTab = 'overview'"><i class="fas fa-chart-line"></i><div><strong>Ringkasan Program</strong><span>Pulse, distribusi kategori, dan profil prioritas.</span></div></button>
        <button class="iso-tab" :class="{ active: activeTab === 'explorer' }" type="button" role="tab" @click="activeTab = 'explorer'"><i class="fas fa-sliders-h"></i><div><strong>Eksplorasi</strong><span>Filter panel, daftar kontrol, dan inspector detail.</span></div></button>
        <button class="iso-tab" :class="{ active: activeTab === 'concept' }" type="button" role="tab" @click="activeTab = 'concept'"><i class="fas fa-project-diagram"></i><div><strong>Konsep Keamanan</strong><span>Enam konsep keamanan sebagai perspektif pembacaan alternatif.</span></div></button>
      </div>

      <div class="tab-content">
        <!-- Tab 1: Ringkasan Program -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="iso-grid two">
            <article class="iso-panel">
              <div class="iso-panel-head"><h3>Distribusi per kategori</h3><span class="iso-chip">Klik kategori untuk filter</span></div>
              <p class="iso-panel-copy">Empat kategori ini tetap menjadi struktur utama pengelompokan kontrol sehingga area tata kelola, personel, fisik, dan teknologi dapat dianalisa secara cepat dan terarah.</p>
              <div class="iso-bars">
                <button v-for="domain in domainBreakdown" :key="domain.name" type="button" class="iso-bar jump" @click="jumpToTheme(domain.name)"><div class="iso-bar-copy"><strong>{{ domain.name }}</strong><span>{{ domain.summary }}</span></div><div class="iso-track"><b :style="{ width: (domain.count / maxDomainCount) * 100 + '%', background: domain.color }"></b></div><div class="iso-number">{{ domain.count }}</div></button>
              </div>
            </article>
            <article class="iso-panel">
              <div class="iso-panel-head"><h3>Profil kontrol</h3><span class="iso-chip">Ringkasan tipe dan prioritas</span></div>
              <p class="iso-panel-copy">Panel ini merangkum komposisi jenis kontrol serta sebaran prioritas implementasi untuk membantu penetapan fokus pelaksanaan.</p>
              <div class="iso-type-grid">
                <div v-for="type in typeBreakdown" :key="type.name" class="iso-mini compact" :style="{ '--accent': type.color }"><label>{{ type.name }}</label><strong>{{ type.count }}</strong><span>{{ type.share }}% dari total kontrol</span></div>
              </div>
              <div class="iso-priority-bars">
                <div v-for="priority in priorityBreakdown" :key="priority.name" class="iso-priority-bar" :style="{ '--accent': priority.color }"><div class="iso-priority-name">{{ priority.name }}</div><div class="iso-priority-track"><b :style="{ width: (priority.count / maxPriorityCount) * 100 + '%' }"></b></div><div class="iso-number">{{ priority.count }}</div></div>
              </div>
            </article>
            <article class="iso-panel">
              <div class="iso-panel-head"><h3>Konsep keamanan</h3><span class="iso-chip">Snapshot</span></div>
              <p class="iso-panel-copy">Pemetaan konsep keamanan disajikan sebagai board terpisah agar dapat digunakan sebagai perspektif analisis tambahan tanpa mengganggu pembacaan struktur utama Annex A.</p>
              <div class="iso-concept-board">
                <div v-for="concept in conceptBreakdown" :key="concept.name" class="iso-mini" :style="{ '--accent': concept.color }"><label><i :class="`fas ${concept.icon} me-1`"></i>{{ concept.key }}</label><strong>{{ concept.count }}</strong><span>{{ concept.name }}</span></div>
              </div>
            </article>
            <article class="iso-panel">
              <div class="iso-panel-head"><h3>Cara pakai halaman ini</h3><span class="iso-chip">Workflow</span></div>
              <p class="iso-panel-copy"><strong>Mulai dari overview.</strong> Identifikasi kategori dengan kepadatan kontrol tertinggi dan prioritas implementasi yang paling menonjol.</p>
              <p class="iso-panel-copy"><strong>Pindah ke explorer.</strong> Filter kontrol yang relevan, lalu baca detail untuk bukti audit dan tips implementasi.</p>
              <p class="iso-panel-copy mb-0"><strong>Validasi dengan konsep keamanan.</strong> Saat butuh narasi yang lebih dekat ke bahasa cyber security, gunakan lens Identify, Protect, Detect, Respond, Recover, atau Govern.</p>
            </article>
          </div>
        </div>

        <!-- Tab 2: Eksplorasi -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="iso-workspace">
            <aside class="iso-panel" style="position: sticky; top: 1rem;">
              <div class="iso-panel-head"><h3>Filter Workspace</h3></div>
              <div class="iso-quick-themes mb-3">
                <button v-for="domain in domainBreakdown" :key="domain.name" type="button" class="iso-quick-theme" :style="{ '--accent': domain.color }" @click="filterTheme = domain.name"><strong>{{ domain.name === 'Organisasional' ? 'Organisasi' : domain.name }}</strong><span>{{ domain.count }} kontrol</span></button>
              </div>
              <div class="iso-form-grid">
                <div><label for="filter-theme">Kategori</label><select id="filter-theme" v-model="filterTheme" class="form-select"><option value="All">Semua kategori</option><option v-for="d in domainBreakdown" :key="d.name" :value="d.name">{{ d.name }}</option></select></div>
                <div><label for="filter-type">Jenis kontrol</label><select id="filter-type" v-model="filterType" class="form-select"><option value="All">Semua jenis</option><option v-for="t in typeBreakdown" :key="t.name" :value="t.name">{{ t.name }}</option></select></div>
                <div><label for="filter-prio">Prioritas</label><select id="filter-prio" v-model="filterPrio" class="form-select"><option value="All">Semua prioritas</option><option v-for="p in priorityBreakdown" :key="p.name" :value="p.name">{{ p.name }}</option></select></div>
                <div><label for="filter-diff">Kesulitan</label><select id="filter-diff" v-model="filterDiff" class="form-select"><option value="All">Semua tingkat</option><option value="Rendah">Rendah</option><option value="Sedang">Sedang</option><option value="Tinggi">Tinggi</option></select></div>
                <div><label for="filter-search">Cari kontrol</label><input type="text" id="filter-search" v-model="filterSearch" class="form-control" placeholder="Cari ID, nama, atau capability"></div>
                <div class="iso-summary"><small>Visible controls</small><strong>{{ filteredControls.length }}</strong><span>{{ filteredControls.length ? activeFilterCopy : 'Semua kontrol sedang ditampilkan.' }}</span></div>
                <button class="btn btn-outline-dark" type="button" @click="resetFilters"><i class="fas fa-rotate-left me-2"></i>Reset filter</button>
              </div>
            </aside>
            <section class="iso-panel">
              <div class="iso-panel-head"><h3>Daftar kontrol</h3><span class="iso-chip">Klik untuk buka inspector</span></div>
              <div class="iso-list">
                <button v-for="ctrl in paginatedControls" :key="ctrl.id" type="button" class="iso-item" :class="{ active: explorerState.selectedId === ctrl.id }" :style="{ '--accent': getDomainColor(ctrl.domain) }" @click="explorerState.selectedId = ctrl.id"><div class="iso-item-top"><span class="iso-item-code">{{ ctrl.id }}</span><span class="iso-pill" :class="[`compact`, getPillClass(ctrl.priority)]">{{ ctrl.priority || '-' }}</span></div><div class="iso-item-name">{{ ctrl.name || '-' }}</div><div class="iso-item-meta-line"><span>{{ ctrl.domain || '-' }}</span><span>{{ ctrl.type || '-' }}</span><span>{{ ctrl.difficulty || '-' }}</span></div></button>
                <div v-if="paginatedControls.length === 0" class="iso-empty">Tidak ada kontrol yang cocok dengan filter saat ini.</div>
                
                <!-- Pagination Controls -->
                <div v-if="totalPages > 1" class="iso-pagination">
                  <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="btn btn-sm btn-outline-secondary me-2">
                    <i class="fas fa-chevron-left"></i> Previous
                  </button>
                  <span class="iso-page-info">Page {{ currentPage }} of {{ totalPages }} ({{ filteredControls.length }} total)</span>
                  <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-sm btn-outline-secondary ms-2">
                    Next <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </section>
            <section class="iso-panel iso-inspector-panel">
              <div class="iso-detail-head"><small>Control Inspector</small><strong>{{ selectedExplorerControl?.id || 'Pilih sebuah kontrol' }}</strong><span>{{ selectedExplorerControl?.name || 'Klik kontrol di daftar untuk membuka deskripsi, interpretasi, bukti audit, dan tips implementasi.' }}</span></div>
              <div class="iso-detail-body" v-if="selectedExplorerControl">
                <div class="iso-detail-meta"><span class="iso-detail-meta-item"><small>Kategori</small><strong>{{ selectedExplorerControl.domain || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Jenis</small><strong>{{ selectedExplorerControl.type || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Prioritas</small><strong>{{ selectedExplorerControl.priority || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Kesulitan</small><strong>{{ selectedExplorerControl.difficulty || '-' }}</strong></span></div>
                <div><span class="iso-detail-label">Deskripsi kontrol</span><div class="iso-callout">{{ selectedExplorerControl.description || '-' }}</div></div>
                <div><span class="iso-detail-label"><i class="fas fa-lightbulb me-1"></i>Analogi</span><div class="iso-note">{{ selectedExplorerControl.analogy || '-' }}</div></div>
                <div><span class="iso-detail-label">Contoh bukti audit</span><ul class="iso-evidence-list"><li v-for="(item, idx) in (selectedExplorerControl.exampleEvidence && selectedExplorerControl.exampleEvidence.length ? selectedExplorerControl.exampleEvidence : ['Belum ada contoh bukti audit untuk kontrol ini.'])" :key="idx">{{ item }}</li></ul></div>
                <div><span class="iso-detail-label">Tips implementasi</span><div class="iso-callout">{{ selectedExplorerControl.implementationTips || '-' }}</div></div>
                <div><span class="iso-detail-label">Konsep dan capability</span><div class="mt-2"><span class="iso-chip">{{ selectedExplorerControl.concept || 'Tidak ada data tambahan' }}</span><span class="iso-chip" v-if="selectedExplorerControl.capability">{{ selectedExplorerControl.capability }}</span></div></div>
              </div>
              <div v-else class="iso-empty">Belum ada kontrol yang dipilih.</div>
            </section>
          </div>
        </div>

        <!-- Tab 3: Konsep Keamanan -->
        <div v-if="activeTab === 'concept'" key="concept-tab">
          <div class="iso-grid">
            <section class="iso-panel">
              <div class="iso-panel-head"><h3>Konsep Keamanan</h3><span class="iso-chip">Pilih lensa</span></div>
              <p class="iso-panel-copy">Enam konsep keamanan ini disediakan sebagai lensa pembacaan alternatif untuk menghubungkan kontrol ISO 27001 dengan kapabilitas keamanan siber secara lebih jelas dan sistematis.</p>
              <div class="iso-concept-board">
                <button v-for="concept in conceptBreakdown" :key="concept.name" type="button" class="iso-tile" :class="{ active: conceptState.active === concept.name }" :style="{ '--accent': concept.color }" @click="conceptState.active = conceptState.active === concept.name ? null : concept.name; conceptState.selectedId = null;"><div class="iso-tile-top"><span class="iso-tile-icon"><i :class="`fas ${concept.icon}`"></i></span><span>{{ getConceptControlCount(concept.name) }} controls</span></div><strong>{{ concept.name }}</strong><p>{{ concept.summary }}</p></button>
              </div>
            </section>
            <div v-if="!conceptState.active" class="iso-empty">Pilih salah satu konsep di atas untuk menampilkan kontrol terkait dan inspector detailnya.</div>
            <div v-else>
              <div class="iso-grid">
                <div class="iso-selected" :style="{ '--accent': getConceptColor(conceptState.active) }"><div class="iso-selected-mark"><i :class="`fas ${getConceptIcon(conceptState.active)}`"></i></div><div><small>{{ getConceptKey(conceptState.active) }}</small><h3>{{ conceptState.active }}</h3><p>{{ getConceptSummary(conceptState.active) }}</p></div><div class="iso-selected-count"><strong>{{ conceptFilteredControls.length }}</strong><span>mapped controls</span></div></div>
                <div class="iso-concept-workspace">
                  <section class="iso-panel iso-inspector-panel">
                    <div class="iso-panel-head"><h3>Kontrol terkait</h3><span class="iso-chip">Auto-filterd by concept</span></div>
                    <div class="iso-list">
                      <button v-for="ctrl in conceptFilteredControls" :key="ctrl.id" type="button" class="iso-item" :class="{ active: conceptState.selectedId === ctrl.id }" :style="{ '--accent': getDomainColor(ctrl.domain) }" @click="conceptState.selectedId = ctrl.id"><div class="iso-item-top"><span class="iso-item-code">{{ ctrl.id }}</span><span class="iso-pill" :class="[`compact`, getPillClass(ctrl.priority)]">{{ ctrl.priority || '-' }}</span></div><div class="iso-item-name">{{ ctrl.name || '-' }}</div><div class="iso-item-meta-line"><span>{{ ctrl.domain || '-' }}</span><span>{{ ctrl.type || '-' }}</span><span>{{ ctrl.difficulty || '-' }}</span></div></button>
                      <div v-if="conceptFilteredControls.length === 0" class="iso-empty">Belum ada kontrol yang dipetakan ke konsep ini.</div>
                    </div>
                  </section>
                  <section class="iso-panel">
                    <div class="iso-detail-head"><small>Inspektor Konsep</small><strong>{{ selectedConceptControl?.id || 'Pilih sebuah kontrol' }}</strong><span>{{ selectedConceptControl?.name || 'Klik kontrol dari konsep yang dipilih untuk membaca detail lengkap.' }}</span></div>
                    <div class="iso-detail-body" v-if="selectedConceptControl">
                      <div class="iso-detail-meta"><span class="iso-detail-meta-item"><small>Kategori</small><strong>{{ selectedConceptControl.domain || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Jenis</small><strong>{{ selectedConceptControl.type || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Prioritas</small><strong>{{ selectedConceptControl.priority || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Kesulitan</small><strong>{{ selectedConceptControl.difficulty || '-' }}</strong></span></div>
                      <div><span class="iso-detail-label">Deskripsi kontrol</span><div class="iso-callout">{{ selectedConceptControl.description || '-' }}</div></div>
                      <div><span class="iso-detail-label"><i class="fas fa-lightbulb me-1"></i>Analogi</span><div class="iso-note">{{ selectedConceptControl.analogy || '-' }}</div></div>
                      <div><span class="iso-detail-label">Contoh bukti audit</span><ul class="iso-evidence-list"><li v-for="(item, idx) in (selectedConceptControl.exampleEvidence && selectedConceptControl.exampleEvidence.length ? selectedConceptControl.exampleEvidence : ['Belum ada contoh bukti audit untuk kontrol ini.'])" :key="idx">{{ item }}</li></ul></div>
                      <div><span class="iso-detail-label">Tips implementasi</span><div class="iso-callout">{{ selectedConceptControl.implementationTips || '-' }}</div></div>
                    </div>
                    <div v-else class="iso-empty">Belum ada kontrol yang dipilih.</div>
                  </section>
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
  name: 'Iso27001',
  data() {
    return {
      loading: true,
      error: null,
      activeTab: 'overview',
      controls: [],
      domainMeta: {
        'Organisasional': { id: 'ORG', color: '#0f766e', summary: 'Kebijakan, tata kelola, kontrak, dan keputusan manajemen.' },
        'Orang': { id: 'PPL', color: '#2563eb', summary: 'Kesadaran, perilaku, dan akuntabilitas personel.' },
        'Fisik': { id: 'PHY', color: '#c2410c', summary: 'Lokasi, perangkat, dan perlindungan lingkungan operasional.' },
        'Teknologi': { id: 'TEC', color: '#1d3557', summary: 'Identitas, monitoring, hardening, dan operasional teknis.' },
      },
      typeMeta: { 'Pencegahan': { color: '#0f766e' }, 'Deteksi': { color: '#a16207' }, 'Koreksi': { color: '#c2410c' } },
      priorityMeta: { 'Kritis': { color: '#b91c1c' }, 'Tinggi': { color: '#c2410c' }, 'Sedang': { color: '#2563eb' }, 'Rendah': { color: '#15803d' } },
      conceptMeta: {
        'Mengidentifikasi': { key: 'Identify', color: '#2563eb', icon: 'fa-compass', summary: 'Memahami aset, eksposur, dan konteks bisnis yang harus dijaga.' },
        'Melindungi': { key: 'Protect', color: '#0f766e', icon: 'fa-shield-alt', summary: 'Menjaga layanan, data, dan akses dengan pengamanan yang konsisten.' },
        'Mendeteksi': { key: 'Detect', color: '#a16207', icon: 'fa-binoculars', summary: 'Menangkap indikasi insiden dan penyimpangan secepat mungkin.' },
        'Merespons': { key: 'Respond', color: '#b91c1c', icon: 'fa-bolt', summary: 'Mengatur langkah taktis ketika kejadian sudah terkonfirmasi.' },
        'Memulihkan': { key: 'Recover', color: '#15803d', icon: 'fa-life-ring', summary: 'Mengembalikan layanan dan kapabilitas setelah gangguan.' },
        'Mengatur': { key: 'Govern', color: '#1d3557', icon: 'fa-sitemap', summary: 'Menetapkan arah, akuntabilitas, dan keputusan tingkat organisasi.' },
      },
      filterTheme: 'All',
      filterType: 'All',
      filterPrio: 'All',
      filterDiff: 'All',
      filterSearch: '',
      explorerState: { selectedId: null },
      conceptState: { active: null, selectedId: null },
      // Pagination
      currentPage: 1,
      itemsPerPage: 25,
    };
  },
  computed: {
    totalControls() { return this.controls.length; },
    domainBreakdown() {
      return Object.entries(this.domainMeta).map(([name, meta]) => ({ name, id: meta.id, color: meta.color, summary: meta.summary, count: this.controls.filter(c => c.domain === name).length })).filter(d => d.count > 0);
    },
    maxDomainCount() { return Math.max(...this.domainBreakdown.map(d => d.count), 1); },
    typeBreakdown() {
      return Object.entries(this.typeMeta).map(([name, meta]) => { const count = this.controls.filter(c => c.type === name).length; return { name, count, share: this.totalControls > 0 ? Math.round((count / this.totalControls) * 100) : 0, color: meta.color }; });
    },
    priorityBreakdown() {
      return Object.entries(this.priorityMeta).map(([name, meta]) => ({ name, count: this.controls.filter(c => c.priority === name).length, color: meta.color }));
    },
    maxPriorityCount() { return Math.max(...this.priorityBreakdown.map(p => p.count), 1); },
    conceptBreakdown() {
      return Object.entries(this.conceptMeta).map(([name, meta]) => ({ name, key: meta.key, color: meta.color, icon: meta.icon, summary: meta.summary, count: this.controls.filter(c => c.concept === name).length }));
    },
    criticalControls() { return this.controls.filter(c => c.priority === 'Kritis').length; },
    evidenceCount() { return this.controls.reduce((sum, c) => sum + (c.exampleEvidence || []).length, 0); },
    filteredControls() {
      return this.controls.filter(c => {
        if (this.filterTheme !== 'All' && c.domain !== this.filterTheme) return false;
        if (this.filterType !== 'All' && c.type !== this.filterType) return false;
        if (this.filterPrio !== 'All' && c.priority !== this.filterPrio) return false;
        if (this.filterDiff !== 'All' && c.difficulty !== this.filterDiff) return false;
        if (this.filterSearch) {
          const q = this.filterSearch.toLowerCase();
          if (![c.id, c.name, c.capability, c.concept, c.domain].join(' ').toLowerCase().includes(q)) return false;
        }
        return true;
      });
    },
    activeFilterCopy() {
      const parts = [];
      if (this.filterTheme !== 'All') parts.push(`kategori ${this.filterTheme}`);
      if (this.filterType !== 'All') parts.push(`jenis ${this.filterType}`);
      if (this.filterPrio !== 'All') parts.push(`prioritas ${this.filterPrio}`);
      if (this.filterDiff !== 'All') parts.push(`kesulitan ${this.filterDiff}`);
      if (this.filterSearch) parts.push(`cari "${this.filterSearch}"`);
      return parts.length ? `Filter aktif: ${parts.join(', ')}.` : 'Semua kontrol sedang ditampilkan.';
    },
    selectedExplorerControl() { return this.filteredControls.find(c => c.id === this.explorerState.selectedId) || null; },
    conceptFilteredControls() { return this.controls.filter(c => c.concept === this.conceptState.active); },
    selectedConceptControl() { return this.conceptFilteredControls.find(c => c.id === this.conceptState.selectedId) || null; },
    // Pagination computed properties
    totalPages() { return Math.ceil(this.filteredControls.length / this.itemsPerPage); },
    paginatedControls() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredControls.slice(start, end);
    },
  },
  methods: {
    getDomainColor(domain) { return this.domainMeta[domain]?.color || '#64748b'; },
    getConceptColor(name) { return this.conceptMeta[name]?.color || '#64748b'; },
    getConceptIcon(name) { return this.conceptMeta[name]?.icon || 'fa-circle'; },
    getConceptKey(name) { return this.conceptMeta[name]?.key || name; },
    getConceptSummary(name) { return this.conceptMeta[name]?.summary || ''; },
    getConceptControlCount(name) { return this.controls.filter(c => c.concept === name).length; },
    getPillClass(priority) { return { 'danger': 'Kritis', 'warning': 'Tinggi', 'sky': 'Sedang', 'success': 'Rendah' }[priority] || 'neutral'; },
    jumpToTheme(theme) { this.filterTheme = theme; this.activeTab = 'explorer'; },
    resetFilters() { 
      this.filterTheme = 'All'; 
      this.filterType = 'All'; 
      this.filterPrio = 'All'; 
      this.filterDiff = 'All'; 
      this.filterSearch = ''; 
      this.currentPage = 1; // Reset pagination
    },
    retryLoad() {
      this.loadData();
    },
    async loadData() {
      try {
        this.loading = true;
        this.error = null;
        const response = await fetch('/data/iso27001.json');
        if (response.ok) {
          const data = await response.json();
          this.controls = Array.isArray(data) ? data : data.controls || [];
          if (this.controls.length > 0) this.explorerState.selectedId = this.controls[0].id;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error loading ISO 27001 data:', error);
        this.error = error.message || 'Failed to load data';
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    filteredControls() {
      this.currentPage = 1; // Reset to first page when filters change
      if (this.filteredControls.length && !this.filteredControls.find(c => c.id === this.explorerState.selectedId)) {
        this.explorerState.selectedId = this.filteredControls[0]?.id || null;
      }
      if (this.conceptState.active) {
        const cList = this.conceptFilteredControls;
        if (cList.length && !cList.find(c => c.id === this.conceptState.selectedId)) {
          this.conceptState.selectedId = cList[0]?.id || null;
        }
      }
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style scoped>
.iso-page{--ink:#132238;--muted:#5c6776;--line:rgba(19,34,56,.1);--soft:rgba(255,250,242,.95);--shell:linear-gradient(180deg,#f7f2e8 0%,#edf5f5 100%);color:var(--ink);padding:.25rem;border-radius:32px;background:var(--shell)}
.iso-shell{display:grid;gap:1rem}
.iso-hero{display:grid;grid-template-columns:1.55fr .9fr;gap:1rem;align-items:start;min-height:300px;padding:1.15rem;border-radius:28px;overflow:hidden;position:relative;background:radial-gradient(circle at top right,rgba(255,226,189,.82),transparent 30%),radial-gradient(circle at bottom left,rgba(173,223,217,.62),transparent 26%),linear-gradient(135deg,#17324d 0%,#215a56 50%,#f4e4c5 100%);box-shadow:0 14px 30px rgba(15,23,42,.08)}
.iso-hero>*{position:relative;z-index:1}
.iso-kicker{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem .7rem;border-radius:999px;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.iso-title{margin:.8rem 0 .55rem;color:#fffaf2;font-size:clamp(1.85rem,3.2vw,2.6rem);font-weight:800;line-height:1.04}
.iso-lede{margin:0;max-width:680px;color:rgba(255,250,242,.82);line-height:1.55;font-size:.94rem}
.iso-disclaimer-banner{padding:.72rem .82rem;border-radius:14px;background:rgba(255,250,242,.9);border:1px solid rgba(255,255,255,.4);display:flex;gap:.7rem;align-items:flex-start}
.iso-disclaimer-icon{color:#f59e0b;font-size:1rem;flex-shrink:0;margin-top:1px}
.iso-disclaimer-content{color:#1e293b;font-size:.76rem;line-height:1.5}
.iso-disclaimer-content strong{display:block;margin-bottom:.18rem;color:#b45309;font-size:.78rem}
.iso-disclaimer-content a{color:#0284c7;text-decoration:underline;font-weight:600}
.iso-disclaimer-content a:hover{color:#0369a1}
.iso-metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.55rem;margin-top:.9rem}
.iso-metric{padding:.58rem .64rem;border-radius:14px;background:rgba(255,250,242,.12);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(6px);min-height:82px;display:flex;flex-direction:column;justify-content:flex-start}
.iso-metric label,.iso-side-card label,.iso-panel-copy strong{display:block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.iso-metric label{color:rgba(255,250,242,.7);margin-bottom:.24rem}
.iso-metric strong{display:block;color:#fffaf2;font-size:1.32rem;font-weight:800;line-height:1}
.iso-metric span{display:block;margin-top:.26rem;color:rgba(255,250,242,.72);font-size:.72rem;line-height:1.42}
.iso-side-stack{display:grid;gap:.65rem;align-content:start}
.iso-side-card{padding:.68rem .74rem;border-radius:16px;background:rgba(255,250,242,.82);border:1px solid rgba(255,255,255,.24);backdrop-filter:blur(12px);min-height:auto}
.iso-side-card label{color:var(--muted);margin-bottom:.3rem;font-size:.66rem}
.iso-side-card h3{margin:0;font-size:1rem;font-weight:800}
.iso-side-card p{margin:.55rem 0 0;color:var(--muted);line-height:1.55;font-size:.84rem}
.iso-bullets{display:grid;gap:.46rem;margin-top:.58rem}
.iso-bullets div{display:grid;grid-template-columns:auto 1fr;gap:.52rem;align-items:start}
.iso-bullets i{color:#c2410c;margin-top:.28rem;font-size:.55rem}
.iso-bullets span{font-size:.82rem;line-height:1.45}
.iso-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:.85rem}
.iso-tab{display:grid;grid-template-columns:auto 1fr;gap:.85rem;align-items:center;padding:.82rem .88rem;border-radius:18px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,250,242,.94) 0%,rgba(239,245,246,.94) 100%);text-align:left;color:var(--ink);box-shadow:0 12px 24px rgba(15,23,42,.04);cursor:pointer}
.iso-tab.active{border-color:rgba(15,118,110,.24);box-shadow:0 18px 30px rgba(15,118,110,.1)}
.iso-tab i{width:2.35rem;height:2.35rem;display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(19,34,56,.06)}
.iso-tab strong{display:block;font-size:.9rem;font-weight:800}
.iso-tab span{display:block;margin-top:.14rem;color:var(--muted);font-size:.76rem;line-height:1.4}
.iso-grid{display:grid;gap:1rem}
.iso-grid.two{grid-template-columns:1.15fr .85fr}
.iso-panel{padding:1rem;border-radius:20px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,251,245,.98) 0%,rgba(246,251,252,.98) 100%);box-shadow:0 14px 28px rgba(15,23,42,.05)}
.iso-panel-head{display:flex;align-items:center;justify-content:space-between;gap:.85rem;margin-bottom:.7rem}
.iso-panel-head h3{margin:0;font-size:.98rem;font-weight:800}
.iso-chip,.iso-pill{display:inline-flex;align-items:center;gap:.3rem;padding:.24rem .52rem;border-radius:999px;font-size:.7rem;font-weight:700;line-height:1.2}
.iso-chip{background:rgba(19,34,56,.08);color:var(--ink)}
.iso-panel-copy{margin:0 0 .85rem;color:var(--muted);line-height:1.62;font-size:.84rem}
.iso-bars,.iso-priority-stack,.iso-list,.iso-concept-list{display:grid;gap:.65rem}
.iso-bar{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(240px,1fr) auto;gap:.9rem;align-items:center}
.iso-bar.jump{padding:.62rem .72rem;border-radius:16px;border:1px solid transparent;background:rgba(255,255,255,.5);cursor:pointer;transition:border-color .15s ease,transform .15s ease,box-shadow .15s ease}
.iso-bar.jump:hover{transform:translateY(-1px);border-color:rgba(15,118,110,.22);box-shadow:0 12px 22px rgba(15,118,110,.08)}
.iso-bar-copy{display:block;text-align:left}
.iso-bar-copy strong{display:block;font-size:.88rem;text-align:left}
.iso-bar-copy span{display:block;margin-top:.12rem;color:var(--muted);font-size:.75rem;line-height:1.45;text-align:left}
.iso-track{height:.5rem;border-radius:999px;background:rgba(19,34,56,.08);overflow:hidden}
.iso-track b{display:block;height:100%;border-radius:inherit}
.iso-number{min-width:2.4rem;text-align:right;font-weight:800}
.iso-type-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem}
.iso-concept-board{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.65rem}
.iso-quick-themes{display:grid;grid-template-columns:repeat(4,1fr);gap:.55rem}
.iso-quick-theme{width:100%;padding:.62rem .68rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.72);text-align:left;cursor:pointer}
.iso-quick-theme strong{display:block;font-size:.82rem;font-weight:800;color:var(--accent)}
.iso-quick-theme span{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem;white-space:nowrap}
.iso-mini{padding:.78rem .82rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.72)}
.iso-mini label{display:block;color:var(--muted);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.iso-mini strong{display:block;margin-top:.26rem;color:var(--accent);font-size:1.25rem;font-weight:800}
.iso-mini span,.iso-priority p,.iso-tile p{display:block;margin-top:.24rem;color:var(--muted);font-size:.75rem;line-height:1.48}
.iso-mini.compact{padding:.68rem .74rem;border-radius:14px}
.iso-mini.compact label{font-size:.68rem}
.iso-mini.compact strong{margin-top:.18rem;font-size:1.06rem}
.iso-mini.compact span{margin-top:.18rem;font-size:.74rem}
.iso-priority{padding:.78rem .84rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.72)}
.iso-priority-top{display:flex;align-items:center;justify-content:space-between;gap:.8rem}
.iso-priority-top strong{display:inline-flex;align-items:center;gap:.45rem;font-size:.9rem}
.iso-priority-top strong::before{content:'';width:.55rem;height:.55rem;border-radius:999px;background:var(--accent)}
.iso-priority-bars{display:grid;gap:.55rem;margin-top:.75rem}
.iso-priority-bar{display:grid;grid-template-columns:minmax(88px,.55fr) minmax(120px,1fr) auto;gap:.65rem;align-items:center;padding:.58rem .68rem;border-radius:14px;border:1px solid var(--line);background:rgba(255,255,255,.72)}
.iso-priority-name{display:inline-flex;align-items:center;gap:.45rem;font-size:.78rem;font-weight:800}
.iso-priority-name::before{content:'';width:.55rem;height:.55rem;border-radius:999px;background:var(--accent)}
.iso-priority-track{height:.45rem;border-radius:999px;background:rgba(19,34,56,.08);overflow:hidden}
.iso-priority-track b{display:block;height:100%;border-radius:inherit;background:var(--accent)}
.iso-workspace{display:grid;grid-template-columns:.78fr 1fr .95fr;gap:1rem}
.iso-form-grid{display:grid;gap:.85rem}
.iso-form-grid label{display:block;margin-bottom:.35rem;color:var(--muted);font-size:.76rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.iso-summary{padding:.82rem .88rem;border-radius:18px;background:linear-gradient(180deg,rgba(25,61,87,.95) 0%,rgba(23,70,67,.95) 100%);color:#fffaf2}
.iso-summary small{display:block;color:rgba(255,250,242,.7);font-size:.72rem;text-transform:uppercase;letter-spacing:.08em}
.iso-summary strong{display:block;margin-top:.28rem;font-size:1.72rem;font-weight:800;line-height:1}
.iso-summary span{display:block;margin-top:.42rem;color:rgba(255,250,242,.78);font-size:.78rem;line-height:1.5}
.iso-list{max-height:760px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(15,118,110,0.3) transparent;padding-right:.2rem}
.iso-item{position:relative;width:100%;padding:.7rem .8rem .68rem .88rem;margin-bottom:.55rem;border-radius:14px;border:1px solid rgba(19,34,56,.08);background:#fff;text-align:left;cursor:pointer;content-visibility:auto;contain-intrinsic-size:auto 80px}
.iso-item:last-child{margin-bottom:0}
.iso-item.active{border-color:rgba(15,118,110,.35);border-left-width:.28rem;background:rgba(238,245,245,.6)}
.iso-item::before{content:'';position:absolute;left:0;top:.68rem;bottom:.68rem;width:.18rem;border-radius:999px;background:var(--accent)}
.iso-item-top{display:flex;flex-wrap:wrap;gap:.52rem;align-items:center;justify-content:space-between}
.iso-item-code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:.78rem;font-weight:800;color:var(--accent)}
.iso-item-name{margin:.28rem 0 .2rem;font-size:.88rem;font-weight:700;line-height:1.4;color:var(--ink)}
.iso-item-meta-line{color:var(--muted);font-size:.74rem;line-height:1.4}
.iso-item-meta-line span+span::before{content:'•';margin:0 .42rem;color:rgba(19,34,56,.35)}
.iso-pill.compact{padding:.22rem .48rem;font-size:.7rem}
.iso-pill.neutral{background:rgba(19,34,56,.08);color:var(--ink)}
.iso-pill.teal{background:rgba(15,118,110,.12);color:#0f766e}
.iso-pill.gold{background:rgba(161,98,7,.14);color:#a16207}
.iso-pill.clay,.iso-pill.warning{background:rgba(194,65,12,.12);color:#c2410c}
.iso-pill.danger{background:rgba(185,28,28,.12);color:#b91c1c}
.iso-pill.sky{background:rgba(37,99,235,.12);color:#2563eb}
.iso-pill.success{background:rgba(21,128,61,.12);color:#15803d}
.iso-empty{padding:1.3rem;border-radius:20px;border:1px dashed rgba(19,34,56,.18);background:rgba(255,255,255,.6);color:var(--muted);text-align:center;line-height:1.65}
.iso-inspector-panel{position:relative;top:auto;min-height:760px;display:flex;flex-direction:column}
.iso-detail-head{padding-bottom:1rem;border-bottom:1px solid var(--line)}
.iso-detail-head small,.iso-detail-label{display:block;color:var(--muted);font-size:.74rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.iso-detail-head strong{display:block;margin-top:.5rem;font-size:1.08rem;font-weight:800;color:#0f766e}
.iso-detail-head span{display:block;margin-top:.35rem;font-size:.98rem;font-weight:800;line-height:1.45}
.iso-detail-body{display:grid;gap:.9rem;padding-top:1rem;flex:1;min-height:0;overflow:auto;align-content:start}
.iso-detail-meta{display:flex;flex-wrap:wrap;gap:.55rem;padding-bottom:.15rem}
.iso-detail-meta-item{display:inline-flex;align-items:center;gap:.38rem;padding:.38rem .65rem;border-radius:999px;background:rgba(19,34,56,.06);color:var(--ink);font-size:.76rem;line-height:1.2}
.iso-detail-meta-item small{color:var(--muted);font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.iso-detail-meta-item strong{font-size:.78rem;font-weight:700}
.iso-note,.iso-callout{padding:.9rem 1rem;border-radius:18px;border:1px solid var(--line)}
.iso-note{background:rgba(238,245,245,.84);line-height:1.7}
.iso-callout{background:rgba(255,255,255,.72);line-height:1.7}
.iso-evidence-list{margin:.15rem 0 0;padding-left:1rem;color:var(--muted);font-size:.84rem;line-height:1.7}
.iso-evidence-list li{margin-bottom:.22rem}
.iso-tile{width:100%;padding:.72rem .78rem;border-radius:16px;border:1px solid var(--line);background:#fff;text-align:left;cursor:pointer}
.iso-tile.active{border-color:rgba(15,118,110,.24);box-shadow:0 16px 28px rgba(15,118,110,.08);background:rgba(238,245,245,.72)}
.iso-tile-top{display:flex;align-items:center;justify-content:space-between;gap:.45rem;color:var(--muted);font-size:.64rem;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
.iso-tile-top>span:last-child{white-space:nowrap}
.iso-tile-icon{width:1.9rem;height:1.9rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(15,118,110,.12);color:var(--accent);font-size:.8rem}
.iso-tile strong{display:block;margin-top:.42rem;font-size:.86rem;font-weight:800;line-height:1.2}
.iso-tile p{display:-webkit-box;margin-top:.28rem;color:var(--muted);font-size:.74rem;line-height:1.45;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.iso-selected{display:grid;grid-template-columns:auto 1fr auto;gap:.85rem;align-items:center;padding:.92rem 1rem;border-radius:20px;background:linear-gradient(135deg,rgba(24,59,86,.96) 0%,rgba(15,118,110,.9) 100%);color:#fffaf2}
.iso-selected-mark{width:2.55rem;height:2.55rem;display:inline-flex;align-items:center;justify-content:center;border-radius:16px;background:rgba(255,250,242,.14);font-size:.98rem}
.iso-selected small{color:rgba(255,250,242,.68)}
.iso-selected h3{margin:.16rem 0 0;font-size:1.02rem;font-weight:800}
.iso-selected p{margin:.28rem 0 0;color:rgba(255,250,242,.8);line-height:1.52;font-size:.8rem}
.iso-selected-count{text-align:right}
.iso-selected-count strong{display:block;font-size:1.7rem;font-weight:800;line-height:1}
.iso-selected-count span{display:block;margin-top:.15rem;color:rgba(255,250,242,.72);font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;font-weight:700}
.iso-concept-workspace{display:grid;grid-template-columns:.9fr 1.1fr;gap:1rem}

@media (max-width:1440px){.iso-hero { min-height: 260px; padding: 1rem; } .iso-title { font-size: clamp(1.75rem, 3vw, 2.35rem); margin: .65rem 0 .42rem; } .iso-lede { font-size: .9rem; } .iso-metric { min-height: 76px; padding: .5rem .58rem; } .iso-metric strong { font-size: 1.22rem; } .iso-list, .iso-inspector-panel { min-height: auto; max-height: 520px; }}
@media (max-height:850px) and (min-width:1024px){.iso-hero { min-height: 220px; padding: .95rem; } .iso-metric-grid { margin-top: .55rem; } .iso-list, .iso-inspector-panel { max-height: calc(100vh - 280px); } .iso-detail-body { padding-top: .5rem; }}
@media (max-width:1199.98px){.iso-hero,.iso-metric,.iso-side-card{min-height:auto}.iso-hero,.iso-nav,.iso-grid.two,.iso-workspace,.iso-concept-workspace,.iso-metric-grid,.iso-type-grid,.iso-quick-themes{grid-template-columns:1fr}.iso-bar{grid-template-columns:1fr}}
@media (max-width:1599.98px){.iso-concept-board{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:991.98px){.iso-concept-board{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:767.98px){.iso-hero,.iso-panel{padding:1.2rem;border-radius:22px}.iso-selected{grid-template-columns:1fr}.iso-selected-count{text-align:left}.iso-concept-board{grid-template-columns:1fr}.iso-inspector-panel{min-height:auto;position:static}}
</style>
