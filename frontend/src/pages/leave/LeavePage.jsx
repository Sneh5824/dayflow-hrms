import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({
    leave_type: "CASUAL",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const loadLeaves = async () => {
    const res = await api.get("/leave/");
    setLeaves(res.data);
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const applyLeave = async () => {
    await api.post("/leave/", form);
    setForm({ leave_type: "CASUAL", start_date: "", end_date: "", reason: "" });
    loadLeaves();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leave Management</h1>

      {/* Apply Leave */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-4 gap-3">
        <select
          className="border p-2"
          value={form.leave_type}
          onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
        >
          <option value="CASUAL">Casual</option>
          <option value="SICK">Sick</option>
        </select>

        <input
          type="date"
          className="border p-2"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        />

        <input
          type="date"
          className="border p-2"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
        />

        <button
          onClick={applyLeave}
          className="bg-blue-600 text-white"
        >
          Apply Leave
        </button>

        <textarea
          className="border p-2 col-span-4"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
      </div>

      {/* Leave Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Type</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l.id}>
              <td className="border p-2">{l.leave_type}</td>
              <td className="border p-2">{l.start_date}</td>
              <td className="border p-2">{l.end_date}</td>
              <td className="border p-2">{l.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
