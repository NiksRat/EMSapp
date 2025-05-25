import React from "react";
import { Outlet } from "react-router-dom";
import AccountantNavbar from "./AccountantNavbar";
import AccountantSidebar from "./AccountantSidebar";

const AccountantDashboard = () => {
  return (
    <div className="flex">
      <AccountantSidebar />
      <div className="flex flex-col flex-1 ml-64">
        <AccountantNavbar />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;
