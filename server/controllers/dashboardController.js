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

export { getSummary };
