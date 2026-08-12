import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const outputDir = resolve(process.cwd(), 'public/data');
mkdirSync(outputDir, { recursive: true });

const roleTranslations = (title, owner) => ({
  bod: `Mode Direksi/Dewan Komisaris: tetapkan arah, kecukupan sumber daya, dan pengawasan atas “${title}”. Minta pelaporan berkala dari ${owner} beserta status tindak lanjut risiko dan temuan.`,
  sysadmin: `Mode Tim TI: operasionalkan “${title}” melalui konfigurasi, pencatatan aktivitas, pengendalian perubahan, dan bukti pelaksanaan yang dapat ditelusuri. Eskalasikan risiko atau deviasi kepada ${owner}.`,
  legal: `Mode Legal & Compliance: pastikan kebijakan, prosedur, kontrak, persetujuan, serta pelaporan terkait “${title}” selaras dengan POJK 11/2022 dan ketentuan lain yang berlaku.`,
});

const r = ({ id, chapter, chapter_title, pillar, title, summary, cadence, owner, focus, evidence, reporting, refs, scoring = 'Dievaluasi melalui kecukupan desain kontrol, konsistensi implementasi, dan ketertelusuran bukti.' }) => ({
  id,
  chapter,
  chapter_title,
  pillar,
  title,
  summary,
  cadence,
  owner,
  legal_basis: `Pasal ${id.replace('POJK-', '').replace(/^0/, '').replace('-', '–')}`,
  scoring,
  appendices: refs,
  focus,
  evidence,
  reporting,
  analogy: `Bayangkan ${title.toLowerCase()} sebagai pagar pengaman operasional bank: desainnya harus tepat, digunakan secara konsisten, dan dapat dibuktikan saat diuji.`,
  roleTranslations: roleTranslations(title, owner),
});

