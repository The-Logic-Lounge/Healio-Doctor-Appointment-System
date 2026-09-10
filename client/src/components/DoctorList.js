import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartFilled,
  HeartOutlined,
  MedicineBoxFilled,
  ShopFilled,
} from "@ant-design/icons";

const DoctorList = ({ doctor, onBookAppointment }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const doctorName =
    `Dr. ${doctor.firstName || "Doctor"} ${doctor.lastName || ""}`.trim();

  // Format experience string to avoid "years years" duplication
  const rawExp = doctor.experience || "5 years";
  const experienceText = String(rawExp).toLowerCase().includes("year")
    ? `${rawExp} experience`
    : `${rawExp} years experience`;

  const handleCardClick = () => {
    if (onBookAppointment) {
      onBookAppointment(doctor);
    } else {
      navigate(`/doctor/book-appointment/${doctor._id}`);
    }
  };

  const initial = (doctor.firstName || "D").charAt(0).toUpperCase();

  return (
    <article
      className="doctor-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCardClick();
        }
      }}
    >
      {/* Card Topline: Avatar & Favorite Heart */}
      <div className="doctor-card-topline">
        <div className="doctor-avatar" aria-hidden="true">
          {initial}
        </div>
        <button
          className={`favorite-button ${isFavorite ? "favorite-active" : ""}`}
          type="button"
          aria-label={`${isFavorite ? "Remove" : "Add"} ${doctorName} ${isFavorite ? "from" : "to"} favorites`}
          onClick={(event) => {
            event.stopPropagation();
            setIsFavorite((favorite) => !favorite);
          }}
        >
          {isFavorite ? <HeartFilled /> : <HeartOutlined />}
        </button>
      </div>

      {/* Doctor Name */}
      <div className="doctor-card-heading">
        <h3>{doctorName}</h3>
      </div>

      {/* Specialization */}
      <div className="doctor-card-specialization">
        <MedicineBoxFilled className="card-icon" />
        <span>{doctor.specialization || "General Physician"}</span>
      </div>

      {/* Experience */}
      <div className="doctor-card-experience">
        <ShopFilled className="card-icon" />
        <span>{experienceText}</span>
      </div>

      {/* Book Appointment Action Button */}
      <button
        className="doctor-card-btn"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onBookAppointment) {
            onBookAppointment(doctor);
          } else {
            handleCardClick();
          }
        }}
      >
        Book Appointment
      </button>
    </article>
  );
};

export default DoctorList;
