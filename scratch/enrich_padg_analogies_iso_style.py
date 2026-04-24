import json
import hashlib
import re

ANALOGY_TEMPLATES = {
    "Governance": {
        "pattern": ["tujuan", "ruang lingkup", "penerapan", "ketentuan umum", "kerangka kerja", "struktur industri", "koordinasi", "ketentuan penutup"],
        "analogies": [
            "Seperti kompas kapal yang menunjukkan arah perjalanan ke pulau tujuan, PADG memberikan peta aturan yang jelas bagi seluruh pelaku industri sistem pembayaran tentang apa yang boleh dan tidak boleh dilakukan.",
            "Layaknya rambu-rambu lalu lintas di persimpangan jalan, PADG mengatur arah dan batasan bagi semua pemain di industri sistem pembayaran agar lalu lintas pembayaran tidak macet atau kecelakaan.",
            "Seperti undang-undang yang harus dipatuhi warga negara agar negara bisa berjalan teratur, PADG menjadi pedoman bagi Bank Indonesia, PSP, PJP, PIP, dan semua pihak yang terlibat dalam ekosistem pembayaran.",
            "Layaknya konstitusi negara yang menjadi hukum tertinggi, PADG 32/2025 menjadi pedoman utama bagi seluruh industri sistem pembayaran Indonesia."
        ]
    },
    "Activities": {
        "pattern": ["aktivitas", "jasa sistem pembayaran", "infrastruktur sistem pembayaran", "penyimpanan dana", "penatausahaan", "penerusan transaksi"],
        "analogies": [
            "Layaknya restoran yang punya koki untuk masak dan kasir untuk melayani pembayaran, industri pembayaran butuh pemisahan tugas antara provider jasa dan penggunanya.",
            "Seperti jalur perakitan di pabrik yang dimulai dari penerimaan bahan baku,加工, sampai pengemasan, transaksi pembayaran juga punya tahapan yang harus dilalui agar sampai ke tujuan.",
            "Layaknya surat yang harus melewati pos untuk sampai ke penerima, data transaksi harus melewati jaringan yang benar agar sampai ke pihak yang dituju.",
            "Layaknya dompet yang selalu ada di dalam saku, sumber dana harus selalu tersedia agar pembayaran bisa dilakukan kapan saja."
        ]
    },
    "Products": {
        "pattern": ["sumber dana", "alat pembayaran", "kartu", "uang elektronik", "cek", "bilyet giro", "transfer", "debit", "kredit"],
        "analogies": [
            "Layaknya berbagai jenis kendaraan—mobil, motor, sepeda—yang masing-masing punya kegunaan, instrumen pembayaran juga punya karakteristik berbeda untuk situasi berbeda.",
            "Seperti bensin yang menjadi sumber energi kendaraan, dana yang tersimpan menjadi sumber tenaga untuk setiap transaksi pembayaran.",
            "Layaknya KTP yang buktiin identitas seseorang, kartu pembayaran buktiin bahwa pemilik punya akses ke dana yang akan ditransfer.",
            "Layaknya kunci yang membuka gembok tertentu, setiap instrumen pembayaran punya cara kerja sendiri untuk mengakses dan mentransfer dana."
        ]
    },
    "RiskManagement": {
        "pattern": ["manajemen risiko", "pengelolaan risiko", "perlindungan konsumen", "keamanan", "kerahasiaan", "integritas"],
        "analogies": [
            "Layaknya asuransi yang melindungi dari kerugian tak terduga, manajemen risiko melindungi institusi dan pengguna dari dampak insiden yang tidak diinginkan.",
            "Seperti sabuk pengaman di mobil yang wajib dipakai, proteksi risiko di industri pembayaran wajib diterapkan agar perjalanan transaksi aman sampai tujuan.",
            "Layaknya masker yang melindungi diri dari virus, kontrol keamanan melindungi data dan dana pengguna dari ancaman peretas dan penipu.",
            "Layaknya polisi yang menjaga keamanan lingkungan, regulasi dan pengawasan menjaga agar tidak ada pihak yang merugikan pengguna sistem pembayaran."
        ]
    },
    "Pricing": {
        "pattern": ["harga", "biaya", "tarif", "skema harga", "transparansi", "fee"],
        "analogies": [
            "Layaknya menu restoran yang menampilkan harga setiap hidangan, skema harga dalam sistem pembayaran harus transparan agar pengguna tahu berapa yang harus dibayar.",
            "Seperti karcis masuk tamanbermain yang harganya sudah ditentukan, biaya transaksi juga harus jelas dan tidak boleh sembarangan diubah.",
            "Layaknya taxi meter yang menunjukkan tarif berdasarkan jarak tempuh, biaya dalam sistem pembayaran harus dihitung berdasarkan parameter yang jelas.",
            "Layaknya harga barang yang tertera di label, biaya layanan dalam sistem pembayaran harus diinformasikan terlebih dahulu sebelum transaksi."
        ]
    },
    "Innovation": {
        "pattern": ["innovasi", "sandbox", "uji coba", "pengembangan", "pilot"],
        "analogies": [
            "Layaknya percobaan obat baru di laboratorium sebelum boleh dijual, inovasi sistem pembayaran harus diuji dulu di lingkungan aman sebelum diterapkan secara luas.",
            " Seperti beta testing aplikasi yang hanya dibuka untuk sekelompok pengguna dulu, uji coba inovasi terbatas pada kelompok tertentu sebelum dirilis ke publik.",
            "Layaknya latihan evakuasi sebelum bencana sungguhan terjadi, sandbox memberikan kesempatan untuk belajar dari kesalahan tanpa dampak nyata.",
            "Layaknya magang yang belajar sebelum jadi karyawan tetap, inovasi harus melewati masa percobaan dulu sebelum dianggap layak diterapkan."
        ]
    },
    "Supervision": {
        "pattern": ["pengawasan", "pemeriksaan", "audit", "penegakan", "sanksi"],
        "analogies": [
            "Layaknya CCTV yang selalu merekam aktivitas di pusat perbelanjaan, pengawasan BI memastikan semua aktivitas sistem pembayaran berjalan sesuai aturan.",
            " Seperti polisi yang patroli untuk menjaga ketertiban, pengawas BI memastikan tidak ada yang melanggar aturan main.",
            "Layaknya rapor sekolah yang dilaporkan ke orang tua, hasil pengawasan dilaporkan ke manajemen agar bisa diperbaiki.",
            "Layaknya hakim yang memutus perkara di pengadilan, BI memiliki kewenangan untuk memutus sanksi bagi yang melanggar aturan."
        ]
    },
    "Reporting": {
        "pattern": ["laporan", "pelaporan", "dokumentasi", "rekaman", "catatan"],
        "analogies": [
            "Layaknya buku kasir yang mencatat setiap transaksi, laporan periodik memastikan semua aktivitas tercatat dan bisa dilacak.",
            "Seperti medical record pasien di rumah sakit, rekaman transaksi menjadi bukti jika suatu saat diperlukan untuk investigasi.",
            "Layaknya CCTV yang merekam aktivitas 24 jam, log sistem merekam setiap event untuk keperluan audit dan forensik.",
            "Layaknya pajak penghasilan yang dilaporkan setiap tahun, laporan berkala memastikan kepatuhan dan transparansi kepada regulator."
        ]
    },
    "default": [
        "Layaknya roda gigipabrik yang harus bekerja selaras agar produksi lancar, setiap komponen dalam PADG harus berjalan sesuai perannya masing-masing agar ekosistem pembayaran berfungsi optimal.",
        "Layaknya orkestra yang butuh konduktor agar semua alat musik bermain selaras, BI berperan sebagai konduktor yang mengarahkan seluruh pelaku industri sistem pembayaran.",
        "Layaknya sopir dan penumpang di mobil yang sama—sopir menyetir, penumpang menikmati—PSP menjalankan sistem, pengguna merasakan kemudahan transaksi.",
        "Layaknya tali yang menghubungkan dua titik agar bisa dilalui, infrastruktur pembayaran menghubungkan pihak-pihak yang ingin bertukar nilai agar transaksi bisa terjadi.",
        "Layaknya rambu di jalan yang memberi tahu arah dan aturan, PADG memberi tahu pelaku industri tentang batasan dan kewajiban mereka.",
        "Layaknya paspor yang buktiin identitas pemiliknya, izin dan persetujuan BI buktiin bahwa penyelenggara sudah memenuhi syarat untuk beroperasi.",
        "Layaknya jadwal keberangkatan kereta yang harus dipatuhi penumpang, tenggat waktu pelaporan harus dipatuhi agar tidak ada sanksi.",
        "Layaknya配方 rahasia restoran yang hanya diketahui koki, informasi sensitif dalam sistem pembayaran harus dilindungi agar tidak dibocorkan.",
        "Layaknya kalibrasi timbangan agar timbangannya akurat, standar teknis memastikan semua pemain menggunakan ukuran yang sama.",
        "Layaknya sopir yang wajib punya SIM sebelum boleh nyetir, penyelenggara wajib punya izin sebelum boleh beroperasi di industri sistem pembayaran."
    ]
}

