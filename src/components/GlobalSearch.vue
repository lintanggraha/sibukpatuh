<template>
  <transition name="gsearch-fade">
    <div
      v-if="open"
      class="gsearch-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="labels.dialogLabel"
      @click.self="close"
    >
      <div class="gsearch-panel" @click.stop>
        <!-- Bilah input -->
        <div class="gsearch-inputbar">
          <i class="fas fa-search gsearch-inputicon" aria-hidden="true"></i>
          <input
            ref="input"
            v-model="query"
            type="text"
            class="gsearch-input"
            :placeholder="labels.placeholder"
            :aria-label="labels.placeholder"
            autocomplete="off"
            spellcheck="false"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            @keydown.enter.prevent="commit"
            @keydown.esc.prevent="close"
            @keydown.tab.prevent="cycleFramework"
          />
          <button
            v-if="query"
            type="button"
            class="gsearch-clear"
            :aria-label="labels.clear"
            @click="clearQuery"
          >
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
          <kbd class="gsearch-esc">ESC</kbd>
        </div>

        <!-- Chip filter framework -->
        <div v-if="chips.length" class="gsearch-chips" role="tablist" :aria-label="labels.filterLabel">
          <button
            type="button"
            class="gsearch-chip"
            :class="{ 'is-active': activeFramework === 'all' }"
            role="tab"
            :aria-selected="activeFramework === 'all'"
            @click="setFramework('all')"
          >
            <i class="fas fa-layer-group" aria-hidden="true"></i>
            <span>{{ labels.allFrameworks }}</span>
            <span class="gsearch-chipcount">{{ totalIndexed }}</span>
          </button>
          <button
            v-for="chip in chips"
            :key="chip.framework"
            type="button"
            class="gsearch-chip"
            :class="{ 'is-active': activeFramework === chip.framework }"
            role="tab"
            :aria-selected="activeFramework === chip.framework"
            :style="activeFramework === chip.framework ? { borderColor: chip.color, color: chip.color } : null"
            @click="setFramework(chip.framework)"
          >
            <i class="fas" :class="chip.icon" aria-hidden="true"></i>
            <span>{{ chip.label }}</span>
            <span class="gsearch-chipcount">{{ chip.count }}</span>
          </button>
        </div>

        <!-- Badan hasil -->
        <div class="gsearch-body">
          <!-- Sedang memuat index -->
          <div v-if="loading" class="gsearch-state">
            <div class="gsearch-spinner" aria-hidden="true"></div>
            <p>{{ labels.loading }}</p>
          </div>

          <!-- Gagal memuat -->
          <div v-else-if="error" class="gsearch-state gsearch-state-error">
            <i class="fas fa-triangle-exclamation" aria-hidden="true"></i>
            <p>{{ labels.error }}</p>
            <button type="button" class="gsearch-retry" @click="loadIndex">
              {{ labels.retry }}
            </button>
          </div>

          <!-- Belum mengetik: tampilkan saran -->
          <div v-else-if="!query.trim()" class="gsearch-empty">
            <p class="gsearch-hinttitle">{{ labels.tryThis }}</p>
            <div class="gsearch-suggestions">
              <button
                v-for="s in suggestions"
                :key="s"
                type="button"
                class="gsearch-suggestion"
                @click="query = s"
              >
                <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
                <span>{{ s }}</span>
              </button>
            </div>
            <p class="gsearch-indexnote">
              {{ labels.indexNote.replace('{count}', totalIndexed).replace('{frameworks}', chips.length) }}
            </p>
          </div>

          <!-- Tidak ada hasil -->
          <div v-else-if="!results.length" class="gsearch-state">
            <i class="fas fa-inbox" aria-hidden="true"></i>
            <p>{{ labels.noResults.replace('{query}', query.trim()) }}</p>
            <button
              v-if="activeFramework !== 'all'"
              type="button"
              class="gsearch-retry"
              @click="setFramework('all')"
            >
              {{ labels.searchAll }}
            </button>
          </div>

          <!-- Daftar hasil -->
          <ul v-else ref="list" class="gsearch-results" role="listbox">
            <li
              v-for="(item, idx) in results"
              :key="item._key"
              :ref="(el) => registerRow(el, idx)"
              class="gsearch-result"
              :class="{ 'is-cursor': idx === cursor }"
              role="option"
              :aria-selected="idx === cursor"
              @click="go(item)"
              @mouseenter="cursor = idx"
            >
              <span class="gsearch-resulticon" :style="{ background: item.color }">
                <i class="fas" :class="item.icon" aria-hidden="true"></i>
              </span>
              <span class="gsearch-resultbody">
                <span class="gsearch-resulthead">
                  <code class="gsearch-resultid">{{ displayId(item) }}</code>
                  <span class="gsearch-resulttitle" v-html="highlight(item.title)"></span>
                </span>
                <span v-if="item.subtitle" class="gsearch-resultsub" v-html="highlight(item.subtitle)"></span>
                <span class="gsearch-resultmeta">
                  <span class="gsearch-resultfw" :style="{ color: item.color }">{{ item.frameworkLabel }}</span>
                  <span v-if="item.category" class="gsearch-resultcat">{{ item.category }}</span>
                </span>
              </span>
              <i class="fas fa-arrow-right gsearch-resultarrow" aria-hidden="true"></i>
            </li>
          </ul>
        </div>

        <!-- Kaki panel -->
        <div class="gsearch-footer">
          <span class="gsearch-foothint">
            <kbd>&uarr;</kbd><kbd>&darr;</kbd> {{ labels.navigate }}
          </span>
          <span class="gsearch-foothint">
            <kbd>&crarr;</kbd> {{ labels.openHint }}
          </span>
          <span class="gsearch-foothint">
            <kbd>Tab</kbd> {{ labels.filterHint }}
          </span>
          <span v-if="query.trim() && results.length" class="gsearch-footcount">
            {{ labels.resultCount.replace('{count}', matchCount) }}
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { buildIndex, searchIndex, summarizeIndex } from '../services/searchIndexService.js';

