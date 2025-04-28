import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "react-i18next"; // Import useTranslation

const List = () => {
  const [leaves, setLeaves] = useState(null);
  let sno = 1;
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation(); // Initialize the translation hook

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/leave/${id}/${user.role}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setLeaves(response.data.leaves);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (!leaves) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">{t("manageLeaves")}</h3>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder={t("searchByDepName")}
          className="px-4 py-0.5 border"
        />
        {user.role === "employee" && (
          <Link
            to="/employee-dashboard/add-leave"
            className="px-4 py-1 bg-teal-600 rounded text-white"
          >
            {t("addNewLeave")}
          </Link>
        )}
      </div>

      <table className="w-full text-sm text-left text-gray-500 mt-6">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
          <tr>
            <th className="px-6 py-3">{t("sno")}</th>
            <th className="px-6 py-3">{t("leaveType")}</th>
            <th className="px-6 py-3">{t("from")}</th>
            <th className="px-6 py-3">{t("to")}</th>
            <th className="px-6 py-3">{t("description")}</th>
            <th className="px-6 py-3">{t("status")}</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr
              key={leave._id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-3">{sno++}</td>
              <td className="px-6 py-3">{leave.leaveType}</td>
              <td className="px-6 py-3">
                {new Date(leave.startDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-3">
                {new Date(leave.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-3">{leave.reason}</td>
              <td className="px-6 py-3">{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
