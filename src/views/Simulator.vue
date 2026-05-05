<template>
  <div class="iso-page">
    <div class="iso-shell">
      <div class="iso-hero">
        <div class="iso-hero-content">
          <span class="iso-kicker">Interactive Tool</span>
          <h1 class="iso-title">"What-If" Compliance Simulator</h1>
          <p class="iso-lede">Pilih skenario arsitektur dan operasional Anda. Evaluasi secara instan potensi celah kepatuhan lintas regulasi berdasarkan multi-dimensi parameter yang Anda terapkan.</p>
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
              <span class="iso-pill">Pilih satu atau lebih</span>
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
                <i class="fas fa-arrow-left me-2"></i> Kembali
              </button>
              
              <button 
                class="btn-primary-custom" 
                @click="nextStep"
                :disabled="scenario[currentStepData.field].length === 0"
              >
                <template v-if="currentStep < 5">
                  Lanjut <i class="fas fa-arrow-right ms-2"></i>
                </template>
                <template v-else>
                  <i class="fas" :class="isSimulating ? 'fa-spinner fa-spin' : 'fa-play'"></i> 
                  {{ isSimulating ? 'Menyimulasikan...' : 'Jalankan Simulasi' }}
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
              <h3>Ringkasan Parameter Anda</h3>
              <button class="btn btn-sm btn-outline-primary" @click="resetSimulation"><i class="fas fa-redo me-1"></i> Mulai Ulang</button>
            </div>
            <div class="sim-scenario-summary-grid">
               <div class="summary-col">
                 <small>Industri</small>
                 <div class="tag-cloud">
                   <span class="iso-pill compact" v-for="item in scenario.industries" :key="item">{{ item }}</span>
                 </div>
               </div>
               <div class="summary-col">
                 <small>Lokasi Data</small>
                 <div class="tag-cloud">
                   <span class="iso-pill compact" v-for="item in scenario.locations" :key="item">{{ item }}</span>
                 </div>
               </div>
               <div class="summary-col">
                 <small>Tipe Data</small>
                 <div class="tag-cloud">
                   <span class="iso-pill compact" v-for="item in scenario.dataTypes" :key="item">{{ item }}</span>
                 </div>
               </div>
               <div class="summary-col">
                 <small>Pengelola</small>
                 <div class="tag-cloud">
                   <span class="iso-pill compact" v-for="item in scenario.usages" :key="item">{{ item }}</span>
                 </div>
               </div>
               <div class="summary-col" v-if="scenario.targets.length">
                 <small>Target Regulasi</small>
                 <div class="tag-cloud">
                   <span class="iso-pill compact" v-for="item in scenario.targets" :key="item">{{ item }}</span>
                 </div>
               </div>
            </div>
          </section>

          <!-- Result Cards Panel -->
          <section class="iso-panel mt-3" style="grid-column: 1 / -1; background: transparent; border: none; padding: 0; box-shadow: none;">
            <div class="iso-panel-head mb-3">
              <h3 style="font-size: 1.4rem;"><i class="fas fa-radar me-2 text-primary"></i> Temuan Kepatuhan (Gap Analysis)</h3>
            </div>
            <div class="sim-results">
              <div v-for="(res, idx) in simulationResult" :key="idx" class="sim-result-card" :class="res.severity">
                <div class="sim-result-icon">
                  <i class="fas" :class="getSeverityIcon(res.severity)"></i>
                </div>
                <div class="sim-result-content">
                  <div class="sim-result-header">
                    <span class="sim-framework">{{ res.framework }}</span>
                    <span class="sim-status-badge" :class="res.severity">{{ getSeverityText(res.severity) }}</span>
                  </div>
                  <p class="sim-message">{{ res.message }}</p>
                  <div v-if="res.recommendation" class="sim-recommendation">
                    <strong>Tindakan / Rekomendasi: </strong> {{ res.recommendation }}
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
export default {
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
      simulationResult: null,
      steps: [
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
            { id: 'ISO 27001', label: 'ISO 27001', desc: 'Standar Internasional', icon: 'fa-shield-alt' },
            { id: 'NIST', label: 'NIST CSF', desc: 'Framework US', icon: 'fa-compass' },
            { id: 'PDP', label: 'UU PDP No. 27/2022', desc: 'Privasi Data Indonesia', icon: 'fa-user-shield' },
            { id: 'OJK', label: 'Regulasi OJK / BI', desc: 'Sektor Finansial', icon: 'fa-landmark' }
          ]
        }
      ]
    };
  },
  computed: {
    currentStepData() {
      return this.steps[this.currentStep - 1] || {};
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

      // Helper functions
      const hasForeignCloud = locations.includes('Singapura') || locations.includes('US') || locations.includes('Eropa');
      const hasPersonalData = dataTypes.includes('Pribadi Umum') || dataTypes.includes('Pribadi Spesifik');
      const hasSpecificData = dataTypes.includes('Pribadi Spesifik');
      const hasFinancialSect = industries.includes('Perbankan') || industries.includes('Fintech');
      const hasThirdParty = usages.includes('Vendor Cloud') || usages.includes('Pihak Ketiga');

      // Rule 1: UU PDP - Data Transfer Luar Negeri
      if (hasForeignCloud && hasPersonalData) {
        let message = 'Transfer Data Pribadi ke Luar Negeri terdeteksi.';
        let rec = 'Pastikan negara cloud tujuan setara UU PDP dan Dapatkan Persetujuan Eksplisit.';
        let sev = 'danger';
        
        if (hasSpecificData) {
          message = 'Transfer DATA PRIBADI SPESIFIK (Medis/Biometrik) ke Luar Negeri. Potensi Denda sangat masif.';
          rec = 'Wajib melakukan DPIA (Data Protection Impact Assessment) sebelum pemrosesan dan melaporkan ke otoritas PDP.';
        }
        
        results.push({
          framework: 'UU PDP No. 27/2022',
          severity: sev,
          message: message,
          recommendation: rec
        });
      }

      // Rule 2: UU PDP - Remote Access is Data Transfer
      if (usages.includes('Tim Remote') && hasPersonalData && !hasForeignCloud) {
        results.push({
          framework: 'UU PDP No. 27/2022',
          severity: 'warning',
          message: 'Akses data dari luar negeri (Tim Remote) dikategorikan sebagai Transfer Data Lintas Batas meskipun server ada di Jakarta.',
          recommendation: 'Batasi remote access hanya via VPN terkontrol dan pastikan ikatan hukum dengan pekerja remote (NDA yang jelas).'
        });
      }

      // Rule 3: OJK & BI - Data Localization
      if (hasFinancialSect) {
        if (hasForeignCloud) {
          results.push({
            framework: 'PBI / SEOJK (Data Localization)',
            severity: 'danger',
            message: 'Sektor finansial diwajibkan menempatkan Sistem dan Pusat Data di wilayah Indonesia untuk fungsi core.',
            recommendation: 'Jika untuk non-core, wajib meminta persetujuan OJK/BI terlebih dahulu dan memastikan hak audit fisik bagi regulator.'
          });
        } else {
           results.push({
            framework: 'PBI / SEOJK',
            severity: 'success',
            message: 'Lokasi server sudah menggunakan On-Premise/Cloud lokal, sejalan dengan prinsip lokalisasi penyelenggara sistem elektronik.',
            recommendation: 'Pastikan rasio DRC (Disaster Recovery Center) juga berada dalam batas wilayah hukum NKRI.'
          });
        }
      }

      // Rule 4: PCI-DSS / Financial Data
      if (dataTypes.includes('Finansial')) {
        results.push({
          framework: 'Standar Industri (PCI-DSS)',
          severity: 'warning',
          message: 'Menyimpan data kartu kredit atau mutasi rekening tunduk pada regulasi standar keamanan tinggi.',
          recommendation: 'Jaringan penyimpanan data finansial wajib di-segmentasi, terenkripsi (tokenization), dan tidak boleh menyimpan CVV.'
        });
      }

      // Rule 5: Vendor & Third Party Risk (ISO 27001 / NIST)
      if (hasThirdParty) {
        let msg = 'Risiko rantai pasok dari Pihak Ketiga terdeteksi.';
        if (dataTypes.includes('HAKI') || hasSpecificData) {
          msg = 'Pihak ketiga memiliki akses ke Rahasia Dagang atau Data Sensitif. Kebocoran oleh vendor sering terjadi.';
        }
        results.push({
          framework: 'ISO 27001 (A.15) / NIST',
          severity: 'warning',
          message: msg,
          recommendation: 'Wajib melakukan Vendor Risk Assessment. Terapkan Right to Audit dan klausul sanksi pelanggaran NDA dalam kontrak vendor.'
        });
      }

      // Rule 6: GDPR Impact
      if (locations.includes('Eropa') && hasPersonalData) {
        results.push({
           framework: 'GDPR (Uni Eropa)',
           severity: 'warning',
           message: 'Menggunakan server di Eropa memicu kewajiban tunduk pada regulasi GDPR Eropa terkait standar privasi.',
           recommendation: 'Terapkan Standard Contractual Clauses (SCC) dan patuhi hak subjek data seperti Right to be Forgotten.'
        });
      }

      // Base Safe Conclusion
      if (results.filter(r => r.severity === 'danger' || r.severity === 'warning').length === 0) {
         results.push({
          framework: 'Kesimpulan Umum',
          severity: 'success',
          message: 'Konfigurasi Anda saat ini sangat aman dan sesuai dengan praktik compliance yang disarankan.',
          recommendation: 'Terus pantau akses log harian dan jadwalkan Penetration Testing tahunan.'
        });
      } else if (!hasFinancialSect && !hasForeignCloud && !hasSpecificData && results.length < 3) {
         results.push({
          framework: 'Kesimpulan Menengah',
          severity: 'success',
          message: 'Karena Anda bukan sektor finansial dan tidak pakai server asing, beban regulasinya jauh lebih ringan.',
          recommendation: 'Perhatikan kontrak dengan pihak ketiga dan pastikan internal security hygiene terjaga.'
        });
      }

      // Sort by severity (danger first, then warning, then success)
      return results.sort((a, b) => {
        const priority = { danger: 1, warning: 2, success: 3 };
        return priority[a.severity] - priority[b.severity];
      });
    },
    getSeverityIcon(severity) {
      if (severity === 'danger') return 'fa-times-circle text-danger';
      if (severity === 'warning') return 'fa-exclamation-triangle text-warning';
      return 'fa-check-circle text-success';
    },
    getSeverityText(severity) {
      if (severity === 'danger') return 'Pelanggaran / Risiko Tinggi';
      if (severity === 'warning') return 'Perhatian / Warning';
      return 'Aman / Compliant';
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

/* Result Cards */
.sim-results { display: grid; gap: 1rem; }
.sim-result-card { display: flex; gap: 1rem; padding: 1.25rem; border-radius: 16px; border: 1px solid var(--line); background: #fff; animation: slideUp 0.4s ease forwards; opacity: 0; transform: translateY(10px); }
[data-bs-theme="dark"] .sim-result-card { background: rgba(30,41,59,0.7); }

.sim-result-card:nth-child(1) { animation-delay: 0.1s; }
.sim-result-card:nth-child(2) { animation-delay: 0.2s; }
.sim-result-card:nth-child(3) { animation-delay: 0.3s; }
.sim-result-card:nth-child(4) { animation-delay: 0.4s; }

.sim-result-card.danger { border-left: 4px solid #ef4444; background: linear-gradient(90deg, rgba(239,68,68,0.05) 0%, rgba(255,255,255,0) 100%); }
[data-bs-theme="dark"] .sim-result-card.danger { background: linear-gradient(90deg, rgba(239,68,68,0.1) 0%, rgba(30,41,59,0) 100%); }
.sim-result-card.warning { border-left: 4px solid #f59e0b; background: linear-gradient(90deg, rgba(245,158,11,0.05) 0%, rgba(255,255,255,0) 100%); }
[data-bs-theme="dark"] .sim-result-card.warning { background: linear-gradient(90deg, rgba(245,158,11,0.1) 0%, rgba(30,41,59,0) 100%); }
.sim-result-card.success { border-left: 4px solid #10b981; background: linear-gradient(90deg, rgba(16,185,129,0.05) 0%, rgba(255,255,255,0) 100%); }
[data-bs-theme="dark"] .sim-result-card.success { background: linear-gradient(90deg, rgba(16,185,129,0.1) 0%, rgba(30,41,59,0) 100%); }

.sim-result-icon { font-size: 1.5rem; padding-top: 0.2rem; }
.sim-result-content { flex: 1; }

.sim-result-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
.sim-framework { font-size: 0.85rem; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }

.sim-status-badge { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 6px; text-transform: uppercase; }
.sim-status-badge.danger { background: rgba(239,68,68,0.1); color: #b91c1c; }
[data-bs-theme="dark"] .sim-status-badge.danger { color: #fca5a5; }
.sim-status-badge.warning { background: rgba(245,158,11,0.1); color: #b45309; }
[data-bs-theme="dark"] .sim-status-badge.warning { color: #fcd34d; }
.sim-status-badge.success { background: rgba(16,185,129,0.1); color: #047857; }
[data-bs-theme="dark"] .sim-status-badge.success { color: #6ee7b7; }

.sim-message { font-size: 1.05rem; font-weight: 700; color: var(--ink); margin-bottom: 0.6rem; line-height: 1.45; }
.sim-recommendation { font-size: 0.85rem; color: var(--muted); line-height: 1.5; padding-top: 0.6rem; border-top: 1px dashed var(--line); }

@keyframes slideUp {
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .sim-result-header { flex-direction: column; align-items: flex-start; gap: 0.3rem; }
  .step-label { display: none; }
}
</style>
