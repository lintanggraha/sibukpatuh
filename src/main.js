import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './components/App.vue';
import router from './router/index.js';
import VueGtag from 'vue-gtag';

// Import Bootstrap CSS from CDN
import 'bootstrap/dist/css/bootstrap.min.css';

// Import shared framework styles
import './assets/css/framework-shared.css';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

// Install Google Analytics 4
const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (gaId && gaId !== 'G-XXXXXXXXXX') {
  app.use(VueGtag, {
    config: { id: gaId },
    appName: 'SibukPatuh',
    pageTrackerScreenviewEnabled: true
  }, router);
} else {
  console.warn('Google Analytics is disabled (VITE_GA_MEASUREMENT_ID is missing or default).');
}

// Global error handler for uncaught errors
app.config.errorHandler = (error, instance, info) => {
  console.error('Vue Error:', error);
  console.error('Component:', instance?.$options?.name || 'Unknown');
  console.error('Error Info:', info);
  
  // In production, you could send this to an error tracking service
  // e.g., Sentry.captureException(error);
};

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // Prevent default browser error handling
  event.preventDefault();
});

// Global uncaught error handler
window.addEventListener('error', (event) => {
  console.error('Uncaught Error:', event.error);
  // Prevent default browser error handling
  event.preventDefault();
});

app.mount('#app');
