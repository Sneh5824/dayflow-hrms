export const setAuth = ({ access, user }) => {
  localStorage.setItem("access", access);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("user");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access");
};
