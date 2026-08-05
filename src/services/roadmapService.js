/**
 * roadmapService.js
 * Engine penjadwalan Compliance Roadmap
 *
 * Mengubah temuan (findings) dari Compliance Simulator menjadi rencana eksekusi
 * 12 bulan yang terstruktur: setiap rekomendasi dipetakan menjadi task dengan
 * bulan mulai, durasi, fase, dependency, dan penanggung jawab.
 *
 * Prinsip penjadwalan yang digunakan:
 *  1. Prioritas regulasi (immediate/short/medium) menentukan fase dasar
 *  2. Criticality score menggeser task ke depan dalam fasenya
 *  3. Effort menentukan durasi pengerjaan
 *  4. Task tata kelola mendahului task teknis (dependency logis)
 */

// ─── Konstanta Fase ───────────────────────────────────────────────────────────

/**
 * Empat fase eksekusi dalam horizon 12 bulan.
 * Setiap fase punya rentang bulan dan makna strategis yang berbeda.
 */
export const PHASES = [
  {
    id: 'foundation',
    startMonth: 1,
    endMonth: 3,
    color: '#dc2626',
    labelId: 'Fase 1 — Fondasi & Mitigasi Darurat',
    labelEn: 'Phase 1 — Foundation & Emergency Mitigation',
    descId: 'Menutup celah kepatuhan yang berisiko sanksi langsung dan membentuk dasar tata kelola.',
    descEn: 'Close compliance gaps with direct sanction risk and establish governance foundations.',
  },
  {
    id: 'buildout',
    startMonth: 4,
    endMonth: 6,
    color: '#ea580c',
    labelId: 'Fase 2 — Pembangunan Kontrol Inti',
    labelEn: 'Phase 2 — Core Control Buildout',
    descId: 'Membangun kontrol teknis dan proses operasional yang menjadi tulang punggung kepatuhan.',
    descEn: 'Build the technical controls and operational processes that form the compliance backbone.',
  },
  {
    id: 'maturity',
    startMonth: 7,
    endMonth: 9,
    color: '#ca8a04',
    labelId: 'Fase 3 — Pematangan & Integrasi',
    labelEn: 'Phase 3 — Maturity & Integration',
    descId: 'Mengintegrasikan kontrol antar-domain dan meningkatkan kematangan proses.',
    descEn: 'Integrate controls across domains and raise process maturity.',
  },
  {
    id: 'assurance',
    startMonth: 10,
    endMonth: 12,
    color: '#16a34a',
    labelId: 'Fase 4 — Asurans & Perbaikan Berkelanjutan',
    labelEn: 'Phase 4 — Assurance & Continuous Improvement',
    descId: 'Memvalidasi efektivitas kontrol melalui audit dan menyiapkan siklus perbaikan.',
    descEn: 'Validate control effectiveness through audit and establish improvement cycles.',
  },
];

/**
 * Pemetaan prioritas rekomendasi ke fase dasar.
 */
const PRIORITY_PHASE_MAP = {
  immediate: 0, // Fase 1
  short: 1,     // Fase 2
  medium: 2,    // Fase 3
};

/**
 * Durasi task (dalam bulan) berdasarkan tingkat effort.
 */
const EFFORT_DURATION = {
  low: 1,
  medium: 2,
  high: 3,
};

/**
 * Kata kunci untuk mendeteksi kategori task dari nama framework/area temuan.
 * Digunakan untuk menentukan dependency dan ikon.
 */
const CATEGORY_RULES = [
  {
    id: 'governance',
    icon: 'fa-gavel',
    keywords: ['tata kelola', 'governance', 'kebijakan', 'policy', 'administratif'],
    order: 1,
  },
  {
    id: 'technical',
    icon: 'fa-shield-halved',
    keywords: ['teknis', 'technical', 'infrastruktur', 'infrastructure'],
    order: 2,
  },
  {
    id: 'appsec',
    icon: 'fa-bug',
    keywords: ['aplikasi web', 'web application', 'owasp'],
    order: 3,
  },
  {
    id: 'privacy',
    icon: 'fa-user-shield',
    keywords: ['data pribadi', 'personal data', 'pdp'],
    order: 4,
  },
  {
    id: 'vendor',
    icon: 'fa-handshake',
    keywords: ['vendor', 'kedaulatan', 'sovereignty'],
    order: 5,
  },
  {
    id: 'operations',
    icon: 'fa-headset',
    keywords: ['operasional', 'operations', 'soc', 'audit'],
    order: 6,
  },
];

