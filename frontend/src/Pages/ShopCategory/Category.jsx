
// import React, { useEffect, useRef, useState } from "react";
// import "./Category.css";

// const Category = () => {
//   const categories = [
//      {
//       title: "LINEN SHIRTS",
//       image:
//         "https://www.powerlook.in/cdn/shop/files/4_6cb4ff85-38d6-42fa-ac28-2f99900036bd.jpg?v=1783500860&width=810",
//     },
//     {
//       title: "JOGGERS",
//       image:
//         "https://assets.myntassets.com/w_412,q_50,,dpr_3,fl_progressive,f_webp/assets/images/2026/JANUARY/9/Nrh1F835_893e9deffb85407184e2c0a3105a4f94.jpg",
//     },
//     {
//       title: "POPOVER SHIRTS",
//       image:
//       "https://i.pinimg.com/736x/10/a1/9c/10a19cd43851ae6f364f2aef4d7f420c.jpg"
//     },
   
//     {
//       title: "LINEN TROUSERS",
//       image:
//         "https://i.pinimg.com/736x/44/80/43/448043b37b81c58490bff806aacba780.jpg",
//     },
   
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [cardsPerView, setCardsPerView] = useState(3);

//   const viewportRef = useRef(null);

//   /* =========================================
//      RESPONSIVE CARDS
//   ========================================= */

//   useEffect(() => {
//     const updateCards = () => {
//       if (window.innerWidth <= 600) {
//         setCardsPerView(1);
//       } else if (window.innerWidth <= 991) {
//         setCardsPerView(2);
//       } else {
//         setCardsPerView(3);
//       }
//     };

//     updateCards();

//     window.addEventListener("resize", updateCards);

//     return () => {
//       window.removeEventListener("resize", updateCards);
//     };
//   }, []);

//   /* =========================================
//      RESET INDEX ON RESPONSIVE CHANGE
//   ========================================= */

//   useEffect(() => {
//     const maxIndex = categories.length - cardsPerView;

//     if (currentIndex > maxIndex) {
//       setCurrentIndex(0);
//     }
//   }, [cardsPerView, currentIndex, categories.length]);

//   /* =========================================
//      NEXT SLIDE
//   ========================================= */

//   const nextSlide = () => {
//     setCurrentIndex((prev) => {
//       const maxIndex = categories.length - cardsPerView;

//       if (prev >= maxIndex) {
//         return 0;
//       }

//       return prev + 1;
//     });
//   };

//   /* =========================================
//      PREVIOUS SLIDE
//   ========================================= */

//   const previousSlide = () => {
//     setCurrentIndex((prev) => {
//       const maxIndex = categories.length - cardsPerView;

//       if (prev <= 0) {
//         return maxIndex;
//       }

//       return prev - 1;
//     });
//   };

