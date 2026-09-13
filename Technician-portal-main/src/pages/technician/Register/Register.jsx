import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock, FiTool } from "react-icons/fi";
import Button from "../../../components/common/Button/Button";
import "../Login/Login.css";

const categories = ["Electrician", "Plumber", "AC Repair", "Carpenter", "Appliance Repair"];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", category: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.category || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    localStorage.setItem("sh_technician_auth", JSON.stringify({ email: form.email, name: form.name }));
    navigate("/dashboard");
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-brand">
          <div className="logo-mark"><FiTool /></div>
          <h2>Join ServiceHub</h2>
          <p>Register as a Technician</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <label>
            <span>Full Name</span>
            <div className="input-with-icon">
              <FiUser />
              <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
            </div>
          </label>

          <label>
            <span>Email</span>
            <div className="input-with-icon">
              <FiMail />
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>
          </label>

          <label>
            <span>Phone</span>
            <div className="input-with-icon">
              <FiPhone />
              <input name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
            </div>
          </label>

          <label>
            <span>Service Category</span>
            <div className="input-with-icon">
              <FiTool />
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </label>

          <label>
            <span>Password</span>
            <div className="input-with-icon">
              <FiLock />
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
            </div>
          </label>

          <Button type="submit" fullWidth size="lg">Create Account</Button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
