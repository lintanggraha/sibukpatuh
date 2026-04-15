import fs from 'fs';

// ===== ISO 27001: Educational-style descriptions =====
const isoDescriptions = {
  "5.1": "Pastikan organisasi punya dokumen resmi yang menjelaskan bagaimana keamanan informasi dijalankan. Dokumen ini perlu mendapat persetujuan pimpinan, dibagikan ke seluruh tim, dan rutin dicek agar tetap relevan dengan perkembangan bisnis.",
  "5.2": "Jelaskan dengan jelas siapa yang bertanggung jawab atas aspek keamanan apa. Setiap peran harus punya tugas spesifik yang tercatat rapi, sehingga tidak ada tumpang tindih atau celah tanggung jawab.",
  "5.3": "Pisahkan tugas-tugas yang jika dipegang satu orang bisa berpotensi konflik kepentingan. Misalnya, orang yang membuat sistem tidak boleh sama dengan yang memverifikasi keamanannya. Ini membantu mencegah penyalahgunaan wewenang.",
  "5.4": "Pimpinan organisasi harus aktif memastikan bahwa semua karyawan mengikuti aturan keamanan yang sudah ditetapkan. Bukan cuma bikin aturan, tapi juga menagih implementasinya secara konsisten.",
  "5.5": "Siapkan daftar kontak penting seperti BSSN, kepolisian (unit cybercrime), atau lembaga regulator terkait. Hubungan baik ini sangat berguna saat organisasi membutuhkan bantuan atau pelaporan insiden.",
  "5.6": "Bergabunglah dengan komunitas profesional keamanan siber seperti ID-SIRTII atau forum CISO Indonesia. Dari sini, tim bisa mendapat update ancaman terbaru dan berbagi pengalaman dengan praktisi lain.",
  "5.7": "Kumpulkan informasi tentang ancaman siber yang sedang aktif, lalu analisis dampaknya untuk organisasi. Intelijen ancaman membantu tim bersiap sebelum serangan benar-benar terjadi.",
  "5.8": "Setiap proyek—apapun jenisnya—harus memasukkan aspek keamanan informasi sejak perencanaan. Jangan tunggu sampai proyek selesai baru memikirkan keamanan.",
  "5.9": "Buat daftar lengkap semua aset informasi yang dimiliki: laptop, server, database, aplikasi, bahkan data di cloud. Setiap aset harus jelas pemiliknya dan nilai bisnisnya.",
  "5.10": "Buat aturan yang jelas tentang bagaimana karyawan boleh menggunakan aset IT perusahaan. Misalnya, laptop kantor boleh dipakai kerja remote, tapi tidak untuk mining cryptocurrency.",
  "5.11": "Saat karyawan resign atau pindah divisi, pastikan semua aset yang dipinjamkan—laptop, akses sistem, ID card—dikembalikan. Buat checklist yang terintegrasi dengan proses HR.",
  "5.12": "Klasifikasikan data berdasarkan sensitivitasnya: mana yang boleh publik, mana yang internal, mana yang confidential. Klasifikasi ini jadi dasar untuk menentukan level perlindungan.",
  "5.13": "Beri label atau tanda pada setiap dokumen atau file sesuai klasifikasinya. Label ini mengingatkan siapa saja yang menangani tentang level kehati-hatian yang dibutuhkan.",
  "5.14": "Saat mengirim data—entah via email, USB, atau cloud—gunakan metode yang aman sesuai dengan tingkat sensitivitas data. Data rahasia jangan dikirim lewat email biasa tanpa enkripsi.",
  "5.15": "Atur siapa saja yang boleh mengakses informasi dan aset tertentu. Prinsipnya: berikan akses hanya sejauh yang dibutuhkan untuk menjalankan tugas (least privilege).",
  "5.16": "Kelola identitas digital karyawan dari awal masuk sampai keluar perusahaan. Termasuk pembuatan akun, perubahan role, dan penghapusan akses saat resign.",
  "5.17": "Kelola informasi autentikasi seperti password, token, atau sertifikat digital dengan ketat. Wajibkan penggunaan password yang kuat dan multi-factor authentication untuk sistem-sistem kritis.",
  "5.18": "Tentukan hak akses setiap user berdasarkan jabatannya, dan rutin review apakah akses tersebut masih sesuai. Cabut akses yang sudah tidak diperlukan atau saat user pindah peran.",
  "5.19": "Evaluasi risiko keamanan yang mungkin timbul dari kerja sama dengan vendor atau pemasok. Pastikan kontrak mencantumkan kewajiban keamanan dan hak audit.",
  "5.20": "Saat menggunakan layanan cloud, pahami model tanggung jawab bersama (shared responsibility). Konfigurasi security setting dengan benar dan monitor aktivitas cloud secara rutin.",
  "5.21": "Pantau keamanan di sepanjang rantai pasokan TI. Jika ada vendor yang menjadi titik lemah, risiko itu bisa menjalar ke organisasi. Diversifikasi vendor untuk mengurangi risiko.",
  "5.22": "Rutin periksa apakah implementasi keamanan sudah sesuai dengan kebijakan dan standar yang ditetapkan. Buat checklist compliance dan track progress remediasi temuan.",
  "5.23": "Aktif berbagi informasi ancaman dengan organisasi lain melalui forum atau ISAC. Kolaborasi ini membantu semua pihak lebih siap menghadapi ancaman yang sama.",
  "5.24": "Siapkan rencana keamanan informasi yang mendukung kelangsungan bisnis saat krisis. Identifikasi proses-proses kritis dan tentukan berapa lama sistem boleh down.",
  "5.25": "Identifikasi semua kewajiban hukum dan regulasi yang berlaku untuk organisasi, seperti UU PDP atau ketentuan OJK. Buat matriks compliance dan assign PIC untuk setiap requirement.",
  "5.26": "Pantau terus perubahan regulasi yang berdampak pada keamanan informasi. Subscribe newsletter BSSN, OJK, atau konsultan hukum untuk tetap update.",
  "5.27": "Lindungi dokumen-dokumen penting dari penghapusan atau modifikasi yang tidak sah. Tentukan berapa lama dokumen harus disimpan dan bagaimana cara memusnahkannya dengan aman.",
  "5.28": "Identifikasi data pribadi yang dikelola organisasi dan pastikan perlindungannya sesuai hukum privasi yang berlaku. Tunjuk DPO jika volume data pribadi yang diproses besar.",
  "5.29": "Ajak pihak independen untuk meninjau efektivitas program keamanan informasi secara berkala. Audit eksternal memberikan perspektif objektif yang mungkin terlewat tim internal.",
  "5.30": "Integrasikan persyaratan keamanan ke dalam proses pengembangan sistem TI. Lakukan threat modeling dan security review sebelum fitur baru dirilis.",
  "5.31": "Pastikan semua aspek legal dari implementasi keamanan sudah dikonsultasikan dengan tim hukum. Termasuk klausul kontrak dengan vendor dan kebijakan internal yang berdampak ke karyawan.",
  "5.32": "Kelola lisensi software dan hak kekayaan intelektual dengan rapi. Gunakan tools untuk tracking usage dan pastikan tidak ada software bajakan yang terinstall.",
  "5.33": "Lindungi rekaman-rekaman penting seperti log sistem, CCTV, atau backup data dari akses atau modifikasi yang tidak sah. Simpan di tempat yang aman dan terkontrol.",
  "5.34": "Pastikan privasi dan perlindungan data pribadi (PII) diimplementasikan sesuai regulasi. Buat prosedur untuk menangani request data subject seperti hak akses atau penghapusan.",
  "5.35": "Lakukan penilaian independen terhadap maturity program keamanan informasi. Gunakan assessor bersertifikasi untuk mendapatkan evaluasi yang kredibel.",
  "5.36": "Monitor kepatuhan terhadap kebijakan keamanan secara berkala. Buat metrics yang mudah dipahami management dan report progress secara rutin.",
  "5.37": "Kelola dokumentasi keamanan dengan sistem version control yang rapi. Pastikan dokumen yang digunakan tim selalu versi terbaru dan sudah diapprove.",

  "6.1": "Lakukan pengecekan latar belakang kandidat karyawan sesuai dengan hukum yang berlaku. Cek identitas, pendidikan, dan riwayat kerja. Untuk posisi yang menangani data sensitif, pertimbangkan pengecekan lebih mendalam.",
  "6.2": "Cantumkan kewajiban keamanan informasi dalam kontrak kerja. Karyawan harus tahu sejak hari pertama bahwa mereka bertanggung jawab menjaga kerahasiaan dan keamanan data perusahaan.",
  "6.3": "Adakan program pelatihan keamanan yang berlapis: training onboarding untuk karyawan baru, newsletter bulanan, refreshment tahunan, dan simulasi phishing untuk menguji kewaspadaan.",
  "6.4": "Buat mekanisme sanksi yang jelas untuk pelanggaran keamanan, mulai dari peringatan lisan hingga tindakan disipliner berat. Sosialisasikan konsekuensi ini agar karyawan paham risikonya.",
  "6.5": "Ingatkan karyawan yang akan resign tentang kewajiban kerahasiaan yang tetap berlaku meski sudah tidak bekerja di perusahaan. Untuk posisi kritis, pertimbangkan garden leave.",
  "6.6": "Minta tanda tangan perjanjian kerahasiaan (NDA) dari semua pihak yang akan mengakses informasi sensitif: karyawan, kontraktor, bahkan visitor yang masuk ke area terbatas.",
  "6.7": "Buat kebijakan khusus untuk kerja remote yang mencakup kewajiban menggunakan VPN, larangan akses dari WiFi publik, dan panduan setup keamanan di rumah.",
  "6.8": "Sediakan saluran pelaporan insiden yang mudah diakses: email khusus, hotline, atau sistem ticketing. Pastikan karyawan tidak ragu melapor karena prosesnya tidak menghakimi.",

  "7.1": "Tentukan batas fisik area yang perlu dilindungi: pagar gedung, dinding ruang server, atau barrier lainnya. Pastikan tidak ada celah yang bisa dilewati tanpa terdeteksi.",
  "7.2": "Pasang sistem kontrol akses di semua pintu masuk: access card, biometric, atau security guard. Catat semua pengunjung dan pastikan mereka didampingi saat masuk area sensitif.",
  "7.3": "Perkuat keamanan fisik kantor dan ruang-ruang penting: kunci pintu yang aman, alarm, dan reinforcement untuk dinding atau jendela di area kritis.",
  "7.4": "Install CCTV di titik-titik strategis: pintu masuk, koridor, ruang server, dan area parkir. Pastikan rekaman tersimpan minimal 30 hari dan dimonitor secara real-time.",
  "7.5": "Identifikasi risiko lingkungan seperti banjir, gempa, atau kebakaran. Pasang fire suppression, water detection, dan lightning arrester sesuai dengan ancaman yang relevan.",
  "7.6": "Terapkan aturan ketat untuk siapa saja yang bekerja di area aman: wajib badge, dilarang bawa device pribadi, dilarang foto. Audit kepatuhan secara berkala.",
  "7.7": "Pastikan utility pendukung seperti listrik, air, internet, dan AC selalu tersedia. Setup redundancy untuk utility kritis: UPS, generator, atau dual ISP.",
  "7.8": "Jadwalkan perawatan rutin untuk semua peralatan keamanan: CCTV, access control, fire suppression. Track maintenance log dan gunakan vendor yang terpercaya.",
  "7.9": "Untuk aset yang dibawa keluar kantor, wajibkan enkripsi dan policy security yang jelas. Track lokasi device mobile dengan GPS jika memungkinkan.",
  "7.10": "Batasi penggunaan media penyimpanan eksternal seperti USB flash drive. Jika memang diperlukan, wajibkan enkripsi dan buat prosedur disposal yang aman.",
  "7.11": "Buat rencana tanggap darurat yang mencakup jalur evakuasi, assembly point, dan kontak darurat. Lakukan drill minimal 2 kali setahun untuk memastikan kesiapan.",
  "7.12": "Lindungi kabel power dan data dari gangguan atau penyadapan: gunakan conduit, raised floor, atau cable tray yang terkunci. Install surge protector untuk perlindungan ekstra.",
  "7.13": "Inspeksi fasilitas secara berkala: cek integritas struktur, sistem keamanan api, dan fungsi access control. Track temuan dan pastikan remediasi dilakukan tepat waktu.",
  "7.14": "Saat relokasi kantor atau peralatan, buat plan yang mencakup packing aman, transportasi dengan kendaraan secure, dan setup security di lokasi baru tanpa downtime.",

  "8.1": "Proteksi semua device pengguna akhir—laptop, HP, tablet—dengan EDR (Endpoint Detection & Response). Wajibkan full disk encryption dan remote wipe capability.",
  "8.2": "Kelola akun-akun dengan hak istimewa (admin, root) dengan ketat. Gunakan PAM (Privileged Access Management) solution dan wajibkan approval untuk setiap penggunaan.",
  "8.3": "Batasi akses informasi berdasarkan prinsip need-to-know. Review permission secara berkala dan hapus akses default atau guest yang tidak diperlukan.",
  "8.4": "Batasi akses ke source code hanya untuk developer yang berwenang. Gunakan version control dengan branch protection dan wajibkan code review sebelum merge.",
  "8.5": "Implementasi mekanisme autentikasi yang kuat: MFA untuk semua sistem, password policy yang ketat, dan monitoring failed login attempt untuk deteksi brute force.",
  "8.6": "Monitor penggunaan resource sistem—CPU, memory, disk, network—dan setup alerting jika mendekati kapasitas penuh. Buat capacity plan untuk 6-12 bulan ke depan.",
  "8.7": "Pasang antivirus/anti-malware di semua endpoint dan server. Update signature secara harian, enable real-time scanning, dan educate user tentang bahaya klik link mencurigakan.",
  "8.8": "Jalankan vulnerability scan secara rutin (minimal bulanan) untuk semua sistem. Prioritaskan remediasi berdasarkan risk score dan patch critical vulnerability dalam 7 hari.",
  "8.9": "Buat baseline konfigurasi untuk semua perangkat keras. Disable service dan port yang tidak diperlukan, dokumentasikan konfigurasi, dan audit secara berkala.",
  "8.10": "Buat prosedur penghapusan data yang aman: overwrite untuk HDD, crypto-shred untuk SSD. Gunakan vendor tersertifikasi untuk disposal media dalam jumlah besar.",
  "8.11": "Implementasi data masking untuk menyembunyikan informasi sensitif: gunakan teknik scramble atau substitute untuk data testing, dan dynamic data masking untuk query production.",
  "8.12": "Deploy solusi DLP (Data Leak Prevention) untuk mendeteksi dan mencegah transfer data yang tidak sah. Monitor email, upload web, dan transfer USB untuk mendeteksi pelanggaran.",
  "8.13": "Backup data secara rutin mengikuti aturan 3-2-1: 3 copies, 2 jenis media, 1 offsite. Test restore quarterly untuk memastikan backup bisa dipulihkan.",
  "8.14": "Setup redundant server di lokasi berbeda dan implementasi load balancing. Test failover secara berkala dan pastikan RPO/RTO sesuai kebutuhan bisnis.",
  "8.15": "Enable logging untuk semua sistem kritis dan centralize ke SIEM. Retain log minimal 1 tahun dan monitor secara harian untuk mendeteksi anomali.",
  "8.16": "Monitor aktivitas sistem dan jaringan untuk mendeteksi perilaku mencurigakan: login di waktu tidak biasa, akses data dalam volume tinggi, atau privilege escalation.",
  "8.17": "Sinkronisasi jam semua sistem ke NTP server yang sama dan terpercaya. Ini penting untuk analisis log yang akurat dan korelasi event dari berbagai sumber.",
  "8.18": "Batasi penggunaan program utilitas yang bisa bypass kontrol keamanan. Inventory semua utility, batasi akses ke admin saja, dan log setiap penggunaan.",
  "8.19": "Implementasi software whitelisting untuk mengontrol aplikasi yang boleh diinstall. Require approval untuk software baru dan test di staging sebelum production.",
  "8.20": "Segmentasi jaringan berdasarkan fungsi dan sensitivitas data. Deploy firewall di perimeter dan internal, monitor traffic untuk anomaly, dan update rule secara berkala.",
  "8.21": "Tentukan SLA keamanan untuk setiap layanan jaringan: availability, latency, dan mekanisme proteksi. Encrypt network traffic dengan TLS dan monitor performa.",
  "8.22": "Pisahkan jaringan untuk production, staging, development, dan guest. Implementasi VLAN dan firewall rule antar segment, batasi komunikasi cross-segment ke yang necessary saja.",
  "8.23": "Deploy web proxy dengan filtering capability untuk memblokir akses ke situs berbahaya: malware, phishing, atau konten ilegal. Log web traffic untuk monitoring.",
  "8.24": "Integrasikan keamanan ke dalam SDLC: threat modeling, secure coding guideline, code review, dan penetration testing. Gunakan tools SAST dan DAST untuk automated scanning.",
  "8.25": "Terapkan prinsip secure engineering: defense in depth, least privilege, dan fail safe. Dokumentasikan security architecture dan review design sebelum implementasi.",
  "8.26": "Tentukan persyaratan keamanan untuk setiap aplikasi berdasarkan jenis data yang diproses. Include requirement untuk authentication, authorization, encryption, dan logging.",
  "8.27": "Training developer tentang secure coding: OWASP Top 10, input validation, dan output encoding. Gunakan secure coding guideline dan implementasi code review dengan checklist keamanan.",
  "8.28": "Integrasikan automated security testing di CI/CD pipeline: SAST, SCA, dan secret scanning. Require security gate sebelum deploy dan track vulnerability metrics.",
  "8.29": "Lakukan penetration testing tahunan atau setelah perubahan besar. Test semua aplikasi kritis, retest setelah remediasi, dan dokumentasi finding beserta remediation plan.",
  "8.30": "Sertakan persyaratan keamanan dalam kontrak outsourcing. Require vendor untuk mengikuti secure development process dan request evidence security testing sebelum acceptance.",
  "8.31": "Pisahkan environment development, testing, UAT, dan production. Batasi akses antar environment, gunakan credential berbeda, dan promote code melalui pipeline bukan langsung ke production.",
  "8.32": "Implementasi proses change management yang terstruktur: request, assess, approve, implement, dan review. Document semua perubahan dan test di staging sebelum production.",
  "8.33": "Kelola informasi proyek dengan version control dan access control. Share informasi berdasarkan need-to-know dan backup data proyek secara berkala.",
  "8.34": "Gunakan data test atau anonymized data untuk audit, lindungi data production saat proses audit. Monitor aktivitas auditor dan batasi akses ke yang necessary saja.",
  "8.35": "Implementasi data masking untuk testing environment: scramble, substitute, atau generate dummy data. Pastikan tidak ada data production sensitif di environment testing.",
  "8.36": "Perlakukan data testing sesuai dengan level klasifikasinya. Encrypt data testing yang sensitif, batasi akses, dan dispose dengan aman setelah proyek selesai.",
  "8.37": "Tentukan persyaratan keamanan untuk integrasi sistem: authentication, authorization, dan encryption. Test security integrasi sebelum go-live dan monitor untuk anomaly.",
  "8.38": "Test keamanan setelah perubahan: verify konfigurasi, test access control, dan check logging. Retest vulnerability yang sudah diperbaiki dan update dokumentasi security.",
  "8.39": "Amankan lingkungan virtual: protect hypervisor dan management console, isolasi VM network, monitor aktivitas VM, patch virtualization platform, dan backup konfigurasi VM.",
  "8.40": "Amankan script otomasi: kelola credential dengan aman, validasi input, dan handle error dengan baik. Test automation di staging dan review permission secara berkala.",
  "8.41": "Implementasi cloud security posture management (CSPM) untuk monitor konfigurasi cloud. Enable cloud logging dan review access permission secara berkala untuk mencegah misconfiguration.",
  "8.42": "Buat baseline konfigurasi untuk semua aset dan track perubahan. Monitor configuration drift, review baseline secara berkala, dan automate konfigurasi dengan Infrastructure as Code (IaC)."
};

