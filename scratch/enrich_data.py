import json
import os

def enrich_pbi():
    path = r'c:\laragon\www\sibukpatuh-vue\public\data\pbi_022024_requirements.json'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for item in data:
        if 'analogy' not in item or not item['analogy']:
            item['analogy'] = f"Analogi untuk {item['title']}: Bertindak sebagai panduan agar operasional tetap aman dan terukur."
        if 'appendices' not in item:
            item['appendices'] = [item['article']] if 'article' in item else []
        if 'reporting' not in item or not item['reporting']:
            item['reporting'] = "Pelaporan berkala kepada manajemen dan Bank Indonesia sesuai ketentuan."
        if 'evidence' not in item or not item['evidence']:
            item['evidence'] = ["Dokumen kebijakan terkait", "Bukti pelaksanaan kontrol", "Notulen rapat evaluasi"]

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def enrich_cobit():
    path = r'c:\laragon\www\sibukpatuh-vue\public\data\cobit_2019.json'
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Domains enrichment
    if 'domains' in data:
        for item in data['domains']:
            item['analogy'] = item.get('importance', "Menjadi fondasi untuk koordinasi tata kelola yang efektif.")
            item['evidence'] = ["Governance Charter", "Performance Report", "Risk Assessment Result"]
            item['reporting'] = "Dashboard kinerja tata kelola TI bulanan."
            item['focus'] = item.get('focus', ["Meningkatkan keselarasan bisnis dan TI."])
    
    # Design Factors enrichment
    if 'design_factors' in data:
        for item in data['design_factors']:
            item['analogy'] = "Seperti menyesuaikan setelan jas agar pas dengan ukuran tubuh pemakainya."
            item['details'] = item.get('focus', ["Mempertimbangkan konteks unik enterprise."])
    
    # Implementation Phases enrichment
    if 'implementation_phases' in data:
        for item in data['implementation_phases']:
            item['details'] = item.get('focus', ["Langkah transisi yang terukur."])

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

if __name__ == '__main__':
    enrich_pbi()
    enrich_cobit()
    print("Enrichment complete.")
