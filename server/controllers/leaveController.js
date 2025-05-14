import Employee from '../models/Employee.js'
import Leave from '../models/Leave.js'
import Tesseract from 'tesseract.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Сотрудник не найден' });
    }

    let hasValidMedicalNote = false;
    let medicalNoteImage = null;

    if (leaveType === 'Sick Leave' && req.file) {
      // Сохраняем только имя файла
      medicalNoteImage = req.file.filename;

      const imagePath = path.join('uploads', req.file.filename); // путь для Tesseract

      try {
        const { data: { text } } = await Tesseract.recognize(imagePath, 'rus', {
          logger: m => console.log(m)
        });

        console.log('Распознанный текст:', text);

        const normalizedText = text.toLowerCase();
        const keywords = [
          'не обладает заболеваниями', 'может быть направлен', 'годен',
          'может работать', 'здоров', 'без ограничений', 'отсутствие противопоказаний',
          'состояние удовлетворительное', 'не имеет заболеваний', 'освобожден от работы',
          'не имеет медицинских противопоказаний', 'может работать без ограничений',
          'врач', 'пациент', 'справка', 'лечащий врач', 'медицинское учреждение'
        ];

        hasValidMedicalNote = keywords.some(keyword => normalizedText.includes(keyword));

        console.log(hasValidMedicalNote
          ? 'Справка признана действительной.'
          : 'Справка не действительна.');

      } catch (err) {
        console.error('Ошибка при анализе справки:', err.message);
      }

      // ❗️Не удаляем файл — он нужен для отображения по URL в getLeaveDetail
      // Если нужно: можно добавить логику очистки старых файлов отдельно
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
      hasValidMedicalNote,
      medicalNoteImage
    });

    await newLeave.save();

    return res.status(200).json({ success: true, leaveId: newLeave._id });
  } catch (error) {
    console.error('Ошибка создания отпуска:', error.message);
    return res.status(500).json({ success: false, error: 'Ошибка сервера при создании отпуска' });
  }
};
  

const getLeave = async (req, res) => {
    try {
        const {id, role} = req.params;
        let leaves
        if(role === "admin" || role === "leader") {
            leaves = await Leave.find({employeeId: id})
        } else {
            const employee = await Employee.findOne({userId: id})
            leaves = await Leave.find({employeeId: employee._id})
        }
        
        return res.status(200).json({success: true, leaves})
    } catch(error) {
        console.log(error.message)
        return res.status(500).json({success: false, error: "leave add .. server error"})
    }
}

const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate({
            path: 'employeeId',
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                },
                {
                    path: 'userId',
                    select: 'name'
                }
            ]
        })

        return res.status(200).json({success: true, leaves})
    } catch(error) {
        console.log("Eror: ", error.message)
        return res.status(500).json({success: false, error: "leave add server error"})
    }
}

const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id).populate({
      path: 'employeeId',
      populate: [
        {
          path: 'department',
          select: 'dep_name'
        },
        {
          path: 'userId',
          select: 'name profileImage'
        }
      ]
    });

    if (!leave) {
      return res.status(404).json({ success: false, error: 'Отпуск не найден' });
    }

    let isMedicalNoteValid = leave.hasValidMedicalNote;

   if (leave.leaveType === 'Sick Leave' && leave.medicalNoteImage) {
  // Получаем абсолютный путь до изображения
  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  const imagePath = path.join('uploads', leave.medicalNoteImage); // предполагается, что uploads лежит в корне проекта

  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'rus', {
      logger: m => console.log(m)
    });

    console.log("Распознанный текст:", text);

    const normalizedText = text.toLowerCase();
    const keywords = [
      'не обладает заболеваниями', 'может быть направлен', 'годен',
      'может работать', 'здоров', 'без ограничений', 'отсутствие противопоказаний',
      'состояние удовлетворительное', 'не имеет заболеваний', 'освобожден от работы',
      'не имеет медицинских противопоказаний', 'может работать без ограничений',
      'врач', 'пациент', 'справка', 'лечащий врач', 'медицинское учреждение'
    ];

    isMedicalNoteValid = keywords.some(keyword => normalizedText.includes(keyword));

    console.log(isMedicalNoteValid ? "Справка признана действительной." : "Справка не действительна.");
  } catch (err) {
    console.error('Ошибка при анализе справки:', err.message);
  }
}

    // Добавляем проверку и ссылку на фото
    const medicalNoteImageUrl = leave.medicalNoteImage
      ? `${req.protocol}://${req.get('host')}/${leave.medicalNoteImage}`
      : null;

    leave.hasValidMedicalNote = isMedicalNoteValid;

    return res.status(200).json({
      success: true,
      leave,
      medicalNoteImageUrl
    });
  } catch (error) {
    console.error('Ошибка получения деталей отпуска:', error.message);
    return res.status(500).json({ success: false, error: 'Ошибка сервера при получении деталей' });
  }
};


const updateLeave = async (req, res) => {
    try {
        const {id} = req.params;
        const leave = await Leave.findByIdAndUpdate({_id: id}, {status: req.body.status})
        if(!leave) {
        return res.status(404).json({success: false, error: "leave not founded"})
        }
        return res.status(200).json({success: true})
    } catch(error) {
        console.log(error.message)
        return res.status(500).json({success: false, error: "leave update server error"})
    }
}

export {addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave}