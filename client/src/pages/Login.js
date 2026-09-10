import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //form handler
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
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("something went wrong");
    }
  };
  return (
    <div className="form-container login-page">
      <div className="login-brand-panel">
        <div className="login-brand-mark">♡</div>
        <p className="login-brand-name">MEDBOOK</p>
        <h1>Healthcare that fits your life.</h1>
        <p className="login-brand-copy">
          Connect with trusted professionals and manage every appointment in one
          calm, simple place.
        </p>
        <div className="login-brand-footer">
          Trusted care, thoughtfully arranged.
        </div>
      </div>
      <Form
        layout="vertical"
        onFinish={onfinishHandler}
        className="register-form login-form"
      >
        <div className="login-form-heading">
          <p className="login-eyebrow">WELCOME BACK</p>
          <h2>Sign in to MedBook</h2>
          <p>Enter your details to continue to your care dashboard.</p>
        </div>

        <Form.Item label="Email" name="email">
          <Input type="email" placeholder="you@example.com" required />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" placeholder="Enter your password" required />
        </Form.Item>
        <button className="login-submit-button" type="submit">
          Login
        </button>
        <p className="login-register-prompt">
          New to MedBook? <Link to="/register">Create an account</Link>
        </p>
      </Form>
    </div>
  );
};

export default Login;
