<template>
  <div class="pojk-page">
    <!-- Skeleton loader dengan dimensi sama persis seperti konten asli untuk mencegah CLS -->
    <div v-if="loading" class="skeleton-shell" aria-hidden="true" aria-label="Loading...">
      <div class="skeleton-hero">
        <div class="skeleton-block" style="height:2rem;width:55%;border-radius:8px;"></div>
        <div class="skeleton-block" style="height:1rem;width:90%;border-radius:6px;margin-top:0.75rem;"></div>
        <div class="skeleton-block" style="height:1rem;width:75%;border-radius:6px;margin-top:0.4rem;"></div>
        <div class="skeleton-metrics">
          <div class="skeleton-block skeleton-metric"></div>
          <div class="skeleton-block skeleton-metric"></div>
          <div class="skeleton-block skeleton-metric"></div>
          <div class="skeleton-block skeleton-metric"></div>
        </div>
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
    <div v-else class="pojk-shell">
      <section class="pojk-hero">
        <div>
          <span class="pojk-kicker"><i class="fas fa-microchip"></i>Regulasi Nasional</span>
          <h1 class="pojk-title">POJK 11/POJK.03/2022 Penyelenggaraan TI Bank Umum</h1>
          <p class="pojk-lede">{{ ui.heroLede }}</p>
          <div class="pojk-metrics">
            <div class="pojk-metric"><label>{{ ui.metaChapters }}</label><strong>{{ totalChapters }}</strong><span>{{ ui.metaChaptersDesc }}</span></div>
            <div class="pojk-metric"><label>{{ ui.metaRequirements }}</label><strong>{{ totalRequirements }}</strong><span>{{ ui.metaRequirementsDesc }}</span></div>
            <div class="pojk-metric"><label>{{ ui.metaAppendices }}</label><strong>{{ totalAppendices }}</strong><span>{{ ui.metaAppendicesDesc }}</span></div>
            <div class="pojk-metric"><label>{{ ui.metaSla }}</label><strong>{{ reportingSla }} jam</strong><span>{{ ui.metaSlaDesc }}</span></div>
          </div>
        </div>
        <div class="pojk-side-stack">
          <div class="pojk-side"><label>{{ ui.sideFlowLabel }}</label><h3>{{ ui.sideFlowTitle }}</h3><p>{{ ui.sideFlowDesc }}</p></div>
          <div class="pojk-side"><label>{{ ui.sideNoteLabel }}</label><p>{{ ui.sideNoteDesc }}</p></div>
        </div>
      </section>

      <div class="pojk-nav nav" role="tablist">
        <button class="pojk-tab" :class="{ active: activeTab === 'overview' }" type="button" role="tab" @click="activeTab = 'overview'"><i class="fas fa-chart-line"></i><span><strong>{{ ui.tab1Label }}</strong><span>{{ ui.tab1Desc }}</span></span></button>
        <button class="pojk-tab" :class="{ active: activeTab === 'explorer' }" type="button" role="tab" @click="activeTab = 'explorer'"><i class="fas fa-sliders-h"></i><span><strong>{{ ui.tab2Label }}</strong><span>{{ ui.tab2Desc }}</span></span></button>
        <button class="pojk-tab" :class="{ active: activeTab === 'reference' }" type="button" role="tab" @click="activeTab = 'reference'"><i class="fas fa-folder-open"></i><span><strong>{{ ui.tab3Label }}</strong><span>{{ ui.tab3Desc }}</span></span></button>
      </div>

      <div class="tab-content pojk-grid">
        <!-- Tab 1: Ringkasan Program -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="pojk-grid two">
            <article class="pojk-panel">
              <div class="pojk-head"><h3>{{ ui.pillarLandscape }}</h3><span class="pojk-chip">{{ pillarBreakdown.length }} pilar</span></div>
              <p class="pojk-copy">{{ ui.pillarLandscapeDesc }}</p>
              <div class="pojk-bars">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="pojk-bar" @click="jumpExplorer(item.key)"><span><strong>{{ item.label }}</strong><em>{{ item.summary }}</em></span><span class="pojk-track"><b :style="{ width: (item.count / maxPillarCount) * 100 + '%', background: item.color }"></b></span><span class="pojk-num">{{ item.count }}</span></button>
              </div>
            </article>
            <article class="pojk-panel">
              <div class="pojk-head"><h3>{{ ui.chapterHotspot }}</h3><span class="pojk-chip">{{ totalChapters }} {{ ui.chaptersActiveChip }}</span></div>
              <p class="pojk-copy">{{ ui.chapterHotspotDesc }}</p>
              <div class="pojk-hotspots">
                <button v-for="item in chapterBreakdown" :key="item.key" type="button" class="pojk-hotspot" @click="jumpExplorer('', item.key)"><span><strong>{{ item.key }}. {{ item.label }}</strong><em>{{ item.summary }}</em></span><span class="pojk-track"><b :style="{ width: (item.count / maxChapterCount) * 100 + '%', background: item.color }"></b></span><span class="pojk-num">{{ item.count }}</span></button>
              </div>
            </article>
          </div>
          <div class="pojk-grid two">
            <article class="pojk-panel">
              <div class="pojk-head"><h3>{{ ui.assessTitle }}</h3><span class="pojk-chip">Compliance blueprint</span></div>
              <div class="pojk-mini-row">
                <div class="pojk-mini"><label>Governance Blueprint</label><strong>Strategi & Arsitektur</strong><span>Arah bisnis, akuntabilitas pengurus, Komite Pengarah TI, arsitektur, dan rencana strategis.</span></div>
                <div class="pojk-mini"><label>Operational Resilience</label><strong>Risk to Recover</strong><span>Manajemen risiko, pengamanan informasi, DRP, ketahanan siber, serta pengelolaan pihak ketiga.</span></div>
                <div class="pojk-mini"><label>Regulatory Delivery</label><strong>License + Report</strong><span>Perizinan lintas negara, pelaporan rutin, notifikasi insiden, realisasi, audit, dan maturitas digital.</span></div>
              </div>
              <div class="pojk-note">POJK ini adalah payung penyelenggaraan TI Bank: tata kelola dan perencanaan harus terhubung dengan kontrol operasional, ketahanan siber, pengelolaan data, pengawasan pihak ketiga, dan disiplin pelaporan regulator.</div>
            </article>
            <article class="pojk-panel">
              <div class="pojk-head"><h3>{{ ui.appendixMap }}</h3><span class="pojk-chip">{{ totalAppendices }} referensi</span></div>
              <p class="pojk-copy">{{ ui.appendixMapDesc }}</p>
              <div class="pojk-cards">
                <button v-for="item in appendixTypeBreakdown" :key="item.type" type="button" class="pojk-card" :style="{ '--accent': item.color }" @click="jumpAppendix('', item.type)"><div class="pojk-card-top"><span class="pojk-icon"><i class="fas fa-layer-group"></i></span><span>{{ item.count }} referensi</span></div><strong>{{ item.type }}</strong><p>Lompat ke board referensi dengan filter jenis ini.</p></button>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 2: Eksplorasi -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="pojk-workspace">
            <article class="pojk-panel pojk-filter-panel">
              <div class="pojk-head"><h3>{{ ui.filterWorkspace }}</h3><span class="pojk-chip">{{ totalRequirements }} requirement</span></div>
              <div class="pojk-pillar-grid">
                <button v-for="item in pillarBreakdown" :key="item.key" type="button" class="pojk-pillar" :class="{ active: activePillar === item.key }" :style="{ '--accent': item.color }" @click="togglePillar(item.key)"><strong>{{ item.label }}</strong><span>{{ item.count }} requirement</span></button>
              </div>
              <div class="pojk-form">
                <div><label for="chapterFilter">{{ ui.filterChapter }}</label><select id="chapterFilter" v-model="chapterFilter" class="form-select"><option value="">{{ ui.filterAllChapters }}</option><option v-for="ch in chapterBreakdown" :key="ch.key" :value="ch.key">{{ ch.key }}. {{ ch.label }}</option></select></div>
                <div><label for="requirementSearch">{{ ui.filterSearch }}</label><input id="requirementSearch" v-model="requirementSearch" type="search" class="form-control" :placeholder="ui.filterSearchPlaceholder"></div>
                <button type="button" class="btn btn-outline-secondary" @click="resetRequirementFilters">{{ ui.filterReset }}</button>
              </div>
            </article>
            <article class="pojk-panel">
              <div class="pojk-head"><h3>{{ ui.reqList }}</h3><span class="pojk-chip">{{ filteredRequirements.length }} entri</span></div>
              <div class="pojk-list">
                <button v-for="req in filteredRequirements" :data-search-id="req.id" :key="req.id" type="button" class="pojk-item" :class="{ active: activeRequirementId === req.id }" :style="{ '--accent': getPillarColor(req.pillar) }" @click="setActiveRequirement(req.id)"><div class="pojk-item-top"><span class="pojk-item-code">{{ req.id }}</span><span class="pojk-pill">{{ getPillarLabel(req.pillar) }}</span></div><div class="pojk-item-name">{{ req.title || '-' }}</div><div class="pojk-item-meta"><span>{{ getChapterLabel(req.chapter) }}</span><span>{{ (req.appendices || []).length }} referensi</span></div></button>
                <div v-if="filteredRequirements.length === 0" class="pojk-empty">{{ ui.reqEmpty }}</div>
              </div>
            </article>
            <article class="pojk-panel pojk-inspector">
              <div class="pojk-inspector-head"><small>Requirement Inspector</small><strong>{{ activeRequirement ? activeRequirement.id : '-' }}</strong><span>{{ activeRequirement ? activeRequirement.title : ui.reqInspectorEmpty }}</span></div>
              <div class="pojk-inspector-body">
                <div class="pojk-meta"><span>{{ activeRequirement ? getPillarLabel(activeRequirement.pillar) : '-' }}</span><span>{{ activeRequirement ? getChapterLabel(activeRequirement.chapter) : '-' }}</span><span>{{ activeRequirement ? activeRequirement.legal_basis || '-' : '-' }}</span><span>{{ activeRequirement ? activeRequirement.cadence || '-' : '-' }}</span><span>{{ activeRequirement ? (activeRequirement.appendices || []).length + ' referensi' : '0 referensi' }}</span></div>

                <div v-if="activeRole !== 'default' && activeRequirement" class="role-translation-box">
                  <span class="pojk-label">
                    <i :class="getRoleIcon(activeRole)" class="me-1"></i> {{ ui.divisionLabel }} ({{ getRoleName(activeRole) }})
                  </span>
                  <div class="pojk-callout role-callout mt-2">
                    {{ (activeRequirement.roleTranslations && activeRequirement.roleTranslations[activeRole]) ? activeRequirement.roleTranslations[activeRole] : ui.divisionEmpty }}
                  </div>
                </div>

                <div v-if="activeRequirement" class="pojk-callout"><span class="pojk-label">{{ ui.ownerLabel }}</span><div class="mt-2">{{ activeRequirement.owner || '-' }}</div></div>
                <div class="pojk-callout"><span class="pojk-label">{{ ui.reqSummaryLabel }}</span><div class="mt-2">{{ activeRequirement ? activeRequirement.summary : ui.reqSummaryEmpty }}</div></div>
                <div class="pojk-note"><span class="pojk-label"><i class="fas fa-lightbulb me-1"></i>{{ ui.analogyLabel }}</span><div class="mt-2">{{ activeRequirement ? activeRequirement.analogy : '-' }}</div></div>
                <div class="pojk-callout"><span class="pojk-label">{{ ui.focusLabel }}</span><ul class="pojk-plain"><li v-for="(item, idx) in (activeRequirement && activeRequirement.focus && activeRequirement.focus.length ? activeRequirement.focus : [ui.focusEmpty])" :key="idx">{{ item }}</li></ul></div>
                <div class="pojk-callout"><span class="pojk-label">{{ ui.evidenceLabel }}</span><ul class="pojk-plain"><li v-for="(item, idx) in (activeRequirement && activeRequirement.evidence && activeRequirement.evidence.length ? activeRequirement.evidence : [ui.evidenceEmpty])" :key="idx">{{ item }}</li></ul></div>
                <div class="pojk-callout"><span class="pojk-label">{{ ui.appendixRelated }}</span><div class="pojk-refs"><button v-for="ref in (activeRequirement?.appendices || [])" :key="ref" type="button" class="pojk-ref" @click="jumpAppendix(ref)">{{ ref }}</button><span v-if="!activeRequirement || !activeRequirement.appendices || !activeRequirement.appendices.length" class="pojk-empty w-100">{{ ui.appendixEmpty }}</span></div></div>
                <div class="pojk-note"><span class="pojk-label">{{ ui.reportingLabel }}</span><div class="mt-2">{{ activeRequirement ? (activeRequirement.reporting || '-') : '-' }}</div></div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 3: Referensi & Pelaporan -->
        <div v-if="activeTab === 'reference'" key="reference-tab">
          <div class="pojk-refspace">
            <article class="pojk-panel">
              <div class="pojk-head"><h3>{{ ui.refFilter }}</h3><span class="pojk-chip">{{ totalAppendices }} {{ ui.appendixCountLabel }}</span></div>
              <div class="pojk-form">
                <div><label for="appendixTypeFilter">{{ ui.refTypeLabel }}</label><select id="appendixTypeFilter" v-model="appendixTypeFilter" class="form-select"><option value="">{{ ui.refTypeAll }}</option><option v-for="item in appendixTypeBreakdown" :key="item.type" :value="item.type">{{ item.type }}</option></select></div>
                <div><label for="appendixSearch">{{ ui.refSearch }}</label><input id="appendixSearch" v-model="appendixSearch" type="search" class="form-control" :placeholder="ui.refSearchPlaceholder"></div>
                <button type="button" class="btn btn-outline-secondary" @click="resetAppendixFilters">{{ ui.filterReset }}</button>
              </div>
              <div class="pojk-summary"><small>{{ ui.refShown }}</small><strong>{{ filteredAppendices.length }}</strong><span>{{ filteredAppendices.length ? `${ui.refShown}: ${filteredAppendices.length}` : ui.refShownEmpty }}</span></div>
              <div class="pojk-families mt-3">
                <button v-for="item in appendixTypeBreakdown" :key="item.type" type="button" class="pojk-family" :class="{ active: appendixTypeFilter === item.type }" :style="{ '--accent': item.color }" @click="appendixTypeFilter = appendixTypeFilter === item.type ? '' : item.type"><span><strong>{{ item.type }}</strong><em>{{ item.count }} referensi</em></span><span class="pojk-num">{{ item.count }}</span></button>
              </div>
              <div class="pojk-note mt-3"><span class="pojk-label">{{ ui.refOutputNote }}</span>{{ ui.refOutputDesc }}</div>
            </article>
            <article class="pojk-panel">
              <div class="pojk-head"><h3>{{ ui.refBoard }}</h3><span class="pojk-chip">{{ filteredAppendices.length }} entri</span></div>
              <div class="pojk-list">
                <button v-for="app in filteredAppendices" :key="app.id" type="button" class="pojk-item" @click="openAppendixModal(app)"><div class="pojk-item-top"><span class="pojk-item-code">{{ app.id }}</span><span class="pojk-pill">{{ app.type }}</span></div><div class="pojk-item-name">{{ app.title || '-' }}</div><div class="pojk-item-meta"><span>{{ (app.used_by || []).length }} kewajiban</span></div></button>
                <div v-if="filteredAppendices.length === 0" class="pojk-empty">{{ ui.refEmpty }}</div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Referensi -->
  <Transition name="pojk-fade">
    <div v-if="showAppendixModal" class="pojk-overlay" @click.self="showAppendixModal = false">
      <Transition name="modal-slide">
        <div class="pojk-modal-dialog" v-if="showAppendixModal">
          <div class="pojk-modal-shell">
            <div class="pojk-modal-sidebar" :style="{ background: `linear-gradient(180deg, ${getAppendixColor(selectedAppendix?.type)} 0%, ${getAppendixColor(selectedAppendix?.type, 0.7)} 100%)` }">
              <button type="button" class="pojk-modal-close" @click="showAppendixModal = false" aria-label="Close">
                <i class="fas fa-times"></i>
              </button>
              <div class="pojk-modal-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="pojk-modal-id">{{ selectedAppendix?.id || '-' }}</div>
              <div class="pojk-modal-type">{{ selectedAppendix?.type || '' }}</div>
            </div>
            <div class="pojk-modal-main">
              <div class="pojk-modal-header">
                <h4 class="pojk-modal-title">{{ selectedAppendix?.title || 'Detail Referensi' }}</h4>
              </div>
              <div class="pojk-modal-body">
                <!-- Ringkasan Section -->
                <div class="pojk-modal-section">
                  <div class="pojk-modal-section-header" :style="{ color: getAppendixColor(selectedAppendix?.type) }">
                    <i class="fas fa-info-circle"></i>
                    <span>{{ ui.modalSummary }}</span>
                  </div>
                  <div class="modal-section-content">
                    <div class="pojk-modal-scope">{{ selectedAppendix?.scope || '-' }}</div>
                    <p class="pojk-modal-summary">{{ selectedAppendix?.summary || '-' }}</p>
                  </div>
                </div>

                <!-- Artefak Section -->
                <div class="pojk-modal-section">
                  <div class="pojk-modal-section-header" :style="{ color: getAppendixColor(selectedAppendix?.type) }">
                    <i class="fas fa-list-check"></i>
                    <span>{{ ui.modalArtifacts }}</span>
                  </div>
                  <div class="modal-section-content">
                    <ul class="pojk-modal-artifact-list">
                      <li v-for="(item, idx) in (selectedAppendix?.contains && selectedAppendix.contains.length ? selectedAppendix.contains : [])" :key="idx">
                        <i class="fas fa-check-circle"></i>
                        <span>{{ item }}</span>
                      </li>
                      <li v-if="!selectedAppendix?.contains || !selectedAppendix.contains.length" class="pojk-modal-empty">
                        {{ ui.modalArtifactsEmpty }}
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Requirements Section -->
                <div class="pojk-modal-section">
                  <div class="pojk-modal-section-header" :style="{ color: getAppendixColor(selectedAppendix?.type) }">
                    <i class="fas fa-link"></i>
                    <span>{{ ui.modalReqUsing }}</span>
                  </div>
                  <div class="modal-section-content">
                    <div class="pojk-modal-requirements">
                      <button v-for="reqId in (selectedAppendix?.used_by || [])" :key="reqId" type="button" class="pojk-modal-req-btn" @click="jumpToRequirement(reqId)">
                        <i class="fas fa-arrow-right"></i>
                        <span>{{ reqId }}</span>
                      </button>
                      <div v-if="!selectedAppendix?.used_by || !selectedAppendix.used_by.length" class="pojk-modal-empty">
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
import searchDeepLink from '../mixins/searchDeepLink';
import { mapState } from "pinia";
import { useFrameworkStore } from "../stores/frameworkStore";

