import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaMoneyBillWave,
  FaRegCalendarAlt,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { AiOutlineFileText } from 'react-icons/ai'
import { useTranslation } from 'react-i18next';

// Функция для смены языка и сохранения в localStorage
const toggleLanguage = (i18n) => {
  const newLanguage = i18n.language === 'ru' ? 'en' : 'ru';
  localStorage.setItem('appLanguage', newLanguage);  // Сохраняем язык в localStorage
  i18n.changeLanguage(newLanguage);  // Меняем язык в i18n
};

const AdminSidebar = () => {
  const { t, i18n } = useTranslation();

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
          to="/admin-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
          end
        >
          <FaTachometerAlt />
          <span>{t('Dashboard')}</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/employees"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaUsers />
          <span>{t('Employees')}</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/departments"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaBuilding />
          <span>{t('Departments')}</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/leaves"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaCalendarAlt />
          <span>{t('Leave')}</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/salary/add"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaMoneyBillWave />
          <span>{t('Salary')}</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/salary-report"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <AiOutlineFileText />
          <span>{t('Salary Report')}</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/attendance"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaRegCalendarAlt />
          <span>{t('Attendance')}</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/attendance-report"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <AiOutlineFileText />
          <span>{t('Attendance Report')}</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/setting"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
        }
        >
          <FaCogs />
          <span>{t('Settings')}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
