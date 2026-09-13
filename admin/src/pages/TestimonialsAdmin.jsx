import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function TestimonialsAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/testimonials");
      setData(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    await api.delete(`/admin/testimonials/${id}`);
    setData((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="page">

      <div className="page-header">
        <h1>Testimonials</h1>

        <div>
          <button
            className="btn-secondary"
            onClick={() => navigate("/testimonials/settings")}
          >
            Settings
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/testimonials/add")}
            style={{ marginLeft: 10 }}
          >
            + Add
          </button>
        </div>
      </div>

      <div className="card-form">

        {loading && <div className="loader">Loading...</div>}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Order</th>
              <th>Status</th>
              <th width="150">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((t) => (
              <tr key={t.id}>
                <td>
                  {t.image_url && (
                    <img
                      src={`http://localhost:5000${t.image_url}`}
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%" }}
                    />
                  )}
                </td>

                <td>{t.name}</td>
                <td>{t.designation}</td>
                <td>{t.sort_order}</td>
                <td>{t.is_active ? "Active" : "Inactive"}</td>

                <td className="actions">
                  <button
                    className="btn-primary"
                    onClick={() =>
                      navigate(`/testimonials/edit/${t.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => remove(t.id)}
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