/** Teks antarmuka per bahasa, mengikuti pola dua bahasa yang dipakai proyek. */
const LABELS = {
  id: {
    dialogLabel: 'Pencarian global kontrol kepatuhan',
    placeholder: 'Cari kontrol, pasal, atau istilah... (misal: enkripsi, A.8.24, insiden siber)',
    clear: 'Bersihkan kueri',
    filterLabel: 'Filter framework',
    allFrameworks: 'Semua',
    loading: 'Menyiapkan indeks pencarian...',
    error: 'Gagal memuat indeks pencarian.',
    retry: 'Coba lagi',
    tryThis: 'Coba cari salah satu ini',
    indexNote: '{count} kontrol dan pasal dari {frameworks} kerangka kerja siap dicari.',
    noResults: 'Tidak ada hasil untuk "{query}".',
    searchAll: 'Cari di semua framework',
    navigate: 'pilih',
    openHint: 'buka',
    filterHint: 'ganti filter',
    resultCount: '{count} hasil',
  },
  en: {
    dialogLabel: 'Global compliance control search',
    placeholder: 'Search controls, articles, or terms... (e.g. encryption, A.8.24, cyber incident)',
    clear: 'Clear query',
    filterLabel: 'Framework filter',
    allFrameworks: 'All',
    loading: 'Preparing search index...',
    error: 'Failed to load the search index.',
    retry: 'Try again',
    tryThis: 'Try one of these',
    indexNote: '{count} controls and articles from {frameworks} frameworks are ready to search.',
    noResults: 'No results for "{query}".',
    searchAll: 'Search all frameworks',
    navigate: 'select',
    openHint: 'open',
    filterHint: 'switch filter',
    resultCount: '{count} results',
  },
};

/** Contoh kueri yang memperlihatkan cakupan index kepada pengguna baru. */
const SUGGESTIONS = {
  id: ['enkripsi', 'A.8.24', 'insiden siber', 'data pribadi', 'hak akses', 'audit internal'],
  en: ['encryption', 'A.8.24', 'cyber incident', 'personal data', 'access rights', 'internal audit'],
};

