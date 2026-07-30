import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './components/App.vue';
import router from './router/index.js';
import VueGtag from 'vue-gtag-next';
import i18n from './i18n';
import { installRegulationDataFetchTranslator } from './utils/regulationDataTranslator';

installRegulationDataFetchTranslator();

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
