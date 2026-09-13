import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";
import "./serviceCard.css";

export default function ServiceCard({
  id,
  title,
  images,
  price,
  rating,
  badge,
  detailsRoute,
  onWishlist,
  onCart,
  wishlisted,
  addedToCart,
}) {
  const image =
    images?.[0] ||
    null;

  return (
    <div className="sc-card">

      {/* IMAGE */}
      <div className="sc-img-wrap">
        <img
          loading="lazy"
          src={getImageUrl(image)}
          alt={title || "Service"}
          className="sc-img"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "/placeholder.jpg";
          }}
        />

        <div className="sc-img-overlay" />

        {/* BADGE */}
        {badge && (
          <span className="sc-badge">
            {badge}
          </span>
        )}

        {/* WISHLIST */}
        <button
          type="button"
          onClick={() =>
            onWishlist?.(id)
          }
          className={`sc-wishlist ${
            wishlisted
              ? "sc-wishlist--active"
              : ""
          }`}
          aria-label={
            wishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill={
              wishlisted
                ? "currentColor"
                : "none"
            }
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* CONTENT */}
      <div className="sc-body">

        {/* TITLE + RATING */}
        <div className="sc-top">
          <h3 className="sc-title">
            {title || "Service"}
          </h3>

          <span className="sc-rating">
            <svg
              viewBox="0 0 24 24"
              className="sc-star"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>

            {rating ?? 4.5}
          </span>
        </div>

        {/* PRICE */}
        <p className="sc-price">
          ₹{price}
        </p>

        {/* ACTIONS */}
        <div className="sc-actions">

          {/* DETAILS */}
          <Link
            to={
              detailsRoute ||
              `/services/${id}`
            }
            className="sc-details-btn"
          >
            View Details

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
              />

              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          {/* CART */}
          <button
            type="button"
            onClick={() =>
              !addedToCart &&
              onCart?.(id)
            }
            className={`sc-cart-btn ${
              addedToCart
                ? "sc-cart-btn--added"
                : ""
            }`}
          >
            {addedToCart ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>

                Added!
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="9"
                    cy="21"
                    r="1"
                  />

                  <circle
                    cx="20"
                    cy="21"
                    r="1"
                  />

                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>

                Add to Cart
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}