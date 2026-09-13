import { useState, useEffect } from "react";
import ServiceCard from "../ServiceCard";
import ServiceSkeleton from "../ServiceSkeleton";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";
import "../../pages/services.css";

export default function DailyDealsPage() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [sortBy, setSortBy] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [wishlistIds, setWishlistIds] = useState([]);
  const [cartAddedId, setCartAddedId] = useState(null);

  const servicesPerPage = 6;

  /* =====================================================
     FETCH DAILY DEAL SERVICES
  ===================================================== */
  const loadDailyDeals = async () => {
    try {
      setLoading(true);

      const res = await API.get("/services");

      const allServices = res.data || [];

      const dailyDeals = allServices
        .filter(
          (service) =>
            Number(service.is_daily_deal) === 1
        )
        .map((service) => ({
          id: service.id,

          title: service.title,

          category:
            service.category_name ||
            service.category ||
            "Other",

          /*
            KEEP ORIGINAL IMAGE PATHS
            getImageUrl() will create the
            correct production URL.
          */
          images: Array.isArray(service.images)
            ? service.images
            : service.image
            ? [service.image]
            : [],

          /*
            Discounted price
          */
          price: Number(
            service.daily_deal_price ||
              service.price ||
              0
          ),

          /*
            Original price
          */
          originalPrice: Number(
            service.price || 0
          ),

          rating: Number(
            service.rating || 4.5
          ),

          badge: "⚡ Daily Deal",
        }));

      setServices(dailyDeals);

    } catch (err) {
      console.error(
        "Error fetching daily deals:",
        err
      );

      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailyDeals();
  }, []);

  /* =====================================================
     RESET PAGE WHEN FILTER CHANGES
  ===================================================== */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    selectedCategory,
    sortBy,
    maxPrice,
  ]);

  /* =====================================================
     WISHLIST
  ===================================================== */
  const handleWishlist = (id) => {
    setWishlistIds((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );
  };

  /* =====================================================
     CART
  ===================================================== */
  const handleCart = (id) => {
    setCartAddedId(id);

    setTimeout(() => {
      setCartAddedId(null);
    }, 1000);
  };

  /* =====================================================
     FILTER
  ===================================================== */
  let filteredServices = services.filter(
    (service) => {
      const title =
        service.title || "";

      const matchesSearch =
        title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        selectedCategory === "All" ||
        service.category ===
          selectedCategory;

      const matchesPrice =
        service.price <= maxPrice;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice
      );
    }
  );

  /* =====================================================
     SORT
  ===================================================== */
  if (sortBy === "priceLow") {
    filteredServices.sort(
      (a, b) =>
        a.price - b.price
    );
  }

  if (sortBy === "priceHigh") {
    filteredServices.sort(
      (a, b) =>
        b.price - a.price
    );
  }

  if (sortBy === "rating") {
    filteredServices.sort(
      (a, b) =>
        b.rating - a.rating
    );
  }

  /* =====================================================
     PAGINATION
  ===================================================== */
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

  /* =====================================================
     CATEGORIES
  ===================================================== */
  const categories = [
    "All",
    ...new Set(
      services.map(
        (service) =>
          service.category
      )
    ),
  ];

  return (
    <div className="services-container">

      {/* =================================================
          TITLE
      ================================================= */}
      <h2 className="services-title">
        Daily Deals
      </h2>

      <p className="services-subtitle">
        Limited time discounted services
      </p>

      {/* =================================================
          SEARCH
      ================================================= */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search daily deals..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />
      </div>

      {/* =================================================
          CATEGORY FILTER
      ================================================= */}
      <div className="categories">

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() =>
              setSelectedCategory(
                category
              )
            }
            className={
              selectedCategory ===
              category
                ? "active"
                : ""
            }
          >
            {category}
          </button>
        ))}

      </div>

      {/* =================================================
          FILTERS
      ================================================= */}
      <div className="filters">

        {/* SORT */}
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

        {/* PRICE */}
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

      {/* =================================================
          SERVICE GRID
      ================================================= */}
      <div className="services-grid">

        {loading ? (

          /*
            SKELETON
          */
          Array.from({
            length: 6,
          }).map((_, index) => (
            <ServiceSkeleton
              key={index}
            />
          ))

        ) : currentServices.length >
          0 ? (

          /*
            SERVICE CARDS
          */
          currentServices.map(
            (service) => {

              /*
                Same image handling as
                AllCategoryServices
              */
              const image =
                service.images?.[0] ||
                service.image ||
                null;

              /*
                Resolve production image URL
              */
              const imageUrl =
                getImageUrl(image);

              return (
                <ServiceCard
                  key={service.id}

                  {...service}

                  /*
                    IMPORTANT:
                    Pass resolved image to
                    ServiceCard
                  */
                  images={
                    image
                      ? [imageUrl]
                      : []
                  }

                  image={imageUrl}

                  detailsRoute={`/daily-deals/${service.id}`}

                  wishlisted={wishlistIds.includes(
                    service.id
                  )}

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
              );
            }
          )

        ) : (

          /*
            EMPTY STATE
          */
          <p className="no-data">
            No daily deals found
          </p>

        )}

      </div>

      {/* =================================================
          PAGINATION
      ================================================= */}
      {totalPages > 1 &&
        !loading && (

          <div className="pagination">

            {Array.from(
              {
                length:
                  totalPages,
              },
              (_, index) => {

                const page =
                  index + 1;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                    className={
                      currentPage ===
                      page
                        ? "active"
                        : ""
                    }
                  >
                    {page}
                  </button>
                );
              }
            )}

          </div>
        )}

    </div>
  );
}