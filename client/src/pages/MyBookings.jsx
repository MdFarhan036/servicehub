import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";
import "./bookings.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* =========================================
     LOAD CUSTOMER BOOKINGS
  ========================================= */

  const loadBookings = async () => {
    try {
      setLoading(true);

      const res = await API.get("/bookings");

      console.log(
        "Customer bookings:",
        res.data
      );

      const formatted = (res.data || []).map((b) => {

        /* =========================
           SERVICE IMAGE
        ========================= */

        const rawImage =
          b.service_images?.[0] ||
          b.service_image ||
          b.image ||
          b.service?.image ||
          b.service?.images?.[0] ||
          null;


        /* =========================
           BOOKING DATA
        ========================= */

        return {
          id: b.id,

          title:
            b.service_title ||
            b.service_name ||
            b.service?.title ||
            "Service",

          image:
            getImageUrl(rawImage),

          date:
            b.booking_date ||
            b.date ||
            "—",

          time:
            b.booking_time ||
            b.time ||
            "—",

          price:
            b.amount ??
            b.price ??
            0,

          status:
            b.status ||
            "pending",

          paymentStatus:
            b.payment_status ||
            "pending",

          customerVerified:
            Number(b.customer_verified) === 1 ||
            Boolean(b.customer_verified_at),

          address:
            b.address ||
            "Address not provided"
        };
      });

      setBookings(formatted);

    } catch (err) {

      console.error(
        "Bookings error:",
        err
      );

      alert(
        err.response?.data?.msg ||
        "Failed to load bookings"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadBookings();
  }, []);


  /* =========================================
     CANCEL BOOKING
  ========================================= */

  const cancelBooking = async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to cancel this booking?"
      )
    ) {
      return;
    }

    try {

      await API.delete(
        `/bookings/${id}`
      );

      setBookings((prev) =>
        prev.filter(
          (booking) =>
            booking.id !== id
        )
      );

    } catch (err) {

      console.error(
        "Cancel booking error:",
        err
      );

      alert(
        err.response?.data?.msg ||
        "Cancel failed"
      );
    }
  };


  /* =========================================
     STATUS FORMAT
  ========================================= */

  const formatStatus = (status) => {

    if (!status) {
      return "Pending";
    }

    return String(status)
      .replace("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };


  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="bookings-container">

      <h2>
        My Bookings
      </h2>


      {loading ? (

        <p>
          Loading bookings...
        </p>

      ) : bookings.length === 0 ? (

        <p>
          No bookings found
        </p>

      ) : (

        <div className="bookings-list">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="booking-card"
            >

              {/* =========================
                  IMAGE
              ========================= */}

              <img
                src={booking.image}
                alt={booking.title}
                loading="lazy"
                onError={(e) => {

                  e.currentTarget.onerror =
                    null;

                  e.currentTarget.src =
                    "/placeholder.jpg";
                }}
              />


              {/* =========================
                  BOOKING INFO
              ========================= */}

              <div className="booking-info">

                <h3>
                  {booking.title}
                </h3>


                <p>
                  <strong>
                    Booking:
                  </strong>{" "}
                  #{booking.id}
                </p>


                <p>
                  📅 {booking.date}
                </p>


                <p>
                  ⏰ {booking.time}
                </p>


                <p>
                  📍 {booking.address}
                </p>


                <p>
                  ₹{booking.price}
                </p>


                {/* STATUS */}

                <span
                  className={`status ${booking.status}`}
                >
                  {formatStatus(
                    booking.status
                  )}
                </span>


                {/* PAYMENT */}

                <span
                  className={`payment-status ${booking.paymentStatus}`}
                >
                  Payment:{" "}
                  {formatStatus(
                    booking.paymentStatus
                  )}
                </span>


                {/* CUSTOMER VERIFICATION */}

                {booking.customerVerified && (

                  <span
                    className="verification-status"
                  >
                    ✓ Customer Verified
                  </span>

                )}

              </div>


              {/* =========================
                  ACTIONS
              ========================= */}

              <div className="booking-actions">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/bookings/${booking.id}`
                    )
                  }
                  className="view-btn"
                >
                  View Details
                </button>


                {/* CANCEL ONLY WHEN PENDING */}

                {booking.status ===
                  "pending" && (

                  <button
                    type="button"
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

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}