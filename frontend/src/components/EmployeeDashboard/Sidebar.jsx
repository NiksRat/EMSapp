import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "react-i18next";

// Функция для смены языка и сохранения в localStorage
const toggleLanguage = (i18n) => {
  const newLanguage = i18n.language === 'ru' ? 'en' : 'ru';
  localStorage.setItem('appLanguage', newLanguage);  // Сохраняем язык в localStorage
  i18n.changeLanguage(newLanguage);  // Меняем язык в i18n
};

const Sidebar = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation(); // Хук для перевода

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-teal-600 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-center font-pacific">{t('Employee MS')}</h3>
      </div>
      <div className="px-4">
        <button
          onClick={() => toggleLanguage(i18n)}  // Используем новую функцию для смены языка
          className="w-full bg-teal-500 py-2 rounded text-center mb-4 hover:bg-teal-600"
        >
          {i18n.language === 'ru' ? 'Переключить на английский' : 'Switch to Russian'}
        </button>

        <NavLink
          to="/employee-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500 " : " "} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
          end
        >
          <FaTachometerAlt />
          <span>{t('Dashboard')}</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/profile/${user._id}`}
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500 " : " "} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaUsers />
          <span>{t('My Profile')}</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/leaves/${user._id}`}
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500 " : " "} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaBuilding />
          <span>{t('Leaves')}</span>
        </NavLink>

        <NavLink
          to={`/employee-dashboard/salary/${user._id}`}
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500 " : " "} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaCalendarAlt />
          <span>{t('Salary')}</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/setting"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500 " : " "} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaCogs />
          <span>{t('Settings')}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
