import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Detail = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const [medicalNoteImageUrl, setMedicalNoteImageUrl] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/leave/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          console.log(response.data.leave);
          setLeave(response.data.leave);
          setMedicalNoteImageUrl(response.data.medicalNoteImageUrl); // ⬅️ Сохраняем ссылку на изображение справки
        }
      } catch (error) {
        console.error("Ошибка загрузки:", error);
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };

    fetchLeave();
  }, [id]);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/leave/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/leaves");
      }
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  if (!leave) {
    return <div className="text-center mt-10">{t("loading")}</div>;
  }

  const {
    employeeId: { userId, employeeId, department },
    leaveType,
    reason,
    startDate,
    endDate,
    status,
    hasValidMedicalNote,
  } = leave;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center">{t("leaveDetails")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Фото сотрудника */}
        <div className="flex justify-center">
          <img
            src={`http://localhost:5000/${userId.profileImage}`}
            alt="Фото сотрудника"
            className="rounded-full border w-64 h-64 object-cover"
          />
        </div>

        {/* Информация */}
        <div className="space-y-3 text-base">
          <p><strong>{t("name")}:</strong> {userId.name}</p>
          <p><strong>{t("employeeId")}:</strong> {employeeId}</p>
          <p><strong>{t("department")}:</strong> {department?.dep_name}</p>
          <p><strong>{t("leaveType")}:</strong> {leaveType}</p>
          <p><strong>{t("reason")}:</strong> {reason}</p>
          <p><strong>{t("startDate")}:</strong> {new Date(startDate).toLocaleDateString()}</p>
          <p><strong>{t("endDate")}:</strong> {new Date(endDate).toLocaleDateString()}</p>

          {/* Статус мед. справки */}
          {leaveType === "Sick Leave" && (
            <p>
              <strong>{t("medicalNoteStatus")}:</strong>{" "}
              {hasValidMedicalNote ? (
                <span className="text-green-600 font-semibold">{t("present")}</span>
              ) : (
                <span className="text-red-600 font-semibold">{t("absent")}</span>
              )}
            </p>
          )}

          {/* Изображение мед. справки */}
          {leaveType === "Sick Leave" && medicalNoteImageUrl && (
            <div className="mt-4">
              <p className="font-bold">{t("medicalNoteImage")}:</p>
              <img
                src={medicalNoteImageUrl}
                alt="Медицинская справка"
                className="mt-2 border rounded shadow max-w-full max-h-96"
              />
              <a
                href={medicalNoteImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 block"
              >
                {t("viewFullImage")}
              </a>
            </div>
          )}

          {/* Кнопки подтверждения */}
          <div>
            <p className="font-bold">
              {status === "Pending" ? t("action") : t("status")}:
            </p>
            {status === "Pending" ? (
              <div className="flex space-x-3 mt-2">
                <button
                  className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => changeStatus(leave._id, "Approved")}
                >
                  {t("approve")}
                </button>
                <button
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => changeStatus(leave._id, "Rejected")}
                >
                  {t("reject")}
                </button>
              </div>
            ) : (
              <span className="text-blue-600 font-medium">{t(status.toLowerCase())}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
