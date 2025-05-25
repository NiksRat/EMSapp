import React from 'react';
import { useAuth } from '../../context/authContext';
import { useTranslation } from 'react-i18next';

const LeaderNavbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex items-center text-white justify-between h-12 bg-green-600 px-5">
      <p>{t('welcome', { name: user.name })}</p>
      <button
        className="px-4 py-1 bg-green-700 hover:bg-green-800"
        onClick={logout}
      >
        {t('logout')}
      </button>
    </div>
  );
};

export default LeaderNavbar;
