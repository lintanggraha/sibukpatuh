/**
 * Search Index Service
 *
 * Membangun index pencarian terpadu dari seluruh file data kontrol di
 * `public/data/`. Setiap sumber punya skema field yang berbeda, sehingga
 * service ini menormalisasi semuanya ke satu bentuk seragam sebelum
 * dipakai oleh komponen pencarian.
 *
 * Index dibangun secara lazy (saat pencarian pertama dibuka) lalu disimpan
 * di memory per bahasa, agar halaman awal tidak terbebani unduhan data.
 */

/* -------------------------------------------------------------------------- */
/* Definisi sumber data                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Setiap entri mendeskripsikan satu file data:
 * - `file`      : nama dasar file di public/data (tanpa .json dan tanpa _en)
 * - `framework` : kode singkat framework
 * - `label`     : nama tampilan framework
 * - `route`     : nama route Vue Router tujuan
 * - `icon`      : ikon Font Awesome
 * - `color`     : warna aksen badge
 * - `shape`     : pola normalisasi yang dipakai
 * - `tab`       : (opsional) nama tab tujuan bila view menampilkan dataset ini
 *                 di tab selain 'explorer'
 * - `section`   : (khusus COBIT) daftar section di dalam object
 */
const SOURCES = [
  {
    file: 'iso27001',
    framework: 'iso27001',
    label: 'ISO 27001',
    route: 'iso27001',
    icon: 'fa-shield-alt',
    color: '#0f766e',
    shape: 'isoControl',
  },
  {
    file: 'iso37001',
    framework: 'iso37001',
    label: 'ISO 37001',
    route: 'iso37001',
    icon: 'fa-handshake',
    color: '#7c3aed',
    shape: 'isoControl',
  },
  {
    file: 'nist_csf',
    framework: 'nist',
    label: 'NIST CSF 2.0',
    route: 'nist',
    icon: 'fa-compass',
    color: '#2563eb',
    shape: 'nistCsf',
  },
  {
    file: 'sp800_53',
    framework: 'sp80053',
    label: 'NIST SP 800-53',
    route: 'nist',
    // Nist.vue menampilkan NIST CSF di tab 'explorer' tetapi SP 800-53 di tab
    // 'reference', sehingga tab tujuan perlu dinyatakan eksplisit.
    tab: 'reference',
    icon: 'fa-list-check',
    color: '#1d4ed8',
    shape: 'sp80053',
  },
  {
    file: 'cobit_2019',
    framework: 'cobit',
    label: 'COBIT 2019',
    route: 'cobit',
    icon: 'fa-project-diagram',
    color: '#c2410c',
    shape: 'cobit',
  },
  {
    file: 'seojk_requirements',
    framework: 'seojk',
    label: 'SEOJK 29/2022',
    route: 'seojk',
    icon: 'fa-landmark',
    color: '#a16207',
    shape: 'requirement',
  },
  {
    file: 'seojk_appendices',
    framework: 'seojk',
    label: 'SEOJK 29/2022',
    route: 'seojk',
    icon: 'fa-paperclip',
    color: '#a16207',
    shape: 'appendix',
  },
  {
    file: 'seojk_resilience_guidance',
    framework: 'resilience',
    label: 'Panduan Resiliensi OJK',
    route: 'resilience',
    icon: 'fa-layer-group',
    color: '#0891b2',
    shape: 'guidance',
  },
  {
    file: 'uu_pdp_requirements',
    framework: 'pdp',
    label: 'UU PDP 27/2022',
    route: 'pdp',
    icon: 'fa-user-shield',
    color: '#15803d',
    shape: 'requirement',
  },
  {
    file: 'padk_1_2026_requirements',
    framework: 'padk',
    label: 'PADK 1/2026',
    route: 'padk',
    icon: 'fa-server',
    color: '#b91c1c',
    shape: 'requirement',
  },
  {
    file: 'padk_1_2026_appendices',
    framework: 'padk',
    label: 'PADK 1/2026',
    route: 'padk',
    icon: 'fa-paperclip',
    color: '#b91c1c',
    shape: 'appendix',
  },
  {
    file: 'padg_requirements',
    framework: 'padg',
    label: 'PADG 32/2025',
    route: 'padg',
    icon: 'fa-credit-card',
    color: '#9333ea',
    shape: 'requirement',
  },
  {
    file: 'padg_appendices',
    framework: 'padg',
    label: 'PADG 32/2025',
    route: 'padg',
    icon: 'fa-paperclip',
    color: '#9333ea',
    shape: 'appendix',
  },
  {
    file: 'pbi_022024_requirements',
    framework: 'pbi',
    label: 'PBI 2/2024',
    route: 'pbi',
    icon: 'fa-university',
    color: '#0369a1',
    shape: 'requirement',
  },
  {
    file: 'pbi_022024_references',
    framework: 'pbi',
    label: 'PBI 2/2024',
    route: 'pbi',
    icon: 'fa-bookmark',
    color: '#0369a1',
    shape: 'reference',
  },
  {
    file: 'owasp_top10_reqs',
    framework: 'owasp_top10',
    label: 'OWASP Top 10',
    route: 'owasp_top10',
    icon: 'fa-bug',
    color: '#dc2626',
    shape: 'requirement',
  },
  {
    file: 'owasp_top10_apps',
    framework: 'owasp_top10',
    label: 'OWASP Top 10',
    route: 'owasp_top10',
    icon: 'fa-wrench',
    color: '#dc2626',
    shape: 'appendix',
  },
  {
    file: 'owasp_asvs_reqs',
    framework: 'owasp_asvs',
    label: 'OWASP ASVS',
    route: 'owasp_asvs',
    icon: 'fa-check-double',
    color: '#059669',
    shape: 'requirement',
  },
  {
    file: 'owasp_asvs_apps',
    framework: 'owasp_asvs',
    label: 'OWASP ASVS',
    route: 'owasp_asvs',
    icon: 'fa-signal',
    color: '#059669',
    shape: 'appendix',
  },
  {
    file: 'breaches',
    framework: 'breaches',
    label: 'Pusat Intelijen',
    route: 'intelligence_center',
    icon: 'fa-shield-virus',
    color: '#be123c',
    shape: 'breach',
  },
];

