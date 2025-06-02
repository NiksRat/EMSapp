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
import { IoClose } from "react-icons/io5";
import { useTranslation } from 'react-i18next';

// Переключение языка
const toggleLanguage = (i18n) => {
  const newLang = i18n.language === 'ru' ? 'en' : 'ru';
  localStorage.setItem('appLanguage', newLang);
  i18n.changeLanguage(newLang);
};

const AdminSidebar = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      {/* Мобильный затемнённый фон */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 bottom-0 z-40 w-64 bg-gray-800 text-white transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:h-screen
        `}
      >
        {/* Верхняя панель */}
<div className="bg-teal-600 h-12 flex items-center justify-between px-6 md:px-4">
  <h3
    className="text-xl font-pacific text-white max-w-full md:max-w-none md:truncate-none truncate"
    style={{ minWidth: 0 }} 
    title={t('Employee MS')}
  >
    {t('Employee MS')}
  </h3>
  <button
    className="md:hidden text-white text-3xl p-2 rounded hover:bg-teal-700 transition"
    onClick={onClose}
    aria-label="Close sidebar"
  >
    <IoClose />
  </button>
</div>
        {/* Контейнер для прокрутки */}
        <div className="px-4 py-4 space-y-2 overflow-y-auto h-[calc(100vh-3rem)]">
          <button
            onClick={() => toggleLanguage(i18n)}
            className="w-full bg-teal-500 py-2 rounded text-center mb-2 hover:bg-teal-600"
          >
            {i18n.language === 'ru' ? 'Переключить на английский' : 'Switch to Russian'}
          </button>

          {/* Навигация */}
          {[
            { to: "/admin-dashboard", icon: <FaTachometerAlt />, label: t("Dashboard"), end: true },
            { to: "/admin-dashboard/employees", icon: <FaUsers />, label: t("Employees") },
            { to: "/admin-dashboard/departments", icon: <FaBuilding />, label: t("Departments") },
            { to: "/admin-dashboard/leaves", icon: <FaCalendarAlt />, label: t("Leave") },
            { to: "/admin-dashboard/salary/add", icon: <FaMoneyBillWave />, label: t("Salary") },
            { to: "/admin-dashboard/salary-report", icon: <AiOutlineFileText />, label: t("Salary Report") },
            { to: "/admin-dashboard/attendance", icon: <FaRegCalendarAlt />, label: t("Attendance") },
            { to: "/admin-dashboard/attendance-report", icon: <AiOutlineFileText />, label: t("Attendance Report") },
            { to: "/admin-dashboard/setting", icon: <FaCogs />, label: t("Settings") },
          ].map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 block py-2.5 px-4 rounded hover:bg-teal-600 transition`
              }
              onClick={onClose}
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
