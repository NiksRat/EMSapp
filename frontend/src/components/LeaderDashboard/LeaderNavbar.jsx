import React from 'react';
import { useAuth } from '../../context/authContext';
import { useTranslation } from 'react-i18next';

const LeaderNavbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex items-center text-white justify-between h-12 bg-blue-600 px-5">
      <p>{t('welcomeLeader', { name: user.name })}</p>
      <button
        className="px-4 py-1 bg-blue-700 hover:bg-blue-800"
        onClick={logout}
      >
        {t('logout')}
      </button>
    </div>
  );
};

export default LeaderNavbar;
