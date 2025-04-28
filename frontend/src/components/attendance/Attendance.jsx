import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columns, AttendanceHelper } from "../../utils/AttendanceHelper";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useTranslation } from "react-i18next"; // добавили перевод

const Attendance = () => {
  const { t, i18n } = useTranslation(); // подключаем переводчик
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredAttendance, setFilterAttendance] = useState(null);

  const statusChange = () => {
    fetchAttendance();
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/attendance", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        let sno = 1;
        const data = response.data.attendance.map((att) => ({
          employeeId: att.employeeId.employeeId,
          sno: sno++,
          department: att.employeeId.department.dep_name,
          name: att.employeeId.userId.name,
          action: <AttendanceHelper status={att.status} employeeId={att.employeeId.employeeId} statusChange={statusChange} />,
        }));
        setAttendance(data);
        setFilterAttendance(data);
      }
    } catch (error) {
      console.log(error.message);
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error || t("An error occurred"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleFilter = (e) => {
    const records = attendance.filter((emp) =>
      emp.employeeId.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilterAttendance(records);
  };

  if (!filteredAttendance) {
    return <div>{t("Loading")}...</div>;
  }

  const formattedDate = new Date().toLocaleDateString(i18n.language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">{t("Manage Attendance")}</h3>
      </div>
      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder={t("Search By Card ID")}
          className="px-4 py-0.5 border"
          onChange={handleFilter}
        />
        <p className="text-2xl font-medium">
          {t("Mark Employees for")}{" "}
          <span className="font-semibold text-teal-600">{formattedDate}</span>
        </p>
        <Link
          to="/admin-dashboard/attendance-report"
          className="px-4 py-1 bg-teal-600 rounded text-white"
        >
          {t("Attendance Report")}
        </Link>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={filteredAttendance} pagination />
      </div>
    </div>
  );
};

export default Attendance;
