
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import "./Shirts.css";

import { products } from "../../assets/assets";

const Shirts = () => {
  const navigate = useNavigate();
  const shirtProducts=products.filter((product)=>product.subCategory==='Shirts')
  
  return (
    <div className="shirts-page">

      {/* ================= PRODUCTS ================= */}
      <section className="shirts-products">

        {/* HEADING */}
        <div className="shirts-heading">
          <h1>Shirts</h1>
          <p>Explore our premium collection of shirts</p>
        </div>

        {/* PRODUCTS GRID */}
        <div className="products-grid">

          {shirtProducts.map((product) => (

            <div
              className="product-card"
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
            >

              {/* ================= IMAGE ================= */}
              <div className="product-image">

                <img
                  src={product.image[0]}
                  alt={product.name}
                />

                {/* HEART */}
                <button
                  type="button"
                  className="quick-heart"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={19}
                    strokeWidth={1.6}
                  />
                </button>

                {/* SHOPPING BAG */}
                <button
                  type="button"
                  className="quick-cart"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  aria-label="Add to cart"
                >
                  <ShoppingBag
                    size={19}
                    strokeWidth={1.6}
                  />
                </button>

              </div>

              {/* ================= PRODUCT INFO ================= */}
             <div className="product-info">

  <div className="product-info-row">
    <h3>{product.name}</h3>

    <span className="product-price">
      ₹{product.price}
    </span>
  </div>

             </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
};

export default Shirts;
