import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ExportDepartmentTable from "../exportData/ExportDepartmentTable";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import html2canvas from "html2canvas";
import pdfMake from "pdfmake/build/pdfmake";

pdfMake.vfs = window.pdfMake.vfs;

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#D65DB1"];

const AccountantSalaryOverview = () => {
  const { t } = useTranslation();
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/accountant/salary-summary", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSummaryData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch salary summary", error);
      }
    };
    fetchSummary();
  }, []);

  const exportToPDF = async () => {
    const bar = document.getElementById('bar-chart-container');
    const pie = document.getElementById('pie-chart-container');
    const [barCanvas, pieCanvas] = await Promise.all([html2canvas(bar), html2canvas(pie)]);

    const docDefinition = {
      content: [
        { text: t('salary_overview_by_department'), style: "header", alignment: "center" },
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
              ...summaryData.map(item => [
                item.department,
                item.employees,
                item.leaves,
                item.totalSalary.toFixed(2)
              ])
            ]
          },
          layout: 'lightHorizontalLines'
        },
        { image: barCanvas.toDataURL("image/png"), width: 500, margin: [0, 10] },
        { image: pieCanvas.toDataURL("image/png"), width: 500, margin: [0, 10] }
      ],
      styles: {
        header: { fontSize: 18, bold: true },
      }
    };
    pdfMake.createPdf(docDefinition).download("SalaryOverview.pdf");
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">{t('salary_overview_by_department')}</h3>
      <div className="flex gap-4 justify-end mb-4">
        <ExportDepartmentTable data={summaryData} />
        <button onClick={exportToPDF} className="px-4 py-2 bg-gray-200 rounded">
          {t('export_to_pdf')}
        </button>
      </div>

      <table className="w-full bg-white border text-sm mb-10">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">{t('department')}</th>
            <th className="p-2 text-center">{t('employees')}</th>
            <th className="p-2 text-center">{t('leaves')}</th>
            <th className="p-2 text-center">{t('total_salary_paid')}</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((item, i) => (
            <tr key={i} className="text-center">
              <td className="p-2">{item.department}</td>
              <td className="p-2">{item.employees}</td>
              <td className="p-2">{item.leaves}</td>
              <td className="p-2">{item.totalSalary.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div id="bar-chart-container" className="bg-white rounded shadow p-4">
          <h4 className="text-lg font-semibold mb-2">{t('employees_by_department')}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summaryData}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="employees" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div id="pie-chart-container" className="bg-white rounded shadow p-4">
          <h4 className="text-lg font-semibold mb-2">{t('salary_share_by_department')}</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summaryData}
                dataKey="totalSalary"
                nameKey="department"
                outerRadius={100}
                label
              >
                {summaryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
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

export default AccountantSalaryOverview;
