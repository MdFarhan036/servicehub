import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/users", formData);

      alert("User created successfully");
      navigate("/users");

    } catch (err) {
      console.log(err);
      alert("Failed to create user");
    }
  };

  return (
    <div className="page">
      <h1>Add User</h1>

      <form
        onSubmit={handleSubmit}
        className="card-form"
      >
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
        />

        <select
          name="role"
          onChange={handleChange}
        >
          <option value="user">
            User
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        <button className="btn-primary">
          Save User
        </button>
      </form>
    </div>
  );
}