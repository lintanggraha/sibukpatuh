import json

with open('public/data/padg_requirements.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total requirements: {len(data)}")
print(f"\nFirst 5 entries:")
for r in data[:5]:
    print(f"  {r['id']}: {r['title'][:60]}")

print(f"\nLast 5 entries:")
for r in data[-5:]:
    print(f"  {r['id']}: {r['title'][:60]}")

# Check pillar distribution
from collections import Counter
pillars = Counter(r['pillar'] for r in data)
print(f"\nPillar distribution:")
for p, cnt in pillars.most_common():
    print(f"  {p}: {cnt}")

# Check chapters
chapters = Counter(r['chapter'] for r in data)
print(f"\nChapter distribution:")
for c, cnt in sorted(chapters.items()):
    print(f"  BAB {c}: {cnt}")

# Check for empty titles/ summaries
empty_title = [r for r in data if not r['title'].strip()]
empty_summary = [r for r in data if not r['summary'].strip()]
print(f"\nEmpty titles: {len(empty_title)}")
print(f"Empty summaries: {len(empty_summary)}")

# Check appendices
with open('public/data/padg_appendices.json', 'r', encoding='utf-8') as f:
    apps = json.load(f)
print(f"\nTotal appendices: {len(apps)}")
for a in apps:
    print(f"  {a['id']}: {a['title']} (used by {len(a.get('used_by', []))} requirements)")
