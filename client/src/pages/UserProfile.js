import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { Avatar } from "antd";
import axios from "axios";

import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EditOutlined,
  LockOutlined,
} from "@ant-design/icons";

import "../styles/UserProfile.css";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const res = await axios.get("/api/v1/user/user-appointments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setAppointments(res.data.data || []);
        }
      } catch (error) {
        console.log("Error fetching appointments:", error);
      }
    };

    if (user?._id) {
      getAppointments();
    }
  }, [user?._id]);

  const totalAppointments = appointments.length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  return (
    <Layout>
      <div className="user-profile-page">
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
              <Avatar size={100} className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </div>

            <div className="profile-identity-info">
              <div className="profile-name-row">
                <h2>{user?.name || "User"}</h2>
                <span className="role-badge">Patient</span>
              </div>

              <div className="profile-contact">
                <span>
                  <MailOutlined />
                  {user?.email || "No email available"}
                </span>

                <span>
                  <PhoneOutlined />
                  Not provided
                </span>

                <span>
                  <CalendarOutlined />
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-message">
            <span>“</span>
            <p>A healthier you, a brighter tomorrow.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-content-grid">
          {/* Personal Information */}
          <div className="profile-info-card">
            <div className="card-heading">
              <div>
                <UserOutlined />
                <h3>Personal Information</h3>
              </div>

              <button className="edit-profile-btn">
                <EditOutlined />
                Edit Profile
              </button>
            </div>

            <div className="info-list">
              <div className="profile-info-row">
                <div className="info-icon">
                  <UserOutlined />
                </div>

                <div>
                  <small>Full Name</small>
                  <strong>{user?.name || "Not available"}</strong>
                </div>
              </div>

              <div className="profile-info-row">
                <div className="info-icon">
                  <MailOutlined />
                </div>

                <div>
                  <small>Email Address</small>
                  <strong>{user?.email || "Not available"}</strong>
                </div>
              </div>

              <div className="profile-info-row">
                <div className="info-icon">
                  <PhoneOutlined />
                </div>

                <div>
                  <small>Phone Number</small>
                  <strong>Not provided</strong>
                </div>
              </div>

              <div className="profile-info-row">
                <div className="info-icon">
                  <UserOutlined />
                </div>

                <div>
                  <small>Account Type</small>
                  <strong>Patient</strong>
                </div>
              </div>

              <div className="profile-info-row">
                <div className="info-icon">
                  <CalendarOutlined />
                </div>

                <div>
                  <small>Member Since</small>
                  <strong>{memberSince}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="profile-side-column">
            {/* Appointment Statistics */}
            <div className="profile-info-card">
              <div className="card-heading simple-heading">
                <div>
                  <CalendarOutlined />
                  <h3>Appointment Statistics</h3>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-box blue">
                  <CalendarOutlined />
                  <strong>{totalAppointments}</strong>
                  <span>Total Appointments</span>
                </div>

                <div className="stat-box green">
                  <span className="check-icon">✓</span>
                  <strong>{completedAppointments}</strong>
                  <span>Completed</span>
                </div>

                <div className="stat-box orange">
                  <span className="clock-icon">◷</span>
                  <strong>{pendingAppointments}</strong>
                  <span>Pending</span>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="profile-info-card">
              <div className="card-heading simple-heading">
                <div>
                  <LockOutlined />
                  <h3>Account Actions</h3>
                </div>
              </div>

              <div className="account-action">
                <div className="action-icon edit">
                  <EditOutlined />
                </div>

                <div>
                  <strong>Edit Profile</strong>
                  <small>Update your personal information</small>
                </div>

                <span>›</span>
              </div>

              <div className="account-action">
                <div className="action-icon password">
                  <LockOutlined />
                </div>

                <div>
                  <strong>Change Password</strong>
                  <small>Keep your account secure</small>
                </div>

                <span>›</span>
              </div>
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

            <a href="/appointments" className="view-all-link">
              View All
            </a>
          </div>

          {appointments.length === 0 ? (
            <div className="no-appointments">
              <CalendarOutlined />
              <p>No appointments found.</p>
            </div>
          ) : (
            <div className="recent-appointments-list">
              {appointments.slice(0, 3).map((appointment) => (
                <div className="recent-appointment" key={appointment._id}>
                  <Avatar className="doctor-avatar">
                    {appointment.doctorInfo?.firstName
                      ?.charAt(0)
                      .toUpperCase() || "D"}
                  </Avatar>

                  <div className="appointment-doctor">
                    <strong>
                      Dr. {appointment.doctorInfo?.firstName || "Doctor"}{" "}
                      {appointment.doctorInfo?.lastName || ""}
                    </strong>

                    <small>
                      {appointment.doctorInfo?.specialization || "Doctor"}
                    </small>
                  </div>

                  <div className="appointment-date">
                    <span>{appointment.date}</span>
                    <small>{appointment.time}</small>
                  </div>

                  <span className={`appointment-status ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="profile-footer">
          <span>© 2026 MedBook. All rights reserved.</span>

          <span>♥ Better Care. A Healthier Tomorrow.</span>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
