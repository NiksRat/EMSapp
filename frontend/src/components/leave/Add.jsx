import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Add = () => {
  const { user } = useAuth();
  const { t } = useTranslation(); // Initialize the translation hook

  const [leave, setLeave] = useState({
    userId: user._id,
    startDate: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLeave((prevState) => {
      const updatedLeave = { ...prevState, [name]: value };

      if (name === "startDate" && updatedLeave.endDate) {
        if (value >= updatedLeave.endDate) {
          updatedLeave.endDate = "";
        }
      }

      return updatedLeave;
    });
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (leave.startDate === leave.endDate) {
      return alert(t("startDateEndDateError")); // Use translation for the error message
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/leave/add`,
        leave,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate(`/employee-dashboard/leaves/${user._id}`);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">{t("requestLeaveTitle")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("leaveType")}
            </label>
            <select
              name="leaveType"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">{t("selectDepartment")}</option>
              <option value="Sick Leave">{t("sickLeave")}</option>
              <option value="Casual Leave">{t("casualLeave")}</option>
              <option value="Annual Leave">{t("annualLeave")}</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("fromDate")}
              </label>
              <input
                type="date"
                name="startDate"
                min={today}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t("toDate")}
              </label>
              <input
                type="date"
                name="endDate"
                min={leave.startDate || today}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("description")}
            </label>
            <textarea
              name="reason"
              placeholder={t("reasonPlaceholder")}
              onChange={handleChange}
              className="w-full border border-gray-300"
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          {t("addLeaveButton")}
        </button>
      </form>
    </div>
  );
};

export default Add;
