import { useEffect, useState } from "react";
import "./bookings.css";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("bookings")) || [];

    setBookings(stored);
    setLoading(false);
  }, []);

  const getStatusClass = (status) => {
    if (status === "pending") return "status yellow";
    if (status === "confirmed") return "status blue";
    if (status === "completed") return "status green";
    if (status === "cancelled") return "status red";
    return "status gray";
  };

  return (
    <div className="bookings-container">

      <h2 className="bookings-title">My Bookings</h2>

      {loading ? (
        <p className="bookings-text">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="bookings-text">You have no bookings yet.</p>
      ) : (
        <div className="bookings-list">

          {bookings.map((booking, index) => (
            <div key={index} className="booking-card">

              <div>
                <h3 className="booking-title">
                  {booking.service}
                </h3>

                <p className="booking-meta">
                  📅 {booking.date}
                </p>

                <p className="booking-meta">
                  ⏰ 10:00
                </p>
              </div>

              <div className="booking-status">
                <span className={getStatusClass("pending")}>
                  pending
                </span>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}