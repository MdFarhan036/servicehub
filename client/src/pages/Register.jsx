import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./register.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      address,
      city,
      state,
      pincode,
    } = formData;

    // Required fields
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all required fields");
      return;
    }

    // Password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    // Phone validation
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError(
        "Please enter a valid 10-digit mobile number"
      );
      return;
    }

    // Pincode validation if entered
    if (
      pincode &&
      !/^\d{6}$/.test(pincode)
    ) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name,
        email,
        phone,
        password,
        address,
        city,
        state,
        pincode,
      });

      alert("Registration successful!");

      navigate("/login");

    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      <form
        onSubmit={handleSubmit}
        className="register-box"
      >

        <h2 className="register-title">
          Create your account
        </h2>

        <p className="register-subtitle">
          Sign up to book trusted home services
        </p>

        {error && (
          <p className="register-error">
            {error}
          </p>
        )}

        {/* Name */}
        <div className="register-field">
          <label>
            Full Name <span>*</span>
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            className="register-input"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="register-field">
          <label>
            Email Address <span>*</span>
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="register-input"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <div className="register-field">
          <label>
            Mobile Number <span>*</span>
          </label>

          <div className="phone-input">
            <span>+91</span>

            <input
              type="tel"
              name="phone"
              placeholder="10 digit mobile number"
              maxLength="10"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Password */}
        <div className="register-field">
          <label>
            Password <span>*</span>
          </label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            className="register-input"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Confirm Password */}
        <div className="register-field">
          <label>
            Confirm Password <span>*</span>
          </label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            className="register-input"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="register-field">
          <label>Address</label>

          <textarea
            name="address"
            placeholder="Enter your address"
            className="register-input register-textarea"
            value={formData.address}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {/* City + State */}
        <div className="register-row">

          <div className="register-field">
            <label>City</label>

            <input
              type="text"
              name="city"
              placeholder="City"
              className="register-input"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="register-field">
            <label>State</label>

            <input
              type="text"
              name="state"
              placeholder="State"
              className="register-input"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Pincode */}
        <div className="register-field">
          <label>Pincode</label>

          <input
            type="text"
            name="pincode"
            placeholder="6 digit pincode"
            maxLength="6"
            className="register-input"
            value={formData.pincode}
            onChange={handleChange}
          />
        </div>

        {/* Terms */}
        <label className="terms-checkbox">
          <input
            type="checkbox"
            required
          />

          <span>
            I agree to the Terms & Conditions
            and Privacy Policy
          </span>
        </label>

        {/* Register */}
        <button
          type="submit"
          className="register-btn"
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>

        {/* Login */}
        <p className="login-link">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>

      </form>
    </div>
  );
}