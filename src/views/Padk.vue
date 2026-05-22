<template>
  <div class="sej-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading PADK data...</p>
      </div>
    </div>
    <div v-else-if="error" class="error-state">
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Failed to load data</h3>
        <p>{{ error }}</p>
        <button type="button" class="btn btn-primary" @click="loadData">Retry</button>
      </div>
    </div>
    <div v-else class="sej-shell">
      <section class="sej-hero">
        <div>
          <span class="sej-kicker"><i class="fas fa-landmark"></i>Framework Nasional</span>
          <h1 class="sej-title">PADK 1 Tahun 2026 - Penyelenggaraan TI Bank Umum</h1>
          <p class="sej-lede">
            Peraturan Anggota Dewan Komisioner (PADK) No. 1 Tahun 2026 menandai pergeseran paradigma pengawasan OJK dari operasional dasar menuju <strong>Risk-Based & Data-Driven Tech Governance</strong>. Peta kepatuhan ini membedah integrasi postur ketahanan siber, Pelindungan Data Pribadi (PDP), <i>Third-Party Risk Management</i> (TPRM), dan pengetatan yurisdiksi data <i>offshore</i> ke dalam satu kerangka arsitektur kepatuhan yang holistik dan tak terpisahkan.
          </p>
          <div class="sej-metrics">
            <div class="sej-metric"><label>Bab Pedoman</label><strong>{{ substantiveChapters }}</strong><span>Tata kelola TI sampai audit intern TI.</span></div>
            <div class="sej-metric"><label>Kewajiban</label><strong>{{ totalRequirements }}</strong><span>Butir operasional, pelaporan, dan perizinan yang dipetakan.</span></div>
            <div class="sej-metric"><label>Lampiran & Format</label><strong>{{ totalAppendices }}</strong><span>Lampiran I-IV dan format regulator yang relevan.</span></div>
            <div class="sej-metric"><label>Berlaku</label><strong>1 Mar 2026</strong><span>SEOJK 21/2017 dicabut saat PADK mulai berlaku.</span></div>
          </div>
        </div>
        <div class="sej-side-stack">
          <div class="sej-side">
            <label>Strategic Impact</label>
            <h3>Transformasi Kepatuhan & Arsitektur Terintegrasi</h3>
            <p>
              Kepatuhan kini tidak lagi bersifat <i>siloed</i>. PADK mewajibkan <i>board-level accountability</i> atas keselarasan Rencana Strategis TI (RSTI) dengan profil risiko institusi, menuntut visibilitas penuh terhadap <i>supply chain</i> penyedia jasa TI (PPJTI), serta penetapan kontrol mutlak atas lokalisasi, interoperabilitas, dan <i>lifecycle</i> privasi data nasabah.
            </p>
          </div>
          <div class="sej-side">
            <label>Regulatory Milestones</label>
            <p>
              Kerangka waktu kepatuhan menuntut orkestrasi <i>continuous monitoring</i>: <strong>Akhir Nov</strong> (RSTI & LRPTI); <strong>21 Jan</strong> (LKTPTI komprehensif); dan SLA eskalasi insiden ketat (Notifikasi 24 Jam, RCA 5 Hari Kerja). Selain itu, inisiatif <i>offshore processing</i> kini dikunci kuat melalui mekanisme perizinan <i>ex-ante</i> (persetujuan di muka) yang rigid.
            </p>
          </div>
        </div>
      </section>

      <div class="sej-nav nav" role="tablist">
        <button class="sej-tab" :class="{ active: activeTab === 'overview' }" type="button" role="tab" @click="activeTab = 'overview'">
          <i class="fas fa-chart-line"></i><span><strong>Ringkasan Regulasi</strong><span>Pilar, bab pedoman, dan tenggat utama PADK.</span></span>
        </button>
        <button class="sej-tab" :class="{ active: activeTab === 'explorer' }" type="button" role="tab" @click="activeTab = 'explorer'">
          <i class="fas fa-sliders-h"></i><span><strong>Eksplorasi</strong><span>Filter kewajiban dan lihat fokus implementasinya.</span></span>
        </button>
        <button class="sej-tab" :class="{ active: activeTab === 'reference' }" type="button" role="tab" @click="activeTab = 'reference'">
          <i class="fas fa-folder-open"></i><span><strong>Lampiran & Format</strong><span>Board format laporan, notifikasi, izin, dan realisasi.</span></span>
        </button>
      </div>

      <div class="tab-content sej-grid">
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head"><h3>Pilar kewajiban</h3><span class="sej-chip">{{ pillarBreakdown.length }} pilar</span></div>
              <p class="sej-copy">Kelompok ini memisahkan fondasi PADK dari pengelolaan vendor, data, pengawasan, dan kanal regulator.</p>
              <div class="sej-bars">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="sej-bar" @click="jumpExplorer(item.key)">
                  <span><strong>{{ item.label }}</strong><em>{{ item.summary }}</em></span>
                  <span class="sej-track"><b :style="{ width: (item.count / maxPillarCount) * 100 + '%', background: item.color }"></b></span>
                  <span class="sej-num">{{ item.count }}</span>
                </button>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Hotspot bab dan kanal regulator</h3><span class="sej-chip">{{ totalChapters }} area</span></div>
              <p class="sej-copy">Pembacaan lengkap PADK mencakup ketentuan pokok, sembilan bab pedoman, serta Lampiran II untuk pelaporan dan perizinan.</p>
              <div class="sej-hotspots">
                <button v-for="item in chapterBreakdown" :key="item.key" type="button" class="sej-hotspot" @click="jumpExplorer('', item.key)">
                  <span><strong>{{ item.key }}. {{ item.label }}</strong><em>{{ item.summary }}</em></span>
                  <span class="sej-track"><b :style="{ width: (item.count / maxChapterCount) * 100 + '%', background: item.color }"></b></span>
                  <span class="sej-num">{{ item.count }}</span>
                </button>
              </div>
            </article>
          </div>
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head"><h3>Tenggat yang perlu dijaga</h3><span class="sej-chip">Lampiran II</span></div>
              <div class="sej-mini-row">
                <button v-for="item in reportingMoments" :key="item.id" type="button" class="sej-mini" @click="jumpAppendix(item.ref)">
                  <label>{{ item.label }}</label><strong>{{ item.clock }}</strong><span>{{ item.note }}</span>
                </button>
              </div>
              <div class="sej-note">Laporan realisasi untuk izin penempatan sistem elektronik, pemrosesan transaksi luar negeri, dan penyediaan jasa TI disampaikan paling lama 3 bulan setelah implementasi.</div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Peta lampiran</h3><span class="sej-chip">{{ appendixTypeBreakdown.length }} jenis</span></div>
              <p class="sej-copy">PADK menaruh substansi pedoman pada Lampiran I, tata cara pada Lampiran II, format laporan pada Lampiran III, dan format izin atau realisasi pada Lampiran IV.</p>
              <div class="sej-cards">
                <button v-for="item in appendixTypeBreakdown" :key="item.type" type="button" class="sej-card" :style="{ '--accent': item.color }" @click="jumpAppendix('', item.type)">
                  <div class="sej-card-top"><span class="sej-icon"><i class="fas fa-layer-group"></i></span><span>{{ item.count }} entri</span></div>
                  <strong>{{ item.type }}</strong>
                  <p>Buka filter format dan lampiran jenis ini.</p>
                </button>
              </div>
            </article>
          </div>
        </div>

        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="sej-workspace">
            <article class="sej-panel sej-filter-panel">
              <div class="sej-head"><h3>Filter Workspace</h3><span class="sej-chip">{{ totalRequirements }} kewajiban</span></div>
              <div class="sej-pillar-grid">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="sej-pillar" :class="{ active: activePillar === item.key }" :style="{ '--accent': item.color }" @click="togglePillar(item.key)">
                  <strong>{{ item.label }}</strong><span>{{ item.count }} entri</span>
                </button>
              </div>
              <div class="sej-form">
                <div>
                  <label for="padkChapterFilter">Bab</label>
                  <select id="padkChapterFilter" v-model="chapterFilter" class="form-select">
                    <option value="">Semua bab</option>
                    <option v-for="item in chapterBreakdown" :key="item.key" :value="item.key">{{ item.key }}. {{ item.label }}</option>
                  </select>
                </div>
                <div>
                  <label for="padkRequirementSearch">Cari kewajiban</label>
                  <input id="padkRequirementSearch" v-model="requirementSearch" type="search" class="form-control" placeholder="Cari ID, judul, ringkasan, fokus, atau format">
                </div>
                <button type="button" class="btn btn-outline-secondary" @click="resetRequirementFilters">Atur ulang filter</button>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Daftar kewajiban</h3><span class="sej-chip">{{ filteredRequirements.length }} entri</span></div>
              <div class="sej-list">
                <button v-for="req in filteredRequirements" :key="req.id" type="button" class="sej-item" :class="{ active: activeRequirementId === req.id }" :style="{ '--accent': getPillarColor(req.pillar) }" @click="activeRequirementId = req.id">
                  <div class="sej-item-top"><span class="sej-item-code">{{ req.id }}</span><span class="sej-pill">{{ getPillarLabel(req.pillar) }}</span></div>
                  <div class="sej-item-name">{{ req.title }}</div>
                  <div class="sej-item-meta"><span>{{ getChapterLabel(req.chapter) }}</span><span>{{ (req.appendices || []).length }} rujukan</span></div>
                </button>
                <div v-if="filteredRequirements.length === 0" class="sej-empty">Tidak ada kewajiban yang cocok dengan filter saat ini.</div>
              </div>
            </article>
            <article class="sej-panel sej-inspector">
              <div class="sej-inspector-head"><small>Requirement Inspector</small><strong>{{ activeRequirement?.id || '-' }}</strong><span>{{ activeRequirement?.title || 'Pilih kewajiban untuk membaca detail.' }}</span></div>
              <div class="sej-inspector-body">
                <div v-if="activeRole !== 'default' && activeRequirement" class="role-translation-box">
                  <span class="sej-label">
                    <i :class="getRoleIcon(activeRole)" class="me-1"></i> Terjemahan Divisi ({{ getRoleName(activeRole) }})
                  </span>
                  <div class="sej-callout role-callout mt-2">
                    {{ (activeRequirement.roleTranslations && activeRequirement.roleTranslations[activeRole]) ? activeRequirement.roleTranslations[activeRole] : 'Belum ada panduan spesifik untuk divisi ini pada ketentuan ini. Silakan rujuk panduan utama.' }}
                  </div>
                </div>
                <div class="sej-meta"><span>{{ activeRequirement ? getPillarLabel(activeRequirement.pillar) : '-' }}</span><span>{{ activeRequirement ? getChapterLabel(activeRequirement.chapter) : '-' }}</span><span>{{ activeRequirement?.cadence || '-' }}</span><span>{{ activeRequirement ? (activeRequirement.appendices || []).length + ' rujukan' : '0 rujukan' }}</span></div>
                <div class="sej-callout"><span class="sej-label">Ringkasan</span><div class="mt-2">{{ activeRequirement?.summary || '-' }}</div></div>
                <div class="sej-callout"><span class="sej-label">Fokus Implementasi</span><ul class="sej-plain"><li v-for="(item, idx) in activeRequirement?.focus || []" :key="idx">{{ item }}</li></ul></div>
                <div class="sej-callout"><span class="sej-label">Contoh Evidence</span><ul class="sej-plain"><li v-for="(item, idx) in activeRequirement?.evidence || []" :key="idx">{{ item }}</li></ul></div>
                <div class="sej-callout"><span class="sej-label">Lampiran Terkait</span><div class="sej-refs"><button v-for="ref in activeRequirement?.appendices || []" :key="ref" type="button" class="sej-ref" @click="jumpAppendix(ref)">{{ ref }}</button><span v-if="!activeRequirement?.appendices?.length" class="sej-empty w-100">Belum ada rujukan format khusus.</span></div></div>
                <div class="sej-note"><span class="sej-label">Pelaporan / Output</span><div class="mt-2">{{ activeRequirement?.reporting || '-' }}</div></div>
              </div>
            </article>
          </div>
        </div>

        <div v-if="activeTab === 'reference'" key="reference-tab">
          <div class="sej-refspace">
            <article class="sej-panel">
              <div class="sej-head"><h3>Filter lampiran</h3><span class="sej-chip">{{ totalAppendices }} entri</span></div>
              <div class="sej-form">
                <div>
                  <label for="padkAppendixType">Jenis</label>
                  <select id="padkAppendixType" v-model="appendixTypeFilter" class="form-select">
                    <option value="">Semua jenis</option>
                    <option v-for="item in appendixTypeBreakdown" :key="item.type" :value="item.type">{{ item.type }}</option>
                  </select>
                </div>
                <div>
                  <label for="padkAppendixSearch">Cari lampiran</label>
                  <input id="padkAppendixSearch" v-model="appendixSearch" type="search" class="form-control" placeholder="Cari ID, format, judul, atau ruang lingkup">
                </div>
                <button type="button" class="btn btn-outline-secondary" @click="resetAppendixFilters">Atur ulang filter</button>
              </div>
              <div class="sej-summary"><small>Lampiran Ditampilkan</small><strong>{{ filteredAppendices.length }}</strong><span>{{ filteredAppendices.length ? `Menampilkan ${filteredAppendices.length} lampiran dan format PADK sesuai filter.` : 'Tidak ada lampiran yang cocok.' }}</span></div>
              <div class="sej-families mt-3">
                <button v-for="item in appendixTypeBreakdown" :key="item.type" type="button" class="sej-family" :class="{ active: appendixTypeFilter === item.type }" @click="appendixTypeFilter = appendixTypeFilter === item.type ? '' : item.type">
                  <span><strong>{{ item.type }}</strong><em>{{ item.count }} entri</em></span><span class="sej-num">{{ item.count }}</span>
                </button>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Board lampiran</h3><span class="sej-chip">{{ filteredAppendices.length }} entri</span></div>
              <div class="sej-list">
                <button v-for="app in filteredAppendices" :key="app.id" type="button" class="sej-item" @click="openAppendix(app)">
                  <div class="sej-item-top"><span class="sej-item-code">{{ app.id }}</span><span class="sej-pill">{{ app.type }}</span></div>
                  <div class="sej-item-name">{{ app.title }}</div>
                  <div class="sej-item-meta"><span>{{ app.scope }}</span><span>{{ (app.used_by || []).length }} kewajiban</span></div>
                </button>
                <div v-if="filteredAppendices.length === 0" class="sej-empty">Tidak ada lampiran yang cocok dengan filter saat ini.</div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Transition name="modal-fade">
    <div v-if="selectedAppendix" class="modal-overlay" @click.self="selectedAppendix = null">
      <div class="modal-dialog">
        <div class="modal-shell">
          <div class="modal-sidebar" :style="{ background: `linear-gradient(180deg, ${getAppendixColor(selectedAppendix.type)} 0%, ${getAppendixColor(selectedAppendix.type, 0.72)} 100%)` }">
            <button type="button" class="modal-close" aria-label="Close" @click="selectedAppendix = null"><i class="fas fa-times"></i></button>
            <div class="modal-sidebar-icon"><i class="fas fa-file-alt"></i></div>
            <div class="modal-sidebar-id">{{ selectedAppendix.id }}</div>
            <div class="modal-sidebar-type">{{ selectedAppendix.type }}</div>
          </div>
          <div class="modal-main">
            <div class="modal-header"><h4 class="modal-title">{{ selectedAppendix.title }}</h4></div>
            <div class="modal-body">
              <section class="modal-section">
                <div class="modal-section-header" :style="{ color: getAppendixColor(selectedAppendix.type) }"><i class="fas fa-info-circle"></i><span>Ringkasan</span></div>
                <div class="modal-scope">{{ selectedAppendix.scope }}</div>
                <p class="modal-summary">{{ selectedAppendix.summary }}</p>
              </section>
              <section class="modal-section">
                <div class="modal-section-header" :style="{ color: getAppendixColor(selectedAppendix.type) }"><i class="fas fa-list-check"></i><span>Isi Utama</span></div>
                <ul class="modal-artifact-list"><li v-for="(item, idx) in selectedAppendix.contains || []" :key="idx"><i class="fas fa-check-circle"></i><span>{{ item }}</span></li></ul>
              </section>
              <section class="modal-section">
                <div class="modal-section-header" :style="{ color: getAppendixColor(selectedAppendix.type) }"><i class="fas fa-link"></i><span>Kewajiban Terkait</span></div>
                <div class="modal-requirements">
                  <button v-for="reqId in selectedAppendix.used_by || []" :key="reqId" type="button" class="modal-req-btn" @click="jumpToRequirement(reqId)"><i class="fas fa-arrow-right"></i><span>{{ reqId }}</span></button>
                  <div v-if="!selectedAppendix.used_by?.length" class="modal-empty">Format ini belum dipetakan ke kewajiban khusus.</div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { mapState } from 'pinia';
