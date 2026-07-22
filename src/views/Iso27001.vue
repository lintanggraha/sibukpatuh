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
            <aside class="iso-panel iso-filter-panel" style="position: sticky; top: 1rem;">
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
                <button class="btn btn-outline-dark" type="button" @click="resetFilters"><i class="fas fa-rotate-left me-2"></i>Reset filter</button>
              </div>
            </aside>
            <section class="iso-panel">
              <div class="iso-panel-head"><h3>Daftar kontrol</h3><span class="iso-chip">Klik untuk buka inspector</span></div>
              <div class="iso-list">
                <template v-for="(ctrl, idx) in paginatedControls" :key="controlKey(ctrl)">
                  <div v-if="shouldShowSectionHeader(ctrl, idx)" class="iso-section-header">
                    <span>{{ sectionLabel(ctrl) }}</span>
                    <strong>{{ sectionTitle(ctrl) }}</strong>
                    <em>{{ sectionDescription(ctrl) }}</em>
                  </div>
                  <button type="button" class="iso-item" :class="{ active: explorerState.selectedKey === controlKey(ctrl) }" :style="{ '--accent': getDomainColor(ctrl.domain) }" @click="selectExplorerControl(ctrl)"><div class="iso-item-top"><span class="iso-item-code">{{ ctrl.id }}</span><span class="iso-pill" :class="[`compact`, getPillClass(ctrl.priority)]">{{ ctrl.priority || '-' }}</span></div><div class="iso-item-name">{{ ctrl.name || '-' }}</div><div class="iso-item-meta-line"><span>{{ ctrl.domain || '-' }}</span><span>{{ ctrl.type || '-' }}</span><span>{{ ctrl.difficulty || '-' }}</span></div></button>
                </template>
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
                
                <div v-if="activeRole !== 'default' && selectedExplorerControl" class="role-translation-box">
                  <span class="iso-detail-label">
                    <i :class="getRoleIcon(activeRole)" class="me-1"></i> Terjemahan Divisi ({{ getRoleName(activeRole) }})
                  </span>
                  <div class="iso-callout role-callout">
                    {{ (selectedExplorerControl.roleTranslations && selectedExplorerControl.roleTranslations[activeRole]) ? selectedExplorerControl.roleTranslations[activeRole] : 'Belum ada panduan spesifik untuk divisi ini. Silakan rujuk panduan utama.' }}
                  </div>
                </div>

                <div><span class="iso-detail-label">Deskripsi standar ISO</span><div class="iso-callout">{{ selectedExplorerControl.description || '-' }}</div></div>
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
                      <button v-for="ctrl in conceptFilteredControls" :key="controlKey(ctrl)" type="button" class="iso-item" :class="{ active: conceptState.selectedKey === controlKey(ctrl) }" :style="{ '--accent': getDomainColor(ctrl.domain) }" @click="selectConceptControl(ctrl)"><div class="iso-item-top"><span class="iso-item-code">{{ ctrl.id }}</span><span class="iso-pill" :class="[`compact`, getPillClass(ctrl.priority)]">{{ ctrl.priority || '-' }}</span></div><div class="iso-item-name">{{ ctrl.name || '-' }}</div><div class="iso-item-meta-line"><span>{{ ctrl.domain || '-' }}</span><span>{{ ctrl.type || '-' }}</span><span>{{ ctrl.difficulty || '-' }}</span></div></button>
                      <div v-if="conceptFilteredControls.length === 0" class="iso-empty">Belum ada kontrol yang dipetakan ke konsep ini.</div>
                    </div>
                  </section>
                  <section class="iso-panel">
                    <div class="iso-detail-head"><small>Inspektor Konsep</small><strong>{{ selectedConceptControl?.id || 'Pilih sebuah kontrol' }}</strong><span>{{ selectedConceptControl?.name || 'Klik kontrol dari konsep yang dipilih untuk membaca detail lengkap.' }}</span></div>
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

                      <div><span class="iso-detail-label">Deskripsi standar ISO</span><div class="iso-callout">{{ selectedConceptControl.description || '-' }}</div></div>
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

