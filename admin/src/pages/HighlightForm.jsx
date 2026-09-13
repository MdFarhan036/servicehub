import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const emptyForm = {
  label: "",
  value: "",
  is_active: 1
};

export default function HighlightForm() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  /* LOAD DATA (EDIT MODE) */
  useEffect(() => {
    if (!id) return;

    const fetchOne = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/highlights/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id]);

  /* HANDLE */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* SAVE */
  const save = async () => {
    if (!form.label.trim() || form.value === "") {
      alert("All fields required");
      return;
    }

    try {
      if (id) {
        await api.put(`/admin/highlights/${id}`, form);
      } else {
        await api.post("/admin/highlights", form);
      }

      navigate("/highlights");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="form-page">
      <h2>{id ? "Edit Highlight" : "Add Highlight"}</h2>

      <div className="form-group">
        <label>Value</label>
        <input
          name="value"
          value={form.value}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Label</label>
        <input
          name="label"
          value={form.label}
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

      <div className="form-actions">
        <button className="btn primary" onClick={save}>
          Save
        </button>

        <button className="btn" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </div>
  );
}