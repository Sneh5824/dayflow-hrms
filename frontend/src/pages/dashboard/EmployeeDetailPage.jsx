import { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { 
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineLockClosed,
  HiOutlineCurrencyDollar,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlinePlus,
  HiOutlineExclamationCircle
} from "react-icons/hi";
import { useAuth } from "../../auth/useAuth";
import { 
  fetchEmployee, 
  fetchEmployeeProfile, 
  updateEmployeeProfile,
  createEmployeeProfile,
  fetchEmployeeSalary,
  updateEmployeeSalary,
  createEmployeeSalary
} from "../../services/api";
import "./EmployeeDetailPage.css";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [profile, setProfile] = useState(null);
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("resume");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [salaryEditing, setSalaryEditing] = useState(false);
  const [salaryData, setSalaryData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const isAdmin = user?.role === "ADMIN" || user?.role === "HR";

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setError(null);
      const empData = await fetchEmployee(id);
      setEmployee(empData);
      
      try {
        const profileData = await fetchEmployeeProfile(id);
        setProfile(profileData);
      } catch {
        setProfile(null);
      }
      
      if (isAdmin) {
        try {
          const salaryData = await fetchEmployeeSalary(id);
          setSalary(salaryData);
        } catch {
          setSalary(null);
        }
      }
    } catch (err) {
      console.error("Failed to load employee:", err);
      setError("Failed to load employee details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showSaveMessage = (message, isError = false) => {
    setSaveMessage({ text: message, isError });
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleEditProfile = () => {
    setEditData({
      about: profile?.about || "",
      skills: profile?.skills || "",
      certifications: profile?.certifications || "",
      interests: profile?.interests || "",
      department: profile?.department || "",
      designation: profile?.designation || "",
      phone: profile?.phone || "",
      joining_date: profile?.joining_date || "",
      location: profile?.location || "",
      date_of_birth: profile?.date_of_birth || "",
      gender: profile?.gender || "",
      marital_status: profile?.marital_status || "",
      personal_email: profile?.personal_email || "",
      mailing_address: profile?.mailing_address || "",
      permanent_address: profile?.permanent_address || "",
      bank_name: profile?.bank_name || "",
      account_number: profile?.account_number || "",
      ifsc_code: profile?.ifsc_code || "",
      pan_number: profile?.pan_number || "",
      uan_number: profile?.uan_number || "",
    });
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      if (profile) {
        await updateEmployeeProfile(id, editData);
      } else {
        await createEmployeeProfile(id, editData);
      }
      await loadData();
      setEditing(false);
      showSaveMessage("Profile saved successfully!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      showSaveMessage("Failed to save profile. Please try again.", true);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSalary = () => {
    setSalaryData({
      monthly_wage: salary?.monthly_wage || 0,
      working_days_per_week: salary?.working_days_per_week || 5,
      working_hours_per_day: salary?.working_hours_per_day || 8,
      basic_percentage: salary?.basic_percentage || 50,
      hra_percentage: salary?.hra_percentage || 40,
      standard_allowance: salary?.standard_allowance || 0,
      performance_bonus_percentage: salary?.performance_bonus_percentage || 8.33,
      leave_travel_allowance_percentage: salary?.leave_travel_allowance_percentage || 8.33,
      food_allowance: salary?.food_allowance || 0,
      pf_employee_percentage: salary?.pf_employee_percentage || 12,
      pf_employer_percentage: salary?.pf_employer_percentage || 12,
      professional_tax: salary?.professional_tax || 200,
    });
    setSalaryEditing(true);
  };

  const handleSaveSalary = async () => {
    setSaving(true);
    try {
      if (salary) {
        await updateEmployeeSalary(id, salaryData);
      } else {
        await createEmployeeSalary(id, salaryData);
      }
      await loadData();
      setSalaryEditing(false);
      showSaveMessage("Salary structure saved successfully!");
    } catch (err) {
      console.error("Failed to save salary:", err);
      showSaveMessage("Failed to save salary. Please try again.", true);
    } finally {
      setSaving(false);
    }
  };

  // Calculate salary values for display
  const calculateSalary = (data) => {
    const wage = parseFloat(data.monthly_wage) || 0;
    const basicPct = parseFloat(data.basic_percentage) || 50;
    const hraPct = parseFloat(data.hra_percentage) || 40;
    const perfPct = parseFloat(data.performance_bonus_percentage) || 0;
    const ltaPct = parseFloat(data.leave_travel_allowance_percentage) || 0;
    const pfPct = parseFloat(data.pf_employee_percentage) || 12;
    
    const basic = (wage * basicPct) / 100;
    const hra = (basic * hraPct) / 100;
    const perf = (basic * perfPct) / 100;
    const lta = (basic * ltaPct) / 100;
    const pf = (basic * pfPct) / 100;
    
    return { basic, hra, perf, lta, pf };
  };

  if (loading) {
    return (
      <div className="employee-detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-detail-page">
        <button className="back-btn" onClick={() => navigate("/dashboard/employees")}>
          <HiOutlineArrowLeft /> Back to Employees
        </button>
        <div className="error-state">
          <HiOutlineExclamationCircle className="error-icon" />
          <p>{error}</p>
          <button className="retry-btn" onClick={loadData}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="employee-detail-page">
        <button className="back-btn" onClick={() => navigate("/dashboard/employees")}>
          <HiOutlineArrowLeft /> Back to Employees
        </button>
        <div className="error-state">
          <HiOutlineExclamationCircle className="error-icon" />
          <p>Employee not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-detail-page">
      {saveMessage && (
        <div className={`save-toast ${saveMessage.isError ? 'error' : 'success'}`}>
          {saveMessage.text}
        </div>
      )}
      
      <button className="back-btn" onClick={() => navigate("/dashboard/employees")}>
        <HiOutlineArrowLeft /> Back to Employees
      </button>

      <div className="employee-detail-layout">
        {/* Sidebar */}
        <div className="detail-sidebar">
          <div className="profile-card-main">
            <div className="profile-avatar-xl">
              {employee.first_name?.charAt(0) || employee.username?.charAt(0) || "U"}
            </div>
            <h2>{employee.full_name || employee.username}</h2>
            <p className="profile-role">{employee.role}</p>
            <p className="profile-email">{employee.email}</p>
          </div>

          <div className="profile-quick-info">
            {employee.employee_id && (
              <div className="quick-item">
                <span className="quick-label">Employee ID</span>
                <span className="quick-value">{employee.employee_id}</span>
              </div>
            )}
            {profile?.department && (
              <div className="quick-item">
                <span className="quick-label">Department</span>
                <span className="quick-value">{profile.department}</span>
              </div>
            )}
            {profile?.designation && (
              <div className="quick-item">
                <span className="quick-label">Designation</span>
                <span className="quick-value">{profile.designation}</span>
              </div>
            )}
            {profile?.manager_name && (
              <div className="quick-item">
                <span className="quick-label">Manager</span>
                <span className="quick-value">{profile.manager_name}</span>
              </div>
            )}
            {profile?.location && (
              <div className="quick-item">
                <span className="quick-label">Location</span>
                <span className="quick-value">{profile.location}</span>
              </div>
            )}
          </div>

          <nav className="detail-tabs">
            <button
              className={`tab-btn ${activeTab === "resume" ? "active" : ""}`}
              onClick={() => setActiveTab("resume")}
            >
              <HiOutlineDocumentText /> Resume
            </button>
            <button
              className={`tab-btn ${activeTab === "private" ? "active" : ""}`}
              onClick={() => setActiveTab("private")}
            >
              <HiOutlineLockClosed /> Private Info
            </button>
            {isAdmin && (
              <button
                className={`tab-btn ${activeTab === "salary" ? "active" : ""}`}
                onClick={() => setActiveTab("salary")}
              >
                <HiOutlineCurrencyDollar /> Salary Info
              </button>
            )}
          </nav>
        </div>

        {/* Main Content */}
        <div className="detail-main">
          {/* Resume Tab */}
          {activeTab === "resume" && (
            <div className="tab-content">
              <div className="section-header">
                <h3>Resume / Profile</h3>
                {isAdmin && !editing && (
                  <button className="edit-btn" onClick={handleEditProfile}>
                    <HiOutlinePencil /> Edit
                  </button>
                )}
                {editing && (
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSaveProfile} disabled={saving}>
                      <HiOutlineCheck /> {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="cancel-btn" onClick={() => setEditing(false)} disabled={saving}>
                      <HiOutlineX /> Cancel
                    </button>
                  </div>
                )}
              </div>

              {editing ? (
                <div className="edit-form">
                  <div className="form-section">
                    <h4>About</h4>
                    <textarea
                      value={editData.about}
                      onChange={(e) => setEditData({...editData, about: e.target.value})}
                      placeholder="Write about the employee..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="form-section">
                    <h4>Skills</h4>
                    <input
                      type="text"
                      value={editData.skills}
                      onChange={(e) => setEditData({...editData, skills: e.target.value})}
                      placeholder="Comma-separated skills"
                    />
                  </div>
                  
                  <div className="form-section">
                    <h4>Certifications</h4>
                    <textarea
                      value={editData.certifications}
                      onChange={(e) => setEditData({...editData, certifications: e.target.value})}
                      placeholder="List certifications..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-section">
                    <h4>Interests & Hobbies</h4>
                    <textarea
                      value={editData.interests}
                      onChange={(e) => setEditData({...editData, interests: e.target.value})}
                      placeholder="Interests and hobbies..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-section">
                      <h4>Department</h4>
                      <input
                        type="text"
                        value={editData.department}
                        onChange={(e) => setEditData({...editData, department: e.target.value})}
                        placeholder="Department"
                      />
                    </div>
                    <div className="form-section">
                      <h4>Designation</h4>
                      <input
                        type="text"
                        value={editData.designation}
                        onChange={(e) => setEditData({...editData, designation: e.target.value})}
                        placeholder="Designation"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-section">
                      <h4>Joining Date</h4>
                      <input
                        type="date"
                        value={editData.joining_date}
                        onChange={(e) => setEditData({...editData, joining_date: e.target.value})}
                      />
                    </div>
                    <div className="form-section">
                      <h4>Location</h4>
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => setEditData({...editData, location: e.target.value})}
                        placeholder="Location"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="info-section">
                    <h4>About</h4>
                    <p className="about-text">
                      {profile?.about || "No information provided."}
                    </p>
                  </div>

                  <div className="info-section">
                    <h4>Skills</h4>
                    <div className="skills-list">
                      {profile?.skills_list?.length > 0 ? (
                        profile.skills_list.map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))
                      ) : (
                        <span className="no-data">No skills added</span>
                      )}
                      {isAdmin && (
                        <button className="add-skill-btn">
                          <HiOutlinePlus /> Add Skills
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>Certifications</h4>
                    <p className="cert-text">
                      {profile?.certifications || "No certifications listed."}
                    </p>
                  </div>

                  <div className="info-section">
                    <h4>Interests & Hobbies</h4>
                    <p className="interests-text">
                      {profile?.interests || "No interests listed."}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Private Info Tab */}
          {activeTab === "private" && (
            <div className="tab-content">
              <div className="section-header">
                <h3>Private Information</h3>
                {isAdmin && !editing && (
                  <button className="edit-btn" onClick={handleEditProfile}>
                    <HiOutlinePencil /> Edit
                  </button>
                )}
                {editing && (
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSaveProfile} disabled={saving}>
                      <HiOutlineCheck /> {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="cancel-btn" onClick={() => setEditing(false)} disabled={saving}>
                      <HiOutlineX /> Cancel
                    </button>
                  </div>
                )}
              </div>

              {editing ? (
                <div className="edit-form">
                  <div className="form-row">
                    <div className="form-section">
                      <h4>Date of Birth</h4>
                      <input
                        type="date"
                        value={editData.date_of_birth}
                        onChange={(e) => setEditData({...editData, date_of_birth: e.target.value})}
                      />
                    </div>
                    <div className="form-section">
                      <h4>Gender</h4>
                      <select
                        value={editData.gender}
                        onChange={(e) => setEditData({...editData, gender: e.target.value})}
                      >
                        <option value="">Select</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-section">
                      <h4>Marital Status</h4>
                      <select
                        value={editData.marital_status}
                        onChange={(e) => setEditData({...editData, marital_status: e.target.value})}
                      >
                        <option value="">Select</option>
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOWED">Widowed</option>
                      </select>
                    </div>
                    <div className="form-section">
                      <h4>Phone</h4>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h4>Personal Email</h4>
                    <input
                      type="email"
                      value={editData.personal_email}
                      onChange={(e) => setEditData({...editData, personal_email: e.target.value})}
                      placeholder="Personal email address"
                    />
                  </div>
                  
                  <div className="form-section">
                    <h4>Mailing Address</h4>
                    <textarea
                      value={editData.mailing_address}
                      onChange={(e) => setEditData({...editData, mailing_address: e.target.value})}
                      placeholder="Current mailing address"
                      rows={2}
                    />
                  </div>
                  
                  <div className="form-section">
                    <h4>Permanent Address</h4>
                    <textarea
                      value={editData.permanent_address}
                      onChange={(e) => setEditData({...editData, permanent_address: e.target.value})}
                      placeholder="Permanent address"
                      rows={2}
                    />
                  </div>

                  <h4 className="subsection-title">Bank Details</h4>
                  
                  <div className="form-row">
                    <div className="form-section">
                      <h4>Bank Name</h4>
                      <input
                        type="text"
                        value={editData.bank_name}
                        onChange={(e) => setEditData({...editData, bank_name: e.target.value})}
                        placeholder="Bank name"
                      />
                    </div>
                    <div className="form-section">
                      <h4>Account Number</h4>
                      <input
                        type="text"
                        value={editData.account_number}
                        onChange={(e) => setEditData({...editData, account_number: e.target.value})}
                        placeholder="Account number"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-section">
                      <h4>IFSC Code</h4>
                      <input
                        type="text"
                        value={editData.ifsc_code}
                        onChange={(e) => setEditData({...editData, ifsc_code: e.target.value})}
                        placeholder="IFSC code"
                      />
                    </div>
                    <div className="form-section">
                      <h4>PAN Number</h4>
                      <input
                        type="text"
                        value={editData.pan_number}
                        onChange={(e) => setEditData({...editData, pan_number: e.target.value})}
                        placeholder="PAN number"
                      />
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h4>UAN Number</h4>
                    <input
                      type="text"
                      value={editData.uan_number}
                      onChange={(e) => setEditData({...editData, uan_number: e.target.value})}
                      placeholder="UAN number"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="private-info-grid">
                    <div className="info-item">
                      <label>Date of Birth</label>
                      <span>{profile?.date_of_birth || "-"}</span>
                    </div>
                    <div className="info-item">
                      <label>Gender</label>
                      <span>
                        {profile?.gender === 'M' ? 'Male' : 
                         profile?.gender === 'F' ? 'Female' : 
                         profile?.gender === 'O' ? 'Other' : '-'}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Marital Status</label>
                      <span>{profile?.marital_status || "-"}</span>
                    </div>
                    <div className="info-item">
                      <label>Phone</label>
                      <span>{profile?.phone || "-"}</span>
                    </div>
                    <div className="info-item">
                      <label>Personal Email</label>
                      <span>{profile?.personal_email || "-"}</span>
                    </div>
                    <div className="info-item">
                      <label>Date of Joining</label>
                      <span>{profile?.joining_date || "-"}</span>
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>Mailing Address</h4>
                    <p>{profile?.mailing_address || "-"}</p>
                  </div>

                  <div className="info-section">
                    <h4>Permanent Address</h4>
                    <p>{profile?.permanent_address || "-"}</p>
                  </div>

                  <h4 className="subsection-title">Bank Details</h4>
                  <div className="private-info-grid">
                    <div className="info-item">
                      <label>Bank Name</label>
                      <span>{profile?.bank_name || "-"}</span>
                    </div>
                    <div className="info-item">
                      <label>Account Number</label>
                      <span>{profile?.account_number || "-"}</span>
                    </div>
                    <div className="info-item">
                      <label>IFSC Code</label>
                      <span>{profile?.ifsc_code || "-"}</span>
                    </div>
                    <div className="info-item">
                      <label>PAN Number</label>
                      <span>{profile?.pan_number || "-"}</span>
                    </div>
                    <div className="info-item">
                      <label>UAN Number</label>
                      <span>{profile?.uan_number || "-"}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Salary Info Tab (Admin Only) */}
          {activeTab === "salary" && isAdmin && (
            <div className="tab-content">
              <div className="section-header">
                <h3>Salary Information</h3>
                {!salaryEditing && (
                  <button className="edit-btn" onClick={handleEditSalary}>
                    <HiOutlinePencil /> {salary ? "Edit" : "Set Salary"}
                  </button>
                )}
                {salaryEditing && (
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSaveSalary} disabled={saving}>
                      <HiOutlineCheck /> {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="cancel-btn" onClick={() => setSalaryEditing(false)} disabled={saving}>
                      <HiOutlineX /> Cancel
                    </button>
                  </div>
                )}
              </div>

              {salaryEditing ? (
                <div className="salary-edit-form">
                  <div className="salary-section">
                    <h4>Wage Information</h4>
                    <div className="salary-row">
                      <div className="salary-field">
                        <label>Monthly Wage (₹)</label>
                        <input
                          type="number"
                          value={salaryData.monthly_wage}
                          onChange={(e) => setSalaryData({...salaryData, monthly_wage: e.target.value})}
                        />
                      </div>
                      <div className="salary-field">
                        <label>Yearly Wage (₹)</label>
                        <input
                          type="text"
                          value={(parseFloat(salaryData.monthly_wage) * 12 || 0).toFixed(2)}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="salary-row">
                      <div className="salary-field">
                        <label>Working Days/Week</label>
                        <input
                          type="number"
                          value={salaryData.working_days_per_week}
                          onChange={(e) => setSalaryData({...salaryData, working_days_per_week: e.target.value})}
                        />
                      </div>
                      <div className="salary-field">
                        <label>Hours/Day</label>
                        <input
                          type="number"
                          step="0.5"
                          value={salaryData.working_hours_per_day}
                          onChange={(e) => setSalaryData({...salaryData, working_hours_per_day: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="salary-section">
                    <h4>Salary Components</h4>
                    <div className="component-row">
                      <span className="comp-name">Basic Salary</span>
                      <div className="comp-inputs">
                        <input
                          type="number"
                          step="0.01"
                          value={salaryData.basic_percentage}
                          onChange={(e) => setSalaryData({...salaryData, basic_percentage: e.target.value})}
                        />
                        <span>% of wage</span>
                        <span className="comp-value">
                          ₹{calculateSalary(salaryData).basic.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="component-row">
                      <span className="comp-name">House Rent Allowance</span>
                      <div className="comp-inputs">
                        <input
                          type="number"
                          step="0.01"
                          value={salaryData.hra_percentage}
                          onChange={(e) => setSalaryData({...salaryData, hra_percentage: e.target.value})}
                        />
                        <span>% of basic</span>
                        <span className="comp-value">
                          ₹{calculateSalary(salaryData).hra.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="component-row">
                      <span className="comp-name">Standard Allowance</span>
                      <div className="comp-inputs">
                        <input
                          type="number"
                          value={salaryData.standard_allowance}
                          onChange={(e) => setSalaryData({...salaryData, standard_allowance: e.target.value})}
                        />
                        <span>₹ / month</span>
                      </div>
                    </div>
                    <div className="component-row">
                      <span className="comp-name">Performance Bonus</span>
                      <div className="comp-inputs">
                        <input
                          type="number"
                          step="0.01"
                          value={salaryData.performance_bonus_percentage}
                          onChange={(e) => setSalaryData({...salaryData, performance_bonus_percentage: e.target.value})}
                        />
                        <span>% of basic</span>
                        <span className="comp-value">
                          ₹{calculateSalary(salaryData).perf.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="component-row">
                      <span className="comp-name">Leave Travel Allowance</span>
                      <div className="comp-inputs">
                        <input
                          type="number"
                          step="0.01"
                          value={salaryData.leave_travel_allowance_percentage}
                          onChange={(e) => setSalaryData({...salaryData, leave_travel_allowance_percentage: e.target.value})}
                        />
                        <span>% of basic</span>
                        <span className="comp-value">
                          ₹{calculateSalary(salaryData).lta.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="component-row">
                      <span className="comp-name">Food Allowance</span>
                      <div className="comp-inputs">
                        <input
                          type="number"
                          value={salaryData.food_allowance}
                          onChange={(e) => setSalaryData({...salaryData, food_allowance: e.target.value})}
                        />
                        <span>₹ / month</span>
                      </div>
                    </div>
                  </div>

                  <div className="salary-section">
                    <h4>Deductions</h4>
                    <div className="component-row">
                      <span className="comp-name">PF (Employee)</span>
                      <div className="comp-inputs">
                        <input
                          type="number"
                          step="0.01"
                          value={salaryData.pf_employee_percentage}
                          onChange={(e) => setSalaryData({...salaryData, pf_employee_percentage: e.target.value})}
                        />
                        <span>% of basic</span>
                        <span className="comp-value deduction">
                          -₹{calculateSalary(salaryData).pf.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="component-row">
                      <span className="comp-name">PF (Employer)</span>
                      <div className="comp-inputs">
                        <input
                          type="number"
                          step="0.01"
                          value={salaryData.pf_employer_percentage}
                          onChange={(e) => setSalaryData({...salaryData, pf_employer_percentage: e.target.value})}
                        />
                        <span>% of basic</span>
                      </div>
                    </div>
                    <div className="component-row">
                      <span className="comp-name">Professional Tax</span>
                      <div className="comp-inputs">
                        <input
                          type="number"
                          value={salaryData.professional_tax}
                          onChange={(e) => setSalaryData({...salaryData, professional_tax: e.target.value})}
                        />
                        <span>₹ / month</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : salary ? (
                <div className="salary-display">
                  <div className="salary-header-info">
                    <div className="wage-box">
                      <span className="wage-label">Monthly Wage</span>
                      <span className="wage-value">₹{parseFloat(salary.monthly_wage).toLocaleString()}</span>
                    </div>
                    <div className="wage-box">
                      <span className="wage-label">Yearly Wage</span>
                      <span className="wage-value">₹{parseFloat(salary.yearly_wage).toLocaleString()}</span>
                    </div>
                    <div className="wage-box small">
                      <span className="wage-label">Working Days/Week</span>
                      <span className="wage-value">{salary.working_days_per_week}</span>
                    </div>
                    <div className="wage-box small">
                      <span className="wage-label">Hours/Day</span>
                      <span className="wage-value">{salary.working_hours_per_day}</span>
                    </div>
                  </div>

                  <div className="salary-breakdown">
                    <div className="breakdown-section">
                      <h4>Salary Components</h4>
                      <table className="salary-table">
                        <thead>
                          <tr>
                            <th>Component</th>
                            <th>Type</th>
                            <th>Amount (₹/month)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Basic Salary</td>
                            <td>{salary.basic_percentage}% of wage</td>
                            <td>₹{parseFloat(salary.basic_salary).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>House Rent Allowance</td>
                            <td>{salary.hra_percentage}% of basic</td>
                            <td>₹{parseFloat(salary.hra).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Standard Allowance</td>
                            <td>Fixed</td>
                            <td>₹{parseFloat(salary.standard_allowance).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Performance Bonus</td>
                            <td>{salary.performance_bonus_percentage}% of basic</td>
                            <td>₹{parseFloat(salary.performance_bonus).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Leave Travel Allowance</td>
                            <td>{salary.leave_travel_allowance_percentage}% of basic</td>
                            <td>₹{parseFloat(salary.leave_travel_allowance).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Food Allowance</td>
                            <td>Fixed</td>
                            <td>₹{parseFloat(salary.food_allowance).toLocaleString()}</td>
                          </tr>
                          <tr className="total-row">
                            <td colSpan="2">Total Earnings</td>
                            <td>₹{parseFloat(salary.total_earnings).toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="breakdown-section deductions">
                      <h4>Deductions</h4>
                      <table className="salary-table">
                        <thead>
                          <tr>
                            <th>Deduction</th>
                            <th>Type</th>
                            <th>Amount (₹/month)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Provident Fund (Employee)</td>
                            <td>{salary.pf_employee_percentage}% of basic</td>
                            <td className="deduction-value">-₹{parseFloat(salary.pf_employee).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Provident Fund (Employer)</td>
                            <td>{salary.pf_employer_percentage}% of basic</td>
                            <td>₹{parseFloat(salary.pf_employer).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Professional Tax</td>
                            <td>Fixed</td>
                            <td className="deduction-value">-₹{parseFloat(salary.professional_tax).toLocaleString()}</td>
                          </tr>
                          <tr className="total-row">
                            <td colSpan="2">Total Deductions</td>
                            <td className="deduction-value">-₹{parseFloat(salary.total_deductions).toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="net-salary-box">
                      <span className="net-label">Net Salary (Take Home)</span>
                      <span className="net-value">₹{parseFloat(salary.net_salary).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-salary-state">
                  <HiOutlineCurrencyDollar className="no-salary-icon" />
                  <p>No salary structure defined for this employee.</p>
                  <button className="set-salary-btn" onClick={handleEditSalary}>
                    <HiOutlinePlus /> Set Salary Structure
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
