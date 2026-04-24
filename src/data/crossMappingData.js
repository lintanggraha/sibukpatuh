// 1. Data Node Kontrol Dasar (5 per framework, total 50 dari 10 framework)
const controls = [
  // ISO 27001
  { id: 'iso-5.1', framework: 'iso27001', name: '5.1 Policies for info security', desc: 'Kebijakan keamanan informasi harus ditetapkan, disetujui, dan dipublikasikan.' },
  { id: 'iso-5.15', framework: 'iso27001', name: '5.15 Access control', desc: 'Aturan untuk mengontrol akses fisik dan logis ke informasi dan aset.' },
  { id: 'iso-8.8', framework: 'iso27001', name: '8.8 Management of vulnerabilities', desc: 'Kerentanan teknis sistem harus dievaluasi dan diambil tindakan pencegahan.' },
  { id: 'iso-8.11', framework: 'iso27001', name: '8.11 Data masking', desc: 'Masking data harus digunakan sesuai kebijakan akses untuk melindungi data sensitif.' },
  { id: 'iso-5.24', framework: 'iso27001', name: '5.24 Incident management', desc: 'Prosedur untuk memastikan respons yang cepat, efektif dan teratur terhadap insiden.' },

  // NIST CSF 2.0
  { id: 'nist-gv.oc-01', framework: 'nist', name: 'GV.OC-01', desc: 'Misi organisasi dipahami dan menginformasikan manajemen risiko keamanan siber.' },
  { id: 'nist-pr.aa-01', framework: 'nist', name: 'PR.AA-01', desc: 'Identitas dan kredensial untuk pengguna dan layanan dikelola dengan baik.' },
  { id: 'nist-id.ra-01', framework: 'nist', name: 'ID.RA-01', desc: 'Kerentanan pada aset diidentifikasi, divalidasi, dan dicatat secara rutin.' },
  { id: 'nist-pr.ds-01', framework: 'nist', name: 'PR.DS-01', desc: 'Kerahasiaan, integritas, dan ketersediaan data saat istirahat (data-at-rest) dilindungi.' },
  { id: 'nist-rs.ma-01', framework: 'nist', name: 'RS.MA-01', desc: 'Rencana respons insiden dieksekusi secara terkoordinasi setelah insiden dideklarasikan.' },

  // COBIT 2019
  { id: 'cobit-apo01.01', framework: 'cobit', name: 'APO01.01 Design mgmt system', desc: 'Desain sistem manajemen I&T perusahaan yang memenuhi persyaratan organisasi.' },
  { id: 'cobit-dss05.04', framework: 'cobit', name: 'DSS05.04 Manage user identity', desc: 'Pastikan pengguna memiliki hak akses sesuai dengan kebutuhan bisnis.' },
  { id: 'cobit-apo12.01', framework: 'cobit', name: 'APO12.01 Collect risk data', desc: 'Identifikasi dan kumpulkan data risiko TI untuk analisis dan pelaporan.' },
  { id: 'cobit-apo03.02', framework: 'cobit', name: 'APO03.02 Define baseline arch', desc: 'Tetapkan arsitektur dasar untuk domain data dan teknologi untuk perlindungan.' },
  { id: 'cobit-dss02.05', framework: 'cobit', name: 'DSS02.05 Resolve incidents', desc: 'Pastikan insiden TI diselesaikan dan operasional bisnis pulih tepat waktu.' },

  // SEOJK 29/03/2022
  { id: 'seojk-1.1', framework: 'seojk', name: 'Kebijakan Keamanan', desc: 'Penyelenggara Sistem Elektronik wajib memiliki kebijakan keamanan yang disetujui.' },
  { id: 'seojk-2.1', framework: 'seojk', name: 'Manajemen Akses', desc: 'Prosedur pemberian dan pencabutan hak akses harus dipantau ketat.' },
  { id: 'seojk-3.1', framework: 'seojk', name: 'Manajemen Kerentanan', desc: 'Pemindaian kerentanan dan penetration testing secara berkala.' },
  { id: 'seojk-4.1', framework: 'seojk', name: 'Kriptografi', desc: 'Mengimplementasikan algoritma kriptografi yang kuat untuk data sensitif.' },
  { id: 'seojk-5.1', framework: 'seojk', name: 'Manajemen Insiden', desc: 'Prosedur penanganan insiden siber dan pelaporan insiden berdampak tinggi.' },

  // PBI 02/2024
  { id: 'pbi-bab2', framework: 'pbi', name: 'Tata Kelola TI', desc: 'Bank wajib menerapkan tata kelola TI dengan pengawasan aktif Direksi.' },
  { id: 'pbi-bab3', framework: 'pbi', name: 'Pengendalian Akses', desc: 'Memastikan segregation of duties dan least privilege dalam pemberian akses.' },
  { id: 'pbi-bab4', framework: 'pbi', name: 'Manajemen Risiko TI', desc: 'Mengidentifikasi, mengukur, memantau, dan mengendalikan Risiko TI.' },
  { id: 'pbi-bab5', framework: 'pbi', name: 'Perlindungan Data Nasabah', desc: 'Menjaga kerahasiaan, keutuhan, dan ketersediaan data nasabah.' },
  { id: 'pbi-bab6', framework: 'pbi', name: 'Penanganan Insiden Siber', desc: 'Memiliki fungsi respons insiden dan pemulihan sistem yang memadai.' },

  // Panduan Resiliensi OJK
  { id: 'resilience-1', framework: 'resilience', name: 'Tata Kelola Digital', desc: 'Menetapkan kerangka kerja tata kelola resiliensi digital terintegrasi.' },
  { id: 'resilience-2', framework: 'resilience', name: 'Identity & Access Mgmt', desc: 'Menerapkan kontrol akses ketat termasuk multifactor authentication.' },
  { id: 'resilience-3', framework: 'resilience', name: 'Threat Intelligence', desc: 'Menganalisis ancaman dan kerentanan siber secara berkelanjutan.' },
  { id: 'resilience-4', framework: 'resilience', name: 'Perlindungan Infrastruktur', desc: 'Melindungi sistem dan infrastruktur (termasuk data) untuk layanan kritikal.' },
  { id: 'resilience-5', framework: 'resilience', name: 'Business Continuity', desc: 'Memastikan kelangsungan bisnis pada saat terjadi gangguan insiden siber.' },

  // PADG 32/2025
  { id: 'padg-1', framework: 'padg', name: 'Tata Kelola Keamanan', desc: 'Kebijakan dan prosedur tata kelola keamanan TI Bank Indonesia.' },
  { id: 'padg-2', framework: 'padg', name: 'Kontrol Akses Identitas', desc: 'Manajemen hak akses dan otentikasi sistem perbankan.' },
  { id: 'padg-3', framework: 'padg', name: 'Pemantauan Risiko', desc: 'Identifikasi dan penilaian risiko keamanan sistem pembayaran.' },
  { id: 'padg-4', framework: 'padg', name: 'Keamanan Data & Kriptografi', desc: 'Perlindungan kerahasiaan dan integritas data.' },
  { id: 'padg-5', framework: 'padg', name: 'Respons Insiden Operasional', desc: 'Prosedur penanganan dan pelaporan insiden keamanan.' },

  // OWASP Top 10
  { id: 'owasp-a01', framework: 'owasp_top10', name: 'A01: Broken Access Control', desc: 'Kebijakan untuk mencegah kegagalan pembatasan akses.' },
  { id: 'owasp-a07', framework: 'owasp_top10', name: 'A07: Identification Failures', desc: 'Pencegahan kegagalan otentikasi dan identitas.' },
  { id: 'owasp-a06', framework: 'owasp_top10', name: 'A06: Vulnerable Components', desc: 'Manajemen komponen yang rentan dan kedaluwarsa.' },
  { id: 'owasp-a02', framework: 'owasp_top10', name: 'A02: Cryptographic Failures', desc: 'Pencegahan kegagalan perlindungan data sensitif dan kriptografi.' },
  { id: 'owasp-a09', framework: 'owasp_top10', name: 'A09: Security Logging Failures', desc: 'Kegagalan logging dan monitoring yang menghambat respons insiden.' },

  // OWASP ASVS
  { id: 'asvs-v1', framework: 'owasp_asvs', name: 'V1: Architecture', desc: 'Persyaratan arsitektur keamanan dan desain aplikasi.' },
  { id: 'asvs-v2', framework: 'owasp_asvs', name: 'V2: Authentication', desc: 'Persyaratan keamanan untuk verifikasi identitas pengguna.' },
  { id: 'asvs-v14', framework: 'owasp_asvs', name: 'V14: Configuration', desc: 'Konfigurasi aman dan manajemen kerentanan.' },
  { id: 'asvs-v6', framework: 'owasp_asvs', name: 'V6: Cryptography', desc: 'Persyaratan untuk implementasi kriptografi.' },
  { id: 'asvs-v7', framework: 'owasp_asvs', name: 'V7: Error Handling', desc: 'Penanganan error dan logging untuk respons keamanan.' },

  // UU PDP
  { id: 'pdp-pasal16', framework: 'pdp', name: 'Pasal 16: Kebijakan PDP', desc: 'Kewajiban memiliki kebijakan pelindungan data pribadi.' },
  { id: 'pdp-pasal35', framework: 'pdp', name: 'Pasal 35: Akses Data', desc: 'Pembatasan hak akses ke data pribadi.' },
  { id: 'pdp-pasal39', framework: 'pdp', name: 'Pasal 39: Penilaian Dampak', desc: 'Penilaian dampak pelindungan data pribadi (DPIA).' },
  { id: 'pdp-pasal43', framework: 'pdp', name: 'Pasal 43: Keamanan Data', desc: 'Kewajiban melindungi data pribadi dari akses tidak sah.' },
  { id: 'pdp-pasal46', framework: 'pdp', name: 'Pasal 46: Pemberitahuan Insiden', desc: 'Kewajiban melaporkan kegagalan pelindungan data pribadi.' }
];

