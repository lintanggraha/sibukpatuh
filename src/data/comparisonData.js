export const comparisonData = {
  frameworks: [
    { id: 'iso27001', name: 'ISO 27001:2022' },
    { id: 'nist', name: 'NIST CSF 2.0' },
    { id: 'cobit', name: 'COBIT 2019' },
    { id: 'seojk', name: 'SEOJK 29/03/2022' },
    { id: 'pbi', name: 'PBI 02/2024' },
    { id: 'resilience', name: 'Panduan Resiliensi OJK' },
    { id: 'padg', name: 'PADG 32/2025' },
    { id: 'owasp_top10', name: 'OWASP Top 10' },
    { id: 'owasp_asvs', name: 'OWASP ASVS' },
    { id: 'pdp', name: 'UU PDP No. 27/2022' }
  ],
  topics: [
    { id: 'access', name: 'Access Control' },
    { id: 'incident', name: 'Incident Response' },
    { id: 'risk', name: 'Risk Management' },
    { id: 'crypto', name: 'Cryptography' },
    { id: 'bc', name: 'Business Continuity' },
    { id: 'audit', name: 'Audit & Accountability' }
  ],
  // Pemetaan ini dirancang agar setiap pasangan kombinasi framework 
  // akan menghasilkan 24 baris data (4 per topik x 6 topik).
  mappings: [
    // --- ACCESS CONTROL (Topic 1) ---
    {
      topic: 'access',
      iso27001: { id: '5.15', desc: 'Access control policy' },
      nist: { id: 'PR.AA-01', desc: 'Identities and credentials managed' },
      cobit: { id: 'DSS05.04', desc: 'Manage user identity' },
      seojk: { id: 'Bab 2.1', desc: 'Manajemen hak akses' },
      pbi: { id: 'Pasal 10', desc: 'Pengendalian akses logis' },
      resilience: { id: 'IAM-01', desc: 'Identity & Access Management' },
      padg: { id: 'PADG-2', desc: 'Manajemen identitas dan hak akses' },
      owasp_top10: { id: 'A01:2021', desc: 'Broken Access Control' },
      owasp_asvs: { id: 'V2', desc: 'Authentication Verification' },
      pdp: { id: 'Pasal 35', desc: 'Mencegah akses tidak sah ke data pribadi' }
    },
    {
      topic: 'access',
      iso27001: { id: '8.3', desc: 'Information access restriction' },
      nist: { id: 'PR.AA-05', desc: 'Access permissions managed' },
      cobit: { id: 'DSS05.05', desc: 'Manage physical access' },
      seojk: { id: 'Bab 2.2', desc: 'Pembatasan akses informasi' },
      pbi: { id: 'Pasal 11', desc: 'Segregation of duties' },
      resilience: null, // GAP in Resilience
      padg: { id: 'PADG-3', desc: 'Pembatasan akses fisik dan logis' },
      owasp_top10: null,
      owasp_asvs: { id: 'V4', desc: 'Access Control Verification' },
      pdp: null
    },
    {
      topic: 'access',
      iso27001: { id: '8.5', desc: 'Secure authentication' },
      nist: { id: 'PR.AA-03', desc: 'MFA implemented' },
      cobit: null, // GAP
      seojk: { id: 'Bab 2.3', desc: 'Otentikasi multi-faktor' },
      pbi: { id: 'Pasal 12', desc: 'Otentikasi transaksi' },
      resilience: { id: 'IAM-02', desc: 'MFA untuk remote access' },
      padg: { id: 'PADG-4', desc: 'Otentikasi Multi-Faktor (MFA)' },
      owasp_top10: { id: 'A07:2021', desc: 'Identification and Authentication Failures' },
      owasp_asvs: { id: 'V2.8', desc: 'MFA Requirements' },
      pdp: null
    },
    {
      topic: 'access',
      iso27001: null, // GAP
      nist: { id: 'PR.AA-04', desc: 'Identity federation' },
      cobit: { id: 'APO01.03', desc: 'Federated access' },
      seojk: null,
      pbi: null,
      resilience: null,
      padg: null,
      owasp_top10: null,
      owasp_asvs: { id: 'V3', desc: 'Session Management' },
      pdp: null
    },

    // --- INCIDENT RESPONSE (Topic 2) ---
    {
      topic: 'incident',
      iso27001: { id: '5.24', desc: 'Incident management planning' },
      nist: { id: 'RS.MA-01', desc: 'Incident response plan executed' },
      cobit: { id: 'DSS02.05', desc: 'Resolve and recover from incidents' },
      seojk: { id: 'Bab 5.1', desc: 'Prosedur penanganan insiden' },
      pbi: { id: 'Pasal 40', desc: 'Fungsi respons insiden siber' },
      resilience: { id: 'IR-01', desc: 'Manajemen Insiden Siber' },
      padg: { id: 'PADG-IR', desc: 'Prosedur Penanganan Insiden' },
      owasp_top10: { id: 'A09:2021', desc: 'Security Logging and Monitoring Failures' },
      owasp_asvs: { id: 'V7', desc: 'Error Handling and Logging' },
      pdp: { id: 'Pasal 46', desc: 'Kewajiban pemberitahuan kegagalan PDP' }
    },
    {
      topic: 'incident',
      iso27001: { id: '5.26', desc: 'Response to incidents' },
      nist: { id: 'RS.AN-03', desc: 'Incident impact analyzed' },
      cobit: { id: 'DSS02.04', desc: 'Investigate incidents' },
      seojk: { id: 'Bab 5.2', desc: 'Analisis dampak insiden' },
      pbi: { id: 'Pasal 41', desc: 'Investigasi insiden' },
      resilience: { id: 'IR-02', desc: 'Eskalasi dan Analisis Insiden' },
      padg: { id: 'PADG-IR2', desc: 'Analisis Dampak' },
      owasp_top10: null,
      owasp_asvs: { id: 'V7.3', desc: 'Log processing' },
      pdp: null
    },
    {
      topic: 'incident',
      iso27001: { id: '5.28', desc: 'Collection of evidence' },
      nist: { id: 'RS.AN-06', desc: 'Forensic data collected' },
      cobit: { id: 'MEA01.04', desc: 'Collect forensic evidence' },
      seojk: null, // GAP
      pbi: { id: 'Pasal 42', desc: 'Forensik digital' },
      resilience: { id: 'IR-03', desc: 'Pengumpulan bukti digital' },
      padg: { id: 'PADG-IR3', desc: 'Pengumpulan Bukti Forensik' },
      owasp_top10: null,
      owasp_asvs: null,
      pdp: null
    },
    {
      topic: 'incident',
      iso27001: { id: '5.27', desc: 'Learning from incidents' },
      nist: { id: 'RS.MI-01', desc: 'Incidents contained' },
      cobit: null,
      seojk: { id: 'Bab 5.3', desc: 'Mitigasi insiden siber' },
      pbi: { id: 'Pasal 43', desc: 'Containment insiden' },
      resilience: { id: 'IR-04', desc: 'Pemulihan layanan pasca insiden' },
      padg: { id: 'PADG-IR4', desc: 'Lessons Learned & Tindakan Korektif' },
      owasp_top10: null,
      owasp_asvs: null,
      pdp: { id: 'Pasal 47', desc: 'Tindakan pencegahan insiden lanjutan' }
    },

    // --- RISK MANAGEMENT (Topic 3) ---
    {
      topic: 'risk',
      iso27001: { id: '5.8', desc: 'Information security in project management' },
      nist: { id: 'ID.RA-01', desc: 'Vulnerabilities validated' },
      cobit: { id: 'APO12.01', desc: 'Collect risk data' },
      seojk: { id: 'Bab 3.1', desc: 'Manajemen Kerentanan' },
      pbi: { id: 'Pasal 20', desc: 'Penilaian Risiko TI' },
      resilience: { id: 'RM-01', desc: 'Profil risiko siber' },
      padg: { id: 'PADG-RM1', desc: 'Penilaian Risiko TI' },
      owasp_top10: { id: 'A06:2021', desc: 'Vulnerable and Outdated Components' },
      owasp_asvs: { id: 'V1.1', desc: 'Secure Software Development Lifecycle' },
      pdp: { id: 'Pasal 39', desc: 'DPIA (Data Protection Impact Assessment)' }
    },
    {
      topic: 'risk',
      iso27001: { id: '8.8', desc: 'Management of technical vulnerabilities' },
      nist: { id: 'ID.RA-02', desc: 'Cyber threat intel received' },
      cobit: { id: 'APO12.02', desc: 'Analyze risk' },
      seojk: { id: 'Bab 3.2', desc: 'Penetration Testing' },
      pbi: { id: 'Pasal 21', desc: 'Manajemen ancaman siber' },
      resilience: { id: 'RM-02', desc: 'Threat Intelligence' },
      padg: { id: 'PADG-RM2', desc: 'Pemindaian Kerentanan & VAPT' },
      owasp_top10: null,
      owasp_asvs: { id: 'V14', desc: 'Configuration Requirements' },
      pdp: null
    },
    {
      topic: 'risk',
      iso27001: { id: '5.36', desc: 'Compliance with policies' },
      nist: { id: 'ID.RA-03', desc: 'Internal/external threats identified' },
      cobit: { id: 'APO12.03', desc: 'Maintain risk profile' },
      seojk: { id: 'Bab 3.3', desc: 'Audit keamanan sistem' },
      pbi: { id: 'Pasal 22', desc: 'Audit TI Independen' },
      resilience: { id: 'RM-03', desc: 'Evaluasi berkala' },
      padg: { id: 'PADG-RM3', desc: 'Audit Keamanan Berkala' },
      owasp_top10: null,
      owasp_asvs: null,
      pdp: { id: 'Pasal 53', desc: 'Kepatuhan terhadap prinsip PDP' }
    },
    {
      topic: 'risk',
      iso27001: null,
      nist: { id: 'GV.RM-01', desc: 'Risk management strategy' },
      cobit: { id: 'EDM03.01', desc: 'Evaluate risk management' },
      seojk: { id: 'Bab 3.4', desc: 'Selera risiko (Risk Appetite)' },
      pbi: { id: 'Pasal 23', desc: 'Komite Risiko TI' },
      resilience: null,
      padg: null,
      owasp_top10: null,
      owasp_asvs: null,
      pdp: null
    },

    // --- CRYPTOGRAPHY (Topic 4) ---
    {
      topic: 'crypto',
      iso27001: { id: '8.24', desc: 'Use of cryptography' },
      nist: { id: 'PR.DS-01', desc: 'Data-at-rest protected' },
      cobit: { id: 'APO03.02', desc: 'Define baseline architecture (Crypto)' },
      seojk: { id: 'Bab 4.1', desc: 'Kriptografi data sensitif' },
      pbi: { id: 'Pasal 30', desc: 'Perlindungan data nasabah' },
      resilience: { id: 'CR-01', desc: 'Standar Enkripsi' },
      padg: { id: 'PADG-CR1', desc: 'Kriptografi dan Enkripsi' },
      owasp_top10: { id: 'A02:2021', desc: 'Cryptographic Failures' },
      owasp_asvs: { id: 'V6', desc: 'Cryptography Verification Requirements' },
      pdp: { id: 'Pasal 43', desc: 'Keamanan Data Pribadi (Enkripsi)' }
    },
    {
      topic: 'crypto',
      iso27001: { id: '8.2', desc: 'Information classification' },
      nist: { id: 'PR.DS-02', desc: 'Data-in-transit protected' },
      cobit: { id: 'DSS05.02', desc: 'Protect endpoints' },
      seojk: { id: 'Bab 4.2', desc: 'Enkripsi jalur komunikasi' },
      pbi: { id: 'Pasal 31', desc: 'Keamanan jaringan' },
      resilience: { id: 'CR-02', desc: 'Enkripsi End-to-End' },
      padg: { id: 'PADG-CR2', desc: 'Enkripsi Komunikasi Data' },
      owasp_top10: null,
      owasp_asvs: { id: 'V9', desc: 'Communications Verification' },
      pdp: null
    },
    {
      topic: 'crypto',
      iso27001: { id: '8.11', desc: 'Data masking' },
      nist: { id: 'PR.DS-11', desc: 'Data masking applied' },
      cobit: null,
      seojk: { id: 'Bab 4.3', desc: 'Masking & Anonymization' },
      pbi: { id: 'Pasal 32', desc: 'Penyamaran data' },
      resilience: { id: 'CR-03', desc: 'Perlindungan privasi' },
      padg: { id: 'PADG-CR3', desc: 'Masking Data Transaksi' },
      owasp_top10: null,
      owasp_asvs: null,
      pdp: { id: 'Pasal 44', desc: 'Anonimisasi Data Pribadi' }
    },
    {
      topic: 'crypto',
      iso27001: { id: '8.25', desc: 'Secure development lifecycle' },
      nist: null,
      cobit: { id: 'BAI03.04', desc: 'Develop solutions' },
      seojk: null,
      pbi: { id: 'Pasal 33', desc: 'Keamanan kriptografi aplikasi' },
      resilience: null,
      padg: null,
      owasp_top10: null,
      owasp_asvs: { id: 'V6.2', desc: 'Algorithms Requirements' },
      pdp: null
    },

    // --- BUSINESS CONTINUITY (Topic 5) ---
    {
      topic: 'bc',
      iso27001: { id: '5.29', desc: 'InfoSec during disruption' },
      nist: { id: 'RC.RP-01', desc: 'Recovery plan executed' },
      cobit: { id: 'DSS04.01', desc: 'Define BCP policy' },
      seojk: { id: 'Bab 6.1', desc: 'Rencana Kelangsungan Bisnis' },
      pbi: { id: 'Pasal 50', desc: 'Business Continuity Management' },
      resilience: { id: 'BC-01', desc: 'Business Continuity Plan' },
      padg: { id: 'PADG-BC1', desc: 'Rencana Pemulihan Bencana' },
      owasp_top10: null,
      owasp_asvs: null,
      pdp: null
    },
    {
      topic: 'bc',
      iso27001: { id: '5.30', desc: 'ICT readiness for BCP' },
      nist: { id: 'RC.RP-02', desc: 'Recovery plan tested' },
      cobit: { id: 'DSS04.04', desc: 'Exercise BCP' },
      seojk: { id: 'Bab 6.2', desc: 'Uji coba BCP/DRP' },
      pbi: { id: 'Pasal 51', desc: 'Disaster Recovery Plan' },
      resilience: { id: 'BC-02', desc: 'Uji Coba DR berkala' },
      padg: { id: 'PADG-BC2', desc: 'Uji Coba BCP' },
      owasp_top10: null,
      owasp_asvs: null,
      pdp: null
    },
    {
      topic: 'bc',
      iso27001: { id: '8.13', desc: 'Information backup' },
      nist: { id: 'PR.DS-11', desc: 'Data backups maintained' },
      cobit: { id: 'DSS04.07', desc: 'Manage backup arrangements' },
      seojk: { id: 'Bab 6.3', desc: 'Sistem pencadangan (Backup)' },
      pbi: { id: 'Pasal 52', desc: 'Data center & DRC' },
      resilience: { id: 'BC-03', desc: 'Off-site backup terenkripsi' },
      padg: { id: 'PADG-BC3', desc: 'Pencadangan Data' },
      owasp_top10: null,
      owasp_asvs: null,
      pdp: null
    },
    {
      topic: 'bc',
      iso27001: { id: '8.14', desc: 'Redundancy of information processing' },
      nist: { id: 'RC.CO-03', desc: 'Recovery communications' },
      cobit: { id: 'DSS04.08', desc: 'Conduct post-resumption review' },
      seojk: null,
      pbi: { id: 'Pasal 53', desc: 'Tingkat Ketersediaan (SLA)' },
      resilience: { id: 'BC-04', desc: 'High Availability System' },
      padg: { id: 'PADG-BC4', desc: 'Sistem High Availability' },
      owasp_top10: { id: 'A05:2021', desc: 'Security Misconfiguration (Availability)' },
      owasp_asvs: null,
      pdp: null
    },

    // --- AUDIT & ACCOUNTABILITY (Topic 6) ---
    {
      topic: 'audit',
      iso27001: { id: '8.15', desc: 'Logging' },
      nist: { id: 'PR.PT-01', desc: 'Audit logs generated' },
      cobit: { id: 'MEA02.01', desc: 'Monitor internal controls' },
      seojk: { id: 'Bab 7.1', desc: 'Penyimpanan log sistem' },
      pbi: { id: 'Pasal 60', desc: 'Audit trail' },
      resilience: { id: 'AA-01', desc: 'Sistem monitoring log' },
      padg: { id: 'PADG-AA1', desc: 'Jejak Audit (Audit Trail)' },
      owasp_top10: { id: 'A09:2021', desc: 'Security Logging' },
      owasp_asvs: { id: 'V7.1', desc: 'Log Content Requirements' },
      pdp: null
    },
    {
      topic: 'audit',
      iso27001: { id: '8.16', desc: 'Monitoring activities' },
      nist: { id: 'DE.CM-01', desc: 'Networks monitored' },
      cobit: { id: 'MEA02.02', desc: 'Review business process controls' },
      seojk: { id: 'Bab 7.2', desc: 'Pemantauan anomali jaringan' },
      pbi: { id: 'Pasal 61', desc: 'Security Operations Center (SOC)' },
      resilience: { id: 'AA-02', desc: 'Continuous Monitoring 24/7' },
      padg: { id: 'PADG-AA2', desc: 'SOC & Pemantauan' },
      owasp_top10: null,
      owasp_asvs: { id: 'V7.2', desc: 'Log Processing' },
      pdp: null
    },
    {
      topic: 'audit',
      iso27001: { id: '8.17', desc: 'Clock synchronization' },
      nist: { id: 'PR.PT-02', desc: 'Log synchronization' },
      cobit: { id: 'BAI09.01', desc: 'Manage assets' },
      seojk: { id: 'Bab 7.3', desc: 'Sinkronisasi waktu server NTP' },
      pbi: { id: 'Pasal 62', desc: 'Standardisasi infrastruktur' },
      resilience: { id: 'AA-03', desc: 'Network Time Protocol' },
      padg: { id: 'PADG-AA3', desc: 'Sinkronisasi Waktu' },
      owasp_top10: null,
      owasp_asvs: { id: 'V7.1.3', desc: 'Time Synchronization' },
      pdp: null
    },
    {
      topic: 'audit',
      iso27001: { id: '5.36', desc: 'Compliance with regulations' },
      nist: { id: 'GV.OC-03', desc: 'Legal/regulatory requirements' },
      cobit: { id: 'MEA03.02', desc: 'Monitor compliance' },
      seojk: { id: 'Bab 7.4', desc: 'Pelaporan kepatuhan regulasi' },
      pbi: { id: 'Pasal 63', desc: 'Kepatuhan Hukum' },
      resilience: null,
      padg: { id: 'PADG-AA4', desc: 'Pelaporan Kepatuhan' },
      owasp_top10: null,
      owasp_asvs: null,
      pdp: { id: 'Pasal 42', desc: 'Kepatuhan Pelindungan Data' }
    }
  ]
};
