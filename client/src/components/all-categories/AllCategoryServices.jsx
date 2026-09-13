import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";
import "../../pages/serviceDetails.css";

export default function AllCategoryServices() {
  const [categories, setCategories] = useState([]);
  const [servicesByCategory, setServicesByCategory] =
    useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [categoryRes, serviceRes] =
        await Promise.all([
          API.get("/categories"),
          API.get("/services"),
        ]);

      const allCategories =
        categoryRes.data || [];

      const allServices =
        serviceRes.data || [];

      setCategories(allCategories);

      // Group services by category
      const grouped = {};

      allServices.forEach((service) => {
        if (!grouped[service.category_id]) {
          grouped[service.category_id] = [];
        }

        grouped[service.category_id].push(service);
      });

      setServicesByCategory(grouped);

    } catch (err) {
      console.error(
        "Error loading categories/services:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading services...</p>;
  }

  if (!categories.length) {
    return (
      <p>No categories found</p>
    );
  }

  return (
    <section className="all-category-services">
      <div className="container">

        {categories.map((category) => (
          <div
            key={category.id}
            className="category-section"
          >
            {/* HEADER */}
            <div className="section-header">
              <h2>{category.name}</h2>

              <Link
                to={`/services/category/${category.id}`}
                className="view-all-btn"
              >
                View All
              </Link>
            </div>

            {/* SERVICES */}
            <div className="services-grid">
              {servicesByCategory[
                category.id
              ]?.length > 0 ? (

                servicesByCategory[
                  category.id
                ]
                  .slice(0, 4)
                  .map((service) => {

                    const image =
                      service.images?.[0] ||
                      service.image ||
                      null;

                    return (
                      <div
                        className="service-card"
                        key={service.id}
                      >

                        {/* IMAGE */}
                        <img
                          src={getImageUrl(image)}
                          alt={service.title}
                          onError={(e) => {
                            e.currentTarget.src =
                              "/placeholder.jpg";
                          }}
                        />

                        <div className="service-content">

                          <span className="category-tag">
                            {category.name}
                          </span>

                          <h3>
                            {service.title}
                          </h3>

                          <p>
                            ₹{service.price}
                          </p>

                          <Link
                            to={`/service/${service.id}`}
                            className="details-btn"
                          >
                            View Details
                          </Link>

                        </div>
                      </div>
                    );
                  })

              ) : (

                <p>
                  No services available
                </p>

              )}
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}