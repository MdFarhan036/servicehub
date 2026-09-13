import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";
import "../../pages/serviceDetails.css";

export default function HomeDailyDeals() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyDeals();
  }, []);

  const loadDailyDeals = async () => {
    try {
      setLoading(true);

      const res = await API.get("/services");
      const allServices = res.data || [];

      const dailyDeals = allServices.filter(
        (service) => Number(service.is_daily_deal) === 1
      );

      setServices(dailyDeals);

      const uniqueCategories = [
        ...new Map(
          dailyDeals
            .filter(
              (service) =>
                service.category_id !== null &&
                service.category_id !== undefined
            )
            .map((service) => [
              service.category_id,
              {
                id: service.category_id,
                name:
                  service.category_name ||
                  service.category ||
                  "Other",
              },
            ])
        ).values(),
      ];

      const hasOtherServices = dailyDeals.some(
        (service) =>
          service.category_id === null ||
          service.category_id === undefined
      );

      if (hasOtherServices) {
        uniqueCategories.push({
          id: "other",
          name: "Other",
        });
      }

      setCategories(uniqueCategories);

      if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0].id);
      } else {
        setActiveCategory("");
      }
    } catch (err) {
      console.error("Daily deals loading error:", err);
      setServices([]);
      setCategories([]);
      setActiveCategory("");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    if (
      service.category_id === null ||
      service.category_id === undefined
    ) {
      return activeCategory === "other";
    }

    return (
      String(service.category_id) ===
      String(activeCategory)
    );
  });

  if (!loading && services.length === 0) {
    return null;
  }

  return (
    <section className="daily-deals-section">
      <div className="container">

        <div className="section-header">
          <h2>Daily Deals</h2>

          <Link
            to="/daily-deals-listing"
            className="view-all-btn"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <p>Loading daily deals...</p>
        ) : (
          <>
            {categories.length > 0 && (
              <div className="category-tabs">
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() =>
                      setActiveCategory(category.id)
                    }
                    className={
                      String(activeCategory) ===
                      String(category.id)
                        ? "active-tab"
                        : ""
                    }
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            {filteredServices.length > 0 ? (
              <div className="services-grid">
                {filteredServices.map((service) => {
                  const image =
                    service.images?.[0] ||
                    service.image ||
                    null;

                  const originalPrice = Number(
                    service.price || 0
                  );

                  const dealPrice = Number(
                    service.daily_deal_price ||
                    service.price ||
                    0
                  );

                  return (
                    <div
                      className="service-card"
                      key={service.id}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={
                          service.title ||
                          "Daily Deal"
                        }
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "/placeholder.jpg";
                        }}
                      />

                      <div className="service-content">
                        <span className="deal-badge">
                          🔥 Deal
                        </span>

                        <h3>{service.title}</h3>

                        <div className="price-box">
                          {originalPrice > dealPrice && (
                            <span className="old-price">
                              ₹{originalPrice}
                            </span>
                          )}

                          <span className="deal-price">
                            ₹{dealPrice}
                          </span>
                        </div>

                        <Link
                          to={`/daily-deals/${service.id}`}
                          className="details-btn"
                        >
                          View Deal
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-data">
                No daily deals available in this category.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
