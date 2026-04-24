import json

# 1. Update OJK Resilience Analogies
with open('public/data/seojk_resilience_guidance.json', 'r', encoding='utf-8') as f:
    ojk = json.load(f)

ojk_analogies = {
    'Konteks dan Prioritas Ketahanan Digital': 'Ibarat memilih sistem keamanan untuk rumah, lu harus tahu dulu ruangan mana yang nyimpen barang berharga, bukan pasang alarm di seluruh genteng.',
    'Tata Kelola dan Akuntabilitas Ketahanan Digital': 'Seperti menunjuk kapten kapal saat badai datang. Kalau semua orang mau pegang kemudi, kapalnya malah tenggelam.',
    'Aset, Layanan Penting, dan Ketergantungan ICT': 'Mirip anatomi tubuh manusia. Lu harus tahu organ mana yang kalau sakit bakal bikin lu pingsan, biar penanganannya diprioritaskan.',
    'Pencegahan, Deteksi, dan Respons Insiden': 'Kayak pasang sistem deteksi asap dan pemadam api. Begitu ada percikan, alarm bunyi, dan api langsung dipadamkan sebelum ngebakar seluruh gedung.',
    'Pemulihan Layanan dan Adaptasi': 'Sama kayak kotak P3K dan asuransi kesehatan pas kecelakaan. Lu jatuh, diobatin, terus belajar biar nggak jalan di jalur berlubang yang sama.',
    'Pengujian dan Peningkatan Berkelanjutan': 'Ibarat latihan simulasi kebakaran di kantor. Mending panik pas latihan ketimbang bengong pas beneran ada api.'
}

for item in ojk:
    if item['title'] in ojk_analogies:
        item['analogy'] = ojk_analogies[item['title']]

with open('public/data/seojk_resilience_guidance.json', 'w', encoding='utf-8') as f:
    json.dump(ojk, f, indent=2, ensure_ascii=False)

# 2. Update Cobit Analogies
with open('public/data/cobit_2019.json', 'r', encoding='utf-8') as f:
    cobit = json.load(f)

cobit_domains_an = {
    'EDM': 'Ibarat dewan komisaris atau pemilik klub bola. Mereka gak ikut nendang bola di lapangan, tapi milih pelatih, nentuin target juara, dan ngevaluasi kinerja.',
    'APO': 'Kayak manajer dan arsitek klub bola. Mereka bikin strategi, atur taktik, rancang formasi, dan ngatur anggaran transfer biar tim siap tanding.',
    'BAI': 'Sama kayak tim konstruksi dan rekrutmen. Mereka eksekusi perombakan stadion, beli pemain baru, dan mastiin semuanya udah siap pakai sebelum kickoff.',
    'DSS': 'Ini staf operasional dan tim medis harian. Mereka yang mastiin lapangan tetep hijau, logistik aman, dan pemain cedera langsung dirawat.',
    'MEA': 'Ibarat wasit dan analis VAR. Mereka mantau dari luar lapangan buat mastiin aturan ditaati dan ngasih report apa aja yang salah buat bahan evaluasi.'
}

cobit_df_an = {
    'DF-01': 'Ibarat mobil balap vs mobil keluarga. Kalau strategi nyari inovasi, tata kelola harus fleksibel. Kalau nyari stabilitas, kontrol harus kuat.',
    'DF-02': 'Sama kayak nentuin destinasi liburan di GPS. Tata kelola ini cuma kendaraan, goals itu destinasinya. Harus sinkron biar nyampe.',
    'DF-03': 'Kayak milih jenis asuransi. Kalau hobi olahraga ekstrem, butuh coverage maksimal. Tata kelola harus selaras sama risiko terberat.',
    'DF-04': 'Mirip pergi ke bengkel karena mesin sering mati. Tata kelola lu harus langsung fokus ngobatin penyakit bawaan yang sering dikeluhkan.',
    'DF-05': 'Kayak masang pager rumah di daerah rawan maling vs elit. Ancaman luar nentuin seberapa ketat satpam yang disiapin.',
    'DF-06': 'Ibarat main bola di liga resmi. Suka nggak suka, lu harus ikut aturan main dan regulasi, kalau enggak ya kena kartu merah.',
    'DF-07': 'Beda IT sebagai pabrik sama support. Kalau pabrik mati, bisnis tutup. Kalau cuma support, kontrol standar aja cukup.',
    'DF-08': 'Kayak makan di restoran vs masak sendiri. Walaupun outsource, lu tetep yang nanggung akibat kalau makanannya bikin sakit perut.',
    'DF-09': 'Ibarat milih gaya lari: sprint vs marathon. Tata kelola buat tim agile harus cepet dan gak birokratis.',
    'DF-10': 'Sama kayak jadi early adopter gadget baru. Kalau agresif pake teknologi paling mutakhir, tata kelola harus siap nanggung error.',
    'DF-11': 'Ibarat atur startup vs korporat raksasa. Peraturan RT beda tingkat kerumitannya sama negara, jangan pake baju kedodoran.'
}

for d in cobit.get('domains', []):
    if d['id'] in cobit_domains_an:
        d['analogy'] = cobit_domains_an[d['id']]

for df in cobit.get('design_factors', []):
    if df['id'] in cobit_df_an:
        df['analogy'] = cobit_df_an[df['id']]

with open('public/data/cobit_2019.json', 'w', encoding='utf-8') as f:
    json.dump(cobit, f, indent=2, ensure_ascii=False)

