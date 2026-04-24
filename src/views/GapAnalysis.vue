<template>
  <div>
    <!-- Summary / Progress Bar -->
    <div class="card shadow-sm mb-4 border-0">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="card-title mb-0">Ringkasan Pemenuhan (Coverage)</h5>
          <button class="btn btn-sm btn-outline-success" @click="exportCSV">
            <i class="fa-solid fa-file-csv me-1"></i> Export CSV
          </button>
        </div>
        
        <div class="progress mb-4 rounded-pill shadow-inner" style="height: 35px; font-size: 1rem; font-weight: bold;">
          <div class="progress-bar bg-success" role="progressbar" :style="{ width: stats.coveredPct + '%' }" v-if="stats.coveredPct > 0">
            {{ stats.coveredPct }}%
          </div>
          <div class="progress-bar bg-warning text-dark" role="progressbar" :style="{ width: stats.partialPct + '%' }" v-if="stats.partialPct > 0">
            {{ stats.partialPct }}%
          </div>
          <div class="progress-bar bg-danger" role="progressbar" :style="{ width: stats.gapPct + '%' }" v-if="stats.gapPct > 0">
            {{ stats.gapPct }}%
          </div>
        </div>
        
        <div class="row g-3 text-center">
          <div class="col-md-3 col-6">
            <div class="border rounded-3 p-3 bg-white h-100 shadow-sm border-success">
              <h2 class="text-success fw-bold mb-1">{{ stats.covered }}</h2>
              <span class="text-muted small fw-bold"><i class="fa-solid fa-circle-check text-success me-1"></i> Covered</span>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="border rounded-3 p-3 bg-white h-100 shadow-sm border-warning">
              <h2 class="text-warning fw-bold mb-1">{{ stats.partial }}</h2>
              <span class="text-muted small fw-bold"><i class="fa-solid fa-triangle-exclamation text-warning me-1"></i> Partial</span>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="border rounded-3 p-3 bg-white h-100 shadow-sm border-danger">
              <h2 class="text-danger fw-bold mb-1">{{ stats.gap }}</h2>
              <span class="text-muted small fw-bold"><i class="fa-solid fa-circle-xmark text-danger me-1"></i> Gap</span>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="border rounded-3 p-3 bg-light h-100 shadow-sm">
              <h2 class="text-secondary fw-bold mb-1">{{ stats.total }}</h2>
              <span class="text-muted small fw-bold"><i class="fa-solid fa-list-check text-secondary me-1"></i> Total Baseline</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Table -->
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white py-3 border-bottom">
        <h5 class="card-title mb-0">Detail Gap Analysis</h5>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 40%;" class="p-3">Kebutuhan Baseline ({{ getFrameworkName(sourceFwId) }})</th>
                <th style="width: 15%;" class="text-center p-3">Status</th>
                <th style="width: 45%;" class="p-3">Keterangan Target ({{ getFrameworkName(targetFwId) }})</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in analysisResults" :key="item.req.id">
                <td class="p-3">
                  <div class="fw-bold text-dark">{{ item.req.name }}</div>
                  <div class="text-muted small mb-1">{{ item.req.desc }}</div>
                  <span class="badge bg-light text-secondary border mt-1"><i class="fa-solid fa-bookmark me-1"></i> {{ item.sourceRef }}</span>
                  <p class="text-muted small mb-0 mt-1 fst-italic">{{ item.sourceNote }}</p>
                </td>
                <td class="text-center p-3">
                  <div v-if="item.status === 'Covered'" class="badge bg-success bg-opacity-10 text-success border border-success rounded-pill w-100 py-2 fs-6">
                    <i class="fa-solid fa-check me-1"></i> Covered
                  </div>
                  <div v-else-if="item.status === 'Partial'" class="badge bg-warning bg-opacity-10 text-warning border border-warning rounded-pill w-100 py-2 fs-6" style="color: #b78103 !important;">
                    <i class="fa-solid fa-exclamation me-1"></i> Partial
                  </div>
                  <div v-else class="badge bg-danger bg-opacity-10 text-danger border border-danger rounded-pill w-100 py-2 fs-6">
                    <i class="fa-solid fa-xmark me-1"></i> Gap
                  </div>
                </td>
                <td class="p-3">
                  <div v-if="item.status === 'Covered'">
                    <span class="badge bg-secondary mb-1">{{ item.targetRef }}</span>
                    <p class="mb-0 fw-medium text-success">{{ item.targetNote }}</p>
                  </div>
                  <div v-else-if="item.status === 'Partial'">
                    <span class="badge bg-secondary mb-1">{{ item.targetRef }}</span>
                    <p class="mb-1 fw-medium">{{ item.targetNote }}</p>
                    <div class="alert alert-warning py-2 px-3 mb-0 mt-2 small border-warning bg-warning bg-opacity-10 d-inline-block">
                      <div class="fw-bold mb-1"><i class="fa-solid fa-circle-info me-1"></i> Aspek yang Belum Terpenuhi (Gap):</div>
                      {{ item.partialReason || 'Target hanya mencakup sebagian aspek dari baseline, atau tidak sedetail spesifikasi acuan.' }}
                    </div>
                  </div>
                  <div v-else class="text-danger small fw-bold mt-2">
                    <i class="fa-solid fa-circle-exclamation me-1"></i> Tidak ditemukan kontrol yang memadai pada target.
                  </div>
                </td>
              </tr>
              <tr v-if="analysisResults.length === 0">
                <td colspan="3" class="text-center p-5 text-muted">
                  <i class="fa-solid fa-clipboard-question fs-1 mb-3"></i>
                  <p class="mb-0 fs-5">Tidak ada data evaluasi (Baseline tidak memiliki kontrol ini).</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { gapData } from '../data/gapData';

