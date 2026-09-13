import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../services/api";
import "./HeroSection.css";

export default function HeroSection() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Hero categories error:", err);
    }
  };

  return (
    <section className="hs-section">

      {/* Ambient blobs */}
      <div className="hs-blob hs-blob--a" />
      <div className="hs-blob hs-blob--b" />
      <div className="hs-blob hs-blob--c" />

      {/* Grid lines */}
      <div className="hs-grid-lines" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hs-content"
      >

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.15,
            duration: 0.55,
          }}
          className="hs-eyebrow"
        >
          <span className="hs-eyebrow-dot" />

          Trusted Home Services
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="hs-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.25,
            duration: 0.6,
          }}
        >
          Book Trusted
          <br />

          <span className="hs-gradient-text">
            Home Services
          </span>

          <br />

          Instantly
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="hs-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.38,
            duration: 0.55,
          }}
        >
          Verified professionals. Transparent pricing.
          Instant booking.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="hs-buttons"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.5,
            duration: 0.5,
          }}
        >
          <Link
            to="/services"
            className="hs-btn-primary"
          >
            Explore Services

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

          <Link
            to="/about"
            className="hs-btn-outline"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="hs-trust"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.68,
            duration: 0.5,
          }}
        >
          {[
            {
              icon: "✦",
              label: "Verified Pros",
            },
            {
              icon: "✦",
              label: "Instant Booking",
            },
            {
              icon: "✦",
              label: "Secure Payments",
            },
          ].map((badge) => (
            <span
              key={badge.label}
              className="hs-trust-badge"
            >
              <span className="hs-trust-icon">
                {badge.icon}
              </span>

              {badge.label}
            </span>
          ))}
        </motion.div>

      </motion.div>

      {/* Dynamic Category Chips */}
      <motion.div
        className="hs-chips"
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.75,
          duration: 0.6,
        }}
      >
        {categories.slice(0, 5).map(
          (category, index) => (
            <Link
              key={category.id}
              to={`/services/category/${category.id}`}
              className="hs-chip"
              style={{
                animationDelay: `${
                  index * 0.12 + 1
                }s`,
              }}
            >
              {category.name}
            </Link>
          )
        )}
      </motion.div>

    </section>
  );
}