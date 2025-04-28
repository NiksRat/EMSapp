import React from 'react';
import { changeLanguage } from '../i18nHelper';  

const LanguageSwitcher = () => {
  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage('ru')}>Русский</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
};

export default LanguageSwitcher;
