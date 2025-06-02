import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyBillWave,
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

  const navItemClasses = ({ isActive }) =>
    `flex items-center space-x-4 block py-2.5 px-4 rounded transition 
     ${isActive ? "bg-green-500 font-semibold text-white" : "hover:bg-green-600 text-gray-200"}`;

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 w-64 z-40">
      <div className="bg-green-600 h-12 flex items-center justify-center">
        <h3 className="text-xl font-pacific truncate px-4">{t('accountantPanel')}</h3>
      </div>
      <div className="p-4">
        <button
          onClick={() => toggleLanguage(i18n)}
          className="w-full bg-green-500 py-2 rounded text-center mb-4 hover:bg-green-600 transition"
        >
          {i18n.language === 'ru' ? 'Переключить на английский' : 'Switch to Russian'}
        </button>

        <NavLink to="/accountant-dashboard" className={navItemClasses} end>
          <FaTachometerAlt />
          <span>{t('dashboard')}</span>
        </NavLink>

        <NavLink to="/accountant-dashboard/employees" className={navItemClasses}>
          <FaUsers />
          <span>{t('employees')}</span>
        </NavLink>

        <NavLink to="/accountant-dashboard/salary/add" className={navItemClasses}>
          <FaMoneyBillWave />
          <span>{t('Salary')}</span>
        </NavLink>

        <NavLink to="/accountant-dashboard/comparison" className={navItemClasses}>
          <FaTachometerAlt />
          <span>{t('comparison')}</span>
        </NavLink>

        <NavLink to="/accountant-dashboard/salary-report" className={navItemClasses}>
          <AiOutlineFileText />
          <span>{t('salaryReport')}</span>
        </NavLink>

        <NavLink to="/accountant-dashboard/attendance-report" className={navItemClasses}>
          <AiOutlineFileText />
          <span>{t('leaveReport')}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AccountantSidebar;
