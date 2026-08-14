import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './components/App.vue';
import router from './router/index.js';
import i18n from './i18n';
import { installRegulationDataFetchTranslator } from './utils/regulationDataTranslator';
import { seoPlugin } from './plugins/seoPlugin.js';

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
app.use(seoPlugin, { router }); // Auto-inject per-page SEO schema

// Analytics is intentionally not initialized in the app runtime. A blocked
// third-party analytics script must never prevent the Vue application from mounting.

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
