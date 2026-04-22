import re, json
from collections import defaultdict

with open(r'C:\laragon\www\sonarqube-CE\PADG-322025-Rev.md', encoding='utf-8') as f:
    lines = f.readlines()

# Metadata (same)
chapter_meta = { ... }  # same as before
pillar_meta = { ... }   # same as before

def map_to_pillar(pasal_num, chapter, title, body):
    # same logic as before
    pass

analogies = { ... }  # all your 144 presets

# Enhanced parse
requirements = []
curr_chapter = None
curr_pasal_id = None
curr_lines = []

roman_re = re.compile(r'^BAB\s+([IVX]+)', re.IGNORECASE)
pasal_re = re.compile(r'^Pasal\s+(\d+)', re.IGNORECASE)

for line in lines:
    s = line.strip()
    
    # BAB detection
    if s.startswith('BAB'):
        m = roman_re.match(s)
        if m:
            curr_chapter = m.group(1).upper()
        continue
    
    # Pasal start
    if s.startswith('Pasal'):
        m = pasal_re.match(s)
        if m:
            # Save previous
            if curr_pasal_id and curr_lines:
                title_clean = re.sub(r'^Pasal\s+\d+\s*[\.\)]?\s*', '', curr_lines[0].strip()).strip()
                body_text = ' '.join(curr_lines[:12])
                pillar = map_to_pillar(curr_pasal_id, curr_chapter or '', title_clean, body_text)
                # Better summary: join non-empty lines after title, up to 150 chars
                body_lines = [l.strip() for l in curr_lines[1:] if l.strip() and len(l.strip()) > 10]
                summary = ' '.join(body_lines[:2]) if body_lines else title_clean
                if len(summary) > 500: summary = summary[:497] + '...'
                
                req = {
                    'id': f"{curr_chapter}.{curr_pasal_id}",
                    'chapter': curr_chapter or '',
                    'chapter_title': chapter_meta.get(curr_chapter or '', {}).get('label', ''),
                    'pillar': pillar,
                    'title': title_clean[:200] or f"Pasal {curr_pasal_id}",
                    'summary': summary[:500],
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
            
            curr_pasal_id = m.group(1)
            curr_lines = [s]
            continue
    
    if curr_pasal_id:
        if s: curr_lines.append(s)

# Save last
if curr_pasal_id and curr_lines:
    title_clean = re.sub(r'^Pasal\s+\d+\s*[\.\)]?\s*', '', curr_lines[0].strip()).strip()
    body_text = ' '.join(curr_lines[:12])
    pillar = map_to_pillar(curr_pasal_id, curr_chapter or '', title_clean, body_text)
    body_lines = [l.strip() for l in curr_lines[1:] if l.strip() and len(l.strip()) > 10]
    summary = ' '.join(body_lines[:2]) if body_lines else title_clean
    if len(summary) > 500: summary = summary[:497] + '...'
    
    req = {
        'id': f"{curr_chapter}.{curr_pasal_id}",
        'chapter': curr_chapter or '',
        'chapter_title': chapter_meta.get(curr_chapter or '', {}).get('label', ''),
        'pillar': pillar,
        'title': title_clean[:200] or f"Pasal {curr_pasal_id}",
        'summary': summary[:500],
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

# Enrich with analogies
count = 0
for req in requirements:
    rid = req['id']
    if rid in analogies:
        req['analogy'] = analogies[rid]
        count += 1
    elif not req.get('analogy'):
        # Generate contextual fallback
        title = req['title'].lower()
        pil = req['pillar']
        pillar_map = {
            'Governance': 'tata kelola',
            'Activities': 'aktivitas operasional',
            'Products': 'produk instrumen',
            'RiskManagement': 'manajemen risiko',
            'Pricing': 'skema harga',
            'Innovation': 'inovasi sandbox',
            'Supervision': 'pengawasan',
            'Reporting': 'pelaporan'
        }
        req['analogy'] = f"Kewajiban {req['chapter_title']}: {req['title'][:70]} - bagian dari {pillar_map.get(pil, 'kepatuhan')} yang wajib dipatuhi PSP."
        count += 1

# Check summaries
empty_sums = [r for r in requirements if not r['summary'] or len(r['summary'].strip()) < 20]
print(f"Empty/short summaries: {len(empty_sums)}")

# Check analogies
missing_anal = [r for r in requirements if not r.get('analogy')]
print(f"Missing analogies: {len(missing_anal)}")

# Save
with open('public/data/padg_requirements.json', 'w', encoding='utf-8') as f:
    json.dump(requirements, f, indent=2, ensure_ascii=False)

print(f"\nSaved {len(requirements)} requirements ({count} enriched with analogies)")
print(f"Sample:")
for r in requirements[100:105]:
    print(f"\n{r['id']}: {r['title'][:60]}")
    print(f"  Summary: {r['summary'][:80]}")
    print(f"  Analogy: {r['analogy'][:90]}")
