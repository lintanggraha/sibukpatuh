import json
import hashlib
import re

ANALOGY_TEMPLATES = {
    "system_pembayaran": {
        "patterns": ["sistem pembayaran", "infrastruktur sistem pembayaran", "penyelenggaraan sistem pembayaran"],
        "analogies": [
            "Layaknya jalan tol yang menghubungkan antar kota, infrastruktur pembayaran menghubungkan pihak-pihak yang ingin bertukar nilai agar transaksi bisa terjadi.",
            "Layaknya pipa air yang membawa air dari sumber ke rumah tangga, sistem pembayaran membawa dana dari satu rekening ke rekening lain.",
            "Layaknya jaringan listrik yang menyuplai energi ke rumah-rumah, sistem pembayaran menyuplai dana ke seluruh ekonomi.",
            "Layaknya jalan kereta api yang menghubungkan stasiun-stasiun, infrastruktur pembayaran menghubungkan bank dan lembaga keuangan.",
            "Layaknya internet yang menghubungkan perangkat di seluruh dunia, sistem pembayaran menghubungkan pelaku ekonomi."
        ]
    },
    "uang_elektronik": {
        "patterns": ["uang elektronik", "e-money", "e-money", "emoney"],
        "analogies": [
            "Layaknya kartu Flazz atau OVO yang tinggal tap untuk bayar, uang elektronik adalah saldo digital yang siap dipakai kapan saja.",
            "Layaknya pulsa yang bisa dipakai untuk telepon dan internet, uang elektronik adalah saldo digital untuk berbagai transaksi.",
            "Layaknya chip pada kartu Flazz yang menyimpan saldo, uang elektronik menyimpan nilai dalam bentuk digital di server.",
            "Layaknya prepaid card yang harus di-top up dulu sebelum bisa dipakai, uang elektronik harus diisi ulang sebelum transaksi.",
            "Layaknya uang cash tapi berwujud digital, uang elektronik adalah alternatif pembayaran yang praktis."
        ]
    },
    "kartu": {
        "patterns": ["kartu kredit", "kartu debit", "kartu atm", "alat pembayaran menggunakan kartu", "apmk"],
        "analogies": [
            "Layaknya KTP yang buktiin identitas seseorang, kartu pembayaran buktiin bahwa pemilik punya akses ke dana yang akan ditransfer.",
            "Layaknya kunci yang membuka gembok tertentu, kartu membuka akses ke rekening pemilik untuk transaksi.",
            "Layaknya surat kuasa yang memberi wewenang seseorang untuk mengambil barang, kartu memberi wewenang untuk mentransfer dana.",
            "Layaknya tanda pengenal yang harus ditunjukkan saat masuk gedung, kartu harus ditunjukkan saat bertransaksi.",
            "Layaknya remote yang mengoperasikan TV dari jarak jauh, kartu memungkinkan pembayaran dilakukan dari mana saja."
        ]
    },
    "transfer": {
        "patterns": ["transfer", "pemindahan dana", "setelmen"],
        "analogies": [
            "Layaknya mengirim paket melalui kurir, transfer mengirim dana dari satu rekening ke rekening lain.",
            "Layaknya memindahkan uang dari satu dompet ke dompet lain, transfer memindahkan dana antar bank.",
            "Layaknya sms yang dikirim dari nomor satu ke nomor lain, transfer mengirim instruksi pembayaran antar pihak.",
            "Layaknya transfer barang melalui ekspedisi, transfer dana memindahkan nilai dari satu pihak ke pihak lain.",
            "Layaknya汇款 yang dikirim keluarga di luar negeri, transfer memastikan dana sampai ke tujuan dengan cepat."
        ]
    },
    "kliring": {
        "patterns": ["kliring"],
        "analogies": [
            "Layaknya itung-itungan di pasar yang menentukan siapa harus bayar siapa, kliring menghitung saldo bersih antar pihak.",
            "Layaknya pencocokan catatan antara dua pihak sebelum deal ditutup, kliring mencocokkan transaksi sebelum setelmen.",
            "Layaknya proses akhir hari di kasir yang menghitungtotal penjualan, kliring menghitung transaksi harian.",
            "Layaknya netting di pasar saham yang menjumlahkan transaksi beli dan jual, kliring menjumlahkan transaksi antar peserta."
        ]
    },
    "float": {
        "patterns": ["dana float", "float", "penempatan dana", "dana用户提供"],
        "analogies": [
            "Layaknya deposit yang ditaruh di brankas hotel, dana float adalah uang pelanggan yang disimpan terpisah dari operasional.",
            "Layaknya uang yang ditaruh di escrow sebelum deal ditutup, dana float disimpan sementara sebelum digunakan.",
            "Layaknya tabungan yang dipisahkan untuk tujuan tertentu, dana float disimpan di rekening terpisah.",
            "Layaknya uang kas kecil yang disimpan di brankas, dana float adalah uang cadangan yang siap digunakan kapan saja.",
            "Layaknya uang yang ditaruh di trust account sebelum pembangunan selesai, dana float dijaga agar tidak digunakan sembarangan."
        ]
    },
    "izin": {
        "patterns": ["izin", "persetujuan", "lisensi"],
        "analogies": [
            "Layaknya SIM yang harus dimiliki sebelum boleh nyetir, izin diperlukan sebelum boleh beroperasi di industri pembayaran.",
            "Layaknya izin usaha yang harus dimiliki toko sebelum buka, izin diperlukan sebelum peluncuran layanan.",
            "Layaknya lisensi mengemudi yang buktiin kemampuan menyetir, izin buktiin bahwa penyelenggara memenuhi syarat.",
            "Layaknya sertifikat yang ditempel di dinding praktik dokter, izin ditempelkan sebagai bukti kepatuhan.",
            "Layaknya kartu identitas yang harus ditunjukkan saat dicek, izin harus ditunjukkan saat diminta regulator."
        ]
    },
    "pjp": {
        "patterns": ["penyelenggara jasa pembayaran", "pjp", "penyelenggara payment"],
        "analogies": [
            "Layaknya restoran yang melayani pelanggan, PJP adalah pihak yang berhadapan langsung dengan pengguna akhir.",
            "Layaknya kasir di supermarket yang menerima pembayaran, PJP adalah wajah sistem pembayaran bagi konsumen.",
            "Layaknya bankir yang melayani nasabahnya, PJP melayani pengguna dalam transaksi harian.",
            "Layaknya customer service yang menangani keluhan pelanggan, PJP menangani pertanyaan dan masalah pengguna.",
            "Layaknya kasir yang menerima pembayaran di kasir, PJP menerima dana dari pengguna dalam setiap transaksi."
        ]
    },
    "pip": {
        "patterns": ["penyelenggara infrastruktur pembayaran", "pip", "infrastruktur"],
        "analogies": [
            "Layaknya jalan tol yang menghubungkan antar kota, PIP menyediakan jalan bagi transaksi untuk mengalir.",
            "Layaknya tower jaringan yang meneruskan sinyal, PIP meneruskan data transaksi antar pihak.",
            "Layaknya pusat data yang menyimpan dan memproses informasi, PIP menyimpan dan memproses data transaksi.",
            "Layaknya stamdat yang menghubungkan satu kota ke kota lain, PIP menghubungkan bank dan lembaga keuangan.",
            "Layaknya rel kereta yang menghubungkan stasiun, PIP menghubungkan berbagai sistem dalam ekosistem pembayaran."
        ]
    },
    "manajemen_risiko": {
        "patterns": ["manajemen risiko", "pengelolaan risiko", "penerapan prinsip tata kelola"],
        "analogies": [
            "Layaknya asuransi yang melindungi dari kerugian tak terduga, manajemen risiko melindungi dari dampak insiden.",
            "Seperti sabuk pengaman yang wajib dipakai di mobil, proteksi risiko wajib diterapkan agar aman.",
            "Layaknya dokter yang meresepkan obat pencegahan, manajemen risiko mencegah masalah sebelum terjadi.",
            "Layaknya Jaring pengaman di sirkuit formula 1, manajemen risiko mencegah jatuhnya korban.",
            "Layaknya payung yang dibawa saat cuaca tidak pasti, manajemen risiko disiapkan untuk hujan badai."
        ]
    },
    "perlindungan_konsumen": {
        "patterns": ["perlindungan konsumen", "hak konsumen", "kepentingan konsumen"],
        "analogies": [
            "Layaknya konsumen yang dilindungi hak-haknya oleh BPSK, pengguna sistem pembayaran dilindungi dari praktik curang.",
            "Layaknya pasien yang dilindungi kerahasiaannya oleh UU Praktik Kedokteran, data pengguna dilindungi kerahasiaannya.",
            "Layaknya pembeli yang dilindungi oleh UU Perlindungan Konsumen, pengguna dilindungi dari penipuan.",
            "Layaknya penyewa yang dilindungi oleh aturan sewa menyewa, hak pengguna dilindungi dalam setiap transaksi.",
            "Layaknya penumpang yang dilindungi oleh aturan keselamatan transportasi, pengguna dilindungi dalam setiap pembayaran."
        ]
    },
    "keamanan": {
        "patterns": ["keamanan", "pencegahan", "proteksi", "perlindungan"],
        "analogies": [
            "Layaknya gembok pada pintu yang mencegah pencuri masuk, keamanan mencegah akses tidak berwenang.",
            "Layaknya alarm yang berbunyi saat ada penyusup, kontrol keamanan mendeteksi ancaman.",
            "Layaknya asuransi yang melindungi dari risiko pencurian, keamanan melindungi dari kerugian.",
            "Layaknya masker yang melindungi dari virus, keamanan melindungi dari ancaman siber.",
            "Layaknya pagar yang membatasi siapa yang boleh masuk, kontrol keamanan membatasi akses."
        ]
    },
    "transparansi": {
        "patterns": ["transparansi", "informasi yang memadai", "pengungkapan"],
        "analogies": [
            "Layaknya menu restoran yang menampilkan harga, transparansi memastikan pengguna tahu biaya sebelum transaksi.",
            "Layaknya label nutrisi pada makanan, transparansi memastikan pengguna tahu apa yang mereka bayar.",
            "Layaknya kuitansi yang diberikan setelah belanja, transparansi memastikan ada bukti transaksi.",
            "Layaknya informasi yang dipajang di papan pengumuman, transparansi memastikan semua orang tahu aturan.",
            "Layaknya rapor yang menunjukkan nilai siswa, transparansi menunjukkan biaya dan risiko kepada pengguna."
        ]
    },
    "laporan": {
        "patterns": ["laporan", "pelaporan", "dokumentasi", "penyampaian laporan"],
        "analogies": [
            "Layaknya laporan keuangan bulanan yang diberikan ke direktur, laporan berkala memastikan semua aktivitas tercatat.",
            "Layaknya medical record yang disimpan dokter, rekaman transaksi disimpan untuk keperluan audit.",
            "Layaknya CCTV yang merekam aktivitas 24 jam, log sistem merekam setiap event.",
            "Layaknya pajak penghasilan yang dilaporkan setiap tahun, pelaporan berkala memastikan kepatuhan.",
            "Layaknya absensi yang mencatat kehadiran karyawan, laporan mencatat aktivitas sistem."
        ]
    },
    "sandbox": {
        "patterns": ["uji coba", "sandbox", "pengembangan", "innovation", "pilot"],
        "analogies": [
            "Layaknya beta testing aplikasi yang hanya dibuka untuk grup kecil dulu, sandbox menguji inovasi di lingkungan terbatas.",
            "Layaknya tes mobil baru di track sebelum dijual, sandbox menguji inovasi di lingkungan aman.",
            "Layaknya magang yang belajar sebelum jadi karyawan tetap, inovasi diuji dulu sebelum diterapkan luas.",
            "Layaknya latihan evakuasi sebelum bencana sungguhan, sandbox belajar dari kesalahan tanpa dampak nyata.",
            "Layaknya percobaan obat baru di laboratorium, sandbox menguji di lingkungan terkontrol sebelum rilis."
        ]
    },
    "struktur_industri": {
        "patterns": ["struktur industri", "klasifikasi", "tikmi"],
        "analogies": [
            "Layaknya organisasi perusahaan yang punya level-manager, struktu industri punya klasifikasi PSP berdasarkan kapabilitas.",
            "Layaknya ranking tim di liga olahraga, klasifikasi PSP menentukan level setiap penyelenggara.",
            "Layaknya jenjang karir dari junior ke manager, struktuu industri menunjukkan level kemandirian PSP.",
            "Layaknya kelas VIP dan ekonomi di pesawat, struktu industri membedakan layanan berdasarkan kapabilitas.",
            "Layaknya sistem belt di karate dari putih ke hitam, klasifikasi PSP menunjukkan tingkat kematangan."
        ]
    },
    "pengawasan": {
        "patterns": ["pengawasan", "pemeriksaan", "audit", "evaluasi"],
        "analogies": [
            "Layaknya CCTV yang selalu merekam di pusat perbelanjaan, pengawasan memastikan semua aktivitas tercatat.",
            "Layaknya inspektur yang mengecek standar kualitas, pengawasan memastikan kepatuhan terhadap aturan.",
            "Layaknya auditor yang memeriksa laporan keuangan, pengawasan memeriksa kepatuhan PSP.",
            "Layaknya quality control yang mengecek produk sebelum dijual, pengawasan mengecek kepatuhan sebelum masalah terjadi.",
            "Layaknya dokter yang melakukan check-up rutin, pengawasan melakukan evaluasi berkala."
        ]
    },
    "harga_biaya": {
        "patterns": ["biaya", "harga", "tarif", "fee", "komisi"],
        "analogies": [
            "Layaknya harga barang yang tertera di label, biaya harus diinformasikan sebelum transaksi.",
            "Layaknya taxi meter yang menghitung tarif berdasarkan jarak, biaya dihitung berdasarkan parameter yang jelas.",
            "Layaknya ongkos kirim yang tergantung berat paket, biaya dihitung berdasarkan besaran transaksi.",
            "Layaknya biaya masuk tamanbermain yang harus dibayar dulu, biaya transaksi harus jelas sebelum dilakukan.",
            "Layaknya servis AC yang harganya tergantung kerja, biaya layanan tergantung kompleksitas transaksi."
        ]
    },
    "penerima_terakhir": {
        "patterns": ["penerima akhir", "pengguna akhir", "merchant", "akseptor"],
        "analogies": [
            "Layaknya warung yang menerima pembayaran GoPay, akseptor menerima dana dari pengguna akhir.",
            "Layaknya kasir yang menerima pembayaran di supermarket, akseptor menerima dana dalam transaksi.",
            "Layaknya rental yang menerima бронирование online, akseptor menerima pembayaran dari pelanggan.",
            "Layaknya hotel yang menerima бронирование dari aplikasi, akseptor menerima dana secara elektronik.",
            "Layaknya parkir yang menerima pembayaran via aplikasi, akseptor menerima dana dari berbagai kanal."
        ]
    },
    "agen": {
        "patterns": ["agen", "lKD", "agen LKD"],
        "analogies": [
            "Layaknya Indomaret yang tersebar di mana-mana, agen adalah gerai yang membantu transaksi di luar bank.",
            "Layaknya kurir yang antarin paket ke rumah, agen antartransaksi ke pengguna yang tidak punya akses bank.",
            "Layaknya GRAB yang antarkan makanan, agen antar layanan keuangan ke pengguna akhir.",
            "Layaknya konter pulsa yang isi paket data, agenisi layanan keuangan di titik terdekat.",
            "Layaknya titip absensi yang collect dari rumah ke rumah, agen collect dan salurkan layanan ke pengguna."
        ]
    },
    "Governance": {
        "patterns": ["governance", "ketentuan umum", "kerangka kerja", "tata kelola"],
        "analogies": [
            "Layaknya konstitusi negara yang menjadi hukum tertinggi, PADG menjadi pedoman utama bagi seluruh industri.",
            "Layaknya kompas yang menunjukkan arah perjalanan, PADG menunjukkan arah bagi pelaku industri.",
            "Layaknya peta yang menunjukkan rute perjalanan, PADG menunjukkan jalan bagi penyelenggara.",
            "Layaknya aturan main yang harus dipatuhi pemain, PADG mengatur bagaimana industri harus beroperasi.",
            "Layaknya rambu-rambu yang mengatur lalu lintas, PADG mengatur interaksi antar pelaku industri."
        ]
    },
    "Activities": {
        "patterns": ["aktivitas", "jasa", "infrastruktur"],
        "analogies": [
            "Layaknya restoran yang masak dan sajikan makanan, jasa pembayaran memproses dan sampaikan transaksi.",
            "Layaknya kurir yang antar paket, aktivitas pembayaran mengantarkan dana ke tujuan.",
            "Layaknya pom bensin yang isi bahan bakar kendaraan, aktivitas pembayaran isi daya ekonomi.",
            "Layaknya kasir yang layani pembeli, aktivitas pembayaran layani pengguna.",
            "Layaknyaapotik yang distribusi obat ke apotek, aktivitas pembayaran distribusi dana."
        ]
    },
    "Products": {
        "patterns": ["produk", "sumber dana", "instrumen", "kanal"],
        "analogies": [
            "Layaknya berbagai jenis kendaraan untuk keperluan berbeda, produk pembayaran punya karakteristik berbeda.",
            "Layaknya menu makanan yang berbeda di setiap restoran, produk pembayaran punya fitur berbeda.",
            "Layaknya ukuran pakaian S M L XL, produk pembayaran punya skala berbeda.",
            "Layaknya jenis bensin pertalite pertamax dex, produk pembayaran punya segmentasi berbeda.",
            "Layaknya paket internet harian bulanan, produk pembayaran punya jangka waktu berbeda."
        ]
    },
    "RiskManagement": {
        "patterns": ["risiko", "kontrol", "perlindungan"],
        "analogies": [
            "Layaknya sabuk pengaman yang wajib dipakai, kontrol risiko melindungi pengguna.",
            "Layaknya asuransi yang jaga-jaga risiko, manajemen risiko siapkan dana cadangan.",
            "Layaknya rem yang mengh止 kendaraan, manajemen risiko mengh止 potensi kerugian.",
            "Layaknya pagar yang lindungi dari bahaya, kontrol risiko lindungi pengguna.",
            "Layaknya asuransi kesehatan, manajemen risiko lindungi dari biaya tak terduga."
        ]
    },
    "Pricing": {
        "patterns": ["harga", "biaya", "tarif"],
        "analogies": [
            "Layaknya harga yang tertera di etalase, biaya harus transparan.",
            "Layaknya taxi meter, biaya harus bisa diprediksi.",
            "Layaknya harga barang di supermarket, biaya harus wajar.",
            "Layaknya biaya servis yang ditentukan dulu, biaya harus jelas.",
            "Layaknya ongkos yang sudah ditentukan, biaya harus konsisten."
        ]
    },
    "Innovation": {
        "patterns": ["innovasi", "pengembangan", "pilot"],
        "analogies": [
            "Layaknya percobaan resep baru, inovasi diuji dulu sebelum dijual.",
            "Layaknya beta fitur baru, inovasi diuji dengan grup kecil dulu.",
            "Layaknya desain prototype, inovasi diuji sebelum produksi massal.",
            "Layaknya trial version, inovasi diuji sebelum release.",
            "Layaknya sample, inovasi diuji dulu sebelum komersialisasi."
        ]
    },
    "Supervision": {
        "patterns": ["pengawasan", "audit", "pemeriksaan"],
        "analogies": [
            "Layaknya CCTV yang awasi terus, pengawasan pantau terus aktivitas.",
            "Layaknya inspektur yang проверка kelaikan, pengawasan проверка kepatuhan.",
            "Layaknya auditor yang periksa keuangan, pengawasan periksa catatan.",
            "Layaknya quality check, pengawasan pastikan standar dipenuhi.",
            "Layaknya dokter yang check-up rutin, pengawasan evaluasi kondisi."
        ]
    },
    "Reporting": {
        "patterns": ["laporan", "dokumentasi", "catatan"],
        "analogies": [
            "Layaknya buku kasir, laporan catat semua transaksi.",
            "Layaknya medical record, laporan jadi bukti jika diperlukan.",
            "Layaknya CCTV yang rekam, log jadi bukti insiden.",
            "Layaknya absensi, laporan pastikan semua hadir.",
            "Layaknya pajak, laporan pastikan semua bayar."
        ]
    },
    "default": [
        "Layaknya roda gigipabrik yang harus bekerja selaras, setiap komponen dalam PADG harus berjalan sesuai perannya.",
        "Layaknya orkestra yang butuh konduktor, BI mengarahkan seluruh pelaku industri pembayaran.",
        "Layaknya sopir dan penumpang di mobil yang sama, PSP dan pengguna saling menguntungkan dalam ekosistem.",
        "Layaknya kompas dan peta yang membantu perjalanan, PADG membantu pelaku industri menavigasi aturan.",
        "Layaknya traffic light yang atur lalu lintas, PADG atur interaksi antar pelaku industri.",
        "Layaknya aturan main yang harus dipatuhi pemain, PADG memastikan公平 bermain di industri.",
        "Layaknya paspor yang buktiin identitas, izin buktiin kredibilitas penyelenggara.",
        "Layaknya jadwal yang harus dipatuhi, tenggat waktu harus dipatuhi agar tidak ada sanksi.",
        "Layaknya resep rahasia yang harus dijaga, informasi sensitif harus dilindungi.",
        "Layaknya standar kualitas yang harus dipenuhi, standar teknis harus diikuti.",
        "Layaknya SOP yang harus dilaksanakan, prosedur harus diikuti.",
        "Layaknya kalibrasi alat ukur, standar teknis harus distandarkan.",
        "Layaknya maintenance rutin, pemeliharaan harus dilakukan berkala.",
        "Layaknya training karyawan baru, pelatihan harus diberikan sebelum beroperasi.",
        "Layaknya briefing sebelum misi, Orientasi harus diberikan sebelum peluncuran.",
        "Layaknya safety briefing sebelum dive, pengenalan risiko harus dilakukan dulu.",
        "Layaknya health check sebelum kerja, fitness check harus dilakukan dulu.",
        "Layaknya drug test sebelum hiring, screening harus dilakukan dulu.",
        "Layaknya background check sebelum contract, due diligence harus dilakukan dulu."
    ]
}

def normalize_text(text):
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text.lower()).strip()

def get_best_category(req):
    summary = normalize_text(req.get('summary', ''))
    title = normalize_text(req.get('title', ''))
    chapter_title = normalize_text(req.get('chapter_title', ''))
    pillar = normalize_text(req.get('pillar', ''))
    combined = f"{summary} {title} {chapter_title} {pillar}"
    
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
    with open('public/data/padg_requirements.json', 'r', encoding='utf-8') as f:
        requirements = json.load(f)
    
    total = len(requirements)
    updated = 0
    
    for idx, req in enumerate(requirements):
        req_id = req.get('id', '')
        old_analogy = req.get('analogy', '')
        
        category = get_best_category(req)
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