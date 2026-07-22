<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1"><i class="fa-solid fa-network-wired text-primary me-2"></i> {{ $t('tools.crossTitle') }}</h2>
        <p class="text-muted mb-0">{{ $t('tools.crossDesc') }}</p>
      </div>
      <div>
        <button class="btn btn-outline-secondary" @click="resetView">
          <i class="fa-solid fa-rotate-right me-1"></i> {{ $t('tools.resetView') }}
        </button>
      </div>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h5 class="card-title mb-3">{{ $t('tools.filterFramework') }}</h5>
        <div class="d-flex flex-wrap gap-3">
          <div 
            v-for="fw in availableFrameworks" 
            :key="fw.id"
            class="form-check form-switch"
          >
            <input 
              class="form-check-input" 
              type="checkbox" 
              role="switch" 
              :id="'switch-' + fw.id"
              :value="fw.id"
              v-model="selectedFrameworks"
              :disabled="selectedFrameworks.length <= 2 && selectedFrameworks.includes(fw.id)"
              @change="updateGraph"
            >
            <label class="form-check-label" :for="'switch-' + fw.id">
              <span class="badge" :style="{ backgroundColor: fw.color }">{{ fw.name }}</span>
            </label>
          </div>
        </div>
        <small class="text-muted mt-3 d-block">
          <i class="fa-solid fa-circle-info me-1"></i> {{ $t('tools.crossHint') }}
        </small>
      </div>
    </div>

    <div class="card shadow-sm position-relative">
      <div class="card-body p-0 graph-container" ref="graphContainer">
        <!-- SVG container untuk D3.js -->
        <svg ref="svg" class="w-100" style="min-height: 700px; background-color: #fcfcfc;"></svg>
        
        <!-- Tooltip Custom mengikuti kursor -->
        <div 
          v-if="tooltip.show" 
          class="custom-tooltip shadow-lg"
          :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
        >
          <div class="tooltip-header" :style="{ backgroundColor: tooltip.data.color }">
            <strong>{{ tooltip.data.name }}</strong>
          </div>
          <div class="tooltip-body">
            <span class="badge bg-secondary mb-2">{{ getFrameworkName(tooltip.data.framework) }}</span>
            <p class="mb-2 small">{{ tooltip.data.desc }}</p>
            <div v-if="tooltip.related.length > 0">
              <hr class="my-2">
              <small class="text-muted fw-bold d-block mb-1">{{ $t('tools.equivalent') }}</small>
              <ul class="list-unstyled mb-0 small">
                <li v-for="(rel, idx) in tooltip.related" :key="idx" class="mb-1">
                  <i class="fa-solid fa-link me-1" :style="{ color: getFrameworkColor(rel.framework) }"></i>
                  <strong>{{ getFrameworkName(rel.framework) }}</strong>: {{ rel.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as d3 from 'd3';
import { crossMappingData } from '../data/crossMappingData';

const crossMappingEn = {
  'iso-5.1': { name: '5.1 Policies for information security', desc: 'Information security policies must be established, approved, and published.' },
  'iso-5.15': { name: '5.15 Access control', desc: 'Rules for controlling physical and logical access to information and assets.' },
  'iso-8.8': { name: '8.8 Management of vulnerabilities', desc: 'Technical vulnerabilities must be evaluated and treated with preventive action.' },
  'iso-8.11': { name: '8.11 Data masking', desc: 'Data masking must be used according to access policy to protect sensitive data.' },
  'iso-5.24': { name: '5.24 Incident management', desc: 'Procedures ensure fast, effective, and orderly responses to incidents.' },
  'nist-gv.oc-01': { name: 'GV.OC-01', desc: 'The organizational mission is understood and informs cybersecurity risk management.' },
  'nist-pr.aa-01': { name: 'PR.AA-01', desc: 'Identities and credentials for users and services are properly managed.' },
  'nist-id.ra-01': { name: 'ID.RA-01', desc: 'Asset vulnerabilities are identified, validated, and recorded routinely.' },
  'nist-pr.ds-01': { name: 'PR.DS-01', desc: 'Confidentiality, integrity, and availability of data at rest are protected.' },
  'nist-rs.ma-01': { name: 'RS.MA-01', desc: 'Incident response plans are executed in a coordinated way after declaration.' },
  'cobit-apo01.01': { name: 'APO01.01 Design management system', desc: 'Design an enterprise I&T management system that meets organizational requirements.' },
  'cobit-dss05.04': { name: 'DSS05.04 Manage user identity', desc: 'Ensure users have access rights aligned with business needs.' },
  'cobit-apo12.01': { name: 'APO12.01 Collect risk data', desc: 'Identify and collect IT risk data for analysis and reporting.' },
  'cobit-apo03.02': { name: 'APO03.02 Define baseline architecture', desc: 'Define baseline architecture for data and technology domains to support protection.' },
  'cobit-dss02.05': { name: 'DSS02.05 Resolve incidents', desc: 'Ensure IT incidents are resolved and business operations recover on time.' },
  'seojk-1.1': { name: 'Security Policy', desc: 'Electronic system providers must have an approved security policy.' },
  'seojk-2.1': { name: 'Access Management', desc: 'Access granting and revocation procedures must be closely monitored.' },
  'seojk-3.1': { name: 'Vulnerability Management', desc: 'Vulnerability scanning and penetration testing must be performed periodically.' },
  'seojk-4.1': { name: 'Cryptography', desc: 'Strong cryptographic algorithms should be implemented for sensitive data.' },
  'seojk-5.1': { name: 'Incident Management', desc: 'Cyber incident handling procedures and high-impact incident reporting.' },
  'pbi-bab2': { name: 'IT Governance', desc: 'Banks must implement IT governance with active oversight by the Board of Directors.' },
  'pbi-bab3': { name: 'Access Control', desc: 'Ensure segregation of duties and least privilege in access provisioning.' },
  'pbi-bab4': { name: 'IT Risk Management', desc: 'Identify, measure, monitor, and control IT risks.' },
  'pbi-bab5': { name: 'Customer Data Protection', desc: 'Maintain the confidentiality, integrity, and availability of customer data.' },
  'pbi-bab6': { name: 'Cyber Incident Handling', desc: 'Maintain cyber incident response and system recovery functions.' },
  'resilience-1': { name: 'Digital Governance', desc: 'Establish an integrated digital resilience governance framework.' },
  'resilience-2': { name: 'Identity & Access Management', desc: 'Apply strict access controls including multifactor authentication.' },
  'resilience-3': { name: 'Threat Intelligence', desc: 'Continuously analyze cyber threats and vulnerabilities.' },
  'resilience-4': { name: 'Infrastructure Protection', desc: 'Protect systems and infrastructure, including data, for critical services.' },
  'resilience-5': { name: 'Business Continuity', desc: 'Ensure business continuity during cyber incident disruptions.' },
  'padg-1': { name: 'Security Governance', desc: 'Policies and procedures for Bank Indonesia IT security governance.' },
  'padg-2': { name: 'Identity Access Control', desc: 'Management of access rights and authentication for banking systems.' },
  'padg-3': { name: 'Risk Monitoring', desc: 'Identification and assessment of payment system security risks.' },
  'padg-4': { name: 'Data Security & Cryptography', desc: 'Protection of data confidentiality and integrity.' },
  'padg-5': { name: 'Operational Incident Response', desc: 'Procedures for handling and reporting security incidents.' },
  'owasp-a01': { name: 'A01: Broken Access Control', desc: 'Policies to prevent access restriction failures.' },
  'owasp-a07': { name: 'A07: Identification Failures', desc: 'Prevention of authentication and identity failures.' },
  'owasp-a06': { name: 'A06: Vulnerable Components', desc: 'Management of vulnerable and outdated components.' },
  'owasp-a02': { name: 'A02: Cryptographic Failures', desc: 'Prevention of sensitive data and cryptographic protection failures.' },
  'owasp-a09': { name: 'A09: Security Logging Failures', desc: 'Logging and monitoring failures that obstruct incident response.' },
  'asvs-v1': { name: 'V1: Architecture', desc: 'Application security architecture and design requirements.' },
  'asvs-v2': { name: 'V2: Authentication', desc: 'Security requirements for user identity verification.' },
  'asvs-v14': { name: 'V14: Configuration', desc: 'Secure configuration and vulnerability management.' },
  'asvs-v6': { name: 'V6: Cryptography', desc: 'Requirements for cryptographic implementation.' },
  'asvs-v7': { name: 'V7: Error Handling', desc: 'Error handling and logging for security response.' },
  'pdp-pasal16': { name: 'Article 16: PDP Policy', desc: 'Obligation to maintain a personal data protection policy.' },
  'pdp-pasal35': { name: 'Article 35: Data Access', desc: 'Restriction of access rights to personal data.' },
  'pdp-pasal39': { name: 'Article 39: Impact Assessment', desc: 'Personal data protection impact assessment (DPIA).' },
  'pdp-pasal43': { name: 'Article 43: Data Security', desc: 'Obligation to protect personal data from unauthorized access.' },
  'pdp-pasal46': { name: 'Article 46: Incident Notification', desc: 'Obligation to report personal data protection failures.' },
  'padk-kebijakan': { name: 'Bank IT Governance', desc: 'Policies and operating procedures for commercial bank information technology.' },
  'padk-akses': { name: 'Access & Identity Management', desc: 'Management of logical access to commercial bank systems.' },
  'padk-risiko': { name: 'IT Risk Assessment', desc: 'Information technology risk management and mitigation.' },
  'padk-kripto': { name: 'Data Security & Encryption', desc: 'Confidentiality protection using cryptography.' },
  'padk-insiden': { name: 'Incident Response & BCP', desc: 'Incident handling, disaster recovery, and business continuity.' },
};

const isEnglish = () => localStorage.getItem('language') === 'en';
const localizeControl = (ctrl) => isEnglish() && crossMappingEn[ctrl.id] ? { ...ctrl, ...crossMappingEn[ctrl.id] } : ctrl;

const graphContainer = ref(null);
const svg = ref(null);

// Variabel D3 tidak di-wrap dalam ref() agar tidak terganggu proxy reactivity Vue
let simulation = null;
let svgSelection = null;
let linkSelection = null;
let nodeSelection = null;
let labelSelection = null;
let zoomInstance = null;
let activeNode = null;

const availableFrameworks = crossMappingData.frameworks;
const selectedFrameworks = ref(availableFrameworks.map(f => f.id));

const tooltip = ref({
  show: false,
  x: 0,
  y: 0,
  data: {},
  related: []
});

const getFrameworkColor = (fwId) => {
  const fw = availableFrameworks.find(f => f.id === fwId);
  return fw ? fw.color : '#999';
};

const getFrameworkName = (fwId) => {
  const fw = availableFrameworks.find(f => f.id === fwId);
  return fw ? fw.name : fwId;
};

// Mengambil data node dan link sesuai filter checkbox framework
const getFilteredData = () => {
  const activeFwSet = new Set(selectedFrameworks.value);
  
  // 1. Buat node utama (Framework)
  const fwNodes = availableFrameworks
    .filter(fw => activeFwSet.has(fw.id))
    .map(fw => ({
      id: fw.id,
      name: fw.name,
      isFramework: true,
      color: fw.color,
      radius: 35
    }));

  // 2. Buat node anak (Kontrol)
  const controlNodes = crossMappingData.controls
    .filter(ctrl => activeFwSet.has(ctrl.framework))
    .map(localizeControl)
    .map(ctrl => ({
      id: ctrl.id,
      framework: ctrl.framework,
      name: ctrl.name,
      desc: ctrl.desc,
      isFramework: false,
      color: getFrameworkColor(ctrl.framework),
      radius: 12
    }));

  const nodes = [...fwNodes, ...controlNodes];
  const nodeIds = new Set(nodes.map(n => n.id));

  const links = [];

  // 3. Hubungkan setiap kontrol ke node framework utamanya (garis solid)
  controlNodes.forEach(ctrl => {
    links.push({
      source: ctrl.framework,
      target: ctrl.id,
      type: 'hierarchy',
      value: 1
    });
  });

  // 4. Hubungkan kontrol yang ekuivalen antar framework (garis putus-putus)
  crossMappingData.links.forEach(link => {
    if (nodeIds.has(link.source) && nodeIds.has(link.target)) {
      links.push({
        source: link.source,
        target: link.target,
        type: 'equivalent',
        value: 2
      });
    }
  });

  return { nodes, links };
};

// Logika drag D3.js (kompatibel D3 v6+)
const drag = (simulation) => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
};

// Inisialisasi dan render graph D3
const initGraph = () => {
  if (!svg.value || !graphContainer.value) return;

  const width = graphContainer.value.clientWidth;
  const height = 700;

  svgSelection = d3.select(svg.value)
    .attr('viewBox', [0, 0, width, height]);

  // Hapus graph sebelumnya jika di-re-render
  svgSelection.selectAll('*').remove();

  const g = svgSelection.append('g');

  // Menambahkan fitur Zoom & Pan
  zoomInstance = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svgSelection.call(zoomInstance);

  const { nodes, links } = getFilteredData();

  // Konfigurasi physics/forces dari Graph
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.type === 'hierarchy' ? 100 : 250))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(d => d.radius + 15));

  // Render Garis (Links)
  linkSelection = g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', d => d.type === 'hierarchy' ? 1.5 : 2.5)
    .attr('stroke', d => d.type === 'hierarchy' ? '#ced4da' : '#adb5bd')
    .attr('stroke-dasharray', d => d.type === 'equivalent' ? '5,5' : 'none');

  // Render Node (Circles)
  nodeSelection = g.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', d => d.radius)
    .attr('fill', d => d.isFramework ? '#ffffff' : d.color)
    .attr('stroke', d => d.color)
    .attr('stroke-width', d => d.isFramework ? 4 : 2)
    .attr('cursor', 'pointer')
    .call(drag(simulation));

  // Render Label Node
  labelSelection = g.append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr('text-anchor', 'middle')
    .attr('dy', d => d.isFramework ? 5 : 25)
    .attr('font-size', d => d.isFramework ? '14px' : '11px')
    .attr('font-weight', d => d.isFramework ? 'bold' : 'normal')
    .attr('fill', '#212529')
    .attr('pointer-events', 'none') // Agar event klik tembus ke lingkaran node
    .text(d => d.isFramework ? d.name : (d.name.length > 20 ? d.name.substring(0, 20) + '...' : d.name));

  // Event Listeners Node
  nodeSelection
    .on('mouseover', (event, d) => {
      if (d.isFramework) return;
      
      // Cari node ekuivalen yang terhubung
      const relatedLinks = links.filter(l => l.type === 'equivalent' && (l.source.id === d.id || l.target.id === d.id));
      const relatedNodes = relatedLinks.map(l => l.source.id === d.id ? l.target : l.source);

      // Tampilkan Tooltip
      const rect = graphContainer.value.getBoundingClientRect();
      tooltip.value = {
        show: true,
        x: event.clientX - rect.left + 20,
        y: event.clientY - rect.top,
        data: d,
        related: relatedNodes.filter(n => !n.isFramework)
      };
    })
    .on('mouseout', () => {
      tooltip.value.show = false;
    })
    .on('click', (event, d) => {
      if (d.isFramework) return;
      
      // Jika klik node yang sama, matikan mode fokus (toggle off)
      if (activeNode === d.id) {
        activeNode = null;
        nodeSelection.attr('opacity', 1).attr('display', 'block');
        linkSelection.attr('opacity', 1).attr('display', 'block');
        labelSelection.attr('opacity', 1).attr('display', 'block');
      } else {
        // Toggle on: Fokus hanya ke node ini dan relasinya, sembunyikan sisanya
        activeNode = d.id;
        const relatedLinks = links.filter(l => l.type === 'equivalent' && (l.source.id === d.id || l.target.id === d.id));
        const relatedNodesIds = relatedLinks.map(l => l.source.id === d.id ? l.target.id : l.source.id);
        
        // Kumpulkan ID elemen yang perlu terlihat (node yang diklik, frameworknya, dan semua ekuivalennya)
        const visibleIds = new Set([d.id, d.framework, ...relatedNodesIds]);
        
        // Pastikan node framework dari node yang berelasi juga terlihat
        relatedLinks.forEach(l => {
          const targetNode = l.source.id === d.id ? l.target : l.source;
          if(targetNode.framework) visibleIds.add(targetNode.framework);
        });

        // Terapkan opacity dan display
        nodeSelection
          .attr('opacity', n => visibleIds.has(n.id) ? 1 : 0)
          .attr('display', n => visibleIds.has(n.id) ? 'block' : 'none');
          
        labelSelection
          .attr('opacity', n => visibleIds.has(n.id) ? 1 : 0)
          .attr('display', n => visibleIds.has(n.id) ? 'block' : 'none');

        linkSelection
          .attr('opacity', l => {
            if (l.type === 'hierarchy' && visibleIds.has(l.source.id) && visibleIds.has(l.target.id)) return 1;
            if (l.type === 'equivalent' && (l.source.id === d.id || l.target.id === d.id)) return 1;
            return 0;
          })
          .attr('display', l => {
            if (l.type === 'hierarchy' && visibleIds.has(l.source.id) && visibleIds.has(l.target.id)) return 'block';
            if (l.type === 'equivalent' && (l.source.id === d.id || l.target.id === d.id)) return 'block';
            return 'none';
          });
      }
    });

  // Animasi tick D3
  simulation.on('tick', () => {
    linkSelection
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodeSelection
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    labelSelection
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });
};

const updateGraph = () => {
  if (simulation) simulation.stop();
  activeNode = null;
  initGraph();
};

const resetView = () => {
  selectedFrameworks.value = availableFrameworks.map(f => f.id);
  activeNode = null;
  updateGraph();
  if (svgSelection && zoomInstance) {
    svgSelection.transition().duration(750).call(
      zoomInstance.transform, 
      d3.zoomIdentity
    );
  }
};

onMounted(() => {
  initGraph();
  window.addEventListener('resize', updateGraph);
});

onUnmounted(() => {
  if (simulation) simulation.stop();
  window.removeEventListener('resize', updateGraph);
});
</script>

<style scoped>
.graph-container {
  overflow: hidden;
  border-radius: 0.375rem;
  cursor: grab;
}
.graph-container:active {
  cursor: grabbing;
}
.custom-tooltip {
  position: absolute;
  background: white;
  border-radius: 0.375rem;
  width: 280px;
  z-index: 1000;
  pointer-events: none;
  border: 1px solid #dee2e6;
  transition: top 0.1s ease, left 0.1s ease;
}
.tooltip-header {
  padding: 0.6rem 1rem;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  color: white;
}
.tooltip-body {
  padding: 1rem;
}
</style>
