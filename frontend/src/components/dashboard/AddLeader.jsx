import React, { useState } from "react";
import axios from "axios";

const AddLeader = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/leaders", formData);
      alert("Руководитель добавлен");
    } catch (err) {
      console.error(err);
      alert("Ошибка при добавлении");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Добавить руководителя</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="ФИО"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default AddLeader;
