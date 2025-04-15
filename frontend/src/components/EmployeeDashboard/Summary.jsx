import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement } from "chart.js";
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement);

const SummaryCard = () => {
  const { user } = useAuth();
  const [salaryData, setSalaryData] = useState(null);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/salary/${user._id}/${user.role}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setSalaryData(response.data.salary);
        }
      } catch (error) {
        console.error("Error fetching salary data:", error);
      }
    };

    fetchSalaryData();
  }, [user]);

  const salaryTrendData = {
    labels: salaryData ? salaryData.map(salary => new Date(salary.payDate).toLocaleDateString()) : [],
    datasets: [
      {
        label: 'Salary Trend',
        data: salaryData ? salaryData.map(salary => salary.netSalary) : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className='p-6'>
      <div className="rounded flex bg-white">
        <div className={`text-3xl flex justify-center items-center bg-teal-600 text-white px-4`}>
          <FaUser />
        </div>
        <div className="pl-4 py-1">
          <p className="text-lg font-semibold">Welcome Back</p>
          <p className="text-xl font-bold">{user.name}</p>
        </div>
      </div>
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h4 className="text-lg font-bold mb-2">Salary Growth/Decline</h4>
        {salaryData ? (
          <Line data={salaryTrendData} />
        ) : (
          <p>Loading salary data...</p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;