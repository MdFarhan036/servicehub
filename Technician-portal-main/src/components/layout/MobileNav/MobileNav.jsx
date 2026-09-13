import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBriefcase,
  FiDollarSign,
  FiUser,
  FiBell
} from "react-icons/fi";

import "./MobileNav.css";


const items = [
  {
    to: "/dashboard",
    icon: FiGrid,
    label: "Home",
    end: true
  },
  {
    to: "/jobs",
    icon: FiBriefcase,
    label: "Jobs"
  },
  {
    to: "/earnings",
    icon: FiDollarSign,
    label: "Earnings",
    end: true
  },
  {
    to: "/notifications",
    icon: FiBell,
    label: "Alerts"
  },
  {
    to: "/profile",
    icon: FiUser,
    label: "Profile",
    end: true
  }
];


export default function MobileNav() {

  return (
    <nav
      className="mobile-nav"
      aria-label="Technician navigation"
    >

      {items.map(
        ({
          to,
          icon: Icon,
          label,
          end
        }) => (

          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `mnav-item ${
                isActive
                  ? "active"
                  : ""
              }`
            }
            aria-label={label}
          >

            <Icon
              className="mnav-icon"
            />

            <span>
              {label}
            </span>

          </NavLink>

        )
      )}

    </nav>
  );
}