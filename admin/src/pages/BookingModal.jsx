import { useEffect, useState } from "react";
import API from "../services/api";
import "./bookingModal.css";

export default function BookingModal({
  isOpen,
  onClose,
  booking,
  refreshBookings
}) {
  const [status, setStatus] = useState("pending");
  const [technicianId, setTechnicianId] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);

  /* =========================
     LOAD BOOKING DATA
  ========================= */

  useEffect(() => {
    if (!isOpen || !booking) return;

    setStatus(booking.status || "pending");
    setTechnicianId(
      booking.technician_id
        ? String(booking.technician_id)
        : ""
    );

    loadTechnicians();
  }, [isOpen, booking]);

  /* =========================
     LOAD TECHNICIANS
  ========================= */

  const loadTechnicians = async () => {
    try {
      setLoadingTechnicians(true);

      const res = await API.get(
        "/technicians"
      );

      setTechnicians(res.data || []);

    } catch (err) {
      console.error(
        "Failed to load technicians:",
        err
      );

      setTechnicians([]);

    } finally {
      setLoadingTechnicians(false);
    }
  };

  /* =========================
     UPDATE BOOKING
  ========================= */

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.put(
        `/bookings/${booking.id}`,
        {
          status,
          technician_id:
            technicianId || null
        }
      );

      await refreshBookings();

      onClose();

    } catch (err) {
      console.error(
        "Failed to update booking:",
        err
      );

      alert(
        err.response?.data?.msg ||
        "Failed to update booking"
      );

    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !booking) {
    return null;
  }

  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <button
          type="button"
          onClick={onClose}
          className="modal-close"
        >
          ✕
        </button>

        <h2 className="modal-title">
          Update Booking
        </h2>

        {/* =========================
            BOOKING INFO
        ========================= */}

        <div className="service-info">

          <p>
            <strong>
              Booking ID:
            </strong>{" "}
            #{booking.id}
          </p>

          <p>
            <strong>
              Customer:
            </strong>{" "}
            {booking.user_name || "-"}
          </p>

          <p>
            <strong>
              Service:
            </strong>{" "}
            {booking.service_name || "-"}
          </p>

          <p>
            <strong>
              Date:
            </strong>{" "}
            {booking.date || booking.booking_date || "-"}
          </p>

          <p>
            <strong>
              Time:
            </strong>{" "}
            {booking.time || booking.booking_time || "-"}
          </p>

        </div>

        <form
          onSubmit={handleUpdate}
          className="modal-form"
        >

          {/* =========================
              TECHNICIAN
          ========================= */}

          <div className="form-group">

            <label>
              Assign Technician
            </label>

            <select
              value={technicianId}
              onChange={(e) =>
                setTechnicianId(
                  e.target.value
                )
              }
              className="input-field"
              disabled={loadingTechnicians}
            >

              <option value="">
                {loadingTechnicians
                  ? "Loading technicians..."
                  : "Unassigned"}
              </option>

              {technicians.map(
                (technician) => (
                  <option
                    key={technician.id}
                    value={technician.id}
                  >
                    {technician.name}

                    {technician.specialization
                      ? ` — ${technician.specialization}`
                      : ""}
                  </option>
                )
              )}

            </select>

          </div>

          {/* =========================
              STATUS
          ========================= */}

          <div className="form-group">

            <label>
              Booking Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              className="input-field"
            >

              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="assigned">
                Assigned
              </option>

              <option value="in_progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>

          </div>

          {/* =========================
              SUBMIT
          ========================= */}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Save Booking"}
          </button>

        </form>

      </div>

    </div>
  );
}