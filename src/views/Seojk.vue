<template>
  <div class="sej-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading SEOJK data...</p>
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
          <span class="sej-kicker"><i class="fas fa-landmark"></i>Framework Studio</span>
          <h1 class="sej-title">SEOJK 29/SEOJK.03/2022 Cyber Resilience Map</h1>
          <p class="sej-lede">{{ ui.heroLede }}</p>
          <div class="sej-metrics">
            <div class="sej-metric"><label>{{ ui.metaChapters }}</label><strong>{{ totalChapters }}</strong><span>{{ ui.metaChaptersDesc }}</span></div>
            <div class="sej-metric"><label>{{ ui.metaRequirements }}</label><strong>{{ totalRequirements }}</strong><span>{{ ui.metaRequirementsDesc }}</span></div>
            <div class="sej-metric"><label>{{ ui.metaAppendices }}</label><strong>{{ totalAppendices }}</strong><span>{{ ui.metaAppendicesDesc }}</span></div>
            <div class="sej-metric"><label>{{ ui.metaSla }}</label><strong>{{ reportingSla }}</strong><span>{{ ui.metaSlaDesc }}</span></div>
          </div>
        </div>
        <div class="sej-side-stack">
          <div class="sej-side"><label>{{ ui.sideFlowLabel }}</label><h3>{{ ui.sideFlowTitle }}</h3><p>{{ ui.sideFlowDesc }}</p></div>
          <div class="sej-side"><label>{{ ui.sideNoteLabel }}</label><p>{{ ui.sideNoteDesc }}</p></div>
        </div>
      </section>

      <div class="sej-nav nav" role="tablist">
        <button class="sej-tab" :class="{ active: activeTab === 'overview' }" type="button" role="tab" @click="activeTab = 'overview'"><i class="fas fa-chart-line"></i><span><strong>{{ ui.tab1Label }}</strong><span>{{ ui.tab1Desc }}</span></span></button>
        <button class="sej-tab" :class="{ active: activeTab === 'explorer' }" type="button" role="tab" @click="activeTab = 'explorer'"><i class="fas fa-sliders-h"></i><span><strong>{{ ui.tab2Label }}</strong><span>{{ ui.tab2Desc }}</span></span></button>
        <button class="sej-tab" :class="{ active: activeTab === 'reference' }" type="button" role="tab" @click="activeTab = 'reference'"><i class="fas fa-folder-open"></i><span><strong>{{ ui.tab3Label }}</strong><span>{{ ui.tab3Desc }}</span></span></button>
      </div>

      <div class="tab-content sej-grid">
        <!-- Tab 1: Ringkasan Program -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head"><h3>{{ ui.pillarLandscape }}</h3><span class="sej-chip">{{ pillarBreakdown.length }} pilar</span></div>
              <p class="sej-copy">{{ ui.pillarLandscapeDesc }}</p>
              <div class="sej-bars">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="sej-bar" @click="jumpExplorer(item.key)"><span><strong>{{ item.label }}</strong><em>{{ item.summary }}</em></span><span class="sej-track"><b :style="{ width: (item.count / maxPillarCount) * 100 + '%', background: item.color }"></b></span><span class="sej-num">{{ item.count }}</span></button>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>{{ ui.chapterHotspot }}</h3><span class="sej-chip">{{ totalChapters }} {{ ui.chaptersActiveChip }}</span></div>
              <p class="sej-copy">{{ ui.chapterHotspotDesc }}</p>
              <div class="sej-hotspots">
                <button v-for="item in chapterBreakdown" :key="item.key" type="button" class="sej-hotspot" @click="jumpExplorer('', item.key)"><span><strong>{{ item.key }}. {{ item.label }}</strong><em>{{ item.summary }}</em></span><span class="sej-track"><b :style="{ width: (item.count / maxChapterCount) * 100 + '%', background: item.color }"></b></span><span class="sej-num">{{ item.count }}</span></button>
              </div>
            </article>
          </div>
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head"><h3>{{ ui.assessTitle }}</h3><span class="sej-chip">Assessment model</span></div>
              <div class="sej-mini-row">
                <div class="sej-mini"><label>4 Faktor Risiko Inheren</label><strong>Teknologi</strong><span>Produk bank, karakteristik organisasi, dan rekam jejak insiden siber.</span></div>
                <div class="sej-mini"><label>4 Proses Ketahanan</label><strong>Identify to Recover</strong><span>Identifikasi, pelindungan, deteksi, penanggulangan, dan pemulihan.</span></div>
                <div class="sej-mini"><label>2 Metode Uji</label><strong>Technical + Scenario</strong><span>Analisis kerentanan serta exercise berbasis skenario lintas fungsi.</span></div>
              </div>
              <div class="sej-note">Penilaian maturitas memakai dua dimensi besar: kualitas penerapan manajemen risiko siber dan kualitas penerapan proses ketahanan siber. Hasil akhirnya dipakai bersama risiko inheren untuk menetapkan tingkat risiko keamanan siber.</div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>{{ ui.appendixMap }}</h3><span class="sej-chip">{{ totalAppendices }} referensi</span></div>
              <p class="sej-copy">{{ ui.appendixMapDesc }}</p>
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
              <div class="sej-head"><h3>{{ ui.filterWorkspace }}</h3><span class="sej-chip">{{ totalRequirements }} requirement</span></div>
              <div class="sej-pillar-grid">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="sej-pillar" :class="{ active: activePillar === item.key }" :style="{ '--accent': item.color }" @click="togglePillar(item.key)"><strong>{{ item.label }}</strong><span>{{ item.count }} requirement</span></button>
              </div>
              <div class="sej-form">
                <div><label for="chapterFilter">{{ ui.filterChapter }}</label><select id="chapterFilter" v-model="chapterFilter" class="form-select"><option value="">{{ ui.filterAllChapters }}</option><option v-for="ch in chapterBreakdown" :key="ch.key" :value="ch.key">{{ ch.key }}. {{ ch.label }}</option></select></div>
                <div><label for="requirementSearch">{{ ui.filterSearch }}</label><input id="requirementSearch" v-model="requirementSearch" type="search" class="form-control" :placeholder="ui.filterSearchPlaceholder"></div>
                <button type="button" class="btn btn-outline-secondary" @click="resetRequirementFilters">{{ ui.filterReset }}</button>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>{{ ui.reqList }}</h3><span class="sej-chip">{{ filteredRequirements.length }} entri</span></div>
              <div class="sej-list">
                <button v-for="req in filteredRequirements" :key="req.id" type="button" class="sej-item" :class="{ active: activeRequirementId === req.id }" :style="{ '--accent': getPillarColor(req.pillar) }" @click="setActiveRequirement(req.id)"><div class="sej-item-top"><span class="sej-item-code">{{ req.id }}</span><span class="sej-pill">{{ getPillarLabel(req.pillar) }}</span></div><div class="sej-item-name">{{ req.title || '-' }}</div><div class="sej-item-meta"><span>{{ getChapterLabel(req.chapter) }}</span><span>{{ (req.appendices || []).length }} lampiran</span></div></button>
                <div v-if="filteredRequirements.length === 0" class="sej-empty">{{ ui.reqEmpty }}</div>
              </div>
            </article>
            <article class="sej-panel sej-inspector">
              <div class="sej-inspector-head"><small>Requirement Inspector</small><strong>{{ activeRequirement ? activeRequirement.id : '-' }}</strong><span>{{ activeRequirement ? activeRequirement.title : ui.reqInspectorEmpty }}</span></div>
              <div class="sej-inspector-body">
                <div class="sej-meta"><span>{{ activeRequirement ? getPillarLabel(activeRequirement.pillar) : '-' }}</span><span>{{ activeRequirement ? getChapterLabel(activeRequirement.chapter) : '-' }}</span><span>{{ activeRequirement ? activeRequirement.cadence || '-' : '-' }}</span><span>{{ activeRequirement ? (activeRequirement.appendices || []).length + ' lampiran' : '0 lampiran' }}</span></div>

                <div v-if="activeRole !== 'default' && activeRequirement" class="role-translation-box">
                  <span class="sej-label">
                    <i :class="getRoleIcon(activeRole)" class="me-1"></i> {{ ui.divisionLabel }} ({{ getRoleName(activeRole) }})
                  </span>
                  <div class="sej-callout role-callout mt-2">
                    {{ (activeRequirement.roleTranslations && activeRequirement.roleTranslations[activeRole]) ? activeRequirement.roleTranslations[activeRole] : ui.divisionEmpty }}
                  </div>
                </div>

                <div class="sej-callout"><span class="sej-label">{{ ui.reqSummaryLabel }}</span><div class="mt-2">{{ activeRequirement ? activeRequirement.summary : ui.reqSummaryEmpty }}</div></div>
                <div class="sej-note"><span class="sej-label"><i class="fas fa-lightbulb me-1"></i>{{ ui.analogyLabel }}</span><div class="mt-2">{{ activeRequirement ? activeRequirement.analogy : '-' }}</div></div>
                <div class="sej-callout"><span class="sej-label">{{ ui.focusLabel }}</span><ul class="sej-plain"><li v-for="(item, idx) in (activeRequirement && activeRequirement.focus && activeRequirement.focus.length ? activeRequirement.focus : [ui.focusEmpty])" :key="idx">{{ item }}</li></ul></div>
                <div class="sej-callout"><span class="sej-label">{{ ui.evidenceLabel }}</span><ul class="sej-plain"><li v-for="(item, idx) in (activeRequirement && activeRequirement.evidence && activeRequirement.evidence.length ? activeRequirement.evidence : [ui.evidenceEmpty])" :key="idx">{{ item }}</li></ul></div>
                <div class="sej-callout"><span class="sej-label">{{ ui.appendixRelated }}</span><div class="sej-refs"><button v-for="ref in (activeRequirement?.appendices || [])" :key="ref" type="button" class="sej-ref" @click="jumpAppendix(ref)">{{ ref }}</button><span v-if="!activeRequirement || !activeRequirement.appendices || !activeRequirement.appendices.length" class="sej-empty w-100">{{ ui.appendixEmpty }}</span></div></div>
                <div class="sej-note"><span class="sej-label">{{ ui.reportingLabel }}</span><div class="mt-2">{{ activeRequirement ? (activeRequirement.reporting || '-') : '-' }}</div></div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 3: Lampiran & Laporan -->
        <div v-if="activeTab === 'reference'" key="reference-tab">
          <div class="sej-refspace">
            <article class="sej-panel">
              <div class="sej-head"><h3>{{ ui.refFilter }}</h3><span class="sej-chip">{{ totalAppendices }} {{ ui.appendixCountLabel }}</span></div>
              <div class="sej-form">
                <div><label for="appendixTypeFilter">{{ ui.refTypeLabel }}</label><select id="appendixTypeFilter" v-model="appendixTypeFilter" class="form-select"><option value="">{{ ui.refTypeAll }}</option><option v-for="item in appendixTypeBreakdown" :key="item.type" :value="item.type">{{ item.type }}</option></select></div>
                <div><label for="appendixSearch">{{ ui.refSearch }}</label><input id="appendixSearch" v-model="appendixSearch" type="search" class="form-control" :placeholder="ui.refSearchPlaceholder"></div>
                <button type="button" class="btn btn-outline-secondary" @click="resetAppendixFilters">{{ ui.filterReset }}</button>
              </div>
              <div class="sej-summary"><small>{{ ui.refShown }}</small><strong>{{ filteredAppendices.length }}</strong><span>{{ filteredAppendices.length ? `${ui.refShown}: ${filteredAppendices.length}` : ui.refShownEmpty }}</span></div>
              <div class="sej-families mt-3">
                <button v-for="item in appendixTypeBreakdown" :key="item.type" type="button" class="sej-family" :class="{ active: appendixTypeFilter === item.type }" :style="{ '--accent': item.color }" @click="appendixTypeFilter = appendixTypeFilter === item.type ? '' : item.type"><span><strong>{{ item.type }}</strong><em>{{ item.count }} lampiran</em></span><span class="sej-num">{{ item.count }}</span></button>
              </div>
              <div class="sej-note mt-3"><span class="sej-label">{{ ui.refOutputNote }}</span>{{ ui.refOutputDesc }}</div>
            </article>
            <article class="sej-panel">
              <div class="sej-head"><h3>{{ ui.refBoard }}</h3><span class="sej-chip">{{ filteredAppendices.length }} entri</span></div>
              <div class="sej-list">
                <button v-for="app in filteredAppendices" :key="app.id" type="button" class="sej-item" @click="openAppendixModal(app)"><div class="sej-item-top"><span class="sej-item-code">{{ app.id }}</span><span class="sej-pill">{{ app.type }}</span></div><div class="sej-item-name">{{ app.title || '-' }}</div><div class="sej-item-meta"><span>{{ (app.used_by || []).length }} requirement</span></div></button>
                <div v-if="filteredAppendices.length === 0" class="sej-empty">{{ ui.refEmpty }}</div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Appendix -->
  <Transition name="sej-fade">
    <div v-if="showAppendixModal" class="sej-overlay" @click.self="showAppendixModal = false">
      <Transition name="modal-slide">
        <div class="sej-modal-dialog" v-if="showAppendixModal">
          <div class="sej-modal-shell">
            <div class="sej-modal-sidebar" :style="{ background: `linear-gradient(180deg, ${getAppendixColor(selectedAppendix?.type)} 0%, ${getAppendixColor(selectedAppendix?.type, 0.7)} 100%)` }">
              <button type="button" class="sej-modal-close" @click="showAppendixModal = false" aria-label="Close">
                <i class="fas fa-times"></i>
              </button>
              <div class="sej-modal-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="sej-modal-id">{{ selectedAppendix?.id || '-' }}</div>
              <div class="sej-modal-type">{{ selectedAppendix?.type || '' }}</div>
            </div>
            <div class="sej-modal-main">
              <div class="sej-modal-header">
                <h4 class="sej-modal-title">{{ selectedAppendix?.title || 'Detail Lampiran' }}</h4>
              </div>
              <div class="sej-modal-body">
                <!-- Ringkasan Section -->
                <div class="sej-modal-section">
                  <div class="sej-modal-section-header" :style="{ color: getAppendixColor(selectedAppendix?.type) }">
                    <i class="fas fa-info-circle"></i>
                    <span>{{ ui.modalSummary }}</span>
                  </div>
                  <div class="modal-section-content">
                    <div class="sej-modal-scope">{{ selectedAppendix?.scope || '-' }}</div>
                    <p class="sej-modal-summary">{{ selectedAppendix?.summary || '-' }}</p>
                  </div>
                </div>

                <!-- Artefak Section -->
                <div class="sej-modal-section">
                  <div class="sej-modal-section-header" :style="{ color: getAppendixColor(selectedAppendix?.type) }">
                    <i class="fas fa-list-check"></i>
                    <span>{{ ui.modalArtifacts }}</span>
                  </div>
                  <div class="modal-section-content">
                    <ul class="sej-modal-artifact-list">
                      <li v-for="(item, idx) in (selectedAppendix?.contains && selectedAppendix.contains.length ? selectedAppendix.contains : [])" :key="idx">
                        <i class="fas fa-check-circle"></i>
                        <span>{{ item }}</span>
                      </li>
                      <li v-if="!selectedAppendix?.contains || !selectedAppendix.contains.length" class="sej-modal-empty">
                        {{ ui.modalArtifactsEmpty }}
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Requirements Section -->
                <div class="sej-modal-section">
                  <div class="sej-modal-section-header" :style="{ color: getAppendixColor(selectedAppendix?.type) }">
                    <i class="fas fa-link"></i>
                    <span>{{ ui.modalReqUsing }}</span>
                  </div>
                  <div class="modal-section-content">
                    <div class="sej-modal-requirements">
                      <button v-for="reqId in (selectedAppendix?.used_by || [])" :key="reqId" type="button" class="sej-modal-req-btn" @click="jumpToRequirement(reqId)">
                        <i class="fas fa-arrow-right"></i>
                        <span>{{ reqId }}</span>
                      </button>
                      <div v-if="!selectedAppendix?.used_by || !selectedAppendix.used_by.length" class="sej-modal-empty">
                        {{ ui.modalReqEmpty }}
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
import { mapState } from "pinia";
import { useFrameworkStore } from "../stores/frameworkStore";

