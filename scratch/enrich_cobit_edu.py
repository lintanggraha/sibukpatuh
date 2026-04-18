import json
import os

def enrich_cobit_educational():
    path = r'c:\laragon\www\sibukpatuh-vue\public\data\cobit_2019.json'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    educational_tips = {
        "IMP-01": [
            "Pastikan ada 'Sponsor' dari level direksi agar inisiatif tidak berhenti di tengah jalan.",
            "Identifikasi 'Pain Points' TI yang paling dirasakan oleh unit bisnis saat ini."
        ],
        "IMP-02": [
            "Lakukan 'Gap Analysis' yang jujur; jangan menutupi kekurangan kapabilitas yang ada.",
            "Gunakan kriteria penilaian maturitas COBIT yang objektif."
        ],
        "IMP-03": [
            "Target tidak harus langsung Level 5; mulailah dari level yang realistis untuk organisasi.",
            "Pilih 'Quick Wins' untuk menunjukkan nilai positif tata kelola dalam waktu singkat."
        ],
        "IMP-04": [
            "Detailkan siapa melakukan apa (RACI Chart) untuk setiap langkah perbaikan.",
            "Alokasikan budget and sumber daya manusia secara konkret."
        ],
        "IMP-05": [
            "Fokuslah pada perubahan perilaku, bukan sekadar tumpukan dokumen kebijakan.",
            "Berikan pelatihan yang relevan bagi personil yang menjalankan proses baru."
        ],
        "IMP-06": [
            "Gunakan dashboard dashboard untuk mengomunikasikan capaian kepada stakeholder.",
            "Evaluasi apakah risiko TI benar-benar berkurang setelah implementasi."
        ],
        "IMP-07": [
            "Tata kelola adalah perjalanan, bukan tujuan akhir. Jaga agar tetap relevan.",
            "Lakukan audit berkala untuk memastikan standar tetap dijalankan dengan konsisten."
        ],
        "DF-01": [
            "Sangat penting! Jika strategi perusahaan adalah Inovasi, maka tata kelola harus fleksibel dan cepat.",
            "Jangan gunakan kontrol yang terlalu ketat jika bisnis membutuhkan kelincahan tinggi."
        ],
        "DF-03": [
            "Fokuskan sumber daya pada area dengan 'Risk Exposure' tertinggi.",
            "Gunakan COBIT untuk memitigasi risiko-risiko kritikal yang teridentifikasi."
        ]
    }

    if 'implementation_phases' in data:
        for item in data['implementation_phases']:
            item['educational_tips'] = educational_tips.get(item['id'], [
                "Pastikan setiap personil memahami peran dan tanggung jawabnya.",
                "Gunakan standar internasional sebagai referensi tambahan bila diperlukan."
            ])
    
    if 'design_factors' in data:
        for item in data['design_factors']:
            item['educational_tips'] = educational_tips.get(item['id'], [
                "Lakukan asesmen berkala terhadap faktor ini karena konteks bisnis bisa berubah.",
                "Libatkan pemilik proses bisnis dalam menentukan bobot faktor ini."
            ])

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

if __name__ == '__main__':
    enrich_cobit_educational()
    print("Educational enrichment complete.")
