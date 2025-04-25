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
import pdfMake from "pdfmake/build/pdfmake";
import { Document, Packer, Paragraph, TextRun } from "docx";

pdfMake.vfs = window.pdfMake.vfs;

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

  const exportToPDF = () => {
    const barChartContainer = document.getElementById('bar-chart-container');
    const pieChartContainer = document.getElementById('pie-chart-container');
    
    Promise.all([
      html2canvas(barChartContainer),
      html2canvas(pieChartContainer)
    ]).then(([barCanvas, pieCanvas]) => {
      const barImage = barCanvas.toDataURL("image/png");
      const pieImage = pieCanvas.toDataURL("image/png");
  
      const docDefinition = {
        content: [
          { text: "Сравнение департаментов", style: "header", alignment: "center" },
          { text: 'ОАО "МТЗ"', alignment: "center", margin: [0, 0, 0, 10] },
          {
            table: {
              widths: ['*', 'auto', 'auto', '*'],
              body: [
                ['Департамент', 'Сотрудники', 'Отпуска', 'Общая выплаченная зарплата ($)'],
                ...comparisonData.map(item => [
                  item.department,
                  item.employees,
                  item.leaves,
                  item.totalSalary.toFixed(2)
                ])
              ]
            },
            layout: 'lightHorizontalLines'
          },
          { text: "Количество сотрудников по департаментам", style: "subHeader" },
          { image: barImage, width: 500, height: 300 },
          { text: "Доля зарплаты по департаментам", style: "subHeader" },
          { image: pieImage, width: 500, height: 300 },
        ],
        styles: {
          header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
          subHeader: { fontSize: 14, margin: [0, 10, 0, 5] }
        },
        defaultStyle: {
          fontSize: 12
        }
      };
  
      pdfMake.createPdf(docDefinition).download("DepartmentComparison.pdf");
    });
  };

  const exportToWord = () => {
    const barChartContainer = document.getElementById('bar-chart-container');
    const pieChartContainer = document.getElementById('pie-chart-container');
    
    Promise.all([
      html2canvas(barChartContainer),
      html2canvas(pieChartContainer)
    ]).then(([barCanvas, pieCanvas]) => {
      const barImage = barCanvas.toDataURL("image/png");
      const pieImage = pieCanvas.toDataURL("image/png");
  
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office'
              xmlns:w='urn:schemas-microsoft-com:office:word'
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Сравнение департаментов</title></head>
        <body style="font-family: Arial; font-size: 12pt;">
          <h3 style="text-align: center;">Сравнение департаментов</h3>
          <h4 style="text-align: center;">ОАО "МТЗ"</h4>
  
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <th>Департамент</th>
              <th>Сотрудники</th>
              <th>Отпуска</th>
              <th>Общая выплаченная зарплата</th>
            </tr>
            ${comparisonData.map(item => `
              <tr>
                <td>${item.department}</td>
                <td>${item.employees}</td>
                <td>${item.leaves}</td>
                <td>${item.totalSalary.toFixed(2)} руб.</td>
              </tr>
            `).join('')}
          </table>
  
          <br/>
  
          <h4 style="text-align: center;">Количество сотрудников по департаментам</h4>
          <img src="${barImage}" style="display: block; margin: 0 auto;" />
  
          <br/>
  
          <h4 style="text-align: center;">Доля зарплаты по департаментам</h4>
          <img src="${pieImage}" style="display: block; margin: 0 auto;" />
        </body>
        </html>
      `;
  
      const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
      const fileName = "DepartmentComparison.doc";
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">Сравнение департаментов</h3>

      <div className="flex justify-end mb-4">
        <ExportDepartmentTable data={comparisonData} />
        <button
          onClick={exportToPDF}
          className="px-4 py-2 border bg-gray-100 text-lg font-semibold"
        >
          Экспортировать в PDF
        </button>
        <button
          onClick={exportToWord}
          className="ml-4 px-4 py-2 border bg-gray-100 text-lg font-semibold"
        >
          Экспортировать в Word
        </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
        </div>

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
        </div>
      </div>
    </div>
  );
};

export default LeaderComparison;
