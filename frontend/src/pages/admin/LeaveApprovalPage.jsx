import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function LeaveApprovalPage() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    api.get("/leave/")
      .then(res => setLeaves(res.data));
  }, []);

  const updateStatus = (id, action) => {
    api.post(`/leave/${id}/approve/`, { action })
      .then(() => {
        setLeaves(leaves.map(l =>
          l.id === id ? { ...l, status: action.toUpperCase() } : l
        ));
      });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leave Approvals</h1>

      <table className="w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th>User</th><th>Type</th><th>Dates</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(l => (
            <tr key={l.id} className="border-t text-center">
              <td>{l.user.username}</td>
              <td>{l.leave_type}</td>
              <td>{l.start_date} → {l.end_date}</td>
              <td>
                <span className={`badge ${l.status.toLowerCase()}`}>
                  {l.status}
                </span>
              </td>
              <td className="space-x-2">
                <button
                  onClick={() => updateStatus(l.id, "approved")}
                  className="btn-green"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(l.id, "rejected")}
                  className="btn-red"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