import { useFrameworkStore } from '../stores/frameworkStore';

export default {
  name: 'Padk',
  data() {
    return {
      loading: true,
      error: null,
      activeTab: 'overview',
      requirements: [],
      appendices: [],
      activePillar: '',
      chapterFilter: '',
      requirementSearch: '',
      activeRequirementId: null,
      appendixTypeFilter: '',
      appendixSearch: '',
      selectedAppendix: null,
      pillarMeta: {
        Foundation: { label: 'Ketentuan Pokok', color: '#1d4ed8', summary: 'Landasan PADK, transisi, keberlakuan, dan posisi terhadap POJK PTI.' },
        Governance: { label: 'Tata Kelola TI', color: '#0f766e', summary: 'Arsitektur, strategi, peran pengurus, satuan kerja, dan kontrol dasar TI.' },
        RiskSecurity: { label: 'Risiko & Keamanan', color: '#a16207', summary: 'Proses risiko TI, pengamanan informasi, jaringan, DRP, dan audit.' },
        ThirdParty: { label: 'PPJTI & Lokasi', color: '#c2410c', summary: 'Penggunaan penyedia jasa, penempatan sistem, dan pemrosesan transaksi.' },
        DataPrivacy: { label: 'Data & PDP', color: '#7c3aed', summary: 'Pengelolaan data, kualitas data, dan pelindungan data pribadi.' },
        Services: { label: 'Jasa TI Bank', color: '#0891b2', summary: 'Penyediaan jasa TI oleh Bank kepada lembaga jasa keuangan lain.' },
        Reporting: { label: 'Pelaporan & Izin', color: '#b91c1c', summary: 'RSTI, LRPTI, LKTPTI, insiden nonsiber, izin, dan laporan realisasi.' },
      },
      chapterMeta: {
        Pokok: { label: 'Ketentuan Pokok', color: '#1d4ed8', summary: 'Pasal 1 sampai Pasal 5 PADK.' },
        I: { label: 'Pendahuluan', color: '#0f766e', summary: 'Ruang lingkup pedoman dan rujukan POJK PTI.' },
        II: { label: 'Tata Kelola TI', color: '#0f766e', summary: 'Faktor, aspek, peran, dan satuan kerja TI.' },
        III: { label: 'Arsitektur TI', color: '#2563eb', summary: 'Arsitektur TI dan rencana strategis TI.' },
        IV: { label: 'Manajemen Risiko TI', color: '#a16207', summary: 'Risiko TI, pengamanan informasi, jaringan, dan DRP.' },
        V: { label: 'Penggunaan PPJTI', color: '#c2410c', summary: 'Vendor TI, kontrak, pengawasan, dan materialitas.' },
        VI: { label: 'Penempatan & Pemrosesan', color: '#b45309', summary: 'Lokasi sistem elektronik dan transaksi berbasis TI.' },
        VII: { label: 'Data & Pelindungan Data', color: '#7c3aed', summary: 'Data governance dan pemrosesan data pribadi.' },
        VIII: { label: 'Penyediaan Jasa TI', color: '#0891b2', summary: 'Bank sebagai penyedia jasa TI.' },
        IX: { label: 'Pengendalian & Audit', color: '#144e72', summary: 'SPI, audit trail, dan fungsi audit intern TI.' },
        LII: { label: 'Pelaporan & Perizinan', color: '#b91c1c', summary: 'Tata cara penyampaian laporan, izin, dan realisasi.' },
      },
      appendixTypePalette: {
        'Lampiran PADK': '#144e72',
        'Format Laporan': '#0f766e',
        'Format LKTPTI': '#1d4ed8',
        'Format Notifikasi': '#b91c1c',
        'Format Perizinan': '#c2410c',
      },
      reportingMoments: [
        { id: 'rsti', label: 'RSTI & LRPTI', clock: 'Akhir Nov', note: 'Sebelum periode awal atau tahun rencana dimulai.', ref: 'LAMP.II' },
        { id: 'lktpti', label: 'LKTPTI', clock: '21 Jan', note: 'Tahun berikutnya melalui sistem pelaporan OJK.', ref: 'F3.2' },
        { id: 'incident', label: 'Insiden Nonsiber', clock: '24 jam', note: 'Notifikasi awal, lalu laporan 5 hari kerja.', ref: 'F3.4.1' },
      ],
    };
  },
  computed: {
    ...mapState(useFrameworkStore, ["activeRole"]),
    totalRequirements() { return this.requirements.length; },
    totalAppendices() { return this.appendices.length; },
    totalChapters() { return new Set(this.requirements.map(item => item.chapter).filter(Boolean)).size; },
    substantiveChapters() { return this.requirements.some(item => item.chapter === 'I') ? 9 : 0; },
    activeRequirement() { return this.requirements.find(item => item.id === this.activeRequirementId) || null; },
    pillarBreakdown() {
      return Object.entries(this.pillarMeta)
        .map(([key, meta]) => ({ key, ...meta, count: this.requirements.filter(item => item.pillar === key).length }))
        .filter(item => item.count > 0);
    },
    chapterBreakdown() {
      return Object.entries(this.chapterMeta)
        .map(([key, meta]) => ({ key, ...meta, count: this.requirements.filter(item => item.chapter === key).length }))
        .filter(item => item.count > 0);
    },
    maxPillarCount() { return Math.max(...this.pillarBreakdown.map(item => item.count), 1); },
    maxChapterCount() { return Math.max(...this.chapterBreakdown.map(item => item.count), 1); },
    appendixTypeBreakdown() {
      const grouped = this.appendices.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = { type: item.type, count: 0, color: this.appendixTypePalette[item.type] || '#144e72' };
        acc[item.type].count += 1;
        return acc;
      }, {});
      return Object.values(grouped).sort((a, b) => b.count - a.count);
    },
    filteredRequirements() {
      const query = this.requirementSearch.trim().toLowerCase();
      return this.requirements.filter(item => {
        if (this.activePillar && item.pillar !== this.activePillar) return false;
        if (this.chapterFilter && item.chapter !== this.chapterFilter) return false;
        if (!query) return true;
        return [item.id, item.title, item.summary, item.reporting, ...(item.focus || []), ...(item.appendices || [])].join(' ').toLowerCase().includes(query);
      });
    },
    filteredAppendices() {
      const query = this.appendixSearch.trim().toLowerCase();
      return this.appendices.filter(item => {
        if (this.appendixTypeFilter && item.type !== this.appendixTypeFilter) return false;
        if (!query) return true;
        return [item.id, item.type, item.title, item.scope, item.summary].join(' ').toLowerCase().includes(query);
      });
    },
  },
  methods: {
    getRoleIcon(roleId) {
      const store = useFrameworkStore();
      const role = store.roles.find((r) => r.id === roleId);
      return role ? 'fas ' + role.icon : 'fas fa-eye';
    },
    getRoleName(roleId) {
      const store = useFrameworkStore();
      const role = store.roles.find((r) => r.id === roleId);
      return role ? role.label : roleId;
    },
    getPillarColor(key) { return this.pillarMeta[key]?.color || '#144e72'; },
    getPillarLabel(key) { return this.pillarMeta[key]?.label || key || '-'; },
    getChapterLabel(key) { return `${key || '-'}${this.chapterMeta[key] ? `. ${this.chapterMeta[key].label}` : ''}`; },
    togglePillar(key) { this.activePillar = this.activePillar === key ? '' : key; },
    resetRequirementFilters() { this.activePillar = ''; this.chapterFilter = ''; this.requirementSearch = ''; },
    resetAppendixFilters() { this.appendixTypeFilter = ''; this.appendixSearch = ''; },
    jumpExplorer(pillar = '', chapter = '') { this.activePillar = pillar; this.chapterFilter = chapter; this.requirementSearch = ''; this.activeTab = 'explorer'; },
    jumpAppendix(id = '', type = '') { this.appendixSearch = id; this.appendixTypeFilter = type; this.activeTab = 'reference'; },
    openAppendix(item) { this.selectedAppendix = item; },
    jumpToRequirement(id) {
      const item = this.requirements.find(req => req.id === id);
      if (!item) return;
      this.selectedAppendix = null;
      this.activeRequirementId = id;
      this.jumpExplorer(item.pillar, item.chapter);
    },
    getAppendixColor(type, opacity = 1) {
      const color = this.appendixTypePalette[type] || '#144e72';
      if (opacity === 1) return color;
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    async loadData() {
      try {
        this.loading = true;
        this.error = null;
        const [reqRes, appRes] = await Promise.all([
          fetch(`/data/padk_1_2026_requirements.json?t=${new Date().getTime()}`),
          fetch(`/data/padk_1_2026_appendices.json?t=${new Date().getTime()}`),
        ]);
        if (!reqRes.ok) throw new Error(`Failed to load PADK requirements: HTTP ${reqRes.status}`);
        if (!appRes.ok) throw new Error(`Failed to load PADK appendices: HTTP ${appRes.status}`);
        this.requirements = await reqRes.json();
        this.appendices = await appRes.json();
        this.activeRequirementId = this.requirements[0]?.id || null;
      } catch (error) {
        console.error('Error loading PADK data:', error);
        this.error = error.message || 'Failed to load PADK data';
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
.sej-page{--ink:#14263b;--muted:#5c6776;--line:rgba(20,38,59,.1);color:var(--ink);padding:.25rem;border-radius:32px;background:linear-gradient(180deg,#f6efe3 0%,#edf5f6 100%)}
.sej-shell,.sej-grid,.sej-bars,.sej-hotspots,.sej-cards,.sej-families{display:grid;gap:1rem}.sej-grid.two{grid-template-columns:1.06fr .94fr}
.sej-hero{display:grid;grid-template-columns:1.55fr .92fr;gap:1.2rem;min-height:368px;padding:1.45rem;border-radius:28px;background:radial-gradient(circle at top right,rgba(248,214,161,.88),transparent 30%),radial-gradient(circle at bottom left,rgba(156,210,219,.7),transparent 28%),linear-gradient(135deg,#132a43 0%,#1f5f78 46%,#f2debb 100%);box-shadow:0 20px 44px rgba(15,23,42,.09)}
.sej-kicker,.sej-chip,.sej-pill,.sej-meta span,.sej-ref{display:inline-flex;align-items:center;gap:.35rem;border-radius:999px;font-weight:700}.sej-kicker{padding:.35rem .7rem;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;text-transform:uppercase;letter-spacing:.08em}
.sej-title{margin:1rem 0 .7rem;color:#fffaf2;font-size:clamp(2rem,3.8vw,3rem);font-weight:800;line-height:1.04}.sej-lede{margin:0;max-width:720px;color:rgba(255,250,242,.82);line-height:1.7}
.sej-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:.65rem;margin-top:1.1rem}.sej-metric,.sej-side,.sej-panel,.sej-mini{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,251,245,.98),rgba(246,251,252,.98));box-shadow:0 14px 28px rgba(15,23,42,.05)}
.sej-metric{min-height:96px;padding:.68rem .74rem;border-radius:16px;background:rgba(255,250,242,.12);border-color:rgba(255,255,255,.18)}.sej-metric label,.sej-side label,.sej-mini label,.sej-form label,.sej-inspector small,.sej-label{display:block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.sej-metric label{color:rgba(255,250,242,.7)}.sej-metric strong{display:block;color:#fffaf2;font-size:1.5rem;font-weight:800}.sej-metric span{display:block;color:rgba(255,250,242,.72);font-size:.76rem;line-height:1.4}.sej-side-stack{display:grid;gap:.85rem}
.sej-side,.sej-panel{border-radius:20px;padding:1rem}.sej-side{min-height:142px;padding:.8rem .86rem;background:rgba(255,250,242,.78);border-color:rgba(255,255,255,.24)}.sej-side label,.sej-copy,.sej-form label,.sej-item-meta,.sej-mini label,.sej-mini span{color:var(--muted)}
.sej-side h3,.sej-head h3{margin:0;font-size:1rem;font-weight:800}.sej-side p,.sej-copy{margin:.55rem 0 0;font-size:.84rem;line-height:1.6}.sej-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}
.sej-tab{display:grid;grid-template-columns:auto 1fr;gap:.72rem;align-items:center;padding:.82rem .88rem;border:1px solid var(--line);border-radius:18px;background:linear-gradient(180deg,rgba(255,250,242,.94),rgba(239,245,246,.94));color:var(--ink);text-align:left;box-shadow:0 12px 24px rgba(15,23,42,.04)}.sej-tab.active{border-color:rgba(20,78,114,.24);box-shadow:0 18px 30px rgba(20,78,114,.1)}
.sej-tab i{width:2.35rem;height:2.35rem;display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(20,38,59,.06)}.sej-tab strong{display:block;font-size:.9rem;font-weight:800}.sej-tab span{display:block;margin-top:.14rem;color:var(--muted);font-size:.76rem;line-height:1.4}
.sej-head{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin-bottom:.7rem}.sej-chip,.sej-pill,.sej-meta span,.sej-ref{padding:.24rem .52rem;background:rgba(20,38,59,.08);color:var(--ink);font-size:.7rem;line-height:1.2}.sej-copy{margin:0 0 .85rem}
.sej-bar,.sej-hotspot,.sej-family{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(180px,1fr) auto;gap:.68rem;align-items:center;padding:.62rem .72rem;border:1px solid transparent;border-radius:16px;background:rgba(255,255,255,.55);color:var(--ink);text-align:left}.sej-family{grid-template-columns:1fr auto}.sej-bar strong,.sej-hotspot strong,.sej-family strong{display:block;font-size:.86rem}.sej-bar em,.sej-hotspot em,.sej-family em{display:block;color:var(--muted);font-size:.74rem;font-style:normal}
.sej-track{height:.44rem;border-radius:999px;background:rgba(20,38,59,.08);overflow:hidden}.sej-track b{display:block;height:100%;border-radius:inherit}.sej-num{min-width:2rem;text-align:right;font-weight:800}.sej-cards{grid-template-columns:repeat(3,1fr);gap:.65rem}
.sej-card{padding:.76rem .8rem;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.75);color:var(--ink);text-align:left}.sej-card-top{display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:.64rem;font-weight:700;text-transform:uppercase}.sej-icon{width:1.9rem;height:1.9rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(20,78,114,.12);color:var(--accent,#144e72)}.sej-card strong{display:block;margin-top:.42rem}.sej-card p{margin:.22rem 0 0;color:var(--muted);font-size:.72rem}
.sej-mini-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.65rem}.sej-mini{padding:.72rem .78rem;border-radius:16px;color:var(--ink);text-align:left}.sej-mini strong{display:block;margin-top:.2rem;color:#144e72;font-size:1.04rem;font-weight:800}.sej-mini span{display:block;margin-top:.14rem;font-size:.72rem;line-height:1.4}.sej-note,.sej-callout{padding:.76rem .84rem;border:1px solid var(--line);border-radius:16px;line-height:1.62}.sej-note{margin-top:.8rem;background:rgba(238,245,245,.84)}.sej-callout{background:rgba(255,255,255,.75)}
.sej-workspace{display:grid;grid-template-columns:.85fr 1.15fr;gap:1rem}.sej-filter-panel{grid-column:1/-1}.sej-refspace{display:grid;grid-template-columns:.82fr 1.18fr;gap:1rem}.sej-pillar-grid{display:flex;flex-wrap:wrap;gap:.55rem;margin-bottom:.8rem}.sej-pillar{flex:1 1 auto;padding:.62rem .68rem;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.75);color:var(--ink);text-align:left}.sej-pillar.active{border-color:rgba(20,78,114,.24);background:rgba(238,245,245,.72)}.sej-pillar strong{display:block;color:var(--accent);font-size:.82rem}.sej-pillar span{display:block;color:var(--muted);font-size:.74rem}
.sej-form{display:flex;align-items:flex-end;gap:.75rem}.sej-form>div{flex:1}.sej-list{display:flex;flex-direction:column;max-height:720px;overflow-y:auto;padding-right:.12rem}.sej-item{position:relative;width:100%;margin-bottom:.55rem;padding:.7rem .78rem .66rem .88rem;border:1px solid rgba(20,38,59,.08);border-radius:14px;background:#fff;color:var(--ink);text-align:left}.sej-item.active{border-color:rgba(20,78,114,.35);background:rgba(238,245,245,.6)}.sej-item:before{content:'';position:absolute;left:0;top:.68rem;bottom:.68rem;width:.18rem;border-radius:999px;background:var(--accent,#144e72)}.sej-item-top{display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap}.sej-item-code{color:var(--accent,#144e72);font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:.76rem;font-weight:800}.sej-item-name{margin:.28rem 0 .2rem;font-size:.88rem;font-weight:700}.sej-item-meta{font-size:.74rem}.sej-item-meta span+span:before{content:' | ';color:rgba(20,38,59,.4)}
.sej-inspector{min-height:720px;display:flex;flex-direction:column}.sej-inspector-head{padding-bottom:.85rem;border-bottom:1px solid var(--line)}.sej-inspector-head strong,.modal-title{display:block;margin-top:.35rem;color:#144e72;font-size:1rem;font-weight:800}.sej-inspector-head span{display:block;margin-top:.28rem;font-size:.9rem;font-weight:800}.sej-inspector-body{display:grid;gap:.75rem;padding-top:.85rem;overflow:auto}.sej-meta,.sej-refs{display:flex;flex-wrap:wrap;gap:.45rem}.sej-plain{margin:.15rem 0 0;padding-left:1rem;color:var(--muted);font-size:.78rem}.sej-empty{padding:.9rem;border:1px dashed rgba(20,38,59,.18);border-radius:16px;background:rgba(255,255,255,.6);color:var(--muted);text-align:center}
.sej-summary{margin-top:.85rem;padding:.82rem .88rem;border-radius:18px;background:linear-gradient(180deg,rgba(25,61,87,.95),rgba(20,78,114,.95));color:#fffaf2}.sej-summary small,.modal-sidebar-type,.modal-section-header{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.sej-summary strong{display:block;font-size:1.72rem}.sej-summary span{display:block;color:rgba(255,250,242,.78);font-size:.78rem}
.modal-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(15,23,42,.56)}.modal-dialog{width:100%;max-width:780px}.modal-shell{display:grid;grid-template-rows:auto minmax(0, 1fr);max-height:85vh;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 64px rgba(15,23,42,.24),0 8px 24px rgba(15,23,42,.12)}.modal-sidebar{position:relative;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:.85rem;padding:1rem 1.5rem;color:#fffaf2;text-align:left;flex-shrink:0}.modal-close{position:absolute;top:50%;transform:translateY(-50%);right:1.25rem;width:2.2rem;height:2.2rem;display:flex;align-items:center;justify-content:center;border:0;border-radius:12px;background:rgba(255,255,255,.2);color:#fff;cursor:pointer;transition:all .2s ease}.modal-sidebar-icon{width:2.4rem;height:2.4rem;display:flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(255,255,255,.2);font-size:1.05rem;margin-bottom:0}.modal-sidebar-id{font-size:1.1rem;font-weight:800;margin-bottom:0}.modal-main{display:grid;grid-template-rows:auto minmax(0, 1fr);overflow:hidden}.modal-header{padding:1.15rem 1.5rem 1rem;border-bottom:1px solid var(--line)}.modal-body{padding:1.25rem 1.5rem;overflow-y:auto}.modal-section{margin-bottom:1.25rem}.modal-section-header{display:flex;gap:.55rem;padding-bottom:.5rem;margin-bottom:.65rem;border-bottom:1px solid var(--line)}.modal-scope{display:inline-block;margin-bottom:.55rem;padding:.28rem .55rem;border-radius:999px;background:rgba(20,78,114,.08);color:#144e72;font-size:.72rem;font-weight:700}.modal-summary{margin:0;color:var(--muted);font-size:.86rem;line-height:1.7}.modal-artifact-list{display:grid;gap:.45rem;list-style:none;margin:0;padding:0}.modal-artifact-list li{display:flex;gap:.55rem;padding:.62rem .75rem;border-radius:12px;background:rgba(238,245,245,.5);font-size:.84rem}.modal-artifact-list i{margin-top:.18rem;color:#0f766e}.modal-requirements{display:flex;flex-wrap:wrap;gap:.45rem}.modal-req-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.42rem .72rem;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.85);color:var(--ink);font-size:.76rem;font-weight:700}.modal-empty{padding:.9rem 1rem;border:1px dashed rgba(20,38,59,.18);border-radius:12px;color:var(--muted)}
.modal-fade-enter-active,.modal-fade-leave-active{transition:opacity .2s ease}.modal-fade-enter-from,.modal-fade-leave-to{opacity:0}
[data-bs-theme="dark"] .sej-page{--ink:#f8fafc;--muted:#94a3b8;--line:rgba(255,255,255,.1);background:linear-gradient(180deg,#0f172a,#1e293b)}[data-bs-theme="dark"] .sej-metric,[data-bs-theme="dark"] .sej-side,[data-bs-theme="dark"] .sej-panel,[data-bs-theme="dark"] .sej-mini,[data-bs-theme="dark"] .sej-tab,[data-bs-theme="dark"] .sej-item,[data-bs-theme="dark"] .sej-pillar,[data-bs-theme="dark"] .sej-card,[data-bs-theme="dark"] .sej-callout{background:rgba(30,41,59,.65);border-color:rgba(255,255,255,.1)}[data-bs-theme="dark"] .sej-note,[data-bs-theme="dark"] .sej-item.active,[data-bs-theme="dark"] .sej-pillar.active{background:rgba(30,41,59,.88);border-color:var(--accent,#48cae4)}[data-bs-theme="dark"] .modal-shell{display:grid;grid-template-rows:auto minmax(0, 1fr);max-height:85vh;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 64px rgba(15,23,42,.24),0 8px 24px rgba(15,23,42,.12)}[data-bs-theme="dark"] .modal-artifact-list li{background:rgba(255,255,255,.05)}
@media (max-width:991.98px){.sej-workspace,.sej-refspace{grid-template-columns:1fr}.sej-inspector{min-height:auto}}@media (max-width:1199.98px){.sej-hero,.sej-nav,.sej-grid.two,.sej-metrics,.sej-mini-row,.sej-cards{grid-template-columns:1fr}.sej-bar,.sej-hotspot{grid-template-columns:1fr}}@media (max-width:767.98px){.sej-hero,.sej-panel{padding:1.2rem;border-radius:22px}.sej-form{flex-direction:column;align-items:stretch}.modal-shell{display:grid;grid-template-rows:auto minmax(0, 1fr);max-height:85vh;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 64px rgba(15,23,42,.24),0 8px 24px rgba(15,23,42,.12)}.modal-sidebar{position:relative;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:.85rem;padding:1rem 1.5rem;color:#fffaf2;text-align:left;flex-shrink:0}.sej-list,.sej-inspector-body{max-height:none;overflow:visible}}
</style>
