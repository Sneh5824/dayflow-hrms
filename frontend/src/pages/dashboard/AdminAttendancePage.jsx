import { useState, useEffect } from "react";
import "./AttendancePage.css";

export default function AdminAttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with API call
    setLoading(false);
    setAttendance([
      { id: 1, employee_name: "John Doe", date: "2024-01-15", check_in: "09:00", check_out: "18:00", hours: "9h", status: "PRESENT" },
      { id: 2, employee_name: "Jane Smith", date: "2024-01-15", check_in: "09:15", check_out: "17:45", hours: "8.5h", status: "PRESENT" },
      { id: 3, employee_name: "Bob Wilson", date: "2024-01-15", check_in: null, check_out: null, hours: "-", status: "ABSENT" },
    ]);
  }, []);

  return (
    <div className="attendance-page">
      <div className="page-header">
        <h1>Attendance Report</h1>
      </div>

      <div className="attendance-stats">
        <div className="stat-card"><span className="stat-value">50</span><span className="stat-label">Total Employees</span></div>
        <div className="stat-card"><span className="stat-value">45</span><span className="stat-label">Present Today</span></div>
        <div className="stat-card"><span className="stat-value">3</span><span className="stat-label">Absent</span></div>
        <div className="stat-card"><span className="stat-value">2</span><span className="stat-label">On Leave</span></div>
      </div>

      <div className="attendance-history">
        <h2>Employee Attendance</h2>
        <table className="attendance-table">
          <thead>
            <tr><th>Employee</th><th>Date</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}>Loading...</td></tr>
            ) : attendance.length === 0 ? (
              <tr><td colSpan={6}>No records</td></tr>
            ) : (
              attendance.map((r) => (
                <tr key={r.id}>
                  <td>{r.employee_name}</td>
                  <td>{r.date}</td>
                  <td>{r.check_in || "-"}</td>
                  <td>{r.check_out || "-"}</td>
                  <td>{r.hours}</td>
                  <td><span className={`status ${r.status?.toLowerCase()}`}>{r.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
