import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

import "./bookingDetail.css";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  /* =========================================
     LOAD BOOKING
  ========================================= */

  const loadBooking = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/bookings/${id}`
      );

      const b = res.data;

      console.log(
        "Customer booking details:",
        b
      );

      /* =====================================
         SERVICE IMAGE
      ===================================== */

      const rawImage =
        b.service_images?.[0] ||
        b.service_image ||
        b.image ||
        b.service?.image ||
        b.service?.images?.[0] ||
        null;


      /* =====================================
         NORMALIZE BOOKING
      ===================================== */

      setBooking({

        id: b.id,

        /* SERVICE */

        title:
          b.service_title ||
          b.service_name ||
          b.service?.title ||
          "Service",

        image:
          getImageUrl(rawImage),

        description:
          b.service_description ||
          b.service?.description ||
          b.description ||
          "",


        /* DATE / TIME */

        date:
          b.booking_date ||
          b.date ||
          "—",

        time:
          b.booking_time ||
          b.time ||
          "—",


        /* PRICE */

        price:
          b.amount ??
          b.service_price ??
          b.price ??
          0,


        /* STATUS */

        status:
          b.status ||
          "pending",


        /* PAYMENT */

        paymentStatus:
          b.payment_status ||
          "pending",


        /* CUSTOMER VERIFICATION */

        customerVerified:
          Number(
            b.customer_verified
          ) === 1 ||
          Boolean(
            b.customer_verified_at
          ),

        customerVerifiedAt:
          b.customer_verified_at ||
          null,


        /* CUSTOMER */

        customerName:
          b.customer_name ||
          b.user_name ||
          b.user?.name ||
          "",

        customerEmail:
          b.customer_email ||
          b.user?.email ||
          "",

        phone:
          b.phone ||
          b.customer_phone ||
          b.user?.phone ||
          "",


        /* ADDRESS */

        address:
          b.address ||
          "",

        city:
          b.customer_city ||
          b.user?.city ||
          "",

        notes:
          b.notes ||
          "",


        /* TECHNICIAN */

        technician:
          b.technician_name ||
          b.technician?.name ||
          null,

        technicianPhone:
          b.technician_phone ||
          b.technician?.phone ||
          null

      });

    } catch (err) {

      console.error(
        "Error loading booking:",
        err
      );

      setBooking(null);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

    if (id) {
      loadBooking();
    }

  }, [id]);


  /* =========================================
     CANCEL BOOKING
  ========================================= */

  const cancelBooking = async () => {

    if (
      !window.confirm(
        "Are you sure you want to cancel this booking?"
      )
    ) {
      return;
    }

    try {

      setCancelling(true);

      await API.delete(
        `/bookings/${id}`
      );

      alert(
        "Booking cancelled successfully"
      );

      navigate("/bookings");

    } catch (err) {

      console.error(
        "Cancel booking error:",
        err
      );

      alert(
        err.response?.data?.msg ||
        "Cancel failed"
      );

    } finally {

      setCancelling(false);

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
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {

    return (
      <div className="booking-detail-container">

        <p className="loading">
          Loading booking...
        </p>

      </div>
    );

  }


  /* =========================================
     NOT FOUND
  ========================================= */

  if (!booking) {

    return (
      <div className="booking-detail-container">

        <p className="error">
          Booking not found
        </p>

        <Link
          to="/bookings"
          className="back-btn"
        >
          ← Back to Bookings
        </Link>

      </div>
    );

  }


  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="booking-detail-container">

      {/* =====================================
          BACK
      ===================================== */}

      <Link
        to="/bookings"
        className="back-btn"
      >
        ← Back to Bookings
      </Link>


      {/* =====================================
          MAIN BOOKING CARD
      ===================================== */}

      <div className="booking-detail-card">

        {/* IMAGE */}

        <img
          src={
            booking.image ||
            "/placeholder.jpg"
          }
          alt={booking.title}
          className="booking-image"
          onError={(e) => {

            e.currentTarget.onerror = null;

            e.currentTarget.src =
              "/placeholder.jpg";

          }}
        />


        {/* INFO */}

        <div className="booking-info">

          <span className="booking-number">
            Booking #{booking.id}
          </span>


          <h2>
            {booking.title}
          </h2>


          {/* PRICE */}

          {booking.price > 0 && (

            <p className="price">
              ₹{booking.price}
            </p>

          )}


          {/* DATE */}

          <p>
            📅{" "}
            <strong>
              {booking.date}
            </strong>
          </p>


          {/* TIME */}

          <p>
            ⏰{" "}
            <strong>
              {booking.time}
            </strong>
          </p>


          {/* STATUS */}

          <span
            className={`status ${booking.status}`}
          >
            {formatStatus(
              booking.status
            )}
          </span>


          {/* =================================
              PAYMENT STATUS
          ================================= */}

          <div
            className={`payment-status ${booking.paymentStatus}`}
          >

            💳 Payment:{" "}

            {formatStatus(
              booking.paymentStatus
            )}

          </div>


          {/* =================================
              TECHNICIAN
          ================================= */}

          <div className="technician-box">

            <h4>
              Technician
            </h4>

            {booking.technician ? (

              <p>
                👨‍🔧{" "}
                {booking.technician}
              </p>

            ) : (

              <p className="not-assigned">
                Technician not assigned yet
              </p>

            )}

          </div>


          {/* =================================
              CUSTOMER VERIFICATION
          ================================= */}

          <div
            className={
              booking.customerVerified
                ? "verification-box verified"
                : "verification-box"
            }
          >

            {booking.customerVerified ? (

              <>
                <strong>
                  ✓ Customer Verified
                </strong>

                <small>
                  Your identity was verified
                  by the technician.
                </small>
              </>

            ) : (

              <>
                <strong>
                  Customer Verification
                </strong>

                <small>
                  Verification will be
                  completed during the
                  service visit.
                </small>
              </>

            )}

          </div>


          {/* =================================
              CANCEL
          ================================= */}

          {booking.status ===
            "pending" && (

            <button
              type="button"
              onClick={
                cancelBooking
              }
              className="cancel-btn"
              disabled={cancelling}
            >

              {cancelling
                ? "Cancelling..."
                : "Cancel Booking"}

            </button>

          )}

        </div>

      </div>


      {/* =====================================
          BOOKING INFORMATION
      ===================================== */}

      <div className="booking-desc">

        <h3>
          Booking Details
        </h3>


        <div className="booking-details-list">

          <p>
            <strong>
              Booking ID:
            </strong>{" "}
            #{booking.id}
          </p>


          {booking.customerName && (

            <p>
              <strong>
                Customer:
              </strong>{" "}
              {booking.customerName}
            </p>

          )}


          {booking.customerEmail && (

            <p>
              <strong>
                Email:
              </strong>{" "}
              {booking.customerEmail}
            </p>

          )}


          {booking.phone && (

            <p>
              <strong>
                Phone:
              </strong>{" "}
              {booking.phone}
            </p>

          )}


          {booking.address && (

            <p>
              <strong>
                Address:
              </strong>{" "}
              {booking.address}
            </p>

          )}


          {booking.city && (

            <p>
              <strong>
                City:
              </strong>{" "}
              {booking.city}
            </p>

          )}


          {booking.notes && (

            <p>
              <strong>
                Notes:
              </strong>{" "}
              {booking.notes}
            </p>

          )}

        </div>

      </div>


      {/* =====================================
          SERVICE DESCRIPTION
      ===================================== */}

      {booking.description && (

        <div className="booking-desc">

          <h3>
            Service Details
          </h3>

          <div
            dangerouslySetInnerHTML={{
              __html:
                booking.description
            }}
          />

        </div>

      )}

    </div>
  );
}