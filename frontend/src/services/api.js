const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const getToken = () => {
  return localStorage.getItem("access_token");
};

const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

const getHeaders = () => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`; // JWT uses "Bearer"
  }
  return headers;
};

const handleResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  
  if (!response.ok) {
    console.error("API Error:", response.status, data);
    throw new Error(data?.detail || data?.message || JSON.stringify(data) || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Auth - SimpleJWT
export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Try both email and username fields
    body: JSON.stringify({ 
      email: username,      // if your Django uses email
      username: username,   // if your Django uses username
      password 
    }),
  });
  return handleResponse(response);
}

export async function refreshToken() {
  const refresh = getRefreshToken();
  const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  return handleResponse(response);
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/auth/me/`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function updateCurrentUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/me/`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

export async function logoutUser() {
  // JWT doesn't require server-side logout, just clear tokens
  return Promise.resolve();
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

// Tasks
export async function fetchTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/`, { 
      headers: getHeaders() 
    });
    return handleResponse(response);
  } catch (error) {
    console.error("fetchTasks error:", error);
    return [];
  }
}

export async function createTask(task) {
  const response = await fetch(`${API_BASE_URL}/tasks/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(task),
  });
  return handleResponse(response);
}

export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (response.status === 204) return null;
  return handleResponse(response);
}

// Leaves
export async function fetchLeaves() {
  try {
    const response = await fetch(`${API_BASE_URL}/leave/`, { 
      headers: getHeaders() 
    });
    return handleResponse(response);
  } catch (error) {
    console.error("fetchLeaves error:", error);
    return [];
  }
}

export async function createLeave(leave) {
  const response = await fetch(`${API_BASE_URL}/leave/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(leave),
  });
  return handleResponse(response);
}

export async function fetchAllLeaves() {
  try {
    const response = await fetch(`${API_BASE_URL}/leave/all/`, { 
      headers: getHeaders() 
    });
    return handleResponse(response);
  } catch (error) {
    console.error("fetchAllLeaves error:", error);
    return [];
  }
}

export async function updateLeaveStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/leave/${id}/status/`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
}

// Attendance
export async function fetchAttendance() {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/`, { 
      headers: getHeaders() 
    });
    return handleResponse(response);
  } catch (error) {
    console.error("fetchAttendance error:", error);
    return [];
  }
}

export async function checkIn() {
  const response = await fetch(`${API_BASE_URL}/attendance/check-in/`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function checkOut() {
  const response = await fetch(`${API_BASE_URL}/attendance/check-out/`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handleResponse(response);
}

// Employees (Admin)
export async function fetchEmployees() {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/`, { 
      headers: getHeaders() 
    });
    return handleResponse(response);
  } catch (error) {
    console.error("fetchEmployees error:", error);
    return [];
  }
}

export async function fetchEmployee(id) {
  const response = await fetch(`${API_BASE_URL}/employees/${id}/`, { 
    headers: getHeaders() 
  });
  return handleResponse(response);
}

export async function fetchEmployeeProfile(userId) {
  const response = await fetch(`${API_BASE_URL}/employees/user/${userId}/profile/`, { 
    headers: getHeaders() 
  });
  return handleResponse(response);
}

export async function updateEmployeeProfile(userId, data) {
  const response = await fetch(`${API_BASE_URL}/employees/user/${userId}/profile/`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function createEmployeeProfile(userId, data) {
  const response = await fetch(`${API_BASE_URL}/employees/user/${userId}/profile/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Payroll/Salary (Admin)
export async function fetchEmployeeSalary(employeeId) {
  const response = await fetch(`${API_BASE_URL}/payroll/employee/${employeeId}/`, { 
    headers: getHeaders() 
  });
  return handleResponse(response);
}

export async function updateEmployeeSalary(employeeId, data) {
  const response = await fetch(`${API_BASE_URL}/payroll/employee/${employeeId}/`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function createEmployeeSalary(employeeId, data) {
  const response = await fetch(`${API_BASE_URL}/payroll/employee/${employeeId}/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}
