// components/exportData/ExportDepartmentTable.jsx
import React from "react";
import * as XLSX from "xlsx";

const generateExcelFromTableData = (data, fileName = "Отчет_по_департаментам") => {
  const formattedData = data.map((item) => ({
    "Департамент": item.department,
    "Сотрудники": item.employees,
    "Отпуска": item.leaves,
    "Общая выплаченная зарплата($)": item.totalSalary,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Сравнение");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const ExportDepartmentTable = ({ data }) => {
  return (
    <button
      onClick={() => generateExcelFromTableData(data)}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Экспорт таблицы в Excel
    </button>
  );
};

export default ExportDepartmentTable;
