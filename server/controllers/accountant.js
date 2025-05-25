import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";
import Salary from "../models/Salary.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ➕ Добавить бухгалтера
const addAccountant = async (req, res) => {
  try {
    const {
      name,
      email,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
    } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role: "accountant",
      profileImage: req.file ? req.file.filename : "",
    });

    const savedUser = await newUser.save();

    // 🔢 Генерация accountantId (по схеме employeeId)
    let latestAccountant = await Employee.findOne().sort({ createdAt: -1 });
    let newIdNumber = 1;
    if (latestAccountant) {
      const match = latestAccountant.employeeId.match(/\d+$/);
      if (match) {
        newIdNumber = parseInt(match[0]) + 1;
      }
    }
    const accountantId = `ACC${String(newIdNumber).padStart(4, '0')}`;

    const newAccountant = new Employee({
      userId: savedUser._id,
      employeeId: accountantId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    await newAccountant.save();

    return res.status(200).json({ success: true, message: "Accountant created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error in adding accountant" });
  }
};

// 🔍 Получить всех бухгалтеров
const getAccountants = async (req, res) => {
  try {
    const accountants = await Employee.find()
      .populate({
        path: "userId",
        match: { role: "accountant" },
        select: "-password",
      })
      .populate("department");

    const filtered = accountants.filter(a => a.userId !== null);
    return res.status(200).json({ success: true, accountants: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get accountants server error" });
  }
};

const getAccountantSummary = async (req, res) => {
   try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();

    const totalSalaries = await Salary.aggregate([
      { $group: { _id: null, totalSalary: { $sum: "$netSalary" } } }
    ]);

const averageSalaryByDepartment = await Employee.aggregate([
  {
    $lookup: {
      from: "salaries",
      localField: "_id",
      foreignField: "employeeId",
      as: "salaryData"
    }
  },
  { $unwind: "$salaryData" },
  {
    $group: {
      _id: "$department",
      averageSalary: { $avg: "$salaryData.netSalary" }
    }
  },
  {
    $lookup: {
      from: "departments",
      localField: "_id",
      foreignField: "_id",
      as: "departmentInfo"
    }
  },
  { $unwind: "$departmentInfo" },
  {
    $project: {
      _id: 0,
      department: "$departmentInfo.dep_name", // <== исправлено здесь
      averageSalary: 1
    }
  }
]);

    const employeeAppliedForLeave = await Leave.distinct('employeeId');

    const leaveStatus = await Leave.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const leaveSummary = {
      appliedFor: employeeAppliedForLeave.length,
      approved: leaveStatus.find(item => item._id === "Approved")?.count || 0,
      rejected: leaveStatus.find(item => item._id === "Rejected")?.count || 0,
      pending: leaveStatus.find(item => item._id === "Pending")?.count || 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalDepartments,
        totalSalary: totalSalaries[0]?.totalSalary || 0,
        averageSalaryByDepartment,
        leaveSummary,
      }
    });

  } catch (error) {
    console.error("Leader summary error:", error.message);
    return res.status(500).json({ success: false, error: "leader summary error" });
  }
};

const getSalarySummary = async (req, res) => {
  try {
    const departments = await Department.find();

    const data = await Promise.all(departments.map(async (dept) => {
      const employees = await Employee.find({ department: dept._id });
      const employeeIds = employees.map(emp => emp._id);

      const salaries = await Salary.find({ employee: { $in: employeeIds } });
      const totalSalary = salaries.reduce((sum, salary) => sum + (salary.amount || 0), 0);

      const leaves = await Leave.find({ employee: { $in: employeeIds } });

      return {
        department: dept.name,
        employees: employees.length,
        leaves: leaves.length,
        totalSalary
      };
    }));

    res.status(200).json({ data });
  } catch (err) {
    console.error("Error getting salary summary:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export { addAccountant, upload, getAccountants, getAccountantSummary, getSalarySummary };
