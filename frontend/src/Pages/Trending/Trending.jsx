import React, { useLayoutEffect, useState } from "react";
import { Heart, ShoppingBag, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import "./Trending.css";

const products = [
  {
    id: 1,
    name: "Linen Relaxed Shirt",
    category: "Men",
    price: "₹1,899",
    oldPrice: "₹2,499",
    image:
      "https://img0.junaroad.com/uiproducts/21933841/pri_175_p-1747333978.jpg",
    tag: "TRENDING",
  },
  {
    id: 2,
    name: "Classic Linen Shirt",
    category: "Men",
    price: "₹2,199",
    oldPrice: "₹2,899",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    tag: "BESTSELLER",
  },
  {
    id: 3,
    name: "Soft Linen Overshirt",
    category: "Women",
    price: "₹2,099",
    oldPrice: "₹2,699",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
    tag: "NEW",
  },
  {
    id: 4,
    name: "Premium Linen Fit",
    category: "Men",
    price: "₹2,399",
    oldPrice: "₹3,099",
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85",
    tag: "LIMITED",
  },
  {
    id: 5,
    name: "Everyday Linen Shirt",
    category: "Women",
    price: "₹1,799",
    oldPrice: "₹2,299",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPm35dAlELcVi2q4k5N3Z0Cc9th_FmAseENFGMajzHcuzoj1fAFW_5ufs&s=10",
    tag: "New",
  },
  {
    id: 6,
    name: "Linen Resort Shirt",
    category: "Men",
    price: "₹2,499",
    oldPrice: "₹3,299",
    image:
      "https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&w=900&q=85",
    tag: "TRENDING",
  },
  {
    id: 7,
    name: "Minimal Linen Shirt",
    category: "Women",
    price: "₹1,999",
    oldPrice: "₹2,599",
    image:
      "https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=900&q=85",
    tag: "NEW",
  },
  {
    id: 8,
    name: "Signature Linen Shirt",
    category: "Men",
    price: "₹2,299",
    oldPrice: "₹2,999",
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=900&q=85",
    tag: "POPULAR",
  },
];

export default function Trending() {
  const [filter, setFilter] = useState("All");

  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((item) => item.category === filter);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".trend-kicker", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".trend-title span", {
        y: 100,
        opacity: 0,
        duration: 1,
        delay: 0.1,
        stagger: 0.12,
        ease: "power4.out",
      });

      gsap.from(".trend-description", {
        y: 25,
        opacity: 0,
        duration: 0.8,
        delay: 0.35,
        ease: "power3.out",
      });

      gsap.from(".trend-filter button", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.45,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from(".product-card", {
        y: 70,
        opacity: 0,
        duration: 0.9,
        delay: 0.55,
        stagger: 0.1,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    gsap.fromTo(
      ".product-card",
      {
        y: 35,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [filter]);

  return (
    <section className="trending-page">

      {/* TOP MARQUEE */}
      <div className="trend-marquee">
        <div className="marquee-track">
          <span>PURE LINEN</span>
          <i>✦</i>
          <span>NEW SEASON</span>
          <i>✦</i>
          <span>EVERYDAY LUXURY</span>
          <i>✦</i>
          <span>PURE LINEN</span>
          <i>✦</i>
          <span>NEW SEASON</span>
          <i>✦</i>
          <span>EVERYDAY LUXURY</span>
          <i>✦</i>
        </div>
      </div>

      {/* HERO */}
      <div className="trending-container">

        <div className="trending-top">

          <div className="trend-kicker">
            <span></span>
            CURATED FOR YOU
          </div>

          <h1 className="trend-title">
            <span>THE Trending</span>
          </h1>

          <p className="trend-description">
            Lightweight textures, effortless silhouettes and timeless
            colours — discover the pieces defining this season.
          </p>

        </div>

        {/* FILTER */}
        <div className="trend-toolbar">

          <div className="trend-filter">
            {["All", "Women", "Men"].map((item) => (
              <button
                key={item}
                className={filter === item ? "active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="product-count">
            <span>01</span>
            — {filteredProducts.length.toString().padStart(2, "0")} PIECES
          </div>

        </div>

        {/* PRODUCTS */}
        <div className="product-grid">

          {filteredProducts.map((product, index) => (

            <article className="product-card" key={product.id}>

              <div className="product-image">

                <img
                  src={product.image}
                  alt={product.name}
                />

                <div className="image-overlay"></div>

                <span className="product-tag">
                  {product.tag}
                </span>

                <button className="wishlist">
                  <Heart size={19} strokeWidth={1.5} />
                </button>

                <button className="quick-shop">
                  QUICK SHOP
                  <ArrowUpRight size={17} />
                </button>

                <div className="product-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

              </div>

              <div className="product-info">

                <div>
                  <p className="product-category">
                    {product.category}
                  </p>

                  <h3>{product.name}</h3>
                </div>

                <div className="product-price">

                  <strong>{product.price}</strong>

                  <del>{product.oldPrice}</del>

                </div>

              </div>

            </article>

          ))}

        </div>

        {/* BOTTOM FEATURE */}
        <div className="linen-feature">

          <div className="feature-left">
            <span>THE FABRIC</span>
            <h2>
              Made to feel
              <em> effortless.</em>
            </h2>
          </div>

          <div className="feature-right">
            <p>
              Naturally breathable. Soft on skin. Designed for
              movement. Our linen collection brings together
              comfort and contemporary silhouettes.
            </p>

            <button>
              EXPLORE COLLECTION
              <ArrowUpRight size={18} />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}