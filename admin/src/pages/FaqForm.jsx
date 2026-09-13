import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const emptyForm = {
  question: "",
  answer: "",
  sort_order: 1,
  is_active: 1
};

export default function FaqForm() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  /* LOAD EDIT */
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/faqs/${id}`);
        setForm(res.data || emptyForm);
      } catch (err) {
        console.error(err);
        alert("Failed to load FAQ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* HANDLE CHANGE */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* SAVE */
  const save = async () => {
    const question = form.question.trim();
    const answer = form.answer.trim();

    if (!question || !answer) {
      alert("Question & Answer are required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        question,
        answer,
        sort_order: Number(form.sort_order) || 1
      };

      if (id) {
        await api.put(`/faqs/${id}`, payload);
      } else {
        await api.post("/faqs", payload);
      }

      navigate("/faqs");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="page">

      {/* Optional SEO */}
      <Helmet>
        <title>{id ? "Edit FAQ" : "Add FAQ"}</title>
      </Helmet>

      <div className="page-header">
        <h1>{id ? "Edit FAQ" : "Add FAQ"}</h1>
      </div>

      <div className="card-form">

        {/* QUESTION */}
        <div className="form-group">
          <label>Question</label>
          <input
            name="question"
            value={form.question}
            onChange={handleChange}
            placeholder="Enter question"
          />
        </div>

        {/* ANSWER */}
        <div className="form-group">
          <label>Answer</label>
          <textarea
            name="answer"
            value={form.answer}
            onChange={handleChange}
            placeholder="Enter answer"
          />
        </div>

        {/* SORT ORDER */}
        <div className="form-group">
          <label>Sort Order</label>
          <input
            type="number"
            name="sort_order"
            value={form.sort_order}
            onChange={handleChange}
            min="1"
          />
        </div>

        {/* STATUS */}
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

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            className="btn-primary"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}