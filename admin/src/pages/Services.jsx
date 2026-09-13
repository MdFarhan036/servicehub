import { useEffect, useState } from "react";
import API from "../services/api";
import DataTable from "./DataTable";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getImageUrl } from "../utils/imageUrl.js";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* =========================================
     LOAD SERVICES
  ========================================= */

  const load = async () => {
    try {
      setLoading(true);

      const res = await API.get("/services");

      setServices(res.data || []);
    } catch (err) {
      console.error("Load services error:", err);
      alert("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =========================================
     DELETE SERVICE
  ========================================= */

  const del = async (id) => {
    if (!window.confirm("Delete this service?")) {
      return;
    }

    try {
      await API.delete(`/services/${id}`);

      setServices((prev) =>
        prev.filter((s) => s.id !== id)
      );
    } catch (err) {
      console.error("Delete service error:", err);
      alert("Delete failed");
    }
  };

  /* =========================================
     TOGGLE POPULAR
  ========================================= */

  const togglePopular = async (service) => {
    try {
      const newValue =
        Number(service.is_popular) === 1 ? 0 : 1;

      await API.patch(
        `/services/${service.id}/popular`,
        {
          is_popular: newValue,
        }
      );

      load();
    } catch (err) {
      console.error("Popular update error:", err);
      alert("Failed to update popular service");
    }
  };

  /* =========================================
     TOGGLE DAILY DEAL
  ========================================= */

  const toggleDailyDeal = async (service) => {
    const dealPrice = window.prompt(
      "Enter daily deal price",
      service.daily_deal_price || service.price
    );

    if (!dealPrice) {
      return;
    }

    try {
      const newValue =
        Number(service.is_daily_deal) === 1 ? 0 : 1;

      await API.patch(
        `/services/${service.id}/dailydeal`,
        {
          is_daily_deal: newValue,
          daily_deal_price: dealPrice,
        }
      );

      load();
    } catch (err) {
      console.error("Daily deal update error:", err);
      alert("Failed to update daily deal");
    }
  };

  /* =========================================
     TABLE COLUMNS
  ========================================= */

  const columns = [
    {
      key: "image",
      label: "Image",
    },
    {
      key: "title",
      label: "Title",
    },
    {
      key: "slug",
      label: "Slug",
    },
    {
      key: "price",
      label: "Price",
    },
    {
      key: "category_name",
      label: "Category",
    },
    {
      key: "is_popular",
      label: "Popular",
    },
    {
      key: "is_daily_deal",
      label: "Daily Deal",
    },
    {
      key: "daily_deal_price",
      label: "Deal Price",
    },
    {
      key: "approved_comments",
      label: "Approved",
    },
    {
      key: "total_comments",
      label: "Total Comments",
    },
    {
      key: "avg_rating",
      label: "Rating",
    },
    {
      key: "actions",
      label: "Actions",
    },
  ];

  /* =========================================
     TABLE DATA
  ========================================= */

  const tableData = services.map((s) => {
    const firstImage =
      Array.isArray(s.images) && s.images.length > 0
        ? s.images[0]
        : s.image || null;

    return {
      ...s,

      /* IMAGE */

      image: firstImage ? (
        <img
          src={getImageUrl(firstImage)}
          alt={s.title || "Service"}
          loading="lazy"
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />
      ) : (
        <img
          src="/placeholder.jpg"
          alt="No Image"
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ),

      /* CATEGORY */

      category_name: s.category_name || "-",

      /* COMMENTS */

      approved_comments: s.approved_comments || 0,

      total_comments: s.total_comments || 0,

      /* RATING */

      avg_rating:
        s.avg_rating !== null &&
        s.avg_rating !== undefined &&
        s.avg_rating !== ""
          ? `${Number(s.avg_rating).toFixed(1)} ⭐`
          : "—",

      /* POPULAR */

      is_popular: (
        <button
          type="button"
          onClick={() => togglePopular(s)}
          className={
            Number(s.is_popular) === 1
              ? "btn-primary"
              : "btn-secondary"
          }
        >
          {Number(s.is_popular) === 1 ? "Yes" : "No"}
        </button>
      ),

      /* DAILY DEAL */

      is_daily_deal: (
        <button
          type="button"
          onClick={() => toggleDailyDeal(s)}
          className={
            Number(s.is_daily_deal) === 1
              ? "btn-primary"
              : "btn-secondary"
          }
        >
          {Number(s.is_daily_deal) === 1
            ? "Active"
            : "Inactive"}
        </button>
      ),

      /* DEAL PRICE */

      daily_deal_price:
        Number(s.is_daily_deal) === 1
          ? `₹${s.daily_deal_price}`
          : "-",

      /* ACTIONS */

      actions: (
        <div className="actions">
          <button
            type="button"
            onClick={() =>
              navigate(`/services/edit/${s.id}`)
            }
            className="btn-primary"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => del(s.id)}
            className="btn-secondary"
          >
            Delete
          </button>
        </div>
      ),
    };
  });

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="page">
      <Helmet>
        <title>Services Management</title>

        <meta
          name="description"
          content="Manage services"
        />
      </Helmet>

      <div className="page-header">
        <h1>Services</h1>

        <button
          type="button"
          onClick={() =>
            navigate("/services/add")
          }
          className="btn-primary"
        >
          + Add Service
        </button>
      </div>

      <div className="card-form">
        {loading ? (
          <div className="loader">
            Loading...
          </div>
        ) : services.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 20,
            }}
          >
            No services found
          </div>
        ) : (
          <DataTable
            data={tableData}
            columns={columns}
          />
        )}
      </div>
    </div>
  );
}