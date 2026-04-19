<template>
  <div class="cve-container">
    <div class="row g-4">
      <!-- Left Column: CVE List -->
      <div class="col-lg-7 col-xl-8">
        <div class="cve-list-header mb-4">
          <div class="d-flex align-items-center gap-3 mb-3">
            <h2 class="cve-section-title mb-0">CVE terbaru</h2>
            <span class="cve-badge-count">{{ filteredCves.length }} CVE</span>
          </div>
          
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div class="cve-filters d-flex flex-wrap gap-2">
              <button 
                v-for="filter in filters" 
                :key="filter"
                class="btn cve-filter-btn"
                :class="{ active: activeFilter === filter }"
                @click="activeFilter = filter"
              >
                {{ filter }}
              </button>
            </div>

            <div class="cve-limit-selector d-flex align-items-center gap-2">
              <small class="text-muted fw-bold">Tampilkan:</small>
              <select v-model="displayLimit" class="form-select form-select-sm limit-select">
                <option v-for="opt in limitOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="cve-scroll-area">
          <transition-group name="list" tag="div" class="cve-cards-grid">
            <div 
              v-for="cve in filteredCves" 
              :key="cve.id" 
              class="cve-card"
              :class="{ selected: selectedCve?.id === cve.id }"
              @click="selectCve(cve)"
            >
              <div class="cve-top-row">
                <span class="cve-id">{{ cve.id }}</span>
                <div class="cve-actions-group">
                  <span class="cve-score">{{ cve.score }}</span>
                  <span :class="['cve-severity-badge', cve.severity.toLowerCase()]">
                    {{ cve.severity }}
                  </span>
                  <button class="btn btn-ask-ai-sm" @click.stop="askAi(cve)" title="Tanya AI">
                    <i class="fas fa-robot"></i>
                  </button>
                </div>
              </div>
              
              <h3 class="cve-card-title">{{ cve.title }}</h3>
              
              <div class="cve-bottom-row">
                <span class="cve-meta-info">
                  <strong>{{ cve.vendor }}</strong> · {{ cve.product }} · <span class="text-muted">{{ cve.date }}</span>
                </span>
              </div>
            </div>
          </transition-group>
        </div>
      </div>

      <!-- Right Column: AI Assistant -->
      <div class="col-lg-5 col-xl-4">
        <div class="ai-assistant-sticky">
          <div class="ai-assistant-card shadow-lg">
            <div class="ai-header">
              <div class="d-flex align-items-center gap-2">
                <div class="ai-pulse"></div>
                <h4 class="mb-0">Asisten CVE</h4>
              </div>
              <span class="ai-powered">powered by Gemini</span>
            </div>


            <div class="ai-body">
              <div class="ai-context mb-4" v-if="selectedCve">
                <small class="text-muted d-block mb-1">Konteks:</small>
                <div class="cve-context-pill">
                  <strong>{{ selectedCve.id }}</strong> — {{ selectedCve.product }}
                </div>
              </div>

              <div class="ai-suggestions mb-4" v-if="selectedCve">
                <button 
                  v-for="(suggestion, index) in suggestions" 
                  :key="index"
                  class="btn btn-ai-suggestion"
                  @click="sendQuery(suggestion)"
                >
                  {{ suggestion }}
                </button>
              </div>

              <div class="ai-chat-area" ref="chatArea">
                <div v-if="!messages.length" class="ai-welcome text-center py-5">
                  <i class="fas fa-robot mb-3"></i>
                  <p>Halo! Pilih CVE di sebelah kiri, lalu tanya apa saja tentang vulnerability tersebut.</p>
                </div>
                
                <div 
                  v-for="(msg, index) in messages" 
                  :key="index" 
                  :class="['chat-bubble', msg.role]"
                >
                  {{ msg.text }}
                </div>
                
                <div v-if="isTyping" class="chat-bubble assistant typing">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            </div>

            <div class="ai-footer">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Ketik pertanyaan..." 
                  v-model="userInput"
                  @keyup.enter="sendQuery(userInput)"
                  :disabled="!selectedCve || isTyping"
                >
                <button 
                  class="btn btn-send" 
                  @click="sendQuery(userInput)"
                  :disabled="!selectedCve || isTyping || !userInput.trim()"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CveIntelligence",
  data() {
    return {
      activeFilter: "Semua",
      filters: ["Semua", "Critical", "High", "Medium", "Low"],
      selectedCve: null,
      userInput: "",
      isTyping: false,
      messages: [],
      apiKey: null, // Placeholder for Gemini API Key
      suggestions: [
        "Apa dampaknya untuk organisasi di Indonesia?",
        "Bagaimana cara mitigasinya?",
        "Apakah ada exploit yang sudah beredar?",
        "Regulasi mana yang terdampak?"
      ],
      displayLimit: 5,
      limitOptions: [5, 10, 15, 20],
      cves: [
        {
          id: "CVE-2025-21298",
          score: 9.8,
          severity: "CRITICAL",
          title: "Windows Object Linking and Embedding (OLE) Remote Code Execution Vulnerability. Attacker dapat mengeksploitasi kerentanan ini untuk menjalankan kode arbitrer.",
          vendor: "Microsoft",
          product: "Windows",
          date: "2025-01-14"
        },
        {
          id: "CVE-2025-0282",
          score: 9.0,
          severity: "CRITICAL",
          title: "Ivanti Connect Secure stack-based buffer overflow vulnerability yang memungkinkan remote code execution via malformed URI.",
          vendor: "Ivanti",
          product: "Connect Secure",
          date: "2025-01-08"
        },
        {
          id: "CVE-2024-51567",
          score: 8.8,
          severity: "HIGH",
          title: "CyberPanel vulnerability through command injection. Versi terdampak memungkinkan unauthenticated remote code execution.",
          vendor: "CyberPanel",
          product: "CyberPanel v2.3.6",
          date: "2024-10-28"
        },
        {
          id: "CVE-2024-44308",
          score: 7.5,
          severity: "HIGH",
          title: "WebKit vulnerability in Safari. Kerentanan ini telah dieksploitasi secara aktif terhadap sistem macOS lama.",
          vendor: "Apple",
          product: "Safari & WebKit",
          date: "2024-11-19"
        },
        {
          id: "CVE-2024-38063",
          score: 9.8,
          severity: "CRITICAL",
          title: "Windows TCP/IP Remote Code Execution Vulnerability via crafted IPv6 packets.",
          vendor: "Microsoft",
          product: "Windows Systems",
          date: "2024-08-13"
        },
        {
          id: "CVE-2024-21413",
          score: 9.8,
          severity: "CRITICAL",
          title: "Microsoft Outlook Remote Code Execution Vulnerability (Moniker Link).",
          vendor: "Microsoft",
          product: "Outlook",
          date: "2024-02-13"
        },
        {
          id: "CVE-2024-1086",
          score: 7.8,
          severity: "HIGH",
          title: "Linux Kernel netfilter: nf_tables use-after-free vulnerability leading to privilege escalation.",
          vendor: "Linux",
          product: "Kernel",
          date: "2024-03-27"
        },
        {
          id: "CVE-2023-4966",
          score: 9.4,
          severity: "CRITICAL",
          title: "Citrix Bleed: Information disclosure in Citrix NetScaler ADC and Gateway.",
          vendor: "Citrix",
          product: "NetScaler",
          date: "2023-10-10"
        }
      ]
    };
  },
  computed: {
    filteredCves() {
      let filtered = this.cves;
      if (this.activeFilter !== "Semua") {
        filtered = this.cves.filter(cve => cve.severity === this.activeFilter.toUpperCase());
      }
      return filtered.slice(0, this.displayLimit);
    }
  },
  methods: {
    selectCve(cve) {
      this.selectedCve = cve;
      this.messages = [];
    },
    askAi(cve) {
      this.selectCve(cve);
      this.sendQuery("Berikan ringkasan eksekutif untuk kerentanan ini.");
    },
    async sendQuery(text) {
      if (!text || !text.trim() || this.isTyping) return;
      
      const query = text.trim();
      this.userInput = "";
      this.messages.push({ role: "user", text: query });
      
      this.isTyping = true;
      this.scrollToBottom();

      // Simulated AI response
      setTimeout(() => {
        let response = "";
        if (query.includes("mitigasi")) {
          response = `Untuk mitigasi ${this.selectedCve.id}, segera lakukan update patch resmi dari ${this.selectedCve.vendor}. Jika patch belum tersedia, batasi akses network ke komponen terdampak dan aktifkan monitoring pada IDS/IPS untuk pola traffic yang mencurigakan terkait ${this.selectedCve.product}.`;
        } else if (query.includes("Indonesia")) {
          response = `Organisasi di Indonesia yang menggunakan ${this.selectedCve.product} berisiko tinggi terkena dampak ini, terutama bagi sektor infrastruktur kritis yang memiliki regulasi ketat seperti SEOJK 29 atau PBI 02/2024. Penyerang dapat menargetkan kelemahan ini untuk mengganggu operasional atau mencuri data sensitif nasabah.`;
        } else if (query.includes("exploit")) {
          response = `Berdasarkan intelijen terbaru, exploit PoC (Proof of Concept) untuk ${this.selectedCve.id} sudah mulai beredar di forum-forum diskusi keamanan. Belum ada laporan serangan massal di lapangan, namun tingkat urgensi tetap di level ${this.selectedCve.severity}.`;
        } else {
          response = `Kerentanan ${this.selectedCve.id} pada ${this.selectedCve.product} memiliki skor CVSS ${this.selectedCve.score}. Dampak utamanya adalah potensi eksploitasi jarak jauh yang memungkinkan penyerang mengambil alih kontrol sistem. Pastikan tim keamanan IT Anda telah melakukan scanning berkala untuk mendeteksi keberadaan library/produk terdampak.`;
        }
        
        this.messages.push({ role: "assistant", text: response });
        this.isTyping = false;
        this.scrollToBottom();
      }, 1500);
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatArea;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  },
  mounted() {
    // Select the first CVE by default
    if (this.cves.length > 0) {
      this.selectedCve = this.cves[0];
    }
  }
};
</script>

