import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-container">
      <Sidebar collapsed={collapsed} />

      <div className="admin-main">
        <Navbar toggle={() => setCollapsed(!collapsed)} />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}