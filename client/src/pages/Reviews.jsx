import React, {
  useEffect,
  useState
} from "react";

import {
  FaStar,
  FaUserCircle,
  FaQuoteLeft
} from "react-icons/fa";

import API from "../services/api";

export default function Reviews() {
  const [reviews, setReviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res =
        await API.get(
          "/comments/approved"
        );

      setReviews(
        res.data || []
      );
    } catch (err) {
      console.log(
        "Review fetch error",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (
    rating
  ) => {
    return [...Array(rating)].map(
      (_, i) => (
        <FaStar key={i} />
      )
    );
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (
              acc,
              item
            ) =>
              acc +
              Number(
                item.rating
              ),
            0
          ) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="reviews-page">

      {/* HERO */}
      <section className="reviews-hero">
        <div className="reviews-overlay">
          <h1>
            Customer Reviews
          </h1>

          <p>
            Trusted by real
            customers across
            India
          </p>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="review-summary container">
        <div className="summary-box">
          <h2>
            {
              averageRating
            }
          </h2>

          <div className="stars">
            {[...Array(5)].map(
              (
                _,
                i
              ) => (
                <FaStar
                  key={i}
                />
              )
            )}
          </div>

          <p>
            Based on{" "}
            {
              reviews.length
            }{" "}
            reviews
          </p>
        </div>

        <div className="summary-stats">
          <div>
            <h3>
              {
                reviews.length
              }+
            </h3>

            <p>
              Verified
              Reviews
            </p>
          </div>

          <div>
            <h3>
              100%
            </h3>

            <p>
              Real Customers
            </p>
          </div>

          <div>
            <h3>
              Trusted
            </h3>

            <p>
              Platform
            </p>
          </div>
        </div>
      </section>

      {/* REVIEWS LIST */}
      <section className="reviews-list container">
        {loading ? (
          <p>
            Loading
            reviews...
          </p>
        ) : reviews.length >
          0 ? (
          reviews.map(
            (
              item
            ) => (
              <div
                className="review-card"
                key={
                  item.id
                }
              >
                <div className="review-top">
                  <FaUserCircle className="user-icon" />

                  <div>
                    <h3>
                      {
                        item.user_name
                      }
                    </h3>

                    <span>
                      {
                        item.service_title
                      }
                    </span>
                  </div>

                  <div className="rating-box">
                    {renderStars(
                      item.rating
                    )}
                  </div>
                </div>

                <div className="quote-icon">
                  <FaQuoteLeft />
                </div>

                <p>
                  {
                    item.comment
                  }
                </p>

                <small>
                  {new Date(
                    item.created_at
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day:
                        "numeric",
                      month:
                        "long",
                      year:
                        "numeric"
                    }
                  )}
                </small>
              </div>
            )
          )
        ) : (
          <p>
            No approved
            reviews found
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="reviews-cta">
        <h2>
          Join Happy
          Customers
        </h2>

        <p>
          Book trusted
          professionals for
          your home services
          today.
        </p>

        <button>
          Book a Service
        </button>
      </section>
    </div>
  );
}