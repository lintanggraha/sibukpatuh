#!/usr/bin/env python3
"""
Add 'analogy' field to all framework JSON files.
Analogies help laypeople understand technical concepts.
"""
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

# ============================================================
# ANALOGY TEMPLATES per framework
# ============================================================

def get_iso_analogy(i, control):
    """ISO 27001 analogies based on control domain/context"""
    domain = control.get('domain', '')
    templates = {
        'Organisasional': [
            "Seperti aturan main dalam olahraga tim, kebijakan keamanan organisasi memberi panduan jelas agar semua pemain bergerak ke arah yang sama.",
            "Seperti konstitusi negara yang jadi dasar hukum, framework tata kelola IT jadi fondasi keputusan keamanan perusahaan.",
            "Seperti struktur organisasi perusahaan yang menentukan siapa lapor ke siapa, kontrol organisasi menentukan alur tanggung jawab keamanan.",
        ],
        'Orang': [
            "Seperti warga negara yang perlu tahu hukum agar tidak melanggar, karyawan perlu pelatihan keamanan agar tidak jadi celah keamanan.",
            "Seperti budaya antre yang terbentuk dari kebiasaan baik, budaya keamanan siber terbentuk dari kesadaran dan pelatihan yang konsisten.",
            "Seperti guru yang membekali murid dengan pengetahuan, organisasi perlu membekali karyawan dengan kesadaran keamanan.",
        ],
        'Fisik': [
            "Seperti pagar, CCTV, dan satpam yang melindungi gedung fisik, kontrol keamanan fisik melindungi server dan infrastruktur IT.",
            "Seperti rumah yang punya pintu terkunci dan alarm, ruang server perlu perlindungan fisik berlapis dari akses tidak sah.",
            "Seperti brankas bank yang melindungi aset berharga, ruang data center dirancang untuk melindungi aset digital paling kritis.",
        ],
        'Teknologi': [
            "Seperti sistem kekebalan tubuh yang terus waspada terhadap virus, kontrol teknologi melindungi sistem dari serangan siber.",
            "Seperti gardu listrik yang punya circuit breaker untuk mencegah kebakaran, firewall dan IDS/IPS mencegah serangan menyebar di jaringan.",
            "Seperti kunci rumah digital yang hanya buka untuk orang berhak, autentikasi memastikan hanya pengguna sah yang bisa akses sistem.",
        ],
        'default': [
            "Seperti sabuk pengaman di mobil: mungkin tidak terasa diperlukan setiap hari, tapi sangat krusial saat hal buruk terjadi.",
            "Seperti cek kesehatan berkala yang mendeteksi penyakit lebih awal, kontrol keamanan mendeteksi kerentanan sebelum dieksploitasi.",
            "Seperti rumah yang butuh fondasi kuat, keamanan siber butuh kontrol dasar yang solid sebelum membangun perlindungan berlapis.",
        ]
    }
    cat_templates = templates.get(domain, templates['default'])
    return cat_templates[i % len(cat_templates)]

def get_cobit_analogy(i, concept):
    """COBIT 2019 analogies based on concept type"""
    concept_type = concept.get('type', '')
    templates = {
        'system_principle': [
            "Seperti pondasi rumah yang menentukan kekuatan bangunan, prinsip sistem menentukan fondasi tata kelola IT perusahaan.",
            "Seperti rambu lalu lintas yang mengatur arus kendaraan, prinsip sistem memberi arahan agar keputusan IT tidak saling bertabrakan.",
        ],
        'framework_principle': [
            "Seperti manual book mobil yang memberi panduan perawatan, prinsip framework memberi panduan implementasi tata kelola yang efektif.",
            "Seperti resep masakan yang memberi langkah-langkah terstruktur, prinsip framework memberi roadmap implementasi yang jelas.",
        ],
        'component': [
            "Seperti roda gigi dalam mesin yang saling terhubung, komponen tata kelola bekerja bersama untuk menghasilkan output yang efektif.",
            "Seperti tim sepakbola yang butuh kiper, bek, gelandang, dan striker, tata kelola butuh komponen lengkap untuk berfungsi optimal.",
        ],
        'design_factor': [
            "Seperti dokter yang menyesuaikan pengobatan dengan kondisi pasien, design factor menyesuaikan tata kelola dengan konteks perusahaan.",
            "Seperti arsitek yang mendesain rumah sesuai iklim dan kebutuhan penghuni, tata kelola didesain sesuai karakteristik perusahaan.",
        ],
        'domain': [
            "Seperti departemen dalam perusahaan yang punya fungsi masing-masing, domain COBIT membagi tanggung jawab tata kelola secara terstruktur.",
            "Seperti fase proyek dari perencanaan hingga evaluasi, domain COBIT memandu siklus tata kelola dari awal hingga akhir.",
        ],
        'implementation_phase': [
            "Seperti perjalanan dari perencanaan hingga destinasi, fase implementasi memandu perusahaan dari kondisi saat ini ke target tata kelola.",
            "Seperti renovasi rumah yang dimulai dari assessment kondisi lalu eksekusi bertahap, implementasi COBIT dilakukan secara terstruktur.",
        ],
        'default': [
            "Seperti kompas yang memberi arah saat tersesat, framework tata kelola memberi panduan saat organisasi menghadapi kompleksitas IT.",
            "Seperti GPS yang merekomendasikan rute terbaik, COBIT membantu organisasi memilih jalur tata kelola yang paling efektif.",
        ]
    }
    cat_templates = templates.get(concept_type, templates['default'])
    return cat_templates[i % len(cat_templates)]

