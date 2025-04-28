import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
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

pdfMake.vfs = window.pdfMake.vfs;

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#845EC2", "#D65DB1", "#FF6F91", "#FFC75F",
];

const LeaderComparison = () => {
  const { t } = useTranslation();
  const [comparisonData, setComparisonData] = useState([]);
  const [exporting, setExporting] = useState(false);

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
        console.error(t('error_loading_comparison'), err.message);
      }
    };

    fetchComparison();
  }, [t]);

  if (comparisonData.length === 0) return <div className="p-4">{t('loading_data')}</div>;

  const exportChartToImage = (chartId) => {
    setExporting(true);

    const chartElement = document.getElementById(chartId);
    const button = chartElement.querySelector("button");
    if (button) button.style.display = "none";

    html2canvas(chartElement).then((canvas) => {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${chartId}_chart.png`;
      link.click();
      setExporting(false);
      if (button) button.style.display = "block";
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
          { text: t('department_comparison'), style: "header", alignment: "center" },
          { text: t('organization_name'), alignment: "center", margin: [0, 0, 0, 10] },
          {
            table: {
              widths: ['*', 'auto', 'auto', '*'],
              body: [
                [
                  t('department'),
                  t('employees'),
                  t('leaves'),
                  t('total_salary_paid')
                ],
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
          { text: t('employees_by_department'), style: "subHeader" },
          { image: barImage, width: 500, height: 300 },
          { text: t('salary_share_by_department'), style: "subHeader" },
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
        <head><meta charset='utf-8'><title>${t('department_comparison')}</title></head>
        <body style="font-family: Arial; font-size: 12pt;">
          <h3 style="text-align: center;">${t('department_comparison')}</h3>
          <h4 style="text-align: center;">${t('organization_name')}</h4>
  
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <th>${t('department')}</th>
              <th>${t('employees')}</th>
              <th>${t('leaves')}</th>
              <th>${t('total_salary_paid')}</th>
            </tr>
            ${comparisonData.map(item => `
              <tr>
                <td>${item.department}</td>
                <td>${item.employees}</td>
                <td>${item.leaves}</td>
                <td>${item.totalSalary.toFixed(2)} ${t('currency')}</td>
              </tr>
            `).join('')}
          </table>
  
          <br/>
  
          <h4 style="text-align: center;">${t('employees_by_department')}</h4>
          <img src="${barImage}" style="display: block; margin: 0 auto;" />
  
          <br/>
  
          <h4 style="text-align: center;">${t('salary_share_by_department')}</h4>
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
      <h3 className="text-2xl font-bold mb-4">{t('department_comparison')}</h3>

      <div className="flex justify-end items-center gap-4 mb-4">
        <ExportDepartmentTable data={comparisonData} className="mt-4"/>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 border bg-gray-100 text-lg font-semibold"
        >
          {t('export_to_pdf')}
        </button>
        <button
          onClick={exportToWord}
          className="px-4 py-2 border bg-gray-100 text-lg font-semibold"
        >
          {t('export_to_word')}
        </button>
      </div>

      <div className="overflow-x-auto mb-10">
        <table className="min-w-[600px] w-full bg-white border border-gray-300 text-sm rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-800">
              <th className="p-3 border-b w-[250px]">{t('department')}</th>
              <th className="p-3 border-b text-center">{t('employees')}</th>
              <th className="p-3 border-b text-center">{t('leaves')}</th>
              <th className="p-3 border-b text-center">{t('total_salary_paid')}</th>
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
          <h4 className="text-lg font-semibold mb-2">{t('employees_by_department')}</h4>
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
          <h4 className="text-lg font-semibold mb-2">{t('salary_share_by_department')}</h4>
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
