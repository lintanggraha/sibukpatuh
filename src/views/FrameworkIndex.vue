<template>
  <div class="frx-shell">
    <section class="frx-hero">
      <div class="frx-hero-content">
        <span class="frx-kicker"><i class="fas fa-compass"></i> SibukPatuh - Platform Edukatif</span>
        <h1 class="frx-title">Ruang Belajar Framework & Regulasi Siber</h1>
        <p class="frx-copy">
          Memahami struktur dan konsep acuan keamanan siber (ISO, NIST, COBIT) dan regulasi nasional (OJK, BI) dalam satu antarmuka terintegrasi.
        </p>
      </div>

    </section>

    <section class="frx-disclaimer" aria-label="Disclaimer edukatif">
      <div class="frx-disclaimer-icon">
        <i class="fas fa-exclamation-circle text-warning"></i>
      </div>
      <div class="frx-disclaimer-copy">
        <p>
          <strong>Disclaimer:</strong> Materi <strong>ISO 27001</strong> dan <strong>COBIT 2019</strong> di SibukPatuh disusun murni sebagai <strong>ringkasan edukatif, interpretasi, dan bahan pembelajaran</strong>. Konten ini bukan merupakan teks resmi dan bukan pengganti dokumen berlisensi dari ISO, BSN, atau ISACA. Harap merujuk pada dokumen standar resmi yang berlaku untuk keperluan formal.
        </p>
      </div>
    </section>

    <section class="frx-card-grid">
      <article v-for="fw in frameworks" :key="fw.routeName" class="frx-card" :style="{ '--accent': fw.accent }">
        <router-link :to="{ name: fw.routeName }" class="frx-card-link">
          <div class="frx-card-top">
            <span class="frx-card-icon"><i :class="`fas ${fw.icon}`"></i></span>
            <div class="frx-card-info">
              <h3>{{ fw.name }}</h3>
              <p>{{ fw.summary }}</p>
            </div>
          </div>
          <div class="frx-card-metric">
            <span class="frx-card-count">{{ fw.metric_value !== null ? formatNumber(fw.metric_value) : '-' }}</span>
            <span class="frx-card-label">{{ fw.metric_label }}</span>
          </div>
        </router-link>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: "FrameworkIndex",
  data() {
    return {
      frameworks: [
        {
          routeName: "iso27001",
          name: "ISO 27001:2022",
          subtitle: "Ringkasan kontrol keamanan informasi",
          summary: "Ringkasan edukatif Annex A, domain kontrol, dan konteks pembacaan awal.",
          metric_label: "Kontrol",
          metric_value: 93,
          accent: "#0f766e",
          icon: "fa-shield-alt",
        },
        {
          routeName: "nist",
          name: "NIST CSF 2.0",
          subtitle: "Kerangka belajar fungsi dan subkategori",
          summary: "GOVERN hingga RECOVER untuk membantu membaca struktur dan istilah inti.",
          metric_label: "Subkategori",
          metric_value: 106,
          accent: "#144e72",
          icon: "fa-compass",
        },
        {
          routeName: "cobit",
          name: "COBIT 2019",
          subtitle: "Ringkasan governance of enterprise I&T",
          summary: "Ringkasan edukatif prinsip, design factor, core model, dan alur pembacaan.",
          metric_label: "Objektif",
          metric_value: 40,
          accent: "#15803d",
          icon: "fa-project-diagram",
        },
        {
          routeName: "seojk",
          name: "SEOJK 29/2022",
          subtitle: "Ringkasan ketahanan siber perbankan",
          summary: "Peta kewajiban, lampiran penilaian, dan konteks pembacaan regulasi.",
          metric_label: "Kewajiban",
          metric_value: null,
          accent: "#b45309",
          icon: "fa-landmark",
        },
        {
          routeName: "resilience",
          name: "Resiliensi OJK",
          subtitle: "Panduan belajar digital resilience",
          summary: "Referensi tematik untuk memahami ketahanan digital tata kelola dan operasional.",
          metric_label: "Kewajiban",
          metric_value: null,
          accent: "#7c3aed",
          icon: "fa-layer-group",
        },
        {
          routeName: "pbi",
          name: "PBI 02/2024",
          subtitle: "Ringkasan KKS dan ketahanan siber BI",
          summary: "Kewajiban KKS, pelaporan insiden, dan konteks pembacaan regulasi BI.",
          metric_label: "Kewajiban",
          metric_value: null,
          accent: "#b91c1c",
          icon: "fa-university",
        },
        {
          routeName: "owasp_top10",
          name: "OWASP Top 10 2025",
          subtitle: "10 kerentanan aplikasi web paling kritis",
          summary: "Eksplorasi kerentanan keamanan web, analogi penyerang, dan spesifikasi mitigasi pengembangan.",
          metric_label: "Kerentanan",
          metric_value: null,
          accent: "#b91c1c",
          icon: "fa-bug",
        },
        {
          routeName: "owasp_asvs",
          name: "OWASP ASVS 5.0.0",
          subtitle: "Standar pengujian & verifikasi keamanan",
          summary: "Kriteria pengujian kontrol arsitektur maupun operasional berdasarkan level risiko aplikasi.",
          metric_label: "Kategori Uji",
          metric_value: null,
          accent: "#1d4ed8",
          icon: "fa-check-double",
        },
      ],
    };
  },
  computed: {
    frameworkCount() {
      return this.frameworks.length;
    },
    readyCount() {
      return this.frameworks.filter((f) => f.metric_value !== null).length;
    },
    totalRecords() {
      return this.frameworks.reduce((sum, f) => sum + (f.metric_value || 0), 0);
    },
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat("id-ID").format(value);
    },
  },
  async mounted() {
    // Load real metrics from JSON files
    const loadData = async (url, keyPath) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          // Support nested data structures
          if (keyPath) {
            const parts = keyPath.split(".");
            let result = data;
            for (const part of parts) {
              if (result && result[part] !== undefined) {
                result = result[part];
              } else {
                return 0;
              }
            }
            return Array.isArray(result) ? result.length : 0;
          }
          return Array.isArray(data) ? data.length : data.total || 0;
        }
      } catch (e) {
        console.error("Error loading data:", e);
      }
      return 0;
    };

    const [
      isoCount,
      nistCount,
      cobitCount,
      seojkCount,
      resilienceCount,
      pbiCount,
      owaspTop10Count,
      owaspAsvsCount,
    ] = await Promise.all([
      loadData("/data/iso27001.json"),
      loadData("/data/nist_csf.json"),
      loadData("/data/cobit_2019.json", "principles_system"),
      loadData("/data/seojk_requirements.json"),
      loadData("/data/seojk_resilience_guidance.json"),
      loadData("/data/pbi_022024_requirements.json"),
      loadData("/data/owasp_top10_reqs.json"),
      loadData("/data/owasp_asvs_reqs.json"),
    ]);

    this.frameworks[0].metric_value = isoCount || 93;
    this.frameworks[1].metric_value = nistCount || 106;
    this.frameworks[2].metric_value = cobitCount || 40;
    this.frameworks[3].metric_value = seojkCount || 0;
    this.frameworks[4].metric_value = resilienceCount || 0;
    this.frameworks[5].metric_value = pbiCount || 0;
    this.frameworks[6].metric_value = owaspTop10Count || 10;
    this.frameworks[7].metric_value = owaspAsvsCount || 8;
  },
};
</script>

