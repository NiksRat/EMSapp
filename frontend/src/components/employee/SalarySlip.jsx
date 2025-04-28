import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SalarySlip = () => {
  const { id } = useParams(); // Получаем id сотрудника из URL
  const { t } = useTranslation(); // Получаем функцию для перевода
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
          setError(t('salarySlipError')); // Используем перевод для ошибки
        }
      } catch (err) {
        console.error('Error fetching salary slip:', err); // Логируем ошибку
        setError(t('salarySlipFetchError')); // Используем перевод для ошибки
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSalarySlip(); // Загружаем данные расчетного листка при изменении id
    }
  }, [id, t]); // Добавляем t как зависимость

  // Если данные все еще загружаются
  if (loading) return <div className="text-center">{t('loading')}</div>;

  // Если произошла ошибка
  if (error) return <div className="text-center text-red-500">{error}</div>;

  // Если расчетный листок не был найден
  if (!salarySlip) return <div className="text-center">{t('salarySlipNotFound')}</div>;

  // Проверка на наличие всех данных для безопасного рендеринга
  if (!salarySlip.name || !salarySlip.position) {
    return <div className="text-center">{t('missingData')}</div>;
  }

  // Рендерим данные расчетного листка
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-8 text-center">
        {t('salarySlipFor')} {salarySlip.name}
      </h1>
      <div className="space-y-4">
        <p><strong>{t('position')}:</strong> {salarySlip.position}</p>
        <p><strong>{t('department')}:</strong> {salarySlip.department}</p>
        <p><strong>{t('baseSalary')}:</strong> {salarySlip.baseSalary}</p>
        <p><strong>{t('allowances')}:</strong> {salarySlip.allowances}</p>
        <p><strong>{t('deductions')}:</strong> {salarySlip.deductions}</p>
        <p><strong>{t('netSalary')}:</strong> {salarySlip.netSalary}</p>
        <p><strong>{t('payDate')}:</strong> {new Date(salarySlip.payDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default SalarySlip;
