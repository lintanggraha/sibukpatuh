<template>
  <div class="frx-shell">
    <section class="frx-hero">
      <div class="frx-hero-content">
        <span class="frx-kicker">
          <span class="pulse-dot"></span>
          <i class="fas fa-compass"></i> Platform Navigasi Edukatif
        </span>
        <h1 class="frx-title">Ruang Belajar Framework & Regulasi Siber</h1>
        <p class="frx-copy">
          <strong>SibukPatuh</strong> hadir sebagai sarana pembelajaran interaktif untuk memahami struktur, istilah, 
          dan konsep utama berbagai standar keamanan siber internasional serta regulasi nasional dalam satu antarmuka yang modern.
        </p>
        <div class="frx-hero-stats">
          <div class="stat-item">
            <span class="stat-val">{{ readyCount }}/{{ frameworkCount }}</span>
            <span class="stat-lab">Framework Siap</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat-item">
            <span class="stat-val">{{ formatNumber(totalRecords) }}+</span>
            <span class="stat-lab">Poin Pembelajaran</span>
          </div>
        </div>
      </div>
      <div class="hero-bg-accent"></div>
    </section>

    <section class="frx-disclaimer" aria-label="Disclaimer edukatif">
      <div class="frx-disclaimer-icon">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <div class="frx-disclaimer-copy">
        <h5 class="frx-disclaimer-title">Penting: Batasan Materi & Edukasi</h5>
        <p>
          Materi <strong>ISO 27001</strong> dan <strong>COBIT 2019</strong> di SibukPatuh disusun murni sebagai
          <strong>ringkasan edukatif, interpretasi, dan bahan pembelajaran</strong>. Konten ini bukan merupakan teks resmi,
          bukan reproduksi penuh, dan bukan pengganti dokumen berlisensi dari ISO, BSN, atau ISACA.
          Penyebutan nama standar dilakukan hanya untuk mempermudah identifikasi topik pembelajaran. Untuk kebutuhan
          audit, sertifikasi, atau referensi formal, harap selalu merujuk pada dokumen standar resmi yang berlaku.
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
.frx-shell{display:grid;gap:1.5rem}
.frx-hero{padding:2.5rem 2rem;border-radius:28px;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);box-shadow:0 20px 50px rgba(0,0,0,0.15);overflow:hidden;position:relative}
.frx-hero-content{position:relative;z-index:2;max-width:800px}
.frx-kicker{display:inline-flex;align-items:center;gap:.6rem;padding:.4rem .8rem;border-radius:999px;color:rgba(255,255,255,.9);background:rgba(255,255,255,0.08);font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border:1px solid rgba(255,255,255,0.1)}
.pulse-dot{width:6px;height:6px;background:#10b981;border-radius:50%;box-shadow:0 0 0 0 rgba(16,185,129,.4);animation:pulse 2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(16,185,129,.4)}70%{box-shadow:0 0 0 8px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}
.frx-title{margin:1rem 0 .75rem;color:#fff;font-size:clamp(1.5rem,4vw,2.4rem);font-weight:800;line-height:1.2;letter-spacing:-0.5px}
.frx-copy{margin:0;color:rgba(255,255,255,.7);font-size:1rem;line-height:1.6}
.frx-hero-stats{display:flex;align-items:center;gap:1.5rem;margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,0.1)}
.stat-item{display:flex;flex-direction:column}
.stat-val{color:#fff;font-size:1.4rem;font-weight:800;line-height:1}
.stat-lab{color:rgba(255,255,255,0.5);font-size:.7rem;font-weight:600;text-transform:uppercase;margin-top:0.25rem}
.stat-sep{width:1px;height:30px;background:rgba(255,255,255,0.1)}
.hero-bg-accent{position:absolute;top:-50%;right:-10%;width:60%;height:200%;background:radial-gradient(circle at center, rgba(30,136,229,0.15) 0%, transparent 70%);transform:rotate(-15deg);z-index:1;pointer-events:none}
.frx-disclaimer{display:flex;gap:1.2rem;align-items:flex-start;padding:1.5rem;border-radius:24px;border:1px solid rgba(245,158,11,.2);background:rgba(255,255,255,0.6);box-shadow:0 10px 30px rgba(0,0,0,0.03);backdrop-filter:blur(15px)}
.frx-disclaimer-icon{width:3rem;height:3rem;display:inline-flex;align-items:center;justify-content:center;border-radius:18px;background:linear-gradient(135deg,#fbbf24 0%,#f59e0b 100%);color:#fff;box-shadow:0 10px 20px rgba(245,158,11,.15);font-size:1.2rem;flex-shrink:0}
.frx-disclaimer-title{margin:0 0 .3rem;color:#92400e;font-size:1rem;font-weight:800}
.frx-disclaimer-copy p{margin:0;color:#78350f;font-size:.85rem;line-height:1.7}
.frx-card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
.frx-card{border-radius:24px;border:1px solid rgba(0,0,0,0.05);background:#fff;box-shadow:0 4px 15px rgba(0,0,0,0.02);transition:all .3s cubic-bezier(0.4,0,0.2,1);position:relative;overflow:hidden}
.frx-card::before{content:'';position:absolute;top:0;left:0;width:100%;height:4px;background:var(--accent);opacity:0;transition:opacity .3s}
.frx-card:hover{box-shadow:0 20px 40px rgba(0,0,0,0.08);transform:translateY(-6px);border-color:rgba(0,0,0,0.1)}
.frx-card:hover::before{opacity:1}
.frx-card-link{display:block;padding:1.5rem;text-decoration:none;color:inherit}
.frx-card-top{display:flex;flex-direction:column;gap:1rem}
.frx-card-icon{width:3.2rem;height:3.2rem;display:inline-flex;align-items:center;justify-content:center;border-radius:18px;color:#fff;background:var(--accent);box-shadow:0 8px 20px rgba(0,0,0,0.1)}
.frx-card-info h3{margin:0;font-size:1.1rem;font-weight:800;color:#1e293b}
.frx-card-info p{margin:.5rem 0 0;color:#64748b;font-size:.85rem;line-height:1.5}
.frx-card-metric{display:flex;align-items:baseline;gap:.5rem;margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(0,0,0,0.05)}
.frx-card-count{font-size:1.5rem;font-weight:800;color:var(--accent)}
.frx-card-label{font-size:.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em}
@media (max-width:1199.98px){.frx-card-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:767.98px){.frx-card-grid{grid-template-columns:1fr}.frx-hero{padding:2rem 1.5rem}.frx-disclaimer{flex-direction:column;gap:1rem}.frx-disclaimer-icon{width:2.5rem;height:2.5rem;font-size:1rem}}
</style>
