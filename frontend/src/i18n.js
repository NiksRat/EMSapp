import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from '../locales/en.json';
import ru from '../locales/ru.json';


const savedLanguage = localStorage.getItem('appLanguage') || 'ru';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    lng: savedLanguage,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