<style scoped>
.cve-container {
  padding: 1.5rem 0.5rem;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.cve-section-title {
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.cve-badge-count {
  background: #f1f5f9;
  color: #475569;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
}

.cve-filter-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s ease;
}

.cve-filter-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #334155;
}

.cve-filter-btn.active {
  background: #0f172a;
  border-color: #0f172a;
  color: white;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.cve-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.cve-card:hover {
  border-color: #3b82f6;
  background: #f8faff;
}

.cve-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 0 0 1px #3b82f6;
}

.cve-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.cve-id {
  font-weight: 800;
  color: #3b82f6;
  font-size: 0.85rem;
  letter-spacing: -0.2px;
}

.cve-actions-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cve-score {
  font-weight: 800;
  color: #0f172a;
  font-size: 0.9rem;
}

.cve-severity-badge {
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-size: 0.6rem;
  font-weight: 900;
  text-transform: uppercase;
}

.cve-severity-badge.critical { background: #fee2e2; color: #991b1b; }
.cve-severity-badge.high { background: #ffedd5; color: #9a3412; }
.cve-severity-badge.medium { background: #fef9c3; color: #854d0e; }
.cve-severity-badge.low { background: #f0fdf4; color: #166534; }

.btn-ask-ai-sm {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.btn-ask-ai-sm:hover {
  background: #0f172a;
  color: white;
  border-color: #0f172a;
}

.cve-card-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cve-bottom-row {
  display: flex;
  align-items: center;
}

.cve-meta-info {
  font-size: 0.72rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-ask-ai:hover {
  background: #0f172a;
  color: white;
  border-color: #0f172a;
}

/* AI Assistant Styles */
.ai-assistant-sticky {
  position: sticky;
  top: 1.5rem;
  z-index: 10;
}

.ai-assistant-card {
  background: #0f172a;
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
  min-height: 600px;
}

.ai-header {
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ai-header h4 {
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
}

.ai-pulse {
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

.ai-powered {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.ai-disclaimer {
  padding: 0.75rem 1.25rem;
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  font-size: 0.78rem;
  line-height: 1.4;
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
}

.ai-body {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.cve-context-pill {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
}

.btn-ai-suggestion {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 0.6rem;
  transition: all 0.2s ease;
}

.btn-ai-suggestion:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(4px);
}

.ai-chat-area {
  margin-top: auto;
}

.ai-welcome {
  color: rgba(255, 255, 255, 0.4);
}

.ai-welcome i {
  font-size: 2.5rem;
}

.chat-bubble {
  padding: 1rem 1.25rem;
  border-radius: 18px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 90%;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-bubble.user {
  background: #3b82f6;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.chat-bubble.assistant {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.typing span {
  animation: blink 1s infinite;
  margin: 0 1px;
}

.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.ai-footer {
  padding: 1.25rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.ai-footer .form-control {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 14px 0 0 14px;
}

.ai-footer .form-control:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #3b82f6;
  box-shadow: none;
}

.btn-send {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0 1.25rem;
  border-radius: 0 14px 14px 0;
}

.btn-send:hover:not(:disabled) {
  background: #2563eb;
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@media (max-width: 991.98px) {
  .ai-assistant-card {
    height: auto;
    min-height: 500px;
    margin-top: 2rem;
  }
}

.limit-select {
  width: 70px;
  border-radius: 10px;
  border-color: #e2e8f0;
  font-weight: 700;
  color: #0f172a;
}

.limit-select:focus {
  border-color: #3b82f6;
  box-shadow: none;
}
</style>
