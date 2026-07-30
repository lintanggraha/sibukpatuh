const exactTranslations = new Map([
  ['Tahunan pada posisi akhir Desember', 'Annually at the end-of-December position'],
  ['Digunakan pada setiap siklus penilaian inheren', 'Used in every inherent assessment cycle'],
  ['Berjalan terus-menerus dan ditinjau berkala', 'Runs continuously and is reviewed periodically'],
  ['Setiap pembacaan dan implementasi PADK', 'For every PADK reading and implementation'],
  ['Transisi setelah PADK berlaku', 'Transition after PADK takes effect'],
  ['Setiap siklus LKTPTI', 'Every LKTPTI cycle'],
  ['Menjadi dasar pemetaan kewajiban PADK di seluruh artefak kepatuhan TI.', 'Becomes the basis for mapping PADK requirements across all IT compliance artifacts.'],
  ['Siapkan bukti penyesuaian kontrak saat review vendor atau pemeriksaan.', 'Prepare evidence of contract adjustment during vendor review or examination.'],
  ['LKTPTI disampaikan pada setiap 21 Januari tahun berikutnya.', 'LKTPTI is submitted every January 21 of the following year.'],
  ['Mulai dari workshop lintas fungsi untuk memetakan area yang paling banyak berhubungan dengan uang, izin, pengadaan, hadiah, sponsor, atau perantara. Perbarui konteks saat ada produk, negara, vendor, atau channel baru.', 'Start with a cross-functional workshop to map areas most exposed to money, approvals, procurement, gifts, sponsorships, or intermediaries. Update the context when new products, countries, vendors, or channels are introduced.'],
  ['Buat register sederhana: siapa stakeholder-nya, apa tuntutannya, bukti apa yang biasa diminta, siapa pemilik internalnya, dan seberapa sering perlu ditinjau.', 'Create a simple register: who the stakeholder is, what they require, what evidence is usually requested, who owns it internally, and how often it should be reviewed.'],
  ['Tulis scope dalam bahasa yang bisa diuji auditor. Hindari kalimat terlalu umum; sebutkan batas organisasi, proses kritis, dan pihak ketiga yang relevan.', 'Write the scope in language an auditor can test. Avoid overly generic wording; state organizational boundaries, critical processes, and relevant third parties.'],
  ['Risk management, unit siber, dan Direksi', 'Risk management, cyber unit, and Board of Directors'],
  ['Risk management dan unit siber', 'Risk management and cyber unit'],
  ['Direksi dan Dewan Komisaris', 'Board of Directors and Board of Commissioners'],
  ['Peringkat 1-5 (Low sampai High)', 'Rating 1-5 (Low to High)'],
  ['Parameter minimum dapat ditambah sesuai kompleksitas Bank', 'Minimum parameters may be expanded according to the Bank complexity'],
  ['Kualitas penerapan dinilai dalam penilaian maturitas', 'Implementation quality is assessed in the maturity assessment'],
  ['Dokumen analisis konteks organisasi', 'Organizational context analysis document'],
  ['Peta proses bisnis dan pihak berkepentingan', 'Business process and interested-party map'],
  ['Daftar area operasi atau transaksi berisiko', 'List of risky operating areas or transactions'],
  ['Register pemangku kepentingan', 'Interested-party register'],
  ['Matriks kebutuhan dan kewajiban compliance', 'Matrix of compliance needs and obligations'],
  ['Notulen evaluasi ekspektasi regulator atau pelanggan', 'Minutes evaluating regulator or customer expectations'],
  ['Pernyataan lingkup ABMS', 'ABMS scope statement'],
  ['Daftar unit/proses/lokasi dalam scope', 'List of units, processes, or locations in scope'],
  ['Justifikasi pengecualian jika ada', 'Justification for exclusions, if any'],
  ['Pemahaman konteks organisasi', 'Understanding organizational context'],
  ['Kebutuhan Stakeholder', 'Stakeholder Needs'],
  ['Lingkup Sistem', 'System Scope'],
  ['Analisis Konteks', 'Context Analysis'],
  ['Konteks organisasi, scope, dan penilaian risiko penyuapan.', 'Organizational context, scope, and bribery risk assessment.'],
  ['Komitmen pimpinan, kebijakan, peran, dan fungsi kepatuhan.', 'Leadership commitment, policy, roles, and compliance function.'],
  ['Resource, kompetensi, training, komunikasi, dan dokumen.', 'Resources, competence, training, communication, and documents.'],
  ['Due diligence, kontrol transaksi, pihak ketiga, pelaporan, dan investigasi.', 'Due diligence, transaction controls, third parties, reporting, and investigations.'],
  ['Monitoring, audit internal, tinjauan, CAPA, dan continual improvement.', 'Monitoring, internal audit, review, CAPA, and continual improvement.'],
  ['Identifikasi, pelindungan, deteksi, penanggulangan, dan pemulihan.', 'Identification, protection, detection, response, and recovery.'],
  ['Memperbaiki kelemahan, menutup akar masalah, dan menjaga sistem tetap relevan.', 'Fix weaknesses, close root causes, and keep the system relevant.'],
]);

