<template>
  <div class="sej-page">
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
    <div v-else class="sej-shell">
      <section class="sej-hero">
        <div>
          <span class="sej-kicker"
            ><i class="fas fa-landmark"></i>Framework Studio</span
          >
          <h1 class="sej-title">PBI 02/2024 KKS Navigator</h1>
          <p class="sej-lede">
            Halaman ini menyajikan ringkasan Peraturan Bank Indonesia Nomor 2
            Tahun 2024 mengenai keamanan sistem informasi dan ketahanan siber
            bagi penyelenggara yang diatur dan diawasi Bank Indonesia, termasuk
            peta kewajiban inti, analisa implementasi, serta rujukan pelaporan
            dan pengawasan.
          </p>
          <div class="sej-metrics">
            <div class="sej-metric">
              <label>Bab Substantif</label><strong>{{ totalChapters }}</strong
              ><span
                >Mulai dari kerangka KKS sampai penerapan berdasarkan
                klasifikasi penyelenggara.</span
              >
            </div>
            <div class="sej-metric">
              <label>Kewajiban Inti</label
              ><strong>{{ totalRequirements }}</strong
              ><span
                >Requirement operasional yang dapat dianalisa satu per satu
                dalam explorer.</span
              >
            </div>
            <div class="sej-metric">
              <label>Rujukan Operasional</label
              ><strong>{{ totalReferences }}</strong
              ><span
                >Board pelaporan, pengawasan, kolaborasi, dan penerapan yang
                perlu disiapkan.</span
              >
            </div>
            <div class="sej-metric">
              <label>Tenggat Insiden</label><strong>{{ incidentClock }}</strong
              ><span
                >Notifikasi awal 1 jam dan laporan insiden 3 hari kalender ke
                Bank Indonesia.</span
              >
            </div>
          </div>
        </div>
        <div class="sej-side-stack">
          <div class="sej-side">
            <label>Alur Analisa</label>
            <h3>Pendekatan analisa regulasi yang terstruktur</h3>
            <p>
              Analisa dapat diawali dari peta bab dan domain kewajiban untuk
              memahami struktur regulasi, dilanjutkan ke eksplorasi kewajiban
              untuk meninjau requirement inti secara rinci, lalu ditutup dengan
              board pelaporan dan pengawasan untuk menyiapkan artefak regulator
              yang relevan.
            </p>
          </div>
          <div class="sej-side">
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
            ><strong>Ringkasan Regulasi</strong
            ><span
              >Struktur bab, domain kewajiban, dan sorotan operasional
              utama.</span
            ></span
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
              >Filter requirement, baca interpretasi, dan telusuri kebutuhan
              bukti.</span
            ></span
          >
        </button>
        <button
          class="sej-tab"
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

      <div class="tab-content sej-grid">
        <!-- Tab 1: Ringkasan Regulasi -->
        <div v-if="activeTab === 'overview'" key="overview-tab">
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Peta bab pengaturan</h3>
                <span class="sej-chip">{{ totalChapters }} bab</span>
              </div>
              <p class="sej-copy">
                Pembacaan dapat dimulai dari struktur bab berikut untuk memahami
                urutan pengaturan mulai dari fondasi KKS, kontrol preventif,
                penanganan insiden, sampai kewajiban pelaporan.
              </p>
              <div class="sej-bars">
                <button
                  v-for="item in chapterBreakdown"
                  :key="item.key"
                  type="button"
                  class="sej-bar"
                  :class="{ active: chapterFilter === item.key }"
                  @click="jumpExplorer('', item.key)"
                >
                  <span
                    ><strong>{{ item.key }} - {{ item.label }}</strong
                    ><em>{{ item.summary }}</em></span
                  ><span class="sej-track"
                    ><b
                      :style="{
                        width: (item.count / maxChapterCount) * 100 + '%',
                        background: item.color,
                      }"
                    ></b></span
                  ><span class="sej-num">{{ item.count }}</span>
                </button>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Domain kewajiban inti</h3>
                <span class="sej-chip"
                  >{{ domainBreakdown.length }} domain</span
                >
              </div>
              <p class="sej-copy">
                Domain berikut membantu memetakan requirement utama yang perlu
                dilihat sebagai satu rangkaian penguatan KKS, bukan sebagai
                kontrol yang berdiri sendiri.
              </p>
              <div class="sej-cards">
                <button
                  v-for="item in domainBreakdown"
                  :key="item.key"
                  type="button"
                  class="sej-card"
                  @click="jumpExplorer(item.key, '')"
                >
                  <div class="sej-card-top">
                    <span
                      class="sej-icon"
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
          <div class="sej-grid two">
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Cakupan subjek pengaturan</h3>
                <span class="sej-chip"
                  >{{ subjectScopes.length }} kelompok</span
                >
              </div>
              <p class="sej-copy">
                PBI 02/2024 berlaku pada kelompok penyelenggara berikut sebagai
                objek pengaturan dan pengawasan KKS Bank Indonesia.
              </p>
              <div class="sej-mini-row">
                <div
                  v-for="scope in subjectScopes"
                  :key="scope.code"
                  class="sej-mini"
                >
                  <strong>{{ scope.code }}</strong
                  ><span>{{ scope.name }}</span>
                </div>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Sorotan pelaporan dan pengawasan</h3>
                <span class="sej-chip">Prioritas awal</span>
              </div>
              <p class="sej-copy">
                Area berikut biasanya menjadi perhatian awal dalam penerapan PBI
                karena langsung terkait dengan respons insiden, kewajiban
                pelaporan, dan kesiapan saat pengawasan berlangsung.
              </p>
              <div class="sej-mini-row">
                <button
                  v-for="item in reportingHighlights"
                  :key="item.id"
                  type="button"
                  class="sej-mini"
                  @click="jumpReference('', item.id)"
                >
                  <label>{{ item.article }}</label
                  ><strong>{{ item.title }}</strong
                  ><span>{{ item.timeline }}</span>
                </button>
              </div>
              <div class="sej-note">
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

        <!-- Tab 2: Eksplorasi -->
        <div v-if="activeTab === 'explorer'" key="explorer-tab">
          <div class="sej-workspace">
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Filter Kewajiban</h3>
                <span class="sej-chip">{{ totalRequirements }} entri</span>
              </div>
              <div class="sej-pillar-grid">
                <button
                  v-for="item in domainBreakdown"
                  :key="item.key"
                  type="button"
                  class="sej-pillar"
                  :class="{ active: activeDomain === item.key }"
                  :style="{ '--accent': item.color }"
                  @click="toggleDomain(item.key)"
                >
                  <strong>{{ item.label }}</strong
                  ><span>{{ item.count }} kewajiban</span>
                </button>
              </div>
              <div class="sej-form">
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
              <div class="sej-summary">
                <small>Kewajiban Ditampilkan</small
                ><strong>{{ filteredRequirements.length }}</strong
                ><span>{{
                  filteredRequirements.length
                    ? `Menampilkan ${filteredRequirements.length} requirement PBI 02/2024 sesuai filter aktif.`
                    : "Tidak ada requirement yang cocok dengan filter saat ini."
                }}</span>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Daftar kewajiban</h3>
                <span class="sej-chip"
                  >{{ filteredRequirements.length }} entri</span
                >
              </div>
              <div class="sej-list">
                <button
                  v-for="req in filteredRequirements"
                  :key="req.id"
                  type="button"
                  class="sej-item"
                  :class="{ active: activeRequirementId === req.id }"
                  :style="{ '--accent': getDomainColor(req.domain) }"
                  @click="setActiveRequirement(req.id)"
                >
                  <div class="sej-item-top">
                    <span class="sej-item-code">{{ req.id }}</span
                    ><span class="sej-pill">{{
                      getDomainLabel(req.domain)
                    }}</span>
                  </div>
                  <div class="sej-item-name">{{ req.title || "-" }}</div>
                  <div class="sej-item-meta">
                    <span>{{ req.article || "-" }}</span
                    ><span>Bab {{ req.chapter || "-" }}</span
                    ><span>{{ (req.focus || []).length }} fokus</span>
                  </div>
                </button>
                <div v-if="filteredRequirements.length === 0" class="sej-empty">
                  Tidak ada kewajiban yang cocok dengan filter saat ini.
                </div>
              </div>
            </article>
            <article class="sej-panel sej-inspector">
              <div class="sej-inspector-head">
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
              <div class="sej-inspector-body">
                <div class="sej-meta">
                  <span>{{ activeRequirement ? activeRequirement.article : "-" }}</span>
                  <span>{{ activeRequirement ? activeRequirement.chapter : "-" }}</span>
                  <span>{{ activeRequirement ? getDomainLabel(activeRequirement.domain) : "-" }}</span>
                  <span>{{ activeRequirement ? (activeRequirement.evidence_count || (activeRequirement.evidence || []).length) + " bukti" : "0 bukti" }}</span>
                </div>
                <div class="sej-callout">
                  <span class="sej-label">Ringkasan Requirement</span>
                  <div class="mt-2">{{ activeRequirement ? activeRequirement.summary : "Pilih requirement untuk membaca ringkasan." }}</div>
                </div>
                <div class="sej-note">
                  <span class="sej-label"><i class="fas fa-lightbulb me-1"></i>Analogi</span>
                  <div class="mt-2">{{ activeRequirement ? activeRequirement.analogy : "-" }}</div>
                </div>
                <div class="sej-callout">
                  <span class="sej-label">Fokus Implementasi</span>
                  <ul class="sej-plain">
                    <li v-for="(item, idx) in activeRequirement && activeRequirement.focus && activeRequirement.focus.length ? activeRequirement.focus : ['Tidak ada fokus implementasi tambahan.']" :key="idx">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div class="sej-callout">
                  <span class="sej-label">Contoh Evidence</span>
                  <ul class="sej-plain">
                    <li v-for="(item, idx) in activeRequirement && activeRequirement.evidence && activeRequirement.evidence.length ? activeRequirement.evidence : ['Tidak ada evidence cue.']" :key="idx">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div class="sej-callout">
                  <span class="sej-label">Lampiran Terkait</span>
                  <div class="sej-refs">
                    <button v-for="ref in (activeRequirement?.appendices || [])" :key="ref" type="button" class="sej-ref" @click="jumpReference('', ref)">{{ ref }}</button>
                    <span v-if="!activeRequirement || !activeRequirement.appendices || !activeRequirement.appendices.length" class="sej-empty w-100">Requirement ini tidak menunjuk lampiran spesifik.</span>
                  </div>
                </div>
                <div class="sej-note">
                  <span class="sej-label">Pelaporan / Output</span>
                  <div class="mt-2">{{ activeRequirement ? (activeRequirement.reporting || "-") : "-" }}</div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab 3: Pelaporan & Pengawasan -->
        <div v-if="activeTab === 'reference'" key="reference-tab">
          <div class="sej-refspace">
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Filter Board Rujukan</h3>
                <span class="sej-chip">{{ totalReferences }} entri</span>
              </div>
              <div class="sej-bars">
                <button
                  v-for="item in referenceTypeBreakdown"
                  :key="item.type"
                  type="button"
                  class="sej-bar"
                  :class="{ active: referenceTypeFilter === item.type }"
                  @click="jumpReference(item.type)"
                >
                  <span
                    ><strong>{{ item.label }}</strong
                    ><em>{{ item.summary }}</em></span
                  ><span class="sej-track"
                    ><b
                      style="width: 100%; background: {{ item.color }}"
                    ></b></span
                  ><span class="sej-num">{{ item.count }}</span>
                </button>
              </div>
              <div class="sej-form mt-3">
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
              <div class="sej-summary">
                <small>Rujukan Ditampilkan</small
                ><strong>{{ filteredReferences.length }}</strong
                ><span>{{
                  filteredReferences.length
                    ? `Menampilkan ${filteredReferences.length} rujukan operasional PBI 02/2024 sesuai filter aktif.`
                    : "Tidak ada rujukan yang cocok dengan filter saat ini."
                }}</span>
              </div>
            </article>
            <article class="sej-panel">
              <div class="sej-head">
                <h3>Board pelaporan, pengawasan, dan kolaborasi</h3>
                <span class="sej-chip"
                  >{{ filteredReferences.length }} entri</span
                >
              </div>
              <p class="sej-copy">
                Board ini merangkum tenggat regulator, kebutuhan deliverable,
                dan rujukan kewajiban inti yang perlu disiapkan saat organisasi
                menata kepatuhan terhadap PBI 02/2024.
              </p>
              <div class="sej-list">
                <button
                  v-for="ref in filteredReferences"
                  :key="ref.id"
                  type="button"
                  class="sej-item"
                  :style="{ '--accent': getRefTypeColor(ref.type) }"
                  @click="openReferenceModal(ref)"
                >
                  <div class="sej-item-top">
                    <span class="sej-item-code">{{ ref.article || "-" }}</span>
                    <span class="sej-pill">{{ getRefTypeLabel(ref.type) }}</span>
                  </div>
                  <div class="sej-item-name">{{ ref.title || "-" }}</div>
                  <div class="sej-item-meta">
                    <span>{{ ref.timeline || "-" }}</span>
                    <span>{{ ref.owner || "-" }}</span>
                  </div>
                </button>
                <div v-if="filteredReferences.length === 0" class="sej-empty">
                  Tidak ada rujukan yang cocok dengan filter saat ini.
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal Reference -->
  <Transition name="modal-fade">
    <div v-if="showReferenceModal" class="modal-overlay" @click.self="showReferenceModal = false">
      <Transition name="modal-slide">
        <div class="modal-dialog" v-if="showReferenceModal">
          <div class="modal-shell">
            <div class="modal-sidebar" :style="{ background: `linear-gradient(180deg, ${getRefTypeColor(selectedReference?.type)} 0%, ${getRefTypeColor(selectedReference?.type, 0.7)} 100%)` }">
              <button type="button" class="modal-close" @click="showReferenceModal = false" aria-label="Close">
                <i class="fas fa-times"></i>
              </button>
              <div class="modal-sidebar-icon">
                <i class="fas fa-file-alt"></i>
              </div>
              <div class="modal-sidebar-id">{{ selectedReference?.article || '-' }}</div>
              <div class="modal-sidebar-type">{{ getRefTypeLabel(selectedReference?.type) }}</div>
            </div>
            <div class="modal-main">
              <div class="modal-header">
                <h4 class="modal-title">{{ selectedReference?.title || 'Detail PBI' }}</h4>
              </div>
              <div class="modal-body">
                <!-- Ringkasan Section -->
                <div class="modal-section">
                  <div class="modal-section-header" :style="{ color: getRefTypeColor(selectedReference?.type) }">
                    <i class="fas fa-info-circle"></i>
                    <span>Ringkasan</span>
                  </div>
                  <div class="modal-section-content">
                    <div class="modal-scope">{{ selectedReference?.timeline || '-' }} — {{ selectedReference?.owner || '-' }}</div>
                    <p class="modal-summary">{{ selectedReference?.summary || '-' }}</p>
                  </div>
                </div>

                <!-- Artefak Section -->
                <div class="modal-section">
                  <div class="modal-section-header" :style="{ color: getRefTypeColor(selectedReference?.type) }">
                    <i class="fas fa-list-check"></i>
                    <span>Artefak / Isi Utama</span>
                  </div>
                  <div class="modal-section-content">
                    <ul class="modal-artifact-list">
                      <li v-for="(item, idx) in (selectedReference?.deliverables && selectedReference.deliverables.length ? selectedReference.deliverables : [])" :key="idx">
                        <i class="fas fa-check-circle"></i>
                        <span>{{ item }}</span>
                      </li>
                      <li v-if="!selectedReference?.deliverables || !selectedReference.deliverables.length" class="modal-empty">
                        Tidak ada artefak yang dipetakan.
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Requirements Section -->
                <div class="modal-section">
                  <div class="modal-section-header" :style="{ color: getRefTypeColor(selectedReference?.type) }">
                    <i class="fas fa-link"></i>
                    <span>Requirement yang Menggunakannya</span>
                  </div>
                  <div class="modal-section-content">
                    <div class="modal-requirements">
                      <button v-for="reqId in (selectedReference?.linked_requirements || [])" :key="reqId" type="button" class="modal-req-btn" @click="jumpToRequirement(reqId)">
                        <i class="fas fa-arrow-right"></i>
                        <span>{{ reqId }}</span>
                      </button>
                      <div v-if="!selectedReference?.linked_requirements || !selectedReference.linked_requirements.length" class="modal-empty">
                        Belum ada requirement inti yang dipetakan ke tenggat ini.
                      </div>
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
      showReferenceModal: false,
      selectedReference: null,
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
    getRefTypeColor(type, opacity = 1) {
      const baseColor = this.referenceTypeMeta[type]?.color || "#144e72";
      if (opacity === 1) return baseColor;
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
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
    jumpExplorer(domain = "", chapter = "", id = null) {
      this.activeDomain = domain || "";
      this.chapterFilter = chapter || "";
      this.requirementSearch = "";
      this.activeTab = "explorer";
      if (id) {
        this.setActiveRequirement(id);
      }
    },
    jumpReference(type = "", id = "") {
      this.referenceTypeFilter = type || "";
      this.referenceSearch = id || "";
      this.activeTab = "reference";
    },
    openReferenceModal(ref) {
      this.selectedReference = ref;
      this.showReferenceModal = true;
    },
    jumpToRequirement(id) {
      const req = this.requirements.find(r => r.id === id);
      if (!req) return;
      this.showReferenceModal = false;
      this.activeDomain = req.domain || '';
      this.chapterFilter = req.chapter || '';
      this.requirementSearch = '';
      this.setActiveRequirement(id);
      this.activeTab = 'explorer';
    },
    retryLoad() {
      this.loadData();
    },
    async loadData() {
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

@media (max-width:1440px){.sej-hero { min-height: 280px; padding: 1.25rem; } .sej-title { font-size: clamp(1.8rem, 3.2vw, 2.5rem); margin: 0.8rem 0 0.5rem; } .sej-metric { min-height: 80px; padding: 0.55rem 0.65rem; } .sej-metric strong { font-size: 1.35rem; } .sej-list, .sej-inspector { min-height: auto; max-height: 520px; }}
@media (max-height:850px) and (min-width:1024px){.sej-hero { min-height: 240px; padding: 1.15rem; } .sej-metrics { margin-top: 0.6rem; } .sej-list, .sej-inspector { max-height: calc(100vh - 280px); } .sej-inspector-body { padding-top: 0.5rem; }}
@media (max-width:1399.98px){.sej-workspace,.sej-refspace{grid-template-columns:1fr}.sej-inspector{position:static;min-height:auto}}
@media (max-width:1199.98px){.sej-hero,.sej-metric,.sej-side{min-height:auto}.sej-hero,.sej-nav,.sej-grid.two,.sej-refspace,.sej-metrics,.sej-mini-row,.sej-cards{grid-template-columns:1fr}.sej-bar,.sej-hotspot,.sej-family{grid-template-columns:1fr}}
@media (max-width:767.98px){.sej-hero,.sej-panel{padding:1.2rem;border-radius:22px}.sej-pillar-grid{grid-template-columns:1fr}.modal-shell{grid-template-columns:1fr}.modal-sidebar{flex-direction:row;padding:1rem;gap:1rem}.modal-sidebar-icon{width:2.5rem;height:2.5rem;margin-bottom:0}.modal-close{top:.5rem;right:.5rem}.modal-dialog{max-width:100%}}
</style>
