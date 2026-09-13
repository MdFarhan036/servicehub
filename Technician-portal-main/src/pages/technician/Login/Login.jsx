import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiTool
} from "react-icons/fi";

import Button from "../../../components/common/Button/Button";
import { useTechnicianAuth } from "../../../context/TechnicianAuthContext";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const { login } =
    useTechnicianAuth();

  const [form, setForm] =
    useState({
      email: "",
      password: ""
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });

    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.email ||
      !form.password
    ) {
      setError(
        "Please enter both email and password."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await login(
        form.email,
        form.password
      );

      navigate("/dashboard", {
        replace: true
      });

    } catch (err) {
      console.error(
        "Technician login error:",
        err
      );

      setError(
        err.response?.data?.msg ||
        "Invalid email or password."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">

        <div className="auth-brand">

          <div className="logo-mark">
            <FiTool />
          </div>

          <h2>
            ServiceHub
          </h2>

          <p>
            Technician Portal
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <label>
            <span>Email</span>

            <div className="input-with-icon">

              <FiMail />

              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={
                  handleChange
                }
              />

            </div>
          </label>

          <label>
            <span>Password</span>

            <div className="input-with-icon">

              <FiLock />

              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={
                  handleChange
                }
              />

            </div>
          </label>

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </Button>

        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}