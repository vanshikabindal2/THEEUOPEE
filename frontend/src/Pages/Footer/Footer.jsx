
import React from "react";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import logo from "../../assets/logo.png"
import Fb from "../FooterBanner/Fb";
import "./Footer.css";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="fashion-footer">
<Fb/>
      {/* =====================================================
          TOP FASHION HERO
      ===================================================== */}
   

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}
      <section className="footer-main">

        {/* BRAND */}
        <div className="footer-brand">

          <h3 className="footer-logo">
            <img src={logo} alt="" />
          </h3>

          <p>
            Contemporary clothing designed for effortless
            everyday style. Discover pieces made to move
            with you.
          </p>

          {/* SOCIAL ICONS */}
          <div className="footer-socials">

            {/* Instagram */}
            <a
              href="#"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  className="social-fill"
                />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="#"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24">
                <path
                  className="social-fill"
                  d="M14.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V10H9v3h2.6v8h2.9z"
                />
              </svg>
            </a>

            {/* X */}
            <a
              href="#"
              aria-label="X"
            >
              <svg viewBox="0 0 24 24">
                <path
                  className="social-fill"
                  d="M18.9 2H22l-6.8 7.8L23.2 22h-6.4l-5-6.5L6.1 22H3l7.3-8.4L2.5 2H9l4.5 5.9L18.9 2zm-1.1 17.8h1.7L7.9 4.1H6.1l11.7 15.7z"
                />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="#"
              aria-label="YouTube"
            >
              <svg viewBox="0 0 24 24">
                <path
                  className="social-fill"
                  d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.5v-7l6.2 3.5-6.2 3.5z"
                />
              </svg>
            </a>

          </div>

        </div>


        {/* SHOP */}
        {/* SHOP */}
<div className="footer-column">

  <h4>SHOP</h4>

  <Link to="/shirts">Shirts</Link>
  <Link to="/joggers">Joggers</Link>
  <Link to="/popover-shirts">Popovers Shirts</Link>
  <Link to="/trouser">Trousers</Link>

</div>

        {/* HELP */}
        <div className="footer-column">

          <h4>HELP</h4>

          <a href="#contact">Contact Us</a>
          <a href="#shipping">Shipping & Delivery</a>
          <a href="#returns">Returns & Exchange</a>
          <a href="#faq">FAQs</a>
          <a href="#size">Size Guide</a>

        </div>


        {/* COMPANY */}
        <div className="footer-column">

          <h4>COMPANY</h4>

          <a href="#about">About Us</a>
          <a href="#story">Our Story</a>
          <a href="#careers">Careers</a>
          <a href="#stores">Our Stores</a>
          <a href="#privacy">Privacy Policy</a>

        </div>


        {/* NEWSLETTER */}
        <div className="footer-newsletter">

          <h4>JOIN THE LIST</h4>

          <p>
            Get first access to new drops,
            exclusive offers and style edits.
          </p>

          <form className="newsletter-form">

            <Mail size={18} />

            <input
              type="email"
              placeholder="Your email address"
            />

            <button type="submit">
              <ArrowUpRight size={20} />
            </button>

          </form>

          <span className="newsletter-note">
            No spam. Just good style.
          </span>

        </div>

      </section>


      {/* =====================================================
          CONTACT
      ===================================================== */}
      <section className="footer-contact">

        <div className="footer-contact-item">
          <MapPin size={18} />
          <span>India</span>
        </div>

        <div className="footer-contact-divider"></div>

        <div className="footer-contact-item">
          <Phone size={18} />
          <span>+91 00000 00000</span>
        </div>

        <div className="footer-contact-divider"></div>

        <div className="footer-contact-item">
          <Mail size={18} />
          <span>hello@linea.com</span>
        </div>

      </section>


      {/* =====================================================
          BOTTOM FOOTER
      ===================================================== */}
      <section className="footer-bottom">

        <p>
          © 2026 LINÉA. All rights reserved.
        </p>

        <div className="footer-bottom-links">
          <a href="#terms">Terms</a>
          <a href="#privacy">Privacy</a>
          <a href="#cookies">Cookies</a>
        </div>

       

      </section>

    </footer>
  );
};

export default Footer;

