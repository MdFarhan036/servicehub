import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";
import "./bookings.css";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD BOOKINGS
  ========================= */
  const loadBookings = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/bookings/my-bookings"
      );

      setBookings(res.data || []);
    } catch (err) {
      console.error(
        "Error loading bookings:",
        err
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /* =========================
     CANCEL BOOKING
  ========================= */
  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel booking?")) {
      return;
    }

    try {
      await API.put(
        `/bookings/${id}`,
        {
          status: "cancelled",
        }
      );

      loadBookings();
    } catch (err) {
      console.error(
        "Error cancelling booking:",
        err
      );
    }
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="bookings-page">
        Loading...
      </div>
    );
  }

  /* =========================
     PAGE
  ========================= */
  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="no-data">
          No bookings found.
        </p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => {
            /*
             * Booking image can come as:
             * /uploads/services/image.jpg
             * uploads/services/image.jpg
             * https://...
             */
            const image =
              booking.image ||
              booking.images?.[0] ||
              null;

            return (
              <div
                key={booking.id}
                className="booking-card"
              >
                {/* =========================
                    IMAGE
                ========================= */}
                <img
                  src={getImageUrl(image)}
                  alt={
                    booking.service_name ||
                    "Service"
                  }
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "/placeholder.jpg";
                  }}
                />

                {/* =========================
                    CONTENT
                ========================= */}
                <div className="booking-content">
                  <h3>
                    {booking.service_name}
                  </h3>

                  <p>
                    ₹{booking.price}
                  </p>

                  <p>
                    {booking.date} at{" "}
                    {booking.time}
                  </p>

                  {/* STATUS */}
                  <span
                    className={`status ${booking.status}`}
                  >
                    {booking.status}
                  </span>

                  {/* CANCEL */}
                  {booking.status ===
                    "pending" && (
                    <button
                      onClick={() =>
                        cancelBooking(
                          booking.id
                        )
                      }
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  )}

                  {/* REVIEW */}
                  {booking.status ===
                    "completed" && (
                    <Link
                      to={`/services/${booking.service_id}?review=true`}
                      className="review-btn"
                    >
                      Add Review
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}