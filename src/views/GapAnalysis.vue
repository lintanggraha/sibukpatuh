<template>
  <div>
    <!-- Summary / Progress Bar -->
    <div class="card shadow-sm mb-4 border-0">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="card-title mb-0">{{ $t('auto_25') }}</h5>
          <button class="btn btn-sm btn-outline-success" @click="exportCSV">
            <i class="fa-solid fa-file-csv me-1"></i> {{ $t('auto_26') }}
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
            <div 
              class="border rounded-3 p-3 bg-white h-100 shadow-sm border-success cursor-pointer transition-all card-filter"
              :class="{'ring-2 ring-success bg-success bg-opacity-10': selectedFilter === 'Covered'}"
              @click="selectedFilter = selectedFilter === 'Covered' ? 'All' : 'Covered'"
              role="button"
            >
              <h2 class="text-success fw-bold mb-1">{{ stats.covered }}</h2>
              <span class="text-muted small fw-bold"><i class="fa-solid fa-circle-check text-success me-1"></i> {{ $t('auto_27') }}</span>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div 
              class="border rounded-3 p-3 bg-white h-100 shadow-sm border-warning cursor-pointer transition-all card-filter"
              :class="{'ring-2 ring-warning bg-warning bg-opacity-10': selectedFilter === 'Partial'}"
              @click="selectedFilter = selectedFilter === 'Partial' ? 'All' : 'Partial'"
              role="button"
            >
              <h2 class="text-warning fw-bold mb-1">{{ stats.partial }}</h2>
              <span class="text-muted small fw-bold"><i class="fa-solid fa-triangle-exclamation text-warning me-1"></i> {{ $t('auto_28') }}</span>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div 
              class="border rounded-3 p-3 bg-white h-100 shadow-sm border-danger cursor-pointer transition-all card-filter"
              :class="{'ring-2 ring-danger bg-danger bg-opacity-10': selectedFilter === 'Gap'}"
              @click="selectedFilter = selectedFilter === 'Gap' ? 'All' : 'Gap'"
              role="button"
            >
              <h2 class="text-danger fw-bold mb-1">{{ stats.gap }}</h2>
              <span class="text-muted small fw-bold"><i class="fa-solid fa-circle-xmark text-danger me-1"></i> {{ $t('auto_29') }}</span>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div 
              class="border rounded-3 p-3 bg-light h-100 shadow-sm cursor-pointer transition-all card-filter"
              :class="{'ring-2 ring-secondary bg-secondary bg-opacity-10': selectedFilter === 'All'}"
              @click="selectedFilter = 'All'"
              role="button"
            >
              <h2 class="text-secondary fw-bold mb-1">{{ stats.total }}</h2>
              <span class="text-muted small fw-bold"><i class="fa-solid fa-list-check text-secondary me-1"></i> {{ $t('auto_30') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Table -->
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white py-3 border-bottom">
        <h5 class="card-title mb-0">{{ $t('auto_31') }}</h5>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 40%;" class="p-3">{{ ui.baselineRequirement }} ({{ getFrameworkName(sourceFwId) }})</th>
                <th style="width: 15%;" class="text-center p-3">{{ $t('auto_32') }}</th>
                <th style="width: 45%;" class="p-3">{{ ui.targetDetail }} ({{ getFrameworkName(targetFwId) }})</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredResults" :key="item.req.id">
                <td class="p-3">
                  <div class="fw-bold text-dark">{{ item.req.name }}</div>
                  <div class="text-muted small mb-1">{{ item.req.desc }}</div>
                  <span class="badge bg-light text-secondary border mt-1"><i class="fa-solid fa-bookmark me-1"></i> {{ item.sourceRef }}</span>
                  <p class="text-muted small mb-0 mt-1 fst-italic">{{ item.sourceNote }}</p>
                </td>
                <td class="text-center p-3">
                  <div v-if="item.status === 'Covered'" class="badge bg-success bg-opacity-10 text-success border border-success rounded-pill w-100 py-2 fs-6">
                    <i class="fa-solid fa-check me-1"></i> {{ $t('auto_33') }}
                  </div>
                  <div v-else-if="item.status === 'Partial'" class="badge bg-warning bg-opacity-10 text-warning border border-warning rounded-pill w-100 py-2 fs-6" style="color: #b78103 !important;">
                    <i class="fa-solid fa-exclamation me-1"></i> {{ $t('auto_34') }}
                  </div>
                  <div v-else class="badge bg-danger bg-opacity-10 text-danger border border-danger rounded-pill w-100 py-2 fs-6">
                    <i class="fa-solid fa-xmark me-1"></i> {{ $t('auto_35') }}
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
                      <div class="fw-bold mb-1"><i class="fa-solid fa-circle-info me-1"></i> {{ $t('auto_36') }}</div>
                      {{ item.partialReason || ui.partialFallback }}
                    </div>
                  </div>
                  <div v-else class="text-danger small fw-bold mt-2">
                    <i class="fa-solid fa-circle-exclamation me-1"></i> {{ $t('auto_37') }}
                  </div>
                </td>
              </tr>
              <tr v-if="filteredResults.length === 0">
                <td colspan="3" class="text-center p-5 text-muted">
                  <i class="fa-solid fa-clipboard-question fs-1 mb-3"></i>
                  <p class="mb-0 fs-5" v-if="analysisResults.length > 0">{{ ui.noFilteredData }} ({{ selectedFilter }}).</p>
                  <p class="mb-0 fs-5" v-else>{{ $t('auto_38') }}</p>
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
import { computed, ref } from 'vue';
import { gapData } from '../data/gapData';

const controlTextEn = {
  'req-01': 'Primary information security policy.',
  'req-02': 'Security structure and responsibilities.',
  'req-03': 'Asset inventory and management.',
  'req-04': 'User access rights control.',
  'req-05': 'Use of cryptography and encryption.',
  'req-06': 'Physical security for buildings and devices.',
  'req-07': 'Secure standard IT operating procedures.',
  'req-08': 'Network and communication security.',
  'req-09': 'Security within the SDLC lifecycle.',
  'req-10': 'Vendor and third-party risk management.',
  'req-11': 'Incident response and reporting.',
  'req-12': 'Business continuity and disaster recovery.',
  'req-13': 'Compliance with regulations and audit.',
  'req-14': 'Vulnerability and patch management.',
  'req-15': 'Continuous cyber threat analysis.',
  'req-16': 'Personal data protection.',
  'req-17': 'Mobile device/BYOD security.',
  'req-18': 'Remote/WFH access security.',
  'req-19': 'Log monitoring and SOC.',
  'req-20': 'Employee security awareness training.',
  'req-21': 'Secure device configuration and hardening.',
  'req-22': 'Data backup and restore testing.',
  'req-23': 'Multifactor authentication implementation.',
  'req-24': 'Data masking and anonymization.',
  'req-25': 'System capacity management for availability.',
};

const textMapEn = {
  'Panduan Resiliensi OJK': 'OJK Resilience Guidance',
  'Di luar cakupan': 'Out of scope',
  'Tidak diatur spesifik': 'Not specifically regulated',
  'Kebijakan Keamanan': 'Security Policy',
  'Pengorganisasian Keamanan': 'Security Organization',
  'Manajemen Aset': 'Asset Management',
  'Manajemen Akses': 'Access Management',
  'Kriptografi': 'Cryptography',
  'Keamanan Fisik': 'Physical Security',
  'Keamanan Operasional': 'Operational Security',
  'Keamanan Komunikasi': 'Communication Security',
  'Pengembangan Sistem': 'System Development',
  'Hubungan Pihak Ketiga': 'Third-Party Relationships',
  'Manajemen Insiden': 'Incident Management',
  'Kelangsungan Bisnis': 'Business Continuity',
  'Kepatuhan': 'Compliance',
  'Manajemen Kerentanan': 'Vulnerability Management',
  'Pelatihan Keamanan': 'Security Training',
  'Hardening Sistem': 'System Hardening',
  'Backup Data': 'Data Backup',
  'Otentikasi Multi-Faktor': 'Multifactor Authentication',
  'Manajemen Kapasitas': 'Capacity Management',
  'Kebijakan Pelindungan Data Pribadi': 'Personal Data Protection Policy',
  'Penunjukan Pejabat PDP (DPO)': 'Appointment of PDP Officer (DPO)',
  'Inventarisasi data pribadi': 'Personal data inventory',
  'Pembatasan hak akses ke data pribadi': 'Restriction of access rights to personal data',
  'Enkripsi data pribadi': 'Personal data encryption',
  'SOP Pemrosesan Data': 'Data Processing SOP',
  'Perjanjian pemrosesan dengan prosesor': 'Processing agreement with processors',
  'Mencegah eksposur data sensitif': 'Preventing sensitive data exposure',
  'Perlindungan data sensitif': 'Sensitive data protection',
};

const isEn = computed(() => localStorage.getItem('language') === 'en');
const ui = computed(() => ({
  baselineRequirement: isEn.value ? 'Baseline Requirement' : 'Kebutuhan Baseline',
  targetDetail: isEn.value ? 'Target Detail' : 'Keterangan Target',
  partialFallback: isEn.value ? 'The target only covers part of the baseline or is less detailed than the reference specification.' : 'Target hanya mencakup sebagian aspek dari baseline, atau tidak sedetail spesifikasi acuan.',
  noFilteredData: isEn.value ? 'No data matches the selected filter' : 'Tidak ada data yang sesuai dengan filter',
}));

function translateText(text) {
  if (!isEn.value || !text) return text;
  if (textMapEn[text]) return textMapEn[text];
  return text
    .replace(/\bBab\b/g, 'Chapter')
    .replace(/\bPasal\b/g, 'Article')
    .replace(/Hanya mengatur/g, 'Only regulates')
    .replace(/Hanya mewajibkan/g, 'Only requires')
    .replace(/Tidak mencakup/g, 'Does not cover')
    .replace(/tidak mencakup/g, 'does not cover')
    .replace(/Mewajibkan/g, 'Requires')
    .replace(/namun/g, 'but')
    .replace(/secara umum/g, 'in general')
    .replace(/secara spesifik/g, 'specifically')
    .replace(/regulasi/g, 'regulation')
    .replace(/data pribadi/g, 'personal data')
    .replace(/akses/g, 'access');
}

function localizeReq(req) {
  if (!req || !isEn.value) return req;
  return { ...req, desc: controlTextEn[req.id] || req.desc };
}

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
  return fw ? translateText(fw.name) : id;
};

const selectedFilter = ref('All');

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
      req: localizeReq(req),
      sourceRef: sourceCtrl.ref,
      sourceNote: translateText(sourceCtrl.note),
      status: evalStatus,
      targetRef: targetCtrl && targetCtrl.status !== 'N' ? targetCtrl.ref : '-',
      targetNote: targetCtrl && targetCtrl.status !== 'N' ? translateText(targetCtrl.note) : '',
      partialReason: targetCtrl && targetCtrl.status === 'P' ? translateText(targetCtrl.partialReason) : null
    });
  });
  
  return results;
});

const filteredResults = computed(() => {
  if (selectedFilter.value === 'All') return analysisResults.value;
  return analysisResults.value.filter(item => item.status === selectedFilter.value);
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
.cursor-pointer {
  cursor: pointer;
}
.transition-all {
  transition: all 0.2s ease-in-out;
}
.card-filter:hover {
  transform: translateY(-2px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.08)!important;
}
.ring-2 {
  box-shadow: 0 0 0 0.25rem;
}
.ring-success { box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25) !important; }
.ring-warning { box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25) !important; }
.ring-danger { box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important; }
.ring-secondary { box-shadow: 0 0 0 0.25rem rgba(108, 117, 125, 0.25) !important; }
</style>
