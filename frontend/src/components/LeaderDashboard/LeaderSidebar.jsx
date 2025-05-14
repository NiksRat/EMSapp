import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";
import { useTranslation } from "react-i18next";

// Функция для смены языка и сохранения в localStorage
const toggleLanguage = (i18n) => {
  const newLanguage = i18n.language === 'ru' ? 'en' : 'ru';
  localStorage.setItem('appLanguage', newLanguage);  // Сохраняем язык в localStorage
  i18n.changeLanguage(newLanguage);  // Меняем язык в i18n
};

const LeaderSidebar = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-blue-600 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-center font-pacific">{t('leaderPanel')}</h3>
      </div>
      <div className="px-4">
        <button
          onClick={() => toggleLanguage(i18n)}  // Используем новую функцию для смены языка
          className="w-full bg-blue-500 py-2 rounded text-center mb-4 hover:bg-blue-600"
        >
          {i18n.language === 'ru' ? 'Переключить на английский' : 'Switch to Russian'}
        </button>

        <NavLink
          to="/leader-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
          end
        >
          <FaTachometerAlt />
          <span>{t('dashboard')}</span>
        </NavLink>

        <NavLink
          to="/leader-dashboard/employees"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaUsers />
          <span>{t('employees')}</span>
        </NavLink>

        <NavLink
          to="/leader-dashboard/attendance"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaRegCalendarAlt />
          <span>{t('attendance')}</span>
        </NavLink>

        <NavLink
          to="/leader-dashboard/salary-report"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <AiOutlineFileText />
          <span>{t('salaryReport')}</span>
        </NavLink>

        <NavLink
          to="/leader-dashboard/attendance-report"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <AiOutlineFileText />
          <span>{t('leaveReport')}</span>
        </NavLink>

        <NavLink
          to="/leader-dashboard/comparison"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaTachometerAlt />
          <span>{t('comparison')}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default LeaderSidebar;
