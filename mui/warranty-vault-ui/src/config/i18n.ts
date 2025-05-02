// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Load translation using http -> see /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    // Language detection options
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'querystring', 'cookie', 'htmlTag'],
      
      // Cache user language on localStorage
      caches: ['localStorage'],
      
      // Key name for storing language in localStorage
      lookupLocalStorage: 'i18nextLng',
    }
  });

export default i18n;