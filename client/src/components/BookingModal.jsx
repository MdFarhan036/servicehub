import { useState } from "react";
import "./bookingModal.css";

export default function BookingModal({ isOpen, onClose, service }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
    time: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.date ||
      !formData.time
    ) {
      setError("Please fill all fields");
      return;
    }

    setError("");

    // Save locally
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push({
      ...formData,
      service: service?.title,
      price: service?.price,
    });
    localStorage.setItem("bookings", JSON.stringify(bookings));

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        {/* CLOSE */}
        <button onClick={onClose} className="modal-close">
          ✕
        </button>

        {/* TITLE */}
        <h2 className="modal-title">{service?.title}</h2>

        {/* SERVICE INFO */}
        <div className="service-info">
          <span className="rating">⭐ {service?.rating || 4.5}</span>
          <span className="price">₹{service?.price}</span>
        </div>

        {success ? (
          <div className="success-box">
            Booking Successful 🎉
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">

            {error && (
              <div className="error-box">{error}</div>
            )}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input-field"
            />

            {/* NEW TIME FIELD */}
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="input-field"
            />

            <button type="submit" className="submit-btn">
              Book Now
            </button>

          </form>
        )}
      </div>
    </div>
  );
}