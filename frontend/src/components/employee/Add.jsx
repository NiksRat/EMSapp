import React, { useEffect, useState } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const Add = () => {
  const [departments, setDepartments] = useState([]);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate()

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData()
    Object.keys(formData).forEach((key) => {
        formDataObj.append(key, formData[key])
    })

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employee/add",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
      
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">{t('Add New Employee')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Name')}
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder={t('Insert Name')}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Email')}
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder={t('Insert Email')}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Employee ID')}
            </label>
            <input
              type="text"
              name="employeeId"
              onChange={handleChange}
              placeholder={t('Employee ID')}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Date of Birth')}
            </label>
            <input
              type="date"
              name="dob"
              onChange={handleChange}
              placeholder={t('DOB')}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Gender')}
            </label>
            <select
              name="gender"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">{t('Select Gender')}</option>
              <option value="male">{t('Male')}</option>
              <option value="female">{t('Female')}</option>
              <option value="other">{t('Other')}</option>
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Marital Status')}
            </label>
            <select
              name="maritalStatus"
              onChange={handleChange}
              placeholder={t('Marital Status')}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">{t('Select Status')}</option>
              <option value="single">{t('Single')}</option>
              <option value="married">{t('Married')}</option>
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Designation')}
            </label>
            <input
              type="text"
              name="designation"
              onChange={handleChange}
              placeholder={t('Designation')}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Department')}
            </label>
            <select
              name="department"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">{t('Select Department')}</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Salary')}
            </label>
            <input
              type="number"
              name="salary"
              onChange={handleChange}
              placeholder={t('Salary')}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Password')}
            </label>
            <input
              type="password"
              name="password"
              placeholder="******"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Role')}
            </label>
            <select
              name="role"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">{t('Select Role')}</option>
              <option value="admin">{t('Admin')}</option>
              <option value="employee">{t('Employee')}</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Upload Image')}
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              placeholder={t('Upload Image')}
              accept="image/*"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          {t('Add Employee')}
        </button>
      </form>
    </div>
  );
};

export default Add;
