import multer from "multer";
import Employee from "../models/Employee.js";
import Salary from "../models/Salary.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import path from "path";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";
import Attendance from "../models/Attendance.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {
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
      role,
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
      role,
      profileImage: req.file ? req.file.filename : "",
    });
    const savedUser = await newUser.save();

    // 🔽 Генерация уникального employeeId
    let latestEmployee = await Employee.findOne().sort({ createdAt: -1 });
    let newIdNumber = 1;
    if (latestEmployee) {
      const match = latestEmployee.employeeId.match(/\d+$/);
      if (match) {
        newIdNumber = parseInt(match[0]) + 1;
      }
    }
    const employeeId = `EMP${String(newIdNumber).padStart(4, '0')}`;

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    await newEmployee.save();
    return res.status(200).json({ success: true, message: "Employee created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server error in adding employee" });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employees server error" });
  }
};

const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee;
    employee = await Employee.findById({ _id: id })
      .populate("userId", { password: 0 })
      .populate("department");
      if(!employee) {
        employee = await Employee.findOne({ userId: id })
      .populate("userId", { password: 0 })
      .populate("department");
      }
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employees server error" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalStatus, designation, department, salary } = req.body;

    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "employee not found" });
    }
    const user = await User.findById({_id: employee.userId})

    if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "user not found" });
      }

      const updateUser = await User.findByIdAndUpdate({_id: employee.userId}, {name})
      const updateEmployee = await Employee.findByIdAndUpdate({_id: id}, {
        maritalStatus,
        designation, salary, department
      })

      if(!updateEmployee || !updateUser) {
        return res
          .status(404)
          .json({ success: false, error: "document not found" });
      }

      return res.status(200).json({success: true, message: "employee update"})

  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "update employees server error" });
  }
};

const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id })
    .populate("userId", "name");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employeesbyDepId server error" });
  }
}

const getEmployeeCountByDepartment = async (req, res) => {
  const { departmentId } = req.params; 
  try {
    const employeeCount = await Employee.countDocuments({ department: departmentId });

    return res.status(200).json({ success: true, employeeCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error in fetching employee count" });
  }
};



export { addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDepId, getEmployeeCountByDepartment};
