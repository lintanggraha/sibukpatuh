import re
import json
from collections import defaultdict

# Read the markdown file
with open(r'C:\laragon\www\sonarqube-CE\PADG-322025-Rev.md', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

# Complete chapter metadata for all PADG chapters
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

# Pillar metadata aligned with PADG focus areas
pillar_meta = {
    'Governance': {'label': 'Tata Kelola', 'color': '#0f766e', 'icon': 'fa-sitemap', 'summary': 'Kerangka pengaturan, ruang lingkup, dan prinsip dasar PADG.'},
    'Activities': {'label': 'Aktivitas', 'color': '#2563eb', 'icon': 'fa-cogs', 'summary': 'Jasa dan infrastruktur sistem pembayaran (PJP & PIP).'},
    'Products': {'label': 'Produk & Instrumen', 'color': '#7c3aed', 'icon': 'fa-credit-card', 'summary': 'Sumber dana, akses, instrumen pembayaran, dan kanal.'},
    'RiskManagement': {'label': 'Manajemen Risiko', 'color': '#a16207', 'icon': 'fa-shield-alt', 'summary': 'Aspek prudensial, kontrol risiko, dan perlindungan konsumen.'},
    'Pricing': {'label': 'Skema Harga', 'color': '#059669', 'icon': 'fa-tag', 'summary': 'Kebijakan harga, transparansi biaya, dan peraturan tarif.'},
    'Innovation': {'label': 'Inovasi', 'color': '#0891b2', 'icon': 'fa-flask', 'summary': 'Regulatory sandbox, uji coba, dan pengembangan teknologi.'},
    'Supervision': {'label': 'Pengawasan', 'color': '#b91c1c', 'icon': 'fa-search', 'summary': 'Kegiatan pengawasan, pemeriksaan, dan penegakan.'},
    'Reporting': {'label': 'Pelaporan', 'color': '#1d4ed8', 'icon': 'fa-file-alt', 'summary': 'Ketentuan laporan dan dokumentasi.'},
}

def map_to_pillar(pasal_num, chapter, title, body):
    """Map pasal to pillar based on chapter, pasal number, and content"""
    pasal_int = int(pasal_num) if pasal_num.isdigit() else 0
    combined = (title + ' ' + body).lower()
    
    # BAB I: Ketentuan Umum -> Governance
    if chapter == 'I':
        return 'Governance'
    
    # BAB II: Kerangka Kerja -> Governance
    elif chapter == 'II':
        return 'Governance'
    
    # BAB III: Aktivitas, Produk, Skema Harga, Inovasi
    elif chapter == 'III':
        if 5 <= pasal_int <= 8:
            return 'Activities'  # Tahapan, Aktivitas (PJP/PIP)
        elif 9 <= pasal_int <= 14:
            return 'Products'  # Produk: Sumber Dana & Akses
        elif 15 <= pasal_int <= 30:
            return 'Products'  # Uang elektronik
        elif 31 <= pasal_int <= 34:
            return 'Products'  # LKD
        elif 35 <= pasal_int <= 44:
            return 'Products'  # Kartu, cek, bilyet giro
        elif 45 <= pasal_int <= 46:
            return 'Products'  # Kanal, penyimpanan data
        elif 47 <= pasal_int <= 48:
            return 'Pricing'   # Skema harga
        elif 49 <= pasal_int <= 59:
            return 'Innovation'  # Inovasi, sandbox
        else:
            return 'Activities'
    
    # BAB IV: Struktur Industri -> Governance
    elif chapter == 'IV':
        return 'Governance'
    
    # BAB V: Tata Kelola & Manajemen Risiko
    elif chapter == 'V':
        if 'risiko inheren' in combined or 'penilaian risiko' in combined:
            return 'RiskManagement'
        elif any(w in combined for w in ['manajemen risiko', 'kerangka manajemen risiko', 'kontrol']):
            return 'RiskManagement'
        elif 'organisasi' in combined or 'fungsi siber' in combined or 'unit' in combined:
            return 'Governance'
        else:
            return 'RiskManagement'
    
    # BAB VI: Praktik Pasar -> Activities
    elif chapter == 'VI':
        return 'Activities'
    
    # BAB VII: Data & Informasi -> Reporting
    elif chapter == 'VII':
        return 'Reporting'
    
    # BAB VIII: Pengawasan -> Supervision
    elif chapter == 'VIII':
        return 'Supervision'
    
    # BAB IX: Pengakhiran -> Supervision
    elif chapter == 'IX':
        return 'Supervision'
    
    # BAB X: Koordinasi -> Governance
    elif chapter == 'X':
        return 'Governance'
    
    # BAB XI & XII: miscellaneous
    elif chapter in ['XI', 'XII']:
        return 'Governance'
    
    # Fallback based on content keywords
    else:
        if any(w in combined for w in ['pengawasan', 'pemeriksaan', 'sanksi', 'penegakan']):
            return 'Supervision'
        elif any(w in combined for w in ['inovasi', 'uji coba', 'sandbox', 'teknologi baru']):
            return 'Innovation'
        elif any(w in combined for w in ['harga', 'pricing', 'biaya', 'tarif', 'pemungutan']):
            return 'Pricing'
        elif any(w in combined for w in ['manajemen risiko', 'prudensial', 'pengendalian', 'kontrol', 'perlindungan konsumen']):
            return 'RiskManagement'
        elif any(w in combined for w in ['uang elektronik', 'kartu', 'kanal', 'instrumen', 'sumber dana', 'produk']):
            return 'Products'
        elif any(w in combined for w in ['aktivitas', 'jasa', 'infrastruktur', 'penyelenggaraan', 'penerusan', 'kliring']):
            return 'Activities'
        else:
            return 'Governance'

# Parse document
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
    
    # Detect BAB
    if stripped.startswith('BAB'):
        rom_match = roman_pattern.match(stripped)
        if rom_match:
            chapter_num = rom_match.group(1).upper()
            after_bab = stripped[rom_match.end():].strip()
            if after_bab:
                chapter_title = after_bab
            else:
                j = i + 1
                while j < len(lines) and not lines[j].strip():
                    j += 1
                chapter_title = lines[j].strip() if j < len(lines) else ''
            current_chapter = chapter_num
            i += 1
            continue
    
    # Detect Pasal
    if stripped.startswith('Pasal'):
        pas_match = pasal_pattern.match(stripped)
        if pas_match:
            # Save previous pasal
            if current_pasal_id and current_pasal_lines:
                title_line = current_pasal_lines[0].strip()
                # Remove leading "Pasal X" from title
                title_clean = re.sub(r'^Pasal\s+\d+\s*[\.\)]?\s*', '', title_line).strip()
                summary = ' '.join([l.strip() for l in current_pasal_lines[1:4] if l.strip() and len(l.strip()) > 20])
                body_text = ' '.join(current_pasal_lines[:min(8, len(current_pasal_lines))])
                
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
            
            # Start new pasal
            current_pasal_id = pas_match.group(1)
            current_pasal_lines = [stripped]
            i += 1
            continue
    
    if current_pasal_id is not None and stripped:
        current_pasal_lines.append(stripped)
    
    i += 1

# Save last
if current_pasal_id and current_pasal_lines:
    title_line = current_pasal_lines[0].strip()
    title_clean = re.sub(r'^Pasal\s+\d+\s*[\.\)]?\s*', '', title_line).strip()
    summary = ' '.join([l.strip() for l in current_pasal_lines[1:4] if l.strip() and len(l.strip()) > 20])
    body_text = ' '.join(current_pasal_lines[:min(8, len(current_pasal_lines))])
    
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
chapter_counts = defaultdict(int)
for r in requirements:
    chapter_counts[r['chapter']] += 1
print("Chapter distribution:", dict(sorted(chapter_counts.items())))

# Appendices
appendices = [
    {
        'id': 'I.a',
        'title': 'Definisi Kunci Pengaturan Industri Sistem Pembayaran',
        'type': 'Glosarium',
        'scope': 'Ketentuan Umum',
        'summary': 'Daftar definisi istilah yang digunakan dalam Peraturan Anggota Dewan Gubernur ini, termasuk Sistem Pembayaran, PSP, PJP, PIP, Sumber Dana, dan lainnya.',
        'contains': [
            'Sistem Pembayaran', 'Penyelenggara Jasa Sistem Pembayaran (PSP)', 'Penyedia Jasa Pembayaran (PJP)',
            'Penyelenggara Infrastruktur Sistem Pembayaran (PIP)', 'Sumber Dana untuk Pembayaran',
            'Layanan Keuangan Digital (LKD)', 'Self-Regulatory Organization (SRO)', 'TIKMI',
            'Dana float'
        ],
        'used_by': []
    },
    {
        'id': 'I.b',
        'title': 'Batas Nilai Uang Elektronik',
        'type': 'Parameter',
        'scope': 'Uang Elektronik',
        'summary': 'Batas nilai uang elektronik: unregistered max Rp2 juta (simpanan), Rp20 juta (transaksi/bulan); registered max Rp20 juta (simpanan), Rp40 juta (transaksi/bulan).',
        'contains': [
            'Uang elektronik unregistered: maksimal simpanan Rp2.000.000, transaksi bulanan Rp20.000.000',
            'Uang elektronik registered: maksimal simpanan Rp20.000.000, transaksi bulanan Rp40.000.000',
            'Transaksi incoming dihitung dalam batas transaksi',
            'Pengecualian untuk akun Penyedia Barang dan Jasa'
        ],
        'used_by': []
    },
    {
        'id': 'I.c',
        'title': 'Kewajiban Penempatan Dana Float',
        'type': 'Kewajiban',
        'scope': 'Uang Elektronik - Prudensial',
        'summary': 'PJP penerbit uang elektronik wajib menempatkan dana float: minimal 30% pada kas/giro bank KBMI 4, maksimal 70% pada surat berharga/CFI.',
        'contains': [
            'Bank KBMI 4: minimal 30% pada kas',
            'Bank non-KBMI 4 dan LSB: minimal 30% pada giro bank KBMI 4',
            'Maksimal 70% pada surat berharga Pemerintah/BI atau rekening BI',
            'Pencatatan dana float pada pos kewajiban',
            'Dana float adalahaset pengguna (dana titipan)'
        ],
        'used_by': []
    },
    {
        'id': 'II.a',
        'title': 'Izin Penerbitan Uang Elektronik Closed Loop',
        'type': 'Kewajiban',
        'scope': 'Uang Elektronik Closed Loop',
        'summary': 'Penerbit uang elektronik closed loop dengan dana float >= Rp1 miliar wajib memiliki izin PJP. Manajemen risiko & pelindungan konsumen wajib.',
        'contains': [
            'Dana float >= Rp1.000.000.000 wajib izin PJP',
            'Multiple closed loop: jumlah dana float dikumulasi',
            'Penerapan manajemen risiko dan pelindungan konsumen wajib',
            'BI berwenang melakukan pemeriksaan pada penerbit < Rp1 miliar',
            'LSB dapat melanjutkan selama proses izin dengan pembatasan'
        ],
        'used_by': []
    },
    {
        'id': 'II.b',
        'title': 'Penerbitan Layanan Keuangan Digital (LKD)',
        'type': 'Persyaratan',
        'scope': 'LKD',
        'summary': 'PJP penerbit uang elektronik dapat menjadi penyelenggara LKD melalui kerja sama dengan agen. Wajib dapatkan persetujuan BI.',
        'contains': [
            'Kerja sama dengan agen LKD (badan usaha Indonesia/individu)',
            'Aspek: manajemen risiko, aset & permodalan, APU/PPT, sistem informasi, monitoring keluhan',
            'Agen LKD harus memiliki kemampuan finansial dan lulus due diligence',
            'PJP hanya dapat bekerja sama dengan agen yang memenuhi kriteria'
        ],
        'used_by': []
    },
    {
        'id': 'III.a',
        'title': 'Standar Nasional Alat Pembayaran Menggunakan Kartu',
        'type': 'Standar',
        'scope': 'Alat Pembayaran Kartu',
        'summary': 'PJP yang memproses transaksi kartu wajib menggunakan standar nasional alat pembayaran menggunakan kartu yang ditetapkan Bank Indonesia.',
        'contains': [
            'Kewajiban penggunaan standar nasional',
            'Tahapan implementing ditetapkan oleh BI',
            'Meliputi kartu kredit, kartu debit, dan kartu ATM'
        ],
        'used_by': []
    },
    {
        'id': 'IV.a',
        'title': 'Framework Uji Coba Inovasi (Regulatory Sandbox)',
        'type': 'Framework',
        'scope': 'Inovasi Teknologi Sistem Pembayaran',
        'summary': 'Kerangka uji coba inovasi: prinsip (criteria-based, transparansi, proporsionalitas, fairness, kesetaraan, forward looking), durasi maksimal 6+6 bulan, status hasil.',
        'contains': [
            'Prinsip: criteria-based process, transparansi, proporsionalitas, fairness, kesetaraan, forward looking',
            'Durasi: maksimal 6 bulan, dapat diperpanjang 1x6 bulan',
            'Sumber: permohonan PSP/pihak lain atau inisiatif BI',
            'Pusat inovasi dapat dibentuk atau ditunjuk pihak lain',
            'Status hasil uji coba: berhasil atau tidak berhasil',
            'BI dapat menetapkan kebijakan tertentu selama uji coba'
        ],
        'used_by': []
    },
    {
        'id': 'IV.b',
        'title': 'Persyaratan Laporan Uji Coba Inovasi',
        'type': 'Format',
        'scope': 'Inovasi Teknologi',
        'summary': 'Dokumen pendukung permohonan uji coba: profil peserta, data inovasi (fitur, manfaat, risiko), skenario uji coba, ruang lingkup, jangka waktu.',
        'contains': [
            'Profil seluruh calon peserta (entitas, narahubung)',
            'Data inovasi: fitur produk, aktivitas, layanan, model bisnis, unsur inovasi, manfaat',
            'Aspek manajemen risiko, keamanan informasi, APU/PPT, kesiapan infrastruktur',
            'Usulan skenario uji coba',
            'Ruang lingkup: batas jumlah pengguna, nominal transaksi, batas wilayah',
            'Jangka waktu pelaksanaan'
        ],
        'used_by': []
    },
    {
        'id': 'V.a',
        'title': 'Uang Elektronik Syariah',
        'type': 'Ketentuan Khusus',
        'scope': 'Uang Elektronik Syariah',
        'summary': 'Penyelenggaraan uang elektronik oleh bank/unit usaha/LSB syariah harus sesuai prinsip syariah. Penempatan dana float pada rekening giro unit usaha syariah bank KBMI 4.',
        'contains': [
            'Sesuai ketentuan PADG sepanjang tidak bertentangan dengan prinsip syariah',
            'Penempatan dana float pada rekening giro unit usaha syariah bank KBMI 4',
            'Atau bank syariah yang memiliki hubungan kepemilikan dengan bank KBMI 4',
            'BI dapat menyesuaikan kebijakan penempatan dana float'
        ],
        'used_by': []
    },
    {
        'id': 'V.b',
        'title': 'Penerimaan dan Penanganan Keluhan',
        'type': 'Prosedur',
        'scope': 'Pengawasan Konsumen',
        'summary': 'Bank Indonesia dapat menerima dan menyampaikan keluhan konsumen terkait penyelenggaraan sistem pembayaran kepada PSP untuk ditindaklanjuti.',
        'contains': [
            'Keluhan konsumen dapat disampaikan ke BI',
            'BI akan menyampaikan keluhan kepada PSP terkait',
            'PSP wajib menindaklanjuti dan melaporkan',
            'Batas waktu penanganan sesuai ketentuan yang berlaku'
        ],
        'used_by': []
    }
]

# Map appendices to pasals
def find_appendix_matches(req):
    matches = []
    title = req.get('title', '').lower()
    summary = req.get('summary', '').lower()
    combined = title + ' ' + summary
    
    if any(w in combined for w in ['uang elektronik', 'e-money', 'electronic money', 'closed loop', 'open loop', 'nilai uang elektronik', 'dana float']):
        matches.extend(['I.a', 'I.b', 'I.c', 'II.a'])
    if any(w in combined for w in ['layanan keuangan digital', 'lkd', 'agen']):
        matches.append('II.b')
    if any(w in combined for w in ['kartu', 'credit', 'debit', 'atm', 'alatre pembayaran menggunakan kartu']):
        matches.append('III.a')
    if any(w in combined for w in ['harga', 'pricing', 'biaya', 'tarif', 'pemakaian', 'pengenaan', 'pemungutan']):
        matches.append('IV.a')
    if any(w in combined for w in ['inovasi', 'uji coba', 'sandbox', 'teknologi baru', 'pusat inovasi']):
        matches.extend(['IV.a', 'IV.b'])
    if any(w in combined for w in ['syariah', 'syaria', 'islami']):
        matches.append('V.a')
    if any(w in combined for w in ['keluhan', 'complain', 'pengaduan', 'sengketa']):
        matches.append('V.b')
    
    return sorted(list(set(matches)))

for req in requirements:
    req['appendices'] = find_appendix_matches(req)

# Build pillar breakdown
pillar_breakdown = {}
for pkey, pmeta in pillar_meta.items():
    count = sum(1 for r in requirements if r['pillar'] == pkey)
    if count > 0:
        pillar_breakdown[pkey] = {
            'key': pkey, 'label': pmeta['label'], 'color': pmeta['color'],
            'icon': pmeta['icon'], 'summary': pmeta['summary'], 'count': count
        }

# Build chapter breakdown
chapter_breakdown = {}
for ckey, cmeta in chapter_meta.items():
    count = sum(1 for r in requirements if r['chapter'] == ckey)
    if count > 0:
        chapter_breakdown[ckey] = {
            'key': ckey, 'label': cmeta['label'], 'color': cmeta['color'],
            'icon': cmeta['icon'], 'summary': cmeta['summary'], 'count': count
        }

# Final data structure
padg_data = {
    'requirements': requirements,
    'appendices': appendices,
    'pillarMeta': pillar_meta,
    'chapterMeta': chapter_meta,
    'appendixTypePalette': {
        'Glosarium': '#2563eb',
        'Parameter': '#0f766e',
        'Kewajiban': '#a16207',
        'Standar': '#7c3aed',
        'Persyaratan': '#b91c1c',
        'Framework': '#144e72',
        'Format': '#059669',
        'Prosedur': '#0891b2',
        'Ketentuan Khusus': '#dc2626',
        'Panduan Implementasi': '#7c2d12'
    }
}

# Files
with open(r'C:\laragon\www\sibukpatuh-vue\public\data\padg_requirements.json', 'w', encoding='utf-8') as f:
    json.dump(requirements, f, indent=2, ensure_ascii=False)

with open(r'C:\laragon\www\sibukpatuh-vue\public\data\padg_appendices.json', 'w', encoding='utf-8') as f:
    json.dump(appendices, f, indent=2, ensure_ascii=False)

# Summary stats
print(f"\n=== PADG Data Generated ===")
print(f"Requirements: {len(requirements)}")
print(f"Appendices: {len(appendices)}")
pillars_found = sorted(pillar_breakdown.keys())
print(f"Pillars: {pillars_found}")
chapters_found = sorted(chapter_breakdown.keys())
print(f"Chapters: {chapters_found}")
print("\nPillar counts:")
for p in pillars_found:
    print(f"  {p}: {pillar_breakdown[p]['count']}")
print("\nChapter counts:")
for c in chapters_found:
    print(f"  BAB {c}: {chapter_breakdown[c]['count']}")
