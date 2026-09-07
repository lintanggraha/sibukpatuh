import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const dataDir = path.join(root, 'public', 'data');

const profiles = [
  {
    key: 'tikmi',
    match: text => /tikmi|teknologi,? informasi|keamanan siber|kerahasiaan,? integritas|nirpenyangkalan|ketersediaan/i.test(text),
    domain: 'TIKMI & ketahanan teknologi',
    focus: 'Bangun jejak pengendalian teknologi, informasi, dan keamanan siber yang dapat ditelusuri dari risiko sampai hasil pengujian.',
    steps: [
      'Tetapkan pemilik kontrol dan scope sistem/layanan yang tercakup, lalu hubungkan dengan inventaris aset dan layanan penting.',
      'Dokumentasikan kebijakan, prosedur, konfigurasi, dan mekanisme monitoring yang menjadi dasar pemenuhan ketentuan.',
      'Lakukan pengujian berkala, catat temuan dan rencana perbaikannya, kemudian siapkan paket self-assessment atau bahan pemeriksaan.'
    ],
    evidence: [
      'Inventaris aset, layanan penting, data, dan dependency teknologi yang telah disetujui.',
      'Kebijakan/SOP manajemen risiko TI dan keamanan siber beserta bukti sosialisasi atau persetujuan.',
      'Laporan vulnerability assessment/penetration test, monitoring, atau uji kontrol yang relevan.',
      'Register temuan, action plan, bukti penyelesaian, dan hasil retest.'
    ],
    test: [
      'Periksa sampling aset atau layanan kritis: apakah owner, klasifikasi, kontrol, dan tanggal review tercatat?',
      'Telusuri satu temuan dari laporan pengujian sampai bukti remediation dan retest.'
    ],
    owner: 'CISO/IT Risk dengan dukungan pemilik layanan',
    cadence: 'Minimal tahunan dan setiap ada perubahan material; ikuti periode self-assessment yang ditetapkan BI'
  },
  {
    key: 'reporting',
    match: text => /sbp|rbsp|penyampaian|laporan|pelaporan|self-assessment|tanggal 30 november|30 april 2026|15 \(lima belas\) hari kerja/i.test(text),
    domain: 'Pelaporan & perencanaan',
    focus: 'Pastikan kewajiban pelaporan tidak hanya memiliki dokumen, tetapi juga kalender, maker-checker, jejak penyampaian, dan bukti tindak lanjut.',
    steps: [
      'Buat regulatory obligation register yang memuat format, periode, sumber data, approver, media penyampaian, dan batas waktu.',
      'Tetapkan proses maker-checker dan lakukan rekonsiliasi data sebelum laporan dikirim atau disampaikan kepada BI.',
      'Arsipkan versi final, bukti submission/receipt, korespondensi, dan tindak lanjut atas permintaan penyesuaian atau penjelasan.'
    ],
    evidence: [
      'Regulatory calendar dan RACI pelaporan yang mencantumkan due date serta backup owner.',
      'Template/formulir laporan, data lineage, rekonsiliasi, dan checklist review sebelum submission.',
      'Bukti penyampaian elektronik, tanda terima, nomor referensi, atau korespondensi dengan BI.',
      'Log keterlambatan/exception dan bukti eskalasi serta corrective action bila terjadi deviasi.'
    ],
    test: [
      'Ambil satu periode pelaporan dan cocokkan angka final dengan sumber data serta approval trail.',
      'Verifikasi timestamp submission terhadap kalender dan bukti penerimaan regulator.'
    ],
    owner: 'Regulatory Reporting/Compliance',
    cadence: 'Sesuai periode atau batas waktu pada pasal; monitor minimal bulanan'
  },
  {
    key: 'authorization',
    match: text => /izin|persetujuan|penetapan|pengembangan aktivitas|pengembangan produk/i.test(text),
    domain: 'Perizinan & persetujuan',
    focus: 'Jangan menjalankan aktivitas, produk, atau perubahan material sebelum status izin/persetujuan dan prasyaratnya terdokumentasi.',
    steps: [
      'Petakan aktivitas/produk terhadap klasifikasi layanan dan tentukan apakah memerlukan izin, penetapan, atau persetujuan BI.',
      'Siapkan application pack: business case, risk assessment, SOP, kesiapan teknologi, perlindungan konsumen, dan dokumen pendukung lain.',
      'Kunci go-live gate pada bukti persetujuan yang sah; simpan seluruh korespondensi, kondisi persetujuan, dan expiry/review date.'
    ],
    evidence: [
      'Regulatory applicability assessment dan decision memo yang ditandatangani Compliance/Legal.',
      'Register izin/persetujuan dengan nomor, ruang lingkup, tanggal berlaku, kondisi, dan owner.',
      'Dokumen pengajuan, checklist kelengkapan, korespondensi, dan bukti persetujuan BI.',
      'Go-live approval, change record, dan bukti bahwa aktivitas tidak berjalan di luar scope persetujuan.'
    ],
    test: [
      'Cocokkan sampel aktivitas/produk aktif dengan izin atau persetujuan yang scope-nya masih berlaku.',
      'Periksa apakah setiap condition atau commitment regulator memiliki owner dan bukti pemenuhan.'
    ],
    owner: 'Legal/Compliance dengan Product Owner',
    cadence: 'Sebelum aktivitas/produk diluncurkan dan setiap ada perubahan material'
  },
  {
    key: 'third_party',
    match: text => /kerja sama|pihak ketiga|penyelenggara penunjang|outsourc|afiliasi|mitra/i.test(text),
    domain: 'Kerja sama & pihak ketiga',
    focus: 'Kelola kerja sama sebagai risiko end-to-end: due diligence, klausul kontrak, monitoring, exit plan, dan bukti pengawasan.',
    steps: [
      'Lakukan due diligence terhadap legal standing, keamanan, ketahanan layanan, subkontraktor, dan kemampuan memenuhi kewajiban regulasi.',
      'Masukkan SLA, audit right, incident notification, data protection, business continuity, serta termination/exit assistance ke kontrak.',
      'Pantau kinerja dan risiko pihak ketiga secara berkala; eskalasi breach, konsentrasi, atau perubahan material ke forum yang berwenang.'
    ],
    evidence: [
      'Third-party risk assessment, due diligence pack, dan persetujuan onboarding.',
      'Kontrak/SLA dan addendum yang memuat hak audit, keamanan informasi, insiden, dan exit.',
      'Laporan SLA, service review, assurance report, atau hasil assessment pihak ketiga.',
      'Exit plan, hasil uji pemulihan, dan register isu atau breach pihak ketiga.'
    ],
    test: [
      'Telusuri satu vendor kritis dari due diligence sampai service review terakhir.',
      'Verifikasi klausul kontrak wajib dan keberadaan exit plan yang realistis.'
    ],
    owner: 'Third-Party Risk/Procurement dengan pemilik layanan',
    cadence: 'Saat onboarding, review tahunan, dan setiap perubahan material atau insiden'
  },
  {
    key: 'consumer',
    match: text => /konsumen|pengaduan|pengguna|transparansi|perlindungan/i.test(text),
    domain: 'Perlindungan konsumen',
    focus: 'Terjemahkan kewajiban perlindungan konsumen ke proses yang terlihat: informasi, consent, kanal pengaduan, SLA, dan root-cause remediation.',
    steps: [
      'Identifikasi titik kontak konsumen dan informasi yang wajib disampaikan sebelum, saat, dan setelah transaksi.',
      'Tetapkan SOP pengaduan, klasifikasi severity, SLA, eskalasi, komunikasi, dan rekonsiliasi penyelesaian.',
      'Analisis tren pengaduan dan kejadian kerugian untuk memperbaiki produk, proses, dan kontrol preventif.'
    ],
    evidence: [
      'Kebijakan perlindungan konsumen, disclosure, terms, dan materi komunikasi yang berlaku.',
      'Log pengaduan lengkap dengan timestamp, kategori, SLA, penyelesaian, dan komunikasi kepada konsumen.',
      'Rekaman monitoring kualitas layanan atau sampling transaksi dan hasil quality assurance.',
      'Analisis akar masalah, corrective action, dan bukti penutupan keluhan.'
    ],
    test: [
      'Sampling pengaduan: cocokkan waktu masuk, klasifikasi, SLA, keputusan, dan bukti komunikasi.',
      'Periksa apakah isu berulang menghasilkan perubahan kontrol atau produk.'
    ],
    owner: 'Customer Protection/Operations',
    cadence: 'Monitoring harian; analisis tren dan pelaporan minimal bulanan'
  },
  {
    key: 'innovation',
    match: text => /inovasi|sandbox|uji coba|teknologi baru/i.test(text),
    domain: 'Inovasi & perubahan',
    focus: 'Pastikan inovasi berjalan melalui gate yang proporsional: risk assessment, batas uji, monitoring, hasil uji, dan keputusan exit atau scale-up.',
    steps: [
      'Definisikan use case, peserta, skenario, batas nominal/pengguna/wilayah, periode uji, dan kriteria keberhasilan.',
      'Nilai risiko teknologi, keamanan informasi, APU/PPT, perlindungan konsumen, operasional, dan kontinuitas sebelum uji dimulai.',
      'Dokumentasikan hasil uji, insiden, perubahan scope, keputusan BI, serta rekomendasi lanjut, perbaikan, atau penghentian.'
    ],
    evidence: [
      'Innovation proposal, profile peserta, risk assessment, dan approval gate.',
      'Test plan, scenario, scope limit, monitoring dashboard, dan incident log selama uji.',
      'Laporan hasil uji dengan data aktual, deviasi, keluhan, dan hasil pengujian kontrol.',
      'Decision record untuk scale-up, remediation, extension, atau termination.'
    ],
    test: [
      'Bandingkan transaksi atau peserta aktual dengan batas scope yang disetujui.',
      'Verifikasi setiap insiden atau deviasi memiliki disposition dan keputusan terdokumentasi.'
    ],
    owner: 'Product/Innovation Risk dengan Compliance dan Technology',
    cadence: 'Per fase uji dan setiap perubahan scope; review sebelum scale-up'
  },
  {
    key: 'governance',
    match: () => true,
    domain: 'Tata kelola & operasional',
    focus: 'Ubah ketentuan menjadi kontrol yang memiliki owner, prosedur, titik persetujuan, rekaman pelaksanaan, dan review berkala.',
    steps: [
      'Tentukan applicability, pemilik kewajiban, proses terdampak, dan keputusan yang perlu disetujui pejabat berwenang.',
      'Terjemahkan kewajiban ke kebijakan/SOP, kontrol operasional, checklist, dan indikator pemantauan yang dapat dijalankan.',
      'Kumpulkan bukti pelaksanaan secara konsisten dan lakukan review untuk memastikan kontrol tetap relevan saat proses berubah.'
    ],
    evidence: [
      'Regulatory obligation register, mapping proses, dan RACI yang telah disetujui.',
      'Kebijakan/SOP/work instruction dan bukti persetujuan, sosialisasi, atau pelatihan.',
      'Log pelaksanaan kontrol, checklist, notulen forum, atau laporan monitoring yang relevan.',
      'Review efektivitas kontrol, temuan audit, corrective action, dan bukti penutupan.'
    ],
    test: [
      'Periksa apakah kewajiban memiliki owner, SOP aktif, dan bukti pelaksanaan pada periode yang diuji.',
      'Uji satu sampel evidence untuk keaslian, kelengkapan, tanggal, approver, dan keterkaitannya dengan kewajiban.'
    ],
    owner: 'Compliance dengan process owner terkait',
    cadence: 'Review minimal tahunan dan ketika ada perubahan regulasi, proses, atau sistem'
  }
];

