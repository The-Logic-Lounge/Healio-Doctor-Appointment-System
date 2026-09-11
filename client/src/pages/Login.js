import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MailOutlined,
  LockOutlined,
  HeartFilled,
  SafetyCertificateFilled,
} from "@ant-design/icons";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(res.data.message || "Login failed");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Login Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        (error.message === "Network Error"
          ? "Unable to connect to server. Please ensure backend is running."
          : error.message || "Something went wrong");
      message.error(errorMsg);
    }
  };

  return (
    <div className="form-container auth-page login-page">
      <div className="auth-card-container">
        <div className="auth-brand-panel login-brand-panel">
          <div className="auth-brand-header">
            <div className="auth-brand-mark" aria-hidden="true">
              <HeartFilled />
            </div>
            <span className="auth-brand-name">HEALIO</span>
          </div>

          <div className="auth-brand-content">
            <h1>Healthcare that fits your life.</h1>
            <p className="auth-brand-copy">
              Connect with trusted professionals and manage every appointment in one
              calm, simple place.
            </p>
          </div>

          <div className="auth-brand-footer login-brand-footer">
            <SafetyCertificateFilled className="security-icon" />
            <span>Trusted care, thoughtfully arranged.</span>
          </div>
        </div>

        <div className="auth-form-card">
          <div className="auth-form-heading login-form-heading">
            <p className="auth-eyebrow login-eyebrow">WELCOME BACK</p>
            <h2>Sign in to Healio</h2>
            <p className="auth-subtitle">Enter your details to continue to your care dashboard.</p>
          </div>

          <Form
            layout="vertical"
            onFinish={onfinishHandler}
            className="auth-form register-form login-form"
            requiredMark={false}
            autoComplete="off"
          >
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
                id="login-email-input"
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
                placeholder="Enter your password"
                size="large"
                id="login-password-input"
                aria-label="Password"
                required
              />
            </Form.Item>

            <button
              className="auth-submit-btn login-submit-button"
              type="submit"
              id="login-submit-button"
            >
              Login
            </button>

            <p className="auth-switch-prompt login-register-prompt">
              New to Healio?{" "}
              <Link to="/register" className="auth-switch-link">
                Create an account
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;

