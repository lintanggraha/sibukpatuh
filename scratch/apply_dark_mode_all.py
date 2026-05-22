import os
import re

views_dir = r'c:\laragon\www\sibukpatuh-vue\src\views'
files = [f for f in os.listdir(views_dir) if f.endswith('.vue')]

# Common dark mode style template
DARK_MODE_TEMPLATE = """
[data-bs-theme="dark"] .{prefix}-page{{--ink:#f8fafc;--muted:#94a3b8;--line:rgba(255,255,255,.1);--shell:linear-gradient(180deg,#0f172a 0%,#1e293b 100%);--accent-muted:rgba(255,255,255,0.05)}}
[data-bs-theme="dark"] .{prefix}-metric,[data-bs-theme="dark"] .{prefix}-side,[data-bs-theme="dark"] .{prefix}-panel,[data-bs-theme="dark"] .{prefix}-mini,[data-bs-theme="dark"] .{prefix}-side-card{{background:rgba(30,41,59,0.5);border-color:rgba(255,255,255,0.1)}}
[data-bs-theme="dark"] .{prefix}-tab{{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}}
[data-bs-theme="dark"] .{prefix}-tab.active{{background:rgba(30,41,59,0.9);border-color:var(--accent,#48cae4)}}
[data-bs-theme="dark"] .{prefix}-tab i,[data-bs-theme="dark"] .{prefix}-icon{{background:rgba(255,255,255,0.1)}}
[data-bs-theme="dark"] .{prefix}-item,[data-bs-theme="dark"] .{prefix}-tile,[data-bs-theme="dark"] .{prefix}-pillar,[data-bs-theme="dark"] .{prefix}-fn{{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}}
[data-bs-theme="dark"] .{prefix}-item.active,[data-bs-theme="dark"] .{prefix}-tile.active,[data-bs-theme="dark"] .{prefix}-pillar.active,[data-bs-theme="dark"] .{prefix}-fn.active{{background:rgba(30,41,59,0.9);border-color:var(--accent,#48cae4)}}
[data-bs-theme="dark"] .{prefix}-item-code,[data-bs-theme="dark"] .{prefix}-code,[data-bs-theme="dark"] .{prefix}-item-name,[data-bs-theme="dark"] .{prefix}-inspector-head strong,[data-bs-theme="dark"] .{prefix}-mini strong{{color:var(--accent,#48cae4)}}
[data-bs-theme="dark"] .{prefix}-card{{background:rgba(30,41,59,0.6);border-color:rgba(255,255,255,0.1)}}
[data-bs-theme="dark"] .{prefix}-card.active{{background:rgba(30,41,59,0.9);border-color:var(--accent,#48cae4)}}
[data-bs-theme="dark"] .{prefix}-chip,[data-bs-theme="dark"] .{prefix}-pill,[data-bs-theme="dark"] .{prefix}-meta span{{background:rgba(255,255,255,0.1)}}
[data-bs-theme="dark"] .{prefix}-track,[data-bs-theme="dark"] .{prefix}-priority-track{{background:rgba(255,255,255,0.1)}}
[data-bs-theme="dark"] .{prefix}-callout{{background:rgba(30,41,59,0.4)}}
[data-bs-theme="dark"] .{prefix}-note{{background:rgba(30,41,59,0.7);border-color:var(--accent,#48cae4)}}
[data-bs-theme="dark"] .{prefix}-ref{{background:rgba(30,41,59,0.8);border-color:rgba(255,255,255,0.1)}}
[data-bs-theme="dark"] .{prefix}-empty{{background:rgba(30,41,59,0.3);border-color:rgba(255,255,255,0.1)}}
[data-bs-theme="dark"] .modal-shell{{background:#1e293b;border:1px solid rgba(255,255,255,0.1)}}
[data-bs-theme="dark"] .modal-artifact-list li,[data-bs-theme="dark"] .modal-empty{{background:rgba(255,255,255,0.05);color:var(--ink)}}
[data-bs-theme="dark"] .modal-scope{{background:rgba(255,255,255,0.1);color:#48cae4}}
[data-bs-theme="dark"] .modal-req-btn{{background:rgba(30,41,59,0.8);border-color:rgba(255,255,255,0.1);color:var(--ink)}}
"""

for filename in files:
    if filename in ['AboutView.vue', 'ChecklistTools.vue', 'FrameworkAnalysis.vue', 'FrameworkComparison.vue', 'FrameworkIndex.vue', 'GapAnalysis.vue']:
        continue # Skip non-standard views for now

    file_path = os.path.join(views_dir, filename)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find prefix from .*-page
    match = re.search(r'\.([a-z0-9-]+)-page', content)
    if match:
        prefix = match.group(1)
        print(f"Processing {filename} with prefix '{prefix}'")
        
        # Check if already has dark mode vars in the main page class
        if '[data-bs-theme="dark"]' in content:
             # Already partially handled or handled, but let's ensure full coverage
             pass
        
        # We'll insert our dark mode block at the end of the style section
        style_end = content.find('</style>')
        if style_end != -1:
            dark_mode_css = DARK_MODE_TEMPLATE.format(prefix=prefix)
            # Avoid duplicate injection if possible (simple check)
            if f'[data-bs-theme="dark"] .{prefix}-metric' not in content:
                new_content = content[:style_end] + dark_mode_css + content[style_end:]
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"  Applied dark mode to {filename}")
            else:
                print(f"  Dark mode already present in {filename}")
    else:
        print(f"Skipping {filename}, no prefix found.")
