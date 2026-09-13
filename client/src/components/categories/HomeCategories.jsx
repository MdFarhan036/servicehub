import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import "../../pages/home.css";
import { getImageUrl } from "../../utils/imageUrl";
/* ================= IMAGE URL ================= */


export default function HomeCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");

      setCategories(res.data || []);
    } catch (err) {
      console.error("Categories error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (!categories.length) {
    return null;
  }

  return (
    <section className="home-categories">
      <div className="container">

        <div className="section-header">
          <h2>
            Browse Service Categories
          </h2>

          <p>
            Find services based on your needs
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/services/category/${category.id}`}
              className="category-card"
            >
              <img
                src={getImageUrl(category.image)}
                alt={category.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "/placeholder.jpg";
                }}
              />

              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}