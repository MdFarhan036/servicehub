import "./careers.css";

export default function Careers() {
  return (
    <div className="careers-container">

      <h1 className="careers-title">Careers</h1>

      <p className="careers-text">
        Join our growing team! We are always looking for talented
        professionals in tech, operations and customer support.
      </p>

      {/* Optional Roles Section */}
      <div className="careers-roles">
        <div className="role-card">💻 Frontend Developer</div>
        <div className="role-card">⚙️ Backend Developer</div>
        <div className="role-card">🎧 Customer Support</div>
        <div className="role-card">📦 Operations Manager</div>
      </div>

    </div>
  );
}