export default {
  name: 'Seojk',
  data() {
    return {
      loading: true,
      error: null,
      activeTab: 'overview',
      requirements: [],
      appendices: [],
      pillarMeta: {
        'Assessment': { label: 'Penilaian', labelEn: 'Assessment', color: '#1d4ed8', icon: 'fa-chart-line', summary: 'Siklus penilaian, scoring, dan justifikasi hasil.', summaryEn: 'Assessment cycles, scoring, and result justification.' },
        'Governance': { label: 'Governance', labelEn: 'Governance', color: '#0f766e', icon: 'fa-sitemap', summary: 'Arah kebijakan, akuntabilitas pengurus, dan kerangka risiko.', summaryEn: 'Policy direction, board accountability, and risk framework.' },
        'Resilience': { label: 'Ketahanan', labelEn: 'Resilience', color: '#a16207', icon: 'fa-shield-alt', summary: 'Identifikasi, pelindungan, deteksi, respons, dan pemulihan.', summaryEn: 'Identify, protect, detect, respond, and recover.' },
        'Testing': { label: 'Pengujian', labelEn: 'Testing', color: '#c2410c', icon: 'fa-vials', summary: 'Vulnerability assessment dan scenario exercise.', summaryEn: 'Vulnerability assessment and scenario-based exercises.' },
        'Organization': { label: 'Fungsi', labelEn: 'Organization', color: '#7c3aed', icon: 'fa-users', summary: 'Unit independen dan koordinasi tim tanggap insiden.', summaryEn: 'Independent unit and incident response team coordination.' },
        'Reporting': { label: 'Pelaporan', labelEn: 'Reporting', color: '#b91c1c', icon: 'fa-file-alt', summary: 'Konsolidasi tingkat risiko dan pelaporan resmi ke OJK.', summaryEn: 'Risk level consolidation and official reporting to OJK.' },
      },
      chapterMeta: {
        'II': { label: 'Risiko Inheren', labelEn: 'Inherent Risk', color: '#2563eb', icon: 'fa-chart-line', summary: 'Menilai paparan awal berdasarkan empat faktor risiko.', summaryEn: 'Assessing initial exposure based on four risk factors.' },
        'III': { label: 'Manajemen Risiko', labelEn: 'Risk Management', color: '#0f766e', icon: 'fa-sitemap', summary: 'Pengawasan aktif, kerangka, proses, dan pengendalian.', summaryEn: 'Active oversight, framework, processes, and controls.' },
        'IV': { label: 'Ketahanan Siber', labelEn: 'Cyber Resilience', color: '#a16207', icon: 'fa-shield-alt', summary: 'Identifikasi, pelindungan, deteksi, penanggulangan, dan pemulihan.', summaryEn: 'Identify, protect, detect, respond, and recover.' },
        'V': { label: 'Maturitas', labelEn: 'Maturity', color: '#7c3aed', icon: 'fa-th-large', summary: 'Mengukur kualitas penerapan dan level kematangan.', summaryEn: 'Measuring implementation quality and maturity level.' },
        'VI': { label: 'Tingkat Risiko', labelEn: 'Risk Level', color: '#b91c1c', icon: 'fa-balance-scale', summary: 'Menggabungkan inherent risk dan maturity menjadi risk rating final.', summaryEn: 'Combining inherent risk and maturity into final risk rating.' },
        'VII': { label: 'Pengujian', labelEn: 'Testing', color: '#c2410c', icon: 'fa-vials', summary: 'Analisis kerentanan, penetration test, dan exercise berbasis skenario.', summaryEn: 'Vulnerability analysis, penetration testing, and scenario exercises.' },
        'VIII': { label: 'Fungsi Siber', labelEn: 'Cyber Function', color: '#1d4ed8', icon: 'fa-users', summary: 'Unit independen dan kesiapan tim tanggap insiden siber.', summaryEn: 'Independent unit and cyber incident response team readiness.' },
      },
      appendixTypePalette: {
        'Parameter Minimum': '#2563eb',
        'Format Penilaian': '#0f766e',
        'Definisi Peringkat': '#a16207',
        'Definisi Tingkat': '#7c3aed',
        'Kontrol Minimum': '#b91c1c',
        'Format Laporan': '#144e72',
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
    ...mapState(useFrameworkStore, ['activeRole', 'currentLanguage']),
    isEn() { return this.currentLanguage === 'en'; },
    totalChapters() {
      const chapters = this.requirements.map(r => r.chapter).filter(Boolean);
      return new Set(chapters).size;
    },
    totalRequirements() { return this.requirements.length; },
    totalAppendices() { return this.appendices.length; },
    pillarBreakdown() {
      return Object.entries(this.pillarMeta)
        .map(([key, meta]) => ({ key, label: this.isEn ? (meta.labelEn || meta.label) : meta.label, color: meta.color, icon: meta.icon, summary: this.isEn ? (meta.summaryEn || meta.summary) : meta.summary, count: this.requirements.filter(r => r.pillar === key).length }))
        .filter(item => item.count > 0);
    },
    maxPillarCount() { return Math.max(...this.pillarBreakdown.map(p => p.count), 1); },
    chapterBreakdown() {
      return Object.entries(this.chapterMeta)
        .map(([key, meta]) => ({ key, label: this.isEn ? (meta.labelEn || meta.label) : meta.label, color: meta.color, icon: meta.icon, summary: this.isEn ? (meta.summaryEn || meta.summary) : meta.summary, count: this.requirements.filter(r => r.chapter === key).length }))
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
        const pillarLabel = this.isEn ? (this.pillarMeta[req.pillar]?.labelEn || '') : (this.pillarMeta[req.pillar]?.label || '');
        return [req.id, req.title, req.summary, req.chapter_title, pillarLabel, ...(req.appendices || []), ...(req.focus || [])].join(' ').toLowerCase().includes(query);
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
    ui() {
      const en = this.isEn;
      return {
        heroLede: en ? 'A comprehensive breakdown of SEOJK 29/SEOJK.03/2022 for commercial banks. Get a full blueprint covering requirement mapping, implementation insights, and official OJK reporting formats.' : 'Di sini kita bedah tuntas SEOJK 29/SEOJK.03/2022 buat bank umum. Gak cuma sekadar compliance, lo dapet blueprint komprehensif mulai dari pemetaan requirement, insight implementasi, sampai format pelaporan resmi OJK.',
        metaChapters: en ? 'Operational Chapters' : 'Bab Operasional',
        metaChaptersDesc: en ? 'From inherent risk to cyber unit/function structures.' : 'Mulai dari risiko inheren sampai unit/fungsi siber.',
        metaRequirements: en ? 'Core Obligations' : 'Kewajiban Inti',
        metaRequirementsDesc: en ? 'Requirements reviewable one by one in the explorer.' : 'Requirement yang dapat ditinjau satu per satu dalam explorer.',
        metaAppendices: en ? 'Appendices' : 'Lampiran',
        metaAppendicesDesc: en ? 'Parameters, assessment formats, rating definitions, and report formats.' : 'Parameter, format penilaian, definisi rating, dan format laporan.',
        metaSla: en ? 'Reporting SLA' : 'SLA Pelaporan',
        metaSlaDesc: en ? 'Working days after year-end to submit to OJK.' : 'Hari kerja setelah akhir tahun pelaporan untuk penyampaian ke OJK.',
        sideFlowLabel: en ? 'Analysis Flow' : 'Alur Analisa',
        sideFlowTitle: en ? 'A structured and consistent analysis approach' : 'Pendekatan analisa yang terstruktur dan konsisten',
        sideFlowDesc: en ? 'Start with the pillar and chapter map to understand regulatory scope, then explore requirements in detail, and finish with the appendix board to review assessment formats, reporting artifacts, and relevant documentation references.' : 'Analisa dapat diawali dari peta pilar dan bab untuk memahami cakupan regulasi, kemudian dilanjutkan ke eksplorasi requirement untuk meninjau kewajiban secara rinci, serta ditutup dengan board lampiran untuk melihat format penilaian, artefak pelaporan, dan rujukan dokumentasi yang relevan.',
        sideNoteLabel: en ? 'Regulatory Notes' : 'Catatan Regulasi',
        sideNoteDesc: en ? 'This SEOJK emphasizes annual assessment at end-of-December positions, reporting within 15 working days after year-end, and the use of official appendices for scoring and self-assessment documentation.' : 'SEOJK ini menekankan penilaian tahunan pada posisi akhir Desember, pelaporan paling lama 15 hari kerja setelah akhir tahun pelaporan, dan penggunaan lampiran resmi untuk scoring serta dokumentasi self-assessment.',
        tab1Label: en ? 'Program Summary' : 'Ringkasan Program',
        tab1Desc: en ? 'Pillar map, regulatory chapters, and core assessment elements.' : 'Peta pilar, bab regulasi, dan elemen penilaian inti.',
        tab2Label: en ? 'Explorer' : 'Eksplorasi',
        tab2Desc: en ? 'Filter requirements, read interpretations, and trace related appendices.' : 'Filter requirement, baca interpretasi, dan telusuri lampiran terkait.',
        tab3Label: en ? 'Appendices & Reports' : 'Lampiran & Laporan',
        tab3Desc: en ? 'Reference board for official appendices and OJK reporting formats.' : 'Board referensi lampiran resmi dan format pelaporan ke OJK.',
        pillarLandscape: en ? 'Regulatory pillar landscape' : 'Lanskap pilar regulasi',
        pillarLandscapeDesc: en ? 'These pillars serve as the primary working lens for reading SEOJK. Click a bar to jump to the explorer with relevant filters.' : 'Pilar ini dipakai sebagai lensa kerja utama untuk membaca SEOJK: assessment, governance, resilience, testing, organization, dan reporting. Klik salah satu bar untuk langsung lompat ke eksplorasi dengan filter yang relevan.',
        chapterHotspot: en ? 'Chapter hotspots' : 'Hotspot per bab',
        chapterHotspotDesc: en ? 'Chapter distribution helps identify where regulations provide the most operational guidance.' : 'Distribusi bab membantu melihat di mana regulasi paling banyak memberi arahan operasional: penilaian, proses ketahanan, pengujian, atau struktur organisasi siber.',
        assessTitle: en ? 'Core assessment elements' : 'Elemen penilaian inti',
        appendixMap: en ? 'Appendix map' : 'Peta lampiran',
        appendixMapDesc: en ? 'Appendices in this SEOJK are more than supplements — they are the official source of formats, minimum controls, and rating definitions used during self-assessment and reporting.' : 'Lampiran di SEOJK ini bukan sekadar pelengkap. Ia menjadi sumber format resmi, kontrol minimum, dan definisi rating yang dipakai saat Bank menyusun self-assessment dan laporan.',
        filterWorkspace: en ? 'Filter Workspace' : 'Filter Workspace',
        reqList: en ? 'Requirements list' : 'Daftar requirement',
        reqEmpty: en ? 'No requirements match the current filters.' : 'Tidak ada requirement yang cocok dengan filter saat ini.',
        reqInspectorEmpty: en ? 'Select a requirement to read details.' : 'Pilih requirement untuk membaca detail.',
        reqSummaryLabel: en ? 'Requirement Summary' : 'Ringkasan Requirement',
        reqSummaryEmpty: en ? 'Select a requirement to read the summary.' : 'Pilih requirement untuk membaca ringkasan.',
        analogyLabel: en ? 'Analogy' : 'Analogi',
        focusLabel: en ? 'Implementation Focus' : 'Fokus Implementasi',
        focusEmpty: en ? 'No additional implementation focus.' : 'Tidak ada fokus implementasi tambahan.',
        evidenceLabel: en ? 'Example Evidence' : 'Contoh Evidence',
        evidenceEmpty: en ? 'No evidence cues.' : 'Tidak ada evidence cue.',
        appendixRelated: en ? 'Related Appendices' : 'Lampiran Terkait',
        appendixEmpty: en ? 'This requirement does not reference specific appendices.' : 'Requirement ini tidak menunjuk lampiran spesifik.',
        reportingLabel: en ? 'Reporting / Output' : 'Pelaporan / Output',
        divisionLabel: en ? 'Division Translation' : 'Terjemahan Divisi',
        divisionEmpty: en ? 'No specific guidance for this division yet. Please refer to the main guide.' : 'Belum ada panduan spesifik untuk divisi ini. Silakan rujuk panduan utama.',
        filterChapter: en ? 'Chapter' : 'Bab',
        filterAllChapters: en ? 'All chapters' : 'Semua bab',
        filterSearch: en ? 'Search requirements' : 'Cari requirement',
        filterSearchPlaceholder: en ? 'Search by ID, title, summary, or appendix' : 'Cari ID, judul, ringkasan, atau lampiran',
        filterReset: en ? 'Reset filters' : 'Atur ulang filter',
        refFilter: en ? 'Filter appendices' : 'Filter lampiran',
        refBoard: en ? 'Appendix board' : 'Board lampiran',
        refTypeLabel: en ? 'Appendix Type' : 'Jenis Lampiran',
        refTypeAll: en ? 'All types' : 'Semua jenis',
        refSearch: en ? 'Search appendices' : 'Cari lampiran',
        refSearchPlaceholder: en ? 'Search by ID, title, type, or scope' : 'Cari ID, judul, jenis, atau scope',
        refShown: en ? 'Appendices Shown' : 'Lampiran Ditampilkan',
        refShownEmpty: en ? 'No appendices match the current filters.' : 'Tidak ada lampiran yang cocok dengan filter saat ini.',
        refOutputNote: en ? 'Reporting Output' : 'Keluaran Pelaporan',
        refOutputDesc: en ? 'Inherent risk results, maturity assessments, and cybersecurity risk levels all feed into the IT condition report using Appendix V.' : 'Hasil risiko inheren, penilaian maturitas, dan tingkat risiko keamanan siber seluruhnya bermuara ke laporan kondisi terkini penyelenggaraan TI Bank menggunakan Lampiran V.',
        refEmpty: en ? 'No appendices match the current filters.' : 'Tidak ada lampiran yang cocok dengan filter saat ini.',
        modalSummary: en ? 'Summary' : 'Ringkasan',
        modalArtifacts: en ? 'Artifacts / Main Contents' : 'Artefak / Isi Utama',
        modalArtifactsEmpty: en ? 'No artifacts mapped.' : 'Tidak ada artefak yang dipetakan.',
        modalReqUsing: en ? 'Requirements Using This' : 'Requirement yang Menggunakannya',
        modalReqEmpty: en ? 'No requirements have been mapped to this appendix.' : 'Belum ada requirement yang dipetakan ke lampiran ini.',
        appendixCountLabel: en ? 'appendices' : 'lampiran',
        reqCountLabel: en ? 'requirements' : 'lampiran',
        chaptersActiveChip: en ? 'active chapters' : 'bab aktif',
      };
    },
  },
  methods: {
    getRoleIcon(roleId) {
      if (roleId === "sysadmin") return "fa-user-shield";
      if (roleId === "legal") return "fa-balance-scale";
      if (roleId === "board") return "fa-user-tie";
      return "fa-user-tag";
    },
    getRoleName(roleId) {
      if (roleId === "sysadmin") return "SysAdmin";
      if (roleId === "legal") return "Legal & Compliance";
      if (roleId === "board") return "Board of Directors";
      return roleId;
    },
    getPillarColor(p) { return this.pillarMeta[p]?.color || '#144e72'; },
    getPillarLabel(p) { return this.isEn ? (this.pillarMeta[p]?.labelEn || p || '-') : (this.pillarMeta[p]?.label || p || '-'); },
    getChapterLabel(c) { return (c || '-') + '. ' + (this.isEn ? (this.chapterMeta[c]?.labelEn || '') : (this.chapterMeta[c]?.label || '')); },
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
          fetch(`/data/${localStorage.getItem('language') === 'en' ? 'seojk_requirements_en.json' : 'seojk_requirements.json'}?t=${new Date().getTime()}`),
          fetch(`/data/${localStorage.getItem('language') === 'en' ? 'seojk_appendices_en.json' : 'seojk_appendices.json'}?t=${new Date().getTime()}`)
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
        console.error('Error loading SEOJK data:', error);
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
.role-translation-box { margin-bottom: 0.85rem; animation: highlight-role 0.5s ease; }
.role-translation-box .sej-label { color: #144e72; }
[data-bs-theme="dark"] .role-translation-box .sej-label { color: #48cae4; }
.role-callout { background: linear-gradient(135deg, rgba(20, 78, 114, 0.08) 0%, rgba(72, 202, 228, 0.08) 100%); border-color: rgba(20, 78, 114, 0.2); border-left: 4px solid #144e72; font-weight: 600; color: #144e72; }
[data-bs-theme="dark"] .role-callout { background: linear-gradient(135deg, rgba(72, 202, 228, 0.1) 0%, rgba(15, 118, 110, 0.1) 100%); border-color: rgba(72, 202, 228, 0.2); border-left: 4px solid #48cae4; color: #e2e8f0; }
@keyframes highlight-role { from { transform: translateY(-5px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.sej-page{--ink:#14263b;--muted:#5c6776;--line:rgba(20,38,59,.1);--shell:linear-gradient(180deg,#f6efe3 0%,#edf5f6 100%);--accent-muted:rgba(20,78,114,0.1);color:var(--ink);padding:.25rem;border-radius:32px;background:var(--shell);transition:all 0.3s ease}
[data-bs-theme="dark"] .sej-page{--ink:#f8fafc;--muted:#94a3b8;--line:rgba(255,255,255,.1);--shell:linear-gradient(180deg,#0f172a 0%,#1e293b 100%);--accent-muted:rgba(255,255,255,0.05)}
.sej-shell{display:grid;gap:1rem}
.sej-hero{display:grid;grid-template-columns:1.55fr .92fr;gap:1.2rem;align-items:stretch;min-height:368px;padding:1.45rem;border-radius:28px;overflow:hidden;position:relative;background:radial-gradient(circle at top right,rgba(248,214,161,.88),transparent 30%),radial-gradient(circle at bottom left,rgba(156,210,219,.7),transparent 28%),linear-gradient(135deg,#132a43 0%,#1f5f78 46%,#f2debb 100%);box-shadow:0 20px 44px rgba(15,23,42,.09)}
.sej-hero>*{position:relative;z-index:1}
.sej-kicker{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem .7rem;border-radius:999px;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.sej-title{margin:1rem 0 .7rem;color:#fffaf2;font-size:clamp(2rem,3.8vw,3rem);font-weight:800;line-height:1.04}
.sej-lede{margin:0;max-width:720px;color:rgba(255,250,242,.82);line-height:1.7}
.sej-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:.65rem;margin-top:1.1rem}
.sej-metric,.sej-side,.sej-panel,.sej-mini{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,251,245,.98) 0%,rgba(246,251,252,.98) 100%);box-shadow:0 14px 28px rgba(15,23,42,.05)}
[data-bs-theme="dark"] .sej-metric,[data-bs-theme="dark"] .sej-side,[data-bs-theme="dark"] .sej-panel,[data-bs-theme="dark"] .sej-mini{background:rgba(30,41,59,0.5);border-color:rgba(255,255,255,0.1)}
.sej-metric{padding:.68rem .74rem;border-radius:16px;background:rgba(255,250,242,.12);border-color:rgba(255,255,255,.18);min-height:96px;display:flex;flex-direction:column;justify-content:flex-start}
.sej-metric label,.sej-side label,.sej-mini label,.sej-form label,.sej-inspector small,.sej-label{display:block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.sej-metric label{color:rgba(255,250,242,.7);margin-bottom:.35rem}
.sej-metric strong{display:block;color:#fffaf2;font-size:1.5rem;font-weight:800;line-height:1}
.sej-metric span{display:block;margin-top:.34rem;color:rgba(255,250,242,.72);font-size:.76rem}
.sej-side-stack{display:grid;gap:.85rem}
.sej-side{padding:.8rem .86rem;border-radius:18px;background:rgba(255,250,242,.78);border-color:rgba(255,255,255,.24);min-height:142px}
.sej-side label{color:var(--muted);margin-bottom:.4rem}
.sej-side h3{margin:0;font-size:1rem;font-weight:800;color:var(--ink)}
.sej-side p{margin:.55rem 0 0;color:var(--muted);line-height:1.55;font-size:.84rem}
.sej-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}
.sej-tab{display:grid;grid-template-columns:auto 1fr;gap:.72rem;align-items:center;padding:.82rem .88rem;border-radius:18px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,250,242,.94) 0%,rgba(239,245,246,.94) 100%);text-align:left;color:var(--ink);box-shadow:0 12px 24px rgba(15,23,42,.04);cursor:pointer;transition:all 0.3s ease}
[data-bs-theme="dark"] .sej-tab{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}
.sej-tab.active{border-color:rgba(20,78,114,.24);box-shadow:0 18px 30px rgba(20,78,114,.1)}
[data-bs-theme="dark"] .sej-tab.active{background:rgba(30,41,59,0.9);border-color:var(--accent,#48cae4)}
.sej-tab i{width:2.35rem;height:2.35rem;display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(20,38,59,.06)}
[data-bs-theme="dark"] .sej-tab i{background:rgba(255,255,255,0.1)}
.sej-tab strong{display:block;font-size:.9rem;font-weight:800;color:var(--ink)}
.sej-tab span{display:block;margin-top:.14rem;color:var(--muted);font-size:.76rem;line-height:1.4}
.sej-grid{display:grid;gap:1rem}
.sej-grid.two{grid-template-columns:1.06fr .94fr}
.sej-panel{padding:1rem;border-radius:20px}
.sej-head{display:flex;align-items:center;justify-content:space-between;gap:.85rem;margin-bottom:.7rem}
.sej-head h3{margin:0;font-size:.98rem;font-weight:800;color:var(--ink)}
.sej-chip,.sej-pill,.sej-meta span,.sej-ref{display:inline-flex;align-items:center;gap:.3rem;padding:.24rem .52rem;border-radius:999px;font-size:.7rem;font-weight:700;line-height:1.2}
.sej-chip{background:rgba(20,38,59,.08);color:var(--ink)}
[data-bs-theme="dark"] .sej-chip{background:rgba(255,255,255,0.1)}
.sej-copy{margin:0 0 .85rem;color:var(--muted);line-height:1.6;font-size:.84rem}
.sej-bars,.sej-cards,.sej-hotspots,.sej-families{display:grid;gap:.65rem}
.sej-bar,.sej-hotspot,.sej-family{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(180px,1fr) auto;gap:.68rem;align-items:center;padding:.62rem .72rem;border-radius:16px;border:1px solid transparent;background:rgba(255,255,255,.55);text-align:left;cursor:pointer;transition:border-color .15s ease,transform .15s ease,box-shadow .15s ease}
[data-bs-theme="dark"] .sej-bar,[data-bs-theme="dark"] .sej-hotspot,[data-bs-theme="dark"] .sej-family{background:rgba(30,41,59,0.4)}
.sej-family{grid-template-columns:1fr auto}
.sej-bar:hover,.sej-hotspot:hover,.sej-family:hover,.sej-bar.active,.sej-hotspot.active,.sej-family.active{transform:translateY(-1px);border-color:rgba(20,78,114,.22);box-shadow:0 12px 22px rgba(20,78,114,.08)}
[data-bs-theme="dark"] .sej-bar:hover,[data-bs-theme="dark"] .sej-hotspot:hover,[data-bs-theme="dark"] .sej-family:hover{border-color:rgba(255,255,255,0.2)}
.sej-bar strong,.sej-hotspot strong,.sej-family strong{display:block;font-size:.86rem;color:var(--ink)}
.sej-bar em,.sej-hotspot em,.sej-family em{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem;font-style:normal}
.sej-track{height:.44rem;border-radius:999px;background:rgba(20,38,59,.08);overflow:hidden}
[data-bs-theme="dark"] .sej-track{background:rgba(255,255,255,0.1)}
.sej-track b{display:block;height:100%;border-radius:inherit}
.sej-num{min-width:2.2rem;text-align:right;font-weight:800;color:var(--ink)}
.sej-cards{grid-template-columns:repeat(3,1fr)}
.sej-card{width:100%;padding:.76rem .8rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer;transition:all 0.3s ease}
[data-bs-theme="dark"] .sej-card{background:rgba(30,41,59,0.6)}
.sej-icon{width:1.9rem;height:1.9rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(20,78,114,.12);color:var(--accent);font-size:.8rem}
[data-bs-theme="dark"] .sej-icon{background:rgba(255,255,255,0.1)}
.sej-card strong{display:block;margin-top:.42rem;font-size:.86rem;font-weight:800;color:var(--ink)}
.sej-card p{margin:.22rem 0 0;color:var(--muted);font-size:.72rem;line-height:1.4}
.sej-mini-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.65rem;margin-bottom:.8rem}
.sej-mini{padding:.72rem .78rem;border-radius:16px;text-align:center}
[data-bs-theme="dark"] .sej-mini{background:rgba(30,41,59,0.4)}
.sej-mini.text-start{text-align:left}
.sej-mini label{color:var(--muted)}
.sej-mini strong{display:block;margin-top:.2rem;font-size:1.08rem;font-weight:800;color:#144e72}
[data-bs-theme="dark"] .sej-mini strong{color:#48cae4}
.sej-mini span{display:block;margin-top:.14rem;color:var(--muted);font-size:.72rem;line-height:1.4}
.sej-workspace{display:grid;grid-template-columns:.85fr 1.15fr;gap:1rem}
.sej-filter-panel{grid-column:1 / -1}
.sej-workspace>*{min-width:0}
.sej-list>*{min-width:0}
.sej-refspace{display:grid;grid-template-columns:.82fr 1.18fr;gap:1rem}
.sej-pillar-grid{display:flex;flex-wrap:wrap;gap:.55rem;margin-bottom:.8rem}
.sej-pillar{flex:1 1 auto;padding:.62rem .68rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer;transition:all 0.3s ease}
[data-bs-theme="dark"] .sej-pillar{background:rgba(30,41,59,0.6)}
.sej-pillar.active{border-color:rgba(20,78,114,.24);background:rgba(238,245,245,.72);box-shadow:0 12px 24px rgba(20,78,114,.08)}
[data-bs-theme="dark"] .sej-pillar.active{background:rgba(30,41,59,0.9);border-color:var(--accent)}
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
.sej-item{position:relative;width:100%;padding:.7rem .78rem .66rem .88rem;margin-bottom:.55rem;border-radius:14px;border:1px solid rgba(20,38,59,.08);background:#fff;text-align:left;cursor:pointer;content-visibility:auto;contain-intrinsic-size:auto 80px;transition:all 0.3s ease}
[data-bs-theme="dark"] .sej-item{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}
.sej-item:last-child{margin-bottom:0}
.sej-item.active{border-color:rgba(20,78,114,.35);border-left-width:.28rem;background:rgba(238,245,245,.6)}
[data-bs-theme="dark"] .sej-item.active{background:rgba(30,41,59,0.9);border-color:var(--accent)}
.sej-item:before{content:'';position:absolute;left:0;top:.68rem;bottom:.68rem;width:.18rem;border-radius:999px;background:var(--accent,#144e72)}
.sej-item-top{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:space-between}
.sej-item-code,.sej-code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:.76rem;font-weight:800;color:var(--accent,#144e72)}
[data-bs-theme="dark"] .sej-item-code,[data-bs-theme="dark"] .sej-code{color:var(--accent,#48cae4)}
.sej-item-name{margin:.28rem 0 .2rem;font-size:.88rem;font-weight:700;line-height:1.38;color:var(--ink);word-wrap:break-word;overflow-wrap:break-word;max-width:100%}
.sej-item-meta{color:var(--muted);font-size:.74rem;line-height:1.4}
.sej-item-meta span+span::before{content:'•';margin:0 .4rem;color:rgba(20,38,59,.35)}
[data-bs-theme="dark"] .sej-item-meta span+span::before{color:rgba(255,255,255,.2)}
.sej-pill{padding:.2rem .45rem;font-size:.68rem;background:rgba(20,38,59,.08);color:var(--ink)}
[data-bs-theme="dark"] .sej-pill{background:rgba(255,255,255,0.1)}
.sej-inspector{position:relative;top:auto;min-height:720px;display:flex;flex-direction:column}
.sej-inspector-head{padding-bottom:.85rem;border-bottom:1px solid var(--line)}
.sej-inspector-head strong{display:block;margin-top:.35rem;font-size:1rem;font-weight:800;color:#144e72}
[data-bs-theme="dark"] .sej-inspector-head strong{color:#48cae4}
.sej-inspector-head span{display:block;margin-top:.28rem;font-size:.9rem;font-weight:800;line-height:1.4;color:var(--ink)}
.sej-inspector-body{display:grid;gap:.75rem;padding-top:.85rem;flex:1;min-height:0;overflow:auto;align-content:start}
.sej-meta{display:flex;flex-wrap:wrap;gap:.45rem}
.sej-meta span{background:rgba(20,38,59,.06);color:var(--ink);font-size:.72rem}
[data-bs-theme="dark"] .sej-meta span{background:rgba(255,255,255,0.1)}
.sej-callout,.sej-note{padding:.76rem .84rem;border-radius:16px;border:1px solid var(--line);line-height:1.62;transition:all 0.3s ease}
.sej-callout{background:rgba(255,255,255,.75)}
[data-bs-theme="dark"] .sej-callout{background:rgba(30,41,59,0.4)}
.sej-note{background:rgba(238,245,245,.84)}
[data-bs-theme="dark"] .sej-note{background:rgba(30,41,59,0.7);border-color:var(--accent)}
.sej-plain{margin:.15rem 0 0;padding-left:1rem;color:var(--muted);font-size:.78rem;line-height:1.6}
.sej-plain li{margin-bottom:.16rem}
.sej-refs{display:flex;flex-wrap:wrap;gap:.4rem}
.sej-ref{border:1px solid rgba(20,38,59,.12);background:rgba(255,255,255,.82);color:var(--ink);font-size:.7rem;cursor:pointer;transition:all 0.3s ease}
[data-bs-theme="dark"] .sej-ref{background:rgba(30,41,59,0.8);border-color:rgba(255,255,255,0.1)}
.sej-empty{padding:.9rem;border-radius:16px;border:1px dashed rgba(20,38,59,.18);background:rgba(255,255,255,.6);color:var(--muted);text-align:center;line-height:1.55;transition:all 0.3s ease}
[data-bs-theme="dark"] .sej-empty{background:rgba(30,41,59,0.3);border-color:rgba(255,255,255,0.1)}

/* Modal Styles */
.sej-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(15,23,42,.56)}.sej-modal-dialog{width:100%;max-width:780px}.sej-modal-shell{display:flex;flex-direction:column;height:85vh;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 64px rgba(15,23,42,.24),0 8px 24px rgba(15,23,42,.12)}[data-bs-theme=dark] .sej-modal-shell{background:#1e293b;color:#f8fafc}.sej-modal-sidebar{position:relative;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:.85rem;padding:1rem 1.5rem;color:#fffaf2;text-align:left;flex-shrink:0}.sej-modal-close{position:absolute;top:50%;transform:translateY(-50%);right:1.25rem;width:2.2rem;height:2.2rem;display:flex;align-items:center;justify-content:center;border:0;border-radius:12px;background:rgba(255,255,255,.2);color:#fff;cursor:pointer;transition:all .2s ease}.sej-modal-close:hover{background:rgba(255,255,255,.35)}.sej-modal-icon{width:2.4rem;height:2.4rem;display:flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(255,255,255,.2);font-size:1.05rem}.sej-modal-id{font-size:1.1rem;font-weight:800}.sej-modal-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0}.sej-modal-header{flex-shrink:0;padding:1.15rem 1.5rem 1rem;border-bottom:1px solid rgba(0,0,0,.08)}.sej-modal-title{display:block;color:#144e72;font-size:1rem;font-weight:800;margin:0}[data-bs-theme=dark] .sej-modal-title{color:#7dd3fc}.sej-modal-body{flex:1;padding:1.25rem 1.5rem;overflow-y:auto;-webkit-overflow-scrolling:touch}.sej-modal-section{margin-bottom:1.25rem}.sej-modal-section-header{display:flex;gap:.55rem;padding-bottom:.5rem;margin-bottom:.65rem;border-bottom:1px solid rgba(0,0,0,.08);font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em}.sej-modal-scope{display:inline-block;margin-bottom:.55rem;padding:.28rem .55rem;border-radius:999px;background:rgba(20,78,114,.08);color:#144e72;font-size:.72rem;font-weight:700}.sej-modal-summary{margin:0;color:var(--muted);font-size:.86rem;line-height:1.7}.sej-modal-artifact-list{display:grid;gap:.45rem;list-style:none;margin:0;padding:0}.sej-modal-artifact-list li{display:flex;gap:.55rem;padding:.62rem .75rem;border-radius:12px;background:rgba(238,245,245,.5);font-size:.84rem}[data-bs-theme=dark] .sej-modal-artifact-list li{background:rgba(255,255,255,.05)}.sej-modal-artifact-list i{margin-top:.18rem;color:#0f766e;flex-shrink:0}.sej-modal-requirements{display:flex;flex-wrap:wrap;gap:.45rem}.sej-modal-req-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.42rem .72rem;border:1px solid rgba(0,0,0,.12);border-radius:999px;background:rgba(255,255,255,.85);color:#1e293b;font-size:.76rem;font-weight:700;cursor:pointer;transition:all .15s ease}.sej-modal-req-btn:hover{background:#144e72;color:#fff;border-color:#144e72}.sej-modal-empty{padding:.9rem 1rem;border:1px dashed rgba(20,38,59,.18);border-radius:12px;color:var(--muted);font-size:.84rem}.sej-fade-enter-active,.sej-fade-leave-active{transition:opacity .2s ease,transform .2s ease}.sej-fade-enter-from,.sej-fade-leave-to{opacity:0;transform:scale(.96)}
[data-bs-theme="dark"] .sej-modal-empty{background:rgba(30,41,59,0.3);border-color:rgba(255,255,255,0.1)}

/* Modal Transitions */
.modal-fade-enter-active,.modal-fade-leave-active{transition:opacity .2s ease}
.modal-fade-enter-from,.modal-fade-leave-to{opacity:0}
.modal-slide-enter-active{transition:transform .25s ease-out,opacity .25s ease-out}
.modal-slide-leave-active{transition:transform .2s ease-in,opacity .2s ease-in}
.modal-slide-enter-from,.modal-slide-leave-to{transform:translateY(16px) scale(.97);opacity:0}
@keyframes modalSlideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width:1440px){.sej-hero { min-height: 280px; padding: 1.25rem; } .sej-title { font-size: clamp(1.8rem, 3.2vw, 2.5rem); margin: 0.8rem 0 0.5rem; } .sej-metric { min-height: 80px; padding: 0.55rem 0.65rem; } .sej-metric strong { font-size: 1.35rem; } .sej-list, .sej-inspector { min-height: auto; max-height: 520px; }}
@media (max-height:850px) and (min-width:1024px){.sej-hero { min-height: 240px; padding: 1.15rem; } .sej-metrics { margin-top: 0.6rem; } .sej-list, .sej-inspector { max-height: calc(100vh - 280px); } .sej-inspector-body { padding-top: 0.5rem; }}
@media (max-width:991.98px){.sej-workspace,.sej-refspace{grid-template-columns:1fr}.sej-inspector{position:static;min-height:auto}}
@media (max-width:1199.98px){.sej-hero,.sej-metric,.sej-side{min-height:auto}.sej-hero,.sej-nav,.sej-grid.two,.sej-refspace,.sej-metrics,.sej-mini-row,.sej-cards{grid-template-columns:1fr}.sej-bar,.sej-hotspot,.sej-family{grid-template-columns:1fr}}
@media (max-width:767.98px){.sej-hero,.sej-panel{padding:1.2rem;border-radius:22px}.sej-pillar-grid{grid-template-columns:1fr}.sej-modal-shell{display:grid;grid-template-rows:auto minmax(0, 1fr);max-height:85vh;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 64px rgba(15,23,42,.24),0 8px 24px rgba(15,23,42,.12)}.sej-modal-sidebar{position:relative;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:.85rem;padding:1rem 1.5rem;color:#fffaf2;text-align:left;flex-shrink:0}.sej-modal-icon{width:2.4rem;height:2.4rem;display:flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(255,255,255,.2);font-size:1.05rem;margin-bottom:0}.sej-modal-close{position:absolute;top:50%;transform:translateY(-50%);right:1.25rem;width:2.2rem;height:2.2rem;display:flex;align-items:center;justify-content:center;border:0;border-radius:12px;background:rgba(255,255,255,.2);color:#fff;cursor:pointer;transition:all .2s ease}.sej-modal-dialog{max-width:100%}}
</style>
