import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { 
  HiOutlineUsers, 
  HiOutlineSearch,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlineBriefcase,
  HiOutlineFilter,
  HiOutlineExclamationCircle
} from "react-icons/hi";
import { useAuth } from "../../auth/useAuth";
import { fetchEmployees } from "../../services/api";
import "./EmployeesPage.css";

export default function EmployeesPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterRole, setFilterRole] = useState("");

  // Check admin access
  const isAdmin = user?.role === "ADMIN" || user?.role === "HR";

  useEffect(() => {
    if (isAdmin) {
      loadEmployees();
    }
  }, [isAdmin]);

  const loadEmployees = async () => {
    try {
      setError(null);
      const data = await fetchEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load employees:", err);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Get unique departments
  const departments = [...new Set(employees
    .map(emp => emp.profile?.department)
    .filter(Boolean)
  )];

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || 
      emp.profile?.department === filterDepartment;
    
    const matchesRole = !filterRole || emp.role === filterRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  if (loading) {
    return (
      <div className="employees-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employees-page">
        <div className="error-state">
          <HiOutlineExclamationCircle className="error-icon" />
          <p>{error}</p>
          <button className="retry-btn" onClick={loadEmployees}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="employees-page">
      <div className="page-header">
        <div className="header-title">
          <HiOutlineUsers className="header-icon" />
          <h1>Employees</h1>
        </div>
        <div className="header-stats">
          <span className="stat-badge">{employees.length} Total</span>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <HiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <HiOutlineFilter className="filter-icon" />
          <select 
            value={filterDepartment} 
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="HR">HR</option>
            <option value="EMPLOYEE">Employee</option>
          </select>
        </div>
      </div>

      <div className="employees-grid">
        {filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <HiOutlineUsers className="empty-icon" />
            <p>No employees found</p>
          </div>
        ) : (
          filteredEmployees.map(employee => (
            <Link 
              key={employee.id} 
              to={`/dashboard/employees/${employee.id}`}
              className="employee-card"
            >
              <div className="employee-avatar">
                {employee.first_name?.charAt(0) || employee.username?.charAt(0) || "U"}
              </div>
              <div className="employee-info">
                <h3>{employee.full_name || employee.username}</h3>
                <div className="employee-meta">
                  <span className="meta-item">
                    <HiOutlineMail />
                    {employee.email}
                  </span>
                  {employee.profile?.designation && (
                    <span className="meta-item">
                      <HiOutlineBriefcase />
                      {employee.profile.designation}
                    </span>
                  )}
                  {employee.profile?.department && (
                    <span className="meta-item">
                      <HiOutlineOfficeBuilding />
                      {employee.profile.department}
                    </span>
                  )}
                </div>
                <div className="employee-badges">
                  <span className={`role-badge ${employee.role?.toLowerCase()}`}>
                    {employee.role}
                  </span>
                  {employee.employee_id && (
                    <span className="id-badge">ID: {employee.employee_id}</span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
