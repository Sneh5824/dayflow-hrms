import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { HiOutlineCalendar } from "react-icons/hi";
import "./LoginPage.css";

export default function LoginPage() {
  // SimpleJWT might use 'username' instead of 'email'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Try with email first, then username
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);

      if (
        err.message.includes("No active account") ||
        err.message.includes("credentials")
      ) {
        setError("Invalid username/email or password");
      } else if (
        err.message.includes("fetch") ||
        err.message.includes("NetworkError")
      ) {
        setError("Cannot connect to server. Is the backend running on localhost:8000?");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">
            <HiOutlineCalendar />
          </span>
          <h1>Dayflow</h1>
          <p>Sign in to your account</p>
        </div>

        {successMessage && <div className="login-success">{successMessage}</div>}
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email / Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email or username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
