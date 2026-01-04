import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineCalendar, HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineIdentification, HiOutlineUserGroup } from "react-icons/hi";
import { registerUser } from "../../services/api";
import "./LoginPage.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    employee_id: "",
    role: "EMPLOYEE",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        employee_id: formData.employee_id || undefined,
        role: formData.role,
      });
      
      navigate("/login", { 
        state: { message: "Account created successfully! Please sign in." }
      });
    } catch (err) {
      console.error("Registration failed:", err);
      if (err.message.includes("username")) {
        setError("Username already exists");
      } else if (err.message.includes("email")) {
        setError("Email already registered");
      } else if (err.message.includes("employee_id")) {
        setError("Employee ID already exists");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card register-card">
        <div className="login-header">
          <span className="login-icon">
            <HiOutlineCalendar />
          </span>
          <h1>Dayflow</h1>
          <p>Create your account</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Employee ID <span className="optional">(Optional)</span></label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                placeholder="Enter employee ID"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="HR">HR Officer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 characters"
                required
                minLength={8}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
