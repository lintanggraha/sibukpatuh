<template>
  <div class="tif-page">
    <section class="tif-hero">
      <div class="tif-hero-copy">
        <span class="tif-kicker"><i class="fas fa-satellite-dish"></i> Threat Intelligence Feed</span>
        <h1 class="tif-title">Pantauan Pulse OTX</h1>
        <p class="tif-lede">
          Ikuti sinyal ancaman dari AlienVault OTX untuk membaca ringkasan pulse, indikator kompromi, tag ancaman, dan referensi investigasi.
        </p>
        <div class="tif-metrics">
          <div class="tif-metric">
            <label>Pulse</label>
            <strong>{{ formatNumber(resultCount || pulses.length) }}</strong>
            <span>Hasil dari pencarian aktif.</span>
          </div>
          <div class="tif-metric">
            <label>Indikator</label>
            <strong>{{ formatNumber(totalIndicators) }}</strong>
            <span>IOC yang muncul pada halaman ini.</span>
          </div>
          <div class="tif-metric">
            <label>Tag</label>
            <strong>{{ formatNumber(uniqueTagCount) }}</strong>
            <span>Konteks ancaman lintas pulse.</span>
          </div>
          <div class="tif-metric">
            <label>Update</label>
            <strong>{{ lastUpdatedLabel }}</strong>
            <span>Waktu modifikasi terbaru.</span>
          </div>
        </div>
      </div>

      <form class="tif-key-panel" @submit.prevent="saveApiKey">
        <label for="otxApiKey">OTX API Key Lokal</label>
        <div class="tif-key-input">
          <input
            id="otxApiKey"
            v-model="apiKeyDraft"
            type="password"
            class="form-control"
            autocomplete="off"
            placeholder="Opsional untuk local/dev"
          >
          <button type="submit" class="btn btn-dark">Pakai</button>
        </div>
        <p>{{ keyHelpText }}</p>
        <button v-if="apiKey" type="button" class="tif-link-button" @click="clearApiKey">
          Hapus key lokal
        </button>
      </form>
    </section>

    <section class="tif-toolbar" aria-label="Filter feed">
      <form class="tif-search" @submit.prevent="applySearch">
        <label for="otxSearch">Cari pulse OTX</label>
        <div class="tif-search-row">
          <input
            id="otxSearch"
            v-model="queryDraft"
            type="search"
            class="form-control"
            placeholder="Contoh: ransomware, phishing, CVE-2024"
          >
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-search"></i>
            Cari
          </button>
        </div>
      </form>
      <div class="tif-presets" aria-label="Pencarian cepat">
        <button
          v-for="preset in presets"
          :key="preset"
          type="button"
          :class="{ active: query.toLowerCase() === preset.toLowerCase() }"
          @click="usePreset(preset)"
        >
          {{ preset }}
        </button>
      </div>
    </section>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Memuat feed OTX...</p>
      </div>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Feed OTX belum bisa dimuat</h3>
        <p>{{ error }}</p>
        <button type="button" class="btn btn-primary" @click="loadFeed">Coba lagi</button>
      </div>
    </div>

    <div v-else class="tif-workspace">
      <article class="tif-panel">
        <div class="tif-head">
          <div>
            <h2>Pulse Terkini</h2>
            <p>{{ sourceLabel }} - kata kunci "{{ query }}"</p>
          </div>
          <span class="tif-chip">{{ formatNumber(pulses.length) }} item</span>
        </div>

        <div class="tif-tag-cloud" v-if="topTags.length">
          <button
            v-for="tag in topTags"
            :key="tag.name"
            type="button"
            @click="usePreset(tag.name)"
          >
            <span>{{ tag.name }}</span>
            <strong>{{ tag.count }}</strong>
          </button>
        </div>

        <div class="tif-list">
          <button
            v-for="pulse in pulses"
            :key="pulse.id"
            type="button"
            class="tif-item"
            :class="{ active: activePulseId === pulse.id }"
            @click="activePulseId = pulse.id"
          >
            <div class="tif-item-top">
              <span class="tif-item-code">{{ pulse.tlp }}</span>
              <span>{{ pulse.indicatorCount }} IOC</span>
            </div>
            <strong>{{ pulse.name }}</strong>
            <p>{{ pulse.description || 'Belum ada deskripsi ringkas dari OTX.' }}</p>
            <div class="tif-item-meta">
              <span><i class="fas fa-user"></i> {{ pulse.author }}</span>
              <span><i class="fas fa-clock"></i> {{ formatDate(pulse.modified) }}</span>
            </div>
          </button>
          <div v-if="!pulses.length" class="framework-empty">
            Tidak ada pulse yang cocok dengan pencarian saat ini.
          </div>
        </div>

        <div class="tif-pagination">
          <button type="button" class="btn btn-outline-secondary" :disabled="page <= 1 || loading" @click="goPage(page - 1)">
            <i class="fas fa-chevron-left"></i>
            Sebelumnya
          </button>
          <span>Halaman {{ page }}</span>
          <button type="button" class="btn btn-outline-secondary" :disabled="!hasNextPage || loading" @click="goPage(page + 1)">
            Berikutnya
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </article>

      <article class="tif-panel tif-detail">
        <div class="tif-detail-head">
          <small>Pulse Inspector</small>
          <h2>{{ activePulse ? activePulse.name : 'Pilih pulse' }}</h2>
          <p>{{ activePulse ? activePulse.description || 'Belum ada deskripsi ringkas dari OTX.' : 'Pilih salah satu pulse untuk membaca konteks indikator.' }}</p>
        </div>

        <div v-if="activePulse" class="tif-detail-body">
          <div class="tif-meta-grid">
            <span><strong>TLP</strong>{{ activePulse.tlp }}</span>
            <span><strong>Author</strong>{{ activePulse.author }}</span>
            <span><strong>Dibuat</strong>{{ formatDate(activePulse.created) }}</span>
            <span><strong>Diubah</strong>{{ formatDate(activePulse.modified) }}</span>
          </div>

          <section class="tif-block">
            <div class="tif-block-head">
              <h3>Tag Ancaman</h3>
              <span>{{ activePulse.tags.length }} tag</span>
            </div>
            <div class="tif-pills">
              <button
                v-for="tag in activePulse.tags"
                :key="tag"
                type="button"
                @click="usePreset(tag)"
              >
                {{ tag }}
              </button>
              <span v-if="!activePulse.tags.length" class="tif-empty">Tidak ada tag.</span>
            </div>
          </section>

          <section class="tif-block">
            <div class="tif-block-head">
              <h3>Indikator Kompromi</h3>
              <span>{{ activePulse.indicatorCount }} IOC</span>
            </div>
            <div class="tif-ioc-list">
              <div v-for="indicator in activeIndicators" :key="indicator.key" class="tif-ioc">
                <span>{{ indicator.type }}</span>
                <strong>{{ indicator.value }}</strong>
              </div>
              <div v-if="!activeIndicators.length" class="tif-empty">Indikator tidak tersedia pada hasil ringkas ini.</div>
            </div>
          </section>

          <section class="tif-block">
            <div class="tif-block-head">
              <h3>Referensi</h3>
              <span>{{ activePulse.references.length }} link</span>
            </div>
            <div class="tif-ref-list">
              <a
                v-for="ref in activePulse.references"
                :key="ref"
                :href="ref"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i class="fas fa-arrow-up-right-from-square"></i>
                {{ getHost(ref) }}
              </a>
              <span v-if="!activePulse.references.length" class="tif-empty">Belum ada referensi eksternal.</span>
            </div>
          </section>

          <section class="tif-block">
            <div class="tif-block-head">
              <h3>Konteks Target</h3>
              <span>OTX metadata</span>
            </div>
            <div class="tif-context">
              <div>
                <label>Adversary</label>
                <strong>{{ activePulse.adversary || '-' }}</strong>
              </div>
              <div>
                <label>Malware</label>
                <strong>{{ activePulse.malwareFamilies.length ? activePulse.malwareFamilies.join(', ') : '-' }}</strong>
              </div>
              <div>
                <label>Industri</label>
                <strong>{{ activePulse.industries.length ? activePulse.industries.join(', ') : '-' }}</strong>
              </div>
              <div>
                <label>Negara Target</label>
                <strong>{{ activePulse.targetCountries.length ? activePulse.targetCountries.join(', ') : '-' }}</strong>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