def get_seojk_analogy(i, req):
    """SEOJK analogies based on chapter/domain"""
    chapter = req.get('chapter', '')
    templates = {
        'II': [
            "Seperti dokter yang menilai kondisi pasien sebelum memberi obat, penilaian risiko inheren memahami eksposur sebelum menentukan kontrol.",
            "Seperti peta yang menunjukkan area rawan longsor, penilaian risiko inheren mengidentifikasi area yang paling rentan terhadap ancaman.",
        ],
        'III': [
            "Seperti kapten kapal yang memantau cuaca dan kondisi laut, manajemen risiko siber memantau ancaman dan menyesuaikan strategi.",
            "Seperti sistem rem mobil yang mencegah kecelakaan, kontrol manajemen risiko mencegah insiden siber sebelum terjadi.",
        ],
        'IV': [
            "Seperti sistem kekebalan tubuh yang mendeteksi, merespons, dan pulih dari penyakit, ketahanan siber melindungi dari serangan dan pulih dengan cepat.",
            "Seperti benteng yang punya dinding, penjaga, dan rencana evakuasi, ketahanan siber berlapis untuk menghadapi berbagai skenario ancaman.",
        ],
        'V': [
            "Seperti rapor sekolah yang menunjukkan tingkat penguasaan siswa, penilaian maturitas menunjukkan tingkat kematangan keamanan siber organisasi.",
            "Seperti ujian kenaikan tingkat dalam bela diri, assessment maturitas mengukur seberapa jauh organisasi telah berkembang dalam keamanan.",
        ],
        'VI': [
            "Seperti kalkulator yang menggabungkan berbagai faktor untuk menghitung skor akhir, penentuan tingkat risiko menggabungkan inherent risk dan maturity.",
            "Seperti hasil diagnosa dokter yang mempertimbangkan gejala dan riwayat pasien, tingkat risiko mempertimbangkan eksposur dan kapasitas mitigasi.",
        ],
        'VII': [
            "Seperti simulasi kebakaran yang menguji kesiapan gedung, pengujian siber menguji efektivitas kontrol sebelum serangan nyata terjadi.",
            "Seperti stress test pada jembatan yang memastikan kekuatan struktur, penetration test memastikan sistem mampu menahan serangan.",
        ],
        'VIII': [
            "Seperti tim pemadam kebakaran yang selalu siap siaga, fungsi siber memastikan organisasi siap menghadapi dan merespons insiden.",
            "Seperti departemen darurat di rumah sakit yang terorganisir, unit siber yang independen memastikan respons insiden yang efektif.",
        ],
        'default': [
            "Seperti menjaga rumah: kunci pintu, pasang alarm, dan tahu tetangga siapa yang bisa dipercaya — keamanan siber juga butuh lapisan perlindungan.",
            "Seperti sabuk pengaman di mobil: mungkin tidak terasa diperlukan setiap hari, tapi sangat krusial saat hal buruk terjadi.",
        ]
    }
    cat_templates = templates.get(chapter, templates['default'])
    return cat_templates[i % len(cat_templates)]

