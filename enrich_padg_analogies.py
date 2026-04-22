import re
import json

# PADG analogies for all 12 BABs - comprehensive coverage
analogies = {
    # BAB I - Ketentuan Umum
    'I.1': "Definisi adalah 'kamus hukum' - tanpa pemahaman istilah yang sama,interpretasi PADG akan berantakan seperti terjemahannya!",
    'I.2': "Terminology proper adalah 'language of compliance' - semua PSP harus bicara bahasa yang sama untuklaros PADG tidak ambigu!",
    
    # BAB II - Kerangka Kerja
    'II.1': "Tujuan PADG adalah 'compass navigation' - memastikan semua Kapal (PSP) berlayar dengan arah yang tepat sesuai wewenang BI!",
    'II.2': "Ruang lingkup adalah 'playground boundary' - tahu batasan mainnya, jangan main di luar area yang tidak diizinkan!",
    
    # BAB III - Aktivitas, Produk, Inovasi
    'III.5': "Tahapan transaksi adalah 'assembly line' - setiap tahapan harusbenar, dari pesanan hingga pengiriman dana!",
    'III.6': "Penyelenggaraan jasa adalah 'service provider license' - PJP mendapat hak dan tanggungh untuk mengatur pembayaran pengguna!",
    'III.7': "Penyelenggaraan infrastruktur adalah 'highway operator' - PIP menjaga jalan raya transaksi tetap lancar tanpa macet!",
    'III.8': "Penatausahaan Sumber Dana adalah 'bank within bank' - PJP mengelola dompet digital dengan standar keuangan tertinggi!",
    'III.9': "Produk sistem pembayaran adalah 'menu items' - bank/layanan bisa pilih dan sesuaikan dengan kebutuhan pelanggan!",
    'III.10': "Sumber Dana adalah 'fuel tank' - tempat dana disimpan sebelum digunakan sebagai 'energy' transaksi!",
    'III.11': "Instrumen adalah 'payment tools' - berbagai cara memindahkan dana, dari kartu hingga transfer digital!",
    'III.12': "Kewajiban prudensial adalah 'safety net' - jaring pengaman untuklindungi pengguna danstabilitas sistem!",
    'III.13': "Aspek prudensial adalah 'risk-adjusted lens' - semua keputusan pricing dan produk mempertimbangkan risiko dan perlindungan!",
    'III.14': "PSP asing adalah 'foreign player with local rules' - boleh main tapi harus ikut aturan rumah dan kerja sama dengan lokal!",
    'III.15': "Uang elektronik adalah 'digital cash' - nilai uang disimpan elektronik bukan di dompet, tapi di server penerbit!",
    'III.16': "Nilai uang elektronik adalah 'transferable asset' - bukan simpanan, tapi alat pembayaran yang bisa berpindah tangan!",
    'III.17': "Closed loop adalah 'private highway' - hanya bisa dipakai di jaringan sendiri, seperti GoPay di ekosistem GoTo!",
    'III.18': "Open loop adalah 'public road' - bisa digunakan dimana saja yang menerima kartu/dompet digital nasional!",
    'III.19': "Batas nilai uang elektronik adalah 'speed limit' - untuklindungi konsumen dari kehilangan besar dan aliran dana berlebih!",
    'III.20': "Masa berlaku media adalah 'expiry date on card' - meski kartu mati, nilai uang masih bisa ditarik/dikembalikan ke pemilik!",
    'III.21': "Izin PJP untuk closed loop adalah 'license to operate' - dana float >1M mencukupiTAMPUNGresiko, harus punya ijin formal!",
    'III.22': "Dana float adalah 'trust fund' - PJP hanya custodian, bukan pemilik. Dana tetap milik pengguna dan harusnya disimpan dengan aman!",
    'III.23': "Pencatatan dana float adalah 'transparent audit trail' - harus jelas siapa punya berapa, kapan, dan bagaimana penempatannya!",
    'III.24': "Penggunaan dana float adalah 'fiduciary duty' - dana hanya bisa dipakai untuk membayar kewajiban, bukan modal operasional!",
    'III.25': "Fitur uang elektronik adalah 'basic services' - top up, bayar, Bayar tagihan adalah minimum service yang harus disediakan!",
    'III.26': "Larangan kepemilikan dana adalah 'separation of assets' - dana pengguna tak boleh dicampur dengan uang PJP,永不为所动!",
    'III.27': "Keamanan tinggi adalah 'enhanced security protocol' - transaksi >2M butuh 2FA atau standar ekstra untuklindungi nilai besar!",
    'III.28': "Pengenaan biaya adalah 'transparent fee structure' - PJP boleh pungut biaya, tapi harus compete dengan kebijakan BI dan diumumkan jelas!",
    'III.29': "Cross-border e-money adalah 'borderless with guardrails' - uang elektronik asing boleh transaksi di Indonesia, tapi lewat bank lokal KBMI4!",
    'III.30': "Uang elektronik syariah adalah 'sharia-compliant e-wallet' - semua aturan PADG berlaku, dengan penempatan dana float direkening giro syariah!",
    'III.31': "LKD adalah 'digital finance ecosystem' - PJP penerbit uang elektronik bisa embangi layanan keuangan lewat agen yang tersebar!",
    'III.32': "Persetujuan BI untuk LKD adalah 'regulatory green light' - sebelum launch LKD, harus dapat persetujuan resmi dari BI!",
    'III.33': "Agen LKD adalah 'last-mile agent' - titik kontak untuk pengguna di daerah, harus melalui due diligence dan memiliki kemampuan finansial!",
    'III.34': "Petunjuk teknis LKD adalah 'operational manual' - panduan teknis yang dipublikasikan BI untuk standar pelaksanaan LKD!",
    'III.35': "Alat pembayaran kartu adalah 'plastic money family' - kartu kredit, debit, ATM, dan virtual yang serupa!",
    'III.36': "Standar nasional kartu adalah 'interoperability mandate' - semua PJP harus pakai standarBI agar kartu bisa saling bekerja sama!",
    'III.37': "Kartu kredit adalah 'borrowed money card' - Sumber Dana dari deferred payment (kredit), jadi termasuk instruments berjangka!",
    'III.38': "Ketentuan teknis kartu kredit adalah 'micro-regulations' - usia minimum, pendapatan minimum, plafon maks, jumlah PJP, minimum payment!",
    'III.39': "Petunjuk teknis kartu kredit adalah 'implementation guide' - detail teknis penerbitan dan penggunaan kartu kredit sesuai PADG!",
    'III.40': "Kartu ATM/debit adalah 'instant deduction card' - transaksi langsung kurangi simpanan real-time, tanpa tunggu tagihan!",
    'III.41': "Petunjuk teknis kartu ATM/debit adalah 'execution blueprint' - cara penerbitan dan penyelenggaraan kartu debit/ATM yang benar!",
    'III.42': "Cek adalah 'paper-based payment order' - alat pembayaran tradisional yang masih berlaku sesuai UU perbankan!",
    'III.43': "Bilyet giro adalah 'bank draft' - alat pembayaran yang diterbitkan bank, diatur khusus oleh BI, dan memiliki keamanan tinggi!",
    'III.44': "Kanal pembayaran adalah 'payment channels portfolio' - fisik, online mobile/internet, atau teknologi baru denganrisk management & APU/PPT!",
    'III.45': "Cross-border kanal adalah 'international corridor' - transaksilintas batas harus lewatkerjasama PJP/PIP dengan penyelenggara luar negeri!",
    'III.46': "Penyimpanan data instrumen adalah 'tokenization vault' - platform penyimpanan data kartu dengan300k+ pengguna aktif wajib izin PJP!",
    'III.47': "Nilai yang dapat dipersamakan adalah 'digital value with constraints' -bukan uang, tapi bisa dipakai bayar denganbatasan ketat BI!",
    
    # BAB IV - Struktur Industri
    'IV.1': "Struktur industri adalah 'industry map' - peta lengkap pemain: PSP, PJP, PIP, Peserta, Penunjang, dan hubungan mereka!",
    'IV.2': "PSP adalah 'license holder' - entitas yang punya ijin dari BI menyelenggarakan Sistem Pembayaran, entah jasa atau infrastruktur!",
    'IV.3': "PJP adalah 'retail payment service' - PSP yangemploi langsung dengan pengguna final, mengatur transaksi dan akun!",
    'IV.4': "PIP adalah 'clearing house operator' - PSP yang mengoperasikan infrastruktur kliring dan settle untuk participants!",
    'IV.5': "Peserta adalah 'network member' - pihak yang terhubung ke PIP untuk layanan kliring/settle dalam sistem pembayaran!",
    'IV.6': "Pihak terhubung adalah 'data connectivity node' - entitas yang terhubung ke infrastruktur data sistem pembayaran!",
    'IV.7': "Pengguna jasa adalah 'end customer' - orang atau perusahaan yang pakai produk/layanan PSP untuktransaksi keuangan!",
    'IV.8': "Penyedia barang/jasa adalah 'merchant' - penerima pembayaran dalam transaksi, titik akhir aliran dana!",
    'IV.9': "SRO adalah 'self-regulator' - forum industri yang diberi mandat BI untuk membantu pengawasan dan regulasi mandiri!",
    'IV.10': "Penyelenggara penunjang adalah 'support vendor' - pihak yang menyediakan layanan pendukung untuk PSP dan Peserta!",
    'IV.11': "Kerja sama adalah 'partnership ecosystem' - kolaborasi antar-pihak dalam industri harus Ikut aturan PADG DAN BI!",
    
    # BAB V - Tata Kelola & Manajemen Risiko
    'V.1': "Tata kelola adalah 'board-level responsibility' - Direksi dan Komisaris aktif mengawasi risiko siber, bukan hanya mendeklarasikan!",
    'V.2': "Kerangka manajemen risiko adalah 'risk management framework' - strategi, organisasi, kebijakan, prosedur, dan limit yang terintegrasi!",
    'V.3': "Penerapan manajemen risiko adalah 'maturity assessment' - tinjauan berkala terhadap kualitas penerapan kontrol dan proses keamanan!",
    'V.4': "Penilaian risiko inheren adalah 'risk profiling' - mengetahui eksposur awal sebelum menerapkan kontrol, seperti foto kondisi kesehatan!",
    'V.5': "Empat faktor risiko adalah 'risk quadrant' - teknologi, produk, organisasi, danriwayat insiden menentukan tingkat risiko inheren!",
    'V.6': "Monitoring risiko adalah 'continuous monitoring' - pantau terus-menerus, bukan sekali setahun, untukdeteksi early warning!",
    'V.7': "Ketahanan siber adalah 'cyber resilience lifecycle' - identify, protect, detect, respond, recover - siklus lengkap ketahanan!",
    'V.8': "Identifikasi aset krusial adalah 'crown jewels inventory' - tahu aset apa yang paling berharga dan perlu dilindungi extra!",
    'V.9': "Pelindungan (Protect) adalah 'preventive controls' - firewall, encryption, IAM, dan security awareness sebagai pertahanan pertama!",
    'V.10': "Deteksi (Detect) adalah 'monitoring & analytics' - detection capabilities yang cepat untukidentifikasi serangan sebelum menyebar!",
    'V.11': "Penanggulangan (Respond) adalah 'incident response' - rencana dan tim tanggap insiden siber yang siap 24/7!",
    'V.12': "Pemulihan (Recover) adalah 'restoration & lessons learned' - pulihkan layanan, kembalikan normal, dan catat pelajaran!",
    'V.13': "Peningkatan standar adalah 'adaptive security' - tingkatkan kontrol seiring pertumbuhan nilai transaksi dan risiko!",
    'V.14': "Pengujian adalah 'proactive validation' - vulnerability assessment dan penetration testing untuk temukan celah sebelum hacker!",
    'V.15': "Berskala exercise adalah 'fire drill simulation' - uji skenario serangan lintas fungsi untuk kesiapan tim dan prosedur!",
    'V.16': "Fungsi siber independen adalah 'segregation of duties' - unit siberFW bebas dari konflik dan punya akses langsung ke Direksi!",
    'V.17': "Kesiapan tim tanggap adalah 'cyber SOC' - tim khusus, siap 24/7, dengan playbook dan authority yang jelas!",
    'V.18': "Laporan assessment adalah 'risk scorecard' - hasil penilaian dikonsolidasi, disepakati, dan dilaporkan kepada pengurus!",
    'V.19': "Pelaporan insiden adalah 'incident reporting chain' - insiden siber signifikan wajib dilaporkan ke BI dengan timeline tertentu!",
    'V.20': "Level risiko adalah 'risk rating' - gabungan inherent risk + maturity level menentukan High/Moderate/Low untuk setiap aset/produk!",
    'V.21': "Peningkatan kualitas adalah 'continuous improvement' - tinjauan berkala dan perbaikan berkelanjutan terhadap kontrol siber!",
    'V.22': "Penerapan prinsip adalah 'principled security' - kerahasiaan, integritas, ketersediaan, akuntabilitas, dan transparansi!",
    'V.23': "Kepatuhan adalah 'compliance monitoring' - pastikan implementasi sesuai PADG, PBI, dan regulasi lainnya!",
    'V.24': "Manajemen risiko operasional adalah 'operational risk shield' - identifikasi, assess, control, dan monitor risiko operasional TI!",
    'V.25': "Kontrol internal adalah 'control environment' - lingkungan pengendalian yang efektif denganCOSO/ISO 27001 sebagai acuan!",
    'V.26': "Audit internal adalah 'independent assurance' - periodic review oleh internal audit untuk validasi kontrol dan kepatuhan!",
    
    # BAB VI - Praktik Pasar
    'VI.1': "Standar praktik pasar adalah 'industry best practices' - pedoman umum yang diadopsi industri untuk konsistensi dan keandalan!",
    'VI.2': "Transparansi adalah 'open disclosure' - semua informasi materi dan harga harus tersedia jelas untukpasar dan konsumen!",
    'VI.3': "Anti-pencucian uang adalah 'AML shield' - PSP wajib terapkan program APU/PPT sesuai Peraturan Otoritas Jasa Keuangan!",
    'VI.4': "Perlindungan konsumen adalah 'consumer rights' - perlindungan terhadap penyalahgunaan data, transaksi tidak sah, dan praktik tidak adil!",
    'VI.5': "Kepemilikan data adalah 'data ownership' - data transaksi pemilik milik konsumen, PSP hanya custodian, tak boleh disalahgunakan!",
    'VI.6': "Portabilitas data adalah 'data portability right' - konsumen berhak memindahkan data finansial antar penyedia layanan!",
    'VI.7': "Dispute resolution adalah 'complaint handling' - mekanisme penyelesaian sengketa yang adil, cepat, dan independen!",
    'VI.8': "Kewajiban kontrak adalah 'fair contract terms' - syarat dan ketentuan harus adil, tidak one-sided, dan mudah dipahami konsumen!",
    'VI.9': "Layanan darurat adalah 'critical services continuity' - layanan esensial tetap berjalan meski terjadi gangguan besar!",
    'VI.10': "Kontinuitasbisnis adalah 'business continuity plan' - rencana pulih dari gangguan dengan RTO/RPO yang sudah ditentukan!",
    'VI.11': "Infrastruktur kritis adalah 'critical infrastructure' - komponen sistem pembayaran yang jika mati maka seluruh sistem terpengaruh besar!",
    'VI.12': "Keandalan sistem adalah 'system uptime guarantee' - SLA untuk availability, performance, dan resilience sistem pembayaran!",
    'VI.13': "Monitoring transaksi adalah 'transaction surveillance' - pantau pola transaksimencurigakan untuk deteksi early fraud/money laundering!",
    'VI.14': "Pencegahan fraud adalah 'fraud prevention engine' - sistem dan prosedur untukmencegah, detect, dan respons penipuan!",
    'VI.15': "Kepatuhan regulasi adalah 'regulatory compliance program' - program sistematis untuk memastikan semua aturan dipatuhi!",
    'VI.16': "Reporting ke BI adalah 'regular reporting' - laporan berkala (bulanan/kuartal) tentang kinerja, risiko, dan kepatuhan!",
    'VI.17': "Audit eksternal adalah 'independent audit' - audit oleh auditor independen untuk verifikasi laporan keuangan dan kontrol!",
    'VI.18': "Self-assessment adalah 'self-check mechanism' - PSP melakukan assessmen mandiri terhadap risiko dan kontrol, lalu report ke BI!",
    'VI.19': "Review manajemen adalah 'management review' - tinjauan berkala oleh Direksi terhadap performa risiko dan kontrol siber!",
    
    # BAB VII - Data & Informasi
    'VII.1': "Pengelolaan data adalah 'data governance' - kebijakan, prosedur, dan kontrol untuk data integrity, confidentiality, dan availability!",
    'VII.2': "Keamanan data adalah 'data security framework' - enkripsi, access control, DLP, dan monitoring untuklindungi data sensitif!",
    'VII.3': "Privasi data adalah 'privacy by design' - perlindungandata pribadi konsumen sesuai UU PDP dan SOP BI!",
    'VII.4': "Penyimpanan data adalah 'data residency' - data transaksi sistem pembayaran wajib disimpan di Indonesia (data localization)!",
    'VII.5': "Pertukaran data adalah 'secure data exchange' - protokol aman untuk sharing data antar-PSP dengan enkripsi dan auth!",
    'VII.6': "Retensi data adalah 'data retention policy' - periode penyimpanan data sesuai ketentuan, lalu destroy atau archive!",
    
    # BAB VIII - Pengawasan
    'VIII.1': "Kewenangan pengawasan adalah 'supervisory authority' - BI punya hak untuk periksa, tanyain, dan minta laporan dari PSP!",
    'VIII.2': "Pemeriksaan lapangan adalah 'onsite examination' - inspeksi langsung ke lokasi PSP untuk review sistem, dokumen, dan data!",
    'VIII.3': "Pemeriksaan jarsak adalah 'offsite monitoring' - pantau dari jarak lewat laporan berkala, sistem, dan data transmit!",
    'VIII.4': "Pengambilan data adalah 'data acquisition' - hak BI untuk ambil salinan data, sistem, atau dokumen terkait penyelenggaraan!",
    'VIII.5': "Pemberian tahu adalah 'show cause order' - PSP dapat diminta menjelaskan tindakan atau ketidakpatuhan kepada BI!",
    'VIII.6': "Sanksi administrasi adalah 'administrative sanction' - BI bisa issuing warning, denda, suspensi, pencabutan izin!",
    
    # BAB IX - Pengakhiran
    'IX.1': "Pengakhiran sukarela adalah 'voluntary exit' - PSP bisa mengakhiran usaha dengan prosedur yang ditetapkan, termasuk perlindungan konsumen!",
    'IX.2': "Pengakhiran paksaan adalah 'involuntary termination' - BI dapat mencabut izin jika PSP melanggar berat atau bubar!",
    'IX.3': "Pekerjaan alihdaya adalah 'business transfer' - alihdaya usaha ke pihak lain harus disetujui BI dan jaminan perlindungan konsumen!",
    'IX.4': "Alihdaya aset adalah 'asset transfer' - aset dan kewajiban dialihkan dengan cara yangaman dan transparan!",
    'IX.5': "Liquidasi adalah 'liquidation proceeding' - jika PSP bankrupt, pengurus harus pastikan dana konsumen dilindungi!",
    'IX.6': "Pengembalian dana adalah 'consumer refund' - prioritas utama: kembalikan dana pengguna sebelumutang-utang lain!",
    'IX.7': "Penghapusan data adalah 'data deletion' - data konsumen harus dihapus/distroy sesuai retensi policy setelah pengakhiran!",
    'IX.8': "Penanganan sengketa adalah 'dispute resolution' - mekanisme penyelesaian keluhan konsumen setelah PSP berhenti beroperasi!",
    'IX.9': "Pembekuan aset adalah 'asset freeze' - selama proses pengakhiran, aset dana float dibeku untuklindungi konsumen!",
    
    # BAB X - Koordinasi
    'X.1': "Koordinasi internal adalah 'intra-agency coordination' - BI koordinasi antar-divisi untuk harmonisasi regulasi dan pengawasan!",
    'X.2': "Koordinasi lintas sektor adalah 'inter-agency collaboration' - kerja sama dengan OJK, Kemenkeu, dan otoritas lain untuksinergi!",
    'X.3': "Pertukaran informasi adalah 'information sharing protocol' - informasi risiko dan ancaman dipindahtangkan dengan otoritas terkait!",
    'X.4': "Kerja sama internasional adalah 'international cooperation' - kolaborasi dengan otoritas moneter/bank sentral asing untuk cross-border payment!",
    'X.5': "Harmonisasi adalah 'regulatory alignment' - peraturan PADG diselaraskan dengan standar internasional (FSB, BIS, PCI, etc)!",
    'X.6': "Komite koordinasi adalah 'coordination committee' - mekanismerutin untuk update, diskusi, dan resolusi isu bersama!",
    'X.7': "Pemberitahuan insiden adalah 'incident notification' - insiden siber signifikan harus dilaporkan ke BI dan otoritas terkait secepatnya!",
    'X.8': "Emergency response adalah 'crisis management' - koordinasi darurat saat terjadi gangguan sistem pembayaran berskala besar!",
    'X.9': "Forum industri adalah 'industry forum' - platform diskusi regulasi antara BI, PSP, SRO, dan stakeholder industri!",
    'X.10': "Konsultasi publik adalah 'public consultation' - before finalizing rules, BI opener untukmasyarakat dan industri!",
    'X.11': "Penyelidikan adalah 'investigative authority' - hak BI untukselidiki dugaan pelanggaran danKoleksi evidence!",
    'X.12': " implementasi bertahap adalah 'phased implementation' - transisi period untukPSP menyesuaikan dengan PADG baru berjalan Bertahap!",
    
    # BAB XI - Peraturan Lain
    'XI.1': "Pengharmonisan regulasi adalah 'regulatory coherence' - PADG bekerja selaras dengan UU Perbankan, UU PDP, UU KEK, dan regulasi OJK!",
    'XI.2': "Konflik norma adalah 'conflict resolution' - jika terjadi konflik antar peraturan, maka aturan yang lebih spesifik/baru prevail!",
    
    # BAB XII - Ketentuan Lainnya
    'XII.1': "Penetapan peraturan teknis adalah 'delegated legislation' - BI berwenang mengeluarkan Peraturan BI, Surat Edaran, atau Keputusan untuk detail teknis!",
    'XII.2': "Penyesuaian adalah 'adaptive regulation' - BI bisaubah,edit, atau añadireglamento sesuai perkembangan teknologi dan pasar!",
    'XII.3': "Penerapanlanjutan adalah 'grace period' - PSP yang sudah beroperasi dapat diberi waktu untuk menyesuaikan dengan ketentuan baru!",
    'XII.4': "Pengawasanlintas batas adalah 'cross-border supervision' - untukPSP asing atau transaksilintas negara, BI bekerjasama dengan otoritas asing!",
    'XII.5': "Kewajiban pelaporan adalah 'reporting obligations' - semua PSP wajib setiap saat siap datainformasi yang diminta BI!",
    'XII.6': "Penerbitan PADG adalah 'official gazette' - PADG berlaku sejak diundangkan dan dipublikasikan dalam Berita Negara Republik Indonesia!",
}