const API_KEY_STORAGE = "sibukpatuh.otxApiKey";

export default {
  name: "ThreatFeed",
  data() {
    return {
      apiKey: "",
      apiKeyDraft: "",
      query: "ransomware",
      queryDraft: "ransomware",
      page: 1,
      limit: 10,
      resultCount: 0,
      hasNextPage: false,
      pulses: [],
      activePulseId: "",
      authMode: "unknown",
      loading: false,
      error: "",
      sourceLabel: "OTX API via proxy",
      presets: ["ransomware", "phishing", "APT", "CVE", "banking trojan"],
    };
  },
  computed: {
    activePulse() {
      return this.pulses.find((pulse) => pulse.id === this.activePulseId) || this.pulses[0] || null;
    },
    totalIndicators() {
      return this.pulses.reduce((total, pulse) => total + (pulse.indicatorCount || 0), 0);
    },
    uniqueTagCount() {
      return new Set(this.pulses.flatMap((pulse) => pulse.tags)).size;
    },
    topTags() {
      const counts = new Map();
      this.pulses.forEach((pulse) => {
        pulse.tags.forEach((tag) => {
          const normalized = String(tag).trim();
          if (normalized) {
            counts.set(normalized, (counts.get(normalized) || 0) + 1);
          }
        });
      });

      return Array.from(counts, ([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, 10);
    },
    lastUpdatedLabel() {
      const dates = this.pulses
        .map((pulse) => new Date(pulse.modified).getTime())
        .filter((time) => Number.isFinite(time));

      if (!dates.length) {
        return "-";
      }

      return this.formatDate(new Date(Math.max(...dates)).toISOString(), { month: "short", day: "numeric" });
    },
    activeIndicators() {
      if (!this.activePulse) {
        return [];
      }

      return this.activePulse.indicators.slice(0, 12).map((indicator, index) => ({
        key: `${indicator.type}-${indicator.value}-${index}`,
        type: indicator.type || "indicator",
        value: indicator.value || "-",
      }));
    },
    keyHelpText() {
      if (this.authMode === "server-env") {
        return "Halaman ini sedang memakai OTX_API_KEY dari server melalui proxy /api/otx. Key lokal di browser biasanya tidak dibutuhkan.";
      }

      if (this.authMode === "client-header") {
        return "Request saat ini memakai key yang tersimpan di browser ini. Untuk deploy Vercel, sebaiknya tetap gunakan environment variable OTX_API_KEY.";
      }

      return "Untuk local/dev, kamu bisa isi key di browser ini. Untuk deploy server, simpan key sebagai environment variable OTX_API_KEY.";
    },
  },
  mounted() {
    this.apiKey = window.localStorage.getItem(API_KEY_STORAGE) || "";
    this.apiKeyDraft = this.apiKey;
    this.loadFeed();
  },
  methods: {
    async loadFeed() {
      this.loading = true;
      this.error = "";

      try {
        const payload = await this.fetchOtxPulses();
        this.resultCount = Number(payload.count) || 0;
        this.hasNextPage = Boolean(payload.next);
        this.pulses = this.normalizePulses(payload.results || []);
        this.activePulseId = this.pulses[0]?.id || "";
      } catch (error) {
        this.error = this.toFriendlyError(error);
        this.pulses = [];
        this.resultCount = 0;
        this.hasNextPage = false;
      } finally {
        this.loading = false;
      }
    },
    async fetchOtxPulses() {
      const params = new URLSearchParams({
        q: this.query,
        page: String(this.page),
        limit: String(this.limit),
      });
      const headers = { Accept: "application/json" };
      this.authMode = this.apiKey ? "client-header" : "unknown";

      if (this.apiKey) {
        headers["X-OTX-API-KEY"] = this.apiKey;
      }

      const payload = await this.requestJson(`/api/otx?${params.toString()}`, headers);
      this.sourceLabel = "OTX API via proxy";
      return payload;
    },
    async requestJson(url, headers) {
      const response = await fetch(url, { headers });
      const authMode = response.headers.get("x-sibukpatuh-otx-auth-mode");
      const text = await response.text();
      let payload = null;

      if (authMode) {
        this.authMode = authMode;
      }

      if (text) {
        try {
          payload = JSON.parse(text);
        } catch (error) {
          throw new Error(`Respons OTX tidak valid dari ${url}.`);
        }
      }

      if (!response.ok) {
        const detail = payload?.detail || payload?.error || payload?.message || response.statusText;
        throw new Error(`HTTP ${response.status}: ${detail}`);
      }

      if (!payload || !Array.isArray(payload.results)) {
        throw new Error("Respons OTX tidak berisi daftar results.");
      }

      return payload;
    },
    normalizePulses(results) {
      return results.map((pulse, index) => {
        const indicators = this.asArray(pulse.indicators).map((indicator) => ({
          type: indicator.type || indicator.indicator_type || indicator.observable_type || "indicator",
          value: indicator.indicator || indicator.value || indicator.observable || indicator.name || "",
        })).filter((indicator) => indicator.value);

        const tags = this.asArray(pulse.tags).map(String).filter(Boolean);
        const references = this.asArray(pulse.references || pulse.reference).map(String).filter(Boolean);
        const malwareFamilies = this.asArray(pulse.malware_families || pulse.malwareFamilies).map(String).filter(Boolean);
        const industries = this.asArray(pulse.industries).map(String).filter(Boolean);
        const targetCountries = this.asArray(pulse.targeted_countries || pulse.target_countries).map(String).filter(Boolean);

        return {
          id: String(pulse.id || pulse.pulse_id || pulse.name || `otx-pulse-${index}`),
          name: pulse.name || "Untitled OTX pulse",
          description: this.cleanText(pulse.description || pulse.summary || ""),
          author: pulse.author_name || pulse.author?.username || pulse.author || "OTX Community",
          created: pulse.created || pulse.created_at || "",
          modified: pulse.modified || pulse.updated || pulse.modified_at || pulse.created || "",
          tlp: String(pulse.tlp || pulse.TLP || "white").toUpperCase(),
          tags,
          references,
          indicators,
          indicatorCount: Number(pulse.indicator_count || pulse.indicators_count || pulse.ioc_count || indicators.length) || indicators.length,
          adversary: this.asArray(pulse.adversary).join(", "),
          malwareFamilies,
          industries,
          targetCountries,
        };
      });
    },
    asArray(value) {
      if (Array.isArray(value)) {
        return value;
      }

      if (typeof value === "string" && value.trim()) {
        return value.split(",").map((item) => item.trim()).filter(Boolean);
      }

      return [];
    },
    cleanText(value) {
      return String(value || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    },
    applySearch() {
      const nextQuery = this.queryDraft.trim() || "ransomware";
      this.query = nextQuery;
      this.queryDraft = nextQuery;
      this.page = 1;
      this.loadFeed();
    },
    usePreset(preset) {
      this.query = preset;
      this.queryDraft = preset;
      this.page = 1;
      this.loadFeed();
    },
    goPage(page) {
      if (page < 1) {
        return;
      }

      this.page = page;
      this.loadFeed();
    },
    saveApiKey() {
      this.apiKey = this.apiKeyDraft.trim();

      if (this.apiKey) {
        window.localStorage.setItem(API_KEY_STORAGE, this.apiKey);
      } else {
        window.localStorage.removeItem(API_KEY_STORAGE);
      }

      this.page = 1;
      this.loadFeed();
    },
    clearApiKey() {
      this.apiKey = "";
      this.apiKeyDraft = "";
      window.localStorage.removeItem(API_KEY_STORAGE);
      this.page = 1;
      this.loadFeed();
    },
    formatDate(value, options = {}) {
      if (!value) {
        return "-";
      }

      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return "-";
      }

      return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...options,
      }).format(date);
    },
    formatNumber(value) {
      return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
    },
    getHost(value) {
      try {
        return new URL(value).hostname.replace(/^www\./, "");
      } catch (error) {
        return value;
      }
    },
    toFriendlyError(error) {
      const message = String(error?.message || error || "");

      if (message.includes("401") || message.includes("403")) {
        return "OTX menolak request. Pastikan OTX_API_KEY di Vercel valid, atau isi key lokal saat testing dev.";
      }

      if (message.includes("404") && message.toLowerCase().includes("not found")) {
        return "Proxy /api/otx belum tersedia. Jalankan lewat Vite dev server atau deploy di Vercel agar proxy OTX aktif.";
      }

      if (message.includes("Failed to fetch") || message.includes("NetworkError") || message.includes("CORS")) {
        return "Request ke OTX belum berhasil. Cek koneksi, proxy /api/otx, atau API key OTX.";
      }

      return message || "Request OTX gagal.";
    },
  },
};
</script>

