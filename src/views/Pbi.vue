<template>
  <div class="pbi-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading PBI 02/2024 data...</p>
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
    <div v-else class="pbi-shell">
      <section class="pbi-hero">
        <div>
          <span class="pbi-kicker"
            ><i class="fas fa-landmark"></i>Framework Studio</span
          >
          <h1 class="pbi-title">PBI 02/2024 KKS Navigator</h1>
          <p class="pbi-lede">
            Halaman ini menyajikan ringkasan Peraturan Bank Indonesia Nomor 2
            Tahun 2024 mengenai keamanan sistem informasi dan ketahanan siber
            bagi penyelenggara yang diatur dan diawasi Bank Indonesia, termasuk
            peta kewajiban inti, analisa implementasi, serta rujukan pelaporan
            dan pengawasan.
          </p>
          <div class="pbi-metrics">
            <div class="pbi-metric">
              <label>Bab Substantif</label><strong>{{ totalChapters }}</strong
              ><span
                >Mulai dari kerangka KKS sampai penerapan berdasarkan
                klasifikasi penyelenggara.</span
              >
            </div>
            <div class="pbi-metric">
              <label>Kewajiban Inti</label
              ><strong>{{ totalRequirements }}</strong
              ><span
                >Requirement operasional yang dapat dianalisa satu per satu
                dalam explorer.</span
              >
            </div>
            <div class="pbi-metric">
              <label>Rujukan Operasional</label
              ><strong>{{ totalReferences }}</strong
              ><span
                >Board pelaporan, pengawasan, kolaborasi, dan penerapan yang
                perlu disiapkan.</span
              >
            </div>
            <div class="pbi-metric">
              <label>Tenggat Insiden</label><strong>{{ incidentClock }}</strong
              ><span
                >Notifikasi awal 1 jam dan laporan insiden 3 hari kalender ke
                Bank Indonesia.</span
              >
            </div>
          </div>
        </div>
        <div class="pbi-side-stack">
          <div class="pbi-side">
            <label>Alur Analisa</label>
            <h3>Pendekatan analisa regulasi yang terstruktur</h3>
            <p>
              Analisa dapat diawali dari peta bab dan domain kewajiban untuk
              memahami struktur regulasi, dilanjutkan ke explorer kewajiban
              untuk meninjau requirement inti secara rinci, lalu ditutup dengan
              board pelaporan dan pengawasan untuk menyiapkan artefak regulator
              yang relevan.
            </p>
          </div>
          <div class="pbi-side">
            <label>Catatan Pengawasan</label>
            <p>
              PBI ini menekankan pelaporan insiden yang sangat cepat, pelaporan
              tahunan atas maturitas KKS dan infrastruktur informasi vital,
              serta kesiapan organisasi menghadapi pengawasan berbasis risiko
              dan/atau kepatuhan oleh Bank Indonesia.
            </p>
          </div>
        </div>
      </section>

      <div class="pbi-nav nav" role="tablist">
        <button
          class="pbi-tab"
          :class="{ active: activeTab === 'overview' }"
          type="button"
          role="tab"
          @click="activeTab = 'overview'"
        >
          <i class="fas fa-chart-line"></i
          ><span
            ><strong>Ringkasan Regulasi</strong
            ><span
              >Struktur bab, domain kewajiban, dan sorotan operasional
              utama.</span
            ></span
          >
        </button>
        <button
          class="pbi-tab"
          :class="{ active: activeTab === 'explorer' }"
          type="button"
          role="tab"
          @click="activeTab = 'explorer'"
        >
          <i class="fas fa-sliders-h"></i
          ><span
            ><strong>Explorer Kewajiban</strong
            ><span
              >Filter requirement, baca interpretasi, dan telusuri kebutuhan
              bukti.</span
            ></span
          >
        </button>
        <button
          class="pbi-tab"
          :class="{ active: activeTab === 'reference' }"
          type="button"
          role="tab"
          @click="activeTab = 'reference'"
        >
          <i class="fas fa-folder-open"></i
          ><span
            ><strong>Pelaporan & Pengawasan</strong
            ><span
              >Board tenggat, rujukan regulator, dan pengaitan ke kewajiban
              inti.</span
            ></span
          >
        </button>
      </div>

      <div class="tab-content pbi-grid">
        <!-- Tab 1: Ringkasan Regulasi -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="pbi-grid two">
            <article class="pbi-panel">
              <div class="pbi-head">
                <h3>Peta bab pengaturan</h3>
                <span class="pbi-chip">{{ totalChapters }} bab</span>
              </div>
              <p class="pbi-copy">
                Pembacaan dapat dimulai dari struktur bab berikut untuk memahami
                urutan pengaturan mulai dari fondasi KKS, kontrol preventif,
                penanganan insiden, sampai kewajiban pelaporan.
              </p>
              <div class="pbi-bars">
                <button
                  v-for="item in chapterBreakdown"
                  :key="item.key"
                  type="button"
                  class="pbi-bar"
                  :class="{ active: chapterFilter === item.key }"
                  @click="jumpExplorer('', item.key)"
                >
                  <span
                    ><strong>{{ item.key }} - {{ item.label }}</strong
                    ><em>{{ item.summary }}</em></span
                  ><span class="pbi-track"
                    ><b
                      :style="{
                        width: (item.count / maxChapterCount) * 100 + '%',
                        background: item.color,
                      }"
                    ></b></span
                  ><span class="pbi-num">{{ item.count }}</span>
                </button>
              </div>
            </article>
            <article class="pbi-panel">
              <div class="pbi-head">
                <h3>Domain kewajiban inti</h3>
                <span class="pbi-chip"
                  >{{ domainBreakdown.length }} domain</span
                >
              </div>
              <p class="pbi-copy">
                Domain berikut membantu memetakan requirement utama yang perlu
                dilihat sebagai satu rangkaian penguatan KKS, bukan sebagai
                kontrol yang berdiri sendiri.
              </p>
              <div class="pbi-cards">
                <button
                  v-for="item in domainBreakdown"
                  :key="item.key"
                  type="button"
                  class="pbi-card"
                  @click="jumpExplorer(item.key, '')"
                >
                  <div class="pbi-card-top">
                    <span
                      class="pbi-icon"
                      :style="{ '--accent': item.color, color: item.color }"
                      ><i :class="`fas ${item.icon}`"></i></span
                    ><span>{{ item.count }} entri</span>
                  </div>
                  <strong>{{ item.label }}</strong>
                  <p>{{ item.summary }}</p>
                </button>
              </div>
            </article>
          </div>
          <div class="pbi-grid two">
            <article class="pbi-panel">
              <div class="pbi-head">
                <h3>Cakupan subjek pengaturan</h3>
                <span class="pbi-chip"
                  >{{ subjectScopes.length }} kelompok</span
                >
              </div>
              <p class="pbi-copy">
                PBI 02/2024 berlaku pada kelompok penyelenggara berikut sebagai
                objek pengaturan dan pengawasan KKS Bank Indonesia.
              </p>
              <div class="pbi-scope-grid">
                <div
                  v-for="scope in subjectScopes"
                  :key="scope.code"
                  class="pbi-scope"
                >
                  <strong>{{ scope.code }}</strong
                  ><span>{{ scope.name }}</span>
                </div>
              </div>
            </article>
            <article class="pbi-panel">
              <div class="pbi-head">
                <h3>Sorotan pelaporan dan pengawasan</h3>
                <span class="pbi-chip">Prioritas awal</span>
              </div>
              <p class="pbi-copy">
                Area berikut biasanya menjadi perhatian awal dalam penerapan PBI
                karena langsung terkait dengan respons insiden, kewajiban
                pelaporan, dan kesiapan saat pengawasan berlangsung.
              </p>
              <div class="pbi-mini-row">
                <button
                  v-for="item in reportingHighlights"
                  :key="item.id"
                  type="button"
                  class="pbi-mini"
                  @click="jumpReference('', item.id)"
                >
                  <label>{{ item.article }}</label
                  ><strong>{{ item.title }}</strong
                  ><span>{{ item.timeline }}</span>
                </button>
              </div>
              <div class="pbi-note">
                <strong>Catatan kepatuhan</strong>
                <div class="mt-2">
                  Pasal 55 menegaskan bahwa ketidakpatuhan atas kewajiban
                  laporan dapat berujung pada teguran, kewajiban membayar,
                  penghentian kegiatan, hingga pencabutan izin dan/atau
                  persetujuan yang telah diberikan.
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 2: Explorer Kewajiban -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="pbi-workspace">
            <article class="pbi-panel">
              <div class="pbi-head">
                <h3>Filter Kewajiban</h3>
                <span class="pbi-chip">{{ totalRequirements }} entri</span>
              </div>
              <div class="pbi-domain-grid">
                <button
                  v-for="item in domainBreakdown"
                  :key="item.key"
                  type="button"
                  class="pbi-domain"
                  :class="{ active: activeDomain === item.key }"
                  :style="{ '--accent': item.color }"
                  @click="toggleDomain(item.key)"
                >
                  <strong>{{ item.label }}</strong
                  ><span>{{ item.count }} kewajiban</span>
                </button>
              </div>
              <div class="pbi-form">
                <div>
                  <label for="chapterFilter">Bab Regulasi</label
                  ><select
                    id="chapterFilter"
                    v-model="chapterFilter"
                    class="form-select"
                  >
                    <option value="">Semua bab</option>
                    <option
                      v-for="chapter in chapterOptions"
                      :key="chapter"
                      :value="chapter"
                    >
                      {{ chapter }} - {{ chapterMeta[chapter]?.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label for="requirementSearch">Cari kewajiban</label
                  ><input
                    id="requirementSearch"
                    v-model="requirementSearch"
                    type="search"
                    class="form-control"
                    placeholder="Cari ID, pasal, judul, ringkasan, fokus, atau bukti"
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="resetRequirementFilters"
                >
                  Atur ulang filter
                </button>
              </div>
              <div class="pbi-summary">
                <small>Kewajiban Ditampilkan</small
                ><strong>{{ filteredRequirements.length }}</strong
                ><span>{{
                  filteredRequirements.length
                    ? `Menampilkan ${filteredRequirements.length} requirement PBI 02/2024 sesuai filter aktif.`
                    : "Tidak ada requirement yang cocok dengan filter saat ini."
                }}</span>
              </div>
            </article>
            <article class="pbi-panel">
              <div class="pbi-head">
                <h3>Daftar kewajiban</h3>
                <span class="pbi-chip"
                  >{{ filteredRequirements.length }} entri</span
                >
              </div>
              <div class="pbi-list">
                <button
                  v-for="req in filteredRequirements"
                  :key="req.id"
                  type="button"
                  class="pbi-item"
                  :class="{ active: activeRequirementId === req.id }"
                  :style="{ '--accent': getDomainColor(req.domain) }"
                  @click="setActiveRequirement(req.id)"
                >
                  <div class="pbi-item-top">
                    <span class="pbi-item-code">{{ req.id }}</span
                    ><span class="pbi-pill">{{
                      getDomainLabel(req.domain)
                    }}</span>
                  </div>
                  <div class="pbi-item-name">{{ req.title || "-" }}</div>
                  <div class="pbi-item-meta">
                    <span>{{ req.article || "-" }}</span
                    ><span>Bab {{ req.chapter || "-" }}</span
                    ><span>{{ (req.focus || []).length }} fokus</span>
                  </div>
                </button>
                <div v-if="filteredRequirements.length === 0" class="pbi-empty">
                  Tidak ada kewajiban yang cocok dengan filter saat ini.
                </div>
              </div>
            </article>
            <article class="pbi-panel pbi-inspector">
              <div class="pbi-inspector-head">
                <small>Requirement Inspector</small
                ><strong>{{
                  activeRequirement ? activeRequirement.id : "-"
                }}</strong
                ><span>{{
                  activeRequirement
                    ? activeRequirement.title
                    : "Pilih kewajiban untuk membaca detail."
                }}</span>
              </div>
              <div class="pbi-inspector-body">
                <div class="pbi-meta">
                  <span>{{
                    activeRequirement ? activeRequirement.article : "-"
                  }}</span
                  ><span>{{
                    activeRequirement ? activeRequirement.chapter : "-"
                  }}</span
                  ><span>{{
                    activeRequirement
                      ? getDomainLabel(activeRequirement.domain)
                      : "-"
                  }}</span
                  ><span>{{
                    activeRequirement
                      ? (activeRequirement.evidence_count ||
                          (activeRequirement.evidence || []).length) + " bukti"
                      : "0 bukti"
                  }}</span>
                </div>
                <div class="pbi-callout">
                  <strong>Ringkasan Kewajiban</strong>
                  <div class="mt-2">
                    {{
                      activeRequirement
                        ? activeRequirement.summary
                        : "Pilih requirement untuk membaca ringkasan."
                    }}
                  </div>
                </div>
                <div class="pbi-note">
                  <strong>Interpretasi Implementasi</strong>
                  <div class="mt-2">
                    {{
                      activeRequirement ? activeRequirement.interpretation : "-"
                    }}
                  </div>
                </div>
                <div class="pbi-callout">
                  <strong>Fokus Pelaksanaan</strong>
                  <ul class="pbi-plain">
                    <li
                      v-for="(item, idx) in activeRequirement &&
                      activeRequirement.focus &&
                      activeRequirement.focus.length
                        ? activeRequirement.focus
                        : ['Tidak ada fokus tambahan yang dipetakan.']"
                      :key="idx"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div class="pbi-callout">
                  <strong>Contoh Bukti</strong>
                  <ul class="pbi-plain">
                    <li
                      v-for="(item, idx) in activeRequirement &&
                      activeRequirement.evidence &&
                      activeRequirement.evidence.length
                        ? activeRequirement.evidence
                        : ['Tidak ada contoh bukti yang dipetakan.']"
                      :key="idx"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div class="pbi-note">
                  <strong>Catatan Pelaporan/Pengawasan</strong>
                  <div class="mt-2">
                    {{
                      activeRequirement
                        ? activeRequirement.reporting ||
                          "Requirement ini tidak memiliki catatan pelaporan khusus, namun tetap perlu didukung bukti implementasi yang siap ditelusuri saat pengawasan."
                        : "Tidak ada catatan tambahan."
                    }}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 3: Pelaporan & Pengawasan -->
        <div v-if="activeTab === 'reference'" key="reference-tab">
          <div class="pbi-refspace">
            <article class="pbi-panel">
              <div class="pbi-head">
                <h3>Filter Board Rujukan</h3>
                <span class="pbi-chip">{{ totalReferences }} entri</span>
              </div>
              <div class="pbi-bars">
                <button
                  v-for="item in referenceTypeBreakdown"
                  :key="item.type"
                  type="button"
                  class="pbi-bar"
                  :class="{ active: referenceTypeFilter === item.type }"
                  @click="jumpReference(item.type)"
                >
                  <span
                    ><strong>{{ item.label }}</strong
                    ><em>{{ item.summary }}</em></span
                  ><span class="pbi-track"
                    ><b
                      style="width: 100%; background: {{ item.color }}"
                    ></b></span
                  ><span class="pbi-num">{{ item.count }}</span>
                </button>
              </div>
              <div class="pbi-form mt-3">
                <div>
                  <label for="referenceTypeFilter">Jenis Rujukan</label
                  ><select
                    id="referenceTypeFilter"
                    v-model="referenceTypeFilter"
                    class="form-select"
                  >
                    <option value="">Semua jenis</option>
                    <option
                      v-for="item in referenceTypeBreakdown"
                      :key="item.type"
                      :value="item.type"
                    >
                      {{ item.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label for="referenceSearch">Cari rujukan</label
                  ><input
                    id="referenceSearch"
                    v-model="referenceSearch"
                    type="search"
                    class="form-control"
                    placeholder="Cari ID, pasal, judul, ringkasan, atau deliverable"
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="resetReferenceFilters"
                >
                  Atur ulang filter
                </button>
              </div>
              <div class="pbi-summary">
                <small>Rujukan Ditampilkan</small
                ><strong>{{ filteredReferences.length }}</strong
                ><span>{{
                  filteredReferences.length
                    ? `Menampilkan ${filteredReferences.length} rujukan operasional PBI 02/2024 sesuai filter aktif.`
                    : "Tidak ada rujukan yang cocok dengan filter saat ini."
                }}</span>
              </div>
            </article>
            <article class="pbi-panel">
              <div class="pbi-head">
                <h3>Board pelaporan, pengawasan, dan kolaborasi</h3>
                <span class="pbi-chip"
                  >{{ filteredReferences.length }} entri</span
                >
              </div>
              <p class="pbi-copy">
                Board ini merangkum tenggat regulator, kebutuhan deliverable,
                dan rujukan kewajiban inti yang perlu disiapkan saat organisasi
                menata kepatuhan terhadap PBI 02/2024.
              </p>
              <div class="pbi-board">
                <article
                  v-for="ref in filteredReferences"
                  :key="ref.id"
                  class="pbi-refcard"
                  :style="{ '--accent': getRefTypeColor(ref.type) }"
                >
                  <div class="pbi-ref-top">
                    <span class="pbi-pill">{{ getRefTypeLabel(ref.type) }}</span
                    ><span class="pbi-code">{{ ref.article || "-" }}</span>
                  </div>
                  <strong>{{ ref.title || "-" }}</strong>
                  <p>{{ ref.summary || "-" }}</p>
                  <div class="pbi-ref-meta">
                    <span>{{ ref.timeline || "-" }}</span
                    ><span>{{ ref.owner || "-" }}</span>
                  </div>
                  <ul class="pbi-plain">
                    <li
                      v-for="(d, idx) in (ref.deliverables || []).slice(0, 3)"
                      :key="idx"
                    >
                      {{ d }}
                    </li>
                    <li v-if="!ref.deliverables || !ref.deliverables.length">
                      Tidak ada deliverable tambahan.
                    </li>
                  </ul>
                  <div class="pbi-refs">
                    <button
                      v-for="lr in ref.linked_requirements || []"
                      :key="lr"
                      type="button"
                      class="pbi-ref"
                      @click="
                        jumpExplorer(
                          requirementMap[lr]?.domain || '',
                          requirementMap[lr]?.chapter || '',
                          lr,
                        )
                      "
                    >
                      {{ lr }}</button
                    ><span
                      v-if="
                        !ref.linked_requirements ||
                        !ref.linked_requirements.length
                      "
                      class="pbi-empty w-100"
                      >Belum ada requirement yang dipetakan.</span
                    >
                  </div>
                </article>
                <div v-if="filteredReferences.length === 0" class="pbi-empty">
                  Tidak ada rujukan yang cocok dengan filter saat ini.
                </div>
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
  name: "Pbi",
  data() {
    return {
      loading: true,
      error: null,
      activeTab: "overview",
      requirements: [],
      references: [],
      activeDomain: "",
      chapterFilter: "",
      requirementSearch: "",
      activeRequirementId: null,
      referenceTypeFilter: "",
      referenceSearch: "",
      incidentClock: "1j/3h",
      domainMeta: {
        Kerangka: {
          label: "Kerangka",
          color: "#2563eb",
          icon: "fa-landmark",
          summary:
            "Sasaran, prinsip dasar, objek pengaturan, dan ruang lingkup KKS.",
        },
        "Tata Kelola": {
          label: "Tata Kelola",
          color: "#0f766e",
          icon: "fa-sitemap",
          summary:
            "Strategi, kebijakan, fungsi organisasi, audit, dan budaya KKS.",
        },
        Pencegahan: {
          label: "Pencegahan",
          color: "#a16207",
          icon: "fa-shield-alt",
          summary:
            "Profil risiko, proteksi, deteksi, dan pengujian kapabilitas preventif.",
        },
        Penanganan: {
          label: "Penanganan",
          color: "#b91c1c",
          icon: "fa-bolt",
          summary:
            "Respons, pelaporan insiden, pemulihan, dan komunikasi regulator.",
        },
        Pengawasan: {
          label: "Pengawasan",
          color: "#7c3aed",
          icon: "fa-binoculars",
          summary:
            "Pengawasan langsung/tidak langsung serta tindak lanjut regulator.",
        },
        Kolaborasi: {
          label: "Kolaborasi",
          color: "#1d4ed8",
          icon: "fa-handshake",
          summary:
            "Pertukaran informasi, koordinasi lintas otoritas, dan peran SRO.",
        },
        Penerapan: {
          label: "Penerapan",
          color: "#144e72",
          icon: "fa-layer-group",
          summary: "Penerapan KKS sesuai klasifikasi penyelenggara.",
        },
      },
      chapterMeta: {
        II: {
          label: "Kerangka KKS",
          color: "#2563eb",
          icon: "fa-landmark",
          summary:
            "Sasaran, prinsip dasar, objek pengaturan, dan ruang lingkup KKS.",
        },
        III: {
          label: "Tata Kelola",
          color: "#0f766e",
          icon: "fa-sitemap",
          summary: "Strategi, fungsi organisasi, audit, dan budaya KKS.",
        },
        IV: {
          label: "Pencegahan",
          color: "#a16207",
          icon: "fa-shield-alt",
          summary: "Identifikasi, proteksi, deteksi, dan pengujian preventif.",
        },
        V: {
          label: "Penanganan",
          color: "#b91c1c",
          icon: "fa-bolt",
          summary: "Respons, pemulihan, dan komunikasi insiden siber.",
        },
        VI: {
          label: "Pengawasan",
          color: "#7c3aed",
          icon: "fa-binoculars",
          summary: "Mekanisme pengawasan dan penyampaian data/informasi.",
        },
        VII: {
          label: "Kolaborasi",
          color: "#1d4ed8",
          icon: "fa-handshake",
          summary:
            "Pertukaran informasi, koordinasi, dan kerja sama dengan SRO.",
        },
        VIII: {
          label: "Penerapan",
          color: "#144e72",
          icon: "fa-layer-group",
          summary: "Penerapan KKS sesuai klasifikasi penyelenggara.",
        },
      },
      referenceTypeMeta: {
        "Pelaporan Insiden": {
          label: "Pelaporan Insiden",
          color: "#b91c1c",
          summary: "Tenggat regulator saat insiden siber terjadi.",
        },
        "Pelaporan Berkala": {
          label: "Pelaporan Berkala",
          color: "#2563eb",
          summary:
            "Pelaporan tahunan tingkat kematangan dan infrastruktur vital.",
        },
        Pengawasan: {
          label: "Pengawasan",
          color: "#7c3aed",
          summary: "Kesiapan bukti, pengawasan, dan tindak lanjut regulator.",
        },
        Kolaborasi: {
          label: "Kolaborasi",
          color: "#0f766e",
          summary: "Pertukaran informasi dan koordinasi lintas pihak.",
        },
        Penerapan: {
          label: "Penerapan",
          color: "#144e72",
          summary: "Rujukan teknis dan penerapan berbasis klasifikasi.",
        },
      },
      subjectScopes: [
        { code: "PJP", name: "Penyedia Jasa Pembayaran" },
        { code: "PIP", name: "Penyelenggara Infrastruktur Sistem Pembayaran" },
        {
          code: "PUSK PUVA",
          name: "Pelaku usaha pasar uang dan pasar valuta asing",
        },
        { code: "LPPU", name: "Lembaga Pendukung Pasar Uang" },
        { code: "LPPVA", name: "Lembaga Pendukung Pasar Valuta Asing" },
        {
          code: "KUPVA BB",
          name: "Penyelenggara kegiatan usaha penukaran valuta asing bukan bank",
        },
        {
          code: "Lainnya",
          name: "Pihak lain yang diatur dan diawasi Bank Indonesia",
        },
      ],
    };
  },
  computed: {
    totalChapters() {
      const chapters = this.requirements.map((r) => r.chapter).filter(Boolean);
      return new Set(chapters).size;
    },
    totalRequirements() {
      return this.requirements.length;
    },
    totalReferences() {
      return this.references.length;
    },
    domainBreakdown() {
      return Object.entries(this.domainMeta)
        .map(([key, meta]) => ({
          key,
          label: meta.label,
          color: meta.color,
          icon: meta.icon,
          summary: meta.summary,
          count: this.requirements.filter((r) => r.domain === key).length,
        }))
        .filter((item) => item.count > 0);
    },
    chapterBreakdown() {
      return Object.entries(this.chapterMeta)
        .map(([key, meta]) => ({
          key,
          label: meta.label,
          color: meta.color,
          icon: meta.icon,
          summary: meta.summary,
          count: this.requirements.filter((r) => r.chapter === key).length,
        }))
        .filter((item) => item.count > 0);
    },
    maxChapterCount() {
      return Math.max(...this.chapterBreakdown.map((c) => c.count), 1);
    },
    chapterOptions() {
      return this.chapterBreakdown.map((c) => c.key);
    },
    referenceTypeBreakdown() {
      return Object.entries(this.referenceTypeMeta)
        .map(([type, meta]) => ({
          type,
          label: meta.label,
          summary: meta.summary,
          color: meta.color,
          count: this.references.filter((r) => r.type === type).length,
        }))
        .filter((item) => item.count > 0);
    },
    reportingHighlights() {
      return this.references.filter((r) =>
        ["REF-01", "REF-02", "REF-03", "REF-05"].includes(r.id),
      );
    },
    filteredRequirements() {
      const query = (this.requirementSearch || "").trim().toLowerCase();
      return this.requirements.filter((req) => {
        if (this.activeDomain && req.domain !== this.activeDomain) return false;
        if (this.chapterFilter && req.chapter !== this.chapterFilter)
          return false;
        if (!query) return true;
        return [
          req.id,
          req.title,
          req.article,
          req.chapter,
          req.domain,
          req.summary,
          req.interpretation,
          ...(req.focus || []),
          ...(req.evidence || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
    },
    filteredReferences() {
      const query = (this.referenceSearch || "").trim().toLowerCase();
      return this.references.filter((ref) => {
        if (this.referenceTypeFilter && ref.type !== this.referenceTypeFilter)
          return false;
        if (!query) return true;
        return [
          ref.id,
          ref.type,
          ref.article,
          ref.title,
          ref.summary,
          ref.timeline,
          ref.owner,
          ...(ref.deliverables || []),
          ...(ref.linked_requirements || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
    },
    activeRequirement() {
      return (
        this.requirements.find((r) => r.id === this.activeRequirementId) || null
      );
    },
    requirementMap() {
      return Object.fromEntries(this.requirements.map((r) => [r.id, r]));
    },
  },
  methods: {
    getDomainColor(domain) {
      return this.domainMeta[domain]?.color || "#144e72";
    },
    getDomainLabel(domain) {
      return this.domainMeta[domain]?.label || domain || "-";
    },
    getRefTypeColor(type) {
      return this.referenceTypeMeta[type]?.color || "#144e72";
    },
    getRefTypeLabel(type) {
      return this.referenceTypeMeta[type]?.label || type || "-";
    },
    toggleDomain(domain) {
      this.activeDomain = this.activeDomain === domain ? "" : domain;
    },
    resetRequirementFilters() {
      this.activeDomain = "";
      this.chapterFilter = "";
      this.requirementSearch = "";
    },
    resetReferenceFilters() {
      this.referenceTypeFilter = "";
      this.referenceSearch = "";
    },
    setActiveRequirement(id) {
      this.activeRequirementId = id;
    },
    jumpExplorer(domain = "", chapter = "", requirementId = null) {
      this.activeDomain = domain || "";
      this.chapterFilter = chapter || "";
      this.requirementSearch = "";
      this.activeTab = "explorer";
      if (requirementId) this.setActiveRequirement(requirementId);
    },
    jumpReference(type = "", refId = "") {
      if (refId) {
        const ref = this.references.find((r) => r.id === refId);
        if (ref) this.referenceTypeFilter = ref.type || "";
      } else {
        this.referenceTypeFilter = type || "";
      }
      this.referenceSearch = "";
      this.activeTab = "reference";
    },
    retryLoad() {
      this.mounted();
    },
  },
  async mounted() {
    try {
      this.loading = true;
      this.error = null;
      const [reqRes, refRes] = await Promise.all([
        fetch("/data/pbi_022024_requirements.json"),
        fetch("/data/pbi_022024_references.json"),
      ]);
      if (reqRes.ok) {
        const data = await reqRes.json();
        this.requirements = Array.isArray(data)
          ? data
          : data.requirements || [];
        if (this.requirements.length > 0)
          this.activeRequirementId = this.requirements[0].id;
      } else {
        throw new Error(`Failed to load PBI requirements: HTTP ${reqRes.status}`);
      }
      if (refRes.ok) {
        const data = await refRes.json();
        this.references = Array.isArray(data) ? data : data.references || [];
      } else {
        throw new Error(`Failed to load PBI references: HTTP ${refRes.status}`);
      }
    } catch (error) {
      console.error("Error loading PBI data:", error);
      this.error = error.message || "Failed to load data";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.pbi-page {
  --ink: #14263b;
  --muted: #5c6776;
  --line: rgba(20, 38, 59, 0.1);
  --shell: linear-gradient(180deg, #f6efe4 0%, #edf5f6 100%);
  color: var(--ink);
  padding: 0.25rem;
  border-radius: 32px;
  background: var(--shell);
}
.pbi-shell {
  display: grid;
  gap: 1rem;
}
.pbi-hero {
  display: grid;
  grid-template-columns: 1.55fr 0.92fr;
  gap: 1.2rem;
  align-items: stretch;
  min-height: 368px;
  padding: 1.45rem;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
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
.pbi-hero > * {
  position: relative;
  z-index: 1;
}
.pbi-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(255, 250, 242, 0.18);
  color: rgba(255, 250, 242, 0.92);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.pbi-title {
  margin: 1rem 0 0.7rem;
  color: #fffaf2;
  font-size: clamp(2rem, 3.8vw, 3rem);
  font-weight: 800;
  line-height: 1.04;
}
.pbi-lede {
  margin: 0;
  max-width: 760px;
  color: rgba(255, 250, 242, 0.82);
  line-height: 1.7;
}
.pbi-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.65rem;
  margin-top: 1.1rem;
}
.pbi-metric,
.pbi-side,
.pbi-panel,
.pbi-mini,
.pbi-refcard {
  border: 1px solid var(--line);
  background: linear-gradient(
    180deg,
    rgba(255, 251, 245, 0.98) 0%,
    rgba(246, 251, 252, 0.98) 100%
  );
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
}
.pbi-metric {
  padding: 0.68rem 0.74rem;
  border-radius: 16px;
  background: rgba(255, 250, 242, 0.12);
  border-color: rgba(255, 255, 255, 0.18);
  min-height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.pbi-metric label,
.pbi-side label,
.pbi-mini label,
.pbi-form label,
.pbi-inspector small,
.pbi-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.pbi-metric label {
  color: rgba(255, 250, 242, 0.7);
  margin-bottom: 0.35rem;
}
.pbi-metric strong {
  display: block;
  color: #fffaf2;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
}
.pbi-metric span {
  display: block;
  margin-top: 0.34rem;
  color: rgba(255, 250, 242, 0.72);
  font-size: 0.76rem;
  line-height: 1.45;
}
.pbi-side-stack {
  display: grid;
  gap: 0.85rem;
}
.pbi-side {
  padding: 0.8rem 0.86rem;
  border-radius: 18px;
  background: rgba(255, 250, 242, 0.78);
  border-color: rgba(255, 255, 255, 0.24);
  min-height: 142px;
}
.pbi-side label {
  color: var(--muted);
  margin-bottom: 0.4rem;
}
.pbi-side h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
}
.pbi-side p {
  margin: 0.55rem 0 0;
  color: var(--muted);
  line-height: 1.55;
  font-size: 0.84rem;
}
.pbi-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
.pbi-tab {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.72rem;
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
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.04);
  cursor: pointer;
}
.pbi-tab.active {
  border-color: rgba(20, 78, 114, 0.24);
  box-shadow: 0 18px 30px rgba(20, 78, 114, 0.1);
}
.pbi-tab i {
  width: 2.35rem;
  height: 2.35rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(20, 38, 59, 0.06);
}
.pbi-tab strong {
  display: block;
  font-size: 0.9rem;
  font-weight: 800;
}
.pbi-tab span {
  display: block;
  margin-top: 0.14rem;
  color: var(--muted);
  font-size: 0.76rem;
  line-height: 1.4;
}
.pbi-grid {
  display: grid;
  gap: 1rem;
}
.pbi-grid.two {
  grid-template-columns: 1.06fr 0.94fr;
}
.pbi-panel {
  padding: 1rem;
  border-radius: 20px;
}
.pbi-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  margin-bottom: 0.7rem;
}
.pbi-head h3 {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 800;
}
.pbi-chip,
.pbi-pill,
.pbi-meta span,
.pbi-ref {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.24rem 0.52rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.2;
}
.pbi-chip {
  background: rgba(20, 38, 59, 0.08);
  color: var(--ink);
}
.pbi-copy {
  margin: 0 0 0.85rem;
  color: var(--muted);
  line-height: 1.6;
  font-size: 0.84rem;
}
.pbi-bars,
.pbi-cards,
.pbi-list,
.pbi-board,
.pbi-scope-grid,
.pbi-domain-grid {
  display: grid;
  gap: 0.65rem;
}
.pbi-bar {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(180px, 1fr) auto;
  gap: 0.68rem;
  align-items: center;
  padding: 0.62rem 0.72rem;
  border-radius: 16px;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.55);
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.pbi-bar:hover,
.pbi-bar.active,
.pbi-card:hover,
.pbi-card.active,
.pbi-domain:hover,
.pbi-domain.active,
.pbi-mini:hover,
.pbi-refcard:hover {
  transform: translateY(-1px);
  border-color: rgba(20, 78, 114, 0.22);
  box-shadow: 0 12px 22px rgba(20, 78, 114, 0.08);
}
.pbi-bar strong,
.pbi-card strong,
.pbi-domain strong,
.pbi-mini strong,
.pbi-refcard strong {
  display: block;
  font-size: 0.86rem;
}
.pbi-bar em,
.pbi-card p,
.pbi-domain span,
.pbi-mini span,
.pbi-refcard p {
  display: block;
  margin-top: 0.12rem;
  color: var(--muted);
  font-size: 0.74rem;
  font-style: normal;
  line-height: 1.45;
}
.pbi-track {
  height: 0.44rem;
  border-radius: 999px;
  background: rgba(20, 38, 59, 0.08);
  overflow: hidden;
}
.pbi-track b {
  display: block;
  height: 100%;
  border-radius: inherit;
}
.pbi-num {
  min-width: 2.2rem;
  text-align: right;
  font-weight: 800;
}
.pbi-cards {
  grid-template-columns: repeat(3, 1fr);
}
.pbi-card {
  width: 100%;
  padding: 0.76rem 0.8rem;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.75);
  text-align: left;
  cursor: pointer;
}
.pbi-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.55rem;
  color: var(--muted);
  font-size: 0.64rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
}
.pbi-icon {
  width: 1.9rem;
  height: 1.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(20, 78, 114, 0.12);
  color: var(--accent);
  font-size: 0.8rem;
}
.pbi-mini-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
}
.pbi-mini {
  width: 100%;
  padding: 0.78rem 0.82rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.76);
  text-align: left;
  cursor: pointer;
}
.pbi-mini label {
  color: var(--muted);
}
.pbi-mini strong {
  margin-top: 0.25rem;
  color: #144e72;
  font-size: 1rem;
}
.pbi-mini span {
  margin-top: 0.2rem;
}
.pbi-scope-grid {
  grid-template-columns: repeat(2, 1fr);
}
.pbi-scope {
  padding: 0.78rem 0.82rem;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.78);
}
.pbi-scope strong {
  display: block;
  font-size: 0.86rem;
  font-weight: 800;
}
.pbi-scope span {
  display: block;
  margin-top: 0.14rem;
  color: var(--muted);
  font-size: 0.74rem;
  line-height: 1.45;
}
.pbi-workspace {
  display: grid;
  grid-template-columns: 0.78fr 1.04fr 0.9fr;
  gap: 1rem;
}
.pbi-refspace {
  display: grid;
  grid-template-columns: 0.82fr 1.18fr;
  gap: 1rem;
}
.pbi-domain-grid {
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 0.8rem;
}
.pbi-domain {
  width: 100%;
  padding: 0.62rem 0.68rem;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.75);
  text-align: left;
  cursor: pointer;
}
.pbi-domain strong {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--accent);
}
.pbi-domain span {
  font-size: 0.74rem;
}
.pbi-form {
  display: grid;
  gap: 0.75rem;
}
.pbi-form label {
  margin-bottom: 0.3rem;
  color: var(--muted);
}
.pbi-summary {
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
.pbi-summary small {
  display: block;
  color: rgba(255, 250, 242, 0.7);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.pbi-summary strong {
  display: block;
  margin-top: 0.28rem;
  font-size: 1.72rem;
  font-weight: 800;
  line-height: 1;
}
.pbi-summary span {
  display: block;
  margin-top: 0.42rem;
  color: rgba(255, 250, 242, 0.78);
  font-size: 0.78rem;
  line-height: 1.5;
}
.pbi-list {
  display: flex;
  flex-direction: column;
  max-height: 720px;
  overflow-y: auto;
  padding-right: 0.12rem;
}
.pbi-item {
  position: relative;
  width: 100%;
  padding: 0.7rem 0.78rem 0.66rem 0.88rem;
  margin-bottom: 0.55rem;
  border-radius: 14px;
  border: 1px solid rgba(20, 38, 59, 0.08);
  background: #fff;
  text-align: left;
  cursor: pointer;
  content-visibility: auto;
  contain-intrinsic-size: auto 80px;
}
.pbi-item:last-child {
  margin-bottom: 0;
}
.pbi-item.active {
  border-color: rgba(20, 78, 114, 0.35);
  border-left-width: 0.28rem;
  background: rgba(238, 245, 245, 0.6);
}
.pbi-item:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.68rem;
  bottom: 0.68rem;
  width: 0.18rem;
  border-radius: 999px;
  background: var(--accent, #144e72);
}
.pbi-item-top {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
}
.pbi-item-code,
.pbi-code {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New",
    monospace;
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--accent, #144e72);
}
.pbi-item-name {
  margin: 0.28rem 0 0.2rem;
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.38;
  color: var(--ink);
}
.pbi-item-meta {
  color: var(--muted);
  font-size: 0.74rem;
  line-height: 1.4;
}
.pbi-item-meta span + span::before {
  content: "•";
  margin: 0 0.4rem;
  color: rgba(20, 38, 59, 0.35);
}
.pbi-pill {
  padding: 0.2rem 0.45rem;
  font-size: 0.68rem;
  background: rgba(20, 38, 59, 0.08);
  color: var(--ink);
}
.pbi-inspector {
  position: relative;
  top: auto;
  min-height: 720px;
  display: flex;
  flex-direction: column;
}
.pbi-inspector-head {
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--line);
}
.pbi-inspector-head strong {
  display: block;
  margin-top: 0.35rem;
  font-size: 1rem;
  font-weight: 800;
  color: #144e72;
}
.pbi-inspector-head span {
  display: block;
  margin-top: 0.28rem;
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1.4;
}
.pbi-inspector-body {
  display: grid;
  gap: 0.75rem;
  padding-top: 0.85rem;
  flex: 1;
  min-height: 0;
  overflow: auto;
  align-content: start;
}
.pbi-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.pbi-meta span {
  background: rgba(20, 38, 59, 0.06);
  color: var(--ink);
  font-size: 0.72rem;
}
.pbi-callout,
.pbi-note {
  padding: 0.76rem 0.84rem;
  border-radius: 16px;
  border: 1px solid var(--line);
  line-height: 1.62;
}
.pbi-callout {
  background: rgba(255, 255, 255, 0.75);
}
.pbi-note {
  background: rgba(238, 245, 245, 0.84);
}
.pbi-plain {
  margin: 0.15rem 0 0;
  padding-left: 1rem;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.6;
}
.pbi-plain li {
  margin-bottom: 0.16rem;
}
.pbi-empty {
  padding: 0.9rem;
  border-radius: 16px;
  border: 1px dashed rgba(20, 38, 59, 0.18);
  background: rgba(255, 255, 255, 0.6);
  color: var(--muted);
  text-align: center;
  line-height: 1.55;
}
.pbi-board {
  grid-template-columns: repeat(2, 1fr);
}
.pbi-refcard {
  position: relative;
  padding: 0.88rem 0.92rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(20, 38, 59, 0.08);
}
.pbi-refcard::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.82rem;
  bottom: 0.82rem;
  width: 0.2rem;
  border-radius: 999px;
  background: var(--accent, #144e72);
}
.pbi-ref-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
}
.pbi-ref-top .pbi-code {
  font-size: 0.72rem;
}
.pbi-ref-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.55rem 0;
}
.pbi-ref-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.22rem 0.5rem;
  border-radius: 999px;
  background: rgba(20, 38, 59, 0.06);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--ink);
}
.pbi-refs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.6rem;
}
.pbi-ref {
  border: 1px solid rgba(20, 38, 59, 0.12);
  background: rgba(255, 255, 255, 0.82);
  color: var(--ink);
  font-size: 0.7rem;
  cursor: pointer;
}
@media (max-width: 1399.98px) {
  .pbi-workspace,
  .pbi-refspace {
    grid-template-columns: 1fr;
  }
  .pbi-inspector {
    position: static;
    min-height: auto;
  }
}
@media (max-width: 1199.98px) {
  .pbi-hero,
  .pbi-metric,
  .pbi-side {
    min-height: auto;
  }
  .pbi-hero,
  .pbi-nav,
  .pbi-grid.two,
  .pbi-metrics,
  .pbi-cards,
  .pbi-scope-grid,
  .pbi-mini-row,
  .pbi-board {
    grid-template-columns: 1fr;
  }
  .pbi-bar {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 767.98px) {
  .pbi-hero,
  .pbi-panel {
    padding: 1.2rem;
    border-radius: 22px;
  }
  .pbi-domain-grid {
    grid-template-columns: 1fr;
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
