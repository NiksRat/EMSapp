import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import Salary from "../models/Salary.js";

export const getLeaderSummary = async (req, res) => {
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

export const compareDepartments = async (req, res) => {
  try {
    const departments = await Department.find();

    const comparison = await Promise.all(
      departments.map(async (dept) => {
        const employeeCount = await Employee.countDocuments({ department: dept._id });

        const totalSalary = await Salary.aggregate([
          {
            $lookup: {
              from: "employees",
              localField: "employeeId",
              foreignField: "_id",
              as: "employeeData",
            },
          },
          { $unwind: "$employeeData" },
          { $match: { "employeeData.department": dept._id } },
          {
            $group: {
              _id: null,
              total: { $sum: "$netSalary" },
            },
          },
        ]);

        const leaveCount = await Leave.aggregate([
          {
            $lookup: {
              from: "employees",
              localField: "employeeId",
              foreignField: "_id",
              as: "employeeData",
            },
          },
          { $unwind: "$employeeData" },
          { $match: { "employeeData.department": dept._id } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ]);

        return {
          department: dept.dep_name,
          employees: employeeCount,
          totalSalary: totalSalary[0]?.total || 0,
          leaves: leaveCount[0]?.total || 0,
        };
      })
    );

    res.status(200).json({ success: true, data: comparison });
  } catch (error) {
    console.error("Compare departments error:", error.message);
    res.status(500).json({ success: false, error: "department comparison error" });
  }
};


