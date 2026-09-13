import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./about.css";

export default function About() {
  return (
    <div className="about-page">

      {/* ================= HERO ================= */}
      <section className="about-hero">
        <div className="about-hero-overlay" />

        <div className="about-container about-hero-content">
          <motion.span
            className="about-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            YOUR HOME, OUR RESPONSIBILITY
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Making Home Services
            <br />
            <span>Simple & Reliable</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            From everyday home maintenance to specialized
            services, we connect you with trusted professionals
            who make your life easier.
          </motion.p>

          <motion.div
            className="about-hero-buttons"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Link
              to="/services"
              className="about-primary-btn"
            >
              Explore Services
            </Link>

            <Link
              to="/contact"
              className="about-secondary-btn"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="about-stats">
        <div className="about-container stats-grid">

          <div className="stat-item">
            <h2>10K+</h2>
            <p>Happy Customers</p>
          </div>

          <div className="stat-item">
            <h2>500+</h2>
            <p>Verified Professionals</p>
          </div>

          <div className="stat-item">
            <h2>50+</h2>
            <p>Services</p>
          </div>

          <div className="stat-item">
            <h2>4.8★</h2>
            <p>Average Rating</p>
          </div>

        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="about-story">
        <div className="about-container story-grid">

          <motion.div
            className="story-content"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">
              ABOUT SERVICEHUB
            </span>

            <h2>
              We believe finding a trusted
              professional shouldn't be difficult.
            </h2>

            <p>
              ServiceHub is a home services platform built
              to make professional services convenient,
              transparent and accessible.
            </p>

            <p>
              Whether you need plumbing, electrical work,
              cleaning, painting, appliance repair or other
              home services, we help you find the right
              professional for the job.
            </p>

            <p>
              Our goal is simple — make booking a home
              service as easy as ordering anything online.
            </p>

            <Link
              to="/services"
              className="story-btn"
            >
              Find a Service
            </Link>
          </motion.div>

          <motion.div
            className="story-visual"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="visual-card">
              <div className="visual-icon">
                ✓
              </div>

              <h3>Trusted Professionals</h3>

              <p>
                Quality service providers selected
                with customer satisfaction in mind.
              </p>
            </div>

            <div className="visual-card visual-card-small">
              <div className="visual-icon">
                ₹
              </div>

              <h3>Transparent Pricing</h3>

              <p>
                Know what you're paying for.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="how-section">
        <div className="about-container">

          <div className="section-heading">
            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>
              Getting things done is easy
            </h2>

            <p>
              Book a professional in just a few simple steps.
            </p>
          </div>

          <div className="steps-grid">

            <div className="step-card">
              <div className="step-number">01</div>

              <div className="step-icon">
                🔎
              </div>

              <h3>Choose a Service</h3>

              <p>
                Browse our range of professional
                home services.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>

              <div className="step-icon">
                📅
              </div>

              <h3>Pick a Time</h3>

              <p>
                Select a convenient date and time
                for your service.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>

              <div className="step-icon">
                👨‍🔧
              </div>

              <h3>Meet Your Professional</h3>

              <p>
                A professional arrives at your
                preferred location.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>

              <div className="step-icon">
                ⭐
              </div>

              <h3>Enjoy the Service</h3>

              <p>
                Get your service completed and
                share your experience.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="why-section">
        <div className="about-container">

          <div className="section-heading">
            <span className="section-label">
              WHY SERVICEHUB
            </span>

            <h2>
              Built around your convenience
            </h2>
          </div>

          <div className="benefits-grid">

            <div className="benefit-card">
              <span>✓</span>
              <h3>Verified Professionals</h3>
              <p>
                We focus on connecting customers
                with reliable service professionals.
              </p>
            </div>

            <div className="benefit-card">
              <span>₹</span>
              <h3>Clear Pricing</h3>
              <p>
                Transparent service pricing helps
                you make informed decisions.
              </p>
            </div>

            <div className="benefit-card">
              <span>⚡</span>
              <h3>Easy Booking</h3>
              <p>
                Find and book the service you need
                without unnecessary hassle.
              </p>
            </div>

            <div className="benefit-card">
              <span>🛡</span>
              <h3>Customer First</h3>
              <p>
                Your convenience and service
                experience remain our priority.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="about-cta">
        <div className="about-container">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>
              READY TO GET STARTED?
            </span>

            <h2>
              Your next home service is
              just a few clicks away.
            </h2>

            <p>
              Find a trusted professional and book
              your service today.
            </p>

            <Link
              to="/services"
              className="cta-btn"
            >
              Explore Services
            </Link>
          </motion.div>

        </div>
      </section>

    </div>
  );
}