import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Star,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";

import { products } from "../../assets/assets";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* =========================
     FIND PRODUCT
  ========================= */

  const product = products.find(
    (item) => item._id === id
  );

  /* =========================
     STATES
  ========================= */

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || ""
  );

  const [quantity, setQuantity] = useState(1);

  /* =========================
     WISHLIST STATE
  ========================= */

  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (!product?._id) {
      return false;
    }

    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem("wishlist")
        ) || [];

      return savedWishlist.includes(
        product._id
      );
    } catch (error) {
      console.error(
        "Wishlist read error:",
        error
      );

      return false;
    }
  });

  const [openSection, setOpenSection] =
    useState(null);

  const [isAddingToCart, setIsAddingToCart] =
    useState(false);

  /* =========================
     PRODUCT NOT FOUND
  ========================= */

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>

        <button
          onClick={() => navigate("/shop")}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  /* =========================
     QUANTITY
  ========================= */

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  /* =========================
     ADD TO CART
  ========================= */

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (!product.stock || product.stock <= 0) {
      alert("Product is out of stock");
      return;
    }

    if (quantity > product.stock) {
      alert(
        `Only ${product.stock} items are available`
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    console.log(
      "Logged-in token:",
      token
    );

    if (!token) {
      alert(
        "Please login first to add products to cart"
      );

      navigate("/login");
      return;
    }

    try {
      setIsAddingToCart(true);

      const response = await fetch(
        "https://internship-e-commerce-backend.vercel.app/api/cart/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId: product._id,
            quantity: quantity,
            size: selectedSize,
            color: product.color,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Add to cart response:",
        data
      );

      if (data.success) {
        alert(
          `${product.name} added to cart`
        );

        window.dispatchEvent(
          new Event("cartUpdated")
        );

        setQuantity(1);
      } else {
        if (
          data.message
            ?.toLowerCase()
            .includes("token")
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          alert(
            "Your login session has expired. Please login again."
          );

          navigate("/login");
          return;
        }

        alert(
          data.message ||
            "Unable to add product to cart"
        );
      }
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      alert(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  /* =========================
     ACCORDION
  ========================= */

  const toggleSection = (section) => {
    setOpenSection(
      openSection === section
        ? null
        : section
    );
  };

  /* =========================
     PRODUCT DETAILS
  ========================= */

  const getClosure = () => {
    if (product.closure) {
      return product.closure;
    }

    if (
      product.subCategory === "Jogger"
    ) {
      return "Drawstring";
    }

    if (
      product.subCategory === "pant"
    ) {
      return "Button & Zip";
    }

    return "Button";
  };

  const getSleeves = () => {
    if (product.sleeves) {
      return product.sleeves;
    }

    if (
      product.subCategory === "Shirts" ||
      product.subCategory === "popover"
    ) {
      return "Full Sleeves";
    }

    return "N/A";
  };

  const getCollar = () => {
    if (product.collar) {
      return product.collar;
    }

    if (
      product.subCategory === "Shirts" ||
      product.subCategory === "popover"
    ) {
      return "Spread Collar";
    }

    return "N/A";
  };

  /* =========================
     WISHLIST
  ========================= */

  const handleWishlist = () => {
    if (!product?._id) {
      console.log(
        "Product ID not found"
      );
      return;
    }

    let savedWishlist = [];

    try {
      savedWishlist =
        JSON.parse(
          localStorage.getItem("wishlist")
        ) || [];
    } catch (error) {
      console.error(
        "Wishlist parse error:",
        error
      );

      savedWishlist = [];
    }

    let updatedWishlist;

    /* =========================
       REMOVE
    ========================= */

    if (
      savedWishlist.includes(
        product._id
      )
    ) {
      updatedWishlist =
        savedWishlist.filter(
          (item) =>
            item !== product._id
        );

      setIsWishlisted(false);

      console.log(
        "Removed from wishlist:",
        product._id
      );
    }

    /* =========================
       ADD
    ========================= */

    else {
      updatedWishlist = [
        ...savedWishlist,
        product._id,
      ];

      setIsWishlisted(true);

      console.log(
        "Added to wishlist:",
        product._id
      );
    }

    /* =========================
       SAVE
    ========================= */

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    console.log(
      "Wishlist saved:",
      JSON.stringify(
        updatedWishlist
      )
    );

    /* =========================
       UPDATE OTHER COMPONENTS
    ========================= */

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  /* =========================
     JSX
  ========================= */

  return (
    <div className="product-detail-page">

      {/* =========================
          BACK BUTTON
      ========================= */}

      <button
        className="product-back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

      {/* =========================
          MAIN PRODUCT SECTION
      ========================= */}

      <div className="product-detail-container">

        {/* =========================
            LEFT IMAGE
        ========================= */}

        <div className="product-image-section">

          <div className="main-product-image">

            <img
              src={
                Array.isArray(
                  product.image
                )
                  ? product.image[0]
                  : product.image
              }
              alt={product.name}
            />

          </div>

        </div>

        {/* =========================
            RIGHT PRODUCT INFORMATION
        ========================= */}

        <div className="product-detail-info">

          {/* =========================
              TITLE + WISHLIST
          ========================= */}

          <div className="product-title-row">

            <div>

              <h1>
                {product.name}
              </h1>

              <p className="product-category">
                {product.subCategory}
              </p>

            </div>

            {/* WISHLIST BUTTON */}

            <button
              type="button"
              className={`wishlist-button ${
                isWishlisted
                  ? "active"
                  : ""
              }`}
              onClick={handleWishlist}
              aria-label={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >

              <Heart
                size={23}
                fill={
                  isWishlisted
                    ? "currentColor"
                    : "none"
                }
              />

            </button>

          </div>

          {/* =========================
              PRICE
          ========================= */}

          <div className="product-price">

            ₹
            {Number(
              product.price
            ).toLocaleString("en-IN")}

          </div>

          {/* =========================
              DESCRIPTION
          ========================= */}

          <p className="short-description">

            {product.description ||
              "Premium quality product."}

          </p>

          {/* =========================
              RATING
          ========================= */}

          <div className="product-rating">

            <div className="stars">

              <Star
                size={15}
                fill="currentColor"
              />

              <Star
                size={15}
                fill="currentColor"
              />

              <Star
                size={15}
                fill="currentColor"
              />

              <Star
                size={15}
                fill="currentColor"
              />

              <Star size={15} />

            </div>

            <span>4.5</span>

            <span className="rating-divider">
              |
            </span>

            <span>
              18 reviews
            </span>

          </div>

          {/* =========================
              SIZE
          ========================= */}

          <div className="size-section">

            <div className="size-heading">

              <span>
                Select Size
              </span>

              <button
                type="button"
                className="size-guide"
              >
                SIZE GUIDE
              </button>

            </div>

            <div className="size-options">

              {product.sizes?.map(
                (size) => (

                  <button
                    type="button"
                    key={size}
                    className={`size-option ${
                      selectedSize === size
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedSize(
                        size
                      )
                    }
                  >
                    {size}
                  </button>

                )
              )}

            </div>

          </div>

          {/* =========================
              DELIVERY
          ========================= */}

          <div className="delivery-message">

            FREE 1-2 day delivery on
            5k+ pincodes

          </div>

          {/* =========================
              QUANTITY
          ========================= */}

          <div className="quantity-section">

            <span className="quantity-title">
              QUANTITY
            </span>

            <div className="quantity-box">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
              >
                <Minus size={15} />
              </button>

              <span>
                {quantity}
              </span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  quantity >=
                  product.stock
                }
              >
                <Plus size={15} />
              </button>

            </div>

          </div>

          {/* =========================
              ADD TO CART
          ========================= */}

          <button
            type="button"
            className="add-to-cart-button"
            onClick={
              handleAddToCart
            }
            disabled={
              isAddingToCart ||
              product.stock <= 0
            }
          >

            <span>

              {isAddingToCart
                ? "ADDING..."
                : product.stock <= 0
                ? "OUT OF STOCK"
                : "ADD TO CART"}

            </span>

            {!isAddingToCart &&
              product.stock > 0 && (
                <ShoppingBag
                  size={19}
                />
              )}

          </button>

          {/* =========================
              STOCK
          ========================= */}

          <p className="stock-text">

            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of stock"}

          </p>

          {/* =========================
              PRODUCT INFORMATION
          ========================= */}

          <div className="product-info-sections">

            {/* DESCRIPTION */}

            <div className="info-accordion">

              <button
                type="button"
                className="info-header"
                onClick={() =>
                  toggleSection(
                    "description"
                  )
                }
              >

                <span>
                  DESCRIPTION & DETAILS
                </span>

                <span className="accordion-icon">

                  {openSection ===
                  "description"
                    ? "−"
                    : "+"}

                </span>

              </button>

              {openSection ===
                "description" && (

                <div className="info-content">

                  <div className="detail-row">

                    <span>
                      Description
                    </span>

                    <span>
                      {product.description ||
                        "Premium quality product."}
                    </span>

                  </div>

                  <div className="detail-row">

                    <span>
                      Fit
                    </span>

                    <span>
                      {product.fit ||
                        "Regular Fit"}
                    </span>

                  </div>

                  <div className="detail-row">

                    <span>
                      Fabric
                    </span>

                    <span>
                      {product.fabric ||
                        "Premium Fabric"}
                    </span>

                  </div>

                  <div className="detail-row">

                    <span>
                      Pattern
                    </span>

                    <span>
                      {product.pattern ||
                        "Solid"}
                    </span>

                  </div>

                  <div className="detail-row">

                    <span>
                      Closure
                    </span>

                    <span>
                      {getClosure()}
                    </span>

                  </div>

                  <div className="detail-row">

                    <span>
                      Sleeves
                    </span>

                    <span>
                      {getSleeves()}
                    </span>

                  </div>

                  <div className="detail-row">

                    <span>
                      Pocket
                    </span>

                    <span>
                      {product.pocket ||
                        "Yes"}
                    </span>

                  </div>

                  <div className="detail-row">

                    <span>
                      Collar
                    </span>

                    <span>
                      {getCollar()}
                    </span>

                  </div>

                  <div className="detail-row">

                    <span>
                      Colour
                    </span>

                    <span>
                      {product.color ||
                        "Classic"}
                    </span>

                  </div>

                </div>
              )}

            </div>

            {/* MATERIAL & CARE */}

            <div className="info-accordion">

              <button
                type="button"
                className="info-header"
                onClick={() =>
                  toggleSection(
                    "material"
                  )
                }
              >

                <span>
                  MATERIAL & CARE
                </span>

                <span className="accordion-icon">

                  {openSection ===
                  "material"
                    ? "−"
                    : "+"}

                </span>

              </button>

              {openSection ===
                "material" && (

                <div className="info-content">

                  <div className="care-section">

                    <p>
                      <strong>
                        Material
                      </strong>
                    </p>

                    <p>
                      {product.fabric ||
                        "Premium quality fabric"}
                    </p>

                    <p>
                      Made with carefully
                      selected materials
                      for comfort,
                      durability and
                      everyday wear.
                    </p>

                    <br />

                    <p>
                      <strong>
                        Care Instructions
                      </strong>
                    </p>

                    <p>
                      • Machine wash
                      according to care
                      instructions.
                    </p>

                    <p>
                      • Do not bleach.
                    </p>

                    <p>
                      • Iron on low or
                      medium heat.
                    </p>

                    <p>
                      • Wash dark colours
                      separately.
                    </p>

                    <p>
                      • Do not tumble dry
                      at high temperature.
                    </p>

                  </div>

                </div>
              )}

            </div>

            {/* RETURN & EXCHANGE */}

            <div className="info-accordion">

              <button
                type="button"
                className="info-header"
                onClick={() =>
                  toggleSection(
                    "return"
                  )
                }
              >

                <span>
                  RETURN & EXCHANGE
                </span>

                <span className="accordion-icon">

                  {openSection ===
                  "return"
                    ? "−"
                    : "+"}

                </span>

              </button>

              {openSection ===
                "return" && (

                <div className="info-content">

                  <p>
                    We offer easy
                    returns and
                    exchanges on
                    eligible products
                    according to our
                    return policy.
                  </p>

                  <p>
                    The product should
                    be unused and should
                    have all original
                    tags and packaging
                    intact.
                  </p>

                  <p>
                    Products that are
                    damaged, washed or
                    used may not be
                    eligible for return
                    or exchange.
                  </p>

                  <p>
                    For more information,
                    please refer to our
                    return and exchange
                    policy.
                  </p>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetail;