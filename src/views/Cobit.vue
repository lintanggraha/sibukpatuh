<template>
  <div class="cob-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading COBIT 2019 data...</p>
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
    <div v-else class="cob-shell">
      <section class="cob-hero">
        <div>
          <span class="cob-kicker"
            ><i class="fas fa-project-diagram"></i>Framework Studio</span
          >
          <h1 class="cob-title">
            COBIT 2019 Introduction & Methodology Navigator
          </h1>
          <p class="cob-lede">
            Ringkasan berbahasa Indonesia untuk membaca prinsip, design factor,
            core model, dan alur implementasi COBIT 2019 dengan lebih cepat.
          </p>
          <div class="cob-disclaimer-banner">
            <div class="cob-disclaimer-icon"><i class="fas fa-info-circle"></i></div>
            <div class="cob-disclaimer-content">
              <strong>Disclaimer:</strong>
              <span>Konten ini adalah ringkasan edukatif berdasarkan interpretasi dari framework COBIT 2019 yang diterbitkan oleh ISACA. Ini <b>bukan</b> teks resmi COBIT dan tidak boleh dianggap sebagai pengganti standar asli. Untuk akses lengkap dan lisensi resmi, silakan kunjungi <a href="https://www.isaca.org/resources/cobit" target="_blank" rel="noopener noreferrer">ISACA.org</a>. Penggunaan konten ini sepenuhnya untuk tujuan edukasi dan referensi internal.</span>
            </div>
          </div>
          <div class="cob-metrics">
            <div class="cob-metric">
              <label>Bab Utama</label><strong>{{ totalChapters }}</strong
              ><span>Fondasi, objective, tailoring, dan implementasi.</span>
            </div>
            <div class="cob-metric">
              <label>Prinsip</label><strong>{{ totalPrinciples }}</strong
              ><span>Prinsip sistem dan prinsip framework.</span>
            </div>
            <div class="cob-metric">
              <label>Design Factor</label
              ><strong>{{ totalDesignFactors }}</strong
              ><span>Variabel konteks untuk desain governance.</span>
            </div>
            <div class="cob-metric">
              <label>Objektif Core Model</label
              ><strong>{{ totalObjectives }}</strong
              ><span>1 domain governance dan 4 domain management.</span>
            </div>
          </div>
        </div>
        <div class="cob-grid">
          <div class="cob-side">
            <label>Cara Baca</label>
            <h3>Mulai dari konteks, lalu masuk ke objective</h3>
            <p>
              Baca ringkasan bab dan value outcome dulu, lalu masuk ke design
              factor, domain objective, dan fase implementasi sesuai kebutuhan
              enterprise.
            </p>
          </div>
          <div class="cob-side">
            <label>Nilai Utama</label>
            <p>
              COBIT membantu memastikan informasi dan teknologi tetap nyambung
              ke nilai bisnis, risiko, resource, dan akuntabilitas lintas
              fungsi.
            </p>
          </div>
        </div>
      </section>

      <div class="cob-nav nav" role="tablist">
        <button
          class="cob-tab"
          :class="{ active: activeTab === 'overview' }"
          type="button"
          role="tab"
          @click="activeTab = 'overview'"
        >
          <i class="fas fa-chart-line"></i
          ><span
            ><strong>Ringkasan Framework</strong
            ><span>Bab, outcome, domain, dan sorotan COBIT 2019.</span></span
          >
        </button>
        <button
          class="cob-tab"
          :class="{ active: activeTab === 'explorer' }"
          type="button"
          role="tab"
          @click="activeTab = 'explorer'"
        >
          <i class="fas fa-sliders-h"></i
          ><span
            ><strong>Eksplorasi</strong
            ><span
              >Filter prinsip, komponen, design factor, domain, dan fase
              implementasi.</span
            ></span
          >
        </button>
        <button
          class="cob-tab"
          :class="{ active: activeTab === 'journey' }"
          type="button"
          role="tab"
          @click="activeTab = 'journey'"
        >
          <i class="fas fa-road"></i
          ><span
            ><strong>Desain & Implementasi</strong
            ><span
              >Goals cascade, fase implementasi, dan tailoring factor.</span
            ></span
          >
        </button>
      </div>

      <div class="tab-content cob-grid">
        <!-- Tab 1: Ringkasan Framework -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="cob-two">
            <article class="cob-panel">
              <div class="cob-head">
                <h3>Roadmap isi dokumen</h3>
                <span class="cob-chip">{{ totalChapters }} bab</span>
              </div>
              <p class="cob-copy">
                Urutan dokumen bergerak dari fondasi konsep, ke objective inti,
                lalu ke desain dan implementasi governance system.
              </p>
              <div class="cob-grid">
                <div
                  v-for="chapter in chapters"
                  :key="chapter.number"
                  class="cob-bar"
                >
                  <span
                    ><strong
                      >Bab {{ chapter.number }} - {{ chapter.title }}</strong
                    ><em>{{ chapter.summary }}</em></span
                  >
                  <span class="cob-track"
                    ><b
                      :style="{
                        width:
                          (chapter.number / Math.max(totalChapters, 1)) * 100 +
                          '%',
                        background: chapter.color,
                      }"
                    ></b
                  ></span>
                  <span class="cob-num">{{ chapter.number }}</span>
                </div>
              </div>
            </article>
            <article class="cob-panel">
              <div class="cob-head">
                <h3>Core model per domain</h3>
                <span class="cob-chip">{{ totalObjectives }} objective</span>
              </div>
              <p class="cob-copy">
                Klik domain untuk membuka penjelasannya langsung di explorer.
              </p>
              <div class="cob-domains">
                <button
                  v-for="domain in domains"
                  :key="domain.id"
                  type="button"
                  class="cob-card clickable"
                  @click="jumpExplorer('domain', domain.id)"
                >
                  <div class="cob-card-top">
                    <span>{{ domain.group }}</span
                    ><span>{{ domain.count }} objective</span>
                  </div>
                  <strong>{{ domain.id }} - {{ domain.title }}</strong>
                  <p>{{ domain.summary }}</p>
                  <span class="cob-track mt-2"
                    ><b
                      :style="{
                        width: (domain.count / maxObjectiveCount) * 100 + '%',
                        background: domain.color,
                      }"
                    ></b
                  ></span>
                </button>
              </div>
            </article>
          </div>
          <div class="cob-two">
            <article class="cob-panel">
              <div class="cob-head">
                <h3>Value outcome</h3>
                <span class="cob-chip">{{ valueOutcomes.length }} outcome</span>
              </div>
              <p class="cob-copy">
                COBIT menjaga tiga hasil utama tetap seimbang: manfaat, risiko,
                dan resource.
              </p>
              <div class="cob-mini">
                <div
                  v-for="item in valueOutcomes"
                  :key="item.id"
                  class="cob-step"
                >
                  <label>{{ item.id }}</label
                  ><strong>{{ item.title }}</strong>
                  <p>{{ item.summary }}</p>
                </div>
              </div>
              <div class="cob-note mt-3">
                <strong>Governance vs management</strong>
                <div class="mt-2">
                  Governance fokus pada evaluasi, pengarahan, dan pemantauan.
                  Management fokus pada perencanaan, pembangunan, operasi, dan
                  evaluasi kerja.
                </div>
              </div>
            </article>
            <article class="cob-panel">
              <div class="cob-head">
                <h3>Sorotan COBIT 2019</h3>
                <span class="cob-chip">{{ highlights.length }} poin</span>
              </div>
              <div class="cob-cards">
                <div v-for="item in highlights" :key="item.id" class="cob-card">
                  <div class="cob-card-top">
                    <span>Highlight</span><span>{{ item.id }}</span>
                  </div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.summary }}</p>
                </div>
              </div>
              <div class="cob-cards mt-3">
                <div v-for="item in audiences" :key="item.id" class="cob-card">
                  <div class="cob-card-top">
                    <span>Audience</span><span>{{ item.id }}</span>
                  </div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.summary }}</p>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 2: Eksplorasi -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="cob-workspace">
            <article class="cob-panel">
              <div class="cob-head">
                <h3>Filter Konsep</h3>
                <span class="cob-chip">{{ concepts.length }} entri</span>
              </div>
              <div class="cob-type-grid">
                <button
                  v-for="item in typeBreakdown"
                  :key="item.type"
                  type="button"
                  class="cob-type-card"
                  :class="{ active: activeType === item.type }"
                  @click="toggleType(item.type)"
                >
                  <strong>{{ item.label }}</strong
                  ><span>{{ item.count }} entri - {{ item.summary }}</span>
                </button>
              </div>
              <div class="cob-form">
                <div>
                  <label for="conceptSearch">Cari konsep</label
                  ><input
                    id="conceptSearch"
                    v-model="conceptSearch"
                    type="search"
                    class="form-control"
                    placeholder="Cari ID, judul, grup, ringkasan, atau fokus"
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="resetConceptFilters"
                >
                  Atur ulang filter
                </button>
              </div>
              <div class="cob-summary">
                <small>Konsep Ditampilkan</small
                ><strong>{{ filteredConcepts.length }}</strong
                ><span>{{
                  filteredConcepts.length
                    ? `Menampilkan ${filteredConcepts.length} konsep COBIT 2019 sesuai filter aktif.`
                    : "Tidak ada konsep yang cocok dengan filter saat ini."
                }}</span>
              </div>
            </article>
            <article class="cob-panel">
              <div class="cob-head">
                <h3>Daftar konsep</h3>
                <span class="cob-chip"
                  >{{ filteredConcepts.length }} entri</span
                >
              </div>
              <div class="cob-list">
                <button
                  v-for="concept in paginatedConcepts"
                  :key="concept.id"
                  type="button"
                  class="cob-item"
                  :class="{ active: activeConceptId === concept.id }"
                  :style="{ '--accent': concept.color || '#0f766e' }"
                  @click="setActiveConcept(concept.id)"
                >
                  <div class="cob-item-top">
                    <span class="cob-code">{{ concept.id }}</span
                    ><span class="cob-pill">{{
                      concept.type_label || "-"
                    }}</span>
                  </div>
                  <div class="cob-item-name">{{ concept.title || "-" }}</div>
                  <div class="cob-item-meta">
                    {{ concept.group || "-"
                    }}{{
                      concept.metric_value !== null &&
                      concept.metric_value !== undefined
                        ? ` • ${concept.metric_label || "Nilai"}: ${concept.metric_value}`
                        : ""
                    }}
                  </div>
                </button>
                <div v-if="paginatedConcepts.length === 0" class="cob-empty">
                  Tidak ada konsep yang cocok dengan filter saat ini.
                </div>
                <!-- Pagination Controls -->
                <div v-if="totalPages > 1" class="cob-pagination">
                  <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="btn btn-sm btn-outline-secondary me-2"><i class="fas fa-chevron-left"></i> Previous</button>
                  <span class="cob-page-info">Page {{ currentPage }} of {{ totalPages }} ({{ filteredConcepts.length }} total)</span>
                  <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-sm btn-outline-secondary ms-2">Next <i class="fas fa-chevron-right"></i></button>
                </div>
              </div>
            </article>
            <article class="cob-panel cob-inspector">
              <div class="cob-inspector-head">
                <small>Concept Inspector</small>
                <strong>{{ activeConcept ? activeConcept.id : "-" }}</strong>
                <span>{{
                  activeConcept
                    ? activeConcept.title
                    : "Pilih konsep untuk membaca detail."
                }}</span>
              </div>
              <div class="cob-inspector-body">
                <div class="cob-meta">
                  <span>{{
                    activeConcept ? activeConcept.type_label : "-"
                  }}</span>
                  <span>{{ activeConcept ? activeConcept.group : "-" }}</span>
                  <span>{{
                    activeConcept &&
                    activeConcept.metric_label &&
                    activeConcept.metric_value !== null
                      ? `${activeConcept.metric_label}: ${activeConcept.metric_value}`
                      : "Ringkasan Konseptual"
                  }}</span>
                </div>
                <div class="cob-callout">
                  <strong>Ringkasan</strong>
                  <div class="mt-2">
                    {{
                      activeConcept
                        ? activeConcept.summary
                        : "Pilih konsep untuk membaca ringkasan."
                    }}
                  </div>
                </div>
                <div class="cob-note">
                  <strong>Kenapa Penting</strong>
                  <div class="mt-2">
                    {{ activeConcept ? activeConcept.importance : "-" }}
                  </div>
                </div>
                <div class="cob-callout">
                  <strong>Fokus Utama</strong>
                  <ul class="cob-plain">
                    <li
                      v-for="(item, idx) in activeConcept &&
                      activeConcept.focus &&
                      activeConcept.focus.length
                        ? activeConcept.focus
                        : ['Tidak ada fokus tambahan yang dipetakan.']"
                      :key="idx"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 3: Desain & Implementasi -->
        <div v-if="activeTab === 'journey'" key="journey-tab">
          <div class="cob-two">
            <article class="cob-panel">
              <div class="cob-head">
                <h3>Goals cascade</h3>
                <span class="cob-chip">{{ goalCascade.length }} langkah</span>
              </div>
              <div class="cob-cards">
                <div
                  v-for="item in goalCascade"
                  :key="item.id"
                  class="cob-step"
                >
                  <label>{{ item.id }}</label
                  ><strong>{{ item.title }}</strong>
                  <p>{{ item.summary }}</p>
                </div>
              </div>
            </article>
            <article class="cob-panel">
              <div class="cob-head">
                <h3>Fase implementasi</h3>
                <span class="cob-chip"
                  >{{ implementationPhases.length }} fase</span
                >
              </div>
              <div class="cob-grid">
                <button
                  v-for="item in implementationPhases"
                  :key="item.id"
                  type="button"
                  class="cob-step"
                  @click="jumpExplorer('implementation_phase', item.id)"
                >
                  <label>{{ item.group }}</label
                  ><strong>{{ item.title }}</strong>
                  <p>{{ item.summary }}</p>
                </button>
              </div>
            </article>
          </div>
          <article class="cob-panel">
            <div class="cob-head">
              <h3>Design factor untuk tailoring governance</h3>
              <span class="cob-chip">{{ designFactors.length }} faktor</span>
            </div>
            <p class="cob-copy">
              Klik salah satu design factor untuk membuka penjelasannya langsung
              di explorer.
            </p>
            <div class="cob-factor-grid">
              <button
                v-for="item in designFactors"
                :key="item.id"
                type="button"
                class="cob-card clickable"
                @click="jumpExplorer('design_factor', item.id)"
              >
                <div class="cob-card-top">
                  <span>{{ item.group }}</span
                  ><span>{{ item.id }}</span>
                </div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.summary }}</p>
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Cobit",
  data() {
    return {
      loading: true,
      error: null,
      activeTab: "overview",
      concepts: [],
      chapters: [],
      domains: [],
      valueOutcomes: [],
      highlights: [],
      audiences: [],
      goalCascade: [],
      implementationPhases: [],
      designFactors: [],
      typeMeta: {
        system_principle: {
          label: "Prinsip Sistem",
          summary: "Fondasi governance system.",
        },
        framework_principle: {
          label: "Prinsip Framework",
          summary: "Karakter utama COBIT sebagai framework.",
        },
        component: {
          label: "Komponen",
          summary: "Elemen yang membuat governance hidup.",
        },
        design_factor: {
          label: "Design Factor",
          summary: "Variabel konteks untuk tailoring.",
        },
        domain: {
          label: "Domain Core Model",
          summary: "Objective governance dan management.",
        },
        implementation_phase: {
          label: "Fase Implementasi",
          summary: "Perjalanan adopsi COBIT.",
        },
      },
      activeType: "",
      conceptSearch: "",
      activeConceptId: null,
      // Pagination
      currentPage: 1,
      itemsPerPage: 25,
    };
  },
  computed: {
    totalChapters() {
      return this.chapters.length;
    },
    totalPrinciples() {
      return this.concepts.filter(
        (c) =>
          c.type === "system_principle" || c.type === "framework_principle",
      ).length;
    },
    totalDesignFactors() {
      return this.designFactors.length;
    },
    totalObjectives() {
      return this.domains.reduce((sum, d) => sum + d.count, 0);
    },
    maxObjectiveCount() {
      return Math.max(...this.domains.map((d) => d.count), 1);
    },
    typeBreakdown() {
      return Object.entries(this.typeMeta)
        .map(([type, meta]) => ({
          type,
          label: meta.label,
          summary: meta.summary,
          count: this.concepts.filter((c) => c.type === type).length,
        }))
        .filter((item) => item.count > 0);
    },
    filteredConcepts() {
      const query = (this.conceptSearch || "").trim().toLowerCase();
      return this.concepts.filter((concept) => {
        if (this.activeType && concept.type !== this.activeType) return false;
        if (!query) return true;
        return [
          concept.id,
          concept.type_label,
          concept.group,
          concept.title,
          concept.summary,
          concept.importance,
          ...(concept.focus || []),
          ...(concept.details || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
    },
    activeConcept() {
      return this.concepts.find((c) => c.id === this.activeConceptId) || null;
    },
    // Pagination computed properties
    totalPages() { return Math.ceil(this.filteredConcepts.length / this.itemsPerPage); },
    paginatedConcepts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredConcepts.slice(start, end);
    },
  },
  watch: {
    filteredConcepts() {
      this.currentPage = 1;
      if (this.paginatedConcepts.length && !this.paginatedConcepts.find(c => c.id === this.activeConceptId)) {
        this.activeConceptId = this.paginatedConcepts[0]?.id || null;
      }
    },
  },
  methods: {
    toggleType(type) {
      this.activeType = this.activeType === type ? "" : type;
    },
    resetConceptFilters() {
      this.activeType = "";
      this.conceptSearch = "";
      this.currentPage = 1;
      if (this.concepts.length > 0) {
        this.activeConceptId =
          this.filteredConcepts[0]?.id || this.concepts[0]?.id;
      }
    },
    setActiveConcept(id) {
      this.activeConceptId = id;
    },
    jumpExplorer(type = "", id = null) {
      this.activeType = type || "";
      this.conceptSearch = "";
      this.activeTab = "explorer";
      if (id) {
        this.setActiveConcept(id);
      }
    },
    retryLoad() {
      this.loadData();
    },
    async loadData() {
      try {
        this.loading = true;
        this.error = null;
        const response = await fetch("/data/cobit_2019.json");
        if (response.ok) {
          const data = await response.json();
          this.chapters = data.chapters || [];
          this.domains = data.domains || [];
          this.valueOutcomes = data.value_outcomes || [];
          this.highlights = data.highlights || [];
          this.audiences = data.audiences || [];
          this.goalCascade = data.goal_cascade || [];
          this.implementationPhases = data.implementation_phases || [];
          this.designFactors = data.design_factors || [];

          // Combine all concept types into concepts array
          const allConcepts = [
            ...(data.principles_system || []).map((c) => ({
              ...c,
              type: "system_principle",
              type_label: "Prinsip Sistem",
            })),
            ...(data.principles_framework || []).map((c) => ({
              ...c,
              type: "framework_principle",
              type_label: "Prinsip Framework",
            })),
            ...(data.components || []).map((c) => ({
              ...c,
              type: "component",
              type_label: "Komponen",
            })),
            ...(data.design_factors || []).map((c) => ({
              ...c,
              type: "design_factor",
              type_label: "Design Factor",
            })),
            ...(data.domains || []).map((c) => ({
              ...c,
              type: "domain",
              type_label: "Domain Core Model",
            })),
            ...(data.implementation_phases || []).map((c) => ({
              ...c,
              type: "implementation_phase",
              type_label: "Fase Implementasi",
            })),
          ];
          this.concepts = allConcepts;
          if (this.concepts.length > 0) {
            this.activeConceptId = this.concepts[0].id;
          }
        } else {
          throw new Error(`Failed to load COBIT data: HTTP ${response.status}`);
        }
      } catch (error) {
        console.error("Error loading COBIT 2019 data:", error);
        this.error = error.message || "Failed to load data";
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style scoped>
.cob-page {
  --ink: #14263b;
  --muted: #5c6776;
  --line: rgba(20, 38, 59, 0.1);
  background: linear-gradient(180deg, #f6efe4 0%, #edf5f6 100%);
  padding: 0.25rem;
  border-radius: 32px;
  color: var(--ink);
}
.cob-shell,
.cob-grid {
  display: grid;
  gap: 1rem;
}
.cob-hero {
  display: grid;
  grid-template-columns: 1.6fr 0.9fr;
  gap: 1rem;
  align-items: stretch;
  min-height: 368px;
  padding: 1.15rem;
  border-radius: 28px;
  background:
    radial-gradient(
      circle at top right,
      rgba(248, 214, 161, 0.88),
      transparent 30%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(156, 210, 219, 0.7),
      transparent 28%
    ),
    linear-gradient(135deg, #132a43 0%, #1d5671 46%, #f2debb 100%);
  box-shadow: 0 20px 44px rgba(15, 23, 42, 0.09);
}
.cob-kicker {
  display: inline-flex;
  gap: 0.42rem;
  align-items: center;
  padding: 0.33rem 0.66rem;
  border-radius: 999px;
  background: rgba(255, 250, 242, 0.18);
  color: rgba(255, 250, 242, 0.92);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.cob-title {
  margin: 0.9rem 0 0.55rem;
  color: #fffaf2;
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 800;
  line-height: 1.08;
}
.cob-lede {
  margin: 0;
  max-width: 760px;
  color: rgba(255, 250, 242, 0.95);
  font-size: 0.95rem;
  line-height: 1.62;
}
.cob-disclaimer-banner {
  margin-top: 1.25rem;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background: rgba(255, 250, 242, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.cob-disclaimer-icon {
  color: #f59e0b;
  font-size: 1.4rem;
  flex-shrink: 0;
  margin-top: 2px;
}
.cob-disclaimer-content {
  color: #1e293b;
  font-size: 0.88rem;
  line-height: 1.65;
}
.cob-disclaimer-content strong {
  display: block;
  margin-bottom: 0.35rem;
  color: #b45309;
  font-size: 0.9rem;
}
.cob-disclaimer-content a {
  color: #0284c7;
  text-decoration: underline;
  font-weight: 600;
}
.cob-disclaimer-content a:hover {
  color: #0369a1;
}
.cob-metrics,
.cob-cards,
.cob-domains,
.cob-mini,
.cob-type-grid,
.cob-factor-grid {
  display: grid;
  gap: 0.7rem;
}
.cob-metrics {
  grid-template-columns: repeat(4, 1fr);
  margin-top: 1rem;
}
.cob-cards {
  grid-template-columns: repeat(2, 1fr);
}
.cob-domains {
  grid-template-columns: repeat(2, 1fr);
}
.cob-mini {
  grid-template-columns: repeat(3, 1fr);
}
.cob-type-grid,
.cob-factor-grid {
  grid-template-columns: repeat(2, 1fr);
}
.cob-card,
.cob-panel,
.cob-side,
.cob-metric,
.cob-step,
.cob-item {
  border: 1px solid var(--line);
  background: linear-gradient(
    180deg,
    rgba(255, 251, 245, 0.98) 0%,
    rgba(246, 251, 252, 0.98) 100%
  );
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
}
.cob-side,
.cob-panel,
.cob-step {
  padding: 0.82rem 0.88rem;
  border-radius: 18px;
}
.cob-panel {
  padding: 1rem;
  border-radius: 20px;
}
.cob-metric {
  padding: 0.7rem 0.76rem;
  border-radius: 16px;
  background: rgba(19, 42, 67, 0.15);
  border-color: rgba(255, 255, 255, 0.18);
}
.cob-metric label,
.cob-side label,
.cob-panel label,
.cob-form label,
.cob-inspector small {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.cob-metric label {
  color: rgba(19, 42, 67, 0.8);
  margin-bottom: 0.34rem;
}
.cob-metric strong {
  display: block;
  color: #132a43;
  font-size: 1.42rem;
  font-weight: 800;
  line-height: 1;
}
.cob-metric span {
  display: block;
  margin-top: 0.28rem;
  color: #fff;
  font-size: 0.8rem;
  line-height: 1.5;
}
.cob-copy,
.cob-side p,
.cob-step p,
.cob-card p {
  display: block;
  margin-top: 0.28rem;
  color: #14263b;
  font-size: 0.8rem;
  line-height: 1.5;
}
.cob-side label {
  color: #14263b;
}
.cob-side h3,
.cob-head h3 {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 800;
}
.cob-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
.cob-tab {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.65rem;
  align-items: center;
  padding: 0.8rem 0.86rem;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: linear-gradient(
    180deg,
    rgba(255, 250, 242, 0.94) 0%,
    rgba(239, 245, 246, 0.94) 100%
  );
  text-align: left;
  color: var(--ink);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
  cursor: pointer;
}
.cob-tab.active {
  border-color: rgba(15, 118, 110, 0.24);
  box-shadow: 0 18px 30px rgba(15, 118, 110, 0.1);
}
.cob-tab i {
  width: 2.3rem;
  height: 2.3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(20, 38, 59, 0.06);
}
.cob-tab strong {
  display: block;
  font-size: 0.9rem;
  font-weight: 800;
}
.cob-tab span {
  display: block;
  margin-top: 0.12rem;
  color: #14263b;
  font-size: 0.76rem;
  line-height: 1.4;
}
.cob-two {
  display: grid;
  grid-template-columns: 1.04fr 0.96fr;
  gap: 1rem;
}
.cob-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.7rem;
}
.cob-chip,
.cob-pill,
.cob-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  padding: 0.24rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.2;
}
.cob-chip {
  background: rgba(20, 38, 59, 0.08);
  color: var(--ink);
}
.cob-bar {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(160px, 1fr) auto;
  gap: 0.68rem;
  align-items: center;
  padding: 0.62rem 0.72rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
}
.cob-bar strong,
.cob-card strong,
.cob-step strong {
  display: block;
  font-size: 0.86rem;
}
.cob-bar em,
.cob-card p {
  display: block;
  margin-top: 0.12rem;
  color: #14263b;
  font-size: 0.74rem;
  font-style: normal;
  line-height: 1.45;
}
.cob-track {
  height: 0.44rem;
  border-radius: 999px;
  background: rgba(20, 38, 59, 0.08);
  overflow: hidden;
}
.cob-track b {
  display: block;
  height: 100%;
  border-radius: inherit;
}
.cob-num {
  min-width: 2.1rem;
  text-align: right;
  font-weight: 800;
}
.cob-card {
  width: 100%;
  padding: 0.76rem 0.8rem;
  border-radius: 16px;
  text-align: left;
  position: relative;
  z-index: 1;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255, 251, 245, 0.98) 0%, rgba(246, 251, 252, 0.98) 100%);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
  overflow: visible;
}

/* Remove any decorative circles/pseudo-elements from cards */
.cob-card::before,
.cob-card::after,
.cob-card *::before,
.cob-card *::after,
.cob-domains::before,
.cob-domains::after,
.cob-domains *::before,
.cob-domains *::after {
  display: none !important;
  content: none !important;
}

.cob-card strong {
  display: block;
  font-size: 0.86rem;
  margin-top: 0.2rem;
  color: var(--ink);
  line-height: 1.3;
  position: relative;
  z-index: 2;
}

.cob-card p {
  display: block;
  margin-top: 0.12rem;
  color: #14263b;
  font-size: 0.74rem;
  font-style: normal;
  line-height: 1.45;
  position: relative;
  z-index: 2;
}

.cob-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.55rem;
  color: #14263b;
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  position: relative;
  z-index: 2;
}

.cob-track {
  display: block;
  height: 0.44rem;
  border-radius: 999px;
  background: rgba(20, 38, 59, 0.08);
  overflow: hidden;
  margin-top: 0.5rem;
  position: relative;
  z-index: 2;
  width: 100%;
}

.cob-track b {
  display: block;
  height: 100%;
  border-radius: inherit;
  width: auto;
}
.cob-card.clickable,
.cob-type-card,
.cob-item {
  cursor: pointer;
}
.cob-card.clickable:hover,
.cob-type-card:hover,
.cob-item:hover {
  transform: translateY(-1px);
  border-color: rgba(20, 78, 114, 0.22);
  box-shadow: 0 12px 22px rgba(20, 78, 114, 0.08);
}
.cob-workspace {
  display: grid;
  grid-template-columns: 0.78fr 1.02fr 0.92fr;
  gap: 1rem;
}
.cob-type-card {
  padding: 0.68rem 0.72rem;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.9);
  text-align: left;
}
.cob-type-card.active {
  border-color: rgba(20, 78, 114, 0.24);
  background: rgba(238, 245, 245, 0.72);
}
.cob-type-card strong {
  display: block;
  font-size: 0.84rem;
}
.cob-type-card span {
  display: block;
  margin-top: 0.14rem;
  color: #14263b;
  font-size: 0.74rem;
  line-height: 1.45;
}
.cob-form {
  display: grid;
  gap: 0.75rem;
}
.cob-summary {
  margin-top: 0.85rem;
  padding: 0.8rem 0.86rem;
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    rgba(25, 61, 87, 0.95) 0%,
    rgba(20, 78, 114, 0.95) 100%
  );
  color: #fffaf2;
}
.cob-summary small {
  display: block;
  color: rgba(255, 250, 242, 0.9);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.cob-summary strong {
  display: block;
  margin-top: 0.25rem;
  font-size: 1.62rem;
  font-weight: 800;
  line-height: 1;
}
.cob-summary span {
  display: block;
  margin-top: 0.38rem;
  color: rgba(255, 250, 242, 0.95);
  font-size: 0.78rem;
  line-height: 1.5;
}
.cob-list {
  display: flex;
  flex-direction: column;
  max-height: 760px;
  overflow-y: auto;
  padding-right: 0.12rem;
}
.cob-item {
  position: relative;
  padding: 0.72rem 0.8rem 0.68rem 0.92rem;
  margin-bottom: 0.55rem;
  border-radius: 14px;
  background: #fff;
  text-align: left;
  content-visibility: auto;
  contain-intrinsic-size: auto 80px;
}
.cob-item:last-child {
  margin-bottom: 0;
}
.cob-item.active {
  border-color: rgba(15, 118, 110, 0.35);
  border-left-width: 0.28rem;
  background: rgba(238, 245, 245, 0.6);
}
.cob-item:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.7rem;
  bottom: 0.7rem;
  width: 0.18rem;
  border-radius: 999px;
  background: var(--accent, #0f766e);
}
.cob-item-top {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
}
.cob-code {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--accent, #0f766e);
}
.cob-item-name {
  margin: 0.28rem 0 0.18rem;
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.38;
  color: var(--ink);
}
.cob-item-meta {
  color: #14263b;
  font-size: 0.74rem;
  line-height: 1.42;
}
.cob-pill {
  background: rgba(20, 38, 59, 0.08);
  color: var(--ink);
}
.cob-inspector {
  position: relative;
  top: auto;
  min-height: 760px;
  display: flex;
  flex-direction: column;
}
.cob-inspector-head {
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--line);
}
.cob-inspector-head strong {
  display: block;
  margin-top: 0.35rem;
  font-size: 1rem;
  font-weight: 800;
  color: #0f766e;
}
.cob-inspector-head span {
  display: block;
  margin-top: 0.26rem;
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1.4;
}
.cob-inspector-body {
  display: grid;
  gap: 0.75rem;
  padding-top: 0.85rem;
  flex: 1;
  min-height: 0;
  overflow: auto;
  align-content: start;
}
.cob-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.cob-meta span {
  background: rgba(20, 38, 59, 0.06);
  color: var(--ink);
  font-size: 0.72rem;
}
.cob-callout,
.cob-note {
  padding: 0.76rem 0.84rem;
  border-radius: 16px;
  border: 1px solid var(--line);
  line-height: 1.6;
}
.cob-callout {
  background: rgba(255, 255, 255, 0.95);
}
.cob-note {
  background: rgba(238, 245, 245, 0.95);
}
.cob-plain {
  margin: 0.15rem 0 0;
  padding-left: 1rem;
  color: #14263b;
  font-size: 0.78rem;
  line-height: 1.58;
}
.cob-empty {
  padding: 0.9rem;
  border-radius: 16px;
  border: 1px dashed rgba(20, 38, 59, 0.18);
  background: rgba(255, 255, 255, 0.8);
  color: #14263b;
  text-align: center;
  line-height: 1.55;
}
@media (max-width: 1399.98px) {
  .cob-workspace {
    grid-template-columns: 1fr;
  }
  .cob-inspector {
    position: static;
    min-height: auto;
  }
}
@media (max-width: 1199.98px) {
  .cob-hero,
  .cob-nav,
  .cob-two,
  .cob-metrics,
  .cob-cards,
  .cob-domains,
  .cob-mini,
  .cob-type-grid,
  .cob-factor-grid {
    grid-template-columns: 1fr;
  }
  .cob-bar {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 767.98px) {
  .cob-hero,
  .cob-panel {
    padding: 1rem;
    border-radius: 22px;
  }
}

/* Pagination styles */
.cob-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--line);
}
.cob-page-info {
  font-size: 0.875rem;
  color: var(--muted);
  white-space: nowrap;
}
</style>