const clauseGuidance = {
  id: {
    analogyPrefix: 'Anggap SMKI seperti program keselamatan gedung.',
    implementationPrefix: 'Mulai dengan workshop lintas fungsi, tetapkan owner, bukti minimum, dan ritme review.',
    priority: 'Tinggi',
    difficulty: 'Sedang',
  },
  en: {
    analogyPrefix: 'Think of the ISMS as a building safety program.',
    implementationPrefix: 'Start with a cross-functional workshop, define owners, minimum evidence, and a review cadence.',
    priority: 'High',
    difficulty: 'Medium',
  },
};

const clauseDetails = {
  '4.1': {
    id: ['Organisasi perlu membaca kondisi bisnis, teknologi, vendor, regulasi, ancaman, budaya kerja, dan batasan internal sebelum menentukan kontrol. Tanpa konteks ini, SMKI mudah menjadi checklist generik yang tidak menjawab risiko nyata.', 'Petakan isu internal dan eksternal dengan PESTLE/SWOT, hubungkan tiap isu ke risiko keamanan informasi, lalu review saat ada perubahan bisnis, layanan, teknologi, atau regulasi.'],
    en: ['The organization needs to read business, technology, vendor, regulatory, threat, cultural, and internal constraints before selecting controls. Without that context, the ISMS becomes a generic checklist instead of a risk-based program.', 'Map internal and external issues with PESTLE/SWOT, link each issue to information security risk, then review it when business, services, technology, or regulation changes.'],
  },
  '4.2': {
    id: ['Pihak berkepentingan adalah semua pihak yang bisa memberi tuntutan keamanan: pelanggan, regulator, pemegang saham, vendor, auditor, karyawan, dan partner. Setiap tuntutan perlu diterjemahkan menjadi persyaratan yang bisa diuji.', 'Buat register stakeholder, catat requirement keamanan, sumber kewajiban, owner pemenuhan, bukti, dan status pemantauan. Sinkronkan dengan kontrak, SLA, regulasi, dan hasil audit.'],
    en: ['Interested parties are everyone who can impose security expectations: customers, regulators, shareholders, vendors, auditors, employees, and partners. Each expectation must become a testable requirement.', 'Create a stakeholder register with security requirements, obligation sources, accountable owners, evidence, and monitoring status. Align it with contracts, SLAs, regulations, and audit results.'],
  },
  '4.3': {
    id: ['Ruang lingkup adalah pagar program SMKI. Ia menjelaskan proses, lokasi, sistem, data, unit, dan pihak ketiga mana yang masuk atau keluar cakupan agar audit dan implementasi tidak melebar tanpa kendali.', 'Susun scope statement, boundary diagram, daftar aset utama, dependency pihak ketiga, dan justifikasi pengecualian. Pastikan scope disetujui manajemen dan konsisten dengan SoA, risk assessment, serta kontrak layanan.'],
    en: ['Scope is the fence around the ISMS program. It states which processes, locations, systems, data, units, and third parties are in or out so audit and implementation do not drift.', 'Prepare a scope statement, boundary diagram, key asset list, third-party dependencies, and exclusion rationale. Ensure management approval and alignment with the SoA, risk assessment, and service contracts.'],
  },
  '4.4': {
    id: ['SMKI bukan satu dokumen, melainkan sistem kerja yang menghubungkan kebijakan, risiko, kontrol, bukti, audit, corrective action, dan peningkatan berkelanjutan.', 'Definisikan proses inti SMKI, kalender aktivitas, KPI/KRI, forum governance, repository dokumen, serta mekanisme perubahan. Pastikan semua proses punya input, output, owner, dan bukti yang jelas.'],
    en: ['An ISMS is not a single document; it is an operating system connecting policy, risk, controls, evidence, audit, corrective action, and continual improvement.', 'Define core ISMS processes, activity calendar, KPIs/KRIs, governance forums, document repository, and change mechanisms. Ensure every process has clear inputs, outputs, owners, and evidence.'],
  },
  '5.1': {
    id: ['Komitmen pimpinan adalah bahan bakar SMKI. Tanpa arahan, budget, keputusan prioritas, dan contoh perilaku dari atas, kontrol biasanya berhenti sebagai dokumen.', 'Minta top management menetapkan sasaran keamanan, menyetujui resource, memimpin review berkala, menghapus blocker lintas fungsi, dan memasukkan keamanan ke keputusan bisnis penting.'],
    en: ['Leadership commitment is the fuel of the ISMS. Without direction, budget, prioritization, and visible behavior from the top, controls often stop at documentation.', 'Have top management set security objectives, approve resources, lead periodic reviews, remove cross-functional blockers, and include security in major business decisions.'],
  },
  '5.2': {
    id: ['Kebijakan keamanan adalah kontrak arah antara manajemen dan organisasi. Isinya harus cukup jelas untuk memandu keputusan, tetapi cukup ringkas agar benar-benar dibaca.', 'Tulis kebijakan yang sesuai tujuan bisnis, risiko, kewajiban hukum, dan komitmen improvement. Publikasikan, sosialisasikan, minta acknowledgement, dan review minimal tahunan atau saat ada perubahan besar.'],
    en: ['The security policy is a direction-setting agreement between management and the organization. It must be clear enough to guide decisions and concise enough to be read.', 'Write a policy aligned with business objectives, risks, legal obligations, and improvement commitments. Publish, socialize, collect acknowledgement, and review it at least annually or after major changes.'],
  },
  '5.3': {
    id: ['Peran yang kabur membuat pekerjaan keamanan jatuh di antara kursi. Clause ini memastikan siapa yang memutuskan, menjalankan, mengawasi, dan melaporkan sudah jelas.', 'Buat RACI SMKI, job description, SK/mandate forum keamanan, jalur eskalasi, dan pengganti saat owner tidak tersedia. Cocokkan dengan struktur organisasi dan proses HR.'],
    en: ['Unclear roles make security work fall between chairs. This clause ensures decision makers, operators, reviewers, and reporters are explicit.', 'Create an ISMS RACI, job descriptions, security forum mandate, escalation paths, and backups when owners are unavailable. Align them with the org structure and HR processes.'],
  },
  '6.1': {
    id: ['Perencanaan risiko adalah radar SMKI. Organisasi harus tahu skenario buruk apa yang mungkin terjadi, peluangnya, dampaknya, dan treatment yang masuk akal.', 'Tetapkan metodologi risk assessment, risk criteria, risk owner, risk register, treatment plan, approval residual risk, dan siklus review. Hubungkan hasilnya ke pemilihan kontrol Annex A dan SoA.'],
    en: ['Risk planning is the ISMS radar. The organization must understand likely adverse scenarios, likelihood, impact, and reasonable treatment.', 'Define risk assessment methodology, risk criteria, risk owners, risk register, treatment plan, residual risk approval, and review cycle. Link results to Annex A control selection and the SoA.'],
  },
  '6.2': {
    id: ['Sasaran keamanan membuat program bisa diukur. Tanpa target, organisasi hanya tahu sudah punya aktivitas, tetapi tidak tahu apakah aktivitas itu berhasil.', 'Tetapkan objective yang SMART, misalnya waktu pencabutan akses, cakupan training, penyelesaian vulnerability, atau kepatuhan backup. Beri owner, baseline, target, due date, dan pelaporan.'],
    en: ['Security objectives make the program measurable. Without targets, an organization may have activity but cannot tell whether it works.', 'Set SMART objectives such as access revocation time, training coverage, vulnerability remediation, or backup compliance. Assign owners, baselines, targets, due dates, and reporting.'],
  },
  '6.3': {
    id: ['Perubahan SMKI perlu dikendalikan seperti perubahan aplikasi produksi. Perubahan scope, proses, vendor, teknologi, atau regulasi bisa menggeser risiko.', 'Buat change log SMKI, impact assessment, approval path, komunikasi, dan update dokumen terkait. Pastikan perubahan besar memicu review risk assessment dan SoA.'],
    en: ['ISMS changes should be controlled like production application changes. Scope, process, vendor, technology, or regulatory changes can shift risk.', 'Maintain an ISMS change log, impact assessment, approval path, communication, and related document updates. Major changes should trigger risk assessment and SoA review.'],
  },
  '7.1': {
    id: ['Resource adalah bukti bahwa keamanan bukan sekadar niat. Program membutuhkan orang, waktu, budget, tools, pelatihan, dan dukungan manajemen.', 'Buat resource plan tahunan, gap kapasitas, kebutuhan tooling, training plan, dan justifikasi budget berbasis risiko. Review kecukupan resource saat management review.'],
    en: ['Resources prove that security is more than intent. The program needs people, time, budget, tools, training, and management support.', 'Create an annual resource plan, capacity gaps, tooling needs, training plan, and risk-based budget rationale. Review adequacy during management review.'],
  },
  '7.2': {
    id: ['Kompetensi memastikan tugas keamanan dijalankan oleh orang yang paham tanggung jawabnya. Ini berlaku untuk tim security, IT, legal, HR, procurement, dan owner proses bisnis.', 'Petakan kompetensi per role, lakukan training atau mentoring, simpan bukti sertifikat/attendance, dan ukur efektivitas melalui kuis, simulasi, atau hasil audit.'],
    en: ['Competence ensures security tasks are performed by people who understand their responsibilities. This covers security, IT, legal, HR, procurement, and business process owners.', 'Map competencies by role, provide training or mentoring, keep certificates/attendance evidence, and measure effectiveness through quizzes, simulations, or audit results.'],
  },
  '7.3': {
    id: ['Awareness membuat kebijakan hidup di perilaku harian. Orang perlu tahu risiko, aturan, konsekuensi, dan cara melapor saat melihat kejadian mencurigakan.', 'Bangun program awareness berbasis risiko: onboarding, phishing simulation, kampanye singkat, poster, town hall, dan reminder untuk topik sensitif seperti data pribadi dan password.'],
    en: ['Awareness turns policy into daily behavior. People need to know risks, rules, consequences, and how to report suspicious events.', 'Build risk-based awareness: onboarding, phishing simulation, short campaigns, posters, town halls, and reminders for sensitive topics such as personal data and passwords.'],
  },
  '7.4': {
    id: ['Komunikasi menentukan siapa perlu tahu apa, kapan, lewat kanal mana, dan dengan bahasa seperti apa. Tanpa ini, isu keamanan sering terlambat naik ke pihak yang tepat.', 'Buat communication matrix untuk insiden, perubahan kebijakan, audit, risiko tinggi, vendor, dan regulator. Cantumkan audience, owner, frekuensi, kanal, dan template pesan.'],
    en: ['Communication defines who needs to know what, when, through which channel, and in what language. Without it, security issues are escalated too late.', 'Create a communication matrix for incidents, policy changes, audits, high risks, vendors, and regulators. Include audience, owner, frequency, channel, and message templates.'],
  },
  '7.5': {
    id: ['Dokumen adalah memori organisasi. Ia harus cukup terkendali agar auditor percaya versinya benar, tetapi cukup mudah diakses agar tim bisa bekerja.', 'Tetapkan document control: penomoran, owner, versi, approval, distribusi, retensi, klasifikasi, dan review periodik. Gunakan repository terpusat dengan hak akses sesuai kebutuhan.'],
    en: ['Documents are organizational memory. They must be controlled enough for auditors to trust the version and accessible enough for teams to work.', 'Define document control: numbering, owner, version, approval, distribution, retention, classification, and periodic review. Use a central repository with need-based access.'],
  },
  '8.1': {
    id: ['Operasi adalah tempat rencana SMKI benar-benar diuji. Proses harian harus menjalankan risk treatment, kontrol, dan perubahan sesuai desain.', 'Turunkan risk treatment menjadi SOP, runbook, checklist, control owner, jadwal eksekusi, dan bukti operasional. Pantau deviasi dan eskalasikan jika kontrol tidak berjalan.'],
    en: ['Operations are where the ISMS plan is truly tested. Daily processes must execute risk treatment, controls, and changes as designed.', 'Translate risk treatment into SOPs, runbooks, checklists, control owners, schedules, and operational evidence. Monitor deviations and escalate when controls do not operate.'],
  },
  '8.2': {
    id: ['Risk assessment perlu berulang karena ancaman dan bisnis berubah. Assessment sekali setahun saja tidak cukup jika ada sistem baru, insiden, vendor baru, atau regulasi baru.', 'Jalankan assessment berkala dan event-driven, gunakan kriteria konsisten, libatkan owner aset/proses, dokumentasikan asumsi, dan pastikan hasilnya masuk ke treatment plan.'],
    en: ['Risk assessment must repeat because threats and business conditions change. Annual assessment alone is insufficient when new systems, incidents, vendors, or regulations appear.', 'Run periodic and event-driven assessments, use consistent criteria, involve asset/process owners, document assumptions, and ensure results feed the treatment plan.'],
  },
  '8.3': {
    id: ['Risk treatment adalah keputusan: hindari, mitigasi, transfer, atau terima risiko. Keputusan ini harus jelas, disetujui, dan bisa dibuktikan progresnya.', 'Buat treatment plan dengan kontrol, owner, due date, resource, dependency, residual risk, approval, dan status. Update SoA untuk menjelaskan kontrol Annex A yang dipilih atau tidak dipilih.'],
    en: ['Risk treatment is a decision: avoid, mitigate, transfer, or accept risk. The decision must be clear, approved, and traceable.', 'Create a treatment plan with controls, owners, due dates, resources, dependencies, residual risk, approval, and status. Update the SoA to explain selected or excluded Annex A controls.'],
  },
  '9.1': {
    id: ['Monitoring menjawab pertanyaan: apakah SMKI bekerja. Organisasi perlu indikator, data, dan review yang menunjukkan kontrol efektif atau perlu diperbaiki.', 'Tentukan KPI/KRI, sumber data, frekuensi pengukuran, threshold, owner, dan forum pelaporan. Gunakan hasilnya untuk corrective action dan prioritas improvement.'],
    en: ['Monitoring answers whether the ISMS works. The organization needs indicators, data, and reviews showing controls are effective or need improvement.', 'Define KPIs/KRIs, data sources, measurement frequency, thresholds, owners, and reporting forums. Use results for corrective action and improvement priorities.'],
  },
  '9.2': {
    id: ['Audit internal adalah latihan sebelum audit eksternal dan alat kontrol manajemen. Ia harus independen, berbasis risiko, dan menghasilkan temuan yang bisa ditindaklanjuti.', 'Buat audit program, scope, criteria, auditor independence, checklist, sampling, evidence log, report, corrective action, dan follow-up closure. Prioritaskan area risiko tinggi.'],
    en: ['Internal audit is rehearsal before external audit and a management control tool. It should be independent, risk-based, and produce actionable findings.', 'Create an audit program, scope, criteria, auditor independence, checklist, sampling, evidence log, report, corrective action, and closure follow-up. Prioritize high-risk areas.'],
  },
  '9.3': {
    id: ['Management review adalah rapat steering SMKI. Pimpinan menilai performa, risiko, insiden, audit, resource, dan keputusan improvement.', 'Siapkan agenda tetap, pack data, keputusan, action item, owner, due date, dan notulen. Pastikan output review menjadi perubahan nyata pada resource, prioritas, kebijakan, atau treatment.'],
    en: ['Management review is the ISMS steering meeting. Leaders assess performance, risks, incidents, audits, resources, and improvement decisions.', 'Prepare a fixed agenda, data pack, decisions, action items, owners, due dates, and minutes. Ensure outputs become real changes to resources, priorities, policies, or treatment.'],
  },
  '10.1': {
    id: ['Improvement memastikan SMKI tidak membeku. Organisasi harus memperbaiki kelemahan dari audit, insiden, perubahan risiko, feedback, dan hasil monitoring.', 'Kelola improvement backlog, kategorikan prioritas, tetapkan owner, target, dan bukti closure. Gunakan trend temuan untuk memperbaiki akar masalah, bukan hanya menutup tiket.'],
    en: ['Improvement keeps the ISMS from freezing. The organization must improve weaknesses from audits, incidents, risk changes, feedback, and monitoring.', 'Manage an improvement backlog, categorize priorities, assign owners, targets, and closure evidence. Use finding trends to address root causes, not merely close tickets.'],
  },
  '10.2': {
    id: ['Nonconformity adalah sinyal bahwa proses tidak berjalan sesuai harapan. Tindakan korektif harus mencari akar masalah, memperbaiki dampak, dan mencegah pengulangan.', 'Gunakan RCA, containment, corrective action, preventive action, owner, due date, evidence closure, dan effectiveness check. Laporkan status temuan secara berkala ke manajemen.'],
    en: ['Nonconformity signals that a process is not operating as expected. Corrective action must find root cause, fix impact, and prevent recurrence.', 'Use RCA, containment, corrective action, preventive action, owner, due date, closure evidence, and effectiveness checks. Report finding status periodically to management.'],
  },
};

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
        'Organizational Context': { id: 'C4', color: '#0f766e', summary: 'External/internal context, interested parties, scope, and ISMS boundaries.' },
        'Leadership': { id: 'C5', color: '#2563eb', summary: 'Management commitment, policy direction, roles, and accountability.' },
        'Planning': { id: 'C6', color: '#a16207', summary: 'Risk planning, security objectives, and controlled ISMS changes.' },
        'Support': { id: 'C7', color: '#7c3aed', summary: 'Resources, competence, awareness, communication, and documented information.' },
        'Operation': { id: 'C8', color: '#c2410c', summary: 'Operational control, risk assessment, and risk treatment execution.' },
        'Performance Evaluation': { id: 'C9', color: '#1d4ed8', summary: 'Monitoring, internal audit, and management review.' },
        'Improvement': { id: 'C10', color: '#15803d', summary: 'Continual improvement, nonconformity handling, and corrective action.' },
      },
      typeMeta: { 'Klausa': { color: '#1d4ed8' }, 'Clause': { color: '#1d4ed8' }, 'Pencegahan': { color: '#0f766e' }, 'Deteksi': { color: '#a16207' }, 'Koreksi': { color: '#c2410c' } },
      priorityMeta: { 'Kritis': { color: '#b91c1c' }, 'Critical': { color: '#b91c1c' }, 'Tinggi': { color: '#c2410c' }, 'High': { color: '#c2410c' }, 'Sedang': { color: '#2563eb' }, 'Medium': { color: '#2563eb' }, 'Rendah': { color: '#15803d' }, 'Low': { color: '#15803d' } },
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
      explorerState: { selectedId: null, selectedKey: null },
      conceptState: { active: null, selectedId: null, selectedKey: null },
      // Pagination
      currentPage: 1,
      itemsPerPage: 25,
    };
  },
  computed: {
    ...mapState(useFrameworkStore, ['activeRole', 'currentLanguage']),
    isEn() { return this.currentLanguage === 'en'; },
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
    criticalControls() { return this.controls.filter(c => ['Kritis', 'Critical'].includes(c.priority)).length; },
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
    selectedExplorerControl() { return this.filteredControls.find(c => this.controlKey(c) === this.explorerState.selectedKey) || this.filteredControls.find(c => c.id === this.explorerState.selectedId) || null; },
    conceptFilteredControls() { return this.controls.filter(c => c.concept === this.conceptState.active); },
    selectedConceptControl() { return this.conceptFilteredControls.find(c => this.controlKey(c) === this.conceptState.selectedKey) || this.conceptFilteredControls.find(c => c.id === this.conceptState.selectedId) || null; },
    // Pagination computed properties
    totalPages() { return Math.ceil(this.filteredControls.length / this.itemsPerPage); },
    paginatedControls() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredControls.slice(start, end);
    },
  },
  methods: {
    localizedDataFile(baseName) {
      return this.isEn ? `${baseName}_en.json` : `${baseName}.json`;
    },
    controlKey(ctrl) {
      return ctrl?._key || `${this.sectionKind(ctrl)}:${ctrl?.id || ''}:${ctrl?.type || ''}`;
    },
    sectionKind(ctrl) {
      const type = (ctrl?.type || '').toLowerCase();
      if (type === 'klausa' || type === 'clause') return 'clause';
      return 'annex';
    },
    sectionLabel(ctrl) {
      return this.sectionKind(ctrl) === 'clause' ? (this.isEn ? 'Clause' : 'Klausa') : 'Annex A';
    },
    sectionTitle(ctrl) {
      return this.sectionKind(ctrl) === 'clause'
        ? (this.isEn ? 'Management System Requirements' : 'Persyaratan Sistem Manajemen')
        : (this.isEn ? 'Reference Controls' : 'Kontrol Referensi');
    },
    sectionDescription(ctrl) {
      return this.sectionKind(ctrl) === 'clause'
        ? (this.isEn ? 'Clauses 4-10 explain the ISMS governance system that must be established, operated, evaluated, and improved.' : 'Klausa 4-10 menjelaskan sistem tata kelola SMKI yang harus dibangun, dijalankan, dievaluasi, dan diperbaiki.')
        : (this.isEn ? 'Annex A contains control objectives used as risk treatment references through the Statement of Applicability.' : 'Annex A berisi kontrol yang digunakan sebagai referensi perlakuan risiko melalui Statement of Applicability.');
    },
    shouldShowSectionHeader(ctrl, idx) {
      if (idx === 0) return true;
      const prev = this.paginatedControls[idx - 1];
      return this.sectionKind(prev) !== this.sectionKind(ctrl);
    },
    selectExplorerControl(ctrl) {
      this.explorerState.selectedId = ctrl.id;
      this.explorerState.selectedKey = this.controlKey(ctrl);
    },
    selectConceptControl(ctrl) {
      this.conceptState.selectedId = ctrl.id;
      this.conceptState.selectedKey = this.controlKey(ctrl);
    },
    enrichControl(control) {
      if (this.sectionKind(control) !== 'clause') return control;
      const lang = this.isEn ? 'en' : 'id';
      const details = clauseDetails[control.id]?.[lang];
      if (!details) return control;
      const base = clauseGuidance[lang];
      return {
        ...control,
        priority: control.priority || base.priority,
        difficulty: control.difficulty || base.difficulty,
        concept: control.concept || (this.isEn ? 'Govern' : 'Mengatur'),
        capability: control.capability || (this.isEn ? 'ISMS governance' : 'Tata kelola SMKI'),
        analogy: control.analogy || `${base.analogyPrefix} ${details[0]}`,
        implementationTips: control.implementationTips || `${base.implementationPrefix} ${details[1]}`,
      };
    },
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
    getPillClass(priority) { return { 'Kritis': 'danger', 'Critical': 'danger', 'Tinggi': 'warning', 'High': 'warning', 'Sedang': 'sky', 'Medium': 'sky', 'Rendah': 'success', 'Low': 'success' }[priority] || 'neutral'; },
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
        const response = await fetch(`/data/${this.localizedDataFile('iso27001')}?t=${new Date().getTime()}`);
        if (response.ok) {
          const data = await response.json();
          this.controls = (Array.isArray(data) ? data : data.controls || [])
            .map((control, idx) => this.enrichControl({
              ...control,
              _key: `${this.sectionKind(control)}:${control.id}:${control.type || ''}:${idx}`,
            }));
          if (this.controls.length > 0) {
            this.explorerState.selectedId = this.controls[0].id;
            this.explorerState.selectedKey = this.controlKey(this.controls[0]);
          }
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
    currentLanguage() {
      this.loadData();
    },
    filteredControls() {
      this.currentPage = 1; // Reset to first page when filters change
      if (this.filteredControls.length && !this.filteredControls.find(c => this.controlKey(c) === this.explorerState.selectedKey)) {
        this.explorerState.selectedId = this.filteredControls[0]?.id || null;
        this.explorerState.selectedKey = this.filteredControls[0] ? this.controlKey(this.filteredControls[0]) : null;
      }
      if (this.conceptState.active) {
        const cList = this.conceptFilteredControls;
        if (cList.length && !cList.find(c => this.controlKey(c) === this.conceptState.selectedKey)) {
          this.conceptState.selectedId = cList[0]?.id || null;
          this.conceptState.selectedKey = cList[0] ? this.controlKey(cList[0]) : null;
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
.iso-quick-themes{display:flex;flex-wrap:wrap;gap:.55rem}
.iso-quick-theme{flex:1 1 auto;padding:.62rem .68rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.72);text-align:left;cursor:pointer}
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
.iso-workspace{display:grid;grid-template-columns:.85fr 1.15fr;gap:1rem}
.iso-filter-panel{grid-column:1 / -1}
.iso-form-grid{display:flex;gap:.75rem;align-items:flex-end}
.iso-form-grid > div { flex: 1; }
.iso-form-grid label{display:block;margin-bottom:.35rem;color:var(--muted);font-size:.76rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.iso-summary{padding:.82rem .88rem;border-radius:18px;background:linear-gradient(180deg,rgba(25,61,87,.95) 0%,rgba(23,70,67,.95) 100%);color:#fffaf2}
.iso-summary small{display:block;color:rgba(255,250,242,.7);font-size:.72rem;text-transform:uppercase;letter-spacing:.08em}
.iso-summary strong{display:block;margin-top:.28rem;font-size:1.72rem;font-weight:800;line-height:1}
.iso-summary span{display:block;margin-top:.42rem;color:rgba(255,250,242,.78);font-size:.78rem;line-height:1.5}
.iso-list{max-height:760px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(15,118,110,0.3) transparent;padding-right:.2rem}
.iso-item{position:relative;width:100%;padding:.7rem .8rem .68rem .88rem;margin-bottom:.55rem;border-radius:14px;border:1px solid rgba(19,34,56,.08);background:#fff;text-align:left;cursor:pointer;content-visibility:auto;contain-intrinsic-size:auto 80px}
.iso-item:last-child{margin-bottom:0}
.iso-section-header{margin:.25rem 0 .65rem;padding:.72rem .82rem;border-radius:16px;border:1px solid rgba(15,118,110,.18);background:linear-gradient(135deg,rgba(15,118,110,.1) 0%,rgba(37,99,235,.08) 100%)}
.iso-section-header span{display:block;color:#0f766e;font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em}
.iso-section-header strong{display:block;margin-top:.18rem;color:var(--ink);font-size:.9rem;font-weight:900}
.iso-section-header em{display:block;margin-top:.18rem;color:var(--muted);font-size:.76rem;font-style:normal;line-height:1.45}
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
.role-translation-box {margin-bottom: 0.5rem; animation: highlight-role 0.5s ease;}
.role-translation-box .iso-detail-label {color: #144e72;}
.role-callout {background: linear-gradient(135deg, rgba(20, 78, 114, 0.08) 0%, rgba(72, 202, 228, 0.08) 100%); border-color: rgba(20, 78, 114, 0.2); border-left: 4px solid #144e72; font-weight: 600;}
@keyframes highlight-role { from { transform: translateY(-5px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
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

[data-bs-theme="dark"] .iso-page{--ink:#f8fafc;--muted:#94a3b8;--line:rgba(255,255,255,.1);--shell:linear-gradient(180deg,#0f172a 0%,#1e293b 100%);--accent-muted:rgba(255,255,255,0.05)}
[data-bs-theme="dark"] .iso-metric,[data-bs-theme="dark"] .iso-side,[data-bs-theme="dark"] .iso-panel,[data-bs-theme="dark"] .iso-mini,[data-bs-theme="dark"] .iso-side-card{background:rgba(30,41,59,0.5);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .iso-tab{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .iso-tab.active{background:rgba(30,41,59,0.9);border-color:var(--accent,#48cae4)}
[data-bs-theme="dark"] .iso-tab i,[data-bs-theme="dark"] .iso-icon{background:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .iso-item,[data-bs-theme="dark"] .iso-tile,[data-bs-theme="dark"] .iso-pillar,[data-bs-theme="dark"] .iso-fn{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .iso-item.active,[data-bs-theme="dark"] .iso-tile.active,[data-bs-theme="dark"] .iso-pillar.active,[data-bs-theme="dark"] .iso-fn.active{background:rgba(30,41,59,0.9);border-color:var(--accent,#48cae4)}
[data-bs-theme="dark"] .iso-item-code,[data-bs-theme="dark"] .iso-code,[data-bs-theme="dark"] .iso-item-name,[data-bs-theme="dark"] .iso-inspector-head strong,[data-bs-theme="dark"] .iso-mini strong{color:var(--accent,#48cae4)}
[data-bs-theme="dark"] .iso-card{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .iso-card.active{background:rgba(30,41,59,0.9);border-color:var(--accent,#48cae4)}
[data-bs-theme="dark"] .iso-chip,[data-bs-theme="dark"] .iso-pill,[data-bs-theme="dark"] .iso-meta span{background:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .iso-track,[data-bs-theme="dark"] .iso-priority-track{background:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .iso-callout{background:rgba(30,41,59,0.4)}
[data-bs-theme="dark"] .role-callout {background: rgba(72, 202, 228, 0.1); border-color: rgba(72, 202, 228, 0.3); border-left-color: #48cae4;}
[data-bs-theme="dark"] .role-translation-box .iso-detail-label {color: #48cae4;}
[data-bs-theme="dark"] .iso-note{background:rgba(30,41,59,0.7);border-color:var(--accent,#48cae4)}
[data-bs-theme="dark"] .iso-ref{background:rgba(30,41,59,0.8);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .iso-empty{background:rgba(30,41,59,0.3);border-color:rgba(255,255,255,0.1)}
[data-bs-theme="dark"] .sej-modal-shell{display:grid;grid-template-rows:auto minmax(0, 1fr);max-height:85vh;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 64px rgba(15,23,42,.24),0 8px 24px rgba(15,23,42,.12)}
[data-bs-theme="dark"] .sej-modal-artifact-list li,[data-bs-theme="dark"] .sej-modal-empty{background:rgba(255,255,255,0.05);color:var(--ink)}
[data-bs-theme="dark"] .sej-modal-scope{background:rgba(255,255,255,0.1);color:#48cae4}
[data-bs-theme="dark"] .sej-modal-req-btn{background:rgba(30,41,59,0.8);border-color:rgba(255,255,255,0.1);color:var(--ink)}
</style>