// 2. Daftar Ekuivalensi Berdasarkan 5 Topik (Kebijakan, Akses, Risiko, Data, Insiden)
const equivalencyGroups = [
  ['iso-5.1', 'nist-gv.oc-01', 'cobit-apo01.01', 'seojk-1.1', 'pbi-bab2', 'resilience-1', 'padg-1', 'owasp-a01', 'asvs-v1', 'pdp-pasal16'],
  ['iso-5.15', 'nist-pr.aa-01', 'cobit-dss05.04', 'seojk-2.1', 'pbi-bab3', 'resilience-2', 'padg-2', 'owasp-a07', 'asvs-v2', 'pdp-pasal35'],
  ['iso-8.8', 'nist-id.ra-01', 'cobit-apo12.01', 'seojk-3.1', 'pbi-bab4', 'resilience-3', 'padg-3', 'owasp-a06', 'asvs-v14', 'pdp-pasal39'],
  ['iso-8.11', 'nist-pr.ds-01', 'cobit-apo03.02', 'seojk-4.1', 'pbi-bab5', 'resilience-4', 'padg-4', 'owasp-a02', 'asvs-v6', 'pdp-pasal43'],
  ['iso-5.24', 'nist-rs.ma-01', 'cobit-dss02.05', 'seojk-5.1', 'pbi-bab6', 'resilience-5', 'padg-5', 'owasp-a09', 'asvs-v7', 'pdp-pasal46']
];

