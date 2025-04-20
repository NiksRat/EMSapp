import Department from "../models/Department.js";
import Employee from "../models/Employee.js"
import Leave from "../models/Leave.js";
import Salary from "../models/Salary.js";

const getSummary = async (req, res) => {
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
                    _id: "$departmentId",
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
                    department: "$departmentInfo.name",
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
            totalEmployees,
            totalDepartments,
            totalSalary: totalSalaries[0]?.totalSalary || 0, 
            averageSalaryByDepartment, 
            leaveSummary
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "dashboard summary error" });
    }
};

const addLeader = async (req, res) => {
  try {
    const { name, email, password, departmentId } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const leaderData = {
      name,
      email,
      password: hashedPassword,
      role: "leader"
    };

    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(404).json({ success: false, message: "Department not found" });
      }
      leaderData.departmentId = departmentId;
    }

    const newLeader = new User(leaderData);
    await newLeader.save();

    res.status(201).json({ success: true, message: "Leader created", leader: newLeader });
  } catch (error) {
    console.error("addLeader error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getLeaders = async (req, res) => {
    try {
      const leaders = await User.find({ role: "leader" });
      res.status(200).json({ success: true, leaders });
    } catch (error) {
      console.error("getLeaders error:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  
export { getSummary, addLeader, getLeaders };
