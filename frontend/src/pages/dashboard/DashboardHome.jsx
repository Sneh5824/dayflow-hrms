import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { fetchTasks, fetchAttendance, fetchLeaves } from "../../services/api";
import { 
  HiOutlineClipboardList, 
  HiOutlineCheckCircle, 
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineInbox,
  HiOutlineArrowRight
} from "react-icons/hi";
import "./DashboardHome.css";

export default function DashboardHome() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, attendanceData, leavesData] = await Promise.all([
        fetchTasks(),
        fetchAttendance(),
        fetchLeaves(),
      ]);
      setTasks(tasksData || []);
      setAttendance(attendanceData || []);
      setLeaves(leavesData || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getTodayTasks = () => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.filter((t) => t.date === today);
  };

  const getPresentDays = () => {
    return attendance.filter((a) => a.status === "PRESENT").length;
  };

  const getPendingLeaves = () => {
    return leaves.filter((l) => l.status === "PENDING").length;
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="dashboard-home">
      <div className="home-header">
        <div className="welcome-section">
          <h1>{getGreeting()}, {user?.name || user?.first_name || "User"}</h1>
          <p>Here's what's happening with your schedule today.</p>
        </div>
        <div className="header-date">
          <HiOutlineCalendar className="icon" />
          {getTodayDate()}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card gradient-purple">
          <div className="stat-icon">
            <HiOutlineClipboardList />
          </div>
          <div className="stat-content">
            <span className="stat-value">{getTodayTasks().length}</span>
            <span className="stat-label">Today's Tasks</span>
          </div>
        </div>
        <div className="stat-card gradient-blue">
          <div className="stat-icon">
            <HiOutlineCheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-value">{getPresentDays()}</span>
            <span className="stat-label">Days Present</span>
          </div>
        </div>
        <div className="stat-card gradient-green">
          <div className="stat-icon">
            <HiOutlineDocumentText />
          </div>
          <div className="stat-content">
            <span className="stat-value">{leaves.length}</span>
            <span className="stat-label">Leave Requests</span>
          </div>
        </div>
        <div className="stat-card gradient-orange">
          <div className="stat-icon">
            <HiOutlineClock />
          </div>
          <div className="stat-content">
            <span className="stat-value">{getPendingLeaves()}</span>
            <span className="stat-label">Pending Approvals</span>
          </div>
        </div>
      </div>

      <div className="home-content">
        <div className="left-column">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/dashboard/schedule" className="action-card">
                <span className="action-icon purple">
                  <HiOutlineCalendar />
                </span>
                <span>Schedule</span>
              </Link>
              <Link to="/dashboard/attendance" className="action-card">
                <span className="action-icon blue">
                  <HiOutlineCheckCircle />
                </span>
                <span>Attendance</span>
              </Link>
              <Link to="/dashboard/leave" className="action-card">
                <span className="action-icon green">
                  <HiOutlineDocumentText />
                </span>
                <span>Leave</span>
              </Link>
              <Link to="/dashboard/profile" className="action-card">
                <span className="action-icon orange">
                  <HiOutlineUser />
                </span>
                <span>Profile</span>
              </Link>
            </div>
          </div>

          <div className="profile-card">
            <h2>My Profile</h2>
            <div className="profile-content">
              <div className="profile-avatar-large">
                {user?.name?.charAt(0) || user?.first_name?.charAt(0) || "U"}
              </div>
              <div className="profile-info-card">
                <h3>{user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "User"}</h3>
                <p className="profile-email">{user?.email || "user@example.com"}</p>
                <span className="profile-role-badge">{user?.role || "Employee"}</span>
              </div>
              <Link to="/dashboard/profile" className="view-profile-btn">
                View Full Profile <HiOutlineArrowRight />
              </Link>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="recent-tasks">
            <div className="section-header">
              <h2>Today's Schedule</h2>
              <Link to="/dashboard/schedule" className="view-all">
                View All <HiOutlineArrowRight />
              </Link>
            </div>
            {loading ? (
              <div className="loading-state">Loading...</div>
            ) : getTodayTasks().length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">
                  <HiOutlineInbox />
                </span>
                <p>No tasks scheduled for today</p>
                <Link to="/dashboard/schedule">Add a task</Link>
              </div>
            ) : (
              <div className="tasks-list">
                {getTodayTasks().slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="task-item"
                    style={{ borderLeftColor: task.color || "#667eea" }}
                  >
                    <div className="task-info">
                      <span className="task-title">{task.title}</span>
                      <span className="task-time">
                        {formatTime(task.start_time)} - {formatTime(task.end_time)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="recent-activity">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-list">
              {attendance.slice(0, 4).map((record, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-dot ${record.status?.toLowerCase()}`}></div>
                  <div className="activity-info">
                    <span className="activity-text">
                      {record.status === "PRESENT" ? "Checked in" : "Absent"} on {record.date}
                    </span>
                    {record.check_in && (
                      <span className="activity-time">{record.check_in} - {record.check_out || "Present"}</span>
                    )}
                  </div>
                </div>
              ))}
              {attendance.length === 0 && (
                <div className="empty-state small">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
