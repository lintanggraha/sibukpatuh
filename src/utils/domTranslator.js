const textTranslations = new Map([
  ['Sistem Informasi Biar Update Kepatuhan', 'Compliance Update Information System'],
  ['Disclaimer edukatif', 'Educational disclaimer'],
  ['Deskripsi platform', 'Platform description'],
  ['Daftar framework dan regulasi', 'Framework and regulation list'],
  ['Ringkasan Program', 'Program Summary'],
  ['Ringkasan Regulasi', 'Regulation Summary'],
  ['Ringkasan Framework', 'Framework Summary'],
  ['Ringkasan Panduan', 'Guidance Summary'],
  ['Eksplorasi', 'Explorer'],
  ['Lampiran & Laporan', 'Appendices & Reports'],
  ['Lampiran & Referensi', 'Appendices & References'],
  ['Lampiran & Format', 'Appendices & Formats'],
  ['Lampiran & Standar', 'Appendices & Standards'],
  ['Konsep Keamanan', 'Security Concepts'],
  ['Konsep Kepatuhan', 'Compliance Concepts'],
  ['Filter Workspace', 'Filter Workspace'],
  ['Filter Konsep', 'Concept Filters'],
  ['Filter Kewajiban', 'Requirement Filters'],
  ['Filter Tinjauan', 'Review Filters'],
  ['Daftar kontrol', 'Control List'],
  ['Daftar kewajiban', 'Requirement List'],
  ['Daftar requirement', 'Requirement List'],
  ['Daftar tema', 'Theme List'],
  ['Daftar konsep', 'Concept List'],
  ['Daftar subkategori', 'Subcategory List'],
  ['Daftar lampiran', 'Appendix List'],
  ['Kategori', 'Category'],
  ['Jenis kontrol', 'Control Type'],
  ['Prioritas', 'Priority'],
  ['Kesulitan', 'Difficulty'],
  ['Cari kontrol', 'Search controls'],
  ['Cari kewajiban', 'Search requirements'],
  ['Cari requirement', 'Search requirements'],
  ['Cari tema', 'Search themes'],
  ['Cari konsep', 'Search concepts'],
  ['Cari lampiran', 'Search appendices'],
  ['Cari rujukan', 'Search references'],
  ['Cari subkategori', 'Search subcategories'],
  ['Atur ulang filter', 'Reset filters'],
  ['Reset filter', 'Reset filters'],
  ['Semua kategori', 'All categories'],
  ['Semua jenis', 'All types'],
  ['Semua prioritas', 'All priorities'],
  ['Semua tingkat', 'All levels'],
  ['Semua bab', 'All chapters'],
  ['Semua bagian', 'All sections'],
  ['Semua fungsi', 'All functions'],
  ['Semua keluarga', 'All families'],
  ['Semua', 'All'],
  ['Rendah', 'Low'],
  ['Sedang', 'Medium'],
  ['Tinggi', 'High'],
  ['Kritis', 'Critical'],
  ['Kategori pilar keamanan', 'Security Pillar Categories'],
  ['Fokus mitigasi utama', 'Main Mitigation Focus'],
  ['Peringkat Kerentanan', 'Vulnerability Rank'],
  ['Cari spesifik', 'Search specific items'],
  ['Daftar OWASP Top 10', 'OWASP Top 10 List'],
  ['Ringkasan Ancaman', 'Threat Summary'],
  ['Analogi Kehidupan Nyata', 'Real-Life Analogy'],
  ['Fokus Desain & Kode (Mitigasi)', 'Design & Code Focus (Mitigation)'],
  ['Hubungan dengan Standar', 'Relationship with Standards'],
  ['Ringkasan Konteks', 'Context Summary'],
  ['Ringkasan Konseptual', 'Conceptual Summary'],
  ['Analogi Verifikasi', 'Verification Analogy'],
  ['Bukti Evidence Validasi', 'Validation Evidence'],
  ['Bukti Audit', 'Audit Evidence'],
  ['Contoh Bukti Audit', 'Audit Evidence Examples'],
  ['Deskripsi', 'Description'],
  ['Deskripsi Kontrol', 'Control Description'],
  ['Deskripsi standar ISO', 'ISO Standard Description'],
  ['Analogi', 'Analogy'],
  ['Tips implementasi', 'Implementation Tips'],
  ['Fokus Implementasi', 'Implementation Focus'],
  ['Ringkasan Requirement', 'Requirement Summary'],
  ['Ringkasan Konsep', 'Concept Summary'],
  ['Lampiran Terkait', 'Related Appendices'],
  ['Kewajiban Terkait', 'Related Requirements'],
  ['Pelaporan / Output', 'Reporting / Output'],
  ['Keluaran Pelaporan', 'Reporting Output'],
  ['Kontrol terkait', 'Related Controls'],
  ['Pilih lensa', 'Choose a lens'],
  ['Klik untuk buka inspector', 'Click to open inspector'],
  ['Pemeriksaan cepat', 'Quick check'],
  ['Prioritas awal', 'Initial priority'],
  ['Buka Konsep Ini di Explorer', 'Open This Concept in Explorer'],
  ['Tips & Edukasi', 'Tips & Education'],
  ['Detail Lampiran', 'Appendix Detail'],
  ['Detail PBI', 'PBI Detail'],
  ['Detail implementasi', 'Implementation detail'],
  ['Ringkasan', 'Summary'],
  ['Referensi', 'References'],
  ['Kewajiban Inti', 'Core Obligations'],
  ['Total Kewajiban', 'Total Requirements'],
  ['Bab Utama', 'Main Chapters'],
  ['Bab Substantif', 'Substantive Chapters'],
  ['Bab Pedoman', 'Guidance Chapters'],
  ['Bab Regulasi', 'Regulation Chapters'],
  ['Bab Operasional', 'Operational Chapters'],
  ['Lampiran', 'Appendices'],
  ['Lampiran & Format', 'Appendices & Formats'],
  ['Kontrol', 'Controls'],
  ['Subkategori', 'Subcategories'],
  ['Referensi SP 800-53', 'SP 800-53 References'],
  ['Kepadatan Referensi', 'Reference Density'],
  ['Penghapusan', 'Deletion'],
  ['Ketentuan Pidana', 'Criminal Provisions'],
  ['Kewajiban Pengendali Data', 'Data Controller Obligations'],
  ['Bagian Dokumen', 'Document Section'],
  ['Catatan Implementasi', 'Implementation Note'],
  ['Cakupan Panduan', 'Guidance Scope'],
  ['Cakupan subjek pengaturan', 'Regulatory Subject Scope'],
  ['Alur Analisa', 'Analysis Flow'],
  ['Alur Analisis', 'Analysis Flow'],
  ['Pendekatan analisa yang terstruktur dan konsisten', 'Structured and Consistent Analysis Approach'],
  ['Ruang Lingkup', 'Scope'],
  ['Hukum & Sanksi', 'Law & Sanctions'],
  ['Pilar', 'Pillars'],
  ['Klasifikasi', 'Classification'],
  ['Pidana', 'Criminal'],
  ['Implementasi', 'Implementation'],
  ['Fase Implementasi', 'Implementation Phase'],
  ['Fase Persiapan', 'Preparation Phase'],
  ['Desain & Implementasi', 'Design & Implementation'],
  ['Design Factor', 'Design Factor'],
  ['Goals Cascade', 'Goals Cascade'],
  ['Komponen', 'Component'],
  ['Pengujian', 'Testing'],
  ['Kontrol Minimum', 'Minimum Controls'],
  ['Panduan Implementasi', 'Implementation Guidance'],
  ['Fokus pada ketahanan layanan digital', 'Focus on digital service resilience'],
  ['Tenggat yang perlu dijaga', 'Deadlines to Watch'],
  ['Lampiran Ditampilkan', 'Displayed Appendices'],
  ['Jenis Lampiran', 'Appendix Type'],
  ['Jenis Rujukan', 'Reference Type'],
  ['Keluarga Kontrol', 'Control Family'],
  ['Fungsi', 'Function'],
  ['Kategori terpadat', 'Densest Categories'],
  ['Profil kontrol', 'Control Profile'],
  ['Distribusi per kategori', 'Distribution by Category'],
  ['Konsep keamanan', 'Security Concepts'],
  ['Konsep kepatuhan', 'Compliance Concepts'],
  ['Cara pakai halaman ini', 'How to Use This Page'],
  ['Pilih lensa', 'Choose a lens'],
  ['Control Inspector', 'Control Inspector'],
  ['Requirement Inspector', 'Requirement Inspector'],
  ['Inspektor Konsep', 'Concept Inspector'],
  ['Kewajiban Detail', 'Requirement Detail'],
  ['Auto-filterd by concept', 'Auto-filtered by concept'],
]);

