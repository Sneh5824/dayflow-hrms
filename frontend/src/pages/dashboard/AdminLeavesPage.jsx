import { useState, useEffect } from "react";
import { fetchAllLeaves, updateLeaveStatus } from "../../services/api";
import "./LeavePage.css";

export default function AdminLeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const data = await fetchAllLeaves();
      setLeaves(data || []);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      setLeaves(leaves.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusBadge = (status) => {
    const colors = { PENDING: "#f39c12", APPROVED: "#2ecc71", REJECTED: "#e74c3c" };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="leave-page">
      <div className="page-header"><h1>Leave Approvals</h1></div>
      <div className="leave-table-container">
        <table className="leave-table">
          <thead>
            <tr><th>Employee</th><th>Type</th><th>Start</th><th>End</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}>Loading...</td></tr>
            ) : leaves.length === 0 ? (
              <tr><td colSpan={7}>No leave requests</td></tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.employee_name || "Employee"}</td>
                  <td>{leave.leave_type}</td>
                  <td>{leave.start_date}</td>
                  <td>{leave.end_date}</td>
                  <td>{leave.reason}</td>
                  <td><span className="status-badge" style={{ backgroundColor: getStatusBadge(leave.status) }}>{leave.status}</span></td>
                  <td>
                    {leave.status === "PENDING" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleStatusChange(leave.id, "APPROVED")} style={{ background: "#2ecc71", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>✓</button>
                        <button onClick={() => handleStatusChange(leave.id, "REJECTED")} style={{ background: "#e74c3c", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>✕</button>
                      </div>
                    )}
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
