import Employee from './models/Employee.js';
import Attendance from './models/Attendance.js';
import connectToDatabase from './db/db.js';

const addAttendance = async () => {
  await connectToDatabase();

  try {
    // Находим сотрудника для добавления посещаемости
    const employee = await Employee.findOne();
    if (!employee) {
      console.log("❌ No employee found. Please add an employee first.");
      return;
    }

    // Добавляем запись посещаемости
    const today = new Date().toISOString().split("T")[0];

    const existing = await Attendance.findOne({ employeeId: employee._id, date: today });
    if (existing) {
      console.log("⚠️ Attendance already exists for this employee today.");
      return;
    }

    const newAttendance = new Attendance({
      date: today,
      employeeId: employee._id,
      status: "Present" // Можно изменить на "Absent", "Sick", "Leave", в зависимости от ситуации
    });

    await newAttendance.save();
    console.log("✅ Attendance saved for:", employee.name);

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

addAttendance();