def get_pbi_analogy(i, req):
    """PBI analogies based on chapter/domain"""
    domain = req.get('domain', '')
    templates = {
        'Kerangka': [
            "Seperti konstitusi yang jadi dasar negara, kerangka KKS jadi fondasi kebijakan keamanan sistem informasi perusahaan.",
            "Seperti peta yang menunjukkan rute perjalanan, kerangka KKS memberi panduan arah untuk mencapai keamanan sistem informasi.",
        ],
        'Kontrol': [
            "Seperti pagar dan kunci yang melindungi rumah, kontrol KKS melindungi sistem informasi dari akses dan penggunaan tidak sah.",
            "Seperti rambu lalu lintas yang mengatur arus kendaraan, kontrol KKS mengatur akses dan penggunaan sistem informasi.",
        ],
        'Insiden': [
            "Seperti alarm kebakaran yang memberi peringatan dini, deteksi insiden memberi notifikasi cepat sebelum dampak meluas.",
            "Seperti tim SAR yang siap merespons bencana, tim respons insiden siap menangani gangguan sistem informasi.",
        ],
        'Pelaporan': [
            "Seperti laporan kesehatan berkala ke dokter, pelaporan KKS memberi gambaran status keamanan ke regulator.",
            "Seperti notifikasi darurat yang harus disampaikan segera, pelaporan insiden ke BI harus dilakukan dalam waktu singkat.",
        ],
        'Pengawasan': [
            "Seperti auditor yang memeriksa kepatuhan perusahaan, pengawasan BI memastikan perusahaan mematuhi ketentuan KKS.",
            "Seperti ujian sekolah yang mengukur pemahaman siswa, pengawasan mengukur tingkat kepatuhan perusahaan terhadap regulasi.",
        ],
        'default': [
            "Seperti menjaga rumah: kunci pintu, pasang alarm, dan tahu tetangga siapa yang bisa dipercaya.",
            "Seperti sabuk pengaman di mobil: mungkin tidak terasa diperlukan setiap hari, tapi sangat krusial saat hal buruk terjadi.",
        ]
    }
    cat_templates = templates.get(domain, templates['default'])
    return cat_templates[i % len(cat_templates)]

def get_resilience_analogy(i, theme):
    """Resilience analogies based on section"""
    section = theme.get('section', '')
    templates = {
        'A. Latar Belakang': [
            "Seperti memahami medan sebelum berperang, latar belakang memberikan konteks mengapa ketahanan digital menjadi kebutuhan kritis.",
            "Seperti diagnosa awal dokter yang memahami riwayat pasien, latar belakang memahami konteks ketergantungan digital organisasi.",
        ],
        'B. Ketahanan Digital': [
            "Seperti sistem kekebalan tubuh yang terus beradaptasi terhadap virus baru, ketahanan digital beradaptasi terhadap ancaman siber yang berkembang.",
            "Seperti perahu yang dirancang untuk bertahan di badai, ketahanan digital dirancang untuk bertahan dari gangguan dan pulih dengan cepat.",
        ],
        'C. Kerangka Ketahanan Digital': [
            "Seperti tulang punggung yang menopang tubuh, kerangka ketahanan menopang kemampuan organisasi menghadapi gangguan digital.",
            "Seperti fondasi dan struktur bangunan yang membuatnya tahan gempa, kerangka ketahanan membuat organisasi tahan gangguan.",
        ],
        'default': [
            "Seperti payung yang melindungi dari hujan, ketahanan digital melindungi dari gangguan layanan.",
            "Seperti GPS yang menemukan rute alternatif saat jalan utama macet, ketahanan digital menemukan cara untuk terus beroperasi saat gangguan terjadi.",
        ]
    }
    cat_templates = templates.get(section, templates['default'])
    return cat_templates[i % len(cat_templates)]

# ============================================================
# PROCESS EACH FILE
# ============================================================

files_config = [
    ('iso27001.json', get_iso_analogy, 'controls'),
    ('cobit_2019.json', get_cobit_analogy, None),  # nested structure
    ('seojk_requirements.json', get_seojk_analogy, 'requirements'),
    ('pbi_022024_requirements.json', get_pbi_analogy, 'requirements'),
    ('seojk_resilience_guidance.json', get_resilience_analogy, None),  # flat array
]

for filename, analogy_fn, data_key in files_config:
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        print(f"⚠️  {filename} not found, skipping...")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Handle different structures
    if isinstance(data, list):
        # Flat array like nist_csf.json, iso27001.json
        items_list = [(data, 'root')]
    elif isinstance(data, dict):
        # Nested like cobit, seojk, pbi
        items_list = []
        if data_key and data_key in data:
            items_list.append((data[data_key], data_key))
        elif data_key:
            items_list.append((data.get(data_key, []), data_key))
        else:
            # For COBIT: process all list values
            for k, v in data.items():
                if isinstance(v, list) and v and isinstance(v[0], dict):
                    items_list.append((v, k))
    else:
        items_list = []
    
    if not items_list:
        print(f"⚠️  {filename}: no processable data found, skipping...")
        continue
    
    total_count = 0
    for items, source_key in items_list:
        if not isinstance(items, list):
            continue
        for i, item in enumerate(items):
            if isinstance(item, dict):
                item['analogy'] = analogy_fn(i, item)
                total_count += 1
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ {filename}: Added 'analogy' to {total_count} entries")

print("\n🎉 All frameworks enriched with analogies!")
