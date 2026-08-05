<template>
  <div class="rm-wrapper">
    <!-- ═══ Header & Ringkasan ═══════════════════════════════════════════ -->
    <div class="rm-head">
      <div class="rm-head-left">
        <h3 class="rm-title">
          <i class="fas fa-map-signs me-2"></i>{{ t.title }}
        </h3>
        <p class="rm-lede">{{ t.lede }}</p>
      </div>
      <div class="rm-view-switch">
        <button
          class="rm-switch-btn"
          :class="{ active: viewMode === 'timeline' }"
          @click="viewMode = 'timeline'"
        >
          <i class="fas fa-stream me-1"></i> {{ t.viewTimeline }}
        </button>
        <button
          class="rm-switch-btn"
          :class="{ active: viewMode === 'phase' }"
          @click="viewMode = 'phase'"
        >
          <i class="fas fa-layer-group me-1"></i> {{ t.viewPhase }}
        </button>
        <button
          class="rm-switch-btn"
          :class="{ active: viewMode === 'owner' }"
          @click="viewMode = 'owner'"
        >
          <i class="fas fa-users-gear me-1"></i> {{ t.viewOwner }}
        </button>
      </div>
    </div>

    <!-- ═══ Kartu Statistik ══════════════════════════════════════════════ -->
    <div class="rm-stats">
      <div class="rm-stat">
        <span class="rm-stat-num">{{ roadmap.stats.totalTasks }}</span>
        <span class="rm-stat-label">{{ t.statTotal }}</span>
      </div>
      <div class="rm-stat urgent">
        <span class="rm-stat-num">{{ roadmap.stats.immediateCount }}</span>
        <span class="rm-stat-label">{{ t.statImmediate }}</span>
      </div>
      <div class="rm-stat critical">
        <span class="rm-stat-num">{{ roadmap.stats.criticalTaskCount }}</span>
        <span class="rm-stat-label">{{ t.statCritical }}</span>
      </div>
      <div class="rm-stat">
        <span class="rm-stat-num">{{ roadmap.stats.uniqueOwners.length }}</span>
        <span class="rm-stat-label">{{ t.statTeams }}</span>
      </div>
      <div class="rm-stat">
        <span class="rm-stat-num">{{ monthLabels[roadmap.stats.peakMonth.month - 1].label }}</span>
        <span class="rm-stat-label">{{ t.statPeak }}</span>
      </div>
    </div>

    <!-- ═══ Catatan Beban Kerja ══════════════════════════════════════════ -->
    <div class="rm-insight" v-if="roadmap.stats.peakMonth.count > 0">
      <i class="fas fa-lightbulb"></i>
      <p>{{ workloadInsight }}</p>
    </div>

    <!-- ═══ MODE 1: Timeline Gantt ═══════════════════════════════════════ -->
    <div v-if="viewMode === 'timeline'" class="rm-gantt-container">
      <!-- Legenda Fase -->
      <div class="rm-legend">
        <div
          v-for="phase in roadmap.phases"
          :key="phase.id"
          class="rm-legend-item"
        >
          <span class="rm-legend-dot" :style="{ background: phase.color }"></span>
          <span>{{ isEn ? phase.labelEn : phase.labelId }}</span>
        </div>
      </div>

      <div class="rm-gantt-scroll">
        <div class="rm-gantt">
          <!-- Header Bulan -->
          <div class="rm-gantt-header">
            <div class="rm-gantt-label-col">{{ t.colTask }}</div>
            <div class="rm-gantt-months">
              <div
                v-for="m in monthLabels"
                :key="m.index"
                class="rm-month-cell"
                :class="{ 'quarter-start': (m.index - 1) % 3 === 0 }"
              >
                <span class="rm-month-name">{{ m.label }}</span>
                <span class="rm-month-num">M{{ m.index }}</span>
              </div>
            </div>
          </div>

          <!-- Baris per Fase -->
          <template v-for="phase in roadmap.phases" :key="phase.id">
            <div
              v-if="tasksByPhase(phase.id).length"
              class="rm-phase-divider"
              :style="{ borderLeftColor: phase.color }"
            >
              <i class="fas fa-flag-checkered me-2" :style="{ color: phase.color }"></i>
              <strong>{{ isEn ? phase.labelEn : phase.labelId }}</strong>
              <span class="rm-phase-months">
                {{ t.month }} {{ phase.startMonth }}–{{ phase.endMonth }}
              </span>
              <span class="rm-phase-count">
                {{ tasksByPhase(phase.id).length }} {{ t.tasks }}
              </span>
            </div>

            <div
              v-for="task in tasksByPhase(phase.id)"
              :key="task.id"
              class="rm-gantt-row"
              :class="{ 'is-open': expandedTask === task.id }"
            >
              <div class="rm-gantt-label-col" @click="toggleTask(task.id)">
                <div class="rm-task-label">
                  <i class="fas" :class="task.icon"></i>
                  <span class="rm-task-name">{{ task.title }}</span>
                </div>
                <div class="rm-task-meta">
                  <span class="rm-prio-chip" :class="task.priority">
                    {{ priorityLabel(task.priority) }}
                  </span>
                  <span class="rm-crit-chip" :class="critClass(task.criticalityScore)">
                    {{ task.criticalityScore }}/10
                  </span>
                </div>
              </div>

              <div class="rm-gantt-months">
                <div
                  v-for="m in monthLabels"
                  :key="m.index"
                  class="rm-grid-cell"
                  :class="{ 'quarter-start': (m.index - 1) % 3 === 0 }"
                ></div>
                <div
                  class="rm-bar"
                  :class="task.priority"
                  :style="barStyle(task, phase.color)"
                  @click="toggleTask(task.id)"
                >
                  <span class="rm-bar-text">
                    {{ task.duration }}{{ isEn ? 'mo' : 'bln' }}
                  </span>
                </div>
              </div>

              <!-- Panel detail task -->
              <div v-if="expandedTask === task.id" class="rm-task-detail">
                <div class="rm-detail-grid">
                  <div class="rm-detail-block full">
                    <label>{{ t.detailAction }}</label>
                    <p>{{ task.fullAction }}</p>
                  </div>
                  <div class="rm-detail-block">
                    <label>{{ t.detailArea }}</label>
                    <p>{{ task.area }}</p>
                  </div>
                  <div class="rm-detail-block">
                    <label>{{ t.detailOwner }}</label>
                    <p>{{ task.owner }}</p>
                  </div>
                  <div class="rm-detail-block">
                    <label>{{ t.detailWindow }}</label>
                    <p>
                      {{ monthLabels[task.startMonth - 1].label }} –
                      {{ monthLabels[task.endMonth - 1].label }}
                      ({{ t.month }} {{ task.startMonth }}–{{ task.endMonth }})
                    </p>
                  </div>
                  <div class="rm-detail-block">
                    <label>{{ t.detailEffort }}</label>
                    <p>{{ effortLabel(task.effort) }}</p>
                  </div>
                  <div class="rm-detail-block full" v-if="task.regulations.length">
                    <label>{{ t.detailRegs }}</label>
                    <div class="rm-reg-tags">
                      <span v-for="reg in task.regulations" :key="reg" class="rm-reg-tag">
                        {{ reg }}
                      </span>
                    </div>
                  </div>
                  <div class="rm-detail-block full" v-if="blockedBy(task.id)">
                    <label>{{ t.detailDependency }}</label>
                    <p class="rm-dep-note">
                      <i class="fas fa-link me-1"></i>{{ blockedBy(task.id) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- ═══ MODE 2: Kartu per Fase ═══════════════════════════════════════ -->
    <div v-else-if="viewMode === 'phase'" class="rm-phase-view">
      <div
        v-for="phase in roadmap.phases"
        :key="phase.id"
        class="rm-phase-card"
        :style="{ '--phase-color': phase.color }"
      >
        <div class="rm-phase-card-head">
          <div class="rm-phase-badge" :style="{ background: phase.color }">
            {{ t.month }} {{ phase.startMonth }}–{{ phase.endMonth }}
          </div>
          <h4>{{ isEn ? phase.labelEn : phase.labelId }}</h4>
          <p>{{ isEn ? phase.descEn : phase.descId }}</p>
        </div>

        <div class="rm-phase-card-body">
          <div v-if="!tasksByPhase(phase.id).length" class="rm-empty">
            <i class="fas fa-check-circle me-2"></i>{{ t.noTaskPhase }}
          </div>
          <div
            v-for="task in tasksByPhase(phase.id)"
            :key="task.id"
            class="rm-phase-task"
          >
            <div class="rm-phase-task-head">
              <i class="fas" :class="task.icon"></i>
              <strong>{{ task.title }}</strong>
              <span class="rm-crit-chip" :class="critClass(task.criticalityScore)">
                {{ task.criticalityScore }}/10
              </span>
            </div>
            <p class="rm-phase-task-action">{{ task.fullAction }}</p>
            <div class="rm-phase-task-foot">
              <span><i class="fas fa-user-tie me-1"></i>{{ task.owner }}</span>
              <span><i class="fas fa-calendar-alt me-1"></i>{{ t.month }} {{ task.startMonth }}–{{ task.endMonth }}</span>
              <span><i class="fas fa-gauge-high me-1"></i>{{ effortLabel(task.effort) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ MODE 3: Kelompok per Penanggung Jawab ════════════════════════ -->
    <div v-else class="rm-owner-view">
      <div
        v-for="group in ownerGroups"
        :key="group.owner"
        class="rm-owner-card"
      >
        <div class="rm-owner-head">
          <div class="rm-owner-avatar">
            <i class="fas fa-user-tie"></i>
          </div>
          <div>
            <strong>{{ group.owner }}</strong>
            <span>{{ group.count }} {{ t.tasksAssigned }}</span>
          </div>
        </div>
        <ul class="rm-owner-tasks">
          <li v-for="task in group.tasks" :key="task.id">
            <span class="rm-owner-month">M{{ task.startMonth }}</span>
            <span class="rm-owner-task-title">{{ task.title }}</span>
            <span class="rm-prio-chip" :class="task.priority">
              {{ priorityLabel(task.priority) }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- ═══ Disclaimer ═══════════════════════════════════════════════════ -->
    <div class="rm-disclaimer">
      <i class="fas fa-circle-info me-2"></i>
      <span>{{ t.disclaimer }}</span>
    </div>
  </div>
</template>

<script>
import {
  generateRoadmap,
  groupTasksByOwner,
  buildMonthLabels,
} from '../services/roadmapService';

export default {
  name: 'RoadmapTimeline',
  props: {
    findings: { type: Array, required: true },
    isEn: { type: Boolean, default: false },
  },
  data() {
    return {
      viewMode: 'timeline',
      expandedTask: null,
    };
  },
  computed: {
    roadmap() {
      return generateRoadmap(this.findings, { isEn: this.isEn });
    },
    monthLabels() {
      return buildMonthLabels(this.isEn);
    },
    ownerGroups() {
      return groupTasksByOwner(this.roadmap.tasks);
    },
    workloadInsight() {
      const peak = this.roadmap.stats.peakMonth;
      const monthName = this.monthLabels[peak.month - 1].label;
      if (this.isEn) {
        return `Workload peaks in ${monthName} (month ${peak.month}) with ${peak.count} concurrent tasks. `
          + `Consider staggering non-critical items or allocating additional resources for that window. `
          + `${this.roadmap.stats.highEffortCount} tasks are classified as high effort and will require dedicated project management.`;
      }
      return `Beban kerja memuncak pada ${monthName} (bulan ${peak.month}) dengan ${peak.count} task berjalan bersamaan. `
        + `Pertimbangkan menggeser item non-kritis atau menambah sumber daya pada periode tersebut. `
        + `Terdapat ${this.roadmap.stats.highEffortCount} task berkategori upaya tinggi yang memerlukan manajemen proyek tersendiri.`;
    },
    t() {
      const en = this.isEn;
      return {
        title: en ? 'Compliance Execution Roadmap (12 Months)' : 'Roadmap Eksekusi Kepatuhan (12 Bulan)',
        lede: en
          ? 'Every recommendation above has been scheduled into an execution plan based on regulatory priority, criticality score, and implementation effort. Use this as the basis for your compliance program planning and management reporting.'
          : 'Setiap rekomendasi di atas telah dijadwalkan menjadi rencana eksekusi berdasarkan prioritas regulasi, skor kritikalitas, dan upaya implementasi. Gunakan ini sebagai dasar perencanaan program kepatuhan dan pelaporan ke manajemen.',
        viewTimeline: en ? 'Timeline' : 'Timeline',
        viewPhase: en ? 'By Phase' : 'Per Fase',
        viewOwner: en ? 'By Team' : 'Per Tim',
        statTotal: en ? 'Total Tasks' : 'Total Task',
        statImmediate: en ? 'Immediate' : 'Segera',
        statCritical: en ? 'High Criticality' : 'Kritikalitas Tinggi',
        statTeams: en ? 'Teams Involved' : 'Tim Terlibat',
        statPeak: en ? 'Peak Load' : 'Beban Puncak',
        colTask: en ? 'Task & Priority' : 'Task & Prioritas',
        month: en ? 'Month' : 'Bulan',
        tasks: en ? 'tasks' : 'task',
        tasksAssigned: en ? 'tasks assigned' : 'task ditugaskan',
        noTaskPhase: en ? 'No tasks scheduled in this phase.' : 'Tidak ada task yang dijadwalkan pada fase ini.',
        detailAction: en ? 'Full Action Description' : 'Deskripsi Tindakan Lengkap',
        detailArea: en ? 'Compliance Area' : 'Area Kepatuhan',
        detailOwner: en ? 'Responsible Party' : 'Penanggung Jawab',
        detailWindow: en ? 'Execution Window' : 'Jendela Eksekusi',
        detailEffort: en ? 'Implementation Effort' : 'Upaya Implementasi',
        detailRegs: en ? 'Regulatory Basis' : 'Dasar Regulasi',
        detailDependency: en ? 'Dependency' : 'Ketergantungan',
        disclaimer: en
          ? 'This roadmap is an educational estimate generated from your scenario parameters. Actual timelines depend on organizational capacity, budget, and vendor availability. Validate with your compliance and internal audit functions before adoption.'
          : 'Roadmap ini merupakan estimasi edukatif yang dihasilkan dari parameter skenario Anda. Timeline aktual bergantung pada kapasitas organisasi, anggaran, dan ketersediaan vendor. Validasikan dengan fungsi kepatuhan dan audit internal sebelum diadopsi.',
        prioImmediate: en ? 'IMMEDIATE' : 'SEGERA',
        prioShort: en ? 'SHORT TERM' : 'JANGKA PENDEK',
        prioMedium: en ? 'MID TERM' : 'JANGKA MENENGAH',
        effortLow: en ? 'Low' : 'Rendah',
        effortMedium: en ? 'Medium' : 'Sedang',
        effortHigh: en ? 'High' : 'Tinggi',
        depNote: en
          ? 'Requires the governance policy task to be completed or running in parallel.'
          : 'Memerlukan task kebijakan tata kelola diselesaikan atau berjalan paralel.',
      };
    },
  },
  methods: {
    tasksByPhase(phaseId) {
      return this.roadmap.tasks
        .filter((t) => t.phaseId === phaseId)
        .sort((a, b) => a.startMonth - b.startMonth || b.criticalityScore - a.criticalityScore);
    },
    toggleTask(id) {
      this.expandedTask = this.expandedTask === id ? null : id;
    },
    barStyle(task, phaseColor) {
      const cellWidth = 100 / 12;
      return {
        left: `${(task.startMonth - 1) * cellWidth}%`,
        width: `${task.duration * cellWidth}%`,
        background: phaseColor,
      };
    },
    priorityLabel(priority) {
      const map = {
        immediate: this.t.prioImmediate,
        short: this.t.prioShort,
        medium: this.t.prioMedium,
      };
      return map[priority] || priority;
    },
    effortLabel(effort) {
      const map = {
        low: this.t.effortLow,
        medium: this.t.effortMedium,
        high: this.t.effortHigh,
      };
      return map[effort] || effort;
    },
    critClass(score) {
      if (score >= 8) return 'high';
      if (score >= 6) return 'mid';
      return 'low';
    },
    blockedBy(taskId) {
      const dep = this.roadmap.dependencies.find((d) => d.to === taskId);
      return dep ? this.t.depNote : null;
    },
  },
};
</script>

<style scoped>
/* ═══ Wrapper ═══════════════════════════════════════════════════════════ */
.rm-wrapper {
  border-radius: 20px;
  border: 1px solid var(--line, rgba(19, 34, 56, 0.1));
  background: rgba(255, 255, 255, 0.75);
  padding: 1.5rem;
  margin-top: 1.5rem;
}
[data-bs-theme="dark"] .rm-wrapper {
  background: rgba(30, 41, 59, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
}

/* ═══ Header ════════════════════════════════════════════════════════════ */
.rm-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}
.rm-head-left { flex: 1; min-width: 260px; }
.rm-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--ink, #132238);
}
.rm-lede {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--muted, #5c6776);
  margin: 0;
  max-width: 68ch;
}

/* ═══ View Switcher ═════════════════════════════════════════════════════ */
.rm-view-switch {
  display: flex;
  gap: 0.35rem;
  background: rgba(0, 0, 0, 0.04);
  padding: 0.3rem;
  border-radius: 12px;
  flex-shrink: 0;
}
[data-bs-theme="dark"] .rm-view-switch { background: rgba(255, 255, 255, 0.06); }
.rm-switch-btn {
  border: none;
  background: transparent;
  padding: 0.45rem 0.85rem;
  border-radius: 9px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--muted, #5c6776);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.rm-switch-btn:hover { color: var(--ink, #132238); }
.rm-switch-btn.active {
  background: #fff;
  color: #2563eb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
[data-bs-theme="dark"] .rm-switch-btn.active {
  background: rgba(30, 41, 59, 0.95);
  color: #60a5fa;
}

/* ═══ Statistik ═════════════════════════════════════════════════════════ */
.rm-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.rm-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.85rem 0.5rem;
  border-radius: 12px;
  border: 1px solid var(--line, rgba(19, 34, 56, 0.1));
  background: rgba(255, 255, 255, 0.7);
}
[data-bs-theme="dark"] .rm-stat {
  background: rgba(15, 23, 42, 0.5);
  border-color: rgba(255, 255, 255, 0.08);
}
.rm-stat.urgent { border-color: rgba(220, 38, 38, 0.3); }
.rm-stat.critical { border-color: rgba(234, 88, 12, 0.3); }
.rm-stat-num {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
  color: var(--ink, #132238);
}
.rm-stat.urgent .rm-stat-num { color: #dc2626; }
.rm-stat.critical .rm-stat-num { color: #ea580c; }
.rm-stat-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
  color: var(--muted, #5c6776);
  text-align: center;
}

/* ═══ Insight ═══════════════════════════════════════════════════════════ */
.rm-insight {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: rgba(37, 99, 235, 0.07);
  border: 1px solid rgba(37, 99, 235, 0.18);
  margin-bottom: 1.25rem;
}
.rm-insight i { color: #2563eb; margin-top: 0.15rem; flex-shrink: 0; }
.rm-insight p {
  margin: 0;
  font-size: 0.83rem;
  line-height: 1.6;
  color: var(--ink, #132238);
}

/* ═══ Legenda ═══════════════════════════════════════════════════════════ */
.rm-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.85rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px dashed var(--line, rgba(19, 34, 56, 0.1));
}
.rm-legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--muted, #5c6776);
}
.rm-legend-dot {
  width: 11px;
  height: 11px;
  border-radius: 3px;
  flex-shrink: 0;
}

/* ═══ Gantt ═════════════════════════════════════════════════════════════ */
.rm-gantt-scroll { overflow-x: auto; }
.rm-gantt { min-width: 860px; }

.rm-gantt-header {
  display: flex;
  border-bottom: 2px solid var(--line, rgba(19, 34, 56, 0.12));
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 2;
}
.rm-gantt-label-col {
  width: 320px;
  flex-shrink: 0;
  padding: 0.6rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted, #5c6776);
}
.rm-gantt-months {
  flex: 1;
  display: flex;
  position: relative;
  min-height: 100%;
}
.rm-month-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0;
  border-left: 1px solid var(--line, rgba(19, 34, 56, 0.07));
}
.rm-month-cell.quarter-start {
  border-left: 2px solid var(--line, rgba(19, 34, 56, 0.18));
}
.rm-month-name {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--ink, #132238);
}
.rm-month-num {
  font-size: 0.6rem;
  color: var(--muted, #5c6776);
}

/* Divider Fase */
.rm-phase-divider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.6rem 0.75rem;
  margin-top: 0.5rem;
  background: rgba(0, 0, 0, 0.03);
  border-left: 4px solid;
  font-size: 0.8rem;
  color: var(--ink, #132238);
}
[data-bs-theme="dark"] .rm-phase-divider { background: rgba(255, 255, 255, 0.04); }
.rm-phase-months,
.rm-phase-count {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--muted, #5c6776);
  padding: 0.12rem 0.5rem;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.05);
}
[data-bs-theme="dark"] .rm-phase-months,
[data-bs-theme="dark"] .rm-phase-count { background: rgba(255, 255, 255, 0.08); }

/* Baris Task */
.rm-gantt-row {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--line, rgba(19, 34, 56, 0.06));
  transition: background 0.18s ease;
}
.rm-gantt-row:hover { background: rgba(37, 99, 235, 0.035); }
.rm-gantt-row.is-open { background: rgba(37, 99, 235, 0.05); }
.rm-gantt-row .rm-gantt-label-col {
  padding: 0.7rem 0.75rem;
  text-transform: none;
  letter-spacing: normal;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.rm-task-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.rm-task-label i {
  color: #2563eb;
  font-size: 0.78rem;
  margin-top: 0.18rem;
  flex-shrink: 0;
}
.rm-task-name {
  font-size: 0.79rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--ink, #132238);
}
.rm-task-meta { display: flex; gap: 0.35rem; flex-wrap: wrap; padding-left: 1.3rem; }

.rm-prio-chip {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  padding: 0.15rem 0.42rem;
  border-radius: 5px;
  white-space: nowrap;
}
.rm-prio-chip.immediate { background: rgba(220, 38, 38, 0.13); color: #b91c1c; }
.rm-prio-chip.short { background: rgba(234, 88, 12, 0.13); color: #c2410c; }
.rm-prio-chip.medium { background: rgba(202, 138, 4, 0.13); color: #a16207; }
[data-bs-theme="dark"] .rm-prio-chip.immediate { background: rgba(220, 38, 38, 0.22); color: #fca5a5; }
[data-bs-theme="dark"] .rm-prio-chip.short { background: rgba(234, 88, 12, 0.22); color: #fdba74; }
[data-bs-theme="dark"] .rm-prio-chip.medium { background: rgba(202, 138, 4, 0.22); color: #fde047; }

.rm-crit-chip {
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.15rem 0.42rem;
  border-radius: 5px;
  white-space: nowrap;
}
.rm-crit-chip.high { background: rgba(220, 38, 38, 0.13); color: #b91c1c; }
.rm-crit-chip.mid { background: rgba(202, 138, 4, 0.13); color: #a16207; }
.rm-crit-chip.low { background: rgba(22, 163, 74, 0.13); color: #15803d; }
[data-bs-theme="dark"] .rm-crit-chip.high { background: rgba(220, 38, 38, 0.22); color: #fca5a5; }
[data-bs-theme="dark"] .rm-crit-chip.mid { background: rgba(202, 138, 4, 0.22); color: #fde047; }
[data-bs-theme="dark"] .rm-crit-chip.low { background: rgba(22, 163, 74, 0.22); color: #86efac; }

/* Grid & Bar */
.rm-grid-cell {
  flex: 1;
  border-left: 1px solid var(--line, rgba(19, 34, 56, 0.05));
}
.rm-grid-cell.quarter-start {
  border-left: 2px solid var(--line, rgba(19, 34, 56, 0.13));
}
.rm-bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 24px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.18s ease, transform 0.18s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.14);
  min-width: 34px;
}
.rm-bar:hover {
  filter: brightness(1.1);
  transform: translateY(-50%) scale(1.02);
}
.rm-bar-text {
  font-size: 0.62rem;
  font-weight: 800;
  color: #fff;
  white-space: nowrap;
  padding: 0 0.3rem;
}

/* Detail Task */
.rm-task-detail {
  width: 100%;
  padding: 0.25rem 0.75rem 1rem;
  border-top: 1px dashed var(--line, rgba(19, 34, 56, 0.12));
  margin-top: 0.25rem;
}
.rm-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 0.85rem;
  padding-top: 0.85rem;
}
.rm-detail-block.full { grid-column: 1 / -1; }
.rm-detail-block label {
  display: block;
  font-size: 0.64rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted, #5c6776);
  margin-bottom: 0.28rem;
}
.rm-detail-block p {
  margin: 0;
  font-size: 0.81rem;
  line-height: 1.55;
  color: var(--ink, #132238);
}
.rm-dep-note {
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
  background: rgba(202, 138, 4, 0.1);
  border-left: 3px solid #ca8a04;
  font-size: 0.78rem !important;
}
.rm-reg-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.rm-reg-tag {
  font-size: 0.66rem;
  font-weight: 600;
  padding: 0.18rem 0.48rem;
  border-radius: 5px;
  background: rgba(37, 99, 235, 0.1);
  color: #1d4ed8;
  border: 1px solid rgba(37, 99, 235, 0.16);
}
[data-bs-theme="dark"] .rm-reg-tag {
  background: rgba(37, 99, 235, 0.2);
  color: #93c5fd;
}

/* ═══ MODE Fase ═════════════════════════════════════════════════════════ */
.rm-phase-view {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}
.rm-phase-card {
  border-radius: 16px;
  border: 1px solid var(--line, rgba(19, 34, 56, 0.1));
  border-top: 4px solid var(--phase-color);
  background: rgba(255, 255, 255, 0.7);
  overflow: hidden;
}
[data-bs-theme="dark"] .rm-phase-card {
  background: rgba(15, 23, 42, 0.5);
  border-color: rgba(255, 255, 255, 0.08);
  border-top-color: var(--phase-color);
}
.rm-phase-card-head {
  padding: 1rem 1.1rem 0.85rem;
  border-bottom: 1px solid var(--line, rgba(19, 34, 56, 0.08));
}
.rm-phase-badge {
  display: inline-block;
  font-size: 0.64rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  padding: 0.22rem 0.6rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
.rm-phase-card-head h4 {
  font-size: 0.98rem;
  font-weight: 700;
  margin: 0 0 0.35rem;
  color: var(--ink, #132238);
}
.rm-phase-card-head p {
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--muted, #5c6776);
  margin: 0;
}
.rm-phase-card-body { padding: 0.85rem 1.1rem 1.1rem; }
.rm-empty {
  font-size: 0.8rem;
  color: #16a34a;
  padding: 0.6rem 0;
}
.rm-phase-task {
  padding: 0.75rem 0;
  border-bottom: 1px dashed var(--line, rgba(19, 34, 56, 0.1));
}
.rm-phase-task:last-child { border-bottom: none; }
.rm-phase-task-head {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  flex-wrap: wrap;
  margin-bottom: 0.35rem;
}
.rm-phase-task-head i { color: #2563eb; font-size: 0.76rem; margin-top: 0.2rem; }
.rm-phase-task-head strong {
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--ink, #132238);
  flex: 1;
  min-width: 140px;
}
.rm-phase-task-action {
  font-size: 0.78rem;
  line-height: 1.55;
  color: var(--muted, #5c6776);
  margin: 0 0 0.45rem;
  padding-left: 1.2rem;
}
.rm-phase-task-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-left: 1.2rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--muted, #5c6776);
}

/* ═══ MODE Owner ════════════════════════════════════════════════════════ */
.rm-owner-view {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
.rm-owner-card {
  border-radius: 16px;
  border: 1px solid var(--line, rgba(19, 34, 56, 0.1));
  background: rgba(255, 255, 255, 0.7);
  padding: 1rem 1.1rem;
}
[data-bs-theme="dark"] .rm-owner-card {
  background: rgba(15, 23, 42, 0.5);
  border-color: rgba(255, 255, 255, 0.08);
}
.rm-owner-head {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--line, rgba(19, 34, 56, 0.08));
  margin-bottom: 0.75rem;
}
.rm-owner-avatar {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: rgba(37, 99, 235, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  flex-shrink: 0;
}
.rm-owner-head strong {
  display: block;
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--ink, #132238);
  line-height: 1.3;
}
.rm-owner-head span {
  font-size: 0.7rem;
  color: var(--muted, #5c6776);
}
.rm-owner-tasks { list-style: none; padding: 0; margin: 0; }
.rm-owner-tasks li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--line, rgba(19, 34, 56, 0.08));
  flex-wrap: wrap;
}
.rm-owner-tasks li:last-child { border-bottom: none; }
.rm-owner-month {
  font-size: 0.64rem;
  font-weight: 800;
  padding: 0.15rem 0.4rem;
  border-radius: 5px;
  background: rgba(37, 99, 235, 0.1);
  color: #1d4ed8;
  flex-shrink: 0;
}
[data-bs-theme="dark"] .rm-owner-month {
  background: rgba(37, 99, 235, 0.2);
  color: #93c5fd;
}
.rm-owner-task-title {
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--ink, #132238);
  flex: 1;
  min-width: 130px;
}

/* ═══ Disclaimer ════════════════════════════════════════════════════════ */
.rm-disclaimer {
  display: flex;
  gap: 0.4rem;
  align-items: flex-start;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--line, rgba(19, 34, 56, 0.1));
  font-size: 0.73rem;
  line-height: 1.55;
  color: var(--muted, #5c6776);
}

/* ═══ Responsif ═════════════════════════════════════════════════════════ */
@media (max-width: 767.98px) {
  .rm-wrapper { padding: 1.1rem; border-radius: 16px; }
  .rm-head { flex-direction: column; }
  .rm-view-switch { width: 100%; }
  .rm-switch-btn { flex: 1; text-align: center; padding: 0.45rem 0.4rem; }
  .rm-gantt-label-col { width: 200px; }
  .rm-gantt { min-width: 720px; }
  .rm-title { font-size: 1.15rem; }
}

/* ═══ Print ═════════════════════════════════════════════════════════════ */
@media print {
  .rm-view-switch { display: none; }
  .rm-gantt-scroll { overflow: visible; }
  .rm-wrapper { border: none; padding: 0; }
}
</style>
