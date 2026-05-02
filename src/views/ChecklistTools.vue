<template>
  <div class="iso-page">
    <div class="iso-shell">
      <div class="iso-hero">
        <div class="iso-hero-content">
          <span class="iso-kicker">Alat Audit & Kepatuhan</span>
          <h1 class="iso-title">Checklist Tools & AI Gap Analysis</h1>
          <p class="iso-lede">Buat checklist mandiri berdasarkan gabungan regulasi yang Anda pilih, isi implementasi Anda, dan gunakan AI untuk menganalisa *gap* secara instan. Data Anda aman 100% dan hanya disimpan di browser lokal Anda (Local Storage).</p>
        </div>
      </div>

      <div class="iso-grid" :class="{'two': currentStep === 2}">
        <!-- Step 1: Framework Selection -->
        <section class="iso-panel" v-if="currentStep === 1">
          <div class="iso-panel-head">
            <h3>1. Pilih Regulasi Rujukan</h3>
            <span class="iso-chip">Tahap 1/2</span>
          </div>
          <p class="iso-panel-copy">Pilih regulasi atau standar yang digunakan di perusahaan Anda untuk digabungkan menjadi satu checklist audit terpadu.</p>
          
          <div class="checklist-framework-selector">
            <label class="framework-checkbox" v-for="fw in availableFrameworks" :key="fw.id">
              <input type="checkbox" v-model="selectedFrameworks" :value="fw.id" />
              <div class="framework-checkbox-content">
                <i :class="`fas ${fw.icon}`"></i>
                <div>
                  <strong>{{ fw.name }}</strong>
                  <span>{{ fw.desc }}</span>
                </div>
              </div>
            </label>
          </div>

          <div class="mt-4 d-flex justify-content-end">
            <button class="btn-primary-custom" @click="generateChecklist" :disabled="selectedFrameworks.length === 0 || loading">
              {{ loading ? 'Membuat Checklist...' : 'Buat Checklist Sekarang' }} <i class="fas fa-arrow-right ms-2"></i>
            </button>
          </div>
        </section>

        <!-- Step 2: The Checklist Workspace -->
        <template v-if="currentStep === 2">
          <section class="iso-panel" style="grid-column: 1 / -1;">
            <div class="iso-panel-head">
              <h3>2. Workspace Checklist Mandiri</h3>
              <div>
                <button class="btn btn-sm btn-outline-secondary me-2" @click="currentStep = 1"><i class="fas fa-arrow-left me-1"></i> Kembali</button>
                <button class="btn btn-sm btn-success" @click="analyzeWithAI" :disabled="aiLoading"><i class="fas fa-robot me-1"></i> {{ aiLoading ? 'Menganalisa...' : 'Analisa Gap dengan AI' }}</button>
              </div>
            </div>
            
            <div class="checklist-summary mb-3">
              <div class="summary-item">
                <small>Total Kontrol</small>
                <strong>{{ checklistData.length }}</strong>
              </div>
              <div class="summary-item">
                <small>Sudah Implementasi</small>
                <strong class="text-success">{{ countStatus('Sudah') }}</strong>
              </div>
              <div class="summary-item">
                <small>Belum / Parsial</small>
                <strong class="text-warning">{{ countStatus('Belum') + countStatus('Parsial') }}</strong>
              </div>
              <div class="summary-item">
                <small>Progress</small>
                <strong>{{ Math.round((countStatus('Sudah') / (checklistData.length || 1)) * 100) }}%</strong>
              </div>
            </div>

            <div class="checklist-table-wrapper">
              <table class="checklist-table">
                <thead>
                  <tr>
                    <th width="15%">ID Kontrol</th>
                    <th width="35%">Deskripsi Regulasi</th>
                    <th width="20%">Status Implementasi</th>
                    <th width="30%">Catatan / Bukti (Evidens)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in checklistData" :key="idx">
                    <td>
                      <span class="iso-pill compact neutral mb-1">{{ item.source }}</span>
                      <strong>{{ item.id }}</strong>
                    </td>
                    <td>
                      <strong class="d-block mb-1">{{ item.name }}</strong>
                      <span class="text-muted" style="font-size: 0.8rem;">{{ item.description }}</span>
                    </td>
                    <td>
                      <div class="status-options">
                        <label class="status-radio">
                          <input type="radio" v-model="item.status" value="Sudah" @change="saveToLocal" />
                          <span class="tag-sudah">Sudah</span>
                        </label>
                        <label class="status-radio">
                          <input type="radio" v-model="item.status" value="Parsial" @change="saveToLocal" />
                          <span class="tag-parsial">Parsial</span>
                        </label>
                        <label class="status-radio">
                          <input type="radio" v-model="item.status" value="Belum" @change="saveToLocal" />
                          <span class="tag-belum">Belum</span>
                        </label>
                      </div>
                    </td>
                    <td>
                      <textarea 
                        class="form-control form-control-sm" 
                        v-model="item.evidence" 
                        @blur="saveToLocal"
                        placeholder="Contoh: Kami sudah memiliki kebijakan X yang tertuang pada dokumen Y..."
                        rows="2"
                      ></textarea>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </template>
      </div>

      <!-- AI Analysis Result Modal / Section -->
      <div v-if="aiResult" class="iso-grid mt-3">
        <section class="iso-panel" style="grid-column: 1 / -1; background: #fffaf2; border-color: #f59e0b;">
          <div class="iso-panel-head">
            <h3><i class="fas fa-robot text-warning me-2"></i> Hasil Analisa Gap AI</h3>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-danger" @click="exportToPDF"><i class="fas fa-file-pdf me-1"></i> Cetak PDF</button>
              <button class="btn btn-sm btn-outline-primary" @click="exportToWord"><i class="fas fa-file-word me-1"></i> Download Word</button>
              <button class="btn btn-sm btn-outline-secondary" @click="aiResult = null">Tutup</button>
            </div>
          </div>
          <div class="ai-report-content" id="ai-report-content" v-html="formattedAiResult"></div>
        </section>
      </div>

    </div>
  </div>
