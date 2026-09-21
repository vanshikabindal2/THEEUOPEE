
import React from "react";
import "./New.css";
import { FiArrowUpRight, FiHeart } from "react-icons/fi";
import { products } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
const New = () => {
  const navigate=useNavigate();
  const newProducts = products.filter(
    (product) => product.isNew === true
  );
  const handleProductClick=(id)=>{
    navigate(`/product/${id}`);
  }

  return (
    <section className="new-arrivals">

      {/* ================= HEADING ================= */}
      <div className="new-arrivals-heading">
        <div>
          <p className="new-label">JUST IN</p>

          <h2>
            New <span>Arrivals</span>
          </h2>
        </div>

        {/* Optional View All */}
        {/* 
        <Link to="/collections" className="view-all">
          View All <FiArrowUpRight />
        </Link>
        */}
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="products-grid">

        {newProducts.map((product) => (
          <div className="product-card" key={product._id} onClick={() => handleProductClick(product._id)}>

            {/* IMAGE */}
            <div className="product-image">

              <img
                src={product.image?.[0]}
                alt={product.name}
              />

              {/* WISHLIST */}
              <button
                className="wishlist-btn" onClick={(e)=>e.stopPropagation()}
                aria-label={`Add ${product.name} to wishlist`}
              >
                <FiHeart />
              </button>

              {/* QUICK VIEW */}
              <div className="quick-view">
                <button onClick={handleProductClick(product._id)}>
                  Quick View <FiArrowUpRight />
                </button>
              </div>

            </div>

            {/* PRODUCT INFO */}
            <div className="product-info">

              <div>
                <p className="product-category">
                  {product.category}
                </p>

                <h3>{product.name}</h3>
              </div>

              <p className="product-price">
                ₹{product.price}
              </p>

            </div>

          </div>
        ))}

      </div>


    </section>
  );
};

export default New;