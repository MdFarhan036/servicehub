import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function FaqsAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  /* FETCH */
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/faqs");
      setData(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* DELETE */
  const remove = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;

    try {
      await api.delete(`/faqs/${id}`);
      setData((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* SEARCH FILTER */
  const filtered = data.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">

      <Helmet>
        <title>FAQs Management</title>
      </Helmet>

      {/* HEADER */}
      <div className="page-header">
        <h1>FAQs</h1>

        <button
          className="btn-primary"
          onClick={() => navigate("/faqs/add")}
        >
          + Add FAQ
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="search-input"
        placeholder="Search FAQs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="card-form">

        {loading && <div className="loader">Loading...</div>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 20 }}>
            No records found
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Order</th>
                <th>Status</th>
                <th width="150">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((faq) => (
                <tr key={faq.id}>
                  <td>{faq.question}</td>

                  <td style={{ maxWidth: 300 }}>
                    {faq.answer.length > 80
                      ? faq.answer.substring(0, 80) + "..."
                      : faq.answer}
                  </td>

                  <td>{faq.sort_order}</td>

                  <td>
                    <span
                      className={
                        faq.is_active
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {faq.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="actions">
                    <button
                      className="btn-primary"
                      onClick={() =>
                        navigate(`/faqs/edit/${faq.id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn-secondary"
                      onClick={() => remove(faq.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}