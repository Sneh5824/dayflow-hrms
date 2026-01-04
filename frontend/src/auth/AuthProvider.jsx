import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { loginUser, getCurrentUser, refreshToken } from "../services/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Auth check failed, trying refresh:", error);
        try {
          const data = await refreshToken();
          localStorage.setItem("access_token", data.access);
          const userData = await getCurrentUser();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (refreshError) {
          console.error("Refresh failed:", refreshError);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
        }
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);

      if (data.access) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // Get user info from /api/auth/me/
        const userData = await getCurrentUser();
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return data;
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
