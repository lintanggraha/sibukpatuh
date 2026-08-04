<template>
  <div class="report-exporter">
    <!-- Trigger button -->
    <button
      class="btn btn-export-trigger"
      :class="triggerClass"
      @click="showModal = true"
      :disabled="disabled"
      :title="disabled ? (isEn ? 'Run analysis first' : 'Jalankan analisis terlebih dahulu') : (isEn ? 'Export Report' : 'Ekspor Laporan')"
    >
      <i class="fa-solid fa-file-export me-2"></i>
      {{ isEn ? 'Export Report' : 'Ekspor Laporan' }}
    </button>

    <!-- Modal overlay -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showModal" class="re-overlay" @click.self="showModal = false">
          <div class="re-modal">
            <!-- Modal header -->
            <div class="re-modal-header">
              <div class="re-modal-icon">
                <i class="fa-solid fa-file-export"></i>
              </div>
              <div>
                <h5 class="re-modal-title">{{ isEn ? 'Export Report' : 'Ekspor Laporan' }}</h5>
                <p class="re-modal-subtitle">{{ isEn ? 'Choose format and options' : 'Pilih format dan opsi laporan' }}</p>
              </div>
              <button class="re-close-btn" @click="showModal = false">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Modal body -->
            <div class="re-modal-body">
              <!-- Report info -->
              <div class="re-info-box">
                <i class="fa-solid fa-circle-info text-primary me-2"></i>
                <span>{{ reportDescription }}</span>
              </div>

              <!-- Format selection -->
              <p class="re-section-label">{{ isEn ? 'Select Export Format' : 'Pilih Format Ekspor' }}</p>
              <div class="re-format-grid">
                <!-- PDF option -->
                <button
                  class="re-format-card"
                  :class="{ active: selectedFormat === 'pdf' }"
                  @click="selectedFormat = 'pdf'"
                >
                  <div class="re-format-icon pdf">
                    <i class="fa-solid fa-file-pdf"></i>
                  </div>
                  <div class="re-format-info">
                    <span class="re-format-name">PDF</span>
                    <span class="re-format-desc">{{ isEn ? 'Printable report with branding' : 'Laporan siap cetak dengan branding' }}</span>
                  </div>
                  <div class="re-format-check" v-if="selectedFormat === 'pdf'">
                    <i class="fa-solid fa-circle-check text-primary"></i>
                  </div>
                </button>

                <!-- Excel option -->
                <button
                  class="re-format-card"
                  :class="{ active: selectedFormat === 'excel' }"
                  @click="selectedFormat = 'excel'"
                >
                  <div class="re-format-icon excel">
                    <i class="fa-solid fa-file-excel"></i>
                  </div>
                  <div class="re-format-info">
                    <span class="re-format-name">Excel (.xlsx)</span>
                    <span class="re-format-desc">{{ isEn ? 'Multi-sheet workbook, editable' : 'Workbook multi-sheet, dapat diedit' }}</span>
                  </div>
                  <div class="re-format-check" v-if="selectedFormat === 'excel'">
                    <i class="fa-solid fa-circle-check text-primary"></i>
                  </div>
                </button>
              </div>

              <!-- What's included -->
              <p class="re-section-label mt-3">{{ isEn ? "What's Included" : 'Konten Laporan' }}</p>
              <ul class="re-includes-list">
                <li v-for="item in includesList" :key="item">
                  <i class="fa-solid fa-check text-success me-2"></i>{{ item }}
                </li>
              </ul>
            </div>

            <!-- Modal footer -->
            <div class="re-modal-footer">
              <button class="btn btn-light btn-sm" @click="showModal = false">
                {{ isEn ? 'Cancel' : 'Batal' }}
              </button>
              <button
                class="btn btn-primary btn-sm re-export-btn"
                @click="handleExport"
                :disabled="isExporting"
              >
                <span v-if="isExporting">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  {{ isEn ? 'Generating...' : 'Membuat laporan...' }}
                </span>
                <span v-else>
                  <i class="fa-solid fa-download me-2"></i>
                  {{ isEn ? `Download ${selectedFormat.toUpperCase()}` : `Unduh ${selectedFormat.toUpperCase()}` }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  /** 'gap-analysis' | 'simulator' */
  type: { type: String, required: true },
  /** Data payload yang diteruskan ke reportService */
  payload: { type: Object, required: true },
  /** Apakah tombol disabled (misal: belum ada hasil) */
  disabled: { type: Boolean, default: false },
  /** Bahasa saat ini */
  isEn: { type: Boolean, default: false },
  /** CSS class tambahan untuk tombol trigger */
  triggerClass: { type: String, default: 'btn-outline-primary btn-sm' },
});

const showModal = ref(false);
const selectedFormat = ref('pdf');
const isExporting = ref(false);

const reportDescription = computed(() => {
  if (props.type === 'gap-analysis') {
    return props.isEn
      ? `Gap Analysis: ${props.payload.sourceName} → ${props.payload.targetName}`
      : `Gap Analysis: ${props.payload.sourceName} → ${props.payload.targetName}`;
  }
  return props.isEn ? 'Compliance Simulation based on selected scenario' : 'Simulasi kepatuhan berdasarkan skenario yang dipilih';
});

