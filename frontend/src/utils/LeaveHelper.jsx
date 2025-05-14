import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const columns = [
  {
    name: "🔢", // Icon for Serial No.
    selector: (row) => row.sno,
    width: "70px",
    center: true,
  },
  {
    name: "🆔", // Icon for Card ID
    selector: (row) => row.employeeId,
    width: "110px",
    center: true,
  },
  {
    name: "👤", // Icon for Name
    selector: (row) => row.name,
    width: "120px",
    center: true,
  },
  {
    name: "🏷️", // Icon for Leave Type
    selector: (row) => row.leaveType,
    width: "140px",
    center: true,
  },
  {
    name: "🏢", // Icon for Department
    selector: (row) => row.department,
    width: "150px",
    center: true,
  },
  {
    name: "📅", // Icon for Days
    selector: (row) => row.days,
    width: "80px",
    center: true,
  },
  {
    name: "✔️", // Icon for Status
    selector: (row) => row.status,
    width: "100px",
    center: true,
  },
  {
    name: "⚙️", // Icon for Action (with buttons)
    selector: (row) => row.action,
    center: true,
    width: "120px", // You can adjust width if needed
  },
];

// Leave Buttons component (same as before, used in Action column)
export const LeaveButtons = ({ Id }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleView = (id) => {
    navigate(`/admin-dashboard/leaves/${id}`);
  };

  return (
    <button
      className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600"
      onClick={() => handleView(Id)}
    >
      {t('view')}
    </button>
  );
};