# 3. Update PBI Analogies
with open('public/data/pbi_022024_requirements.json', 'r', encoding='utf-8') as f:
    pbi = json.load(f)

pbi_an = {
    'PBI.KRK-01': 'Sama kayak fondasi dan blueprint sebelum bangun gedung pencakar langit. Kalau blueprint-nya gak ada, gedungnya gampang roboh.',
    'PBI.KRK-02': 'Kayak masang patok batas tanah sertifikat. Biar jelas mana area yang wajib dijaga satpam, mana yang area publik.',
    'PBI.GOV-01': 'Ini kompas dan peta jalannya organisasi. Kalau nggak ada, kapalnya bakal muter-muter aja di lautan tanpa arah.',
    'PBI.GOV-02': 'Kayak nyusun itinerary liburan jangka panjang. Lu udah rencanain kapan ke gunung, kapan ke pantai, plus budgetingnya.',
    'PBI.GOV-03': 'Ibarat buku resep dan SOP di dapur restoran bintang lima. Semua koki harus masak pake standar yang sama biar rasanya konsisten.',
    'PBI.GOV-04': 'Mirip pembagian posisi di tim sepak bola. Harus ada yang jadi striker, bek, dan kiper. Gak bisa semuanya maju nyerang.',
    'PBI.GOV-05': 'Kayak medical check-up rutin. Buat ngetes seberapa sehat badan organisasi lu sebelum penyakitnya jadi kronis.',
    'PBI.GOV-06': 'Ini kayak ngundang food vlogger atau kritikus buat nyicip masakan lu secara objektif, biar ketahuan kurang garam atau kemanisan.',
    'PBI.GOV-07': 'Sama kayak budaya cuci tangan sebelum makan. Kalau udah jadi kebiasaan, nggak perlu disuruh lagi, semua otomatis peduli kebersihan.',
    'PBI.PRV-01': 'Kayak bikin KTP atau rekam medis khusus ancaman. Biar lu tahu kelemahan spesifik lu apa aja, misal alergi ransomware.',
    'PBI.PRV-02': 'Mirip simulasi what-if sebelum investasi. Nge-tes kalau terjadi skenario terburuk, seberapa besar kerugian yang bakal dialami.',
    'PBI.PRV-03': 'Sama kayak nyari tahu organ vital di tubuh. Kalo kelingking luka masih bisa jalan, tapi kalo jantung berhenti, kelar semua.',
    'PBI.PRV-04': 'Kayak ngebangun tembok benteng, parit, dan pos jaga di sekeliling istana biar musuh mikir dua kali sebelum nyerang.',
    'PBI.PRV-05': 'Mirip masukin barang berharga ke dalam brankas berlapis, plus kuncinya cuma dipegang sama orang yang berhak aja.',
    'PBI.PRV-06': 'Ibarat alarm anti-maling dan CCTV yang nyala 24 jam. Pas ada gerakan mencurigakan, alarm langsung bunyi kenceng.',
    'PBI.PRV-07': 'Sama kayak satpam ngecek rekaman CCTV tiap pagi. Jangan-jangan semalem ada kucing lewat atau malah maling beneran yang coba-coba.',
    'PBI.HDL-01': 'Kayak buku panduan evakuasi gempa. Kalau beneran gempa, semua orang udah tahu harus lari lewat pintu mana tanpa panik.',
    'PBI.HDL-02': 'Mirip latihan fire drill di gedung kantoran. Biar kalau ada api beneran, pada nggak dorong-dorongan lari ke tangga darurat.',
    'PBI.HDL-03': 'Kayak nelpon polisi dan pemadam kebakaran pas rumah lu kemalingan atau kebakaran. Lu harus lapor secepatnya, gak boleh ditunda.',
    'PBI.HDL-04': 'Sama kayak PR perusahaan yang bikin press release pas lagi ada krisis. Informasinya harus diatur biar nasabah nggak panik berjamaah.',
    'PBI.HDL-05': 'Mirip proses nyapu pecahan kaca dan bangun ulang atap setelah kena puting beliung, sampe rumah bisa dihunin lagi.',
    'PBI.HDL-06': 'Kayak ngobatin luka terus nambal lubang di jalan yang bikin jatuh. Biar besok-besok nggak ada lagi yang kepeleset di tempat yang sama.',
    'PBI.OVS-01': 'Ibarat polisi lalu lintas di perempatan jalan. Mantau lu bawa helm apa enggak, dan siap nilang kalau lu ugal-ugalan.',
    'PBI.OVS-02': 'Sama kayak ngumpulin rapor sekolah tiap semester. Laporannya harus jujur dan nunjukin progres belajar selama 6 bulan terakhir.',
    'PBI.COL-01': 'Kayak grup WhatsApp siskamling komplek. Kalau ada maling di blok A, blok B dikasih tahu biar siap-siap ngeronda.',
    'PBI.COL-02': 'Mirip kerja sama antar dinas pemadam kebakaran lintas kota. Kalau apinya terlalu besar, mereka saling bantu ngerjain sumber apinya.',
    'PBI.IMP-01': 'Ibarat klasifikasi kelas tinju. Lu harus bertarung di kelas yang sesuai berat badan lu. Aturannya disesuaikan sama kapasitas.'
}

for item in pbi:
    if item['id'] in pbi_an:
        item['analogy'] = pbi_an[item['id']]

with open('public/data/pbi_022024_requirements.json', 'w', encoding='utf-8') as f:
    json.dump(pbi, f, indent=2, ensure_ascii=False)

print('Updated analogies successfully.')

