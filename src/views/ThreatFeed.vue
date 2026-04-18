<template>
  <div class="tif-page">
    <section class="tif-hero">
      <div class="tif-hero-copy">
        <span class="tif-kicker"><i class="fas fa-satellite-dish"></i> Threat Intelligence Feed</span>
        <h1 class="tif-title">Pantauan Pulse OTX</h1>
        <p class="tif-lede">
          Ikuti sinyal ancaman dari AlienVault OTX untuk membaca ringkasan pulse, indikator kompromi, tag ancaman,
          dan referensi investigasi, lalu lanjutkan ke lookup IOC, geolokasi IP, hash checking, whois enrichment,
          dan widget khusus ancaman di Indonesia.
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

    <section class="tif-tools" aria-label="Threat intelligence tools">
      <article class="tif-tool-card tif-tool-card-wide">
        <div class="tif-tool-head">
          <div>
            <span class="tif-tool-kicker">hostname/general + IPv4/general</span>
            <h2>IOC Lookup Tool</h2>
          </div>
          <span class="tif-chip">Lookup dasar indikator</span>
        </div>

        <form class="tif-tool-form" @submit.prevent="lookupIoc">
          <div class="tif-search-row">
            <input
              v-model="iocInput"
              type="search"
              class="form-control"
              placeholder="Masukkan IPv4 atau hostname, contoh 8.8.8.8 atau google.com"
            >
            <button type="submit" class="btn btn-primary" :disabled="iocLoading">
              <i class="fas fa-search"></i>
              Lookup
            </button>
          </div>
        </form>

        <p class="tif-tool-help">
          Otomatis mendeteksi indikator IP atau hostname, lalu menampilkan reputasi, pulse count, validasi, dan konteks ancaman.
        </p>

        <div v-if="iocLoading" class="tif-tool-placeholder">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Mengambil ringkasan indikator dari OTX...</span>
        </div>

        <p v-else-if="iocError" class="tif-tool-error">{{ iocError }}</p>

        <div v-else-if="iocResult" class="tif-tool-stack">
          <div class="tif-tool-metrics compact">
            <div class="tif-tool-stat">
              <label>Indicator</label>
              <strong>{{ iocResult.indicator }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>Tipe</label>
              <strong>{{ iocResult.typeTitle }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>Pulse</label>
              <strong>{{ formatNumber(iocResult.pulseCount) }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>Reputasi</label>
              <strong>{{ iocResult.reputation === null ? "-" : iocResult.reputation }}</strong>
            </div>
          </div>

          <div class="tif-inline-actions">
            <button
              v-if="iocResult.typeKey === 'IPv4'"
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="useIocForGeo"
            >
              Bawa ke Peta IP
            </button>
            <button
              v-if="iocResult.typeKey === 'hostname'"
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="useIocForWhois"
            >
              Bawa ke Whois
            </button>
            <a
              v-if="iocResult.whois"
              :href="iocResult.whois"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline-secondary btn-sm"
            >
              Whois
            </a>
            <a
              v-if="iocResult.alexa"
              :href="iocResult.alexa"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-outline-secondary btn-sm"
            >
              Alexa
            </a>
          </div>

          <div class="tif-field-grid">
            <div class="tif-field">
              <label>Lokasi</label>
              <strong>{{ iocResult.locationLabel || "-" }}</strong>
            </div>
            <div class="tif-field">
              <label>ASN / Domain</label>
              <strong>{{ iocResult.asn || iocResult.domain || "-" }}</strong>
            </div>
            <div class="tif-field">
              <label>Section</label>
              <strong>{{ iocResult.sections.length ? iocResult.sections.join(", ") : "-" }}</strong>
            </div>
          </div>

          <section v-if="iocResult.validation.length" class="tif-subsection">
            <div class="tif-block-head">
              <h3>Validasi OTX</h3>
              <span>{{ iocResult.validation.length }} sinyal</span>
            </div>
            <div class="tif-pills">
              <span v-for="item in iocResult.validation" :key="`${item.name}-${item.message}`" class="tif-chip-soft">
                {{ item.name }}
              </span>
            </div>
          </section>

          <section v-if="iocResult.relatedMalware.length || iocResult.relatedIndustries.length || iocResult.relatedAdversaries.length" class="tif-subsection">
            <div class="tif-block-head">
              <h3>Konteks Terkait</h3>
              <span>Pulse enrichment</span>
            </div>
            <div class="tif-context">
              <div>
                <label>Malware</label>
                <strong>{{ iocResult.relatedMalware.length ? iocResult.relatedMalware.join(", ") : "-" }}</strong>
              </div>
              <div>
                <label>Industri</label>
                <strong>{{ iocResult.relatedIndustries.length ? iocResult.relatedIndustries.join(", ") : "-" }}</strong>
              </div>
              <div>
                <label>Adversary</label>
                <strong>{{ iocResult.relatedAdversaries.length ? iocResult.relatedAdversaries.join(", ") : "-" }}</strong>
              </div>
              <div>
                <label>Sumber</label>
                <strong>{{ sourceLabel }}</strong>
              </div>
            </div>
          </section>

          <section v-if="iocResult.pulses.length" class="tif-subsection">
            <div class="tif-block-head">
              <h3>Pulse Terkait</h3>
              <span>{{ iocResult.pulses.length }} preview</span>
            </div>
            <div class="tif-mini-list">
              <div v-for="pulse in iocResult.pulses" :key="pulse.id" class="tif-mini-item">
                <strong>{{ pulse.name }}</strong>
                <p>{{ pulse.description || "Belum ada ringkasan." }}</p>
                <div class="tif-mini-meta">
                  <span>{{ pulse.author }}</span>
                  <span>{{ formatDate(pulse.modified) }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <p v-else class="tif-empty">
          Belum ada lookup. Masukkan indikator untuk melihat reputasi, validasi, dan pulse terkait.
        </p>
      </article>

      <article class="tif-tool-card">
        <div class="tif-tool-head">
          <div>
            <span class="tif-tool-kicker">IPv4/geo</span>
            <h2>Peta Asal IP</h2>
          </div>
          <span class="tif-chip">Geolokasi cepat</span>
        </div>

        <form class="tif-tool-form" @submit.prevent="lookupGeo">
          <div class="tif-search-row">
            <input
              v-model="geoInput"
              type="search"
              class="form-control"
              placeholder="Masukkan IPv4, contoh 8.8.8.8"
            >
            <button type="submit" class="btn btn-primary" :disabled="geoLoading">
              <i class="fas fa-location-dot"></i>
              Tampilkan
            </button>
          </div>
        </form>

        <p class="tif-tool-help">
          Menampilkan koordinat, negara, ASN, dan peta titik kasar berdasarkan data geolokasi OTX.
        </p>

        <div v-if="geoLoading" class="tif-tool-placeholder">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Mengambil data geolokasi IP...</span>
        </div>

        <p v-else-if="geoError" class="tif-tool-error">{{ geoError }}</p>

        <div v-else-if="geoResult" class="tif-tool-stack">
          <div class="tif-geo-map">
            <div class="tif-geo-map-grid"></div>
            <div v-if="geoResult.hasCoordinates" class="tif-geo-marker" :style="geoMarkerStyle"></div>
            <div class="tif-geo-map-label">
              <span>{{ geoResult.countryName || "Lokasi tidak diketahui" }}</span>
              <strong>{{ geoResult.locationLabel || geoResult.asn || "Koordinat terbatas" }}</strong>
            </div>
          </div>

          <div class="tif-tool-metrics compact">
            <div class="tif-tool-stat">
              <label>Negara</label>
              <strong>{{ geoResult.countryName || "-" }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>Kota / Region</label>
              <strong>{{ geoResult.locationLabel || "-" }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>Koordinat</label>
              <strong>{{ geoResult.coordinateLabel }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>ASN</label>
              <strong>{{ geoResult.asn || "-" }}</strong>
            </div>
          </div>

          <div class="tif-inline-actions" v-if="geoResult.mapUrl">
            <a :href="geoResult.mapUrl" target="_blank" rel="noopener noreferrer" class="btn btn-outline-secondary btn-sm">
              Buka di OpenStreetMap
            </a>
          </div>
        </div>

        <p v-else class="tif-empty">
          Masukkan IP untuk menaruh marker lokasi dan membaca konteks negara asalnya.
        </p>
      </article>

      <article class="tif-tool-card">
        <div class="tif-tool-head">
          <div>
            <span class="tif-tool-kicker">file/{hash}/general</span>
            <h2>Hash Checker Malware</h2>
          </div>
          <span class="tif-chip">MD5 / SHA1 / SHA256</span>
        </div>

        <form class="tif-tool-form" @submit.prevent="lookupHash">
          <div class="tif-search-row">
            <input
              v-model="hashInput"
              type="search"
              class="form-control"
              placeholder="Masukkan hash file, contoh SHA256"
            >
            <button type="submit" class="btn btn-primary" :disabled="hashLoading">
              <i class="fas fa-fingerprint"></i>
              Cek Hash
            </button>
          </div>
        </form>

        <p class="tif-tool-help">
          Mengecek apakah hash muncul di pulse OTX, termasuk format hash, sinyal validasi, dan preview pulse terkait.
        </p>

        <div v-if="hashLoading" class="tif-tool-placeholder">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Memeriksa hash terhadap OTX...</span>
        </div>

        <p v-else-if="hashError" class="tif-tool-error">{{ hashError }}</p>

        <div v-else-if="hashResult" class="tif-tool-stack">
          <div class="tif-tool-metrics compact">
            <div class="tif-tool-stat">
              <label>Indicator</label>
              <strong>{{ hashResult.indicator }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>Format</label>
              <strong>{{ hashResult.typeTitle }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>Pulse</label>
              <strong>{{ formatNumber(hashResult.pulseCount) }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>Section</label>
              <strong>{{ hashResult.sections.length ? hashResult.sections.join(", ") : "-" }}</strong>
            </div>
          </div>

          <section v-if="hashResult.validation.length" class="tif-subsection">
            <div class="tif-block-head">
              <h3>Validasi</h3>
              <span>{{ hashResult.validation.length }} sinyal</span>
            </div>
            <div class="tif-pills">
              <span v-for="item in hashResult.validation" :key="`${item.name}-${item.message}`" class="tif-chip-soft">
                {{ item.name }}
              </span>
            </div>
          </section>

          <section v-if="hashResult.relatedMalware.length || hashResult.relatedIndustries.length" class="tif-subsection">
            <div class="tif-block-head">
              <h3>Konteks Malware</h3>
              <span>Ringkasan relasi</span>
            </div>
            <div class="tif-context">
              <div>
                <label>Malware</label>
                <strong>{{ hashResult.relatedMalware.length ? hashResult.relatedMalware.join(", ") : "-" }}</strong>
              </div>
              <div>
                <label>Industri</label>
                <strong>{{ hashResult.relatedIndustries.length ? hashResult.relatedIndustries.join(", ") : "-" }}</strong>
              </div>
              <div>
                <label>Adversary</label>
                <strong>{{ hashResult.relatedAdversaries.length ? hashResult.relatedAdversaries.join(", ") : "-" }}</strong>
              </div>
              <div>
                <label>Base Type</label>
                <strong>{{ hashResult.typeKey || "-" }}</strong>
              </div>
            </div>
          </section>

          <section v-if="hashResult.pulses.length" class="tif-subsection">
            <div class="tif-block-head">
              <h3>Pulse yang Memuat Hash</h3>
              <span>{{ hashResult.pulses.length }} preview</span>
            </div>
            <div class="tif-mini-list">
              <div v-for="pulse in hashResult.pulses" :key="pulse.id" class="tif-mini-item">
                <strong>{{ pulse.name }}</strong>
                <p>{{ pulse.description || "Belum ada ringkasan." }}</p>
                <div class="tif-mini-meta">
                  <span>{{ pulse.author }}</span>
                  <span>{{ formatDate(pulse.modified) }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <p v-else class="tif-empty">
          Belum ada hash yang dicek. Tempel MD5, SHA1, atau SHA256 untuk melihat apakah ia muncul di OTX.
        </p>
      </article>

      <article class="tif-tool-card">
        <div class="tif-tool-head">
          <div>
            <span class="tif-tool-kicker">hostname/whois</span>
            <h2>Whois Enrichment</h2>
          </div>
          <span class="tif-chip">Registrasi domain</span>
        </div>

        <form class="tif-tool-form" @submit.prevent="lookupWhois">
          <div class="tif-search-row">
            <input
              v-model="whoisInput"
              type="search"
              class="form-control"
              placeholder="Masukkan hostname, contoh google.com"
            >
            <button type="submit" class="btn btn-primary" :disabled="whoisLoading">
              <i class="fas fa-id-card"></i>
              Whois
            </button>
          </div>
        </form>

        <p class="tif-tool-help">
          Menampilkan registrar, nama server, kontak, status domain, dan domain terkait dari data whois OTX.
        </p>

        <div v-if="whoisLoading" class="tif-tool-placeholder">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Mengambil data whois domain...</span>
        </div>

        <p v-else-if="whoisError" class="tif-tool-error">{{ whoisError }}</p>

        <div v-else-if="whoisResult" class="tif-tool-stack">
          <div class="tif-field-grid">
            <div v-for="item in whoisResult.summary" :key="item.label" class="tif-field">
              <label>{{ item.label }}</label>
              <strong>{{ item.value }}</strong>
            </div>
          </div>

          <section v-if="whoisResult.contacts.length" class="tif-subsection">
            <div class="tif-block-head">
              <h3>Kontak</h3>
              <span>{{ whoisResult.contacts.length }} field</span>
            </div>
            <div class="tif-field-grid">
              <div v-for="item in whoisResult.contacts" :key="item.label" class="tif-field">
                <label>{{ item.label }}</label>
                <strong>{{ item.value }}</strong>
              </div>
            </div>
          </section>

          <section v-if="whoisResult.emails.length" class="tif-subsection">
            <div class="tif-block-head">
              <h3>Email</h3>
              <span>{{ whoisResult.emails.length }} alamat</span>
            </div>
            <div class="tif-pills">
              <span v-for="value in whoisResult.emails" :key="value" class="tif-chip-soft">
                {{ value }}
              </span>
            </div>
          </section>

          <section v-if="whoisResult.nameServers.length" class="tif-subsection">
            <div class="tif-block-head">
              <h3>Name Server</h3>
              <span>{{ whoisResult.nameServers.length }} NS</span>
            </div>
            <div class="tif-pills">
              <span v-for="value in whoisResult.nameServers" :key="value" class="tif-chip-soft">
                {{ value }}
              </span>
            </div>
          </section>

          <section v-if="whoisResult.statuses.length" class="tif-subsection">
            <div class="tif-block-head">
              <h3>Status Domain</h3>
              <span>{{ whoisResult.statuses.length }} status</span>
            </div>
            <div class="tif-pills">
              <span v-for="value in whoisResult.statuses" :key="value" class="tif-chip-soft">
                {{ value }}
              </span>
            </div>
          </section>

          <section v-if="whoisResult.related.length" class="tif-subsection">
            <div class="tif-block-head">
              <h3>Domain Terkait</h3>
              <span>{{ whoisResult.related.length }} relasi</span>
            </div>
            <div class="tif-mini-list">
              <div v-for="item in whoisResult.related" :key="`${item.domain}-${item.related}`" class="tif-mini-item">
                <strong>{{ item.domain }}</strong>
                <p>{{ item.relatedType }}: {{ item.related }}</p>
              </div>
            </div>
          </section>
        </div>

        <p v-else class="tif-empty">
          Belum ada whois enrichment. Masukkan hostname untuk membaca registrasi domain dan relasi kontaknya.
        </p>
      </article>

      <article class="tif-tool-card tif-tool-card-wide">
        <div class="tif-tool-head">
          <div>
            <span class="tif-tool-kicker">pulses/search?q=indonesia</span>
            <h2>Widget "Ancaman di Indonesia"</h2>
          </div>
          <div class="tif-inline-actions">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="loadIndonesiaWidget" :disabled="indonesiaLoading">
              Refresh
            </button>
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="openIndonesiaFeed">
              Buka di Feed
            </button>
          </div>
        </div>

        <p class="tif-tool-help">
          Widget ini memantau hasil pencarian pulse bertema Indonesia secara terpisah dari feed utama, supaya ada sudut pandang regional yang selalu siap dilihat.
        </p>

        <div v-if="indonesiaLoading" class="tif-tool-placeholder">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Memuat pulse bertema Indonesia...</span>
        </div>

        <p v-else-if="indonesiaError" class="tif-tool-error">{{ indonesiaError }}</p>

        <div v-else class="tif-tool-stack">
          <div class="tif-tool-metrics compact">
            <div class="tif-tool-stat">
              <label>Pulse</label>
              <strong>{{ formatNumber(indonesiaCount) }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>Preview</label>
              <strong>{{ formatNumber(indonesiaPulses.length) }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>Status</label>
              <strong>{{ sourceLabel }}</strong>
            </div>
            <div class="tif-tool-stat">
              <label>Kueri</label>
              <strong>indonesia</strong>
            </div>
          </div>

          <div class="tif-pills" v-if="indonesiaTopTags.length">
            <span v-for="tag in indonesiaTopTags" :key="tag.name" class="tif-chip-soft">
              {{ tag.name }} - {{ tag.count }}
            </span>
          </div>

          <div v-if="indonesiaPulses.length" class="tif-mini-list">
            <div v-for="pulse in indonesiaPulses" :key="pulse.id" class="tif-mini-item">
              <strong>{{ pulse.name }}</strong>
              <p>{{ pulse.description || "Belum ada ringkasan." }}</p>
              <div class="tif-mini-meta">
                <span>{{ pulse.author }}</span>
                <span>{{ formatDate(pulse.modified) }}</span>
              </div>
            </div>
          </div>

          <p v-else class="tif-empty">Belum ada pulse yang cocok untuk kueri Indonesia saat ini.</p>
        </div>
      </article>
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

        <div v-if="topTags.length" class="tif-tag-cloud">
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
            <p>{{ pulse.description || "Belum ada deskripsi ringkas dari OTX." }}</p>
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
          <h2>{{ activePulse ? activePulse.name : "Pilih pulse" }}</h2>
          <p>
            {{ activePulse ? activePulse.description || "Belum ada deskripsi ringkas dari OTX." : "Pilih salah satu pulse untuk membaca konteks indikator." }}
          </p>
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
                <strong>{{ activePulse.adversary || "-" }}</strong>
              </div>
              <div>
                <label>Malware</label>
                <strong>{{ activePulse.malwareFamilies.length ? activePulse.malwareFamilies.join(", ") : "-" }}</strong>
              </div>
              <div>
                <label>Industri</label>
                <strong>{{ activePulse.industries.length ? activePulse.industries.join(", ") : "-" }}</strong>
              </div>
              <div>
                <label>Negara Target</label>
                <strong>{{ activePulse.targetCountries.length ? activePulse.targetCountries.join(", ") : "-" }}</strong>
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
const OTX_ORIGIN = "https://otx.alienvault.com";

export default {
  name: "ThreatFeed",
  data() {
    return {
      apiKey: "",
      apiKeyDraft: "",
      authMode: "unknown",
      sourceLabel: "OTX API via proxy",

      query: "ransomware",
      queryDraft: "ransomware",
      page: 1,
      limit: 10,
      resultCount: 0,
      hasNextPage: false,
      pulses: [],
      activePulseId: "",
      loading: false,
      error: "",
      presets: ["ransomware", "phishing", "APT", "CVE", "banking trojan", "indonesia"],

      iocInput: "",
      iocLoading: false,
      iocError: "",
      iocResult: null,

      geoInput: "",
      geoLoading: false,
      geoError: "",
      geoResult: null,

      hashInput: "",
      hashLoading: false,
      hashError: "",
      hashResult: null,

      whoisInput: "",
      whoisLoading: false,
      whoisError: "",
      whoisResult: null,

      indonesiaLoading: false,
      indonesiaError: "",
      indonesiaPulses: [],
      indonesiaCount: 0,
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
      return this.buildTopTags(this.pulses);
    },
    indonesiaTopTags() {
      return this.buildTopTags(this.indonesiaPulses).slice(0, 8);
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
    geoMarkerStyle() {
      if (!this.geoResult?.hasCoordinates) {
        return {};
      }

      const x = Math.min(96, Math.max(4, ((this.geoResult.longitude + 180) / 360) * 100));
      const y = Math.min(92, Math.max(8, ((90 - this.geoResult.latitude) / 180) * 100));

      return {
        left: `calc(${x}% - 0.55rem)`,
        top: `calc(${y}% - 0.55rem)`,
      };
    },
  },
  mounted() {
    this.apiKey = window.localStorage.getItem(API_KEY_STORAGE) || "";
    this.apiKeyDraft = this.apiKey;
    this.loadFeed();
    this.loadIndonesiaWidget();
  },
  methods: {
    async loadFeed() {
      this.loading = true;
      this.error = "";

      try {
        const payload = await this.fetchPulseSearch({
          query: this.query,
          page: this.page,
          limit: this.limit,
        });

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
    async loadIndonesiaWidget() {
      this.indonesiaLoading = true;
      this.indonesiaError = "";

      try {
        const payload = await this.fetchPulseSearch({
          query: "indonesia",
          page: 1,
          limit: 4,
        });

        this.indonesiaCount = Number(payload.count) || 0;
        this.indonesiaPulses = this.normalizePulses(payload.results || []);
      } catch (error) {
        this.indonesiaError = this.toFriendlyError(error);
        this.indonesiaCount = 0;
        this.indonesiaPulses = [];
      } finally {
        this.indonesiaLoading = false;
      }
    },
    async fetchPulseSearch({ query, page, limit }) {
      const params = new URLSearchParams({
        mode: "pulses",
        q: query,
        page: String(page),
        limit: String(limit),
      });

      const payload = await this.requestJson(`/api/otx?${params.toString()}`, this.buildRequestHeaders());

      if (!payload || !Array.isArray(payload.results)) {
        throw new Error("Respons OTX tidak berisi daftar results.");
      }

      this.sourceLabel = "OTX API via proxy";
      return payload;
    },
    async fetchIndicator({ indicatorType, value, section }) {
      const params = new URLSearchParams({
        mode: "indicator",
        indicatorType,
        value,
        section,
      });

      const payload = await this.requestJson(`/api/otx?${params.toString()}`, this.buildRequestHeaders());
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

      return payload;
    },
    buildRequestHeaders() {
      const headers = { Accept: "application/json" };

      if (this.apiKey) {
        headers["X-OTX-API-KEY"] = this.apiKey;
        this.authMode = "client-header";
      } else {
        this.authMode = "unknown";
      }

      return headers;
    },
    async lookupIoc() {
      const value = this.normalizeLookupValue(this.iocInput);
      const indicatorType = this.detectIocType(value);

      this.iocError = "";

      if (!indicatorType) {
        this.iocResult = null;
        this.iocError = "Masukkan IPv4 atau hostname yang valid untuk lookup IOC.";
        return;
      }

      this.iocLoading = true;
      this.iocInput = value;

      try {
        const payload = await this.fetchIndicator({
          indicatorType,
          value,
          section: "general",
        });

        this.iocResult = this.normalizeGeneralIndicator(payload, indicatorType);

        if (indicatorType === "IPv4") {
          this.geoInput = value;
        } else if (indicatorType === "hostname") {
          this.whoisInput = value;
        }
      } catch (error) {
        this.iocResult = null;
        this.iocError = this.toFriendlyError(error);
      } finally {
        this.iocLoading = false;
      }
    },
    async lookupGeo() {
      const value = this.normalizeLookupValue(this.geoInput);

      this.geoError = "";

      if (this.detectIocType(value) !== "IPv4") {
        this.geoResult = null;
        this.geoError = "Masukkan IPv4 yang valid untuk menampilkan peta asal IP.";
        return;
      }

      this.geoLoading = true;
      this.geoInput = value;

      try {
        const payload = await this.fetchIndicator({
          indicatorType: "IPv4",
          value,
          section: "geo",
        });

        this.geoResult = this.normalizeGeo(payload, value);
      } catch (error) {
        this.geoResult = null;
        this.geoError = this.toFriendlyError(error);
      } finally {
        this.geoLoading = false;
      }
    },
    async lookupHash() {
      const value = String(this.hashInput || "").trim();
      const hashType = this.detectHashType(value);

      this.hashError = "";

      if (!hashType) {
        this.hashResult = null;
        this.hashError = "Masukkan hash MD5, SHA1, atau SHA256 yang valid.";
        return;
      }

      this.hashLoading = true;
      this.hashInput = value;

      try {
        const payload = await this.fetchIndicator({
          indicatorType: "file",
          value,
          section: "general",
        });

        this.hashResult = this.normalizeGeneralIndicator(payload, hashType);
      } catch (error) {
        this.hashResult = null;
        this.hashError = this.toFriendlyError(error);
      } finally {
        this.hashLoading = false;
      }
    },
    async lookupWhois() {
      const value = this.normalizeHostnameValue(this.whoisInput);

      this.whoisError = "";

      if (!value || this.detectIocType(value) !== "hostname") {
        this.whoisResult = null;
        this.whoisError = "Masukkan hostname yang valid untuk whois enrichment.";
        return;
      }

      this.whoisLoading = true;
      this.whoisInput = value;

      try {
        const payload = await this.fetchIndicator({
          indicatorType: "hostname",
          value,
          section: "whois",
        });

        this.whoisResult = this.normalizeWhois(payload);
      } catch (error) {
        this.whoisResult = null;
        this.whoisError = this.toFriendlyError(error);
      } finally {
        this.whoisLoading = false;
      }
    },
    useIocForGeo() {
      if (!this.iocResult?.indicator) {
        return;
      }

      this.geoInput = this.iocResult.indicator;
      this.lookupGeo();
    },
    useIocForWhois() {
      if (!this.iocResult?.indicator) {
        return;
      }

      this.whoisInput = this.iocResult.indicator;
      this.lookupWhois();
    },
    async openIndonesiaFeed() {
      this.query = "indonesia";
      this.queryDraft = "indonesia";
      this.page = 1;
      await this.loadFeed();
    },
    normalizeGeneralIndicator(payload, fallbackType) {
      const pulses = this.normalizePulses(this.asArray(payload?.pulse_info?.pulses)).slice(0, 4);
      const reputation = Number(payload?.reputation);

      return {
        indicator: String(payload?.indicator || payload?.domain || "").trim() || "-",
        typeKey: String(payload?.type || fallbackType || "").trim(),
        typeTitle: String(payload?.type_title || payload?.type || fallbackType || "").trim() || "-",
        domain: String(payload?.domain || "").trim(),
        pulseCount: Number(payload?.pulse_info?.count) || pulses.length,
        reputation: Number.isFinite(reputation) ? reputation : null,
        whois: String(payload?.whois || "").trim(),
        alexa: String(payload?.alexa || "").trim(),
        asn: String(payload?.asn || "").trim(),
        locationLabel: [payload?.city, payload?.region, payload?.country_name].filter(Boolean).join(", "),
        sections: this.uniqueStrings(this.asArray(payload?.sections)),
        validation: this.normalizeValidation(payload?.validation),
        pulses,
        relatedMalware: this.uniqueStrings([
          ...this.extractDisplayValues(payload?.pulse_info?.related?.alienvault?.malware_families),
          ...this.extractDisplayValues(payload?.pulse_info?.related?.other?.malware_families),
        ]).slice(0, 10),
        relatedIndustries: this.uniqueStrings([
          ...this.extractDisplayValues(payload?.pulse_info?.related?.alienvault?.industries),
          ...this.extractDisplayValues(payload?.pulse_info?.related?.other?.industries),
        ]).slice(0, 10),
        relatedAdversaries: this.uniqueStrings([
          ...this.extractDisplayValues(payload?.pulse_info?.related?.alienvault?.adversary),
          ...this.extractDisplayValues(payload?.pulse_info?.related?.other?.adversary),
        ]).slice(0, 10),
      };
    },
    normalizeGeo(payload, indicator) {
      const latitude = Number(payload?.latitude);
      const longitude = Number(payload?.longitude);
      const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
      const locationLabel = [payload?.city, payload?.region].filter(Boolean).join(", ");
      const coordinateLabel = hasCoordinates ? `${latitude.toFixed(3)}, ${longitude.toFixed(3)}` : "-";

      return {
        indicator,
        countryName: String(payload?.country_name || payload?.country_code || "").trim(),
        locationLabel,
        asn: String(payload?.asn || "").trim(),
        latitude: hasCoordinates ? latitude : null,
        longitude: hasCoordinates ? longitude : null,
        hasCoordinates,
        coordinateLabel,
        flagUrl: payload?.flag_url ? new URL(payload.flag_url, OTX_ORIGIN).toString() : "",
        mapUrl: hasCoordinates
          ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=4/${latitude}/${longitude}`
          : "",
      };
    },
    normalizeWhois(payload) {
      const entries = this.asArray(payload?.data)
        .map((item) => ({
          key: String(item?.key || "").trim().toLowerCase(),
          label: String(item?.name || item?.key || "").trim(),
          value: String(item?.value || "").trim(),
        }))
        .filter((item) => item.key && item.value);

      const pickFirst = (...keys) => entries.find((item) => keys.includes(item.key))?.value || "";
      const pickMany = (...keys) => this.uniqueStrings(entries.filter((item) => keys.includes(item.key)).map((item) => item.value));

      return {
        summary: [
          { label: "Registrar", value: pickFirst("registrar") },
          { label: "Organisasi", value: pickFirst("org") },
          { label: "Negara", value: pickFirst("country") },
          { label: "Kota", value: pickFirst("city") },
          { label: "Dibuat", value: this.formatMaybeDate(pickFirst("creation_date")) },
          { label: "Diupdate", value: this.formatMaybeDate(pickFirst("updated_date")) },
          { label: "Kedaluwarsa", value: this.formatMaybeDate(pickFirst("expiration_date")) },
          { label: "Whois Server", value: pickFirst("whois_server") },
        ].filter((item) => item.value),
        contacts: [
          { label: "Nama", value: pickFirst("name") },
          { label: "Alamat", value: pickFirst("address") },
          { label: "State", value: pickFirst("state") },
          { label: "Zipcode", value: pickFirst("zipcode") },
        ].filter((item) => item.value),
        emails: pickMany("emails"),
        nameServers: pickMany("name_servers"),
        statuses: pickMany("status"),
        related: this.asArray(payload?.related).slice(0, 10).map((item) => ({
          domain: String(item?.domain || "-"),
          related: String(item?.related || "-"),
          relatedType: String(item?.related_type || "related"),
        })),
      };
    },
    normalizeValidation(items) {
      return this.asArray(items)
        .map((item) => ({
          name: String(item?.name || item?.source || "Signal").trim(),
          message: String(item?.message || "").trim(),
        }))
        .filter((item) => item.name);
    },
    extractDisplayValues(items) {
      return this.asArray(items).map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return item?.display_name || item?.name || item?.id || item?.target || "";
      });
    },
    buildTopTags(items) {
      const counts = new Map();

      items.forEach((item) => {
        this.asArray(item.tags).forEach((tag) => {
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
    normalizePulses(results) {
      return results.map((pulse, index) => {
        const indicators = this.asArray(pulse.indicators)
          .map((indicator) => ({
            type: indicator.type || indicator.indicator_type || indicator.observable_type || "indicator",
            value: indicator.indicator || indicator.value || indicator.observable || indicator.name || "",
          }))
          .filter((indicator) => indicator.value);

        const tags = this.asArray(pulse.tags).map(String).filter(Boolean);
        const references = this.asArray(pulse.references || pulse.reference).map(String).filter(Boolean);
        const malwareFamilies = this.extractDisplayValues(pulse.malware_families || pulse.malwareFamilies).filter(Boolean);
        const industries = this.extractDisplayValues(pulse.industries).filter(Boolean);
        const targetCountries = this.extractDisplayValues(pulse.targeted_countries || pulse.target_countries).filter(Boolean);

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
          adversary: this.extractDisplayValues(pulse.adversary).join(", "),
          malwareFamilies,
          industries,
          targetCountries,
        };
      });
    },
    detectIocType(value) {
      if (this.isValidIpv4(value)) {
        return "IPv4";
      }

      if (this.isValidHostname(value)) {
        return "hostname";
      }

      return "";
    },
    detectHashType(value) {
      if (/^[a-f0-9]{32}$/i.test(value)) {
        return "FileHash-MD5";
      }

      if (/^[a-f0-9]{40}$/i.test(value)) {
        return "FileHash-SHA1";
      }

      if (/^[a-f0-9]{64}$/i.test(value)) {
        return "FileHash-SHA256";
      }

      return "";
    },
    isValidIpv4(value) {
      return /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(value);
    },
    isValidHostname(value) {
      return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
    },
    normalizeLookupValue(value) {
      const text = String(value || "").trim();

      if (!text) {
        return "";
      }

      const hostnameCandidate = this.normalizeHostnameValue(text);
      return hostnameCandidate;
    },
    normalizeHostnameValue(value) {
      const text = String(value || "").trim();

      if (!text) {
        return "";
      }

      try {
        const normalizedUrl = text.includes("://") ? text : `http://${text}`;
        const url = new URL(normalizedUrl);
        return url.hostname;
      } catch (error) {
        return text.split("/")[0].replace(/:\d+$/, "").trim().toLowerCase();
      }
    },
    uniqueStrings(values) {
      return Array.from(
        new Set(
          this.asArray(values)
            .map((value) => String(value || "").trim())
            .filter(Boolean),
        ),
      );
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
      this.loadIndonesiaWidget();
    },
    clearApiKey() {
      this.apiKey = "";
      this.apiKeyDraft = "";
      window.localStorage.removeItem(API_KEY_STORAGE);
      this.page = 1;
      this.loadFeed();
      this.loadIndonesiaWidget();
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
    formatMaybeDate(value) {
      if (!value) {
        return "";
      }

      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? value : this.formatDate(value);
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

      if (message.includes("Unsupported indicatorType")) {
        return "Tipe indikator belum didukung oleh proxy aplikasi ini.";
      }

      if (message.includes("Missing indicator value")) {
        return "Nilai indikator belum diisi.";
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
.tif-panel,
.tif-tool-card {
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

.tif-kicker,
.tif-tool-kicker {
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

.tif-metrics,
.tif-tool-metrics {
  display: grid;
  gap: 0.65rem;
  margin-top: 1rem;
}

.tif-metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.tif-tool-metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.tif-tool-metrics.compact {
  margin-top: 0;
}

.tif-metric,
.tif-tool-stat {
  min-width: 0;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(15, 118, 110, 0.14);
  background: rgba(240, 253, 250, 0.68);
}

.tif-metric label,
.tif-key-panel label,
.tif-search label,
.tif-context label,
.tif-tool-stat label,
.tif-field label {
  display: block;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.tif-metric strong,
.tif-tool-stat strong,
.tif-field strong {
  display: block;
  color: #0f766e;
  font-size: 1.05rem;
  font-weight: 900;
  line-height: 1.25;
  overflow-wrap: anywhere;
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

.tif-key-panel p,
.tif-tool-help {
  margin: 0.65rem 0 0;
  color: #7c2d12;
  font-size: 0.78rem;
  line-height: 1.5;
}

.tif-tool-help {
  color: #5c6776;
}

.tif-link-button {
  margin-top: 0.55rem;
  padding: 0;
  border: 0;
  color: #b91c1c;
  background: transparent;
  font-weight: 800;
}

.tif-tools {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
}

.tif-tool-card {
  min-width: 0;
  padding: 0.95rem;
}

.tif-tool-card-wide {
  grid-column: span 2;
}

.tif-tool-head,
.tif-head,
.tif-block-head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
}

.tif-tool-head h2,
.tif-head h2,
.tif-block h3 {
  margin: 0.28rem 0 0;
  color: #16324b;
  font-size: 1rem;
  font-weight: 900;
}

.tif-head {
  margin-bottom: 0.75rem;
}

.tif-head p {
  margin: 0.15rem 0 0;
  color: #64748b;
  font-size: 0.78rem;
}

.tif-chip,
.tif-block-head span {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.32rem 0.55rem;
  border-radius: 8px;
  color: #0f766e;
  background: rgba(15, 118, 110, 0.1);
  font-size: 0.72rem;
  font-weight: 900;
}

.tif-inline-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  align-items: center;
}

.tif-tool-form {
  margin-top: 0.75rem;
}

.tif-tool-placeholder,
.tif-tool-error {
  display: flex;
  gap: 0.55rem;
  align-items: center;
  margin-top: 0.85rem;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.82rem;
}

.tif-tool-placeholder {
  color: #16324b;
  background: rgba(248, 250, 252, 0.86);
}

.tif-tool-error {
  color: #991b1b;
  background: rgba(254, 242, 242, 0.92);
}

.tif-tool-stack {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.85rem;
}

.tif-subsection {
  display: grid;
  gap: 0.55rem;
}

.tif-field-grid,
.tif-meta-grid,
.tif-context {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.55rem;
}

.tif-field,
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

.tif-geo-map {
  position: relative;
  min-height: 15rem;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(20, 78, 114, 0.1);
  background:
    radial-gradient(circle at 18% 28%, rgba(34, 197, 94, 0.18), transparent 22%),
    radial-gradient(circle at 72% 44%, rgba(14, 165, 233, 0.2), transparent 24%),
    linear-gradient(180deg, rgba(224, 242, 254, 0.92) 0%, rgba(240, 253, 250, 0.92) 100%);
}

.tif-geo-map-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.06) 1px, transparent 1px);
  background-size: 14% 20%;
}

.tif-geo-marker {
  position: absolute;
  z-index: 2;
  width: 1.1rem;
  height: 1.1rem;
  border: 3px solid rgba(255, 255, 255, 0.92);
  border-radius: 999px;
  background: #dc2626;
  box-shadow: 0 0 0 10px rgba(220, 38, 38, 0.14);
}

.tif-geo-map-label {
  position: absolute;
  right: 0.85rem;
  bottom: 0.85rem;
  z-index: 2;
  max-width: 15rem;
  padding: 0.72rem 0.8rem;
  border-radius: 10px;
  color: #16324b;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08);
}

.tif-geo-map-label span,
.tif-geo-map-label strong {
  display: block;
}

.tif-geo-map-label span {
  color: #64748b;
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
}

.tif-geo-map-label strong {
  margin-top: 0.18rem;
  font-size: 0.85rem;
  font-weight: 900;
  line-height: 1.35;
}

.tif-mini-list {
  display: grid;
  gap: 0.55rem;
}

.tif-mini-item {
  padding: 0.7rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(20, 78, 114, 0.1);
  background: rgba(255, 255, 255, 0.7);
}

.tif-mini-item strong {
  display: block;
  color: #16324b;
  font-size: 0.86rem;
  font-weight: 900;
  overflow-wrap: anywhere;
}

.tif-mini-item p {
  margin: 0.28rem 0 0;
  color: #5c6776;
  font-size: 0.78rem;
  line-height: 1.45;
}

.tif-mini-meta,
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

.tif-mini-meta {
  margin-top: 0.45rem;
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
.tif-ref-list a,
.tif-chip-soft {
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

.tif-chip-soft {
  color: #0f766e;
  background: rgba(15, 118, 110, 0.08);
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

.loading-state,
.error-state {
  padding: 2.1rem 1rem;
  border: 1px solid rgba(20, 78, 114, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.055);
}

.loading-spinner,
.error-message {
  display: grid;
  justify-items: center;
  gap: 0.65rem;
  text-align: center;
}

.loading-spinner i,
.error-message i {
  font-size: 1.6rem;
}

.error-message h3 {
  margin: 0;
  color: #16324b;
  font-size: 1rem;
  font-weight: 900;
}

.error-message p,
.loading-spinner p {
  margin: 0;
  color: #64748b;
}

.btn {
  border-radius: 8px;
  font-weight: 800;
}

@media (max-width: 1199.98px) {
  .tif-hero,
  .tif-workspace,
  .tif-tools {
    grid-template-columns: 1fr;
  }

  .tif-tool-card-wide {
    grid-column: auto;
  }

  .tif-key-panel {
    max-width: none;
  }
}

@media (max-width: 991.98px) {
  .tif-toolbar,
  .tif-metrics,
  .tif-tool-metrics,
  .tif-meta-grid,
  .tif-context,
  .tif-field-grid {
    grid-template-columns: 1fr 1fr;
  }

  .tif-toolbar,
  .tif-tool-head {
    align-items: stretch;
  }
}

@media (max-width: 767.98px) {
  .tif-hero,
  .tif-toolbar,
  .tif-panel,
  .tif-tool-card {
    padding: 0.75rem;
  }

  .tif-title {
    font-size: 1.45rem;
  }

  .tif-metrics,
  .tif-tool-metrics,
  .tif-toolbar,
  .tif-meta-grid,
  .tif-context,
  .tif-key-input,
  .tif-search-row,
  .tif-ioc,
  .tif-field-grid {
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

  .tif-inline-actions,
  .tif-tool-head,
  .tif-head,
  .tif-block-head {
    flex-direction: column;
  }
}
</style>
