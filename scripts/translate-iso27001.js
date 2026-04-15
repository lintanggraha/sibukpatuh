import fs from 'fs';

// Read the original data
const data = JSON.parse(fs.readFileSync('./data/iso27001.json', 'utf8'));

// Proper translations for ISO 27001:2022 controls
const translations = {
  // Theme 5: Organizational Controls (5.1 - 5.37)
  "5.1": {
    name: "Kebijakan keamanan informasi",
    description: "Kebijakan keamanan informasi harus didefinisikan, disetujui oleh manajemen, dipublikasikan, dan dikomunikasikan kepada personel dan pihak berkepentingan terkait."
  },
  "5.2": {
    name: "Peran dan tanggung jawab keamanan informasi",
    description: "Peran dan tanggung jawab untuk keamanan informasi harus didefinisikan dan dialokasikan sesuai dengan kebutuhan organisasi."
  },
  "5.3": {
    name: "Pemisahan tugas",
    description: "Tugas dan area tanggung jawab yang saling bertentangan harus dipisahkan untuk mengurangi risiko penyalahgunaan atau modifikasi tidak sah terhadap aset organisasi."
  },
  "5.4": {
    name: "Tanggung jawab manajemen",
    description: "Manajemen harus menuntut semua personel untuk menerapkan keamanan informasi sesuai dengan kerangka kerja keamanan informasi yang telah ditetapkan."
  },
  "5.5": {
    name: "Kontak dengan otoritas yang berwenang",
    description: "Organisasi harus menjalin dan memelihara kontak dengan otoritas yang berwenang sesuai dengan ketentuan hukum dan peraturan yang berlaku."
  },
  "5.6": {
    name: "Kontak dengan grup kepentingan khusus",
    description: "Organisasi harus menjalin dan memelihara kontak dengan grup kepentingan khusus atau forum profesional lainnya untuk mendapatkan informasi tentang perkembangan keamanan informasi."
  },
  "5.7": {
    name: "Intelijen ancaman",
    description: "Informasi terkait ancaman keamanan informasi harus dikumpulkan dan dianalisis untuk menghasilkan intelijen ancaman yang dapat ditindaklanjuti."
  },
  "5.8": {
    name: "Keamanan informasi dalam manajemen proyek",
    description: "Aspek keamanan informasi harus diintegrasikan ke dalam manajemen proyek terlepas dari jenis proyek yang sedang dilaksanakan."
  },
  "5.9": {
    name: "Inventarisasi informasi dan aset terkait lainnya",
    description: "Aset yang terkait dengan proses informasi harus diidentifikasi, didefinisikan dengan jelas, dan inventarisasinya harus dipelihara."
  },
  "5.10": {
    name: "Penggunaan aset yang dapat diterima",
    description: "Aturan untuk penggunaan aset yang dapat diterima dan prosedur penggunaan informasi dan aset yang terkait dengan proses informasi harus diidentifikasi, didokumentasikan, dan diimplementasikan."
  },
  "5.11": {
    name: "Pengembalian aset",
    description: "Semua aset yang dipinjamkan kepada personel dan pihak eksternal harus dikembalikan saat mereka keluar dari organisasi atau ketika sudah tidak dibutuhkan lagi."
  },
  "5.12": {
    name: "Klasifikasi informasi",
    description: "Informasi harus diklasifikasikan berdasarkan persyaratan keamanan informasi, kebutuhan berbagi informasi, dan pembatasan akses."
  },
  "5.13": {
    name: "Pelabelan informasi",
    description: "Proses pelabelan yang sesuai harus diterapkan untuk mengidentifikasi klasifikasi informasi berdasarkan klasifikasi yang telah ditetapkan oleh organisasi."
  },
  "5.14": {
    name: "Transfer informasi",
    description: "Informasi harus dilindungi saat ditransfer, diterima, atau dikomunikasikan dalam berbagai bentuk sesuai dengan kebijakan klasifikasi informasi."
  },
  "5.15": {
    name: "Manajemen akses",
    description: "Aturan untuk mengontrol akses fisik dan logis ke informasi dan aset lainnya harus ditetapkan berdasarkan kebutuhan bisnis dan keamanan informasi."
  },
  "5.16": {
    name: "Manajemen identitas",
    description: "Siklus hidup lengkap identitas digital untuk personel, pengguna eksternal, dan perangkat harus dikelola termasuk proses pendaftaran, penghentian, dan perubahan."
  },
  "5.17": {
    name: "Informasi autentikasi",
    description: "Informasi autentikasi untuk personel dan perangkat harus dialokasikan, dikelola, dan didistribusikan sesuai dengan kebijakan akses organisasi."
  },
  "5.18": {
    name: "Hak akses",
    description: "Hak akses ke informasi dan aset lainnya harus disediakan, ditinjau, dimodifikasi, dan dihapus sesuai dengan kebijakan manajemen akses organisasi."
  },
  "5.19": {
    name: "Keamanan informasi dalam hubungan dengan pemasok",
    description: "Proses dan prosedur harus ditetapkan dan diimplementasikan untuk mengelola risiko keamanan informasi yang terkait dengan penggunaan produk atau layanan dari pemasok."
  },
  "5.20": {
    name: "Pengelolaan keamanan informasi untuk layanan cloud",
    description: "Proses pengelolaan keamanan informasi harus ditetapkan untuk penggunaan layanan cloud sesuai dengan persyaratan keamanan organisasi."
  },
  "5.21": {
    name: "Keamanan informasi dalam rantai pasokan TI",
    description: "Proses dan prosedur harus ditetapkan untuk mengelola risiko keamanan informasi dalam rantai pasokan teknologi informasi."
  },
  "5.22": {
    name: "Kepatuhan terhadap kebijakan, aturan, dan standar keamanan informasi",
    description: "Kepatuhan terhadap kebijakan keamanan informasi, aturan, prosedur, dan standar organisasi harus ditinjau secara berkala."
  },
  "5.23": {
    name: "Hubungan dengan komunitas informasi dan keamanan",
    description: "Organisasi harus berpartisipasi dalam komunitas informasi dan keamanan untuk berbagi pengetahuan dan informasi tentang ancaman keamanan."
  },
  "5.24": {
    name: "Perencanaan dan persiapan keamanan informasi kontinuitas bisnis",
    description: "Organisasi harus merencanakan dan mempersiapkan keamanan informasi untuk mendukung kontinuitas bisnis dalam situasi krisis."
  },
  "5.25": {
    name: "Penilaian dan keputusan kepatuhan awal",
    description: "Penilaian kepatuhan harus dilakukan terhadap semua persyaratan hukum, peraturan, dan kontraktual yang relevan dengan keamanan informasi."
  },
  "5.26": {
    name: "Persyaratan hukum, peraturan, dan kontraktual",
    description: "Persyaratan hukum, peraturan, dan kontraktual yang relevan dengan keamanan informasi harus diidentifikasi, didokumentasikan, dan dipelihara."
  },
  "5.27": {
    name: "Kekekalan dan disposisi rekaman informasi",
    description: "Rekaman informasi harus dilindungi dari penghapusan, kerusakan, atau modifikasi yang tidak sah sesuai dengan persyaratan hukum dan bisnis."
  },
  "5.28": {
    name: "Penjaminan privasi dan perlindungan PII",
    description: "Organisasi harus mengidentifikasi dan memenuhi persyaratan privasi dan perlindungan informasi pribadi yang dapat diidentifikasi (PII)."
  },
  "5.29": {
    name: "Penilaian independen keamanan informasi",
    description: "Keamanan informasi organisasi harus ditinjau secara independen pada interval yang telah direncanakan atau ketika terjadi perubahan signifikan."
  },
  "5.30": {
    name: "Persyaratan keamanan informasi dalam proses pengembangan ICT",
    description: "Persyaratan keamanan informasi harus diidentifikasi dan diimplementasikan dalam proses pengembangan teknologi informasi dan komunikasi."
  },
  "5.31": {
    name: "Pengembangan dan pengendalian legal",
    description: "Pengembangan dan pengendalian legal harus diterapkan untuk memastikan kepatuhan terhadap persyaratan hukum dan peraturan."
  },
  "5.32": {
    name: "Pengelolaan hak kekayaan intelektual",
    description: "Prosedur harus ditetapkan untuk mengelola hak kekayaan intelektual dan memastikan kepatuhan terhadap lisensi perangkat lunak."
  },
  "5.33": {
    name: "Perlindungan rekaman",
    description: "Rekaman harus dilindungi dari akses tidak sah, modifikasi, atau penghapusan sesuai dengan persyaratan hukum dan bisnis."
  },
  "5.34": {
    name: "Privasi dan perlindungan PII",
    description: "Privasi dan informasi pribadi yang dapat diidentifikasi harus dilindungi sesuai dengan persyaratan hukum dan peraturan yang berlaku."
  },
  "5.35": {
    name: "Tinjauan independen keamanan informasi",
    description: "Pendekatan keamanan informasi organisasi harus ditinjau secara independen pada interval yang telah direncanakan."
  },
  "5.36": {
    name: "Kepatuhan terhadap kebijakan dan standar keamanan informasi",
    description: "Kepatuhan terhadap kebijakan keamanan informasi, aturan, prosedur, dan standar harus ditinjau secara berkala."
  },
  "5.37": {
    name: "Prosedur operasi dokumen",
    description: "Prosedur dokumentasi dan pengendalian harus ditetapkan untuk mengelola dokumen operasional keamanan informasi."
  },

  // Theme 6: People Controls (6.1 - 6.8)
  "6.1": {
    name: "Penyaringan latar belakang",
    description: "Verifikasi latar belakang harus dilakukan untuk semua kandidat personel sesuai dengan hukum, peraturan, dan etika yang berlaku serta berdasarkan risiko bisnis dan klasifikasi informasi."
  },
  "6.2": {
    name: "Syarat dan ketentuan pekerjaan",
    description: "Syarat dan ketentuan pekerjaan harus menyatakan tanggung jawab personel dan organisasi untuk keamanan informasi sejak awal pekerjaan."
  },
  "6.3": {
    name: "Kesadaran keamanan informasi, pelatihan, dan pendidikan",
    description: "Personel dan pihak berkepentingan terkait harus menerima kesadaran keamanan informasi, pelatihan, dan pendidikan yang sesuai dengan peran dan tanggung jawab mereka."
  },
  "6.4": {
    name: "Proses disipliner",
    description: "Proses disipliner harus ada untuk mengambil tindakan terhadap personel dan pihak berkepentingan lainnya yang telah melakukan pelanggaran keamanan informasi."
  },
  "6.5": {
    name: "Tanggung jawab setelah penghentian atau perubahan pekerjaan",
    description: "Tanggung jawab dan kewajiban keamanan informasi yang berlaku setelah penghentian atau perubahan pekerjaan harus didefinisikan, ditegakkan, dan dikomunikasikan kepada personel."
  },
  "6.6": {
    name: "Perjanjian kerahasiaan atau non-disclosure",
    description: "Persyaratan kerahasiaan atau non-disclosure yang mencerminkan kebutuhan organisasi untuk perlindungan informasi harus diidentifikasi, didokumentasikan, dan ditinjau secara berkala."
  },
  "6.7": {
    name: "Kerja jarak jauh",
    description: "Kebijakan dan prosedur harus ditetapkan untuk mendukung kerja jarak jauh dan melindungi aset organisasi di luar lokasi fisik organisasi."
  },
  "6.8": {
    name: "Pelaporan kejadian keamanan informasi",
    description: "Organisasi harus menyediakan mekanisme bagi personel untuk melaporkan kejadian atau kelemahan keamanan informasi yang diamati melalui saluran yang tepat."
  },

  // Theme 7: Physical Controls (7.1 - 7.14)
  "7.1": {
    name: "Batas keamanan fisik",
    description: "Batas keamanan fisik harus didefinisikan dan digunakan untuk melindungi area yang berisi informasi dan aset lainnya dari ancaman fisik, lingkungan, dan bahaya lainnya."
  },
  "7.2": {
    name: "Entri fisik",
    description: "Area keamanan harus dilindungi oleh kontrol akses yang sesuai dan titik entri fisik harus diamankan."
  },
  "7.3": {
    name: "Mengamankan kantor, ruangan, dan fasilitas",
    description: "Keamanan fisik untuk kantor, ruangan, dan fasilitas harus dirancang dan diimplementasikan sesuai dengan risiko keamanan yang relevan."
  },
  "7.4": {
    name: "Pemantauan keamanan fisik",
    description: "Premis organisasi harus dipantau secara terus-menerus untuk mendeteksi akses fisik yang tidak sah dan aktivitas yang mencurigakan."
  },
  "7.5": {
    name: "Perlindungan terhadap ancaman fisik dan lingkungan",
    description: "Perlindungan harus dirancang dan diimplementasikan terhadap ancaman fisik dan lingkungan seperti bencana alam, sabotase, dan serangan yang disengaja."
  },
  "7.6": {
    name: "Bekerja di area aman",
    description: "Personel dan kontraktor harus mematuhi persyaratan keamanan saat bekerja di area aman organisasi."
  },
  "7.7": {
    name: "Dukungan utilitas",
    description: "Utilitas pendukung seperti listrik, telekomunikasi, air, dan gas harus tersedia dan dilindungi sesuai dengan persyaratan keamanan."
  },
  "7.8": {
    name: "Pemeliharaan peralatan",
    description: "Peralatan harus dipelihara secara berkala untuk memastikan ketersediaan, integritas, dan keamanan operasional yang berkelanjutan."
  },
  "7.9": {
    name: "Keamanan aset di luar lokasi",
    description: "Aset yang berada di luar lokasi organisasi harus dilindungi dengan kontrol keamanan yang sesuai."
  },
  "7.10": {
    name: "Media penyimpanan yang dapat dihapus dan media transmisi",
    description: "Media yang dapat dihapus dan media transmisi harus diamankan dari akses tidak sah, penyalahgunaan, atau pencurian."
  },
  "7.11": {
    name: "Dukungan untuk rencana darurat",
    description: "Rencana darurat harus didukung oleh fasilitas dan utilitas yang memadai untuk memastikan kelangsungan operasional."
  },
  "7.12": {
    name: "Kabel dan daya",
    description: "Kabel untuk daya dan telekomunikasi harus diamankan dari gangguan, penyadapan, atau kerusakan yang disengaja atau tidak sengaja."
  },
  "7.13": {
    name: "Pemeliharaan dan inspeksi fasilitas",
    description: "Fasilitas harus dipelihara dan diperiksa secara berkala untuk memastikan integritas dan keamanan fisik yang berkelanjutan."
  },
  "7.14": {
    name: "Keamanan fisik saat penghentian atau relokasi",
    description: "Keamanan fisik harus dipertahankan saat penghentian atau relokasi fasilitas dan aset organisasi."
  },

  // Theme 8: Technological Controls (8.1 - 8.42)
  "8.1": {
    name: "Perangkat pengguna akhir",
    description: "Informasi yang disimpan, diproses, atau diakses oleh perangkat pengguna akhir harus dilindungi sesuai dengan klasifikasi informasi dan persyaratan keamanan."
  },
  "8.2": {
    name: "Hak istimewa akses",
    description: "Alokasi dan penggunaan hak istimewa akses harus dibatasi dan dikelola untuk mengurangi risiko keamanan informasi."
  },
  "8.3": {
    name: "Pembatasan akses informasi",
    description: "Akses ke informasi dan aset lainnya harus dibatasi sesuai dengan kebijakan manajemen akses dan klasifikasi informasi."
  },
  "8.4": {
    name: "Akses ke kode sumber",
    description: "Akses baca ke kode sumber, skrip, atau file konfigurasi harus dibatasi untuk mencegah modifikasi yang tidak sah."
  },
  "8.5": {
    name: "Autentikasi aman",
    description: "Mekanisme autentikasi yang aman harus diimplementasikan untuk memverifikasi identitas pengguna dan perangkat yang mengakses sistem informasi."
  },
  "8.6": {
    name: "Manajemen kapasitas",
    description: "Penggunaan sumber daya sistem harus dipantau dan dianalisis untuk memastikan kapasitas yang memadai dan mengidentifikasi potensi bottleneck."
  },
  "8.7": {
    name: "Proteksi terhadap malware",
    description: "Perlindungan terhadap malware harus diimplementasikan dan didukung oleh kesadaran pengguna, deteksi, pencegahan, dan pemulihan."
  },
  "8.8": {
    name: "Manajemen kerentanan teknis",
    description: "Kerentanan teknis dari aset informasi harus dikelola melalui identifikasi, penilaian risiko, dan pengobatan yang tepat."
  },
  "8.9": {
    name: "Konfigurasi perangkat keras",
    description: "Konfigurasi perangkat keras harus diamankan dan dikelola sesuai dengan kebijakan keamanan informasi organisasi."
  },
  "8.10": {
    name: "Penghapusan informasi",
    description: "Informasi yang disimpan dalam sistem informasi dan penyimpanan harus dihapus dengan aman ketika sudah tidak dibutuhkan lagi."
  },
  "8.11": {
    name: "Masking data",
    description: "Data harus ditutup atau disembunyikan sesuai dengan kebijakan klasifikasi informasi dan persyaratan akses."
  },
  "8.12": {
    name: "Pencegahan kebocoran data",
    description: "Mekanisme pencegahan kebocoran data harus diimplementasikan untuk mendeteksi dan mencegah transmisi informasi yang tidak sah."
  },
  "8.13": {
    name: "Pencadangan informasi",
    description: "Salinan cadangan informasi, perangkat lunak, dan sistem harus dipelihara dan diuji secara berkala sesuai dengan kebijakan pencadangan."
  },
  "8.14": {
    name: "Keberlebihan fasilitas pemrosesan informasi",
    description: "Fasilitas pemrosesan informasi harus memiliki tingkat keberagaman dan redundansi yang cukup untuk memenuhi persyaratan ketersediaan."
  },
  "8.15": {
    name: "Pencatatan log (Logging)",
    description: "Log aktivitas harus dihasilkan, disimpan, dilindungi, dan ditinjau secara berkala untuk mendeteksi kejadian dan perilaku yang mencurigakan."
  },
  "8.16": {
    name: "Aktivitas pemantauan",
    description: "Jaringan, sistem, dan aplikasi harus dipantau untuk mendeteksi anomali dan potensi insiden keamanan informasi."
  },
  "8.17": {
    name: "Sinkronisasi jam",
    description: "Jam semua sistem pemrosesan informasi yang relevan harus disinkronisasi dengan sumber waktu yang terpercaya untuk mendukung analisis log."
  },
  "8.18": {
    name: "Penggunaan program utilitas",
    description: "Penggunaan program utilitas yang dapat mengabaikan kontrol sistem harus dibatasi dan diamankan untuk mencegah penyalahgunaan."
  },
  "8.19": {
    name: "Instalasi perangkat lunak pada sistem operasional",
    description: "Prosedur harus ditetapkan untuk menginstalasi perangkat lunak pada sistem operasional tanpa mengganggu operasional bisnis."
  },
  "8.20": {
    name: "Jaringan dan keamanan",
    description: "Jaringan harus diamankan, dikelola, dan dipantau untuk mencegah akses tidak sah dan memastikan integritas data."
  },
  "8.21": {
    name: "Keamanan layanan jaringan",
    description: "Mekanisme keamanan, tingkat layanan, dan persyaratan layanan harus diidentifikasi dan diimplementasikan untuk semua layanan jaringan."
  },
  "8.22": {
    name: "Pemisahan jaringan",
    description: "Jaringan harus dipisahkan untuk mengurangi risiko penyebaran insiden keamanan dan melindungi area jaringan yang sensitif."
  },
  "8.23": {
    name: "Penapisan web (Web filtering)",
    description: "Penapisan web harus diterapkan untuk mencegah akses ke situs web berbahaya dan mengurangi risiko serangan berbasis web."
  },
  "8.24": {
    name: "Keamanan pengembangan aplikasi",
    description: "Kontrol keamanan harus diintegrasikan ke dalam siklus hidup pengembangan aplikasi dari tahap perencanaan hingga implementasi."
  },
  "8.25": {
    name: "Prinsip rekayasa sistem aman",
    description: "Prinsip rekayasa sistem aman harus diterapkan dalam pengembangan dan implementasi sistem informasi organisasi."
  },
  "8.26": {
    name: "Persyaratan keamanan aplikasi",
    description: "Persyaratan keamanan informasi harus diidentifikasi dan ditentukan untuk setiap aplikasi berdasarkan klasifikasi informasi."
  },
  "8.27": {
    name: "Pengkodean aman (Secure coding)",
    description: "Prinsip dan praktik pengkodean aman harus diterapkan dalam pengembangan aplikasi untuk mengurangi kerentanan keamanan."
  },
  "8.28": {
    name: "Pengujian keamanan dalam pengembangan",
    description: "Proses pengujian keamanan harus diterapkan dalam siklus hidup pengembangan untuk mengidentifikasi dan memperbaiki kerentanan."
  },
  "8.29": {
    name: "Pengujian keamanan sistem",
    description: "Pengujian keamanan harus dilakukan pada sistem yang telah dikembangkan untuk memverifikasi efektivitas kontrol keamanan."
  },
  "8.30": {
    name: "Pengembangan outsourcing",
    description: "Persyaratan keamanan informasi harus diidentifikasi dan diawasi dalam pengembangan yang di-outsource kepada pihak ketiga."
  },
  "8.31": {
    name: "Pemisahan lingkungan pengembangan, pengujian, dan produksi",
    description: "Lingkungan pengembangan, pengujian, dan produksi harus dipisahkan untuk mengurangi risiko gangguan operasional dan akses tidak sah."
  },
  "8.32": {
    name: "Perubahan manajemen",
    description: "Perubahan pada aset informasi, fasilitas pemrosesan data, dan layanan harus dikelola dan dikendalikan melalui proses perubahan yang terstruktur."
  },
  "8.33": {
    name: "Informasi manajemen proyek",
    description: "Manajemen informasi proyek harus diterapkan untuk memastikan keamanan informasi selama siklus hidup proyek."
  },
  "8.34": {
    name: "Perlindungan sistem informasi selama pengujian audit",
    description: "Sistem informasi harus dilindungi selama pengujian audit dan kegiatan verifikasi keamanan lainnya."
  },
  "8.35": {
    name: "Teknik untuk masking data dalam pengujian",
    description: "Teknik masking data harus digunakan untuk melindungi informasi sensitif selama pengujian dan pengembangan aplikasi."
  },
  "8.36": {
    name: "Pengelolaan kerahasiaan data pengujian",
    description: "Data pengujian harus dikelola dan dilindungi sesuai dengan persyaratan kerahasiaan dan klasifikasi informasi."
  },
  "8.37": {
    name: "Integrasi sistem dan keamanan",
    description: "Integrasi sistem harus mempertimbangkan persyaratan keamanan informasi dan kontrol akses antar sistem."
  },
  "8.38": {
    name: "Pengujian sistem keamanan setelah perubahan",
    description: "Sistem keamanan harus diuji setelah perubahan signifikan untuk memastikan kontrol keamanan tetap efektif."
  },
  "8.39": {
    name: "Keamanan dalam lingkungan virtual",
    description: "Keamanan dalam lingkungan virtual harus dikelola sesuai dengan persyaratan keamanan informasi organisasi."
  },
  "8.40": {
    name: "Keamanan otomatisasi",
    description: "Keamanan dalam otomatisasi proses dan sistem harus diimplementasikan untuk mengurangi risiko kesalahan manusia."
  },
  "8.41": {
    name: "Keamanan dalam lingkungan cloud",
    description: "Keamanan dalam lingkungan cloud harus dikelola sesuai dengan persyaratan keamanan dan kepatuhan organisasi."
  },
  "8.42": {
    name: "Manajemen konfigurasi",
    description: "Konfigurasi keamanan untuk perangkat keras, perangkat lunak, layanan, dan jaringan harus ditetapkan, didokumentasikan, diimplementasikan, dipantau, dan ditinjau."
  }
};

// Apply translations
data.forEach(control => {
  const id = control.id;
  if (translations[id]) {
    control.name = translations[id].name;
    control.description = translations[id].description;
  }
});

// Write back
fs.writeFileSync('./data/iso27001.json', JSON.stringify(data, null, 2), 'utf8');
console.log('✓ Translation updated for', Object.keys(translations).length, 'controls');
