import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "../context/LocationContext";
import { useAuth } from "../context/AuthContext";
import "./navbar.css";

export default function Navbar() {
  // ── BACKEND LOGIC UNTOUCHED ──────────────────────────────────────
  const { city, setCity } = useLocation();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const profileRef = useRef();
  const cities = ["Jaipur", "Delhi", "Mumbai", "Bangalore"];

  useEffect(() => {
    const updateWishlist = () => {
      if (!user) return setWishlistCount(0);
      const key = `wishlist_${user.email}`;
      const stored = JSON.parse(localStorage.getItem(key)) || [];
      setWishlistCount(stored.length);
    };
    updateWishlist();
    window.addEventListener("wishlistUpdated", updateWishlist);
    return () => window.removeEventListener("wishlistUpdated", updateWishlist);
  }, [user]);

  useEffect(() => {
    const updateCart = () => {
      if (!user) return setCartCount(0);
      const key = `cart_${user.email}`;
      const stored = JSON.parse(localStorage.getItem(key)) || [];
      const totalItems = stored.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
  };
  // ─────────────────────────────────────────────────────────────────

  return (
    <nav className="nb-nav">
      <div className="nb-container">

        {/* logo */}
        <Link to="/" className="nb-logo">
          <span className="nb-logo-icon">S</span>
          ServiceHub
        </Link>

        {/* desktop links */}
        <div className="nb-links">

          {/* city selector */}
          <div className="nb-city-wrap">
            <svg className="nb-city-icon" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="nb-city-select"
            >
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <Link to="/about" className="nb-link">About</Link>
          <Link to="/services" className="nb-link">Services</Link>

          {/* cart */}
          {user && (
            <Link to="/cart" className="nb-cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
            </Link>
          )}

          {/* profile dropdown */}
          {user && (
            <div className="nb-profile-wrap" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`nb-profile-btn ${profileOpen ? "nb-profile-btn--open" : ""}`}
              >
                {(user.name || "U").charAt(0).toUpperCase()}
              </button>

              {profileOpen && (
                <div className="nb-dropdown">

                  {/* header */}
                  <div className="nb-drop-header">
                    <div className="nb-drop-avatar">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="nb-drop-info">
                      <p className="nb-drop-sub">Signed in as</p>
                      <h4 className="nb-drop-name">{user.name}</h4>
                    </div>
                  </div>

                  {/* menu items */}
                  <div className="nb-drop-menu">
                    <Link to="/profile" className="nb-drop-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Profile Details
                    </Link>
                    <Link to="/wishlist" className="nb-drop-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      Wishlist
                      {wishlistCount > 0 && <span className="nb-drop-count">{wishlistCount}</span>}
                    </Link>
                    <Link to="/bookings" className="nb-drop-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" rx="2"/>
                        <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1l-3 3v-3H9a2 2 0 0 1-2-2v-1"/>
                      </svg>
                      My Bookings
                    </Link>
                  </div>

                  {/* divider + logout */}
                  <div className="nb-drop-divider" />
                  <button onClick={handleLogout} className="nb-logout-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>

                </div>
              )}
            </div>
          )}

          {/* auth links */}
          {!user && (
            <div className="nb-auth">
              <Link to="/login" className="nb-link">Login</Link>
              <Link to="/register" className="nb-register">Register</Link>
            </div>
          )}

        </div>

        {/* hamburger */}
        <button
          className={`nb-hamburger ${menuOpen ? "nb-hamburger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="nb-mobile">
          <div className="nb-mobile-city">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="nb-city-select"
            >
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <Link to="/about" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/services" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>Services</Link>

          {user && (
            <>
              <Link to="/cart" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              <Link to="/wishlist" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <Link to="/bookings" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>My Bookings</Link>
              <button onClick={handleLogout} className="nb-mobile-logout">Logout</button>
            </>
          )}

          {!user && (
            <div className="nb-mobile-auth">
              <Link to="/login" className="nb-mobile-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nb-mobile-register" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}