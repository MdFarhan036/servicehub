import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="ft-footer">

      {/* TOP WAVE */}
      <div className="ft-wave" aria-hidden="true">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C480,60 960,60 1440,0 L1440,0 L0,0 Z"
            fill="#f5f7ff"
          />
        </svg>
      </div>

      <div className="ft-container">

        {/* GRID */}
        <div className="ft-grid">

          {/* BRAND */}
          <div className="ft-brand">

            <Link to="/" className="ft-logo">
              <span className="ft-logo-icon">
                S
              </span>
              ServiceHub
            </Link>

            <p className="ft-tagline">
              Trusted home services at your doorstep.
              Verified professionals, transparent
              pricing, and seamless booking experience.
            </p>

            {/* SOCIAL ICONS */}
            <div className="ft-socials">

              <a
                href="#"
                className="ft-social"
                aria-label="Twitter"
              >
                <img
                  src="/images/twitter.png"
                  alt="Twitter"
                />
              </a>

              <a
                href="#"
                className="ft-social"
                aria-label="Facebook"
              >
                <img
                  src="/images/facebook.png"
                  alt="Facebook"
                />
              </a>

              <a
                href="#"
                className="ft-social"
                aria-label="Instagram"
              >
                <img
                  src="/images/instagram.png"
                  alt="Instagram"
                />
              </a>

              <a
                href="#"
                className="ft-social"
                aria-label="LinkedIn"
              >
                <img
                  src="/images/linkedin.png"
                  alt="LinkedIn"
                />
              </a>

            </div>
          </div>

          {/* COMPANY */}
          <div className="ft-col">
            <h3 className="ft-heading">
              Company
            </h3>

            <ul className="ft-list">
              <li>
                <Link to="/about">
                  About Us
                </Link>
              </li>

              <li>
                <Link to="/investors">
                  Investor Relations
                </Link>
              </li>

              <li>
                <Link to="/terms">
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link to="/privacy">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link to="/careers">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMERS */}
          <div className="ft-col">
            <h3 className="ft-heading">
              For Customers
            </h3>

            <ul className="ft-list">
              <li>
                <Link to="/reviews">
                  Service Reviews
                </Link>
              </li>

              <li>
                <Link to="/my-bookings">
                  My Bookings
                </Link>
              </li>

              <li>
                <Link to="/all-categories">
                  Categories Near You
                </Link>
              </li>

              <li>
                <Link to="/services">
                  All Services
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link to="/blogs">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* APP */}
          <div className="ft-col">
            <h3 className="ft-heading">
              Get the App
            </h3>

            <p className="ft-app-desc">
              Book services on the go — available
              on iOS & Android.
            </p>

            <div className="ft-app-buttons">

              <a
                href="#"
                className="ft-app-btn"
                aria-label="Download on App Store"
              >
                <img
                  src="/images/appstore.webp"
                  alt="App Store"
                />
              </a>

              <a
                href="#"
                className="ft-app-btn"
                aria-label="Get it on Google Play"
              >
                <img
                  src="/images/playstore.webp"
                  alt="Play Store"
                />
              </a>

            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="ft-divider" />

        {/* BOTTOM */}
        <div className="ft-bottom">

          <p className="ft-copy">
            © {new Date().getFullYear()} ServiceHub.
            All rights reserved.
          </p>

          <div className="ft-bottom-links">
            <Link to="/privacy">
              Privacy
            </Link>

            <Link to="/terms">
              Terms
            </Link>

            <Link to="/contact">
              Contact
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}