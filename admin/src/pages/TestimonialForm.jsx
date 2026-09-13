import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const emptyForm = {
  name: "",
  message: "",
  designation: "",
  organization: "",
  sort_order: 1,
  is_active: 1,
  image: null,
  image_url: ""
};

export default function TestimonialForm() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchOne = async () => {
      setLoading(true);
      const res = await api.get(`/admin/testimonials/${id}`);
      setForm({ ...res.data, image: null });
      setLoading(false);
    };

    fetchOne();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const save = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      alert("Name & message required");
      return;
    }

    try {
      setSaving(true);

      const fd = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null) fd.append(key, form[key]);
      });

      if (id) {
        await api.put(`/admin/testimonials/${id}`, fd);
      } else {
        await api.post("/admin/testimonials", fd);
      }

      navigate("/testimonials");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>{id ? "Edit Testimonial" : "Add Testimonial"}</h1>
      </div>

      <div className="card-form">

        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Designation</label>
          <input name="designation" value={form.designation} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea name="message" value={form.message} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Photo</label>
          <input
            type="file"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files[0] })
            }
          />
        </div>
        <div className="form-group">
          <label>Organization</label>
          <input
            name="organization"
            value={form.organization}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Sort Order</label>
          <input
            type="number"
            name="sort_order"
            value={form.sort_order}
            onChange={handleChange}
          />
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.is_active === 1}
            onChange={(e) =>
              setForm({
                ...form,
                is_active: e.target.checked ? 1 : 0
              })
            }
          />
          Active
        </label>
        <div className="form-group">
  <label>SEO Title</label>
  <input
    value={form.seo_title || ""}
    onChange={(e) =>
      setForm({
        ...form,
        seo_title: e.target.value
      })
    }
  />
</div>

<div className="form-group">
  <label>SEO Description</label>
  <textarea
    value={form.seo_description || ""}
    onChange={(e) =>
      setForm({
        ...form,
        seo_description: e.target.value
      })
    }
  />
</div>

<div className="form-group">
  <label>SEO Keywords</label>
  <input
    value={form.seo_keywords || ""}
    onChange={(e) =>
      setForm({
        ...form,
        seo_keywords: e.target.value
      })
    }
  />
</div>

        <div className="form-actions">
          <button className="btn-primary" onClick={save}>
            {saving ? "Saving..." : "Save"}
          </button>

          <button className="btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}