export default {
  name: 'Pojk',
  mixins: [searchDeepLink],
  data() {
    return {
      loading: true,
      error: null,
      activeTab: 'overview',
      requirements: [],
      appendices: [],
      pillarMeta: {
        'Tata Kelola & Strategi': { label: 'Tata Kelola & Strategi', labelEn: 'Governance & Strategy', color: '#1d4ed8', icon: 'fa-sitemap', summary: 'Arah TI, akuntabilitas pengurus, arsitektur, dan rencana strategis.', summaryEn: 'IT direction, board accountability, architecture, and strategic planning.' },
        'Risiko & Ketahanan Operasional': { label: 'Risiko & Ketahanan Operasional', labelEn: 'Risk & Operational Resilience', color: '#0f766e', icon: 'fa-shield-alt', summary: 'Risiko TI, pengamanan informasi, jaringan, DRP, dan operasi kritikal.', summaryEn: 'IT risk, information security, networks, DRP, and critical operations.' },
        'Ketahanan Siber': { label: 'Ketahanan Siber', labelEn: 'Cyber Resilience', color: '#c2410c', icon: 'fa-user-shield', summary: 'Siklus keamanan siber, pengujian, maturitas, dan independensi fungsi.', summaryEn: 'Cyber lifecycle, testing, maturity, and function independence.' },
        'Pihak Ketiga & Cross-Border': { label: 'Pihak Ketiga & Cross-Border', labelEn: 'Third Party & Cross-Border', color: '#7c3aed', icon: 'fa-globe-asia', summary: 'Vendor, lokasi Sistem Elektronik, perizinan, dan transaksi lintas negara.', summaryEn: 'Vendors, electronic-system location, licensing, and cross-border transactions.' },
        'Data & Pelindungan Privasi': { label: 'Data & Pelindungan Privasi', labelEn: 'Data & Privacy Protection', color: '#15803d', icon: 'fa-database', summary: 'Data governance, pelindungan data pribadi, DPIA, dan pertukaran data.', summaryEn: 'Data governance, privacy protection, DPIA, and data sharing.' },
        'Pengendalian, Audit & Pelaporan': { label: 'Pengendalian, Audit & Pelaporan', labelEn: 'Controls, Audit & Reporting', color: '#b91c1c', icon: 'fa-clipboard-check', summary: 'Pengendalian intern, audit TI, laporan rutin, insiden, dan realisasi.', summaryEn: 'Internal controls, IT audit, periodic reports, incidents, and realization.' },
        'Maturitas & Transisi': { label: 'Maturitas & Transisi', labelEn: 'Maturity & Transition', color: '#144e72', icon: 'fa-chart-line', summary: 'Maturitas digital, penyesuaian awal, dan ketentuan penutup.', summaryEn: 'Digital maturity, transition, and closing provisions.' },
      },
      chapterMeta: {
        'II': { label: 'Tata Kelola TI', labelEn: 'IT Governance', color: '#1d4ed8', icon: 'fa-sitemap', summary: 'Prinsip tata kelola, pengurus, komite, dan unit penyelenggara TI.', summaryEn: 'Governance principles, executives, committee, and IT operating unit.' },
        'III': { label: 'Arsitektur dan Strategi TI', labelEn: 'IT Architecture & Strategy', color: '#2563eb', icon: 'fa-route', summary: 'Arsitektur dan rencana strategis yang mendukung rencana korporasi.', summaryEn: 'Architecture and strategic plan supporting the corporate plan.' },
        'IV': { label: 'Manajemen Risiko TI', labelEn: 'IT Risk Management', color: '#0f766e', icon: 'fa-shield-alt', summary: 'Risiko, pengamanan informasi, jaringan, DRP, dan UUS.', summaryEn: 'Risk, information security, networks, DRP, and Islamic business units.' },
        'V': { label: 'Ketahanan dan Keamanan Siber', labelEn: 'Cyber Resilience & Security', color: '#c2410c', icon: 'fa-user-shield', summary: 'Ketahanan siber, maturity, testing, dan fungsi independen.', summaryEn: 'Cyber resilience, maturity, testing, and independent function.' },
        'VI': { label: 'Penyedia Jasa TI', labelEn: 'IT Service Providers', color: '#7c3aed', icon: 'fa-handshake', summary: 'Pemilihan, kontrak, risiko, pemantauan, dan exit penyedia.', summaryEn: 'Provider selection, contract, risk, monitoring, and exit.' },
        'VII': { label: 'Sistem Elektronik dan Transaksi', labelEn: 'Electronic Systems & Transactions', color: '#9333ea', icon: 'fa-globe-asia', summary: 'Lokasi sistem, DRC, perizinan, dan transaksi berbasis TI.', summaryEn: 'System location, DRC, licensing, and IT-based transactions.' },
        'VIII': { label: 'Data dan Pelindungan Data Pribadi', labelEn: 'Data & Personal Data Protection', color: '#15803d', icon: 'fa-database', summary: 'Data governance, privasi, DPIA, dan pertukaran data.', summaryEn: 'Data governance, privacy, DPIA, and data sharing.' },
        'IX': { label: 'Penyediaan Jasa TI oleh Bank', labelEn: 'IT Services Provided by Banks', color: '#0891b2', icon: 'fa-server', summary: 'Izin dan batasan Bank ketika menyediakan jasa TI.', summaryEn: 'Licensing and limits when banks provide IT services.' },
        'X': { label: 'Pengendalian dan Audit Intern', labelEn: 'Internal Control & Audit', color: '#b91c1c', icon: 'fa-clipboard-check', summary: 'Pengendalian, jejak audit, audit intern, dan external review.', summaryEn: 'Controls, audit trail, internal audit, and external review.' },
        'XI': { label: 'Pelaporan', labelEn: 'Reporting', color: '#be123c', icon: 'fa-file-alt', summary: 'Rencana TI, kondisi terkini, insiden, dan laporan realisasi.', summaryEn: 'IT plans, current condition, incidents, and realization reports.' },
        'XII': { label: 'Maturitas Digital', labelEn: 'Digital Maturity', color: '#0f766e', icon: 'fa-chart-line', summary: 'Self-assessment maturitas digital Bank.', summaryEn: 'Bank digital-maturity self-assessment.' },
        'XIII': { label: 'Ketentuan Peralihan', labelEn: 'Transitional Provisions', color: '#64748b', icon: 'fa-arrow-right-arrow-left', summary: 'Penyesuaian kebijakan, kontrak, dan strategi TI.', summaryEn: 'Adjustments to policies, contracts, and IT strategy.' },
        'XIV': { label: 'Ketentuan Penutup', labelEn: 'Closing Provisions', color: '#475569', icon: 'fa-scale-balanced', summary: 'Penerapan awal, pencabutan, dan tanggal berlaku.', summaryEn: 'Initial application, repeal, and effective date.' },
      },
      appendixTypePalette: {
        'Cakupan Regulasi': '#64748b',
        'Dokumen Tata Kelola': '#1d4ed8',
        'Dokumen Pihak Ketiga': '#7c3aed',
        'Dokumen Data & Privasi': '#15803d',
        'Perizinan & Lokasi': '#0891b2',
        'Pelaporan Regulator': '#b91c1c',
        'Batas Waktu': '#c2410c',
        'Sanksi Administratif': '#be123c',
        'Transisi & Ketentuan': '#475569',
      },
      activePillar: '',
      chapterFilter: '',
      requirementSearch: '',
      activeRequirementId: null,
      appendixTypeFilter: '',
      appendixSearch: '',
      showAppendixModal: false,
      selectedAppendix: null,
      reportingSla: 24,
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
        heroLede: en ? 'A comprehensive guide to POJK 11/POJK.03/2022 for commercial banks, covering governance, risk, cyber resilience, service providers, data, audit, licensing, and regulatory reporting.' : 'Panduan komprehensif POJK 11/POJK.03/2022 untuk Bank Umum: tata kelola, risiko, ketahanan siber, pihak ketiga, data, audit, perizinan, serta pelaporan regulator.',
        metaChapters: en ? 'Operational Chapters' : 'Bab Operasional',
        metaChaptersDesc: en ? 'From IT governance to digital maturity and closing provisions.' : 'Mulai tata kelola TI hingga maturitas digital dan ketentuan penutup.',
        metaRequirements: en ? 'Mapped Obligations' : 'Kewajiban Terpetakan',
        metaRequirementsDesc: en ? 'Operational obligations reviewable individually in the explorer.' : 'Kewajiban operasional yang dapat ditinjau satu per satu dalam explorer.',
        metaAppendices: en ? 'Reference Kits' : 'Referensi Kerja',
        metaAppendicesDesc: en ? 'Governance documents, licensing, reporting, deadlines, and sanctions.' : 'Dokumen tata kelola, perizinan, pelaporan, batas waktu, dan sanksi.',
        metaSla: en ? 'Initial Incident Notice' : 'Notifikasi Awal Insiden',
        metaSlaDesc: en ? 'Maximum time after a significant IT incident is known.' : 'Batas maksimum setelah insiden TI signifikan diketahui.',
        sideFlowLabel: en ? 'Reading Flow' : 'Alur Pembacaan',
        sideFlowTitle: en ? 'Turn regulatory text into accountable operational work' : 'Ubah teks regulasi menjadi kerja operasional yang akuntabel',
        sideFlowDesc: en ? 'Start from the pillar and chapter map, open each obligation to see interpretation, owner, evidence, cadence, and output, then use the reference board to trace licensing, reports, deadlines, and sanctions.' : 'Mulai dari peta pilar dan bab, buka setiap kewajiban untuk melihat interpretasi, owner, evidence, frekuensi, dan output, lalu gunakan board referensi untuk menelusuri perizinan, laporan, batas waktu, dan sanksi.',
        sideNoteLabel: en ? 'Critical Regulatory Notes' : 'Catatan Regulator Kritis',
        sideNoteDesc: en ? 'Key time limits include 24 hours for initial incident notice, 5 working days for the incident report, 10 working days for a scenario-test report, 15 working days for the annual IT-condition report, and 3 months for realization reporting after implementation.' : 'Batas waktu penting meliputi 24 jam untuk notifikasi awal insiden, 5 hari kerja untuk laporan insiden, 10 hari kerja untuk laporan uji skenario, 15 hari kerja untuk laporan kondisi TI tahunan, dan 3 bulan untuk laporan realisasi setelah implementasi.',
        tab1Label: en ? 'Program Summary' : 'Ringkasan Program',
        tab1Desc: en ? 'Pillar map, regulatory chapters, and operating blueprint.' : 'Peta pilar, bab regulasi, dan blueprint operasional.',
        tab2Label: en ? 'Explorer' : 'Eksplorasi',
        tab2Desc: en ? 'Filter obligations and inspect interpretation, evidence, and outputs.' : 'Filter kewajiban dan tinjau interpretasi, evidence, serta output.',
        tab3Label: en ? 'References & Reporting' : 'Referensi & Pelaporan',
        tab3Desc: en ? 'Reference board for documents, licensing, deadlines, sanctions, and OJK reporting.' : 'Board referensi dokumen, perizinan, batas waktu, sanksi, dan pelaporan OJK.',
        pillarLandscape: en ? 'Regulatory pillar landscape' : 'Lanskap pilar regulasi',
        pillarLandscapeDesc: en ? 'The pillars organize POJK obligations into accountable workstreams. Select a pillar to open the filtered explorer.' : 'Pilar mengorganisasi kewajiban POJK menjadi workstream yang akuntabel. Pilih pilar untuk membuka explorer dengan filter terkait.',
        chapterHotspot: en ? 'Chapter hotspots' : 'Hotspot per bab',
        chapterHotspotDesc: en ? 'The chapter distribution shows where the regulation provides the most detailed operational direction.' : 'Distribusi bab memperlihatkan bagian regulasi yang memberi arahan operasional paling rinci.',
        assessTitle: en ? 'Operational compliance blueprint' : 'Blueprint kepatuhan operasional',
        appendixMap: en ? 'Reference-kit map' : 'Peta referensi kerja',
        appendixMapDesc: en ? 'The reference kits connect each obligation to concrete governance artifacts, regulatory submissions, licensing checkpoints, time limits, and the applicable sanction regime.' : 'Referensi kerja menghubungkan setiap kewajiban dengan artefak tata kelola, penyampaian regulator, checkpoint perizinan, batas waktu, serta rezim sanksi yang relevan.',
        filterWorkspace: en ? 'Filter Workspace' : 'Filter Workspace',
        reqList: en ? 'Obligation list' : 'Daftar kewajiban',
        reqEmpty: en ? 'No obligations match the current filters.' : 'Tidak ada kewajiban yang cocok dengan filter saat ini.',
        reqInspectorEmpty: en ? 'Select an obligation to read the detail.' : 'Pilih kewajiban untuk membaca detail.',
        ownerLabel: en ? 'Primary Owner' : 'Owner Utama',
        reqSummaryLabel: en ? 'Obligation Summary' : 'Ringkasan Kewajiban',
        reqSummaryEmpty: en ? 'Select an obligation to read the summary.' : 'Pilih kewajiban untuk membaca ringkasan.',
        analogyLabel: en ? 'Implementation Lens' : 'Lensa Implementasi',
        focusLabel: en ? 'Implementation Focus' : 'Fokus Implementasi',
        focusEmpty: en ? 'No additional implementation focus.' : 'Tidak ada fokus implementasi tambahan.',
        evidenceLabel: en ? 'Example Evidence' : 'Contoh Evidence',
        evidenceEmpty: en ? 'No evidence cues.' : 'Tidak ada evidence cue.',
        appendixRelated: en ? 'Related References' : 'Referensi Terkait',
        appendixEmpty: en ? 'This obligation does not reference a specific kit.' : 'Kewajiban ini tidak menunjuk referensi spesifik.',
        reportingLabel: en ? 'Reporting / Output' : 'Pelaporan / Output',
        divisionLabel: en ? 'Division Translation' : 'Terjemahan Divisi',
        divisionEmpty: en ? 'No specific guidance for this division yet. Please refer to the main guide.' : 'Belum ada panduan spesifik untuk divisi ini. Silakan rujuk panduan utama.',
        filterChapter: en ? 'Chapter' : 'Bab',
        filterAllChapters: en ? 'All chapters' : 'Semua bab',
        filterSearch: en ? 'Search obligations' : 'Cari kewajiban',
        filterSearchPlaceholder: en ? 'Search by ID, title, summary, legal basis, or reference' : 'Cari ID, judul, ringkasan, dasar pasal, atau referensi',
        filterReset: en ? 'Reset filters' : 'Atur ulang filter',
        refFilter: en ? 'Filter references' : 'Filter referensi',
        refBoard: en ? 'Reference board' : 'Board referensi',
        refTypeLabel: en ? 'Reference Type' : 'Jenis Referensi',
        refTypeAll: en ? 'All types' : 'Semua jenis',
        refSearch: en ? 'Search references' : 'Cari referensi',
        refSearchPlaceholder: en ? 'Search by ID, title, type, or scope' : 'Cari ID, judul, jenis, atau scope',
        refShown: en ? 'References Shown' : 'Referensi Ditampilkan',
        refShownEmpty: en ? 'No references match the current filters.' : 'Tidak ada referensi yang cocok dengan filter saat ini.',
        refOutputNote: en ? 'Practical Use' : 'Penggunaan Praktis',
        refOutputDesc: en ? 'Use the reference board to assemble a POJK compliance pack: governance documents, evidence, regulatory reports, licensing files, deadline calendar, sanction matrix, and the transition/legal register.' : 'Gunakan board referensi untuk menyusun compliance pack POJK: dokumen tata kelola, evidence, laporan regulator, berkas izin, kalender tenggat, matriks sanksi, serta register transisi/legal.',
        refEmpty: en ? 'No references match the current filters.' : 'Tidak ada referensi yang cocok dengan filter saat ini.',
        modalSummary: en ? 'Summary' : 'Ringkasan',
        modalArtifacts: en ? 'Artifacts / Main Contents' : 'Artefak / Isi Utama',
        modalArtifactsEmpty: en ? 'No artifacts mapped.' : 'Tidak ada artefak yang dipetakan.',
        modalReqUsing: en ? 'Obligations Using This' : 'Kewajiban yang Menggunakannya',
        modalReqEmpty: en ? 'No obligations have been mapped to this reference.' : 'Belum ada kewajiban yang dipetakan ke referensi ini.',
        appendixCountLabel: en ? 'references' : 'referensi',
        reqCountLabel: en ? 'obligations' : 'kewajiban',
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
          fetch(`/data/pojk_11_2022_requirements.json?t=${new Date().getTime()}`),
          fetch(`/data/pojk_11_2022_references.json?t=${new Date().getTime()}`)
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
        console.error('Error loading POJK data:', error);
        this.error = error.message || 'Failed to load data';
      } finally {
        this.loading = false;
        this.searchDeepLinkAfterDataLoaded();
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
.role-translation-box .pojk-label { color: #144e72; }
[data-bs-theme="dark"] .role-translation-box .pojk-label { color: #48cae4; }
.role-callout { background: linear-gradient(135deg, rgba(20, 78, 114, 0.08) 0%, rgba(72, 202, 228, 0.08) 100%); border-color: rgba(20, 78, 114, 0.2); border-left: 4px solid #144e72; font-weight: 600; color: #144e72; }
[data-bs-theme="dark"] .role-callout { background: linear-gradient(135deg, rgba(72, 202, 228, 0.1) 0%, rgba(15, 118, 110, 0.1) 100%); border-color: rgba(72, 202, 228, 0.2); border-left: 4px solid #48cae4; color: #e2e8f0; }
@keyframes highlight-role { from { transform: translateY(-5px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.pojk-page{--ink:#14263b;--muted:#5c6776;--line:rgba(20,38,59,.1);--shell:linear-gradient(180deg,#f6efe3 0%,#edf5f6 100%);--accent-muted:rgba(20,78,114,0.1);color:var(--ink);padding:.25rem;border-radius:32px;background:var(--shell);transition:all 0.3s ease}
[data-bs-theme="dark"] .pojk-page{--ink:#f8fafc;--muted:#94a3b8;--line:rgba(255,255,255,.1);--shell:linear-gradient(180deg,#0f172a 0%,#1e293b 100%);--accent-muted:rgba(255,255,255,0.05)}
.pojk-shell{display:grid;gap:1rem}
.pojk-hero{display:grid;grid-template-columns:1.55fr .92fr;gap:1.2rem;align-items:stretch;min-height:368px;padding:1.45rem;border-radius:28px;overflow:hidden;position:relative;background:radial-gradient(circle at top right,rgba(248,214,161,.88),transparent 30%),radial-gradient(circle at bottom left,rgba(156,210,219,.7),transparent 28%),linear-gradient(135deg,#132a43 0%,#1f5f78 46%,#f2debb 100%);box-shadow:0 20px 44px rgba(15,23,42,.09)}
.pojk-hero>*{position:relative;z-index:1}
.pojk-kicker{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem .7rem;border-radius:999px;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.pojk-title{margin:1rem 0 .7rem;color:#fffaf2;font-size:clamp(2rem,3.8vw,3rem);font-weight:800;line-height:1.04}
.pojk-lede{margin:0;max-width:720px;color:rgba(255,250,242,.82);line-height:1.7}
.pojk-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:.65rem;margin-top:1.1rem}
.pojk-metric,.pojk-side,.pojk-panel,.pojk-mini{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,251,245,.98) 0%,rgba(246,251,252,.98) 100%);box-shadow:0 14px 28px rgba(15,23,42,.05)}
[data-bs-theme="dark"] .pojk-metric,[data-bs-theme="dark"] .pojk-side,[data-bs-theme="dark"] .pojk-panel,[data-bs-theme="dark"] .pojk-mini{background:rgba(30,41,59,0.5);border-color:rgba(255,255,255,0.1)}
.pojk-metric{padding:.68rem .74rem;border-radius:16px;background:rgba(255,250,242,.12);border-color:rgba(255,255,255,.18);min-height:96px;display:flex;flex-direction:column;justify-content:flex-start}
.pojk-metric label,.pojk-side label,.pojk-mini label,.pojk-form label,.pojk-inspector small,.pojk-label{display:block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.pojk-metric label{color:rgba(255,250,242,.7);margin-bottom:.35rem}
.pojk-metric strong{display:block;color:#fffaf2;font-size:1.5rem;font-weight:800;line-height:1}
.pojk-metric span{display:block;margin-top:.34rem;color:rgba(255,250,242,.72);font-size:.76rem}
.pojk-side-stack{display:grid;gap:.85rem}
.pojk-side{padding:.8rem .86rem;border-radius:18px;background:rgba(255,250,242,.78);border-color:rgba(255,255,255,.24);min-height:142px}
.pojk-side label{color:var(--muted);margin-bottom:.4rem}
.pojk-side h3{margin:0;font-size:1rem;font-weight:800;color:var(--ink)}
.pojk-side p{margin:.55rem 0 0;color:var(--muted);line-height:1.55;font-size:.84rem}
.pojk-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}
.pojk-tab{display:grid;grid-template-columns:auto 1fr;gap:.72rem;align-items:center;padding:.82rem .88rem;border-radius:18px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,250,242,.94) 0%,rgba(239,245,246,.94) 100%);text-align:left;color:var(--ink);box-shadow:0 12px 24px rgba(15,23,42,.04);cursor:pointer;transition:all 0.3s ease}
[data-bs-theme="dark"] .pojk-tab{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}
.pojk-tab.active{border-color:rgba(20,78,114,.24);box-shadow:0 18px 30px rgba(20,78,114,.1)}
[data-bs-theme="dark"] .pojk-tab.active{background:rgba(30,41,59,0.9);border-color:var(--accent,#48cae4)}
.pojk-tab i{width:2.35rem;height:2.35rem;display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(20,38,59,.06)}
[data-bs-theme="dark"] .pojk-tab i{background:rgba(255,255,255,0.1)}
.pojk-tab strong{display:block;font-size:.9rem;font-weight:800;color:var(--ink)}
.pojk-tab span{display:block;margin-top:.14rem;color:var(--muted);font-size:.76rem;line-height:1.4}
.pojk-grid{display:grid;gap:1rem}
.pojk-grid.two{grid-template-columns:1.06fr .94fr}
.pojk-panel{padding:1rem;border-radius:20px}
.pojk-head{display:flex;align-items:center;justify-content:space-between;gap:.85rem;margin-bottom:.7rem}
.pojk-head h3{margin:0;font-size:.98rem;font-weight:800;color:var(--ink)}
.pojk-chip,.pojk-pill,.pojk-meta span,.pojk-ref{display:inline-flex;align-items:center;gap:.3rem;padding:.24rem .52rem;border-radius:999px;font-size:.7rem;font-weight:700;line-height:1.2}
.pojk-chip{background:rgba(20,38,59,.08);color:var(--ink)}
[data-bs-theme="dark"] .pojk-chip{background:rgba(255,255,255,0.1)}
.pojk-copy{margin:0 0 .85rem;color:var(--muted);line-height:1.6;font-size:.84rem}
.pojk-bars,.pojk-cards,.pojk-hotspots,.pojk-families{display:grid;gap:.65rem}
.pojk-bar,.pojk-hotspot,.pojk-family{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(180px,1fr) auto;gap:.68rem;align-items:center;padding:.62rem .72rem;border-radius:16px;border:1px solid transparent;background:rgba(255,255,255,.55);text-align:left;cursor:pointer;transition:border-color .15s ease,transform .15s ease,box-shadow .15s ease}
[data-bs-theme="dark"] .pojk-bar,[data-bs-theme="dark"] .pojk-hotspot,[data-bs-theme="dark"] .pojk-family{background:rgba(30,41,59,0.4)}
.pojk-family{grid-template-columns:1fr auto}
.pojk-bar:hover,.pojk-hotspot:hover,.pojk-family:hover,.pojk-bar.active,.pojk-hotspot.active,.pojk-family.active{transform:translateY(-1px);border-color:rgba(20,78,114,.22);box-shadow:0 12px 22px rgba(20,78,114,.08)}
[data-bs-theme="dark"] .pojk-bar:hover,[data-bs-theme="dark"] .pojk-hotspot:hover,[data-bs-theme="dark"] .pojk-family:hover{border-color:rgba(255,255,255,0.2)}
.pojk-bar strong,.pojk-hotspot strong,.pojk-family strong{display:block;font-size:.86rem;color:var(--ink)}
.pojk-bar em,.pojk-hotspot em,.pojk-family em{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem;font-style:normal}
.pojk-track{height:.44rem;border-radius:999px;background:rgba(20,38,59,.08);overflow:hidden}
[data-bs-theme="dark"] .pojk-track{background:rgba(255,255,255,0.1)}
.pojk-track b{display:block;height:100%;border-radius:inherit}
.pojk-num{min-width:2.2rem;text-align:right;font-weight:800;color:var(--ink)}
.pojk-cards{grid-template-columns:repeat(3,1fr)}
.pojk-card{width:100%;padding:.76rem .8rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer;transition:all 0.3s ease}
[data-bs-theme="dark"] .pojk-card{background:rgba(30,41,59,0.6)}
.pojk-icon{width:1.9rem;height:1.9rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(20,78,114,.12);color:var(--accent);font-size:.8rem}
[data-bs-theme="dark"] .pojk-icon{background:rgba(255,255,255,0.1)}
.pojk-card strong{display:block;margin-top:.42rem;font-size:.86rem;font-weight:800;color:var(--ink)}
.pojk-card p{margin:.22rem 0 0;color:var(--muted);font-size:.72rem;line-height:1.4}
.pojk-mini-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.65rem;margin-bottom:.8rem}
.pojk-mini{padding:.72rem .78rem;border-radius:16px;text-align:center}
[data-bs-theme="dark"] .pojk-mini{background:rgba(30,41,59,0.4)}
.pojk-mini.text-start{text-align:left}
.pojk-mini label{color:var(--muted)}
.pojk-mini strong{display:block;margin-top:.2rem;font-size:1.08rem;font-weight:800;color:#144e72}
[data-bs-theme="dark"] .pojk-mini strong{color:#48cae4}
.pojk-mini span{display:block;margin-top:.14rem;color:var(--muted);font-size:.72rem;line-height:1.4}
.pojk-workspace{display:grid;grid-template-columns:.85fr 1.15fr;gap:1rem}
.pojk-filter-panel{grid-column:1 / -1}
.pojk-workspace>*{min-width:0}
.pojk-list>*{min-width:0}
.pojk-refspace{display:grid;grid-template-columns:.82fr 1.18fr;gap:1rem}
.pojk-pillar-grid{display:flex;flex-wrap:wrap;gap:.55rem;margin-bottom:.8rem}
.pojk-pillar{flex:1 1 auto;padding:.62rem .68rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer;transition:all 0.3s ease}
[data-bs-theme="dark"] .pojk-pillar{background:rgba(30,41,59,0.6)}
.pojk-pillar.active{border-color:rgba(20,78,114,.24);background:rgba(238,245,245,.72);box-shadow:0 12px 24px rgba(20,78,114,.08)}
[data-bs-theme="dark"] .pojk-pillar.active{background:rgba(30,41,59,0.9);border-color:var(--accent)}
.pojk-pillar strong{display:block;font-size:.82rem;font-weight:800;color:var(--accent)}
.pojk-pillar span{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem}
.pojk-form{display:flex;gap:.75rem;align-items:flex-end}
.pojk-form > div { flex: 1; }
.pojk-form label{margin-bottom:.3rem;color:var(--muted)}
.pojk-summary{margin-top:.85rem;padding:.82rem .88rem;border-radius:18px;background:linear-gradient(180deg,rgba(25,61,87,.95) 0%,rgba(20,78,114,.95) 100%);color:#fffaf2}
.pojk-summary small{display:block;color:rgba(255,250,242,.7);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.pojk-summary strong{display:block;margin-top:.28rem;font-size:1.72rem;font-weight:800;line-height:1}
.pojk-summary span{display:block;margin-top:.42rem;color:rgba(255,250,242,.78);font-size:.78rem;line-height:1.5}
.pojk-list{display:flex;flex-direction:column;max-height:720px;overflow-y:auto;padding-right:.12rem}
.pojk-item{position:relative;width:100%;padding:.7rem .78rem .66rem .88rem;margin-bottom:.55rem;border-radius:14px;border:1px solid rgba(20,38,59,.08);background:#fff;text-align:left;cursor:pointer;content-visibility:auto;contain-intrinsic-size:auto 80px;transition:all 0.3s ease}
[data-bs-theme="dark"] .pojk-item{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}
.pojk-item:last-child{margin-bottom:0}
.pojk-item.active{border-color:rgba(20,78,114,.35);border-left-width:.28rem;background:rgba(238,245,245,.6)}
[data-bs-theme="dark"] .pojk-item.active{background:rgba(30,41,59,0.9);border-color:var(--accent)}
.pojk-item:before{content:'';position:absolute;left:0;top:.68rem;bottom:.68rem;width:.18rem;border-radius:999px;background:var(--accent,#144e72)}
.pojk-item-top{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:space-between}
.pojk-item-code,.pojk-code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:.76rem;font-weight:800;color:var(--accent,#144e72)}
[data-bs-theme="dark"] .pojk-item-code,[data-bs-theme="dark"] .pojk-code{color:var(--accent,#48cae4)}
.pojk-item-name{margin:.28rem 0 .2rem;font-size:.88rem;font-weight:700;line-height:1.38;color:var(--ink);word-wrap:break-word;overflow-wrap:break-word;max-width:100%}
.pojk-item-meta{color:var(--muted);font-size:.74rem;line-height:1.4}
.pojk-item-meta span+span::before{content:'•';margin:0 .4rem;color:rgba(20,38,59,.35)}
[data-bs-theme="dark"] .pojk-item-meta span+span::before{color:rgba(255,255,255,.2)}
.pojk-pill{padding:.2rem .45rem;font-size:.68rem;background:rgba(20,38,59,.08);color:var(--ink)}
[data-bs-theme="dark"] .pojk-pill{background:rgba(255,255,255,0.1)}
.pojk-inspector{position:relative;top:auto;min-height:720px;display:flex;flex-direction:column}
.pojk-inspector-head{padding-bottom:.85rem;border-bottom:1px solid var(--line)}
.pojk-inspector-head strong{display:block;margin-top:.35rem;font-size:1rem;font-weight:800;color:#144e72}
[data-bs-theme="dark"] .pojk-inspector-head strong{color:#48cae4}
.pojk-inspector-head span{display:block;margin-top:.28rem;font-size:.9rem;font-weight:800;line-height:1.4;color:var(--ink)}
.pojk-inspector-body{display:grid;gap:.75rem;padding-top:.85rem;flex:1;min-height:0;overflow:auto;align-content:start}
.pojk-meta{display:flex;flex-wrap:wrap;gap:.45rem}
.pojk-meta span{background:rgba(20,38,59,.06);color:var(--ink);font-size:.72rem}
[data-bs-theme="dark"] .pojk-meta span{background:rgba(255,255,255,0.1)}
.pojk-callout,.pojk-note{padding:.76rem .84rem;border-radius:16px;border:1px solid var(--line);line-height:1.62;transition:all 0.3s ease}
.pojk-callout{background:rgba(255,255,255,.75)}
[data-bs-theme="dark"] .pojk-callout{background:rgba(30,41,59,0.4)}
.pojk-note{background:rgba(238,245,245,.84)}
[data-bs-theme="dark"] .pojk-note{background:rgba(30,41,59,0.7);border-color:var(--accent)}
.pojk-plain{margin:.15rem 0 0;padding-left:1rem;color:var(--muted);font-size:.78rem;line-height:1.6}
.pojk-plain li{margin-bottom:.16rem}
.pojk-refs{display:flex;flex-wrap:wrap;gap:.4rem}
.pojk-ref{border:1px solid rgba(20,38,59,.12);background:rgba(255,255,255,.82);color:var(--ink);font-size:.7rem;cursor:pointer;transition:all 0.3s ease}
[data-bs-theme="dark"] .pojk-ref{background:rgba(30,41,59,0.8);border-color:rgba(255,255,255,0.1)}
.pojk-empty{padding:.9rem;border-radius:16px;border:1px dashed rgba(20,38,59,.18);background:rgba(255,255,255,.6);color:var(--muted);text-align:center;line-height:1.55;transition:all 0.3s ease}
[data-bs-theme="dark"] .pojk-empty{background:rgba(30,41,59,0.3);border-color:rgba(255,255,255,0.1)}

/* Modal Styles */
.pojk-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(15,23,42,.56)}.pojk-modal-dialog{width:100%;max-width:780px}.pojk-modal-shell{display:flex;flex-direction:column;height:85vh;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 64px rgba(15,23,42,.24),0 8px 24px rgba(15,23,42,.12)}[data-bs-theme=dark] .pojk-modal-shell{background:#1e293b;color:#f8fafc}.pojk-modal-sidebar{position:relative;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:.85rem;padding:1rem 1.5rem;color:#fffaf2;text-align:left;flex-shrink:0}.pojk-modal-close{position:absolute;top:50%;transform:translateY(-50%);right:1.25rem;width:2.2rem;height:2.2rem;display:flex;align-items:center;justify-content:center;border:0;border-radius:12px;background:rgba(255,255,255,.2);color:#fff;cursor:pointer;transition:all .2s ease}.pojk-modal-close:hover{background:rgba(255,255,255,.35)}.pojk-modal-icon{width:2.4rem;height:2.4rem;display:flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(255,255,255,.2);font-size:1.05rem}.pojk-modal-id{font-size:1.1rem;font-weight:800}.pojk-modal-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0}.pojk-modal-header{flex-shrink:0;padding:1.15rem 1.5rem 1rem;border-bottom:1px solid rgba(0,0,0,.08)}.pojk-modal-title{display:block;color:#144e72;font-size:1rem;font-weight:800;margin:0}[data-bs-theme=dark] .pojk-modal-title{color:#7dd3fc}.pojk-modal-body{flex:1;padding:1.25rem 1.5rem;overflow-y:auto;-webkit-overflow-scrolling:touch}.pojk-modal-section{margin-bottom:1.25rem}.pojk-modal-section-header{display:flex;gap:.55rem;padding-bottom:.5rem;margin-bottom:.65rem;border-bottom:1px solid rgba(0,0,0,.08);font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em}.pojk-modal-scope{display:inline-block;margin-bottom:.55rem;padding:.28rem .55rem;border-radius:999px;background:rgba(20,78,114,.08);color:#144e72;font-size:.72rem;font-weight:700}.pojk-modal-summary{margin:0;color:var(--muted);font-size:.86rem;line-height:1.7}.pojk-modal-artifact-list{display:grid;gap:.45rem;list-style:none;margin:0;padding:0}.pojk-modal-artifact-list li{display:flex;gap:.55rem;padding:.62rem .75rem;border-radius:12px;background:rgba(238,245,245,.5);font-size:.84rem}[data-bs-theme=dark] .pojk-modal-artifact-list li{background:rgba(255,255,255,.05)}.pojk-modal-artifact-list i{margin-top:.18rem;color:#0f766e;flex-shrink:0}.pojk-modal-requirements{display:flex;flex-wrap:wrap;gap:.45rem}.pojk-modal-req-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.42rem .72rem;border:1px solid rgba(0,0,0,.12);border-radius:999px;background:rgba(255,255,255,.85);color:#1e293b;font-size:.76rem;font-weight:700;cursor:pointer;transition:all .15s ease}.pojk-modal-req-btn:hover{background:#144e72;color:#fff;border-color:#144e72}.pojk-modal-empty{padding:.9rem 1rem;border:1px dashed rgba(20,38,59,.18);border-radius:12px;color:var(--muted);font-size:.84rem}.pojk-fade-enter-active,.pojk-fade-leave-active{transition:opacity .2s ease,transform .2s ease}.pojk-fade-enter-from,.pojk-fade-leave-to{opacity:0;transform:scale(.96)}
[data-bs-theme="dark"] .pojk-modal-empty{background:rgba(30,41,59,0.3);border-color:rgba(255,255,255,0.1)}

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

@media (max-width:1440px){.pojk-hero { min-height: 280px; padding: 1.25rem; } .pojk-title { font-size: clamp(1.8rem, 3.2vw, 2.5rem); margin: 0.8rem 0 0.5rem; } .pojk-metric { min-height: 80px; padding: 0.55rem 0.65rem; } .pojk-metric strong { font-size: 1.35rem; } .pojk-list, .pojk-inspector { min-height: auto; max-height: 520px; }}
@media (max-height:850px) and (min-width:1024px){.pojk-hero { min-height: 240px; padding: 1.15rem; } .pojk-metrics { margin-top: 0.6rem; } .pojk-list, .pojk-inspector { max-height: calc(100vh - 280px); } .pojk-inspector-body { padding-top: 0.5rem; }}
@media (max-width:991.98px){.pojk-workspace,.pojk-refspace{grid-template-columns:1fr}.pojk-inspector{position:static;min-height:auto}}
@media (max-width:1199.98px){.pojk-hero,.pojk-metric,.pojk-side{min-height:auto}.pojk-hero,.pojk-nav,.pojk-grid.two,.pojk-refspace,.pojk-metrics,.pojk-mini-row,.pojk-cards{grid-template-columns:1fr}.pojk-bar,.pojk-hotspot,.pojk-family{grid-template-columns:1fr}}
@media (max-width:767.98px){.pojk-hero,.pojk-panel{padding:1.2rem;border-radius:22px}.pojk-pillar-grid{grid-template-columns:1fr}.pojk-modal-shell{display:grid;grid-template-rows:auto minmax(0, 1fr);max-height:85vh;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 64px rgba(15,23,42,.24),0 8px 24px rgba(15,23,42,.12)}.pojk-modal-sidebar{position:relative;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:.85rem;padding:1rem 1.5rem;color:#fffaf2;text-align:left;flex-shrink:0}.pojk-modal-icon{width:2.4rem;height:2.4rem;display:flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(255,255,255,.2);font-size:1.05rem;margin-bottom:0}.pojk-modal-close{position:absolute;top:50%;transform:translateY(-50%);right:1.25rem;width:2.2rem;height:2.2rem;display:flex;align-items:center;justify-content:center;border:0;border-radius:12px;background:rgba(255,255,255,.2);color:#fff;cursor:pointer;transition:all .2s ease}.pojk-modal-dialog{max-width:100%}}

/* Skeleton loader — mencegah CLS dengan mempertahankan dimensi layout */
.skeleton-shell { padding: 1.5rem; }
.skeleton-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; min-height: 320px; }
.skeleton-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-top: 1rem; }
.skeleton-metric { height: 5rem; border-radius: 12px; }
.skeleton-block { background: linear-gradient(90deg, rgba(20,38,59,0.08) 25%, rgba(20,38,59,0.04) 50%, rgba(20,38,59,0.08) 75%); background-size: 200% 100%; animation: skeleton-shimmer 1.4s ease infinite; border-radius: 8px; }
@keyframes skeleton-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
[data-bs-theme="dark"] .skeleton-block { background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.06) 75%); background-size: 200% 100%; animation: skeleton-shimmer 1.4s ease infinite; }
@media (max-width: 767.98px) { .skeleton-hero { grid-template-columns: 1fr; } .skeleton-metrics { grid-template-columns: repeat(2, 1fr); } }
</style>
