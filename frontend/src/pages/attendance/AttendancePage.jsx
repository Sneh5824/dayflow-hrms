import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AttendancePage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get("/attendance/history/?range=week")
      .then(res => setRecords(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Weekly Attendance</h1>

      <table className="w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id} className="border-t text-center">
              <td>{r.date}</td>
              <td>{r.check_in || "-"}</td>
              <td>{r.check_out || "-"}</td>
              <td>
                <span className="badge success">
                  Present
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
