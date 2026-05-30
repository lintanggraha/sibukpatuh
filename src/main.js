import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './components/App.vue';
import router from './router/index.js';
import VueGtag from 'vue-gtag-next';
import i18n from './i18n';

// Global Fetch Interceptor for Translations
const originalFetch = window.fetch;
window.fetch = async function() {
  let [resource, config] = arguments;
  
  if (typeof resource === 'string' && resource.startsWith('/data/') && resource.endsWith('.json')) {
    // If language is English, try fetching the _en.json version first
    const lang = localStorage.getItem('language') || 'id';
    if (lang === 'en' && !resource.endsWith('_en.json')) {
      const enResource = resource.replace('.json', '_en.json');
      try {
        const enResponse = await originalFetch(enResource, config);
        if (enResponse.ok) {
          return enResponse;
        }
      } catch (e) {
        // Fallback to default
      }
    }
  }
  
  return originalFetch.apply(this, arguments);
};

// Vercel Analytics is now handled via component in App.vue

// Import Bootstrap CSS from CDN
import 'bootstrap/dist/css/bootstrap.min.css';

// Import shared framework styles
import './assets/css/framework-shared.css';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(i18n);

// Install Google Analytics 4
import { trackRouter } from 'vue-gtag-next';
const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (gaId && gaId !== 'G-XXXXXXXXXX') {
  app.use(VueGtag, {
    property: { id: gaId },
    appName: 'SibukPatuh'
  });
  trackRouter(router);
} else {
  console.warn('Google Analytics is disabled (VITE_GA_MEASUREMENT_ID is missing or default).');
}

// Global error handler for uncaught errors
app.config.errorHandler = (error, instance, info) => {
  console.error('Vue Error:', error);
  console.error('Component:', instance?.$options?.name || 'Unknown');
  console.error('Error Info:', info);
};

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  event.preventDefault();
});

// Global uncaught error handler
window.addEventListener('error', (event) => {
  console.error('Uncaught Error:', event.error);
  event.preventDefault();
});

app.mount('#app');
