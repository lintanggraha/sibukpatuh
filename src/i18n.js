import { createI18n } from 'vue-i18n';
import id from './locales/id.json';
import en from './locales/en.json';

const savedLanguage = localStorage.getItem('language') || 'id';

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: savedLanguage,
  fallbackLocale: 'id',
  messages: {
    id,
    en
  }
});

export default i18n;
