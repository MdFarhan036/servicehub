import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";
import "../../pages/serviceDetails.css";

export default function PopularServiceDetail() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================================
     REVIEW STATES
  ========================================= */

  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [canReview, setCanReview] = useState(false);

  /* =========================================
     LOAD SERVICE
  ========================================= */

  const loadService = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/services/${id}`);

      const data = res.data;

      setService(data);

      /* USE CENTRAL IMAGE URL HELPER */
      const firstImage =
        data.images?.[0] ||
        data.image ||
        null;

      setSelectedImage(
        getImageUrl(firstImage)
      );

    } catch (err) {
      console.error(
        "Failed to load service:",
        err
      );

      setError("Failed to load service");
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

      setReviews(res.data || []);

    } catch (err) {
      console.log(
        "Reviews loading error:",
        err
      );

      setReviews([]);
    }
  };

  /* =========================================
     CHECK REVIEW ELIGIBILITY
  ========================================= */

  const checkReviewEligibility = async () => {
    try {
      const res = await API.get(
        "/bookings/my-bookings"
      );

      const bookings = res.data || [];

      const completedBooking =
        bookings.find(
          (booking) =>
            String(booking.service_id) ===
              String(id) &&
            booking.status === "completed"
        );

      setCanReview(
        !!completedBooking
      );

    } catch (err) {
      console.log(
        "Review eligibility error:",
        err
      );

      setCanReview(false);
    }
  };

  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    loadService();
    loadReviews();
    checkReviewEligibility();
  }, [id]);

  /* =========================================
     BOOKING INPUT
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

    if (
      !formData.date ||
      !formData.time
    ) {
      setError(
        "Date & time required"
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
          date: formData.date,
          time: formData.time,
        }
      );

      setMessage(
        "✅ Booking Successful"
      );

      setFormData({
        date: "",
        time: "",
      });

    } catch (err) {
      console.error(err);

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
      alert(
        "Please write review"
      );

      return;
    }

    try {
      await API.post(
        "/comments",
        {
          service_id: id,
          comment: comment.trim(),
          rating: Number(rating),
        }
      );

      setComment("");
      setRating(5);

      setMessage(
        "Your review has been submitted and is waiting for admin approval."
      );

      loadReviews();

    } catch (err) {
      console.log(err);

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
     SERVICE NOT FOUND
  ========================================= */

  if (!service) {
    return (
      <p className="error">
        Service not found
      </p>
    );
  }

  /* =========================================
     IMAGE
  ========================================= */

  const currentImage =
    selectedImage ||
    getImageUrl(
      service.images?.[0] ||
        service.image
    );

  return (
    <div className="service-container">

      {/* BACK */}

      <Link
        to="/popular-services-listing"
        className="back-btn"
      >
        ← Back
      </Link>

      <div className="service-layout">

        {/* =====================================
            LEFT SIDE
        ===================================== */}

        <div className="service-left">

          {/* MAIN IMAGE */}

          <img
            src={currentImage}
            alt={
              service.title ||
              "Popular Service"
            }
            className="main-img"
            onError={(e) => {
              e.currentTarget.onerror =
                null;

              e.currentTarget.src =
                "/placeholder.jpg";
            }}
          />

          {/* SERVICE DESCRIPTION */}

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

        {/* =====================================
            RIGHT SIDE
        ===================================== */}

        <div className="service-right">

          {/* HEADER */}

          <div className="service-header">

            <h1>
              {service.title}
            </h1>

            <div className="service-meta">

              <span className="rating">
                ⭐{" "}
                {service.rating || 4.5}
              </span>

              <span className="price">
                ₹{service.price}
              </span>

            </div>

          </div>

          {/* ===================================
              BOOKING FORM
          =================================== */}

          <form
            onSubmit={handleSubmit}
            className="form"
          >

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />

            <button type="submit">
              Book Now
            </button>

          </form>

          {/* SUCCESS MESSAGE */}

          {message && (
            <div className="success">
              {message}
            </div>
          )}

          {/* ===================================
              REVIEWS
          =================================== */}

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
                      {review.user_name}
                    </h4>

                    <p className="review-rating">
                      ⭐{" "}
                      {review.rating}
                      /5
                    </p>

                    <p>
                      {review.comment}
                    </p>

                  </div>
                )
              )
            )}

          </div>

          {/* ===================================
              REVIEW FORM
          =================================== */}

          {canReview && (
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

                <option value="5">
                  5 Star
                </option>

                <option value="4">
                  4 Star
                </option>

                <option value="3">
                  3 Star
                </option>

                <option value="2">
                  2 Star
                </option>

                <option value="1">
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
                onClick={submitReview}
              >
                Submit Review
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}