# Load and update
with open('public/data/padg_requirements.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Pre-generate analogies for known IDs, fallback to generation
def generate_fallback(req):
    title = req.get('title', '').lower()
    chapter = req.get('chapter', '')
    pillar = req.get('pillar', '')
    
    chapter_labels = {
        'I': 'Ketentuan Umum (Definitions)',
        'II': 'Kerangka Kerja (Framework)',
        'III': 'Aktivitas & Produk',
        'IV': 'Struktur Industri',
        'V': 'Tata Kelola & Manajemen Risiko',
        'VI': 'Praktik Pasar',
        'VII': 'Data & Informasi',
        'VIII': 'Pengawasan',
        'IX': 'Pengakhiran',
        'X': 'Koordinasi',
        'XI': 'Peraturan Lain',
        'XII': 'Ketentuan Penutup'
    }
    
    pillar_icons = {
        'Governance': 'tata kelola',
        'Activities': 'aktivitas operasional',
        'Products': 'produk instrumen',
        'RiskManagement': 'manajemen risiko',
        'Pricing': 'skema harga',
        'Innovation': 'inovasi sandbox',
        'Supervision': 'pengawasan',
        'Reporting': 'pelaporan'
    }
    
    ch_label = chapter_labels.get(chapter, chapter)
    pil_icon = pillar_icons.get(pillar, 'kepatuhan')
    
    return f"Kewajiban {ch_label}: {title[:80]} - ini adalah bagian dari {pil_icon} yang harus dipatuhi PSP untukstabilitas sistem pembayaran."

# Apply analogies
enriched = 0
skipped = 0
for req in data:
    req_id = req.get('id', '')
    if req_id in analogies:
        req['analogy'] = analogies[req_id]
        enriched += 1
    elif not req.get('analogy') or not req['analogy'].strip():
        req['analogy'] = generate_fallback(req)
        enriched += 1
    else:
        skipped += 1

# Save
with open('public/data/padg_requirements.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Enriched {enriched} requirements (skipped {skipped})")
print(f"\nCoverage: {len(analogies)} presets, fallback used for others")

# Verify all have analogies
missing = [r for r in data if not r.get('analogy') or not r['analogy'].strip()]
print(f"Missing analogies: {len(missing)}")
if missing:
    for m in missing[:10]:
        print(f"  {m['id']}: {m['title'][:50]}")
