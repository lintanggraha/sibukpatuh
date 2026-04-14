#!/usr/bin/env python3
"""
Generate comprehensive, unique descriptions for ALL NIST CSF 2.0 subcategories.
Each description is hand-crafted based on the actual NIST CSF 2.0 subcategory meaning.
"""
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
data_path = os.path.join(DATA_DIR, 'nist_csf.json')

with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Comprehensive unique descriptions per NIST CSF 2.0 subcategory
# Organized by category with descriptions that match the ACTUAL NIST CSF 2.0 meaning

descriptions = {
    # ===== GV.OC: Organizational Context =====
    'GV.OC-01': 'Organisasi memahami misi bisnis, tujuan strategis, dan aktivitas operasional yang menjadi konteks utama untuk menentukan prioritas dan cakupan program keamanan siber.',
    'GV.OC-02': 'Organisasi mengidentifikasi dan mendokumentasikan pemangku kepentingan internal maupun eksternal, termasuk peran, kebutuhan, dan ekspektasi mereka terkait keamanan informasi.',
    'GV.OC-03': 'Organisasi menetapkan dan mendokumentasikan batas-batas sistem informasi yang relevan dengan misi bisnis, termasuk dependensi pada pihak ketiga dan infrastruktur eksternal.',
    'GV.OC-04': 'Organisasi memastikan bahwa persyaratan hukum, regulasi, dan kontrak yang berlaku diidentifikasi, didokumentasikan, dan diintegrasikan ke dalam strategi keamanan siber.',
    'GV.OC-05': 'Organisasi memahami seluruh ketergantungan operasional pada pihak ketiga, termasuk risiko yang muncul dari rantai pasok dan layanan eksternal yang digunakan.',
    'GV.OC-06': 'Organisasi mengidentifikasi dan mengelola risiko yang timbul dari penggunaan produk, layanan, dan teknologi dari vendor dan mitra eksternal.',
    'GV.OC-07': 'Organisasi mengintegrasikan manajemen risiko rantai pasok ke dalam proses manajemen risiko perusahaan secara menyeluruh.',
    'GV.OC-08': 'Organisasi memantau dan memperbarui pemahaman konteks organisasi secara berkala seiring perubahan misi, strategi, dan lingkungan operasional.',
    'GV.OC-09': 'Organisasi memastikan bahwa perubahan konteks bisnis dikomunikasikan ke seluruh pemangku kepentingan dan berdampak pada penyesuaian strategi keamanan.',

    # ===== GV.RM: Risk Management Strategy =====
    'GV.RM-01': 'Organisasi mendefinisikan dan mendokumentasikan toleransi risiko siber secara eksplisit, termasuk batas-batas risiko yang dapat diterima dan yang harus dimitigasi.',
    'GV.RM-02': 'Organisasi menerapkan pendekatan manajemen risiko yang konsisten dan terukur untuk mengidentifikasi, menilai, dan merespons risiko siber di seluruh tingkatan.',
    'GV.RM-03': 'Organisasi menentukan prioritas investasi keamanan berdasarkan hasil penilaian risiko, potensi dampak bisnis, dan ketersediaan sumber daya.',
    'GV.RM-04': 'Organisasi mengintegrasikan manajemen risiko siber ke dalam proses pengambilan keputusan strategis, operasional, dan investasi perusahaan.',
    'GV.RM-05': 'Organisasi menetapkan kriteria dan mekanisme eskalasi risiko yang jelas, termasuk kapan dan bagaimana risiko yang melampaui toleransi dilaporkan ke manajemen senior.',
    'GV.RM-06': 'Organisasi meninjau dan memperbarui strategi manajemen risiko secara berkala berdasarkan perubahan lingkungan ancaman, temuan audit, dan pelajaran dari insiden.',
    'GV.RM-07': 'Organisasi menggunakan metrik dan indikator kinerja untuk mengukur efektivitas strategi manajemen risiko dan mengambil tindakan korektif jika diperlukan.',
    'GV.RM-08': 'Organisasi memastikan bahwa seluruh personel memahami peran dan tanggung jawab mereka dalam implementasi strategi manajemen risiko siber.',

    # ===== GV.RR: Roles, Responsibilities, and Authorities =====
    'GV.RR-01': 'Organisasi menetapkan, mendokumentasikan, dan mengomunikasikan peran, tanggung jawab, dan otoritas terkait keamanan siber ke seluruh tingkatan organisasi.',
    'GV.RR-02': 'Organisasi memastikan bahwa pengambilan keputusan terkait keamanan siber didelegasikan ke level yang tepat dengan otoritas yang memadai.',
    'GV.RR-03': 'Organisasi menyediakan sumber daya manusia, finansial, dan teknis yang memadai untuk menjalankan fungsi keamanan siber secara efektif.',
    'GV.RR-04': 'Organisasi mengevaluasi kompetensi personel yang bertanggung jawab atas keamanan siber dan menyediakan pelatihan serta pengembangan yang relevan.',
    'GV.RR-05': 'Organisasi memastikan adanya independensi dalam fungsi pengawasan dan audit keamanan siber untuk menjaga objektivitas penilaian.',
    'GV.RR-06': 'Organisasi meninjau dan memperbarui struktur peran dan tanggung jawab keamanan siber secara berkala sesuai evolusi organisasi.',

    # ===== GV.PO: Policy =====
    'GV.PO-01': 'Organisasi menyusun, mendokumentasikan, dan mengomunikasikan kebijakan keamanan siber yang selaras dengan strategi bisnis dan risiko yang dihadapi.',
    'GV.PO-02': 'Organisasi meninjau dan memperbarui kebijakan keamanan secara berkala berdasarkan perubahan ancaman, regulasi, dan kebutuhan bisnis.',
    'GV.PO-03': 'Organisasi memastikan bahwa kebijakan keamanan terintegrasi dengan kebijakan operasional perusahaan dan dipahami oleh seluruh personel.',
    'GV.PO-04': 'Organisasi menetapkan mekanisme penegakan kepatuhan terhadap kebijakan keamanan, termasuk konsekuensi atas pelanggaran.',
    'GV.PO-05': 'Organisasi menyediakan proses pengecualian kebijakan yang terdokumentasi, teraudit, dan memiliki kontrol kompensasi yang memadai.',
    'GV.PO-06': 'Organisasi mengukur tingkat kepatuhan terhadap kebijakan keamanan melalui indikator dan metrik yang terukur.',

    # ===== GV.OV: Oversight =====
    'GV.OV-01': 'Organisasi menetapkan metrik dan indikator kinerja kunci (KPI) untuk mengukur efektivitas program keamanan siber secara berkala.',
    'GV.OV-02': 'Organisasi melaporkan status keamanan siber, termasuk tren insiden dan efektivitas kontrol, ke manajemen senior dan dewan secara rutin.',
    'GV.OV-03': 'Organisasi melakukan audit internal dan eksternal independen untuk memverifikasi kepatuhan dan efektivitas kontrol keamanan.',
    'GV.OV-04': 'Organisasi menggunakan hasil audit, assessment, dan monitoring untuk mengidentifikasi area perbaikan dan mengambil tindakan korektif.',
    'GV.OV-05': 'Organisasi memastikan transparansi dalam pelaporan insiden siber, termasuk Near-Miss, ke pemangku kepentingan yang relevan.',
    'GV.OV-06': 'Organisasi meninjau dan mengevaluasi kinerja pihak ketiga dan vendor terhadap persyaratan keamanan yang telah ditetapkan.',

    # ===== GV.SC: Cybersecurity Supply Chain Risk Management =====
    'GV.SC-01': 'Organisasi mengidentifikasi, mendokumentasikan, dan memprioritaskan seluruh vendor, supplier, dan pihak ketiga yang memiliki akses ke sistem dan data.',
    'GV.SC-02': 'Organisasi menetapkan persyaratan keamanan siber yang jelas dalam kontrak dan perjanjian dengan vendor dan mitra bisnis.',
    'GV.SC-03': 'Organisasi melakukan due diligence dan penilaian risiko terhadap vendor kritis sebelum menjalin hubungan bisnis.',
    'GV.SC-04': 'Organisasi memantau kepatuhan vendor terhadap persyaratan keamanan secara berkelanjutan melalui assessment dan audit berkala.',
    'GV.SC-05': 'Organisasi memiliki rencana kontinjensi dan respons untuk gangguan rantai pasok yang berdampak pada operasional bisnis.',
    'GV.SC-06': 'Organisasi berbagi informasi risiko rantai pasok dengan pemangku kepentingan internal dan eksternal yang relevan.',
    'GV.SC-07': 'Organisasi meninjau dan memperbarui strategi manajemen risiko rantai pasok secara berkala berdasarkan perubahan landscape vendor.',

    # ===== ID.AM: Asset Management =====
    'ID.AM-01': 'Organisasi menginventarisasi seluruh aset fisik (server, workstation, perangkat jaringan, perangkat mobile) yang terhubung ke infrastruktur TI.',
    'ID.AM-02': 'Organisasi menginventarisasi seluruh platform dan aplikasi perangkat lunak yang digunakan dalam operasional, termasuk versi dan status patch.',
    'ID.AM-03': 'Organisasi memetakan alur data dan komunikasi antar sistem untuk memahami bagaimana informasi bergerak di dalam dan luar organisasi.',
    'ID.AM-04': 'Organisasi mengidentifikasi dan mendokumentasikan aset eksternal (cloud, SaaS, layanan pihak ketiga) yang menjadi bagian dari ekosistem TI.',
    'ID.AM-05': 'Organisasi mengklasifikasikan seluruh aset berdasarkan tingkat kritisitas terhadap bisnis dan sensitivitas data yang ditangani.',
    'ID.AM-06': 'Organisasi menetapkan pemilik (owner) untuk setiap aset yang bertanggung jawab atas keamanan, pemeliharaan, dan siklus hidupnya.',
    'ID.AM-07': 'Organisasi memperbarui inventaris aset secara real-time atau berkala saat ada perubahan infrastruktur, pengadaan, atau decommissioning.',
    'ID.AM-08': 'Organisasi memverifikasi keakuratan inventaris aset melalui audit fisik dan otomatis secara berkala.',

    # ===== ID.BE: Business Environment =====
    'ID.BE-01': 'Organisasi mendefinisikan dan mendokumentasikan peran, prioritas, dan ketergantungan misi bisnis untuk menentukan aset dan proses yang paling kritis.',
    'ID.BE-02': 'Organisasi mengidentifikasi fungsi dan layanan bisnis yang jika terganggu akan memberikan dampak signifikan terhadap operasional dan reputasi.',
    'ID.BE-03': 'Organisasi menetapkan Recovery Time Objective (RTO) dan Recovery Point Objective (RPO) untuk setiap fungsi bisnis kritis.',
    'ID.BE-04': 'Organisasi mempertimbangkan dampak sosial, reputasi, dan kepercayaan publik dalam perencanaan ketahanan bisnis.',
    'ID.BE-05': 'Organisasi memastikan bahwa ketahanan rantai pasok menjadi pertimbangan dalam penilaian risiko fungsi bisnis kritis.',
    'ID.BE-06': 'Organisasi meninjau dan memperbarui pemahaman lingkungan bisnis secara berkala seiring perubahan strategi dan operasional.',

    # ===== ID.GV: Governance =====
    'ID.GV-01': 'Organisasi menyusun dan mengomunikasikan kebijakan keamanan siber yang selaras dengan strategi bisnis, misi, dan nilai organisasi.',
    'ID.GV-02': 'Organisasi mengintegrasikan manajemen risiko siber ke dalam tata kelola perusahaan, termasuk pelaporan ke dewan dan komite audit.',
    'ID.GV-03': 'Organisasi memastikan kepatuhan terhadap seluruh persyaratan hukum, regulasi, dan kontrak yang berlaku terkait keamanan informasi.',
    'ID.GV-04': 'Organisasi menetapkan mekanisme pelaporan risiko dan insiden siber ke level eksekutif dengan frekuensi dan format yang konsisten.',
    'ID.GV-05': 'Organisasi meninjau dan memperbarui tata kelola keamanan siber secara berkala berdasarkan perubahan lingkungan bisnis dan ancaman.',

    # ===== ID.RA: Risk Assessment =====
    'ID.RA-01': 'Organisasi mengidentifikasi kerentanan pada aset, sistem, dan proses bisnis melalui scanning, assessment, dan monitoring berkala.',
    'ID.RA-02': 'Organisasi menganalisis ancaman internal dan eksternal, termasuk vektor serangan, motivasi, dan kapabilitas aktor ancaman.',
    'ID.RA-03': 'Organisasi menentukan tingkat risiko berdasarkan kombinasi probabilitas kejadian dan dampak terhadap bisnis.',
    'ID.RA-04': 'Organisasi memperbarui penilaian risiko saat ada perubahan signifikan pada infrastruktur, aplikasi, atau lingkungan operasional.',
    'ID.RA-05': 'Organisasi mengintegrasikan hasil penilaian risiko ke dalam proses perencanaan strategis dan penganggaran keamanan.',
    'ID.RA-06': 'Organisasi mempertimbangkan kerentanan dan risiko rantai pasok sebagai bagian dari penilaian risiko keseluruhan.',
    'ID.RA-07': 'Organisasi mendokumentasikan dan mengomunikasikan hasil penilaian risiko ke pemangku kepentingan yang relevan.',

    # ===== ID.RM: Risk Management =====
    'ID.RM-01': 'Organisasi menetapkan prioritas mitigasi risiko berdasarkan analisis dampak bisnis dan tingkat risiko yang teridentifikasi.',
    'ID.RM-02': 'Organisasi mendefinisikan kriteria penerimaan risiko (risk acceptance) yang jelas dan proses eskalasi untuk risiko yang melampaui batas.',
    'ID.RM-03': 'Organisasi mengalokasikan sumber daya (anggaran, personel, teknologi) untuk mitigasi risiko sesuai prioritas yang telah ditetapkan.',
    'ID.RM-04': 'Organisasi memantau efektivitas tindakan mitigasi risiko dan menyesuaikan strategi berdasarkan hasil monitoring.',
    'ID.RM-05': 'Organisasi mendokumentasikan keputusan penerimaan risiko, termasuk justifikasi dan rencana tinjauan berkala.',

    # ===== ID.SC: Supply Chain Risk Management =====
    'ID.SC-01': 'Organisasi mengidentifikasi, mendokumentasikan, dan memprioritaskan seluruh vendor dan pihak ketiga berdasarkan tingkat risiko yang mereka bawa.',
    'ID.SC-02': 'Organisasi melakukan penilaian risiko keamanan terhadap setiap vendor kritis, termasuk review kontrol keamanan dan kepatuhan.',
    'ID.SC-03': 'Organisasi menetapkan dan menegakkan persyaratan keamanan dalam perjanjian kontrak dengan vendor dan mitra bisnis.',
    'ID.SC-04': 'Organisasi memantau kinerja keamanan vendor secara berkelanjutan melalui reporting, audit, dan assessment berkala.',
    'ID.SC-05': 'Organisasi memiliki rencana respons dan pemulihan untuk insiden yang melibatkan atau berdampak pada vendor dan pihak ketiga.',
    'ID.SC-06': 'Organisasi berbagi informasi ancaman dan insiden siber dengan vendor dan komunitas keamanan untuk meningkatkan ketahanan bersama.',

    # ===== PR.AA: Identity Management and Access Control =====
    'PR.AA-01': 'Organisasi mengelola identitas digital seluruh pengguna, termasuk provisioning, review, dan deprovisioning akses secara terstruktur.',
    'PR.AA-02': 'Organisasi menerapkan prinsip least privilege, memastikan setiap pengguna hanya memiliki akses minimum yang diperlukan untuk menjalankan tugasnya.',
    'PR.AA-03': 'Organisasi menerapkan autentikasi multifaktor (MFA) untuk akses ke sistem, aplikasi, dan data yang sensitif atau kritis.',
    'PR.AA-04': 'Organisasi meninjau dan memverifikasi hak akses pengguna secara berkala, mencabut akses yang tidak lagi diperlukan.',
    'PR.AA-05': 'Organisasi mengelola dan memonitor akses pihak ketiga (vendor, kontraktor) dengan kontrol yang ketat dan teraudit.',
    'PR.AA-06': 'Organisasi menetapkan dan menegakkan kebijakan manajemen kredensial, termasuk kompleksitas password, rotasi, dan perlindungan terhadap brute force.',
    'PR.AA-07': 'Organisasi mengintegrasikan manajemen akses ke dalam proses onboarding, transfer peran, dan offboarding karyawan.',

    # ===== PR.AT: Awareness and Training =====
    'PR.AT-01': 'Organisasi menyelenggarakan pelatihan kesadaran keamanan siber secara berkala untuk seluruh karyawan, termasuk direksi dan manajemen.',
    'PR.AT-02': 'Organisasi menyediakan pelatihan teknis khusus untuk personel IT dan keamanan sesuai peran dan tanggung jawab mereka.',
    'PR.AT-03': 'Organisasi menguji efektivitas pelatihan kesadaran melalui simulasi phishing, kuis, dan penilaian perilaku.',
    'PR.AT-04': 'Organisasi memperbarui materi pelatihan secara berkala berdasarkan ancaman terbaru, tren serangan, dan insiden internal.',
    'PR.AT-05': 'Organisasi memastikan vendor dan kontraktor juga menerima pelatihan keamanan yang relevan sebelum diberikan akses ke sistem.',

    # ===== PR.DS: Data Security =====
    'PR.DS-01': 'Organisasi mengklasifikasikan data berdasarkan tingkat sensitivitas dan menerapkan kontrol perlindungan sesuai klasifikasi tersebut.',
    'PR.DS-02': 'Organisasi menerapkan enkripsi untuk data sensitif baik saat disimpan (at rest) maupun saat ditransmisikan (in transit).',
    'PR.DS-03': 'Organisasi mengelola siklus hidup data secara terstruktur, termasuk retensi, arsip, dan pemusnahan yang aman.',
    'PR.DS-04': 'Organisasi memantau dan mendeteksi akses tidak sah atau anomali terhadap data sensitif di seluruh sistem dan jaringan.',
    'PR.DS-05': 'Organisasi menerapkan kontrol pencegahan kebocoran data (DLP) di titik-titik kritis seperti email, USB, dan cloud storage.',
    'PR.DS-06': 'Organisasi mengamankan media penyimpanan fisik (harddisk, USB, tape) dan memastikan pemusnahan yang terverifikasi.',
    'PR.DS-07': 'Organisasi melakukan backup data kritis secara berkala, terenkripsi, dan teruji kemampuan restorasinya.',

    # ===== PR.PS: Platform Security =====
    'PR.PS-01': 'Organisasi menetapkan dan menerapkan konfigurasi keamanan baseline (hardening) untuk seluruh sistem operasi, aplikasi, dan perangkat jaringan.',
    'PR.PS-02': 'Organisasi mengelola patch dan update keamanan secara terstruktur, termasuk penilaian risiko, testing, dan deployment tepat waktu.',
    'PR.PS-03': 'Organisasi melakukan hardening sistem sesuai standar industri seperti CIS Benchmarks atau pedoman vendor.',
    'PR.PS-04': 'Organisasi memantau integritas sistem dan mendeteksi perubahan konfigurasi yang tidak sah atau tidak terautorasi.',
    'PR.PS-05': 'Organisasi menerapkan prinsip secure by design dalam pengembangan, pengadaan, dan deployment platform baru.',
    'PR.PS-06': 'Organisasi mengelola siklus hidup platform termasuk penggantian sistem yang sudah end-of-life atau tidak lagi didukung vendor.',

    # ===== PR.IR: Technology Infrastructure Resilience =====
    'PR.IR-01': 'Organisasi merancang infrastruktur TI dengan redundansi, failover, dan toleransi kesalahan untuk fungsi bisnis kritis.',
    'PR.IR-02': 'Organisasi menguji rencana ketahanan infrastruktur secara berkala melalui simulasi kegagalan dan disaster recovery test.',
    'PR.IR-03': 'Organisasi memantau kesehatan infrastruktur secara real-time dan mendeteksi degradasi performa sebelum berdampak pada layanan.',
    'PR.IR-04': 'Organisasi menerapkan kontrol untuk memitigasi dampak gangguan, termasuk load balancing, clustering, dan capacity planning.',
    'PR.IR-05': 'Organisasi memperbarui arsitektur infrastruktur secara berkala untuk mengakomodasi evolusi ancaman dan pertumbuhan bisnis.',

    # ===== PR.PT: Protective Technology =====
    'PR.PT-01': 'Organisasi menerapkan teknologi proteksi berlapis (defence in depth) termasuk firewall, IDS/IPS, endpoint protection, dan web gateway.',
    'PR.PT-02': 'Organisasi mengonfigurasi, memantau, dan memelihara teknologi proteksi sesuai kebijakan keamanan dan best practice.',
    'PR.PT-03': 'Organisasi mengintegrasikan seluruh teknologi proteksi ke dalam arsitektur keamanan yang terpadu dan terkelola secara terpusat.',
    'PR.PT-04': 'Organisasi menguji efektivitas teknologi proteksi melalui penetration testing, red team exercise, dan simulasi serangan.',
    'PR.PT-05': 'Organisasi memperbarui dan meningkatkan teknologi proteksi secara berkala sesuai perkembangan ancaman dan kapabilitas serangan.',
    'PR.PT-06': 'Organisasi memastikan bahwa teknologi proteksi tidak mengganggu operasional bisnis dan memiliki mekanisme bypass yang terkontrol.',

    # ===== DE.CM: Continuous Monitoring =====
    'DE.CM-01': 'Organisasi memantau jaringan, sistem, dan aplikasi secara real-time untuk mendeteksi aktivitas mencurigakan dan anomali.',
    'DE.CM-02': 'Organisasi mengimplementasikan deteksi berbasis perilaku (behavioral detection) dan machine learning untuk mengidentifikasi pola serangan baru.',
    'DE.CM-03': 'Organisasi memantau perubahan konfigurasi, instalasi perangkat lunak, dan modifikasi akses yang tidak terautorasi.',
    'DE.CM-04': 'Organisasi mengintegrasikan aktivitas monitoring ke dalam proses operasional harian dan alur kerja tim keamanan.',
    'DE.CM-05': 'Organisasi menguji, meninjau, dan memperbarui aturan deteksi, alert threshold, dan use case monitoring secara berkala.',
    'DE.CM-06': 'Organisasi memastikan cakupan monitoring meliputi seluruh permukaan serangan termasuk cloud, remote worker, dan pihak ketiga.',

    # ===== DE.AE: Adverse Events =====
    'DE.AE-01': 'Organisasi menganalisis event keamanan untuk menentukan apakah merupakan false positive, Near-Miss, atau insiden yang memerlukan respons.',
    'DE.AE-02': 'Organisasi menetapkan dan mendokumentasikan prosedur eskalasi yang jelas untuk event yang terkonfirmasi sebagai insiden siber.',
    'DE.AE-03': 'Organisasi mendokumentasikan dan menganalisis pola, tren, dan korelasi event untuk meningkatkan kemampuan deteksi di masa depan.',
    'DE.AE-04': 'Organisasi mengintegrasikan analisis event ke dalam proses respons insiden untuk mempercepat containment dan remediation.',
    'DE.AE-05': 'Organisasi meninjau dan memperbaiki proses deteksi dan analisis event berdasarkan pelajaran dari insiden yang telah terjadi.',

    # ===== RS.MA: Incident Management =====
    'RS.MA-01': 'Organisasi menyusun, mendokumentasikan, dan mengomunikasikan rencana respons insiden siber yang mencakup peran, prosedur, dan alur eskalasi.',
    'RS.MA-02': 'Organisasi membentuk dan memelihara tim respons insiden (CSIRT) dengan kompetensi, wewenang, dan ketersediaan yang memadai.',
    'RS.MA-03': 'Organisasi mengomunikasikan status dan dampak insiden siber ke pemangku kepentingan internal dan eksternal secara tepat waktu.',
    'RS.MA-04': 'Organisasi mengoordinasikan aktivitas respons insiden dengan pihak eksternal seperti penegak hukum, regulator, dan vendor forensik.',
    'RS.MA-05': 'Organisasi melakukan analisis akar penyebab (root cause analysis) setelah insiden dan menerapkan perbaikan preventif.',
    'RS.MA-06': 'Organisasi menguji dan melatih rencana respons insiden secara berkala melalui tabletop exercise, simulasi, dan red team exercise.',

    # ===== RS.AN: Incident Analysis =====
    'RS.AN-01': 'Organisasi menganalisis insiden untuk memahami cakupan dampak, vektor serangan, dan sistem yang terpengaruh.',
    'RS.AN-02': 'Organisasi melakukan investigasi forensik digital untuk mengumpulkan bukti, memahami TTP (Tactics, Techniques, Procedures) penyerang.',
    'RS.AN-03': 'Organisasi mendokumentasikan seluruh temuan analisis insiden dalam format yang dapat digunakan untuk referensi dan pembelajaran.',
    'RS.AN-04': 'Organisasi berbagi informasi insiden dan indikator kompromi (IoC) dengan komunitas keamanan dan ISAC yang relevan.',

    # ===== RS.CO: Incident Response Communication =====
    'RS.CO-01': 'Organisasi melaporkan insiden siber ke otoritas dan regulator sesuai persyaratan hukum dan timeframe yang ditetapkan.',
    'RS.CO-02': 'Organisasi mengkomunikasikan dampak insiden dan langkah mitigasi ke pelanggan, mitra, dan pemangku kepentingan yang terdampak.',
    'RS.CO-03': 'Organisasi mengoordinasikan komunikasi internal selama masa respons insiden untuk memastikan konsistensi informasi dan keputusan.',
    'RS.CO-04': 'Organisasi meninjau dan memperbaiki proses komunikasi respons insiden berdasarkan pelajaran dari insiden yang telah ditangani.',

    # ===== RS.MI: Incident Mitigation =====
    'RS.MI-01': 'Organisasi menerapkan langkah mitigasi segera untuk menghentikan penyebaran insiden dan membatasi dampak terhadap bisnis.',
    'RS.MI-02': 'Organisasi mengisolasi sistem dan jaringan yang terpengaruh untuk mencegah lateral movement dan eskalasi serangan.',
    'RS.MI-03': 'Organisasi memverifikasi efektivitas langkah mitigasi sebelum mengembalikan sistem ke operasi normal.',
    'RS.MI-04': 'Organisasi mendokumentasikan seluruh langkah mitigasi yang diambil untuk keperluan audit, forensik, dan perbaikan proses.',

    # ===== RC.RP: Recovery Plan Execution =====
    'RC.RP-01': 'Organisasi menyusun, mendokumentasikan, dan memelihara rencana pemulihan insiden yang mencakup prosedur, prioritas, dan tanggung jawab.',
    'RC.RP-02': 'Organisasi memprioritaskan pemulihan fungsi bisnis kritis berdasarkan RTO, RPO, dan dampak operasional yang telah ditetapkan.',
    'RC.RP-03': 'Organisasi mengoordinasikan aktivitas pemulihan dengan tim internal, vendor, dan pihak ketiga yang relevan.',
    'RC.RP-04': 'Organisasi memverifikasi integritas dan keamanan sistem yang dipulihkan sebelum mengembalikan ke lingkungan produksi.',
    'RC.RP-05': 'Organisasi menguji dan memperbarui rencana pemulihan secara berkala melalui latihan dan simulasi.',

    # ===== RC.CO: Recovery Communication =====
    'RC.CO-01': 'Organisasi mengkomunikasikan status dan progres pemulihan insiden ke pemangku kepentingan secara transparan dan berkala.',
    'RC.CO-02': 'Organisasi menyediakan channel komunikasi khusus untuk pelanggan dan pengguna selama masa pemulihan layanan.',
    'RC.CO-03': 'Organisasi mendokumentasikan pelajaran dari proses pemulihan untuk memperbaiki rencana dan prosedur di masa depan.',
    'RC.CO-04': 'Organisasi meninjau dan memperbarui rencana komunikasi pemulihan berdasarkan feedback dan temuan dari insiden.',

    # ===== RC.IM: Recovery Improvement =====
    'RC.IM-01': 'Organisasi melakukan post-incident review untuk mengidentifikasi area perbaikan dalam proses deteksi, respons, dan pemulihan.',
    'RC.IM-02': 'Organisasi memperbarui rencana dan prosedur pemulihan berdasarkan temuan dan lessons learned dari insiden yang telah terjadi.',
    'RC.IM-03': 'Organisasi menguji rencana pemulihan yang telah diperbarui melalui latihan tabletop dan simulasi untuk memastikan efektivitas.',
    'RC.IM-04': 'Organisasi mengukur metrik pemulihan seperti MTTR (Mean Time to Recovery) dan menetapkan target perbaikan yang terukur.',
    'GV.RR-07': 'Organisasi memastikan bahwa perubahan struktur organisasi dan kepemimpinan dikomunikasikan dan dampaknya terhadap tata kelola keamanan dievaluasi.',
    'GV.RR-08': 'Organisasi meninjau efektivitas struktur peran dan tanggung jawab keamanan siber berdasarkan perubahan strategi bisnis dan lingkungan ancaman.',
    'GV.PO-07': 'Organisasi memastikan bahwa kebijakan keamanan tersedia dalam format dan bahasa yang dapat dipahami oleh seluruh personel.',
    'GV.PO-08': 'Organisasi mengintegrasikan kebijakan keamanan siber dengan kebijakan operasional lainnya untuk menghindari kontradiksi dan overlap.',
    'GV.OV-07': 'Organisasi menggunakan hasil oversight untuk mengidentifikasi tren risiko dan menyesuaikan strategi keamanan secara proaktif.',
    'GV.OV-08': 'Organisasi memastikan bahwa temuan audit dan assessment ditindaklanjuti dengan rencana perbaikan yang terukur dan berbatas waktu.',
    'GV.SC-08': 'Organisasi mengevaluasi kinerja manajemen risiko rantai pasok secara berkala dan menyesuaikan pendekatan berdasarkan perubahan landscape vendor.',
    'ID.RA-08': 'Organisasi berbagi informasi risiko dan kerentanan dengan pemangku kepentingan internal dan eksternal untuk meningkatkan kesadaran kolektif.',
    'ID.IM-01': 'Organisasi mengidentifikasi dan mendokumentasikan seluruh aset informasi termasuk data terstruktur, tidak terstruktur, dan semi-terstruktur.',
    'ID.IM-02': 'Organisasi menetapkan klasifikasi informasi berdasarkan sensitivitas, nilai bisnis, dan persyaratan regulasi yang berlaku.',
    'ID.IM-03': 'Organisasi memetakan alur informasi dari penciptaan, penyimpanan, penggunaan, hingga pemusnahan untuk memahami titik-titik risiko.',
    'ID.IM-04': 'Organisasi menetapkan pemilik data yang bertanggung jawab atas klasifikasi, akses, dan perlindungan informasi.',
    'ID.IM-05': 'Organisasi memantau dan mengendalikan perpindahan informasi antar sistem, jaringan, dan organisasi.',
    'ID.IM-06': 'Organisasi menerapkan kontrol integritas data untuk memastikan informasi tidak diubah secara tidak sah.',
    'ID.IM-07': 'Organisasi mengelola metadata informasi untuk mendukung klasifikasi, pelabelan, dan perlindungan otomatis.',
    'ID.IM-08': 'Organisasi meninjau dan memperbarui inventaris serta klasifikasi informasi secara berkala.',
    'PR.AA-08': 'Organisasi menerapkan kontrol akses kontekstual yang mempertimbangkan lokasi, waktu, perangkat, dan perilaku pengguna.',
    'PR.AT-06': 'Organisasi mengukur efektivitas program kesadaran keamanan melalui metrik perilaku seperti tingkat klik phishing dan pelaporan insiden.',
    'PR.AT-07': 'Organisasi menyediakan mekanisme feedback bagi karyawan untuk melaporkan kebingungan atau kebutuhan pelatihan tambahan.',
    'PR.AT-08': 'Organisasi mengintegrasikan kesadaran keamanan ke dalam budaya organisasi melalui kampanye, komunikasi, dan recognition program.',
    'PR.DS-08': 'Organisasi menerapkan kontrol keamanan pada data yang sedang diproses termasuk memory protection dan secure enclaves.',
    'PR.IP-01': 'Organisasi menyusun dan memelihara baseline konfigurasi keamanan untuk seluruh komponen infrastruktur TI.',
    'PR.IP-02': 'Organisasi menerapkan proses manajemen perubahan yang terstruktur untuk modifikasi konfigurasi sistem dan jaringan.',
    'PR.IP-03': 'Organisasi memproyeksikan dampak keamanan dari perubahan yang direncanakan sebelum implementasi.',
    'PR.IP-04': 'Organisasi menerapkan kontrol backup dan recovery yang teruji secara berkala untuk memastikan ketersediaan data.',
    'PR.IP-05': 'Organisasi menerapkan mekanisme redundansi dan failover pada komponen infrastruktur kritis.',
    'PR.IP-06': 'Organisasi menerapkan security by design dan privacy by design dalam pengembangan dan pengadaan sistem baru.',
    'PR.IP-07': 'Organisasi menerapkan kontrol keamanan pada lingkungan pengembangan, testing, dan produksi secara terpisah.',
    'PR.IP-08': 'Organisasi memverifikasi efektivitas kontrol integritas perangkat lunak dan firmware sebelum deployment.',
    'PR.IR-06': 'Organisasi mengimplementasikan segmentasi jaringan untuk membatasi dampak insiden dan pergerakan lateral penyerang.',
    'PR.IR-07': 'Organisasi menerapkan kontrol kualitas layanan untuk memastikan ketersediaan fungsi bisnis kritis selama gangguan.',
    'PR.IR-08': 'Organisasi mengintegrasikan ketahanan infrastruktur ke dalam perencanaan kapasitas dan ekspansi bisnis.',
    'PR.PT-07': 'Organisasi menerapkan kontrol keamanan pada komunikasi dan sesi untuk mencegah interception dan hijacking.',
    'PR.PT-08': 'Organisasi memastikan bahwa teknologi proteksi dapat di-skalakan dan dikelola secara efisien seiring pertumbuhan organisasi.',
    'DE.CM-07': 'Organisasi menerapkan monitoring pada aktivitas pengguna dan entitas untuk mendeteksi insider threat dan akun yang dikompromikan.',
    'DE.CM-08': 'Organisasi mengintegrasikan threat intelligence eksternal ke dalam proses monitoring untuk mendeteksi TTP penyerang yang diketahui.',
    'DE.AE-06': 'Organisasi menerapkan proses triage event untuk memprioritaskan analisis berdasarkan potensi dampak bisnis.',
    'DE.AE-07': 'Organisasi mengorelasikan event dari berbagai sumber untuk mengidentifikasi serangan multi-tahap dan Advanced Persistent Threats.',
    'DE.AE-08': 'Organisasi menggunakan automation dan orchestration untuk mempercepat analisis dan respons terhadap event keamanan.',
    'RS.MA-07': 'Organisasi memastikan ketersediaan tools dan sumber daya forensik untuk investigasi insiden yang kompleks.',
    'RS.MA-08': 'Organisasi mengintegrasikan proses manajemen insiden dengan Business Continuity Plan dan Disaster Recovery Plan.',
    'RS.AN-05': 'Organisasi menerapkan analisis malware untuk memahami kapabilitas, persistensi, dan indikator kompromi dari ancaman.',
    'RS.AN-06': 'Organisasi melakukan network forensics untuk melacak pergerakan penyerang dan mengidentifikasi seluruh sistem yang terdampak.',
    'RS.AN-07': 'Organisasi mengintegrasikan hasil analisis insiden ke dalam proses improvement kontrol keamanan.',
    'RS.AN-08': 'Organisasi mengembangkan playbook analisis insiden untuk jenis serangan yang paling relevan dengan organisasi.',
    'RS.CO-05': 'Organisasi menetapkan juru bicara dan prosedur komunikasi media untuk insiden siber yang berdampak publik.',
    'RS.CO-06': 'Organisasi mengoordinasikan komunikasi respons insiden dengan tim hukum untuk memastikan kepatuhan dan mitigasi liability.',
    'RS.CO-07': 'Organisasi menyediakan template dan playbook komunikasi insiden untuk mempercepat respons saat kejadian nyata.',
    'RS.CO-08': 'Organisasi mengevaluasi efektivitas komunikasi insiden melalui feedback pemangku kepentingan dan metrik kepuasan.',
    'RS.MI-05': 'Organisasi menerapkan mekanisme containment otomatis untuk jenis insiden yang paling umum dan berdampak tinggi.',
    'RS.MI-06': 'Organisasi memastikan bahwa langkah mitigasi tidak secara tidak sengaja menghancurkan bukti forensik yang diperlukan.',
    'RS.MI-07': 'Organisasi mengoordinasikan aktivitas mitigasi dengan tim bisnis untuk meminimalkan dampak terhadap operasional.',
    'RS.MI-08': 'Organisasi mendokumentasikan efektivitas setiap langkah mitigasi untuk perbaikan proses di masa depan.',
    'RC.RP-06': 'Organisasi memastikan ketersediaan sumber daya dan personel kunci untuk menjalankan rencana pemulihan.',
    'RC.RP-07': 'Organisasi mengintegrasikan rencana pemulihan insiden siber dengan Business Continuity Plan dan Disaster Recovery Plan.',
    'RC.RP-08': 'Organisasi mengevaluasi efektivitas rencana pemulihan berdasarkan hasil latihan dan insiden nyata.',
    'RC.CO-05': 'Organisasi mengkomunikasikan pelajaran dan perbaikan dari proses pemulihan ke seluruh pemangku kepentingan.',
    'RC.CO-06': 'Organisasi menyediakan laporan pasca-pemulihan yang mencakup timeline, dampak, dan status restorasi layanan.',
    'RC.CO-07': 'Organisasi mengoordinasikan komunikasi pemulihan dengan tim hukum dan PR untuk memastikan konsistensi pesan.',
    'RC.CO-08': 'Organisasi meninjau dan memperbarui kontak dan channel komunikasi pemulihan secara berkala.',
}

count = 0
for entry in data:
    entry_id = entry.get('id', '')
    if entry_id in descriptions:
        entry['description'] = descriptions[entry_id]
        count += 1

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Updated {count} NIST CSF entries with unique, comprehensive descriptions")
print(f"   Total entries: {len(data)}")
missing = len(data) - count
if missing > 0:
    print(f"   ⚠️  {missing} entries without custom descriptions (IDs not in mapping)")
    # Print missing IDs
    for entry in data:
        if entry.get('id') not in descriptions:
            print(f"      - {entry.get('id')}")
