import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaRegCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";

const LeaderSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
      <div className="bg-blue-600 h-12 flex items-center justify-center">
        <h3 className="text-2xl text-center font-pacific">Leader Panel</h3>
      </div>
      <div className="px-4">
        <NavLink
          to="/leader-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
          end
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/leader-dashboard/employees"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaUsers />
          <span>Employees</span>
        </NavLink>
        <NavLink
          to="/leader-dashboard/attendance"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <FaRegCalendarAlt />
          <span>Attendance</span>
        </NavLink>
        <NavLink
          to="/leader-dashboard/salary-report"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <AiOutlineFileText />
          <span>Salary Report</span>
        </NavLink>
        <NavLink
          to="/leader-dashboard/attendance-report"
          className={({ isActive }) =>
            `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
          }
        >
          <AiOutlineFileText />
          <span>Leave Report</span>
        </NavLink>

        <NavLink
  to="/leader-dashboard/comparison"
  className={({ isActive }) =>
    `${isActive ? "bg-blue-500 " : ""} flex items-center space-x-4 block py-2.5 px-4 rounded`
  }
>
  <FaTachometerAlt />
  <span>Comparison</span>
</NavLink>
      </div>
    </div>
  );
};

export default LeaderSidebar;
