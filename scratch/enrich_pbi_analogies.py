import json
import hashlib
import re

ANALOGY_TEMPLATES = {
    "Kerangka": {
        "patterns": ["kerangka", "sasaran", "prinsip", "ruang lingkup", "objek"],
        "analogies": [
            "Layaknya kompas yang menunjukkan arah perjalanan, kerangka kerja KKS menunjukkan arah penguatan keamanan siber bagi seluruh organisasi.",
            "Layaknya arsitek yang menggambar denah rumah dulu sebelum dibangun, kerangka kerja KKS harus ditetapkan sebelum implementasi.",
            "Layaknya konstitusi yang menjadi hukum tertinggi negara, kerangka KKS menjadi pedoman utama bagi seluruh organisasi.",
            "Layaknya peta yang menunjukkan rute perjalanan, kerangka KKS memetakan area yang harus diperkuat.",
            "Layaknya blue print sebelum membangun gedung, kerangka KKS mendefinisikan struktur keamanan siber."
        ]
    },
    "Tata Kelola": {
        "patterns": ["tata kelola", "governance", "strategi", "kebijakan", "standar", "prosedur", "organisasi"],
        "analogies": [
            "Layaknya CEO yang menentukan arah perusahaan, tata kelola KKS menentukan arah penguatan keamanan siber.",
            "Layaknya board of directors yang oversee perusahaan, tata kelola KKS memberikan oversight terhadap keamanan siber.",
            "Layaknya organisasi yang punya struktur manager, manager proyek, dan tim, tata kelola KKS membagi peran dan tanggung jawab.",
            "Layaknya SOP yang harus diikuti karyawan, standar KKS harus diikuti seluruh personel.",
            "Layaknya strategic planning yearly yang menentukan target perusahaan, strategi KKS menentukan target penguatan keamanan siber."
        ]
    },
    "Pencegahan": {
        "patterns": ["pencegahan", "perlindungan", "pengamanan", "pengelolaan risiko", "profil risiko"],
        "analogies": [
            "Layaknya dokter yang meresepkan vitamin sebelum sakit, pencegahan KKS memperkuat imun organisasi sebelum serangan terjadi.",
            "Layaknya asuransi yang mencegah kerugian finansial, pencegahan KKS mencegah dampak insiden siber.",
            "Layaknya masker yang mencegah virus masuk, kontrol keamanan mencegah ancaman siber masuk.",
            "Layaknya pagar yang melindungi rumah dari pencuri, pengendalian akses melindungi sistem dari akses tidak berwenang.",
            "Layaknya疫苗 yang mencegah penyakit, keamanan siber mencegah serangan sebelum terjadi."
        ]
    },
    "Peringatan Dini": {
        "patterns": ["deteksi", "pemantauan", "peringatan", "monitoring", "sistem peringatan"],
        "analogies": [
            "Layaknya alarm mobil yang berbunyi saat ada penyusup, sistem deteksi mendeteksi ancaman sebelum melukai.",
            "Layaknya cuaca yang dipantau untuk prediksi badai, pemantauan siber memprediksi serangan sebelum terjadi.",
            "Layaknya CCTV yang merekam 24 jam, deteksi berkelanjutan mendeteksi aktivitas mencurigakan.",
            "Layaknya radar yang mendeteksi pesawat musuh, sistem peringatan dini mendeteksi ancaman siber.",
            "Layaknya sensor asap yang mendeteksi kebakaran dini, deteksi dini mendeteksi insiden sebelum meluas."
        ]
    },
    "Penanganan Insiden": {
        "patterns": ["penanganan insiden", "insiden", "pemulihan", "restorasi", "kebaikan"],
        "analogies": [
            "Layaknya tim pemadam kebakaran yang memadamkan api, tim insiden siber memadamkan serangan siber.",
            "Layaknya rumah sakit yang merawat pasien, penanganan insiden memulihkan sistem yang sakit.",
            "Layaknya dokter emergency yang menangani pasien gawat darurat, tim insiden siber menangani krisis dengan cepat.",
            "Layaknya mechanic yang memperbaiki mobil mogok, tim pemulihan memperbaiki sistem yang rusak.",
            "Layaknya plan B yang siap digunakan saat plan A gagal, contingency plan memastikan pemulihan bisa dilakukan."
        ]
    },
    "Audit": {
        "patterns": ["audit", "evaluasi", "pengujian", "penilaian", "assesmen"],
        "analogies": [
            "Layaknya auditor yang memeriksa keuangan perusahaan, audit KKS memeriksa kepatuhan terhadap standar.",
            "Layaknya dokter yang check-up rutin, audit KKS mengevaluasi kesehatan keamanan siber.",
            "Layaknya quality control yang проверка продукции, audit проверка bahwa kontrol keamanan efektif.",
            "Layaknya пробное медицинское обследование, pengujian keamanan menemukan kelemahan sebelum dieksploitasi.",
            "Layaknya test Drive sebelum beli mobil, pengujian sistem memastikan keamanan bekerja."
        ]
    },
    "Budaya": {
        "patterns": ["budaya", "kesadaran", "pelatihan", "edukasi"],
        "analogies": [
            "Layaknya budaya keselamatan kerja yang harus diikuti semua karyawan, budaya KKS harus dipahami seluruh personnel.",
            "Layaknya training keselamatan kerja sebelum mulai kerja, pelatihan KKS harus diikuti sebelum akses sistem.",
            "Layaknya safety briefing sebelum naik pesawat, kesadaran keamanan harus dimiliki seluruh karyawan.",
            "Layaknya olahraga yang jadi gaya hidup, budaya KKS harus jadi gaya hidup organisasi.",
            "Layaknya bahasa yang dikomunikasikan seluruh karyawan, kesadaran keamanan harus dikomunikasikan ke semua orang."
        ]
    },
    "Pengawasan": {
        "patterns": ["pengawasan", "kolaborasi", "koordinasi", "SRO", "Bank Indonesia"],
        "analogies": [
            "Layaknya OJK yang mengawasi bank, Bank Indonesia mengawasi penyelenggara sistem pembayaran.",
            "Layaknya polisi yang patroli untuk jaga keamanan, pengawasan memastikan kepatuhan terhadap aturan.",
            "Layaknya RT RW yang koordinasi dengan warga, koordinasi SRO memastikan kolaborasi antar pihak.",
            "Layaknya komite yang oversee proyek, pengawasan oversight memastikan program berjalan sesuai rencana.",
            "Layaknya check point di jalan tol, pengawasan memastikan hanya yang berhak yang lewat."
        ]
    },
    "Data dan Informasi": {
        "patterns": ["data", "informasi", "laporan", "kerentanan"],
        "analogies": [
            "Layaknya financial report yang harus disampaikan ke Direksi, laporan KKS harus disampaikan ke regulator.",
            "Layaknya medical record pasien, data KKS harus dijaga kerahasiaannya.",
            "Layaknya arsip penting yang disimpan di brankas, informasi sensitif harus dilindungi.",
            "Layaknya census data yang harus akurat, data KKS harus akurat dan lengkap.",
            "Layaknya log book yang merekam semua aktivitas, log sistem merekam untuk keperluan forensik."
        ]
    },
    "default": [
        "Layaknya kompas yang menunjukkan arah perjalanan, KKS membantu organisasi menavigasi ancaman siber dengan tenang.",
        "Layaknya asuransi yang melindungi dari risiko tak terduga, KKS melindungi organisasi dari dampak serangan siber.",
        "Layaknya dokter yang meresepkan obat pencegahan, KKS memperkuat imun organisasi terhadap ancaman siber.",
        "Layaknya satpam yang jaga keamanan gedung, KKS jaga keamanan sistem organisasi 24/7.",
        "Layaknya safety drill yang melatih evakuasi, simulasi KKS melatih respons terhadap insiden.",
        "Layaknya SOP yang harus dipahami semua karyawan, standar KKS harus dipahami seluruh personnel.",
        "Layaknya maintenance berkala yang menjaga mesin tetap jalan, pemeliharaan KKS menjaga sistem tetap aman.",
        "Layaknya health check sebelum kerja, assessment KKS mengevaluasi kondisi keamanan siber.",
        "Layaknya passport yang buktiin identitas, audit buktiin kepatuhan terhadap standar.",
        "Layaknya GPS yangGUIDANCE kita ke tujuan, roadmap KKS membimbing penguatan keamanan siber.",
        "Layaknya toolkit yang准备好 untuk perbaikan, tool keamanan siber помогает penanganan insiden.",
        "Layaknya team meeting yang memastikan semua sejalan, komite KKS memastikan semua pihak koordinasi.",
        "Layaknya insurance policy yang даёт ketenangan pikiran, KKS даёт ketenangan bahwa sistem aman.",
        "Layaknya fire escape plan yang sudah dilatih, rencana pemulihan sudah disiapkan jika terjadi insiden.",
        "Layaknya backup system yang otomatis aktif saat utama gagal, backup plan memastikan kontinuitas operasional.",
        "Layaknya security camera yang terus merekam, monitoring memastikan tidak ada yang terlewat.",
        "Layaknya password policy yang memperkuat akses, kebijakan KKS memperkuatpostur keamanan.",
        "Layaknya penetration test yang mencari kelemahan, pengujian membantu menemukan漏洞 sebelum dieksploitasi.",
        "Layaknya incident report yang dokumentasikan untuk pembelajaran, dokumentasi membantu pembelajaran dari insiden.",
        "Layaknya lessons learned yang dibahas setelah proyek selesai, review membantu perbaikan berkelanjutan."
    ]
}

