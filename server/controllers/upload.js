import multer from 'multer'
import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import fs from 'fs';
import Leave from '../models/Leave.js';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

export const upload = multer({ storage })

export const analyzeMedicalNote = async (req, res) => {
  const imagePath = req.file?.path;

  if (!imagePath) {
    return res.status(400).json({ error: 'Файл не был загружен' });
  }

  try {
    const result = await Tesseract.recognize(imagePath, 'rus+eng', {
      logger: m => console.log(m),
    });

    const extractedText = result.data.text.toLowerCase();

    const hasValidMedicalNote =
      extractedText.includes('медицинская справка') ||
      extractedText.includes('справка') ||
      extractedText.includes('лечащий врач') ||
      extractedText.includes('временно нетрудоспособен') ||
      extractedText.includes('врач') ||
      extractedText.includes('медицинское учреждение') ||
      extractedText.includes('больничный');

    // Примитивная проверка "печати" — как яркое круглое пятно (можно заменить на ML/обнаружение кругов)
    const imageBuffer = fs.readFileSync(imagePath);
    const image = await sharp(imageBuffer).greyscale().toBuffer();
    const metadata = await sharp(image).metadata();
    const hasStamp = metadata.height > 100 && metadata.width > 100; // Заглушка, замените на реальную проверку

    const { leaveId } = req.body;
    if (leaveId) {
      await Leave.findByIdAndUpdate(leaveId, {
        hasValidMedicalNote: hasValidMedicalNote && hasStamp,
        medicalNoteImage: imagePath.replace('uploads/', ''), // сохраним путь
      });
      console.log(`Поле hasValidMedicalNote обновлено в Leave ${leaveId}`);
    }

    res.status(200).json({
      hasValidMedicalNote: hasValidMedicalNote & hasStamp,
      extractedText,
      hasStamp,
    });
  } catch (error) {
    console.error('Ошибка анализа изображения:', error);
    res.status(500).json({ error: 'Ошибка при анализе изображения' });
  }
};
