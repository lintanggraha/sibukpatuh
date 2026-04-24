import json

with open('public/data/cobit_2019.json', 'r', encoding='utf-8') as f:
    cobit = json.load(f)

# Principles System
ps_an = {
    'GPS-01': 'Kayak masak buat keluarga. Percuma masak mahal-mahal kalau gak ada yang suka. Tata kelola harus ngasih nilai yang beneran dibutuhin stakeholder.',
    'GPS-02': 'Sama kayak periksa mobil ke bengkel. Lu gak bisa cuma ganti oli tapi ngabaiin rem blong. Harus dilihat menyeluruh (holistik) dari semua komponen.',
    'GPS-03': 'Ibarat main layangan. Kalau angin berubah arah, lu harus nyesuaiin tarikan. Tata kelola juga harus dinamis ngikutin perubahan bisnis dan teknologi.',
    'GPS-04': 'Kayak bedanya bos dan eksekutor. Bos (governance) nentuin arah dan ngevaluasi, sementara tim (management) yang ngerjain operasional sehari-hari.',
    'GPS-05': 'Mirip beli baju di penjahit vs beli jadi. Tata kelola harus di-tailor biar pas sama ukuran badan (kebutuhan) organisasi, jangan maksain baju kedodoran.',
    'GPS-06': 'Kayak sistem keamanan bandara. Gak cuma gerbang depan yang dijaga, tapi dari mulai masuk parkiran sampe bagasi harus diawasi end-to-end.'
}

# Principles Framework
pf_an = {
    'GPF-01': 'Ibarat pondasi rumah. Framework harus punya model konseptual yang jelas biar kalau mau nambah lantai di masa depan gak gampang rubuh.',
    'GPF-02': 'Kayak main lego. Framework yang bagus itu terbuka dan fleksibel, bisa digabung-gabungin sama kepingan standar lain tanpa harus ngerusak bentuk aslinya.',
    'GPF-03': 'Sama kayak adaptor universal. COBIT bisa nyambungin berbagai standar, framework, dan regulasi lain biar colokannya cocok semua.'
}

# Components
cmp_an = {
    'CMP-01': 'Kayak SOP di restoran cepat saji. Proses itu resep dan langkah yang bikin burger rasanya selalu sama walau kokinya beda-beda.',
    'CMP-02': 'Ibarat bagan hierarki di medan perang. Struktur organisasi nentuin siapa jenderal yang ngasih perintah dan siapa prajurit yang maju ke depan.',
    'CMP-03': 'Mirip rambu lalu lintas. Prinsip dan kebijakan itu yang ngatur kapan boleh jalan dan kapan harus berhenti biar gak pada tabrakan.',
    'CMP-04': 'Kayak dashboard di mobil. Informasi itu ngasih tahu bensin tinggal berapa dan kecepatan mesin, biar supir bisa ngambil keputusan yang bener.',
    'CMP-05': 'Ibarat budaya antre. Kalau etikanya udah bener, gak perlu ada satpam yang jagain, orang bakal otomatis disiplin sendiri.',
    'CMP-06': 'Kayak milih kru bajak laut. Orang, skill, dan kompetensi itu yang nentuin apakah kapal lu bisa melewati badai atau tenggelam di tengah jalan.',
    'CMP-07': 'Sama kayak alat tempur. Layanan dan infrastruktur itu senjata lu; percuma strategi bagus kalau senjatanya karatan.'
}

for k in ['principles_system', 'principles_framework', 'components']:
    for item in cobit.get(k, []):
        if k == 'principles_system' and item['id'] in ps_an:
            item['analogy'] = ps_an[item['id']]
        elif k == 'principles_framework' and item['id'] in pf_an:
            item['analogy'] = pf_an[item['id']]
        elif k == 'components' and item['id'] in cmp_an:
            item['analogy'] = cmp_an[item['id']]

with open('public/data/cobit_2019.json', 'w', encoding='utf-8') as f:
    json.dump(cobit, f, indent=2, ensure_ascii=False)
print('JSON analogies fully updated')