const phraseTranslations = [
  [/Tidak ada kontrol yang cocok dengan filter saat ini\./g, 'No controls match the current filters.'],
  [/Tidak ada butir yang cocok dengan filter saat ini\./g, 'No items match the current filters.'],
  [/Tidak ada kewajiban yang cocok dengan filter saat ini\./g, 'No requirements match the current filters.'],
  [/Tidak ada requirement yang cocok dengan filter saat ini\./g, 'No requirements match the current filters.'],
  [/Tidak ada tema yang cocok dengan filter saat ini\./g, 'No themes match the current filters.'],
  [/Tidak ada lampiran yang cocok dengan filter saat ini\./g, 'No appendices match the current filters.'],
  [/Tidak ada rujukan yang cocok dengan filter saat ini\./g, 'No references match the current filters.'],
  [/Tidak ada subkategori yang cocok dengan filter saat ini\./g, 'No subcategories match the current filters.'],
  [/Tidak ada konsep yang cocok dengan filter saat ini\./g, 'No concepts match the current filters.'],
  [/Tidak ada data intelijen yang ditemukan\./g, 'No intelligence data found.'],
  [/Tidak ada data perbandingan untuk topik ini pada framework yang dipilih\./g, 'No comparison data is available for this topic in the selected frameworks.'],
  [/Tidak ada kontrol SP 800-53 yang cocok dengan filter saat ini\./g, 'No SP 800-53 controls match the current filters.'],
  [/Tidak ada ringkasan tersedia\./g, 'No summary available.'],
  [/Tidak ada contoh bukti audit\./g, 'No audit evidence examples.'],
  [/Tidak ada fokus implementasi tambahan\./g, 'No additional implementation focus.'],
  [/Tidak ada evidence cue\./g, 'No evidence cues.'],
  [/Tidak ada artefak yang dipetakan\./g, 'No mapped artifacts.'],
  [/Tidak ada data tambahan/g, 'No additional data'],
  [/Belum ada rujukan format khusus\./g, 'No specific format reference yet.'],
  [/Pilih .* untuk membaca detail\./g, 'Select an item to read details.'],
  [/Pilih .* untuk membaca ringkasan\./g, 'Select an item to read the summary.'],
  [/Pilih .* untuk membaca deskripsi\./g, 'Select an item to read the description.'],
  [/Pilih .* untuk menampilkan kontrol terkait dan inspector detailnya\./g, 'Select an item to show related controls and detail inspector.'],
  [/Klik kontrol di daftar untuk membuka deskripsi, interpretasi, bukti audit, dan tips implementasi\./g, 'Click a control in the list to open the description, interpretation, audit evidence, and implementation tips.'],
  [/Klik butir di daftar untuk membuka deskripsi, interpretasi, bukti audit, dan tips implementasi\./g, 'Click an item in the list to open the description, interpretation, audit evidence, and implementation tips.'],
  [/Klik kontrol dari konsep yang dipilih untuk membaca detail lengkap\./g, 'Click a control from the selected concept to read full details.'],
  [/Klik butir dari konsep yang dipilih untuk membaca detail lengkap\./g, 'Click an item from the selected concept to read full details.'],
  [/Requirement ini tidak menunjuk lampiran spesifik\./g, 'This requirement does not point to a specific appendix.'],
  [/Kewajiban ini tidak menunjuk lampiran spesifik\./g, 'This requirement does not point to a specific appendix.'],
  [/Tema ini tidak menunjuk lampiran spesifik\./g, 'This theme does not point to a specific appendix.'],
  [/Konsep ini tidak memakai lampiran spesifik di halaman ringkasan\./g, 'This concept does not use a specific appendix on the summary page.'],
  [/Kontrol inti yang bisa ditelusuri end-to-end\./g, 'Core controls that can be traced end-to-end.'],
  [/Contoh bukti audit yang bisa jadi titik mulai\./g, 'Audit evidence examples that can be used as a starting point.'],
  [/Subkategori yang dapat dianalisa per fungsi dan kategori\./g, 'Subcategories that can be analyzed by function and category.'],
  [/Referensi lintas kontrol untuk pendalaman implementasi\./g, 'Cross-control references for deeper implementation.'],
  [/Rata-rata tautan SP 800-53 per subkategori\./g, 'Average SP 800-53 links per subcategory.'],
  [/Keluarga SP 800-53 yang muncul di seluruh subkategori\./g, 'SP 800-53 families appearing across all subcategories.'],
  [/Tata kelola TI sampai audit intern TI\./g, 'IT governance through internal IT audit.'],
  [/Lampiran I-IV dan format regulator yang relevan\./g, 'Appendices I-IV and relevant regulator formats.'],
  [/Pasal-pasal yang dapat ditinjau satu per satu dalam eksplorasi\./g, 'Articles that can be reviewed one by one in the explorer.'],
  [/Definisi, parameter, dan kerangka implementasi penting\./g, 'Definitions, parameters, and key implementation frameworks.'],
  [/Tersedia di tab Lampiran/g, 'Available in the Appendices tab'],
  [/Pemetaan konsep keamanan disajikan sebagai board terpisah agar dapat digunakan sebagai perspektif analisis tambahan tanpa mengganggu pembacaan struktur utama Annex A\./g, 'Security concept mapping is presented as a separate board so it can be used as an additional analysis perspective without disrupting the main Annex A structure.'],
  [/Pemetaan konsep kepatuhan disajikan sebagai lensa tambahan agar organisasi bisa melihat keseimbangan antara tata kelola, pencegahan, deteksi, respons, dan perbaikan\./g, 'Compliance concept mapping is presented as an additional lens so organizations can see the balance between governance, prevention, detection, response, and improvement.'],
  [/Gunakan Konsep Keamanan untuk melihat keterkaitan kontrol dengan kapabilitas keamanan siber\./g, 'Use Security Concepts to see how controls relate to cybersecurity capabilities.'],
  [/Gunakan Konsep Kepatuhan untuk melihat apakah program sudah kuat di govern, prevent, detect, respond, dan improve\./g, 'Use Compliance Concepts to see whether the program is strong across govern, prevent, detect, respond, and improve.'],
  [/Klik kategori untuk filter/g, 'Click a category to filter'],
  [/Ringkasan tipe dan prioritas/g, 'Type and priority summary'],
  [/Pulse, distribusi kategori, dan profil prioritas\./g, 'Pulse, category distribution, and priority profile.'],
  [/Distribusi fungsi dan kategori terpadat\./g, 'Function distribution and densest categories.'],
  [/Telusuri kontrol SP 800-53 yang terkait\./g, 'Browse related SP 800-53 controls.'],
  [/Enam konsep keamanan sebagai perspektif pembacaan alternatif\./g, 'Six security concepts as an alternative reading perspective.'],
  [/Lima lensa untuk membaca kekuatan program anti-penyuapan\./g, 'Five lenses for reading anti-bribery program strength.'],
  [/Peta pilar, bab regulasi, dan elemen kewajiban inti\./g, 'Pillar map, regulation chapters, and core obligation elements.'],
  [/Board referensi lampiran, definisi, dan format\./g, 'Appendix, definition, and format reference board.'],
  [/Pilar, bab pedoman, dan tenggat utama PADK\./g, 'Pillars, guidance chapters, and main PADK deadlines.'],
  [/Board format laporan, notifikasi, izin, dan realisasi\./g, 'Report, notification, approval, and realization format board.'],
  [/Pilih sebuah kontrol/g, 'Select a control'],
  [/Pilih sebuah butir/g, 'Select an item'],
  [/Cari ID, nama, atau capability/g, 'Search by ID, name, or capability'],
  [/Cari ID, judul, grup, ringkasan, atau fokus/g, 'Search by ID, title, group, summary, or focus'],
  [/Cari ID, judul, ringkasan, atau fokus implementasi/g, 'Search by ID, title, summary, or implementation focus'],
  [/Cari ID, judul, atau fokus implementasi/g, 'Search by ID, title, or implementation focus'],
  [/Cari ID, judul, ringkasan, fokus, atau format/g, 'Search by ID, title, summary, focus, or format'],
  [/Cari ID, format, judul, atau ruang lingkup/g, 'Search by ID, format, title, or scope'],
  [/Cari ID, pasal, judul, ringkasan, fokus, atau bukti/g, 'Search by ID, article, title, summary, focus, or evidence'],
  [/Cari ID, pasal, judul, ringkasan, atau deliverable/g, 'Search by ID, article, title, summary, or deliverable'],
  [/Cari ID, judul, ringkasan, atau lampiran/g, 'Search by ID, title, summary, or appendix'],
  [/entri/g, 'entries'],
  [/kontrol/g, 'controls'],
  [/lampiran/g, 'appendices'],
  [/kewajiban/g, 'requirements'],
  [/rujukan/g, 'references'],
  [/subkategori/g, 'subcategories'],
  [/pilar/g, 'pillars'],
  [/bab/g, 'chapters'],
  [/Bab/g, 'Chapter'],
  [/Pasal/g, 'Article'],
];

const originalText = new WeakMap();
const translatedNodes = new WeakSet();

function translateString(value) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  if (textTranslations.has(trimmed)) {
    return value.replace(trimmed, textTranslations.get(trimmed));
  }
  return phraseTranslations.reduce((output, [pattern, replacement]) => output.replace(pattern, replacement), value);
}

function walkTextNodes(root, callback) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(callback);
}

export function applyDomTranslations(lang, root = document.body) {
  if (!root) return;

  walkTextNodes(root, (node) => {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    if (lang === 'en') {
      const next = translateString(originalText.get(node));
      if (next !== node.nodeValue) {
        node.nodeValue = next;
        translatedNodes.add(node);
      }
    } else if (translatedNodes.has(node)) {
      node.nodeValue = originalText.get(node);
    }
  });

  root.querySelectorAll('[placeholder], [aria-label], [title]').forEach((el) => {
    ['placeholder', 'aria-label', 'title'].forEach((attr) => {
      if (!el.hasAttribute(attr)) return;
      const key = `data-original-${attr}`;
      if (!el.hasAttribute(key)) el.setAttribute(key, el.getAttribute(attr));
      const original = el.getAttribute(key);
      el.setAttribute(attr, lang === 'en' ? translateString(original) : original);
    });
  });
}
