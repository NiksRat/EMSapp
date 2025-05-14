import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Tesseract from "tesseract.js"; 
import { useEffect } from "react";

const Add = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [leave, setLeave] = useState({
    userId: user._id,
    startDate: "",
    leaveType: "",
    hasValidMedicalNote: false,
  });

  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [noteCheckDone, setNoteCheckDone] = useState(false);

  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "leaveType" && value !== "Sick Leave" ? { hasValidMedicalNote: false } : {}),
    }));
    if (name === "startDate" && leave.endDate && value >= leave.endDate) {
      setLeave((prev) => ({ ...prev, endDate: "" }));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setNoteCheckDone(false);
  };

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("image", image);
  
    try {
      const response = await axios.post("http://localhost:5000/api/leave/ai/analyze-medical-note", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const hasMedicalNote = response.data.hasValidMedicalNote;
  
      if (hasMedicalNote) {
        setLeave(prev => ({ ...prev, hasValidMedicalNote: true }));
      } else {
        setLeave(prev => ({ ...prev, hasValidMedicalNote: false }));
        setImage(null);  // ❗ Удаляем фото, если справка недействительна
        alert(t("invalidMedicalNote"));  // Или можно отобразить сообщение
      }
  
      setNoteCheckDone(true);
    } catch (error) {
      console.error("Ошибка при анализе:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (leave.startDate === leave.endDate) {
    return alert(t("startDateEndDateError"));
  }

  if (leave.leaveType === "Sick Leave") {
    if (!image) {
      return alert(t("uploadRequired"));
    }
    if (!leave.hasValidMedicalNote) {
      return alert(t("invalidMedicalNote"));
    }
  }

  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("userId", leave.userId);
    formData.append("startDate", leave.startDate);
    formData.append("endDate", leave.endDate);
    formData.append("leaveType", leave.leaveType);
    formData.append("reason", leave.reason || "");
    formData.append("hasValidMedicalNote", leave.hasValidMedicalNote);

    const res = await axios.post("http://localhost:5000/api/leave/add", formData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      navigate(`/employee-dashboard/leaves/${user._id}`);
    }
  } catch (err) {
    alert(err.response?.data?.error || "Error");
  }
};

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">{t("requestLeaveTitle")}</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("leaveType")}
            </label>
            <select
              name="leaveType"
              value={leave.leaveType}
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

          {/* Upload if Sick Leave */}
          {leave.leaveType === "Sick Leave" && (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">
      {t("uploadMedicalNote")}
    </label>

    <div className="flex items-center justify-between mt-2 space-x-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        value={image ? undefined : ""}
        className="flex-1"
        required
      />

      <button
        type="button"
        disabled={!image || isAnalyzing}
        onClick={analyzeImage}
        className="bg-blue-500 text-white px-4 py-2 rounded whitespace-nowrap"
      >
        {isAnalyzing ? t("analyzing") : t("analyzeNote")}
      </button>
    </div>

    {noteCheckDone && (
      <p className={`text-sm mt-1 ${leave.hasValidMedicalNote ? 'text-green-600' : 'text-red-600'}`}>
        {leave.hasValidMedicalNote ? t("validMedicalNote") : t("invalidMedicalNote")}
      </p>
    )}
  </div>
)}


          {/* Dates & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("fromDate")}</label>
              <input
                type="date"
                name="startDate"
                min={today}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("toDate")}</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("description")}</label>
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

