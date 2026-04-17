<template>
  <div class="sej-page">
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
    <div v-else class="sej-shell">
      <section class="sej-hero">
        <div>
          <span class="sej-kicker"
            ><i class="fas fa-project-diagram"></i>Framework Studio</span
          >
          <h1 class="sej-title">
            COBIT 2019 Introduction & Methodology Navigator
          </h1>
          <p class="sej-lede">
            Ringkasan berbahasa Indonesia untuk membaca prinsip, design factor,
            core model, dan alur implementasi COBIT 2019 dengan lebih cepat.
          </p>
          <div class="sej-note" style="margin-top: 1.1rem; border-left: 4px solid #f59e0b;">
            <strong style="color: #b45309;"><i class="fas fa-info-circle me-1"></i> Disclaimer</strong>
            <div class="mt-1" style="font-size: 0.82rem; line-height: 1.6;">
              Konten ini adalah ringkasan edukatif berdasarkan interpretasi dari framework COBIT 2019 yang diterbitkan oleh ISACA. Ini <b>bukan</b> teks resmi COBIT dan tidak boleh dianggap sebagai pengganti standar asli. Untuk akses lengkap dan lisensi resmi, silakan kunjungi <a href="https://www.isaca.org/resources/cobit" target="_blank" rel="noopener noreferrer" style="color: #0284c7; font-weight: 600; text-decoration: underline;">ISACA.org</a>. Penggunaan konten ini sepenuhnya untuk tujuan edukasi dan referensi internal.
            </div>
          </div>
          <div class="sej-metrics">
            <div class="sej-metric">
              <label>Bab Utama</label><strong>{{ totalChapters }}</strong
              ><span>Fondasi, objective, tailoring, dan implementasi.</span>
            </div>
            <div class="sej-metric">
              <label>Prinsip</label><strong>{{ totalPrinciples }}</strong
              ><span>Prinsip sistem dan prinsip framework.</span>
            </div>
            <div class="sej-metric">
              <label>Design Factor</label
              ><strong>{{ totalDesignFactors }}</strong
              ><span>Variabel konteks untuk desain governance.</span>
            </div>
            <div class="sej-metric">
              <label>Objektif Core Model</label
              ><strong>{{ totalObjectives }}</strong
              ><span>1 domain governance dan 4 domain management.</span>
            </div>
          </div>
        </div>
        <div class="sej-grid">
          <div class="sej-side">
            <label>Cara Baca</label>
            <h3>Mulai dari konteks, lalu masuk ke objective</h3>
            <p>
              Baca ringkasan bab dan value outcome dulu, lalu masuk ke design
              factor, domain objective, dan fase implementasi sesuai kebutuhan
              enterprise.
            </p>
          </div>
          <div class="sej-side">
            <label>Nilai Utama</label>
            <p>
              COBIT membantu memastikan informasi dan teknologi tetap nyambung
              ke nilai bisnis, risiko, resource, dan akuntabilitas lintas
              fungsi.
            </p>
          </div>
        </div>
      </section>

      <div class="sej-nav nav" role="tablist">
        <button
          class="sej-tab"
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
          class="sej-tab"
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
          class="sej-tab"
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

      <div class="tab-content sej-grid">
        <!-- Tab 1: Ringkasan Framework -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Roadmap isi dokumen</h3>
                <span class="sej-chip">{{ totalChapters }} bab</span>
              </div>
              <p class="sej-copy">
                Urutan dokumen bergerak dari fondasi konsep, ke objective inti,
                lalu ke desain dan implementasi governance system.
              </p>
              <div class="sej-grid">
                <div
                  v-for="chapter in chapters"
                  :key="chapter.number"
                  class="sej-bar"
                >
                  <span
                    ><strong
                      >Bab {{ chapter.number }} - {{ chapter.title }}</strong
                    ><em>{{ chapter.summary }}</em></span
                  >
                  <span class="sej-track"
                    ><b
                      :style="{
                        width:
                          (chapter.number / Math.max(totalChapters, 1)) * 100 +
                          '%',
                        background: chapter.color,
                      }"
                    ></b
                  ></span>
                  <span class="sej-num">{{ chapter.number }}</span>
                </div>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Core model per domain</h3>
                <span class="sej-chip">{{ totalObjectives }} objective</span>
              </div>
              <p class="sej-copy">
                Klik domain untuk membuka penjelasannya langsung di explorer.
              </p>
              <div class="sej-hotspots">
                <button
                  v-for="domain in domains"
                  :key="domain.id"
                  type="button"
                  class="sej-card clickable"
                  @click="jumpExplorer('domain', domain.id)"
                >
                  <div class="sej-card-top">
                    <span>{{ domain.group }}</span
                    ><span>{{ domain.count }} objective</span>
                  </div>
                  <strong>{{ domain.id }} - {{ domain.title }}</strong>
                  <p>{{ domain.summary }}</p>
                  <span class="sej-track mt-2"
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
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Value outcome</h3>
                <span class="sej-chip">{{ valueOutcomes.length }} outcome</span>
              </div>
              <p class="sej-copy">
                COBIT menjaga tiga hasil utama tetap seimbang: manfaat, risiko,
                dan resource.
              </p>
              <div class="sej-mini">
                <div
                  v-for="item in valueOutcomes"
                  :key="item.id"
                  class="sej-mini"
                >
                  <label>{{ item.id }}</label
                  ><strong>{{ item.title }}</strong>
                  <p>{{ item.summary }}</p>
                </div>
              </div>
              <div class="sej-note mt-3">
                <strong>Governance vs management</strong>
                <div class="mt-2">
                  Governance fokus pada evaluasi, pengarahan, dan pemantauan.
                  Management fokus pada perencanaan, pembangunan, operasi, dan
                  evaluasi kerja.
                </div>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Sorotan COBIT 2019</h3>
                <span class="sej-chip">{{ highlights.length }} poin</span>
              </div>
              <div class="sej-cards">
                <div v-for="item in highlights" :key="item.id" class="sej-card">
                  <div class="sej-card-top">
                    <span>Highlight</span><span>{{ item.id }}</span>
                  </div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.summary }}</p>
                </div>
              </div>
              <div class="sej-cards mt-3">
                <div v-for="item in audiences" :key="item.id" class="sej-card">
                  <div class="sej-card-top">
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
          <div class="sej-workspace">
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Filter Konsep</h3>
                <span class="sej-chip">{{ concepts.length }} entri</span>
              </div>
              <div class="sej-pillar-grid">
                <button
                  v-for="item in typeBreakdown"
                  :key="item.type"
                  type="button"
                  class="sej-pillar"
                  :class="{ active: activeType === item.type }"
                  @click="toggleType(item.type)"
                >
                  <strong>{{ item.label }}</strong
                  ><span>{{ item.count }} entri - {{ item.summary }}</span>
                </button>
              </div>
              <div class="sej-form">
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
              <div class="sej-summary">
                <small>Konsep Ditampilkan</small
                ><strong>{{ filteredConcepts.length }}</strong
                ><span>{{
                  filteredConcepts.length
                    ? `Menampilkan ${filteredConcepts.length} konsep COBIT 2019 sesuai filter aktif.`
                    : "Tidak ada konsep yang cocok dengan filter saat ini."
                }}</span>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Daftar konsep</h3>
                <span class="sej-chip"
                  >{{ filteredConcepts.length }} entri</span
                >
              </div>
              <div class="sej-list">
                <button
                  v-for="concept in filteredConcepts"
                  :key="concept.id"
                  type="button"
                  class="sej-item"
                  :class="{ active: activeConceptId === concept.id }"
                  :style="{ '--accent': concept.color || '#0f766e' }"
                  @click="setActiveConcept(concept.id)"
                >
                  <div class="sej-item-top">
                    <span class="sej-code">{{ concept.id }}</span
                    ><span class="sej-pill">{{
                      concept.type_label || "-"
                    }}</span>
                  </div>
                  <div class="sej-item-name">{{ concept.title || "-" }}</div>
                  <div class="sej-item-meta">
                    {{ concept.group || "-"
                    }}{{
                      concept.metric_value !== null &&
                      concept.metric_value !== undefined
                        ? ` • ${concept.metric_label || "Nilai"}: ${concept.metric_value}`
                        : ""
                    }}
                  </div>
                </button>
                <div v-if="filteredConcepts.length === 0" class="sej-empty">
                  Tidak ada konsep yang cocok dengan filter saat ini.
                </div>
              </div>
            </article>
            <article class="sej-panel sej-inspector">
              <div class="sej-inspector-head">
                <small>Concept Inspector</small>
                <strong>{{ activeConcept ? activeConcept.id : "-" }}</strong>
                <span>{{
                  activeConcept
                    ? activeConcept.title
                    : "Pilih konsep untuk membaca detail."
                }}</span>
              </div>
              <div class="sej-inspector-body">
                <div class="sej-meta">
                  <span>{{ activeConcept ? activeConcept.type_label : "-" }}</span>
                  <span>{{ activeConcept ? activeConcept.group : "-" }}</span>
                  <span>{{ activeConcept && activeConcept.metric_label && activeConcept.metric_value !== null ? `${activeConcept.metric_label}: ${activeConcept.metric_value}` : "Ringkasan Konseptual" }}</span>
                  <span>0 lampiran</span>
                </div>
                <div class="sej-callout">
                  <span class="sej-label">Ringkasan Requirement</span>
                  <div class="mt-2">{{ activeConcept ? activeConcept.summary : "Pilih konsep untuk membaca ringkasan." }}</div>
                </div>
                <div class="sej-note">
                  <span class="sej-label"><i class="fas fa-lightbulb me-1"></i>Analogi</span>
                  <div class="mt-2">{{ activeConcept && (activeConcept.analogy || activeConcept.importance) ? (activeConcept.analogy || activeConcept.importance) : "-" }}</div>
                </div>
                <div class="sej-callout">
                  <span class="sej-label">Fokus Implementasi</span>
                  <ul class="sej-plain">
                    <li v-for="(item, idx) in activeConcept && (activeConcept.focus || activeConcept.details) && (activeConcept.focus || activeConcept.details).length ? (activeConcept.focus || activeConcept.details) : ['Tidak ada fokus implementasi tambahan.']" :key="idx">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div class="sej-callout">
                  <span class="sej-label">Contoh Evidence</span>
                  <ul class="sej-plain">
                    <li v-for="(item, idx) in activeConcept && activeConcept.evidence && activeConcept.evidence.length ? activeConcept.evidence : ['Tidak ada evidence cue.']" :key="idx">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div class="sej-callout">
                  <span class="sej-label">Lampiran Terkait</span>
                  <div class="sej-refs">
                    <span class="sej-empty w-100">Requirement ini tidak menunjuk lampiran spesifik.</span>
                  </div>
                </div>
                <div class="sej-note">
                  <span class="sej-label">Pelaporan / Output</span>
                  <div class="mt-2">{{ activeConcept && activeConcept.reporting ? activeConcept.reporting : "-" }}</div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 3: Desain & Implementasi -->
        <div v-if="activeTab === 'journey'" key="journey-tab">
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Goals cascade</h3>
                <span class="sej-chip">{{ goalCascade.length }} langkah</span>
              </div>
              <div class="sej-cards">
                <div
                  v-for="item in goalCascade"
                  :key="item.id"
                  class="sej-mini"
                >
                  <label>{{ item.id }}</label
                  ><strong>{{ item.title }}</strong>
                  <p>{{ item.summary }}</p>
                </div>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Fase implementasi</h3>
                <span class="sej-chip"
                  >{{ implementationPhases.length }} fase</span
                >
              </div>
              <div class="sej-grid">
                <button
                  v-for="item in implementationPhases"
                  :key="item.id"
                  type="button"
                  class="sej-mini"
                  @click="openDetailModal(item, 'Fase Implementasi')"
                >
                  <label>{{ item.group }}</label>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.summary }}</p>
                </button>
              </div>
            </article>
          </div>
          <article class="sej-panel">
            <div class="sej-head">
              <h3>Design factor untuk tailoring governance</h3>
              <span class="sej-chip">{{ designFactors.length }} faktor</span>
            </div>
            <p class="sej-copy">
              Klik salah satu design factor untuk membuka penjelasannya langsung
              di explorer.
            </p>
            <div class="sej-cards">
              <button
                v-for="item in designFactors"
                :key="item.id"
                type="button"
                class="sej-card clickable"
                @click="openDetailModal(item, 'Design Factor')"
              >
                <div class="sej-card-top">
                  <span>{{ item.group }}</span>
                  <span>{{ item.id }}</span>
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
  <!-- Modal Detail -->
  <Transition name="modal-fade">
    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <Transition name="modal-slide">
        <div class="modal-dialog" v-if="showDetailModal">
          <div class="modal-shell">
            <div class="modal-sidebar" style="background: linear-gradient(180deg, #144e72 0%, rgba(20,78,114,0.7) 100%);">
              <button type="button" class="modal-close" @click="showDetailModal = false" aria-label="Close">
                <i class="fas fa-times"></i>
              </button>
              <div class="modal-sidebar-icon">
                <i class="fas fa-layer-group"></i>
              </div>
              <div class="modal-sidebar-id">{{ selectedDetail?.id || '-' }}</div>
              <div class="modal-sidebar-type">{{ selectedDetailType || 'Komponen' }}</div>
            </div>
            <div class="modal-main">
              <div class="modal-header">
                <h4 class="modal-title">{{ selectedDetail?.title || 'Detail implementasi' }}</h4>
              </div>
              <div class="modal-body">
                <div class="modal-section">
                  <div class="modal-section-header" style="color: #144e72">
                    <i class="fas fa-info-circle"></i>
                    <span>Ringkasan</span>
                  </div>
                  <div class="modal-section-content">
                    <div class="modal-scope">{{ selectedDetail?.group || '-' }}</div>
                    <p class="modal-summary">{{ selectedDetail?.summary || '-' }}</p>
                  </div>
                </div>

                <div class="modal-section" v-if="selectedDetail?.details && selectedDetail.details.length">
                  <div class="modal-section-header" style="color: #144e72">
                    <i class="fas fa-list-check"></i>
                    <span>Artefak / Isi Utama</span>
                  </div>
                  <div class="modal-section-content">
                    <ul class="modal-artifact-list">
                      <li v-for="(item, idx) in selectedDetail.details" :key="idx">
                        <i class="fas fa-check-circle"></i>
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="modal-section">
                  <div class="modal-section-header" style="color: #144e72">
                    <i class="fas fa-link"></i>
                    <span>Requirement yang Menggunakannya</span>
                  </div>
                  <div class="modal-section-content">
                    <div class="modal-requirements">
                      <button type="button" class="modal-req-btn" @click="jumpExplorerFromModal()">
                        <i class="fas fa-arrow-right"></i>
                        <span>Lihat Terkait di Explorer</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
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
      activeConceptId: null,
      showDetailModal: false,
      selectedDetail: null,
      selectedDetailType: "",
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
  },
  watch: {
    filteredConcepts() {
      if (this.filteredConcepts.length && !this.filteredConcepts.find(c => c.id === this.activeConceptId)) {
        this.activeConceptId = this.filteredConcepts[0]?.id || null;
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
        this.setActiveRequirement ? this.setActiveRequirement(id) : this.setActiveConcept(id);
      }
    },
    openDetailModal(item, typeName) {
      this.selectedDetail = item;
      this.selectedDetailType = typeName;
      this.showDetailModal = true;
    },
    jumpExplorerFromModal() {
      if (!this.selectedDetail) return;
      this.showDetailModal = false;
      const typeKey = this.selectedDetailType === 'Fase Implementasi' ? 'implementation_phase' : 'design_factor';
      this.jumpExplorer(typeKey, this.selectedDetail.id);
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
.sej-page{--ink:#14263b;--muted:#5c6776;--line:rgba(20,38,59,.1);--shell:linear-gradient(180deg,#f6efe3 0%,#edf5f6 100%);color:var(--ink);padding:.25rem;border-radius:32px;background:var(--shell)}
.sej-shell{display:grid;gap:1rem}
.sej-hero{display:grid;grid-template-columns:1.55fr .92fr;gap:1.2rem;align-items:stretch;min-height:368px;padding:1.45rem;border-radius:28px;overflow:hidden;position:relative;background:radial-gradient(circle at top right,rgba(248,214,161,.88),transparent 30%),radial-gradient(circle at bottom left,rgba(156,210,219,.7),transparent 28%),linear-gradient(135deg,#132a43 0%,#1f5f78 46%,#f2debb 100%);box-shadow:0 20px 44px rgba(15,23,42,.09)}
.sej-hero>*{position:relative;z-index:1}
.sej-kicker{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem .7rem;border-radius:999px;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.sej-title{margin:1rem 0 .7rem;color:#fffaf2;font-size:clamp(2rem,3.8vw,3rem);font-weight:800;line-height:1.04}
.sej-lede{margin:0;max-width:720px;color:rgba(255,250,242,.82);line-height:1.7}
.sej-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:.65rem;margin-top:1.1rem}
.sej-metric,.sej-side,.sej-panel,.sej-mini{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,251,245,.98) 0%,rgba(246,251,252,.98) 100%);box-shadow:0 14px 28px rgba(15,23,42,.05)}
.sej-metric{padding:.68rem .74rem;border-radius:16px;background:rgba(255,250,242,.12);border-color:rgba(255,255,255,.18);min-height:96px;display:flex;flex-direction:column;justify-content:flex-start}
.sej-metric label,.sej-side label,.sej-mini label,.sej-form label,.sej-inspector small,.sej-label{display:block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.sej-metric label{color:rgba(255,250,242,.7);margin-bottom:.35rem}
.sej-metric strong{display:block;color:#fffaf2;font-size:1.5rem;font-weight:800;line-height:1}
.sej-metric span{display:block;margin-top:.34rem;color:rgba(255,250,242,.72);font-size:.76rem}
.sej-side-stack{display:grid;gap:.85rem}
.sej-side{padding:.8rem .86rem;border-radius:18px;background:rgba(255,250,242,.78);border-color:rgba(255,255,255,.24);min-height:142px}
.sej-side label{color:var(--muted);margin-bottom:.4rem}
.sej-side h3{margin:0;font-size:1rem;font-weight:800}
.sej-side p{margin:.55rem 0 0;color:var(--muted);line-height:1.55;font-size:.84rem}
.sej-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}
.sej-tab{display:grid;grid-template-columns:auto 1fr;gap:.72rem;align-items:center;padding:.82rem .88rem;border-radius:18px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,250,242,.94) 0%,rgba(239,245,246,.94) 100%);text-align:left;color:var(--ink);box-shadow:0 12px 24px rgba(15,23,42,.04);cursor:pointer}
.sej-tab.active{border-color:rgba(20,78,114,.24);box-shadow:0 18px 30px rgba(20,78,114,.1)}
.sej-tab i{width:2.35rem;height:2.35rem;display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(20,38,59,.06)}
.sej-tab strong{display:block;font-size:.9rem;font-weight:800}
.sej-tab span{display:block;margin-top:.14rem;color:var(--muted);font-size:.76rem;line-height:1.4}
.sej-grid{display:grid;gap:1rem}
.sej-grid.two{grid-template-columns:1.06fr .94fr}
.sej-panel{padding:1rem;border-radius:20px}
.sej-head{display:flex;align-items:center;justify-content:space-between;gap:.85rem;margin-bottom:.7rem}
.sej-head h3{margin:0;font-size:.98rem;font-weight:800}
.sej-chip,.sej-pill,.sej-meta span,.sej-ref{display:inline-flex;align-items:center;gap:.3rem;padding:.24rem .52rem;border-radius:999px;font-size:.7rem;font-weight:700;line-height:1.2}
.sej-chip{background:rgba(20,38,59,.08);color:var(--ink)}
.sej-copy{margin:0 0 .85rem;color:var(--muted);line-height:1.6;font-size:.84rem}
.sej-bars,.sej-cards,.sej-hotspots,.sej-families{display:grid;gap:.65rem}
.sej-bar,.sej-hotspot,.sej-family{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(180px,1fr) auto;gap:.68rem;align-items:center;padding:.62rem .72rem;border-radius:16px;border:1px solid transparent;background:rgba(255,255,255,.55);text-align:left;cursor:pointer;transition:border-color .15s ease,transform .15s ease,box-shadow .15s ease}
.sej-family{grid-template-columns:1fr auto}
.sej-bar:hover,.sej-hotspot:hover,.sej-family:hover,.sej-bar.active,.sej-hotspot.active,.sej-family.active{transform:translateY(-1px);border-color:rgba(20,78,114,.22);box-shadow:0 12px 22px rgba(20,78,114,.08)}
.sej-bar strong,.sej-hotspot strong,.sej-family strong{display:block;font-size:.86rem}
.sej-bar em,.sej-hotspot em,.sej-family em{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem;font-style:normal}
.sej-track{height:.44rem;border-radius:999px;background:rgba(20,38,59,.08);overflow:hidden}
.sej-track b{display:block;height:100%;border-radius:inherit}
.sej-num{min-width:2.2rem;text-align:right;font-weight:800}
.sej-cards{grid-template-columns:repeat(3,1fr)}
.sej-card{width:100%;padding:.76rem .8rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer}
.sej-card-top{display:flex;align-items:center;justify-content:space-between;gap:.55rem;color:var(--muted);font-size:.64rem;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
.sej-icon{width:1.9rem;height:1.9rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(20,78,114,.12);color:var(--accent);font-size:.8rem}
.sej-card strong{display:block;margin-top:.42rem;font-size:.86rem;font-weight:800}
.sej-card p{margin:.22rem 0 0;color:var(--muted);font-size:.72rem;line-height:1.4}
.sej-mini-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.65rem;margin-bottom:.8rem}
.sej-mini{padding:.72rem .78rem;border-radius:16px}
.sej-mini label{color:var(--muted)}
.sej-mini strong{display:block;margin-top:.2rem;font-size:1.08rem;font-weight:800;color:#144e72}
.sej-mini span{display:block;margin-top:.14rem;color:var(--muted);font-size:.72rem;line-height:1.4}
.sej-workspace{display:grid;grid-template-columns:.76fr 1.03fr .91fr;gap:1rem}
.sej-refspace{display:grid;grid-template-columns:.82fr 1.18fr;gap:1rem}
.sej-pillar-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.55rem;margin-bottom:.8rem}
.sej-pillar{width:100%;padding:.62rem .68rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer}
.sej-pillar.active{border-color:rgba(20,78,114,.24);background:rgba(238,245,245,.72);box-shadow:0 12px 24px rgba(20,78,114,.08)}
.sej-pillar strong{display:block;font-size:.82rem;font-weight:800;color:var(--accent)}
.sej-pillar span{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem}
.sej-form{display:grid;gap:.75rem}
.sej-form label{margin-bottom:.3rem;color:var(--muted)}
.sej-summary{margin-top:.85rem;padding:.82rem .88rem;border-radius:18px;background:linear-gradient(180deg,rgba(25,61,87,.95) 0%,rgba(20,78,114,.95) 100%);color:#fffaf2}
.sej-summary small{display:block;color:rgba(255,250,242,.7);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.sej-summary strong{display:block;margin-top:.28rem;font-size:1.72rem;font-weight:800;line-height:1}
.sej-summary span{display:block;margin-top:.42rem;color:rgba(255,250,242,.78);font-size:.78rem;line-height:1.5}
.sej-list{display:flex;flex-direction:column;max-height:720px;overflow-y:auto;padding-right:.12rem}
.sej-item{position:relative;width:100%;padding:.7rem .78rem .66rem .88rem;margin-bottom:.55rem;border-radius:14px;border:1px solid rgba(20,38,59,.08);background:#fff;text-align:left;cursor:pointer;content-visibility:auto;contain-intrinsic-size:auto 80px}
.sej-item:last-child{margin-bottom:0}
.sej-item.active{border-color:rgba(20,78,114,.35);border-left-width:.28rem;background:rgba(238,245,245,.6)}
.sej-item:before{content:'';position:absolute;left:0;top:.68rem;bottom:.68rem;width:.18rem;border-radius:999px;background:var(--accent,#144e72)}
.sej-item-top{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:space-between}
.sej-item-code,.sej-code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:.76rem;font-weight:800;color:var(--accent,#144e72)}
.sej-item-name{margin:.28rem 0 .2rem;font-size:.88rem;font-weight:700;line-height:1.38;color:var(--ink)}
.sej-item-meta{color:var(--muted);font-size:.74rem;line-height:1.4}
.sej-item-meta span+span::before{content:'•';margin:0 .4rem;color:rgba(20,38,59,.35)}
.sej-pill{padding:.2rem .45rem;font-size:.68rem;background:rgba(20,38,59,.08);color:var(--ink)}
.sej-inspector{position:relative;top:auto;min-height:720px;display:flex;flex-direction:column}
.sej-inspector-head{padding-bottom:.85rem;border-bottom:1px solid var(--line)}
.sej-inspector-head strong{display:block;margin-top:.35rem;font-size:1rem;font-weight:800;color:#144e72}
.sej-inspector-head span{display:block;margin-top:.28rem;font-size:.9rem;font-weight:800;line-height:1.4}
.sej-inspector-body{display:grid;gap:.75rem;padding-top:.85rem;flex:1;min-height:0;overflow:auto;align-content:start}
.sej-meta{display:flex;flex-wrap:wrap;gap:.45rem}
.sej-meta span{background:rgba(20,38,59,.06);color:var(--ink);font-size:.72rem}
.sej-callout,.sej-note{padding:.76rem .84rem;border-radius:16px;border:1px solid var(--line);line-height:1.62}
.sej-callout{background:rgba(255,255,255,.75)}
.sej-note{background:rgba(238,245,245,.84)}
.sej-plain{margin:.15rem 0 0;padding-left:1rem;color:var(--muted);font-size:.78rem;line-height:1.6}
.sej-plain li{margin-bottom:.16rem}
.sej-refs{display:flex;flex-wrap:wrap;gap:.4rem}
.sej-ref{border:1px solid rgba(20,38,59,.12);background:rgba(255,255,255,.82);color:var(--ink);font-size:.7rem;cursor:pointer}
.sej-empty{padding:.9rem;border-radius:16px;border:1px dashed rgba(20,38,59,.18);background:rgba(255,255,255,.6);color:var(--muted);text-align:center;line-height:1.55}

/* Modal Styles */
.modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,.56);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem}
.modal-dialog{width:100%;max-width:780px;animation:modalSlideIn .25s ease-out}
.modal-shell{display:grid;grid-template-columns:120px 1fr;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 24px 64px rgba(15,23,42,.24),0 8px 24px rgba(15,23,42,.12)}
.modal-sidebar{position:relative;padding:1.5rem 1rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.65rem;color:#fffaf2;text-align:center}
.modal-close{position:absolute;top:.75rem;right:.75rem;width:2rem;height:2rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;border:none;background:rgba(255,255,255,.18);color:#fff;cursor:pointer;transition:background .15s ease,transform .15s ease}
.modal-close:hover{background:rgba(255,255,255,.28);transform:scale(1.05)}
.modal-sidebar-icon{width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;border-radius:16px;background:rgba(255,255,255,.18);font-size:1.25rem;margin-bottom:.25rem}
.modal-sidebar-id{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:1.15rem;font-weight:800;letter-spacing:.04em}
.modal-sidebar-type{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;opacity:.82}
.modal-main{display:flex;flex-direction:column;max-height:80vh;overflow:hidden}
.modal-header{padding:1.15rem 1.5rem 1rem;border-bottom:1px solid var(--line)}
.modal-title{margin:0;font-size:1.15rem;font-weight:800;color:var(--ink);line-height:1.4}
.modal-body{padding:1.25rem 1.5rem;overflow-y:auto;flex:1}
.modal-section{margin-bottom:1.25rem}
.modal-section:last-child{margin-bottom:0}
.modal-section-header{display:flex;align-items:center;gap:.55rem;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:.65rem;padding-bottom:.5rem;border-bottom:1px solid var(--line)}
.modal-section-header i{font-size:.82rem}
.modal-section-content{padding-left:.25rem}
.modal-scope{display:inline-block;padding:.28rem .55rem;border-radius:999px;background:rgba(20,78,114,.08);color:#144e72;font-size:.72rem;font-weight:700;margin-bottom:.55rem}
.modal-summary{margin:0;color:var(--muted);font-size:.86rem;line-height:1.7}
.modal-artifact-list{list-style:none;margin:0;padding:0;display:grid;gap:.45rem}
.modal-artifact-list li{display:flex;align-items:flex-start;gap:.55rem;padding:.62rem .75rem;border-radius:12px;background:rgba(238,245,245,.5);font-size:.84rem;color:var(--ink);line-height:1.5}
.modal-artifact-list li i{color:#0f766e;font-size:.82rem;margin-top:.18rem;flex-shrink:0}
.modal-requirements{display:flex;flex-wrap:wrap;gap:.45rem}
.modal-req-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.42rem .72rem;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.85);color:var(--ink);font-size:.76rem;font-weight:700;cursor:pointer;transition:border-color .15s ease,background .15s ease,transform .15s ease}
.modal-req-btn i{font-size:.68rem;color:var(--muted);transition:transform .15s ease}
.modal-req-btn:hover{border-color:rgba(20,78,114,.28);background:rgba(238,245,245,.7);transform:translateY(-1px)}
.modal-req-btn:hover i{transform:translateX(2px)}
.modal-empty{padding:.9rem 1rem;border-radius:12px;border:1px dashed rgba(20,38,59,.18);background:rgba(245,247,250,.6);color:var(--muted);text-align:center;font-size:.82rem;line-height:1.5}

/* Modal Transitions */
.modal-fade-enter-active,.modal-fade-leave-active{transition:opacity .2s ease}
.modal-fade-enter-from,.modal-fade-leave-to{opacity:0}
.modal-slide-enter-active{transition:transform .25s ease-out,opacity .25s ease-out}
.modal-slide-leave-active{transition:transform .2s ease-in,opacity .2s ease-in}
.modal-slide-enter-from,.modal-slide-leave-to{transform:translateY(16px) scale(.97);opacity:0}

@media (max-width:1399.98px){.sej-workspace,.sej-refspace{grid-template-columns:1fr}.sej-inspector{position:static;min-height:auto}}
@media (max-width:1199.98px){.sej-hero,.sej-metric,.sej-side{min-height:auto}.sej-hero,.sej-nav,.sej-grid.two,.sej-refspace,.sej-metrics,.sej-mini-row,.sej-cards{grid-template-columns:1fr}.sej-bar,.sej-hotspot,.sej-family{grid-template-columns:1fr}}
@media (max-width:767.98px){.sej-hero,.sej-panel{padding:1.2rem;border-radius:22px}.sej-pillar-grid{grid-template-columns:1fr}.modal-shell{grid-template-columns:1fr}.modal-sidebar{flex-direction:row;padding:1rem;gap:1rem}.modal-sidebar-icon{width:2.5rem;height:2.5rem;margin-bottom:0}.modal-close{top:.5rem;right:.5rem}.modal-dialog{max-width:100%}}
</style>
