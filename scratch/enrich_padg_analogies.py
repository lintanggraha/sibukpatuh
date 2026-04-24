import json
import re
import hashlib

ANALOGY_TEMPLATES = {
    "TIKMI": [
        "TIKMI adalah 'report card' - nilai kinerja PSP biar BI tahu siapa rajin dan siapa nakal!",
        "TIKMI adalah 'health check' - pemeriksaan rutin biar sistem pembayaran tetap sehat!",
        "TIKMI adalah 'KPI dashboard' - metrik utama biar BI bisa bandingkan kinerja PSP!",
        "TIKMI adalah 'ranking system' - biar tahu siapa naik level dan siapa perlu perbaikan!",
    ],
    "uji coba": [
        "Uji coba inovasi adalah 'trial version' - coba dulu baru decide, kayak software beta!",
        "Uji coba inovasi adalah 'test drive' - ngendarai dulu baru beli, biar tahu cocok atau nggak!",
        "Uji coba inovasi adalah 'sandbox play' - main dulu di arena aman sebelum masuk pasar!",
        "Uji coba inovasi adalah 'experiment lab' - eksperimen dulu baru diterapkan secara luas!",
    ],
    "izin": [
        "Izin adalah 'SIM' - nggak boleh nyetir sebelum punya surat izin yang valid!",
        "Izin adalah 'business license' - like toko perlu izin usaha sebelum buka!",
        "Izin adalah 'franchise approval' - harus dapat persetujuan dulu baru boleh pakai merek/logo!",
        "Izin adalah 'operational permit' - like kontraktor perlu izin sebelum kerja di proyek!",
    ],
    "laporan": [
        "Laporan adalah 'progress report' - atasan perlu tahu sudah kerja apa dan hasil apa!",
        "Laporan adalah 'buletin rutin' - kirim kabar berkala biar stakeholder tahu kondisi!",
        "Laporan adalah 'fitness report' - like medical check-up, harus rutin biar tahu sehat atau nggak!",
        "Laporan adalah 'performance diary' - catat achievement biar bisa dievaluasi kemudian!",
    ],
    "risiko": [
        "Manajemen risiko adalah 'safety protocol' - kayak APD di proyek, wajib dipakai!",
        "Manajemen risiko adalah 'insurance policy' - jaga-jaga biar kalau apa-apa nggak rubuh!",
        "Manajemen risiko adalah 'emergency plan' - kalau terjadi apa-apa, tahu harus ngapain!",
        "Manajemen risiko adalah 'risk buffer' - like tabungan darurat, siap-siap kalau ada apa-apa!",
    ],
    "data": [
        "Perlindungan data adalah 'privacy policy' - like dompet, nggak boleh sembarangan orang ngutak-ngatik!",
        "Perlindungan data adalah 'digital privacy' - seperti rumah, tamu harus izin dulu baru boleh masuk!",
        "Perlindungan data adalah 'data security' - like brankas, harus dikunci dan dijaga ketat!",
        "Perlindungan data adalah 'info confidentiality' - rahasia harus dijaga, nggak boleh bocor ke orang nggak berhak!",
    ],
    "konsumen": [
        "Perlindungan konsumen adalah 'customer care' - like restoran harus jaga pelayanan biar pelanggan senang!",
        "Perlindungan konsumen adalah 'consumer safety' - like makanan harus bersih biar nggak keracunan!",
        "Perlindungan konsumen adalah 'buyer protection' - like belanja online ada garansi biar nggak rugikan!",
        "Perlindungan konsumen adalah 'user advocacy' - berdiri di sisi pengguna, lindungi hak mereka!",
    ],
    "penyelenggara": [
        "Penyelenggara adalah 'game organizer' - yang atur mainannya biar fair dan lancar!",
        "Penyelenggara adalah 'platform provider' - like mall, yang sediakan tempat jualan!",
        "Penyelenggara adalah 'service operator' - yang operasionalkan sistem biar bisa dipakai!",
        "Penyelenggara adalah 'facilitator' - yang permudah transaksi antar pihak!",
    ],
    "infrastruktur": [
        "Infrastruktur adalah 'highway system' - jalan tol biar transaksi bisa cepat sampai!",
        "Infrastruktur adalah 'utility network' - like listrik PLN, nggak keliatan tapi harus ada!",
        "Infrastruktur adalah 'backbone' - tulang punggung biar bisa berdiri dan gerak!",
        "Infrastruktur adalah 'plumbing' - pipanya nggak keliatan tapi harus Lancar biar airnya bisa ngalir!",
    ],
    "pengawasan": [
        "Pengawasan adalah 'quality control' - memastikan semua sesuai standar dan aturan!",
        "Pengawasan adalah 'security guard' - jaga-jaga biar nggak ada yang nakal!",
        "Pengawasan adalah 'monitoring system' - like CCTV, pantau terus biar aman!",
        "Pengawasan adalah 'auditor oversight' - periksa ulang biar nggak ada yang salah!",
    ],
    "sistem pembayaran": [
        "Sistem pembayaran adalah 'plumbing of economy' - nggak keliatan tapi ekonomi nggak bisa jalan tanpanya!",
        "Sistem pembayaran adalah 'money highway' - jalan khusus biar duit bisa berpindah tangan!",
        "Sistem pembayaran adalah 'financial pipeline' - like pipa air, harus Lancar biar transaksi berhasil!",
        "Sistem pembayaran adalah 'digital transaction rail' - rel kereta khusus biar uang digital bisa jalan!",
    ],
    "uang elektronik": [
        "Uang elektronik adalah 'prepaid balance' - kayak kartu Flazz, isi dulu baru bisa dipakai!",
        "Uang elektronik adalah 'digital wallet credit' - like dompet digital, isinya bukan uang fisik!",
        "Uang elektronik adalah 'pre-funded money' - duitnya udah ada dulu baru bisa dipake, bukan dari rekening bank!",
        "Uang elektronik adalah 'e-cash' - kayak uang cash tapi wujudnya digital!",
    ],
    "transfer": [
        "Transfer adalah 'digital remittance' - kirim duit ke orang lain tanpa harus ketemu!",
        "Transfer adalah 'funds movement' - kayak courier, duitnya dikirim dari satu rekening ke rekening lain!",
        "Transfer adalah 'money courier' - like GoPay transfer, duit dikirim ke orang lain secara digital!",
        "Transfer adalah 'account to account' - duit pindah dari satu akun ke akun lain!",
    ],
    "kliring": [
        "Kliring adalah 'batch processing' - kumpulkan transaksi dulu baru settle satu-satu!",
        "Kliring adalah 'netting process' - itung saldo akhir dulu baru bayar!",
        "Kliring adalah 'clearing house' - like pasar yang itung dagangan sebelum setelmen!",
        "Kliring adalah 'transaction matching' - cocok-cocokin siapa harus duit siapa biar itungannya bener!",
    ],
    "setelmen": [
        "Setelmen adalah 'final settlement' - titik! transaksi selesai, duit udah sampai!",
        "Setelmen adalah 'funds finalization' - like kasir bilang 'udah lunas', nggak bisa diutak-ngatik lagi!",
        "Setelmen adalah 'D-day' - hari H, transaksi selesai dan nggak bisa dibatalkan!",
        "Setelmen adalah 'completion point' - garis finish, nggak boleh mundur lagi!",
    ],
    "penerbit": [
        "Penerbit adalah 'card issuer' - kayak BCA yang keluarin kartu, yang bertanggung jawab atas kartu tersebut!",
        "Penerbit adalah 'issuer bank' - yang bikin dan keluarin uang elektronik/kartu!",
        "Penerbit adalah 'originator' - yang mulai/inisiasi kartu atau uang elektronik!",
        "Penerbit adalah 'source issuer' - sumber dari mana kartu/uang elektronik itu muncul!",
    ],
    "akseptor": [
        "Akseptor adalah 'merchant partner' - like warung yang terima GoPay, yang bisa terima pembayaran!",
        "Akseptor adalah 'payment receiver' - yang nerima duit dari pembayaran!",
        "Akseptor adalah 'merchant terminal' - like kasir yang bisa terima kartu!",
        "Akseptor adalah 'collecting party' - yang terima pembayaran dari pelanggan!",
    ],
    "agen": [
        "Agen adalah 'branch network' - like Indomaret, gerai yang bantu transaksi!",
        "Agen adalah 'field agent' - orang lapangan yang bantu orang lain transaksi!",
        "Agen adalah 'authorized reseller' - yang dipercaya buat bantu layanan tertentu!",
        "Agen adalah 'touchpoint agent' - titik temu antara sistem dan pengguna akhir!",
    ],
    "kartu": [
        "Kartu adalah 'payment card' - kayak KTP buat bayar, harus ditunjukin dulu baru bisa bayar!",
        "Kartu adalah 'access token' - token buat akses ke sumber dana!",
        "Kartu adalah 'digital ID for payment' - identitas digital yang buktiin kamu punya duit!",
        "Kartu adalah 'funds access key' - like remote, dipencet buat akses rekening!",
    ],
    "transparan": [
        "Transparan adalah 'open book policy' - semua orang bisa lihat, nggak ada yang ditutupi!",
        "Transparan adalah 'clear pricing' - like menu restoran, harga keliatan semua!",
        "Transparan adalah 'no hidden cost' - nggak ada biaya tersembunyi yang bikin kaget!",
        "Transparan adalah 'full disclosure' - bicara jujur, semua informação dikasih tau!",
    ],
    "struktur industri": [
        "Struktur industri adalah 'market map' - peta pemain dan peran masing-masing di ekosistem!",
        "Struktur industri adalah 'org chart' - like diagram organisasi, siapa ngapain dan siapa boss-nya!",
        "Struktur industri adalah 'ecosystem layout' - tata letak siapa harus ngapain biar sistem jalan!",
        "Struktur industri adalah 'industry blueprint' - cetak biru siapa masuk dan apa perannya!",
    ],
    "standar": [
        "Standar teknis adalah 'uniform' - seragam yang harus dipake semua biar konsisten!",
        "Standar teknis adalah 'technical spec' - like tutorial yang harus diikuti!",
        "Standar teknis adalah 'quality threshold' - batas minimal yang harus dicapai!",
        "Standar teknis adalah 'technical guideline' - panduan teknis biar semua satu suara!",
    ],
    "penilaian": [
        "Penilaian kinerja adalah 'performance review' - like rapor, angka-angka yang buktiin kerja keras!",
        "Penilaian kinerja adalah 'scorecard' - kartu Skor biar tahu seberapa bagus!",
        "Penilaian kinerja adalah 'merit evaluation' - itung-itung siapa layak dapat hadiah!",
        "Penilaian kinerja adalah 'achievement measurement' - ukur achievement biar nggak subjektif!",
    ],
    "klasifikasi": [
        "Klasifikasi PSP adalah 'tier system' - like game, ada levelnya: bronze, silver, gold!",
        "Klasifikasi PSP adalah 'categorization' - bagi-bagi biar nggak capek semua di satu tempat!",
        "Klasifikasi PSP adalah 'grouping' - like inbox, sortir berdasarkan kategori biar gampang!",
        "Klasifikasi PSP adalah 'segmentation' - pecah-pecah biar focus pengelolaan!",
    ],
    "perizinan": [
        "Perizinan PSP adalah 'government approval' - harus dapat restu pemerintah dulu baru boleh jalan!",
        "Perizinan PSP adalah 'license grant' - surat izin resmi dari BI biar operasionalnya legal!",
        "Perizinan PSP adalah 'regulatory clearance' - like medical license, harus ada surat lulus dulu!",
        "Perizinan PSP adalah 'official permit' - cap stempel resmi biar nggak ditolak!",
    ],
    "pengakhiran": [
        "Pengakhiran adalah 'shutdown procedure' - like matiin komputer, harus sesuai prosedur!",
        "Pengakhiran adalah 'exit protocol' - prosedur pamitan biar nggak nyusunngkit!-",
        "Pengakhiran adalah 'closure sequence' - urutan matiin biar nggak ada yang masih nyala!",
        "Pengakhiran adalah 'wind-down process' - like tutup toko, harus beres-beres dulu!",
    ],
    "koordinasi": [
        "Koordinasi adalah 'team sync' - like zoom meeting, biar semua satu frekuensi!",
        "Koordinasi adalah 'cross-functional alignment' - like project team, butuh kolaborasi!",
        "Koordinasi adalah 'inter-agency cooperation' - like antardaerah, harus kompak!",
        "Koordinasi adalah 'stakeholder alignment' - like orkestra, semua harus play bareng!",
    ],
    "biaya": [
        "Penetapan biaya adalah 'price tag policy' - semua harga harus jelas dan nggak ada yang sembunyi-sembunyi!",
        "Penetapan biaya adalah 'fee transparency' - like menu restoran, harga harus keliatan semua!",
        "Penetapan biaya adalah 'cost disclosure' - like kuitansi, semua biaya harus dijelasin!",
        "Penetapan biaya adalah 'pricing policy' - aturan harga biar nggak ada yang markup sembarangan!",
    ],
    "default": [
        "Kewajiban ini penting untuk menjaga kestabilan ekosistem pembayaran digital Indonesia.",
        "Ketentuan ini memastikan sistem pembayaran tetap aman dan terpercaya bagi semua pihak.",
        "Aturan ini melindungi kepentingan pengguna dan penyelenggara sistem pembayaran.",
        "Ini bagian dari standar internasional yang harus dipatuhi penyelenggara sistem pembayaran.",
    ]
}