</template>

<script>
import { marked } from 'marked';

export default {
  name: 'ChecklistTools',
  data() {
    return {
      currentStep: 1,
      loading: false,
      aiLoading: false,
      aiResult: null,
      availableFrameworks: [
        { id: 'iso27001', name: 'ISO 27001:2022', desc: 'Standar Internasional Keamanan Informasi', icon: 'fa-shield-alt', file: 'iso27001.json' },
        { id: 'cobit', name: 'COBIT 2019', desc: 'Framework Tata Kelola IT Perusahaan', icon: 'fa-project-diagram', file: 'cobit_2019.json' },
        { id: 'seojk', name: 'SEOJK 29/2022', desc: 'Regulasi Keamanan Siber OJK', icon: 'fa-landmark', file: 'seojk_requirements.json' },
      ],
      selectedFrameworks: [],
      checklistData: []
    };
  },
  computed: {
    formattedAiResult() {
      if (!this.aiResult) return '';
      return marked(this.aiResult);
    }
  },
  mounted() {
    // Load from local storage if exists
    const saved = localStorage.getItem('sibukpatuh_checklist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          this.checklistData = parsed;
          this.currentStep = 2;
          
          // Try to recover selected frameworks from the data sources
          const sources = new Set(this.checklistData.map(c => c.source));
          this.selectedFrameworks = Array.from(sources);
        }
      } catch(e) {
        console.error('Failed to parse saved checklist', e);
      }
    }
  },
  methods: {
    countStatus(status) {
      return this.checklistData.filter(item => item.status === status).length;
    },
    saveToLocal() {
      localStorage.setItem('sibukpatuh_checklist', JSON.stringify(this.checklistData));
    },
    async generateChecklist() {
      this.loading = true;
      try {
        let mergedData = [];
        
        for (const fwId of this.selectedFrameworks) {
          const fwDef = this.availableFrameworks.find(f => f.id === fwId);
          if (!fwDef) continue;
          
          const res = await fetch(`/data/${fwDef.file}`);
          if (!res.ok) throw new Error(`Gagal memuat ${fwDef.name}`);
          
          const json = await res.json();
          let items = [];
          if (Array.isArray(json)) {
            items = json;
          } else if (json.controls) {
            items = json.controls;
          } else if (json.requirements) {
            items = json.requirements;
          } else if (fwId === 'cobit' && json.domains) {
            // Map COBIT 2019 domains to checklist items since it has no raw controls array
            items = json.domains.map(d => ({
              id: d.id,
              name: d.title,
              description: d.summary
            }));
          }
          
          // Map to standard format
          const mapped = items.map(item => ({
            source: fwId,
            id: item.id || item.code || 'UNK',
            name: item.name || item.title || '-',
            description: item.description || item.deskripsi || item.summary || '-',
            status: 'Belum', // Default
            evidence: ''
          }));
          
          mergedData = [...mergedData, ...mapped];
        }
        
        // Preserve existing answers if re-generating
        const existingData = JSON.parse(localStorage.getItem('sibukpatuh_checklist') || '[]');
        
        this.checklistData = mergedData.map(newItem => {
          const exist = existingData.find(e => e.source === newItem.source && e.id === newItem.id);
          if (exist) {
            return { ...newItem, status: exist.status, evidence: exist.evidence };
          }
          return newItem;
        });
        
        this.saveToLocal();
        this.currentStep = 2;
      } catch (err) {
        alert('Terjadi kesalahan: ' + err.message);
      } finally {
        this.loading = false;
      }
    },
    async analyzeWithAI() {
      if (!this.checklistData || this.checklistData.length === 0) return;
      
      this.aiLoading = true;
      this.aiResult = null;
      
      try {
        // Filter out items that are strictly 'Sudah' if we want to focus on Gaps,
        // or just send everything. Let's send only "Belum" and "Parsial" to save tokens, 
        // OR send everything but summarize. Let's send everything for context, but mapped tightly.
        
        const gapItems = this.checklistData.filter(i => i.status !== 'Sudah');
        
        if (gapItems.length === 0) {
          this.aiResult = "Selamat! Anda telah mengimplementasikan 100% kontrol. Tidak ditemukan *gap* pada checklist ini.";
          this.aiLoading = false;
          return;
        }

        const promptData = gapItems.map(i => `[${i.source.toUpperCase()}] ${i.id} - ${i.name}\nStatus: ${i.status}\nKondisi Saat Ini (Evidens): ${i.evidence || 'Tidak ada catatan'}`).join('\n\n');

        const promptText = `Tolong bertindak sebagai Senior Auditor IT / Konsultan GRC. 
Berikut adalah temuan *GAP* (kekurangan implementasi) dari checklist compliance (ISO/COBIT/SEOJK) di perusahaan saya.
Tolong berikan laporan analisa gap eksekutif, serta rekomendasi langkah perbaikan (action plan) yang taktis dan diprioritaskan.

PENTING:
1. Berikan analisa yang ringkas, padat, dan *to-the-point*.
2. TIDAK PERLU menawarkan bantuan tambahan (seperti membuat draf kebijakan/policy). Langsung tutup laporan jika analisa sudah selesai.
3. Gunakan format Markdown yang rapi (heading, bullet points, dan bold).

Data Temuan:
${promptData}`;

        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', text: promptText }]
          })
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Gagal menganalisa');
        }

        const resData = await response.json();
        this.aiResult = resData.response;
        
        // Scroll to result
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);

      } catch (err) {
        alert('Gagal menghubungi AI: ' + err.message);
      } finally {
        this.aiLoading = false;
      }
    },
    exportToWord() {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Gap Analysis Report</title><style>body { font-family: Calibri, sans-serif; } h1, h2, h3 { color: #0f766e; }</style></head><body>";
      const footer = "</body></html>";
      const content = document.getElementById('ai-report-content').innerHTML;
      const sourceHTML = header + "<h2>Executive Report: Compliance Gap Analysis</h2><hr/>" + content + footer;
      
      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
      const fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = 'Laporan_Analisa_Gap.doc';
      fileDownload.click();
      document.body.removeChild(fileDownload);
    },
    exportToPDF() {
      const printWindow = window.open('', '_blank', 'height=800,width=800');
      const content = document.getElementById('ai-report-content').innerHTML;
      
      printWindow.document.write('<html><head><title>Laporan Analisa Gap</title>');
      printWindow.document.write('<style>body { font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; padding: 2rem; max-width: 900px; margin: 0 auto; } h1, h2, h3 { color: #0f766e; } table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } @media print { body { padding: 0; } }</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<h2>Executive Report: Compliance Gap Analysis</h2><hr style="border:0; border-top: 1px solid #eee; margin-bottom: 2rem;"/>');
      printWindow.document.write(content);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => { 
        printWindow.print(); 
        // We do not auto-close so the user can see the print dialog or save as PDF
      }, 500);
    }
  }
};
</script>

