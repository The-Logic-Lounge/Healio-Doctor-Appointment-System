import React from "react";
import Layout from "./../components/Layout";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import moment from "moment";

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle form submission
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/apply-doctor",
        {
          ...values,
          userId: user?._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message || "Failed to submit application");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong with application submission");
    }
  };

  return (
    <Layout>
      <h1 className="text-center">Apply for Doctor Account</h1>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <h4>Personal Details :</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "First name is required" }]}
            >
              <Input type="text" placeholder="Your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Last name is required" }]}
            >
              <Input type="text" placeholder="Your last name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Phone No"
              name="phone"
              rules={[{ required: true, message: "Phone number is required" }]}
            >
              <Input type="text" placeholder="Your contact number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input type="email" placeholder="Your professional email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Website / Portfolio" name="website">
              <Input type="text" placeholder="https://yourwebsite.com" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Clinic / Hospital Address"
              name="address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input type="text" placeholder="Clinic or hospital location" />
            </Form.Item>
          </Col>
        </Row>

        <h4>Professional Details :</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Specialization"
              name="specialization"
              rules={[{ required: true, message: "Specialization is required" }]}
            >
              <Input type="text" placeholder="e.g. Cardiologist, Dermatologist" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Experience"
              name="experience"
              rules={[{ required: true, message: "Experience is required" }]}
            >
              <Input type="text" placeholder="e.g. 10 years" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Fees Per Consultation (Rs.)"
              name="feesPerCunsaltation"
              rules={[{ required: true, message: "Consultation fee is required" }]}
            >
              <Input type="number" placeholder="e.g. 3000" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Working Hours / Timings"
              name="timings"
              rules={[{ required: true, message: "Working hours are required" }]}
            >
              <TimePicker.RangePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={16} className="d-flex align-items-end">
            <button
              className="btn btn-primary form-btn"
              type="submit"
              style={{ minWidth: "180px", marginBottom: "24px" }}
            >
              Submit Application
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default ApplyDoctor;