const requirements = [
  r({
    id: 'POJK-02', chapter: 'II', chapter_title: 'Tata Kelola TI Bank', pillar: 'Tata Kelola & Strategi',
    title: 'Terapkan tata kelola TI yang baik pada seluruh fungsi penyelenggara dan pengguna TI',
    summary: 'Bank wajib menerapkan tata kelola TI yang baik dengan mempertimbangkan strategi bisnis, ukuran dan kompleksitas, peran TI, metode pengadaan sumber daya, risiko, standar nasional/internasional, serta ketentuan peraturan. Kegiatan tata kelola mencakup evaluasi dan pengarahan strategi, penyelarasan dan pengorganisasian, akuisisi serta implementasi solusi, dukungan layanan, dan pemantauan kinerja maupun kepatuhan.',
    cadence: 'Berkelanjutan; dievaluasi sejalan perubahan bisnis, risiko, dan regulasi', owner: 'Direksi dan Komite Pengarah TI',
    focus: ['Tautkan strategi TI dengan rencana korporasi dan kebutuhan pemangku kepentingan.', 'Terapkan tata kelola pada satuan kerja penyelenggara serta seluruh pengguna TI.', 'Gunakan pengukuran kinerja, pengendalian intern, dan monitoring kepatuhan sebagai mekanisme pengawasan.'],
    evidence: ['Kebijakan tata kelola TI yang disetujui Direksi.', 'Peta proses, struktur, dan dashboard kinerja TI.', 'Risalah evaluasi strategi TI atau Komite Pengarah TI.'],
    reporting: 'Menjadi dasar pengawasan internal dan bahan laporan kondisi terkini penyelenggaraan TI.', refs: ['REF-02', 'REF-12', 'REF-16']
  }),
  r({
    id: 'POJK-03', chapter: 'II', chapter_title: 'Tata Kelola TI Bank', pillar: 'Tata Kelola & Strategi',
    title: 'Petakan tujuh aspek tata kelola TI dan lakukan penginian kebijakan secara berkala',
    summary: 'Bank wajib memetakan, merencanakan, dan/atau menetapkan proses bisnis, struktur organisasi, kebijakan-standar-prosedur, kebutuhan serta alur informasi, SDM, budaya TI, dan infrastruktur maupun aplikasi. Ketujuh aspek harus bersinergi; kebijakan, standar, dan prosedur harus diterapkan secara konsisten, berkesinambungan, dikaji ulang, dan diperbarui berkala.',
    cadence: 'Kaji ulang berkala sesuai kebutuhan dan perubahan kondisi internal/eksternal', owner: 'Satuan Kerja Penyelenggara TI dan Pemilik Proses',
    focus: ['Bangun inventaris proses dan matriks tanggung jawab untuk tiap layanan TI.', 'Pastikan setiap kebijakan memiliki pemilik, tanggal kaji ulang, dan kontrol distribusi versi.', 'Uji keselarasan antara proses, SDM, data, aplikasi, dan infrastruktur.'],
    evidence: ['Enterprise process map dan RACI TI.', 'Daftar kebijakan/standar/prosedur beserta riwayat review.', 'Matriks kompetensi, arsitektur aplikasi, dan peta alur informasi.'],
    reporting: 'Status pengkinian dan deviasi kebijakan menjadi bahan pemantauan tata kelola.', refs: ['REF-02', 'REF-16']
  }),
  r({
    id: 'POJK-04', chapter: 'II', chapter_title: 'Tata Kelola TI Bank', pillar: 'Tata Kelola & Strategi',
    title: 'Tetapkan wewenang dan tanggung jawab organ Bank pada setiap jenjang yang terkait TI',
    summary: 'Bank wajib menetapkan wewenang dan tanggung jawab yang jelas bagi Direksi, Dewan Komisaris, serta pejabat pada setiap jenjang jabatan yang terkait penerapan tata kelola TI. Penetapan ini harus menjamin akuntabilitas pengambilan keputusan dan eskalasi risiko.',
    cadence: 'Ditinjau saat perubahan organisasi, mandat, atau model operasi', owner: 'Direksi dan Fungsi SDM/Tata Kelola',
    focus: ['Tetapkan mandat, hak keputusan, dan jalur eskalasi pada organisasi TI.', 'Pisahkan peran pengawasan, manajemen risiko, operasional TI, dan pengguna bisnis secara memadai.', 'Selaraskan job description dan surat keputusan dengan kebijakan tata kelola TI.'],
    evidence: ['Struktur organisasi dan uraian jabatan terkait TI.', 'RACI pengambilan keputusan TI.', 'SK, piagam komite, dan matriks kewenangan.'],
    reporting: 'Dibuktikan dalam pengawasan tata kelola dan evaluasi efektivitas organisasi.', refs: ['REF-02', 'REF-16']
  }),
  r({
    id: 'POJK-05', chapter: 'II', chapter_title: 'Tata Kelola TI Bank', pillar: 'Tata Kelola & Strategi',
    title: 'Laksanakan tanggung jawab Direksi atas strategi, kebijakan, risiko, dan sumber daya TI',
    summary: 'Direksi paling sedikit menetapkan rencana strategis TI serta kebijakan, standar, dan prosedur TI; mengomunikasikannya secara efektif; serta mengevaluasi tujuan strategis, mengarahkan pejabat eksekutif, dan memantau penyelenggaraan TI. Pemantauan mencakup kesesuaian tata kelola, efektivitas/efisiensi, manajemen risiko, kecukupan sumber daya, dan keterlibatan pemangku kepentingan.',
    cadence: 'Berkala melalui forum tata kelola dan saat terdapat keputusan strategis', owner: 'Direksi',
    focus: ['Tetapkan agenda pengawasan Direksi untuk kinerja, risiko, investasi, dan isu TI material.', 'Pastikan keputusan dan arahan Direksi terdokumentasi serta ditindaklanjuti.', 'Pastikan kebijakan TI dikomunikasikan ke unit penyelenggara maupun pengguna.'],
    evidence: ['Rencana strategis TI yang disetujui.', 'Risalah rapat Direksi dan dashboard risiko/kinerja TI.', 'Rekaman sosialisasi kebijakan TI.'],
    reporting: 'Menjadi fondasi akuntabilitas pengurus atas kondisi penyelenggaraan TI.', refs: ['REF-02', 'REF-03', 'REF-12']
  }),
  r({
    id: 'POJK-06', chapter: 'II', chapter_title: 'Tata Kelola TI Bank', pillar: 'Tata Kelola & Strategi',
    title: 'Pastikan Dewan Komisaris mengevaluasi, mengarahkan, dan memantau strategi serta tata kelola TI',
    summary: 'Dewan Komisaris paling sedikit melakukan evaluasi, pengarahan, dan pemantauan atas rencana strategis TI serta penerapan tata kelola TI. Peran ini merupakan lapisan pengawasan terhadap keputusan dan pelaksanaan Direksi.',
    cadence: 'Berkala sesuai agenda pengawasan Dewan Komisaris', owner: 'Dewan Komisaris',
    focus: ['Terima informasi ringkas mengenai risiko TI material, status strategi, dan isu penyelenggaraan.', 'Berikan arahan dan challenge terhadap kecukupan tata kelola, sumber daya, dan tindak lanjut.', 'Pastikan pengawasan terdokumentasi tanpa mengambil alih fungsi pengurusan Direksi.'],
    evidence: ['Risalah rapat Dewan Komisaris/komite terkait.', 'Materi dashboard strategi dan risiko TI untuk pengawasan.', 'Daftar arahan Komisaris beserta pemantauan tindak lanjut.'],
    reporting: 'Digunakan untuk menunjukkan efektivitas lapisan pengawasan tata kelola Bank.', refs: ['REF-02', 'REF-16']
  }),
  r({
    id: 'POJK-07', chapter: 'II', chapter_title: 'Tata Kelola TI Bank', pillar: 'Tata Kelola & Strategi',
    title: 'Bentuk dan operasikan Komite Pengarah TI dengan komposisi minimum yang dipersyaratkan',
    summary: 'Bank wajib memiliki Komite Pengarah TI yang memberi rekomendasi kepada Direksi mengenai strategi, kebijakan, kesesuaian rencana dan realisasi pengembangan TI, efektivitas biaya, kinerja, penyelesaian masalah lintas unit, serta kecukupan dan alokasi sumber daya. Komite paling sedikit melibatkan direktur TI, direktur manajemen risiko, pimpinan TI, dan pimpinan pengguna TI; ketuanya seorang direktur.',
    cadence: 'Berkala sesuai piagam komite dan saat isu TI material muncul', owner: 'Komite Pengarah TI',
    focus: ['Tetapkan piagam, anggota, kuorum, frekuensi rapat, dan mekanisme eskalasi.', 'Pantau manfaat investasi, deviasi proyek, isu layanan, serta konflik prioritas bisnis-TI.', 'Dokumentasikan rekomendasi dan akuntabilitas tindak lanjut ke Direksi.'],
    evidence: ['Piagam Komite Pengarah TI dan daftar anggota.', 'Agenda, materi, dan risalah rapat komite.', 'Register rekomendasi serta status penyelesaian.'],
    reporting: 'Memberi jalur tata kelola untuk keputusan dan isu TI lintas fungsi.', refs: ['REF-02', 'REF-03']
  }),
  r({
    id: 'POJK-08', chapter: 'II', chapter_title: 'Tata Kelola TI Bank', pillar: 'Tata Kelola & Strategi',
    title: 'Miliki satuan kerja penyelenggara TI yang mengelola siklus hidup penyelenggaraan TI',
    summary: 'Bank wajib memiliki satuan kerja penyelenggara TI yang bertanggung jawab atas pengelolaan TI. Aktivitas minimumnya mencakup perencanaan, penyusunan atau pengembangan, pengoperasian, dan pemantauan, serta dilaksanakan sesuai arahan Direksi untuk mendukung tujuan bisnis Bank.',
    cadence: 'Berkelanjutan', owner: 'Satuan Kerja Penyelenggara TI',
    focus: ['Definisikan layanan, peran, kapasitas, dan kompetensi unit TI.', 'Kelola portofolio dari perencanaan hingga operasional dan monitoring.', 'Selaraskan indikator operasional TI dengan target layanan serta tujuan bisnis.'],
    evidence: ['Struktur unit TI, service catalogue, dan rencana kapasitas.', 'SOP pengembangan, operasi, dan pemantauan.', 'Laporan KPI/SLA TI.'],
    reporting: 'Kinerja unit TI menjadi masukan bagi Komite Pengarah TI dan Direksi.', refs: ['REF-02', 'REF-03']
  }),
  r({
    id: 'POJK-11', chapter: 'III', chapter_title: 'Arsitektur dan Strategi TI Bank', pillar: 'Tata Kelola & Strategi',
    title: 'Susun dan kinikan arsitektur TI yang komprehensif',
    summary: 'Bank wajib memiliki arsitektur TI dengan mempertimbangkan visi-misi, rencana korporasi, proses serta kapabilitas bisnis, tata kelola TI, prinsip data-aplikasi-teknologi, ukuran dan kompleksitas, kemampuan permodalan, standar, dan regulasi. Arsitektur disusun melalui perencanaan, desain, implementasi, serta kontrol dan wajib diperbarui ketika faktor yang mendasarinya berubah.',
    cadence: 'Dikaji pada perubahan faktor arsitektur dan siklus perencanaan', owner: 'Enterprise Architecture dan Satuan Kerja TI',
    focus: ['Kelola baseline dan target architecture untuk bisnis, data, aplikasi, dan teknologi.', 'Gunakan architecture review untuk inisiatif atau perubahan material.', 'Catat keputusan, pengecualian, ketergantungan, dan roadmap transisi.'],
    evidence: ['Dokumen enterprise architecture dan prinsip arsitektur.', 'Baseline/target architecture serta roadmap.', 'Catatan architecture review dan daftar deviasi.'],
    reporting: 'Mendukung rencana strategis serta rencana pengembangan TI.', refs: ['REF-03', 'REF-16']
  }),
  r({
    id: 'POJK-12-13', chapter: 'III', chapter_title: 'Arsitektur dan Strategi TI Bank', pillar: 'Tata Kelola & Strategi',
    title: 'Miliki rencana strategis TI yang mendukung rencana korporasi dan sampaikan tepat waktu',
    summary: 'Bank wajib memiliki rencana strategis TI untuk jangka panjang sesuai periode rencana korporasi dan menyampaikannya kepada OJK paling lambat akhir November sebelum periode awal rencana dimulai. Perubahan dapat dilakukan sewaktu-waktu apabila ada kondisi yang signifikan memengaruhi sasaran atau strategi TI, lalu disampaikan kepada OJK.',
    cadence: 'Sesuai periode rencana korporasi; pelaporan awal paling lambat akhir November', owner: 'Direksi, Satuan Kerja TI, dan Perencanaan Korporasi',
    focus: ['Hubungkan sasaran TI, roadmap, investasi, risiko, kemampuan SDM, dan target bisnis.', 'Tetapkan proses governance untuk perubahan rencana strategis TI.', 'Kelola kalender dan bukti penyampaian kepada OJK.'],
    evidence: ['Rencana strategis TI yang disetujui Direksi.', 'Penyelarasan dengan rencana korporasi.', 'Bukti penyampaian dan, jika ada, perubahan rencana ke OJK.'],
    reporting: 'Disampaikan kepada OJK; perubahan disampaikan sewaktu-waktu dalam periode rencana.', refs: ['REF-03', 'REF-12', 'REF-16']
  }),
  r({
    id: 'POJK-15', chapter: 'IV', chapter_title: 'Manajemen Risiko Penyelenggaraan TI Bank', pillar: 'Risiko & Ketahanan Operasional',
    title: 'Terapkan manajemen risiko TI secara efektif dan terintegrasi',
    summary: 'Bank wajib menerapkan manajemen risiko secara efektif dalam seluruh tahapan penyelenggaraan TI melalui identifikasi, pengukuran, pemantauan, dan pengendalian risiko; serta memastikan kecukupan sistem informasi manajemen risiko.',
    cadence: 'Terintegrasi sepanjang siklus hidup layanan, proyek, perubahan, dan operasi TI', owner: 'Manajemen Risiko dan Satuan Kerja TI',
    focus: ['Masukkan risiko TI dan siber dalam risk register serta proses persetujuan perubahan.', 'Definisikan metrik risiko, ambang eskalasi, dan rencana perlakuan risiko.', 'Pastikan informasi risiko cukup bagi pemantauan manajemen.'],
    evidence: ['Metodologi manajemen risiko TI.', 'Risk register, KRI, dan laporan pemantauan.', 'Hasil risk assessment untuk proyek/perubahan atau layanan kritikal.'],
    reporting: 'Risiko TI material menjadi masukan pengawasan dan laporan kondisi penyelenggaraan TI.', refs: ['REF-04', 'REF-12', 'REF-16']
  }),
  r({
    id: 'POJK-16', chapter: 'IV', chapter_title: 'Manajemen Risiko Penyelenggaraan TI Bank', pillar: 'Risiko & Ketahanan Operasional',
    title: 'Amankan informasi secara efektif dan efisien berbasis risiko',
    summary: 'Bank wajib memastikan pengamanan informasi diterapkan secara efektif dan efisien pada aspek manusia, proses, teknologi, serta fisik/lingkungan secara menyeluruh. Pengamanan harus ditentukan berdasarkan hasil penilaian risiko terhadap informasi Bank.',
    cadence: 'Berkelanjutan; dikaji berdasarkan perubahan risiko informasi', owner: 'Keamanan Informasi dan Satuan Kerja TI',
    focus: ['Klasifikasikan informasi dan sesuaikan kontrol dengan nilai serta risikonya.', 'Terapkan kontrol terhadap personel, proses, teknologi, dan fasilitas.', 'Pantau efektivitas kontrol dan kelola pengecualian secara formal.'],
    evidence: ['Kebijakan keamanan informasi dan klasifikasi data.', 'Hasil risk assessment informasi.', 'Register kontrol, pengecualian, serta laporan monitoring.'],
    reporting: 'Menjadi bagian dari penerapan risiko dan pengamanan penyelenggaraan TI.', refs: ['REF-04', 'REF-08', 'REF-16']
  }),
  r({
    id: 'POJK-17', chapter: 'IV', chapter_title: 'Manajemen Risiko Penyelenggaraan TI Bank', pillar: 'Risiko & Ketahanan Operasional',
    title: 'Jaga kerahasiaan, integritas, dan ketersediaan jaringan komunikasi Bank',
    summary: 'Bank wajib memastikan jaringan komunikasi yang disediakan telah memenuhi prinsip confidentiality, integrity, dan availability. Kontrol jaringan perlu diselaraskan dengan risiko layanan dan informasi yang dialirkan.',
    cadence: 'Monitoring berkelanjutan; kaji ulang ketika ada perubahan arsitektur atau ancaman', owner: 'Network Operations dan Keamanan Informasi',
    focus: ['Segmentasikan jaringan dan lindungi komunikasi sensitif.', 'Terapkan kontrol akses, enkripsi yang relevan, logging, dan monitoring jaringan.', 'Uji ketahanan komunikasi bagi layanan kritikal.'],
    evidence: ['Diagram jaringan dan standar hardening.', 'Konfigurasi keamanan, log monitoring, dan laporan uji.', 'Prosedur pengelolaan akses serta perubahan jaringan.'],
    reporting: 'Temuan risiko jaringan menjadi bahan eskalasi dan perbaikan keamanan.', refs: ['REF-04', 'REF-16']
  }),
  r({
    id: 'POJK-18', chapter: 'IV', chapter_title: 'Manajemen Risiko Penyelenggaraan TI Bank', pillar: 'Risiko & Ketahanan Operasional',
    title: 'Miliki, uji, dan kaji ulang Rencana Pemulihan Bencana untuk layanan kritikal',
    summary: 'Bank wajib memiliki Rencana Pemulihan Bencana (DRP), memastikan rencana dapat dijalankan agar operasional tetap berjalan saat bencana/gangguan TI, menguji seluruh aplikasi dan infrastruktur kritikal berdasarkan BIA paling sedikit setahun sekali dengan pengguna TI, serta mengkaji ulang DRP paling sedikit setahun sekali.',
    cadence: 'Pengujian dan kaji ulang paling sedikit 1 kali per tahun', owner: 'Business Continuity, Satuan Kerja TI, dan Pemilik Layanan',
    focus: ['Selaraskan DRP dengan BIA, target RTO/RPO, dan rencana kelangsungan bisnis.', 'Libatkan pemilik proses bisnis dalam uji aplikasi serta infrastruktur kritikal.', 'Dokumentasikan hasil uji, gap, keputusan, dan penyelesaian tindak lanjut.'],
    evidence: ['BIA, DRP, dan daftar layanan kritikal.', 'Skenario, hasil, dan evaluasi uji DRP.', 'Bukti kaji ulang tahunan serta rencana perbaikan.'],
    reporting: 'Hasil uji dan perbaikan menjadi bukti kesiapan kelangsungan operasional.', refs: ['REF-04', 'REF-14', 'REF-16']
  }),
  r({
    id: 'POJK-19', chapter: 'IV', chapter_title: 'Manajemen Risiko Penyelenggaraan TI Bank', pillar: 'Risiko & Ketahanan Operasional',
    title: 'Hasilkan laporan terpisah bagi kegiatan Unit Usaha Syariah',
    summary: 'Bank umum konvensional yang memiliki unit usaha syariah wajib memiliki sistem yang dapat menghasilkan laporan terpisah bagi kegiatan unit usaha syariah.',
    cadence: 'Berkelanjutan; diuji pada perubahan sistem dan siklus pelaporan', owner: 'TI, Keuangan/Operasional, dan Unit Usaha Syariah',
    focus: ['Identifikasi kebutuhan pemisahan data dan pelaporan UUS.', 'Validasi integritas, ketepatan, dan keterlacakan laporan terpisah.', 'Kelola perubahan sistem yang dapat memengaruhi pelaporan UUS.'],
    evidence: ['Dokumen requirement dan desain sistem pelaporan UUS.', 'Contoh laporan terpisah serta rekonsiliasi.', 'Hasil uji penerimaan pengguna.'],
    reporting: 'Laporan kegiatan UUS harus dapat dihasilkan secara terpisah oleh sistem Bank.', refs: ['REF-04', 'REF-16']
  }),
  r({
    id: 'POJK-21', chapter: 'V', chapter_title: 'Ketahanan dan Keamanan Siber Bank', pillar: 'Ketahanan Siber',
    title: 'Jaga ketahanan siber melalui siklus identifikasi, pelindungan, deteksi, respons, dan pemulihan',
    summary: 'Bank wajib menjaga ketahanan siber dengan mengidentifikasi aset, ancaman, dan kerentanan; melindungi aset; mendeteksi insiden siber; serta melakukan penanggulangan dan pemulihan insiden. Semua proses harus didukung sistem informasi ketahanan siber yang memadai.',
    cadence: 'Berkelanjutan dan berbasis perubahan ancaman maupun risiko', owner: 'Unit/Fungsi Ketahanan dan Keamanan Siber',
    focus: ['Bangun inventaris aset dan pemantauan ancaman/kerentanan.', 'Rancang kontrol preventif, detektif, respons, serta pemulihan yang terintegrasi.', 'Pastikan telemetry dan informasi siber memadai untuk pengambilan keputusan.'],
    evidence: ['Inventaris aset kritikal dan risk/threat register.', 'Playbook insiden, dashboard/SIEM, serta laporan monitoring.', 'Rencana pemulihan insiden siber dan hasil latihan.'],
    reporting: 'Kondisi ketahanan siber menjadi bagian dari laporan kondisi terkini penyelenggaraan TI.', refs: ['REF-05', 'REF-13', 'REF-16']
  }),
  r({
    id: 'POJK-22', chapter: 'V', chapter_title: 'Ketahanan dan Keamanan Siber Bank', pillar: 'Ketahanan Siber',
    title: 'Lakukan self-assessment tingkat maturitas keamanan siber dan laporkan hasilnya',
    summary: 'Bank wajib melakukan penilaian sendiri atas tingkat maturitas keamanan siber secara tahunan untuk posisi akhir Desember; dapat memperbaruinya sewaktu-waktu apabila diperlukan; dan wajib menyampaikan hasilnya sebagai bagian dari laporan kondisi terkini penyelenggaraan TI Bank.',
    cadence: 'Tahunan untuk posisi akhir Desember; pengkinian bila diperlukan', owner: 'Unit/Fungsi Ketahanan dan Keamanan Siber bersama Manajemen Risiko',
    focus: ['Tetapkan metodologi, owner, data sumber, quality review, dan persetujuan hasil self-assessment.', 'Analisis gap maturitas serta prioritas perbaikannya.', 'Integrasikan hasil ke laporan kondisi terkini penyelenggaraan TI.'],
    evidence: ['Metodologi dan working paper self-assessment.', 'Hasil penilaian, gap analysis, dan rencana aksi.', 'Bukti penyampaian hasil dalam laporan kondisi terkini.'],
    reporting: 'Bagian dari laporan kondisi terkini penyelenggaraan TI setelah akhir tahun pelaporan.', refs: ['REF-05', 'REF-12', 'REF-13', 'REF-16']
  }),
  r({
    id: 'POJK-23-24', chapter: 'V', chapter_title: 'Ketahanan dan Keamanan Siber Bank', pillar: 'Ketahanan Siber',
    title: 'Laksanakan pengujian keamanan siber berbasis analisis kerentanan secara berkala',
    summary: 'Bank wajib melakukan pengujian keamanan siber berdasarkan analisis kerentanan dan skenario. Pengujian berbasis analisis kerentanan harus dilakukan secara berkala dan hasilnya wajib disampaikan kepada OJK sebagai bagian dari laporan kondisi terkini penyelenggaraan TI Bank.',
    cadence: 'Berkala, disesuaikan profil risiko dan perubahan sistem', owner: 'Unit/Fungsi Ketahanan dan Keamanan Siber dan Satuan Kerja TI',
    focus: ['Tentukan cakupan aset, metode, dan frekuensi pengujian berbasis risiko.', 'Kelola temuan, prioritas remediasi, retest, dan pengecualian.', 'Konsolidasikan hasil pengujian dalam laporan kondisi terkini.'],
    evidence: ['Rencana dan laporan vulnerability assessment/penetration testing.', 'Register temuan, remediasi, dan retest.', 'Ringkasan hasil untuk pelaporan OJK.'],
    reporting: 'Hasil disampaikan sebagai bagian laporan kondisi terkini penyelenggaraan TI.', refs: ['REF-05', 'REF-12', 'REF-16']
  }),
  r({
    id: 'POJK-25', chapter: 'V', chapter_title: 'Ketahanan dan Keamanan Siber Bank', pillar: 'Ketahanan Siber',
    title: 'Laksanakan dan laporkan pengujian keamanan siber berbasis skenario',
    summary: 'Pengujian keamanan siber berbasis skenario wajib dilakukan paling sedikit satu kali dalam setahun. Cakupannya meliputi penetapan tujuan, cakupan, dan skenario; pelaksanaan; evaluasi; serta penilaian efektivitas mitigasi, respons, dan pemulihan. Laporan wajib disampaikan kepada OJK paling lama 10 hari kerja setelah pengujian selesai.',
    cadence: 'Paling sedikit 1 kali per tahun; laporan paling lama 10 hari kerja setelah uji selesai', owner: 'Unit/Fungsi Ketahanan dan Keamanan Siber bersama Pemilik Proses',
    focus: ['Gunakan skenario yang relevan terhadap layanan dan risiko kritikal.', 'Libatkan fungsi bisnis, TI, risiko, komunikasi, dan manajemen pada tingkat yang relevan.', 'Catat lessons learned dan tindakan perbaikan sampai selesai.'],
    evidence: ['Skenario, tujuan, scope, dan peserta latihan.', 'Laporan pelaksanaan dan evaluasi efektivitas respons/pemulihan.', 'Bukti penyampaian ke OJK dan register tindak lanjut.'],
    reporting: 'Laporan berisi ringkasan pelaksanaan, lessons learned/observasi, dan rencana/perbaikan yang telah dilakukan.', refs: ['REF-05', 'REF-13', 'REF-16']
  }),
  r({
    id: 'POJK-26', chapter: 'V', chapter_title: 'Ketahanan dan Keamanan Siber Bank', pillar: 'Ketahanan Siber',
    title: 'Bentuk unit atau fungsi ketahanan dan keamanan siber yang independen dari pengelolaan TI',
    summary: 'Bank wajib membentuk unit atau fungsi yang menangani ketahanan dan keamanan siber. Unit atau fungsi tersebut harus independen terhadap fungsi pengelolaan TI untuk mendukung objektivitas pengawasan dan challenge atas risiko siber.',
    cadence: 'Berkelanjutan; dievaluasi saat perubahan organisasi atau profil risiko', owner: 'Direksi dan Unit/Fungsi Ketahanan dan Keamanan Siber',
    focus: ['Tetapkan mandat, garis pelaporan, kompetensi, dan kapasitas fungsi siber.', 'Pastikan independensi dari operasi/pengelolaan TI tanpa menghambat kolaborasi.', 'Bangun mekanisme eskalasi isu siber kepada Direksi dan pengurus terkait.'],
    evidence: ['Struktur organisasi, mandat, dan job description fungsi siber.', 'Matriks independensi dan jalur eskalasi.', 'Rencana kapasitas/kompetensi personel keamanan siber.'],
    reporting: 'Mendukung pengawasan ketahanan siber dan kesiapan penanganan insiden.', refs: ['REF-05', 'REF-16']
  }),
  r({
    id: 'POJK-29', chapter: 'VI', chapter_title: 'Penggunaan Pihak Penyedia Jasa TI', pillar: 'Pihak Ketiga & Cross-Border',
    title: 'Kelola penggunaan pihak penyedia jasa TI melalui kebijakan, prosedur, dan kemampuan pengawasan Bank',
    summary: 'Bank dapat menggunakan pihak penyedia jasa TI, namun wajib memiliki kemampuan mengawasi kegiatan Bank yang diselenggarakan pihak tersebut. Kebijakan dan prosedur minimum harus mencakup identifikasi kebutuhan, pemilihan, hubungan kerja sama, manajemen risiko, serta penilaian kinerja dan kepatuhan penyedia.',
    cadence: 'Sebelum dan sepanjang masa kerja sama', owner: 'Vendor Management, TI, Manajemen Risiko, dan Legal',
    focus: ['Buat inventaris layanan, vendor, materialitas, data, dan ketergantungan.', 'Tetapkan due diligence serta approval sebelum kerja sama.', 'Pastikan Bank tetap mampu mengawasi layanan yang dialihdayakan.'],
    evidence: ['Kebijakan third-party TI dan daftar vendor/layanan.', 'Penilaian materialitas dan due diligence.', 'Dashboard kinerja, risiko, dan kepatuhan vendor.'],
    reporting: 'Menjadi dasar pengawasan penyedia dan kejadian kritis terkait vendor.', refs: ['REF-06', 'REF-07', 'REF-14']
  }),
  r({
    id: 'POJK-30', chapter: 'VI', chapter_title: 'Penggunaan Pihak Penyedia Jasa TI', pillar: 'Pihak Ketiga & Cross-Border',
    title: 'Terapkan due diligence, kontrak, pengamanan, dan pemantauan penyedia jasa TI secara menyeluruh',
    summary: 'Bank harus meneliti calon penyedia dan menyusun kriterianya; mempertimbangkan kompetensi, biaya-manfaat, kehati-hatian, manajemen risiko, dan kewajaran transaksi pihak terkait. Perjanjian tertulis harus memuat kompetensi, kerahasiaan, audit independen, persetujuan subkontrak, pelaporan kejadian kritis, mekanisme penghentian, kepatuhan, serta akses OJK. Manajemen risiko meliputi tanggung jawab Bank, DRP teruji, dan keamanan data; pemantauan mencakup kinerja, reputasi, kesinambungan, pengendalian, dan SLA.',
    cadence: 'Pra-kontrak dan berkala sepanjang masa kerja sama', owner: 'Vendor Management, TI, Risiko, Procurement, dan Legal',
    focus: ['Standardisasi due diligence dan klausul kontrak minimum.', 'Nilai kapabilitas, keamanan, subkontrak, BCP/DRP, audit, dan hak akses OJK.', 'Pantau SLA, hasil audit/assurance independen, reputasi, dan kelangsungan layanan.'],
    evidence: ['Laporan due diligence dan analisis biaya-manfaat.', 'Perjanjian kerja sama/SLA dengan klausul minimum.', 'Laporan vendor review, audit/assurance, dan pemantauan SLA.'],
    reporting: 'Kinerja, risiko, dan kejadian kritis vendor dievaluasi dalam mekanisme pengawasan Bank.', refs: ['REF-06', 'REF-07', 'REF-14', 'REF-16']
  }),
  r({
    id: 'POJK-31', chapter: 'VI', chapter_title: 'Penggunaan Pihak Penyedia Jasa TI', pillar: 'Pihak Ketiga & Cross-Border',
    title: 'Nilai ulang materialitas penyedia jasa TI ketika terjadi perubahan organisasi yang signifikan',
    summary: 'Apabila terdapat perubahan signifikan terhadap organisasi pihak penyedia jasa TI, Bank wajib melakukan penilaian ulang materialitas untuk menilai dampak terhadap pengawasan, kinerja, risiko, dan kelangsungan layanan.',
    cadence: 'Setiap terjadi perubahan organisasi signifikan pada penyedia', owner: 'Vendor Management dan Manajemen Risiko',
    focus: ['Definisikan trigger perubahan signifikan dan kewajiban notifikasi vendor.', 'Nilai ulang dampak pada layanan, data, keamanan, dan konsentrasi risiko.', 'Perbarui strategi pengawasan, mitigasi, atau exit sesuai hasil penilaian.'],
    evidence: ['Kebijakan trigger penilaian ulang.', 'Notifikasi/perubahan organisasi penyedia.', 'Laporan reassessment materialitas dan keputusan tindak lanjut.'],
    reporting: 'Dapat memicu tindakan tertentu dan pelaporan jika kondisi kritis terjadi.', refs: ['REF-06', 'REF-14']
  }),
  r({
    id: 'POJK-32', chapter: 'VI', chapter_title: 'Penggunaan Pihak Penyedia Jasa TI', pillar: 'Pihak Ketiga & Cross-Border',
    title: 'Tangani kondisi kritis penyedia jasa TI dan siapkan exit yang aman',
    summary: 'Bank wajib bertindak jika kinerja penyedia berpotensi tidak efektif, layanan memburuk signifikan, penyedia insolven/likuidasi/pailit, terjadi pelanggaran rahasia Bank atau data pribadi, pengawasan OJK terganggu, atau ada kondisi lain yang mengganggu layanan. Tindakan mencakup pelaporan paling lama 3 hari kerja setelah kondisi diketahui, keputusan tindak lanjut/exit, serta pelaporan 3 hari kerja setelah penghentian dini jika dilakukan. Exit harus direncanakan, diuji/simulasikan, dan tidak mengganggu operasi Bank.',
    cadence: 'Berbasis kejadian; pelaporan paling lama 3 hari kerja setelah kondisi diketahui', owner: 'Direksi, Vendor Management, TI, Risiko, dan Legal',
    focus: ['Tetapkan indikator early warning dan jalur eskalasi kondisi kritis vendor.', 'Miliki exit plan, pengalihan data, dan strategi kontinuitas per layanan material.', 'Lakukan uji/simulasi exit atau kelangsungan layanan secara proporsional.'],
    evidence: ['Vendor contingency/exit plan.', 'Register kondisi kritis dan keputusan tindak lanjut.', 'Bukti pelaporan OJK, hasil simulasi, dan rencana transisi layanan.'],
    reporting: 'Pelaporan kepada OJK paling lama 3 hari kerja; penghentian dini juga dilaporkan paling lama 3 hari kerja setelah penghentian.', refs: ['REF-06', 'REF-13', 'REF-14', 'REF-16']
  }),
  r({
    id: 'POJK-35', chapter: 'VII', chapter_title: 'Penempatan Sistem Elektronik dan Pemrosesan Transaksi Berbasis TI', pillar: 'Pihak Ketiga & Cross-Border',
    title: 'Tempatkan Sistem Elektronik pada Pusat Data dan Pusat Pemulihan Bencana di Indonesia',
    summary: 'Bank wajib menempatkan Sistem Elektronik pada Pusat Data dan Pusat Pemulihan Bencana di wilayah Indonesia. Penempatan di luar Indonesia hanya dapat dilakukan dengan izin OJK dan untuk kriteria tertentu, antara lain kebutuhan analisis/manajemen risiko global, APU-PPT terintegrasi, layanan global, komunikasi grup, atau manajemen internal; OJK juga dapat menentukan penempatan sementara dalam kondisi gangguan operasional signifikan.',
    cadence: 'Sebelum penempatan dan selama perubahan arsitektur/lokasi layanan', owner: 'TI, Enterprise Architecture, Risiko, dan Legal',
    focus: ['Klasifikasikan lokasi Sistem Elektronik dan status kepatuhan Pusat Data/DRC.', 'Tentukan apakah rencana luar negeri memenuhi kriteria dan membutuhkan izin.', 'Kelola risiko kedaulatan data, pengawasan, hukum, serta kontinuitas.'],
    evidence: ['Inventaris lokasi Sistem Elektronik, Pusat Data, dan DRC.', 'Analisis kriteria/justifikasi lokasi luar negeri.', 'Arsitektur, kontrak, dan dokumen perizinan terkait.'],
    reporting: 'Permohonan dan realisasi penempatan luar negeri mengikuti proses perizinan/pelaporan yang dipersyaratkan.', refs: ['REF-07', 'REF-08', 'REF-09', 'REF-14']
  }),
  r({
    id: 'POJK-36', chapter: 'VII', chapter_title: 'Penempatan Sistem Elektronik dan Pemrosesan Transaksi Berbasis TI', pillar: 'Pihak Ketiga & Cross-Border',
    title: 'Penuhi persyaratan izin penempatan Sistem Elektronik di luar Indonesia dan jaga tujuan penggunaannya',
    summary: 'Permohonan izin penempatan di luar Indonesia mengharuskan pemenuhan ketentuan penyedia jasa TI, analisis risiko negara, pernyataan pengawasan OJK tidak berkurang, perlindungan rahasia Bank, pilihan hukum, persetujuan otoritas pengawas penyedia, pelaporan penilaian risiko penyedia, analisis manfaat lebih besar daripada beban, rencana peningkatan SDM, serta rencana tindak penempatan di Indonesia dalam kondisi tertentu. OJK memutuskan paling lama 3 bulan setelah dokumen lengkap; data hanya boleh dipakai untuk tujuan yang diizinkan.',
    cadence: 'Sebelum penempatan; pemantauan berkelanjutan atas tujuan penggunaan dan risiko', owner: 'TI, Risiko, Legal/Compliance, dan Vendor Management',
    focus: ['Siapkan checklist izin dan bukti per persyaratan.', 'Dokumentasikan country risk, data-flow, hukum, dan akses pemeriksaan OJK.', 'Pastikan penggunaan data tidak melampaui tujuan yang diizinkan.'],
    evidence: ['Paket permohonan izin dan surat pernyataan.', 'Country risk assessment, kontrak, serta data-flow mapping.', 'Monitoring penggunaan sistem/data di luar Indonesia.'],
    reporting: 'OJK dapat meminta pemindahan kembali ke Indonesia bila ada ketidaksesuaian atau risiko pengawasan/kinerja.', refs: ['REF-07', 'REF-08', 'REF-09', 'REF-14']
  }),
  r({
    id: 'POJK-37', chapter: 'VII', chapter_title: 'Penempatan Sistem Elektronik dan Pemrosesan Transaksi Berbasis TI', pillar: 'Pihak Ketiga & Cross-Border',
    title: 'Pastikan Pusat Data dan Pusat Pemulihan Bencana menjamin kelangsungan usaha Bank',
    summary: 'Bank wajib memastikan Pusat Data dan Pusat Pemulihan Bencana sebagaimana diatur dalam POJK menjamin kelangsungan usaha Bank. Kesiapan fasilitas harus berhubungan dengan BIA, DRP, dan pengujian pemulihan layanan kritikal.',
    cadence: 'Berkelanjutan; diuji menurut BIA dan DRP', owner: 'TI Infrastruktur dan Business Continuity',
    focus: ['Selaraskan desain Pusat Data/DRC dengan kebutuhan kelangsungan bisnis.', 'Uji kesiapan fasilitas, komunikasi, dan pemulihan layanan kritikal.', 'Kelola kapasitas, ketergantungan, serta single point of failure.'],
    evidence: ['Desain fasilitas/layanan Pusat Data dan DRC.', 'Hasil uji DRP serta laporan pemulihan.', 'Kapasitas, monitoring, dan review resiliency.'],
    reporting: 'Kesiapan fasilitas dibuktikan melalui dokumentasi kontinuitas dan hasil pengujian.', refs: ['REF-04', 'REF-07', 'REF-16']
  }),
  r({
    id: 'POJK-39', chapter: 'VII', chapter_title: 'Penempatan Sistem Elektronik dan Pemrosesan Transaksi Berbasis TI', pillar: 'Pihak Ketiga & Cross-Border',
    title: 'Selenggarakan pemrosesan transaksi berbasis TI di Indonesia dan kelola izin pemrosesan luar negeri',
    summary: 'Bank wajib menyelenggarakan pemrosesan transaksi berbasis TI di Indonesia. Penyedia di Indonesia dapat digunakan jika memenuhi kehati-hatian, ketentuan penyedia jasa TI, dan perlindungan nasabah. Pemrosesan oleh penyedia di luar Indonesia hanya dapat dilakukan setelah mendapat izin OJK dengan persyaratan tambahan atas administrasi keuangan di Indonesia dan peran Bank bagi perekonomian Indonesia.',
    cadence: 'Sebelum perubahan model pemrosesan transaksi atau penggunaan penyedia luar negeri', owner: 'Operasional, TI, Risiko, Legal/Compliance, dan Vendor Management',
    focus: ['Petakan lokasi, alur, dan penyedia pemrosesan transaksi.', 'Uji kepatuhan kehati-hatian, perlindungan nasabah, dan ketentuan vendor.', 'Kelola kelengkapan dokumen untuk permohonan pemrosesan luar negeri.'],
    evidence: ['Data-flow dan arsitektur pemrosesan transaksi.', 'Risk assessment serta uji due diligence penyedia.', 'Dokumen permohonan izin dan bukti penatausahaan dokumen keuangan di Indonesia.'],
    reporting: 'Izin OJK diperlukan untuk pemrosesan transaksi oleh penyedia di luar Indonesia.', refs: ['REF-06', 'REF-07', 'REF-08', 'REF-09']
  }),
  r({
    id: 'POJK-40-41', chapter: 'VII', chapter_title: 'Penempatan Sistem Elektronik dan Pemrosesan Transaksi Berbasis TI', pillar: 'Pihak Ketiga & Cross-Border',
    title: 'Ajukan izin secara daring dan implementasikan rencana dalam batas waktu enam bulan',
    summary: 'Permohonan izin penempatan Sistem Elektronik atau pemrosesan transaksi luar negeri disampaikan daring melalui sistem perizinan dan registrasi terintegrasi OJK; jika sarana belum tersedia, menggunakan sistem pelaporan OJK pada unit pengawasan yang sesuai. Setelah izin diperoleh, Bank harus mengimplementasikan rencana paling lama 6 bulan; bila tidak, izin tidak berlaku.',
    cadence: 'Sebelum implementasi; realisasi paling lama 6 bulan setelah izin', owner: 'Project Sponsor, TI, Legal/Compliance, dan Regulatory Reporting',
    focus: ['Buat register izin dengan owner, status kelengkapan, dan batas waktu implementasi.', 'Konfirmasi kanal pengajuan yang tersedia sebelum mengirim dokumen.', 'Kendalikan proyek agar go-live dan bukti realisasi tidak melewati masa berlaku izin.'],
    evidence: ['Bukti pengajuan/izin OJK.', 'Rencana proyek dan jadwal implementasi.', 'Bukti go-live/realisasi serta arsip komunikasi regulator.'],
    reporting: 'Realisasi setelah implementasi dilaporkan paling lama 3 bulan sesuai Pasal 61.', refs: ['REF-09', 'REF-14']
  }),
  r({
    id: 'POJK-43', chapter: 'VIII', chapter_title: 'Pengelolaan Data dan Pelindungan Data Pribadi', pillar: 'Data & Pelindungan Privasi',
    title: 'Kelola data Bank secara efektif untuk mendukung tujuan bisnis',
    summary: 'Bank wajib mengelola data secara efektif dalam pemrosesan data untuk mendukung tujuan bisnis. Pengelolaan paling sedikit memperhatikan kepemilikan dan kepengurusan data, kualitas data, sistem pengelolaan data, serta sumber daya pendukung.',
    cadence: 'Berkelanjutan; kualitas dan tata kelola data dipantau berkala', owner: 'Data Governance, Pemilik Data, dan TI',
    focus: ['Tetapkan data owner dan data steward beserta akuntabilitasnya.', 'Definisikan standar kualitas, metadata, lineage, retensi, dan penggunaan data.', 'Sediakan platform, proses, dan SDM yang memadai untuk pengelolaan data.'],
    evidence: ['Kebijakan data governance dan matriks ownership.', 'Data catalog, metadata, data-quality rules, dan laporan kualitas.', 'Rencana kapabilitas pengelolaan data.'],
    reporting: 'Menjadi bagian penilaian penyelenggaraan TI dan risiko data Bank.', refs: ['REF-10', 'REF-16']
  }),
  r({
    id: 'POJK-44', chapter: 'VIII', chapter_title: 'Pengelolaan Data dan Pelindungan Data Pribadi', pillar: 'Data & Pelindungan Privasi',
    title: 'Terapkan prinsip pelindungan data pribadi dan lakukan penilaian dampak bila risiko meningkat',
    summary: 'Bank wajib melaksanakan prinsip pelindungan data pribadi ketika memroses data pribadi. Jika terdapat kondisi tertentu yang berpotensi meningkatkan risiko bagi pemilik data pribadi, Bank wajib melakukan penilaian dampak atas penerapan prinsip pelindungan data pribadi.',
    cadence: 'Berkelanjutan; DPIA pada pemrosesan atau kondisi berisiko tinggi', owner: 'Data Privacy, Legal/Compliance, Risiko, dan TI',
    focus: ['Tentukan trigger DPIA dan metodologi penilaiannya.', 'Identifikasi dampak, mitigasi, residual risk, serta persetujuan sebelum pemrosesan berisiko tinggi.', 'Selaraskan pengelolaan privasi dengan siklus pengembangan, vendor, dan insiden.'],
    evidence: ['Kebijakan pelindungan data pribadi.', 'DPIA dan rencana mitigasi risiko.', 'Catatan persetujuan, review legal, dan pemantauan kontrol privasi.'],
    reporting: 'DPIA dan mitigasi menjadi bukti pengendalian privasi dalam penyelenggaraan TI.', refs: ['REF-10', 'REF-16']
  }),
  r({
    id: 'POJK-45', chapter: 'VIII', chapter_title: 'Pengelolaan Data dan Pelindungan Data Pribadi', pillar: 'Data & Pelindungan Privasi',
    title: 'Kendalikan pertukaran data pribadi melalui klasifikasi, perjanjian, sarana aman, dan persetujuan',
    summary: 'Pada kegiatan pertukaran data pribadi, Bank wajib menetapkan klasifikasi data pribadi, hak dan kewajiban para pihak, perjanjian pertukaran data pribadi, sarana pertukaran, dan keamanan data pribadi. Pertukaran dilakukan dengan memperhatikan persetujuan nasabah dan/atau calon nasabah sesuai peraturan perundang-undangan.',
    cadence: 'Sebelum dan sepanjang aktivitas pertukaran data pribadi', owner: 'Data Privacy, Legal/Compliance, TI, dan Pemilik Data',
    focus: ['Petakan pihak, tujuan, kategori data, dasar pemrosesan, dan metode transfer.', 'Gunakan perjanjian serta kontrol teknis yang menjamin perlindungan data.', 'Kelola bukti persetujuan dan hak subjek data sesuai ketentuan yang berlaku.'],
    evidence: ['Data-sharing register dan data-flow.', 'Perjanjian pertukaran data serta klausul keamanan.', 'Bukti persetujuan dan konfigurasi sarana transfer aman.'],
    reporting: 'Rekam pertukaran data untuk audit, pengawasan, dan penanganan insiden.', refs: ['REF-10', 'REF-16']
  }),
  r({
    id: 'POJK-48', chapter: 'IX', chapter_title: 'Penyediaan Jasa TI oleh Bank', pillar: 'Pihak Ketiga & Cross-Border',
    title: 'Sediakan jasa TI hanya kepada lembaga jasa keuangan yang diperbolehkan dan setelah memperoleh izin OJK',
    summary: 'Bank hanya dapat menyediakan jasa TI kepada lembaga jasa keuangan yang diawasi OJK dan/atau lembaga jasa keuangan luar negeri yang diawasi otoritas setempat. Bank wajib memastikan penyediaan jasa tidak menjadi kegiatan pokok, memenuhi kehati-hatian, analisis biaya-manfaat, kewajaran kerja sama, dan regulasi; serta wajib memperoleh izin OJK untuk setiap rencana. Aplikasi untuk lembaga jasa keuangan bukan bank hanya boleh dalam satu grup dan untuk mendukung operasional umum.',
    cadence: 'Sebelum setiap rencana penyediaan jasa TI', owner: 'Direksi, TI, Strategi Bisnis, Risiko, dan Legal/Compliance',
    focus: ['Validasi kelayakan calon pengguna jasa dan lingkup layanan.', 'Pastikan layanan bukan kegiatan pokok Bank dan memiliki manfaat yang dapat dipertanggungjawabkan.', 'Kelola proses persetujuan OJK sebelum komitmen/implementasi.'],
    evidence: ['Analisis kelayakan, biaya-manfaat, dan kehati-hatian.', 'Identitas/status pengawasan pengguna jasa.', 'Dokumen permohonan izin, kontrak, dan governance layanan.'],
    reporting: 'Izin diperlukan untuk setiap rencana penyediaan jasa TI; realisasi dilaporkan setelah implementasi.', refs: ['REF-11', 'REF-09', 'REF-14']
  }),
  r({
    id: 'POJK-49-50', chapter: 'IX', chapter_title: 'Penyediaan Jasa TI oleh Bank', pillar: 'Pihak Ketiga & Cross-Border',
    title: 'Ajukan izin penyediaan jasa TI melalui kanal OJK dan realisasikan dalam enam bulan',
    summary: 'Permohonan izin penyediaan jasa TI disampaikan daring melalui sistem perizinan dan registrasi terintegrasi OJK, atau melalui sistem pelaporan OJK bila sarana belum tersedia. Setelah izin diperoleh, Bank wajib menjalankan rencana paling lama 6 bulan; jika tidak, izin tidak berlaku.',
    cadence: 'Pra-implementasi; realisasi paling lama 6 bulan setelah izin', owner: 'TI, Legal/Compliance, dan Regulatory Reporting',
    focus: ['Kelola checklist kelengkapan dan keputusan internal sebelum pengajuan.', 'Pantau persetujuan regulator, target implementasi, dan masa berlaku izin.', 'Arsipkan bukti kanal, pengajuan, izin, dan realisasi.'],
    evidence: ['Bukti pengajuan serta izin OJK.', 'Project plan/contract dan bukti implementasi.', 'Register batas waktu izin.'],
    reporting: 'Realisasi kegiatan penyediaan jasa TI dilaporkan paling lama 3 bulan setelah implementasi.', refs: ['REF-09', 'REF-11', 'REF-14']
  }),
  r({
    id: 'POJK-53', chapter: 'X', chapter_title: 'Pengendalian dan Audit Intern', pillar: 'Pengendalian, Audit & Pelaporan',
    title: 'Laksanakan sistem pengendalian intern TI secara efektif',
    summary: 'Bank wajib menerapkan sistem pengendalian intern yang efektif dalam penyelenggaraan TI. Sistem minimum mencakup pengawasan manajemen dan budaya pengendalian; identifikasi/penilaian risiko; kegiatan pengendalian dan pemisahan fungsi; dukungan sistem informasi-akuntansi-komunikasi; serta pemantauan dan koreksi penyimpangan. Sistem pendukung harus memadai secara teknologi, SDM, dan organisasi.',
    cadence: 'Berkelanjutan; pengujian dan monitoring berkala', owner: 'Manajemen, Satuan Kerja TI, Risiko, dan Audit Intern',
    focus: ['Rancang kontrol preventif, detektif, korektif, serta segregasi tugas untuk proses TI.', 'Bangun budaya control ownership dan mekanisme tindakan koreksi.', 'Pantau efektivitas kontrol dengan indikator serta uji yang dapat ditelusuri.'],
    evidence: ['Matriks kontrol dan pemisahan fungsi.', 'Hasil control self-assessment atau monitoring.', 'Register temuan dan corrective action plan.'],
    reporting: 'Kondisi pengendalian menjadi input audit, pengawasan manajemen, dan laporan TI.', refs: ['REF-12', 'REF-16']
  }),
  r({
    id: 'POJK-54', chapter: 'X', chapter_title: 'Pengendalian dan Audit Intern', pillar: 'Pengendalian, Audit & Pelaporan',
    title: 'Laksanakan audit intern TI efektif, berbasis risiko, dan didukung jejak audit',
    summary: 'Bank melaksanakan fungsi audit intern TI yang efektif dan menyeluruh sesuai ketentuan audit intern Bank. Bank wajib memastikan jejak audit seluruh kegiatan penyelenggaraan TI tersedia bagi pengawasan, penegakan hukum, sengketa, verifikasi, pengujian, dan pemeriksaan lain. Audit intern TI dilakukan sesuai kebutuhan, prioritas, dan analisis risiko paling sedikit satu kali setahun.',
    cadence: 'Paling sedikit 1 kali per tahun; berbasis kebutuhan, prioritas, dan risiko', owner: 'Satuan Kerja Audit Intern dan Satuan Kerja TI',
    focus: ['Susun audit universe TI dan rencana audit berbasis risiko.', 'Pastikan logging/audit trail lengkap, terlindungi, tersedia, dan dapat ditelusuri.', 'Kelola temuan, rekomendasi, dan validasi penyelesaian.'],
    evidence: ['Rencana audit TI dan laporan audit.', 'Standar/konfigurasi audit trail serta bukti retensi.', 'Register temuan dan status tindak lanjut.'],
    reporting: 'Hasil audit intern disampaikan sesuai ketentuan fungsi audit intern Bank umum.', refs: ['REF-12', 'REF-16']
  }),
  r({
    id: 'POJK-55', chapter: 'X', chapter_title: 'Pengendalian dan Audit Intern', pillar: 'Pengendalian, Audit & Pelaporan',
    title: 'Miliki pedoman audit TI dan lakukan kaji ulang eksternal independen',
    summary: 'Bank wajib memiliki pedoman audit intern atas penyelenggaraan TI dan melakukan kaji ulang terhadap fungsi audit intern TI paling sedikit sekali dalam tiga tahun menggunakan jasa pihak ekstern yang independen. Hasil kaji ulang dan hasil audit intern TI disampaikan kepada OJK sebagai bagian pelaporan sesuai ketentuan fungsi audit intern bagi bank umum.',
    cadence: 'Pedoman berkelanjutan; external review paling sedikit 1 kali setiap 3 tahun', owner: 'Satuan Kerja Audit Intern',
    focus: ['Tetapkan metodologi, kompetensi, kualitas, dan pelaporan audit TI dalam pedoman.', 'Rencanakan external quality review oleh pihak independen.', 'Konsolidasikan laporan kaji ulang dan audit sesuai kanal pelaporan yang berlaku.'],
    evidence: ['Pedoman audit intern TI.', 'Kontrak, laporan, dan tindak lanjut kaji ulang eksternal.', 'Bukti pelaporan hasil audit/kaji ulang.'],
    reporting: 'Disampaikan sebagai bagian laporan kaji ulang eksternal independen dan laporan pelaksanaan/pokok hasil audit intern.', refs: ['REF-12', 'REF-16']
  }),
  r({
    id: 'POJK-58', chapter: 'XI', chapter_title: 'Pelaporan', pillar: 'Pengendalian, Audit & Pelaporan',
    title: 'Laporkan rencana pengembangan TI satu tahun ke depan dan kelola perubahan rencana',
    summary: 'Bank wajib melaporkan rencana pengembangan TI yang akan diimplementasikan satu tahun ke depan paling lambat akhir November sebelum tahun rencana. Perubahan rencana dapat dilakukan paling banyak sekali hingga akhir Juni tahun berjalan; perubahan di luar periode tersebut memerlukan pertimbangan tertentu dan persetujuan OJK. OJK dapat meminta penyesuaian atas perubahan tersebut.',
    cadence: 'Tahunan; perubahan paling banyak 1 kali sampai akhir Juni tahun berjalan', owner: 'Satuan Kerja TI, Perencanaan Korporasi, dan Regulatory Reporting',
    focus: ['Buat kalender penyusunan, persetujuan, dan penyampaian rencana.', 'Tentukan governance perubahan, kriteria materialitas, dan jejak keputusan.', 'Pastikan rencana yang dilaporkan konsisten dengan strategi TI dan portofolio proyek.'],
    evidence: ['Rencana pengembangan TI tahunan.', 'Bukti penyampaian kepada OJK.', 'Log perubahan rencana dan, bila ada, persetujuan OJK.'],
    reporting: 'Paling lambat akhir November sebelum tahun rencana; perubahan mengikuti batas waktu dan persetujuan yang berlaku.', refs: ['REF-12', 'REF-13', 'REF-16']
  }),
  r({
    id: 'POJK-59', chapter: 'XI', chapter_title: 'Pelaporan', pillar: 'Pengendalian, Audit & Pelaporan',
    title: 'Laporkan kondisi terkini penyelenggaraan TI setelah akhir tahun pelaporan',
    summary: 'Bank wajib melaporkan kondisi terkini penyelenggaraan TI paling lama 15 hari kerja setelah akhir tahun pelaporan. Laporan ini menjadi wadah pelaporan hasil yang secara eksplisit dipersyaratkan pada POJK, termasuk maturitas keamanan siber, hasil uji kerentanan, dan maturitas digital.',
    cadence: 'Tahunan; paling lama 15 hari kerja setelah akhir tahun pelaporan', owner: 'Satuan Kerja TI, Keamanan Siber, Risiko, dan Regulatory Reporting',
    focus: ['Tetapkan daftar kontribusi, owner, review, dan approval laporan.', 'Rekonsiliasikan hasil self-assessment, pengujian, audit, dan kondisi TI.', 'Kelola bukti penyampaian serta koreksi atas temuan kualitas data laporan.'],
    evidence: ['Paket laporan kondisi terkini TI.', 'Working paper konsolidasi dan persetujuan internal.', 'Bukti penyampaian melalui sistem pelaporan OJK.'],
    reporting: 'Paling lama 15 hari kerja setelah akhir tahun pelaporan.', refs: ['REF-12', 'REF-13', 'REF-16']
  }),
  r({
    id: 'POJK-60', chapter: 'XI', chapter_title: 'Pelaporan', pillar: 'Pengendalian, Audit & Pelaporan',
    title: 'Notifikasikan dan laporkan insiden TI signifikan sesuai SLA regulator',
    summary: 'Jika terjadi insiden TI yang berpotensi dan/atau telah mengakibatkan kerugian signifikan dan/atau gangguan kelancaran operasional Bank, Bank wajib memberikan notifikasi awal paling lama 24 jam setelah insiden diketahui dan laporan insiden paling lama 5 hari kerja setelah diketahui. Apabila otoritas lain menetapkan jangka waktu lebih cepat, Bank wajib menyampaikan kepada OJK pada saat bersamaan sesuai ketentuan tersebut.',
    cadence: 'Berbasis kejadian; notifikasi awal 24 jam dan laporan 5 hari kerja', owner: 'Incident Management, TI, Keamanan Siber, Risiko, Legal/Compliance, dan Regulatory Reporting',
    focus: ['Definisikan kriteria insiden signifikan dan jalur aktivasi insiden.', 'Siapkan template notifikasi awal serta proses pengumpulan fakta yang cepat.', 'Sinkronkan kewajiban lintas regulator dan catat waktu diketahui/pengiriman.'],
    evidence: ['Kebijakan dan playbook incident management.', 'Timeline penanganan dan bukti notifikasi/laporan.', 'Post-incident review dan corrective action plan.'],
    reporting: 'Notifikasi awal elektronik tertulis dalam 24 jam; laporan insiden dalam 5 hari kerja setelah diketahui.', refs: ['REF-13', 'REF-15', 'REF-16']
  }),
  r({
    id: 'POJK-61-62', chapter: 'XI', chapter_title: 'Pelaporan', pillar: 'Pengendalian, Audit & Pelaporan',
    title: 'Sampaikan laporan realisasi dan laporan POJK melalui sistem pelaporan OJK',
    summary: 'Bank wajib menyampaikan laporan realisasi penempatan Sistem Elektronik/DRC luar negeri, pemrosesan transaksi luar negeri, dan/atau kegiatan sebagai penyedia jasa TI paling lama tiga bulan setelah implementasi. Laporan pengujian siber berbasis skenario, rencana pengembangan TI, kondisi terkini TI, insiden TI, serta realisasi disampaikan daring melalui sistem pelaporan OJK.',
    cadence: 'Paling lama 3 bulan setelah implementasi; kanal daring sesuai ketentuan OJK', owner: 'Regulatory Reporting bersama Pemilik Kegiatan',
    focus: ['Kelola daftar peristiwa yang memicu laporan realisasi.', 'Validasi kelengkapan dan konsistensi informasi sebelum submit.', 'Arsipkan bukti pengiriman, acknowledgment, dan tindak lanjut regulator.'],
    evidence: ['Register kewajiban pelaporan POJK.', 'Laporan realisasi dan bukti submit.', 'Daftar validasi kualitas data pelaporan.'],
    reporting: 'Laporan realisasi paling lama 3 bulan setelah implementasi; laporan lain disampaikan melalui sistem pelaporan OJK.', refs: ['REF-12', 'REF-13', 'REF-14', 'REF-16']
  }),
  r({
    id: 'POJK-63-64', chapter: 'XI', chapter_title: 'Pelaporan', pillar: 'Pengendalian, Audit & Pelaporan',
    title: 'Kendalikan kepatuhan waktu dan kelengkapan laporan untuk menghindari sanksi',
    summary: 'Keterlambatan notifikasi awal insiden TI dapat dikenai teguran tertulis dan, jika belum dipenuhi, larangan produk baru, pembekuan kegiatan tertentu, dan/atau penurunan penilaian faktor tata kelola. Laporan yang tidak lengkap dapat dikenai sanksi atas kesalahan informasi sesuai ketentuan pelaporan Bank melalui sistem pelaporan OJK.',
    cadence: 'Setiap kewajiban pelaporan dan setiap kejadian insiden', owner: 'Regulatory Reporting, Legal/Compliance, dan Pemilik Data Laporan',
    focus: ['Gunakan kalender SLA regulator dan kontrol cut-off waktu.', 'Laksanakan quality assurance, maker-checker, dan rekonsiliasi data.', 'Eskalasi risiko keterlambatan/ketidaklengkapan sebelum batas waktu.'],
    evidence: ['Kalender kepatuhan dan dashboard status laporan.', 'Checklist kelengkapan, approval, dan audit trail submit.', 'Register eskalasi serta tindakan koreksi atas kesalahan laporan.'],
    reporting: 'Kepatuhan waktu dan kualitas laporan harus dapat dibuktikan melalui bukti submit serta quality review.', refs: ['REF-13', 'REF-15', 'REF-16']
  }),
  r({
    id: 'POJK-66', chapter: 'XII', chapter_title: 'Penilaian Tingkat Maturitas Digital Bank', pillar: 'Maturitas & Transisi',
    title: 'Lakukan self-assessment maturitas digital Bank sedikitnya setiap tahun',
    summary: 'Bank wajib melakukan penilaian sendiri tingkat maturitas digital secara berkala paling sedikit sekali dalam setahun dengan mempertimbangkan seluruh aspek penyelenggaraan TI. Hasilnya wajib disampaikan sebagai bagian laporan kondisi terkini penyelenggaraan TI Bank.',
    cadence: 'Paling sedikit 1 kali per tahun', owner: 'Direksi, Satuan Kerja TI, Transformasi Digital, dan Risiko',
    focus: ['Tetapkan lingkup, metodologi, data sumber, serta governance penilaian.', 'Hubungkan hasil maturitas dengan roadmap perbaikan transformasi digital.', 'Pastikan hasil terintegrasi dengan laporan kondisi terkini TI.'],
    evidence: ['Metodologi dan hasil self-assessment maturitas digital.', 'Gap analysis dan roadmap peningkatan.', 'Bukti penyampaian dalam laporan kondisi terkini TI.'],
    reporting: 'Disampaikan sebagai bagian laporan kondisi terkini penyelenggaraan TI.', refs: ['REF-12', 'REF-16']
  }),
  r({
    id: 'POJK-67-69', chapter: 'XIII', chapter_title: 'Ketentuan Peralihan', pillar: 'Maturitas & Transisi',
    title: 'Kelola penyesuaian kebijakan, kontrak penyedia, dan rencana strategis dalam masa transisi',
    summary: 'Bank yang telah memiliki kebijakan, standar, prosedur, dan pedoman manajemen risiko TI harus menyesuaikannya dengan POJK paling lama enam bulan sejak berlaku. Bank yang sudah menggunakan penyedia jasa TI harus menyesuaikan perjanjian yang ada. Rencana strategis TI harus disesuaikan paling lambat akhir November 2022.',
    cadence: 'Ketentuan transisi; tetap relevan sebagai bukti histori kepatuhan dan baseline kontrak/kebijakan', owner: 'Legal/Compliance, TI, Vendor Management, dan Perencanaan Korporasi',
    focus: ['Pelihara evidence gap assessment dan program penyesuaian awal POJK.', 'Pastikan kontrak legacy mengakomodasi kewajiban pengamanan, audit, subkontrak, exit, dan akses OJK.', 'Catat keputusan atas sisa gap atau pengecualian transisi.'],
    evidence: ['Gap assessment dan rencana remediasi transisi.', 'Amandemen kontrak penyedia jasa TI.', 'Dokumen penyesuaian rencana strategis TI.'],
    reporting: 'Menjadi bukti kepatuhan historis pada ketentuan peralihan.', refs: ['REF-17', 'REF-16']
  }),
  r({
    id: 'POJK-70-73', chapter: 'XIV', chapter_title: 'Ketentuan Penutup', pillar: 'Maturitas & Transisi',
    title: 'Pahami penerapan perdana, keberlakuan ketentuan pelaksanaan, pencabutan regulasi lama, dan tanggal berlaku',
    summary: 'Penilaian maturitas keamanan siber, pengujian berbasis kerentanan/skenario, dan maturitas digital dilaksanakan pertama kali setelah ditetapkan OJK. Ketentuan pelaksanaan POJK 38/2016 sebagaimana diubah POJK 13/2020 tetap berlaku sepanjang tidak bertentangan, sedangkan regulasi tersebut dicabut. POJK 11/2022 mulai berlaku tiga bulan sejak diundangkan.',
    cadence: 'Referensi berkelanjutan saat menilai dasar hukum dan ketentuan pelaksanaan', owner: 'Legal/Compliance dan Pemilik Kebijakan TI',
    focus: ['Gunakan register regulasi untuk mencatat hubungan POJK, ketentuan pelaksanaan, dan regulasi yang dicabut.', 'Pastikan kebijakan internal merujuk dasar hukum yang tepat dan mutakhir.', 'Pantau ketentuan lanjutan OJK yang mengaktifkan/memperinci kewajiban tertentu.'],
    evidence: ['Register regulasi dan legal inventory.', 'Matriks pemetaan kebijakan internal terhadap ketentuan aktif.', 'Catatan monitoring ketentuan pelaksanaan OJK.'],
    reporting: 'Tidak ada laporan tersendiri; digunakan sebagai dasar interpretasi dan pembaruan kepatuhan.', refs: ['REF-17', 'REF-16']
  }),
];