const replacements = [
  [/\bMulai dari\b/g, 'Start with'],
  [/\bBuat\b/g, 'Create'],
  [/\bTulis\b/g, 'Write'],
  [/\bHindari\b/g, 'Avoid'],
  [/\bPerbarui\b/g, 'Update'],
  [/\bSiapkan\b/g, 'Prepare'],
  [/\bPastikan\b/g, 'Ensure'],
  [/\bGunakan\b/g, 'Use'],
  [/\bTetapkan\b/g, 'Define'],
  [/\bDokumentasikan\b/g, 'Document'],
  [/\bSimpan\b/g, 'Store'],
  [/\bUji\b/g, 'Test'],
  [/\bKaji\b/g, 'Review'],
  [/\bInventarisasi\b/g, 'Inventory'],
  [/\bBandingkan\b/g, 'Compare'],
  [/\bSelaraskan\b/g, 'Align'],
  [/\bMasukkan\b/g, 'Enter'],
  [/\bLaporkan\b/g, 'Report'],
  [/\blintas fungsi\b/g, 'cross-functional'],
  [/\bmemetakan\b/g, 'map'],
  [/\bpemetaan\b/g, 'mapping'],
  [/\bpaling banyak\b/g, 'most'],
  [/\bberhubungan dengan\b/g, 'related to'],
  [/\buang\b/g, 'money'],
  [/\bpengadaan\b/g, 'procurement'],
  [/\bhadiah\b/g, 'gifts'],
  [/\bsponsor\b/g, 'sponsorships'],
  [/\bperantara\b/g, 'intermediaries'],
  [/\bsaat ada\b/g, 'when there are'],
  [/\bproduk\b/g, 'products'],
  [/\bnegara\b/g, 'countries'],
  [/\bchannel baru\b/g, 'new channels'],
  [/\bdi seluruh\b/g, 'across all'],
  [/\bartefak kepatuhan TI\b/g, 'IT compliance artifacts'],
  [/\bpenyesuaian kontrak\b/g, 'contract adjustment'],
  [/\bpemeriksaan\b/g, 'examination'],
  [/\bkontrak aktif\b/g, 'active contracts'],
  [/\bdaftar aktif\b/g, 'active list'],
  [/\bsiapa\b/g, 'who'],
  [/\bapa\b/g, 'what'],
  [/\btuntutannya\b/g, 'their requirements'],
  [/\bpemilik internalnya\b/g, 'the internal owner'],
  [/\bseberapa sering\b/g, 'how often'],
  [/\bbahasa\b/g, 'language'],
  [/\bbisa diuji auditor\b/g, 'auditors can test'],
  [/\bkalimat terlalu umum\b/g, 'overly generic wording'],
  [/\bbatas organisasi\b/g, 'organizational boundaries'],
  [/\bproses kritis\b/g, 'critical processes'],
  [/\bTahunan\b/g, 'Annual'],
  [/\bBulanan\b/g, 'Monthly'],
  [/\bBerkala\b/g, 'Periodic'],
  [/\bSetiap\b/g, 'Every'],
  [/\bDireksi\b/g, 'Board of Directors'],
  [/\bDewan Komisaris\b/g, 'Board of Commissioners'],
  [/\bunit siber\b/gi, 'cyber unit'],
  [/\bmanajemen risiko\b/gi, 'risk management'],
  [/\bHari kerja\b/g, 'Working days'],
  [/\bhari kerja\b/g, 'working days'],
  [/\bDisampaikan\b/g, 'Submitted'],
  [/\bdisampaikan\b/g, 'submitted'],
  [/\bHasilnya menjadi input utama\b/g, 'The result becomes the main input'],
  [/\bMenjadi dasar\b/g, 'Becomes the basis'],
  [/\bSiapkan bukti\b/g, 'Prepare evidence'],
  [/\bpaling lama\b/g, 'no later than'],
  [/\bsetelah akhir tahun pelaporan\b/g, 'after the reporting year-end'],
  [/\bpada setiap siklus\b/g, 'in every cycle'],
  [/\btahun berikutnya\b/g, 'the following year'],
  [/\bPasal\b/g, 'Article'],
  [/\bBab\b/g, 'Chapter'],
  [/\bLampiran\b/g, 'Appendix'],
  [/\blampiran\b/g, 'appendix'],
  [/\brujukan\b/g, 'reference'],
  [/\bkewajiban\b/g, 'requirement'],
  [/\bkontrol\b/g, 'controls'],
  [/\bpengendalian\b/g, 'controls'],
  [/\bkebijakan\b/g, 'policy'],
  [/\bprosedur\b/g, 'procedure'],
  [/\bdokumen\b/g, 'document'],
  [/\bbukti\b/g, 'evidence'],
  [/\baudit internal\b/g, 'internal audit'],
  [/\btata kelola\b/g, 'governance'],
  [/\brisiko\b/g, 'risk'],
  [/\bkeamanan siber\b/g, 'cybersecurity'],
  [/\bkeamanan informasi\b/g, 'information security'],
  [/\bpelindungan data pribadi\b/g, 'personal data protection'],
  [/\bdata pribadi\b/g, 'personal data'],
  [/\bpemangku kepentingan\b/g, 'stakeholders'],
  [/\bpihak berkepentingan\b/g, 'interested parties'],
  [/\bpihak ketiga\b/g, 'third parties'],
  [/\bpengelolaan\b/g, 'management'],
  [/\bpemrosesan\b/g, 'processing'],
  [/\bpelaporan\b/g, 'reporting'],
  [/\bizin\b/g, 'approval'],
  [/\bperizinan\b/g, 'licensing'],
  [/\bkontrak\b/g, 'contract'],
  [/\bvendor\b/g, 'vendor'],
  [/\bBank\b/g, 'Bank'],
  [/\bbank\b/g, 'bank'],
  [/\bdan\b/g, 'and'],
  [/\batau\b/g, 'or'],
  [/\bdengan\b/g, 'with'],
  [/\byang\b/g, 'that'],
  [/\bsesuai\b/g, 'according to'],
  [/\bterkait\b/g, 'related'],
  [/\butama\b/g, 'main'],
  [/\bminimum\b/g, 'minimum'],
  [/\bresmi\b/g, 'official'],
  [/\brelevan\b/g, 'relevant'],
  [/\bdiperlukan\b/g, 'required'],
  [/\bditinjau\b/g, 'reviewed'],
  [/\bdievaluasi\b/g, 'evaluated'],
  [/\bditetapkan\b/g, 'established'],
  [/\bdilakukan\b/g, 'performed'],
  [/\bdikelola\b/g, 'managed'],
  [/\bdigunakan\b/g, 'used'],
  [/\bdiminta\b/g, 'requested'],
  [/\bdapat\b/g, 'can'],
  [/\bharus\b/g, 'must'],
  [/\bperlu\b/g, 'needs to'],
  [/\bmemastikan\b/g, 'ensure'],
  [/\bmenetapkan\b/g, 'establish'],
  [/\bmenggunakan\b/g, 'use'],
  [/\bmelalui\b/g, 'through'],
  [/\bsebagai\b/g, 'as'],
  [/\bdalam\b/g, 'in'],
  [/\buntuk\b/g, 'to'],
  [/\bdari\b/g, 'from'],
  [/\bke\b/g, 'to'],
];

