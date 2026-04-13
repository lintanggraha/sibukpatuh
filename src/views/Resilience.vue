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
            Halaman ini menyajikan ringkasan Panduan Resiliensi Digital OJK
            dalam bentuk struktur dokumen, explorer tema, dan fokus implementasi
            untuk membantu pembacaan materi ketahanan digital secara lebih
            terstruktur dan operasional.
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
          </div>
        </div>
        <div class="orj-grid">
          <div class="orj-side">
            <label>Cakupan Panduan</label>
            <h3>Fokus pada ketahanan layanan digital</h3>
            <p>
              Panduan ditempatkan sebagai acuan untuk memahami konteks gangguan
              digital, kesiapan operasional, tata kelola, dan penguatan
              berkelanjutan dalam lingkungan layanan perbankan.
            </p>
          </div>
          <div class="orj-side">
            <label>Arah Pemanfaatan</label>
            <p>
              Pembacaan dapat dimulai dari struktur dokumen, dilanjutkan ke
              explorer tema untuk menelaah ringkasan dan fokus implementasi,
              lalu ditutup dengan board fokus per bagian untuk menyusun
              prioritas tindak lanjut.
            </p>
          </div>
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
            <strong>Explorer Tema</strong>
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
                lanjut melalui explorer untuk memahami implikasi implementasi
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
              <div class="orj-head">
                <h3>Sorotan implementasi</h3>
                <span class="orj-chip">Prioritas pembacaan</span>
              </div>
              <div class="orj-note">
                Panduan Resiliensi OJK menekankan pemahaman konteks layanan
                digital, pengelolaan gangguan, pemulihan layanan, dan penguatan
                tata kelola sebagai satu rangkaian ketahanan yang saling
                terhubung.
              </div>
            </article>
            <article class="orj-panel">
              <div class="orj-head">
                <h3>Arah pemanfaatan</h3>
                <span class="orj-chip">Pendekatan kerja</span>
              </div>
              <p class="orj-copy">
                Halaman ini dirancang untuk membantu pembacaan tematik ketika
                organisasi perlu memahami fokus prioritas, menyusun agenda
                penguatan, atau menelaah area kesiapan ketahanan digital secara
                lebih sistematis.
              </p>
              <div class="orj-note">
                Klik salah satu bagian atau tema untuk langsung berpindah ke
                explorer dan membaca detail fokus implementasi dari tema yang
                dipilih.
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 2: Explorer Tema -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="orj-workspace">
            <article class="orj-panel">
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
              <div class="orj-summary">
                <small>Tema Ditampilkan</small>
                <strong>{{ filteredThemes.length }}</strong>
                <span>{{
                  filteredThemes.length
                    ? `Menampilkan ${filteredThemes.length} tema Panduan Resiliensi OJK sesuai filter aktif.`
                    : "Tidak ada tema yang cocok dengan filter saat ini."
                }}</span>
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
                  <span>{{
                    activeTheme
                      ? (activeTheme.focus || []).length + " fokus"
                      : "0 fokus"
                  }}</span>
                  <span>{{
                    activeTheme ? getSectionLabel(activeTheme.section) : "-"
                  }}</span>
                </div>
                <div class="orj-callout">
                  <strong>Ringkasan Tema</strong>
                  <div class="mt-2">
                    {{
                      activeTheme
                        ? activeTheme.summary
                        : "Pilih tema untuk membaca ringkasan."
                    }}
                  </div>
                </div>
                <div class="orj-note">
                  <strong>Interpretasi Implementasi</strong>
                  <div class="mt-2">
                    {{ activeTheme ? activeTheme.interpretation : "-" }}
                  </div>
                </div>
                <div class="orj-callout">
                  <strong>Fokus Implementasi</strong>
                  <ul class="orj-plain">
                    <li
                      v-for="(item, idx) in activeTheme &&
                      activeTheme.focus &&
                      activeTheme.focus.length
                        ? activeTheme.focus
                        : ['Tidak ada fokus implementasi tambahan.']"
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

        <!-- Tab 3: Fokus Implementasi -->
        <div v-if="activeTab === 'focus'" key="focus-tab">
          <div class="orj-theme-groups">
            <article
              v-for="item in sectionBreakdown"
              :key="item.key"
              class="orj-panel"
            >
              <div class="orj-head">
                <h3>{{ item.key }}</h3>
                <span class="orj-chip">{{ item.count }} tema</span>
              </div>
              <p class="orj-copy">{{ item.summary }}</p>
              <div class="orj-bars">
                <button
                  v-for="theme in themesBySection[item.key] || []"
                  :key="theme.id"
                  type="button"
                  class="orj-theme-link"
                  @click="jumpTheme(theme.id)"
                >
                  <strong>{{ theme.title }}</strong>
                  <em>{{ (theme.focus || []).length }} fokus implementasi</em>
                </button>
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
    retryLoad() {
      this.mounted();
    },
  },
  async mounted() {
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
};
</script>

