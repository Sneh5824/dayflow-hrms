import { useState, useEffect } from "react";
import { fetchLeaves, createLeave } from "../../services/api";
import "./LeavePage.css";

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: "CASUAL",
    start_date: "",
    end_date: "",
    reason: "",
  });

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const data = await fetchLeaves();
      setLeaves(data || []);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newLeave = await createLeave(formData);
      if (newLeave) setLeaves([...leaves, newLeave]);
      setShowForm(false);
      setFormData({ leave_type: "CASUAL", start_date: "", end_date: "", reason: "" });
    } catch (error) {
      console.error("Failed to create leave:", error);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: { bg: "#f39c12", text: "#fff" },
      APPROVED: { bg: "#2ecc71", text: "#fff" },
      REJECTED: { bg: "#e74c3c", text: "#fff" },
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="leave-page">
      <div className="page-header">
        <h1>Leave Management</h1>
        <button className="primary-btn" onClick={() => setShowForm(true)}>
          + Request Leave
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Request Leave</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="ANNUAL">Annual Leave</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="leave-summary">
        <div className="summary-card"><span className="summary-value">12</span><span className="summary-label">Total</span></div>
        <div className="summary-card"><span className="summary-value">8</span><span className="summary-label">Available</span></div>
        <div className="summary-card"><span className="summary-value">4</span><span className="summary-label">Used</span></div>
      </div>

      <div className="leave-table-container">
        <table className="leave-table">
          <thead>
            <tr><th>Type</th><th>Start</th><th>End</th><th>Reason</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5}>Loading...</td></tr>
            ) : leaves.length === 0 ? (
              <tr><td colSpan={5}>No leave requests</td></tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.leave_type}</td>
                  <td>{leave.start_date}</td>
                  <td>{leave.end_date}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className="status-badge" style={{ backgroundColor: getStatusBadge(leave.status).bg }}>
                      {leave.status}
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