const structuralKeys = new Set([
  'id',
  '_key',
  'key',
  'route',
  'routeName',
  'icon',
  'color',
  'url',
  'href',
  'ref',
  'sp80053',
  'appendices',
  'used_by',
  'chapter',
  'pillar',
  'domain',
  'type',
  'priority',
  'difficulty',
  'concept',
  'function',
  'category',
]);

export function translateRegulationText(value) {
  if (typeof value !== 'string' || !value.trim()) return value;
  const exact = exactTranslations.get(value.trim());
  if (exact) return value.replace(value.trim(), exact);
  return replacements.reduce((output, [pattern, replacement]) => output.replace(pattern, replacement), value);
}

export function translateRegulationData(value, key = '') {
  if (Array.isArray(value)) {
    if (structuralKeys.has(key)) return value;
    return value.map((item) => translateRegulationData(item, key));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [entryKey, translateRegulationData(entryValue, entryKey)])
    );
  }
  if (typeof value === 'string') {
    return structuralKeys.has(key) ? value : translateRegulationText(value);
  }
  return value;
}

export function installRegulationDataFetchTranslator() {
  if (window.__sibukPatuhDataTranslatorInstalled) return;
  window.__sibukPatuhDataTranslatorInstalled = true;

  const originalFetch = window.fetch.bind(window);
  window.fetch = async function translatedFetch(resource, config) {
    const isStringResource = typeof resource === 'string';
    let nextResource = resource;
    let isDataRequest = false;

    if (isStringResource && resource.includes('/data/') && resource.includes('.json')) {
      isDataRequest = true;
      const [path, query] = resource.split('?');
      const lang = localStorage.getItem('language') || 'id';
      if (lang === 'en' && !path.endsWith('_en.json')) {
        const enPath = path.replace('.json', '_en.json');
        nextResource = query ? `${enPath}?${query}` : enPath;
      }
    }

    let response = await originalFetch(nextResource, config);

    if (
      isDataRequest &&
      !response.ok &&
      isStringResource &&
      nextResource !== resource
    ) {
      response = await originalFetch(resource, config);
    }

    if (!isDataRequest) return response;

    return new Proxy(response, {
      get(target, prop) {
        if (prop === 'json') {
          return async () => {
            const data = await target.clone().json();
            return localStorage.getItem('language') === 'en' ? translateRegulationData(data) : data;
          };
        }
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
    });
  };
}
