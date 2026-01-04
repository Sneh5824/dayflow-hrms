import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminLeavePage() {
  const [leaves, setLeaves] = useState([]);

  const loadLeaves = async () => {
    const res = await api.get("/leave/");
    setLeaves(res.data);
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    await api.post(`/leave/${id}/approve/`, { status });
    loadLeaves();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Leave Approvals</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Employee</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Start</th>
            <th className="p-2 text-left">End</th>
            <th className="p-2 text-left">Reason</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-2">{l.user}</td>
              <td className="p-2">{l.leave_type}</td>
              <td className="p-2">{l.start_date}</td>
              <td className="p-2">{l.end_date}</td>
              <td className="p-2">{l.reason}</td>
              <td className="p-2 font-semibold">{l.status}</td>
              <td className="p-2 space-x-2">
                {l.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => updateStatus(l.id, "APPROVED")}
                      className="bg-green-600 text-white px-3 py-1"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(l.id, "REJECTED")}
                      className="bg-red-600 text-white px-3 py-1"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
