import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import SchedulePage from "./pages/dashboard/SchedulePage";
import LeavePage from "./pages/dashboard/LeavePage";
import AttendancePage from "./pages/dashboard/AttendancePage";
import AdminLeavesPage from "./pages/dashboard/AdminLeavesPage";
import AdminAttendancePage from "./pages/dashboard/AdminAttendancePage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import EmployeesPage from "./pages/dashboard/EmployeesPage";
import EmployeeDetailPage from "./pages/dashboard/EmployeeDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "dashboard", element: <DashboardHome /> },
          { path: "dashboard/schedule", element: <SchedulePage /> },
          { path: "dashboard/leave", element: <LeavePage /> },
          { path: "dashboard/attendance", element: <AttendancePage /> },
          { 
            path: "dashboard/employees", 
            element: <AdminRoute><EmployeesPage /></AdminRoute> 
          },
          { 
            path: "dashboard/employees/:id", 
            element: <AdminRoute><EmployeeDetailPage /></AdminRoute> 
          },
          { 
            path: "dashboard/admin/leaves", 
            element: <AdminRoute><AdminLeavesPage /></AdminRoute> 
          },
          { 
            path: "dashboard/admin/attendance", 
            element: <AdminRoute><AdminAttendancePage /></AdminRoute> 
          },
          { path: "dashboard/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
