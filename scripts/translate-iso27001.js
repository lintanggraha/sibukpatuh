import fs from 'fs';

// Proper translations for ISO 27001:2022 controls with unique analogies, focus areas, and implementation tips
const translations = {
  // Theme 5: Organizational Controls (5.1 - 5.37)
  "5.1": {
    name: "Kebijakan keamanan informasi",
    description: "Kebijakan keamanan informasi harus didefinisikan, disetujui oleh manajemen, dipublikasikan, dan dikomunikasikan kepada personel dan pihak berkepentingan terkait.",
    analogy: "Seperti kompas yang memberi arah dalam perjalanan, kebijakan keamanan memberi panduan jelas bagi seluruh organisasi tentang apa yang harus dilindungi dan bagaimana caranya.",
    focusArea: "Tata Kelola & Kebijakan",
    implementationTips: "Mulai dengan membuat draft kebijakan yang sederhana dan relevan dengan bisnis. Libatkan C-level untuk approval, lalu sosialisasi ke seluruh karyawan melalui email blast dan briefing. Review kebijakan minimal setahun sekali atau saat ada perubahan regulasi signifikan."
  },
  "5.2": {
    name: "Peran dan tanggung jawab keamanan informasi",
    description: "Peran dan tanggung jawab untuk keamanan informasi harus didefinisikan dan dialokasikan sesuai dengan kebutuhan organisasi.",
    analogy: "Layaknya tim sepak bola yang punya posisi spesifik—kiper, bek, penyerang—setiap orang di organisasi harus tahu peran mereka dalam menjaga keamanan informasi."
  },
  "5.3": {
    name: "Pemisahan tugas",
    description: "Tugas dan area tanggung jawab yang saling bertentangan harus dipisahkan untuk mengurangi risiko penyalahgunaan atau modifikasi tidak sah terhadap aset organisasi.",
    analogy: "Seperti dalam restoran, koki yang memasak tidak sama dengan kasir yang menangani uang—pemisahan ini mencegah kecurangan dan memastikan kualitas."
  },
  "5.4": {
    name: "Tanggung jawab manajemen",
    description: "Manajemen harus menuntut semua personel untuk menerapkan keamanan informasi sesuai dengan kerangka kerja keamanan informasi yang telah ditetapkan.",
    analogy: "Seperti pelatih tim yang tidak hanya memberi strategi tapi juga memastikan setiap pemain menjalankannya, manajemen harus aktif mendorong penerapan keamanan informasi."
  },
  "5.5": {
    name: "Kontak dengan otoritas yang berwenang",
    description: "Organisasi harus menjalin dan memelihara kontak dengan otoritas yang berwenang sesuai dengan ketentuan hukum dan peraturan yang berlaku.",
    analogy: "Seperti memiliki nomor telepon darurat yang siap dihubungi saat terjadi masalah, kontak dengan otoritas membantu organisasi merespons insiden dengan tepat."
  },
  "5.6": {
    name: "Kontak dengan grup kepentingan khusus",
    description: "Organisasi harus menjalin dan memelihara kontak dengan grup kepentingan khusus atau forum profesional lainnya untuk mendapatkan informasi tentang perkembangan keamanan informasi.",
    analogy: "Layaknya bergabung dengan komunitas dokter untuk update metode pengobatan terbaru, bergabung dengan forum keamanan membantu organisasi tetap update ancaman terkini."
  },
  "5.7": {
    name: "Intelijen ancaman",
    description: "Informasi terkait ancaman keamanan informasi harus dikumpulkan dan dianalisis untuk menghasilkan intelijen ancaman yang dapat ditindaklanjuti.",
    analogy: "Seperti badan meteorologi yang memonitor cuaca untuk memprediksi badai, intelijen ancaman membantu organisasi mengantisipasi serangan sebelum terjadi."
  },
  "5.8": {
    name: "Keamanan informasi dalam manajemen proyek",
    description: "Aspek keamanan informasi harus diintegrasikan ke dalam manajemen proyek terlepas dari jenis proyek yang sedang dilaksanakan.",
    analogy: "Seperti sabuk pengaman yang harus dipakai di mobil manapun, keamanan informasi harus menjadi bagian dari setiap proyek, apapun jenisnya."
  },
  "5.9": {
    name: "Inventarisasi informasi dan aset terkait lainnya",
    description: "Aset yang terkait dengan proses informasi harus diidentifikasi, didefinisikan dengan jelas, dan inventarisasinya harus dipelihara.",
    analogy: "Seperti daftar isi dalam buku yang membantu Anda menemukan halaman tertentu, inventaris aset membantu organisasi tahu apa yang harus dilindungi dan di mana lokasinya."
  },
  "5.10": {
    name: "Penggunaan aset yang dapat diterima",
    description: "Aturan untuk penggunaan aset yang dapat diterima dan prosedur penggunaan informasi dan aset yang terkait dengan proses informasi harus diidentifikasi, didokumentasikan, dan diimplementasikan.",
    analogy: "Seperti aturan pemakaian kendaraan perusahaan—boleh untuk dinas saja, bukan liburan pribadi—aset IT juga perlu batasan penggunaan yang jelas."
  },
  "5.11": {
    name: "Pengembalian aset",
    description: "Semua aset yang dipinjamkan kepada personel dan pihak eksternal harus dikembalikan saat mereka keluar dari organisasi atau ketika sudah tidak dibutuhkan lagi.",
    analogy: "Seperti mengembalikan kunci apartemen saat check-out, semua aset organisasi harus dikembalikan saat karyawan keluar atau selesai bertugas."
  },
  "5.12": {
    name: "Klasifikasi informasi",
    description: "Informasi harus diklasifikasikan berdasarkan persyaratan keamanan informasi, kebutuhan berbagi informasi, dan pembatasan akses.",
    analogy: "Seperti sistem triase di rumah sakit yang memprioritaskan pasien berdasarkan tingkat kegawatan, klasifikasi informasi membantu memprioritaskan perlindungan data."
  },
  "5.13": {
    name: "Pelabelan informasi",
    description: "Proses pelabelan yang sesuai harus diterapkan untuk mengidentifikasi klasifikasi informasi berdasarkan klasifikasi yang telah ditetapkan oleh organisasi.",
    analogy: "Layaknya label 'mudah pecah' pada paket yang mengingatkan kurir untuk berhati-hati, label klasifikasi memberi tahu karyawan cara menangani informasi."
  },
  "5.14": {
    name: "Transfer informasi",
    description: "Informasi harus dilindungi saat ditransfer, diterima, atau dikomunikasikan dalam berbagai bentuk sesuai dengan kebijakan klasifikasi informasi.",
    analogy: "Seperti pengiriman uang dengan brankas anti-maling, transfer informasi butuh perlindungan khusus agar tidak dicuri di tengah jalan."
  },
  "5.15": {
    name: "Manajemen akses",
    description: "Aturan untuk mengontrol akses fisik dan logis ke informasi dan aset lainnya harus ditetapkan berdasarkan kebutuhan bisnis dan keamanan informasi.",
    analogy: "Seperti sistem kartu akses di hotel—tamu hanya bisa masuk kamar mereka sendiri, bukan kamar orang lain—akses harus berdasarkan kebutuhan."
  },
  "5.16": {
    name: "Manajemen identitas",
    description: "Siklus hidup lengkap identitas digital untuk personel, pengguna eksternal, dan perangkat harus dikelola termasuk proses pendaftaran, penghentian, dan perubahan.",
    analogy: "Layaknya pembuatan KTP baru, perpanjangan, dan pencabutan saat pindah kota, identitas digital juga perlu dikelola dari awal sampai akhir."
  },
  "5.17": {
    name: "Informasi autentikasi",
    description: "Informasi autentikasi untuk personel dan perangkat harus dialokasikan, dikelola, dan didistribusikan sesuai dengan kebijakan akses organisasi.",
    analogy: "Seperti password ATM yang harus dirahasiakan dan diganti berkala, informasi autentikasi perlu dikelola dengan ketat untuk mencegah penyalahgunaan."
  },
  "5.18": {
    name: "Hak akses",
    description: "Hak akses ke informasi dan aset lainnya harus disediakan, ditinjau, dimodifikasi, dan dihapus sesuai dengan kebijakan manajemen akses organisasi.",
    analogy: "Seperti kunci yang harus diambil kembali saat karyawan resign, hak akses juga harus segera dicabut agar tidak disalahgunakan."
  },
  "5.19": {
    name: "Keamanan informasi dalam hubungan dengan pemasok",
    description: "Proses dan prosedur harus ditetapkan dan diimplementasikan untuk mengelola risiko keamanan informasi yang terkait dengan penggunaan produk atau layanan dari pemasok.",
    analogy: "Seperti Anda mengecek reputasi kontraktor sebelum mempekerjakan mereka, risiko keamanan pemasok harus dievaluasi sebelum bekerja sama."
  },
  "5.20": {
    name: "Pengelolaan keamanan informasi untuk layanan cloud",
    description: "Proses pengelolaan keamanan informasi harus ditetapkan untuk penggunaan layanan cloud sesuai dengan persyaratan keamanan organisasi.",
    analogy: "Seperti menyewa brankas di bank—Anda harus percaya bank menjaganya, tapi juga pastikan apa yang Anda simpan memang boleh di sana."
  },
  "5.21": {
    name: "Keamanan informasi dalam rantai pasokan TI",
    description: "Proses dan prosedur harus ditetapkan untuk mengelola risiko keamanan informasi dalam rantai pasokan teknologi informasi.",
    analogy: "Layaknya restoran yang harus memastikan supplier makanannya aman, organisasi harus memastikan rantai pasokan TI tidak menjadi titik lemah keamanan."
  },
  "5.22": {
    name: "Kepatuhan terhadap kebijakan, aturan, dan standar keamanan informasi",
    description: "Kepatuhan terhadap kebijakan keamanan informasi, aturan, prosedur, dan standar organisasi harus ditinjau secara berkala.",
    analogy: "Seperti uji kelayakan kendaraan tahunan, tinjauan kepatuhan berkala memastikan keamanan organisasi masih berjalan di jalur yang benar."
  },
  "5.23": {
    name: "Hubungan dengan komunitas informasi dan keamanan",
    description: "Organisasi harus berpartisipasi dalam komunitas informasi dan keamanan untuk berbagi pengetahuan dan informasi tentang ancaman keamanan.",
    analogy: "Seperti sistem RT yang saling berbagi info keamanan lingkungan, komunitas keamanan membantu organisasi saling berbagi info ancaman."
  },
  "5.24": {
    name: "Perencanaan dan persiapan keamanan informasi kontinuitas bisnis",
    description: "Organisasi harus merencanakan dan mempersiapkan keamanan informasi untuk mendukung kontinuitas bisnis dalam situasi krisis.",
    analogy: "Seperti演习 kebakaran yang melatih evakuasi sebelum bencana sungguhan, perencanaan kontinuitas mempersiapkan organisasi menghadapi krisis."
  },
  "5.25": {
    name: "Penilaian dan keputusan kepatuhan awal",
    description: "Penilaian kepatuhan harus dilakukan terhadap semua persyaratan hukum, peraturan, dan kontraktual yang relevan dengan keamanan informasi.",
    analogy: "Layaknya cek kesehatan sebelum mulai gym, penilaian awal kepatuhan memastikan organisasi siap memenuhi semua kewajiban keamanan."
  },
  "5.26": {
    name: "Persyaratan hukum, peraturan, dan kontraktual",
    description: "Persyaratan hukum, peraturan, dan kontraktual yang relevan dengan keamanan informasi harus diidentifikasi, didokumentasikan, dan dipelihara.",
    analogy: "Seperti daftar aturan lalu lintas yang harus dipatuhi pengemudi, persyaratan hukum keamanan harus diketahui dan dipatuhi organisasi."
  },
  "5.27": {
    name: "Kekekalan dan disposisi rekaman informasi",
    description: "Rekaman informasi harus dilindungi dari penghapusan, kerusakan, atau modifikasi yang tidak sah sesuai dengan persyaratan hukum dan bisnis.",
    analogy: "Seperti arsip penting yang disimpan dalam lemari tahan api, rekaman informasi harus dilindungi agar tidak hilang atau diubah sembarangan."
  },
  "5.28": {
    name: "Penjaminan privasi dan perlindungan PII",
    description: "Organisasi harus mengidentifikasi dan memenuhi persyaratan privasi dan perlindungan informasi pribadi yang dapat diidentifikasi (PII).",
    analogy: "Layaknya dokter yang menjaga rahasia pasien, organisasi wajib melindungi data pribadi yang dipercayakan kepadanya."
  },
  "5.29": {
    name: "Penilaian independen keamanan informasi",
    description: "Keamanan informasi organisasi harus ditinjau secara independen pada interval yang telah direncanakan atau ketika terjadi perubahan signifikan.",
    analogy: "Seperti audit keuangan oleh akuntan eksternal, penilaian independen memberi pandangan objektif tentang efektivitas keamanan."
  },
  "5.30": {
    name: "Persyaratan keamanan informasi dalam proses pengembangan ICT",
    description: "Persyaratan keamanan informasi harus diidentifikasi dan diimplementasikan dalam proses pengembangan teknologi informasi dan komunikasi.",
    analogy: "Seperti fondasi bangunan yang harus kuat sejak awal, keamanan harus dibangun dari awal dalam pengembangan sistem, bukan ditambahkan belakangan."
  },
  "5.31": {
    name: "Pengembangan dan pengendalian legal",
    description: "Pengembangan dan pengendalian legal harus diterapkan untuk memastikan kepatuhan terhadap persyaratan hukum dan peraturan.",
    analogy: "Layaknya izin mendirikan bangunan yang harus dipenuhi sebelum membangun, aspek legal harus dikendalikan sebelum mengimplementasikan sistem."
  },
  "5.32": {
    name: "Pengelolaan hak kekayaan intelektual",
    description: "Prosedur harus ditetapkan untuk mengelola hak kekayaan intelektual dan memastikan kepatuhan terhadap lisensi perangkat lunak.",
    analogy: "Seperti menghargai hak cipta musisi dengan membeli lagu asli, organisasi harus menghormati lisensi perangkat lunak yang digunakan."
  },
  "5.33": {
    name: "Perlindungan rekaman",
    description: "Rekaman harus dilindungi dari akses tidak sah, modifikasi, atau penghapusan sesuai dengan persyaratan hukum dan bisnis.",
    analogy: "Seperti rekaman CCTV yang disimpan di ruang terkunci, rekaman sistem harus dilindungi agar tidak dimanipulasi."
  },
  "5.34": {
    name: "Privasi dan perlindungan PII",
    description: "Privasi dan informasi pribadi yang dapat diidentifikasi harus dilindungi sesuai dengan persyaratan hukum dan peraturan yang berlaku.",
    analogy: "Layaknya surat pribadi yang tidak boleh dibaca orang lain, data pribadi juga harus dijaga kerahasiaannya."
  },
  "5.35": {
    name: "Tinjauan independen keamanan informasi",
    description: "Pendekatan keamanan informasi organisasi harus ditinjau secara independen pada interval yang telah direncanakan.",
    analogy: "Seperti second opinion dari dokter spesialis, tinjauan independen memberi perspektif baru tentang efektivitas keamanan."
  },
  "5.36": {
    name: "Kepatuhan terhadap kebijakan dan standar keamanan informasi",
    description: "Kepatuhan terhadap kebijakan keamanan informasi, aturan, prosedur, dan standar harus ditinjau secara berkala.",
    analogy: "Seperti cek rutin kendaraan yang memastikan semua sistem berfungsi, tinjauan kepatuhan memastikan keamanan tetap efektif."
  },
  "5.37": {
    name: "Prosedur operasi dokumen",
    description: "Prosedur dokumentasi dan pengendalian harus ditetapkan untuk mengelola dokumen operasional keamanan informasi.",
    analogy: "Seperti buku manual pesawat yang harus selalu update dan terkontrol, dokumentasi keamanan harus dikelola dengan baik."
  },

  // Theme 6: People Controls (6.1 - 6.8)
  "6.1": {
    name: "Penyaringan latar belakang",
    description: "Verifikasi latar belakang harus dilakukan untuk semua kandidat personel sesuai dengan hukum, peraturan, dan etika yang berlaku serta berdasarkan risiko bisnis dan klasifikasi informasi.",
    analogy: "Layaknya pengecekan referensi sebelum mempekerjakan pengasuh anak, penyaringan latar belakang memastikan orang yang kita pekerjakan dapat dipercaya."
  },
  "6.2": {
    name: "Syarat dan ketentuan pekerjaan",
    description: "Syarat dan ketentuan pekerjaan harus menyatakan tanggung jawab personel dan organisasi untuk keamanan informasi sejak awal pekerjaan.",
    analogy: "Seperti kontrak sewa yang menyebutkan aturan penggunaan properti, kontrak kerja harus menyebutkan kewajiban keamanan informasi."
  },
  "6.3": {
    name: "Kesadaran keamanan informasi, pelatihan, dan pendidikan",
    description: "Personel dan pihak berkepentingan terkait harus menerima kesadaran keamanan informasi, pelatihan, dan pendidikan yang sesuai dengan peran dan tanggung jawab mereka.",
    analogy: "Seperti pelatihan pemadaman api yang mempersiapkan karyawan menghadapi kebakaran, pelatihan keamanan mempersiapkan mereka menghadapi ancaman siber."
  },
  "6.4": {
    name: "Proses disipliner",
    description: "Proses disipliner harus ada untuk mengambil tindakan terhadap personel dan pihak berkepentingan lainnya yang telah melakukan pelanggaran keamanan informasi.",
    analogy: "Layaknya tilang untuk pelanggar lalu lintas, proses disipliner memberi konsekuensi bagi yang melanggar aturan keamanan."
  },
  "6.5": {
    name: "Tanggung jawab setelah penghentian atau perubahan pekerjaan",
    description: "Tanggung jawab dan kewajiban keamanan informasi yang berlaku setelah penghentian atau perubahan pekerjaan harus didefinisikan, ditegakkan, dan dikomunikasikan kepada personel.",
    analogy: "Seperti kewajiban menjaga rahasia perusahaan meskipun sudah resign, tanggung jawab keamanan tidak berakhir saat karyawan keluar."
  },
  "6.6": {
    name: "Perjanjian kerahasiaan atau non-disclosure",
    description: "Persyaratan kerahasiaan atau non-disclosure yang mencerminkan kebutuhan organisasi untuk perlindungan informasi harus diidentifikasi, didokumentasikan, dan ditinjau secara berkala.",
    analogy: "Seperti janji untuk tidak membocorkan resep rahasia restoran, NDA melindungi informasi sensitif dari kebocoran."
  },
  "6.7": {
    name: "Kerja jarak jauh",
    description: "Kebijakan dan prosedur harus ditetapkan untuk mendukung kerja jarak jauh dan melindungi aset organisasi di luar lokasi fisik organisasi.",
    analogy: "Layaknya membawa brankas mini saat kerja di cafe, kerja remote membutuhkan perlindungan ekstra untuk data perusahaan."
  },
  "6.8": {
    name: "Pelaporan kejadian keamanan informasi",
    description: "Organisasi harus menyediakan mekanisme bagi personel untuk melaporkan kejadian atau kelemahan keamanan informasi yang diamati melalui saluran yang tepat.",
    analogy: "Seperti nomor darurat 112 yang mudah dihubungi, mekanisme pelaporan keamanan harus mudah diakses oleh semua karyawan."
  },

  // Theme 7: Physical Controls (7.1 - 7.14)
  "7.1": {
    name: "Batas keamanan fisik",
    description: "Batas keamanan fisik harus didefinisikan dan digunakan untuk melindungi area yang berisi informasi dan aset lainnya dari ancaman fisik, lingkungan, dan bahaya lainnya.",
    analogy: "Seperti pagar pabrik yang membatasi siapa yang boleh masuk, batas fisik melindungi aset dari akses yang tidak berwenang."
  },
  "7.2": {
    name: "Entri fisik",
    description: "Area keamanan harus dilindungi oleh kontrol akses yang sesuai dan titik entri fisik harus diamankan.",
    analogy: "Layaknya security di gedung yang mengecek ID sebelum mengizinkan masuk, kontrol akses fisik menyaring siapa yang boleh masuk."
  },
  "7.3": {
    name: "Mengamankan kantor, ruangan, dan fasilitas",
    description: "Keamanan fisik untuk kantor, ruangan, dan fasilitas harus dirancang dan diimplementasikan sesuai dengan risiko keamanan yang relevan.",
    analogy: "Seperti rumah yang punya gembok, alarm, dan pagar, kantor juga butuh lapisan keamanan yang sesuai ancaman."
  },
  "7.4": {
    name: "Pemantauan keamanan fisik",
    description: "Premis organisasi harus dipantau secara terus-menerus untuk mendeteksi akses fisik yang tidak sah dan aktivitas yang mencurigakan.",
    analogy: "Layaknya satpam yang patroli keliling area, pemantauan kontinu mendeteksi ancaman sebelum mereka bertindak."
  },
  "7.5": {
    name: "Perlindungan terhadap ancaman fisik dan lingkungan",
    description: "Perlindungan harus dirancang dan diimplementasikan terhadap ancaman fisik dan lingkungan seperti bencana alam, sabotase, dan serangan yang disengaja.",
    analogy: "Seperti bangunan tahan gempa di zona rawan, fasilitas harus dilindungi dari ancaman lingkungan dan fisik."
  },
  "7.6": {
    name: "Bekerja di area aman",
    description: "Personel dan kontraktor harus mematuhi persyaratan keamanan saat bekerja di area aman organisasi.",
    analogy: "Layaknya aturan steril di ruang operasi rumah sakit, area aman punya persyaratan khusus yang harus dipatuhi semua orang."
  },
  "7.7": {
    name: "Dukungan utilitas",
    description: "Utilitas pendukung seperti listrik, telekomunikasi, air, dan gas harus tersedia dan dilindungi sesuai dengan persyaratan keamanan.",
    analogy: "Seperti generator cadangan yang siap saat listrik PLN mati, utilitas harus punya backup untuk menjaga operasional."
  },
  "7.8": {
    name: "Pemeliharaan peralatan",
    description: "Peralatan harus dipelihara secara berkala untuk memastikan ketersediaan, integritas, dan keamanan operasional yang berkelanjutan.",
    analogy: "Layaknya servis mobil berkala yang mencegah mogok di jalan, pemeliharaan peralatan mencegah kegagalan sistem."
  },
  "7.9": {
    name: "Keamanan aset di luar lokasi",
    description: "Aset yang berada di luar lokasi organisasi harus dilindungi dengan kontrol keamanan yang sesuai.",
    analogy: "Seperti asuransi dan GPS tracker untuk laptop yang dibawa travel, aset di luar kantor tetap butuh perlindungan."
  },
  "7.10": {
    name: "Media penyimpanan yang dapat dihapus dan media transmisi",
    description: "Media yang dapat dihapus dan media transmisi harus diamankan dari akses tidak sah, penyalahgunaan, atau pencurian.",
    analogy: "Layaknya dokumen rahasia yang harus dihancurkan sebelum dibuang, media penyimpanan perlu diamankan atau dimusnahkan dengan benar."
  },
  "7.11": {
    name: "Dukungan untuk rencana darurat",
    description: "Rencana darurat harus didukung oleh fasilitas dan utilitas yang memadai untuk memastikan kelangsungan operasional.",
    analogy: "Seperti jalur evakuasi dan assembly point yang siap pakai, rencana darurat butuh infrastruktur yang mendukung."
  },
  "7.12": {
    name: "Kabel dan daya",
    description: "Kabel untuk daya dan telekomunikasi harus diamankan dari gangguan, penyadapan, atau kerusakan yang disengaja atau tidak sengaja.",
    analogy: "Layaknya kabel listrik yang ditanam dalam tembok agar tidak digigit tikus, kabel data juga harus dilindungi."
  },
  "7.13": {
    name: "Pemeliharaan dan inspeksi fasilitas",
    description: "Fasilitas harus dipelihara dan diperiksa secara berkala untuk memastikan integritas dan keamanan fisik yang berkelanjutan.",
    analogy: "Seperti inspeksi gedung tahunan yang memastikan struktur masih kuat, pemeriksaan fasilitas memastikan keamanan tetap terjaga."
  },
  "7.14": {
    name: "Keamanan fisik saat penghentian atau relokasi",
    description: "Keamanan fisik harus dipertahankan saat penghentian atau relokasi fasilitas dan aset organisasi.",
    analogy: "Layaknya pindah rumah yang butuh pengawasan ekstra, relokasi kantor juga butuh pengamanan ketat."
  },

  // Theme 8: Technological Controls (8.1 - 8.42)
  "8.1": {
    name: "Perangkat pengguna akhir",
    description: "Informasi yang disimpan, diproses, atau diakses oleh perangkat pengguna akhir harus dilindungi sesuai dengan klasifikasi informasi dan persyaratan keamanan.",
    analogy: "Seperti smartphone yang punya PIN, enkripsi, dan remote wipe, perangkat endpoint harus punya perlindungan berlapis."
  },
  "8.2": {
    name: "Hak istimewa akses",
    description: "Alokasi dan penggunaan hak istimewa akses harus dibatasi dan dikelola untuk mengurangi risiko keamanan informasi.",
    analogy: "Layaknya kunci master yang hanya dipegang kepala security, hak admin harus dibatasi agar tidak disalahgunakan."
  },
  "8.3": {
    name: "Pembatasan akses informasi",
    description: "Akses ke informasi dan aset lainnya harus dibatasi sesuai dengan kebijakan manajemen akses dan klasifikasi informasi.",
    analogy: "Seperti VIP lounge yang hanya untuk tamu undangan, informasi sensitif hanya boleh diakses yang berwenang."
  },
  "8.4": {
    name: "Akses ke kode sumber",
    description: "Akses baca ke kode sumber, skrip, atau file konfigurasi harus dibatasi untuk mencegah modifikasi yang tidak sah.",
    analogy: "Layaknya resep rahasia Coca-Cola yang hanya diketahui beberapa orang, kode sumber harus dibatasi aksesnya."
  },
  "8.5": {
    name: "Autentikasi aman",
    description: "Mekanisme autentikasi yang aman harus diimplementasikan untuk memverifikasi identitas pengguna dan perangkat yang mengakses sistem informasi.",
    analogy: "Seperti sidik jari yang unik untuk setiap orang, autentikasi memastikan hanya identitas valid yang bisa masuk."
  },
  "8.6": {
    name: "Manajemen kapasitas",
    description: "Penggunaan sumber daya sistem harus dipantau dan dianalisis untuk memastikan kapasitas yang memadai dan mengidentifikasi potensi bottleneck.",
    analogy: "Layaknya monitoring lalu lintas untuk prediksi kemacetan, manajemen kapasitas mengantisipasi beban sistem sebelum overload."
  },
  "8.7": {
    name: "Proteksi terhadap malware",
    description: "Perlindungan terhadap malware harus diimplementasikan dan didukung oleh kesadaran pengguna, deteksi, pencegahan, dan pemulihan.",
    analogy: "Seperti sistem kekebalan tubuh yang melawan virus, proteksi malware melindungi sistem dari ancaman perangkat lunak berbahaya."
  },
  "8.8": {
    name: "Manajemen kerentanan teknis",
    description: "Kerentanan teknis dari aset informasi harus dikelola melalui identifikasi, penilaian risiko, dan pengobatan yang tepat.",
    analogy: "Layaknya体检 kesehatan yang menemukan masalah sebelum parah, manajemen kerentanan menemukan kelemahan sebelum dieksploitasi."
  },
  "8.9": {
    name: "Konfigurasi perangkat keras",
    description: "Konfigurasi perangkat keras harus diamankan dan dikelola sesuai dengan kebijakan keamanan informasi organisasi.",
    analogy: "Seperti setting pabrik yang optimal untuk perangkat elektronik, konfigurasi hardware harus distandarkan dan diamankan."
  },
  "8.10": {
    name: "Penghapusan informasi",
    description: "Informasi yang disimpan dalam sistem informasi dan penyimpanan harus dihapus dengan aman ketika sudah tidak dibutuhkan lagi.",
    analogy: "Layaknya dokumen rahasia yang harus dihancurkan dengan shredder, penghapusan data harus dilakukan secara aman."
  },
  "8.11": {
    name: "Masking data",
    description: "Data harus ditutup atau disembunyikan sesuai dengan kebijakan klasifikasi informasi dan persyaratan akses.",
    analogy: "Seperti nomor KTP yang ditampilkan sebagian saja (XXX-XXX-1234), masking data menyembunyikan informasi sensitif."
  },
  "8.12": {
    name: "Pencegahan kebocoran data",
    description: "Mekanisme pencegahan kebocoran data harus diimplementasikan untuk mendeteksi dan mencegah transmisi informasi yang tidak sah.",
    analogy: "Layaknya alarm di toko yang berbunyi jika barang dibawa keluar tanpa bayar, DLP mendeteksi data yang keluar tanpa izin."
  },
  "8.13": {
    name: "Pencadangan informasi",
    description: "Salinan cadangan informasi, perangkat lunak, dan sistem harus dipelihara dan diuji secara berkala sesuai dengan kebijakan pencadangan.",
    analogy: "Seperti ban cadangan yang siap digunakan saat ban utama bocor, backup memastikan data bisa dipulihkan saat terjadi masalah."
  },
  "8.14": {
    name: "Keberagaman fasilitas pemrosesan informasi",
    description: "Fasilitas pemrosesan informasi harus memiliki tingkat keberagaman dan redundansi yang cukup untuk memenuhi persyaratan ketersediaan.",
    analogy: "Layaknya punya dua generator yang bisa saling backup, redundansi memastikan sistem tetap berjalan walau satu komponen gagal."
  },
  "8.15": {
    name: "Pencatatan log (Logging)",
    description: "Log aktivitas harus dihasilkan, disimpan, dilindungi, dan ditinjau secara berkala untuk mendeteksi kejadian dan perilaku yang mencurigakan.",
    analogy: "Seperti black box pesawat yang merekam semua aktivitas, log mencatat setiap kejadian untuk investigasi jika terjadi masalah."
  },
  "8.16": {
    name: "Aktivitas pemantauan",
    description: "Jaringan, sistem, dan aplikasi harus dipantau untuk mendeteksi anomali dan potensi insiden keamanan informasi.",
    analogy: "Layaknya CCTV yang monitor area 24/7, pemantauan aktivitas mendeteksi keanehan sebelum jadi insiden besar."
  },
  "8.17": {
    name: "Sinkronisasi jam",
    description: "Jam semua sistem pemrosesan informasi yang relevan harus disinkronisasi dengan sumber waktu yang terpercaya untuk mendukung analisis log.",
    analogy: "Seperti semua jam di bandara harus sinkron untuk jadwal penerbangan, waktu sistem harus konsisten untuk analisis yang akurat."
  },
  "8.18": {
    name: "Penggunaan program utilitas",
    description: "Penggunaan program utilitas yang dapat mengabaikan kontrol sistem harus dibatasi dan diamankan untuk mencegah penyalahgunaan.",
    analogy: "Layaknya kunci inggris yang bisa membongkar apa saja tapi hanya untuk teknisi resmi, program utilitas harus dikontrol ketat."
  },
  "8.19": {
    name: "Instalasi perangkat lunak pada sistem operasional",
    description: "Prosedur harus ditetapkan untuk menginstalasi perangkat lunak pada sistem operasional tanpa mengganggu operasional bisnis.",
    analogy: "Seperti renovasi rumah yang tidak boleh mengganggu penghuni, instalasi software harus dilakukan tanpa ganggu operasional."
  },
  "8.20": {
    name: "Jaringan dan keamanan",
    description: "Jaringan harus diamankan, dikelola, dan dipantau untuk mencegah akses tidak sah dan memastikan integritas data.",
    analogy: "Layaknya jalan tol yang punya gerbang, rambu, dan patrol keamanan, jaringan butuh perlindungan berlapis."
  },
  "8.21": {
    name: "Keamanan layanan jaringan",
    description: "Mekanisme keamanan, tingkat layanan, dan persyaratan layanan harus diidentifikasi dan diimplementasikan untuk semua layanan jaringan.",
    analogy: "Seperti standar pelayanan bank yang harus aman dan cepat, layanan jaringan juga butuh SLA keamanan yang jelas."
  },
  "8.22": {
    name: "Pemisahan jaringan",
    description: "Jaringan harus dipisahkan untuk mengurangi risiko penyebaran insiden keamanan dan melindungi area jaringan yang sensitif.",
    analogy: "Layaknya sekat kapal yang mencegah kebocoran menyebar ke seluruh kapal, segmentasi jaringan membatasi penyebaran serangan."
  },
  "8.23": {
    name: "Penapisan web (Web filtering)",
    description: "Penapisan web harus diterapkan untuk mencegah akses ke situs web berbahaya dan mengurangi risiko serangan berbasis web.",
    analogy: "Seperti saringan air yang membuang kotoran, web filter menyaring situs berbahaya sebelum diakses karyawan."
  },
  "8.24": {
    name: "Keamanan pengembangan aplikasi",
    description: "Kontrol keamanan harus diintegrasikan ke dalam siklus hidup pengembangan aplikasi dari tahap perencanaan hingga implementasi.",
    analogy: "Layaknya insinyur yang menghitung keamanan bangunan dari desain, keamanan aplikasi harus dimulai dari awal pengembangan."
  },
  "8.25": {
    name: "Prinsip rekayasa sistem aman",
    description: "Prinsip rekayasa sistem aman harus diterapkan dalam pengembangan dan implementasi sistem informasi organisasi.",
    analogy: "Seperti arsitek yang mendesain bangunan tahan gempa, engineer sistem harus membangun dengan prinsip keamanan."
  },
  "8.26": {
    name: "Persyaratan keamanan aplikasi",
    description: "Persyaratan keamanan informasi harus diidentifikasi dan ditentukan untuk setiap aplikasi berdasarkan klasifikasi informasi.",
    analogy: "Layaknya spesifikasi mobil yang berbeda untuk city car vs SUV, kebutuhan keamanan aplikasi berbeda berdasarkan sensitivitas data."
  },
  "8.27": {
    name: "Pengkodean aman (Secure coding)",
    description: "Prinsip dan praktik pengkodean aman harus diterapkan dalam pengembangan aplikasi untuk mengurangi kerentanan keamanan.",
    analogy: "Seperti tukang las yang mengikuti standar keamanan untuk mencegah kebocoran, developer harus coding aman untuk mencegah bug."
  },
  "8.28": {
    name: "Pengujian keamanan dalam pengembangan",
    description: "Proses pengujian keamanan harus diterapkan dalam siklus hidup pengembangan untuk mengidentifikasi dan memperbaiki kerentanan.",
    analogy: "Layaknya uji crash test mobil sebelum dijual, aplikasi harus diuji keamanannya sebelum dirilis."
  },
  "8.29": {
    name: "Pengujian keamanan sistem",
    description: "Pengujian keamanan harus dilakukan pada sistem yang telah dikembangkan untuk memverifikasi efektivitas kontrol keamanan.",
    analogy: "Seperti ujian akhir yang menguji pemahaman siswa, testing sistem memverifikasi apakah kontrol keamanan sudah efektif."
  },
  "8.30": {
    name: "Pengembangan outsourcing",
    description: "Persyaratan keamanan informasi harus diidentifikasi dan diawasi dalam pengembangan yang di-outsource kepada pihak ketiga.",
    analogy: "Layaknya Anda tetap mengawasi kontraktor yang membangun rumah, outsourcing development tetap butuh pengawasan keamanan."
  },
  "8.31": {
    name: "Pemisahan lingkungan pengembangan, pengujian, dan produksi",
    description: "Lingkungan pengembangan, pengujian, dan produksi harus dipisahkan untuk mengurangi risiko gangguan operasional dan akses tidak sah.",
    analogy: "Seperti dapur restoran yang terpisah dari area makan, environment development dan production harus dipisahkan."
  },
  "8.32": {
    name: "Manajemen perubahan",
    description: "Perubahan pada aset informasi, fasilitas pemrosesan data, dan layanan harus dikelola dan dikendalikan melalui proses perubahan yang terstruktur.",
    analogy: "Layaknya proses persetujuan renovasi di apartemen yang harus melalui manajemen, perubahan sistem butuh approval terkontrol."
  },
  "8.33": {
    name: "Informasi manajemen proyek",
    description: "Manajemen informasi proyek harus diterapkan untuk memastikan keamanan informasi selama siklus hidup proyek.",
    analogy: "Seperti manajer proyek yang mengawasi timeline dan budget, manajemen informasi proyek mengawasi aspek keamanan."
  },
  "8.34": {
    name: "Perlindungan sistem informasi selama pengujian audit",
    description: "Sistem informasi harus dilindungi selama pengujian audit dan kegiatan verifikasi keamanan lainnya.",
    analogy: "Layaknya sampel makanan yang diuji di lab tanpa mencemari stok utama, audit harus dilakukan tanpa risiko ke sistem produksi."
  },
  "8.35": {
    name: "Teknik untuk masking data dalam pengujian",
    description: "Teknik masking data harus digunakan untuk melindungi informasi sensitif selama pengujian dan pengembangan aplikasi.",
    analogy: "Seperti aktor pengganti yang memakai data fiksi untuk adegan berbahaya, data testing harus pakai data yang sudah di-mask."
  },
  "8.36": {
    name: "Pengelolaan kerahasiaan data pengujian",
    description: "Data pengujian harus dikelola dan dilindungi sesuai dengan persyaratan kerahasiaan dan klasifikasi informasi.",
    analogy: "Layaknya naskah film yang dirahasiakan sebelum rilis, data testing juga harus dijaga kerahasiaannya."
  },
  "8.37": {
    name: "Integrasi sistem dan keamanan",
    description: "Integrasi sistem harus mempertimbangkan persyaratan keamanan informasi dan kontrol akses antar sistem.",
    analogy: "Seperti menghubungkan dua jaringan kereta yang butuh standar sinyal yang sama, integrasi sistem butuh standar keamanan yang konsisten."
  },
  "8.38": {
    name: "Pengujian sistem keamanan setelah perubahan",
    description: "Sistem keamanan harus diuji setelah perubahan signifikan untuk memastikan kontrol keamanan tetap efektif.",
    analogy: "Layaknya inspeksi bangunan setelah renovasi, testing keamanan setelah perubahan memastikan tidak ada celah baru."
  },
  "8.39": {
    name: "Keamanan dalam lingkungan virtual",
    description: "Keamanan dalam lingkungan virtual harus dikelola sesuai dengan persyaratan keamanan informasi organisasi.",
    analogy: "Seperti dunia virtual yang tetap butuh aturan walau tidak fisik, lingkungan virtual juga perlu pengamanan."
  },
  "8.40": {
    name: "Keamanan otomatisasi",
    description: "Keamanan dalam otomatisasi proses dan sistem harus diimplementasikan untuk mengurangi risiko kesalahan manusia.",
    analogy: "Layaknya pilot otomatis pesawat yang mengurangi human error, otomatisasi keamanan mengurangi risiko kesalahan manual."
  },
  "8.41": {
    name: "Keamanan dalam lingkungan cloud",
    description: "Keamanan dalam lingkungan cloud harus dikelola sesuai dengan persyaratan keamanan dan kepatuhan organisasi.",
    analogy: "Seperti menyewa apartemen yang aturannya berbeda dengan rumah pribadi, cloud environment punya model keamanan yang berbeda."
  },
  "8.42": {
    name: "Manajemen konfigurasi",
    description: "Konfigurasi keamanan untuk perangkat keras, perangkat lunak, layanan, dan jaringan harus ditetapkan, didokumentasikan, diimplementasikan, dipantau, dan ditinjau.",
    analogy: "Layaknya setting pabrik yang distandarkan untuk semua produk, manajemen konfigurasi memastikan semua sistem punya baseline keamanan yang konsisten."
  }
};

// Apply translations to both files
['./data/iso27001.json', './public/data/iso27001.json'].forEach(filePath => {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  data.forEach(control => {
    const id = control.id;
    if (translations[id]) {
      control.name = translations[id].name;
      control.description = translations[id].description;
      control.analogy = translations[id].analogy;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Updated: ${filePath}`);
});

console.log('\n✓ Translation completed for', Object.keys(translations).length, 'controls');
console.log('✓ Both data/iso27001.json and public/data/iso27001.json have been updated');