export default {
  name: 'GlobalSearch',

  props: {
    /** Kontrol tampil atau tidaknya panel, dikelola oleh komponen induk. */
    open: { type: Boolean, default: false },
    /** Bahasa aktif, mengikuti state bahasa aplikasi. */
    lang: { type: String, default: 'id' },
  },

  emits: ['close'],

  data() {
    return {
      query: '',
      index: [],
      loading: false,
      error: false,
      cursor: 0,
      activeFramework: 'all',
      chips: [],
      rows: [],
      /** Kueri yang sudah ditunda, agar pengetikan cepat tidak memicu banyak pencarian. */
      debounced: '',
      debounceTimer: null,
    };
  },

  computed: {
    labels() {
      return LABELS[this.lang === 'en' ? 'en' : 'id'];
    },

    suggestions() {
      return SUGGESTIONS[this.lang === 'en' ? 'en' : 'id'];
    },

    totalIndexed() {
      return this.index.length;
    },

    /** Hasil yang ditampilkan, dibatasi agar daftar tetap ringan. */
    results() {
      if (!this.debounced.trim()) return [];
      return searchIndex(this.index, this.debounced, {
        limit: 30,
        framework: this.activeFramework,
      });
    },

    /** Jumlah kecocokan sebenarnya, bisa lebih besar dari yang ditampilkan. */
    matchCount() {
      if (!this.debounced.trim()) return 0;
      return searchIndex(this.index, this.debounced, {
        limit: 9999,
        framework: this.activeFramework,
      }).length;
    },

    /** Token pencarian untuk penyorotan teks. */
    tokens() {
      return this.debounced.trim().toLowerCase().split(/\s+/).filter(Boolean);
    },
  },

  watch: {
    open(isOpen) {
      if (isOpen) {
        this.$nextTick(() => this.$refs.input?.focus());
        if (!this.index.length && !this.loading) this.loadIndex();
      } else {
        this.query = '';
        this.debounced = '';
        this.cursor = 0;
        this.activeFramework = 'all';
      }
    },

    query(value) {
      // Tunda pencarian sejenak agar pengetikan tetap terasa lancar.
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.debounced = value;
        this.cursor = 0;
      }, 120);
    },

    /** Bahasa berubah, index lama tidak lagi relevan. */
    lang() {
      this.index = [];
      this.chips = [];
      if (this.open) this.loadIndex();
    },

    activeFramework() {
      this.cursor = 0;
    },
  },

  beforeUnmount() {
    clearTimeout(this.debounceTimer);
  },

  methods: {
    async loadIndex() {
      this.loading = true;
      this.error = false;
      try {
        const built = await buildIndex(this.lang);
        this.index = built;
        this.chips = summarizeIndex(built);
      } catch (e) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    close() {
      this.$emit('close');
    },

    clearQuery() {
      this.query = '';
      this.debounced = '';
      this.$refs.input?.focus();
    },

    setFramework(framework) {
      this.activeFramework = framework;
      this.$refs.input?.focus();
    },

    /** Tab memutar filter framework tanpa meninggalkan kolom input. */
    cycleFramework() {
      const order = ['all', ...this.chips.map((c) => c.framework)];
      const at = order.indexOf(this.activeFramework);
      this.activeFramework = order[(at + 1) % order.length];
    },

    move(delta) {
      if (!this.results.length) return;
      const next = this.cursor + delta;
      if (next < 0) this.cursor = this.results.length - 1;
      else if (next >= this.results.length) this.cursor = 0;
      else this.cursor = next;
      this.scrollCursorIntoView();
    },

    commit() {
      const item = this.results[this.cursor];
      if (item) this.go(item);
    },

    registerRow(el, idx) {
      if (el) this.rows[idx] = el;
    },

    scrollCursorIntoView() {
      this.$nextTick(() => {
        const row = this.rows[this.cursor];
        if (row?.scrollIntoView) row.scrollIntoView({ block: 'nearest' });
      });
    },

    /**
     * Buka halaman framework tujuan sambil membawa kata kunci dan ID kontrol
     * sebagai query parameter, agar halaman tujuan dapat menyorot item terkait.
     */
    go(item) {
      this.close();
      const query = { q: item.id, from: 'search' };
      // Sebagian view menampung lebih dari satu dataset di tab berbeda,
      // misalnya Nist.vue: NIST CSF di 'explorer', SP 800-53 di 'reference'.
      if (item.tab) query.tab = item.tab;
      this.$router.push({
        name: item.route,
        query,
      }).catch(() => {
        // Navigasi ke rute yang sama tidak perlu dianggap kesalahan.
      });
    },

    /** ID yang ditampilkan: pakai alias resmi bila tersedia (misal A.8.24). */
    displayId(item) {
      const alias = item.aliases?.[0];
      if (!alias) return item.id;
      // Tampilkan alias hanya bila ringkas, agar kolom ID tidak melebar.
      return alias.length <= 12 ? alias : item.id;
    },

    /** Sorot potongan teks yang cocok dengan token pencarian. */
    highlight(text) {
      const raw = String(text || '');
      const escaped = raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      if (!this.tokens.length) return escaped;

      const pattern = this.tokens
        .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .filter(Boolean)
        .join('|');
      if (!pattern) return escaped;

      return escaped.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
    },
  },
};
</script>

<style scoped>
/* ---------------------------------------------------------------- overlay */
.gsearch-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 6vh 1rem 2rem;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
}

.gsearch-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 46rem;
  max-height: 78vh;
  overflow: hidden;
  background: #fffdf9;
  border: 1px solid rgba(20, 78, 114, 0.14);
  border-radius: 18px;
  box-shadow: 0 32px 70px rgba(15, 23, 42, 0.28);
}

