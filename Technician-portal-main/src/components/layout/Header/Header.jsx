import {
  useEffect,
  useState
} from "react";

import {
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut
} from "react-icons/fi";

import {
  useNavigate
} from "react-router-dom";

import {
  useTechnicianAuth
} from "../../../context/TechnicianAuthContext";

import API from "../../../services/api";

import "./Header.css";


export default function Header({
  onMenuClick,
  title
}) {

  const navigate =
    useNavigate();


  const {
    technician,
    logout
  } =
    useTechnicianAuth();


  const [
    menuOpen,
    setMenuOpen
  ] =
    useState(false);


  const [
    unreadCount,
    setUnreadCount
  ] =
    useState(0);


  const name =
    technician?.name ||
    "Technician";


  const specialization =
    technician?.specialization ||
    "Technician";


  const initial =
    name.charAt(0)
      .toUpperCase();


  /*
  ==========================================
  FETCH NOTIFICATIONS
  ==========================================
  */

  const fetchUnreadNotifications =
    async () => {

      try {

        const res =
          await API.get(
            "/notifications/technician"
          );


        const notifications =
          res.data || [];


        const unread =
          notifications.filter(
            (notification) =>
              !notification.is_read
          );


        setUnreadCount(
          unread.length
        );

      } catch (error) {

        console.error(
          "Failed to fetch notification count:",
          error
        );

      }

    };


  /*
  LOAD ON HEADER START
  */

  useEffect(() => {

    fetchUnreadNotifications();

    /*
    Refresh every 30 seconds
    */

    const interval =
      setInterval(
        fetchUnreadNotifications,
        30000
      );


    return () =>
      clearInterval(
        interval
      );

  }, []);


  /*
  ==========================================
  LOGOUT
  ==========================================
  */

  const handleLogout =
    async () => {

      setMenuOpen(false);

      await logout();

      navigate(
        "/login",
        {
          replace: true
        }
      );

    };


  /*
  ==========================================
  GO TO NOTIFICATIONS
  ==========================================
  */

  const handleNotifications =
    () => {

      navigate(
        "/notifications"
      );

    };


  return (

    <header className="topbar">


      {/* LEFT */}

      <div className="topbar-left">

        <button
          className="menu-btn"
          onClick={onMenuClick}
          type="button"
        >

          <FiMenu />

        </button>


        <h2 className="topbar-title">

          {title}

        </h2>

      </div>


      {/* RIGHT */}

      <div className="topbar-right">


        {/* NOTIFICATIONS */}

        <button
          className="icon-btn notification-button"
          type="button"
          onClick={
            handleNotifications
          }
        >

          <FiBell />


          {unreadCount > 0 && (

            <span
              className="notif-count"
            >

              {unreadCount > 9
                ? "9+"
                : unreadCount}

            </span>

          )}

        </button>


        {/* USER */}

        <div className="user-menu">


          <button
            className="user-chip"
            type="button"
            onClick={() =>
              setMenuOpen(
                (prev) => !prev
              )
            }
          >


            <div className="user-avatar">

              {initial}

            </div>


            <div className="user-info">

              <span className="user-name">

                {name}

              </span>


              <span className="user-role">

                {specialization}

              </span>

            </div>


            <FiChevronDown
              className={
                `chip-caret ${
                  menuOpen
                    ? "rotate"
                    : ""
                }`
              }
            />

          </button>


          {/* DROPDOWN */}

          {menuOpen && (

            <div className="user-dropdown">


              {/* PROFILE */}

              <button
                type="button"
                onClick={() => {

                  setMenuOpen(false);

                  navigate(
                    "/profile"
                  );

                }}
              >

                <FiUser />

                <span>
                  Profile
                </span>

              </button>


              {/* SETTINGS */}

              <button
                type="button"
                onClick={() => {

                  setMenuOpen(false);

                  navigate(
                    "/settings"
                  );

                }}
              >

                <FiSettings />

                <span>
                  Settings
                </span>

              </button>


              <div
                className="dropdown-divider"
              />


              {/* LOGOUT */}

              <button
                type="button"
                className="dropdown-logout"
                onClick={
                  handleLogout
                }
              >

                <FiLogOut />

                <span>
                  Logout
                </span>

              </button>


            </div>

          )}

        </div>

      </div>

    </header>

  );
}