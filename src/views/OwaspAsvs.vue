<template>
  <div class="sej-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading OWASP ASVS data...</p>
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
    <div v-else class="sej-shell">
      <section class="sej-hero">
        <div>
          <span class="sej-kicker"><i class="fas fa-check-double"></i>Framework Studio</span>
          <h1 class="sej-title">OWASP ASVS 5.0.0 Verifier</h1>
          <p class="sej-lede">Level up your app security testing! Halaman ini membedah OWASP ASVS 5.0.0 jadi checklist verifikasi yang komprehensif. Dari pengujian Level 1 sampai Level 3, lo bisa review kriteria keamanan secara mendalam sesuai risk appetite aplikasi lo. No more guessing, pure systematic security validation.</p>
          <div class="sej-metrics">
            <div class="sej-metric"><label>Kategori</label><strong>{{ totalChapters }}</strong><span>Area verifikasi dan tipe pengamanan.</span></div>
            <div class="sej-metric"><label>Komponen Uji</label><strong>{{ totalRequirements }}</strong><span>Kriteria keamanan operasional ASVS.</span></div>
            <div class="sej-metric"><label>Tingkatan</label><strong>{{ totalAppendices }}</strong><span>Level keamanan dari L1 hingga L3.</span></div>
            <div class="sej-metric"><label>Versi Rilis</label><strong>5.0.0</strong><span>Draft verifikasi terbaru dari OWASP.</span></div>
          </div>
        </div>
        <div class="sej-side-stack">
          <div class="sej-side"><label>Alur Verifikasi</label><h3>Pendekatan validasi keamanan kontrol</h3><p>Evaluasi aplikasi dengan menelusuri persyaratan teknis ASVS berdasarkan kategori arsitektur maupun operasi. Tiap persyaratan teknis menunjuk ke Level keamanan apa yang menuntut persyaratan tersebut.</p></div>
          <div class="sej-side" style="background: rgba(255, 230, 200, 0.78)"><label><i class="fab fa-creative-commons me-1"></i>Hak Cipta & Lisensi</label><p style="margin-top:0.4rem; font-size:0.8rem">Konten bersumber dari <strong>OWASP Foundation</strong> dan dilisensikan di bawah <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" style="color:#b45309; font-weight:700;">Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)</a>. Penggunaan sepenuhnya ditujukan untuk eksplorasi dan referensi verifikasi mandiri.</p></div>
        </div>
      </section>

      <div class="sej-nav nav" role="tablist">
        <button class="sej-tab" :class="{ active: activeTab === 'overview' }" type="button" role="tab" @click="activeTab = 'overview'"><i class="fas fa-chart-line"></i><span><strong>Ringkasan Program</strong><span>Peta domain keamanan & kontrol ASVS.</span></span></button>
        <button class="sej-tab" :class="{ active: activeTab === 'explorer' }" type="button" role="tab" @click="activeTab = 'explorer'"><i class="fas fa-sliders-h"></i><span><strong>Eksplorasi</strong><span>Filter kriteria pengujian dan prasyarat ASVS V1-V17.</span></span></button>
        <button class="sej-tab" :class="{ active: activeTab === 'reference' }" type="button" role="tab" @click="activeTab = 'reference'"><i class="fas fa-folder-open"></i><span><strong>Level & Referensi</strong><span>Detail persyaratan Level L1, L2, L3.</span></span></button>
      </div>

      <div class="tab-content sej-grid">
        <!-- Tab 1: Ringkasan Program -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head"><h3>Lanskap arsitektur keamanan</h3><span class="sej-chip">{{ pillarBreakdown.length }} pilar</span></div>
              <p class="sej-copy">Pilar ini membagi standar verifikasi keamanan ke dalam kelompok operasional dan arsitektur kontrol utama. Klik salah satu bar untuk langsung lompat ke eksplorasi kriteria pengujian dengan filter yang relevan.</p>
              <div class="sej-bars">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="sej-bar" @click="jumpExplorer(item.key)"><span><strong>{{ item.label }}</strong><em>{{ item.summary }}</em></span><span class="sej-track"><b :style="{ width: (item.count / maxPillarCount) * 100 + '%', background: item.color }"></b></span><span class="sej-num">{{ item.count }}</span></button>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Hotspot kategori verifikasi</h3><span class="sej-chip">{{ totalChapters }} kategori</span></div>
              <p class="sej-copy">Semakin tinggi nilai bar, semakin banyak klausul pemeriksaan dalam pengujian area tersebut (mis. komponen arsitektur vs bisnis logika).</p>
              <div class="sej-hotspots">
                <button v-for="item in chapterBreakdown" :key="item.key" type="button" class="sej-hotspot" @click="jumpExplorer('', item.key)"><span><strong>{{ item.key }}. {{ item.label }}</strong><em>{{ item.summary }}</em></span><span class="sej-track"><b :style="{ width: (item.count / maxChapterCount) * 100 + '%', background: item.color }"></b></span><span class="sej-num">{{ item.count }}</span></button>
              </div>
            </article>
          </div>
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head"><h3>Level verifikasi (L1 - L3)</h3><span class="sej-chip">Tingkatan uji</span></div>
              <div class="sej-mini-row">
                <div class="sej-mini"><label>Level 1</label><strong>First Steps</strong><span>Untuk aplikasi dengan tingkat risiko rendah. Dapat diuji secara otomatis atau black-box.</span></div>
                <div class="sej-mini"><label>Level 2</label><strong>Standard Risk</strong><span>Disarankan untuk kebanyakan aplikasi web yang memproses data sensitif umum.</span></div>
                <div class="sej-mini"><label>Level 3</label><strong>Advanced Risk</strong><span>Untuk sistem transaksional kritis tinggi (seperti medis, finansial, atau infrastruktur).</span></div>
              </div>
              <div class="sej-note">Pengujian ASVS mensyaratkan akses mendalam. Level 2 ke atas menuntut hybrid antara automation tooling, manual pentest, threat modeling, serta review arsitektur secara langsung (white-box).</div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Peta tingkat & referensi</h3><span class="sej-chip">{{ totalAppendices }} referensi</span></div>
              <p class="sej-copy">Bagian ini memetakan setiap persyaratan keamanan ke tingkat kedalaman ASVS yang relevan (L1, L2, atau L3) untuk menjadi acuan standar saat membangun atau menguji sistem.</p>
              <div class="sej-cards">
                <button v-for="item in appendixTypeBreakdown" :key="item.type" type="button" class="sej-card" :style="{ '--accent': item.color }" @click="jumpAppendix('', item.type)"><div class="sej-card-top"><span class="sej-icon"><i class="fas fa-layer-group"></i></span><span>{{ item.count }} lampiran</span></div><strong>{{ item.type }}</strong><p>Lompat ke board lampiran dengan filter jenis ini.</p></button>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 2: Eksplorasi -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="sej-workspace">
            <article class="sej-panel sej-filter-panel">
              <div class="sej-head"><h3>Filter Verifikasi</h3><span class="sej-chip">{{ totalRequirements }} kriteria</span></div>
              <div class="sej-pillar-grid">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="sej-pillar" :class="{ active: activePillar === item.key }" :style="{ '--accent': item.color }" @click="togglePillar(item.key)"><strong>{{ item.label }}</strong><span>{{ item.count }} kriteria verifikasi</span></button>
              </div>
              <div class="sej-form">
                <div><label for="chapterFilter">Kategori</label><select id="chapterFilter" v-model="chapterFilter" class="form-select"><option value="">Semua</option><option v-for="ch in chapterBreakdown" :key="ch.key" :value="ch.key">{{ ch.key }}: {{ ch.label }}</option></select></div>
                <div><label for="requirementSearch">Cari spesifik</label><input id="requirementSearch" v-model="requirementSearch" type="search" class="form-control" placeholder="Cari validation, password, session"></div>
                <button type="button" class="btn btn-outline-secondary" @click="resetRequirementFilters">Atur ulang filter</button>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Daftar Kriteria Verifikasi</h3><span class="sej-chip">{{ filteredRequirements.length }} entri</span></div>
              <div class="sej-list">
                <button v-for="req in filteredRequirements" :key="req.id" type="button" class="sej-item" :class="{ active: activeRequirementId === req.id }" :style="{ '--accent': getPillarColor(req.pillar) }" @click="setActiveRequirement(req.id)"><div class="sej-item-top"><span class="sej-item-code">{{ req.id }}</span><span class="sej-pill">{{ getPillarLabel(req.pillar) }}</span></div><div class="sej-item-name">{{ req.title || '-' }}</div><div class="sej-item-meta"><span>{{ getChapterLabel(req.chapter).replace('. ', '') }}</span><span>Tingkat Level: {{ (req.appendices || []).join(', ') }}</span></div></button>
                <div v-if="filteredRequirements.length === 0" class="sej-empty">Kerentanan tidak ditemukan.</div>
              </div>
            </article>
            <article class="sej-panel sej-inspector">
              <div class="sej-inspector-head"><small>Verification Inspector</small><strong>{{ activeRequirement ? activeRequirement.id : '-' }}</strong><span>{{ activeRequirement ? activeRequirement.title : 'Pilih kriteria untuk membaca detail.' }}</span></div>
              <div class="sej-inspector-body">
                <div class="sej-meta"><span>{{ activeRequirement ? getPillarLabel(activeRequirement.pillar) : '-' }}</span><span>{{ activeRequirement ? activeRequirement.chapter_title : '-' }}</span><span>{{ activeRequirement ? activeRequirement.cadence || '-' : '-' }}</span><span>Syarat Level: {{ activeRequirement ? (activeRequirement.appendices || []).join(', ') : '0' }}</span></div>
                <div class="sej-callout"><span class="sej-label">Ringkasan Konteks</span><div class="mt-2">{{ activeRequirement ? activeRequirement.summary : 'Pilih kriteria untuk membaca tujuan verifikasi pengujian ini.' }}</div></div>
                <div class="sej-note"><span class="sej-label"><i class="fas fa-lightbulb me-1"></i>Analogi Verifikasi</span><div class="mt-2">{{ activeRequirement ? activeRequirement.analogy : '-' }}</div></div>
                <div class="sej-callout"><span class="sej-label">Aksi Verifikasi Kepatuhan</span><ul class="sej-plain"><li v-for="(item, idx) in (activeRequirement && activeRequirement.focus && activeRequirement.focus.length ? activeRequirement.focus : ['Tidak ada instruksi langkah pengujian spesifik.'])" :key="idx">{{ item }}</li></ul></div>
                <div class="sej-callout"><span class="sej-label">Bukti Evidence Validasi</span><ul class="sej-plain"><li v-for="(item, idx) in (activeRequirement && activeRequirement.evidence && activeRequirement.evidence.length ? activeRequirement.evidence : ['Bebas dari skenario gagal.'])" :key="idx">{{ item }}</li></ul></div>
                <div class="sej-callout"><span class="sej-label">Persyaratan ASVS Tingkat Lanjut</span><div class="sej-refs"><button v-for="ref in (activeRequirement?.appendices || [])" :key="ref" type="button" class="sej-ref" @click="jumpAppendix(ref)">Lihat Detail {{ ref }}</button><span v-if="!activeRequirement || !activeRequirement.appendices || !activeRequirement.appendices.length" class="sej-empty w-100">Cacat ini tidak dikaitkan dengan klasifikasi Level ASVS.</span></div></div>
                <div class="sej-note"><span class="sej-label">Skoring Pentest (Target Lulus)</span><div class="mt-2">{{ activeRequirement ? (activeRequirement.scoring || '-') : '-' }}</div></div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 3: Lampiran & Laporan -->
        <div v-if="activeTab === 'reference'" key="reference-tab">
          <div class="sej-refspace">
            <article class="sej-panel">
              <div class="sej-head"><h3>Filter lampiran</h3><span class="sej-chip">{{ totalAppendices }} lampiran</span></div>
              <div class="sej-form">
                <div><label for="appendixTypeFilter">Jenis Lampiran</label><select id="appendixTypeFilter" v-model="appendixTypeFilter" class="form-select"><option value="">Semua jenis</option><option v-for="item in appendixTypeBreakdown" :key="item.type" :value="item.type">{{ item.type }}</option></select></div>
                <div><label for="appendixSearch">Cari lampiran</label><input id="appendixSearch" v-model="appendixSearch" type="search" class="form-control" placeholder="Cari ID, judul, jenis, atau scope"></div>
                <button type="button" class="btn btn-outline-secondary" @click="resetAppendixFilters">Atur ulang filter</button>
              </div>
              <div class="sej-families mt-3">
                <button v-for="item in appendixTypeBreakdown" :key="item.type" type="button" class="sej-family" :class="{ active: appendixTypeFilter === item.type }" :style="{ '--accent': item.color }" @click="appendixTypeFilter = appendixTypeFilter === item.type ? '' : item.type"><span><strong>{{ item.type }}</strong><em>{{ item.count }} lampiran</em></span><span class="sej-num">{{ item.count }}</span></button>
              </div>
              <div class="sej-note mt-3"><span class="sej-label">Panduan Pelaksanaan</span>Pengelompokan persyaratan ke klasifikasi tingkat keamanan ini akan memudahkan tim QA maupun audit independen menyesuaikan scope pengujian berdasar kelas risiko aplikasinya.</div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Board lampiran</h3><span class="sej-chip">{{ filteredAppendices.length }} entri</span></div>
              <div class="sej-list">
                <button v-for="app in filteredAppendices" :key="app.id" type="button" class="sej-item" @click="openAppendixModal(app)"><div class="sej-item-top"><span class="sej-item-code">{{ app.id }}</span><span class="sej-pill">{{ app.type }}</span></div><div class="sej-item-name">{{ app.title || '-' }}</div><div class="sej-item-meta"><span>{{ (app.used_by || []).length }} requirement</span></div></button>
                <div v-if="filteredAppendices.length === 0" class="sej-empty">Tidak ada lampiran yang cocok dengan filter saat ini.</div>
              </div>
            </article>
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
                    <span>Artefak / Isi Utama</span>
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
                    <span>Requirement yang Menggunakannya</span>
                  </div>
                  <div class="modal-section-content">
                    <div class="modal-requirements">
                      <button v-for="reqId in (selectedAppendix?.used_by || [])" :key="reqId" type="button" class="modal-req-btn" @click="jumpToRequirement(reqId)">
                        <i class="fas fa-arrow-right"></i>
                        <span>{{ reqId }}</span>
                      </button>
                      <div v-if="!selectedAppendix?.used_by || !selectedAppendix.used_by.length" class="modal-empty">
                        Belum ada requirement yang dipetakan ke lampiran ini.
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
  name: 'OwaspAsvs',
  data() {
    return {
      loading: true,
      error: null,
      activeTab: 'overview',
      requirements: [],
      appendices: [],
      pillarMeta: {
        'Architecture': { label: 'Arsitektur & Coding', color: '#1d4ed8', icon: 'fa-sitemap', summary: 'Tata letak, desain, dan prinsip coding aman.' },
        'Authentication': { label: 'Akses & Identitas', color: '#b91c1c', icon: 'fa-user-shield', summary: 'Login, sesi, otorisasi, dan token (OAuth/JWT).' },
        'Validation': { label: 'Validasi & Logika', color: '#a16207', icon: 'fa-filter', summary: 'Filter masukan, logika bisnis, dan sanitasi.' },
        'Data Protection': { label: 'Proteksi Data', color: '#7c3aed', icon: 'fa-database', summary: 'Kriptografi, privasi, dan penyimpanan aman.' },
        'Communication': { label: 'Jaringan & Media', color: '#0f766e', icon: 'fa-network-wired', summary: 'SSL/TLS, WebRTC, dan tunnel network.' },
        'Security Operations': { label: 'Operasi & Audit', color: '#144e72', icon: 'fa-clipboard-check', summary: 'Logging, error handling, dan monitoring.' },
      },
      chapterMeta: {
        'V1': { label: 'Encoding & Sanitization', color: '#1d4ed8', icon: 'fa-broom', summary: 'Pencegahan injeksi teknis.' },
        'V2': { label: 'Validation & Logic', color: '#b91c1c', icon: 'fa-check-double', summary: 'Input & alur bisnis.' },
        'V3': { label: 'Web Frontend', color: '#c2410c', icon: 'fa-window-maximize', summary: 'Keamanan sisi browser.' },
        'V4': { label: 'API & Web Service', color: '#a16207', icon: 'fa-plug', summary: 'REST, GraphQL, & WebSocket.' },
        'V5': { label: 'File Handling', color: '#0f766e', icon: 'fa-file-upload', summary: 'Upload & download aman.' },
        'V6': { label: 'Authentication', color: '#7c3aed', icon: 'fa-id-card', summary: 'Verifikasi identitas.' },
        'V7': { label: 'Session Management', color: '#144e72', icon: 'fa-clock', summary: 'Siklus hidup sesi.' },
        'V8': { label: 'Authorization', color: '#b45309', icon: 'fa-user-lock', summary: 'Kontrol hak akses.' },
        'V9': { label: 'Self-contained Tokens', color: '#10b981', icon: 'fa-ticket-alt', summary: 'JWT & Stateless token.' },
        'V10': { label: 'OAuth & OIDC', color: '#6366f1', icon: 'fa-users-cog', summary: 'Delegasi akses pihak ketiga.' },
        'V11': { label: 'Cryptography', color: '#4f46e5', icon: 'fa-key', summary: 'Enkripsi & manajemen kunci.' },
        'V12': { label: 'Secure Communication', color: '#0d9488', icon: 'fa-shield-alt', summary: 'TLS & Network security.' },
        'V13': { label: 'Configuration', color: '#ea580c', icon: 'fa-cogs', summary: 'Hardening & secret mgmt.' },
        'V14': { label: 'Data Protection', color: '#9333ea', icon: 'fa-vault', summary: 'Privasi & klasifikasi data.' },
        'V15': { label: 'Architecture & Coding', color: '#2563eb', icon: 'fa-layer-group', summary: 'Desain & prinsip aman.' },
        'V16': { label: 'Logging & Error', color: '#1e293b', icon: 'fa-list-alt', summary: 'Audit trail & penanganan error.' },
        'V17': { label: 'WebRTC', color: '#dc2626', icon: 'fa-video', summary: 'Komunikasi real-time.' },
      },
      appendixTypePalette: {
        'Tingkat Keamanan': '#0f766e',
        'Dokumen Standar': '#b91c1c',
      },
      activePillar: '',
      chapterFilter: '',
      requirementSearch: '',
      activeRequirementId: null,
      appendixTypeFilter: '',
      appendixSearch: '',
      showAppendixModal: false,
      selectedAppendix: null,
      reportingSla: 15,
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
    appendixTypeBreakdown() {
      const grouped = this.appendices.reduce((acc, a) => {
        if (!a.type) return acc;
        if (!acc[a.type]) acc[a.type] = { type: a.type, count: 0, color: this.appendixTypePalette[a.type] || '#144e72' };
        acc[a.type].count++;
        return acc;
      }, {});
      return Object.values(grouped).sort((a, b) => b.count - a.count);
    },
    filteredRequirements() {
      const query = (this.requirementSearch || '').trim().toLowerCase();
      return this.requirements.filter(req => {
        if (this.activePillar && req.pillar !== this.activePillar) return false;
        if (this.chapterFilter && req.chapter !== this.chapterFilter) return false;
        if (!query) return true;
        return [req.id, req.title, req.summary, req.chapter_title, this.pillarMeta[req.pillar]?.label, ...(req.appendices || []), ...(req.focus || [])].join(' ').toLowerCase().includes(query);
      });
    },
    filteredAppendices() {
      const query = (this.appendixSearch || '').trim().toLowerCase();
      return this.appendices.filter(a => {
        if (this.appendixTypeFilter && a.type !== this.appendixTypeFilter) return false;
        if (!query) return true;
        return [a.id, a.type, a.title, a.scope].join(' ').toLowerCase().includes(query);
      });
    },
    activeRequirement() { return this.requirements.find(r => r.id === this.activeRequirementId) || null; },
  },
  methods: {
    getPillarColor(p) { return this.pillarMeta[p]?.color || '#144e72'; },
    getPillarLabel(p) { return this.pillarMeta[p]?.label || p || '-'; },
    getChapterLabel(c) { return (c || '-') + '. ' + (this.chapterMeta[c]?.label || ''); },
    togglePillar(p) { this.activePillar = this.activePillar === p ? '' : p; },
    resetRequirementFilters() { this.activePillar = ''; this.chapterFilter = ''; this.requirementSearch = ''; },
    resetAppendixFilters() { this.appendixTypeFilter = ''; this.appendixSearch = ''; },
    setActiveRequirement(id) { this.activeRequirementId = id; },
    jumpExplorer(pillar = '', chapter = '') {
      this.activePillar = pillar || '';
      this.chapterFilter = chapter || '';
      this.requirementSearch = '';
      this.activeTab = 'explorer';
    },
    jumpAppendix(id = '', type = '') {
      this.appendixTypeFilter = type || '';
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
      // Convert hex to rgba with opacity
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
          fetch('/data/owasp_asvs_reqs.json'),
          fetch('/data/owasp_asvs_apps.json')
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
        console.error('Error loading OWASP data:', error);
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
.sej-page{--ink:#14263b;--muted:#5c6776;--line:rgba(20,38,59,.1);--shell:linear-gradient(180deg,#f6efe3 0%,#edf5f6 100%);color:var(--ink);padding:.25rem;border-radius:32px;background:var(--shell)}
.sej-shell{display:grid;gap:1rem}
.sej-hero{display:grid;grid-template-columns:1.55fr .92fr;gap:1.2rem;align-items:stretch;min-height:368px;padding:1.45rem;border-radius:28px;overflow:hidden;position:relative;background:radial-gradient(circle at top right,rgba(248,214,161,.88),transparent 30%),radial-gradient(circle at bottom left,rgba(156,210,219,.7),transparent 28%),linear-gradient(135deg,#132a43 0%,#1f5f78 46%,#f2debb 100%);box-shadow:0 20px 44px rgba(15,23,42,.09)}
.sej-hero>*{position:relative;z-index:1}
.sej-kicker{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem .7rem;border-radius:999px;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.sej-title{margin:1rem 0 .7rem;color:#fffaf2;font-size:clamp(2rem,3.8vw,3rem);font-weight:800;line-height:1.04}
.sej-lede{margin:0;max-width:720px;color:rgba(255,250,242,.82);line-height:1.7}
.sej-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:.65rem;margin-top:1.1rem}
.sej-metric,.sej-side,.sej-panel,.sej-mini{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,251,245,.98) 0%,rgba(246,251,252,.98) 100%);box-shadow:0 14px 28px rgba(15,23,42,.05)}
.sej-metric{padding:.68rem .74rem;border-radius:16px;background:rgba(255,250,242,.12);border-color:rgba(255,255,255,.18);min-height:96px;display:flex;flex-direction:column;justify-content:flex-start}
.sej-metric label,.sej-side label,.sej-mini label,.sej-form label,.sej-inspector small,.sej-label{display:block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.sej-metric label{color:rgba(255,250,242,.7);margin-bottom:.35rem}
.sej-metric strong{display:block;color:#fffaf2;font-size:1.5rem;font-weight:800;line-height:1}
.sej-metric span{display:block;margin-top:.34rem;color:rgba(255,250,242,.72);font-size:.76rem}
.sej-side-stack{display:grid;gap:.85rem}
.sej-side{padding:.8rem .86rem;border-radius:18px;background:rgba(255,250,242,.78);border-color:rgba(255,255,255,.24);min-height:142px}
.sej-side label{color:var(--muted);margin-bottom:.4rem}
.sej-side h3{margin:0;font-size:1rem;font-weight:800}
.sej-side p{margin:.55rem 0 0;color:var(--muted);line-height:1.55;font-size:.84rem}
.sej-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}
.sej-tab{display:grid;grid-template-columns:auto 1fr;gap:.72rem;align-items:center;padding:.82rem .88rem;border-radius:18px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,250,242,.94) 0%,rgba(239,245,246,.94) 100%);text-align:left;color:var(--ink);box-shadow:0 12px 24px rgba(15,23,42,.04);cursor:pointer}
.sej-tab.active{border-color:rgba(20,78,114,.24);box-shadow:0 18px 30px rgba(20,78,114,.1)}
.sej-tab i{width:2.35rem;height:2.35rem;display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(20,38,59,.06)}
.sej-tab strong{display:block;font-size:.9rem;font-weight:800}
.sej-tab span{display:block;margin-top:.14rem;color:var(--muted);font-size:.76rem;line-height:1.4}
.sej-grid{display:grid;gap:1rem}
.sej-grid.two{grid-template-columns:1.06fr .94fr}
.sej-panel{padding:1rem;border-radius:20px}
.sej-head{display:flex;align-items:center;justify-content:space-between;gap:.85rem;margin-bottom:.7rem}
.sej-head h3{margin:0;font-size:.98rem;font-weight:800}
.sej-chip,.sej-pill,.sej-meta span,.sej-ref{display:inline-flex;align-items:center;gap:.3rem;padding:.24rem .52rem;border-radius:999px;font-size:.7rem;font-weight:700;line-height:1.2}
.sej-chip{background:rgba(20,38,59,.08);color:var(--ink)}
.sej-copy{margin:0 0 .85rem;color:var(--muted);line-height:1.6;font-size:.84rem}
.sej-bars,.sej-cards,.sej-hotspots,.sej-families{display:grid;gap:.65rem}
.sej-bar,.sej-hotspot,.sej-family{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(180px,1fr) auto;gap:.68rem;align-items:center;padding:.62rem .72rem;border-radius:16px;border:1px solid transparent;background:rgba(255,255,255,.55);text-align:left;cursor:pointer;transition:border-color .15s ease,transform .15s ease,box-shadow .15s ease}
.sej-family{grid-template-columns:1fr auto}
.sej-bar:hover,.sej-hotspot:hover,.sej-family:hover,.sej-bar.active,.sej-hotspot.active,.sej-family.active{transform:translateY(-1px);border-color:rgba(20,78,114,.22);box-shadow:0 12px 22px rgba(20,78,114,.08)}
.sej-bar strong,.sej-hotspot strong,.sej-family strong{display:block;font-size:.86rem}
.sej-bar em,.sej-hotspot em,.sej-family em{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem;font-style:normal}
.sej-track{height:.44rem;border-radius:999px;background:rgba(20,38,59,.08);overflow:hidden}
.sej-track b{display:block;height:100%;border-radius:inherit}
.sej-num{min-width:2.2rem;text-align:right;font-weight:800}
.sej-cards{grid-template-columns:repeat(3,1fr)}
.sej-card{width:100%;padding:.76rem .8rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer}
.sej-card-top{display:flex;align-items:center;justify-content:space-between;gap:.55rem;color:var(--muted);font-size:.64rem;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
.sej-icon{width:1.9rem;height:1.9rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(20,78,114,.12);color:var(--accent);font-size:.8rem}
.sej-card strong{display:block;margin-top:.42rem;font-size:.86rem;font-weight:800}
.sej-card p{margin:.22rem 0 0;color:var(--muted);font-size:.72rem;line-height:1.4}
.sej-mini-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.65rem;margin-bottom:.8rem}
.sej-mini{padding:.72rem .78rem;border-radius:16px}
.sej-mini label{color:var(--muted)}
.sej-mini strong{display:block;margin-top:.2rem;font-size:1.08rem;font-weight:800;color:#144e72}
.sej-mini span{display:block;margin-top:.14rem;color:var(--muted);font-size:.72rem;line-height:1.4}
.sej-workspace{display:grid;grid-template-columns:.85fr 1.15fr;gap:1rem}
.sej-filter-panel{grid-column:1 / -1}
.sej-refspace{display:grid;grid-template-columns:.82fr 1.18fr;gap:1rem}
.sej-pillar-grid{display:flex;flex-wrap:wrap;gap:.55rem;margin-bottom:.8rem}
.sej-pillar{flex:1 1 auto;padding:.62rem .68rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer}
.sej-pillar.active{border-color:rgba(20,78,114,.24);background:rgba(238,245,245,.72);box-shadow:0 12px 24px rgba(20,78,114,.08)}
.sej-pillar strong{display:block;font-size:.82rem;font-weight:800;color:var(--accent)}
.sej-pillar span{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem}
.sej-form{display:flex;gap:.75rem;align-items:flex-end}
.sej-form > div { flex: 1; }
.sej-form label{margin-bottom:.3rem;color:var(--muted)}
.sej-summary{margin-top:.85rem;padding:.82rem .88rem;border-radius:18px;background:linear-gradient(180deg,rgba(25,61,87,.95) 0%,rgba(20,78,114,.95) 100%);color:#fffaf2}
.sej-summary small{display:block;color:rgba(255,250,242,.7);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.sej-summary strong{display:block;margin-top:.28rem;font-size:1.72rem;font-weight:800;line-height:1}
.sej-summary span{display:block;margin-top:.42rem;color:rgba(255,250,242,.78);font-size:.78rem;line-height:1.5}
.sej-list{display:flex;flex-direction:column;max-height:720px;overflow-y:auto;padding-right:.12rem}
.sej-item{position:relative;width:100%;padding:.7rem .78rem .66rem .88rem;margin-bottom:.55rem;border-radius:14px;border:1px solid rgba(20,38,59,.08);background:#fff;text-align:left;cursor:pointer;content-visibility:auto;contain-intrinsic-size:auto 80px}
.sej-item:last-child{margin-bottom:0}
.sej-item.active{border-color:rgba(20,78,114,.35);border-left-width:.28rem;background:rgba(238,245,245,.6)}
.sej-item:before{content:'';position:absolute;left:0;top:.68rem;bottom:.68rem;width:.18rem;border-radius:999px;background:var(--accent,#144e72)}
.sej-item-top{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:space-between}
.sej-item-code,.sej-code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:.76rem;font-weight:800;color:var(--accent,#144e72)}
.sej-item-name{margin:.28rem 0 .2rem;font-size:.88rem;font-weight:700;line-height:1.38;color:var(--ink)}
.sej-item-meta{color:var(--muted);font-size:.74rem;line-height:1.4}
.sej-item-meta span+span::before{content:'•';margin:0 .4rem;color:rgba(20,38,59,.35)}
.sej-pill{padding:.2rem .45rem;font-size:.68rem;background:rgba(20,38,59,.08);color:var(--ink)}
.sej-inspector{position:relative;top:auto;min-height:720px;display:flex;flex-direction:column}
.sej-inspector-head{padding-bottom:.85rem;border-bottom:1px solid var(--line)}
.sej-inspector-head strong{display:block;margin-top:.35rem;font-size:1rem;font-weight:800;color:#144e72}
.sej-inspector-head span{display:block;margin-top:.28rem;font-size:.9rem;font-weight:800;line-height:1.4}
.sej-inspector-body{display:grid;gap:.75rem;padding-top:.85rem;flex:1;min-height:0;overflow:auto;align-content:start}
.sej-meta{display:flex;flex-wrap:wrap;gap:.45rem}
.sej-meta span{background:rgba(20,38,59,.06);color:var(--ink);font-size:.72rem}
.sej-callout,.sej-note{padding:.76rem .84rem;border-radius:16px;border:1px solid var(--line);line-height:1.62}
.sej-callout{background:rgba(255,255,255,.75)}
.sej-note{background:rgba(238,245,245,.84)}
.sej-plain{margin:.15rem 0 0;padding-left:1rem;color:var(--muted);font-size:.78rem;line-height:1.6}
.sej-plain li{margin-bottom:.16rem}
.sej-refs{display:flex;flex-wrap:wrap;gap:.4rem}
.sej-ref{border:1px solid rgba(20,38,59,.12);background:rgba(255,255,255,.82);color:var(--ink);font-size:.7rem;cursor:pointer}
.sej-empty{padding:.9rem;border-radius:16px;border:1px dashed rgba(20,38,59,.18);background:rgba(255,255,255,.6);color:var(--muted);text-align:center;line-height:1.55}

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

@media (max-width:1440px){.sej-hero { min-height: 280px; padding: 1.25rem; } .sej-title { font-size: clamp(1.8rem, 3.2vw, 2.5rem); margin: 0.8rem 0 0.5rem; } .sej-metric { min-height: 80px; padding: 0.55rem 0.65rem; } .sej-metric strong { font-size: 1.35rem; } .sej-list, .sej-inspector { min-height: auto; max-height: 520px; }}
@media (max-height:850px) and (min-width:1024px){.sej-hero { min-height: 240px; padding: 1.15rem; } .sej-metrics { margin-top: 0.6rem; } .sej-list, .sej-inspector { max-height: calc(100vh - 280px); } .sej-inspector-body { padding-top: 0.5rem; }}
@media (max-width:1399.98px){.sej-workspace,.sej-refspace{grid-template-columns:1fr}.sej-inspector{position:static;min-height:auto}}
@media (max-width:1199.98px){.sej-hero,.sej-metric,.sej-side{min-height:auto}.sej-hero,.sej-nav,.sej-grid.two,.sej-refspace,.sej-metrics,.sej-mini-row,.sej-cards{grid-template-columns:1fr}.sej-bar,.sej-hotspot,.sej-family{grid-template-columns:1fr}}
@media (max-width:767.98px){.sej-hero,.sej-panel{padding:1.2rem;border-radius:22px}.sej-pillar-grid{grid-template-columns:1fr}.modal-shell{grid-template-columns:1fr}.modal-sidebar{flex-direction:row;padding:1rem;gap:1rem}.modal-sidebar-icon{width:2.5rem;height:2.5rem;margin-bottom:0}.modal-close{top:.5rem;right:.5rem}.modal-dialog{max-width:100%}}

[data-bs-theme="dark"] .sej-page{--ink:#f8fafc;--muted:#94a3b8;--line:rgba(255,255,255,.1);--shell:linear-gradient(180deg,#0f172a 0%,#1e293b 100%);--accent-muted:rgba(255,255,255,0.05)}
[data-bs-theme="dark"] .sej-metric,[data-bs-theme="dark"] .sej-side,[data-bs-theme="dark"] .sej-panel,[data-bs-theme="dark"] .sej-mini,[data-bs-theme="dark"] .sej-side-card{background:rgba(30,41,59,0.5);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .sej-tab{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .sej-tab.active{background:rgba(30,41,59,0.9);border-color:var(--accent,#48cae4)}
[data-bs-theme="dark"] .sej-tab i,[data-bs-theme="dark"] .sej-icon{background:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .sej-item,[data-bs-theme="dark"] .sej-tile,[data-bs-theme="dark"] .sej-pillar,[data-bs-theme="dark"] .sej-fn{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .sej-item.active,[data-bs-theme="dark"] .sej-tile.active,[data-bs-theme="dark"] .sej-pillar.active,[data-bs-theme="dark"] .sej-fn.active{background:rgba(30,41,59,0.9);border-color:var(--accent,#48cae4)}
[data-bs-theme="dark"] .sej-item-code,[data-bs-theme="dark"] .sej-code,[data-bs-theme="dark"] .sej-item-name,[data-bs-theme="dark"] .sej-inspector-head strong,[data-bs-theme="dark"] .sej-mini strong{color:var(--accent,#48cae4)}
[data-bs-theme="dark"] .sej-card{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .sej-card.active{background:rgba(30,41,59,0.9);border-color:var(--accent,#48cae4)}
[data-bs-theme="dark"] .sej-chip,[data-bs-theme="dark"] .sej-pill,[data-bs-theme="dark"] .sej-meta span{background:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .sej-track,[data-bs-theme="dark"] .sej-priority-track{background:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .sej-callout{background:rgba(30,41,59,0.4)}
[data-bs-theme="dark"] .sej-note{background:rgba(30,41,59,0.7);border-color:var(--accent,#48cae4)}
[data-bs-theme="dark"] .sej-ref{background:rgba(30,41,59,0.8);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .sej-empty{background:rgba(30,41,59,0.3);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .modal-shell{background:#1e293b;border:1px solid rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .modal-artifact-list li,[data-bs-theme="dark"] .modal-empty{background:rgba(255,255,255,0.05);color:var(--ink)}
[data-bs-theme="dark"] .modal-scope{background:rgba(255,255,255,0.1);color:#48cae4}
[data-bs-theme="dark"] .modal-req-btn{background:rgba(30,41,59,0.8);border-color:rgba(255,255,255,0.1);color:var(--ink)}
</style>
