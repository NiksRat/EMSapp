import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useTranslation } from "react-i18next";


export const columns = [
  {
    name: "#️⃣",  // Номер
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "👤",  // Имя
    selector: (row) => row.name,
    sortable: true,
    width: "100px",
  },
  {
    name: "🖼️",  // Фото
    selector: (row) => row.profileImage,
    width: "90px",
  },
  {
    name: "🏢",  // Отдел
    selector: (row) => row.dep_name,
    width: "120px",
  },
  {
    name: "🎂",  // Дата рождения
    selector: (row) => row.dob,
    sortable: true,
    width: "130px",
  },
  {
    name: "⚙️",  // Действия
    selector: (row) => row.action,
    center: true,
  },
];


export const fetchDepartments = async () => {
  let departments;
  try {
    const responnse = await axios.get("http://localhost:5000/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (responnse.data.success) {
      departments = responnse.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return departments;
};

// employees for salary form
export const getEmployees = async (id) => {
  let employees;
  try {
    const responnse = await axios.get(
      `http://localhost:5000/api/employee/department/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(responnse);
    if (responnse.data.success) {
      employees = responnse.data.employees;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return employees;
};

export const EmployeeButtons = ({ Id }) => {
  const navigate = useNavigate();
  const { user } = useAuth();  // Get current user (assumes role is available)
  const { t } = useTranslation();  // Translation hook

  // Base path depends on the role
  let basePath;

  if (user?.role === "admin") basePath = "/admin-dashboard";
  else if (user?.role === "leader") basePath = "/leader-dashboard";
  else if (user?.role === "accountant") basePath = "/accountant-dashboard";

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`${basePath}/employees/${Id}`)}
      >
        {t("view")}
      </button>
      <button
        className="px-3 py-1 bg-blue-600 text-white"
        onClick={() => navigate(`${basePath}/employees/edit/${Id}`)}
      >
        {t("edit")}
      </button>
      <button
        className="px-3 py-1 bg-yellow-600 text-white"
        onClick={() => navigate(`${basePath}/employees/salary/${Id}`)}
      >
        {t("salary")}
      </button>
      <button
        className="px-3 py-1 bg-red-600 text-white"
        onClick={() => navigate(`${basePath}/employees/leaves/${Id}`)}
      >
        {t("leave")}
      </button>
    </div>
  );
};
