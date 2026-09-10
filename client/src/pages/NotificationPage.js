import React from "react";
import Layout from "./../components/Layout";
import { message, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import { BellOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // handle mark all as read
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/get-all-notification",
        {
          userId: user._id,
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
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong marking notifications as read");
    }
  };

  // delete notifications
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/delete-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong deleting notifications");
    }
  };

  const handleNotificationClick = (notificationMgs) => {
    const path =
      notificationMgs?.onClickPath ||
      notificationMgs?.onCLickPath ||
      notificationMgs?.data?.onClickPath ||
      "/";
    navigate(path);
  };

  return (
    <Layout>
      <h1 className="text-center m-3">Notifications</h1>
      <Tabs defaultActiveKey="0">
        <Tabs.TabPane tab="Unread" key="0">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-success"
              type="button"
              onClick={handleMarkAllRead}
            >
              <CheckOutlined /> Mark All Read
            </button>
          </div>
          {user?.notifcation && user.notifcation.length > 0 ? (
            user.notifcation.map((notificationMgs, index) => (
              <div
                className="card"
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => handleNotificationClick(notificationMgs)}
              >
                <div className="card-text">
                  <BellOutlined style={{ color: "var(--theme-teal)", marginRight: "8px" }} />
                  {notificationMgs.message}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted">
              No unread notifications
            </div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key="1">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-danger"
              type="button"
              onClick={handleDeleteAllRead}
            >
              <DeleteOutlined /> Delete All Read
            </button>
          </div>
          {user?.seennotification && user.seennotification.length > 0 ? (
            user.seennotification.map((notificationMgs, index) => (
              <div
                className="card"
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => handleNotificationClick(notificationMgs)}
              >
                <div className="card-text">
                  <BellOutlined style={{ color: "var(--theme-text-muted)", marginRight: "8px" }} />
                  {notificationMgs.message}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted">
              No read notifications
            </div>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;