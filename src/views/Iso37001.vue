<template>
  <div class="iso-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading ISO 37001 data...</p>
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
          <h1 class="iso-title">ISO 37001:2016 ABMS Studio</h1>
          <p class="iso-lede">Ruang kerja praktis buat membaca sistem manajemen anti-penyuapan tanpa harus menelan dokumen standar mentah-mentah. Fokusnya ke konteks risiko, kepemimpinan, due diligence, kontrol keuangan/non-keuangan, pelaporan, investigasi, audit, dan bukti yang biasanya dicari saat persiapan sertifikasi atau audit internal.</p>
          <div class="iso-metric-grid">
            <div class="iso-metric"><label>Requirement Areas</label><strong>{{ totalControls }}</strong><span>Butir ringkasan yang bisa ditelusuri end-to-end.</span></div>
            <div class="iso-metric"><label>Categories</label><strong>{{ domainBreakdown.length }}</strong><span>Konteks, kepemimpinan, dukungan, operasi, dan evaluasi.</span></div>
            <div class="iso-metric"><label>Critical Priorities</label><strong>{{ criticalControls }}</strong><span>Area yang paling butuh sequencing implementasi.</span></div>
            <div class="iso-metric"><label>Evidence Cues</label><strong>{{ evidenceCount }}</strong><span>Contoh bukti audit yang bisa jadi titik mulai.</span></div>
          </div>
        </div>
        <div class="iso-side-stack">
          <div class="iso-side-card">
            <label>Recommended Review Flow</label>
            <div class="iso-bullets">
              <div><i class="fas fa-circle"></i><span>Mulai dari kategori dan prioritas untuk melihat area anti-penyuapan yang paling perlu perhatian.</span></div>
              <div><i class="fas fa-circle"></i><span>Gunakan Eksplorasi untuk menyaring butir, membaca interpretasi, dan menyiapkan contoh bukti audit.</span></div>
              <div><i class="fas fa-circle"></i><span>Gunakan Konsep Kepatuhan untuk melihat apakah program sudah kuat di govern, prevent, detect, respond, dan improve.</span></div>
            </div>
          </div>
          <div class="iso-disclaimer-banner">
            <div class="iso-disclaimer-icon"><i class="fas fa-info-circle"></i></div>
            <div class="iso-disclaimer-content">
              <strong>Disclaimer:</strong>
              <span>Konten ini adalah ringkasan edukatif dan interpretasi mandiri dari rujukan SNI/ISO 37001:2016 yang diberikan. Ini <b>bukan</b> teks resmi ISO/BSN, bukan pengganti standar berlisensi, dan tidak dimaksudkan sebagai nasihat hukum. ISO 37001:2016 juga telah memiliki versi penerus; untuk teks otoritatif dan versi terkini, silakan rujuk <a href="https://www.iso.org/standard/37001" target="_blank" rel="noopener noreferrer">ISO.org</a> atau <a href="https://www.bsn.go.id" target="_blank" rel="noopener noreferrer">BSN</a>.</span>
            </div>
          </div>
        </div>
      </section>

      <div class="nav iso-nav" role="tablist">
        <button class="iso-tab" :class="{ active: activeTab === 'overview' }" type="button" role="tab" @click="activeTab = 'overview'"><i class="fas fa-chart-line"></i><div><strong>Ringkasan Program</strong><span>Pulse, distribusi kategori, dan profil prioritas.</span></div></button>
        <button class="iso-tab" :class="{ active: activeTab === 'explorer' }" type="button" role="tab" @click="activeTab = 'explorer'"><i class="fas fa-sliders-h"></i><div><strong>Eksplorasi</strong><span>Filter panel, daftar kontrol, dan inspector detail.</span></div></button>
        <button class="iso-tab" :class="{ active: activeTab === 'concept' }" type="button" role="tab" @click="activeTab = 'concept'"><i class="fas fa-project-diagram"></i><div><strong>Konsep Kepatuhan</strong><span>Lima lensa untuk membaca kekuatan program anti-penyuapan.</span></div></button>
      </div>

      <div class="tab-content">
        <!-- Tab 1: Ringkasan Program -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="iso-grid two">
            <article class="iso-panel">
              <div class="iso-panel-head"><h3>Distribusi per kategori</h3><span class="iso-chip">Klik kategori untuk filter</span></div>
              <p class="iso-panel-copy">Kategori ini merapikan butir ISO 37001 ke dalam alur kerja yang lebih mudah dibaca: pahami risiko, tetapkan kepemimpinan, siapkan dukungan, jalankan kontrol, lalu evaluasi dan perbaiki.</p>
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
              <div class="iso-panel-head"><h3>Konsep kepatuhan</h3><span class="iso-chip">Snapshot</span></div>
              <p class="iso-panel-copy">Pemetaan konsep kepatuhan disajikan sebagai lensa tambahan agar organisasi bisa melihat keseimbangan antara tata kelola, pencegahan, deteksi, respons, dan perbaikan.</p>
              <div class="iso-concept-board">
                <div v-for="concept in conceptBreakdown" :key="concept.name" class="iso-mini" :style="{ '--accent': concept.color }"><label><i :class="`fas ${concept.icon} me-1`"></i>{{ concept.key }}</label><strong>{{ concept.count }}</strong><span>{{ concept.name }}</span></div>
              </div>
            </article>
            <article class="iso-panel">
              <div class="iso-panel-head"><h3>Cara pakai halaman ini</h3><span class="iso-chip">Workflow</span></div>
              <p class="iso-panel-copy"><strong>Mulai dari overview.</strong> Identifikasi kategori dengan kepadatan kontrol tertinggi dan prioritas implementasi yang paling menonjol.</p>
              <p class="iso-panel-copy"><strong>Pindah ke explorer.</strong> Filter kontrol yang relevan, lalu baca detail untuk bukti audit dan tips implementasi.</p>
              <p class="iso-panel-copy mb-0"><strong>Validasi dengan konsep kepatuhan.</strong> Gunakan lensa Govern, Prevent, Detect, Respond, dan Improve untuk melihat area program yang masih timpang.</p>
            </article>
          </div>
        </div>

        <!-- Tab 2: Eksplorasi -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="iso-workspace">
            <aside class="iso-panel iso-filter-panel" style="position: sticky; top: 1rem;">
              <div class="iso-panel-head"><h3>Filter Workspace</h3></div>
              <div class="iso-quick-themes mb-3">
                <button v-for="domain in domainBreakdown" :key="domain.name" type="button" class="iso-quick-theme" :style="{ '--accent': domain.color }" @click="filterTheme = domain.name"><strong>{{ domain.name }}</strong><span>{{ domain.count }} butir</span></button>
              </div>
              <div class="iso-form-grid">
                <div><label for="filter-theme">Kategori</label><select id="filter-theme" v-model="filterTheme" class="form-select"><option value="All">Semua kategori</option><option v-for="d in domainBreakdown" :key="d.name" :value="d.name">{{ d.name }}</option></select></div>
                <div><label for="filter-type">Jenis kontrol</label><select id="filter-type" v-model="filterType" class="form-select"><option value="All">Semua jenis</option><option v-for="t in typeBreakdown" :key="t.name" :value="t.name">{{ t.name }}</option></select></div>
                <div><label for="filter-prio">Prioritas</label><select id="filter-prio" v-model="filterPrio" class="form-select"><option value="All">Semua prioritas</option><option v-for="p in priorityBreakdown" :key="p.name" :value="p.name">{{ p.name }}</option></select></div>
                <div><label for="filter-diff">Kesulitan</label><select id="filter-diff" v-model="filterDiff" class="form-select"><option value="All">Semua tingkat</option><option value="Rendah">Rendah</option><option value="Sedang">Sedang</option><option value="Tinggi">Tinggi</option></select></div>
                <div><label for="filter-search">Cari kontrol</label><input type="text" id="filter-search" v-model="filterSearch" class="form-control" placeholder="Cari ID, nama, atau capability"></div>
                <button class="btn btn-outline-dark" type="button" @click="resetFilters"><i class="fas fa-rotate-left me-2"></i>Reset filter</button>
              </div>
            </aside>
            <section class="iso-panel">
              <div class="iso-panel-head"><h3>Daftar kontrol</h3><span class="iso-chip">Klik untuk buka inspector</span></div>
              <div class="iso-list">
                <button v-for="ctrl in paginatedControls" :key="ctrl.id" type="button" class="iso-item" :class="{ active: explorerState.selectedId === ctrl.id }" :style="{ '--accent': getDomainColor(ctrl.domain) }" @click="explorerState.selectedId = ctrl.id"><div class="iso-item-top"><span class="iso-item-code">{{ ctrl.id }}</span><span class="iso-pill" :class="[`compact`, getPillClass(ctrl.priority)]">{{ ctrl.priority || '-' }}</span></div><div class="iso-item-name">{{ ctrl.name || '-' }}</div><div class="iso-item-meta-line"><span>{{ ctrl.domain || '-' }}</span><span>{{ ctrl.type || '-' }}</span><span>{{ ctrl.difficulty || '-' }}</span></div></button>
                <div v-if="paginatedControls.length === 0" class="iso-empty">Tidak ada butir yang cocok dengan filter saat ini.</div>
                
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
              <div class="iso-detail-head"><small>Requirement Inspector</small><strong>{{ selectedExplorerControl?.id || 'Pilih sebuah butir' }}</strong><span>{{ selectedExplorerControl?.name || 'Klik butir di daftar untuk membuka deskripsi, interpretasi, bukti audit, dan tips implementasi.' }}</span></div>
              <div class="iso-detail-body" v-if="selectedExplorerControl">
                <div class="iso-detail-meta"><span class="iso-detail-meta-item"><small>Kategori</small><strong>{{ selectedExplorerControl.domain || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Jenis</small><strong>{{ selectedExplorerControl.type || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Prioritas</small><strong>{{ selectedExplorerControl.priority || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Kesulitan</small><strong>{{ selectedExplorerControl.difficulty || '-' }}</strong></span></div>
                
                <div v-if="activeRole !== 'default' && selectedExplorerControl" class="role-translation-box">
                  <span class="iso-detail-label">
                    <i :class="getRoleIcon(activeRole)" class="me-1"></i> Terjemahan Divisi ({{ getRoleName(activeRole) }})
                  </span>
                  <div class="iso-callout role-callout">
                    {{ (selectedExplorerControl.roleTranslations && selectedExplorerControl.roleTranslations[activeRole]) ? selectedExplorerControl.roleTranslations[activeRole] : 'Belum ada panduan spesifik untuk divisi ini. Silakan rujuk panduan utama.' }}
                  </div>
                </div>

                <div><span class="iso-detail-label">Interpretasi ringkas</span><div class="iso-callout">{{ selectedExplorerControl.description || '-' }}</div></div>
                <div><span class="iso-detail-label"><i class="fas fa-lightbulb me-1"></i>Analogi</span><div class="iso-note">{{ selectedExplorerControl.analogy || '-' }}</div></div>
                <div><span class="iso-detail-label">Contoh bukti audit</span><ul class="iso-evidence-list"><li v-for="(item, idx) in (selectedExplorerControl.exampleEvidence && selectedExplorerControl.exampleEvidence.length ? selectedExplorerControl.exampleEvidence : ['Belum ada contoh bukti audit untuk kontrol ini.'])" :key="idx">{{ item }}</li></ul></div>
                <div><span class="iso-detail-label">Tips implementasi</span><div class="iso-callout">{{ selectedExplorerControl.implementationTips || '-' }}</div></div>
                <div><span class="iso-detail-label">Konsep dan capability</span><div class="mt-2"><span class="iso-chip">{{ selectedExplorerControl.concept || 'Tidak ada data tambahan' }}</span><span class="iso-chip" v-if="selectedExplorerControl.capability">{{ selectedExplorerControl.capability }}</span></div></div>
              </div>
              <div v-else class="iso-empty">Belum ada kontrol yang dipilih.</div>
            </section>
          </div>
        </div>

        <!-- Tab 3: Konsep Kepatuhan -->
        <div v-if="activeTab === 'concept'" key="concept-tab">
          <div class="iso-grid">
            <section class="iso-panel">
              <div class="iso-panel-head"><h3>Konsep Kepatuhan</h3><span class="iso-chip">Pilih lensa</span></div>
              <p class="iso-panel-copy">Lensa ini membantu membaca ISO 37001 sebagai program operasional: siapa mengatur, apa yang dicegah, bagaimana red flag ditemukan, bagaimana kasus ditangani, dan bagaimana sistem diperbaiki.</p>
              <div class="iso-concept-board">
                <button v-for="concept in conceptBreakdown" :key="concept.name" type="button" class="iso-tile" :class="{ active: conceptState.active === concept.name }" :style="{ '--accent': concept.color }" @click="conceptState.active = conceptState.active === concept.name ? null : concept.name; conceptState.selectedId = null;"><div class="iso-tile-top"><span class="iso-tile-icon"><i :class="`fas ${concept.icon}`"></i></span><span>{{ getConceptControlCount(concept.name) }} butir</span></div><strong>{{ concept.name }}</strong><p>{{ concept.summary }}</p></button>
              </div>
            </section>
            <div v-if="!conceptState.active" class="iso-empty">Pilih salah satu konsep di atas untuk menampilkan kontrol terkait dan inspector detailnya.</div>
            <div v-else>
              <div class="iso-grid">
                <div class="iso-selected" :style="{ '--accent': getConceptColor(conceptState.active) }"><div class="iso-selected-mark"><i :class="`fas ${getConceptIcon(conceptState.active)}`"></i></div><div><small>{{ getConceptKey(conceptState.active) }}</small><h3>{{ conceptState.active }}</h3><p>{{ getConceptSummary(conceptState.active) }}</p></div><div class="iso-selected-count"><strong>{{ conceptFilteredControls.length }}</strong><span>mapped items</span></div></div>
                <div class="iso-concept-workspace">
                  <section class="iso-panel iso-inspector-panel">
                    <div class="iso-panel-head"><h3>Kontrol terkait</h3><span class="iso-chip">Auto-filterd by concept</span></div>
                    <div class="iso-list">
                      <button v-for="ctrl in conceptFilteredControls" :key="ctrl.id" type="button" class="iso-item" :class="{ active: conceptState.selectedId === ctrl.id }" :style="{ '--accent': getDomainColor(ctrl.domain) }" @click="conceptState.selectedId = ctrl.id"><div class="iso-item-top"><span class="iso-item-code">{{ ctrl.id }}</span><span class="iso-pill" :class="[`compact`, getPillClass(ctrl.priority)]">{{ ctrl.priority || '-' }}</span></div><div class="iso-item-name">{{ ctrl.name || '-' }}</div><div class="iso-item-meta-line"><span>{{ ctrl.domain || '-' }}</span><span>{{ ctrl.type || '-' }}</span><span>{{ ctrl.difficulty || '-' }}</span></div></button>
                      <div v-if="conceptFilteredControls.length === 0" class="iso-empty">Belum ada butir yang dipetakan ke konsep ini.</div>
                    </div>
                  </section>
                  <section class="iso-panel">
                    <div class="iso-detail-head"><small>Inspektor Konsep</small><strong>{{ selectedConceptControl?.id || 'Pilih sebuah butir' }}</strong><span>{{ selectedConceptControl?.name || 'Klik butir dari konsep yang dipilih untuk membaca detail lengkap.' }}</span></div>
                    <div class="iso-detail-body" v-if="selectedConceptControl">
                      <div class="iso-detail-meta"><span class="iso-detail-meta-item"><small>Kategori</small><strong>{{ selectedConceptControl.domain || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Jenis</small><strong>{{ selectedConceptControl.type || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Prioritas</small><strong>{{ selectedConceptControl.priority || '-' }}</strong></span><span class="iso-detail-meta-item"><small>Kesulitan</small><strong>{{ selectedConceptControl.difficulty || '-' }}</strong></span></div>

                      <div v-if="activeRole !== 'default' && selectedConceptControl" class="role-translation-box">
                        <span class="iso-detail-label">
                          <i :class="getRoleIcon(activeRole)" class="me-1"></i> Terjemahan Divisi ({{ getRoleName(activeRole) }})
                        </span>
                        <div class="iso-callout role-callout">
                          {{ (selectedConceptControl.roleTranslations && selectedConceptControl.roleTranslations[activeRole]) ? selectedConceptControl.roleTranslations[activeRole] : 'Belum ada panduan spesifik untuk divisi ini. Silakan rujuk panduan utama.' }}
                        </div>
                      </div>

                      <div><span class="iso-detail-label">Interpretasi ringkas</span><div class="iso-callout">{{ selectedConceptControl.description || '-' }}</div></div>
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
import { mapState } from 'pinia';
import { useFrameworkStore } from '../stores/frameworkStore';

export default {
  name: 'Iso37001',
  data() {
    return {
      loading: true,
      error: null,
      activeTab: 'overview',
      controls: [],
      domainMeta: {
        'Konteks & Risiko': { id: 'CTX', color: '#0f766e', summary: 'Konteks organisasi, scope, dan penilaian risiko penyuapan.' },
        'Kepemimpinan': { id: 'LED', color: '#2563eb', summary: 'Komitmen pimpinan, kebijakan, peran, dan fungsi kepatuhan.' },
        'Dukungan': { id: 'SUP', color: '#a16207', summary: 'Resource, kompetensi, training, komunikasi, dan dokumen.' },
        'Operasi': { id: 'OPS', color: '#c2410c', summary: 'Due diligence, kontrol transaksi, pihak ketiga, pelaporan, dan investigasi.' },
        'Evaluasi & Peningkatan': { id: 'EVL', color: '#1d3557', summary: 'Monitoring, audit internal, tinjauan, CAPA, dan continual improvement.' },
      },
      typeMeta: { 'Pencegahan': { color: '#0f766e' }, 'Deteksi': { color: '#a16207' }, 'Koreksi': { color: '#c2410c' } },
      priorityMeta: { 'Kritis': { color: '#b91c1c' }, 'Tinggi': { color: '#c2410c' }, 'Sedang': { color: '#2563eb' }, 'Rendah': { color: '#15803d' } },
      conceptMeta: {
        'Mengatur': { key: 'Govern', color: '#1d3557', icon: 'fa-sitemap', summary: 'Menetapkan arah, akuntabilitas, scope, sasaran, dan pengawasan program.' },
        'Mencegah': { key: 'Prevent', color: '#0f766e', icon: 'fa-shield-alt', summary: 'Menutup peluang suap melalui kebijakan, due diligence, approval, dan kontrol operasional.' },
        'Mendeteksi': { key: 'Detect', color: '#a16207', icon: 'fa-binoculars', summary: 'Menangkap red flag dari monitoring, audit, pelaporan, dan review kepatuhan.' },
        'Merespons': { key: 'Respond', color: '#b91c1c', icon: 'fa-bolt', summary: 'Mengambil keputusan saat kontrol tidak cukup, laporan masuk, atau dugaan penyuapan muncul.' },
        'Meningkatkan': { key: 'Improve', color: '#15803d', icon: 'fa-chart-line', summary: 'Memperbaiki kelemahan, menutup akar masalah, dan menjaga sistem tetap relevan.' },
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
    ...mapState(useFrameworkStore, ['activeRole']),
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
    getRoleIcon(roleId) {
      const icons = { 'bod': 'fa-user-tie', 'sysadmin': 'fa-terminal', 'legal': 'fa-balance-scale' };
      return icons[roleId] || 'fa-eye';
    },
    getRoleName(roleId) {
      const names = { 'bod': 'Board of Directors', 'sysadmin': 'SysAdmin', 'legal': 'Legal / GRC' };
      return names[roleId] || roleId;
    },
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
        // Tambahkan timestamp untuk menghindari cache agresif browser pada file statis di public/
        const response = await fetch(`/data/iso37001.json?t=${new Date().getTime()}`);
        if (response.ok) {
          const data = await response.json();
          this.controls = Array.isArray(data) ? data : data.controls || [];
          if (this.controls.length > 0) this.explorerState.selectedId = this.controls[0].id;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error loading ISO 37001 data:', error);
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

<style scoped src="../assets/css/iso-control-studio.css"></style>

