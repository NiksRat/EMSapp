import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SalarySlip = () => {
  const { id } = useParams(); // Получаем id сотрудника из URL
  const [salarySlip, setSalarySlip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalarySlip = async () => {
      try {
        console.log('Fetching salary slip for employeeId:', id); // Логирование id
        const response = await axios.get(`/api/salary-slip/${id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }, // Токен авторизации
        });

        console.log('Response:', response.data); // Логирование ответа от сервера

        if (response.data.success) {
          setSalarySlip(response.data.salarySlip); // Устанавливаем данные расчетного листка
        } else {
          setError('Не удалось получить расчетный листок');
        }
      } catch (err) {
        console.error('Error fetching salary slip:', err); // Логируем ошибку
        setError('Ошибка при загрузке расчетного листка');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSalarySlip(); // Загружаем данные расчетного листка при изменении id
    }
  }, [id]); // Перезапускаем запрос при изменении id

  // Если данные все еще загружаются
  if (loading) return <div className="text-center">Загрузка...</div>;

  // Если произошла ошибка
  if (error) return <div className="text-center text-red-500">{error}</div>;

  // Если расчетный листок не был найден
  if (!salarySlip) return <div className="text-center">Расчетный листок не найден</div>;

  // Проверка на наличие всех данных для безопасного рендеринга
  if (!salarySlip.name || !salarySlip.position) {
    return <div className="text-center">Некоторые данные расчетного листка отсутствуют</div>;
  }

  // Рендерим данные расчетного листка
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-8 text-center">Расчетный листок для {salarySlip.name}</h1>
      <div className="space-y-4">
        <p><strong>Должность:</strong> {salarySlip.position}</p>
        <p><strong>Отдел:</strong> {salarySlip.department}</p>
        <p><strong>Основная зарплата:</strong> {salarySlip.baseSalary}</p>
        <p><strong>Доплаты:</strong> {salarySlip.allowances}</p>
        <p><strong>Удержания:</strong> {salarySlip.deductions}</p>
        <p><strong>Чистая зарплата:</strong> {salarySlip.netSalary}</p>
        <p><strong>Дата выплаты:</strong> {new Date(salarySlip.payDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default SalarySlip;
