import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";
import "./HomePopularServices.css";

export default function HomePopularServices() {
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [groupedServices, setGroupedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularServices();
  }, []);

  /* =========================================
     GET SERVICE IMAGE
  ========================================= */

  const getServiceImage = (service) => {
    let image = null;

    /* -----------------------------------------
       1. ARRAY
       ----------------------------------------- */

    if (Array.isArray(service.images)) {
      image = service.images[0];
    }

    /* -----------------------------------------
       2. JSON STRING
       Example:
       '["/uploads/image.jpg"]'
       ----------------------------------------- */

    else if (
      typeof service.images === "string" &&
      service.images.trim()
    ) {
      try {
        const parsed = JSON.parse(service.images);

        if (Array.isArray(parsed)) {
          image = parsed[0];
        } else if (typeof parsed === "string") {
          image = parsed;
        }
      } catch {
        // Normal string path
        image = service.images;
      }
    }

    /* -----------------------------------------
       3. OTHER POSSIBLE IMAGE FIELDS
       ----------------------------------------- */

    if (!image && service.image) {
      image = service.image;
    }

    if (!image && service.service_image) {
      image = service.service_image;
    }

    if (!image && service.service_images) {
      if (Array.isArray(service.service_images)) {
        image = service.service_images[0];
      } else if (
        typeof service.service_images === "string"
      ) {
        try {
          const parsed = JSON.parse(
            service.service_images
          );

          image = Array.isArray(parsed)
            ? parsed[0]
            : parsed;
        } catch {
          image = service.service_images;
        }
      }
    }

    /* -----------------------------------------
       4. RESOLVE FINAL URL
       ----------------------------------------- */

    return getImageUrl(image);
  };

  /* =========================================
     FETCH POPULAR SERVICES
  ========================================= */

  const fetchPopularServices = async () => {
    try {
      setLoading(true);

      const res = await API.get("/services");

      const allServices = res.data || [];

      console.log(
        "ALL SERVICES:",
        allServices
      );

      /* =========================================
         FILTER POPULAR SERVICES
      ========================================= */

      const popularServices =
        allServices.filter(
          (service) =>
            Number(service.is_popular) === 1
        );

      /* =========================================
         GROUP SERVICES BY CATEGORY
      ========================================= */

      const groupedMap = {};

      popularServices.forEach((service) => {
        const category =
          service.category_name ||
          service.category ||
          "Other";

        if (!groupedMap[category]) {
          groupedMap[category] = [];
        }

        groupedMap[category].push(service);
      });

      const grouped =
        Object.keys(groupedMap).map(
          (key) => ({
            name: key,
            services: groupedMap[key],
          })
        );

      setServices(popularServices);
      setGroupedServices(grouped);

      setActiveTab(0);

    } catch (err) {
      console.error(
        "Popular services error:",
        err
      );

      setServices([]);
      setGroupedServices([]);
      setActiveTab(0);

    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <p>
        Loading popular services...
      </p>
    );
  }

  /* =========================================
     EMPTY STATE
  ========================================= */

  if (!services.length) {
    return (
      <p
        style={{
          textAlign: "center",
        }}
      >
        No popular services available.
      </p>
    );
  }

  return (
    <section className="popular-services-section">
      <div className="container">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="section-header">

          <h2>
            Popular Services
          </h2>

          <Link
            to="/popular-services-listing"
            className="view-all-btn"
          >
            View All
          </Link>

        </div>

        {/* =====================================
            CATEGORY TABS
        ===================================== */}

        {groupedServices.length > 0 && (
          <div className="category-tabs">

            {groupedServices.map(
              (category, index) => (
                <button
                  type="button"
                  key={category.name}
                  onClick={() =>
                    setActiveTab(index)
                  }
                  className={
                    activeTab === index
                      ? "active-tab"
                      : ""
                  }
                >
                  {category.name}
                </button>
              )
            )}

          </div>
        )}

        {/* =====================================
            SERVICES
        ===================================== */}

        <div className="services-grid">

          {groupedServices.length > 0 &&
            groupedServices[
              activeTab
            ]?.services?.map(
              (service) => {

                const image =
                  getServiceImage(service);

                console.log(
                  "SERVICE IMAGE:",
                  service.title,
                  image
                );

                return (
                  <div
                    className="service-card"
                    key={service.id}
                  >

                    {/* IMAGE */}

                    <div className="service-image">

                      <img
                        src={image}
                        alt={
                          service.title ||
                          "Popular Service"
                        }
                        loading="lazy"
                        onError={(e) => {
                          console.error(
                            "IMAGE FAILED:",
                            e.currentTarget.src
                          );

                          e.currentTarget.onerror =
                            null;

                          e.currentTarget.src =
                            "/placeholder.jpg";
                        }}
                      />

                    </div>

                    {/* CONTENT */}

                    <div className="service-content">

                      <h3>
                        {service.title}
                      </h3>

                      <p>
                        ₹{service.price}
                      </p>

                      <Link
                        to={`/popular-services/${service.id}`}
                        className="details-btn"
                      >
                        View Details
                      </Link>

                    </div>

                  </div>
                );
              }
            )}

        </div>

      </div>
    </section>
  );
}