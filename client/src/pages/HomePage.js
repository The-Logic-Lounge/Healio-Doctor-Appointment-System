import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import DoctorList from "../components/DoctorList";
import AppointmentBookingModal from "../components/AppointmentBookingModal";
import {
  ArrowRightOutlined,
  CheckCircleFilled,
  HeartFilled,
  SafetyCertificateFilled,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import "../styles/HomePage.css";

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  const handleOpenBookingModal = (doctor) => {
    setSelectedDoctorForBooking(doctor);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDoctorForBooking(null);
  };

  // login user data / get all doctors
  const getDoctorsData = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const scrollToDoctors = () => {
    const el = document.getElementById("doctors-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const displayName = (user?.name || "UME MARYAM").toUpperCase();

  return (
    <Layout>
      <div className="home-page">
        {/* Hero Section */}
        <section className="home-hero">
          <div className="hero-content">
            <span className="hero-badge">
              WELCOME BACK, {displayName}{" "}
              <span aria-hidden="true" className="wave-emoji">
                👋
              </span>
            </span>

            <h1>
              Book Your Appointment
              <br />
              with <span className="hero-highlight">Trusted Doctors</span>
            </h1>

            <p className="hero-description">
              Your health matters. Find the right doctor, at the right time.
            </p>

            <div className="hero-trust-list">
              <span>
                <SafetyCertificateFilled className="trust-icon" /> Verified
                Doctors
              </span>
              <span>
                <ThunderboltFilled className="trust-icon" /> Easy Booking
              </span>
              <span>
                <HeartFilled className="trust-icon" /> Better Healthcare
              </span>
            </div>

            <button
              className="hero-cta-button"
              type="button"
              onClick={scrollToDoctors}
            >
              Find a Doctor <ArrowRightOutlined />
            </button>
          </div>

          {/* Hero Illustration & Decorative Rings */}
          <div className="hero-illustration" aria-hidden="true">
            <div className="hero-top-tag">
              <span>Healthy People</span>
              <span>Happier Tomorrows</span>
              <div className="hero-tag-underline" />
            </div>

            <div className="hero-ring hero-ring-large" />
            <div className="hero-ring hero-ring-medium" />
            <div className="hero-ring hero-ring-small" />

            <div className="hero-doctor-shape">
              <div className="hero-doctor-head" />
              <div className="hero-doctor-body">
                <HeartFilled className="doctor-chest-icon" />
              </div>
            </div>

            <div className="hero-floating-card">
              <CheckCircleFilled className="floating-check-icon" />
              <div className="floating-card-text">
                <span>Trusted care</span>
                <strong>starts here</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section className="doctors-section" id="doctors-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">CARE TEAM</p>
              <h2>Our Doctors</h2>
              <p className="section-subtext">
                Meet our experienced and trusted healthcare professionals
              </p>
            </div>
            <button
              className="view-all-button"
              type="button"
              onClick={scrollToDoctors}
            >
              View All Doctors <ArrowRightOutlined />
            </button>
          </div>

          <div className="doctors-grid">
            {doctors && doctors.length > 0 ? (
              doctors.map((doctor) => (
                <DoctorList
                  doctor={doctor}
                  key={doctor._id}
                  onBookAppointment={handleOpenBookingModal}
                />
              ))
            ) : (
              <div className="doctors-empty">
                No doctors are available right now. Please check back soon.
              </div>
            )}
          </div>
        </section>

        {/* Appointment Booking Modal */}
        <AppointmentBookingModal
          doctor={selectedDoctorForBooking}
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
        />
      </div>
    </Layout>
  );
};

export default HomePage;
