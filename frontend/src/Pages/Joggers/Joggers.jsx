
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";


import { products } from "../../assets/assets";

const Joggers = () => {
  const navigate = useNavigate();
const joggerProducts=products.filter((product)=>product.subCategory==='Jogger')
  return (
    <div className="shirts-page">

      {/* ================= PRODUCTS ================= */}
      <section className="shirts-products">

        {/* HEADING */}
        <div className="shirts-heading">
          <h1>Joggers</h1>
          <p>Explore our premium collection of Joggers</p>
        </div>

        {/* PRODUCTS GRID */}
        <div className="products-grid">

          {joggerProducts.map((product) => (

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

                <h3>{product.name}</h3>

                <div className="price-row">
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

export default Joggers;
