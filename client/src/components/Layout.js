import React, { useState } from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "./../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
import {
  BellOutlined,
  CalendarOutlined,
  DownOutlined,
  HeartFilled,
  HomeOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
  UserSwitchOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  // =========== doctor menu ===============
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];

  // rendering menu list
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
      ? doctorMenu
      : userMenu;

  const iconMap = {
    "fa-solid fa-house": <HomeOutlined />,
    "fa-solid fa-list": <CalendarOutlined />,
    "fa-solid fa-user-doctor": <UserSwitchOutlined />,
    "fa-solid fa-user": <UserOutlined />,
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  // Determine user display role
  const userRole = user?.isAdmin
    ? "Admin"
    : user?.isDoctor
      ? "Doctor"
      : "Patient";

  const userName = user?.name || "Ume Maryam";

  return (
    <div className="main">
      <button
        className="mobile-menu-button"
        type="button"
        aria-label="Open navigation menu"
        onClick={() => setIsSidebarOpen(true)}
      >
        <MenuOutlined />
      </button>

      <div className="layout">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-brand">
            <div className="brand-mark" aria-hidden="true">
              <HeartFilled />
            </div>
            <div>
              <strong>MEDBOOK</strong>
              <span>Care, arranged around you</span>
            </div>
            <button
              className="sidebar-close-button"
              type="button"
              aria-label="Close navigation menu"
              onClick={closeSidebar}
            >
              <CloseOutlined />
            </button>
          </div>

          <nav className="menu" aria-label="Main navigation">
            <span className="menu-label">MENU</span>
            {SidebarMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <Link
                  className={`menu-item ${isActive ? "active" : ""}`}
                  key={menu.path}
                  to={menu.path}
                  onClick={closeSidebar}
                >
                  <span className="menu-icon">{iconMap[menu.icon]}</span>
                  <span>{menu.name}</span>
                </Link>
              );
            })}

            <button
              className="menu-item menu-logout"
              type="button"
              onClick={handleLogout}
            >
              <span className="menu-icon">
                <LogoutOutlined />
              </span>
              <span>Logout</span>
            </button>
          </nav>

          {/* Sidebar Priority Card */}
          <div className="sidebar-priority-card">
            <div className="priority-card-icon">
              <MedicineBoxOutlined />
            </div>
            <div className="priority-card-content">
              <strong>
                Your Health
                <br />
                Our Priority
              </strong>
              <p>Find trusted doctors and book appointments easily.</p>
            </div>
            <div className="priority-card-accent" />
          </div>
        </aside>

        {isSidebarOpen && (
          <button
            className="sidebar-overlay"
            type="button"
            aria-label="Close navigation menu"
            onClick={closeSidebar}
          />
        )}

        {/* Content Body */}
        <div className="content">
          <header className="header">
            <div className="header-content">
              <div className="header-search">
                <SearchOutlined className="search-icon" />
                <input
                  aria-label="Search doctors"
                  placeholder="Search doctors, specialties..."
                />
              </div>

              <div className="header-actions">
                <Badge count={user?.notifcation?.length || 0} size="small">
                  <button
                    className="notification-button"
                    type="button"
                    aria-label="View notifications"
                    onClick={() => navigate("/notification")}
                  >
                    <BellOutlined />
                  </button>
                </Badge>

                <span className="header-divider" />

                <Link className="user-menu" to="/profile">
                  <span className="header-avatar">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                  <span className="user-copy">
                    <strong>{userName}</strong>
                    <span>{userRole}</span>
                  </span>
                  <DownOutlined className="user-chevron" />
                </Link>
              </div>
            </div>
          </header>

          <main className="body">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
