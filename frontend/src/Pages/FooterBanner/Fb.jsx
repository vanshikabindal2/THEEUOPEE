import React from 'react'
import './Fb.css'
import {
  ArrowUpRight,
  
} from "lucide-react";
import remove from '../../assets/remove.png'
const Fb = () => {
  return (
<section className="footerr-fashion-hero">

  {/* BACKGROUND IMAGE */}
  <img
    className="footerr-background-image"
    src={remove}
    alt="Fashion collection"
  />

  {/* IMAGE OVERLAY */}
  <div className="footerr-image-overlay"></div>

  {/* EXPLORE BUTTON */}
  {/* <a href="#shop" className="footerr-explore-btn">
    <span>Explore Collection</span>
    <ArrowUpRight size={20} strokeWidth={1.8} />
  </a> */}

</section>
  )
}

export default Fb
