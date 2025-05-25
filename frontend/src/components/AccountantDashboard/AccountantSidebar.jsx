import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaRegCalendarAlt,
  FaMoneyBillWave
} from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";
import { useTranslation } from "react-i18next";

const toggleLanguage = (i18n) => {
  const newLanguage = i18n.language === 'ru' ? 'en' : 'ru';
  localStorage.setItem('appLanguage', newLanguage);
  i18n.changeLanguage(newLanguage);
};

const AccountantSidebar = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-green-600 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-center font-pacific">{t('accountantPanel')}</h3>
      </div>
      <div className="px-4">
        <button
          onClick={() => toggleLanguage(i18n)}
          className="w-full bg-green-500 py-2 rounded text-center mb-4 hover:bg-green-600"
        >
          {i18n.language === 'ru' ? 'Переключить на английский' : 'Switch to Russian'}
        </button>

        <NavLink
          to="/accountant-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-green-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
          end
        >
          <FaTachometerAlt />
          <span>{t('dashboard')}</span>
        </NavLink>

        <NavLink
          to="/accountant-dashboard/employees"
          className={({ isActive }) =>
            `${isActive ? "bg-green-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaUsers />
          <span>{t('employees')}</span>
        </NavLink>

         <NavLink
          to="/accountant-dashboard/salary/add"
          className={({ isActive }) =>
            `${isActive ? "bg-green-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaMoneyBillWave />
          <span>{t('Salary')}</span>
        </NavLink>

<NavLink
          to="/accountant-dashboard/comparison"
          className={({ isActive }) =>
            `${isActive ? "bg-green-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaTachometerAlt />
          <span>{t('comparison')}</span>
        </NavLink>

        <NavLink
          to="/accountant-dashboard/salary-report"
          className={({ isActive }) =>
            `${isActive ? "bg-green-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <AiOutlineFileText />
          <span>{t('salaryReport')}</span>
        </NavLink>

        <NavLink
          to="/accountant-dashboard/attendance-report"
          className={({ isActive }) =>
            `${isActive ? "bg-green-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <AiOutlineFileText />
          <span>{t('leaveReport')}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AccountantSidebar;
