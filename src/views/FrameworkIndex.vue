<template>
  <div class="frx-shell">
    <section class="frx-hero">
      <div>
        <span class="frx-kicker"><i class="fas fa-compass"></i>SibukPatuh</span>
        <h1 class="frx-title">Framework & Regulasi Kepatuhan</h1>
        <p class="frx-copy">
          <strong>SibukPatuh</strong> adalah aplikasi explorer framework dan regulasi kepatuhan yang membantu tim IT, auditor, dan risk officer menelusuri standar keamanan siber — mulai dari <strong>ISO 27001, NIST CSF, COBIT 2019</strong> hingga regulasi nasional seperti <strong>SEOJK, Panduan Resiliensi OJK, dan PBI 02/2024</strong> — dalam satu tempat yang terstruktur.
        </p>
        <p class="frx-features">
          <span><i class="fas fa-check-circle"></i>Jelajahi kontrol & kewajiban per framework</span>
          <span><i class="fas fa-check-circle"></i>Filter berdasarkan kategori, domain, dan prioritas</span>
          <span><i class="fas fa-check-circle"></i>Lihat interpretasi, bukti audit, dan referensi</span>
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
          subtitle: "Kontrol keamanan informasi",
          summary: "Annex A lengkap dengan domain, tipe, dan interpretasi implementasi.",
          metric_label: "Kontrol",
          metric_value: 93,
          accent: "#0f766e",
          icon: "fa-shield-alt",
        },
        {
          routeName: "nist",
          name: "NIST CSF 2.0",
          subtitle: "Pemetaan fungsi & SP 800-53",
          summary: "GOVERN hingga RECOVER dengan filter subkategori dan referensi.",
          metric_label: "Subkategori",
          metric_value: 106,
          accent: "#144e72",
          icon: "fa-compass",
        },
        {
          routeName: "cobit",
          name: "COBIT 2019",
          subtitle: "Governance of enterprise I&T",
          summary: "Prinsip, design factor, core model, dan roadmap implementasi.",
          metric_label: "Objektif",
          metric_value: 40,
          accent: "#15803d",
          icon: "fa-project-diagram",
        },
        {
          routeName: "seojk",
          name: "SEOJK 29/2022",
          subtitle: "Ketahanan siber perbankan",
          summary: "Peta kewajiban, lampiran penilaian, dan format pelaporan regulator.",
          metric_label: "Kewajiban",
          metric_value: null,
          accent: "#b45309",
          icon: "fa-landmark",
        },
        {
          routeName: "resilience",
          name: "Resiliensi OJK",
          subtitle: "Digital resilience framework",
          summary: "Referensi tematik untuk ketahanan digital tata kelola dan operasional.",
          metric_label: "Kewajiban",
          metric_value: null,
          accent: "#7c3aed",
          icon: "fa-layer-group",
        },
        {
          routeName: "pbi",
          name: "PBI 02/2024",
          subtitle: "KKS & ketahanan siber BI",
          summary: "Kewajiban KKS, pelaporan insiden, dan pengawasan Bank Indonesia.",
          metric_label: "Kewajiban",
          metric_value: null,
          accent: "#b91c1c",
          icon: "fa-university",
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
            const parts = keyPath.split('.');
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
    ] = await Promise.all([
      loadData("/data/iso27001.json"),
      loadData("/data/nist_csf.json"),
      loadData("/data/cobit_2019.json", "principles_system"),
      loadData("/data/seojk_requirements.json"),
      loadData("/data/seojk_resilience_guidance.json"),
      loadData("/data/pbi_022024_requirements.json"),
    ]);

    this.frameworks[0].metric_value = isoCount || 93;
    this.frameworks[1].metric_value = nistCount || 106;
    this.frameworks[2].metric_value = cobitCount || 40;
    this.frameworks[3].metric_value = seojkCount || 0;
    this.frameworks[4].metric_value = resilienceCount || 0;
    this.frameworks[5].metric_value = pbiCount || 0;
  },
};
</script>

<style scoped>
.frx-shell{display:grid;gap:1rem}
.frx-hero{padding:.8rem 1rem;border-radius:18px;background:radial-gradient(circle at top right,rgba(247,209,153,.9),transparent 32%),radial-gradient(circle at bottom left,rgba(149,203,212,.72),transparent 30%),linear-gradient(135deg,#17324d 0%,#1d5d73 50%,#eedab7 100%);box-shadow:0 18px 36px rgba(15,23,42,.08);overflow:hidden;position:relative}
.frx-hero>*{position:relative;z-index:1}
.frx-kicker{display:inline-flex;align-items:center;gap:.4rem;padding:.25rem .55rem;border-radius:999px;color:rgba(255,250,242,.92);background:rgba(255,250,242,.16);font-size:.65rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em}
.frx-title{margin:.5rem 0 .25rem;color:#fffaf2;font-size:clamp(1.3rem,2.5vw,1.8rem);font-weight:800;line-height:1.1}
.frx-copy{margin:0;color:rgba(255,250,242,.8);font-size:.85rem;line-height:1.6}
.frx-copy strong{color:#fffaf2}
.frx-features{display:flex;flex-wrap:wrap;gap:.5rem .9rem;margin-top:.65rem;padding-top:.55rem;border-top:1px solid rgba(255,255,255,.15)}
.frx-features span{display:inline-flex;align-items:center;gap:.3rem;color:rgba(255,250,242,.75);font-size:.76rem;font-weight:600}
.frx-features i{color:rgba(255,250,242,.5);font-size:.7rem}
.frx-card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.7rem}
.frx-card{border-radius:14px;border:1px solid rgba(22,50,75,.08);background:rgba(255,255,255,.85);box-shadow:0 8px 18px rgba(15,23,42,.04);transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease}
.frx-card:hover{border-color:rgba(22,50,75,.18);box-shadow:0 12px 24px rgba(15,23,42,.08);transform:translateY(-2px)}
.frx-card-link{display:block;padding:.7rem .85rem;text-decoration:none;color:inherit}
.frx-card-top{display:flex;align-items:center;gap:.65rem}
.frx-card-icon{width:2.2rem;height:2.2rem;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;color:#fffaf2;background:linear-gradient(135deg,var(--accent) 0%,rgba(22,50,75,.9) 100%);box-shadow:0 8px 14px rgba(15,23,42,.1);flex-shrink:0;font-size:.85rem}
.frx-card-info{flex:1;min-width:0}
.frx-card-info h3{margin:0;font-size:.85rem;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.frx-card-info p{margin:.15rem 0 0;color:#5c6776;line-height:1.45;font-size:.75rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.frx-card-metric{display:flex;align-items:baseline;gap:.35rem;margin-top:.55rem;padding-top:.55rem;border-top:1px solid rgba(22,50,75,.06)}
.frx-card-count{font-size:1.15rem;font-weight:800;color:var(--accent);line-height:1}
.frx-card-label{font-size:.68rem;font-weight:700;color:#5c6776;text-transform:uppercase;letter-spacing:.06em}
@media (max-width:1199.98px){.frx-card-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:767.98px){.frx-card-grid{grid-template-columns:1fr}.frx-hero{padding:.9rem}}
</style>
