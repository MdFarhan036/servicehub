import "./terms.css";

export default function Terms() {
  return (
    <div className="terms-container">

      <h1 className="terms-title">Terms & Conditions</h1>

      <p className="terms-intro">
        By using ServiceHub, you agree to comply with the following terms
        and conditions. Please read them carefully before using our platform.
      </p>

      {/* SECTION 1 */}
      <div className="terms-section">
        <h2>1. Use of Services</h2>
        <p>
          Users must provide accurate and complete information while booking
          services. Any misuse of the platform may result in account suspension.
        </p>
      </div>

      {/* SECTION 2 */}
      <div className="terms-section">
        <h2>2. Booking & Payments</h2>
        <p>
          All bookings are subject to availability. Prices may vary depending
          on service requirements and location.
        </p>
      </div>

      {/* SECTION 3 */}
      <div className="terms-section">
        <h2>3. Cancellation Policy</h2>
        <p>
          Users can cancel or reschedule bookings within the allowed time.
          Late cancellations may incur charges.
        </p>
      </div>

      {/* SECTION 4 */}
      <div className="terms-section">
        <h2>4. Liability</h2>
        <p>
          ServiceHub is not liable for damages caused by third-party service
          providers. However, we ensure all professionals are verified.
        </p>
      </div>

      {/* SECTION 5 */}
      <div className="terms-section">
        <h2>5. Privacy</h2>
        <p>
          Your personal data is securely stored and never shared without
          your consent. Please review our privacy policy for more details.
        </p>
      </div>

    </div>
  );
}