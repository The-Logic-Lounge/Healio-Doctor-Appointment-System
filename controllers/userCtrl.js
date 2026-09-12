const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");

// REGISTER
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(200).send({
        message: "User Already Exist",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new userModel({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).send({
      message: "Register Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// LOGIN
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isMatch) {
      return res.status(200).send({
        message: "Invalid Email or Password",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).send({
      message: "Login Success",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: `Error in Login CTRL ${error.message}`,
      success: false,
    });
  }
};

// AUTH
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({
      _id: req.body.userId,
    });

    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

// APPLY DOCTOR
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = new doctorModel({
      ...req.body,
      status: "pending",
    });

    await newDoctor.save();

    const adminUser = await userModel.findOne({
      isAdmin: true,
    });

    if (adminUser) {
      const notifcation = adminUser.notifcation || [];

      notifcation.push({
        type: "apply-doctor-request",
        message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
        data: {
          doctorId: newDoctor._id,
          name: `${newDoctor.firstName} ${newDoctor.lastName}`,
          onClickPath: "/admin/doctors",
        },
      });

      await userModel.findByIdAndUpdate(adminUser._id, {
        notifcation,
      });
    }

    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Doctor",
    });
  }
};

// GET ALL NOTIFICATIONS
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({
      _id: req.body.userId,
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const seennotification = user.seennotification || [];
    const notifcation = user.notifcation || [];

    seennotification.push(...notifcation);

    user.notifcation = [];
    user.seennotification = seennotification;

    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: "All notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

// DELETE ALL NOTIFICATIONS
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({
      _id: req.body.userId,
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.notifcation = [];
    user.seennotification = [];

    const updatedUser = await user.save();

    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Unable to delete all notifications",
      error,
    });
  }
};

// GET ALL APPROVED DOCTORS
const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({
      status: "approved",
    });

    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctor",
    });
  }
};

// BOOK APPOINTMENT
const bookeAppointmnetController = async (req, res) => {
  try {
    req.body.date = moment(
      req.body.date,
      "DD-MM-YYYY"
    ).toISOString();

    req.body.time = moment(
      req.body.time,
      "HH:mm"
    ).toISOString();

    req.body.status = "pending";

    const newAppointment = new appointmentModel(req.body);

    await newAppointment.save();

    const user = await userModel.findOne({
      _id: req.body.doctorInfo.userId,
    });

    if (user) {
      user.notifcation.push({
        type: "New-appointment-request",
        message: `A new Appointment Request from ${req.body.userInfo.name}`,
        onClickPath: "/doctor-appointments",
      });

      await user.save();
    }

    res.status(200).send({
      success: true,
      message: "Appointment Book Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

// CHECK APPOINTMENT AVAILABILITY
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(
      req.body.date,
      "DD-MM-YY"
    ).toISOString();

    const fromTime = moment(
      req.body.time,
      "HH:mm"
    )
      .subtract(1, "hours")
      .toISOString();

    const toTime = moment(
      req.body.time,
      "HH:mm"
    )
      .add(1, "hours")
      .toISOString();

    const doctorId = req.body.doctorId;

    const appointments = await appointmentModel.find({
      doctorId,
      date,
    });

    const conflictingAppointments = appointments.filter(
      (appointment) =>
        appointment.time >= fromTime &&
        appointment.time <= toTime
    );

    if (conflictingAppointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Available at this time",
        success: true,
      });
    }

    return res.status(200).send({
      success: true,
      message: "Appointments available",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};

// USER APPOINTMENTS
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });

    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

// UPDATE PROFILE
const updateProfileController = async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).send({
        success: false,
        message: "Name must be at least 2 characters.",
      });
    }

    const updateData = { name: name.trim() };
    if (phone !== undefined) updateData.phone = phone.trim();

    const updatedUser = await userModel.findByIdAndUpdate(
      req.body.userId,
      updateData
    );

    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error updating profile: ${error.message}`,
    });
  }
};

// CHANGE PASSWORD
const changePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Both current and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const user = await userModel.findById(req.body.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userModel.findByIdAndUpdate(req.body.userId, {
      password: hashedPassword,
    });

    res.status(200).send({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error changing password: ${error.message}`,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDocotrsController,
  bookeAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
  updateProfileController,
  changePasswordController,
};