import base64
import urllib.request

mermaid_code = """%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#0f766e', 'primaryTextColor': '#fff', 'primaryBorderColor': '#4fc08d', 'lineColor': '#94a3b8', 'secondaryColor': '#1e293b', 'tertiaryColor': '#334155'}}}%%
graph TD
    classDef main fill:#0f766e,stroke:#4fc08d,stroke-width:3px,color:#fff,rx:10,ry:10,font-size:18px,font-weight:bold;
    classDef sub fill:#1e293b,stroke:#646cff,stroke-width:2px,color:#fff,rx:8,ry:8,font-size:16px;
    classDef leaf fill:#0f172a,stroke:#334155,stroke-width:1px,color:#cbd5e1,rx:5,ry:5,font-size:14px;

    A["🏠 Dashboard Utama<br/><small>Pusat Navigasi SibukPatuh</small>"]:::main

    A --> B["🧠 Intelligence Center<br/><small>OSINT Hub & AI Analysis</small>"]:::sub
    A --> C["📊 Framework Explorer<br/><small>Navigasi Regulasi</small>"]:::sub
    A --> D["🔗 Compliance Synergy<br/><small>Tools & Evaluasi</small>"]:::sub

    B -.-> B1("📡 Threat Feed (OTX)"):::leaf
    B -.-> B2("🐛 Vulnerability Intel (CISA)"):::leaf
    B -.-> B3("🔓 Breach Checker"):::leaf
    B -.-> B4("🤖 AI Analyst (Gemini)"):::leaf

    C -.-> C1("🇮🇩 Nasional<br/><small>SEOJK, PBI, PADG, PDP</small>"):::leaf
    C -.-> C2("🌍 Internasional<br/><small>ISO 27001, NIST, COBIT</small>"):::leaf
    C -.-> C3("🛡️ AppSec<br/><small>OWASP Top 10, ASVS</small>"):::leaf

    D -.-> D1("🕸️ Cross-Mapping Visualizer"):::leaf
    D -.-> D2("⚖️ Framework Analysis"):::leaf
    D -.-> D3("📋 Checklist Tools"):::leaf
    D -.-> D4("🧮 Compliance Simulator"):::leaf
"""

b64 = base64.b64encode(mermaid_code.encode('utf-8')).decode('utf-8')
url = f'https://mermaid.ink/img/{b64}?type=png&bgColor=132238'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
with urllib.request.urlopen(req) as response, open('public/flowchart-diagram.png', 'wb') as out_file:
    out_file.write(response.read())
print("Successfully generated flowchart diagram!")
