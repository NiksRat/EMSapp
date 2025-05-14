import React, { useEffect, useState } from "react";
import { FaUser, FaMoneyBillWave, FaBuilding } from "react-icons/fa";
import { useAuth } from "../../context/authContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import axios from "axios";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement);

const SummaryCard = () => {
  const { user } = useAuth();
  const [salaryData, setSalaryData] = useState(null);
  const [departmentName, setDepartmentName] = useState("");
  const [employeeCount, setEmployeeCount] = useState(null);  
  const { t } = useTranslation();

    useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Запрос для получения информации о зарплате
        const salaryRes = await axios.get(`http://localhost:5000/api/salary/${user._id}/${user.role}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Запрос для получения информации о сотруднике и департаменте
        const employeeRes = await axios.get(`http://localhost:5000/api/employee/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (salaryRes.data.success) {
          setSalaryData(salaryRes.data.salary);
        }

        if (employeeRes.data.success) {
          // Получаем имя департамента
          setDepartmentName(employeeRes.data.employee.department ? employeeRes.data.employee.department.dep_name : t("Department not found"));

          // Запрос для получения количества сотрудников в департаменте
          const departmentId = employeeRes.data.employee.department._id;
          const employeeCountRes = await axios.get(`http://localhost:5000/api/employee/employee-count/${departmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (employeeCountRes.data.success) {
            setEmployeeCount(employeeCountRes.data.employeeCount);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [user]);

  const salaryTrendData = {
    labels: salaryData ? salaryData.map(salary => new Date(salary.payDate).toLocaleDateString()) : [],
    datasets: [
      {
        label: t("Salary Trend"),
        data: salaryData ? salaryData.map(salary => salary.netSalary) : [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const latestSalary = salaryData ? salaryData[salaryData.length - 1]?.netSalary : null;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Card */}
      <div className="rounded flex bg-white shadow p-4">
        <div className="text-3xl flex justify-center items-center bg-teal-600 text-white p-4 rounded">
          <FaUser />
        </div>
        <div className="pl-4 py-1">
          <p className="text-lg font-semibold">{t("Welcome Back")}</p>
          <p className="text-xl font-bold">{user.name}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <FaMoneyBillWave className="text-2xl text-green-600 mr-3" />
          <div>
            <p className="text-sm">{t("Next Salary")}</p>
            <p className="text-lg font-bold">{latestSalary ? `${latestSalary} BYN` : t("Loading...")}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <FaBuilding className="text-2xl text-blue-600 mr-3" />
          <div>
            <p className="text-sm">{t("Department")}</p>
            <p className="text-lg font-bold">{departmentName || t("Loading...")}</p>  {/* Отображаем департамент */}
          </div>
        </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <FaUser className="text-2xl text-yellow-600 mr-3" />
          <div>
            <p className="text-sm">{t("Employees in Department")}</p>
            <p className="text-lg font-bold">{employeeCount !== null ? employeeCount : t("Loading...")}</p>
          </div>
        </div>
      </div>

      {/* Salary Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-lg font-bold mb-2">{t("Salary Growth/Decline")}</h4>
        {salaryData ? (
          <Line data={salaryTrendData} />
        ) : (
          <p>{t("Loading salary data...")}</p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
