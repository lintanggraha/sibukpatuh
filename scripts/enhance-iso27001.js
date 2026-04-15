import fs from 'fs';

// Read current data
const data = JSON.parse(fs.readFileSync('./public/data/iso27001.json', 'utf8'));

// Unique implementation tips and focus areas for each control
const enhancements = {
  // Theme 5: Organizational
  "5.1": {
    focusArea: "Tata Kelola & Kebijakan",
    implementationTips: "Mulai dengan membuat draft kebijakan yang sederhana dan relevan dengan bisnis. Libatkan C-level untuk approval, lalu sosialisasi ke seluruh karyawan melalui email blast dan briefing. Review kebijakan minimal setahun sekali atau saat ada perubahan regulasi signifikan."
  },
  "5.2": {
    focusArea: "Struktur Organisasi",
    implementationTips: "Buat RACI matrix yang jelas untuk setiap aspek keamanan informasi. Tetapkan CISO atau security champion. Dokumentasikan job description setiap role dan komunikasikan melalui onboarding session."
  },
  "5.3": {
    focusArea: "Pengendalian Internal",
    implementationTips: "Identifikasi fungsi-fungsi yang berpotensi konflik (misal: developer vs deployer, buyer vs payer). Implementasi segregation of duties matrix di sistem. Lakukan review akses berkala setiap 6 bulan."
  },
  "5.4": {
    focusArea: "Kepemimpinan",
    implementationTips: "Manajemen harus memberikan contoh dengan mengikuti training keamanan terlebih dahulu. Sertakan KPI keamanan dalam performance review. Adakan town hall meeting quarterly untuk update progress keamanan."
  },
  "5.5": {
    focusArea: "Hubungan Eksternal",
    implementationTips: "Buat daftar kontak BSSAN, POLRI (unit cybercrime), dan Kominfo. Simpan dalam kontak darurat yang mudah diakses. Lakukan silaturahmi rutin minimal setahun sekali untuk membangun relasi."
  },
  "5.6": {
    focusArea: "Networking & Komunitas",
    implementationTips: "Gabung dengan ID-SIRTII, MALSPINDO, atau komunitas CISO Indonesia. Aktif di forum sharing ancaman siber. Hadiri minimal 2 event keamanan informasi per tahun untuk update best practices."
  },
  "5.7": {
    focusArea: "Threat Intelligence",
    implementationTips: "Subscribe ke feed threat intelligence gratis seperti MISP atau AlienVault OTB. Tetapkan tim kecil yang bertugas menganalisis threat feed mingguan. Buat briefing bulanan tentang ancaman terbaru yang relevan dengan industri."
  },
  "5.8": {
    focusArea: "Integrasi Proyek",
    implementationTips: "Tambahkan checklist keamanan di project charter setiap proyek. Libatkan tim security di kick-off meeting. Sertakan security review sebagai gate di stage-gate process proyek."
  },
  "5.9": {
    focusArea: "Manajemen Aset",
    implementationTips: "Mulai dengan spreadsheet sederhana: nama aset, owner, lokasi, klasifikasi, criticality. Lakukan stock opname aset IT quarterly. Gunakan tools seperti Snipe-IT jika aset sudah ratusan."
  },
  "5.10": {
    focusArea: "Acceptable Use Policy",
    implementationTips: "Buat AUP yang jelas menyebutkan apa yang boleh dan tidak boleh dilakukan dengan aset IT. Minta karyawan tanda tangan AUP saat onboarding. Sosialisasikan dengan contoh kasus pelanggaran yang sering terjadi."
  },
  "5.11": {
    focusArea: "Offboarding",
    implementationTips: "Buat checklist exit clearance yang mencakup pengembalian laptop, ID card, token, dan akses sistem. Integrasikan dengan proses HR saat resign. Tetapkan timeline 1-3 hari kerja untuk pengembalian semua aset."
  },
  "5.12": {
    focusArea: "Data Classification",
    implementationTips: "Definisikan 3-4 level klasifikasi: Public, Internal, Confidential, Restricted. Buat kriteria yang jelas untuk setiap level. Mulai klasifikasi dari data paling kritis dulu, lalu ekspansi bertahap."
  },
  "5.13": {
    focusArea: "Labeling",
    implementationTips: "Implementasikan label digital (header/footer dokumen, email subject tag) dan fisik (stiker pada dokumen kertas). Gunakan watermark untuk dokumen confidential. Otomatisasi labeling dengan DLP jika memungkinkan."
  },
  "5.14": {
    focusArea: "Data Transfer",
    implementationTips: "Tetapkan metode transfer aman: SFTP untuk file besar, encrypted email untuk data sensitif, secure portal untuk sharing eksternal. Larang penggunaan personal email atau USB untuk transfer data perusahaan."
  },
  "5.15": {
    focusArea: "Access Control",
    implementationTips: "Terapkan prinsip least privilege dari awal. Buat workflow approval untuk request akses baru. Review akses user setiap 3-6 bulan, terutama untuk sistem kritis."
  },
  "5.16": {
    focusArea: "Identity Lifecycle",
    implementationTips: "Integrasikan sistem HR dengan Active Directory untuk automate provisioning/deprovisioning. Pastikan proses join-mover-leaver berjalan lancar. Audit identitas user yang tidak aktif setiap bulan."
  },
  "5.17": {
    focusArea: "Authentication Management",
    implementationTips: "Wajibkan password minimal 12 karakter dengan kompleksitas. Implementasi MFA untuk semua sistem critical. Gunakan password manager enterprise. Rotasi password setiap 90 hari untuk akun privileged."
  },
  "5.18": {
    focusArea: "Access Rights",
    implementationTips: "Buat prosedur formal untuk grant, modify, dan revoke access. Implementasi role-based access control (RBAC). Lakukan recertification akses quarterly untuk sistem yang mengandung data sensitif."
  },
  "5.19": {
    focusArea: "Supplier Risk",
    implementationTips: "Buat questionnaire security assessment untuk vendor baru. Sertakan klausul keamanan di kontrak. Lakukan audit atau request bukti compliance vendor sebelum onboard."
  },
  "5.20": {
    focusArea: "Cloud Security",
    implementationTips: "Pahami shared responsibility model untuk setiap cloud provider. Konfigurasi security group dan IAM dengan benar dari awal. Enable logging dan monitoring untuk semua layanan cloud."
  },
  "5.21": {
    focusArea: "Supply Chain Security",
    implementationTips: "Map seluruh supply chain TI dan identifikasi single point of failure. Request business continuity plan dari vendor kritis. Diversifikasi vendor untuk mengurangi risiko ketergantungan."
  },
  "5.22": {
    focusArea: "Compliance Monitoring",
    implementationTips: "Buat compliance checklist berdasarkan kebijakan internal. Lakukan self-assessment berkala setiap quarter. Track remediation plan untuk temuan yang belum ditutup."
  },
  "5.23": {
    focusArea: "Information Sharing",
    implementationTips: "Aktif berpartisipasi di ISAC (Information Sharing and Analysis Center) sektor industri Anda. Share anonymized threat data untuk membantu komunitas. Manfaatkan intelligence yang didapat untuk improve defense."
  },
  "5.24": {
    focusArea: "Business Continuity",
    implementationTips: "Identifikasi business process kritis danMaximum Tolerable Downtime. Buat BCP yang mencakup skenario worst-case. Lakukan tabletop exercise minimal setahun sekali untuk uji kesiapan."
  },
  "5.25": {
    focusArea: "Legal Compliance",
    implementationTips: "Inventory semua kewajiban hukum yang berlaku (UU PDP, PP 71/2019, dll). Buat compliance matrix dan assign PIC untuk setiap requirement. Review legal compliance saat ada regulasi baru."
  },
  "5.26": {
    focusArea: "Regulatory Requirements",
    implementationTips: "Subscribe ke update regulasi dari OJK, Kominfo, atau BSSN. Buat legal register yang diupdate quarterly. Konsultasi dengan legal counsel untuk interpretasi requirement yang ambigu."
  },
  "5.27": {
    focusArea: "Record Retention",
    implementationTips: "Definisikan retention period untuk setiap jenis dokumen berdasarkan hukum dan bisnis. Implementasi automated retention di DMS. Pastikan proses disposal dilakukan dengan secure destruction."
  },
  "5.28": {
    focusArea: "Privacy & PII Protection",
    implementationTips: "Lakukan data mapping untuk tahu di mana PII disimpan. Implementasi privacy by design di setiap sistem baru. Tunjuk DPO jika volume PII yang diproses besar."
  },
  "5.29": {
    focusArea: "Independent Review",
    implementationTips: "Jadwalkan audit internal minimal setahun sekali oleh tim independen. Gunakan framework audit yang recognized (ISO 27001, NIST). Tindak lanjuti temuan dengan remediation plan yang terukur."
  },
  "5.30": {
    focusArea: "ICT Development Security",
    implementationTips: "Integrasikan security checkpoint di SDLC. Wajibkan threat modeling untuk setiap fitur baru. Lakukan code review dan security testing sebelum release."
  },
  "5.31": {
    focusArea: "Legal Controls",
    implementationTips: "Review semua kontrak dan perjanjian dari aspek keamanan informasi. Pastikan ada klausul right-to-audit untuk vendor. Konsultasi legal sebelum implementasi kontrol yang berdampak ke karyawan."
  },
  "5.32": {
    focusArea: "Intellectual Property",
    implementationTips: "Inventory semua software yang digunakan dan cek lisensinya. Gunakan software asset management tool untuk track license compliance. Lakukan audit software internal setiap 6 bulan."
  },
  "5.33": {
    focusArea: "Records Protection",
    implementationTips: "Identifikasi records yang wajib dilindungi berdasarkan hukum. Implementasi access control dan encryption untuk records sensitif. Buat backup terpisah untuk records penting."
  },
  "5.34": {
    focusArea: "Privacy Compliance",
    implementationTips: "Buat privacy notice yang jelas untuk data subject. Implementasi consent management system. Pastikan ada prosedur untuk handle request hak data subject (akses, hapus, rectifikasi)."
  },
  "5.35": {
    focusArea: "Security Assessment",
    implementationTips: "Lakukan gap analysis terhadap ISO 27001 secara berkala. Gunakan assessor bersertifikasi untuk audit eksternal. Benchmark dengan organisasi sejenis untuk improve maturity."
  },
  "5.36": {
    focusArea: "Policy Compliance",
    implementationTips: "Buat metrics untuk track compliance (misal: % user yang sudah training). Implementasi automated compliance checking di mana memungkinkan. Report compliance status ke management secara berkala."
  },
  "5.37": {
    focusArea: "Documentation Management",
    implementationTips: "Gunakan Document Management System dengan version control. Tetapkan document owner untuk setiap prosedur. Review dan update dokumen saat ada perubahan proses atau insiden."
  },

  // Theme 6: People
  "6.1": {
    focusArea: "Background Verification",
    implementationTips: "Lakukan background check sesuai hukum ketenagakerjaan: cek identitas, pendidikan, dan riwayat kerja. Untuk posisi sensitif, tambah cek kriminal dan kredit. Dokumentasikan hasil screening dan simpan secara confidential."
  },
  "6.2": {
    focusArea: "Employment Terms",
    implementationTips: "Sertakan klausul keamanan informasi di employment contract: kewajiban menjaga kerahasiaan, larangan penggunaan aset untuk pribadi, dan konsekuensi pelanggaran. Review kontrak saat ada perubahan regulasi."
  },
  "6.3": {
    focusArea: "Security Awareness",
    implementationTips: "Buat program awareness berlapis: onboarding training untuk karyawan baru, monthly newsletter, annual refresher, dan targeted training untuk role spesifik. Ukur efektivitas dengan phishing simulation."
  },
  "6.4": {
    focusArea: "Disciplinary Process",
    implementationTips: "Definisikan gradasi sanksi sesuai severity pelanggaran: warning pertama, kedua, hingga PHD. Sosialisasikan konsekuensi di employee handbook. Pastikan proses disipliner sesuai hukum ketenagakerjaan."
  },
  "6.5": {
    focusArea: "Post-Employment Obligations",
    implementationTips: "Sertakan klausa non-disclosure yang tetap berlaku setelah resign. Lakukan exit interview yang mengingatkan kewajiban kerahasiaan. Untuk posisi kritis, pertimbangkan garden leave."
  },
  "6.6": {
    focusArea: "Confidentiality Agreements",
    implementationTips: "Buat NDA yang spesifik menyebutkan scope informasi yang dilindungi, durasi, dan sanksi pelanggaran. Minta tanda tangan NDA untuk karyawan, kontraktor, dan visitor yang akses informasi sensitif."
  },
  "6.7": {
    focusArea: "Remote Work Security",
    implementationTips: "Buat WFH policy yang mencakup: wajib VPN, larangan pakai public WiFi untuk kerja, secure home network setup, dan clear desk policy di rumah. Provide security guidelines untuk setup home office."
  },
  "6.8": {
    focusArea: "Incident Reporting",
    implementationTips: "Sediakan multiple channel pelaporan: email khusus, hotline, dan ticketing system. Pastikan proses pelaporan mudah dan tidak menghakimi. Reward karyawan yang report insiden untuk encourage culture."
  },

  // Theme 7: Physical
  "7.1": {
    focusArea: "Physical Perimeter",
    implementationTips: "Identifikasi dan map physical boundary: pagar, dinding, atau barrier lainnya. Install fencing untuk area kritis. Pastikan tidak ada blind spot yang bisa dilewati tanpa terdeteksi."
  },
  "7.2": {
    focusArea: "Physical Access Control",
    implementationTips: "Implementasi access card atau biometric di semua entry point. Buat visitor management system dengan log buku tamu dan escort policy. Review access log secara berkala."
  },
  "7.3": {
    focusArea: "Facility Security",
    implementationTips: "Lakukan risk assessment untuk identifikasi vulnerability fisik. Reinforce door, window, dan wall untuk ruang server. Install secure lock dan alarm untuk area sensitif."
  },
  "7.4": {
    focusArea: "Physical Monitoring",
    implementationTips: "Install CCTV di strategic points: entry, exit, corridor, dan area kritis. Pastikan coverage 24/7 dengan retention minimal 30 hari. Monitor CCTV oleh security team secara real-time."
  },
  "7.5": {
    focusArea: "Environmental Protection",
    implementationTips: "Identifikasi risiko lingkungan: banjir, gempa, kebakaran. Install fire suppression system, water detection, dan lightning arrester. Buat mitigation plan untuk setiap risiko yang teridentifikasi."
  },
  "7.6": {
    focusArea: "Secure Area Working",
    implementationTips: "Tetapkan aturan untuk kerja di secure area: wajib badge, tidak boleh bawa device pribadi, tidak boleh foto. Implementasi clean desk policy. Audit kepatuhan secara berkala."
  },
  "7.7": {
    focusArea: "Utility Support",
    implementationTips: "Identifikasi semua utility yang critical: listrik, air, internet, AC. Setup redundancy untuk critical utility: UPS, generator, dual ISP. Buat maintenance schedule untuk semua utility."
  },
  "7.8": {
    focusArea: "Equipment Maintenance",
    implementationTips: "Buat maintenance schedule untuk semua equipment keamanan: CCTV, access control, fire suppression. Track maintenance log dan set reminder untuk preventive maintenance. Gunakan vendor terpercaya untuk service."
  },
  "7.9": {
    focusArea: "Off-site Asset Security",
    implementationTips: "Buat policy untuk kerja di luar kantor: wajib encrypt laptop, tidak boleh akses dari public computer, wajib lock screen saat meninggalkan device. Track aset mobile dengan GPS jika memungkinkan."
  },
  "7.10": {
    focusArea: "Removable Media Security",
    implementationTips: "Batasi penggunaan USB drive dengan policy GPO. Untuk yang necessary, wajib encrypt. Buat prosedur disposal media yang aman: physical destruction atau degaussing untuk media yang berisi data sensitif."
  },
  "7.11": {
    focusArea: "Emergency Planning",
    implementationTips: "Buat emergency response plan yang mencakup: evakuasi, assembly point, emergency contact. Install emergency lighting dan exit sign. Lakukan drill minimal 2 kali setahun."
  },
  "7.12": {
    focusArea: "Cable & Power Security",
    implementationTips: "Route kabel power dan data melalui conduit atau raised floor. Pisahkan kabel power dan data untuk hindari interference. Install surge protector dan lightning protection."
  },
  "7.13": {
    focusArea: "Facility Inspection",
    implementationTips: "Buat checklist inspeksi facility: structural integrity, fire safety, access control functionality. Lakukan inspeksi berkala: monthly untuk area kritis, quarterly untuk area lain. Track temuan dan remediation."
  },
  "7.14": {
    focusArea: "Physical Security During Relocation",
    implementationTips: "Buat relocation plan yang mencakup: packing aman, transport dengan kendaraan secure, setup security di lokasi baru. Pastikan tidak ada downtime untuk security monitoring selama transisi."
  },

  // Theme 8: Technological
  "8.1": {
    focusArea: "Endpoint Security",
    implementationTips: "Install EDR (Endpoint Detection & Response) di semua device. Wajibkan full disk encryption. Enable remote wipe capability untuk mobile device. Patch OS dan aplikasi secara berkala."
  },
  "8.2": {
    focusArea: "Privileged Access Management",
    implementationTips: "Implementasi PAM solution untuk manage privileged account. Wajibkan approval untuk setiap penggunaan privileged access. Record session privileged access untuk audit trail."
  },
  "8.3": {
    focusArea: "Information Access Restriction",
    implementationTips: "Implementasi access control list (ACL) berdasarkan need-to-know. Review permission secara berkala. Remove default account atau guest access yang tidak diperlukan."
  },
  "8.4": {
    focusArea: "Source Code Access",
    implementationTips: "Gunakan version control system (Git) dengan branch protection. Batasi access ke production code. Require code review dan approval sebelum merge ke main branch."
  },
  "8.5": {
    focusArea: "Secure Authentication",
    implementationTips: "Implementasi MFA untuk semua sistem. Gunakan passwordless authentication jika memungkinkan. Monitor failed login attempt untuk deteksi brute force attack."
  },
  "8.6": {
    focusArea: "Capacity Management",
    implementationTips: "Monitor resource utilization: CPU, memory, disk, network. Setup threshold alerting (80% usage). Buat capacity plan untuk 6-12 bulan ke depan berdasarkan growth trend."
  },
  "8.7": {
    focusArea: "Malware Protection",
    implementationTips: "Install antivirus/anti-malware di semua endpoint dan server. Update signature daily. Enable real-time scanning. Lakukan scan full system weekly. Educate user untuk tidak click suspicious link."
  },
  "8.8": {
    focusArea: "Vulnerability Management",
    implementationTips: "Run vulnerability scan monthly untuk semua sistem. Prioritize remediation berdasarkan risk score. Patch critical vulnerability dalam 7 hari. Retest setelah patch untuk verify fix."
  },
  "8.9": {
    focusArea: "Hardware Configuration",
    implementationTips: "Buat baseline configuration untuk semua hardware. Disable unnecessary service dan port. Document semua konfigurasi dan track perubahan. Audit konfigurasi secara berkala."
  },
  "8.10": {
    focusArea: "Information Deletion",
    implementationTips: "Buat prosedur secure deletion: overwrite untuk HDD, crypto-shred untuk SSD. Document proses deletion dan buat destruction certificate. Gunakan third-party certified disposal vendor untuk media besar."
  },
  "8.11": {
    focusArea: "Data Masking",
    implementationTips: "Implementasi data masking untuk testing environment: scramble atau substitute sensitive data. Gunakan dynamic data masking untuk production query. Mask PII, financial data, dan confidential information."
  },
  "8.12": {
    focusArea: "Data Leak Prevention",
    implementationTips: "Deploy DLP solution untuk monitor dan block unauthorized data transfer. Define policy untuk classified data. Monitor email, web upload, dan USB transfer. Alert dan block jika ada violation."
  },
  "8.13": {
    focusArea: "Information Backup",
    implementationTips: "Implementasi 3-2-1 backup rule: 3 copies, 2 media types, 1 offsite. Test restore quarterly untuk verify backup integrity. Encrypt backup data. Monitor backup job daily."
  },
  "8.14": {
    focusArea: "Processing Facility Redundancy",
    implementationTips: "Setup redundant server di lokasi berbeda. Implementasi load balancing untuk distribute traffic. Test failover secara berkala. Pastikan RPO dan RTO sesuai business requirement."
  },
  "8.15": {
    focusArea: "Logging",
    implementationTips: "Enable logging untuk semua sistem critical: OS, aplikasi, network device. Centralize log ke SIEM. Retain log minimal 1 tahun. Monitor log untuk anomali daily."
  },
  "8.16": {
    focusArea: "Activity Monitoring",
    implementationTips: "Implementasi monitoring untuk deteksi anomali: unusual login time, volume data access tinggi, privilege escalation. Setup alert untuk suspicious activity. Review alert daily oleh SOC team."
  },
  "8.17": {
    focusArea: "Clock Synchronization",
    implementationTips: "Setup NTP server internal yang sync ke sumber waktu terpercaya. Pastikan semua sistem sync ke NTP server yang sama. Monitor clock drift dan alert jika ada deviasi signifikan."
  },
  "8.18": {
    focusArea: "Utility Program Control",
    implementationTips: "Inventory semua utility program yang bisa bypass control. Batasi akses utility ke admin saja. Log penggunaan utility. Review necessity utility secara berkala."
  },
  "8.19": {
    focusArea: "Software Installation Control",
    implementationTips: "Implementasi whitelisting untuk software yang boleh diinstall. Require approval untuk software baru. Test software di staging sebelum production install. Block unauthorized software installation."
  },
  "8.20": {
    focusArea: "Network Security",
    implementationTips: "Segmentasi network berdasarkan function dan sensitivity. Deploy firewall di perimeter dan internal. Monitor network traffic untuk anomaly. Update firewall rule secara berkala."
  },
  "8.21": {
    focusArea: "Network Service Security",
    implementationTips: "Define SLA untuk setiap network service: availability, latency, security. Encrypt network traffic dengan TLS. Monitor network performance. Review security control network service annually."
  },
  "8.22": {
    focusArea: "Network Segregation",
    implementationTips: "Segregasi network: production, staging, development, guest. Implementasi VLAN dan firewall rule antar segment. Batasi cross-segment communication ke yang necessary saja."
  },
  "8.23": {
    focusArea: "Web Filtering",
    implementationTips: "Deploy web proxy dengan filtering capability. Block kategori situs berbahaya: malware, phishing, gambling. Log web traffic untuk monitoring. Update web filter policy monthly."
  },
  "8.24": {
    focusArea: "Application Security",
    implementationTips: "Integrasikan security di SDLC: threat modeling, secure coding guideline, code review, penetration testing. Gunakan SAST dan DAST tool. Fix critical vulnerability sebelum release."
  },
  "8.25": {
    focusArea: "Secure Engineering",
    implementationTips: "Apply secure design principle: defense in depth, least privilege, fail safe. Document security architecture. Review design sebelum implementasi. Use security pattern dan framework."
  },
  "8.26": {
    focusArea: "Application Security Requirements",
    implementationTips: "Define security requirement untuk setiap aplikasi berdasarkan data yang diproses. Include requirement: authentication, authorization, encryption, logging. Review requirement sebelum development mulai."
  },
  "8.27": {
    focusArea: "Secure Coding",
    implementationTips: "Training developer secure coding: OWASP Top 10, input validation, output encoding. Gunakan secure coding guideline. Implementasi code review dengan security checklist."
  },
  "8.28": {
    focusArea: "Security Testing in Development",
    implementationTips: "Integrasikan automated security testing di CI/CD pipeline: SAST, SCA, secret scanning. Require security gate sebelum deploy. Track vulnerability metrics."
  },
  "8.29": {
    focusArea: "System Security Testing",
    implementationTips: "Lakukan penetration testing annually atau setelah major change. Test semua aplikasi critical. Retest setelah remediation. Document finding dan track remediation."
  },
  "8.30": {
    focusArea: "Outsourced Development",
    implementationTips: "Sertakan security requirement di kontrak outsourcing. Require secure development process dari vendor. Request evidence security testing. Audit vendor development process secara berkala."
  },
  "8.31": {
    focusArea: "Environment Separation",
    implementationTips: "Separate environment: development, testing, UAT, production. Batasi akses antar environment. Gunakan different credential untuk setiap environment. Promote code melalui pipeline, tidak langsung ke production."
  },
  "8.32": {
    focusArea: "Change Management",
    implementationTips: "Implementasi change management process: request, assess, approve, implement, review. Document semua perubahan. Test change di staging sebelum production. Schedule change di maintenance window."
  },
  "8.33": {
    focusArea: "Project Information Management",
    implementationTips: "Track project artifact dengan version control. Protect project document dengan access control. Share project information berdasarkan need-to-know. Backup project data secara berkala."
  },
  "8.34": {
    focusArea: "Audit Testing Protection",
    implementationTips: "Gunakan test data atau anonymized data untuk audit. Protect production data saat audit. Monitor aktivitas auditor. Batasi akses auditor ke yang necessary saja."
  },
  "8.35": {
    focusArea: "Data Masking in Testing",
    implementationTips: "Implementasi data masking untuk testing: scramble, substitute, atau generate dummy data. Pastikan tidak ada production data sensitif di testing environment. Test efektivitas masking."
  },
  "8.36": {
    focusArea: "Test Data Confidentiality",
    implementationTips: "Treat test data sesuai classification level. Encrypt test data yang sensitif. Batasi akses test data. Dispose test data secara aman setelah project selesai."
  },
  "8.37": {
    focusArea: "System Integration Security",
    implementationTips: "Define security requirement untuk integrasi: authentication, authorization, encryption. Test security integrasi sebelum go-live. Monitor integrasi untuk anomaly. Document integration architecture."
  },
  "8.38": {
    focusArea: "Post-Change Security Testing",
    implementationTips: "Test security setelah change: verify konfigurasi, test access control, check logging. Retest vulnerability yang previously fixed. Update security document setelah change."
  },
  "8.39": {
    focusArea: "Virtual Environment Security",
    implementationTips: "Secure hypervisor dan management console. Isolasi VM network. Monitor VM activity. Patch virtualization platform. Backup VM configuration."
  },
  "8.40": {
    focusArea: "Automation Security",
    implementationTips: "Secure automation script: credential management, input validation, error handling. Test automation di staging. Monitor automation execution. Review permission automation script secara berkala."
  },
  "8.41": {
    focusArea: "Cloud Environment Security",
    implementationTips: "Implementasi cloud security posture management (CSPM). Monitor cloud configuration untuk misconfiguration. Enable cloud logging. Review cloud access permission secara berkala."
  },
  "8.42": {
    focusArea: "Configuration Management",
    implementationTips: "Buat baseline configuration untuk semua aset. Document konfigurasi dan track perubahan. Monitor configuration drift. Review dan update baseline secara berkala. Automate configuration dengan IaC."
  }
};

// Apply enhancements
data.forEach(control => {
  const id = control.id;
  if (enhancements[id]) {
    control.implementationTips = enhancements[id].implementationTips;
    control.focusArea = enhancements[id].focusArea;
  }
});

// Write back
fs.writeFileSync('./public/data/iso27001.json', JSON.stringify(data, null, 2), 'utf8');
console.log('✓ Enhanced all controls with unique implementationTips and focusArea');

// Verify
const sample = data.find(c => c.id === '8.7');
console.log('\nSample - 8.7 Proteksi terhadap malware:');
console.log('Focus:', sample.focusArea);
console.log('Tips:', sample.implementationTips.substring(0, 100) + '...');