const props = defineProps({
  sourceFwId: {
    type: String,
    required: true
  },
  targetFwId: {
    type: String,
    required: true
  }
});

const availableFrameworks = gapData.frameworks;

const getFrameworkName = (id) => {
  const fw = availableFrameworks.find(f => f.id === id);
  return fw ? fw.name : id;
};

const analysisResults = computed(() => {
  const sourceCoverage = gapData.coverage[props.sourceFwId] || [];
  const targetCoverage = gapData.coverage[props.targetFwId] || [];
  
  const results = [];
  
  const baselineControls = sourceCoverage.filter(c => c.status === 'C' || c.status === 'P');
  
  baselineControls.forEach(sourceCtrl => {
    const req = gapData.controls.find(c => c.id === sourceCtrl.id);
    const targetCtrl = targetCoverage.find(c => c.id === sourceCtrl.id);
    
    let evalStatus = 'Gap';
    if (targetCtrl && targetCtrl.status !== 'N') {
      if (sourceCtrl.status === 'C') {
        if (targetCtrl.status === 'C') evalStatus = 'Covered';
        else if (targetCtrl.status === 'P') evalStatus = 'Partial';
      } else if (sourceCtrl.status === 'P') {
        evalStatus = 'Covered';
      }
    }
    
    results.push({
      req,
      sourceRef: sourceCtrl.ref,
      sourceNote: sourceCtrl.note,
      status: evalStatus,
      targetRef: targetCtrl && targetCtrl.status !== 'N' ? targetCtrl.ref : '-',
      targetNote: targetCtrl && targetCtrl.status !== 'N' ? targetCtrl.note : '',
      partialReason: targetCtrl && targetCtrl.status === 'P' ? targetCtrl.partialReason : null
    });
  });
  
  return results;
});

const stats = computed(() => {
  const total = analysisResults.value.length;
  if (total === 0) return { covered: 0, partial: 0, gap: 0, total: 0, coveredPct: 0, partialPct: 0, gapPct: 0 };
  
  const covered = analysisResults.value.filter(r => r.status === 'Covered').length;
  const partial = analysisResults.value.filter(r => r.status === 'Partial').length;
  const gap = analysisResults.value.filter(r => r.status === 'Gap').length;
  
  return {
    total,
    covered,
    partial,
    gap,
    coveredPct: Math.round((covered / total) * 100),
    partialPct: Math.round((partial / total) * 100),
    gapPct: Math.round((gap / total) * 100)
  };
});

const exportCSV = () => {
  const headers = ['Requirement', 'Baseline Source', 'Status', 'Target Reference', 'Target Detail', 'Gap Reason'];
  const rows = analysisResults.value.map(item => {
    const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
    return [
      escapeCsv(item.req.name),
      escapeCsv(`[${item.sourceRef}] ${item.sourceNote}`),
      escapeCsv(item.status),
      escapeCsv(item.targetRef),
      escapeCsv(item.targetNote),
      escapeCsv(item.status === 'Partial' ? item.partialReason : '')
    ].join(',');
  });
  
  const csvContent = "\uFEFF" + headers.join(',') + "\n" + rows.join("\n");
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `gap_analysis_${props.sourceFwId}_vs_${props.targetFwId}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.shadow-inner {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
}
.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.bg-warning.text-dark {
  text-shadow: none;
}
</style>
