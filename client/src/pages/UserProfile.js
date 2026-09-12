import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import axios from "axios";
import moment from "moment";

import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EditOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import "../styles/UserProfile.css";

// ─── Small reusable helpers ──────────────────────────────────────────────────

const Toast = ({ type, message, onClose }) => (
  <div className={`up-toast up-toast-${type}`} role="alert">
    <span>{type === "success" ? "✓" : "✕"} {message}</span>
    <button className="up-toast-close" onClick={onClose} aria-label="Dismiss">
      <CloseOutlined />
    </button>
  </div>
);

const SkeletonRow = () => (
  <div className="up-skeleton-row">
    <div className="up-skeleton-icon" />
    <div className="up-skeleton-text">
      <div className="up-skeleton-line short" />
      <div className="up-skeleton-line" />
    </div>
  </div>
);

// ─── Edit Profile Modal ──────────────────────────────────────────────────────

const EditProfileModal = ({ user, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters.";
    if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid phone number.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setFeedback(null);
    try {
      const res = await axios.put(
        "/api/v1/user/update-profile",
        { name: form.name.trim(), phone: form.phone.trim() },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) {
        setFeedback({ type: "success", msg: "Profile updated successfully!" });
        setTimeout(() => {
          onSuccess(res.data.data);
          onClose();
        }, 900);
      } else {
        setFeedback({ type: "error", msg: res.data.message || "Update failed." });
      }
    } catch (err) {
      setFeedback({ type: "error", msg: err.response?.data?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="up-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Edit Profile">
      <div className="up-modal" onClick={(e) => e.stopPropagation()}>
        <div className="up-modal-header">
          <div className="up-modal-title-row">
            <div className="up-modal-icon edit"><EditOutlined /></div>
            <h2>Edit Profile</h2>
          </div>
          <button className="up-modal-close" onClick={onClose} aria-label="Close modal">
            <CloseOutlined />
          </button>
        </div>

        {feedback && (
          <div className={`up-inline-msg up-inline-${feedback.type}`}>
            {feedback.msg}
          </div>
        )}

        <form className="up-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="up-form-group">
            <label htmlFor="edit-name">Full Name <span className="up-required">*</span></label>
            <input
              id="edit-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              className={errors.name ? "up-input-error" : ""}
              autoComplete="name"
            />
            {errors.name && <span className="up-field-error">{errors.name}</span>}
          </div>

          <div className="up-form-group">
            <label htmlFor="edit-email">Email Address</label>
            <input
              id="edit-email"
              type="email"
              value={user?.email || ""}
              disabled
              className="up-input-disabled"
              title="Email cannot be changed"
            />
            <span className="up-field-hint">Email address cannot be changed.</span>
          </div>

          <div className="up-form-group">
            <label htmlFor="edit-phone">Phone Number</label>
            <input
              id="edit-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 234 567 8900"
              className={errors.phone ? "up-input-error" : ""}
              autoComplete="tel"
            />
            {errors.phone && <span className="up-field-error">{errors.phone}</span>}
          </div>

          <div className="up-modal-actions">
            <button type="button" className="up-btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="up-btn-primary" disabled={loading}>
              {loading ? <span className="up-spinner" /> : null}
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Change Password Modal ───────────────────────────────────────────────────

const ChangePasswordModal = ({ onClose }) => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ current: false, newP: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = "Current password is required.";
    if (!form.newPassword || form.newPassword.length < 6)
      errs.newPassword = "New password must be at least 6 characters.";
    if (form.newPassword === form.currentPassword)
      errs.newPassword = "New password must differ from current password.";
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your new password.";
    else if (form.confirmPassword !== form.newPassword)
      errs.confirmPassword = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setFeedback(null);
    try {
      const res = await axios.put(
        "/api/v1/user/change-password",
        { currentPassword: form.currentPassword, newPassword: form.newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) {
        setFeedback({ type: "success", msg: "Password changed successfully!" });
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(onClose, 1400);
      } else {
        setFeedback({ type: "error", msg: res.data.message || "Failed to change password." });
      }
    } catch (err) {
      setFeedback({ type: "error", msg: err.response?.data?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const PasswordField = ({ id, label, field, showKey, required }) => (
    <div className="up-form-group">
      <label htmlFor={id}>{label}{required && <span className="up-required"> *</span>}</label>
      <div className="up-password-wrapper">
        <input
          id={id}
          type={show[showKey] ? "text" : "password"}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          placeholder="••••••••"
          className={errors[field] ? "up-input-error" : ""}
          autoComplete={field === "currentPassword" ? "current-password" : "new-password"}
        />
        <button
          type="button"
          className="up-toggle-eye"
          onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
          aria-label={show[showKey] ? "Hide password" : "Show password"}
        >
          {show[showKey] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </button>
      </div>
      {errors[field] && <span className="up-field-error">{errors[field]}</span>}
    </div>
  );

  return (
    <div className="up-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Change Password">
      <div className="up-modal" onClick={(e) => e.stopPropagation()}>
        <div className="up-modal-header">
          <div className="up-modal-title-row">
            <div className="up-modal-icon password"><LockOutlined /></div>
            <h2>Change Password</h2>
          </div>
          <button className="up-modal-close" onClick={onClose} aria-label="Close modal">
            <CloseOutlined />
          </button>
        </div>

        {feedback && (
          <div className={`up-inline-msg up-inline-${feedback.type}`}>
            {feedback.msg}
          </div>
        )}

        <form className="up-modal-form" onSubmit={handleSubmit} noValidate>
          <PasswordField id="pw-current" label="Current Password" field="currentPassword" showKey="current" required />
          <PasswordField id="pw-new" label="New Password" field="newPassword" showKey="newP" required />
          <PasswordField id="pw-confirm" label="Confirm New Password" field="confirmPassword" showKey="confirm" required />

          <div className="up-modal-actions">
            <button type="button" className="up-btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="up-btn-primary up-btn-purple" disabled={loading}>
              {loading ? <span className="up-spinner" /> : null}
              {loading ? "Updating…" : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAppointments = useCallback(async () => {
    if (!user?._id) return;
    setAppointmentsLoading(true);
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setAppointments(res.data.data || []);
      }
    } catch (error) {
      console.log("Error fetching appointments:", error);
    } finally {
      setAppointmentsLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Stats
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed" || a.status === "approved"
  ).length;
  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  ).length;
  const cancelledAppointments = appointments.filter(
    (a) => a.status === "reject" || a.status === "rejected" || a.status === "cancelled"
  ).length;

  // User display info
  const userRole = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "Patient";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "Not available";

  // After a successful profile edit, update Redux
  const handleProfileSuccess = (updatedUser) => {
    dispatch(setUser(updatedUser));
    showToast("success", "Profile updated successfully!");
  };

  // Status badge helper
  const getStatusLabel = (status) => {
    switch (status) {
      case "approved": return { label: "Approved", cls: "status-approved" };
      case "completed": return { label: "Completed", cls: "status-completed" };
      case "pending": return { label: "Pending", cls: "status-pending" };
      case "reject":
      case "rejected":
        return { label: "Rejected", cls: "status-rejected" };
      case "cancelled": return { label: "Cancelled", cls: "status-cancelled" };
      default: return { label: status, cls: "status-pending" };
    }
  };

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  return (
    <Layout>
      <div className="user-profile-page">

        {/* Toast */}
        {toast && (
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        )}

        {/* Page Header */}
        <div className="profile-page-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your personal information and account details.</p>
          </div>
          <div className="profile-breadcrumb">
            Home <span>›</span> Profile
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="profile-main-card">
          <div className="profile-identity">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-circle">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>

            <div className="profile-identity-info">
              <div className="profile-name-row">
                <h2>{user?.name || "User"}</h2>
                <span className={`role-badge role-${userRole.toLowerCase()}`}>{userRole}</span>
              </div>

              <div className="profile-contact">
                <span>
                  <MailOutlined />
                  {user?.email || "No email available"}
                </span>
                <span>
                  <PhoneOutlined />
                  {user?.phone || "Not provided"}
                </span>
                <span>
                  <CalendarOutlined />
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-header-actions">
            <button
              className="up-btn-primary"
              onClick={() => setEditOpen(true)}
              aria-label="Edit profile"
            >
              <EditOutlined /> Edit Profile
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="profile-content-grid">
          {/* Personal Information */}
          <div className="profile-info-card">
            <div className="card-heading">
              <div>
                <UserOutlined />
                <h3>Personal Information</h3>
              </div>
              <button className="edit-profile-btn" onClick={() => setEditOpen(true)}>
                <EditOutlined /> Edit Profile
              </button>
            </div>

            <div className="info-list">
              <div className="profile-info-row">
                <div className="info-icon"><UserOutlined /></div>
                <div>
                  <small>Full Name</small>
                  <strong>{user?.name || "Not available"}</strong>
                </div>
              </div>

              <div className="profile-info-row">
                <div className="info-icon"><MailOutlined /></div>
                <div>
                  <small>Email Address</small>
                  <strong>{user?.email || "Not available"}</strong>
                </div>
              </div>

              <div className="profile-info-row">
                <div className="info-icon"><PhoneOutlined /></div>
                <div>
                  <small>Phone Number</small>
                  <strong>{user?.phone || <span className="up-muted-val">Not provided — click Edit Profile to add</span>}</strong>
                </div>
              </div>

              <div className="profile-info-row">
                <div className="info-icon"><UserOutlined /></div>
                <div>
                  <small>Account Type</small>
                  <strong>{userRole}</strong>
                </div>
              </div>

              <div className="profile-info-row">
                <div className="info-icon"><CalendarOutlined /></div>
                <div>
                  <small>Member Since</small>
                  <strong>{memberSince}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="profile-side-column">
            {/* Appointment Statistics */}
            <div className="profile-info-card">
              <div className="card-heading simple-heading">
                <div>
                  <CalendarOutlined />
                  <h3>Appointment Statistics</h3>
                </div>
              </div>

              {appointmentsLoading ? (
                <div className="stats-skeleton">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="stat-box-skeleton" />
                  ))}
                </div>
              ) : (
                <div className="stats-grid">
                  <div className="stat-box stat-total">
                    <div className="stat-icon-wrap"><CalendarOutlined /></div>
                    <div>
                      <strong>{totalAppointments}</strong>
                      <span>Total</span>
                    </div>
                  </div>

                  <div className="stat-box stat-completed">
                    <div className="stat-icon-wrap"><CheckCircleOutlined /></div>
                    <div>
                      <strong>{completedAppointments}</strong>
                      <span>Completed</span>
                    </div>
                  </div>

                  <div className="stat-box stat-pending">
                    <div className="stat-icon-wrap"><ClockCircleOutlined /></div>
                    <div>
                      <strong>{pendingAppointments}</strong>
                      <span>Pending</span>
                    </div>
                  </div>

                  <div className="stat-box stat-cancelled">
                    <div className="stat-icon-wrap"><CloseCircleOutlined /></div>
                    <div>
                      <strong>{cancelledAppointments}</strong>
                      <span>Cancelled</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div className="profile-info-card">
              <div className="card-heading simple-heading">
                <div>
                  <LockOutlined />
                  <h3>Account Actions</h3>
                </div>
              </div>

              <button
                className="account-action"
                onClick={() => setEditOpen(true)}
                type="button"
              >
                <div className="action-icon edit"><EditOutlined /></div>
                <div>
                  <strong>Edit Profile</strong>
                  <small>Update your personal information</small>
                </div>
                <span className="action-chevron">›</span>
              </button>

              <button
                className="account-action"
                onClick={() => setPasswordOpen(true)}
                type="button"
              >
                <div className="action-icon password"><LockOutlined /></div>
                <div>
                  <strong>Change Password</strong>
                  <small>Keep your account secure</small>
                </div>
                <span className="action-chevron">›</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="profile-info-card recent-appointments-card">
          <div className="card-heading">
            <div>
              <CalendarOutlined />
              <h3>Recent Appointments</h3>
            </div>
            <Link to="/appointments" className="view-all-link">
              View All →
            </Link>
          </div>

          {appointmentsLoading ? (
            <div className="recent-appointments-list">
              {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="no-appointments">
              <div className="no-appt-icon">
                <CalendarOutlined />
              </div>
              <h4>No appointments yet</h4>
              <p>Your upcoming and past appointments will appear here.</p>
              <button
                className="up-btn-primary"
                onClick={() => navigate("/")}
                type="button"
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="recent-appointments-list">
              {recentAppointments.map((appointment) => {
                const { label, cls } = getStatusLabel(appointment.status);
                return (
                  <div className="recent-appointment" key={appointment._id}>
                    <div className="appt-avatar">
                      {appointment.doctorInfo?.firstName?.charAt(0).toUpperCase() || "D"}
                    </div>

                    <div className="appointment-doctor">
                      <strong>
                        Dr. {appointment.doctorInfo?.firstName || "Doctor"}{" "}
                        {appointment.doctorInfo?.lastName || ""}
                      </strong>
                      <small>{appointment.doctorInfo?.specialization || "General Consultation"}</small>
                    </div>

                    <div className="appointment-date">
                      <span>{moment(appointment.date).format("DD MMM YYYY")}</span>
                      <small>{moment(appointment.time).format("hh:mm A")}</small>
                    </div>

                    <span className={`appointment-status-badge ${cls}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="profile-footer">
          <span>© 2026 MedBook. All rights reserved.</span>
          <span>♥ Better Care. A Healthier Tomorrow.</span>
        </div>
      </div>

      {/* Modals */}
      {editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSuccess={handleProfileSuccess}
        />
      )}
      {passwordOpen && (
        <ChangePasswordModal onClose={() => setPasswordOpen(false)} />
      )}
    </Layout>
  );
};

export default UserProfile;