/** Section di dalam cobit_2019.json beserta label kategorinya. */
const COBIT_SECTIONS = {
  highlights: 'Sorotan',
  value_outcomes: 'Value Outcome',
  chapters: 'Bab',
  principles_system: 'Prinsip Governance System',
  principles_framework: 'Prinsip Framework',
  components: 'Komponen',
  design_factors: 'Design Factor',
  domains: 'Domain',
  goal_cascade: 'Goals Cascade',
  implementation_phases: 'Fase Implementasi',
  audiences: 'Audiens',
};

const COBIT_SECTIONS_EN = {
  highlights: 'Highlights',
  value_outcomes: 'Value Outcome',
  chapters: 'Chapter',
  principles_system: 'Governance System Principle',
  principles_framework: 'Framework Principle',
  components: 'Component',
  design_factors: 'Design Factor',
  domains: 'Domain',
  goal_cascade: 'Goals Cascade',
  implementation_phases: 'Implementation Phase',
  audiences: 'Audience',
};

/* -------------------------------------------------------------------------- */
/* Utilitas                                                                   */
/* -------------------------------------------------------------------------- */

/** Ubah nilai apa pun (string, array, object) menjadi teks datar. */
function flatten(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(flatten).filter(Boolean).join(' ');
  if (typeof value === 'object') return Object.values(value).map(flatten).filter(Boolean).join(' ');
  return '';
}