const dateRules = [
  [/30 April 2026/i, '30 April 2026 — penyampaian pertama SBP/RBSP sebagaimana dirujuk pada data pasal terkait'],
  [/April 30,? 2026/i, 'April 30, 2026 — first SBP/RBSP submission as referenced in the relevant provision'],
  [/30 November/i, '30 November setiap tahun — batas penyampaian SBP/RBSP, subject to the applicable holiday rule'],
  [/November 30/i, 'November 30 each year — SBP/RBSP submission deadline, subject to the applicable holiday rule'],
  [/1 April 2027/i, '1 April 2027 — milestone awal penetapan hasil penilaian TIKMI oleh BI'],
  [/April 1,? 2027/i, 'April 1, 2027 — initial milestone for BI determination of TIKMI assessment results'],
  [/15 \(lima belas\) hari kerja/i, '15 hari kerja — threshold keterlambatan/tidak menyampaikan pada ketentuan terkait'],
  [/15 working days/i, '15 working days — late/non-submission threshold in the relevant provision'],
  [/31 Maret 2026/i, '31 Maret 2026 — tanggal mulai berlaku PADG 32/2025'],
  [/March 31,? 2026/i, 'March 31, 2026 — PADG 32/2025 effective date'],
  [/6 \(enam\) bulan/i, '6 bulan — periode yang disebut dalam ketentuan terkait; verifikasi konteks pasal dan petunjuk teknis'],
  [/6 months/i, '6 months — period referenced in the relevant provision; verify the article and technical guidance context']
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function enrichRequirement(requirement, locale) {
  const text = [requirement.title, requirement.summary, requirement.reporting].filter(Boolean).join(' ');
  const profile = profiles.find(item => item.match(text)) || profiles.at(-1);
  const english = locale === 'en';
  const dates = dateRules.filter(([regex]) => regex.test(text)).map(([, value]) => value);
  const originalFocus = requirement.focus?.length ? requirement.focus : [];
  const originalEvidence = requirement.evidence?.length ? requirement.evidence : [];

  if (!english) {
    return {
      ...requirement,
      implementation_domain: profile.domain,
      implementation_focus: profile.focus,
      implementation_steps: profile.steps,
      focus: originalFocus.length ? originalFocus : profile.steps,
      evidence: originalEvidence.length ? originalEvidence : profile.evidence,
      evidence_owner: profile.owner,
      evidence_cadence: profile.cadence,
      control_test: profile.test,
      key_dates: dates,
      evidence_status: 'Belum dinilai',
      evidence_disclaimer: 'Contoh evidence dan langkah implementasi bersifat panduan internal; bukan bukti bahwa organisasi telah comply dan bukan pengganti pembacaan PADG/Juknis BI.'
    };
  }

  const translations = {
    'TIKMI & ketahanan teknologi': 'TIKMI & technology resilience',
    'Pelaporan & perencanaan': 'Reporting & planning',
    'Perizinan & persetujuan': 'Licensing & approvals',
    'Kerja sama & pihak ketiga': 'Partnerships & third parties',
    'Perlindungan konsumen': 'Consumer protection',
    'Inovasi & perubahan': 'Innovation & change',
    'Tata kelola & operasional': 'Governance & operations'
  };
  const focus = {
    'TIKMI & ketahanan teknologi': 'Build a traceable technology, information, and cybersecurity control trail from risk through testing results.',
    'Pelaporan & perencanaan': 'Make regulatory reporting auditable through a calendar, maker-checker review, submission trail, and follow-up evidence.',
    'Perizinan & persetujuan': 'Do not operate an activity, product, or material change before its authorization status and prerequisites are documented.',
    'Kerja sama & pihak ketiga': 'Manage partnerships end-to-end through due diligence, contract controls, monitoring, and a workable exit plan.',
    'Perlindungan konsumen': 'Translate consumer obligations into visible information, complaint handling, SLA, and root-cause remediation controls.',
    'Inovasi & perubahan': 'Gate innovation proportionately with risk assessment, test boundaries, monitoring, results, and an exit or scale-up decision.',
    'Tata kelola & operasional': 'Translate each requirement into an owned control with a procedure, approval point, operating record, and periodic review.'
  }[profile.domain];
  const steps = [
    'Map the requirement to its applicability, owner, impacted process, and required approval.',
    'Translate the requirement into a policy/SOP, operational control, checklist, and monitoring indicator.',
    'Retain execution evidence and review effectiveness when the process or system changes.'
  ];
  const evidence = [
    'Regulatory obligation register, process mapping, and approved RACI.',
    'Current policy/SOP/work instruction with approval and training or socialization evidence.',
    'Control execution log, checklist, meeting minutes, or relevant monitoring report.',
    'Control effectiveness review, audit finding, corrective action, and closure evidence.'
  ];
  const test = [
    'Check whether the requirement has an owner, active SOP, and execution evidence for the tested period.',
    'Sample evidence for authenticity, completeness, date, approver, and linkage to the requirement.'
  ];
  return {
    ...requirement,
    implementation_domain: translations[profile.domain],
    implementation_focus: focus,
    implementation_steps: steps,
    focus: originalFocus.length ? originalFocus : steps,
    evidence: originalEvidence.length ? originalEvidence : evidence,
    evidence_owner: 'Compliance with the relevant process owner',
    evidence_cadence: 'At least annually and whenever regulation, process, or system changes',
    control_test: test,
    key_dates: dates,
    evidence_status: 'Not assessed',
    evidence_disclaimer: 'Evidence examples and implementation steps are internal guidance; they do not prove compliance and do not replace review of the official PADG/BI technical guidance.'
  };
}

for (const [filename, locale] of [['padg_requirements.json', 'id'], ['padg_requirements_en.json', 'en']]) {
  const file = path.join(dataDir, filename);
  const requirements = readJson(file);
  if (!Array.isArray(requirements)) throw new Error(`${filename} must be an array`);
  writeJson(file, requirements.map(item => enrichRequirement(item, locale)));
}

console.log('Enriched PADG requirements with implementation playbooks and evidence guidance.');
for (const filename of ['padg_requirements.json', 'padg_requirements_en.json']) {
  const data = readJson(path.join(dataDir, filename));
  console.log(`${filename}: ${data.length} requirements, ${data.filter(item => item.evidence?.length).length} with evidence examples`);
}
