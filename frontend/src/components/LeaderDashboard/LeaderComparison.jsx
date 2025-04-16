import React, { useEffect, useState } from "react";
import axios from "axios";
import ExportDepartmentTable from "../exportData/ExportDepartmentTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import html2canvas from "html2canvas";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#845EC2", "#D65DB1", "#FF6F91", "#FFC75F",
];

const LeaderComparison = () => {
  const [comparisonData, setComparisonData] = useState([]);
  const [exporting, setExporting] = useState(false); // Состояние для блокировки кнопки

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leader/compare", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const sorted = res.data.data.sort((a, b) => b.employees - a.employees);
        setComparisonData(sorted);
      } catch (err) {
        console.error("Ошибка при загрузке сравнения:", err.message);
      }
    };

    fetchComparison();
  }, []);

  if (comparisonData.length === 0) return <div className="p-4">Загрузка данных...</div>;

  // Функция для экспорта диаграмм
  const exportChartToImage = (chartId) => {
    setExporting(true); // Блокируем кнопку до завершения экспорта

    // Скрываем кнопку на момент экспорта
    const chartElement = document.getElementById(chartId);
    const button = chartElement.querySelector("button");
    if (button) button.style.display = "none"; // Скрываем кнопку

    html2canvas(chartElement).then((canvas) => {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${chartId}_chart.png`; // Название файла
      link.click();
      setExporting(false); // Разблокируем кнопку
      if (button) button.style.display = "block"; // Показываем кнопку обратно
    });
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">Сравнение департаментов</h3>

      <div className="flex justify-end mb-4">
        <ExportDepartmentTable data={comparisonData} />
      </div>

      <div className="overflow-x-auto mb-10">
        <table className="min-w-[600px] w-full bg-white border border-gray-300 text-sm rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-800">
              <th className="p-3 border-b w-[250px]">Департамент</th>
              <th className="p-3 border-b text-center">Сотрудники</th>
              <th className="p-3 border-b text-center">Отпуска</th>
              <th className="p-3 border-b text-center">Общая выплаченная зарплата ($)</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 text-gray-700">
                <td className="p-3 border-b font-medium break-words whitespace-normal">
                  {item.department}
                </td>
                <td className="p-3 border-b text-center">{item.employees}</td>
                <td className="p-3 border-b text-center">{item.leaves}</td>
                <td className="p-3 border-b text-center">{item.totalSalary.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Диаграммы */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Bar Chart */}
        <div className="bg-white rounded shadow p-4" id="bar-chart-container">
          <h4 className="text-lg font-semibold mb-2">Количество сотрудников по департаментам</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="employees" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <button
            className="mt-4 px-4 py-2 border bg-gray-100 text-lg font-semibold"
            onClick={() => exportChartToImage("bar-chart-container")}
            disabled={exporting}
          >
            {exporting ? "Экспорт..." : "Экспортировать диаграмму"}
          </button>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded shadow p-4" id="pie-chart-container">
          <h4 className="text-lg font-semibold mb-2">Доля зарплаты по департаментам</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={comparisonData}
                dataKey="totalSalary"
                nameKey="department"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {comparisonData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <button
            className="mt-4 px-4 py-2 border bg-gray-100 text-lg font-semibold"
            onClick={() => exportChartToImage("pie-chart-container")}
            disabled={exporting}
          >
            {exporting ? "Экспорт..." : "Экспортировать диаграмму"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderComparison;
