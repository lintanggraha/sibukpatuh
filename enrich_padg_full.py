import re
import json
from collections import defaultdict

# Reload and re-parse with improved summary extraction
with open(r'C:\laragon\www\sonarqube-CE\PADG-322025-Rev.md', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

chapter_meta = {
    'I': {'label': 'Ketentuan Umum', 'color': '#2563eb', 'icon': 'fa-book', 'summary': 'Definisi dan istilah dasar dalam pengaturan industri sistem pembayaran.'},
    'II': {'label': 'Kerangka Kerja', 'color': '#0f766e', 'icon': 'fa-sitemap', 'summary': 'Ruang lingkup dan kerangka pengaturan industri sistem pembayaran.'},
    'III': {'label': 'Aktivitas, Produk, & Inovasi', 'color': '#a16207', 'icon': 'fa-cogs', 'summary': 'Aktivitas, produk, skema harga, dan inovasi teknologi sistem pembayaran.'},
    'IV': {'label': 'Struktur Industri', 'color': '#7c3aed', 'icon': 'fa-building', 'summary': 'Struktur industri penyelenggara sistem pembayaran.'},
    'V': {'label': 'Tata Kelola & Manajemen Risiko', 'color': '#1d4ed8', 'icon': 'fa-shield-alt', 'summary': 'Tata kelola, manajemen risiko, dan praktik pasar.'},
    'VI': {'label': 'Praktik Pasar', 'color': '#059669', 'icon': 'fa-chart-bar', 'summary': 'Standar praktik pasar dan ketentuan operasional.'},
    'VII': {'label': 'Data & Informasi', 'color': '#0891b2', 'icon': 'fa-database', 'summary': 'Pengelolaan data dan informasi sistem pembayaran.'},
    'VIII': {'label': 'Pengawasan', 'color': '#b91c1c', 'icon': 'fa-search', 'summary': 'Kegiatan pengawasan dan penegakan sanksi.'},
    'IX': {'label': 'Pengakhiran', 'color': '#dc2626', 'icon': 'fa-stop-circle', 'summary': 'Ketentuan pengakhiran kegiatan usaha.'},
    'X': {'label': 'Koordinasi & Kerja Sama', 'color': '#7c2d12', 'icon': 'fa-handshake', 'summary': 'Koordinasi dan kerja sama dengan otoritas terkait.'},
    'XI': {'label': 'Peraturan Lain', 'color': '#4b5563', 'icon': 'fa-file-alt', 'summary': 'Ketentuan peraturan perundang-undangan lain yang berlaku.'},
    'XII': {'label': 'Ketentuan Lainnya', 'color': '#6b7280', 'icon': 'fa-cog', 'summary': 'Ketentuan penutup dan peralihan.'},
}

pillar_meta = {
    'Governance': {'label': 'Tata Kelola', 'color': '#0f766e', 'icon': 'fa-sitemap', 'summary': 'Kerangka pengaturan, ruang lingkup, dan prinsip dasar PADG.'},
    'Activities': {'label': 'Aktivitas', 'color': '#2563eb', 'icon': 'fa-cogs', 'summary': 'Jasa dan infrastruktur sistem pembayaran (PJP & PIP).'},
    'Products': {'label': 'Produk & Instrumen', 'color': '#7c3aed', 'icon': 'fa-credit-card', 'summary': 'Sumber dana, akses, instrumen pembayaran, dan kanal.'},
    'RiskManagement': {'label': 'Manajemen Risiko', 'color': '#a16207', 'icon': 'fa-shield-alt', 'summary': 'Aspek prudensial, kontrol risiko, dan perlindungan konsumen.'},
    'Pricing': {'label': 'Skema Harga', 'color': '#059669', 'icon': 'fa-tag', 'summary': 'Kebijakan harga, transparansi biaya, dan peraturan tarif.'},
    'Innovation': {'label': 'Inovasi', 'color': '#0891b2', 'icon': 'fa-flask', 'summary': 'Uji coba inovasi teknologi, regulatory sandbox.'},
    'Supervision': {'label': 'Pengawasan', 'color': '#b91c1c', 'icon': 'fa-search', 'summary': 'Kegiatan pengawasan, pemeriksaan, dan penegakan.'},
    'Reporting': {'label': 'Pelaporan', 'color': '#1d4ed8', 'icon': 'fa-file-alt', 'summary': 'Ketentuan laporan dan dokumentasi.'},
}

def map_to_pillar(pasal_num, chapter, title, body):
    pasal_int = int(pasal_num) if pasal_num.isdigit() else 0
    combined = (title + ' ' + body).lower()
    if chapter == 'I': return 'Governance'
    elif chapter == 'II': return 'Governance'
    elif chapter == 'III':
        if 5 <= pasal_int <= 8: return 'Activities'
        elif 9 <= pasal_int <= 14: return 'Products'
        elif 15 <= pasal_int <= 30: return 'Products'
        elif 31 <= pasal_int <= 34: return 'Products'
        elif 35 <= pasal_int <= 44: return 'Products'
        elif 45 <= pasal_int <= 46: return 'Products'
        elif 47 <= pasal_int <= 48: return 'Pricing'
        elif 49 <= pasal_int <= 59: return 'Innovation'
        else: return 'Activities'
    elif chapter == 'IV': return 'Governance'
    elif chapter == 'V':
        if any(w in combined for w in ['risiko inheren', 'penilaian risiko']): return 'RiskManagement'
        elif any(w in combined for w in ['manajemen risiko', 'kerangka', 'pengendalian']): return 'RiskManagement'
        elif any(w in combined for w in ['organisasi', 'fungsi siber', 'unit']): return 'Governance'
        else: return 'RiskManagement'
    elif chapter == 'VI': return 'Activities'
    elif chapter == 'VII': return 'Reporting'
    elif chapter == 'VIII': return 'Supervision'
    elif chapter == 'IX': return 'Supervision'
    elif chapter == 'X': return 'Governance'
    elif chapter in ['XI', 'XII']: return 'Governance'
    else:
        if any(w in combined for w in ['pengawasan', 'pemeriksaan', 'sanksi']): return 'Supervision'
        elif any(w in combined for w in ['inovasi', 'uji coba', 'sandbox']): return 'Innovation'
        elif any(w in combined for w in ['harga', 'pricing', 'biaya']): return 'Pricing'
        elif any(w in combined for w in ['manajemen risiko', 'prudensial', 'perlindungan konsumen']): return 'RiskManagement'
        elif any(w in combined for w in ['uang elektronik', 'kartu', 'kanal', 'instrumen']): return 'Products'
        elif any(w in combined for w in ['aktivitas', 'jasa', 'infrastruktur']): return 'Activities'
        else: return 'Governance'

requirements = []
current_chapter = None
current_pasal_id = None
current_pasal_lines = []

roman_pattern = re.compile(r'^BAB\s+([IVX]+)', re.IGNORECASE)
pasal_pattern = re.compile(r'^Pasal\s+(\d+)', re.IGNORECASE)

i = 0
while i < len(lines):
    line = lines[i]
    stripped = line.strip()
    
    if stripped.startswith('BAB'):
        rom_match = roman_pattern.match(stripped)
        if rom_match:
            chapter_num = rom_match.group(1).upper()
            current_chapter = chapter_num
            i += 1
            continue
    
    if stripped.startswith('Pasal'):
        pas_match = pasal_pattern.match(stripped)
        if pas_match:
            if current_pasal_id and current_pasal_lines:
                title_line = current_pasal_lines[0].strip()
                title_clean = re.sub(r'^Pasal\s+\d+\s*[\.\)]?\s*', '', title_line).strip()
                # Improved summary extraction: take first 5-8 non-empty lines after title
                body_lines = [l.strip() for l in current_pasal_lines[1:] if l.strip() and len(l.strip()) > 10]
                summary = ' '.join(body_lines[:3]) if body_lines else title_clean
                body_text = ' '.join(current_pasal_lines[:min(12, len(current_pasal_lines))])
                
                pillar = map_to_pillar(current_pasal_id, current_chapter or '', title_clean, body_text)
                
                req = {
                    'id': f"{current_chapter}.{current_pasal_id}",
                    'chapter': current_chapter or '',
                    'chapter_title': chapter_meta.get(current_chapter or '', {}).get('label', ''),
                    'pillar': pillar,
                    'title': title_clean[:200] or f"Pasal {current_pasal_id}",
                    'summary': summary[:500] if summary else title_clean[:500],
                    'cadence': '',
                    'owner': 'PSP / Bank Indonesia',
                    'scoring': 'Kepatuhan (Compliance)',
                    'appendices': [],
                    'focus': [],
                    'evidence': [],
                    'reporting': 'Sesuai ketentuan dalam pasal',
                    'analogy': ''
                }
                requirements.append(req)
            
            current_pasal_id = pas_match.group(1)
            current_pasal_lines = [stripped]
            i += 1
            continue
    
    if current_pasal_id is not None and stripped:
        current_pasal_lines.append(stripped)
    
    i += 1

if current_pasal_id and current_pasal_lines:
    title_line = current_pasal_lines[0].strip()
    title_clean = re.sub(r'^Pasal\s+\d+\s*[\.\)]?\s*', '', title_line).strip()
    body_lines = [l.strip() for l in current_pasal_lines[1:] if l.strip() and len(l.strip()) > 10]
    summary = ' '.join(body_lines[:3]) if body_lines else title_clean
    body_text = ' '.join(current_pasal_lines[:min(12, len(current_pasal_lines))])
    
    pillar = map_to_pillar(current_pasal_id, current_chapter or '', title_clean, body_text)
    
    req = {
        'id': f"{current_chapter}.{current_pasal_id}",
        'chapter': current_chapter or '',
        'chapter_title': chapter_meta.get(current_chapter or '', {}).get('label', ''),
        'pillar': pillar,
        'title': title_clean[:200] or f"Pasal {current_pasal_id}",
        'summary': summary[:500] if summary else title_clean[:500],
        'cadence': '',
        'owner': 'PSP / Bank Indonesia',
        'scoring': 'Kepatuhan (Compliance)',
        'appendices': [],
        'focus': [],
        'evidence': [],
        'reporting': 'Sesuai ketentuan dalam pasal',
        'analogy': ''
    }
    requirements.append(req)

print(f"Parsed {len(requirements)} requirements")

# Now enrich with analogies
analogies_presets = {
    'I.1': "Definisi adalah 'kamus hukum' - tanpa pemahaman istilah yang sama, interpretasi PADG akan berantakan seperti terjemahannya!",
    'I.2': "Terminology proper adalah 'language of compliance' - semua PSP harus bicara bahasa yang sama untuklaros PADG tidak ambigu!",
    'II.1': "Tujuan PADG adalah 'compass navigation' - memastikan semua Kapal (PSP) berlayar dengan arah yang tepat sesuai wewenang BI!",
    'II.2': "Ruang lingkup adalah 'playground boundary' - tahu batasan mainnya, jangan main di luar area yang tidak diizinkan!",
    'III.5': "Tahapan transaksi adalah 'assembly line' - setiap tahapan harus benar, dari pesanan hingga pengiriman dana!",
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
    'III.26': "Larangan kepemilikan dana adalah 'separation of assets' - dana pengguna tak boleh dicampur dengan uang PJP, 永不为所动!",
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
    'III.44': "Kanal pembayaran adalah 'payment channels portfolio' - fisik, online mobile/internet, atau teknologi baru dengan risk management & APU/PPT!",
    'III.45': "Cross-border kanal adalah 'international corridor' - transaksilintas batas harus lewatkerjasama PJP/PIP dengan penyelenggara luar negeri!",
    'III.46': "Penyimpanan data instrumen adalah 'tokenization vault' - platform penyimpanan data kartu dengan300k+ pengguna aktif wajib izin PJP!",
    'III.47': "Nilai yang dapat dipersamakan adalah 'digital value with constraints' - bukan uang, tapi bisa dipakai bayar denganbatasan ketat BI!",
    'IV.1': "Struktur industri adalah 'industry map' - peta lengkap pemain: PSP, PJP, PIP, Peserta, Penunjang, dan hubungan mereka!",
    'IV.2': "PSP adalah 'license holder' - entitas yang punya ijin dari BI menyelenggarakan Sistem Pembayaran, entah jasa atau infrastruktur!",
    'IV.3': "PJP adalah 'retail payment service' - PSP yangemploi langsung dengan pengguna final, mengatur transaksi dan akun!",
    'IV.4': "PIP adalah 'clearing house operator' - PSP yang mengoperasikan infrastruktur kliring dan settle untuk participants!",
    'IV.5': "Peserta adalah 'network member' - pihak yang terhubung ke PIP untuk layanan kliring/settle dalam sistem pembayaran!",
    'IV.6': "Pihak terhubung adalah 'data connectivity node' - entitas yang terhubung ke infrastruktur data sistem pembayaran!",
    'IV.7': "Pengguna jasa adalah 'end customer' - orang atau perusahaan yang pakai produk/layanan PSP untuk transaksi keuangan!",
    'IV.8': "Penyedia barang/jasa adalah 'merchant' - penerima pembayaran dalam transaksi, titik akhir aliran dana!",
    'IV.9': "SRO adalah 'self-regulator' - forum industri yang diberi mandat BI untuk membantu pengawasan dan regulasi mandiri!",
    'IV.10': "Penyelenggara penunjang adalah 'support vendor' - pihak yang menyediakan layanan pendukung untuk PSP dan Peserta!",
    'IV.11': "Kerja sama adalah 'partnership ecosystem' - kolaborasi antar-pihak dalam industri harus Ikut aturan PADG DAN BI!",
    'V.1': "Tata kelola adalah 'board-level responsibility' - Direksi dan Komisaris aktif mengawasi risiko siber, bukan hanya mendeklarasikan!",
    'V.2': "Kerangka manajemen risiko adalah 'risk management framework' - strategi, organisasi, kebijakan, prosedur, dan limit yang terintegrasi!",
    'V.3': "Penerapan manajemen risiko adalah 'maturity assessment' - tinjauan berkala terhadap kualitas penerapan kontrol dan proses keamanan!",
    'V.4': "Penilaian risiko inheren adalah 'risk profiling' - mengetahui eksposur awal sebelum menerapkan kontrol, seperti foto kondisi kesehatan!",
    'V.5': "Empat faktor risiko adalah 'risk quadrant' - teknologi, produk, organisasi, dan riwayat insiden menentukan tingkat risiko inheren!",
    'V.6': "Monitoring risiko adalah 'continuous monitoring' - pantau terus-menerus, bukan sekali setahun, untuk deteksi early warning!",
    'V.7': "Ketahanan siber adalah 'cyber resilience lifecycle' - identify, protect, detect, respond, recover - siklus lengkap ketahanan!",
    'V.8': "Identifikasi aset krusial adalah 'crown jewels inventory' - tahu aset apa yang paling berharga dan perlu dilindungi extra!",
    'V.9': "Pelindungan (Protect) adalah 'preventive controls' - firewall, encryption, IAM, dan security awareness sebagai pertahanan pertama!",
    'V.10': "Deteksi (Detect) adalah 'monitoring & analytics' - detection capabilities yang cepat untuk identifikasi serangan sebelum menyebar!",
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
    'V.25': "Kontrol internal adalah 'control environment' - lingkungan pengendalian yang efektif dengan COSO/ISO 27001 sebagai acuan!",
    'V.26': "Audit internal adalah 'independent assurance' - periodic review oleh internal audit untuk validasi kontrol dan kepatuhan!",
    'VI.1': "Standar praktik pasar adalah 'industry best practices' - pedoman umum yang diadopsi industri untuk konsistensi dan keandalan!",
    'VI.2': "Transparansi adalah 'open disclosure' - semua informasi materi dan harga harus tersedia jelas untuk pasar dan konsumen!",
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
    'VI.14': "Pencegahan fraud adalah 'fraud prevention engine' - sistem dan prosedur untuk mencegah, detect, dan respons penipuan!",
    'VI.15': "Kepatuhan regulasi adalah 'regulatory compliance program' - program sistematis untuk memastikan semua aturan dipatuhi!",
    'VI.16': "Reporting ke BI adalah 'regular reporting' - laporan berkala (bulanan/kuartal) tentang kinerja, risiko, dan kepatuhan!",
    'VI.17': "Audit eksternal adalah 'independent audit' - audit oleh auditor independen untuk verifikasi laporan keuangan dan kontrol!",
    'VI.18': "Self-assessment adalah 'self-check mechanism' - PSP melakukan assessmen mandiri terhadap risiko dan kontrol, lalu report ke BI!",
    'VI.19': "Review manajemen adalah 'management review' - tinjauan berkala oleh Direksi terhadap performa risiko dan kontrol siber!",
    'VII.1': "Pengelolaan data adalah 'data governance' - kebijakan, prosedur, dan kontrol untuk data integrity, confidentiality, dan availability!",
    'VII.2': "Keamanan data adalah 'data security framework' - enkripsi, access control, DLP, dan monitoring untuklindungi data sensitif!",
    'VII.3': "Privasi data adalah 'privacy by design' - perlungan data pribadi konsumen sesuai UU PDP dan SOP BI!",
    'VII.4': "Penyimpanan data adalah 'data residency' - data transaksi sistem pembayaran wajib disimpan di Indonesia (data localization)!",
    'VII.5': "Pertukaran data adalah 'secure data exchange' - protokol aman untuk sharing data antar-PSP dengan enkripsi dan auth!",
    'VII.6': "Retensi data adalah 'data retention policy' - periode penyimpanan data sesuai ketentuan, lalu destroy atau archive!",
    'VIII.1': "Kewenangan pengawasan adalah 'supervisory authority' - BI punya hak untuk periksa, tanyain, dan minta laporan dari PSP!",
    'VIII.2': "Pemeriksaan lapangan adalah 'onsite examination' - inspeksi langsung ke lokasi PSP untuk review sistem, dokumen, dan data!",
    'VIII.3': "Pemeriksaan jarak jauh adalah 'offsite monitoring' - pantau dari jarak jauh lewat laporan berkala, sistem, dan data transmit!",
    'VIII.4': "Pengambilan data adalah 'data acquisition' - hak BI untuk ambil salinan data, sistem, atau dokumen terkait penyelenggaraan!",
    'VIII.5': "Pemberian tahu adalah 'show cause order' - PSP dapat diminta menjelaskan tindakan atau ketidakpatuhan kepada BI!",
    'VIII.6': "Sanksi administrasi adalah 'administrative sanction' - BI bisa issuing warning, denda, suspensi, pencabutan izin!",
    'IX.1': "Pengakhiran sukarela adalah 'voluntary exit' - PSP bisa mengakhiran usaha dengan prosedur yang ditetapkan, termasuk perlindungan konsumen!",
    'IX.2': "Pengakhiran paksaan adalah 'involuntary termination' - BI dapat mencabut izin jika PSP melanggar berat atau bubar!",
    'IX.3': "Pekerjaan alihdaya adalah 'business transfer' - alihdaya usaha ke pihak lain harus disetujui BI dan jaminan perlindungan konsumen!",
    'IX.4': "Alihdaya aset adalah 'asset transfer' - aset dan kewajiban dialihkan dengan cara yang aman dan transparan!",
    'IX.5': "Liquidasi adalah 'liquidation proceeding' - jika PSP bankrupt, pengurus harus pastikan dana konsumen dilindungi!",
    'IX.6': "Pengembalian dana adalah 'consumer refund' - prioritas utama: kembalikan dana pengguna sebelum utang-utang lain!",
    'IX.7': "Penghapusan data adalah 'data deletion' - data konsumen harus dihapus/distroy sesuai retensi policy setelah pengakhiran!",
    'IX.8': "Penanganan sengketa adalah 'dispute resolution' - mekanisme penyelesaian keluhan konsumen setelah PSP berhenti beroperasi!",
    'IX.9': "Pembekuan aset adalah 'asset freeze' - selama proses pengakhiran, aset dana float dibeku untuklindungi konsumen!",
    'X.1': "Koordinasi internal adalah 'intra-agency coordination' - BI koordinasi antar-divisi untuk harmonisasi regulasi dan pengawasan!",
    'X.2': "Koordinasi lintas sektor adalah 'inter-agency collaboration' - kerja sama dengan OJK, Kemenkeu, dan otoritas lain untuk sinergi!",
    'X.3': "Pertukaran informasi adalah 'information sharing protocol' - informasi risiko dan ancaman dipindahtangkan dengan otoritas terkait!",
    'X.4': "Kerja sama internasional adalah 'international cooperation' - kolaborasi dengan otoritas moneter/bank sentral asing untuk cross-border payment!",
    'X.5': "Harmonisasi adalah 'regulatory alignment' - peraturan PADG diselaraskan dengan standar internasional (FSB, BIS, PCI, etc)!",
    'X.6': "Komite koordinasi adalah 'coordination committee' - mekanisme rutin untuk update, diskusi, dan resolusi isu bersama!",
    'X.7': "Pemberitahuan insiden adalah 'incident notification' - insiden siber signifikan harus dilaporkan ke BI dan otoritas terkait secepatnya!",
    'X.8': "Emergency response adalah 'crisis management' - koordinasi darurat saat terjadi gangguan sistem pembayaran berskala besar!",
    'X.9': "Forum industri adalah 'industry forum' - platform diskusi regulasi antara BI, PSP, SRO, dan stakeholder industri!",
    'X.10': "Konsultasi publik adalah 'public consultation' - sebelum finalizing rules, BI open untuk masyarakat dan industri!",
    'X.11': "Penyelidikan adalah 'investigative authority' - hak BI untuk selidiki dugaan pelanggaran dan koleksi evidence!",
    'X.12': "Penerapan bertahap adalah 'phased implementation' - transisi period untuk PSP menyesuaikan dengan PADG baru berjalan Bertahap!",
    'XI.1': "Pengharmonisan regulasi adalah 'regulatory coherence' - PADG bekerja selaras dengan UU Perbankan, UU PDP, UU KEK, dan regulasi OJK!",
    'XI.2': "Konflik norma adalah 'conflict resolution' - jika terjadi konflik antar peraturan, maka aturan yang lebih spesifik/baru prevail!",
    'XII.1': "Penetapan peraturan teknis adalah 'delegated legislation' - BI berwenang mengeluarkan Peraturan BI, Surat Edaran, atau Keputusan untuk detail teknis!",
    'XII.2': "Penyesuaian adalah 'adaptive regulation' - BI bisa ubah, edit, atau tambah regulasi sesuai perkembangan teknologi dan pasar!",
    'XII.3': "Penerapan lanjutan adalah 'grace period' - PSP yang sudah beroperasi dapat diberi waktu untuk menyesuaikan dengan ketentuan baru!",
    'XII.4': "Pengawasan lintas batas adalah 'cross-border supervision' - untuk PSP asing atau transaksi lintas negara, BI bekerja sama dengan otoritas asing!",
    'XII.5': "Kewajiban pelaporan adalah 'reporting obligations' - semua PSP wajib setiap saat siap data informasi yang diminta BI!",
    'XII.6': "Penerbitan PADG adalah 'official gazette' - PADG berlaku sejak diundangkan dan dipublikasikan dalam Berita Negara Republik Indonesia!",
}

def generate_fallback(req):
    title = req.get('title', '')
    chapter = req.get('chapter', '')
    chapter_labels = {
        'I': 'Ketentuan Umum', 'II': 'Kerangka Kerja', 'III': 'Aktivitas & Produk',
        'IV': 'Struktur Industri', 'V': 'Tata Kelola & Manajemen Risiko',
        'VI': 'Praktik Pasar', 'VII': 'Data & Informasi', 'VIII': 'Pengawasan',
        'IX': 'Pengakhiran', 'X': 'Koordinasi', 'XI': 'Peraturan Lain', 'XII': 'Ketentuan Penutup'
    }
    icons = {
        'Governance': 'tata kelola', 'Activities': 'aktivitas operasional',
        'Products': 'produk instrumen', 'RiskManagement': 'manajemen risiko',
        'Pricing': 'skema harga', 'Innovation': 'inovasi sandbox',
        'Supervision': 'pengawasan', 'Reporting': 'pelaporan'
    }
    ch_label = chapter_labels.get(chapter, chapter)
    pil_icon = icons.get(req.get('pillar'), 'kepatuhan')
    return f"Kewajiban {ch_label}: {title[:80]} - bagian dari {pil_icon} yang wajib dipatuhi PSP untuk stabilitas sistem pembayaran."

# Load existing enriched data
with open('public/data/padg_requirements.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Also fix empty summaries
def better_summary(req, lines_list):
    """Generate improved summary from pasal content"""
    title_clean = req.get('title', '')
    # Get body lines (skip title line)
    body_lines = [l.strip() for l in lines_list[1:] if l.strip() and len(l.strip()) > 15]
    if body_lines:
        # Join first 2-3 meaningful body lines
        summary = ' '.join(body_lines[:2])
        if len(summary) > 500:
            summary = summary[:497] + '...'
        return summary
    return title_clean

enriched = 0
for req in data:
    req_id = req.get('id', '')
    # Add/fix analogy
    if req_id in analogies_presets:
        req['analogy'] = analogies_presets[req_id]
        enriched += 1
    elif not req.get('analogy') or not req['analogy'].strip():
        req['analogy'] = generate_fallback(req)
        enriched += 1
    
    # Fix empty summaries
    if not req.get('summary') or len(req['summary'].strip()) < 30:
        # We need the original pasal lines to extract summary; they're not available here
        # So we'll use title as summary if summary is too short/empty
        if req.get('title') and (not req.get('summary') or len(req['summary'].strip()) < 30):
            req['summary'] = req['title'][:500]
        enriched += 1

with open('public/data/padg_requirements.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Enriched {enriched} requirements")
missing_analogies = [r for r in data if not r.get('analogy') or not r['analogy'].strip()]
print(f"Remaining missing analogies: {len(missing_analogies)}")

# Show stats
empty_summaries = [r for r in data if not r.get('summary') or len(r['summary'].strip()) < 10]
print(f"Short/empty summaries: {len(empty_summaries)}")

# Sample display
print("\nSample enriched entries:")
for r in data[100:105]:
    print(f"\n{r['id']} [{r['pillar']}]: {r['title'][:60]}")
    print(f"  Summary: {r['summary'][:100]}...")
    print(f"  Analogy: {r['analogy'][:100]}...")
