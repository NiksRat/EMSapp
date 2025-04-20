import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from "docx"
import { Buffer } from "buffer"
import mongoose from 'mongoose'
import Salary from '../models/Salary.js'
import Employee from '../models/Employee.js'

const addSalary = async (req, res) => {
    try {
        const {employeeId, basicSalary, allowances, deductions, payDate} = req.body

        const basicSalaryNum = parseInt(basicSalary);
        const allowancesNum = parseInt(allowances);
        const deductionsNum = parseInt(deductions);
    
        // Проверка на NaN
        if (isNaN(basicSalaryNum) || isNaN(allowancesNum) || isNaN(deductionsNum)) {
          return res.status(400).json({ success: false, error: "Invalid input values" });
        }
    
        const totalSalary = basicSalaryNum + allowancesNum - deductionsNum;

        const newSalary = new Salary({
            employeeId,
            basicSalary,
            allowances,
            deductions,
            netSalary: totalSalary,
            payDate
        })

        await newSalary.save()

        return res.status(200).json({success: true})

    } catch(error) {
        return res.status(500).json({success: false, error: "salary add server error"})
    }
}

const getSalary = async (req, res) => {
  try {
      const {id, role} = req.params;
      
      let salary
      if(role === "admin") {
          salary = await Salary.find({employeeId: id}).populate('employeeId', 'employeeId')
      } else {
          const employee = await Employee.findOne({userId: id})
          salary = await Salary.find({employeeId: employee._id}).populate('employeeId', 'employeeId')
      }
      return res.status(200).json({success: true, salary})
  } catch(error) {
      return res.status(500).json({success: false, error: "salary get server error"})
  }
}

const salaryReport = async (req, res) => {
    try {
      const { payDate, limit = 5, skip = 0 } = req.query;
      const query = {};

      if (payDate) {
        const start = new Date(payDate);
        const end = new Date(payDate);
        end.setDate(end.getDate() + 1); 
      
        query.payDate = { $gte: start, $lt: end };
      }
  
      const salaryData = await Salary.find(query)
        .populate({
          path: "employeeId",
          populate: ["department", "userId"]
        })
        .sort({ payDate: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit));
  
      const groupData = salaryData.reduce((result, record) => {
        const date = record.payDate.toISOString().split('T')[0]; 
  
        if (!result[date]) {
          result[date] = [];
        }
  
        result[date].push({
          employeeId: record.employeeId.employeeId,
          employeeName: record.employeeId.userId?.name || "N/A",
          departmentName: record.employeeId.department?.dep_name || "N/A",
          basicSalary: record.basicSalary,
          allowances: record.allowances || 0,
          deductions: record.deductions || 0,
          netSalary: record.netSalary
        });
  
        return result;
      }, {});
  
      return res.status(200).json({ success: true, groupData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

export {addSalary, getSalary, salaryReport}