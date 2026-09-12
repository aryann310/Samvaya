import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import gu from '../locales/gu.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  gu: { translation: gu },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'gu'],
    interpolation: {
      escapeValue: false, // React already handles XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'samvaya-language',
      caches: ['localStorage'],
    },
  });

export default i18n;
