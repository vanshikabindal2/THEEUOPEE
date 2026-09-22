import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingBag,
  UserRound,
  Menu,
  X,
  Heart,
  Clock3,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./Nav.css";
import logo from "../../assets/logo.png";
import { products } from "../../assets/assets";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  // =========================================
  // CART COUNT
  // =========================================
  const [cartCount, setCartCount] = useState(0);

  // =========================================
  // WISHLIST COUNT
  // =========================================
  const [wishlistCount, setWishlistCount] = useState(0);

  // =========================================
  // GET CART COUNT
  // =========================================
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");

      // User login nahi hai
      if (!token) {
        setCartCount(0);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/cart/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // =========================================
      // CHECK RESPONSE TYPE
      // =========================================
      const contentType =
        response.headers.get("content-type");

      if (
        !contentType ||
        !contentType.includes("application/json")
      ) {
        const text = await response.text();

        console.error(
          "Cart API returned non-JSON response:",
          text.substring(0, 200)
        );

        setCartCount(0);
        return;
      }

      const data = await response.json();

      console.log("Navbar cart:", data);

      // =========================================
      // BACKEND ERROR
      // =========================================
      if (!response.ok || !data.success) {
        console.error(
          "Cart fetch failed:",
          data.message
        );

        setCartCount(0);
        return;
      }

      // =========================================
      // CART ITEMS
      // =========================================
      const items = data.cart?.items || [];

      // Total quantity calculate
      const totalQuantity = items.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      setCartCount(totalQuantity);
    } catch (error) {
      console.error(
        "Cart count error:",
        error
      );

      setCartCount(0);
    }
  };

  // =========================================
  // GET WISHLIST COUNT
  // =========================================
  const fetchWishlistCount = () => {
    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem("wishlist")
        ) || [];

      setWishlistCount(
        savedWishlist.length
      );

      console.log(
        "Navbar wishlist count:",
        savedWishlist.length
      );
    } catch (error) {
      console.error(
        "Wishlist count error:",
        error
      );

      setWishlistCount(0);
    }
  };

  // =========================================
  // CART + WISHLIST EFFECT
  // =========================================
  useEffect(() => {
    // Page load
    fetchCartCount();
    fetchWishlistCount();

    // =========================================
    // CART UPDATE
    // =========================================
    const updateCartCount = () => {
      fetchCartCount();
    };

    // =========================================
    // AUTH UPDATE
    // =========================================
    const updateAuthState = () => {
      fetchCartCount();
    };

    // =========================================
    // WISHLIST UPDATE
    // =========================================
    const updateWishlistCount = () => {
      fetchWishlistCount();
    };

    // =========================================
    // EVENTS
    // =========================================
    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    window.addEventListener(
      "authUpdated",
      updateAuthState
    );

    window.addEventListener(
      "wishlistUpdated",
      updateWishlistCount
    );

    // =========================================
    // CLEANUP
    // =========================================
    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );

      window.removeEventListener(
        "authUpdated",
        updateAuthState
      );

      window.removeEventListener(
        "wishlistUpdated",
        updateWishlistCount
      );
    };
  }, []);

  // =========================================
  // TRENDING SEARCHES
  // =========================================
  const trendingSearches = [
    "Shirts",
    "Joggers",
    "Popover Shirts",
    "Casual Shirts",
    "Denim Shirts",
    "Formal Shirts",
  ];

  // =========================================
  // TRENDING PRODUCTS
  // =========================================
  const trendingProducts = products.slice(0, 3);

  // =========================================
  // SEARCH FILTER
  // =========================================
  const filteredProducts = searchText.trim()
    ? products.filter((product) =>
        product.name
          ?.toLowerCase()
          .includes(
            searchText.toLowerCase()
          )
      )
    : trendingProducts;

  // =========================================
  // SEARCH OPEN
  // =========================================
  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  // =========================================
  // SEARCH CLOSE
  // =========================================
  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchText("");
  };

  // =========================================
  // TRENDING SEARCH CLICK
  // =========================================
  const handleTrendingSearch = (item) => {
    setSearchText(item);
  };

  return (
    <>
      {/* =========================================
          NAVBAR
      ========================================= */}
      <header className="navbar">
        <div className="navbar-inner">

          {/* =========================================
              MOBILE MENU BUTTON
          ========================================= */}
          <button
            className="mobile-menu-btn"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

          {/* =========================================
              LOGO
          ========================================= */}
          <Link
            to="/"
            className="navbar-logo"
          >
            <img
              src={logo}
              alt="The Bear House"
            />
          </Link>

          {/* =========================================
              DESKTOP NAV
          ========================================= */}
          <nav className="desktop-nav">

            <Link to="/">
              Home
            </Link>

            <Link to="/shirts">
              Shirts
            </Link>

            <Link to="/popover-shirts">
              Popover shirts
            </Link>

            <Link to="/joggers">
              Joggers
            </Link>

            <Link to="/trouser">
              Trousers
            </Link>

          </nav>

          {/* =========================================
              NAV ACTIONS
          ========================================= */}
          <div className="navbar-actions">

            {/* =========================================
                SEARCH
            ========================================= */}
            <button
              className="nav-search"
              onClick={handleSearchClick}
              aria-label="Open search"
            >
              <Search
                size={20}
                strokeWidth={1.7}
              />

              <span>
                Search products...
              </span>
            </button>

            {/* =========================================
                CART
            ========================================= */}
            <Link
              to="/cart"
              className="nav-icon cart-icon"
              aria-label="Cart"
            >
              <ShoppingBag
                size={21}
                strokeWidth={1.7}
              />

              {cartCount > 0 && (
                <span className="cart-count">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* =========================================
                WISHLIST
            ========================================= */}
            <Link
              to="/wishlist"
              className="nav-icon cart-icon"
              aria-label="Wishlist"
            >
              <Heart
                size={21}
                strokeWidth={1.7}
              />

              {wishlistCount > 0 && (
                <span className="cart-count">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* =========================================
                ACCOUNT
            ========================================= */}
            <Link
              to="/profile"
              className="nav-icon"
              aria-label="Account"
            >
              <UserRound
                size={21}
                strokeWidth={1.7}
              />
            </Link>

          </div>
        </div>

        {/* =========================================
            MOBILE MENU
        ========================================= */}
        <div
          className={`mobile-menu ${
            menuOpen ? "active" : ""
          }`}
        >
          <nav>

            <Link
              to="/"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Home
            </Link>

            <Link
              to="/shirts"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Shirts
            </Link>

            <Link
              to="/popover-shirts"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Popover Shirts
            </Link>

            <Link
              to="/joggers"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Joggers
            </Link>

            <Link
              to="/trouser"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Trousers
            </Link>

          </nav>
        </div>
      </header>

      {/* =========================================
          SEARCH BACKDROP
      ========================================= */}
      {searchOpen && (
        <div
          className="search-backdrop"
          onClick={handleCloseSearch}
        />
      )}

      {/* =========================================
          SEARCH DROPDOWN
      ========================================= */}
      {searchOpen && (
        <div className="search-dropdown">

          {/* =========================================
              SEARCH TOP
          ========================================= */}
          <div className="search-dropdown-top">

            <div className="search-main-input">

              <Search
                size={21}
                strokeWidth={1.7}
              />

              <input
                type="text"
                value={searchText}
                placeholder="Search products..."
                autoFocus
                onChange={(e) =>
                  setSearchText(
                    e.target.value
                  )
                }
              />

              {searchText && (
                <button
                  className="search-input-clear"
                  onClick={() =>
                    setSearchText("")
                  }
                >
                  <X size={19} />
                </button>
              )}

            </div>

            {/* =========================================
                CLOSE SEARCH
            ========================================= */}
            <button
              className="search-close-btn"
              onClick={handleCloseSearch}
              aria-label="Close search"
            >
              <X size={23} />
            </button>

          </div>

          {/* =========================================
              SEARCH CONTENT
          ========================================= */}
          <div className="search-content">

            {/* =========================================
                LEFT SIDE
            ========================================= */}
            <div className="search-left">

              {/* =========================================
                  RECENT SEARCH
              ========================================= */}
              <div className="search-section">

                <h3>
                  Recent Search
                </h3>

                <button
                  className="recent-search"
                  onClick={() =>
                    setSearchText("Shirts")
                  }
                >
                  <Clock3 size={17} />

                  <span>
                    Shirts
                  </span>
                </button>

              </div>

              {/* =========================================
                  TRENDING SEARCHES
              ========================================= */}
              <div className="search-section trending-section">

                <h3>
                  Trending Searches
                </h3>

                <div className="trending-searches">

                  {trendingSearches.map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() =>
                          handleTrendingSearch(
                            item
                          )
                        }
                      >
                        <span>
                          {item}
                        </span>

                        <ArrowRight
                          size={15}
                        />
                      </button>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* =========================================
                RIGHT SIDE
            ========================================= */}
            <div className="search-right">

              <div className="search-right-heading">

                <h3>
                  {searchText
                    ? "Search Results"
                    : "Trending Products"}
                </h3>

                {!searchText && (
                  <span>
                    MEN'S WEAR
                  </span>
                )}

              </div>

              {/* =========================================
                  PRODUCTS
              ========================================= */}
              <div className="search-products">

                {filteredProducts
                  .slice(0, 3)
                  .map((product) => (

                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="search-product"
                      onClick={() =>
                        setSearchOpen(false)
                      }
                    >

                      <div className="search-product-image">

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

                      <div className="search-product-info">

                        <p className="search-product-name">
                          {product.name}
                        </p>

                        <div className="search-product-bottom">

                          <p className="search-product-price">
                            ₹{product.price}
                          </p>

                          <span className="product-arrow">
                            <ArrowRight
                              size={16}
                            />
                          </span>

                        </div>

                      </div>

                    </Link>

                  ))}

                {/* =========================================
                    NO RESULT
                ========================================= */}
                {filteredProducts.length === 0 && (
                  <div className="no-search-result">
                    No products found
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

export default Nav;