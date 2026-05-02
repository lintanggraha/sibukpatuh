<template>
  <div class="sej-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading UU PDP data...</p>
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
          <span class="sej-kicker"><i class="fas fa-shield-alt"></i>Framework Nasional</span>
          <h1 class="sej-title">UU No. 27 Tahun 2022 Pelindungan Data Pribadi</h1>
          <p class="sej-lede">Data privacy is the new currency. Di sini kita breakdown UU PDP jadi framework yang gampang dieksekusi. Mulai dari mapping bab, analisa hak-kewajiban subjek data, sampai compliance checklist yang ready-to-use. Anggap aja ini cheat sheet lo buat mastiin perlindungan data pribadi organisasi udah sejalan sama regulasi tanpa overkill.</p>
          <div class="sej-metrics">
            <div class="sej-metric"><label>Bab Regulasi</label><strong>{{ totalChapters }}</strong><span>Dari ketentuan umum sampai ketentuan pidana.</span></div>
            <div class="sej-metric"><label>Kewajiban Inti</label><strong>{{ totalRequirements }}</strong><span>Requirements yang dapat dieksplorasi satu per satu.</span></div>
            <div class="sej-metric"><label>Asas</label><strong>{{ totalAsas }}</strong><span>Asas pelindungan data pribadi.</span></div>
            <div class="sej-metric"><label>Deadline</label><strong>{{ complianceDeadline }}</strong><span>October 2024 untuk compliance adaptation.</span></div>
          </div>
        </div>
        <div class="sej-side-stack">
          <div class="sej-side"><label>Alur Analisa</label><h3>Pendekatan analisa yang terstruktur</h3><p>Mulai dari pemahaman definisi dan asas dalam Bab I-II untuk memahami landasan, lanjut ke bab III untuk klasifikasi data, kemudian ke bab IV untuk memahami hak subjek data, dan bab V-VI untuk kewajiban pengendali dan prosesor data.</p></div>
          <div class="sej-side"><label>Catatan Penting</label><p>UU PDP efektif sejak Oktober 2022 dengan deadline adaptasi 2 tahun. Pelanggaran dapat dikenai sanksi administratif hingga denda 2% pendapatan tahunan, dan pelanggaran pidana dapat dipidana penjara hingga 6 tahun.</p></div>
        </div>
      </section>

      <div class="sej-nav nav" role="tablist">
        <button class="sej-tab" :class="{ active: activeTab === 'overview' }" type="button" role="tab" @click="activeTab = 'overview'"><i class="fas fa-chart-line"></i><span><strong>Ringkasan Program</strong><span>Peta pilar, bab regulasi, dan struktur program.</span></span></button>
        <button class="sej-tab" :class="{ active: activeTab === 'explorer' }" type="button" role="tab" @click="activeTab = 'explorer'"><i class="fas fa-sliders-h"></i><span><strong>Eksplorasi</strong><span>Filter requirements, baca detail, dan telusuri.</span></span></button>
        <button class="sej-tab" :class="{ active: activeTab === 'reference' }" type="button" role="tab" @click="activeTab = 'reference'"><i class="fas fa-balance-scale"></i><span><strong>Hukum &amp; Sanksi</strong><span>Ketentuan pidana dan sanksi administratif.</span></span></button>
      </div>

      <div class="tab-content sej-grid">
        <!-- Tab 1: Ringkasan Program -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head"><h3>Lanskap pilar regulasi</h3><span class="sej-chip">{{ pillarBreakdown.length }} pilar</span></div>
              <p class="sej-copy">Pilar pembacaan UU PDP: hak subjek data, kewajiban pengendali, pemrosesan data, transfer data, governance, dan sanksi. Klik bar untuk masuk ke eksplorasi dengan filter pilar.</p>
              <div class="sej-bars">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="sej-bar" @click="jumpExplorer(item.key)"><span><strong>{{ item.label }}</strong><em>{{ item.summary }}</em></span><span class="sej-track"><b :style="{ width: (item.count / maxPillarCount) * 100 + '%', background: item.color }"></b></span><span class="sej-num">{{ item.count }}</span></button>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Hotspot per bab</h3><span class="sej-chip">{{ totalChapters }} bab aktif</span></div>
              <p class="sej-copy">Distribusi bab membantu melihat area fokus regulasi: hak subjek, kewajiban pengendali, atau sanksi.</p>
              <div class="sej-hotspots">
                <button v-for="item in chapterBreakdown" :key="item.key" type="button" class="sej-hotspot" @click="jumpExplorer('', item.key)"><span><strong>{{ item.key }}. {{ item.label }}</strong><em>{{ item.summary }}</em></span><span class="sej-track"><b :style="{ width: (item.count / maxChapterCount) * 100 + '%', background: item.color }"></b></span><span class="sej-num">{{ item.count }}</span></button>
              </div>
            </article>
          </div>
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head"><h3>Hak Subjek Data Pribadi</h3><span class="sej-chip">9 Hak Utama</span></div>
              <div class="sej-mini-row">
                <div class="sej-mini"><label>Dasar</label><strong>Informasi</strong><span>Hak mendapatkan kejelasan identitas, tujuan, dan akuntabilitas.</span></div>
                <div class="sej-mini"><label>Pengelolaan</label><strong>Koreksi</strong><span>Hak melengkapi, memperbarui, dan memperbaiki data.</span></div>
                <div class="sej-mini"><label>Kontrol</label><strong>Penghapusan</strong><span>Hak mengakhiri, menghapus, atau memusnahkan data.</span></div>
              </div>
              <div class="sej-note">Kesembilan hak subjek data menjadi fokus utama compliance - organisasi wajib memastikan mekanisme untuk memfasilitasi setiap hak ini dengan responsivitas tinggi (3x24 jam untuk banyak aksi).</div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Kewajiban Pengendali Data</h3><span class="sej-chip">Core Obligations</span></div>
              <p class="sej-copy">Kewajiban inti pengendali data meliputi: dasar pemrosesan yang sah, consent management, data akurasi, security controls, breach notification (3x24 jam), dan DPO penunjukan.</p>
              <div class="sej-cards">
                <button v-for="item in pillarBreakdown.filter(p => p.key === 'Obligation' || p.key === 'Processing').slice(0, 2)" :key="item.key" type="button" class="sej-card" :style="{ '--accent': item.color }" @click="jumpExplorer(item.key)"><div class="sej-card-top"><span class="sej-icon"><i class="fas fa-briefcase"></i></span><span>{{ item.count }} requirement</span></div><strong>{{ item.label }}</strong><p>Klik untuk lihat detail kewajiban.</p></button>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 2: Eksplorasi -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="sej-workspace">
            <article class="sej-panel sej-filter-panel">
              <div class="sej-head"><h3>Filter Workspace</h3><span class="sej-chip">{{ totalRequirements }} requirement</span></div>
              <div class="sej-pillar-grid">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="sej-pillar" :class="{ active: activePillar === item.key }" :style="{ '--accent': item.color }" @click="togglePillar(item.key)"><strong>{{ item.label }}</strong><span>{{ item.count }} requirement</span></button>
              </div>
              <div class="sej-form">
                <div><label for="chapterFilter">Bab</label><select id="chapterFilter" v-model="chapterFilter" class="form-select"><option value="">Semua bab</option><option v-for="ch in chapterBreakdown" :key="ch.key" :value="ch.key">{{ ch.key }}. {{ ch.label }}</option></select></div>
                <div><label for="requirementSearch">Cari requirement</label><input id="requirementSearch" v-model="requirementSearch" type="search" class="form-control" placeholder="Cari ID, judul, atau ringkasan"></div>
                <button type="button" class="btn btn-outline-secondary" @click="resetRequirementFilters">Atur ulang filter</button>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Daftar requirement</h3><span class="sej-chip">{{ filteredRequirements.length }} entri</span></div>
              <div class="sej-list">
                <button v-for="req in filteredRequirements" :key="req.id" type="button" class="sej-item" :class="{ active: activeRequirementId === req.id }" :style="{ '--accent': getPillarColor(req.pillar) }" @click="setActiveRequirement(req.id)"><div class="sej-item-top"><span class="sej-item-code">{{ req.id }}</span><span class="sej-pill">{{ getPillarLabel(req.pillar) }}</span></div><div class="sej-item-name">{{ req.title || '-' }}</div><div class="sej-item-meta"><span>{{ getChapterLabel(req.chapter) }}</span><span>{{ req.cadence || '-' }}</span></div></button>
                <div v-if="filteredRequirements.length === 0" class="sej-empty">Tidak ada requirement yang cocok dengan filter saat ini.</div>
              </div>
            </article>
            <article class="sej-panel sej-inspector">
              <div class="sej-inspector-head"><small>Requirement Inspector</small><strong>{{ activeRequirement ? activeRequirement.id : '-' }}</strong><span>{{ activeRequirement ? activeRequirement.title : 'Pilih requirement untuk membaca detail.' }}</span></div>
              <div class="sej-inspector-body">
                <div class="sej-meta"><span>{{ activeRequirement ? getPillarLabel(activeRequirement.pillar) : '-' }}</span><span>{{ activeRequirement ? getChapterLabel(activeRequirement.chapter) : '-' }}</span><span>{{ activeRequirement ? activeRequirement.cadence || '-' : '-' }}</span><span>{{ activeRequirement ? activeRequirement.owner || '-' : '-' }}</span></div>
                <div class="sej-callout"><span class="sej-label">Ringkasan Requirement</span><div class="mt-2">{{ activeRequirement ? activeRequirement.summary : 'Pilih requirement untuk membaca ringkasan.' }}</div></div>
                <div class="sej-note"><span class="sej-label"><i class="fas fa-lightbulb me-1"></i>Analogi</span><div class="mt-2">{{ activeRequirement && activeRequirement.analogy ? activeRequirement.analogy : '-' }}</div></div>
                <div class="sej-callout"><span class="sej-label">Fokus Implementasi</span><ul class="sej-plain"><li v-for="(item, idx) in (activeRequirement && activeRequirement.focus && activeRequirement.focus.length ? activeRequirement.focus : ['Tidak ada fokus implementasi tambahan.'])" :key="idx">{{ item }}</li></ul></div>
                <div class="sej-callout"><span class="sej-label">Contoh Evidence</span><ul class="sej-plain"><li v-for="(item, idx) in (activeRequirement && activeRequirement.evidence && activeRequirement.evidence.length ? activeRequirement.evidence : ['Tidak ada evidence cue.'])" :key="idx">{{ item }}</li></ul></div>
                <div class="sej-callout"><span class="sej-label">Lampiran Terkait</span><div class="sej-refs"><span v-for="ref in (activeRequirement?.appendices || [])" :key="ref" class="sej-ref">{{ ref }}</span><span v-if="!activeRequirement || !activeRequirement.appendices || !activeRequirement.appendices.length" class="sej-empty w-100">Requirement ini tidak menunjuk lampiran spesifik.</span></div></div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 3: referensis -->
        <div v-if="activeTab === 'reference'" key="reference-tab">
          <div class="sej-refspace">
            <article class="sej-panel">
              <div class="sej-head"><h3>Ketentuan Pidana</h3><span class="sej-chip">Pasal 65-73</span></div>
              <p class="sej-copy">Pelanggaran UU PDP yang termasuk pidana meliputi beberapa aktivitas: memperoleh/mengumpulkan secara melawan hukum (5 tahun/Rp5M), mengungkapkan (4 tahun/Rp4M), menggunakan (5 tahun/Rp5M), dan memalsukan data (6 tahun/Rp6M).</p>
              <div class="sej-mini-row">
                <div class="sej-mini"><label>Menjual/Data</label><strong>5 Tahun</strong><span>Pidana penjara untuk pelanggaran Pasal 65 ayat 1.</span></div>
                <div class="sej-mini"><label>Mengungkapkan</label><strong>4 Tahun</strong><span>Pidana penjara untuk pelanggaran Pasal 65 ayat 2.</span></div>
                <div class="sej-mini"><label>Memalsukan</label><strong>6 Tahun</strong><span>Pidana penjara untuk pelanggaran Pasal 66.</span></div>
              </div>
              <div class="sej-note">Korporasi juga dapat diminta pertanggungjawaban pidana dengan denda hingga 10x dari maksimal denda individual.</div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>Sanksi Administratif</h3><span class="sej-chip">Pasal 57</span></div>
              <p class="sej-copy">Pelanggaran terhadap ketentuan tertentu dikenai sanksi administratif yang diberikan oleh lembaga.</p>
              <div class="sej-bars">
                <button type="button" class="sej-bar" :class="{ active: selectedSanction === 1 }" @click="selectedSanction = selectedSanction === 1 ? null : 1"><span><strong>Peringatan Tertulis</strong><em>Sanksi pertama yang diberikan.</em></span><span class="sej-num">1</span></button>
                <button type="button" class="sej-bar" :class="{ active: selectedSanction === 2 }" @click="selectedSanction = selectedSanction === 2 ? null : 2"><span><strong>Penghentian Sementara</strong><em>Penghentian aktivitas pemrosesan.</em></span><span class="sej-num">2</span></button>
                <button type="button" class="sej-bar" :class="{ active: selectedSanction === 3 }" @click="selectedSanction = selectedSanction === 3 ? null : 3"><span><strong>Penghapusan/Pemusnahan</strong><em>Data wajib dihapus atau dimusnahkan.</em></span><span class="sej-num">3</span></button>
                <button type="button" class="sej-bar" :class="{ active: selectedSanction === 4 }" @click="selectedSanction = selectedSanction === 4 ? null : 4"><span><strong>Denda Administratif</strong><em>Maksimal 2% pendapatan tahunan.</em></span><span class="sej-num">4</span></button>
              </div>
              <div v-if="selectedSanction" class="sej-note mt-3">
                <span class="sej-label">Detail Sanksi</span>
                <div class="mt-2" v-if="selectedSanction === 1">Peringatan tertulis diberikan untuk pelanggaran pertama kali. Perusahaan wajib memperbaiki dalam waktu yang ditetapkan.</div>
                <div class="mt-2" v-if="selectedSanction === 2">Penghentian sementara aktivitas pemrosesan data sampai pelanggaran diperbaiki atau selesai ditangani.</div>
                <div class="mt-2" v-if="selectedSanction === 3">Data yang terkait pelanggaran wajib dihapus atau dimusnahkan sesuai prosedur.</div>
                <div class="mt-2" v-if="selectedSanction === 4">Denda administratif maksimal 2% dari pendapatan tahunan. Dihitung berdasarkan variabel pelanggaran.</div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pdp',
  data() {
    return {
      loading: true,
      error: null,
      activeTab: 'overview',
      requirements: [],
      selectedSanction: null,
      pillarMeta: {
        'Reference': { label: 'Referensi', color: '#1d3557', icon: 'fa-book', summary: 'Definisi dan asas foundational UU PDP.' },
        'Classification': { label: 'Klasifikasi', color: '#2563eb', icon: 'fa-tags', summary: 'Jenis data spesifik dan umum.' },
        'Rights': { label: 'Hak Subjek', color: '#7c3aed', icon: 'fa-user-shield', summary: 'Hak-hak subjek data pribadi.' },
        'Processing': { label: 'Pemrosesan', color: '#0891b2', icon: 'fa-cogs', summary: 'Prinsip dan prosedur pemrosesan data.' },
        'Obligation': { label: 'Kewajiban', color: '#dc2626', icon: 'fa-gavel', summary: 'Kewajiban pengendali dan prosesor.' },
        'Transfer': { label: 'Transfer', color: '#d97706', icon: 'fa-exchange-alt', summary: 'Transfer data dalam dan luar negeri.' },
        'Sanction': { label: 'Sanksi', color: '#be123c', icon: 'fa-ban', summary: 'Sanksi administratif dan pidana.' },
        'Governance': { label: 'Governance', color: '#047857', icon: 'fa-building', summary: 'Kelembagaan dan penyelesaian sengketa.' },
        'Implementation': { label: 'Implementasi', color: '#4f46e5', icon: 'fa-rocket', summary: 'Ketentuan Peralihan dan compliance.' },
        'Criminal': { label: 'Pidana', color: '#991b1b', icon: 'fa-user-arrest', summary: 'Ketentuan pidana.' },
        'Resolution': { label: 'Penyelesaian', color: '#7c2d12', icon: 'fa-balance-scale', summary: 'Penyelesaian sengketa.' },
      },
      activePillar: '',
      chapterFilter: '',
      requirementSearch: '',
      activeRequirementId: null,
    };
  },
  computed: {
    totalChapters() {
      return new Set(this.requirements.map(r => r.chapter)).size;
    },
    totalRequirements() {
      return this.requirements.length;
    },
    totalAsas() {
      return 8;
    },
    complianceDeadline() {
      return 'Oct 2024';
    },
    pillarBreakdown() {
      return Object.entries(this.pillarMeta)
        .map(([key, meta]) => {
          const subset = this.requirements.filter(r => r.pillar === key);
          return { key, label: meta.label, color: meta.color, icon: meta.icon, summary: meta.summary, count: subset.length };
        })
        .filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count);
    },
    maxPillarCount() {
      return Math.max(...this.pillarBreakdown.map(p => p.count), 1);
    },
    chapterBreakdown() {
      const grouped = this.requirements.reduce((acc, r) => {
        if (!r.chapter) return acc;
        if (!acc[r.chapter]) acc[r.chapter] = { key: r.chapter, label: r.chapter_title, summary: r.pillar, count: 0 };
        acc[r.chapter].count++;
        return acc;
      }, {});
      return Object.values(grouped).sort((a, b) => a.key.localeCompare(b.key));
    },
    maxChapterCount() {
      return Math.max(...this.chapterBreakdown.map(c => c.count), 1);
    },
    filteredRequirements() {
      const query = (this.requirementSearch || '').trim().toLowerCase();
      return this.requirements.filter(req => {
        if (this.activePillar && req.pillar !== this.activePillar) return false;
        if (this.chapterFilter && req.chapter !== this.chapterFilter) return false;
        if (!query) return true;
        return [req.id, req.title, req.summary, req.chapter_title, ...(req.pillar || [])].join(' ').toLowerCase().includes(query);
      });
    },
    activeRequirement() {
      return this.requirements.find(r => r.id === this.activeRequirementId) || null;
    },
  },
  watch: {
    filteredRequirements() {
      if (this.filteredRequirements.length && !this.filteredRequirements.find(r => r.id === this.activeRequirementId)) {
        this.activeRequirementId = this.filteredRequirements[0]?.id || null;
      }
    },
  },
  methods: {
    getPillarColor(pillar) { return this.pillarMeta[pillar]?.color || '#144e72'; },
    getPillarLabel(pillar) { return this.pillarMeta[pillar]?.label || pillar || '-'; },
    getChapterLabel(chapter) { return chapter || '-'; },
    resetRequirementFilters() {
      this.activePillar = '';
      this.chapterFilter = '';
      this.requirementSearch = '';
    },
    setActiveRequirement(id) { this.activeRequirementId = id; },
    togglePillar(key) { this.activePillar = this.activePillar === key ? '' : key; },
    jumpExplorer(pillar = '', chapter = '') {
      this.activePillar = pillar || '';
      this.chapterFilter = chapter || '';
      this.activeTab = 'explorer';
    },
    retryLoad() { this.loadData(); },
    async loadData() {
      try {
        this.loading = true;
        this.error = null;
        const res = await fetch('/data/uu_pdp_requirements.json');
        if (!res.ok) throw new Error(`Failed to load UU PDP data: HTTP ${res.status}`);
        const data = await res.json();
        this.requirements = Array.isArray(data) ? data : [];
        if (this.requirements.length > 0) this.activeRequirementId = this.requirements[0].id;
      } catch (error) {
        console.error('Error loading UU PDP data:', error);
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
.sej-page{--ink:#14263b;--muted:#5c6776;--line:rgba(20,38,59,.1);--shell:linear-gradient(180deg,#f6f1e8 0%,#edf5f4 100%);color:var(--ink);padding:.25rem;border-radius:32px;background:var(--shell)}
.sej-shell{display:grid;gap:1rem}
.sej-hero{display:grid;grid-template-columns:1.55fr .9fr;gap:1.2rem;align-items:stretch;min-height:368px;padding:1.45rem;border-radius:28px;overflow:hidden;position:relative;background:radial-gradient(circle at top right,rgba(247,208,156,.86),transparent 30%),radial-gradient(circle at bottom left,rgba(155,214,205,.68),transparent 28%),linear-gradient(135deg,#17324d 0%,#1f4d6f 48%,#f2e0bf 100%);box-shadow:0 20px 44px rgba(15,23,42,.09)}
.sej-hero>*{position:relative;z-index:1}
.sej-kicker{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem .7rem;border-radius:999px;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.sej-title{margin:1rem 0 .7rem;color:#fffaf2;font-size:clamp(2rem,3.8vw,3rem);font-weight:800;line-height:1.04}
.sej-lede{margin:0;max-width:700px;color:rgba(255,250,242,.82);line-height:1.7}
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
.sej-tab.active{border-color:rgba(15,118,110,.24);box-shadow:0 18px 30px rgba(15,118,110,.1)}
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
.sej-bar,.sej-hotspot,.sej-family,.sej-card{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(180px,1fr) auto;gap:.68rem;align-items:center;padding:.62rem .72rem;border-radius:16px;border:1px solid transparent;background:rgba(255,255,255,.55);text-align:left;cursor:pointer;transition:border-color .15s ease,transform .15s ease,box-shadow .15s ease}
.sej-family{grid-template-columns:1fr auto}
.sej-bar:hover,.sej-hotspot:hover,.sej-family:hover,.sej-bar.active,.sej-hotspot.active,.sej-family.active{transform:translateY(-1px);border-color:rgba(20,78,114,.22);box-shadow:0 12px 22px rgba(20,78,114,.08)}
.sej-bar strong,.sej-hotspot strong,.sej-family strong{display:block;font-size:.86rem}
.sej-bar em,.sej-hotspot em,.sej-family em{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem;font-style:normal}
.sej-track{height:.44rem;border-radius:999px;background:rgba(20,38,59,.08);overflow:hidden}
.sej-track b{display:block;height:100%;border-radius:inherit}
.sej-num{min-width:2.2rem;text-align:right;font-weight:800}
.sej-cards{grid-template-columns:repeat(2,1fr)}
.sej-card{width:100%;padding:.76rem .8rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer}
.sej-card.active{border-color:rgba(20,78,114,.24);box-shadow:0 16px 28px rgba(20,78,114,.08);background:rgba(238,245,245,.72)}
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
.sej-list{display:flex;flex-direction:column;max-height:760px;overflow-y:auto;padding-right:.12rem}
.sej-item{position:relative;width:100%;padding:.7rem .78rem .66rem .88rem;margin-bottom:.55rem;border-radius:14px;border:1px solid rgba(20,38,59,.08);background:#fff;text-align:left;cursor:pointer;content-visibility:auto;contain-intrinsic-size:auto 80px}
.sej-item:last-child{margin-bottom:0}
.sej-item.active{border-color:rgba(15,118,110,.35);border-left-width:.28rem;background:rgba(238,245,245,.6)}
.sej-item:before{content:'';position:absolute;left:0;top:.68rem;bottom:.68rem;width:.18rem;border-radius:999px;background:var(--accent,#0f766e)}
.sej-item-top{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:space-between}
.sej-item-code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:.76rem;font-weight:800;color:var(--accent,#0f766e)}
.sej-item-name{margin:.28rem 0 .2rem;font-size:.88rem;font-weight:700;line-height:1.38;color:var(--ink)}
.sej-item-meta{color:var(--muted);font-size:.74rem;line-height:1.4}
.sej-item-meta span+span::before{content:'•';margin:0 .4rem;color:rgba(20,38,59,.35)}
.sej-pill{padding:.2rem .45rem;font-size:.68rem;background:rgba(20,38,59,.08);color:var(--ink)}
.sej-inspector{position:relative;top:auto;min-height:760px;display:flex;flex-direction:column}
.sej-inspector-head{padding-bottom:.85rem;border-bottom:1px solid var(--line)}
.sej-inspector-head strong{display:block;margin-top:.35rem;font-size:1rem;font-weight:800;color:#0f766e}
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

.loading-state,.error-state{display:flex;align-items:center;justify-content:center;min-height:400px}
.loading-spinner,.error-message{text-align:center;padding:2rem;border-radius:20px;background:rgba(255,251,245,.98)}
.loading-spinner i{font-size:2rem;color:var(--muted)}
.loading-spinner p,.error-message p{margin-top:.5rem;color:var(--muted)}

@media (max-width:1440px){.sej-hero{min-height:280px;padding:1.25rem}.sej-title{font-size:clamp(1.8rem,3.2vw,2.5rem);margin:.8rem 0 .5rem}.sej-metric{min-height:80px;padding:.55rem .65rem}.sej-metric strong{font-size:1.35rem}.sej-list,.sej-inspector{max-height:520px}}
@media (max-width:1399.98px){.sej-workspace,.sej-refspace{grid-template-columns:1fr}.sej-inspector{position:static;min-height:auto}}
@media (max-width:1199.98px){.sej-hero,.sej-metric,.sej-side{min-height:auto}.sej-hero,.sej-nav,.sej-grid.two,.sej-refspace,.sej-metrics,.sej-mini-row,.sej-cards,.sej-grid{grid-template-columns:1fr}.sej-bar,.sej-hotspot,.sej-family{grid-template-columns:1fr}}
@media (max-width:767.98px){.sej-hero,.sej-panel{padding:1.2rem;border-radius:22px}.sej-pillar-grid{grid-template-columns:1fr}}

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