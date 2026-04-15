/**
 * Framework Data Service
 * Centralized data fetching for all framework components
 * Provides abstraction layer for API/data access
 */

const BASE_URL = '/data';

/**
 * Generic fetch helper with error handling
 * @param {string} endpoint - Data endpoint path
 * @param {string} errorMessage - Custom error message
 * @returns {Promise<Array|Object>} Fetched data
 */
async function fetchData(endpoint, errorMessage = 'Failed to load data') {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`${errorMessage}: HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Fetch multiple datasets in parallel
 * @param {Array<{endpoint: string, key: string, errorMessage?: string}>} requests
 * @returns {Promise<Object>} Object with keys mapped to fetched data
 */
async function fetchMultiple(requests) {
  const promises = requests.map(({ endpoint, key, errorMessage }) =>
    fetchData(endpoint, errorMessage)
      .then(data => ({ key, data }))
      .catch(error => ({ key, error }))
  );
  
  const results = await Promise.all(promises);
  const output = {};
  
  results.forEach(({ key, data, error }) => {
    if (error) {
      output[key] = { error };
    } else {
      output[key] = { data };
    }
  });
  
  return output;
}

/**
 * ISO 27001 Service
 */
export const iso27001Service = {
  async getControls() {
    const data = await fetchData('iso27001.json', 'Failed to load ISO 27001 controls');
    return Array.isArray(data) ? data : data.controls || [];
  },
};

/**
 * NIST CSF Service
 */
export const nistService = {
  async getControls() {
    const data = await fetchData('nist_csf.json', 'Failed to load NIST CSF controls');
    return Array.isArray(data) ? data : [];
  },
  
  async getSP800Controls() {
    const data = await fetchData('sp800_53.json', 'Failed to load SP 800-53 controls');
    return Array.isArray(data) ? data : [];
  },
  
  async getAll() {
    return fetchMultiple([
      { endpoint: 'nist_csf.json', key: 'controls', errorMessage: 'Failed to load NIST CSF' },
      { endpoint: 'sp800_53.json', key: 'sp800Controls', errorMessage: 'Failed to load SP 800-53' },
    ]);
  },
};

/**
 * COBIT 2019 Service
 */
export const cobitService = {
  async getData() {
    return fetchData('cobit_2019.json', 'Failed to load COBIT 2019 data');
  },
};

/**
 * SEOJK Service
 */
export const seojkService = {
  async getRequirements() {
    const data = await fetchData('seojk_requirements.json', 'Failed to load SEOJK requirements');
    return Array.isArray(data) ? data : data.requirements || [];
  },
  
  async getAppendices() {
    const data = await fetchData('seojk_appendices.json', 'Failed to load SEOJK appendices');
    return Array.isArray(data) ? data : data.appendices || [];
  },
  
  async getAll() {
    return fetchMultiple([
      { endpoint: 'seojk_requirements.json', key: 'requirements', errorMessage: 'Failed to load requirements' },
      { endpoint: 'seojk_appendices.json', key: 'appendices', errorMessage: 'Failed to load appendices' },
    ]);
  },
};

/**
 * OJK Resilience Service
 */
export const resilienceService = {
  async getThemes() {
    const data = await fetchData('seojk_resilience_guidance.json', 'Failed to load Resilience themes');
    return Array.isArray(data) ? data : data.themes || data.tema || [];
  },
};

/**
 * PBI 02/2024 Service
 */
export const pbiService = {
  async getRequirements() {
    const data = await fetchData('pbi_022024_requirements.json', 'Failed to load PBI requirements');
    return Array.isArray(data) ? data : data.requirements || [];
  },
  
  async getReferences() {
    const data = await fetchData('pbi_022024_references.json', 'Failed to load PBI references');
    return Array.isArray(data) ? data : data.references || [];
  },
  
  async getAll() {
    return fetchMultiple([
      { endpoint: 'pbi_022024_requirements.json', key: 'requirements', errorMessage: 'Failed to load PBI requirements' },
      { endpoint: 'pbi_022024_references.json', key: 'references', errorMessage: 'Failed to load PBI references' },
    ]);
  },
};

/**
 * Process COBIT data into concepts array
 * @param {Object} rawData - Raw COBIT data from API
 * @returns {Array} Processed concepts array
 */
export function processCobitData(rawData) {
  return [
    ...(rawData.principles_system || []).map(c => ({
      ...c,
      type: 'system_principle',
      type_label: 'Prinsip Sistem',
    })),
    ...(rawData.principles_framework || []).map(c => ({
      ...c,
      type: 'framework_principle',
      type_label: 'Prinsip Framework',
    })),
    ...(rawData.components || []).map(c => ({
      ...c,
      type: 'component',
      type_label: 'Komponen',
    })),
    ...(rawData.design_factors || []).map(c => ({
      ...c,
      type: 'design_factor',
      type_label: 'Design Factor',
    })),
    ...(rawData.domains || []).map(c => ({
      ...c,
      type: 'domain',
      type_label: 'Domain Core Model',
    })),
    ...(rawData.implementation_phases || []).map(c => ({
      ...c,
      type: 'implementation_phase',
      type_label: 'Fase Implementasi',
    })),
  ];
}

export default {
  iso27001: iso27001Service,
  nist: nistService,
  cobit: cobitService,
  seojk: seojkService,
  resilience: resilienceService,
  pbi: pbiService,
  processCobitData,
};
