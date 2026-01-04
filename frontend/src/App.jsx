import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import SchedulePage from "./pages/dashboard/SchedulePage";
import LeavePage from "./pages/dashboard/LeavePage";
import AttendancePage from "./pages/dashboard/AttendancePage";
import AdminLeavesPage from "./pages/dashboard/AdminLeavesPage";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<SchedulePage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="leave" element={<LeavePage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="admin/leaves" element={<AdminLeavesPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
