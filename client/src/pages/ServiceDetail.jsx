import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

import "./serviceDetails.css";
import { useAuth } from "../context/AuthContext";
export default function ServiceDetail() {
  const { id } = useParams();

  const { user, loading: authLoading } = useAuth();

  const [service, setService] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    address: "",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  /* =========================================
     LOAD SERVICE
  ========================================= */

  const loadService = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/services/${id}`);

      const data = res.data;

      setService(data);

      /* =====================================
         HANDLE SERVICE IMAGES
      ===================================== */

      const images =
        Array.isArray(data.images) && data.images.length > 0
          ? data.images
          : data.image
            ? [data.image]
            : [];

      if (images.length > 0) {
        setSelectedImage(
          getImageUrl(images[0])
        );
      } else {
        setSelectedImage("/placeholder.jpg");
      }

    } catch (err) {
      console.error(
        "Error loading service:",
        err
      );

      setError(
        "Failed to load service"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     LOAD REVIEWS
  ========================================= */

  const loadReviews = async () => {
    try {
      const res = await API.get(
        `/comments/service/${id}`
      );

      setReviews(
        res.data || []
      );

    } catch (err) {
      console.error(
        "Error loading reviews:",
        err
      );
    }
  };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    loadService();
    loadReviews();
  }, [id]);

  /* =========================================
     FORM CHANGE
  ========================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     BOOK SERVICE
  ========================================= */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user) {
    setError("Please login before booking");
    return;
  }

  if (!formData.date || !formData.time) {
    setError("Date & time required");
    return;
  }

  if (!formData.address.trim()) {
    setError("Service address is required");
    return;
  }

  if (!user.phone) {
    setError(
      "Please add your phone number in your profile before booking"
    );
    return;
  }

  try {
    setError("");
    setMessage("");

    await API.post(
      "/bookings",
      {
        service_id: id,
        booking_date: formData.date,
        booking_time: formData.time,
        address: formData.address,
        notes: formData.notes || null,
      }
    );

    setMessage("✅ Booking Successful");

    setFormData({
      date: "",
      time: "",
      address: "",
      notes: "",
    });

  } catch (err) {
    console.error("Booking error:", err);

    setError(
      err.response?.data?.msg ||
      "Booking failed"
    );
  }
};
  /* =========================================
     SUBMIT REVIEW
  ========================================= */

  const submitReview = async () => {
    if (!comment.trim()) {
      return alert(
        "Please write review"
      );
    }

    try {
      await API.post(
        "/comments",
        {
          service_id: id,
          comment,
          rating,
        }
      );

      setComment("");
      setRating(5);

      setMessage(
        "Your review has been submitted and is waiting for admin approval."
      );

      loadReviews();

    } catch (err) {
      console.error(
        "Review error:",
        err
      );

      alert(
        err.response?.data?.msg ||
        "Review failed"
      );
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <p className="loading">
        Loading...
      </p>
    );
  }

  /* =========================================
     NOT FOUND
  ========================================= */

  if (!service) {
    return (
      <p className="error">
        Service not found
      </p>
    );
  }

  /* =========================================
     SERVICE IMAGES
  ========================================= */

  const serviceImages =
    Array.isArray(service.images) &&
    service.images.length > 0
      ? service.images
      : service.image
        ? [service.image]
        : [];

  return (
    <div className="service-container">

      {/* =====================================
          BACK
      ===================================== */}

      <Link
        to="/services"
        className="back-btn"
      >
        ← Back
      </Link>

      <div className="service-layout">

        {/* ===================================
            LEFT
        =================================== */}

        <div className="service-left">

          {/* MAIN IMAGE */}

          <img
            src={
              selectedImage ||
              "/placeholder.jpg"
            }
            alt={
              service.title ||
              "Service"
            }
            className="main-img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "/placeholder.jpg";
            }}
          />

          {/* =================================
              THUMBNAILS
          ================================= */}

          {serviceImages.length > 1 && (
            <div className="thumbs">

              {serviceImages.map(
                (img, index) => (
                  <img
                    key={index}
                    src={getImageUrl(img)}
                    alt={
                      `${service.title || "Service"} ${index + 1}`
                    }
                    className={`thumb ${
                      selectedImage ===
                      getImageUrl(img)
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedImage(
                        getImageUrl(img)
                      )
                    }
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "/placeholder.jpg";
                    }}
                  />
                )
              )}

            </div>
          )}

          {/* =================================
              ABOUT SERVICE
          ================================= */}

          <div className="box">

            <h2>
              About Service
            </h2>

            <div
              className="html-content"
              dangerouslySetInnerHTML={{
                __html:
                  service.description ||
                  "<p>No description available</p>",
              }}
            />

          </div>

        </div>

        {/* ===================================
            RIGHT
        =================================== */}

        <div className="service-right">

          {/* SERVICE HEADER */}

          <div className="service-header">

            <h1>
              {service.title}
            </h1>

            <div className="service-meta">

              <span className="rating">
                ⭐{" "}
                {service.rating ||
                  4.5}
              </span>

              <span className="price">
                ₹{service.price}
              </span>

            </div>

          </div>

          {/* =================================
              BOOKING
          ================================= */}

         <form
  onSubmit={handleSubmit}
  className="form"
