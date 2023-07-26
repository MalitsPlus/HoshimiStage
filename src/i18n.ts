import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from "../public/locales/en.json";
import zh from "../public/locales/zh-CN.json"
import ko from "../public/locales/ko-KR.json"

// import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  // .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: false,
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      ko: { translation: ko },
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;