<template>
  <div class="orj-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading Resilience data...</p>
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
    <div v-else class="orj-shell">
      <section class="orj-hero">
        <div>
          <span class="orj-kicker"
            ><i class="fas fa-landmark"></i>Framework Studio</span
          >
          <h1 class="orj-title">Panduan Resiliensi OJK</h1>
          <p class="orj-lede">
            Let's talk digital resilience! Halaman ini ngebongkar Panduan Resiliensi Digital OJK jadi struktur yang actionable. Lo bakal diajak eksplorasi tiap tema dan fokus implementasinya biar paham gimana caranya maintain operasional tetap on-track meski lagi diserang. Basically, ini panduan lo buat shifting dari sekadar 'bertahan' jadi 'tangguh' secara terukur.
          </p>
          <div class="orj-metrics">
            <div class="orj-metric">
              <label>Bagian Utama</label>
              <strong>{{ totalSections }}</strong>
              <span
                >Latar belakang, ketahanan digital, dan kerangka ketahanan
                digital.</span
              >
            </div>
            <div class="orj-metric">
              <label>Tema Panduan</label>
              <strong>{{ totalThemes }}</strong>
              <span
                >Tema prioritas yang dirangkum dari struktur dokumen
                panduan.</span
              >
            </div>
            <div class="orj-metric">
              <label>Fokus Implementasi</label>
              <strong>{{ totalFocusPoints }}</strong>
              <span
                >Arahan implementasi yang dapat ditelaah satu per satu dalam
                explorer.</span
              >
            </div>
            <div class="orj-metric">
              <label>Kapabilitas Ketahanan</label>
              <strong>{{ sectionBreakdown.length }}</strong>
              <span>Area kapabilitas dari latar belakang hingga kerangka.</span>
            </div>
          </div>
        </div>
        <div class="orj-side-stack">
          <div class="orj-side"><label>Cakupan Panduan</label><h3>Fokus pada ketahanan layanan digital</h3><p>Panduan ditempatkan sebagai acuan untuk memahami konteks gangguan digital, kesiapan operasional, tata kelola, dan penguatan berkelanjutan dalam lingkungan layanan perbankan.</p></div>
          <div class="orj-side"><label>Arah Pemanfaatan</label><p>Pembacaan dapat dimulai dari struktur dokumen, dilanjutkan ke eksplorasi tema untuk menelaah ringkasan dan fokus implementasi, lalu ditutup dengan board lampiran untuk menyusun prioritas tindak lanjut.</p></div>
        </div>
      </section>

      <div class="orj-nav nav" role="tablist">
        <button
          class="orj-tab"
          :class="{ active: activeTab === 'overview' }"
          type="button"
          role="tab"
          @click="activeTab = 'overview'"
        >
          <i class="fas fa-chart-line"></i>
          <span>
            <strong>Ringkasan Panduan</strong>
            <span>Struktur dokumen, tema utama, dan sorotan implementasi.</span>
          </span>
        </button>
        <button
          class="orj-tab"
          :class="{ active: activeTab === 'explorer' }"
          type="button"
          role="tab"
          @click="activeTab = 'explorer'"
        >
          <i class="fas fa-sliders-h"></i>
          <span>
            <strong>Eksplorasi</strong>
            <span
              >Filter tema, baca ringkasan, dan telaah fokus implementasi.</span
            >
          </span>
        </button>
        <button
          class="orj-tab"
          :class="{ active: activeTab === 'focus' }"
          type="button"
          role="tab"
          @click="activeTab = 'focus'"
        >
          <i class="fas fa-layer-group"></i>
          <span>
            <strong>Fokus Implementasi</strong>
            <span
              >Board tema per bagian untuk membantu penelaahan tindak
              lanjut.</span
            >
          </span>
        </button>
      </div>

      <div class="tab-content orj-grid">
        <!-- Tab 1: Ringkasan Panduan -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="orj-grid two">
            <article class="orj-panel">
              <div class="orj-head">
                <h3>Struktur bagian dokumen</h3>
                <span class="orj-chip">{{ totalSections }} bagian</span>
              </div>
              <p class="orj-copy">
                Pembacaan panduan dapat dimulai dari tiga bagian utama berikut
                untuk memahami konteks, kapabilitas ketahanan, dan penguatan
                kerangka pengelolaan ketahanan digital.
              </p>
              <div class="orj-bars">
                <button
                  v-for="item in sectionBreakdown"
                  :key="item.key"
                  type="button"
                  class="orj-bar"
                  :class="{ active: sectionFilter === item.key }"
                  @click="jumpSection(item.key)"
                >
                  <span>
                    <strong>{{ item.key }}</strong>
                    <em>{{ item.summary }}</em>
                  </span>
                  <span class="orj-track">
                    <b
                      :style="{
                        width: (item.count / maxSectionCount) * 100 + '%',
                        background: item.color,
                      }"
                    ></b>
                  </span>
                  <span class="orj-num">{{ item.count }}</span>
                </button>
              </div>
            </article>
            <article class="orj-panel">
              <div class="orj-head">
                <h3>Tema utama panduan</h3>
                <span class="orj-chip">{{ totalThemes }} tema</span>
              </div>
              <p class="orj-copy">
                Setiap tema merangkum pokok arahan yang dapat dibaca lebih
                lanjut melalui eksplorasi untuk memahami implikasi implementasi
                pada ketahanan digital.
              </p>
              <div class="orj-cards">
                <button
                  v-for="theme in themes"
                  :key="theme.id"
                  type="button"
                  class="orj-card"
                  @click="jumpTheme(theme.id)"
                >
                  <div class="orj-card-top">
                    <span class="orj-icon">
                      <i :class="`fas ${getSectionIcon(theme.section)}`"></i>
                    </span>
                    <span>{{ (theme.focus || []).length }} fokus</span>
                  </div>
                  <strong>{{ theme.title }}</strong>
                  <p>{{ theme.section }}</p>
                </button>
              </div>
            </article>
          </div>
          <div class="orj-grid two">
            <article class="orj-panel">
              <div class="orj-head"><h3>Elemen penilaian inti</h3><span class="orj-chip">Assessment model</span></div>
              <div class="orj-mini-row">
                <div class="orj-mini"><label>3 Bagian Dokumen</label><strong>Latar hingga Kerangka</strong><span>Struktur dokumen dari konteks hingga tata kelola ketahanan.</span></div>
                <div class="orj-mini"><label>Ketahanan Digital</label><strong>Prevent to Recover</strong><span>Mencegah, mendeteksi, merespons, dan memulihkan gangguan digital.</span></div>
                <div class="orj-mini"><label>Penguatan Berkelanjutan</label><strong>Test & Improve</strong><span>Pengujian berkala dan peningkatan kapabilitas ketahanan.</span></div>
              </div>
              <div class="orj-note">Panduan Resiliensi OJK menekankan pemahaman konteks layanan digital, pengelolaan gangguan, pemulihan layanan, dan penguatan tata kelola sebagai satu rangkaian ketahanan yang saling terhubung.</div>
            </article>
            <article class="orj-panel">
              <div class="orj-head"><h3>Peta kapabilitas</h3><span class="orj-chip">{{ sectionBreakdown.length }} kapabilitas</span></div>
              <p class="orj-copy">Kapabilitas ini menjadi lensa kerja utama untuk membaca panduan resiliensi. Klik salah satu bar untuk langsung lompat ke eksplorasi dengan filter yang relevan.</p>
              <div class="orj-cards">
                <button v-for="item in sectionBreakdown" :key="item.key" type="button" class="orj-card" :style="{ '--accent': item.color }" @click="jumpSection(item.key)"><div class="orj-card-top"><span class="orj-icon"><i :class="`fas ${item.icon}`"></i></span><span>{{ item.count }} tema</span></div><strong>{{ item.label }}</strong><p>Klik untuk filter explorer.</p></button>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 2: Eksplorasi -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="orj-workspace">
            <article class="orj-panel orj-filter-panel">
              <div class="orj-head">
                <h3>Filter Tema</h3>
                <span class="orj-chip">{{ totalThemes }} tema</span>
              </div>
              <div class="orj-form">
                <div>
                  <label for="sectionFilter">Bagian Dokumen</label>
                  <select
                    id="sectionFilter"
                    v-model="sectionFilter"
                    class="form-select"
                  >
                    <option value="">Semua bagian</option>
                    <option
                      v-for="section in sectionOptions"
                      :key="section"
                      :value="section"
                    >
                      {{ section }}
                    </option>
                  </select>
                </div>
                <div>
                  <label for="themeSearch">Cari tema</label>
                  <input
                    id="themeSearch"
                    v-model="themeSearch"
                    type="search"
                    class="form-control"
                    placeholder="Cari ID, judul, ringkasan, atau fokus implementasi"
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="resetThemeFilters"
                >
                  Atur ulang filter
                </button>
              </div>
            </article>
            <article class="orj-panel">
              <div class="orj-head">
                <h3>Daftar tema</h3>
                <span class="orj-chip">{{ filteredThemes.length }} entri</span>
              </div>
              <div class="orj-list">
                <button
                  v-for="theme in filteredThemes"
                  :key="theme.id"
                  type="button"
                  class="orj-item"
                  :class="{ active: activeThemeId === theme.id }"
                  :style="{ '--accent': getSectionColor(theme.section) }"
                  @click="setActiveTheme(theme.id)"
                >
                  <div class="orj-item-top">
                    <span class="orj-item-code">{{ theme.id }}</span>
                    <span class="orj-pill">{{
                      getSectionLabel(theme.section)
                    }}</span>
                  </div>
                  <div class="orj-item-name">{{ theme.title }}</div>
                  <div class="orj-item-meta">
                    <span>{{ theme.section }}</span>
                    <span>{{ (theme.focus || []).length }} fokus</span>
                  </div>
                </button>
                <div v-if="filteredThemes.length === 0" class="orj-empty">
                  Tidak ada tema yang cocok dengan filter saat ini.
                </div>
              </div>
            </article>
            <article class="orj-panel orj-inspector">
              <div class="orj-inspector-head">
                <small>Theme Inspector</small>
                <strong>{{ activeTheme ? activeTheme.id : "-" }}</strong>
                <span>{{
                  activeTheme
                    ? activeTheme.title
                    : "Pilih tema untuk membaca detail."
                }}</span>
              </div>
              <div class="orj-inspector-body">
                <div class="orj-meta">
                  <span>{{ activeTheme ? activeTheme.section : "-" }}</span>
                  <span>{{ activeTheme ? getSectionLabel(activeTheme.section) : "-" }}</span>
                  <span>{{ activeTheme ? (activeTheme.focus || []).length + " fokus" : "0 fokus" }}</span>
                </div>
                <div class="orj-callout"><span class="orj-label">Ringkasan Requirement</span><div class="mt-2">{{ activeTheme ? activeTheme.summary : 'Pilih tema untuk membaca ringkasan.' }}</div></div>
                <div class="orj-note"><span class="orj-label"><i class="fas fa-lightbulb me-1"></i>Analogi</span><div class="mt-2">{{ activeTheme && activeTheme.analogy ? activeTheme.analogy : '-' }}</div></div>
                <div class="orj-callout"><span class="orj-label">Fokus Implementasi</span><ul class="orj-plain"><li v-for="(item, idx) in (activeTheme && activeTheme.focus && activeTheme.focus.length ? activeTheme.focus : ['Tidak ada fokus implementasi tambahan.'])" :key="idx">{{ item }}</li></ul></div>
                <div class="orj-callout"><span class="orj-label">Contoh Evidence</span><ul class="orj-plain"><li v-for="(item, idx) in (activeTheme && activeTheme.evidence && activeTheme.evidence.length ? activeTheme.evidence : ['Tidak ada evidence cue.'])" :key="idx">{{ item }}</li></ul></div>
                <div class="orj-callout"><span class="orj-label">Lampiran Terkait</span><div class="orj-refs"><span v-for="ref in (activeTheme?.appendices || [])" :key="ref" class="orj-ref">{{ ref }}</span><span v-if="!activeTheme || !activeTheme.appendices || !activeTheme.appendices.length" class="orj-empty w-100">Tema ini tidak menunjuk lampiran spesifik.</span></div></div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 3: Fokus Implementasi -->
        <div v-if="activeTab === 'focus'" key="focus-tab">
          <div class="orj-refspace">
            <article class="orj-panel">
              <div class="orj-head"><h3>Filter kapabilitas</h3><span class="orj-chip">{{ totalThemes }} tema</span></div>
              <div class="orj-form">
                <div><label for="focusSectionFilter">Bagian Dokumen</label><select id="focusSectionFilter" v-model="focusSectionFilter" class="form-select"><option value="">Semua bagian</option><option v-for="section in sectionOptions" :key="section" :value="section">{{ section }}</option></select></div>
                <div><label for="focusSearch">Cari tema</label><input id="focusSearch" v-model="focusSearch" type="search" class="form-control" placeholder="Cari ID, judul, atau fokus implementasi"></div>
                <button type="button" class="btn btn-outline-secondary" @click="resetFocusFilters">Atur ulang filter</button>
              </div>
              <div class="orj-families mt-3">
                <button v-for="item in sectionBreakdown" :key="item.key" type="button" class="orj-family" :class="{ active: focusSectionFilter === item.key }" :style="{ '--accent': item.color }" @click="focusSectionFilter = focusSectionFilter === item.key ? '' : item.key"><span><strong>{{ item.label }}</strong><em>{{ item.count }} tema</em></span><span class="orj-num">{{ item.count }}</span></button>
              </div>
              <div class="orj-note mt-3"><span class="orj-label">Catatan Implementasi</span>Hasil fokus implementasi seluruhnya bermuara ke penguatan kapabilitas ketahanan digital sesuai bagian dokumen panduan yang relevan.</div>
            </article>
            <article class="orj-panel">
              <div class="orj-head"><h3>Board fokus implementasi</h3><span class="orj-chip">{{ filteredFocusThemes.length }} entri</span></div>
              <div class="orj-list">
                <button v-for="theme in filteredFocusThemes" :key="theme.id" type="button" class="orj-item" @click="jumpThemeFromFocus(theme.id)"><div class="orj-item-top"><span class="orj-item-code">{{ theme.id }}</span><span class="orj-pill">{{ getSectionLabel(theme.section) }}</span></div><div class="orj-item-name">{{ theme.title || '-' }}</div><div class="orj-item-meta"><span>{{ (theme.focus || []).length }} fokus</span></div></button>
                <div v-if="filteredFocusThemes.length === 0" class="orj-empty">Tidak ada tema yang cocok dengan filter saat ini.</div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OjkResilience",
  data() {
    return {
      loading: true,
      error: null,
      activeTab: "overview",
      themes: [],
      sectionFilter: "",
      themeSearch: "",
      activeThemeId: null,
      // Tab 3 focus filters
      focusSectionFilter: "",
      focusSearch: "",
      sectionMeta: {
        "A. Latar Belakang": {
          label: "Latar Belakang",
          color: "#2563eb",
          icon: "fa-compass",
          summary:
            "Menjelaskan konteks ketergantungan digital, eksposur gangguan, dan urgensi kesinambungan layanan.",
        },
        "B. Ketahanan Digital": {
          label: "Ketahanan Digital",
          color: "#0f766e",
          icon: "fa-shield-alt",
          summary:
            "Menekankan kemampuan mencegah, mendeteksi, merespons, dan memulihkan gangguan pada layanan digital.",
        },
        "C. Kerangka Ketahanan Digital": {
          label: "Kerangka Ketahanan",
          color: "#b45309",
          icon: "fa-sitemap",
          summary:
            "Menguatkan tata kelola, struktur pengelolaan, pengujian, dan peningkatan berkelanjutan.",
        },
      },
    };
  },
  computed: {
    totalThemes() {
      return this.themes.length;
    },
    totalSections() {
      const sections = this.themes.map((t) => t.section).filter(Boolean);
      return new Set(sections).size;
    },
    totalFocusPoints() {
      return this.themes.reduce(
        (sum, t) => sum + (t.focus ? t.focus.length : 0),
        0,
      );
    },
    sectionBreakdown() {
      return Object.entries(this.sectionMeta)
        .map(([key, meta]) => {
          const count = this.themes.filter((t) => t.section === key).length;
          return {
            key,
            label: meta.label,
            color: meta.color,
            icon: meta.icon,
            summary: meta.summary,
            count,
          };
        })
        .filter((item) => item.count > 0);
    },
    maxSectionCount() {
      return Math.max(...this.sectionBreakdown.map((s) => s.count), 1);
    },
    sectionOptions() {
      return this.sectionBreakdown.map((s) => s.key);
    },
    themesBySection() {
      return this.themes.reduce((acc, theme) => {
        if (!acc[theme.section]) acc[theme.section] = [];
        acc[theme.section].push(theme);
        return acc;
      }, {});
    },
    filteredThemes() {
      return this.themes.filter((theme) => {
        if (this.sectionFilter && theme.section !== this.sectionFilter)
          return false;
        if (!this.themeSearch.trim()) return true;
        const query = this.themeSearch.trim().toLowerCase();
        return [
          theme.id,
          theme.title,
          theme.section,
          theme.summary,
          theme.interpretation,
          ...(theme.focus || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
    },
    activeTheme() {
      return this.themes.find((t) => t.id === this.activeThemeId) || null;
    },
    filteredFocusThemes() {
      const query = (this.focusSearch || "").trim().toLowerCase();
      return this.themes.filter((theme) => {
        if (this.focusSectionFilter && theme.section !== this.focusSectionFilter) return false;
        if (!query) return true;
        return [theme.id, theme.title, theme.section, theme.summary, ...(theme.focus || [])].join(" ").toLowerCase().includes(query);
      });
    },
  },
  methods: {
    getSectionColor(section) {
      return this.sectionMeta[section]?.color || "#144e72";
    },
    getSectionLabel(section) {
      return this.sectionMeta[section]?.label || section || "-";
    },
    getSectionIcon(section) {
      return this.sectionMeta[section]?.icon || "fa-book-open";
    },
    jumpSection(section) {
      this.sectionFilter = section || "";
      this.themeSearch = "";
      this.activeTab = "explorer";
    },
    jumpTheme(id) {
      const theme = this.themes.find((t) => t.id === id);
      if (!theme) return;
      this.sectionFilter = "";
      this.themeSearch = "";
      this.activeTab = "explorer";
      this.setActiveTheme(id);
    },
    setActiveTheme(id) {
      this.activeThemeId = id;
    },
    resetThemeFilters() {
      this.sectionFilter = "";
      this.themeSearch = "";
      if (this.themes.length > 0) {
        this.activeThemeId = this.filteredThemes[0]?.id || this.themes[0]?.id;
      }
    },
    resetFocusFilters() {
      this.focusSectionFilter = "";
      this.focusSearch = "";
    },
    jumpThemeFromFocus(id) {
      this.sectionFilter = "";
      this.themeSearch = "";
      this.activeTab = "explorer";
      this.setActiveTheme(id);
    },
    retryLoad() {
      this.loadData();
    },
    async loadData() {
      try {
        this.loading = true;
        this.error = null;
        const response = await fetch("/data/seojk_resilience_guidance.json");
        if (response.ok) {
          const data = await response.json();
          this.themes = Array.isArray(data)
            ? data
            : data.themes || data.tema || [];
          if (this.themes.length > 0) {
            this.activeThemeId = this.themes[0].id;
          }
        } else {
          throw new Error(`Failed to load Resilience data: HTTP ${response.status}`);
        }
      } catch (error) {
        console.error("Error loading Resilience Guide data:", error);
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
.orj-page{--ink:#14263b;--muted:#5c6776;--line:rgba(20,38,59,.1);--shell:linear-gradient(180deg,#f6efe3 0%,#edf5f6 100%);color:var(--ink);padding:.25rem;border-radius:32px;background:var(--shell)}
.orj-shell{display:grid;gap:1rem}
.orj-hero{display:grid;grid-template-columns:1.55fr .92fr;gap:1.2rem;align-items:stretch;min-height:368px;padding:1.45rem;border-radius:28px;overflow:hidden;position:relative;background:radial-gradient(circle at top right,rgba(248,214,161,.88),transparent 30%),radial-gradient(circle at bottom left,rgba(156,210,219,.7),transparent 28%),linear-gradient(135deg,#132a43 0%,#1f5f78 46%,#f2debb 100%);box-shadow:0 20px 44px rgba(15,23,42,.09)}
.orj-hero>*{position:relative;z-index:1}
.orj-kicker{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem .7rem;border-radius:999px;background:rgba(255,250,242,.18);color:rgba(255,250,242,.92);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.orj-title{margin:1rem 0 .7rem;color:#fffaf2;font-size:clamp(2rem,3.8vw,3rem);font-weight:800;line-height:1.04}
.orj-lede{margin:0;max-width:720px;color:rgba(255,250,242,.82);line-height:1.7}
.orj-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:.65rem;margin-top:1.1rem}
.orj-metric,.orj-side,.orj-panel,.orj-mini{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,251,245,.98) 0%,rgba(246,251,252,.98) 100%);box-shadow:0 14px 28px rgba(15,23,42,.05)}
.orj-metric{padding:.68rem .74rem;border-radius:16px;background:rgba(255,250,242,.12);border-color:rgba(255,255,255,.18);min-height:96px;display:flex;flex-direction:column;justify-content:flex-start}
.orj-metric label,.orj-side label,.orj-mini label,.orj-form label,.orj-inspector small,.orj-label{display:block;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.orj-metric label{color:rgba(255,250,242,.7);margin-bottom:.35rem}
.orj-metric strong{display:block;color:#fffaf2;font-size:1.5rem;font-weight:800;line-height:1}
.orj-metric span{display:block;margin-top:.34rem;color:rgba(255,250,242,.72);font-size:.76rem}
.orj-side-stack{display:grid;gap:.85rem}
.orj-side{padding:.8rem .86rem;border-radius:18px;background:rgba(255,250,242,.78);border-color:rgba(255,255,255,.24);min-height:142px}
.orj-side label{color:var(--muted);margin-bottom:.4rem}
.orj-side h3{margin:0;font-size:1rem;font-weight:800}
.orj-side p{margin:.55rem 0 0;color:var(--muted);line-height:1.55;font-size:.84rem}
.orj-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}
.orj-tab{display:grid;grid-template-columns:auto 1fr;gap:.72rem;align-items:center;padding:.82rem .88rem;border-radius:18px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,250,242,.94) 0%,rgba(239,245,246,.94) 100%);text-align:left;color:var(--ink);box-shadow:0 12px 24px rgba(15,23,42,.04);cursor:pointer}
.orj-tab.active{border-color:rgba(20,78,114,.24);box-shadow:0 18px 30px rgba(20,78,114,.1)}
.orj-tab i{width:2.35rem;height:2.35rem;display:inline-flex;align-items:center;justify-content:center;border-radius:14px;background:rgba(20,38,59,.06)}
.orj-tab strong{display:block;font-size:.9rem;font-weight:800}
.orj-tab span{display:block;margin-top:.14rem;color:var(--muted);font-size:.76rem;line-height:1.4}
.orj-grid{display:grid;gap:1rem}
.orj-grid.two{grid-template-columns:1.06fr .94fr}
.orj-panel{padding:1rem;border-radius:20px}
.orj-head{display:flex;align-items:center;justify-content:space-between;gap:.85rem;margin-bottom:.7rem}
.orj-head h3{margin:0;font-size:.98rem;font-weight:800}
.orj-chip,.orj-pill,.orj-meta span,.orj-ref{display:inline-flex;align-items:center;gap:.3rem;padding:.24rem .52rem;border-radius:999px;font-size:.7rem;font-weight:700;line-height:1.2}
.orj-chip{background:rgba(20,38,59,.08);color:var(--ink)}
.orj-copy{margin:0 0 .85rem;color:var(--muted);line-height:1.6;font-size:.84rem}
.orj-bars,.orj-cards,.orj-families,.orj-list{display:grid;gap:.65rem}
.orj-bar,.orj-family{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(180px,1fr) auto;gap:.68rem;align-items:center;padding:.62rem .72rem;border-radius:16px;border:1px solid transparent;background:rgba(255,255,255,.55);text-align:left;cursor:pointer;transition:border-color .15s ease,transform .15s ease,box-shadow .15s ease}
.orj-family{grid-template-columns:1fr auto}
.orj-bar:hover,.orj-family:hover,.orj-bar.active,.orj-family.active{transform:translateY(-1px);border-color:rgba(20,78,114,.22);box-shadow:0 12px 22px rgba(20,78,114,.08)}
.orj-bar strong,.orj-family strong{display:block;font-size:.86rem}
.orj-bar em,.orj-family em{display:block;margin-top:.12rem;color:var(--muted);font-size:.74rem;font-style:normal}
.orj-track{height:.44rem;border-radius:999px;background:rgba(20,38,59,.08);overflow:hidden}
.orj-track b{display:block;height:100%;border-radius:inherit}
.orj-num{min-width:2.2rem;text-align:right;font-weight:800}
.orj-cards{grid-template-columns:repeat(3,1fr)}
.orj-card{width:100%;padding:.76rem .8rem;border-radius:16px;border:1px solid var(--line);background:rgba(255,255,255,.75);text-align:left;cursor:pointer}
.orj-card-top{display:flex;align-items:center;justify-content:space-between;gap:.55rem;color:var(--muted);font-size:.64rem;text-transform:uppercase;letter-spacing:.06em;font-weight:700}
.orj-icon{width:1.9rem;height:1.9rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(20,78,114,.12);color:var(--accent);font-size:.8rem}
.orj-card strong{display:block;margin-top:.42rem;font-size:.86rem;font-weight:800}
.orj-card p{margin:.22rem 0 0;color:var(--muted);font-size:.72rem;line-height:1.4}
.orj-mini-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.65rem;margin-bottom:.8rem}
.orj-mini{padding:.72rem .78rem;border-radius:16px}
.orj-mini label{color:var(--muted)}
.orj-mini strong{display:block;margin-top:.2rem;font-size:1.08rem;font-weight:800;color:#144e72}
.orj-mini span{display:block;margin-top:.14rem;color:var(--muted);font-size:.72rem;line-height:1.4}
.orj-workspace{display:grid;grid-template-columns:.85fr 1.15fr;gap:1rem}
.orj-filter-panel{grid-column:1 / -1}
.orj-refspace{display:grid;grid-template-columns:.82fr 1.18fr;gap:1rem}
.orj-form{display:flex;gap:.75rem;align-items:flex-end}
.orj-form > div { flex: 1; }
.orj-form label{margin-bottom:.3rem;color:var(--muted)}
.orj-summary{margin-top:.85rem;padding:.82rem .88rem;border-radius:18px;background:linear-gradient(180deg,rgba(25,61,87,.95) 0%,rgba(20,78,114,.95) 100%);color:#fffaf2}
.orj-summary small{display:block;color:rgba(255,250,242,.7);font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.orj-summary strong{display:block;margin-top:.28rem;font-size:1.72rem;font-weight:800;line-height:1}
.orj-summary span{display:block;margin-top:.42rem;color:rgba(255,250,242,.78);font-size:.78rem;line-height:1.5}
.orj-list{display:flex;flex-direction:column;max-height:720px;overflow-y:auto;padding-right:.12rem}
.orj-item{position:relative;width:100%;padding:.7rem .78rem .66rem .88rem;margin-bottom:.55rem;border-radius:14px;border:1px solid rgba(20,38,59,.08);background:#fff;text-align:left;cursor:pointer;content-visibility:auto;contain-intrinsic-size:auto 80px}
.orj-item:last-child{margin-bottom:0}
.orj-item.active{border-color:rgba(20,78,114,.35);border-left-width:.28rem;background:rgba(238,245,245,.6)}
.orj-item:before{content:'';position:absolute;left:0;top:.68rem;bottom:.68rem;width:.18rem;border-radius:999px;background:var(--accent,#144e72)}
.orj-item-top{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:space-between}
.orj-item-code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Courier New",monospace;font-size:.76rem;font-weight:800;color:var(--accent,#144e72)}
.orj-item-name{margin:.28rem 0 .2rem;font-size:.88rem;font-weight:700;line-height:1.38;color:var(--ink)}
.orj-item-meta{color:var(--muted);font-size:.74rem;line-height:1.4}
.orj-item-meta span+span::before{content:'•';margin:0 .4rem;color:rgba(20,38,59,.35)}
.orj-inspector{position:relative;top:auto;min-height:720px;display:flex;flex-direction:column}
.orj-inspector-head{padding-bottom:.85rem;border-bottom:1px solid var(--line)}
.orj-inspector-head strong{display:block;margin-top:.35rem;font-size:1rem;font-weight:800;color:#144e72}
.orj-inspector-head span{display:block;margin-top:.28rem;font-size:.9rem;font-weight:800;line-height:1.4}
.orj-inspector-body{display:grid;gap:.75rem;padding-top:.85rem;flex:1;min-height:0;overflow:auto;align-content:start}
.orj-meta{display:flex;flex-wrap:wrap;gap:.45rem}
.orj-callout,.orj-note{padding:.76rem .84rem;border-radius:16px;border:1px solid var(--line);line-height:1.62}
.orj-callout{background:rgba(255,255,255,.75)}
.orj-note{background:rgba(238,245,245,.84)}
.orj-plain{margin:.15rem 0 0;padding-left:1rem;color:var(--muted);font-size:.78rem;line-height:1.6}
.orj-plain li{margin-bottom:.16rem}
.orj-ref{border:1px solid rgba(20,38,59,.12);background:rgba(255,255,255,.82);color:var(--ink);font-size:.7rem;cursor:pointer}
.orj-empty{padding:.9rem;border-radius:16px;border:1px dashed rgba(20,38,59,.18);background:rgba(255,255,255,.6);color:var(--muted);text-align:center;line-height:1.55}
@media (max-width:1440px){.orj-hero { min-height: 280px; padding: 1.25rem; } .orj-title { font-size: clamp(1.8rem, 3.2vw, 2.5rem); margin: 0.8rem 0 0.5rem; } .orj-metric { min-height: 80px; padding: 0.55rem 0.65rem; } .orj-metric strong { font-size: 1.35rem; } .orj-list, .orj-inspector { min-height: auto; max-height: 520px; }}
@media (max-height:850px) and (min-width:1024px){.orj-hero { min-height: 240px; padding: 1.15rem; } .orj-list, .orj-inspector { max-height: calc(100vh - 280px); } .orj-inspector-body { padding-top: 0.5rem; }}
@media (max-width:1399.98px){.orj-workspace,.orj-refspace{grid-template-columns:1fr}.orj-inspector{position:static;min-height:auto}}
@media (max-width:1199.98px){.orj-hero,.orj-metric,.orj-side{min-height:auto}.orj-hero,.orj-nav,.orj-grid.two,.orj-refspace,.orj-metrics,.orj-mini-row,.orj-cards{grid-template-columns:1fr}.orj-bar,.orj-family{grid-template-columns:1fr}}
@media (max-width:767.98px){.orj-hero,.orj-panel{padding:1.2rem;border-radius:22px}}
</style>