def pick_analogy(keyword, id):
    templates = ANALOGY_TEMPLATES.get(keyword, ANALOGY_TEMPLATES["default"])
    hash_input = f"{keyword}:{id}"
    hash_value = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)
    return templates[hash_value % len(templates)]

def generate_analogy(req_id, summary, title, chapter_title):
    summary_lower = summary.lower()
    title_lower = title.lower() if title else ""
    chapter_lower = chapter_title.lower() if chapter_title else ""
    
    combined = summary_lower + " " + title_lower + " " + chapter_lower
    
    for key in ANALOGY_TEMPLATES.keys():
        if key != "default" and key in combined:
            return pick_analogy(key, req_id)
    
    return pick_analogy("default", req_id)

def is_generic_analogy(analogy):
    if not analogy:
        return True
    
    generic_patterns = [
        "ini adalah bagian dari",
        "kewajiban ",
        "stabilitas sistem pembayaran",
        "tata kelola",
        "aktivitas operasional",
    ]
    
    count = sum(1 for pattern in generic_patterns if pattern in analogy.lower())
    return count >= 2

def main():
    with open('public/data/padg_requirements.json', 'r', encoding='utf-8') as f:
        requirements = json.load(f)
    
    total = len(requirements)
    generic_count = 0
    enriched_count = 0
    
    for req in requirements:
        analogy = req.get('analogy', '')
        
        if is_generic_analogy(analogy):
            generic_count += 1
            new_analogy = generate_analogy(
                req.get('id', ''),
                req.get('summary', ''),
                req.get('title', ''),
                req.get('chapter_title', '')
            )
            req['analogy'] = new_analogy
            enriched_count += 1
    
    with open('public/data/padg_requirements.json', 'w', encoding='utf-8') as f:
        json.dump(requirements, f, ensure_ascii=False, indent=2)
    
    print(f"Total requirements: {total}")
    print(f"Generic analogies found: {generic_count}")
    print(f"Analogies enriched: {enriched_count}")

if __name__ == '__main__':
    main()