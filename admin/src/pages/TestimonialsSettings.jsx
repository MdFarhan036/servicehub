import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function TestimonialsSettings() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/admin/testimonials-page").then(res =>
      setForm(res.data || {})
    );
  }, []);

  const save = async () => {
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));

    await api.put("/admin/testimonials-page", fd);
    alert("Saved");
  };

  return (
    <div className="page">

      <div className="page-header">
        <h1>Testimonials Settings</h1>
      </div>

      <div className="card-form">

        <div className="form-group">
          <label>Hero Title</label>
          <input
            value={form.hero_title || ""}
            onChange={(e) =>
              setForm({ ...form, hero_title: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Hero Subtitle</label>
          <textarea
            value={form.hero_subtitle || ""}
            onChange={(e) =>
              setForm({ ...form, hero_subtitle: e.target.value })
            }
          />
        </div>

        <div className="form-actions">
          <button className="btn-primary" onClick={save}>
            Save
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}