<style scoped>
.tif-page {
  display: grid;
  gap: 0.85rem;
}

.tif-hero,
.tif-toolbar,
.tif-panel {
  border: 1px solid rgba(20, 78, 114, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.055);
}

.tif-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 24rem;
  gap: 1rem;
  padding: 1rem;
  overflow: hidden;
}

.tif-hero-copy {
  padding: 0.35rem 0.25rem;
}

.tif-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.55rem;
  border-radius: 8px;
  color: #0f766e;
  background: rgba(15, 118, 110, 0.1);
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
}

.tif-title {
  margin: 0.8rem 0 0.35rem;
  color: #16324b;
  font-size: 1.85rem;
  font-weight: 900;
  line-height: 1.15;
}

.tif-lede {
  max-width: 860px;
  margin: 0;
  color: #5c6776;
  font-size: 0.94rem;
  line-height: 1.6;
}

.tif-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
  margin-top: 1rem;
}

.tif-metric {
  min-width: 0;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(15, 118, 110, 0.14);
  background: rgba(240, 253, 250, 0.68);
}

.tif-metric label,
.tif-key-panel label,
.tif-search label,
.tif-context label {
  display: block;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.tif-metric strong {
  display: block;
  color: #0f766e;
  font-size: 1.2rem;
  font-weight: 900;
  line-height: 1.2;
}

.tif-metric span {
  display: block;
  color: #64748b;
  font-size: 0.76rem;
  line-height: 1.4;
}

.tif-key-panel {
  align-self: stretch;
  padding: 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(185, 28, 28, 0.14);
  background: rgba(255, 247, 237, 0.82);
}

.tif-key-input,
.tif-search-row {
  display: flex;
  gap: 0.45rem;
  margin-top: 0.45rem;
}

.tif-key-input input,
.tif-search-row input {
  min-width: 0;
}

.tif-key-panel p {
  margin: 0.65rem 0 0;
  color: #7c2d12;
  font-size: 0.78rem;
  line-height: 1.5;
}

.tif-link-button {
  margin-top: 0.55rem;
  padding: 0;
  border: 0;
  color: #b91c1c;
  background: transparent;
  font-weight: 800;
}

.tif-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: end;
  padding: 0.9rem;
}

