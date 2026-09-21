import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Navbarr/Nav";
import Footer from "./Pages/Footer/Footer.jsx";
import Home from "./Pages/Home/Home.jsx";
import New from "./Pages/New-Arrival/New.jsx";
import Category from "./Pages/ShopCategory/Category.jsx";
import Trending from "./Pages/Trending/Trending.jsx";
import Shirts from "./Pages/Shirts/Shirts.jsx";
import PopoverShirt from "./Pages/PopoverShirt/Popover.jsx";
import Joggers from "./Pages/Joggers/Joggers.jsx";
import ProductDetail from "./Pages/ProductDetail/ProductDetail.jsx";
import Cart from "./Pages/Cart/Cart.jsx";
import Wishtlist from "./Pages/Wishtlist/Wishtlist.jsx";
import Pant from "./Pages/Pant/Pant.jsx";
import Scroll from './components/Scroll/Scroll.js'
import Login from "./Pages/Auth/Login";
import OTP from "./Pages/Auth/OTP";
import Profile from "./Pages/Auth/Profile";
const App = () => {
  return (
    <>
      <Nav />
      <Scroll/>
<div className="page-contentts">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <New />
              <Category />
              <Trending />
            </>
          }
        />

        <Route path="/new-arrivals" element={<New />} />
        <Route path="/shop" element={<Category />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/shirts" element={<Shirts />} />
        <Route path="/popover-shirts" element={<PopoverShirt />} />
        <Route path="/joggers" element={<Joggers />} />
        <Route path="/product/:id" element={<ProductDetail />}/>
        <Route path="/product/:productId"element={<ProductDetail />}/>
          <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishtlist />} />
                    <Route path="/trouser" element={<Pant />} />
                   <Route path="/login" element={<Login />} />
                    <Route path="/verify-otp" element={<OTP />} />
                    <Route path="/complete-profile" element={<Profile/>} />

      </Routes>
</div>
      <Footer />
    </>
  );
};

export default App;