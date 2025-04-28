import React, { useEffect, useState } from "react";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // импорт для перевода

const Add = () => {
  const { t } = useTranslation(); // доступ к переведенным строкам
  const [salary, setSalary] = useState({
    employeeId: null,
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: null,
  });
  const [departments, setDepartments] = useState(null);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  const handleDepartment = async (e) => {
    const emps = await getEmployees(e.target.value);
    setEmployees(emps);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/api/salary/add`,
        salary,
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
    <>
      {departments ? (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-6">{t('addSalary')}</h2> {/* Перевод заголовка */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('department')} {/* Перевод */}
                </label>
                <select
                  name="department"
                  onChange={handleDepartment}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">{t('selectDepartment')}</option> {/* Перевод для "Выберите департамент" */}
                  {departments.map((dep) => (
                    <option key={dep._id} value={dep._id}>
                      {dep.dep_name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Employee */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('employee')} {/* Перевод */}
                </label>
                <select
                  name="employeeId"
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">{t('selectEmployee')}</option> {/* Перевод для "Выберите сотрудника" */}
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.userId?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('basicSalary')} {/* Перевод */}
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  min="0"
                  onChange={handleChange}
                  placeholder={t('basicSalary')}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('allowances')} {/* Перевод */}
                </label>
                <input
                  type="number"
                  name="allowances"
                  min="0"
                  onChange={handleChange}
                  placeholder={t('allowances')}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('deductions')} {/* Перевод */}
                </label>
                <input
                  type="number"
                  name="deductions"
                  min="0"
                  onChange={handleChange}
                  placeholder={t('deductions')}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('payDate')} {/* Перевод */}
                </label>
                <input
                  type="date"
                  name="payDate"
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            >
              {t('addSalary')} {/* Перевод кнопки */}
            </button>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Add;
