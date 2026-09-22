import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  VenusAndMars,
  Check,
} from "lucide-react";

import "./PersonalInfo.css";

const PersonalInfo = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      // Token nahi hai
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
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        console.log("Personal Info response:", data);

        // Backend authentication failed
        if (!response.ok || !data.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        // User data set
        setUser(data.user);

        // Local storage update
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } catch (error) {
        console.error(
          "Personal Information Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Loading
  if (loading) {
    return (
      <div className="personal-loading">
        LOADING...
      </div>
    );
  }

  // User data nahi mila
  if (!user) {
    return null;
  }

  return (
    <div className="personal-page">
      <div className="personal-container">

        {/* BACK BUTTON */}
        <button
          className="personal-back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span>BACK</span>
        </button>

        {/* HEADING */}
        <div className="personal-heading">
          <span>ACCOUNT</span>
          <h1>PERSONAL INFORMATION</h1>
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="personal-list">

          {/* NAME */}
          <div className="personal-item">

            <div className="personal-icon">
              <UserRound size={20} />
            </div>

            <div className="personal-content">
              <span>FULL NAME</span>

              <p>
                {user.name || "Not available"}
              </p>
            </div>

          </div>

          {/* EMAIL */}
          <div className="personal-item">

            <div className="personal-icon">
              <Mail size={20} />
            </div>

            <div className="personal-content">
              <span>EMAIL ADDRESS</span>

              <p>
                {user.email || "Not available"}
              </p>
            </div>

          </div>

          {/* PHONE */}
          <div className="personal-item">

            <div className="personal-icon">
              <Phone size={20} />
            </div>

            <div className="personal-content">
              <span>PHONE NUMBER</span>

              <p>
                +{user.phone}
              </p>
            </div>

            <div className="phone-verified">
              <Check size={14} />
              VERIFIED
            </div>

          </div>

          {/* GENDER */}
          <div className="personal-item">

            <div className="personal-icon">
              <VenusAndMars size={20} />
            </div>

            <div className="personal-content">
              <span>GENDER</span>

              <p>
                {user.gender || "Not selected"}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default PersonalInfo;