<style scoped>
.frx-shell{display:grid;gap:0.75rem}
.frx-hero{padding:1.25rem 1.5rem;border-radius:20px;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);box-shadow:0 12px 24px rgba(0,0,0,0.1);overflow:hidden;position:relative}
.frx-hero-content{position:relative;z-index:2;max-width:900px}
.frx-kicker{display:inline-flex;align-items:center;gap:.4rem;padding:.2rem .5rem;border-radius:999px;color:rgba(255,255,255,.6);background:rgba(255,255,255,0.05);font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.frx-title{margin:.5rem 0 .25rem;color:#fff;font-size:clamp(1.2rem,3vw,1.8rem);font-weight:800;line-height:1.2;letter-spacing:-0.2px}
.frx-copy{margin:0;color:rgba(255,255,255,.6);font-size:0.9rem;line-height:1.5}
.frx-disclaimer{display:flex;gap:.75rem;align-items:center;padding:.75rem 1rem;border-radius:18px;border:1px solid rgba(245,158,11,.1);background:rgba(255,255,255,0.5);box-shadow:0 4px 12px rgba(0,0,0,0.02);backdrop-filter:blur(10px)}
.frx-disclaimer-icon{font-size:1rem;color:#f59e0b;flex-shrink:0}
.frx-disclaimer-copy p{margin:0;color:#6b4f3a;font-size:.78rem;line-height:1.6}
.frx-disclaimer-copy p strong{color:#92400e;font-weight:800;display:inline}
.frx-card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem}
.frx-card{border-radius:18px;border:1px solid rgba(0,0,0,0.05);background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.01);transition:all .2s ease}
.frx-card:hover{box-shadow:0 8px 16px rgba(0,0,0,0.04);transform:translateY(-2px);border-color:rgba(0,0,0,0.1)}
.frx-card-link{display:block;padding:1rem;text-decoration:none;color:inherit}
.frx-card-top{display:flex;align-items:center;gap:.75rem}
.frx-card-icon{width:2.4rem;height:2.4rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;color:#fff;background:var(--accent);font-size:0.9rem;flex-shrink:0}
.frx-card-info h3{margin:0;font-size:.9rem;font-weight:800;color:#1e293b}
.frx-card-info p{margin:.15rem 0 0;color:#64748b;font-size:.75rem;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.frx-card-metric{display:flex;align-items:baseline;gap:.35rem;margin-top:.75rem;padding-top:.5rem;border-top:1px solid rgba(0,0,0,0.05)}
.frx-card-count{font-size:1.1rem;font-weight:800;color:var(--accent)}
.frx-card-label{font-size:.65rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em}
@media (max-width:1199.98px){.frx-card-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:767.98px){.frx-card-grid{grid-template-columns:1fr}.frx-hero{padding:1.25rem}.frx-disclaimer{padding:.75rem}}
</style>
