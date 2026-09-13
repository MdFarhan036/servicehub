import { useNavigate } from "react-router-dom";

import {
  FiMapPin,
  FiClock,
  FiChevronRight,
  FiCheckCircle,
  FiCreditCard
} from "react-icons/fi";

import StatusBadge from "../../common/StatusBadge/StatusBadge";

import "./JobCard.css";


export default function JobCard({ job }) {

  const navigate = useNavigate();


  /* =========================
     BOOKING ID
  ========================= */

  const bookingId =
    job?.id ||
    job?.booking_id ||
    null;


  /* =========================
     SERVICE
  ========================= */

  const service =
    job?.service_name ||
    job?.service ||
    "Service";


  /* =========================
     CUSTOMER
  ========================= */

  const customer =
    job?.customer_name ||
    job?.user_name ||
    job?.customer ||
    "Customer";


  /* =========================
     ADDRESS
  ========================= */

  const address =
    job?.address ||
    "Address not provided";


  /* =========================
     DATE / TIME
  ========================= */

  const date =
    job?.booking_date ||
    job?.date ||
    "—";


  const time =
    job?.booking_time ||
    job?.time ||
    "—";


  /* =========================
     PRICE
  ========================= */

  const price =
    job?.price ??
    job?.amount ??
    null;


  /* =========================
     PAYMENT
  ========================= */

  const paymentStatus = String(
    job?.payment_status ||
    job?.paymentStatus ||
    ""
  )
    .toLowerCase()
    .trim();


  const paymentPaid =
    paymentStatus === "paid" ||
    paymentStatus === "success" ||
    paymentStatus === "successful" ||
    paymentStatus === "completed";


  /* =========================
     CUSTOMER VERIFICATION
  ========================= */

  const customerVerified =
    Boolean(
      job?.customer_verified ||
      job?.customer_verified_at
    );


  /* =========================
     OPEN JOB
  ========================= */

  const openJob = () => {

    if (!bookingId) {

      console.error(
        "JobCard: Booking ID is missing",
        job
      );

      return;
    }


    navigate(
      `/jobs/${bookingId}`
    );
  };


  /* =========================
     KEYBOARD SUPPORT
  ========================= */

  const handleKeyDown = (e) => {

    if (
      e.key === "Enter" ||
      e.key === " "
    ) {

      e.preventDefault();

      openJob();
    }
  };


  return (
    <div
      className="job-card card"
      onClick={openJob}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >

      {/* =========================
          TOP
      ========================= */}

      <div className="job-card-top">

        <div>

          <h4>
            {service}
          </h4>

          <span className="job-id">
            Booking #{bookingId || "—"}
          </span>

        </div>


        <StatusBadge
          status={job?.status}
        />

      </div>


      {/* =========================
          META
      ========================= */}

      <div className="job-card-meta">

        <span>
          <FiMapPin />

          {address}
        </span>


        <span>
          <FiClock />

          {date} · {time}
        </span>

      </div>


      {/* =========================
          BOOKING INDICATORS
      ========================= */}

      <div className="job-card-indicators">

        <span
          className={
            paymentPaid
              ? "booking-indicator success"
              : "booking-indicator pending"
          }
        >

          <FiCreditCard />

          {paymentPaid
            ? "Payment Paid"
            : "Payment Pending"}

        </span>


        <span
          className={
            customerVerified
              ? "booking-indicator success"
              : "booking-indicator pending"
          }
        >

          <FiCheckCircle />

          {customerVerified
            ? "Customer Verified"
            : "Customer Not Verified"}

        </span>

      </div>


      {/* =========================
          FOOTER
      ========================= */}

      <div className="job-card-footer">

        <span className="job-customer">
          {customer}
        </span>


        <span className="job-price">

          {price !== null &&
          price !== undefined
            ? `₹${price}`
            : "—"}

        </span>


        <FiChevronRight
          className="job-arrow"
        />

      </div>

    </div>
  );
}