import React from "react";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next"; // Импортируем хук для перевода

const generateExcelFromTableData = (data, fileName = "Отчет_по_департаментам", t) => {
  const formattedData = data.map((item) => ({
    [t('Department')]: item.department, // Используем перевод для колонок
    [t('Employees')]: item.employees,
    [t('Leaves')]: item.leaves,
    [t('Total Paid Salary($)')]: item.totalSalary,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, t('Comparison')); // Переводим название листа

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const ExportDepartmentTable = ({ data }) => {
  const { t } = useTranslation(); // Хук для перевода

  return (
    <button
    onClick={() => generateExcelFromTableData(data, "Отчет_по_департаментам", t)}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      {t('Export table to Excel')} 
    </button>
  );
};

export default ExportDepartmentTable;
