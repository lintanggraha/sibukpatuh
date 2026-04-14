/**
 * Debounce utility function
 * Delays function execution until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @param {boolean} immediate - Execute on leading edge instead of trailing
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttle utility function
 * Ensures function is called at most once in specified time period
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  
  return function(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Create a debounced search handler for Vue components
 * @param {Object} component - Vue component instance
 * @param {string} searchProperty - Name of the search property to watch
 * @param {Function} filterFunction - Function to call after debounce
 * @param {number} wait - Debounce wait time in ms
 * @returns {Object} Object with watcher and handler
 */
export function createDebouncedSearch(component, searchProperty, filterFunction, wait = 300) {
  let searchTimeout = null;
  
  return {
    /**
     * Call this when search input changes
     */
    onSearchInput(value) {
      // Clear existing timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      // Set new timeout
      searchTimeout = setTimeout(() => {
        component[searchProperty] = value;
        filterFunction();
        searchTimeout = null;
      }, wait);
    },
    
    /**
     * Clear any pending debounce
     */
    clear() {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
        searchTimeout = null;
      }
    },
  };
}

export default { debounce, throttle, createDebouncedSearch };