const includesList = computed(() => {
  if (props.type === 'gap-analysis') {
    return props.isEn
      ? ['Executive summary with statistics', 'Detailed gap analysis table', 'Gap items only sheet (Excel)', 'SibukPatuh branding & date']
      : ['Ringkasan eksekutif dengan statistik', 'Tabel detail gap analysis', 'Sheet khusus item kesenjangan (Excel)', 'Branding SibukPatuh & tanggal'];
  }
  return props.isEn
    ? ['Simulation scenario details', 'Risk summary (violations / warnings)', 'Detailed findings & recommendations', 'SibukPatuh branding & date']
    : ['Detail skenario simulasi', 'Ringkasan risiko (pelanggaran / peringatan)', 'Temuan detail & rekomendasi', 'Branding SibukPatuh & tanggal'];
});

async function handleExport() {
  isExporting.value = true;
  try {
    if (props.type === 'gap-analysis') {
      const { exportGapAnalysisPDF, exportGapAnalysisExcel } = await import('../services/reportService.js');
      if (selectedFormat.value === 'pdf') {
        exportGapAnalysisPDF({ ...props.payload, isEn: props.isEn });
      } else {
        await exportGapAnalysisExcel({ ...props.payload, isEn: props.isEn });
      }
    } else if (props.type === 'simulator') {
      const { exportSimulatorPDF, exportSimulatorExcel } = await import('../services/reportService.js');
      if (selectedFormat.value === 'pdf') {
        exportSimulatorPDF({ ...props.payload, isEn: props.isEn });
      } else {
        await exportSimulatorExcel({ ...props.payload, isEn: props.isEn });
      }
    }
    showModal.value = false;
  } catch (err) {
    console.error('Export error:', err);
    alert(props.isEn ? 'Export failed. Please try again.' : 'Ekspor gagal. Silakan coba lagi.');
  } finally {
    isExporting.value = false;
  }
}
</script>

<style scoped>
/* ── Trigger button ─────────────────────────────────────────────── */
.btn-export-trigger {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  transition: all 0.2s;
}

/* ── Overlay ────────────────────────────────────────────────────── */
.re-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* ── Modal ──────────────────────────────────────────────────────── */
.re-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
}

[data-bs-theme="dark"] .re-modal {
  background: #1e293b;
  color: #f1f5f9;
}

/* Header */
.re-modal-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

[data-bs-theme="dark"] .re-modal-header {
  border-bottom-color: #334155;
}

.re-modal-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.re-modal-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

[data-bs-theme="dark"] .re-modal-title { color: #f1f5f9; }

.re-modal-subtitle {
  margin: 0;
  font-size: 0.78rem;
  color: #64748b;
}

.re-close-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}
.re-close-btn:hover { color: #0f172a; background: #f1f5f9; }

/* Body */
.re-modal-body {
  padding: 1.25rem 1.5rem;
}

.re-info-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 0.6rem 0.875rem;
  font-size: 0.82rem;
  color: #1e40af;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.25rem;
}

[data-bs-theme="dark"] .re-info-box {
  background: rgba(37, 99, 235, 0.1);
  border-color: rgba(37, 99, 235, 0.3);
  color: #93c5fd;
}

.re-section-label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin-bottom: 0.625rem;
}

/* Format cards */
.re-format-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.re-format-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  width: 100%;
}

.re-format-card:hover {
  border-color: #93c3fd;
  background: #eff6ff;
}

.re-format-card.active {
  border-color: #2563eb;
  background: #eff6ff;
}

[data-bs-theme="dark"] .re-format-card {
  background: #0f172a;
  border-color: #334155;
  color: #f1f5f9;
}

[data-bs-theme="dark"] .re-format-card.active {
  border-color: #3b82f6;
  background: rgba(37, 99, 235, 0.1);
}

.re-format-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.re-format-icon.pdf { background: #fee2e2; color: #dc2626; }
.re-format-icon.excel { background: #dcfce7; color: #16a34a; }

.re-format-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.re-format-name {
  font-weight: 700;
  font-size: 0.9rem;
}

.re-format-desc {
  font-size: 0.75rem;
  color: #64748b;
}

.re-format-check { font-size: 1.1rem; }

/* Includes list */
.re-includes-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.re-includes-list li {
  font-size: 0.82rem;
  color: #475569;
  display: flex;
  align-items: flex-start;
}

[data-bs-theme="dark"] .re-includes-list li { color: #94a3b8; }

/* Footer */
.re-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

[data-bs-theme="dark"] .re-modal-footer {
  border-top-color: #334155;
  background: #0f172a;
}

.re-export-btn {
  min-width: 140px;
  font-weight: 600;
}

/* ── Transition ─────────────────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-active .re-modal,
.modal-fade-leave-active .re-modal {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .re-modal,
.modal-fade-leave-to .re-modal {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>
