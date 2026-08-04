<template>
  <div class="iso-page">
    <div class="iso-shell">
      <div class="iso-hero">
        <div class="iso-hero-content">
          <span class="iso-kicker">{{ ui.kicker }}</span>
          <h1 class="iso-title">"What-If" Compliance Simulator</h1>
          <p class="iso-lede">{{ ui.lede }}</p>
        </div>
      </div>

      <div class="iso-grid" :class="{'two': currentStep === 6}">
        <!-- Steps Container (1 to 5) -->
        <template v-if="currentStep < 6">
          <section class="iso-panel simulator-panel">
            
            <!-- Step Navigation Headers -->
            <div class="step-progress-wrapper mb-4">
               <div class="step-progress">
                  <div 
                    v-for="(step, index) in steps" 
                    :key="index" 
                    class="step-indicator"
                    :class="{ 'active': currentStep === index + 1, 'completed': currentStep > index + 1 }"
                  >
                    <div class="step-dot">{{ currentStep > index + 1 ? '✓' : index + 1 }}</div>
                    <span class="step-label d-none d-md-block">{{ step.shortTitle }}</span>
                  </div>
                  <div class="progress-line" :style="{ width: ((currentStep - 1) / (steps.length - 1)) * 100 + '%' }"></div>
               </div>
            </div>

            <!-- Current Step Content -->
            <div class="iso-panel-head mb-3">
              <h3>{{ currentStep }}. {{ currentStepData.title }}</h3>
              <span class="iso-pill">{{ ui.chooseOneOrMore }}</span>
            </div>
            
            <p class="text-muted mb-4" style="font-size: 0.9rem;">{{ currentStepData.desc }}</p>

            <div class="sim-options">
              <button 
                v-for="option in currentStepData.options" 
                :key="option.id"
                class="sim-option multi" 
                :class="{ 'selected': isSelected(currentStepData.field, option.id) }"
                @click="toggleSelection(currentStepData.field, option.id)"
              >
                <div class="checkbox-indicator">
                  <i class="fas fa-check" v-if="isSelected(currentStepData.field, option.id)"></i>
                </div>
                <i :class="`fas ${option.icon}`" class="main-icon"></i>
                <strong>{{ option.label }}</strong>
                <span>{{ option.desc }}</span>
              </button>
            </div>

            <!-- Navigation Buttons -->
            <div class="sim-actions mt-5 d-flex justify-content-between align-items-center">
              <button 
                class="btn btn-outline-secondary" 
                @click="currentStep--" 
                :style="{ visibility: currentStep > 1 ? 'visible' : 'hidden' }"
              >
                <i class="fas fa-arrow-left me-2"></i> {{ ui.back }}
              </button>
              
              <button 
                class="btn-primary-custom" 
                @click="nextStep"
                :disabled="scenario[currentStepData.field].length === 0"
              >
                <template v-if="currentStep < 5">
                  {{ ui.next }} <i class="fas fa-arrow-right ms-2"></i>
                </template>
                <template v-else>
                  <i class="fas" :class="isSimulating ? 'fa-spinner fa-spin' : 'fa-play'"></i> 
                  {{ isSimulating ? ui.simulating : ui.runSimulation }}
                </template>
              </button>
            </div>
          </section>
        </template>

        <!-- Step 6: Hasil Simulasi -->
        <template v-if="currentStep === 6 && simulationResult">
          <!-- Parameter Summary Panel -->
          <section class="iso-panel" style="grid-column: 1 / -1;">
            <div class="iso-panel-head">
              <h3>{{ ui.parameterSummary }}</h3>
              <div class="d-flex gap-2 align-items-center flex-wrap">
                <ReportExporter
                  type="simulator"
                  :payload="exportPayload"
                  :is-en="$i18n.locale === 'en'"
                  trigger-class="btn-outline-primary btn-sm"
                />
                <button class="btn btn-sm btn-outline-secondary" @click="resetSimulation"><i class="fas fa-redo me-1"></i> {{ ui.startOver }}</button>
              </div>
            </div>
            <div class="sim-scenario-summary-grid">
               <div class="summary-col">
                 <small>{{ ui.industry }}</small>
                 <div class="tag-cloud">
                   <span class="iso-pill compact" v-for="item in scenario.industries" :key="item">{{ item }}</span>
                 </div>
               </div>
               <div class="summary-col">
                 <small>{{ ui.dataLocation }}</small>
                 <div class="tag-cloud">
                   <span class="iso-pill compact" v-for="item in scenario.locations" :key="item">{{ item }}</span>
                 </div>
               </div>
               <div class="summary-col">
                 <small>{{ ui.dataType }}</small>
                 <div class="tag-cloud">
                   <span class="iso-pill compact" v-for="item in scenario.dataTypes" :key="item">{{ item }}</span>
                 </div>
               </div>
               <div class="summary-col">
                 <small>{{ ui.manager }}</small>
                 <div class="tag-cloud">
                   <span class="iso-pill compact" v-for="item in scenario.usages" :key="item">{{ item }}</span>
                 </div>
               </div>
               <div class="summary-col" v-if="scenario.targets.length">
                 <small>{{ ui.regulatoryTarget }}</small>
                 <div class="tag-cloud">
                   <span class="iso-pill compact" v-for="item in scenario.targets" :key="item">{{ item }}</span>
                 </div>
               </div>
            </div>
          </section>

          <!-- Result Cards Panel -->
          <section class="iso-panel mt-3" style="grid-column: 1 / -1; background: transparent; border: none; padding: 0; box-shadow: none;">
            <div class="iso-panel-head mb-3">
              <h3 style="font-size: 1.4rem;"><i class="fas fa-radar me-2 text-primary"></i> {{ ui.findings }}</h3>
              <span class="sim-findings-count">{{ simulationResult.length }} {{ ui.findingsCount }}</span>
            </div>

            <!-- Risk Summary Bar -->
            <div class="sim-risk-summary">
              <div class="sim-risk-item danger">
                <i class="fas fa-times-circle"></i>
                <strong>{{ simulationResult.filter(r => r.severity === 'danger').length }}</strong>
                <span>{{ ui.critical }}</span>
              </div>
              <div class="sim-risk-item warning">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>{{ simulationResult.filter(r => r.severity === 'warning').length }}</strong>
                <span>{{ ui.moderate }}</span>
              </div>
              <div class="sim-risk-item success">
                <i class="fas fa-check-circle"></i>
                <strong>{{ simulationResult.filter(r => r.severity === 'success').length }}</strong>
                <span>{{ ui.compliant }}</span>
              </div>
            </div>

            <div class="sim-results">
              <div v-for="(res, idx) in simulationResult" :key="idx" class="sim-result-card" :class="res.severity">
                <!-- Card Header -->
                <div class="sim-card-header">
                  <div class="sim-card-header-left">
                    <div class="sim-severity-icon" :class="res.severity">
                      <i class="fas" :class="getSeverityIcon(res.severity)"></i>
                    </div>
                    <div>
                      <span class="sim-framework">{{ res.framework }}</span>
                      <div class="sim-reg-refs" v-if="res.regulations && res.regulations.length">
                        <span v-for="reg in res.regulations" :key="reg" class="sim-reg-tag">{{ reg }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="sim-card-header-right">
                    <span class="sim-status-badge" :class="res.severity">{{ getSeverityText(res.severity) }}</span>
                    <span class="sim-criticality-score" :class="res.severity">{{ ui.criticalityLabel }}: {{ res.criticalityScore }}/10</span>
                  </div>
                </div>

                <!-- Why This Matters -->
                <div class="sim-why-block">
                  <div class="sim-block-label"><i class="fas fa-exclamation-circle"></i> {{ ui.whyLabel }}</div>
                  <p class="sim-why-text">{{ res.why }}</p>
                </div>

                <!-- Impact if Ignored -->
                <div class="sim-impact-block" v-if="res.impact">
                  <div class="sim-block-label impact"><i class="fas fa-bolt"></i> {{ ui.impactLabel }}</div>
                  <p class="sim-impact-text">{{ res.impact }}</p>
                </div>

                <!-- Recommendations -->
                <div class="sim-rec-block" v-if="res.recommendations && res.recommendations.length">
                  <div class="sim-block-label rec"><i class="fas fa-tasks"></i> {{ ui.actionsLabel }}</div>
                  <ul class="sim-rec-list">
                    <li v-for="(rec, rIdx) in res.recommendations" :key="rIdx">
                      <span class="sim-rec-priority" :class="rec.priority">{{ getPriorityLabel(rec.priority) }}</span>
                      <span class="sim-rec-text">{{ rec.action }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Effort Indicator -->
                <div class="sim-effort-row">
                  <div class="sim-effort-item">
                    <span class="sim-effort-label">{{ ui.effortLabel }}</span>
                    <span class="sim-effort-val" :class="res.effort">{{ getEffortLabel(res.effort) }}</span>
                  </div>
                  <div class="sim-effort-item">
                    <span class="sim-effort-label">{{ ui.timelineLabel }}</span>
                    <span class="sim-effort-val">{{ res.timeline }}</span>
                  </div>
                  <div class="sim-effort-item" v-if="res.owner">
                    <span class="sim-effort-label">{{ ui.ownerLabel }}</span>
                    <span class="sim-effort-val">{{ res.owner }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </template>

      </div>
    </div>
  </div>
</template>
<script>
import ReportExporter from '../components/ReportExporter.vue';

export default {
  components: { ReportExporter },
  name: 'Simulator',
  data() {
    return {
      currentStep: 1,
      isSimulating: false,
      scenario: {
        industries: [],
        locations: [],
        dataTypes: [],
        usages: [],
        targets: []
      },
      simulationResult: null
    };
  },
  computed: {
    steps() {
      const en = this.$i18n.locale === 'en';
      return en ? [
        {
          shortTitle: 'Industry',
          title: 'Industry Sector',
          desc: 'Choose the industry sector where your organization operates.',
          field: 'industries',
          options: [
            { id: 'Perbankan', label: 'Banking', desc: 'Commercial / Islamic banks', icon: 'fa-university' },
            { id: 'Fintech', label: 'Digital Financial Services', desc: 'P2P lending, e-wallets', icon: 'fa-mobile-alt' },
            { id: 'Kesehatan', label: 'Healthcare / Medical', desc: 'Hospitals, clinics', icon: 'fa-hospital' },
            { id: 'E-Commerce', label: 'E-Commerce / Retail', desc: 'Online stores, logistics', icon: 'fa-shopping-cart' },
            { id: 'Pemerintahan', label: 'Government / SOE', desc: 'Public institutions', icon: 'fa-building' }
          ]
        },
        {
          shortTitle: 'Server Location',
          title: 'Data Placement Location',
          desc: 'Where are your primary and backup data stored?',
          field: 'locations',
          options: [
            { id: 'On-Premise', label: 'On-Premise (Local)', desc: 'Physical servers in your own office', icon: 'fa-server' },
            { id: 'Cloud ID', label: 'Indonesia Cloud', desc: 'Data center within Indonesia', icon: 'fa-cloud' },
            { id: 'Singapura', label: 'Singapore / Asia Cloud', desc: 'AWS/GCP/Azure SG', icon: 'fa-globe-asia' },
            { id: 'US', label: 'United States Cloud', desc: 'US data center', icon: 'fa-flag-usa' },
            { id: 'Eropa', label: 'Europe Cloud', desc: 'European Union data center', icon: 'fa-euro-sign' }
          ]
        },
        {
          shortTitle: 'Data Class',
          title: 'Processed Data Types',
          desc: 'What kinds of data are stored by your system?',
          field: 'dataTypes',
          options: [
            { id: 'Publik', label: 'Public Data', desc: 'General information, news, portfolio', icon: 'fa-bullhorn' },
            { id: 'Pribadi Umum', label: 'General Personal Data', desc: 'Name, email, phone number', icon: 'fa-address-card' },
            { id: 'Pribadi Spesifik', label: 'Specific Personal Data', desc: 'Medical, biometric, religion', icon: 'fa-fingerprint' },
            { id: 'Finansial', label: 'Financial Data', desc: 'Credit cards, account transactions', icon: 'fa-credit-card' },
            { id: 'HAKI', label: 'Trade Secrets', desc: 'Source code, secret recipes', icon: 'fa-user-secret' }
          ]
        },
        {
          shortTitle: 'Manager',
          title: 'System Managers & Access',
          desc: 'Who has access to manage systems and databases?',
          field: 'usages',
          options: [
            { id: 'Tim Internal', label: 'Internal Team (Local)', desc: 'Local employees / office team', icon: 'fa-users' },
            { id: 'Tim Remote', label: 'Cross-Border Remote Team', desc: 'Remote workers abroad', icon: 'fa-laptop-house' },
            { id: 'Vendor Cloud', label: 'Cloud Provider Vendor', desc: 'AWS, Google, Microsoft', icon: 'fa-cloud-meatball' },
            { id: 'Pihak Ketiga', label: 'Other Third Parties', desc: 'Analytics, marketing agencies', icon: 'fa-handshake' }
          ]
        },
        {
          shortTitle: 'Target',
          title: 'Standards & Regulations (Optional)',
          desc: 'Which regulations are your main compliance targets?',
          field: 'targets',
          options: [
            { id: 'ISO 27001', label: 'ISO 27001:2022', desc: 'International information security standard', icon: 'fa-shield-alt' },
            { id: 'NIST', label: 'NIST CSF 2.0', desc: 'NIST cybersecurity framework', icon: 'fa-compass' },
            { id: 'COBIT', label: 'COBIT 2019', desc: 'Enterprise IT governance', icon: 'fa-project-diagram' },
            { id: 'SEOJK', label: 'SEOJK 29/2022', desc: 'OJK cybersecurity regulation', icon: 'fa-landmark' },
            { id: 'PBI', label: 'PBI 02/2024', desc: 'Bank Indonesia regulation', icon: 'fa-building-columns' },
            { id: 'PADG', label: 'PADG 32/2025', desc: 'BI cybersecurity guidance', icon: 'fa-file-contract' },
            { id: 'PADK', label: 'PADK 1 Tahun 2026', desc: 'IT operations for commercial banks', icon: 'fa-server' },
            { id: 'Resiliensi', label: 'OJK Resilience', desc: 'OJK digital resilience guidance', icon: 'fa-shield-heart' },
            { id: 'OWASP', label: 'OWASP (Top 10 / ASVS)', desc: 'Web application security standards', icon: 'fa-bug' },
            { id: 'PDP', label: 'UU PDP No. 27/2022', desc: 'Personal data protection', icon: 'fa-user-shield' }
          ]
        }
      ] : [
        {
          shortTitle: 'Industri',
          title: 'Sektor Industri',
          desc: 'Pilih sektor industri tempat organisasi Anda beroperasi.',
          field: 'industries',
          options: [
            { id: 'Perbankan', label: 'Perbankan', desc: 'Bank Umum / Syariah', icon: 'fa-university' },
            { id: 'Fintech', label: 'Layanan Keuangan Digital', desc: 'P2P Lending, E-Wallet', icon: 'fa-mobile-alt' },
            { id: 'Kesehatan', label: 'Kesehatan / Medis', desc: 'Rumah Sakit, Klinik', icon: 'fa-hospital' },
            { id: 'E-Commerce', label: 'E-Commerce / Retail', desc: 'Toko Online, Ekspedisi', icon: 'fa-shopping-cart' },
            { id: 'Pemerintahan', label: 'Pemerintahan / BUMN', desc: 'Instansi Publik', icon: 'fa-building' }
          ]
        },
        {
          shortTitle: 'Lokasi Server',
          title: 'Lokasi Penempatan Data',
          desc: 'Di mana data utama dan cadangan Anda disimpan?',
          field: 'locations',
          options: [
            { id: 'On-Premise', label: 'On-Premise (Lokal)', desc: 'Server fisik di kantor sendiri', icon: 'fa-server' },
            { id: 'Cloud ID', label: 'Cloud Indonesia', desc: 'Data Center di wilayah NKRI', icon: 'fa-cloud' },
            { id: 'Singapura', label: 'Cloud Singapura / Asia', desc: 'AWS/GCP/Azure SG', icon: 'fa-globe-asia' },
            { id: 'US', label: 'Cloud United States', desc: 'Data Center Amerika', icon: 'fa-flag-usa' },
            { id: 'Eropa', label: 'Cloud Eropa', desc: 'Data Center wilayah Uni Eropa', icon: 'fa-euro-sign' }
          ]
        },
        {
          shortTitle: 'Klasifikasi Data',
          title: 'Tipe Data yang Diproses',
          desc: 'Jenis data apa saja yang ditampung oleh sistem Anda?',
          field: 'dataTypes',
          options: [
            { id: 'Publik', label: 'Data Publik', desc: 'Info umum, berita, portofolio', icon: 'fa-bullhorn' },
            { id: 'Pribadi Umum', label: 'Data Pribadi Umum', desc: 'Nama, Email, No HP', icon: 'fa-address-card' },
            { id: 'Pribadi Spesifik', label: 'Data Pribadi Spesifik', desc: 'Medis, Biometrik, Agama', icon: 'fa-fingerprint' },
            { id: 'Finansial', label: 'Data Finansial', desc: 'Kartu Kredit, Mutasi Rek', icon: 'fa-credit-card' },
            { id: 'HAKI', label: 'Rahasia Dagang', desc: 'Source code, resep rahasia', icon: 'fa-user-secret' }
          ]
        },
        {
          shortTitle: 'Pengelola',
          title: 'Pihak Pengelola & Akses',
          desc: 'Siapa yang memiliki akses untuk mengelola sistem dan database?',
          field: 'usages',
          options: [
            { id: 'Tim Internal', label: 'Tim Internal (Lokal)', desc: 'Karyawan WFO / Lokal', icon: 'fa-users' },
            { id: 'Tim Remote', label: 'Tim Remote Lintas Negara', desc: 'WFA di luar negeri', icon: 'fa-laptop-house' },
            { id: 'Vendor Cloud', label: 'Vendor Cloud Provider', desc: 'AWS, Google, Microsoft', icon: 'fa-cloud-meatball' },
            { id: 'Pihak Ketiga', label: 'Pihak Ketiga Lainnya', desc: 'Analytics, Marketing Agency', icon: 'fa-handshake' }
          ]
        },
        {
          shortTitle: 'Target Regulasi',
          title: 'Standar & Regulasi (Opsional)',
          desc: 'Regulasi apa yang secara spesifik menjadi target utama kepatuhan Anda?',
          field: 'targets',
          options: [
            { id: 'ISO 27001', label: 'ISO 27001:2022', desc: 'Standar Internasional Keamanan Informasi', icon: 'fa-shield-alt' },
            { id: 'NIST', label: 'NIST CSF 2.0', desc: 'Framework Keamanan Siber NIST', icon: 'fa-compass' },
            { id: 'COBIT', label: 'COBIT 2019', desc: 'Tata Kelola TI Perusahaan', icon: 'fa-project-diagram' },
            { id: 'SEOJK', label: 'SEOJK 29/2022', desc: 'Regulasi Keamanan Siber OJK', icon: 'fa-landmark' },
            { id: 'PBI', label: 'PBI 02/2024', desc: 'Peraturan Bank Indonesia', icon: 'fa-building-columns' },
            { id: 'PADG', label: 'PADG 32/2025', desc: 'Pedoman Keamanan Siber BI', icon: 'fa-file-contract' },
            { id: 'PADK', label: 'PADK 1 Tahun 2026', desc: 'Penyelenggaraan TI Bank Umum', icon: 'fa-server' },
            { id: 'Resiliensi', label: 'Resiliensi OJK', desc: 'Panduan Resiliensi Digital OJK', icon: 'fa-shield-heart' },
            { id: 'OWASP', label: 'OWASP (Top 10 / ASVS)', desc: 'Standar Keamanan Aplikasi Web', icon: 'fa-bug' },
            { id: 'PDP', label: 'UU PDP No. 27/2022', desc: 'Pelindungan Data Pribadi', icon: 'fa-user-shield' }
          ]
        }
      ];
    },
    ui() {
      const en = this.$i18n.locale === 'en';
      return {
        kicker: en ? 'Interactive Tool' : 'Interactive Tool',
        lede: en ? 'Choose your architecture and operational scenario. Instantly evaluate potential cross-regulation compliance gaps based on the parameters you apply.' : 'Pilih skenario arsitektur dan operasional Anda. Evaluasi secara instan potensi celah kepatuhan lintas regulasi berdasarkan multi-dimensi parameter yang Anda terapkan.',
        chooseOneOrMore: en ? 'Choose one or more' : 'Pilih satu atau lebih',
        back: en ? 'Back' : 'Kembali',
        next: en ? 'Next' : 'Lanjut',
        simulating: en ? 'Simulating...' : 'Menyimulasikan...',
        runSimulation: en ? 'Run Simulation' : 'Jalankan Simulasi',
        parameterSummary: en ? 'Your Parameter Summary' : 'Ringkasan Parameter Anda',
        startOver: en ? 'Start Over' : 'Mulai Ulang',
        industry: en ? 'Industry' : 'Industri',
        dataLocation: en ? 'Data Location' : 'Lokasi Data',
        dataType: en ? 'Data Type' : 'Tipe Data',
        manager: en ? 'Manager' : 'Pengelola',
        regulatoryTarget: en ? 'Regulatory Target' : 'Target Regulasi',
        findings: en ? 'Compliance Findings (Gap Analysis)' : 'Temuan Kepatuhan (Gap Analysis)',
        recommendation: en ? 'Action / Recommendation' : 'Tindakan / Rekomendasi',
        findingsCount: en ? 'findings identified' : 'temuan teridentifikasi',
        critical: en ? 'Critical' : 'Kritis',
        moderate: en ? 'Moderate' : 'Perhatian',
        compliant: en ? 'Compliant' : 'Aman',
        criticalityLabel: en ? 'Criticality' : 'Kritikalitas',
        whyLabel: en ? 'Why This Matters' : 'Mengapa Ini Penting',
        impactLabel: en ? 'Risk if Ignored' : 'Risiko Jika Diabaikan',
        actionsLabel: en ? 'Recommended Actions' : 'Tindakan yang Direkomendasikan',
        effortLabel: en ? 'Implementation Effort' : 'Upaya Implementasi',
        timelineLabel: en ? 'Timeline' : 'Timeline',
        ownerLabel: en ? 'Responsible Party' : 'Penanggung Jawab'
      };
    },
    currentStepData() {
      return this.steps[this.currentStep - 1] || {};
    },
    exportPayload() {
      return {
        scenario: this.scenario,
        results: this.simulationResult || [],
      };
    }
  },
  methods: {
    isSelected(field, id) {
      return this.scenario[field].includes(id);
    },
    toggleSelection(field, id) {
      const idx = this.scenario[field].indexOf(id);
      if (idx > -1) {
        this.scenario[field].splice(idx, 1);
      } else {
        this.scenario[field].push(id);
      }
    },
    nextStep() {
      if (this.currentStep < 5) {
        this.currentStep++;
      } else {
        this.runSimulation();
      }
    },
    resetSimulation() {
      this.scenario = { industries: [], locations: [], dataTypes: [], usages: [], targets: [] };
      this.simulationResult = null;
      this.currentStep = 1;
    },
    runSimulation() {
      this.isSimulating = true;
      // Mocking latency
      setTimeout(() => {
        this.simulationResult = this.calculateResult();
        this.currentStep = 6;
        this.isSimulating = false;
        
        // Scroll down to results
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }, 1200);
    },
    
    // --- SCENARIO LOGIC ENGINE ---
    calculateResult() {
      const results = [];
      const { industries, locations, dataTypes, usages, targets } = this.scenario;
      const en = this.$i18n.locale === 'en';

      const hasForeignCloud = locations.includes('Singapura') || locations.includes('US') || locations.includes('Eropa');
      const hasPersonalData = dataTypes.includes('Pribadi Umum') || dataTypes.includes('Pribadi Spesifik');
      const hasSpecificData = dataTypes.includes('Pribadi Spesifik');
      const hasFinancialSect = industries.includes('Perbankan') || industries.includes('Fintech');
      const hasThirdParty = usages.includes('Vendor Cloud') || usages.includes('Pihak Ketiga');
      const hasRemote = usages.includes('Tim Remote');
      const hasOJK = targets.includes('SEOJK') || targets.includes('PBI') || targets.includes('PADG') || targets.includes('Resiliensi') || targets.includes('PADK');
      const hasISO = targets.includes('ISO 27001');
      const hasNIST = targets.includes('NIST');
      const hasCOBIT = targets.includes('COBIT');
      const hasPDP = targets.includes('PDP') || hasPersonalData;

      // ─── 1. TATA KELOLA & KEBIJAKAN ───────────────────────────────────────
      const policiesRegs = [];
      if (hasISO) policiesRegs.push('ISO 27001:2022 A.5');
      if (hasNIST) policiesRegs.push('NIST CSF GV.PO');
      if (hasCOBIT) policiesRegs.push('COBIT APO01');
      if (hasOJK) policiesRegs.push('SEOJK 29/2022 Pasal 7');
      if (hasPDP) policiesRegs.push('UU PDP Pasal 20');
      if (!policiesRegs.length) policiesRegs.push('ISO 27001:2022', 'Best Practice');

      const policiesRecs = [
        { priority: 'immediate', action: en ? 'Formalize and ratify Access Management SOP, Incident Response SOP, and BCP/DRP signed by the Board of Directors.' : 'Formalisasi dan sahkan SOP Manajemen Akses, SOP Respons Insiden, dan BCP/DRP yang ditandatangani Direksi.' },
        { priority: 'short', action: en ? 'Conduct an annual internal policy review cycle and document all changes in a version control system.' : 'Lakukan siklus review kebijakan internal tahunan dan dokumentasikan semua perubahan dalam version control.' },
      ];
      if (hasISO || hasNIST || hasCOBIT) {
        policiesRecs.push({ priority: 'short', action: en ? 'Develop ISMS documentation, Cryptography Policy, Asset Classification SOP, and IT Risk Management framework (COBIT APO12).' : 'Susun dokumentasi ISMS, Kebijakan Kriptografi, SOP Klasifikasi Aset, dan kerangka Manajemen Risiko TI (COBIT APO12).' });
      }
      if (hasPDP) {
        policiesRecs.push({ priority: 'immediate', action: en ? 'Appoint a Data Protection Officer (DPO), publish an external Privacy Policy, and create a Data Subject Rights Fulfillment SOP.' : 'Tunjuk DPO (Data Protection Officer), terbitkan Privacy Policy eksternal, dan buat SOP Pemenuhan Hak Subjek Data.' });
      }
      if (hasOJK || hasFinancialSect) {
        policiesRecs.push({ priority: 'short', action: en ? 'Establish an IT Steering Committee and align IT Governance Policy with OJK/BI regulatory requirements.' : 'Bentuk Komite Pengarah TI (IT Steering Committee) dan selaraskan Kebijakan Tata Kelola TI dengan persyaratan OJK/BI.' });
      }

      results.push({
        framework: en ? 'Governance & Policy (Administrative)' : 'Tata Kelola & Kebijakan (Administratif)',
        severity: hasOJK || hasFinancialSect ? 'danger' : 'warning',
        criticalityScore: hasOJK || hasFinancialSect ? 8 : 6,
        regulations: policiesRegs,
        why: en
          ? 'Regulatory frameworks universally require documented, board-approved policies as the foundation of any compliance program. Without formal governance documents, your organization cannot demonstrate due diligence during audits or regulatory inspections.'
          : 'Semua regulasi mensyaratkan kebijakan yang terdokumentasi dan disetujui Direksi sebagai fondasi program kepatuhan. Tanpa dokumen tata kelola yang formal, organisasi Anda tidak dapat membuktikan itikad baik (due diligence) saat audit atau inspeksi regulator.',
        impact: en
          ? 'Absence of formal policies can result in regulatory sanctions, failed certification audits (ISO 27001), and personal liability for executives. In financial sectors, OJK/BI can issue administrative sanctions including fines or license revocation.'
          : 'Ketiadaan kebijakan formal dapat berujung pada sanksi regulasi, gagal audit sertifikasi (ISO 27001), dan tanggung jawab pribadi bagi eksekutif. Di sektor keuangan, OJK/BI dapat menerbitkan sanksi administratif termasuk denda atau pencabutan izin.',
        recommendations: policiesRecs,
        effort: 'medium',
        timeline: en ? '1–3 months' : '1–3 bulan',
        owner: en ? 'CISO / Compliance Team' : 'CISO / Tim Kepatuhan'
      });

      // ─── 2. KONTROL TEKNIS & INFRASTRUKTUR ───────────────────────────────
      const toolsRegs = [];
      if (hasISO) toolsRegs.push('ISO 27001:2022 A.8');
      if (hasNIST) toolsRegs.push('NIST CSF PR.AC, PR.DS');
      if (hasOJK) toolsRegs.push('SEOJK 29/2022 Pasal 12');
      if (targets.includes('OWASP')) toolsRegs.push('OWASP Top 10');
      if (!toolsRegs.length) toolsRegs.push('ISO 27001:2022 A.8', 'NIST CSF');

      const toolsRecs = [
        { priority: 'immediate', action: en ? 'Deploy Next-Gen Firewall (NGFW) with IPS/IDS capability and endpoint Antivirus/EDR on all devices.' : 'Deploy Next-Gen Firewall (NGFW) dengan kemampuan IPS/IDS dan Antivirus/EDR di semua endpoint.' },
        { priority: 'immediate', action: en ? 'Enforce encryption for all data at rest (AES-256) and in transit (TLS 1.2+ minimum). Disable legacy protocols (TLS 1.0/1.1, SSLv3).' : 'Terapkan enkripsi untuk semua data at rest (AES-256) dan in transit (TLS 1.2+ minimum). Nonaktifkan protokol lama (TLS 1.0/1.1, SSLv3).' },
        { priority: 'short', action: en ? 'Implement Multi-Factor Authentication (MFA) for all privileged access and remote connections.' : 'Implementasikan Multi-Factor Authentication (MFA) untuk semua akses privileged dan koneksi remote.' },
      ];
      if (hasPersonalData || dataTypes.includes('Finansial')) {
        toolsRecs.push({ priority: 'short', action: en ? 'Implement database-level Data Masking/Obfuscation (especially in dev/staging environments) and DLP (Data Loss Prevention) to prevent unauthorized data exfiltration.' : 'Implementasikan Data Masking/Obfuscation di level database (terutama lingkungan dev/staging) dan DLP (Data Loss Prevention) untuk mencegah eksfiltrasi data tidak sah.' });
      }
      if (hasRemote) {
        toolsRecs.push({ priority: 'immediate', action: en ? 'Deploy Enterprise VPN with MFA for all remote workers. Implement MDM (Mobile Device Management) for BYOD devices accessing corporate resources.' : 'Deploy VPN Enterprise dengan MFA untuk semua pekerja remote. Implementasikan MDM (Mobile Device Management) untuk perangkat BYOD yang mengakses sumber daya perusahaan.' });
      }
      if (targets.includes('OWASP')) {
        toolsRecs.push({ priority: 'short', action: en ? 'Integrate SAST/DAST tools into the CI/CD pipeline and deploy a Web Application Firewall (WAF). Enforce secure coding standards (OWASP ASVS).' : 'Integrasikan SAST/DAST ke dalam CI/CD pipeline dan deploy Web Application Firewall (WAF). Terapkan standar secure coding (OWASP ASVS).' });
      } else if (hasOJK || hasFinancialSect) {
        toolsRecs.push({ priority: 'short', action: en ? 'Deploy WAF, implement PAM (Privileged Access Management) for admin-level database/server access, and FIM (File Integrity Monitoring) on critical servers.' : 'Deploy WAF, implementasikan PAM (Privileged Access Management) untuk akses admin ke database/server, dan FIM (File Integrity Monitoring) di server kritis.' });
      }

      results.push({
        framework: en ? 'Technical Controls & Infrastructure' : 'Kontrol Teknis & Infrastruktur',
        severity: 'danger',
        criticalityScore: hasFinancialSect || hasOJK ? 9 : 8,
        regulations: toolsRegs,
        why: en
          ? 'Technical controls are the first line of defense against cyberattacks. Regulations such as ISO 27001 Annex A.8, SEOJK 29/2022, and NIST CSF explicitly mandate specific security tools as minimum requirements. Without them, your systems are exposed to known, preventable attack vectors.'
          : 'Kontrol teknis adalah lini pertahanan pertama terhadap serangan siber. Regulasi seperti ISO 27001 Annex A.8, SEOJK 29/2022, dan NIST CSF secara eksplisit mewajibkan perangkat keamanan spesifik sebagai persyaratan minimum. Tanpanya, sistem Anda terekspos pada vektor serangan yang diketahui dan dapat dicegah.',
        impact: en
          ? 'A single unmitigated vulnerability can lead to data breaches, ransomware attacks, and service disruption. For financial institutions, a breach can trigger mandatory OJK incident reporting within 1x24 hours, reputational damage, and customer compensation obligations. Fines under UU PDP can reach 2% of annual revenue.'
          : 'Satu celah yang tidak dimitigasi dapat menyebabkan kebocoran data, serangan ransomware, dan gangguan layanan. Bagi lembaga keuangan, pelanggaran memicu kewajiban pelaporan insiden OJK dalam 1x24 jam, kerusakan reputasi, dan kewajiban kompensasi nasabah. Denda berdasarkan UU PDP dapat mencapai 2% dari pendapatan tahunan.',
        recommendations: toolsRecs,
        effort: 'high',
        timeline: en ? '1–6 months (phased)' : '1–6 bulan (bertahap)',
        owner: en ? 'IT Security / Infrastructure Team' : 'Tim Keamanan TI / Infrastruktur'
      });

      // ─── 3. OPERASIONAL, SOC & AUDIT ─────────────────────────────────────
      const opsRegs = [];
      if (hasISO) opsRegs.push('ISO 27001:2022 A.8.16');
      if (hasNIST) opsRegs.push('NIST CSF DE.CM, RS.AN');
      if (hasOJK) opsRegs.push('SEOJK 29/2022 Pasal 15');
      if (targets.includes('Resiliensi')) opsRegs.push('Panduan Resiliensi OJK');
      if (!opsRegs.length) opsRegs.push('ISO 27001:2022', 'Best Practice');

      const opsScore = (hasOJK || hasISO || hasFinancialSect) ? 8 : 6;
      const opsRecs = [];
      if (hasOJK || hasISO || targets.includes('PADG') || hasFinancialSect) {
        opsRecs.push({ priority: 'short', action: en ? 'Implement a SIEM (Security Information and Event Management) system for centralized log collection and real-time threat correlation.' : 'Implementasikan SIEM (Security Information and Event Management) untuk sentralisasi log dan korelasi ancaman secara real-time.' });
        opsRecs.push({ priority: 'short', action: en ? 'Establish a 24/7 SOC (Security Operations Center) — either in-house or via an MSSP (Managed Security Service Provider).' : 'Bangun SOC (Security Operations Center) 24/7 — secara in-house atau melalui MSSP (Managed Security Service Provider).' });
        opsRecs.push({ priority: 'medium', action: en ? 'Conduct routine Penetration Testing at least annually (or after major system changes) by a certified third-party provider.' : 'Lakukan Penetration Testing rutin minimal tahunan (atau setelah perubahan sistem besar) oleh penyedia pihak ketiga bersertifikat.' });
      } else {
        opsRecs.push({ priority: 'short', action: en ? 'Establish daily network log review procedures and conduct an internal Vulnerability Assessment at least once a year.' : 'Tetapkan prosedur review log jaringan harian dan lakukan Vulnerability Assessment internal minimal setahun sekali.' });
      }
      if (hasNIST || hasOJK || targets.includes('Resiliensi')) {
        opsRecs.push({ priority: 'short', action: en ? 'Conduct annual Security Awareness Training for all employees, including phishing simulations. Retain security logs for a minimum of 3–5 years.' : 'Lakukan Security Awareness Training tahunan untuk seluruh pegawai, termasuk simulasi Phishing. Simpan log keamanan minimal 3–5 tahun.' });
        opsRecs.push({ priority: 'medium', action: en ? 'Run an annual DRP (Disaster Recovery Plan) simulation to validate RTO/RPO targets and update the plan based on findings.' : 'Jalankan simulasi DRP (Disaster Recovery Plan) tahunan untuk memvalidasi target RTO/RPO dan perbarui rencana berdasarkan temuan.' });
      }
      if (hasISO || hasOJK || hasCOBIT) {
        opsRecs.push({ priority: 'medium', action: en ? 'Schedule regular independent third-party IT audits (at least every 2 years) to validate certifications and regulatory compliance.' : 'Jadwalkan audit TI independen pihak ketiga secara berkala (minimal setiap 2 tahun) untuk memvalidasi sertifikasi dan kepatuhan regulasi.' });
      }

      results.push({
        framework: en ? 'Operations, SOC Team & Audit' : 'Operasional, Tim SOC & Audit',
        severity: (hasOJK || hasFinancialSect) ? 'danger' : 'warning',
        criticalityScore: opsScore,
        regulations: opsRegs,
        why: en
          ? 'Continuous monitoring is not optional — it is a regulatory mandate. Threats evolve daily, and without a SOC or SIEM, your organization is effectively "flying blind." Regulators expect evidence of active monitoring, not just policy documents.'
          : 'Pemantauan berkelanjutan bukan opsional — ini adalah mandat regulasi. Ancaman berkembang setiap hari, dan tanpa SOC atau SIEM, organisasi Anda secara efektif "buta." Regulator mengharapkan bukti pemantauan aktif, bukan hanya dokumen kebijakan.',
        impact: en
          ? 'Without continuous monitoring, breaches can go undetected for months (the industry average is 197 days). Late detection dramatically increases breach costs and regulatory penalties. For OJK-regulated entities, failure to detect and report incidents within the mandated timeframe results in direct administrative sanctions.'
          : 'Tanpa pemantauan berkelanjutan, pelanggaran dapat tidak terdeteksi selama berbulan-bulan (rata-rata industri adalah 197 hari). Deteksi terlambat secara dramatis meningkatkan biaya pelanggaran dan penalti regulasi. Bagi entitas yang diatur OJK, kegagalan mendeteksi dan melaporkan insiden dalam jangka waktu yang diamanatkan mengakibatkan sanksi administratif langsung.',
        recommendations: opsRecs,
        effort: 'high',
        timeline: en ? '3–9 months' : '3–9 bulan',
        owner: en ? 'SOC Lead / IT Operations' : 'SOC Lead / Operasional TI'
      });

      // ─── 4. MANAJEMEN VENDOR & KEDAULATAN DATA ────────────────────────────
      if (hasThirdParty || hasForeignCloud) {
        const vendorRegs = [];
        if (hasPDP) vendorRegs.push('UU PDP No. 27/2022 Pasal 56');
        if (hasOJK || hasFinancialSect) vendorRegs.push('SEOJK 29/2022 Pasal 22', 'PBI 02/2024');
        if (hasISO) vendorRegs.push('ISO 27001:2022 A.5.19');
        if (!vendorRegs.length) vendorRegs.push('ISO 27001:2022 A.5.19', 'Best Practice');

        let sev = 'warning';
        let vendorScore = 6;
        let vendorWhy, vendorImpact;
        const vendorRecs = [];

        if (hasForeignCloud && hasFinancialSect) {
          sev = 'danger';
          vendorScore = 10;
          vendorWhy = en
            ? 'OJK Regulation (SEOJK 29/2022) and Bank Indonesia (PBI 02/2024) explicitly mandate that primary systems and data centers for financial institutions must be located within Indonesian territory. Using foreign cloud servers for core systems is a direct regulatory violation.'
            : 'Regulasi OJK (SEOJK 29/2022) dan Bank Indonesia (PBI 02/2024) secara eksplisit mewajibkan sistem utama dan data center lembaga keuangan berada di wilayah Indonesia. Menggunakan server cloud luar negeri untuk sistem inti adalah pelanggaran regulasi langsung.';
          vendorImpact = en
            ? 'This is the highest-risk finding. Non-compliance can result in immediate OJK/BI sanctions, mandatory migration orders, operational suspension, and public disclosure of violations. There is no grace period for this requirement.'
            : 'Ini adalah temuan dengan risiko tertinggi. Ketidakpatuhan dapat mengakibatkan sanksi OJK/BI segera, perintah migrasi wajib, penghentian operasional, dan pengungkapan publik atas pelanggaran. Tidak ada masa tenggang untuk persyaratan ini.';
          vendorRecs.push({ priority: 'immediate', action: en ? 'Immediately initiate migration of all core system servers to an Indonesian-domiciled data center (IDC/Tier III+). Target completion within 6 months.' : 'Segera inisiasi migrasi semua server Core System ke data center berdomisili Indonesia (IDC/Tier III+). Target penyelesaian dalam 6 bulan.' });
          vendorRecs.push({ priority: 'immediate', action: en ? 'Obtain written approval from OJK/BI before using any overseas backup or DRC (Disaster Recovery Center) facility.' : 'Dapatkan persetujuan tertulis dari OJK/BI sebelum menggunakan fasilitas backup atau DRC (Disaster Recovery Center) di luar negeri.' });
        } else if (hasForeignCloud && hasPDP) {
          sev = 'danger';
          vendorScore = 9;
          vendorWhy = en
            ? 'UU PDP No. 27/2022 (Article 56) regulates cross-border personal data transfers. Storing Indonesian citizens\' personal data on foreign servers without fulfilling legal requirements constitutes a violation, regardless of the cloud provider\'s reputation.'
            : 'UU PDP No. 27/2022 (Pasal 56) mengatur transfer data pribadi lintas batas. Menyimpan data pribadi warga negara Indonesia di server luar negeri tanpa memenuhi persyaratan hukum merupakan pelanggaran, terlepas dari reputasi penyedia cloud.';
          vendorImpact = en
            ? 'Violations of UU PDP cross-border transfer provisions can result in administrative fines up to 2% of annual revenue, criminal sanctions for executives (up to 6 years imprisonment for intentional violations), and mandatory data deletion orders.'
            : 'Pelanggaran ketentuan transfer lintas batas UU PDP dapat mengakibatkan denda administratif hingga 2% dari pendapatan tahunan, sanksi pidana bagi eksekutif (hingga 6 tahun penjara untuk pelanggaran disengaja), dan perintah penghapusan data wajib.';
          vendorRecs.push({ priority: 'immediate', action: en ? 'Conduct a DPIA (Data Protection Impact Assessment) for all cross-border data flows. Document legal basis for each transfer.' : 'Lakukan DPIA (Data Protection Impact Assessment) untuk semua aliran data lintas batas. Dokumentasikan dasar hukum untuk setiap transfer.' });
          vendorRecs.push({ priority: 'short', action: en ? 'Obtain explicit, granular consent from data subjects for cross-border transfers OR verify that the destination country has equivalent data protection standards.' : 'Dapatkan persetujuan eksplisit dan granular dari subjek data untuk transfer lintas batas ATAU verifikasi bahwa negara tujuan memiliki standar perlindungan data yang setara.' });
        } else {
          vendorWhy = en
            ? 'Third-party vendors and cloud providers have access to your systems and data, but operate outside your direct control. Without formal contractual controls, you cannot enforce security standards on them, creating a significant supply chain risk.'
            : 'Vendor pihak ketiga dan penyedia cloud memiliki akses ke sistem dan data Anda, tetapi beroperasi di luar kendali langsung Anda. Tanpa kontrol kontraktual formal, Anda tidak dapat menegakkan standar keamanan pada mereka, menciptakan risiko rantai pasokan yang signifikan.';
          vendorImpact = en
            ? 'Third-party breaches are increasingly common and can expose your organization to liability even when the breach originates from the vendor. ISO 27001 and SEOJK explicitly require documented vendor risk management processes.'
            : 'Pelanggaran pihak ketiga semakin umum dan dapat mengekspos organisasi Anda pada kewajiban bahkan ketika pelanggaran berasal dari vendor. ISO 27001 dan SEOJK secara eksplisit mensyaratkan proses manajemen risiko vendor yang terdokumentasi.';
          vendorRecs.push({ priority: 'short', action: en ? 'Establish a Vendor Risk Management framework. Include strict SLA, NDA, and Right-to-Audit clauses in all third-party contracts.' : 'Bangun kerangka Vendor Risk Management. Sertakan SLA ketat, NDA, dan klausa Right-to-Audit dalam semua kontrak pihak ketiga.' });
          vendorRecs.push({ priority: 'medium', action: en ? 'Conduct annual vendor security assessments (questionnaire or on-site audit) for all critical vendors.' : 'Lakukan penilaian keamanan vendor tahunan (kuesioner atau audit on-site) untuk semua vendor kritis.' });
        }

        if (hasRemote) {
          vendorRecs.push({ priority: 'short', action: en ? 'Define and enforce a Remote Work Security Policy covering acceptable use, device requirements, and data handling for cross-border remote employees.' : 'Tetapkan dan terapkan Kebijakan Keamanan Kerja Remote yang mencakup penggunaan yang dapat diterima, persyaratan perangkat, dan penanganan data untuk karyawan remote lintas negara.' });
        }

        results.push({
          framework: en ? 'Vendor Management & Data Sovereignty' : 'Manajemen Vendor & Kedaulatan Data',
          severity: sev,
          criticalityScore: vendorScore,
          regulations: vendorRegs,
          why: vendorWhy,
          impact: vendorImpact,
          recommendations: vendorRecs,
          effort: sev === 'danger' ? 'high' : 'medium',
          timeline: sev === 'danger' ? (en ? '1–6 months (urgent)' : '1–6 bulan (mendesak)') : (en ? '2–4 months' : '2–4 bulan'),
          owner: en ? 'Legal / Procurement / IT Security' : 'Legal / Pengadaan / Keamanan TI'
        });
      }

      // ─── 5. PERLINDUNGAN DATA PRIBADI (UU PDP) ───────────────────────────
      if (hasSpecificData && !hasForeignCloud) {
        results.push({
          framework: en ? 'Specific Personal Data Protection (UU PDP)' : 'Perlindungan Data Pribadi Spesifik (UU PDP)',
          severity: 'danger',
          criticalityScore: 9,
          regulations: ['UU PDP No. 27/2022 Pasal 4', 'PP 71/2019'],
          why: en
            ? 'Specific personal data (medical records, biometrics, religion, financial data) carries the highest protection requirements under UU PDP No. 27/2022. Processing this category of data requires explicit consent, purpose limitation, and significantly stronger technical safeguards than general personal data.'
            : 'Data pribadi spesifik (rekam medis, biometrik, agama, data keuangan) membawa persyaratan perlindungan tertinggi di bawah UU PDP No. 27/2022. Pemrosesan kategori data ini memerlukan persetujuan eksplisit, pembatasan tujuan, dan perlindungan teknis yang jauh lebih kuat daripada data pribadi umum.',
          impact: en
            ? 'Unauthorized processing or breach of specific personal data carries criminal penalties of up to 5 years imprisonment and/or fines up to IDR 5 billion for individuals, plus administrative sanctions for the organization. Class action lawsuits from affected data subjects are also possible.'
            : 'Pemrosesan tidak sah atau pelanggaran data pribadi spesifik membawa sanksi pidana hingga 5 tahun penjara dan/atau denda hingga Rp 5 miliar untuk individu, ditambah sanksi administratif bagi organisasi. Gugatan class action dari subjek data yang terdampak juga dimungkinkan.',
          recommendations: [
            { priority: 'immediate', action: en ? 'Map all specific personal data flows (data mapping) and document the legal basis for each processing activity.' : 'Petakan semua aliran data pribadi spesifik (data mapping) dan dokumentasikan dasar hukum untuk setiap aktivitas pemrosesan.' },
            { priority: 'immediate', action: en ? 'Implement data minimization: only collect specific personal data that is strictly necessary for the stated purpose.' : 'Terapkan minimisasi data: hanya kumpulkan data pribadi spesifik yang benar-benar diperlukan untuk tujuan yang dinyatakan.' },
            { priority: 'short', action: en ? 'Conduct a mandatory DPIA (Data Protection Impact Assessment) before any new processing of specific personal data.' : 'Lakukan DPIA (Data Protection Impact Assessment) wajib sebelum pemrosesan baru data pribadi spesifik.' },
            { priority: 'short', action: en ? 'Implement technical controls: pseudonymization, encryption at rest, strict access controls, and audit logging for all access to specific personal data.' : 'Implementasikan kontrol teknis: pseudonimisasi, enkripsi at rest, kontrol akses ketat, dan audit logging untuk semua akses ke data pribadi spesifik.' },
          ],
          effort: 'high',
          timeline: en ? '2–4 months' : '2–4 bulan',
          owner: en ? 'DPO / Legal / IT Security' : 'DPO / Legal / Keamanan TI'
        });
      }

      // ─── 6. KEAMANAN APLIKASI WEB (OWASP) ────────────────────────────────
      if (targets.includes('OWASP') && (industries.includes('E-Commerce') || industries.includes('Fintech') || industries.includes('Perbankan'))) {
        results.push({
          framework: en ? 'Web Application Security (OWASP)' : 'Keamanan Aplikasi Web (OWASP)',
          severity: 'danger',
          criticalityScore: 8,
          regulations: ['OWASP Top 10 2021', 'OWASP ASVS 4.0'],
          why: en
            ? 'Web applications are the most common attack surface for financial and e-commerce organizations. OWASP Top 10 vulnerabilities (SQL Injection, XSS, Broken Authentication, etc.) are responsible for the majority of successful breaches. Regulators increasingly reference OWASP standards in their requirements.'
            : 'Aplikasi web adalah permukaan serangan paling umum bagi organisasi keuangan dan e-commerce. Kerentanan OWASP Top 10 (SQL Injection, XSS, Broken Authentication, dll.) bertanggung jawab atas mayoritas pelanggaran yang berhasil. Regulator semakin merujuk standar OWASP dalam persyaratan mereka.',
          impact: en
            ? 'A single exploited OWASP vulnerability can lead to complete database compromise, customer account takeover, and financial fraud. For fintech and banking, this triggers mandatory OJK incident reporting, potential license suspension, and significant reputational damage.'
            : 'Satu kerentanan OWASP yang dieksploitasi dapat menyebabkan kompromi database lengkap, pengambilalihan akun nasabah, dan penipuan keuangan. Untuk fintech dan perbankan, ini memicu pelaporan insiden OJK wajib, potensi penangguhan izin, dan kerusakan reputasi yang signifikan.',
          recommendations: [
            { priority: 'immediate', action: en ? 'Conduct an immediate OWASP Top 10 vulnerability assessment on all public-facing web applications.' : 'Lakukan penilaian kerentanan OWASP Top 10 segera pada semua aplikasi web yang menghadap publik.' },
            { priority: 'short', action: en ? 'Integrate SAST (Static Application Security Testing) into the development pipeline and DAST (Dynamic Application Security Testing) in staging/pre-production.' : 'Integrasikan SAST (Static Application Security Testing) ke dalam pipeline pengembangan dan DAST (Dynamic Application Security Testing) di staging/pre-production.' },
            { priority: 'short', action: en ? 'Deploy a Web Application Firewall (WAF) with OWASP Core Rule Set (CRS) in front of all public-facing applications.' : 'Deploy Web Application Firewall (WAF) dengan OWASP Core Rule Set (CRS) di depan semua aplikasi yang menghadap publik.' },
            { priority: 'medium', action: en ? 'Establish a mandatory Secure Development Lifecycle (SDL) and conduct OWASP ASVS-based security reviews for all new features.' : 'Tetapkan Secure Development Lifecycle (SDL) wajib dan lakukan review keamanan berbasis OWASP ASVS untuk semua fitur baru.' },
          ],
          effort: 'medium',
          timeline: en ? '1–3 months' : '1–3 bulan',
          owner: en ? 'Development Team / AppSec' : 'Tim Pengembangan / AppSec'
        });
      }

      // Sort by severity then criticalityScore
      return results.sort((a, b) => {
        const priority = { danger: 1, warning: 2, success: 3 };
        if (priority[a.severity] !== priority[b.severity]) return priority[a.severity] - priority[b.severity];
        return (b.criticalityScore || 0) - (a.criticalityScore || 0);
      });
    },
    getSeverityIcon(severity) {
      if (severity === 'danger') return 'fa-times-circle text-danger';
      if (severity === 'warning') return 'fa-exclamation-triangle text-warning';
      return 'fa-check-circle text-success';
    },
    getSeverityText(severity) {
      const en = this.$i18n.locale === 'en';
      if (severity === 'danger') return en ? 'Critical / High Risk' : 'Kritis / Risiko Tinggi';
      if (severity === 'warning') return en ? 'Moderate / Warning' : 'Sedang / Perhatian';
      return en ? 'Safe / Compliant' : 'Aman / Compliant';
    },
    getPriorityLabel(priority) {
      const en = this.$i18n.locale === 'en';
      if (priority === 'immediate') return en ? 'Immediate' : 'Segera';
      if (priority === 'short') return en ? 'Short-term' : 'Jangka Pendek';
      if (priority === 'medium') return en ? 'Mid-term' : 'Jangka Menengah';
      return en ? 'Long-term' : 'Jangka Panjang';
    },
    getEffortLabel(effort) {
      const en = this.$i18n.locale === 'en';
      if (effort === 'high') return en ? 'High Effort' : 'Upaya Tinggi';
      if (effort === 'medium') return en ? 'Medium Effort' : 'Upaya Sedang';
      return en ? 'Low Effort' : 'Upaya Rendah';
    }
  }
};
</script>

<style scoped>
.iso-page{--ink:#132238;--muted:#5c6776;--line:rgba(19,34,56,.1);--shell:linear-gradient(180deg,#f7f2e8 0%,#edf5f5 100%);color:var(--ink);padding:.25rem;border-radius:32px;background:var(--shell); min-height: 100vh;}
[data-bs-theme="dark"] .iso-page{--ink:#f8fafc;--muted:#94a3b8;--line:rgba(255,255,255,.1);--shell:linear-gradient(180deg,#0f172a 0%,#1e293b 100%);}
.iso-shell{display:grid;gap:1rem}
.iso-hero{display:grid;gap:1rem;min-height:220px;padding:1.5rem;border-radius:28px;background:radial-gradient(circle at top right,rgba(255,226,189,.82),transparent 30%),linear-gradient(135deg,#17324d 0%,#215a56 50%,#f4e4c5 100%);box-shadow:0 14px 30px rgba(15,23,42,.08)}
.iso-kicker{display:inline-flex;padding:.35rem .7rem;border-radius:999px;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em; width: fit-content;}
.iso-title{margin:.8rem 0 .55rem;color:#fffaf2;font-size:clamp(1.85rem,3.2vw,2.6rem);font-weight:800;line-height:1.04}
.iso-lede{margin:0;max-width:800px;color:rgba(255,250,242,.82);line-height:1.55;font-size:.94rem}

.iso-grid{display:grid;gap:1rem; padding-bottom: 2rem;}
.iso-grid.two{grid-template-columns:1fr}
.iso-panel{padding:1.5rem;border-radius:20px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,251,245,.98) 0%,rgba(246,251,252,.98) 100%);box-shadow:0 14px 28px rgba(15,23,42,.05); transition: all 0.3s ease;}
[data-bs-theme="dark"] .iso-panel{background:rgba(30,41,59,0.5);border-color:rgba(255,255,255,0.1)}

.simulator-panel { border-left: 4px solid #0f766e; }
[data-bs-theme="dark"] .simulator-panel { border-left-color: #48cae4; }

/* Progress Bar */
.step-progress-wrapper { position: relative; padding: 0 1rem; }
.step-progress { display: flex; justify-content: space-between; position: relative; margin-bottom: 1.5rem; }
.step-progress::before { content: ''; position: absolute; top: 14px; left: 0; right: 0; height: 3px; background: var(--line); z-index: 1; border-radius: 2px; }
.progress-line { position: absolute; top: 14px; left: 0; height: 3px; background: #0f766e; z-index: 2; transition: width 0.3s ease; border-radius: 2px; }
[data-bs-theme="dark"] .progress-line { background: #48cae4; }

.step-indicator { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 3; gap: 0.5rem; width: 60px; }
.step-dot { width: 30px; height: 30px; border-radius: 50%; background: #fff; border: 2px solid var(--line); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800; color: var(--muted); transition: all 0.3s ease; }
[data-bs-theme="dark"] .step-dot { background: #1e293b; color: #94a3b8; }
.step-label { font-size: 0.7rem; font-weight: 700; color: var(--muted); text-align: center; line-height: 1.2; text-transform: uppercase; }

.step-indicator.active .step-dot { border-color: #0f766e; background: #0f766e; color: #fff; transform: scale(1.1); box-shadow: 0 0 0 4px rgba(15,118,110,0.15); }
[data-bs-theme="dark"] .step-indicator.active .step-dot { border-color: #48cae4; background: #48cae4; color: #0f172a; box-shadow: 0 0 0 4px rgba(72,202,228,0.15); }
.step-indicator.active .step-label { color: var(--ink); }

.step-indicator.completed .step-dot { border-color: #0f766e; background: #0f766e; color: #fff; }
[data-bs-theme="dark"] .step-indicator.completed .step-dot { border-color: #48cae4; background: #48cae4; color: #0f172a; }
.step-indicator.completed .step-label { color: var(--ink); }

.iso-panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem}
.iso-panel-head h3{margin:0;font-size:1.25rem;font-weight:800; color: var(--ink);}
.iso-pill{background:rgba(19,34,56,.08);color:var(--ink);padding:.24rem .52rem;border-radius:999px;font-size:.7rem;font-weight:700}
[data-bs-theme="dark"] .iso-pill{background:rgba(255,255,255,0.1); color: var(--ink);}
.iso-pill.compact { padding: 0.15rem 0.4rem; font-size: 0.65rem; background: rgba(15,118,110,0.1); color: #0f766e; border: 1px solid rgba(15,118,110,0.2); }
[data-bs-theme="dark"] .iso-pill.compact { background: rgba(72,202,228,0.1); color: #48cae4; border-color: rgba(72,202,228,0.2); }

/* Multi-select options */
.sim-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.sim-option { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem 1rem; border-radius: 16px; border: 2px solid var(--line); background: #fff; text-align: center; cursor: pointer; transition: all 0.2s ease; overflow: hidden; }
[data-bs-theme="dark"] .sim-option { background: rgba(30,41,59,0.6); }

.sim-option:hover { border-color: rgba(15,118,110,.4); background: rgba(238,245,245,.5); transform: translateY(-2px); box-shadow: 0 8px 16px rgba(15,118,110,.05); }
[data-bs-theme="dark"] .sim-option:hover { background: rgba(30,41,59,0.9); border-color: #48cae4; box-shadow: 0 8px 16px rgba(72,202,228,.05); }

.sim-option.selected { border-color: #0f766e; background: rgba(15,118,110,.05); box-shadow: 0 4px 12px rgba(15,118,110,.1); }
[data-bs-theme="dark"] .sim-option.selected { border-color: #48cae4; background: rgba(72,202,228,.05); box-shadow: 0 4px 12px rgba(72,202,228,.1); }

.checkbox-indicator { position: absolute; top: 0.8rem; left: 0.8rem; width: 1.2rem; height: 1.2rem; border-radius: 4px; border: 2px solid var(--muted); display: flex; align-items: center; justify-content: center; opacity: 0.5; transition: all 0.2s; }
.sim-option.selected .checkbox-indicator { opacity: 1; border-color: #0f766e; background: #0f766e; color: #fff; }
[data-bs-theme="dark"] .sim-option.selected .checkbox-indicator { border-color: #48cae4; background: #48cae4; color: #0f172a; }
.checkbox-indicator i { font-size: 0.7rem; }

.main-icon { font-size: 2rem; color: #0f766e; margin-bottom: 0.8rem; opacity: 0.8; transition: opacity 0.2s; }
[data-bs-theme="dark"] .main-icon { color: #48cae4; }
.sim-option.selected .main-icon { opacity: 1; }

.sim-option strong { display: block; font-size: 1rem; font-weight: 800; color: var(--ink); margin-bottom: 0.3rem; line-height: 1.2; }
.sim-option span { display: block; font-size: 0.75rem; color: var(--muted); line-height: 1.4; }

.btn-primary-custom { padding: 0.8rem 1.8rem; background: #0f766e; color: #fff; border: none; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: background 0.2s; }
.btn-primary-custom:hover { background: #0d6059; }
.btn-primary-custom:disabled { background: #94a3b8; cursor: not-allowed; }

/* Summary Grid */
.sim-scenario-summary-grid { display: flex; flex-wrap: wrap; gap: 1rem; background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 1.2rem; }
[data-bs-theme="dark"] .sim-scenario-summary-grid { background: rgba(30,41,59,0.4); }
.summary-col { flex: 1; min-width: 150px; }
.summary-col small { display: block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin-bottom: 0.5rem; }
.tag-cloud { display: flex; flex-wrap: wrap; gap: 0.3rem; }

/* Risk Summary Bar */
.sim-risk-summary { display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.sim-risk-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; border-radius: 10px; font-size: 0.85rem; font-weight: 700; border: 1px solid; }
.sim-risk-item.danger { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2); color: #b91c1c; }
.sim-risk-item.warning { background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.2); color: #b45309; }
.sim-risk-item.success { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.2); color: #047857; }
[data-bs-theme="dark"] .sim-risk-item.danger { color: #fca5a5; }
[data-bs-theme="dark"] .sim-risk-item.warning { color: #fcd34d; }
[data-bs-theme="dark"] .sim-risk-item.success { color: #6ee7b7; }
.sim-findings-count { font-size: 0.8rem; color: var(--muted); font-weight: 600; }

/* Result Cards */
.sim-results { display: grid; gap: 1.25rem; }
.sim-result-card { border-radius: 16px; border: 1px solid var(--line); background: #fff; animation: slideUp 0.4s ease forwards; opacity: 0; transform: translateY(10px); overflow: hidden; }
[data-bs-theme="dark"] .sim-result-card { background: rgba(30,41,59,0.7); }
.sim-result-card:nth-child(1) { animation-delay: 0.1s; }
.sim-result-card:nth-child(2) { animation-delay: 0.2s; }
.sim-result-card:nth-child(3) { animation-delay: 0.3s; }
.sim-result-card:nth-child(4) { animation-delay: 0.4s; }
.sim-result-card:nth-child(5) { animation-delay: 0.5s; }
.sim-result-card:nth-child(6) { animation-delay: 0.6s; }
.sim-result-card.danger { border-left: 5px solid #ef4444; }
.sim-result-card.warning { border-left: 5px solid #f59e0b; }
.sim-result-card.success { border-left: 5px solid #10b981; }

/* Card Header */
.sim-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.25rem 0.75rem; flex-wrap: wrap; }
.sim-card-header-left { display: flex; align-items: flex-start; gap: 0.75rem; flex: 1; }
.sim-card-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; flex-shrink: 0; }
.sim-severity-icon { width: 2.5rem; height: 2.5rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
.sim-severity-icon.danger { background: rgba(239,68,68,0.12); color: #ef4444; }
.sim-severity-icon.warning { background: rgba(245,158,11,0.12); color: #f59e0b; }
.sim-severity-icon.success { background: rgba(16,185,129,0.12); color: #10b981; }
.sim-framework { display: block; font-size: 0.95rem; font-weight: 800; color: var(--ink); letter-spacing: 0.01em; }
.sim-reg-refs { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.35rem; }
.sim-reg-tag { font-size: 0.68rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 5px; background: rgba(15,118,110,0.08); color: #0f766e; border: 1px solid rgba(15,118,110,0.15); }
[data-bs-theme="dark"] .sim-reg-tag { background: rgba(72,202,228,0.1); color: #48cae4; border-color: rgba(72,202,228,0.2); }
.sim-status-badge { font-size: 0.68rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; text-transform: uppercase; white-space: nowrap; }
.sim-status-badge.danger { background: rgba(239,68,68,0.1); color: #b91c1c; }
[data-bs-theme="dark"] .sim-status-badge.danger { color: #fca5a5; background: rgba(239,68,68,0.15); }
.sim-status-badge.warning { background: rgba(245,158,11,0.1); color: #b45309; }
[data-bs-theme="dark"] .sim-status-badge.warning { color: #fcd34d; background: rgba(245,158,11,0.15); }
.sim-status-badge.success { background: rgba(16,185,129,0.1); color: #047857; }
[data-bs-theme="dark"] .sim-status-badge.success { color: #6ee7b7; background: rgba(16,185,129,0.15); }
.sim-criticality-score { font-size: 0.72rem; font-weight: 800; white-space: nowrap; }
.sim-criticality-score.danger { color: #ef4444; }
.sim-criticality-score.warning { color: #f59e0b; }
.sim-criticality-score.success { color: #10b981; }

/* Why / Impact / Rec blocks */
.sim-why-block, .sim-impact-block, .sim-rec-block { padding: 0.85rem 1.25rem; border-top: 1px solid var(--line); }
.sim-block-label { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-bottom: 0.45rem; display: flex; align-items: center; gap: 0.35rem; }
.sim-block-label.impact { color: #b45309; }
[data-bs-theme="dark"] .sim-block-label.impact { color: #fcd34d; }
.sim-block-label.rec { color: #0f766e; }
[data-bs-theme="dark"] .sim-block-label.rec { color: #48cae4; }
.sim-why-text, .sim-impact-text { font-size: 0.875rem; color: var(--ink); line-height: 1.65; margin: 0; }
.sim-impact-text { color: #92400e; }
[data-bs-theme="dark"] .sim-impact-text { color: #fde68a; }

/* Recommendations list */
.sim-rec-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.5rem; }
.sim-rec-list li { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.875rem; color: var(--ink); line-height: 1.55; }
.sim-rec-priority { flex-shrink: 0; font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 5px; text-transform: uppercase; margin-top: 0.15rem; }
.sim-rec-priority.immediate { background: rgba(239,68,68,0.1); color: #b91c1c; }
[data-bs-theme="dark"] .sim-rec-priority.immediate { color: #fca5a5; background: rgba(239,68,68,0.15); }
.sim-rec-priority.short { background: rgba(245,158,11,0.1); color: #b45309; }
[data-bs-theme="dark"] .sim-rec-priority.short { color: #fcd34d; background: rgba(245,158,11,0.15); }
.sim-rec-priority.medium { background: rgba(59,130,246,0.1); color: #1d4ed8; }
[data-bs-theme="dark"] .sim-rec-priority.medium { color: #93c5fd; background: rgba(59,130,246,0.15); }
.sim-rec-priority.long { background: rgba(100,116,139,0.1); color: #475569; }
[data-bs-theme="dark"] .sim-rec-priority.long { color: #94a3b8; }
.sim-rec-text { flex: 1; }

/* Effort row */
.sim-effort-row { display: flex; gap: 1.5rem; padding: 0.75rem 1.25rem; background: rgba(15,23,42,0.03); border-top: 1px solid var(--line); flex-wrap: wrap; }
[data-bs-theme="dark"] .sim-effort-row { background: rgba(255,255,255,0.03); }
.sim-effort-item { display: flex; flex-direction: column; gap: 0.15rem; }
.sim-effort-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
.sim-effort-val { font-size: 0.8rem; font-weight: 700; color: var(--ink); }
.sim-effort-val.high { color: #ef4444; }
.sim-effort-val.medium { color: #f59e0b; }
.sim-effort-val.low { color: #10b981; }

@keyframes slideUp {
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .sim-result-header { flex-direction: column; align-items: flex-start; gap: 0.3rem; }
  .step-label { display: none; }
}
</style>