<style scoped>
.iso-page{--ink:#132238;--muted:#5c6776;--line:rgba(19,34,56,.1);--shell:linear-gradient(180deg,#f7f2e8 0%,#edf5f5 100%);color:var(--ink);padding:.25rem;border-radius:32px;background:var(--shell)}
.iso-shell{display:grid;gap:1rem}
.iso-hero{display:grid;gap:1rem;min-height:220px;padding:1.5rem;border-radius:28px;background:radial-gradient(circle at top right,rgba(255,226,189,.82),transparent 30%),linear-gradient(135deg,#17324d 0%,#215a56 50%,#f4e4c5 100%);box-shadow:0 14px 30px rgba(15,23,42,.08)}
.iso-kicker{display:inline-flex;padding:.35rem .7rem;border-radius:999px;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em; width: fit-content;}
.iso-title{margin:.8rem 0 .55rem;color:#fffaf2;font-size:clamp(1.85rem,3.2vw,2.6rem);font-weight:800;line-height:1.04}
.iso-lede{margin:0;max-width:800px;color:rgba(255,250,242,.82);line-height:1.55;font-size:.94rem}

.iso-grid{display:grid;gap:1rem}
.iso-grid.two{grid-template-columns:1fr}
.iso-panel{padding:1.5rem;border-radius:20px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,251,245,.98) 0%,rgba(246,251,252,.98) 100%);box-shadow:0 14px 28px rgba(15,23,42,.05)}
.iso-panel-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.iso-panel-head h3{margin:0;font-size:1.2rem;font-weight:800}
.iso-chip{background:rgba(19,34,56,.08);color:var(--ink);padding:.24rem .52rem;border-radius:999px;font-size:.7rem;font-weight:700}
.iso-panel-copy{margin:0 0 1.2rem;color:var(--muted);line-height:1.62;font-size:.9rem}

.checklist-framework-selector { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.framework-checkbox { display: block; position: relative; cursor: pointer; }
.framework-checkbox input { position: absolute; opacity: 0; }
.framework-checkbox-content { display: flex; gap: 1rem; align-items: center; padding: 1.2rem; border-radius: 16px; border: 2px solid var(--line); background: #fff; transition: all 0.2s ease; }
.framework-checkbox:hover .framework-checkbox-content { border-color: rgba(15,118,110,.4); background: rgba(238,245,245,.5); }
.framework-checkbox input:checked + .framework-checkbox-content { border-color: #0f766e; background: rgba(15,118,110,.05); box-shadow: 0 4px 12px rgba(15,118,110,.1); }
.framework-checkbox-content i { font-size: 1.8rem; color: #0f766e; width: 40px; text-align: center; }
.framework-checkbox-content strong { display: block; font-size: 1.05rem; font-weight: 800; color: var(--ink); margin-bottom: 0.2rem; }
.framework-checkbox-content span { display: block; font-size: 0.8rem; color: var(--muted); line-height: 1.4; }

.btn-primary-custom { padding: 0.8rem 1.5rem; background: #0f766e; color: #fff; border: none; border-radius: 12px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: background 0.2s; }
.btn-primary-custom:hover { background: #0d6059; }
.btn-primary-custom:disabled { background: #94a3b8; cursor: not-allowed; }

.checklist-summary { display: flex; gap: 1rem; background: #fff; padding: 1rem; border-radius: 16px; border: 1px solid var(--line); }
.summary-item { flex: 1; text-align: center; border-right: 1px solid var(--line); }
.summary-item:last-child { border-right: none; }
.summary-item small { display: block; font-size: 0.75rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.3rem; }
.summary-item strong { display: block; font-size: 1.4rem; font-weight: 800; }

.checklist-table-wrapper { overflow-x: auto; background: #fff; border-radius: 16px; border: 1px solid var(--line); }
.checklist-table { width: 100%; border-collapse: collapse; text-align: left; }
.checklist-table th { background: rgba(19,34,56,.04); padding: 0.8rem 1rem; font-size: 0.8rem; font-weight: 800; color: var(--muted); text-transform: uppercase; border-bottom: 2px solid var(--line); }
.checklist-table td { padding: 1rem; border-bottom: 1px solid var(--line); vertical-align: top; }
.checklist-table tr:last-child td { border-bottom: none; }

.iso-pill { display: inline-block; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.7rem; font-weight: 700; background: #e2e8f0; color: #334155; text-transform: uppercase; }

.status-options { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.status-radio { cursor: pointer; }
.status-radio input { display: none; }
.status-radio span { padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.75rem; font-weight: 700; border: 1px solid var(--line); transition: all 0.2s; }
.tag-sudah { color: #15803d; } .tag-parsial { color: #a16207; } .tag-belum { color: #b91c1c; }
.status-radio input:checked + .tag-sudah { background: #15803d; color: #fff; border-color: #15803d; }
.status-radio input:checked + .tag-parsial { background: #a16207; color: #fff; border-color: #a16207; }
.status-radio input:checked + .tag-belum { background: #b91c1c; color: #fff; border-color: #b91c1c; }

.ai-report-content { font-size: 0.95rem; line-height: 1.7; color: #1e293b; padding: 1rem; background: #fff; border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.3); }
.ai-report-content :deep(h1), .ai-report-content :deep(h2), .ai-report-content :deep(h3) { color: #0f766e; margin-top: 1.5rem; margin-bottom: 0.8rem; font-weight: 800; }
.ai-report-content :deep(p) { margin-bottom: 1rem; }
.ai-report-content :deep(ul), .ai-report-content :deep(ol) { margin-bottom: 1rem; padding-left: 1.5rem; }
.ai-report-content :deep(li) { margin-bottom: 0.4rem; }
.ai-report-content :deep(strong) { color: #0f766e; }
</style>
