import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import "./Home.css";

const slides = [
  {
    image:
      "https://template.canva.com/EAG12xCdnEI/2/0/1600w-G3V9VgY31W4.jpg",
  },
  {
    image:
      "https://media.craftyartapp.com/uploadedFiles/thumb_file/3a96346d7a3bc66918131a98ca732493b316a7151674533164.jpg",
  },
  {
    image:
      "https://kbcfashion.com/cdn/shop/collections/Mens_Banner_jpg.jpg?crop=center&height=1200&v=1781257502&width=1200",
  },
  
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
    <section className="hero-slider">

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${
            index === current ? "active" : ""
          }`}
        >
          <img
            src={slide.image}
            alt={`Fashion slide ${index + 1}`}
            className="hero-image"
          />
        </div>
      ))}

      {/* Previous */}
      <button
        className="slider-arrow slider-prev"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <FiChevronLeft />
      </button>

      {/* Next */}
      <button
        className="slider-arrow slider-next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <FiChevronRight />
      </button>

      {/* Dots */}
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={index === current ? "active" : ""}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
{/* 50% off */}
<section className="offer-ticker">
  <div className="offer-track">
    <span>50% OFF ON SELECTED STYLES</span>
    <span>✦</span>
    <span>SHOP NOW</span>
    <span>✦</span>
    <span>FREE SHIPPING ON ORDERS ABOVE ₹1999</span>
    <span>✦</span>

    {/* Repeat for continuous movement */}
    <span>50% OFF ON SELECTED STYLES</span>
    <span>✦</span>
    <span>SHOP NOW</span>
    <span>✦</span>
    <span>FREE SHIPPING ON ORDERS ABOVE ₹1999</span>
    <span>✦</span>
  </div>
</section>
</>


  );
};

export default HeroSlider;