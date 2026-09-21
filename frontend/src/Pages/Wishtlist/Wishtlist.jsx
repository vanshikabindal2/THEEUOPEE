import React, { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { products } from "../../assets/assets";
import "./Wishtlist.css";

const Wishtlist = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    return savedWishlist;
  });

  // =========================
  // GET WISHLIST PRODUCTS
  // =========================
  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product._id)
  );

  // =========================
  // REMOVE FROM WISHLIST
  // =========================
  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(
      (item) => item !== id
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = (product) => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const selectedSize = product.sizes?.[0] || "";

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const existingProductIndex =
      savedCart.findIndex(
        (item) =>
          item.productId === product._id &&
          item.size === selectedSize
      );

    let updatedCart;

    if (existingProductIndex !== -1) {
      updatedCart = [...savedCart];

      updatedCart[existingProductIndex].quantity += 1;
    } else {
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: Array.isArray(product.image)
          ? product.image[0]
          : product.image,
        size: selectedSize,
        color: product.color,
        quantity: 1,
      };

      updatedCart = [
        ...savedCart,
        cartItem,
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    // Update navbar cart count
    window.dispatchEvent(
      new Event("cartUpdated")
    );

    alert(`${product.name} added to cart`);
  };

  return (
    <div className="wishlist-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="wishlist-header">

        <div>
          <span className="wishlist-small-title">
            YOUR COLLECTION
          </span>

          <h1>
            Wishlist
          </h1>

          <p>
            {wishlistProducts.length}{" "}
            {wishlistProducts.length === 1
              ? "item"
              : "items"}{" "}
            saved
          </p>
        </div>

        <Heart
          size={42}
          strokeWidth={1.2}
        />

      </div>

      {/* =========================
          EMPTY WISHLIST
      ========================= */}

      {wishlistProducts.length === 0 ? (

        <div className="empty-wishlist">

          <div className="empty-heart">
            <Heart
              size={55}
              strokeWidth={1.2}
            />
          </div>

          <h2>
            Your wishlist is empty
          </h2>

          <p>
            Save the pieces you love and
            find them here whenever you're
            ready.
          </p>

          <button
            onClick={() => navigate("/shirts")}
          >
            EXPLORE SHIRTS
            <ArrowRight size={18} />
          </button>

        </div>

      ) : (

        /* =========================
            WISHLIST PRODUCTS
        ========================= */

        <div className="wishlist-grid">

          {wishlistProducts.map(
            (product) => (

              <div
                className="wishlist-card"
                key={product._id}
              >

                {/* PRODUCT IMAGE */}

                <div
                  className="wishlist-image"
                  onClick={() =>
                    navigate(
                      `/product/${product._id}`
                    )
                  }
                >

                  <img
                    src={
                      Array.isArray(product.image)
                        ? product.image[0]
                        : product.image
                    }
                    alt={product.name}
                  />

                  {/* REMOVE */}

                  <button
                    className="remove-wishlist"
                    onClick={(e) => {
                      e.stopPropagation();

                      removeFromWishlist(
                        product._id
                      );
                    }}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

                {/* PRODUCT INFO */}

                <div className="wishlist-info">

                  <div className="wishlist-product-top">

                    <div>

                      <h3>
                        {product.name}
                      </h3>

                      <p>
                        {product.color}
                      </p>

                    </div>

                    <strong>
                      ₹{product.price}
                    </strong>

                  </div>

                  {/* ADD TO CART */}

                  <button
                    className="wishlist-cart-btn"
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    <span>
                      ADD TO CART
                    </span>

                    <ShoppingBag
                      size={18}
                      strokeWidth={1.5}
                    />
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
};

export default Wishtlist;