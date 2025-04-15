import React from "react";
import { Outlet } from "react-router-dom";
import LeaderSidebar from "./LeaderSidebar";
import LeaderNavbar from "./LeaderNavbar";

const LeaderDashboard = () => {
  return (
    <div className="flex">
      <LeaderSidebar />
      <div className="flex flex-col flex-1 ml-64">
        <LeaderNavbar />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LeaderDashboard;
