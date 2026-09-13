import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { getImageUrl } from "../utils/imageUrl";

import "./cart.css";

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================
     LOAD CART
  ========================================= */

  const loadCart = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await API.get("/cart");

      setCartItems(res.data || []);

    } catch (err) {
      console.error(
        "Error loading cart:",
        err
      );

      setCartItems([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  /* =========================================
     REMOVE FROM CART
  ========================================= */

  const removeFromCart = async (id) => {
    try {
      await API.delete(`/cart/${id}`);

      setCartItems((prev) =>
        prev.filter(
          (item) =>
            item.id !== id &&
            item.service_id !== id
        )
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

    } catch (err) {
      console.error(
        "Remove cart item error:",
        err
      );
    }
  };

  /* =========================================
     UPDATE QUANTITY
  ========================================= */

  const updateQuantity = async (
    id,
    type
  ) => {
    const currentItem =
      cartItems.find(
        (item) =>
          item.id === id ||
          item.service_id === id
      );

    if (!currentItem) return;

    const currentQuantity =
      Number(
        currentItem.quantity || 1
      );

    let newQuantity =
      currentQuantity;

    if (type === "inc") {
      newQuantity =
        currentQuantity + 1;
    }

    if (
      type === "dec" &&
      currentQuantity > 1
    ) {
      newQuantity =
        currentQuantity - 1;
    }

    if (
      newQuantity ===
      currentQuantity
    ) {
      return;
    }

    try {
      await API.put(
        `/cart/${id}`,
        {
          quantity: newQuantity
        }
      );

      setCartItems((prev) =>
        prev.map((item) => {
          if (
            item.id === id ||
            item.service_id === id
          ) {
            return {
              ...item,
              quantity:
                newQuantity
            };
          }

          return item;
        })
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

    } catch (err) {
      console.error(
        "Update cart quantity error:",
        err
      );
    }
  };

  /* =========================================
     PRICE
  ========================================= */

  const getPrice = (item) => {
    return Number(
      item.price ??
      item.service_price ??
      item.service?.price ??
      0
    );
  };

  /* =========================================
     IMAGE
  ========================================= */

  const getServiceImage = (item) => {
    const image =
      item.images?.[0] ||
      item.image ||
      item.service_image ||
      item.service?.images?.[0] ||
      item.service?.image ||
      null;

    return getImageUrl(image);
  };

  /* =========================================
     TOTAL
  ========================================= */

  const total =
    cartItems.reduce(
      (sum, item) =>
        sum +
        getPrice(item) *
          Number(
            item.quantity || 1
          ),
      0
    );

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">
          🛒 Your Cart
        </h2>

        <p>
          Loading cart...
        </p>
      </div>
    );
  }

  /* =========================================
     NOT LOGGED IN
  ========================================= */

  if (!user) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">
          🛒 Your Cart
        </h2>

        <p className="empty-cart">
          Please login to view your cart.
        </p>
      </div>
    );
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="cart-container">

      <h2 className="cart-title">
        🛒 Your Cart
      </h2>

      {cartItems.length > 0 ? (
        <>
          {/* =================================
              CART LIST
          ================================= */}

          <div className="cart-list">

            {cartItems.map(
              (item) => {
                const price =
                  getPrice(item);

                const quantity =
                  Number(
                    item.quantity || 1
                  );

                const serviceId =
                  item.service_id ||
                  item.service?.id ||
                  item.id;

                const title =
                  item.title ||
                  item.service_title ||
                  item.service?.title ||
                  "Service";

                return (
                  <div
                    key={
                      item.id
                    }
                    className="cart-card"
                  >

                    {/* LEFT */}
                    <div className="cart-left">

                      <img
                        src={getServiceImage(
                          item
                        )}
                        alt={title}
                        className="cart-image"
                        onError={(e) => {
                          e.currentTarget.onerror =
                            null;

                          e.currentTarget.src =
                            "/placeholder.jpg";
                        }}
                      />

                      <div>

                        <h3 className="cart-item-title">
                          {title}
                        </h3>

                        <p className="cart-price">
                          ₹{price} per service
                        </p>

                        <p className="cart-subtotal">
                          Subtotal: ₹
                          {price *
                            quantity}
                        </p>

                      </div>

                    </div>

                    {/* RIGHT */}
                    <div className="cart-right">

                      {/* QUANTITY */}
                      <div className="quantity-box">

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              "dec"
                            )
                          }
                          disabled={
                            quantity <= 1
                          }
                        >
                          -
                        </button>

                        <span>
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              "inc"
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                      {/* REMOVE */}
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.id
                          )
                        }
                        className="remove-btn"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {/* =================================
              TOTAL
          ================================= */}

          <div className="cart-total-box">

            <h3>
              Total: ₹{total}
            </h3>

            <button
              type="button"
              className="checkout-btn"
              onClick={() =>
                navigate(
                  "/checkout"
                )
              }
            >
              Proceed to Checkout
            </button>

          </div>

        </>
      ) : (

        /* ===================================
           EMPTY CART
        =================================== */

        <p className="empty-cart">
          Your cart is empty.
        </p>

      )}

    </div>
  );
}