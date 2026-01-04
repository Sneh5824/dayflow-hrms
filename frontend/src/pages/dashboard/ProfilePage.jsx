import { useState, useEffect } from "react";
import { useAuth } from "../../auth/useAuth";
import { updateCurrentUser } from "../../services/api";
import { 
  HiOutlineUser, 
  HiOutlineLockClosed, 
  HiOutlineCog,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX
} from "react-icons/hi";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
    setSaveMessage(null);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset to original values
    setFormData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);
    
    try {
      await updateCurrentUser(formData);
      // Refresh user data in auth context
      if (refreshUser) {
        await refreshUser();
      }
      setEditing(false);
      setSaveMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setSaveMessage({ type: "error", text: err.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      {saveMessage && (
        <div className={`profile-toast ${saveMessage.type}`}>
          {saveMessage.text}
        </div>
      )}
      
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-card-main">
            <div className="profile-avatar-xl">
              {user?.first_name?.charAt(0) || user?.username?.charAt(0) || "U"}
            </div>
            <h2>
              {`${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
                user?.username ||
                "User"}
            </h2>
            <p className="profile-role">{user?.role || "Employee"}</p>
            <p className="profile-email-main">
              {user?.email || "user@example.com"}
            </p>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-btn ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <HiOutlineUser /> Profile Info
            </button>
            <button
              className={`nav-btn ${
                activeTab === "security" ? "active" : ""
              }`}
              onClick={() => setActiveTab("security")}
            >
              <HiOutlineLockClosed /> Security
            </button>
            <button
              className={`nav-btn ${
                activeTab === "preferences" ? "active" : ""
              }`}
              onClick={() => setActiveTab("preferences")}
            >
              <HiOutlineCog /> Preferences
            </button>
          </nav>
        </div>

        <div className="profile-main">
          {activeTab === "profile" && (
            <div className="profile-section">
              <div className="section-header">
                <h3>Personal Information</h3>
                {!editing ? (
                  <button className="edit-btn" onClick={handleEdit}>
                    <HiOutlinePencil /> Edit
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave} disabled={saving}>
                      <HiOutlineCheck /> {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="cancel-btn" onClick={handleCancel} disabled={saving}>
                      <HiOutlineX /> Cancel
                    </button>
                  </div>
                )}
              </div>
              
              <div className="info-grid">
                <div className="info-item">
                  <label>First Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className="info-value">
                      {user?.first_name || "-"}
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <label>Last Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="info-value">
                      {user?.last_name || "-"}
                    </div>
                  )}
                </div>
                <div className="info-item">
                  <label>Email</label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                  ) : (
                    <div className="info-value">{user?.email || "-"}</div>
                  )}
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="info-value">{user?.phone || "-"}</div>
                  )}
                </div>
                <div className="info-item">
                  <label>Username</label>
                  <div className="info-value">{user?.username || "-"}</div>
                </div>
                <div className="info-item">
                  <label>Role</label>
                  <div className="info-value">{user?.role || "Employee"}</div>
                </div>
                <div className="info-item">
                  <label>Employee ID</label>
                  <div className="info-value">
                    {user?.employee_id || "-"}
                  </div>
                </div>
                <div className="info-item">
                  <label>Joined</label>
                  <div className="info-value">
                    {user?.date_joined 
                      ? new Date(user.date_joined).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="profile-section">
              <h3>Security Settings</h3>
              <div className="security-item">
                <div className="security-info">
                  <h4>Change Password</h4>
                  <p>
                    Update your password regularly to keep your account secure
                  </p>
                </div>
                <button className="btn-secondary">Change Password</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button className="btn-secondary">Enable 2FA</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h4>Active Sessions</h4>
                  <p>Manage your active sessions across devices</p>
                </div>
                <button className="btn-secondary">View Sessions</button>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="profile-section">
              <h3>Preferences</h3>
              <div className="preference-item">
                <div className="preference-info">
                  <h4>Email Notifications</h4>
                  <p>
                    Receive email updates about your schedule and leaves
                  </p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <div className="preference-info">
                  <h4>Push Notifications</h4>
                  <p>Get push notifications for important updates</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <div className="preference-info">
                  <h4>Dark Mode</h4>
                  <p>Use dark theme for the application</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