<style scoped>
.orj-page {
  --ink: #17324a;
  --muted: #5b6774;
  --line: rgba(23, 50, 74, 0.1);
  background: linear-gradient(180deg, #f5efe3 0%, #eef4f5 100%);
  border-radius: 28px;
  padding: 0.25rem;
  color: var(--ink);
}
.orj-shell {
  display: grid;
  gap: 1rem;
}
.orj-hero {
  display: grid;
  grid-template-columns: 1.4fr 0.9fr;
  gap: 1rem;
  align-items: stretch;
  min-height: 368px;
  padding: 1.45rem;
  border-radius: 24px;
  background:
    radial-gradient(
      circle at top right,
      rgba(241, 214, 168, 0.9),
      transparent 32%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(149, 202, 213, 0.68),
      transparent 28%
    ),
    linear-gradient(135deg, #14314a 0%, #1f5e72 48%, #ead7b1 100%);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}
.orj-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 250, 242, 0.18);
  color: #fffaf2;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.orj-title {
  margin: 1rem 0 0.7rem;
  color: #fffaf2;
  font-size: clamp(2rem, 3.7vw, 3rem);
  font-weight: 800;
  line-height: 1.05;
}
.orj-lede {
  margin: 0;
  max-width: 760px;
  color: rgba(255, 250, 242, 0.84);
  line-height: 1.72;
}
.orj-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.7rem;
  margin-top: 1.1rem;
}
.orj-metric,
.orj-panel,
.orj-side {
  border: 1px solid var(--line);
  background: linear-gradient(
    180deg,
    rgba(255, 251, 245, 0.98) 0%,
    rgba(246, 251, 252, 0.98) 100%
  );
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
}
.orj-metric {
  padding: 0.68rem 0.74rem;
  border-radius: 16px;
  background: rgba(255, 250, 242, 0.14);
  border-color: rgba(255, 255, 255, 0.18);
  min-height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.orj-metric label,
.orj-side label,
.orj-form label,
.orj-inspector small {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.orj-metric label {
  color: rgba(255, 250, 242, 0.74);
}
.orj-metric strong {
  display: block;
  margin-top: 0.25rem;
  color: #fffaf2;
  font-size: 1.45rem;
  font-weight: 800;
}
.orj-metric span {
  display: block;
  margin-top: 0.25rem;
  color: rgba(255, 250, 242, 0.74);
  font-size: 0.76rem;
  line-height: 1.45;
}
.orj-side {
  padding: 0.8rem 0.86rem;
  border-radius: 18px;
  background: rgba(255, 250, 242, 0.82);
  min-height: 142px;
}
.orj-side label {
  color: var(--muted);
  margin-bottom: 0.35rem;
}
.orj-side h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
}
.orj-side p {
  margin: 0.5rem 0 0;
  color: var(--muted);
  font-size: 0.84rem;
  line-height: 1.58;
}
.orj-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
.orj-tab {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.7rem;
  align-items: center;
  padding: 0.82rem 0.88rem;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: linear-gradient(
    180deg,
    rgba(255, 250, 242, 0.94) 0%,
    rgba(239, 245, 246, 0.94) 100%
  );
  text-align: left;
  color: var(--ink);
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.04);
}
.orj-tab.active {
  border-color: rgba(20, 78, 114, 0.24);
  box-shadow: 0 16px 28px rgba(20, 78, 114, 0.08);
}
.orj-tab i {
  width: 2.25rem;
  height: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(20, 38, 59, 0.06);
}
.orj-tab strong {
  display: block;
  font-size: 0.9rem;
  font-weight: 800;
}
.orj-tab span {
  display: block;
  margin-top: 0.12rem;
  color: var(--muted);
  font-size: 0.76rem;
  line-height: 1.4;
}
.orj-grid {
  display: grid;
  gap: 1rem;
}
.orj-grid.two {
  grid-template-columns: 1.04fr 0.96fr;
}
.orj-panel {
  padding: 1rem;
  border-radius: 20px;
}
.orj-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.75rem;
}
.orj-head h3 {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 800;
}
.orj-chip,
.orj-pill,
.orj-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.24rem 0.52rem;
  border-radius: 999px;
  background: rgba(20, 38, 59, 0.08);
  font-size: 0.7rem;
  font-weight: 700;
}
.orj-copy {
  margin: 0 0 0.8rem;
  color: var(--muted);
  line-height: 1.62;
  font-size: 0.84rem;
}
.orj-bars,
.orj-cards,
.orj-theme-groups,
.orj-list {
  display: grid;
  gap: 0.65rem;
}
.orj-bar,
.orj-card,
.orj-theme-link,
.orj-item {
  width: 100%;
  text-align: left;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.74);
  cursor: pointer;
}
.orj-bar {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(160px, 1fr) auto;
  gap: 0.65rem;
  align-items: center;
  padding: 0.66rem 0.74rem;
  border-radius: 16px;
}
.orj-bar:hover,
.orj-bar.active,
.orj-card:hover,
.orj-theme-link:hover,
.orj-item.active {
  border-color: rgba(20, 78, 114, 0.22);
  box-shadow: 0 12px 24px rgba(20, 78, 114, 0.08);
}
.orj-bar strong,
.orj-card strong,
.orj-theme-link strong,
.orj-item-name {
  display: block;
  font-size: 0.86rem;
  font-weight: 800;
}
.orj-bar em,
.orj-card p,
.orj-theme-link em,
.orj-item-meta {
  display: block;
  margin-top: 0.14rem;
  color: var(--muted);
  font-size: 0.74rem;
  font-style: normal;
  line-height: 1.45;
}
.orj-track {
  height: 0.42rem;
  border-radius: 999px;
  background: rgba(20, 38, 59, 0.08);
  overflow: hidden;
}
.orj-track b {
  display: block;
  height: 100%;
}
.orj-num {
  min-width: 2rem;
  text-align: right;
  font-weight: 800;
}
.orj-cards {
  grid-template-columns: repeat(2, 1fr);
}
.orj-card,
.orj-theme-link {
  padding: 0.8rem;
  border-radius: 16px;
  border-color: var(--line);
}
.orj-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
}
.orj-icon {
  width: 1.85rem;
  height: 1.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(20, 78, 114, 0.12);
  color: #144e72;
}
.orj-workspace {
  display: grid;
  grid-template-columns: 0.74fr 0.98fr 0.94fr;
  gap: 1rem;
}
.orj-form {
  display: grid;
  gap: 0.75rem;
}
.orj-form label {
  margin-bottom: 0.3rem;
  color: var(--muted);
}
.orj-summary {
  margin-top: 0.85rem;
  padding: 0.82rem 0.88rem;
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    rgba(25, 61, 87, 0.95) 0%,
    rgba(20, 78, 114, 0.95) 100%
  );
  color: #fffaf2;
}
.orj-summary small {
  display: block;
  color: rgba(255, 250, 242, 0.7);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.orj-summary strong {
  display: block;
  margin-top: 0.28rem;
  font-size: 1.72rem;
  font-weight: 800;
}
.orj-summary span {
  display: block;
  margin-top: 0.4rem;
  color: rgba(255, 250, 242, 0.78);
  font-size: 0.78rem;
  line-height: 1.5;
}
.orj-list {
  display: flex;
  flex-direction: column;
  max-height: 720px;
  overflow-y: auto;
  padding-right: 0.12rem;
}
.orj-item {
  position: relative;
  padding: 0.72rem 0.8rem 0.68rem 0.92rem;
  margin-bottom: 0.55rem;
  border-radius: 14px;
  border-color: rgba(20, 38, 59, 0.08);
  content-visibility: auto;
  contain-intrinsic-size: auto 80px;
}
.orj-item:last-child {
  margin-bottom: 0;
}
.orj-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.68rem;
  bottom: 0.68rem;
  width: 0.18rem;
  border-radius: 999px;
  background: var(--accent, #144e72);
}
.orj-item-top {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
}
.orj-item-code {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--accent, #144e72);
}
.orj-inspector {
  position: relative;
  top: auto;
  min-height: 720px;
  display: flex;
  flex-direction: column;
}
.orj-inspector-head {
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--line);
}
.orj-inspector-head strong {
  display: block;
  margin-top: 0.35rem;
  font-size: 1rem;
  font-weight: 800;
  color: #144e72;
}
.orj-inspector-head span {
  display: block;
  margin-top: 0.28rem;
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1.4;
}
.orj-inspector-body {
  display: grid;
  gap: 0.75rem;
  padding-top: 0.85rem;
  flex: 1;
  overflow: auto;
  align-content: start;
}
.orj-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.orj-callout,
.orj-note {
  padding: 0.76rem 0.84rem;
  border-radius: 16px;
  border: 1px solid var(--line);
  line-height: 1.62;
}
.orj-callout {
  background: rgba(255, 255, 255, 0.76);
}
.orj-note {
  background: rgba(238, 245, 245, 0.84);
}
.orj-plain {
  margin: 0.15rem 0 0;
  padding-left: 1rem;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.6;
}
.orj-plain li {
  margin-bottom: 0.18rem;
}
.orj-empty {
  padding: 0.9rem;
  border-radius: 16px;
  border: 1px dashed rgba(20, 38, 59, 0.18);
  background: rgba(255, 255, 255, 0.6);
  color: var(--muted);
  text-align: center;
  line-height: 1.55;
}
@media (max-width: 1399.98px) {
  .orj-workspace {
    grid-template-columns: 1fr;
  }
  .orj-inspector {
    position: static;
    min-height: auto;
  }
}
@media (max-width: 1199.98px) {
  .orj-hero,
  .orj-metric,
  .orj-side {
    min-height: auto;
  }
  .orj-hero,
  .orj-nav,
  .orj-grid.two,
  .orj-metrics,
  .orj-cards,
  .orj-theme-groups {
    grid-template-columns: 1fr;
  }
  .orj-bar {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 767.98px) {
  .orj-hero,
  .orj-panel {
    padding: 1.2rem;
    border-radius: 22px;
  }
}
</style>
  
/* Loading and Error States */
.loading-state, .error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}
.loading-spinner i {
  font-size: 2rem;
  color: #144e72;
}
.error-message i {
  font-size: 3rem;
  color: #dc3545;
  margin-bottom: 1rem;
}
.error-message h3 {
  color: #dc3545;
  margin-bottom: 0.5rem;
}
.error-message p {
  color: #6c757d;
  margin-bottom: 1rem;
}

/* Tab transition animation */
