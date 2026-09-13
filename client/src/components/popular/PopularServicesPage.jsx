import { useState, useEffect } from "react";
import ServiceCard from "../ServiceCard";
import ServiceSkeleton from "../ServiceSkeleton";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";
import "../../pages/services.css";

export default function PopularServicesPage() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [sortBy, setSortBy] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  /* UI ONLY */
  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartAddedId, setCartAddedId] = useState(null);

  const servicesPerPage = 6;

  /* =========================================
     FETCH POPULAR SERVICES
  ========================================= */

  const loadPopularServices = async () => {
    try {
      setLoading(true);

      const res = await API.get("/services");

      const popularServices = (res.data || [])
        .filter(
          (s) => Number(s.is_popular) === 1
        )
        .map((s) => {
          const image =
            s.images?.[0] ||
            s.image ||
            null;

          return {
            id: s.id,

            title: s.title,

            category:
              s.category_name ||
              s.category ||
              "Other",

            /* USE CENTRAL IMAGE HELPER */
            images: [
              getImageUrl(image)
            ],

            price: Number(s.price || 0),

            rating:
              Number(s.rating) || 4.5,

            badge: "🔥 Popular",
          };
        });

      setServices(popularServices);

    } catch (err) {
      console.error(
        "Error fetching popular services:",
        err
      );

      setServices([]);

    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    loadPopularServices();
  }, []);

  /* =========================================
     RESET PAGE WHEN FILTER CHANGES
  ========================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    selectedCategory,
    sortBy,
    maxPrice,
  ]);

  /* =========================================
     WISHLIST
  ========================================= */

  const handleWishlist = (id) => {
    setWishlistIds((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );
  };

  /* =========================================
     CART
  ========================================= */

  const handleCart = (id) => {
    setCartAddedId(id);

    setTimeout(() => {
      setCartAddedId(null);
    }, 1000);
  };

  /* =========================================
     FILTER
  ========================================= */

  let filteredServices = services.filter(
    (service) => {
      const title =
        service.title || "";

      const category =
        service.category || "Other";

      const price =
        Number(service.price || 0);

      return (
        title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) &&
        (
          selectedCategory === "All" ||
          category === selectedCategory
        ) &&
        price <= maxPrice
      );
    }
  );

  /* =========================================
     SORT
  ========================================= */

  if (sortBy === "priceLow") {
    filteredServices.sort(
      (a, b) =>
        Number(a.price) -
        Number(b.price)
    );
  }

  if (sortBy === "priceHigh") {
    filteredServices.sort(
      (a, b) =>
        Number(b.price) -
        Number(a.price)
    );
  }

  if (sortBy === "rating") {
    filteredServices.sort(
      (a, b) =>
        Number(b.rating) -
        Number(a.rating)
    );
  }

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages = Math.ceil(
    filteredServices.length /
      servicesPerPage
  );

  const indexOfLast =
    currentPage *
    servicesPerPage;

  const indexOfFirst =
    indexOfLast -
    servicesPerPage;

  const currentServices =
    filteredServices.slice(
      indexOfFirst,
      indexOfLast
    );

  /* =========================================
     DYNAMIC CATEGORIES
  ========================================= */

  const categories = [
    "All",
    ...new Set(
      services.map(
        (service) =>
          service.category
      )
    ),
  ];

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="services-container">

      {/* TITLE */}

      <h2 className="services-title">
        Popular Services
      </h2>

      <p className="services-subtitle">
        Most booked services by users
      </p>

      {/* =====================================
          SEARCH
      ===================================== */}

      <div className="search-box">
        <input
          type="text"
          placeholder="Search popular services..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />
      </div>

      {/* =====================================
          CATEGORY
      ===================================== */}

      <div className="categories">
        {categories.map(
          (cat) => (
            <button
              type="button"
              key={cat}
              onClick={() =>
                setSelectedCategory(
                  cat
                )
              }
              className={
                selectedCategory === cat
                  ? "active"
                  : ""
              }
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* =====================================
          FILTER
      ===================================== */}

      <div className="filters">

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value
            )
          }
        >
          <option value="">
            Sort
          </option>

          <option value="priceLow">
            Low Price
          </option>

          <option value="priceHigh">
            High Price
          </option>

          <option value="rating">
            Rating
          </option>
        </select>

        <div className="price-filter">

          <label>
            Max ₹{maxPrice}
          </label>

          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(
                Number(
                  e.target.value
                )
              )
            }
          />

        </div>
      </div>

      {/* =====================================
          GRID
      ===================================== */}

      <div className="services-grid">

        {loading ? (

          Array.from({
            length: 6,
          }).map((_, i) => (
            <ServiceSkeleton
              key={i}
            />
          ))

        ) : currentServices.length > 0 ? (

          currentServices.map(
            (service) => (
              <ServiceCard
                key={service.id}
                {...service}

                detailsRoute={`/popular-services/${service.id}`}

                wishlisted={
                  wishlistIds.includes(
                    service.id
                  )
                }

                addedToCart={
                  cartAddedId ===
                  service.id
                }

                onWishlist={
                  handleWishlist
                }

                onCart={
                  handleCart
                }
              />
            )
          )

        ) : (

          <p className="no-data">
            No popular services found
          </p>

        )}

      </div>

      {/* =====================================
          PAGINATION
      ===================================== */}

      {totalPages > 1 &&
        !loading && (
          <div className="pagination">

            {Array.from(
              {
                length:
                  totalPages,
              },
              (_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() =>
                    setCurrentPage(
                      i + 1
                    )
                  }
                  className={
                    currentPage ===
                    i + 1
                      ? "active"
                      : ""
                  }
                >
                  {i + 1}
                </button>
              )
            )}

          </div>
        )}

    </div>
  );
}