/**
 * Menentukan kategori sebuah temuan berdasarkan nama area/framework-nya.
 */
function detectCategory(frameworkName = '') {
  const lower = frameworkName.toLowerCase();
  const found = CATEGORY_RULES.find((rule) =>
    rule.keywords.some((kw) => lower.includes(kw)),
  );
  return found || { id: 'general', icon: 'fa-clipboard-check', order: 7 };
}

/**
 * Memperkirakan effort per rekomendasi individual.
 *
 * Effort pada temuan bersifat agregat untuk seluruh area. Untuk task individual,
 * effort disesuaikan: rekomendasi mendesak biasanya lebih terfokus (durasi lebih
 * pendek), sedangkan rekomendasi jangka menengah cenderung bersifat program.
 */
function deriveTaskEffort(findingEffort, priority) {
  const base = EFFORT_DURATION[findingEffort] || 2;
  if (priority === 'immediate') return Math.max(1, base - 1);
  if (priority === 'medium') return Math.min(3, base + 1);
  return base;
}

/**
 * Memotong teks panjang menjadi judul task yang ringkas namun tetap bermakna.
 */
function buildTaskTitle(action, maxLength = 95) {
  const clean = String(action || '').trim();
  if (clean.length <= maxLength) return clean;

  // Potong di batas kata terdekat, lalu di batas kalimat jika memungkinkan
  const sliced = clean.slice(0, maxLength);
  const lastPeriod = sliced.lastIndexOf('. ');
  if (lastPeriod > maxLength * 0.5) return sliced.slice(0, lastPeriod + 1);

  const lastSpace = sliced.lastIndexOf(' ');
  return `${sliced.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

/**
 * Menghitung bulan mulai sebuah task di dalam fasenya.
 *
 * Task dengan criticality tinggi diletakkan di awal fase, task dengan
 * criticality rendah digeser ke belakang. Ini memastikan urutan pengerjaan
 * dalam satu fase tetap mencerminkan tingkat risiko.
 */
function computeStartMonth(phase, criticalityScore, slotIndex) {
  const phaseSpan = phase.endMonth - phase.startMonth + 1;

  // Criticality 10 → offset 0 (paling awal), criticality 1 → offset maksimal
  const criticalityOffset = Math.floor(((10 - (criticalityScore || 5)) / 10) * (phaseSpan - 1));

  // Slot index mencegah semua task menumpuk di bulan yang sama
  const slotOffset = slotIndex % phaseSpan;

  const offset = Math.min(phaseSpan - 1, Math.max(criticalityOffset, slotOffset));
  return phase.startMonth + offset;
}

// ─── Generator Utama ──────────────────────────────────────────────────────────

/**
 * Membangun roadmap 12 bulan dari hasil simulasi.
 *
 * @param {Array} findings - Array temuan dari Compliance Simulator
 * @param {Object} options - { isEn: boolean }
 * @returns {Object} { tasks, phases, stats, dependencies }
 */
export function generateRoadmap(findings = [], options = {}) {
  const { isEn = false } = options;
  const tasks = [];
  const slotCounter = {};

  // Urutkan temuan: criticality tertinggi lebih dulu, lalu berdasarkan urutan kategori
  const sortedFindings = [...findings]
    .filter((f) => f.severity !== 'success' && Array.isArray(f.recommendations))
    .sort((a, b) => {
      const critDiff = (b.criticalityScore || 0) - (a.criticalityScore || 0);
      if (critDiff !== 0) return critDiff;
      return detectCategory(a.framework).order - detectCategory(b.framework).order;
    });

  sortedFindings.forEach((finding) => {
    const category = detectCategory(finding.framework);

    finding.recommendations.forEach((rec) => {
      const phaseIndex = PRIORITY_PHASE_MAP[rec.priority] ?? 1;
      const phase = PHASES[phaseIndex];

      slotCounter[phase.id] = (slotCounter[phase.id] || 0) + 1;
      const slotIndex = slotCounter[phase.id] - 1;

      const duration = deriveTaskEffort(finding.effort, rec.priority);
      const startMonth = computeStartMonth(phase, finding.criticalityScore, slotIndex);
      const endMonth = Math.min(12, startMonth + duration - 1);

      tasks.push({
        id: `task-${tasks.length + 1}`,
        title: buildTaskTitle(rec.action),
        fullAction: rec.action,
        priority: rec.priority,
        phaseId: phase.id,
        phaseIndex,
        categoryId: category.id,
        icon: category.icon,
        area: finding.framework,
        regulations: finding.regulations || [],
        owner: finding.owner || (isEn ? 'Compliance Team' : 'Tim Kepatuhan'),
        criticalityScore: finding.criticalityScore || 5,
        severity: finding.severity,
        effort: finding.effort,
        startMonth,
        endMonth,
        duration: endMonth - startMonth + 1,
      });
    });
  });

  // ── Dependency: task tata kelola menjadi prasyarat task teknis di fase awal ──
  const governanceTasks = tasks.filter((t) => t.categoryId === 'governance');
  const dependencies = [];

  if (governanceTasks.length > 0) {
    const anchor = governanceTasks[0];
    tasks
      .filter((t) => t.categoryId !== 'governance' && t.phaseIndex <= 1)
      .forEach((t) => {
        dependencies.push({ from: anchor.id, to: t.id });
      });
  }

  // ── Statistik ringkas ──────────────────────────────────────────────────────
  const stats = {
    totalTasks: tasks.length,
    byPhase: PHASES.map((phase) => ({
      phaseId: phase.id,
      count: tasks.filter((t) => t.phaseId === phase.id).length,
    })),
    immediateCount: tasks.filter((t) => t.priority === 'immediate').length,
    highEffortCount: tasks.filter((t) => t.effort === 'high').length,
    uniqueOwners: [...new Set(tasks.map((t) => t.owner))],
    criticalTaskCount: tasks.filter((t) => t.criticalityScore >= 8).length,
    peakMonth: findPeakMonth(tasks),
  };

  return { tasks, phases: PHASES, stats, dependencies };
}

/**
 * Mencari bulan dengan beban task paling padat, berguna untuk peringatan kapasitas.
 */
function findPeakMonth(tasks) {
  const load = {};
  tasks.forEach((t) => {
    for (let m = t.startMonth; m <= t.endMonth; m += 1) {
      load[m] = (load[m] || 0) + 1;
    }
  });

  let peak = { month: 1, count: 0 };
  Object.entries(load).forEach(([month, count]) => {
    if (count > peak.count) peak = { month: Number(month), count };
  });
  return peak;
}

/**
 * Menghitung jumlah task aktif per bulan, untuk visualisasi beban kerja.
 */
export function computeMonthlyLoad(tasks = []) {
  const load = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
  tasks.forEach((t) => {
    for (let m = t.startMonth; m <= t.endMonth; m += 1) {
      if (m >= 1 && m <= 12) load[m - 1].count += 1;
    }
  });
  return load;
}

/**
 * Mengelompokkan task berdasarkan penanggung jawab, untuk pandangan per tim.
 */
export function groupTasksByOwner(tasks = []) {
  const groups = {};
  tasks.forEach((t) => {
    if (!groups[t.owner]) groups[t.owner] = [];
    groups[t.owner].push(t);
  });
  return Object.entries(groups)
    .map(([owner, items]) => ({ owner, tasks: items, count: items.length }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Label bulan untuk header timeline, dihitung relatif dari bulan mulai proyek.
 */
export function buildMonthLabels(isEn = false, startDate = new Date()) {
  const monthNamesId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const names = isEn ? monthNamesEn : monthNamesId;

  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    return {
      index: i + 1,
      label: names[date.getMonth()],
      year: date.getFullYear(),
      isYearStart: date.getMonth() === 0 || i === 0,
    };
  });
}
