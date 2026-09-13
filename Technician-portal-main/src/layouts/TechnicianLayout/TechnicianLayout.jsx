import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Header from "../../components/layout/Header/Header";
import MobileNav from "../../components/layout/MobileNav/MobileNav";

import ChatbotButton from "../../components/chatbot/ChatbotButton/ChatbotButton";
import ChatbotWindow from "../../components/chatbot/ChatbotWindow/ChatbotWindow";

import "./TechnicianLayout.css";


const titleMap = {
  "/dashboard": "Dashboard",
  "/jobs": "My Jobs",
  "/earnings": "Earnings",
  "/documents": "Documents",
  "/notifications": "Notifications",
  "/profile": "Profile",
  "/settings": "Settings",
};


export default function TechnicianLayout() {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [chatOpen, setChatOpen] =
    useState(false);

  const location = useLocation();


  /* ===============================
     PAGE TITLE
  =============================== */

  const baseTitle =
    "/" +
    location.pathname
      .split("/")
      .filter(Boolean)[0];

  const title =
    titleMap[baseTitle] ||
    "Dashboard";


  /* ===============================
     CLOSE MOBILE SIDEBAR
     WHEN ROUTE CHANGES
  =============================== */

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);


  return (
    <div className="layout-shell">

      {/* ===============================
          MOBILE SIDEBAR BACKDROP
      =============================== */}

      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}


      {/* ===============================
          SIDEBAR
      =============================== */}

      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />


      {/* ===============================
          MAIN
      =============================== */}

      <div className="layout-main">

        <Header
          onMenuClick={() =>
            setSidebarOpen(
              (current) => !current
            )
          }
          title={title}
        />


        <div className="layout-content page-fade">

          <Outlet />

        </div>

      </div>


      {/* ===============================
          MOBILE NAV
      =============================== */}

      <MobileNav />


      {/* ===============================
          CHATBOT
      =============================== */}

      <ChatbotButton
        onClick={() =>
          setChatOpen(
            (current) => !current
          )
        }
        open={chatOpen}
      />


      <ChatbotWindow
        isOpen={chatOpen}
        onClose={() =>
          setChatOpen(false)
        }
      />

    </div>
  );
}