<template>
  <div class="padg-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading PADG data...</p>
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
    <div v-else class="padg-shell">
      <section class="padg-hero">
        <div>
          <span class="padg-kicker"><i class="fas fa-landmark"></i>Bank Indonesia</span>
          <h1 class="padg-title">PADG 32/2025 - Pengaturan Industri Sistem Pembayaran</h1>
          <p class="padg-lede">Time to decode the payment ecosystem rules! Halaman ini membedah PADG 32/2025 dengan presisi. Kita map out seluruh kewajiban per bab, analisis implementasi teknisnya, plus reference lampiran yang lo butuhin. Jadikan ini kompas lo buat comply sama standar industri sistem pembayaran tanpa kehilangan agility bisnis.</p>
          <div class="padg-metrics">
            <div class="padg-metric"><label>Total Bab</label><strong>{{ totalChapters }}</strong><span>BAB I sampai XII yang mengatur berbagai aspek sistem pembayaran.</span></div>
            <div class="padg-metric"><label>Total Kewajiban</label><strong>{{ totalRequirements }}</strong><span>Pasal-pasal yang dapat ditinjau satu per satu dalam eksplorasi.</span></div>
            <div class="padg-metric"><label>Lampiran</label><strong>{{ totalAppendices }}</strong><span>Definisi, parameter, dan kerangka implementasi penting.</span></div>
            <div class="padg-metric"><label>Batas Pelaporan</label><strong>{{ reportingSla }}</strong><span>Hari kerja untuk penyampaian laporan setelah akhir periode.</span></div>
          </div>
        </div>
        <div class="padg-side-stack">
          <div class="padg-side"><label>Alur Analisa</label><h3>Pendekatan analisa yang terstruktur dan konsisten</h3><p>Analisis dapat dimulai dari peta pilar dan bab untuk memahami cakupan regulasi, kemudian dilanjut ke eksplorasi kewajiban untuk meninjau rinci, dan ditutup dengan board lampiran untuk referensi format, definisi, dan artefak implementasi.</p></div>
          <div class="padg-side"><label>Catatan Regulasi</label><p>PADG mengatur penyelenggaraan sistem pembayaran, aktivitas, produk, skema harga, inovasi, tata kelola, manajemen risiko, pengawasan, koordinasi, dan ketentuan lainnya. Kepatuhan wajib dipatuhi oleh PSP, PJP, PIP, Peserta, dan pihak terkait lainnya.</p></div>
        </div>
      </section>

      <div class="padg-nav nav" role="tablist">
        <button class="padg-tab" :class="{ active: activeTab === 'overview' }" type="button" role="tab" @click="activeTab = 'overview'"><i class="fas fa-chart-line"></i><span><strong>Ringkasan Regulasi</strong><span>Peta pilar, bab regulasi, dan elemen kewajiban inti.</span></span></button>
        <button class="padg-tab" :class="{ active: activeTab === 'explorer' }" type="button" role="tab" @click="activeTab = 'explorer'"><i class="fas fa-sliders-h"></i><span><strong>Eksplorasi</strong><span>Filter kewajiban, baca interpretasi, dan telusuri lampiran terkait.</span></span></button>
        <button class="padg-tab" :class="{ active: activeTab === 'reference' }" type="button" role="tab" @click="activeTab = 'reference'"><i class="fas fa-folder-open"></i><span><strong>Lampiran & Referensi</strong><span>Board referensi lampiran, definisi, dan format.</span></span></button>
      </div>

      <div class="tab-content padg-grid">
        <!-- Tab 1: Ringkasan Regulasi -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="padg-grid two">
            <article class="padg-panel">
              <div class="padg-head"><h3>Lanskap pilar regulasi</h3><span class="padg-chip">{{ pillarBreakdown.length }} pilar</span></div>
              <p class="padg-copy">Pilar utama PADG: tata kelola, aktivitas, produk, risiko, harga, inovasi, pengawasan, dan pelaporan. Klik bar untuk filter eksplorasi.</p>
              <div class="padg-bars">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="padg-bar" @click="jumpExplorer(item.key)"><span><strong>{{ item.label }}</strong><em>{{ item.summary }}</em></span><span class="padg-track"><b :style="{ width: (item.count / maxPillarCount) * 100 + '%', background: item.color }"></b></span><span class="padg-num">{{ item.count }}</span></button>
              </div>
            </article>

            <article class="padg-panel">
              <div class="padg-head"><h3>Timeline Kepatuhan</h3><span class="padg-chip">Batas waktu</span></div>
              <p class="padg-copy">Rencana milestone implementasi PADG 32/2025 untuk memastikan kesiapan operasional tepat waktu.</p>
              <div class="padg-timeline mt-3">
                <div class="d-flex gap-3 mb-3">
                  <div class="text-center"><div class="fw-bold text-navy x-small">APR</div><div class="h5 fw-800 mb-0">2026</div></div>
                  <div class="border-start ps-3"><div class="fw-bold x-small">Fase Persiapan</div><p class="text-muted mb-0 x-small">Analisa gap dan pemetaan kewajiban internal.</p></div>
                </div>
                <div class="d-flex gap-3">
                  <div class="text-center"><div class="fw-bold text-danger x-small">DES</div><div class="h5 fw-800 mb-0">2026</div></div>
                  <div class="border-start ps-3"><div class="fw-bold x-small text-danger">Batas Akhir</div><p class="text-muted mb-0 x-small">Seluruh sistem harus sudah comply 100%.</p></div>
                </div>
              </div>
            </article>

            <article class="padg-panel">
              <div class="padg-head"><h3>Ringkasan PADG</h3><span class="padg-chip">Pemeriksaan cepat</span></div>
              <div class="padg-mini-row">
                <div class="padg-mini"><label>Ruang Lingkup</label><strong>12 BAB</strong><span>Mencakup seluruh aspek industri sistem pembayaran.</span></div>
                <div class="padg-mini"><label>Penerapan</label><strong>PSP & Pihak Terkait</strong><span>Bank Indonesia, PSP, PJP, PIP, Peserta, SRO, dan afiliasi.</span></div>
                <div class="padg-mini"><label>Prioritas</label><strong>Stabilitas & Inovasi</strong><span>Kestabilan sistem pembayaran sambil dorong inovasi digital.</span></div>
                <div class="padg-mini"><label>Sifat Aturan</label><strong>Mandatory</strong><span>Kepatuhan wajib dengan sanksi administratif bagi pelanggar.</span></div>
              </div>
              <div class="padg-note">Setiap PSP wajib menyelenggarakan sistem pembayaran sesuai ketentuan PADG ini.</div>
            </article>

            <article class="padg-panel">
              <div class="padg-head"><h3>Referensi lampiran</h3><span class="padg-chip">{{ totalAppendices }} lampiran</span></div>
              <p class="padg-copy">Daftar lampiran berisi definisi, parameter, dan kerangka teknis PADG. Pilih lampiran untuk melihat detail isi.</p>
              <div class="mt-3 p-3 bg-light rounded-4 border border-dashed text-center">
                <i class="fas fa-file-pdf fs-3 text-muted mb-2"></i>
                <div class="x-small fw-bold">10 Dokumen Teknis</div>
                <div class="x-small text-muted">Tersedia di tab Lampiran</div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 2: Eksplorasi -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="padg-workspace">
            <article class="padg-panel padg-filter-panel">
              <div class="padg-head"><h3>Filter Workspace</h3><span class="padg-chip">{{ totalRequirements }} kewajiban</span></div>
              <div class="padg-pillar-grid">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="padg-pillar" :class="{ active: activePillar === item.key }" :style="{ '--accent': item.color }" @click="togglePillar(item.key)"><strong>{{ item.label }}</strong><span>{{ item.count }} kewajiban</span></button>
              </div>
              <div class="padg-form">
                <div><label for="chapterFilter">Bab</label><select id="chapterFilter" v-model="chapterFilter" class="form-select"><option value="">Semua bab</option><option v-for="ch in chapterBreakdown" :key="ch.key" :value="ch.key">{{ ch.key }}. {{ ch.label }}</option></select></div>
                <div><label for="requirementSearch">Cari kewajiban</label><input id="requirementSearch" v-model="requirementSearch" type="search" class="form-control" placeholder="Cari ID, judul, ringkasan, atau lampiran"></div>
                <button type="button" class="btn btn-outline-secondary" @click="resetRequirementFilters">Atur ulang filter</button>
              </div>
            </article>
            <article class="padg-panel">
              <div class="padg-head"><h3>Daftar kewajiban</h3><span class="padg-chip">{{ filteredRequirements.length }} entri</span></div>
              <div class="padg-list">
                <button v-for="req in filteredRequirements" :key="req.id" type="button" class="padg-item" :class="{ active: activeRequirementId === req.id }" :style="{ '--accent': getPillarColor(req.pillar) }" @click="setActiveRequirement(req.id)"><div class="padg-item-top"><span class="padg-item-code">{{ req.id }}</span><span class="padg-pill">{{ getPillarLabel(req.pillar) }}</span></div><div class="padg-item-name">{{ req.title || '-' }}</div><div class="padg-item-meta"><span>{{ getChapterLabel(req.chapter) }}</span><span>{{ (req.appendices || []).length }} lampiran</span></div></button>
                <div v-if="filteredRequirements.length === 0" class="padg-empty">Tidak ada kewajiban yang cocok dengan filter saat ini.</div>
              </div>
            </article>
            <article class="padg-panel padg-inspector">
              <div class="padg-inspector-head"><small>Kewajiban Detail</small><strong>{{ activeRequirement ? activeRequirement.id : '-' }}</strong><span>{{ activeRequirement ? activeRequirement.title : 'Pilih kewajiban untuk membaca detail.' }}</span></div>
              <div class="padg-inspector-body">
                <div class="padg-meta"><span>{{ activeRequirement ? getPillarLabel(activeRequirement.pillar) : '-' }}</span><span>{{ activeRequirement ? getChapterLabel(activeRequirement.chapter) : '-' }}</span><span>{{ activeRequirement ? (activeRequirement.appendices || []).length + ' lampiran' : '0 lampiran' }}</span></div>
                <div class="padg-callout"><span class="padg-label">Ringkasan Requirement</span><div class="mt-2">{{ activeRequirement ? (activeRequirement.summary || 'Tidak ada ringkasan tersedia.') : 'Pilih kewajiban untuk membaca detail.' }}</div></div>
                <div class="padg-note"><span class="padg-label"><i class="fas fa-lightbulb me-1"></i>Analogi</span><div class="mt-2">{{ activeRequirement && activeRequirement.analogy ? activeRequirement.analogy : '-' }}</div></div>
                <div class="padg-callout"><span class="padg-label">Fokus Implementasi</span><ul class="padg-plain"><li v-for="(item, idx) in (activeRequirement && activeRequirement.focus && activeRequirement.focus.length ? activeRequirement.focus : ['Tidak ada fokus implementasi tambahan.'])" :key="idx">{{ item }}</li></ul></div>
                <div class="padg-callout"><span class="padg-label">Contoh Evidence</span><ul class="padg-plain"><li v-for="(item, idx) in (activeRequirement && activeRequirement.evidence && activeRequirement.evidence.length ? activeRequirement.evidence : ['Tidak ada evidence cue.'])" :key="idx">{{ item }}</li></ul></div>
                <div class="padg-callout"><span class="padg-label">Lampiran Terkait</span><div class="padg-refs"><span v-for="ref in (activeRequirement?.appendices || [])" :key="ref" class="padg-ref">{{ ref }}</span><span v-if="!activeRequirement || !activeRequirement.appendices || !activeRequirement.appendices.length" class="padg-empty w-100">Kewajiban ini tidak menunjuk lampiran spesifik.</span></div></div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 3: Lampiran & Referensi -->
        <div v-if="activeTab === 'reference'" key="reference-tab">
          <div class="padg-refspace">
            <article class="padg-panel">
              <div class="padg-head"><h3>Daftar lampiran</h3><span class="padg-chip">{{ totalAppendices }} lampiran</span></div>
              <p class="padg-copy">Daftar lampiran PADG berisi definisi, parameter, dan kerangka teknis untuk implementasi regulasi.</p>
            </article>
            <article class="padg-panel">
              <div class="padg-head"><h3>Board lampiran</h3><span class="padg-chip">{{ appendices.length }} entri</span></div>
              <div class="padg-list">
                <button v-for="app in appendices" :key="app.id" type="button" class="padg-item" @click="openAppendixModal(app)"><div class="padg-item-top"><span class="padg-item-code">{{ app.id }}</span><span class="padg-pill">{{ app.type }}</span></div><div class="padg-item-name">{{ app.title || '-' }}</div></button>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 4: Asesmen Mandiri -->
        <div v-if="activeTab === 'assessment'" key="assessment-tab">
          <div class="padg-panel text-center py-5">
            <i class="fas fa-clipboard-check mb-3" style="font-size: 3rem; color: #cbd5e1;"></i>
            <h4 class="fw-800 text-navy mb-2">Modul Asesmen Dalam Pengembangan</h4>
            <p class="text-muted" style="max-width: 500px; margin: 0 auto;">
              Fitur kalkulator gap-analysis dan checklist audit kepatuhan untuk PADG 32/2025 sedang dipersiapkan. Modul ini akan membantu Anda mengukur tingkat kesiapan secara otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Appendix -->
  <Transition name="modal-fade">
    <div v-if="showAppendixModal" class="modal-overlay" @click.self="showAppendixModal = false">
      <Transition name="modal-slide">
        <div class="modal-dialog" v-if="showAppendixModal">
          <div class="modal-shell">
            <div class="modal-sidebar" :style="{ background: `linear-gradient(180deg, ${getAppendixColor(selectedAppendix?.type)} 0%, ${getAppendixColor(selectedAppendix?.type, 0.7)} 100%)` }">
              <button type="button" class="modal-close" @click="showAppendixModal = false" aria-label="Close">
                <i class="fas fa-times"></i>
              </button>
              <div class="modal-sidebar-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="modal-sidebar-id">{{ selectedAppendix?.id || '-' }}</div>
              <div class="modal-sidebar-type">{{ selectedAppendix?.type || '' }}</div>
            </div>
            <div class="modal-main">
              <div class="modal-header">
                <h4 class="modal-title">{{ selectedAppendix?.title || 'Detail Lampiran' }}</h4>
              </div>
              <div class="modal-body">
                <!-- Ringkasan Section -->
                <div class="modal-section">
                  <div class="modal-section-header" :style="{ color: getAppendixColor(selectedAppendix?.type) }">
                    <i class="fas fa-info-circle"></i>
                    <span>Ringkasan</span>
                  </div>
                  <div class="modal-section-content">
                    <div class="modal-scope">{{ selectedAppendix?.scope || '-' }}</div>
                    <p class="modal-summary">{{ selectedAppendix?.summary || '-' }}</p>
                  </div>
                </div>

                <!-- Artefak Section -->
                <div class="modal-section">
                  <div class="modal-section-header" :style="{ color: getAppendixColor(selectedAppendix?.type) }">
                    <i class="fas fa-list-check"></i>
                    <span>Isi / Elemen Utama</span>
                  </div>
                  <div class="modal-section-content">
                    <ul class="modal-artifact-list">
                      <li v-for="(item, idx) in (selectedAppendix?.contains && selectedAppendix.contains.length ? selectedAppendix.contains : [])" :key="idx">
                        <i class="fas fa-check-circle"></i>
                        <span>{{ item }}</span>
                      </li>
                      <li v-if="!selectedAppendix?.contains || !selectedAppendix.contains.length" class="modal-empty">
                        Tidak ada artefak yang dipetakan.
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Requirements Section -->
                <div class="modal-section">
                  <div class="modal-section-header" :style="{ color: getAppendixColor(selectedAppendix?.type) }">
                    <i class="fas fa-link"></i>
                    <span>Kewajiban Terkait</span>
                  </div>
                  <div class="modal-section-content">
                    <div class="modal-requirements">
                      <button v-for="reqId in (selectedAppendix?.used_by || [])" :key="reqId" type="button" class="modal-req-btn" @click="jumpToRequirement(reqId)">
                        <i class="fas fa-arrow-right"></i>
                        <span>{{ reqId }}</span>
                      </button>
                      <div v-if="!selectedAppendix?.used_by || !selectedAppendix.used_by.length" class="modal-empty">
                        Belum ada kewajiban yang dipetakan ke lampiran ini.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'Padg',
  data() {
    return {
      loading: true,
      error: null,
      activeTab: 'overview',
      requirements: [],
      appendices: [],
      pillarMeta: {
        'Governance': { label: 'Tata Kelola', color: '#0f766e', icon: 'fa-sitemap', summary: 'Kerangka pengaturan, ruang lingkup, dan prinsip dasar PADG.' },
        'Activities': { label: 'Aktivitas', color: '#2563eb', icon: 'fa-cogs', summary: 'Jasa dan infrastruktur sistem pembayaran (PJP & PIP).' },
        'Products': { label: 'Produk & Instrumen', color: '#7c3aed', icon: 'fa-credit-card', summary: 'Sumber dana, akses, instrumen pembayaran, dan kanal.' },
        'RiskManagement': { label: 'Manajemen Risiko', color: '#a16207', icon: 'fa-shield-alt', summary: 'Aspek prudensial, kontrol risiko, dan perlindungan konsumen.' },
        'Pricing': { label: 'Skema Harga', color: '#059669', icon: 'fa-tag', summary: 'Kebijakan harga, transparansi biaya, dan peraturan tarif.' },
        'Innovation': { label: 'Inovasi', color: '#0891b2', icon: 'fa-flask', summary: 'Uji coba inovasi teknologi, regulatory sandbox.' },
        'Supervision': { label: 'Pengawasan', color: '#b91c1c', icon: 'fa-search', summary: 'Kegiatan pengawasan, pemeriksaan, dan penegakan.' },
        'Reporting': { label: 'Pelaporan', color: '#1d4ed8', icon: 'fa-file-alt', summary: 'Ketentuan laporan dan dokumentasi.' },
      },
      chapterMeta: {
        'I': { label: 'Ketentuan Umum', color: '#2563eb', icon: 'fa-book', summary: 'Definisi dan istilah dasar dalam pengaturan industri sistem pembayaran.' },
        'II': { label: 'Kerangka Kerja', color: '#0f766e', icon: 'fa-sitemap', summary: 'Ruang lingkup dan kerangka pengaturan industri sistem pembayaran.' },
        'III': { label: 'Aktivitas, Produk, & Inovasi', color: '#a16207', icon: 'fa-cogs', summary: 'Aktivitas, produk, skema harga, dan inovasi teknologi sistem pembayaran.' },
        'IV': { label: 'Struktur Industri', color: '#7c3aed', icon: 'fa-building', summary: 'Struktur industri penyelenggara sistem pembayaran.' },
        'V': { label: 'Tata Kelola & Manajemen Risiko', color: '#1d4ed8', icon: 'fa-shield-alt', summary: 'Tata kelola, manajemen risiko, dan praktik pasar.' },
        'VI': { label: 'Praktik Pasar', color: '#059669', icon: 'fa-chart-bar', summary: 'Standar praktik pasar dan ketentuan operasional.' },
        'VII': { label: 'Data & Informasi', color: '#0891b2', icon: 'fa-database', summary: 'Pengelolaan data dan informasi sistem pembayaran.' },
        'VIII': { label: 'Pengawasan', color: '#b91c1c', icon: 'fa-search', summary: 'Kegiatan pengawasan dan penegakan sanksi.' },
        'IX': { label: 'Pengakhiran', color: '#dc2626', icon: 'fa-stop-circle', summary: 'Ketentuan pengakhiran kegiatan usaha.' },
        'X': { label: 'Koordinasi & Kerja Sama', color: '#7c2d12', icon: 'fa-handshake', summary: 'Koordinasi dan kerja sama dengan otoritas terkait.' },
        'XI': { label: 'Peraturan Lain', color: '#4b5563', icon: 'fa-file-alt', summary: 'Ketentuan peraturan perundang-undangan lain yang berlaku.' },
        'XII': { label: 'Ketentuan Lainnya', color: '#6b7280', icon: 'fa-cog', summary: 'Ketentuan penutup dan peralihan.' },
      },
      appendixTypePalette: {
        'Glosarium': '#2563eb',
        'Parameter': '#0f766e',
        'Kewajiban': '#a16207',
        'Standar': '#7c3aed',
        'Persyaratan': '#b91c1c',
        'Framework': '#144e72',
        'Format': '#059669',
        'Prosedur': '#0891b2',
        'Ketentuan Khusus': '#dc2626',
        'Panduan Implementasi': '#7c2d12'
      },
      activePillar: '',
      chapterFilter: '',
      requirementSearch: '',
      activeRequirementId: null,
      showAppendixModal: false,
      selectedAppendix: null,
      reportingSla: 30,
    };
  },
  computed: {
    totalChapters() {
      const chapters = this.requirements.map(r => r.chapter).filter(Boolean);
      return new Set(chapters).size;
    },
    totalRequirements() { return this.requirements.length; },
    totalAppendices() { return this.appendices.length; },
    pillarBreakdown() {
      return Object.entries(this.pillarMeta)
        .map(([key, meta]) => ({ key, label: meta.label, color: meta.color, icon: meta.icon, summary: meta.summary, count: this.requirements.filter(r => r.pillar === key).length }))
        .filter(item => item.count > 0);
    },
    maxPillarCount() { return Math.max(...this.pillarBreakdown.map(p => p.count), 1); },
    chapterBreakdown() {
      return Object.entries(this.chapterMeta)
        .map(([key, meta]) => ({ key, label: meta.label, color: meta.color, icon: meta.icon, summary: meta.summary, count: this.requirements.filter(r => r.chapter === key).length }))
        .filter(item => item.count > 0);
    },
    maxChapterCount() { return Math.max(...this.chapterBreakdown.map(c => c.count), 1); },
    activeRequirement() { return this.requirements.find(r => r.id === this.activeRequirementId) || null; },
    filteredRequirements() {
      let result = this.requirements;
      if (this.activePillar) {
        result = result.filter(r => r.pillar === this.activePillar);
      }
      if (this.chapterFilter) {
        result = result.filter(r => r.chapter === this.chapterFilter);
      }
      if (this.requirementSearch) {
        const search = this.requirementSearch.toLowerCase();
        result = result.filter(r => {
          const id = (r.id || '').toLowerCase();
          const title = (r.title || '').toLowerCase();
          const summary = (r.summary || '').toLowerCase();
          const appendices = (r.appendices || []).join(' ').toLowerCase();
          return id.includes(search) || title.includes(search) || summary.includes(search) || appendices.includes(search);
        });
      }
      return result;
    },
  },
  methods: {
    getPillarColor(p) { return this.pillarMeta[p]?.color || '#144e72'; },
    getPillarLabel(p) { return this.pillarMeta[p]?.label || p || '-'; },
    getChapterLabel(c) { return (c || '-') + '. ' + (this.chapterMeta[c]?.label || ''); },
    togglePillar(p) { this.activePillar = this.activePillar === p ? '' : p; },
    resetRequirementFilters() { this.activePillar = ''; this.chapterFilter = ''; this.requirementSearch = ''; },
    setActiveRequirement(id) { this.activeRequirementId = id; },
    jumpExplorer(pillar = '', chapter = '') {
      this.activePillar = pillar || '';
      this.chapterFilter = chapter || '';
      this.requirementSearch = '';
      this.activeTab = 'explorer';
    },
    jumpAppendix(id = '') {
      this.appendixSearch = id || '';
      this.activeTab = 'reference';
    },
    openAppendixModal(app) { this.selectedAppendix = app; this.showAppendixModal = true; },
    jumpToRequirement(id) {
      const req = this.requirements.find(r => r.id === id);
      if (!req) return;
      this.showAppendixModal = false;
      this.activePillar = req.pillar || '';
      this.chapterFilter = req.chapter || '';
      this.requirementSearch = '';
      this.setActiveRequirement(id);
      this.activeTab = 'explorer';
    },
    getAppendixColor(type, opacity = 1) {
      const baseColor = this.appendixTypePalette[type] || '#144e72';
      if (opacity === 1) return baseColor;
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    retryLoad() {
      this.loadData();
    },
    async loadData() {
      try {
        this.loading = true;
        this.error = null;
        const [reqRes, appRes] = await Promise.all([
          fetch('/data/padg_requirements.json'),
          fetch('/data/padg_appendices.json')
        ]);
        if (reqRes.ok) {
          const data = await reqRes.json();
          this.requirements = Array.isArray(data) ? data : data.requirements || [];
          if (this.requirements.length > 0) this.activeRequirementId = this.requirements[0].id;
        } else {
          throw new Error(`Failed to load requirements: HTTP ${reqRes.status}`);
        }
        if (appRes.ok) {
          const data = await appRes.json();
          this.appendices = Array.isArray(data) ? data : data.appendices || [];
        } else {
          throw new Error(`Failed to load appendices: HTTP ${appRes.status}`);
        }
      } catch (error) {
        console.error('Error loading PADG data:', error);
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
.padg-page{--ink:#14263b;--muted:#5c6776;--line:rgba(20,38,59,.1);--shell:linear-gradient(180deg,#f6efe3 0%,#edf5f6 100%);color:var(--ink);padding:.25rem;border-radius:32px;background:var(--shell)}
.padg-shell{display:grid;gap:1rem}
.padg-hero{display:grid;grid-template-columns:1.55fr .92fr;gap:1.2rem;align-items:stretch;min-height:368px;padding:1.45rem;border-radius:28px;overflow:hidden;position:relative;background:radial-gradient(circle at top right,rgba(248,214,161,.88),transparent 30%),radial-gradient(circle at bottom left,rgba(156,210,219,.7),transparent 28%),linear-gradient(135deg,#132a43 0%,#1f5f78 46%,#f2debb 100%);box-shadow:0 20px 44px rgba(15,23,42,.09)}
.padg-hero>*{position:relative;z-index:1}
.padg-kicker{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem .7rem;border-radius:999px;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.padg-title{margin:1rem 0 .7rem;color:#fffaf2;font-size:clamp(2rem,3.8vw,3rem);font-weight:800;line-height:1.04}
.padg-lede{margin:0;max-width:720px;color:rgba(255,250,242,.82);line-height:1.7}
.padg-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:.65rem;margin-top:1.1rem}
.padg-metric,.padg-side,.padg-panel,.padg-mini{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,251,245,.98) 0%,rgba(246,251,252,.98) 100%);box-shadow:0 14px 28px rgba(15,23,42,.05)}
.padg-metric{padding:.68rem .74rem;border-radius:16px;background:rgba(255,250,242,.12);border-color:rgba(255,255,255,.18);min-height:96px;display:flex;flex-direction:column;justify-content:flex-start}
.padg-metric label,.padg-side label,.padg-mini label,.padg-form label,.padg-inspector small,.padg-label{display:block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.padg-metric label{color:rgba(255,250,242,.7);margin-bottom:.35rem}
.padg-metric strong{display:block;color:#fffaf2;font-size:1.5rem;font-weight:800;line-height:1}
.padg-metric span{display:block;margin-top:.34rem;color:rgba(255,250,242,.72);font-size:.76rem}
.padg-side-stack{display:grid;gap:.85rem}
.padg-side{padding:.8rem .86rem;border-radius:18px;background:rgba(255,250,242,.78);border-color:rgba(255,255,255,.24);min-height:142px}
.padg-side label{color:var(--muted);margin-bottom:.4rem}
.padg-side h3{margin:0;font-size:1rem;font-weight:800}
.padg-side p{margin:.55rem 0 0;color:var(--muted);line-height:1.55;font-size:.84rem}
.padg-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}
.padg-tab{display:grid;grid-template-columns:auto 1fr;gap:.72rem;align-items:center;padding:.82rem .88rem;border-radius:18px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,250,242,.94) 0%,rgba(239,245,246,.94) 100%);text-align:left;color:var(--ink);box-shadow:0 12px 24px rgba(15,23,42,.04);cursor:pointer}
.padg-tab.active{border-color:rgba(20,78,114,.24);box-shadow:0 18px 30px rgba(20,78,114,.1)}
.padg-tab i{width:2.35rem;height:2.35rem;display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(20,38,59,.06)}
.padg-tab strong{display:block;font-size:.9rem;font-weight:800}
.padg-tab span{display:block;margin-top:.14rem;color:var(--muted);font-size:.76rem;line-height:1.4}
.padg-grid{display:grid;gap:1rem}
.padg-grid.two{grid-template-columns:1.06fr .94fr}
.padg-panel{padding:1rem;border-radius:20px}
.padg-head{display:flex;align-items:center;justify-content:space-between;gap:.85rem;margin-bottom:.7rem}
.padg-head h3{margin:0;font-size:.98rem;font-weight:800}
.padg-chip,.padg-pill,.padg-meta span,.padg-ref{display:inline-flex;align-items:center;gap:.3rem;padding:.24rem .52rem;border-radius:999px;font-size:.70rem;font-weight:700;line-height:1.2}
.padg-chip{background:rgba(20,38,59,.08);color:var(--ink)}
.padg-copy{margin:0 0 .85rem;color:var(--muted);line-height:1.6;font-size:.84rem}
.padg-bars,.padg-cards,.padg-hotspots,.padg-families{display:grid;gap:.65rem}
.padg-bar,.padg-hotspot,.padg-family{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(180px,1fr) auto;gap:.68rem;align-items:center;padding:.62rem .72rem;border-radius:16px;border:1px solid transparent;background:rgba(255,255,255,.55);text-align:left;cursor:pointer;transition:border-color .15s ease,transform .15s ease,box-shadow .15s ease}
.padg-family{grid-template-columns:1fr auto}
.padg-bar:hover,.padg-hotspot:hover,.padg-family:hover,.padg-bar.active,.padg-hotspot.active,.padg-family.active{transform:translateY(-1px);border-color:rgba(20,78,114,.22);box-shadow:0 12px 22px rgba(20,78,114,.08)}
.padg-bar strong,.padg-hotspot strong,.padg-family strong{display:block;font-size:.86rem}
.padg-bar em,.padg-hotspot em,.padg-family em{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem;font-style:normal}
.padg-track{height:.44rem;border-radius:999px;background:rgba(20,38,59,.08);overflow:hidden}
.padg-track b{display:block;height:100%;border-radius:inherit}
.padg-num{min-width:2.2rem;text-align:right;font-weight:800}
.padg-cards{grid-template-columns:repeat(3,1fr)}
.padg-card{width:100%;padding:.76rem .8rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer}
.padg-card-top{display:flex;align-items:center;justify-content:space-between;gap:.55rem;color:var(--muted);font-size:.64rem;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
.padg-icon{width:1.9rem;height:1.9rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(20,78,114,.12);color:var(--accent);font-size:.8rem}
.padg-card strong{display:block;margin-top:.42rem;font-size:.86rem;font-weight:800}
.padg-card p{margin:.22rem 0 0;color:var(--muted);font-size:.72rem;line-height:1.4}
.padg-mini-row{display:grid;grid-template-columns:repeat(2,1fr);gap:.65rem;margin-bottom:.8rem}
.padg-mini{padding:.72rem .78rem;border-radius:16px}
.padg-mini label{color:var(--muted)}
.padg-mini strong{display:block;margin-top:.2rem;font-size:1.08rem;font-weight:800;color:#144e72}
.padg-mini span{display:block;margin-top:.14rem;color:var(--muted);font-size:.72rem;line-height:1.4}
.padg-workspace{display:grid;grid-template-columns:.85fr 1.15fr;gap:1rem}
.padg-filter-panel{grid-column:1 / -1}
.padog-workspace>*{min-width:0}
.padog-list>*{min-width:0}
.padg-refspace{display:grid;grid-template-columns:.82fr 1.18fr;gap:1rem}
.padg-pillar-grid{display:flex;flex-wrap:wrap;gap:.55rem;margin-bottom:.8rem}
.padg-pillar{flex:1 1 auto;padding:.62rem .68rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer}
.padg-pillar.active{border-color:rgba(20,78,114,.24);background:rgba(238,245,245,.72);box-shadow:0 12px 24px rgba(20,78,114,.08)}
.padg-pillar strong{display:block;font-size:.82rem;font-weight:800;color:var(--accent)}
.padg-pillar span{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem}
.padg-form{display:flex;gap:.75rem;align-items:flex-end}
.padg-form > div { flex: 1; }
.padg-form label{margin-bottom:.3rem;color:var(--muted)}
.padg-summary{margin-top:.85rem;padding:.82rem .88rem;border-radius:18px;background:linear-gradient(180deg,rgba(25,61,87,.95) 0%,rgba(20,78,114,.95) 100%);color:#fffaf2}
.padg-summary small{display:block;color:rgba(255,250,242,.7);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.padg-summary strong{display:block;margin-top:.28rem;font-size:1.72rem;font-weight:800;line-height:1}
.padg-summary span{display:block;margin-top:.42rem;color:rgba(255,250,242,.78);font-size:.78rem;line-height:1.5}
.padg-list{display:flex;flex-direction:column;max-height:720px;overflow-y:auto;padding-right:.12rem}
.padg-item{position:relative;width:100%;padding:.7rem .78rem .66rem .88rem;margin-bottom:.55rem;border-radius:14px;border:1px solid rgba(20,38,59,.08);background:#fff;text-align:left;cursor:pointer;content-visibility:auto;contain-intrinsic-size:auto 80px}
.padg-item:last-child{margin-bottom:0}
.padg-item.active{border-color:rgba(20,78,114,.35);border-left-width:.28rem;background:rgba(238,245,245,.6)}
.padg-item:before{content:'';position:absolute;left:0;top:.68rem;bottom:.68rem;width:.18rem;border-radius:999px;background:var(--accent,#144e72)}
.padg-item-top{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:space-between}
.padg-item-code,.padg-code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:.76rem;font-weight:800;color:var(--accent,#144e72)}
.padg-item-name{margin:.28rem 0 .2rem;font-size:.88rem;font-weight:700;line-height:1.38;color:var(--ink);word-wrap:break-word;overflow-wrap:break-word;max-width:100%}
.padg-item-meta{color:var(--muted);font-size:.74rem;line-height:1.4}
.padg-item-meta span+span::before{content:'•';margin:0 .4rem;color:rgba(20,38,59,.35)}
.padg-pill{padding:.2rem .45rem;font-size:.68rem;background:rgba(20,38,59,.08);color:var(--ink)}
.padg-inspector{position:relative;top:auto;min-height:720px;display:flex;flex-direction:column}
.padg-inspector-head{padding-bottom:.85rem;border-bottom:1px solid var(--line)}
.padg-inspector-head strong{display:block;margin-top:.35rem;font-size:1rem;font-weight:800;color:#144e72}
.padg-inspector-head span{display:block;margin-top:.28rem;font-size:.9rem;font-weight:800;line-height:1.4}
.padg-inspector-body{display:grid;gap:.75rem;padding-top:.85rem;flex:1;min-height:0;overflow:auto;align-content:start}
.padg-meta{display:flex;flex-wrap:wrap;gap:.45rem}
.padg-meta span{background:rgba(20,38,59,.06);color:var(--ink);font-size:.72rem}
.padg-callout,.padg-note{padding:.76rem .84rem;border-radius:16px;border:1px solid var(--line);line-height:1.62}
.padg-callout{background:rgba(255,255,255,.75)}
.padg-note{background:rgba(238,245,245,.84)}
.padog-analogy{padding:.76rem .84rem;border-radius:16px;border:1px solid rgba(194,120,45,.22);background:linear-gradient(135deg,rgba(255,251,235,.95) 0%,rgba(255,244,220,.95) 100%);line-height:1.62}
.padog-analogy .padg-label{color:#92400e}
.padg-plain{margin:.15rem 0 0;padding-left:1rem;color:var(--muted);font-size:.78rem;line-height:1.6}
.padg-plain li{margin-bottom:.16rem}
.padg-refs{display:flex;flex-wrap:wrap;gap:.4rem}
.padg-ref{border:1px solid rgba(20,38,59,.12);background:rgba(255,255,255,.82);color:var(--ink);font-size:.70rem;cursor:pointer}
.padg-empty{padding:.9rem;border-radius:16px;border:1px dashed rgba(20,38,59,.18);background:rgba(255,255,255,.6);color:var(--muted);text-align:center;line-height:1.55}

/* Modal Styles */
.modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,.56);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem}
.modal-dialog{width:100%;max-width:780px;animation:modalSlideIn .25s ease-out}
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
.modal-scope{display:inline-block;padding:.28rem .55rem;border-radius:999px;background:rgba(20,78,114,.08);color:#144e72;font-size:.72rem;font-weight:700;margin-bottom:.55rem}
.modal-summary{margin:0;color:var(--muted);font-size:.86rem;line-height:1.7}
.modal-artifact-list{list-style:none;margin:0;padding:0;display:grid;gap:.45rem}
.modal-artifact-list li{display:flex;align-items:flex-start;gap:.55rem;padding:.62rem .75rem;border-radius:12px;background:rgba(238,245,245,.5);font-size:.84rem;color:var(--ink);line-height:1.5}
.modal-artifact-list li i{color:#0f766e;font-size:.82rem;margin-top:.18rem;flex-shrink:0}
.modal-requirements{display:flex;flex-wrap:wrap;gap:.45rem}
.modal-req-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.42rem .72rem;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.85);color:var(--ink);font-size:.76rem;font-weight:700;cursor:pointer;transition:border-color .15s ease,background .15s ease,transform .15s ease}
.modal-req-btn i{font-size:.68rem;color:var(--muted);transition:transform .15s ease}
.modal-req-btn:hover{border-color:rgba(20,78,114,.28);background:rgba(238,245,245,.7);transform:translateY(-1px)}
.modal-req-btn:hover i{transform:translateX(2px)}
.modal-empty{padding:.9rem 1rem;border-radius:12px;border:1px dashed rgba(20,38,59,.18);background:rgba(245,247,250,.6);color:var(--muted);text-align:center;font-size:.82rem;line-height:1.5}

/* Modal Transitions */
.modal-fade-enter-active,.modal-fade-leave-active{transition:opacity .2s ease}
.modal-fade-enter-from,.modal-fade-leave-to{opacity:0}
.modal-slide-enter-active{transition:transform .25s ease-out,opacity .25s ease-out}
.modal-slide-leave-active{transition:transform .2s ease-in,opacity .2s ease-in}
.modal-slide-enter-from,.modal-slide-leave-to{transform:translateY(16px) scale(.97);opacity:0}

@media (max-width:1440px){.padg-hero { min-height: 280px; padding: 1.25rem; } .padg-title { font-size: clamp(1.8rem, 3.2vw, 2.5rem); margin: 0.8rem 0 0.5rem; } .padg-metric { min-height: 80px; padding: 0.55rem 0.65rem; } .padg-metric strong { font-size: 1.35rem; } .padg-list, .padg-inspector { min-height: auto; max-height: 520px; }}
@media (max-height:850px) and (min-width:1024px){.padg-hero { min-height: 240px; padding: 1.15rem; } .padg-metrics { margin-top: 0.6rem; } .padg-list, .padg-inspector { max-height: calc(100vh - 280px); } .padg-inspector-body { padding-top: 0.5rem; }}
@media (max-width:1399.98px){.padg-workspace,.padg-refspace{grid-template-columns:1fr}.padg-inspector{position:static;min-height:auto}}
@media (max-width:1199.98px){.padg-hero,.padg-metric,.padg-side{min-height:auto}.padg-hero,.padg-nav,.padg-grid.two,.padg-refspace,.padg-metrics,.padg-mini-row,.padg-cards{grid-template-columns:1fr}.padg-bar,.padg-hotspot,.padg-family{grid-template-columns:1fr}}
@media (max-width:767.98px){.padg-hero,.padg-panel{padding:1.2rem;border-radius:22px}.padg-pillar-grid{grid-template-columns:1fr}.modal-shell{grid-template-columns:1fr}.modal-sidebar{flex-direction:row;padding:1rem;gap:1rem}.modal-sidebar-icon{width:2.5rem;height:2.5rem;margin-bottom:0}.modal-close{top:.5rem;right:.5rem}.modal-dialog{max-width:100%}}
</style>