def normalize_text(text):
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text.lower()).strip()

def get_best_category(req):
    summary = normalize_text(req.get('summary', ''))
    title = normalize_text(req.get('title', ''))
    domain = normalize_text(req.get('domain', ''))
    combined = f"{summary} {title} {domain}"
    
    best_match = None
    best_match_count = 0
    
    for category, data in ANALOGY_TEMPLATES.items():
        if category == "default":
            continue
        patterns = data.get("patterns", [])
        match_count = 0
        for pattern in patterns:
            if pattern in combined:
                match_count += 1
        if match_count > best_match_count:
            best_match_count = match_count
            best_match = category
    
    return best_match if best_match else "default"

def pick_analogy_deterministic(category, req_id, index):
    if category == "default":
        data = ANALOGY_TEMPLATES["default"]
    else:
        data = ANALOGY_TEMPLATES[category]["analogies"]
    
    hash_input = f"{category}:{req_id}:{index}"
    hash_value = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)
    return data[hash_value % len(data)]

def main():
    with open('public/data/pbi_022024_requirements.json', 'r', encoding='utf-8') as f:
        requirements = json.load(f)
    
    total = len(requirements)
    updated = 0
    
    for idx, req in enumerate(requirements):
        req_id = req.get('id', '')
        old_analogy = req.get('analogy', '')
        
        # Skip the first two which are already good
        if req_id in ['PBI.KRK-01', 'PBI.KRK-02']:
            continue
        
        # Check if the analogy is generic
        if 'Bertindak sebagai panduan' in old_analogy or 'analogi untuk' in old_analogy.lower():
            category = get_best_category(req)
            new_analogy = pick_analogy_deterministic(category, req_id, idx)
            req['analogy'] = new_analogy
            updated += 1
    
    with open('public/data/pbi_022024_requirements.json', 'w', encoding='utf-8') as f:
        json.dump(requirements, f, ensure_ascii=False, indent=2)
    
    print(f"Total requirements: {total}")
    print(f"Analogies updated: {updated}")

if __name__ == '__main__':
    main()