import React, { useEffect, useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { products } from "../../assets/assets";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET TOKEN
  // ==========================================
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH USER CART
  // ==========================================
  const fetchCart = async () => {
    const token = getToken();

    // User login nahi hai
    if (!token) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/cart/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Cart response:", data);

      if (data.success) {
        const backendItems = data.cart?.items || [];

        // ======================================
        // BACKEND ITEM + FRONTEND PRODUCT DATA
        // ======================================
        const formattedCart = backendItems
          .map((item) => {
            const product = products.find(
              (product) =>
                product._id.toString() ===
                item.productId.toString()
            );

            // Product frontend assets me nahi mila
            if (!product) {
              return null;
            }

            return {
              ...item,

              productId: item.productId,
              quantity: Number(item.quantity),
              size: item.size,
              color:
                item.color || product.color,

              name: product.name,
              price: Number(product.price),

              image: Array.isArray(product.image)
                ? product.image[0]
                : product.image || "",

              description:
                product.description || "",
            };
          })
          .filter(Boolean);

        setCart(formattedCart);
      } else {
        setCart([]);

        // Token invalid/expired
        if (
          data.message ===
          "Invalid or expired token"
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
        }
      }
    } catch (error) {
      console.error(
        "Fetch cart error:",
        error
      );

      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CART
  // ==========================================
  useEffect(() => {
    fetchCart();
  }, []);

  // ==========================================
  // REFRESH CART WHEN PRODUCT ADDED
  // ==========================================
  useEffect(() => {
    const handleCartUpdated = () => {
      fetchCart();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdated
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );
    };
  }, []);

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================
  const increaseQuantity = async (index) => {
    const item = cart[index];

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const newQuantity =
      Number(item.quantity) + 1;

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${encodeURIComponent(
          item.productId
        )}/${encodeURIComponent(item.size)}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Increase quantity:",
        data
      );

      if (data.success) {
        await fetchCart();

        window.dispatchEvent(
          new Event("cartUpdated")
        );
      } else {
        alert(
          data.message ||
            "Unable to update quantity"
        );
      }
    } catch (error) {
      console.error(
        "Increase quantity error:",
        error
      );

      alert(
        "Unable to update quantity"
      );
    }
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================
  const decreaseQuantity = async (index) => {
    const item = cart[index];

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const currentQuantity =
      Number(item.quantity);

    // Quantity 1 se neeche nahi jayegi
    if (currentQuantity <= 1) {
      return;
    }

    const newQuantity =
      currentQuantity - 1;

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${encodeURIComponent(
          item.productId
        )}/${encodeURIComponent(item.size)}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            quantity: newQuantity,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Decrease quantity:",
        data
      );

      if (data.success) {
        await fetchCart();

        window.dispatchEvent(
          new Event("cartUpdated")
        );
      } else {
        alert(
          data.message ||
            "Unable to update quantity"
        );
      }
    } catch (error) {
      console.error(
        "Decrease quantity error:",
        error
      );

      alert(
        "Unable to update quantity"
      );
    }
  };

  // ==========================================
  // REMOVE PRODUCT
  // ==========================================
  const removeItem = async (index) => {
    const item = cart[index];

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    console.log(
      "Removing item:",
      item
    );

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${encodeURIComponent(
          item.productId
        )}/${encodeURIComponent(item.size)}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "Remove response:",
        data
      );

      if (data.success) {
        await fetchCart();

        window.dispatchEvent(
          new Event("cartUpdated")
        );
      } else {
        alert(
          data.message ||
            "Unable to remove item"
        );
      }
    } catch (error) {
      console.error(
        "Remove item error:",
        error
      );

      alert(
        "Unable to remove item"
      );
    }
  };

  // ==========================================
  // TOTAL
  // ==========================================
  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  // ==========================================
  // TOTAL ITEMS
  // ==========================================
  const totalItems = cart.reduce(
    (total, item) =>
      total +
      Number(item.quantity || 0),
    0
  );

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">

          <div className="empty-cart">
            <h2>
              Loading cart...
            </h2>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* =====================================
            HEADING
        ===================================== */}

        <div className="cart-heading">

          <h1>
            YOUR CART
          </h1>

          <span>
            {totalItems}{" "}
            {totalItems === 1
              ? "ITEM"
              : "ITEMS"}
          </span>

        </div>

        {/* =====================================
            EMPTY CART
        ===================================== */}

        {cart.length === 0 ? (

          <div className="empty-cart">

            <h2>
              Your cart is empty
            </h2>

            <p>
              Looks like you haven't
              added anything yet.
            </p>

            <button
              onClick={() =>
                navigate("/shirts")
              }
            >
              CONTINUE SHOPPING

              <ArrowRight
                size={18}
              />
            </button>

          </div>

        ) : (

          <div className="cart-layout">

            {/* =================================
                LEFT - PRODUCTS
            ================================= */}

            <div className="cart-items">

              {cart.map(
                (item, index) => (

                  <div
                    className="cart-item"
                    key={`${item.productId}-${item.size}-${index}`}
                  >

                    {/* PRODUCT IMAGE */}

                    <div className="cart-item-image">

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                    </div>

                    {/* PRODUCT INFO */}

                    <div className="cart-item-info">

                      <div className="cart-item-top">

                        <div>

                          <h2>
                            {item.name}
                          </h2>

                          <p>
                            Color:{" "}
                            {item.color}
                          </p>

                          <p>
                            Size:{" "}
                            {item.size}
                          </p>

                        </div>

                        {/* REMOVE */}

                        <button
                          className="remove-btn"
                          onClick={() =>
                            removeItem(
                              index
                            )
                          }
                        >
                          <Trash2
                            size={18}
                          />
                        </button>

                      </div>

                      {/* BOTTOM */}

                      <div className="cart-item-bottom">

                        <span className="cart-price">

                          ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </span>

                        {/* QUANTITY */}

                        <div className="cart-quantity">

                          {/* MINUS */}

                          <button
                            onClick={() =>
                              decreaseQuantity(
                                index
                              )
                            }
                            disabled={
                              item.quantity <=
                              1
                            }
                          >
                            <Minus
                              size={15}
                            />
                          </button>

                          {/* NUMBER */}

                          <span>
                            {item.quantity}
                          </span>

                          {/* PLUS */}

                          <button
                            onClick={() =>
                              increaseQuantity(
                                index
                              )
                            }
                          >
                            <Plus
                              size={15}
                            />
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

            {/* =================================
                RIGHT - SUMMARY
            ================================= */}

            <div className="cart-summary">

              <h2>
                ORDER SUMMARY
              </h2>

              <div className="summary-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  Delivery
                </span>

                <strong>
                  FREE
                </strong>

              </div>

              <div className="summary-line"></div>

              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <button
                className="checkout-btn"
              >
                PROCEED TO CHECKOUT

                <ArrowRight
                  size={18}
                />

              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default Cart;