def normalize_text(text):
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text.lower()).strip()

def get_analogy_category(req):
    summary = normalize_text(req.get('summary', ''))
    title = normalize_text(req.get('title', ''))
    chapter_title = normalize_text(req.get('chapter_title', ''))
    pillar = normalize_text(req.get('pillar', ''))
    combined = f"{summary} {title} {chapter_title} {pillar}"
    
    for category, data in ANALOGY_TEMPLATES.items():
        if category == "default":
            continue
        patterns = data.get("pattern", [])
        for pattern in patterns:
            if pattern in combined:
                return category
    return "default"

def pick_analogy_deterministic(category, req_id, index):
    if category == "default":
        data = ANALOGY_TEMPLATES["default"]
    else:
        data = ANALOGY_TEMPLATES[category]["analogies"]
    
    hash_input = f"{category}:{req_id}:{index}"
    hash_value = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)
    return data[hash_value % len(data)]

def main():
    with open('public/data/padg_requirements.json', 'r', encoding='utf-8') as f:
        requirements = json.load(f)
    
    total = len(requirements)
    updated = 0
    
    for idx, req in enumerate(requirements):
        req_id = req.get('id', '')
        old_analogy = req.get('analogy', '')
        
        category = get_analogy_category(req)
        new_analogy = pick_analogy_deterministic(category, req_id, idx)
        
        if new_analogy != old_analogy:
            req['analogy'] = new_analogy
            updated += 1
    
    with open('public/data/padg_requirements.json', 'w', encoding='utf-8') as f:
        json.dump(requirements, f, ensure_ascii=False, indent=2)
    
    print(f"Total requirements: {total}")
    print(f"Analogies updated: {updated}")

if __name__ == '__main__':
    main()