// ===== COBIT 2019: Educational-style descriptions =====
const cobitHighlights = [
  "COBIT 2019 dirancang agar lebih mudah disesuaikan dengan kebutuhan organisasi. Framework ini bisa jadi payung yang menaungi standar lain yang sudah digunakan, tanpa memaksa perubahan total.",
  "Versi terbaru ini lebih responsif terhadap perubahan zaman: transformasi digital, model bisnis baru, dan tuntutan stakeholder yang terus berkembang. Organisasi tetap bisa relevan meski lingkungan berubah cepat.",
  "Dengan design factor dan focus area, COBIT 2019 membantu organisasi menerjemahkan teori tata kelola ke praktik yang sesuai konteks bisnis masing-masing.",
  "COBIT 2019 memperkenalkan governance dan management objectives yang lebih terstruktur, memudahkan organisasi memetakan apa yang perlu dikelola dan siapa yang bertanggung jawab.",
  "Framework ini membuka ruang bagi organisasi untuk menyesuaikan tingkat ambisi tata kelola. Tidak harus sempurna dari awal, bisa mulai dari yang paling kritis lalu berkembang bertahap.",
  "Dengan goals cascade, organisasi bisa menurunkan tujuan bisnis ke tujuan IT yang terukur. Ini memastikan investasi IT benar-benar mendukung strategi bisnis.",
  "COBIT 2019 menyediakan guidance implementasi bertahap, jadi organisasi tidak perlu mengubah semuanya sekaligus. Mulai dari gap analysis, prioritasi, lalu eksekusi sesuai kapasitas."
];

