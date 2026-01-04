import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1a1a2e",
          color: "#fff",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
