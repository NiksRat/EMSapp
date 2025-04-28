import { useTranslation } from "react-i18next";
import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t, i18n } = useTranslation(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);

        const role = response.data.user.role;
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "leader") {
          navigate("/leader-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error);
      } else {
        setError("Server Error");
      }
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ru" : "en";
    localStorage.setItem('appLanguage', newLang); // Сохраняем язык в localStorage
    i18n.changeLanguage(newLang); // Меняем язык в i18n
  };

  return (
    <div
      className="flex flex-col items-center h-screen justify-center 
    bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6"
    >
      <h2 className="font-pacific text-3xl text-white">
        {t('login')}
      </h2>

      {/* Кнопка смены языка */}
      <button 
        onClick={toggleLanguage} 
        className="absolute top-5 right-5 bg-white text-teal-600 px-4 py-2 rounded shadow"
      >
        {i18n.language === "en" ? "Русский" : "English"}
      </button>

      <div className="border shadow p-6 w-80 bg-white">
        <h2 className="text-2xl font-bold mb-4">{t('login')}</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              {t('email')}
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border"
              placeholder={t('email')}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              {t('password')}
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border"
              placeholder="*****"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-gray-700">{t('remember')}</span>
            </label>
            <a href="#" className="text-teal-600">
              {t('forgot')}
            </a>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 "
            >
              {t('login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