const refRoleTranslations = (title) => ({
  bod: `Mode Direksi/Dewan Komisaris: gunakan “${title}” untuk mengawasi keputusan, risiko, dan tindak lanjut yang material.`,
  sysadmin: `Mode Tim TI: jadikan “${title}” sebagai daftar kerja dan bukti operasional yang dapat ditelusuri.`,
  legal: `Mode Legal & Compliance: gunakan “${title}” untuk memastikan dasar hukum, dokumen, dan komunikasi regulator terjaga.`,
});

const ref = ({ id, title, type, scope, summary, contains, used_by }) => ({ id, title, type, scope, summary, contains, used_by, roleTranslations: refRoleTranslations(title) });

const references = [
  ref({ id: 'REF-01', title: 'Cakupan dan istilah utama POJK 11/2022', type: 'Cakupan Regulasi', scope: 'Pasal 1 dan konteks peraturan', summary: 'Referensi definisi Bank, TI, Sistem Elektronik, Pusat Data, Pusat Pemulihan Bencana, Rencana Pemulihan Bencana, Direksi, dan Dewan Komisaris yang menjadi fondasi pembacaan POJK.', contains: ['Definisi dan pihak yang dicakup', 'Hubungan TI, Sistem Elektronik, Pusat Data, dan DRC', 'Konteks penerapan bagi bank umum, cabang bank asing, dan UUS'], used_by: [] }),
  ref({ id: 'REF-02', title: 'Peta tata kelola TI dan akuntabilitas organ Bank', type: 'Dokumen Tata Kelola', scope: 'Bab II, Pasal 2–10', summary: 'Peta dokumen dan forum untuk menerapkan tata kelola TI, tujuh aspek tata kelola, mandat pengurus, Komite Pengarah TI, serta unit penyelenggara TI.', contains: ['Kebijakan, standar, prosedur, dan siklus pengkinian', 'RACI dan struktur organisasi TI', 'Piagam Komite Pengarah TI dan register keputusan'], used_by: ['POJK-02', 'POJK-03', 'POJK-04', 'POJK-05', 'POJK-06', 'POJK-07', 'POJK-08'] }),
  ref({ id: 'REF-03', title: 'Arsitektur TI dan rencana strategis TI', type: 'Dokumen Tata Kelola', scope: 'Bab III, Pasal 11–14', summary: 'Referensi artefak arsitektur TI, roadmap, rencana strategis, perubahan signifikan, dan jadwal penyampaian rencana strategis kepada OJK.', contains: ['Baseline dan target architecture', 'Roadmap serta rencana strategis TI', 'Bukti penyampaian atau perubahan rencana strategis TI'], used_by: ['POJK-05', 'POJK-07', 'POJK-08', 'POJK-11', 'POJK-12-13'] }),
  ref({ id: 'REF-04', title: 'Manajemen risiko, pengamanan informasi, jaringan, dan DRP', type: 'Dokumen Tata Kelola', scope: 'Bab IV, Pasal 15–20', summary: 'Kumpulan artefak manajemen risiko TI dan pengamanan operasi, termasuk risk register, keamanan informasi, kontrol jaringan, BIA, DRP, serta hasil pengujian.', contains: ['Metodologi risiko TI dan dashboard risiko', 'Kebijakan keamanan informasi dan standar jaringan', 'BIA, DRP, hasil uji, dan review tahunan'], used_by: ['POJK-15', 'POJK-16', 'POJK-17', 'POJK-18', 'POJK-19', 'POJK-37'] }),
  ref({ id: 'REF-05', title: 'Program ketahanan dan keamanan siber', type: 'Dokumen Tata Kelola', scope: 'Bab V, Pasal 21–28', summary: 'Referensi program siklus ketahanan siber, self-assessment maturitas, pengujian keamanan siber, scenario exercise, dan independensi fungsi siber.', contains: ['Inventaris aset/ancaman/kerentanan dan playbook respons', 'Working paper maturitas keamanan siber', 'Laporan vulnerability testing dan scenario exercise'], used_by: ['POJK-21', 'POJK-22', 'POJK-23-24', 'POJK-25', 'POJK-26'] }),
  ref({ id: 'REF-06', title: 'Manajemen penyedia jasa TI dan exit strategy', type: 'Dokumen Pihak Ketiga', scope: 'Bab VI, Pasal 29–34', summary: 'Referensi untuk mengelola pihak penyedia jasa TI dari identifikasi kebutuhan, pemilihan, kontrak, pengawasan, reassessment materialitas, sampai kondisi kritis dan exit.', contains: ['Due diligence dan klasifikasi materialitas', 'Klausul kontrak, SLA, audit, subkontrak, kerahasiaan, dan akses OJK', 'Vendor monitoring, contingency plan, serta exit plan'], used_by: ['POJK-29', 'POJK-30', 'POJK-31', 'POJK-32', 'POJK-36', 'POJK-39'] }),
  ref({ id: 'REF-07', title: 'Penempatan Sistem Elektronik, Pusat Data, dan DRC', type: 'Perizinan & Lokasi', scope: 'Bab VII, Pasal 35–42', summary: 'Peta keputusan lokasi Sistem Elektronik dan persyaratan keberlangsungan usaha untuk Pusat Data maupun Pusat Pemulihan Bencana.', contains: ['Inventaris lokasi sistem dan data-flow', 'Kriteria penempatan di luar Indonesia', 'Bukti kesiapan Pusat Data/DRC dan kelangsungan usaha'], used_by: ['POJK-35', 'POJK-36', 'POJK-37', 'POJK-39'] }),
  ref({ id: 'REF-08', title: 'Checklist permohonan izin kegiatan TI lintas negara', type: 'Perizinan & Lokasi', scope: 'Pasal 36 dan Pasal 39', summary: 'Checklist persyaratan untuk penempatan Sistem Elektronik/DRC atau pemrosesan transaksi berbasis TI di luar Indonesia, termasuk country risk, perlindungan rahasia Bank, pilihan hukum, pengawasan OJK, dan manfaat bisnis.', contains: ['Country risk assessment dan data-flow', 'Pernyataan pengawasan OJK dan akses pemeriksaan', 'Kontrak penyedia, pilihan hukum, dan rencana SDM'], used_by: ['POJK-35', 'POJK-36', 'POJK-39'] }),
  ref({ id: 'REF-09', title: 'Kanal perizinan dan batas implementasi enam bulan', type: 'Perizinan & Lokasi', scope: 'Pasal 40–41 dan Pasal 49–50', summary: 'Referensi kanal permohonan izin daring/alternatif serta batas waktu implementasi enam bulan setelah izin OJK diperoleh; izin tidak berlaku jika tidak direalisasikan dalam jangka waktu tersebut.', contains: ['Sistem perizinan dan registrasi terintegrasi OJK', 'Alternatif sistem pelaporan OJK', 'Register izin, target go-live, dan bukti realisasi'], used_by: ['POJK-35', 'POJK-36', 'POJK-39', 'POJK-40-41', 'POJK-48', 'POJK-49-50'] }),
  ref({ id: 'REF-10', title: 'Data governance dan pelindungan data pribadi', type: 'Dokumen Data & Privasi', scope: 'Bab VIII, Pasal 43–47', summary: 'Referensi ownership dan kualitas data, sistem/sumber daya pengelolaan data, penerapan prinsip pelindungan data pribadi, DPIA, dan pertukaran data pribadi.', contains: ['Data governance operating model', 'DPIA dan mitigasi risiko pemrosesan berisiko tinggi', 'Data-sharing agreement, consent, dan sarana transfer aman'], used_by: ['POJK-16', 'POJK-43', 'POJK-44', 'POJK-45'] }),
  ref({ id: 'REF-11', title: 'Penyediaan jasa TI oleh Bank', type: 'Perizinan & Lokasi', scope: 'Bab IX, Pasal 48–52', summary: 'Referensi batas penerima jasa, kewajiban kehati-hatian, analisis biaya-manfaat, izin OJK, serta ketentuan aplikasi kepada lembaga jasa keuangan dalam satu grup.', contains: ['Kelayakan calon pengguna jasa', 'Analisis kehati-hatian dan biaya-manfaat', 'Dokumen izin dan bukti implementasi layanan'], used_by: ['POJK-48', 'POJK-49-50'] }),
  ref({ id: 'REF-12', title: 'Kalender pelaporan rutin penyelenggaraan TI', type: 'Pelaporan Regulator', scope: 'Bab XI, Pasal 58–59 dan 62', summary: 'Referensi tata kelola laporan rencana pengembangan TI dan laporan kondisi terkini penyelenggaraan TI yang menghimpun hasil kewajiban POJK lainnya.', contains: ['Rencana pengembangan TI sebelum tahun rencana', 'Laporan kondisi terkini TI', 'Mekanisme konsolidasi, review, approval, dan bukti submit'], used_by: ['POJK-02', 'POJK-05', 'POJK-12-13', 'POJK-15', 'POJK-22', 'POJK-23-24', 'POJK-53', 'POJK-54', 'POJK-55', 'POJK-58', 'POJK-59', 'POJK-61-62', 'POJK-66'] }),
  ref({ id: 'REF-13', title: 'Kalender SLA pelaporan dan notifikasi', type: 'Batas Waktu', scope: 'Pasal 25, 58–60, 63', summary: 'Daftar tenggat utama: laporan uji skenario 10 hari kerja, rencana pengembangan TI akhir November, laporan kondisi terkini 15 hari kerja setelah akhir tahun, notifikasi insiden 24 jam, serta laporan insiden 5 hari kerja.', contains: ['Matriks peristiwa, tenggat, owner, dan kanal', 'Alert sebelum batas waktu', 'Bukti submit serta pencatatan waktu diketahui/selesai'], used_by: ['POJK-21', 'POJK-22', 'POJK-25', 'POJK-32', 'POJK-58', 'POJK-59', 'POJK-60', 'POJK-61-62', 'POJK-63-64'] }),
  ref({ id: 'REF-14', title: 'Laporan realisasi kegiatan TI berizin', type: 'Pelaporan Regulator', scope: 'Pasal 61–62', summary: 'Referensi laporan realisasi penempatan Sistem Elektronik/DRC luar negeri, pemrosesan transaksi luar negeri, dan kegiatan Bank sebagai penyedia jasa TI, paling lama tiga bulan setelah implementasi.', contains: ['Identifikasi kegiatan berizin yang telah diimplementasikan', 'Data realisasi, tanggal implementasi, dan eviden pendukung', 'Bukti pengiriman melalui sistem pelaporan OJK'], used_by: ['POJK-18', 'POJK-29', 'POJK-30', 'POJK-31', 'POJK-32', 'POJK-35', 'POJK-36', 'POJK-40-41', 'POJK-48', 'POJK-49-50', 'POJK-61-62'] }),
  ref({ id: 'REF-15', title: 'Matriks konsekuensi pelanggaran dan kualitas pelaporan', type: 'Sanksi Administratif', scope: 'Pasal 9, 14, 20, 27, 33, 42, 46, 51, 56, 63–64, dan 66', summary: 'Referensi konsekuensi administratif atas kewajiban yang tidak dipenuhi, termasuk teguran tertulis dan, jika ketidakpatuhan berlanjut, larangan produk baru, pembekuan kegiatan tertentu, dan/atau penurunan faktor tata kelola; juga mencakup risiko kesalahan informasi pada laporan tidak lengkap.', contains: ['Matriks pasal kewajiban dan sanksi', 'Eskalasi sebelum jatuh tempo atau saat terjadi deviasi', 'Rencana remediasi dan bukti pemenuhan'], used_by: ['POJK-60', 'POJK-63-64'] }),
  ref({ id: 'REF-16', title: 'Matriks kepatuhan dan bukti POJK 11/2022', type: 'Dokumen Tata Kelola', scope: 'Seluruh bab operasional', summary: 'Matriks kerja internal untuk menghubungkan setiap pasal kewajiban dengan pemilik kontrol, kebijakan/prosedur, bukti, frekuensi, status gap, risiko, dan kewajiban pelaporan.', contains: ['Katalog requirement dan interpretasi internal', 'Owner, evidence, frequency, dan status gap', 'Register action plan, approval, dan retensi bukti'], used_by: requirements.map((item) => item.id) }),
  ref({ id: 'REF-17', title: 'Ketentuan peralihan dan penutup', type: 'Transisi & Ketentuan', scope: 'Bab XIII–XIV, Pasal 67–73', summary: 'Referensi penyesuaian kebijakan dan kontrak yang telah ada, penyesuaian rencana strategis, penerapan perdana ketentuan tertentu, hubungan dengan POJK lama, pencabutan, serta tanggal berlaku.', contains: ['Gap assessment dan evidence penyesuaian historis', 'Register regulasi aktif/dicabut', 'Monitoring ketentuan lanjutan OJK'], used_by: ['POJK-67-69', 'POJK-70-73'] }),
];

const requirementJson = JSON.stringify(requirements, null, 2) + '\n';
const referenceJson = JSON.stringify(references, null, 2) + '\n';

writeFileSync(resolve(outputDir, 'pojk_11_2022_requirements.json'), requirementJson);
writeFileSync(resolve(outputDir, 'pojk_11_2022_references.json'), referenceJson);
// Fallback bahasa Inggris mempertahankan data regulasi Indonesia agar halaman dan pencarian tidak gagal saat UI berbahasa Inggris.
writeFileSync(resolve(outputDir, 'pojk_11_2022_requirements_en.json'), requirementJson);
writeFileSync(resolve(outputDir, 'pojk_11_2022_references_en.json'), referenceJson);
console.log(`Generated ${requirements.length} POJK requirements and ${references.length} POJK references.`);
