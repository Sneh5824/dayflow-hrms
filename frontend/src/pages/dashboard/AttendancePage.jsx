import { useState, useEffect } from "react";
import { fetchAttendance, checkIn, checkOut } from "../../services/api";
import "./AttendancePage.css";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadAttendance();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await fetchAttendance();
      setAttendance(data || []);
      const today = new Date().toISOString().split("T")[0];
      setTodayRecord((data || []).find((a) => a.date === today));
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const record = await checkIn();
      setTodayRecord(record);
      loadAttendance();
    } catch (error) {
      console.error("Failed to check in:", error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const record = await checkOut();
      setTodayRecord(record);
      loadAttendance();
    } catch (error) {
      console.error("Failed to check out:", error);
    }
  };

  return (
    <div className="attendance-page">
      <div className="page-header">
        <h1>Attendance</h1>
      </div>

      <div className="today-card">
        <div className="today-info">
          <span className="today-label">Today</span>
          <span className="today-date">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="current-time">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
        <div className="today-actions">
          {!todayRecord?.check_in ? (
            <button className="checkin-btn" onClick={handleCheckIn}>
              Check In
            </button>
          ) : !todayRecord?.check_out ? (
            <>
              <div className="checked-info">
                Checked in: <strong>{todayRecord.check_in}</strong>
              </div>
              <button className="checkout-btn" onClick={handleCheckOut}>
                Check Out
              </button>
            </>
          ) : (
            <div className="completed-info">
              <div>
                In: <strong>{todayRecord.check_in}</strong>
              </div>
              <div>
                Out: <strong>{todayRecord.check_out}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="attendance-stats">
        <div className="stat-card">
          <span className="stat-value">22</span>
          <span className="stat-label">Working Days</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">20</span>
          <span className="stat-label">Present</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">2</span>
          <span className="stat-label">Absent</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">91%</span>
          <span className="stat-label">Rate</span>
        </div>
      </div>

      <div className="attendance-history">
        <h2>History</h2>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Loading...</td>
              </tr>
            ) : attendance.length === 0 ? (
              <tr>
                <td colSpan={5}>No records</td>
              </tr>
            ) : (
              attendance.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{r.check_in || "-"}</td>
                  <td>{r.check_out || "-"}</td>
                  <td>{r.hours || "-"}</td>
                  <td>
                    <span className={`status ${r.status?.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
