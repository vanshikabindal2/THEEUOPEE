import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  UserRound,
  Package,
  Heart,
  RotateCcw,
  Gift,
  Store,
  Star,
  ChevronRight,
  LogOut,
  MapPin
} from "lucide-react";

import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Profile response:", data);

        if (!response.ok || !data.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.dispatchEvent(new Event("authUpdated"));

          navigate("/login");
          return;
        }

        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authUpdated"));
    window.dispatchEvent(new Event("cartUpdated"));

    navigate("/");
  };

  const handleComingSoon = (name) => {
    alert(`${name} will be available soon.`);
  };

  if (loading) {
    return (
      <div className="account-loading">
        LOADING ACCOUNT...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="account-page">

      <div className="account-container">

        {/* ACCOUNT */}

        <section className="account-section">

          <div className="account-section-title">
            ACCOUNT
          </div>

          <button
            className="account-row"
            onClick={() => navigate("/personal-information")}
          >
            <div className="account-row-left">
              <UserRound size={20} strokeWidth={1.5} />

              <span>
                PERSONAL INFORMATION
              </span>
            </div>

            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
{/* saved address */}
<button
  className="account-row"
  onClick={() => navigate("/addresses")}
>
  <div className="account-row-left">
    <MapPin size={20} strokeWidth={1.5} />

    <span>
      SAVED ADDRESSES
    </span>
  </div>

  <ChevronRight size={20} strokeWidth={1.5} />
</button>
        </section>


        {/* SHOPPING */}

        <section className="account-section">

          <div className="account-section-title">
            SHOPPING
          </div>

          <button
            className="account-row"
            onClick={() => navigate("/orders")}
          >
            <div className="account-row-left">
              <Package size={20} strokeWidth={1.5} />

              <span>
                ORDERS
              </span>
            </div>

            <ChevronRight size={20} strokeWidth={1.5} />
          </button>


          <button
            className="account-row"
            onClick={() => navigate("/wishlist")}
          >
            <div className="account-row-left">
              <Heart size={20} strokeWidth={1.5} />

              <span>
                WISHLIST
              </span>
            </div>

            <ChevronRight size={20} strokeWidth={1.5} />
          </button>


          <button
            className="account-row"
            onClick={() => handleComingSoon("Refunds")}
          >
            <div className="account-row-left">
              <RotateCcw size={20} strokeWidth={1.5} />

              <span>
                REFUNDS
              </span>
            </div>

            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
          <button
            className="account-row"
            onClick={() => handleComingSoon("Gifting")}
          >
            <div className="account-row-left">
              <Gift size={20} strokeWidth={1.5} />

              <span>
                GIFTING
              </span>
            </div>
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
          {/* <button
            className="account-row"
            onClick={() => handleComingSoon("Find a Store")}
          >
            <div className="account-row-left">
              <Store size={20} strokeWidth={1.5} />

              <span>
                FIND A STORE
              </span>
            </div>

            <ChevronRight size={20} strokeWidth={1.5} />
          </button> */}


          <button
            className="account-row"
            onClick={() => handleComingSoon("Rate & Review")}
          >
            <div className="account-row-left">
              <Star size={20} strokeWidth={1.5} />

              <span>
                RATE & REVIEW
              </span>
            </div>

            <ChevronRight size={20} strokeWidth={1.5} />
          </button>

        </section>


        {/* BOTTOM */}

        <div className="account-bottom">

        

        

          <button
            className="account-logout"
            onClick={handleLogout}
          >
            <LogOut size={15} />
            LOGOUT
          </button>

        </div>

      </div>

    </div>
  );
};

export default Profile;