const cobitPrinciples = [
  "Sistem tata kelola harus memenuhi kebutuhan stakeholder. Ini artinya, apapun yang dibangun harus menjawab pertanyaan: apa nilai yang diharapkan pemangku kepentingan?",
  "Cakupan tata kelola harus komprehensif, mencakup seluruh fungsi IT dan proses bisnis terkait. Jangan ada area yang terlewat karena bisa jadi celah risiko.",
  "Framework tata kelola harus adaptif dan bisa berkembang seiring waktu. Tidak ada satu ukuran untuk semua, sesuaikan dengan konteks organisasi.",
  "Tata kelola dan manajemen adalah dua hal berbeda tapi saling melengkapi. Governance menentukan arah, management menjalankan operasionalnya.",
  "Sistem tata kelola harus selaras dengan enterprise governance secara keseluruhan. IT bukan entitas terpisah, tapi bagian integral dari bisnis."
];

const cobitDesignFactors = [
  "Pahami strategi enterprise: apakah fokus pada growth, cost leadership, atau inovasi? Ini menentukan prioritas investasi IT.",
  "Kenali tujuan bisnis utama organisasi. IT harus mendukung pencapaian goal ini, bukan jadi beban tambahan.",
  "Evaluasi profil risiko: industri apa yang dijalankan, regulasi apa yang berlaku, dan ancaman apa yang paling relevan.",
  "Pertimbangkan peran IT di organisasi: apakah hanya pendukung operasional atau sudah jadi enabler strategi bisnis?",
  "Kenali model ancaman yang dihadapi: cyber attack, disaster, human error, atau kombinasi dari semuanya.",
  "Sesuaikan dengan ukuran dan struktur organisasi. Enterprise besar butuh pendekatan berbeda dengan UKM.",
  "Pahami peran IT dalam value chain: di mana teknologi menciptakan nilai terbesar untuk bisnis.",
  "Pertimbangkan model sourcing: apakah IT dikelola in-house, outsourced, atau hybrid.",
  "Kenali metode implementasi IT: waterfall, agile, atau DevOps. Ini mempengaruhi cara tata kelola dioperasionalkan.",
  "Evaluasi tingkat adopsi teknologi: apakah organisasi early adopter atau cenderung konservatif?",
  "Pantau kebutuhan compliance: regulasi sektor finansial, kesehatan, atau industri lain punya tuntutan spesifik."
];

