import axios from "axios";
import React from "react";
import { useTranslation } from "react-i18next"; // <-- adding translator

export const columns = [
  {
    name: "#️⃣",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "👤",
    selector: (row) => row.name,
    sortable: true,
    width: "100px",
  },
  {
    name: "🆔",
    selector: (row) => row.employeeId,
    sortable: true,
    width: "100px",
  },
  {
    name: "🏢",
    selector: (row) => row.department,
    width: "120px",
  },
  {
    name: "⚙️",
    selector: (row) => row.action,
    center: "true",
  },
];

export const AttendanceHelper = ({ status, employeeId, statusChange }) => {
  const { t } = useTranslation(); // Initialize translation

  const markEmployee = async (status, employeeId) => {
    const response = await axios.put(
      `http://localhost:5000/api/attendance/update/${employeeId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data.success) {
      statusChange();
    }
  };

  return (
    <div>
      {status == null ? (
        <div className="flex space-x-8">
          <button
            className="px-4 py-2 bg-green-500 text-white"
            onClick={() => markEmployee("present", employeeId)}
          >
            {t("Present")}
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white"
            onClick={() => markEmployee("absent", employeeId)}
          >
            {t("Absent")}
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white"
            onClick={() => markEmployee("sick", employeeId)}
          >
            {t("Sick")}
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-black"
            onClick={() => markEmployee("leave", employeeId)}
          >
            {t("Leave")}
          </button>
        </div>
      ) : (
        <p className="bg-gray-100 w-20 text-center py-2 rounded">{status}</p>
      )}
    </div>
  );
};

export const DepartmentButtons = ({ Id, onDepartmentDelete }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(t("Do you want to delete?"));
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          onDepartmentDelete();
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error || t("An error occurred"));
        }
      }
    }
  };

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`/admin-dashboard/department/${Id}`)}
      >
        {t("Edit")}
      </button>
      <button
        className="px-3 py-1 bg-red-600 text-white"
        onClick={() => handleDelete(Id)}
      >
        {t("Delete")}
      </button>
    </div>
  );
};
