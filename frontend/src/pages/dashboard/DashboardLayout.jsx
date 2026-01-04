import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import {
  FiHome,
  FiCalendar,
  FiCheckSquare,
  FiSun,
  FiClipboard,
  FiUsers,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { HiOutlineCalendar } from "react-icons/hi";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="dashboard-app">
      <aside className={`nav-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <HiOutlineCalendar />
          </div>
          {!sidebarCollapsed && <span className="brand-name">Dayflow</span>}
        </div>

        <nav className="nav-menu">
          <NavLink to="/dashboard" end className="nav-item">
            <span className="nav-icon">
              <FiHome />
            </span>
            {!sidebarCollapsed && <span>Home</span>}
          </NavLink>
          <NavLink to="/dashboard/schedule" className="nav-item">
            <span className="nav-icon">
              <FiCalendar />
            </span>
            {!sidebarCollapsed && <span>Schedule</span>}
          </NavLink>
          <NavLink to="/dashboard/attendance" className="nav-item">
            <span className="nav-icon">
              <FiCheckSquare />
            </span>
            {!sidebarCollapsed && <span>Attendance</span>}
          </NavLink>
          <NavLink to="/dashboard/leave" className="nav-item">
            <span className="nav-icon">
              <FiSun />
            </span>
            {!sidebarCollapsed && <span>Leave</span>}
          </NavLink>

          {user?.role !== "EMPLOYEE" && (
            <>
              <div className="nav-divider"></div>
              <span className="nav-section">
                {!sidebarCollapsed && "Admin"}
              </span>
              <NavLink to="/dashboard/employees" className="nav-item">
                <span className="nav-icon">
                  <FiUsers />
                </span>
                {!sidebarCollapsed && <span>Employees</span>}
              </NavLink>
              <NavLink to="/dashboard/admin/leaves" className="nav-item">
                <span className="nav-icon">
                  <FiClipboard />
                </span>
                {!sidebarCollapsed && <span>Leave Approvals</span>}
              </NavLink>
              <NavLink to="/dashboard/admin/attendance" className="nav-item">
                <span className="nav-icon">
                  <FiCheckSquare />
                </span>
                {!sidebarCollapsed && <span>Attendance Report</span>}
              </NavLink>
            </>
          )}

          <div className="nav-divider"></div>
          <NavLink to="/dashboard/profile" className="nav-item">
            <span className="nav-icon">
              <FiUser />
            </span>
            {!sidebarCollapsed && <span>Profile</span>}
          </NavLink>
        </nav>

        <div className="nav-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0) || user?.first_name?.charAt(0) || "U"}
            </div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <span className="user-name">
                  {user?.name || user?.first_name || "User"}
                </span>
                <span className="user-role">
                  {user?.role || "Employee"}
                </span>
              </div>
            )}
          </div>
          <button onClick={logout} className="logout-btn" title="Logout">
            <FiLogOut />
          </button>
        </div>

        <button
          className="collapse-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
