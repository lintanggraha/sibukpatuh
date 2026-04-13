import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './components/App.vue';
import router from './router/index.js';

// Import Bootstrap CSS from CDN
import 'bootstrap/dist/css/bootstrap.min.css';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');