// 3. Generate Link Cross-Mapping Secara Otomatis
const links = [];
equivalencyGroups.forEach(group => {
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      links.push({ source: group[i], target: group[j] });
    }
  }
});

// 4. Export Object
export const crossMappingData = {
  frameworks: [
    { id: 'iso27001', name: 'ISO 27001:2022', color: '#0d6efd' }, // Primary Blue
    { id: 'nist', name: 'NIST CSF 2.0', color: '#198754' },       // Success Green
    { id: 'cobit', name: 'COBIT 2019', color: '#fd7e14' },        // Orange
    { id: 'seojk', name: 'SEOJK 29/03/2022', color: '#dc3545' },  // Danger Red
    { id: 'pbi', name: 'PBI 02/2024', color: '#0dcaf0' },         // Info Cyan
    { id: 'resilience', name: 'Resiliensi OJK', color: '#6f42c1' }, // Purple
    { id: 'padg', name: 'PADG 32/2025', color: '#20c997' },       // Teal
    { id: 'owasp_top10', name: 'OWASP Top 10', color: '#e83e8c' }, // Pink
    { id: 'owasp_asvs', name: 'OWASP ASVS', color: '#d63384' },   // Dark Pink
    { id: 'pdp', name: 'UU PDP No. 27/2022', color: '#ffc107' }   // Yellow
  ],
  controls,
  links
};
