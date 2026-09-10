import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import moment from "moment";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import "../styles/Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <Layout>
      <div className="appointments-page">
        <div className="appointments-page-header">
          <div>
            <p className="appointments-eyebrow">PATIENT PORTAL</p>
            <h1>My appointments</h1>
            <p className="appointments-subtitle">
              Keep track of your upcoming visits and care history.
            </p>
          </div>
          <div className="appointments-summary">
            <CalendarOutlined />
            <div>
              <strong>{appointments.length}</strong>
              <span>Total visits</span>
            </div>
          </div>
        </div>

        <div className="appointments-toolbar">
          <div>
            <h2>Appointment history</h2>
            <p>Your scheduled consultations in one place.</p>
          </div>
          <span className="appointments-count">
            {appointments.length}{" "}
            {appointments.length === 1 ? "appointment" : "appointments"}
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="appointments-empty">
            <div className="appointments-empty-icon">
              <CalendarOutlined />
            </div>
            <h3>No appointments yet</h3>
            <p>
              Your scheduled visits will appear here when you book a doctor.
            </p>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map((appointment) => {
              const doctor = appointment.doctorInfo || {};
              const status = appointment.status || "pending";
              const statusIcon =
                status === "approved" || status === "completed" ? (
                  <CheckCircleOutlined />
                ) : status === "reject" || status === "rejected" ? (
                  <CloseCircleOutlined />
                ) : (
                  <ClockCircleOutlined />
                );

              return (
                <article className="appointment-card" key={appointment._id}>
                  <div className="appointment-date-block">
                    <span>{moment(appointment.date).format("MMM")}</span>
                    <strong>{moment(appointment.date).format("DD")}</strong>
                    <small>{moment(appointment.date).format("YYYY")}</small>
                  </div>

                  <div className="appointment-details">
                    <div className="appointment-title-row">
                      <div>
                        <p className="appointment-label">CONSULTATION</p>
                        <h3>
                          Dr. {doctor.firstName || "Doctor"}{" "}
                          {doctor.lastName || ""}
                        </h3>
                      </div>
                      <span className={`appointment-status ${status}`}>
                        {statusIcon}
                        {status}
                      </span>
                    </div>

                    <div className="appointment-meta">
                      <span>
                        <FileTextOutlined />
                        {doctor.specialization || "General consultation"}
                      </span>
                      <span>
                        <ClockCircleOutlined />
                        {appointment.time || "Time to be confirmed"}
                      </span>
                    </div>
                  </div>

                  <div className="appointment-reference">
                    <span>Reference</span>
                    <strong>#{String(appointment._id).slice(-8)}</strong>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Appointments;
