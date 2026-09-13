import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export default function AboutAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/about");
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load About data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= HELPERS ================= */
  const getImageUrl = (path) => {
    if (!path) return "";
    return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  /* ================= STATES ================= */
  if (loading) {
    return <div className="loader">Loading About Page...</div>;
  }

  if (error) {
    return (
      <div className="error-box">
        <p>{error}</p>
        <button className="btn" onClick={fetchData}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="empty-box">
        <p>No About Data Found</p>
        <button
          className="btn primary"
          onClick={() => navigate("/about/edit")}
        >
          Create About Page
        </button>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="about-admin">

      {/* HEADER */}
      <div className="header">
        <h2>About Page</h2>

        <div className="actions">
          <button className="btn" onClick={fetchData}>
            Refresh
          </button>

          <button
            className="btn primary"
            onClick={() => navigate("/about/edit")}
          >
            Edit
          </button>
        </div>
      </div>

      {/* CONTENT CARD */}
     <div className="card">
  <h3>{data.hero_title}</h3>
  <p>{data.hero_subtitle}</p>

  <h4>{data.intro_title}</h4>
  <p>{data.intro_para1}</p>
  <p>{data.intro_para2}</p>

  <h4>Mission</h4>
  <p>{data.mission}</p>

  <h4>Vision</h4>
  <p>{data.vision}</p>

  <h4>Stats</h4>
  <ul>
    <li>{data.stat1_number} - {data.stat1_text}</li>
    <li>{data.stat2_number} - {data.stat2_text}</li>
    <li>{data.stat3_number} - {data.stat3_text}</li>
    <li>{data.stat4_number} - {data.stat4_text}</li>
  </ul>
<h4>SEO Settings</h4>
<p><strong>SEO Title:</strong> {data.seo_title}</p>
<p><strong>Description:</strong> {data.seo_description}</p>
<p><strong>Keywords:</strong> {data.seo_keywords}</p>
  <h4>CTA</h4>
  <p>{data.cta_title}</p>
  <p>{data.cta_subtitle}</p>
</div>
    </div>
  );
}