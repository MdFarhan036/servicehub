import { useState, useEffect } from "react";

import ServiceCard from "../components/ServiceCard";
import ServiceSkeleton from "../components/ServiceSkeleton";

import { useLocation } from "../context/LocationContext";

import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

import "./services.css";

export default function Services() {
  const { city } = useLocation();

  const [services, setServices] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory
  ] = useState("All");

  const [sortBy, setSortBy] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================================
     FETCH SERVICES
  ========================================= */

  const loadServices = async () => {
    try {
      setLoading(true);

      const res =
        await API.get("/services");

      const formatted =
        (res.data || []).map((s) => {

          /* ================================
             HANDLE IMAGES
          ================================= */

          const images =
            Array.isArray(s.images) &&
            s.images.length > 0
              ? s.images.map((img) =>
                  getImageUrl(img)
                )
              : s.image
                ? [getImageUrl(s.image)]
                : ["/placeholder.jpg"];

          return {
            id: s.id,

            title:
              s.title ||
              "Service",

            category:
              s.category_name ||
              s.category ||
              "Other",

            city:
              s.city ||
              city,

            images,

            price:
              Number(s.price) || 0,

            rating:
              Number(s.rating) ||
              4.5,

            badge:
              Number(s.is_popular) === 1
                ? "Popular"
                : Number(s.is_daily_deal) === 1
                  ? "Deal"
                  : "",
          };
        });

      setServices(
        formatted
      );

    } catch (err) {
      console.error(
        "Error loading services:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     LOAD
  ========================================= */

  useEffect(() => {
    loadServices();
  }, []);

  /* =========================================
     FILTER
  ========================================= */

  let filteredServices =
    services.filter(
      (service) => {

        const matchesSearch =
          service.title
            .toLowerCase()
            .includes(
              search
                .toLowerCase()
            );

        const matchesCategory =
          selectedCategory ===
            "All" ||
          service.category ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

  /* =========================================
     SORT
  ========================================= */

  if (
    sortBy ===
    "priceLow"
  ) {
    filteredServices.sort(
      (a, b) =>
        a.price -
        b.price
    );
  }

  if (
    sortBy ===
    "priceHigh"
  ) {
    filteredServices.sort(
      (a, b) =>
        b.price -
        a.price
    );
  }

  if (
    sortBy ===
    "rating"
  ) {
    filteredServices.sort(
      (a, b) =>
        b.rating -
        a.rating
    );
  }

  /* =========================================
     CATEGORIES
  ========================================= */

  const categories = [
    "All",
    ...new Set(
      services.map(
        (s) =>
          s.category
      )
    ),
  ];

  return (
    <div className="services-page">

      {/* =====================================
          HERO
      ===================================== */}

      <div className="services-hero">

        <h1>
          All Services
          {city
            ? ` in ${city}`
            : ""}
        </h1>

        <p>
          Book trusted home
          services near you
        </p>

      </div>

      {/* =====================================
          SEARCH + SORT
      ===================================== */}

      <div className="services-toolbar">

        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="service-search"
        />

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value
            )
          }
        >

          <option value="">
            Sort By
          </option>

          <option value="priceLow">
            Price Low → High
          </option>

          <option value="priceHigh">
            Price High → Low
          </option>

          <option value="rating">
            Top Rated
          </option>

        </select>

      </div>

      {/* =====================================
          CATEGORY TABS
      ===================================== */}

      <div className="category-tabs">

        {categories.map(
          (cat) => (

            <button
              key={cat}
              className={
                selectedCategory ===
                  cat
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedCategory(
                  cat
                )
              }
            >
              {cat}
            </button>

          )
        )}

      </div>

      {/* =====================================
          RESULT COUNT
      ===================================== */}

      {!loading && (
        <div className="result-count">
          {filteredServices.length}{" "}
          {filteredServices.length === 1
            ? "Service"
            : "Services"}{" "}
          Found
        </div>
      )}

      {/* =====================================
          SERVICES GRID
      ===================================== */}

      <div className="services-grid">

        {loading ? (

          Array.from({
            length: 8,
          }).map(
            (_, i) => (
              <ServiceSkeleton
                key={i}
              />
            )
          )

        ) : filteredServices.length >
          0 ? (

          filteredServices.map(
            (service) => (

              <ServiceCard
                key={
                  service.id
                }

                {...service}

                detailsRoute={`/services/${service.id}`}
              />

            )
          )

        ) : (

          <p className="no-data">
            No services found
          </p>

        )}

      </div>

    </div>
  );
}