import axios from "axios";
import React, { useEffect, useState } from "react";
import ExportCSV from "../exportData/export";

const SalaryReport = () => {
  const [report, setReport] = useState({});
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [dateFilter, setDateFilter] = useState();
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ limit, skip });
      if (dateFilter) {
        query.append("payDate", dateFilter);
      }
      const responnse = await axios.get(
        `http://localhost:5000/api/salary/report?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (responnse.data.success) {
        if (skip === 0) {
          setReport(responnse.data.groupData);
        } else {
          setReport((prevData) => ({
            ...prevData,
            ...responnse.data.groupData,
          }));
        }
      }
      setLoading(false);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [skip, dateFilter]);

  const handleLoadmore = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">💼 Salary Report</h2>
        <ExportCSV reportData={report} fileName="Salary_Report" />
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-lg font-medium text-gray-700">📅 Filter by Pay Date:</label>
        <input
          type="date"
          className="border p-2 rounded bg-white shadow"
          onChange={(e) => {
            setDateFilter(e.target.value);
            setSkip(0);
          }}
        />
      </div>

      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading...</div>
      ) : (
        Object.entries(report).map(([date, record]) => (
          <div key={date} className="bg-white shadow-md rounded-lg mb-8 p-6 border">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">📆 {date}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm border-collapse">
                <thead className="bg-teal-600 text-white">
                  <tr>
                    <th className="p-2 border">S No</th>
                    <th className="p-2 border">Card ID</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Department</th>
                    <th className="p-2 border">Basic Salary</th>
                    <th className="p-2 border">Allowances</th>
                    <th className="p-2 border">Deductions</th>
                    <th className="p-2 border">Net Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {record.map((data, i) => (
                    <tr key={`${data.employeeId}-${i}`} className="hover:bg-gray-50">
                      <td className="p-2 border">{i + 1}</td>
                      <td className="p-2 border">{data.employeeId}</td>
                      <td className="p-2 border">{data.employeeName}</td>
                      <td className="p-2 border">{data.departmentName}</td>
                      <td className="p-2 border">{data.basicSalary}</td>
                      <td className="p-2 border">{data.allowances}</td>
                      <td className="p-2 border">{data.deductions}</td>
                      <td className="p-2 border font-semibold">{data.netSalary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      <div className="text-center mt-6">
        <button
          className="px-6 py-2 bg-teal-600 text-white font-medium rounded hover:bg-teal-700 shadow"
          onClick={handleLoadmore}
        >
          ⬇️ Load More
        </button>
      </div>
    </div>
  );
};

export default SalaryReport;
