import { Link, useLocation } from "react-router-dom";

import {
  FaTachometerAlt,
  FaServicestack,
  FaBook,
  FaComments,
  FaUsers,
  FaRobot,
  FaWallet,
} from "react-icons/fa";


export default function Sidebar({ collapsed }) {

  const { pathname } =
    useLocation();


  const menu = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaTachometerAlt />,
    },

    {
      name: "Categories",
      path: "/categories",
      icon: <FaServicestack />,
    },

    {
      name: "Services",
      path: "/services",
      icon: <FaServicestack />,
    },

    {
      name: "Bookings",
      path: "/bookings",
      icon: <FaBook />,
    },

    /*
    ==============================
    ADMIN WALLET
    ==============================
    */

    {
      name: "Wallet",
      path: "/admin/earnings",
      icon: <FaWallet />,
    },
{
  name: "Withdrawals",
  path: "/admin/withdrawals",
  icon: <FaWallet />,
},
    {
      name: "Comments",
      path: "/comments",
      icon: <FaComments />,
    },

    {
      name: "About",
      path: "/about",
      icon: <FaComments />,
    },

    {
      name: "Highlights",
      path: "/highlights",
      icon: <FaComments />,
    },

    {
      name: "Testimonials",
      path: "/testimonials",
      icon: <FaComments />,
    },

    {
      name: "FAQs",
      path: "/faqs",
      icon: <FaComments />,
    },

    {
      name: "Users",
      path: "/users",
      icon: <FaUsers />,
    },

    {
      name: "Blogs",
      path: "/blogs",
      icon: <FaUsers />,
    },

    {
      name: "Enquiries",
      path: "/enquiries",
      icon: <FaUsers />,
    },

    /*
    ==============================
    CHATBOT MANAGEMENT
    ==============================
    */

    {
      name: "Chatbot",
      path: "/chatbot",
      icon: <FaRobot />,
    },

  ];


  return (

    <div
      className={`sidebar ${
        collapsed
          ? "collapsed"
          : ""
      }`}
    >

      {!collapsed && (
        <h2>
          ⚡ Admin
        </h2>
      )}


      <nav>

        {menu.map(
          (item) => (

            <Link
              key={item.path}
              to={item.path}
              className={
                pathname === item.path ||
                (
                  item.path !== "/" &&
                  pathname.startsWith(
                    item.path + "/"
                  )
                )
                  ? "active"
                  : ""
              }
            >

              {item.icon}

              <span>
                {item.name}
              </span>

            </Link>

          )
        )}

      </nav>

    </div>

  );

}