import { useState } from "react";
import Button from "../../../components/common/Button/Button";
import API from "../../../services/api";
import "./Settings.css";

export default function Settings() {
  const [toggles, setToggles] = useState({
    jobAlerts: true,
    promo: false,
    sms: true,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggle(key) {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function handlePasswordChange(e) {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setMessage("");
    setError("");
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setError("Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.put(
        "/technicians/change-password",
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }
      );

      setMessage(
        res.data?.msg || "Password updated successfully."
      );

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {
      console.error("Change password error:", err);

      setError(
        err.response?.data?.msg ||
        "Failed to update password."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="settings-page">

      <h1 className="settings-title">
        Settings
      </h1>


      {/* =========================
          NOTIFICATION SETTINGS
      ========================= */}

      <div className="card settings-block">

        <h4>
          Notification Preferences
        </h4>

        {[
          {
            key: "jobAlerts",
            label: "New job alerts",
          },
          {
            key: "promo",
            label: "Promotional messages",
          },
          {
            key: "sms",
            label: "SMS notifications",
          },
        ].map((item) => (

          <div
            className="settings-row"
            key={item.key}
          >

            <span>
              {item.label}
            </span>

            <button
              type="button"
              className={`toggle-switch ${
                toggles[item.key]
                  ? "on"
                  : ""
              }`}
              onClick={() =>
                toggle(item.key)
              }
            >
              <span className="toggle-knob" />
            </button>

          </div>

        ))}

      </div>


      {/* =========================
          CHANGE PASSWORD
      ========================= */}

      <div className="card settings-block">

        <h4>
          Change Password
        </h4>


        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}


        {message && (
          <div className="settings-success">
            {message}
          </div>
        )}


        <form
          className="settings-form"
          onSubmit={handleUpdatePassword}
        >

          <input
            type="password"
            name="currentPassword"
            placeholder="Current password"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
          />


          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
          />


          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
          />


          <Button
            type="submit"
            size="md"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </Button>

        </form>

      </div>

    </div>
  );
}