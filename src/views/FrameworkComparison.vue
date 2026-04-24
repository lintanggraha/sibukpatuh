<template>
  <div>
    <!-- Controls Selection (Only Topic Filter) -->
    <div class="card shadow-sm mb-4 border-0">
      <div class="card-body bg-light rounded">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <label class="form-label fw-bold mb-2">Filter Topik:</label>
            <div class="d-flex flex-wrap gap-2">
              <button 
                class="btn btn-sm rounded-pill"
                :class="selectedTopic === 'all' ? 'btn-primary' : 'btn-outline-secondary'"
                @click="selectedTopic = 'all'"
              >
                Semua Topik
              </button>
              <button 
                v-for="topic in topics" 
                :key="topic.id"
                class="btn btn-sm rounded-pill"
                :class="selectedTopic === topic.id ? 'btn-primary' : 'btn-outline-secondary'"
                @click="selectedTopic = topic.id"
              >
                {{ topic.name }}
              </button>
            </div>
          </div>
          <div class="d-flex flex-wrap gap-3">
            <div class="d-flex align-items-center">
              <div class="legend-box bg-success bg-opacity-25 border-success me-2"></div>
              <small class="text-muted fw-bold">Ekuivalen</small>
            </div>
            <div class="d-flex align-items-center">
              <div class="legend-box bg-warning bg-opacity-25 border-warning me-2"></div>
              <small class="text-muted fw-bold">Hanya ada di salah satu</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Comparation -->
    <div class="card shadow-sm border-0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-bordered mb-0 align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 50%;" class="text-center p-3 fs-5">{{ getFrameworkName(frameworkA) }}</th>
                <th style="width: 50%;" class="text-center p-3 fs-5">{{ getFrameworkName(frameworkB) }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="topic in filteredTopics" :key="topic.id">
                <!-- Topic Header -->
                <tr v-if="getRowsForTopic(topic.id).length > 0">
                  <td colspan="2" class="bg-light fw-bold text-center py-3 text-uppercase text-secondary" style="letter-spacing: 1px;">
                    <i class="fa-solid fa-layer-group me-2"></i> {{ topic.name }}
                  </td>
                </tr>
                
                <!-- Rows for Topic -->
                <tr 
                  v-for="(row, idx) in getRowsForTopic(topic.id)" 
                  :key="`${topic.id}-${idx}`"
                  :class="getRowClass(row)"
                >
                  <td class="p-3">
                    <div v-if="row[frameworkA]">
                      <span class="badge bg-secondary mb-2">{{ row[frameworkA].id }}</span>
                      <p class="mb-0">{{ row[frameworkA].desc }}</p>
                    </div>
                    <div v-else class="text-muted small fst-italic">
                      <i class="fa-solid fa-minus me-1"></i> Tidak ada kontrol yang berkesesuaian
                    </div>
                  </td>
                  <td class="p-3">
                    <div v-if="row[frameworkB]">
                      <span class="badge bg-secondary mb-2">{{ row[frameworkB].id }}</span>
                      <p class="mb-0">{{ row[frameworkB].desc }}</p>
                    </div>
                    <div v-else class="text-muted small fst-italic">
                      <i class="fa-solid fa-minus me-1"></i> Tidak ada kontrol yang berkesesuaian
                    </div>
                  </td>
                </tr>
              </template>
              
              <!-- Empty state fallback if all selected topics are empty -->
              <tr v-if="filteredTopics.every(t => getRowsForTopic(t.id).length === 0)">
                <td colspan="2" class="text-center text-muted p-5">
                  <i class="fa-solid fa-folder-open fs-2 mb-3"></i>
                  <p class="mb-0">Tidak ada data perbandingan untuk topik ini pada framework yang dipilih.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { comparisonData } from '../data/comparisonData';

const props = defineProps({
  frameworkA: {
    type: String,
    required: true
  },
  frameworkB: {
    type: String,
    required: true
  }
});

const availableFrameworks = comparisonData.frameworks;
const topics = comparisonData.topics;
const mappings = comparisonData.mappings;

const selectedTopic = ref('all');

const getFrameworkName = (id) => {
  const fw = availableFrameworks.find(f => f.id === id);
  return fw ? fw.name : id;
};

const filteredTopics = computed(() => {
  if (selectedTopic.value === 'all') return topics;
  return topics.filter(t => t.id === selectedTopic.value);
});

const getRowsForTopic = (topicId) => {
  const topicMappings = mappings.filter(m => m.topic === topicId);
  return topicMappings.filter(m => !!m[props.frameworkA] || !!m[props.frameworkB]);
};

const getRowClass = (row) => {
  const hasA = !!row[props.frameworkA];
  const hasB = !!row[props.frameworkB];
  
  if (hasA && hasB) {
    return 'table-success'; 
  } else if (hasA || hasB) {
    return 'table-warning'; 
  }
  return '';
};
</script>

<style scoped>
.legend-box {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.1);
  display: inline-block;
}
.table td {
  transition: background-color 0.2s ease;
}
.badge {
  font-size: 0.85em;
  padding: 0.4em 0.6em;
}
</style>