// Update ISO 27001
const isoData = JSON.parse(fs.readFileSync('./public/data/iso27001.json', 'utf8'));
isoData.forEach(control => {
  if (isoDescriptions[control.id]) {
    control.description = isoDescriptions[control.id];
  }
});
fs.writeFileSync('./public/data/iso27001.json', JSON.stringify(isoData, null, 2), 'utf8');

// Update COBIT 2019
const cobitData = JSON.parse(fs.readFileSync('./public/data/cobit_2019_intro_methodology.json', 'utf8'));

// Update highlights summaries
if (cobitData.highlights && cobitData.highlights.length > 0) {
  cobitData.highlights.forEach((h, i) => {
    if (cobitHighlights[i]) {
      h.summary = cobitHighlights[i];
    }
  });
}

// Update principles if they exist
if (cobitData.principles) {
  cobitData.principles.forEach((p, i) => {
    if (cobitPrinciples[i]) {
      p.description = cobitPrinciples[i];
    }
  });
}

// Update design factors if they exist
if (cobitData.designFactors) {
  cobitData.designFactors.forEach((df, i) => {
    if (cobitDesignFactors[i]) {
      df.description = cobitDesignFactors[i];
    }
  });
}

fs.writeFileSync('./public/data/cobit_2019_intro_methodology.json', JSON.stringify(cobitData, null, 2), 'utf8');

console.log('✅ ISO 27001: Updated descriptions for', Object.keys(isoDescriptions).length, 'controls');
console.log('✅ COBIT 2019: Updated highlights, principles, and design factors');
console.log('\n📝 All descriptions rewritten in educational/guide style (Bahasa Indonesia)');