[data-bs-theme="dark"] .gsearch-panel {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 32px 70px rgba(0, 0, 0, 0.55);
}

/* -------------------------------------------------------------- input bar */
.gsearch-inputbar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.95rem 1.1rem;
  border-bottom: 1px solid rgba(20, 78, 114, 0.1);
}

[data-bs-theme="dark"] .gsearch-inputbar {
  border-color: rgba(255, 255, 255, 0.08);
}

.gsearch-inputicon {
  flex: 0 0 auto;
  font-size: 1rem;
  color: var(--active);
}

.gsearch-input {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 1rem;
  font-weight: 600;
  outline: none;
}

.gsearch-input::placeholder {
  color: var(--muted);
  font-weight: 500;
}

.gsearch-clear {
  flex: 0 0 auto;
  width: 1.65rem;
  height: 1.65rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 999px;
  background: rgba(20, 78, 114, 0.08);
  color: var(--muted);
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.gsearch-clear:hover {
  background: rgba(20, 78, 114, 0.16);
  color: var(--ink);
}

[data-bs-theme="dark"] .gsearch-clear {
  background: rgba(255, 255, 255, 0.08);
}

.gsearch-esc {
  flex: 0 0 auto;
  padding: 0.15rem 0.45rem;
  border: 1px solid rgba(20, 78, 114, 0.18);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--muted);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

[data-bs-theme="dark"] .gsearch-esc {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.14);
}

/* ------------------------------------------------------------------ chips */
.gsearch-chips {
  display: flex;
  gap: 0.35rem;
  padding: 0.7rem 1.1rem;
  overflow-x: auto;
  border-bottom: 1px solid rgba(20, 78, 114, 0.08);
  scrollbar-width: thin;
}

[data-bs-theme="dark"] .gsearch-chips {
  border-color: rgba(255, 255, 255, 0.06);
}

.gsearch-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  flex: 0 0 auto;
  padding: 0.3rem 0.65rem;
  border: 1px solid rgba(20, 78, 114, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s ease;
}

.gsearch-chip:hover {
  border-color: var(--active);
  color: var(--active);
}

.gsearch-chip.is-active {
  border-color: var(--active);
  background: var(--active-soft);
  color: var(--active);
}

[data-bs-theme="dark"] .gsearch-chip {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.gsearch-chipcount {
  padding: 0 0.3rem;
  border-radius: 999px;
  background: rgba(20, 78, 114, 0.1);
  font-size: 0.62rem;
  font-weight: 800;
}

[data-bs-theme="dark"] .gsearch-chipcount {
  background: rgba(255, 255, 255, 0.1);
}

/* ------------------------------------------------------------------- body */
.gsearch-body {
  flex: 1 1 auto;
  min-height: 8rem;
  overflow-y: auto;
}

.gsearch-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2.6rem 1.5rem;
  color: var(--muted);
  text-align: center;
}

.gsearch-state i {
  font-size: 1.6rem;
  opacity: 0.5;
}

.gsearch-state p {
  margin: 0;
  font-size: 0.86rem;
}

.gsearch-state-error i {
  color: #dc2626;
  opacity: 0.8;
}

.gsearch-spinner {
  width: 1.6rem;
  height: 1.6rem;
  border: 2px solid rgba(20, 78, 114, 0.16);
  border-top-color: var(--active);
  border-radius: 999px;
  animation: gsearch-spin 0.7s linear infinite;
}

@keyframes gsearch-spin {
  to {
    transform: rotate(360deg);
  }
}

.gsearch-retry {
  padding: 0.35rem 0.85rem;
  border: 1px solid var(--active);
  border-radius: 999px;
  background: transparent;
  color: var(--active);
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
}

.gsearch-retry:hover {
  background: var(--active-soft);
}

/* ------------------------------------------------------------ empty state */
.gsearch-empty {
  padding: 1.3rem 1.1rem 1.6rem;
}

