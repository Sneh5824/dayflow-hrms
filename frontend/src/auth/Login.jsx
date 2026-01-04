import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Login → get token
      const loginRes = await api.post("/auth/login/", {
        username,
        password,
      });

      const accessToken = loginRes.data.access;

      // Save token
      localStorage.setItem("token", accessToken);

      // 2️⃣ Fetch logged-in user
      const meRes = await api.get("/auth/me/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = meRes.data;

      // Save user
      localStorage.setItem("user", JSON.stringify(userData));

      // 3️⃣ Redirect
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Dayflow HRMS</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          className="w-full border p-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2">
          Login
        </button>
      </form>
    </div>
  );
}
