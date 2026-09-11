import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  HeartFilled,
  CheckCircleFilled,
  SafetyCertificateFilled,
} from "@ant-design/icons";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Register Successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  return (
    <div className="form-container auth-page register-page">
      <div className="auth-card-container">
        {/* Brand Side Panel */}
        <div className="auth-brand-panel">
          <div className="auth-brand-header">
            <div className="auth-brand-mark" aria-hidden="true">
              <HeartFilled />
            </div>
            <span className="auth-brand-name">HEALIO</span>
          </div>

          <div className="auth-brand-content">
            <h1>Healthcare that fits your life.</h1>
            <p className="auth-brand-copy">
              Join Healio to connect with trusted medical professionals, book appointments in seconds, and take control of your health.
            </p>

            <div className="auth-features-list">
              <div className="auth-feature-item">
                <CheckCircleFilled className="feature-icon" />
                <span>Instant doctor appointment booking</span>
              </div>
              <div className="auth-feature-item">
                <CheckCircleFilled className="feature-icon" />
                <span>Verified healthcare specialists</span>
              </div>
              <div className="auth-feature-item">
                <CheckCircleFilled className="feature-icon" />
                <span>Confidential & secure health portal</span>
              </div>
            </div>
          </div>

          <div className="auth-brand-footer">
            <SafetyCertificateFilled className="security-icon" />
            <span>Trusted care, thoughtfully arranged.</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="auth-form-card">
          <div className="auth-form-heading">
            <p className="auth-eyebrow">GET STARTED</p>
            <h2>Create Your Account</h2>
            <p className="auth-subtitle">
              Join Healio and manage your appointments easily.
            </p>
          </div>

          <Form
            layout="vertical"
            onFinish={onfinishHandler}
            className="auth-form register-form"
            requiredMark={false}
            autoComplete="off"
          >
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                prefix={<UserOutlined className="auth-field-icon" />}
                type="text"
                placeholder="e.g. Sarah Jenkins"
                size="large"
                id="register-name-input"
                aria-label="Full Name"
                required
              />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="auth-field-icon" />}
                type="email"
                placeholder="you@example.com"
                size="large"
                id="register-email-input"
                aria-label="Email Address"
                required
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="auth-field-icon" />}
                placeholder="Create a strong password"
                size="large"
                id="register-password-input"
                aria-label="Password"
                required
              />
            </Form.Item>

            <button
              className="auth-submit-btn register-submit-btn"
              type="submit"
              id="register-submit-button"
            >
              Register
            </button>

            <p className="auth-switch-prompt">
              Already have an account?{" "}
              <Link to="/login" className="auth-switch-link">
                Log in here
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;