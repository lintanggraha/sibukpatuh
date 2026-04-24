<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1"><i class="fa-solid fa-code-compare text-primary me-2"></i> Analisis Framework</h2>
        <p class="text-muted mb-0">Bandingkan framework secara side-by-side atau lakukan evaluasi Gap Analysis.</p>
      </div>
    </div>

    <!-- Master Controls: Framework Selection -->
    <div class="card shadow-sm mb-4 border-0 border-top border-primary border-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-bold">
              <i class="fa-solid fa-bullseye text-primary me-1"></i> Framework A (Baseline)
            </label>
            <select class="form-select border-primary" v-model="frameworkA">
              <option v-for="fw in availableFrameworks" :key="fw.id" :value="fw.id" :disabled="fw.id === frameworkB">
                {{ fw.name }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">
              <i class="fa-solid fa-magnifying-glass text-warning me-1"></i> Framework B (Target Evaluasi)
            </label>
            <select class="form-select border-warning" v-model="frameworkB">
              <option v-for="fw in availableFrameworks" :key="fw.id" :value="fw.id" :disabled="fw.id === frameworkA">
                {{ fw.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <ul class="nav nav-tabs mb-4" id="analysisTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button 
          class="nav-link fw-bold" 
          :class="{ active: activeTab === 'comparison' }" 
          @click="activeTab = 'comparison'"
          type="button" role="tab"
        >
          <i class="fa-solid fa-table-columns me-2"></i> Side-by-Side Comparison
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button 
          class="nav-link fw-bold" 
          :class="{ active: activeTab === 'gap' }" 
          @click="activeTab = 'gap'"
          type="button" role="tab"
        >
          <i class="fa-solid fa-scale-balanced me-2"></i> Gap Analysis
        </button>
      </li>
    </ul>

    <!-- Tab Contents -->
    <div class="tab-content">
      <div v-show="activeTab === 'comparison'" class="fade show" :class="{ active: activeTab === 'comparison' }">
        <FrameworkComparison 
          :framework-a="frameworkA" 
          :framework-b="frameworkB" 
        />
      </div>
      
      <div v-show="activeTab === 'gap'" class="fade show" :class="{ active: activeTab === 'gap' }">
        <GapAnalysis 
          :source-fw-id="frameworkA" 
          :target-fw-id="frameworkB" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { comparisonData } from '../data/comparisonData'; 
import FrameworkComparison from './FrameworkComparison.vue';
import GapAnalysis from './GapAnalysis.vue';

const availableFrameworks = comparisonData.frameworks;

const frameworkA = ref(availableFrameworks[0].id); // Default ISO 27001
const frameworkB = ref(availableFrameworks[1].id); // Default NIST

const activeTab = ref('comparison'); // 'comparison' or 'gap'
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #6c757d;
  padding: 1rem 1.5rem;
  border: none;
  border-bottom: 3px solid transparent;
  background: transparent;
}
.nav-tabs .nav-link:hover {
  border-color: transparent;
  color: #0d6efd;
}
.nav-tabs .nav-link.active {
  color: #0d6efd;
  background: transparent;
  border-bottom: 3px solid #0d6efd;
}
</style>
