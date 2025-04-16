import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes"; 
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";
import EditDepartment from "./components/department/EditDepartment";
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";
import Summary from './components/EmployeeDashboard/Summary'
import LeaveList from './components/leave/List'
import AddLeave from './components/leave/Add'
import Setting from "./components/EmployeeDashboard/Setting";
import Table from "./components/leave/Table";
import Detail from "./components/leave/Detail";
import Attendance from "./components/attendance/Attendance";
import AttendanceReport from "./components/attendance/AttendanceReport";
import SalaryReport from "./components/salary/SalaryReport";
import LeaderDashboard from "./components/LeaderDashboard/LeaderDashboard";
import LeaderSidebar from "./components/LeaderDashboard/LeaderSidebar";
import LeaderSummary from "./components/LeaderDashboard/LeaderSummary";
import LeaderComparison from "./components/LeaderDashboard/LeaderComparison";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin", "leader"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />}></Route>

          <Route
            path="/admin-dashboard/departments"
            element={<DepartmentList />}
          ></Route>
          <Route
            path="/admin-dashboard/add-department"
            element={<AddDepartment />}
          ></Route>
          <Route
            path="/admin-dashboard/department/:id"
            element={<EditDepartment />}
          ></Route>

          <Route path="/admin-dashboard/employees" element={<List />}></Route>
          <Route path="/admin-dashboard/add-employee" element={<Add />}></Route>
          <Route
            path="/admin-dashboard/employees/:id"
            element={<View />}
          ></Route>
          <Route
            path="/admin-dashboard/employees/edit/:id"
            element={<Edit />}
          ></Route>
          <Route
            path="/admin-dashboard/employees/salary/:id"
            element={<ViewSalary />}
          ></Route>

          <Route
            path="/admin-dashboard/salary/add"
            element={<AddSalary />}
          ></Route>
          <Route path="/admin-dashboard/leaves" element={<Table />}></Route>
          <Route path="/admin-dashboard/leaves/:id" element={<Detail />}></Route>
          <Route path="/admin-dashboard/employees/leaves/:id" element={<LeaveList />}></Route>

          <Route path="/admin-dashboard/setting" element={<Setting />}></Route>
          <Route path="/admin-dashboard/attendance" element={<Attendance />}></Route>
          <Route path="/admin-dashboard/attendance-report" element={<AttendanceReport />}></Route>
          <Route path="/admin-dashboard/salary-report" element={<SalaryReport />} />
        </Route>
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin", "employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes> 
          }
        >
          <Route index element={<Summary />}></Route>

          <Route path="/employee-dashboard/profile/:id" element={<View />}></Route>
          <Route path="/employee-dashboard/leaves/:id" element={<LeaveList />}></Route>
          <Route path="/employee-dashboard/add-leave" element={<AddLeave />}></Route>
          <Route path="/employee-dashboard/salary/:id" element={<ViewSalary />}></Route>
          <Route path="/employee-dashboard/setting" element={<Setting />}></Route>

        </Route>

        <Route
  path="/leader-dashboard"
  element={
    <PrivateRoutes>
      <RoleBaseRoutes requiredRole={["leader"]}>
        <LeaderDashboard />
      </RoleBaseRoutes>
    </PrivateRoutes>
  }
>
  <Route index element={<LeaderSummary />} />
  <Route path="departments" element={<DepartmentList />} />
  <Route path="add-department" element={<AddDepartment />} />
  <Route path="department/:id" element={<EditDepartment />} />
  <Route path="employees" element={<List />} />
  <Route path="add-employee" element={<Add />} />
  <Route path="employees/:id" element={<View />} />
  <Route path="employees/edit/:id" element={<Edit />} />
  <Route path="employees/salary/:id" element={<ViewSalary />} />
  <Route path="salary/add" element={<AddSalary />} />
  <Route path="leaves" element={<Table />} />
  <Route path="leaves/:id" element={<Detail />} />
  <Route path="employees/leaves/:id" element={<LeaveList />} />
  <Route path="setting" element={<Setting />} />
  <Route path="attendance" element={<Attendance />} />
  <Route path="attendance-report" element={<AttendanceReport />} />
  <Route
            path="employees/salary/:id"
            element={<ViewSalary />}
          ></Route>
  <Route path="salary-report" element={<SalaryReport />} />
  <Route path="comparison" element={<LeaderComparison />} />
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