/** Gabungkan beberapa field menjadi satu blob teks untuk pencocokan. */
function blob(...values) {
  return values.map(flatten).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

/** Potong teks panjang menjadi cuplikan yang enak dibaca. */
function excerpt(text, max = 180) {
  const clean = flatten(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}...`;
}

/* -------------------------------------------------------------------------- */
/* Normalisasi per pola                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Setiap fungsi menerima satu item mentah dan mengembalikan bentuk seragam:
 * { id, title, category, subtitle, searchText }
 * Field lain (framework, label, route, icon, color) disuntikkan oleh pemanggil.
 */
const NORMALIZERS = {
  /**
   * ISO 27001 dan ISO 37001: id, name, type, domain, description
   *
   * Dataset menyimpan kontrol Annex A dengan ID polos (misalnya `8.24`),
   * sedangkan praktisi audit menyebutnya dengan notasi resmi `A.8.24`.
   * Kontrol Annex A karenanya diberi alias agar keduanya dapat ditemukan,
   * sementara klausa utama (Klausa 4 sampai 10) tetap memakai ID polos.
   */
  isoControl(item) {
    const isClause = item.type === 'Klausa' || item.type === 'Clause';
    const aliases = isClause
      ? [`Klausa ${item.id}`, `Clause ${item.id}`]
      : [`A.${item.id}`, `Annex A.${item.id}`];

    return {
      id: item.id,
      title: item.name || item.title || item.id,
      category: item.domain || item.type || '',
      subtitle: excerpt(item.description),
      aliases,
      searchText: blob(
        item.id,
        aliases,
        item.name,
        item.type,
        item.domain,
        item.description,
        item.capability,
        item.concept,
        item.focusArea,
        item.implementationTips,
        item.exampleEvidence,
        item.analogy,
      ),
    };
  },

  /** NIST CSF 2.0: id, function, category, title, description, sp80053 */
  nistCsf(item) {
    return {
      id: item.id,
      title: item.title || item.id,
      category: item.category || item.function || '',
      subtitle: excerpt(item.description),
      searchText: blob(
        item.id,
        item.function,
        item.category,
        item.title,
        item.description,
        item.panda_explanation,
        item.evidence,
        item.sp80053,
      ),
    };
  },

  /** NIST SP 800-53: id, family, family_name, description */
  sp80053(item) {
    return {
      id: item.id,
      title: `${item.id} — ${item.family_name || item.family || ''}`.replace(/ — $/, ''),
      category: item.family_name || item.family || '',
      subtitle: excerpt(item.description),
      searchText: blob(
        item.id,
        item.family,
        item.family_name,
        item.description,
        item.bukti_audit,
        item.nist_references,
      ),
    };
  },

  /** Requirements regulasi: id, chapter, chapter_title, pillar, title, summary */
  requirement(item) {
    const chapter = item.chapter_title || item.domain || item.chapter || '';
    const article = item.article ? ` (${item.article})` : '';
    return {
      id: item.id,
      title: item.title || item.id,
      category: `${chapter}${article}`.trim(),
      subtitle: excerpt(item.summary),
      searchText: blob(
        item.id,
        item.chapter,
        item.chapter_title,
        item.domain,
        item.article,
        item.pillar,
        item.title,
        item.summary,
        item.focus,
        item.evidence,
        item.owner,
        item.cadence,
        item.scoring,
        item.reporting,
        item.analogy,
        item.appendices,
      ),
    };
  },

  /** Appendices dan application guides: id, title, type, scope, summary, contains */
  appendix(item) {
    return {
      id: item.id,
      title: item.title || item.id,
      category: item.type || item.scope || '',
      subtitle: excerpt(item.summary),
      searchText: blob(
        item.id,
        item.title,
        item.type,
        item.scope,
        item.summary,
        item.contains,
        item.used_by,
      ),
    };
  },

  /** Panduan Resiliensi OJK: id, title, section, summary, focus, mapped_pillars */
  guidance(item) {
    return {
      id: item.id,
      title: item.title || item.id,
      category: item.section || '',
      subtitle: excerpt(item.summary),
      searchText: blob(
        item.id,
        item.title,
        item.section,
        item.summary,
        item.focus,
        item.mapped_pillars,
        item.related_requirements,
        item.analogy,
      ),
    };
  },

  /** Referensi PBI: id, type, article, title, summary, timeline, deliverables */
  reference(item) {
    return {
      id: item.id,
      title: item.title || item.id,
      category: `${item.type || ''}${item.article ? ` (${item.article})` : ''}`.trim(),
      subtitle: excerpt(item.summary),
      searchText: blob(
        item.id,
        item.type,
        item.article,
        item.title,
        item.summary,
        item.timeline,
        item.owner,
        item.deliverables,
        item.linked_requirements,
      ),
    };
  },

  /** Insiden kebocoran data: Name, Domain, BreachDate, Description, DataClasses */
  breach(item) {
    const year = item.BreachDate ? String(item.BreachDate).slice(0, 4) : '';
    return {
      id: item.Domain || item.Name,
      title: item.Name || item.Domain,
      category: [item.Country, year].filter(Boolean).join(' • '),
      subtitle: excerpt(item.Description),
      searchText: blob(
        item.Name,
        item.Domain,
        item.Country,
        item.BreachDate,
        item.Description,
        item.DataClasses,
      ),
    };
  },
};

/* -------------------------------------------------------------------------- */
/* Pembangunan index                                                          */
/* -------------------------------------------------------------------------- */

/** Cache index per bahasa: { id: [...], en: [...] } */
const cache = {};

/** Promise yang sedang berjalan, agar pemanggilan paralel tidak menduplikasi fetch. */
const pending = {};

/**
 * Ambil satu file data dan kembalikan array item mentah.
 * COBIT dikembalikan sebagai object karena strukturnya bersarang.
 *
 * Path yang diminta selalu versi dasar (bahasa Indonesia). Pemilihan versi
 * bahasa Inggris ditangani oleh `installRegulationDataFetchTranslator()` yang
 * membungkus `window.fetch` secara global di `main.js`, sehingga perilakunya
 * konsisten dengan cara seluruh view memuat data.
 */
async function fetchSource(source) {
  const url = `/data/${source.file}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} pada ${url}`);
  return response.json();
}

/** Ubah satu sumber menjadi daftar entri index yang seragam. */
function normalizeSource(source, raw, lang) {
  const base = {
    framework: source.framework,
    frameworkLabel: source.label,
    route: source.route,
    tab: source.tab || null,
    icon: source.icon,
    color: source.color,
  };

  // COBIT: object dengan banyak section, bukan array
  if (source.shape === 'cobit') {
    const labels = lang === 'en' ? COBIT_SECTIONS_EN : COBIT_SECTIONS;
    const entries = [];
    Object.entries(labels).forEach(([key, sectionLabel]) => {
      const items = raw?.[key];
      if (!Array.isArray(items)) return;
      items.forEach((item) => {
        entries.push({
          ...base,
          id: item.id,
          title: item.title || item.id,
          category: sectionLabel,
          subtitle: excerpt(item.summary || item.importance),
          searchText: blob(
            item.id,
            item.title,
            sectionLabel,
            item.summary,
            item.importance,
            item.focus,
            item.details,
            item.group,
            item.analogy,
            item.educational_tips,
            item.evidence,
            item.reporting,
          ),
        });
      });
    });
    return entries;
  }

  const normalizer = NORMALIZERS[source.shape];
  if (!normalizer) return [];

  const items = Array.isArray(raw) ? raw : raw?.controls || [];
  return items
    .map((item) => {
      const normalized = normalizer(item);
      if (!normalized?.id && !normalized?.title) return null;
      return { ...base, ...normalized };
    })
    .filter(Boolean);
}

/**
 * Bangun index untuk satu bahasa. Hasil disimpan di cache.
 * Kegagalan pada satu file tidak membatalkan keseluruhan index.
 *
 * @param {'id'|'en'} lang
 * @returns {Promise<Array>} daftar entri index
 */
export async function buildIndex(lang = 'id') {
  const key = lang === 'en' ? 'en' : 'id';
  if (cache[key]) return cache[key];
  if (pending[key]) return pending[key];

  pending[key] = (async () => {
    const results = await Promise.all(
      SOURCES.map(async (source) => {
        try {
          const raw = await fetchSource(source);
          return normalizeSource(source, raw, key);
        } catch (error) {
          // Satu file gagal tidak boleh menggagalkan seluruh pencarian.
          if (import.meta.env.DEV) {
            console.warn(`[searchIndex] Gagal memuat ${source.file}:`, error.message);
          }
          return [];
        }
      }),
    );

    const flat = results.flat().map((entry, idx) => ({
      ...entry,
      _key: `${entry.framework}:${entry.id}:${idx}`,
      _haystack: entry.searchText.toLowerCase(),
      _titleLower: (entry.title || '').toLowerCase(),
      _idLower: String(entry.id || '').toLowerCase(),
      // Alias ID resmi (misalnya `a.8.24` untuk kontrol Annex A ISO 27001)
      // diperlakukan setara dengan ID utama saat pemberian skor.
      _aliasesLower: (entry.aliases || []).map((a) => String(a).toLowerCase()),
    }));

    cache[key] = flat;
    delete pending[key];
    return flat;
  })();

  return pending[key];
}

/** Kosongkan cache index (dipakai saat bahasa berubah atau untuk pengujian). */
export function clearIndexCache() {
  Object.keys(cache).forEach((k) => delete cache[k]);
}

/** Apakah index untuk bahasa tertentu sudah tersedia di memory. */
export function isIndexReady(lang = 'id') {
  return Boolean(cache[lang === 'en' ? 'en' : 'id']);
}

/* -------------------------------------------------------------------------- */
/* Pencarian dan pemberian skor                                               */
/* -------------------------------------------------------------------------- */

/**
 * Hitung skor relevansi satu entri terhadap daftar token pencarian.
 * Skor lebih tinggi berarti lebih relevan. Nilai 0 berarti tidak cocok.
 *
 * Prioritas pencocokan:
 * 1. ID atau alias persis   — pengguna yang tahu kode kontrol harus langsung dapat
 * 2. ID atau alias diawali token — misal "a.8" menemukan "A.8.24"
 * 3. Judul diawali token
 * 4. Judul mengandung token
 * 5. Isi mengandung token
 */
function scoreEntry(entry, tokens) {
  let score = 0;

  for (const token of tokens) {
    let tokenScore = 0;
    const aliases = entry._aliasesLower || [];

    if (entry._idLower === token || aliases.some((a) => a === token)) {
      tokenScore = 120;
    } else if (entry._idLower.startsWith(token) || aliases.some((a) => a.startsWith(token))) {
      tokenScore = 90;
    } else if (entry._titleLower.startsWith(token)) {
      tokenScore = 70;
    } else if (entry._titleLower.includes(token)) {
      tokenScore = 50;
    } else if (entry._idLower.includes(token)) {
      tokenScore = 40;
    } else if (entry._haystack.includes(token)) {
      tokenScore = 20;
    }

    // Semua token harus cocok agar hasil tetap presisi pada kueri panjang.
    if (tokenScore === 0) return 0;
    score += tokenScore;
  }

  // Entri dengan judul pendek cenderung lebih spesifik, beri sedikit dorongan.
  if (entry._titleLower.length > 0 && entry._titleLower.length < 60) score += 5;

  return score;
}

/**
 * Cari entri di dalam index.
 *
 * @param {Array}  index    hasil dari buildIndex()
 * @param {string} query    kata kunci pengguna
 * @param {object} options
 * @param {number} options.limit         jumlah hasil maksimum (default 40)
 * @param {string} options.framework     filter kode framework, 'all' untuk semua
 * @returns {Array} entri terurut berdasarkan relevansi
 */
export function searchIndex(index, query, options = {}) {
  const { limit = 40, framework = 'all' } = options;
  const trimmed = (query || '').trim().toLowerCase();
  if (!trimmed || !Array.isArray(index)) return [];

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];

  const pool = framework === 'all' ? index : index.filter((e) => e.framework === framework);

  const scored = [];
  for (const entry of pool) {
    const score = scoreEntry(entry, tokens);
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry._titleLower.localeCompare(b.entry._titleLower);
  });

  return scored.slice(0, limit).map((s) => ({ ...s.entry, _score: s.score }));
}

/**
 * Hitung jumlah entri per framework, untuk chip filter dan statistik.
 *
 * @param {Array} index
 * @returns {Array<{framework: string, label: string, count: number, icon: string, color: string}>}
 */
export function summarizeIndex(index) {
  if (!Array.isArray(index)) return [];
  const map = new Map();
  for (const entry of index) {
    const existing = map.get(entry.framework);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(entry.framework, {
        framework: entry.framework,
        label: entry.frameworkLabel,
        icon: entry.icon,
        color: entry.color,
        route: entry.route,
        count: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export { SOURCES };
