import { useEffect, useState } from "react";
import API from "../services/api";
import DataTable from "./DataTable";
import { Helmet } from "react-helmet-async";
import BookingModal from "./BookingModal.jsx";

export default function Bookings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  /* =========================
     LOAD BOOKINGS
  ========================= */

  const load = async () => {
    try {
      setLoading(true);

      const res = await API.get("/bookings");

      setData(res.data || []);

    } catch (err) {
      console.error(
        "Failed to load bookings:",
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
    load();
  }, []);

  /* =========================
     OPEN UPDATE MODAL
  ========================= */

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  /* =========================
     STATUS BADGE
  ========================= */

  const getStatusBadge = (status) => {
    const normalized =
      String(status || "").toLowerCase();

    let bg = "#f3f4f6";
    let color = "#6b7280";

    if (normalized === "pending") {
      bg = "#fef3c7";
      color = "#d97706";
    }

    if (
      normalized === "confirmed" ||
      normalized === "assigned"
    ) {
      bg = "#dbeafe";
      color = "#2563eb";
    }

    if (
      normalized === "in progress" ||
      normalized === "in_progress"
    ) {
      bg = "#e0e7ff";
      color = "#4f46e5";
    }

    if (normalized === "completed") {
      bg = "#dcfce7";
      color = "#15803d";
    }

    if (
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {
      bg = "#fee2e2";
      color = "#dc2626";
    }

    return (
      <span
        style={{
          background: bg,
          color,
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "600",
          display: "inline-block",
          textTransform: "capitalize",
        }}
      >
        {status || "Unknown"}
      </span>
    );
  };

  /* =========================
     TABLE COLUMNS
  ========================= */

  const columns = [
    {
      key: "id",
      label: "Booking ID",
    },
    {
      key: "user_name",
      label: "Customer",
    },
    {
      key: "service_name",
      label: "Service",
    },
    {
      key: "technician_name",
      label: "Technician",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "time",
      label: "Time",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "actions",
      label: "Actions",
    },
  ];

  /* =========================
     TABLE DATA
  ========================= */

  const tableData = data.map((booking) => ({
    ...booking,

    technician_name:
      booking.technician_name ||
      "Unassigned",

    status: getStatusBadge(
      booking.status
    ),

    actions: (
      <button
        type="button"
        onClick={() =>
          openModal(booking)
        }
        className="btn-primary"
      >
        Update
      </button>
    ),
  }));

  return (
    <div className="page">

      <Helmet>
        <title>
          Bookings | Admin
        </title>
      </Helmet>

      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <h1>
          Bookings
        </h1>
      </div>

      {/* =========================
          BOOKINGS TABLE
      ========================= */}

      <div className="card-form">

        {loading ? (
          <div className="loader">
            Loading...
          </div>
        ) : (
          <DataTable
            data={tableData}
            columns={columns}
          />
        )}

      </div>

      {/* =========================
          BOOKING MODAL
      ========================= */}

      <BookingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        booking={selectedBooking}
        refreshBookings={load}
      />

    </div>
  );
}