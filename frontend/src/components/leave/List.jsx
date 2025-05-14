import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion"; // ✅ Добавлено

const List = () => {
  const [leaves, setLeaves] = useState(null);
  let sno = 1;
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();

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
    return <div className="text-center text-gray-600">{t("loading")}</div>;
  }

  return (
    <div className="p-6">
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <h3 className="text-3xl font-semibold text-gray-800">{t("manageLeaves")}</h3>
        </div>

        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <input
            type="text"
            placeholder={t("searchByDepName")}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {user.role === "employee" && (
            <Link
              to="/employee-dashboard/add-leave"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 transition-colors text-white rounded-md"
            >
              {t("addNewLeave")}
            </Link>
          )}
        </div>

        <table className="w-full text-sm text-left text-gray-800">
          <thead className="bg-blue-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">{t("sno")}</th>
              <th className="px-4 py-3">{t("leaveType")}</th>
              <th className="px-4 py-3">{t("from")}</th>
              <th className="px-4 py-3">{t("to")}</th>
              <th className="px-4 py-3">{t("description")}</th>
              <th className="px-4 py-3">{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, index) => (
              <tr
                key={leave._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3">{sno++}</td>
                <td className="px-4 py-3">{leave.leaveType}</td>
                <td className="px-4 py-3">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">{leave.reason}</td>
                <td className="px-4 py-3">{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default List;
