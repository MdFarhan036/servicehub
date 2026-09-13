import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ReviewForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    service: "",
    rating: 5,
    category: "",
    review_text: "",
    review_date: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const save = async () => {
    await api.post("/admin/reviews", form);
    navigate("/admin/reviews");
  };

  return (
    <div className="form-page">
      <h2>Add Review</h2>

      <input
        name="name"
        placeholder="Customer Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="service"
        placeholder="Service Name"
        value={form.service}
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
      />

      <input
        type="number"
        name="rating"
        min="1"
        max="5"
        value={form.rating}
        onChange={handleChange}
      />

      <input
        type="date"
        name="review_date"
        value={form.review_date}
        onChange={handleChange}
      />

      <textarea
        name="review_text"
        placeholder="Review"
        value={form.review_text}
        onChange={handleChange}
      />

      <button onClick={save}>
        Save Review
      </button>
    </div>
  );
}