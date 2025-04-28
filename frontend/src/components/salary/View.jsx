import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
} from "docx";
import { saveAs } from "file-saver";
import { useTranslation } from 'react-i18next';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = window.pdfMake.vfs

const View = () => {
  const [salaries, setSalaries] = useState(null);
  const [employee2, setEmployee] = useState(null);
  const [filteredSalaries, setFilteredSalaries] = useState(null);
  const { id } = useParams();
  let sno = 1;
  const [startDate, setStartDate] = useState(null); 
  const [endDate, setEndDate] = useState(null); 
  const { user } = useAuth();
  const { t } = useTranslation(); 


  const fetchSalareis = async () => {
    try {
      const query = new URLSearchParams();
      if (startDate) {
        query.append("startDate", startDate); 
      }
      if (endDate) {
        query.append("endDate", endDate); 
      }
      const response = await axios.get(
        `http://localhost:5000/api/salary/${id}/${user.role}?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Ответ от сервера:", response.data); 
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.message);
      }
    }
  };

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      const employeeData = response.data.employee;
      console.log("ФИО сотрудника:", employeeData.userId.name);
      console.log("Подразделение:", employeeData.department.dep_name);
  
      setEmployee(employeeData);
    } catch (error) {
      console.error("Ошибка при получении данных сотрудника:", error);
    }
  };

  const filterSalaries = () => {
    const filteredRecords = salaries.filter((salary) => {
      const salaryDate = new Date(salary.payDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (
        (!start || salaryDate >= start) &&
        (!end || salaryDate <= end)
      );
    });
    setFilteredSalaries(filteredRecords);
  };

  const exportLastSalary = async (format, salary) => {
    if (!salary) return;

    const employee = salary.employeeId;
    const payDate = new Date(salary.payDate).toLocaleDateString("ru-RU");

    if (format === "word") {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: t("Salary Slip"), // Translate this text
                heading: "Heading1",
                alignment: "CENTER",
              }),
              new Paragraph({
                children: [new TextRun(`${t("Employee")}: ${employee.userId?.name || "N/A"}`)], // Translate the text
              }),
              new Paragraph({
                children: [new TextRun(`${t("Department")}: ${employee.department?.dep_name || "N/A"}`)], // Translate the text
              }),
              new Paragraph({
                children: [new TextRun(`${t("Pay Date")}: ${payDate}`)], // Translate the text
              }),
              new Paragraph({ text: "" }),
    
              new Paragraph({
                children: [new TextRun({ text: t("Basic Salary") + ": ", bold: true }), new TextRun(`${salary.basicSalary} руб`)], // Translate the text
              }),
              new Paragraph({
                children: [new TextRun({ text: t("Allowances") + ": ", bold: true }), new TextRun(`${salary.allowances} руб`)], // Translate the text
              }),
              new Paragraph({
                children: [new TextRun({ text: t("Deductions") + " (НДФЛ): ", bold: true }), new TextRun(`${salary.deductions} руб`)], // Translate the text
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: t("To Pay") + ": ", bold: true }), // Translate the text
                  new TextRun({ text: `${salary.netSalary} руб`, bold: true }),
                ],
              }),
            ],
          },
        ],
      });
    
      try {
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `SalarySlip_${employee.employeeId}.docx`);
      } catch (error) {
        console.error("Ошибка при генерации Word:", error);
      }
    }
    
    else if (format === "pdf") {
      const docDefinition = {
        content: [
          { text: t("Salary Slip"), style: "header", alignment: "center" }, // Translate the text
          { text: t('companyName'), alignment: "center", margin: [0, 0, 0, 10] },
    
          {
            columns: [
              { text: `${employee2?.userId?.name || "N/A"}, таб. №${employee.employeeId}`, style: "info" },
              { text: `${t("Pay Date")}: ${payDate}`, alignment: "right", style: "info" } // Translate the text
            ]
          },
          {
            columns: [
              { text: `${t("Department")}: ${employee2?.department?.dep_name || "N/A"}`, style: "info" }, // Translate the text
              { text: `${t("Basic Salary")}: ${salary.basicSalary} руб.`, alignment: "right", style: "info" } // Translate the text
            ]
          },
    
          "\n",
          {
            table: {
              widths: ['*', 'auto', 'auto', '*', 'auto'],
              body: [
                [
                  { text: t('Type of Income'), bold: true, fillColor: '#f0f0f0' }, // Translate the text
                  { text: t('Amount'), bold: true, fillColor: '#f0f0f0' }, // Translate the text
                  { text: t('Days / Hours'), bold: true, fillColor: '#f0f0f0' }, // Translate the text
                  { text: t('Type of Deduction'), bold: true, fillColor: '#f0f0f0' }, // Translate the text
                  { text: t('Amount'), bold: true, fillColor: '#f0f0f0' }, // Translate the text
                ],
                ['оклад по дням', `${salary.basicSalary}`, '15 дн.', 'НДФЛ', `${salary.deductions}`],
                ['за работу в выходные дни', `${salary.allowances}`, '1 день', '', ''],
                ['отпускные', '0.00', '5 дн.', '', ''],
                [
                  { text: t('Total Income'), bold: true }, // Translate the text
                  { text: `${salary.basicSalary + salary.allowances}`, colSpan: 2, bold: true }, {}, 
                  { text: t('Total Deductions'), bold: true }, // Translate the text
                  { text: `${salary.deductions}`, bold: true }
                ],
              ],
            },
            layout: 'lightHorizontalLines'
          },
    
          "\n",
          {
            columns: [
              {
                text: `${t("Amount to Pay")}: ${salary.netSalary} руб.`, // Translate the text
                bold: true
              },
              {
                text: `${t("Paid via cash (bank)")}: ${salary.netSalary} руб.`, // Translate the text
                alignment: "right"
              }
            ]
          }
        ],
        styles: {
          header: { fontSize: 18, bold: true, margin: [0, 0, 0, 5] },
          info: { fontSize: 11, margin: [0, 2, 0, 2] }
        },
        defaultStyle: {
          fontSize: 10
        }
      };
    
      try {
        pdfMake.createPdf(docDefinition).download(`SalarySlip_${employee.employeeId}.pdf`);
      } catch (error) {
        console.error("Ошибка при генерации PDF:", error);
      }
    }
  };

  const exportSalaryToWord = (salary) => {
    if (!salary) return;
  
    const employee = salary.employeeId;
    const payDate = new Date(salary.payDate).toLocaleDateString("ru-RU");
  
    const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${t('salarySlipTitle')}</title></head>
    <body style="font-family: Arial; font-size: 12pt;">
      <h3 style="text-align: center;">${t('salarySlip')}</h3>
      <h4 style="text-align: center;">${t('companyName')}</h4>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr>
          <td><b>${employee2?.userId?.name || "N/A"}, ${t('tabNumber')}: ${employee.employeeId}</b></td>
          <td style="text-align: right;"><b>${t('payDate')}:</b> ${payDate}</td>
        </tr>
        <tr>
          <td><b>${t('department')}:</b> ${employee2?.department?.dep_name || "N/A"}</td>
          <td style="text-align: right;"><b>${t('salaryRate')}:</b> ${salary.basicSalary} руб.</td>
        </tr>
      </table>

      <br/>

      <table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">
        <tr>
          <th colspan="3">${t('accruals')}</th>
          <th colspan="2">${t('deductions')}</th>
        </tr>
        <tr>
          <th>${t('accrualType')}</th>
          <th>${t('amount')}</th>
          <th>${t('daysHours')}</th>
          <th>${t('deductionType')}</th>
          <th>${t('amount')}</th>
        </tr>
        <tr>
          <td>${t('salary')}</td>
          <td>${salary.basicSalary}</td>
          <td>—</td>
          <td>${t('incomeTax')}</td>
          <td>${salary.deductions}</td>
        </tr>
        <tr>
          <td>${t('bonus')}</td>
          <td>${salary.allowances}</td>
          <td>—</td>
          <td>—</td>
          <td>—</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right;"><b>${t('accrued')}</b></td>
          <td colspan="2"><b>${salary.basicSalary + salary.allowances}</b></td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right;"><b>${t('deducted')}</b></td>
          <td colspan="2"><b>${salary.deductions}</b></td>
        </tr>
      </table>

      <br/>

      <table style="width: 100%; margin-top: 10px;">
        <tr>
          <td><b>${t('toBePaid')}:</b> ${salary.netSalary.toFixed(2)} руб.</td>
        </tr>
        <tr>
          <td>${t('paidThroughCash')} (${salary.netSalary.toFixed(2)})</td>
        </tr>
        <tr>
          <td>${t('companyDebt')} (${t('employeeDebt')}: —)</td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword',
    });
  
    const fileName = `SalarySlip_${employee.employeeId}.doc`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  

  useEffect(() => {
    fetchSalareis();
    fetchEmployee();
  }, [startDate, endDate, id]); 

  return (
    <>
      {filteredSalaries === null ? (
        <div>{t('loading')}</div>  
      ) : (
        <div className="overflow-x-auto p-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{t('salaryHistory')}</h2>  
          </div>
          <div className="flex justify-end my-3 gap-3">
            <input
              type="date"
              placeholder={t('startDate')}  
              className="border px-2 rounded-md py-0.5 border-gray-300"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              placeholder={t('endDate')}  
              className="border px-2 rounded-md py-0.5 border-gray-300"
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              onClick={filterSalaries}
            >
              {t('filter')}  
            </button>
          </div>
  
          {filteredSalaries.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                <tr>
                  <th className="px-6 py-3">{t('sno')}</th>  
                  <th className="px-6 py-3">{t('empId')}</th>  
                  <th className="px-6 py-3">{t('salary')}</th>  
                  <th className="px-6 py-3">{t('allowance')}</th>  
                  <th className="px-6 py-3">{t('deduction')}</th>  
                  <th className="px-6 py-3">{t('total')}</th>  
                  <th className="px-6 py-3">{t('payDate')}</th>  
                  <th className="px-6 py-3">{t('export')}</th>  
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary) => (
                  <tr
                    key={salary._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-3 font-semibold text-white">{sno++}</td>
                    <td className="px-6 py-3 font-semibold text-white">{salary.employeeId.employeeId}</td>
                    <td className="px-6 py-3 font-semibold text-white">{salary.basicSalary}</td>
                    <td className="px-6 py-3 font-semibold text-white">{salary.allowances}</td>
                    <td className="px-6 py-3 font-semibold text-white">{salary.deductions}</td>
                    <td className="px-6 py-3 font-semibold text-white">{salary.netSalary}</td>
                    <td className="px-6 py-3 font-semibold text-white">
                      {new Date(salary.payDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        className={`px-4 py-1 rounded text-white ${
                          salary.netSalary > 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={salary.netSalary <= 0}
                        onClick={() => exportSalaryToWord(salary)}
                      >
                        {t('exportToWord')}  
                      </button>
                      <button
                        className={`px-4 py-1 rounded text-white ${
                          salary.netSalary > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={salary.netSalary <= 0}
                        onClick={() => exportLastSalary("pdf", salary)}
                      >
                        {t('exportToPDF')}  
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>{t('noRecords')}</div>  // "Нет записей"
          )}
        </div>
      )}
    </>
  );  
};

export default View;
