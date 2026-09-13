import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";
import { useAuth } from "../context/AuthContext";
import "./wishlist.css";

export default function Wishlist() {
  const { user } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================
     LOAD WISHLIST
  ========================================= */

  const loadWishlist = async () => {
    try {
      setLoading(true);

      if (!user) {
        setWishlistItems([]);
        return;
      }

      /*
       * Backend should return wishlist services.
       * Change endpoint if your backend uses another route.
       */
      const res = await API.get("/wishlist");

      const formatted = (res.data || []).map((item) => {
        const service = item.service || item;

        const images =
          service.images && Array.isArray(service.images)
            ? service.images.map((img) =>
                getImageUrl(img)
              )
            : service.image
            ? [getImageUrl(service.image)]
            : ["/placeholder.jpg"];

        return {
          id:
            service.id ||
            item.service_id,

          title:
            service.title ||
            "Service",

          category:
            service.category_name ||
            service.category ||
            "Other",

          city:
            service.city ||
            "",

          images,

          price:
            service.price || 0,

          rating:
            service.rating || 4.5,

          badge:
            Number(service.is_popular) === 1
              ? "Popular"
              : Number(service.is_daily_deal) === 1
              ? "Deal"
              : "",

          wishlisted: true,
        };
      });

      setWishlistItems(formatted);

    } catch (err) {
      console.error(
        "Error loading wishlist:",
        err
      );

      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [user]);

  /* =========================================
     REMOVE FROM WISHLIST
  ========================================= */

  const handleWishlist = async (serviceId) => {
    try {
      await API.delete(
        `/wishlist/${serviceId}`
      );

      setWishlistItems((prev) =>
        prev.filter(
          (item) =>
            item.id !== serviceId
        )
      );

    } catch (err) {
      console.error(
        "Wishlist remove error:",
        err
      );
    }
  };

  /* =========================================
     ADD TO CART
  ========================================= */

  const handleCart = async (serviceId) => {
    try {
      await API.post(
        "/cart",
        {
          service_id: serviceId,
          quantity: 1,
        }
      );

      alert("Service added to cart");

    } catch (err) {
      console.error(
        "Add to cart error:",
        err
      );

      alert(
        err.response?.data?.msg ||
        "Failed to add service to cart"
      );
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="wishlist-container">
        <p className="wishlist-empty">
          Loading wishlist...
        </p>
      </div>
    );
  }

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="wishlist-container">

      <h2 className="wishlist-title">
        ❤️ Your Wishlist
      </h2>

      {!user ? (
        <p className="wishlist-empty">
          Please login to view your wishlist.
        </p>
      ) : wishlistItems.length > 0 ? (

        <div className="wishlist-grid">

          {wishlistItems.map(
            (service) => (

              <ServiceCard
                key={service.id}
                {...service}
                detailsRoute={`/services/${service.id}`}
                wishlisted={true}
                onWishlist={handleWishlist}
                onCart={handleCart}
              />

            )
          )}

        </div>

      ) : (

        <p className="wishlist-empty">
          Your wishlist is empty.
        </p>

      )}

    </div>
  );
}