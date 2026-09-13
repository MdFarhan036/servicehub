import { NavLink, useNavigate } from "react-router-dom";

import {
  FiGrid,
  FiBriefcase,
  FiUser,
  FiFileText,
  FiDollarSign,
  FiBell,
  FiSettings,
  FiLogOut,
  FiCreditCard,
} from "react-icons/fi";

import {
  useTechnicianAuth,
} from "../../../context/TechnicianAuthContext";

import "./Sidebar.css";


const navItems = [

  {
    to: "/technician/dashboard",
    label: "Dashboard",
    icon: FiGrid,
  },

  {
    to: "/technician/jobs",
    label: "Jobs",
    icon: FiBriefcase,
  },

  {
    to: "/technician/earnings",
    label: "Earnings",
    icon: FiDollarSign,
  },
{
  to: "/technician/wallet",
  label: "Wallet",
  icon: FiSettings,
},

  {
    to: "/technician/documents",
    label: "Documents",
    icon: FiFileText,
  },

  {
    to: "/technician/notifications",
    label: "Notifications",
    icon: FiBell,
  },

  {
    to: "/technician/profile",
    label: "Profile",
    icon: FiUser,
  },

  {
    to: "/technician/settings",
    label: "Settings",
    icon: FiSettings,
  },

];


export default function Sidebar({ open }) {

  const {
    logout,
  } = useTechnicianAuth();

  const navigate = useNavigate();


  /*
  ================================
  LOGOUT
  ================================
  */

  const handleLogout = async () => {

    try {

      await logout();

      navigate(
        "/technician/login",
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(
        "Technician logout failed:",
        error
      );

    }

  };


  return (

    <aside
      className={

        `sidebar ${
          open
            ? "sidebar-open"
            : ""
        }`

      }
    >


      {/* =====================
          LOGO
      ===================== */}

      <div className="sidebar-logo">

        <div className="logo-mark">
          S
        </div>

        <span>
          ServiceHub
        </span>

      </div>


      {/* =====================
          NAVIGATION
      ===================== */}

      <nav className="sidebar-nav">

        {

          navItems.map(

            ({
              to,
              label,
              icon: Icon,
            }) => (

              <NavLink

                key={to}

                to={to}

                className={
                  ({
                    isActive,
                  }) =>

                    `sidebar-link ${
                      isActive
                        ? "active"
                        : ""
                    }`
                }

              >

                <Icon
                  className="sidebar-icon"
                />

                <span>
                  {label}
                </span>

              </NavLink>

            )

          )

        }

      </nav>


      {/* =====================
          LOGOUT
      ===================== */}

      <button

        type="button"

        className="sidebar-link logout"

        onClick={
          handleLogout
        }

      >

        <FiLogOut
          className="sidebar-icon"
        />

        <span>
          Logout
        </span>

      </button>


    </aside>

  );

}