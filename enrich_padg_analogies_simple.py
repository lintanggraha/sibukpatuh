import json

# Load existing requirements
with open('public/data/padg_requirements.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data)} requirements")

# Analogy presets for all PADG requirements (key = requirement ID)
presets = {
    # BAB I
    'I.1': "Definisi adalah 'buku kamus hukum' - tanpa definisi yang jelas,interpretasi PADG akan berantakan seperti terjemahannya.",
    'I.2': "Terminologi adalah 'bahasa compliance' - PSP semua harus bicara satu bahasa agar PADG tidak ambigu.",
    
    # BAB II
    'II.1': "Tujuan PADG adalah 'kompass navigasi' - pastikan semua PSP berlayar dengan arah tepat sesuai wewenang BI.",
    'II.2': "Ruang lingkup adalah 'batas main' - tahu batasan wilayah, jangan main di luar yang tidak diizinkan.",
    'II.3': "Penerapan adalah 'who must comply' - daftar pihak yang wajib patuh: BI, PSP, PJP, PIP, Peserta, SRO, terafiliasi.",
    'II.4': "Skop regulasi adalah 'menu aturan' - 9 area: aktivitas, produk, pricing, inovasi, struktur, tata kelola, pasar, data, pengawasan, pengakhiran, koordinasi.",
    
    # BAB III - Activities
    'III.5': "Tahapan transaksi adalah 'assembly line payment' - inisiasi → otorisasi → kliring → setelmen, setiap step harus benar!",
    'III.6': "Jasa sistem pembayaran adalah 'front office service' - PJP menjadi wajah yang berinteraksi langsung dengan pengguna akhir!",
    'III.7': "Infrastruktur sistem pembayaran adalah 'backbone network' - PIP mengoperasikan jalan raya transaksi dana!",
    'III.8': "Penatausahaan Sumber Dana adalah 'digital vault keeper' - PJP menyimpan dan mengelola dompet elektronik pengguna dengan standar tertinggi!",
    'III.9': "Aktivitas penatausahaan adalah 'account administration' - payment account management & issuance/access to funds.",
    'III.10': "Penerusan transaksi adalah 'payment messaging courier' - PJP mengirim data dan perintah pembayaran antar pihak!",
    
    # BAB III - Products/Sumber Dana
    'III.11': "Produk sistem pembayaran adalah 'menu produk' - Sumber Dana & Akses: dua pilar utama dalam sistem!",
    'III.12': "Sumber Dana adalah 'fuel source' - simpanan, nilai uang elektronik, atau deferred payment yang bisa dipakai untuk bayar!",
    'III.13': "Akses ke Sumber Dana adalah 'withdrawal mechanism' - cara memindahkan dana: transfer kredit/debit using instrumen & kanal!",
    'III.14': "Instrumen pembayaran adalah 'toolbox types' - perintah transfer, uang elektronik, kartu, cek, bilyet giro, lain-lain!",
    'III.15': "Kanal pembayaran adalah 'channels' - fisik, online mobile/internet, atau teknologi baru untuk transfer debit/kredit!",
    'III.16': "Syarat Sumber Dana adalah 'qualifying criteria' - nilai rupiah, untuk ekonomi, stored electronically, represent hak klaim!",
    'III.17': "E-money definition adalah 'pre-funded digital money' - diterbitkan atas dana yang disetorkan sebelumnya, bukan simpanan bank!",
    'III.18': "Nilai uang elektronik bisa dipindahkan - 'transferable balance' untuk kepentingan pemindahan dana!",
    'III.19': "Closed vs open loop adalah 'ecosystem boundaries' - closed: private network (GoPay), open: public network (Visa).",
    'III.20': "Media storage e-money adalah 'storage type' - server based vs chip based; registered vs unregistered user!",
    
    # BATASAN & PRUDENSIAL
    'III.21': "Batas nilai e-money adalah 'risk-based limits' - unregistered: 2M simpanan/20M transaksi/bulan; registered: 20M/40M.",
    'III.22': "Izin closed-loop adalah 'minimum threshold' - dana float >=1M miliarmemerlukan izin PJP, plus manajemen risiko & konsumen!",
    'III.23': "Dana float adalah 'segregated trust account' - bukan aset PJP, milik pengguna, harus dipisahkan & dilaporkan sebagai kewajiban!",
    'III.24': "Pemanfaatan dana float adalah 'restricted use' - hanya untuk memenuhi kewajiban ke pengguna, prohibited untuk operasional!",
    'III.25': "Pencatatan dana float adalah 'nominative ledger' - registered: daftar nama pengguna; unregistered: nomor dan nilai!",
    'III.26': "Penempatan dana float adalah 'safe custody rules' - min 30% kas/giro bank KBMI4, max 70% surat berharga/rekening BI!",
    'III.27': "Keamanan enhanced adalah '2FA mandatory' - uang elektronik >2M wajib two-factor auth atau standar keamanan lain yang disetujui!",
    'III.28': "Biaya e-money adalah 'fee transparency' - biaya pembelian, top up, tarik tunai off-us, transfer antarpengguna wajib sesuai kebijakan BI!",
    'III.29': "E-money lintas batas adalah 'cross-border with local partner' - penerbit asing harus kerja sama dengan bank KBMI4 dan interkoneksi BI!",
    'III.30': "E-money syariah adalah 'sharia-compliant e-cash' - aturan PADG berlaku, penempatan dana float di rekening giro syariah bank KBMI4!",
    
    # LKD
    'III.31': "LKD adalah 'digital finance expansion' - PJP penerbit e-money boleh menjadi penyelenggara LKD lewat agen!",
    'III.32': "izin LKD adalah 'approval requirement' - persetujuan BI wajib sebelum operasikan LKD, sesuai mekanisme pengembangan aktivitas!",
    'III.33': "Agen LKD adalah 'agent network criteria' - capabilities, fixed place, due diligence, financial soundness, other BI criteria!",
    'III.34': "Petunjuk teknis LKD adalah 'operational guidance' - dipublikasikan di laman BI atau media yang ditetapkan.",
    
    # KARTU
    'III.35': "Alat pembayaran kartu adalah 'card payment instruments' - kartu kredit & ATM/debit, fisik atau virtual dengan karakteristik sama!",
    'III.36': "Standar nasional kartu adalah 'national standard adoption' - wajib pakai standar alat pembayaran using kartu yang ditetapkan BI!",
    'III.37': "Kartu kredit adalah 'credit facility card' - sumber dana deferred payment, wajib ikut charakteristik Pasal 10 ayat(2)!",
    'III.38': "Ketentuan teknis kartu kredit adalah 'microprudential limits' - usia min, pendapatan min, plafon maks, jumlah PJP, pembayaran min ditetapkan SRO+d persetujuan BI!",
    'III.39': "Petunjuk teknis kartu kredit adalah 'implementation framework' - dipublikasikan lewat laman BI atau media lain!",
    'III.40': "Kartu ATM/debit adalah 'debit instrument' - langsung kurangi simpanan pemegang kartu di bank/LSB berwenang!",
    'III.41': "Petunjuk teknis kartu ATM/debit adalah 'operational specs' - dipublikasikan lewat laman BI atau media lain!",
    
    # CEK & BILYET GIRO
    'III.42': "Cek adalah 'cheque instrument' - penyelenggaraan sesuai UU perbankan yang berlaku.",
    'III.43': "Bilyet giro adalah 'banker's draft' - penyelenggaraan sesuai ketentuan BI tentang bilyet giro!",
    
    # KANAL & PENYIMPANAN DATA
    'III.44': "Kanal pembayaran adalah 'payment access points' - fisik, online mobile/internet, atau teknologi tertentu dengan risk management & consumer protection!",
    'III.45': "Kanal lintas batas adalah 'cross-border channel' - lewat kerja sama PJP/PIP dengan penyelenggara luar negeri sesuai kebijakan BI!",
    'III.46': "Penyimpanan data instrumen adalah 'payment token storage' - platform penyimpanan data kartu dengan ≥300k pengguna aktif wajib izin PJP!",
    
    # NILAI YANG DAPAT DIPERSAMAAN
    'III.47': "Nilai yang dapat dipersamakan adalah 'digital bearer asset' - nilai digital/virtual coin yang bisa dipakai bayar tapi bukan uang Rupiah!",
    
    # PRICING
    'III.48': "Kebijakan harga adalah 'price regulation authority' - BI menetapkan skema harga dalam penyelenggaraan Sistem Pembayaran dengan pertimbangan nasional, efisiensi, continuity, acceptance!",
    'III.49': "Transparansi harga adalah 'pricing disclosure principle' - PSP, peserta & penunjang wajib transparan pada skema harga yang dipatuhi!",
    
    # INNOVASI
    'III.50': "Ruang uji coba inovasi adalah 'innovation sandbox facility' - BI fasilitasi lewat ruang uji coba atau bentuk lain seperti market intelligence!",
    'III.51': "Prinsip sandbox adalah 'sandbox operating principles' - criteria-based, transparansi, proporsionalitas, fairness, kesetaraan, forward looking!",
    'III.52': "Pusat inovasi adalah 'payment innovation center' - BI dapat membentuk atau menunjuk pihak lain untuk menyelenggarakan pusat inovasi!",
    'III.53': "Uji coba inovasi adalah 'pilot testing scope' - inovasi baru/limit, inovasi kebijakan, atau inovasi yang perlu didorong secara luas!",
    'III.54': "Sumber uji coba adalah 'innovation sources' - permohonan dari PSP/pihak lain atau inisiatif BI, pusat inovasi, pihak lain!",
    'III.55': "Permohonan uji coba adalah 'formal application' - harus tertulis dalam Bahasa Indonesia ke BI atau pihak yang ditunjuk!",
    'III.56': "Dokumen pendukung adalah 'supporting docs' - profil peserta, narahubung, data inovasi (fitur, manfaat, risiko, skenario, ruang lingkup, jangka waktu)!",
    'III.57': "Durasi uji coba adalah 'test period' - maksimal 6 bulan, bisa perpanjangan 1x6 bulan dengan alasan dan permohonan sebelum berakhir!",
    'III.58': "Kebijakan selama uji coba adalah 'conditional sandboxing' - BI bisa batasi wilayah, user count, waktu, atau beri kemudahan selama uji coba!",
    'III.59': "Status hasil uji coba adalah 'final verdict' - berhasil (lanjut full) atau tidak berhasil (revise/discontinue), diumumkan via surat!",

    # BAB IV
    'IV.1': "Struktur industri adalah 'industry classification' - sistem pembayaran terdiri dari PSP, PJP, PIP, Peserta, Penunjang, SRO.",
    'IV.2': "PSP definition adalah 'payment service provider' - bank umum/LSBU yang menyelenggarakan jasa atau infrastruktur sistem pembayaran!",
    'IV.3': "PJP adalah 'payment service company' - PSP yang menyediakan jasa untuk memfasilitasi transaksi pembayaran kepada pengguna!",
    'IV.4': "PIP adalah 'infrastructure operator' - PSP yang menyelenggarasikan infrastruktur untuk pemindahan dana peserta!",
    'IV.5': "Penyelenggara Penunjang adalah 'supporting entity' - pihak yang menyelenggarakankegiatan pendukung untuk PSP/Peserta!",
    'IV.6': "Peserta adalah 'infrastructure participant' - pihak yang dapat terhubung ke PIP dengan persetujuan untuk layanan!",
    'IV.7': "Pihak Terhubung adalah 'data network node' - pihak yang terhubung ke infrastruktur data sistem pembayaran dengan persetujuan!",
    'IV.8': "Pengguna Jasa adalah 'end-user consumer' - pihak yang menggunakan produk/jasa PSP untuk keperluan pembayaran!",
    'IV.9': "Penyedia Barang/Jasa adalah 'merchant acceptor' - pihak yang menjual dan menerima pembayaran dari transaksi!",
    'IV.10': "SRO adalah 'self-regulatory organization' - forum/institusi berbadan hukum Indonesia yang mewakili industri dan ditetapkan BI!",
    'IV.11': "SBP adalah 'medium-term business plan' - dokumen tertulis rencana kegiatan usaha dan pengembangan strategis mid-term!",
    'IV.12': "RBSP adalah 'short-term business plan' - dokumen rencana kegiatan usaha jangka pendek dan realisasi tahun sebelumnya!",
    
    # BAB V - Tata Kelola & Risiko
    'V.1': "Pengawasan aktifDireksi/Komisaris adalah 'board accountability' - aktif mengawasi, menetapkan appetite, dan membangun budaya risiko siber!",
    'V.2': "Kerangka manajemen risiko adalah 'risk management framework' - strategi, organisasi, kebijakan, prosedur, dan limit yangkomprehensif!",
    'V.3': "Kriteria risiko inheren adalah 'inherent risk factors' - teknologi, produk bank, karakteristik organisasi, rekam jejak insiden siber!",
    'V.4': "Penerapan kontrol adalah 'control effectiveness' - kualitas implementasi kontrol dinilai dari peringkat Strong sampai Unsatisfactory!",
    'V.5': "Penilaian risiko inheren tahunan adalah 'annual risk snapshot' - posisi akhir Desember, dengan pengkinian sewaktu-waktu jika perlu!",
    'V.6': "Limit risiko adalah 'risk thresholds' - batasan yang dapat diterima untuk setiap jenis risiko, dengan eskalasi approval yang jelas!",
    'V.7': "Ketahanan siber adalah 'cyber resilience' - identifikasi, pelindungan, deteksi, tanggap, pulih - siklus lengkap untuk bertahan dan pulih!",
    'V.8': "Identifikasi aset adalah 'crown jewels discovery' - inventaris aset krusial, mapping dependency, riskProfiling untuk prioritas!",
    'V.9': "Pelindungan adalah 'preventive & protective controls' - access control, encryption, patching, security awareness, hardening!",
    'V.10': "Deteksi adalah 'detection & monitoring' - security operations, SIEM, anomaly detection, threat hunting capabilities!",
    'V.11': "Tanggap adalah 'incident response' - CSIRT, playbook, communication plan, forensic, eradication, recovery!",
    'V.12': "Pemulihan adalah 'business recovery' - restorasi layanan, kasus telecom, lessons learned, continuous improvement!",
    'V.13': "Uji kerentanan adalah 'vulnerability assessment' - scan dan identifikasi celah sistem secara sistematis, periodic!",
    'V.14': "Penetration testing adalah 'simulated attack' - uji serangan nyata untuk menguji effectiveness kontrol secara langsung!",
    'V.15': "Berskala exercise adalah 'scenario-based drill' - simulate serangan lintas fungsi untukuji kesiapan org & tog!",
    'V.16': "Fungsi siber independen adalah 'independent cyber function' - unit siberFW yang lapor langsung ke Direksi, bebas conflict of interest!",
    'V.17': "Tim tanggap insiden adalah 'incident response team' - tim khusus siap 24/7 dengan otoritas dan playbook jelas!",
    'V.18': "Laporan assessment adalah 'risk assessment report' - hasil konsolidasi risiko inheren dan maturity diserahkan ke Direksi!",
    'V.19': "Pelaporan insiden adalah 'incident reporting' - insiden siber signifikan dilaporkan ke BI paling lambat X hari!",
    'V.20': "Tingkat risiko adalah 'risk rating determination' - gabung inherent risk + maturity = final risk level (High/Medium/Low)!",
    
    # BAB VI
    'VI.1': "Praktik pasar adalah 'market conduct standards' - etika bisnis, fair competition, transparency dalam hubungan antar industri!",
    'VI.2': "Standar operasional adalah 'SOP enforcement' - prosedur standar untuk operasi harian sistem pembayaran harus konsisten!",
    'VI.3': "APU/PPT adalah 'anti-money laundering shield' - PSP wajib terapkan program APU/PPT sesuai Peraturan Otoritas Jasa Keuangan!",
    'VI.4': "Perlindungan konsumen adalah 'consumer protection regime' - proteksi dari penyalahgunaan data, transaksi tidak sah, praktik tidak adil!",
    'VI.5': "Kerahasiaan data adalah 'data confidentiality' - informasi konsumen tak boleh disalahgunakan atau disebarluaskan tanpa izin!",
    'VI.6': "Portabilitas data adalah 'right to data portability' - konsumen dapat memindahkan data finansial ke penyedia layanan lain!",
    'VI.7': "Penyelesaian sengketa adalah 'dispute resolution mechanism' - penyelesaian keluhan konsumen cepat, adil, dan independen!",
    'VI.8': "Kontrak adalah 'fair contract terms' - syarat perjanjian tidak one-sided, jelas, dan mudah dipahami konsumen!",
    'VI.9': "Layanan kritis adalah 'critical services maintenance' - layanan esensial tetap opera meskiada gangguan!",
    'VI.10': "Kontinuitas bisnis adalah 'business continuity & disaster recovery' - rencana pulih gangguan dengan RTO/RPO tertentu!",
    'VI.11': "Infrastruktur kritis adalah 'critical payment infrastructure' - komponen sistem pembayaran yang esensial, jika down maka sistem gagal!",
    'VI.12': "Keandalan sistem adalah 'system availability & performance' - SLA uptime, latency, dan capacity yang terukur dan dijamin!",
    'VI.13': "Monitoring transaksi adalah 'transaction monitoring system' - deteksi pola transaksimencurigakan untuk fraud & money laundering!",
    'VI.14': "Pencegahan fraud adalah 'fraud prevention framework' - kontrol, deteksi, tanggap, dan pencegahan penipuan secara terintegrasi!",
    'VI.15': "Kepatuhan regulasi adalah 'regulatory compliance management' - sistem memastikan semua ketentuan peraturan dipatuhi!",
    'VI.16': "Pelaporan ke BI adalah 'regulatory reporting' - laporan berkala (bulanan/quarterly) tentang kinerja, risiko, kepatuhan!",
    'VI.17': "Audit eksternal adalah 'independent external audit' - audit oleh auditor independen untuk verifikasi laporan keuangan & kontrol!",
    'VI.18': "Self-assessment adalah 'self-assessment mechanism' - PSP melakukan penilaian sendiri risiko dan kontrol, lalu laporkan ke BI!",
    'VI.19': "Review manajemen adalah 'management review process' - peninjauan berkala Direksi terhadap performa risiko & kontrol siber!",

    # BAB VII
    'VII.1': "Pengelolaan data adalah 'data governance framework' - kebijakan, proses, quality, metadata, dan stewardship untuk data sistem pembayaran!",
    'VII.2': "Keamanan data adalah 'data security controls' - enkripsi, access control, DLP, backup, dan security monitoring untuk data sensitif!",
    'VII.3': "Privasi data adalah 'data privacy compliance' - perlindungan data pribadi sesuai UU PDP dan pedoman BI!",
    'VII.4': "Penyimpanan data adalah 'data localization requirement' - data transaksi sistem pembayaran wajib disimpan di dalam wilayah Indonesia!",
    'VII.5': "Pertukaran data adalah 'secure data interchange' - pertukaran data antar-PSP dengan encryption dan authentication yang kuat!",
    'VII.6': "Retensi data adalah 'data retention & disposal' - periode retensi sesuai ketentuan, lalu destroy/archive dengan aman!",
    
    # BAB VIII
    'VIII.1': "Kewenangan pengawasan adalah 'supervisory powers' - hak BI untuk memeriksa, meminta data, dan meminta penjelasan dari PSP!",
    'VIII.2': "Pemeriksaan lapangan adalah 'onsite examination' - inspeksi langsung ke tempat usaha PSP untuk review sistem, dokumen, dan kontrol!",
    'VIII.3': "Pemeriksaan jarak jauh adalah 'offsite supervision' - monitoring lewat laporan, sistem elektronik, dan data yang dikirimkan PSP!",
    'VIII.4': "Pengambilan data adalah 'data collection authority' - hak BI mengambil salinan data/sistem/dokumen terkait penyelenggaraan!",
    'VIII.5': "Pemberian tahu adalah 'show cause order' - PSP diminta menjelaskan tindakan atau ketidakpatuhan tertentu kepada BI!",
    'VIII.6': "Sanksi adalah 'enforcement & penalties' - BI dapat menerapkan sanksi administratif, denda, suspensi, atau pencabutan izin!",
    
    # BAB IX
    'IX.1': "Pengakhiran sukarela adalah 'voluntary termination' - PSP mengakhiran usaha dengan prosedur yang ditetapkan, melindungi konsumen!",
    'IX.2': "Pengakhiran paksaan adalah 'involuntary termination' - BI mencabut izin jika PSP melanggar berat, bubar, atau tidak memenuhi syarat!",
    'IX.3': "Alihdaya usaha adalah 'business continuity transfer' - alihdaya usaha ke pihak lain dengan persetujuan BI dan perlindungan konsumen!",
    'IX.4': "Alihdaya aset adalah 'asset & liability transfer' - pemindahan aset dan kewajiban secara transparan dan teratur!",
    'IX.5': "Likuidasi adalah 'liquidation & winding up' - proses hukum ketika PSP bankrupt, prioritas: dana konsumen!",
    'IX.6': "Pengembalian dana adalah 'consumer refund priority' - dana pengguna harus dikembalikan terlebih dahulu sebelum creditor lain!",
    'IX.7': "Penghapusan data adalah 'data destruction' - data konsumen dihapus sesuai retensi policy setelah berhenti beroperasi!",
    'IX.8': "Penanganan sengketa adalah 'dispute resolution post-termination' - mekanisme keluhan konsumen setelah PSP berhenti!",
    'IX.9': "Pembekuan aset adalah 'asset freeze during transition' - aset dana float dibeku selama proses pengakhiran untuklindungi konsumen!",
    
    # BAB X
    'X.1': "Koordinasi internal adalah 'intra-BI coordination' - koordinasi antar divisi di BI untuk sinkronisasi regulasi dan pengawasan!",
    'X.2': "Koordinasi lintas sektor adalah 'inter-agency cooperation' - kerja sama BI dengan OJK, Kemenkeu, dan otoritas lain untuk sinergi!",
    'X.3': "Pertukaran informasi adalah 'information sharing' - berbagi data risiko, ancaman, dan tren untuk meningkatkan keamanan kolektif!",
    'X.4': "Kerja sama internasional adalah 'international collaboration' - kerja sama dengan bank sentral asing dan forum international untuk cross-border payments!",
    'X.5': "Harmonisasi adalah 'regulatory harmonization' - selaraskan PADG dengan standar internasional dan praktik global terbaik!",
    'X.6': "Komite koordinasi adalah 'coordination forum' - forum rutin untuk update, diskusi, dan penyelesaian isu bersama!",
    'X.7': "Pemberitahuan insiden adalah 'incident escalation' - insiden siber besar harus dilaporkan ke BI dan otoritas terkait!",
    'X.8': "Respon darurat adalah 'crisis management coordination' - koordinasi darurat lorsqu'une gangguan sistem pembayaran berskala besar terjadi!",
    'X.9': "Forum industri adalah 'industry dialogue platform' - diskusi regulasi antara BI, PSP, SRO, dan stakeholders!",
    'X.10': "Konsultasi publik adalah 'public consultation process' - BI.open for feedback sebelum finalizing rules!",
    'X.11': "Penyelidikan adalah 'investigative authority' - hak BI menyelidiki dugaan pelanggaran dan mengumpulkan evidence!",
    'X.12': "Penerapan bertahap adalah 'transitional arrangement' - PSP yang sudah ada diberi waktu untuk menyesuaikan dengan PADG baru!",
    
    # BAB XI
    'XI.1': "Pengharmonisan regulasi adalah 'regulatory hierarchy' - PADG bekerja alongside UU Perbankan, UU PDP, UU KEK, dan regulasi OJK!",
    'XI.2': "Konflik norma adalah 'conflict resolution rule' - peraturan yang lebih spesifik atau baru berlaku jika bertentangan dengan peraturan lama!",
    
    # BAB XII
    'XII.1': "Kewenangan penetapan adalah 'delegated rule-making' - BI berwenang menetapkan peraturan teknis, keputusan, dan surat edaran!",
    'XII.2': "Penyesuaian adalah 'adaptive regulatory power' - BI bisa mengubah, menyesuaikan, dan menambah ketentuan seiring perkembangan!",
    'XII.3': "Penerapan dalih adalah 'transitional provisions' - PSP yang sudah beroperasi perlu menyesuaikan dalam periode transisi!",
    'XII.4': "Pengawasan lintas batas adalah 'cross-border oversight' - kerja sama dengan otoritas asing untuk pengawasan PSP dan transaksi internasional!",
    'XII.5': "Kewajiban laporan adalah 'reporting duty' - PSP wajib menyampaikan data dan informasi setiap kali diminta oleh BI!",
    'XII.6': "Pengundangan adalah 'official enactment' - PADG berlaku sejak diundangkan di Berita Negara Republik Indonesia!",
}

# Enrich
enriched = 0
fixed_summaries = 0
for req in data:
    rid = req['id']
    
    # Fix empty summaries: use title if summary empty/short
    if not req.get('summary') or len(req['summary'].strip()) < 20:
        if req.get('title'):
            req['summary'] = req['title'][:500]
        fixed_summaries += 1
    
    # Add analogy
    if rid in presets:
        req['analogy'] = presets[rid]
        enriched += 1
    elif not req.get('analogy') or not req['analogy'].strip():
        # Smarter fallback using pillar & chapter names
        pil = req.get('pillar', '')
        pil_map = {
            'Governance': 'tata kelola', 'Activities': 'aktivitas operasional',
            'Products': 'produk instrumen', 'RiskManagement': 'manajemen risiko',
            'Pricing': 'skema harga', 'Innovation': 'inovasi',
            'Supervision': 'pengawasan', 'Reporting': 'pelaporan'
        }
        pil_text = pil_map.get(pil, 'kepatuhan')
        title = req.get('title', '')[:80]
        req['analogy'] = f"Kewajiban {req.get('chapter_title','')}: '{title}' - bagian dari {pil_text} yang wajib dipatuhi PSP."
        enriched += 1

# Save
with open('public/data/padg_requirements.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"\n[OK] Enriched {enriched} with analogies (presets: {len(presets)})")
print(f"[OK] Fixed {fixed_summaries} empty summaries")
print(f"[OK] Total: {len(data)} requirements")

# Verify
missing_anal = [r for r in data if not r.get('analogy')]
print(f"[MISSING] Missing analogies: {len(missing_anal)}")

# Show examples
print("\n--- Examples ---")
for r in [data[0], data[50], data[100], data[200], data[300], data[400]]:
    print(f"\n{r['id']} [{r['pillar']}]: {r['title'][:60]}")
    print(f"  Summary: {(r['summary'] or '')[:80]}")
    print(f"  Analogy: {r['analogy'][:100]}")
