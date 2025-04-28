import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import { 
  FaBuilding, 
  FaCheckCircle, 
  FaFileAlt, 
  FaHourglassHalf, 
  FaMoneyBillWave, 
  FaTimesCircle, 
  FaUsers 
} from "react-icons/fa";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { useTranslation } from 'react-i18next'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminSummary = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response.data);
        setSummary(response.data);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
        }
        console.log(error.message);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) {
    return <div>{t('Loading...')}</div>;
  }

  const leaveData = {
    labels: [t('Approved'), t('Pending'), t('Rejected')],
    datasets: [
      {
        label: t('Leave Status'),
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
    labels: [t('Avg salary')],
    datasets: [
      {
        label: t('Avg salary on departments'),
        data: [summary.totalSalary / summary.totalDepartments || 0],
        backgroundColor: "#4F46E5",
      },
    ],
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">{t('Dashboard Overview')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          icon={<FaUsers />}
          text={t('Total Employees')}
          number={summary.totalEmployees}
          color="bg-teal-600"
        />
        <SummaryCard
          icon={<FaBuilding />}
          text={t('Total Departments')}
          number={summary.totalDepartments}
          color="bg-yellow-600"
        />
        <SummaryCard
          icon={<FaMoneyBillWave />}
          text={t('Monthly Salary')}
          number={`$${summary.totalSalary}`}
          color="bg-red-600"
        />
      </div>

      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold">{t('Leave Details')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SummaryCard
            icon={<FaFileAlt />}
            text={t('Leave Applied')}
            number={summary.leaveSummary.appliedFor}
            color="bg-teal-600"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            text={t('Leave Approved')}
            number={summary.leaveSummary.approved}
            color="bg-green-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text={t('Leave Pending')}
            number={summary.leaveSummary.pending}
            color="bg-yellow-600"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text={t('Leave Rejected')}
            number={summary.leaveSummary.rejected}
            color="bg-red-600"
          />
        </div>
      </div>

      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold">{t('Analytics')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h5 className="text-lg font-bold mb-2">{t('Avg salary on departments')}</h5>
            <Bar data={avgSalaryData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h5 className="text-lg font-bold mb-2">{t('Leave status')}</h5>
            <Pie data={leaveData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
