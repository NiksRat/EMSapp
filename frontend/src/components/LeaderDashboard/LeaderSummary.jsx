import React, { useEffect, useState } from "react";
import SummaryCard from "../dashboard/SummaryCard";
import { FaUsers, FaBuilding, FaMoneyBillWave } from "react-icons/fa";
import axios from "axios";

const LeaderSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leader/summary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Leader Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          icon={<FaUsers />}
          text="Total Employees"
          number={summary.totalEmployees}
          color="bg-blue-600"
        />
        <SummaryCard
          icon={<FaBuilding />}
          text="Departments"
          number={summary.totalDepartments}
          color="bg-indigo-600"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          text="Total Salary"
          number={`$${summary.totalSalary}`}
          color="bg-purple-600"
        />
      </div>
    </div>
  );
};

export default LeaderSummary;
