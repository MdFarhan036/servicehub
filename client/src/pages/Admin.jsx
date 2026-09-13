import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./admin.css";

export default function Admin() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(stored);
  }, []);

  if (!user) {
    return (
      <div className="admin-login">
        Please login
      </div>
    );
  }

  return (
    <div className="admin-container">

      {/* Main Content */}
      <div className="admin-content">

        <h1 className="admin-title">
          Admin Panel
        </h1>

        {/* Stats */}
        <div className="admin-grid">
          <div className="admin-card">
            <h3>Total Bookings</h3>
            <p className="admin-count">
              {bookings.length}
            </p>
          </div>
        </div>

        {/* Bookings List */}
        <div className="admin-box">
          <h2 className="admin-subtitle">
            Recent Bookings
          </h2>

          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <div className="booking-list">
              {bookings.map((booking, index) => (
                <div key={index} className="booking-item">

                  <div>
                    <p className="booking-service">
                      {booking.service}
                    </p>
                    <p className="booking-meta">
                      {booking.name} | {booking.date}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}