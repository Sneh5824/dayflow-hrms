import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "400px",
          color: "#64748b",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // Check if user has admin or HR role
  if (!user || user.role === "EMPLOYEE") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