//   /* =========================================
//      AUTO SLIDER
//   ========================================= */

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentIndex((prev) => {
//         const maxIndex = categories.length - cardsPerView;

//         if (prev >= maxIndex) {
//           return 0;
//         }

//         return prev + 1;
//       });
//     }, 3000);

//     return () => clearInterval(timer);
//   }, [cardsPerView, categories.length]);

//   /* =========================================
//      CARD WIDTH
//   ========================================= */

//   const cardWidth = 100 / cardsPerView;

//   return (
//     <div className="category-page">

//       {/* =========================================
//           HERO BANNER
//       ========================================= */}

//       <section className="hero-banner">
//         <img
//           src="https://cdn.shopify.com/s/files/1/0420/7073/7058/files/Shop_your_size_6474c313-d237-46ef-89b5-37d0efb94d55.jpg?v=1788332482"
//           alt="Shop your size - Up to 30% off"
//           className="hero-banner-image"
//         />
//       </section>

//       {/* =========================================
//           CATEGORY SLIDER
//       ========================================= */}

//       <section className="category-slider-section">

//         <div className="category-slider-wrapper">

//           {/* LEFT ARROW */}

//           <button
//             className="category-arrow category-arrow-left"
//             onClick={previousSlide}
//             aria-label="Previous"
//           >
//             ‹
//           </button>

//           {/* VIEWPORT */}

//           <div
//             className="category-slider-viewport"
//             ref={viewportRef}
//           >

//             <div
//               className="category-slider-track"
//               style={{
//                 transform: `translateX(-${
//                   currentIndex * cardWidth
//                 }%)`,
//               }}
//             >

//               {categories.map((item, index) => (
//                 <div
//                   className="category-card"
//                   key={index}
//                   style={{
//                     flex: `0 0 ${cardWidth}%`,
//                   }}
//                 >

//                   <img
//                     src={item.image}
//                     alt={item.title}
//                     className="category-image"
//                   />

//                   <div className="category-overlay"></div>

//                   <h2 className="category-title">
//                     {item.title}
//                   </h2>

//                 </div>
//               ))}

//             </div>

//           </div>

//           {/* RIGHT ARROW */}

//           <button
//             className="category-arrow category-arrow-right"
//             onClick={nextSlide}
//             aria-label="Next"
//           >
//             ›
//           </button>

//         </div>

//       </section>

//     </div>
//   );
// };

// export default Category;

import React, { useEffect, useRef, useState } from "react";
import "./Category.css";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "LINEN SHIRTS",
      image:
        "https://www.powerlook.in/cdn/shop/files/4_6cb4ff85-38d6-42fa-ac28-2f99900036bd.jpg?v=1783500860&width=810",
      path: "/shirts",
    },
    {
      title: "JOGGERS",
      image:
        "https://assets.myntassets.com/w_412,q_50,,dpr_3,fl_progressive,f_webp/assets/images/2026/JANUARY/9/Nrh1F835_893e9deffb85407184e2c0a3105a4f94.jpg",
      path: "/joggers",
    },
    {
      title: "POPOVER SHIRTS",
      image:
        "https://i.pinimg.com/736x/10/a1/9c/10a19cd43851ae6f364f2aef4d7f420c.jpg",
      path: "/popover-shirts",
    },
    {
      title: "LINEN TROUSERS",
      image:
        "https://i.pinimg.com/736x/44/80/43/448043b37b81c58490bff806aacba780.jpg",
      path: "/trousers",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  const viewportRef = useRef(null);

  /* =========================================
     RESPONSIVE CARDS
  ========================================= */

  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth <= 600) {
        setCardsPerView(1);
      } else if (window.innerWidth <= 991) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCards();

    window.addEventListener("resize", updateCards);

    return () => {
      window.removeEventListener("resize", updateCards);
    };
  }, []);

  /* =========================================
     RESET INDEX ON RESPONSIVE CHANGE
  ========================================= */

  useEffect(() => {
    const maxIndex = Math.max(
      0,
      categories.length - cardsPerView
    );

    if (currentIndex > maxIndex) {
      setCurrentIndex(0);
    }
  }, [cardsPerView, currentIndex, categories.length]);

  /* =========================================
     NEXT SLIDE
  ========================================= */

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(
        0,
        categories.length - cardsPerView
      );

      if (prev >= maxIndex) {
        return 0;
      }

      return prev + 1;
    });
  };

  /* =========================================
     PREVIOUS SLIDE
  ========================================= */

  const previousSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(
        0,
        categories.length - cardsPerView
      );

      if (prev <= 0) {
        return maxIndex;
      }

      return prev - 1;
    });
  };

  /* =========================================
     AUTO SLIDER
  ========================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(
          0,
          categories.length - cardsPerView
        );

        if (prev >= maxIndex) {
          return 0;
        }

        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [cardsPerView, categories.length]);

  /* =========================================
     CARD WIDTH
  ========================================= */

  const cardWidth = 100 / cardsPerView;

  /* =========================================
     RETURN
  ========================================= */

  return (
    <div className="category-page">

      {/* =========================================
          HERO BANNER
      ========================================= */}

      <section className="hero-banner">
        <img
          src="https://cdn.shopify.com/s/files/1/0420/7073/7058/files/Shop_your_size_6474c313-d237-46ef-89b5-37d0efb94d55.jpg?v=1788332482"
          alt="Shop your size - Up to 30% off"
          className="hero-banner-image"
        />
      </section>

      {/* =========================================
          CATEGORY SLIDER
      ========================================= */}

      <section className="category-slider-section">

        <div className="category-slider-wrapper">

          {/* LEFT ARROW */}

          <button
            className="category-arrow category-arrow-left"
            onClick={previousSlide}
            aria-label="Previous"
          >
            ‹
          </button>

          {/* VIEWPORT */}

          <div
            className="category-slider-viewport"
            ref={viewportRef}
          >

            <div
              className="category-slider-track"
              style={{
                transform: `translateX(-${
                  currentIndex * cardWidth
                }%)`,
              }}
            >

              {categories.map((item, index) => (
                <div
                  className="category-card"
                  key={index}
                  style={{
                    flex: `0 0 ${cardWidth}%`,
                  }}
                >

                  {/* IMAGE */}

                  <img
                    src={item.image}
                    alt={item.title}
                    className="category-image"
                  />

                  {/* OVERLAY */}

                  <div className="category-overlay"></div>

                  {/* CLICKABLE TITLE */}

                  <h2
                    className="category-title"
                    onClick={() => navigate(item.path)}
                  >
                    {item.title}
                  </h2>

                </div>
              ))}

            </div>

          </div>

          {/* RIGHT ARROW */}

          <button
            className="category-arrow category-arrow-right"
            onClick={nextSlide}
            aria-label="Next"
          >
            ›
          </button>

        </div>

      </section>

    </div>
  );
};

export default Category;