>

  {error && (
    <div className="error">
      {error}
    </div>
  )}

  {/* PROFILE DETAILS */}

  <div className="booking-profile-info">

    <div>
      <strong>Name</strong>
      <span>{user?.name || "Loading..."}</span>
    </div>

    <div>
      <strong>Phone</strong>
      <span>{user?.phone || "Not added"}</span>
    </div>

    <div>
      <strong>Email</strong>
      <span>{user?.email || "Not available"}</span>
    </div>

  </div>

  {/* DATE */}

  <input
    type="date"
    name="date"
    value={formData.date}
    onChange={handleChange}
    required
  />

  {/* TIME */}

  <input
    type="time"
    name="time"
    value={formData.time}
    onChange={handleChange}
    required
  />

  {/* ADDRESS */}

  <textarea
    name="address"
    placeholder="Enter service address"
    value={formData.address}
    onChange={handleChange}
    required
  />

  {/* NOTES */}

  <textarea
    name="notes"
    placeholder="Additional notes (optional)"
    value={formData.notes}
    onChange={handleChange}
  />

  <button
    type="submit"
    disabled={authLoading}
  >
    {authLoading ? "Loading..." : "Book Now"}
  </button>

</form>
          {/* SUCCESS */}

          {message && (
            <div className="success">
              {message}
            </div>
          )}

          {/* =================================
              REVIEWS
          ================================= */}

          <div className="reviews-list">

            <h3>
              Customer Reviews
            </h3>

            {reviews.length === 0 ? (
              <p>
                No reviews yet
              </p>
            ) : (
              reviews.map(
                (review) => (
                  <div
                    key={review.id}
                    className="review-item"
                  >

                    <h4>
                      {review.user_name ||
                        "Customer"}
                    </h4>

                    <p>
                      {"⭐".repeat(
                        Number(
                          review.rating
                        ) || 0
                      )}
                    </p>

                    <p>
                      {review.comment}
                    </p>

                  </div>
                )
              )
            )}

          </div>

          {/* =================================
              REVIEW FORM
          ================================= */}

          <div className="review-box">

            <h3>
              Leave Review
            </h3>

            <select
              value={rating}
              onChange={(e) =>
                setRating(
                  Number(
                    e.target.value
                  )
                )
              }
            >

              <option value={5}>
                5 Star
              </option>

              <option value={4}>
                4 Star
              </option>

              <option value={3}>
                3 Star
              </option>

              <option value={2}>
                2 Star
              </option>

              <option value={1}>
                1 Star
              </option>

            </select>

            <textarea
              placeholder="Write review..."
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
            />

            <button
              type="button"
              onClick={
                submitReview
              }
            >
              Submit Review
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}