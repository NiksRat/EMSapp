import i18n from './i18n';

export const changeLanguage = (lang) => {
  localStorage.setItem('appLanguage', lang);  
  i18n.changeLanguage(lang);  
};
