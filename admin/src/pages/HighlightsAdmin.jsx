import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function HighlightsAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/highlights");
      setData(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load highlights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this highlight?")) return;

    try {
      await api.delete(`/admin/highlights/${id}`);
      setData((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="page">

      {/* HEADER */}
      <div className="page-header">
        <h1>Highlights</h1>

        <button
          className="btn-primary"
          onClick={() => navigate("/highlights/add")}
        >
          + Add Highlight
        </button>
      </div>

      {/* CARD */}
      <div className="card-form">

        {loading && <div className="loader">Loading...</div>}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Value</th>
              <th>Label</th>
              <th>Status</th>
              <th width="150">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && !loading && (
              <tr>
                <td colSpan="4" align="center">
                  No records found
                </td>
              </tr>
            )}

            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.value}</td>
                <td>{item.label}</td>
                <td>
                  <span
                    className={
                      item.is_active ? "status active" : "status inactive"
                    }
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="actions">
                  <button
                    className="btn-primary"
                    onClick={() =>
                      navigate(`/highlights/edit/${item.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => remove(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}