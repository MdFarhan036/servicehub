import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      role: ""
    });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const res = await API.get(`/users/${id}`);
    setFormData(res.data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.put(`/users/${id}`, formData);

    alert("User updated");
    navigate("/users");
  };

  return (
    <div className="page">
      <h1>Edit User</h1>

      <form
        onSubmit={handleSubmit}
        className="card-form"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <select
          name="role"
          value={formData.role}
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
          Update User
        </button>
      </form>
    </div>
  );
}