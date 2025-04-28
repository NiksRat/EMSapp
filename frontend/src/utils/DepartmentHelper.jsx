import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- добавляем переводчик

export const columns = [
  {
    name: "#️⃣",
    selector: (row) => row.sno,
  },
  {
    name: "🏢",
    selector: (row) => row.dep_name,
    sortable: true
  },
  {
    name: "⚙️",
    selector: (row) => row.action,
  },
];

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