.gsearch-hinttitle {
  margin: 0 0 0.65rem;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.gsearch-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.gsearch-suggestion {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.38rem 0.75rem;
  border: 1px solid rgba(20, 78, 114, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
  color: var(--ink);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.gsearch-suggestion i {
  font-size: 0.68rem;
  color: var(--active);
}

.gsearch-suggestion:hover {
  border-color: var(--active);
  background: var(--active-soft);
}

[data-bs-theme="dark"] .gsearch-suggestion {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.gsearch-indexnote {
  margin: 1.1rem 0 0;
  color: var(--muted);
  font-size: 0.74rem;
}

/* ---------------------------------------------------------------- results */
.gsearch-results {
  margin: 0;
  padding: 0.4rem;
  list-style: none;
}

.gsearch-result {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  padding: 0.6rem 0.7rem;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.12s ease;
}

.gsearch-result.is-cursor {
  background: var(--active-soft);
}

.gsearch-resulticon {
  flex: 0 0 auto;
  width: 1.85rem;
  height: 1.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #fff;
  font-size: 0.72rem;
}

.gsearch-resultbody {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.gsearch-resulthead {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.gsearch-resultid {
  flex: 0 0 auto;
  padding: 0.05rem 0.35rem;
  border-radius: 5px;
  background: rgba(20, 78, 114, 0.09);
  color: var(--active);
  font-size: 0.68rem;
  font-weight: 800;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

[data-bs-theme="dark"] .gsearch-resultid {
  background: rgba(255, 255, 255, 0.1);
}

.gsearch-resulttitle {
  color: var(--ink);
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1.35;
}

.gsearch-resultsub {
  color: var(--muted);
  font-size: 0.76rem;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gsearch-resultmeta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.1rem;
}

.gsearch-resultfw {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.gsearch-resultcat {
  color: var(--muted);
  font-size: 0.68rem;
  font-weight: 600;
}

.gsearch-resultcat::before {
  content: '•';
  margin-right: 0.35rem;
  opacity: 0.5;
}

.gsearch-resultarrow {
  flex: 0 0 auto;
  align-self: center;
  color: var(--active);
  font-size: 0.72rem;
  opacity: 0;
  transition: opacity 0.12s ease;
}

.gsearch-result.is-cursor .gsearch-resultarrow {
  opacity: 1;
}

/* Penyorotan token pencarian */
.gsearch-resultbody :deep(mark) {
  padding: 0 0.1rem;
  border-radius: 3px;
  background: rgba(250, 204, 21, 0.45);
  color: inherit;
  font-weight: 800;
}

[data-bs-theme="dark"] .gsearch-resultbody :deep(mark) {
  background: rgba(250, 204, 21, 0.28);
  color: #fde68a;
}

/* ----------------------------------------------------------------- footer */
.gsearch-footer {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  padding: 0.6rem 1.1rem;
  border-top: 1px solid rgba(20, 78, 114, 0.1);
  background: rgba(20, 78, 114, 0.03);
}

[data-bs-theme="dark"] .gsearch-footer {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.gsearch-foothint {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  color: var(--muted);
  font-size: 0.68rem;
  font-weight: 600;
}

.gsearch-foothint kbd {
  padding: 0.08rem 0.32rem;
  border: 1px solid rgba(20, 78, 114, 0.18);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.7);
  color: var(--muted);
  font-size: 0.62rem;
  font-family: inherit;
}

[data-bs-theme="dark"] .gsearch-foothint kbd {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.14);
}

.gsearch-footcount {
  margin-left: auto;
  color: var(--active);
  font-size: 0.68rem;
  font-weight: 800;
}

/* ------------------------------------------------------------ transitions */
.gsearch-fade-enter-active,
.gsearch-fade-leave-active {
  transition: opacity 0.16s ease;
}

.gsearch-fade-enter-active .gsearch-panel,
.gsearch-fade-leave-active .gsearch-panel {
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.gsearch-fade-enter-from,
.gsearch-fade-leave-to {
  opacity: 0;
}

.gsearch-fade-enter-from .gsearch-panel,
.gsearch-fade-leave-to .gsearch-panel {
  transform: translateY(-10px) scale(0.985);
  opacity: 0;
}

/* --------------------------------------------------------------- responsif */
@media (max-width: 575.98px) {
  .gsearch-overlay {
    padding: 3vh 0.6rem 1rem;
  }

  .gsearch-panel {
    max-height: 88vh;
    border-radius: 14px;
  }

  .gsearch-input {
    font-size: 0.92rem;
  }

  .gsearch-esc {
    display: none;
  }

  .gsearch-footer {
    gap: 0.6rem;
    padding: 0.5rem 0.8rem;
  }

  /* Petunjuk keyboard tidak relevan di perangkat sentuh */
  .gsearch-foothint:nth-child(2),
  .gsearch-foothint:nth-child(3) {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gsearch-spinner {
    animation: none;
  }

  .gsearch-fade-enter-active,
  .gsearch-fade-leave-active,
  .gsearch-fade-enter-active .gsearch-panel,
  .gsearch-fade-leave-active .gsearch-panel {
    transition: none;
  }
}
</style>
