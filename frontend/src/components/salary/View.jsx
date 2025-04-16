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
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.addVirtualFileSystem(pdfFonts?.default?.vfs || pdfFonts.vfs);

const View = () => {
  const [salaries, setSalaries] = useState(null);
  const [filteredSalaries, setFilteredSalaries] = useState(null);
  const { id } = useParams();
  let sno = 1;
  const [startDate, setStartDate] = useState(null); // Add state for start date
  const [endDate, setEndDate] = useState(null); // Add state for end date
  const { user } = useAuth();

  const fetchSalareis = async () => {
    try {
      const query = new URLSearchParams();
      if (startDate) {
        query.append("startDate", startDate); // Send startDate to the backend
      }
      if (endDate) {
        query.append("endDate", endDate); // Send endDate to the backend
      }
      const response = await axios.get(
        `http://localhost:5000/api/salary/${id}/${user.role}?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
                text: "Расчетный лист",
                heading: "Heading1",
                alignment: "CENTER",
              }),
              new Paragraph({
                children: [new TextRun(`Сотрудник: ${employee.userId?.name || "N/A"}`)],
              }),
              new Paragraph({
                children: [new TextRun(`Подразделение: ${employee.department?.dep_name || "N/A"}`)],
              }),
              new Paragraph({
                children: [new TextRun(`Дата расчета: ${payDate}`)],
              }),
              new Paragraph({ text: "" }),
    
              new Paragraph({
                children: [new TextRun({ text: "Оклад: ", bold: true }), new TextRun(`${salary.basicSalary} руб`)],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Премии: ", bold: true }), new TextRun(`${salary.allowances} руб`)],
              }),
              new Paragraph({
                children: [new TextRun({ text: "Удержания (НДФЛ): ", bold: true }), new TextRun(`${salary.deductions} руб`)],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "К выплате: ", bold: true }),
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
          { text: "Расчетный лист", style: "header", alignment: "center" },
          { text: 'ОАО "МТЗ"', alignment: "center", margin: [0, 0, 0, 10] },
    
          {
            columns: [
              { text: `${employee.userId?.name || "N/A"}, таб. №${employee.employeeId}`, style: "info" },
              { text: `Расчетная дата: ${payDate}`, alignment: "right", style: "info" }
            ]
          },
          {
            columns: [
              { text: `Подразделение: ${employee.department?.dep_name || "N/A"}`, style: "info" },
              { text: `Оклад/Тариф: ${salary.basicSalary} руб.`, alignment: "right", style: "info" }
            ]
          },
    
          "\n",
          {
            table: {
              widths: ['*', 'auto', 'auto', '*', 'auto'],
              body: [
                [
                  { text: 'Вид начисления', bold: true, fillColor: '#f0f0f0' },
                  { text: 'Сумма', bold: true, fillColor: '#f0f0f0' },
                  { text: 'Дней / Часов', bold: true, fillColor: '#f0f0f0' },
                  { text: 'Вид удержания', bold: true, fillColor: '#f0f0f0' },
                  { text: 'Сумма', bold: true, fillColor: '#f0f0f0' },
                ],
                ['оклад по дням', `${salary.basicSalary}`, '15 дн.', 'НДФЛ', `${salary.deductions}`],
                ['за работу в выходные дни', `${salary.allowances}`, '1 день', '', ''],
                ['отпускные', '0.00', '5 дн.', '', ''],
                [
                  { text: 'Начислено', bold: true },
                  { text: `${salary.basicSalary + salary.allowances}`, colSpan: 2, bold: true }, {},
                  { text: 'Удержано', bold: true },
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
                text: `Полагается к выплате: ${salary.netSalary} руб.`,
                bold: true
              },
              {
                text: `Выплачено через кассу (банк): ${salary.netSalary} руб.`,
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
      <head><meta charset='utf-8'><title>Расчетный лист</title></head>
      <body style="font-family: Arial; font-size: 12pt;">
        <h3 style="text-align: center;">Расчетный лист</h3>
        <h4 style="text-align: center;">ОАО "МТЗ"</h4>
  
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td><b>${employee.userId?.name || "N/A"}, таб. №${employee.employeeId}</b></td>
            <td style="text-align: right;"><b>Расчетная дата:</b> ${payDate}</td>
          </tr>
          <tr>
            <td><b>Подразделение:</b> ${employee.department?.dep_name || "N/A"}</td>
            <td style="text-align: right;"><b>Оклад/Тариф:</b> ${salary.basicSalary} руб.</td>
          </tr>
        </table>
  
        <br/>
  
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">
          <tr>
            <th colspan="3">Начисления</th>
            <th colspan="2">Удержания</th>
          </tr>
          <tr>
            <th>Вид начисления</th>
            <th>Сумма</th>
            <th>Дней / Часов</th>
            <th>Вид удержания</th>
            <th>Сумма</th>
          </tr>
          <tr>
            <td>Оклад</td>
            <td>${salary.basicSalary}</td>
            <td>—</td>
            <td>НДФЛ</td>
            <td>${salary.deductions}</td>
          </tr>
          <tr>
            <td>Премии</td>
            <td>${salary.allowances}</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><b>Начислено</b></td>
            <td colspan="2"><b>${salary.basicSalary + salary.allowances}</b></td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><b>Удержано</b></td>
            <td colspan="2"><b>${salary.deductions}</b></td>
          </tr>
        </table>
  
        <br/>
  
        <table style="width: 100%; margin-top: 10px;">
          <tr>
            <td><b>Полагается к выплате:</b> ${salary.netSalary.toFixed(2)} руб.</td>
          </tr>
          <tr>
            <td>Выплачено через кассу (банк): ${salary.netSalary.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Долг за предприятием (долг за работником): —</td>
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
  }, [startDate, endDate]); 

  return (
    <>
      {filteredSalaries === null ? (
        <div>Loading ...</div>
      ) : (
        <div className="overflow-x-auto p-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Salary History</h2>
          </div>
          <div className="flex justify-end my-3 gap-3">
            <input
              type="date"
              placeholder="Start Date"
              className="border px-2 rounded-md py-0.5 border-gray-300"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              placeholder="End Date"
              className="border px-2 rounded-md py-0.5 border-gray-300"
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              onClick={filterSalaries}
            >
              Filter
            </button>
          </div>

          {filteredSalaries.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                <tr>
                  <th className="px-6 py-3">SNO</th>
                  <th className="px-6 py-3">Emp ID</th>
                  <th className="px-6 py-3">Salary</th>
                  <th className="px-6 py-3">Allowance</th>
                  <th className="px-6 py-3">Deduction</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Pay Date</th>
                  <th className="px-6 py-3">Export</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary) => (
                  <tr
                    key={salary._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-3">{sno++}</td>
                    <td className="px-6 py-3">{salary.employeeId.employeeId}</td>
                    <td className="px-6 py-3">{salary.basicSalary}</td>
                    <td className="px-6 py-3">{salary.allowances}</td>
                    <td className="px-6 py-3">{salary.deductions}</td>
                    <td className="px-6 py-3">{salary.netSalary}</td>
                    <td className="px-6 py-3">
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
                        Экспорт в Word
                      </button>
                      <button
                       className={`px-4 py-1 rounded text-white ${
                        salary.netSalary > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
                      }`}
                        disabled={salary.netSalary <= 0}
                        onClick={() => exportLastSalary("pdf", salary)}
                      >
                        Экспорт в PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No Records</div>
          )}
        </div>
      )}
    </>
  );
};

export default View;
