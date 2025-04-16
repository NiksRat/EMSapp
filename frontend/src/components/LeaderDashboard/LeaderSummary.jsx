import React, { useEffect, useState } from "react";
import SummaryCard from "../dashboard/SummaryCard";
import {
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

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
        setSummary(res.data.data); // 💡 Используем res.data.data, как в контроллере
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) return <div>Loading...</div>;

  const leaveData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        label: "Leave Status",
        data: [
          summary.leaveSummary.approved,
          summary.leaveSummary.pending,
          summary.leaveSummary.rejected,
        ],
        backgroundColor: ["#10B981", "#FBBF24", "#EF4444"],
      },
    ],
  };

  const avgSalaryData = {
    labels: summary.averageSalaryByDepartment.map(dep => dep.department),
    datasets: [
      {
        label: "Avg salary",
        data: summary.averageSalaryByDepartment.map(dep => dep.averageSalary),
        backgroundColor: "#6366F1",
      },
    ],
  };

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
          text="Total Departments"
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

      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold">Leave Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SummaryCard
            icon={<FaFileAlt />}
            text="Leave Applied"
            number={summary.leaveSummary.appliedFor}
            color="bg-teal-600"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            text="Leave Approved"
            number={summary.leaveSummary.approved}
            color="bg-green-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text="Leave Pending"
            number={summary.leaveSummary.pending}
            color="bg-yellow-600"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Leave Rejected"
            number={summary.leaveSummary.rejected}
            color="bg-red-600"
          />
        </div>
      </div>

      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold">Analytics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h5 className="text-lg font-bold mb-2">Average Salary by Department</h5>
            <Bar data={avgSalaryData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h5 className="text-lg font-bold mb-2">Leave Status</h5>
            <Pie data={leaveData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderSummary;