.tif-presets,
.tif-tag-cloud,
.tif-pills,
.tif-ref-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tif-presets button,
.tif-tag-cloud button,
.tif-pills button,
.tif-ref-list a {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2rem;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid rgba(20, 78, 114, 0.12);
  color: #16324b;
  background: rgba(255, 255, 255, 0.86);
  font-size: 0.78rem;
  font-weight: 800;
  text-decoration: none;
}

.tif-presets button.active,
.tif-tag-cloud button:hover,
.tif-pills button:hover,
.tif-ref-list a:hover {
  color: #0f766e;
  border-color: rgba(15, 118, 110, 0.28);
  background: rgba(15, 118, 110, 0.1);
}

.tif-tag-cloud {
  margin-bottom: 0.7rem;
}

.tif-tag-cloud strong {
  color: #b91c1c;
}

.tif-workspace {
  display: grid;
  grid-template-columns: minmax(19rem, 0.86fr) minmax(0, 1.14fr);
  gap: 0.85rem;
}

.tif-panel {
  min-width: 0;
  padding: 0.9rem;
}

.tif-head,
.tif-block-head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.tif-head h2,
.tif-block h3 {
  margin: 0;
  color: #16324b;
  font-size: 1rem;
  font-weight: 900;
}

.tif-head p {
  margin: 0.15rem 0 0;
  color: #64748b;
  font-size: 0.78rem;
}

