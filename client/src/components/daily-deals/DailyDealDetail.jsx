import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../services/api";
import { getImageUrl } from "../../utils/imageUrl";
import "../../pages/serviceDetails.css";

export default function DailyDealDetail() {
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

  /* =====================================================
     REVIEWS
  ===================================================== */

  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [canReview, setCanReview] = useState(false);

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    loadService();
    loadReviews();
    checkReviewEligibility();
  }, [id]);

  /* =====================================================
     LOAD SERVICE
  ===================================================== */

  const loadService = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/services/${id}`
      );

      const data = res.data;

      setService(data);

      /*
        Use the same image resolver used
        throughout the application.
      */

      const image =
        data.images?.[0] ||
        data.image ||
        null;

      setSelectedImage(
        getImageUrl(image)
      );

    } catch (err) {
      console.error(
        "Error loading daily deal:",
        err
      );

      setError(
        "Failed to load deal"
      );

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD REVIEWS
  ===================================================== */

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

  /* =====================================================
     CHECK REVIEW ELIGIBILITY
  ===================================================== */

  const checkReviewEligibility =
    async () => {
      try {
        const res = await API.get(
          "/bookings/my-bookings"
        );

        const bookings =
          res.data || [];

        const completedBooking =
          bookings.find(
            (booking) =>
              String(
                booking.service_id
              ) === String(id) &&
              booking.status ===
                "completed"
          );

        setCanReview(
          !!completedBooking
        );

      } catch (err) {
        console.error(
          "Review eligibility error:",
          err
        );

        setCanReview(false);
      }
    };

  /* =====================================================
     BOOKING INPUT
  ===================================================== */

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

  /* =====================================================
     BOOK SERVICE
  ===================================================== */

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
      console.error(
        "Booking error:",
        err
      );

      setError(
        err.response?.data?.msg ||
          "Booking failed"
      );
    }
  };

  /* =====================================================
     SUBMIT REVIEW
  ===================================================== */

  const submitReview = async () => {
    if (!comment.trim()) {
      alert(
        "Please write review"
      );

      return;
    }

    try {
      setError("");
      setMessage("");

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

      await loadReviews();

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

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="service-container">
        <p>Loading...</p>
      </div>
    );
  }

  /* =====================================================
     NOT FOUND
  ===================================================== */

  if (!service) {
    return (
      <div className="service-container">
        <p>
          {error || "Deal not found"}
        </p>
      </div>
    );
  }

  /* =====================================================
     IMAGE
  ===================================================== */

  const serviceImage =
    service.images?.[0] ||
    service.image ||
    null;

  const imageUrl =
    selectedImage ||
    getImageUrl(serviceImage);

  /* =====================================================
     PRICES
  ===================================================== */

  const originalPrice = Number(
    service.price || 0
  );

  const dealPrice = Number(
    service.daily_deal_price ||
      service.price ||
      0
  );

  return (
    <div className="service-container">

      {/* =================================================
          BACK
      ================================================= */}

      <Link
        to="/daily-deals-listing"
        className="back-btn"
      >
        ← Back
      </Link>

      <div className="service-layout">

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="service-left">

          {/* MAIN IMAGE */}

          <img
            src={imageUrl}
            alt={
              service.title ||
              "Daily Deal"
            }
            className="main-img"
            onError={(e) => {
              e.currentTarget.onerror =
                null;

              e.currentTarget.src =
                "/placeholder.jpg";
            }}
          />

          {/* DETAILS */}

          <div className="box">

            <h2>
              Deal Details
            </h2>

            <div
              className="html-content"
              dangerouslySetInnerHTML={{
                __html:
                  service.description ||
                  "<p>No details available</p>",
              }}
            />

          </div>

        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="service-right">

          {/* TITLE */}

          <h1>
            {service.title}
          </h1>

          {/* DEAL BADGE */}

          <div className="deal-badge">
            🔥 Daily Deal
          </div>

          {/* PRICE */}

          <div className="service-meta">

            {originalPrice >
              dealPrice && (
              <span
                style={{
                  textDecoration:
                    "line-through",
                }}
              >
                ₹{originalPrice}
              </span>
            )}

            <span className="price">
              ₹{dealPrice}
            </span>

          </div>

          {/* =================================================
              BOOKING
          ================================================= */}

          <form
            onSubmit={
              handleSubmit
            }
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
              value={
                formData.date
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="time"
              name="time"
              value={
                formData.time
              }
              onChange={
                handleChange
              }
              required
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

          {/* =================================================
              REVIEWS
          ================================================= */}

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
                      {
                        review.user_name
                      }
                    </h4>

                    <p className="review-rating">
                      ⭐{" "}
                      {
                        review.rating
                      }
                      /5
                    </p>

                    <p>
                      {
                        review.comment
                      }
                    </p>

                  </div>
                )
              )
            )}

          </div>

          {/* =================================================
              REVIEW FORM
          ================================================= */}

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
          )}

        </div>

      </div>

    </div>
  );
}