import { useState } from "react";
import API from "../services/api";
import "./contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        await API.post(
          "/contact",
          form
        );

        setSuccess(
          "Message sent successfully!"
        );

        setForm({
          name: "",
          email: "",
          phone: "",
          message: ""
        });

      } catch (err) {
        console.log(err);
        alert(
          "Failed to send message"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="contact-page">

      {/* HERO */}
      <section className="contact-hero">
        <h1>
          Contact Us
        </h1>

        <p>
          Need help with bookings,
          services or partnerships?
          We’re here to help.
        </p>
      </section>

      {/* MAIN */}
      <section className="contact-main">
        
        {/* FORM */}
        <div className="contact-form-box">
          <h2>
            Send Us a Message
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={
                handleChange
              }
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={
                handleChange
              }
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={
                handleChange
              }
              required
            />

        

            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={
                handleChange
              }
              rows="5"
              required
            />

            <button type="submit">
              {loading
                ? "Sending..."
                : "Send Message"}
            </button>
          </form>

          {success && (
            <p className="success-msg">
              {success}
            </p>
          )}
        </div>

        {/* CONTACT INFO */}
        <div className="contact-info-box">
          <h2>
            Get In Touch
          </h2>

          <div className="info-item">
            📍 Jaipur, Rajasthan, India
          </div>

          <div className="info-item">
            📞 +91 9876543210
          </div>

          <div className="info-item">
            ✉ support@yourwebsite.com
          </div>

          <div className="info-item">
            ⏰ Mon - Sun: 9 AM - 9 PM
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="contact-faq">
        <h2>
          Frequently Asked Questions
        </h2>

        <div className="faq-grid">
          <div className="faq-card">
            <h3>
              How do I book a service?
            </h3>
            <p>
              Select your service,
              choose date/time and
              confirm booking.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              Can I cancel booking?
            </h3>
            <p>
              Yes, bookings can be
              cancelled from your
              dashboard.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              Do you offer warranty?
            </h3>
            <p>
              Yes, selected services
              include service warranty.
            </p>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="contact-map">
        <h2>
          Our Location
        </h2>

        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb="
          width="100%"
          height="400"
          style={{
            border: 0,
            borderRadius: "12px"
          }}
          allowFullScreen=""
          loading="lazy"
        />
      </section>

      {/* CTA */}
      <section className="contact-cta">
        <h2>
          Need Instant Help?
        </h2>

        <p>
          Call our customer support
          team anytime.
        </p>

        <button>
          Call Now
        </button>
      </section>
    </div>
  );
}