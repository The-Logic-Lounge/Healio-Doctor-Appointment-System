import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import {
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  WalletOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "../styles/BookingPage.css";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  // fetch single doctor info
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  // handle availability check
  const handleAvailability = async () => {
    try {
      if (!date || !time) {
        return message.warning("Please select both Date and Time first");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availbility",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message || "Appointment available at this time!");
      } else {
        setIsAvailable(false);
        message.error(res.data.message || "Not available at this time");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Error checking availability");
    }
  };

  // handle booking submission
  const handleBooking = async () => {
    try {
      if (!date || !time) {
        return message.warning("Please select Date and Time");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user?._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message || "Appointment booked successfully!");
        navigate("/appointments");
      } else {
        message.error(res.data.message || "Booking failed");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Error booking appointment");
    }
  };

  useEffect(() => {
    if (params.doctorId) {
      getDoctorData();
    }
    //eslint-disable-next-line
  }, [params.doctorId]);

  const initial = (doctor?.firstName || "D").charAt(0).toUpperCase();

  return (
    <Layout>
      <div className="booking-page">
        {/* Back Link & Header */}
        <button
          className="booking-back-btn"
          type="button"
          onClick={() => navigate("/")}
        >
          <ArrowLeftOutlined /> Back to Doctors
        </button>

        <div className="booking-page-header">
          <div>
            <p className="booking-eyebrow">APPOINTMENT BOOKING</p>
            <h1>Schedule Your Visit</h1>
            <p className="booking-subtitle">
              Choose a convenient time with your selected healthcare professional.
            </p>
          </div>
          <div className="booking-step">
            <span>01</span> Select date &amp; time
          </div>
        </div>

        <div className="booking-layout">
          {/* Doctor Details Summary Card */}
          {doctor && (
            <section className="doctor-summary">
              <div className="doctor-summary-topline">
                <div className="booking-doctor-avatar">{initial}</div>
                <span className="verified-label">
                  <SafetyCertificateOutlined /> Verified Doctor
                </span>
              </div>

              <p className="summary-label">SELECTED HEALTHCARE PROVIDER</p>
              <h2>
                Dr. {doctor.firstName} {doctor.lastName}
              </h2>
              <p className="doctor-specialty">
                <MedicineBoxOutlined />{" "}
                {doctor.specialization || "General Physician"}
              </p>

              <div className="doctor-summary-details">
                <div>
                  <WalletOutlined />
                  <span>
                    <small>Consultation Fee</small>
                    <strong>
                      Rs. {doctor.feesPerCunsaltation || "3,000"}
                    </strong>
                  </span>
                </div>

                <div>
                  <ClockCircleOutlined />
                  <span>
                    <small>Available Hours</small>
                    <strong>
                      {doctor.timings && doctor.timings[0]} -{" "}
                      {doctor.timings && doctor.timings[1]}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="summary-note">
                <CheckCircleFilled /> Your consultation details are encrypted and
                strictly confidential.
              </div>
            </section>
          )}

          {/* Booking Preference Card */}
          <section className="booking-form-card">
            <div className="form-card-header">
              <div>
                <p className="booking-eyebrow">CHOOSE SLOT</p>
                <h2>Find an available time</h2>
              </div>
              <CalendarOutlined className="calendar-header-icon" />
            </div>

            <div className="booking-fields">
              <label className="picker-label">Appointment Date</label>
              <DatePicker
                aria-required="true"
                className="booking-picker"
                format="DD-MM-YYYY"
                placeholder="Select appointment date"
                onChange={(value) => {
                  setDate(value ? moment(value).format("DD-MM-YYYY") : "");
                  setIsAvailable(false);
                }}
              />

              <label className="picker-label">Preferred Time Slot</label>
              <TimePicker
                aria-required="true"
                format="HH:mm"
                className="booking-picker"
                placeholder="Select preferred time"
                onChange={(value) => {
                  setTime(value ? moment(value).format("HH:mm") : "");
                  setIsAvailable(false);
                }}
              />

              <button
                className={`availability-button ${isAvailable ? "availability-checked" : ""}`}
                type="button"
                onClick={handleAvailability}
              >
                {isAvailable ? "✓ Slot Available (Re-check)" : "Check Availability"}
              </button>

              <button
                className="booking-submit-button"
                type="button"
                onClick={handleBooking}
              >
                Book Appointment Now
              </button>
            </div>

            <p className="booking-form-footnote">
              You will receive real-time notifications on your appointment status.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