.tif-chip,
.tif-block-head span {
  flex-shrink: 0;
  padding: 0.32rem 0.5rem;
  border-radius: 8px;
  color: #0f766e;
  background: rgba(15, 118, 110, 0.1);
  font-size: 0.72rem;
  font-weight: 900;
}

.tif-list {
  display: grid;
  gap: 0.55rem;
  max-height: 46rem;
  overflow-y: auto;
  padding-right: 0.15rem;
}

.tif-item {
  width: 100%;
  min-width: 0;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(20, 78, 114, 0.1);
  color: inherit;
  background: rgba(255, 255, 255, 0.72);
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
}

.tif-item:hover,
.tif-item.active {
  border-color: rgba(15, 118, 110, 0.34);
  background: rgba(240, 253, 250, 0.86);
  transform: translateY(-1px);
}

.tif-item-top,
.tif-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  align-items: center;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 800;
}

.tif-item-code {
  color: #b91c1c;
}

.tif-item strong {
  display: block;
  margin-top: 0.45rem;
  color: #16324b;
  font-size: 0.92rem;
  font-weight: 900;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.tif-item p {
  display: -webkit-box;
  margin: 0.35rem 0 0.5rem;
  overflow: hidden;
  color: #5c6776;
  font-size: 0.78rem;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.tif-pagination {
  display: flex;
  justify-content: space-between;
  gap: 0.7rem;
  align-items: center;
  margin-top: 0.85rem;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 800;
}

.tif-detail {
  min-height: 44rem;
}

.tif-detail-head {
  padding: 0.85rem;
  border-radius: 8px;
  color: #fff;
  background: linear-gradient(135deg, #0f766e 0%, #365314 100%);
}

.tif-detail-head small {
  display: block;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
}

.tif-detail-head h2 {
  margin: 0.35rem 0 0.25rem;
  font-size: 1.15rem;
  font-weight: 900;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.tif-detail-head p {
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.82rem;
  line-height: 1.55;
}

.tif-detail-body {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.8rem;
}

.tif-meta-grid,
.tif-context {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.55rem;
}

.tif-meta-grid span,
.tif-context div {
  min-width: 0;
  padding: 0.65rem;
  border-radius: 8px;
  border: 1px solid rgba(20, 78, 114, 0.1);
  background: rgba(248, 250, 252, 0.78);
  color: #64748b;
  font-size: 0.75rem;
}

.tif-meta-grid strong,
.tif-context strong {
  display: block;
  color: #16324b;
  font-size: 0.82rem;
  font-weight: 900;
  overflow-wrap: anywhere;
}

.tif-block {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(20, 78, 114, 0.1);
  background: rgba(255, 255, 255, 0.64);
}

.tif-ioc-list {
  display: grid;
  gap: 0.45rem;
}

.tif-ioc {
  display: grid;
  grid-template-columns: 8rem minmax(0, 1fr);
  gap: 0.55rem;
  align-items: center;
  padding: 0.55rem 0.6rem;
  border-radius: 8px;
  background: rgba(240, 253, 250, 0.75);
}

.tif-ioc span {
  color: #0f766e;
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
}

.tif-ioc strong {
  color: #16324b;
  font-size: 0.82rem;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.tif-empty {
  color: #64748b;
  font-size: 0.82rem;
}

.btn {
  border-radius: 8px;
  font-weight: 800;
}

@media (max-width: 1199.98px) {
  .tif-hero,
  .tif-workspace {
    grid-template-columns: 1fr;
  }

  .tif-key-panel {
    max-width: none;
  }
}

@media (max-width: 991.98px) {
  .tif-toolbar,
  .tif-metrics,
  .tif-meta-grid,
  .tif-context {
    grid-template-columns: 1fr 1fr;
  }

  .tif-toolbar {
    align-items: stretch;
  }
}

@media (max-width: 767.98px) {
  .tif-hero,
  .tif-toolbar,
  .tif-panel {
    padding: 0.75rem;
  }

  .tif-title {
    font-size: 1.45rem;
  }

  .tif-metrics,
  .tif-toolbar,
  .tif-meta-grid,
  .tif-context,
  .tif-key-input,
  .tif-search-row,
  .tif-ioc {
    grid-template-columns: 1fr;
  }

  .tif-key-input,
  .tif-search-row {
    display: grid;
  }

  .tif-list {
    max-height: none;
    overflow: visible;
  }

  .tif-pagination {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
