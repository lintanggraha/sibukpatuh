import json

with open('public/data/padg_requirements.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

ids = [r['id'] for r in data]
print(f"Total: {len(ids)}")
print(f"First 10: {ids[:10]}")

iii_ids = [i for i in ids if i.startswith('III.')]
print(f"III section count: {len(iii_ids)}")
print(f"III sample: {iii_ids[:20]}")

# Check if preset keys exist in data
preset_keys = set([
    'I.1','I.2','II.1','II.2','II.3','II.4',
    'III.5','III.6','III.7','III.8','III.9','III.10',
    'III.11','III.12','III.13','III.14','III.15','III.16',
    'III.17','III.18','III.19','III.20','III.21','III.22',
    'III.23','III.24','III.25','III.26','III.27','III.28',
    'III.29','III.30','III.31','III.32','III.33','III.34',
    'III.35','III.36','III.37','III.38','III.39','III.40',
    'III.41','III.42','III.43','III.44','III.45','III.46',
    'III.47','III.48','III.49','III.50','III.51','III.52',
    'III.53','III.54','III.55','III.56','III.57','III.58','III.59',
    'IV.1','IV.2','IV.3','IV.4','IV.5','IV.6','IV.7','IV.8','IV.9','IV.10','IV.11','IV.12',
    'V.1','V.2','V.3','V.4','V.5','V.6','V.7','V.8','V.9','V.10',
    'V.11','V.12','V.13','V.14','V.15','V.16','V.17','V.18','V.19','V.20',
    'V.21','V.22','V.23','V.24','V.25','V.26',
    'VI.1','VI.2','VI.3','VI.4','VI.5','VI.6','VI.7','VI.8','VI.9','VI.10',
    'VI.11','VI.12','VI.13','VI.14','VI.15','VI.16','VI.17','VI.18','VI.19',
    'VII.1','VII.2','VII.3','VII.4','VII.5','VII.6',
    'VIII.1','VIII.2','VIII.3','VIII.4','VIII.5','VIII.6',
    'IX.1','IX.2','IX.3','IX.4','IX.5','IX.6','IX.7','IX.8','IX.9',
    'X.1','X.2','X.3','X.4','X.5','X.6','X.7','X.8','X.9','X.10','X.11','X.12',
    'XI.1','XI.2','XII.1','XII.2','XII.3','XII.4','XII.5','XII.6'
])

found = [pid for pid in preset_keys if pid in ids]
missing_keys = [pid for pid in preset_keys if pid not in ids]
print(f"\nPreset keys found: {len(found)}/{len(preset_keys)}")
if missing_keys:
    print(f"Missing from data: {missing_keys[:10]}")

# Show sample enriched
print("\nSample enriched entries:")
for r in data[::50][:5]:
    print(f"\n{r['id']}: {r['title'][:60]}")
    print(f"  Analogy: {r['analogy'][:100]}")
