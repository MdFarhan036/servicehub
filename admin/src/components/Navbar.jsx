import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
} from "react-icons/fa";

import { useAuth } from "../components/context/AuthContext";
import API from "../services/api";
import "./Navbar.css"
export default function Navbar({ toggle }) {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const [unreadCount, setUnreadCount] =
    useState(0);


  /*
  ==========================================
  GET UNREAD NOTIFICATION COUNT
  ==========================================
  */

  const fetchUnreadNotifications =
    async () => {
      try {
        const res = await API.get(
          "/admin-notifications/unread-count"
        );

        setUnreadCount(
          res.data.unreadCount || 0
        );

      } catch (error) {

        console.log(
          "Notification count error:",
          error
        );

      }
    };


  /*
  ==========================================
  LOAD NOTIFICATIONS
  ==========================================
  */

  useEffect(() => {

    fetchUnreadNotifications();

  }, []);


  /*
  ==========================================
  OPTIONAL AUTO REFRESH
  ==========================================
  */

  useEffect(() => {

    const interval =
      setInterval(() => {

        fetchUnreadNotifications();

      }, 30000);


    return () =>
      clearInterval(interval);

  }, []);


  /*
  ==========================================
  LOGOUT
  ==========================================
  */

  const handleLogout = async () => {

    try {

      await logout();

      navigate(
        "/login",
        {
          replace: true
        }
      );

    } catch (error) {

      console.log(error);

    }

  };


  /*
  ==========================================
  GO TO NOTIFICATIONS
  ==========================================
  */

  const goToNotifications = () => {

    navigate(
      "/notifications"
    );

  };


  return (

    <div className="navbar">

      {/* LEFT */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >

        <button
          className="toggle-btn"
          onClick={toggle}
        >
          <FaBars />
        </button>


        <h1>
          Dashboard
        </h1>

      </div>


      {/* RIGHT */}

      <div className="navbar-right">


        {/* NOTIFICATION */}

        <button
          className="notification-btn"
          onClick={goToNotifications}
          title="Notifications"
        >

          <FaBell />


          {unreadCount > 0 && (

            <span
              className="notification-badge"
            >

              {unreadCount > 99
                ? "99+"
                : unreadCount}

            </span>

          )}

        </button>


        {/* ADMIN NAME */}

        <span
          className="admin-name"
        >

          {user?.name || "Admin"}

        </span>


        {/* PROFILE */}

        <div className="profile">

          {user?.name
            ?.charAt(0)
            ?.toUpperCase() || "A"}

        </div>


        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          Logout

        </button>

      </div>

    </div>

  );

}